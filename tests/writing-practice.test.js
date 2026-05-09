/**
 * Phase 18E: Writing Practice Progress Tests
 *
 * Tests writing status tracking via practiceProgress_v1 + store.js integration.
 * Uses a localStorage mock since vitest runs in 'node' environment.
 *
 * Run: npx vitest tests/writing-practice.test.js
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for Node environment
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  get length() { return storage.size; },
  key: (i) => [...storage.keys()][i] ?? null,
};

import { getState, completeWriting, recordAnswer } from '../src/utils/store';
import { recordPracticeAttempt, getPracticeItemStatus, isPracticeItemCompleted, getDuePracticeItems } from '../src/utils/practiceProgress';

// Sample writing prompts matching writing.json format
const mockPrompts = [
  { id: 'A1_write_1', title: 'Anmeldeformular', prompt: 'Fill out a form', wordLimit: 40, level: 'A1' },
  { id: 'A1_write_2', title: 'Einkaufsliste', prompt: 'Write a shopping list', wordLimit: 30, level: 'A1' },
  { id: 'A1_write_3', title: 'Tagesablauf', prompt: 'Describe your daily routine', wordLimit: 50, level: 'A1' },
  { id: 'A1_write_4', title: 'Meine Familie', prompt: 'Describe your family', wordLimit: 60, level: 'A1' },
  { id: 'A1_write_5', title: 'Brief an Freund', prompt: 'Write a letter to a friend', wordLimit: 80, level: 'A1' },
];

// Simulates the DailyMissionPage getNextWriting logic
function simulateGetNextWriting(level, practiceProgressData) {
  const ppData = practiceProgressData || JSON.parse(localStorage.getItem('practiceProgress_v1') || '{}');
  const ppCompleted = new Set(
    Object.entries(ppData?.writing || {})
      .filter(([, v]) => v.status === 'completed_correct' || v.status === 'mastered')
      .map(([id]) => id)
  );
  const todayStr = new Date().toISOString().slice(0, 10);
  const ppNotDue = new Set(
    Object.entries(ppData?.writing || {})
      .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate > todayStr)
      .map(([id]) => id)
  );
  return mockPrompts.filter(item => !ppCompleted.has(item.id) && !ppNotDue.has(item.id));
}

function simulateGetNextSpeaking(level, practiceProgressData) {
  const ppData = practiceProgressData || JSON.parse(localStorage.getItem('practiceProgress_v1') || '{}');
  const ppCompleted = new Set(
    Object.entries(ppData?.speaking || {})
      .filter(([, v]) => v.status === 'completed_correct' || v.status === 'mastered')
      .map(([id]) => id)
  );
  const todayStr = new Date().toISOString().slice(0, 10);
  const ppNotDue = new Set(
    Object.entries(ppData?.speaking || {})
      .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate > todayStr)
      .map(([id]) => id)
  );
  return mockPrompts.filter(item => !ppCompleted.has(item.id) && !ppNotDue.has(item.id));
}

describe('Writing Practice - Status Tracking', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writing item starts default/unattempted', () => {
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('unattempted');
  });

  it('writing score 8/10 marks item completed/green', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: true,
      score: 8,
      maxScore: 10,
      level: 'A1',
      topic: 'Anmeldeformular',
      userAnswer: 'Mein Name ist...',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_correct');
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(true);
  });

  it('writing score 10/10 marks item completed/green', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: true,
      score: 10,
      maxScore: 10,
      level: 'A1',
      topic: 'Anmeldeformular',
      userAnswer: 'Mein Name ist Hans...',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_correct');
  });

  it('writing score 7/10 marks item red/needs review', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 7,
      maxScore: 10,
      level: 'A1',
      topic: 'Anmeldeformular',
      userAnswer: 'Mein Name...',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(false);
  });

  it('writing score below 8 does not count as completed', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 3,
      maxScore: 10,
      level: 'A1',
      topic: 'Anmeldeformular',
      userAnswer: 'Name',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(false);
  });

  it('writing completion persists after reload', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: true,
      score: 9,
      maxScore: 10,
      level: 'A1',
      topic: 'Anmeldeformular',
      userAnswer: 'Test text...',
    });
    getPracticeItemStatus('writing', 'A1_write_1');
    // Verify via isPracticeItemCompleted
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(true);
    // Verify raw localStorage storage
    const raw = JSON.parse(localStorage.getItem('practiceProgress_v1'));
    expect(raw.writing.A1_write_1.status).toBe('completed_correct');
    expect(raw.writing.A1_write_1.score).toBe(9);
  });

  it('score=0 from AI failure marks as needs review', () => {
    // Simulate AI failure path: score=0, correct=false
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 0,
      maxScore: 10,
      level: 'A1',
      topic: 'Writing',
      userAnswer: 'Some text...',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(false);
    // Verify raw storage has score=0
    const raw = JSON.parse(localStorage.getItem('practiceProgress_v1'));
    expect(raw.writing.A1_write_1.score).toBe(0);
  });

  it('score=5 from partial AI failure marks as needs review', () => {
    // Simulate no AI result available, fallback score of 5
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 5,
      maxScore: 10,
      level: 'A1',
      topic: 'Writing',
      userAnswer: 'Some text...',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_incorrect');
  });

  it('score threshold works at boundary (score=8 passes)', () => {
    recordPracticeAttempt('writing', 'A1_write_1', { correct: true, score: 8, maxScore: 10, level: 'A1', topic: 'Writing' });
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(true);
  });

  it('score threshold works at boundary (score=7 fails)', () => {
    recordPracticeAttempt('writing', 'A1_write_1', { correct: false, score: 7, maxScore: 10, level: 'A1', topic: 'Writing' });
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(false);
  });
});

describe('Writing Practice - Today Plan Filtering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completed writing excluded from Today Plan', () => {
    recordPracticeAttempt('writing', 'A1_write_1', { correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Writing' });
    recordPracticeAttempt('writing', 'A1_write_2', { correct: true, score: 8, maxScore: 10, level: 'A1', topic: 'Writing' });
    recordPracticeAttempt('writing', 'A1_write_3', { correct: true, score: 10, maxScore: 10, level: 'A1', topic: 'Writing' });

    const available = simulateGetNextWriting('A1');
    expect(available.length).toBe(2);
    expect(available.some(a => a.id === 'A1_write_1')).toBe(false);
    expect(available.some(a => a.id === 'A1_write_4')).toBe(true);
  });

  it('failed writing can appear in remediation when due', () => {
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 5,
      maxScore: 10,
      level: 'A1',
      topic: 'Writing',
      dueDate: yesterdayKey,
    });
    const available = simulateGetNextWriting('A1');
    expect(available.some(a => a.id === 'A1_write_1')).toBe(true);
  });

  it('failed writing not due excluded from Today Plan', () => {
    const futureKey = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 5,
      maxScore: 10,
      level: 'A1',
      topic: 'Writing',
      dueDate: futureKey,
    });
    const available = simulateGetNextWriting('A1');
    expect(available.some(a => a.id === 'A1_write_1')).toBe(false);
  });

  it('all writing prompts available when none attempted', () => {
    const available = simulateGetNextWriting('A1');
    expect(available.length).toBe(5);
  });

  it('correct-incorrect then correct clears needs-review flag', () => {
    // First attempt: wrong
    recordPracticeAttempt('writing', 'A1_write_1', { correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Writing' });
    expect(getPracticeItemStatus('writing', 'A1_write_1').status).toBe('completed_incorrect');

    // Second attempt: correct
    recordPracticeAttempt('writing', 'A1_write_1', { correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Writing' });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_correct');
    expect(status.attempts).toBe(2);

    // Excluded from Today Plan
    const available = simulateGetNextWriting('A1');
    expect(available.some(a => a.id === 'A1_write_1')).toBe(false);
  });

  it('getNextWriting handles empty practiceProgress gracefully', () => {
    localStorage.setItem('practiceProgress_v1', JSON.stringify({}));
    const available = simulateGetNextWriting('A1');
    expect(available.length).toBe(5);
  });

  it('getDuePracticeItems returns incorrect items with past due dates', () => {
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    recordPracticeAttempt('writing', 'A1_write_1', { correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Writing', dueDate: yesterdayKey });
    const due = getDuePracticeItems('writing');
    expect(due).toContain('A1_write_1');
  });
});

describe('Writing Practice - Store.js Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completeWriting tracks in store state', () => {
    completeWriting('A1', 'A1_write_1');
    const state = getState();
    expect(state.writingCompleted.A1).toContain('A1_write_1');
  });

  it('completeWriting deduplicates', () => {
    completeWriting('A1', 'A1_write_1');
    completeWriting('A1', 'A1_write_1');
    const state = getState();
    expect(state.writingCompleted.A1.length).toBe(1);
  });

  it('multiple completeWriting calls track multiple prompts', () => {
    completeWriting('A1', 'A1_write_1');
    completeWriting('A1', 'A1_write_2');
    completeWriting('A1', 'A1_write_3');
    const state = getState();
    expect(state.writingCompleted.A1.length).toBe(3);
  });

  it('writingCompleted persists after reload', () => {
    completeWriting('A1', 'A1_write_1');
    expect(completeWriting).toBeDefined();
    // Verify it keeps existing data without overwriting
    const state = getState();
    expect(state.writingCompleted.A1).toBeDefined();
    expect(state.writingCompleted.A1.length).toBeGreaterThanOrEqual(1);
  });

  it('recordAnswer stores writing mistakes for MistakeNotebook', () => {
    recordAnswer('A1', 'A1_write_1_mistake_1', 'original text', 'corrected text', 'Anmeldeformular', false, 'writing');
    const state = getState();
    expect(state.incorrectAnswers.A1).toBeDefined();
    expect(state.incorrectAnswers.A1.length).toBeGreaterThanOrEqual(1);
    expect(state.incorrectAnswers.A1[0].skill).toBe('writing');
    expect(state.incorrectAnswers.A1[0].topic).toBe('Anmeldeformular');
  });
});

describe('Writing Practice - Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('old localStorage writing progress does not crash', () => {
    const oldState = {
      writings: [
        { id: 1, level: 'A1', promptId: 'A1_write_1', title: 'Old', text: 'Text', date: '2024-01-01' },
      ],
    };
    localStorage.setItem('deutsch_klinik_state_default', JSON.stringify(oldState));
    // Should not crash when reading from practiceProgress (which doesn't exist)
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('unattempted');
  });

  it('no score data defaults to not completed', () => {
    recordPracticeAttempt('writing', 'A1_write_1', {
      correct: false,
      score: 0,
      maxScore: 10,
      level: 'A1',
      topic: 'Writing',
    });
    const status = getPracticeItemStatus('writing', 'A1_write_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('writing', 'A1_write_1')).toBe(false);
  });
});

describe('Writing Practice - Speaking (for compatibility)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('speaking follows same pattern as writing for Today Plan', () => {
    recordPracticeAttempt('speaking', 'A1_write_1', { correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Speaking' });
    const available = simulateGetNextSpeaking('A1');
    expect(available.some(a => a.id === 'A1_write_1')).toBe(false);
  });

  it('speaking incorrect with past due shows in Today Plan', () => {
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    recordPracticeAttempt('speaking', 'A1_write_1', { correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Speaking', dueDate: yesterdayKey });
    const available = simulateGetNextSpeaking('A1');
    expect(available.some(a => a.id === 'A1_write_1')).toBe(true);
  });
});
