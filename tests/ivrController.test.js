/**
 * Tests for IVR Controller
 */
const request = require('supertest');
const app = require('../src/index');
const voicePrompts = require('../src/utils/voicePrompts');
const twilioService = require('../src/services/twilioService');

// Mock the voicePrompts module
jest.mock('../src/utils/voicePrompts', () => ({
  welcomeMenu: jest.fn().mockReturnValue('<Response><Say>Welcome</Say></Response>'),
  dialNumber: jest.fn().mockReturnValue('<Response><Dial>123</Dial></Response>'),
  recordVoicemail: jest.fn().mockReturnValue('<Response><Record></Record></Response>'),
  voicemailComplete: jest.fn().mockReturnValue('<Response><Say>Thanks</Say></Response>'),
  invalidSelection: jest.fn().mockReturnValue('<Response><Say>Invalid</Say></Response>')
}));

// Mock the twilioService module
jest.mock('../src/services/twilioService', () => ({
  getPhoneNumberForDigit: jest.fn().mockImplementation(digit => {
    const phoneMap = {
      '1': '+15551234568',
      '2': '+15551234569',
      '3': '+15551234570',
      '0': '+15551234571'
    };
    return phoneMap[digit] || null;
  }),
  validateRequest: jest.fn().mockReturnValue(true)
}));

describe('IVR Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ivr/voice', () => {
    it('should return valid TwiML for incoming calls', async () => {
      const response = await request(app)
        .post('/ivr/voice')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(voicePrompts.welcomeMenu).toHaveBeenCalled();
      expect(response.text).toContain('<Response>');
    });
  });

  describe('POST /ivr/menu', () => {
    it('should dial English number when 1 is pressed', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(twilioService.getPhoneNumberForDigit).toHaveBeenCalledWith('1');
      expect(voicePrompts.dialNumber).toHaveBeenCalledWith('+15551234568');
    });

    it('should dial Haitian number when 2 is pressed', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=2')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(twilioService.getPhoneNumberForDigit).toHaveBeenCalledWith('2');
      expect(voicePrompts.dialNumber).toHaveBeenCalledWith('+15551234569');
    });

    it('should dial Spanish number when 3 is pressed', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=3')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(twilioService.getPhoneNumberForDigit).toHaveBeenCalledWith('3');
      expect(voicePrompts.dialNumber).toHaveBeenCalledWith('+15551234570');
    });

    it('should dial Support number when 0 is pressed', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=0')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(twilioService.getPhoneNumberForDigit).toHaveBeenCalledWith('0');
      expect(voicePrompts.dialNumber).toHaveBeenCalledWith('+15551234571');
    });

    it('should record voicemail when 9 is pressed', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=9')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(voicePrompts.recordVoicemail).toHaveBeenCalled();
    });

    it('should handle invalid selection', async () => {
      await request(app)
        .post('/ivr/menu')
        .send('Digits=7')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(voicePrompts.invalidSelection).toHaveBeenCalled();
    });
  });

  describe('POST /ivr/voicemail-complete', () => {
    it('should handle voicemail completion', async () => {
      await request(app)
        .post('/ivr/voicemail-complete')
        .send({
          RecordingSid: 'RE123',
          RecordingUrl: 'https://api.twilio.com/recordings/RE123'
        })
        .expect('Content-Type', /text\/xml/)
        .expect(200);
      
      expect(voicePrompts.voicemailComplete).toHaveBeenCalled();
    });
  });
});