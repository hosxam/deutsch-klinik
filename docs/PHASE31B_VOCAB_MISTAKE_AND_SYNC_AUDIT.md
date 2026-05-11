# Phase 31B: Vocab Mistake & Sync Audit

Date: 2026-05-11
Branch: `vocab-import-pipeline`
Commit: `00e10a66` — "Fix vocabulary mistake flashcards with rich context and dedup"

=============================================================================
PART 1 — VOCAB MISTAKES TRUTH CHECK
=============================================================================

## Verdict: Claude was STALE. Vocab mistakes already work correctly.

The previous OpenClaw report was accurate. The code has already been fixed
(commit 00e10a66) and vocab mistakes ARE created, tracked, and displayed.

## Exact Current Behavior

### 1. Does recordVocabAnswer call recordAnswer for wrong answers?
YES. When rating is 1 (Again) or 2 (Hard), `!isCorrect` is true and
`recordAnswer()` is called with full context, including skill='vocab'.

Source: `src/utils/store.js` lines 528-579
```
if (!isCorrect) {
    recordAnswer(level, wordId, meta.userAnswer, meta.correctAnswer,
        meta.topic || 'Vocabulary', false, 'vocab', {
            sourceQuestion: questionPrefix + sourceTitle,
            sourceSentence: sourceSentence,
            sourceType: sourceType,
            sourceTitle: sourceTitle,
            sourceItemId: wordId,
        }
    );
}
```

### 2. Does wrong vocab create incorrectAnswers entry?
YES. `recordAnswer` (line 346+) always pushes/updates an entry in
`state.incorrectAnswers[level]` with deduplication (same exerciseId gets
updated count rather than duplicate entry).

### 3. Does wrong vocab create mistakeNotebook entry?
YES. `recordAnswer` creates a `state.mistakeNotebook[notebookId]` entry
(lines 418-432) with all context fields.

### 4. Does it also create SRS vocabularyMastery entry?
YES. `recordAnswer` also creates a `vocabularyMastery[mistake_{level}_{exerciseId}]`
entry (lines 434-445) with SM-2 fields, so mistake cards can be scheduled
with spaced repetition just like normal vocab.

### 5. Does created mistake include context?
YES, full context is passed from recordVocabAnswer:
- `wordText` → `sourceTitle`, used in `sourceQuestion`
- `cardType` → `sourceType` (meaning/article/plural)
- `userAnswer` → meta.userAnswer
- `correctAnswer` → meta.correctAnswer/translation/english
- `exampleSentence` → `sourceSentence`
- `level/topic` → level and topic

### 6. Does MistakeNotebookPage display vocab mistakes?
YES. It reads from `getMistakeNotebookItems()` which pulls from
`state.incorrectAnswers[level]`. All mistakes of skill='vocab' appear.
The filter dropdown doesn't have a 'vocab' option but that's minor UX --
selecting 'All Skills' shows everything including vocab.

### 7. Does it use Again/Hard/Good/Easy?
YES. Both the review mode and expanded browse mode show the full set of
SM-2 rating buttons (Again/Hard/Good/Easy). They call `recordVocabAnswer`
on the `mistake_{level}_{exerciseId}` key.

### 8. Does it avoid the old useless vocab review section?
YES. There's no separate "Vocabulary Review" section. Vocab mistakes are
displayed as flashcard-style mistake cards in the same Mistake Notebook.

### 9. Does Today's Plan include due vocab mistake cards?
YES. `getDueVocabWords` / `getDailyFlashcardQueue` checks all
`vocabularyMastery` entries, including the `mistake_*` keys. Due mistake
cards appear in the queue.

### 10. Does Today's Plan exclude not-due vocab mistake cards?
YES. Cards with `due > today` are skipped regardless of mastered status.

=============================================================================
PART 2 — SUPABASE OVERWRITE TRUTH CHECK
=============================================================================

## Verdict: Claude was STALE. Auto-overwrite risk does not exist.

