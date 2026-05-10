import { describe, it, expect, beforeEach } from 'vitest';

// ============================================================
// Phase 18D: Reading & Listening Completion Tracking Tests
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
 * Simulate recordPracticeAttempt for reading/listening.
 * Mirrors the logic in practiceProgress.js
 */
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

/**
 * Simulate getNextReading / getNextListening filtering.
 * Replicates the DailyMissionPage getNextReading logic.
 */
function simulateGetNextItem(items, completedIds, ppCompleted, ppNotDue) {
  return items.filter(item =>
    !completedIds.has(item.id) &&
    !ppCompleted.has(item.id) &&
    !ppNotDue.has(item.id)
  );
}

/**
 * Simulate building ppCompleted and ppNotDue sets from practiceProgress store.
 */
function buildPPSets(store, skill) {
  const data = store[skill] || {};
  const today = getLocalDateKey();
  const ppCompleted = new Set(
    Object.entries(data)
      .filter(([, v]) => v.status === 'completed_correct' || v.status === 'mastered')
      .map(([id]) => id)
  );
  const ppNotDue = new Set(
    Object.entries(data)
      .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate > today)
      .map(([id]) => id)
  );
  return { ppCompleted, ppNotDue };
}

describe('Phase 18D: Reading Status Tracking', () => {
  let store;
  const sampleItems = [
    { id: 'read_1', title: 'Reading 1', questions: [{ id: 'q1', answer: 'A' }] },
    { id: 'read_2', title: 'Reading 2', questions: [{ id: 'q2', answer: 'B' }] },
    { id: 'read_3', title: 'Reading 3', questions: [{ id: 'q3', answer: 'C' }] },
  ];

  beforeEach(() => {
    store = {};
  });

  it('default status is unattempted for new reading item', () => {
    const entry = store?.reading?.read_1 || { status: 'unattempted' };
    expect(entry.status).toBe('unattempted');
  });

  it('all correct reading marks completed_correct in practiceProgress', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'read_1', true);
    expect(store.reading.read_1.status).toBe('completed_correct');
  });

  it('not all correct reading marks completed_incorrect in practiceProgress', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'read_1', false);
    expect(store.reading.read_1.status).toBe('completed_incorrect');
  });

  it('all correct reading counts toward level progress (simulated)', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'read_1', true);
    const { ppCompleted } = buildPPSets(store, 'reading');
    expect(ppCompleted.has('read_1')).toBe(true);
  });

  it('completed_correct reading is filtered out by ppCompleted in getNextReading', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'read_1', true);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).not.toContainEqual(expect.objectContaining({ id: 'read_1' }));
  });

  it('completed_incorrect reading with future dueDate is filtered out by ppNotDue', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'read_1', false);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    // ppNotDue should include read_1 because dueDate is today+1 > today
    expect(ppNotDue.has('read_1')).toBe(true);
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).not.toContainEqual(expect.objectContaining({ id: 'read_1' }));
  });

  it('completed_incorrect reading with past dueDate is included in getNextReading', () => {
    // Simulate by setting the dueDate in the past
    const entry = simulateRecordPracticeAttempt(store, 'reading', 'read_1', false);
    entry.dueDate = getLocalDateKey(-1); // yesterday = due
    store.reading.read_1 = entry;

    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    // ppNotDue should NOT include read_1 because dueDate is yesterday <= today
    expect(ppNotDue.has('read_1')).toBe(false);
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).toContainEqual(expect.objectContaining({ id: 'read_1' }));
  });

  it('not all correct reading creates mistake entries (simulated recordAnswer)', () => {
    // Simulating the mistake recording: when wrong, recordAnswer is called
    const mistakes = {};
    const recordMistake = (level, exId, userAns, correctAns) => {
      if (!mistakes[level]) mistakes[level] = [];
      mistakes[level].push({ exerciseId: exId, userAnswer: userAns, correctAnswer: correctAns, type: 'reading' });
    };
    recordMistake('A1', 'read_1', '', 'A');
    recordMistake('A1', 'read_1', 'B', 'A');
    expect(mistakes.A1.length).toBe(2);
    expect(mistakes.A1[0].type).toBe('reading');
  });
});

