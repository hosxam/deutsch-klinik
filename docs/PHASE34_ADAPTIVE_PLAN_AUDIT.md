# Phase 34 Adaptive Plan Audit

Audited: 2026-05-11 14:00 Dubai
Branch: `vocab-import-pipeline`

---

## 1. All Functions That Generate or Modify Today's Plan

### 1.1 `buildAdaptiveTargets()` in `src/utils/adaptivePlan.js` (lines ~165-194)

**Purpose**: Calculates adaptive target counts per skill based on `dailyMinutes` and user goal.

**Inputs**: `levelId`, `state`, `goal`

**Output**: `{ lesson, grammarLesson, grammar, vocab, flashcards, reading, listening, writing, speaking, estimatedMinutes, intensity }`

**Logic**: Hard thresholds on dailyMinutes:
- `<30`: only lesson + grammar + vocab + flashcards (0 reading/listening/writing/speaking)
- `<60`: adds grammarLesson + 1 reading (no listening/writing/speaking)
- `<90`: adds listening + writing (no speaking)
- `<120`: adds speaking + remediation
- `>=120`: higher counts for everything

Also checks for due flashcards and vocab mistakes to decide flashcard count.

### 1.2 `TIME_BUDGET` and `MINS_PER_ITEM` in `DailyMissionPage.jsx` (lines ~84-99)

**Purpose**: Fixed fraction-based budget for `generatePlan()`.

```js
const TIME_BUDGET = {
  lesson: 0.25,
  grammar: 0.20,
  flashcard: 0.20,
  reading: 0.15,
  listening: 0.12,
  writing: 0.08,
};

const MINS_PER_ITEM = {
  lesson: 8,
  grammar: 1.5,
  flashcard: 0.5,
  reading: 5,
  listening: 4,
  writing: 7,
  speaking: 6,
};
```

### 1.3 `generatePlan()` in `DailyMissionPage.jsx` (lines ~101-119)

**Purpose**: Generates a plan by dividing `dailyMinutes` by fixed fractions.

**Inputs**: `dailyMinutes`, `currentLevel`, `goal`

**Output**: Array of `{ skill, count }` objects.

**Logic**: For each skill in `TIME_BUDGET`:
- `allocated = minutes * fraction`
- `count = Math.max(1, Math.floor(allocated / MINS_PER_ITEM[skill]))`
- FSP track adds anamnese + extra vocab

### 1.4 `calculateDailyTargets()` in `DailyMissionPage.jsx` (lines ~121-227)

**Purpose**: Main function called on every page load to compute the day's targets.

**This is the central buggy function.**

**Flow**:
1. Calls `buildAdaptiveTargets(levelId, state, goal)` — gets adaptive targets
2. Calls `generatePlan(dailyMinutes, levelId, goal)` — gets budget-based plan
3. **Overwrites all adaptive targets with generatePlan values**:
   ```js
   const targets = {
     ...baseTargets,   // from buildAdaptiveTargets
     lesson: 0,         // explicitly zeroed out
     grammar: 0,        // explicitly zeroed out
     flashcards: 0,
     reading: 0,
     listening: 0,
     writing: 0,
     estimatedMinutes: dailyMinutes,
   };
   for (const item of plan) {
     if (item.skill === 'flashcard') {
       targets.flashcards = item.count;
     } else if (item.skill in targets) {
       targets[item.skill] = item.count;
     }
   }
   ```
4. Applies **weak-area injection** on top of the overwritten values
5. Applies **active/passive weighting by level** on top of that

**Result**: `buildAdaptiveTargets()` is called but completely overwritten. The adaptive logic (SM-2 due, weak-area detection, intensity tuning) is discarded for the simpler fraction-based approach.

### 1.5 `buildMissions()` in `DailyMissionPage.jsx` (lines ~241-293)

**Purpose**: Converts target counts into a sequential mission array for the UI stepper.

**Logic**: Creates one mission object per skill with non-zero target, in a fixed order: lesson → grammarLesson → grammar → vocabulary → flashcards → listening → reading → writing → speaking → remediation.

### 1.6 `getNextListening()`, `getNextReading()`, etc. in UI section (~lines 660-820)

**Purpose**: Select the actual item for each skill during UI rendering (not during plan generation).

**Logic**: Filters by completion status, curriculum unlock, topic preference, and revisit logic. Items are selected at render time, not at plan generation time.

---

## 2. Where Adaptive Targets Are Overwritten

The root cause is in `calculateDailyTargets()` lines ~121-170:

```js
const baseTargets = buildAdaptiveTargets(levelId, state, goal);  // LINE A
const dailyMinutes = Math.max(15, Number(goal?.dailyMinutes) || 30);
const plan = generatePlan(dailyMinutes, levelId, goal);           // LINE B

const targets = {
  ...baseTargets,         // ← spreads adaptive targets
  lesson: 0,              // ← immediately zeroes them out
  grammar: 0,
  flashcards: 0,
  reading: 0,
  listening: 0,
  writing: 0,
  estimatedMinutes: dailyMinutes,
};

for (const item of plan) {  // ← overwrites with generatePlan values
  ...
  if (item.skill in targets) {
    targets[item.skill] = item.count;
  }
}
```

