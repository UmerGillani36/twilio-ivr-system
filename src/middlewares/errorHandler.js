/**
 * Error handling middleware
 * Catches errors and sends appropriate responses
 */
const { VoiceResponse } = require('twilio').twiml;

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  // Check if the request is from Twilio
  const isTwilioRequest = req.path.startsWith('/ivr');

  if (isTwilioRequest) {
    // Return TwiML response for Twilio requests
    const twiml = new VoiceResponse();
    twiml.say('We are experiencing technical difficulties. Please try again later.');
    twiml.hangup();
    
    return res.type('text/xml').send(twiml.toString());
  }

  // For regular API requests
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  });
};

module.exports = errorHandler;