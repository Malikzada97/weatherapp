# Netlify Deployment Guide

## Fixing the "Invalid API key" Error

If you're getting an "Invalid API key" error on Netlify, follow these steps:

### Step 1: Add Environment Variable in Netlify

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your weather app site
3. Go to **Site Settings** > **Environment Variables**
4. Click **Add a variable**
5. Set:
   - **Key**: `OPENWEATHER_API_KEY`
   - **Value**: Your actual OpenWeatherMap API key
6. Click **Save**

### Step 2: Redeploy Your Site

1. Go to the **Deploys** tab in your Netlify dashboard
2. Click **Trigger deploy** > **Deploy site**
3. Wait for the deployment to complete

### Step 3: Verify the Fix

1. Visit your deployed site
2. Try searching for a city
3. The weather data should now load without errors

## How It Works

The app now uses a **serverless function** approach:

- **Local Development**: Uses direct API calls with your `.env` file
- **Netlify Production**: Uses serverless functions that keep your API key secure

### Security Benefits

- ✅ API key is never exposed to client-side code
- ✅ Environment variables are secure on Netlify
- ✅ Local development still works seamlessly
- ✅ No need to modify code between environments

## Troubleshooting

### Still getting API key errors?

1. **Check the environment variable name**: It must be exactly `OPENWEATHER_API_KEY`
2. **Verify your API key**: Make sure it's active and correct
3. **Redeploy after adding the variable**: Changes require a new deployment
4. **Check Netlify function logs**: Go to Functions tab to see any errors

### Local development issues?

1. Make sure you have a `.env` file with your API key
2. Run `npm run validate:env` to check configuration
3. The app automatically detects local vs production environment

## File Structure

```
weather-app/
├── netlify/
│   └── functions/
│       └── weather.js          # Serverless function
├── js/
│   ├── config.js              # Updated to use serverless on Netlify
│   └── api.js                 # Updated to call serverless function
└── package.json               # Added node-fetch dependency
```

## Next Steps

After fixing the API key issue:

1. Test all features on your deployed site
2. Consider adding more environment variables for customization
3. Monitor your API usage on OpenWeatherMap dashboard
4. Set up automatic deployments from your Git repository 