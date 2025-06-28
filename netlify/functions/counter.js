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
  return { count: 0, emailViews: 0, lastReset: new Date().toISOString() };
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
    // Get visitor IP and user agent for better tracking
    const ip = event.headers["x-forwarded-for"] || 
               event.headers["client-ip"] || 
               event.headers["x-real-ip"] || 
               "unknown";
    
    const userAgent = event.headers["user-agent"] || "unknown";
    const referer = event.headers["referer"] || "direct";
    
    // Clean IP (take first one if multiple)
    const cleanIP = ip.split(',')[0].trim();

    // Read existing data
    const visitorsData = readVisitorsData();
    
    // Check if we should reset daily count
    if (shouldResetDaily(visitorsData.lastReset)) {
      visitorsData.count = 0; // Reset daily count
      visitorsData.lastReset = new Date().toISOString();
    }
    
    // Always increment email views (every time someone visits)
    visitorsData.emailViews++;
    
    // Check if this is a new unique visitor for today
    const visitorKey = `${cleanIP}-${userAgent}`;
    if (!visitorsData.ips) {
      visitorsData.ips = [];
    }
    
    if (!visitorsData.ips.includes(visitorKey)) {
      visitorsData.ips.push(visitorKey);
      visitorsData.count++; // Increment unique visitors for today
    }
    
    // Write updated data
    writeVisitorsData(visitorsData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: visitorsData.count, // Daily unique visitors
        emailViews: visitorsData.emailViews, // Total email views
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