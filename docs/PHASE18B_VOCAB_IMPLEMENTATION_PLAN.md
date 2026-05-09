# Phase 18B: Vocabulary Practice & SRS Integration Plan

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline
**Status:** Plan (not yet implemented)

---

## 1. Source-of-Truth Decision

### The Two Systems

| System | Key | SM-2 | Used by |
|--------|-----|------|---------|
| `store.js` vocabularyMastery | `deutsch_klinik_state_{profile}` | Yes (4-button) | FlashcardPage, DailyMissionPage |
| `practiceProgress.js` practiceProgress_v1 | `practiceProgress_v1` | No (status only) | PracticePage, DailyMissionPage |

### Decision: `store.js` vocabularyMastery is the source of truth for SRS

**Rationale:**
1. Already has working SM-2 with proper intervals, ease factors, due dates.
2. FlashcardPage uses it correctly with `getDueVocabWords()`.
3. `practiceProgress_v1` is flat completed/not-completed with no scheduling.
4. `getDueVocabWords()` already handles priority queue (due reviews > mistake > new, capped at 25).
5. Key format `{level}_{word.id}` matches what PracticePage already uses.

**What practiceProgress_v1 is still used for:**
- Filtering out already-completed items from PracticePage pool.
- Recording session attempts for display.

**Integration approach (cross-reference, not full merge):**
- PracticePage reads vocabularyMastery to decide what to show
- practiceProgress_v1.vocabulary is a "first pass filter" to exclude completed_correct items that lack SM-2 data

---

## 2. What Will Be Changed

### 2.1 PracticePage.jsx

**startPractice() — add SRS-aware filtering after question generation:**

```js
function buildVocabularyPool(questions, level) {
  const state = getState();
  const today = getLocalDateKey(); // need to import
  const mastery = state.vocabularyMastery || {};
  const ppData = JSON.parse(localStorage.getItem('practiceProgress_v1') || '{}');
  const ppVocab = ppData.vocabulary || {};

  const dueReviews = [];
  const mistakeCards = [];
  const newCards = [];

  questions.forEach(q => {
    const sourceWord = q.sourceWord;
    if (!sourceWord || !sourceWord.id) return;
    const wordId = `${level}_${sourceWord.id}`;
    const m = mastery[wordId];
    const pp = ppVocab[wordId] || {};

    // Exclude mastered and not yet due
    if (m?.mastered && m?.due > today) return;

    // Exclude practiceProgress completed_correct without SM-2 data
    if (pp?.status === 'completed_correct' && !m) return;
    // Exclude practiceProgress completed_correct with SM-2 data not yet due
    if (pp?.status === 'completed_correct' && m?.due && m?.due > today) return;

    // Categorize
    if (m?.incorrect >= 2) {
      mistakeCards.push(q);
    } else if (m && m.due <= today && !m.mastered) {
      dueReviews.push(q);
    } else if (!m) {
      newCards.push(q);
    } else {
      newCards.push(q);
    }
  });

  return {
    dueReviews: shuffleArray(dueReviews),
    mistakeCards: shuffleArray(mistakeCards),
    newCards: shuffleArray(newCards)
  };
}
```

Then in startPractice(), replace the current `qs.slice(0, questionCount)` with priority-ordered pool building:

```js
const pools = buildVocabularyPool(qs, selectedLevel);
const ordered = [...pools.dueReviews, ...pools.mistakeCards, ...pools.newCards];
setQuestions(ordered.slice(0, questionCount));
```

**Empty state:** When `ordered.length === 0`, show an empty state message with options (change level/topic, go to flashcards, complete more lessons). Do NOT fall back to all 803 words.

**SRS write:** Already works via `recordVocabAnswer(wordId, isCorrect)`. The boolean maps to Good(3)/Again(1). Correct answers get SM-2 scheduled. Wrong answers create mistake entries via `recordAnswer()` in store.js.

**Article mode answer handling:** The article button click handler calls `recordVocabAnswer` inside a `setTimeout` — no change needed, it already passes boolean.

### 2.2 practiceProgress.js

Add dueDate field support:

```js
export function recordPracticeAttempt(skill, itemId, result = {}) {
  const data = load();
  if (!data[skill]) data[skill] = {};
  const cur = data[skill][itemId] || { status: 'unattempted', attempts: 0 };
  cur.attempts = (cur.attempts || 0) + 1;
  cur.lastAttempt = new Date().toISOString();
  if (result.correct !== undefined) {
    cur.status = result.correct ? 'completed_correct' : 'completed_incorrect';
  }
  if (result.score !== undefined) {
    cur.status = result.score >= 8 ? 'completed_correct' : 'completed_incorrect';
  }
  // Add dueDate
  if (result.dueDate !== undefined) {
    cur.dueDate = result.dueDate;
  }
  data[skill][itemId] = cur;
  save(data);
  return cur;
}

export function getDuePracticeItems(skill) {
  const data = load();
  const items = data[skill] || {};
  const today = new Date().toISOString().slice(0, 10);
  return Object.entries(items)
    .filter(([, v]) => !v.dueDate || v.dueDate <= today)
    .map(([id]) => id);
}
```

### 2.3 DailyMissionPage.jsx (vocab mission only)

No changes in Phase 18B. The vocab mission already filters unlocked items and practiceProgress. The flashcard mission already uses `getDueVocabWords`. These are correct as-is.

### 2.4 FlashcardPage.jsx

**No changes.** Already uses `getDailyFlashcardQueue` → `getDueVocabWords` with correct SM-2 filtering, 4-button rating, queue priority.

### 2.5 store.js

**No changes to SM-2 core.** The `recordVocabAnswer` function already handles boolean to rating mapping correctly.

---

## 3. What Will NOT Be Changed

- GrammarPage.jsx (Phase 18C)
- ReadingPage.jsx, ListeningPage.jsx, WritingPage.jsx, SpeakingPage.jsx
- MistakeNotebookPage.jsx
- PracticeHubPage.jsx
- teachBeforeTest.js
- curriculumProgress.js
- adaptivePlan.js
- dataLoaders.js
- germanVocabulary.json
- App.jsx routes
- Any CSS/UI components

---

## 4. Migration / Backward Compatibility

**No migration needed.** Changes are additive:
- Existing `practiceProgress_v1` entries work without dueDate (treated as "due immediately")
- Existing `vocabularyMastery` entries work as-is
- No localStorage schema changes

**Edge case:** Old `practiceProgress_v1.completed_correct` entries without vocabularyMastery data will be excluded from practice (assumed completed). User can clear data in Settings if they want to re-practice.

---

## 5. Tests

### 5.1 Pool Filtering Tests (unit)

```js
// Test: mastered+due in future = excluded
// Test: completed_correct in pp without mastery = excluded
// Test: completed_correct in pp with mastery.due > today = excluded
// Test: completed_correct in pp with mastery.due <= today = included
// Test: mastery.incorrect >= 2 = mistake priority
// Test: never seen = included as new
// Test: due review with mastery.due <= today = included
// Test: pool respects questionCount cap
// Test: pool is empty = empty state (no fallback to all words)
```

### 5.2 SRS Write Tests (integration)

```js
// Test: correct answer → recordVocabAnswer(wordId, true) → Good(3) → interval set → due date set
// Test: wrong answer → recordVocabAnswer(wordId, false) → Again(1) → interval reset → mistake created
```

### 5.3 Empty State Tests

```js
// Test: all words mastered → empty state rendered
// Test: all words in pp completed_correct → empty state rendered
// Test: no words for mode → existing "no questions" message
```
