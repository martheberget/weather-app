const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Endpoint where getCoordinatesByLocationName is called 
app.get('/getWeatherData', async (req, res) => {
    const location = req.query.userInput;
    try {
        const coordinates = await getCoordinatesByLocationName(location);
        const lat = coordinates[0].lat;
        const lon = coordinates[0].lon;
        const cityName = await getNameByCoordinates(lat, lon);
        const weatherData = await getDailyForecastByCoordinates(lat, lon);
      
        const combinedData = {
           city: cityName,
           weather: weatherData,
        }
        res.json(combinedData);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    (`Server running on port ${port}`);
})

async function getNameByCoordinates(lat, lon) {
  try {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.API_KEY}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Calls OpenWeather Geocoding API
async function getCoordinatesByLocationName(location) {
  try {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.API_KEY}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getDailyForecastByCoordinates(lat, lon) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${process.env.API_KEY}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}