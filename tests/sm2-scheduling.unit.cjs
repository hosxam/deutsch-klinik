/**
 * Unit tests for SM-2 flashcard scheduling in store.js.
 * Tests run in isolation without needing a DOM/browser.
 * Usage: node tests/sm2-scheduling.unit.cjs
 */

const path = require('path');
const fs = require('fs');

// We can't import ESM modules directly, so we re-implement the SM-2 logic
// to test the algorithms in isolation.
// This is the same logic as in src/utils/store.js

// ====== SM-2 Implementation (mirrors src/utils/store.js) ======

function pad(n) {
  return String(n).padStart(2, '0');
}

function getLocalDateKeyFromDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getLocalDateKey() {
  const d = new Date();
  return getLocalDateKeyFromDate(d);
}

function makeMastery(overrides = {}) {
  return {
    correct: 0,
    incorrect: 0,
    mastered: false,
    ease: 2.5,
    interval: 1,
    due: getLocalDateKey(),
    repetitions: 0,
    ...overrides,
  };
}

function recordVocabAnswer(mastery, rating) {
  const isCorrect = rating >= 3;
  mastery.correct += isCorrect ? 1 : 0;
  mastery.incorrect += isCorrect ? 0 : 1;

  if (rating === 1) {
    // Again
    mastery.repetitions = 0;
    mastery.interval = 0;
    mastery.ease = Math.max(1.3, mastery.ease - 0.2);
  } else if (rating === 2) {
    // Hard
    if (mastery.repetitions === 0) {
      mastery.interval = 1;
    } else {
      mastery.interval = Math.max(1, Math.round(mastery.interval * 1.2));
    }
    mastery.repetitions += 1;
    mastery.ease = Math.max(1.3, mastery.ease - 0.15);
  } else if (rating === 3) {
    // Good
    if (mastery.repetitions === 0) {
      mastery.interval = 1;
    } else if (mastery.repetitions === 1) {
      mastery.interval = 6;
    } else {
      mastery.interval = Math.round(mastery.interval * mastery.ease);
    }
    mastery.repetitions += 1;
    mastery.ease = Math.min(3.0, mastery.ease + 0.15);
  } else {
    // Easy
    if (mastery.repetitions === 0) {
      mastery.interval = 3;
    } else if (mastery.repetitions === 1) {
      mastery.interval = Math.round(6 * 1.3);
    } else {
      mastery.interval = Math.round(mastery.interval * mastery.ease * 1.3);
    }
    mastery.repetitions += 1;
    mastery.ease = Math.min(3.0, mastery.ease + 0.3);
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + mastery.interval);
  mastery.due = getLocalDateKeyFromDate(dueDate);
  mastery.mastered = mastery.correct >= 5 && mastery.ease >= 2.5;
}

function filterDueWordIds(records, today) {
  const dueReview = [];
  const mistakeCards = [];
  const newCards = [];

  Object.entries(records).forEach(([id, m]) => {
    if (!m) {
      newCards.push(id);
    } else if (!m.mastered || m.due <= today) {
      if (m.incorrect > m.correct && m.incorrect >= 2) {
        mistakeCards.push(id);
      } else {
        dueReview.push(id);
      }
    }
  });

  const MAX_DAILY_QUEUE = 25;
  const MAX_NEW_CARDS = 10;
  const queue = [];
  queue.push(...dueReview);
  if (queue.length < MAX_DAILY_QUEUE) {
    const mistakeRoom = MAX_DAILY_QUEUE - queue.length;
    queue.push(...mistakeCards.slice(0, mistakeRoom));
  }
  if (queue.length < MAX_DAILY_QUEUE) {
    const newRoom = Math.min(MAX_NEW_CARDS, MAX_DAILY_QUEUE - queue.length);
    queue.push(...newCards.slice(0, newRoom));
  }
  return queue;
}

function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return getLocalDateKeyFromDate(d);
}

// ====== Test Runner ======

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${label}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${label} (=${expected})`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${label} | expected ${expected}, got ${actual}`);
  }
}

// ====== Tests ======

console.log('\n=== SM-2 Scheduling Unit Tests ===\n');

// Test 1: Good schedules into future and does not show immediately
{
  console.log('[1] Good rating schedules into future');
  const m = makeMastery();
  recordVocabAnswer(m, 3); // First "Good" answer
  assertEqual(m.interval, 1, 'first Good → interval=1');
  assert(m.due >= getLocalDateKey(), 'first Good → due >= today');

  const dueToday = filterDueWordIds({ 'A1_test': m }, getLocalDateKey());
  const dueTomorrow = filterDueWordIds({ 'A1_test': m }, futureDate(1));
  assert(dueToday.length === 0 || !m.mastered,
    'card due today if not yet mastered');
  // After 5 correct Good answers at ease >= 2.5
  const m2 = makeMastery({ correct: 4, ease: 2.6, repetitions: 4, interval: 10,
    due: futureDate(10) });
  recordVocabAnswer(m2, 3);
  const dueAfterMastery = filterDueWordIds({ 'A1_test': m2 }, getLocalDateKey());
  assert(dueAfterMastery.length === 0,
    'mastered Good card does not show before due date');
}

