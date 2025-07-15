/**
 * Twilio Service
 * Handles interactions with the Twilio API
 */
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Get details about a recording
 * @param {string} recordingSid - The SID of the recording
 * @returns {Promise} Promise resolving to recording details
 */
const getRecordingDetails = async (recordingSid) => {
  try {
    return await client.recordings(recordingSid).fetch();
  } catch (error) {
    console.error('Error fetching recording details:', error);
    throw error;
  }
};

/**
 * Get the phone number to dial based on the digit pressed
 * @param {string} digit - The digit pressed by the caller
 * @returns {string|null} The phone number to dial or null if invalid
 */
const getPhoneNumberForDigit = (digit) => {
  const phoneMap = {
    '1': process.env.TWILIO_ENGLISH_NUMBER,
    '2': process.env.TWILIO_HAITIAN_NUMBER,
    '3': process.env.TWILIO_SPANISH_NUMBER,
    '0': process.env.TWILIO_SUPPORT_NUMBER
  };

  return phoneMap[digit] || null;
};

/**
 * Validate if a request is coming from Twilio
 * @param {Object} req - Express request object
 * @returns {boolean} True if the request is valid
 */
const validateRequest = (req) => {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  );
};

module.exports = {
  client,
  getRecordingDetails,
  getPhoneNumberForDigit,
  validateRequest
};