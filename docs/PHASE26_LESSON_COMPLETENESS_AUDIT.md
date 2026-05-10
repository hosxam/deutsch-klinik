# Phase 26: Lesson Completeness Audit

**Date:** 2026-05-10
**Scope:** A1, A2, B1, B2, C1, FSP
**Base:** commit 4d5d6294 (Phase 25C)

## 1. Lesson Count & Structure

| Level | Lessons | Avg Explanation (chars) | Short <200 chars | Has miniDrills | Has linkedQuestionIds |
|-------|---------|------------------------|------------------|----------------|----------------------|
| A1    | 25      | 406                    | 0 of 25          | 17 of 25       | 1 of 25              |
| A2    | 25      | 268                    | 1 of 25          | 25 of 25       | 25 of 25             |
| B1    | 25      | 341                    | 2 of 25          | 25 of 25       | 25 of 25             |
| B2    | 25      | 176                    | 14 of 25         | 25 of 25       | 23 of 25             |
| C1    | 25      | 286                    | 0 of 25          | 25 of 25       | 13 of 25             |
| FSP   | 40      | 195 (explanation)      | 40 of 40         | 40 of 40       | 0 of 40              |

**Total lessons:** 165

### 1.1 A1 Notes
- 8 of 25 lessons missing miniDrills (lessons 18-25 — practical scenario lessons)
- 24 of 25 lessons have no `linkedQuestionIds` directly on the lesson object (practice links live on the curriculum map units instead)
- 25 of 25 have pronunciation notes
- All have examples, formsTable, commonMistakes

### 1.2 A2 Notes
- Mostly solid. 1 short explanation (A2_lesson_8: "Arbeit und Arbeitsplatz", 179 chars)
- No pronunciation notes (0 of 25)

### 1.3 B1 Notes
- 2 short explanations (B1_lesson_2: 176 chars, B1_lesson_4: 198 chars)
- No pronunciation notes (0 of 25)

### 1.4 B2 Notes — CRITICAL GAP
- **14 of 25 lessons have explanations under 200 chars** — these are essentially vocabulary lists, not proper lessons
- No pronunciation notes (0 of 25)
- 2 lessons missing linkedQuestionIds (B2_lesson_2, B2_lesson_11)
- Shortest: B2_lesson_7 at 97 chars ("Wissenschaftliche Ethik")

### 1.5 C1 Notes
- Explanations are good length (avg 286 chars)
- 12 of 25 lessons missing linkedQuestionIds (lecture-style advanced topics)
- No pronunciation notes (0 of 25)

### 1.6 FSP Notes — CRITICAL GAP
- No examples section in any lesson (0 of 40)
- No linkedQuestionIds in any lesson (0 of 40)
- Explanations avg ~195 chars — functional but very thin for medical exam prep
- Summary field even shorter (avg 76 chars)
- No pronunciation notes (0 of 40)
- No phraseTable (medical communication phrases exist under `medicalCommunicationPhrases` but not rendered in teaching)

## 2. Pronunciation Notes Coverage

| Level | Has pronunciationNotes |
|-------|----------------------|
| A1    | 25 of 25 ✅          |
| A2    | 0 of 25 ❌           |
| B1    | 0 of 25 ❌           |
| B2    | 0 of 25 ❌           |
| C1    | 0 of 25 ❌           |
| FSP   | 0 of 40 ❌           |

Pronunciation notes exist in `pronunciationGuides.json` (51KB) but are not linked from A2-C1 or FSP lessons.

## 3. Curriculum Map Issues

### 3.1 Validator Errors (pre-existing)
- **10 errors:** FSP case units use `skill: "case"` which is not in the valid skill list (`lesson, vocabulary, grammar, reading, listening, writing, speaking`)
- **202 errors:** `validate-teach-before-test` reports FSP lessons not found in `germanLessons.json` because the validator doesn't load `fspLessons.json`
- **5 warnings:** A1 grammar question IDs (A1_gr_176, A1_gr_211, A1_gr_158, A1_gr_424, A1_gr_414) referenced in curriculum map but not found in grammar data

