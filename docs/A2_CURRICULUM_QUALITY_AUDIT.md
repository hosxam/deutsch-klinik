# A2 Curriculum Quality Audit

Generated: 2026-05-07

## Overview

A comprehensive audit of the Deutsch-Klinik A2 German curriculum compared to the completed A1 Phase 3 quality standard.

---

## 1. A2 Lesson Count

- **Total A2 lessons:** 25 (matches A1)
- **All lessons present:** Yes
- **All lessons have conceptId:** Yes (25/25)
- **All lessons have prerequisiteConceptIds:** Yes (25/25)
- **All lessons have conceptsTaught:** Yes (25/25)
- **All lessons have commonMistakes:** Yes (25/25, but quality varies)
- **All lessons have formsTables:** Yes (25/25)
- **All lessons have miniDrills:** Yes (25/25, but only 1-3 each)
- **estimatedMinutes:** Present but all null/empty
- **lessonDepthVersion:** Present on all

### Strengths
- Complete 25-lesson structure
- All structural metadata fields present
- Good progression from A1 review through B1 preview

### Weaknesses
- `linkedQuestionIds` missing on 13/25 lessons (lessons 6, 9, 11-13, 15-18, 20-23)
- `miniDrills` only 1-3 items per lesson (A1 had 4-8)
- `commonMistakes` only 1-2 entries for most lessons (A1 had 4-8)
- Examples lack bilingual (German+English) format -- all 10 per lesson have no language markers
- `estimatedMinutes` values are null
- `remediationTags` present but generic
- No `controlledPractice` or `mixedPractice` sections

---

## 2. A2 Vocabulary Count

- **Current total:** 1,000 entries
- **Target minimum:** 1,000 entries
- **Status:** MET

### Completeness
| Field | Missing | Total Nouns | % Complete |
|---|---|---|---|
| article (nouns) | 1 | 759 | 99.9% |
| plural (nouns) | 11 | 759 | 98.6% |
| topic | 0 | 1,000 | 100% |
| example sentence | 0 | 1,000 | 100% |
| part of speech | 0 | 1,000 | 100% |
| taughtInLessonId | 0 | 1,000 | 100% |

### Topic Distribution
- Travel: 84, Daily Life: 68, Health: 61, Feelings: 58, Nature: 42, Education: 41, Work: 37, Food: 35, Housing: 34, Shopping: 33, Technology: 33, Culture: 32, Medical: 30, Clothing: 30, Communication: 28, Services: 28, Hobbies: 27, Finance: 26, People: 26, Furniture: 26, Time: 26, Admin: 25

### Weaknesses
- Medical vocabulary is limited (30 entries) -- important for clinic outreach use case
- Some nouns missing plural forms (11 entries)
- 1 noun missing article
- Topic distribution is reasonable but could be more balanced

---

## 3. A2 Grammar Question Count

- **Current total:** 246 questions
- **A1 comparison:** 411 questions
- **Gap:** 165 questions short of A1 parity

### Completeness
| Field | Missing | Total | % Complete |
|---|---|---|---|
| explanation | 0 | 246 | 100% |
| taughtInLessonId | 0 | 246 | 100% |
| conceptId | 0 | 246 | 100% |
| topic | 0 | 246 | 100% |
| level | 0 | 246 | 100% |
| answer | 0 | 246 | 100% |

### Topic Coverage Issues
- **Adjektivendungen:** only 7 questions (needs 15+ for A2)
- **Nebensätze (all types):** 60 total, split across many sub-topics, many with only 3-5 questions
- **Präteritum:** only 4 questions (important for A2 storytelling)
- **Reflexive Verben:** only 4-6 questions (important for daily routine)
- **Genitiv:** only 3-4 questions (A2 introduction)
- **Wechselpräpositionen:** only 3-5 questions
- **Trennbare Verben Perfekt:** only 4 questions
- **Indirekte Fragen:** only 4 questions
- **als vs wenn:** only 3 questions
- **Negation:** only 3 questions
- **Zeitangaben:** only 3 questions
- Some duplicate topics exist (e.g. "Perfect Tense" and "Perfekt haben")
- No sentence-order or correction type questions

---

## 4. A2 Reading Count

- **Current total:** 53 items
- **A1 comparison:** 50 items
- **Status:** Comparable

### Completeness
| Field | Missing | Total |
|---|---|---|
| conceptId | 0 | 53 |
| level | 0 | 53 |
| taughtInLessonId | 53 | 53 |
| text | 0 | 53 |
| questions (3+) | 50 | 53 |

