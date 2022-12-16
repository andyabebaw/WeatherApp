var currentLocation = "Chicago";
var cards = $(".card").map(function() {
  return this;
});




$(function () {
  setDates();
  setTodaysWeather()
});

function getDate(daysinFuture) {
  
  var today = new Date();
  var newDay = tomorrow = new Date(today)
  newDay.setDate(tomorrow.getDate() + daysinFuture)
  var dd = newDay.getDate();
  
  var mm = newDay.getMonth()+1; 
  var yyyy = newDay.getFullYear();

  var date = mm+'/'+dd+'/'+yyyy;
  return date;
}



function setDates(){
  var dateEl = $("#locationDate");
  dateEl.text(currentLocation + " " + getDate(0));

  $(".card").children(".weatherDate")
  // console.log($(".card").children(".weatherDate"))
  // console.log(cards.children(".weatherDate"))
  for (var i = 0; i <cards.length; i++){
    var weatherDate = cards.children(".weatherDate");
    weatherDate[i].innerHTML = (getDate(i+1));
    
    var temp= cards.children(".temp");
    temp[i].innerHTML = "Temp: " + i;

    var wind= cards.children(".wind");
    wind[i].innerHTML = "Wind: " + i;

    var humidity= cards.children(".humidity");
    humidity[i].innerHTML = "Humidity: " + i;
  }
  
}

function setTodaysWeather(){
  var weatherJSON = getWeather(41.87,87.62)
  $("#todaysTemp").text()
  $("#todaysWind").text()
  $("#todaysHumidity").text()
}


function getWeather(long, lat){
  var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=ee5bac9a1e0c0e170057e26226f0931a"
  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)})
}






