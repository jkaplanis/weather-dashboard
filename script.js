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


var APIKey = "c6e0e3fb545da16f65b665f11bf65c91";

// Here we are building the URL we need to query the database

$("#search-button").on("click", function(event){
    event.preventDefault()
    var cityName = $("#input-city").val();
    console.log(cityName);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // We store all of the retrieved data inside of an object called "response"
      .then(function(response) {
        // Log the queryURL
        console.log(response);
    
        // // Log the resulting object
        // console.log(response);
    
        // // Transfer content to HTML
        // $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        // $(".wind").text("Wind Speed: " + response.wind.speed);
        // $(".humidity").text("Humidity: " + response.main.humidity);
    
        // // Convert the temp to fahrenheit
        // var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    
        // // add temp content to html
        // $(".temp").text("Temperature (K) " + response.main.temp);
        // $(".tempF").text("Temperature (F) " + tempF.toFixed(2));
    
        // // Log the data in the console as well
        // console.log("Wind Speed: " + response.wind.speed);
        // console.log("Humidity: " + response.main.humidity);
        // console.log("Temperature (F): " + tempF);
      });
});