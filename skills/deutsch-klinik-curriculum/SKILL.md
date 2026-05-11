# deutsch-klinik-curriculum

Curriculum structure, teach-before-test logic, and exam unlock validation.

## When to Use

Use this skill when:
- Adding or modifying lessons, concepts, or questions
- Changing teach-before-test filtering
- Modifying exam unlock requirements
- Debugging missing practice items or wrong content
- Investigating locked exams that should be unlocked
- Changing DailyMissionPage or PracticePage filtering logic

## Files to Inspect

- `src/utils/teachBeforeTest.js` — concept tracking, `hasCurriculumMap`, `getMasteredLessons`, `getAvailablePractice`
- `src/utils/curriculumProgress.js` — curriculum progress helpers
- `src/utils/practiceProgress.js` — per-item practice tracking, cooldowns
- `src/utils/dataLoaders.js` — loads curriculumMap, lessons, concepts
- `src/utils/adaptivePlan.js` — daily target calculation (uses curriculum progress)
- `src/pages/DailyMissionPage.jsx` — daily plan generation, skill filtering
- `src/pages/PracticeHubPage.jsx` — general practice pool
- `src/pages/FlashcardPage.jsx` — vocabulary SRS
- `src/pages/ListeningPage.jsx` — listening exercises
- `src/pages/ReadingPage.jsx` — reading exercises
- `src/pages/WritingPage.jsx` — writing prompts
- `src/pages/SpeakingPage.jsx` — speaking prompts
- `src/pages/GrammarPage.jsx` — grammar exercises
- `src/pages/VocabularyPage.jsx` — vocabulary browser
- `src/pages/MistakeNotebookPage.jsx` — mistake review
- `src/pages/ExamPage.jsx` — level exams
- `src/pages/LevelPage.jsx` — level overview
- `src/pages/Dashboard.jsx` — progress dashboard
- `scripts/validate-curriculum.js` — curriculum integrity checker
- `data/*.js` or `data/*.json` — curriculum data files

## Required Checks

### 1. Curriculum Map Integrity
- Every lesson ID in `curriculumMap` has matching data
- `requiredConcepts` for each lesson are non-empty
- `taughtConcepts` are a subset of known concepts
- `taughtInLessonId` references exist
- No orphan concepts (concepts not taught in any lesson)
- `linkedQuestionIds` reference existing questions

### 2. Teach-Before-Test
- Practice items are not available until the teaching lesson is mastered
- Concepts tagged as taught appear before they are tested
- `getAvailablePractice()` correctly filters based on mastered lessons only
- No full-back practice pool fallback exposes untaught content
- `hasCurriculumMap()` returns correct boolean for each level

### 3. Exam Unlock
- Exam requirements match curriculum progress
- No exam unlocks before all prerequisite lessons are mastered
- Missing requirements correctly reported by `getMissingExamRequirements()`
- No infinite unlock loops

### 4. Daily Mission
- Plan generation respects curriculum progress (does not assign untaught items)
- Plan selects from available (taught) content only
- Topic grouping uses correct lesson IDs from curriculum

## Commands to Run

```bash
cd deutsch-klinik
node scripts/validate-curriculum.js
node scripts/check-fsp-quality.mjs
npm test        # particularly daily-plan-integration.test.js, exam-unlock.test.js
npm run build
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|------|
| Missing practice items | `hasCurriculumMap` returns false for the level | Check teachBeforeTest.js initialization |
| Wrong items in daily plan | Topic grouping fetches wrong lesson IDs | Verify `sesh.planLessonIds` contains correct IDs |
| Exam locked despite progress | Curriculum map gap, concept not marked as taught | Update `taughtInLessonId` in curriculum data |
| Validation errors | Curriculum map references missing data | Fix references in curriculum data files |
| Full-bank fallback active | Curriculum map not loaded or empty | Check dataLoader.js curriculum loading |
| Plan generates 0 items for a skill | No available content matching filters | Check teach-before-test filtering, topic matching |

## Final Report Format

```
## Curriculum Audit

| Check | Status |
|-------|--------|
| Curriculum map integrity | PASS/FAIL |
| Teach-before-test filtering | PASS/FAIL |
| Exam unlock logic | PASS/FAIL |
| Daily plan content selection | PASS/FAIL |
| Validator scripts | PASS/FAIL |

## Issues Found
- [curriculum gaps, orphan concepts, wrong links]

## Recommendations
- [fixes or improvements]
```