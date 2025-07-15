const twilioService = require('../services/twilioService');
const config = require('../config');

const validateTwilioRequest = (req, res, next) => {
  if (config.env === 'test') return next();

  const isValid = twilioService.validateRequest(req);
  if (isValid) {
    return next();
  }

  return res.status(403).send('Forbidden: Invalid Twilio signature');
};

module.exports = validateTwilioRequest;
