// @ts-check
/**
 * validate-fsp-quality.cjs
 *
 * Validates FSP data files for completeness and consistency.
 * Checks required fields, data types, and cross-reference validity.
 *
 * Usage: node scripts/validate-fsp-quality.cjs
 * Exit code: 0 if all pass, 1 if any fail.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

const VALID_LESSON_IDS = Array.from({ length: 40 }, (_, i) => `fsp_l_${String(i + 1).padStart(3, '0')}`);
const VALID_LESSON_ID_SET = new Set(VALID_LESSON_IDS);

const PASS = 0;
const FAIL = 1;
let exitCode = PASS;

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function pass(msg) {
  console.log(`[PASS] ${msg}`);
  passedChecks++;
  totalChecks++;
}

function fail(msg) {
  console.log(`[FAIL] ${msg}`);
  failedChecks++;
  totalChecks++;
  exitCode = FAIL;
}

/**
 * Read a JSON file, handling array vs wrapper object.
 */
function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return { exists: false, data: null, items: [] };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const items = Array.isArray(raw) ? raw : raw.lessons || raw.fspLessons || raw.vocabulary || raw.fspVocabulary || raw.grammar || raw.fspGrammar || raw.fspReading || raw.reading || raw.fspListening || raw.listening || raw.writing || raw.fspWriting || raw.anamnese || raw.fspAnamnese || raw.cases || raw.fspCases || raw.exams || raw.fspExams || raw.presentations || raw.fspPresentations || [];
    return { exists: true, data: raw, items };
  } catch (err) {
    fail(`Broken JSON in ${fileName}: ${err.message}`);
    return { exists: false, data: null, items: [] };
  }
}

/** Report missing items out of a required list */
function checkRequiredFields(item, itemIndex, fileName, requiredFields) {
  for (const field of requiredFields) {
    if (item[field] === undefined || item[field] === null || (typeof item[field] === 'string' && item[field].trim() === '')) {
      fail(`${fileName} item #${itemIndex} (id=${item.id || 'unknown'}) missing required field "${field}"`);
    }
  }
}

// ==================== 1. FSP Lessons ====================

(function validateLessons() {
  const { items: lessons } = readJson('fspLessons.json');

  if (lessons.length !== 40) {
    fail(`fspLessons.json: expected 40 lessons, got ${lessons.length}`);
  } else {
    pass(`fspLessons.json: has ${lessons.length} lessons`);
  }

  const LESSON_REQUIRED = [
    'id', 'title', 'conceptId', 'objectives', 'taughtConcepts',
    'estimatedMinutes', 'explanation', 'englishExplanation',
    'medicalCommunicationPhrases', 'commonMistakes', 'trackTags',
    'lessonDepthVersion', 'tags',
  ];

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    checkRequiredFields(lesson, i, 'fspLessons.json', LESSON_REQUIRED);

    // Verify ID format
    if (!VALID_LESSON_ID_SET.has(lesson.id)) {
      fail(`fspLessons.json item #${i}: invalid lesson id "${lesson.id}"`);
    }

    // Verify conceptId is non-empty string
    if (typeof lesson.conceptId !== 'string' || lesson.conceptId.trim() === '') {
      fail(`fspLessons.json item #${i} (${lesson.id}): conceptId must be non-empty string`);
    } else {
      if (i === 0) pass(`fspLessons.json: conceptIds are valid strings`);
    }

    // Verify taughtConcepts is array with items
    if (!Array.isArray(lesson.taughtConcepts) || lesson.taughtConcepts.length === 0) {
      fail(`fspLessons.json item #${i} (${lesson.id}): taughtConcepts must be non-empty array`);
    }

    // Verify objectives
    if (!Array.isArray(lesson.objectives) || lesson.objectives.length === 0) {
      fail(`fspLessons.json item #${i} (${lesson.id}): objectives must be non-empty array`);
    }

    // Verify estimatedMinutes > 0
    if (typeof lesson.estimatedMinutes !== 'number' || lesson.estimatedMinutes <= 0) {
      fail(`fspLessons.json item #${i} (${lesson.id}): estimatedMinutes must be positive number`);
    }

    // Verify trackTags
    if (!Array.isArray(lesson.trackTags) || lesson.trackTags.length === 0) {
      fail(`fspLessons.json item #${i} (${lesson.id}): trackTags must be non-empty array`);
    }

    // Verify tags
    if (!Array.isArray(lesson.tags) || lesson.tags.length === 0) {
      fail(`fspLessons.json item #${i} (${lesson.id}): tags must be non-empty array`);
    }

    // Verify explanation is non-empty string
    if (typeof lesson.explanation !== 'string' || lesson.explanation.trim() === '') {
      fail(`fspLessons.json item #${i} (${lesson.id}): explanation must be non-empty string`);
    }

    // Verify englishExplanation
    if (typeof lesson.englishExplanation !== 'string' || lesson.englishExplanation.trim() === '') {
      fail(`fspLessons.json item #${i} (${lesson.id}): englishExplanation must be non-empty string`);
    }

    // Verify medicalCommunicationPhrases and commonMistakes
    if (!Array.isArray(lesson.medicalCommunicationPhrases)) {
      fail(`fspLessons.json item #${i} (${lesson.id}): medicalCommunicationPhrases must be an array`);
    }
    if (!Array.isArray(lesson.commonMistakes)) {
      fail(`fspLessons.json item #${i} (${lesson.id}): commonMistakes must be an array`);
    }
  }

  pass('fspLessons.json: all fields validated');
})();