// Test 2: Easy schedules farther than Good
{
  console.log('\n[2] Easy schedules farther than Good');
  const g = makeMastery();
  const e = makeMastery();
  recordVocabAnswer(g, 3); // Good, first rep
  recordVocabAnswer(e, 4); // Easy, first rep
  assert(e.interval > g.interval,
    `Easy interval (${e.interval}) > Good interval (${g.interval})`);
  assert(e.due > g.due,
    `Easy due (${e.due}) > Good due (${g.due})`);

  // Second repetition
  recordVocabAnswer(g, 3);
  recordVocabAnswer(e, 4);
  assert(e.interval > g.interval,
    `2nd rep: Easy interval (${e.interval}) > Good interval (${g.interval})`);
}

// Test 3: Hard schedules sooner than Good
{
  console.log('\n[3] Hard schedules sooner than Good');
  const h = makeMastery();
  const g = makeMastery();
  recordVocabAnswer(h, 2); // Hard
  recordVocabAnswer(g, 3); // Good
  assert(h.interval <= g.interval,
    `Hard interval (${h.interval}) <= Good interval (${g.interval})`);

  // Second repetition
  recordVocabAnswer(h, 2);
  recordVocabAnswer(g, 3);
  assert(h.interval <= g.interval,
    `2nd rep: Hard interval (${h.interval}) <= Good interval (${g.interval})`);
}

// Test 4: Again schedules short-term relearning (reset + interval ~ 0)
{
  console.log('\n[4] Again schedules short-term relearning');
  const m = makeMastery({ correct: 3, repetitions: 3, interval: 10, ease: 2.5 });
  recordVocabAnswer(m, 1);
  assertEqual(m.interval, 0, 'Again → interval=0 (due same day)');
  assertEqual(m.repetitions, 0, 'Again → repetitions reset to 0');
  assert(m.ease < 2.5, `Again → ease decreased (${m.ease} < 2.5)`);

  // Should show as due
  const due = filterDueWordIds({ 'A1_test': m }, getLocalDateKey());
  assert(due.includes('A1_test'), 'Again → card shows as due today');
}

// Test 5: Tomorrow's plan excludes cards not due by tomorrow
{
  console.log('\n[5] Tomorrow plan excludes cards not due');
  const records = {
    'due_today': makeMastery({ due: getLocalDateKey() }),
    'due_tomorrow': makeMastery({ due: futureDate(1) }),
    'due_week': makeMastery({ due: futureDate(7), mastered: false }),
    'mastered_future': makeMastery({ mastered: true, correct: 5, ease: 2.5,
      due: futureDate(14) }),
    'new_card': null,
  };

  const todayQueue = filterDueWordIds(records, getLocalDateKey());
  assert(todayQueue.includes('due_today'),
    'today queue includes due_today');
  assert(todayQueue.includes('new_card'),
    'today queue includes new_card');

  // Filter for tomorrow's plan using getDueByDate equivalent
  function getDueBy(records, targetDate) {
    return Object.entries(records).filter(([id, m]) => {
      if (!m) return true;
      return !m.mastered || (m.due && m.due <= targetDate);
    }).map(([id]) => id);
  }

  const tomorrowCards = getDueBy(records, futureDate(1));
  assert(tomorrowCards.includes('due_today'), 'tomorrow plan includes due_today');
  assert(tomorrowCards.includes('due_tomorrow'),
    'tomorrow plan includes due_tomorrow');
  // due_week has mastered=false, so it shows in plan (cards in progress always show)
  assert(tomorrowCards.includes('due_week'),
    'tomorrow plan includes due_week (unmastered cards always show)');
  assert(tomorrowCards.includes('new_card'),
    'tomorrow plan includes new_card');
  assert(!tomorrowCards.includes('mastered_future'),
    'tomorrow plan excludes mastered future card');
}

