/**
 * validate-a2-quality.cjs
 * Phase 4 validator: Check A2 content for quality standards
 * Matching A1 Phase 3 quality expectations
 */
const fs = require('fs');
const path = require('path');

let errors = 0;
let warnings = 0;

function report(type, file, msg) {
  const sym = type === 'error' ? 'ERROR' : 'WARN';
  const col = type === 'error' ? '\x1b[31m' : '\x1b[33m';
  console.log(col + `  [${sym}] ${file}: ${msg}\x1b[0m`);
  if (type === 'error') errors++;
  else warnings++;
}

function checkFile(name, checkFn) {
  const filepath = path.join(__dirname, '..', 'src/data', name);
  try {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    checkFn(data, name);
  } catch (e) {
    report('error', name, `Cannot read/parse: ${e.message}`);
  }
}

console.log('\n=== A2 Quality Validator ===\n');

// 1. Lessons
checkFile('germanLessons.json', (lessons, file) => {
  const a2 = lessons.filter(l => l.level === 'A2');
  console.log(`Lessons: ${a2.length} A2 lessons`);

  a2.forEach(l => {
    if (!l.conceptId) report('error', file, `Lesson ${l.id}: missing conceptId`);
    if (!l.estimatedMinutes || l.estimatedMinutes < 30)
      report('warn', file, `Lesson ${l.id}: estimatedMinutes is ${l.estimatedMinutes}`);
    if (!l.commonMistakes || l.commonMistakes.length < 3)
      report('warn', file, `Lesson ${l.id}: only ${l.commonMistakes?.length||0} commonMistakes (target 3+)`);
    if (!l.miniDrills || l.miniDrills.length < 3)
      report('warn', file, `Lesson ${l.id}: only ${l.miniDrills?.length||0} miniDrills (target 3+)`);
    if (!l.linkedQuestionIds || l.linkedQuestionIds.length < 3)
      report('warn', file, `Lesson ${l.id}: ${l.linkedQuestionIds?.length||0} linkedQuestionIds (target 3+)`);
    if (!l.prerequisiteConceptIds || l.prerequisiteConceptIds.length === 0)
      report('error', file, `Lesson ${l.id}: missing prerequisiteConceptIds`);
    if (!l.conceptsTaught || l.conceptsTaught.length === 0)
      report('error', file, `Lesson ${l.id}: missing conceptsTaught`);
    if (!l.trackTags || l.trackTags.length === 0)
      report('warn', file, `Lesson ${l.id}: missing trackTags`);
  });
});

// 2. Vocabulary
checkFile('germanVocabulary.json', (vocab, file) => {
  const a2 = vocab.A2 || [];
  console.log(`Vocabulary: ${a2.length} A2 entries`);

  a2.forEach(v => {
    if (v.partOfSpeech === 'noun' && !v.article)
      report('error', file, `Vocab ${v.id} "${v.word}": noun missing article`);
    if (v.partOfSpeech === 'noun' && !v.plural)
      report('warn', file, `Vocab ${v.id} "${v.word}": noun missing plural`);
    if (!v.topic) report('error', file, `Vocab ${v.id}: missing topic`);
    if (!v.example) report('warn', file, `Vocab ${v.id}: missing example`);
    if (!v.taughtInLessonId && !v.lessonId)
      report('error', file, `Vocab ${v.id}: missing taughtInLessonId`);
    if (!v.level) report('error', file, `Vocab ${v.id}: missing level`);
    if (!v.partOfSpeech) report('error', file, `Vocab ${v.id}: missing partOfSpeech`);
  });

  // Check for duplicates
  const seen = {};
  a2.forEach(v => {
    const key = v.word.trim().toLowerCase();
    if (seen[key]) report('warn', file, `Duplicate word: "${v.word}" at ${v.id} and ${seen[key]}`);
    seen[key] = v.id;
  });
});

