# TASK.md — Deutsch-Klinik AI Correction

## Agent Rules

1. **Read this file first** before making any edits. It is the single source of truth.
2. Continue from the first unchecked task (`[ ]`). Never redo checked tasks (`[x]`).
3. After completing a task, run validation, update this file (check the task, update resume point), commit, then continue.
4. Before stopping for any reason, update the exact resume point below.
5. AI API calls must never be made directly from a React frontend. They must go through the Cloudflare Worker / backend.
6. Do not modify this file structure without updating the rules section.

## Validation Command

Base validation:
```
npm test
```

If `validate-grammar` or `validate-german-orthography` scripts are added later, run them together:
```
npm run build && npm run validate-grammar && npm run validate-german-orthography
```

Note: As of initial setup, only `npm test` exists. The other scripts will be created as part of the mega plan.

## Resume Point

**Phase:** Phase 1
**Next task:** Task 1.2 — Fix Mark-as-Mastered Bug
**Last completed task:** Task 1.1 — Two-Profile System (Login)

## Completed Task Log

- [x] setup: init git repo with .gitignore
- [x] setup: create TASK.md as task tracker
- [x] Task 0.1 — Fix Critical Data Corruption. Added `scripts/fix-data-corruption.cjs`, added `npm run fix-data`, ran the fixer, and validated with `npm run build && npm run validate-grammar && npm run validate-german-orthography` (PASS). Changed files: `TASK.md`, `package.json`, `scripts/fix-data-corruption.cjs`, and data files only where the fixer made replacements.
- [x] Task 0.2 — Remove Grammar Duplicates. Added `scripts/dedup-grammar.cjs`, adapted it to skip non-array metadata keys in the current `grammar.json` schema, removed 14 duplicate grammar exercises, and validated with `npm run build && npm run validate-grammar && npm run validate-german-orthography` (PASS). Changed files: `TASK.md`, `src/data/grammar.json`, `scripts/dedup-grammar.cjs`.
- [x] Task 0.3 — Validate Lesson–Exercise Alignment. Added `scripts/audit-lesson-coverage.cjs`, checked `lessonId`, `taughtInLessonId`, `remediationLessonId`, and `prerequisiteLessonIds`, generated `audit-lesson-gaps.json`, found 0 missing lesson references, and validated with `npm run build && npm run validate-grammar && npm run validate-german-orthography` (PASS). Changed files: `TASK.md`, `scripts/audit-lesson-coverage.cjs`, `audit-lesson-gaps.json`.
- [x] Task 1.1 — Two-Profile System (Login). Added local profile selection for Hossam and wife, namespaced localStorage state by active profile, added profile switch controls to desktop/mobile navigation, and validated with `npm run build && npm run validate-grammar && npm run validate-german-orthography` (PASS). Changed files: `TASK.md`, `src/utils/store.js`, `src/pages/LoginPage.jsx`, `src/App.jsx`, `src/components/Layout.jsx`.

## Mega Plan

---

# CRITICAL ADDENDUM — FINAL PRODUCT REQUIREMENTS

The original mega plan is accepted as the base refurbishment plan, but these requirements are mandatory and override any conflicting lower-priority instruction.

## Requirement 1 — Vocabulary must scale to 12,000 words

Final target:
- A1: 1,200 words
- A2: 1,800 words
- B1: 2,500 words
- B2: 3,000 words
- C1: 2,500 words
- Medical FSP: 1,000 words

Total target: approximately 12,000 vocabulary entries.

The original mega plan's smaller vocabulary target is not enough.

Vocabulary expansion must be done by pipeline and batches, not one giant manual edit.

Each vocabulary entry must include, where applicable:
- id
- level
- word
- article for nouns
- plural for nouns
- partOfSpeech
- translation
- topic
- example sentence in German
- example translation in English
- tags
- medical/FSP flag if relevant
- taughtInLessonId or unitId

Validation scripts must check:
- duplicate vocabulary after normalization
- missing article/plural for nouns
- missing example sentences
- missing topics
- invalid level
- invalid taughtInLessonId/unitId

## Requirement 2 — Teach-before-test curriculum dependency engine

Daily tasks must never test material that has not already been taught.

Every grammar exercise must have:
- lessonId
- topic
- prerequisiteLessonIds if needed

Every vocabulary item must have:
- level
- topic
- taughtInLessonId or unitId

Every reading/listening/writing/speaking item should have:
- level
- topic
- prerequisiteLessonIds where applicable

DailyMissionPage must generate tasks in this order:
1. assign lesson content first
2. then assign grammar/vocab/reading/listening/writing/speaking tasks linked to completed lessons or lessons assigned earlier the same day

DailyMissionPage must never show:
- grammar from untaught lessons
- vocabulary from untaught lessons/units
- reading/listening questions requiring grammar not yet explained
- writing/speaking prompts requiring structures not yet taught

If an exercise is selected but its prerequisite lesson is incomplete:
- insert the required lesson earlier in today's plan, or
- skip the exercise and select another valid exercise

Add validation script:
- validate-curriculum-dependencies

This script must check:
- every exercise lessonId exists
- every prerequisiteLessonId exists
- every vocabulary taughtInLessonId/unitId is valid
- no orphaned exercises exist
- daily mission cannot select untaught content

## Revised execution priority

Use this priority order instead of the original order if there is conflict:

1. Phase 0 — Data fixes
2. Phase 1 — Foundation bugs
3. Curriculum Dependency Engine
4. Daily Mission teach-before-test logic
5. Vocabulary expansion pipeline and validators
6. Vocabulary batch expansion toward 12,000 words
7. UI/dashboard improvements
8. AI features using Worker/backend only
9. Content expansion
10. QA and final cleanup

Do not attempt to add all 12,000 vocabulary words in one edit.

First build the import/validation pipeline.
Then add vocabulary in safe batches.
Validate and commit after every batch.

---

# 🇩🇪 DEUTSCH KLINIK — COMPLETE TRANSFORMATION MEGA PLAN
## Master Instruction Document for AI Coding Assistant (Codex / ChatGPT)

**Project:** deutsch-klinik — Personal German learning website for medical residency in Germany
**Users:** Hossam (doctor, targeting orthopedic surgery residency in Germany) + Wife
**Stack:** React + Vite + Tailwind + HashRouter + localStorage + Cloudflare Workers
**Goal:** A fully self-contained, adaptive, AI-powered platform that takes both users from A1 to C1 + Medical FSP with zero external resources needed
**Current state:** Functional skeleton with major bugs, broken AI, disconnected logic, and thin content

---

## HOW TO USE THIS DOCUMENT

Work through each Phase in order. Within each Phase, complete all Tasks before moving to the next Phase. After every task, run:
```bash
npm run build && npm run validate-grammar && npm run validate-german-orthography
```
Do not proceed if the build fails. Each task is self-contained and lists exactly which files to touch.

