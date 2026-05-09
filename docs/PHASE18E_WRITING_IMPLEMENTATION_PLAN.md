# Phase 18E: Writing Practice Implementation Plan

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline
**Author:** Najm

## 1. Current State Analysis

### WritingPage.jsx Flow (Already Enhanced from Earlier Changes)

The WritingPage has already received partial Phase 18E work. The current state is:

```
Component Mount → prompt selector (with status prefix icons) → textarea → Submit → 
  correctWriting() AI call → recordWritingResult() → practiceProgress_v1
```

### Current Scoring Logic

- AI returns `result.score` out of 10
- `score >= 8` → passing → `completed_correct` in practiceProgress_v1
- `score < 8` → needs review → `completed_incorrect` in practiceProgress_v1
- AI failure → catch path calls `recordWritingResult(null, errMsg)` with score=0

### Status Tracking

- Already added: `getPracticeItemStatus('writing', p.id)` - reads from practiceProgress_v1
- Already added: status prefix (✓ green / ⚠ red) in the prompt `<select>` dropdown
- Already added: status summary bar (X completed, Y needs review, Z remaining)
- Already added: `recordPracticeAttempt('writing', prompt.id, ...)` with score/status/dueDate
- Already added: `completeWriting(levelId, prompt.id)` for exam unlock counting (store.js)
- Already added: `recordAnswer()` for mistake tracking in MistakeNotebook

### AI Correction / Fallback

- `correctWriting()` is called on submit
- On AI failure: `catch` handler calls `recordWritingResult(null, err.message)` 
- No score from AI → recorded as `completed_incorrect` with score=0

### LocalStorage / Progress Keys

- **practiceProgress_v1.writing** - primary source of truth for completion/status
  - Key format: `prompt.id` (e.g. `A1_write_1`)
  - Fields: status, score, maxScore, level, topic, userAnswer, dueDate, attempts, lastAttempt
- **deutsch_klinik_state_default** (store.js) - secondary log
  - `state.writings` - raw submission history
  - `state.writingCompleted` - set of completed prompt IDs for exam unlock (new in this phase)
  - `state.incorrectAnswers` - mistake tracking for MistakeNotebook

### Today's Plan Selection (DailyMissionPage.jsx)

Already has proper ppNotDue filtering:
```js
const getNextWriting = (level) => {
  const ppCompleted = new Set(...filter completed_correct || mastered);
  const ppNotDue = new Set(...filter completed_incorrect where dueDate > today);
  let data = writingData.filter(item => !ppCompleted.has(item.id) && !ppNotDue.has(item.id));
  ...
};
```

### LevelPage Progress Display

Already updated to count completed_correct from practiceProgress:
```js
const writingCompletedCount = levelPrompts.filter(p => 
  getPracticeItemStatus('writing', p.id).status === 'completed_correct'
).length;
```

## 2. Gap Analysis

| # | Required Behavior | Status | Gap |
|---|---|---|---|
| 1 | Never attempted = default | ✅ Done | getPracticeItemStatus returns `unattempted` |
| 2 | Score >= 8/10 = green/completed | ✅ Done | `recordPracticeAttempt` sets correct status |
| 3 | Score < 8/10 = red/needs review | ✅ Done | Status set via score check in practiceProgress.js |
| 4 | UI shows status (dropdown + summary bar) | ✅ Done | Status prefix and summary bar implemented |
| 5 | Count toward writing progress | ✅ Done | LevelPage reads practiceProgress for completion count |
| 6 | Exclude completed from Today's Plan | ✅ Done | ppNotDue filter in getNextWriting |
| 7 | Failed items reappear when due | ✅ Done | dueDate scheduling + ppNotDue filter |
| 8 | AI failure doesn't crash | ✅ Done | catch handler with fallback entry |
| 9 | Old localStorage doesn't crash | ✅ Done | practiceProgress gracefully handles missing data |
| 10 | Persist after reload | ✅ Done | All state in localStorage |
| 11 | Score stored in practiceProgress | ❌ **Missing** | `recordPracticeAttempt` didn't save `score` field |
| 12 | Tests exist and pass | ❌ **Missing** | Tests existed but didn't properly mock localStorage |

