/**
 * Voice prompts utility
 * Builds TwiML responses for different IVR scenarios
 */
const { VoiceResponse } = require('twilio').twiml;
const config = require('../config');

/**
 * Creates the welcome menu TwiML
 * @returns {string} TwiML string
 */
const welcomeMenu = () => {
  console.log('Welcome is Called');
  const twiml = new VoiceResponse();
  twiml.say('Thank you for calling Ibridgge TRANSLATION, We prioritize your experience, We may record this call');
  const gather = twiml.gather({
    numDigits: 1,
    action: '/ivr/menu',
    method: 'POST',
    timeout: 10,
  });

  gather.say(
    'To continue in English, press 1, Pou kontinye an Kreyòl Ayisyen, peze 2. Para continuar en Español, presiona 3. For support, press 0. For other languages, please stay on the line!'
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

  twiml.dial(
    {
      callerId: config.twilio.phoneNumbers.main,
    },
    phoneNumber
  );

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
  
  twiml.say('Our agent are currently assisting other customer please stay on the line for the next available if you want to request a call back, please press 9 and leave your name and phone numbers');
  
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
