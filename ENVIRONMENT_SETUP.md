# Environment Setup Guide

This guide explains how to properly configure environment variables and API keys for the Weather App.

## Overview

The Weather App has been refactored to use a centralized configuration system that supports:
- Environment variables via `.env` file
- Runtime configuration updates
- Secure API key management
- Development and production configurations

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment file:**
   ```bash
   npm run setup:env
   ```

3. **Configure your API key:**
   - Open the `.env` file
   - Replace `your_api_key_here` with your actual OpenWeatherMap API key
   - Save the file

4. **Validate configuration:**
   ```bash
   npm run validate:env
   ```

5. **Start the application:**
   ```bash
   npm start
   ```

## Configuration Files

### 1. `.env` File
The main environment configuration file (automatically added to `.gitignore`):

```env
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_actual_api_key_here

# App Configuration
NODE_ENV=development
PORT=3000

# Cache Configuration
CACHE_DURATION=600000

# Weather Effects Configuration
WEATHER_EFFECTS_RAIN_ENABLED=true
WEATHER_EFFECTS_RAIN_INTENSITY=0.5
WEATHER_EFFECTS_SNOW_ENABLED=true
WEATHER_EFFECTS_SNOW_INTENSITY=0.3
WEATHER_EFFECTS_CLOUDS_ENABLED=true
WEATHER_EFFECTS_CLOUDS_OPACITY=0.4
```

### 2. `js/config.js`
The main configuration file that reads from environment variables and provides fallbacks:

```javascript
import { getApiKey, getBaseUrl, config } from './config.js';

// Use configuration values
const API_KEY = getApiKey();
const BASE_URL = getBaseUrl();
```

## API Key Management

### Getting an API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key

### Setting the API Key
**Option 1: Using .env file (Recommended)**
```env
OPENWEATHER_API_KEY=your_actual_api_key_here
```

**Option 2: Direct configuration**
Edit `js/config.js`:
```javascript
OPENWEATHER_API_KEY: 'your_actual_api_key_here',
```

**Option 3: Runtime configuration**
```javascript
import { updateConfig } from './config.js';
updateConfig('OPENWEATHER_API_KEY', 'your_actual_api_key_here');
```

## Available Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENWEATHER_API_KEY` | (required) | Your OpenWeatherMap API key |
| `OPENWEATHER_BASE_URL` | `https://api.openweathermap.org/data/2.5` | OpenWeatherMap API base URL |
| `MAX_RETRIES` | `3` | Maximum API request retries |
| `RETRY_DELAY` | `1000` | Delay between retries (ms) |
| `CACHE_DURATION` | `600000` | Cache duration (10 minutes) |
| `ANIMATION_DURATION` | `300` | UI animation duration (ms) |
| `WEATHER_EFFECTS_RAIN_ENABLED` | `true` | Enable rain effects |
| `WEATHER_EFFECTS_SNOW_ENABLED` | `true` | Enable snow effects |
| `WEATHER_EFFECTS_CLOUDS_ENABLED` | `true` | Enable cloud effects |

## Security Best Practices

1. **Never commit API keys to version control**
   - The `.env` file is automatically ignored by git
   - Use environment variables in production

2. **Use different API keys for development and production**
   - Create separate API keys for different environments
   - Use environment-specific `.env` files

3. **Regularly rotate API keys**
   - Change your API keys periodically
   - Monitor API usage for security

4. **Limit API key permissions**
   - Only grant necessary permissions to your API key
   - Use API key restrictions if available

## Troubleshooting

### API Key Issues
- **Error: "Invalid API key"**
  - Verify your API key is correct
  - Check if the API key is active
  - Ensure you've waited for API key activation (may take a few hours)

- **Error: "API key not found"**
  - Check that the `.env` file exists
  - Verify the API key is properly set in the `.env` file
  - Run `npm run validate:env` to check configuration

### Configuration Issues
- **Changes not taking effect**
  - Restart the development server
  - Clear browser cache
  - Check browser console for errors

- **Environment variables not loading**
  - Ensure the `.env` file is in the project root
  - Check file permissions
  - Verify the file format (no spaces around `=`)

## Development vs Production

### Development
- Uses `.env` file for configuration
- Shows configuration warnings in console
- Supports runtime configuration updates

### Production
- Should use proper environment variable management
- Disable debug logging
- Use production API endpoints
- Implement proper error handling

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run setup:env` | Create and configure environment file |
| `npm run validate:env` | Validate environment configuration |
| `npm run build:css` | Build production CSS |
| `npm run watch:css` | Watch and build CSS during development |
| `npm start` | Start development server |

## Migration from Old Configuration

If you were previously using hardcoded API keys:

1. **Backup your current API key**
2. **Run the setup script:**
   ```bash
   npm run setup:env
   ```
3. **Add your API key to the `.env` file**
4. **Remove hardcoded keys from source files**
5. **Test the application**

The application will automatically use the new configuration system. 