---

# ═══════════════════════════════════════════════════════
# PHASE 0 — DATA SURGERY (Do first, takes ~2 hours)
# Fix all broken data before touching any code
# ═══════════════════════════════════════════════════════

## [x] Task 0.1 — Fix Critical Data Corruption
**Files:** `src/data/listening.json`, `src/data/grammar.json`, `src/data/writing.json`, `src/data/speaking.json`, `src/data/exams.json`, `src/data/fspVocabulary.json`

Run this Node.js script from the project root:

```js
// scripts/fix-data-corruption.cjs
const fs = require('fs');

// LISTENING.JSON — ~160 "trü" true-false answers broken + mojibake
let l = fs.readFileSync('./src/data/listening.json', 'utf8');
l = l.replace(/"trü"/g, '"true"');
l = l.replace(/heiÃŸe/g, 'heiße').replace(/heiÃŸt/g, 'heißt');
l = l.replace(/StraÃŸe/g, 'Straße').replace(/straÃŸe/g, 'straße');
l = l.replace(/"ÿber/g, '"Über');
l = l.replace(/ParkstraÃŸe/g, 'Parkstraße');
fs.writeFileSync('./src/data/listening.json', l);
console.log('✓ listening.json fixed');

// GRAMMAR.JSON — "teür" is not a German word (correct: teuer)
let g = fs.readFileSync('./src/data/grammar.json', 'utf8');
g = g.replace(/teür/g, 'teuer');
fs.writeFileSync('./src/data/grammar.json', g);
console.log('✓ grammar.json fixed');

// WRITING.JSON — mojibake in prompts + "heisst" instead of "heißt"
let w = fs.readFileSync('./src/data/writing.json', 'utf8');
w = w.replace(/heiÃŸe/g, 'heiße').replace(/heiÃŸt/g, 'heißt').replace(/Ã\u009c/g, 'Ü').replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/writing.json', w);
console.log('✓ writing.json fixed');

// SPEAKING.JSON — "heisst" in prompts
let sp = fs.readFileSync('./src/data/speaking.json', 'utf8');
sp = sp.replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/speaking.json', sp);
console.log('✓ speaking.json fixed');

// EXAMS.JSON — "heisst" in C1 exam question
let e = fs.readFileSync('./src/data/exams.json', 'utf8');
e = e.replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/exams.json', e);
console.log('✓ exams.json fixed');

// FSP VOCABULARY — word fields missing umlauts
let fsp = fs.readFileSync('./src/data/fspVocabulary.json', 'utf8');
fsp = fsp.replace(/"die Mudigkeit"/g, '"die Müdigkeit"');
fsp = fsp.replace(/"die Oberarzte"/g, '"die Oberärzte"');
fsp = fsp.replace(/ uber /g, ' über ').replace(/ fur /g, ' für ').replace(/ fruh /g, ' früh ');
fs.writeFileSync('./src/data/fspVocabulary.json', fsp);
console.log('✓ fspVocabulary.json fixed');

console.log('\n✅ All data corruption fixed. Run validate scripts to confirm.');
```

Add this to `package.json` scripts: `"fix-data": "node scripts/fix-data-corruption.cjs"`
Then run: `npm run fix-data`

## [x] Task 0.2 — Remove Grammar Duplicates
**File:** `src/data/grammar.json`

Run:
```js
// scripts/dedup-grammar.cjs
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/grammar.json', 'utf8'));
const seen = new Set();
let removed = 0;
for (const [lvl, exs] of Object.entries(data)) {
 data[lvl] = exs.filter(ex => {
 const key = ex.prompt?.trim().toLowerCase().slice(0, 60);
 if (seen.has(key)) { removed++; return false; }
 seen.add(key); return true;
 });
}
fs.writeFileSync('./src/data/grammar.json', JSON.stringify(data, null, 2));
console.log(`Removed ${removed} duplicate exercises`);
```

## [x] Task 0.3 — Validate Lesson–Exercise Alignment
**Files:** `src/data/germanLessons.json`, `src/data/grammar.json`

Run:
```js
// scripts/audit-lesson-coverage.cjs
const fs = require('fs');
const grammar = JSON.parse(fs.readFileSync('./src/data/grammar.json', 'utf8'));
const lessons = JSON.parse(fs.readFileSync('./src/data/germanLessons.json', 'utf8'));
const lessonIds = new Set(lessons.map(l => l.id));
const orphaned = [];
for (const [lvl, exs] of Object.entries(grammar)) {
 for (const ex of exs) {
 if (ex.lessonId && !lessonIds.has(ex.lessonId)) {
 orphaned.push({ id: ex.id, missing: ex.lessonId });
 }
 }
}
fs.writeFileSync('./audit-lesson-gaps.json', JSON.stringify(orphaned, null, 2));
console.log(`${orphaned.length} exercises reference missing lessons. See audit-lesson-gaps.json`);
```

Review `audit-lesson-gaps.json`. For each missing lesson, either create it or update the exercise's `lessonId` to point to the nearest equivalent lesson.

---

# ═══════════════════════════════════════════════════════
# PHASE 1 — FOUNDATION FIXES (Do second, ~1 day)
# Fix all broken logic before building new features
# ═══════════════════════════════════════════════════════

## [x] Task 1.1 — Two-Profile System (Login)
**Files to create/modify:** `src/pages/LoginPage.jsx` (NEW), `src/utils/store.js`, `src/App.jsx`, `src/components/Layout.jsx`

The login system must be completely local — no Firebase, no external service. Two named profiles share the device but have completely separate progress stored under namespaced localStorage keys.

**In `src/utils/store.js`:**
```js
// Add at the TOP before any state initialization:
const PROFILE_KEY = 'dk_active_profile';

function getActiveProfile() {
 return localStorage.getItem(PROFILE_KEY) || null;
}

function getStoreKey() {
 const profile = getActiveProfile() || 'default';
 return `deutsch_klinik_state_${profile}`;
}

export function switchProfile(name) {
 localStorage.setItem(PROFILE_KEY, name);
 window.location.reload();
}

export function signOutProfile() {
 localStorage.removeItem(PROFILE_KEY);
 window.location.reload();
}

export function getCurrentProfileName() {
 return getActiveProfile();
}
```

Replace the hardcoded `STORE_KEY` string with `getStoreKey()` everywhere in store.js.

**Create `src/pages/LoginPage.jsx`:**
Design a full-screen profile picker. Dark theme: background `#060912`, card background `rgba(16,22,40,0.97)`, accent `#00f0ff`, secondary accent `#8b5cf6`. Two profile cards side by side:

Card 1: Large emoji 🩺, name "Hossam", subtitle "Medical German • Orthopedics Track"
Card 2: Large emoji 🌸, name "Your Wife", subtitle "German Learning Partner"

