# Phase 19B: Exam Unlock Audit

## Current `isExamUnlocked()` (store.js:816)

```js
export function isExamUnlocked(level, levelData) {
  if (!levelData) return false;
  const prog = state.levels[level];
  if (!prog) return false;

  const grammarDone = (prog.grammar && prog.grammar.length >= levelData.grammarUnits) || false;
  const vocabDone = (prog.vocab && prog.vocab.length >= levelData.vocabularyUnits) || false;
  const writingsDone = (state.writingCompleted[level] || []).length >= levelData.minWritingTasks;
  const speakingDone = (state.speakingCompleted[level] || []).length >= levelData.minSpeakingTasks;
  const listeningDone = (prog.listening || []).length >= levelData.minListeningTests;
  const readingDone = (prog.reading || []).length >= levelData.minReadingTests;

  const lessonsCompleted = getCompletedLessons(level).length;
  return grammarDone && vocabDone && lessonsCompleted >= 10 && writingsDone && speakingDone && listeningDone && readingDone;
}
```

### Data Sources Used

| Requirement | Data Source | Issues |
|---|---|---|
| Grammar | `prog.grammar.length >= grammarUnits` | Counts ALL items, not correct-only. `prog.grammar` is a list of grammar practice results, not mastery. |
| Vocabulary | `prog.vocab.length >= vocabularyUnits` | Counts ALL items, not mastered-only. Just viewing vocab counts. |
| Lessons | `getCompletedLessons(level).length >= 10` | Hardcoded `10` instead of reading from curriculum. Very weak for levels with 25+ lessons. |
| Writing | `writingCompleted[level].length >= minWritingTasks` | Counts completions regardless of passing score (>=8/10). |
| Speaking | `speakingCompleted[level].length >= minSpeakingTasks` | Same as writing - no score check. |
| Listening | `prog.listening.length >= minListeningTests` | Counts all attempts, not all-correct. |
| Reading | `prog.reading.length >= minReadingTests` | Same as listening - all attempts count. |
| Flashcards | Not checked separately | Rolled into vocab check which is too loose. |
| Mistakes/Review | Not checked | Not in current logic at all. |

### Missing Categories

1. **Grammar correctness** - Only counts attempts, not correct completions.
2. **Vocabulary mastery** - Should use `vocabularyMastery` mastered counts, not just `prog.vocab.length`.
3. **Reading all-correct** - Should verify `getPracticeItemStatus('reading', id).status === 'completed_correct'`.
4. **Listening all-correct** - Same as reading.
5. **Writing passing score** - Should check score >= 8/10, not just completion.
6. **Speaking passing score** - Same as writing.
7. **Due mistake count** - Should check unresolved due mistakes for the level.
8. **Lesson count from curriculum** - Should read from curriculumMap/levels.json or curriculum data.

### Stale/Hardcoded Numbers

- `lessonsCompleted >= 10` hardcoded in `isExamUnlocked()`. Should read from `levelData.lessonCount` or `getRequiredLessonCount(level)`.
- `levels.json` uses `grammarUnits: 10`, `vocabularyUnits: 10` for all levels -- these are too low for real unlock requirements.

### LevelPage Current Requirements (lines 51-59)

```js
const requirements = [
  { label: 'Grammar', current: prog.grammar?.length || 0, target: levelData?.grammarUnits || 10 },
  { label: 'Vocabulary', current: prog.vocab?.length || 0, target: levelData?.vocabularyUnits || 10 },
  { label: 'Lessons', current: completedLessons.length, target: 10 },
  { label: 'Writing', current: writingCompletedCount, target: levelData?.minWritingTasks || 10 },
  { label: 'Speaking', current: speakingCompletedCount, target: levelData?.minSpeakingTasks || 10 },
  { label: 'Listening', current: prog.listening?.length || 0, target: levelData?.minListeningTests || 5 },
  { label: 'Reading', current: prog.reading?.length || 0, target: levelData?.minReadingTests || 5 },
];
```

