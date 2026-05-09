# Phase 18D: Fix Reading & Listening Completion Tracking

**Status:** Plan Stage | **Implementation:** Not Started

## 1. Current Flow Analysis

### ReadingPage (`src/pages/ReadingPage.jsx`)
- Route: `/level/:levelId/reading`
- Loads exercises from `readingData[levelId]`
- Shows numbered exercise selector buttons with green/red/neutral status colors
- On submit: calculates score from all question answers
- All correct → calls `completeReading(levelId, readingId)` (store.js) + `recordPracticeAttempt('reading', readingId, { correct: true })` (practiceProgress)
- Not all correct → records wrong answers via `recordAnswer()` + `recordPracticeAttempt('reading', readingId, { correct: false })` (practiceProgress)
- Calls `updateLevelProgress()` for both paths
- **Status: GOOD** per the truth audit

### ListeningPage (`src/pages/ListeningPage.jsx`)
- Route: `/level/:levelId/listening`
- Same pattern as ReadingPage
- All correct → calls `completeListening()` + `recordPracticeAttempt('listening', ...)`
- Not all correct → records wrong answers + `recordPracticeAttempt('listening', id, { correct: false })`
- **Status: GOOD** per the truth audit

### DailyMissionPage Reading/Listening Filtering
- `getNextReading(level)`: filters by `completed` (store.js set) and `ppCompleted` (practiceProgress completed_correct/mastered)
- `getNextListening(level)`: same pattern as reading
- **Gap: No dueDate filtering for completed_incorrect items** - they appear in Today's Plan immediately, not scheduled
- **Gap: No ppNotDue filtering** - grammar mission was updated in Phase 18C but reading/listening weren't

## 2. Files for Phase 18D

| File | Current State | Change Needed |
|------|--------------|---------------|
| `src/pages/ReadingPage.jsx` | Status GOOD (tracking works) | Add `getDuePracticeItems` import; update status indicator logic |
| `src/pages/ListeningPage.jsx` | Status GOOD (tracking works) | Add `getDuePracticeItems` import; update status indicator logic |
| `src/pages/DailyMissionPage.jsx` | `getNextReading/getNextListening` lack dueDate filtering | Add `ppNotDue` filter for reading/listening/writing/speaking |
| `src/utils/practiceProgress.js` | Already has `dueDate`, `getDuePracticeItems`, `getNotDuePracticeItems` | No changes needed |

## 3. Current localStorage Keys

| Key | Used By | Values |
|-----|---------|--------|
| `deutsch_klinik_state_default` | store.js | `{ readingCompleted[level], listeningCompleted[level], incorrectAnswers[level] }` |
| `practiceProgress_v1` | practiceProgress.js | `{ reading: { [id]: { status, dueDate, attempts } }, listening: { ... } }` |

## 4. Detailed Gap Analysis

### Gap 1: `completed_incorrect` items in Today's Plan lack dueDate filtering
- `getNextReading()` only excludes `completed_correct`/`mastered` via `ppCompleted`
- `completed_incorrect` items pass through and appear immediately
- Other skills (grammar, writing, speaking) have the same issue
- Fix: Add `ppNotDue` set to all `getNext*` functions, filtering out `completed_incorrect` with `dueDate > today`

### Gap 2: Status indicators could be clearer
- ReadingPage and ListeningPage already show green/red/neutral on exercise selector buttons
- The session header indicates previous attempt status
- Enhancement: Add a status summary bar showing "X completed, Y needs review, Z remaining"

### Gap 3: No count of completed/correct items visible in top bar
- The audit confirms recording works correctly
- Progress numbers update via `updateLevelProgress()`
- Enhancement: Show completion stats (X/Y completed) in page header

## 5. Implementation Plan

### Step 1: Add dueDate filtering to DailyMissionPage reading/listening missions
- In `getNextReading()` and `getNextListening()`: add `ppNotDue` set (same pattern as grammar)
- Filter out items where `practiceProgress_v1.reading[id]` has `status === 'completed_incorrect'` AND `dueDate > today`
- This ensures incorrect items appear only as scheduled remediation

### Step 2: Sync dueDate filtering for writing/speaking too
- Apply the same pattern to `getNextWriting()` and `getNextSpeaking()` for consistency
- Minimal change: just add the same `ppNotDue` filter set

### Step 3: Add status summary to ReadingPage and ListeningPage
- Show a summary bar at the top: "X completed, Y needs review, Z remaining"
- Use `getPracticeItemStatus()` for each exercise
- Keep the existing green/red/neutral button colors

### Step 4: Add tests

**File:** `tests/reading-listening.test.js`

Tests for reading:
- Reading item default status is 'unattempted'
- All correct reading marks completed_correct
- Not all correct reading marks completed_incorrect
- Completed reading excluded from Today's Plan (filtered by ppCompleted)
- Incorrect reading with future dueDate excluded from Today's Plan (ppNotDue)
- Incorrect reading with past dueDate included in Today's Plan

Tests for listening:
- Same as reading tests
- Listening counts toward progress
- Listening wrong answers create mistakes

Tests for DailyMissionPage filtering:
- `getNextReading` filters completed_correct items
- `getNextReading` filters not-due incorrect items
- `getNextReading` includes due incorrect items
- `getNextListening` same behavior

## 6. Source-of-Truth Decision

**No change needed.** PracticeProgress_v1 is already the shared source of truth for reading/listening status tracking. Both pages already call `recordPracticeAttempt()` with correct/incorrect status.

The only gap is that DailyMissionPage's `getNextReading()` and `getNextListening()` do not filter by `dueDate` — they only filter by `completed_correct`/`mastered`. This means incorrect items appear immediately rather than as scheduled remediation.

## 7. Test Plan (23 new tests)

### Reading Tests (8 tests)
1. Default status is 'unattempted' for new reading item
2. All correct reading marks completed_correct in practiceProgress
3. Not all correct reading marks completed_incorrect in practiceProgress
4. All correct reading counts toward level progress
5. Completed_correct reading is filtered out by ppCompleted in getNextReading
6. Completed_incorrect reading with future dueDate is filtered out by ppNotDue
7. Completed_incorrect reading with past dueDate is included in getNextReading
8. Not all correct reading creates mistake entries

### Listening Tests (8 tests)
Same as reading tests but for listening.

### DailyMissionPage Filtering Tests (7 tests)
1. getNextReading excludes completed_correct items
2. getNextReading excludes not-due completed_incorrect items
3. getNextReading includes due completed_incorrect items
4. getNextListening excludes completed_correct items
5. getNextListening excludes not-due completed_incorrect items
6. getNextListening includes due completed_incorrect items
7. Writing/Speaking getNext functions also filter correctly (bonus)

## 8. Files NOT Changing

- `GrammarPage.jsx` - No grammar changes in this phase
- `FlashcardPage.jsx` - No flashcard changes
- `VocabularyPage.jsx` - No vocabulary changes
- `App.jsx` - No routing changes
- `store.js` - No store changes needed
- `teachBeforeTest.js` - No curriculum changes
- `practiceProgress.js` - Already has dueDate support from Phase 18C
- `grammar.json`, `reading.json`, `listening.json` - No data changes
- Any FSP* pages, Supabase, Cloudflare files
