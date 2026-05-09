# Phase 18A: Practice Behavior Truth Audit

**Date:** 2026-05-09
**Auditor:** Najm
**Branch:** vocab-import-pipeline
**Commit:** 09f65b7

## 1. Summary

This report audits all 13 required practice behaviors across 14 source files and compares against actual implementation. The result is mixed: some behaviors are well-implemented (SM-2 scheduling, flashcard due queue, reading/listening completion tracking), but several critical behaviors are **not implemented as requested**, specifically the persistent status-based filtering of vocabulary and grammar items, the feed of wrong answers into Today's Plan, and the full integration of `practiceProgress_v1` across all practice surfaces.

---

## 2. Truth Table

| # | Required Behavior | Implemented? | File / Function | What is Wrong | Exact Fix Needed | Test Needed |
|---|---|---|---|---|---|---|
| 1 | VP: Must NOT show all 803 A1 words | **Partial** | `src/pages/PracticePage.jsx` lines ~234-245: `startPractice()` calls `getArticleQuestions(selectedLevel, selectedTopic)` → `vocabData[level]` | The page loads the **entire level** from `germanVocabulary.json` (all 803 A1 words). The count selector (5/10/15/20/25) slices from the full shuffle, but the pool is always ALL words in that level. There is **no filter** by unlocked/completed lesson vocabulary. The `recordPracticeAttempt()` call on line ~340 sends to `practiceProgress_v1` but PracticePage **never reads** practiceProgress back. | After `getArticleQuestions()`, filter the pool using `getUnlockedItems()` with `teachBeforeTest.js`. Also filter out items where `practiceProgress_v1.vocabulary[id].status === 'completed_correct'`. | Yes - unit test for pool size with mock progress data |
| 2 | VP: Must allow choosing 5/10/15/20/25 items | **Yes** | `PracticePage.jsx` lines ~450-460: `<select>` with options 5, 10, 15, 20, 25, sliced via `qs.slice(0, questionCount)` | Correctly implemented. User picks count, gets exactly that many questions per session. | N/A | N/A |
| 3 | VP: Must use current level | **Yes** | `PracticePage.jsx` lines ~430-445: `<select value={selectedLevel}>` with all 5 levels, defaults to route param `levelId` | Correctly implemented. Level selector available at mode pick screen. | N/A | N/A |
| 4 | VP: Must use unlocked/completed lesson vocabulary only | **No** | `PracticePage.jsx` line 234: `getArticleQuestions(selectedLevel, selectedTopic)` → `filterByTopic(vocabData[level], topic)` then `.filter(w => w.article)` | No call to `getUnlockedItems()` or any curriculum filter. Every word in the level is eligible regardless of whether its lesson has been completed. | Import `getUnlockedItems` from `teachBeforeTest.js`, call it with `getPracticeContext()` or construct context from `allowedLessonIds` before filtering the question pool. | Yes |
| 5 | VP: Must remove correctly answered items from immediate practice | **No** | `PracticePage.jsx` lines 330-340: `recordPracticeAttempt('vocab', currentQ.id, { correct: isCorrect, ... })` writes to `practiceProgress_v1`, but `startPractice()` never reads it back | The `startPractice()` function regenerates questions fresh from the full pool each time. `practiceProgress_v1` accumulates data, but PracticePage **ignores it** on next session. A user can get the same correct word again immediately. | In `startPractice()`, after generating questions, filter out items whose `practiceProgress_v1.vocabulary[id].status === 'completed_correct' || 'mastered'`. Read from `localStorage` directly or import `getPracticeItemStatus()`. | Yes |
| 6 | VP: Must schedule correct items with SM-2 | **Partial** | `PracticePage.jsx` line 335: `recordVocabAnswer(wordId, isCorrect)` → `store.js:392` (SM-2 with 1/2/3/4 rating), line 344: `recordPracticeAttempt('vocab', currentQ.id, ...)` | `recordVocabAnswer` is called with **boolean** (true/false), which maps to rating 3 (Good) or 1 (Again). Correct items get a proper SM-2 interval of 1 day then 6 days. But `recordPracticeAttempt` is a separate system (`practiceProgress_v1`) that has **no SM-2 scheduling** - only `status: 'completed_correct'` or `completed_incorrect`. Two parallel tracking systems exist. | Either merge the two systems or make `practiceProgress_v1` statuses feed into `getDueVocabWords`. Currently `getDueVocabWords` only reads `state.vocabularyMastery`, not `practiceProgress_v1`. | Yes |
| 7 | VP: Must create mistake/review items for wrong answers | **Yes** | `PracticePage.jsx` lines 315-317: `setMistakes(prev => [...prev, { question: currentQ, userAnswer, correctAnswer }])` AND line 335-349: `recordVocabAnswer(wordId, false)` → `store.js:449` writes wrong answer to `state.incorrectAnswers`, AND `recordPracticeAttempt('vocab', id, { correct: false })` | Wrong answers ARE recorded in all 3 systems: (1) in-memory mistakes list, (2) `state.vocabularyMastery` via `recordVocabAnswer`, (3) `practiceProgress_v1` via `recordPracticeAttempt`. The mistake review (re-quiz within session) works on next page. | N/A | N/A |
| 8 | VP: Must feed due cards into Today's Plan | **Partial** | `DailyMissionPage.jsx` line 770 (vocab mission): `recordVocabAnswer(...)` updates `state.vocabularyMastery`. Line 2157: `getDueVocabWords(allIds)` reads `state.vocabularyMastery` for due cards. | The **vocabulary mission** in Today's Plan reads from `state.levels[lvl].vocab` for completion, NOT `practiceProgress_v1`. The flashcard mission correctly uses `getDueVocabWords`. But the vocab practice mission shows NEW/unseen words from lessons, not due SM-2 cards. Due SM-2 cards are only shown in the flashcard mission, not the vocab practice mission. | Add integration: when generating vocab practice mission items, include due SM-2 cards from `getDueVocabWords` mixed with new unlocked words. Or remove vocab mission type entirely and let flashcards handle review. | Yes |
| 9 | GP: Must NOT show all 411 A1 grammar questions | **Yes** | `GrammarPage.jsx` line ~41: `all.filter(ex => !getGrammarMastery(ex.id).mastered)` filters mastered items. `DailyMissionPage.jsx` lines 740-770: grammar pool uses `getUnlockedItems()` with `practiceProgress_v1` filtering | The standalone GrammarPage filters by mastery (incomplete only). The DailyMissionPage's grammar mission filters by `getUnlockedItems` AND `practiceProgress_v1`. **But**: the standalone GrammarPage (non-daily mode) shows ALL unmastered questions, not just unlocked-lesson questions. | Add `getUnlockedItems` filter to the standalone GrammarPage's exercises pool. | Yes |
| 10 | GP: Must allow choosing 5/10/15/20/25 questions | **Yes** | `DailyMissionPage.jsx` lines 740-770 (grammar mission): `count = Math.min(cm.target, unmastered.length)`. `buildMissions` line 308: `targets.grammar` from `buildAdaptiveTargets`. `GrammarPage.jsx` line 11: `dailyLimit = parseInt(searchParams.get('limit') || '5')` | The daily mission sets target count from the adaptive plan. The standalone GrammarPage uses `?daily=1&limit=N` via URL params. In non-daily mode, it shows ALL unmastered questions at once. | No fix needed for daily mode. Standalone mode could add a client-side count selector. | N/A |
| 11 | GP: Must use current level | **Yes** | `GrammarPage.jsx` line 38: `grammarData[levelId] || []` | Correctly reads from `grammarData[levelId]` based on route param. | N/A | N/A |
| 12 | GP: Must use unlocked/completed lesson questions only | **No** | `GrammarPage.jsx` line 38: `grammarData[levelId]` with topic filter only, no `taughtInLessonId` filter | The standalone GrammarPage shows ALL unmastered questions in the level, not filtered by lesson completion. The DailyMissionPage's grammar mission DOES use `getUnlockedItems()` — so behavior differs between pages. | Add `getUnlockedItems` filter to the standalone GrammarPage's initial `exercises` memo. | Yes |
| 13 | GP: Must remove correctly answered questions from immediate practice | **Partial** | `GrammarPage.jsx` line 41: only filters **mastered** items. `DailyMissionPage.jsx` lines 740-770: filters `ppDone` (completed_correct) AND mastery ratio < 0.7. `recordGrammarAnswer` → `store.js:grammarMastery` (mastered after 5 correct). | The standalone GrammarPage only removes **mastered** (5 correct) items but not items just correctly answered once. The DailyMissionPage grammar mission is better: it checks both `ppDone` and mastery ratio. | Make standalone GrammarPage also check `practiceProgress_v1` in addition to `getGrammarMastery().mastered`. | Yes |
| 14 | GP: Must create mistakes and flashcards/remediation for wrong answers | **Yes** | `Store.js` `recordGrammarAnswer()`: writes to `grammarMastery` (increments incorrect count), calls `recordAnswer()` → `state.incorrectAnswers`. Wrong grammar answers appear in MistakeNotebook. Remediation is built in `DailyMissionPage.jsx:buildRemediationSession()` from `state.incorrectAnswers`. | Mistakes ARE created correctly. But there is **no flashcard** for grammar mistakes - only `state.incorrectAnswers` and MistakeNotebook. The remediation mission in Today's Plan reads `state.incorrectAnswers` to find weak areas. | If grammar mistake flashcards are wanted, they'd need to be added as vocab-style entries or a separate `grammarFlashcards` system. | N/A |
| 15 | GP: Must feed due remediation into Today's Plan | **Yes** | `DailyMissionPage.jsx` lines 330-340 (buildMissions): `if (targets.remediation > 0 && getRemediationRecommendation(state, levelId))` → remediation mission is added. | Correctly checks `state.incorrectAnswers` and low scores to build remediation. The `buildRemediationSession()` function (not shown here but present in DailyMissionPage) generates a review card in Today's Plan. | N/A | N/A |
| 16 | RP: Never attempted = default (shown in plan) | **Yes** | `DailyMissionPage.jsx` lines 1255-1275: `getNextReading()` filters items NOT in `completed` and NOT in `ppCompleted`. Never-attempted items pass both filters. | Correct: items not in `readingCompleted[level]` and not in `practiceProgress_v1.reading` with correct status are shown. | N/A | N/A |
| 17 | RP: All correct = green/completed | **Yes** | `ReadingPage.jsx` line ~295-300: `submitAll()` → checks all answers correct → all-correct path calls `completeReading(levelId, readingId)`. | Correct. All-correct marks reading as completed in `state.readingCompleted` AND records `practiceProgress_v1.reading[id] = { status: 'completed_correct' }`. | N/A | N/A |
| 18 | RP: Not all correct = red/needs review | **Partial** | `ReadingPage.jsx` line ~295-305: wrong answers recorded via `recordAnswer()`. `recordPracticeAttempt('reading', id, { correct: false })` sets `status: 'completed_incorrect'` in `practiceProgress_v1`. | The **ReadingPage itself shows status** via `getPracticeItemStatus('reading', id)` but the **DailyMissionPage's getNextReading** filters out items with `completed_correct || mastered` — items with `completed_incorrect` pass through and WILL be shown again. However, there is **no visual "red/needs review" label** on the reading card in Today's Plan — it just shows the next incomplete reading. | Add a status indicator badge in Today's Plan reading card (green for completed, red for needs review). | N/A |
| 19 | RP: Completed readings must count toward progress | **Yes** | `ReadingPage.jsx` line ~303: `updateLevelProgress(levelId, 'reading', { date, score, total })` updates `state.levels[level].reading`. Also `completeReading()` → `state.readingCompleted[level]` | Correctly counts progress in both `state.readingCompleted` and `state.levels[level].reading`. | N/A | N/A |
| 20 | RP: Completed readings must not appear in Today's Plan again | **Yes** | `DailyMissionPage.jsx` lines 1264-1275: `getNextReading()` filters by `!completed.has(item.id) && !ppCompleted.has(...)` | Correct: items in `readingCompleted[level]` or `practiceProgress_v1.reading` with correct status are excluded. | N/A | N/A |
| 21 | LP: Same as reading | **Yes** | `ListeningPage.jsx` lines 295-310: same pattern as ReadingPage. `DailyMissionPage.jsx` lines 1245-1255: `getNextListening()` same pattern. | All reading behaviors apply to listening. Fully implemented. | N/A | N/A |
| 22 | WP: Score >= 8/10 = completed/green | **Partial** | `WritingPage.jsx` line 75-78: `recordPracticeAttempt('writing', prompt.id, { correct: score >= 8, score })` → sets `practiceProgress_v1.writing[id] = { status: score >= 8 ? 'completed_correct' : 'completed_incorrect' }` | The **status is correctly recorded** in `practiceProgress_v1`. But the **Today's Plan writing card has no visual green/red status indicator**. Completed_correct items are excluded from `getNextWriting()`. | Add a visual status badge in Today's Plan writing card. | N/A |
| 23 | WP: Score < 8/10 = red/needs review | **Partial** | Same as above. Score < 8 → `status: 'completed_incorrect'`. `DailyMissionPage.jsx` getNextWriting filters by `!ppCompleted.has(...)` — only excludes `completed_correct`/`mastered`. | `completed_incorrect` items pass through and will be re-shown in Today's Plan. **Correct behavior but no visual indicator**. | Add visual red badge for needs-review items in Today's Plan. | N/A |
| 24 | WP: Completed writing must not appear in Today's Plan again | **Yes** | `DailyMissionPage.jsx` lines 1280-1290: `getNextWriting()` filters by `!ppCompleted.has(item.id)` where ppCompleted = `completed_correct || mastered` | Correct: completed_correct writings are excluded from Today's Plan. | N/A | N/A |
| 25 | SP: Same as writing (score >= 8 = completed) | **Partial** | `SpeakingPage.jsx` lines 260-266: `recordPracticeAttempt('speaking', prompt.id, { correct: score >= 8, score })` → same pattern | Identical pattern to writing. Status recorded correctly. Excluded from Today's Plan when completed_correct. No visual indicator. | Add visual status badge. | N/A |
| 26 | TP: Must exclude anything completed correctly in free practice | **Yes** | `DailyMissionPage.jsx` lines 1243-1295: ALL four getNext* functions (`getNextReading`, `getNextListening`, `getNextWriting`, `getNextSpeaking`) check `practiceProgress_v1` for `completed_correct` or `mastered`. | Correctly reads `practiceProgress_v1` from localStorage for reading, listening, writing, speaking. Items completed correctly in free practice have `status: 'completed_correct'` and are excluded. | N/A | N/A |
| 27 | TP: Must include wrong/due items only when due | **Partial** | `practiceProgress_v1` has **no due-date field** — only `status` (string) + `score` + `maxScore` + `level` + `topic` + `timestamp`. The `status: 'completed_incorrect'` items pass through to Today's Plan (they will be re-shown), but there is **no "due" delay** before re-showing them. They reappear on next page load. | Wrong items appear again immediately, not scheduled. SM-2 due dates exist only in `state.vocabularyMastery` (for flashcards), not in `practiceProgress_v1`. | Add a `dueDate` field to `practiceProgress_v1` entries. For `completed_incorrect` status, set dueDate = today + 1 day. For `completed_correct`, set dueDate = today + interval (like SM-2 but simpler). Then filter in Today's Plan. | Yes |
| 28 | TP: Must not ignore free-practice progress | **Yes** | Reading/Listening/Writing/Speaking pages all call `recordPracticeAttempt(...)` with correct. DailyMissionPage reads `practiceProgress_v1` for those skills. | The free practice progress IS read by Today's Plan for reading, listening, writing, speaking. **BUT**: for **vocabulary**, PracticePage calls `recordPracticeAttempt('vocab', ...)` but DailyMissionPage's vocab mission does NOT check `practiceProgress_v1` (it checks `state.levels[lvl].vocab` for completion instead). The flashcard mission also does NOT check `practiceProgress_v1.vocabulary`. | For vocabulary, add `practiceProgress_v1.vocabulary` filtering to both the vocab mission pool AND the flashcard mission pool in DailyMissionPage. | Yes |
| 29 | FC: Again/Hard/Good/Easy must update due dates | **Yes** | `store.js` lines 392-464: `recordVocabAnswer()` implements full SM-2 with per-rating intervals: Again (reset, 0 days), Hard (1.2x), Good (SM-2: 1→6→ease*interval), Easy (1.3x bonus). `mastery.due` is set based on interval. | Correct SM-2 implementation. Ratings correctly update `ease`, `interval`, `repetitions`, and `due` date. | N/A | N/A |
| 30 | FC: Good/Easy must not reappear before due | **Yes** | `store.js` lines 466-490: `getDueVocabWords()` filters by `(!m.mastered || m.due <= today)` — only mastered-and-not-yet-due items are excluded. | Correct: Good/Easy items get proper intervals, and `getDueVocabWords` respects their due dates. `getDailyFlashcardQueue` aliases `getDueVocabWords`. | N/A | N/A |
| 31 | FC: Daily cap should be 20-30 | **Yes** | `store.js` lines 484-490: `MAX_DAILY_QUEUE = 25`, `MAX_NEW_CARDS = 10`. Queue: due reviews first (unlimited), then mistake cards up to remaining room, then new cards capped at 10. | Cap is 25 total. Priority order: due reviews > mistake cards > new cards. Correct. | N/A | N/A |
| 32 | FC: Priority should be due reviews, then mistake, then new cards | **Yes** | `store.js` lines 478-490: `dueReview` first, then `mistakeCards` slice, then `newCards` slice (capped at 10). | Correct ordering. | N/A | N/A |

