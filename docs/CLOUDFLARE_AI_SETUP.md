# Cloudflare Workers AI Setup

Deutsch Klinik uses a Cloudflare Worker as the AI backend for writing correction, speaking feedback, and audio transcription. The frontend never contains API keys or Cloudflare secrets.

## Frontend Configuration

Default Worker endpoint:

```text
https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev
```

Optional Vite overrides:

```text
VITE_AI_CORRECTION_ENDPOINT=https://your-worker.your-subdomain.workers.dev
VITE_AI_SPEAKING_ENDPOINT=https://your-worker.your-subdomain.workers.dev
VITE_CLOUDFLARE_AI_ENDPOINT=https://your-worker.your-subdomain.workers.dev
```

`VITE_AI_CORRECTION_ENDPOINT` is used for writing. `VITE_AI_SPEAKING_ENDPOINT` is used for speaking and transcription, falling back to the writing endpoint, then `VITE_CLOUDFLARE_AI_ENDPOINT`, then the default Worker URL.

Do not commit API keys, account tokens, or Worker secrets.

## Worker Endpoint

The frontend sends all requests to the Worker root URL with `POST`.

### Writing Request

```json
{
  "type": "writing",
  "level": "B1",
  "task": "Write an email...",
  "userAnswer": "Student text..."
}
```

### Writing Response

```json
{
  "score": 7,
  "rubric": {
    "grammar": "Good control with a few case errors.",
    "vocabulary": "Appropriate for the level.",
    "structure": "Clear structure.",
    "taskCompletion": "Task mostly complete."
  },
  "mistakes": [
    {
      "original": "ich habe",
      "corrected": "Ich habe",
      "explanation": "Capitalize the first word of a sentence."
    }
  ],
  "correctedVersion": "Full corrected text.",
  "improvedVersion": "Stronger model answer.",
  "flashcards": [
    { "german": "die Satzstellung", "english": "word order" }
  ]
}
```

### Speaking Request

```json
{
  "type": "speaking",
  "level": "B2",
  "task": "Describe your opinion...",
  "transcript": "Student transcript..."
}
```

### Speaking Response

```json
{
  "score": 7,
  "rubric": {
    "fluency": "Mostly fluent.",
    "grammar": "Some word-order mistakes.",
    "vocabulary": "Good range.",
    "pronunciation": "Practice umlauts and final consonants."
  },
  "mistakes": [
    {
      "original": "Ich denke, dass ist gut",
      "corrected": "Ich denke, dass das gut ist",
      "explanation": "Use the full subordinate clause."
    }
  ],
  "betterPhrases": [
    {
      "original": "Ich denke",
      "better": "Meiner Ansicht nach",
      "explanation": "More natural in structured answers."
    }
  ],
  "correctedTranscript": "Full corrected transcript.",
  "strongerAnswer": "Improved spoken answer.",
  "phrasesToMemorize": [
    { "german": "Meiner Ansicht nach...", "english": "In my opinion..." }
  ]
}
```

### Transcription Request

Send `multipart/form-data`:

```text
type=transcription
language=de
audio=<webm audio file>
```

### Transcription Response

```json
{
  "transcript": "Transcribed German text."
}
```

## Required CORS Headers

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Content-Type: application/json
```

## Required Cloudflare Binding

The Worker must define a Workers AI binding named:

```text
AI
```

The Worker code should call:

```js
env.AI.run(...)
```

The repository Worker implementation is in `worker/index.js` and uses Cloudflare Workers AI only. It does not require DeepSeek, OpenAI, or other external API keys.

## Fallback Behavior

If the Worker endpoint is genuinely missing or unreachable, the frontend shows a structured local self-check with score, rubric, correction checklist, and next-step guidance. Copy-prompt tools remain available as backup, but they are not the primary completion flow.
