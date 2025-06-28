const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, service, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Name, email, and message are required',
          success: false 
        })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid email format',
          success: false 
        })
      };
    }

    // Create email content
    const emailContent = `
      New Contact Form Submission from Auro Graphics Website
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Service: ${service || 'Not specified'}
      
      Message:
      ${message}
      
      Submitted on: ${new Date().toLocaleString()}
    `;

    // For now, we'll just log the submission
    // In production, you would configure email sending here
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      service,
      message,
      timestamp: new Date().toISOString()
    });

    // You can also store in a database or send to a webhook
    // For now, we'll return success

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Thank you for your message! We will get back to you soon.',
        success: true 
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
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