---

## 3. Detailed Analysis of Each File

### 3.1 `src/pages/PracticePage.jsx` (Vocabulary Practice)

**What it does:**
- Loads `vocabData` (all ~4500 words across all levels from `germanVocabulary.json`)
- Provides 3 modes: Article, Plural, Fill-in-the-Blank
- Has level selector (A1-C1), topic filter, count selector (5-25)
- Generates questions by filtering `vocabData[selectedLevel]` by topic, then slicing to `questionCount`
- On answer: calls `recordVocabAnswer()` (SM-2) AND `recordPracticeAttempt()` (practiceProgress_v1)
- Shows results, mistakes, option to review mistakes

**Critical findings:**
1. **No curriculum filtering** — does not import `getUnlockedItems()` or check `taughtInLessonId`. Every word in the level is eligible.
2. **No practiceProgress_v1 read** — `startPractice()` never checks `practiceProgress_v1.vocabulary` to exclude already-correct items. Same words can reappear.
3. **Boolean SM-2** — `recordVocabAnswer(wordId, isCorrect)` uses boolean, mapping true→Good (3), false→Again (1). No Hard/Easy granularity.
4. **No due-card feed** — `recordPracticeAttempt()` writes to `practiceProgress_v1` but the page never reads it. Student can repeatedly practice the same words.

