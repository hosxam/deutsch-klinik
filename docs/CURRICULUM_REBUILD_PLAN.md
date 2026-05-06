# Curriculum Rebuild Plan

## Current Gaps

- Lessons, practice questions, exams, flashcards, and mistakes exist, but the learner path is not consistently lesson -> guided examples -> controlled practice -> mixed practice -> review -> exam task -> remediation.
- Questions do not all declare the lesson concept they test.
- Pronunciation guidance exists as a data area, but it is not yet systematically connected to speaking, medical terms, and remediation.
- Daily plans previously scaled weakly with daily minutes and did not reliably include flashcards/remediation.

## Lesson Structure Standard

Each lesson should include:

- `conceptId`
- `level`
- `trackTags`: `goethe`, `medical-fsp`, `full-mastery`
- `estimatedMinutes`
- `prerequisiteConceptIds`
- grammar rule
- guided examples
- exceptions
- common mistakes
- controlled mini-drills
- mixed practice links
- medical/FSP notes where relevant
- pronunciation notes where relevant
- remediation tags

## Question-To-Lesson Mapping Strategy

Every exercise should declare:

- `conceptId`
- `prerequisiteConceptIds`
- `difficulty`: `core`, `review`, or `advanced`
- `trackTags`
- `remediationTags`

Audit rule:

- If a question tests an untaught concept, expand the lesson, move the question later, or tag it as advanced/review.
- MCQ options and answer keys must remain validated by `npm run validate-grammar`.
- German display keeps ä/ö/ü/ß; user comparison uses ä->ae, ö->oe, ü->ue, ß->ss only.

## Adaptive Daily Plan Logic

Daily plan inputs:

- current level
- selected track
- plan type: Goethe / Medical FSP / Full Mastery
- daily minutes
- remaining lessons, grammar, vocab, reading, listening, writing, speaking
- due flashcards
- mistake backlog
- remediation queue

Plan scale:

- 15 min: short plan
- 30 min: standard plan
- 60 min: intensive
- 90 min: full mastery plan
- 120 min: 2-hour full immersion

Dashboard must show daily target, completed minutes, remaining minutes, predicted finish date, current track, current level, and next recommended work.

## Lesson Depth and Question Alignment Plan

### Current Problem

Lessons are still too shallow compared with the questions. Some exercises require grammar, word order, vocabulary, or test-taking knowledge that the learner has not been explicitly taught. The curriculum must stop behaving like separate lesson and question pools and become a guaranteed learning sequence.

### Required Learning Unit Structure

Every learning unit should include:

- concept title
- CEFR level
- prerequisites
- explanation
- forms/tables
- examples
- common mistakes
- pronunciation notes
- medical/FSP notes when relevant
- guided practice
- controlled practice
- mixed practice
- linked questions
- remediation if failed

### Question-To-Lesson Alignment Model

Every question must have:

- `conceptId`
- `taughtInLessonId`
- `prerequisiteConceptIds`
- `difficulty`
- `skillType`
- `remediationLessonId`

The first pilot uses `a1.greetings.sein-introductions` in `A1_lesson_1`, linked to `A1_gr_4`, `A1_gr_5`, `A1_gr_6`, and `A1_gr_12`.

### Validation Rule

No question should appear before its concept has been taught. If an exercise tests an untaught concept, the fix must be one of:

- expand the prerequisite lesson,
- move the question later,
- tag the question as advanced/review and hide it from first-pass practice.

### Implementation Stages

1. Stage 1: A1 core grammar full rewrite.
2. Stage 2: A1 vocabulary and pronunciation.
3. Stage 3: A2.
4. Stage 4: B1.
5. Stage 5: B2.
6. Stage 6: C1.
7. Stage 7: Medical FSP overlay.

### Pilot Implementation Recommendation

Start with one A1 grammar module and prove the workflow end to end:

- expand the lesson so it teaches the exact rules needed,
- attach concept IDs and linked question IDs,
- verify the questions only appear after the concept is taught,
- connect failed answers to the same remediation lesson,
- then scale the same model across A1 before touching higher levels.

## Remediation Logic

Initial engine:

- Low listening score: repeat listening, transcript review, unknown-word drill.
- Low speaking score: model answer, pronunciation drill, phrase memorization, repeat prompt.
- Low writing score: corrected-version review, grammar lesson, rewrite task.
- Low reading score: reread strategy, vocabulary review, easier text.

Future engine:

- Aggregate repeated tags into weighted weak topics.
- Prefer the shortest remediation that blocks the next exam requirement.

## Pronunciation Curriculum

Required pronunciation concepts:

- alphabet and sound inventory
- ä, ö, ü
- ß
- ch: ich-Laut and ach-Laut
- German r
- word stress
- sentence melody
- common Arabic/English speaker mistakes
- medical/FSP pronunciation examples

Integration points:

- Speaking prompts should link pronunciation tags.
- AI speaking feedback should store recurring pronunciation tags.
- Medical terminology flashcards should include pronunciation notes.

## Medical FSP Integration

Medical FSP track should add:

- patient-history vocabulary repetition
- anatomy/symptom pronunciation
- Arztbrief writing drills
- patient-friendly paraphrasing
- case presentation speaking
- FSP exam simulations

## Mistake-Driven Review

Mistake Notebook should include:

- grammar
- vocabulary
- reading
- listening
- writing recurring issues
- speaking recurring issues

Weak topics should offer:

- targeted practice
- recommended lesson
- filtered mistake review

## Flashcard Integration

Flashcards enter the daily plan when:

- cards are due
- vocabulary goal is incomplete
- full mastery is selected
- vocabulary mistakes exist
- Medical FSP track needs terminology repetition

Flashcards count toward:

- study minutes
- vocabulary progress
- mastery/review stats

## Pilot Module

Pilot concept:

- `a1.personal-pronouns-present-tense`
- Level: A1
- Lesson path: introduce pronouns and regular present-tense endings.
- Questions: A1 conjugation and simple sentence-completion items.
- Remediation: rewrite short sentences with correct verb endings.
- Pronunciation: sentence melody for simple self-introduction sentences.

## Staged Implementation Plan

1. Add concept metadata framework and pilot one A1 module.
2. Map A1 grammar questions to concepts.
3. Expand A1 lessons where questions test untaught rules.
4. Connect daily plan to concept/mistake/remediation tags.
5. Add pronunciation tags to A1 speaking and medical terms.
6. Repeat mapping for A2, B1, B2, C1.
7. Add FSP-specific concept chain and exam remediation.

## A1 Depth Implementation Status

The A1 curriculum depth pass now treats A1 as the first complete pilot for the lesson-to-question architecture:

- A1 grammar questions have concept IDs and linked teaching/remediation lessons.
- A1 lessons 1-17 cover the grammar and vocabulary concepts currently tested by A1 grammar/vocabulary practice.
- A1 vocabulary entries include teaching metadata, usage notes, study notes, and pronunciation hints where useful.
- Daily grammar practice gives a non-blocking prerequisite lesson recommendation when a learner reaches tagged practice before completing the linked lesson.

Remaining A1 curriculum work should focus on richer vocabulary teaching quality rather than metadata: theme dialogues, sentence-mining examples, clinic role-play phrases, and pronunciation drills that connect directly to listening and speaking.
