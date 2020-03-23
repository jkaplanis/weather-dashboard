/* When the search is entered
Then the city name and the current date appear to the right in an H1 along with an icon
The following items are below this in a p tag: 
temperature in F
humidity percentage
wind speed in mph
The UV index which should be color coded based on severity (favorable, moderate, severe)
    
The 5 day forcast appears below todays info, this will have
"5 day forecast:" in an h2 and each boc will contain the date, 
an icon to represent the weather, the temp, and the humidity

The seach city will also be saved below the search box available to be clicked later

When the page is reloaded
Then all of the saved searches will appear and the last search will be presented*/
var date = moment().format("MMM Do YYYY");

var APIKey = "c6e0e3fb545da16f65b665f11bf65c91";

// Listening for the click on the search button to initiate the AJAX call to the API
$("#search-button").on("click", function (event) {
    event.preventDefault()
    var cityName = $("#input-city").val();
    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            // assign values from API call to variables
            var cityDisplay = response.name;
            var iconCode = response.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            var humidity = response.main.humidity;
            var windSpeed = (response.wind.speed);
            var temp = (response.main.temp);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $("#input-city").val('');

            var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

            $.ajax({
                url: uvQueryURL,
                method: "GET"
            })
                // We store all of the retrieved data inside of an object called "uvResponse"
                .then(function (uvResponse) {
                    var uvIndex = uvResponse.value
                    $("#current-uvIndex").text(uvIndex);

                    // Assign color based on uv Index severity
                    if (uvIndex <= 4) {
                        $("#current-uvIndex").attr("class", "bg-success") //green
                    }
                    else if (uvIndex >= 4.01 && uvIndex <= 7) {
                        $("#current-uvIndex").attr("class", "bg-warning") //yellow
                    }
                    else {
                        $("#current-uvIndex").attr("class", "bg-danger") //red
                    }
                });

            // add text to weather fields
            $("#weather-day").text(cityDisplay + " - " + date);
            $("#weather-icon").attr("src", iconUrl);
            $("#current-temp").text(temp.toFixed(1));
            $("#current-humidity").text(humidity);
            $("#current-wind").text(windSpeed.toFixed(1));
            $("#search-history").prepend($("<button>").attr("class", "btn btn-light").text(cityDisplay));
        });
        // query url for the 5 day forecast
        var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + APIKey;
        
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "uvResponse"
        .then(function (fiveDayResponse) {
            // for loop to add dates to 5 day forecast
            for (var i = 1; i < 6; i++){
                var futureDate = moment().add(i, 'days').format("MM/DD/YYYY");
                $("#date" + i).text(futureDate);
            };
            // for loop to add weather details for 5 day forecast
            // fiveDayResponse returns weather for every 3 hours, incrementing by 8
            // ensures we pull data from a new day each iteration. 
            for (var i = 4; i < 37; i += 8) {
                var dayIcon = fiveDayResponse.list[i].weather[0].icon;
                var dayTemp = fiveDayResponse.list[i].main.temp;
                var dayHumidity = fiveDayResponse.list[i].main.humidity;
                $("#icon" + i).attr("src", "http://openweathermap.org/img/w/" + dayIcon + ".png");
                $("#day" + i + "-temp").text(dayTemp);
                $("#day" + i + "-humidity").text(dayHumidity);
            }
            $("#weather-div").attr("class", "col-8 d-block")
        });
});
