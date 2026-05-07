# Current Site Audit — Deutsch Klinik

Generated: 2026-05-07
Audit type: Codebase read-only inspection (no modifications)

---

## 1. Routes & Pages (from `src/App.jsx`)

All routes live under a single `<Layout />` shell inside `<HashRouter>`. The app shows `<LoginPage />` when no profile is active.

| Route | Page Component | Lines | Purpose |
|-------|---------------|-------|---------|
| `#/` | `Dashboard.jsx` | 1,774 | Home page, study plan, streak, goals |
| `#/level/:levelId` | `LevelPage.jsx` | 216 | Level landing with links to skill areas |
| `#/level/:levelId/grammar` | `GrammarPage.jsx` | 331 | MCQ grammar exercises |
| `#/level/:levelId/vocabulary` | `VocabularyPage.jsx` | 627 | Browse all vocab, quiz mode |
| `#/level/:levelId/vocabulary/flashcards` | `FlashcardPage.jsx` | 446 | SM-2 spaced repetition flashcards |
| `#/level/:levelId/vocabulary/practice` | `PracticePage.jsx` | 1,008 | Independent practice hub |
| `#/level/:levelId/reading` | `ReadingPage.jsx` | 152 | Reading comp with questions |
| `#/level/:levelId/listening` | `ListeningPage.jsx` | 659 | TTS-based listening comp |
| `#/level/:levelId/writing` | `WritingPage.jsx` | 394 | Timed writing + AI correction |
| `#/level/:levelId/speaking` | `SpeakingPage.jsx` | 621 | Timed speaking + AI feedback |
| `#/level/:levelId/exam` | `ExamPage.jsx` | 452 | Goethe-style exams |
| `#/level/:levelId/lessons` | `LessonsPage.jsx` | 135 | Lesson list by unit |
| `#/level/:levelId/daily` | `DailyMissionPage.jsx` | 2,494 | Core daily practice engine |
| `#/level/:levelId/lessons/:lessonId` | `LessonDetailPage.jsx` | 827 | Full lesson viewer |
| `#/resources` | `ResourcesPage.jsx` | 72 | External links |
| `#/medical` | `MedicalPage.jsx` | 67 | Medical German intro |
| `#/placement-test` | `PlacementTest.jsx` | 89 | Simple placement quiz |
| `#/c1-readiness` | `C1ReadinessPage.jsx` | 474 | C1 exam self-assessment |
| `#/mistake-notebook` | `MistakeNotebookPage.jsx` | 499 | Filterable mistake review |
| `#/medical-fsp` | `MedicalFSPHubPage.jsx` | 174 | FSP hub (10-step study path) |
| `#/medical-fsp/vocabulary` | `FSPVocabPage.jsx` | 153 | |
| `#/medical-fsp/anamnese` | `FSPAnamnesePage.jsx` | 118 | |
| `#/medical-fsp/cases` | `FSPCasesPage.jsx` | 149 | |
| `#/medical-fsp/presentations` | `FSPPresentationsPage.jsx` | 118 | |
| `#/medical-fsp/writing` | `FSPWritingPage.jsx` | 115 | |
| `#/medical-fsp/listening` | `FSPListeningPage.jsx` | 114 | |
| `#/medical-fsp/reading` | `FSPReadingPage.jsx` | 83 | |
| `#/medical-fsp/grammar` | `FSPGrammarPage.jsx` | 108 | |
| `#/medical-fsp/exams` | `FSPExamPage.jsx` | 862 | |

**Total: 29 routes, 30 page components**

### Layout Navigation

The `<Layout />` component provides:
- Top nav: Dashboard, Practice, Review, FSP, Resources, level selector dropdown
- Side: Medical, C1 Ready, Settings/Goal
- Profile indicator (Hossam with 🩺 or wife with 🌸)
- Theme toggle (dark/light)
- Mobile hamburger menu

---

## 2. Data Files & Schema (`src/data/`)

