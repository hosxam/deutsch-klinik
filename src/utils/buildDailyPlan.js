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
 *   - SRS grammar due-item injection built-in
 *   - Topic weakness grammar boost built-in
 *   - Remediation queue priority built-in
 */

import { getLocalDateString, getIntensity } from './adaptivePlan';
import { getDueGrammarItems } from './store';
import grammarData from '../data/grammar.json';

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
// Active/passive weighting by level (production scaling)
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
// Production weight scaling by level (replaces old hardcoded TIME_BUDGET)
// Speaking + writing get increased weight at higher levels.
// Grammar and flashcards are reduced proportionally to compensate.
// ---------------------------------------------------------------------------

/**
 * Return the exact target sum for speaking + writing at a given level.
 */
function getProductionTargetSum(levelId) {
  if (['B2', 'C1'].includes(levelId)) return 0.50;
  if (levelId === 'B1') return 0.35;
  return 0.25; // A1, A2
}

/**
 * Return the ratio of speaking to writing within the production block.
 * Speaking gets a heavier share at higher levels.
 */
function getSpeakingRatio(levelId) {
  if (['B2', 'C1'].includes(levelId)) return 0.60; // 60% speaking, 40% writing
  if (levelId === 'B1') return 0.55;
  return 0.45; // A1, A2: slight more writing than speaking
}

const BASE_FRACTIONS = [
  { key: 'grammar', base: 0.25 },
  { key: 'vocabulary', base: 0.20 },
  { key: 'flashcard', base: 0.20 },
  { key: 'reading', base: 0.15 },
  { key: 'listening', base: 0.12 },
];

/**
 * Rescale TIME_BUDGET so speaking + writing hit their exact target at every level.
 *
 * Strategy:
 *   1. Set speaking and writing fractions to exactly hit the target sum.
 *   2. Distribute the remaining (1 - target) fraction across grammar, vocabulary,
 *      flashcard, reading, and listening in their original BASE_FRACTIONS proportions.
 *   3. Cap vocabulary at 0.30 max; redistribute any excess to grammar and flashcard.
 *   4. Assert the final sum is 1.0 and S+W is within 0.01 of target.
 */
function rescaledTimeBudget(levelId) {
  const targetSum = getProductionTargetSum(levelId);
  const sRatio = getSpeakingRatio(levelId);

  const writing = targetSum * (1 - sRatio);
  const speaking = targetSum * sRatio;

  // Remaining budget: what's left after S+W is set
  const remaining = 1 - targetSum;

  // Base fraction sum for normalization reference
  const baseTotal = BASE_FRACTIONS.reduce((s, f) => s + f.base, 0); // 0.92

  // Distribute remaining proportionally
  let rawVocab = (0.20 / baseTotal) * remaining;
  // Cap vocabulary at 30%
  const vocab = Math.min(rawVocab, 0.30);
  const vocabSurplus = rawVocab > 0.30 ? rawVocab - 0.30 : 0;

  // Grammar and flashcard get the vocabulary surplus redistributed
  const grammarBaseShare = 0.25 / baseTotal; // 25/92 of non-S+W
  const flashcardBaseShare = 0.20 / baseTotal; // 20/92
  const readingBaseShare = 0.15 / baseTotal;
  const listeningBaseShare = 0.12 / baseTotal;

  // The non-vocab share of the remaining budget
  const nonVocabRemaining = remaining - rawVocab;

  let grammar = (grammarBaseShare * remaining) + (vocabSurplus * (grammarBaseShare / (grammarBaseShare + flashcardBaseShare)));
  let flashcard = (flashcardBaseShare * remaining) + (vocabSurplus * (flashcardBaseShare / (grammarBaseShare + flashcardBaseShare)));
  let reading = readingBaseShare * remaining;
  let listening = listeningBaseShare * remaining;

  // Floor values so none go to zero
  grammar = Math.max(0.08, grammar);
  flashcard = Math.max(0.06, flashcard);
  reading = Math.max(0.05, reading);
  listening = Math.max(0.04, listening);

  // Final renormalize to 1.0 after floors
  const total = grammar + vocab + flashcard + reading + listening + writing + speaking;
  const result = {
    grammar: grammar / total,
    vocabulary: vocab / total,
    flashcard: flashcard / total,
    reading: reading / total,
    listening: listening / total,
    writing: writing / total,
    speaking: speaking / total,
  };

  const sw = result.speaking + result.writing;
  console.assert(
    Math.abs(sw - targetSum) < 0.015,
    'rescaledTimeBudget S+W mismatch: got ' + sw.toFixed(4) + ' expected ' + targetSum.toFixed(4) + ' for level ' + levelId
  );

  return result;
}

