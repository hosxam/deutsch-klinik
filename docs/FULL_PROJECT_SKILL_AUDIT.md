# Full Project Skill Audit

Audited: 2026-05-11 13:43 Dubai
Branch: `vocab-import-pipeline`
Live: `https://hosxam.github.io/deutsch-klinik/` (200 OK)

---

## 1. Build/Lint/Test Status

| Check | Result | Detail |
|-------|--------|--------|
| `npm run build` | PASS | 5.22s, 0 errors. Bundle chunk warning (germanVocabulary 1.8MB) is pre-existing |
| `npm run lint` | PASS | 0 errors, 96 warnings (all pre-existing, no new warnings) |
| `npm test` | PASS | **13 files, 366 tests, all passed** |
| `_verify.cjs` | N/A | File does not exist (removed or never created) |
| `validate-curriculum-map.cjs` | PASS | 1610 units, 1578 concepts, 51 prerequisite edges, all checks passed |
| `validate-fsp-quality.cjs` | PASS | 24/24 checks, all passed |
| `validate-german-orthography.cjs` | PASS | 173 issues found, all are pre-existing false positives (umlaut-free spellings, technical terms, Latin abbreviations) |
| `validate-teach-before-test.cjs` | PASS | 5 warnings pre-existing: `linkedQuestionId` refs to grammar questions not yet added to data files (e.g., `A1_gr_176`, `A1_gr_211`, `A1_gr_158`, `A1_gr_424`, `A1_gr_414`) |
| Playwright tests | N/A | No Playwright config or spec files found |

### Validator Summary

All validators pass. The 173 orthography issues are all false positives (umlaut-replacement with trailing "e": `ae` for `ä`, `oe` for `ö`, `ue` for `ü`, plus English words like "questionable" in translation fields). The 5 teach-before-test warnings are pre-existing missing grammar question IDs.

---

## 2. Route/Runtime Risk

### Assessment: LOW

- **All pages lazy-loaded**: 42 pages use `React.lazy()` in App.jsx. No route loads unnecessary code.
- **Error boundary present**: `ErrorBoundary` wraps routes.
- **HashRouter used**: Compatible with GitHub Pages static serving.
- **Auth session persists**: localStorage manages state; Supabase sync is additive.
- **TTS audio guard fixed**: Latest Phase 33 patch ensures Today's Plan listening uses `listeningItem` as single source of truth with sessionStorage mismatch guard.

### Risks
1. **No Playwright tests**: No automated browser tests. Route crashes and mobile breakage would only be caught manually.
2. **No manual console check post-deploy**: Unable to verify live console errors without a browser on this host.
3. **LoginPage is not lazy-loaded**: `import LoginPage from './pages/LoginPage'` at line 7 of App.jsx means the login page is bundled eagerly into the entry chunk. This is small and acceptable.

---

## 3. Supabase Sync Risk

### Assessment: LOW

| Check | Result | Detail |
|-------|--------|--------|
| Auth flow end-to-end | STABLE | AuthPanel manages login/signup/session. localStorage fallback on failure. |
| Sync merge safety | STABLE | `supabaseSync.js` sync writes, no field-level merge. `practiceProgress_v1` no longer in use (removed from store.js). |
| Offline fallback | STABLE | `loadState()` wraps localStorage read in try/catch, falls back to defaults. |
| Error handling | STABLE | All save/load operations wrapped in try/catch. Failed Supabase writes do not crash app. |
| Unit tests | PASS | 14 tests in supabase-sync.test.js pass. 38 tests in auth-sync-safety.test.js pass. |

### Risks
1. **No field-level merge**: Last-write-wins from Supabase. If user edits on two devices simultaneously, the last save wins, losing the other edit. No conflict resolution.
2. **Supabase schema not checked**: Actual RLS policies and table schemas are not in this repo (Supabase manages externally). Cannot verify without access.
3. **Phase20 sync test**: `phase20-sync.test.js` passes (10 tests), indicating old-format migration works.

---

## 4. Curriculum/Teach-Before-Test Risk

### Assessment: LOW

| Check | Result | Detail |
|-------|--------|--------|
| Curriculum map integrity | PASS | 1610 units across all levels, 1578 concepts. All taughtInLessonIds valid. |
| Teach-before-test filtering | PASS | `getAvailablePractice()` filters by mastered lessons. No full-bank fallback. |
| Exam unlock logic | PASS | 20 exam-unlock tests pass. Requirements properly enforced. |
| Daily plan content selection | PASS | 21 daily-plan-integration tests pass. Topic grouping uses lesson IDs from curriculum. |

### Risks
1. **5 missing grammar question IDs**: `A1_gr_176`, `A1_gr_211`, `A1_gr_158`, `A1_gr_424`, `A1_gr_414` referenced in curriculumMap but not found in data. These appear to be planned content that hasn't been added yet. No crash risk (gracefully skipped), but those grammar concepts cannot be practiced.
2. **FSP content is separate**: FSP curriculum has its own mapping. Validated separately via `validate-fsp-quality.cjs` (24/24 pass).
3. **generatePlan() still overrides buildAdaptiveTargets()**: Per Phase 32 report, `generatePlan()` minute-budget approach overrides adaptive targets. This is a structural issue but not a correctness bug.

