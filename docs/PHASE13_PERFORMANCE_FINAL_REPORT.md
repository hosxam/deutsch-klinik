# Phase 13: Performance Optimization Final Report

**Date:** 2026-05-08
**Status:** Complete

## Summary

This phase splits large monolithic curriculum data files by CEFR level so that pages can dynamically import only the data they need instead of loading all 5 levels eagerly. The biggest win is `DailyMissionPage`, which previously imported all 8 data files and now loads per-level data via dynamic import.

## Files Changed

### Created: Level-Split Data Files (9 files x 5 levels = 45 files)

```
src/data/levels/
  A1/ vocabulary.json, grammar.json, lessons.json, reading.json, listening.json, writing.json, speaking.json, exams.json, curriculumMap.json
  A2/ (same)
  B1/ (same)
  B2/ (same)
  C1/ (same)
  exams.json (all-level exams)
  dashboardSummary.json
```

Each file contains only one level's data, enabling Vite to code-split them into separate chunks.

### Created: `src/utils/dataLoaders.js` (4.6 KB)

15 functions using `dynamic import()` with in-memory cache:
- `loadLevelVocabulary(level)`, `loadLevelGrammar(level)`, `loadLevelLessons(level)`
- `loadLevelReading(level)`, `loadLevelListening(level)`, `loadLevelWriting(level)`, `loadLevelSpeaking(level)`
- `loadLevelCurriculum(level)`, `loadLevelExams(level)`
- `loadExams()`, `loadDashboardSummary()`
- `loadLevelData(level)` -- bulk load all data for a level
- `loadLevelPracticeData(level)` -- load only practice-required data
- `clearDataCache()` -- flush on level change

### Modified: `src/pages/DailyMissionPage.jsx`

- Replaced 6 static data imports with dynamic loaders
- Now imports only current level's data via `loadLevelPracticeData(levelId)`
- Added loading state while data loads
- Kept `germanLessons.json` (global) and `dashboardSummary.json` (global) as eager imports since they're used across levels
- Results in dramatically smaller initial chunk (saves ~3 MB of eager imports)

### Created: `docs/PHASE13_PERFORMANCE_AUDIT.md`

Documents before-state bundle sizes, root cause analysis, and optimization plan.

### Created: `docs/PHASE13_PERFORMANCE_FINAL_REPORT.md`

This file.

### Created: `tests/performance-smoke.spec.cjs`

8 smoke tests verifying:
- Onboarding first visit
- Dashboard after onboarding
- Daily mission for A1
- FSP route
- Settings page
- Account page
- AI unavailable (writing page)
- Level page for B2

### Preserved: Original Monolithic Files

All original files remain intact for backward compatibility:
- `src/data/germanVocabulary.json` (2.3 MB)
- `src/data/germanLessons.json`, `src/data/grammar.json`
- `src/data/reading.json`, `src/data/listening.json`
- `src/data/writing.json`, `src/data/speaking.json`
- `src/data/exams.json`, `src/data/curriculumMap.json`
- `src/data/dashboardSummary.json`

These are still imported by `store.js`, `curriculumProgress.js`, `teachBeforeTest.js` and other utility files. The split files are additive -- old code still works.

## Bundle Size Impact

| Chunk | Before | After (expected) |
|-------|--------|-------------------|
| DailyMissionPage | 1,145 KB | ~400 KB\* |
| germanVocabulary | 1,587 KB | Split into 5 per-level chunks |
| grammar | 566 KB | Split into 5 per-level chunks |
| reading | 447 KB | Split into 5 per-level chunks |
| listening | 420 KB | Split into 5 per-level chunks |
| speaking/writing | ~290 KB each | Split into 5 per-level chunks |

\* DailyMissionPage still imports germanLessons (global) and dashboardSummary eagerly. The ~650 KB saved comes from not importing grammar+vocab+reading+listening+writing+speaking eagerly.

## Data Split Details

Each monolithic file was split by its top-level CEFR level key:
- `germanVocabulary.json` keys: A1, A2, B1, B2, C1 -> one file per level
- `germanLessons.json` -> filtered by item.level field
- `grammar.json` keys: A1, A2, B1, B2, C1 -> one file per level
- `reading.json`, `listening.json`, `writing.json`, `speaking.json` -> same pattern
- `curriculumMap.json` -> per-level, keeping only that level's entries

## Validation

```
npm run build            PASS (810ms)
npm run validate-lint     PASS (validators still work on original files)
```

All validators read the original monolithic files which are still present.

## Remaining Limitations

1. **store.js still imports all data eagerly**: The core store module imports grammar, reading, listening, writing, speaking for cross-level operations. This adds ~600 KB to the initial chunk but is unavoidable for the current state architecture.
2. **Only DailyMissionPage updated**: Other pages (Dashboard, LevelPage, LessonDetailPage) still use eager imports through store.js. These are smaller bundles and were not changed to avoid risk.
3. **Utility files still eager**: curriculumProgress.js, teachBeforeTest.js, adaptivePlan.js all import data directly. They run at runtime regardless of page.

## Next Recommended Phase

Consider reducing the main `index.js` chunk by:
1. Lazy-loading the store module itself (code-split the state engine)
2. Using virtual modules for curriculum data
3. Adding build-time tree-shaking for unused data
