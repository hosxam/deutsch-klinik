# A1 Lesson Question Coverage Report

## Purpose

This report verifies the first A1 daily-plan alignment pass. The rule is:

- practice may use concepts from lessons completed before today
- practice may use concepts from lessons completed earlier in today's plan
- practice must not intentionally test untaught concepts
- if a question belongs to the lesson concept but needs details the lesson did not clearly teach, the lesson is expanded

## A1_lesson_1

**Concepts taught**

- `a1_greetings`
- `a1_introductions`
- `a1_vocab_greetings`

**Linked questions reviewed**

- `A1_ex_2`
- `A1_gr_295`
- `A1_gr_296`
- `A1_gr_297`
- `A1_gr_298`

**Gaps found**

- The lesson already covered greetings and basic introductions after the previous A1 pilot expansion.
- The linked questions test greeting/intro recognition and do not require moving to a later lesson.

**Lesson expansions made**

- No additional expansion was required in this pass.
- The lesson remains linked to greeting vocabulary and introduction practice.

**Questions still needing review**

- None for the current A1 greeting practice set.

## A1_lesson_2

**Concepts taught**

- `a1_alphabet_pronunciation`
- `a1_umlauts_eszett`
- `a1_numbers_dates`

**Linked questions reviewed**

- `A1_gr_19`
- `A1_gr_20`
- `A1_gr_299`
- `A1_gr_300`
- `A1_gr_301`

**Gaps found**

- The lesson title and objective included numbers, but the pure number questions were still linked to the later time/date lesson.
- The lesson needed clearer coverage for irregular starter forms such as `zwölf`, number composition such as `zweiundzwanzig`, and displayed `ß` in `dreißig`.
- `A1_gr_300` displayed the answer as `dreiunddreissig`, which should display as `dreiunddreißig`.

**Lesson expansions made**

- Reassigned pure number questions from `A1_lesson_14` to `A1_lesson_2`.
- Expanded the explanation with the 0-12 memorization rule and 21-99 `ones + und + tens` pattern.
- Added examples for `zweiundzwanzig`, `siebenundvierzig`, and `dreiunddreißig`.
- Added a number table for `zwölf`, `fünfzehn`, `zweiundzwanzig`, `dreiunddreißig`, and `siebenundvierzig`.
- Added a common mistake note about German number order.
- Added a mini-drill for spelling `dreiunddreißig` with proper `ß`.
- Corrected the displayed grammar answer for `A1_gr_300` to `dreiunddreißig`.

**Questions still needing review**

- Time-specific questions such as `Viertel nach`, `halb sechs`, and `Viertel vor neun` remain linked to `A1_lesson_14`, because they require clock-time teaching beyond basic numbers.

## Daily Plan Selection Coverage

The daily mission selector now stores lesson IDs planned for the day and filters grammar/vocabulary by lesson coverage:

- fresh A1 daily plan teaches `A1_lesson_1` and `A1_lesson_2` before grammar/vocab practice
- grammar practice prefers questions from the lessons completed earlier in the same daily plan
- review questions may come from previously completed lessons
- untaught A1 lesson IDs are excluded from normal generated daily practice
- free practice can still surface a prerequisite warning if the user manually opens practice outside the generated plan

## Remaining A1 Review

Next coverage passes should review:

- `A1_lesson_3`: noun gender, definite/indefinite articles, family nouns
- `A1_lesson_4`: restaurant vocabulary plus accusative direct-object patterns
- `A1_lesson_10`: W-question word order, especially `Warum`
- `A1_lesson_14`: clock time, dates, and scheduling phrases
