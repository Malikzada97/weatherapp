import { fetchCurrentWeather, fetchFiveDayForecast } from './api.js';
import { renderCurrentWeather, renderForecast, showLoading, hideLoading, renderSearchHistory, showError } from './ui.js';
import { manageSearchHistory } from './utils.js';

/**
 * Get user's current coordinates
 * @returns {Promise<{lat: number, lon: number}>} - Coordinates
 */
export const getCurrentCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    const options = {
      enableHighAccuracy: true, // Request the most accurate location
      timeout: 10000, // Wait up to 10 seconds for a result
      maximumAge: 0 // Don't use cached position
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Check if the accuracy is good enough (within 100 meters)
        if (position.coords.accuracy <= 100) {
          navigator.geolocation.clearWatch(watchId);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        }
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your device\'s location services.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
        }
        reject(new Error(errorMessage));
      },
      options
    );

    // Fallback to getCurrentPosition if watchPosition doesn't get accurate enough position
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable it in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device\'s location services.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get your location timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
          }
          reject(new Error(errorMessage));
        },
        options
      );
    }, 8000); // Fallback after 8 seconds
  });
};

/**
 * Fetch weather data for user's current location
 */
export const fetchWeatherForCurrentLocation = async () => {
  try {
    showLoading();
    const coords = await getCurrentCoords();
    
    // Log the accuracy for debugging
    console.log('Location accuracy:', coords.accuracy, 'meters');
    
    const weatherData = await fetchCurrentWeather(coords);
    const forecastData = await fetchFiveDayForecast(coords.lat, coords.lon);
    
    renderCurrentWeather(weatherData);
    renderForecast(forecastData);
    
    // Add to search history
    const updatedHistory = manageSearchHistory.add(weatherData.name);
    renderSearchHistory(updatedHistory);
  } catch (error) {
    console.error('Error fetching location weather:', error);
    showError(error.message || 'Failed to get accurate location. Please try again.');
    throw error;
  } finally {
    hideLoading();
  }
};