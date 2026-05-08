/**
 * Unified Practice Progress Model.
 *
 * Single source of truth for all practice item status tracking.
 * Wraps store.js APIs with consistent status semantics.
 *
 * Statuses:
 *   unattempted         – never tried
 *   completed_correct   – answered correctly (all-correct for reading/listening)
 *   completed_incorrect – attempted but got some wrong
 *   needs_review        – answered incorrectly, due for remediation
 *   mastered            – SRS-completed (vocabulary) or passed threshold (writing/speaking)
 *
 * Rules:
 *   correct → remove from queue / mark completed_correct
 *   wrong   → add to mistakes + review queue
 *   SRS-based reappearance via SM-2 due date
 */

import {
  getState,
  recordAnswer,
  updateLevelProgress,
  recordVocabAnswer,
  getDueVocabWords,
  getVocabMastery,
  getGrammarMastery,
  recordGrammarAnswer,
  completeReading,
  completeListening,
  addRemediationRecommendation,
} from './store';

/**
 * Get local date string (YYYY-MM-DD) for today.
 */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Check if a specific practice item has been completed.
 * @param {string} skill - 'vocab', 'grammar', 'reading', 'listening', 'writing', 'speaking'
 * @param {string} itemId - Unique ID for the practice item
 * @returns {boolean}
 */
export function isPracticeItemCompleted(skill, itemId) {
  const state = getState();

  switch (skill) {
    case 'vocab': {
      const m = state.vocabularyMastery[itemId];
      return !!(m && m.correct > 0 && m.mastered);
    }
    case 'grammar': {
      const m = state.grammarMastery[itemId];
      return !!(m && m.mastered);
    }
    case 'reading': {
      const level = extractLevel(itemId);
      return !!(state.readingCompleted?.[level] || []).includes(itemId);
    }
    case 'listening': {
      const level = extractLevel(itemId);
      return !!(state.listeningCompleted?.[level] || []).includes(itemId);
    }
    case 'writing': {
      // Writing is completed if score >= 8/10 exists for this prompt
      const writings = state.writings || [];
      // Check if there's a successful AI score (>= 8) or at least 1 submission
      // Mark as "completed" if we have a score >= 8 for this promptId
      return writings.some(w => w.promptId === itemId && (w.score === undefined || w.score >= 8));
    }
    case 'speaking': {
      const recordings = state.speakingRecordings || {};
      const level = extractLevel(itemId);
      const levelRecs = recordings[level] || [];
      return levelRecs.some(r => r.promptId === itemId);
    }
    default:
      return false;
  }
}

/**
 * Check if a practice item is mastered (permanent completion, not just one session).
 * @param {string} skill
 * @param {string} itemId
 * @returns {boolean}
 */
export function isPracticeItemMastered(skill, itemId) {
  const state = getState();

  switch (skill) {
    case 'vocab': {
      const m = state.vocabularyMastery[itemId];
      return !!(m && m.mastered);
    }
    case 'grammar': {
      const m = state.grammarMastery[itemId];
      return !!(m && m.mastered);
    }
    case 'reading':
    case 'listening':
      // Reading/listening: mastered = completed (all correct in last attempt)
      return isPracticeItemCompleted(skill, itemId);
    case 'writing':
      return isPracticeItemCompleted(skill, itemId);
    case 'speaking':
      return isPracticeItemCompleted(skill, itemId);
    default:
      return false;
  }
}

/**
 * Get the current practice item status.
 * @param {string} itemId - Unique ID
 * @param {string} skill - 'vocab' | 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking'
 * @returns {'unattempted'|'completed_correct'|'completed_incorrect'|'needs_review'|'mastered'}
 */
export function getPracticeItemStatus(itemId, skill) {
  const state = getState();

  if (isPracticeItemMastered(skill, itemId)) return 'mastered';
  if (isPracticeItemCompleted(skill, itemId)) return 'completed_correct';

  // Check if it's in the mistakes queue
  const mistakeIds = getAllMistakeIds();
  if (mistakeIds.has(itemId)) return 'needs_review';

  // Check if there's an attempt but not mastered
  switch (skill) {
    case 'vocab': {
      const m = state.vocabularyMastery[itemId];
      if (m && (m.correct > 0 || m.incorrect > 0)) return 'completed_incorrect';
      break;
    }
    case 'grammar': {
      const m = state.grammarMastery[itemId];
      if (m && (m.correct > 0 || m.incorrect > 0)) return 'completed_incorrect';
      break;
    }
  }

  return 'unattempted';
}

