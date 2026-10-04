// =============================================
// SKYCAST WEATHER DASHBOARD
// =============================================

const searchForm =
  document.getElementById(
    "weather-search-form"
  );

const searchInput =
  document.getElementById(
    "city-search"
  );

const suggestionsBox =
  document.getElementById(
    "search-suggestions"
  );

const statusBox =
  document.getElementById(
    "weather-status"
  );

const locationButton =
  document.getElementById(
    "current-location-button"
  );

const refreshButton =
  document.getElementById(
    "refresh-button"
  );

const unitButton =
  document.getElementById(
    "unit-toggle"
  );

const favouriteButton =
  document.getElementById(
    "favourite-button"
  );

const locationName =
  document.getElementById(
    "location-name"
  );

const currentDate =
  document.getElementById(
    "current-date"
  );

const localTime =
  document.getElementById(
    "local-time"
  );

const weatherIcon =
  document.getElementById(
    "weather-icon"
  );

const currentTemperature =
  document.getElementById(
    "current-temperature"
  );

const temperatureUnit =
  document.getElementById(
    "temperature-unit"
  );

const weatherDescription =
  document.getElementById(
    "weather-description"
  );

const feelsLike =
  document.getElementById(
    "feels-like"
  );

const feelsLikeUnit =
  document.getElementById(
    "feels-like-unit"
  );

const todayHigh =
  document.getElementById(
    "today-high"
  );

const todayLow =
  document.getElementById(
    "today-low"
  );

const humidity =
  document.getElementById(
    "humidity"
  );

const windSpeed =
  document.getElementById(
    "wind-speed"
  );

const visibility =
  document.getElementById(
    "visibility"
  );

const precipitation =
  document.getElementById(
    "precipitation"
  );

const sunrise =
  document.getElementById(
    "sunrise"
  );

const sunset =
  document.getElementById(
    "sunset"
  );

const forecastGrid =
  document.getElementById(
    "forecast-grid"
  );

const savedLocations =
  document.getElementById(
    "saved-locations"
  );

const weatherCard =
  document.getElementById(
    "current-weather-card"
  );


const FAVOURITES_KEY =
  "skycastFavourites";

const LAST_LOCATION_KEY =
  "skycastLastLocation";

const UNIT_KEY =
  "skycastUnit";


let currentLocation = null;

let currentWeatherData = null;

let temperatureMode =
  localStorage.getItem(
    UNIT_KEY
  ) || "C";

let searchTimer;


// =============================================
// DEFAULT LOCATION
// =============================================

const defaultLocation = {

  name:
    "Exeter",

  country:
    "United Kingdom",

  admin1:
    "England",

  latitude:
    50.7184,

  longitude:
    -3.5339

};


// =============================================
// TEMPERATURE
// =============================================

function convertTemperature(
  temperature
) {

  if (
    temperature === null ||
    temperature === undefined
  ) {

    return "--";

  }


  if (
    temperatureMode === "F"
  ) {

    return Math.round(
      temperature * 9 / 5 + 32
    );

  }


  return Math.round(
    temperature
  );

}


function getTemperatureUnit() {

  return temperatureMode === "C"
    ? "°C"
    : "°F";

}


// =============================================
// WEATHER CODE
// =============================================

function getWeatherInfo(
  code,
  isDay = 1
) {

  const day =
    Number(isDay) === 1;


  if (code === 0) {

    return {

      description:
        day
          ? "Clear sky"
          : "Clear night",

      icon:
        day
          ? "☀️"
          : "🌙",

      theme:
        day
          ? "weather-clear"
          : "weather-night"

    };

  }


  if (code === 1) {

    return {

      description:
        "Mainly clear",

      icon:
        day
          ? "🌤️"
          : "🌙",

      theme:
        day
          ? "weather-clear"
          : "weather-night"

    };

  }


  if (code === 2) {

    return {

      description:
        "Partly cloudy",

      icon:
        "⛅",

      theme:
        "weather-cloudy"

    };

  }


  if (code === 3) {

    return {

      description:
        "Overcast",

      icon:
        "☁️",

      theme:
        "weather-cloudy"

    };

  }


  if (
    [45, 48].includes(code)
  ) {

    return {

      description:
        "Foggy",

      icon:
        "🌫️",

      theme:
        "weather-cloudy"

    };

  }


  if (
    [
      51,
      53,
      55,
      56,
      57
    ].includes(code)
  ) {

    return {

      description:
        "Drizzle",

      icon:
        "🌦️",

      theme:
        "weather-rain"

    };

  }


  if (
    [
      61,
      63,
      65,
      66,
      67
    ].includes(code)
  ) {

    return {

      description:
        "Rain",

      icon:
        "🌧️",

      theme:
        "weather-rain"

    };

  }


  if (
    [
      71,
      73,
      75,
      77
    ].includes(code)
  ) {

    return {

      description:
        "Snow",

      icon:
        "❄️",

      theme:
        "weather-snow"

    };

  }


  if (
    [
      80,
      81,
      82
    ].includes(code)
  ) {

    return {

      description:
        "Rain showers",

      icon:
        "🌦️",

      theme:
        "weather-rain"

    };

  }


  if (
    [
      85,
      86
    ].includes(code)
  ) {

    return {

      description:
        "Snow showers",

      icon:
        "🌨️",

      theme:
        "weather-snow"

    };

  }


  if (
    [
      95,
      96,
      99
    ].includes(code)
  ) {

    return {

      description:
        "Thunderstorm",

      icon:
        "⛈️",

      theme:
        "weather-rain"

    };

  }


  return {

    description:
      "Weather unavailable",

    icon:
      "🌤️",

    theme:
      "weather-cloudy"

  };

}


