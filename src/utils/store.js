/**
 * LocalStorage-based state management.
 * All user progress, scores, settings saved here.
 * To reset: clear localStorage and reload.
 */
const PROFILE_KEY = 'dk_active_profile';

function getActiveProfile() {
  return localStorage.getItem(PROFILE_KEY) || null;
}

function getStoreKey() {
  const profile = getActiveProfile() || 'default';
  return `deutsch_klinik_state_${profile}`;
}

export function switchProfile(name) {
  localStorage.setItem(PROFILE_KEY, name);
  window.location.reload();
}

export function signOutProfile() {
  localStorage.removeItem(PROFILE_KEY);
  window.location.reload();
}

export function getCurrentProfileName() {
  return getActiveProfile();
}

const defaultState = {
  // Current level user is working on
  currentLevel: 'A1',
  // Theme: 'dark' | 'light'
  theme: 'dark',
  // Daily streak tracking
  streak: {
    count: 0,
    lastDate: null,
  },
  // Progress per level. Structure: { A1: { grammar: [...], vocab: [...], quizzes: [...], etc } }
  levels: {},
  // Exam results per level. Structure: { A1: { passed: bool, score: number, date: string } }
  exams: {},
  // Writing submissions. Structure: [ { id, level, prompt, text, date, score? } ]
  writings: [],
  // Speaking recordings count per level. Structure: { A1: [ { id, date } ] }
  speakingRecordings: {},
  // Flashcard review state (SM-2 algorithm fields)
  flashcards: {
    // { 'A1_voc_1': { ease: 2.5, interval: 1, due: '2026-04-30', repetitions: 1 } }
  },
  // Weak areas detected per level
  weakAreas: {
    A1: { grammar: false, vocab: false, reading: false, listening: false, writing: false, speaking: false },
    A2: { grammar: false, vocab: false, reading: false, listening: false, writing: false, speaking: false },
    B1: { grammar: false, vocab: false, reading: false, listening: false, writing: false, speaking: false },
    B2: { grammar: false, vocab: false, reading: false, listening: false, writing: false, speaking: false },
    C1: { grammar: false, vocab: false, reading: false, listening: false, writing: false, speaking: false },
  },
  // Placement test result
  placementResult: null,
  // Medical German unlocked
  medicalUnlocked: false,

  // ===== ENHANCED TRACKING (C1 Readiness, Review System) =====

  // Completed lesson IDs per level: { A1: ['A1_lesson_1', 'A1_lesson_2'], ... }
  completedLessons: {},

  // Incorrect answers per level: { A1: [ { exerciseId, userAnswer, correctAnswer, topic, date } ] }
  incorrectAnswers: {},

  // Repeated mistakes: { 'A1_gr_1': { topic: 'Articles', count: 3, lastDate: '2026-05-01', level: 'A1' } }
  repeatedMistakes: {},

  // Mistake notebook for review: { mistakeId: { topic, userAnswer, correctAnswer, level, date, repeated: int } }
  mistakeNotebook: {},

  // Vocabulary mastery per word: { 'A1_voc_1': { correct: 5, incorrect: 1, mastered: false, ease: 2.5, interval: 1, due: '2026-05-01', repetitions: 1 } }
  vocabularyMastery: {},

  // Grammar mastery per exercise: { 'A1_gr_1': { correct: 3, incorrect: 0, mastered: true } }
  grammarMastery: {},

  // Listening completed per level: { A1: ['A1_listen_1', ...] }
  listeningCompleted: {},

  // Reading completed per level: { A1: ['A1_read_1', ...] }
  readingCompleted: {},

  // Completed grammar curriculum lessons per level: { A1: ['A1_gc_1', 'A1_gc_2'], ... }
  completedGrammarLessons: {},

  // C1 Readiness scores
  readinessScores: {
    reading: 0,
    listening: 0,
    writing: 0,
    speaking: 0,
    grammar: 0,
    vocabulary: 0,
    timeManagement: 0,
    overall: 0,
    completed: false,
    lastUpdated: null,
  },

  // Topic-based weakness tracking for review mode
  topicWeakness: {
    // { 'Articles': { correct: 3, incorrect: 5, status: 'weak' }, ... }
    // status: 'weak' | 'improving' | 'mastered'
  },
  dailyStudyLog: [],
  remediationQueue: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(getStoreKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeState(JSON.parse(JSON.stringify(defaultState)), parsed);
    }
  } catch (e) {
    console.warn('Failed to load state, resetting.', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeState(base, saved) {
  if (!isPlainObject(saved)) return base;
  const merged = { ...base };
  Object.entries(saved).forEach(([key, value]) => {
    if (isPlainObject(base[key]) && isPlainObject(value)) {
      merged[key] = mergeState(base[key], value);
    } else {
      merged[key] = value;
    }
  });
  return merged;
}

export function saveState(state) {
  try {
    localStorage.setItem(getStoreKey(), JSON.stringify(state));
    // Notify listeners that progress changed (for Supabase auto-sync etc.)
    try {
      window.dispatchEvent(new CustomEvent('deutsch-klinik-progress-changed', { detail: { timestamp: Date.now() } }));
    } catch {
      // Event dispatch is best-effort
    }
  } catch (e) {
    console.warn('Failed to save state.', e);
  }
}

// Singleton state
let state = loadState();

export function getState() {
  return state;
}

export function updateState(partial) {
  state = mergeState(state, partial);
  saveState(state);
}

export function updateLevelProgress(level, key, data) {
  const levelState = state.levels[level] || {};
  const existing = Array.isArray(levelState[key]) ? levelState[key] : [];
  state = {
    ...state,
    levels: {
      ...state.levels,
      [level]: {
        ...levelState,
        [key]: [...existing, data],
      },
    },
  };
  saveState(state);
}

export function setLevelProgress(level, key, arr) {
  const levelState = state.levels[level] || {};
  state = {
    ...state,
    levels: {
      ...state.levels,
      [level]: {
        ...levelState,
        [key]: Array.isArray(arr) ? arr : [],
      },
    },
  };
  saveState(state);
}

export function getLevelProgress(level, key) {
  if (!state.levels[level]) return [];
  return state.levels[level][key] || [];
}

// ===== LESSON TRACKING =====

/**
 * Extract lesson IDs from a mixed array of strings and { id, completedAt } objects.
 */
function getLessonIds(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => (typeof item === 'string' ? item : item?.id)).filter(Boolean);
}

export function completeLesson(level, lessonId) {
  if (!state.completedLessons[level]) {
    state.completedLessons[level] = [];
  }
  const ids = getLessonIds(state.completedLessons[level]);
  if (!ids.includes(lessonId)) {
    state.completedLessons[level].push({
      id: lessonId,
      completedAt: new Date().toISOString(),
    });
  }
  saveState(state);
}

export function isLessonCompleted(level, lessonId) {
  const arr = state.completedLessons[level];
  if (!Array.isArray(arr)) return false;
  return arr.some(item => (typeof item === 'string' ? item : item?.id) === lessonId);
}

export function getCompletedLessons(level) {
  return getLessonIds(state.completedLessons[level]);
}

// ===== GRAMMAR CURRICULUM LESSON TRACKING =====

export function completeGrammarLesson(level, lessonId) {
  if (!state.completedGrammarLessons[level]) {
    state.completedGrammarLessons[level] = [];
  }
  if (!state.completedGrammarLessons[level].includes(lessonId)) {
    state.completedGrammarLessons[level].push(lessonId);
  }
  saveState(state);
}

export function getCompletedGrammarLessons(level) {
  return state.completedGrammarLessons[level] || [];
}

export function isGrammarLessonCompleted(level, lessonId) {
  const arr = state.completedGrammarLessons[level];
  return Array.isArray(arr) && arr.includes(lessonId);
}

export function getNextGrammarLesson(level, curriculum) {
  const completed = getCompletedGrammarLessons(level);
  const lessons = curriculum[level] || [];
  return lessons.find(l => !completed.includes(l.id)) || null;
}

/**
 * Get full completed lesson records (strings or objects) for a given level.
 * Used by components that need timestamps.
 */
export function getRawCompletedLessons(level) {
  return state.completedLessons[level] || [];
}

// ===== ANSWER TRACKING =====

export function recordAnswer(level, exerciseId, userAnswer, correctAnswer, topic, isCorrect, skill) {
  // Track incorrect answers
  if (!isCorrect) {
    if (!state.incorrectAnswers[level]) {
      state.incorrectAnswers[level] = [];
    }
    state.incorrectAnswers[level].push({
      exerciseId,
      userAnswer,
      correctAnswer,
      topic,
      skill: skill || topic || 'general',
      date: new Date().toISOString(),
    });

    // Track repeated mistakes
    const mistakeKey = `${level}_${exerciseId}`;
    if (state.repeatedMistakes[mistakeKey]) {
      state.repeatedMistakes[mistakeKey].count += 1;
      state.repeatedMistakes[mistakeKey].lastDate = new Date().toISOString();
    } else {
      state.repeatedMistakes[mistakeKey] = {
        topic,
        count: 1,
        lastDate: new Date().toISOString(),
        level,
      };
    }

    // Add to mistake notebook
    const notebookId = `${level}_${exerciseId}_${Date.now()}`;
    if (state.repeatedMistakes[mistakeKey]) {
      state.mistakeNotebook[notebookId] = {
        exerciseId,
        topic,
        userAnswer,
        correctAnswer,
        level,
        skill: skill || topic || 'general',
        date: new Date().toISOString(),
        repeated: state.repeatedMistakes[mistakeKey].count,
      };
    }

    // Update topic weakness
    if (!state.topicWeakness[topic]) {
      state.topicWeakness[topic] = { correct: 0, incorrect: 0, status: 'weak' };
    }
    state.topicWeakness[topic].incorrect += 1;
    updateTopicStatus(topic);
  } else {
    // Update topic weakness for correct
    if (!state.topicWeakness[topic]) {
      state.topicWeakness[topic] = { correct: 0, incorrect: 0, status: 'weak' };
    }
    state.topicWeakness[topic].correct += 1;
    updateTopicStatus(topic);
  }

  saveState(state);
}

function updateTopicStatus(topic) {
  const t = state.topicWeakness[topic];
  if (!t) return;
  const ratio = t.correct / Math.max(t.correct + t.incorrect, 1);
  if (ratio >= 0.8 && t.correct >= 5) {
    t.status = 'mastered';
  } else if (ratio >= 0.6 && t.correct >= 3) {
    t.status = 'improving';
  } else {
    t.status = 'weak';
  }
}

// ===== VOCABULARY MASTERY (SM-2 Spaced Repetition) =====

export function getVocabMastery(wordId) {
  return state.vocabularyMastery[wordId] || {
    correct: 0,
    incorrect: 0,
    mastered: false,
    ease: 2.5,
    interval: 1,
    due: getLocalDateKey(),
    repetitions: 0,
  };
}

export function recordVocabAnswer(wordId, isCorrect, meta = {}) {
  const mastery = getVocabMastery(wordId);
  mastery.correct += isCorrect ? 1 : 0;
  mastery.incorrect += isCorrect ? 0 : 1;

  // SM-2 Algorithm
  if (isCorrect) {
    if (mastery.repetitions === 0) {
      mastery.interval = 1;
    } else if (mastery.repetitions === 1) {
      mastery.interval = 6;
    } else {
      mastery.interval = Math.round(mastery.interval * mastery.ease);
    }
    mastery.repetitions += 1;
  } else {
    mastery.repetitions = 0;
    mastery.interval = 1;
    mastery.ease = Math.max(1.3, mastery.ease - 0.2);
  }

  // Ease factor adjustment
  if (isCorrect && mastery.repetitions >= 1) {
    mastery.ease = Math.min(3.0, mastery.ease + 0.1);
  }

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + mastery.interval);
  mastery.due = getLocalDateKeyFromDate(dueDate);

  // Mark as mastered after 5+ correct with ease >= 2.5
  mastery.mastered = mastery.correct >= 5 && mastery.ease >= 2.5;

  state.vocabularyMastery[wordId] = mastery;
  if (!isCorrect) {
    const level = meta.level || String(wordId).split('_')[0] || 'A1';
    recordAnswer(
      level,
      wordId,
      meta.userAnswer || 'Did not know',
      meta.correctAnswer || meta.translation || meta.english || '',
      meta.topic || 'Vocabulary',
      false,
      'vocab'
    );
  }
  saveState(state);
  return mastery;
}

