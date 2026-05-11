# deutsch-klinik-performance

Performance, bundle size, and dead code audit for the deutsch-klinik SPA.

## When to Use

Use this skill when:
- Analyzing build output for large chunks
- Investigating slow page loads
- Checking lazy loading effectiveness
- Finding unused or dead code
- Identifying duplicate data imports
- Planning performance improvements
- Reviewing mobile performance

## Files to Inspect

- `vite.config.js` — build config, manualChunks, code splitting
- `index.html` — entry point, script loading
- `src/pages/` — all page components (candidates for lazy loading)
- `src/utils/` — all utility files
- `src/data/` — data files (likely the largest assets)
- `package.json` — dependencies, scripts
- Build output: `dist/` directory after `npm run build`

## Required Checks

### 1. Bundle Size
After `npm run build`, check `dist/` output:
- Identify chunks > 500 KB gzipped (or > 1300 KB minified, which triggers vite warnings)
- Largest chunks: germanVocabulary (~1.8 MB), teachBeforeTest (~1 MB)
- Check which pages import which data files

### 2. Lazy Loading
- Verify pages are code-split via `React.lazy()` or dynamic `import()`
- Check that data files are not imported in the entry chunk
- Confirm that ListeningPage, ReadingPage, GrammarPage (large) are lazy-loaded
- Verify Dashboard chunk includes only Dashboard dependencies

### 3. Data Splitting
- Large vocabulary data (~1.8 MB) should be split by level or alphabetically
- Lesson data should not be bundled into every page that references it
- Check if `dataLoaders.js` loads data lazily or eagerly

### 4. Dead Code
- Search for:
  - Unused imports (cross-reference with lint results)
  - Unused utility functions
  - Old state format references (`practiceProgress_v1`, `lessonListening_v1`)
  - Commented-out code blocks
  - Redundant helper functions

### 5. Duplicate Data
- Check if the same data is loaded in multiple chunks
- Look for data files imported in both page components AND utility modules
- Verify curriculum data is not duplicated across chunks

### 6. Mobile Performance
- Check if heavy pages render on mobile viewport
- Verify no forced synchronous layouts
- Check for render-blocking resources
- Verify image assets are sized appropriately

### 7. Import Analysis
Check which modules import which data files:
```
npm run build -- --report     # if vite-plugin-visualizer is configured
```
Or manually inspect import chains in key files.

## Commands to Run

```bash
cd deutsch-klinik
npm run build
npm run lint
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|------|
| Chunk > 500 KB gzip | Large data file bundled eagerly | Lazy-load or split data by level |
| Entry chunk too large | Data imported in root component | Move data imports to lazy-loaded pages |
| Data duplicated across chunks | Same file imported by multiple pages | Extract shared data reference |
| Build warning on chunk size | threshold > 1300 KB minified | Acceptable for data-heavy chunks, but note in report |
| Dead code in build | Unused imports survive tree-shaking | Remove unused imports |
| Slow page transition | Eager chunk loading | Add React.lazy() for heavy pages |

## Final Report Format

```
## Performance Audit

| Metric | Value |
|--------|-------|
| Largest chunk (uncompressed) | N KB |
| Largest chunk (gzip) | N KB |
| Number of chunks | N |
| Entry chunk size | N KB |
| Build time | N ms |

## Chunk Analysis

| Chunk | Size (gzip) | Contents |
|-------|------------|----------|
| index-*.js | N KB | Core framework, routing |

## Issues Found
- [large chunks, dead code, duplicates]

## Recommendations
- [code splitting, data splitting, dead code removal]
```