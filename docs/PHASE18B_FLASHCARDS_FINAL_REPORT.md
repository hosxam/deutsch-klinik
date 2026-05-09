# Phase 18B: Replace Vocabulary Practice with Flashcards

**Status: Complete** ✅

## Summary

Removed the dedicated Vocabulary Practice page as a standalone entry point. Flashcards are now the main vocabulary practice system, sharing the same SRS queue and SM-2 scheduling.

## Changes Made

### 1. Practice Hub (PracticeHubPage.jsx)
- Removed "Vocabulary Practice" card entirely
- Removed `BookOpen` icon import
- "Flashcards" card remains with `BookMarked` icon, linking to `/level/:levelId/vocabulary/flashcards`

### 2. Route Redirect (App.jsx)
- Added new `VocabPracticeRedirect` component
- Old route `/level/:levelId/vocabulary/practice` now redirects to `/level/:levelId/vocabulary/flashcards`
- Removed unused `PracticePage` lazy import

### 3. Vocabulary Page (VocabularyPage.jsx)
- Changed "Practice" button to "Flashcards" button
- Updated icon from `BookOpen` to `BookMarked`
- Link now points to `/level/:levelId/vocabulary/flashcards`

### 4. FlashcardPage (Full Rewrite)
The FlashcardPage was rewritten to be the main vocabulary practice system:

**Session Setup Screen:**
- Size selector: 5, 10, 15, 20, 25 cards (default 20)
- Shows queue stats: Due count, New count, Mistakes count
- Search bar + level filter + medical keyword filter
- "All Caught Up" empty state messaging

**Card Type Generation (`generateCardTypes`):**
- `meaning` - Front: article + word (plural in parentheses for nouns), Back: translation
- `article` (noun only) - Front: "Article of [word]?", Back: article + word
- `plural` (noun with plural only) - Front: "Plural of [article word]?", Back: plural form
- Stable card IDs format: `${wordRef}_${cardType}` (e.g. `A1_7_article`)
- Non-nouns only get meaning cards

**Queue Building (`buildFlashcardQueue`):**
- Priority: due reviews > mistake cards > new cards
- New cards capped at 10 per session
- Total queue capped at sessionSize
- Due/mistake cards: all supported card types included
- New cards: only meaning card type (simpler intro)

**Session UI:**
- 4 rating buttons: Again (red), Hard (orange), Good (green), Easy (cyan)
- Rating history mini-bar during session
- Session complete screen with rating breakdown
- Exit button returns to session setup

**SM-2 Scheduling (via store.js `recordVocabAnswer`):**
| Rating | Interval | Ease Change | Reappearance |
|--------|----------|-------------|--------------|
| Again (1) | Reset to 0 | -0.2 (min 1.3) | Same day |
| Hard (2) | 1.2x previous | -0.15 (min 1.3) | Sooner than Good |
| Good (3) | Standard SM-2 | +0.15 (max 3.0) | After full interval |
| Easy (4) | 1.3x bonus | +0.30 (max 3.0) | Farthest out |

### 5. Today's Plan Integration
- DailyMissionPage already uses `getDueVocabWords()` from store.js (same SRS queue)
- No changes needed - shares the same filter logic
- Due cards appear, not-due cards excluded, mistake cards prioritized

### 6. Tests Added (tests/srs-queue.test.js)

**New test blocks (34 new tests, 66 total):**

**Phase 18B: Flashcard generateCardTypes (10 tests)**
- Meaning card generated for any word
- Article card generated for noun
- Article card NOT generated for non-noun
- Plural card generated for noun with plural
- Plural card NOT generated for non-noun
- Plural card NOT generated for noun without plural
- All 3 card types generated for noun with article + plural
- Stable card IDs (level_id_cardtype)
- Meaning card includes plural info for nouns
- Meaning card does NOT include plural for non-nouns

**Phase 18B: Flashcard buildFlashcardQueue (9 tests)**
- Due review cards appear first
- Mistake cards before new cards
- New cards capped at 10
- Queue capped at sessionSize (5/15/25)
- Reasonable cap (not all words)
- Different card types for nouns in due queue
- New cards only get meaning type
- Article card only for nouns
- Plural card only for nouns with plural
- Session sizes 5/10 produce correct counts
- 803 word pool capped at 25

**Phase 18B: SM-2 Scheduling Rules (7 tests)**
- Good card does not reappear immediately
- Easy schedules farther than Good
- Hard schedules sooner than Good
- Again schedules short relearning (same day)
- Easy does not reappear before due
- Hard after 1st answer schedules tomorrow
- Mastered + future due excluded

**Phase 18B: Today Plan Integration (5 tests)**
- Due cards appear in Today Plan
- Not-due cards do NOT appear
- Mistake cards prioritized before new
- New cards within daily cap (10 max)
- Correctly answered cards do not reappear until due

## Build Results
- **npm run build**: ✅ Passed (1905 modules transformed, 0 errors)
- **npm run lint**: ✅ Passed (0 errors, 73 pre-existing warnings)
- **npm test**: ✅ Passed (66 tests, 0 failures, 200ms)

## Git Status
```
M src/App.jsx
M src/pages/FlashcardPage.jsx
M src/pages/PracticeHubPage.jsx
M src/pages/VocabularyPage.jsx
M tests/srs-queue.test.js
?? docs/PHASE18B_FLASHCARDS_FINAL_REPORT.md
?? docs/PHASE18B_FLASHCARDS_IMPLEMENTATION_PLAN.md
```

## Commit
```
d10c6a0 (HEAD -> vocab-import-pipeline) Phase 18B: replace vocabulary practice with flashcards

(combined with previous Phase 18B commit)
```

## Remaining Limitations
1. Grammar, Reading, Listening, Writing, Speaking practice pages still have their own legacy systems
2. Session stats are not persisted across sessions (rating history resets on close)
3. SM-2 ease factor adjustments use simple +/- values, not the full SM-2 algorithm
4. No "all levels" option in flashcard filter (only individual level or medical filter)
5. Plural form display in meaning cards may be redundant with dedicated plural cards

## Next Recommended Phase
- **Phase 18C**: Unify lesson micro-practice to use the same SRS queue as flashcards
- **Phase 19**: Clean up Grammar Practice routing and remove legacy practice pages
