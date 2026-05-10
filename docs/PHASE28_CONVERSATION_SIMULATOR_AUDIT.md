# Phase 28: Conversation Simulator Audit

Date: 2026-05-10

## 1. Existing Speaking Flow (SpeakingPage.jsx)

### Flow
1. `SpeakingPage` loads from `dataLoaders.js` via `loadFspSpeakingData()`.
2. A speaking card shows a prompt (German text), audio recording button, and submit area.
3. On submit, `submitSpeaking()` calls `correctSpeaking()` (AI correction via ai-worker).
4. If AI unavailable, falls back to local self-check mode.
5. Progress: `completeSpeaking('speakingPrompts', id)` -> updates `state.speakingCompleted`.
6. `recordPracticeAttempt('speaking', id, {score, maxScore})` -> stored in `practiceProgress_v1` key.
7. Mistakes: `recordAnswer()` stores failed attempts into `state.mistakeNotebook`.

### Strengths
- Clean separation of AI/manual modes.
- `isCorrectionEnabled()` gate for AI availability.
- Complete flow from load -> practice -> progress save.

### Gaps
- No roleplay-specific data loading or rendering.
- Expected points / rubric not part of speaking data.
- No multi-checkpoint feedback.
- No self-assessment checklist.

## 2. FSP Data Reuse

### Existing Data Files
- `fspCases.json`: 130 clinical cases with chief complaint, history, symptoms, diagnostics.
- `fspSpeaking.json`: 80 speaking prompts linked to cases via `caseId`.
- `fspPresentations.json`: 100 presentation items.
- `dataLoaders.js`: `loadFspSpeakingData()`, `loadFspCase()`, `loadFspCases()`.

### Reusable for Roleplay
- Chief complaint -> scenario description.
- History/symptoms -> expected points for doctor-patient dialog.
- `caseId` field -> direct link from FSP roleplay scenario to case data.
- Red flags, handover points, arztbrief points -> additional metadata fields.

### Not Reusable Directly
- Speaking prompts are not roleplay scenarios.
- No role/character assignments.
- No built-in feedback rubric.
- No vocabulary targets.

## 3. AI Correction

### Existing Functions
- `correctWriting(payload)` -> calls worker 'correct-writing' endpoint.
- `correctSpeaking(payload)` -> calls worker 'correct-speaking' endpoint.
- `isCorrectionEnabled()` -> returns whether AI worker is configured.
- Worker handles Cloudflare AI binding with HuggingFace Llama.

### Reuse Strategy
- No new worker endpoint needed for v1.
- `correctWriting()` can be called with:
  ```
  {
    task: 'Roleplay: [scenario.title]',
    userResponse: [user input],
    level: scenario.level,
  }
  ```
- If AI unavailable, `correctWriting()` already falls back to local heuristics (returns self-check feedback).

### Local Fallback
- When AI unavailable, RoleplayPage provides manual checklist self-assessment:
  - Checkboxes for each expected point.
  - Self-score slider (0-10).
  - Manual submit with score calculation.

## 4. Local Fallback Behavior

### Current
- `correctWriting()` with AI disabled returns:
  ```
  { score: 5, mistakes: [], feedback: 'AI correction not available. Review your answer against the task requirements.', suggestions: '' }
  ```

### Needed for Roleplay
- Local evaluation function `evaluateLocally()`:
  - Keyword matching against expected points.
  - Vocabulary target coverage.
  - Sentence structure length metrics.
  - Returns score 1-10.

## 5. Routes and Components

### Routes (to add)
```
/conversation -> RoleplayPage
```

### App.jsx
- Add `import` for `RoleplayPage`.
- Add `<Route path="conversation">` inside the ProtectedRoute group.
- Keep lazy loading.

### Practice Hub
Add "Conversation Practice" card:
```
title: 'Conversation Practice'
icon: <MessageSquare />
accent: '#ff6b00'
to: '/conversation'
```

### RoleplayPage Component
- Phase 1: Browse scenarios with filters (level, type, specialty).
- Phase 2: Prep — show scenario details, role, goal, checklist.
- Phase 3: Respond — text input, submit.
- Phase 4: Feedback — AI or manual self-assessment.
- Phase 5: Save progress.

### Sub-components (optional, inlined for simplicity in v1)
- Filter bar: dropdowns for level, type, specialty.
- Scenario card: icon, badge, title, preview, role tags.

## 6. Storage and Progress

### Existing Storage Functions
- `completeSpeaking(skill, id)` -> updates `state.speakingCompleted`.
- `recordPracticeAttempt(skill, id, {score, maxScore, correct, dueDate})` -> `localStorage.practiceProgress_v1`.
- `recordAnswer(level, id, userAnswer, correctAnswer, category, grammarCorrect, skill)` -> `state.mistakeNotebook`.
- Supabase sync: `syncPracticeProgress()` uploads `practiceProgress_v1` to Supabase.

### New Storage Key
- Skill key: `'roleplay'` used as first argument to `recordPracticeAttempt()`.
- `completeSpeaking('roleplay', id)` for tracking completed roleplays.

### Score Thresholds
- Score >= 8/10: completed, dueDate = +14 days.
- Score < 8/10: needs review, dueDate = +1 day.

## 7. File Changes Required

| File | Change |
|---|---|
| `src/data/roleplayScenarios.json` | NEW — 70 scenarios |
| `src/pages/RoleplayPage.jsx` | NEW — main component |
| `src/App.jsx` | Add import + route |
| `src/pages/PracticeHubPage.jsx` | Add conversation practice card |
| `package.json` | Add `validate-roleplay` script |
| `scripts/validate-roleplay.cjs` | NEW — data validator |
| `scripts/phase28-generate.cjs` | NEW — data generator |
| `docs/PHASE28_CONVERSATION_SIMULATOR_AUDIT.md` | NEW — this file |
| `docs/PHASE28_CONVERSATION_SIMULATOR_FINAL_REPORT.md` | NEW — final report |
| `tests/roleplay-practice.test.js` | NEW — unit tests |
