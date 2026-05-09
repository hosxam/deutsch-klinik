# Phase 19B Final Report: Exam Unlock Requirements + Mistakes as Flashcards

## Summary

Tightened exam unlock requirements so all level categories must be completed before the exam unlocks. Removed typed-answer mistake review from Mistake Notebook and converted all mistake review to shared SM-2 flashcard-style (Again/Hard/Good/Easy).

## Files Changed

| File | Change |
|------|--------|
| `src/data/levels.json` | Added `lessonCount`, `vocabMasteredRequired`, `grammarCorrectRequired`, `readingCorrectRequired`, `listeningCorrectRequired`, `writingScoreRequired`, `speakingScoreRequired` fields |
| `src/utils/store.js` | Added `getLevelExamProgress()`, `getMissingExamRequirements()`, `getVocabMasteredCount()`, `getGrammarCorrectCount()`, `getReadingCorrectCount()`, `getListeningCorrectCount()`, `getWritingPassedCount()`, `getSpeakingPassedCount()`, `getDueMistakeCount()` helper functions. Replaced weak `isExamUnlocked()` with structured progress-based version. |
| `src/pages/LevelPage.jsx` | Uses new `getLevelExamProgress()` and `getMissingExamRequirements()`. Exam readiness now shows all 8 categories with dynamic counts from real progress data. Removed stale hardcoded requirement grid. |
| `src/pages/ExamPage.jsx` | Uses `getLevelExamProgress()` for route guard. Missing requirements display shows dynamic list instead of 6 hardcoded categories. |
| `src/pages/MistakeNotebookPage.jsx` | Removed all typed-answer state (`retryAnswers`, `retryResults`, `retryCorrectCount`). Removed text input + Check button + result display. Removed `mistake-retry` skill filter. Removed stale answer cleanup. Stats shows "Due Today" instead of "Retries Correct". Added `getLocalDateKey`/`getVocabMastery` imports for due count. Cleared unused imports. |
| `tests/exam-unlock.test.js` | **NEW**: 10 tests covering `getLevelExamProgress`, `getMissingExamRequirements`, `isExamUnlocked`, and `recordVocabAnswer` for mistake cards |

## New Exam Unlock Requirements

Each level requires completion of all 8 categories:

| Category | Data Source | Required per level |
|----------|-------------|-------------------|
| Lessons | `getCompletedLessons(level).length` | lessonCount (25) |
| Grammar | `grammarMastery` entries with mastered or correct>0 and no incorrect | grammarCorrectRequired (60) |
| Reading | `readingCompleted[level].length` | readingCorrectRequired (25) |
| Listening | `listeningCompleted[level].length` | listeningCorrectRequired (25) |
| Writing | `writings` filtered by level and score >= 8 | minWritingTasks (10) |
| Speaking | `speakingRecordings[level]` filtered by score >= 8 | minSpeakingTasks (10) |
| Flashcards | `vocabularyMastery` entries with mastered flag or enough reps | vocabMasteredRequired (100) |
| Reviews | Due mistakes (pending SM-2 review) | 0 (informational, does not block) |

## Mistake Flashcard Behavior

- All mistakes use shared SM-2 scheduler (same as Practice Flashcards)
- Again: 0 interval, ease -0.2, reps reset
- Hard: 1.2x interval, ease -0.15
- Good: normal SM-2 (1/6 days / 1.0 ease factor)
- Easy: 1.3x bonus interval, ease +0.15
- Mark as Mastered: removes from active review
- Remove: deletes from mistake storage
- Mistake cards stored as `vocabularyMastery` entries with `mistake_` prefix
- Mistake cards appear in flashcard queue when due (same `getVocabQueue` function)

## Test Results

- **184 unit tests pass** (existing, unchanged)
- **10 new tests pass** (exam-unlock.test.js)
- **194 total tests pass** across 7 test files

## Build & Lint

- **Build**: Succeeds (0 errors)
- **Lint**: 0 errors, 0 warnings

## Remaining Limitations

- Reading/listening completion tracking only stores IDs without score data (all-correct assumption)
- Writing/speaking scoring relies on `getPracticeItemStatus` — needs explicit practice completion
- No explicit migration step for old typed-answer retry data (harmless stale keys in state that are never accessed)
- Flashcard mastered count is an approximation: counts `mastered === true` OR `repetitions >= 2 && interval > 0`
- Grammar correct count counts any entry with `correct > 0 && !incorrect` — may overcount partial attempts

## Manual QA Checklist

1. [ ] A1 exam locked shows all 8 missing requirement categories
2. [ ] Direct URL `/level/A1/exam` is blocked with missing requirements
3. [ ] Mistake Notebook has no text input or Check button
4. [ ] Mistake Notebook shows Reveal/Again/Hard/Good/Easy/Mark as Mastered/Remove
5. [ ] Marking mistake as Again schedules it for soon (0 interval)
6. [ ] Marking mistake as Good schedules it for 1 day
7. [ ] Wrong answer does NOT leak between mistake cards
8. [ ] FlashcardPage shows mistake cards (with `mistake_` prefix) when due
9. [ ] No console errors on Mistake Notebook page
10. [ ] No console errors on Level page