export function getDueVocabWords(wordIds) {
  const today = getLocalDateKey();
  return wordIds.filter(id => {
    const m = state.vocabularyMastery[id];
    return !m || m.due <= today || !m.mastered;
  });
}

export function recordStudyMinutes({ level, type, minutes, id }) {
  const entry = {
    level,
    type,
    id: id || `${type || 'study'}_${Date.now()}`,
    minutes: Math.max(1, Number(minutes) || 1),
    date: new Date().toISOString(),
  };
  state.dailyStudyLog = [...(state.dailyStudyLog || []), entry];
  saveState(state);
  return entry;
}

export function addRemediationRecommendation(recommendation) {
  if (!recommendation || !recommendation.skill) return null;
  const entry = {
    id: recommendation.id || `${recommendation.level || 'A1'}_${recommendation.skill}_${Date.now()}`,
    level: recommendation.level || 'A1',
    skill: recommendation.skill,
    why: recommendation.why || 'A low score needs follow-up practice.',
    task: recommendation.task || 'Repeat the activity and review mistakes.',
    route: recommendation.route || `/level/${recommendation.level || 'A1'}`,
    date: new Date().toISOString(),
    completed: false,
  };
  state.remediationQueue = [entry, ...(state.remediationQueue || []).filter(r => r.id !== entry.id)].slice(0, 20);
  saveState(state);
  return entry;
}

