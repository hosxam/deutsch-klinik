# Mistake Flashcard Context Audit

## Root Cause: Why mistake cards show only isolated answers

The `recordAnswer()` function in `src/utils/store.js` stores mistakes with only these fields:

```
{ exerciseId, userAnswer, correctAnswer, topic, skill, date }
```

It does **not** save:
- The original question/prompt/sentence
- The exercise type (fill-blank, mcq, article-select, etc.)
- Source options
- Explanation
- Full corrected sentence

When the Mistake Notebook renders these as flashcards, the front shows `mistake.question` or `mistake.prompt` — but **those fields never existed in the stored object**. So the card falls back to just showing the skeleton, and only `userAnswer` / `correctAnswer` have data.

## Where Mistakes Are Created

| Source File | Function Call | Context Available (Not Saved) |
|---|---|---|
| `GrammarPage.jsx:212` | `recordAnswer(levelId, ex.id, ans, ex.answer, ex.topic, correct, 'grammar')` | `ex.prompt`, `ex.options`, `ex.explanation`, `ex.type`, `ex.sentence` |
| `ReadingPage.jsx:62` | `recordAnswer(levelId, readingId, answers[q.id], q.answer, 'reading', false, 'reading')` | `q.question` (the reading question text), reading title |
| `ListeningPage.jsx:289` | `recordAnswer(levelId, ex.id+'_'+q.id, answers[q.id], q.answer, ex.title, false, 'listening')` | `q.question`, `ex.title`, `q.options` |
| `WritingPage.jsx:68-76` | `recordAnswer(levelId, prompt.id+'_mistake_'+i, m.original, m.corrected, prompt.title, false, 'writing')` | `prompt.title`, `prompt.description` |
| `SpeakingPage.jsx:76-84` | `recordAnswer(levelId, prompt.id, transcript, aiResult.correctedTranscript, prompt.title, false, 'speaking')` | `prompt.title`, `prompt.situation` |
| `DailyMissionPage.jsx:643` | `recordAnswer(lvl, ex.id, ans, ex.answer, ex.topic, correct, 'grammar')` | Same as GrammarPage |
| `DailyMissionPage.jsx:1016` | `recordAnswer(lvl, item.id, wtText, '', item.title, false, 'writing')` | `item.title`, `item.description` |
| `DailyMissionPage.jsx:1139` | `recordAnswer(lvl, item.id, spText, '', item.title, false, 'speaking')` | Same as SpeakingPage |
| `DailyMissionPage.jsx:2309` | `recordAnswer(lvl, mistakeId, '[flashcard]', word, 'Vocabulary', false, 'vocab')` | Vocab word itself |

## Where Mistake Cards Are Rendered

| Component | How Front/Back is Built |
|---|---|
| `MistakeNotebookPage.jsx` (review mode, ~line 227) | Shows `mistake.question || mistake.prompt || 'Mistake review'` — these fields are NEVER saved by `recordAnswer()`, so falls back to placeholder |
| `MistakeNotebookPage.jsx` (browse mode, ~line 335) | Same logic: `mistake.question || mistake.prompt || 'Question'` |
| `FlashcardPage.jsx` | Does NOT render mistake cards — only vocab SRS cards (vocabularyMastery entries not prefixed with `mistake_`) |
| `DailyMissionPage.jsx` (~line 2299) | Renders vocab flashcard review, not mistake cards directly |

## What Fields Are Currently Saved

`recordAnswer()` saves to `state.incorrectAnswers[level]`:
```
{ exerciseId, userAnswer, correctAnswer, topic, skill, date }
```

And to `state.mistakeNotebook[notebookId]`:
```
{ exerciseId, topic, userAnswer, correctAnswer, level, skill, date, repeated }
```

The SM-2 entry in `vocabularyMastery` (keyed as `mistake_{level}_{exerciseId}`):
```
{ correct, incorrect, repetitions, interval, ease, due, mastered, mistakeTopic, mistakeSkill }
```

## What Fields Are Missing

- `sourcePrompt` — the original fill-in-blank sentence or question prompt
- `sourceQuestion` — for mcq questions
- `sourceOptions` — the list of options for mcq/article-select
- `sourceSentence` — the full sentence context
- `sourceType` — exercise type (fill-blank, mcq, article-select, etc.)
- `explanation` — why the correct answer is correct
- `correctedSentence` — the full corrected sentence (for fill-in-blank)
- `sourceItemId` — original source item reference
- `sourceSkill` — the skill domain

## Why This Causes "die/der/das/einen" Cards

When a grammar exercise like `___ Hund ist braun.` (answer: `Der`) is answered wrong:
1. `recordAnswer()` saves `{ userAnswer: "Die", correctAnswer: "Der", topic: "Articles", ... }`
2. The `prompt` (`___ Hund ist braun.`) is **never saved**
3. The Mistake Notebook tries `mistake.question || mistake.prompt || 'Mistake review'`
4. Since neither `question` nor `prompt` exist in the stored object, it falls back
5. The user sees only `"User answer: Die"` / `"Correct: Der"` with no context

## Files to Change

1. **`src/utils/store.js`** — `recordAnswer()` function: add optional context fields to the stored object
2. **`src/pages/GrammarPage.jsx`** — pass context (prompt, options, explanation, type) to `recordAnswer()`
3. **`src/pages/ReadingPage.jsx`** — pass question text, reading title to `recordAnswer()`
4. **`src/pages/ListeningPage.jsx`** — pass question text, listening title to `recordAnswer()`
5. **`src/pages/WritingPage.jsx`** — pass prompt description to `recordAnswer()`
6. **`src/pages/SpeakingPage.jsx`** — pass prompt situation to `recordAnswer()`
7. **`src/pages/DailyMissionPage.jsx`** — pass exercise context in all `recordAnswer()` calls
8. **`src/pages/MistakeNotebookPage.jsx`** — use new context fields for front/back rendering

## Sync/Backward Compatibility Risks

- **Low risk**: new fields are additive. Old stored mistake objects won't have `sourcePrompt` etc.
- Components must gracefully fall back when context fields are missing (show "Context missing for this older mistake.")
- No localStorage keys renamed, no schema changes needed
- Supabase payload will auto-include new fields on next upload (merging via existing `mergeState`)
- Existing cloud/local data will hydrate without crashing — extra fields are just ignored by old code
- SM-2 scheduling, mastery tracking, and exam unlock calculations are completely unchanged

## Plan

1. Update `recordAnswer()` in store.js to accept and persist an optional `context` object
2. Update all callers (GrammarPage, ReadingPage, ListeningPage, WritingPage, SpeakingPage, DailyMissionPage) to pass context
3. Create a shared `buildMistakeCard()` helper for consistent card rendering
4. Update MistakeNotebookPage to use the helper and render context-rich cards
5. Add tests
6. Build, lint, test, deploy
