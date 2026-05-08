# Phase 17: Practice State Fix - Final Report

## Overview

Phase 17 fixed all practice-state bugs across the application in three parts, covering the level strip crash, free-practice overcrowding, skill completion tracking, remediation dashboard crash, and Mistake Notebook cleanup.

---

## Part 1 Summary: Crash Fix & Free Practice Control

### Level Strip Crash Root Cause
- The level navigation strip in `Dashboard.jsx` used `getLevelProgress()` which returned `undefined` for missing level keys
- When a user navigated from a level page where state hadn't initialized `state.levels[level]`, `getCompletedLessons()` would call `.length` on `undefined`
- **Fix**: Added optional chaining `?.[studyLevel]?.length` in all level access patterns

### Vocabulary Practice Control
- **Before**: Free-practice showed ALL 803 vocabulary words, overwhelming the user
- **After**: `getDueVocabWords()` filters to max 25 items, prioritize mistakes, cap new words at 10
- Integration with SM-2 SRS ensures due-based review scheduling

### Grammar Practice Control
- **Before**: Free-practice showed ALL 411 grammar questions, overwhelming the user
- **After**: `getNextGrammarExercise()` filters to max 10 items per session from teach-before-test eligible pool
- Uses `practiceProgress_v1` to exclude already-completed items

### Practice Progress Model (`practiceProgress.js`)
- 44-line utility using `localStorage` key `practiceProgress_v1`
- Single `recordPracticeAttempt(skill, itemId, { correct, score })` function for all 6 skills
- `getPracticeItemStatus()` reads back completion status per item
- Unified data format: `{ [itemId]: { correct, score, skill, completedAt, ... } }`

---

## Part 2 Summary: Skill Completion & Daily Filtering

### Reading Completion
- `recordPracticeAttempt('reading', id, { correct })` after each exercise
- `getPracticeItemStatus()` on exercise button row shows green/red/default indicators
- Visual fix: green = `#1a5c3a` (completed_correct/mastered), red = `#5c1a2a` (completed_incorrect)

### Listening Completion
- Same pattern as Reading: `recordPracticeAttempt('listening', id, { correct })`
- Green/red status indicators on exercise button row

### Writing Completion
- `recordPracticeAttempt('writing', prompt.id, { correct, score })` after AI result
- Threshold: score >= 8/10 marks as completed

### Speaking Completion
- `recordPracticeAttempt('speaking', prompt.id, { correct, score })` after transcription
- Threshold: score >= 8/10 marks as completed

### Daily Mission Filtering (All 6 Skills)
- Grammar: `practiceProgress_v1` completed items excluded via localStorage inline read
- Vocabulary: Same filtering, due flashcards unaffected
- Reading/Listening/Writing/Speaking: All exclude completed items from Today's Plan missions

---

## Part 3 Summary: Remediation & Mistake Cleanup (This Part)

### Remediation Dashboard Crash Fix
**Root Cause**: `Dashboard.jsx` line 36 accessed `state.speakingRecordings[studyLevel]?.length` without optional chaining on `state.speakingRecordings` itself. If `speakingRecordings` was undefined (from stale state, migration, or race condition), it threw `TypeError: Cannot read properties of undefined`.

**Fix** (2 changes):
1. Line 36: `state.speakingRecordings?.[studyLevel]?.length || 0`
2. Line 59 (inside reduce): `state.speakingRecordings?.[lvl.id]?.length || 0`

**Additional**:
- "Back to Dashboard" links in DailyMissionPage now route to `'/'` (actual Dashboard) instead of `/level/{levelId}` (LevelPage)
- Existing safe guard in DailyMissionPage (line 1334) already catches missing state

### Mistake Notebook Cleanup
**Before**: `vocab` skill filter option in Mistake Notebook dropdown, misleading subtitle "reinforce vocabulary"

**After**:
- Removed `vocab` filter option from `skillOptions` (vocab review belongs in Flashcards/Today's Plan)
- Added `writing` and `speaking` filter options for actual mistake skills
- Updated subtitle: removed "reinforce vocabulary"
- Mistake data preserved, flashcards unaffected

### Terminology Fix
- Dashboard "Start Today's Session" changed to "Start Today's Plan" (matching the page title)

---

## Flashcard/SRS Integration

SM-2 algorithm scheduling for vocabulary review:
- `Again`: interval=0 (same day), ease decreased by 0.2
- `Hard`: interval decreased, repetitions unchanged, ease decreased by 0.15
- `Good`: standard interval progression (1, 6, 17+ days), ease +0.15
- `Easy`: accelerated interval (3, 8, 20+ days), ease +0.15 (capped at 3.0)
- Daily cap: 25 cards max, 10 new cards max
- Queue priority: due reviews > mistakes > new cards
- Mastery threshold: 5 correct + ease >= 2.5

---

## Tests Added/Updated

### Unit Tests (SM-2)
- 39 tests covering all scheduling branches, due queue, caps, priority

### Playwright Tests
- **production-smoke.spec.cjs**: 9 tests (dashboard, flashcard, mistakes, exam, all 5 level daily missions)
- **phase17-remediation-smoke.spec.cjs** (new): 6 tests
  - Dashboard loads without crash (empty state resilience)
  - Dashboard after daily navigation does not show "Something broke"
  - Mistake Notebook no longer shows useless vocab section
  - Mistake Notebook still shows mistakes tab
  - Flashcard page still works
  - Today's Plan still loads with remediation

---

## Remaining Limitations

1. **`recordPracticeAttempt` edge case**: When both `correct` and `score` are provided but contradictory (correct=false, score>=8), score wins. Acceptable since schema ensures alignment.
2. **Practice progress is localStorage only**: No cloud sync for completion data. User's practice state is device-specific.
3. **Remediation session generation**: Still text-based vocabulary quick review from mistakes. Could be enhanced but is functional.
4. **No offline service worker**: App depends on network for initial load.

---

## Live Manual Test Checklist

- [x] Onboarding loads
- [x] Dashboard loads with A1
- [x] A2/B1/B2/C1 top strip does not crash
- [x] Practice nav opens Practice Hub
- [x] Vocabulary Practice does not show all 803 words
- [x] Grammar Practice does not show all 411 questions
- [x] Reading completion shows green/red/default state
- [x] Listening completion shows green/red/default state
- [x] Writing/Speaking completion threshold works if testable
- [x] Completed free-practice item does not reappear in Today's Plan
- [x] Remediation to dashboard does not crash
- [x] Mistake Notebook no longer shows useless vocab review section
- [x] Flashcards still show Again/Hard/Good/Easy
- [x] FSP route still loads
- [x] Settings/Account still loads
- [x] No console/runtime errors

---

## Conclusion

All three parts of Phase 17 are complete. The application is stable for live deployment.
