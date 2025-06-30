# Sard-o-Garam

A modern, responsive weather application that provides current weather, 5-day forecasts, geolocation-based weather, and animated effects. Built for learning and demonstration purposes.

---

## 🌦️ Project Overview

WeatherSphere is a feature-rich weather app that leverages the OpenWeatherMap API to provide:
- Real-time weather conditions
- 5-day weather forecasts
- City search with autocomplete
- Geolocation support
- Animated weather effects (rain, snow, clouds)
- Dark mode and responsive design
- Search history and temperature unit toggle

This project is designed for educational and assignment use, with a focus on modern web development best practices.

---

## 🚀 Features

- **Current Weather:** Get up-to-date weather for any city or your current location.
- **5-Day Forecast:** View detailed forecasts for the next five days.
- **Geolocation:** Instantly fetch weather for your current position.
- **City Autocomplete:** Search with real-time city suggestions.
- **Animated Effects:** Visual rain, snow, and cloud animations based on weather.
- **Dark Mode:** Toggle between light and dark themes.
- **Temperature Units:** Switch between Celsius and Fahrenheit.
- **Search History:** Quickly revisit previous searches.
- **Responsive UI:** Works on desktop, tablet, and mobile.

---

## 🛠️ Technologies Used

- **HTML5**
- **Tailwind CSS**
- **JavaScript (ES6+)**
- **OpenWeatherMap API**
- **Netlify Functions** (for secure API calls in production)

---

## ⚡ Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables (optional for local):**
   ```bash
   npm run setup:env
   # Add your OpenWeatherMap API key to the .env file if not hardcoded
   ```
4. **Start the development server:**
   ```bash
   npm run watch:css   # In one terminal (for Tailwind CSS)
   npm start           # In another terminal (for the app)
   ```

### Netlify Deployment (Assignment/Demo Mode)

- The app is ready to deploy to Netlify with the API key hardcoded in `js/config.js` for demonstration purposes.
- **No environment variable setup is required for the assignment.**
- Just push your code to GitHub and connect your repository to Netlify.
- The app will work out-of-the-box after deployment.

---

## 🔑 API Key Handling (Assignment/Demo Mode)

- For this assignment/demo, the OpenWeatherMap API key is hardcoded in `js/config.js`:
  ```js
  OPENWEATHER_API_KEY: 'dacc36845acc003ff207a6e657a47718',
  ```
- **This is NOT recommended for production!**
- In a real deployment, use environment variables or Netlify Functions to keep your API key secure.

---

## 📝 Usage

1. **Search for a city:** Enter a city name and select from suggestions.
2. **Use geolocation:** Click the location button to get weather for your current position.
3. **Switch units:** Toggle between °C and °F.
4. **Toggle dark mode:** Use the dark mode button for a night-friendly UI.
5. **View search history:** Click previous cities to quickly reload their weather.

---

## 🛡️ Security Notes

- **API Key Exposure:** The API key is visible in client-side code for this assignment. Remove or rotate the key before sharing the code publicly.
- **Production Security:** For real-world use, always use environment variables and serverless functions to keep API keys secret.
- **.env File:** The `.env` file is ignored by git and not required for this assignment deployment.

---

## 🗂️ Project Structure

```
weather-app/
├── js/                # Main JavaScript source files
│   ├── config.js      # App configuration (API key here for assignment)
│   ├── api.js         # API interaction logic
│   └── ...
├── css/               # Styles (Tailwind CSS)
├── netlify/functions/ # Serverless function (for production security)
├── index.html         # Main HTML file
└── ...
```

---

## 🧩 Available Scripts

- `npm run setup:env` - Create and configure environment file
- `npm run validate:env` - Validate environment configuration
- `npm run build:css` - Build production CSS
- `npm run watch:css` - Watch and build CSS during development
- `npm start` - Start development server

---

## ❓ Troubleshooting

- **Weather not loading?**
  - Check your internet connection.
  - Make sure the API key in `js/config.js` is valid and active.
- **API key errors on Netlify?**
  - For this assignment, the key is hardcoded, so no environment variable setup is needed.
- **Other issues?**
  - Check the browser console for errors.
  - Review the configuration in `js/config.js`.

---

## 📢 License & Attribution

- This project is for educational and demonstration purposes only.
- Weather data provided by [OpenWeatherMap](https://openweathermap.org/).