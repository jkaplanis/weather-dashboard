// API key for open weather
var APIKey = "c6e0e3fb545da16f65b665f11bf65c91";

// Pull recent search history from local storage and add it to array
var citySearchHistory = JSON.parse(localStorage.getItem("searchHistory"));

// If nothing saved in local storage, create an array to hold searches
if (citySearchHistory === null) {
  citySearchHistory = [];
}

// Save current date to a variable
var date = moment().format("MMM Do YYYY");

// Listen for click on the search button
// Push search value to array, set item to local storage, and call render weather function
$("#search-button").on("click", function (event) {
  event.preventDefault();
  var cityName = $("#input-city").val();
  updateLocalStorage(cityName);
  updateSearchHistory();
});

// Listen for click on the search button
// Push search value to array, set item to local storage, and call render weather function
$("#clear-button").on("click", function (event) {
  event.preventDefault();
  $("#search-history").empty();
  localStorage.clear();
});

// Listen for click on item in search history and call function render weather
$("#search-history").on("click", function (event) {
  event.preventDefault();
  var cityName = $(event.target).text();
  updateLocalStorage(cityName);
  updateSearchHistory();
});

// If array is not empty, prepend search history to search history div and call render weather
function updateSearchHistory() {
  if (citySearchHistory.length > 0) {
    $("#search-history").empty();
    for (var i = 0; i < citySearchHistory.length; i++) {
      var cityHistoryDisplay = citySearchHistory[i];
      $("#search-history").prepend(
        $("<button>").attr("class", "btn btn-light").text(cityHistoryDisplay)
      );
    }
    var cityName = citySearchHistory[citySearchHistory.length - 1];
    renderWeather(cityName);
  }
}

//if search exists in local storage, remove it and re-add
function updateLocalStorage(cityName) {
  var lowerCaseCityArray = citySearchHistory.map(city => {
    return city.toLowerCase();
  });
  var position = lowerCaseCityArray.indexOf(cityName.toLowerCase());
  if (position !== -1) {
    citySearchHistory.splice(position, 1);
  }
  citySearchHistory.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(citySearchHistory));
}

// Here we run our AJAX call to the OpenWeatherMap API
function renderWeather(cityName) {
  var weatherQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;
  $.ajax({
    url: weatherQueryURL,
    method: "GET"
  })
    // Stored return object in response
    .then(function (response) {
      // assign values from API call to variables
      var cityDisplay = response.name;
      var iconCode = response.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var humidity = response.main.humidity;
      var windSpeed = response.wind.speed;
      var temp = response.main.temp;
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      $("#input-city").val("");

      // query url for UV Index
      var uvQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey;

      // second AJAX call to get UV Index using lat/lon
      $.ajax({
        url: uvQueryURL,
        method: "GET"
      })
        // We store all of the retrieved data inside of an object called "uvResponse"
        .then(function (uvResponse) {
          var uvIndex = uvResponse.value;
          $("#current-uvIndex").text(uvIndex);

          // Assign color based on uv Index severity
          if (uvIndex <= 4) {
            $("#current-uvIndex").attr("class", "bg-success"); //green
          } else if (uvIndex >= 4.01 && uvIndex <= 7) {
            $("#current-uvIndex").attr("class", "bg-warning"); //yellow
          } else {
            $("#current-uvIndex").attr("class", "bg-danger"); //red
          }
        });

      // add text to weather fields
      $("#weather-day").text(cityDisplay + " - " + date);
      $("#weather-icon").attr("src", iconUrl);
      $("#current-temp").text(temp.toFixed(1));
      $("#current-humidity").text(humidity);
      $("#current-wind").text(windSpeed.toFixed(1));
    });

  // query url for the 5 day forecast
  var fiveDayQueryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;

  $.ajax({
    url: fiveDayQueryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "fiveDayResponse"
    .then(function (fiveDayResponse) {
      // for loop to add dates to 5 day forecast
      for (var i = 1; i < 6; i++) {
        var futureDate = moment().add(i, "days").format("MM/DD/YYYY");
        $("#date" + i).text(futureDate);
      }
      // for loop to add weather details for 5 day forecast
      // fiveDayResponse returns weather for every 3 hours, incrementing by 8
      // ensures we pull data from a new day each iteration.
      for (var i = 1; i < 34; i += 8) {
        var dayIcon = fiveDayResponse.list[i].weather[0].icon;
        var dayTemp = fiveDayResponse.list[i].main.temp;
        var dayHumidity = fiveDayResponse.list[i].main.humidity;
        $("#icon" + i).attr(
          "src",
          "http://openweathermap.org/img/w/" + dayIcon + ".png"
        );
        $("#day" + i + "-temp").text(dayTemp);
        $("#day" + i + "-humidity").text(dayHumidity);
      }
      // Allow weather data to be displayed
      $("#weather-div").attr("class", "col-8 d-block");
    });
}

updateSearchHistory();