**Fix priority: HIGH**

### 3.2 `src/pages/FlashcardPage.jsx`

**What it does:**
- Loads ALL words from all levels via `allWords` flat array
- Level filter dropdown (A1-C1 or "All Levels")
- Filter modes: All Cards / Due Today / Weak Cards
- For "Due" filter: calls `getDailyFlashcardQueue(ids)` → `getDueVocabWords()`
- Shows flip card UI with Again/Hard/Good/Easy buttons
- Calls `recordVocabAnswer()` with 1-4 rating (proper SM-2)

**Critical findings:**
1. **No practiceProgress_v1 integration** — never reads `practiceProgress_v1.vocabulary`. It relies entirely on `state.vocabularyMastery` for due/weak status.
2. **No curriculum filtering** — shows ALL words in the level, not just completed-lesson words.
3. **Queue priority works** — due reviews first, then mistakes, new cards capped at 10, total capped at 25.
4. **SM-2 works correctly** — 4-button rating system updates ease/interval/due.

**Fix priority: MEDIUM** (less critical than PracticePage)

### 3.3 `src/pages/DailyMissionPage.jsx`

**What it does:**
- Generates a daily plan with missions: lesson, grammar, vocabulary, flashcards, reading, listening, writing, speaking, remediation
- Uses `buildAdaptiveTargets()` to determine counts
- Uses `TIME_BUDGET` + `MINS_PER_ITEM` to allocate time
- Each mission type has inline rendering logic

