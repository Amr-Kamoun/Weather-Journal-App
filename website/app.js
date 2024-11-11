const apiKey = 'Ye2ea705affe932c99d83e46d5bd8bedf'; 
const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`;

const getWeatherData = async (zipCode) => {
  const url = `${baseURL}${zipCode},us&appid=${apiKey}&units=imperial`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Error fetching weather data');
    }
  } catch (error) {
    alert(`Failed to fetch weather data: ${error.message}`);
    throw error;
  }
};


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

document.getElementById('generate').addEventListener('click', async () => {
  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  if (!zipCode || !feelings) {
    alert('Please enter both the zip code and your feelings.');
    return;
  }

  try {
    const weatherData = await getWeatherData(zipCode);
    const date = new Date().toLocaleDateString();
    await fetch('/addData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        temp: weatherData.main.temp,
        content: feelings,
      }),
    });
    updateUI();
  } catch (error) {
    console.error('Error:', error);
  }
});
