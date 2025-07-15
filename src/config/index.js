require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumbers: {
      main: process.env.TWILIO_PHONE_MAIN,
      english: process.env.TWILIO_ENGLISH_NUMBER,
      haitian: process.env.TWILIO_HAITIAN_NUMBER,
      spanish: process.env.TWILIO_SPANISH_NUMBER,
      support: process.env.TWILIO_SUPPORT_NUMBER,
    },
  },
  env: process.env.NODE_ENV || 'development',
};
