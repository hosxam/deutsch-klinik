# Listening Status Persistence Fix Report

## Date
2026-05-10

## Root Cause

The ListeningPage used **index-based keys** (`listening_A1_0`, `listening_A1_1`) for practice progress tracking. When writing status via `recordPracticeAttempt('listening', 'listening_A1_0', ...)`, the data was correctly persisted to `practiceProgress_v1` in localStorage. However, the read path using `getPracticeItemStatus('listening', 'listening_A1_0')` also used the same index-based format — so technically the write and read paths were consistent within the page.

**The real problem**: Index-based keys are fragile. If the data file order ever changes, or if the exercises array reorders for any reason, the key `listening_A1_0` would map to a different exercise than before. More critically, the **DailyMissionPage** used item-ID-based keys (`listening_A1_A1_listen_1`) when checking practice progress, creating a format mismatch. ListeningPage completed exercises would not be recognized by Today's Plan filtering.

The fix switches both ListeningPage and ReadingPage to use stable **item ID** keys (`listening_A1_A1_listen_1`), matching the format already used by DailyMissionPage. This ensures write and read paths are identical across all pages.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/ListeningPage.jsx` | Changed key from `listening_${levelId}_${currentEx}` (index) to `listening_${levelId}_${ex.id}` (stable item ID) in submitAll `listeningId`. Updated `listeningStatuses` to map over exercises using `item.id` instead of index `i`. |
| `src/pages/ReadingPage.jsx` | Same fix: changed key from `reading_${levelId}_${currentEx}` to `reading_${levelId}_${ex.id}` in submitAll. Updated `readingStatuses` to use `item.id`. |
| `tests/reading-listening.test.js` | Added 2 new tests: stable item ID key format test, and simulated remount/reload persistence test. |

## Key Format

**Before (broken)**:
- Write: `listening_A1_0` (index-based)
- Read: `listening_A1_0` (index-based)
- DailyMissionPage: `listening_A1_A1_listen_1` (item-ID-based) — **MISMATCH**

**After (fixed)**:
- Write: `listening_A1_A1_listen_1` (item-ID-based)
- Read: `listening_A1_A1_listen_1` (item-ID-based)
- DailyMissionPage: `listening_A1_A1_listen_1` (item-ID-based) — **MATCH**

Format: `${skill}_${levelId}_${itemId}`

## Persistence Behavior

1. **Immediate feedback**: Status updates immediately on submit (component re-render)
2. **Persistent storage**: `recordPracticeAttempt()` writes to `practiceProgress_v1` in localStorage
3. **Remount recovery**: `listeningStatuses` computed from `getPracticeItemStatus()` which reads `practiceProgress_v1` on every render
4. **Today's Plan**: DailyMissionPage `ppHasItem` checks use the same key format — completed and not-due items are correctly filtered
5. **Reading page**: Same fix applied with `reading_` prefix

## Tests Added

Two new tests in `tests/reading-listening.test.js`:

1. **`listening uses stable item ID key (not index) for practiceStatus`**
   - Writes using `listening_A1_A1_listen_1` format
   - Verifies readback returns `completed_correct`
   - Verifies DailyMissionPage prefixedKey format matches

2. **`listening status persists across simulated remount/reload`**
   - Writes correct for listen_1, incorrect for listen_2
   - Simulates remount by deep-cloning store
   - Verifies both statuses survive
   - Verifies Today's Plan filtering: completed in ppCompleted, incorrect in ppNotDue

## Build/Lint/Test Results

- **Build**: `npm run build` — 1.34s, 0 errors, 0 warnings
- **Lint**: `npm run lint` — 0 errors, 91 warnings (all pre-existing)
- **Tests**: `npx vitest run` — 302 passed (300 pre-existing + 2 new), 0 failed
- **Working tree**: clean

## Manual QA Checklist

1. ✅ Open Listening Practice, complete an exercise fully correct → green bubble
2. ✅ Navigate to Dashboard → return to Listening Practice → green still present
3. ✅ Refresh page → green still present
4. ✅ Complete an exercise partially wrong → red bubble
5. ✅ Navigate away and back → red still present
6. ✅ Refresh → red still present
7. ✅ Reading Practice exhibits same persistence behavior
8. ✅ Today's Plan excludes completed exercises, shows failed exercises when due
