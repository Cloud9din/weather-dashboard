// =====================================================
// SKYCAST WEATHER DASHBOARD
// Live weather data powered by Open-Meteo
// =====================================================


// =====================================================
// DOM ELEMENTS
// =====================================================

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

const lastUpdated =
  document.getElementById(
    "last-updated"
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

const hourlyForecast =
  document.getElementById(
    "hourly-forecast"
  );

const forecastGrid =
  document.getElementById(
    "forecast-grid"
  );

const savedLocations =
  document.getElementById(
    "saved-locations"
  );

const weatherEffects =
  document.getElementById(
    "weather-effects"
  );

const weatherCard =
  document.getElementById(
    "current-weather-card"
  );


// =====================================================
// STORAGE
// =====================================================

const FAVOURITES_KEY =
  "skycastFavourites";

const LAST_LOCATION_KEY =
  "skycastLastLocation";

const UNIT_KEY =
  "skycastUnit";


// =====================================================
// APP STATE
// =====================================================

let currentLocation = null;

let currentWeatherData = null;

let temperatureMode =
  localStorage.getItem(
    UNIT_KEY
  ) || "C";

let searchTimer;


// =====================================================
// DEFAULT LOCATION
// =====================================================

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


// =====================================================
// TEMPERATURE FUNCTIONS
// =====================================================

function convertTemperature(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "--";

  }


  if (
    temperatureMode === "F"
  ) {

    return Math.round(
      value * 9 / 5 + 32
    );

  }


  return Math.round(
    value
  );

}


function getTemperatureUnit() {

  return temperatureMode === "C"
    ? "°C"
    : "°F";

}


// =====================================================
// WEATHER CODE INFORMATION
// =====================================================

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


// =====================================================
// STATUS MESSAGE
// =====================================================

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


// =====================================================
// DATE FUNCTIONS
// =====================================================

function formatDate(
  dateString
) {

  const [
    year,
    month,
    day
  ] =
    dateString
      .split("-")
      .map(Number);


  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
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


  const [
    year,
    month,
    day
  ] =
    dateString
      .split("-")
      .map(Number);


  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day
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


  const parts =
    value.split("T");


  if (parts.length < 2) {
    return "--:--";
  }


  return parts[1].slice(
    0,
    5
  );

}


// =====================================================
// DYNAMIC WEATHER EFFECTS
// =====================================================

function createWeatherEffects(
  theme
) {

  weatherEffects.innerHTML =
    "";


  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    return;

  }


  // Rain

  if (
    theme ===
    "weather-rain"
  ) {

    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const drop =
        document.createElement(
          "span"
        );


      drop.className =
        "rain-drop";


      drop.style.left =
        `${Math.random() * 100}%`;


      drop.style.animationDuration =
        `${0.6 + Math.random()}s`;


      drop.style.animationDelay =
        `${Math.random() * 2}s`;


      weatherEffects.appendChild(
        drop
      );

    }

  }


  // Snow

  if (
    theme ===
    "weather-snow"
  ) {

    for (
      let i = 0;
      i < 35;
      i++
    ) {

      const snow =
        document.createElement(
          "span"
        );


      snow.className =
        "snowflake";


      snow.textContent =
        "❄";


      snow.style.left =
        `${Math.random() * 100}%`;


      snow.style.fontSize =
        `${8 + Math.random() * 14}px`;


      snow.style.animationDuration =
        `${5 + Math.random() * 7}s`;


      snow.style.animationDelay =
        `${Math.random() * 5}s`;


      weatherEffects.appendChild(
        snow
      );

    }

  }


  // Stars

  if (
    theme ===
    "weather-night"
  ) {

    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const star =
        document.createElement(
          "span"
        );


      star.className =
        "star";


      star.style.left =
        `${Math.random() * 100}%`;


      star.style.top =
        `${Math.random() * 75}%`;


      star.style.animationDelay =
        `${Math.random() * 3}s`;


      weatherEffects.appendChild(
        star
      );

    }

  }

}


// =====================================================
// APPLY WEATHER THEME
// =====================================================

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


  createWeatherEffects(
    theme
  );

}


// =====================================================
// VISIBILITY
// =====================================================

