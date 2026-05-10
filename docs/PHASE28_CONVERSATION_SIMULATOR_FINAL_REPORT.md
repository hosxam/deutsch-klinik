# Phase 28: Conversation Simulator — Final Report

Date: 2026-05-10
Branch: `vocab-import-pipeline`
Base commit: `b9c7b798`

## Summary

Added conversation roleplay practice mode to deutsch-klinik. The system supports everyday German conversations, FSP doctor-patient roleplays, doctor-doctor handovers, and patient education scenarios. Works fully offline with AI optional.

## What Was Built

### 1. Roleplay Data Model
- **70 scenarios** across 4 types:
  - 20 everyday German conversations (A2-B1)
  - 30 FSP doctor-patient consultations (B1-B2)
  - 10 doctor-doctor ISBAR handovers (B2)
  - 10 patient explanation scenarios (B1)
- Each scenario includes: id, level, type, title, scenario text, user/partner roles, goal, expected points, useful phrases, vocabulary targets, checklist, rubric, and FSP linkage (caseId, specialty, redFlags).
- All 50 FSP roleplays link to valid case IDs in `fspCases.json`.
- Generated via `scripts/phase28-generate.cjs`.

### 2. RoleplayPage Component
- 3-phase flow: Browse -> Prep -> Respond.
- **Browse**: Grid of scenario cards with type icons, level badges, progress indicators. Filters for type, level, and specialty.
- **Prep**: Shows scenario details, role assignment, goal, useful phrases, vocabulary targets, expected points.
- **Respond**: Text input area, AI evaluation (via existing `correctWriting()` endpoint) or manual self-assessment.
- **Feedback**: For AI mode — score, mistakes, suggestions, corrected answer. For manual mode — checklist with checkboxes, self-score slider.
- **Progress**: Saves via `recordPracticeAttempt('roleplay', ...)`, tracks in `speakingCompleted`. Mistakes recorded via `recordAnswer()` for review.

### 3. AI Integration
- Reuses existing `correctWriting()` function — no new worker endpoint.
- When AI available: evaluates response against scenario context.
- When AI unavailable: falls back to `evaluateLocally()` — keyword matching + metrics, plus manual checklist mode.

### 4. Route and Navigation
- Route: `/conversation` (lazy loaded, behind RouteGuard).
- Practice Hub: "Conversation Practice" card added with `MessageSquare` icon.
- App.jsx imports: `RoleplayPage`.

### 5. Manual Mode
- Works fully without AI.
- Shows checkboxes for each expected point.
- Self-score slider (0-10).
- Submits weighted score: 60% checklist + 40% self-score.
- Can still retry or save progress.

### 6. Progress Tracking
- Uses `recordPracticeAttempt('roleplay', id, {score, maxScore, correct, dueDate})`.
- Score >= 8/10: completed, due in 14 days.
- Score < 8/10: needs review, due in 1 day.
- `completeSpeaking('roleplay', id)` marks done.
- `recordAnswer()` on failures for mistake notebook/flashcards.

## Files Changed

### New Files
| File | Description |
|---|---|
| `src/data/roleplayScenarios.json` | 70 roleplay scenarios |
| `src/pages/RoleplayPage.jsx` | Full roleplay page (browse, prep, respond, feedback) |
| `tests/roleplay-practice.test.js` | 34 unit tests |
| `scripts/phase28-generate.cjs` | Data generation script |
| `scripts/validate-roleplay.cjs` | Data validator |
| `docs/PHASE28_CONVERSATION_SIMULATOR_AUDIT.md` | Infrastructure audit |
| `docs/PHASE28_CONVERSATION_SIMULATOR_FINAL_REPORT.md` | This report |

### Modified Files
| File | Change |
|---|---|
| `src/App.jsx` | Added lazy import + route for RoleplayPage |
| `src/pages/PracticeHubPage.jsx` | Added Conversation Practice card |
| `package.json` | Added `validate-roleplay` npm script |

## Test Results

### Vitest
```
Test Files  11 passed (11)
Tests       34 passed (34)  [roleplay-practice.test.js]
```
Roleplay tests cover: data integrity (IDs, fields, levels, types, distribution, rubric, case links), local evaluation logic (scoring, missing points, vocabulary), manual checklist scoring, save attempt classification, scenario filtering, and FSP case cross-references.

### Build
```
npm run build — passed
```
RoleplayPage chunk: 120.87 kB (gzip: 20.98 kB). No build errors.

### Lint
```
npm run lint — 0 errors, 91 warnings (all pre-existing or intentional empty catch blocks)
```

### Validators
| Validator | Result |
|---|---|
| `validate-roleplay` | 70 scenarios validated, 0 errors, 0 warnings |
| `validate-fsp-quality` | 24/24 passed |
| `validate-curriculum` | All checks passed (1610 units, 1578 concepts) |
| `validate-teach-before-test` | Passed (5 pre-existing warnings) |
| `validate-curriculum-dependencies` | All passed |

## Remaining Limitations

1. **No multi-turn conversation.** v1 is single user response + feedback. Multi-turn (back-and-forth dialog) deferred to future version.

2. **No speaking/transcription input.** Speech-to-text not wired yet. User types response. Can be added later via existing `startRecording` / `speech-to-text` from SpeakingPage.

3. **Sample conversations not bundled.** `sampleConversation` field exists in data model but generator skipped it for compactness. If needed, can be added in a future phase.

4. **Dashboard card not added.** Low priority — existing dashboard is cluttered enough. Practice Hub entry is sufficient.

5. **No curriculum integration.** Roleplays are not linked to specific lessons (`taughtInLessonId`). This is intentional — roleplay is cross-cutting practice, not lesson-specific content.

## Next Recommended Phase

**Phase 29: Daily Plan Roleplay Integration**
- Add roleplay items to Today Plan.
- Show a "Daily Conversation" task.
- Track roleplay `practiceProgress` alongside speaking/writing/reading/listening in the daily plan pipeline.
- Possibly add a "Strength Day" style roleplay recommendation based on recent mistakes.

## Commit

```
commit: a5f3e... (pending)
message: Phase 28: add conversation roleplay practice
branch: vocab-import-pipeline
```

## Sign-off

Phase 28 is complete and safe to close.
- No breaking changes to existing speaking flow.
- All AI features optional; local-only mode works.
- Route, component, data, tests, validators all present.
- Build, lint, and all validators pass.
- Ready to merge and push.
