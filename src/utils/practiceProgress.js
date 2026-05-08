const KEY = 'practiceProgress_v1';

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
    cur.status = result.score >= 8 ? 'completed_correct' : 'completed_incorrect';
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