/**
 * Record a practice attempt and update all tracking.
 * @param {string} skill - skill type
 * @param {string} itemId - item ID
 * @param {object} result - { correct: boolean, score?: number, maxScore?: number, userAnswer?, correctAnswer?, level?, topic? }
 */
export function recordPracticeAttempt(skill, itemId, result) {
  const {
    correct,
    score = correct ? 1 : 0,
    maxScore = 1,
    userAnswer = '',
    correctAnswer = '',
    level = extractLevel(itemId),
    topic = skill,
    meta = {},
  } = result;

  const allCorrect = correct && score >= maxScore;

  switch (skill) {
    case 'vocab':
      // Use store's SM-2 recording with boolean correctness
      recordVocabAnswer(itemId, correct, {
        level,
        userAnswer: userAnswer || (correct ? 'Knew it' : 'Did not know'),
        correctAnswer: correctAnswer || '',
        topic: topic || 'Vocabulary',
        ...meta,
      });
      // Also record as answer
      if (!correct) {
        recordAnswer(level, itemId, userAnswer, correctAnswer, topic, false, skill);
      }
      break;

    case 'grammar':
      recordGrammarAnswer(itemId, correct);
      updateLevelProgress(level, 'grammar', {
        date: new Date().toISOString(),
        exerciseId: itemId,
        correct,
        score,
        maxScore,
      });
      if (!correct) {
        recordAnswer(level, itemId, userAnswer, correctAnswer, topic, false, skill);
      }
      break;

    case 'reading':
      if (allCorrect) {
        // Mark reading as completed
        completeReading(level, itemId);
        updateLevelProgress(level, 'reading', {
          date: new Date().toISOString(),
          exerciseId: itemId,
          correct: true,
          score,
          maxScore,
        });
      } else {
        // Not all correct — record as mistake but DON'T mark completed
        recordAnswer(level, itemId, userAnswer, correctAnswer, topic, false, skill);
        updateLevelProgress(level, 'reading', {
          date: new Date().toISOString(),
          exerciseId: itemId,
          correct: false,
          score,
          maxScore,
        });
      }
      break;

    case 'listening':
      if (allCorrect) {
        completeListening(level, itemId);
        updateLevelProgress(level, 'listening', {
          date: new Date().toISOString(),
          exerciseId: itemId,
          correct: true,
          score,
          maxScore,
        });
      } else {
        recordAnswer(level, itemId, userAnswer, correctAnswer, topic, false, skill);
        updateLevelProgress(level, 'listening', {
          date: new Date().toISOString(),
          exerciseId: itemId,
          correct: false,
          score,
          maxScore,
        });
      }
      break;

    case 'writing':
      // Score >= 8/10 means completed
      if (score >= 8) {
        updateLevelProgress(level, 'writing', {
          date: new Date().toISOString(),
          promptId: itemId,
          correct: true,
          score,
          maxScore,
        });
      } else {
        updateLevelProgress(level, 'writing', {
          date: new Date().toISOString(),
          promptId: itemId,
          correct: false,
          score,
          maxScore,
        });
        recordAnswer(level, itemId, userAnswer || 'Writing attempt', correctAnswer || 'Review writing feedback', topic, false, skill);
      }
      break;

    case 'speaking':
      if (score >= 8) {
        updateLevelProgress(level, 'speaking', {
          date: new Date().toISOString(),
          promptId: itemId,
          correct: true,
          score,
          maxScore,
        });
      } else {
        updateLevelProgress(level, 'speaking', {
          date: new Date().toISOString(),
          promptId: itemId,
          correct: false,
          score,
          maxScore,
        });
        recordAnswer(level, itemId, userAnswer || 'Speaking attempt', correctAnswer || 'Review speaking feedback', topic, false, skill);
      }
      break;

    default:
      // Generic fallback
      updateLevelProgress(level, skill, {
        date: new Date().toISOString(),
        exerciseId: itemId,
        correct,
        score,
        maxScore,
      });
      if (!correct) {
        recordAnswer(level, itemId, userAnswer, correctAnswer, topic, false, skill);
      }
  }
}

