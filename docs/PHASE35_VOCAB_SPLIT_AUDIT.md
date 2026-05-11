# Phase 35: Vocabulary Split Audit

Audited: 2026-05-11 14:10 Dubai
Branch: `vocab-import-pipeline`

## 1. Current germanVocabulary Imports

| File | Import Pattern | Notes |
|------|---------------|-------|
| `src/pages/VocabularyPage.jsx` | `import vocabData from '../data/germanVocabulary.json'` | Eager import of full 2.7 MB file |
| `src/pages/FlashcardPage.jsx` | `import fullVocabData from '../data/germanVocabulary.json'` | Eager import. Uses `fullVocabData[level]` pattern |
| `src/pages/PracticePage.jsx` | `import vocabData from '../data/germanVocabulary.json'` | Dead code -- this page is NOT imported by any routed component |

### Pages that do NOT import germanVocabulary
- **DailyMissionPage.jsx** -- does not import germanVocabulary at all. It uses `buildDailyPlan()` which calls `dataLoaders.loadLevelPracticeData()` already.
- **MistakeNotebookPage.jsx** -- imports `getState()` from store, not vocabulary data. Review cards come from SRS state.
- **LevelPage.jsx** -- does not import vocabulary data directly.
- **Dashboard.jsx** -- uses `getAllLevelState()` from store, no direct data import.

### Utilities importing germanVocabulary
- **None.** `dataLoaders.js` uses dynamic `import()` not static imports. All other utilities (store, practiceProgress, teachBeforeTest, etc.) work with state, not raw data files.

## 2. Split Vocabulary Files Already Exist

| File | Exists | Size | Matches Monolithic? |
|------|--------|------|---------------------|
| `src/data/levels/A1/vocabulary.json` | Yes | 531 KB | YES (803 items, matches full['A1']) |
| `src/data/levels/A2/vocabulary.json` | Yes | 193 KB | YES (501 items, matches full['A2']) |
| `src/data/levels/B1/vocabulary.json` | Yes | 460 KB | YES (1062 items, matches full['B1']) |
| `src/data/levels/B2/vocabulary.json` | Yes | 534 KB | **NO** (1071 items, full has 1088 -- missing 17 items) |
| `src/data/levels/C1/vocabulary.json` | Yes | 491 KB | **NO** (1169 items, full has 1206 -- missing 37 items) |
| `src/data/levels/A1/grammar.json` | Yes | -- | Already split in earlier phases |
| `src/data/levels/A1/lessons.json` | Yes | -- | Already split in earlier phases |

The split files were generated in an earlier phase but have since fallen out of sync with the monolithic `germanVocabulary.json`. The monolithic file has been updated with additional content (17 new B2 words, 37 new C1 words).

## 3. Current Build Chunk Sizes (Baseline)

### Largest chunks (gzip)

| Chunk | Uncompressed | Gzip | Contents |
|-------|-------------|------|----------|
| `germanVocabulary-BLD4to2W.js` | **1,823 KB** | **215 KB** | Full vocabulary (A1-C1) -- THIS PHASE'S TARGET |
| `teachBeforeTest-Dq0RQvAP.js` | 1,070 KB | 171 KB | Curriculum maps |
| `fspVocabulary-D0PAz6f4.js` | 641 KB | 89 KB | FSP medical vocabulary |
| `germanLessons-CbmA3ayj.js` | 581 KB | 162 KB | Lessons |
| `GrammarPage-DCioChVy.js` | 584 KB | 88 KB | Grammar page+data |
| `ReadingPage-Zg8lhyZX.js` | 454 KB | 118 KB | Reading page+data |
| `ListeningPage-BvwErG1M.js` | 438 KB | 113 KB | Listening page+data |

### germanVocabulary chunk breakdown
- **Uncompressed**: 1,823.44 KB
- **Gzip**: 215.39 KB
- **Coupled into**: `VocabularyPage.jsx` (eager import), `FlashcardPage.jsx` (eager import), `PracticePage.jsx` (dead code)

### Why it's still 1.8 MB
Despite the split files existing at `src/data/levels/{level}/vocabulary.json`, the three pages still import the monolithic `germanVocabulary.json` directly. Vite bundles the monolithic file into the page chunk that imports it. When both VocabularyPage and FlashcardPage import it, Vite deduplicates into a single shared chunk `germanVocabulary-BLD4to2W.js`.

