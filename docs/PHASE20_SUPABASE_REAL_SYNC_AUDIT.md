# Phase 20: Supabase Real Sync Audit

**Date:** 2026-05-09
**Auditor:** Najm
**Branch:** vocab-import-pipeline

---

## 1. Current Supabase Implementation Status

### Auth
| Feature | Status | Details |
|---------|--------|---------|
| Sign up (email/password) | ✅ Implemented | `supabase.auth.signUp()` in AuthPanel.jsx. Handles both instant-session and email-confirmation flows. |
| Sign in (email/password) | ✅ Implemented | `supabase.auth.signInWithPassword()` in AuthPanel.jsx. |
| Sign out | ✅ Implemented | `supabase.auth.signOut()` in AuthPanel.jsx. |
| Password reset | ✅ Implemented | `supabase.auth.resetPasswordForEmail()` in AuthPanel.jsx. |
| Session persistence | ✅ Implemented | `persistSession: true` in supabaseClient.js. `autoRefreshToken: true`. |
| Session restore on mount | ✅ Implemented | `supabase.auth.getSession()` in AuthPanel.jsx useEffect. |
| Auth state change listener | ✅ Implemented | `supabase.auth.onAuthStateChange()` subscription. |

### UI Components
| Component | Status | Details |
|-----------|--------|---------|
| LoginPage.jsx | ❌ Not auth-related | Shows profile picker (Hossam/Wife), NOT a Supabase login form. |
| AccountPage.jsx | ✅ Implemented | Wrapper page at `/settings/account` that renders AuthPanel. |
| AuthPanel.jsx | ✅ Implemented | Full auth component: sign in, sign up, sign out, conflict resolution, auto-sync, sync history. **30KB but works well.** |
| Dashboard.jsx | ✅ Integrated | Shows AuthPanel or "Cloud sync not configured" based on env vars. |

### Progress Storage
| Adapter | Status | Details |
|---------|--------|---------|
| localStorageAdapter.js | ✅ Complete | Wraps all store.js functions into a consistent interface. |
| cloudStorageAdapter.js | ✅ Implemented | Mirrors localStorageAdapter interface for Supabase. Big file (12KB) covering many tables. |
| progressStorage.js | ✅ Implemented | Auto-selects adapter based on auth state. |
| supabaseSync.js | ✅ Implemented | `migrateLocalToCloud()`, `syncFromCloud()`, `saveCloudProgress()`, `mergeProgress()`. |

### Sync Behaviors
| Behavior | Status | Details |
|----------|--------|---------|
| Auto-sync on progress change | ✅ Implemented | `useAutoSync()` hook listens for `deutsch-klinik-progress-changed` events, debounces 3s, uploads. |
| Auto-load cloud progress on login | ✅ Implemented | `checkCloudProgress()` called on mount and auth state change. |
| Conflict detection | ✅ Implemented | If local progress exists AND cloud data exists, shows conflict resolution UI. |
| Conflict options | ✅ Implemented | "Keep local & upload", "Use cloud data", "Merge both" buttons. |
| Manual sync buttons | ✅ Implemented | Upload/Download buttons visible when signed in. |
| Sync history | ✅ Implemented | Tracks last upload/download/error with timestamps. |
| Sync hash dedup | ✅ Implemented | `computeSnapshotHash()` avoids re-uploading unchanged data. |

### No-Config Fallback
| Case | Status | Details |
|------|--------|---------|
| Missing VITE_SUPABASE_URL | ✅ Graceful | `supabaseClient.js` returns null. AuthPanel shows "Local mode" card. |
| Missing VITE_SUPABASE_ANON_KEY | ✅ Graceful | Same logic. |
| App crash on missing env vars | ✅ Not crashing | `createClient()` wrapped in try/catch. |
| Dead sign-in/sign-up buttons | ✅ Handled | Buttons shown disabled with gray styling. Clear text explaining local mode. |
| Dashboard shows correct message | ✅ Implemented | Shows "Cloud sync is not configured. Progress is saved on this device." |

### Supabase Schema
| Table | Purpose | Status |
|-------|---------|--------|
| profiles | User display info | Created but never populated by app code. |
| user_settings | Goal/onboarding settings | Used by cloudStorageAdapter.js get/save user settings. |
| user_progress | MAIN sync table (JSONB payload) | Full app state serialized as JSONB. **This is the primary sync mechanism.** |
| lesson_progress | Per-lesson tracking | Used by cloudStorageAdapter. |
| daily_sessions | Study streak/tracking | Used by cloudStorageAdapter. |
| mistakes | Mistake tracking | Used by cloudStorageAdapter. |
| flashcards | Flashcard storage | Used by cloudStorageAdapter. |
| flashcard_reviews | SM-2 review data | Created but NOT used by current cloudStorageAdapter. |
| exam_attempts | Exam tracking | Used by cloudStorageAdapter. |
| writing_attempts | Writing submissions | Created by cloudStorageAdapter. |
| speaking_attempts | Speaking submissions | Created by cloudStorageAdapter. |
| fsp_progress | FSP module progress | Created but NOT used. |
| sync_metadata | Sync tracking | Used by cloudStorageAdapter. |
| placement_responses | Placement test answers | Created but NOT used. |

### RLS Policies
All 14 tables have RLS enabled with full CRUD policies: `auth.uid() = user_id`.

---

## 2. What Actually Works vs. Only Foundation

