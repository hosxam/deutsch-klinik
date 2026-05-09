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
  // weakAreas must always be an array. Old/corrupted data (object, string, null) is normalized in loadState.
  weakAreas: [],
  // Placement test result
  placementResult: null,
  // Medical German unlocked
  medicalUnlocked: false,

  // ===== ONBOARDING =====
  onboardingComplete: false,
  startLevel: null,
  targetLevel: null,
  dailyMinutes: 30,
  daysPerWeek: 5,
  targetDate: null,
  estimatedFinishDate: null,
  goalSetupComplete: false,

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

  // Writing completed per level: { A1: ['A1_write_1', ...] }
  writingCompleted: {},

  // Speaking completed per level: { A1: ['A1_speak_1', ...] }
  speakingCompleted: {},

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
  studyLog: {},
  remediationQueue: [],
};

function normalizeState(st) {
  // weakAreas: must be array. Normalize old object/corrupt data.
  if (!Array.isArray(st.weakAreas)) {
    st.weakAreas = [];
  }
  // vocabularyMastery: ensure all entries have required SM-2 fields
  if (st.vocabularyMastery && typeof st.vocabularyMastery === 'object') {
    Object.keys(st.vocabularyMastery).forEach(k => {
      const m = st.vocabularyMastery[k];
      if (!m || typeof m !== 'object') {
        delete st.vocabularyMastery[k];
        return;
      }
      // Ensure numeric fields
      if (typeof m.ease !== 'number') m.ease = 2.5;
      if (typeof m.interval !== 'number') m.interval = 0;
      if (typeof m.repetitions !== 'number') m.repetitions = 0;
      if (typeof m.correct !== 'number') m.correct = 0;
      if (typeof m.incorrect !== 'number') m.incorrect = 0;
      // Ensure due date exists
      if (!m.due || typeof m.due !== 'string') m.due = getLocalDateKey();
      // Ensure mastered is boolean
      if (typeof m.mastered !== 'boolean') m.mastered = false;
    });
  }
  // Ensure flashcards object exists
  if (!st.flashcards || typeof st.flashcards !== 'object' || Array.isArray(st.flashcards)) {
    st.flashcards = {};
  }
  return st;
}

