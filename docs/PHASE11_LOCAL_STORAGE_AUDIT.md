# PHASE 11: localStorage & State Management Audit

> **Date:** 2026-05-08
> **Project:** Deutsch Klinik
> **Scope:** Comprehensive audit of all localStorage keys, state utilities, interaction patterns, and cloud migration readiness.

---

## 1. Files Using localStorage (by interaction count)

| Count | File | Role |
|-------|------|------|
| 20 | `src/pages/Dashboard.jsx` | Backup/restore, collapsed sections, session starts |
| 7 | `src/utils/store.js` | Core state manager (profile + main state) |
| 7 | `src/components/AuthPanel.jsx` | Supabase sync, import/export |
| 6 | `src/utils/onboardingState.js` | Dedicated onboarding key |
| 5 | `src/pages/VocabularyPage.jsx` | Vocab filters |
| 3 | `src/pages/DailyMissionPage.jsx` | Daily session |
| 3 | `src/components/StudyGoalTracker.jsx` | Study goal pref |
| 2 | `src/App.jsx` | Route guard (reads via store.js, not direct) |
| 2 | `src/pages/FSPExamPage.jsx` | FSP exam attempts |
| 2 | `src/components/DebugProgressPanel.jsx` | Debug reset (direct key access) |
| 2 | `src/pages/LessonDetailPage.jsx` | Lesson checklists |
| 2 | `src/pages/MedicalFSPHubPage.jsx` | FSP progress |
| 1 | `src/utils/curriculumProgress.js` | Read-only via store.js |

---

## 2. Complete localStorage Key Inventory

### 2.1 Profile / Identity

---

#### Key: `dk_active_profile`
- **What it stores:** Current active profile name
- **Schema:** `string | null`
- **Read from:** `store.js:9` (getActiveProfile), `App.jsx` (via getCurrentProfileName)
- **Written to:** `store.js:18` (switchProfile), `store.js:23` (signOutProfile removes)
- **User-specific?** Yes, identifies the user
- **Should sync to cloud?** Yes (determines which state to fetch)
- **Migration risk:** **Low**. Small string, straightforward.

---

#### Key: `deutsch_klinik_state_{profile}` (dynamic key, e.g. `deutsch_klinik_state_default`)
- **What it stores:** All user progress, settings, and learning data for a named profile
- **Schema:** See `defaultState` in `store.js` (massive object, ~80+ fields)
- **Read from:** `store.js:131` (loadState)
- **Written to:** `store.js:161` (saveState)
- **Also read by:** `AuthPanel.jsx:20` (backwards-compat fallback reads `deutsch_klinik_state`), `DebugProgressPanel.jsx:20`
- **User-specific?** Yes (per-profile)
- **Should sync to cloud?** **MUST sync** -- this is the primary user data
- **Migration risk:** **High**. This is the biggest and most complex key. See Section 3 for full schema.

---

### 2.2 Onboarding

---

#### Key: `dk_onboarding`
- **What it stores:** Onboarding flow state (duplicated alongside main state)
- **Schema:**
  ```json
  {
    "onboardingComplete": "boolean",
    "goalSetupComplete": "boolean",
    "startLevel": "string|null",
    "targetLevel": "string|null",
    "dailyMinutes": "number",
    "daysPerWeek": "number",
    "targetDate": "string|null",
    "estimatedFinishDate": "string|null",
    "onboardingStarted": "boolean"
  }
  ```
- **Read from:** `onboardingState.js:18,44` (isOnboardingComplete, getOnboardingState)
- **Written to:** `onboardingState.js:36` (setOnboardingState), `onboardingState.js:65` (clearOnboardingState)
- **Written from:** `OnboardingPage.jsx`, `GoalSetupPage.jsx`, `PlacementTest.jsx`, `SettingsPage.jsx`
- **User-specific?** Yes
- **Should sync to cloud?** Yes (but redundant with main state)
- **Migration risk:** **Medium**. Duplicated data; must ensure sync consistency.

---

### 2.3 Goal / Target

---

#### Key: `deutsch_klinik_study_goal`
- **What it stores:** User's study goal settings
- **Schema:**
  ```json
  {
    "targetLevel": "string (e.g. B2)",
    "dailyMinutes": "number",
    "planType": "string (e.g. 'exam')"
  }
  ```
