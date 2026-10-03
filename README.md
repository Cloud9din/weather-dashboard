# ☁️ SkyCast — Weather Dashboard

A modern, responsive and interactive weather dashboard built with **HTML, CSS and JavaScript** using live weather data from the **Open-Meteo API**.

SkyCast allows users to search for cities around the world, view current weather conditions, check a 5-day forecast, switch between Celsius and Fahrenheit, use their current location and save favourite cities for quick access.

---

## 🌐 Live Demo

[🚀 View Live Project](https://cloud9din.github.io/weather-dashboard/)

---

## ✨ Features

### 🔍 City Search

- Search for cities worldwide
- Live city suggestions while typing
- Displays city and country information
- Error handling for locations that cannot be found

### 🌤️ Current Weather

SkyCast displays:

- Current temperature
- Weather condition
- Feels-like temperature
- Daily high temperature
- Daily low temperature
- Humidity
- Wind speed
- Visibility
- Precipitation
- Sunrise
- Sunset

### 📅 5-Day Forecast

The dashboard automatically generates a five-day weather forecast showing:

- Day
- Weather condition
- Weather icon
- Maximum temperature
- Minimum temperature

### 🌍 Current Location

Users can select **Use my location** to retrieve weather information using their device location.

Browser location permission is required for this feature.

### ⭐ Favourite Locations

Users can:

- Save favourite cities
- Quickly reload saved locations
- Remove saved locations
- Keep favourites after refreshing the page

Favourite locations are stored using browser **LocalStorage**.

### 🌡️ Celsius / Fahrenheit

Users can instantly switch between:

```text
°C Celsius
°F Fahrenheit
```

All temperatures across the dashboard update automatically.

### 🎨 Dynamic Weather Themes

The appearance of SkyCast changes depending on the current weather.

```text
☀️ Clear     → Bright weather theme
☁️ Cloudy    → Cloudy blue-grey theme
🌧️ Rain      → Rainy blue theme
❄️ Snow      → Icy weather theme
🌙 Night     → Dark night theme
```

### ✨ Interactive Design

The interface includes:

- Animated background effects
- Floating weather icons
- Glass-style weather cards
- Smooth hover effects
- Loading animations
- Forecast card animations
- Interactive weather card movement
- Responsive layouts
- Reduced-motion accessibility support

---

## 🛠️ Technologies Used

- **HTML5** — application structure and semantic markup
- **CSS3** — responsive design, animations and dynamic themes
- **JavaScript** — application logic and DOM manipulation
- **Fetch API** — retrieving live weather information
- **Async / Await** — handling asynchronous API requests
- **Open-Meteo API** — live weather and forecast data
- **Open-Meteo Geocoding API** — city search
- **LocalStorage** — saved locations and preferences
- **Git & GitHub** — version control
- **GitHub Pages** — live deployment

---

## 🔄 How the Application Works

```text
User searches for a city
        ↓
Open-Meteo Geocoding API
        ↓
Latitude & Longitude
        ↓
Open-Meteo Weather API
        ↓
Receive JSON Weather Data
        ↓
JavaScript Processes Data
        ↓
Update Current Weather
        ↓
Generate 5-Day Forecast
        ↓
Apply Dynamic Weather Theme
```

---

## 📁 Project Structure

```text
weather-dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contains the structure of the weather dashboard including:

- Search interface
- Current weather panel
- Weather statistics
- Forecast section
- Saved locations
- Footer

### `style.css`

Contains:

- Responsive layouts
- Weather themes
- CSS animations
- Glass-effect cards
- Mobile styling
- Loading effects
- Hover interactions

### `script.js`

Handles:

- API requests
- City search
- Search suggestions
- Weather data processing
- Forecast generation
- Weather-code conversion
- Dynamic themes
- Celsius / Fahrenheit conversion
- Device location
- Favourite cities
- LocalStorage
- Loading and error handling

---

## 🔌 API Integration

SkyCast uses the **Open-Meteo API** for weather information.

The project uses two main API services:

### Geocoding

Converts a city search such as:

```text
Exeter
```

into location information such as:

```text
Latitude: 50.7184
Longitude: -3.5339
```

### Weather Forecast

The coordinates are then used to request:

```text
Current temperature
Feels-like temperature
Humidity
Wind speed
Precipitation
Visibility
Weather condition
Daily high / low
Sunrise
Sunset
5-day forecast
```

No API key is required for this project.

---

## 💾 LocalStorage

SkyCast uses LocalStorage to remember information inside the user's browser.

It stores:

```text
skycastFavourites
skycastLastLocation
```

This means favourite cities and the last viewed location can remain available after refreshing or reopening the application.

---

## 📱 Responsive Design

SkyCast has been designed for:

- Desktop computers
- Laptops
- Tablets
- Mobile phones

The dashboard automatically adjusts the weather cards, forecast layout and search interface depending on screen size.

---

## ♿ Accessibility

The project includes accessibility improvements such as:

- Semantic HTML
- ARIA labels
- Screen-reader-only labels
- Keyboard accessible favourite locations
- Status messages using `aria-live`
- Reduced animation support with `prefers-reduced-motion`

---

## 🧠 JavaScript Concepts Demonstrated

This project demonstrates practical use of:

- Variables and constants
- Functions
- Objects
- Arrays
- DOM manipulation
- Event listeners
- Template literals
- Conditional logic
- Array methods
- `fetch()`
- `async / await`
- JSON
- URLSearchParams
- LocalStorage
- Geolocation
- Dynamic HTML generation
- Error handling
- Debounced search
- Responsive user interaction

---

## 🚀 Run Locally

Clone the repository:

```bash
git clone https://github.com/Cloud9din/weather-dashboard.git
```

Open the project folder:

```bash
cd weather-dashboard
```

Then open:

```text
index.html
```

in your browser.

An internet connection is required to retrieve live weather information.

---

## 🧪 Testing

The application can be tested by:

1. Searching for different cities
2. Selecting a city from search suggestions
3. Checking current weather values
4. Checking the 5-day forecast
5. Switching between °C and °F
6. Saving a favourite location
7. Reloading the browser to confirm LocalStorage works
8. Removing a favourite
9. Testing the current-location feature
10. Searching for an invalid location
11. Testing desktop and mobile layouts

---

## 📸 Screenshots

Project screenshots will be added here.

### Weather Dashboard

weather-dashboard.png

### Mobile View

weather-dashboard-mobile.png

---

## 🎯 What I Learned

Building SkyCast helped me develop my understanding of:

- Working with external APIs
- Fetching and processing JSON data
- Asynchronous JavaScript
- Dynamic DOM updates
- Converting API weather codes into user-friendly information
- Building live search suggestions
- LocalStorage
- Browser geolocation
- Responsive web design
- CSS animations and transitions
- Error handling
- Creating an interactive user interface

---

## 🔮 Future Improvements

Possible future improvements include:

- Hourly weather forecast
- Weather charts
- Air quality information
- UV index
- Wind direction
- Weather alerts
- Recently searched cities
- Map integration
- Additional weather animations
- Dark/light mode control

---

## 👨‍💻 Developer

**Abu Lashkor**

GitHub: [Cloud9din](https://github.com/Cloud9din)

Built as part of my web development portfolio using **HTML, CSS and JavaScript**.

---

## 📌 Project Status

**Working Version**

- Live weather API ✅
- City search ✅
- Search suggestions ✅
- Current weather ✅
- 5-day forecast ✅
- Celsius / Fahrenheit ✅
- Current location ✅
- Favourite cities ✅
- LocalStorage ✅
- Dynamic weather themes ✅
- Error handling ✅
- Responsive design ✅
- GitHub Pages deployment ✅

---

⭐ If you find this project useful, feel free to explore the code and repository.
