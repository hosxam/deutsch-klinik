# Phase 27: FSP Expansion Plan

**Date:** 2026-05-10
**Base:** Phase 26 audit + Phase 10 FSP infrastructure

---

## What We Have

```
100 FSP cases (all on lessons 31-40)
 50 FSP speaking prompts (all on lessons 1-10)
140 FSP writing prompts (all 40 lessons)
1022 FSP vocabulary entries (19 categories)
141 FSP anamnesis items
100 FSP presentations
100 FSP exams + grammar + listening + reading
```

## What We Need

### 1. Cases for Lessons 1-30 (20 additional)

Distribute cases across the lesson progression:

| Lessons | Module Theme | Cases Needed | Specialty Focus |
|---------|-------------|--------------|-----------------|
| 1-2 | Orientation | 2 | General intro scenarios |
| 3-4 | Rapport | 2 | Communication breakdown scenarios |
| 5-6 | Chief Complaint | 2 | Chest pain, abdominal pain triage |
| 7-8 | Pain History | 2 | Back pain, headache, neuropathic pain |
| 9-10 | PMH | 2 | Chronic disease management |
| 11-12 | Medications/Allergies | 2 | Polypharmacy, anaphylaxis history |
| 13-14 | Social/Family | 2 | Genetic risk, lifestyle counseling |
| 15-16 | ROS/Red Flags | 2 | Positive ROS, alarm symptom scenarios |
| 17-18 | Exam Language | 2 | Neuro exam, physical exam findings |
| 19-20 | Diagnostics | 2 | Test result discussion, imaging |

**Total: 20 new cases**
Starting ID: `fsp_c_101`

Each case will include: requiredConcepts, all existing schema fields, and be linked to the correct lesson via taughtInLessonId.

### 2. Speaking Prompts for Lessons 11-40 (30 additional)

| Lessons | Theme | Prompts | Focus |
|---------|-------|---------|-------|
| 11-14 | PMH/Social | 4 | History-taking, lifestyle counseling |
| 15-16 | ROS/Red Flags | 2 | Full ROS, recognizing urgency |
| 17-18 | Exam Language | 2 | Exam commands, findings description |
| 19-20 | Diagnostics | 2 | Explaining lab/imaging to patients |
| 21-22 | Diagnosis | 2 | Breaking diagnosis, uncertainty |
| 23-24 | Treatment | 2 | Treatment plan, lifestyle changes |
| 25-26 | Consent | 2 | Procedure consent, risk communication |
| 27-28 | Handover | 2 | ISBAR handover, case presentation |
| 29-30 | Arztbrief | 2 | Documenting orally (mock) |
| 31-36 | Case-based | 6 | Full interviews per specialty |
| 37-40 | Special populations | 4 | Pediatric, geriatric, psychiatric |

**Total: 30 new speaking prompts**
Starting ID: `fsp_s_051`

### 3. Targeted Vocabulary Addition (40-50 entries)

| Category | Count | Examples |
|----------|-------|----------|
| Orthopedic-specific | 8 | cast, prosthesis, orthosis, traction, range of motion |
| Neuro exam terms | 6 | reflex hammer, Babinski, Romberg, coordination |
| Surgical workflow | 8 | pre-op assessment, NPO, wound care, drain management |
| Medication safety | 6 | side effect, interaction, contraindication, titration |
| Patient-friendly equivalents | 10 | lay terms for: CT, MRI, biopsy, stent, catheter |
| Pediatric | 4 | growth chart, vaccination, developmental milestones |
| Geriatric | 4 | polypharmacy, living will, advance directive, care level |
| Emergency escalation | 4 | rapid response, code blue, ICU transfer, MET call |

**Total: ~50 new vocabulary entries**
Starting ID: `fsp_v_1023`

### 4. Case `requiredConcepts` Field

Add `requiredConcepts` to all existing 100 cases (field currently missing — added to all new cases).

This allows teach-before-test validation to verify that a case's concepts are taught in prior lessons.

### 5. Speaking `requiredConcepts` Polish

Existing 50 speaking prompts have a generic `requiredConcepts` (e.g. `["speaking.001"]`). Update them to reference real conceptIds from the curriculum map for meaningful validation.

### 6. Curriculum Map Updates

- Add 20 case units for new cases
- Update existing case units to reference correct lesson IDs
- Curriculum map already has units for 40 speaking prompts — no structural changes needed

### 7. Validator Updates

Add checks:
- Cases missing `requiredConcepts` field
- Speaking prompts missing proper `requiredConcepts` (not generic)
- Cases with invalid `taughtInLessonId`
- Duplicate IDs across all FSP data files

---

## Non-Goals

- No UI changes
- No new FSP data files or schemas
- No Supabase/Cloudflare AI changes
- No rewriting existing content
- No A1-C1 content changes
- No scraping copyrighted FSP exam material — all content is original

---

## Risk Assessment

**Low risk.** All changes are additions (new cases, speaking prompts, vocabulary) plus 2 missing fields added to existing data. Existing validation all passes. New content follows existing schemas exactly.