**Critical findings:**
1. **Grammar mission** (lines 740-770): Uses `getUnlockedItems()` with `practiceProgress_v1` filtering. **BEST IMPLEMENTED**.
2. **Vocabulary mission** (lines 770+): Loads `vocabDataRef.current` | Attempts curriculum filtering via `getUnlockedItems()` or `allowedLessonIds`. Then checks `practiceProgress_v1` for already-correct items. **Good implementation**.
3. **Flashcard mission** (lines 2157-2260): Uses `getDueVocabWords()` to find due words. **Does NOT check `practiceProgress_v1`**.
4. **Reading/Listening mission**: Uses `getNextReading()` / `getNextListening()` with proper `practiceProgress_v1` filtering.
5. **Writing/Speaking mission**: Uses `getNextWriting()` / `getNextSpeaking()` with proper `practiceProgress_v1` filtering.
6. **buildMissions()** (line 264): Hardcoded labels, uses `targets` from `buildAdaptiveTargets`. Target counts are reasonable but vocabulary mission count comes from `targets.vocab` in `buildAdaptiveTargets` (6-32), which is about learning **new** words, not reviewing due cards.

**Fix priority: MEDIUM** (vocabulary/flashcard integration gap)

### 3.4 `src/pages/ReadingPage.jsx`
- **Status: GOOD**
- Uses `getPracticeItemStatus('reading', id)` for status display
- Calls `completeReading()` on all-correct
- Calls `recordPracticeAttempt('reading', id, { correct: bool })`
- Wrong answers recorded via `recordAnswer()`
- No gaps found

