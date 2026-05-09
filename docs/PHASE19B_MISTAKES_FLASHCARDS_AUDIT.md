# Phase 19B: Mistakes-as-Flashcards Audit

## Current Mistake Storage

### State Shape (store.js defaults)

```js
incorrectAnswers: {},   // { A1: [ { exerciseId, userAnswer, correctAnswer, topic, date } ] }
repeatedMistakes: {},   // { 'A1_gr_1': { topic, count, lastDate, level } }
mistakeNotebook: {},    // { mistakeId: { topic, userAnswer, correctAnswer, level, date, repeated } }
```

### Mistake Types and Card Generation

Mistakes come from:
- **Grammar practice**: `recordAnswer()` called with question/answer when wrong
- **Reading practice**: Mistakes tracked similarly
- **Listening practice**: Same pattern
- **Writing/Speaking**: Scored items with incorrect answers
- **Exam**: Exam-level mistakes

### Current Mistake Notebook UI (MistakeNotebookPage.jsx)

**Tabs:**
- Mistakes tab (primary) - shows all mistake cards
- Weak Topics tab (separate from mistakes)

**Review system - already has both:**
1. PRIMARY: Flashcard-style SM-2 rating buttons (Again/Hard/Good/Easy) - calls `recordVocabAnswer()`
2. SECONDARY: Typed-answer retry with input field + Check button + result display

State variables for typed-answer:
- `retryAnswers` - `{ 'A1_0': 'typed answer', ... }`
- `retryResults` - `{ 'A1_0': true/false, ... }`
- `retryCorrectCount` - counter
- `expandedMistake` - which card is expanded

**Key issue:** Expanded mistake uses `level + '_' + idx` as key. When items shift (remove/master), stale retry state leaks.

### How Mistakes Currently Use SRS

The existing SM-2 rating buttons (Again/Hard/Good/Easy) in MistakeNotebookPage already call `recordVocabAnswer()`, which is the shared SRS scheduler. However:

1. They create a synthetic ID: `mistake_${level}_${mistake.exerciseId}`
2. This gets stored in `vocabularyMastery[mistakeId]` alongside regular vocab words
3. The same due-date and queue logic applies

**Problem:** The ID prefix `mistake_` conflicts with regular vocab IDs in some queue filters. Mistake cards might not properly appear in Today's Plan because `getVocabQueue()` filters by vocab word IDs from the vocabulary data, not by stored `vocabularyMastery` entries.

### Current Mistake SM-2 Flow

1. User clicks Again: `recordVocabAnswer(mistakeId, 1, meta)`
2. `recordVocabAnswer` calls `getSrsSchedule(1)` which computes: interval=0.01 (relearning), due=today, ease=2.5-0.2=2.3
3. Word stored in `vocabularyMastery[mistakeId]` with SM-2 fields
4. Same for Hard (2), Good (3), Easy (4)

### How `recordVocabAnswer` works (store.js:440)

```js
export function recordVocabAnswer(wordId, rating, meta = {}) {
  // rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  // Calls getSrsSchedule(rating) to compute interval/due/ease
  // Stores/updates in vocabularyMastery[wordId]
  // Also updates topicWeakness if meta.topic provided
}
```

`getSrsSchedule(rating)` still exists as a separate function, not yet shared as a unified module.

### DailyMissionPage Today's Plan

The DailyMissionPage has a "Remediation Queue" section. Need to check if it shows mistake review cards from `vocabularyMastery` with the `mistake_` prefix.

### FlashcardPage Queue Logic

`getVocabQueue()` in store.js generates the queue of due vocab words. It:
1. Gets `vocabularyMastery` entries
2. Filters by `m.due <= today`
3. Sorts by due date ascending
4. Returns limited entries

Mistake entries (`mistake_` prefix) would appear in this queue if they have `due <= today`. This is good -- they should appear alongside regular vocab flashcards.

### Problems to Fix

1. **Remove typed-answer logic entirely** from MistakeNotebookPage:
   - Remove `retryAnswers` state
   - Remove `retryResults` state  
   - Remove `retryCorrectCount` counter
   - Remove input field + Check button + result display
   - Remove stale answer cleanup code

2. **Keep flashcard-style review as the ONLY review method**:
   - Keep SM-2 rating buttons (Again/Hard/Good/Easy)
   - Keep Reveal answer display (show correctAnswer)
   - Keep Mark as Mastered
   - Keep Remove
   - Add a proper "Reveal" toggle so user sees front first, then reveals back

3. **Add reveal/hide toggle** to mimic flashcard behavior:
   - Show only the question/prompt initially
   - "Reveal answer" button to show the answer
   - Then enable rating buttons

4. **Ensure mistake cards appear in Today's Plan**:
   - `getVocabQueue()` already picks up `vocabularyMastery` entries with `due <= today`
   - Need to verify `mistake_` prefixed entries are included
   - Add filtering for mistake entries specifically in DailyMissionPage

5. **Add migration for old mistake data**:
   - Old `incorrectAnswers` entries may lack `due` date fields
   - Old `mistakeNotebook` entries may have old format
   - Add normalize step to add SM-2 fields (due=today, ease=2.5, interval=0, repetitions=0, lapses=0)
   - Deduplicate by exerciseId

### Shared SRS Function Decision

Currently SRS functions are in `store.js`:
- `getSrsSchedule(rating)` - computes SM-2 intervals
- `recordVocabAnswer(wordId, rating, meta)` - stores + schedules
- `rateVocabWord(wordId, rating)` - wrapper
- `getVocabQueue()` - builds queue from vocabularyMastery

**Decision:** Use existing `recordVocabAnswer()` and `getSrsSchedule()` as the shared functions. No need to extract a separate module -- just ensure MistakeNotebookPage and FlashcardPage both use the same functions.

### Files to Change

1. `src/pages/MistakeNotebookPage.jsx` - Remove typed-answer, clean up flashcard review UI, add reveal toggle
2. `src/utils/store.js` - Add mistake migration, ensure `getVocabQueue` includes mistake entries, add `getDueMistakes()` helper
3. `src/pages/DailyMissionPage.jsx` - Include due mistake cards in Today's Plan remediation/review section
4. `src/pages/FlashcardPage.jsx` - Ensure no typed-answer remnants
5. `src/utils/practiceProgress.js` - Check for stale mistake tracking functions
6. `tests/` - New test file for mistake notebook as flashcards

### Tests Needed

- Mistake Notebook does not show text input/check-answer flow
- Mistake card shows Reveal / Again / Hard / Good / Easy
- Good schedules mistake into future
- Easy schedules farther than Good
- Again schedules soon
- Mark as Mastered removes from active review
- Remove hides/deletes the card
- Reviewing one mistake does not leak answer into the next
- Due mistake appears in Today's Plan
- Not-due mistake does not appear in Today's Plan
- Mastered mistake does not appear in Today's Plan
- Old typed-answer mistake data migrates safely
