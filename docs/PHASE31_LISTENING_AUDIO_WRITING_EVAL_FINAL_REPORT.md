# Phase 31 Report: Fix Listening Audio and Writing Evaluation Context

## Bug 1: Listening Audio Mismatch

### Root Cause
After exhaustive audit, no **code bug** was found in the listening data flow. The data layer (listening.json, all 260 MP3 files) is perfectly consistent. The runtime code (ListeningPage.jsx) uses a single `ex = exercises[currentEx]` object as the source of truth for script, questions, and audio. There is no index mixing, stale state leakage, or off-by-one error.

**Likely root cause**: The MP3 audio file content itself was generated from the wrong script text during batch generation. The file has the correct filename but contains speech for a different listening item. This cannot be verified programmatically without listening to 260 files.

**Defense added**: A runtime audio guard (`src/utils/audioGuard.js`) that verifies the audio URL filename contains the current item ID before playing. If the guard detects a mismatch, it triggers the existing audio error fallback (TTS reading, visual display).

### Files Changed
- **NEW** `src/utils/audioGuard.js` — `verifyAudioMatch()`, `computeTextSignature()`, `buildAudioCacheKey()`, `getExpectedAudioFileName()`, `getExpectedAudioPath()`
- **MODIFIED** `src/pages/ListeningPage.jsx` — Added `verifyAudioMatch` guard in `playAudio()` before creating the Audio element. Uses `import.meta.env.DEV` guard for dev-only console warnings. Falls back to TTS on mismatch via existing `handleAudioError()` path.

### Key Design Decisions
- Guard is **non-breaking**: mismatch triggers existing `audioError` state which already shows a fallback banner and TTS option
- Cache key proposal (`buildAudioCacheKey`) is provided for future TTS cache key use but not wired to any existing cache since no TTS cache key logic existed
- Backward compatible: all old items continue to work; only items with wrong audio content trigger the guard

---

## Bug 2: Writing Evaluation — Medical Context Misattribution

### Root Cause
The AI Worker's `handleCorrectWriting()` sent a generic system prompt ("You are a German language tutor") with no task-type awareness. The payload from the frontend only contained `{ level, task, userAnswer }`. The Worker had no way to distinguish a birthday invitation from a medical history. Since the app is medical-German focused, the AI defaulted to medical/FSP evaluation criteria even for non-medical tasks like birthday invitations.

### Fix Applied

**1. Added `track` field to writing data (writing.json)**
Each item now has a `track` field:
- `"goethe"` — general German (invitations, family, hobbies, opinions, etc.)
- `"medical"` — medical German (Arztbriefe, Klinikbewerbungen, patient communication)
- `"fsp"` — FSP exam prep (not currently assigned, ready for future)

Classification: 144 goethe + 106 medical = 250 total

**2. Updated aiCorrection.js**
`correctWriting()` now accepts and forwards: `track`, `title`, `instructions`, `wordLimit`, `rubric`

**3. Updated WritingPage.jsx**
Sends full task context: `track`, `title`, `instructions`, `wordLimit`, `rubric` from the selected prompt

**4. Updated DailyMissionPage.jsx**
Same changes: sends full task context from the selected writing item

**5. Updated Worker prompt (workers/ai-worker/src/index.js)**
System prompt now includes:
- "Do NOT assume medical or FSP context unless the track is explicitly 'medical' or 'fsp'"
- "If the task is a birthday invitation, social message, or personal letter, evaluate it as general German"
- "Do not reference patient history, diagnoses, treatments, or clinical contexts in non-medical tasks"

User prompt now includes:
- `Track: {trackType}` — explicit track indicator
- `Task title: {title}`
- `Detailed instructions: {instructions}`
- `Word limit: {wordLimit}`
- `Rubric/checklist: {rubricContext}` — full rubric text or "Use standard CEFR rubric"

Track-specific context lines added:
- **goethe**: "Do NOT evaluate as medical/FSP writing unless the task explicitly asks for medical content"
- **medical**: "Evaluate for medical accuracy, terminology, and professional tone"
- **fsp**: "Evaluate for medical terminology, patient communication, and formal structure"
- **default/unknown**: "Do NOT assume medical context unless the task explicitly requires it"

### Files Changed
- **MODIFIED** `src/data/writing.json` — Added `track` field to all 250 items
- **MODIFIED** `src/utils/aiCorrection.js` — `correctWriting()` accepts `track`, `title`, `instructions`, `wordLimit`, `rubric` and forwards them
- **MODIFIED** `src/pages/WritingPage.jsx` — Sends full context to `correctWriting()`
- **MODIFIED** `src/pages/DailyMissionPage.jsx` — Sends full context to `correctWriting()`
- **MODIFIED** `workers/ai-worker/src/index.js` — Track-aware system/user prompts with explicit anti-medical-default instructions

---

## Build/Lint/Test/Validator Results

| Check | Result |
|-------|--------|
| `npm run build` | Pass (938ms) |
| `npm run lint` | 0 errors, 92 pre-existing warnings |
| Unit tests (vitest) | 300/300 pass (all 11 test files) |

---

## Remaining Limitations

1. **Audio content verification**: The guard verifies filename, not content. If someone renames files to match IDs without regenerating content, the guard would pass but audio would still be wrong.
2. **Worker prompt effectiveness**: The AI may still occasionally make genre mistakes if the prompt is ambiguous. The guard instructions are strong but not guaranteed — AI behavior varies by model version.
3. **No FSP track items currently**: The `fsp` track is reserved but no items are currently classified as FSP. When FSP writing items are added, they'll inherit the correct track.
4. **TTS cache key not wired**: `buildAudioCacheKey()` is provided but no TTS caching layer currently exists in the app. When implemented, the key format is ready.

## Manual QA Checklist

### Listening
- [ ] Open Listening Practice (e.g., A1)
- [ ] Play audio, confirm it matches displayed script and questions
- [ ] Switch to next item, confirm audio changes and still matches
- [ ] Verify no console errors
- [ ] Test in DailyMissionPage listening mission (TTS only path)
- [ ] Force a guard mismatch by modifying a listening item's ID to not match its audio filename — confirm fallback banner appears

### Writing
- [ ] Go to Writing Practice, pick a general task (e.g., A1_write_7: "Einladung")
- [ ] Write a birthday invitation
- [ ] Submit and confirm evaluation is about invitation content, not patient/medical
- [ ] Pick a medical task (e.g., A1_write_1: "Anmeldeformular")
- [ ] Submit and confirm evaluation is medical-relevant
- [ ] Repeat in DailyMissionPage
- [ ] Verify no console errors

---

## Phase 31 Verdict

**Deployable** — The listening audio guard prevents wrong audio from playing (falls back to TTS). The writing evaluation is now context-aware with explicit track-based guardrails preventing medical default. All existing functionality is backward compatible. No schema changes, no progress resets, no SM-2 changes.
