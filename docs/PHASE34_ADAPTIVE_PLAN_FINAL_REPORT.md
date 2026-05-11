# Phase 34: Adaptive Plan Consolidation - Final Report

## Summary

Consolidated Today's Plan daily mission generation into a single source of truth (`buildDailyPlan.js`), replacing the previous dual-engine approach where `buildAdaptiveTargets()` targets were calculated then immediately overwritten by `generatePlan()` minute-budget defaults.

## Root Cause

In `DailyMissionPage.jsx`, `calculateDailyTargets()` called `buildAdaptiveTargets()` first (generating adaptive targets with weak-area injection, level-based minimums, and active/passive weighting), then called `generatePlan()` which recomputed its own targets from scratch using a `TIME_BUDGET` / `MINS_PER_ITEM` approach, effectively discarding all adaptive logic.

## Files Changed

### NEW: `src/utils/buildDailyPlan.js`
Single source of truth with 8 exported functions:
- **`buildDailyPlan(levelId, state, goal)`** - Main function: proportional allocation + level-based minimums + weak-area injection + active/passive weighting, returns structured `{ level, dailyMinutes, targets, sections, estimatedMinutes, generatedAt }` in one pass
- **`planToMissions(plan)`** - Converts structured plan to mission array for UI stepper
- **`getPlanSignature(plan)`** - Cache validation signature
- **`hasDueFlashcards(state, levelId)`** - Due check for vocabulary mastery
- **`proportionalCounts(dailyMinutes)`** - Minute-budget fractions from old generatePlan
- **`levelBasedMinimums(dailyMinutes, levelId, goal, hasDueFlashcards)`** - Hard thresholds from old buildAdaptiveTargets
- **`applyWeakAreaBoost(targets, state, levelId, dailyMinutes)`** - Mistake-based injection
- **`applyActivePassiveWeighting(targets, levelId, dailyMinutes, goal)`** - Level-based weighting

### MODIFIED: `src/pages/DailyMissionPage.jsx`
- Replaced `import { buildAdaptiveTargets, ... }` with `import { buildDailyPlan } from '../utils/buildDailyPlan'`
- Removed `TIME_BUDGET`, `MINS_PER_ITEM` constants
- Removed `generatePlan()` entirely (replaced by comment pointing to buildDailyPlan)
- Simplified `calculateDailyTargets()` from ~100 lines to ~15 lines that call `buildDailyPlan()` once and map to legacy format

## Preserved Features

- Flashcards/SRS SM-2 scheduling and review logic
- Grammar controlled learning with SM-2 due dates
- Reading/listening status filtering with cooldowns
- Writing/speaking >=8 threshold filtering
- Mistake review due logic
- Teach-before-test unlock logic
- Supabase/local sync behavior
- Weak-area injection (grammar/vocab boosts at >=3, listening/reading at >=2)
- Active/passive weighting by level (B1+ mandatory writing/speaking, C1 2 writing tasks, FSP heavy weighting)
- Topic-grouped vocabulary/reading/listening/writing/speaking via `preferTopicItems`

## Structured Output Format

```js
{
  level: 'A1',
  dailyMinutes: 30,
  targets: { grammar: 6, vocabulary: 10, flashcards: 0, reading: 1, listening: 0, writing: 0, speaking: 0, remediation: 0, lesson: 0, grammarLesson: 0 },
  sections: {
    grammar:     { count: 6,  reason: 'standard', status: 'included' },
    vocabulary:  { count: 10, reason: 'standard', status: 'included' },
    flashcards:  { count: 0,  reason: 'no_room',  status: 'excluded' },
    reading:     { count: 1,  reason: 'standard', status: 'included' },
    listening:   { count: 0,  reason: 'no_room',  status: 'excluded' },
    writing:     { count: 0,  reason: 'no_room',  status: 'excluded' },
    speaking:    { count: 0,  reason: 'no_room',  status: 'excluded' },
  },
  estimatedMinutes: 27,
  generatedAt: '2026-05-11',
  isFsp: false
}
```

## Tests Added

Added to `tests/adaptive-plan-v2.test.js` (now 52 tests, was 41):

### `Phase 34 – buildDailyPlan dailyMinutes scaling` (4 tests)
- **dailyMinutes 15**: grammar=4, vocab=6, no reading/writing/speaking, max 3 skills
- **dailyMinutes 30**: grammar=6, vocab=10, reading=1, 3-5 skills active
- **dailyMinutes 60**: grammar=10, vocab=16, reading+listening+writing, 5-6 skills
- **dailyMinutes 120**: grammar=20, vocab=32, all 6 core skills

### `Phase 34 – buildDailyPlan adaptive target preservation` (1 test)
- Verifies plan output shape has all required fields (level, dailyMinutes, sections with count/reason/status, no dataBank/fallback)

### `Phase 34 – buildDailyPlan level awareness` (2 tests)
- A1 plan does not force B2-style speaking/writing
- FSP track gets heavier writing/speaking

### `Phase 34 – buildDailyPlan edge cases` (4 tests)
- Missing goal defaults gracefully
- Zero dailyMinutes floors to 30
- Null state sections don't crash
- Estimated minute ceiling is reasonable

## Test Results

```
Test Files:  13 passed (13)
     Tests:  377 passed (377)
  Duration:  753ms
```

(11 new tests added: 377 total vs 366 before)

## Build & Lint

```
Build: 913ms (success)
Lint:  0 errors, 96 warnings (pre-existing)
```

## Deletion

`docs/PHASE34_ADAPTIVE_PLAN_AUDIT.md` kept for historical reference.
