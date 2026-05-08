# Phase 12 — AI Flow Audit

This document audits the current state of AI integration in deutsch-klinik (writing, speaking, listening) and describes what the Cloudflare AI Worker adds.

---

## Writing Flow

### Current State
- **WritingPage.jsx** uses `correctWriting()` from `aiCorrection.js`.
- On submit, calls the Cloudflare Worker endpoint with `{ type, level, task, userAnswer }`.
- Displays score, rubric, mistakes, corrected/improved version, and flashcards.
- **Local fallback:** If the Worker is unreachable or returns 5xx, `correctWriting()` generates a local self-check with a score, rubric, mistakes, and flashcards. The page does NOT crash.
- **Copy prompt:** A manual fallback button copies an AI prompt to the clipboard for use with external tools.
- **DailyMissionPage** also integrates `correctWriting()` on the writing mission.

### What AI Worker Adds
- Structured `/api/correct-writing` endpoint with validation.
- In-memory usage limit tracking.
- Configurable via `VITE_AI_WORKER_URL`.

### Flow Diagram
```
User writes text -> Submit -> correctWriting()
  ├── AI Worker endpoint available?
  │   ├── Yes -> POST /api/correct-writing -> Show AI feedback
  │   └── No / Error -> createWritingSelfCheck() -> Show local feedback
  └── Score < 6 -> addRemediationRecommendation()
```

---

## Speaking Flow

### Current State
- **SpeakingPage.jsx** uses `correctSpeaking()` from `aiCorrection.js`.
- Speech recognition (browser-native, no audio upload) for real-time transcription.
- Audio recording (local only, stored as Blob URLs, never uploaded).
- AI transcription via `transcribeAudio()` sends audio Blob to Worker.
- On transcript + AI feedback button, calls `correctSpeaking()` with `{ type, level, task, transcript }`.
- Displays score, rubric, mistakes, better phrases, corrected transcript, stronger answer, phrases to memorize.
- **Local fallback:** If the Worker is unreachable, `correctSpeaking()` generates a local self-check.
- **Copy prompt fallback:** Manual copy-to-clipboard for external tools.
- **DailyMissionPage** has speaking support with recording, transcription, and AI feedback.

### What AI Worker Adds
- Structured `/api/transcribe-speaking` and `/api/correct-speaking` endpoints.
- In-memory usage limit tracking.
- Configurable via `VITE_AI_WORKER_URL`.

### Flow Diagram
```
User records audio -> stopRecording()
  ├── transcribeRecording() -> POST /api/transcribe-speaking -> Get transcript
  └── Falls back to browser speech recognition or typed transcript

User clicks "Get Speaking Feedback"
  └── correctSpeaking()
      ├── AI Worker available -> POST /api/correct-speaking -> Show AI feedback
      └── Error/unavailable -> createSpeakingSelfCheck() -> Show local feedback
```

---

## Listening Flow

### Current State
- **ListeningPage.jsx** uses browser `speechSynthesis` for TTS (text-to-speech).
- Audio file playback for exercises with embedded audio.
- No AI TTS integration or transcription. All audio is client-side.
- Transcript is shown after submission.
- Questions are MCQ and true/false.

### What AI Worker Adds (Optional)
- New `/api/generate-tts` endpoint for server-side TTS.
- Not used by ListeningPage automatically (browser TTS is the default).
- Available for future features or fallback when browser TTS is unavailable.

### Flow Diagram
```
User opens listening exercise
  ├── Has audio file? -> Play audio file
  ├── No audio file, TTS available? -> Browser speechSynthesis -> Play
  └── No audio, no TTS? -> Show transcript as fallback
```

---

## Environment Variables

| Variable | Current | After Phase 12 |
|---|---|---|
| `VITE_AI_CORRECTION_ENDPOINT` | Used for writing correction | Fallback (backward compat) |
| `VITE_AI_SPEAKING_ENDPOINT` | Used for speaking/transcription | Fallback (backward compat) |
| `VITE_CLOUDFLARE_AI_ENDPOINT` | Fallback for both | Fallback (backward compat) |
| `VITE_AI_WORKER_URL` | Not present | **Unified endpoint** (primary) |

`VITE_AI_WORKER_URL` resolves to all Worker endpoints:
- `/api/correct-writing` (POST)
- `/api/correct-speaking` (POST)
- `/api/transcribe-speaking` (POST)
- `/api/generate-tts` (POST)
- `/api/health` (GET)

---

## Usage Limits (Phase 12 New)

Daily limits tracked in localStorage:
- **Corrections** (writing + speaking): 20 per day
- **Transcriptions** (speaking audio): 10 per day
- **TTS generations**: 30 per day

Max text lengths:
- **Writing correction**: 5,000 characters
- **TTS input**: 3,000 characters

All limits are soft — the app shows warnings but does not block. Limits reset at midnight local time.