Each card: `onClick={() => switchProfile('hossam')}` / `switchProfile('wife')`
Cards have hover glow effect matching their accent color. No password. No email.
Add `"Studying together since May 2026"` as a subtitle below both cards.

**In `src/App.jsx`:**
```jsx
import { getCurrentProfileName } from './utils/store';
import LoginPage from './pages/LoginPage';
// First line inside App():
if (!getCurrentProfileName()) return <LoginPage />;
```

**In `src/components/Layout.jsx`:**
Add to the top-right of the nav bar: profile avatar (emoji based on name) + "Switch" button that calls `signOutProfile()`.

## [ ] Task 1.2 — Fix Mark-as-Mastered Bug
**Files:** `src/pages/MistakeNotebookPage.jsx`, `src/utils/store.js`

**Root cause:** `storeMistakes.indexOf(mistake)` always returns -1 because objects are compared by reference. Then `splice(-1, 1)` silently deletes the wrong item.

**In `store.js`, add:**
```js
export function markMistakeMasteredById(level, exerciseId) {
 if (!state.incorrectAnswers[level]) return;
 const before = state.incorrectAnswers[level].length;
 state.incorrectAnswers[level] = state.incorrectAnswers[level]
 .filter(m => m.exerciseId !== exerciseId);
 if (state.incorrectAnswers[level].length < before) saveState(state);
}
```

**In `MistakeNotebookPage.jsx`:**
Replace all `handleMarkMastered(level, actualIdx)` calls with `handleMarkMasteredById(level, mistake.exerciseId)`.
Replace the handler:
```js
const handleMarkMasteredById = (level, exerciseId) => {
 markMistakeMasteredById(level, exerciseId);
 setRefreshKey(k => k + 1); // force re-render
};
```

## Task 1.3 — Vocab Mistakes Never Recorded
**Files:** `src/pages/VocabularyPage.jsx`, `src/pages/FlashcardPage.jsx`

**Root cause:** Neither page calls `recordAnswer()`, so `state.incorrectAnswers` never gets vocab entries, and the Mistakes section only shows grammar.

**In `VocabularyPage.jsx`**, inside the answer-check handler where `isCorrect === false`:
```js
import { recordAnswer } from '../utils/store';
recordAnswer(levelId, word.id, userAnswer, word.word, 'Vocabulary', false, 'vocab');
```

**In `FlashcardPage.jsx`**, inside the "Didn't Know" / thumbs-down handler:
```js
import { recordAnswer } from '../utils/store';
recordAnswer(levelId, card.id, '[flashcard]', card.word, 'Vocabulary', false, 'vocab');
```

## Task 1.4 — Flashcards Must Count Toward Exam Unlock
**Files:** `src/pages/FlashcardPage.jsx`

**Root cause:** FlashcardPage only updates `vocabularyMastery` (SM-2). It never calls `updateLevelProgress(levelId, 'vocab', ...)`, so flashcard reviews don't contribute to the exam unlock counter.

After each "Know" or "Don't Know" decision, add:
```js
import { updateLevelProgress } from '../utils/store';
updateLevelProgress(levelId, 'vocab', { date: new Date().toISOString(), wordId: card.id, correct: isCorrect });
```

## Task 1.5 — Reading Requirement Missing from LevelPage
**Files:** `src/pages/LevelPage.jsx`

Add the missing Requirement bar:
```jsx
<Requirement
 label="Reading Tests"
 current={prog.reading?.length || 0}
 target={levelData.minReadingTests}
/>
```

This must appear between "Listening Tests" and the exam unlock button.

## Task 1.6 — isExamUnlocked Crash on Invalid Level
**Files:** `src/pages/LevelPage.jsx`, `src/pages/ExamPage.jsx`, `src/utils/store.js`

**In `store.js`:** Add null guard at the top of `isExamUnlocked`:
```js
export function isExamUnlocked(level, levelData) {
 if (!levelData) return false; // ADD THIS LINE
 const prog = state.levels[level];
 if (!prog) return false;
 // ... rest of function
}
```

**In `LevelPage.jsx`:** Move `isExamUnlocked` call AFTER the null guard:
```js
const levelData = levelsData.levels.find(l => l.id === levelId);
if (!levelData) return <div>Level not found</div>;
const examUnlocked = isExamUnlocked(levelId, levelData); // MOVE HERE, after null check
```

Same fix in `ExamPage.jsx`.

## Task 1.7 — Delete Test Routes
**Files:** `src/App.jsx`, `src/pages/TestPage.jsx`, `src/pages/TestDataPage.jsx`

Delete both test page files. Remove both Route entries from App.jsx. These are live in production and expose debug tools.

## Task 1.8 — Fix WritingPage Direct State Mutation
**File:** `src/pages/WritingPage.jsx`

```js
// WRONG — mutates state singleton directly:
const writings = state.writings || [];
writings.push({ ... });
updateState({ writings });

// CORRECT — immutable:
const writings = [...(state.writings || []), {
 id: Date.now(), level: levelId, promptId: prompt.id,
 title: prompt.title, prompt: prompt.prompt,
 text, time: timer, date: new Date().toISOString()
}];
updateState({ writings });
```

---

# ═══════════════════════════════════════════════════════
# PHASE 2 — STUDY LOGIC ENGINE (Core intelligence, ~2 days)
# ═══════════════════════════════════════════════════════

## Task 2.1 — Study Goal: Auto-Predict Finish Date
**File:** `src/components/StudyGoalTracker.jsx`

**Remove:** `targetDate` input field entirely.
**Add:** Auto-calculation based on `dailyMinutes` + `targetLevel` + current progress.

Replace the form with just two inputs:
1. `targetLevel` dropdown: A1 / A2 / B1 / B2 / C1 / Medical FSP
2. `dailyMinutes` slider: 15 to 90 min, shows time in "X hrs Y min" format

Add this calculation:
```js
const HOURS_NEEDED = {
 A1: 75, A2: 100, B1: 150, B2: 200, C1: 250, 'Medical FSP': 120
};
const LEVEL_ORDER = ['A1','A2','B1','B2','C1','Medical FSP'];

function calcPredictedFinish(dailyMinutes, targetLevel, progressPct) {
 const targetIdx = LEVEL_ORDER.indexOf(targetLevel);
 const totalHours = LEVEL_ORDER
 .slice(0, targetIdx + 1)
 .reduce((sum, l) => sum + (HOURS_NEEDED[l] || 0), 0);
 const remainingHours = totalHours * (1 - Math.min((progressPct || 0) / 100, 0.99));
 const daysNeeded = Math.ceil((remainingHours * 60) / dailyMinutes);
 const finish = new Date();
 finish.setDate(finish.getDate() + daysNeeded);
 return { finish, daysNeeded };
}
```

Display prominently:
- "📅 Predicted finish: **March 15, 2027**"
- "⏱ **312 days** at 90 min/day"
- Status pill: 🟢 On Track / 🟡 Needs Work / 🔴 Behind

