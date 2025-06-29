/**
 * Utility functions for the weather app
 */

// Format date to display
export const formatDate = (timestamp, options = {}) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
  };
  
  // Format time to display
  export const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Temperature conversions
  export const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);
  export const kelvinToFahrenheit = (kelvin) => Math.round((kelvin - 273.15) * 9/5 + 32);
  export const celsiusToFahrenheit = (celsius) => Math.round(celsius * 9/5 + 32);
  export const fahrenheitToCelsius = (fahrenheit) => Math.round((fahrenheit - 32) * 5/9);
  
  // Speed conversions
  export const metersPerSecondToKmPerHour = (mps) => Math.round(mps * 3.6);
  export const metersPerSecondToMilesPerHour = (mps) => Math.round(mps * 2.237);
  
  // Distance conversions
  export const metersToKilometers = (meters) => (meters / 1000).toFixed(1);
  export const metersToMiles = (meters) => (meters / 1609.34).toFixed(1);
  
  // Get weather icon based on OpenWeatherMap icon code
  export const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'clear-day',
      '01n': 'clear-night',
      '02d': 'partly-cloudy-day',
      '02n': 'partly-cloudy-night',
      '03d': 'cloudy',
      '03n': 'cloudy',
      '04d': 'overcast',
      '04n': 'overcast',
      '09d': 'rain',
      '09n': 'rain',
      '10d': 'drizzle',
      '10n': 'drizzle',
      '11d': 'thunderstorms',
      '11n': 'thunderstorms',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'mist',
      '50n': 'mist',
    };
    
    return iconMap[iconCode] || 'not-available';
  };
  
  // Get background based on weather condition
  export const getWeatherBackground = (condition) => {
    const backgrounds = {
      'clear': 'bg-gradient-to-br from-blue-400 to-blue-600',
      'cloudy': 'bg-gradient-to-br from-gray-400 to-gray-600',
      'rain': 'bg-gradient-to-br from-gray-500 to-gray-700',
      'snow': 'bg-gradient-to-br from-blue-100 to-blue-300',
      'thunderstorm': 'bg-gradient-to-br from-purple-700 to-gray-900',
      'drizzle': 'bg-gradient-to-br from-blue-300 to-blue-500',
      'mist': 'bg-gradient-to-br from-gray-300 to-gray-500',
      'default': 'bg-gradient-to-br from-blue-400 to-blue-600',
    };
    
    return backgrounds[condition.toLowerCase()] || backgrounds['default'];
  };
  
  // LocalStorage helpers
  export const storage = {
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    },
    remove: (key) => {
      localStorage.removeItem(key);
    }
  };
  
  // Manage search history
  export const manageSearchHistory = {
    get: () => storage.get('searchHistory') || [],
    add: (city) => {
      const history = manageSearchHistory.get();
      // Remove if already exists
      const updatedHistory = history.filter(item => item.toLowerCase() !== city.toLowerCase());
      // Add to beginning
      updatedHistory.unshift(city);
      // Keep only last 5 searches
      const limitedHistory = updatedHistory.slice(0, 5);
      storage.set('searchHistory', limitedHistory);
      return limitedHistory;
    },
    remove: (city) => {
      const history = manageSearchHistory.get();
      const updatedHistory = history.filter(item => item.toLowerCase() !== city.toLowerCase());
      storage.set('searchHistory', updatedHistory);
      return updatedHistory;
    }
  };
  
  // Get user preferences
  export const getUserPreferences = () => {
    return {
      unit: storage.get('preferredUnit') || 'celsius',
      darkMode: storage.get('darkMode') || false
    };
  };
  
  // Set user preferences
  export const setUserPreferences = (unit, darkMode) => {
    storage.set('preferredUnit', unit);
    storage.set('darkMode', darkMode);
  };
  
  // Cache utility
  export const cache = {
    set: (key, value, expirationMinutes = 30) => {
      const item = {
        value,
        expiry: new Date().getTime() + (expirationMinutes * 60 * 1000)
      };
      storage.set(`cache_${key}`, item);
    },
    
    get: (key) => {
      const item = storage.get(`cache_${key}`);
      if (!item) return null;
      
      if (new Date().getTime() > item.expiry) {
        storage.remove(`cache_${key}`);
        return null;
      }
      
      return item.value;
    },
    
    remove: (key) => {
      storage.remove(`cache_${key}`);
    }
  };