### 3.5 `src/pages/ListeningPage.jsx`
- **Status: GOOD**
- Same pattern as ReadingPage
- `submitAll()` → checks all correct → `completeListening()` + `recordPracticeAttempt()`
- No gaps found

### 3.6 `src/pages/WritingPage.jsx`
- **Status: GOOD**
- AI-based scoring via `correctWriting()`
- Score >= 8 → correct
- Calls `recordPracticeAttempt('writing', prompt.id, { correct: score >= 8, score })`
- No gaps found

### 3.7 `src/pages/SpeakingPage.jsx`
- **Status: GOOD**
- Same pattern as WritingPage
- Score >= 8 → correct via AI feedback
- Calls `recordPracticeAttempt('speaking', prompt.id, { ... })`

### 3.8 `src/pages/GrammarPage.jsx`
- **Status: PARTIAL**
- Uses `isDaily` param to limit to first N incomplete items
- Filters **mastered** items (5+ correct)
- Does NOT use `getUnlockedItems()` or `practiceProgress_v1` in standalone mode
- `recordGrammarAnswer()` correctly records progress and mistakes

### 3.9 `src/pages/PracticeHubPage.jsx`
- **Status: GOOD** (routing only, no logic gaps)
- Routes to all practice pages

### 3.10 `src/pages/MistakeNotebookPage.jsx`
- **Status: GOOD**
- Uses `getMistakesByLevel()`, `getMistakeNotebookItems()`, `getWeakTopics()`
- Filter by level/skill
- Retry and mark mastered functionality

