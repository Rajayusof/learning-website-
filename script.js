// Frontend function that communicates with Node.js backend
async function greetUser() {
  const name = document.getElementById("username").value;
  const output = document.getElementById("output");
  
  // Show loading message
  output.textContent = "Loading...";
  output.style.color = "#666";
  
  try {
    // Send POST request to backend API
    const response = await fetch('/api/greet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.trim() })
    });
    
    const data = await response.json();
    
    if (data.success) {
      output.textContent = data.message;
      output.style.color = "#28a745";
      
      // Show timestamp
      const timeElement = document.getElementById("timestamp");
      if (timeElement) {
        timeElement.textContent = `Server time: ${data.timestamp}`;
      }
    } else {
      output.textContent = data.message;
      output.style.color = "#dc3545";
    }
    
  } catch (error) {
    output.textContent = "Error connecting to server!";
    output.style.color = "#dc3545";
    console.error('Error:', error);
  }
}

// Function to get server info
async function getServerInfo() {
  try {
    const response = await fetch('/api/info');
    const data = await response.json();
    
    const infoElement = document.getElementById("server-info");
    if (infoElement) {
      infoElement.innerHTML = `
        <strong>Server:</strong> ${data.server}<br>
        <strong>Uptime:</strong> ${Math.floor(data.uptime)} seconds<br>
        <strong>Last updated:</strong> ${new Date(data.timestamp).toLocaleString()}
      `;
    }
  } catch (error) {
    console.error('Error fetching server info:', error);
  }
}

// Load server info when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded - Backend powered by Node.js!');
  getServerInfo();
  
  // Allow Enter key to submit
  document.getElementById("username").addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      greetUser();
    }
  });
});
