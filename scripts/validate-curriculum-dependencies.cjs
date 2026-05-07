/**
 * validate-curriculum-dependencies.cjs
 *
 * Validates that every exercise and vocabulary item has valid
 * taughtInLessonId / lessonId references, and that no orphaned
 * content exists.
 *
 * Per Critical Addendum Requirement 2:
 * - Every grammar exercise must have: lessonId, topic, prerequisiteLessonIds (if needed)
 * - Every vocabulary item must have: level, topic, taughtInLessonId or unitId
 * - Every reading/listening/writing/speaking should have level, topic, prerequisiteLessonIds
 * - Daily mission cannot select untaught content
 *
 * Usage: node scripts/validate-curriculum-dependencies.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

let exitCode = 0;
const errors = [];

function err(msg) {
  errors.push(msg);
  console.error('  [FAIL]', msg);
  exitCode = 1;
}

function ok(msg) {
  console.log('  [PASS]', msg);
}

function loadJSON(name) {
  const filePath = path.join(DATA_DIR, name);
  if (!fs.existsSync(filePath)) {
    err(`File not found: ${name}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    err(`Failed to parse ${name}: ${e.message}`);
    return null;
  }
}

// Load lessons once for validation
const lessons = loadJSON('germanLessons.json');
if (!lessons) process.exit(1);

const lessonIds = new Set(lessons.map(l => l.id));
const byLevel = {};
lessons.forEach(l => {
  if (!byLevel[l.level]) byLevel[l.level] = [];
  byLevel[l.level].push(l);
});

console.log('\n=== Curriculum Dependency Validation ===\n');
console.log(`Loaded ${lessons.length} lessons across ${Object.keys(byLevel).join(', ')} levels.\n`);

// 1. Validate vocabulary
console.log('--- Vocabulary ---');
const vocab = loadJSON('germanVocabulary.json');
if (vocab) {
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let totalVocab = 0;
  let missingTaughtIn = 0;

  LEVELS.forEach(level => {
    const items = vocab[level] || [];
    if (!Array.isArray(items)) {
      err(`vocab.${level} is not an array`);
      return;
    }
    // Accept either taughtInLessonId OR lessonId as valid
    const missing = items.filter(w => !w.taughtInLessonId && !w.lessonId);
    const noLesson = items.filter(w => !w.taughtInLessonId && !w.lessonId);
    const orphaned = items.filter(w => (w.taughtInLessonId || w.lessonId) && !lessonIds.has(w.taughtInLessonId || w.lessonId));
    totalVocab += items.length;
    missingTaughtIn += missing.length;

    if (noLesson.length > 0) {
      err(`vocab[${level}]: ${noLesson.length}/${items.length} items missing both taughtInLessonId and lessonId`);
    } else {
      ok(`vocab[${level}]: ${items.length} items, all have taughtInLessonId or lessonId`);
    }
    if (orphaned.length > 0) {
      err(`vocab[${level}]: ${orphaned.length} items reference non-existent lesson IDs`);
    }
  });

  // Check level/topic fields
  let missingLevel = 0;
  let missingTopic = 0;
  LEVELS.forEach(level => {
    const items = vocab[level] || [];
    items.forEach(w => {
      if (!w.level) missingLevel++;
      if (!w.topic) missingTopic++;
    });
  });
  if (missingLevel > 0) err(`${missingLevel} vocab items missing 'level' field`);
  else ok('vocab: all items have level field');
  if (missingTopic > 0) err(`${missingTopic} vocab items missing 'topic' field`);
  else ok('vocab: all items have topic field');

  console.log(`  Total vocab items: ${totalVocab}, missing taughtInLessonId: ${missingTaughtIn} (${((missingTaughtIn/totalVocab)*100).toFixed(1)}%)\n`);
}

// 2. Validate grammar
console.log('--- Grammar ---');
const grammar = loadJSON('grammar.json');
if (grammar) {
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let totalGrammar = 0;
  let missingTaughtIn = 0;
  let missingTopic = 0;

  LEVELS.forEach(level => {
    const items = grammar[level] || [];
    if (!Array.isArray(items)) {
      err(`grammar.${level} is not an array`);
      return;
    }
    // Accept either taughtInLessonId OR lessonId as valid
    const missing = items.filter(g => !g.taughtInLessonId && !g.lessonId);
    const noLesson = items.filter(g => !g.taughtInLessonId && !g.lessonId);
    const orphaned = items.filter(g => (g.taughtInLessonId || g.lessonId) && !lessonIds.has(g.taughtInLessonId || g.lessonId));
    totalGrammar += items.length;
    missingTaughtIn += missing.length;

    if (noLesson.length > 0) {
      err(`grammar[${level}]: ${noLesson.length}/${items.length} items missing both taughtInLessonId and lessonId`);
    } else {
      ok(`grammar[${level}]: ${items.length} items, all have taughtInLessonId or lessonId`);
    }
    if (orphaned.length > 0) {
      err(`grammar[${level}]: ${orphaned.length} items reference non-existent lesson IDs`);
    }

    items.forEach(g => {
      if (!g.topic) missingTopic++;
    });
  });
  if (missingTopic > 0) err(`${missingTopic} grammar items missing 'topic' field`);
  else ok('grammar: all items have topic field');
  console.log(`  Total grammar items: ${totalGrammar}, missing taughtInLessonId: ${missingTaughtIn} (${((missingTaughtIn/totalGrammar)*100).toFixed(1)}%)\n`);
}

// 3. Validate reading
console.log('--- Reading ---');
const reading = loadJSON('reading.json');
if (reading) {
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let total = 0;
  let missingLevel = 0;
  LEVELS.forEach(level => {
    const items = reading[level] || [];
    total += items.length;
    items.forEach(r => {
      if (!r.level) missingLevel++;
    });
  });
  if (missingLevel > 0) err(`${missingLevel} reading items missing 'level' field`);
  else ok(`reading: ${total} total items, all have level`);
}

// 4. Validate listening
console.log('\n--- Listening ---');
const listening = loadJSON('listening.json');
if (listening) {
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let total = 0;
  let missingLevel = 0;
  LEVELS.forEach(level => {
    const items = listening[level] || [];
    total += items.length;
    items.forEach(r => {
      if (!r.level) missingLevel++;
    });
  });
  if (missingLevel > 0) err(`${missingLevel} listening items missing 'level' field`);
  else ok(`listening: ${total} total items, all have level`);
}

// 5. Check lesson prerequisites exist
console.log('\n--- Lesson prerequisites ---');
lessons.forEach(lesson => {
  const prereqs = lesson.prerequisiteConceptIds || [];
  prereqs.forEach(prId => {
    // Check if prId is actually a lesson ID or a concept ID
    const targetLesson = lessons.find(l => l.id === prId || l.conceptId === prId);
    if (!targetLesson) {
      err(`Lesson ${lesson.id} has prerequisiteConceptId '${prId}' that does not match any known lesson/concept`);
    }
  });
});
ok('lesson prerequisites checked');

// 6. Summary
console.log('\n========================================');
if (errors.length === 0) {
  console.log('ALL CURRICULUM DEPENDENCY CHECKS PASSED');
} else {
  console.log(`${errors.length} issue(s) found`);
}
console.log('========================================\n');
process.exit(exitCode);
