# Phase 26: Lesson Fix Priority

**Ranked by impact on learning. Fixes only — no major rewrites.**

## P0 — Validator Fixes (should be clean)

These are pre-existing bugs in validators that report false errors.

1. **FSP case skill in validator** — Add `"case"` to the VALID_SKILLS list in `validate-curriculum-map.cjs`
2. **FSP lesson check in teach-before-test validator** — Load `fspLessons.json` alongside `germanLessons.json` in `validate-teach-before-test.cjs`
3. **5 missing A1 grammar IDs** — Verify they exist in grammar data or add them (A1_gr_176, A1_gr_211, A1_gr_158, A1_gr_424, A1_gr_414)

## P1 — B2 Short Explanations (14 lessons)

These B2 lessons have explanations under 200 chars:
- B2_lesson_6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 21, 22, 23

**Fix:** Expand each with 2-4 additional sentences of structured teaching content (concept definition, usage context, relevant grammar/vocabulary). No new exercises, just proper explanations.

## P2 — FSP Examples & Linked Question IDs

**Fix:**
- Add 2-3 `examples` entries to each of the 40 FSP lessons (sample doctor-patient dialogues relevant to the module topic)
- This is a large task — mark as deferred for a dedicated FSP content phase

## P3 — Pronunciation Notes (A2-C1, FSP)

**Fix:**
- Add `pronunciationNotes` to at least the first 3 A2 lessons (A2_lesson_1, 2, 3) as a demonstration pattern
- Add `pronunciationNotes` to 3 B2 lessons, 3 FSP lessons
- Remaining 139 lessons deferred to dedicated pronunciation phase

## P4 — linkedQuestionIds on Lessons

**Fix:**
- A1: The curriculum map units for A1 already have `linkedQuestionIds`, just the lesson objects themselves don't. The practice system uses the curriculum map not the lesson object, so this is cosmetic, not functional. Skip.
- B2: Add `linkedQuestionIds` to B2_lesson_2 and B2_lesson_11
- C1: Add `linkedQuestionIds` to C1 lessons 11-17, 20, 21, 23, 24, 25
- FSP: All 40 lessons missing — deferred to FSP phase

## P5 — Validator Improvements

Create `scripts/validate-lesson-completeness.cjs` to catch:
- [x] Lesson with linked exercises but no taughtConcepts
- [x] Practice question with requiredConcepts not taught by any prior lesson
- [x] Vocabulary with taughtInLessonId missing or invalid
- [x] Reading/listening/writing/speaking item with requiredConcepts not covered
- [x] FSP case/speaking/writing task missing prerequisite lesson

## P6 — Missing A1 Grammar IDs

Add curriculum map entries for 5 missing A1 grammar question IDs. Verify they exist in grammar data.
