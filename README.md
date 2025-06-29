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
- Secure API key handling with serverless functions

## Technologies

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- OpenWeatherMap API
- Netlify Functions (for secure API calls)

## Setup

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `npm run setup:env`
4. Add your OpenWeatherMap API key to the `.env` file
5. Validate environment setup: `npm run validate:env`
6. Start development server: `npm run watch:css` (in one terminal) and `npm start` (in another terminal)

### Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. In Netlify dashboard, go to Site Settings > Environment Variables
4. Add environment variable:
   - Key: `OPENWEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
5. Deploy your site

The app automatically detects when it's running on Netlify and uses serverless functions to keep your API key secure.

## API Key Configuration

### Local Development
1. Run `npm run setup:env` to create the `.env` file
2. Add your OpenWeatherMap API key to the `.env` file:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
3. The application will automatically use the key from the `.env` file

### Netlify Deployment
1. Go to your Netlify dashboard
2. Navigate to Site Settings > Environment Variables
3. Add a new environment variable:
   - Key: `OPENWEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
4. Redeploy your site

### Security Features
- API keys are never exposed to the client-side code on Netlify
- Serverless functions handle all API calls securely
- Local development still works with direct API calls for convenience

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
- On Netlify, API calls are handled by serverless functions to keep keys secure

## Available Scripts

- `npm run setup:env` - Create and configure environment file
- `npm run validate:env` - Validate environment configuration
- `npm run build:css` - Build production CSS
- `npm run watch:css` - Watch and build CSS during development
- `npm start` - Start development server

## Troubleshooting

### "Invalid API key" error on Netlify
1. Make sure you've added the `OPENWEATHER_API_KEY` environment variable in Netlify dashboard
2. Check that the API key is correct and active
3. Redeploy your site after adding the environment variable

### Local development issues
1. Ensure your `.env` file exists and contains the correct API key
2. Run `npm run validate:env` to check your configuration
3. Make sure you're running the latest version of Node.js