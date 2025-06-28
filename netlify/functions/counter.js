const fs = require('fs');
const path = require('path');

// Path to the visitors data file
const visitorsFile = path.join(__dirname, 'visitors.json');

// Function to safely read visitor data
function readVisitorsData() {
  try {
    if (fs.existsSync(visitorsFile)) {
      const data = fs.readFileSync(visitorsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading visitors data:', error);
  }
  
  // Return default data if file doesn't exist or can't be read
  return { 
    totalVisitors: 0, 
    todayVisitors: 0, 
    lastReset: new Date().toISOString() 
  };
}

// Function to safely write visitor data
function writeVisitorsData(data) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(visitorsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(visitorsFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing visitors data:', error);
    return false;
  }
}

// Function to check if we should reset daily count
function shouldResetDaily(lastReset) {
  try {
    const lastResetDate = new Date(lastReset);
    const currentDate = new Date();
    
    // Reset if it's a new day
    return lastResetDate.getDate() !== currentDate.getDate() ||
           lastResetDate.getMonth() !== currentDate.getMonth() ||
           lastResetDate.getFullYear() !== currentDate.getFullYear();
  } catch (error) {
    console.error('Error checking daily reset:', error);
    return true; // Reset if there's an error
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
    // Read existing data
    let visitorsData = readVisitorsData();
    
    // Ensure all required fields exist
    visitorsData = {
      totalVisitors: visitorsData.totalVisitors || 0,
      todayVisitors: visitorsData.todayVisitors || 0,
      lastReset: visitorsData.lastReset || new Date().toISOString()
    };
    
    // Check if we should reset today's count (new day)
    if (shouldResetDaily(visitorsData.lastReset)) {
      visitorsData.todayVisitors = 0;
      visitorsData.lastReset = new Date().toISOString();
    }
    
    // Increment both counters on every visit
    visitorsData.totalVisitors += 1;
    visitorsData.todayVisitors += 1;
    
    // Write updated data
    const writeSuccess = writeVisitorsData(visitorsData);
    
    if (!writeSuccess) {
      // If write fails, still return the incremented values
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          totalVisitors: visitorsData.totalVisitors,
          todayVisitors: visitorsData.todayVisitors,
          success: true,
          note: 'Data updated but not persisted'
        })
      };
    }

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
      statusCode: 200, // Return 200 instead of 500 to avoid breaking the frontend
      headers,
      body: JSON.stringify({ 
        totalVisitors: 1,
        todayVisitors: 1,
        success: true,
        note: 'Using fallback values due to error'
      })
    };
  }
};
