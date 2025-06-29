import { showError, showLoading, hideLoading } from './ui.js';
import { kelvinToCelsius, kelvinToFahrenheit, cache } from './utils.js';
import { getApiKey, getBaseUrl, config } from './config.js';

// Remove hardcoded constants and use config instead
const API_KEY = getApiKey();
const BASE_URL = getBaseUrl();
const MAX_RETRIES = config.MAX_RETRIES;
const RETRY_DELAY = config.RETRY_DELAY;

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in milliseconds
 */
const retry = async (fn, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

/**
 * Make API request - either to serverless function or direct API
 * @param {string|Object} location - City name or { lat, lon } coordinates
 * @param {string} type - 'current' or 'forecast'
 * @returns {Promise<Object>} - Weather data
 */
const makeApiRequest = async (location, type = 'current') => {
  if (config.USE_SERVERLESS) {
    // Use serverless function
    console.log(`🌐 Using serverless function for ${type} weather data`);
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, type })
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('Serverless function error:', errorData);
      throw new Error(errorData.error || `Failed to fetch weather data (${response.status})`);
    }
    
    return await response.json();
  } else {
    // Use direct API (for local development)
    console.log(`🌐 Using direct API for ${type} weather data`);
    
    let url;
    if (type === 'forecast') {
      if (typeof location === 'string') {
        // For forecast with city name, we need to get coordinates first
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
          throw new Error('City not found');
        }
        
        const { lat, lon } = geoData[0];
        url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      } else {
        url = `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
      }
    } else {
      if (typeof location === 'string') {
        url = `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}`;
      } else {
        url = `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;
      }
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    return await response.json();
  }
};

/**
 * Fetch current weather data for a city or coordinates
 * @param {string|Object} location - City name or { lat, lon } coordinates
 * @returns {Promise<Object>} - Weather data
 */
export const fetchCurrentWeather = async (location) => {
  try {
    showLoading();
    
    // Generate cache key
    const cacheKey = typeof location === 'string' 
      ? `weather_${location.toLowerCase()}`
      : `weather_${location.lat}_${location.lon}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      hideLoading();
      return cachedData;
    }
    
    const fetchData = async () => {
      const data = await makeApiRequest(location, 'current');
      
      // Cache the data
      cache.set(cacheKey, data);
      
      return data;
    };
    
    const data = await retry(fetchData);
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    showError(error.message || 'Failed to fetch weather data');
    throw error;
  } finally {
    hideLoading();
  }
};

/**
 * Fetch 5-day forecast data for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Forecast data
 */
export const fetchFiveDayForecast = async (lat, lon) => {
  try {
    showLoading();
    
    // Check cache first
    const cacheKey = `forecast_${lat}_${lon}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      hideLoading();
      return cachedData;
    }
    
    const fetchData = async () => {
      const data = await makeApiRequest({ lat, lon }, 'forecast');
      
      // Process forecast data to get one entry per day
      const dailyForecast = processForecastData(data.list);
      
      // Cache the processed data
      cache.set(cacheKey, dailyForecast);
      
      return dailyForecast;
    };
    
    const data = await retry(fetchData);
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    showError(error.message || 'Failed to fetch forecast data');
    throw error;
  } finally {
    hideLoading();
  }
};

/**
 * Process the 3-hour forecast data to get daily forecast
 * @param {Array} forecastList - Array of 3-hour forecast data
 * @returns {Array} - Processed daily forecast
 */
const processForecastData = (forecastList) => {
  const dailyForecast = [];
  const days = {};
  
  // Group forecasts by day
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString();
    
    if (!days[dayKey]) {
      days[dayKey] = {
        date: item.dt,
        temps: [],
        feels_like: [],
        humidity: [],
        weather: [],
        wind_speed: [],
      };
    }
    
    days[dayKey].temps.push(item.main.temp);
    days[dayKey].feels_like.push(item.main.feels_like);
    days[dayKey].humidity.push(item.main.humidity);
    days[dayKey].weather.push(item.weather[0]);
    days[dayKey].wind_speed.push(item.wind.speed);
  });
  
  // Process each day's data
  for (const dayKey in days) {
    const dayData = days[dayKey];
    
    // Get min/max temps
    const minTemp = Math.min(...dayData.temps);
    const maxTemp = Math.max(...dayData.temps);
    
    // Get average feels like
    const avgFeelsLike = dayData.feels_like.reduce((a, b) => a + b, 0) / dayData.feels_like.length;
    
    // Get most common weather condition
    const weatherCounts = {};
    dayData.weather.forEach(w => {
      const key = w.id;
      weatherCounts[key] = (weatherCounts[key] || 0) + 1;
    });
    const mostCommonWeather = dayData.weather.reduce((a, b) => 
      weatherCounts[a.id] > weatherCounts[b.id] ? a : b
    );
    
    // Get average humidity
    const avgHumidity = dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length;
    
    // Get average wind speed
    const avgWindSpeed = dayData.wind_speed.reduce((a, b) => a + b, 0) / dayData.wind_speed.length;
    
    dailyForecast.push({
      dt: dayData.date,
      temp: {
        min: minTemp,
        max: maxTemp,
        avg: (minTemp + maxTemp) / 2,
      },
      feels_like: avgFeelsLike,
      humidity: avgHumidity,
      weather: [mostCommonWeather],
      wind_speed: avgWindSpeed,
    });
  }
  
  // Return only the next 5 days (including today)
  return dailyForecast.slice(0, 5);
};