### 3.2 Concepts Not Taught by Any Unit
- **37 concepts** exist in the curriculum map with neither `taughtIn` field nor appearing in any unit's `taughtConcepts`
  - 12 B1 grammar sub-concepts (pronominal adverbs, Konjunktiv II general, connector types, relative clause subtypes, etc.)
  - 25 B2 concepts — both grammar (passive voice types, prepositional verbs, nominalization, etc.) and topic-level concepts (globalization, ethics, sustainability, etc.)

### 3.3 A1 Curriculum Coverage
- 5 A1 lesson/topic concept IDs on curriculum units are not found in the concepts array (a1_vocab_medical_basics, a1_vocab_questions_answers, a1_vocab_days, etc.) — these are vocab topic tags, not errors
- 86 vocabulary entries have concept IDs not in curriculum concepts (all A1 thematic tags)

## 4. Vocabulary Lesson Links

| Level | Total Vocab | Has taughtInLessonId | Has conceptId | Neither |
|-------|------------|---------------------|---------------|---------|
| A1    | 803        | 803                 | 700+          | 0       |
| A2    | 501        | 501                 | 500           | 0       |
| B1    | 1,062      | 1,062               | 1,061         | 0       |
| B2    | 1,088      | 1,071               | 1,088         | 17      |
| C1    | 1,206      | 1,169               | 1,206         | 37      |

**54 vocabulary entries** (B2: 17, C1: 37) from Phase 25C addition lack `taughtInLessonId`. They do have `conceptId` which links them via the curriculum map.

## 5. Writing/Speaking Prompts

- **263 reading, 260 listening, 250 writing, 270 speaking items** — all have `lessonId` linking to a lesson
- **None have `requiredConceptIds` or `prerequisiteConceptIds`** — gating is by lesson completion only, not fine-grained concept prerequisites
- **Writing/speaking items have `taughtInLessonId`** which may differ from the practice lessonId
- All appear correctly linked to existing lessons

## 6. Reading/Listening Coverage

- All reading/listening items have `conceptId` and `lessonId`
- 263 reading, 260 listening items across A1-C1 — comprehensive coverage
- FSP has 100 reading, 100 listening, 140 writing, 50 speaking items — all with concept IDs

## 7. Grammar Coverage

| Level | Grammar Items | Grammar Curriculum Lessons | All have taughtInLessonId |
|-------|-------------|---------------------------|--------------------------|
| A1    | 406         | 21                        | 406 ✅                  |
| A2    | 247         | 21                        | 247 ✅                  |
| B1    | 242         | 20                        | 242 ✅                  |
| B2    | 246         | 20                        | 246 ✅                  |
| C1    | 304         | 20                        | 304 ✅                  |

All grammar items (1,445 total) have valid `taughtInLessonId`. Grammar curriculum lessons exist at 20-21 per level. No gaps.

## 8. Summary of Critical Gaps

### Tier 1 — Breaks Teach-Before-Test
1. None found — all practice items have valid `lessonId`/`taughtInLessonId` pointing to existing lessons
2. Linked question IDs in curriculum map for FSP lessons are empty (0 of 40) — practice is unlinked from teaching

### Tier 2 — B2/C1 Grammar Explanations Too Thin
3. **14 of 25 B2 lessons** have explanations under 200 chars (avg 135 chars)
4. Most of these are vocabulary dumps, not structured grammar/skill teaching

### Tier 3 — FSP Lessons Too Thin
5. **0 of 40 FSP lessons** have examples
6. **0 of 40 FSP lessons** have linkedQuestionIds
7. **All 40 FSP lessons** have minimal explanations (avg 195 chars)
8. FSP case/speaking/writing tasks have no prerequisite lesson links (conceptId only)

### Tier 4 — Writing/Speaking Phrase Support
9. Speaking/writing items have `usefulPhrases` but lessons don't link to them via phrase tables
10. FSP lessons missing phraseTable rendering

### Tier 5 — Pronunciation Gaps
11. **A2-C1 (100 lessons) have zero pronunciation notes**
12. FSP (40 lessons) has zero pronunciation notes
13. pronunciationGuides.json exists (51KB) with data, but lessons don't reference it

## 9. Pre-existing Validator Issues

- `validate-curriculum` fails: FSP case units use `skill: "case"` (10 units)
- `validate-teach-before-test` fails: FSP lesson IDs not found in germanLessons.json (doesn't load fspLessons.json)
- 5 A1 grammar question IDs referenced by curriculum map but missing from data
