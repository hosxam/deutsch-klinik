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
    cur.status = result.score >= 8 ? 'completed_correct' : 'completed_incorrect';
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
