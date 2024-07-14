// src/index.js
// Import necessary modules
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const authenticateJWT = require('./auth');
const { User } = require('./register');

const app = express();
// Initialize the cache with a standard TTL (Time To Live) of 1800 seconds (30 minutes)
const cache = new NodeCache({ stdTTL: 1800 });
const PORT = process.env.PORT || 3000;
const API_KEY = 'b3e23a88c8b2ea8f3b9d85ccc3d5eafc';
const CITIES = {
    'lisboa': '2267056',
    'leiria': 2267094,
    'coimbra': 2740636,
    'porto': 2735941,
    'faro': 2268337
};

app.use(cors());
app.use(bodyParser.json());

// Define the secret key for signing JWTs
const secret = 'jwt_secret';

// Register endpoint to create a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 4);
      await User.create({ username, password: hashedPassword });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  });

// Login endpoint to authenticate a user and issue a JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

/**
 * Route handler for fetching weather data for a specific city.
 * @param {string} city - The name of the city for which to fetch weather data.
 */
app.get('/weather/:city', authenticateJWT, async (req, res) => {
    const city = req.params.city.toLowerCase();
    // Check if the city is in the CITIES mapping
    if (!CITIES[city]) {
        return res.status(400).json({ error: 'City not found' });
    }

    const cacheKey = `weather_${city}`;
    // Check if the weather data for the city is already in the cache
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?id=${CITIES[city]}&APPID=${API_KEY}`);
        const weatherData = response.data;
        // Store the fetched weather data in the cache
        cache.set(cacheKey, weatherData);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({
            error: 'Error fetching weather data',
            message: error.message,
            stack: error.stack,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
