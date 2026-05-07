/**
 * build-pilot-curriculum.cjs
 *
 * One-time script: reads existing A1 data and builds the A1 pilot slice
 * for curriculumMap.json. Does NOT touch the live data files.
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
const grammarCurr = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammarCurriculum.json'), 'utf-8'));

// Load existing curriculum map (schema only, we'll overwrite units+concepts)
const curriculumMapPath = path.join(DATA_DIR, 'curriculumMap.json');
const curriculumMap = JSON.parse(fs.readFileSync(curriculumMapPath, 'utf-8'));

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

// ===== A1 LESSONS =====
const a1Lessons = lessons.filter(l => l.level === 'A1');
for (const lesson of a1Lessons) {
  const conceptId = lesson.conceptId || `a1_lesson_${lesson.id.split('_').pop()}`;

  // Register the lesson's own concept
  addConcept(
    conceptId,
    'A1',
    'lesson',
    lesson.title,
    (lesson.objective || '').substring(0, 200),
    [lesson.id],
    lesson.prerequisiteConceptIds || []
  );

  // Register concepts taught by this lesson
  if (lesson.conceptsTaught && Array.isArray(lesson.conceptsTaught)) {
    for (const ct of lesson.conceptsTaught) {
      addConcept(ct, 'A1', 'lesson', ct, '', [lesson.id], []);
    }
  }

  addUnit({
    id: `A1_lesson_${lesson.id.split('_').pop()}`,
    level: 'A1',
    skill: 'lesson',
    title: lesson.title,
    topic: lesson.conceptId ? lesson.conceptId.split('.').pop().replace(/-/g, ' ') : 'General',
    estimatedMinutes: lesson.estimatedMinutes || 15,
    conceptId,
    taughtConcepts: [conceptId, ...(lesson.conceptsTaught || [])],
    requiredConcepts: lesson.prerequisiteConceptIds || [],
    requiredLessons: [],
    linkedLessonIds: [lesson.id],
    linkedQuestionIds: lesson.linkedQuestionIds || [],
    order: parseInt(lesson.id.split('_').pop(), 10),
    tags: lesson.trackTags || [],
  });
}

// ===== A1 VOCABULARY =====
// Group vocab by taughtInLessonId to create vocab units
const a1Vocab = vocab.A1 || [];
const vocabByLesson = {};
for (const v of a1Vocab) {
  const lessonId = v.taughtInLessonId || v.lessonId || 'unknown';
  if (!vocabByLesson[lessonId]) vocabByLesson[lessonId] = [];
  vocabByLesson[lessonId].push(v);
}

let vocabUnitCounter = 0;
for (const [lessonId, items] of Object.entries(vocabByLesson)) {
  vocabUnitCounter++;
  const lesson = a1Lessons.find(l => l.id === lessonId);
  const conceptId = items[0]?.conceptId || `a1_vocab_unit_${vocabUnitCounter}`;

  addConcept(
    conceptId,
    'A1',
    'vocabulary',
    items[0]?.topic || `Vocabulary ${vocabUnitCounter}`,
    `Vocabulary for ${lesson?.title || lessonId}`,
    items.map(v => v.id),
    lesson?._prerequisiteConceptIds || []
  );

  addUnit({
    id: `A1_vocab_unit_${vocabUnitCounter}`,
    level: 'A1',
    skill: 'vocabulary',
    title: items[0]?.topic || `Vocabulary ${vocabUnitCounter}`,
    topic: items[0]?.topic || 'General',
    estimatedMinutes: Math.ceil(items.length * 1.5),
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: lesson ? (lesson.prerequisiteConceptIds || []) : [],
    requiredLessons: lesson ? [lessonId] : [],
    linkedLessonIds: lesson ? [lessonId] : [],
    linkedQuestionIds: items.map(v => v.id),
    order: lesson ? parseInt(lesson.id.split('_').pop(), 10) : vocabUnitCounter,
    tags: [],
  });
}

// ===== A1 GRAMMAR =====
const a1Grammar = grammar.A1 || [];
const grammarByLesson = {};
for (const g of a1Grammar) {
  const lessonId = g.taughtInLessonId || g.lessonId || 'unknown';
  if (!grammarByLesson[lessonId]) grammarByLesson[lessonId] = [];
  grammarByLesson[lessonId].push(g);
}

let grammarUnitCounter = 0;
for (const [lessonId, items] of Object.entries(grammarByLesson)) {
  grammarUnitCounter++;
  const lesson = a1Lessons.find(l => l.id === lessonId);
  const conceptId = items[0]?.conceptId || `a1_grammar_unit_${grammarUnitCounter}`;

  addConcept(
    conceptId,
    'A1',
    'grammar',
    items[0]?.topic || `Grammar ${grammarUnitCounter}`,
    items[0]?.explanation?.substring(0, 100) || '',
    items.map(g => g.id),
    items[0]?.prerequisiteConceptIds || []
  );

  addUnit({
    id: `A1_grammar_unit_${grammarUnitCounter}`,
    level: 'A1',
    skill: 'grammar',
    title: items[0]?.topic || `Grammar ${grammarUnitCounter}`,
    topic: items[0]?.topic || 'Grammar',
    estimatedMinutes: Math.ceil(items.length * 2),
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: items[0]?.prerequisiteConceptIds || [],
    requiredLessons: lesson ? [lessonId] : [],
    linkedLessonIds: lesson ? [lessonId] : [],
    linkedQuestionIds: items.map(g => g.id),
    order: lesson ? parseInt(lesson.id.split('_').pop(), 10) : grammarUnitCounter,
    tags: ['grammar-exercise'],
  });
}

// ===== A1 READING =====
const a1Reading = reading.A1 || [];
for (const item of a1Reading) {
  const lesson = a1Lessons.find(l => l.id === item.lessonId);
  const conceptId = `a1_read_${item.id.split('_').pop()}`;
  addConcept(
    conceptId,
    'A1',
    'reading',
    item.title,
    (item.text || '').substring(0, 100),
    [item.id],
    lesson ? (lesson.prerequisiteConceptIds || []) : []
  );
  addUnit({
    id: item.id,
    level: 'A1',
    skill: 'reading',
    title: item.title,
    topic: lesson?.title || 'Reading',
    estimatedMinutes: 12,
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: lesson ? (lesson.prerequisiteConceptIds || []) : [],
    requiredLessons: item.lessonId ? [item.lessonId] : [],
    linkedLessonIds: item.lessonId ? [item.lessonId] : [],
    linkedQuestionIds: (item.questions || []).map(q => `${item.id}_${q.id}`),
    order: parseInt(item.id.split('_').pop(), 10),
    tags: [],
  });
}

// ===== A1 LISTENING =====
const a1Listening = listening.A1 || [];
for (const item of a1Listening) {
  const lesson = a1Lessons.find(l => l.id === item.lessonId);
  const conceptId = `a1_listen_${item.id.split('_').pop()}`;
  addConcept(
    conceptId,
    'A1',
    'listening',
    item.title,
    (item.script || '').substring(0, 100),
    [item.id],
    lesson ? (lesson.prerequisiteConceptIds || []) : []
  );
  addUnit({
    id: item.id,
    level: 'A1',
    skill: 'listening',
    title: item.title,
    topic: lesson?.title || 'Listening',
    estimatedMinutes: 12,
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: lesson ? (lesson.prerequisiteConceptIds || []) : [],
    requiredLessons: item.lessonId ? [item.lessonId] : [],
    linkedLessonIds: item.lessonId ? [item.lessonId] : [],
    linkedQuestionIds: (item.questions || []).map(q => `${item.id}_${q.id}`),
    order: parseInt(item.id.split('_').pop(), 10),
    tags: [],
  });
}

// ===== A1 WRITING =====
const a1Writing = writing.A1 || [];
for (const item of a1Writing) {
  const lesson = a1Lessons.find(l => l.id === item.lessonId);
  const conceptId = `a1_write_${item.id.split('_').pop()}`;
  addConcept(
    conceptId,
    'A1',
    'writing',
    item.title,
    (item.prompt || '').substring(0, 100),
    [item.id],
    lesson ? (lesson.prerequisiteConceptIds || []) : []
  );
  addUnit({
    id: item.id,
    level: 'A1',
    skill: 'writing',
    title: item.title,
    topic: lesson?.title || 'Writing',
    estimatedMinutes: (item.wordLimit || 100) > 80 ? 18 : 12,
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: lesson ? (lesson.prerequisiteConceptIds || []) : [],
    requiredLessons: item.lessonId ? [item.lessonId] : [],
    linkedLessonIds: item.lessonId ? [item.lessonId] : [],
    order: parseInt(item.id.split('_').pop(), 10),
    tags: [],
  });
}

// ===== A1 SPEAKING =====
const a1Speaking = speaking.A1 || [];
for (const item of a1Speaking) {
  const lesson = a1Lessons.find(l => l.id === item.lessonId);
  const conceptId = `a1_speak_${item.id.split('_').pop()}`;
  addConcept(
    conceptId,
    'A1',
    'speaking',
    item.title,
    (item.prompt || '').substring(0, 100),
    [item.id],
    lesson ? (lesson.prerequisiteConceptIds || []) : []
  );
  addUnit({
    id: item.id,
    level: 'A1',
    skill: 'speaking',
    title: item.title,
    topic: lesson?.title || 'Speaking',
    estimatedMinutes: ((item.prepTime || 0) + (item.talkTime || 0)) / 60 + 5,
    conceptId,
    taughtConcepts: [conceptId],
    requiredConcepts: lesson ? (lesson.prerequisiteConceptIds || []) : [],
    requiredLessons: item.lessonId ? [item.lessonId] : [],
    linkedLessonIds: item.lessonId ? [item.lessonId] : [],
    order: parseInt(item.id.split('_').pop(), 10),
    tags: [],
  });
}

// ===== WRITE THE MAP =====
curriculumMap.version = 2;
curriculumMap.lastUpdated = new Date().toISOString().split('T')[0];
curriculumMap.units = units;
curriculumMap.concepts = concepts;
// Build prerequisite graph automatically from concepts
curriculumMap.prerequisiteGraph = concepts
  .filter(c => c.prerequisites && c.prerequisites.length > 0)
  .map(c => ({
    conceptId: c.id,
    requires: c.prerequisites,
    blocks: concepts.filter(other => other.prerequisites?.includes(c.id)).map(o => o.id),
  }));

fs.writeFileSync(curriculumMapPath, JSON.stringify(curriculumMap, null, 2), 'utf-8');
console.log(`Curriculum map updated: ${units.length} units, ${concepts.length} concepts, ${curriculumMap.prerequisiteGraph.length} graph edges`);
console.log(`  A1 lessons: ${a1Lessons.length}`);
console.log(`  A1 vocab units (by lesson): ${vocabUnitCounter}`);
console.log(`  A1 grammar units (by lesson): ${grammarUnitCounter}`);
console.log(`  A1 reading items: ${a1Reading.length}`);
console.log(`  A1 listening items: ${a1Listening.length}`);
console.log(`  A1 writing items: ${a1Writing.length}`);
console.log(`  A1 speaking items: ${a1Speaking.length}`);