### 3.11 `src/utils/store.js`
- **Status: MIXED**

**What's good:**
- Full SM-2 implementation (`recordVocabAnswer` with 4 ratings)
- `getDueVocabWords()` with priority queue (due > mistake > new, capped at 25)
- `getDailyFlashcardQueue()` alias
- `recordGrammarAnswer()` with mastery tracking
- Reading/listening completion tracking
- Mistake tracking via `recordAnswer()`

**What's missing/partial:**
- `vocabularyMastery` and `practiceProgress_v1` are **two parallel systems** with no cross-referencing
- `getDueVocabWords()` only reads `state.vocabularyMastery`, never `practiceProgress_v1`
- No "mistake flashcard" creation for grammar/writing/speaking mistakes
- `grammarMastery` has master threshold of 5 correct but no SM-2 scheduling

### 3.12 `src/utils/practiceProgress.js`
- **Status: GOOD** (as a storage layer)
- `load()`/`save()` for `localStorage('practiceProgress_v1')`
- `getPracticeItemStatus(skill, itemId)` — reads status
- `recordPracticeAttempt(skill, itemId, { correct, score, ... })` — writes
- `isPracticeItemCompleted(skill, itemId)` — checks `completed_correct || mastered`
- `shouldExcludeFromDailyPractice(skill, itemId)` — same check

**What's missing:**
- No `dueDate` field — no scheduling within this system
- No SM-2 logic — just status strings
- No function to get "all due" items from practiceProgress

### 3.13 `src/utils/teachBeforeTest.js`
- **Status: GOOD**
- `getUnlockedItems()` correctly filters by completed lessons/concepts
- `isFreePractice` bypass mode
- `getTodayItems()` / `getReviewItems()` for finer control
- `hasCurriculumMap()` check

### 3.14 `src/utils/dataLoaders.js`
- **Status: GOOD**
- Dynamic per-level data loading with caching
- Handles vocab, grammar, lessons, reading, listening, writing, speaking

---

## 4. Two Tracking Systems Problem

The app has **two parallel progress tracking systems** that do not cross-reference:

