# Phase 18D: Reading & Listening Completion Tracking - Final Report

**Status:** Complete | **Commit:** pending

## Summary

Phase 18D fixed Reading Practice and Listening Practice completion tracking by adding dueDate-based filtering to Today's Plan and status summary bars to both practice pages.

## Source-of-Truth Decision

**No change needed.** PracticeProgress_v1 is already the shared source of truth for reading/listening status tracking. Both pages already call `recordPracticeAttempt()` with correct/incorrect status on submit.

The truth audit from Phase 18A was confirmed: both ReadingPage and ListeningPage already had correct completion tracking, mistake recording, and progress counting logic.

## Files Changed

### `src/pages/DailyMissionPage.jsx` (+1 line for todayStr, +1 line ppNotDue per function)
- Added `todayStr` computation (line 1251) used by all `getNext*` functions
- Added `ppNotDue` filtering to `getNextListening()` (line 1258)
- Added `ppNotDue` filtering to `getNextReading()` (line 1276)
- Added `ppNotDue` filtering to `getNextWriting()` (line 1293)
- Added `ppNotDue` filtering to `getNextSpeaking()` (line 1305)

Each `ppNotDue` set filters out items where `status === 'completed_incorrect'` AND `dueDate > todayStr`. This prevents incorrect items from appearing in Today's Plan until their due date (1 day after incorrect attempt).

### `src/pages/ReadingPage.jsx` (+19 lines for status summary bar)
- Added status summary bar after the exercise selector buttons
- Shows: "X completed" (green), "Y needs review" (red), "Z remaining" (muted)
- Only shows when at least one item is completed or needs review

### `src/pages/ListeningPage.jsx` (+19 lines for status summary bar)
- Same pattern as ReadingPage

### `docs/PHASE18D_READING_LISTENING_IMPLEMENTATION_PLAN.md`
- Created implementation plan

### `tests/reading-listening.test.js` (23 tests)
- 8 reading status tests (default, all-correct, not-all-correct, progress counting, ppCompleted filter, ppNotDue future filter, ppNotDue past filter, mistake creation)
- 8 listening status tests (same pattern)
- 7 DailyMissionPage filtering tests (reading completed, reading not-due, reading due, listening completed, listening not-due, listening due, correct-incorrect-correct correction flow)

## localStorage Keys

| Key | Usage | No Change |
|-----|-------|-----------|
| `practiceProgress_v1.reading` | Reading completion status + dueDate | Already correct |
| `practiceProgress_v1.listening` | Listening completion status + dueDate | Already correct |
| `deutsch_klinik_state_default.readingCompleted[level]` | Store.js reading progress | Already correct |
| `deutsch_klinik_state_default.listeningCompleted[level]` | Store.js listening progress | Already correct |

## All Behaviors Verified

### Reading Practice
- [x] Never attempted: default state/color (unchanged)
- [x] Attempted all correct: green/completed (#1a5c3a button, counted in store.js)
- [x] Attempted not all correct: red/needs review (#5c1a2a button, mistake entry created)
- [x] All correct: counted toward reading progress (completeReading + updateLevelProgress called)
- [x] All correct: excluded from Today's Plan (ppCompleted filter in getNextReading)
- [x] Not all correct: mistake entries created (recordAnswer called for each wrong)
- [x] Not all correct with future dueDate: excluded from Today's Plan (ppNotDue filter)
- [x] Not all correct with past dueDate: included in Today's Plan (due for review)
- [x] Status persists after refresh (practiceProgress_v1 localStorage)
- [x] Progress numbers update correctly (updateLevelProgress called)

### Listening Practice
- [x] Same as reading (all behaviors verified)

### Status Summary Bar
- [x] Shows "X completed" in green when items done
- [x] Shows "Y needs review" in red when items wrong
- [x] Shows "Z remaining" for unattempted items
- [x] Hidden when no items completed or wrong (clean first-visit state)

## Test Results

```
Test Files  3 passed (3)
     Tests  112 passed (112)
  Duration   230ms
```

112 total tests passing: 23 new (Phase 18D) + 23 grammar (Phase 18C) + 66 SM-2/flashcards/vocab (Phase 18B)

## Build Results

```
modules transformed: 1905
errors: 0
```

## Lint Results

```
errors: 0
warnings: 8 (all pre-existing, none from Phase 18D changes)
```

## Remaining Limitations

1. **WritingPage and SpeakingPage** still have their `getNext` functions in DailyMissionPage updated for dueDate filtering, but the standalone pages themselves have not been reviewed for completion tracking issues. Phase 18E/18F should review them.
2. **No shared practice session hook** exists yet. Phase 18H should extract the controlled session pattern (session size selector, answer recording, mistake tracking, summary view) into a reusable hook.
3. **GrammarPage standalone vs DailyMissionPage grammar mission** still have slightly different filtering. Phase 18C resolved this partially - the standalone page now uses practiceProgress but DailyMissionPage grammar mission has additional curriculum filtering.

## Files NOT Changed

- `GrammarPage.jsx` - No grammar changes
- `FlashcardPage.jsx` - No flashcard changes  
- `VocabularyPage.jsx` - No vocabulary changes
- `App.jsx` - No routing changes
- `store.js` - No store changes needed
- `teachBeforeTest.js` - No curriculum changes
- `practiceProgress.js` - No changes needed (already had dueDate support from Phase 18C)
- `grammar.json`, `reading.json`, `listening.json` - No data changes
- Any FSP pages, Supabase, Cloudflare files
