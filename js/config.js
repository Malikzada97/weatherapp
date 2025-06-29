// Configuration file for the weather app
// This file manages all configuration values including API keys

// Check if we're on Netlify (production) or local development
const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('netlify.com');

// Try to get environment variables (for build-time processing)
const getEnvVar = (key) => {
  // In a browser environment, process.env might not be available
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // For development, you can also check localStorage
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
  }
  return '';
};

export const config = {
  // API Configuration
  USE_SERVERLESS: isNetlify, // Use serverless function on Netlify
  SERVERLESS_URL: '/.netlify/functions/weather',
  
  // OpenWeatherMap API Configuration (for local development)
  OPENWEATHER_API_KEY: getEnvVar('OPENWEATHER_API_KEY'),
  OPENWEATHER_BASE_URL: getEnvVar('OPENWEATHER_BASE_URL') || 'https://api.openweathermap.org/data/2.5',
  
  // App Configuration
  MAX_RETRIES: parseInt(getEnvVar('MAX_RETRIES') || '3'),
  RETRY_DELAY: parseInt(getEnvVar('RETRY_DELAY') || '1000'), // 1 second
  
  // Cache Configuration
  CACHE_DURATION: parseInt(getEnvVar('CACHE_DURATION') || '600000'), // 10 minutes in milliseconds
  
  // UI Configuration
  ANIMATION_DURATION: parseInt(getEnvVar('ANIMATION_DURATION') || '300'),
  
  // Weather Effects Configuration
  WEATHER_EFFECTS: {
    RAIN: {
      enabled: getEnvVar('WEATHER_EFFECTS_RAIN_ENABLED') === 'true',
      intensity: parseFloat(getEnvVar('WEATHER_EFFECTS_RAIN_INTENSITY') || '0.5')
    },
    SNOW: {
      enabled: getEnvVar('WEATHER_EFFECTS_SNOW_ENABLED') === 'true',
      intensity: parseFloat(getEnvVar('WEATHER_EFFECTS_SNOW_INTENSITY') || '0.3')
    },
    CLOUDS: {
      enabled: getEnvVar('WEATHER_EFFECTS_CLOUDS_ENABLED') === 'true',
      opacity: parseFloat(getEnvVar('WEATHER_EFFECTS_CLOUDS_OPACITY') || '0.4')
    }
  }
};

// Helper function to get API key with validation
export const getApiKey = () => {
  // If using serverless function, we don't need the API key on client side
  if (config.USE_SERVERLESS) {
    return 'serverless';
  }
  
  const apiKey = config.OPENWEATHER_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('⚠️  Please configure your OpenWeatherMap API key in the .env file or localStorage');
    console.warn('📝 Get your free API key at: https://openweathermap.org/api');
  }
  
  return apiKey;
};

// Helper function to get base URL
export const getBaseUrl = () => {
  if (config.USE_SERVERLESS) {
    return config.SERVERLESS_URL;
  }
  return config.OPENWEATHER_BASE_URL;
};

// Helper function to update configuration at runtime
export const updateConfig = (key, value) => {
  if (config.hasOwnProperty(key)) {
    config[key] = value;
    
    // Store in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
    
    return true;
  }
  return false;
};

// Helper function to get all configuration
export const getAllConfig = () => {
  return { ...config };
};

// Development helper to log configuration
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  console.log('🔧 Weather App Configuration:', config);
}

// Configuration validation helper
export const validateConfig = () => {
  const validation = {
    isNetlify: config.USE_SERVERLESS,
    hasApiKey: config.USE_SERVERLESS ? 'serverless' : (config.OPENWEATHER_API_KEY ? 'local' : 'missing'),
    baseUrl: config.USE_SERVERLESS ? config.SERVERLESS_URL : config.OPENWEATHER_BASE_URL,
    environment: window.location.hostname
  };
  
  console.log('🔍 Configuration Validation:', validation);
  
  if (config.USE_SERVERLESS) {
    console.log('✅ Running on Netlify - using serverless functions');
  } else {
    if (!config.OPENWEATHER_API_KEY || config.OPENWEATHER_API_KEY === 'your_api_key_here') {
      console.warn('⚠️  Local development: API key not configured');
    } else {
      console.log('✅ Local development: API key configured');
    }
  }
  
  return validation;
};

// Auto-validate on load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateConfig);
  } else {
    validateConfig();
  }
} 