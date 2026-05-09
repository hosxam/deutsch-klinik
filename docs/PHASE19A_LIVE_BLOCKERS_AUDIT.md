# Phase 19A: Live Blockers Audit

## Bug 1: Reading Back Crash (LevelPage render crash)

**Reproduction:**
1. Go to Reading Practice for any level.
2. Click Back (in-app link to `/level/:levelId`).
3. Error: `(n.weakAreas || []).filter is not a function`

**Affected files:**
- `src/pages/LevelPage.jsx` (lines 218, 224)
- `src/utils/store.js` (line 54 — default state)

**Root cause:**
`state.weakAreas` defaults to an **object**:
```js
weakAreas: {
  A1: { grammar: false, vocab: false, reading: false, ... },
  ...
}
```
But LevelPage (line 218) treats it as an **array**:
```js
(state.weakAreas || []).filter(w => w.level === levelId || !w.level)
```
Since an object is truthy, `|| []` doesn't trigger, and `.filter()` throws `is not a function`.

The default object was always like this (since Phase 17), and nothing in the codebase ever sets `state.weakAreas` to an array. This crash has always been a latent bug — it manifests on Back navigation because LevelPage re-renders and hits this code path with fresh state.

**localStorage key:** `deutsch-klinik-progress` → `state.weakAreas`

**Fix needed:**
- Normalize `weakAreas` to `[]` in store.js default state.
- Or add a getter function `getWeakAreas()` that always returns an array.
- Or guard LevelPage with `Array.isArray(state.weakAreas)` before `.filter()`.
- Best: change default to `[]` and normalize in `loadState` migration for any corrupted old data.

