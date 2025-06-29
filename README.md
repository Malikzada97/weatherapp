# WeatherSphere

A modern weather application with 5-day forecast, geolocation, and animated effects.

## Features

- Current weather conditions
- 5-day forecast
- Geolocation support
- Temperature unit toggle (°C/°F)
- Dark mode
- Search history
- Weather-specific animations
- Responsive design

## Technologies

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- OpenWeatherMap API

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `npm run setup:env`
4. Add your OpenWeatherMap API key to the `.env` file
5. Validate environment setup: `npm run validate:env`
6. Start development server: `npm run watch:css` (in one terminal) and `npm start` (in another terminal)

## API Key Configuration

### Option 1: Using .env file (Recommended)
1. Run `npm run setup:env` to create the `.env` file
2. Add your OpenWeatherMap API key to the `.env` file:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
3. The application will automatically use the key from the `.env` file

### Option 2: Direct configuration
If you prefer to configure directly in the code:
1. Open `js/config.js`
2. Replace the `OPENWEATHER_API_KEY` value with your actual API key
3. Save the file

## Environment Variables

The application supports the following environment variables:

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 3000)
- `CACHE_DURATION`: Cache duration in milliseconds (default: 600000)

## Security Notes

- The `.env` file is automatically added to `.gitignore` to prevent API keys from being committed
- Never commit your actual API keys to version control
- For production deployments, use proper environment variable management

## Available Scripts

- `npm run setup:env` - Create and configure environment file
- `npm run validate:env` - Validate environment configuration
- `npm run build:css` - Build production CSS
- `npm run watch:css` - Watch and build CSS during development
- `npm start` - Start development server