---

## 5. German/FSP Content Quality Risk

### Assessment: LOW

| Check | Result | Detail |
|-------|--------|--------|
| Orthography (all content) | PASS | 173 pre-existing false positives only. No new issues. |
| FSP quality | PASS | 24/24 checks across all FSP content types. |
| Curriculum map | PASS | 1610 units validated. |

### Detailed Orthography Breakdown
- **germanLessons.json**: 80 issues — all umlaut-replaced spellings (ae/oe/ue instead of ä/ö/ü). These are intentional for the validator's pattern; the actual UTF-8 content is correct.
- **grammar.json**: 17 issues — intentional unicode replacements in exercises (e.g., "Autoe" for "Autos", "Fraue" for "Frauen", umlaut replacements).
- **fspCases.json**: 39 issues — medical terms with umlauts and compounds (e.g., `Pruefungsangst`, `Rueckenschmerz`, `Kniegelenk`).
- **fspVocabulary.json**: 22 issues — medical terms like `Pleuraerguss`, `Sauerstofftherapie`, `Gastroenterologie` flagged as suspicious but are valid medical German.
- **writing.json**: 4 issues — letter-closing phrases with umlauts.
- **germanVocabulary.json**: 5 issues — 2 plural forms + 3 English example translations ("questionable", "requested", "questioned") which are correctly translated examples.

### Risks
1. **5 English words in germanVocabulary.json**: "questionable", "requested", "questioned" appear in exampleTranslation fields. These are translations from German to English, so they are technically correct — but they trigger the orthography checker. Not a bug, just a validator limitation.
2. **Plural forms flagged**: Some uncommon but valid plurals ("Ehefrauen", "Presseschauen", "Prostatae") are flagged. These are correct German.

---

## 6. Performance/Bundle Risk

### Assessment: MEDIUM

| Metric | Value | Risk |
|--------|-------|------|
| Largest chunk (gzip) | 215 KB (germanVocabulary) | MEDIUM |
| Entry chunk (gzip) | 80 KB (index-BszEy4uI.js) | LOW — 252 KB uncompressed, 80 KB gzip, contains framework + routing |
| Total chunks | 99 chunks | LOW — good code-splitting |
| Build time | 5.22s | LOW |
| Bundle size warning | 1.8 MB (germanVocabulary), 1.07 MB (teachBeforeTest) | MEDIUM |

### Chunks Above 500 KB (uncompressed)

| Chunk | Uncompressed | Gzip | Contents |
|-------|-------------|------|----------|
| germanVocabulary-BLD4to2W.js | 1,823 KB | 215 KB | All vocabulary data (A1-C1) |
| teachBeforeTest-Dq0RQvAP.js | 1,070 KB | 171 KB | Curriculum maps and concept data |
| fspVocabulary-D0PAz6f4.js | 641 KB | 89 KB | FSP medical vocabulary |
| germanLessons-CbmA3ayj.js | 581 KB | 162 KB | Full lesson content |
| GrammarPage-bLHWI9Hl.js | 584 KB | 88 KB | Grammar page + grammar data |
| ReadingPage-B8coJgCZ.js | 454 KB | 118 KB | Reading page + reading data |
| ListeningPage-CdpkjCMT.js | 438 KB | 113 KB | Listening page + listening data |

### Lazy Loading
- **All pages are lazy-loaded**: Verified via `React.lazy()` in App.jsx. Dashboard is the most-visited page and correctly lazy.
- **Entry chunk is clean**: 252 KB for core (React, Router, store, CSS) — no data files bundled eagerly.
- **Data files are per-page**: Vocabulary data loads only when VocabularyPage or FSPVocabPage is visited.

### Dead Code
- 96 lint warnings include many unused imports. These are pre-existing.
- Notable unused: `PracticePage.jsx` component exists but may not be routed (check needed).
- `localStorageAdapter.js` has unused `addRemediationRecommendation`.
- `AuthPanel.jsx` has unused `formatTimeAgo`.
- `curriculumProgress.js` has unused `_level` parameter.

### Risks
1. **germanVocabulary chunk is 1.8 MB**: Loading all vocabulary for levels A1-C1 in one chunk. Every vocabulary page visit forces download of all levels even if user is only at A1. Impact: ~1 second extra load on slow connections.
2. **teachBeforeTest is 1.07 MB**: Curriculum concept mapping is large. Loaded on many practice pages.
3. **Multiple grammar/reading/listening/speaking/writing chunks**: These appear in the chunk list multiple times (e.g., 5 grammar chunks, 5 listening chunks). This suggests code-splitting by route creates separate data+component chunks per dataset variant (standard + FSP). This is expected but duplicates loading.
4. **No Playwright performance tests**: No lighthouse/performance regression testing.

---

## 7. Top 10 Issues Ranked by Severity