// ===== GRAMMAR MASTERY =====

export function getGrammarMastery(exerciseId) {
  return state.grammarMastery[exerciseId] || { correct: 0, incorrect: 0, mastered: false };
}

export function recordGrammarAnswer(exerciseId, isCorrect) {
  const mastery = getGrammarMastery(exerciseId);
  mastery.correct += isCorrect ? 1 : 0;
  mastery.incorrect += isCorrect ? 0 : 1;
  mastery.mastered = mastery.correct >= 3 && mastery.correct / Math.max(mastery.correct + mastery.incorrect, 1) >= 0.7;
  state.grammarMastery[exerciseId] = mastery;
  saveState(state);
  return mastery;
}

// ===== LISTENING / READING COMPLETION =====

export function completeListening(level, exerciseId) {
  if (!state.listeningCompleted[level]) {
    state.listeningCompleted[level] = [];
  }
  if (!state.listeningCompleted[level].includes(exerciseId)) {
    state.listeningCompleted[level].push(exerciseId);
  }
  saveState(state);
}

export function completeReading(level, exerciseId) {
  if (!state.readingCompleted[level]) {
    state.readingCompleted[level] = [];
  }
  if (!state.readingCompleted[level].includes(exerciseId)) {
    state.readingCompleted[level].push(exerciseId);
  }
  saveState(state);
}

