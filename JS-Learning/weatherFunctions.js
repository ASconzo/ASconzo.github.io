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
              fillInResults(formatResults(xhr.response));
            }
          }
    };
    xhr.send(null);
}

function formatResults(xhr){
  var formattedResults = {};
  formattedResults["today"] = formatToday(xhr);
  formattedResults["tomorrow"] = formatForecast(xhr,1);
  formattedResults["nextDay"] = formatForecast(xhr,2);
  return formattedResults;
}

function formatToday(xhr){
  var weatherValues = {};
  var weatherData = JSON.parse(xhr);
  var city = weatherData.location.name;
  var region = weatherData.location.region;
  var country = weatherData.location.country;
  if (country === "United States of America"){
    country = "USA";
  }
  weatherValues["location"] = `${city}, ${region}, ${country}`;
  console.log(weatherData.current.last_updated_epoch);
  weatherValues["time"] = formatDate(weatherData.current.last_updated_epoch,"today");
  weatherValues["tempF"] = weatherData.current.temp_f;
  weatherValues["tempC"] = weatherData.current.temp_c;
  weatherValues["conditions"] = weatherData.current.condition.text;
  weatherValues["windspeed"] = weatherData.current.wind_mph;
  weatherValues["winddirection"] = weatherData.current.wind_dir;
  weatherValues["windgust"] = weatherData.current.gust_mph;
  weatherValues["precipitation"] = weatherData.current.precip_in;
  weatherValues["humid"] = weatherData.current.humidity;
  weatherValues["cloudcoverage"] = weatherData.current.cloud;
  weatherValues["maxF"] = weatherData.forecast.forecastday[0].day.maxtemp_f;
  weatherValues["maxC"] = weatherData.forecast.forecastday[0].day.maxtemp_c;
  weatherValues["minF"] = weatherData.forecast.forecastday[0].day.mintemp_f;
  weatherValues["minC"] = weatherData.forecast.forecastday[0].day.mintemp_c;
  weatherValues["sunrise"] = weatherData.forecast.forecastday[0].astro.sunrise;
  weatherValues["sunset"] = weatherData.forecast.forecastday[0].astro.sunset;
  return weatherValues;
}

function formatForecast(xhr,i){
  var weatherValues = {};
  var weatherData = JSON.parse(xhr);
  weatherValues["date"] = formatDate(weatherData.forecast.forecastday[i].date_epoch,"forecast");
  weatherValues["avgF"] = weatherData.forecast.forecastday[i].day.avgtemp_f;
  weatherValues["avgC"] = weatherData.forecast.forecastday[i].day.avgtemp_c;
  weatherValues["conditions"] = weatherData.forecast.forecastday[i].day.condition.text;
  weatherValues["windspeed"] = weatherData.forecast.forecastday[i].day.maxwind_mph;
  weatherValues["precipitation"] = weatherData.forecast.forecastday[i].day.totalprecip_in;
  weatherValues["avghumidity"] = weatherData.forecast.forecastday[i].day.avghumidity;
  weatherValues["maxF"] = weatherData.forecast.forecastday[i].day.maxtemp_f;
  weatherValues["minF"] = weatherData.forecast.forecastday[i].day.mintemp_f;
  weatherValues["maxC"] = weatherData.forecast.forecastday[i].day.maxtemp_c;
  weatherValues["minC"] = weatherData.forecast.forecastday[i].day.mintemp_c;
  weatherValues["sunrise"] = weatherData.forecast.forecastday[i].astro.sunrise;
  weatherValues["sunset"] = weatherData.forecast.forecastday[i].astro.sunset;
  return weatherValues;
}

