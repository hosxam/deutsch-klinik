# PHASE15_RELEASE_QA_CHECKLIST.md

## Before Deployment

### Build Status
- [x] `npm run build` — PASS (841ms)
- [x] No JS build errors
- [x] No module resolution failures
- [x] Assets compile to `dist/` correctly

### Lint
- [x] `node scripts/validate-lint.cjs` — PASS (0 errors, 0 warnings)
- [x] No React hooks rule violations
- [x] No import errors

### Validators
- [x] `validate-curriculum-map` — 10 pre-existing errors (invalid `"case"` skill in fsp_case units — pre-Phase 10)
- [x] `validate-teach-before-test` — 203 pre-existing errors (missing `fsp_l_040` linkedLessonId — pre-Phase 10)
- [x] `validate-curriculum-dependencies` — PASS
- [x] `validate-fsp-quality` — 24/24 PASS
- [x] `validate-german-orthography` — 287 pre-existing warnings (suspicious medical German words, not regressions)
- [ ] `fix-grammar-answers` (script missing — `scripts/fix-grammar-answers.cjs` does not exist, npm script points to nonexistent file)

### Playwright Tests
- [x] Production smoke (9/9) — PASS
- [x] Performance smoke (9/9) — PASS
- [x] Auth smoke (4/4) — PASS
- [x] Onboarding smoke (9/9) — PASS
- [x] FSP smoke (7/7) — PASS
- [x] **Total: 37/37** — PASS
- [ ] AI-unavailable (0/9) — FAIL (hardcoded `localhost:5173` dev server URL — only works with `npm run dev` running)

### Routing Checks
- [x] `/` — Dashboard loads
- [x] `/#/onboarding` — Onboarding flow loads
- [x] `/#/placement-test` — Placement test loads
- [x] `/#/goal-setup` — Goal setup loads
- [x] `/#/level/A1` through `/#/level/C1` — Level pages load
- [x] `/#/level/A1/daily` — Daily mission loads
- [x] `/#/level/A1/vocabulary/flashcards` — Flashcards load
- [x] `/#/mistake-notebook` — Mistakes page loads
- [x] `/#/medical-fsp` — FSP hub loads
- [x] `/#/medical-fsp/{vocabulary,anamnese,cases,presentations,writing,listening,reading,grammar,exams}` — FSP sub-pages load
- [x] `/#/settings` — Settings loads
- [x] `/#/settings/account` — Account page loads
- [x] `/#/exam` — Returns 404 guard (requires level route)
- [x] `/#/resources` — Resources page loads
- [x] `/#/medical` — Medical resources page loads
- [x] `/#/c1-readiness` — C1 readiness page loads

### Onboarding Checks
- [x] First visit shows login/profile picker
- [x] Profile selection redirects to onboarding
- [x] Start from A1 flow completes
- [x] Placement test flow loads
- [x] Goal setup flow loads
- [x] Dashboard shows after onboarding
- [x] Page reload after onboarding doesn't crash
- [x] Exam guard blocks locked exam
- [x] Settings loads after onboarding

### Dashboard Checks
- [x] Dashboard renders with stats
- [x] Progress cards visible
- [x] Action cards clickable
- [x] Daily mission card visible
- [x] No JS console errors

### Daily Practice Checks
- [x] A1 daily mission loads
- [x] A2 daily mission loads
- [x] B1 daily mission loads
- [x] B2 daily mission loads
- [x] C1 daily mission loads

### A1-C1 Checks
- [x] A1 vocabulary, grammar, reading, listening, writing, speaking, exams load
- [x] A2 vocabulary, grammar, reading, listening, writing, speaking, exams load
- [x] B1 vocabulary, grammar, reading, listening, writing, speaking, exams load
- [x] B2 vocabulary, grammar, reading, listening, writing, speaking, exams load
- [x] C1 vocabulary, grammar, reading, listening, writing, speaking, exams load
- [x] All level-split data files present (45 files)
- [x] Dynamic per-level data loading works

### FSP Checks
- [x] FSP hub page loads
- [x] FSP vocabulary page loads
- [x] FSP anamnese page loads
- [x] FSP cases page loads
- [x] FSP exam page loads
- [x] FSP grammar page loads
- [x] FSP listening page loads
- [x] FSP presentations page loads
- [x] FSP reading page loads
- [x] FSP writing page loads
- [x] Dashboard with targetLevel=FSP works

### Supabase Fallback Checks
- [x] No Supabase env vars — app loads without crash
- [x] No Supabase env vars — shows "not configured" message
- [x] Account page renders without Cloud Sync (graceful fallback)
- [x] Settings page shows Account & Cloud Sync button
- [x] LocalStorage fallback works when Supabase unavailable

### Cloudflare AI Fallback Checks
- [x] No Cloudflare env vars — writing correction gracefully says unavailable
- [x] No Cloudflare env vars — speaking/displays graceful fallback
- [x] No Cloudflare env vars — no error thrown to user
- [x] All AI features optional

### Mobile Checks
- [ ] Manual: Dashboard responsive at 375px width
- [ ] Manual: Onboarding flow usable on mobile
- [ ] Manual: Daily mission flows work on mobile
- [ ] Manual: FSP hub usable on mobile
- [ ] Manual: Settings page usable on mobile

### GitHub Pages Deployment Checks
- [x] `base: '/deutsch-klinik/'` in vite.config.js
- [x] All asset paths use `/deutsch-klinik/` prefix
- [x] favicon at `public/favicon.svg` with correct path in index.html
- [x] `npm run deploy` script configured (build + gh-pages)
- [x] Hash router (`/#/`) handles client-side routing
- [ ] Manual: Verify deployed site on https://hosxam.github.io/deutsch-klinik/

### Environment Variable Checklist
- [ ] `VITE_SUPABASE_URL` — Supabase project URL (optional)
- [ ] `VITE_SUPABASE_ANON_KEY` — Supabase anon key (optional)
- [ ] `CLOUDFLARE_AI_WORKER_URL` — Cloudflare Worker URL (optional)
- [ ] `VITE_SENTRY_DSN` — Error tracking (optional, not configured)
- [ ] `PREVIEW_URL` — Local test preview URL (optional, defaults to `http://127.0.0.1:4175/deutsch-klinik/`)

### Known Limitations
1. **10 curriculum map errors** — `skill: "case"` in fsp_case units (lessons 31-40) not in allowed skill list. Needs curriculumMap.json update to change `case` to `lesson`.
2. **203 teach-before-test errors** — `linkedLessonId: "fsp_l_040"` for unit FSP lesson 040, but `fspLessons.json` only has 39 entries (fsp_l_001 to fsp_l_039). Lesson 40 data was never generated.
3. **287 orthography warnings** — Valid German medical terminology flagged by automated check (e.g., "Herzkranzgefäße", "Frauenarztkontrolle").
4. **9 AI-unavailable Playwright tests fail** — Hardcoded `localhost:5173` (dev server). Only run these with `npm run dev` active.
5. **Missing `fix-grammar-answers` script** — `scripts/fix-grammar-answers.cjs` doesn't exist, though it's in package.json scripts.
6. **No mobile Playwright tests** — All tests run at desktop viewport. Manual mobile QA needed.
7. **No 404.html SPA fallback** — Not needed with hash routing, but GH Pages won't serve `index.html` for non-root paths.
8. **Vite chunk size warning** — `germanVocabulary.json` and monolithic data files exceed 1300 KB. Phase 13's per-level splitting only partially addresses this (DailyMissionPage uses splits, but other pages still import the monolith directly).
