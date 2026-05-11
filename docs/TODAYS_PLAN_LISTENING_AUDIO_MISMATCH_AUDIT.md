# Today's Plan Listening Audio Mismatch Audit

## Root Cause Summary

The listening section in Today's Plan (DailyMissionPage) displays the correct
transcript and questions (from `listeningItem` computed by `getNextListening(lvl)`)
but the **TTS audio reads from a different item** due to an **index-based lookup bug**
in `hLrnTTS`.

## The Bug: hLrnTTS Uses State Index Instead of Selected Item

### What hLrnTTS does (lines 923-934):

```js
const hLrnTTS = () => {
  if (!ttsAvailable) return;
  const items = listeningDataRef.current || [];
  const ni = state.levels?.[lvl]?.listening?.length || 0;
  const item = items[ni];
  if (!item || !item.script) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(item.script);
  utter.lang = 'de-DE';
  // ...
};
```

**The problem:**

1. `state.levels[lvl]?.listening?.length` is used as a **raw array index** into
   `listeningDataRef.current`.

2. This assumes that `listeningData[lvl]` items are indexed by how many listening
   results exist in the store. This is completely unrelated to how `getNextListening`
   selects an item.

3. `getNextListening()` uses complex selection logic:
   - Completeness filtering (listeningCompleted[], practiceProgress)
   - Curriculum unlock checks
   - Topic-grouped preference
   - Difficulty sorting
   - Revisit logic (due incorrect items, old correct items)

4. The selected item from `getNextListening()` may be at array index 5, but
   `state.levels[lvl].listening.length` could be 0 if no results exist yet, or
   some other number. The TTS reads a completely different item.

5. After `hLrnA` completes a listening session, `setLevelProgress(lvl, 'listening', [...])`
   updates `state.levels[lvl].listening` to include `item.id`. On the next render,
   `state.levels[lvl].listening.length` changes, which changes the TTS index for
   the next visit.

## Why Listening Practice Works Correctly

ListeningPage (`src/pages/ListeningPage.jsx`) works because:

1. It receives `levelId` from route params and loads exercises via
   `useMemo(() => listeningData[levelId] || [], [levelId])`.

2. Navigation is by **explicit index** via exercise selector buttons in a scrollable
   bar, not by state length.

3. Audio is played from `ex.audio` resolved by `resolveAudioPath(ex.audio)` where
   `ex` is the explicit currently-selected exercise from `exercises[currentEx]`.

4. `currentEx` is managed by `useState(0)` and `goToExercise(idx)` functions.

5. The TTS fallback (`speak()`) also uses `ex.script` from the same explicit
   selection.

6. **Cache keys** (`buildAudioCacheKey`) include:
   - `levelId`
   - `ex.id`
   - Script hash
   - Voice/speed options

There is never a disconnect between audio, transcript, and questions in
ListeningPage because everything derives from the same `ex` object.

## How DailyMissionPage Selects the Listening Item

1. **At render time** (line 1601):
   ```js
   const listeningItem = cm.type === 'listening' ? getNextListening(lvl) : null;
   ```
   This runs on every render.

2. **getNextListening(lvl)** (starts around line 1360):
   a. Builds `completed` set from `state.listeningCompleted[lvl]`
   b. Builds `ppCompleted` set from practiceProgress listening entries with
      status 'completed_correct' or 'mastered'
   c. Builds `ppNotDue` set from practiceProgress listening entries that are
      'completed_incorrect' and still in cooldown
   d. Filters `listeningData`:
      - Excludes items in `completed`, `ppCompleted`, `ppNotDue`
      - Applies curriculum unlock filter if available
   e. Topic-grouped: prefers items matching today's lesson topics
   f. Sorts by difficulty (script length + questions * 50)
   g. Revisit logic (if no items found):
      - Checks practiceProgress for due incorrect items
      - Checks for old correct items (14+ days old)
   h. Returns `items[0] || null`

3. **The render** then uses `listeningItem` for:
   - Title: `{listeningItem.title}`
   - Script/transcript: `{listeningItem.script}`
   - Questions: `listeningItem.questions`
   - Difficulty: `getDifficulty(listeningItem)`