### Core Curriculum Data

| File | Format | Size | Schema |
|------|--------|------|--------|
| `germanLessons.json` | Array of 125 objects | ~497 KB | `{ id, level, unit, title, conceptId, estimatedMinutes, prerequisiteConceptIds, linkedQuestionIds, remediationLessonId, objective, explanation, formsTable, examples, vocabulary[], grammarFocus, commonMistakes, pronunciationNotes, medicalFspNotes, guidedPractice, controlledPractice, mixedPractice, independentPractice, remediationIfFailed, listeningTask, readingTask, speakingTask, writingTask, reviewSummary, conceptsTaught, linkedPracticeConceptTags, prerequisites, lessonDepthVersion, trackTags, remediationTags, miniDrills, formsTables }` |
| `germanVocabulary.json` | Object `{ A1: [], A2: [], B1: [], B2: [], C1: [] }` | ~2 MB | Each: `{ id, level, word, article, plural, translation, example, exampleTranslation, tags[], lessonId, topic, partOfSpeech, taughtInLessonId? }` |
| `grammar.json` | Object `{ A1: [], A2: [], B1: [], B2: [], C1: [] }` | ~555 KB | Each: `{ id, level, prompt, answer, explanation, topic, options[], lessonId, taughtInLessonId? }` |
| `curriculum.json` | Object with per-level summaries | 1.8 KB | Lists grammar topics, vocab units per level |
| `curriculumArchitecture.json` | Object with schema version | 3.4 KB | Defines lesson standard, pilot concepts, pronunciation syllabus, A1 modules |
| `germanUnits.json` | Object with level-indexed keys `0..4` | 5.9 KB | Unit structure per level |
| `grammarCurriculum.json` | Object `{ A1, A2, B1, B2, C1 }` | 180 KB | Each: `{ id, level, unit, title, topic, explanation, rules[] }` |
| `levels.json` | Object `{ A1, A2, B1, B2, C1 }` | 2.2 KB | Metadata: `{ id, name, requires, grammarUnits, vocabularyUnits, minWritingTasks, minSpeakingTasks, minListeningTests, minReadingTests }` |

### Item Counts

| Level | Vocab | Grammar | Lessons | GrammarCurr | Reading | Listening | Writing | Speaking | Exams |
|-------|-------|---------|---------|-------------|---------|-----------|---------|----------|-------|
| A1 | 497 | 223 | 25 | 21 | 50 | 50 | 50 | 50 | 5 |
| A2 | 501 | 198 | 25 | 21 | 53 | 50 | 50 | 70 | 5 |
| B1 | 1,062 | 242 | 25 | 20 | 60 | 60 | 50 | 50 | 5 |
| B2 | 1,071 | 246 | 25 | 20 | 50 | 50 | 50 | 50 | 1 (single dict) |
| C1 | 1,169 | 304 | 25 | 20 | 50 | 50 | 50 | 50 | 1 (single dict) |

- A1: 223 grammar items (some are prompt/explanation-only, not all are exercises)
- A2-B2 grammar: ~200-250 exercises each
- C1: 304 grammar items

### Skill Area Data Schemas

**Reading** (`reading.json`): `{ id, title, text, questions[]: { id, type, question, options?, answer, explanation }, lessonId, level }`

**Listening** (`listening.json`): `{ id, title, script, questions[]: { id, type, question, options[], answer }, lessonId, level, audio? }`

**Writing** (`writing.json`): `{ id, title, prompt, instructions, wordLimit, tips, rubric?, rubricKeys?, lessonId }`

**Speaking** (`speaking.json`): `{ id, title, prompt, prepTime, talkTime, instructions, tips, usefulPhrases, level, lessonId }`

**Exams** (`exams.json`): `{ exams: { A1: [exam1..5], A2: [exam1..5], B1: [exam1..5], B2: { single dict }, C1: { single dict } } }`. Multi-exam levels use arrays; B2/C1 use single dicts.

