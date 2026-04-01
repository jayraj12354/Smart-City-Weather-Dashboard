const API_KEY = "ee4596ec30de2dfcd65f46f503cd00eb";

const locationField = document.getElementById("locationField");
const triggerSearch = document.getElementById("triggerSearch");


const statusLoading = document.getElementById("status-loading");

const statusError = document.getElementById("status-error");


const weatherResults = document.getElementById("weather-results");

const displayCity = document.getElementById("display-city");
const displayTemp = document.getElementById("display-temp");

const displayDesc = document.getElementById("display-desc");

triggerSearch.addEventListener("click", function() {
  if (locationField.value !== "") {
    fetchWeatherData(locationField.value);
  }
});

function fetchWeatherData(city) {
  statusLoading.classList.remove("is-hidden");

//   console.log(city)
  weatherResults.classList.add("is-hidden");
  statusError.classList.add("is-hidden");

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric")
    .then(function(res) {

      if (res.ok === false) {
        throw new Error("Location not found");
      }
    //   console.log(res)
      return res.json();
    })
    .then(function(data) {
    //   console.log(data)  

      displayCity.textContent = data.name;
      displayTemp.textContent = Math.round(data.main.temp) + "°C";
      displayDesc.textContent = data.weather[0].main;

      statusLoading.classList.add("is-hidden");
      weatherResults.classList.remove("is-hidden");
    })
    .catch(function(err) {
        // console.log(err)
      statusLoading.classList.add("is-hidden");
      statusError.textContent = err.message;
      statusError.classList.remove("is-hidden");
    });
}