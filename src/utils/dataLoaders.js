/**
 * Data Loaders - Dynamic per-level data loading with in-memory cache.
 *
 * Each loader uses dynamic import() so Vite automatically code-splits
 * level-specific JSON files into separate chunks.
 *
 * Usage:
 *   import { loadLevelVocabulary, loadAllVocabulary, clearDataCache } from '../utils/dataLoaders';
 *   const vocab = await loadLevelVocabulary('A1');
 */

const cache = new Map();

/** @param {string} level - 'A1'|'A2'|'B1'|'B2'|'C1' */
export async function loadLevelVocabulary(level) {
  const key = `vocab_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/vocabulary.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelGrammar(level) {
  const key = `grammar_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/grammar.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelLessons(level) {
  const key = `lessons_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/lessons.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelReading(level) {
  const key = `reading_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/reading.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelListening(level) {
  const key = `listening_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/listening.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelWriting(level) {
  const key = `writing_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/writing.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelSpeaking(level) {
  const key = `speaking_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/speaking.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelCurriculum(level) {
  const key = `curriculum_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/curriculumMap.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadLevelExams(level) {
  const key = `exams_${level}`;
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/${level}/exams.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadExams() {
  const key = 'exams_all';
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/exams.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

export async function loadDashboardSummary() {
  const key = 'dashboard_summary';
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/levels/dashboardSummary.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

/** Load all data for a specific level at once. Returns an object with all data types. */
export async function loadLevelData(level) {
  const [vocabulary, grammar, lessons, reading, listening, writing, speaking, curriculum, exams] =
    await Promise.all([
      loadLevelVocabulary(level),
      loadLevelGrammar(level),
      loadLevelLessons(level),
      loadLevelReading(level),
      loadLevelListening(level),
      loadLevelWriting(level),
      loadLevelSpeaking(level),
      loadLevelCurriculum(level),
      loadLevelExams(level),
    ]);
  return { vocabulary, grammar, lessons, reading, listening, writing, speaking, curriculum, exams };
}

/** Load only the per-level data types needed by mission-style pages (no curriculum). */
export async function loadLevelPracticeData(level) {
  const [vocabulary, grammar, reading, listening, writing, speaking] =
    await Promise.all([
      loadLevelVocabulary(level),
      loadLevelGrammar(level),
      loadLevelReading(level),
      loadLevelListening(level),
      loadLevelWriting(level),
      loadLevelSpeaking(level),
    ]);
  return { vocabulary, grammar, reading, listening, writing, speaking };
}

/** Load all vocabulary across all levels. Returns { A1: [...], A2: [...], B1: [...], B2: [...], C1: [...] }. */
export async function loadAllVocabulary() {
  const key = 'vocab_all';
  if (cache.has(key)) return cache.get(key);
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const results = await Promise.all(levels.map(l => loadLevelVocabulary(l)));
  const data = {};
  levels.forEach((l, i) => { data[l] = results[i]; });
  cache.set(key, data);
  return data;
}

/**
 * Preload vocabulary for the given level (async fire-and-forget).
 * Useful for predictive loading before the user navigates to a vocab page.
 */
export function preloadVocabularyForCurrentLevel(level) {
  loadLevelVocabulary(level).catch(() => {});
}

/** Load FSP vocabulary via dynamic import. Returns array of word objects. */
export async function loadFspVocabulary() {
  const key = 'fsp_vocab';
  if (cache.has(key)) return cache.get(key);
  const mod = await import(`../data/fspVocabulary.json`);
  const data = mod.default || mod;
  cache.set(key, data);
  return data;
}

/** Clear all cached data. Useful on level change. */
export function clearDataCache() {
  cache.clear();
}
