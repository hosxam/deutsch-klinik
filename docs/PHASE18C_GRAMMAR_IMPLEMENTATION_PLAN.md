# Phase 18C: Fix Controlled Grammar Practice

**Status:** Plan Approved | **Implementation:** Not Started

## 1. Current Grammar Practice Flow

### Standalone GrammarPage (`src/pages/GrammarPage.jsx`)
- Route: `/level/:levelId/grammar`
- Loads ALL exercises from `grammarData[levelId]` (e.g. 411 A1 questions)
- In non-daily mode: renders ALL exercises sequentially (no limit)
- In daily mode (`?daily=1&limit=N`): slices first N incomplete (non-mastered) questions
- **No curriculum filtering**: doesn't call `getUnlockedItems()` -- shows all questions regardless of lesson completion
- **No practiceProgress_v1 filtering**: only checks `getGrammarMastery().mastered` (3+ correct with 70% accuracy)
- Does NOT read `practiceProgress_v1.grammar`

### DailyMissionPage Grammar Mission
- **Uses curriculum filtering** via `getUnlockedItems()` correctly
- **Uses practiceProgress_v1 filtering** (`ppDone` = completed_correct/mastered)
- Has proper priority: today's lesson questions first, then review
- Supports empty state

### Key Gap
Standalone GrammarPage and DailyMissionPage use **different filtering logic**. The standalone page is the "broken" one.

## 2. Files/Functions Used

| File | Key Functions | Role |
|---|---|---|
| `src/pages/GrammarPage.jsx` | -- | Main grammar practice UI |
| `src/utils/store.js` | `recordGrammarAnswer`, `getGrammarMastery`, `recordAnswer`, `getMistakesByLevel`, `getState` | SM-2-esque mastery + mistake tracking |
| `src/utils/practiceProgress.js` | `recordPracticeAttempt`, `getPracticeItemStatus`, `isPracticeItemCompleted` | Unified practice status (completed_correct/incorrect) |
| `src/utils/teachBeforeTest.js` | `getUnlockedItems`, `hasCurriculumMap` | Lesson-progression filtering |
| `src/utils/adaptivePlan.js` | `buildAdaptiveTargets`, `getRemediationRecommendation` | Target count calculation |
| `src/data/grammar.json` | -- | All grammar exercises (~1600 across 5 levels) |

## 3. Current localStorage Keys

| Key | Used By | Format |
|---|---|---|
| `deutsch_klinik_state_default` | store.js | `{ grammarMastery: { [exId]: { correct, incorrect, mastered } } }` |
| `practiceProgress_v1` | practiceProgress.js | `{ grammar: { [exId]: { status, attempts, lastAttempt } } }` |
| `dk_daily_session_{level}` | DailyMissionPage | Session state including completed grammar IDs |

## 4. Source-of-Truth Decision

**`practiceProgress_v1.grammar` is the source of truth for completed/incorrect status.**
`store.js grammarMastery` is secondary (used for mastery calculation within sessions).

Rationale:
- practiceProgress_v1 is already the shared model used by DailyMissionPage's grammar mission
- It has `status: 'completed_correct' | 'completed_incidental'` which maps to the required behaviors
- It already supports unified filtering across reading/listening/writing/speaking
- Adding `dueDate` to practiceProgress_v1 entries enables scheduling

## 5. Implementation Plan

### A. GrammarPage Session Setup (Session Size Selector)

**File:** `src/pages/GrammarPage.jsx`

Replace the current non-daily flow (all questions) with a session setup screen:
- Show current level, available question count
- Session size selector: 5, 10, 15, 20, 25 (default 10)
- Start button
- Show queue stats: available, already completed, already mastered

### B. Grammar Question Selection Logic

**File:** `src/pages/GrammarPage.jsx`

Implement proper filtering:
1. Filter by `grammarData[levelId]` (current level only -- no B2 questions for A1 user)
2. Filter by `getUnlockedItems()` using `getPracticeContext()` (lesson-progression awareness)
3. Filter out `practiceProgress_v1.grammar` items with `status === 'completed_correct'`
4. Priority ordering:
   - Due review items (grammar mistakes in practiceProgress_v1 or store.js grammarMastery)
   - Items from completed lessons not yet attempted
   - Items from current lessons not yet attempted
5. Cap at selected session size
6. Show empty state if no available questions

### C. Correct Answer Behavior

**File:** `src/pages/GrammarPage.jsx`