- **Read from:** `StudyGoalTracker.jsx:55` (getStudyGoal)
- **Written to:** `StudyGoalTracker.jsx:71` (saveStudyGoal), `StudyGoalTracker.jsx:79` (clearStudyGoal)
- **User-specific?** Yes
- **Should sync to cloud?** Yes (but redundant with main state)
- **Migration risk:** **Low-medium**. Small, but duplicated data.

---

### 2.4 Dashboard / UI Preferences

---

#### Key: `deutsch_klinik_dashboard_collapsed`
- **What it stores:** Which dashboard sections are collapsed/expanded
- **Schema:** `{ [sectionId: string]: boolean } | boolean` (can be an object or flat boolean)
- **Read from:** `Dashboard.jsx:603,713`
- **Written to:** `Dashboard.jsx:734,742,748,752`
- **User-specific?** Yes
- **Should sync to cloud?** **Should** (for cross-device UX consistency)
- **Migration risk:** **Low**. Pure UI preference.

---

#### Key: `deutsch_klinik_session_starts`
- **What it stores:** Recent session start timestamps (for streak/activity tracking)
- **Schema:** `Array<{ date: string, time: string }>`
- **Read from:** `Dashboard.jsx:762,774`
- **Written to:** `Dashboard.jsx:790`, `Dashboard.jsx:1119` (remove)
- **User-specific?** Yes
- **Should sync to cloud?** **Should** (for accurate streak tracking across devices)
- **Migration risk:** **Low**. Simple array.

---

#### Key: `deutsch_klinik_vocab_filters`
- **What it stores:** User's current vocabulary page filter settings
- **Schema:** `{ search?: string, pos?: string, level?: string, medical?: boolean }` (varies)
- **Read from:** `VocabularyPage.jsx:17` (loadSavedFilters)
- **Written to:** `VocabularyPage.jsx:25` (saveFilters), `VocabularyPage.jsx:28` (clearSavedFilters)
- **User-specific?** Yes
- **Should sync to cloud?** **Should** (nice to have)
- **Migration risk:** **Low**. Small UI pref.

---

### 2.5 Daily Missions

---

#### Key: `deutsch_klinik_daily_session`
- **What it stores:** The current day's daily mission session (exercises selected, progress)
- **Schema:** `{ dateKey: string, levelId: string, selectedExerciseIds: object, ... }` (complex, varies)
- **Read from:** `DailyMissionPage.jsx:132` (loadSession)
- **Written to:** `DailyMissionPage.jsx:141` (saveSession), `DailyMissionPage.jsx:145` (clearSession)
- **User-specific?** Yes
- **Should sync to cloud?** **Not needed** (ephemeral -- only relevant for the current day)
- **Migration risk:** **Low**. Daily ephemeral data; safe to lose.

---

### 2.6 FSP / Medical German

---

#### Key: `fsp_exam_attempts`
- **What it stores:** FSP exam attempt records (which exams started, completed, scores)
- **Schema:** `{ [examId: string]: { examId, responses, scores, totalScore, completedAt?, ... } }`
- **Read from:** `FSPExamPage.jsx:114` (loadAttempts)
- **Written to:** `FSPExamPage.jsx:125` (saveAttempts)
- **User-specific?** Yes
- **Should sync to cloud?** **MUST sync** -- exam history is critical user data
- **Migration risk:** **Medium**. Moderate complexity, but currently `var`-scoped in a functional component.

---

#### Key: `fspProgress`
- **What it stores:** Medical German / FSP module completion progress
- **Schema:** `{ [moduleId: string]: { completed: boolean, score?: number, lastAccessed?: string } }`
- **Read from:** `MedicalFSPHubPage.jsx:85`
- **Written to:** `MedicalFSPHubPage.jsx:85` (read only -- no writes found in audit)
- **User-specific?** Yes
- **Should sync to cloud?** **MUST sync** -- progress data
- **Migration risk:** **High**. Currently only read, not written through any utility; likely incomplete pattern.

---

### 2.7 Lesson Checklists

---

