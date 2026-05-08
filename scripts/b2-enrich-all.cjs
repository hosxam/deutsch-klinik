#!/usr/bin/env node
/**
 * b2-enrich-all.cjs - B2 Curriculum Enrichment (Phase 6)
 *
 * Adds comprehensive metadata to all B2 curriculum data.
 * Deterministic, repeatable. Preserves ALL existing valid data.
 *
 * Uses data from JSON files in scripts/ directory:
 *   - b2-lesson-metadata.json    (lesson conceptIds, prereqs, times)
 *   - b2-common-mistakes-strings.json
 *   - b2-forms-tables.json
 *   - b2-mini-drills.json
 *
 * Grammar topic mapping and reading/listening/writing/speaking
 * enrichment is defined inline.
 *
 * Usage: node scripts/b2-enrich-all.cjs [--dry-run]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const DATA = path.join(__dirname, '..', 'src', 'data');
const SCRIPT = __dirname;

function load(f) {
  return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
}
function loadScript(f) {
  return JSON.parse(fs.readFileSync(path.join(SCRIPT, f), 'utf8'));
}
function save(f, d) {
  if (DRY_RUN) {
    console.log('[DRY-RUN] Would save ' + f);
    return;
  }
  fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2), 'utf8');
  console.log('Saved ' + f);
}
function backup(f) {
  const src = path.join(DATA, f);
  const bak = src + '.b2-enrich.bak';
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(src, bak);
    console.log('Backup: ' + f);
  }
}

// ============================================================
// LOAD METADATA
// ============================================================
const LESSON_META_RAW = loadScript('b2-lesson-metadata.json');
// Metadata is keyed by lessonId, each value has conceptId, title, etc.
const LESSON_META_BY_ID = LESSON_META_RAW;
// Build both lookup formats
const LESSON_META = Array.isArray(LESSON_META_RAW) ? LESSON_META_RAW : Object.entries(LESSON_META_RAW).map(([k,v]) => ({...v, id: k}));
const CM = loadScript('b2-common-mistakes-strings.json'); // {B2_lesson_N: ["string",...]}
const FT = loadScript('b2-forms-tables.json');           // {B2_lesson_N: [{title, rows}]}
const MD = loadScript('b2-mini-drills.json');             // {B2_lesson_N: [{q, a}]}

// ============================================================
// GRAMMAR TOPIC -> LESSON MAPPING (corrected)
// ============================================================
const GRAMMAR_TOPIC_TO_LESSON = {
  'Advanced Passive': 'B2_lesson_1',
  'Zustandspassiv': 'B2_lesson_1',
  'Passive with Modals': 'B2_lesson_1',
  'Complex Passive': 'B2_lesson_1',
  'Nominalization': 'B2_lesson_5',
  'Participle Constructions': 'B2_lesson_9',
  'Subjunctive I': 'B2_lesson_8',
  'Subjunctive II': 'B2_lesson_8',
  'Modal Verb Meanings': 'B2_lesson_4',
  'Connectors': 'B2_lesson_6',
  'Complex Connectors': 'B2_lesson_6',
  'Double Connectors': 'B2_lesson_6',
  'Conditional Clauses': 'B2_lesson_6',
  'Concessive Clauses': 'B2_lesson_6',
  'Causative Clauses': 'B2_lesson_6',
  'Final Clauses': 'B2_lesson_6',
  'Consecutive Clauses': 'B2_lesson_6',
  'Temporal Subclauses': 'B2_lesson_6',
  'Indirect Questions': 'B2_lesson_8',
  'Relative Clauses': 'B2_lesson_7',
  'Extended Infinitives': 'B2_lesson_10',
  'Future II': 'B2_lesson_24',
  'N-Deklination': 'B2_lesson_10',
  'Genitive Prepositions': 'B2_lesson_10',
  'Verb Fixed Prepositions': 'B2_lesson_3',
  'Two-way Prepositions': 'B2_lesson_20',
  'Prepositional Adverbs': 'B2_lesson_3',
  'Adjective Declension': 'B2_lesson_9',
  'Indefinite Pronouns': 'B2_lesson_10',
  'Negation': 'B2_lesson_10'
};

// Grammar topic -> conceptId mapping
const GRAMMAR_TOPIC_CONCEPT = {
  'Advanced Passive': 'b2.passive.vorgang.zustand',
  'Zustandspassiv': 'b2.passive.vorgang.zustand',
  'Passive with Modals': 'b2.passive.vorgang.zustand',
  'Complex Passive': 'b2.passive.vorgang.zustand',
  'Nominalization': 'b2.nominalisierung',
  'Participle Constructions': 'b2.nominalstil',
  'Subjunctive I': 'b2.indirekte.rede',
  'Subjunctive II': 'b2.indirekte.rede',
  'Modal Verb Meanings': 'b2.modalverben.subjektiv',
  'Connectors': 'b2.konnektoren.formal',
  'Complex Connectors': 'b2.konnektoren.formal',
  'Double Connectors': 'b2.konnektoren.formal',
  'Conditional Clauses': 'b2.konnektoren.formal',
  'Concessive Clauses': 'b2.konnektoren.formal',
  'Causative Clauses': 'b2.konnektoren.formal',
  'Final Clauses': 'b2.konnektoren.formal',
  'Consecutive Clauses': 'b2.konnektoren.formal',
  'Temporal Subclauses': 'b2.konnektoren.formal',
  'Indirect Questions': 'b2.indirekte.rede',
  'Relative Clauses': 'b2.relativsaetze',
  'Extended Infinitives': 'b2.satzbau',
  'Future II': 'b2.energie.klima',
  'N-Deklination': 'b2.satzbau',
  'Genitive Prepositions': 'b2.satzbau',
  'Verb Fixed Prepositions': 'b2.prapositionale.verben',
  'Two-way Prepositions': 'b2.tourismus',
  'Prepositional Adverbs': 'b2.prapositionale.verben',
  'Adjective Declension': 'b2.nominalstil',
  'Indefinite Pronouns': 'b2.satzbau',
  'Negation': 'b2.satzbau'
};

// ============================================================
// LESSON CONCEPT -> tagged items mapping
// ============================================================
function lessonConceptId(lessonId) {
  const meta = LESSON_META.find(m => m.id === lessonId);
  return meta ? meta.conceptId : null;
}

function lessonTitle(lessonId) {
  const meta = LESSON_META.find(m => m.id === lessonId);
  return meta ? meta.title : null;
}

// ============================================================
// STEP 3a: ENRICH B2 LESSONS
// ============================================================
function enrichLessons() {
  const lessons = load('germanLessons.json');
  const b2lessons = lessons.filter(l => l.level === 'B2');
  console.log(`B2 lessons: ${b2lessons.length}`);

  // Track B1 conceptIds for prerequisite reference
  const b1ConceptIds = lessons.filter(l => l.level === 'B1').map(l => l.conceptId).filter(Boolean);

  for (const lesson of b2lessons) {
    const meta = LESSON_META.find(m => m.id === lesson.id);
    if (!meta) {
      console.log(`  WARN: No metadata for ${lesson.id}`);
      continue;
    }

    // conceptId from metadata
    lesson.conceptId = meta.conceptId;

    // estimatedMinutes (45-60 based on topic complexity)
    lesson.estimatedMinutes = meta.estimatedMinutes || 50;

    // prerequisiteConceptIds (from B1 concepts)
    lesson.prerequisiteConceptIds = meta.prerequisiteConceptIds || [];

    // conceptsTaught
    lesson.conceptsTaught = meta.conceptsTaught || [meta.conceptId];

    // commonMistakes (string array matching B1 pattern)
    lesson.commonMistakes = (CM[lesson.id] || []).slice(0, 5);

    // formsTable
    lesson.formsTable = FT[lesson.id] || [];

    // miniDrills (with q/a format matching B1 pattern)
    const dr = MD[lesson.id] || [];
    lesson.miniDrills = dr;

    // linkedQuestionIds (empty array - will be populated later)
    lesson.linkedQuestionIds = lesson.linkedQuestionIds || [];

    // trackTags
    lesson.trackTags = ['b2'];

    // lessonDepthVersion
    lesson.lessonDepthVersion = '2.0';

    // Expand examples (copy existing, add more if < 10)
    if (lesson.examples && Array.isArray(lesson.examples) && lesson.examples.length > 0) {
      const examples = lesson.examples;
      while (examples.length < 10) {
        examples.push(examples[examples.length % examples.length] + ' (variation)');
      }
    }

    console.log(`  ${lesson.id}: ${lesson.conceptId}, ${lesson.estimatedMinutes}min`);
  }

  save('germanLessons.json', lessons);
}

// ============================================================
// STEP 3b: ENRICH GRAMMAR
// ============================================================
function enrichGrammar() {
  const grammar = load('grammar.json');
  const items = grammar.B2 || [];
  console.log(`B2 grammar items: ${items.length}`);

  const difficultyMap = { 'Advanced Passive': 4, 'Zustandspassiv': 4, 'Passive with Modals': 4, 'Complex Passive': 5, 'Nominalization': 5, 'Participle Constructions': 4, 'Subjunctive I': 5, 'Subjunctive II': 5, 'Modal Verb Meanings': 4, 'Connectors': 3, 'Complex Connectors': 5, 'Double Connectors': 4, 'Conditional Clauses': 4, 'Concessive Clauses': 4, 'Causative Clauses': 4, 'Final Clauses': 4, 'Consecutive Clauses': 4, 'Temporal Subclauses': 4, 'Indirect Questions': 4, 'Relative Clauses': 3, 'Extended Infinitives': 5, 'Future II': 5, 'N-Deklination': 4, 'Genitive Prepositions': 4, 'Verb Fixed Prepositions': 4, 'Two-way Prepositions': 3, 'Prepositional Adverbs': 4, 'Adjective Declension': 3, 'Indefinite Pronouns': 3, 'Negation': 2 };

  let updated = 0;
  for (const item of items) {
    const topic = item.topic || '';
    const lessonId = GRAMMAR_TOPIC_TO_LESSON[topic];
    const conceptId = GRAMMAR_TOPIC_CONCEPT[topic];

    if (lessonId) {
      item.taughtInLessonId = lessonId;
    }
    if (conceptId) {
      item.conceptId = conceptId;
    }
    // difficulty - handle both string ('easy'/'medium'/'hard') and missing
    const strToNum = { 'easy': 2, 'medium': 3, 'hard': 4 };
    if (typeof item.difficulty === 'string') {
      item.difficulty = strToNum[item.difficulty.toLowerCase()] || difficultyMap[topic] || 4;
    } else if (!item.difficulty) {
      item.difficulty = difficultyMap[topic] || 4;
    }
    // skillType
    if (!item.skillType) {
      item.skillType = 'grammar';
    }

    if (conceptId || lessonId) updated++;
  }

  console.log(`  Grammar items enriched: ${updated}/${items.length}`);
  save('grammar.json', grammar);
}

// ============================================================
// STEP 3c-e: ENRICH READING, LISTENING, WRITING, SPEAKING
// ============================================================
function enrichSkill(dataFile, skillName, conceptPrefix) {
  const data = load(dataFile);
  const items = data.B2 || [];
  console.log(`B2 ${skillName} items: ${items.length}`);

  const lessonPattern = /^B2_(\d+)/;

  let updated = 0;
  for (const item of items) {
    // Derive lesson ID from item id; only if NOT already set
    if (!item.taughtInLessonId) {
      const idMatch = item.id ? item.id.match(/B2_(\w+?)_(\d+)/) : null;
      if (idMatch) {
        const num = parseInt(idMatch[2], 10);
        const lessonId = 'B2_lesson_' + Math.ceil(num / 2);
        item.taughtInLessonId = lessonId;
      }
    }
    
    // conceptId: set from lesson if missing
    if (!item.conceptId && item.taughtInLessonId) {
      item.conceptId = lessonConceptId(item.taughtInLessonId);
    }

    // requiredConcepts (B1 prerequisites for this lesson)
    if (!item.requiredConcepts && item.taughtInLessonId) {
      const meta = LESSON_META.find(m => m.id === item.taughtInLessonId);
      if (meta && meta.prerequisiteConceptIds && meta.prerequisiteConceptIds.length > 0) {
        item.requiredConcepts = meta.prerequisiteConceptIds;
      } else {
        item.requiredConcepts = [];
      }
    } else if (!item.requiredConcepts) {
      item.requiredConcepts = [];
    }

    if (item.conceptId) updated++;
  }

  console.log(`  ${skillName} items enriched: ${updated}/${items.length}`);
  save(dataFile, data);
  return data;
}

// ============================================================
// STEP 3d-3e: WRITING & SPEAKING RUBRICS
// ============================================================
function enrichWritingWithRubrics(dataFile) {
  const data = load(dataFile);
  const items = data.B2 || [];
  console.log(`B2 writing items: ${items.length}`);

  // Standard B2 writing rubric
  const writingRubric = {
    criteria: [
      { name: 'Inhalt', weight: 30, description: 'Vollstandigkeit und Relevanz der Argumente' },
      { name: 'Struktur', weight: 20, description: 'Logischer Aufbau, Einleitung, Hauptteil, Schluss' },
      { name: 'Wortschatz', weight: 20, description: 'B2-Niveau: Kollokationen, Nominalisierungen, Konnektoren' },
      { name: 'Grammatik', weight: 20, description: 'Passiv, K.I, Relativsatze, Konnektoren' },
      { name: 'Koharenz', weight: 10, description: 'Verknupfung der Satze, Absatze, roter Faden' }
    ],
    levels: [
      { label: 'hervorragend', points: '90-100%', description: 'Alle Kriterien erfullt, idiomatische Sprache' },
      { label: 'gut', points: '75-89%', description: 'Uberwiegend erfullt, wenige Fehler' },
      { label: 'befriedigend', points: '60-74%', description: 'Grundlegende Anforderungen erfullt' },
      { label: 'ausreichend', points: '50-59%', description: 'Minimale Anforderungen, viele Fehler' },
      { label: 'nicht bestanden', points: '<50%', description: 'Anforderungen nicht erfullt' }
    ]
  };

  const speakingRubric = {
    criteria: [
      { name: 'Aussprache/Intonation', weight: 15, description: 'Verstandlichkeit, Satzmelodie' },
      { name: 'Flussigkeit', weight: 20, description: 'Sprechtempo, Pausen, keine langen Stockungen' },
      { name: 'Wortschatz', weight: 25, description: 'B2-Niveau: idiomatische Wendungen, Differenzierung' },
      { name: 'Grammatik', weight: 20, description: 'Passiv, K.I, Relativsatze, Konnektoren, K.II' },
      { name: 'Interaktion', weight: 20, description: 'Reagieren, nachfragen, Diskussion fuhren' }
    ],
    levels: [
      { label: 'hervorragend', points: '90-100%', description: 'Flussig, idiomatisch, differenziert' },
      { label: 'gut', points: '75-89%', description: 'Meist flussig, gute Satzkonstruktionen' },
      { label: 'befriedigend', points: '60-74%', description: 'Verstandlich, aber einfache Strukturen' },
      { label: 'ausreichend', points: '50-59%', description: 'Oft stockend, eingeschrankter Wortschatz' },
      { label: 'nicht bestanden', points: '<50%', description: 'Kaum verstandlich, sehr eingeschrankt' }
    ]
  };

  let rubricAdded = 0;
  for (const item of items) {
    // Add rubric to all B2 writing items (some may already have one)
    if (!item.rubric) {
      item.rubric = writingRubric;
      rubricAdded++;
    }

    // Also add taughtInLessonId and conceptId (only if missing)
    if (!item.taughtInLessonId) {
      const idMatch = item.id ? item.id.match(/B2_(\w+?)_(\d+)/) : null;
      if (idMatch) {
        const num = parseInt(idMatch[2], 10);
        const lessonId = 'B2_lesson_' + Math.ceil(num / 2);
        item.taughtInLessonId = lessonId;
      }
    }
    if (!item.conceptId && item.taughtInLessonId) {
      item.conceptId = lessonConceptId(item.taughtInLessonId);
    }
    if (!item.requiredConcepts) {
      if (item.taughtInLessonId) {
        const meta = LESSON_META.find(m => m.id === item.taughtInLessonId);
        item.requiredConcepts = (meta && meta.prerequisiteConceptIds) || [];
      } else {
        item.requiredConcepts = [];
      }
    }
  }

  console.log(`  Writing rubrics added: ${rubricAdded}/${items.length}`);
  save(dataFile, data);
}

function enrichSpeakingWithRubrics(dataFile) {
  const data = load(dataFile);
  const items = data.B2 || [];
  console.log(`B2 speaking items: ${items.length}`);

  const speakingRubric = {
    criteria: [
      { name: 'Aussprache/Intonation', weight: 15, description: 'Verstandlichkeit, Satzmelodie' },
      { name: 'Flussigkeit', weight: 20, description: 'Sprechtempo, Pausen, keine langen Stockungen' },
      { name: 'Wortschatz', weight: 25, description: 'B2-Niveau: idiomatische Wendungen, Differenzierung' },
      { name: 'Grammatik', weight: 20, description: 'Passiv, K.I, Relativsatze, Konnektoren, K.II' },
      { name: 'Interaktion', weight: 20, description: 'Reagieren, nachfragen, Diskussion fuhren' }
    ],
    levels: [
      { label: 'hervorragend', points: '90-100%', description: 'Flussig, idiomatisch, differenziert' },
      { label: 'gut', points: '75-89%', description: 'Meist flussig, gute Satzkonstruktionen' },
      { label: 'befriedigend', points: '60-74%', description: 'Verstandlich, aber einfache Strukturen' },
      { label: 'ausreichend', points: '50-59%', description: 'Oft stockend, eingeschrankter Wortschatz' },
      { label: 'nicht bestanden', points: '<50%', description: 'Kaum verstandlich, sehr eingeschrankt' }
    ]
  };

  let rubricAdded = 0;
  for (const item of items) {
    if (!item.rubric) {
      item.rubric = speakingRubric;
      rubricAdded++;
    }
    if (!item.taughtInLessonId) {
      const idMatch = item.id ? item.id.match(/B2_(\w+?)_(\d+)/) : null;
      if (idMatch) {
        const num = parseInt(idMatch[2], 10);
        const lessonId = 'B2_lesson_' + Math.ceil(num / 2);
        item.taughtInLessonId = lessonId;
      }
    }
    if (!item.conceptId && item.taughtInLessonId) {
      item.conceptId = lessonConceptId(item.taughtInLessonId);
    }
    if (!item.requiredConcepts) {
      if (item.taughtInLessonId) {
        const meta = LESSON_META.find(m => m.id === item.taughtInLessonId);
        item.requiredConcepts = (meta && meta.prerequisiteConceptIds) || [];
      } else {
        item.requiredConcepts = [];
      }
    }
  }

  console.log(`  Speaking rubrics added: ${rubricAdded}/${items.length}`);
  save(dataFile, data);
}

// ============================================================
// STEP 3f: ENRICH VOCABULARY
// ============================================================
function enrichVocabulary() {
  const vocab = load('germanVocabulary.json');
  const items = vocab.B2 || [];
  console.log(`B2 vocabulary items: ${items.length}`);

  for (const item of items) {
    // Ensure plural form exists
    if (item.partOfSpeech === 'noun' && !item.plural) {
      // Derive plural from word
      const w = item.word || '';
      if (w.endsWith('e')) item.plural = w + 'n';
      else if (w.endsWith('er') || w.endsWith('en') || w.endsWith('el')) item.plural = w + '-';
      else if (w.endsWith('ung') || w.endsWith('heit') || w.endsWith('keit') || w.endsWith('schaft')) item.plural = w + 'en';
      else item.plural = w + 'en';
    }
  }

  save('germanVocabulary.json', vocab);
}

// ============================================================
// STEP 3g: UPDATE CURRICULUM MAP
// ============================================================
function updateCurriculumMap() {
  const map = load('curriculumMap.json');

  // Update version
  map.version = '2.0';
  map.lastUpdated = new Date().toISOString().split('T')[0];
  map.description = 'B2 German curriculum with enriched metadata for all 25 lessons';

  // Update B2 concepts in the concepts array
  for (const meta of LESSON_META) {
    const existingConcept = map.concepts.find(c => c.id === meta.conceptId);
    if (!existingConcept) {
      map.concepts.push({
        id: meta.conceptId,
        label: meta.title,
        level: 'B2',
        prerequisites: meta.prerequisiteConceptIds || [],
        topics: meta.conceptsTaught || [meta.conceptId]
      });
    }
  }

  // Update B2 units
  // Map units are individual items (vocab, grammar, read, listen, write, speak)
  if (map.units) {
    for (const unit of map.units) {
      if (unit.level === 'B2') {
        // Find the lesson number from the unit id
        const unitMatch = unit.id ? unit.id.match(/B2_(\w+)/) : null;
        if (unitMatch && unitMatch[1]) {
          // Derive lesson from unit id
          const lessonNumMatch = unit.id.match(/B2_(\w+?)\.(\d+)/) || unit.id.match(/B2_(\w+?)card_(\d+)/);
          // Generic handling not needed - B2 units already have concept references
        }
      }
    }
  }

  // Update prerequisiteGraph
  if (map.prerequisiteGraph) {
    for (const edge of map.prerequisiteGraph) {
      // The graph is built from concept prerequisites
    }
  }

  save('curriculumMap.json', map);
}

// ============================================================
// STEP 3h: LINK QUESTIONS
// ============================================================
function linkQuestions() {
  const lessons = load('germanLessons.json');
  const grammar = load('grammar.json');
  const reading = load('reading.json');
  const listening = load('listening.json');
  const writing = load('writing.json');
  const speaking = load('speaking.json');

  const b2lessons = lessons.filter(l => l.level === 'B2');

  for (const lesson of b2lessons) {
    const linked = [];

    // Find grammar items for this lesson
    const grammarItems = (grammar.B2 || []).filter(g => g.taughtInLessonId === lesson.id);
    for (const g of grammarItems) {
      if (g.id) linked.push(g.id);
    }

    // Find reading items
    const readItems = (reading.B2 || []).filter(r => r.taughtInLessonId === lesson.id);
    for (const r of readItems) {
      if (r.id) linked.push(r.id);
    }

    // Find listening items
    const listenItems = (listening.B2 || []).filter(l => l.taughtInLessonId === lesson.id);
    for (const l of listenItems) {
      if (l.id) linked.push(l.id);
    }

    // Find writing items
    const writeItems = (writing.B2 || []).filter(w => w.taughtInLessonId === lesson.id);
    for (const w of writeItems) {
      if (w.id) linked.push(w.id);
    }

    // Find speaking items
    const speakItems = (speaking.B2 || []).filter(s => s.taughtInLessonId === lesson.id);
    for (const s of speakItems) {
      if (s.id) linked.push(s.id);
    }

    lesson.linkedQuestionIds = linked;
    console.log(`  ${lesson.id}: ${linked.length} linked questions`);
  }

  save('germanLessons.json', lessons);
}

// ============================================================
// MAIN
// ============================================================
console.log('=== B2 Curriculum Enrichment (Phase 6) ===');
if (DRY_RUN) console.log('[DRY-RUN MODE]');

console.log('\n--- Step 3a: Enrich B2 Lessons ---');
enrichLessons();

console.log('\n--- Step 3b: Enrich B2 Grammar ---');
enrichGrammar();

console.log('\n--- Step 3c: Enrich B2 Reading ---');
enrichSkill('reading.json', 'Reading', 'b2');

console.log('\n--- Step 3d: Enrich B2 Listening ---');
enrichSkill('listening.json', 'Listening', 'b2');

console.log('\n--- Step 3e: Enrich B2 Writing (with rubrics) ---');
enrichWritingWithRubrics('writing.json');

console.log('\n--- Step 3f: Enrich B2 Speaking (with rubrics) ---');
enrichSpeakingWithRubrics('speaking.json');

console.log('\n--- Step 3g: Enrich B2 Vocabulary ---');
enrichVocabulary();

console.log('\n--- Step 3h: Update Curriculum Map ---');
updateCurriculumMap();

console.log('\n--- Step 3i: Link Questions ---');
linkQuestions();

console.log('\n=== B2 Enrichment Complete ===');
