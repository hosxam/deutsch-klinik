# Phase 32: Adaptive Daily Plan Audit

Date: 2026-05-11
Branch: `vocab-import-pipeline`
Commit: `1bf90ac4`
Auditor: Najm (⭐)



=============================================================================
1. HOW TODAY'S PLAN IS GENERATED NOW
=============================================================================

## Entry Point: DailyMissionPage.jsx

The `DailyMissionPage` component is the core of Today's Plan. When a user
visits `/daily-plan/:level` (or the level-specific route), the page:

### Step 1 — Load state and data
```
onMount:
  - getState() from store.js (localStorage)
  - loadLevelGrammar(level), loadLevelVocabulary(level), etc. from dataLoaders
  - load or create session from localStorage 'deutsch_klinik_daily_session'
  - compute goals via getStudyGoal()
```

### Step 2 — Calculate daily targets
```
calculateDailyTargets(levelId, state, goal):
  1. Calls buildAdaptiveTargets(levelId, state, goal) from adaptivePlan.js
  2. Overrides targets with generatePlan() which distributes minutes by
     TIME_BUDGET fractions and MINS_PER_ITEM estimates:
     - lesson:     25% of daily minutes, 8 min/item
     - grammar:    20% of daily minutes, 1.5 min/item
     - flashcard:  20% of daily minutes, 0.5 min/item
     - reading:    15% of daily minutes, 5 min/item
     - listening:  12% of daily minutes, 4 min/item
     - writing:     8% of daily minutes, 7 min/item
```

generatePlan() is a flat minute-budget approach. It does NOT consider:
- Weak areas
- Topic grouping
- Active vs passive skill balance by level

### Step 3 — Build mission list
```
buildMissions(levelId, state, targets, forceType):
  - Finds next incomplete lesson (from dashboardSummary.lessonSummaries)
  - Finds next incomplete grammar curriculum lesson
  - Adds grammar practice, vocabulary, flashcards, listening, reading,
    writing, speaking, remediation based on target counts
  - Returns missions array in order: lesson → grammarLesson → grammar →
    vocabulary → flashcards → listening → reading → writing → speaking →
    remediation
```

### Step 4 — Present missions one at a time
Each mission type has its own render block. The user completes or skips
each mission before advancing.

### Step 5 — Track results
Each mission accumulates results (correct, wrong, skipped) shown on a
completion screen.

=============================================================================
2. WHETHER adaptivePlan.js IS ACTUALLY USED
=============================================================================

## Usage: YES, partially

Functions actively used by DailyMissionPage:
- buildAdaptiveTargets() — YES, called by calculateDailyTargets()
- MINUTES constant — YES, for time estimation logging
- getRemediationRecommendation() — YES, for remediation mission

Functions NOT used by DailyMissionPage:
- getPlanTrack() — Not imported in DailyMissionPage
- getGoalEstimate() — Not imported (used in settings/dashboard?)
- getIntensity() — Not imported (label only)
- calculateTodayMinutes() — Not imported

## What buildAdaptiveTargets does

Returns a static object based on dailyMinutes and level:
```
minutes < 30:   { lesson:1, grammar:4,  vocab:6,  flashcards:? }
minutes < 60:   { lesson:1, grammar:6,  vocab:10, flashcards:?, reading:1 }
minutes < 90:   { lesson:1, grammar:10, vocab:16, flashcards:?, reading:1, listening:1, writing:1 }
minutes < 120:  { lesson:1, grammar:14, vocab:24, flashcards:?, reading:1, listening:1, writing:1, speaking:1, remediation:1 }
minutes >= 120: { lesson:1, grammar:20, vocab:32, flashcards:?, reading:1, listening:1, writing:1, speaking:1, remediation:1 }
```

Flashcards count is conditional on dueVocab > 0 or vocabMistakes > 0 or
full plan or Medical FSP track.

Key issues:
- WRITING and SPEAKING are absent at <90 minutes daily
- No consideration of level (A1 vs B2 get same breakdown)
- No weak-area injection
- No topic grouping

## Then calculateDailyTargets OVERRIDES some targets

```
targets = { ...baseTargets }  // from buildAdaptiveTargets
// Then override with generatePlan() which re-computes everything
```

generatePlan() is a flat minute fraction approach that ignores the
adaptive plan entirely for most fields. The true driver is dailyMinutes.

