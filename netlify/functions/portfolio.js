const fs = require('fs');
const path = require('path');

exports.handler = async function (event) {
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
    // Read the portfolio data from the JSON file
    const portfolioPath = path.join(__dirname, '../../portfolio.json');
    
    if (!fs.existsSync(portfolioPath)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Portfolio data not found',
          success: false 
        })
      };
    }

    const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

    // Get query parameters for filtering
    const { category, subcategory } = event.queryStringParameters || {};

    let filteredData = portfolioData;

    // Filter by category if specified
    if (category && portfolioData[category]) {
      filteredData = { [category]: portfolioData[category] };
    }

    // Filter by subcategory if specified
    if (subcategory && filteredData[category] && filteredData[category][subcategory]) {
      filteredData = { 
        [category]: { 
          [subcategory]: filteredData[category][subcategory] 
        } 
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        data: filteredData,
        success: true 
      })
    };

  } catch (error) {
    console.error('Portfolio function error:', error);
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
