const fs = require('fs');
const path = require('path');

// Path to visitors data file
const visitorsFile = path.join(__dirname, 'visitors.json');

// Read JSON data
function readVisitorsData() {
  try {
    if (fs.existsSync(visitorsFile)) {
      return JSON.parse(fs.readFileSync(visitorsFile, 'utf-8'));
    }
  } catch (err) {
    console.error('Read error:', err);
  }
  return {
    count: 0,
    todayCount: 0,
    lastReset: new Date().toISOString()
  };
}

// Write JSON data
function writeVisitorsData(data) {
  try {
    fs.writeFileSync(visitorsFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Write error:', err);
  }
}

// Check if date needs reset
function shouldResetDaily(lastReset) {
  const last = new Date(lastReset);
  const now = new Date();
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  );
}

exports.handler = async function () {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    let data = readVisitorsData();

    if (shouldResetDaily(data.lastReset)) {
      data.todayCount = 0;
      data.lastReset = new Date().toISOString();
    }

    data.count += 1;
    data.todayCount += 1;

    writeVisitorsData(data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        count: data.count,
        todayCount: data.todayCount,
        success: true
      })
    };
  } catch (err) {
    console.error('Error in counter:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
