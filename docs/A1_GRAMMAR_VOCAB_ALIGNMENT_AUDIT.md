# A1 Grammar and Vocabulary Alignment Audit

## Scope

Files inspected:

- `src/data/germanLessons.json`
- `src/data/grammar.json`
- `src/data/germanVocabulary.json`
- `src/data/curriculumArchitecture.json`
- `docs/CURRICULUM_REBUILD_PLAN.md`
- `docs/LESSON_QUESTION_ALIGNMENT_AUDIT.md`

This audit covers A1 grammar and vocabulary only.

## A1 Grammar Concepts Tested

Verified A1 grammar questions test these concept areas:

- definite articles: `der`, `die`, `das`
- indefinite articles: `ein`, `eine`
- noun gender basics
- plural basics
- nominative and accusative basics
- personal pronouns
- present tense regular verbs
- irregular present-tense starter forms
- `sein`
- `haben`
- modal verbs: `können`, `müssen`, `wollen`, `möchten`
- word order in main clauses
- yes/no questions
- W-questions
- negation with `nicht` and `kein`
- separable verbs introduction
- basic prepositions: `in`, `an`, `auf`, `mit`, `nach`, `zu`, `bei`, `von`
- time expressions, numbers, and dates
- possessive adjectives
- imperatives
- everyday theme practice: greetings, food, people, school

## A1 Vocabulary Practice Types Tested

Verified A1 vocabulary practice is translation and recognition based, using topic groups:

- greetings
- family
- food and drink
- directions and city places
- hospital, clinic, pharmacy, symptoms, health, body parts
- time, days, months, numbers
- common verbs and modal verbs
- common adjectives and adverbs
- school, education, jobs, documents
- travel, transport, weather, shopping, home, clothing, hygiene
- questions and answers through question-word vocabulary

## Lesson Coverage Status

The A1 lesson set now contains required modules for:

- alphabet and pronunciation
- nouns, capitalization, gender, and articles
- nominative and accusative
- pronouns
- regular present tense
- `sein` and `haben`
- modal verbs
- main-clause word order
- yes/no and W-questions
- negation
- plurals
- basic prepositions
- time, numbers, dates
- separable verbs
- basic sentence building
- beginner medical/FSP phrases
- everyday vocabulary study habits

Each expanded A1 lesson includes metadata for concept tags, prerequisites, estimated minutes, remediation tags, examples, common mistakes, and mini drills.

## Missing or Shallow Coverage Found

Before this A1 pass, most A1 lessons were too shallow for the grammar pool. The verified gaps were:

- article questions appeared before a complete article/gender lesson
- accusative questions appeared before a clear nominative/accusative table
- `haben`, modal verbs, and regular verb endings needed full tables and drills
- question word order and yes/no question order were under-taught
- `nicht` versus `kein` needed a dedicated lesson
- plural and preposition questions needed examples and common mistake notes
- A1 medical vocabulary existed without enough starter phrase guidance
- pronunciation guidance was not connected to A1 grammar/vocabulary lessons

## A1 Questions Needing Concept Tags

All verified A1 grammar questions now have:

- `conceptId`
- `taughtInLessonId`
- `prerequisiteConceptIds`
- `difficulty`
- `skillType`
- `remediationLessonId`

Remaining follow-up: extend the same standard to A2-C1 after the A1 pilot is proven stable.

## Vocabulary Items Needing Better Teaching Notes

A1 vocabulary entries now include teaching metadata:

- `conceptId`
- `taughtInLessonId`
- `skillType`
- `remediationLessonId`
- `studyNote`
- `usageNote`
- `pronunciationHint` where useful

Nouns keep article/plural fields where available. Remaining A1 improvement is qualitative: replace generic example sentences with richer theme-specific examples during the next vocabulary writing pass.

## Exact Lesson Expansions Recommended

Completed in this A1 pass:

- expand A1 pronunciation into alphabet, umlauts, `ß`, `ch`, `r`, and stress
- expand nouns/articles into gender, capitalization, definite and indefinite articles
- expand accusative into masculine article changes and direct-object examples
- expand pronouns, regular verbs, `sein`, `haben`, and modals into tables and drills
- expand word order, questions, negation, plurals, prepositions, time/date, separable verbs, and sentence building
- add A1 medical/FSP starter phrases and clinic examples
- add lesson tags that connect grammar questions back to the teaching lesson

Recommended next A1 work:

- create richer theme dialogues for vocabulary categories
- add guided vocabulary lessons for article + plural memorization
- add listening/speaking pronunciation drills for the A1 pronunciation concepts
- connect wrong A1 vocabulary answers directly to the matching vocabulary lesson and flashcard review queue
