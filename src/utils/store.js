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
  // Flashcard review state
  flashcards: {
    // { 'A1_voc_1': { ease: 2.5, interval: 1, due: '2026-04-30', repetitions: 1 } }
  },
  // Weak areas detected
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
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle new fields
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

// Check if exam is unlocked for a level
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

// Check if next level should be unlocked
export function isLevelUnlocked(levelId, levelsData) {
  const lvl = levelsData.find(l => l.id === levelId);
  if (!lvl) return false;
  if (!lvl.requires) return true; // A1 always unlocked
  const examResult = state.exams[lvl.requires];
  return examResult && examResult.passed;
}

// Update streak
export function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const last = state.streak.lastDate;
  
  if (last === today) {
    // Already counted today
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

// Reset all progress
export function resetAllProgress() {
  state = JSON.parse(JSON.stringify(defaultState));
  saveState(state);
}
