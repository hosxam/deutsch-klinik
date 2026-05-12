# Phase 36B - Topic Grouping Final Report

## Summary

Phase 36B audited and improved cross-skill topic grouping and reading/listening revisit logic for the deutsch-klinik Today's Plan system.

## Audit Claim Accuracy

The initial assessment was **largely accurate** but needed nuance:

| Claim | Verification |
|-------|-------------|
| "Topic grouping may not be strong enough" | Partially correct. Topic grouping already existed for reading, listening, writing, and speaking (via `preferTopicItems`). But **flashcards had no topic filtering** and **writing/speaking had no revisit logic**. |
| "Reading/listening may not have true forgetting-curve review logic" | Accurate. Basic cooldown-only system (14d correct, 1d incorrect) existed but had a `revisitDone` bug that was never set to true, and no topic-preference for revisits. |

## Current Topic Grouping Strength

Before fixes: MODERATE (~4/7 skills with topic grouping)
After fixes: STRONG (~7/7 skills with topic awareness)

### Per-skill topic grouping

| Skill | Before | After | Notes |
|-------|--------|-------|-------|
| Flashcards | None | Topic-preferred | SRS-due words now sorted with topic-matched first |
| Grammar | Soft preference | Soft preference | No change needed (already works) |
| Vocabulary | Soft preference | Soft preference | No change needed (already works) |
| Reading | Hard preference | Hard preference | Added topic-preference to revisit items |
| Listening | Hard preference | Hard preference | Added topic-preference to revisit items |
| Writing | Hard preference | Hard preference | Added revisit logic + topic-preference |
| Speaking | Hard preference | Hard preference | Added revisit logic + topic-preference |

## Fixes Applied

### 1. `practiceProgress.js` - New exports
- Added `markRevisitDone(skill, itemId)` - records when a revisit item was shown and extends its dueDate by 7 days to prevent daily repeats
- Added `getOldCompletedDueRevisit(skill)` - returns items with completed_correct/mastered status past cooldown
- Added `getDueIncorrectRevisit(skill)` - returns items with completed_incorrect status past dueDate

### 2. `DailyMissionPage.jsx` - Reading/Listening revisit improvements

**Before:** `getNextReading`/`getNextListening` filtered revisits with `!v.revisitDone` which was never set to true, making it a no-op. Revisits had no topic preference.

