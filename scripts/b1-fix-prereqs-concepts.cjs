/**
 * b1-fix-prereqs-concepts.cjs
 * Fix B1 lesson prerequisiteConceptIds and conceptsTaught to reference
 * REAL existing lesson conceptIds (not made-up ones).
 *
 * Deterministic. Safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA, 'grammar.json'), 'utf-8'));

// Build lookup: all REAL lesson conceptIds + lesson IDs
const realLessonConceptIds = new Set();
lessons.forEach(l => {
  realLessonConceptIds.add(l.id);
  if (l.conceptId) realLessonConceptIds.add(l.conceptId);
  (l.conceptsTaught || []).forEach(c => realLessonConceptIds.add(c));
});

// Also add all grammar conceptIds as valid references
const allGrammarConceptIds = new Set();
['A1','A2','B1','B2','C1'].forEach(lvl => {
  (grammar[lvl] || []).forEach(g => {
    if (g.conceptId) allGrammarConceptIds.add(g.conceptId);
  });
});

// Map: B1 lesson -> corrected prerequisiteConceptIds (pointing to REAL A2 lesson conceptIds or real B1 lesson conceptIds)
const FIXED_PREREQS = {
  "B1_lesson_1": ["a2.dass.saetze", "a2.weil.saetze"],
  "B1_lesson_2": ["a2.weather.seasons", "a2.holidays.celebrations"],
  "B1_lesson_3": ["a2.education.language", "a2.hobbies.free.time"],
  "B1_lesson_4": ["a2.invitations.appointments", "a2.holidays.celebrations"],
  "B1_lesson_5": ["a2.technology.media", "a2.animals.nature"],
  "B1_lesson_6": ["a2.daily.routine", "a2.praeteritum.haben.sein"],
  "B1_lesson_7": ["a2.work.workplace", "a2.shopping.services"],
  "B1_lesson_8": ["a2.technology.media", "a2.animals.nature"],
  "B1_lesson_9": ["b1.environment.daily", "b1.umzu.clauses"],
  "B1_lesson_10": ["a2.work.workplace", "a2.perfect.tense"],
  "B1_lesson_11": ["b1.opinion.media", "b1.subordinate.obwohl"],
  "B1_lesson_12": ["a2.food.restaurant", "b1.relative.clauses.nom.acc"],
  "B1_lesson_13": ["b1.future.technology", "b1.futur1"],
  "B1_lesson_14": ["a2.housing.rental", "a2.shopping.services"],
  "B1_lesson_15": ["a2.travel.transport", "a2.directions.traffic"],
  "B1_lesson_16": ["a2.invitations.appointments", "a2.reflexive.verben"],
  "B1_lesson_17": ["b1.social.media", "b1.passiv.praesens"],
  "B1_lesson_18": ["a2.food.restaurant", "a2.hotel.accommodation"],
  "B1_lesson_19": ["b1.public.transport", "a2.travel.transport"],
  "B1_lesson_20": ["b1.environment.conservation", "b1.umzu.clauses"],
  "B1_lesson_21": ["b1.education.system", "a2.education.language"],
  "B1_lesson_22": ["b1.film.culture", "b1.relative.clauses.nom.acc"],
  "B1_lesson_23": ["a2.hobbies.free.time", "a2.body.parts.appearance"],
  "B1_lesson_24": ["b1.public.transport", "b1.genitive.intro"],
  "B1_lesson_25": ["b1.konjunktiv2.wishes", "a2.shopping.services"]
};

// Map: B1 lesson -> corrected conceptsTaught (using REAL grammar conceptIds)
const FIXED_CONCEPTS = {
  "B1_lesson_1": ["b1.subordinate.obwohl", "b1.subordinate.dass", "b1.subordinate.weil", "b1.connectors.complex"],
  "B1_lesson_2": ["b1.connectors.cause.effect", "b1.temporal.connectors", "b1.connectors.complex"],
  "B1_lesson_3": ["b1.comparisons.complex", "b1.indirect.questions", "b1.word.order.complex"],
  "B1_lesson_4": ["b1.konjunktiv2.politeness", "b1.konjunktiv2.general"],
  "B1_lesson_5": ["b1.futur1", "b1.word.order.complex"],
  "B1_lesson_6": ["b1.prateritum.haben.sein.modal", "b1.temporal.connectors"],
  "B1_lesson_7": ["b1.prepositions.fixed.case", "b1.sentence.transformation"],
  "B1_lesson_8": ["b1.passiv.praesens", "b1.lassen.usage"],
  "B1_lesson_9": ["b1.umzu.clauses", "b1.connectors.cause.effect"],
  "B1_lesson_10": ["b1.prateritum.haben.sein.modal", "b1.participle.adjectives"],
  "B1_lesson_11": ["b1.relative.clauses.nom", "b1.relative.clauses.acc", "b1.relative.clauses.general"],
  "B1_lesson_12": ["b1.relative.clauses.dat", "b1.n.declension", "b1.relative.clauses.general"],
  "B1_lesson_13": ["b1.konjunktiv2.general", "b1.konjunktiv2.modal", "b1.konjunktiv2.wishes"],
  "B1_lesson_14": ["b1.prepositions.fixed.case", "b1.pronominal.adverbs"],
  "B1_lesson_15": ["b1.genitive.intro", "b1.n.declension"],
  "B1_lesson_16": ["b1.reflexive.verbs.extended", "b1.pronominal.adverbs"],
  "B1_lesson_17": ["b1.passiv.prateritum", "b1.sentence.transformation"],
  "B1_lesson_18": ["b1.konjunktiv2.politeness", "b1.prepositions.fixed.case"],
  "B1_lesson_19": ["b1.pronominal.adverbs", "b1.sentence.transformation"],
  "B1_lesson_20": ["b1.umzu.clauses", "b1.connectors.cause.effect"],
  "B1_lesson_21": ["b1.word.order.complex", "b1.indirect.questions", "b1.sentence.transformation"],
  "B1_lesson_22": ["b1.relative.clauses.general", "b1.pronominal.adverbs"],
  "B1_lesson_23": ["b1.temporal.connectors", "b1.sentence.transformation"],
  "B1_lesson_24": ["b1.adjective.endings.nom", "b1.adjective.endings.acc", "b1.adjective.endings.dat"],
  "B1_lesson_25": ["b1.konjunktiv2.unreal", "b1.konjunktiv2.modal", "b1.konjunktiv2.general"]
};

// Validate all prereqs and concepts against real conceptIds
console.log('=== Validating fixed concept references ===');
let errors = 0;

Object.entries(FIXED_PREREQS).forEach(([lessonId, prereqs]) => {
  prereqs.forEach(p => {
    if (!realLessonConceptIds.has(p) && !allGrammarConceptIds.has(p)) {
      console.log('  ERROR: ' + lessonId + ' prereq ' + p + ' not found in ANY real concept');
      errors++;
    }
  });
});

Object.entries(FIXED_CONCEPTS).forEach(([lessonId, concepts]) => {
  concepts.forEach(c => {
    if (!realLessonConceptIds.has(c) && !allGrammarConceptIds.has(c)) {
      console.log('  ERROR: ' + lessonId + ' concept ' + c + ' not found in ANY real concept');
      errors++;
    }
  });
});

if (errors > 0) {
  console.log('\n' + errors + ' errors found. Fix the mapping and re-run.');
  process.exit(1);
}

console.log('All references validated against real conceptIds. Proceeding to apply fixes.\n');

// Apply fixes
let fixCount = 0;
lessons.forEach(lesson => {
  if (lesson.level !== 'B1') return;

  if (FIXED_PREREQS[lesson.id]) {
    const oldPrereqs = JSON.stringify(lesson.prerequisiteConceptIds || []);
    lesson.prerequisiteConceptIds = FIXED_PREREQS[lesson.id];
    const newPrereqs = JSON.stringify(lesson.prerequisiteConceptIds);
    if (oldPrereqs !== newPrereqs) {
      console.log('  ' + lesson.id + ' prereqs: ' + oldPrereqs + ' -> ' + newPrereqs);
      fixCount++;
    }
  }

  if (FIXED_CONCEPTS[lesson.id]) {
    const oldConcepts = JSON.stringify(lesson.conceptsTaught || []);
    lesson.conceptsTaught = FIXED_CONCEPTS[lesson.id];
    const newConcepts = JSON.stringify(lesson.conceptsTaught);
    if (oldConcepts !== newConcepts) {
      console.log('  ' + lesson.id + ' conceptsTaught: ' + oldConcepts + ' -> ' + newConcepts);
      fixCount++;
    }
  }
});

fs.writeFileSync(path.join(DATA, 'germanLessons.json'), JSON.stringify(lessons, null, 2), 'utf-8');
console.log('\nApplied ' + fixCount + ' fixes to germanLessons.json');
console.log('Done.');
