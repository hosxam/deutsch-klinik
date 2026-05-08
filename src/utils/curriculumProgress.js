/**
 * curriculumProgress.js
 *
 * Reads user progress from the app's localStorage store and maps it against
 * the curriculumMap to determine what is unlocked, what is completed, and
 * what should be recommended next.
 *
 * Integrates with: store.js (getState, getCompletedLessons, etc.)
 * Data source: curriculumMap.json
 */

import curriculumMap from '../data/curriculumMap.json';

// Re-export the map for other modules
export function getCurriculumMap() {
  return curriculumMap;
}

// ==================== CONCEPT TRACKING ====================

/**
 * Get the set of concept IDs the user has completed based on their progress.
 * A concept is "completed" when all its taughtIn lessons/items are done.
 *
 * @param {object} userProgress - Full state from getState()
 * @param {string} level - e.g. 'A1'
 * @returns {Set<string>} - Set of completed concept IDs
 */
export function getCompletedConcepts(userProgress, level) {
  const completed = new Set();
  const units = curriculumMap.units.filter(u => u.level === level);

  for (const unit of units) {
    const allDone = unit.linkedLessonIds.every(lessonId =>
      isLessonCompleted(userProgress, lessonId, unit.level)
    );
    if (allDone && unit.conceptId) {
      completed.add(unit.conceptId);
    }
  }

  // Also add conceptIds from lessons that are completed
  if (userProgress.completedLessons && userProgress.completedLessons[level]) {
    const lessonUnits = units.filter(u => u.skill === 'lesson');
    for (const unit of lessonUnits) {
      if (unit.conceptId && isUnitCompleted(userProgress, unit)) {
        completed.add(unit.conceptId);
      }
    }
  }

  return completed;
}

/**
 * Check if a single curriculum unit is completed by the user.
 */
export function isUnitCompleted(userProgress, unit) {
  if (!unit) return false;

  // Lesson: check completedLessons
  if (unit.skill === 'lesson') {
    return unit.linkedLessonIds.every(id =>
      isLessonCompleted(userProgress, id, unit.level)
    );
  }

  // Grammar: check levels[level].grammar contains the IDs
  if (unit.skill === 'grammar') {
    const done = userProgress.levels?.[unit.level]?.grammar || [];
    return unit.linkedQuestionIds.every(id => done.includes(id));
  }

  // Vocabulary: check levels[level].vocab contains the IDs
  if (unit.skill === 'vocabulary') {
    const done = userProgress.levels?.[unit.level]?.vocab || [];
    return unit.linkedQuestionIds.every(id => done.includes(id));
  }

  // Reading: check readingCompleted or levels[level].reading
  if (unit.skill === 'reading') {
    const done = userProgress.readingCompleted?.[unit.level] || [];
    return done.includes(unit.id) || (userProgress.levels?.[unit.level]?.reading || []).includes(unit.id);
  }

  // Listening: check listeningCompleted or levels[level].listening
  if (unit.skill === 'listening') {
    const done = userProgress.listeningCompleted?.[unit.level] || [];
    return done.includes(unit.id) || (userProgress.levels?.[unit.level]?.listening || []).includes(unit.id);
  }

  // Writing: check writings array
  if (unit.skill === 'writing') {
    return (userProgress.writings || []).some(w =>
      w.level === unit.level && w.id === unit.id
    );
  }

  // Speaking: check speakingRecordings
  if (unit.skill === 'speaking') {
    const done = userProgress.speakingRecordings?.[unit.level] || [];
    return done.some(r => r.id === unit.id);
  }

  return false;
}

function isLessonCompleted(userProgress, lessonId, level) {
  const completed = userProgress.completedLessons?.[level] || [];
  if (!Array.isArray(completed)) return false;
  return completed.some(c => {
    if (typeof c === 'string') return c === lessonId;
    if (c && c.id) return c.id === lessonId;
    return false;
  });
}

