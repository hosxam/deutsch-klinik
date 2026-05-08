#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');
const load = f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

let pass = 0, warn = 0, fail = 0;
function ck(cond, label, detail) {
  if (cond) { console.log('  [PASS] ' + label); pass++; }
  else { console.log('  [FAIL] ' + label + (detail ? ' - ' + detail : '')); fail++; }
}
function wc(cond, label, detail) {
  if (!cond) { console.log('  [WARN] ' + label + (detail ? ' - ' + detail : '')); warn++; }
}

// ========== 1. C1 LESSONS ==========
console.log('\n=== 1. C1 Lessons ===');
const lessons = load('germanLessons.json');
const c1 = lessons.filter(l => l.level === 'C1');
ck(c1.length === 25, '25 C1 lessons');

ck(c1.every(l => l.conceptId && /^c1\./.test(l.conceptId)), 'All have conceptId starting with c1.');
ck(c1.every(l => typeof l.estimatedMinutes === 'number' && l.estimatedMinutes >= 45 && l.estimatedMinutes <= 60), 'All have estimatedMinutes 45-60');
ck(c1.every(l => Array.isArray(l.conceptsTaught) && l.conceptsTaught.length > 0), 'All have conceptsTaught');
ck(c1.every(l => Array.isArray(l.prerequisiteConceptIds)), 'All have prerequisiteConceptIds');
ck(c1.every(l => Array.isArray(l.prerequisiteConceptIds) && l.prerequisiteConceptIds.length > 0), 'All have >=1 prereq');
ck(c1.every(l => Array.isArray(l.commonMistakes) && l.commonMistakes.length >= 3), 'All have >=3 commonMistakes');
ck(c1.every(l => Array.isArray(l.formsTables)), 'All have formsTables');
ck(c1.every(l => Array.isArray(l.miniDrills) && l.miniDrills.length >= 3), 'All have >=3 miniDrills');
ck(c1.every(l => Array.isArray(l.trackTags) && l.trackTags.includes('c1')), 'All have trackTags with c1');
ck(c1.every(l => l.lessonDepthVersion === '2.0'), 'All have lessonDepthVersion 2.0');
wc(c1.every(l => Array.isArray(l.examples) && l.examples.length >= 8), 'All have >=8 examples');
const nonemptyLinked = c1.filter(l => Array.isArray(l.linkedQuestionIds) && l.linkedQuestionIds.length > 0);
wc(nonemptyLinked.length >= 10, '>=10 lessons have linkedQuestionIds', 'Actual: ' + nonemptyLinked.length);

// ========== 2. C1 GRAMMAR ==========
console.log('\n=== 2. C1 Grammar ===');
const grammar = load('grammar.json');
const c1g = grammar.C1 || [];
ck(c1g.length > 0, 'Has grammar items', 'Count: ' + c1g.length);
ck(c1g.every(g => g.conceptId), 'All have conceptId');
ck(c1g.every(g => g.taughtInLessonId), 'All have taughtInLessonId');
ck(c1g.every(g => typeof g.difficulty === 'number'), 'All have difficulty');
ck(c1g.every(g => g.skillType === 'grammar'), 'All have skillType=grammar');
ck(c1g.every(g => g.explanation), 'All have explanation');
const types = new Set(c1g.map(g => g.type));
console.log('  INFO: Types:', [...types].join(', '));
const topics = new Set(c1g.map(g => g.topic));
console.log('  INFO: Topics:', topics.size);

// ========== 3. C1 READING ==========
console.log('\n=== 3. C1 Reading ===');
const reading = load('reading.json');
const c1r = reading.C1 || [];
ck(c1r.length === 50, '50 reading items');
ck(c1r.every(r => r.conceptId), 'All have conceptId');
ck(c1r.every(r => r.taughtInLessonId), 'All have taughtInLessonId');
ck(c1r.every(r => Array.isArray(r.requiredConcepts)), 'All have requiredConcepts');
ck(c1r.every(r => r.questions && Array.isArray(r.questions) && r.questions.length >= 3), 'All have >=3 questions');
const qTypes = new Set();
c1r.forEach(r => (r.questions || []).forEach(q => qTypes.add(q.type)));
console.log('  INFO: Question types:', [...qTypes].join(', '));

