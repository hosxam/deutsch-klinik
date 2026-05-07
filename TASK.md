# TASK.md - deutsch-klinik Agent Rules

## Current Objective
Phase 2 complete. Curriculum map expanded to A2-C1. Teach-before-test wiring in DailyMissionPage for all skill types.

## Resume Point
Phase 2 done (commit `3449fb6`). Ready for Phase 3: Adaptive Practice Engine.

## Validation Command
```bash
cd "C:\Users\ASUS\.openclaw\workspace\deutsch-klinik"

# Build check
npm run build

# Curriculum map validation
node scripts/validate-curriculum-map.cjs

# Teach-before-test validation (should pass clean)
node scripts/validate-teach-before-test.cjs

# Curriculum dependency validation (pre-existing data warnings for B1-C1)
node scripts/validate-curriculum-dependencies.cjs
```

## Mega Plan (see `git show a1ba2e5` for full text)

Phase structure:
- 0: Site Audit / Reverse Engineering ✅
- 1: Curriculum Architecture + Teach-Before-Test Engine ✅
- 2: Expand Curriculum Coverage to A2-C1 ✅
- 3: Adaptive Practice Engine (next)
- 4: Medical FSP Integration
- 5: AI Correction Integration
- 6: Polish, Docs, and Ship

## Summary of Changes

### Task Log

- [x] 0. Site audit (CURRENT_SITE_AUDIT.md created)
- [x] 1. Created curriculumMap.json with A1 pilot (266 units, 252 concepts)
- [x] 2. Created curriculumProgress.js (13 functions)
- [x] 3. Created teachBeforeTest.js (5 functions)
- [x] 4. Updated DailyMissionPage.jsx - dynamic hasCurriculumMap() guard
- [x] 5. Created build-pilot-curriculum.cjs
- [x] 6. Created validate-curriculum-map.cjs
- [x] 7. Created validate-teach-before-test.cjs
- [x] 8. Created map-curriculum-dependencies.cjs
- [x] 9. Created validate-curriculum-dependencies.cjs
- [x] 10. Added npm scripts (validate-curriculum, validate-teach-before-test, etc.)
- [x] 11. Created docs/CURRICULUM_ARCHITECTURE.md
- [x] 12. Created docs/TEACH_BEFORE_TEST_ENGINE.md
- [x] 13. npm run build passes
- [x] 14. All validators pass (A2-C1 warnings expected)
- [x] 15. Committed: 84303b0

### Files Changed (16 files, +15403 / -1475)

**New files:**
- `CURRENT_SITE_AUDIT.md` - Full codebase audit
- `.gitattributes` - Line ending normalization
- `docs/CURRICULUM_ARCHITECTURE.md` - Curriculum schema docs
- `docs/TEACH_BEFORE_TEST_ENGINE.md` - Engine API docs
- `scripts/build-pilot-curriculum.cjs` - A1 pilot builder
- `scripts/map-curriculum-dependencies.cjs` - Topic-based mapping
- `scripts/validate-curriculum-dependencies.cjs` - taughtInLessonId validator
- `scripts/validate-curriculum-map.cjs` - curriculumMap.json validator
- `scripts/validate-teach-before-test.cjs` - teach-before-test coverage validator
- `src/data/curriculumMap.json` - Central curriculum map (A1 pilot)
- `src/utils/curriculumProgress.js` - Core engine (320 lines)
- `src/utils/teachBeforeTest.js` - Convenience API (95 lines)

**Modified files:**
- `package.json` - Added 4 npm scripts
- `src/pages/DailyMissionPage.jsx` - Dynamic curriculum guard for grammar & vocab
- `src/data/germanVocabulary.json` - CRLF normalization
- `src/data/grammar.json` - CRLF normalization
