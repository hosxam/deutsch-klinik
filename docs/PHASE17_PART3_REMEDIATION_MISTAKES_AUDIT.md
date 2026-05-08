# Phase 17 Part 3: Remediation & Mistake Notebook Audit

## 1. Current Remediation Flow

### How It Works
1. User navigates to Today's Plan (`/level/{levelId}/daily`)
2. DailyMissionPage builds mission list via `buildMissions()`
3. If `getRemediationRecommendation()` finds a weak area, a `remediation` mission is added
4. The remediation mission presents quick vocabulary review from mistaken/weak words
5. User marks remediation complete via `hRemediationDone()` or completes all items
6. `advance('remediation', { completed: true, skill, improved })` saves session progress
7. After all missions complete, `clearSession()` is called and `setCompShow(true)` shows completion screen

### Remediation Completion Storage
- Remediation results stored in session data via `saveSession()` in localStorage under `daily_session_{levelId}`
- `advance()` records: `{ type: 'remediation', completed: true, skill: rec?.skill || 'review', improved: count }`
- No state-level tracking of remediation completion in the main store
- Study minutes recorded via `recordStudyMinutes()`

### Back to Dashboard Route
- Completion screen shows `<Link to={'/level/' + levelId}>` which navigates to LevelPage, NOT Dashboard
- LevelPage at `/level/{levelId}` renders level-specific overview
- User must click Dashboard nav link separately to reach Dashboard
- Actual Dashboard is at `/` route

## 2. Dashboard "Something Broke" Root Cause

### Error Analysis
The Dashboard component at `src/pages/Dashboard.jsx` has a crash vulnerability:

**Line 36: `const speakingDone = (state.speakingRecordings[studyLevel]?.length || 0);`**

If `state.speakingRecordings` is `undefined` (e.g. after localStorage corruption, fresh install, or race condition during state load), accessing `state.speakingRecordings[studyLevel]` throws `TypeError: Cannot read properties of undefined` because there is no optional chaining on `state.speakingRecordings`.

The `defaultState` in `store.js` defines `speakingRecordings: {}`, so it should be set. But if:
- LocalStorage data is corrupted or has a different shape
- State migration happens without `speakingRecordings`
- `speakingRecordings` gets set to `undefined` somewhere

The crash would occur.

**Line 54 (inside reduce): `(state.speakingRecordings[lvl.id]?.length)`**

Same issue - missing `?.` before `[lvl.id]`.

### Why Remediation Specifically Triggers It
The remediation flow itself doesn't corrupt state. However:
1. After completing all missions, `clearSession()` is called
2. `clearSession()` removes the daily session from localStorage
3. User navigates to `/level/{levelId}`, then to Dashboard `/`
4. Dashboard re-renders with `getState()` - if state was somehow mangled during the session, speakingRecordings could be undefined

The most likely cause: User has existing saved state from a previous version that lacks `speakingRecordings` (before that field was added to defaultState), and the merge didn't properly add it.

### Secondary Issue
- Line 37: `Object.keys(state.mistakeNotebook || {}).length` has a fallback, safe
- Line 53: `state.writings?.filter(...)` has optional chaining, safe
- Various other `state.levels[studyLevel]` accesses use `|| {}`, safe

## 3. Mistake Notebook Vocab Review Section

### Current Structure
`src/pages/MistakeNotebookPage.jsx` currently has:
- **Two tabs**: Mistakes, Weak Topics
- **Skill filter** including: grammar, reading, listening, vocab, exam, mistake-retry
- No separate "vocab review section" - just a `vocab` filter option in the dropdown
- Subtitle mentions "reinforce vocabulary"
- Mistakes tab shows ALL mistakes including vocabulary mistakes

### What's "Useless"
The skill filter dropdown includes `vocab` as a filter option. When user selects "Vocabulary", it merely filters the regular mistake list to only show entries with `skill='vocab'`. This provides no special functionality beyond any other skill filter.

There is NO separate flashcard/vocab review section on the page. The actual useless content is:
1. The `vocab` skill filter option provides nothing special - just filtering the same list
2. The subtitle mentioning "reinforce vocabulary" is misleading because Mistake Notebook doesn't do vocab review

## 4. Terminology Inconsistency

### Current Wording
- Dashboard: "Start Today's Session" button links to Daily Mission
- Dashboard: "Start Session" / "Review Mistakes" button in Recommended Practice section
- Dashboard stats card: "Flashcards Due"
- Nav/menu: No "Today's Practice" or "Today's Plan" labels visible
- DailyMissionPage title: Typically "Daily Mission" or level-specific naming

The app primarily uses "Daily Mission" and "Today's Session" rather than "Today's Plan" or "Today's Practice",
so no major terminology conflict exists, but some wording could be made more consistent.