// ===== C1 READINESS =====

export function saveReadinessScores(scores) {
  scores.lastUpdated = new Date().toISOString();
  scores.completed = true;
  // Calculate overall as average of all categories
  const categories = ['reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary', 'timeManagement'];
  const total = categories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
  scores.overall = Math.round(total / categories.length);
  state.readinessScores = scores;
  saveState(state);
}

export function getReadinessScores() {
  return state.readinessScores;
}

// ===== REVIEW MODE =====

export function getWeakTopics() {
  return Object.entries(state.topicWeakness)
    .filter(([, t]) => t.status === 'weak' || t.status === 'improving')
    .sort((a) => a[1].status === 'weak' ? -1 : 1)
    .map(([topic, data]) => ({ topic, ...data }));
}

export function getMistakesByTopic(topic) {
  return Object.values(state.mistakeNotebook).filter(m => m.topic === topic);
}

export function getMistakesByLevel(level) {
  return state.incorrectAnswers[level] || [];
}

export function getMistakeNotebookItems(levelFilter, skillFilter) {
  let items = [];
  const levels = levelFilter === 'all' ? ['A1','A2','B1','B2','C1'] : [levelFilter];
  levels.forEach(l => {
    const ms = state.incorrectAnswers[l] || [];
    ms.forEach(m => {
      items.push({ ...m, level: l });
    });
  });
  if (skillFilter && skillFilter !== 'all') {
    items = items.filter(m => (m.skill || m.topic || 'general').toLowerCase().includes(skillFilter.toLowerCase()));
  }
  return items;
}

