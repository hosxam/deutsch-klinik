# Phase 17 Part 2: Skill Progress & Daily Filtering — Audit

## 1. Reading Completion Storage

**Before fix:**
- `updateLevelProgress(levelId, 'reading', { date, score, total })` was called on submit.
- No `completeReading()` call. No `recordPracticeAttempt()` call.
- No visual status per exercise (button row showed only active selection).

**After fix (commit c504458):**
- `recordPracticeAttempt('reading', readingId, { correct, score, ... })` called on submit.
- `completeReading(levelId, readingId)` called only if all correct.
- Wrong answers recorded as mistakes via `recordAnswer()`.
- This change: **green/red exercise button indicators** via `getPracticeItemStatus('reading', id)`.

## 2. Listening Completion Storage

**Before fix:**
- `updateLevelProgress(levelId, 'listening', { date, score, total })` on submit.
- No `completeListening()` call. No `recordPracticeAttempt()`.

**After fix (commit c504458):**
- `recordPracticeAttempt('listening', listeningId, { correct, score, ... })` on submit.
- `completeListening(levelId, listeningId)` if all correct.
- This change: **green/red exercise button indicators** via `getPracticeItemStatus('listening', id)`.

## 3. Writing Score Storage

**Before fix:**
- `updateState()` stored AI result. No `updateLevelProgress()` or `recordPracticeAttempt()`.

**After fix (commit c504458):**
- `recordPracticeAttempt('writing', prompt.id, { correct: score >= 8, score })` after AI result.
- `updateLevelProgress()` called with score.
- Score threshold: >= 8/10 marks completed.

## 4. Speaking Score Storage

**Before fix:**
- `recordAnswer()` for speaking with AI result. No unified progress tracking.

**After fix (commit c504458):**
- `recordPracticeAttempt('speaking', prompt.id, { correct: score >= 8, score })` after AI transcription.
- Score threshold: >= 8/10 marks completed.

## 5. Today's Practice Filtering

**Before fix:**
- Grammar/vocabulary selection in `DailyMissionPage.jsx` checked only `state.levels[lvl].grammar`/`.vocab` done arrays.
- Reading/Listening/Writing/Speaking `getNext*()` functions checked only legacy completion arrays (`s.readingCompleted`, `s.listeningCompleted`, etc.).
- No integration with practiceProgress model.

**This change (uncommitted so far):**
- Grammar selection: `ppDone` set from practiceProgress_v1 localStorage, filters out completed_correct/mastered items.
- Vocabulary selection: `ppDone` set filters out `{level}_{word.id}` items completed in practiceProgress.
- Reading/Listening/Writing/Speaking `getNext*()`: `ppCompleted` set filters out items with practiceProgress completed status.

## 6. Where practiceProgress Integrates

| Component | Integration Point | Status |
|-----------|------------------|--------|
| ReadingPage.jsx | `recordPracticeAttempt()` + `getPracticeItemStatus()` (visual) | Commit + this change |
| ListeningPage.jsx | `recordPracticeAttempt()` + `getPracticeItemStatus()` (visual) | Commit + this change |
| WritingPage.jsx | `recordPracticeAttempt()` called after AI result | Committed |
| SpeakingPage.jsx | `recordPracticeAttempt()` called after transcription | Committed |
| DailyMissionPage.jsx | Item filtering via practiceProgress | This change |
| PracticePage.jsx | Count selector + SRS filtering | Part 1 |

## 7. Completion Counts

Displayed in:
- Dashboard.jsx (reads from legacy `state.levels[lvl].reading/listening` arrays)
- LevelPage.jsx (reads similar legacy paths)
These are **separate** from practiceProgress and remain functional.
