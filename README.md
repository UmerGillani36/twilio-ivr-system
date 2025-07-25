# Twilio IVR System

A multilingual Interactive Voice Response (IVR) system built with Node.js, Express, and the Twilio API. This system handles incoming phone calls, provides language options, routes calls to appropriate numbers, and allows callers to leave voicemail messages.

## Features

- Multilingual support (English, Haitian Creole, Spanish)
- Call routing to different phone numbers based on language selection
- Support line option
- Voicemail recording capability
- Error handling and fallback options

## Tech Stack

- Node.js (LTS)
- Express.js
- Twilio SDK
- Jest for testing

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Twilio account with a phone number
- ngrok (for local development and testing)

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd twilio-ivr-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Twilio credentials and phone numbers.

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Testing with ngrok

To test the IVR system with Twilio, you need to expose your local server to the internet using ngrok:

1. Start your application:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```

3. Copy the ngrok HTTPS URL (e.g., `https://a1b2c3d4.ngrok.io`).

4. Go to your Twilio phone number configuration in the Twilio console.

5. Set the webhook URL for voice calls to your ngrok URL followed by the IVR endpoint:
   ```
   https://a1b2c3d4.ngrok.io/ivr/voice
   ```

6. Save the configuration.

7. Call your Twilio phone number to test the IVR system.

## Running Tests

```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.js                 # Main server entry point
│   ├── routes/
│   │   └── ivr.js               # Express routes for IVR endpoints
│   ├── controllers/
│   │   └── ivrController.js     # Core IVR logic
│   ├── services/
│   │   └── twilioService.js     # Twilio API interactions
│   ├── utils/
│   │   └── voicePrompts.js      # TwiML builders
│   └── middlewares/
│       └── errorHandler.js      # Error handling middleware
├── tests/                       # Test files
├── .env                         # Environment variables
├── .env.example                 # Example environment variables
└── package.json                 # Project dependencies
```

## License

MIT#   t w i l i o - i v r - s y s t e m  
 