/**
 * build-pilot-curriculum.cjs
 *
 * Reads existing A1-C1 data and builds the full curriculum map
 * for curriculumMap.json. Uses sequential lesson ordering for
 * prerequisites since lessons don't have explicit prerequisite metadata.
 *
 * Strategy:
 * - Lesson N requires lesson N-1 in the same level (if order > 1)
 * - Grammar/vocab units require their linked lesson
 * - Reading/listening/writing/speaking items require their linked lesson
 * - Items with no linked lesson are excluded from the map
 *
 * Run: node scripts/build-pilot-curriculum.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const lessons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanLessons.json'), 'utf-8'));
const vocab = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar.json'), 'utf-8'));
const reading = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'reading.json'), 'utf-8'));
const listening = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'listening.json'), 'utf-8'));
const writing = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'writing.json'), 'utf-8'));
const speaking = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'speaking.json'), 'utf-8'));

const curriculumMapPath = path.join(DATA_DIR, 'curriculumMap.json');

// Valid levels (skip FSP — no content yet)
const ALL_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const VALID_SKILLS = ['lesson', 'vocabulary', 'grammar', 'reading', 'listening', 'writing', 'speaking'];

// ==================== HELPERS ====================

/** Extract lesson order number from a lesson ID like 'A1_lesson_3' */
function getLessonOrder(lessonId) {
  const parts = (lessonId || '').split('_');
  return parseInt(parts[parts.length - 1], 10) || 0;
}

/** Get the lesson ID from an item (supports both lessonId and taughtInLessonId) */
function getItemLessonId(item) {
  return item.taughtInLessonId || item.lessonId || null;
}

/** Get lessons for a given level */
function getLessonsForLevel(lvl) {
  return lessons.filter(l => l.level === lvl).sort((a, b) => getLessonOrder(a.id) - getLessonOrder(b.id));
}

/** Conservative default estimated minutes by lesson order */
function getLessonEstimatedMinutes(lesson) {
  if (lesson && lesson.estimatedMinutes) return lesson.estimatedMinutes;
  // Default: 15 min for early lessons, 20 min for later ones
  const order = getLessonOrder(lesson?.id || '');
  if (order <= 5) return 15;
  if (order <= 10) return 18;
  if (order <= 15) return 20;
  return 22;
}

/** Get default estimated minutes for different skill types */
function getSkillEstimatedMinutes(skill, item) {
  if (skill === 'reading') return 12;
  if (skill === 'listening') return 12;
  if (skill === 'writing') {
    const wl = item?.wordLimit || 0;
    return wl > 80 ? 18 : 12;
  }
  if (skill === 'speaking') {
    const prep = item?.prepTime || 0;
    const talk = item?.talkTime || 0;
    const mins = Math.ceil((prep + talk) / 60) + 5;
    return Math.max(5, mins);
  }
  if (skill === 'vocabulary') return 10;
  if (skill === 'grammar') return 10;
  return 12;
}

/** Build requiredLessons for a unit based on its linked lesson and level order */
function buildRequiredLessons(linkedLessonId) {
  if (!linkedLessonId) return [];
  const order = getLessonOrder(linkedLessonId);
  // Require the linked lesson + the previous lesson if order > 1
  if (order <= 1) return [linkedLessonId];
  const level = linkedLessonId.substring(0, 2);
  // Previous lesson for progressive foundation
  return [linkedLessonId, `${level}_lesson_${order - 1}`];
}

/**
 * Sanitize a string for use as a conceptId prefix.
 * Keeps lowercase alphanumeric and underscores/hyphens.
 */
