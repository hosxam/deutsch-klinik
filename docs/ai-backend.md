# AI Backend Endpoint Contract

The Deutsch Klinik app uses a Cloudflare Worker as its AI backend. The Worker handles three request types: writing correction, speaking feedback, and audio transcription.

## Deployed Worker URL

```
https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev
```

## Endpoint Contract

### Single endpoint handles all three types:

```
POST /
Content-Type: application/json       (for writing/speaking)
Content-Type: multipart/form-data     (for transcription)
```

## 1. Writing Correction

### Request

```json
{
  "type": "writing",
  "level": "B1",
  "task": "Write an email to your doctor...",
  "userAnswer": "Sehr geehrte Frau Dr. Schmidt..."
}
```

### Response

```json
{
  "score": 7,
  "rubric": {
    "grammar": "good",
    "vocabulary": "adequate",
    "structure": "good",
    "taskCompletion": "complete"
  },
  "mistakes": [
    {
      "original": "Ich haben",
      "corrected": "Ich habe",
      "explanation": "Subject-verb agreement: 'Ich' takes 'habe' (1st person singular)"
    }
  ],
  "correctedVersion": "Full corrected version of the text...",
  "improvedVersion": "Improved version at CEFR B1...",
  "flashcards": [
    { "german": "der Termin", "english": "the appointment" }
  ]
}
```

## 2. Speaking Feedback

### Request

```json
{
  "type": "speaking",
  "level": "B1",
  "task": "Describe your symptoms to a doctor",
  "transcript": "Ich habe seit zwei Tagen Kopfschmerzen..."
}
```

### Response

```json
{
  "score": 6,
  "rubric": {
    "fluency": "adequate",
    "grammar": "good",
    "vocabulary": "adequate",
    "pronunciation": "good"
  },
  "mistakes": [
    {
      "original": "Ich hat",
      "corrected": "Ich habe",
      "explanation": "'Ich' takes 'habe'"
    }
  ],
  "betterPhrases": [
    {
      "original": "mein Kopf tut weh",
      "better": "Ich habe Kopfschmerzen",
      "explanation": "More natural and idiomatic"
    }
  ],
  "correctedTranscript": "Full corrected transcript...",
  "strongerAnswer": "Improved sample answer...",
  "phrasesToMemorize": [
    { "german": "Ich leide unter...", "english": "I suffer from..." }
  ]
}
```

## 3. Audio Transcription (Whisper)

### Request

```
POST /
Content-Type: multipart/form-data

Fields:
- type: "transcription" (string)
- audio: <blob>         (file, filename "speaking.webm")
- language: "de"        (optional, defaults to "de")
```

### Response

```json
{
  "transcript": "Ich habe seit zwei Tagen Kopfschmerzen und fühle mich sehr schwach."
}
```

### Error Response

```json
{
  "error": "Whisper transcription failed: ..."
}
```

## Worker Source

Located in `worker/index.js` with `worker/wrangler.toml`.

### Deploy

```bash
cd worker
npx wrangler deploy
```

### Required Binding

```toml
[ai]
binding = "AI"
```

The `AI` binding enables access to Cloudflare Workers AI models:
- `@cf/openai/whisper` (transcription)
- `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (writing/speaking feedback)

## Frontend Integration

All calls go through `src/utils/aiCorrection.js`:

| Function | Method | Content-Type |
|----------|--------|-------------|
| `correctWriting()` | JSON POST | `application/json` |
| `correctSpeaking()` | JSON POST | `application/json` |
| `transcribeAudio()` | FormData POST | `multipart/form-data` |

## Security

- No API keys are exposed in the frontend
- The Worker URL is configured via Vite environment variables
- Audio recordings stay in the browser until user clicks "Transcribe"
- Transcripts are user-editable before being sent for AI feedback