=============================================================================
3. HOW DAILY MINUTES AFFECT PLAN SECTIONS
=============================================================================

Minutes determine:
1. Which target counts are generated (buildAdaptiveTargets)
2. Which missions appear (buildMissions skips zero-count missions)
3. How many items per mission (generatePlan counts)

# Current breakdown by dailyMinutes

| dailyMinutes | lesson | grammar | flashcard | reading | listening | writing | speaking |
|--------------|--------|---------|-----------|---------|-----------|---------|----------|
| 15           | 1      | 2       | 6         | 0       | 0         | 0       | 0        |
| 30           | 1      | 4       | 12        | 1       | 1         | 0       | 0        |
| 60           | 2      | 8       | 24        | 2       | 2         | 1       | 0        |
| 90           | 3      | 12      | 36        | 3       | 3         | 1       | 1        |
| 120          | 4      | 16      | 48        | 4       | 3         | 1       | 2        |

Problems:
- WRITING has count 1 at most (at 60+ min), every 60 min yields only +1 item
- SPEAKING only appears at 90+ min
- No differentiation between A1 and C1 needs
- Writing/speaking counts plateau (writing capped at 1, speaking at 1-2)
  because they consume 7/6 min per item but TIME_BUDGET allocates only 8%

=============================================================================
4. HOW WEAK AREAS ARE CALCULATED
=============================================================================

## Current weak area tracking (in store.js)

### topicWeakness object
Structure: `{ 'Articles': { correct: N, incorrect: N, status: 'weak'|'improving'|'mastered' } }`
Updated by recordAnswer() on every answer.
Status determined by ratio of correct/total and absolute correct count:
- ratio >= 0.8 AND correct >= 5 → 'mastered'
- ratio >= 0.6 AND correct >= 3 → 'improving'
- else → 'weak'

### repeatedMistakes object
Structure: `{ 'A1_gr_5': { topic, count, lastDate, level } }`
Tracks how many times each exercise was answered wrong.

### incorrectAnswers
Array per level of wrong answer entries with full context.
Filterable by skill (grammar, reading, listening, vocab, etc.).

### remediationQueue
Array of remediation recommendations (generated by addRemediationRecommendation).

## How Today's Plan reads weak areas

### Remediation mission (only at 90+ min)
```
getRemediationRecommendation(state, levelId):
  - Looks at most recent listening/reading/writing/speaking item with score < 60%
  - Falls back to last mistake's skill
  - Returns a skill, why, task, route
  - This is used for the 'remediation' mission type
```

### Flashcard prioritization
The `buildRemediationSession()` in DailyMissionPage also builds a flashcard
review session from:
- Mistakes with skill=vocab/vocabulary
- VocabularyMastery entries where incorrect > correct or not mastered

### What's MISSING from weak area injection

- Grammar mistakes do NOT drive higher grammar practice weight in the plan
- Weak reading/listening scores do NOT trigger more reading/listening missions
- Topic weakness (e.g. "Articles") does NOT increase related practice
- Mistake counts by concept do NOT influence item selection
- No cross-skill weak area propagation (e.g. weak vocab → more reading on
  that topic)

=============================================================================
5. HOW MISTAKES AFFECT PLAN SELECTION
=============================================================================

## Current behavior

### Grammar mistakes
- Wrong grammar answers are saved via recordAnswer() with skill='grammar'
- They create incorrectAnswers entries, repeatedMistakes, and topicWeakness
- They DO create `vocabularyMastery` entries with key `mistake_A1_gr_X`
  - These contain SM-2 fields (ease, interval, due)
- Grammar mistakes appear as flashcards in the 'flashcards' mission
  (yes, grammar mistakes appear as flashcards via the "mistake_" SM-2 entries)
- The flashcard mission includes these in the due review queue

### Vocabulary mistakes
- Wrong vocab answers create full SM-2 vocabularyMastery entries
- Appear in flashcard due review
- Appear in MistakeNotebookPage

### Reading/Listening/Writing/Speaking mistakes
- Wrong answers saved with skill='reading'/'listening'/'writing'/'speaking'
- Create topicWeakness updates
- Create mistake flashcards in vocabularyMastery
- Do NOT directly increase count of reading/listening missions

=============================================================================
6. WHETHER GRAMMAR HAS DUE DATES/EASE/INTERVALS
=============================================================================

## Answer: NO — grammarMastery is a simple counter ONLY