#### Key: `dk_lesson_checklist_{lessonId}` (dynamic per lesson)
- **What it stores:** Per-lesson UI checklist state (which subsections student has interacted with)
- **Schema:** `{ [sectionKey: string]: boolean }`
- **Read from:** `LessonDetailPage.jsx:138`
- **Written to:** `LessonDetailPage.jsx:156` (persisted via useEffect)
- **User-specific?** Yes
- **Should sync to cloud?** **Should** (for lesson continuity across devices)
- **Migration risk:** **Medium**. Many keys (one per lesson); could be merged into main state.

---

### 2.8 Sync Metadata

---

#### Key: `deutsch_klinik_sync_meta`
- **What it stores:** Timestamps and status of last cloud sync (upload/download)
- **Schema:**
  ```json
  {
    "lastUploadAt": "ISO string",
    "lastUploadType": "'manual'|'auto'",
    "lastDownloadAt": "ISO string",
    "lastErrorAt": "ISO string",
    "lastErrorMessage": "string (max 200 chars)"
  }
  ```
- **Read from:** `AuthPanel.jsx:62`
- **Written to:** `AuthPanel.jsx:86` (setSyncMeta), `AuthPanel.jsx:94` (clearSyncMeta)
- **User-specific?** Yes
- **Should sync to cloud?** **No** -- it _is_ the sync metadata, stays local
- **Migration risk:** **Low**. Internal metadata.

---

### 2.9 Legacy / Fallback

---

#### Key: `deutsch_klinik_state` (legacy, no profile suffix)
- **What it stores:** Same structure as `deutsch_klinik_state_{profile}` but for backwards compatibility
- **Read from:** `AuthPanel.jsx:20` (getLocalProgress), `DebugProgressPanel.jsx:20`
- **Written to:** `AuthPanel.jsx:41` (setLocalProgress), `DebugProgressPanel.jsx:26` (remove)
- **User-specific?** Yes
- **Should sync to cloud?** No -- legacy fallback only
- **Migration risk:** **Medium**. AuthPanel reads/writes this during sync; profile logic may bypass it.

---

## 3. Main State Schema (`deutsch_klinik_state_{profile}`)

The full `defaultState` object structure:

| Field | Type | Category | Description |
|-------|------|----------|-------------|
| `currentLevel` | `string` | Profile | Current active level (A1-C1) |
| `theme` | `string` | Settings | 'dark' or 'light' |
| `streak` | `{ count: number, lastDate: string\|null }` | Stats | Daily streak tracking |
| `levels` | `{ [level: string]: { grammar?, vocab?, quizzes?, ... } }` | Progress | Per-level skill progress arrays |
| `exams` | `{ [level: string]: { passed: bool, score: number, date: string } }` | Exams | Exam results per level |
| `writings` | `array` | Writing | Writing submissions |
| `speakingRecordings` | `object` | Speaking | Speaking recordings per level |
| `flashcards` | `object` | Flashcards | SM-2 spaced repetition state |
| `weakAreas` | `object` | Weakness | Boolean flags per skill per level |
| `placementResult` | `string\|null` | Placement | Placement test result level |
| `medicalUnlocked` | `boolean` | Medical | Medical German unlocked |
| `onboardingComplete` | `boolean` | Onboarding | Onboarding flags |
| `startLevel` | `string\|null` | Onboarding | Starting level |
| `targetLevel` | `string\|null` | Onboarding | Target level |
| `dailyMinutes` | `number` | Onboarding | Minutes per day |
| `daysPerWeek` | `number` | Onboarding | Days per week |
| `targetDate` | `string\|null` | Onboarding | User's deadline |
| `estimatedFinishDate` | `string\|null` | Onboarding | Calculated finish |
| `goalSetupComplete` | `boolean` | Onboarding | Goal setup done |
| `completedLessons` | `object` | Lessons | Completed lesson IDs per level |
| `incorrectAnswers` | `object` | Mistakes | Wrong answers per level |
| `repeatedMistakes` | `object` | Mistakes | Repeated mistake counts |
| `mistakeNotebook` | `object` | Mistakes | Mistake notebook entries |
| `vocabularyMastery` | `object` | Flashcards | SM-2 per-word mastery |
| `grammarMastery` | `object` | Grammar | Per-exercise grammar mastery |
| `listeningCompleted` | `object` | Listening | Completed listening exercises |
| `readingCompleted` | `object` | Reading | Completed reading exercises |
| `completedGrammarLessons` | `object` | Grammar | Completed grammar curriculum lessons |
| `readinessScores` | `object` | C1 | C1 Readiness assessment scores |
| `topicWeakness` | `object` | Weakness | Topic-based weakness tracking |
| `dailyStudyLog` | `array` | Stats | Daily study minutes log |
| `studyLog` | `object` | Stats | Study log per date key |
| `remediationQueue` | `array` | Weakness | Remediation recommendations |

