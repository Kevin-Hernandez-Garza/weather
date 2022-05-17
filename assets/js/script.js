const apiKey = "&units=imperial&appid=cd996b1bf4e8105324a410b704c9079d";
const oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=";
const weatherCall = "https://api.openweathermap.org/data/2.5/weather?q=";
const imageSrc = "<img class='icon' src='http://openweathermap.org/img/wn/";
const imageAtt = "@2x.png' alt='Weather icon'>";

// forecast for today
function today(response, cityName) {
    // formats the date 
    var currentDay = moment().format("MM/DD/YY");
    // dynamically inserts the current weather data and creating the HTML elements
    var currentData = "<h2>"+ cityName + " (" + currentDay + ")" + imageSrc + response.current.weather[0].icon + imageAtt + "</h2>" +  
                    "<p>Temperature: " + response.current.temp + " F</p>" +
                    "<p>Wind Speed: " + response.current.wind_speed + "mph</p>" +
                    "<p>Humidity: " + response.current.humidity + "%</p>" +
                    "<p>UVI: <span class='uvi'>" + response.current.uvi + "<span> </p>";
    $(".today").append(currentData);
};

// displays the next 5 days of forecast
function forecast(data) {

    $(".subtitle").append("<h3>5 Day Forecast</h3>");
    var count = 0;

    $(".five-daily").each(function() {
        // parsing the dates using Moment.js
        var dailyForecast = moment().add(count + 1, 'days').format("(MM/DD/YY)");

        // creating the 5 day forecast layout
        var daily = "<p class='date'>" + dailyForecast + "</p>" + 
        "<img class='icon' src='http://openweathermap.org/img/wn/" + data.daily[count].weather[0].icon + imageAtt +
        "<p>Temp: " + data.daily[count].temp.day + " F</p>" +
        "<p>Wind: " + data.daily[count].wind_speed + " mph</p>" +
        "<p>Humidity: " + data.daily[count].humidity + "</p>";

        // here he append the variable created 
        $(this).append(daily);

        // iterating the daily forecast count
        count++;
      });
};


// targets the search form to get the city name and then getting the lon & lat coordinates to fetch the one call API endpoint 
function search() {
    var textInput = document.querySelector("#city-search").value;
    var oneCallApi = weatherCall + textInput + apiKey;
    var cityName = "";

    fetch(oneCallApi)

        .then(function(response) {
            return response.json();

        })

        .then(function(response) {
            // retrieves the longitude and latitude of the weather call to fetch the oneCall api request of that city. resulting in getting a more in-depth forecast data
            var longitude = response.coord.lon;
            var latitude = response.coord.lat;
            cityName = response.name;

            return fetch(
                oneCall + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&" + apiKey
            )
        })

        .then(function(response) {
            return response.json();
        })

        .then(function(response) {
            clearContent();
            forecast(response);
            updatedSearchHistory();
            today(response, cityName);
        })

        // always have to implement a catch method for best practice
        .catch(function(error) {
            alert("Please enter a valid city name")
        })
};


// using localStorage to get the search history
var localStorageHistory = JSON.parse(localStorage.getItem("historyList")) || [];

function searchHistory() {
    // getting the array of searched cities
    var history = JSON.parse(localStorage.getItem("historyList")) || [];
    var localStorageList = document.querySelector(".local-history");

    // for loop which iterates over the historyList and displays it 
    for (var i=0; i < history.length; i++) {
        var historyCityBtn = document.createElement("button");
        historyCityBtn.classList.add("btn");
        historyCityBtn.setAttribute("id", history[i])
        historyCityBtn.innerHTML = history[i];
        localStorageList.appendChild(historyCityBtn);

    };
};

function updatedSearchHistory() {
    var localStorageList = document.querySelector(".local-history");
    var pastSearch = document.querySelector("#city-search").value;
        if (localStorageHistory.indexOf(pastSearch) == -1) {
            localStorageHistory.push(pastSearch)
            localStorage.setItem("historyList", JSON.stringify(localStorageHistory));
        }

    localStorageList.innerHTML = "";

    searchHistory();
    
};

// clearing content for every search request
function clearContent() {
    $(".five-daily").empty();
    document.querySelector(".today").innerHTML = "";
    document.querySelector(".subtitle").innerHTML = "";
};

// onClick event listener
$(".local-history").on("click", "button", function() {
    var pastSearch = $(this).attr("id");
    document.querySelector("#city-search").value = pastSearch;
    document.querySelector(".search-btn").click();
});

// displays a list of the search city history (calling the function)
searchHistory();