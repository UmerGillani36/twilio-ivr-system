/**
 * Main entry point for the Twilio IVR System
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const ivrRoutes = require('./routes/ivr');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const validateTwilioRequest = require('./middlewares/twilioValidator');
// Initialize Express app
const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

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