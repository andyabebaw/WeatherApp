var currentWeather;
var forecastData;
var lat;
var long;

var currentLocation = "Seattle";
var recentSearches = JSON.parse(localStorage.getItem("recent"))
var error = $("#error")

var cards = $(".card").map(function () {
  return this;
});

$(function () {
  //loads search history
  addSearchButtons()
  init();
});

//loads page data
function init() {
  if (recentSearches === null) {
    recentSearches = [];
  }
  setTodaysDateTemp()
  getCoordFromCityName(currentLocation, true);
}

//gets date based on how many days in the future it is
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

//gets the day of the week for a specefic day
function getDayOfWeek(daysinFuture){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var today = new Date();
  var newDay = tomorrow = new Date(today)

  newDay.setDate(tomorrow.getDate() + daysinFuture)
  console.log(newDay.getDay())
  return weekday[newDay.getDay()];
}

//gets long form of todays date
function getTodaysDateLongForm() {
  var today = new Date();
  var day = today.toLocaleDateString('en-US', {
    weekday: 'long',
  });
  var mm = today.toLocaleDateString('en-US', {
    month: 'long',
  });
  var dd = today.getDate();

  today = day + ', ' + mm + ' ' + dd;
  return today;
}

//sets Todays date and temp
function setTodaysDateTemp() {
  var locationEl = $("#location");
  var dateEl = $("#date");
  locationEl.text(currentLocation.toUpperCase());
  dateEl.text(getTodaysDateLongForm());
}

//gets 5 day forecast 
function setWeatherForecast() {
  var weatherURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + long + "&appid=ee5bac9a1e0c0e170057e26226f0931a&units=imperial";
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      forecastData = data;
      setForecastData();
    })
}

//sets 5 day forecast 
function setForecastData() {

  $(".card").children(".weatherDate")
  for (var i = 0; i < cards.length; i++) {

    var weekday = cards.children(".weekday");
    weekday[i].innerHTML = (getDayOfWeek(i+1).toUpperCase());

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

//sets todays temp
function setTodaysTemp() {
  var temp = $("#todaysTemp");
  temp.text(currentWeather.main.temp);
}

//sets todays icon
function setTodaysIcon() {
  var icon = $("#todaysEmoji");
  var iconURL = "http://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png";
  icon.attr("src", iconURL);
}

//sets todays wind speed
function setTodaysWindSpeed() {
  var wind = $("#todaysWind");
  wind.text((currentWeather.wind.speed));
}

//sets todays humidity
function setTodaysHumidity() {
  var humidity = $("#todaysHumidity");
  humidity.text((currentWeather.main.humidity));
}

//gets and sets todays weathers
function getWeather() {
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

//gets and sets coordinates from city name
function getCoordFromCityName(cityName, isInit) {
  var weatherURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=ee5bac9a1e0c0e170057e26226f0931a"
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length != 0) {
        lat = data[0].lat
        long = data[0].lon
        setTodaysDateTemp();
        setWeatherForecast(long, lat);
        getWeather(long, lat);
        if (!isInit) {
          submitCity();
        }
      } else {
        error.show();
      }
    })
}

//adds new city to search history
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

//adds new search history button after search activated
function updateSearchButtons() {
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

//adds search history buttons on page load
function addSearchButtons() {
  if (recentSearches != null && recentSearches.length > 0) {
    console.log("here2")
    for (var i = 0; i < recentSearches.length; i++) (function (i) {
      var button = $('<button/>',
        {
          text: recentSearches[i],
          class: "button",
        });
      button.click(function () {
        currentLocation = button.text();
        init()
      });

      $(".history").prepend(button)
    })(i);

  }
}

// searches using input value
$("#search").click(function () {
  currentLocation = document.getElementById('input').value;
  getCoordFromCityName(currentLocation, false);
});

//allows enter key to be able to submit input
$("#input").on('keyup', function (e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    currentLocation = document.getElementById('input').value;
    getCoordFromCityName(currentLocation, false);
  }
});

//removes search history
$("#clear").click(function () {
  for (var i = 0; i < recentSearches.length; i++) {
    $(".history .button")[0].remove();
  }
  recentSearches = [];
  localStorage.removeItem("recent");
});

//hides error button after user starts to input new city
$("#input").focus(function(){
  error.hide()
});
