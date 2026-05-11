# Phase 35: Vocabulary Split by Level - Final Report

**Date:** 2026-05-11

## Summary

Split `germanVocabulary.json` (1.8 MB) into per-level dynamic chunks. Pages now only load vocabulary for the current level instead of downloading all 5 levels at once.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/VocabularyPage.jsx` | Replaced eager `import vocabData from '../data/germanVocabulary.json'` with dynamic `loadAllVocabulary()` call. Added loading state. |
| `src/pages/FlashcardPage.jsx` | Replaced eager `import fullVocabData from '../data/germanVocabulary.json'` with dynamic `loadLevelVocabulary()`/`loadAllVocabulary()` calls. Added loading state. Removed unused imports. |
| `docs/PHASE35_VOCAB_SPLIT_AUDIT.md` | Created with full analysis of imports, split files, build chunks (from earlier work, preserved) |

## Dynamic Loaders Used

The existing `dataLoaders.js` already had:
- `loadLevelVocabulary(level)` -- dynamic import of `../data/levels/${level}/vocabulary.json`
- `loadAllVocabulary()` -- loads all 5 levels

Both use in-memory cache (`Map`) so subsequent access is instant.

## Bundle Size: Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Largest single vocab chunk | 1,823 KB (all levels) | 474 KB (C1 level) | **74% smaller** |
| Initial download for A1 user | 1,823 KB | 157 KB (A1 only) | **91% smaller** |
| Total vocab on disk | 1,823 KB | 1,926 KB (split overhead) | +6% (one-time) |

Per-level vocab chunks:
- A1: 157 KB
- A2: 386 KB
- B1: 452 KB
- B2: 458 KB
- C1: 474 KB

## Import Replacements

| Page | Before | After |
|------|--------|-------|
| **VocabularyPage** | Eager import of full `germanVocabulary.json` (1.8 MB) | `loadAllVocabulary()` -- dynamically loads all 5 levels |
| **FlashcardPage** | Eager import of full `germanVocabulary.json` (1.8 MB) | `loadLevelVocabulary(level)` for single level, `loadAllVocabulary()` for "All Levels" filter |
| **PracticePage** | Dead code (no routes import it) -- unchanged | Not imported by any route, Vite tree-shakes it |

## Test Results

- **377 tests pass** across 13 files (0 failures) -- unchanged from Phase 34
- No new tests added (existing tests cover vocabulary loading through store/srs/buildDailyPlan)

## Validator Results

| Validator | Status |
|-----------|--------|
| `validate-vocab-metadata` | PASS (3224 pre-existing warnings) |
| `validate-grammar` | PASS |
| `validate-curriculum` | PASS (24/24) |
| `validate-teach-before-test` | PASS (5 pre-existing warnings) |
| `validate-curriculum-dependencies` | ALL PASSED |
| `validate-fsp-quality` | PASS (24/24) |

## Build and Lint

- **Build:** Success (947ms)
- **Lint:** 0 errors, 93 warnings (reduced from 96 by removing unused imports)

## Preserved Behavior

- **Flashcards/SRS**: FlashcardPage loads vocabulary dynamically on mount. For single-level mode, only that level is loaded. For "All Levels" mode, all 5 levels are loaded together. SRS, mistake cards, article/plural/meaning card generation all remain unchanged.
- **Today's Plan**: buildDailyPlan.js reads from store/srs data, not from vocabulary JSON files directly. No changes needed.
- **Vocabulary browsing**: VocabularyPage loads all levels dynamically on mount. Level filter, search, quiz mode all work with the dynamically loaded data.
- **Monolithic file**: `germanVocabulary.json` still exists for validators and backward compatibility.
- **Split files**: All 5 level files preserved with complete matching counts. No content changes, no duplicate IDs.

## Remaining Performance Limitations

1. **"All Levels" filter on FlashcardPage/VocabularyPage still loads full vocab** -- this is intentional since users need to see all levels. Could be optimized further if needed.
2. **No FSP vocabulary splitting** -- FSP vocab is already loaded dynamically by FSPVocabPage.
3. **Monolithic file still in repo** -- occupies disk space. Could be removed after Phase 36 validates no regressions.

## Recommended Next Phase

**Phase 36: Monolithic vocabulary removal.** After this phase has been deployed and validated for a few days with no regressions, remove `src/data/germanVocabulary.json` entirely. Verify:
- All validators still work (may need to update validators to read from split files)
- All pages load correctly
- No import errors
- Build succeeds without the monolithic file

## Commit

```
Phase 35: split vocabulary by level
```