**Total: ~30 top-level fields** spanning all categories.

---

## 4. State Utility Patterns

### 4.1 `store.js` -- Core State Manager

**How getState/saveState work:**

1. **Singleton pattern:** `let state = loadState()` runs once on module import
2. **`loadState()`**: Reads `deutsch_klinik_state_{profile}` from localStorage, parses JSON, merges with `defaultState` using deep-merge (`mergeState`). Falls back to a fresh `defaultState` clone on error.
3. **`getState()`**: Returns the in-memory singleton (no localStorage read)
4. **`saveState(state)`**: Serializes to JSON, writes to `deutsch_klinik_state_{profile}`, then dispatches a `CustomEvent('deutsch-klinik-progress-changed')` for potential sync listeners
5. **`updateState(partial)`**: Merges partial into current state, then saves. **NOTE:** Merges the entire partial object at top level, then writes the whole thing back.
6. **`mergeState(base, saved)`**: Deep merges plain objects; arrays are replaced, not merged.

**Profile switching pattern:**
- `dk_active_profile` holds the profile name
- `getStoreKey()` returns `deutsch_klinik_state_{profile}` (or `deutsch_klinik_state_default` if no profile)
- `switchProfile(name)` writes the name to `dk_active_profile`, then reloads the page
- `signOutProfile()` removes `dk_active_profile`, then reloads
- Page reload forces re-initialization of the singleton state from the new key

### 4.2 `onboardingState.js` -- Dual-Write Strategy

- **Primary:** Writes to main state via `updateState()` (called in pages)
- **Secondary:** Writes to dedicated key `dk_onboarding`
- **Read:** `isOnboardingComplete()` checks main state first, then falls back to `dk_onboarding`
- **Why dual-write:** Historical; onboarding state was split into its own key for independent access. This creates a synchronization problem.

### 4.3 `StudyGoalTracker.jsx` -- Independent Key

- `deutsch_klinik_study_goal` is a completely separate key from the main state
- `getStudyGoal()` reads from it directly
- This goal data is **also stored** in the main state (under `targetLevel`, `dailyMinutes`, `daysPerWeek`)
- **Dual-write risk:** Updates to goal in one place won't reflect in the other.

### 4.4 `DailyMissionPage.jsx` -- Ephemeral Session

- `deutsch_klinik_daily_session` stores current day's mission data
- Validated by matching `dateKey` and `levelId`
- Cleared/overwritten each day
- Not tied to any sync mechanism

### 4.5 `AuthPanel.jsx` -- Cloud Sync

- Reads/writes directly to `deutsch_klinik_state` (legacy, no profile suffix) and individual pref keys
- Has its own progress import/export logic (`PROGRESS_KEY = 'deutsch_klinik_state'`)
- Confusingly, it references the **legacy** key, not the profile-scoped key from store.js
- **This means auth sync may not work correctly with profile switching.**

---

## 5. Data Categories Summary

| Category | Keys | Count | Cloud Sync Priority |
|----------|------|-------|---------------------|
| **Profile/Identity** | `dk_active_profile`, `deutsch_klinik_state_{profile}` | 2 dynamic | MUST |
| **Onboarding** | `dk_onboarding`, fields in main state | 1+in-main | SHOULD (redundant) |
| **Goal/Target** | `deutsch_klinik_study_goal`, fields in main state | 1+in-main | SHOULD (redundant) |
| **Level Progress** | Fields in `deutsch_klinik_state_{profile}.levels` | in-main | MUST |
| **Daily Missions** | `deutsch_klinik_daily_session` | 1 | NOT NEEDED |
| **Exam Attempts** | `fsp_exam_attempts`, fields in main state `exams` | 1+in-main | MUST |
| **Flashcards** | `deutsch_klinik_state_{profile}.vocabularyMastery`, `.flashcards` | in-main | MUST |
| **Mistakes** | `deutsch_klinik_state_{profile}.incorrectAnswers`, `.repeatedMistakes`, `.mistakeNotebook` | in-main | MUST |
| **Writing/Speaking** | `deutsch_klinik_state_{profile}.writings`, `.speakingRecordings` | in-main | MUST |
| **FSP Progress** | `fspProgress`, exam attempts | 2 | MUST |
| **Lesson Checklists** | `dk_lesson_checklist_{lessonId}` | many dynamic | SHOULD |
| **Settings/Prefs** | `deutsch_klinik_dashboard_collapsed`, `deutsch_klinik_vocab_filters`, `theme` in main state | 2+in-main | SHOULD |
| **Session/UI** | `deutsch_klinik_session_starts` | 1 | SHOULD |
| **Sync Metadata** | `deutsch_klinik_sync_meta` | 1 | CANNOT (local-only) |

