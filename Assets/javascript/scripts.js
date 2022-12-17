var currentWeather;
var forecastData;
var lat;
var long;

var currentLocation = "Atlanta";
var recentSearches = JSON.parse(localStorage.getItem("recent"))

var cards = $(".card").map(function () {
  return this;
});

$(function () {
  addSearchButtons()
  init();
});

function init() {
  if(recentSearches === null){
    recentSearches = [];
  }
  setTodaysDateTemp()
  getCoordFromCityName(currentLocation, true);
}

function getDate(daysinFuture) {

  var today = new Date();
  var newDay = tomorrow = new Date(today)

  newDay.setDate(tomorrow.getDate() + daysinFuture)

  var dd = newDay.getDate();
  var mm = newDay.getMonth() + 1;
  var yyyy = newDay.getFullYear();

  var date = mm + '/' + dd + '/' + yyyy;

  return date;
}

function setTodaysDateTemp() {
  var dateEl = $("#locationDate");
  dateEl.text(currentLocation.toUpperCase() + " " + getDate(0));
}

function setWeatherForecast(long, lat) {
  var weatherURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + long + "&appid=ee5bac9a1e0c0e170057e26226f0931a&units=imperial";
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastData = data;
      setForecastData(long, lat);
    })
}

function setForecastData(long, lat) {


  $(".card").children(".weatherDate")
  for (var i = 0; i < cards.length; i++) {
    var weatherDate = cards.children(".weatherDate");
    weatherDate[i].innerHTML = (getDate(i + 1));

    var day = forecastData.daily[i];

    var icon = cards.children(".emoji");
    var iconURL = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
    icon[i].src = iconURL;

    var temp = cards.children(".temp");
    temp[i].innerHTML = "Temp: " + day.temp.day + " °F";

    var wind = cards.children(".wind");
    wind[i].innerHTML = "Wind: " + day.wind_speed + " MPH";

    var humidity = cards.children(".humidity");
    humidity[i].innerHTML = "Humidity: " + day.humidity + "%";
  }

}

function setTodaysTemp() {
  var temp = $("#todaysTemp");
  temp.text(currentWeather.main.temp);
}

function setTodaysIcon(){
  var icon = $("#todaysEmoji");
  console.log(currentWeather);
  var iconURL = "http://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png";
  icon.attr("src", iconURL);
}

function setTodaysWindSpeed() {
  var wind = $("#todaysWind");
  wind.text((currentWeather.wind.speed));
}

function setTodaysHumidity() {
  var humidity = $("#todaysHumidity");
  humidity.text((currentWeather.main.humidity));
}

function getWeather(long, lat) {
  var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=ee5bac9a1e0c0e170057e26226f0931a&units=imperial";
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeather = data;
      setTodaysTemp();
      setTodaysIcon();
      setTodaysWindSpeed();
      setTodaysHumidity();
    })
}

function getCoordFromCityName(cityName, isInit) {
  var weatherURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=ee5bac9a1e0c0e170057e26226f0931a"
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if(data.length != 0){
        lat = data[0].lat
        long = data[0].lon
        setTodaysDateTemp();
        setWeatherForecast(long, lat);
        getWeather(long, lat);
        if(!isInit){
          submitCity();
        }
      }
    })
}

function submitCity() {
  if (!recentSearches.includes(currentLocation.toUpperCase())) {
    recentSearches = recentSearches || [];
    if (recentSearches.length === 10) {
      recentSearches.shift()
      $(".history .button")[recentSearches.length].remove();
    }

    recentSearches.push(currentLocation.toUpperCase());
    localStorage.setItem("recent", JSON.stringify(recentSearches))
    updateSearchButtons();
  }
}

function updateSearchButtons() {
  console.log("here1")
  var button = $('<button/>',
    {
      text: recentSearches[recentSearches.length - 1],
      class: "button",
    });
    button.click(function () {
      currentLocation = button.text();
      init()
    });
  $(".history").prepend(button)

}

var curr;

function addSearchButtons() {
  if (recentSearches != null && recentSearches.length > 0) {
    console.log("here2")
    for ( var i = 0; i < recentSearches.length; i++ ) (function(i){ 
      var button = $('<button/>',
          {
            text: recentSearches[i],
            class: "button",
          });
          curr = button[0].innerHTML
          button.click(function () {
            currentLocation = button.text();
            init()
          });
        
        $(".history").prepend(button)
    })(i);

  }
}

$("#search").click(function () {
  currentLocation = document.getElementById('input').value
  getCoordFromCityName(currentLocation, false);
});

$("#clear").click(function () {
  for(var i = 0; i < recentSearches.length; i++){
    $(".history .button")[0].remove();
  }
  recentSearches = []
  localStorage.removeItem("recent");
});
