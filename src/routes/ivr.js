/**
 * IVR Routes
 * Handles routing for Twilio webhook endpoints
 */
const express = require('express');
const router = express.Router();
const ivrController = require('../controllers/ivrController');

/**
 * POST /ivr/voice
 * Entry point for incoming calls
 */
router.post('/voice', ivrController.handleIncomingCall);

/**
 * POST /ivr/menu
 * Processes digit selection from the welcome menu
 */
router.post('/menu', ivrController.handleMenuSelection);

/**
 * POST /ivr/voicemail-complete
 * Handles completion of voicemail recording
 */
router.post('/voicemail-complete', ivrController.handleVoicemailComplete);

/**
 * POST /ivr/fallback
 * Fallback route for any errors or unexpected inputs
 */
router.post('/fallback', ivrController.handleFallback);

module.exports = router;