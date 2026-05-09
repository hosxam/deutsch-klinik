# Phase 18G: Today's Plan Integration Plan

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline
**Previous commit:** `595fee5` (Phase 18F - Speaking Practice)

## 1. Current State Analysis

### Today's Plan Generation Flow

```
generatePlan(dailyMinutes, currentLevel, goal) → plan[] of {skill, count}
  → buildMissions(plan, levelId, state) → missions[] of {type, target, label}
    → renderMissions sequentially
```

The plan is generated from a fixed time budget per skill. Each skill's time fraction defines how many items to queue. Missions are rendered in order: lesson → grammarLesson → grammar → vocabulary → flashcards → listening → reading → writing → speaking → remediation.

### Source of Truth Per Skill

| Skill | PracticeProgress Key | Key Format | Filtering in DailyMissionPage | Curriculum-Aware |
|---|---|---|---|---|
| Grammar | `practiceProgress_v1.grammar` | Bare `exerciseId` (e.g. `A1_g_q1`) | ✅ ppDone + ppNotDue | ✅ via getUnlockedItems() |
| Vocabulary | `practiceProgress_v1.vocabulary` | `level_id` format (e.g. `A1_voc_1`) | ✅ ppDone filter in word selection | ✅ via getUnlockedItems() |
| Flashcards | SM-2 in store (vocabularyMastery) | N/A | ✅ via getDueVocabWords() | ✅ via lesson-based filtering |
| Reading | `practiceProgress_v1.reading` | `reading_level_id` (e.g. `reading_A1_A1_read_1`) | ✅ ppCompleted + ppNotDue | ✅ via isReadingUnlocked() |
| Listening | `practiceProgress_v1.listening` | `listening_level_id` (e.g. `listening_A1_A1_listen_1`) | ✅ ppCompleted + ppNotDue | ✅ via isListeningUnlocked() |
| Writing | `practiceProgress_v1.writing` | Bare `id` (e.g. `A1_write_1`) | ✅ ppCompleted + ppNotDue | ✅ via isWritingUnlocked() |
| Speaking | `practiceProgress_v1.speaking` | Bare `id` (e.g. `A1_speak_1`) | ✅ ppCompleted + ppNotDue | ✅ via isSpeakingUnlocked() |

### What Already Works