4. **hLrnA** uses the render-computed `listeningItem` (correct):
   ```js
   const item = listeningItem; // render-computed
   ```

5. **BUT hLrnTTS** (TTS/audio) does NOT use `listeningItem`:
   ```js
   const items = listeningDataRef.current || [];
   const ni = state.levels?.[lvl]?.listening?.length || 0;
   const item = items[ni]; // WRONG: unrelated index
   ```

## What Object/ID is Used for Audio

- **For TTS:** `hLrnTTS` uses `items[ni]` where `ni = state.levels[lvl].listening.length`.
  This is a different item than `listeningItem`.

- **There is no audio file playback** in Today's Plan listening. The component only
  supports TTS via `hLrnTTS`. There is no button for playing audio files (unlike
  ListeningPage which has `Play Audio` button for `ex.audio`).

- The listening section in Today's Plan is purely TTS-based: "Read Script Aloud (TTS)".

## Cache Key Analysis

- **Today's Plan has NO cache key** for listening audio. There is no
  `buildAudioCacheKey` call, no cache key reference, and no cache/storage
  key management in the listening section.

- **ListeningPage uses `buildAudioCacheKey`** from `audioGuard.js`:
  ```
  listening-audio:${levelId}:${ex.id}:${scriptHash}
  ```
  This includes level, item ID, and script hash, making it unique per item.

## Summary of All Issues Found

| Issue | Description |
|-------|-------------|
| **BROKEN** hLrnTTS uses `state.levels[lvl].listening.length` as array index | Index has no relationship to the selected item. TTS reads wrong script. |
| **MISSING** Single source of truth | `listeningItem` is correct for render/transcript/questions but TTS doesn't use it. |
| **MISSING** Audio cache key | No cache tracking at all. No guard against stale audio. |
| **MISSING** Runtime mismatch guard | No verification that TTS text matches displayed item. |
| **MISSING** Shared listening payload helper | No common helper between ListeningPage and DailyMissionPage. |
| **OK** Transcript display | Uses correct `listeningItem.script`. |
| **OK** Questions display | Uses correct `listeningItem.questions`. |
| **OK** Answer checking (hLrnA) | Uses render-computed `listeningItem` (and has a comment warning about this). |
| **BROKEN** TTS reads wrong | Uses index-based lookup unrelated to selected item. |

## Data Flow Comparison

### How ListeningPage Works (Correct):

```
URL params → levelId → listeningData[levelId]
  → exercises = useMemo(...)
  → currentEx (useState, managed by button clicks)
  → ex = exercises[currentEx]
  → All derive from ex:
    ex.title, ex.script, ex.questions, ex.audio, ex.id
  → cache key = buildAudioCacheKey(levelId, ex, options)
```

### How DailyMissionPage Currently Works (Buggy):

```
Render:
  → listeningItem = getNextListening(lvl)
  → display: listeningItem.title, listeningItem.script, listeningItem.questions ✅

TTS handler (hLrnTTS):
  → index = state.levels[lvl].listening.length ❌ (unrelated)
  → item = listeningDataRef.current[index] ❌ (different item)
  → reads item.script ❌ (wrong script)

No cache key ❌
No mismatch guard ❌
```

## Files to Fix

1. **src/pages/DailyMissionPage.jsx** - Fix `hLrnTTS` to use `listeningItem`,
   add audio cache key, add mismatch guard, reuse shared helper.

2. **src/utils/audioGuard.js** - Add or expose `getListeningExercisePayload(item)`
   shared helper usable by both ListeningPage and DailyMissionPage.

3. **Tests needed** - New test file for listening item consistency.

No changes needed:
- src/pages/ListeningPage.jsx - Already correct.
- src/utils/dataLoaders.js - Already correct.
- src/utils/store.js - Already correct.
- src/utils/practiceProgress.js - Already correct.

## Next Steps

1. Fix `hLrnTTS` to use `listeningItem` instead of index-based lookup.
2. Add `getListeningExercisePayload` helper to `audioGuard.js`.
3. Add cache key tracking to Today's Plan TTS.
4. Add runtime mismatch guard before playing audio.
5. Add tests.
6. Run checks (build, lint, tests).
7. Commit and deploy.