### FSP Data (Medical German)

| File | Items | Schema |
|------|-------|--------|
| `fspVocabulary.json` | 100 | `{ id, word, article, plural, translation, layExplanation, example, patientFriendlyPhrase, doctorToDoctorPhrase, category, tags }` |
| `fspAnamnese.json` | 100 | `{ id, category, doctorQuestion, simpleEnglish, patientPossibleAnswer, followUpQuestions, notes, tags }` |
| `fspCases.json` | 100 | `{ id, title, setting, patientRole, doctorTasks, mustAsk, redFlags, usefulPhrases, doctorToDoctorSummary, scoringRubric, tags }` |
| `fspWriting.json` | 100 | `{ id, caseTitle, task, patientData, history, examFindings, diagnostics, assessment, treatment, dischargePlan, expectedStructure, usefulPhrases, modelAnswer }` |
| `fspPresentations.json` | 100 | Full case presentation schema |
| `fspListening.json` | 100 | Medical audio comprehension |
| `fspReading.json` | 100 | Medical text comprehension |
| `fspGrammar.json` | 100 | Medical grammar MCQ |
| `fspExams.json` | 10 | Full FSP mock exams with part1 (patient), part2 (doc), part3 (handover) |

FSP progress uses a separate localStorage key `fspProgress` (not in the main store).

---

## 3. Progress & localStorage Structure

Key: `deutsch_klinik_state_{profileName}` (profile name from `dk_active_profile`)

### defaultState

```js
{
  currentLevel: 'A1',           // active level
  theme: 'dark',                // 'dark' | 'light'
  streak: { count: 0, lastDate: null },
  levels: {                     // per-level arrays of completed item IDs
    A1: { grammar: [], vocab: [], listening: [], reading: [] }
  },
  exams: {                      // { A1: { passed, score, date } }
  writings: [],                 // { id, level, prompt, text, date, score? }
  speakingRecordings: {},       // { A1: [ { id, date } ] }
  flashcards: {},               // SM-2 state: { 'A1_voc_1': { ease, interval, due, repetitions } }
  weakAreas: {},                // per-level per-skill booleans
  placementResult: null,
  medicalUnlocked: false,
  completedLessons: {},         // { A1: [ { id, completedAt }, ... ] }
  incorrectAnswers: {},          // { A1: [ { exerciseId, userAnswer, correctAnswer, topic, date } ] }
  repeatedMistakes: {},          // { 'A1_gr_1': { topic, count, lastDate, level } }
  mistakeNotebook: {},           // { mistakeId: { topic, userAnswer, correctAnswer, level, date, repeated } }
  vocabularyMastery: {},         // { 'A1_voc_1': { correct, incorrect, mastered, ease, interval, due, repetitions } }
  grammarMastery: {},           // { 'A1_gr_1': { correct, incorrect, mastered } }
  listeningCompleted: {},        // per level arrays
  readingCompleted: {},          // per level arrays
  completedGrammarLessons: {},   // per level arrays
  readinessScores: {},           // C1 readiness: { reading, listening, writing, speaking, grammar, vocabulary, timeManagement, overall }
  topicWeakness: {},             // per-topic weakness data
  remediationQueue: [],          // max 20 remediation recommendations
  dailyStudyLog: [],             // study time entries
  studyLog: {},                  // { '2026-05-07': { minutes, sessions } }
}
```

---

## 4. Daily Mission Logic (`DailyMissionPage.jsx`)

### Mission Building

`buildMissions()` creates a daily plan from `calculateDailyTargets()` output. Missions include:

1. **Lesson study** — picks next incomplete lesson from `dashboardSummary.lessonSummaries`
2. **Grammar curriculum lesson** — picks next incomplete from `grammarCurriculum.json`
3. **Grammar practice** — filtered MCQ questions
4. **Vocabulary practice** — words filtered by `taughtInLessonId`
5. **Flashcard review** — SM-2 due/weak cards
6. **Listening/Reading/Writing/Speaking** — single task each
7. **Remediation** — weakest skill follow-up

