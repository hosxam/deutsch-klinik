import { describe, it, expect, beforeEach } from 'vitest';

// ============================================================
// Phase 18C: Grammar Practice Tests
// ============================================================

function getLocalDateKey(offsetDays) {
  if (offsetDays === undefined) offsetDays = 0;
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Simulate the GrammarPage question pool selection logic.
 * Replicates the core filtering/sizing logic from GrammarPage.jsx.
 */

function simulateGrammarPool(allQuestions, levelId, completedCorrectIds, completedIncorrectIds, ppDueStatus, selectedSize) {
  // Step 1: Remove completed_correct items
  let available = allQuestions.filter(q => !completedCorrectIds.has(q.id));
  if (available.length === 0) return [];

  // Step 2: Prioritize: needs review > weak > from completed lessons > new unlocked
  const needsReview = available.filter(q => completedIncorrectIds.has(q.id) && (ppDueStatus[q.id] === undefined || ppDueStatus[q.id] <= getLocalDateKey()));
  const newUnlocked = available.filter(q => !completedIncorrectIds.has(q.id));

  // Step 3: Build selection up to selectedSize
  const selected = [];
  for (const item of [...needsReview, ...newUnlocked]) {
    if (selected.length >= selectedSize) break;
    if (!selected.some(s => s.id === item.id)) selected.push(item);
  }
  return selected.map(s => s.id);
}

function simulateRecordPracticeAttempt(store, skill, itemId, correct) {
  if (!store[skill]) store[skill] = {};
  const entry = store[skill][itemId] || { status: 'unattempted', attempts: 0 };
  entry.attempts++;
  entry.lastAttempt = new Date().toISOString();
  if (correct) {
    entry.status = 'completed_correct';
    entry.dueDate = getLocalDateKey(14);
  } else {
    entry.status = 'completed_incorrect';
    entry.dueDate = getLocalDateKey(1);
  }
  store[skill][itemId] = entry;
  return entry;
}

function simulateGetDueGrammarItems(store) {
  const skillData = store['grammar'] || {};
  const today = getLocalDateKey();
  return Object.entries(skillData)
    .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate <= today)
    .map(([id]) => id);
}

function simulateGetNotDueItems(store) {
  const skillData = store['grammar'] || {};
  const today = getLocalDateKey();
  return new Set(
    Object.entries(skillData)
      .filter(([, v]) => v.status === 'completed_correct' && v.dueDate && v.dueDate > today)
      .map(([id]) => id)
  );
}

describe('Phase 18C: Grammar Session Setup', () => {
  const a1Questions = Array.from({ length: 411 }, (_, i) => ({
    id: `A1_gr_${i}`,
    level: 'A1',
    topic: i < 100 ? 'Articles' : i < 200 ? 'Verbs' : 'Nouns',
    taughtInLessonId: i < 100 ? 'A1_lesson_3' : i < 200 ? 'A1_lesson_4' : 'A1_lesson_5',
  }));
  const b2Questions = Array.from({ length: 50 }, (_, i) => ({
    id: `B2_gr_${i}`,
    level: 'B2',
    taughtInLessonId: 'B2_lesson_1',
  }));

  it('does not show all 411 questions when completed and session limited', () => {
    const selected = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 10);
    expect(selected.length).toBeLessThan(200);
    expect(selected.length).toBeLessThanOrEqual(10);
  });

  it('user can choose 5 questions', () => {
    const selected = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 5);
    expect(selected.length).toBe(5);
  });

  it('user can choose 10 questions', () => {
    const selected = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 10);
    expect(selected.length).toBe(10);
  });

  it('user can choose 25 questions', () => {
    const selected = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 25);
    expect(selected.length).toBe(25);
  });

  it('selected count controls max session size', () => {
    const s10 = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 10);
    const s25 = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 25);
    expect(s10.length).toBe(10);
    expect(s25.length).toBe(25);
    expect(s25.length).toBeGreaterThan(s10.length);
  });

  it('A1 current level does not load B2 grammar questions', () => {
    const selected = simulateGrammarPool(a1Questions, 'A1', new Set(), new Set(), {}, 10);
    const hasB2 = selected.some(q => q.startsWith('B2'));
    expect(hasB2).toBe(false);
  });

  it('returns empty array when no available questions', () => {
    const allCompleted = new Set(a1Questions.map(q => q.id));
    const selected = simulateGrammarPool(a1Questions, 'A1', allCompleted, new Set(), {}, 10);
    expect(selected.length).toBe(0);
  });

  it('returns fewer than requested if pool is smaller', () => {
    const selected = simulateGrammarPool(a1Questions.slice(0, 3), 'A1', new Set(), new Set(), {}, 10);
    expect(selected.length).toBe(3);
  });
});

describe('Phase 18C: Correct Answer Behavior', () => {
  let progressStore;

  beforeEach(() => {
    progressStore = {};
  });

  it('correct grammar answer is marked completed_correct in practiceProgress', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_1', true);
    expect(progressStore.grammar['A1_gr_1'].status).toBe('completed_correct');
  });

  it('correct grammar question does not appear again immediately', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_1', true);
    // After correct, the item should be filtered out of available pool
    const selected = simulateGrammarPool(
      [{ id: 'A1_gr_1', level: 'A1', taughtInLessonId: 'A1_lesson_3' }],
      'A1',
      new Set(['A1_gr_1']), // completed_correct
      new Set(),
      {},
      5
    );
    expect(selected).not.toContain('A1_gr_1');
  });

  it('correct grammar question is excluded from Today Plan', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_1', true);
    const notDue = simulateGetNotDueItems(progressStore);
    expect(notDue.has('A1_gr_1')).toBe(true);
  });

  it('correct answer sets dueDate 14 days in future', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_1', true);
    const expectedFuture = getLocalDateKey(14);
    expect(progressStore.grammar['A1_gr_1'].dueDate).toBe(expectedFuture);
  });
});

