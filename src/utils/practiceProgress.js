const KEY = 'practiceProgress_v1';

/**
 * Get today's date as YYYY-MM-DD string for dueDate comparisons.
 */
function getTodayDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Add days to today and return YYYY-MM-DD.
 */
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function save(d) {
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function getPracticeItemStatus(skill, itemId) {
  const data = load();
  return data[skill]?.[itemId] || { status: 'unattempted' };
}

/**
 * Record a practice attempt.
 *
 * When `dueDate` is provided, it is stored directly.
 * When `dueDate` is NOT provided, a default is computed:
 *   - correct: 14 days from now
 *   - incorrect: 1 day from now
 */
export function recordPracticeAttempt(skill, itemId, result = {}) {
  const data = load();
  if (!data[skill]) data[skill] = {};
  const cur = data[skill][itemId] || { status: 'unattempted', attempts: 0 };
  cur.attempts = (cur.attempts || 0) + 1;
  cur.lastAttempt = new Date().toISOString();
  if (result.correct !== undefined) {
    cur.status = result.correct ? 'completed_correct' : 'completed_incorrect';
  }
  if (result.score !== undefined) {
    cur.score = result.score;
    cur.maxScore = result.maxScore || 10;
    // Only overwrite status from score if correct flag was NOT explicitly passed.
    // This prevents small-question-count scales (e.g. 4/4 reading) from being
    // misclassified by the absolute >= 8 threshold designed for writing/speaking.
    if (result.correct === undefined) {
      // Use proportional threshold for score-based status
      const pct = cur.maxScore > 0 ? result.score / cur.maxScore : 0;
      cur.status = pct >= 0.8 ? 'completed_correct' : 'completed_incorrect';
    }
  }
  // Set dueDate for scheduling
  if (result.dueDate !== undefined) {
    cur.dueDate = result.dueDate;
  } else if (cur.status === 'completed_correct') {
    cur.dueDate = addDays(14);
  } else if (cur.status === 'completed_incorrect') {
    cur.dueDate = addDays(1);
  }
  data[skill][itemId] = cur;
  save(data);
  return cur;
}

export function isPracticeItemCompleted(skill, itemId) {
  const s = getPracticeItemStatus(skill, itemId);
  return s.status === 'completed_correct' || s.status === 'mastered';
}

export function shouldExcludeFromDailyPractice(skill, itemId) {
  return isPracticeItemCompleted(skill, itemId);
}

/**
 * Get items for a skill that are due for review (status='completed_incorrect' and dueDate <= today).
 * This drives remediation scheduling in Today's Plan.
 */
export function getDuePracticeItems(skill) {
  const data = load();
  const skillData = data[skill] || {};
  const today = getTodayDateKey();
  return Object.entries(skillData)
    .filter(([, v]) => v.status === 'completed_incorrect' && v.dueDate && v.dueDate <= today)
    .map(([id]) => id);
}

/**
 * Get items for a skill that are in practice progress but NOT due yet.
 * Used to exclude correctly-completed items from Today's Plan.
 */
export function getNotDuePracticeItems(skill) {
  const data = load();
  const skillData = data[skill] || {};
  const today = getTodayDateKey();
  return Object.entries(skillData)
    .filter(([, v]) => v.status === 'completed_correct' && v.dueDate && v.dueDate > today)
    .map(([id]) => id);
}

/**
 * Mark a practice item as having been shown for revisit.
 * Sets revisitDone=true and extends the next dueDate so the item does not
 * reappear immediately.
 */
export function markRevisitDone(skill, itemId) {
  const data = load();
  if (!data[skill] || !data[skill][itemId]) return;
  data[skill][itemId].revisitDone = true;
  data[skill][itemId].revisitDate = getTodayDateKey();
  // Extend the due date: 7 days for future cooldown
  data[skill][itemId].dueDate = addDays(7);
  save(data);
}

/**
 * Get old completed items (14+ days cooldown) that are due for revisit.
 * Returns entries where status is completed_correct/mastered, dueDate <= today,
 * and revisitDone is NOT true (or not set).
 */
export function getOldCompletedDueRevisit(skill) {
  const data = load();
  const skillData = data[skill] || {};
  const today = getTodayDateKey();
  return Object.entries(skillData)
    .filter(([, v]) =>
      (v.status === 'completed_correct' || v.status === 'mastered') &&
      v.dueDate &&
      v.dueDate <= today &&
      !v.revisitDone
    )
    .map(([id]) => id);
}

/**
 * Get due-for-revisit items (completed_incorrect with past dueDate).
 * Filters ONLY items that have NOT been marked revisitDone.
 */
export function getDueIncorrectRevisit(skill) {
  const data = load();
  const skillData = data[skill] || {};
  const today = getTodayDateKey();
  return Object.entries(skillData)
    .filter(([, v]) =>
      v.status === 'completed_incorrect' &&
      v.dueDate &&
      v.dueDate <= today &&
      !v.revisitDone
    )
    .map(([id]) => id);
}
