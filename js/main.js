import { fetchCurrentWeather, fetchFiveDayForecast } from './api.js';
import { fetchWeatherForCurrentLocation } from './geolocation.js';
import { 
  renderCurrentWeather, 
  renderForecast, 
  renderSearchHistory,
  toggleTemperatureUnit,
  toggleDarkMode,
  showError,
  hideError,
  initUI,
  showLoading,
  hideLoading
} from './ui.js';
import { manageSearchHistory } from './utils.js';
import { getApiKey } from './config.js';

// Initialize the UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  
  // Cache DOM elements
  const searchBtn = document.getElementById('searchBtn');
  const citySearch = document.getElementById('citySearch');
  const locationBtn = document.getElementById('locationBtn');
  const unitToggle = document.getElementById('unitToggle');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const closeErrorBtn = document.getElementById('closeErrorBtn');
  const searchHistory = document.getElementById('searchHistory');
  
  // Create suggestions container
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 hidden';
  citySearch.parentElement.appendChild(suggestionsContainer);
  
  // Event listeners
  searchBtn.addEventListener('click', () => handleSearch());
  citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      suggestionsContainer.classList.add('hidden');
      handleSearch();
    }
  });
  
  // Handle input for suggestions
  citySearch.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      suggestionsContainer.classList.add('hidden');
      return;
    }
    
    try {
      const suggestions = await fetchCitySuggestions(query);
      showSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!citySearch.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.classList.add('hidden');
    }
  });
  
  locationBtn.addEventListener('click', handleLocation);
  unitToggle.addEventListener('click', toggleTemperatureUnit);
  darkModeToggle.addEventListener('click', toggleDarkMode);
  closeErrorBtn.addEventListener('click', hideError);
  
  // Delegated event listener for search history items
  searchHistory.addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item');
    const deleteBtn = e.target.closest('.delete-history-btn');
    
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const city = deleteBtn.dataset.city;
      const updatedHistory = manageSearchHistory.remove(city);
      renderSearchHistory(updatedHistory);
    } else if (historyItem) {
      const city = historyItem.querySelector('span').textContent;
      handleSearch(city);
    }
  });
  
  // Load last searched city or default city
  const history = manageSearchHistory.get();
  if (history.length > 0) {
    handleSearch(history[0]);
  } else {
    handleSearch('London'); // Default city
  }
});

/**
 * Fetch city suggestions from OpenWeatherMap API
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of city suggestions
 */
const fetchCitySuggestions = async (query) => {
  const API_KEY = getApiKey();
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  
  const data = await response.json();
  return data.map(city => ({
    name: city.name,
    country: city.country,
    state: city.state,
    lat: city.lat,
    lon: city.lon
  }));
};

/**
 * Show city suggestions in the UI
 * @param {Array} suggestions - Array of city suggestions
 */
const showSuggestions = (suggestions) => {
  const suggestionsContainer = document.querySelector('.absolute.top-full');
  suggestionsContainer.innerHTML = '';
  
  if (suggestions.length === 0) {
    suggestionsContainer.classList.add('hidden');
    return;
  }
  
  suggestions.forEach(city => {
    const suggestion = document.createElement('div');
    suggestion.className = 'p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
    suggestion.innerHTML = `
      <div class="font-medium dark:text-white">${city.name}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        ${city.state ? `${city.state}, ` : ''}${city.country}
      </div>
    `;
    
    suggestion.addEventListener('click', () => {
      document.getElementById('citySearch').value = city.name;
      suggestionsContainer.classList.add('hidden');
      handleSearch(city.name);
    });
    
    suggestionsContainer.appendChild(suggestion);
  });
  
  suggestionsContainer.classList.remove('hidden');
};

/**
 * Handle city search
 * @param {string} [city] - Optional city to search for (used when clicking history)
 */
const handleSearch = async (city) => {
  const cityInput = document.getElementById('citySearch');
  const searchCity = city || cityInput.value.trim();
  
  if (!searchCity) {
    showError('Please enter a city name');
    return;
  }
  
  try {
    showLoading();
    const weatherData = await fetchCurrentWeather(searchCity);
    const forecastData = await fetchFiveDayForecast(weatherData.coord.lat, weatherData.coord.lon);
    
    // Render weather data
    renderCurrentWeather(weatherData);
    renderForecast(forecastData);
    
    // Add to search history
    const updatedHistory = manageSearchHistory.add(weatherData.name);
    renderSearchHistory(updatedHistory);
    
    // Clear search input if this was a manual search
    if (!city) cityInput.value = '';
  } catch (error) {
    console.error('Error searching for city:', error);
    showError(error.message || 'Failed to fetch weather data');
  } finally {
    hideLoading();
  }
};

/**
 * Handle location-based weather
 */
const handleLocation = async () => {
  try {
    showLoading();
    await fetchWeatherForCurrentLocation();
  } catch (error) {
    console.error('Error getting location weather:', error);
    showError(error.message || 'Failed to get location weather');
  } finally {
    hideLoading();
  }
};