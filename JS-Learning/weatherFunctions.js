var url = "http://64.23.161.211:3000";

function updateCurrentConditions(){
    var inputBox = document.getElementById("searchBox");
    var button = document.getElementById("searchButton")
    var city = inputBox.value;
    var weatherReport = getWeather(city);
}

function getWeather(city){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url+"/search?city="+city);
    xhr.onload  = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
              var weatherValues = formatResults(xhr);
              fillInResults(weatherValues);
              return weatherValues;
            }
          }
    };
    xhr.send(null);
}

function getCurrentConditions(xhr){
  var weatherValues = {};
  var weatherData = JSON.parse(xhr.response); 
  var city = weatherData.location.name;
  var region = weatherData.location.region;  
  var country = weatherData.location.country;
  if(country === "United States of America"){
    country  = "USA";
  }           
  weatherValues["location"] = `${city}, ${region}, ${country}`;
  weatherValues["time"] = weatherData.current.last_updated;
  weatherValues["tempF"] = weatherData.current.temp_f;
  weatherValues["tempC"] = weatherData.current.temp_c;
  weatherValues["conditions"] = weatherData.current.condition.text;
  weatherValues["windSpeed"] = weatherData.current.wind_mph;
  weatherValues["windDirection"] = weatherData.current.wind_dir;
  weatherValues["precipitation"] = weatherData.current.precip_in; 
  return weatherValues;
}

function fillInResults(weather){
   /* //City name
    document.getElementById("cityName").innerHTML = weather.location;
    //Last updated
    document.getElementById("curTime").innerHTML = weather.time;
    //Temp in F and temp in C
    document.getElementById("curTemp").innerHTML = `${weather.tempF} degrees F, ${weather.tempC} degrees C`;
    //Conditions
    document.getElementById("curConditions").innerHTML = weather.conditions;
    //Precipitation
    document.getElementById("curRain").innerHTML = `${weather.precipitation} inches precipitation`;
    //Wind conditions
    document.getElementById("curWind").innerHTML = `${weather.windSpeed} mph, ${weather.windDirection}`;
*/}

function formatResults(xhr){
  var todaysWeather = formatToday(xhr);;
  var tomorrowForecast = {};
  var nextDayForecast = {};
}

function formatToday(xhr){
  var weatherValues = {};
  var weatherData = JSON.parse(xhr.response);
  var city = weatherData.location.name;
  var region = weatherData.location.region;
  var country = weatherData.location.country;
  if (country === "United States of America"){
    country = "USA";
  }
  weatherValues["location"] = `${city}, ${region}, ${country}`;
  weatherValues["time"] = weatherData.current.last_updated;
  weatherValues["tempF"] = weatherData.current.temp_f;
  weatherValues["tempC"] = weatherData.current.temp_c;
  weatherValues["conditions"] = weatherData.current.condition.text;
  weatherValues["windspeed"] = weatherData.current.wind_mph;
  weatherValues["windDirection"] = weatherData.current.wind_dir;
  weatherValues["windGust"] = weatherData.current.gust_mph;
  weatherValues["precipitation"] = weatherData.current.precip_in;
  weatherValues["humid"] = weatherData.current.humidity;
  weatherValues["cloudCov"] = weatherData.current.cloud;
  weatherValues["maxF"] = weatherData.forecast.forecastday[0].day.maxtemp_f;
  weatherValues["maxC"] = weatherData.forecast.forecastday[0].day.maxtemp_c;
  weatherValues["minF"] = weatherData.forecast.forecastday[0].day.mintemp_f;
  weatherValues["minC"] = weatherData.forecast.forecastday[0].day.mintemp_c;
  weatherValues["rainChance"] = weatherData.forecast.forecastday[0].day.daily_chance_of_rain;
  weatherValues["snowChance"] = weatherData.forecast.forecastday[0].day.daily_chance_of_snow;
  weatherValues["sunrise"] = weatherData.forecast.forecastday[0].astro.sunrise;
  weatherValues["sunset"] = weatherData.forecast.forecastday[0].astro.sunset;
  return weatherValues;
}