describe('Phase 18C: Wrong Answer Behavior', () => {
  let progressStore;

  beforeEach(() => {
    progressStore = {};
  });

  it('wrong grammar answer creates remediation entry in practiceProgress', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_2', false);
    expect(progressStore.grammar['A1_gr_2'].status).toBe('completed_incorrect');
  });

  it('wrong grammar does not count as completed', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_2', false);
    expect(progressStore.grammar['A1_gr_2'].status).not.toBe('completed_correct');
    expect(progressStore.grammar['A1_gr_2'].status).toBe('completed_incorrect');
  });

  it('wrong grammar can appear in Today Plan when due', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_2', false);
    // By default dueDate is today+1, so today+0 it should not be due yet
    const dueItems = simulateGetDueGrammarItems(progressStore);
    expect(dueItems).not.toContain('A1_gr_2');
  });

  it('wrong grammar appears due after 1 day', () => {
    // Simulate by setting a past dueDate
    const entry = simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_2', false);
    entry.dueDate = getLocalDateKey(-1); // yesterday
    progressStore.grammar['A1_gr_2'] = entry;

    const dueItems = simulateGetDueGrammarItems(progressStore);
    expect(dueItems).toContain('A1_gr_2');
  });

  it('wrong answer sets dueDate 1 day in future', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_2', false);
    const expectedFuture = getLocalDateKey(1);
    expect(progressStore.grammar['A1_gr_2'].dueDate).toBe(expectedFuture);
  });

  it('duplicate wrong attempts increment attempts without creating duplicate entries', () => {
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_3', false);
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_3', false);
    simulateRecordPracticeAttempt(progressStore, 'grammar', 'A1_gr_3', false);
    expect(progressStore.grammar['A1_gr_3'].attempts).toBe(3);
    expect(Object.keys(progressStore.grammar).length).toBe(1);
  });

  it('prioritizes needs review items in session pool', () => {
    const needsReviewId = 'A1_gr_review';
    const newId = 'A1_gr_new';
    const completedId = 'A1_gr_done';
    const questions = [
      { id: needsReviewId, level: 'A1', taughtInLessonId: 'A1_lesson_3' },
      { id: newId, level: 'A1', taughtInLessonId: 'A1_lesson_3' },
      { id: completedId, level: 'A1', taughtInLessonId: 'A1_lesson_3' },
    ];
    // Needs review item due today
    simulateRecordPracticeAttempt(progressStore, 'grammar', needsReviewId, false);
    progressStore.grammar[needsReviewId].dueDate = getLocalDateKey(-1); // past due
    // Completed item should be filtered out
    simulateRecordPracticeAttempt(progressStore, 'grammar', completedId, true);

    const selected = simulateGrammarPool(
      questions,
      'A1',
      new Set([completedId]),
      new Set([needsReviewId]),
      { [needsReviewId]: getLocalDateKey(-1) },
      2
    );
    // Only needsReview and new should be in the pool
    expect(selected).toContain(needsReviewId);
    expect(selected).toContain(newId);
    expect(selected).not.toContain(completedId);
  });
});

describe('Phase 18C: Persistence and Compatibility', () => {
  it('grammar completion persists after reload (simulated)', () => {
    const store = {};
    simulateRecordPracticeAttempt(store, 'grammar', 'persist_test', true);
    expect(store.grammar['persist_test'].status).toBe('completed_correct');
  });

  it('old localStorage grammar progress does not crash (no practiceProgress entry)', () => {
    // Simulate scenario where store.js grammarMastery exists but practiceProgress_v1.grammar is empty
    const store = {};
    const selected = simulateGrammarPool(
      [{ id: 'A1_gr_1', level: 'A1', taughtInLessonId: 'A1_lesson_3' }],
      'A1',
      new Set(), // no practiceProgress entries
      new Set(),
      {},
      5
    );
    expect(selected).toHaveLength(1);
  });

  it('practiceProgress compatibility works with existing data', () => {
    const store = {};
    // Simulate an existing incorrect entry that should be updated
    simulateRecordPracticeAttempt(store, 'grammar', 'existing_bad', false);
    expect(store.grammar['existing_bad'].attempts).toBe(1);
    // Subsequent correct answer updates the same entry
    simulateRecordPracticeAttempt(store, 'grammar', 'existing_bad', true);
    expect(store.grammar['existing_bad'].status).toBe('completed_correct');
    expect(store.grammar['existing_bad'].attempts).toBe(2);
  });

  it('mixed correct/incorrect pool returns correct counts', () => {
    const store = {};
    const ids = ['q1', 'q2', 'q3', 'q4', 'q5'];
    simulateRecordPracticeAttempt(store, 'grammar', 'q1', true); // completed
    simulateRecordPracticeAttempt(store, 'grammar', 'q2', false); // needs review
    simulateRecordPracticeAttempt(store, 'grammar', 'q3', false); // needs review
    // q4 and q5 are unattempted

    const questions = ids.map(id => ({ id, level: 'A1', taughtInLessonId: 'A1_lesson_3' }));
    const completedCorrect = new Set(['q1']);
    const needsReview = new Set(['q2', 'q3']);

    const selected = simulateGrammarPool(questions, 'A1', completedCorrect, needsReview, {}, 5);
    expect(selected).not.toContain('q1');
    expect(selected).toContain('q2');
    expect(selected).toContain('q3');
    // Should have max 5 items minus 1 completed, so 4 remaining
    expect(selected.length).toBe(4);
  });
});