### Teach-Before-Test Filter (CRITICAL)

The current filter at lines 572 and 643:

```js
// Grammar:
const taggedPool = lvl === 'A1' && !context.isFreePractice
  ? all.filter((x) => context.allowedLessonIds.has(getQuestionLessonId(x)))
  : all;

// Vocabulary:
const introduced = lvl === 'A1' && !context.isFreePractice
  ? all.filter((x) => context.allowedLessonIds.has(getWordLessonId(x)))
  : all;
```

**The `lvl === 'A1'` guard means teach-before-test is only active for A1.** For A2-C1, all content is presented regardless of whether its lesson was studied. This is why `taughtInLessonId` population matters: once populated for all levels, this guard can be removed (or changed to check data availability).

### Session Persistence

Daily missions save state per-level in localStorage key `dk_session_{levelId}`:
- `dateKey`, `levelId`, `currentMission`, `completedMissions[]`, `missionResults{}`
- `selectedExerciseIds: { grammar: [], vocab: [] }`
- `planLessonIds[]`, `planConceptIds[]`
- `planSignature` (hash of goal config — allows matching saved plan to current goals)

### SM-2 Implementation

In `recordVocabAnswer()`:
- Correct: interval = 1, then 6, then interval * ease. Repetitions++
- Incorrect: interval = 1, repetitions = 0, ease -= 0.2
- Ease floor: 1.3, cap: 3.0. Correct answers increase ease by 0.1
- Mastered: `correct >= 5 && ease >= 2.5`
- Due queue: `getDueVocabWords()` checks `due <= today || !mastered`

---

## 5. Exam Unlock Logic

`isExamUnlocked(level, levelData)` in `store.js`:

```js
grammarDone  = count >= levelData.grammarUnits  // e.g. 200
vocabDone    = count >= levelData.vocabularyUnits  // e.g. 500
writingsDone = count >= levelData.minWritingTasks  // e.g. 5
speakingDone = count >= levelData.minSpeakingTasks  // e.g. 3
listeningDone, readingDone from progress arrays
lessonsCompleted = getCompletedLessons(level).length >= 10
```

All must be true. Level unlock (`isLevelUnlocked`) requires the previous level's exam passed.

### Exam Page Architecture

- Multi-exam levels (A1, A2, B1): shows exam selector, then intro, then sections, then results
- Single-exam levels (B2, C1): goes straight to intro
- 3 phases: `'select'` (multi only), `'intro'`, `'inProgress'`, `'done'`
- Sections: Lesen, Horen, Schreiben, Sprechen
- Auto-advance: passing unlocks next level
- Timer is per-exam (simulated duration)
- On-screen keyboard helper for umlauts

---

## 6. Mistake, Flashcard & Practice Logic

### MistakeNotebookPage

- Filters by level (`all` / A1-C1) and skill (`all` / grammar / vocab / etc.)
- Each mistake shows: topic, user answer, correct answer, date
- "Mark mastered" clears from `incorrectAnswers` and `mistakeNotebook`
- "Clear all mastered" batch operation
- Groups by: level, topic, skill
- Stats: total mistakes, grouped counts
- Integrates with `repeatedMistakes` tracking

### Flashcards (FlashcardPage)

- SM-2 spaced repetition review
- Shows word, reveals answer with article, plural, example
- Quality rating after reveal (0-5 scale, affects SM-2 ease factor)
- Flip animation, progress tracking
- Due-only mode: only shows cards where `due <= today` or not mastered

### PracticePage

Standalone practice hub separate from Daily Mission:
- Mixed practice: all skill areas
- Free practice mode (no lesson constraint)
- Independent from daily mission session flow

### AI Writing/Speaking Correction

