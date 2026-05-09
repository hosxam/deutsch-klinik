import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLevelExamProgress, getMissingExamRequirements, isExamUnlocked,
  getVocabMastery,
  recordVocabAnswer,
  resetAllProgress,
  getDueMistakeCount,
  getMistakesByLevel,
  getMistakeNotebookItems,
  clearMistakeByIndex,
  markMistakeMasteredById,
  recordAnswer,
  getLocalDateKey,
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

  describe('Mistake flashcard queue advance after rating', () => {
    beforeEach(() => {
      resetAllProgress();
      // Create test mistakes by recording incorrect answers
      recordAnswer('A1', 'm_ex1', 'user_wrong1', 'correct1', 'grammar', false, 'grammar');
      recordAnswer('A1', 'm_ex2', 'user_wrong2', 'correct2', 'grammar', false, 'grammar');
      recordAnswer('A1', 'm_ex3', 'user_wrong3', 'correct3', 'reading', false, 'reading');
      recordAnswer('A2', 'm_b1', 'user_wrong_b1', 'correct_b1', 'listening', false, 'listening');
    });

    it('getDueMistakeCount returns 4 for fresh mistakes (no SRS data)', () => {
      const count = getDueMistakeCount('A1') + getDueMistakeCount('A2');
      expect(count).toBe(4);
    });

    it('Easy (rating=4) schedules mistake ahead', () => {
      const mistakeId = 'mistake_A1_m_ex1';
      recordVocabAnswer(mistakeId, 4, { level: 'A1', topic: 'grammar' });
      const vm = getVocabMastery(mistakeId);
      expect(vm).toBeTruthy();
      expect(vm.interval).toBeGreaterThanOrEqual(1);
      // Due date should be set
      expect(vm.due).toBeTruthy();
      const today = getLocalDateKey();
      // With Easy bonus, due should be >= tomorrow
      expect(vm.due >= today).toBe(true);
    });

    it('Good (rating=3) schedules 1 day later', () => {
      const mistakeId = 'mistake_A1_m_ex2';
      recordVocabAnswer(mistakeId, 3, { level: 'A1', topic: 'grammar' });
      const vm = getVocabMastery(mistakeId);
      expect(vm.interval).toBe(1);
      expect(vm.repetitions).toBe(1);
      expect(vm.due).toBeTruthy();
    });

    it('Hard (rating=2) gives reduced interval but still advances', () => {
      const mistakeId = 'mistake_A1_m_ex3';
      recordVocabAnswer(mistakeId, 2, { level: 'A1', topic: 'reading' });
      const vm = getVocabMastery(mistakeId);
      expect(vm).toBeTruthy();
      // Hard with no prior interval: interval should be >= 1 (1.2*0 -> min 1)
      expect(vm.interval).toBeGreaterThanOrEqual(1);
      // Hard increments repetitions (0 + 1)
      expect(vm.repetitions).toBe(1);
    });

    it('Again (rating=1) resets interval to 0 and stays due', () => {
      const mistakeId = 'mistake_A2_m_b1';
      // First, do Good to set some interval
      recordVocabAnswer(mistakeId, 3, { level: 'A2', topic: 'listening' });
      let vm = getVocabMastery(mistakeId);
      expect(vm.interval).toBeGreaterThan(0);
      // Now Again should reset
      recordVocabAnswer(mistakeId, 1, { level: 'A2', topic: 'listening' });
      vm = getVocabMastery(mistakeId);
      expect(vm.interval).toBe(0);
      expect(vm.repetitions).toBe(0);
      // Again stays due today
      const today = getLocalDateKey();
      expect(vm.due <= today).toBe(true);
    });

    it('Mark as mastered removes mistake from incorrectAnswers', () => {
      // Ensure mistakes exist
      let mistakes = getMistakesByLevel('A1');
      expect(mistakes.length).toBeGreaterThan(0);
      expect(mistakes.some(m => m.exerciseId === 'm_ex1')).toBe(true);

      markMistakeMasteredById('A1', 'm_ex1');

      // Mistake removed from incorrectAnswers
      mistakes = getMistakesByLevel('A1');
      expect(mistakes.some(m => m.exerciseId === 'm_ex1')).toBe(false);

      // Due count decreased
      const dueCount = getDueMistakeCount('A1');
      expect(dueCount).toBeLessThan(3);
    });

    it('Remove clears the mistake from store', () => {
      let mistakes = getMistakesByLevel('A1');
      const initialLen = mistakes.length;
      expect(initialLen).toBe(3);

      // Find index for m_ex1
      const idx = mistakes.findIndex(m => m.exerciseId === 'm_ex1');
      expect(idx).toBeGreaterThanOrEqual(0);

      clearMistakeByIndex('A1', idx);
      mistakes = getMistakesByLevel('A1');
      expect(mistakes.length).toBe(initialLen - 1);
      expect(mistakes.find(m => m.exerciseId === 'm_ex1')).toBeUndefined();
    });

    it('Empty items when all mistakes removed', () => {
      const items = getMistakeNotebookItems('all', 'all');
      expect(items.length).toBeGreaterThan(0);

      // Clear all mistakes
      ['A1', 'A2'].forEach(lvl => {
        const ms = getMistakesByLevel(lvl);
        if (ms) {
          for (let i = ms.length - 1; i >= 0; i--) {
            clearMistakeByIndex(lvl, i);
          }
        }
      });

      const emptyItems = getMistakeNotebookItems('all', 'all');
      expect(emptyItems.length).toBe(0);
    });

    it('SRS due date is correctly readable from getVocabMastery', () => {
      const mistakeId = 'mistake_A1_m_ex1';
      recordVocabAnswer(mistakeId, 3, { level: 'A1', topic: 'grammar' });
      const vm = getVocabMastery(mistakeId);
      expect(vm.due).toBeTruthy();
      expect(vm.due).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
