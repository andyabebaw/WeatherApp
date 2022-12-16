var currentWeather;
var forecastData;

var currentLocation = "Chicago";
var long = 41.87;
var lat = 87.62;


var cards = $(".card").map(function () {
  return this;
});

$(function () {
 
  setTodaysDateTemp()
  setWeatherForecast(long, lat)
  getWeather(long, lat);
});

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
  dateEl.text(currentLocation + " " + getDate(0));
}

function setWeatherForecast(long, lat) {
 var weatherURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + long + "&appid=ee5bac9a1e0c0e170057e26226f0931a&units=imperial";
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastData = data;
      setForecastData(long,lat);
      console.log(data);
    })
}

function setForecastData(long, lat) {


  $(".card").children(".weatherDate")
  for (var i = 0; i < cards.length; i++) {
    var weatherDate = cards.children(".weatherDate");
    weatherDate[i].innerHTML = (getDate(i + 1));

    var day = forecastData.daily[i];

    var icon = cards.children(".emoji");
    var iconurl = "http://openweathermap.org/img/w/" + day.weather[0].icon + ".png";
    icon.attr('src', iconurl);
    console.log(iconurl)
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
      setTodaysWindSpeed();
      setTodaysHumidity();
      console.log(data);
    })
}





