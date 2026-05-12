# Phase 36B - Topic Grouping Audit

## 1. How Today's Lesson/Topic is Selected

- The system uses `buildDailyPlan()` to produce targets per skill.
- `DailyMissionPage.jsx` creates missions from `buildMissions()` which includes lesson missions.
- Lesson missions have a `nextLesson` field with the lesson ID.
- The session stores `planLessonIds` - an array of lesson IDs from the mission plan.
- `getPracticeContext()` computes `todayLessonIds` by filtering `planLessonIds` against completed lessons.
- So the "topic" for today is determined by which lesson(s) are queued in today's plan.

### Topic Spread Across Skills

Each skill uses `todayLessonIds` (from `context.todayLessonIds`) to prefer items matching the same lesson.

---

## 2. Topic Matching By Skill

### Vocabulary
- **Where:** `useEffect` for `cm.type === 'vocabulary'`
- **Topic matching:** `introduced.filter(x => context.todayLessonIds.includes(getWordLessonId(x)))` extracts items whose `taughtInLessonId`/`lessonId` matches today's lessons.
- **Ordering:** today-topic words first, then shuffled general review words.
- **Filter strength:** Soft preference. If topic-matched words exist, they go first. Then general pool fills remaining.
- **Fallback:** If no topic-matched words exist (and no review words), shows empty state.
- **Completed filtering:** Done via `ppDone` (completed_correct/mastered) and state progress.

### Grammar
- **Where:** `useEffect` for `cm.type === 'grammar'`
- **Topic matching:** `unmastered.filter(x => context.todayLessonIds.includes(getQuestionLessonId(x)))` gets topic-preferred items.
- **Priority order:** 1) due review (capped at 5), 2) topic-preferred, 3) general pool.
- **Filter strength:** Soft preference. Topic items fill remaining slots after due items.
- **Fallback:** General pool after topic items exhausted.
- **Completed filtering:** Via `ppDone` (completed_correct/mastered), `ppNotDue` (incorrect but future due), and state progress.

### Flashcards
- **Where:** Inline render block for `cm.type === 'flashcards'`
- **Topic matching:** NONE. Uses `getDueVocabWords()` to get SRS-due items and selects the first N.
- **Filter strength:** No topic grouping at all. This is a gap.
- **Fallback:** N/A (uses SRS queue).
- **Completed filtering:** Via `getDueVocabWords()` which checks vocabulary mastery/due dates.
- ⚠️ **Gap identified:** Flashcards do NOT prefer items from today's lesson topic.

### Reading
- **Where:** `getNextReading()` function (render-computed)
- **Topic matching:** `preferTopicItems(items, sesh, level)` filters items whose `lessonId` matches `todayLessonIds`.
- **Filter strength:** **Hard preference.** The result of `preferTopicItems` replaces the entire item pool. If topic-matched items exist, only those are considered.
- **Fallback:** If `preferTopicItems` returns empty (no matches), the original items are used.
- **Completed filtering:** Via `completed` set (state), `ppCompleted` (practiceProgress), `ppNotDue` (incorrect/future due).
- **Revisit logic:** If no new items available, checks practiceProgress for due revisits (incorrect or old completed past 14-day cooldown).

### Listening
- **Where:** `getNextListening()` function (render-computed)
- **Topic matching:** `preferTopicItems(items, sesh, level)` - same as reading.
- **Filter strength:** Hard preference (same as reading).
- **Fallback:** Same as reading.
- **Completed filtering:** Same as reading.
- **Revisit logic:** Same as reading.

### Writing
- **Where:** `getNextWriting()` function (render-computed)
- **Topic matching:** Inline filter: `item.lessonId || ...` matched against `sesh.planLessonIds`.
- **Filter strength:** Hard preference. If topic-matched items exist, `data` is replaced entirely.
- **Fallback:** Falls back to `data[0]` which may be topic-matched or not.
- **Completed filtering:** Via `completed` (state), `ppCompleted`, `ppNotDue`.
- **Revisit logic:** NONE. No revisit mechanism for writing.
- ⚠️ **Gap identified:** Writing has no revisit logic.

### Speaking
- **Where:** `getNextSpeaking()` function (render-computed)
- **Topic matching:** Same inline filter as writing.
- **Filter strength:** Hard preference (same as writing).
- **Fallback:** Same as writing.
- **Completed filtering:** Same as writing.
- **Revisit logic:** NONE. No revisit mechanism for speaking.
- ⚠️ **Gap identified:** Speaking has no revisit logic.