---

## 6. Migration Risks

### 6.1 Per-Key Risk Assessment

| Key | Multi-device Issue | Clear localStorage Impact | Cloud data older/newer issue |
|-----|-------------------|--------------------------|------------------------------|
| `dk_active_profile` | Each device could have different profile names | User loses profile identity; forced back to login | Simple string, low conflict risk |
| `deutsch_klinik_state_{profile}` | **Unsynchronized** -- each device has independent progress | **Total data loss** -- all progress, exams, flashcards gone | Deep merge needed; complex conflict resolution |
| `dk_onboarding` | Could differ from main state after sync | User redoes onboarding but main state still exists | Old onboarding state could revert a completed onboarding |
| `deutsch_klinik_study_goal` | Different goals set on different devices | Revert to default goal estimate | Old goal could overwrite newly set one |
| `deutsch_klinik_dashboard_collapsed` | Each device has its own collapsed state | Resets to all-expanded | Low impact |
| `deutsch_klinik_session_starts` | Session starts tracked per device | Streak accuracy lost temporarily | Could double-count or miss sessions |
| `deutsch_klinik_vocab_filters` | Per-device filter preference | Reset to defaults | Low impact |
| `deutsch_klinik_daily_session` | Per-device (correct, daily) | Loss of current day's mission | N/A (ephemeral) |
| `fsp_exam_attempts` | **Unsynchronized** | All FSP exam progress lost | Need to merge arrays of attempts |
| `fspProgress` | **Unsynchronized** | All FSP module progress lost | Need to merge module states |
| `dk_lesson_checklist_*` | Checklist state per-device | Student has to re-check sections | Could miss completed sections |
| `deutsch_klinik_sync_meta` | Local-only; no sync impact | Loss of last-sync timestamps | N/A |

### 6.2 Critical Migration Concerns

1. **AuthPanel uses legacy key**: `AuthPanel.jsx` does backup/restore against `deutsch_klinik_state` (no profile suffix). With profile switching, this means:
   - `AuthPanel.sync()` uploads the **default profile** data, not the currently active profile
   - `AuthPanel.import()` overwrites the **default profile** data
   - Profile-scoped state is completely invisible to the sync system

2. **Duplicate data everywhere**: Onboarding state, study goals, and lesson progress are written to **both** the main state key and separate keys. Cloud sync must reconcile these duplicates.

3. **No conflict resolution strategy**: Current `mergeState` does a naive deep-merge with arrays being replaced rather than merged. For cloud sync, you need last-writer-wins with timestamps, or a proper merge strategy.

4. **FSP data lives outside main state**: `fsp_exam_attempts` and `fspProgress` are completely independent keys. They must be included in any cloud sync protocol.

---

## 7. Recommendations

### 7.1 Keys that MUST sync (critical user data)

1. **`deutsch_klinik_state_{profile}`** -- Primary state (all progress, scores, exams, flashcards)
2. **`fsp_exam_attempts`** -- FSP exam history
3. **`fspProgress`** -- FSP module progress

### 7.2 Keys that SHOULD sync (important UX continuity)

4. **`dk_onboarding`** -- Redundant with main state, but needed for pre-main-state reads
5. **`deutsch_klinik_study_goal`** -- Goal preferences (also redundant with main state)
6. **`dk_active_profile`** -- Profile identity
7. **`deutsch_klinik_dashboard_collapsed`** -- UI layout preference
8. **`deutsch_klinik_session_starts`** -- Activity/streak tracking
9. **`dk_lesson_checklist_*`** -- Per-lesson checklist state
10. **`deutsch_klinik_vocab_filters`** -- Vocabulary page filters

