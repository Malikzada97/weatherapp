module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  safelist: [
    'bg-weather-primary',
    'bg-weather-secondary',
    'dark:bg-weather-primary',
    'dark:bg-weather-secondary'
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors for different weather conditions
        'weather': {
          'primary': '#2B3A67',    // Main header/footer color
          'secondary': '#1A1B4B',  // Secondary header/footer color
          'clear': '#47BFDF',      // Bright blue for clear skies
          'cloudy': '#4A91FF',     // Soft blue for cloudy weather
          'rain': '#5B9BD5',       // Deep blue for rainy weather
          'snow': '#7B9EA8',       // Cool blue-gray for snow
          'storm': '#2B3A67',      // Dark blue for storms
          'sunny': '#FFB347',      // Warm orange for sunny weather
          'night': '#1A1B4B',      // Deep blue for night time
        },
        // UI colors
        'ui': {
          'primary': '#2B3A67',    // Main UI color
          'secondary': '#1A1B4B',  // Secondary UI color
          'accent': '#FFB347',     // Accent color for highlights
          'light': '#F5F7FA',      // Light background
          'dark': '#1A1B4B',       // Dark background
        },
        // Weather condition specific colors
        'condition': {
          'sunny': '#FFB347',      // Warm orange for sunny
          'partly-cloudy': '#4A91FF', // Light blue for partly cloudy
          'cloudy': '#5B9BD5',     // Medium blue for cloudy
          'rain': '#2B3A67',       // Dark blue for rain
          'snow': '#7B9EA8',       // Cool blue-gray for snow
          'storm': '#1A1B4B',      // Dark blue for storms
          'fog': '#A9B4C2',        // Gray for fog
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-out': 'fade-out 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}