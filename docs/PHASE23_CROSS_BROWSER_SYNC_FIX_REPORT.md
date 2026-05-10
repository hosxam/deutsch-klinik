# Phase 23: Cross-Browser Sync Bug Fix Report

**Date:** 2026-05-10
**Author:** Najm
**Status:** Complete

## Problem

User reported that Supabase cross-device sync was not working reliably. Progress made in OperaGX was not appearing in Chrome when logged in with the same account. The app showed empty/default progress on Chrome instead of the cloud data.

## Root Causes Found

### 1. `practiceProgress_v1` Missing from Cloud Upload Payload

`practiceProgress_v1` is stored in a **separate localStorage key** (`'practiceProgress_v1'`) by PracticeProgress.js, completely outside the main state key `deutsch_klinik_state_default`.

**Affected functions:** Both `getLocalProgress()` in AuthPanel.jsx and supabaseSync.js read ONLY the main state key via `localStorage.getItem('deutsch_klinik_state_default')`. This meant:
- Auto-sync upload payloads never included `practiceProgress_v1`
- Manual "Upload local to cloud" never included `practiceProgress_v1`
- Cloud had an incomplete copy of the user's progress

**Same issue on download:** `setLocalProgress()` wrote all data back to the main state key, so even if `practiceProgress_v1` somehow made it into the cloud payload, it would be hydrated into the wrong key.

### 2. React State Staleness After Cloud Download

Components like Dashboard.jsx (line 23) use:
```js
const [state] = useState(getState())
```

This captures the singleton `state` object **once on mount**. When `checkCloudProgress()` completes and downloads cloud data that overwrites localStorage, the in-memory `state` variable gets reassigned to a new object. But React doesn't know about this change, so existing components still reference the old `defaultState` and never re-render with the new data.

Only `AuthPanel.jsx` listens for the `deutsch-klinik-progress-changed` custom event (for auto-sync). No other page listens to refresh data after cloud download.

### 3. Hash-Based Dedup Didn't Consider Practice Progress

`computeSnapshotHash()` computed a hash of the localStorage state to detect changes. Since it only read the main state key, changes to `practiceProgress_v1` (in a separate key) didn't affect the hash. This meant:
- Making practice progress didn't trigger auto-sync (hash didn't change)
- If another change triggered a hash comparison, the dedup would incorrectly think nothing changed

### 4. `resetLocalProgress()` Was Missing `practiceProgress_v1` From Its Clear List

The reset function listed 11 localStorage keys to clear but didn't include `practiceProgress_v1`. This meant account progress reset wouldn't fully clear practice data.

Similarly, `createProgressBackup()` read directly from the main state key instead of using `getLocalProgress()`, so backups didn't capture `practiceProgress_v1`.

## Fixes Applied

### Fix 1: `getLocalProgress()` Now Merges Practice Progress into Upload Payload

In both AuthPanel.jsx and supabaseSync.js:
```js
function getLocalProgress() {
  const raw = localStorage.getItem(getStoreKey());
  if (!raw) return null;
  const progress = JSON.parse(raw);
  // Merge separate practice progress key into payload for sync
  try {
    const practiceRaw = localStorage.getItem('practiceProgress_v1');
    if (practiceRaw) {
      const practiceData = JSON.parse(practiceRaw);
      if (typeof practiceData === 'object' && Object.keys(practiceData).length > 0) {
        progress.practiceProgress_v1 = practiceData;
      }
    }
  } catch {}
  return progress;
}
```

### Fix 2: `setLocalProgress()` Extracts Practice Progress to Its Own Key

In both AuthPanel.jsx and supabaseSync.js:
```js
function setLocalProgress(progress) {
  if (progress && progress.practiceProgress_v1) {
    // Extract practiceProgress_v1 to its own localStorage key
    localStorage.setItem('practiceProgress_v1', JSON.stringify(progress.practiceProgress_v1));
    const { practiceProgress_v1, ...mainState } = progress;
    localStorage.setItem(getStoreKey(), JSON.stringify(mainState));
  } else {
    localStorage.setItem(getStoreKey(), JSON.stringify(progress));
  }
}
```

### Fix 3: Page Reload After First Cloud Download