---

## 3. Topic Matching: Hard Requirement vs Soft Preference

| Skill | Topic Match Type | Notes |
|-------|-----------------|-------|
| Vocabulary | Soft preference | Topic words first, then general pool fills remaining slots |
| Grammar | Soft preference | Due review > topic > general |
| Flashcards | **None** | No topic consideration |
| Reading | Hard preference | Pool replaced entirely if matches found |
| Listening | Hard preference | Pool replaced entirely if matches found |
| Writing | Hard preference | Pool replaced entirely if matches found |
| Speaking | Hard preference | Pool replaced entirely if matches found |

---

## 4. Fallback Behavior

When topic-matched items are unavailable for a skill:

- **Vocabulary:** Falls back to review words (shuffled, capped).
- **Grammar:** Falls back to general unmastered pool.
- **Flashcards:** No topic matching, always falls back to SRS queue.
- **Reading:** Falls back to original items (without topic filter).
- **Listening:** Falls back to original items (without topic filter).
- **Writing:** Falls back to first item in data (with topic preference or without).
- **Speaking:** Falls back to first item in data (with topic preference or without).

---

## 5. Metadata Gaps

### Current metadata available
- All reading/listening/writing/speaking items have `lessonId` fields.
- Grammar/vocabulary items have `taughtInLessonId` fields.
- Curriculum map units have `linkedLessonIds`, `topic`, `conceptId`.
- German lessons (germanLessons.json) have `conceptId`, `conceptsTaught`.

### Gaps preventing better grouping
1. **Flashcards have no topic filtering at all.**
   - `getDueVocabWords()` returns SRS-due vocabulary items regardless of today's topic.
   - No `context.todayLessonIds` consideration in flashcard selection.
2. **`preferTopicItems` uses fragile string matching.**
   - `item.lessonId.includes(tid)` can match partially (e.g., "A1_lesson_1" matches "A1_lesson_16").
   - Fallback to `item.id.includes(tid)` is even more fragile.
3. **No concept-level topic coherence.**
   - While `getLessonConceptIds()` exists, it's only used for `planConceptIds`, not for matching reading/listening/writing/speaking items to concepts.
4. **Writing and speaking have no revisit/forgetting-curve logic.**
   - Reading and listening have due-date-driven revisit logic.
   - Writing and speaking only filter by completion status, never return old items for review.
5. **No topic coherence scoring/visibility.**
   - The plan doesn't report which items were topic-matched vs fallback.
   - No way to measure "how coherent" today's plan actually is.

---

## 6. Reading/Listening Revisit Logic Audit

### Current behavior
- `recordPracticeAttempt()` sets `dueDate` to +14 days for correct, +1 day for incorrect.
- `getNextReading()` / `getNextListening()` check `practiceProgressData` for due items:
  - **Incorrect items:** Reappear when `dueDate <= today` and `!revisitDone`.
  - **Old correct items:** Reappear when `dueDate <= today` (14+ days cooldown) and `!revisitDone`.
- These revisits only trigger when no new items are available.
- The revisit items are NOT topic-grouped.

### Issues with current revisit logic
1. **Revisit is last resort.** Only kicks in when `items.length === 0`.
2. **`revisitDone` flag is never actually set to `true`.** The code checks `!v.revisitDone` but never records `revisitDone: true` on the practiceProgress entry. So items could repeat endlessly.
3. **Writing/speaking have NO revisit logic.** They only check `completed` state and `ppCompleted/ppNotDue`. No mechanism for old items to return.
4. **No weak-topic trigger.** Items don't resurface based on weak vocabulary or grammar concepts.
5. **No limit on revisits.** If revisit items exist, they can appear every day (due to the `revisitDone` bug).
6. **Cooldown only, no SM-2.** 14-day fixed cooldown means correct items always wait exactly 14 days regardless of difficulty.

---

## Audit Summary

### Current strength: MODERATE
- Topic grouping exists for most skills (vocabulary, grammar, reading, listening, writing, speaking).
- Reading/listening have basic revisit logic with due dates.
- Data schema (lessonId/taughtInLessonId) supports topic matching.

### Gaps to fix
1. Flashcards need topic-aware selection.
2. Writing/speaking need revisit logic (even simple cooldown).
3. `revisitDone` flag bug prevents revisit limiting.
4. Topic coherence scoring/visibility.
5. Reading/listening revisit should also prefer topic-matched revisits.
6. Writing/speaking topic matching uses fragile string matching (not `getPracticeContext`).