grammarMastery structure (in store.js defaultState):
```
grammarMastery: {
  'A1_gr_1': { correct: N, incorrect: N, mastered: boolean }
}
```

NO SM-2 fields on grammarMastery entries:
- NO `due` / `dueAt` / `nextReviewAt`
- NO `ease` / `easeFactor`
- NO `interval` / `intervalDays`
- NO `repetitions`
- NO `lapses`
- NO `status`

`recordGrammarAnswer()` in store.js:
```
export function recordGrammarAnswer(exerciseId, isCorrect) {
  const mastery = getGrammarMastery(exerciseId);
  mastery.correct += isCorrect ? 1 : 0;
  mastery.incorrect += isCorrect ? 0 : 1;
  mastery.mastered = mastery.correct >= 3 && (correct/total) >= 0.7;
}
```

Grammar items are marked 'mastered' after 3 correct with >=70% accuracy.
There is no forgetting curve, no spaced repetition, no review scheduling.

## But grammar mistakes DO create SM-2 flashcards (partial salvage)

When grammar is answered wrong with skill='grammar' in recordAnswer(),
it creates a `vocabularyMastery` entry at `mistake_A1_gr_X` with full SM-2:
- ease, interval, due, repetitions, mastered
- These appear in the daily flashcard queue as due review

So grammar review is partially scheduled via the flashcard system, but
ONLY for mistakes. Correct grammar answers never schedule review.
Grammar items due for review do NOT appear in the grammar practice mission.

=============================================================================
7. WHETHER READING/LISTENING CAN BE REVISITED
=============================================================================

## Current state: Limited revisit support

### Reading/Listening completed tracking
- completeReading(level, exerciseId) adds to readingCompleted[level] array
- completeListening(level, exerciseId) adds to listeningCompleted[level] array
- These are simple string arrays — no due dates, no intervals

### What blocks revisit in DailyMissionPage
```
const completed = new Set((s.listeningCompleted?.[level] || []).map(x => ...));
let items = listeningData.filter(item => !completed.has(item.id) && ...);
```

Once completed, an item is filtered OUT of today's plan permanently.
There is no revisit mechanism in the code.

### practiceProgress.js does add due dates (but applies to ALL skills)
```
recordPracticeAttempt(skill, itemId, result):
  - correct → dueDate = 14 days from now
  - incorrect → dueDate = 1 day from now
```

The DailyMissionPage checks `practiceProgress_v1` data:
- completed_correct/mastered items are excluded (flagged as done)
- completed_incorrect items with future dueDate are also excluded
- completed_incorrect items with past dueDate ARE included (revisit by default!)

So incorrect items get 1-day cooldown before they reappear.
Correct items get 14-day cooldown — but only via practiceProgress_v1,
NOT via readingCompleted/listeningCompleted.

### The gap
- Correct items are excluded by BOTH completed lists and practiceProgress
- There is NO "weak vocab → revisit this reading" logic
- There is NO "enough time passed (2-3 weeks) → allow review"
- There is NO explicit "mark for review" flag on items
- Items completed on standalone ReadingPage (by index) vs DailyMissionPage
  (by item.id) use different key formats, making practiceProgress lookups
  unreliable

=============================================================================
8. WHETHER WRITING/SPEAKING ARE MANDATORY OR OPTIONAL
=============================================================================

## Current: OPTIONAL (silently skipped)

### For short plans (<60 min daily)
- writing: 0 items (omitted from missions)
- speaking: 0 items (omitted from missions)

### For medium plans (60-89 min)
- writing: 1 item
- speaking: 0 items

### For long plans (90+ min)
- writing: 1 item
- speaking: 1 item

### Even when present
- Writing and speaking missions have a "Skip" button
- No level-based requirement (A1 user gets same writing as B2)
- No consequence for skipping

### What's needed
- At B1+: writing/speaking should be mandatory unless no items exist
- At B2+: writing should appear even in shorter plans
- The plan should show why an item is skipped ("No writing tasks available")
  instead of silently omitting it

=============================================================================
9. WHETHER ITEMS ARE GROUPED BY LESSON/TOPIC
=============================================================================

## Partial topic linking exists but is weak

### Grammar selection has some topic awareness
The grammar selection useEffect does:
1. Find items from today's completed lessons (topicPreferred)
2. Fill remaining from review pool
3. Label the mission with today's lesson titles

This is the ONLY topic-aware selection in the codebase.

