# Phase 16 Audit: Dashboard, Practice, Flashcards & Speaking UX

## Current State (Pre-Phase 16)

### Dashboard.jsx (~1,965 lines)
- **Overcrowded** with Resume Last Activity, Recent Sessions, Quick Actions, Next Up, Exam Progress, Weak Areas, Placement Test buttons, export/import dialogs
- Contains ~15 helper components (DashStatCard, ActionButton, MiniPlanMetric, StudyPlanButton, ProgressBarCompact, ProgressBar, etc.)
- Heavy collapse/expand logic across 7 sections with localStorage persistence
- Full import/export/backup UI with confirmation dialogs (Progress, Settings, Full backup)
- Uses `state.currentLevel` for level references and `targetLevel` in multiple places
- Placement Test button directs to `/placement-test`
- Debug panel (dev-only)

### Layout.jsx
- "Practice" nav link routes to `/level/${getState().currentLevel || 'A1'}/daily`

### OnboardingPage.jsx
- Three paths: Placement Test, I Know My Level, Start from A1

### SpeakingPage.jsx
- Labels: "Start Recording", "Stop Recording", "Recording...", "Record Your Answer (Local Only)", "Audio stays in your browser..."

### LevelPage.jsx
- No weak areas or exam readiness sections

### store.js
- No `getCurrentStudyLevel()` or `getTargetLevel()` helper exports

### App.jsx
- No `/practice` route

## Key Issues
1. Dashboard is overwhelming with too many features
2. Layout nav skips practice hub entirely
3. Speaking labels are misleading
4. No centralized practice hub page
5. store.js needs helper functions for level resolution
6. Level page missing exam readiness context