## 3. Source-of-Truth Decision

**PracticeProgress_v1.writing** is the source of truth for:
- Completion status (completed_correct / completed_incorrect / unattempted)
- Score and dueDate scheduling
- Today's Plan filtering

**Store.js state.writings** is secondary log for:
- Full submission history (review past writings in the UI)
- Mistake tracking via state.incorrectAnswers
- Exam unlock counting via writingCompleted

This is consistent with how reading and listening work.

## 4. Implementation Steps

### Step 1: Fix practiceProgress.js score persistence
- File: `src/utils/practiceProgress.js`
- Change: Add `cur.score = result.score` and `cur.maxScore` assignment in `recordPracticeAttempt`
- Reason: Score field was not being stored, only used for status calculation

### Step 2: Verify all existing code integrations
- WritingPage.jsx - verify recordWritingResult, completeWriting, status display - all correct
- DailyMissionPage.jsx - verify getNextWriting ppNotDue filtering - all correct
- LevelPage.jsx - verify writingCompletedCount from practiceProgress - all correct
- store.js - verify writingCompleted default state and completeWriting function - all correct
- localStorageAdapter.js - verify completeWriting export - all correct

### Step 3: Add comprehensive tests
- File: `tests/writing-practice.test.js`
- Tests: 26 tests across 5 suites

## 5. Files Modified

| File | Changes |
|---|---|
| `src/utils/practiceProgress.js` | +2 lines: store score and maxScore from result |
| `tests/writing-practice.test.js` | Rewritten to properly mock localStorage for node test environment |

Changes from earlier session (already committed):
| File | Changes |
|---|---|
| `src/pages/WritingPage.jsx` | ~80 lines: recordWritingResult, completeWriting, recordAnswer, status summary, status dropdown |
| `src/pages/LevelPage.jsx` | ~15 lines: writingCompletedCount from practiceProgress, writingData import |
| `src/utils/store.js` | ~20 lines: writingCompleted default state, completeWriting function, isExamUnlocked update |
| `src/utils/localStorageAdapter.js` | ~3 lines: completeWriting export |

## 6. Test Plan

### 6.1 Writing Practice - Status Tracking (10 tests)
1. writing item starts default/unattempted
2. writing score 8/10 marks item completed/green
3. writing score 10/10 marks item completed/green
4. writing score 7/10 marks item red/needs review
5. writing score below 8 does not count as completed
6. writing completion persists after reload
7. score=0 from AI failure marks as needs review
8. score=5 from partial AI failure marks as needs review
9. score threshold works at boundary (score=8 passes)
10. score threshold works at boundary (score=7 fails)

### 6.2 Writing Practice - Today's Plan Filtering (8 tests)
1. completed writing excluded from Today's Plan
2. failed writing can appear in remediation when due
3. failed writing not due excluded from Today's Plan
4. all writing prompts available when none attempted
5. correct-incorrect then correct clears needs-review flag
6. getNextWriting handles empty practiceProgress gracefully
7. getDuePracticeItems returns incorrect items with past due dates

### 6.3 Writing Practice - Store.js Integration (5 tests)
1. completeWriting tracks in store state
2. completeWriting deduplicates
3. multiple completeWriting calls track multiple prompts
4. writingCompleted persists after reload
5. recordAnswer stores writing mistakes for MistakeNotebook

### 6.4 Writing Practice - Error Handling (2 tests)
1. old localStorage writing progress does not crash
2. no score data defaults to not completed

### 6.5 Writing Practice - Speaking Compatibility (2 tests)
1. speaking follows same pattern as writing for Today's Plan
2. speaking incorrect with past due shows in Today's Plan

## 7. Validation

- `npm run build` → 0 errors
- `npm run lint` → 0 errors, 76 warnings (all pre-existing)
- `npx vitest run` → 138/138 passed (66 SM-2 + 23 grammar + 23 reading/listening + 26 writing)
- No Playwright tests needed (no new UI elements that affect page load smoke test)