### System 1: `store.js` → `localStorage('deutsch_klinik_state_default')`
- `state.vocabularyMastery[wordId]` — SM-2 scheduling, ease, interval, due, mastered flag
- `state.grammarMastery[exId]` — correct/incorrect counter + mastered boolean
- `state.readingCompleted[level][]` — completed reading IDs
- `state.listeningCompleted[level][]` — completed listening IDs
- `state.levels[level].vocab[]` — seen vocab IDs
- `state.levels[level].grammar[]` — seen grammar IDs
- `state.incorrectAnswers[level][]` — mistake records

### System 2: `practiceProgress.js` → `localStorage('practiceProgress_v1')`
- `practiceProgress_v1.vocabulary[id]` — `{ status, correct, maxScore, level, topic, timestamp }`
- `practiceProgress_v1.grammar[id]` — same
- `practiceProgress_v1.reading[id]` — same
- `practiceProgress_v1.listening[id]` — same
- `practiceProgress_v1.writing[id]` — same
- `practiceProgress_v1.speaking[id]` — same
- **No SM-2 scheduling, no due dates, no intervals**

### Where each system is used:

| Component | Uses System 1 | Uses System 2 |
|---|---|---|
| PracticePage (vocab) | Yes (`recordVocabAnswer`) | Yes (`recordPracticeAttempt`) |
| FlashcardPage | Yes (SM-2, `getDueVocabWords`) | No |
| DailyMissionPage grammar mission | Yes (`grammarMastery`) | Yes (`practiceProgress_v1`) |
| DailyMissionPage vocab mission | Yes (`state.levels[lvl].vocab`) | Yes (`practiceProgress_v1.vocabulary`) |
| DailyMissionPage flashcard mission | Yes (`getDueVocabWords`) | No |
| DailyMissionPage reading/listening | Yes (`readingCompleted`/`listeningCompleted`) | Yes |
| DailyMissionPage writing/speaking | No | Yes |
| GrammarPage (standalone) | Yes (`grammarMastery`) | No |
| MistakeNotebookPage | Yes (`state.incorrectAnswers`) | No |

**Impact:** A vocab word practiced to completion in `practiceProgress_v1` will still show as "new" in `getDueVocabWords()` because System 1 doesn't know about System 2.

---

## 5. localStorage Keys

| Key | Used By | What It Stores |
|---|---|---|
| `dk_active_profile` | `store.js` | Active profile name (`default` or custom) |
| `deutsch_klinik_state_{profile}` | `store.js` | All state: vocabularyMastery (SM-2), grammarMastery, readingCompleted, listeningCompleted, levels, incorrectAnswers, flashcards, etc. |
| `practiceProgress_v1` | `practiceProgress.js` | Unified practice status: `{ skill: { id: { status, correct, maxScore, level, topic, timestamp } } }` |
| `dk_daily_session_{level}` | `DailyMissionPage.jsx` | Saved daily session data (loaded/created via `loadSession`/`saveSession`) |

---

## 6. Exact Implementation Order (Recommended)

### Priority 1: Fix PracticePage Vocabulary Pool (EFFECT: User-facing, HIGH)

**Files:** `src/pages/PracticePage.jsx`

1. Import `getUnlockedItems` from `teachBeforeTest.js` and `getPracticeContext` (or construct equivalent context)
2. Import `getPracticeItemStatus` from `practiceProgress.js`
3. In `startPractice()`, after getting questions from `getArticleQuestions()` etc., filter:
   - Items whose lesson is completed (via `getUnlockedItems` or equivalent)
   - Items NOT in `practiceProgress_v1.vocabulary` with `completed_correct || mastered`
4. Consider adding a "Due words" option alongside "All words" at the mode selector

### Priority 2: Cross-Reference VocabularyMastery and PracticeProgress (EFFECT: Data consistency, HIGH)

**Files:** `src/utils/store.js`, `src/utils/practiceProgress.js`

1. Add function `getDueVocabularyProgressIds()` that merges both systems:
   - From `getDueVocabWords()`: words due in SM-2
   - From `practiceProgress_v1.vocabulary`: items with `status: 'completed_incorrect'` (as "due for review" after 1 day delay)
2. Make `getDueVocabWords()` optionally accept practiceProgress data for cross-referencing
3. OR: create a migration script to sync `practiceProgress_v1.vocabulary` entries into `state.vocabularyMastery`

### Priority 3: Add Due-Date to PracticeProgress (EFFECT: Scheduling accuracy, MEDIUM)

**Files:** `src/utils/practiceProgress.js`