// =============================================
// STATUS
// =============================================

function showStatus(
  message,
  type = "loading"
) {

  statusBox.textContent =
    message;

  statusBox.className =
    `weather-status show ${type}`;

}


function hideStatus() {

  statusBox.textContent =
    "";

  statusBox.className =
    "weather-status";

}


// =============================================
// DATE
// =============================================

function formatDate(
  dateString
) {

  const parts =
    dateString
      .split("-")
      .map(Number);


  const date =
    new Date(
      Date.UTC(
        parts[0],
        parts[1] - 1,
        parts[2]
      )
    );


  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday:
        "long",

      day:
        "numeric",

      month:
        "long",

      year:
        "numeric",

      timeZone:
        "UTC"
    }
  ).format(date);

}


function formatForecastDay(
  dateString,
  index
) {

  if (index === 0) {
    return "Today";
  }


  if (index === 1) {
    return "Tomorrow";
  }


  const parts =
    dateString
      .split("-")
      .map(Number);


  const date =
    new Date(
      Date.UTC(
        parts[0],
        parts[1] - 1,
        parts[2]
      )
    );


  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday:
        "short",

      timeZone:
        "UTC"
    }
  ).format(date);

}


function getTimeFromISO(
  value
) {

  if (!value) {
    return "--:--";
  }


  return value
    .split("T")[1]
    .slice(0, 5);

}


// =============================================
// WEATHER THEME
// =============================================

function applyWeatherTheme(
  theme
) {

  document.body.classList.remove(

    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-snow",
    "weather-night"

  );


  document.body.classList.add(
    theme
  );

}


// =============================================
// VISIBILITY
// =============================================

function getVisibility(
  data
) {

  if (
    !data.hourly ||
    !data.hourly.visibility
  ) {

    return null;

  }


  const currentTime =
    data.current.time;


  let closestIndex = 0;

  let smallestDifference =
    Infinity;


  data.hourly.time.forEach(
    (time, index) => {

      const difference =
        Math.abs(
          new Date(time) -
          new Date(currentTime)
        );


      if (
        difference <
        smallestDifference
      ) {

        smallestDifference =
          difference;

        closestIndex =
          index;

      }

    }
  );


  const metres =
    data.hourly
      .visibility[
        closestIndex
      ];


  if (
    metres === undefined ||
    metres === null
  ) {

    return null;

  }


  return metres / 1000;

}


// =============================================
// FETCH WEATHER
// =============================================

async function fetchWeather(
  location
) {

  showStatus(
    `Loading weather for ${location.name}...`
  );


  setLoading(true);


  try {

    const params =
      new URLSearchParams({

        latitude:
          location.latitude,

        longitude:
          location.longitude,

        current:
          [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "is_day"
          ].join(","),

        hourly:
          "visibility",

        daily:
          [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "sunrise",
            "sunset"
          ].join(","),

        timezone:
          "auto",

        forecast_days:
          "5"

      });


    const response =
      await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
      );


    if (!response.ok) {

      throw new Error(
        "Weather service unavailable."
      );

    }


    const data =
      await response.json();


    currentLocation =
      location;


    currentWeatherData =
      data;


    localStorage.setItem(
      LAST_LOCATION_KEY,
      JSON.stringify(location)
    );


    renderWeather();


    hideStatus();

  }

  catch (error) {

    console.error(error);


    showStatus(
      "Unable to load weather. Please try again.",
      "error"
    );

  }

  finally {

    setLoading(false);

  }

}


