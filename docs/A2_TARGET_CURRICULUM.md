# A2 Target Curriculum Specification

Based on audit findings. Targets A1 Phase 3 quality parity.

---

## Lesson Targets

### All 25 Lessons Must Have

| Field | Target | Current Status |
|---|---|---|
| conceptId | Unique A2 concept ID | Done (25/25) |
| estimatedMinutes | Integer, 45-90 | Missing values (25/25 empty) |
| conceptsTaught | Array of concept strings | Done |
| prerequisiteConceptIds | Array of concept IDs | Done |
| commonMistakes | 4-8 entries with explanation + correction | Partial (1-5 entries) |
| formsTables | 1-4 tables per lesson | Done (1 each) |
| miniDrills | 4-8 questions with answers | Partial (1-3 each) |
| examples | 10-20 bilingual (de/en format) | Partial (10 each, no bilingual format) |
| linkedQuestionIds | At least 3 IDs linked | Missing on 13/25 |
| trackTags | Array of tags | Done |
| remediationTags | Array of tags | Done |
| explanation | Clear English explanation | Done |
| reviewSummary | German summary | Done |

### Lesson-specific Context Targets

| Lesson | Topic | Key Grammar | Priority Content |
|---|---|---|---|
| 1 | A1 Review + Self-intro | Possessivartikel, Negation | Refresh all A1 foundations |
| 2 | Daily Routine Detail | Trennbare Verben, Modalverben, Präteritum | Reflexive verbs expanded |
| 3 | Past Activities (Perfekt) | Perfekt haben/sein, Partizip II | Irregular participles, separable verbs in Perfekt |
| 4 | Travel + Transport | wenn Sätze, Konjunktionen, als vs wenn | Prepositions of direction |
| 5 | Hotel + Accommodation | Dativ Artikel, weil Sätze | Dative prepositions |
| 6 | Shopping + Services | Wechselpräpositionen, Indirekte Fragen | Two-way prepositions |
| 7 | Restaurant + Food | Adjektivendungen intro, Komparativ | Comparative forms |
| 8 | Work + Workplace | Modal Verbs Past, Zeitangaben | Preterite of modals |
| 9 | Education + Courses | Nebensätze, dass Sätze | Subordinate clause structure |
| 10 | Housing + Rental | Wechselpräpositionen, Indirekte Fragen | Two-way prepositions extended |
| 11 | Health + Symptoms | Reflexive Verben, Dativverben | Body parts, symptoms vocab |
| 12 | Pharmacy + Medication | Imperativ revisited | Medication instructions |
| 13 | Weather + Seasons | Präteritum (wetter), Zeitangaben | Past tense for weather |
| 14 | Hobbies + Free Time | Komparativ, Superlativ, gern vs lieber | Preference expressions |
| 15 | Invitations + Appointments | Satzstellung, Konjunktionen (erweiterte) | Time-manner-place word order |
| 16 | Holidays + Celebrations | Possessivartikel, Dativ | Dates, gift-giving vocab |
| 17 | Body Parts + Appearance | Reflexive Verben, Dativ (mir/dir) | Physical descriptions |
| 18 | Clothing + Fashion | Adjektivendungen (nom/akk/dat) | Adjective endings extended |
| 19 | Family + Relationships | Genitiv, Possessivartikel extended | Family relations, possessive |
| 20 | Technology + Media | Indirekte Fragen, Nebensätze | Tech vocabulary |
| 21 | Animals + Nature | Komparativ/Superlativ, wenn Sätze | Nature descriptions |
| 22 | Emotions + Feelings | Reflexive Verben, Dativverben extended | Emotional vocabulary |
| 23 | Directions + Traffic | Dativpräpositionen, Wechselpräpositionen | Traffic, orientation |
| 24 | Festivals + Traditions | Genitiv, Präteritum | Cultural vocabulary |
| 25 | Review + B1 Preview | A2 Mix + Abschluss | Comprehensive review |

---

## Vocabulary Targets

### Minimum 1,000 Entries (MET)

| Requirement | Target | Current |
|---|---|---|
| Total entries | 1,000 | 1,000 |
| Article for nouns | 100% | 99.9% |
| Plural for countable nouns | 100% | 98.6% |
| Topic assigned | 100% | 100% |
| Example sentence | 100% | 100% |
| Part of speech | 100% | 100% |
| taughtInLessonId | 100% | 100% |

### Topic Distribution Targets

| Topic | Min Target | Current | Status |
|---|---|---|---|
| Medical | 50 | 30 | Need +20 |
| Health | 60 | 61 | OK |
| Daily Life | 70 | 68 | OK |
| Travel | 70 | 84 | OK |
| Food | 40 | 35 | Need +5 |
| Work | 40 | 37 | Need +3 |
| Education | 40 | 41 | OK |
| Housing | 35 | 34 | OK |
| Shopping | 35 | 33 | OK |

---

## Grammar Targets

### Target: 370+ Questions (A1 parity)

