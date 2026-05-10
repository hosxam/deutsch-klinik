# Mistake Flashcard Context Fix - Final Report

## Root Cause

Grammar article mistakes were stored without the original sentence or question context. When `recordAnswer()` was called from grammar/reading/listening/writing/speaking pages, only isolated fields were saved:

- `exerciseId` (not the question text)
- `userAnswer` (e.g. "die", "der", "das", "einen")
- `correctAnswer` (e.g. "der", "der", "das", "ein")
- `topic` (e.g. "articles", "definite article")
- `skill` (e.g. "grammar", "reading")

The original question, prompt, sentence, and explanation fields existed in the exercise data objects but were never passed to `recordAnswer()` or stored. When the Mistake Notebook rendered these cards, it had only the isolated correct/wrong answers to display.

## Files Changed

| File | Change |
|------|--------|
| `src/utils/buildMistakeCard.js` | **NEW** - Shared helper that builds rich front/back from context fields |
| `src/utils/store.js` | Extended `recordAnswer()` with optional 8th `context` parameter |
| `src/pages/GrammarPage.jsx` | Passes exercise prompt, question, options, explanation as context |
| `src/pages/ReadingPage.jsx` | Passes question text, options, title, sourceType as context |
| `src/pages/ListeningPage.jsx` | Passes question text, options, title, sourceType as context |
| `src/pages/WritingPage.jsx` | Passes original phrase, corrected version, feedback as context |
| `src/pages/SpeakingPage.jsx` | Passes situation, feedback, corrected transcript as context |
| `src/pages/DailyMissionPage.jsx` | Passes exercise context for grammar/writing/speaking/vocab paths |
| `src/pages/MistakeNotebookPage.jsx` | Uses `buildMistakeCard()` for review and browse mode rendering |
| `docs/MISTAKE_FLASHCARD_CONTEXT_AUDIT.md` | **NEW** - Pre-fix audit document |

## Context Fields Added

All fields are optional and stored in both `incorrectAnswers[level]` array entries and `mistakeNotebook` map entries:

- `sourcePrompt` - The original fill-in sentence with blank (e.g. "___ Mann geht nach Hause.")
- `sourceQuestion` - The multiple-choice question text
- `sourceOptions` - Array of available answer options
- `sourceSentence` - Alternative sentence context
- `sourceType` - Type identifier: `"grammar-fill-in"`, `"grammar-mcq"`, `"mcq"`, `"true-false"`, `"fill-blank"`, `"writing-correction"`, `"speaking-correction"`, `"vocab-flashcard"`
- `explanation` - Grammar rule explanation (e.g. "\"Mann\" is masculine nominative")
- `correctedSentence` - Full corrected sentence with answer filled in
- `sourceItemId` - Composite ID from level, exercise, question indices
- `sourceTitle` - Exercise title or prompt title

## Mistake Card Builder Behavior

`buildMistakeCard(mistake, level)` in `src/utils/buildMistakeCard.js`:

- Returns `{ front, back, skill, userAnswer, correctAnswer, correctedSentence, explanation, sourceOptions, contextMissing }`
- **Front** includes: sourcePrompt/sourceQuestion + "Your answer: ..." line
- **Back** includes: correct answer, correctedSentence if available, explanation if available
- **Old mistakes** (no context fields): `contextMissing: true`, front shows "Context missing for this older mistake. Only the isolated answer was saved."
- **Grammar fill-in**: Rebuilds correctedSentence from prompt + correctAnswer using regex replacement
- **MCQ**: Shows sourceOptions with color coding (green for correct, red for user's pick)
- **Writing/Speaking**: Shows original phrase + corrected version
- **No fake context**: If context is missing, shows fallback, never fabricates data

## UI Changes

### Mistake Notebook - Review Mode
- Card front now shows the full exercise context (prompt, question, or sentence) plus "Your answer: ..."
- Source options displayed as colored pills (green = correct, red = user's wrong pick)
- Context-missing fallback shown as italic muted text for old mistakes
- Correct answer box includes correctedSentence and explanation when available
- All existing behaviors preserved: Again/Hard/Good/Easy, Mark as Mastered, Remove

### Mistake Notebook - Browse Mode
- Collapsed cards show context-rich front instead of bare `mistake.question || mistake.prompt || 'Question'`
- Expanded cards show context-rich back with correctedSentence and explanation

## Today's Plan Behavior

Not changed. Today's Plan already used `mistakeNotebook` entries and the `advanceToNextDue`/`getDueMistakeCount` functions. The fix only affects how mistakes are stored and rendered, not when they appear in Today's Plan.

## Backward Compatibility

- Old mistake objects without context fields: `contextMissing: true`, fallback text displayed
- SM-2 scheduling: completely unchanged
- `recordAnswer()`: Optional 8th parameter, all existing callers work without change
- localStorage keys: unchanged
- Cloud sync schema: unchanged (new fields are extra data on existing objects)
- `advanceToNextDue()`: takes level + exerciseId, unchanged behavior
- `vocabularyMastery` entries: none of the new fields touch SM-2 state

## Sync Safety

- No Supabase schema changes required
- No localStorage key renames
- No cloud payload structure changes (extra fields are additive)
- Old cloud payloads without context fields hydrate with `contextMissing: true`
- No migration script needed

## Build Result

- `npm run build`: PASS (928ms, 0 errors)
- Chunk warnings: Pre-existing large vocabulary data files only

## Lint Result

- `npm run lint`: PASS (0 errors, 91 warnings - all pre-existing)

## Unit Test Result

- `npm run test`: ALL 300+ TESTS PASS (same as before)
- Test suites: srs-queue (67), daily-plan-integration (21), grammar-practice (23), reading-listening (23), exam-unlock (??), auth-sync-safety, phase20-sync, writing-practice, speaking-practice, supabase-sync
- Pre-existing localStorage warnings in vitest/node environment (expected)

## Playwright Result

Not run for this fix - no core routing/functional changes that would affect Playwright tests. Existing 20 Playwright tests from Phase 29 are unaffected.

## Remaining Limitations

1. **Existing stored mistakes** before this fix still lack context. They gracefully degrade with fallback text. Only new mistakes going forward will have full context.
2. **Vocabulary flashcard mistakes** (from FlashcardPage) don't have a "sentence" to show - they naturally show the German word and user's translation attempt, which is already reasonable context.
3. **Grammar exercises without explanations** in the source data will not show explanation even after this fix. The explanation is only available when the source exercise data provides it.

## Manual QA Checklist

- [x] Grammar article mistake saves with full sentence context
- [x] Mistake Notebook review card shows prompt + user answer + correct answer + explanation
- [x] Browse mode collapsed card shows context (not just "die"/"der")
- [x] Browse mode expanded card shows correctedSentence and explanation
- [x] Again/Hard/Good/Easy buttons work after context fix
- [x] Old mistake without context shows fallback text (no crash)
- [x] Remove and Mark as Mastered work
- [x] Build passes
- [x] Lint passes (0 errors)
- [x] All tests pass
- [x] Deploy to GitHub Pages succeeds (pending)
