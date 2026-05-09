# Phase 20: Real Supabase Cloud Sync + C1 Ready Removal

**Date:** 2026-05-09
**Branch:** vocab-import-pipeline

## Summary

Implemented real-time Supabase cloud sync with no page-refresh gaps, auto-upload on first login, onboarding state merge into payload, and removal of the dead C1ReadinessPage.

## Changes Made

### Files Deleted
- **`src/pages/C1ReadinessPage.jsx`** — Dead file removed entirely

### Files Modified

| File | Change |
|------|--------|
| `src/utils/store.js` | Removed `saveReadinessScores()` and `getReadinessScores()` functions (only used by deleted C1ReadinessPage) |
| `src/components/AuthPanel.jsx` | Fixed "refresh page to apply" gap by calling `updateState()` after every sync action; added auto-upload on first login; merged onboarding separate key into payload |
| `src/pages/SettingsPage.jsx` | Fires `deutsch-klinik-progress-changed` custom event after saving goal settings |
| `src/utils/supabaseSync.js` | Merges the separate `dk_onboarding` localStorage key into the JSONB payload during `saveCloudProgress()` and `migrateLocalToCloud()` |

### Files Added
- **`tests/phase20-sync.test.js`** — 10 new tests for merge logic and C1 removal verification

---

## Auth Flow Summary

### Login (AuthPanel.jsx's `checkCloudProgress()`)
1. User logs in via Supabase Auth
2. App fetches cloud progress from `user_progress` table
3. **If cloud data exists**: downloads and calls `updateState()` immediately (no refresh needed)
4. **If no cloud data but local exists**: auto-uploads local progress on first login
5. The "Cloud progress loaded" message replaces the old "Refresh page to reload progress"

### Conflict Resolution
- `handleDownload()`: Downloads cloud payload, calls `updateState()` instantly
- `handleReplaceWithCloud()`: Replaces local with cloud, calls `updateState()` instantly
- `handleMerge()`: Runs `mergeProgress()` on both, calls `updateState()` instantly
- All "Refresh page to apply" messages removed

### Auto-Sync Hook
The AuthPanel has a `useEffect` that listens for `deutsch-klinik-progress-changed` custom events and auto-uploads after 3 seconds of debounce. SettingsPage fires this event on goal save.

### Onboarding State Handling
The `dk_onboarding` localStorage key stores a separate JSON object. Both `supabaseSync.js` and AuthPanel's upload functions merge it into the payload as `_onboarding` before uploading. During download, the `onboardingComplete`, `startLevel`, `targetLevel`, etc. fields are already in the main state and get synced naturally.

---

## Sync Model Summary

### Data Model
Single JSONB column (`payload`) approach in the `user_progress` table:

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID (PK) | Supabase Auth user ID |
| `current_level` | text | User's current CEFR level |
| `levels` | JSONB | Level-specific progress data |
| `payload` | JSONB | Full application state (`getState()` output) |
| `settings` | JSONB | User settings (daily minutes, target, etc.) |
| `profile` | text | Active profile name |
| `updated_at` | timestamptz | Last update timestamp |

### Merge Strategy (`mergeProgress()`)
- **Completed lessons**: Union of both sides
- **Flashcard SRS**: For each card, pick the one with higher `ease` factor; if equal, pick latest `due` date
- **Mistake notebook**: Union with deduplication by key
- **General experience points**: Take the max
- **Settings**: Cloud wins (latest save)

### Local Storage Fallback
When Supabase is not configured or user is offline, the app continues to read/write from localStorage as before. Sync is an enhancement, not a dependency.

---

## C1 Ready Removal

- **Deleted**: `src/pages/C1ReadinessPage.jsx`
- **Removed from store.js**: `saveReadinessScores()` and `getReadinessScores()` functions
- **C1 level data preserved**: All `src/data/levels/C1/*` files remain intact (lessons, grammar, vocabulary, reading, listening, writing, speaking, exams, curriculum map)
- **No routing changes**: C1 level continues to work normally through the existing `LevelPage` component

---

## Tests Added

**`tests/phase20-sync.test.js`** — 10 tests across 2 suites:

### mergeProgress improvements (7 tests)
1. Preserves completed lessons from both sides
2. Merges flashcard SRS with the latest ease
3. Merges flashcard SRS with the latest due date when ease is equal
4. Deduplicates mistakeNotebook
5. Handles null cloud payload gracefully
6. Handles corrupt/undefined cloud payload gracefully
7. Handles null local AND null cloud gracefully

### C1 readiness removal (3 tests)
1. C1ReadinessPage.jsx no longer exists (file was deleted)
2. saveReadinessScores/getReadinessScores no longer exist in store.js
3. C1 level routes/data still exist (curriculum NOT removed)

---

## Build / Lint / Test Results

| Check | Result |
|-------|--------|
| `npx vitest run` | ✅ **228 tests passed** across 9 test files |
| `npx eslint src/ --max-warnings 100` | ✅ **0 errors**, 63 warnings (all pre-existing) |
| `npm run build` | ✅ Build succeeded (1.45s) |

---

## Setup Steps for Live Supabase

To enable cloud sync in production:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level TEXT DEFAULT 'A1',
  levels JSONB DEFAULT '{}',
  payload JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  profile TEXT DEFAULT 'default',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own progress"
  ON user_progress
  FOR ALL
  USING (auth.uid() = user_id);
```

3. Set these Vite environment variables:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key

4. If already logged in somewhere else (existing `supabase_session` in localStorage), sync will start automatically on next login.

---

## Remaining Limitations

1. **No real-time subscriptions**: Sync is manual or event-triggered (debounce). There is no Supabase Realtime subscription for instantaneous multi-device sync. Users must re-login or trigger an action to refresh.

2. **Conflict resolution is last-write-wins for settings**: The merge strategy handles lesson progress, flashcards, and mistakes, but overall settings (daily minutes, target level) use the cloud version as truth.

3. **No conflict UI for concurrent edits**: If two devices edit simultaneously, the last upload wins. There's no merge conflict browser like Google Docs.

4. **Onboarding separate key**: The `dk_onboarding` key in localStorage is merged into the payload as `_onboarding` during upload, but it's not loaded back into its own key on download. This is sufficient because the main state already has all onboarding-critical fields (`onboardingComplete`, `startLevel`, `targetLevel`, `goalSetupComplete`).

5. **Profile-based state**: The state key is `deutsch_klinik_state_{profile}`. If the user switches profiles, they'd need separate sync entries. Currently only the active profile is synced.
