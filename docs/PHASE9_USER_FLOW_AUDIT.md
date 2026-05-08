# Phase 9: User Flow Audit

## Current State (Before Onboarding)

### 1. First Visit Flow

**Entry point:** `src/App.jsx`
```
User visits app
  -> getCurrentProfileName() returns null (no saved profile)
  -> App renders <LoginPage />
```

`LoginPage.jsx`:
- Simple name entry form (input field + submit button)
- On submit: calls `switchProfile(name)` which sets `dk_active_profile` in localStorage
- `switchProfile` calls `window.location.reload()`

### 2. Post-Login Flow

```
User enters name
  -> page reloads
  -> App.jsx checks getCurrentProfileName() -> returns name
  -> App renders <ErrorBoundary><HashRouter><Routes>...</Routes></HashRouter></ErrorBoundary>
  -> Default route "/" loads Dashboard
```

### 3. Dashboard (`src/pages/Dashboard.jsx`) — ~1900 lines

What it shows:
- **Today's Study Plan** — plan grid with mini metrics and 7 study plan buttons
- **Hero section** — logo, description, link to placement test + daily plan
- **Stats row** — 6 stat cards (streak, current level, total completed, weekly focus, exams passed, medical German status)
- **Resume Last Activity** — shows most recent activity with continue link
- **Current Level Overview** — progress bars for all skill areas + action buttons
- **Study Goal Tracker** — embedded `StudyGoalTracker` component (goal setup via localStorage key `deutsch_klinik_study_goal`)
- **Recommended Next Session** — suggests next study activity
- **Account & Cloud Sync** — auth panel + settings management
- **Recent Sessions** — session history from localStorage
- **Study Streak** — 7-day activity chart
- **Mistake Review** — mistake count + link to mistake notebook
- **Quick Actions** — button grid (next lesson, flashcards, grammar, etc.)
- **Next Lesson + Exam Progress** — two-column card grid
- **Weak Areas** — topic weakness display
- **C1 Readiness** — readiness assessment card
- **Level Progress Cards** — all levels with progress bars
- **Progress Backup** — export/import/clear controls
- **Debug panel** — only in dev mode

### 4. Placement Test (`src/pages/PlacementTest.jsx`)

- 11 hardcoded questions (mix of A1-C1 grammar/vocab)
- Calculates `recommendedLevel` and saves to `state.placementResult` and `state.currentLevel`
- Shows result screen with "Start at X" link to `/level/{level}`

### 5. Route Handling

**App.jsx routes (HashRouter):**
```
"/"                      -> Dashboard
"level/:levelId"         -> LevelPage
"level/:levelId/grammar" -> GrammarPage
"level/:levelId/vocabulary" -> VocabularyPage
"level/:levelId/vocabulary/flashcards" -> FlashcardPage
"level/:levelId/vocabulary/practice" -> PracticePage
"level/:levelId/reading" -> ReadingPage
"level/:levelId/listening" -> ListeningPage
"level/:levelId/writing" -> WritingPage
"level/:levelId/speaking" -> SpeakingPage
"level/:levelId/exam"    -> ExamPage (has its own route guard)
"level/:levelId/lessons" -> LessonsPage
"level/:levelId/daily"   -> DailyMissionPage
"level/:levelId/lessons/:lessonId" -> LessonDetailPage
"resources"              -> ResourcesPage
"medical"               -> MedicalPage
"placement-test"        -> PlacementTest
"c1-readiness"          -> C1ReadinessPage
"mistake-notebook"      -> MistakeNotebookPage
"medical-fsp"           -> MedicalFSPHubPage
"medical-fsp/vocabulary" -> FSPVocabPage
..., etc.
```

### 6. Route Protection

**Current state:** No route protection exists (beyond LoginPage check).
- Any logged-in user can access any route directly
- ExamPage has its own internal route guard logic
- No onboarding completion checks
- Profile check only gates the app behind LoginPage

### 7. State Management

**Store:** `src/utils/store.js`
- State stored in localStorage key `deutsch_klinik_state_{profile_name}`
- Uses merge-based persistence
- Has `placementResult` field but NO onboarding fields
- Has `currentLevel` field defaulting to 'A1'

### 8. Study Goal Tracker

**Component:** `src/components/StudyGoalTracker.jsx`
- Uses separate localStorage key `deutsch_klinik_study_goal`
- Has its own UI embedded in Dashboard
- Not part of onboarding flow
- Fields: targetLevel, dailyMinutes, planType

### 9. Missing Features (Phase 9 Target)

- [ ] No onboarding flow between login and dashboard
- [ ] No initial goal/level selection before entering the app
- [ ] No route protection based on onboarding status
- [ ] Placements test has only 11 questions (need 30)
- [ ] No dedicated GoalSetup page
- [ ] Dashboard lacks target level / onboarding info display
- [ ] Loading and error states are minimal

---

## Target Flow (After Phase 9)

```
User visits app
  -> LoginPage (enter name)
  -> Check onboardingComplete:
       false -> /onboarding (choose placement, pick level, or start A1)
        true -> proceed to routed content
  -> Onboarding choices:
       1. Take placement test -> /placement-test (30 questions)
       2. I know my level -> level picker -> /goal-setup
       3. Start from A1 -> /goal-setup (A1->C1 defaults)
  -> PlacementTest completes -> redirect to /goal-setup
  -> GoalSetupPage:
       - Shows placed/determined level
       - Target level selector
       - Daily minutes / days per week
       - Estimated completion date
       - "Start Learning" -> onboardingComplete=true -> /dashboard
  -> Dashboard:
       - Shows current level, target level, finish date at top
       - All existing functionality preserved
```

## Route Protection Rules

```
IF no profile name          -> LoginPage
IF profile exists AND
   onboardingComplete=false  -> redirect to /onboarding
   (allow: /onboarding, /placement-test, /goal-setup)
IF profile exists AND
   onboardingComplete=true   -> allow everything
```