// 3. Grammar
checkFile('grammar.json', (grammar, file) => {
  const a2 = grammar.A2 || [];
  console.log(`Grammar: ${a2.length} A2 questions`);

  a2.forEach(q => {
    if (!q.explanation) report('error', file, `Grammar ${q.id}: missing explanation`);
    if (!q.taughtInLessonId && !q.lessonId)
      report('error', file, `Grammar ${q.id}: missing taughtInLessonId`);
    if (!q.conceptId) report('error', file, `Grammar ${q.id}: missing conceptId`);
    if (!q.topic) report('error', file, `Grammar ${q.id}: missing topic`);
    if (!q.answer && q.answer !== 0) report('error', file, `Grammar ${q.id}: missing answer`);
    if (!q.difficulty) report('warn', file, `Grammar ${q.id}: missing difficulty`);
    if (!q.skillType) report('warn', file, `Grammar ${q.id}: missing skillType`);
    if (!q.options || q.options.length === 0)
      report('warn', file, `Grammar ${q.id}: no options (may be intentional)`);
  });
});

// 4. Reading
checkFile('reading.json', (reading, file) => {
  const items = reading.A2 || [];
  console.log(`Reading: ${items.length} A2 items`);

  items.forEach(item => {
    if (!item.taughtInLessonId)
      report('error', file, `Reading ${item.id}: missing taughtInLessonId`);
    if (!item.conceptId) report('error', file, `Reading ${item.id}: missing conceptId`);
    if (!item.text) report('error', file, `Reading ${item.id}: missing text`);
    const qs = item.questions || [];
    if (qs.length < 3) report('warn', file, `Reading ${item.id}: only ${qs.length} questions`);
    qs.forEach((q, i) => {
      if (!q.explanation) report('error', file, `Reading ${item.id}: question ${i} missing explanation`);
    });
  });
});

// 5. Listening
checkFile('listening.json', (listening, file) => {
  const items = listening.A2 || [];
  console.log(`Listening: ${items.length} A2 items`);

  items.forEach(item => {
    if (!item.taughtInLessonId)
      report('error', file, `Listening ${item.id}: missing taughtInLessonId`);
    if (!item.conceptId) report('error', file, `Listening ${item.id}: missing conceptId`);
    if (!item.script) report('error', file, `Listening ${item.id}: missing script`);
    const qs = item.questions || [];
    if (qs.length < 3) report('warn', file, `Listening ${item.id}: only ${qs.length} questions`);
    qs.forEach((q, i) => {
      if (!q.explanation) report('error', file, `Listening ${item.id}: question ${i} missing explanation`);
    });
  });
});

// 6. Writing
checkFile('writing.json', (writing, file) => {
  const items = writing.A2 || [];
  console.log(`Writing: ${items.length} A2 items`);

  items.forEach(item => {
    if (!item.taughtInLessonId)
      report('error', file, `Writing ${item.id}: missing taughtInLessonId`);
    if (!item.conceptId) report('error', file, `Writing ${item.id}: missing conceptId`);
    if (!item.prompt) report('error', file, `Writing ${item.id}: missing prompt`);
    if (!item.rubric) report('warn', file, `Writing ${item.id}: missing rubric`);
    if (!item.rubricKeys) report('warn', file, `Writing ${item.id}: missing rubricKeys`);
  });
});

// 7. Speaking
checkFile('speaking.json', (speaking, file) => {
  const items = speaking.A2 || [];
  console.log(`Speaking: ${items.length} A2 items`);

  items.forEach(item => {
    if (!item.taughtInLessonId)
      report('error', file, `Speaking ${item.id}: missing taughtInLessonId`);
    if (!item.conceptId) report('error', file, `Speaking ${item.id}: missing conceptId`);
    if (!item.prompt) report('error', file, `Speaking ${item.id}: missing prompt`);
    if (!item.usefulPhrases) report('warn', file, `Speaking ${item.id}: missing usefulPhrases`);
    if (!item.rubric) report('warn', file, `Speaking ${item.id}: missing rubric`);
    if (!item.rubricKeys) report('warn', file, `Speaking ${item.id}: missing rubricKeys`);
  });
});

// Summary
console.log(`\n=== Summary ===`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
if (errors > 0) {
  console.log(`\n${errors} error(s) found - issues that need fixing`);
  process.exit(1);
} else {
  console.log(`\nAll structural checks passed!`);
}