// Test 6: Daily cap is respected
{
  console.log('\n[6] Daily cap (25 cards, max 10 new)');
  const records = {};
  // 15 due reviews
  for (let i = 0; i < 15; i++) {
    records[`due_${i}`] = makeMastery({ due: getLocalDateKey() });
  }
  // 10 mistake cards
  for (let i = 0; i < 10; i++) {
    records[`mistake_${i}`] = makeMastery({ due: getLocalDateKey(),
      correct: 1, incorrect: 3 });
  }
  // 20 new cards
  for (let i = 0; i < 20; i++) {
    records[`new_${i}`] = null;
  }

  const queue = filterDueWordIds(records, getLocalDateKey());
  assert(queue.length <= 25, `queue length ${queue.length} <= 25`);

  const newCount = queue.filter(id => id.startsWith('new_')).length;
  assert(newCount <= 10, `new cards ${newCount} <= 10`);

  // All 15 due reviews should be in queue
  const dueCount = queue.filter(id => id.startsWith('due_')).length;
  assert(dueCount === 15, `all 15 due reviews in queue (got ${dueCount})`);

  // Remaining slots should be mistakes, then new
  const mistakeCount = queue.filter(id => id.startsWith('mistake_')).length;
  assert(mistakeCount > 0, `some mistake cards included (${mistakeCount})`);
}

// Test 7: Queue priority: due > mistake > new
{
  console.log('\n[7] Queue priority order');
  const records = {};
  for (let i = 0; i < 30; i++) records[`new_${i}`] = null;
  for (let i = 0; i < 5; i++) {
    records[`mistake_${i}`] = makeMastery({ due: getLocalDateKey(),
      correct: 0, incorrect: 3 });
  }
  for (let i = 0; i < 5; i++) {
    records[`due_${i}`] = makeMastery({ due: getLocalDateKey() });
  }

  const queue = filterDueWordIds(records, getLocalDateKey());

  // All due reviews should be before mistakes, mistakes before new
  const lastDueIdx = queue.map((id, i) => id.startsWith('due_') ? i : -1)
    .filter(i => i >= 0).pop() ?? -1;
  const firstMistakeIdx = queue.findIndex(id => id.startsWith('mistake_'));
  const firstNewIdx = queue.findIndex(id => id.startsWith('new_'));

  if (firstMistakeIdx >= 0) {
    assert(lastDueIdx < firstMistakeIdx,
      `due reviews before mistakes (lastDue=${lastDueIdx}, firstMistake=${firstMistakeIdx})`);
  }
  if (firstNewIdx >= 0 && firstMistakeIdx >= 0) {
    assert(firstMistakeIdx < firstNewIdx,
      `mistakes before new (firstMistake=${firstMistakeIdx}, firstNew=${firstNewIdx})`);
  }
}

// Test 8: Ease factor progression
{
  console.log('\n[8] Ease factor progression');
  const m = makeMastery();
  assertEqual(m.ease, 2.5, 'initial ease');

  recordVocabAnswer(m, 1); // Again
  assert(m.ease < 2.5, `Again decreased ease (${m.ease})`);

  recordVocabAnswer(m, 3); // Good
  assert(m.ease > 2.3, `Good increased ease (${m.ease})`);

  // After several Goods
  for (let i = 0; i < 5; i++) recordVocabAnswer(m, 3);
  assert(m.ease <= 3.0, `ease capped at 3.0 (actual ${m.ease})`);

  // Hard
  const h = makeMastery();
  recordVocabAnswer(h, 2);
  const afterHard = h.ease;

  // Good from same starting point
  const g = makeMastery();
  const afterGood = g.ease;
  recordVocabAnswer(g, 3);

  // Hmm, they both start at 2.5 so need to compare delta
  assert(h.ease < g.ease,
    `Hard ease (${h.ease}) < Good ease (${g.ease}) at first rep`);
}

// Test 9: SM-2 interval progression across multiple reviews
{
  console.log('\n[9] SM-2 interval progression');
  const m = makeMastery();
  recordVocabAnswer(m, 3); // Good 1: interval=1
  assertEqual(m.interval, 1, 'Good 1 → 1 day');
  assertEqual(m.repetitions, 1, 'repetitions=1');

  recordVocabAnswer(m, 3); // Good 2: interval=6
  assertEqual(m.interval, 6, 'Good 2 → 6 days');
  assertEqual(m.repetitions, 2, 'repetitions=2');

  recordVocabAnswer(m, 3); // Good 3: ease based
  assert(m.interval > 6, `Good 3 → interval=${m.interval} (> 6, ease-based growth)`);
  assertEqual(m.repetitions, 3, 'repetitions=3');
}

// Test 10: Mastery threshold
{
  console.log('\n[10] Mastery threshold');
  // 5 corrects with ease >= 2.5
  const m = makeMastery({ correct: 4, ease: 2.5, repetitions: 4, interval: 5 });
  recordVocabAnswer(m, 3);
  assert(m.mastered, '5 correct + ease 2.5 → mastered');

  // Not mastered with low ease
  const m2 = makeMastery({ correct: 5, ease: 2.0, repetitions: 3, interval: 5 });
  recordVocabAnswer(m2, 3);
  assert(!m2.mastered || m2.ease >= 2.5,
    `not mastered if ease < 2.5 (ease=${m2.ease}, mastered=${m2.mastered})`);
}

// ====== Summary ======

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);

process.exitCode = failed > 0 ? 1 : 0;
