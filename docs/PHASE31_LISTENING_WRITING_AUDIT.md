# Phase 31 Audit: Listening Audio Alignment & Writing Task-Aware Evaluation

## Bug 1: Listening Audio Mismatch

### Reported Behavior
- Page shows script/paragraph and questions that match each other
- But played audio is from a different listening item

### Data Layer Audit (Static)
- **listening.json**: 260 items across A1(50) + A2(50) + B1(60) + B2(50) + C1(50)
- **Audio files**: 260 MP3s in `audio/listening/` and `public/audio/listening/`
- **Integrity**: Every item has valid `id`, `title`, `script`, `questions`, `audio` 
- **Audio path mapping**: Every `item.audio` === `audio/listening/<id-in-kebab>.mp3` — 100% match
- **ID-index alignment**: Every item's array index matches its numeric ID suffix — no off-by-one
- **Question IDs**: All unique within each level
- **All MP3 files**: Valid headers (ID3 or sync pattern), reasonable sizes (62KB–386KB)
- **No orphan files**: Every audio has a data item, every data item has an audio file

### Runtime Layer Audit

#### ListeningPage.jsx (src/pages/ListeningPage.jsx)
- **Data source**: `useMemo(() => listeningData[levelId] || [], [levelId])` — stable, correct
- **Current item**: `const ex = exercises[currentEx]` — simple array index access
- **Script rendering**: `{ex.script}` — from same `ex` object
- **Questions rendering**: Maps over `ex.questions` — from same `ex` object
- **Audio source**: `playAudio()` uses `resolveAudioPath(ex.audio)` — from same `ex` object
- **State reset on change**: `goToExercise(idx)` cancels TTS, pauses audio, resets all state
- **Preloading**: `nextAudioRef` preloads `exercises[currentEx + 1]` — separate from current audio

**Conclusion**: The runtime code uses a single source of truth (`ex = exercises[currentEx]`) for script, questions, and audio. There is no code path where script/questions come from one item and audio from another.

#### DailyMissionPage.jsx (src/pages/DailyMissionPage.jsx)
- **Listening item**: `listeningItem = cm.type === 'listening' ? getNextListening(lvl) : null`
- **Script**: Uses `listeningItem.script` — from selected item
- **Questions**: Uses `listeningItem.questions` — from selected item
- **Audio**: **Does NOT use audio files** — only has a TTS "Read Script Aloud" button
- **Navigation**: After mission, suggests navigating to `/level/${lvl}/listening`

**Conclusion**: DailyMissionPage doesn't play audio files at all, only TTS from the same item's script. No audio mismatch possible here.

### Root Cause Analysis

After exhaustive audit of all code paths and data structures:

1. **No index-based mixing found**: The code cleanly derives script, questions, and audio from a single `ex` object.

2. **No stale state leakage**: `goToExercise()` fully resets TTS, audio, and all state variables.

3. **No data corruption**: All 260 items have correct audio paths, and all 260 MP3 files exist with matching filenames.

4. **Most likely root cause: Audio file content was generated from wrong script text.** The MP3 files have no ID3 metadata and no embedded text. If someone batch-generated audio by iterating items but misaligned the loops (e.g., looped over file indices starting at 0 but data indices starting at 1, or sorted files differently than the JSON array order), the resulting MP3s would have the correct filenames but contain speech for the wrong script.

**Verdict**: Coding defect not found. The bug is likely in the audio file content itself. The code correctly maps each item to its audio file, but the file may contain wrong speech. We will add a runtime guard to detect this scenario by computing a text signature and only playing audio that matches.

---

## Bug 2: Writing Evaluation — Medical Context Misattribution

### Reported Behavior
- Writing task: "Invite my friend to a birthday party"
- User wrote a correct invitation
- AI judged it as if it were a patient/medical writing task
- Feedback mentioned medical context

### Data Layer Audit

#### Writing data (src/data/writing.json)
- 250 items across A1(50) + A2(50) + B1(50) + B2(50) + C1(50)
- Each item has: `id`, `title`, `prompt`, `instructions`, `wordLimit`, `tips`, `rubric`, `lessonId`, `level`
- **No `track` field** — no item marks itself as "general", "goethe", "fsp", or "medical"
- **No `expectedAudience` field** — expected reader is not stored
- **No `expectedPoints` field** — expected content checklist is not stored
- `rubric` field exists but is a free-text string, not a structured evaluation guide

