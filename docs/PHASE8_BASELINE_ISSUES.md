# Phase 8 Baseline Issues

## 1. Curriculum Map (57 Warnings)

**Source:** `scripts/validate-curriculum-map.cjs`
**File:** `src/data/curriculumMap.json`

All 57 warnings are B2 concepts referencing B1 prerequisite concepts that don't exist in the curriculum map's concepts list.

| Issue Count | Type | Detail | Safe to Fix? |
|---|---|---|---|
| 57 | warning | B2->B1 preref concept not found in map | Yes |

The referenced B1 conceptIds (e.g. `b1.passiv.praesens`, `b1.konjunktiv2.general`, etc.) exist in the B1 grammar data but were never added to the curriculum map. Each one needs to be added as a new concept entry.

## 2. Vocabulary Lesson ID Mismatches (1115 Items)

**Source:** `scripts/validate-curriculum-dependencies.cjs`
**File:** `src/data/germanVocabulary.json`

| Level | Count | Issue |
|---|---|---|
| B1 | 371 | Reference non-existent lesson IDs |
| B2 | 451 | Reference non-existent lesson IDs |
| C1 | 293 | Reference non-existent lesson IDs |

The lesson IDs these vocab items reference are either:
- `B1_lesson_26`-`B1_lesson_30` (5 extra IDs not in db)
- `B2_lesson_26`-`B2_lesson_30` (5 extra IDs not in db)
- `C1_lesson_26`-`C1_lesson_30` (5 extra IDs not in db)
- Various `_general` lesson IDs (common prefix)

These need to be mapped to the nearest real lesson by topic.

## 3. Missing Level Fields

**Source:** `scripts/validate-curriculum-dependencies.cjs`
**Files:** `src/data/reading.json`, `src/data/listening.json`

| Issue Count | File | Issue |
|---|---|---|
| 53 | `reading.json` | Items missing 'level' field |
| 110 | `listening.json` | Items missing 'level' field |

Items are in B1, B2, C1 groups but missing the top-level `level` property. The level can be inferred from their parent key in the JSON file.

## 4. Orthography Issues (300)

**Source:** `scripts/validate-german-orthography.cjs`
**Files:** 21 files affected (216 in germanLessons.json, 42 in grammar.json, 10 in speaking.json, 21 in writing.json, 5 in listening+reading, 6 in germanVocabulary.json, 6+ in others)

### Categories:

| Category | Count | Examples |
|---|---|---|
| `missing-umlaut` | ~30 | "fur" -> "für", "uber" -> "über" (in germanLessons.json) |
| `suspicious-word` | ~270 | ae/oe/ue transliterations, English words, typos |
| `should-be-heisst` | 3 | "heisst" -> "heißt" in grammar.json |

Most suspicious-word hits are valid conceptId identifiers (ae/oe/ue) which should be skipped. The actionable fixes are:
- `missing-umlaut` in germanLessons.json (fur/uber -> für/über) - about 30 instances
- `should-be-heisst` in grammar.json (3 instances)
- A few suspicious-word hits in user-facing text (German text with ae/oe/ue transliteration)

## 5. Lint (6 Issues)

| Type | Count | File | Issue |
|---|---|---|---|
| Error | 3 | `DailyMissionPage.jsx` | Cannot access refs during render (React 19) |
| Warning | 2 | `StudyGoalTracker.jsx` | unused var, unnecessary dep |
| Warning | 1 | `curriculumProgress.js` | unused var |

The 3 errors are React 19 mode strict checks. The warnings are pre-existing.

## 6. Playwright Tests

5 test files, ~92 tests total. No tests specifically cover:
- App load / dashboard load
- Daily mission for all levels
- Flashcards / mistakes pages
- Exam route guard

Need to add practical regression tests.
