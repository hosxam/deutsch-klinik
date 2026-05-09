# Phase 19: Live Practice Bug Fixes — Final Report

## Summary

Fixed 8 live bugs across Reading, Listening, DailyMissionPage, MistakeNotebook, and store.js. All 183 existing tests pass. Build succeeds.

## Bugs Fixed

### Bug 1: Reading Back Navigation Crash
- **Fix:** Added null guard for `ex` before accessing `ex.questions` in ReadingPage.jsx
- **File:** `src/pages/ReadingPage.jsx`

### Bug 2: Reading All-Correct Marked Red/Incorrect
- **Root Cause:** `recordPracticeAttempt` in practiceProgress.js used an absolute threshold (`score >= 8`) to determine status, which is wrong for reading/listening with small question counts (e.g., 4/4 all correct gives score=4, which is < 8, so it gets overwritten to `completed_incorrect`)
- **Fix:** Changed to proportional threshold. If `result.correct` was explicitly passed, that takes priority and the score threshold is not used for status determination. If only score is passed (no correct flag), use `score / maxScore >= 0.8` instead of `score >= 8`.
- **File:** `src/utils/practiceProgress.js`

### Bug 3: Listening All-Correct Key Mismatch
- **Root Cause:** ListeningPage used `listening_${levelId}_${ex.id || currentEx}` as the store key, but the status lookup used `listening_${levelId}_${i}` (index-based). When `ex.id` was a prefixed string like "A1_listen_1", the stored key became `listening_A1_A1_listen_1` while the lookup used `listening_A1_0` — a complete mismatch.
- **Fix:** Normalized to always use index-based key: `listening_${levelId}_${currentEx}`
- **File:** `src/pages/ListeningPage.jsx`

### Bug 4: Listening Submit with Stale `ex`
- **Fix:** Added null guard in `submitAll` for `ex` and `ex.questions`
- **File:** `src/pages/ListeningPage.jsx`

### Bug 5: Mistake Notebook Wrong Answer Type Crash
- **Root Cause:** When `mistake.correctAnswer` is undefined/null, `checkMistakeRetry` calls `.toLowerCase()` on it and crashes.
- **Fix:** Only show retry input/check UI when `correctAnswer` exists and is non-empty. Otherwise show an explanation banner.
- **File:** `src/pages/MistakeNotebookPage.jsx`

### Bug 6: Today's Plan Flashcards Used 2 Buttons (Knew/Didn't Know)
- **Fix:** Replaced 2-button boolean system with full 4-button SM-2 controls: Again (1), Hard (2), Good (3), Easy (4) — matching FlashcardPage exactly
- **File:** `src/pages/DailyMissionPage.jsx`

### Bug 7: Mistakes Not Becoming SM-2 Review Flashcards
- **Fix:** When `recordAnswer` creates a mistake entry, it now also creates/updates a `vocabularyMastery` entry under key `mistake_${level}_${exerciseId}` with SM-2 scheduling. This makes mistakes reviewable through the SM-2 queue.
- **File:** `src/utils/store.js`

### Bug 8: Score Threshold for Writing/Speaking Preserved
- The proportional threshold (`score / maxScore >= 0.8`) correctly handles writing (score out of 10 → 8+/10 passes) and speaking (same), while also correctly handling reading/listening (4/4 = 100% passes, 3/4 = 75% fails).

## Files Modified

| File | Changes |
|------|---------|
| `src/utils/practiceProgress.js` | Proportional score threshold, correct flag priority |
| `src/pages/ReadingPage.jsx` | Null guard for ex before questions access |
| `src/pages/ListeningPage.jsx` | Normalized store key, null guard in submitAll |
| `src/pages/DailyMissionPage.jsx` | 4-button SM-2 rating, added icon imports |
| `src/pages/MistakeNotebookPage.jsx` | Conditionally show retry/explanation based on correctAnswer |
| `src/utils/store.js` | recordAnswer creates vocabularyMastery entries for mistakes |

## Test Results

- **183/183 tests passing** — no regressions
- **Build successful** — no lint errors (chunk size warning is pre-existing)