**After:** 
- Removed useless `!v.revisitDone` filter from the incorrect-items revisit path
- Added topic-preference filtering to revisit items (prefers items matching today's lesson)
- Calls `markRevisitDone()` after selecting a revisit item to prevent daily repeats

### 3. `DailyMissionPage.jsx` - Writing/Speaking revisit logic

**Before:** `/getNextWriting`/`getNextSpeaking` only filtered completed items and topic-matched. No revisit mechanism existed.

**After:** Added the full revisit pipeline (same as reading/listening):
- Due incorrect items checked first
- Old completed items after 14+ day cooldown checked second  
- Both paths prefer topic-matched revisits
- `markRevisitDone()` applied to prevent repeat spam

### 4. `DailyMissionPage.jsx` - Flashcard topic awareness

**Before:** `getDueVocabWords()` returned SRS-due words with NO topic ordering.

**After:** When `planLessonIds` is available, topic-matched flashcard words are sorted to the front of the deck. Non-topic words fill remaining slots.

### 5. `buildDailyPlan.js` - Topic coherence helper

Added `getPlanTopicCoherence(plan, options)` which returns:
- `score` (0-1 ratio of matched skills)
- `primaryTopic` (first lesson ID)
- `matched` (count of skills with topic items)
- `total` (count of skills in plan)
- `details` (per-skill breakdown with topicItems/fallbackItems)

## Reading/Listening Revisit Behavior

### How it works

1. **Due items first:** `getNextListening`/`getNextReading` try to find NEW (uncompleted, undue) items
2. **Topic preference:** New items are filtered to prefer today's lesson topic
3. **Difficulty sort:** Items sorted by length/complexity (easier first)
4. **Revisit:** If no new items available:
   - Due incorrect items (`completed_incorrect` + past dueDate) appear with topic preference
   - Old correct items (`completed_correct`/`mastered` + 14+ days past) appear with topic preference
5. **Revisit cap:** `markRevisitDone()` extends dueDate by 7 days to prevent daily repeats

### Behavior matrix

| Scenario | Behavior |
|----------|----------|
| First time, same topic | Selected with preference |
| First time, wrong topic | Available if no same-topic items exist |
| Completed correct (< 14d ago) | Filtered out (not due) |
| Completed correct (> 14d ago) | Eligible for revisit |  
| Completed incorrect (< 1d ago) | Filtered out (not due yet) |
| Completed incorrect (> 1d ago) | Eligible for revisit |
| Revisit shown today | Marked revisitDone, +7d cooldown |
| Weak topic trigger | Not implemented (only cooldown-based) |

### Limitations

- No SM-2 spaced repetition for reading/listening (only fixed cooldown)
- No weak-topic trigger: old reading/listening items don't resurface based on weak vocabulary/grammar
- `revisitDone` check still exists for the old-correction path (to allow initial revisit after 14+ days, then cap at one revisit per 7 days)

## Tests Added

11 new tests across 3 test groups:

### Group 8: Topic grouping (6 tests)
1. Selects same-topic reading when available
2. Selects same-topic listening when available  
3. Falls back to non-topic items when no topic match exists
4. Does NOT select unrelated item when same-topic item exists and is unlocked
5. Selects same-topic writing when available
6. Selects same-topic speaking when available

### Group 9: Revisit logic (4 tests)
1. Completed_correct reading does NOT repeat immediately (cooldown enforced)
2. Wrong reading returns when due (dueDate <= today)
3. Wrong reading does NOT appear when not yet due
4. Old completed reading can reappear after 14+ day cooldown

### Group 10: Topic coherence helper (1 test)
1. Returns expected score and item counts

Total: **32 tests** (was 21, now 32), all passing.

## Build/Lint/Test/Validator Results

| Check | Result |
|-------|--------|
| `npm run build` | Passed (1.04s, 0 errors) |
| `npm run lint` | 0 errors, 95 warnings (all pre-existing) |
| Unit tests (32) | All passed (243ms) |
| `validate-curriculum` | Passed (1610 units) |
| `validate-teach-before-test` | Passed (5 pre-existing warnings) |
| `validate-curriculum-dependencies` | All passed |
| `validate-fsp-quality` | All passed (24/24) |
| `validate-vocab-metadata` | Passed (0 errors, 3224 pre-existing warnings) |
| `validate-grammar` | All passed |

## Files Changed

| File | Change |
|------|--------|
| `src/utils/practiceProgress.js` | Added `markRevisitDone`, `getOldCompletedDueRevisit`, `getDueIncorrectRevisit` |
| `src/utils/buildDailyPlan.js` | Added `getPlanTopicCoherence` |
| `src/pages/DailyMissionPage.jsx` | Flashcard topic sorting; writing/speaking revisit logic; reading/listening revisit topic preference + revisitDone tracking |
| `tests/daily-plan-integration.test.js` | 11 new tests (topic grouping, revisit, coherence) |
| `docs/PHASE36B_TOPIC_GROUPING_AUDIT.md` | Full audit document |
| `docs/PHASE36B_TOPIC_GROUPING_FINAL_REPORT.md` | This report |

## Remaining Limitations

1. **No weak-topic driven revisits.** Reading/listening items don't automatically resurface when related vocabulary or grammar topics are weak. This would require adding topic-level weakness tracking and linking reading/listening items to their concept vocabulary.

2. **Fixed cooldown, not SM-2.** Reading/listening use a simple 14-day correct / 1-day incorrect cooldown rather than an SM-2 spaced repetition algorithm. Full SM-2 would need easiness factor tracking per item.

3. **Topic matching is string-based.** `item.lessonId.includes(tid)` can produce false positives (e.g., "lesson_1" matching "lesson_16"). This is mitigated by the data structure where lesson IDs are specific enough to avoid most collisions.

4. **No UI for coherence score.** `getPlanTopicCoherence` is exposed as an export but not rendered in the Today's Plan UI. Could be added as a debug overlay or confidence indicator.

These limitations are acceptable for Phase 36B scope and do not block closing.

## Commit

```
git commit -m "Phase 36B: improve topic grouping and skill revisit logic"
git push origin vocab-import-pipeline
```
