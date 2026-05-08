# B1 Target Curriculum Standards

**Date:** 2026-05-08
**Reference:** A1/A2 Phase 3/4 enrichment standards

---

## 1. Lesson Standards

Every B1 lesson MUST have:

### Required Fields

| Field | Type | Description |
|---|---|---|
| `conceptId` | string | Unique concept identifier (e.g., `b1.opinion.media`) |
| `estimatedMinutes` | number | Duration in minutes (40-55 for B1) |
| `prerequisiteConceptIds` | string[] | A2 or earlier B1 concept IDs needed before this lesson |
| `conceptsTaught` | string[] | B1 concept IDs this lesson introduces |
| `commonMistakes` | array | 4-6 common learner mistakes with corrections |
| `formsTable` | array | 1-2 language tables with form/use/example |
| `miniDrills` | array | 4-6 fill-in-the-blank drills with answers |
| `linkedQuestionIds` | string[] | 3-7 B1 grammar question IDs matching topic |
| `trackTags` | string[] | Tags like `["goethe","telc","opinion","media"]` |
| `lessonDepthVersion` | string | Always `"2.0"` |
| `examples` | array | 10-12 items (expanded from current 9) |

### CommonMistakes Format

```json
[
  "String describing the mistake and correct form",
  "Another mistake with correction"
]
```

### FormsTable Format

```json
[
  { "form": "grammar form", "use": "usage description", "example": "example sentence" },
  { "form": "another form", "use": "usage description", "example": "example sentence" }
]
```

### MiniDrills Format

```json
[
  { "question": "Fill in: Er ___ (haben) ein Auto.", "answer": "hat" },
  { "question": "Fill in: Wir ___ (sein) im Kino.", "answer": "sind" }
]
```

---

## 2. Grammar Question Standards

Every B1 grammar question MUST have:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier (e.g., `B1_gr_1`) |
| `level` | string | `"B1"` |
| `topic` | string | Grammar topic (e.g., `"Nebensätze mit dass"`) |
| `type` | string | Question type (e.g., `"mcq"`, `"fill-blank"`) |
| `prompt` | string | Question text |
| `options` | array | Answer choices (for MCQ) |
| `answer` | string | Correct answer |
| `explanation` | string | Explanation of the correct answer |
| `lessonId` | string | Associated lesson ID |
| `taughtInLessonId` | string | Lesson where this concept is taught |
| `difficulty` | string | `"easy"`, `"medium"`, or `"hard"` |
| `skillType` | string | Always `"grammar"` |

---

## 3. Reading/Listening Standards

Every B1 reading/listening item MUST have:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `title` | string | Title/headline |
| `text`/`script` | string | Content text |
| `questions` | array | Array of question objects |
| `conceptId` | string | Concept identifier |
| `taughtInLessonId` | string | Lesson where taught |
| `requiredConcepts` | string[] | Prerequisite concept IDs |

### Question Object Standards

Each question in the `questions` array MUST have:

| Field | Type |
|---|---|
| `id` | string |
| `type` | string |
| `question` | string |
| `options` | array |
| `answer` | string |
| `explanation` | string (MUST NOT be missing) |

---

## 4. Writing Standards

Every B1 writing item MUST have:

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier |
| `title` | string | Writing task title |
| `prompt` | string | Task prompt |
| `instructions` | string | Step-by-step instructions |
| `wordLimit` | number | Maximum word count |
| `tips` | array | Helpful tips |
| `conceptId` | string | Concept identifier |
| `taughtInLessonId` | string | Lesson where taught |
| `requiredConcepts` | string[] | Prerequisite concept IDs |
| `usefulPhrases` | array | Two German phrases with translations |
| `rubric` | array | 4 criteria (structure, content, language, task-completion) |

### Rubric Format

```json
[
  { "criterion": "Structure", "description": "Logical organization and coherence", "points": 5 },
  { "criterion": "Content", "description": "Relevance and depth of ideas", "points": 5 },
  { "criterion": "Language", "description": "Grammar, vocabulary, and accuracy", "points": 5 },
  { "criterion": "Task Completion", "description": "All parts of the task addressed", "points": 5 }
]
```

### UsefulPhrases Format

```json
[
  { "german": "German phrase", "english": "English translation" },
  { "german": "Another phrase", "english": "Another translation" }
]
```

---

## 5. Speaking Standards

Same as writing standards above, PLUS existing fields preserved: `prepTime`, `talkTime`, existing `usefulPhrases` (converted to object format).

---

## 6. Vocabulary Standards

Every B1 vocabulary item MUST have:

| Field | Status | Rule |
|---|---|---|
| `id` | Required | Must exist |
| `word` | Required | Must exist |
| `translation` | Required | Must exist |
| `article` | Required for nouns | ERROR if missing |
| `plural` | Required for nouns | WARN if missing (unless uncountable, then `"—"`) |
| `topic` | Required | ERROR if missing |
| `explanation` | Required | ERROR if missing |
| `taughtInLessonId` | Required | ERROR if missing |

---

## 7. Curriculum Map Standards

Every B1 unit in `curriculumMap.json` MUST have:

| Field | Status |
|---|---|
| `taughtConcepts` | Array of meaningful concept IDs (not placeholders) |
| `requiredConcepts` | Array of prerequisite concept IDs |
| `requiredLessons` | Array of prerequisite lesson IDs |

---

## 8. Validation Rules

| Rule | Severity | Check |
|---|---|---|
| Noun missing article | ERROR | `v.article` is falsy for noun POS |
| Noun missing plural | WARN | `v.plural` is falsy (unless plural is `"—"`) |
| Item missing topic | ERROR | `v.topic` is falsy |
| Question missing explanation | ERROR | `q.explanation` is falsy |
| Reading/Listening Q missing explanation | ERROR | `q.explanation` is falsy |
| Writing/Speaking missing rubric | WARN | `rubric` not present |
| Item missing taughtInLessonId | ERROR | `taughtInLessonId` not present |
| Item missing conceptId | ERROR | `conceptId` not present |
| Lesson missing metadata | ERROR | Missing `conceptId`, `estimatedMinutes`, etc. |
| linkedQuestionIds don't match grammar | WARN | Referenced ID not found in grammar data |
