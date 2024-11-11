const updateUI = async () => {
    try {
      const request = await fetch('/all');
      const allData = await request.json();
      console.log('UI data received:', allData);
  
      if (allData && allData.temp) {
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${Math.round(allData.temp)}°F`;
        document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
  
        document.getElementById('entryHolder').classList.add('active');
      }
    } catch (error) {
      console.error('Error updating UI:', error);
    }
  };
  
  document.getElementById('generate').addEventListener('click', () => {
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
  
    if (zipCode && feelings) {
      fetch('/addData', {
        method: 'POST',
        body: JSON.stringify({ zipCode, feelings }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())
        .then(() => {
          updateUI(); 
        })
        .catch(error => {
          console.error('Error making POST request:', error);
          alert('Failed to fetch weather data. Please check the zip code and try again.');
        });
    } else {
      alert('Please fill out both fields!');
    }
  });
  