// =============================================
// RENDER WEATHER
// =============================================

function renderWeather() {

  if (
    !currentWeatherData ||
    !currentLocation
  ) {

    return;

  }


  const data =
    currentWeatherData;


  const current =
    data.current;


  const daily =
    data.daily;


  const weather =
    getWeatherInfo(
      current.weather_code,
      current.is_day
    );


  applyWeatherTheme(
    weather.theme
  );


  locationName.textContent =
    currentLocation.country
      ? `${currentLocation.name}, ${currentLocation.country}`
      : currentLocation.name;


  const currentDay =
    current.time.slice(
      0,
      10
    );


  currentDate.textContent =
    formatDate(
      currentDay
    );


  localTime.textContent =
    `Local time ${current.time.slice(11, 16)}`;


  weatherIcon.textContent =
    weather.icon;


  weatherDescription.textContent =
    weather.description;


  currentTemperature.textContent =
    convertTemperature(
      current.temperature_2m
    );


  temperatureUnit.textContent =
    getTemperatureUnit();


  feelsLike.textContent =
    convertTemperature(
      current.apparent_temperature
    );


  feelsLikeUnit.textContent =
    getTemperatureUnit();


  todayHigh.textContent =
    `${convertTemperature(
      daily.temperature_2m_max[0]
    )}${getTemperatureUnit()}`;


  todayLow.textContent =
    `${convertTemperature(
      daily.temperature_2m_min[0]
    )}${getTemperatureUnit()}`;


  humidity.textContent =
    `${Math.round(
      current.relative_humidity_2m
    )}%`;


  windSpeed.textContent =
    `${Math.round(
      current.wind_speed_10m
    )} km/h`;


  precipitation.textContent =
    `${Number(
      current.precipitation
    ).toFixed(1)} mm`;


  const visibilityValue =
    getVisibility(data);


  visibility.textContent =
    visibilityValue !== null
      ? `${visibilityValue.toFixed(1)} km`
      : "Unavailable";


  sunrise.textContent =
    getTimeFromISO(
      daily.sunrise[0]
    );


  sunset.textContent =
    getTimeFromISO(
      daily.sunset[0]
    );


  renderForecast();

  updateFavouriteButton();

  renderFavourites();

}


// =============================================
// FORECAST
// =============================================

function renderForecast() {

  const daily =
    currentWeatherData.daily;


  forecastGrid.innerHTML =
    "";


  daily.time.forEach(
    (date, index) => {

      const weather =
        getWeatherInfo(
          daily.weather_code[index],
          1
        );


      const card =
        document.createElement(
          "article"
        );


      card.className =
        "forecast-card";


      card.style.animationDelay =
        `${index * 0.07}s`;


      const day =
        document.createElement(
          "span"
        );


      day.textContent =
        formatForecastDay(
          date,
          index
        );


      const icon =
        document.createElement(
          "div"
        );


      icon.className =
        "forecast-icon";


      icon.textContent =
        weather.icon;


      const high =
        document.createElement(
          "strong"
        );


      high.textContent =
        `${convertTemperature(
          daily.temperature_2m_max[index]
        )}${getTemperatureUnit()}`;


      const low =
        document.createElement(
          "small"
        );


      low.textContent =
        `Low ${convertTemperature(
          daily.temperature_2m_min[index]
        )}${getTemperatureUnit()}`;


      card.append(
        day,
        icon,
        high,
        low
      );


      forecastGrid.appendChild(
        card
      );

    }
  );

}


// =============================================
// SEARCH API
// =============================================