1. Add `dueDate` field to `recordPracticeAttempt()` entries
2. For `completed_correct`: dueDate = today + SM-2 interval (or a default like 7 days)
3. For `completed_incorrect`: dueDate = today + 1 day (re-appears next day)
4. Add `getDuePracticeItems(skill)` function that filters by `dueDate <= today`
5. Use in Today's Plan getNext* functions

### Priority 4: Add PracticeProgress to FlashcardPage (EFFECT: Data completeness, MEDIUM)

**Files:** `src/pages/FlashcardPage.jsx`

1. Read `practiceProgress_v1.vocabulary` 
2. Merge with `getDueVocabWords()` results
3. Show "practice status" badge on cards (completed_correct vs completed_incorrect vs never-seen)

### Priority 5: Add PracticeProgress to Standalone GrammarPage (EFFECT: Consistency with daily plan, MEDIUM)

**Files:** `src/pages/GrammarPage.jsx`

1. Filter by `getUnlockedItems()` for lesson completion
2. Filter by `practiceProgress_v1.grammar` completed items

### Priority 6: Add Visual Status Indicators to Today's Plan Mission Cards (EFFECT: UX, LOW)

**Files:** `src/pages/DailyMissionPage.jsx`

Add green/red badges to reading, listening, writing, speaking mission cards showing whether the item has been previously attempted and the status.

### Priority 7: Add Tests (EFFECT: Maintainability, LOW)

**Files:** `src/utils/__tests__/`, `src/pages/__tests__/`

1. `practiceProgress.test.js` — test `recordPracticeAttempt`, `getPracticeItemStatus`, `shouldExcludeFromDailyPractice`, `isPracticeItemCompleted`, plus new dueDate logic
2. `store-vocab.test.js` — test SM-2 scheduling: `recordVocabAnswer` with each rating, verify `mastery.due`, `mastery.interval`, `mastery.ease`
3. `getDueVocabWords.test.js` — test priority ordering: due reviews first, mistake cards, new cards; verify MAX_DAILY_QUEUE = 25, MAX_NEW_CARDS = 10
4. `DailyMissionPage.test.js` — test `buildMissions()` with different targets, verify mission types

---

## 7. Glossary of Key Functions

| Function | Location | Purpose |
|---|---|---|
| `recordVocabAnswer(wordId, rating)` | `store.js:392` | SM-2 scheduling with 1/2/3/4 rating |
| `getDueVocabWords(wordIds)` | `store.js:466` | Priority queue: due reviews > mistake > new (capped at 25) |
| `getDailyFlashcardQueue(wordIds)` | `store.js:516` | Alias for getDueVocabWords |
| `getVocabMastery(wordId)` | `store.js:376` | Get current SM-2 state for a word |
| `getPracticeItemStatus(skill, itemId)` | `practiceProgress.js` | Read practiceProgress_v1 status |
| `recordPracticeAttempt(skill, itemId, data)` | `practiceProgress.js` | Write to practiceProgress_v1 |
| `isPracticeItemCompleted(skill, itemId)` | `practiceProgress.js` | Check completed_correct/mastered |
| `shouldExcludeFromDailyPractice(skill, itemId)` | `practiceProgress.js` | Same as isPracticeItemCompleted |
| `getUnlockedItems(items, level, progress, ctx)` | `teachBeforeTest.js` | Filter items by completed lessons/concepts |
| `getPracticeContext(levelId, session, state)` | `DailyMissionPage.jsx:239` | Build context for getUnlockedItems |
| `buildAdaptiveTargets(levelId, state, goal)` | `adaptivePlan.js` | Calculate daily target counts |
| `buildMissions(levelId, state, targets, forceType)` | `DailyMissionPage.jsx:264` | Build mission list from targets |
| `completeReading(levelId, readingId)` | `store.js` | Mark reading as completed |
| `completeListening(levelId, listeningId)` | `store.js` | Mark listening as completed |
| `recordGrammarAnswer(exId, correct)` | `store.js` | Update grammarMastery counters |
| `getGrammarMastery(exId)` | `store.js` | Get grammar mastery state |
| `recordAnswer(level, id, ...)` | `store.js` | Record an incorrect answer to state.incorrectAnswers |
| `getMistakesByLevel(level)` | `store.js` | Get mistakes for level |
| `getMistakeNotebookItems(level, skill)` | `store.js` | Get filtered mistake items |
| `getRemediationRecommendation(state, levelId)` | `adaptivePlan.js` | Get weakest skill for remediation mission |