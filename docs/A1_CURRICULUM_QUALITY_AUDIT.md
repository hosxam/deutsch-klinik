# A1 Curriculum Quality Audit

Generated: 2026-05-07
Branch: vocab-import-pipeline
Commit base: 3449fb6 (Phase 2)

## 1. Current Counts

| Category | Count | Target (A1) |
|----------|-------|-------------|
| Lessons | 25 | 25-30 |
| Vocabulary entries | 497 | 800+ |
| Grammar questions | 223 | 300-400 |
| Reading items | 50 | 50-75 |
| Listening items | 50 | 50-75 |
| Writing prompts | 50 | 30-50 |
| Speaking prompts | 50 | 30-50 |

## 2. Lessons Quality Assessment

### Strengths
- All 25 lessons have explanations, examples, and guided practice (3-8 exercises each)
- Common mistakes documented for lessons 1-17 (missing in 18-25)
- Medical/health examples where natural (lesson 16: body parts, lesson 7: symptoms)
- Good coverage of core A1 grammar topics

### Weaknesses

#### Missing/Incomplete Metadata
- **Lessons 18-25** (last 8) are clearly incomplete:
  - `estimatedMinutes: undefined` (no duration estimate)
  - `conceptId: MISSING`
  - `conceptsTaught: []` (empty array)
  - `commonMistakes: false`
  - `linkedQuestionIds: []` (no practice links)
  - No `formsTable`, no practice variety (all have exactly 3 guided practice, 0 controlled, 0 mixed, 0 independent)
- Only lesson 1 has any `linkedQuestionIds` (4 questions)

#### Title Misalignment
- Lesson 3 ("Nomen, Großschreibung...") has grammar focus on **possessive articles**, not nouns
- Lesson 5 ("Personalpronomen...") teaches **dative prepositions** (zu, bei), which is A2 content
- Lesson 6 ("Präsens: regelmäßige Verben") has grammar focus on **time expressions**
- Lesson 7 ("Sein und haben") has grammar focus on **days/months/ordinals**
- Lesson 12 ("Pluralformen") has grammar focus on **color adjectives**
- Lesson 14 ("Zeit, Zahlen und Datum") has grammar focus on **rooms and furniture**

This suggests the lesson metadata (title vs actual content) drifted during development.

#### Missing A1 Topics
- Imperatives (du/Sie) — not explicitly covered as a standalone topic
- Basic dative (mir, dir) — covered tangentially in lesson 5 but that's A2 territory
- Possessive articles (mein/dein) — mentioned in lesson 13 but not as main topic
- Neither...nor, sibling descriptions

#### A2+ Content in A1
- Lesson 5 teaches "zu + dem = zum, bei + dem = beim" — dative prepositions are A2
- Lesson 13 grammar focus is possessive articles, not prepositions (title says "prepositions")

## 3. Vocabulary Quality Assessment

### Strengths
- 497 entries, 51 topics — reasonable breadth
- All entries have: level, topic, translation, example, taughtInLessonId, tags
- 304 nouns have articles; 256 have plurals
- Good medical sub-vocabulary: Body Parts, Health, Pharmacy, Emergency, Symptoms, Appointment Communication, Documents

### Weaknesses
- **partOfSpeech field**: Only 304 entries have `partOfSpeech === 'noun'`, rest are all `'other'`. No verbs, adjectives, adverbs, prepositions, etc. identified
- **Articles missing for 0 nouns** (all nouns actually have articles - the earlier count was wrong, `partOfSpeech` not `pos`)
- Wait, actually `partOfSpeech` shows 'noun' for 304 and 'other' for the rest. That means 193 entries are labeled 'other' — likely verbs, adjectives, etc. but mislabeled
- **Example sentences** are often generic: "Ich lerne das Wort [word]" for many entries — not meaningful
- **No gender** marked for nouns explicitly (article field exists but could be more structured)
- **No strong/weak verb marking** on verbs
- **No separable prefix marking** on verbs
- **2 duplicate entries** (tschüss, früh have 2 entries each)
- **~193 entries** lack proper `partOfSpeech` categorization
- **Topics could be more granular** — 51 topics is reasonable but some are too broad ("General", "Basic Verbs")