function loadState() {
  try {
    const raw = localStorage.getItem(getStoreKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeState(mergeState(JSON.parse(JSON.stringify(defaultState)), parsed));
    }
  } catch (e) {
    console.warn('Failed to load state, resetting.', e);
  }
  return normalizeState(JSON.parse(JSON.stringify(defaultState)));
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

    // Create SM-2 vocabulary mastery entry for mistake so it appears in flashcard review queue
    const mistakeReviewId = `mistake_${level}_${exerciseId}`;
    if (!state.vocabularyMastery[mistakeReviewId]) {
      state.vocabularyMastery[mistakeReviewId] = {
        correct: 0, incorrect: 1, repetitions: 0, interval: 0, ease: 2.5, due: getLocalDateKey(),
        mastered: false, mistakeTopic: topic, mistakeSkill: skill || topic || 'general',
      };
    } else {
      state.vocabularyMastery[mistakeReviewId].incorrect += 1;
      state.vocabularyMastery[mistakeReviewId].repetitions = 0;
      state.vocabularyMastery[mistakeReviewId].interval = 0;
      state.vocabularyMastery[mistakeReviewId].due = getLocalDateKey();
      state.vocabularyMastery[mistakeReviewId].ease = Math.max(1.3, (state.vocabularyMastery[mistakeReviewId].ease || 2.5) - 0.2);
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

/** Max new cards to introduce per session */
const MAX_NEW_CARDS = 10;

/** Max total cards in a daily queue */
const MAX_DAILY_QUEUE = 25;

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

/**
 * Record a flashcard answer with per-rating SM-2 scheduling.
 * rating: 1=Again, 2=Hard, 3=Good, 4=Easy
 * Also accepts boolean for backward compatibility (true=Good, false=Again).
 */
export function recordVocabAnswer(wordId, rating, meta = {}) {
  // Backward compat: if boolean, map to rating
  if (typeof rating === 'boolean') {
    rating = rating ? 3 : 1;
  }
  const mastery = getVocabMastery(wordId);
  const isCorrect = rating >= 3;
  mastery.correct += isCorrect ? 1 : 0;
  mastery.incorrect += isCorrect ? 0 : 1;

  // SM-2 with per-rating intervals
  if (rating === 1) {
    // Again: reset, schedule 10 min relearning (use today as min interval)
    mastery.repetitions = 0;
    mastery.interval = 0;
    mastery.ease = Math.max(1.3, mastery.ease - 0.2);
  } else if (rating === 2) {
    // Hard: 1.2x previous interval but no shorter than 1 day
    if (mastery.repetitions === 0) {
      mastery.interval = 1;
    } else {
      mastery.interval = Math.max(1, Math.round(mastery.interval * 1.2));
    }
    mastery.repetitions += 1;
    mastery.ease = Math.max(1.3, mastery.ease - 0.15);
  } else if (rating === 3) {
    // Good: normal SM-2
    if (mastery.repetitions === 0) {
      mastery.interval = 1;
    } else if (mastery.repetitions === 1) {
      mastery.interval = 6;
    } else {
      mastery.interval = Math.round(mastery.interval * mastery.ease);
    }
    mastery.repetitions += 1;
    mastery.ease = Math.min(3.0, mastery.ease + 0.15);
  } else {
    // Easy: 1.3x bonus on top of SM-2
    if (mastery.repetitions === 0) {
      mastery.interval = 3;
    } else if (mastery.repetitions === 1) {
      mastery.interval = Math.round(6 * 1.3);
    } else {
      mastery.interval = Math.round(mastery.interval * mastery.ease * 1.3);
    }
    mastery.repetitions += 1;
    mastery.ease = Math.min(3.0, mastery.ease + 0.3);
  }

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + mastery.interval);
  mastery.due = getLocalDateKeyFromDate(dueDate);

  // Mark as mastered after 5+ correct
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
  const dueReview = [];
  const mistakeCards = [];
  const newCards = [];

  wordIds.forEach(id => {
    const m = state.vocabularyMastery[id];
    if (!m) {
      // Never seen before = new card
      newCards.push(id);
    } else if (m.due <= today) {
      // Card is due for review (past its scheduled due date)
      // Note: !m.mastered alone does NOT mean due — a card with future due date
      // should NOT appear until that date, even if not yet "mastered".
      if (m.incorrect > m.correct && m.incorrect >= 2) {
        // More wrong than right = mistake priority
        mistakeCards.push(id);
      } else {
        dueReview.push(id);
      }
    }
  });

  // Queue priority: due reviews first, then mistake cards, then new cards
  // Cap total at MAX_DAILY_QUEUE, new cards capped at MAX_NEW_CARDS
  const queue = [];
  queue.push(...dueReview);
  if (queue.length < MAX_DAILY_QUEUE) {
    const mistakeRoom = MAX_DAILY_QUEUE - queue.length;
    queue.push(...mistakeCards.slice(0, mistakeRoom));
  }
  if (queue.length < MAX_DAILY_QUEUE) {
    const newRoom = Math.min(MAX_NEW_CARDS, MAX_DAILY_QUEUE - queue.length);
    queue.push(...newCards.slice(0, newRoom));
  }

  return queue;
}

/**
 * Get cards due by a specific future date (for Tomorrow's plan).
 * Returns cards with due <= targetDate that aren't mastered.
 */
export function getDueByDate(wordIds, targetDate) {
  return wordIds.filter(id => {
    const m = state.vocabularyMastery[id];
    if (!m) return true; // never seen = due by default
    return m.due && m.due <= targetDate;
  });
}

export function getDailyFlashcardQueue(wordIds) {
  return getDueVocabWords(wordIds);
}

/**
 * Build a vocabulary queue for PracticePage respecting SRS state.
 * Returns { dueReviews, mistakeCards, newCards, totalAvailable }.
 * This is the source-of-truth queue for vocabulary practice sessions.
 */
export function getVocabQueue(wordIds) {
  const today = getLocalDateKey();
  const dueReviews = [];
  const mistakeCards = [];
  const newCards = [];

  wordIds.forEach(id => {
    const m = state.vocabularyMastery[id];
    if (!m) {
      newCards.push(id);
    } else if (m.due > today) {
      // Not yet due — skip regardless of mastered status
      // A non-mastered card with a future due date should NOT appear
    } else if (m.incorrect > m.correct && m.incorrect >= 2) {
      mistakeCards.push(id);
    } else if (m.due <= today) {
      dueReviews.push(id);
    }
    // Cards past due but mastered: still include for review (maintenance)
  });

  const all = [...dueReviews, ...mistakeCards, ...newCards];
  return { dueReviews, mistakeCards, newCards, totalAvailable: all.length };
}

/**
 * Check if a word should be excluded from practice based on SRS state.
 * Returns true if the word should NOT be practiced.
 */
export function isVocabPracticeExcluded(wordId) {
  const m = state.vocabularyMastery[wordId];
  if (!m) return false; // never seen = include
  const today = getLocalDateKey();
  return m.due > today;
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

export function recordStudyTime(minutes) {
  const today = getLocalDateKey();
  const amount = Math.max(0, Number(minutes) || 0);
  if (!state.studyLog) state.studyLog = {};
  if (!state.studyLog[today]) state.studyLog[today] = { minutes: 0, sessions: 0 };
  state.studyLog[today].minutes += amount;
  state.studyLog[today].sessions += 1;
  saveState(state);
  return state.studyLog[today];
}

export function getTodayStudyMinutes() {
  const today = getLocalDateKey();
  return Math.round(state.studyLog?.[today]?.minutes || 0);
}

export function getStudyHistory(days = 7) {
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - days + i + 1);
    const key = getLocalDateKeyFromDate(d);
    result.push({ date: key, minutes: state.studyLog?.[key]?.minutes || 0 });
  }
  return result;
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

export function completeWriting(level, exerciseId) {
  if (!state.writingCompleted[level]) {
    state.writingCompleted[level] = [];
  }
  if (!state.writingCompleted[level].includes(exerciseId)) {
    state.writingCompleted[level].push(exerciseId);
  }
  saveState(state);
}

export function completeSpeaking(level, exerciseId) {
  if (!state.speakingCompleted[level]) {
    state.speakingCompleted[level] = [];
  }
  if (!state.speakingCompleted[level].includes(exerciseId)) {
    state.speakingCompleted[level].push(exerciseId);
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

/**
 * Count mastered vocabulary words for a given level.
 * A word is mastered when vocabularyMastery[id].mastered === true
 * or when it has been rated Good/Easy enough times (repetitions >= 2 && interval > 0).
 */
function getVocabMasteredCount(level) {
  if (!state.vocabularyMastery || typeof state.vocabularyMastery !== 'object') return 0;
  let count = 0;
  Object.entries(state.vocabularyMastery).forEach(([id, m]) => {
    if (!id.startsWith(level + '_')) return;
    // Skip mistake-tagged entries — they are reviewed, not mastered vocab
    if (id.startsWith('mistake_')) return;
    if (m.mastered === true) {
      count++;
    } else if (typeof m.repetitions === 'number' && m.repetitions >= 2 && m.interval > 0) {
      // Also count words with enough successful reviews
      count++;
    }
  });
  return count;
}

/**
 * Count correctly completed grammar items for a level.
 * Uses grammarMastery[exerciseId] where mastered=true OR correct > 0 AND no incorrect.
 */
function getGrammarCorrectCount(level) {
  if (!state.grammarMastery || typeof state.grammarMastery !== 'object') return 0;
  let count = 0;
  Object.entries(state.grammarMastery).forEach(([id, m]) => {
    if (!id.startsWith(level + '_')) return;
    if (m.mastered === true) {
      count++;
    } else if (typeof m.correct === 'number' && m.correct > 0 && (!m.incorrect || m.incorrect === 0)) {
      count++;
    }
  });
  return count;
}

/**
 * Count reading items completed all-correct for a level.
 */
function getReadingCorrectCount(level) {
  if (!state.readingCompleted || !state.readingCompleted[level]) return 0;
  return state.readingCompleted[level].length;
}

/**
 * Count listening items completed all-correct for a level.
 */
function getListeningCorrectCount(level) {
  if (!state.listeningCompleted || !state.listeningCompleted[level]) return 0;
  return state.listeningCompleted[level].length;
}

/**
 * Count writing items completed with passing score (>= 8) for a level.
 */
function getWritingPassedCount(level) {
  if (!state.writings) return 0;
  return state.writings.filter(w => w.level === level && typeof w.score === 'number' && w.score >= 8).length;
}

/**
 * Count speaking items completed with passing score (>= 8) for a level.
 */
function getSpeakingPassedCount(level) {
  if (!state.speakingRecordings || !state.speakingRecordings[level]) return 0;
  // speakingRecordings[level] is array of { id, date, score? }
  const items = state.speakingRecordings[level];
  if (!Array.isArray(items)) return 0;
  return items.filter(r => typeof r.score === 'number' ? r.score >= 8 : true).length;
}

/**
 * Count due (unresolved) mistakes for a level.
 */
function getDueMistakeCount(level) {
  const today = getLocalDateKey();
  const mistakes = state.incorrectAnswers[level] || [];
  if (!Array.isArray(mistakes)) return 0;
  let dueCount = 0;
  mistakes.forEach(m => {
    // Check if this mistake has an SM-2 entry indicating it's due
    const mistakeId = 'mistake_' + level + '_' + (m.exerciseId || '');
    const vm = state.vocabularyMastery && state.vocabularyMastery[mistakeId];
    if (vm && vm.due && vm.due <= today && !vm.mastered) {
      dueCount++;
    } else if (!vm && m.dueDate && m.dueDate <= today) {
      dueCount++;
    } else if (!vm && !m.dueDate) {
      // Old-style mistake with no SRS data yet, counts as pending review
      dueCount++;
    }
  });
  return dueCount;
}

/**
 * Get all exam requirements for a level.
 * Returns structured requirement definitions with sensible defaults.
 */
function getLevelExamRequirementDefs(levelData) {
  return {
    lessons: { required: levelData.lessonCount || 25 },
    grammar: { required: levelData.grammarCorrectRequired || 60 },
    reading: { required: levelData.readingCorrectRequired || 25 },
    listening: { required: levelData.listeningCorrectRequired || 25 },
    writing: { required: levelData.minWritingTasks || 10 },
    speaking: { required: levelData.minSpeakingTasks || 10 },
    flashcards: { required: levelData.vocabMasteredRequired || 100 },
    reviews: { requiredDue: 0 },
  };
}

/**
 * Get progress toward exam unlock for a level.
 * Returns { level, unlocked, requirements } shape with current/required/complete per category.
 */
export function getLevelExamProgress(level, levelData) {
  if (!levelData) {
    return { level, unlocked: false, requirements: {} };
  }

  const reqDefs = getLevelExamRequirementDefs(levelData);
  const completedLessons = getCompletedLessons(level).length;
  const grammarCorrect = getGrammarCorrectCount(level);
  const readingCorrect = getReadingCorrectCount(level);
  const listeningCorrect = getListeningCorrectCount(level);
  const writingPassed = getWritingPassedCount(level);
  const speakingPassed = getSpeakingPassedCount(level);
  const vocabMastered = getVocabMasteredCount(level);
  const dueMistakes = getDueMistakeCount(level);

  const requirements = {
    lessons: {
      current: completedLessons,
      required: reqDefs.lessons.required,
      complete: completedLessons >= reqDefs.lessons.required,
    },
    grammar: {
      current: grammarCorrect,
      required: reqDefs.grammar.required,
      complete: grammarCorrect >= reqDefs.grammar.required,
    },
    reading: {
      current: readingCorrect,
      required: reqDefs.reading.required,
      complete: readingCorrect >= reqDefs.reading.required,
    },
    listening: {
      current: listeningCorrect,
      required: reqDefs.listening.required,
      complete: listeningCorrect >= reqDefs.listening.required,
    },
    writing: {
      current: writingPassed,
      required: reqDefs.writing.required,
      complete: writingPassed >= reqDefs.writing.required,
    },
    speaking: {
      current: speakingPassed,
      required: reqDefs.speaking.required,
      complete: speakingPassed >= reqDefs.speaking.required,
    },
    flashcards: {
      current: vocabMastered,
      required: reqDefs.flashcards.required,
      complete: vocabMastered >= reqDefs.flashcards.required,
    },
    reviews: {
      currentDue: dueMistakes,
      requiredDue: reqDefs.reviews.requiredDue,
      complete: true, // Mistakes do not block exam unlock (informational only)
    },
  };

  const allComplete = Object.values(requirements).every(r => r.complete !== false);
  return {
    level,
    unlocked: allComplete,
    requirements,
  };
}

/**
 * Returns the list of missing requirements (those not yet complete).
 */
export function getMissingExamRequirements(level, levelData) {
  const progress = getLevelExamProgress(level, levelData);
  if (progress.unlocked) return [];
  const missing = [];
  Object.entries(progress.requirements).forEach(([key, req]) => {
    if (req.complete === false) {
      missing.push({
        key,
        label: getRequirementLabel(key),
        current: req.current,
        required: req.required,
      });
    }
  });
  return missing;
}

function getRequirementLabel(key) {
  const labels = {
    lessons: 'Lessons',
    grammar: 'Grammar',
    reading: 'Reading',
    listening: 'Listening',
    writing: 'Writing',
    speaking: 'Speaking',
    flashcards: 'Flashcards Mastered',
    reviews: 'Unresolved Review Items',
  };
  return labels[key] || key;
}

/**
 * Legacy wrapper: returns true/false only.
 */
export function isExamUnlocked(level, levelData) {
  if (!levelData) return false;
  const progress = getLevelExamProgress(level, levelData);
  return progress.unlocked;
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

export function getLocalDateKey(offsetDays = 0) {
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

export function getCurrentStudyLevel() {
  const s = getState();
  if (s.startLevel) return s.startLevel;
  if (s.currentLevel) return s.currentLevel;
  return 'A1';
}

export function getTargetLevel() {
  const s = getState();
  if (s.targetLevel && s.targetLevel !== 'Medical FSP') return s.targetLevel;
  return 'C1';
}
