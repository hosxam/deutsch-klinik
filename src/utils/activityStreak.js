/**
 * Activity streak and weekly summary utilities.
 * Frontend-only. Reads dates from existing progress state.
 * No mutation of progress state.
 */

/**
 * Get a local date key string (YYYY-MM-DD) for the current timezone.
 */
export function getLocalDateKey(date) {
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Collect all dates of activity across all progress sources.
 * Returns a Set of YYYY-MM-DD strings.
 * Does NOT count completedLessons items since they are plain IDs without dates.
 */
export function collectActivityDates(state) {
  const dates = new Set();
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const tryAddDate = (item) => {
    if (!item) return;
    // Object items with date fields
    if (typeof item === 'object') {
      const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
      if (dateVal) {
        try {
          const ds = String(dateVal);
          // Accept ISO strings, YYYY-MM-DD, or timestamps
          if (/^\d{4}-\d{2}-\d{2}/.test(ds)) {
            dates.add(ds.slice(0, 10));
          } else if (!isNaN(new Date(ds).getTime())) {
            const d = new Date(ds);
            if (!isNaN(d.getTime())) {
              dates.add(getLocalDateKey(d));
            }
          }
        } catch {
          // defensive: skip malformed dates
        }
      }
    }
  };

  // Level-specific progress arrays (grammar, vocab, reading, listening)
  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    ['grammar', 'vocab', 'reading', 'listening'].forEach((key) => {
      const arr = prog[key];
      if (Array.isArray(arr)) {
        arr.forEach(tryAddDate);
      }
    });
  }

  // Writings
  if (Array.isArray(state.writings)) {
    state.writings.forEach(tryAddDate);
  }

  // Speaking recordings
  if (state.speakingRecordings) {
    for (const level of levels) {
      const arr = state.speakingRecordings[level];
      if (Array.isArray(arr)) {
        arr.forEach(tryAddDate);
      }
    }
  }

  // Incorrect answers (date-tracked)
  if (state.incorrectAnswers) {
    for (const level of levels) {
      const arr = state.incorrectAnswers[level];
      if (Array.isArray(arr)) {
        arr.forEach(tryAddDate);
      }
    }
  }

  // Mistake notebook (has dates)
  if (state.mistakeNotebook) {
    Object.values(state.mistakeNotebook).forEach(tryAddDate);
  }

  // Exam results (have dates)
  if (state.exams) {
    Object.values(state.exams).forEach(tryAddDate);
  }

  // Readiness scores
  if (state.readinessScores?.lastUpdated) {
    tryAddDate({ date: state.readinessScores.lastUpdated });
  }

  // Lesson completions (only object entries with completedAt)
  if (state.completedLessons) {
    for (const arr of Object.values(state.completedLessons)) {
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          tryAddDate(item);
        }
      }
    }
  }

  return dates;
}

/**
 * Calculate current streak from a Set of activity date keys.
 * Streak counts consecutive days ending with either today or yesterday.
 * Uses local dates to avoid UTC day-shift bugs.
 */
export function calculateCurrentStreak(activityDates) {
  if (!activityDates || activityDates.size === 0) return 0;

  const today = getLocalDateKey();

  // Check if active today or yesterday — if neither, streak is 0
  const yesterday = getLocalDateKey(new Date(Date.now() - 86400000));

  if (!activityDates.has(today) && !activityDates.has(yesterday)) {
    return 0;
  }

  let streak = 0;
  let cursor = activityDates.has(today) ? today : yesterday;

  while (activityDates.has(cursor)) {
    streak++;
    // Move cursor back one day
    const [y, m, d] = cursor.split('-').map(Number);
    const prev = new Date(y, m - 1, d);
    prev.setDate(prev.getDate() - 1);
    cursor = getLocalDateKey(prev);
  }

  return streak;
}

/**
 * Get activity status for the last 7 calendar days.
 * Returns array of { dateKey, dayLabel, active } objects.
 */
export function getLast7DaysActivity(activityDates) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = getLocalDateKey(d);
    const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'short' }); // Mon, Tue, etc.
    days.push({
      dateKey,
      dayLabel,
      active: activityDates.has(dateKey),
      isToday: i === 0,
    });
  }

  return days;
}

/**
 * Count how many days in the activity set contain activity (max 7).
 */
export function getWeeklyActiveCount(activityDates) {
  if (!activityDates) return 0;
  const last7 = getLast7DaysActivity(activityDates);
  return last7.filter(d => d.active).length;
}

/**
 * Get the best 7-day activity count from the entire activityDates set.
 * Sliding window over all dates sorted.
 */
