const apiKey = '5d73b34396a04d87a5903507241511'; 

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
    alert('Please enter both the ZIP code and your feelings.');
    return;
  }

  try {

    const weatherData = await getWeatherData(zipCode);

    const dataToPost = {
      date: new Date().toLocaleDateString(),
      temp: weatherData.current.temp_f, 
      content: feelings,
    };


    await fetch('/addData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToPost),
    });

    updateUI();
  } catch (error) {
    console.error('Error:', error);
  }
});
