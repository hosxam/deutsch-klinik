# Phase 19: Live Practice Bug Audit

## Bug 1: Reading Back Navigation Crash

**Reproduction:** Enter Reading Practice for any level, click Back (in-app link or browser back).

**Affected file:** `src/pages/ReadingPage.jsx`

**Root cause:** The component checks `exercises.length === 0` before using `useState` values for `currentEx` (line ~30). If exercises is empty for a level (returns `null` from `readingData[levelId]`), it returns early. But the `Link` to Back uses `to={\`/level/${levelId}\`}`. This should be safe. 

However, the real crash is likely: when navigating back from the reading page to the level page, the level page reads `readingData` and expects certain structure. The actual crash scenario is likely that `exercises[currentEx]` is `undefined` when `exercises` has entries but `currentEx` is somehow out of bounds (e.g., after state reset).

The most likely actual trigger: when the component renders, `exercises = readingData[levelId] || []` could be `undefined` if `levelId` changes mid-navigation, and `ex.questions` would crash.

**Fix needed:** Add guard clause for `ex` being null/undefined before accessing `ex.questions`. Safe optional chaining or null check.

**Same pattern to check:** ListeningPage, WritingPage, SpeakingPage, GrammarPage, FlashcardPage.

---

## Bug 2: Reading All-Correct Marked Red/Review

**Reproduction:** Complete one reading item all correct. Status shows red/needs_review.

**Affected file:** `src/pages/ReadingPage.jsx` (`submitAll` function), `src/utils/practiceProgress.js`

**Root cause analysis:**
Looking at `submitAll` in ReadingPage (line ~66):
```
const allCorrect = s === ex.questions.length;
if (allCorrect) {
  completeReading(levelId, readingId);
} else {
  ex.questions.forEach(q => { recordAnswer(...) }); // only on not-all-correct
}
updateLevelProgress(...);
recordPracticeAttempt('reading', readingId, {
  correct: allCorrect,
  score: s,
  maxScore: ex.questions.length,
  ...});
```

This looks correct for the case of all-correct. But the bug might be:
1. `readingId` uses `reading_${levelId}_${currentEx}` format. The `getPracticeItemStatus` in ReadingPage also uses this same format. So status reading should match.
2. The status buttons use `readingStatuses[i].status` from `getPracticeItemStatus`. If `recordPracticeAttempt` sets `correct: true`, then `status` becomes `'completed_correct'`. This should make the button green.

**Possible actual cause:** The `recordPracticeAttempt` sets `cur.status = 'completed_correct'` when `result.correct` is `true`. But then it ALSO checks `result.score`:
```
if (result.score !== undefined) {
  cur.score = result.score;
  cur.maxScore = result.maxScore || 10;
  cur.status = result.score >= 8 ? 'completed_correct' : 'completed_incorrect';
}
```
So even if `correct: true`, if `score` is set and `score < 8`, it will OVERWRITE status to `completed_incorrect`. But for reading, if all-correct, `s === ex.questions.length`, so score equals maxScore. For a 4-question reading, score=4, maxScore=4, `4 >= 8` is `false`! So it overrides to `completed_incorrect`.

**This is the bug!** The score-based threshold (`score >= 8`) in `recordPracticeAttempt` is designed for writing/speaking (10pt scale) but breaks reading/listening where max questions could be 2-6.

**Fix needed:** In `recordPracticeAttempt`, use a proportional threshold instead of absolute `score >= 8`. Or check `score / maxScore >= 0.7`. Or don't re-evaluate status from score if `correct` was explicitly passed.

---

## Bug 3: Listening All-Correct Stays Blank/Default

**Reproduction:** Complete listening all correct, submit, status remains default/unattempted.

**Affected file:** `src/pages/ListeningPage.jsx` (`submitAll`)

**Root cause:** Same bug as Reading (Bug 2). The `recordPracticeAttempt` call in ListeningPage uses:
```
recordPracticeAttempt('listening', listeningId, {
  correct: allCorrect,
  score: s,
  maxScore: ex.questions.length,
  ...});
```
Since `ex.questions.length` might be 2-5 for listening items, `score >= 8` is false even when all-correct. The function sees `score=3` with `maxScore=3` and sets `status='completed_incorrect'`.

But the user reports status stays "blank/default", not "red". This suggests the issue might be different: maybe the `recordPracticeAttempt` call is skipped entirely or the status reading key doesn't match.

**Check:** `listeningId = \`listening_${levelId}_${ex.id || currentEx}\`` vs status lookup: `getPracticeItemStatus('listening', \`listening_${levelId}_${i}\`)`. The key format must match. `ex.id` might be a string like `"A1_listen_1"` while the status lookup uses index-based `i`. So `listening_${levelId}_${ex.id}` = `"listening_A1_A1_listen_1"` vs `"listening_A1_0"` — MISMATCH!

**Fix needed:** Don't include `ex.id` in the listening key when it's already a prefixed ID. Or normalize so both store and lookup use the same format.

---

