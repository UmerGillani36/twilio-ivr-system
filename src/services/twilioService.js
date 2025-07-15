/**
 * Twilio Service
 * Handles interactions with the Twilio API
 */
const twilio = require('twilio');
const config = require('../config');

// Initialize Twilio client
const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
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
    '1': config.twilio.phoneNumbers.english,
    '2': config.twilio.phoneNumbers.haitian,
    '3': config.twilio.phoneNumbers.spanish,
    '0': config.twilio.phoneNumbers.support
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
    config.twilio.authToken,
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