# B1 Curriculum Quality Audit

**Date:** 2026-05-08
**Scope:** All B1 data in the Deutsch Klinik curriculum

---

## Summary

The B1 curriculum contains the same lesson/question count as A1/A2 but is missing critical metadata fields that were added during Phases 3 and 4 for A1/A2. This audit documents every gap.

---

## 1. Lessons (25 total)

### Current State

Each B1 lesson has:
- `level`, `unit`, `id`, `title`, `objective`, `explanation`
- `examples` (9 items)
- `vocabulary`, `grammarFocus`, `guidedPractice`, `independentPractice`
- `listeningTask`, `readingTask`, `speakingTask`, `writingTask`, `reviewSummary`

### Missing Fields (25/25 lessons)

| Field | Status |
|---|---|
| `conceptId` | ALL missing |
| `estimatedMinutes` | ALL missing |
| `prerequisiteConceptIds` | ALL missing |
| `conceptsTaught` | ALL missing |
| `commonMistakes` | ALL missing |
| `formsTable` | ALL missing |
| `miniDrills` | ALL missing |
| `linkedQuestionIds` | ALL missing |
| `trackTags` | ALL missing |
| `lessonDepthVersion` | ALL missing |
| `examples` limited to 9 | Needs expansion to 10-12 |

---

## 2. Grammar Questions (242 total)

### Current State

Each grammar question has: `id`, `level`, `topic`, `type`, `prompt`, `options`, `answer`, `explanation`, `lessonId`, `taughtInLessonId`

### Missing Fields

| Issue | Count |
|---|---|
| Missing `taughtInLessonId` | 123/242 |
| Missing `options` | 29/242 |
| Missing `difficulty` | 242/242 |
| Missing `skillType` | 242/242 |

### Lessons Already Assigned (119 items)

119 grammar questions already have `taughtInLessonId` pointing to B1 lessons. The remaining 123 need assignment.

---

## 3. Reading Items (60 total)

### Current State

Each reading item has: `id`, `title`, `text`, `questions`, `level`, `lessonId`

### Missing Fields

| Field | Status |
|---|---|
| `conceptId` | ALL missing (60/60) |
| `taughtInLessonId` | ALL missing (60/60) |
| `requiredConcepts` | ALL missing (60/60) |

### Individual Questions

- 3 reading items have questions missing `explanation` field (B1_read_1: qr15, qr17; B1_read_2: qr18, qr20; B1_read_3: qr22)

---

## 4. Listening Items (60 total)

### Current State

Each listening item has: `id`, `title`, `script`, `questions`, `lessonId`, `audio`

### Missing Fields

| Field | Status |
|---|---|
| `conceptId` | ALL missing (60/60) |
| `taughtInLessonId` | ALL missing (60/60) |
| `requiredConcepts` | ALL missing (60/60) |

---

## 5. Writing Items (50 total)

### Current State

Each writing item has: `id`, `title`, `prompt`, `instructions`, `wordLimit`, `tips`, `lessonId`
No `prepTime` field exists for B1 writing items.

### Missing Fields

| Field | Status |
|---|---|
| `conceptId` | ALL missing (50/50) |
| `taughtInLessonId` | ALL missing (50/50) |
| `requiredConcepts` | ALL missing (50/50) |
| `rubric` | ALL missing (50/50) |
| `usefulPhrases` | ALL missing (50/50) |

---

## 6. Speaking Items (50 total)

### Current State

Each speaking item has: `id`, `title`, `prompt`, `instructions`, `prepTime`, `talkTime`, `tips`, `usefulPhrases`, `level`, `lessonId`

### Missing Fields

| Field | Status |
|---|---|
| `conceptId` | ALL missing (50/50) |
| `taughtInLessonId` | ALL missing (50/50) |
| `requiredConcepts` | ALL missing (50/50) |
| `rubric` | ALL missing (50/50) |

---

## 7. Vocabulary Items (1062 total)

### Current State

Each vocabulary item has: `id`, `level`, `word`, `translation`, `article`, `plural`, `example`, `exampleTranslation`, `tags`, `lessonId`, `partOfSpeech`, `topic`

### Missing Fields

| Issue | Count |
|---|---|
| Nouns missing `plural` | 61 |
| Items missing `taughtInLessonId` | 1000 (only have `lessonId`) |

**Note:** The `taughtInLessonId` field does not exist on any vocabulary item — only `lessonId` is present. This is the same pattern as A1/A2 vocab.

---

## 8. Curriculum Map (288 B1 units)

### Current State

The curriculum map has B1 lesson units with basic data but:
- All 25 B1 lesson units have empty `requiredConcepts: []`
- 1 B1 lesson unit has empty `requiredLessons: []`
- `taughtConcepts` uses placeholder values (`"b1_lesson_1"`, etc.) instead of meaningful conceptIds

---

## 9. Summary

| Category | Total Items | Items Needing Enrichment | Enrichment % Needed |
|---|---|---|---|
| Lessons | 25 | 25 (all fields) | 100% |
| Grammar | 242 | 123+242 | 51%+100% |
| Reading | 60 | 60+ | 100%+ |
| Listening | 60 | 60 | 100% |
| Writing | 50 | 50 | 100% |
| Speaking | 50 | 50 | 100% |
| Vocabulary | 1062 | 61-1000 | 6%-94% |
| Curriculum Map | 288 | 25+ | 9%+ |

**Overall Assessment:** B1 data has the structural foundation (lessons, questions, vocabulary) but lacks the metadata layer (conceptId, taughtInLessonId, rubric, etc.) that was added to A1/A2 during Phases 3 and 4.
