# Phase 17: Practice State & Bug Audit

## Overview

Audit of all practice state tracking, completion logic, crash sources,
and filtering issues in deutsch-klinik.

---

## 1. Level Strip Crash (CRITICAL)

**Location:** `src/components/Layout.jsx`

**Root cause:**
The `<select>` combobox at the top nav binds `value={activeLevel}` and calls
`navigate(\`/level/${e.target.value}\`)` on `onChange`. The `activeLevel` is
computed from `location.pathname` or `getState().currentLevel`. When a user
clicks A2/B1/B2/C1:

1. `onChange` fires → `navigate()` called.
2. The target page component (LevelPage, DailyMissionPage, etc.) renders.
3. That component likely calls `getState()` immediately, which triggers a
   synchronous state access.
4. **Crash scenario:** If the component tries to read `levelsData.levels` or
   an index on data that hasn't loaded yet, or uses `useParams().levelId`
   in a way that produces an unexpected value, it throws.

**Observed:** The `<select>` wraps a `<Link>`-based navigation and uses
`onChange` for the `<select>` tag. The `navigate()` inside `onChange` should
be safe, but the *target component* may crash on invalid/partial state.

**Fix:** Wrap all level-based page content in an error boundary and guard
all data-accessors with fallback defaults.

---

## 2. Missing Unified Practice Progress Model

**Location:** None — does not exist yet.

**Problem:** The app has multiple overlapping state tracking systems:

- `state.levels[level].grammar[]` — tracks grammar completions as mixed array
- `state.levels[level].vocab[]` — tracks vocabulary completions
- `state.levels[level].reading[]` — reading completions
- `state.levels[level].listening[]` — listening completions
- `state.levels[level].writing[]` — writing completions
- `state.levels[level].speaking[]` — speaking completions
- `state.listeningCompleted[level]` — separate listening completion tracking
- `state.readingCompleted[level]` — separate reading completion tracking
- `state.vocabularyMastery` — SM-2 per-word mastery
- `state.grammarMastery` — per-exercise grammar mastery
- `state.incorrectAnswers[level]` — all incorrect answers flat array
- `state.mistakeNotebook` — notebook entries
- `state.repeatedMistakes` — aggregated mistake counts
- `state.remediationQueue` — remediation recommendations

These systems are **inconsistent**:

- Reading/Learning have DUAL tracking: both `levels[level].reading`
  AND `readingCompleted[level]`
- `getLevelProgress(level, 'reading')` returns raw progress array
- `completeReading()` pushes to `readingCompleted[level]`
- Writing uses `state.writings`
- Speaking uses `state.speakingRecordings`
- Grammar uses `state.levels[level].grammar[]`
- Some tracking stores raw data objects, others store strings/IDs

**Fix:** Build `src/utils/practiceProgress.js` with a unified interface.

---

## 3. Vocabulary Practice Shows All 803 Words (CRITICAL)

**Location:** `src/pages/PracticePage.jsx`

**Problem:** Vocabulary mode in free practice (`/practice`) shows ALL
803+ words from the vocabulary JSON with no session limit. User cannot
control how many words to practice.

**Fix:**
- Let user choose 5/10/15/20/25 items (default 10).
- Use current level, only unlocked vocab.
- Exclude correctly answered words unless due for SRS.
- Prioritize: due review > mistake items > new items.

---

## 4. Grammar Practice Has No Session Limit

**Location:** `src/pages/PracticePage.jsx`

**Problem:** Grammar mode shows all exercises at once with no limit.

**Fix:**
- Let user choose 5/10/15/20/25 questions (default 10).
- Use current level, only unlocked grammar.
- Exclude correctly answered questions.
- Prioritize: grammar mistakes > weak concepts > incomplete.

---

## 5. Reading/Listening Completion Tracking Is Incomplete

**Locations:** `src/pages/ReadingPage.jsx`, `src/pages/ListeningPage.jsx`

**Problem:**
- ReadingPage always calls `updateLevelProgress()` on submit regardless
  of score — no distinction for all-correct vs partial.
- ListeningPage also tracks by `updateLevelProgress()` regardless of score.
- No "green if all correct, red if not all correct" visual feedback.
- Completed items don't filter out of Today's Practice.

**Fix:**
- Track `completed_correct` / `completed_incorrect` status via practiceProgress.
- Count progress only when ALL correct.
- Remove from daily queue unless due for review.
- Add mistake on wrong answers.

---

## 6. Writing/Speaking Completion Threshold Missing

**Locations:** `src/pages/WritingPage.jsx`, `src/pages/SpeakingPage.jsx`

**Problem:**
- WritingPage has no scoring threshold — just submits text.
- SpeakingPage marks complete after any attempt.
- No `score >= 8/10 = completed` logic.

**Fix:**
- Mark completed when AI score (or manual score) >= 8/10.
- Otherwise add to mistake notebook for review.

---

## 7. Free Practice Completion → Today's Practice Filtering Broken

**Location:** `src/pages/PracticePage.jsx`, `src/pages/DailyMissionPage.jsx`

**Problem:**
- Items completed in free practice `/practice` should be filtered out
  of Today's Practice `/daily-mission`.
- No cross-communication between practice progress and daily mission.

---

## 8. Remediation Queue → Dashboard Crash

**Location:** `src/pages/Dashboard.jsx`

**Problem:**
- Dashboard iteration over `remediationQueue` items may crash when items
  have missing fields (skill, route, etc.).
- If `remediationQueue` contains stale or incomplete entries, `.map()`
  access to `.skill` or `.route` throws.

---

## 9. Mistake Notebook Vocab Review (Useless)

**Location:** `src/pages/MistakeNotebookPage.jsx`

**Problem:**
The "Vocab Review" tab in MistakeNotebookPage is a separate UI,
duplicates functionality from FlashcardPage, and only shows due words
with manual "Knew it" / "Still learning" buttons. This does not belong
in a mistake notebook.

**Fix:** Remove the Vocab Review tab from MistakeNotebookPage. Users
should use the dedicated flashcards page instead.

---

## 10. Terminology Inconsistencies

- `getLevelProgress(level, 'reading')` vs `completeReading()` — two systems.
- `incorrectAnswers` vs `mistakeNotebook` vs `repeatedMistakes` — three stores
  for the same concept.
- `readingCompleted` / `listeningCompleted` live at top level,
  while grammar/vocab track inside `levels[level]`.

---

## Priority Order

1. Level strip crash (CRITICAL — app-breaking)
2. Mistake Notebook vocab tab removal (SIMPLE FIX)
3. Unified practice progress model (FOUNDATIONAL)
4. Vocabulary practice session limits
5. Grammar practice session limits
6. Reading completion tracking fix
7. Listening completion tracking fix
8. Writing completion threshold
9. Speaking completion threshold
10. Free practice → today's practice filtering
11. Remediation → dashboard crash fix
12. Documentation and terminology cleanup