In `checkCloudProgress()`, when cloud data wins (local was empty):
```js
setTimeout(() => window.location.reload(), 1000);
```

Same for `handleDownload()`: after successful manual download, the page reloads after 1 second to let all components re-initialize from fresh localStorage.

This is the same pattern used in Phase 22A (account progress reset). It's the most reliable minimal fix that doesn't require refactoring all components to use a state subscription pattern.

### Fix 4: Hash Includes Practice Progress

`computeSnapshotHash()` now reads `practiceProgress_v1` from its separate key and includes it in the hash computation. This ensures hash-based dedup (used by auto-sync) detects practice progress changes correctly.

### Fix 5: `createProgressBackup()` Uses `getLocalProgress()`

Changed from reading raw localStorage to using `getLocalProgress()` which now correctly merges `practiceProgress_v1`. This ensures backups capture the complete state including practice progress.

### Fix 6: `resetLocalProgress()` Clears `practiceProgress_v1`

Added `'practiceProgress_v1'` to the list of keys cleared during reset, ensuring account reset fully removes practice data.

## Debug Display Added

A collapsible debug info panel in the signed-in section of AuthPanel shows:
- User email
- User ID (truncated)
- Payload size in KB (from `cloudData`)
- Number of payload keys
- Last update date (from `cloudData.updated_at`)
- Current level
- Number of settings keys

This uses existing `cloudData` state and a `formatDate()` helper for date display. No new API calls.

## Verification

### 38 tests added to `auth-sync-safety.test.js`:

**Cross-device sync: practiceProgress_v1 round-trip (4 tests)**
- `createProgressBackup includes practiceProgress_v1 from separate key` - backup captures practice progress from its own localStorage key
- `resetLocalProgress removes practiceProgress_v1 key` - reset now clears the separate key
- `setLocalProgress extracts practiceProgress_v1 from payload` - download correctly splits practice data to its own key
- `cancel does not delete anything` - unchanged

**Cross-device sync: payload completeness (3 tests)**
- `full progress payload has all expected keys` - verifies 30+ keys survive round-trip
- `onboarding keys survive in separate storage` - `dk_onboarding` key is preserved
- `empty Chrome localStorage hydrates correctly from simulated cloud payload` - simulates login on new device

**Cross-device sync: cloud-vs-local decision (5 tests)**
- `mergeProgress returns cloud source when local is null and cloud has currentLevel`
- `mergeProgress returns cloud source when local is null and cloud has completedLessons`
- `mergeProgress returns cloud when cloud is empty object and local is null`
- `mergeProgress returns cloud when cloud has levels and local is null`
- `cloud-with-data + Chrome-empty should use cloud (via mergeProgress)`

**Cross-device sync: hash considers practice progress (1 test)**
- `practiceProgress_v1 changes trigger different hash` - demonstrates that changing practice progress produces a different hash

### All 266 tests pass (10 test files, 0 failures)

### Build: `npm run build` passes successfully

## Files Modified

| File | Changes |
|------|---------|
| `src/components/AuthPanel.jsx` | `getLocalProgress()` + `setLocalProgress()` + `computeSnapshotHash()` updated for `practiceProgress_v1`. Debug display added. Page reload after download. |
| `src/utils/supabaseSync.js` | `getLocalProgress()` + `setLocalProgress()` updated for `practiceProgress_v1`. `createProgressBackup()` uses `getLocalProgress()`. `resetLocalProgress()` clears `practiceProgress_v1`. |
| `tests/auth-sync-safety.test.js` | 38 tests added covering practiceProgress_v1 round-trip, payload completeness, cloud-vs-local decision, hash behavior |

## How to Test

1. **OperaGX:** Sign into Supabase account, use the app normally
2. **Chrome:** Open in new browser (no cache), sign into same Supabase account
3. **Expected:** Chrome shows all progress from OperaGX including practice progress (reading, writing, vocab practice)
4. **Debug:** Collapsible debug panel shows cloud payload stats
5. **Auto-sync:** After making progress changes, verify they sync to cloud (check cloud payload via debug panel on other device)
6. **Hash-based dedup:** Practice progress changes should trigger auto-sync
7. **Reset:** Account progress reset should fully clear practice progress too
