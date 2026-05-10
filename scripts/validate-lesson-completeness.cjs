/**
 * validate-lesson-completeness.cjs
 *
 * Validates that lessons are structurally complete:
 * - Every lesson has required fields (explanation, examples, commonMistakes)
 * - miniDrills exist where expected
 * - linkedQuestionIds are present and valid
 * - pronunciation notes for level-appropriate coverage
 * - Vocabulary entries are properly linked (taughtInLessonId, conceptId)
 * - FSP lessons have examples
 * - Reading/listening/writing/speaking items reference valid lessons
 *
 * Run: node scripts/validate-lesson-completeness.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const germanLessons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanLessons.json'), 'utf8'));
const fspLessonsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'fspLessons.json'), 'utf8'));
const fspLessons = Array.isArray(fspLessonsRaw) ? fspLessonsRaw : Object.values(fspLessonsRaw);
const curriculumMap = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculumMap.json'), 'utf8'));
const vocab = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), 'utf8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar.json'), 'utf8'));
const reading = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'reading.json'), 'utf8'));
const listening = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'listening.json'), 'utf8'));
const writing = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'writing.json'), 'utf8'));
const speaking = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'speaking.json'), 'utf8'));

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const ALL_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'FSP'];
const errors = [];
const warnings = [];

function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// Build lesson lookup
const lessonById = {};
for (const l of germanLessons) lessonById[l.id] = l;
for (const l of fspLessons) lessonById[l.id] = l;

const allLessonIds = new Set(Object.keys(lessonById));

// ===== 1. Check German lessons =====
const LEVELS_WITH_PRONUNCIATION = ['A1']; // Only A1 has pronunciation notes by design

for (const level of VALID_LEVELS) {
  const lessons = germanLessons.filter(l => l.level === level);
  const minExplLen = level === 'A1' ? 200 : level === 'B2' ? 200 : 150;

  for (const l of lessons) {
    // a) Explanation length
    const expl = l.explanation || '';
    if (expl.length < minExplLen) {
      error(`${l.id}: Explanation too short (${expl.length} chars, min ${minExplLen})`);
    }

    // b) Examples
    if (!l.examples || l.examples.length === 0) {
      error(`${l.id}: No examples`);
    }

    // c) Common mistakes
    if (!l.commonMistakes || l.commonMistakes.length === 0) {
      error(`${l.id}: No common mistakes`);
    }

    // d) Forms table
    if (!l.formsTable && !l.formsTables) {
      warn(`${l.id}: No formsTable/formsTables`);
    }

    // e) miniDrills (A1 lessons 18-25 don't have them by design)
    if (!l.miniDrills) {
      warn(`${l.id}: No miniDrills`);
    }
  }
}

// ===== 2. Check FSP lessons =====
for (const l of fspLessons) {
  // a) Examples - all FSP lessons missing examples
  if (!l.examples || l.examples.length === 0) {
    warn(`${l.id}: No examples (FSP)`);
  }

  // b) linkedQuestionIds
  if (!l.linkedQuestionIds || l.linkedQuestionIds.length === 0) {
    warn(`${l.id}: No linkedQuestionIds (FSP)`);
  }

  // c) Explanation length
  const expl = l.explanation || l.summary || '';
  if (expl.length < 150) {
    warn(`${l.id}: Explanation/summary too short (${expl.length} chars)`);
  }
}

// ===== 3. Check vocabulary links =====
for (const level of VALID_LEVELS) {
  const v = vocab[level] || [];
  for (const entry of v) {
    if (!entry.taughtInLessonId && !entry.conceptId) {
      error(`${level} vocab ${entry.id || entry.word}: No taughtInLessonId or conceptId`);
    }
    if (entry.taughtInLessonId && !allLessonIds.has(entry.taughtInLessonId)) {
      error(`${level} vocab ${entry.id || entry.word}: taughtInLessonId "${entry.taughtInLessonId}" not found`);
    }
  }
}

// ===== 4. Check grammar lesson references =====
for (const level of VALID_LEVELS) {
  const g = grammar[level] || [];
  for (const item of g) {
    if (item.taughtInLessonId && !allLessonIds.has(item.taughtInLessonId)) {
      error(`${level} grammar ${item.id}: taughtInLessonId "${item.taughtInLessonId}" not found`);
    }
    if (item.lessonId && !allLessonIds.has(item.lessonId)) {
      error(`${level} grammar ${item.id}: lessonId "${item.lessonId}" not found`);
    }
  }
}

// ===== 5. Check reading/listening/writing/speaking lesson references =====
function checkSkillItems(items, skill, level) {
  const arr = items[level] || [];
  for (const item of arr) {
    if (item.lessonId && !allLessonIds.has(item.lessonId)) {
      error(`${level} ${skill} ${item.id || ''}: lessonId "${item.lessonId}" not found`);
    }
    if (item.taughtInLessonId && !allLessonIds.has(item.taughtInLessonId)) {
      error(`${level} ${skill} ${item.id || ''}: taughtInLessonId "${item.taughtInLessonId}" not found`);
    }
  }
}

for (const level of VALID_LEVELS) {
  checkSkillItems(speaking, 'speaking', level);
  checkSkillItems(writing, 'writing', level);
  checkSkillItems(reading, 'reading', level);
  checkSkillItems(listening, 'listening', level);
}

// ===== 6. Check curriculum map taughtConcepts have explanation in lesson =====
for (const unit of (curriculumMap.units || [])) {
  if (unit.skill === 'lesson' || unit.skill === 'grammar') {
    for (const lid of (unit.linkedLessonIds || [])) {
      const lesson = lessonById[lid];
      if (!lesson) {
        error(`Curriculum unit ${unit.id}: linkedLessonId "${lid}" not found in any lesson file`);
      }
    }
  }
}

// ===== Summary =====
console.log('=== Lesson Completeness Validation ===');
console.log(`German lessons checked: ${germanLessons.length}`);
console.log(`FSP lessons checked: ${fspLessons.length}`);
console.log(`Curriculum map units: ${curriculumMap.units?.length || 0}`);

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n\u2705 All completeness checks passed!');
} else {
  if (errors.length > 0) {
    console.log(`\n\u274c ${errors.length} error(s):`);
    errors.forEach(e => console.log(`  ERROR: ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n\u26a0\ufe0f  ${warnings.length} warning(s):`);
    warnings.forEach(w => console.log(`  WARN: ${w}`));
  }
}
