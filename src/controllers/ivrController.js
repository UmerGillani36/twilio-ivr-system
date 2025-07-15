const voicePrompts = require('../utils/voicePrompts');
const config = require('../config');

/**
 * Handle incoming voice calls
 */
const handleIncomingCall = (req, res, next) => {
  console.log('✅ Twilio hit /ivr/voice route');

  try {
    res.type('text/xml');
    res.send(voicePrompts.welcomeMenu()); // Use your real menu here
  } catch (error) {
    next(error);
  }
};

/**
 * Process menu selection
 */
const handleMenuSelection = (req, res) => {
  const digit = req.body.Digits;
  console.log(`☎️ Digit pressed: ${digit}`);

  res.type('text/xml');

  const phoneMap = {
    1: config.twilio.phoneNumbers.english,
    2: config.twilio.phoneNumbers.haitian,
    3: config.twilio.phoneNumbers.spanish,
    0: config.twilio.phoneNumbers.support,
  };

  if (phoneMap[digit]) {
    res.send(voicePrompts.dialNumber(phoneMap[digit]));
  } else if (digit === '9') {
    res.send(voicePrompts.recordVoicemail());
  } else {
    res.send(voicePrompts.invalidSelection());
  }
};

/**
 * Handle voicemail completion
 */
const handleVoicemailComplete = (req, res) => {
  const recordingSid = req.body.RecordingSid;
  const recordingUrl = req.body.RecordingUrl;

  console.log(`📩 Voicemail recorded: ${recordingSid} - ${recordingUrl}`);

  res.type('text/xml');
  res.send(voicePrompts.voicemailComplete());
};

/**
 * Handle fallback
 */
const handleFallback = (req, res) => {
  console.log('❌ Twilio hit fallback');

  res.type('text/xml');
  res.send(`
    <Response>
      <Say voice="alice" language="en-US">Sorry, something went wrong. Please try again later.</Say>
    </Response>
  `);
};

module.exports = {
  handleIncomingCall,
  handleMenuSelection,
  handleVoicemailComplete,
  handleFallback,
};
