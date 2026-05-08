#!/usr/bin/env node
/**
 * validate-b1-quality.cjs
 * Validates B1 data after Phase 5 enrichment.
 *
 * Run: node scripts/validate-b1-quality.cjs
 */
const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, '..', 'src', 'data');

const lessons = JSON.parse(fs.readFileSync(path.join(D, 'germanLessons.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(D, 'grammar.json'), 'utf-8'));
const reading = JSON.parse(fs.readFileSync(path.join(D, 'reading.json'), 'utf-8'));
const listening = JSON.parse(fs.readFileSync(path.join(D, 'listening.json'), 'utf-8'));
const writing = JSON.parse(fs.readFileSync(path.join(D, 'writing.json'), 'utf-8'));
const speaking = JSON.parse(fs.readFileSync(path.join(D, 'speaking.json'), 'utf-8'));
const vocab = JSON.parse(fs.readFileSync(path.join(D, 'germanVocabulary.json'), 'utf-8'));

const errors = [];
const warns = [];

// Collect all grammar IDs for cross-referencing linkedQuestionIds
const grammarIds = new Set();
['A1','A2','B1','B2','C1'].forEach(function(level) {
  (grammar[level]||[]).forEach(function(q) { if(q.id) grammarIds.add(q.id); });
});

// 1. B1 Lessons
console.log('Checking B1 lessons...');
var b1Lessons = lessons.filter(function(l) { return l.level === 'B1'; });
if(b1Lessons.length === 0) {
  errors.push('No B1 lessons found!');
} else {
  b1Lessons.forEach(function(l) {
    if(!l.conceptId) errors.push(l.id + ' missing conceptId');
    if(!l.estimatedMinutes) errors.push(l.id + ' missing estimatedMinutes');
    if(!l.prerequisiteConceptIds) errors.push(l.id + ' missing prerequisiteConceptIds');
    if(!l.conceptsTaught) errors.push(l.id + ' missing conceptsTaught');
    if(!l.commonMistakes) errors.push(l.id + ' missing commonMistakes');
    if(!l.formsTable) errors.push(l.id + ' missing formsTable');
    if(!l.miniDrills) errors.push(l.id + ' missing miniDrills');
    if(!l.linkedQuestionIds) errors.push(l.id + ' missing linkedQuestionIds');
    if(!l.lessonDepthVersion) errors.push(l.id + ' missing lessonDepthVersion');
    if(!l.trackTags) errors.push(l.id + ' missing trackTags');
    if(!l.examples || l.examples.length < 8) warns.push(l.id + ' has only ' + (l.examples?l.examples.length:0) + ' examples (expected 8+)');
    // Check linkedQuestionIds exist
    if(l.linkedQuestionIds) {
      l.linkedQuestionIds.forEach(function(qid) {
        if(!grammarIds.has(qid)) {
          warns.push(l.id + ' linkedQuestionIds includes unknown grammar id: ' + qid);
        }
      });
    }
  });
}

// 2. B1 Grammar
console.log('Checking B1 grammar...');
var b1Grammar = grammar.B1 || [];
b1Grammar.forEach(function(q) {
  if(!q.level) errors.push(q.id + ' missing level');
  if(!q.topic) errors.push(q.id + ' missing topic');
  if(!q.prompt) errors.push(q.id + ' missing prompt');
  if(!q.explanation) errors.push(q.id + ' missing explanation');
  if(!q.taughtInLessonId) errors.push(q.id + ' missing taughtInLessonId');
  if(!q.conceptId) errors.push(q.id + ' missing conceptId');
  if(!q.difficulty) errors.push(q.id + ' missing difficulty');
  if(!q.skillType) errors.push(q.id + ' missing skillType');
});

// 3. B1 Reading
console.log('Checking B1 reading...');
var b1Reading = reading.B1 || [];
var allReadingLessonIds = {};
b1Reading.forEach(function(r) {
  if(!r.conceptId) errors.push(r.id + ' missing conceptId');
  if(!r.taughtInLessonId) errors.push(r.id + ' missing taughtInLessonId');
  if(!r.requiredConcepts) warns.push(r.id + ' missing requiredConcepts');
  if(r.questions) {
    r.questions.forEach(function(q, i) {
      if(!q.explanation) errors.push(r.id + ' question ' + i + ' missing explanation');
    });
  }
});

// 4. B1 Listening
console.log('Checking B1 listening...');
var b1Listening = listening.B1 || [];
b1Listening.forEach(function(r) {
  if(!r.conceptId) errors.push(r.id + ' missing conceptId');
  if(!r.taughtInLessonId) errors.push(r.id + ' missing taughtInLessonId');
  if(!r.requiredConcepts) warns.push(r.id + ' missing requiredConcepts');
  if(r.questions) {
    r.questions.forEach(function(q, i) {
      if(!q.explanation) errors.push(r.id + ' question ' + i + ' missing explanation');
    });
  }
});

// 5. B1 Writing
console.log('Checking B1 writing...');
var b1Writing = writing.B1 || [];
b1Writing.forEach(function(w) {
  if(!w.conceptId) errors.push(w.id + ' missing conceptId');
  if(!w.taughtInLessonId) errors.push(w.id + ' missing taughtInLessonId');
  if(!w.requiredConcepts) warns.push(w.id + ' missing requiredConcepts');
  if(!w.rubric) warns.push(w.id + ' missing rubric');
  if(!w.usefulPhrases) warns.push(w.id + ' missing usefulPhrases');
});

// 6. B1 Speaking
console.log('Checking B1 speaking...');
var b1Speaking = speaking.B1 || [];
b1Speaking.forEach(function(s) {
  if(!s.conceptId) errors.push(s.id + ' missing conceptId');
  if(!s.taughtInLessonId) errors.push(s.id + ' missing taughtInLessonId');
  if(!s.requiredConcepts) warns.push(s.id + ' missing requiredConcepts');
  if(!s.rubric) warns.push(s.id + ' missing rubric');
  if(!s.usefulPhrases) warns.push(s.id + ' missing usefulPhrases');
});

// 7. B1 Vocabulary
console.log('Checking B1 vocabulary...');
var b1Vocab = vocab.B1 || [];
b1Vocab.forEach(function(v) {
  // Noun missing article -> error
  if(v.partOfSpeech === 'noun' && !v.article) {
    warns.push(v.id + ' (' + v.word + ') is a noun but missing article');
  }
  // Noun missing plural -> warn (unless marked uncountable)
  if(v.article && !v.plural) {
    warns.push(v.id + ' (' + v.word + ') is a noun but missing plural');
  }
  // Missing topic -> error
  // Missing taughtInLessonId -> error (if lessonId exists but no taughtInLessonId)
  if(v.lessonId && !v.taughtInLessonId) {
    errors.push(v.id + ' (' + v.word + ') missing taughtInLessonId (lessonId=' + v.lessonId + ')');
  }
});

// Summary
console.log('\n========== B1 Quality Validation ==========');
console.log('Errors: ' + errors.length);
errors.forEach(function(e) { console.log('  ERROR: ' + e); });
console.log('Warnings: ' + warns.length);
warns.forEach(function(w) { console.log('  WARN: ' + w); });

if(errors.length > 0) {
  console.log('\n❌ Validation FAILED with ' + errors.length + ' error(s)');
  process.exit(1);
} else if(warns.length > 0) {
  console.log('\n⚠️  Validation PASSED with ' + warns.length + ' warning(s)');
} else {
  console.log('\n✅ Validation PASSED with no issues');
}