### Frontend Payload Audit

#### WritingPage.jsx
```
const text = ...user's written answer...
correctWriting({
  level: levelId,
  task: prompt.prompt,   // e.g. "Invite your friend to a birthday party..."
  userAnswer: text,
})
```
- **No `track` sent**: AI doesn't know if this is general, FSP, or medical
- **No `expectedAudience` sent**: AI doesn't know who the audience is
- **No `expectedPoints` sent**: AI doesn't know what to check for
- **No `rubric` sent**: AI doesn't receive the task-specific rubric
- **No `title` or `taskType` sent**: AI doesn't know the task genre

#### aiCorrection.js (src/utils/aiCorrection.js)
```
callBackend(`${endpoint}/api/correct-writing`, {
  type: 'writing',
  level,
  task,
  userAnswer,
})
```
- Wraps the call; only passes `type` (ignored by Worker), `level`, `task`, `userAnswer`
- Self-check fallback is also generic

### Worker/Endpoint Audit

#### workers/ai-worker/src/index.js — handleCorrectWriting
```
System prompt:
  "You are a German language tutor. Given a student's writing, provide structured feedback."

User prompt (3 lines):
  CEFR level: {level}
  Task: {task || 'Writing task'}
  Student text: {userAnswer}
```
- **System prompt is completely generic**: No instruction about track, audience, or evaluation scope
- **No track context**: AI has no way to distinguish a birthday invitation from a medical history
- **No rubric/checklist**: AI must infer success criteria from the task string alone
- **No JSON schema enforcement for task type**: The expected JSON schema has no `track` or `audience` fields

### Root Cause Analysis

**Root cause: The AI/Worker prompt system lacks any task-type awareness.**

When the user prompt says `Task: Invite your friend to a birthday party`, the AI receives:
- A generic system identity ("German language tutor")
- No evaluation criteria beyond the schema format
- No instruction about what constitutes success for this specific task type

The AI infers evaluation criteria from its training data. Since medical/FSP content is prominent in the app's context and the AI model has seen many medical writing evaluations, it defaults to medical/patient evaluation patterns even for non-medical tasks.

**Secondary contributors:**
1. Writing data items lack `track`, `expectedAudience`, `expectedPoints` fields
2. Frontend doesn't send rubric, track, or task metadata to the Worker
3. Worker system prompt doesn't instruct the AI to evaluate only against the provided task/track

**Verdict**: Fix requires:
1. Add task/context fields to writing data
2. Update the frontend payload to include task metadata
3. Update the Worker system prompt to use track-aware evaluation
4. Update the Worker user prompt to include rubric/track/audience/expected content
5. Add a default-to-general safeguard when track is unknown

---

## Summary

| Dimension | Listening | Writing |
|-----------|-----------|---------|
| **Data integrity** | Perfect (260/260) | Missing track/audience fields |
| **Code correctness** | Correct — single source of truth | Incomplete — context not sent to AI |
| **Root cause** | Likely audio file content issue | Generic AI prompt without task context |
| **Fix approach** | Add runtime ID/hash guard + regeneration | Extend payload & prompt with task metadata |
| **Confidence** | Medium (cannot verify audio content) | High (fully reproducible from code) |

---

## Fix Plan

### Part 1: Listening
1. Add `computeScriptSignature()` utility — hash of script text
2. Add item ID and script hash to audio cache key (if caching exists)
3. Add playback guard: before playing audio, verify `ex.audio` filename contains `ex.id`
4. Regenerate any audio files that contain wrong speech (if we can identify them)
5. Add tests for audio guards

### Part 2: Writing
1. Add track/context fields to writing data items (track, expectedAudience, expectedPoints)
2. Update WritingPage.jsx to send full context to correctWriting
3. Update aiCorrection.js to accept and forward task context
4. Update Worker prompt to be track-aware with explicit evaluation rules
5. Add default-to-general fallback
6. Align DailyMissionPage writing flow
7. Add tests for task-aware evaluation