// ==================== 2. FSP Vocabulary ====================

(function validateVocab() {
  const { items: vocab } = readJson('fspVocabulary.json');

  if (vocab.length < 1000) {
    fail(`fspVocabulary.json: expected 1000+ items, got ${vocab.length}`);
  } else {
    pass(`fspVocabulary.json: has ${vocab.length} vocabulary items`);
  }

  for (let i = 0; i < vocab.length; i++) {
    const v = vocab[i];

    // Required fields (article can be null for adjectives like "stechend")
    checkRequiredFields(v, i, 'fspVocabulary.json', ['conceptId', 'taughtInLessonId', 'word', 'translation', 'tags']);

    // article should exist (even if null)
    if (v.article === undefined) {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): article field is missing entirely`);
    }

    // conceptId
    if (typeof v.conceptId !== 'string' || v.conceptId.trim() === '') {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): conceptId must be non-empty string`);
    }

    // taughtInLessonId references valid lesson
    if (!VALID_LESSON_ID_SET.has(v.taughtInLessonId)) {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): taughtInLessonId "${v.taughtInLessonId}" is not a valid lesson ID`);
    }

    // category field check (field is "category" in data, not "medicalCategory")
    if (typeof v.category !== 'string' || v.category.trim() === '') {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): category must be non-empty string`);
    }

    // word and translation
    if (typeof v.word !== 'string' || v.word.trim() === '') {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): word must be non-empty string`);
    }
    if (typeof v.translation !== 'string' || v.translation.trim() === '') {
      fail(`fspVocabulary.json item #${i} (${v.id || 'unknown'}): translation must be non-empty string`);
    }
  }

  pass('fspVocabulary.json: all vocabulary fields validated');
})();

// ==================== 3. FSP Grammar ====================