async function searchCities(
  query
) {

  const city =
    query.trim();


  if (
    city.length < 2
  ) {

    clearSuggestions();

    return;

  }


  try {

    const params =
      new URLSearchParams({

        name:
          city,

        count:
          "6",

        language:
          "en",

        format:
          "json"

      });


    const response =
      await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params}`
      );


    if (!response.ok) {

      throw new Error(
        "Search failed"
      );

    }


    const data =
      await response.json();


    renderSuggestions(
      data.results || []
    );

  }

  catch (error) {

    console.error(error);

    clearSuggestions();

  }

}


// =============================================
// SUGGESTIONS
// =============================================

function renderSuggestions(
  results
) {

  suggestionsBox.innerHTML =
    "";


  if (!results.length) {

    clearSuggestions();

    return;

  }


  results.forEach(
    result => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "suggestion-item";


      const name =
        document.createElement(
          "strong"
        );


      name.textContent =
        result.name;


      const details =
        document.createElement(
          "span"
        );


      details.textContent =
        [
          result.admin1,
          result.country
        ]
          .filter(Boolean)
          .join(", ");


      button.append(
        name,
        details
      );


      button.addEventListener(
        "click",
        () => {

          const location = {

            name:
              result.name,

            country:
              result.country || "",

            admin1:
              result.admin1 || "",

            latitude:
              result.latitude,

            longitude:
              result.longitude

          };


          searchInput.value =
            result.name;


          clearSuggestions();


          fetchWeather(
            location
          );

        }
      );


      suggestionsBox.appendChild(
        button
      );

    }
  );


  suggestionsBox.classList.add(
    "show"
  );

}


function clearSuggestions() {

  suggestionsBox.innerHTML =
    "";


  suggestionsBox.classList.remove(
    "show"
  );

}


// =============================================
// SEARCH FORM
// =============================================

async function findCity(
  query
) {

  const params =
    new URLSearchParams({

      name:
        query,

      count:
        "1",

      language:
        "en",

      format:
        "json"

    });


  const response =
    await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`
    );


  if (!response.ok) {

    throw new Error(
      "Search unavailable."
    );

  }


  const data =
    await response.json();


  if (
    !data.results ||
    !data.results.length
  ) {

    return null;

  }


  const result =
    data.results[0];


  return {

    name:
      result.name,

    country:
      result.country || "",

    admin1:
      result.admin1 || "",

    latitude:
      result.latitude,

    longitude:
      result.longitude

  };

}


searchForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    clearSuggestions();


    const query =
      searchInput.value.trim();


    if (!query) {
      return;
    }


    showStatus(
      `Searching for ${query}...`
    );


    try {

      const location =
        await findCity(
          query
        );


      if (!location) {

        showStatus(
          "City not found. Try another location.",
          "error"
        );

        return;

      }


      await fetchWeather(
        location
      );

    }

    catch (error) {

      console.error(error);


      showStatus(
        "Unable to search for that city.",
        "error"
      );

    }

  }
);


// =============================================
// LIVE SEARCH
// =============================================

searchInput.addEventListener(
  "input",
  () => {

    clearTimeout(
      searchTimer
    );


    searchTimer =
      setTimeout(
        () => {

          searchCities(
            searchInput.value
          );

        },
        350
      );

  }
);


document.addEventListener(
  "click",
  event => {

    if (
      !searchInput.contains(
        event.target
      ) &&
      !suggestionsBox.contains(
        event.target
      )
    ) {

      clearSuggestions();

    }

  }
);


// =============================================
// GEOLOCATION
// =============================================

locationButton.addEventListener(
  "click",
  () => {

    if (
      !navigator.geolocation
    ) {

      showStatus(
        "Your browser does not support location access.",
        "error"
      );

      return;

    }


    showStatus(
      "Finding your location..."
    );


    navigator.geolocation
      .getCurrentPosition(

        async position => {

          const location = {

            name:
              "Current Location",

            country:
              "",

            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude

          };


          await fetchWeather(
            location
          );

        },


        () => {

          showStatus(
            "Location permission was not available. Search for your city instead.",
            "error"
          );

        },


        {
          enableHighAccuracy:
            false,

          timeout:
            10000,

          maximumAge:
            300000
        }

      );

  }
);


// =============================================
// REFRESH
// =============================================

refreshButton.addEventListener(
  "click",
  async () => {

    if (!currentLocation) {
      return;
    }


    refreshButton.classList.add(
      "loading-pulse"
    );


    await fetchWeather(
      currentLocation
    );


    refreshButton.classList.remove(
      "loading-pulse"
    );

  }
);


// =============================================
// UNIT BUTTON
// =============================================

unitButton.addEventListener(
  "click",
  () => {

    temperatureMode =
      temperatureMode === "C"
        ? "F"
        : "C";


    localStorage.setItem(
      UNIT_KEY,
      temperatureMode
    );


    unitButton.textContent =
      temperatureMode === "C"
        ? "°C"
        : "°F";


    if (
      currentWeatherData
    ) {

      renderWeather();

    }

  }
);


// =============================================
// FAVOURITES
// =============================================

function getFavourites() {

  try {

    return JSON.parse(
      localStorage.getItem(
        FAVOURITES_KEY
      )
    ) || [];

  }

  catch {

    return [];

  }

}


function saveFavourites(
  favourites