## Task 2.2 — Time-Based Daily Plan Engine
**File:** `src/pages/DailyMissionPage.jsx`

The daily plan must be generated from the user's `dailyMinutes` goal, not a fixed set of items.

**Time allocation per 30-minute base unit:**
```js
const TIME_BUDGET = {
 lesson: 0.25, // 25% → at 90min = 22.5min → floor(22.5/8) = 2 lessons
 grammar: 0.20, // 20% → 18min → floor(18/1.5) = 12 questions
 flashcard: 0.20, // 20% → 18min → floor(18/0.5) = 36 cards
 reading: 0.15, // 15% → 13.5min → floor(13.5/5) = 2 exercises
 listening: 0.12, // 12% → 10.8min → floor(10.8/4) = 2 exercises
 writing: 0.08, // 8% → 7.2min → 1 prompt
};

const MINS_PER_ITEM = {
 lesson: 8, grammar: 1.5, flashcard: 0.5,
 reading: 5, listening: 4, writing: 7, speaking: 6
};

function generatePlan(dailyMinutes, currentLevel, goal) {
 const plan = [];
 for (const [skill, fraction] of Object.entries(TIME_BUDGET)) {
 const allocated = dailyMinutes * fraction;
 const count = Math.max(1, Math.floor(allocated / MINS_PER_ITEM[skill]));
 plan.push({ skill, count });
 }
 // If targetLevel is 'Medical FSP', inject FSP items
 if (goal?.targetLevel === 'Medical FSP') {
 plan.push({ skill: 'fsp_anamnese', count: 1 });
 plan.push({ skill: 'fsp_vocab', count: 10 });
 }
 return plan;
}
```

## Task 2.3 — Session Time Tracker
**Files:** `src/utils/store.js`, `src/pages/DailyMissionPage.jsx`, `src/components/StudyGoalTracker.jsx`

**In store.js add:**
```js
// In defaultState:
studyLog: {}, // { 'YYYY-MM-DD': { minutes: number, sessions: number } }

// Add functions:
export function recordStudyTime(minutes) {
 const today = getLocalDateKey();
 if (!state.studyLog) state.studyLog = {};
 if (!state.studyLog[today]) state.studyLog[today] = { minutes: 0, sessions: 0 };
 state.studyLog[today].minutes += minutes;
 state.studyLog[today].sessions += 1;
 saveState(state);
}

export function getTodayStudyMinutes() {
 const today = getLocalDateKey();
 return Math.round(state.studyLog?.[today]?.minutes || 0);
}

export function getStudyHistory(days = 7) {
 const result = [];
 for (let i = 0; i < days; i++) {
 const d = new Date(); d.setDate(d.getDate() - days + i + 1);
 const key = d.toISOString().slice(0,10);
 result.push({ date: key, minutes: state.studyLog?.[key]?.minutes || 0 });
 }
 return result;
}
```

**In DailyMissionPage.jsx:** Start a `sessionStart = Date.now()` when each activity begins. When it completes, call `recordStudyTime((Date.now() - sessionStart) / 60000)`.

**In StudyGoalTracker.jsx:** Replace task-count display with `getTodayStudyMinutes()` as a progress bar toward `goal.dailyMinutes`.

## Task 2.4 — Adaptive Remediation on Bad Score
**Files:** `src/pages/ListeningPage.jsx`, `src/pages/SpeakingPage.jsx`, `src/pages/GrammarPage.jsx`

After any score below 60%, automatically show a "Needs Work" panel:

```jsx
{score < 60 && (
 <div className="remediation-panel">
 <h3>🔄 Let's fix this</h3>
 <p>You scored {score}%. Here's your recovery plan:</p>

 {/* Show exactly which questions were wrong, with explanations */}
 {wrongAnswers.map(q => (
 <div key={q.id}>
 <span className="wrong">{q.userAnswer}</span> →
 <span className="correct">{q.correctAnswer}</span>
 <p className="explanation">{q.explanation}</p>
 </div>
 ))}

 {/* Link to the lesson that covers this topic */}
 <Link to={`/level/${levelId}/lessons/${exercise.lessonId}`}>
 📖 Review the lesson for this topic →
 </Link>

 {/* Retry button */}
 <button onClick={resetExercise}>🔁 Try again</button>
 </div>
)}
```

Log the failed exercise to `recordAnswer(...)` so it appears in the Mistakes Notebook.

## Task 2.5 — Weak Topics: Make Them Actionable
**File:** `src/pages/MistakeNotebookPage.jsx`, `src/pages/GrammarPage.jsx`

**In MistakeNotebookPage.jsx**, each weak topic card gets a "Practice Now →" button:
```jsx
<button onClick={() => navigate(`/level/${topic.level}/grammar?topic=${encodeURIComponent(topic.topic)}`)}>
 Practice {topic.topic} →
</button>
```

**In GrammarPage.jsx**, read the `topic` query param and filter:
```js
import { useSearchParams } from 'react-router-dom';
const [searchParams] = useSearchParams();
const topicFilter = searchParams.get('topic');
const exercises = (grammarData[levelId] || [])
 .filter(ex => !topicFilter || ex.topic === topicFilter);
// Show a banner: "Practicing only: Adjective Endings [Clear filter ×]"
```

## Task 2.6 — Vocab Review: SM-2 Due Queue Only
**File:** `src/pages/MistakeNotebookPage.jsx`

**Root cause:** Vocab review shows ALL 4300 words and "Knew It" does nothing.

**Fix:**
```js
import { getDueVocabWords, recordVocabAnswer, getState } from '../utils/store';
// Only show SM-2 due words:
const allIds = Object.values(vocabData).flatMap(arr => arr.map(v => v.id));
const dueIds = getDueVocabWords(allIds); // already exists in store.js
const dueWords = Object.values(vocabData)
 .flatMap(arr => arr)
 .filter(w => dueIds.includes(w.id));
```

"Knew It" button:
```js
onClick={() => {
 recordVocabAnswer(word.id, true);
 setDueWords(prev => prev.filter(w => w.id !== word.id));
}}
```

Show count: "**{dueWords.length} words** due for review today"
If count is 0: Show "✅ All vocabulary reviewed — come back tomorrow"

## Task 2.7 — Flashcards in Every Daily Plan
**File:** `src/pages/DailyMissionPage.jsx`

Flashcard step is now built into the plan engine from Task 2.2. Implement the inline flashcard UI:

