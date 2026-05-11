# deutsch-klinik-supabase

Supabase integration, cloud sync, and cross-device safety for deutsch-klinik.

## When to Use

Use this skill when:
- Modifying auth, sync, or storage code
- Debugging progress loss between devices
- Investigating data overwrite or merge bugs
- Checking Supabase schema or RLS policies
- Adding new sync-able data fields
- Diagnosing "Failed to load state" errors

## Files to Inspect

- `src/components/AuthPanel.jsx` — login/signup UI, session management, provider setup
- `src/utils/supabaseClient.js` — Supabase client initialization
- `src/utils/supabaseSync.js` — state sync to/from Supabase, save/load/merge logic
- `src/utils/progressStorage.js` — storage adapter interface
- `src/utils/localStorageAdapter.js` — local-only storage (fallback)
- `src/utils/cloudStorageAdapter.js` — cloud storage via Supabase
- `src/utils/store.js` — main state management, load/save hooks, sync triggers
- `src/utils/practiceProgress.js` — individual practice item progress (versioned)
- `src/utils/audioGuard.js` — audio mismatch detection (logs idle mismatches)

## Required Checks

### 1. Auth Flow
- Login/signup works end-to-end
- Session persists across page reload
- Auth token refresh works
- Logout clears session properly
- No console/auth errors on login page

### 2. Sync Safety
- `supabaseSync.js` — check for `practiceProgress_v1` references (version migration)
- Verify no silent overwrite: cloud state should not overwrite local state without merge
- Check `loadState()` in store.js: fallback to localStorage when Supabase fails
- Verify `saveState()` does not crash on Supabase write failure
- Check RLS policies allow user-specific reads/writes only

### 3. Cross-Device
- Progress saved on device A appears on device B after sync
- Concurrent edits do not cause full data loss (merge strategy exists)
- Offline changes are queued and sync when online
- No stale cache served after sync

### 4. Error Handling
- Failed Supabase connection does not block app load (falls back to localStorage)
- Auth token expiry handled gracefully (redirect to login, not crash)
- 401/403 responses trigger session refresh, not silent data loss

## Commands to Run

```bash
cd deutsch-klinik
npm run build   # verify no import errors for supabase modules
npm run lint    # check unused imports or missing deps
npm test        # run supabase-sync.test.js specifically: npx vitest run tests/supabase-sync.test.js
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|------|
| "Failed to load state, resetting" | localStorage access in SSR/test env | Wrap localStorage in try/catch (already done in store.js) |
| Progress lost on second device | No merge strategy, last-write-wins overwrite | Implement field-level merge in supabaseSync.js |
| "Failed to save state" | localStorage quota exceeded or Supabase write fails | Already handled with try/catch |
| Auth loop redirect | Token refresh fails, invalid session | Check AuthPanel session validation |
| `practiceProgress_v1` undefined | Version migration incomplete | Check normalizeState in store.js handles both formats |
| Cross-device sync duplicates | No idempotency key on save | Add write dedup in supabaseSync.js |

## Final Report Format

```
## Supabase Audit

| Check | Status |
|-------|--------|
| Auth flow end-to-end | PASS/FAIL |
| Sync merge safety | PASS/FAIL/UNKNOWN |
| Offline fallback | PASS/FAIL |
| Error handling | PASS/FAIL |
| Unit tests pass | PASS/FAIL |

## Risks Found
- [list sync safety issues]

## Recommendations
- [fixes or improvements]
```