## 4. Grammar Practice Quality Assessment

### Strengths
- 223 questions across 28 topics — decent coverage
- All have: correct answer, explanation, level, topic, lesson link
- Variety of types: fill-blank (159), MCQ (53), article-select (7), mixed (3), sentence-correction (1)
- All 223 are linked in curriculumMap via grammar units

### Weaknesses
- **Only 4 questions linked directly to lessons** (lesson 1 has linkedQuestionIds). The rest are linked through the curriculum map's vocab/grammar units
- **No sentence-order type questions** — important for A1 word order practice
- **Topic "Mixed Review"** is a catchall — 1 grammar concept with mixed topic
- **sentence-correction only 1 question** — this type should be expanded
- **article-select only 7 questions** — articles are core A1 content, needs more

## 5. Reading Quality Assessment

### Strengths
- 50 items, all with lessonId, questions, text, title
- Good variety expected
- All linked in curriculumMap with prerequisites

### Weaknesses
- **29 items missing `level` field** (A1 reading items)
- Cannot verify level-appropriateness from field

## 6. Listening Quality Assessment

### Strengths
- 50 items, all with lessonId, script, questions, title, level
- All have `audio` field and `level` field
- Linked in curriculumMap

### Weaknesses
- No A1-appropriateness verification possible without reading scripts

## 7. Writing Quality Assessment

### Strengths
- 50 prompts, all with lessonId, prompt, instructions, wordLimit, tips
- **All have rubric** with `rubricKeys` (!) — excellent
- Good variety: forms, SMS, emails, invitations, appointment requests

### Weaknesses
- Missing `level` field on all items
- No sample answers (data format may not support)

## 8. Speaking Quality Assessment

### Strengths
- 50 prompts, all with lessonId, prompt, instructions, prepTime, talkTime, tips, usefulPhrases
- All have `level` field

### Weaknesses
- Missing rubric/checklist (writing has rubric but speaking doesn't)
- No sample answer points

## 9. Curriculum Map Assessment

### Strengths
- 266 A1 units mapped — covers all skill types
- All units have proper level, skill, order fields
- Prerequisites set conservatively (lesson order + linked lessons)

### Weaknesses
- Grammar curriculum map has 0 prerequisite edges for A1 (no concept-to-concept dependencies)
- Lessons 18-25 are in the curriculum map but their concept IDs are missing/generic

## 10. Exam-Readiness Gaps

For Goethe A1, candidates need:
- [x] Reading: signs, notices, ads, forms, short messages — partially covered
- [x] Listening: announcements, numbers, times, directions — partially covered
- [ ] Writing: form-filling, SMS/email — covered but could use more form-filling
- [ ] Speaking: self-introduction, question-answering, request-making — covered but no A1-specific exam simulation
- [x] Grammar: present tense, articles, negation, questions, modal verbs — mostly covered
- [ ] Imperatives — not explicitly covered in lessons
- [ ] Sentence ordering practice — minimal
- [x] Numbers, dates, time — covered

## 11. Priority Issues (Actionable)

| Priority | Issue | Fix |
|----------|-------|-----|
| P0 | Lessons 18-25 incomplete (missing conceptId, conceptsTaught, estimatedMinutes, commonMistakes) | Complete metadata |
| P0 | 193 vocab entries marked as 'other' partOfSpeech | Add proper POS tags |
| P0 | Example sentences are generic for many entries | Improve examples |
| P0 | A1 reading items missing level field | Add level="A1" |
| P1 | Lesson titles mismatch grammar focus (lessons 5, 6, 7, 12, 14) | Fix title/focus alignment or remove unreferenced lesson files |
| P1 | ~50 entries needed to reach 800 vocab target | Add entries for missing topics |
| P1 | Only 4 grammar questions linked to lessons directly | Link questions to appropriate lessons |
| P2 | No imperative grammar lesson | Add or identify existing lesson |
| P2 | Grammar missing sentence-order type | Add questions of this type |
| P2 | No sample answers in writing/speaking | Add where format supports |
| P2 | 2 duplicate vocab entries | Deduplicate |
