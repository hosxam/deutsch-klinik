# Listening Persistence and Vocab Mistake Flashcards Fix Report

## Overview

Fixed two bugs: listening practice status not persisting across navigation, and vocabulary mistakes not appearing with rich context in Mistake Notebook. Verified Supabase migrateLocalToCloud is safe.

## Part 1: Listening Status Persistence

The listening persistence bug was already fixed in a previous commit (`c29bfa5c`) by changing both `ListeningPage.jsx` and `ReadingPage.jsx` from index-based keys (`listening_A1_0`) to stable item-ID-based keys (`listening_A1_A1_listen_1`). This fixed the key format mismatch with `DailyMissionPage` which used item-ID keys.

**Files changed (from previous fix):**
- `src/pages/ListeningPage.jsx` — stable item ID in `submitAll` and `listeningStatuses`
- `src/pages/ReadingPage.jsx` — same fix for reading exercises
- `tests/reading-listening.test.js` — added 2 persistence tests

## Part 2: Vocabulary Mistake Flashcards

### Root Cause

`recordVocabAnswer()` in `store.js` already called `recordAnswer()` for wrong answers, which creates entries in `incorrectAnswers[level]` and `mistakeNotebook`. However, it did not pass the 8th `context` parameter, so vocab mistakes were created without `sourceQuestion`, `sourceType`, `sourceSentence`, or `sourceItemId` fields. This caused `buildMistakeCard()` to render them as "Context missing for this older mistake" fallbacks.

Additionally, `FlashcardPage.jsx` and `VocabularyPage.jsx` did not pass `cardType` or `wordText` in the meta object, so even if context was created, it had no card-type-specific information.

### Fix Applied

**`src/utils/store.js` — `recordVocabAnswer()`:**
- Added context parameter to `recordAnswer()` call with:
  - `sourceQuestion`: e.g., "What is the article of hallo" or "What is the meaning of hallo"
  - `sourceSentence`: example sentence from meta
  - `sourceType`: "article" / "plural" / "meaning"
  - `sourceTitle`: the word text
  - `sourceItemId`: the wordRef
- Added dedup: uses `findLastIndex` to check if same `exerciseId` already exists in `incorrectAnswers[level]` — if so, updates existing entry with incremented `count` instead of creating a duplicate

**`src/pages/FlashcardPage.jsx`:**
- Added `cardType` and `wordText` to the meta object passed to `recordVocabAnswer()`
- `wordText` extracts the clean word from card front text

**`src/pages/VocabularyPage.jsx`:**
- Added `cardType: 'meaning'`, `wordText`, and `exampleSentence` to the meta object passed to `recordVocabAnswer()`

### Verification (8 tests pass)

| Test | Result |
|------|--------|
| Wrong meaning card creates mistake entry | PASS |
| Article card creates mistake with article context | PASS |
| Plural card creates mistake with plural context | PASS |
| Dedup keeps only one entry (increments count) | PASS |
| Mistake appears in getMistakeNotebookItems | PASS |
| SM-2 entry created with mistake_ prefix | PASS |
| Good rating schedules ahead (interval > 0) | PASS |
| buildMistakeCard renders rich context | PASS |

## Part 3: Supabase migrateLocalToCloud Verification

**Status: SAFE — manual only, never automatic**

`migrateLocalToCloud()` is exported from `src/utils/supabaseSync.js` but is **never called automatically** by any React component or sync routine. It is a purely manual function exposed for users who want to explicitly upload their local data to the cloud.

The grep search across all `.jsx` and `.js` files in `src/` found only the `export` line — zero call sites.

The auto-sync flow uses `saveCloudProgress()` which also uses `.upsert()` with `onConflict: 'user_id'`, but it runs only when:
- User manually clicks "Sync" in AuthPanel
- Periodic background check triggers `syncFromCloud()` (cloud → local, not local → cloud)

`syncFromCloud()` downloads cloud data to local, keeping cloud as source of truth. `saveCloudProgress()` uploads local to cloud but is only called explicitly.

**No changes needed.**

## Build / Lint / Test Results

| Check | Result |
|-------|--------|
| `npm run build` | SUCCESS (881ms, 0 errors) |
| `npm run lint` | 0 errors, 91 warnings (all pre-existing) |
| Unit tests | 302/302 pass (11 test files) |
| `srs-queue.test.js` | 67 tests pass |
| `grammar-practice.test.js` | 23 tests pass |
| `reading-listening.test.js` | 25 tests pass |
| `daily-plan-integration.test.js` | 21 tests pass |
| `writing-practice.test.js` | 26 tests pass |
| `speaking-practice.test.js` | 24 tests pass |
| `roleplay-practice.test.js` | 34 tests pass |
| `exam-unlock.test.js` | 20 tests pass |
| `supabase-sync.test.js` | 14 tests pass |
| `auth-sync-safety.test.js` | 38 tests pass |
| `phase20-sync.test.js` | 10 tests pass |

## Files Changed

| File | Change |
|------|--------|
| `src/utils/store.js` | Dedup in `recordAnswer()` + context in `recordVocabAnswer()` |
| `src/pages/FlashcardPage.jsx` | Pass `cardType`, `wordText` to `recordVocabAnswer()` |
| `src/pages/VocabularyPage.jsx` | Pass `cardType`, `wordText`, `exampleSentence` to `recordVocabAnswer()` |

## Remaining Limitations

- Supabase `migrateLocalToCloud` overwrites cloud unconditionally, but is only a manual function — no auto-trigger path.
- Listening status is already fixed — no additional changes needed in this phase.
- Pre-existing lint warnings (91) are untouched — all from imports/references in files not modified by this phase.
- Vocabulary mistakes in Mistake Notebook use `buildMistakeCard()` for rich context rendering. Old contextless mistakes (created before the Phase 30 fix) will still show "Context missing" fallback — this is expected and backward-compatible.
