const fs = require('fs');
const path = require('path');

// Path to the visitors data file
const visitorsFile = path.join(__dirname, 'visitors.json');

// Function to read visitor data
function readVisitorsData() {
  try {
    if (fs.existsSync(visitorsFile)) {
      const data = fs.readFileSync(visitorsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading visitors data:', error);
  }
  return { count: 0, ips: [] };
}

// Function to write visitor data
function writeVisitorsData(data) {
  try {
    fs.writeFileSync(visitorsFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing visitors data:', error);
    return false;
  }
}

exports.handler = async function (event) {
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get visitor IP
    const ip = event.headers["x-forwarded-for"] || 
               event.headers["client-ip"] || 
               event.headers["x-real-ip"] || 
               "unknown";
    
    // Clean IP (take first one if multiple)
    const cleanIP = ip.split(',')[0].trim();

    // Read existing data
    const visitorsData = readVisitorsData();
    
    // Check if this IP is new
    if (!visitorsData.ips.includes(cleanIP)) {
      visitorsData.ips.push(cleanIP);
      visitorsData.count = visitorsData.ips.length;
      
      // Write updated data
      writeVisitorsData(visitorsData);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: visitorsData.count,
        success: true 
      })
    };
  } catch (error) {
    console.error('Counter function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      })
    };
  }
};