// ==================== UNLOCK CHECKS ====================

/**
 * Get all units the user has unlocked for a given level.
 * A unit is unlocked if all its requiredLessons and requiredConcepts are completed.
 *
 * @param {object} userProgress - Full state from getState()
 * @param {string} level - e.g. 'A1'
 * @param {object} [options]
 * @param {Set<string>} [options.extraCompletedConcepts] - Additional completed concepts
 * @returns {Array} - Array of unlocked unit objects
 */
export function getUnlockedUnits(userProgress, level, options = {}) {
  const completedConcepts = getCompletedConcepts(userProgress, level);
  const extra = options.extraCompletedConcepts || new Set();
  const allCompleted = new Set([...completedConcepts, ...extra]);

  const levelUnits = curriculumMap.units.filter(u => u.level === level);

  return levelUnits.filter(unit => {
    // A unit is unlocked if its prerequisites are met
    return arePrerequisitesMet(unit, userProgress, level, allCompleted);
  });
}

/**
 * Check if a unit's prerequisites are met.
 */
export function arePrerequisitesMet(unit, userProgress, _level, completedConcepts) {
  // No prerequisites = always unlocked
  if (!unit.requiredLessons?.length && !unit.requiredConcepts?.length) {
    return true;
  }

  // Check required lessons
  const requiredLessonsMet = (unit.requiredLessons || []).every(lessonId =>
    isLessonCompleted(userProgress, lessonId, _level)
  );
  if (!requiredLessonsMet) return false;

  // Check required concepts
  const requiredConceptsMet = (unit.requiredConcepts || []).every(conceptId =>
    completedConcepts.has(conceptId)
  );
  if (!requiredConceptsMet) return false;

  return true;
}

// ==================== SPECIFIC CHECKS ====================

/**
 * Is a specific question/exercise unlocked for the user?
 * Looks up the question ID in curriculum map to find its prerequisites.
 *
 * @param {string} questionId - e.g. 'A1_gr_1'
 * @param {object} userProgress
 * @returns {boolean}
 */
export function isQuestionUnlocked(questionId, userProgress) {
  const unit = findUnitByLinkedQuestionId(questionId);
  if (!unit) return true; // No metadata = fallback: show it (for compatibility)

  const completedConcepts = getCompletedConcepts(userProgress, unit.level);
  return arePrerequisitesMet(unit, userProgress, unit.level, completedConcepts);
}

/**
 * Is a reading item unlocked?
 */
export function isReadingUnlocked(readingId, userProgress) {
  const unit = curriculumMap.units.find(u => u.skill === 'reading' && u.id === readingId);
  if (!unit) return true;
  const completedConcepts = getCompletedConcepts(userProgress, unit.level);
  return arePrerequisitesMet(unit, userProgress, unit.level, completedConcepts);
}

/**
 * Is a listening item unlocked?
 */
export function isListeningUnlocked(listeningId, userProgress) {
  const unit = curriculumMap.units.find(u => u.skill === 'listening' && u.id === listeningId);
  if (!unit) return true;
  const completedConcepts = getCompletedConcepts(userProgress, unit.level);
  return arePrerequisitesMet(unit, userProgress, unit.level, completedConcepts);
}

/**
 * Is a writing prompt unlocked?
 */
export function isWritingUnlocked(writingId, userProgress) {
  const unit = curriculumMap.units.find(u => u.skill === 'writing' && u.id === writingId);
  if (!unit) return true;
  const completedConcepts = getCompletedConcepts(userProgress, unit.level);
  return arePrerequisitesMet(unit, userProgress, unit.level, completedConcepts);
}

/**
 * Is a speaking prompt unlocked?
 */
export function isSpeakingUnlocked(speakingId, userProgress) {
  const unit = curriculumMap.units.find(u => u.skill === 'speaking' && u.id === speakingId);
  if (!unit) return true;
  const completedConcepts = getCompletedConcepts(userProgress, unit.level);
  return arePrerequisitesMet(unit, userProgress, unit.level, completedConcepts);
}

