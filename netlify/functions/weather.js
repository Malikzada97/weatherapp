const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { location, type = 'current' } = requestData;
    
    if (!location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Location is required' })
      };
    }

    // Get API key from environment
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API key not configured. Please add OPENWEATHER_API_KEY to your Netlify environment variables.' 
        })
      };
    }

    let url;
    if (type === 'forecast') {
      // For forecast, we need lat/lon
      if (typeof location === 'string') {
        // First get coordinates for the city
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) {
          const geoError = await geoResponse.json();
          return {
            statusCode: geoResponse.status,
            headers,
            body: JSON.stringify({ error: `Geocoding error: ${geoError.message || 'Failed to get coordinates'}` })
          };
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.length) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'City not found' })
          };
        }
        
        const { lat, lon } = geoData[0];
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`;
      }
    } else {
      // Current weather
      if (typeof location === 'string') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}`;
      }
    }

    console.log(`Making request to: ${url.replace(apiKey, '[API_KEY_HIDDEN]')}`);
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Weather API error:', data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: data.message || 'Weather API error',
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Weather function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
}; 