// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start up an instance of the app
const app = express();

/* Middleware */
// Configuring express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for cross-origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// POST Route to add user input to projectData
app.post('/addData', (req, res) => {
  try {
    const { date, temp, content } = req.body;
    if (!date || !temp || !content) {
      return res.status(400).send({ error: 'Missing required fields: date, temp, or content.' });
    }
    projectData = { date, temp, content };
    res.status(200).send({ message: 'Data added successfully', data: projectData });
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// GET Route to retrieve projectData
app.get('/all', (req, res) => {
  try {
    if (Object.keys(projectData).length === 0) {
      return res.status(404).send({ error: 'No data available' });
    }
    res.status(200).send(projectData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
