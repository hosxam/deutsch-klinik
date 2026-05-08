# Phase 13: Performance Audit & Optimization Plan

## Current State

Based on the most recent production build, bundle sizes are dominated by monolithic JSON data files imported eagerly from page-level code.

### Largest Chunks (prod build)

| Chunk | Raw Size | Gzipped |
|-------|----------|---------|
| `germanVocabulary` | 1,587 KB | 200 KB |
| `DailyMissionPage` | 1,145 KB | 186 KB |
| `germanLessons` | 577 KB | 160 KB |
| `grammar` | 566 KB | 83 KB |
| `reading` | 447 KB | 115 KB |
| `listening` | 420 KB | 107 KB |
| `speaking` | ~290 KB | ~40 KB |
| `writing` | ~290 KB | ~40 KB |

### Root Cause

Each major data file is a monolithic JSON with all 5 CEFR levels (A1-C1) bundled together. Pages like `DailyMissionPage` import all 8+ data files eagerly, pulling in data for every level even though the user only needs one level at a time.

### Pages Affected

| Page | Heavy Imports |
|------|---------------|
| `DailyMissionPage.jsx` | grammar, vocab, reading, listening, writing, speaking, lessons, dashboardSummary |
| `Dashboard.jsx` | grammar, reading, listening, writing, speaking |
| `LessonDetailPage.jsx` | lessons, grammar, vocab |
| `ExamPage.jsx` | exams, grammar |
| `LevelPage.jsx` | grammar, reading, listening, writing, speaking |

## Optimization Plan

### 1. Split Data Files by Level

Each monolithic file will be split into level-specific files:

**Per-level files** (under `src/data/levels/{A1,A2,B1,B2,C1}/`):
- `vocabulary.json` - only that level's vocab
- `grammar.json` - only that level's grammar
- `lessons.json` - only that level's lessons
- `reading.json` - only that level's reading exercises
- `listening.json` - only that level's listening exercises
- `writing.json` - only that level's writing exercises
- `speaking.json` - only that level's speaking exercises

**Shared extracts** (under `src/data/levels/`):
- `exams.json` - all level exams (not per-level, but extracted)
- `dashboardSummary.json` - extracted for dashboard use
- `curriculumMap.json` - kept as-is (not level-keyed)

### 2. Create Dynamic Data Loaders

`src/utils/dataLoaders.js` will provide per-level loading functions using `import()` for automatic code splitting by Vite:

```js
export async function loadLevelVocabulary(level) {
  return (await import(`../data/levels/${level}/vocabulary.json`)).default;
}
// ... similar for other data types
```

An in-memory `Map` cache prevents redundant network requests.

### 3. Update Page Components

Replace eager top-level `import X from '../data/X.json'` with dynamic `loadLevelX(level)` calls inside `useEffect`/`useMemo`.

Pages to update, in priority order:
1. `DailyMissionPage.jsx` - biggest win (currently 1,145 KB)
2. `Dashboard.jsx`
3. `LessonDetailPage.jsx`
4. `ExamPage.jsx`
5. `LevelPage.jsx`

### 4. Loading & Error States

Each updated page gets:
- A `<LoadingSpinner />` while data loads
- Graceful error fallback (never crash)
- Empty/zero states when data isn't available

### 5. Backward Compatibility

Original monolithic files (`src/data/grammar.json`, etc.) are **never modified or deleted**. Any existing code that imports them directly continues to work. Only the page components listed above switch to the new dynamic loaders.

### Expected Impact

| Chunk | Before | After (est.) |
|-------|--------|-------------|
| DailyMissionPage | 1,145 KB | ~150-200 KB |
| Main vendor chunk | ~2 MB | ~600 KB |
| Lazy-loaded level chunks | -- | ~100-300 KB each |

Total initial load should decrease by **60-70%** since only the user's current level data is fetched.