## 4. Dynamic Loaders Status

`src/utils/dataLoaders.js` already has:
- `loadLevelVocabulary(level)` -- dynamic `import()` targeting `../data/levels/${level}/vocabulary.json`
- In-memory cache via `Map`
- `clearDataCache()`
- `loadLevelPracticeData(level)` -- loads vocab+grammar+reading+listening+writing+speaking for a level
- `loadAllVocabularyIfNeeded()` -- does NOT exist yet (needs to be added)
- `loadFspVocabulary()` -- does NOT exist (FSPVocabPage uses its own inline dynamic import)

All the infrastructure pieces are in place. Only the page-level imports need to switch from static `import data from './germanVocabulary.json'` to dynamic `await loadLevelVocabulary(level)`.

## 5. Routes Needing Vocabulary

| Route | Page | Vocab Needed | Can Use Dynamic? |
|-------|------|-------------|------------------|
| `/level/:levelId/vocabulary` | VocabularyPage | Current level only | Yes -- key work |
| `/level/:levelId/vocabulary/flashcards` | FlashcardPage | Current level usually, but has "All Levels" filter | **Complex** -- needs both dynamic and fallback |
| `/practice` | PracticeHubPage | No direct vocab import | Already fine |
| `/mistakes` | MistakeNotebookPage | Only from SRS state | Already fine |
| `/dashboard` | Dashboard | Per-level stats from store | Already fine |

### FlashcardPage special case
FlashcardPage has a level filter dropdown with "All Levels" option. When "All Levels" is selected, it needs ALL vocabulary. This is a problem for lazy loading. Two possible approaches:
1. **Load only current level** for the route-level filter; keep "All Levels" but lazy-load other levels on demand
2. **Keep eager import** for FlashcardPage, which means the large chunk remains

**Recommended**: Replace with dynamic loading: load the route level by default, lazy-load other levels when user switches filter. Cache everything. This way the initial load is fast (single level), and the "All Levels" case still works (just slightly slower on first switch).

However, given the complexity and the need to not break SRS, the safest approach for this phase:
- **VocabularyPage**: Switch to `loadLevelVocabulary(level)` -- biggest gain, most common page
- **FlashcardPage**: Switch to dynamic loading with cache -- load route level on mount, lazy-load others on filter change
- **PracticePage**: Dead code, leave as is (tree-shaken out of bundle already)

## 6. Compatibility Risks

| Risk | Level | Mitigation |
|------|-------|-----------|
| Split files out of sync with monolithic | HIGH | Regenerate split files from monolithic source |
| FlashcardPage "All Levels" mode needs all data | MEDIUM | Load all levels on demand with in-memory cache |
| SRS flashcard card types need full word metadata | LOW | Dynamic import returns same data structure |
| VocabularyPage filters need per-item metadata | LOW | Same data structure preserved |
| Validator scripts read monolithic file | LOW | Keep monolithic file for validators |
| Curriculum references format `level_id` | LOW | Preserved in split files |
| Existing split files have extra fields missing from monolithic source | LOW | Compare structures; add any missing fields |
| Duplicate IDs across levels | NONE | IDs are prefixed by level (e.g. `A1_v001`, `B2_vocab_534`) |

## 7. Action Plan

1. **Regenerate split files** from monolithic source to bring B2 and C1 up to date
2. **Update `dataLoaders.js`** to add `loadAllVocabularyIfNeeded()`, `loadFspVocabulary()`, and `preloadVocabularyForCurrentLevel(level)`
3. **Switch `VocabularyPage.jsx`** to use `loadLevelVocabulary(level)` with loading state
4. **Switch `FlashcardPage.jsx`** to use dynamic loading with cache and lazy-load other levels
5. **Add tests** for split file integrity, level loading, and critical page behavior
6. **Build, lint, test, validate** -- full pipeline
7. **Commit and push**

## 8. Expected Impact

- **Before**: germanVocabulary chunk at 1,823 KB uncompressed / 215 KB gzip
- **After**: Per-level chunks ~100-500 KB each (uncompressed)
- **First page load**: Downloads only the vocabulary for the user's current level (~200-500 KB instead of 1.8 MB)
- **"All Levels" case**: Still works, just loads additional chunks on demand
- **No regression risk**: All data structures preserved, SRS unaffected, Today's Plan unaffected