```jsx
// Inside the daily mission flow, when current step is 'flashcard':
function FlashcardStep({ cards, onComplete }) {
 const [idx, setIdx] = useState(0);
 const [flipped, setFlipped] = useState(false);
 const current = cards[idx];

 const handleAnswer = (knew) => {
 recordVocabAnswer(current.id, knew);
 updateLevelProgress(levelId, 'vocab', { date: new Date().toISOString(), wordId: current.id });
 if (!knew) recordAnswer(levelId, current.id, '[flashcard]', current.word, 'Vocabulary', false, 'vocab');
 if (idx + 1 >= cards.length) onComplete();
 else { setIdx(idx + 1); setFlipped(false); }
 };

 return (
 <div className="flashcard-container">
 <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
 <div className="front">{current.word}</div>
 <div className="back">{current.translation} | {current.article} {current.word}</div>
 </div>
 {flipped && (
 <div className="buttons">
 <button onClick={() => handleAnswer(false)}>❌ Didn't Know</button>
 <button onClick={() => handleAnswer(true)}>✅ Knew It</button>
 </div>
 )}
 <p>{idx + 1} / {cards.length}</p>
 </div>
 );
}
```

---

# ═══════════════════════════════════════════════════════
# PHASE 3 — AI INTEGRATION (Most impactful, ~1 day)
# ═══════════════════════════════════════════════════════

## Task 3.1 — Writing: In-Browser AI Correction (No Worker Needed)
**Files:** `src/utils/aiCorrection.js`, `src/pages/WritingPage.jsx`

Add a browser-direct fallback to `aiCorrection.js`:

```js
async function callBrowserFallback(body) {
 const systemPrompt = body.type === 'writing'
 ? `You are an expert German language teacher. The student is learning German for medical residency in Germany. Analyze their writing strictly. Return ONLY valid JSON with these exact fields:
{
 "score": <number 0-10>,
 "rubric": { "grammar": <0-10>, "vocabulary": <0-10>, "task_completion": <0-10>, "coherence": <0-10> },
 "mistakes": [{ "original": "...", "corrected": "...", "explanation": "...", "rule": "..." }],
 "correctedVersion": "...",
 "improvedVersion": "...",
 "keyPhrases": ["medical phrase 1", "phrase 2"],
 "ceferLevel": "A2/B1/B2/C1"
}`
 : `You are an expert German language teacher specializing in medical German (FSP). Evaluate the spoken German transcript. Return ONLY valid JSON:
{
 "score": <number 0-10>,
 "rubric": { "grammar": <0-10>, "vocabulary": <0-10>, "fluency": <0-10>, "medical_accuracy": <0-10> },
 "mistakes": [{ "original": "...", "corrected": "...", "explanation": "..." }],
 "betterPhrases": ["better phrase 1", "..."],
 "correctedTranscript": "...",
 "strongerAnswer": "...",
 "clinicalNote": "..."
}`;

 const userContent = body.type === 'writing'
 ? `Level: ${body.level}\nTask: ${JSON.stringify(body.task)}\n\nStudent's answer:\n${body.userAnswer}`
 : `Level: ${body.level}\nPrompt: ${JSON.stringify(body.task)}\n\nTranscript:\n${body.transcript}`;

 const response = await fetch('https://api.anthropic.com/v1/messages', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 model: 'claude-sonnet-4-20250514',
 max_tokens: 1500,
 system: systemPrompt,
 messages: [{ role: 'user', content: userContent }]
 })
 });

 if (!response.ok) throw new Error(`API error: ${response.status}`);
 const data = await response.json();
 const raw = data.content?.[0]?.text || '{}';
 return JSON.parse(raw.replace(/```json|```/g, '').trim());
}
```

Update `correctWriting` and `correctSpeaking` to call this fallback if no Worker endpoint is configured.

**In `WritingPage.jsx`:**
- Trigger `correctWriting()` automatically on submit (no button click needed)
- Show loading spinner: "🤖 Analyzing your German..."
- Display result card with:
 - Score gauge (colored ring: red < 6, yellow 6-7, green > 7)
 - Rubric breakdown (4 bars)
 - Mistakes list (original → corrected → rule explained)
 - Corrected version (in a styled diff view)
 - "Next Writing Prompt →" button

## Task 3.2 — Speaking: Auto-Transcribe + Auto-Correct
**File:** `src/pages/SpeakingPage.jsx`

Remove "Transcribe Recording" button. Make the flow fully automatic:

```js
const startRecording = () => {
 // 1. Start MediaRecorder for audio (local only, never uploaded)
 navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
 mediaRecorderRef.current = new MediaRecorder(stream);
 mediaRecorderRef.current.start();
 setAudioRecorderState('recording');
 });

 // 2. Start SpeechRecognition simultaneously
 const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
 if (SR) {
 const recognition = new SR();
 recognition.lang = 'de-DE';
 recognition.continuous = true;
 recognition.interimResults = true;
 recognition.onresult = (event) => {
 let interim = '', final = '';
 for (const r of event.results) {
 if (r.isFinal) final += r[0].transcript;
 else interim += r[0].transcript;
 }
 setTranscript(final);
 setInterimTranscript(interim); // show in grey
 };
 recognition.start();
 recognitionRef.current = recognition;
 }
};

const stopRecording = async () => {
 mediaRecorderRef.current?.stop();
 recognitionRef.current?.stop();
 setAudioRecorderState('recorded');
 // Auto-trigger correction after 500ms delay
 setTimeout(() => triggerCorrection(), 500);
};

