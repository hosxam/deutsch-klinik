# Phase 19A: Live Blockers Fix Report

## Bugs Fixed

### Bug 1: Reading Back Crash (weakAreas.filter)

**Root cause:** `state.weakAreas` defaulted to an **object** `{A1: {grammar: false, ...}, ...}` in store.js line 54, but LevelPage/Dashboard/MistakeNotebook treat it as an array calling `.filter()` on it. The `|| []` guard didn't trigger because object is truthy.

**Fix:**
- Changed default to `[]` in defaultState
- Added `normalizeState()` post-processing in `loadState()` that:
  - Normalizes weakAreas to array (handles object, string, null, corrupted data)
  - Ensures all `vocabularyMastery` entries have SM-2 fields (ease, interval, repetitions, due, mastered)
  - Ensures flashcards object exists
- Normalization runs on both fresh and loaded state

**Files changed:** `src/utils/store.js`

---

### Bug 2: Mistake Notebook Stale Typed Answer + Typed-Answer Fragility

**Root cause:** Old typed-answer system used `retryAnswers[key]` where `key = level + '_' + idx`. After marking a mistake as mastered, indices shifted causing key collision. Additionally, no state cleanup when switching expanded mistake.

**Fix:**
- Replaced typed-answer as primary review with **SM-2 flashcard buttons** (Again/Hard/Good/Easy)
- Each button calls `recordVocabAnswer(mistakeId, rating, meta)` using key `mistake_${level}_${exerciseId}`
- This creates/manages vocabularyMastery entries for mistakes, sharing the same SM-2 scheduling
- Kept optional typed input only as secondary, with key-based state isolation and cleanup on Mark/Remove
- Clear typed state (`retryAnswers` and `retryResults`) on mastering or removal to prevent leakage

**Files changed:** `src/pages/MistakeNotebookPage.jsx`, `src/utils/store.js` (imports)

---

### Bug 3: Practice Flashcards Repeat Easy Cards Immediately

**Root cause:** `buildFlashcardQueue` in FlashcardPage.jsx used `!m.mastered || m.due <= today` which includes ANY non-mastered card even if it has a future due date. After rating Easy (interval=3, due=tomorrow), the card was included because `!m.mastered` was true.

**Fix:**
- Changed `buildFlashcardQueue` condition to `m.due <= today` only
- Same fix applied to `getQueueStats` in FlashcardPage.jsx
- Same fix applied to `getDueVocabWords` in store.js (used by DailyMissionPage)
- Same fix applied to `getVocabQueue` in store.js (used by PracticePage)
- Same fix applied to `getDueByDate` in store.js
- Same fix applied to `isVocabPracticeExcluded` (removed `m.mastered` requirement — any `due > today` is excluded)

**Files changed:** `src/pages/FlashcardPage.jsx`, `src/utils/store.js`

---

### Bug 4: Today's Plan Repeating Yesterday's Cards

**Root cause:** `getDueVocabWords` had the same due-date logic flaw (Bug 3). DailyMissionPage calls this function, so yesterday's Good/Easy cards (due=tomorrow) were still included.

**Fix:** Same due-date filter fix as Bug 3. DailyMissionPage now correctly excludes cards with future due dates.

**Files changed:** `src/utils/store.js` (via `getDueVocabWords`)

---

### Bug 5: Mistake-Generated Cards Not Using Shared SRS

**Status:** Fixed in previous Phase 19 (recordAnswer creates vocabularyMastery entries with `mistake_${level}_${exerciseId}` prefix). Now also verified:
- `recordVocabAnswer` works with any string wordId
- Mistake review buttons in MistakeNotebookPage call `recordVocabAnswer` directly
- Mistake cards get their own mastery entries, due dates, and scheduling

---

### Bug 6: Weak/Stale localStorage Data

**Fix:** Added `normalizeState()` function that runs on every load:
- `weakAreas` → forced to array
- All `vocabularyMastery` entries → ensure numeric fields (ease, interval, repetitions, correct, incorrect), string `due`, boolean `mastered`
- `flashcards` object → ensure object type
- Old object `weakAreas` silently normalized to `[]`
- Missing/invalid SM-2 fields get defaults

---

## localStorage Migration

Existing data is preserved. `normalizeState()` post-processes on load:
- Old object `weakAreas` → `[]` (no data loss — the object was never functionally used for filtering)
- Missing `due` → today's date
- Missing `ease` → 2.5
- Missing `interval` → 0
- Missing `repetitions` → 0
- Missing `mastered` → false

## Shared SRS Queue

ALL flashcard-type interactions now use the same SRS logic:
1. `getDueVocabWords(wordIds)` — queue builder for Today's Plan / FlashcardPage
2. `getVocabQueue(wordIds)` — queue builder for PracticePage vocabulary
3. `buildFlashcardQueue(words, sessionSize)` — FlashcardPage session builder
4. `recordVocabAnswer(wordId, rating, meta)` — SM-2 scheduling for ALL card types
5. SM-2 rating: 1=Again, 2=Hard, 3=Good, 4=Easy — consistent across all pages

## Test Results

- **Unit tests:** 184/184 passed (6 test files)
- **Build:** Successful
- **Lint:** No errors
- **Test changes:** Updated `simulateGetDueVocabWords` test model to match new due-date logic. Fixed 3 tests that assumed just-answered cards should reappear the same day. Added 1 new test for "just-answered card does not reappear same day".

## Commit & Deploy

**Commit hash:** (will be set on commit)
**Branch:** vocab-import-pipeline
**Deploy:** via `npm run deploy`

## Manual QA Checklist

- [ ] Reading Back: navigate from Reading Practice → Back → no crash
- [ ] Listening Back: same, no crash
- [ ] Dashboard: loads with old data, no crash
- [ ] Mistake Notebook: shows SM-2 buttons (Again/Hard/Good/Easy)
- [ ] Mistake Notebook: typed-answer input is optional, resets on switch
- [ ] Mistake Notebook: Mark as Mastered clears typed state
- [ ] Flashcards: rate Easy → New Session → card is excluded
- [ ] Flashcards: rate Good → New Session → card is excluded
- [ ] Flashcards: rate Hard → New Session → card is excluded (tomorrow's due)
- [ ] Flashcards: rate Again → New Session → card reappears (interval 0)
- [ ] Today's Plan: uses Again/Hard/Good/Easy buttons
- [ ] Today's Plan: yesterday's Good/Easy cards not shown if not due
- [ ] Today's Plan: mistake cards appear when due
- [ ] No console/runtime errors

## Limitations

- Typed-answer mode in Mistake Notebook kept as secondary option but still uses key-based retryAnswers state. Key collision is mitigated by always clearing on Mark/Remove. For 100% safety, any remaining typed state issues would need unique persistent IDs for each mistake entry instead of level_idx.
- `normalizeState()` only runs on app init. If state is corrupted mid-session (e.g., external script), it would not be caught until next load.
- Mistake cards with `mistake_${level}_${exerciseId}` keys don't cross-reference the original mistake — mastering the mistake card doesn't remove the mistake from `incorrectAnswers[]`. User can still "Mark as mastered" in Mistake Notebook separately.
