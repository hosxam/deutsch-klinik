# Phase 22A: Account Progress Reset / Clean Start

## Summary

Added a "Reset cloud progress" feature to AuthPanel, allowing signed-in users to clear their learning progress while keeping their account intact. Local-only users get "Reset local progress" instead.

## What Changed

### New Fields / Functions in `supabaseSync.js`

- **`createProgressBackup(label)`** - Creates a `dk_reset_backup` localStorage snapshot of progress + settings before any destructive operation. Stores label, timestamp, progress data, and settings.
- **`exportBackupAsJson()`** - Returns the backup as a JSON string for manual export.
- **`resetCloudProgress(supabaseClient)`** - Upserts a clean default payload to `user_progress` for the current authenticated user. Creates backup first. Does not delete account or affect other tables.
- **`resetLocalProgress()`** - Clears all local state keys (`deutsch_klinik_state_default`, `study_goal`, `vocab_filters`, `dk_onboarding`, `sync_meta`, etc.). Creates backup first.

### AuthPanel.jsx

- **New state**: `showProgressReset`, `resetConfirmText`, `resetInProgress`, `resetDone`
- **`handleResetCloud()`** - Called when signed-in user confirms reset. Backs up local, calls `resetCloudProgress()`, then `resetLocalProgress()`, clears cloud data from component state, and reloads the page after 1.5s.
- **`handleResetLocal()`** - Called when local-only user confirms reset. Calls `resetLocalProgress()`, clears state, reloads.
- **UI (signed-in section)**: Added "Danger Zone" section below SyncHistory. Shows "Reset cloud progress" button. On click, shows confirmation panel with explanation, existing backup info, type-RESET-to-confirm input, and Confirm/Cancel buttons.
- **UI (local-only section)**: Same pattern but "Reset local progress". Local-only reset also uses the same `showProgressReset`/`resetDone` flow but calls `handleResetLocal`.
- **Reset completed state**: Green success banner with dismiss button. Page auto-reloads after 1.5s to re-initialize store from default state.

### Tests (`auth-sync-safety.test.js`)

6 new tests in `describe('Progress reset: local only')`:

| Test | What it verifies |
|------|-----------------|
| `creates a backup before reset` | `createProgressBackup()` stores label, timestamp, and progress |
| `exportBackupAsJson returns valid JSON string` | Exported JSON parses correctly with expected fields |
| `resetLocalProgress clears all state keys` | After reset, all localStorage keys are null |
| `reset creates backup snapshot before clearing` | `dk_reset_backup` entry exists with correct label |
| `reset after empty state still creates backup` | Graceful when localStorage is empty |
| `cancel does not delete anything` | Original data untouched when cancel occurs |

Total: 26 tests in `auth-sync-safety.test.js`, 254 total across all 10 test files.

## Reset Behavior

### Cloud Reset (signed-in user)
1. User clicks "Reset cloud progress" (Danger Zone)
2. Confirmation panel slides open with explanation and RESET confirmation input
3. User types "RESET" and clicks "Confirm Reset"
4. `createProgressBackup('cloud-reset')` saves backup to localStorage
5. `resetCloudProgress(supabase)` upserts clean default payload to `user_progress`
6. `resetLocalProgress()` clears all local state
7. Cloud state cleared from component, success banner shown
8. Page reloads after 1.5s to re-initialize from scratch

### Local Reset (logged-out / Supabase disabled)
1. User clicks "Reset local progress" (Danger Zone)
2. Same confirmation flow
3. `resetLocalProgress()` clears all local keys
4. Backup stored as `dk_reset_backup` with label `'local-reset'`
5. Page reloads after 1.5s

### What IS preserved
- Login: user account stays intact, user remains signed in
- Curriculum data: grammar.json, germanLessons.json, etc. untouched
- Other users: only current user's data is affected
- Backup: `dk_reset_backup` in localStorage can be used to manually restore

### What is DELETED
- `user_progress` row in Supabase (overwritten with clean defaults)
- localStorage keys: `deutsch_klinik_state_default`, `deutsch_klinik_study_goal`, `deutsch_klinik_vocab_filters`, `deutsch_klinik_dashboard_collapsed`, `dk_onboarding`, `dk_daily_mission_completed`, `dk_sync_meta`, `deutsch_klinik_sync_meta`, `dk_active_profile`, `dk_sync_backup`, `dk_cloud_snapshot`

## Files Changed

| File | Change |
|------|--------|
| `src/utils/supabaseSync.js` | Added `createProgressBackup()`, `exportBackupAsJson()`, `resetCloudProgress()`, `resetLocalProgress()` |
| `src/components/AuthPanel.jsx` | Added reset state vars, handlers (`handleResetCloud`, `handleResetLocal`), UI (Danger Zone, confirmation dialog, success banner) in both signed-in and local-only sections |
| `tests/auth-sync-safety.test.js` | 6 new tests in "Progress reset: local only" describe block |
| `docs/PHASE22A_ACCOUNT_RESET_FINAL_REPORT.md` | This file |

## Build & Test Results

- `npm run build` — ✓ built in 1.04s
- `npx vitest run` — 254 passed (10 files), 834ms

## Risks

Confirmation will trigger once "RESET" is typed, and page reload automatically happens. A fast double-click after confirm could cause issues, but the `resetInProgress` guard prevents re-entry.

## Commit

- Branch: `vocab-import-pipeline`
- Message: `Phase 22A: add account progress reset`

## Deploy Safety

Safe to deploy. No user data is changed without explicit RESET confirmation. RLS policies protect against other-user access. Account is not deleted. Curriculum data is read-only.
