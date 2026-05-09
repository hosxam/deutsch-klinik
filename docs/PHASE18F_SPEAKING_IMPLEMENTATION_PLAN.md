# Phase 18F: Speaking Practice Implementation Plan

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline

## 1. Current State

### SpeakingPage.jsx Flow

```
Mount → prompt selector (no status) → Start Preparation → timer runs → Stop & Complete →
  Done phase appears:
    1. Transcript box (textarea + speech recognition buttons)
    2. Audio recorder (Start transcription / Stop transcription / Transcribing...)
    3. "Get Speaking Feedback" button → correctSpeaking() → normalize response → 
       recordPracticeAttempt('speaking', prompt.id, { correct: score >= 8, score, ... })
    4. Score display (green ≥7, amber ≥4, red <4 in UI, but score ≥8 threshold for progress)
    5. AI result panel (rubric, mistakes, phrases, corrected transcript, etc.)
```

### Current Scoring Logic

- AI returns `score` (0-10) from `correctSpeaking()` → `normalizeSpeakingResponse()`
- `normalizeSpeakingResponse` can return `score: null` if data.score is not a number
- Self-check fallback: `createSpeakingSelfCheck` returns score 3-8 based on word count
- UI colors: score ≥ 7 green, score ≥ 4 amber, score < 4 red
- `recordPracticeAttempt` threshold: score >= 8 for passing

### What Already Works

1. **`recordPracticeAttempt` IS already called** in `getSpeakingFeedback()` (line ~430)
2. **`getNextSpeaking` in DailyMissionPage** already has `ppCompleted` and `ppNotDue` filtering
3. **Score threshold in practiceProgress** already uses 8/10 (same as writing)
4. **`isSpeakingCorrectionEnabled`** / `correctSpeaking` / `transcribeAudio` all exist in aiCorrection
5. **Timer flow** (prep → talk → done) works correctly
6. **Transcription wording** already uses "Start transcription" / "Stop transcription" / "Transcribing..."

### What's Missing

1. **No `completeSpeaking()` in store.js** (need to mirror `completeWriting()`)
2. **No `speakingCompleted` state in store.js defaultState**
3. **Prompt `<select>` has no status colors** (no green/red icons)
4. **No status summary bar** showing "X completed, Y needs review, Z remaining"
5. **`isExamUnlocked()` uses `state.speakingRecordings[level]`** instead of speakingCompleted
6. **`LevelPage.jsx` uses raw `state.speakingRecordings`** for progress count
7. **AI failure / fallback** - when `speakingEnabled === false`, no practiceProgress is recorded (only a warning banner shown, no `recordPracticeAttempt` call)
8. **Self-check fallback** from `createSpeakingSelfCheck` returns score 3-8 but user gets no practiceProgress_entry_  from the disabled AI path
9. **No `recordAnswer()` for speaking mistakes** (currently a useEffect at line ~80 logs remediation, but no `recordAnswer` called in fallback path)
10. **No `localStorageAdapter.completeSpeaking` export**
11. **No tests for speaking practice progress**

## 2. Key Insight

SpeakingPage is **much closer** to completion than WritingPage was. The `recordPracticeAttempt` call ALREADY exists. The main gaps are:
- Status visualization (prompt selector colors, summary bar)
- `completeSpeaking()` in store.js for exam unlock
- AI-unavailable path recording (when `isSpeakingCorrectionEnabled` returns false)
- LevelPage count fix
- Tests

## 3. Source-of-Truth Decision

Same as writing phase:

**`practiceProgress_v1.speaking`** is primary source of truth for:
- Completion status (completed_correct / completed_incorrect / unattempted)
- Score persistence (score, maxScore fields)
- DueDate scheduling (correct → 14 days, incorrect → 1 day)
- Today's Plan filtering (completed excluded, due-only remediation)

**`store.js state.speakingRecordings`** → will keep for raw submission history
**`store.js state.speakingCompleted`** → NEW, for exam unlock counting (mirrors writingCompleted)

## 4. Implementation Steps

### Step 1: Add `speakingCompleted` to store.js
- File: `src/utils/store.js`
- Add `speakingCompleted: {}` to defaultState (after `writingCompleted`)
- Add `completeSpeaking(level, exerciseId)` function (mirrors `completeWriting()`)
- Update `isExamUnlocked()` to use `state.speakingCompleted` instead of `state.speakingRecordings`

