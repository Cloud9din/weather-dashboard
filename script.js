// =====================================================
// SKYCAST WEATHER DASHBOARD
// Live weather data powered by Open-Meteo
// =====================================================

const searchForm = document.getElementById("weather-search-form");
const searchInput = document.getElementById("city-search");
const suggestionsBox = document.getElementById("search-suggestions");
const statusBox = document.getElementById("weather-status");

const locationButton = document.getElementById("current-location-button");
const unitButton = document.getElementById("unit-toggle");
const favouriteButton = document.getElementById("favourite-button");

const locationName = document.getElementById("location-name");
const currentDate = document.getElementById("current-date");

const weatherIcon = document.getElementById("weather-icon");
const currentTemperature = document.getElementById("current-temperature");
const temperatureUnit = document.getElementById("temperature-unit");

const weatherDescription = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const feelsLikeUnit = document.getElementById("feels-like-unit");

const todayHigh = document.getElementById("today-high");
const todayLow = document.getElementById("today-low");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const visibility = document.getElementById("visibility");
const precipitation = document.getElementById("precipitation");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastGrid = document.getElementById("forecast-grid");
const savedLocations = document.getElementById("saved-locations");
const emptyFavourites = document.getElementById("empty-favourites");

const STORAGE_KEY = "skycastFavourites";
const LAST_LOCATION_KEY = "skycastLastLocation";

let currentLocation = null;
let currentWeatherData = null;
let temperatureMode = "C";

let searchTimer;


// =====================================================
// DEFAULT LOCATION
// =====================================================

const defaultLocation = {
  name: "Exeter",
  country: "United Kingdom",
  latitude: 50.7184,
  longitude: -3.5339
};


// =====================================================
// TEMPERATURE
// =====================================================

function convertTemperature(value) {

  if (value === null || value === undefined) {
    return "--";
  }

  if (temperatureMode === "F") {

    return Math.round(
      (value * 9) / 5 + 32
    );

  }

  return Math.round(value);
}


function getTemperatureUnit() {

  return temperatureMode === "C"
    ? "°C"
    : "°F";
}


// =====================================================
// WEATHER CODE INFORMATION
// =====================================================

function getWeatherInfo(code, isDay = 1) {

  const day = Number(isDay) === 1;

  if (code === 0) {

    return {
      description: day
        ? "Clear sky"
        : "Clear night",

      icon: day
        ? "☀️"
        : "🌙",

      theme: day
        ? "weather-clear"
        : "weather-night"
    };

  }


  if (code === 1) {

    return {
      description: "Mainly clear",
      icon: day ? "🌤️" : "🌙",
      theme: day
        ? "weather-clear"
        : "weather-night"
    };

  }


  if (code === 2) {

    return {
      description: "Partly cloudy",
      icon: "⛅",
      theme: "weather-cloudy"
    };

  }


  if (code === 3) {

    return {
      description: "Overcast",
      icon: "☁️",
      theme: "weather-cloudy"
    };

  }


  if ([45, 48].includes(code)) {

    return {
      description: "Foggy",
      icon: "🌫️",
      theme: "weather-cloudy"
    };

  }


  if ([51, 53, 55].includes(code)) {

    return {
      description: "Drizzle",
      icon: "🌦️",
      theme: "weather-rain"
    };

  }


  if ([56, 57].includes(code)) {

    return {
      description: "Freezing drizzle",
      icon: "🌧️",
      theme: "weather-rain"
    };

  }


  if ([61, 63, 65].includes(code)) {

    return {
      description: "Rain",
      icon: "🌧️",
      theme: "weather-rain"
    };

  }


  if ([66, 67].includes(code)) {

    return {
      description: "Freezing rain",
      icon: "🌧️",
      theme: "weather-rain"
    };

  }


  if ([71, 73, 75, 77].includes(code)) {

    return {
      description: "Snow",
      icon: "❄️",
      theme: "weather-snow"
    };

  }


  if ([80, 81, 82].includes(code)) {

    return {
      description: "Rain showers",
      icon: "🌦️",
      theme: "weather-rain"
    };

  }


  if ([85, 86].includes(code)) {

    return {
      description: "Snow showers",
      icon: "🌨️",
      theme: "weather-snow"
    };

  }


  if ([95, 96, 99].includes(code)) {

    return {
      description: "Thunderstorm",
      icon: "⛈️",
      theme: "weather-rain"
    };

  }


  return {
    description: "Weather unavailable",
    icon: "🌤️",
    theme: "weather-cloudy"
  };
}


// =====================================================
// STATUS MESSAGE
// =====================================================

