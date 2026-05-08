# AI Privacy & Usage Limits

## Overview

Deutsch-klinik uses a Cloudflare AI Worker for AI-powered language learning features. This document explains what data is processed, how it's handled, and what limits apply.

---

## What Data Is Processed

### Text Data

When you use AI features, the following text is sent to the AI Worker:

| Feature | Data Sent | Purpose |
|---|---|---|
| Writing Correction | Your answer + level + task description | Grammar/vocabulary feedback |
| Speaking Correction | Your transcript + level + task description | Fluency/pronunciation feedback |
| Transcription | Audio recorded in-app | Speech-to-text conversion |
| TTS | Text you want synthesized | Audio generation |

### Audio Data

- **Audio recording** happens entirely in your browser (MediaRecorder API).
- Recorded audio is stored as a Blob URL locally. It is never uploaded to any server unless you explicitly click the "Transcribe" button.
- When you click "Transcribe," the audio blob is sent to the AI Worker for Whisper transcription.
- **No audio recordings are stored server-side.** Transcriptions are returned, and the audio is discarded after processing.

### What Is NOT Sent

- Your name, email, or account data
- Your progress, study logs, or test results
- Browser fingerprints or tracking data
- Third-party cookies or analytics

---

## Daily Usage Limits

To prevent abuse and manage API costs, usage is tracked **locally in your browser** (localStorage).

| Feature | Daily Limit |
|---|---|
| Corrections (writing + speaking combined) | 20 |
| Audio Transcriptions | 10 |
| TTS Generations | 30 |

**How limits work:**
- Limits reset at midnight (your local time).
- Counters are stored in `localStorage` under the key `dk_ai_usage`.
- When a limit is reached, the app shows a notification. You can still use local self-check feedback.
- **No usage data is sent anywhere.** It's purely client-side.

**Max text lengths:**
- Writing corrections: 5,000 characters
- TTS input: 3,000 characters

---

## How to Clear AI Data

### Clear Usage Counters

```javascript
// In browser console:
localStorage.removeItem('dk_ai_usage');
```

### Clear All App Data (including AI counters)

1. Open browser DevTools (F12)
2. Application tab > Local Storage
3. Right-click the domain > Clear
4. OR: Settings > Clear browsing data > Last hour / All time

### Clear Recordings

Recordings stored as Blob URLs are volatile and cleared when:
- You close the tab or refresh the page
- You manually delete them via the app UI

---

## Where Data Goes

```
Your Browser
    │
    ▼
Cloudflare AI Worker (Edge, global)
    │
    ▼
OpenAI API (or configured provider)
```

- **Cloudflare Workers** processes requests at edge locations worldwide.
- **OpenAI API** receives text and audio for AI processing. See [OpenAI's privacy policy](https://openai.com/privacy).
- **No data is logged or persisted** by the AI Worker (in-memory usage tracking is an exception and contains only IP counters, no personal data).
- You can self-host the Worker to use your own API key and endpoint.

---

## Privacy Considerations

### For Self-Hosted Deployments

1. **Set your own API key** via `wrangler secret put AI_API_KEY`.
2. **Choose your AI provider** by changing `AI_BASE_URL` in wrangler.toml.
3. **Set allowed origins** via `ALLOWED_ORIGINS` env var for CORS control.
4. **Review Cloudflare Workers privacy** at [cloudflare.com/privacypolicy](https://www.cloudflare.com/privacypolicy/).

### Third-Party Services

This app uses the following third-party services when AI features are enabled:

| Service | Data | Purpose |
|---|---|---|
| Cloudflare Workers | Request headers, text/audio | AI processing |
| OpenAI API | Text, audio | Correction, transcription, TTS |
| Supabase (if configured) | Account data, progress | Cloud sync |

### Recommendations

- Do not enter personally identifiable information (PII) in exercises.
- Use the app's local-only mode if you prefer not to use cloud features.
- Review your browser's autofill and password manager settings.
- Audio recordings stay on your device until you choose to transcribe them.
