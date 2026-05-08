# Phase 16: Dashboard, Practice, Flashcards & Speaking UX

## Summary

Simplified the dashboard, fixed routing bugs, added a Practice Hub page, updated speaking labels, and cleaned up the onboarding flow. All 37 Playwright tests pass.

## Changes Made

### 1. Dashboard Rewrite (src/pages/Dashboard.jsx)
**Before:** 1,800+ lines. Overcrowded with Resume Last Activity, Recent Sessions, Quick Actions, Next Up, Exam Progress (targetLevel based), Weak Areas, Placement Test button, full export/import dialog, settings export/import, expandable card UI, multiple dead components.

**After:** ~300 lines. Clean, focused dashboard with:
- **Current Level Overview** — lessons completed/total, grammar/vocab/reading/listening/writing/speaking progress, using `getCurrentStudyLevel()`
- **Study Goal Tracker** — kept as-is
- **Start Today's Session** — routes to `/level/{currentLevel}/daily`
- **Recommended Practice** — routes to `/mistake-notebook` if mistakes exist, else `/daily`
- **Mistake Review** — shows count, links to mistake notebook
- **Flashcards Due** — shows due count, links to flashcards
- **Study Streak** — compact card with number + 7-day activity row
- **Account Sync** — hides sign-in when no Supabase env vars

### 2. Practice Hub (new page + route)
**New file:** `src/pages/PracticeHubPage.jsx`
- Grid of 9 practice cards: Recommended, Vocabulary, Grammar, Reading, Listening, Writing, Speaking, Flashcards, Mistake Review
- Uses `getCurrentStudyLevel()` for level-aware links
- Routes to `/practice` in App.jsx

### 3. Nav Fix (src/components/Layout.jsx)
- Changed "Practice" nav from `/level/{currentLevel}/daily` → `/practice`
- Now opens the Practice Hub instead of directly going to daily mission

### 4. Store Helpers Added (src/utils/store.js)
- `getCurrentStudyLevel()` — returns startLevel > currentLevel > A1 fallback
- `getTargetLevel()` — returns targetLevel or C1 fallback

### 5. Onboarding Cleanup (src/pages/OnboardingPage.jsx)
- Removed "Take a placement test" FeatureCard from primary onboarding flow
- Kept "I know my level" and "Start from A1" as the two paths
- PlacementTest component preserved for direct navigation

### 6. Speaking Labels (src/pages/SpeakingPage.jsx)
- "Start Recording" → "Start transcription"
- "Stop Recording" → "Stop transcription"
- "Recording..." → "Transcribing..."
- "Record Your Answer (Local Only)" → "Transcribe Your Answer"
- "Audio stays in your browser and is not sent to AI." → "Your audio stays in your browser."
- Kept Web Speech API labels (Start/Stop Speech Recognition) unchanged

### 7. LevelPage Weak Areas (src/pages/LevelPage.jsx)
- Added weak areas section filtered by level
- Added exam readiness progress display

### 8. Account Sync (src/pages/Dashboard.jsx)
- Checks `import.meta.env.VITE_SUPABASE_URL`
- If missing: shows "Cloud sync is not configured. Progress is saved on this device."
- If present: shows AuthPanel component + account settings link

## Routing Bugs Fixed

| Bug | Status |
|-----|--------|
| Continue Lessons sent A1 user to B2 | Fixed — uses getCurrentStudyLevel() |
| Recommended Practice opened 411 grammar bank | Fixed — scoped to current level |
| Practice nav opened daily mission directly | Fixed — now opens Practice Hub |
| Placement test prominent in onboarding | Fixed — removed from primary flow |

## Test Results

| Test File | Results |
|-----------|---------|
| production-smoke.spec.cjs | 9/9 passed |
| onboarding-smoke.spec.cjs | 8/8 passed |
| fsp-smoke.spec.cjs | 7/7 passed |
| auth-smoke.spec.cjs | 4/4 passed |
| performance-smoke.spec.cjs | 9/9 passed |
| **Total** | **37/37 passed** |

## Limitations
- Flashcard SM-2 scheduling improvements were deferred (overlaps with curriculum-level logic)
- Placement test component kept but hidden — accessible at `/placement-test` if user knows the route
- Dashboard no longer shows cross-level progress (focused on current level only)
- Practice Hub does not add new curriculum content — only routes to existing pages

## Commit
- Hash: `pending`
- Message: `Phase 16: simplify dashboard practice flashcards and speaking UX`
- Branch: `vocab-import-pipeline`