`aiCorrection.js`:
- Cloudflare Worker endpoint: `deutsch-klinik-ai-correction.deutsch-klinik.workers.dev`
- Falls back gracefully when endpoint not configured (copy-prompt mode)
- Writing: sends prompt + user text → receives score/10, rubric breakdown, mistakes table, corrected version, improved version, flashcards
- Speaking: sends transcript → receives score/10, rubric (6 keys), mistakes, better phrases, corrected transcript, stronger answer, phrases to memorize
- No audio sent (transcript only for speaking)
- Browser speech recognition (de-DE) + MediaRecorder (local only)

---

## 7. Current Validation & Test Scripts

### Scripts (`scripts/`)

| Script | Purpose | Size |
|--------|---------|------|
| `validate-german-orthography.cjs` | Checks all `src/data/*.json` for ASCII transliterations (ae/oe/ue/ss) in German words, mojibake, common typo "heisst", missing umlauts in medical words | 14 KB |
| `validate-curriculum-dependencies.cjs` | Validates `taughtInLessonId`, `lessonId` cross-references, orphaned content, missing prerequisiteLessonIds | 6.6 KB |
| `map-curriculum-dependencies.cjs` | Maps vocab and grammar items to lesson IDs using topic + keyword matching strategies | 24.6 KB |
| `fix-data-corruption.cjs` | Repairs UTF-8 double-encoding in data files | 2.3 KB |
| `fix-grammar-answers.cjs` | Normalizes grammar answers (transliteration-safe) | 2.1 KB |
| `audit-lesson-coverage.cjs` | Reports lesson coverage gaps | 1.2 KB |
| `dedup-grammar.cjs` | Detects duplicate grammar IDs | 0.6 KB |

### Playwright Tests (`tests/`)

| Test | Purpose |
|------|---------|
| `production-smoke.spec.cjs` | Full E2E smoke tests: loads all pages, verifies data integrity, validates answer normalization, checks lesson/vocab/grammar rendering | 
| `a1-curriculum-depth.spec.cjs` | A1-specific curriculum depth checks: ensures all syllabus items present, cross-references valid |
| `adaptive-product-flows.spec.cjs` | Tests user flow paths: lesson → practice → exam |
| `ai-worker-integration.spec.cjs` | Tests AI correction worker endpoint integration |

### npm Validation Pipeline

```json
{
  "build": "vite build",
  "validate-grammar": "node scripts/fix-grammar-answers.cjs",
  "validate-german-orthography": "node scripts/validate-german-orthography.cjs",
  "validate-curriculum-dependencies": "node scripts/validate-curriculum-dependencies.cjs"
}
```

Current validation command: `npm run build && npm run validate-grammar && npm run validate-german-orthography`

---

## 8. Current Weaknesses

### Curriculum Depth

1. **B2 and C1 content is "shell/fake" data.** While item counts look complete, PROJECT_STATUS.md explicitly marks them as placeholder. This means their reading, listening, writing, speaking, and exam content needs full expansion with real German content.

2. **Vocabulary counts are uneven.** A1=497, A2=501 (good), B1=1,062, B2=1,071, C1=1,169. The B1+ counts are inflated by duplicates/batch expansion artifacts. Actual unique real-world vocabulary needs verification.

3. **No B2/C1 exam selector** — single exam dict instead of array like A1/A2/B1 have. This means no exam variety at upper levels.

4. **Grammar curriculum (`grammarCurriculum.json`) exists separately** from lesson grammar focus. They're not cross-referenced. Grammar curriculum has 20-21 lessons per level but content quality at C1 is notably weak (generic rules like "Structure matters", "Precision and nuance").

5. **Medical FSP sits in its own folder** with separate data files, separate localStorage, and separate routes. It's essentially a standalone mini-app bolted onto the main app.

### Data Quality

6. **Lesson `vocabulary` arrays** exist inside `germanLessons.json` but are redundant with `germanVocabulary.json`. Some lessons list words here that aren't in the main vocab file (and vice versa). No consistency check exists.

