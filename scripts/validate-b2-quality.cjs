#!/usr/bin/env node
/**
 * validate-b2-quality.cjs - B2 Curriculum Quality Validator
 *
 * Validates all B2 curriculum data files against quality targets.
 * Reports passes, warnings, and failures.
 *
 * Usage: node scripts/validate-b2-quality.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');

function load(f) {
  return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
}

let passed = 0;
let warnings = 0;
let failures = 0;

function check(condition, label, detail) {
  if (condition) {
    console.log('  [PASS] ' + label);
    passed++;
  } else {
    console.log('  [FAIL] ' + label + (detail ? ' - ' + detail : ''));
    failures++;
  }
}

function warn(condition, label, detail) {
  if (!condition) {
    console.log('  [WARN] ' + label + (detail ? ' - ' + detail : ''));
    warnings++;
  }
}

// ============================================================
// 1. VALIDATE B2 LESSONS
// ============================================================
console.log('\n=== 1. B2 Lessons (germanLessons.json) ===');
const lessons = load('germanLessons.json');
const b2Lessons = lessons.filter(l => l.level === 'B2');
check(b2Lessons.length === 25, 'Exactly 25 B2 lessons');

const lessonIds = b2Lessons.map(l => l.id);
check(lessonIds.every(id => id && id.startsWith('B2_lesson_')), 'All B2 lessons have valid ids');

// conceptId
const withConceptId = b2Lessons.filter(l => l.conceptId);
check(withConceptId.length === 25, 'All 25 B2 lessons have conceptId');

// Check each conceptId is a valid b2.* format
const validConceptIds = b2Lessons.filter(l => /^b2\./.test(l.conceptId));
check(validConceptIds.length === 25, 'All conceptIds start with b2.');

// estimatedMinutes
const withMinutes = b2Lessons.filter(l => typeof l.estimatedMinutes === 'number' && l.estimatedMinutes >= 45 && l.estimatedMinutes <= 60);
check(withMinutes.length === 25, 'All B2 lessons have estimatedMinutes (45-60)');

// prerequisiteConceptIds
const withPrereqs = b2Lessons.filter(l => Array.isArray(l.prerequisiteConceptIds));
check(withPrereqs.length === 25, 'All B2 lessons have prerequisiteConceptIds array');
const allPrereqsB1 = b2Lessons.every(l => (l.prerequisiteConceptIds || []).every(p => p.startsWith('b1.')));
warn(allPrereqsB1, 'All prerequisites are b1.* concepts (warn if not)');

// conceptsTaught
const withConceptsTaught = b2Lessons.filter(l => Array.isArray(l.conceptsTaught) && l.conceptsTaught.length > 0);
check(withConceptsTaught.length === 25, 'All B2 lessons have conceptsTaught array');

// commonMistakes
const withMistakes = b2Lessons.filter(l => Array.isArray(l.commonMistakes) && l.commonMistakes.length >= 3);
check(withMistakes.length === 25, 'All B2 lessons have commonMistakes (>=3)');

// formsTable
const withForms = b2Lessons.filter(l => Array.isArray(l.formsTable));
check(withForms.length === 25, 'All B2 lessons have formsTable array');

// miniDrills
const withDrills = b2Lessons.filter(l => Array.isArray(l.miniDrills) && l.miniDrills.length >= 4);
check(withDrills.length === 25, 'All B2 lessons have miniDrills (>=4)');

// linkedQuestionIds
const withLinked = b2Lessons.filter(l => Array.isArray(l.linkedQuestionIds));
check(withLinked.length === 25, 'All B2 lessons have linkedQuestionIds array');

// trackTags
const withTags = b2Lessons.filter(l => Array.isArray(l.trackTags) && l.trackTags.includes('b2'));
check(withTags.length === 25, 'All B2 lessons have trackTags with b2');

// lessonDepthVersion
const withDepth = b2Lessons.filter(l => l.lessonDepthVersion === '2.0');
check(withDepth.length === 25, 'All B2 lessons have lessonDepthVersion 2.0');

// examples >= 10
const withEnoughExamples = b2Lessons.filter(l => Array.isArray(l.examples) && l.examples.length >= 8);
warn(withEnoughExamples.length === 25, 'All B2 lessons have >=8 examples (warn if not)');

// ============================================================
// 2. VALIDATE B2 GRAMMAR
// ============================================================
console.log('\n=== 2. B2 Grammar (grammar.json) ===');
const grammar = load('grammar.json');
const b2Grammar = grammar.B2 || [];
check(b2Grammar.length > 0, 'B2 grammar has items');

const grammarWithConceptId = b2Grammar.filter(g => g.conceptId);
check(grammarWithConceptId.length === b2Grammar.length, 'All B2 grammar items have conceptId');

const grammarWithTaught = b2Grammar.filter(g => g.taughtInLessonId);
check(grammarWithTaught.length === b2Grammar.length, 'All B2 grammar items have taughtInLessonId');

const grammarWithDifficulty = b2Grammar.filter(g => typeof g.difficulty === 'number');
check(grammarWithDifficulty.length === b2Grammar.length, 'All B2 grammar items have difficulty');

const grammarWithSkillType = b2Grammar.filter(g => g.skillType === 'grammar');
check(grammarWithSkillType.length === b2Grammar.length, 'All B2 grammar items have skillType=grammar');

// Check topic coverage
const grammarTopics = new Set(b2Grammar.map(g => g.topic));
console.log('  INFO: ' + grammarTopics.size + ' unique grammar topics');

// ============================================================
// 3. VALIDATE READING
// ============================================================
console.log('\n=== 3. B2 Reading (reading.json) ===');
const reading = load('reading.json');
const b2Reading = reading.B2 || [];
check(b2Reading.length === 50, '50 B2 reading items');

const readWithConcept = b2Reading.filter(r => r.conceptId);
check(readWithConcept.length === 50, 'All B2 reading items have conceptId');

const readWithTaught = b2Reading.filter(r => r.taughtInLessonId);
check(readWithTaught.length === 50, 'All B2 reading items have taughtInLessonId');

const readWithRequired = b2Reading.filter(r => Array.isArray(r.requiredConcepts));
check(readWithRequired.length === 50, 'All B2 reading items have requiredConcepts');

// ============================================================
// 4. VALIDATE LISTENING
// ============================================================
console.log('\n=== 4. B2 Listening (listening.json) ===');
const listening = load('listening.json');
const b2Listening = listening.B2 || [];
check(b2Listening.length === 50, '50 B2 listening items');

const listenWithConcept = b2Listening.filter(l => l.conceptId);
check(listenWithConcept.length === 50, 'All B2 listening items have conceptId');

const listenWithTaught = b2Listening.filter(l => l.taughtInLessonId);
check(listenWithTaught.length === 50, 'All B2 listening items have taughtInLessonId');

const listenWithRequired = b2Listening.filter(l => Array.isArray(l.requiredConcepts));
check(listenWithRequired.length === 50, 'All B2 listening items have requiredConcepts');

// ============================================================
// 5. VALIDATE WRITING
// ============================================================
console.log('\n=== 5. B2 Writing (writing.json) ===');
const writing = load('writing.json');
const b2Writing = writing.B2 || [];
check(b2Writing.length === 50, '50 B2 writing items');

const writeWithConcept = b2Writing.filter(w => w.conceptId);
check(writeWithConcept.length === 50, 'All B2 writing items have conceptId');

const writeWithTaught = b2Writing.filter(w => w.taughtInLessonId);
check(writeWithTaught.length === 50, 'All B2 writing items have taughtInLessonId');

const writeWithRubric = b2Writing.filter(w => w.rubric);
check(writeWithRubric.length >= 10, 'B2 writing items have rubric (>=10)');

const writeWithRequired = b2Writing.filter(w => Array.isArray(w.requiredConcepts));
check(writeWithRequired.length === 50, 'All B2 writing items have requiredConcepts');

// ============================================================
// 6. VALIDATE SPEAKING
// ============================================================
console.log('\n=== 6. B2 Speaking (speaking.json) ===');
const speaking = load('speaking.json');
const b2Speaking = speaking.B2 || [];
check(b2Speaking.length === 50, '50 B2 speaking items');

const speakWithConcept = b2Speaking.filter(s => s.conceptId);
check(speakWithConcept.length === 50, 'All B2 speaking items have conceptId');

const speakWithTaught = b2Speaking.filter(s => s.taughtInLessonId);
check(speakWithTaught.length === 50, 'All B2 speaking items have taughtInLessonId');

const speakWithRubric = b2Speaking.filter(s => s.rubric);
check(speakWithRubric.length >= 10, 'B2 speaking items have rubric (>=10)');

const speakWithRequired = b2Speaking.filter(s => Array.isArray(s.requiredConcepts));
check(speakWithRequired.length === 50, 'All B2 speaking items have requiredConcepts');

// ============================================================
// 7. VALIDATE VOCABULARY
// ============================================================
console.log('\n=== 7. B2 Vocabulary (germanVocabulary.json) ===');
const vocab = load('germanVocabulary.json');
const b2Vocab = vocab.B2 || [];
check(b2Vocab.length >= 800, 'B2 vocabulary has >=800 items');

const nouns = b2Vocab.filter(v => v.partOfSpeech === 'noun');
const nounsWithPlural = nouns.filter(v => v.plural);
warn(nounsWithPlural.length >= nouns.length * 0.5, 'Most nouns have plural form (warn if <50%)');

// ============================================================
// 8. VALIDATE CURRICULUM MAP
// ============================================================
console.log('\n=== 8. Curriculum Map (curriculumMap.json) ===');
const map = load('curriculumMap.json');
check(map.version === '2.0', 'Curriculum map version is 2.0');
check(map.lastUpdated, 'Curriculum map has lastUpdated');
check(Array.isArray(map.units), 'Curriculum map has units array');
check(Array.isArray(map.concepts), 'Curriculum map has concepts array');
check(Array.isArray(map.prerequisiteGraph), 'Curriculum map has prerequisiteGraph');

// Check B2 concepts exist
const b2Concepts = map.concepts.filter(c => c.level === 'B2');
check(b2Concepts.length >= 25, 'Curriculum map has >=25 B2 concepts');

// ============================================================
// SUMMARY
// ============================================================
console.log('\n========================================');
console.log('VALIDATION SUMMARY');
console.log('========================================');
console.log('  Passed:   ' + passed);
console.log('  Warnings: ' + warnings);
console.log('  Failures: ' + failures);
console.log('========================================');

if (failures > 0) {
  console.log('RESULT: FAILED - ' + failures + ' checks failed');
  process.exit(1);
} else {
  console.log('RESULT: PASSED');
  process.exit(0);
}
