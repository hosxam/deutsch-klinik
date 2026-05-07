/**
 * validate-teach-before-test.cjs
 *
 * Validates that the teach-before-test engine would correctly filter content:
 * - Checks that all lesson-linked items in the curriculum map are accessible
 * - Cross-references data files against curriculum map
 * - Reports items that would be in the daily mission but whose prerequisites aren't met
 *
 * Run: node scripts/validate-teach-before-test.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const curriculumMap = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculumMap.json'), 'utf-8'));
const lessons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanLessons.json'), 'utf-8'));
const vocab = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar.json'), 'utf-8'));
const reading = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'reading.json'), 'utf-8'));
const listening = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'listening.json'), 'utf-8'));
const writing = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'writing.json'), 'utf-8'));
const speaking = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'speaking.json'), 'utf-8'));

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'FSP'];
const errors = [];
const warnings = [];

function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// Build a map from lessonId -> lesson
const lessonById = {};
for (const lesson of lessons) {
  lessonById[lesson.id] = lesson;
}

// Build a map from level -> data items
const dataByLevel = {};
dataByLevel['A1'] = {};
dataByLevel['A2'] = {};
dataByLevel['B1'] = {};
dataByLevel['B2'] = {};
dataByLevel['C1'] = {};

for (const level of VALID_LEVELS) {
  const v = vocab[level] || [];
  const g = grammar[level] || [];
  const r = reading[level] || [];
  const l = listening[level] || [];
  const w = writing[level] || [];
  const s = speaking[level] || [];

  dataByLevel[level] = { vocab: v, grammar: g, reading: r, listening: l, writing: w, speaking: s };
}

// ===== 1. Check that every lesson referenced in curriculumMap exists =====
const units = curriculumMap.units || [];

for (const unit of units) {
  for (const lid of (unit.linkedLessonIds || [])) {
    if (!lessonById[lid]) {
      error(`Unit ${unit.id}: linkedLessonId "${lid}" does not exist in germanLessons.json`);
    }
  }
}

// ===== 2. Check that linkedQuestionIds reference real data items =====
const allDataItemsById = {};
for (const level of VALID_LEVELS) {
  for (const key of ['vocab', 'grammar', 'reading', 'listening', 'writing', 'speaking']) {
    for (const item of (dataByLevel[level]?.[key] || [])) {
      allDataItemsById[item.id] = { ...item, dataLevel: level, dataKey: key };
      // Also index by question sub-IDs for reading/listening
      if (item.questions) {
        for (const q of item.questions) {
          allDataItemsById[`${item.id}_${q.id}`] = {
            id: q.id,
            parentId: item.id,
            dataLevel: level,
            dataKey: key,
          };
        }
      }
    }
  }
}

for (const unit of units) {
  for (const qid of (unit.linkedQuestionIds || [])) {
    if (qid && qid !== 'string' && !allDataItemsById[qid]) {
      warn(`Unit ${unit.id}: linkedQuestionId "${qid}" not found in any data file (may be a new ID to be added)`);
    }
  }
}

// ===== 3. Check that items with taughtInLessonId / lessonId have matching curriculum units =====
const unitLessonIds = new Set();
for (const unit of units) {
  for (const lid of (unit.linkedLessonIds || [])) {
    unitLessonIds.add(lid);
  }
}

// Check reading items
for (const level of VALID_LEVELS) {
  for (const item of (reading[level] || [])) {
    const lid = item.lessonId;
    if (lid && !unitLessonIds.has(lid) && item.id !== 'string') {
      warn(`Reading item "${item.id}" (level ${level}) references lesson "${lid}" but no curriculum unit covers that lesson`);
    }
  }
}

// Check listening items
for (const level of VALID_LEVELS) {
  for (const item of (listening[level] || [])) {
    const lid = item.lessonId;
    if (lid && !unitLessonIds.has(lid) && item.id !== 'string') {
      warn(`Listening item "${item.id}" (level ${level}) references lesson "${lid}" but no curriculum unit covers that lesson`);
    }
  }
}

// ===== 4. Check that A1 items all have curriculum coverage =====
const a1Units = units.filter(u => u.level === 'A1');
const a1LinkedIds = new Set();
for (const unit of a1Units) {
  for (const qid of (unit.linkedQuestionIds || [])) {
    a1LinkedIds.add(qid);
  }
}

const a1Grammar = grammar.A1 || [];
const a1GrammarUncovered = a1Grammar.filter(g => !a1LinkedIds.has(g.id));
if (a1GrammarUncovered.length > 0) {
  warn(`A1 grammar items not in curriculum map: ${a1GrammarUncovered.map(g => g.id).join(', ')}`);
}

const a1Vocab = vocab.A1 || [];
const a1VocabUncovered = a1Vocab.filter(v => !a1LinkedIds.has(v.id));
if (a1VocabUncovered.length > 0) {
  warn(`A1 vocab items not in curriculum map: ${a1VocabUncovered.map(v => v.id).join(', ')}`);
}

// ===== 5. Check for circular prerequisite chains =====
const conceptPrereqs = {};
for (const concept of (curriculumMap.concepts || [])) {
  conceptPrereqs[concept.id] = concept.prerequisites || [];
}

function hasCircular(conceptId, visited = new Set(), path = []) {
  if (visited.has(conceptId)) {
    return path.slice(path.indexOf(conceptId)).concat(conceptId);
  }
  visited.add(conceptId);
  path.push(conceptId);
  const prereqs = conceptPrereqs[conceptId] || [];
  for (const prereq of prereqs) {
    const cycle = hasCircular(prereq, visited, path);
    if (cycle) return cycle;
  }
  path.pop();
  return null;
}

const conceptIds = new Set(Object.keys(conceptPrereqs));
for (const cid of conceptIds) {
  const cycle = hasCircular(cid, new Set(), []);
  if (cycle) {
    error(`Circular prerequisite chain detected: ${cycle.join(' -> ')}`);
  }
}

// ===== 6. Summary =====
console.log('=== Teach-Before-Test Validation ===');
console.log(`Curriculum units: ${units.length}`);
console.log(`A1 units: ${a1Units.length}`);
console.log(`Lessons in DB: ${lessons.length}`);
console.log(`Concepts: ${curriculumMap.concepts?.length || 0}`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All teach-before-test checks passed!');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s):`);
    errors.forEach(e => console.log(`  ERROR: ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach(w => console.log(`  WARN: ${w}`));
  }
}

process.exit(errors.length > 0 ? 1 : 0);