7. **No automatic foreign key validation** in CI. The validation scripts exist locally but aren't run as pre-commit hooks or CI steps.

8. **B2/C1 writing/speaking** may lack `rubric` and `usefulPhrases` fields that A1/A2/B1 have.

### Teach-Before-Test Logic

9. **Critical: `taughtInLessonId` only populated for A1 (100%) and partially for others.** Current coverage:
   - Vocabulary: A1=497/497, A2=501/501, B1=62/1062, B2=81/1071, C1=398/1169
   - Grammar: A1=223/223, A2=127/198, B1=119/242, B2=80/246, C1=98/304
   - The `lvl === 'A1'` guard in DailyMissionPage prevents A2-C1 from benefiting from teach-before-test

10. **Mapping scripts use keyword-based heuristics** that miss compound topics. B1/B2/C1 vocab topics like "Work and Career" don't match simple lesson topic maps. Current mapping coverage is ~80% for A2 (done), ~23% for B1/B2, ~4% for C1.

### Infrastructure

11. **Monolithic bundle (~2.2 MB JS)** — code splitting was tried but caused hash mismatch 404s on GitHub Pages. This impacts load time.

12. **No TypeScript** — all code is JSX/JS. Schema definitions exist only in comments and README. No automatic type checking.

13. **Backup directory `src/data/.german-backup/`** contains 2.5+ MB of stale backup files. These should be removed.

14. **No CI/CD pipeline** — deploy is manual `npm run deploy`. No lint or test steps before deploy.

15. **Tests use `PREVIEW_URL` and `LIVE_URL`** — the preview URL assumes `vite preview` is running on port 4175. No test runner integration in npm scripts.

### UI/UX

16. **`ExamPage.jsx` at B2/C1** — Shows "Exam not available" for C1 (ExamPage line 91: `if (!rawExam || !unlocked)`), but rawExam exists. Possible display issue or data format mismatch.

17. **Routing anomaly** — `#/dashboard` doesn't exist. Dashboard is at `#/`. A wrong URL shows "No routes matched".

18. **Multiple localStorage patterns** — main progress in `deutsch_klinik_state_{profile}`, daily missions in `dk_session_{levelId}`, FSP progress in `fspProgress`. This fragmentation could cause data loss on profile switch.

---

## 9. Parts to Preserve

| Part | Why Preserve |
|------|-------------|
| **Layout + Navigation** | Clean, responsive, dark/light theme, profile-aware |
| **A1 content (all areas)** | High quality, fully validated, curriculum-driven |
| **A2 vocabulary & grammar** | Mapped to lessons (100%), high quality |
| **A2 reading/listening/writing/speaking** | Good quality, complete |
| **B1 vocabulary & grammar** | Large dataset, mostly valid. Needs mapping, not replacement |
| **B1 exams** | 5 Goethe-style exams, complete |
| **DailyMissionPage architecture** | Mission builder, session persistence, concept-based filtering |
| **SM-2 spaced repetition** | Working implementation in `recordVocabAnswer()`, `getDueVocabWords()` |
| **Teach-before-test filtering** | Already coded at lines 572/643 of DailyMissionPage — just needs the A1 guard removed |
| **MistakeNotebookPage** | Filtering, marking mastered, repeated mistake tracking |
| **AI correction integration** | Working Cloudflare Worker endpoints for writing + speaking |
| **Medical FSP module** | Complete 810-item dataset across 9 skill areas |
| **FSP exam structure (ISBAR)** | Medically accurate handover format |
| **German char normalization** | `normalizeGerman.js` — safe direction (proper → ASCII), never reverse |
| **Exam unlock chain** | A1 → A2 → B1 → B2 → C1 with progressive requirements |
| **Lesson detail page** | Rich checklist format with pronunciation guide integration |
| **Streak tracking** | Simple, working |
| **Vocabulary flashcards** | SM-2 + article/plural/example display |
| **Scripts: `validate-german-orthography.cjs`** | Ensures UTF-8 compliance across all data files |
| **Scripts: `map-curriculum-dependencies.cjs`** | Automates `taughtInLessonId` population |
| **Scripts: `validate-curriculum-dependencies.cjs`** | Cross-reference validation |
| **Resources page** | 18 curated external links |
| **Placement test** | Simple entry point for new users |

