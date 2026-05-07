/**
 * validate-curriculum-map.cjs
 *
 * Validates the curriculum map for structural integrity:
 * - missing/duplicate IDs
 * - invalid levels
 * - invalid skill names
 * - broken requiredLessons references
 * - broken linked question references
 * - orphan curriculum units
 *
 * Run: node scripts/validate-curriculum-map.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Load curriculum map
const curriculumMap = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculumMap.json'), 'utf-8'));

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'FSP'];
const VALID_SKILLS = ['lesson', 'vocabulary', 'grammar', 'reading', 'listening', 'writing', 'speaking'];

const errors = [];
const warnings = [];

function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// ===== Validate units =====
const units = curriculumMap.units || [];
const unitIds = new Map(); // id -> unit
const conceptIds = new Map(); // id -> concept

for (const unit of units) {
  // Missing id
  if (!unit.id) {
    error(`Unit missing id: ${JSON.stringify(unit).substring(0, 80)}`);
    continue;
  }

  unitIds.set(unit.id, unit);

  // Duplicate id
  if (unitIds.has(unit.id)) {
    // Already set, check if this is the second occurrence
    const count = units.filter(u => u.id === unit.id).length;
    if (count > 1) {
      error(`Duplicate unit id: ${unit.id} (appears ${count} times)`);
    }
  }

  // Missing level
  if (!unit.level) {
    error(`Unit ${unit.id}: missing level`);
  } else if (!VALID_LEVELS.includes(unit.level)) {
    error(`Unit ${unit.id}: invalid level "${unit.level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  // Missing skill
  if (!unit.skill) {
    error(`Unit ${unit.id}: missing skill`);
  } else if (!VALID_SKILLS.includes(unit.skill)) {
    error(`Unit ${unit.id}: invalid skill "${unit.skill}". Must be one of: ${VALID_SKILLS.join(', ')}`);
  }

  // Missing title
  if (!unit.title) {
    warn(`Unit ${unit.id}: missing title`);
  }

  // Check requiredLessons references
  for (const reqLessonId of (unit.requiredLessons || [])) {
    const foundUnit = units.find(u => u.linkedLessonIds?.includes(reqLessonId));
    if (!foundUnit) {
      warn(`Unit ${unit.id}: requiredLesson "${reqLessonId}" does not match any unit's linkedLessonIds`);
    }
  }

  // Check linkedQuestionIds references - only warn if they look like real IDs
  for (const qid of (unit.linkedQuestionIds || [])) {
    if (!qid || qid === 'string') {
      error(`Unit ${unit.id}: linkedQuestionId "${qid}" is invalid`);
    }
  }

  // Check linkedLessonIds
  for (const lid of (unit.linkedLessonIds || [])) {
    if (!lid || lid === 'string') {
      error(`Unit ${unit.id}: linkedLessonId "${lid}" is invalid`);
    }
  }
}

// ===== Validate concepts =====
const concepts = curriculumMap.concepts || [];

for (const concept of concepts) {
  if (!concept.id) {
    error(`Concept missing id: ${JSON.stringify(concept).substring(0, 80)}`);
    continue;
  }

  if (conceptIds.has(concept.id)) {
    const count = concepts.filter(c => c.id === concept.id).length;
    if (count > 1) {
      error(`Duplicate concept id: ${concept.id} (appears ${count} times)`);
    }
  }
  conceptIds.set(concept.id, concept);

  if (!VALID_LEVELS.includes(concept.level)) {
    error(`Concept ${concept.id}: invalid level "${concept.level}"`);
  }

  if (!VALID_SKILLS.includes(concept.skill)) {
    error(`Concept ${concept.id}: invalid skill "${concept.skill}"`);
  }

  // Check prerequisites reference existing concepts
  for (const prereq of (concept.prerequisites || [])) {
    if (!conceptIds.has(prereq)) {
      warn(`Concept ${concept.id}: prerequisite "${prereq}" not found in concepts list`);
    }
  }
}

// ===== Validate prerequisiteGraph =====
const graph = curriculumMap.prerequisiteGraph || [];

for (const edge of graph) {
  if (!edge.conceptId) {
    error(`Prerequisite graph edge missing conceptId`);
    continue;
  }
  if (!conceptIds.has(edge.conceptId)) {
    warn(`Prerequisite graph edge references unknown concept "${edge.conceptId}"`);
  }
  for (const req of (edge.requires || [])) {
    if (!conceptIds.has(req)) {
      warn(`Prerequisite graph edge: concept ${edge.conceptId} requires unknown concept "${req}"`);
    }
  }
}

// ===== Check for orphan units =====
// An orphan unit is one that has requiredLessons but none of those
// lessons are covered by any other unit's taughtConcepts or linkedLessonIds.
const lessonIdsCovered = new Set();
for (const unit of units) {
  for (const lid of (unit.linkedLessonIds || [])) {
    lessonIdsCovered.add(lid);
  }
}

for (const unit of units) {
  if ((unit.requiredLessons || []).length > 0) {
    const orphaned = unit.requiredLessons.filter(lid => !lessonIdsCovered.has(lid));
    if (orphaned.length > 0) {
      warn(`Unit ${unit.id}: requiredLessons that no unit covers: ${orphaned.join(', ')}`);
    }
  }
}

// ===== Summary =====
console.log('=== Curriculum Map Validation ===');
console.log(`Units: ${units.length} (${units.filter(u => u.skill === 'lesson').length} lessons, ${units.filter(u => u.skill === 'vocabulary').length} vocab, ${units.filter(u => u.skill === 'grammar').length} grammar, ${units.filter(u => u.skill === 'reading').length} reading, ${units.filter(u => u.skill === 'listening').length} listening, ${units.filter(u => u.skill === 'writing').length} writing, ${units.filter(u => u.skill === 'speaking').length} speaking)`);
console.log(`Concepts: ${concepts.length}`);
console.log(`Prerequisite graph edges: ${graph.length}`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All checks passed!');
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
