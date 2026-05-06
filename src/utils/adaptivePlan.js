import dashboardSummary from '../data/dashboardSummary.json';
import levelsData from '../data/levels.json';

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

export const MINUTES = {
  lesson: 10,
  grammarLesson: 10,
  grammar: 5,
  vocabulary: 5,
  flashcards: 10,
  reading: 12,
  listening: 12,
  writing: 18,
  speaking: 15,
  remediation: 15,
  exam: 30,
};

export function getLocalDateString(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function levelRange(currentLevel, targetLevel) {
  const start = LEVEL_ORDER[currentLevel] ?? 0;
  const end = LEVEL_ORDER[targetLevel] ?? start;
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  return LEVELS.slice(lo, hi + 1);
}

function countArray(value) {
  return Array.isArray(value) ? value.length : 0;
}

function countWritings(state, level) {
  return (state.writings || []).filter(w => w?.level === level).length;
}

function countSpeaking(state, level) {
  return countArray(state.speakingRecordings?.[level]);
}

function countCompletedLessons(state, level) {
  return countArray(state.completedLessons?.[level]);
}

function totalFor(level, field, planType) {
  const levelData = levelsData.levels.find(l => l.id === level);
  if (planType === 'exam') {
    if (field === 'lesson') return 10;
    if (field === 'grammar') return levelData?.grammarUnits || 10;
    if (field === 'vocabulary') return levelData?.vocabularyUnits || 10;
    if (field === 'reading') return levelData?.minReadingTests || 5;
    if (field === 'listening') return levelData?.minListeningTests || 5;
    if (field === 'writing') return levelData?.minWritingTasks || 10;
    if (field === 'speaking') return levelData?.minSpeakingTasks || 10;
  }
  if (field === 'lesson') return dashboardSummary.lessonCounts?.[level] || 25;
  if (field === 'grammar') return dashboardSummary.grammarCounts?.[level] || 200;
  if (field === 'vocabulary') return dashboardSummary.vocabCounts?.[level] || 500;
  if (field === 'reading') return Math.max(levelData?.minReadingTests || 5, 10);
  if (field === 'listening') return Math.max(levelData?.minListeningTests || 5, 10);
  if (field === 'writing') return Math.max(levelData?.minWritingTasks || 10, 25);
  if (field === 'speaking') return Math.max(levelData?.minSpeakingTasks || 10, 25);
  return 0;
}

export function getPlanTrack(goal) {
  if (goal?.targetLevel === 'Medical FSP' || goal?.track === 'medical-fsp') return 'Medical FSP';
  if (goal?.planType === 'full') return 'Full Mastery';
  return 'Goethe / Exam Unlock';
}

export function getIntensity(dailyMinutes = 30) {
  if (dailyMinutes >= 90) return 'full mastery plan';
  if (dailyMinutes >= 60) return 'intensive';
  if (dailyMinutes >= 30) return 'standard';
  return 'short plan';
}

export function getGoalEstimate(state, goal) {
  const currentLevel = state.currentLevel || 'A1';
  const targetLevel = goal?.targetLevel && goal.targetLevel !== 'Medical FSP' ? goal.targetLevel : 'C1';
  const planType = goal?.planType === 'full' || goal?.targetLevel === 'Medical FSP' ? 'full' : 'exam';
  const dailyMinutes = Math.max(1, Number(goal?.dailyMinutes) || 30);
  const levels = levelRange(currentLevel, targetLevel);
  const fields = ['lesson', 'grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking'];

  const remaining = {};
  const totals = {};
  for (const field of fields) {
    remaining[field] = 0;
    totals[field] = 0;
  }

  for (const level of levels) {
    const prog = state.levels?.[level] || {};
    const completed = {
      lesson: countCompletedLessons(state, level),
      grammar: countArray(prog.grammar),
      vocabulary: countArray(prog.vocab),
      reading: countArray(prog.reading),
      listening: countArray(prog.listening),
      writing: countWritings(state, level),
      speaking: countSpeaking(state, level),
    };
    for (const field of fields) {
      const total = totalFor(level, field, planType);
      totals[field] += total;
      remaining[field] += Math.max(0, total - completed[field]);
    }
  }

  const allVocabIds = levels.flatMap(level => dashboardSummary.vocabIds?.[level] || []);
  const today = getLocalDateString();
  const dueFlashcards = allVocabIds.filter(id => {
    const m = state.vocabularyMastery?.[id] || state.flashcards?.[id];
    return !m || !m.mastered || !m.due || m.due <= today;
  }).length;
  const mistakeBacklog = Object.values(state.incorrectAnswers || {}).reduce((sum, arr) => sum + countArray(arr), 0);

  const minutesRemaining =
    remaining.lesson * MINUTES.lesson +
    remaining.grammar * MINUTES.grammar +
    remaining.vocabulary * MINUTES.vocabulary +
    remaining.reading * MINUTES.reading +
    remaining.listening * MINUTES.listening +
    remaining.writing * MINUTES.writing +
    remaining.speaking * MINUTES.speaking +
    Math.min(dueFlashcards, 80) * 1 +
    Math.min(mistakeBacklog, 40) * 3;

  const daysNeeded = Math.max(1, Math.ceil(minutesRemaining / dailyMinutes));
  const predictedFinishDate = getLocalDateString(addDays(new Date(), daysNeeded));
  const explicitTarget = parseDate(goal?.targetDate);
  const targetDaysRemaining = explicitTarget ? Math.ceil((explicitTarget - parseDate(getLocalDateString())) / 86400000) : null;

  return {
    currentLevel,
    targetLevel,
    track: getPlanTrack(goal),
    planType,
    dailyMinutes,
    intensity: getIntensity(dailyMinutes),
    levels,
    totals,
    remaining,
    dueFlashcards,
    mistakeBacklog,
    minutesRemaining,
    daysNeeded,
    predictedFinishDate,
    targetDate: goal?.targetDate || '',
    targetDaysRemaining,
    notEnoughContent: planType === 'full' && Object.values(totals).some(total => total === 0),
  };
}

export function calculateTodayMinutes(state) {
  const today = getLocalDateString();
  const countToday = (arr, min) => {
    if (!Array.isArray(arr)) return 0;
    return arr.filter(item => {
      if (!item) return false;
      if (typeof item === 'string') return item.startsWith(today);
      const dateVal = item.date || item.completedAt || item.timestamp || item.createdAt;
      return dateVal && String(dateVal).startsWith(today);
    }).length * min;
  };

  let total = countToday(state.dailyStudyLog, 1);
  for (const level of LEVELS) {
    const prog = state.levels?.[level] || {};
    total += countToday(prog.grammar, MINUTES.grammar);
    total += countToday(prog.vocab, MINUTES.vocabulary);
    total += countToday(prog.reading, MINUTES.reading);
    total += countToday(prog.listening, MINUTES.listening);
    total += (state.writings || []).filter(w => w?.level === level && w?.date?.startsWith(today)).length * MINUTES.writing;
    total += (state.speakingRecordings?.[level] || []).filter(r => r?.date?.startsWith(today)).length * MINUTES.speaking;
    total += (state.completedLessons?.[level] || []).filter(item => item?.completedAt?.startsWith(today)).length * MINUTES.lesson;
    total += (state.completedGrammarLessons?.[level] || []).filter(item => typeof item === 'object' && item?.completedAt?.startsWith(today)).length * MINUTES.grammarLesson;
  }
  return total;
}

export function buildAdaptiveTargets(levelId, state, goal) {
  const estimate = getGoalEstimate(state, goal);
  const minutes = estimate.dailyMinutes;
  const dueVocabIds = dashboardSummary.vocabIds?.[levelId] || [];
  const dueFlashcards = dueVocabIds.filter(id => {
    const m = state.vocabularyMastery?.[id] || state.flashcards?.[id];
    return !m || !m.mastered || !m.due || m.due <= getLocalDateString();
  }).length;
  const vocabMistakes = (state.incorrectAnswers?.[levelId] || []).filter(m => (m.skill || '').includes('vocab')).length;
  const full = estimate.planType === 'full';

  if (minutes < 30) {
    return { lesson: 1, grammarLesson: 0, grammar: 4, vocab: 6, flashcards: dueFlashcards > 0 || vocabMistakes > 0 ? 6 : 0, reading: 0, listening: 0, writing: 0, speaking: 0, estimatedMinutes: 15, intensity: estimate.intensity };
  }
  if (minutes < 60) {
    return { lesson: 1, grammarLesson: 1, grammar: 6, vocab: 10, flashcards: dueFlashcards > 0 || vocabMistakes > 0 ? 10 : 0, reading: 1, listening: 0, writing: 0, speaking: 0, estimatedMinutes: 30, intensity: estimate.intensity };
  }
  if (minutes < 90) {
    return { lesson: 1, grammarLesson: 1, grammar: 10, vocab: 16, flashcards: dueFlashcards > 0 || vocabMistakes > 0 || full ? 14 : 0, reading: 1, listening: 1, writing: 1, speaking: 0, estimatedMinutes: 60, intensity: estimate.intensity };
  }
  return { lesson: 1, grammarLesson: 1, grammar: 14, vocab: 24, flashcards: dueFlashcards > 0 || vocabMistakes > 0 || full || estimate.track === 'Medical FSP' ? 20 : 0, reading: 1, listening: 1, writing: 1, speaking: 1, remediation: 1, estimatedMinutes: 90, intensity: estimate.intensity };
}

export function getRemediationRecommendation(state, levelId) {
  const levelMistakes = state.incorrectAnswers?.[levelId] || [];
  const recentLow = [
    ...(state.levels?.[levelId]?.listening || []).map(x => ({ skill: 'listening', score: x?.score })),
    ...(state.levels?.[levelId]?.reading || []).map(x => ({ skill: 'reading', score: x?.score })),
    ...(state.writings || []).filter(x => x?.level === levelId).map(x => ({ skill: 'writing', score: x?.score })),
    ...(state.speakingRecordings?.[levelId] || []).map(x => ({ skill: 'speaking', score: x?.score })),
  ].filter(x => typeof x.score === 'number' && x.score < 60).pop();

  const skill = recentLow?.skill || levelMistakes[levelMistakes.length - 1]?.skill;
  const map = {
    listening: { skill: 'Listening', why: 'A recent listening score or answer was weak.', task: 'Repeat the listening, review the transcript, and collect unknown words.', route: `/level/${levelId}/listening` },
    reading: { skill: 'Reading', why: 'A recent reading score or answer was weak.', task: 'Reread with questions, then review key vocabulary.', route: `/level/${levelId}/reading` },
    writing: { skill: 'Writing', why: 'Your writing feedback showed recurring issues.', task: 'Review the corrected version, then rewrite with one grammar target.', route: `/level/${levelId}/writing` },
    speaking: { skill: 'Speaking', why: 'Your speaking feedback showed fluency or accuracy gaps.', task: 'Practice a model answer, record again, and memorize useful phrases.', route: `/level/${levelId}/speaking` },
    vocab: { skill: 'Vocabulary', why: 'Vocabulary mistakes are building up.', task: 'Review weak and due flashcards before new words.', route: `/level/${levelId}/vocabulary/flashcards` },
    vocabulary: { skill: 'Vocabulary', why: 'Vocabulary mistakes are building up.', task: 'Review weak and due flashcards before new words.', route: `/level/${levelId}/vocabulary/flashcards` },
  };
  return map[skill] || null;
}