### Step 2: Add `completeSpeaking` to localStorageAdapter
- File: `src/utils/localStorageAdapter.js`
- Import `completeSpeaking` from store
- Add `completeSpeaking(level, exerciseId)` adapter method

### Step 3: Add status colors to prompt `<select>` in SpeakingPage
- File: `src/pages/SpeakingPage.jsx`
- Import `getPracticeItemStatus` from `../utils/practiceProgress`
- Import `CheckCircle` and `AlertCircle` from `lucide-react` (or reuse existing imports)
- In the prompt `<select>`, check status and add green/red prefix

### Step 4: Add status summary bar to SpeakingPage
- File: `src/pages/SpeakingPage.jsx`
- Add `speakingStatuses` state
- Add `getSpeakingStatuses()` function that reads from practiceProgress
- Show summary bar: "X completed, Y needs review, Z remaining"
- Only show when at least one item has been attempted

### Step 5: Fix AI failure / fallback path
- File: `src/pages/SpeakingPage.jsx`
- When `speakingEnabled === false`: currently shows warning banner but NO practiceProgress recording
- Change: in the getSpeakingFeedback-like path or when AI is disabled, still call `recordPracticeAttempt` with fallback score
- On `correctSpeaking` error: record practiceProgress with score=0 and correct=false
- Note: for the disabled AI case, we need to still record progress or show a manual path

### Step 6: Update LevelPage.jsx speaking count
- File: `src/pages/LevelPage.jsx`
- Change `state.speakingRecordings[levelId]` to `getPracticeItemStatus('speaking', id)` for each speaking item
- Import `getPracticeItemStatus` from practiceProgress
- Import `speakingData` from data file
- Count completed_correct speaking items for progress display

### Step 7: Add comprehensive tests
- File: `tests/speaking-practice.test.js`
- Test pattern matching `tests/writing-practice.test.js`
- Include all required test scenarios

## 5. Test Plan

### Speaking Practice - Status Tracking (9 tests)
1. speaking item starts default/unattempted
2. speaking score 8/10 marks item completed/green
3. speaking score 10/10 marks item completed/green
4. speaking score 7/10 marks item red/needs review
5. speaking score below 8 does not count as completed
6. speaking completion persists after reload
7. score=null from AI failure does not mark completed
8. score threshold works at boundary (score=8 passes)
9. score threshold works at boundary (score=7 fails)

### Speaking Practice - Today's Plan Filtering (7 tests)
1. completed speaking excluded from Today's Plan
2. failed speaking can appear in remediation/review when due
3. failed speaking not due excluded from Today's Plan
4. all speaking prompts available when none attempted
5. correct-incorrect then correct clears needs-review flag
6. getNextSpeaking handles empty practiceProgress gracefully
7. getDuePracticeItems returns incorrect items with past due dates

### Speaking Practice - Store.js Integration (4 tests)
1. completeSpeaking tracks in store state
2. completeSpeaking deduplicates
3. multiple completeSpeaking calls track multiple prompts
4. recordAnswer stores speaking mistakes for MistakeNotebook

### Speaking Practice - Error Handling & UI (4 tests)
1. old localStorage speaking progress does not crash
2. no score data defaults to not completed
3. AI failure does not crash (practiceProgress still recorded)
4. zero transcript does not crash

**Total: 24 tests**

## 6. Files to Modify

| File | Change | Risk |
|---|---|---|
| `src/pages/SpeakingPage.jsx` | Status colors on prompt select, status summary bar, AI failure recording | Medium |
| `src/utils/store.js` | `speakingCompleted` default state, `completeSpeaking()`, `isExamUnlocked()` update | Low |
| `src/utils/localStorageAdapter.js` | `completeSpeaking()` export | Low |
| `src/pages/LevelPage.jsx` | Speaking count from practiceProgress | Low |
| `tests/speaking-practice.test.js` | New file with 24 tests | Medium |

## 7. Validation

- `npm run build` → 0 errors
- `npm run lint` → 0 errors (all warnings pre-existing)
- `npx vitest run` → all existing tests + 24 new speaking tests pass
- Working tree committed and pushed