### 7.3 Keys that should NOT sync (local-only)

11. **`deutsch_klinik_sync_meta`** -- Sync metadata stays local
12. **`deutsch_klinik_daily_session`** -- Ephemeral daily data

### 7.4 Priority Order for Migration

| Priority | Keys | Rationale |
|----------|------|-----------|
| **P0** | `deutsch_klinik_state_{profile}` | Primary data store, all progress lives here |
| **P0** | `dk_active_profile` | Needed to scope sync per profile |
| **P0** | `fsp_exam_attempts`, `fspProgress` | Critical FSP exam data outside main state |
| **P1** | `dk_onboarding`, `deutsch_klinik_study_goal` | Duplicates but accessed early in app lifecycle |
| **P1** | `dk_lesson_checklist_*` | Important for lesson continuity |
| **P2** | `deutsch_klinik_dashboard_collapsed`, `deutsch_klinik_vocab_filters` | Nice-to-have UI continuity |
| **P2** | `deutsch_klinik_session_starts` | Streak accuracy across devices |
| **P3** | `deutsch_klinik_daily_session` | Optional, local-only fine |
| **P3** | `deutsch_klinik_sync_meta` | Must stay local |

### 7.5 Concrete Next Steps

1. **Fix AuthPanel profile-awareness**: Update `AuthPanel.jsx` to use the profile-scoped key (`deutsch_klinik_state_{profile}`) instead of the legacy fixed key
2. **Consolidate duplicate data**: Migrate all onboarding and goal data to live only in the main state; remove separate keys or make them pure caches
3. **Add timestamps to main state**: Add `lastModified: ISO string` to the main state object for conflict resolution
4. **Choose a sync strategy**: Last-writer-wins (simplest) vs CRDT-based merge (more robust but complex)
5. **Bundle FSP keys**: Move `fsp_exam_attempts` and `fspProgress` into main state or include them explicitly in the sync payload
6. **Merge lesson checklists**: Consider moving `dk_lesson_checklist` data into the main `completedLessons` structure rather than separate keys

---

## 8. State Flow Diagram (text)

```
                         +-------------------------+
                         |   dk_active_profile     |  <-- identifies which state to load
                         +-----------+-------------+
                                     |
          +--------------------------+--------------------------+
          |                          |                          |
          v                          v                          v
+-------------------+    +----------------------+    +---------------------+
| deutsch_klinik_   |    |  dk_onboarding       |    | deutsch_klinik_      |
| state_{profile}   |    |  (separate key)       |    | study_goal           |
|                   |    |  DUPLICATES:          |    | (separate key)       |
| Contains:         |    |  - startLevel         |    | DUPLICATES:          |
| - All progress    |    |  - targetLevel        |    | - targetLevel        |
| - Onboarding      |    |  - dailyMinutes       |    | - dailyMinutes       |
| - Goal settings   |    |  - daysPerWeek        |    |                      |
| - Exams           |    |  - targetDate         |    +---------------------+
| - Flashcards      |    +----------------------+
| - Mistakes        |
| - etc.            |    +----------------------+
+-------------------+    | fsp_exam_attempts    |
                          | (separate key)       |
                          +----------------------+

                          +----------------------+
                          | fspProgress          |
                          | (separate key)       |
                          +----------------------+

                          +----------------------+
                          | dk_lesson_checklist_*|
                          | (per-lesson keys)    |
                          +----------------------+

                          +----------------------+
                          | deutsch_klinik_      |
                          | sync_meta            |
                          | (local only)         |
                          +----------------------+
```

---

## 9. Summary

**Total localStorage keys discovered:** 15 distinct logical keys (including dynamic patterns and legacy)
**Files touching localStorage:** 13 source files
**Primary data risk:** AuthPanel's sync logic uses legacy un-scoped key (`deutsch_klinik_state`) instead of profile-scoped key (`deutsch_klinik_state_{profile}`)
**Data duplication risk:** Onboarding, goals, and lesson checklists have redundant storage paths
**Missing features:** No conflict resolution, no timestamps on main state, no FSP data in sync scope