/**
 * Check if a practice item should be excluded from today's daily practice queue.
 * @param {string} skill
 * @param {string} itemId
 * @returns {boolean} true if item should be excluded (already done and not due for review)
 */
export function shouldExcludeFromDailyPractice(skill, itemId) {
  const status = getPracticeItemStatus(itemId, skill);

  // If mastered, exclude unless vocab is due for SRS
  if (status === 'mastered') {
    if (skill === 'vocab') {
      const m = getVocabMastery(itemId);
      if (m && m.due && m.due <= todayKey()) {
        return false; // Due for SRS review
      }
    }
    return true;
  }

  // If completed correctly, exclude unless due for review
  if (status === 'completed_correct') {
    if (skill === 'vocab') {
      const m = getVocabMastery(itemId);
      if (m && m.due && m.due <= todayKey()) {
        return false;
      }
    }
    // For other skills, completed_correct means done for now
    return true;
  }

  // If needs_review (mistake), include it
  if (status === 'needs_review') {
    return false;
  }

  // Unattempted or completed_incorrect → include
  return false;
}

/**
 * Get a practice summary for a specific level and skill.
 * @param {string} level - A1/A2/B1/B2/C1
 * @param {string} skill - skill type
 * @returns {object} { total, completed, mastered, needsReview, unattempted }
 */
export function getPracticeSummaryBySkill(level, skill) {
  const state = getState();
  const items = getItemsForSkill(level, skill);

  let completed = 0;
  let mastered = 0;
  let needsReview = 0;
  let unattempted = 0;

  items.forEach(itemId => {
    const status = getPracticeItemStatus(itemId, skill);
    switch (status) {
      case 'mastered':
        mastered++;
        break;
      case 'completed_correct':
        completed++;
        break;
      case 'needs_review':
        needsReview++;
        break;
      case 'unattempted':
        unattempted++;
        break;
    }
  });

  return {
    total: items.length,
    completed: completed + mastered,
    mastered,
    needsReview,
    unattempted,
  };
}

// ====== Internal Helpers ======

/**
 * Extract level prefix from an item ID (e.g., "A1_read_1" → "A1").
 */
function extractLevel(itemId) {
  if (!itemId) return 'A1';
  const parts = itemId.split('_');
  const prefix = parts[0];
  if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(prefix)) return prefix;
  return 'A1';
}

/**
 * Collect all mistake IDs (exercise IDs from incorrect answers).
 */
function getAllMistakeIds() {
  const state = getState();
  const ids = new Set();

  Object.values(state.incorrectAnswers || {}).forEach(levelMistakes => {
    (levelMistakes || []).forEach(m => {
      if (m.exerciseId) ids.add(m.exerciseId);
    });
  });

  return ids;
}

/**
 * Get all item IDs for a given skill and level.
 * Returns unique IDs based on data sources.
 */
function getItemsForSkill(level, skill) {
  const state = getState();

  switch (skill) {
    case 'vocab': {
      const levelProgress = state.levels[level]?.vocab || [];
      // Return progress entry IDs
      return levelProgress.map(e => e.exerciseId || e.wordId || e).filter(Boolean);
    }
    case 'grammar': {
      const levelProgress = state.levels[level]?.grammar || [];
      return levelProgress.map(e => e.exerciseId || e).filter(Boolean);
    }
    case 'reading': {
      const levelProgress = state.levels[level]?.reading || [];
      return levelProgress.map(e => e.exerciseId || e).filter(Boolean);
    }
    case 'listening': {
      const levelProgress = state.levels[level]?.listening || [];
      return levelProgress.map(e => e.exerciseId || e).filter(Boolean);
    }
    case 'writing': {
      const writings = state.writings || [];
      return writings.filter(w => w.level === level).map(w => w.promptId || w.id);
    }
    case 'speaking': {
      const recordings = state.speakingRecordings?.[level] || [];
      return recordings.map(r => r.promptId || r.id);
    }
    default:
      return [];
  }
}
