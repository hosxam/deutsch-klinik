/**
 * LocalStorage-based state management.
 * All user progress, scores, settings saved here.
 * To reset: clear localStorage and reload.
 */
const STORE_KEY = 'deutsch_klinik_state';

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
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...JSON.parse(JSON.stringify(defaultState)), ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load state, resetting.', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
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
  state = { ...state, ...partial };
  saveState(state);
}

export function updateLevelProgress(level, key, data) {
  if (!state.levels[level]) {
    state.levels[level] = {};
  }
  if (!state.levels[level][key]) {
    state.levels[level][key] = [];
  }
  state.levels[level][key].push(data);
  saveState(state);
}

export function setLevelProgress(level, key, arr) {
  if (!state.levels[level]) {
    state.levels[level] = {};
  }
  state.levels[level][key] = arr;
  saveState(state);
}

export function getLevelProgress(level, key) {
  if (!state.levels[level]) return [];
  return state.levels[level][key] || [];
}

// ===== LESSON TRACKING =====

export function completeLesson(level, lessonId) {
  if (!state.completedLessons[level]) {
    state.completedLessons[level] = [];
  }
  if (!state.completedLessons[level].includes(lessonId)) {
    state.completedLessons[level].push(lessonId);
  }
  saveState(state);
}

export function isLessonCompleted(level, lessonId) {
  return state.completedLessons[level]?.includes(lessonId) || false;
}

export function getCompletedLessons(level) {
  return state.completedLessons[level] || [];
}

// ===== ANSWER TRACKING =====

export function recordAnswer(level, exerciseId, userAnswer, correctAnswer, topic, isCorrect) {
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
        topic,
        userAnswer,
        correctAnswer,
        level,
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
    due: new Date().toISOString().split('T')[0],
    repetitions: 0,
  };
}

export function recordVocabAnswer(wordId, isCorrect) {
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
  mastery.due = dueDate.toISOString().split('T')[0];

  // Mark as mastered after 5+ correct with ease >= 2.5
  mastery.mastered = mastery.correct >= 5 && mastery.ease >= 2.5;

  state.vocabularyMastery[wordId] = mastery;
  saveState(state);
  return mastery;
}

export function getDueVocabWords(wordIds) {
  const today = new Date().toISOString().split('T')[0];
  return wordIds.filter(id => {
    const m = state.vocabularyMastery[id];
    return !m || m.due <= today || !m.mastered;
  });
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
    .filter(([_, t]) => t.status === 'weak' || t.status === 'improving')
    .sort((a, b) => a[1].status === 'weak' ? -1 : 1)
    .map(([topic, data]) => ({ topic, ...data }));
}

export function getMistakesByTopic(topic) {
  return Object.values(state.mistakeNotebook).filter(m => m.topic === topic);
}

export function getMistakesByLevel(level) {
  return state.incorrectAnswers[level] || [];
}

// ===== EXAM UNLOCK CHECK =====

export function isExamUnlocked(level, levelData) {
  const prog = state.levels[level];
  if (!prog) return false;

  const grammarDone = (prog.grammar && prog.grammar.length >= levelData.grammarUnits) || false;
  const vocabDone = (prog.vocab && prog.vocab.length >= levelData.vocabularyUnits) || false;
  const quizScores = prog.quizzes || [];
  const avgQuizScore = quizScores.length > 0 
    ? quizScores.reduce((a, b) => a + b.score, 0) / quizScores.length * 100
    : 0;
  const quizzesPass = avgQuizScore >= levelData.miniQuizzesMinScore;
  const writingsDone = (state.writings || []).filter(w => w.level === level).length >= levelData.minWritingTasks;
  const speakingDone = (state.speakingRecordings[level] || []).length >= levelData.minSpeakingTasks;
  const listeningDone = (prog.listening || []).length >= levelData.minListeningTests;
  const readingDone = (prog.reading || []).length >= levelData.minReadingTests;

  return grammarDone && vocabDone && quizzesPass && writingsDone && speakingDone && listeningDone && readingDone;
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

export function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const last = state.streak.lastDate;
  
  if (last === today) {
    return;
  }
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
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
