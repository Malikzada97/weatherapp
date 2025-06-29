import { 
    formatDate, 
    formatTime, 
    kelvinToCelsius, 
    kelvinToFahrenheit,
    metersPerSecondToKmPerHour,
    metersToKilometers,
    getWeatherIcon,
    getWeatherBackground,
    manageSearchHistory,
    getUserPreferences,
    setUserPreferences
  } from './utils.js';
  
  // DOM Elements
  const currentCityEl = document.getElementById('currentCity');
  const currentDateEl = document.getElementById('currentDate');
  const currentDescriptionEl = document.getElementById('currentDescription');
  const currentTempEl = document.getElementById('currentTemp');
  const currentFeelsLikeEl = document.getElementById('currentFeelsLike');
  const currentIconEl = document.getElementById('currentIcon');
  const currentHumidityEl = document.getElementById('currentHumidity');
  const currentWindEl = document.getElementById('currentWind');
  const currentPressureEl = document.getElementById('currentPressure');
  const currentVisibilityEl = document.getElementById('currentVisibility');
  const forecastContainerEl = document.getElementById('forecastContainer');
  const searchHistoryEl = document.getElementById('searchHistory');
  const unitToggleEl = document.getElementById('unitToggle');
  const darkModeToggleEl = document.getElementById('darkModeToggle');
  const darkModeIconEl = document.getElementById('darkModeIcon');
  const errorBannerEl = document.getElementById('errorBanner');
  const errorMessageEl = document.getElementById('errorMessage');
  const closeErrorBtnEl = document.getElementById('closeErrorBtn');
  const loadingSpinnerEl = document.getElementById('loadingSpinner');
  const weatherEffectsEl = document.getElementById('weatherEffects');
  const appEl = document.getElementById('app');
  
  let currentUnit = 'celsius';
  let currentKelvinTemp = null;
  let currentKelvinFeelsLike = null;
  
  /**
   * Render current weather data
   * @param {Object} data - Weather data from API
   * @param {string} [unit] - Temperature unit ('celsius' or 'fahrenheit')
   */
  export const renderCurrentWeather = (data, unit) => {
    const preferences = getUserPreferences();
    currentUnit = unit || preferences.unit;
    
    // Store original Kelvin temperatures
    currentKelvinTemp = data.main.temp;
    currentKelvinFeelsLike = data.main.feels_like;
    
    // Update city and date
    currentCityEl.textContent = `${data.name}, ${data.sys.country}`;
    currentCityEl.className = 'text-2xl font-bold dark:text-white animate-float';
    currentDateEl.textContent = formatDate(data.dt);
    
    // Update weather description
    const description = data.weather[0].description;
    currentDescriptionEl.textContent = description;
    currentDescriptionEl.className = 'text-gray-600 dark:text-gray-300 capitalize animate-pulse-slow';
    
    // Update temperature
    updateTemperatureDisplay(currentKelvinTemp, currentKelvinFeelsLike);
    
    // Update weather icon
    updateWeatherIcon(data.weather[0].icon);
    
    // Update other weather details
    currentHumidityEl.textContent = `${data.main.humidity}%`;
    currentHumidityEl.className = 'animate-shimmer';
    
    const windSpeed = currentUnit === 'celsius' 
      ? `${metersPerSecondToKmPerHour(data.wind.speed)} km/h`
      : `${Math.round(data.wind.speed * 2.237)} mph`;
    currentWindEl.textContent = windSpeed;
    currentWindEl.className = 'animate-shimmer';
    
    currentPressureEl.textContent = `${data.main.pressure} hPa`;
    currentPressureEl.className = 'animate-shimmer';
    
    const visibility = currentUnit === 'celsius'
      ? `${metersToKilometers(data.visibility)} km`
      : `${(data.visibility / 1609.34).toFixed(1)} mi`;
    currentVisibilityEl.textContent = visibility;
    currentVisibilityEl.className = 'animate-shimmer';
    
    // Update background based on weather condition
    updateWeatherBackground(data.weather[0].main);
    
    // Apply weather animations
    applyWeatherAnimation(data.weather[0].main);
  };
  
  /**
   * Update temperature display based on current unit
   * @param {number} temp - Temperature in Kelvin
   * @param {number} feelsLike - Feels like temperature in Kelvin
   */
  export const updateTemperatureDisplay = (temp, feelsLike) => {
    if (currentUnit === 'celsius') {
      currentTempEl.textContent = `${kelvinToCelsius(temp)}°C`;
      currentFeelsLikeEl.textContent = `Feels like ${kelvinToCelsius(feelsLike)}°C`;
    } else {
      currentTempEl.textContent = `${kelvinToFahrenheit(temp)}°F`;
      currentFeelsLikeEl.textContent = `Feels like ${kelvinToFahrenheit(feelsLike)}°F`;
    }
  };
  
  /**
   * Update weather icon display
   * @param {string} iconCode - OpenWeatherMap icon code
   */
  const updateWeatherIcon = (iconCode) => {
    const iconName = getWeatherIcon(iconCode);
    
    // In a real app, you would use actual SVG icons or a weather icon font
    // For this example, we'll use emojis as placeholders
    const iconMap = {
      'clear-day': '☀️',
      'clear-night': '🌙',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '☁️',
      'cloudy': '☁️',
      'overcast': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorms': '⛈️',
      'snow': '❄️',
      'mist': '🌫️',
      'not-available': '🌈'
    };
    
    currentIconEl.innerHTML = `<span class="text-6xl">${iconMap[iconName]}</span>`;
  };
  
  /**
   * Update weather background based on condition
   * @param {string} condition - Weather condition (e.g., 'Clear', 'Rain')
   */
  const updateWeatherBackground = (condition) => {
    const timeOfDay = new Date().getHours();
    const isNight = timeOfDay < 6 || timeOfDay > 18;

    switch (condition) {
      case 'clear':
        return isNight ? 'bg-weather-night' : 'bg-weather-clear';
      case 'clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return 'bg-weather-cloudy';
      case 'rain':
      case 'drizzle':
      case 'shower rain':
        return 'bg-weather-rain';
      case 'snow':
        return 'bg-weather-snow';
      case 'thunderstorm':
        return 'bg-weather-storm';
      case 'mist':
      case 'fog':
        return 'bg-weather-cloudy';
      default:
        return isNight ? 'bg-weather-night' : 'bg-weather-clear';
    }
  };
  
  /**
   * Render 5-day forecast
   * @param {Array} forecastData - Array of forecast data
   */
  export const renderForecast = (forecastData) => {
    forecastContainerEl.innerHTML = '';
    
    forecastData.forEach((day, index) => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const iconName = getWeatherIcon(day.weather[0].icon);
      
      // Temperature display based on current unit
      const minTemp = currentUnit === 'celsius' 
        ? kelvinToCelsius(day.temp.min)
        : kelvinToFahrenheit(day.temp.min);
      const maxTemp = currentUnit === 'celsius' 
        ? kelvinToCelsius(day.temp.max)
        : kelvinToFahrenheit(day.temp.max);
      
      const forecastCard = document.createElement('div');
      forecastCard.className = 'forecast-card';
      forecastCard.innerHTML = `
        <div class="text-center">
          <p class="font-semibold ${index === 0 ? 'text-yellow-500' : 'dark:text-white'}">${index === 0 ? 'Today' : dayName}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">${dateStr}</p>
          <div class="my-3 text-4xl">${getWeatherEmoji(iconName)}</div>
          <p class="text-gray-500 dark:text-gray-400 capitalize">${day.weather[0].description}</p>
          <div class="mt-2 flex justify-center gap-2">
            <span class="font-bold dark:text-white">${maxTemp}°</span>
            <span class="text-gray-500 dark:text-gray-400">${minTemp}°</span>
          </div>
        </div>
      `;
      
      forecastContainerEl.appendChild(forecastCard);
    });
  };
  
  // Helper function to get weather emoji
  const getWeatherEmoji = (iconName) => {
    const emojiMap = {
      'clear-day': '☀️',
      'clear-night': '🌙',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '☁️',
      'cloudy': '☁️',
      'overcast': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorms': '⛈️',
      'snow': '❄️',
      'mist': '🌫️',
      'not-available': '🌈'
    };
    return emojiMap[iconName] || '🌈';
  };
  
  /**
   * Render search history
   * @param {Array} history - Array of search history items
   */
  export const renderSearchHistory = (history) => {
    if (!history || history.length === 0) {
      searchHistoryEl.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">Your search history will appear here</p>';
      return;
    }
    
    searchHistoryEl.innerHTML = '';
    
    history.forEach(city => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <span class="dark:text-white">${city}</span>
        <button class="text-gray-500 hover:text-red-500 delete-history-btn" data-city="${city}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      `;
      
      searchHistoryEl.appendChild(historyItem);
    });
  };
  
  /**
   * Toggle temperature unit between Celsius and Fahrenheit
   */
  export const toggleTemperatureUnit = () => {
    currentUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    unitToggleEl.textContent = currentUnit === 'celsius' ? '°C' : '°F';
    setUserPreferences(currentUnit, document.documentElement.classList.contains('dark'));
    
    // Update temperature display using stored Kelvin values
    if (currentKelvinTemp !== null && currentKelvinFeelsLike !== null) {
      updateTemperatureDisplay(currentKelvinTemp, currentKelvinFeelsLike);
    }
  };
  
  /**
   * Toggle dark mode
   */
  export const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    
    // Update icon
    if (isDark) {
      darkModeIconEl.setAttribute('d', 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z');
    } else {
      darkModeIconEl.setAttribute('d', 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z');
    }
    
    // Save preference
    setUserPreferences(currentUnit, isDark);
  };
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  export const showError = (message) => {
    errorMessageEl.textContent = message;
    errorBannerEl.classList.remove('hidden');
    errorBannerEl.classList.add('animate-fade-in');
  };
  
  /**
   * Hide error message
   */
  export const hideError = () => {
    errorBannerEl.classList.add('animate-fade-out');
    setTimeout(() => {
      errorBannerEl.classList.add('hidden');
      errorBannerEl.classList.remove('animate-fade-out', 'animate-fade-in');
    }, 500);
  };
  
  /**
   * Show loading spinner
   */
  export const showLoading = () => {
    loadingSpinnerEl.classList.remove('hidden');
  };
  
  /**
   * Hide loading spinner
   */
  export const hideLoading = () => {
    loadingSpinnerEl.classList.add('hidden');
  };
  
  /**
   * Apply weather animations based on condition
   * @param {string} condition - Weather condition (e.g., 'Rain', 'Snow')
   */
  const applyWeatherAnimation = (condition) => {
    // Clear previous animations
    weatherEffectsEl.innerHTML = '';
    weatherEffectsEl.className = 'fixed inset-0 pointer-events-none z-0 opacity-0 transition-opacity duration-500';
    
    let animationClass = '';
    
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        createRainEffect();
        animationClass = 'opacity-70';
        break;
      case 'snow':
        createSnowEffect();
        animationClass = 'opacity-60';
        break;
      case 'clear':
        createSunEffect();
        animationClass = 'opacity-40';
        break;
      case 'clouds':
        createCloudEffect();
        animationClass = 'opacity-30';
        break;
      default:
        return;
    }
    
    setTimeout(() => {
      weatherEffectsEl.className = `fixed inset-0 pointer-events-none z-0 ${animationClass} transition-opacity duration-500`;
    }, 10);
  };
  
  // Create rain animation effect
  const createRainEffect = () => {
    for (let i = 0; i < 50; i++) {
      const raindrop = document.createElement('div');
      raindrop.className = 'raindrop';
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.top = `${Math.random() * 100}%`;
      raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      raindrop.style.animationDelay = `${Math.random() * 0.5}s`;
      raindrop.style.opacity = `${0.6 + Math.random() * 0.4}`;
      weatherEffectsEl.appendChild(raindrop);
    }
  };
  
  // Create snow animation effect
  const createSnowEffect = () => {
    for (let i = 0; i < 30; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.top = `${Math.random() * 100}%`;
      snowflake.style.width = `${4 + Math.random() * 4}px`;
      snowflake.style.height = snowflake.style.width;
      snowflake.style.animationDuration = `${5 + Math.random() * 5}s`;
      snowflake.style.animationDelay = `${Math.random() * 2}s`;
      weatherEffectsEl.appendChild(snowflake);
    }
  };
  
  // Create sun animation effect
  const createSunEffect = () => {
    // Create container for sunny weather effects
    const sunnyWeather = document.createElement('div');
    sunnyWeather.className = 'sunny-weather';

    // Create the sun
    const sun = document.createElement('div');
    sun.className = 'sun';
    sunnyWeather.appendChild(sun);

    // Create sun rays container
    const sunRaysContainer = document.createElement('div');
    sunRaysContainer.className = 'sun-rays-container';

    // Create multiple sun rays
    for (let i = 0; i < 12; i++) {
      const ray = document.createElement('div');
      ray.className = 'sun-ray';
      ray.style.transform = `rotate(${i * 30}deg)`;
      ray.style.left = '50%';
      ray.style.bottom = '50%';
      sunRaysContainer.appendChild(ray);
    }
    sunnyWeather.appendChild(sunRaysContainer);

    // Create heat wave effect
    const heatWave = document.createElement('div');
    heatWave.className = 'heat-wave';
    sunnyWeather.appendChild(heatWave);

    weatherEffectsEl.appendChild(sunnyWeather);
  };
  
  // Create cloud animation effect
  const createCloudEffect = () => {
    for (let i = 0; i < 5; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.width = `${100 + Math.random() * 100}px`;
      cloud.style.height = `${60 + Math.random() * 40}px`;
      cloud.style.left = `${Math.random() * 100}%`;
      cloud.style.top = `${Math.random() * 30}%`;
      cloud.style.animationDuration = `${30 + Math.random() * 30}s`;
      cloud.style.animationDelay = `${Math.random() * 10}s`;
      weatherEffectsEl.appendChild(cloud);
    }
  };
  
  // Initialize UI
  export const initUI = () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Load user preferences
    const preferences = getUserPreferences();
    currentUnit = preferences.unit;
    unitToggleEl.textContent = currentUnit === 'celsius' ? '°C' : '°F';
    
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
      darkModeIconEl.setAttribute('d', 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z');
    }
    
    // Load search history
    const history = manageSearchHistory.get();
    renderSearchHistory(history);
  };