// ========== 4. C1 LISTENING ==========
console.log('\n=== 4. C1 Listening ===');
const listening = load('listening.json');
const c1l = listening.C1 || [];
ck(c1l.length === 50, '50 listening items');
ck(c1l.every(l => l.conceptId), 'All have conceptId');
ck(c1l.every(l => l.taughtInLessonId), 'All have taughtInLessonId');
ck(c1l.every(l => Array.isArray(l.requiredConcepts)), 'All have requiredConcepts');
ck(c1l.every(l => l.script || l.text), 'All have script/text');

// ========== 5. C1 WRITING ==========
console.log('\n=== 5. C1 Writing ===');
const writing = load('writing.json');
const c1w = writing.C1 || [];
ck(c1w.length === 50, '50 writing items');
ck(c1w.every(w => w.conceptId), 'All have conceptId');
ck(c1w.every(w => w.taughtInLessonId), 'All have taughtInLessonId');
ck(c1w.every(w => Array.isArray(w.requiredConcepts)), 'All have requiredConcepts');
ck(c1w.every(w => w.rubric && w.rubric.length >= 2), 'All have rubric >=2 items');
wc(c1w.every(w => w.usefulPhrases && w.usefulPhrases.length > 0), 'All have usefulPhrases');

// ========== 6. C1 SPEAKING ==========
console.log('\n=== 6. C1 Speaking ===');
const speaking = load('speaking.json');
const c1s = speaking.C1 || [];
ck(c1s.length === 50, '50 speaking items');
ck(c1s.every(s => s.conceptId), 'All have conceptId');
ck(c1s.every(s => s.taughtInLessonId), 'All have taughtInLessonId');
ck(c1s.every(s => Array.isArray(s.requiredConcepts)), 'All have requiredConcepts');
ck(c1s.every(s => s.rubric && s.rubric.length >= 2), 'All have rubric >=2 items');
wc(c1s.every(s => s.usefulPhrases && s.usefulPhrases.length > 0), 'All have usefulPhrases');

// ========== 7. C1 VOCABULARY ==========
console.log('\n=== 7. C1 Vocabulary ===');
const vocab = load('germanVocabulary.json');
const c1v = vocab.C1 || [];
ck(c1v.length >= 1000, '>=1000 items', 'Actual: ' + c1v.length);
ck(c1v.every(v => v.translation || v.english), 'All have translation');
ck(c1v.every(v => v.example || v.exampleSentence), 'All have example');
ck(c1v.every(v => v.topic), 'All have topic');
ck(c1v.every(v => v.taughtInLessonId || v.lessonId), 'All have lesson assignment');
const vNouns = c1v.filter(v => (v.partOfSpeech || '').toLowerCase() === 'noun');
wc(vNouns.filter(v => v.plural).length >= vNouns.length * 0.5, '>=50% nouns have plural', 'Actual: ' + vNouns.filter(v => v.plural).length + '/' + vNouns.length);

// ========== 8. CURRICULUM MAP ==========
console.log('\n=== 8. Curriculum Map ===');
const cm = load('curriculumMap.json');
ck(typeof cm.version === 'string', 'Has version');
ck(Array.isArray(cm.units), 'Has units');
const c1units = cm.units.filter(u => u.id && u.id.startsWith('C1_'));
ck(c1units.length >= 200, '>=200 C1 units in map');
ck(Array.isArray(cm.concepts), 'Has concepts array');
const c1concepts = cm.concepts.filter(c => c.level === 'C1');
ck(c1concepts.length >= 25, '>=25 C1 concepts in map', 'Actual: ' + c1concepts.length);

// ========== SUMMARY ==========
console.log('\n' + '='.repeat(40));
console.log('C1 QUALITY VALIDATION SUMMARY');
console.log('='.repeat(40));
console.log('  Passed:   ' + pass);
console.log('  Warnings: ' + warn);
console.log('  Failures: ' + fail);
console.log('='.repeat(40));

if (fail > 0) { console.log('RESULT: FAILED'); process.exit(1); }
else { console.log('RESULT: PASSED'); process.exit(0); }
