# Phase 18G: Today's Plan Integration - Final Report

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline
**Previous commit:** `595fee5` (Phase 18F - Speaking Practice)

## Summary

Phase 18G completes the Today's Plan filtering integration across all 6 skills. It ensures that practiceProgress_v1 is the authoritative source of truth for whether items are completed, failed, or due, and that no skill section falls back to full data banks.

## Files Changed

| File | Change |
|---|---|
| `src/pages/DailyMissionPage.jsx` | Added `completeWriting`, `completeSpeaking` imports. Added `AlertTriangle` import. Patched `hRdA`, `hLrnA`, `hWt`, `hSp` handlers to call store.js completion functions and `recordPracticeAttempt()` for persistent tracking. Added `ppHasItem()` helper for backward-compatible key format matching. Updated `getNextListening`/`getNextReading` to use `ppHasItem()`. Fixed remediation fallback to return empty state instead of `vocabData.slice(0, 5)`. Added empty state render for remediation when no items found. |
| `tests/daily-plan-integration.test.js` | New file with 21 integration tests across 7 groups. |
| `docs/PHASE18G_TODAYS_PLAN_INTEGRATION_PLAN.md` | New file - implementation plan. |

## Source of Truth Per Skill

| Skill | Progress Key | Key Format | Status |
|---|---|---|---|
| Grammar | `practiceProgress_v1.grammar` | Bare `exerciseId` | ✅ Correct - `recordPracticeAttempt()` called from standalone page |
| Vocabulary | `practiceProgress_v1.vocabulary` | `level_id` format | ✅ Correct - SM-2 `recordVocabAnswer` + pp tracking |
| Flashcards | SM-2 `vocabularyMastery` | Level-based | ✅ Correct - via `getDueVocabWords()` |
| Reading | `practiceProgress_v1.reading` | `reading_level_item_id` (daily mission) / `reading_level_index` (standalone) | ✅ Fixed - `completeReading()` + `recordPracticeAttempt()` now called from daily mission. `ppHasItem()` handles both key formats. |
| Listening | `practiceProgress_v1.listening` | `listening_level_item_id` (daily mission) / `listening_level_index` (standalone) | ✅ Fixed - `completeListening()` + `recordPracticeAttempt()` now called from daily mission. `ppHasItem()` handles both key formats. |
| Writing | `practiceProgress_v1.writing` | Bare `id` | ✅ Fixed - `completeWriting()` + `recordPracticeAttempt()` now called from daily mission handler. |
| Speaking | `practiceProgress_v1.speaking` | Bare `id` | ✅ Fixed - `completeSpeaking()` + `recordPracticeAttempt()` now called from daily mission handler. |

## Critical Bugs Fixed

1. **Daily mission handlers did not call completion functions.** `hRdA`, `hLrnA`, `hWt`, `hSp` updated in-session state variables but did NOT call `completeReading/Listening/Writing/Speaking()` or `recordPracticeAttempt()`. This meant completions from the daily mission were not persistently tracked. On reload, the same items appeared again.

2. **Key format mismatch.** `ppCompleted`/`ppNotDue` in `getNextReading`/`getNextListening` checked `reading_${level}_${item.id}` but standalone pages stored `reading_${level}_${index}` (e.g., `reading_A1_0`). These never matched, making pp filtering dead code for reading/listening. Fixed with `ppHasItem()` helper that checks both formats.

3. **Remediation fallback to full vocab bank.** `buildRemediationSession` fell back to `vocabData.slice(0, 5)` when no mistakes or weak items were found. Fixed to return `{ empty: true }` with a safe empty state message.

## Today's Plan Filtering Behavior

### Grammar (lines 669-715)
- Completed_correct items excluded via ppDone
- Completed_incorrect items excluded when not due via ppNotDue
- Unlocked items filtered through curriculum check
- Empty state: "No aligned grammar questions yet"

### Vocabulary/Flashcards (lines 758-780)
- SM-2 `getDueVocabWords()` handles scheduling
- Mistake-generated cards prioritized before new cards
- Curriculum unlock check
- Empty state: "No introduced vocabulary due"

### Reading (lines ~1260-1280)
- `getNextReading` filters by ppCompleted, ppNotDue (via ppHasItem)
- Curriculum unlock check via `isReadingUnlocked()`
- Returns `items[0] || null` (safe)
- Daily mission handler now calls `completeReading()` + `recordPracticeAttempt()`

### Listening (lines ~1254-1272)
- Same pattern as reading
- Daily mission handler now calls `completeListening()` + `recordPracticeAttempt()`

