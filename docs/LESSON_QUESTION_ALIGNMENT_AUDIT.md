# Lesson Question Alignment Audit

## Pilot Scope

Pilot area: A1 grammar, first 20 grammar questions.

Goal: verify whether current lessons teach the exact concept required before the question appears, then identify lesson expansions or question moves.

## A1 Grammar Findings

| Question | Concept tested | Current teaching coverage | Gap | Recommendation |
| --- | --- | --- | --- | --- |
| A1_gr_1 | der Hund, nominative masculine article | Partial | A1 lesson sequence does not yet provide a full noun-gender/article table before article practice. | Add A1 article lesson with der/die/das, noun gender cues, and nominative examples. |
| A1_gr_2 | die Katze, nominative feminine article | Partial | Same article gap as A1_gr_1. | Teach feminine article patterns and examples before question. |
| A1_gr_3 | das Kind, nominative neuter article | Partial | Same article gap as A1_gr_1. | Teach neuter article patterns and examples before question. |
| A1_gr_4 | ich bin | Covered after pilot expansion | Original lesson mentioned sein but did not drill the exact question enough. | Expanded A1_lesson_1 with sein table and controlled practice. |
| A1_gr_5 | du bist | Covered after pilot expansion | Original lesson listed the form but did not connect it to controlled practice. | Expanded A1_lesson_1 with explicit du bist practice. |
| A1_gr_6 | er ist | Covered after pilot expansion | Original lesson listed the form but did not teach clinic example usage. | Expanded A1_lesson_1 with er ist in der Klinik. |
| A1_gr_7 | wir haben | Gap | haben is not fully taught before the question. | Add a haben mini-lesson before this item or move the question later. |
| A1_gr_8 | hast du | Gap | yes/no question order with haben is not yet taught. | Teach haben conjugation and verb-first question order. |
| A1_gr_9 | kein for nouns without article | Gap | nicht vs kein needs a dedicated explanation and noun gender examples. | Add A1 negation lesson before this question. |
| A1_gr_10 | nicht for adjectives/verbs | Gap | nicht placement and contrast with kein are not fully taught. | Teach nicht vs kein with examples and mistakes. |
| A1_gr_11 | verb-second after time adverb | Gap plus data concern | Question asks correction but explanation says the wrong sentence is correct. | Fix or move after word-order lesson; ensure answer/explanation agree. |
| A1_gr_12 | Woher for origin | Covered after pilot expansion | Original lesson taught introductions but not this W-question explicitly. | Expanded A1_lesson_1 with Woher kommst du? |
| A1_gr_13 | ich arbeite | Gap | regular present tense endings not fully taught before question. | Add present-tense regular verb table before this item. |
| A1_gr_14 | er wartet | Gap | -t ending and stems ending in -t need explicit teaching. | Add exceptions/extra e note for warten/arbeiten. |
| A1_gr_15 | er spricht | Gap | vowel-changing verbs are not safe as early core practice without lesson coverage. | Tag as advanced/review or move after irregular present lesson. |
| A1_gr_16 | accusative den Mann | Gap | accusative masculine article change needs explicit lesson. | Move after accusative lesson. |
| A1_gr_17 | ich kann | Gap | modal verb conjugation not taught before question. | Add modal verb lesson or move later. |
| A1_gr_18 | kannst du | Gap | modal conjugation plus verb-first question order. | Add modal question examples before item. |
| A1_gr_19 | 22 | Partial | numbers are taught, but spelling pattern needs stronger controlled practice. | Expand numbers lesson with ones-und-tens table. |
| A1_gr_20 | 47 | Partial | same as A1_gr_19. | Add more guided number formation practice. |

## Pilot Implementation Completed

`A1_lesson_1` was expanded as the pilot module for `a1.greetings.sein-introductions`.

Added coverage:

- concept ID and linked question IDs
- sein forms table
- W-question order for origin
- examples for `ich bin`, `du bist`, `er ist`, and `Woher kommst du?`
- common mistakes
- pronunciation notes for ß, ü, and question melody
- Medical FSP notes for formal patient introductions
- controlled practice linked to `A1_gr_4`, `A1_gr_5`, `A1_gr_6`, and `A1_gr_12`
- remediation instruction if the linked questions fail

## Next Alignment Work

1. Extend the same concept-tagging standard to A2-C1 after the A1 implementation is stable.
2. Replace generic A1 vocabulary examples with richer theme-specific mini-dialogues.
3. Add more pronunciation-specific drills for A1 listening and speaking practice.
4. Build validation coverage that fails when a question has no linked teaching lesson.

## A1 Follow-Up Completed

The A1 follow-up pass expanded the A1 lesson set beyond the original pilot:

- `A1_lesson_1` through `A1_lesson_17` now carry concept, prerequisite, practice, remediation, and estimated-minute metadata.
- All A1 grammar questions now include `conceptId`, `taughtInLessonId`, `prerequisiteConceptIds`, `difficulty`, `skillType`, and `remediationLessonId`.
- A1 grammar practice now shows a non-blocking "study this lesson first" recommendation when a tagged question points to an incomplete lesson.
- A1 vocabulary entries now include teaching metadata and usage/study guidance.