---

## 10. Parts to Refactor

| Part | Issue | Refactor Plan |
|------|-------|---------------|
| **`lvl === 'A1'` guard in DailyMissionPage** | Blocks teach-before-test for A2-C1 | Replace with data-aware check: `taughtInLessonId exists on items` → apply filter. Remove level check. |
| **B2/C1 content (all skill areas)** | Shell/fake data | Full regeneration with real German content, matching lesson curriculum |
| **Grammar curriculum at C1** | Generic placeholder rules | Rewrite with specific C1 grammar topics |
| **Vocabulary B1/B2/C1 taughtInLessonId** | ~23% coverage on B1/B2, ~4% on C1 | Improve mapping script keyword strategies, add manual overrides for outliers |
| **Grammar taughtInLessonId** | 42-65% coverage on A2-C1 | Extend mapping to grammar items |
| **B2/C1 exams** | Single dict vs array at lower levels | Convert to array of 5 exams like A1/A2/B1 |
| **Monolithic JS bundle** | 2.2 MB | Code splitting per route. Fix GH Pages hash issue (possibly use basename in vite config) |
| **`src/data/.german-backup/`** | Stale, 2.5+ MB | Delete and update .gitignore |
| **Multiple localStorage patterns** | Fragmented state | Move daily missions and FSP into main store (or at least under same profile key) |
| **No CI/CD** | Manual deploy only | Add GitHub Actions: test → build → deploy on push to main |
| **No type safety** | JSX only | Add JSDoc type annotations to data loaders and critical functions as a lightweight first step |
| **ExamPage C1 "not available"** | Likely a data format issue | Normalize exam dict/array handling |
| **FSPHubPage `medicalUnlocked` check** | Uses B2 exam passed; should also check C1 exam after adding B2 content | Update after B2 content is real |

---

## 11. Phased Modification Plan

### Phase 0: Pre-Cleanup (quick wins, no behavioral changes)

1. Delete `src/data/.german-backup/` directory
2. Run `validate-german-orthography` to confirm all data is clean
3. Run `validate-curriculum-dependencies` to establish current baseline
4. Add `npm run test` placeholder for Playwright in package.json scripts
5. Add `.github/workflows/deploy.yml` for CI/CD
6. Set up pre-commit validation

### Phase 1: Curriculum Dependency Engine (core infrastructure)

1. Complete `map-curriculum-dependencies.cjs` mapping for B1/B2/C1 vocabulary
   - Extend per-level keyword maps with topic→lesson overrides
   - Add manual mapping for remaining outliers (expect ~80-90% coverage)
2. Complete grammar mapping for A2-C1 grammar items
3. Update `validate-curriculum-dependencies.cjs` to warn on unmapped items
4. Run validation and fix any broken references
5. Commit: data files + mapping/validation scripts

### Phase 2: Expand Curriculum to A2-C1 and Wire Teach-Before-Test for All Skills ✅

1. **Rewrote `build-pilot-curriculum.cjs`** to generate curriculumMap for all levels (A1-C1), not just A1.
   - Conservative prerequisite strategy: Lesson N requires lesson N-1; skill items require their linked lesson
   - 1377 total units across 5 levels and 7 skill types
2. **Updated DailyMissionPage** `getNextReading/getNextListening/getNextWriting/getNextSpeaking` to filter by curriculum unlock when `hasCurriculumMap(level)` is true
3. **Updated validators** to accept `lessonId` as equivalent to `taughtInLessonId` and sub-question IDs
4. **Updated docs** (CURRICULUM_ARCHITECTURE.md, TEACH_BEFORE_TEST_ENGINE.md)
5. **Commit**: `3449fb6`

