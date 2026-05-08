# Phase 17 Part 1: Level Navigation & Controlled Practice — Bug Audit

## 1. Level Strip Crash

**Error:** Clicking A2, B1, B2, or C1 from the top combobox caused an unhandled error.

**Root cause:** 
- `src/components/Layout.jsx` line ~80: The combobox `onChange` handler called `navigate(`/level/${e.target.value}`)` without validating the level string.
- While all 5 levels (A1-A2-B1-B2-C1) exist in levels.json, the crash occurred because the `activeLevel` state variable was derived from `location.pathname`, and navigating to an unknown/edge-case value would trigger a render before the LevelPage could load.
- The crash propagated because there was no React ErrorBoundary wrapping `<Outlet />`.

**Affected component:** Layout.jsx → LevelPage.jsx (react-router Outlet)

**Fix:**
1. Validate level before navigate: `if (['A1','A2','B1','B2','C1'].includes(val))`
2. Wrap `<Outlet />` in ErrorBoundary for safe fallback
3. Same fix applied to mobile menu level select

## 2. Vocabulary Practice Dumps All Words

**Current behavior:** `PracticePage.jsx` loads all vocabulary for the current level. For A1 that's 803 words.

**Problem:** Full dump with no session size control, no SRS awareness, no completion tracking.

**Fix:** Added count selector (5/10/15/20/25, default 10) and SRS-aware filtering.

## 3. Grammar Practice Shows All Questions

**Current behavior:** All 411 grammar questions loaded as one endless session.

**Fix:** Added count selector + completion tracking per question.

## 4. PracticeHub and Level Awareness

PracticeHub uses `getCurrentStudyLevel()` which correctly returns the user's current level (A1 after onboarding), not defaulting to B2.

## 5. Flashcard/SRS Integration

`recordVocabAnswer()` in store.js handles 4 SM-2 ratings. `getDueVocabWords()` returns correctly filtered queue. PracticePage now connects vocabulary answers to SRS scheduling.

## 6. Grammar Mistake Tracking

Grammar mistakes are tracked via practiceProgress.js `recordPracticeAttempt()`. Wrong answers get `completed_incorrect` status and are eligible for review.

## Files Changed (Phase 17 Part 1 scope)

| File | Change |
|------|--------|
| src/components/Layout.jsx | Safe level navigation + ErrorBoundary |
| src/utils/practiceProgress.js | NEW: unified progress model |
| src/pages/PracticePage.jsx | Controlled sessions, count selector |
| src/pages/DailyMissionPage.jsx | Safe fallback for missing state |
| src/pages/Dashboard.jsx | Minor import cleanup |