function showStatus(message, type = "loading") {

  statusBox.textContent = message;

  statusBox.className =
    `weather-status show ${type}`;
}


function hideStatus() {

  statusBox.textContent = "";

  statusBox.className =
    "weather-status";
}


// =====================================================
// DATE FORMATTING
// =====================================================

function formatDate(dateString, options = {}) {

  if (!dateString) {
    return "";
  }

  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
      ...options
    }
  ).format(date);
}


function formatForecastDay(dateString, index) {

  if (index === 0) {
    return "Today";
  }

  if (index === 1) {
    return "Tomorrow";
  }

  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "short",
      timeZone: "UTC"
    }
  ).format(date);
}


function formatTime(timeString) {

  if (!timeString) {
    return "--:--";
  }

  const time =
    timeString.includes("T")
      ? timeString.split("T")[1]
      : timeString;

  const [hour, minute] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}


// =====================================================
// WEATHER THEME
// =====================================================

function applyWeatherTheme(theme) {

  const themes = [
    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-snow",
    "weather-night"
  ];

  document.body.classList.remove(
    ...themes
  );

  document.body.classList.add(theme);
}


// =====================================================
// FIND CURRENT VISIBILITY
// =====================================================

function getCurrentVisibility(data) {

  if (
    !data.hourly ||
    !data.hourly.time ||
    !data.hourly.visibility
  ) {
    return null;
  }

  const currentTime =
    data.current.time;

  let index =
    data.hourly.time.indexOf(
      currentTime
    );


  // If exact current hour cannot be found,
  // use the closest available hourly value.

  if (index === -1) {

    const currentDate =
      new Date(currentTime).getTime();

    let closestDifference =
      Infinity;

    data.hourly.time.forEach(
      (time, i) => {

        const difference =
          Math.abs(
            new Date(time).getTime()
            - currentDate
          );

        if (
          difference <
          closestDifference
        ) {

          closestDifference =
            difference;

          index = i;
        }

      }
    );

  }


  const metres =
    data.hourly.visibility[index];

  if (
    metres === null ||
    metres === undefined
  ) {
    return null;
  }

  return metres / 1000;
}


// =====================================================
// FETCH WEATHER
// =====================================================