Same deficiencies as `isExamUnlocked()`.

### ExamPage Route Guard (ExamPage.jsx)

```js
const unlocked = levelData ? isExamUnlocked(levelId, levelData) : false;
```

Uses same weak logic. Also has its own duplicate `examRequirements` array (lines 30-37) matching the same categories.

### Dashboard

Need to check if Dashboard shows exam readiness.

### Levels.json Current Requirements

```json
A1: grammarUnits:10, vocabularyUnits:10, minWritingTasks:10, minSpeakingTasks:10, minListeningTests:5, minReadingTests:5
A2: same
B1: same
B2: same
C1: same
```

### Curriculum Map

Need to check actual lesson counts per level. The `levels.json` has no lesson count field currently.

## New Unlock Formula Requirements

### Requirements to add to levels.json

Add per level:
- `lessonCount`: number of required lessons (e.g., A1=25, A2=25, B1=25, B2=25, C1=25 -- verify from curriculum data)
- `vocabMasteredRequired`: number of vocab words to master (e.g., A1=803 from actual data)
- `grammarCorrectRequired`: number of grammar items to complete correctly
- `readingCorrectRequired`: number of reading items to complete all-correct
- `listeningCorrectRequired`: number of listening items to complete all-correct
- `writingScoreRequired`: minimum passing score (8/10)
- `speakingScoreRequired`: minimum passing score (8/10)
- Option: read from curriculum.json units

### Data Sources for New Checks

| Requirement | New Data Source |
|---|---|
| Lessons | `completedLessons[level].length >= levelData.lessonCount` |
| Grammar correct | Count grammar items where `getPracticeItemStatus('grammar', id).status === 'completed_correct'` >= `grammarCorrectRequired` |
| Vocabulary mastered | Count `vocabularyMastery` entries where `mastered === true` for level >= `vocabMasteredRequired` |
| Reading correct | Count `readingCompleted[level]` items with all-correct >= `readingCorrectRequired` |
| Listening correct | Count `listeningCompleted[level]` items with all-correct >= `listeningCorrectRequired` |
| Writing passed | Count `writingCompleted[level]` items with score >= 8/10 >= `minWritingTasks` |
| Speaking passed | Count `speakingCompleted[level]` items with score >= 8/10 >= `minSpeakingTasks` |
| Due mistakes | Count mistakes in `incorrectAnswers[level]` with `dueDate <= today` and not mastered: optionally require 0 |
| Reviews resolved | Choose rule: unresolved mistakes block OR do not block. Decision: document. |

### Decision on Mistake Blocking

**Chosen rule:** Having unresolved due mistakes should NOT block exam unlock, but the UI should show the count as optional info. Rationale: mistakes are part of the learning process and should not prevent exam progression. However, the requirement count should be visible so the learner knows about them.

### Files to Change

1. `src/data/levels.json` - Add lessonCount, vocabMasteredRequired, grammarCorrectRequired, readingCorrectRequired, listeningCorrectRequired
2. `src/utils/store.js` - Replace `isExamUnlocked()` with new `getLevelExamRequirements()`, `getLevelExamProgress()`, `isLevelExamUnlocked()`, `getMissingExamRequirements()`
3. `src/pages/LevelPage.jsx` - Use new helpers for exam readiness display
4. `src/pages/ExamPage.jsx` - Use new helpers for route guard + missing requirements display
5. `src/App.jsx` - Possibly update RouteGuard for ExamPage
6. `tests/` - New test file for exam unlock

### Tests Needed

- exam locked when lessons incomplete
- exam locked when grammar incomplete
- exam locked when reading incomplete
- exam locked when listening incomplete
- exam locked when writing incomplete
- exam locked when speaking incomplete
- exam locked when flashcard/vocab requirement incomplete
- exam unlocks only when all required categories complete
- direct exam route blocked when locked
- missing requirements list is accurate
- `getLevelExamRequirements()` returns correct default values
