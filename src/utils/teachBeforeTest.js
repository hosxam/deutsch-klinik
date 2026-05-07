/**
 * teachBeforeTest.js
 *
 * High-level convenience API wrapping curriculumProgress.js for use in
 * DailyMissionPage and other components.
 *
 * These functions decide: "can this user see this content item right now?"
 *
 * Fallback behavior: if curriculumMap has no entry for a given item,
 * the item is considered unlocked (backwards-compatible with existing data).
 */

import { getCurriculumMap } from './curriculumProgress';
import {
  getCompletedConcepts,
  isUnitCompleted,
  arePrerequisitesMet,
  getUnlockedUnits,
} from './curriculumProgress';

/**
 * Get the pool of items that should be available for daily practice.
 *
 * For grammar exercises: only those whose lesson has been completed.
 * For vocabulary: only those whose lesson has been completed.
 * For reading/listening/writing/speaking: only those whose lesson has been completed.
 *
 * @param {object[]} allItems - Array of items (grammar questions, vocab items, etc.)
 * @param {string} level - e.g. 'A1'
 * @param {object} userProgress - Full state from getState()
 * @param {object} context - Practice context from getPracticeContext()
 * @returns {object[]} - Filtered array of unlocked items
 */
export function getUnlockedItems(allItems, level, userProgress, context) {
  if (!allItems || !Array.isArray(allItems)) return [];

  // In free practice mode, show everything
  if (context?.isFreePractice) return allItems;

  const completedConcepts = getCompletedConcepts(userProgress, level);
  const allowedLessons = context?.allowedLessonIds || new Set();
  const curriculumUnits = getCurriculumMap().units.filter(u => u.level === level);

  return allItems.filter(item => {
    const taughtIn = item.taughtInLessonId || item.lessonId;

    // Quick check: if item has a lessonId, check if that lesson is completed
    if (taughtIn && allowedLessons.has(taughtIn)) {
      return true;
    }

    // If no lessonId but item has conceptId, check concept
    if (item.conceptId && completedConcepts.has(item.conceptId)) {
      return true;
    }

    // Check curriculum map for this specific item
    const unit = curriculumUnits.find(u =>
      u.skill === (item.skillType || 'grammar') &&
      (u.linkedQuestionIds || []).includes(item.id)
    );
    if (unit) {
      return arePrerequisitesMet(unit, userProgress, level, completedConcepts);
    }

    // Fallback: if item has a lessonId but it's not completed, exclude it
    if (taughtIn) {
      return allowedLessons.has(taughtIn);
    }

    // No metadata at all: in curriculum mode, exclude to be safe
    return false;
  });
}

/**
 * Get only items that are both unlocked AND in the "today" lesson plan.
 * This is the strictest filter for daily mission.
 *
 * @param {object[]} allItems
 * @param {string} level
 * @param {object} userProgress
 * @param {object} context
 * @returns {object[]}
 */
export function getTodayItems(allItems, level, userProgress, context) {
  const unlocked = getUnlockedItems(allItems, level, userProgress, context);
  return unlocked.filter(item => {
    const taughtIn = item.taughtInLessonId || item.lessonId;
    return taughtIn && context?.todayLessonIds?.includes(taughtIn);
  });
}

/**
 * Get items for review (unlocked but not in today's lesson plan).
 */
export function getReviewItems(allItems, level, userProgress, context) {
  const unlocked = getUnlockedItems(allItems, level, userProgress, context);
  return unlocked.filter(item => {
    const taughtIn = item.taughtInLessonId || item.lessonId;
    return !taughtIn || !context?.todayLessonIds?.includes(taughtIn);
  });
}

/**
 * Check if the site should use curriculum-driven filtering for a given level.
 * Returns true if the curriculum map has units for that level.
 *
 * @param {string} level
 * @returns {boolean}
 */
export function hasCurriculumMap(level) {
  const map = getCurriculumMap();
  return map.units.some(u => u.level === level);
}

/**
 * Get all units that are "due next" for the user — incomplete but unlocked.
 * Sorted by order within the level, then by skill priority.
 *
 * @param {object} userProgress
 * @param {string} level
 * @returns {object[]}
 */
export function getNextStudyUnits(userProgress, level) {
  const unlocked = getUnlockedUnits(userProgress, level);
  const incomplete = unlocked.filter(u => !isUnitCompleted(userProgress, u));
  const skillOrder = { lesson: 0, vocabulary: 1, grammar: 2, reading: 3, listening: 4, writing: 5, speaking: 6 };
  incomplete.sort((a, b) => (a.order || 999) - (b.order || 999) || (skillOrder[a.skill] || 99) - (skillOrder[b.skill] || 99));
  return incomplete;
}
