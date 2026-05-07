# Curriculum Architecture

## Overview

The curriculum architecture transforms the deutsch-klinik site from a flat practice-data app into a structured, curriculum-driven learning platform. Every piece of content (lesson, grammar exercise, vocabulary item, reading, listening, writing, speaking) is mapped to a **curriculum unit** with explicit prerequisites and unlock rules.

## Schema

### `src/data/curriculumMap.json`

The central curriculum map. Contains three top-level arrays:

#### `units[]`

Every teachable/assessable item in the system. Each unit has:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier, e.g. `A1_vocab_unit_3` |
| `level` | string | yes | CEFR level: `A1`, `A2`, `B1`, `B2`, `C1`, `FSP` |
| `skill` | string | yes | `lesson`, `vocabulary`, `grammar`, `reading`, `listening`, `writing`, `speaking` |
| `title` | string | yes | Human-readable title |
| `topic` | string | yes | Topic tag for grouping/filtering |
| `estimatedMinutes` | number | yes | Expected study time |
| `conceptId` | string | no | Reference to a concept in the `concepts[]` array |
| `taughtConcepts` | string[] | no | Concepts this unit teaches when completed |
| `requiredConcepts` | string[] | no | Concepts required before accessing this unit |
| `requiredLessons` | string[] | no | Lesson IDs that must be completed first |
| `linkedLessonIds` | string[] | yes | IDs of lessons linked to this unit |
| `linkedQuestionIds` | string[] | no | IDs of questions/exercises linked to this unit |
| `order` | number | no | Display/study order within the level (lower = earlier) |
| `tags` | string[] | no | Categorization tags |

#### `concepts[]`

Master list of all teachable concepts. A concept is a unit of knowledge.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique concept identifier |
| `level` | string | yes | CEFR level |
| `skill` | string | yes | Primary skill area |
| `label` | string | yes | Human-readable label |
| `description` | string | no | What this concept covers |
| `taughtIn` | string[] | no | IDs of items/units where this concept is taught |
| `prerequisites` | string[] | no | Concept IDs that must be completed first |

#### `prerequisiteGraph[]`

Explicit edges for complex dependency chains. Optional.

| Field | Type | Description |
|-------|------|-------------|
| `conceptId` | string | The concept |
| `requires` | string[] | Concepts it depends on |
| `blocks` | string[] | Concepts that depend on it |

## How Units Unlock

A unit is **unlocked** when all its prerequisites are met:

1. **Required lessons**: Every lesson in `requiredLessons` must be in the user's `completedLessons` for that level.
2. **Required concepts**: Every concept in `requiredConcepts` must be in the user's completed concepts set.

The completed concepts set is computed from `getCompletedConcepts()`, which checks:

- For each unit at the user's level, if all its `linkedLessonIds` are completed, its `conceptId` is added to the completed set.
- Lesson units check `completedLessons[level]`.
- Grammar units check `levels[level].grammar`.
- Vocabulary units check `levels[level].vocab`.
- Reading/listening/writing/speaking check their respective progress arrays.

## How Daily Practice Selects Content

The daily practice flow:

1. **Check level**: If the user is in A1 and curriculum map exists for A1, use curriculum-driven filtering.
2. For **grammar**: Filter all grammar items to only those whose `taughtInLessonId` or `lessonId` maps to a completed lesson. If curriculum metadata is missing, fall back to showing everything (compatible mode).
3. For **vocabulary**: Same as grammar — only items whose lesson is completed.
4. For **reading/listening**: Sequential next-incomplete selection. These have `lessonId` which links them to a lesson, but the curriculum engine currently uses the sequential approach for these.
5. For **writing/speaking**: Same sequential approach as reading/listening.

## How to Add New Content (A1-C1/FSP)

### Adding a new lesson

1. Add the lesson to `germanLessons.json` with its A1-C1 lesson ID format.
2. Re-run the pilot curriculum builder: `npm run build-pilot-curriculum`
3. This auto-generates the unit and concept entries in `curriculumMap.json`.
4. Run validation: `npm run validate-curriculum && npm run validate-teach-before-test`

### Adding new vocabulary

1. Add items to `germanVocabulary.json` with `lessonId` and `taughtInLessonId`.
2. Re-run the pilot builder or add a unit manually to `curriculumMap.json` units.
3. Make sure `linkedQuestionIds` includes the new vocab item IDs.

### Adding new grammar exercises

1. Add items to `grammar.json` with `lessonId`, `taughtInLessonId`, `conceptId`, and `prerequisiteConceptIds`.
2. The pilot builder groups grammar items by lesson automatically.
3. For items outside A1, add a unit manually with appropriate `requiredLessons`.

### Adding reading/listening/writing/speaking

1. Add to the respective data file with a valid `lessonId`.
2. Ensure the `lessonId` matches a lesson in `germanLessons.json`.
3. The curriculum map validator will check that all referenced lessons exist.

## How Validators Protect Against Random Questions

Three validation layers ensure content safety:

1. **`validate-curriculum-map.cjs`**: Checks structural integrity — missing IDs, duplicate IDs, invalid levels/skills, broken references, orphan units.
2. **`validate-teach-before-test.cjs`**: Cross-references data files against the curriculum map, reports items not covered by any unit, and detects circular prerequisite chains.
3. **`npm run build`**: Vite build catches any JS import/export issues or syntax errors.

If any validator reports errors, `process.exit(1)` is called, which blocks CI/CD and prevents deployment.

## File Locations

| File | Purpose |
|------|---------|
| `src/data/curriculumMap.json` | Central curriculum map with units, concepts, and prerequisite graph |
| `src/utils/curriculumProgress.js` | Engine: reads curriculum map + user progress, computes unlocks, validates sessions |
| `src/utils/teachBeforeTest.js` | High-level API wrapping curriculumProgress for DailyMissionPage |
| `scripts/build-pilot-curriculum.cjs` | One-time script: auto-generates A1 pilot slice from existing data |
| `scripts/validate-curriculum-map.cjs` | Validates curriculum map structural integrity |
| `scripts/validate-teach-before-test.cjs` | Cross-references data files against curriculum map |
