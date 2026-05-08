const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');

function check(label, items, checks) {
  const errors = [];
  const warns = [];
  items.forEach((item, i) => {
    checks.forEach(c => {
      const val = c.path.split('.').reduce((o, k) => (o || {})[k], item);
      if (c.required && (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0))) {
        errors.push(`${label}[${i}] (${item.id || c.path}): missing ${c.path}`);
      }
      if (c.type && val !== undefined && typeof val !== c.type) {
        warns.push(`${label}[${i}] (${item.id}): ${c.path} should be ${c.type}, got ${typeof val}`);
      }
    });
  });
  return { errors, warns };
}

console.log("=== B2 VALIDATION ===\n");

// 1. Lessons
const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf8'));
const b2l = lessons.filter(l => l.level === 'B2');
const lr = check("B2 Lessons", b2l, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'estimatedMinutes', required: true },
  { path: 'prerequisiteConceptIds', required: true },
  { path: 'conceptsTaught', required: true },
  { path: 'commonMistakes', required: true },
  { path: 'formsTable', required: true },
  { path: 'miniDrills', required: true },
  { path: 'linkedQuestionIds', required: true },
  { path: 'lessonDepthVersion', required: true },
  { path: 'trackTags', required: true },
]);
console.log(`Lessons: ${b2l.length} (${lr.errors.length} errors, ${lr.warns.length} warnings)`);
lr.errors.forEach(e => console.log(`  ERR: ${e}`));
lr.warns.forEach(w => console.log(`  WARN: ${w}`));

// 2. Grammar
const grammar = JSON.parse(fs.readFileSync(path.join(DATA, 'grammar.json'), 'utf8'));
const b2g = grammar.B2 || [];
const gr = check("B2 Grammar", b2g, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'taughtInLessonId', required: true },
  { path: 'difficulty', required: true },
  { path: 'skillType', required: true },
]);
// Check lessonIds are valid
const validLessons = new Set(b2l.map(l => l.id));
const badLessonIds = b2g.filter(q => !validLessons.has(q.taughtInLessonId)).map(q => `${q.id} -> ${q.taughtInLessonId}`);
console.log(`Grammar: ${b2g.length} (${gr.errors.length} errors, ${gr.warns.length} warnings, ${badLessonIds.length} bad lessonIds)`);
gr.errors.forEach(e => console.log(`  ERR: ${e}`));
if (badLessonIds.length > 0) badLessonIds.slice(0, 5).forEach(e => console.log(`  BAD: ${e}`));

// 3. Reading
const reading = JSON.parse(fs.readFileSync(path.join(DATA, 'reading.json'), 'utf8'));
const b2r = reading.B2 || [];
const rr = check("B2 Reading", b2r, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'taughtInLessonId', required: true },
]);
const badRead = b2r.filter(x => !validLessons.has(x.taughtInLessonId)).map(x => x.id);
console.log(`Reading: ${b2r.length} (${rr.errors.length} errors, ${badRead.length} bad lessonIds)`);
rr.errors.forEach(e => console.log(`  ERR: ${e}`));
if (badRead.length > 0) console.log(`  BAD lessonIds: ${badRead.slice(0,5)}`);

// 4. Listening
const listening = JSON.parse(fs.readFileSync(path.join(DATA, 'listening.json'), 'utf8'));
const b2li = listening.B2 || [];
const lir = check("B2 Listening", b2li, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'taughtInLessonId', required: true },
]);
const badListen = b2li.filter(x => !validLessons.has(x.taughtInLessonId)).map(x => x.id);
console.log(`Listening: ${b2li.length} (${lir.errors.length} errors, ${badListen.length} bad lessonIds)`);

// 5. Writing
const writing = JSON.parse(fs.readFileSync(path.join(DATA, 'writing.json'), 'utf8'));
const b2w = writing.B2 || [];
const wr = check("B2 Writing", b2w, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'taughtInLessonId', required: true },
  { path: 'rubric', required: true },
  { path: 'rubricKeys', required: true },
]);
const noRubric = b2w.filter(x => !x.rubric).length;
console.log(`Writing: ${b2w.length} (${wr.errors.length} errors, ${noRubric} no rubric)`);

// 6. Speaking
const speaking = JSON.parse(fs.readFileSync(path.join(DATA, 'speaking.json'), 'utf8'));
const b2s = speaking.B2 || [];
const sr = check("B2 Speaking", b2s, [
  { path: 'id', required: true },
  { path: 'level', required: true },
  { path: 'conceptId', required: true },
  { path: 'taughtInLessonId', required: true },
  { path: 'rubric', required: true },
  { path: 'rubricKeys', required: true },
]);
const noRubricS = b2s.filter(x => !x.rubric).length;
console.log(`Speaking: ${b2s.length} (${sr.errors.length} errors, ${noRubricS} no rubric)`);

// 7. Curriculum map
const cm = JSON.parse(fs.readFileSync(path.join(DATA, 'curriculumMap.json'), 'utf8'));
const b2cm = cm.B2 || [];
const cmr = check("B2 CurriculumMap", b2cm, [
  { path: 'id', required: true },
  { path: 'taughtConcepts', required: true },
  { path: 'requiredConcepts', required: true },
]);
console.log(`CurriculumMap: ${b2cm.length} (${cmr.errors.length} errors)`);

console.log(`\n=== TOTAL: ${lr.errors.length + gr.errors.length + rr.errors.length + lir.errors.length + wr.errors.length + sr.errors.length + cmr.errors.length} errors ===`);