**LINE A**: `buildAdaptiveTargets()` returns targets like `{ lesson: 1, grammar: 4, vocab: 6, reading: 0, estimatedMinutes: 15 }` for <30min

**LINE B**: `generatePlan()` returns `[{ skill: 'lesson', count: 1 }, { skill: 'grammar', count: 4 }, ...]`

**Overwrite**: The spread of `...baseTargets` is immediately overridden by explicit zeroes, then those zeroes are overwritten by `generatePlan` counts. The adaptive results are computed but discarded.

---

## 3. Data Sources Used

| Source | Used By | Purpose |
|--------|---------|---------|
| `dashboardSummary.json` | `generatePlan()`, `getNextWriting/Speaking` | Lesson lists, vocab IDs, summary counts |
| `germanLessons.json` | `buildMissions()`, `getLessonConceptIds()` | Lesson data, topic IDs |
| `grammarCurriculum.json` | `buildMissions()`, grammar selection | Grammar lesson metadata |
| `dataLoaders.js` (dynamic imports) | Grammar/vocab/reading/listening/writing/speaking data | Per-level content arrays |
| `getState()` (store.js) | All functions | User progress, mastery, mistakes |
| `practiceProgress_v1` (localStorage) | Item selection | Completed/not-due status |
| `teachBeforeTest.js` | Item selection | Unlocked items filtering |
| `StudyGoalTracker.js` | `getStudyGoal()` | Goal metadata (dailyMinutes, targetLevel) |

---

## 4. How dailyMinutes Affects Plan Size

**In `buildAdaptiveTargets()`**: Hard thresholds (15, 30, 60, 90, 120) map to different target arrays.

**In `generatePlan()`**: Proportional fraction-based calculation with floor rounding:
```js
const allocated = minutes * fraction;  // e.g., 30 * 0.25 = 7.5 min for lessons
const count = Math.max(1, Math.floor(allocated / MINS_PER_ITEM[skill]));
// e.g., lesson count = Math.max(1, Math.floor(7.5 / 8)) = 1
```

Since `generatePlan()` wins, the plan is determined by these fractions. This means:
- **15 min**: lesson=1, grammar=2, flashcard=6, reading=1, listening=1, writing=1
- **30 min**: lesson=1, grammar=4, flashcard=12, reading=1, listening=1, writing=1
- **60 min**: lesson=2, grammar=8, flashcard=24, reading=2, listening=2, writing=1

Compare with `buildAdaptiveTargets()` which has NO speaking/writing for <30min, but `generatePlan()` always includes them.

---

## 5. How currentLevel Is Selected

The `levelId` comes from the URL parameter in `useParams()`:
```js
const { levelId } = useParams();
const lvl = (levelId || '').toUpperCase();
```

This is passed as the first argument to `calculateDailyTargets(lvl, cs, goal)`. It's the user's *current* level, not the target level.

Note: `buildAdaptiveTargets()` receives `levelId` but uses it only for `dashboardSummary.vocabIds?.[levelId]` (flashcard due counts). The level-sensitive `buildAdaptiveTargets()` logic is minimal — the hard thresholds only depend on `dailyMinutes`.

---

## 6. How Completed/Failed/Due Items Are Filtered

Filtering happens at the item selection level (in `useEffect` hooks and `getNext*` functions), NOT at the plan generation level:

- **Grammar**: Filtered in the grammar `useEffect` (~line 400-465). Uses `getUnlockedItems()`, `practiceProgress_v1` completed/not-due sets, grammarMastery, and due review logic.
- **Vocabulary**: Filtered in the vocab `useEffect` (~line 470-510). Uses `getUnlockedItems()`, `practiceProgress_v1` completed/not-due sets.
- **Reading/Listening**: Filtered in `getNextReading/Listening()`. Uses `readingCompleted`/`listeningCompleted` arrays, `practiceProgress_v1` completed/not-due sets, curriculum unlock, revisit logic.
- **Writing/Speaking**: Filtered in `getNextWriting/Speaking()`. Uses `writingCompleted`/`speakingCompleted` arrays, `practiceProgress_v1` completed/not-due sets, `isWritingUnlocked`/`isSpeakingUnlocked`.

---

## 7. How Each Skill's Items Are Selected

### Flashcards
Uses SRS. Selected at render time via `getDueVocabWords()` from store.js. The count is derived from the target in `buildMissions()`.

### Grammar
Selected in a `useEffect`. Steps:
1. Get all grammar data
2. Get `practiceProgress_v1` done/not-due sets
3. Get unlocked items via `getUnlockedItems()` (teach-before-test)
4. Split into due-review vs unmastered
5. Priority: due review (capped 5) → topic-preferred → general pool
6. Save selected IDs to session

### Vocabulary
Selected in a separate `useEffect`. Steps:
1. Get all vocab data
2. Filter by completed/unlocked
3. Topic-grouped: today's lesson first → general review
4. Save selected IDs to session

### Reading/Listening
Selected at render time via `getNextReading()`/`getNextListening()`. Steps:
1. Filter completed + practiceProgress done/not-due
2. Curriculum unlock filter
3. Topic-grouped preference
4. Revisit logic (due incorrect first, old correct after 14+ days)

