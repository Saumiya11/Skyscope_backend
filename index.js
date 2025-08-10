require('dotenv').config();
console.log('API KEY:', process.env.OPENWEATHER_API_KEY);  // Confirm API key is loaded

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors()); // Enable CORS

// Use global fetch if Node.js version >=18, else import node-fetch dynamically
let fetchFunc;
try {
  fetchFunc = fetch; // global fetch (Node 18+)
} catch {
  fetchFunc = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

app.get('/weather/current', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City parameter is required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    console.log('Fetching URL:', url);

    const response = await fetchFunc(url);
    const data = await response.json();
    console.log('OpenWeather response:', data);

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/weather/forecast', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City parameter is required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    console.log('Fetching URL:', url);

    const response = await fetchFunc(url);
    const data = await response.json();
    console.log('OpenWeather forecast response:', data);

    if (data.cod !== "200") {
      return res.status(400).json({ error: data.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Fetch forecast error:', err);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});app.get('/weather/currentByCoords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${API_KEY}&units=metric`;
    const response = await fetchFunc(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Coords current error:', err);
    res.status(500).json({ error: 'Failed to fetch weather by coords' });
  }
});

app.get('/weather/forecastByCoords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${API_KEY}&units=metric`;
    const response = await fetchFunc(url);
    const data = await response.json();

    if (data.cod !== "200") {
      return res.status(400).json({ error: data.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Coords forecast error:', err);
    res.status(500).json({ error: 'Failed to fetch forecast by coords' });
  }
});