/**
 * Find the single most recent activity from all date-bearing progress.
 * Returns { type, level, date, item } or null if no activity.
 *
 * Activity types: 'grammar', 'vocab', 'reading', 'listening', 'writing', 'speaking', 'exam'
 * Each has a known route on the app.
 * completedLessons entries with { id, completedAt } are included.
 */
export function getMostRecentActivity(state) {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let best = null;
  let bestTime = 0;

  const consider = (type, level, item, dateValue) => {
    if (!dateValue) return;
    try {
      const ts = new Date(dateValue).getTime();
      if (isNaN(ts)) return;
      if (ts > bestTime) {
        bestTime = ts;
        best = { type, level: level || null, item: item || null, date: dateValue };
      }
    } catch {
      // skip
    }
  };

  // Level-specific progress arrays (grammar, vocab, reading, listening)
  for (const level of levels) {
    const prog = state.levels?.[level];
    if (!prog) continue;

    ['grammar', 'vocab', 'reading', 'listening'].forEach((key) => {
      const arr = prog[key];
      if (!Array.isArray(arr)) return;
      for (const item of arr) {
        if (item && typeof item === 'object') {
          consider(key, level, item, item.date || item.completedAt || item.timestamp || item.createdAt);
        }
      }
    });
  }

  // Writings
  if (Array.isArray(state.writings)) {
    for (const item of state.writings) {
      consider('writing', item.level, item, item.date);
    }
  }

  // Speaking recordings
  if (state.speakingRecordings) {
    for (const level of levels) {
      const arr = state.speakingRecordings[level];
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        consider('speaking', level, item, item.date);
      }
    }
  }

  // Exams
  if (state.exams) {
    for (const [level, item] of Object.entries(state.exams)) {
      consider('exam', level, item, item.date || item.completedAt);
    }
  }

  // Mistake notebook (links to mistake-notebook page)
  if (state.mistakeNotebook) {
    for (const item of Object.values(state.mistakeNotebook)) {
      consider('mistakes', item.level, item, item.date);
    }
  }

  // Lesson completions (only object entries with completedAt)
  if (state.completedLessons) {
    for (const [level, arr] of Object.entries(state.completedLessons)) {
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          consider('lesson', level, item, item.completedAt);
        }
      }
    }
  }

  return best;
}

/**
 * Get the correct route for resuming an activity.
 * Returns a string path or null for unknown types.
 */
export function getActivityRoute(activity, fallbackLevel) {
  if (!activity) return null;
  const level = activity.level || fallbackLevel || 'A1';

  switch (activity.type) {
    case 'grammar':
      return `/level/${level}/grammar`;
    case 'vocab':
      return `/level/${level}/vocabulary`;
    case 'reading':
      return `/level/${level}/reading`;
    case 'listening':
      return `/level/${level}/listening`;
    case 'writing':
      return `/level/${level}/writing`;
    case 'speaking':
      return `/level/${level}/speaking`;
    case 'exam':
      return `/level/${level}/exam`;
    case 'mistakes':
      return '/mistake-notebook';
    case 'lesson':
      return `/level/${level}/lessons`;
    default:
      return `/level/${level}`;
  }
}

/**
 * Format a human-readable label for an activity.
 */
/**
 * Format a date value as a relative time string ("just now", "5m ago", etc.)
 */
export function formatRelativeTime(dateValue) {
  try {
    const now = Date.now();
    const ts = new Date(dateValue).getTime();
    if (isNaN(ts)) return '';
    const diff = now - ts;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 172800000) return 'yesterday';
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(dateValue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export function formatActivityLabel(activity) {
  if (!activity) return 'Unknown';

  const typeLabels = {
    grammar: 'Grammar',
    vocab: 'Vocabulary',
    reading: 'Reading',
    listening: 'Listening',
    writing: 'Writing',
    speaking: 'Speaking',
    exam: 'Exam',
    mistakes: 'Mistake Review',
  };

  const label = typeLabels[activity.type] || activity.type;
  const level = activity.level || '';
  const date = activity.date ? formatRelativeTime(activity.date) : '';

  return [label, level ? `(${level})` : '', date].filter(Boolean).join(' ');
}

export function getBestWeeklyActivity(activityDates) {
  if (!activityDates || activityDates.size === 0) return 0;

  const sorted = [...activityDates].sort();
  if (sorted.length === 0) return 0;

  let best = 0;
  for (let i = 0; i < sorted.length; i++) {
    const start = new Date(sorted[i]);
    let count = 0;
    for (let j = i; j < sorted.length; j++) {
      const d = new Date(sorted[j]);
      const diff = (d - start) / (1000 * 60 * 60 * 24);
      if (diff < 7) {
        count++;
      } else {
        break;
      }
    }
    best = Math.max(best, count);
  }

  return best;
}