function sanitize(str) {
  if (!str) return 'unknown';
  return str.toLowerCase()
    .replace(/[^a-z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 60);
}

// ==================== MAIN GENERATION ====================

const units = [];
const concepts = [];
const seenConcepts = new Set();
const seenUnits = new Set();

function addConcept(id, level, skill, label, description, taughtIn, prerequisites) {
  if (seenConcepts.has(id)) return;
  seenConcepts.add(id);
  concepts.push({
    id,
    level,
    skill,
    label: label || id.split('.').pop().replace(/-/g, ' '),
    description: description || '',
    taughtIn: taughtIn || [],
    prerequisites: prerequisites || [],
  });
}

function addUnit(unit) {
  if (seenUnits.has(unit.id)) return;
  seenUnits.add(unit.id);
  units.push(unit);
}

// ==================== PROCESS EACH LEVEL ====================

const stats = { lessons: 0, vocab: 0, grammar: 0, reading: 0, listening: 0, writing: 0, speaking: 0 };

for (const lvl of ALL_LEVELS) {
  const lvlLessons = getLessonsForLevel(lvl);
  const lvlPrefix = lvl.toLowerCase();

  // ---- LESSONS ----
  for (const lesson of lvlLessons) {
    const order = getLessonOrder(lesson.id);
    const conceptId = lesson.conceptId || `${lvlPrefix}_lesson_${order}`;

    // A1 might have conceptId; for A2-C1 generate from title
    const titleSlug = sanitize(lesson.title || `Lesson ${order}`);

    // Register concept
    addConcept(
      conceptId,
      lvl,
      'lesson',
      lesson.title,
      (lesson.objective || '').substring(0, 200),
      [lesson.id],
      []  // A2-C1 have no prerequisite metadata
    );

    // Register any conceptsTaught (A1 only, but safe for all)
    if (lesson.conceptsTaught && Array.isArray(lesson.conceptsTaught)) {
      for (const ct of lesson.conceptsTaught) {
        addConcept(ct, lvl, 'lesson', ct, '', [lesson.id], []);
      }
    }

    // Build requiredLessons: lesson N requires lesson N-1 (sequential)
    const reqLessons = order > 1 ? [`${lvl}_lesson_${order - 1}`] : [];

    addUnit({
      id: lesson.id,
      level: lvl,
      skill: 'lesson',
      title: lesson.title,
      topic: titleSlug.replace(/_/g, ' ') || 'General',
      estimatedMinutes: getLessonEstimatedMinutes(lesson),
      conceptId,
      taughtConcepts: [conceptId, ...(lesson.conceptsTaught || [])],
      requiredConcepts: lesson.prerequisiteConceptIds || [],
      requiredLessons: reqLessons,
      linkedLessonIds: [lesson.id],
      linkedQuestionIds: lesson.linkedQuestionIds || [],
      order,
      tags: lesson.trackTags || [],
    });
    stats.lessons++;
  }

  // ---- VOCABULARY (grouped by taughtInLessonId) ----
  const lvlValidLessons = new Set(lvlLessons.map(l => l.id));
  const lvlVocab = vocab[lvl] || [];
  const vocabByLesson = {};
  for (const v of lvlVocab) {
    const lessonId = getItemLessonId(v);
    if (!lessonId) continue; // skip items without a lesson link
    if (!lvlValidLessons.has(lessonId)) continue; // skip items linked to non-existent lessons
    if (!vocabByLesson[lessonId]) vocabByLesson[lessonId] = [];
    vocabByLesson[lessonId].push(v);
  }

  for (const [lessonId, items] of Object.entries(vocabByLesson)) {
    const lesson = lvlLessons.find(l => l.id === lessonId);
    const order = getLessonOrder(lessonId);
    const conceptId = items[0]?.conceptId || `${lvlPrefix}_vocab_les${order}`;
    const topicTitle = items[0]?.topic || lesson?.title || `Vocabulary Lesson ${order}`;

    addConcept(
      conceptId,
      lvl,
      'vocabulary',
      topicTitle,
      `Vocabulary for ${lesson?.title || lessonId}`,
      items.map(v => v.id),
      []
    );

    addUnit({
      id: `${lvl}_vocab_les${order}`,
      level: lvl,
      skill: 'vocabulary',
      title: topicTitle,
      topic: topicTitle,
      estimatedMinutes: getSkillEstimatedMinutes('vocabulary', items[0]),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: [],
      requiredLessons: buildRequiredLessons(lessonId),
      linkedLessonIds: lesson ? [lessonId] : [],
      linkedQuestionIds: items.map(v => v.id),
      order,
      tags: [],
    });
    stats.vocab++;
  }

  // ---- GRAMMAR (grouped by taughtInLessonId) ----
  const lvlGrammar = grammar[lvl] || [];
  const grammarByLesson = {};
  for (const g of lvlGrammar) {
    const lessonId = getItemLessonId(g);
    if (!lessonId) continue;
    if (!lvlValidLessons.has(lessonId)) continue; // skip items linked to non-existent lessons
    if (!grammarByLesson[lessonId]) grammarByLesson[lessonId] = [];
    grammarByLesson[lessonId].push(g);
  }

  for (const [lessonId, items] of Object.entries(grammarByLesson)) {
    const lesson = lvlLessons.find(l => l.id === lessonId);
    const order = getLessonOrder(lessonId);
    const conceptId = items[0]?.conceptId || `${lvlPrefix}_grammar_les${order}`;
    const topicTitle = items[0]?.topic || lesson?.grammarFocus?.[0] || `Grammar Lesson ${order}`;

    addConcept(
      conceptId,
      lvl,
      'grammar',
      topicTitle,
      (items[0]?.explanation || '').substring(0, 100),
      items.map(g => g.id),
      []
    );

    addUnit({
      id: `${lvl}_grammar_les${order}`,
      level: lvl,
      skill: 'grammar',
      title: topicTitle,
      topic: topicTitle,
      estimatedMinutes: getSkillEstimatedMinutes('grammar', items[0]),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: items[0]?.prerequisiteConceptIds || [],
      requiredLessons: buildRequiredLessons(lessonId),
      linkedLessonIds: lesson ? [lessonId] : [],
      linkedQuestionIds: items.map(g => g.id),
      order,
      tags: ['grammar-exercise'],
    });
    stats.grammar++;
  }

  // ---- READING ----
  const lvlReading = reading[lvl] || [];
  for (const item of lvlReading) {
    if (!item.lessonId) continue;
    const lesson = lvlLessons.find(l => l.id === item.lessonId);
    const order = parseInt(item.id.split('_').pop(), 10) || getLessonOrder(item.lessonId);
    const conceptId = `${lvlPrefix}_read_${order}`;
    addConcept(
      conceptId,
      lvl,
      'reading',
      item.title,
      (item.text || '').substring(0, 100),
      [item.id],
      []
    );
    // Generate question IDs from the item's questions array
    const questionIds = (item.questions || []).map((q, idx) => {
      // Use existing question id if available, otherwise generate one
      return q.id || `${item.id}_q${idx + 1}`;
    });

    addUnit({
      id: item.id,
      level: lvl,
      skill: 'reading',
      title: item.title,
      topic: lesson?.title || 'Reading',
      estimatedMinutes: getSkillEstimatedMinutes('reading', item),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: [],
      requiredLessons: buildRequiredLessons(item.lessonId),
      linkedLessonIds: item.lessonId ? [item.lessonId] : [],
      linkedQuestionIds: questionIds,
      order,
      tags: [],
    });
    stats.reading++;
  }

  // ---- LISTENING ----
  const lvlListening = listening[lvl] || [];
  for (const item of lvlListening) {
    if (!item.lessonId) continue;
    const lesson = lvlLessons.find(l => l.id === item.lessonId);
    const order = parseInt(item.id.split('_').pop(), 10) || getLessonOrder(item.lessonId);
    const conceptId = `${lvlPrefix}_listen_${order}`;
    addConcept(
      conceptId,
      lvl,
      'listening',
      item.title,
      (item.script || '').substring(0, 100),
      [item.id],
      []
    );
    const questionIds = (item.questions || []).map((q, idx) => q.id || `${item.id}_q${idx + 1}`);

    addUnit({
      id: item.id,
      level: lvl,
      skill: 'listening',
      title: item.title,
      topic: lesson?.title || 'Listening',
      estimatedMinutes: getSkillEstimatedMinutes('listening', item),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: [],
      requiredLessons: buildRequiredLessons(item.lessonId),
      linkedLessonIds: item.lessonId ? [item.lessonId] : [],
      linkedQuestionIds: questionIds,
      order,
      tags: [],
    });
    stats.listening++;
  }

  // ---- WRITING ----
  const lvlWriting = writing[lvl] || [];
  for (const item of lvlWriting) {
    if (!item.lessonId) continue;
    const lesson = lvlLessons.find(l => l.id === item.lessonId);
    const order = parseInt(item.id.split('_').pop(), 10) || getLessonOrder(item.lessonId);
    const conceptId = `${lvlPrefix}_write_${order}`;
    addConcept(
      conceptId,
      lvl,
      'writing',
      item.title,
      (item.prompt || '').substring(0, 100),
      [item.id],
      []
    );

    addUnit({
      id: item.id,
      level: lvl,
      skill: 'writing',
      title: item.title,
      topic: lesson?.title || 'Writing',
      estimatedMinutes: getSkillEstimatedMinutes('writing', item),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: [],
      requiredLessons: buildRequiredLessons(item.lessonId),
      linkedLessonIds: item.lessonId ? [item.lessonId] : [],
      order,
      tags: [],
    });
    stats.writing++;
  }

  // ---- SPEAKING ----
  const lvlSpeaking = speaking[lvl] || [];
  for (const item of lvlSpeaking) {
    if (!item.lessonId) continue;
    const lesson = lvlLessons.find(l => l.id === item.lessonId);
    const order = parseInt(item.id.split('_').pop(), 10) || getLessonOrder(item.lessonId);
    const conceptId = `${lvlPrefix}_speak_${order}`;
    addConcept(
      conceptId,
      lvl,
      'speaking',
      item.title,
      (item.prompt || '').substring(0, 100),
      [item.id],
      []
    );

    addUnit({
      id: item.id,
      level: lvl,
      skill: 'speaking',
      title: item.title,
      topic: lesson?.title || 'Speaking',
      estimatedMinutes: getSkillEstimatedMinutes('speaking', item),
      conceptId,
      taughtConcepts: [conceptId],
      requiredConcepts: [],
      requiredLessons: buildRequiredLessons(item.lessonId),
      linkedLessonIds: item.lessonId ? [item.lessonId] : [],
      order,
      tags: [],
    });
    stats.speaking++;
  }
}

// Sort units: first by level, then by order, then by skill priority
const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
const SKILL_ORDER = ['lesson', 'vocabulary', 'grammar', 'reading', 'listening', 'writing', 'speaking'];

units.sort((a, b) => {
  const lvlDiff = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
  if (lvlDiff !== 0) return lvlDiff;
  const orderDiff = (a.order || 999) - (b.order || 999);
  if (orderDiff !== 0) return orderDiff;
  return SKILL_ORDER.indexOf(a.skill) - SKILL_ORDER.indexOf(b.skill);
});

// Build prerequisite graph from concepts
const prerequisiteGraph = concepts
  .filter(c => c.prerequisites && c.prerequisites.length > 0)
  .map(c => ({
    conceptId: c.id,
    requires: c.prerequisites,
    blocks: concepts.filter(other => other.prerequisites?.includes(c.id)).map(o => o.id),
  }));

// ==================== LOAD EXISTING MAP AND MERGE ====================

let curriculumMap;
try {
  curriculumMap = JSON.parse(fs.readFileSync(curriculumMapPath, 'utf-8'));
} catch (e) {
  curriculumMap = { version: 1, lastUpdated: '', description: '', units: [], concepts: [], prerequisiteGraph: [] };
}

curriculumMap.version = (curriculumMap.version || 0) + 1;
curriculumMap.lastUpdated = new Date().toISOString().split('T')[0];
curriculumMap.description = 'Full curriculum map for A1-C1. Generated from existing lesson, vocabulary, grammar, reading, listening, writing, and speaking data.';
curriculumMap.units = units;
curriculumMap.concepts = concepts;
curriculumMap.prerequisiteGraph = prerequisiteGraph;

fs.writeFileSync(curriculumMapPath, JSON.stringify(curriculumMap, null, 2), 'utf-8');

// ==================== REPORT ====================

console.log('=== Curriculum Map Generation ===');
console.log(`Total units: ${units.length}`);
console.log(`Total concepts: ${concepts.length}`);
console.log(`Prerequisite graph edges: ${prerequisiteGraph.length}`);
console.log('');
console.log('By level:');
const levelCounts = {};
units.forEach(u => { levelCounts[u.level] = (levelCounts[u.level] || 0) + 1; });
for (const lvl of LEVEL_ORDER) {
  console.log(`  ${lvl}: ${levelCounts[lvl] || 0} units`);
}
console.log('');
console.log('By skill:');
const skillCounts = {};
units.forEach(u => { skillCounts[u.skill] = (skillCounts[u.skill] || 0) + 1; });
for (const skill of SKILL_ORDER) {
  console.log(`  ${skill}: ${skillCounts[skill] || 0}`);
}
console.log('');
console.log('Stats by level:');
for (const lvl of LEVEL_ORDER) {
  const lvlUnits = units.filter(u => u.level === lvl);
  const bySkill = {};
  lvlUnits.forEach(u => { bySkill[u.skill] = (bySkill[u.skill] || 0) + 1; });
  console.log(`  ${lvl}: ${JSON.stringify(bySkill)}`);
}