function fillInResults(weather){
  document.getElementById("cityName").innerHTML = weather.today.location;
  document.getElementById("curTime").innerHTML = weather.today.time;
  document.getElementById("curTemp").innerHTML = `${weather.today.tempF} degrees F / ${weather.today.tempC} degrees C`;
  document.getElementById("max").innerHTML =`Daily high: ${weather.today.maxF} degrees F / ${weather.today.tempC} degrees C`
  document.getElementById("min").innerHTML =`Daily Low: ${weather.today.minF} degrees F / ${weather.today.minC} degrees C`;
  document.getElementById("curConditions").innerHTML = `${weather.today.conditions}, with ${weather.today.cloudcoverage}% cloud coverage, and ${weather.today.humid}% humidity`;
  document.getElementById("curRain").innerHTML = `${weather.today.precipitation} expected inches precipitation`;
  document.getElementById("curWind").innerHTML = `Wind from the ${weather.today.winddirection} at ${weather.today.windspeed} MPH, with gusts up to ${weather.today.windgust} MPH`;
  document.getElementById("sunrise").innerHTML = `Sunrise today ${weather.today.sunrise}`;
  document.getElementById("sunset").innerHTML = `Sunset today at ${weather.today.sunset}`;
  document.getElementById("tomorrowDate").innerHTML = weather.tomorrow.date;
  document.getElementById("tomorrowAvg").innerHTML = `Average temperature of ${weather.tomorrow.avgF} degrees F / ${weather.tomorrow.avgC} degrees C`;
  document.getElementById("tomorrowConditions").innerHTML = `${weather.tomorrow.conditions} with ${weather.tomorrow.avghumidity}% humidity`;
  document.getElementById("tomorrowMax").innerHTML = `Daily High: ${weather.tomorrow.maxF} degrees F / ${weather.tomorrow.maxC} degrees C`
  document.getElementById("tomorrowMin").innerHTML = `Daily Low: ${weather.tomorrow.minF} degrees F / ${weather.tomorrow.minC} degrees C`;
  document.getElementById("tomorrowPrecipitation").innerHTML = `${weather.tomorrow.precipitation} expected inches precipitation`;
  document.getElementById("tomorrowWind").innerHTML = `Winds at ${weather.tomorrow.windspeed} MPH`;
  document.getElementById("tomorrowSunrise").innerHTML = `Sunrise at ${weather.tomorrow.sunrise}`;
  document.getElementById("tomorrowSunset").innerHTML = `Sunset at ${weather.tomorrow.sunset}`;
  document.getElementById("nextDate").innerHTML = weather.nextDay.date;
  document.getElementById("nextAvg").innerHTML = `Average temperature of ${weather.nextDay.avgF} degrees F / ${weather.nextDay.avgC} degrees C`;
  document.getElementById("nextConditions").innerHTML = `${weather.nextDay.conditions} with ${weather.nextDay.avghumidity}% humidity`;
  document.getElementById("nextMax").innerHTML = `Daily High: ${weather.nextDay.maxF} degrees F / ${weather.nextDay.maxC} degrees C`
  document.getElementById("nextMin").innerHTML = `Daily Low: ${weather.nextDay.minF} degrees F / ${weather.nextDay.minC} degrees C`;
  document.getElementById("nextPrecipitation").innerHTML = `${weather.nextDay.precipitation} expected inches precipitation`;
  document.getElementById("nextWind").innerHTML = `Winds at ${weather.nextDay.windspeed} MPH`;
  document.getElementById("nextSunrise").innerHTML = `Sunrise at ${weather.nextDay.sunrise}`;
  document.getElementById("nextSunset").innerHTML = `Sunset at ${weather.nextDay.sunset}`;
}
function formatDate(input, task){
  var date = new Date(input*1000);
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  if(task === "forecast"){
    return dateString;
  }
  var hours = date.getHours();
  var ampm = "AM"
  if (hours > 11){
    ampm = "PM";
  }
  if (hours > 12){
    hours = hours-12;
  }
  if (hours === 0){
    hours = 12;
  }
  var minutes = date.getMinutes();
  var timeString = `Last updated at ${hours}:${minutes} ${ampm}`;
  var fullString = `${dateString}, ${timeString}`;
  return fullString;
}