### Phase 3: Vocabulary Expansion Pipeline

1. Build batch generation scripts (`.py` or `.cjs`) that:
   - Take topic + level + count as input
   - Generate vocabulary entries with all required fields
   - Auto-assign `taughtInLessonId` from lesson topic mapping
   - Run dedup and orthography validation automatically
2. Expand B1 vocabulary to target 800 real unique words
3. Expand B2 vocabulary to target 800 real unique words
4. Expand C1 vocabulary to target 800 real unique words
5. Run full validation after each batch

### Phase 4: UI Improvements

1. Code splitting per route (fix GH Pages hash issue)
2. Type annotations on data loaders
3. Consolidate localStorage: move `dk_session_*` and `fspProgress` into main store
4. Add validation summary widget to Dashboard
5. Improve error messaging in ExamPage for C1

### Phase 5: Content Expansion (B2 + C1)

1. Regenerate B2 reading, listening, writing, speaking with real German content
2. Regenerate C1 reading, listening, writing, speaking with real German content
3. Add 4 more exams to B2 and C1 (matching A1/A2/B1 format with 5 exams each)
4. Add B2+C1 multi-exam selector support to ExamPage
5. Update grammar curriculum at C1 level with specific topics
6. Update medical content at B2/C1 levels

### Phase 6: AI Features (Worker/backend only — no direct browser AI API calls)

1. Add grammar-focused AI correction mode
2. Add vocabulary sentence generation via AI Worker
3. Add personalized remediation recommendations via AI Worker
4. Add reading comprehension question generation via AI Worker
5. All AI routes go through Cloudflare Worker, never browser-side AI APIs

### Phase 7: QA and Cleanup

1. Full Playwright test suite: all 29 routes load, all skill areas work
2. Data integrity sweep: validate all cross-references across all 30+ JSON files
3. Run orthography validation on all data
4. Performance audit: bundle size, render times, localStorage size
5. User testing regression check
6. Final docs update

---

## Summary of Critical Items (Ordered by Impact)

| Priority | Item | Why |
|----------|------|-----|
| ✅ Done | Remove `lvl === 'A1'` guard on teach-before-test | Replaced with `hasCurriculumMap(lvl)` — works for all levels |
| ✅ Done | Expand curriculumMap to A2-C1 (all skills) | 1377 units across 5 levels, 7 skill types |
| ✅ Done | Wire reading/listening/writing/speaking to teach-before-test | `getNext*` functions now filter by curriculum unlock |
| 🟡 P2 | Complete `taughtInLessonId` mapping for B1/B2/C1 vocab | ~3 items have bad lessonIds; mapping script needs improvement |
| 🟡 P2 | Complete `taughtInLessonId` mapping for A2-C1 grammar | 13/553 mapped by script; lessonId field exists but needs taughtInLessonId |
| 🟠 P1 | B2 content regeneration (all skills) | Currently shell/fake data |
| 🟠 P1 | C1 content regeneration (all skills) | Currently shell/fake data |
| 🟠 P1 | Add 4 exams each for B2 and C1 | Parity with A1/A2/B1 |
| 🟡 P2 | Code splitting | 2.2 MB bundle impacts load time |
| 🟡 P2 | B1 vocabulary expansion (target 800 real words) | Current 1,062 count includes artifacts |
| 🟡 P2 | CI/CD pipeline | Manual deploy is fragile |
| 🟢 P3 | Delete `.german-backup/` | Stale data, wastes space |
| 🟢 P3 | Consolidate localStorage keys | Fragmented state is risky |
| 🟢 P3 | Type annotations | Long-term maintainability |
| 🟢 P3 | Grammar curriculum C1 rewrite | Generic rules → specific content |