export function clearMistakeByIndex(level, index) {
  if (state.incorrectAnswers[level]) {
    state.incorrectAnswers[level] = state.incorrectAnswers[level].filter((_, i) => i !== index);
    saveState(state);
  }
}

export function markMistakeMastered(level, indexOrMatcher) {
  if (!state.incorrectAnswers[level]) return;
  if (typeof indexOrMatcher === 'number') {
    clearMistakeByIndex(level, indexOrMatcher);
    return;
  }
  const matcher = indexOrMatcher || {};
  state.incorrectAnswers[level] = state.incorrectAnswers[level].filter(m => {
    if (matcher.exerciseId && m.exerciseId === matcher.exerciseId) return false;
    if (matcher.date && m.date === matcher.date) return false;
    return true;
  });
  state.mistakeNotebook = Object.fromEntries(Object.entries(state.mistakeNotebook || {}).filter(([, m]) => {
    if (matcher.exerciseId && m.exerciseId === matcher.exerciseId) return false;
    if (matcher.date && m.date === matcher.date) return false;
    return true;
  }));
  saveState(state);
}

export function markMistakeMasteredById(level, exerciseId) {
  if (!exerciseId) return;
  if (!state.incorrectAnswers[level]) return;
  const before = state.incorrectAnswers[level].length;
  state.incorrectAnswers[level] = state.incorrectAnswers[level]
    .filter(m => m.exerciseId !== exerciseId);
  state.mistakeNotebook = Object.fromEntries(Object.entries(state.mistakeNotebook || {}).filter(([, m]) => (
    m.exerciseId !== exerciseId
  )));
  if (state.incorrectAnswers[level].length < before) saveState(state);
}

// ===== EXAM UNLOCK CHECK =====

export function isExamUnlocked(level, levelData) {
  if (!levelData) return false;
  const prog = state.levels[level];
  if (!prog) return false;

  const grammarDone = (prog.grammar && prog.grammar.length >= levelData.grammarUnits) || false;
  const vocabDone = (prog.vocab && prog.vocab.length >= levelData.vocabularyUnits) || false;
  const writingsDone = (state.writings || []).filter(w => w.level === level).length >= levelData.minWritingTasks;
  const speakingDone = (state.speakingRecordings[level] || []).length >= levelData.minSpeakingTasks;
  const listeningDone = (prog.listening || []).length >= levelData.minListeningTests;
  const readingDone = (prog.reading || []).length >= levelData.minReadingTests;

  const lessonsCompleted = getCompletedLessons(level).length;
  return grammarDone && vocabDone && lessonsCompleted >= 10 && writingsDone && speakingDone && listeningDone && readingDone;
}

// ===== LEVEL UNLOCK CHECK =====

export function isLevelUnlocked(levelId, levelsData) {
  const lvl = levelsData.find(l => l.id === levelId);
  if (!lvl) return false;
  if (!lvl.requires) return true;
  const examResult = state.exams[lvl.requires];
  return examResult && examResult.passed;
}

// ===== STREAK =====

function getLocalDateKey(offsetDays = 0) {
  const d = new Date();
  if (offsetDays) d.setDate(d.getDate() + offsetDays);
  return getLocalDateKeyFromDate(d);
}

function getLocalDateKeyFromDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function updateStreak() {
  const today = getLocalDateKey();
  const last = state.streak.lastDate;
  
  if (last === today) {
    return;
  }
  
  const yesterday = getLocalDateKey(-1);
  if (last === yesterday) {
    state.streak.count += 1;
  } else {
    state.streak.count = 1;
  }
  state.streak.lastDate = today;
  saveState(state);
}

// ===== RESET =====

export function resetAllProgress() {
  state = JSON.parse(JSON.stringify(defaultState));
  saveState(state);
}