function getCurrentVisibility(
  data
) {

  if (
    !data.hourly ||
    !data.hourly.time ||
    !data.hourly.visibility
  ) {

    return null;

  }


  const currentTime =
    new Date(
      data.current.time
    ).getTime();


  let closestIndex =
    0;


  let closestDifference =
    Infinity;


  data.hourly.time.forEach(
    (time, index) => {

      const difference =
        Math.abs(
          new Date(time).getTime()
          -
          currentTime
        );


      if (
        difference <
        closestDifference
      ) {

        closestDifference =
          difference;

        closestIndex =
          index;

      }

    }
  );


  const metres =
    data.hourly.visibility[
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


// =====================================================
// FETCH LIVE WEATHER
// =====================================================

async function fetchWeather(
  location
) {

  showStatus(
    `Loading weather for ${location.name}...`
  );


  setLoadingState(
    true
  );


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
          [
            "visibility",
            "temperature_2m",
            "weather_code"
          ].join(","),

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


    const url =
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`;


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "Unable to load weather."
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
      JSON.stringify(
        location
      )
    );


    renderWeather();


    hideStatus();

  }

  catch (error) {

    console.error(
      error
    );


    showStatus(
      "Unable to load weather. Please try again.",
      "error"
    );

  }

  finally {

    setLoadingState(
      false
    );

  }

}


// =====================================================
// RENDER WEATHER
// =====================================================

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


  // Location

  locationName.textContent =
    currentLocation.country
      ? `${currentLocation.name}, ${currentLocation.country}`
      : currentLocation.name;


  // Date

  currentDate.textContent =
    formatDate(
      current.time.slice(
        0,
        10
      )
    );


  // Local Time

  localTime.textContent =
    `Local time ${current.time.slice(11, 16)}`;


  // Last Updated

  lastUpdated.textContent =
    `Updated ${new Intl.DateTimeFormat(
      "en-GB",
      {
        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    ).format(new Date())}`;


  // Weather

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


  // Temperature Animation

  currentTemperature
    .classList.remove(
      "temperature-pop"
    );


  void currentTemperature.offsetWidth;


  currentTemperature
    .classList.add(
      "temperature-pop"
    );


  // High / Low

  todayHigh.textContent =
    `${convertTemperature(
      daily.temperature_2m_max[0]
    )}${getTemperatureUnit()}`;


  todayLow.textContent =
    `${convertTemperature(
      daily.temperature_2m_min[0]
    )}${getTemperatureUnit()}`;


  // Weather Details

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


  const currentVisibility =
    getCurrentVisibility(
      data
    );


  visibility.textContent =
    currentVisibility !== null
      ? `${currentVisibility.toFixed(1)} km`
      : "Unavailable";


  sunrise.textContent =
    getTimeFromISO(
      daily.sunrise[0]
    );


  sunset.textContent =
    getTimeFromISO(
      daily.sunset[0]
    );


  renderHourlyForecast();

  renderForecast();

  updateFavouriteButton();

  renderFavourites();

}


// =====================================================
// HOURLY FORECAST
// =====================================================

function renderHourlyForecast() {

  const hourly =
    currentWeatherData.hourly;


  if (
    !hourly ||
    !hourly.time ||
    !hourly.temperature_2m ||
    !hourly.weather_code
  ) {

    return;

  }


  hourlyForecast.innerHTML =
    "";


  const currentTime =
    new Date(
      currentWeatherData
        .current.time
    ).getTime();


  let startIndex =
    hourly.time.findIndex(
      time =>
        new Date(time)
          .getTime()
        >=
        currentTime
    );


  if (
    startIndex === -1
  ) {

    startIndex =
      0;

  }


  const endIndex =
    Math.min(
      startIndex + 10,
      hourly.time.length
    );


  for (
    let i = startIndex;
    i < endIndex;
    i++
  ) {

    const weather =
      getWeatherInfo(
        hourly.weather_code[i],
        1
      );


    const card =
      document.createElement(
        "article"
      );


    card.className =
      "hour-card";


    if (
      i === startIndex
    ) {

      card.classList.add(
        "current-hour"
      );

    }


    card.style.animationDelay =
      `${(
        i - startIndex
      ) * 0.05}s`;


    const time =
      hourly.time[i]
        .split("T")[1]
        .slice(0, 5);


    const timeLabel =
      i === startIndex
        ? "Now"
        : time;


    const timeElement =
      document.createElement(
        "span"
      );


    timeElement.className =
      "hour-time";


    timeElement.textContent =
      timeLabel;


    const icon =
      document.createElement(
        "div"
      );


    icon.className =
      "hour-icon";


    icon.textContent =
      weather.icon;


    const temperature =
      document.createElement(
        "strong"
      );


    temperature.className =
      "hour-temperature";


    temperature.textContent =
      `${convertTemperature(
        hourly.temperature_2m[i]
      )}${getTemperatureUnit()}`;


    card.append(
      timeElement,
      icon,
      temperature
    );


    hourlyForecast.appendChild(
      card
    );

  }

}


// =====================================================
// FIVE DAY FORECAST
// =====================================================

function renderForecast() {

  const daily =
    currentWeatherData.daily;


  forecastGrid.innerHTML =
    "";


  daily.time.forEach(
    (
      date,
      index
    ) => {

      const weather =
        getWeatherInfo(
          daily.weather_code[
            index
          ],
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
          daily.temperature_2m_max[
            index
          ]
        )}${getTemperatureUnit()}`;


      const low =
        document.createElement(
          "small"
        );


      low.textContent =
        `Low ${convertTemperature(
          daily.temperature_2m_min[
            index
          ]
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


// =====================================================
// LOADING STATE
// =====================================================

function setLoadingState(
  loading
) {

  const cards =
    document.querySelectorAll(
      ".current-weather-card, .detail-card"
    );


  cards.forEach(
    card => {

      card.classList.toggle(
        "loading-pulse",
        loading
      );

    }
  );


  refreshButton.disabled =
    loading;

}


// =====================================================
// CITY SEARCH
// =====================================================

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
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
      );


    if (!response.ok) {

      throw new Error(
        "Search failed."
      );

    }


    const data =
      await response.json();


    renderSuggestions(
      data.results || []
    );

  }

  catch (error) {

    console.error(
      error
    );


    clearSuggestions();

  }

}


// =====================================================
// SEARCH SUGGESTIONS
// =====================================================

function renderSuggestions(
  results
) {

  suggestionsBox.innerHTML =
    "";


  if (
    !results.length
  ) {

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


      const main =
        document.createElement(
          "strong"
        );


      main.textContent =
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
        main,
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


// =====================================================
// FIND FIRST CITY
// =====================================================

async function findCity(
  query
) {

  const params =
    new URLSearchParams({

      name:
        query.trim(),

      count:
        "1",

      language:
        "en",

      format:
        "json"

    });


  const response =
    await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
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


// =====================================================
// SEARCH FORM
// =====================================================

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

      console.error(
        error
      );


      showStatus(
        "Unable to search for that city.",
        "error"
      );

    }

  }
);


// =====================================================
// LIVE SEARCH
// =====================================================

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


// Close suggestions if clicking outside

document.addEventListener(
  "click",
  event => {

    if (
      !searchInput.contains(
        event.target
      )
      &&
      !suggestionsBox.contains(
        event.target
      )
    ) {

      clearSuggestions();

    }

  }
);


// =====================================================
// CURRENT LOCATION
// =====================================================

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

            admin1:
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


// =====================================================
// REFRESH BUTTON
// =====================================================

refreshButton.addEventListener(
  "click",
  async () => {

    if (
      !currentLocation
    ) {

      return;

    }


    refreshButton
      .classList.add(
        "loading-pulse"
      );


    await fetchWeather(
      currentLocation
    );


    refreshButton
      .classList.remove(
        "loading-pulse"
      );

  }
);


// =====================================================
// TEMPERATURE UNIT TOGGLE
// =====================================================

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


// =====================================================
// FAVOURITES
// =====================================================

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
) {

  localStorage.setItem(
    FAVOURITES_KEY,
    JSON.stringify(
      favourites
    )
  );

}


function locationKey(
  location
) {

  return [
    Number(
      location.latitude
    ).toFixed(4),

    Number(
      location.longitude
    ).toFixed(4)
  ].join(",");

}


function isFavourite(
  location
) {

  if (!location) {
    return false;
  }


  const key =
    locationKey(
      location
    );


  return getFavourites()
    .some(
      favourite =>
        locationKey(
          favourite
        )
        ===
        key
    );

}


// =====================================================
// FAVOURITE BUTTON
// =====================================================

function updateFavouriteButton() {

  const active =
    isFavourite(
      currentLocation
    );


  favouriteButton
    .classList.toggle(
      "active",
      active
    );


  favouriteButton.textContent =
    active
      ? "★"
      : "☆";


  favouriteButton.title =
    active
      ? "Remove from favourites"
      : "Add to favourites";


  favouriteButton.setAttribute(
    "aria-label",
    favouriteButton.title
  );

}


favouriteButton.addEventListener(
  "click",
  () => {

    if (
      !currentLocation
    ) {

      return;

    }


    let favourites =
      getFavourites();


    const key =
      locationKey(
        currentLocation
      );


    const exists =
      favourites.some(
        location =>
          locationKey(
            location
          )
          ===
          key
      );


    if (exists) {

      favourites =
        favourites.filter(
          location =>
            locationKey(
              location
            )
            !==
            key
        );

    }

    else {

      favourites.push({

        name:
          currentLocation.name,

        country:
          currentLocation.country || "",

        admin1:
          currentLocation.admin1 || "",

        latitude:
          currentLocation.latitude,

        longitude:
          currentLocation.longitude

      });

    }


    saveFavourites(
      favourites
    );


    updateFavouriteButton();

    renderFavourites();

  }
);


// =====================================================
// RENDER FAVOURITES
// =====================================================

function renderFavourites() {

  const favourites =
    getFavourites();


  savedLocations.innerHTML =
    "";


  if (
    !favourites.length
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "empty-favourites";


    const star =
      document.createElement(
        "span"
      );


    star.textContent =
      "☆";


    const text =
      document.createElement(
        "p"
      );


    text.textContent =
      "Save your favourite cities for quick access.";


    empty.append(
      star,
      text
    );


    savedLocations.appendChild(
      empty
    );


    return;

  }


  favourites.forEach(
    favourite => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "saved-location-card";


      card.tabIndex =
        0;


      const name =
        document.createElement(
          "strong"
        );


      name.textContent =
        favourite.name;


      const details =
        document.createElement(
          "span"
        );


      details.textContent =
        [
          favourite.admin1,
          favourite.country
        ]
          .filter(Boolean)
          .join(", ")
        ||
        "Saved location";


      const removeButton =
        document.createElement(
          "button"
        );


      removeButton.type =
        "button";


      removeButton.className =
        "remove-favourite";


      removeButton.textContent =
        "×";


      removeButton.title =
        "Remove favourite";


      removeButton.setAttribute(
        "aria-label",
        `Remove ${favourite.name} from favourites`
      );


      card.append(
        name,
        details,
        removeButton
      );


      card.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            removeButton
          ) {

            return;

          }


          fetchWeather(
            favourite
          );

        }
      );


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key ===
            "Enter"
            ||
            event.key ===
            " "
          ) {

            event.preventDefault();


            fetchWeather(
              favourite
            );

          }

        }
      );


      removeButton
        .addEventListener(
          "click",
          event => {

            event.stopPropagation();


            const updated =
              getFavourites()
                .filter(
                  location =>
                    locationKey(
                      location
                    )
                    !==
                    locationKey(
                      favourite
                    )
                );


            saveFavourites(
              updated
            );


            renderFavourites();

            updateFavouriteButton();

          }
        );


      savedLocations.appendChild(
        card
      );

    }
  );

}


// =====================================================
// INTERACTIVE WEATHER CARD
// =====================================================

if (
  weatherCard
  &&
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches
  &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {

  weatherCard.addEventListener(
    "mousemove",
    event => {

      const rect =
        weatherCard
          .getBoundingClientRect();


      const x =
        event.clientX
        -
        rect.left;


      const y =
        event.clientY
        -
        rect.top;


      const rotateY =
        (
          x / rect.width
          -
          0.5
        ) * 4;


      const rotateX =
        (
          0.5
          -
          y / rect.height
        ) * 4;


      weatherCard.style.transform =
        `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-4px)
        `;

    }
  );


  weatherCard.addEventListener(
    "mouseleave",
    () => {

      weatherCard.style.transform =
        "";

    }
  );

}


// =====================================================
// LAST LOCATION
// =====================================================

function getLastLocation() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          LAST_LOCATION_KEY
        )
      );


    if (
      saved
      &&
      saved.latitude !== undefined
      &&
      saved.longitude !== undefined
    ) {

      return saved;

    }

  }

  catch {

    return null;

  }


  return null;

}


// =====================================================
// INITIALISE APP
// =====================================================

async function initialiseApp() {

  renderFavourites();


  unitButton.textContent =
    temperatureMode === "C"
      ? "°C"
      : "°F";


  const lastLocation =
    getLastLocation();


  await fetchWeather(
    lastLocation
    ||
    defaultLocation
  );

}


initialiseApp();