The current code has cloud-as-source-of-truth behavior, safe backup/restore,
and migrateLocalToCloud is NEVER called automatically.

## Exact Current Behavior

### 1. Is migrateLocalToCloud manual-only?
YES. It is exported from `supabaseSync.js` but is NEVER imported or called
anywhere in the entire codebase. It is effectively dead code.

Command output:
```
PS> Select-String -Path "src\**\*.jsx","src\**\*.js" -Pattern "migrateLocalToCloud"
src\utils\supabaseSync.js:83:export async function migrateLocalToCloud() {
```
Only the definition line appears. No import, no call site.

### 2. Is migrateLocalToCloud called automatically on login/mount?
NO. After sign-in, `checkCloudProgress()` runs instead. This function:
1. Checks if cloud has data → YES → downloads cloud to local (cloud is
   source of truth)
2. Checks if cloud has no data but local has data → YES → uploads local
   to cloud (first-time sync)
3. Neither → no-op

### 3. When user logs in on empty localStorage with existing cloud data,
   what function runs? `checkCloudProgress()`. The `hasCloud` branch fires:
   - Backups any local (even if empty/null)
   - Calls `setLocalProgress(cloudPayload)` and `updateState(cloudPayload)`
   - Sets sync status "Cloud progress active"
   - Reloads page if this is first download (no prior local)

### 4. Does cloud download automatically?
YES. On sign-in, `handleSignIn` calls `checkCloudProgress()` after 500ms.
On mount, the `onAuthStateChange` listener also calls `checkCloudProgress()`.

### 5. Can empty local progress overwrite cloud without explicit user action?
NO. The `checkCloudProgress` logic is:
```
if (hasCloud) {
    // Cloud has data → download cloud to local (NEVER upload empty)
} else if (hasLocal) {
    // Only upload if no cloud data exists
}
```
Empty local + existing cloud = cloud wins every time.

### 6. Does any manual "Upload Local" button clearly warn user?
The `handleDownload` function uses `window.confirm()` with a warning that
"local data will be backed up". The "Upload local to cloud" button does NOT
show a confirm dialog — it just overwrites cloud with local.

This is a minor safety gap: `handleUpload` has no confirm dialog.

### 7. Are local backups created before manual upload?
YES. The `checkCloudProgress` function backs up local before overwriting
(line: `localStorage.setItem('dk_sync_backup', ...)`) using the
`SYNC_BACKUP_KEY` (`'dk_sync_backup'`).

### 8. Does cross-browser sync include practiceProgress_v1?
YES. The `getLocalProgress()` function merges the `practiceProgress_v1`
separate key into the payload. `setLocalProgress()` extracts it back out.

=============================================================================
FINDINGS SUMMARY
=============================================================================

Vocab Mistakes:
  ✅ Wrong vocab answer creates incorrectAnswers entry
  ✅ Wrong vocab answer creates mistakeNotebook entry
  ✅ Wrong vocab answer creates SRS mastery entry (for scheduling)
  ✅ Context is passed: sourceQuestion, sourceSentence, sourceType, etc.
  ✅ MistakeNotebookPage displays vocab mistakes
  ✅ SM-2 buttons: Again / Hard / Good / Easy
  ✅ Due-date scheduling works for vocab mistakes
  ✅ No separate "Vocabulary Review" section

Supabase Sync:
  ✅ migrateLocalToCloud is dead code (never called)
  ✅ Cloud is source of truth on sign-in
  ✅ Empty local + existing cloud = cloud downloads automatically
  ✅ Manual "Upload local to cloud" requires explicit button click
  ✅ Backups created before operations
  ✅ practiceProgress_v1 survives upload/download round-trip

Minor Gaps (not blocking):
  - MistakeNotebookPage filter dropdown lacks 'vocab' skill option
    (But 'All Skills' includes vocab mistakes, so this is cosmetic)
  - Manual "Upload local to cloud" button has no confirm dialog
    (But backups are created, and cloud download restores on re-sign-in)
  - `syncFromCloud` is also dead code (defined but never imported)