(function validateGrammar() {
  const { items: grammar } = readJson('fspGrammar.json');

  if (grammar.length !== 100) {
    fail(`fspGrammar.json: expected 100 items, got ${grammar.length}`);
  } else {
    pass(`fspGrammar.json: has ${grammar.length} grammar items`);
  }

  for (let i = 0; i < grammar.length; i++) {
    const g = grammar[i];
    checkRequiredFields(g, i, 'fspGrammar.json', ['conceptId', 'taughtInLessonId']);

    if (typeof g.conceptId !== 'string' || g.conceptId.trim() === '') {
      fail(`fspGrammar.json item #${i} (${g.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(g.taughtInLessonId)) {
      fail(`fspGrammar.json item #${i} (${g.id || 'unknown'}): taughtInLessonId "${g.taughtInLessonId}" is not a valid lesson ID`);
    }
  }

  pass('fspGrammar.json: all grammar fields validated');
})();

// ==================== 4. FSP Reading ====================

(function validateReading() {
  const { items: reading } = readJson('fspReading.json');

  if (reading.length !== 100) {
    fail(`fspReading.json: expected 100 items, got ${reading.length}`);
  } else {
    pass(`fspReading.json: has ${reading.length} reading items`);
  }

  for (let i = 0; i < reading.length; i++) {
    const r = reading[i];
    checkRequiredFields(r, i, 'fspReading.json', ['conceptId', 'taughtInLessonId', 'questions', 'answers']);

    if (typeof r.conceptId !== 'string' || r.conceptId.trim() === '') {
      fail(`fspReading.json item #${i} (${r.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(r.taughtInLessonId)) {
      fail(`fspReading.json item #${i} (${r.id || 'unknown'}): taughtInLessonId "${r.taughtInLessonId}" is not a valid lesson ID`);
    }
    if (!Array.isArray(r.questions) || r.questions.length === 0) {
      fail(`fspReading.json item #${i} (${r.id || 'unknown'}): questions must be non-empty array`);
    }
    if (!Array.isArray(r.answers) || r.answers.length === 0) {
      fail(`fspReading.json item #${i} (${r.id || 'unknown'}): answers must be non-empty array`);
    }
  }

  pass('fspReading.json: all reading fields validated');
})();

// ==================== 5. FSP Listening ====================

(function validateListening() {
  const { items: listening } = readJson('fspListening.json');

  if (listening.length !== 100) {
    fail(`fspListening.json: expected 100 items, got ${listening.length}`);
  } else {
    pass(`fspListening.json: has ${listening.length} listening items`);
  }

  for (let i = 0; i < listening.length; i++) {
    const l = listening[i];
    checkRequiredFields(l, i, 'fspListening.json', ['conceptId', 'taughtInLessonId', 'questions', 'answers']);

    if (typeof l.conceptId !== 'string' || l.conceptId.trim() === '') {
      fail(`fspListening.json item #${i} (${l.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(l.taughtInLessonId)) {
      fail(`fspListening.json item #${i} (${l.id || 'unknown'}): taughtInLessonId "${l.taughtInLessonId}" is not a valid lesson ID`);
    }
    if (!Array.isArray(l.questions) || l.questions.length === 0) {
      fail(`fspListening.json item #${i} (${l.id || 'unknown'}): questions must be non-empty array`);
    }
    if (!Array.isArray(l.answers) || l.answers.length === 0) {
      fail(`fspListening.json item #${i} (${l.id || 'unknown'}): answers must be non-empty array`);
    }
  }

  pass('fspListening.json: all listening fields validated');
})();

// ==================== 6. FSP Writing ====================

(function validateWriting() {
  const { items: writing } = readJson('fspWriting.json');

  if (writing.length !== 140) {
    fail(`fspWriting.json: expected 140 items, got ${writing.length}`);
  } else {
    pass(`fspWriting.json: has ${writing.length} writing items`);
  }

  for (let i = 0; i < writing.length; i++) {
    const w = writing[i];
    checkRequiredFields(w, i, 'fspWriting.json', ['conceptId', 'taughtInLessonId', 'rubric']);

    if (typeof w.conceptId !== 'string' || w.conceptId.trim() === '') {
      fail(`fspWriting.json item #${i} (${w.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(w.taughtInLessonId)) {
      fail(`fspWriting.json item #${i} (${w.id || 'unknown'}): taughtInLessonId "${w.taughtInLessonId}" is not a valid lesson ID`);
    }
    if (!w.rubric || typeof w.rubric !== 'object' || Object.keys(w.rubric).length === 0) {
      fail(`fspWriting.json item #${i} (${w.id || 'unknown'}): rubric must be non-empty object`);
    }
  }

  pass('fspWriting.json: all writing fields validated');
})();

// ==================== 7. FSP Anamnese ====================

(function validateAnamnese() {
  const { items: anamnese } = readJson('fspAnamnese.json');

  if (anamnese.length !== 141) {
    fail(`fspAnamnese.json: expected 141 items, got ${anamnese.length}`);
  } else {
    pass(`fspAnamnese.json: has ${anamnese.length} anamnese items`);
  }

  for (let i = 0; i < anamnese.length; i++) {
    const a = anamnese[i];
    checkRequiredFields(a, i, 'fspAnamnese.json', ['conceptId', 'taughtInLessonId']);

    if (typeof a.conceptId !== 'string' || a.conceptId.trim() === '') {
      fail(`fspAnamnese.json item #${i} (${a.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(a.taughtInLessonId)) {
      fail(`fspAnamnese.json item #${i} (${a.id || 'unknown'}): taughtInLessonId "${a.taughtInLessonId}" is not a valid lesson ID`);
    }
  }

  pass('fspAnamnese.json: all anamnese fields validated');
})();

// ==================== 8. FSP Cases ====================

(function validateCases() {
  const { items: cases } = readJson('fspCases.json');

  if (cases.length !== 100) {
    fail(`fspCases.json: expected 100 items, got ${cases.length}`);
  } else {
    pass(`fspCases.json: has ${cases.length} case items`);
  }

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    checkRequiredFields(c, i, 'fspCases.json', ['conceptId', 'taughtInLessonId']);

    if (typeof c.conceptId !== 'string' || c.conceptId.trim() === '') {
      fail(`fspCases.json item #${i} (${c.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(c.taughtInLessonId)) {
      fail(`fspCases.json item #${i} (${c.id || 'unknown'}): taughtInLessonId "${c.taughtInLessonId}" is not a valid lesson ID`);
    }
  }

  pass('fspCases.json: all case fields validated');
})();

// ==================== 9. FSP Exams ====================

(function validateExams() {
  const { items: exams } = readJson('fspExams.json');

  if (exams.length !== 10) {
    fail(`fspExams.json: expected 10 items, got ${exams.length}`);
  } else {
    pass(`fspExams.json: has ${exams.length} exam items`);
  }

  for (let i = 0; i < exams.length; i++) {
    const e = exams[i];
    checkRequiredFields(e, i, 'fspExams.json', ['conceptId', 'taughtInLessonId']);

    if (typeof e.conceptId !== 'string' || e.conceptId.trim() === '') {
      fail(`fspExams.json item #${i} (${e.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(e.taughtInLessonId)) {
      fail(`fspExams.json item #${i} (${e.id || 'unknown'}): taughtInLessonId "${e.taughtInLessonId}" is not a valid lesson ID`);
    }
  }

  pass('fspExams.json: all exam fields validated');
})();

// ==================== 10. FSP Speaking ====================

(function validateSpeaking() {
  const { items: speaking } = readJson('fspSpeaking.json');

  if (speaking.length !== 50) {
    fail(`fspSpeaking.json: expected 50 items, got ${speaking.length}`);
  } else {
    pass(`fspSpeaking.json: has ${speaking.length} speaking items`);
  }

  for (let i = 0; i < speaking.length; i++) {
    const s = speaking[i];
    checkRequiredFields(s, i, 'fspSpeaking.json', ['conceptId', 'taughtInLessonId', 'task', 'expectedAnswerPoints']);

    if (typeof s.conceptId !== 'string' || s.conceptId.trim() === '') {
      fail(`fspSpeaking.json item #${i} (${s.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(s.taughtInLessonId)) {
      fail(`fspSpeaking.json item #${i} (${s.id || 'unknown'}): taughtInLessonId "${s.taughtInLessonId}" is not a valid lesson ID`);
    }
    if (typeof s.task !== 'string' || s.task.trim() === '') {
      fail(`fspSpeaking.json item #${i} (${s.id || 'unknown'}): task must be non-empty string`);
    }
    if (!Array.isArray(s.expectedAnswerPoints) || s.expectedAnswerPoints.length === 0) {
      fail(`fspSpeaking.json item #${i} (${s.id || 'unknown'}): expectedAnswerPoints must be non-empty array`);
    }
  }

  pass('fspSpeaking.json: all speaking fields validated');
})();

// ==================== 11. FSP Presentations ====================

(function validatePresentations() {
  const { items: presentations } = readJson('fspPresentations.json');

  if (presentations.length !== 100) {
    fail(`fspPresentations.json: expected 100 items, got ${presentations.length}`);
  } else {
    pass(`fspPresentations.json: has ${presentations.length} presentation items`);
  }

  for (let i = 0; i < presentations.length; i++) {
    const p = presentations[i];
    checkRequiredFields(p, i, 'fspPresentations.json', ['conceptId', 'taughtInLessonId']);

    if (typeof p.conceptId !== 'string' || p.conceptId.trim() === '') {
      fail(`fspPresentations.json item #${i} (${p.id || 'unknown'}): conceptId must be non-empty string`);
    }
    if (!VALID_LESSON_ID_SET.has(p.taughtInLessonId)) {
      fail(`fspPresentations.json item #${i} (${p.id || 'unknown'}): taughtInLessonId "${p.taughtInLessonId}" is not a valid lesson ID`);
    }
  }

  pass('fspPresentations.json: all presentation fields validated');
})();

// ==================== 12. Cross-reference: All taughtInLessonIds ====================

(function validateCrossReferences() {
  const files = ['fspVocabulary.json', 'fspGrammar.json', 'fspReading.json', 'fspListening.json',
    'fspWriting.json', 'fspAnamnese.json', 'fspCases.json', 'fspExams.json', 'fspPresentations.json'];

  let allTaughtInLessonIds = [];

  for (const file of files) {
    const { items } = readJson(file);
    for (const item of items) {
      if (item.taughtInLessonId) {
        allTaughtInLessonIds.push({ file, id: item.id, taughtInLessonId: item.taughtInLessonId });
        if (!VALID_LESSON_ID_SET.has(item.taughtInLessonId)) {
          fail(`${file}: item "${item.id}" references invalid taughtInLessonId "${item.taughtInLessonId}"`);
        }
      }
    }
  }

  // Check that every lesson ID has at least some reference
  const referencedIds = new Set(allTaughtInLessonIds.map(x => x.taughtInLessonId));
  for (const lid of VALID_LESSON_IDS) {
    if (!referencedIds.has(lid)) {
      fail(`Lesson "${lid}" has no data items referencing it (orphaned lesson)`);
    }
  }

  pass(`Cross-reference: all taughtInLessonIds reference valid lesson IDs (${allTaughtInLessonIds.length} references checked)`);
})();

// ==================== Summary ====================

console.log(`\n========================================`);
console.log(`FSP Quality Validation Complete`);
console.log(`  Total checks: ${totalChecks}`);
console.log(`  Passed: ${passedChecks}`);
console.log(`  Failed: ${failedChecks}`);
console.log(`  Result: ${exitCode === PASS ? 'ALL PASSED' : 'SOME FAILED'}`);
console.log(`========================================`);

process.exit(exitCode);