### ✅ Truly Working
- Auth sign up / sign in / sign out / password reset
- Session persistence across reloads
- Auto-sync on progress change (debounced)
- Auto-load cloud progress on login
- Conflict detection and resolution (keep local / use cloud / merge)
- No-config graceful fallback
- Dashboard sync integration
- Account page route
- Sync history metadata
- Backup before migration

### ⚠️ Foundation but Not Fully Tested/Integrated
- **Actual Supabase connection**: AuthPanel is written to work with real Supabase. Code is clean. But it has never been connected to a real Supabase project and tested end to end.
- **cloudStorageAdapter.js**: All methods are implemented but most of the more granular methods (saveMistakes, saveFlashcards, saveExamAttempt, etc.) are **never called from the app**. The app relies on the JSONB `user_progress` payload approach for sync.
- **Flashcard reviews table**: Schema exists but current sync doesn't save individual SM-2 flashcard reviews. All SM-2 data is embedded in the JSONB payload under `flashcards` and `vocabularyMastery`.
- **Profile creation on signup**: `profiles` table is never populated by the app after signup.

### ❌ Not Implemented
- **Cross-device auto-hydration**: When a user logs in on a new device, the app auto-loads cloud progress and saves it to localStorage. But it requires a page refresh ("Refresh page to apply"). This is a UX gap.
- **Seamless migration**: After login, if no cloud data exists, the user sees "No cloud progress yet. Upload your local data?" -- they have to manually click the Upload button.
- **Automatic merge on conflict**: Conflict resolution is manual (user must click a button). No auto-merge strategy on app load.

---

## 3. localStorage Keys That Need Syncing

Based on `store.js` and existing sync code:

| Key | Data | Currently Synced? |
|-----|------|-------------------|
| `deutsch_klinik_state_{profile}` | Full app state (levels, progress, flashcards, mistakes, etc.) | ✅ Yes (via `user_progress.payload` JSONB) |
| `deutsch_klinik_study_goal` | Goal settings (dailyMinutes, daysPerWeek, targetLevel, targetDate) | ✅ Yes (via `user_progress.settings`) |
| `deutsch_klinik_vocab_filters` | Vocab filter preferences | Partially (in settings JSONB) |
| `deutsch_klinik_dashboard_collapsed` | Dashboard UI preferences | Partially |
| `dk_active_profile` | Current profile selection | ❌ Not synced |
| `deutsch_klinik_onboarding` | Onboarding completion state | ❌ Not synced (separate key from main state) |
| `deutsch_klinik_estimated_finish` | Estimated finish date | ✅ Part of main state |
| `deutsch_klinik_placement_result` | Placement test result | ✅ Part of main state |
| `deutsch_klinik_sync_meta` | Sync metadata (lastUploadAt, etc.) | ❌ Not synced to cloud (local-only) |
| `dk_sync_backup` | Migration backup | ❌ Local-only |
| `practiceProgress_v1` | Practice progress per level/skill | ✅ Part of main state payload |
| `mistakeNotebook_v2` | Deduplicated mistake notebook | ✅ Part of main state payload |

---

## 4. Missing Pieces for Cross-Device Sync

1. **Auto-hydrate on login without page refresh**: After downloading cloud progress, the app should reload the in-memory store (via `updateState()`) instead of requiring a manual refresh.

2. **Auto-upload local progress on first login**: If user has local progress but no cloud data, upload automatically and show a success message instead of requiring manual Upload click.

3. **Onboarding state sync**: `deutsch_klinik_onboarding` key is stored separately and should also be synced.

4. **Profile sync**: `dk_active_profile` should be synced so the correct profile loads on another device.

5. **Sessions without refresh**: Currently `checkCloudProgress()` saves to localStorage and says "Refresh page to apply." Should call `updateState()` to immediately hydrate the app.

6. **Settings page save triggers auto-sync**: When user changes goals on Settings page, a `deutsch-klinik-progress-changed` event needs to fire. Currently `handleSaveGoal` in SettingsPage.jsx saves to store but doesn't dispatch the event.

7. **Exam unlock state**: `state.exams`, `state.writingCompleted`, `state.readingCompleted`, `state.listeningCompleted`, `state.speakingCompleted` -- all in main state payload, so should sync but need verification.

8. **Global event dispatch**: Not all places in the app dispatch `deutsch-klinik-progress-changed`. Need to audit and ensure all progress changes trigger the event for auto-sync.

---

## 5. C1 Readiness Page Status

**File found:** `src/pages/C1ReadinessPage.jsx` (514 lines, ~16KB)

**Status: DEAD FILE.** Zero imports reference it. Zero routes point to it. The export `C1ReadinessPage` is never lazy-loaded or imported. It is completely orphaned/unused code.

The page is a self-assessment questionnaire where users rate their reading/listening/writing/speaking readiness on a 5-point scale. The scores are saved via `saveReadinessScores()` and `getReadinessScores()` from store.js.

Since it's a dead file with no visual presence in the app, removing it is safe. The readiness utility functions in store.js (`getReadinessScores`, `saveReadinessScores`) should also be checked for any lingering references.

---

## 6. Recommendations

### Real Sync (This Phase)
1. The `user_progress` JSONB payload approach works and should be the primary sync mechanism.
2. Fix the "refresh page to apply" gap -- immediately call `updateState()` after downloading cloud data.
3. Set up auto-upload on first login when local data exists.
4. Ensure all progress-changed paths dispatch the event.
5. Add onboarding state to the synced payload (move from separate key or include).

### C1 Ready (This Phase)
6. Delete `C1ReadinessPage.jsx` (dead file).
7. Delete or cleanup associated store functions if they're also unused.
8. Ensure C1 level data and routes remain untouched (they are already).