### Writing/Speaking
Selected at render time via `getNextWriting()`/`getNextSpeaking()`. Steps:
1. Filter completed + practiceProgress done/not-due
2. Writing/speaking unlock check
3. Topic-grouped preference
4. Returns first available

---

## 8. Root Cause of Override Behavior

**The root cause is in `calculateDailyTargets()`:**

```
buildAdaptiveTargets() → calculated but discarded
generatePlan() → wins for all skills
weak-area injection → applies on top of generatePlan values
active/passive weighting → applies on top of generatePlan values
```

This creates a system where two different plan engines compete, and the simpler one (fraction-based generatePlan) wins. The adaptive engine's SM-2 scheduling awareness, difficulty weighting, and intensity tiers are ignored.

---

## 9. Additional Structural Issues Identified

### 9.1 Plan generation is in the component, not in a utility

`generatePlan()`, `calculateDailyTargets()`, and `buildMissions()` are all defined as regular functions (not hooks) at module scope in `DailyMissionPage.jsx`. Item selection (`getNext*()`) uses component state (`sesh`, `listeningData`, etc.) so it can't easily be extracted.

### 9.2 Item selection is spread across the component

Grammar and vocabulary are selected in `useEffect` hooks. Reading/listening/writing/speaking are selected at render time via inline functions. The session stores selected IDs for grammar/vocab but not for other skills.

### 9.3 Plan is recalculated on every data load

The `useEffect` dependency array includes `[lvl, dataLoading, dataError]` — any level change or data reload triggers a full plan recalculation.

### 9.4 `estimateMinutes` in `buildAdaptiveTargets` is hardcoded

`estimatedMinutes` is set to `15`, `30`, `60`, `90`, `120` — these are the *minutes bucket*, not the actual time estimate. The real `dailyMinutes` from the goal is stored separately.

---

## 10. Exact Fix Plan

### 10.1 Create `src/utils/buildDailyPlan.js`

A new utility that provides ONE source of truth for plan generation:

```js
export function buildDailyPlan(levelId, state, goal) { ... }
```

This replaces both `buildAdaptiveTargets()` and `generatePlan()` with a unified function. It returns a structured object:

```js
{
  level: 'A1',
  dailyMinutes: 30,
  targets: {
    grammar: { count: 6, reason: 'standard' },
    vocabulary: { count: 10, reason: 'standard' },
    flashcards: { count: 10, reason: 'due_items' },
    reading: { count: 1, reason: 'standard' },
    listening: { count: 0, reason: 'no_room' },
    writing: { count: 0, reason: 'no_room' },
    speaking: { count: 0, reason: 'no_room' },
  },
  estimatedMinutes: 30,
  generatedAt: '2026-05-11',
}
```

### 10.2 Merge the two plan engines

The new function takes the best of both:
- **From `buildAdaptiveTargets()`**: Minutes buckets with reasonable skill distributions, SM-2/weak-area awareness
- **From `generatePlan()`**: Fraction-based time allocation to make plan size proportional to dailyMinutes
- **From `calculateDailyTargets()`**: Weak-area injection and active/passive weighting

### 10.3 Remove duplicate logic from `DailyMissionPage.jsx`

1. Remove `TIME_BUDGET` constant
2. Remove `MINS_PER_ITEM` constant
3. Remove `generatePlan()` function
4. Replace `calculateDailyTargets()` with `buildDailyPlan()`
5. Update `buildMissions()` to read from structured plan output

### 10.4 Keep item selection logic unchanged

The `getNext*()`, grammar `useEffect`, and vocab `useEffect` functions remain in the component as they are. They select items after the plan structure is determined. This separation of concerns is correct.

### 10.5 Update `adaptivePlan.js`

Keep `buildAdaptiveTargets()` for backward compatibility (it's used by other parts of the app like `getGoalEstimate()`). Add an `isNewPlanUsed` export or simply replace the usage.

### 10.6 Tests

Add tests in `tests/adaptive-plan-v2.test.js` (the existing test file from Phase 32):
- dailyMinutes 15 → small plan (≤3 skills)
- dailyMinutes 30 → moderate plan (4-6 skills including reading)
- dailyMinutes 60 → broad plan (6+ skills including writing/speaking)
- No overwrite: plan output is self-consistent (not computed twice)
- A1 level → no B2 items in plan structure
- Estimated minutes ≤ dailyMinutes * 1.5 (reasonable ceiling)

---

## 11. Risk Assessment

| Change | Risk | Mitigation |
|--------|------|------------|
| Remove `generatePlan()` | LOW | Function is only called by `calculateDailyTargets()` |
| Replace `calculateDailyTargets()` | LOW | Component only uses it in one `useEffect` |
| New utility file | LOW | No existing tests will break |
| Remove `TIME_BUDGET`/`MINS_PER_ITEM` | LOW | These are dead code once `generatePlan()` is removed |
| Keep item selection hooks unchanged | NONE | No modification planned |

All 366 existing tests should pass unchanged. New tests will validate the consolidated logic.
