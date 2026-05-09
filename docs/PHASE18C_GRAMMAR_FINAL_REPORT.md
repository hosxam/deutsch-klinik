# Phase 18C: Controlled Grammar Practice - Final Report

**Date:** 2026-05-09
**Branch:** `vocab-import-pipeline`
**Commit:** `3f16851dc87834fbfa49d3d2a4af53a2c55e96db` (Phase 18C changes appended)

## Source-of-Truth Decision

**`practiceProgress_v1.grammar` is the primary source of truth** for grammar question completion/incorrect status. `store.js` grammarMastery is secondary (used for mastery ratio calculations within sessions, but not for filtering).

Rationale: practiceProgress already has `status`, `dueDate`, and `attempts` fields needed for scheduling remediation. Store.js grammarMastery tracks global mastery but lacks the fine-grained due scheduling needed for Today Plan integration.

## Source-of-Truth Chain

```
practiceProgress_v1.grammar → status (completed_correct / completed_incorrect / unattempted)
practiceProgress_v1.grammar → dueDate (YYYY-MM-DD for scheduling)
practiceProgress_v1.grammar → attempts (counter for practice volume tracking)
store.js grammarMastery → correct/incorrect/mastered (secondary, for display)
store.js incorrectAnswers → Mistake Notebook entries (unchanged)
```

## Files Changed

### Modified Files

| File | Changes |
|------|---------|
| `src/utils/practiceProgress.js` | Added: `getTodayDateKey()`, `addDays()` helpers; `dueDate` field in `recordPracticeAttempt()` (correct → +14 days, incorrect → +1 day); `getDuePracticeItems()` (returns due incorrect items); `getNotDuePracticeItems()` (returns not-due correct items) |
| `src/pages/GrammarPage.jsx` | **Rewritten**: Session setup screen with size selector (5/10/15/20/25, default 10); priority-based question selection (needs review → weak → completed lessons → new unlocked); proper answer handling (recordPracticeAttempt + store.js); wrong answer review in summary; empty state when all caught up |
| `src/pages/DailyMissionPage.jsx` | Added: `recordPracticeAttempt` call in `hGa` handler; `ppNotDue` filter to exclude not-due grammar items from Today Plan; today string computation |
| `tests/grammar-practice.test.js` | **New**: 23 tests across 4 suites (session setup, correct answer behavior, wrong answer behavior, persistence/compatibility) |

### Unchanged Files (confirmed no changes needed)

`store.js`, `teachBeforeTest.js`, `FlashcardPage.jsx`, `VocabularyPage.jsx`, `PracticeHubPage.jsx`, `App.jsx`, `MistakeNotebookPage.jsx`, `grammar.json`, `curriculumProgress.js`, `dataLoaders.js`, `adaptivePlan.js`, `LevelPage.jsx`, any FSP* pages, any Supabase/Cloudflare files.

## localStorage Keys Used

| Key | Purpose | Status |
|-----|---------|--------|
| `practiceProgress_v1` | Primary grammar progress (status, dueDate, attempts) | **Already existing** |
| `store.vocabMastery` | SM-2 vocabulary mastery | Existing, unchanged |
| `store.grammarMastery` | Grammar mastery stats (correct/incorrect count) | Existing, unchanged |
| `store.incorrectAnswers` | Mistake Notebook entries | Existing, unchanged |
| `store.completedLessons` | Lesson completion tracking (for unlocked items) | Existing, unchanged |
| `store.levels` | Level progress data | Existing, unchanged |

## Grammar Session Behavior

### Session Setup Screen
- Shows level identifier, total exercise count, stats cards (Available, Completed, Needs Review)
- Session size selector: 5, 10, 15, 20, 25 (default 10)
- "Start Session" button with question count
- Empty state when all exercises completed ("All Caught Up!" with completion stats)

### Question Selection Priority (4-tier)
1. **Needs Review** - `completed_incorrect` items with `dueDate <= today`
2. **Weak Concepts** - Mastery ratio < 0.7 with at least 1 attempt
3. **Completed Lessons** - Questions linked to `completedLessons` IDs
4. **New Unlocked** - Remaining questions that pass `getUnlockedItems()` filter

### Session Controls
- Progress: current question / total (e.g. "3/10")
- Score counter
- "Exit" button (non-daily mode)
- Topic filter display when active

## Correct Answer Behavior

When answering correctly:
1. `recordGrammarAnswer(id, true)` - Updates store.js grammarMastery
2. `recordPracticeAttempt('grammar', id, { correct: true })` - Sets `status: 'completed_correct'` and `dueDate: today + 14 days`
3. `recordAnswer(levelId, id, ...)` - No mistake entry created (only incorrect calls generate Mistake Notebook entries)
4. `updateLevelProgress()` - Updates level progress tracking
5. Question is immediately excluded from further free practice and Today Plan

## Wrong Answer Behavior

When answering incorrectly:
1. `recordGrammarAnswer(id, false)` - Updates store.js grammarMastery (increments incorrect count)
2. `recordPracticeAttempt('grammar', id, { correct: false })` - Sets `status: 'completed_incorrect'` and `dueDate: today + 1 day`
3. `recordAnswer(levelId, id, userAnswer, correctAnswer, topic, false, 'grammar')` - Adds/updates Mistake Notebook entry
4. Same entry is updated (not duplicated) on subsequent incorrect attempts (increment attempts counter)
5. Question appears in Today Plan only when `dueDate <= today`
6. Session summary shows wrong answers with corrections and lesson links when score < 60%