**Tests needed:**
- weakAreas as array works (filter doesn't crash)
- weakAreas missing/undefined works
- weakAreas null works
- weakAreas as object/string does NOT crash (normalized safely)
- Reading Practice → Back → LevelPage renders without error
- Listening Practice → Back → same

---

## Bug 2: Mistake Notebook Stale Typed Answer Leak

**Reproduction:**
1. Open Mistake Notebook.
2. Type and check answer for one mistake (e.g., says "Correct this time!").
3. Mark that mistake as Mastered.
4. The next mistake now appears with the previous correct answer text. User cannot edit.

**Affected files:**
- `src/pages/MistakeNotebookPage.jsx`
- `src/utils/store.js`

**Root cause 1 — key collision after removal:**
- Each mistake gets key `{level}_{idx}` (e.g., `A1_3`).
- When `markMistakeMasteredById` removes a mistake from the array, indices shift.
- After re-render, `A1_3` now points to a different mistake, but `retryAnswers` state still has `{A1_3: "previous answer"}`.
- The input reads `retryAnswers[key] || ''` and shows the stale text.

**Root cause 2 — no reset on mistake switch:**
- `expandedMistake` is a single string key — only one mistake can be expanded at a time.
- Switching the expanded mistake does NOT clear `retryAnswers` or `retryResults`.
- Newly expanded mistake inherits the previous mistake's answer state.

**Fix needed:**
Preferred: Remove the fragile typed-answer system from the main mistake review flow.
Replace with flashcard-style SM-2 buttons (Again/Hard/Good/Easy).
Typed mode can be kept as optional second system if desired, but must:
- Key input state by unique mistake ID (not level_idx).
- Reset input state when expanded mistake changes.
- Not affect the primary review system.

**Tests needed:**
- Reviewing one mistake does not leak answer into next mistake.
- Mistake card shows Again/Hard/Good/Easy buttons.
- Good schedules into future.
- Easy schedules farther than Good.
- Again schedules soon.
- Mark as Mastered removes from active review.
- Mistake card appears in Today's Plan only when due.

---

## Bug 3: Practice Flashcards Repeat Easy Cards Immediately

**Reproduction:**
1. Open Flashcards from Practice → New Session.
2. Rate all cards Easy (4).
3. Click New Session.
4. Same cards appear again.

**Affected files:**
- `src/pages/FlashcardPage.jsx` (buildFlashcardQueue function, lines 141-245)

**Root cause:**
`buildFlashcardQueue` checks `m.due <= today` for the **word's mastery entry** (`${w._level}_${w.id}`), but generates **multiple card types** (meaning, article, plural) from each word. The check is per-word, not per-card-type.

However, the main bug is simpler: `buildFlashcardQueue` uses a `getLocalDateKey()` comparison for due date. If `recordVocabAnswer` (called when rating Easy) sets the due date correctly, the card should be filtered out. The issue might be that `recordVocabAnswer` updates `state.vocabularyMastery[id]` but `buildFlashcardQueue` reads from `state.vocabularyMastery` which is a reference to the singleton state — it should see the updated due dates.

Let me check: does `buildFlashcardQueue` re-read state fresh each call?

Looking at line 143: `const state = getState();` — yes, it reads fresh state. So if `recordVocabAnswer` was called before, the state should have the updated due dates.

The deeper issue: When the user clicks "New Session" WITHOUT navigating away, the `buildFlashcardQueue` function constructs cards from `searchedWords` (React state) and checks mastery. If the mastery `due` is correctly set to a future date, those cards should be excluded.

Possible underlying issues:
1. `recordVocabAnswer` may not be setting the due date correctly for rating 4 (Easy)
2. The `buildFlashcardQueue` may not be reading fresh state (cached `searchedWords`)
3. The `useMemo` for `searchedWords` might be stale

Looking at line 277: `const cards = buildFlashcardQueue(searchedWords, size);` — this is called inside `buildSession`, a regular function, so it reads fresh `getState()`. The `searchedWords` comes from `useMemo` which depends on `sourceWords` and `search`/`medicalOnly` — these don't change between sessions, so `searchedWords` is STALE. It still includes the just-reviewed words.

The key issue: `buildFlashcardQueue` receives the FULL word list and filters internally. But the word list (from `searchedWords`) hasn't changed because it's memoized. The function does re-read `getState()` though, which should have the updated due dates. So if due dates are correct, the filter should work.

Let me check `recordVocabAnswer` for rating 4:

```js
// Easy: 1.3x bonus on top of SM-2
if (mastery.repetitions === 0) {
  mastery.interval = 3;
} else if (mastery.repetitions === 1) {
  mastery.interval = Math.round(6 * 1.3); // = 8
} else {
  mastery.interval = Math.round(mastery.interval * mastery.ease * 1.3);
}
mastery.repetitions += 1;
mastery.ease = Math.min(3.0, mastery.ease + 0.3);
// Calculate due date
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + mastery.interval);
mastery.due = getLocalDateKeyFromDate(dueDate);
```

So for first review with rating 4 (Easy), interval=3, due=3 days from now. Today's cards with `due > today` should be excluded by `!m.mastered || m.due <= today`.

Wait — looking at the condition in `buildFlashcardQueue` line ~153:
```js
} else if (!m.mastered || m.due <= today) {
  qDue.push(w);
}
```

For a card rated Easy the first time: `m.mastered = false` (requires 5 correct and ease >= 2.5), `m.due = "2026-05-12"` (3 days from now), `today = "2026-05-09"`. So `!m.mastered` is `true`, and `m.due <= today` is `false`. The OR `!m.mastered || false` = `true`. **SO IT INCLUDES IT!**

That's the bug. The condition should be `m.due <= today` OR `!m.mastered` but combined with `AND`. It should be: only include if NOT mastered AND due, OR not yet reviewed.

Looking at `getVocabQueue` (line 557-580):
```js
} else if (m.due <= today && !m.mastered) {
  dueReviews.push(id);
} else {
  dueReviews.push(id); // <-- CATCH-ALL: everything else!
}
```

Wait, `getVocabQueue` also has a catch-all bug — anything that doesn't match the first 3 conditions falls to `else` which pushes to `dueReviews`. But this function isn't used by FlashcardPage.

Back to `buildFlashcardQueue`: the condition should be:
```js
} else if (!m.mastered) {
  // Not mastered yet. Only include if due.
  if (m.due <= today) qDue.push(w);
}
```

Or more simply: include the word if it's not mastered AND due, OR if it's a new card.

The fix: change the logic to properly combine mastered and due checks.

**localStorage keys:** `state.vocabularyMastery[wordId].due`, `.mastered`

**Fix needed:**
Fix the due-date filter logic in `buildFlashcardQueue` and `getVocabQueue` in store.js. A card that is not-yet-mastered but has a future due date should NOT be included.

**Tests needed:**
- Easy card not in immediate next session
- Good card not in immediate next session
- Hard card due sooner but not immediate unless due
- Again card can reappear soon
- New Session uses fresh queue based on updated data

---

## Bug 4: Today's Plan Repeats Yesterday's Good/Easy Cards

**Reproduction:**
1. Complete daily plan yesterday.
2. Rate all flashcards Good/Easy.
3. Today: those same cards appear again.

**Affected files:**
- `src/pages/DailyMissionPage.jsx` (flashcard mission section, line ~2283)
- `src/utils/store.js` (getDueVocabWords)

**Root cause:**
The DailyMissionPage flashcard mission builds its own deck using `getDueVocabWords(allIds)`. `getDueVocabWords` has its own filtering logic that may incorrectly include mastered/non-due cards.

Looking at `getDueVocabWords` (line ~494):
```js
} else if (!m.mastered || m.due <= today) {
  // Card is due (not mastered or past due date)
  if (m.incorrect > m.correct && m.incorrect >= 2) {
    mistakeCards.push(id);
  } else {
    dueReview.push(id);
  }
}
```

Same bug as Bug 3: `!m.mastered || m.due <= today` treats ANY non-mastered card as due, even if it has a future due date.

Additionally, the DailyMissionPage flashcard mission has its OWN separate deck-building logic (line ~2283-2289) and its OWN rating handler (old 2-button system) — separate from the shared SRS queue.

**Fix needed:**
1. Fix `getDueVocabWords` due-date filter (same as Bug 3 fix).
2. Replace DailyMissionPage's inline flashcard deck building with shared queue function.
3. Update DailyMissionPage flashcard UI to use Again/Hard/Good/Easy (done in Phase 19 but verify).

**Tests needed:**
- Card rated Good yesterday is not shown today if due date is later.
- Card rated Easy yesterday is not shown today if due date is later.
- Due card appears.
- Mistake due card appears before new card.
- No due reviews → new unlocked card appears.
- Buttons are Again/Hard/Good/Easy.

---

## Bug 5: Mistake-Generated Cards Not in Shared SRS Queue

**Root cause:**
In Phase 19, `recordAnswer` was modified to create `vocabularyMastery` entries under key `mistake_${level}_${exerciseId}`. However, this key doesn't match the `wordId` format used by the flashcard queue functions. The flashcard queue expects keys like `A1_voc_123`, not `mistake_A1_listening_A1_0`.

Additionally, the mistake notebook page only shows raw mistake data and doesn't integrate with the flashcard review system at all.

**Fix needed:**
- Normalize mistake review to use the same card-type system as flashcards.
- Mistake review cards should use the 4-button SM-2 rating.
- Mistake review cards scheduled via the same `recordVocabAnswer` / `vocabularyMastery` system.
- Mistake Notebook should show them as reviewable cards with SM-2 status.

---

## Bug 6: Weak/Stale localStorage Data

**Potential issues:**
- `weakAreas` stored as object instead of array (crash source)
- Old `knew/didnt_know` boolean ratings in flashcard history
- Missing due dates on older mastery entries
- Duplicate mistake entries

**Fix needed:**
In `loadState` or `mergeState`:
- Normalize `weakAreas` to `[]`
- Ensure `vocabularyMastery` entries have `due`, `ease`, `interval`, `repetitions` fields
- Deduplicate mistake notebook entries
