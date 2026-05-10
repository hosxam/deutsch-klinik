# PHASE 27: FSP Content Expansion & Simulation Quality

**Date:** 2026-05-10  
**Branch:** `vocab-import-pipeline`  
**Status:** Complete

## Summary

Expanded the FSP track with 30 new clinical cases, 30 new speaking prompts, and 46 new vocabulary items to fill specialty gaps. Updated the curriculum map with new concepts and units, fixed the teach-before-test validator to properly index FSP data, and adjusted validation scripts for new expected counts.

## Deliverables

### 1. New Clinical Cases (+30, now 130 total)
| IDs | Lessons | Topics |
|-----|---------|--------|
| fsp_c_101 - fsp_c_106 | 1-6 | Orientation, Strategy, Language Barriers, Exam Fear, SOCRATES Chest Pain, Abdominal Pain |
| fsp_c_107 - fsp_c_112 | 7-12 | OPQRST Back Pain, Knee Arthritis, Polymorbidity, Diabetes Onset, Polypharmacy Falls, Anaphylaxis |
| fsp_c_113 - fsp_c_118 | 13-18 | BRCA Risk, Work Injury, B-Symptoms, Thunderclap Headache, Cardiac Decompensation, Stroke FAST |
| fsp_c_119 - fsp_c_124 | 19-24 | Paediatric Fever, Depression, Asthma, Paediatric Dehydration, Post-Op Wound, Pre-Op Hernia |
| fsp_c_125 - fsp_c_130 | 25-30 | Chronic Pain Psychosomatic, UTI Elderly, Peanut Allergy, Skin Cancer, Tinnitus, Thyroid Nodule |

All new cases include the `requiredConcepts` field (first time this field exists in fspCases.json).

### 2. New Speaking Prompts (+30, now 80 total)
| IDs | Lessons | Topics |
|-----|---------|--------|
| fsp_s_051 - fsp_s_060 | 11-20 | Schwindel, Hypertension, Pre-Op Med Rec, Familial Cancer, COPD Social, B-Symptom ROS, Acute Asthma, Stroke Neuro, Child Vaccination, Suicide Crisis |
| fsp_s_061 - fsp_s_070 | 21-30 | GI History, Child Dehydration, Wound Care, Pre-Op Education, Chronic Pain Biopsychosocial, UTI Elderly, Allergy Emergency, Sun Protection, Ear FB, Thyroid Nodule |
| fsp_s_071 - fsp_s_080 | 31-40 | Acute Chest Pain, Geriatric Depression, Anticoagulation, Cancer Diagnosis, Alcohol Addiction, Heart Failure, Organ Donation, Angry Patient, Lung Nodule, Rehab Discharge |

### 3. New Vocabulary Items (+46, now 1,068 total)
- **Orthopedics (18):** joint replacement, orthopaedic equipment, surgical supplies
- **Neurology (12):** neurological exam, neuro conditions, diagnostic terms
- **Surgery (10):** surgical instruments, wound care, post-op terms
- **Dermatology (6):** skin lesions, dermatological descriptions

All with German example sentences and pronunciation guides.

### 4. Curriculum Map Updates
- **10 new FSP concepts** added for gap-filling (pmh.risk.factors, allergy.assessment, family.genetic.risk, ros.systematic, red.flags.urgent, social.mental.health, specific.allergic.emergency, specific.emergency.cardiac, specific.other.geriatric, specific.other.procedures)
- **30 new case units** added with proper linkedQuestionIds, requiredLessons, and requiredConcepts
- **30 new speaking units** added (replaced 30 empty pre-existing units)
- Removed 30 duplicate speaking units (pre-existing ones with no linkedQuestionIds)

### 5. Validator Fixes
- **validate-teach-before-test.cjs:** Now indexes FSP data items (fspCases, fspSpeaking, fspWriting, fspReading, fspListening) into the cross-reference lookup, eliminating false warnings for FSP linkedQuestionIds
- **validate-fsp-quality.cjs:** Updated expected counts from 100 to 130 cases and 50 to 80 speaking prompts

## Validation Results

| Validator | Status | Notes |
|-----------|--------|-------|
| validate-curriculum-map.cjs | ✅ Pass | 1,610 units, 1,578 concepts, 51 prerequisite edges |
| validate-teach-before-test.cjs | ✅ Pass | 5 pre-existing A1 warnings only |
| validate-fsp-quality.cjs | ✅ Pass | 24/24 checks (130 cases, 80 speaking, 1,068 vocab) |
| validate-lesson-completeness.cjs | ✅ Pass | 88 warnings (all pre-existing) |
| Lint (eslint) | ✅ Pass | 1 error in temp file (deleted), only pre-existing warnings |

## Git State
- **Branch:** `vocab-import-pipeline`
- **Files modified:**
  - `src/data/fspCases.json` — +30 cases
  - `src/data/fspSpeaking.json` — +30 prompts
  - `src/data/fspVocabulary.json` — +46 items
  - `src/data/curriculumMap.json` — +60 FSP units, +10 concepts, -30 dup units
  - `scripts/validate-teach-before-test.cjs` — FSP data indexing fix
  - `scripts/validate-fsp-quality.cjs` — expected counts updated
  - `docs/PHASE27_FSP_EXPANSION_PLAN.md` — updated
  - `docs/PHASE27_FSP_QUALITY_AUDIT.md` — updated
- **Cleanup:** All temp generation scripts and intermediate JSON files removed

## Lessons Learned
1. Write tool silently truncates at ~26KB — content generation must be split across small scripts
2. Compact helper functions (mkCase, mkSpeak, mkV) with abbreviated parameter names are essential for fitting content within limits
3. Always check for duplicate IDs before adding curriculum units — the existing file already had fsp_speak units for lessons 1-40
4. FSP concepts in curriculumMap must include `level` and `skill` fields or the validation script rejects them