// ==================== RECOMMENDATIONS ====================

/**
 * Get the next recommended unit(s) for the user based on their progress and goals.
 *
 * @param {object} userProgress
 * @param {object} goalSettings - e.g. { targetLevel: 'B1', dailyMinutes: 30 }
 * @param {number} [maxUnits=3] - Max units to recommend
 * @returns {Array} - Array of recommended unit objects
 */
export function getNextRecommendedUnit(userProgress, goalSettings, maxUnits = 3) {
  const targetLevel = goalSettings?.targetLevel || userProgress.currentLevel || 'A1';
  const availableLevels = getLevelProgression(targetLevel);

  const recommendations = [];
  const seenIds = new Set();

  for (const level of availableLevels) {
    if (recommendations.length >= maxUnits) break;
    const unlocked = getUnlockedUnits(userProgress, level);
    const incomplete = unlocked.filter(u => !isUnitCompleted(userProgress, u) && !seenIds.has(u.id));

    for (const unit of incomplete) {
      if (recommendations.length >= maxUnits) break;
      seenIds.add(unit.id);
      recommendations.push(unit);
    }
  }

  return recommendations;
}

/**
 * Get the level progression from A1 to a target level.
 */
export function getLevelProgression(targetLevel) {
  const order = ['A1', 'A2', 'B1', 'B2', 'C1', 'FSP'];
  const idx = order.indexOf(targetLevel);
  if (idx === -1) return ['A1'];
  return order.slice(0, idx + 1);
}

// ==================== HELPER: FIND UNIT BY QUESTION ID ====================

function findUnitByLinkedQuestionId(questionId) {
  return curriculumMap.units.find(u =>
    (u.linkedQuestionIds || []).includes(questionId)
  );
}

// ==================== SESSION VALIDATION ====================

/**
 * Validate a daily session: check that all selected exercises/items
 * have their prerequisites met. Returns an array of issues found.
 *
 * @param {object} session - Daily mission session object
 * @param {object} userProgress
 * @param {string} level
 * @returns {Array<{ itemId: string, reason: string }>}
 */
export function validateDailySessionPrerequisites(session, userProgress, _level) {
  const issues = [];

  if (!session) return issues;

  // Check grammar questions
  const grammarIds = session.selectedExerciseIds?.grammar || [];
  for (const id of grammarIds) {
    if (!isQuestionUnlocked(id, userProgress)) {
      issues.push({ itemId: id, reason: 'Grammar question has unmet prerequisites' });
    }
  }

  // Check vocabulary items
  const vocabIds = session.selectedExerciseIds?.vocab || [];
  for (const id of vocabIds) {
    if (!isQuestionUnlocked(id, userProgress)) {
      issues.push({ itemId: id, reason: 'Vocabulary item has unmet prerequisites' });
    }
  }

  // Check reading
  if (session.selectedReadingId && !isReadingUnlocked(session.selectedReadingId, userProgress)) {
    issues.push({ itemId: session.selectedReadingId, reason: 'Reading item has unmet prerequisites' });
  }

  // Check listening
  if (session.selectedListeningId && !isListeningUnlocked(session.selectedListeningId, userProgress)) {
    issues.push({ itemId: session.selectedListeningId, reason: 'Listening item has unmet prerequisites' });
  }

  // Check writing
  if (session.selectedWritingId && !isWritingUnlocked(session.selectedWritingId, userProgress)) {
    issues.push({ itemId: session.selectedWritingId, reason: 'Writing prompt has unmet prerequisites' });
  }

  // Check speaking
  if (session.selectedSpeakingId && !isSpeakingUnlocked(session.selectedSpeakingId, userProgress)) {
    issues.push({ itemId: session.selectedSpeakingId, reason: 'Speaking prompt has unmet prerequisites' });
  }

  return issues;
}
