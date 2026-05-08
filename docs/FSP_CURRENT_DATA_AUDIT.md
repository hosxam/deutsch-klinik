# FSP Current Data Audit

## Overview
Existing FSP infrastructure was built as an MVP. It has structure and content but lacks curriculumMap integration, prerequisite tracking, and structured lesson progression.

## FSP Data Files

| File | Items | Schema Quality | Missing |
|------|-------|---------------|---------|
| `fspAnamnese.json` | 100 | Good - has id, category, doctorQuestion, simpleEnglish, patientPossibleAnswer, followUpQuestions, notes, tags | No conceptId, no lesson link, no prerequisites |
| `fspCases.json` | 100 | Excellent - has patientRole, doctorTasks, mustAsk, redFlags, usefulPhrases, doctorToDoctorSummary, scoringRubric | No conceptId, no lesson link, no prerequisites |
| `fspExams.json` | 10 | Excellent - full 3-part exam with patient conversation, documentation, doctor-doctor handover, rubric | No conceptId, no lesson link, no prerequisites |
| `fspGrammar.json` | 100 | Good - has id, topic, question, options, answer, explanation | No conceptId, no difficulty, no taughtInLessonId, no lesson link |
| `fspListening.json` | 100 | Good - has script, questions, answers, vocabularyFocus, tags, type | No conceptId, no prerequisite, no taughtInLessonId |
| `fspPresentations.json` | 100 | Good - has rawPatientInfo, task, expectedPresentationOrder, modelPresentation, rubric, commonMistakes | No conceptId, no prerequisite |
| `fspReading.json` | 100 | Good - has text, questions, answers, vocabularyFocus, tags, type | No conceptId, no prerequisite, no taughtInLessonId |
| `fspVocabulary.json` | 100 | Good - has word, article, plural, translation, layExplanation, example, patientFriendlyPhrase, doctorToDoctorPhrase, category, tags | No conceptId, no taughtInLessonId, no prerequisite |
| `fspWriting.json` | 100 | Good - has task, patientData, history, examFindings, diagnostics, assessment, treatment, expectedStructure, modelAnswer, usefulPhrases | Only 50/100 have rubric, no conceptId, no prerequisite |

**Total:** 810 items across 9 files.

## Key Gaps

### 1. No curriculumMap Integration
- Zero FSP entries in `curriculumMap.json`
- No `level: "FSP"` entries exist
- No `conceptId` fields in any FSP data file
- No `taughtInLessonId` fields
- No `requiredConcepts` or `prerequisiteConceptIds`

### 2. No Lesson Structure
- No `fspLessons.json` file exists
- No lesson progression from simple to complex
- No module structure (anamnesis, diagnostics, treatment, etc.)
- No estimated minutes per lesson

### 3. No Prerequisites
- No B2/C1 prerequisite mapping
- No concept dependencies tracked
- No requiredLessons in curriculumMap
- No prerequisiteConceptIds in any item

### 4. Missing Writing Rubrics
- Only 50/100 writing items have a rubric
- The other 50 have no scoring criteria

### 5. Speaking Coverage Exists Only Through Cases
- No standalone `fspSpeaking.json` file
- Speaking is embedded in cases as doctorTasks
- No rubric for spoken interaction specifically
- No pronunciation or fluency criteria

### 6. No Vocabulary Theme Organization
- Only 15 unique tags across 100 vocabulary items
- No system-by-system breakdown (cardiology, pulmonology, etc.)
- No body system mapping
- No distinction between patient-facing vs doctor-facing vocabulary

### 7. Grammar Items Lack Medical Context
- Grammar items are general medical German
- No link to specific FSP modules or lessons
- No difficulty levels
- No `skillType` field (reading, writing, speaking)

### 8. No Reading/Writing Type Structure
- Reading has types (Arztbrief excerpt, lab report, etc.) but no progression
- Writing has no clear type categorization (Arztbrief, outpatient note, referral)

### 9. FSP Pages Are Standalone
- MedicalFSPHubPage is the entry point
- All FSP pages (vocab, grammar, reading, etc.) render data directly
- No lesson navigation, no structured learning path
- No progress tracking for FSP modules

### 10. No Case Categorization
- Cases have `setting` field (e.g., "emergency") but no module link
- No required skills listed per case
- No prerequisite case IDs

## Existing Strengths to Preserve
- **fspCases.json** has excellent structure (patientRole, doctorTasks, mustAsk, redFlags, scoringRubric, doctorToDoctorSummary)
- **fspExams.json** has full 3-part FSP exam format (patient conversation + documentation + doctor-doctor handover)
- **fspVocabulary.json** has patient-friendly and doctor-to-doctor phrases per term
- **fspPresentations.json** has model presentations with rubrics
- **fspWriting.json** has model answers and expected structure
- **fspAnamnese.json** covers all anamnesis categories (greeting, current complaint, past history, medications, allergies, family, social, systems, pain, red flags)
- Items already have English translations and explanations

## Recommendation
Build FSP curriculumMap units and fspLessons.json to tie existing content into a structured learning path. Add conceptId/taughtInLessonId fields to existing data. Create lesson progression from basic (orientation, anamnesis) to advanced (full simulation). Add missing rubrics and prerequisite chains.
