# deutsch-klinik-qa

QA and regression testing for the deutsch-klinik React/Vite SPA.

## When to Use

Use this skill when:
- Making changes to any source file (JSX, utils, components, pages)
- Before committing or deploying
- Adding new tests
- Diagnosing build failures, lint errors, or test regressions
- Releasing to GitHub Pages

## Files to Inspect

- `package.json` — scripts section (test, build, lint, deploy, validate)
- `vite.config.js` — build configuration
- `eslint.config.js` — lint rules
- `vitest.config.js` — test runner config
- `vitest.workspace.js` — workspace test projects
- `tests/*.test.js` — all test files
- `_verify.cjs` — data validation script
- `scripts/validate-curriculum.js` — curriculum integrity checks
- `scripts/validate-orthography.mjs` — German spelling checks
- `scripts/check-fsp-quality.mjs` — FSP content quality

## Required Checks

### 1. Build
```
npm run build
```
Must succeed with zero errors. Bundle warnings (large chunks) are acceptable.

### 2. Lint
```
npm run lint
```
Must report zero errors. Warnings are acceptable if pre-existing.

### 3. Unit Tests
```
npm test
```
All tests must pass. Compare count against previous known total (currently 366 across 13 files).

### 4. Data Validators
```
node _verify.cjs
node scripts/validate-curriculum.js
node scripts/validate-orthography.mjs
node scripts/check-fsp-quality.mjs
```
Validators may report pre-existing issues (orthography has known false positives). Flag any NEW failures.

### 5. Playwright Tests
Playwright tests live in `tests/` (if any `*.spec.js` exist):
```
npx playwright test
```
Check for:
- Route navigation failures
- Mobile breakpoint rendering
- Console errors during test runs

If no Playwright config or tests exist, note this as a gap.

### 6. Console Error Check (Browser)
After deploy, open the live site in a browser and check DevTools Console for:
- React warnings (hooks, keys, stale closures)
- Missing import errors
- Network/fetch failures (404s on chunks, data files)
- TTS errors (SpeechSynthesis)
- localStorage quota errors

## Commands to Run

```bash
cd deutsch-klinik
npm run build
npm run lint
npm test
node _verify.cjs
node scripts/validate-curriculum.js
node scripts/check-fsp-quality.mjs
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Build fails with syntax error | Missing import, JSX error, undefined variable | Check stack trace, fix the source |
| Lint errors after changes | Unused import/variable, hook dependency missing | Remove unused, add deps to array |
| Tests fail after changes | New test file not matched by vitest config, mock mismatch | Check vitest.workspace.js includes the file |
| Validator reports curriculum gaps | New lesson/data not linked in curriculumMap | Update curriculum map |
| Live site shows blank page | Chunk load failure, build error, routing issue | Check 404s in network tab, rebuild |
| TTS not working | Browser policy, missing `window.speechSynthesis` | Check user gesture requirement |
| Audio mismatch | Stale cache key, wrong index used for audio selection | Verify listening item source of truth |

## Final Report Format

After running QA, report:

```
## QA Results

| Check | Status |
|-------|--------|
| npm run build | PASS/FAIL |
| npm run lint | PASS/FAIL (N warnings) |
| npm test | PASS/FAIL (N passed, M files) |
| Validators | PASS/FAIL |
| Playwright | PASS/FAIL (or N/A) |

## Issues Found
- [list regressions or warnings introduced]

## Known Pre-existing Issues
- [warnings that existed before changes]
```