const triggerCorrection = async () => {
 if (!transcript.trim()) return;
 setAiState('loading');
 try {
 const result = await correctSpeaking({ level: levelId, task: prompt, transcript });
 setAiResult(result);
 setAiState('done');
 // Auto-save the session
 recordAnswer(levelId, prompt.id, transcript, '', 'Speaking', result.score >= 6, 'speaking');
 // Show remediation if score < 6
 } catch (e) {
 setAiError(e.message);
 setAiState('error');
 }
};
```

Show interim transcript in real-time as the user speaks (greyed-out italic text updating live). Show final transcript in solid white when recording stops.

## Task 3.3 — AI Conversation Simulator (NEW FEATURE)
**Files to create:** `src/pages/ConversationSimPage.jsx`, route in `App.jsx`

This is the most powerful feature you can add. It lets the user practice real German conversation with an AI playing different roles:

**Roles available:**
- 👨‍⚕️ German Patient (Anamnesegespräch practice)
- 👩‍⚕️ Senior Doctor / Oberarzt (Fallvorstellung practice)
- 📝 Ärztekammer Examiner (FSP exam simulation)
- 🏪 Shopkeeper, 🏠 Landlord, 💼 HR Interview (everyday German)

**Implementation:**
```jsx
function ConversationSimPage() {
 const [messages, setMessages] = useState([]);
 const [userInput, setUserInput] = useState('');
 const [role, setRole] = useState('patient');
 const [isLoading, setIsLoading] = useState(false);

 const SYSTEM_PROMPTS = {
 patient: `You are a German patient named Herr Müller, 58 years old, visiting an orthopedic clinic with knee pain. Respond ONLY in German. Keep responses natural and brief (1-3 sentences). If the doctor says something grammatically wrong, subtly rephrase it correctly in your response without pointing it out. Start by greeting the doctor.`,
 oberarzt: `You are Dr. Weber, an Oberarzt at a German hospital. The user is presenting a case to you. Respond in formal
 German. Ask clarifying questions. Give feedback on their presentation. If they use English medical terms where German ones exist, correct them.`,
 examiner: `You are conducting the Fachsprachpr�fung (FSP) for a doctor applying for Approbation in Germany. Conduct the full exam: 1) Patient history roleplay 2) Case presentation 3) Ask them to write an Arztbrief. Be professional and realistic.`
 };

 const sendMessage = async () => {
 const newMessages = [...messages, { role: 'user', content: userInput }];
 setMessages(newMessages);
 setUserInput('');
 setIsLoading(true);

 const response = await fetch('https://api.anthropic.com/v1/messages', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 model: 'claude-sonnet-4-20250514',
 max_tokens: 300,
 system: SYSTEM_PROMPTS[role],
 messages: newMessages
 })
 });
 const data = await response.json();
 const reply = data.content?.[0]?.text || '';
 setMessages([...newMessages, { role: 'assistant', content: reply }]);
 setIsLoading(false);
 // TTS: speak the reply in German
 const utterance = new SpeechSynthesisUtterance(reply);
 utterance.lang = 'de-DE'; utterance.rate = 0.9;
 window.speechSynthesis.speak(utterance);
 };

 return (/* full chat UI */);
}
```

Add route: `<Route path="conversation-sim" element={<ConversationSimPage />} />`
Add to nav under a "Practice" dropdown.

---

# -------------------------------------------------------
# PHASE 4 � CURRICULUM COMPLETENESS (~3 days, content work)
# This is the most time-consuming but most important phase
# -------------------------------------------------------

## Task 4.1 � Lesson Standard: Every Lesson Must Be Fully Self-Sufficient
**File:** `src/data/germanLessons.json`

Every lesson must teach everything a student needs to answer ALL exercises linked to it. No exercise should require outside knowledge.

Required fields per lesson (add any that are missing):
```json
{
 "id": "A1_lesson_1",
 "level": "A1",
 "unit": "A1_unit_1",
 "title": "...",
 "objective": "By the end of this lesson, you can...",
 "explanation": "Full explanation, minimum 200 words, ALL rules included",
 "grammarRules": [
 { "rule": "...", "formula": "Subject + Verb + Object", "example": "Ich bin Arzt." }
 ],
 "examples": [
 { "german": "Ich hei�e Hossam.", "english": "My name is Hossam.", "note": "hei�e is 1st person singular of hei�en" }
 ],
 "vocabulary": [
 { "word": "der Arzt", "article": "der", "plural": "die �rzte", "translation": "doctor (male)", "example": "Ich bin Arzt." }
 ],
 "pronunciationTips": [
 { "sound": "ei", "example": "hei�en", "english_approx": "like 'eye'", "ipa": "/ha?sn/" },
 { "sound": "ie", "example": "viel", "english_approx": "like 'ee'", "ipa": "/fi?l/" }
 ],
 "commonMistakes": [
 { "wrong": "Ich bin heisse Hossam", "correct": "Ich hei�e Hossam", "reason": "hei�en is a verb, not an adjective" }
 ],
 "practiceQuestions": [
 { "question": "How do you say 'My name is...' in German?", "answer": "Ich hei�e...", "hint": "Use the verb hei�en" }
 ],
 "relatedLessonIds": ["A1_lesson_2"],
 "linkedExerciseTopics": ["Greetings", "Introductions", "Verb: sein"]
}
```

For each lesson in `audit-lesson-gaps.json` (from Task 0.3), write the missing content. Prioritize A1 and A2 first since those run the longest.

## Task 4.2 � Pronunciation Guide Component
**Files:** `src/components/PronunciationGuide.jsx`, `src/pages/LessonDetailPage.jsx`

The `PronunciationGuide` component already exists. Verify it is rendered in `LessonDetailPage.jsx`. If not:
```jsx
import PronunciationGuide from '../components/PronunciationGuide';
// In lesson render, after explanation section:
{lesson.pronunciationTips?.length > 0 && (
 <PronunciationGuide tips={lesson.pronunciationTips} />
)}
```

The component should:
- Show each sound with IPA, English approximation, and a clickable audio example (TTS)
- Group sounds by difficulty: A1 sounds (basic letters) ? A2 (umlauts) ? B1 (ch/sch/sp/st) ? B2+ (regional variation awareness)
- Include a "Practice" button that reads the example word aloud using SpeechSynthesis

## Task 4.3 � Medical FSP Module: Full Clinical Curriculum
**Files:** `src/data/fspVocabulary.json`, `src/data/fspAnamnese.json`, `src/data/fspCases.json`

The FSP module must prepare for the real exam format exactly. Verify and expand:

**Anamnesegespr�ch scenarios needed (add if missing):**
- Akuter Brustschmerz (cardiac, relevant to ortho exam)
- Knieschmerzen / Gelenkbeschwerden (orthopedic � critical for Hossam)
- R�ckenschmerzen / Bandscheibenvorfall
- Fraktur / Trauma (accident, fracture management)
- Postoperative Wundversorgung
- Chronische Gelenkerkrankung (Arthritis, Arthrose)

**Each FSP case must include:**
```json
{
 "id": "fsp_case_ortho_1",
 "title": "Knieschmerzen � 45-j�hriger Patient",
 "scenario": "...",
 "patientInfo": { "name": "Herr Schmidt", "age": 45, "complaint": "..." },
 "mustAsk": ["Schmerzlokalisation", "Schmerzdauer", "Ausl�ser", "Begleitsymptome", "Vorerkrankungen", "Medikamente"],
 "redFlags": ["starke Schwellung", "Fieber", "Trauma"],
 "usefulPhrases": [
 "Wo genau haben Sie die Schmerzen?",
 "Seit wann bestehen die Beschwerden?",
 "Haben Sie das schon fr�her gehabt?"
 ],
 "arztbriefTemplate": "Sehr geehrte Kolleginnen und Kollegen,\n\nwir berichten �ber unseren Patienten Herrn Schmidt...",
 "fallvorstellung": "Zusammenfassend handelt es sich um einen 45-j�hrigen Patienten, der sich mit...",
 "vocabulary": ["die Knieschmerzen", "die Gelenkspaltverengung", "der Meniskus", "die Arthrose"]
}
```

## Task 4.4 � Arztbrief Practice Module (NEW FEATURE)
**Files to create:** `src/pages/ArztbriefPage.jsx`, `src/data/arztbriefTemplates.json`

The Arztbrief (doctor's letter) is one of the three parts of the FSP exam. It needs dedicated practice.

Create a structured Arztbrief practice page:
1. Show a clinical scenario (patient info, diagnosis, treatment)
2. User writes the letter in a formatted text area with sections:
 - Anrede (salutation)
 - Vorstellung des Patienten
 - Diagnose(n)
 - Therapie und Verlauf
 - Empfehlung
 - Abschluss
3. AI grades each section separately and gives a total score
4. Show a model Arztbrief for comparison after submission

Add to FSP Hub navigation: "?? Arztbrief Training"

---

# -------------------------------------------------------
# PHASE 5 � UI TRANSFORMATION (Visual overhaul, ~2 days)
# -------------------------------------------------------

## Task 5.1 � Navigation: Collapse Levels Into Dropdown
**File:** `src/components/Layout.jsx`

Replace individual level links with a grouped dropdown:

```jsx
// New nav structure:
const NAV_ITEMS = [
 { label: 'Dashboard', to: '/', icon: Home },
 { label: 'Levels', dropdown: [
 { label: 'A1 � Beginner', to: '/level/A1' },
 { label: 'A2 � Elementary', to: '/level/A2' },
 { label: 'B1 � Intermediate', to: '/level/B1' },
 { label: 'B2 � Upper Intermediate', to: '/level/B2' },
 { label: 'C1 � Advanced', to: '/level/C1' },
 { divider: true },
 { label: '?? Medical FSP', to: '/medical-fsp', accent: true },
 ]},
 { label: 'Practice', dropdown: [
 { label: '?? Conversation Sim', to: '/conversation-sim' },
 { label: '?? Arztbrief Training', to: '/medical-fsp/arztbrief' },
 { label: '?? Mistakes', to: '/mistake-notebook' },
 ]},
 { label: 'Resources', to: '/resources' },
];
```

Final nav: `? Deutsch Klinik | Dashboard | Levels ? | Practice ? | Resources | ?? Hossam`

## Task 5.2 � Dashboard: Redesign as a Command Center
**File:** `src/pages/Dashboard.jsx`

Completely restructure the dashboard layout into these zones:

**Zone 1 � Header Strip (full width):**
```
?? Guten Morgen, Hossam! ?? 7-day streak ?? A2 ? C1 by March 2027
```

**Zone 2 � Start Today (large CTA):**
```
+------------------------------------------------------+
� ? START TODAY'S PLAN �
� 90 min � 2 lessons � 12 grammar � 36 flashcards �
� 2 reading � 2 listening � 1 writing �
� ���������������������� 35/90 min today �
+------------------------------------------------------+
```

**Zone 3 � Level Progress Strip (compact):**
```
A1 ���� 100% ? A2 ��� 34% B1 � 0% B2 � 0% C1 � 0% FSP � 0%
```

**Zone 4 � Current Level Focus:**
```
+-----------------------------------------+
� ?? You are here: A2 �
� Grammar 7/10 ����� Vocab 4/10 ���� �
� Reading 2/3 ��� Listening 2/3 ��� �
� Writing 1/5 ��� Speaking 0/3 ��� �
� �
� [?? Take A2 Exam ?] (unlock pending) �
+-----------------------------------------+
```

**Zone 5 � Stats Row:**
```
?? Mistakes: 12 grammar, 3 vocab | ?? 7-day study history [sparkline]
```

**Zone 6 � Study History (compact sparkline bar chart):**
Show last 7 days as mini bars: each bar = minutes studied that day. Use `getStudyHistory(7)` from store.

Remove: everything that's currently cluttering the dashboard.

## Task 5.3 � Level Page: Card-Based Skill Grid
**File:** `src/pages/LevelPage.jsx`

Each skill card should show:
- Skill name + icon
- Progress bar (X done / Y required)
- "Continue" button ? goes directly to next incomplete exercise
- "?" badge if requirement met

Add a prominent Exam Requirements checklist at the bottom:
```
To unlock the A2 exam, complete:
? Grammar: 10/10 ? Vocabulary: 10/10 ? Reading: 3/3
? Listening: 3/3 ? Writing: 1/5 ? Speaking: 0/3
? Lessons: 8/10

