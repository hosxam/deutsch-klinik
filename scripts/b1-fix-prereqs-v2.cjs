/**
 * b1-fix-prereqs-v2.cjs
 * Fix B1 lesson prerequisiteConceptIds and conceptsTaught to use
 * ONLY conceptIds that exist as lesson conceptIds (for prereqs)
 * and REAL grammar conceptIds (for conceptsTaught).
 *
 * Deterministic. Safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA, 'grammar.json'), 'utf-8'));

// Build set of valid prereq targets: lesson IDs + lesson conceptIds
const validPrereqTargets = new Set();
lessons.forEach(l => {
  validPrereqTargets.add(l.id);
  if (l.conceptId) validPrereqTargets.add(l.conceptId);
});

// Build set of valid B1 grammar conceptIds
const b1GramConcepts = new Set();
(grammar.B1 || []).forEach(g => {
  if (g.conceptId) b1GramConcepts.add(g.conceptId);
});

// B1 conceptsTaught must come from these valid B1 grammar conceptIds
console.log('Available B1 grammar conceptIds for conceptsTaught:');
[...b1GramConcepts].sort().forEach(c => console.log('  ' + c));

// ===== FIXED MAPPING =====
// prerequisiteConceptIds: only lesson IDs or lesson conceptIds
// conceptsTaught: only B1 grammar conceptIds (that have grammar items)

const FIXED_PREREQS = {
  "B1_lesson_1": ["A2_lesson_5", "A2_lesson_9"],
  "B1_lesson_2": ["A2_lesson_13", "A2_lesson_16"],
  "B1_lesson_3": ["A2_lesson_14", "A2_lesson_9"],
  "B1_lesson_4": ["A2_lesson_15", "A2_lesson_16"],
  "B1_lesson_5": ["A2_lesson_20", "A2_lesson_21"],
  "B1_lesson_6": ["A2_lesson_2", "A1_lesson_11"],
  "B1_lesson_7": ["A2_lesson_8", "A2_lesson_6"],
  "B1_lesson_8": ["A2_lesson_20", "A2_lesson_21"],
  "B1_lesson_9": ["B1_lesson_2", "A2_lesson_21"],
  "B1_lesson_10": ["A2_lesson_8", "A2_lesson_3"],
  "B1_lesson_11": ["B1_lesson_1", "A2_lesson_21"],
  "B1_lesson_12": ["A2_lesson_7", "B1_lesson_11"],
  "B1_lesson_13": ["B1_lesson_5", "B1_lesson_1"],
  "B1_lesson_14": ["A2_lesson_10", "A2_lesson_6"],
  "B1_lesson_15": ["A2_lesson_4", "A2_lesson_23"],
  "B1_lesson_16": ["A2_lesson_15", "A2_lesson_17"],
  "B1_lesson_17": ["B1_lesson_8", "B1_lesson_5"],
  "B1_lesson_18": ["A2_lesson_7", "A2_lesson_5"],
  "B1_lesson_19": ["B1_lesson_15", "A2_lesson_4"],
  "B1_lesson_20": ["B1_lesson_9", "A2_lesson_22"],
  "B1_lesson_21": ["B1_lesson_3", "A2_lesson_9"],
  "B1_lesson_22": ["B1_lesson_11", "B1_lesson_12"],
  "B1_lesson_23": ["A2_lesson_14", "A2_lesson_17"],
  "B1_lesson_24": ["B1_lesson_15", "B1_lesson_3"],
  "B1_lesson_25": ["B1_lesson_13", "A2_lesson_6"]
};

const FIXED_CONCEPTS = {
  "B1_lesson_1": ["b1.subordinate.obwohl", "b1.subordinate.dass", "b1.subordinate.weil", "b1.subordinate.wenn", "b1.connectors.complex"],
  "B1_lesson_2": ["b1.connectors.cause.effect", "b1.temporal.connectors", "b1.connectors.complex"],
  "B1_lesson_3": ["b1.comparisons.complex", "b1.indirect.questions", "b1.word.order.complex"],
  "B1_lesson_4": ["b1.konjunktiv2.politeness", "b1.konjunktiv2.general", "b1.konjunktiv2.modal"],
  "B1_lesson_5": ["b1.word.order.complex", "b1.pronominal.adverbs"],
  "B1_lesson_6": ["b1.temporal.connectors", "b1.prepositions.fixed.case", "b1.grammar.general"],
  "B1_lesson_7": ["b1.prepositions.fixed.case", "b1.sentence.transformation", "b1.pronominal.adverbs"],
  "B1_lesson_8": ["b1.passiv.praesens", "b1.passiv.prateritum", "b1.lassen.usage"],
  "B1_lesson_9": ["b1.umzu.clauses", "b1.connectors.cause.effect"],
  "B1_lesson_10": ["b1.participle.adjectives", "b1.temporal.connectors", "b1.grammar.general"],
  "B1_lesson_11": ["b1.relative.clauses.nom", "b1.relative.clauses.acc", "b1.relative.clauses.general"],
  "B1_lesson_12": ["b1.relative.clauses.dat", "b1.n.declension", "b1.relative.clauses.general"],
  "B1_lesson_13": ["b1.konjunktiv2.general", "b1.konjunktiv2.modal", "b1.word.order.complex"],
  "B1_lesson_14": ["b1.prepositions.fixed.case", "b1.pronominal.adverbs"],
  "B1_lesson_15": ["b1.genitive.intro", "b1.n.declension", "b1.pronominal.adverbs"],
  "B1_lesson_16": ["b1.reflexive.verbs.extended", "b1.pronominal.adverbs", "b1.prepositions.fixed.case"],
  "B1_lesson_17": ["b1.passiv.prateritum", "b1.sentence.transformation", "b1.passiv.praesens"],
  "B1_lesson_18": ["b1.konjunktiv2.politeness", "b1.prepositions.fixed.case", "b1.pronominal.adverbs"],
  "B1_lesson_19": ["b1.pronominal.adverbs", "b1.sentence.transformation", "b1.prepositions.fixed.case"],
  "B1_lesson_20": ["b1.umzu.clauses", "b1.connectors.cause.effect", "b1.temporal.connectors"],
  "B1_lesson_21": ["b1.word.order.complex", "b1.indirect.questions", "b1.sentence.transformation", "b1.pronominal.adverbs"],
  "B1_lesson_22": ["b1.relative.clauses.general", "b1.pronominal.adverbs", "b1.relative.clauses.nom"],
  "B1_lesson_23": ["b1.temporal.connectors", "b1.sentence.transformation", "b1.prepositions.fixed.case"],
  "B1_lesson_24": ["b1.adjective.endings.nom", "b1.adjective.endings.acc", "b1.adjective.endings.dat"],
  "B1_lesson_25": ["b1.konjunktiv2.general", "b1.konjunktiv2.modal", "b1.word.order.complex"]
};

// Validate every prereq against valid targets
console.log('=== Validating prereqs ===');
let errors = 0;
Object.entries(FIXED_PREREQS).forEach(([lid, prereqs]) => {
  prereqs.forEach(pr => {
    if (!validPrereqTargets.has(pr)) {
      console.log('  ERROR: ' + lid + ' prereq ' + pr + ' not valid');
      errors++;
    }
  });
});
if (errors > 0) { console.log('\n' + errors + ' prereq errors'); process.exit(1); }
console.log('All prereqs valid.\n');

// Validate every conceptTaught against B1 grammar
console.log('=== Validating conceptsTaught ===');
errors = 0;
Object.entries(FIXED_CONCEPTS).forEach(([lid, concepts]) => {
  concepts.forEach(c => {
    if (!b1GramConcepts.has(c)) {
      console.log('  ERROR: ' + lid + ' concept ' + c + ' not in B1 grammar');
      errors++;
    }
  });
});
if (errors > 0) { console.log('\n' + errors + ' concept errors'); process.exit(1); }
console.log('All conceptsTaught valid.\n');

// Also set lesson conceptId to first conceptsTaught entry (so it becomes a valid lesson conceptId)
console.log('=== Setting lesson conceptIds ===');
Object.entries(FIXED_CONCEPTS).forEach(([lid, concepts]) => {
  const lesson = lessons.find(l => l.id === lid);
  if (lesson) {
    const oldCid = lesson.conceptId || '(none)';
    lesson.conceptId = concepts[0]; // first concept = lesson identity
    console.log('  ' + lid + ': ' + oldCid + ' -> ' + lesson.conceptId);
  }
});

// Apply fixes
console.log('\n=== Applying fixes ===');
Object.entries(FIXED_PREREQS).forEach(([lid, prereqs]) => {
  const lesson = lessons.find(l => l.id === lid);
  if (lesson) {
    lesson.prerequisiteConceptIds = prereqs;
  }
});
Object.entries(FIXED_CONCEPTS).forEach(([lid, concepts]) => {
  const lesson = lessons.find(l => l.id === lid);
  if (lesson) {
    lesson.conceptsTaught = concepts;
  }
});

fs.writeFileSync(path.join(DATA, 'germanLessons.json'), JSON.stringify(lessons, null, 2), 'utf-8');
console.log('Written germanLessons.json');
console.log('Done.');
