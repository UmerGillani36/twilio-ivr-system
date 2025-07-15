/**
 * IVR Controller
 * Handles the core IVR logic for the Twilio phone system
 */
const voicePrompts = require('../utils/voicePrompts');
const twilioService = require('../services/twilioService');

/**
 * Handle incoming voice calls
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleIncomingCall = (req, res) => {
  res.type('text/xml');
  res.send(voicePrompts.welcomeMenu());
};

/**
 * Process menu selection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleMenuSelection = (req, res) => {
  const digit = req.body.Digits;
  res.type('text/xml');

  switch (digit) {
    case '1':
    case '2':
    case '3':
    case '0':
      const phoneNumber = twilioService.getPhoneNumberForDigit(digit);
      res.send(voicePrompts.dialNumber(phoneNumber));
      break;
    case '9':
      res.send(voicePrompts.recordVoicemail());
      break;
    default:
      res.send(voicePrompts.invalidSelection());
      break;
  }
};

/**
 * Handle voicemail completion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleVoicemailComplete = (req, res) => {
  // The recording is automatically stored on Twilio
  // We can access details about the recording if needed
  const recordingSid = req.body.RecordingSid;
  const recordingUrl = req.body.RecordingUrl;
  
  console.log(`Voicemail recorded: ${recordingSid} - ${recordingUrl}`);
  
  res.type('text/xml');
  res.send(voicePrompts.voicemailComplete());
};

/**
 * Handle fallback for any errors or unexpected inputs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleFallback = (req, res) => {
  res.type('text/xml');
  res.send(voicePrompts.invalidSelection());
};

module.exports = {
  handleIncomingCall,
  handleMenuSelection,
  handleVoicemailComplete,
  handleFallback
};