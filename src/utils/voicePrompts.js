/**
 * Voice prompts utility
 * Builds TwiML responses for different IVR scenarios
 */
const { VoiceResponse } = require('twilio').twiml;

/**
 * Creates the welcome menu TwiML
 * @returns {string} TwiML string
 */
const welcomeMenu = () => {
  const twiml = new VoiceResponse();
  
  const gather = twiml.gather({
    numDigits: 1,
    action: '/ivr/menu',
    method: 'POST',
    timeout: 10
  });
  
  gather.say(
    'Press 1 for English, 2 for Haitian Creole, 3 for Spanish, 0 for Support, or 9 to leave a voicemail.'
  );

  // If no input is received, repeat the menu
  twiml.redirect('/ivr/voice');
  
  return twiml.toString();
};

/**
 * Creates TwiML to dial a specific number
 * @param {string} phoneNumber - The phone number to dial
 * @returns {string} TwiML string
 */
const dialNumber = (phoneNumber) => {
  const twiml = new VoiceResponse();
  
  twiml.dial({
    callerId: process.env.TWILIO_PHONE_MAIN
  }, phoneNumber);
  
  // If the call fails or ends, redirect to the main menu
  twiml.redirect('/ivr/voice');
  
  return twiml.toString();
};

/**
 * Creates TwiML to record a voicemail
 * @returns {string} TwiML string
 */
const recordVoicemail = () => {
  const twiml = new VoiceResponse();
  
  twiml.say('Please leave your message after the beep. Press any key or stop talking to end the recording.');
  
  twiml.record({
    action: '/ivr/voicemail-complete',
    method: 'POST',
    maxLength: 120,
    finishOnKey: '1234567890*#',
    transcribe: false
  });
  
  // If the caller doesn't record a message
  twiml.say('No message recorded. Goodbye.');
  twiml.hangup();
  
  return twiml.toString();
};

/**
 * Creates TwiML for after voicemail is recorded
 * @returns {string} TwiML string
 */
const voicemailComplete = () => {
  const twiml = new VoiceResponse();
  
  twiml.say('Thanks for your message. Goodbye.');
  twiml.hangup();
  
  return twiml.toString();
};

/**
 * Creates TwiML for invalid menu selection
 * @returns {string} TwiML string
 */
const invalidSelection = () => {
  const twiml = new VoiceResponse();
  
  twiml.say('Sorry, that\'s not a valid option.');
  twiml.redirect('/ivr/voice');
  
  return twiml.toString();
};

module.exports = {
  welcomeMenu,
  dialNumber,
  recordVoicemail,
  voicemailComplete,
  invalidSelection
};