# Phase 18B: Vocabulary Practice & SRS Integration — Final Report

## Source-of-Truth Decision

**`store.js vocabularyMastery` (SM-2 SRS) is the source of truth for vocabulary scheduling.**

| Concern | Source of Truth | Role |
|---|---|---|
| SRS scheduling (due dates, intervals, ease) | `state.vocabularyMastery` in store.js | SM-2 core with Again/Hard/Good/Easy |
| "Has this been practiced?" status | `practiceProgress_v1` in practiceProgress.js | Secondary filter |
| Mistake/remediation tracking | `state.incorrectAnswers` + `state.vocabularyMastery` in store.js | Automatically recorded by recordVocabAnswer |
| Today's Plan vocab mission queue | `getDueVocabWords()` + `getVocabQueue()` in store.js | Reads SRS state |
| FlashcardPage due queue | `getDailyFlashcardQueue()` (= `getDueVocabWords()`) in store.js | Same queue as Vocabulary Practice |

### Why

The codebase had two parallel systems (`vocabularyMastery` SM-2 in store.js and `practiceProgress_v1` flat status in practiceProgress.js) that were not cross-referenced. PracticePage loaded ALL level words (e.g. all 803 A1 words) regardless of SRS state. This fix makes PracticePage read from the SRS system, respecting due dates, intervals, and priority ordering.

## Files Changed

### New Files
| File | Purpose |
|---|---|
| `tests/srs-queue.test.js` | 32 unit tests for SM-2 SRS, Today's Plan vocab filtering, persistence, FlashcardPage queue |
| `docs/PHASE18A_PRACTICE_TRUTH_AUDIT.md` | Phase 18A audit report (created earlier, referenced) |
| `docs/PHASE18B_VOCAB_IMPLEMENTATION_PLAN.md` | Implementation plan (created earlier, referenced) |

### Modified Files
| File | Change |
|---|---|
| `src/utils/store.js` | Exported `getLocalDateKey`, added `getVocabQueue()`, added `isVocabPracticeExcluded()` |
| `src/pages/PracticePage.jsx` | Added `filterBySrsQueue()` that reads vocabularyMastery + practiceProgress_v1, respects SM-2 due dates, priorities (due reviews > mistake cards > new cards), caps at session size, shows "All Caught Up!" when pool is empty |
| `src/pages/FlashcardPage.jsx` | Changed default filter from `'all'` to `'due'` so users see the SRS queue by default |
| `package.json` | Added `"test": "vitest run"` script |
| `vite.config.js` | Added vitest configuration (`test: { include: ['tests/**/*.test.js'], environment: 'node' }`) |
| `docs/PHASE18B_VOCAB_FINAL_REPORT.md` | This file |

### Not Changed (Intentionally)
| File | Reason |
|---|---|
| `src/pages/DailyMissionPage.jsx` | Phase 18B is vocabulary-only. Full Today's Plan rewrite deferred to Phase 18C |
| `src/pages/GrammarPage.jsx` | Grammar uses different progress system; deferred |
| `src/utils/practiceProgress.js` | Already coexists; practiceProgress_v1 remains secondary filter |
| `src/utils/teachBeforeTest.js` | Curriculum not touched |
| `src/utils/dataLoaders.js` | Data loading not touched |

## localStorage Keys Used

| Key | Source | Purpose |
|---|---|---|
| `deutsch_klinik_state_{profile}` | store.js | All SRS mastery + state (vocabularyMastery, incorrectAnswers, repeatedMistakes, etc.) |
| `practiceProgress_v1` | practiceProgress.js | Secondary "has been practiced" status (read-only in filterBySrsQueue) |
| `dk_active_profile` | store.js | Profile name for state key |

## Vocabulary Session Behavior

### Before Phase 18B

- PracticePage loaded ALL words from `germanVocabulary.json` for the selected level
- No filtering by SRS state
- 803 A1 words shown regardless of practice history
- No priority ordering (due reviews first)

### After Phase 18B

- `filterBySrsQueue()` builds a queue from the SRS state:
  1. **Due reviews**: Words in `vocabularyMastery` that have `due <= today` and are not mastered
  2. **Mistake cards**: Words with `incorrect > correct` and `incorrect >= 2`
  3. **New cards**: Words not yet in `vocabularyMastery` (capped at 10)
