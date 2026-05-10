# Phase 27: FSP Quality Audit

**Date:** 2026-05-10
**Base:** commit 8b2b6858 (Phase 26)

---

## Data Inventory

| File | Items | Schema Complete? | Key Gaps |
|------|-------|-----------------|----------|
| `fspLessons.json` | 40 (20 modules) | Yes | No `examples`, no `linkedQuestionIds`, explanations need enrichment |
| `fspCases.json` | 100 | Mostly | No `requiredConcepts` field; no cases for lessons 1-30 |
| `fspSpeaking.json` | 50 | Yes | Only covers lessons 1-10; missing lessons 11-40 |
| `fspWriting.json` | 140 | Yes | All have structure+rubrics, full coverage of lessons 1-40 |
| `fspVocabulary.json` | 1,022 | Yes | Some categories thin; patient-facing phrases need expansion |
| `fspAnamnese.json` | 141 | Yes | Covers all anamnesis phases |
| `fspExams.json` | 10 | Yes | |
| `fspGrammar.json` | 100 | Yes | |
| `fspListening.json` | 100 | Yes | |
| `fspReading.json` | 100 | Yes | |
| `fspPresentations.json` | 100 | Yes | |

## FSP Lesson Coverage

### Lessons with Cases Assigned
- **Lessons 31-40 (capstone modules):** 10 cases each = 100 total
- **Lessons 1-30:** Zero cases assigned

This is the single biggest gap. Learners studying modules 1-15 have no case-based practice tied to their lessons. All 100 cases are reserved for the final 10 capstone lessons.

### Lessons with Speaking Prompts Assigned
- **Lessons 1-10:** 4-6 speaking prompts each (total 50)
- **Lessons 11-40:** Zero speaking prompts assigned

Learners practicing medication reconciliation (lesson 11), anamnesis (lessons 12-16), diagnostics (19-20), diagnosis communication (21-22), treatment planning (23-24), consent (25-26), handover (27-28), and Arztbrief writing (29-30) have no speaking practice tied to those lessons.

### Lessons with Writing Prompts
- **All 40 lessons:** 3-4 writing prompts each (total 140)
- All have rubrics and expected structure

## Case Specialty Distribution (current 100 cases)

| Specialty | Count | Assessment |
|-----------|-------|------------|
| GI | 15 | Good |
| Orthopedic/trauma | 14 | Good but mostly for lessons 31-40 |
| Infectious | 12 | Good |
| Neurology | 10 | Good but thin on specific neuro cases |
| Cardiology | 9 | Good but needs chest pain triage focus |
| Respiratory | 9 | Good |
| Other/general | 9 | Acceptable |
| OB/GYN | 4 | Thin |
| Psychiatric | 3 | Thin |
| Endocrine | 3 | Thin |
| Surgical | 3 | Thin |
| Oncologic | 2 | Thin |
| Renal | 2 | Thin |
| Dermatology | 2 | Thin |
| Emergency | 2 | Thin (but overlap with others) |
| ENT | 1 | Thin |

**Missing entirely or very thin:** pediatric communication, geriatric assessment, emergency red-flag escalation, medication reconciliation cases, consent/ethics dialogue cases, and structured handover practice.

## Vocabulary Coverage by Medical Category

| Category | Count | Assessment |
|----------|-------|-----------|
| Anatomy | 80 | Good |
| Diagnostics | 71 (+21 Diagnostic) | Good |
| Medications | 70 | Good |
| Respiratory | 62 (+11) | Good |
| Symptoms | 60 (+10) | Good |
| Cardiovascular | 60 (+15) | Good |
| General Hospital | 40 | Good |
| Procedures | 40 (+15) | Good |
| Neurological | 38 (+10) | Good |
| GI | 34 (+14) | Good |
| Psychiatry | 34 (+5) | Decent |
| Emergency | 32 (+10) | Decent |
| Pain Descriptors | 30 (+10) | Good |
| Musculoskeletal | 30 (+10) | Good |
| Urology | 30 (+13) | Good |
| Gynecology | 30 (+6) | Decent |
| Allergies | 30 (+1) | Decent |
| Social History | 30 (+4) | Decent |
| Hospital Depts | 20 | Decent |
| Discharge | 20 (+1) | Adequate |
| Oncology | 13 | Thin |
| Dermatology | 2 | Very thin |

**Key vocab gaps:** orthopedic-specific terms (casts, prostheses, orthoses), neurology-specific exam terms, surgical workflow terms, pediatric terms, geriatric assessment terms, medication safety terms, and patient-friendly equivalents for common medical procedures.

## Writing Prompt Quality

- All 140 prompts have `expectedStructure` (checklist of sections)
- All 140 have `rubric` (scoring breakdown structure/content/language)
- All have `modelAnswer`, `usefulPhrases`, full `patientData`/`history`/`examFindings`/`diagnostics`/`assessment`/`treatment`
- 140 prompts is generous coverage for 40 lessons

## Speaking Prompt Quality

- All 50 speaking prompts have `task`, `role`, `patientCase`, `expectedAnswerPoints`, `usefulPhrases`, `rubric`, `requiredConcepts`
- But limited to only lessons 1-10 (anamnesis orientation + rapport + chief complaint + pain history)
- No speaking prompts for: past medical history, medications/allergies, ROS, exam language, diagnostics, diagnosis communication, treatment/consent, handover, case presentation, or simulations

## Key Structural Gaps

1. **Cases not distributed** — all 100 cases on lessons 31-40 only
2. **Speaking not distributed** — all 50 speaking prompts on lessons 1-10 only
3. **No `requiredConcepts`** on any case objects (makes teach-before-test validation harder)
4. **Vocab gaps** in orthopedics, neurology, surgery, derm, oncology, pediatrics
5. **FSP curriculum map** already has 202 units but case units only 10 (lessons 31-40) and speaking units 40 (lessons 1-40 mapped but only 1-10 have data)

## What the Phase 10 Final Report Said
Phase 10 created the full infrastructure and identity. The report listed:
- "FSP polish" as next step
- Phase 27 is the natural follow-up to flesh out cases and speaking across all 40 lessons