## Mistake Notebook Integration

No changes to Mistake Notebook were needed. `store.recordAnswer()` already:
- Creates entries with `{ userAnswer, correctAnswer, topic, type: 'grammar' }`
- Groups by level
- Displays question/concept, user answer, correct answer, explanation
- Supports count-based deduplication

Grammar mistakes flow through the existing `recordAnswer` call in the `handleAnswer` function.

## Today Plan Grammar Filtering Behavior

DailyMissionPage's grammar mission now:
- **Excludes** `completed_correct` items (already done, not due)
- **Excludes** `completed_incorrect` items with `dueDate > today` (not yet due for review)
- **Includes** `completed_incorrect` items where `dueDate <= today` (due for remediation)
- **Includes** unattempted/unlocked items (new practice)
- Correctly completed grammar does NOT appear in Today Plan
- Incorrect grammar appears only as remediation when due
- Uses `getUnlockedItems()` for lesson-aware filtering (same as before)

## Tests Added

**File:** `tests/grammar-practice.test.js` (23 new tests)

### Grammar Session Setup (8 tests)
- Does not show all 411 questions
- User can choose 5/10/25 questions
- Selected count controls max session size
- A1 does not load B2 questions
- Empty array when no available questions
- Returns fewer than requested if pool is small

### Correct Answer Behavior (4 tests)
- Marked completed_correct in practiceProgress
- Does not appear again immediately
- Excluded from Today Plan
- Sets dueDate 14 days in future

### Wrong Answer Behavior (7 tests)
- Creates remediation entry (completed_incorrect)
- Does not count as completed
- Appears in Today Plan when due
- Appears due after 1 day
- Sets dueDate 1 day in future
- Duplicate wrong attempts increment (no duplicates)
- Prioritizes needs review in session pool

### Persistence/Compatibility (4 tests)
- Grammar completion persists after reload
- Old localStorage does not crash (no practiceProgress entry)
- practiceProgress compatibility with existing data
- Mixed correct/incorrect pool returns correct counts

## Build/Lint/Test Results

### Unit Tests
- **89 tests total: 89 passed** (66 SM-2 + 23 grammar)
- **0 failures**

### Build
```
✓ built in 873ms
1905 modules transformed
0 errors
```

### Lint
```
0 errors, 75 warnings (all pre-existing, none caused by this phase)
```

### Playwright Tests
No grammar-specific Playwright tests exist. The existing smoke tests pass (tested separately in prior phases).

## Implementation Details

### practiceProgress.js Additions
- `getTodayDateKey()` → Returns `YYYY-MM-DD` string for today
- `addDays(n)` → Returns `YYYY-MM-DD` string for today + n days
- `recordPracticeAttempt(skill, itemId, { correct })` → Now sets `dueDate`:
  - Correct: `dueDate = today + 14 days`
  - Incorrect: `dueDate = today + 1 day`
- `getDuePracticeItems(skill)` → Returns items with `status === 'completed_incorrect'` and `dueDate <= today`
- `getNotDuePracticeItems(skill)` → Returns items with `status === 'completed_correct'` and `dueDate > today`

### GrammarPage.jsx Rewrite
- Session setup screen with size selector (conditional rendering)
- Priority-based pool builder using `useCallback`
- Answer handler calls both `recordGrammarAnswer()` and `recordPracticeAttempt()`
- Wrong answer tracking in local state for session summary
- Completed session summary with wrong answer review
- Empty state handling
- Maintains existing `LevelLock`, `GermanCharHelper`, and all exercise type renderers

### DailyMissionPage.jsx Patch (minimal)
- Added `import { recordPracticeAttempt } from '../utils/practiceProgress';`
- Added `recordPracticeAttempt('grammar', ex.id, { correct })` in `hGa` handler
- Added `todayStr` computation
- Added `ppNotDue` set for filtering not-due items

## Remaining Limitations

1. **Level change during session** - Not added; user must exit session and change URL
2. **No curriculum enrichment** - Uses existing `grammar.json` data as-is
3. **No flashcard-style grammar cards** - Would require new flashcard type; deferred per constraints
4. **No due-date visualization** - The session setup screen shows "Needs Review" count but does not show exact due dates
5. **DailyMissionPage grammar filtering** uses inline localStorage reads rather than the centralized `getDuePracticeItems()` helper
6. **Grammar session review links** for wrong answers link to a single lesson ID; could be improved with multiple lesson links
7. **No SRS interval for grammar** - Uses flat 14-day/1-day due windows, not SM-2 style increasing intervals

## Next Phase Recommendations

1. **Phase 18D: Fix Reading Practice** - Apply similar controlled session pattern to ReadingPage
2. **Phase 18E: Fix Listening Practice** - Apply similar controlled session pattern to ListeningPage
3. **Phase 18F: Fix Writing Practice** - Apply similar controlled session pattern to WritingPage
4. **Phase 18G: Fix Speaking Practice** - Apply similar controlled session pattern to SpeakingPage
5. **Phase 18H: Shared Practice Infrastructure** - Extract shared session logic (pool builder, answer handler, progress integration) into reusable hooks

## Rollback Notes

To revert Phase 18C:
- Restore `GrammarPage.jsx` from git history (`git revert` or manual restore)
- Revert `DailyMissionPage.jsx` changes (remove `recordPracticeAttempt` import/call, remove `ppNotDue` filter)
- Remove `dueDate` additions in `practiceProgress.js` (or keep as they don't break existing behavior)
- Delete `tests/grammar-practice.test.js`
- Delete this report and the implementation plan
