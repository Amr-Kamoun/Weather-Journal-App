// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Import node-fetch for making API requests

// Start up an instance of the app
const app = express();

/* Middleware*/
// Configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Personal API Key for OpenWeatherMap API
const apiKey = 'YOUR_API_KEY_HERE'; // Replace 'YOUR_API_KEY_HERE' with your actual API key

// POST Route to add user input to projectData
app.post('/addData', (req, res) => {
  const { zipCode, feelings } = req.body;

  // URL for the OpenWeatherMap API request
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`;

  // Make a request to OpenWeatherMap API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        // If response from API is an error (e.g., invalid ZIP code)
        res.status(400).send({ message: data.message });
        return;
      }

      // Save data to projectData object
      projectData = {
        date: new Date().toLocaleDateString(),
        temp: data.main.temp,
        content: feelings,
      };

      // Send response
      res.send(projectData);
    })
    .catch(error => {
      console.error('Error fetching data from OpenWeatherMap:', error);
      res.status(500).send({ message: 'Failed to fetch weather data.' });
    });
});

// GET Route to retrieve projectData
app.get('/all', (req, res) => {
  res.send(projectData);
});
