/**
 * Phase 18F: Speaking Practice Progress Tests
 *
 * Tests speaking status tracking via practiceProgress_v1 + store.js integration.
 * Uses a localStorage mock since vitest runs in 'node' environment.
 *
 * Run: npx vitest tests/speaking-practice.test.js
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

import { getState, completeSpeaking, recordAnswer } from '../src/utils/store';
import { recordPracticeAttempt, getPracticeItemStatus, isPracticeItemCompleted, getDuePracticeItems } from '../src/utils/practiceProgress';

// Sample speaking prompts matching speaking.json format
const mockPrompts = [
  { id: 'A1_speak_1', title: 'Vorstellung', prompt: 'Introduce yourself', level: 'A1', prepTime: 30, talkTime: 60 },
  { id: 'A1_speak_2', title: 'Familie', prompt: 'Describe your family', level: 'A1', prepTime: 30, talkTime: 60 },
  { id: 'A1_speak_3', title: 'Wohnung', prompt: 'Describe your apartment', level: 'A1', prepTime: 30, talkTime: 60 },
  { id: 'A1_speak_4', title: 'Hobbys', prompt: 'Talk about hobbies', level: 'A1', prepTime: 30, talkTime: 60 },
  { id: 'A1_speak_5', title: 'Tagesablauf', prompt: 'Daily routine', level: 'A1', prepTime: 30, talkTime: 60 },
];

// Simulates the DailyMissionPage getNextSpeaking logic
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

describe('Speaking Practice - Status Tracking', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('speaking item starts default/unattempted', () => {
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('unattempted');
  });

  it('speaking score 8/10 marks item completed/green', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: true, score: 8, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Hallo, ich bin...',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_correct');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(true);
  });

  it('speaking score 10/10 marks item completed/green', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: true, score: 10, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Guten Tag, mein Name ist...',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_correct');
  });

  it('speaking score 7/10 marks item red/needs review', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 7, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Ich heiße...',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(false);
  });

  it('speaking score below 8 does not count as completed', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 3, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Ja',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(false);
  });

  it('speaking completion persists after reload', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Test text...',
    });
    getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(true);
    const raw = JSON.parse(localStorage.getItem('practiceProgress_v1'));
    expect(raw.speaking.A1_speak_1.status).toBe('completed_correct');
    expect(raw.speaking.A1_speak_1.score).toBe(9);
  });

  it('score=null from AI failure does not mark completed', () => {
    // Simulate AI failure: score null, correct defaults to false
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 0, maxScore: 10, level: 'A1', topic: 'Vorstellung',
      userAnswer: 'Some text...',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(false);
  });

  it('score threshold works at boundary (score=8 passes)', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: true, score: 8, maxScore: 10, level: 'A1', topic: 'Vorstellung' });
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(true);
  });

  it('score threshold works at boundary (score=7 fails)', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: false, score: 7, maxScore: 10, level: 'A1', topic: 'Vorstellung' });
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(false);
  });
});

describe('Speaking Practice - Today Plan Filtering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completed speaking excluded from Today Plan', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Speaking' });
    recordPracticeAttempt('speaking', 'A1_speak_2', { correct: true, score: 8, maxScore: 10, level: 'A1', topic: 'Speaking' });
    recordPracticeAttempt('speaking', 'A1_speak_3', { correct: true, score: 10, maxScore: 10, level: 'A1', topic: 'Speaking' });

    const available = simulateGetNextSpeaking('A1');
    expect(available.length).toBe(2);
    expect(available.some(a => a.id === 'A1_speak_1')).toBe(false);
    expect(available.some(a => a.id === 'A1_speak_4')).toBe(true);
  });

  it('failed speaking can appear in remediation when due', () => {
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Speaking',
      dueDate: yesterdayKey,
    });
    const available = simulateGetNextSpeaking('A1');
    expect(available.some(a => a.id === 'A1_speak_1')).toBe(true);
  });

  it('failed speaking not due excluded from Today Plan', () => {
    const futureKey = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Speaking',
      dueDate: futureKey,
    });
    const available = simulateGetNextSpeaking('A1');
    expect(available.some(a => a.id === 'A1_speak_1')).toBe(false);
  });

  it('all speaking prompts available when none attempted', () => {
    const available = simulateGetNextSpeaking('A1');
    expect(available.length).toBe(5);
  });

  it('correct-incorrect then correct clears needs-review flag', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Speaking' });
    expect(getPracticeItemStatus('speaking', 'A1_speak_1').status).toBe('completed_incorrect');

    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: true, score: 9, maxScore: 10, level: 'A1', topic: 'Speaking' });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_correct');
    expect(status.attempts).toBe(2);

    const available = simulateGetNextSpeaking('A1');
    expect(available.some(a => a.id === 'A1_speak_1')).toBe(false);
  });

  it('getNextSpeaking handles empty practiceProgress gracefully', () => {
    localStorage.setItem('practiceProgress_v1', JSON.stringify({}));
    const available = simulateGetNextSpeaking('A1');
    expect(available.length).toBe(5);
  });

  it('getDuePracticeItems returns incorrect items with past due dates', () => {
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    recordPracticeAttempt('speaking', 'A1_speak_1', { correct: false, score: 5, maxScore: 10, level: 'A1', topic: 'Speaking', dueDate: yesterdayKey });
    const due = getDuePracticeItems('speaking');
    expect(due).toContain('A1_speak_1');
  });
});

describe('Speaking Practice - Store.js Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completeSpeaking tracks in store state', () => {
    completeSpeaking('A1', 'A1_speak_1');
    const state = getState();
    expect(state.speakingCompleted.A1).toContain('A1_speak_1');
  });

  it('completeSpeaking deduplicates', () => {
    completeSpeaking('A1', 'A1_speak_1');
    completeSpeaking('A1', 'A1_speak_1');
    const state = getState();
    expect(state.speakingCompleted.A1.length).toBe(1);
  });

  it('multiple completeSpeaking calls track multiple prompts', () => {
    completeSpeaking('A1', 'A1_speak_1');
    completeSpeaking('A1', 'A1_speak_2');
    completeSpeaking('A1', 'A1_speak_3');
    const state = getState();
    expect(state.speakingCompleted.A1.length).toBe(3);
  });

  it('recordAnswer stores speaking mistakes for MistakeNotebook', () => {
    recordAnswer('A1', 'A1_speak_1_mistake_1', 'original text', 'corrected text', 'Vorstellung', false, 'speaking');
    const state = getState();
    expect(state.incorrectAnswers.A1).toBeDefined();
    expect(state.incorrectAnswers.A1.length).toBeGreaterThanOrEqual(1);
    expect(state.incorrectAnswers.A1[0].skill).toBe('speaking');
    expect(state.incorrectAnswers.A1[0].topic).toBe('Vorstellung');
  });
});

describe('Speaking Practice - Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('old localStorage speaking progress does not crash', () => {
    const oldState = {
      speakingRecordings: { A1: [{ id: 'A1_speak_1', date: '2024-01-01' }] },
    };
    localStorage.setItem('deutsch_klinik_state_default', JSON.stringify(oldState));
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('unattempted');
  });

  it('no score data defaults to not completed', () => {
    recordPracticeAttempt('speaking', 'A1_speak_1', {
      correct: false, score: 0, maxScore: 10, level: 'A1', topic: 'Speaking',
    });
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
    expect(isPracticeItemCompleted('speaking', 'A1_speak_1')).toBe(false);
  });

  it('AI failure does not crash and records practiceProgress', () => {
    // Simulate getSpeakingFeedback catch path with score=0 (AI failure)
    const score = 0;
    const dueDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    expect(() => {
      recordPracticeAttempt('speaking', 'A1_speak_1', {
        correct: false, score: 0, maxScore: 10, level: 'A1', topic: 'Speaking',
        userAnswer: 'some transcript', dueDate,
      });
    }).not.toThrow();
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
    expect(status.score).toBe(0);
  });

  it('zero transcript does not crash', () => {
    expect(() => {
      recordPracticeAttempt('speaking', 'A1_speak_1', {
        correct: false, score: 0, maxScore: 10, level: 'A1', topic: 'Speaking',
        userAnswer: '', dueDate: new Date().toISOString().slice(0, 10),
      });
    }).not.toThrow();
    const status = getPracticeItemStatus('speaking', 'A1_speak_1');
    expect(status.status).toBe('completed_incorrect');
  });
});