async function fetchWeather(location) {

  showStatus(
    `Loading weather for ${location.name}...`
  );

  setLoadingState(true);


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


    const url =
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`;


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "Weather information could not be loaded."
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
      "Unable to load the weather. Please try another city.",
      "error"
    );

  }

  finally {

    setLoadingState(false);

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
      current.time.slice(0, 10)
    );


  // Current weather

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


  // High / Low

  todayHigh.textContent =
    `${convertTemperature(
      daily.temperature_2m_max[0]
    )}${getTemperatureUnit()}`;


  todayLow.textContent =
    `${convertTemperature(
      daily.temperature_2m_min[0]
    )}${getTemperatureUnit()}`;


  // Details

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
    getCurrentVisibility(data);


  visibility.textContent =
    currentVisibility !== null
      ? `${currentVisibility.toFixed(1)} km`
      : "Unavailable";


  sunrise.textContent =
    formatTime(
      daily.sunrise[0]
    );


  sunset.textContent =
    formatTime(
      daily.sunset[0]
    );


  renderForecast();

  updateFavouriteButton();

  renderFavourites();

}


// =====================================================
// FORECAST
// =====================================================

function renderForecast() {

  const daily =
    currentWeatherData.daily;


  forecastGrid.innerHTML = "";


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


      forecastGrid.appendChild(card);

    }
  );

}


// =====================================================
// LOADING EFFECT
// =====================================================

function setLoadingState(loading) {

  const cards =
    document.querySelectorAll(
      ".current-weather-card, .detail-card"
    );


  cards.forEach(card => {

    card.classList.toggle(
      "loading-pulse",
      loading
    );

  });

}


// =====================================================
// GEOCODING SEARCH
// =====================================================

async function searchCities(query) {

  const trimmed =
    query.trim();


  if (trimmed.length < 2) {

    clearSuggestions();

    return;
  }


  try {

    const params =
      new URLSearchParams({

        name: trimmed,

        count: "5",

        language: "en",

        format: "json"
      });


    const response =
      await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
      );


    if (!response.ok) {

      throw new Error(
        "Location search failed."
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


// =====================================================
// SEARCH SUGGESTIONS
// =====================================================

function renderSuggestions(results) {

  suggestionsBox.innerHTML = "";


  if (!results.length) {

    clearSuggestions();

    return;
  }


  results.forEach(result => {

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


    const areas =
      [
        result.admin1,
        result.country
      ].filter(Boolean);


    details.textContent =
      areas.join(", ");


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

        fetchWeather(location);

      }
    );


    suggestionsBox.appendChild(
      button
    );

  });


  suggestionsBox.classList.add(
    "show"
  );

}


function clearSuggestions() {

  suggestionsBox.innerHTML = "";

  suggestionsBox.classList.remove(
    "show"
  );

}


// =====================================================
// FIND FIRST SEARCH RESULT
// =====================================================

async function findCity(query) {

  const trimmed =
    query.trim();


  if (!trimmed) {
    return null;
  }


  const params =
    new URLSearchParams({

      name: trimmed,

      count: "1",

      language: "en",

      format: "json"
    });


  const response =
    await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
    );


  if (!response.ok) {

    throw new Error(
      "City search failed."
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
        await findCity(query);


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


// =====================================================
// LIVE SEARCH
// =====================================================

searchInput.addEventListener(
  "input",
  () => {

    clearTimeout(
      searchTimer
    );


    const query =
      searchInput.value;


    searchTimer =
      setTimeout(
        () => {

          searchCities(query);

        },
        350
      );

  }
);


// Close suggestions when clicking outside

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
        "Location access is not supported by your browser.",
        "error"
      );

      return;
    }


    showStatus(
      "Getting your current location..."
    );


    navigator.geolocation.getCurrentPosition(

      async position => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        const location = {

          name:
            "Current Location",

          country:
            "",

          latitude,

          longitude
        };


        await fetchWeather(
          location
        );

      },


      () => {

        showStatus(
          "Location access was not available. Search for your city instead.",
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
// TEMPERATURE UNIT TOGGLE
// =====================================================

unitButton.addEventListener(
  "click",
  () => {

    temperatureMode =
      temperatureMode === "C"
        ? "F"
        : "C";


    unitButton.textContent =
      temperatureMode === "C"
        ? "°C"
        : "°F";


    if (currentWeatherData) {

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
        STORAGE_KEY
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
    STORAGE_KEY,
    JSON.stringify(
      favourites
    )
  );

}


function locationKey(location) {

  return [
    Number(
      location.latitude
    ).toFixed(4),

    Number(
      location.longitude
    ).toFixed(4)
  ].join(",");

}


function isFavourite(location) {

  if (!location) {
    return false;
  }


  const key =
    locationKey(location);


  return getFavourites().some(
    favourite =>
      locationKey(favourite)
      === key
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


  favouriteButton.classList.toggle(
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

    if (!currentLocation) {
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
          locationKey(location)
          === key
      );


    if (exists) {

      favourites =
        favourites.filter(
          location =>
            locationKey(location)
            !== key
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
// DISPLAY FAVOURITES
// =====================================================

function renderFavourites() {

  const favourites =
    getFavourites();


  savedLocations.innerHTML = "";


  if (!favourites.length) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "empty-favourites";


    empty.innerHTML = `
      <span>☆</span>
      <p>
        Save your favourite cities for quick access.
      </p>
    `;


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


      card.tabIndex = 0;


      const name =
        document.createElement(
          "strong"
        );


      name.textContent =
        favourite.name;


      const locationDetails =
        document.createElement(
          "span"
        );


      locationDetails.textContent =
        [
          favourite.admin1,
          favourite.country
        ]
          .filter(Boolean)
          .join(", ")
          || "Saved location";


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
        locationDetails,
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
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            fetchWeather(
              favourite
            );

          }

        }
      );


      removeButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          const updated =
            getFavourites().filter(
              location =>
                locationKey(location)
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

const weatherCard =
  document.querySelector(
    ".current-weather-card"
  );


if (
  weatherCard &&
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches &&
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
) {

  weatherCard.addEventListener(
    "mousemove",
    event => {

      const rect =
        weatherCard.getBoundingClientRect();


      const x =
        event.clientX
        - rect.left;


      const y =
        event.clientY
        - rect.top;


      const rotateY =
        (
          x / rect.width
          - 0.5
        ) * 4;


      const rotateX =
        (
          0.5
          - y / rect.height
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
// INITIAL LOAD
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
      saved &&
      saved.latitude !== undefined &&
      saved.longitude !== undefined
    ) {

      return saved;

    }

  }

  catch {

    // Ignore invalid stored data.

  }


  return null;
}


async function initialiseApp() {

  renderFavourites();


  unitButton.textContent =
    "°C";


  const lastLocation =
    getLastLocation();


  await fetchWeather(
    lastLocation ||
    defaultLocation
  );

}


initialiseApp();
