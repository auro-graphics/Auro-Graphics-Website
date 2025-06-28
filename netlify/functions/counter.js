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
  return { 
    totalVisitors: 0, 
    todayVisitors: 0, 
    lastReset: new Date().toISOString() 
  };
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

// Function to check if we should reset daily count
function shouldResetDaily(lastReset) {
  const lastResetDate = new Date(lastReset);
  const currentDate = new Date();
  
  // Reset if it's a new day
  return lastResetDate.getDate() !== currentDate.getDate() ||
         lastResetDate.getMonth() !== currentDate.getMonth() ||
         lastResetDate.getFullYear() !== currentDate.getFullYear();
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
    // Read existing data
    const visitorsData = readVisitorsData();
    
    // Check if we should reset today's count (new day)
    if (shouldResetDaily(visitorsData.lastReset)) {
      visitorsData.todayVisitors = 0; // Reset today's count
      visitorsData.lastReset = new Date().toISOString();
    }
    
    // Increment both counters on every visit
    visitorsData.totalVisitors++; // Total visitors (never resets)
    visitorsData.todayVisitors++; // Today's visitors (resets daily)
    
    // Write updated data
    writeVisitorsData(visitorsData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        totalVisitors: visitorsData.totalVisitors,
        todayVisitors: visitorsData.todayVisitors,
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
