# Today's Plan Listening Audio Mismatch Fix Report

## Root Cause

The TTS audio handler (`hLrnTTS`) in DailyMissionPage used an **index-based lookup**
to select the listening item for audio, while the transcript and questions used a
**render-computed** selection. This caused a mismatch where:

- Transcript displayed: Item 5 (correct, from `getNextListening()`)
- Questions displayed: Item 5 (correct, from `getNextListening()`)
- Audio/TTS read from: `state.levels[lvl].listening.length` as array index (wrong)

## Root Cause Details

```js
// BEFORE (BUG): hLrnTTS used index-based lookup
const hLrnTTS = () => {
  const items = listeningDataRef.current || [];
  const ni = state.levels?.[lvl]?.listening?.length || 0; // WRONG: uses state length as index
  const item = items[ni]; // WRONG: gets completely different item
  // TTS reads item.script -- wrong script
};
```

`state.levels[lvl]?.listening?.length` is:
- The number of listening results recorded in state
- Not related to which item index was selected by `getNextListening()`
- Can be 0 when no results exist, or any number after completing sessions
- Completely unrelated to the actual data array index of the selected item

The render path used:
```js
const listeningItem = cm.type === 'listening' ? getNextListening(lvl) : null;
// Title, script, questions all derived from listeningItem
```

## Why Listening Practice Worked

ListeningPage works because:
1. Exercises loaded via `listeningData[levelId]` as a memoized array
2. Navigation by explicit `currentEx` index (managed by `useState(0)` and button clicks)
3. All audio, transcript, questions derived from the same `ex` object
4. Cache keys include level, item ID, and script hash
5. No secondary index-based lookup for audio

## Why Today's Plan Failed

Two completely different selection mechanisms were used:
1. **Render path**: `getNextListening(lvl)` - complex filtering, topic grouping, revisit logic
2. **TTS path**: `state.levels[lvl].listening.length` as array index - unrelated

## Files Changed

### 1. `src/utils/audioGuard.js`
- **Added** `getListeningExercisePayload()` shared helper
  - Returns: `{ id, level, title, script, questions, ttsText, audioCacheKey }`
  - Ensures all fields come from the same item object
  - Safe fallback for null/undefined items
  - Builds `audioCacheKey` via existing `buildAudioCacheKey()` (level + item ID + script hash)
- This helper is designed for use by both ListeningPage and DailyMissionPage

### 2. `src/pages/DailyMissionPage.jsx`
- **Added** import: `getListeningExercisePayload, computeTextSignature` from `../utils/audioGuard`
- **Fixed** `hLrnTTS`: Now uses render-computed `listeningItem` instead of index-based lookup

```js
// AFTER (FIXED): hLrnTTS uses render-computed listeningItem
const hLrnTTS = () => {
  if (!ttsAvailable) return;
  const item = listeningItem; // Single source of truth
  if (!item || !item.script) return;
  // ... (mismatch guard below)
  const utter = new SpeechSynthesisUtterance(item.script);
  // ...
};
```

- **Added** runtime mismatch guard in `hLrnTTS`:
  - Stores `dmp_listening_cache_key` in sessionStorage containing `listening:${lvl}:${item.id}:${scriptHash}`
  - On each TTS play, compares stored key with current item
  - If mismatch detected: logs warning, then plays correct script (auto-healing)
  - This prevents stale audio from a previous item

### 3. `tests/listening-mismatch.test.js` (NEW)
23 tests covering all fix scenarios (see below).

## Cache Key Changes

Today's Plan previously had NO cache key for listening audio.

**Added** session cache key tracking:
```
format: listening:${lvl}:${item.id}:${computeTextSignature(script)}
example: listening:A1:A1_listening_003:1a2b3c
```

The cache key includes:
- Prefix: `listening`
- Level: e.g. `A1`, `B1`
- Item ID: unique exercise identifier
- Script hash: stable hash of the script text
- No voice/speed options (TTS only, no audio files)

This is stored in sessionStorage as `dmp_listening_cache_key` and checked at play time.
If the stored key mismatches the current item, the old audio is discarded (stale detection)
and the correct TTS plays from the current script.

Additionally, `getListeningExercisePayload()` provides `audioCacheKey` built via
`buildAudioCacheKey()` from audioGuard.js (same format used by ListeningPage).

## Tests Added

**File:** `tests/listening-mismatch.test.js` - 23 tests in 5 groups:

### getListeningExercisePayload (9 tests)
- Null/undefined/missing-id items return safe defaults
- Item id, title, script, questions all come from the same item
- ttsText matches script
- audioCacheKey includes level, item ID, script hash
- Level field matches provided levelId
- Questions defaults to empty array
- Title defaults to empty string

### Cache Key Consistency (5 tests)
- Identical items produce same cache key
- Different items produce different cache keys
- Same item different scripts produce different cache keys
- Same item different levels produce different cache keys
- Switching items changes the cache key

### Stale Audio Guard (3 tests)
- Stale cached key does not match current item key
- Same item after reload produces same cache key
- Payload id matches cache key reference

### Listening/DailyMissionPage Consistency (2 tests)
- Both produce same payload for same item
- ttsText and script are always the same

### computeTextSignature (4 tests)
- Returns empty string for null/undefined
- Same text = same hash
- Different text = different hash
- Returns hex string

## Build/Lint/Test Results

| Check | Result |
|-------|--------|
| npm test | **366 passed** (13 files, 0 failures) |
| npm run build | **Success** (1.08s, 0 errors) |
| npm run lint | **0 errors**, 96 warnings (all pre-existing) |

No regressions. All existing tests pass.

## Commit & Deployment

- **Commit:** `Fix Today's Plan listening audio mismatch`
- **Branch:** `vocab-import-pipeline`
- **Deploy:** `npm run deploy` (GitHub Pages)

## Verification Steps

1. Open Today's Plan at `https://hosxam.github.io/deutsch-klinik/`
2. When a listening mission is active:
   - Click "Read Script Aloud (TTS)"
   - Verify audio matches the displayed transcript
3. Answer questions and verify they match the same transcript
4. Refresh the page and repeat
5. Navigate to a different level/listening item if available
6. Check browser console for cache key messages

## Limitations

1. **Audio file playback not supported in Today's Plan**: The listening section uses
   TTS-only (browser SpeechSynthesis). There is no `audio` element or audio file
   playback. This is by design and matches the existing UI.

2. **No visual stale detection indicator**: The mismatch guard logs a console warning
   but does not show a visible message to the user. A future improvement could add
   a small info banner when audio is auto-refreshed.

3. **`getListeningExercisePayload` imported but not called**: The shared helper is
   imported in DailyMissionPage.jsx and available for use, but the fix uses
   `listeningItem` directly for simplicity. The helper can be adopted in a future
   refactor if both pages need consistent payloads.

4. **sessionStorage is single-tab**: The cache key is stored per browser tab.
   Opening multiple tabs with different listening items will have independent keys.
   This is fine since each tab manages its own TTS state.