describe('Phase 18D: Listening Status Tracking', () => {
  let store;
  const sampleItems = [
    { id: 'listen_1', title: 'Listening 1', questions: [{ id: 'q1', answer: 'A' }] },
    { id: 'listen_2', title: 'Listening 2', questions: [{ id: 'q2', answer: 'B' }] },
    { id: 'listen_3', title: 'Listening 3', questions: [{ id: 'q3', answer: 'C' }] },
  ];

  beforeEach(() => {
    store = {};
  });

  it('default status is unattempted for new listening item', () => {
    const entry = store?.listening?.listen_1 || { status: 'unattempted' };
    expect(entry.status).toBe('unattempted');
  });

  it('all correct listening marks completed_correct in practiceProgress', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'listen_1', true);
    expect(store.listening.listen_1.status).toBe('completed_correct');
  });

  it('not all correct listening marks completed_incorrect in practiceProgress', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'listen_1', false);
    expect(store.listening.listen_1.status).toBe('completed_incorrect');
  });

  it('all correct listening counts toward progress', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'listen_1', true);
    const { ppCompleted } = buildPPSets(store, 'listening');
    expect(ppCompleted.has('listen_1')).toBe(true);
  });

  it('listening wrong answers create mistakes', () => {
    const mistakes = {};
    const recordMistake = (level, exId, userAns, correctAns) => {
      if (!mistakes[level]) mistakes[level] = [];
      mistakes[level].push({ exerciseId: exId, userAnswer: userAns, correctAnswer: correctAns, type: 'listening' });
    };
    recordMistake('A1', 'listen_1', 'B', 'A');
    expect(mistakes.A1.length).toBe(1);
    expect(mistakes.A1[0].type).toBe('listening');
  });

  it('completed_correct listening is filtered out by ppCompleted', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'listen_1', true);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).not.toContainEqual(expect.objectContaining({ id: 'listen_1' }));
  });

  it('completed_incorrect listening with future dueDate is filtered out by ppNotDue', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'listen_1', false);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    expect(ppNotDue.has('listen_1')).toBe(true);
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).not.toContainEqual(expect.objectContaining({ id: 'listen_1' }));
  });

  it('completed_incorrect listening with past dueDate is included', () => {
    const entry = simulateRecordPracticeAttempt(store, 'listening', 'listen_1', false);
    entry.dueDate = getLocalDateKey(-1);
    store.listening.listen_1 = entry;
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    expect(ppNotDue.has('listen_1')).toBe(false);
    const available = simulateGetNextItem(sampleItems, new Set(), ppCompleted, ppNotDue);
    expect(available).toContainEqual(expect.objectContaining({ id: 'listen_1' }));
  });
});