// ---------------------------------------------------------------------------
// Grammar due-item injection
// ---------------------------------------------------------------------------

/**
 * Collect all grammar exercise IDs for the current level from grammar.json.
 */
function getAllGrammarIdsForLevel(levelId) {
  const exercises = grammarData[levelId];
  if (!Array.isArray(exercises)) return [];
  return exercises.filter(e => e && e.id).map(e => e.id);
}

/**
 * Count how many grammar exercises are due for review (SRS).
 */
function countDueGrammarItems(state, levelId) {
  const allIds = getAllGrammarIdsForLevel(levelId);
  if (allIds.length === 0) return 0;
  return getDueGrammarItems(allIds).length;
}

// ---------------------------------------------------------------------------
// Topic weakness grammar boost
// ---------------------------------------------------------------------------

/**
 * Check topicWeakness in state. If any topic is 'weak',
 * boost grammar count by 20% and return the topic names.
 */
function getWeakGrammarTopics(state) {
  if (!state.topicWeakness) return [];
  return Object.entries(state.topicWeakness)
    .filter(([, t]) => t.status === 'weak')
    .map(([topic]) => topic);
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

  // Step 0a: Check for due grammar items (SRS review)
  const dueGrammarCount = countDueGrammarItems(state, levelId);

  // Step 0b: Check for weak grammar topics
  const weakTopics = getWeakGrammarTopics(state);
  const hasWeakTopics = weakTopics.length > 0;

  // Step 0c: Check remediation queue
  const remediationCount = (state.remediationQueue || []).length;
  const hasRemediation = remediationCount > 0;

  // Step 1: Compute proportional counts from level-appropriate time budget
  const budget = rescaledTimeBudget(levelId);
  const minutes = Math.max(15, Number(dailyMinutes) || 30);
  const prop = {};
  for (const [skill, fraction] of Object.entries(budget)) {
    const allocated = minutes * fraction;
    const minsPerItem = MINS_PER_ITEM[skill === 'flashcard' ? 'flashcard' : skill] || 0.5;
    prop[skill] = Math.max(0, Math.floor(allocated / minsPerItem));
  }

  // Step 2: Compute level-based minimums (guarantees core skills at each minutes bucket)
  const levMin = levelBasedMinimums(dailyMinutes, levelId, goal, dueFlashcardsExist);

  // Step 3: Merge — take the higher of proportional vs level-minimum for each skill
  let targets = {
    grammar: Math.max(prop.grammar || 0, levMin.grammar),
    vocabulary: Math.max(prop.vocabulary || 0, levMin.vocabulary),
    flashcards: Math.max(prop.flashcard || 0, levMin.flashcards),
    reading: Math.max(prop.reading || 0, levMin.reading),
    listening: Math.max(prop.listening || 0, levMin.listening),
    writing: Math.max(prop.writing || 0, levMin.writing),
    speaking: Math.max(prop.speaking || 0, levMin.speaking || 0),
    remediation: hasRemediation ? remediationCount : 0,
    lesson: 0,
    grammarLesson: 0,
  };

  // Step 3a: Inject due grammar items into the plan.
  // Add due grammar items ON TOP of new grammar count, capped at the grammar count target.
  // This means if there are 10 new grammar items planned and 4 due for review,
  // we include 10 total: due items come first, then new items fill the rest.
  if (dueGrammarCount > 0) {
    const dueCap = Math.min(dueGrammarCount, targets.grammar);
    targets.grammarDue = dueCap;
  } else {
    targets.grammarDue = 0;
  }

  // Step 3b: Topic weakness grammar boost.
  // If any grammar topic is 'weak', increase grammar target by 20%.
  if (hasWeakTopics && dailyMinutes >= 30) {
    targets.grammar = Math.round(targets.grammar * 1.2);
    targets.grammarWeakTopics = weakTopics;
  } else {
    targets.grammarWeakTopics = [];
  }

  // Step 4: Apply weak-area injection (from incorrectAnswers)
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
    (targets.speaking || 0) * MINS_PER_ITEM.speaking +
    (targets.remediation || 0) * 3; // 3 min per remediation item

  // Step 7: Build structured sections
  const sections = {};
  // Remediation goes first in section order if present
  if (hasRemediation) {
    sections.remediation = {
      count: remediationCount,
      reason: 'due_items',
      status: 'included',
      estimatedMinutes: remediationCount * 3,
    };
  }
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

  // Remediation goes first when present
  if (t.remediation > 0) {
    missions.push({ type: 'remediation', target: t.remediation, label: `Review ${t.remediation} remediation item(s)` });
  }

  if (t.grammar > 0) {
    const dueLabel = t.grammarDue > 0 ? ` (${t.grammarDue} due for review)` : '';
    const weakLabel = t.grammarWeakTopics && t.grammarWeakTopics.length > 0
      ? ` — focus: ${t.grammarWeakTopics.join(', ')}`
      : '';
    missions.push({ type: 'grammar', target: t.grammar, label: `Complete ${t.grammar} questions${dueLabel}${weakLabel}` });
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

/**
 * Compute a topic coherence score for a plan.
 * Higher is better: more skills share the same topic.
 *
 * @param {object} plan - Output from buildDailyPlan()
 * @param {object} options - Context: lessonIds, skill items
 * @param {string[]} options.lessonIds - Today's lesson IDs (planLessonIds)
 * @param {object} options.skillItems - { grammar: [], vocabulary: [], reading: [], listening: [], writing: [], speaking: [] }
 * @returns {{ score: number, primaryTopic: string|null, matched: number, total: number, details: object }}
 */
export function getPlanTopicCoherence(plan, options = {}) {
  const { lessonIds = [], skillItems = {} } = options;
  if (!lessonIds.length) {
    return { score: 0, primaryTopic: null, matched: 0, total: 0, details: {} };
  }

  const skills = ['grammar', 'vocabulary', 'flashcards', 'reading', 'listening', 'writing', 'speaking'];
  const details = {};
  let matched = 0;
  let total = 0;

  for (const skill of skills) {
    const target = plan.targets?.[skill];
    const count = target && target > 0 ? target : 0;
    if (count === 0) {
      details[skill] = { count: 0, matchedItems: 0, topicItems: 0, fallbackItems: 0 };
      continue;
    }
    total++;

    const items = skillItems[skill] || [];
    const topicItems = items.filter(item => {
      const lid = item.lessonId || item.taughtInLessonId || item.lesson || '';
      return lessonIds.some(tid => lid === tid || lid.includes(tid) || String(item.id).includes(tid));
    });

    const matchedItems = topicItems.length > 0 ? count : 0;
    if (matchedItems > 0) matched++;

    details[skill] = {
      count,
      matchedItems: topicItems.length,
      topicItems: topicItems.length,
      fallbackItems: Math.max(0, items.length - topicItems.length),
    };
  }

  // Find the dominant topic from lesson titles
  const primaryTopic = lessonIds[0] || null;
  const score = total > 0 ? matched / total : 0;

  return { score, primaryTopic, matched, total, details };
}
