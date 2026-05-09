import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLevelExamProgress, getMissingExamRequirements, isExamUnlocked,
  getVocabMastery,
  recordVocabAnswer,
  resetAllProgress,
} from '../src/utils/store';

const A1_DATA = {
  id: 'A1',
  lessonCount: 25,
  grammarCorrectRequired: 60,
  readingCorrectRequired: 25,
  listeningCorrectRequired: 25,
  minWritingTasks: 10,
  minSpeakingTasks: 10,
  vocabMasteredRequired: 100,
  grammarUnits: 10,
  vocabularyUnits: 10,
  minReadingTests: 5,
  minListeningTests: 5,
};

describe('LevelExamProgress', () => {
  beforeEach(() => {
    resetAllProgress();
  });

  describe('getLevelExamProgress', () => {
    it('returns unlocked=false when no levelData', () => {
      const result = getLevelExamProgress('A1', null);
      expect(result.unlocked).toBe(false);
    });

    it('returns structured requirements object', () => {
      const result = getLevelExamProgress('A1', A1_DATA);
      expect(result).toHaveProperty('level', 'A1');
      expect(result).toHaveProperty('unlocked');
      expect(result).toHaveProperty('requirements');
      expect(result.requirements).toHaveProperty('lessons');
      expect(result.requirements).toHaveProperty('grammar');
      expect(result.requirements).toHaveProperty('reading');
      expect(result.requirements).toHaveProperty('listening');
      expect(result.requirements).toHaveProperty('writing');
      expect(result.requirements).toHaveProperty('speaking');
      expect(result.requirements).toHaveProperty('flashcards');
      expect(result.requirements).toHaveProperty('reviews');
    });

    it('returns unlocked=false when lessons incomplete', () => {
      const result = getLevelExamProgress('A1', A1_DATA);
      expect(result.requirements.lessons.current).toBe(0);
      expect(result.requirements.lessons.complete).toBe(false);
      expect(result.unlocked).toBe(false);
    });

    it('requirements have expected shape per category', () => {
      const result = getLevelExamProgress('A1', A1_DATA);
      // Non-reviews categories: current, required, complete
      ['lessons', 'grammar', 'reading', 'listening', 'writing', 'speaking', 'flashcards'].forEach(key => {
        expect(result.requirements[key]).toHaveProperty('current');
        expect(result.requirements[key]).toHaveProperty('required');
        expect(result.requirements[key]).toHaveProperty('complete');
      });
      // Reviews: currentDue, requiredDue, complete
      expect(result.requirements.reviews).toHaveProperty('currentDue');
      expect(result.requirements.reviews).toHaveProperty('requiredDue');
      expect(result.requirements.reviews).toHaveProperty('complete');
    });
  });

  describe('getMissingExamRequirements', () => {
    it('returns array of missing requirements when exam locked', () => {
      const missing = getMissingExamRequirements('A1', A1_DATA);
      expect(Array.isArray(missing)).toBe(true);
      expect(missing.length).toBeGreaterThan(0);
    });

    it('each missing item has key, current, required', () => {
      const missing = getMissingExamRequirements('A1', A1_DATA);
      missing.forEach(item => {
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('current');
        expect(item).toHaveProperty('required');
      });
    });
  });

  describe('isExamUnlocked', () => {
    it('returns false for completely unstarted level', () => {
      expect(isExamUnlocked('A1', A1_DATA)).toBe(false);
    });

    it('returns false when levelData is null', () => {
      expect(isExamUnlocked('A1', null)).toBe(false);
    });
  });
});

describe('Mistake Flashcard Behavior', () => {
  beforeEach(() => {
    resetAllProgress();
  });

  describe('recordVocabAnswer for mistakes', () => {
    it('creates vocabularyMastery entry with mistake_ prefix', () => {
      recordVocabAnswer('mistake_A1_ex1', 3, { level: 'A1' });
      const vm = getVocabMastery('mistake_A1_ex1');
      expect(vm).toBeDefined();
      expect(vm).toHaveProperty('correct');
      expect(vm).toHaveProperty('interval');
      expect(vm).toHaveProperty('ease');
    });

    it('Again (rating=1) resets mistake to 0 interval', () => {
      recordVocabAnswer('mistake_A1_ex1', 1, { level: 'A1' });
      const vm = getVocabMastery('mistake_A1_ex1');
      expect(vm.interval).toBe(0);
      expect(vm.repetitions).toBe(0);
    });

    it('Good (rating=3) schedules mistake 1 day later', () => {
      recordVocabAnswer('mistake_A1_ex2', 3, { level: 'A1' });
      const vm = getVocabMastery('mistake_A1_ex2');
      expect(vm.interval).toBe(1);
      expect(vm.repetitions).toBe(1);
    });
  });
});