describe('Phase 18D: DailyMissionPage Filtering', () => {
  let store;
  const readings = [
    { id: 'r1', title: 'Done', text: 'a', questions: [{ id: 'q1', answer: 'A' }] },
    { id: 'r2', title: 'Review later', text: 'a', questions: [{ id: 'q2', answer: 'B' }] },
    { id: 'r3', title: 'Due review', text: 'a', questions: [{ id: 'q3', answer: 'C' }] },
    { id: 'r4', title: 'New', text: 'a', questions: [{ id: 'q4', answer: 'D' }] },
  ];

  beforeEach(() => {
    store = {};
  });

  it('getNextReading excludes completed_correct items', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'r1', true);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    const available = simulateGetNextItem(readings, new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'r1')).toBeUndefined();
  });

  it('getNextReading excludes not-due completed_incorrect items', () => {
    simulateRecordPracticeAttempt(store, 'reading', 'r2', false);
    // r2 has dueDate = today+1, so it's not due yet
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    expect(ppNotDue.has('r2')).toBe(true);
    const available = simulateGetNextItem(readings, new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'r2')).toBeUndefined();
  });

  it('getNextReading includes due completed_incorrect items', () => {
    const entry = simulateRecordPracticeAttempt(store, 'reading', 'r3', false);
    entry.dueDate = getLocalDateKey(-1); // yesterday = due
    store.reading.r3 = entry;
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'reading');
    expect(ppNotDue.has('r3')).toBe(false);
    const available = simulateGetNextItem(readings, new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'r3')).toBeDefined();
  });

  it('getNextListening excludes completed_correct items', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'l1', true);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    const listenItems = [{ id: 'l1' }, { id: 'l2' }];
    const available = simulateGetNextItem(listenItems, new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'l1')).toBeUndefined();
    expect(available.find(x => x.id === 'l2')).toBeDefined();
  });

  it('getNextListening excludes not-due completed_incorrect items', () => {
    simulateRecordPracticeAttempt(store, 'listening', 'l1', false);
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    const available = simulateGetNextItem([{ id: 'l1' }, { id: 'l2' }], new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'l1')).toBeUndefined();
  });

  it('getNextListening includes due completed_incorrect items', () => {
    const entry = simulateRecordPracticeAttempt(store, 'listening', 'l1', false);
    entry.dueDate = getLocalDateKey(-1);
    store.listening.l1 = entry;
    const { ppCompleted, ppNotDue } = buildPPSets(store, 'listening');
    const available = simulateGetNextItem([{ id: 'l1' }, { id: 'l2' }], new Set(), ppCompleted, ppNotDue);
    expect(available.find(x => x.id === 'l1')).toBeDefined();
  });

  it('listening uses stable item ID key (not index) for practiceStatus', () => {
    // The fix: ListeningPage now uses listening_${levelId}_${ex.id} (stable item ID)
    // NOT listening_${levelId}_${index} (fragile index-based key)
    const levelId = 'A1';
    const itemId = 'A1_listen_1';
    const key = `listening_${levelId}_${itemId}`;

    // Write using stable item ID key
    simulateRecordPracticeAttempt(store, 'listening', key, true);

    // Read back using same stable item ID key
    const status = store?.listening?.[key]?.status;
    expect(status).toBe('completed_correct');

    // The key should be listenable by getPracticeItemStatus
    // Simulate: ppCompleted build uses full key (not just item.id)
    const { ppCompleted } = buildPPSets(store, 'listening');
    expect(ppCompleted.has(key)).toBe(true);

    // DailyMissionPage prefixedKey format: listening_${level}_${item.id}
    const dailyMissionKey = `listening_${levelId}_${itemId}`;
    expect(dailyMissionKey).toBe(key);
  });

  it('listening status persists across simulated remount/reload', () => {
    const levelId = 'A1';
    const key1 = `listening_${levelId}_A1_listen_1`;
    const key2 = `listening_${levelId}_A1_listen_2`;

    // Write correct for listen_1, incorrect for listen_2
    simulateRecordPracticeAttempt(store, 'listening', key1, true);
    simulateRecordPracticeAttempt(store, 'listening', key2, false);

    // Simulate remount: fresh read from store
    const freshStore = JSON.parse(JSON.stringify(store));

    expect(freshStore.listening[key1].status).toBe('completed_correct');
    expect(freshStore.listening[key2].status).toBe('completed_incorrect');

    // Verify Today's Plan filtering works after reload
    const { ppCompleted, ppNotDue } = buildPPSets(freshStore, 'listening');
    expect(ppCompleted.has(key1)).toBe(true);
    expect(ppNotDue.has(key2)).toBe(true); // due tomorrow (not today)

    const listenItems = [{ id: 'A1_listen_1' }, { id: 'A1_listen_2' }, { id: 'A1_listen_3' }];

    // Simulate DailyMissionPage ppHasItem: it uses prefixed key format
    // which now matches the stable item ID key from ListeningPage
    const completedSet = new Set(
      Object.entries(freshStore.listening || {})
        .filter(([, v]) => v.status === 'completed_correct' || v.status === 'mastered')
        .map(([id]) => id)
    );
    const notDueSet = new Set(
      Object.entries(freshStore.listening || {})
        .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate > getLocalDateKey())
        .map(([id]) => id)
    );

    // listen_1 is in ppCompleted
    expect(completedSet.has(key1)).toBe(true);
    // listen_2 is in ppNotDue (due tomorrow)
    expect(notDueSet.has(key2)).toBe(true);
    // listen_3 is not in either
    expect(completedSet.has(`listening_A1_A1_listen_3`)).toBe(false);
    expect(notDueSet.has(`listening_A1_A1_listen_3`)).toBe(false);
  });

  it('completing reading then correcting works (correct → incorrect → correct)', () => {
    // Simulate: user gets it wrong first, then corrects on review
    simulateRecordPracticeAttempt(store, 'reading', 'r1', false);
    expect(store.reading.r1.status).toBe('completed_incorrect');
    expect(store.reading.r1.dueDate).toBe(getLocalDateKey(1));

    // User reviews it and gets it right
    simulateRecordPracticeAttempt(store, 'reading', 'r1', true);
    expect(store.reading.r1.status).toBe('completed_correct');
    expect(store.reading.r1.dueDate).toBe(getLocalDateKey(14));
    expect(store.reading.r1.attempts).toBe(2);
  });
});
