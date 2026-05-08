/**
 * localStorageAdapter.js
 *
 * Wraps existing store.js functions into a consistent interface.
 * This is the LOCAL storage backend for the progress adapter.
 */
import {
  getState, updateState, resetAllProgress,
  completeLesson, getCompletedLessons,
  completeListening, completeReading,
  getGrammarMastery, recordGrammarAnswer,
  getVocabMastery, recordVocabAnswer,
  updateStreak, recordStudyMinutes, recordStudyTime,
  completeGrammarLesson, getCompletedGrammarLessons,
  getMistakesByLevel, getMistakeNotebookItems, clearMistakeByIndex, markMistakeMasteredById,
  getWeakTopics, getMistakesByTopic,
  addRemediationRecommendation
} from './store';

export const localStorageAdapter = {
  getState() { return getState(); },
  updateState(partial) { updateState(partial); },
  resetAll() { resetAllProgress(); },

  completeLesson(level, lessonId) { completeLesson(level, lessonId); },
  getCompletedLessons(level) { return getCompletedLessons(level); },

  getGrammarMastery(exerciseId) { return getGrammarMastery(exerciseId); },
  recordGrammarAnswer(exerciseId, isCorrect) { return recordGrammarAnswer(exerciseId, isCorrect); },
  completeGrammarLesson(level, lessonId) { completeGrammarLesson(level, lessonId); },
  getCompletedGrammarLessons(level) { return getCompletedGrammarLessons(level); },

  getVocabMastery(wordId) { return getVocabMastery(wordId); },
  recordVocabAnswer(wordId, isCorrect, meta) { return recordVocabAnswer(wordId, isCorrect, meta); },

  completeListening(level, exerciseId) { completeListening(level, exerciseId); },
  completeReading(level, exerciseId) { completeReading(level, exerciseId); },

  updateStreak() { updateStreak(); },
  recordStudyMinutes(data) { recordStudyMinutes(data); },
  recordStudyTime(minutes) { recordStudyTime(minutes); },

  getMistakesByLevel(level) { return getMistakesByLevel(level); },
  getMistakeNotebookItems(level, skill) { return getMistakeNotebookItems(level, skill); },
  clearMistakeByIndex(level, index) { clearMistakeByIndex(level, index); },
  markMistakeMasteredById(level, exerciseId) { markMistakeMasteredById(level, exerciseId); },

  getWeakTopics() { return getWeakTopics(); },
  getMistakesByTopic(topic) { return getMistakesByTopic(topic); },

  type: 'local',
  isOnline: () => true,
  getName: () => 'Local Storage',
};
