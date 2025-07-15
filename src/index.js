/**
 * Main entry point for the Twilio IVR System
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ivrRoutes = require('./routes/ivr');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/ivr', ivrRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Twilio IVR System is running!');
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`IVR webhook URL: http://localhost:${PORT}/ivr/voice`);
  console.log('Note: Use ngrok to expose this server to the internet for Twilio webhooks');
});

module.exports = app; // Export for testing