## Bug 4: Mistake Notebook Inconsistent Interaction

**Reproduction:** Some mistakes allow typing/checking, others only show "Mark as Mastered" / "Remove".

**Affected file:** `src/pages/MistakeNotebookPage.jsx`

**Root cause:** The input/check section always renders for every mistake. It relies on `mistake.correctAnswer` existing. If `correctAnswer` is missing or empty, the check still works but would always be wrong. No actual condition hides the input for unanswerable mistakes.

The issue might be that the expanded view is toggled per-mistake, and some mistakes have `correctAnswer` that's unset or null. In that case:
- Input shows
- `checkMistakeRetry` runs: `answer.toLowerCase().trim() === mistake.correctAnswer.toLowerCase().trim()` — if `correctAnswer` is undefined, this crashes (can't call `.toLowerCase()` on undefined).

**Fix needed:** 
1. Guard against missing `correctAnswer`
2. If `correctAnswer` is empty/missing, show explanation instead of input
3. Ensure consistent UI for answerable vs unanswerable mistakes

---

## Bug 5: Today's Plan Flashcards Wrong (Old Cards Reappearing)

**Reproduction:** Yesterday's cards answered correctly show again today.

**Affected file:** `src/pages/DailyMissionPage.jsx` (flashcard mission section, line ~2277)

**Root cause:** The flashcard section at line ~2288 builds deck using `getDueVocabWords(allIds)`. If `getDueVocabWords` doesn't properly filter SM-2 due dates, previously-good cards would still appear.

The `getDueVocabWords` function likely returns ALL words where `due <= today`. If the `recordVocabAnswer` call in the daily mission uses `knew` (boolean) mapped to rating 3 (Good), the due date should be set properly. But if the rating is `true` (boolean) mapped to 3, the due date should be set correctly.

Wait — looking at the daily mission handler at line ~2296:
```
recordVocabAnswer(`${lvl}_${current.id}`, knew, ...)
```
Where `knew` is a boolean. `recordVocabAnswer` maps `true` => 3 (Good), `false` => 1 (Again). For `true`, interval becomes 1 (first time) or 6 (second time) or `interval * ease`, and due is set to today + interval. This should work.

**More likely cause:** The `getDueVocabWords` function might be returning ALL words without checking recent SM-2 dates. Let me check:

---

## Bug 6: Today's Plan Flashcard Buttons Inconsistent (2 vs 4)

**Reproduction:** Today's Plan shows "Knew it" / "Didn't know" (2 buttons) while Practice Flashcards show Again/Hard/Good/Easy (4 buttons).

**Affected file:** `src/pages/DailyMissionPage.jsx` lines ~2361-2375

**Root cause:** The flashcard mission in DailyMissionPage has its own inline UI with only 2 buttons. It calls `recordVocabAnswer(id, boolean)` which maps the boolean to 3 (Good) or 1 (Again). This loses the granularity of Hard and Easy.

**Fix needed:** Replace the 2-button UI with 4-button SM-2 controls matching FlashcardPage. Use same rating values (1-4).

---

## Bug 7: Mistakes Should Be Review Flashcards (SM-2 Integration)

**Current behavior:** Mistakes tracked in `state.incorrectAnswers` and `state.mistakeNotebook` but don't become SM-2 reviewable flashcards.

**Affected file:** `src/utils/store.js`, `src/pages/MistakeNotebookPage.jsx`

**Fix needed:** When a mistake is logged via `recordAnswer`, it should also create/update an SM-2 flashcard entry so it appears in the mistake queue and can be reviewed with SM-2 intervals.

---

## Bug 8: Old localStorage Compatibility / Migration

Issues:
1. Reading/listening items previously marked all-correct but status incorrect due to score threshold bug must be recomputed
2. Duplicate mistake entries need deduplication
3. Old flashcard formats (knew/didnt_know) mapped to boolean

---

## Summary of Root Cause for Reading/Listening Status Bug

**The `recordPracticeAttempt` function in `practiceProgress.js` has a fatal logic error:**

```
if (result.score !== undefined) {
  cur.score = result.score;
  cur.maxScore = result.maxScore || 10;
  cur.status = result.score >= 8 ? 'completed_correct' : 'completed_incorrect';
}
```

This overwrites any status set by `result.correct`, and uses an absolute threshold of 8. For reading/listening with small question counts (2-5), `4 >= 8` is false even when all 4/4 correct.

**Fix:** Change to proportional: `result.score / (result.maxScore || 10) >= 0.7` to determine status, OR skip overwriting if `result.correct` was explicitly provided.

## Plan of Attack

1. Fix `recordPracticeAttempt` score threshold bug (affects Reading, Listening, Writing?, Speaking?)
2. Fix ReadingPage Back crash
3. Fix ListeningPage key format mismatch  
4. Fix DailyMissionPage flashcard UI (4 buttons)
5. Fix MistakeNotebook to guard missing correctAnswer
6. Add mistake-to-review-item system
7. Add safe localStorage migration
8. Test everything