1. **Grammar question selection** (line 669-715): Correctly filters by:
   - `ppDone`: completed_correct excluded
   - `ppNotDue`: completed_incorrect with future dueDate excluded
   - Empty state when all filtered out: "No aligned grammar questions yet"
   - Curriculum unlock check
   - Topic preference (today's lessons first)

2. **Vocabulary word selection** (line 758-780): Correctly filters by:
   - `ppDone`: completed_correct excluded
   - Curriculum unlock check
   - Lesson-based grouping
   - Empty state when filtered: "No introduced vocabulary due"

3. **Reading selection** (line 1272): Correctly filters by:
   - `ppCompleted`: completed_correct excluded
   - `ppNotDue`: completed_incorrect with future dueDate excluded
   - Curriculum unlock check
   - Returns `items[0] || null` (safe null return)

4. **Listening selection** (line 1254): Same pattern as reading

5. **Writing selection** (line 1289): Correctly filters by:
   - `ppCompleted`: completed_correct excluded
   - `ppNotDue`: completed_incorrect with future dueDate excluded
   - Curriculum unlock check via `isWritingUnlocked()`
   - Falls back to `data.find(...) || data[0] || null` (safe since data is already filtered)

6. **Speaking selection** (line 1301): Same pattern as writing

### What Needs Fixing

1. **Writing/Speaking non-curriculum fallback path (lines 1299-1300, 1311-1312)**

   Current code:
   ```javascript
   return data.find(item => !completed.has(item.id)) || data[0] || null;
   ```
   
   `completed` checks `s.levels?.[level]?.writing` - this is the old write-through array. The data array is already filtered by ppCompleted and ppNotDue. So data[0] would be an uncompleted item from practiceProgress's perspective. The `data[0]` fallback triggers only when `data` is empty (no items match after pp filtering), in which case `data[0]` is `undefined`, not a real fallback. This is actually safe.

2. **Remediation fallback to full vocabData (line 1105)**

   ```javascript
   const fallbackWords = words.length > 0 ? words : vocabData.slice(0, 5);
   ```
   
   This falls back to first 5 vocab words when there are no mistakes or weak items. This should only trigger in edge cases (no mistakes, no weak mastery data). Low risk but worth flagging.

3. **Grammar mastery ratio fallback in `unmastered` filter (line 681)**

   ```javascript
   const unmastered = unlockedPool.filter((x) => !ppDone.has(x.id) && !ppNotDue.has(x.id) && (done.includes(x.id) ? grammarMasteryRatio(x.id) < 0.7 : true));
   ```
   
   Items that were previously "done" (in old write-through array) but have mastery ratio >= 0.7 will be excluded even if they're not in practiceProgress. This is a minor inconsistency edge case.

4. **No "due" priority for writing/speaking remediation items**

   Writing and speaking getNext functions filter out ppCompleted and ppNotDue items, so failed items that ARE due will be included in the pool. This is correct behavior.

5. **Missing safe empty states for reading/listening/writing/speaking missions**

   When `getNextReading/Listening/Writing/Speaking` returns null (because all items are completed or filtered), the mission renders without a visible empty state. It just shows nothing or a default state.

## 2. Implementation Plan

### Step 1: Add safe empty states for reading/listening/writing/speaking missions

**File:** `src/pages/DailyMissionPage.jsx`

When `getNextReading/Listening/Writing/Speaking` returns null, render a safe empty state card instead of crashing or showing nothing.

Location: Find the reading/listening/writing/speaking mission render blocks and add null-check + empty state.

### Step 2: Fix remediation vocab fallback

**File:** `src/pages/DailyMissionPage.jsx`

In `buildRemediationSession()`, change the `fallbackWords` from `vocabData.slice(0, 5)` to use a more targeted pool. When no mistakes/weak items exist, show a message instead of dumping vocab words.

### Step 3: Add safety check for grammar empty state display

**File:** `src/pages/DailyMissionPage.jsx`

When grammar selection returns empty (gEmpty true), the empty state already exists. Add a similar check to prevent the "Selecting questions..." loading message from displaying indefinitely.

### Step 4: Ensure `getDuePracticeItems` works for all skills in Today's Plan context

**File:** `src/utils/practiceProgress.js`

Verify `getDuePracticeItems` returns incorrect items across all skills. Already done in previous phases - just verify.

### Step 5: Add comprehensive tests

**File:** `tests/daily-plan-integration.test.js`

Add tests covering:
- All skills having ppCompleted filtering
- All skills having ppNotDue filtering
- Empty states when all items filtered
- Remediation not falling back to full vocab bank
- Grammar not falling back to full grammar bank
- Reading/Listening/Writing/Speaking return null when all filtered

## 3. Test Plan

### General Today's Plan Integration (12 tests)

1. completed grammar item excluded from Today's Plan
2. failed grammar due for review included
3. failed grammar not due excluded
4. completed vocabulary item excluded from Today's Plan
5. completed reading item excluded from Today's Plan
6. completed listening item excluded from Today's Plan
7. completed writing item (score >= 8) excluded from Today's Plan
8. failed writing (score < 8) due for review included
9. completed speaking item (score >= 8) excluded from Today's Plan
10. failed speaking (score < 8) due for review included
11. failed item not due excluded from Today's Plan
12. level filter: A1 level doesn't pull A2/B1/C1 items

### Empty State Tests (5 tests)

1. Grammar empty state when all completed
2. Vocabulary empty state when all completed
3. Writing returns null when all completed
4. Speaking returns null when all completed
5. Remediation doesn't dump full vocab bank

### Total: 17 tests

## 4. Files to Modify

| File | Change | Risk |
|---|---|---|
| `src/pages/DailyMissionPage.jsx` | Empty states for reading/listening/writing/speaking, remediation fix | Low |
| `tests/daily-plan-integration.test.js` | New file with 17 tests | Low |

## 5. Validation

- `npm run build` → 0 errors
- `npm run lint` → 0 errors
- `npx vitest run` → 179/179 tests pass (162 existing + 17 new)
- Working tree committed and pushed
