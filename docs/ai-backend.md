# AI Correction Backend

## Overview

The app uses a **Cloudflare Worker** for AI-powered writing correction and speaking feedback. The Worker is hosted at:

```
https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev
```

The frontend never exposes any API keys. All AI requests go through this single proxy endpoint which holds the API key server-side.

## Configuration

Two environment variables configure the endpoints in `.env.local`:

```
VITE_AI_CORRECTION_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev
VITE_AI_SPEAKING_ENDPOINT=https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev
```

Both currently point to the same Worker URL. The code supports separate endpoints for future separation. If only `VITE_AI_CORRECTION_ENDPOINT` is set, speaking falls back to it.

## Frontend Integration

### aiCorrection.js (`src/utils/aiCorrection.js`)

Two main functions:

- **`correctWriting({ level, task, userAnswer })`** — Sends writing text for AI correction.
- **`correctSpeaking({ level, task, transcript })`** — Sends speaking transcript for AI feedback.

Helper functions:

- **`isCorrectionEnabled()`** — Returns true if `VITE_AI_CORRECTION_ENDPOINT` is set.
- **`isSpeakingCorrectionEnabled()`** — Returns true if either speaking or writing endpoint is set.

## API

### Writing Correction

**Request** (POST):

```json
{
  "type": "writing",
  "level": "A1|A2|B1|B2|C1",
  "task": "Writing prompt/task description",
  "userAnswer": "User's written text"
}
```

**Response**:

```json
{
  "score": 0-10,
  "rubric": { "grammar": 8, "vocabulary": 7, "organization": 9, "task_fulfillment": 9 },
  "mistakes": [{ "original": "...", "correction": "...", "explanation": "..." }],
  "correctedVersion": "Full corrected text",
  "improvedVersion": "Text rewritten at slightly higher CEFR level",
  "flashcards": [{ "front": "German phrase", "back": "English translation" }]
}
```

### Speaking Feedback

**Request** (POST):

```json
{
  "type": "speaking",
  "level": "A1|A2|B1|B2|C1",
  "task": "Speaking prompt/task",
  "transcript": "User's spoken answer transcript"
}
```

**Response**:

```json
{
  "score": 0-10,
  "rubric": { "pronunciation": 7, "grammar": 8, "fluency": 6, "vocabulary": 7 },
  "mistakes": [{ "original": "...", "correction": "...", "explanation": "..." }],
  "betterPhrases": ["More natural phrase 1", "More natural phrase 2"],
  "correctedTranscript": "Corrected version of their spoken answer",
  "strongerAnswer": "A sample stronger answer at their level",
  "phrasesToMemorize": ["Phrase 1", "Phrase 2"]
}
```

## Audio Recording

Audio recording uses the browser's **MediaRecorder API**. Audio files stay local — they are never uploaded to the Worker.

## Browser Speech Recognition

Both `SpeakingPage.jsx` and `DailyMissionPage.jsx` support **Web Speech API** for transcription:

- Uses `window.SpeechRecognition || window.webkitSpeechRecognition`
- German language (`de-DE`)
- Start/Stop buttons for controlling transcription
- Editable textarea so users can correct transcription errors
- Privacy note: "Your transcript is sent for AI feedback only when you click Get AI Speaking Feedback"
- Fallback: "Speech recognition is not supported in this browser. Type or paste your transcript instead."

## Future Options

The Worker does **not** support audio upload or server-side transcription. To add it:

- Add a `/transcribe` endpoint to the Worker using Whisper (via OpenAI or a self-hosted model)
- The frontend would send audio blob to the Worker, get back a transcript, then the user can review/edit before sending for AI feedback
- MediaRecorder produces webm/opus by default — compatibility check needed for Whisper input format

## Security Notes

- No API keys exist in frontend code or env vars committed to git
- `.env.local` is gitignored
- The Worker URL is public but only accepts POST with valid JSON
- The Worker itself holds the OpenAI (or other AI provider) API key server-side
- Never expose API keys in frontend code or commit them to the repo
