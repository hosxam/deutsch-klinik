# Phase 20: Supabase Sync Model

## Source of Truth

### When Logged In

- **Supabase** is the durable source of truth for all progress data.
- **localStorage** acts as a cache and offline fallback.
- Changes save locally first (immediate), then sync to the cloud (debounced 3 seconds after last change).
- On app load while logged in, cloud progress is auto-loaded and hydrated into localStorage.

### When Logged Out

- **localStorage** is the sole source of truth.
- No cloud operations are attempted.

## Sync Architecture

### Storage Layers

1. **store.js** - Writes all app state to `localStorage['deutsch_klinik_state_{profile}']`. Dispatches `deutsch-klinik-progress-changed` custom event on every save.

2. **AuthPanel useAutoSync** - Listens for progress-changed events. When signed in, debounces 3 seconds then upserts to `user_progress` table with full state as JSONB `payload` column.

3. **AuthPanel checkCloudProgress** - On login or page load, checks cloud for existing progress. If found and local is empty/fresh, auto-hydrates. If both exist, shows conflict resolution UI.

### Data Flow

```
Local change -> store.js -> localStorage + dispatch event
  -> useAutoSync (debounced 3s) -> supabase user_progress upsert
  -> on login: checkCloudProgress -> download payload -> localStorage
```

### Single JSONB Payload Approach

Rather than syncing 14 structured tables (which were created in Phase 11 but never populated by the app), this version uses a single `user_progress` table with a `payload` JSONB column containing the entire app state.

**Benefits:**
- Simple, atomic saves and loads
- No schema migration for new state keys
- Backward compatible with existing localStorage format
- Easy to debug (one row per user)

**Trade-off:** Higher bandwidth per sync (typically 10-50 KB). Acceptable for this app's usage pattern.

## Profile Namespace Isolation

Each localStorage key is profile-specific: `deutsch_klinik_state_hossam` or `deutsch_klinik_state_wife`.

The `user_progress` table's `profile` column stores the active profile name on upload. On download, the full payload includes the profile's state.

## Synchronized Data Categories

| Category | localStorage Key | Synced? | Notes |
|----------|-----------------|---------|-------|
| Full app state | `deutsch_klinik_state_{profile}` | Yes | As JSONB `payload` column |
| Study goal | `deutsch_klinik_study_goal` | Yes | As JSONB `settings` column |
| Vocab filters | `deutsch_klinik_vocab_filters` | No | Device preference, no value in syncing |
| Dashboard collapsed | `deutsch_klinik_dashboard_collapsed` | No | Device preference |
| Daily session | `deutsch_klinik_daily_session` | No | Session-bound, resets daily anyway |

Within the state payload, these keys are synced:
- `currentLevel`, `theme`, `streak`
- `levels` (per-level curriculum progress)
- `exams` (exam results)
- `writings`, `speakingRecordings`
- `flashcards` (SM-2 word-level state)
- `weakAreas`
- `placementResult`, `medicalUnlocked`
- `onboardingComplete`, `startLevel`, `targetLevel`, `dailyMinutes`, `daysPerWeek`, `targetDate`, `estimatedFinishDate`, `goalSetupComplete`
- `completedLessons`, `incorrectAnswers`, `repeatedMistakes`, `mistakeNotebook`
- `vocabularyMastery`, `grammarMastery`
- `listeningCompleted`, `readingCompleted`, `writingCompleted`, `speakingCompleted`
- `completedGrammarLessons`
- `readinessScores`, `topicWeakness`, `dailyStudyLog`, `studyLog`, `remediationQueue`
- `practiceProgress_v1`

## Merge Strategy

When both local and cloud progress exist:

1. **Keep local & upload**: Overwrites cloud with local data.
2. **Use cloud data**: Overwrites local with cloud data.
3. **Merge both**: Safely combines both datasets:
   - Completed lessons: union of both sets
   - Skill progress (vocab/grammar/flashcards): keep highest ease/most recent due
   - Mistakes: union, deduplicated by exercise ID
   - Practice progress: deep merge per level/category
   - Settings: newest `updatedAt` wins, or ask user

## Migration on First Login

If local progress exists and user signs in to a new account:

1. AuthPanel checks cloud for existing data.
2. If no cloud data found: shows "No cloud progress yet. Upload your local data?"
3. If cloud data found: shows conflict resolution (three buttons: Keep Local, Use Cloud, Merge Both).
4. Before any destructive action, a backup of local progress is saved to `localStorage['dk_sync_backup']`.

## Error Handling

- If Supabase is down or unreachable: local saves still work. Auto-sync silently fails (shows "Auto-sync failed" state). User can retry manually.
- If user is logged out: no sync is attempted. Local mode continues transparently.
- If Supabase env vars are missing: full no-config mode with clear message.