When user answers correctly:
1. Call `recordGrammarAnswer(ex.id, true)` (updates store.js grammarMastery)
2. Call `recordPracticeAttempt('grammar', ex.id, { correct: true })` with dueDate (adds `dueDate` field to practiceProgress)
   - `dueDate` = today + 14 days (default review interval for correct items)
3. Remove from immediate session pool
4. Exclude from Today's Plan on subsequent page loads

### D. Wrong Answer Behavior

**File:** `src/pages/GrammarPage.jsx`

When user answers incorrectly:
1. Call `recordGrammarAnswer(ex.id, false)` (updates store.js grammarMastery)
2. Call `recordPracticeAttempt('grammar', ex.id, { correct: false })` with dueDate
   - `dueDate` = today + 1 day (remediation delay)
3. Call `recordAnswer(levelId, exId, userAnswer, correctAnswer, topic, false, 'grammar')` (store.js mistake tracking)
4. Create wrong answer entry in local state (already done)
5. Do NOT create duplicate mistake entries for same question -- update existing entry

### E. Today's Plan Integration

**File:** `src/pages/DailyMissionPage.jsx` (minimal changes)

The DailyMissionPage grammar mission already:
- Reads `practiceProgress_v1.grammar` for `ppDone` filtering
- Uses `getUnlockedItems()` for curriculum filtering

Add `dueDate` check to the `ppDone`/`unmastered` filter:
- `completed_correct` items with future `dueDate` should be excluded
- `completed_incorrect` items with future `dueDate` should be excluded
- `completed_incorrect` items with `dueDate <= today` should be included

### F. Mistake Notebook Integration

**File:** `src/pages/MistakeNotebookPage.jsx` (minimal changes)

Already shows grammar mistakes via `getMistakesByLevel()` with skill filter.
No changes needed unless we want to add due-date-based review links.

### G. practiceProgress.js Changes

**File:** `src/utils/practiceProgress.js`

Add `dueDate` support to `recordPracticeAttempt()`:
- For `correct: true`: set `dueDate = today + 14`
- For `correct: false`: set `dueDate = today + 1`

Add `getDuePracticeItems(skill)` to filter by `dueDate <= today` and `status === 'completed_incorrect'`

## 6. Test Plan

### Grammar Session Tests
- Grammar Practice does not show all 411 questions
- User can choose 5 questions session
- User can choose 10 questions session
- User can choose 25 questions session
- Selected count controls max session size
- A1 current level does not load B2 grammar questions
- Empty state when no available questions

### Correct Answer Tests
- Correct grammar answer is marked completed_correct in practiceProgress
- Correct grammar question does not appear again immediately
- Correct grammar question is excluded from Today's Plan

### Wrong Answer Tests
- Wrong grammar answer creates mistake entry in store.js
- Wrong grammar answer creates remediation entry in practiceProgress
- Wrong grammar does not count as completed
- Wrong grammar can appear in Today's Plan when due
- Duplicate wrong attempts do not create duplicate mistakes

### Persistence Tests
- Grammar completion persists after reload
- Old localStorage grammar progress does not crash
- practiceProgress compatibility works (migration)

## 7. Files to Change

1. `src/utils/practiceProgress.js` -- Add `dueDate` support + `getDuePracticeItems()`
2. `src/pages/GrammarPage.jsx` -- Add session setup, filtering, correct/wrong behavior
3. `src/pages/DailyMissionPage.jsx` -- Add `dueDate` filtering to grammar mission (minimal)
4. `tests/srs-queue.test.js` -- Add grammar-specific tests (or new test file)
5. `docs/PHASE18C_GRAMMAR_FINAL_REPORT.md` -- Final report (new)

## 8. Not Changing

- PracticeHubPage.jsx (Phase 18B already done)
- FlashcardPage.jsx (not in scope)
- App.jsx (routing not changing)
- VocabularyPage.jsx (Phase 18B done)
- ReadingPage.jsx, ListeningPage.jsx, WritingPage.jsx, SpeakingPage.jsx (out of scope)
- teachBeforeTest.js (using as-is)
- store.js grammarMastery (extending with practiceProgress, not replacing)
- curriculumProgress.js, dataLoaders.js, adaptivePlan.js (using as-is)
- grammar.json (no content changes)
- MistakeNotebookPage.jsx (should work with existing store.js mistakes)
- Any Supabase/Cloudflare files
