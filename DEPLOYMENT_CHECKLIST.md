# Netlify Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Go to Netlify Dashboard → Site Settings → Environment Variables
- [ ] Add environment variable:
  - **Key**: `OPENWEATHER_API_KEY`
  - **Value**: Your actual OpenWeatherMap API key
- [ ] Click **Save**

### 2. File Structure Verification
Ensure these files exist in your repository:
- [ ] `netlify/functions/weather.js` - Serverless function
- [ ] `netlify/functions/package.json` - Function dependencies
- [ ] `js/config.js` - Updated configuration
- [ ] `js/api.js` - Updated API functions
- [ ] `package.json` - Main dependencies (includes node-fetch)

### 3. Code Verification
- [ ] Configuration detects Netlify environment correctly
- [ ] API functions use serverless function on Netlify
- [ ] Error handling is in place
- [ ] CORS headers are configured

## 🚀 Deployment Steps

### Step 1: Deploy to Netlify
1. Push your code to GitHub
2. Connect repository to Netlify (if not already done)
3. Deploy the site

### Step 2: Verify Environment Variables
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Confirm `OPENWEATHER_API_KEY` is set correctly
3. Note: Changes to environment variables require a redeploy

### Step 3: Test the Application
1. Visit your deployed site
2. Open browser developer tools (F12)
3. Check console for configuration validation messages
4. Search for a city (e.g., "London")
5. Verify weather data loads without errors

## 🔍 Debugging Steps

### If you still get "Invalid API key" error:

#### 1. Check Environment Variables
```bash
# In Netlify Dashboard:
Site Settings → Environment Variables
# Verify OPENWEATHER_API_KEY is set
```

#### 2. Check Function Logs
```bash
# In Netlify Dashboard:
Functions → weather → View function logs
# Look for any error messages
```

#### 3. Check Browser Console
```javascript
// Open browser console and look for:
🔍 Configuration Validation: { isNetlify: true, hasApiKey: "serverless", ... }
🌐 Using serverless function for current weather data
```

#### 4. Test Function Directly
```bash
# Use curl to test the function:
curl -X POST https://your-site.netlify.app/.netlify/functions/weather \
  -H "Content-Type: application/json" \
  -d '{"location":"London","type":"current"}'
```

### Common Issues and Solutions

#### Issue: "API key not configured" error
**Solution**: Add `OPENWEATHER_API_KEY` to Netlify environment variables

#### Issue: Function not found (404)
**Solution**: Ensure `netlify/functions/weather.js` exists in your repository

#### Issue: CORS errors
**Solution**: The function includes CORS headers, but check if your domain is correct

#### Issue: Function timeout
**Solution**: The function should complete within Netlify's timeout limits

## 📊 Expected Behavior

### On Netlify (Production):
- ✅ Console shows: "Running on Netlify - using serverless functions"
- ✅ API calls go to: `/.netlify/functions/weather`
- ✅ No API key exposed in client-side code
- ✅ Weather data loads successfully

### On Local Development:
- ✅ Console shows: "Local development: API key configured"
- ✅ API calls go directly to OpenWeatherMap API
- ✅ Uses `.env` file for API key

## 🔧 Manual Testing

### Test Current Weather:
1. Search for "London"
2. Should show current weather data
3. Check console for success messages

### Test Forecast:
1. Search for "New York"
2. Should show 5-day forecast
3. Check console for success messages

### Test Geolocation:
1. Allow location access
2. Should show weather for your location
3. Check console for success messages

## 📞 Support

If issues persist:
1. Check Netlify function logs
2. Verify API key is active on OpenWeatherMap
3. Test with a simple curl request
4. Check browser console for detailed error messages

## 🎯 Success Criteria

- [ ] Weather data loads on Netlify without "Invalid API key" errors
- [ ] Console shows "Running on Netlify - using serverless functions"
- [ ] All features work (current weather, forecast, geolocation)
- [ ] No API key exposed in browser network tab
- [ ] Local development still works with `.env` file 