### What's NOT grouped
- Vocabulary quiz items: shuffled randomly from the full level word list
- Reading exercises: selected by difficulty, NOT by topic
- Listening exercises: selected by difficulty, NOT by topic
- Writing prompts: selected by availability, NOT by topic
- Speaking prompts: selected by availability, NOT by topic
- Flashcards: from full vocabularyMastery due queue, NOT by topic

Each skill picks independently. There is no "today's theme" orchestrating
coherent vocabulary, reading, listening, and speaking around one topic.

=============================================================================
10. ACTIVE/PASSIVE BALANCE
=============================================================================

## No level-based weighting exists

The current TIME_BUDGET is uniform across all levels:
```
lesson:     25%
grammar:    20%
flashcard:  20%
reading:    15%
listening:  12%
writing:     8%  ← LOW
speaking:    0%  ← NOT IN BUDGET
```

"Speaking" is not even in TIME_BUDGET — it's only added separately in
buildAdaptiveTargets for long plans or FSP track.

Active skills (writing + speaking + FSP) receive at most:
- 60 min plan: writing 8% = 4.8 min → ~1 item, speaking = 0
- 90 min plan: writing 8% = 7.2 min → ~1 item, speaking = added separately
- 120 min plan: same cap

A B2 or C1 learner should be spending 40-60% on active production, but
the plan allocates at most ~15% even at maximum daily minutes.

=============================================================================
11. FINISH DATE CALCULATION
=============================================================================

## getGoalEstimate() in adaptivePlan.js

The finish date is purely minutes-based:
```
minutesRemaining =
  remaining.lesson * 10 +
  remaining.grammar * 5 +
  remaining.vocabulary * 5 +
  remaining.reading * 12 +
  remaining.listening * 12 +
  remaining.writing * 18 +
  remaining.speaking * 15 +
  dueFlashcards * 1 +
  mistakeBacklog * 3

predictedFinishDate = today + ceil(minutesRemaining / dailyMinutes)
```

No adjustments for:
- User accuracy (high accuracy → faster progress)
- Mistake density (many mistakes → slower)
- Overdue reviews (backlog slows progress)
- Active vs passive difficulty (writing takes longer than flashcards)

=============================================================================
12. WHAT IS MISSING (SUMMARY OF GAPS)
=============================================================================

| Feature | Status | Priority |
|---------|--------|----------|
| Grammar SM-2 scheduling | ❌ Missing — simple counter only | HIGH |
| Weak-area injection into mission counts | ❌ Missing — remediation only | HIGH |
| Topic-grouped daily sessions | ❌ Missing (partial grammar only) | HIGH |
| Level-based active/passive weighting | ❌ Missing — uniform 8% writing | HIGH |
| Writing/speaking mandatory at high levels | ❌ Missing — always optional | MEDIUM |
| Reading/listening revisit logic | ⚠️ Incomplete — 14-day lock only | MEDIUM |
| Reason for skipped missions | ❌ Missing — silently omitted | LOW |
| Finish date from user performance | ❌ Missing — pure minutes | LOW |

=============================================================================
13. NEXT STEPS
=============================================================================

Based on the audit findings, the following implementation is planned:

1. Add SM-2 scheduling to grammarMastery (dueAt, easeFactor, intervalDays,
   repetitions, lapses, status)
   - Extend recordGrammarAnswer to schedule review
   - Due grammar review items appear BEFORE new grammar practice
   - Not-due grammar review items are excluded

2. Add weak-area injection into mission plan generation
   - Read topicWeakness, repeatedMistakes, incorrectAnswers by skill
   - Increase grammar/vocab count for weak topics
   - Add more listening/reading for weak comprehension scores
   - More speaking for weak FSP anamnesis

3. Add topic-grouped daily sessions
   - Pick one main lesson/topic for the day
   - Filter vocabulary, reading, listening, writing, speaking by that topic
   - Fallback to general pool when topic has no items

4. Implement level-based active/passive weighting
   - A1-A2: 70/30 passive/active
   - B1: 55/45
   - B2-C1: 40/60
   - FSP: 25/75

5. Add reading/listening revisit with due metadata
   - 14-day cooldown after correct completion
   - 1-day after incorrect
   - Allow revisit when related vocab is weak
   - Add due/revisit tracking metadata

6. Optionally improve finish date with performance factors
   - Accuracy adjustment
   - Overdue review backlog
   - Deferred if too complex

7. Add tests for each change
