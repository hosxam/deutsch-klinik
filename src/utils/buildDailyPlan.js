/**
 * buildDailyPlan.js — Single source of truth for Today's Plan generation.
 *
 * Replaces the dual system of buildAdaptiveTargets() + generatePlan() + calculateDailyTargets()
 * with one unified function that is:
 *   - Minutes-aware (dailyMinutes determines size/scope)
 *   - Level-aware (currentLevel determines skill distribution)
 *   - Goal-aware (FSP/exam/full tracks get different weighting)
 *   - Weak-area injection built-in
 *   - Active/passive weighting built-in
 */

import { getLocalDateString, getIntensity } from './adaptivePlan';

// ---------------------------------------------------------------------------
// Minutes-based proportional allocation (from the old generatePlan)
// ---------------------------------------------------------------------------

const TIME_BUDGET = {
  grammar: 0.25,
  vocabulary: 0.20,
  flashcard: 0.20,
  reading: 0.15,
  listening: 0.12,
  writing: 0.08,
};

const MINS_PER_ITEM = {
  grammar: 1.5,
  vocabulary: 0.5,
  flashcard: 0.5,
  reading: 5,
  listening: 4,
  writing: 7,
  speaking: 6,
};

function proportionalCounts(dailyMinutes) {
  const minutes = Math.max(15, Number(dailyMinutes) || 30);
  const counts = {};
  for (const [skill, fraction] of Object.entries(TIME_BUDGET)) {
    const allocated = minutes * fraction;
    counts[skill] = Math.max(0, Math.floor(allocated / MINS_PER_ITEM[skill]));
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Level-based minimums (from the old buildAdaptiveTargets)
// ---------------------------------------------------------------------------

function levelBasedMinimums(dailyMinutes, levelId, goal, hasDueFlashcards) {
  const isFsp = goal?.targetLevel === 'Medical FSP' || goal?.track === 'medical-fsp';

  // Short plan (<30 min): core skills only
  if (dailyMinutes < 30) {
    return {
      grammar: 4,
      vocabulary: 6,
      flashcards: hasDueFlashcards ? 6 : 0,
      reading: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
    };
  }

  // Moderate plan (30-59 min): add reading
  if (dailyMinutes < 60) {
    return {
      grammar: 6,
      vocabulary: 10,
      flashcards: hasDueFlashcards ? 10 : 0,
      reading: 1,
      listening: 0,
      writing: isFsp ? 1 : 0,
      speaking: 0,
    };
  }

  // Intensive (60-89 min): add listening + writing
  if (dailyMinutes < 90) {
    const base = {
      grammar: 10,
      vocabulary: 16,
      flashcards: hasDueFlashcards ? 14 : 0,
      reading: 1,
      listening: 1,
      writing: 1,
      speaking: ['B1', 'B2', 'C1'].includes(levelId) ? 1 : 0,
    };
    // FSP track gets speaking even at 60
    if (isFsp) base.speaking = Math.max(base.speaking || 0, 1);
    return base;
  }

  // Full immersion (90+ min): all skills
  return {
    grammar: dailyMinutes < 120 ? 14 : 20,
    vocabulary: dailyMinutes < 120 ? 24 : 32,
    flashcards: hasDueFlashcards ? (dailyMinutes < 120 ? 20 : 30) : 0,
    reading: 1,
    listening: 1,
    writing: 1,
    speaking: 1,
  };
}

/**
 * Check if there are due flashcards for a given level.
 * @param {object} state - Full state
 * @param {string} levelId - e.g. 'A1'
 * @returns {boolean}
 */
function hasDueFlashcards(state, levelId) {
  const today = getLocalDateString();
  const vm = state.vocabularyMastery || {};
  // If any vocabulary word has mastery data and is due, use flashcard skills
  const dueSome = Object.keys(vm).some(k => {
    const m = vm[k];
    if (!m) return false;
    // Not mastered, or due today/past
    if (!m.mastered) return true;
    return m.due && m.due <= today;
  });
  return dueSome;
}

// ---------------------------------------------------------------------------
// Weak-area injection
// ---------------------------------------------------------------------------

function applyWeakAreaBoost(targets, state, levelId, dailyMinutes) {
  if (!state.incorrectAnswers) return targets;

  const levelMistakes = state.incorrectAnswers[levelId] || [];
  if (levelMistakes.length < 3) return targets;

  const skillCounts = {};
  levelMistakes.forEach(m => {
    const s = (m.skill || m.topic || 'general').toLowerCase();
    skillCounts[s] = (skillCounts[s] || 0) + 1;
  });

  const boosted = { ...targets };

  if ((skillCounts['grammar'] || 0) >= 3 && dailyMinutes >= 30) {
    boosted.grammar = Math.max(boosted.grammar || 0,
      Math.min(boosted.grammar + 4, Math.round(boosted.grammar * 1.5)));
  }

  if ((skillCounts['vocab'] || 0) >= 3) {
    boosted.flashcards = Math.max(boosted.flashcards || 0,
      Math.min(boosted.flashcards + 5, Math.round(boosted.flashcards * 1.5)));
  }

  if ((skillCounts['listening'] || 0) >= 2 && boosted.listening > 0) {
    boosted.listening = Math.min(boosted.listening + 1, 2);
  }

  if ((skillCounts['reading'] || 0) >= 2 && boosted.reading > 0) {
    boosted.reading = Math.min(boosted.reading + 1, 2);
  }

  return boosted;
}

// ---------------------------------------------------------------------------
// Active/passive weighting by level
// ---------------------------------------------------------------------------

function applyActivePassiveWeighting(targets, levelId, dailyMinutes, goal) {
  const isFsp = goal?.targetLevel === 'Medical FSP' || goal?.track === 'medical-fsp';
  const boosted = { ...targets };

  if (isFsp) {
    // FSP track: writing + speaking get heavy weighting
    if (dailyMinutes >= 30) {
      boosted.writing = Math.max(boosted.writing || 0, 1);
      boosted.speaking = Math.max(boosted.speaking || 0, 2);
    }
  } else if (['B1', 'B2', 'C1'].includes(levelId)) {
    // B1+ needs more active production
    if (dailyMinutes >= 30) {
      boosted.writing = Math.max(boosted.writing || 0, 1);
    }
    if (dailyMinutes >= 60) {
      boosted.speaking = Math.max(boosted.speaking || 0, 1);
    }
    if (levelId === 'B2' || levelId === 'C1') {
      // B2-C1: speaking even in shorter plans
      if (dailyMinutes >= 30) {
        boosted.speaking = Math.max(boosted.speaking || 0, 1);
      }
      // C1 gets 2 writing tasks
      if (levelId === 'C1' && dailyMinutes >= 45) {
        boosted.writing = Math.max(boosted.writing || 0, 2);
      }
    }
  }

  return boosted;
}

// ---------------------------------------------------------------------------
// Priority order for skills within a plan (controls mission order)
// ---------------------------------------------------------------------------

const SKILL_ORDER = ['grammar', 'vocabulary', 'flashcards', 'listening', 'reading', 'writing', 'speaking'];

// ---------------------------------------------------------------------------
// Main plan builder — the single source of truth
// ---------------------------------------------------------------------------

/**
 * Build a structured daily plan for Today's Plan.
 *
 * @param {string} levelId - Current user level (A1-A2-B1-B2-C1)
 * @param {object} state - Full state from getState()
 * @param {object} goal - Study goal from getStudyGoal()
 * @returns {object} Structured plan
 */
export function buildDailyPlan(levelId, state, goal) {
  const dailyMinutes = Math.max(15, Number(goal?.dailyMinutes) || 30);
  const dueFlashcardsExist = hasDueFlashcards(state, levelId);

  // Step 1: Compute proportional counts from minutes budget
  const prop = proportionalCounts(dailyMinutes);

  // Step 2: Compute level-based minimums (guarantees core skills at each minutes bucket)
  const levMin = levelBasedMinimums(dailyMinutes, levelId, goal, dueFlashcardsExist);

  // Step 3: Merge — take the higher of proportional vs level-minimum for each skill
  // This ensures both minute-budget proportionality AND level-appropriate minimums
  let targets = {
    grammar: Math.max(prop.grammar, levMin.grammar),
    vocabulary: Math.max(prop.vocabulary, levMin.vocabulary),
    flashcards: Math.max(prop.flashcard, levMin.flashcards),
    reading: Math.max(prop.reading, levMin.reading),
    listening: Math.max(prop.listening, levMin.listening),
    writing: Math.max(prop.writing, levMin.writing),
    speaking: Math.max(0, levMin.speaking || 0),
    remediation: 0,
    lesson: 0,
    grammarLesson: 0,
  };

  // Step 4: Apply weak-area injection
  targets = applyWeakAreaBoost(targets, state, levelId, dailyMinutes);

  // Step 5: Apply active/passive weighting by level
  targets = applyActivePassiveWeighting(targets, levelId, dailyMinutes, goal);

  // Step 6: Estimate total minutes
  const estimatedMinutes =
    targets.grammar * MINS_PER_ITEM.grammar +
    targets.vocabulary * MINS_PER_ITEM.vocabulary +
    targets.flashcards * MINS_PER_ITEM.flashcard +
    targets.reading * MINS_PER_ITEM.reading +
    targets.listening * MINS_PER_ITEM.listening +
    targets.writing * MINS_PER_ITEM.writing +
    (targets.speaking || 0) * MINS_PER_ITEM.speaking;

  // Step 7: Build structured sections
  const sections = {};
  for (const skill of SKILL_ORDER) {
    const count = targets[skill] || 0;
    sections[skill] = {
      count,
      reason: count > 0 ? 'standard' : 'no_room',
      status: count > 0 ? 'included' : 'excluded',
      estimatedMinutes: Math.round(count * (MINS_PER_ITEM[skill] || 2)),
    };
  }

  // Step 8: Return structured plan
  return {
    level: levelId,
    dailyMinutes,
    targets,
    sections,
    estimatedMinutes: Math.round(estimatedMinutes),
    intensity: getIntensity(dailyMinutes),
    generatedAt: getLocalDateString(),
    isFsp: goal?.targetLevel === 'Medical FSP' || goal?.track === 'medical-fsp',
  };
}

/**
 * Convert a structured plan into a mission array compatible with the
 * existing DailyMissionPage UI stepper.
 *
 * @param {object} plan - Output from buildDailyPlan()
 * @returns {Array} Mission array
 */
export function planToMissions(plan) {
  const missions = [];
  const t = plan.targets;

  if (t.grammar > 0) {
    missions.push({ type: 'grammar', target: t.grammar, label: `Complete ${t.grammar} questions` });
  }
  if (t.vocabulary > 0) {
    missions.push({ type: 'vocabulary', target: t.vocabulary, label: `Learn ${t.vocabulary} words` });
  }
  if (t.flashcards > 0) {
    missions.push({ type: 'flashcards', target: t.flashcards, label: `Review ${t.flashcards} due/weak flashcards` });
  }
  if (t.listening > 0) {
    missions.push({ type: 'listening', target: t.listening, label: 'Complete 1 listening test' });
  }
  if (t.reading > 0) {
    missions.push({ type: 'reading', target: t.reading, label: 'Complete 1 reading test' });
  }
  if (t.writing > 0) {
    missions.push({ type: 'writing', target: t.writing, label: 'Complete 1 writing task' });
  }
  if (t.speaking > 0) {
    missions.push({ type: 'speaking', target: t.speaking, label: 'Complete 1 speaking task' });
  }

  return missions;
}

/**
 * Build a plan signature string for cache validation.
 */
export function getPlanSignature(plan) {
  return JSON.stringify({
    dailyMinutes: plan.dailyMinutes,
    level: plan.level,
    targets: plan.targets,
    generatedAt: plan.generatedAt,
  });
}
