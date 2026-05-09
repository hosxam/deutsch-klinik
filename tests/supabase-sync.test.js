/**
 * supabase-sync.test.js
 *
 * Tests for Supabase sync utilities.
 * Mock Supabase client; do not hit real Supabase.
 */
import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Import after mocks
import { mergeProgress, hasSyncBackup, clearSyncBackup } from '../src/utils/supabaseSync';

describe('mergeProgress', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('returns empty object when both params empty', () => {
    expect(mergeProgress(null, null)).toEqual({});
  });

  it('returns cloud when local is null', () => {
    const result = mergeProgress(null, { currentLevel: 'B1', _merged: true, _from: 'cloud' });
    expect(result.currentLevel).toBe('B1');
    expect(result._merged).toBe(true);
  });

  it('returns local when cloud is null', () => {
    const result = mergeProgress({ currentLevel: 'A2' }, null);
    expect(result.currentLevel).toBe('A2');
    expect(result._merged).toBe(true);
  });

  it('preserves completed lessons from both', () => {
    const local = { completedLessons: { A1: ['lesson1', 'lesson2'] } };
    const cloud = { completedLessons: { A1: ['lesson2', 'lesson3'], A2: ['lesson_a'] } };
    const result = mergeProgress(local, cloud);
    expect(result.completedLessons.A1).toContain('lesson1');
    expect(result.completedLessons.A1).toContain('lesson2');
    expect(result.completedLessons.A1).toContain('lesson3');
    expect(result.completedLessons.A1.length).toBe(3);
    expect(result.completedLessons.A2).toEqual(['lesson_a']);
  });

  it('preserves best vocab mastery (higher ease)', () => {
    const local = { vocabularyMastery: { word1: { ease: 2.5, correct: 5, due: '2026-05-01' } } };
    const cloud = { vocabularyMastery: { word1: { ease: 3.0, correct: 3, due: '2026-04-01' } } };
    const result = mergeProgress(local, cloud);
    expect(result.vocabularyMastery.word1.ease).toBe(3.0);
  });

  it('preserves most recent due date for vocab', () => {
    const local = { vocabularyMastery: { word1: { ease: 2.5, due: '2026-05-01' } } };
    const cloud = { vocabularyMastery: { word1: { ease: 2.2, due: '2026-05-10' } } };
    const result = mergeProgress(local, cloud);
    expect(result.vocabularyMastery.word1.due).toBe('2026-05-10');
  });

  it('deduplicates mistakeNotebook', () => {
    const local = {
      mistakeNotebook: {
        m1: { topic: 'Articles', repeated: 3, date: '2026-05-01' },
        m2: { topic: 'Cases', repeated: 1, date: '2026-05-02' },
      },
    };
    const cloud = {
      mistakeNotebook: {
        m1: { topic: 'Articles', repeated: 5, date: '2026-05-05' },
        m3: { topic: 'Prepositions', repeated: 2, date: '2026-05-03' },
      },
    };
    const result = mergeProgress(local, cloud);
    // m1: merged (highest count + latest date)
    expect(result.mistakeNotebook.m1.repeated).toBe(5);
    expect(result.mistakeNotebook.m1.date).toBe('2026-05-05');
    // m2: preserved from local
    expect(result.mistakeNotebook.m2.topic).toBe('Cases');
    // m3: added from cloud
    expect(result.mistakeNotebook.m3.topic).toBe('Prepositions');
  });

  it('deduplicates incorrectAnswers', () => {
    const local = {
      incorrectAnswers: {
        A1: [{ exerciseId: 'ex1', userAnswer: 'der' }, { exerciseId: 'ex2', userAnswer: 'die' }],
      },
    };
    const cloud = {
      incorrectAnswers: {
        A1: [{ exerciseId: 'ex2', userAnswer: 'das' }, { exerciseId: 'ex3', userAnswer: 'den' }],
      },
    };
    const result = mergeProgress(local, cloud);
    expect(result.incorrectAnswers.A1.length).toBe(3);
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex1');
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex2');
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex3');
  });

  it('merges practiceProgress across levels and categories', () => {
    const local = {
      practiceProgress_v1: {
        B1: { reading: { completed: ['r1'], score: 80 } },
      },
    };
    const cloud = {
      practiceProgress_v1: {
        B1: { reading: { completed: ['r2'], count: 1 }, listening: { completed: ['l1'] } },
        B2: { grammar: { completed: ['g1'] } },
      },
    };
    const result = mergeProgress(local, cloud);
    // Shallow merge per category preserves all keys
    expect(result.practiceProgress_v1.B1.reading.score).toBe(80);
    expect(result.practiceProgress_v1.B1.reading.count).toBe(1);
    // Both levels present
    expect(result.practiceProgress_v1.B1.listening.completed).toEqual(['l1']);
    expect(result.practiceProgress_v1.B2.grammar.completed).toEqual(['g1']);
  });

  it('handles modern lesson objects with id field', () => {
    const local = { completedLessons: { A1: [{ id: 'l1', completedAt: '2026-05-01' }] } };
    const cloud = { completedLessons: { A1: [{ id: 'l1', completedAt: '2026-05-02' }, { id: 'l2' }] } };
    const result = mergeProgress(local, cloud);
    expect(result.completedLessons.A1.length).toBe(2);
  });
});

describe('hasSyncBackup / clearSyncBackup', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('returns false when no backup', () => {
    expect(hasSyncBackup()).toBe(false);
  });

  it('returns true when backup exists', () => {
    localStorageMock.setItem('dk_sync_backup', JSON.stringify({ test: true }));
    expect(hasSyncBackup()).toBe(true);
    clearSyncBackup();
    expect(hasSyncBackup()).toBe(false);
  });
});

describe('local progress key alignment', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('reads and writes profile-specific keys', () => {
    localStorageMock.setItem('dk_active_profile', 'hossam');
    // Simulate store.js key logic
    const profile = localStorageMock.getItem('dk_active_profile') || 'default';
    const key = `deutsch_klinik_state_${profile}`;
    localStorageMock.setItem(key, JSON.stringify({ currentLevel: 'B2' }));
    const raw = localStorageMock.getItem(key);
    expect(JSON.parse(raw).currentLevel).toBe('B2');
  });

  it('falls back to default profile', () => {
    localStorageMock.removeItem('dk_active_profile');
    const profile = localStorageMock.getItem('dk_active_profile') || 'default';
    const key = `deutsch_klinik_state_${profile}`;
    localStorageMock.setItem(key, JSON.stringify({ currentLevel: 'A1' }));
    expect(JSON.parse(localStorageMock.getItem(key)).currentLevel).toBe('A1');
  });
});