### Writing (lines ~1290-1315)
- Completed (score >= 8) excluded via ppCompleted
- Failed (score < 8) excluded when not due via ppNotDue
- Curriculum unlock check via `isWritingUnlocked()`
- Daily mission handler now calls `completeWriting()` + `recordPracticeAttempt()` with AI score or 0 fallback

### Speaking (lines ~1301-1320)
- Completed (score >= 8) excluded via ppCompleted
- Failed (score < 8) excluded when not due via ppNotDue
- Curriculum unlock check via `isSpeakingUnlocked()`
- Daily mission handler now calls `completeSpeaking()` + `recordPracticeAttempt()` with AI score or 0 fallback

### Remediation
- No longer falls back to `vocabData.slice(0, 5)` when no mistakes/weak items exist
- Returns `{ empty: true }` which renders an empty state card with "Skip for now" button

## Empty States Added

- **Reading/listening/writing/speaking**: Null return from getNext functions results in rendering nothing (safe return). No crash path.
- **Remediation**: New empty state card with `AlertTriangle` icon, "No remediation items needed right now" message, and "Skip for now" button.

## Tests Added

**File:** `tests/daily-plan-integration.test.js` (21 tests)

| Group | Tests | Coverage |
|---|---|---|
| Flashcards/Vocab (3) | includes due, includes not-due as new, excludes completed from SM-2 | ppCompleted filtering, state-based completed filtering |
| Grammar (3) | excludes completed correct, excludes not-due failed, includes due failed | ppCompleted, ppNotDue dueDate logic |
| Reading (3) | excludes completed via state, excludes not-due failed, includes due failed | state.completed filtering, ppNotDue with future/past dates |
| Listening (3) | excludes completed via state, excludes not-due failed, includes due failed | Same pattern as reading |
| Writing (3) | excludes score>=8 completed, excludes not-due failed, includes due failed | ppCompleted, ppNotDue with score threshold |
| Speaking (3) | excludes score>=8 completed, excludes not-due failed, includes due failed | Bare key format (same as speaking uses) |
| Full Integration (3) | all items completed returns nulls, no full-bank fallback when all excluded, level separation | End-to-end verification |

## Build Result

```
> vite build
✓ built in 1.01s
```

0 errors. Build passes.

## Lint Result

```
✖ 78 problems (0 errors, 78 warnings)
```

0 errors. All 78 warnings are pre-existing.

## Unit Test Result

```
✓ 6 test files passed
✓ 183 tests passed (162 existing + 21 new)
```

All tests pass. No regressions.

## Playwright Result

```
Running 9 tests using 1 worker
·········
  9 passed (9.8s)
```

Production smoke tests pass (9/9).

## Remaining Limitations

1. **SM-2 flashcards and vocabulary are managed separately.** Flashcards use `vocabularyMastery`/`getDueVocabWords()` for scheduling, while vocabulary uses `practiceProgress_v1.vocabulary` for completed tracking. These two systems don't share state. This is a pre-existing architecture decision and was not changed in this phase.

2. **Key format inconsistency persists between standalone pages and daily mission.** Standalone reading/listening pages still use `reading_${level}_${index}` format while the daily mission uses `reading_${level}_${item.id}`. The `ppHasItem()` helper bridges this, but it's a fragile string-includes check. A future phase could standardize all keys to use `item.id`.

3. **Reading/listening daily mission empty handling is passive** (returns null, which stops rendering). No visible empty state is shown for reading/listening when all items are completed. Writing/speaking have the same pattern. This is acceptable since the mission simply advances to the next mission type.

4. **No curriculum progress validation** for pre-existing lessons. The curriculum validation scripts (`validate-teach-before-test`, `validate-curriculum-map`) show errors for FSP (full speed program) lessons that don't exist in `germanLessons.json`. These are pre-existing data issues unrelated to this phase.

## Next Recommended Phase

**Phase 18H: Standardize practiceProgress key formats across standalone pages and daily mission.**

- Change standalone ReadingPage/ListeningPage to use item.id-based keys instead of index-based keys
- Remove the `ppHasItem()` bridge
- Verify all key formats match across all 6 skills
- Add runtime validation to detect key format mismatches

Alternatively, if the current approach is stable enough:

**Phase 19: Curriculum-aware SRS scheduling for reading/listening/writing/speaking.**

- Apply SM-2-like spaced repetition intervals to reading/listening/writing/speaking items
- Use practiceProgress_v1 intervals to compute next due dates automatically
- Replace the current 1-day/3-day/7-day hardcoded intervals with computed SRS intervals
- Add an SRS review queue for non-vocabulary skills
