/**
 * phase20-sync.test.js
 *
 * Phase 20 tests: C1 readiness removal, Supabase sync improvements,
 * onboarding payload merge, no page-refresh gaps.
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
import { mergeProgress } from '../src/utils/supabaseSync';
import fs from 'fs';
import path from 'path';

describe('Phase 20: mergeProgress improvements', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('preserves completed lessons from both sides', () => {
    const local = { completedLessons: { A1: ['l1', 'l2'], A2: ['l3'] } };
    const cloud = { completedLessons: { A1: ['l2', 'l4'], B1: ['l5'] } };
    const result = mergeProgress(local, cloud);
    expect(result.completedLessons.A1).toContain('l1');
    expect(result.completedLessons.A1).toContain('l2');
    expect(result.completedLessons.A1).toContain('l4');
    expect(result.completedLessons.A1.length).toBe(3);
    expect(result.completedLessons.A2).toEqual(['l3']);
    expect(result.completedLessons.B1).toEqual(['l5']);
    expect(result._merged).toBe(true);
  });

  it('merges flashcard SRS with the latest ease', () => {
    const local = {
      flashcards: {
        card1: { ease: 2.5, interval: 10, due: '2026-05-10', correct: 3 },
        card2: { ease: 3.0, interval: 20, due: '2026-05-15', correct: 5 },
      },
    };
    const cloud = {
      flashcards: {
        card1: { ease: 3.5, interval: 30, due: '2026-06-01', correct: 6 },
        card3: { ease: 2.0, interval: 5, due: '2026-05-08', correct: 1 },
      },
    };
    const result = mergeProgress(local, cloud);
    // card1: cloud has higher ease (3.5 > 2.5), so cloud wins
    expect(result.flashcards.card1.ease).toBe(3.5);
    expect(result.flashcards.card1.interval).toBe(30);
    // card2: only in local
    expect(result.flashcards.card2.ease).toBe(3.0);
    // card3: only in cloud
    expect(result.flashcards.card3.ease).toBe(2.0);
  });

  it('merges flashcard SRS with the latest due date when ease is equal', () => {
    const local = { flashcards: { card1: { ease: 2.5, due: '2026-05-01', correct: 3 } } };
    const cloud = { flashcards: { card1: { ease: 2.5, due: '2026-05-15', correct: 5 } } };
    const result = mergeProgress(local, cloud);
    // Same ease, so whichever has latest due wins (cloud)
    expect(result.flashcards.card1.ease).toBe(2.5);
    expect(result.flashcards.card1.due).toBe('2026-05-15');
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
    // m1: merged -> highest repeated count, latest date
    expect(result.mistakeNotebook.m1.repeated).toBe(5);
    expect(result.mistakeNotebook.m1.date).toBe('2026-05-05');
    // m2: preserved from local
    expect(result.mistakeNotebook.m2.topic).toBe('Cases');
    // m3: added from cloud
    expect(result.mistakeNotebook.m3.topic).toBe('Prepositions');
  });

  it('handles null cloud payload gracefully', () => {
    const local = { currentLevel: 'B1', completedLessons: { A1: ['l1'] } };
    const result = mergeProgress(local, null);
    expect(result.currentLevel).toBe('B1');
    expect(result.completedLessons.A1).toEqual(['l1']);
    expect(result._merged).toBe(true);
    expect(result._from).toBe('local');
  });

  it('handles corrupt cloud payload gracefully (fallback to local)', () => {
    const local = { currentLevel: 'A2', completedLessons: { A1: ['l1'] } };
    // Simulate null/undefined payload
    const result = mergeProgress(local, undefined);
    expect(result.currentLevel).toBe('A2');
    expect(result._from).toBe('local');
  });

  it('handles null local and null cloud gracefully', () => {
    const result = mergeProgress(null, null);
    expect(result).toEqual({});
  });
});

describe('Phase 20: C1 readiness removal', () => {
  it('C1ReadinessPage.jsx no longer exists (file was deleted)', () => {
    const filePath = path.resolve(__dirname, '../src/pages/C1ReadinessPage.jsx');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it('saveReadinessScores function no longer exists in store.js', () => {
    const storePath = path.resolve(__dirname, '../src/utils/store.js');
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).not.toContain('saveReadinessScores');
    expect(content).not.toContain('getReadinessScores');
    expect(content).not.toContain('C1 READINESS');
  });

  it('C1 level routes still exist (C1 curriculum NOT removed)', () => {
    // Check that C1 data files still exist in src/data/levels/C1
    const c1Dir = path.resolve(__dirname, '../src/data/levels/C1');
    expect(fs.existsSync(c1Dir)).toBe(true);
    const items = fs.readdirSync(c1Dir);
    // Should have multiple C1 curriculum files
    expect(items.length).toBeGreaterThanOrEqual(8);
    expect(items).toContain('lessons.json');
    expect(items).toContain('grammar.json');
    expect(items).toContain('vocabulary.json');
  });
});
