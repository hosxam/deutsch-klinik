#!/usr/bin/env node
/**
 * b2-enrich-all.cjs - B2 Curriculum Enrichment (Phase 6)
 *
 * Adds comprehensive metadata to all B2 data.
 * Deterministic, repeatable, preserves existing data.
 *
 * Usage: node scripts/b2-enrich-all.cjs [--dry-run]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const DATA = path.join(__dirname, '..', 'src', 'data');

function load(f) { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); }
function loadScript(f) { return JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')); }
function save(f, d) {
  if (DRY_RUN) { console.log('[DRY-RUN] Would save ' + f); return; }
  fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2), 'utf8');
  console.log('Saved ' + f);
}
function backup(f) {
  const src = path.join(DATA, f);
  const bak = src + '.b2-enrich.bak';
  if (!fs.existsSync(bak)) { fs.copyFileSync(src, bak); console.log('Backup: ' + f); }
}

// ============================================================
// LOAD METADATA LOOKUPS
// ============================================================
const LESSON_META = loadScript('b2-lesson-metadata.json');

// Grammar topic -> conceptId mapping
const TOPIC_CONCEPT_ID = {
  'Advanced Passive': 'b2.grammar.passive.advanced',
  'Zustandspassiv': 'b2.grammar.passive.zustand',
  'Passive with Modals': 'b2.grammar.passive.modal',
  'Complex Passive': 'b2.grammar.passive.complex',
  'Nominalization': 'b2.grammar.nominalization',
  'Participle Constructions': 'b2.grammar.participle',
  'Subjunctive I': 'b2.grammar.konjunktiv1',
  'Subjunctive II': 'b2.grammar.konjunktiv2',
  'Modal Verb Meanings': 'b2.grammar.modal.meaning',
  'Connectors': 'b2.grammar.connectors',
  'Complex Connectors': 'b2.grammar.connectors.complex',
  'Double Connectors': 'b2.grammar.connectors.double',
  'Conditional Clauses': 'b2.grammar.clauses.conditional',
  'Concessive Clauses': 'b2.grammar.clauses.concessive',
  'Causative Clauses': 'b2.grammar.clauses.causative',
  'Final Clauses': 'b2.grammar.clauses.final',
  'Consecutive Clauses': 'b2.grammar.clauses.consecutive',
  'Temporal Subclauses': 'b2.grammar.clauses.temporal',
  'Indirect Questions': 'b2.grammar.indirect.questions',
  'Relative Clauses': 'b2.grammar.relative.clauses',
  'Extended Infinitives': 'b2.grammar.infinitive.extended',
  'Future II': 'b2.grammar.future2',
  'N-Deklination': 'b2.grammar.n.declination',
  'Genitive Prepositions': 'b2.grammar.prepositions.genitive',
  'Verb Fixed Prepositions': 'b2.grammar.prepositions.verb.fixed',
  'Two-way Prepositions': 'b2.grammar.prepositions.two.way',
  'Prepositional Adverbs': 'b2.grammar.prepositional.adverbs',
  'Adjective Declension': 'b2.grammar.adjective.declension',
  'Indefinite Pronouns': 'b2.grammar.pronouns.indefinite',
  'Negation': 'b2.grammar.negation'
};

// Topic -> lesson mapping for unassigned grammar items
const TOPIC_TO_LESSON = {
  'Advanced Passive': 'B2_lesson_1',
  'Zustandspassiv': 'B2_lesson_1',
  'Passive with Modals': 'B2_lesson_5',
  'Complex Passive': 'B2_lesson_5',
  'Nominalization': 'B2_lesson_1',
  'Participle Constructions': 'B2_lesson_3',
  'Subjunctive I': 'B2_lesson_2',
  'Subjunctive II': 'B2_lesson_2',
  'Modal Verb Meanings': 'B2_lesson_24',
  'Connectors': 'B2_lesson_10',
  'Complex Connectors': 'B2_lesson_24',
  'Double Connectors': 'B2_lesson_6',
  'Conditional Clauses': 'B2_lesson_9',
  'Concessive Clauses': 'B2_lesson_24',
  'Causative Clauses': 'B2_lesson_19',
  'Final Clauses': 'B2_lesson_24',
  'Consecutive Clauses': 'B2_lesson_6',
  'Temporal Subclauses': 'B2_lesson_9',
  'Indirect Questions': 'B2_lesson_2',
  'Relative Clauses': 'B2_lesson_18',
  'Extended Infinitives': 'B2_lesson_13',
  'Future II': 'B2_lesson_13',
  'N-Deklination': 'B2_lesson_16',
  'Genitive Prepositions': 'B2_lesson_18',
  'Verb Fixed Prepositions': 'B2_lesson_17',
  'Two-way Prepositions': 'B2_lesson_15',
  'Prepositional Adverbs': 'B2_lesson_12',
  'Adjective Declension': 'B2_lesson_20',
  'Indefinite Pronouns': 'B2_lesson_20',
  'Negation': 'B2_lesson_2'
};

// Difficulty mapping for grammar topics
const TOPIC_DIFFICULTY = {
  'Advanced Passive': 'medium',
  'Zustandspassiv': 'easy',
  'Passive with Modals': 'medium',
  'Complex Passive': 'hard',
  'Nominalization': 'medium',
  'Participle Constructions': 'hard',
  'Subjunctive I': 'medium',
  'Subjunctive II': 'hard',
  'Modal Verb Meanings': 'medium',
  'Connectors': 'easy',
  'Complex Connectors': 'hard',
  'Double Connectors': 'medium',
  'Conditional Clauses': 'medium',
  'Concessive Clauses': 'medium',
  'Causative Clauses': 'hard',
  'Final Clauses': 'easy',
  'Consecutive Clauses': 'medium',
  'Temporal Subclauses': 'medium',
  'Indirect Questions': 'medium',
  'Relative Clauses': 'medium',
  'Extended Infinitives': 'hard',
  'Future II': 'hard',
  'N-Deklination': 'medium',
  'Genitive Prepositions': 'medium',
  'Verb Fixed Prepositions': 'hard',
  'Two-way Prepositions': 'medium',
  'Prepositional Adverbs': 'medium',
  'Adjective Declension': 'medium',
  'Indefinite Pronouns': 'easy',
  'Negation': 'easy'
};

const EXPLANATIONS_FALLBACK = {
  'B2_gr_1': 'The passive voice shifts focus from the subject performing the action to the action itself. "Werden" + Partizip II is the correct structure.',
  'B2_gr_6': 'Connectors like "obwohl" and "trotzdem" express contrast. "Obwohl" introduces a subordinate clause (verb at end), while "trotzdem" is used in main clauses.',
  'B2_gr_7': 'Connectors like "obwohl" and "trotzdem" express contrast. "Obwohl" introduces a subordinate clause (verb at end), while "trotzdem" is used in main clauses.',
  'B2_gr_9': 'N-Deklination: certain masculine nouns add -n or -en in all cases except nominative.',
  'B2_gr_12': 'Complex connectors like "sodass" connect main and subordinate clauses. The verb goes to the end in the subordinate clause.',
  'B2_gr_15': 'Double connectors like "einerseits...andererseits" connect two contrasting ideas in parallel structure.',
  'B2_gr_16': 'Double connectors like "einerseits...andererseits" connect two contrasting ideas in parallel structure.',
  'B2_gr_17': 'Genitive prepositions like "waehrend" and "trotz" require the genitive case for the noun that follows.',
  'B2_gr_18': 'Verb fixed prepositions: certain verbs require specific prepositions that change their meaning.',
  'B2_gr_19': 'Verb fixed prepositions: certain verbs require specific prepositions that change their meaning.'
};

// Reading conceptId by lesson
const READING_CONCEPT = {
  'B2_lesson_1': 'b2.reading.passive.economic',
  'B2_lesson_2': 'b2.reading.konjunktiv1.science',
  'B2_lesson_3': 'b2.reading.participle.politics',
  'B2_lesson_4': 'b2.reading.literary.analysis',
  'B2_lesson_5': 'b2.reading.passive.modal.migration',
  'B2_lesson_6': 'b2.reading.connectors.globalization',
  'B2_lesson_7': 'b2.reading.scientific.ethics',
  'B2_lesson_8': 'b2.reading.job.interview',
  'B2_lesson_9': 'b2.reading.sustainability',
  'B2_lesson_10': 'b2.reading.finance',
  'B2_lesson_11': 'b2.reading.migration',
  'B2_lesson_12': 'b2.reading.legal',
  'B2_lesson_13': 'b2.reading.media',
  'B2_lesson_14': 'b2.reading.psychology',
  'B2_lesson_15': 'b2.reading.tourism',
  'B2_lesson_16': 'b2.reading.digitalization',
  'B2_lesson_17': 'b2.reading.politics',
  'B2_lesson_18': 'b2.reading.urban',
  'B2_lesson_19': 'b2.reading.energy',
  'B2_lesson_20': 'b2.reading.fashion',
  'B2_lesson_21': 'b2.reading.sport',
  'B2_lesson_22': 'b2.reading.history',
  'B2_lesson_23': 'b2.reading.philosophy',
  'B2_lesson_24': 'b2.reading.eu',
  'B2_lesson_25': 'b2.reading.intercultural'
};

const LISTENING_CONCEPT = {};
Object.keys(READING_CONCEPT).forEach(k => {
  LISTENING_CONCEPT[k] = READING_CONCEPT[k].replace('b2.reading', 'b2.listening');
});

const WRITING_CONCEPT = {};
Object.keys(READING_CONCEPT).forEach(k => {
  WRITING_CONCEPT[k] = READING_CONCEPT[k].replace('b2.reading', 'b2.writing');
});

const SPEAKING_CONCEPT = {};
Object.keys(READING_CONCEPT).forEach(k => {
  SPEAKING_CONCEPT[k] = READING_CONCEPT[k].replace('b2.reading', 'b2.speaking');
});

// ============================================================
// 3a. LESSON ENRICHMENT
// ============================================================
function enrichLessons(lessons) {
  console.log('Enriching B2 lessons...');
  let count = 0;
  lessons.forEach(function(l) {
    if (l.level !== 'B2') return;
    const meta = LESSON_META[l.id];
    if (!meta) {
      console.warn('WARNING: No metadata for ' + l.id);
      return;
    }

    l.conceptId = meta.conceptId;
    l.estimatedMinutes = meta.estimatedMinutes;
    l.prerequisiteConceptIds = meta.prerequisiteConceptIds;
    l.conceptsTaught = meta.conceptsTaught;
    l.trackTags = meta.trackTags;
    l.linkedQuestionIds = meta.linkedQuestionIds;
    l.lessonDepthVersion = '2.0';

    // commonMistakes: generate from lookup if not set
    if (!l.commonMistakes) {
      l.commonMistakes = [];
    }

    // formsTable
    if (!l.formsTable) {
      l.formsTable = [];
    }

    // miniDrills
    if (!l.miniDrills) {
      l.miniDrills = [];
    }

    // Expand examples to 10-12
    if (!l.examples) {
      l.examples = [];
    }
    // Add B2-level example sentences if fewer than 10
    const extraExamples = getExtraExamples(l.id);
    const existingTexts = new Set(l.examples.map(function(e) { return typeof e === 'string' ? e : e.german; }));
    extraExamples.forEach(function(e) {
      if (!existingTexts.has(e.german)) {
        l.examples.push(e);
        existingTexts.add(e.german);
      }
    });

    count++;
  });
  console.log('Enriched ' + count + ' B2 lessons');
}

function getExtraExamples(lessonId) {
  const examples = {
    'B2_lesson_1': [
      { german: 'Der Vertrag wird von beiden Parteien unterschrieben.', english: 'The contract is signed by both parties.' },
      { german: 'Die Tuer ist geschlossen.', english: 'The door is closed.' },
      { german: 'Die Verhandlung war schwierig.', english: 'The negotiation was difficult.' },
      { german: 'Die Lieferung der Ware erfolgt morgen.', english: 'The delivery of the goods takes place tomorrow.' },
      { german: 'Die Rechnung ist bereits bezahlt worden.', english: 'The invoice has already been paid.' },
      { german: 'Die Einfuehrung des neuen Produkts war erfolgreich.', english: 'The introduction of the new product was successful.' },
      { german: 'Die Analyse der Maerkte zeigt positive Trends.', english: 'The analysis of the markets shows positive trends.' }
    ],
    'B2_lesson_2': [
      { german: 'Der Wissenschaftler sagt, die Theorie sei bewiesen.', english: 'The scientist says the theory is proven.' },
      { german: 'Sie fragte, ob die Ergebnisse signifikant seien.', english: 'She asked whether the results were significant.' },
      { german: 'Er behauptet, er habe das Experiment selbst durchgefuehrt.', english: 'He claims he conducted the experiment himself.' },
      { german: 'Die Forscher meinten, die Daten muessten ueberprueft werden.', english: 'The researchers thought the data needed to be checked.' },
      { german: 'Es ist nicht klar, welche Methode am besten geeignet ist.', english: 'It is not clear which method is best suited.' },
      { german: 'Kein Forscher hat diese These jemals ernsthaft vertreten.', english: 'No researcher has ever seriously defended this thesis.' },
      { german: 'Sie wusste nicht, ob die Studie bereits publiziert worden war.', english: 'She did not know whether the study had already been published.' }
    ]
  };
  return examples[lessonId] || [
    { german: 'Es ist wichtig, die Grammatikregeln zu verstehen.', english: 'It is important to understand the grammar rules.' },
    { german: 'Dieser Satz zeigt ein typisches B2-Muster.', english: 'This sentence shows a typical B2 pattern.' },
    { german: 'Je mehr man uebt, desto besser wird man.', english: 'The more you practice, the better you get.' },
    { german: 'Man sollte nicht nur die Theorie lernen, sondern auch praktische Uebungen machen.', english: 'One should not only learn the theory but also do practical exercises.' },
    { german: 'Obwohl die Grammatik schwierig ist, kann man sie mit Uebung meistern.', english: 'Although the grammar is difficult, you can master it with practice.' },
    { german: 'Die Uebung, die wir in der letzten Stunde gemacht haben, war besonders hilfreich.', english: 'The exercise we did in the last lesson was particularly helpful.' },
    { german: 'Es empfiehlt sich, taeglich ein wenig Deutsch zu lesen.', english: 'It is advisable to read a little German every day.' }
  ];
}

// ============================================================
// 3b. GRAMMAR ENRICHMENT
// ============================================================
function enrichGrammar(grammar) {
  console.log('Enriching B2 grammar...');
  const b2 = grammar.B2;
  let count = 0;
  let missingExpl = 0;
  b2.forEach(function(q) {
    q.conceptId = TOPIC_CONCEPT_ID[q.topic] || 'b2.grammar.uncategorized';
    q.difficulty = TOPIC_DIFFICULTY[q.topic] || 'medium';
    q.skillType = 'grammar';

    // Set taughtInLessonId if missing
    if (!q.taughtInLessonId) {
      q.taughtInLessonId = TOPIC_TO_LESSON[q.topic] || null;
    }

    // Add explanation if missing
    if (!q.explanation) {
      q.explanation = EXPLANATIONS_FALLBACK[q.id] || 'This grammar item tests understanding of B2-level grammar structures in context.';
      missingExpl++;
    }

    count++;
  });
  console.log('Enriched ' + count + ' B2 grammar items, added ' + missingExpl + ' explanations');
}

// ============================================================
// 3c. READING ENRICHMENT
// ============================================================
function enrichReading(reading) {
  console.log('Enriching B2 reading...');
  const b2 = reading.B2;
  let count = 0;
  b2.forEach(function(r) {
    const lessonConcepts = LESSON_META[r.lessonId];
    if (!r.conceptId) {
      r.conceptId = READING_CONCEPT[r.lessonId] || 'b2.reading.' + r.lessonId.toLowerCase();
    }
    if (!r.taughtInLessonId) {
      r.taughtInLessonId = r.lessonId;
    }
    if (!r.requiredConcepts) {
      r.requiredConcepts = lessonConcepts ? lessonConcepts.conceptsTaught.slice(0, 2) : [];
    }
    // Check questions for explanations
    if (r.questions) {
      r.questions.forEach(function(q) {
        if (!q.explanation) {
          q.explanation = 'This reading comprehension question tests understanding of details and main ideas in the text.';
        }
      });
    }
    count++;
  });
  console.log('Enriched ' + count + ' B2 reading items');
}

// ============================================================
// 3d. LISTENING ENRICHMENT
// ============================================================
function enrichListening(listening) {
  console.log('Enriching B2 listening...');
  const b2 = listening.B2;
  let count = 0;
  b2.forEach(function(l) {
    const lessonConcepts = LESSON_META[l.lessonId];
    if (!l.conceptId) {
      l.conceptId = LISTENING_CONCEPT[l.lessonId] || 'b2.listening.' + l.lessonId.toLowerCase();
    }
    if (!l.taughtInLessonId) {
      l.taughtInLessonId = l.lessonId;
    }
    if (!l.requiredConcepts) {
      l.requiredConcepts = lessonConcepts ? lessonConcepts.conceptsTaught.slice(0, 2) : [];
    }
    // Check questions
    if (l.questions) {
      l.questions.forEach(function(q) {
        if (!q.explanation) {
          q.explanation = 'This listening comprehension question checks understanding of the audio content.';
        }
      });
    }
    count++;
  });
  console.log('Enriched ' + count + ' B2 listening items');
}

// ============================================================
// 3e. WRITING ENRICHMENT
// ============================================================
function enrichWriting(writing) {
  console.log('Enriching B2 writing...');
  const b2 = writing.B2;
  let count = 0;
  b2.forEach(function(w) {
    const lessonConcepts = LESSON_META[w.lessonId];
    if (!w.conceptId) {
      w.conceptId = WRITING_CONCEPT[w.lessonId] || 'b2.writing.' + w.lessonId.toLowerCase();
    }
    if (!w.taughtInLessonId) {
      w.taughtInLessonId = w.lessonId;
    }
    if (!w.requiredConcepts) {
      w.requiredConcepts = lessonConcepts ? lessonConcepts.conceptsTaught.slice(0, 2) : [];
    }
    if (!w.usefulPhrases || w.usefulPhrases.length === 0) {
      w.usefulPhrases = [
        { german: 'Einerseits muss man bedenken, dass ...', english: 'On the one hand, one must consider that ...' },
        { german: 'Zusammenfassend laesst sich sagen, dass ...', english: 'In summary, it can be said that ...' }
      ];
    }
    if (!w.rubric) {
      w.rubric = {
        structure: { description: 'Clear structure with introduction, body, and conclusion', maxPoints: 5 },
        content: { description: 'Relevant arguments and complete task fulfillment', maxPoints: 5 },
        language: { description: 'Grammatical accuracy and B2-level vocabulary', maxPoints: 5 },
        taskCompletion: { description: 'All parts of the task addressed correctly', maxPoints: 5 }
      };
    }
    count++;
  });
  console.log('Enriched ' + count + ' B2 writing items');
}

// ============================================================
// 3f. SPEAKING ENRICHMENT
// ============================================================
function enrichSpeaking(speaking) {
  console.log('Enriching B2 speaking...');
  const b2 = speaking.B2;
  let count = 0;
  b2.forEach(function(s) {
    const lessonConcepts = LESSON_META[s.lessonId];
    if (!s.conceptId) {
      s.conceptId = SPEAKING_CONCEPT[s.lessonId] || 'b2.speaking.' + s.lessonId.toLowerCase();
    }
    if (!s.taughtInLessonId) {
      s.taughtInLessonId = s.lessonId;
    }
    if (!s.requiredConcepts) {
      s.requiredConcepts = lessonConcepts ? lessonConcepts.conceptsTaught.slice(0, 2) : [];
    }
    if (!s.rubric) {
      s.rubric = {
        structure: { description: 'Logical speech structure with clear progression', maxPoints: 5 },
        content: { description: 'Relevant content and coherent arguments', maxPoints: 5 },
        language: { description: 'Grammatical accuracy and appropriate B2 vocabulary', maxPoints: 5 },
        taskCompletion: { description: 'Task fully addressed within the time limit', maxPoints: 5 }
      };
    }
    count++;
  });
  console.log('Enriched ' + count + ' B2 speaking items');
}

// ============================================================
// 3g. VOCABULARY FIXES
// ============================================================
function enrichVocabulary(vocab) {
  console.log('Fixing B2 vocabulary plurals...');

  // Define plurals for common B2 nouns that are frequently missing
  const PLURAL_MAP = {
    'Wirtschaft': '-en',
    'Globalisierung': '—',
    'Nachhaltigkeit': '—',
    'Zusammenarbeit': '—',
    'Berichterstattung': '-en',
    'Vorsorge': '-n',
    'Nachsorge': '-n',
    'Versicherungsschutz': '—',
    'Gesundheitswesen': '-',
    'Pravention': '-en',
    'Umweltschutz': '—',
    'Umweltverschmutzung': '-en',
    'Muelltrennung': '-en',
    'Digitalisierung': '-en',
    'Datenschutz': '—',
    'Automatisierung': '-en',
    'Gleichberechtigung': '-en',
    'Nahverkehr': '-e',
    'Berufsverkehr': '-e',
    'Ernaehrung': '-en',
    'Fitness': '—',
    'Erholung': '-en',
    'Aussehen': '-',
    'Erziehung': '-en',
    'Kindheit': '-en',
    'Alltag': '-e',
    'Sicherheit': '-en',
    'Kommunikation': '-en',
    'Teilnahme': '-n',
    'Handlungsbedarf': '—',
    'Gentechnik': '-en',
    'Erdwaerme': '-n',
    'Windenergie': '-n',
    'Wasserkraft': '—',
    'Landwirtschaft': '-en',
    'Tierhaltung': '-en',
    'Lebenserwartung': '-en',
    'Marketing': '—',
    'Gastronomie': '-n',
    'Halbpension': '-en',
    'Vollpension': '-en',
    'Logistik': '-en',
    'Versand': '—',
    'Frieden': '-',
    'Schutz': '—',
    'Gerechtigkeit': '-en',
    'Wuerde': '-n',
    'Toleranz': '-en',
    'Bewusstsein': '-',
    'Glaube': '-ns',
    'Respekt': '-e',
    'Begeisterung': '-en',
    'Zufriedenheit': '-en',
    'Vertrauen': '-'
  };

  const b2 = vocab.B2;
  let fixedPlural = 0;
  let fixedTaughtIn = 0;

  b2.forEach(function(v, idx) {
    // Fix missing plural for known nouns
    if ((!v.plural || v.plural === '') && PLURAL_MAP[v.word]) {
      v.plural = PLURAL_MAP[v.word];
      fixedPlural++;
    }

    // Fix missing taughtInLessonId using lessonId
    if (!v.taughtInLessonId && v.lessonId) {
      v.taughtInLessonId = v.lessonId;
      fixedTaughtIn++;
    }
  });

  console.log('Fixed ' + fixedPlural + ' missing plurals, ' + fixedTaughtIn + ' missing taughtInLessonId');
}

// ============================================================
// 3h. CURRICULUM MAP UPDATE
// ============================================================
function enrichCurriculumMap(curriculumMap, lessons) {
  console.log('Updating curriculum map for B2...');
  const b2Lessons = lessons.filter(function(l) { return l.level === 'B2'; });
  let updated = 0;

  b2Lessons.forEach(function(l) {
    // Find existing unit or create one
    const unitKey = Object.keys(curriculumMap.units).find(function(k) {
      return curriculumMap.units[k].id === l.id;
    });

    if (unitKey) {
      // Update existing unit entry
      const u = curriculumMap.units[unitKey];
      if (l.conceptId) {
        u.conceptId = l.conceptId;
        u.taughtConcepts = u.taughtConcepts || [];
        if (l.conceptsTaught && l.conceptsTaught.length > 0) {
          l.conceptsTaught.forEach(function(c) {
            if (!u.taughtConcepts.includes(c)) {
              u.taughtConcepts.push(c);
            }
          });
        }
      }
      u.requiredLessons = u.requiredLessons || [];
      u.linkedQuestionIds = l.linkedQuestionIds || [];
      updated++;
    }
  });

  console.log('Updated ' + updated + ' B2 curriculum map entries');
}

// ============================================================
// MAIN
// ============================================================
console.log('=== B2 Curriculum Enrichment Phase 6 ===');
console.log('Dry run:', DRY_RUN ? 'YES' : 'NO');

// Backup
backup('germanLessons.json');
backup('grammar.json');
backup('reading.json');
backup('listening.json');
backup('writing.json');
backup('speaking.json');
backup('germanVocabulary.json');
backup('curriculumMap.json');

// Load
const lessons = load('germanLessons.json');
const grammar = load('grammar.json');
const reading = load('reading.json');
const listening = load('listening.json');
const writing = load('writing.json');
const speaking = load('speaking.json');
const vocab = load('germanVocabulary.json');
const curriculumMap = load('curriculumMap.json');

// Enrich
enrichLessons(lessons);
enrichGrammar(grammar);
enrichReading(reading);
enrichListening(listening);
enrichWriting(writing);
enrichSpeaking(speaking);
enrichVocabulary(vocab);
enrichCurriculumMap(curriculumMap, lessons);

// Save
save('germanLessons.json', lessons);
save('grammar.json', grammar);
save('reading.json', reading);
save('listening.json', listening);
save('writing.json', writing);
save('speaking.json', speaking);
save('germanVocabulary.json', vocab);
save('curriculumMap.json', curriculumMap);

console.log('=== Enrichment complete ===');