| Topic | Min Target | Current | Need |
|---|---|---|---|
| Perfekt (haben/sein) | 20 | 27 | OK |
| Konjunktionen | 25 | 25 | OK |
| wenn Sätze | 15 | 18 | OK |
| Dativ (all types) | 20 | 25 | OK |
| Akkusativ vs Dativ | 15 | 16 | OK |
| Adjektivendungen | 15 | 7 | +8 |
| Komparativ/Superlativ | 15 | 16 | OK |
| Modalverben | 15 | 12 | +3 |
| Nebensätze (weil/dass) | 15 | 11 | +4 |
| Präteritum | 10 | 4 | +6 |
| Reflexive Verben | 10 | 6 | +4 |
| Genitiv | 10 | 4 | +6 |
| Wechselpräpositionen | 10 | 5 | +5 |
| Indirekte Fragen | 10 | 4 | +6 |
| Trennbare Verben (Perfekt) | 10 | 4 | +6 |
| Satzstellung | 10 | 10 | OK |
| Possessivartikel | 10 | 4 | +6 |
| Pronomen (Akk/Dat) | 10 | 9 | +1 |
| Imperativ | 8 | 4 | +4 |
| Negation | 8 | 3 | +5 |
| Zeitangaben | 8 | 3 | +5 |
| als vs wenn | 8 | 3 | +5 |
| Mix/Review | 15 | 10 | +5 |
| **Total** | **~370** | **246** | **+124** |

### Quality Requirements
- Every question must have: conceptId, taughtInLessonId, explanation, topic, answer, options (for MCQ/fill)
- No duplicate topic fragmentation (merge "Perfect Tense" + "Perfekt haben")
- Include sentence-order and correction question types if supported by schema

---

## Reading Targets

| Requirement | Target | Current |
|---|---|---|
| Total items | 50+ | 53 |
| Questions per item | 3-5 | 3 (most) |
| Explanations on all questions | Required | 50/53 items complete |
| taughtInLessonId | Required | 0/53 |
| requiredConcepts | Optional target | 0/53 |
| All have level | Required | 53/53 |
| All have conceptId | Required | 53/53 |

### New Texts Needed
- Health insurance notice
- Pharmacy instructions
- Classified ads (housing, jobs)
- Doctor appointment emails
- Public transport schedule

---

## Listening Targets

| Requirement | Target | Current |
|---|---|---|
| Total items | 50+ | 50 |
| Questions per item | 3-5 | 3 (most) |
| Explanations on all questions | Required | 0/50 |
| taughtInLessonId | Required | 0/50 |
| requiredConcepts | Optional target | 0/50 |
| Audio field | Preferably present | 5/50 |

### New Scripts Needed
- Airport announcement
- Doctor phone call
- Bus/train announcement
- Weather forecast
- Shopping dialogue with prices

---

## Writing Targets

| Requirement | Target | Current |
|---|---|---|
| Total items | 50+ | 50 |
| taughtInLessonId | Required | 0/50 |
| requiredConcepts | Optional target | 0/50 |
| usefulPhrases | Present | Partial |
| sampleAnswer | Present for key tasks | 0/50 |

### New Prompt Types Needed
- Appointment cancellation
- Complaint letter (simple)
- Hotel reservation
- Sick note / doctor excuse

---

## Speaking Targets

| Requirement | Target | Current |
|---|---|---|
| Total items | 50+ | 70 |
| taughtInLessonId | Required | 0/70 |
| requiredConcepts | Optional target | 0/70 |
| rubric | Present | 70/70 |
| rubricKeys | Present | 70/70 |

### New Prompt Types Needed
- Doctor reception roleplay
- Symptom description roleplay
- Past event narration
- Expressing justified opinions

---

## Curriculum Map Targets

| Requirement | Target | Current |
|---|---|---|
| A2 units | 287 | 287 |
| linkedLessonIds | Present | 287/287 |
| linkedQuestionIds | Present | TBD |
| taughtConcepts | Accurate | Partial |
| requiredConcepts | Accurate | Partial |

---

## Validator Targets

Create `scripts/validate-a2-quality.cjs` that checks:
- A2 noun missing article (error)
- A2 noun missing plural when needed (warning, some are singular only)
- A2 item missing topic (error)
- A2 practice question missing explanation (error)
- A2 reading/listening item missing answer explanation (error)
- A2 writing/speaking prompt missing rubric/checklist (error)
- A2 item with B1+ grammar requirement (warning)
- A2 task not linked to any lesson/concept (error)
- A2 lesson missing linkedQuestionIds (warning)
- A2 reading/listening/writing/speaking missing taughtInLessonId (error)

---

## Execution Plan

### Stage 1: Fix Critical Metadata (P0)
1. Add taughtInLessonId to reading/listening/writing/speaking items
2. Add explanations to listening questions
3. Add missing question explanations to reading items
4. Add linkedQuestionIds to lessons 6, 9, 11-13, 15-18, 20-23

### Stage 2: Deepen Lessons (P1)
5. Expand miniDrills from 1-3 to 4-8 per lesson
6. Expand commonMistakes from 1-2 to 4-6 per lesson
7. Add bilingual format to examples
8. Set estimatedMinutes values

### Stage 3: Expand Grammar (P1)
9. Add ~124 new grammar questions targeting weak topics

### Stage 4: Enrich Skills (P2)
10. Add requiredConcepts / linkedLessonPrerequisites to reading/listening/writing/speaking
11. Add sample answers to writing prompts
12. Add usefulPhrases where missing

### Stage 5: Validators + Final Checks
13. Create A2 quality validator
14. Run all validators
15. Run build
16. Create final report