[?? Exam Locked � Complete 2 more writing tasks and 3 speaking tasks]
```

When exam is unlocked:
```
[?? Take the A2 Exam ?]
```

## Task 5.4 � Post-Exam: Auto-Advance to Next Level
**File:** `src/pages/ExamPage.jsx`

After passing an exam, show a celebration screen then auto-update `currentLevel`:

```js
if (passed) {
 const levelOrder = ['A1','A2','B1','B2','C1'];
 const nextIdx = levelOrder.indexOf(levelId) + 1;
 if (nextIdx < levelOrder.length) {
 updateState({ currentLevel: levelOrder[nextIdx] });
 }
 // Update predicted finish date recalculation
 setPhase('celebration');
}
```

Celebration screen:
```
?? A2 Complete!
You scored 84% � Passed!

You've unlocked: B1 � Intermediate
Your predicted C1 date: March 15, 2027

[?? Start B1 ?] [?? Review Results]
```

---

# -------------------------------------------------------
# PHASE 6 � INNOVATIVE FEATURES (These make it world-class)
# Implement after all above phases are complete
# -------------------------------------------------------

## Feature 6.1 � 7-Day Study History Heatmap
**New component:** `src/components/StudyHeatmap.jsx`

Show a GitHub-style heatmap of the last 90 days on the dashboard.
Each square = one day. Color intensity = minutes studied.
`0 min = #161b22`, `1-30 = #0e4429`, `31-60 = #006d32`, `61-89 = #26a641`, `90+ = #39d353`

## Feature 6.2 � Word Network (Vocabulary Connections)
**New page:** `src/pages/VocabNetworkPage.jsx`

Using D3.js (already in the allowed library list), render a force-directed graph where:
- Each node = a vocabulary word
- Edges connect words that appear in the same lesson
- Node size = how many times the word has been reviewed
- Color = mastery level (red = weak, yellow = learning, green = mastered)
- Clicking a node shows the word, its article, plural, and 3 example sentences

## Feature 6.3 � Daily German Wisdom
On the dashboard, show a daily German proverb or medical phrase with explanation:
```
?? Heute's phrase:
"Ein guter Arzt behandelt die Krankheit; ein gro�er Arzt behandelt den Patienten."
A good doctor treats the disease; a great doctor treats the patient.
� Attributed to Sir William Osler
```

Rotate from a curated list of 365 medical + general German phrases stored in `src/data/dailyPhrases.json`.

## Feature 6.4 � Achievement System
**New:** `src/data/achievements.json`, `src/components/AchievementToast.jsx`

Achievements unlock automatically and show as a toast notification:

