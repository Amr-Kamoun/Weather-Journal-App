const apiKey = '5d73b34396a04d87a5903507241511'; // WeatherAPI.com API Key

// Fetch weather data from WeatherAPI.com
const getWeatherData = async (zipCode) => {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zipCode}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error.message || 'Error fetching weather data');
    }
  } catch (error) {
    alert(`Failed to fetch weather data: ${error.message}`);
    throw error;
  }
};

// Update UI by fetching data from the GET endpoint
const updateUI = async () => {
  try {
    const request = await fetch('/all');
    const allData = await request.json();
    if (allData) {
      document.getElementById('date').innerHTML = `Date: ${allData.date}`;
      document.getElementById('temp').innerHTML = `Temperature: ${Math.round(allData.temp)}°F`;
      document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
    }
  } catch (error) {
    console.error('Error updating UI:', error);
  }
};

// Handle the Generate button click event
document.getElementById('generate').addEventListener('click', async () => {
  const zipCode = document.getElementById('zip').value; // Fetch ZIP code from input
  const feelings = document.getElementById('feelings').value; // Fetch user feelings

  if (!zipCode || !feelings) {
    alert('Please enter both the ZIP code and your feelings.');
    return;
  }

  try {
    // Fetch weather data
    const weatherData = await getWeatherData(zipCode);

    // Create the data object to be sent to the server
    const dataToPost = {
      date: new Date().toLocaleDateString(),
      temp: weatherData.current.temp_f, // Temperature in Fahrenheit
      content: feelings,
    };

    // Send data to the server POST endpoint
    await fetch('/addData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToPost),
    });

    // Update the UI with the data fetched from the server
    updateUI();
  } catch (error) {
    console.error('Error:', error);
  }
});
