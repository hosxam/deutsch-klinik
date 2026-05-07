# Teach-Before-Test Engine

## Purpose

Prevents the app from testing learners on content that has not been explicitly taught. Every question, exercise, reading passage, listening task, writing prompt, and speaking prompt is filtered against the user's completed curriculum to ensure the learner has the prerequisite knowledge before being assessed.

## How It Works

The engine sits between the data layer (JSON files) and the UI layer (DailyMissionPage). It reads:

1. **`curriculumMap.json`** — the official curriculum structure
2. **`getState()` from store.js** — the user's actual progress

It returns **only** the items the user is ready for.

## Key Functions

### `getCompletedConcepts(userProgress, level)`

Returns a `Set<string>` of concept IDs the user has fully completed at the given level.

**Logic**: For each curriculum unit matching `level`, if all `linkedLessonIds` are found in `completedLessons[level]`, the unit's `conceptId` is considered completed.

### `getUnlockedUnits(userProgress, level)`

Returns an array of curriculum units that are unlocked (all prerequisites met).

**Logic**: For each unit at the level:
- All `requiredLessons` must be in `completedLessons[level]`.
- All `requiredConcepts` must be in the completed concepts set.

### `isQuestionUnlocked(questionId, userProgress)`

Returns whether a specific question ID is unlocked.

**Logic**: Looks up the question ID in `curriculumMap.units[].linkedQuestionIds`. If found, checks the unit's prerequisites. If not found (no metadata), returns `true` (compatibility mode).

### `isReadingUnlocked(readingId, userProgress)`, `isListeningUnlocked`, `isWritingUnlocked`, `isSpeakingUnlocked`

Same pattern — checks if the item's curriculum unit has its prerequisites met. Falls back to `true` if no metadata exists.

### `getNextRecommendedUnit(userProgress, goalSettings, maxUnits)`

Recommends the next units to study. Scans from A1 up to the user's target level, finding incomplete but unlocked units. Prioritizes by level progression.

### `validateDailySessionPrerequisites(session, userProgress, level)`

Audits an existing session object for teach-before-test violations. Returns an array of issues found.

## Integration with DailyMissionPage

In `DailyMissionPage.jsx`, two key guards were updated:

**Grammar filter (was):**
```js
const taggedPool = lvl === 'A1' && !context.isFreePractice
  ? all.filter((x) => context.allowedLessonIds.has(getQuestionLessonId(x)))
  : all;
```

**Grammar filter (now):**
```js
let unlockedPool;
if (hasCurriculumMap(lvl) && !context.isFreePractice) {
  unlockedPool = getUnlockedItems(all, lvl, state, context);
} else if (!context.isFreePractice) {
  unlockedPool = all.filter((x) => context.allowedLessonIds.has(getQuestionLessonId(x)));
} else {
  unlockedPool = all;
}
```

**Vocabulary filter (was):**
```js
const introduced = lvl === 'A1' && !context.isFreePractice
  ? all.filter((x) => context.allowedLessonIds.has(getWordLessonId(x)))
  : all;
```

**Vocabulary filter (now):**
```js
if (hasCurriculumMap(lvl) && !context.isFreePractice) {
  introduced = getUnlockedItems(all, lvl, state, context);
} else if (!context.isFreePractice) {
  introduced = all.filter((x) => context.allowedLessonIds.has(getWordLessonId(x)));
} else {
  introduced = all;
}
```

## Fallback Behavior

The engine uses a **safe fallback** pattern:

1. If `hasCurriculumMap(level)` returns `true` (pilot data exists for this level), use strict curriculum filtering.
2. If the curriculum map doesn't have data for the level, use the old allowed-lesson-IDs filter (backwards compatible).
3. If the context says `isFreePractice`, show everything (user explicitly chose free practice).

## Metadata Handling

For items **without** curriculum metadata (no entry in `curriculumMap.units`), the engine takes different approaches:

- **Grammar/vocab**: Filtered only by the legacy `allowedLessonIds` set — items must come from a completed lesson.
- **Reading/listening/writing/speaking**: Filtered by curriculum unlock when `hasCurriculumMap(level)` is true. Falls back to sequential next-incomplete for levels without curriculum data.

This means items without metadata are **not deleted** — they just fall back to the old behavior.

## Reading/Listening/Writing/Speaking Filtering (Phase 2)

In `DailyMissionPage.jsx`, the four `getNext*` functions now apply curriculum filtering:

```js
const getNextReading = (level) => {
  let items = (readingData[level] || []).filter(item => !completed.has(item.id));
  if (hasCurriculumMap(level)) {
    items = items.filter(item => isReadingUnlocked(item.id, s));
  }
  // ... sort by difficulty, return first
};
```

Same pattern applies to `getNextListening`, `getNextWriting`, `getNextSpeaking`. When the curriculum map exists for a level, only items whose prerequisite lessons have been completed are shown. Otherwise, the original sequential behavior is preserved.

## Adding New Content Safely

### Step-by-step for a new grammar exercise:

1. Add to `grammar.json` with fields: `id`, `level`, `topic`, `prompt`, `answer`, `taughtInLessonId`, `conceptId`, `prerequisiteConceptIds`
2. Ensure `taughtInLessonId` matches a valid `A1_lesson_N` ID.
3. Run `npm run build-pilot-curriculum` (for A1) or manually add a unit to `curriculumMap.json`.
4. Run `npm run validate-curriculum`.
5. Run `npm run validate-teach-before-test`.
6. Run `npm run build`.

If any step fails, the content will be excluded from curriculum-driven practice until the issue is fixed.

## Validators

Two validators enforce teach-before-test integrity:

### `validate-curriculum-map.cjs`

- Checks missing/duplicate IDs
- Validates levels and skill names
- Checks `requiredLessons` references are valid
- Checks `linkedQuestionIds` are valid identifiers
- Detects orphan units
- Validates prerequisite graph structure

### `validate-teach-before-test.cjs`

- Cross-references all `linkedLessonIds` against `germanLessons.json`
- Cross-references `linkedQuestionIds` against actual data items
- Reports reading/listening items with `lessonId` not covered by any curriculum unit
- Reports A1 grammar/vocab items not covered by any curriculum unit
- Detects circular prerequisite chains (deadlock detection)

## State Compatibility

The engine does NOT change the localStorage schema. It reads the same state store that the app has always used:

- `completedLessons[level]` for lesson completion
- `levels[level].grammar` for grammar progress
- `levels[level].vocab` for vocabulary progress
- `listeningCompleted[level]` for listening progress
- `readingCompleted[level]` for reading progress
- `writings[]` for writing attempts
- `speakingRecordings[level]` for speaking attempts

No migration or data reset is needed.