```json
[
 { "id": "first_lesson", "title": "Erste Schritte", "desc": "Complete your first lesson", "icon": "??", "xp": 10 },
 { "id": "streak_7", "title": "Eine Woche", "desc": "7-day study streak", "icon": "??", "xp": 50 },
 { "id": "a1_complete", "title": "A1 Gemeistert", "desc": "Pass the A1 exam", "icon": "??", "xp": 100 },
 { "id": "fsp_ready", "title": "FSP Bereit", "desc": "Complete all FSP modules", "icon": "??", "xp": 500 },
 { "id": "vocab_500", "title": "Wortschatzmeister", "desc": "Master 500 vocabulary words", "icon": "??", "xp": 200 },
 { "id": "no_mistakes_day", "title": "Perfekter Tag", "desc": "Complete a full day plan with 0 grammar mistakes", "icon": "?", "xp": 75 }
]
```

Check achievements after every completed activity. If earned, show `AchievementToast` for 3 seconds.

## Feature 6.5 � German Phrasebook for Hospital Life
**New page:** `src/pages/PhrasebookPage.jsx`

A quick-reference card collection organized by scenario:

Categories:
- ?? Ward Rounds (Visite)
- ?? Radiology / Imaging
- ?? Surgical Consent (Aufkl�rung)
- ?? Medications / Pharmacy
- ?? Documentation (Dokumentation)
- ?? Emergency (Notfall)
- ???????? Family Communication
- ?? Phone / Pager Etiquette
- ?? Greeting Colleagues

Each card: German phrase | pronunciation | English | when to use it | tap to hear TTS.
Filter/search bar. Printable version button.

## Feature 6.6 � Speaking Voice Journal
**New feature on SpeakingPage:**

Add "?? My Voice Journal" � a log of all past speaking attempts with:
- Date
- Prompt title
- Score (0-10)
- Key mistakes from that session
- Trend line showing score progression over time

This shows concrete evidence of improvement over weeks.

## Feature 6.7 � Study Buddy Progress Comparison
Since both Hossam and Wife use the site, add a comparison widget on the dashboard (only visible to logged-in user):

```
?? Study Buddy Stats
You: A2 | 7-day streak | 45h total
Wife: A1 | 3-day streak | 12h total
This week: You +5h vs Wife +3h
```

This reads from both namespaced localStorage keys and shows the other profile's public stats. No private data (mistakes, scores) is shared � only level, streak, and total hours.

---

# -------------------------------------------------------
# PHASE 7 � QUALITY ASSURANCE (Do last)
# -------------------------------------------------------

## Task 7.1 � Add Missing Validation Scripts
Add to `package.json`:
```json
"validate-truefalse": "node scripts/validate-truefalse.cjs",
"validate-lesson-coverage": "node scripts/audit-lesson-coverage.cjs",
"validate-all": "npm run validate-grammar && npm run validate-german-orthography && npm run validate-truefalse && npm run validate-lesson-coverage"
```

**Create `scripts/validate-truefalse.cjs`:**
```js
const listening = require('./src/data/listening.json');
let issues = 0;
for (const [lvl, items] of Object.entries(listening)) {
 for (const item of items) {
 for (const q of item.questions || []) {
 if (q.type === 'true-false' && !['true','false'].includes(q.answer)) {
 console.error(`? ${item.id}/${q.id}: invalid true-false answer: ${JSON.stringify(q.answer)}`);
 issues++;
 }
 }
 }
}
if (issues === 0) console.log('? All true-false answers valid');
else process.exit(1);
```

## Task 7.2 � Playwright Test Coverage Gaps
Add these tests that are currently missing:

```js
// tests/exam-unlock.spec.js
test('exam unlocks only after all 6 requirements met', async ({ page }) => { ... });
test('reading requirement appears on LevelPage', async ({ page }) => { ... });
test('exam lock message is accurate', async ({ page }) => { ... });

// tests/mistakes.spec.js
test('mark as mastered removes the correct mistake', async ({ page }) => { ... });
test('vocab mistakes appear after wrong flashcard answer', async ({ page }) => { ... });

// tests/study-goal.spec.js
test('predicted date updates when daily minutes changes', async ({ page }) => { ... });
test('time tracker increments during study session', async ({ page }) => { ... });
```

## Task 7.3 � Final Cleanup
- Delete `src/pages/TestPage.jsx` and `src/pages/TestDataPage.jsx`
- Remove their routes from `App.jsx`
- Verify `src/data/archive/` folder is gitignored or deleted
- Verify `germanVocabulary.json.bak` is deleted
- Ensure `.env` is in `.gitignore` and never committed

---

# -------------------------------------------------------
# MASTER EXECUTION ORDER
# -------------------------------------------------------

```
Week 1 � Foundation
 Day 1-2: Phase 0 (data fixes) + Phase 1 (bug fixes)
 Day 3-4: Phase 2 (study logic engine)
 Day 5-7: Phase 3 (AI integration)

Week 2 � Content & UI
 Day 1-3: Phase 4 (curriculum completeness � this takes the longest)
 Day 4-5: Phase 5 (UI transformation)
 Day 6-7: Phase 6 features (pick the ones you want most first)

Week 3 � Polish
 Phase 7 (QA, tests, cleanup)
 Cloudflare Worker reconnection (parallel task)
 User acceptance testing with both profiles
```

**Highest ROI order if you have limited time:**
1. Phase 0 � Data fixes (30 min, fixes listening permanently)
2. Task 1.1 � Login (30 min, fixes issue #1)
3. Task 1.2 � Mark as Mastered bug (15 min, fixes issue #7)
4. Task 1.3 + 1.4 � Vocab mistakes + flashcard counting (20 min)
5. Task 3.1 + 3.2 � AI writing + speaking (2 hours, fixes issues #4 + #5)
6. Task 2.1 + 2.2 � Study goal auto-predict + time-based plan (2 hours, fixes issues #2 + #6)
7. Task 5.1 + 5.2 � Nav + Dashboard redesign (3 hours, fixes issue #12)
8. Phase 6 features � In order of your preference

---

# WHAT THIS TRANSFORMS THE WEBSITE INTO

When fully implemented, Deutsch Klinik becomes:

? **A complete A1?C1?FSP learning path** � 125 lessons, 1200+ grammar exercises, 2700+ vocabulary words, reading, listening, writing, speaking, all connected to each other

? **An adaptive AI tutor** � Writing and speaking are corrected automatically with medical-German-specialist feedback, not generic corrections

? **A real FSP simulator** � Arztbrief writing, Anamnesegespr�ch roleplay with AI patient, Fallvorstellung practice, and full timed FSP exams

? **A time-aware study planner** � Sets your daily goal once, calculates your finish date, generates the exact right number of exercises each day, tracks your minutes accurately

? **A meaningful mistake tracker** � Grammar AND vocabulary mistakes captured, mark as mastered works, weak topics link directly to practice, SM-2 flashcard queue shows only due words

? **A two-profile system** � Hossam and wife have completely separate progress, both visible for motivation

? **A motivating experience** � Achievements, voice journal, study heatmap, conversation simulator make it worth opening every day

You will need no other resource. Everything required to pass B2, then C1, then the FSP is contained in this system.
