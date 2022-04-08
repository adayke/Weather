import { UI_ELEMENTS, showWeatherFromFavorite } from "./view.js";
import { favoriteList } from "./storage.js";

export const SERVER = {
  API_KEY: '97f36208f41daeec8c857deb48d7e06c',
  URL_MAIN: 'https://api.openweathermap.org/data/2.5/weather',
  URL_FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
}

export async function showNow(serverUrl, cityName) {
  let weatherData = await jsonWeather(serverUrl, cityName)
  try {
    UI_ELEMENTS.TEMP_NOW.textContent = `${kelvinToCelsius(weatherData.main.temp)}°`;
    UI_ELEMENTS.CITY_NOW.textContent = weatherData.name;
  } catch (e) {
    alert(weatherData.message)
  }
}

export async function showDetails(serverUrl, cityName) {
  let weatherDetails = await jsonWeather(serverUrl, cityName)

  UI_ELEMENTS.DETAILS_TEMP.textContent = `${kelvinToCelsius(weatherDetails.main.temp)}°`;
  UI_ELEMENTS.DETAILS_FEELS.textContent = `${kelvinToCelsius(weatherDetails.main.feels_like)}°`;
  UI_ELEMENTS.DETAILS_WEATHER.textContent = weatherDetails.weather[0].main;
  UI_ELEMENTS.DETAILS_CITY.textContent = weatherDetails.name;

  const sunriseTime = getTime(weatherDetails.sys.sunrise);
  const sunsetTime = getTime(weatherDetails.sys.sunset);

  UI_ELEMENTS.DETAILS_SUNRISE.textContent = sunriseTime;
  UI_ELEMENTS.DETAILS_SUNSET.textContent = sunsetTime;
}

export function showForecast(serverUrl, cityName) {
  jsonWeather(serverUrl, cityName)

    .then(weather => {
      UI_ELEMENTS.FORECAST_CITY.textContent = weather.city.name;

      for (let i = 0; i < UI_ELEMENTS.FORECAST_ITEMS.length; i++) {
        let cityWeather = weather.list[i].weather[0].main;

        UI_ELEMENTS.FORECAST_DATE.forEach((item) => {
          item.textContent = getDate(weather.list[0].dt_txt);
        });

        UI_ELEMENTS.FORECAST_TEMP.forEach((item) => {
          item.firstElementChild.textContent = `${kelvinToCelsius(weather.list[i].main.temp)}°`;
        });

        UI_ELEMENTS.FORECAST_FEELS.forEach((item) => {
          item.firstElementChild.textContent = `${kelvinToCelsius(weather.list[i].main.feels_like)}°`;
        });

        UI_ELEMENTS.FORECAST_WEATHER.forEach((item) => {
          item.textContent = cityWeather;
        });
      }
    });
}

export function addFavorite() {
  let cityName = UI_ELEMENTS.CITY_NOW.textContent;

  try {
    if (favoriteList.includes(cityName)) {
      throw new Error('this city is already on the list')
    } else {
      favoriteList.push(cityName);
      localStorage.setItem('favorites', JSON.stringify(favoriteList));
      createFavorite(cityName);
    }
  } catch (err) {
    alert(err)
  }
}

export function createFavorite(cityName) {
  let newFavoriteItem = document.createElement('li');
  newFavoriteItem.className = 'weather__locations-list-item flex';
  newFavoriteItem.innerHTML = `<button class="weather__locations-favorite-btn">${cityName}
                                 </button><button class="weather__location-del"></button>`;
  UI_ELEMENTS.FAVORITE_LIST.append(newFavoriteItem);

  newFavoriteItem.firstElementChild.addEventListener('click', showWeatherFromFavorite);
  newFavoriteItem.lastElementChild.addEventListener('click', deleteFavorite);
}

export function deleteFavorite(event) {
  const favItem = event.currentTarget.parentElement;
  const cityName = favItem.firstChild.textContent;
  const favItemId = favoriteList.indexOf(cityName);

  favoriteList.splice(favItemId, 1);
  localStorage.setItem('favorites', JSON.stringify(favoriteList));

  favItem.remove();
}

async function jsonWeather(serverUrl, cityName) {
  const url = `${serverUrl}?q=${cityName}&cnt=4&appid=${SERVER.API_KEY}`;

  const response = await fetch(url)
  const json = await response.json()

  return json;
}

const kelvinToCelsius = function (temp) {
  let tempC = Math.round(temp - 273.15);

  return tempC;
}

const getTime = function (time) {
  const date = new Date(time * 1000);

  let hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
  let minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes}`;
}

const getDate = function (time) {
  const date = new Date(time);
  const day = date.toLocaleString('en-US', { day: '2-digit', month: 'long' });

  return day;
}