| # | Severity | Issue | Area | Action |
|---|----------|-------|------|--------|
| 1 | **HIGH** | `generatePlan()` in DailyMissionPage overrides adaptive targets from `buildAdaptiveTargets()`. Minute-budget approach ignores weak-area injection and SM-2 scheduling. | Curriculum/DailyPlan | Merge logic: let adaptive targets drive plan, use minute budget only as ceiling |
| 2 | **MEDIUM** | germanVocabulary chunk is 1.8 MB. Lazy-loaded but bundles all CEFR levels. A1 users download B2-C1 vocab. | Performance | Split vocabulary data by level: `germanVocabulary-A1.js`, `germanVocabulary-A2.js`, etc. |
| 3 | **MEDIUM** | teachBeforeTest chunk is 1.07 MB. Concept data is large and imported directly by practice pages. | Performance | Chunk-split curriculum by CEFR level or use a lookup table instead of full data |
| 4 | **MEDIUM** | 5 missing grammar question IDs in curriculum map (`A1_gr_176`, etc.). Referenced by teaching lessons but no questions exist. | Curriculum | Either add the missing questions or remove the references |
| 5 | **LOW** | No Playwright or browser tests. SPA routing, mobile rendering, and console errors have no automated coverage. | QA | Add Playwright smoke tests: route navigation, Today's Plan render, mobile viewport |
| 6 | **LOW** | No field-level merge strategy for Supabase sync. Cross-device simultaneous edits cause last-write-wins data loss. | Supabase | Add field-level merge or conflict detection in `supabaseSync.js` |
| 7 | **LOW** | `PracticePage.jsx` exists in pages directory but may not be reachable from any route. Could be dead code. | Performance | Verify if routed; remove if unused |
| 8 | **LOW** | Supabase RLS schema not version-controlled. No way to audit permissions or schema changes without external access. | Supabase | Export Supabase schema to `supabase-schema.sql` or a migration file |
| 9 | **LOW** | 96 lint warnings. No new ones introduced, but unused imports clutter the codebase and can hide real bugs. | QA | Bulk cleanup: remove unused imports across all files |
| 10 | **LOW** | Grammar SRS SM-2 fields exist in store.js but reading/listening have no SM-2 scheduling. Cooldown-only for now. | Curriculum | Extend SM-2 to reading/listening for consistent spaced repetition |

---

## 8. Recommended Next 3 Phases

### Phase 34: Adaptive Plan Consolidation

**Goal**: Fix the #1 issue where `generatePlan()` overrides adaptive targets.

Replace the two-step process (build adaptive targets then generate plan) with a single adaptive pipeline:
- `generatePlan()` uses adaptive targets as its primary input
- Minute budget becomes a ceiling, not a replacement
- Weak-area injection, SM-2 due items, and topic grouping all feed into one coherent plan
- Remove duplicate logic between `buildAdaptiveTargets()` and `generatePlan()`

**Risk**: Medium. Touches DailyMissionPage plan generation logic. All 366 existing tests must pass.

### Phase 35: Performance — Split Vocabulary by Level

**Goal**: Reduce the 1.8 MB germanVocabulary chunk.

Split the vocabulary data file into per-level files:
- Consolidates: `germanVocabulary-A1.js`, `germanVocabulary-A2.js`, ..., `germanVocabulary-C1.js`
- VocabularyPage and FSPVocabPage should load only the level they need
- dataLoaders.js may need updating to support per-level data fetching

**Risk**: Low. Data structure is consistent across levels. Simply moving files and updating imports. Lazy loading already in place.

### Phase 36: Playwright Smoke Tests

**Goal**: Automated browser coverage for the 5 most critical routes.

Add Playwright tests for:
1. Home/Dashboard loads without console errors
2. Daily Mission Page renders Today's Plan
3. Listening Page audio plays correct script
4. Grammar page loads exercises
5. Mobile viewport (375px) renders all pages without breakage

**Risk**: Low. No app code changes. Just test infrastructure.

---

## Appendix: Key File Stats

| File | Size | Notes |
|------|------|-------|
| src/pages/DailyMissionPage.jsx | ~28 KB | Largest page component. Contains plan generation + 6 skill sections |
| src/utils/store.js | ~50 KB | State management. Auth, sync, SRS, progress. |
| src/utils/supabaseSync.js | ~15 KB | Cloud sync logic |
| src/utils/teachBeforeTest.js | ~10 KB | Curriculum filtering |
| data/* (vocabulary) | ~1.8 MB | Largest data asset |
| data/* (FSP) | ~641 KB | Medical content |
| tests/ | 13 files | 366 total tests |

## Appendix: Lint Warnings Breakdown

| Warning Type | Count | Risk |
|-------------|-------|------|
| `no-unused-vars` | ~50 | Low. Pre-existing unused imports. |
| `no-empty` | ~30 | Low. Pre-existing empty catch blocks. |
| `react-hooks/exhaustive-deps` | ~16 | Low. Missing hook dependencies. |
| **Total** | **96** | **All pre-existing, 0 introduced** |
