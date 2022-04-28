const apiKey = "&units=imperial&appid=cd996b1bf4e8105324a410b704c9079d";
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");

var getForecast = function(city) {
    // format the github api url
    var cityName = url + city + apiKey;
  
    // make a request to the url
    fetch(cityName).then(function(response) {
      response.json().then(function(data) {
        console.log(data);
      });
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element 
    var cityName = cityInputEl.value.trim();

    if(cityName) {
        getForecast(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city's name!");
    }

    console.log(event);
};

// const getData = async () => {
//     var city = document.getElementById('city').value;
//     let url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&cnt=16&appid=cd996b1bf4e8105324a410b704c9079d";
//     try {
//         let response = await fetch(url);
//         let data = await response.json();
//         let lat = data.coord.lat;
//         let lon = data.coord.lon;
//     } catch (error) {
//         console.log(error);
//     }
// };

// const getDataForSevenDays = async (lat, lon) => {
//     let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=cd996b1bf4e8105324a410b704c9079d`;
//     try {
//         let response = await fetch(url);
//         let data = await response.json();
//         console.log("data", data);
//     } catch (error) {
//         console.log(error);
//     }
// };


// getForecast("austin");

userFormEl.addEventListener("submit", formSubmitHandler);