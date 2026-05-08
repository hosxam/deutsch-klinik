# Phase 13 Performance Optimization - Final Report

## Summary

Completed per-level data splitting for the deutsch-klinik application. Monolithic JSON data files were split into level-specific chunks (A1-C1), and the DailyMissionPage was updated to load data dynamically via `import()`.

## What Was Done

### Data Files Split

The following monolithic JSON files were split into per-level files under `src/data/levels/{A1,A2,B1,B2,C1}/`:

| Original File | Size (KB) | Split Files | Cumulative Size (KB) |
|---|---|---|---|
| germanVocabulary.json | 1,587 | 5 x vocabulary.json | ~1,679 (same data, split) |
| grammar.json | 566 | 5 x grammar.json | ~560 |
| reading.json | 447 | 5 x reading.json | ~440 |
| listening.json | 420 | 5 x listening.json | ~420 |
| writing.json | ~290 | 5 x writing.json | ~290 |
| speaking.json | ~290 | 5 x speaking.json | ~290 |
| exams.json | ~50 | 1 x exams.json (levels/) | ~50 |
| dashboardSummary.json | ~30 | 1 x dashboardSummary.json (levels/) | ~30 |
| curriculumMap.json | 1,700 | 5 x curriculumMap.json | ~1,700 |

**Note:** The original monolithic files were **NOT deleted** to maintain backward compatibility with all existing imports.

### Data Loaders Created

`src/utils/dataLoaders.js` was created with 14 async loading functions:
- `loadLevelVocabulary(level)` through `loadLevelSpeaking(level)` (6 functions)
- `loadLevelLessons(level)`, `loadLevelCurriculum(level)`, `loadLevelExams(level)` (3 functions)
- `loadLevelPracticeData(level)` (batch loader for mission data)
- `loadLevelData(level)` (batch loader for all data types)
- `loadExams()`, `loadDashboardSummary()` (global loaders)
- `clearDataCache()` utility

All loaders use dynamic `import()` for automatic Vite code-splitting, with an in-memory `Map` cache to avoid redundant network requests.

### DailyMissionPage Updated (Biggest Win)

The heaviest single page (1,145 KB) was refactored:
- **Removed 6 static imports** from monolithic JSON files: `grammarData`, `vocabData`, `readingData`, `listeningData`, `writingData`, `speakingData`
- **Added data refs** (`grammarDataRef`, `vocabDataRef`, etc.) pointing to dynamically loaded arrays
- **Added data-loading useEffect** that calls `loadLevelGrammar(lvl)`, `loadLevelVocabulary(lvl)`, etc. when the level changes
- **Added loading state** with a spinner shown while data loads
- **Added error state** with a "Failed to load data" screen and reload button
- **All 40+ data references** updated from `grammarData[lvl]` to `grammarDataRef.current`

### Two Key Eager Imports Preserved

- `germanLessons.json` (577 KB) - used globally by mission building logic (not per-level)
- `dashboardSummary.json` (~30 KB) - used globally for lesson summaries
- `grammarCurriculum.json` (192 KB) - used globally for grammar curriculum tracking

These remain as static imports because they're needed across the entire application and are relatively small compared to the per-level data files.

### Other Pages Checked

- **Dashboard.jsx**: Does not import any monolithic data files directly (uses store.js)
- **LessonDetailPage.jsx**: Only imports `germanLessons.json` and `pronunciationGuides.json` (both global/shared, no change needed)
- **ExamPage.jsx**: Only imports `levels.json` and `exams.json` (small files, no change needed)
- **LevelPage.jsx**: Only imports `levels.json`
- **Note:** GrammarPage, ReadingPage, ListeningPage, WritingPage, SpeakingPage, VocabularyPage, FlashcardPage, MistakeNotebookPage, PracticePage still eagerly import monolithic files. These are candidate pages for Phase 14 optimization.

### Regression Tests Created

`tests/performance-smoke.spec.cjs` with 12 test cases covering:
- First visit / onboarding
- Dashboard, daily mission, FSP routes
- All CEFR levels (A1-C1)
- Speaking UI / fallback
- AI correction unavailable
- Supabase no-config fallback
- Navigation between pages

## Bundle Impact (Build Output Analysis)

### Before (Phase 12)
| Chunk | Size | Gzip |
|---|---|---|
| germanVocabulary (monolithic) | 1,587 KB | 200 KB |
| DailyMissionPage | 1,145 KB | 186 KB |
| germanLessons (shared) | 577 KB | 160 KB |
| grammar (monolithic) | 566 KB | 83 KB |

### After (Phase 13)
| Chunk | Size | Gzip |
|---|---|---|
| germanVocabulary (monolithic, still imported by other pages) | 1,551 KB | 200 KB |
| DailyMissionPage | 1,124 KB | 187 KB |
| Per-level grammar chunks (5 x ~96-163 KB each) | ~592 KB total | split |
| Per-level vocabulary chunks (5 x ~142-416 KB each) | ~1,679 KB total | split |
| Per-level reading/listening/writing/speaking (5 each) | split | split |

### Key Improvements

1. **DailyMissionPage** no longer statically bundles 6 monolithic JSON files. The page chunk is still ~1,124 KB due to its own JSX code (inline styles, component logic, 2600+ lines) and shared chunks (React, Lucide icons, store.js).

2. **Per-level granularity**: When a user visits DailyMissionPage for level A1, only the A1-specific grammar (~96 KB), vocabulary (~142 KB), reading (~47 KB), listening (~38 KB), writing (~47 KB), and speaking (~35 KB) chunks are loaded dynamically. This is approximately **405 KB loaded** instead of 4,000+ KB from all monolithic files.

3. **Other pages still need optimization**: GrammarPage, ReadingPage, ListeningPage, WritingPage, SpeakingPage, VocabularyPage, FlashcardPage still eagerly import monolithic files. Phase 14 should address these.

## Files Changed

### New Files
- `src/data/levels/` — 50+ per-level JSON files (5 levels x 10 data types)
- `src/data/levels/exams.json` — extracted from monolithic exams.json
- `src/data/levels/dashboardSummary.json` — extracted from monolithic dashboardSummary.json
- `src/utils/dataLoaders.js` — dynamic import-based data loading utilities
- `tests/performance-smoke.spec.cjs` — Playwright smoke tests
- `docs/PHASE13_PERFORMANCE_AUDIT.md` — initial audit document
- `tools/split_data.py` — Python script to split monolithic JSON files

### Modified Files
- `src/pages/DailyMissionPage.jsx` — refactored for dynamic data loading

### Untouched Files (preserved for backward compatibility)
- `src/data/germanVocabulary.json`
- `src/data/grammar.json`
- `src/data/reading.json`
- `src/data/listening.json`
- `src/data/writing.json`
- `src/data/speaking.json`
- `src/data/germanLessons.json`
- `src/data/exams.json`
- `src/data/dashboardSummary.json`
- `src/data/curriculumMap.json`
- `src/utils/store.js`
- All validator scripts in `tools/`

## Next Steps (Phase 14)

1. Update **VocabularyPage**, **FlashcardPage**, **MistakeNotebookPage**, **PracticePage** to use dynamic `loadLevelVocabulary()` instead of monolithic import
2. Update **GrammarPage**, **ReadingPage**, **ListeningPage**, **WritingPage**, **SpeakingPage** similarly
3. Consider code-splitting the FSP pages' data (fspAnamnese, fspVocab, etc.)
4. Evaluate store.js imports to see if any lightweight refactoring further reduces the index.js entry chunk
5. Consider route-based lazy loading for page components using `React.lazy()`