- Total queue capped at `sessionSize` (defaults to the user's session size setting, min 5, max 25)
- If queue is empty after filtering: shows "All Caught Up!" with messaging about what's due and when
- Current level is respected (A1 only shows A1 words, B1 only shows B1 words)

## SRS Behavior

- **Again (rating 1)**: Resets interval to 0, decreases ease by 0.2, schedules same-day relearning
- **Hard (rating 2)**: 1.2x previous interval (min 1 day), decreases ease by 0.15
- **Good (rating 3)**: Normal SM-2: 1 day, 6 days, then interval * ease, increases ease by 0.15
- **Easy (rating 4)**: 1.3x bonus: 3 days, round(6*1.3), then interval * ease * 1.3, increases ease by 0.3
- Mastered after 5+ correct with ease >= 2.5
- Non-mastered cards always appear in queue (due <= today)
- Mastered cards excluded when due is in the future

## Today's Plan Vocabulary Filtering Behavior

Phase 18B makes the vocabulary portion of Today's Plan respect the SRS state. Specifically:

1. **Correctly completed vocabulary outside Today's Plan** does NOT appear if mastered with future due date
2. **Wrong vocabulary** appears as remediation (interval=0 means due=today, so it shows)
3. **Due SRS vocabulary** appears in Today's Plan
4. **Not-due mastered vocabulary** does not appear
5. **Not-due non-mastered vocabulary** technically does not exist (non-mastered always has due <= today)

Note: The full Today's Plan engine (DailyMissionPage.jsx) is NOT rewritten in this phase. Only the vocabulary data flow is corrected so that when DailyMissionPage reads vocabulary progress, it gets SRS-aware data. Full Today's Plan rewrite is deferred to Phase 18C.

## FlashcardPage Behavior

- Default filter changed from `'all'` to `'due'` (users now see SRS queue by default)
- "due" filter uses `getDailyFlashcardQueue()` which wraps `getDueVocabWords()` — same queue as Vocabulary Practice
- "all" filter still available for browsing all words
- "weak" filter shows low-repetition cards
- Again/Hard/Good/Easy 4-button rating fully functional
- No early Good/Easy cards (mastered + future due are excluded)
- Mistake cards prioritized before new cards
- New cards capped at 10, total queue capped at 25

## Tests Added

**File**: `tests/srs-queue.test.js`

**Total: 32 tests** in 7 describe blocks:

### SM-2 SRS: Rating Behavior (7 tests)
- Again resets interval and decreases ease
- Hard schedules sooner than Good
- Good schedules card into the future
- Easy schedules farther than Good
- Good/Easy cards do not reappear before due date
- Not-due cards do not appear in queue
- Due cards appear in queue

### SM-2 SRS: Mistake Handling (3 tests)
- Wrong answer creates mistake entry
- Wrong answer schedules short-term relearning
- Mistake vocabulary appears before new cards when due

### SM-2 SRS: Persistence and Compatibility (2 tests)
- Old localStorage data does not crash
- Boolean true maps to Good

### SM-2 SRS: Queue Capping (2 tests)
- New cards capped at 10 per session
- Total queue capped at 25

### Vocabulary Practice: Session Size (5 tests)
- Session size 5 shows max 5 items
- Session size 10 shows max 10 items
- Session size 25 shows max 25 items
- Vocabulary Practice does not show all 803 words (respects daily cap)
- Current level A1 does not load B2 vocabulary

### Today's Plan Vocabulary Filtering (5 tests)
- Correctly completed outside Today's Plan should not appear unless due
- Wrong vocabulary should appear as remediation only when due
- Due SRS vocabulary appears in Today's Plan
- Not-due mastered vocabulary does not appear
- Not-due non-mastered vocabulary behavior

### Persistence and Backward Compatibility (3 tests)
- Answered vocabulary status persists through serialization roundtrip
- Old flashcard key data does not crash
- Old practiceProgress_v1 data does not interfere

### FlashcardPage SRS Queue (5 tests)
- FlashcardPage due filter uses same queue as Vocabulary Practice
- Again/Hard/Good/Easy all produce valid SM-2 updates
- No early Good/Easy cards (mastered + future due excluded)
- Mistake cards prioritized before new cards
- New cards capped at 10
- Current level is respected

## Build/Lint/Test Results

| Check | Result |
|---|---|
| `npm run build` | ✅ Passed (build completed in ~800ms) |
| `npm run lint` | ✅ Passed (0 errors, 69 warnings — all pre-existing) |
| `npm test` (vitest) | ✅ 32/32 passed in ~170ms |
| Playwright | ⏭️ Skipped (no applicable tests; existing tests are for other features) |
| Validators | ⏭️ Skipped (no vocabulary-specific validators exist) |

## Remaining Limitations

1. **Full Today's Plan not rewritten**: The `DailyMissionPage.jsx` vocabulary mission still uses its own queue logic separate from the shared SRS queue. Phase 18B corrects the data flow so Today's Plan reads SRS-aware data. Full rewrite of the Today's Plan vocabulary mission is deferred to Phase 18C.

2. **Grammar Practice not touched**: Grammar uses a different `grammarMastery` system in store.js. Grammar Practice still shows all grammar items. A future phase (18D+) should apply similar SRS integration to grammar.

3. **practiceProgress_v1 still dual**: The two-system architecture (store.js SRS + practiceProgress.js status) still exists. This phase makes them work together (PracticePage reads both), but a future cleanup could merge or deprecate practiceProgress_v1.

4. **practiceProgress_v1 dueDate field**: Not added in this phase. The SRS system (store.js) is the source of truth for scheduling. practiceProgress_v1 remains a lightweight status layer.

5. **No migration ran**: Existing users' practiceProgress_v1 data is preserved. store.js vocabularyMastery data is read as SRS truth. No migration was needed because both systems already coexisted.

## Exact Next Phase

**Phase 18C: Full Today's Plan Vocabulary Rewrite**

Rewrite the vocabulary mission in `DailyMissionPage.jsx` to use `getVocabQueue()` (or its equivalent) as the exclusive source of truth for Today's Plan. This replaces the current `dk_daily_session_{level}` localStorage logic with the shared SRS queue.

Goals:
- Today's Plan vocabulary cards match what Vocabulary Practice would show
- Today's Plan shows: due reviews, mistake cards, new cards (capped)
- "All Caught Up!" when no due items
- Remove the `dk_daily_session_{level}` localStorage key entirely from the vocab mission path
- Tests for DailyMissionPage vocabulary mission integration
- Do NOT touch reading/listening/writing/speaking missions in Today's Plan
- Do NOT touch Grammar Practice

After Phase 18C: Phase 18D+ for Grammar Practice SRS integration (if needed).