### Weaknesses
- **All 53 items missing taughtInLessonId**
- **3 items have only 2 questions** (A2_read_2, A2_read_3, A2_read_4)
- **Explanations missing on many questions:** only 50/53 items have all explanations
- Some texts may need richer A2-appropriate vocabulary
- No `requiredConcepts` or `linkedLessonPrerequisites` fields
- Topics: emails, appointments, travel good, but missing health/practice texts

---

## 5. A2 Listening Count

- **Current total:** 50 items
- **A1 comparison:** 50 items
- **Status:** Comparable

### Completeness
| Field | Missing | Total |
|---|---|---|
| conceptId | 0 | 50 |
| level | 0 | 50 |
| taughtInLessonId | 50 | 50 |
| script | 0 | 50 |
| questions (3+) | 48 | 50 |
| audio | 5 | 50 (depends on file availability) |

### Weaknesses
- **All 50 items missing taughtInLessonId**
- **2 items have only 2 questions** (A2_listen_2, A2_listen_3)
- **All 50 items have missing/partial explanations** (0/50 fully explained)
- Only 5 items have `audio` field (but this may be a web URL pattern)
- No `requiredConcepts` or `linkedLessonPrerequisites` fields

---

## 6. A2 Writing Prompt Count

- **Current total:** 50 items
- **A1 comparison:** 50 items
- **Status:** Comparable

### Completeness
| Field | Missing | Total |
|---|---|---|
| conceptId | 0 | 50 |
| level | 0 | 50 |
| taughtInLessonId | 50 | 50 |
| rubric | 0 | 50 |
| rubricKeys | 0 | 50 |
| prompt | 0 | 50 |
| instructions | 0 | 50 |

### Weaknesses
- **All 50 items missing taughtInLessonId**
- Many prompts lack `usefulPhrases`
- No `sampleAnswer` fields
- No `requiredConcepts` or `linkedLessonPrerequisites` fields
- Task types present: email, opinion, experience report -- missing complaint, cancellation, invitation

---

## 7. A2 Speaking Prompt Count

- **Current total:** 70 items
- **A1 comparison:** 50 items
- **Status:** ABOVE A1 (good)

### Completeness
| Field | Missing | Total |
|---|---|---|
| conceptId | 0 | 70 |
| level | 0 | 70 |
| taughtInLessonId | 70 | 70 |
| rubric | 0 | 70 |
| rubricKeys | 0 | 70 |
| usefulPhrases | 0 | 70 |
| prompt | 0 | 70 |
| instructions | 0 | 70 |

### Weaknesses
- **All 70 items missing taughtInLessonId**
- No `requiredConcepts` or `linkedLessonPrerequisites` fields
- Roleplay tasks exist but missing doctor reception/symptom roleplays

---

## 8. Teach-Before-Test Gaps

- **Curriculum map units:** 1,378 (287 A2)
- **teach-before-test validator:** PASSES
- **curriculum-dependencies:** 5 warnings (all pre-existing B1/B2/C1 issues)

### Issues
- 13 A2 reading items missing question explanations
- 50 A2 listening items missing question explanations
- **Fixed:** A2_lesson_1 prereq now uses conceptId `a1_school_subjects` (was `a1_lesson_25`)

---

## 9. Goethe A2 Readiness Gaps

### Speaking
- Missing: roleplay at doctor, expressing opinions with justification, past event narration
- Present: basic self-intro, routine, directions

### Writing
- Missing: formal email conventions, complaint letters, appointment cancellation
- Present: informal email, invitation, opinion paragraph

### Reading
- Missing: health insurance notices, pharmacy labels, classified ads
- Present: travel info, event notices, simple emails

### Listening
- Missing: airport announcements, doctor phone calls, public transit announcements
- Present: simple conversations, directions, shopping dialogues

---

## 10. Summary of Priority Fixes

| Priority | Issue | Impact |
|---|---|---|
| P0 | All reading/listening/writing/speaking missing taughtInLessonId | Breaks teach-before-test linking |
| P0 | 13/25 lessons missing linkedQuestionIds | Lessons not connected to practice |
| P0 | Listening explanations missing (50 items, ~150 questions) | Learners can't understand mistakes |
| P1 | miniDrills too shallow (1-3 items vs A1's 4-8) | Less practice per lesson |
| P1 | commonMistakes too few (1-2 vs A1's 4-8) | Less error correction |
| P1 | Grammar questions 165 short of A1 parity | Gaps in topic coverage |
| P1 | Examples lack bilingual format | Harder for self-study |
| P2 | estimatedMinutes null | No lesson time estimates |
| P2 | Reading/listening missing requiredConcepts | No prerequisite tracking |
| P2 | Writing prompts missing sample answers | Harder for self-assessment |
| P2 | Medical vocabulary thin (30 entries) | Weak for clinic use case |
