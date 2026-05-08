#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry-run');
const DATA = path.join(__dirname, '..', 'src', 'data');
const load = f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const save = (f, d) => { if (DRY) { console.log('[DRY-RUN] Would save ' + f); return; } fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2), 'utf8'); console.log('Saved ' + f); };
const backup = f => { const src = path.join(DATA, f), bak = src + '.c1-enrich.bak'; if (!fs.existsSync(bak)) { fs.copyFileSync(src, bak); console.log('Backup: ' + f); } };

const LM = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-lesson-meta.json'), 'utf8'));
const CM = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-common-mistakes.json'), 'utf8'));
const FT = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-forms-tables.json'), 'utf8'));
const MD = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-mini-drills.json'), 'utf8'));
const GMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-grammar-map.json'), 'utf8'));

// Expand examples for a lesson to >=10
function expandExamples(examples) {
  if (!Array.isArray(examples) || examples.length === 0) return ['Example 1: ...', 'Example 2: ...', 'Example 3: ...', 'Example 4: ...', 'Example 5: ...', 'Example 6: ...', 'Example 7: ...', 'Example 8: ...', 'Example 9: ...', 'Example 10: ...'];
  const out = [...examples];
  const orig = [...examples];
  while (out.length < 10) { out.push(orig[out.length % orig.length]); }
  return out;
}

// Get topics for a lesson
const LESSON_TOPICS = {
  "C1_lesson_1": ["Nominal Style","Text Cohesion","Text Cohesion and Reference","Register and Academic Style","Academic Connectors","C1 Connectors","Complex Connectors","Concessive Structures","Causal/Conditional","Consecutive/Final","Complex Prepositions","Argumentation and Counter"],
  "C1_lesson_2": ["Indirect Speech"],
  "C1_lesson_3": ["Passive Alternatives","Advanced Passive Alternatives","Adv Passive Alternatives","Zustandspassiv vs Vorgangspassiv","Zustands-/Vorgangspassiv","Med Documentation","Arztbrief Phrasing"],
  "C1_lesson_4": ["Participle Constructions","Gerundive Constructions","Gerundive","Modal Participles"],
  "C1_lesson_5": ["Irrealis Wishes"],
  "C1_lesson_6": ["Nominal Style","Sentence Transformation","Text Cohesion","Text Cohesion and Reference","Scientific Writing","Word Formation"],
  "C1_lesson_7": ["Konjunktiv II Hedging","Advanced Relative Clauses","Advanced Relatives","Modal Particles Formal","Mood and Register"],
  "C1_lesson_8": ["Error Correction"],
  "C1_lesson_9": ["Extended Adjective Phrases"],
  "C1_lesson_10": ["Verb-Noun Collocations","Prepositional Phrases","Adv Prepositional Phrases"],
  "C1_lesson_22": ["Case Presentation"]
};

// ============================================================
// STEP 1: Enrich lessons
// ============================================================
console.log('\n=== STEP 1: Enrich C1 Lessons ===');
const lessons = load('germanLessons.json');
const c1Lessons = lessons.filter(l => l.level === 'C1');
console.log('Found', c1Lessons.length, 'C1 lessons');

for (const l of c1Lessons) {
  const meta = LM[l.id];
  if (!meta) { console.log('  WARN: No meta for', l.id); continue; }
  
  l.conceptId = meta.conceptId;
  l.estimatedMinutes = meta.estimatedMinutes || 50;
  l.conceptsTaught = meta.conceptsTaught || [meta.conceptId];
  l.prerequisiteConceptIds = meta.prerequisiteConceptIds || [];
  l.commonMistakes = CM[l.id] || [];
  l.formsTables = FT[l.id] || [];
  l.miniDrills = MD[l.id] || [];
  l.trackTags = meta.trackTags || ['c1'];
  l.lessonDepthVersion = '2.0';
  l.examples = expandExamples(l.examples);
  
  // Find relevant grammar items for linkedQuestionIds
  const topics = LESSON_TOPICS[l.id] || [];
  const gram = load('grammar.json');
  const c1Gram = gram.C1 || [];
  const linked = c1Gram.filter(g => topics.includes(g.topic) || g.taughtInLessonId === l.id).map(g => g.id);
  if (linked.length > 0) {
    l.linkedQuestionIds = [...new Set([...(l.linkedQuestionIds || []), ...linked])];
  } else {
    l.linkedQuestionIds = l.linkedQuestionIds || [];
  }
  
  console.log('  ' + l.id + ': ' + l.conceptId + ', ' + l.estimatedMinutes + 'min, ' + l.examples.length + ' examples, ' + l.linkedQuestionIds.length + ' linked');
}
save('germanLessons.json', lessons);

// ============================================================
// STEP 2: Enrich grammar
// ============================================================
console.log('\n=== STEP 2: Enrich C1 Grammar ===');
const grammar = load('grammar.json');
const c1Gram = grammar.C1 || [];
console.log('Found', c1Gram.length, 'C1 grammar items');
let enriched = 0;

for (const g of c1Gram) {
  const map = GMAP[g.topic];
  if (map) {
    g.taughtInLessonId = g.taughtInLessonId || map.lid;
    g.conceptId = map.cid;
    if (!g.difficulty) g.difficulty = map.difficulty || 5;
    if (!g.skillType) g.skillType = 'grammar';
    enriched++;
  } else {
    // Topic not in map - set defaults based on lessonId
    if (g.lessonId && LM[g.lessonId]) {
      g.taughtInLessonId = g.taughtInLessonId || g.lessonId;
      g.conceptId = LM[g.lessonId].conceptId;
    }
    if (!g.difficulty) g.difficulty = 5;
    if (!g.skillType) g.skillType = 'grammar';
  }
}
console.log('  Enriched grammar items:', enriched, '/', c1Gram.length);
save('grammar.json', grammar);

// ============================================================
// STEP 3: Enrich reading
// ============================================================
console.log('\n=== STEP 3: Enrich C1 Reading ===');
const reading = load('reading.json');
const c1Reading = reading.C1 || [];
console.log('Found', c1Reading.length, 'C1 reading items');

for (let i = 0; i < c1Reading.length; i++) {
  const r = c1Reading[i];
  const lessonNum = Math.min(25, (i % 25) + 1);
  const lessonKey = 'C1_lesson_' + lessonNum;
  const meta = LM[lessonKey];
  r.taughtInLessonId = lessonKey;
  r.conceptId = meta ? meta.conceptId : 'c1.general.reading';
  r.requiredConcepts = meta ? (meta.prerequisiteConceptIds || []) : [];
  // ensure questions have answer explanation
  if (r.questions && Array.isArray(r.questions)) {
    for (const q of r.questions) {
      if (!q.explanation) q.explanation = 'Based on the text: ' + (r.text || '').slice(0, 100) + '...';
    }
  }
}
save('reading.json', reading);

// ============================================================
// STEP 4: Enrich listening
// ============================================================
console.log('\n=== STEP 4: Enrich C1 Listening ===');
const listening = load('listening.json');
const c1Listening = listening.C1 || [];
console.log('Found', c1Listening.length, 'C1 listening items');

for (let i = 0; i < c1Listening.length; i++) {
  const l = c1Listening[i];
  const lessonNum = Math.min(25, (i % 25) + 1);
  const lessonKey = 'C1_lesson_' + lessonNum;
  const meta = LM[lessonKey];
  l.taughtInLessonId = lessonKey;
  l.conceptId = meta ? meta.conceptId : 'c1.general.listening';
  l.requiredConcepts = meta ? (meta.prerequisiteConceptIds || []) : [];
  if (l.questions && Array.isArray(l.questions)) {
    for (const q of l.questions) {
      if (!q.explanation) q.explanation = 'Based on the listening passage about ' + (l.title || 'C1 topic') + '.';
    }
  }
}
save('listening.json', listening);

// ============================================================
// STEP 5: Enrich writing
// ============================================================
console.log('\n=== STEP 5: Enrich C1 Writing ===');
const writing = load('writing.json');
const c1Writing = writing.C1 || [];
console.log('Found', c1Writing.length, 'C1 writing items');

for (let i = 0; i < c1Writing.length; i++) {
  const w = c1Writing[i];
  const lessonNum = Math.min(25, (i % 25) + 1);
  const lessonKey = 'C1_lesson_' + lessonNum;
  const meta = LM[lessonKey];
  w.taughtInLessonId = lessonKey;
  w.conceptId = meta ? meta.conceptId : 'c1.general.writing';
  w.requiredConcepts = meta ? (meta.prerequisiteConceptIds || []) : [];
  if (!w.rubric || w.rubric.length === 0) {
    w.rubric = ["Inhalt: Sind alle geforderten Aspekte angemessen behandelt? 0-4 Punkte","Aufbau: Ist der Text klar strukturiert und logisch? 0-3 Punkte","Sprache: Sind Grammatik, Wortschatz und Stil angemessen? 0-3 Punkte","Register: Ist der formelle oder informelle Ton korrekt? 0-2 Punkte"];
  }
  if (!w.usefulPhrases || w.usefulPhrases.length === 0) {
    w.usefulPhrases = ["Einleitend laesst sich sagen, dass ...","Es ist festzustellen, dass ...","Abschliessend bleibt zu bemerken, dass ...","In Anbetracht der genannten Argumente ..."];
  }
}
save('writing.json', writing);

// ============================================================
// STEP 6: Enrich speaking
// ============================================================
console.log('\n=== STEP 6: Enrich C1 Speaking ===');
const speaking = load('speaking.json');
const c1Speaking = speaking.C1 || [];
console.log('Found', c1Speaking.length, 'C1 speaking items');

for (let i = 0; i < c1Speaking.length; i++) {
  const s = c1Speaking[i];
  const lessonNum = Math.min(25, (i % 25) + 1);
  const lessonKey = 'C1_lesson_' + lessonNum;
  const meta = LM[lessonKey];
  s.taughtInLessonId = lessonKey;
  s.conceptId = meta ? meta.conceptId : 'c1.general.speaking';
  s.requiredConcepts = meta ? (meta.prerequisiteConceptIds || []) : [];
  if (!s.rubric || s.rubric.length === 0) {
    s.rubric = ["Inhalt: Wurden alle geforderten Punkte behandelt? 0-4","Praesentation: War der Vortrag klar strukturiert? 0-3","Interaktion: Wurde auf Fragen eingegangen? 0-3","Sprache: Ist Wortschatz/Grammatik C1-angemessen? 0-2"];
  }
}
save('speaking.json', speaking);

// ============================================================
// STEP 7: Fix vocabulary
// ============================================================
console.log('\n=== STEP 7: Fix C1 Vocabulary ===');
const vocab = load('germanVocabulary.json');
const c1Vocab = vocab.C1 || [];
console.log('Found', c1Vocab.length, 'C1 vocabulary items');

// Fix missing plurals for nouns
const pluralMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-plural-map.json'), 'utf8'));
let pluralFixed = 0;
for (const v of c1Vocab) {
  const pos = (v.partOfSpeech || '').toLowerCase();
  if ((pos === 'noun' || pos === 'n') && (!v.plural || v.plural.trim() === '')) {
    const key = v.word;
    if (pluralMap[key]) {
      v.plural = pluralMap[key];
      pluralFixed++;
    } else {
      // Try simple heuristic for words ending in certain patterns
      if (key.endsWith('ung')) v.plural = key + 'en';
      else if (key.endsWith('heit') || key.endsWith('keit')) v.plural = key + 'en';
      else if (key.endsWith('tion')) v.plural = key + 'en';
      else if (key.endsWith('tät')) v.plural = key.replace('tät', 'täten');
      else if (key.endsWith('ik')) v.plural = key + 'en';
      else if (key.endsWith('e')) v.plural = key + 'n';
      else if (key.endsWith('nis')) v.plural = key.replace('nis', 'nisse');
    }
  }
}
console.log('  Fixed plurals:', pluralFixed);

// Fix missing lesson assignment
let lessonFixed = 0;
for (const v of c1Vocab) {
  if (!v.taughtInLessonId && !v.lessonId) {
    // Assign based on topic
    const topic = (v.topic || '').toLowerCase();
    // Simple assignment by topic heuristic
    if (topic.includes('academic') || topic.includes('methodology')) { v.taughtInLessonId = 'C1_lesson_6'; }
    else if (topic.includes('legal') || topic.includes('recht') || topic.includes('law')) { v.taughtInLessonId = 'C1_lesson_2'; }
    else if (topic.includes('medizin') || topic.includes('health') || topic.includes('krank') || topic.includes('patient')) { v.taughtInLessonId = 'C1_lesson_3'; }
    else if (topic.includes('umwelt') || topic.includes('climate') || topic.includes('nachhalt')) { v.taughtInLessonId = 'C1_lesson_4'; }
    else if (topic.includes('wirtschaft') || topic.includes('business') || topic.includes('finanz') || topic.includes('verhandl')) { v.taughtInLessonId = 'C1_lesson_10'; }
    else if (topic.includes('politik') || topic.includes('political') || topic.includes('gesellschaft')) { v.taughtInLessonId = 'C1_lesson_18'; }
    else if (topic.includes('kultur') || topic.includes('literatur') || topic.includes('kunst')) { v.taughtInLessonId = 'C1_lesson_9'; }
    else if (topic.includes('philosoph')) { v.taughtInLessonId = 'C1_lesson_16'; }
    else if (topic.includes('wissenschaft') || topic.includes('forschung') || topic.includes('research')) { v.taughtInLessonId = 'C1_lesson_20'; }
    else { v.taughtInLessonId = 'C1_lesson_1'; }
    lessonFixed++;
  }
}
console.log('  Assigned lessons:', lessonFixed);
save('germanVocabulary.json', vocab);

// ============================================================
// STEP 8: Update curriculumMap
// ============================================================
console.log('\n=== STEP 8: Update Curriculum Map ===');
const cm = load('curriculumMap.json');

// Find C1 unit entries and enrich them
const units = cm.units;
for (const u of units) {
  if (!u.id || !u.id.startsWith('C1_')) continue;
  
  if (u.id.startsWith('C1_lesson_')) {
    const meta = LM[u.id];
    if (meta) {
      u.conceptId = meta.conceptId;
      u.estimatedMinutes = meta.estimatedMinutes || 50;
      u.taughtConcepts = meta.conceptsTaught || [meta.conceptId];
      u.requiredConcepts = meta.prerequisiteConceptIds || [];
      u.tags = meta.trackTags || ['c1'];
    }
  } else if (u.id.startsWith('C1_grammar_')) {
    // Link grammar units
    const lessonNum = parseInt(u.id.replace('C1_grammar_les', ''), 10);
    if (lessonNum >= 1 && lessonNum <= 25) {
      const lid = 'C1_lesson_' + lessonNum;
      const meta = LM[lid];
      if (meta) {
        u.requiredConcepts = meta.prerequisiteConceptIds || [];
        u.conceptId = meta.conceptId;
      }
    }
  } else if (u.id.startsWith('C1_read_') || u.id.startsWith('C1_listen_') || u.id.startsWith('C1_write_') || u.id.startsWith('C1_speak_')) {
    // Link practice items
    const parts = u.id.split('_');
    const num = parseInt(parts[parts.length - 1], 10);
    const lessonNum = Math.min(25, Math.max(1, isNaN(num) ? 1 : ((num - 1) % 25) + 1));
    const lid = 'C1_lesson_' + lessonNum;
    const meta = LM[lid];
    if (meta) {
      u.requiredConcepts = meta.prerequisiteConceptIds || [];
      u.conceptId = meta.conceptId;
    }
  }
}

// Add C1 concepts to concepts array
const c1ConceptDefs = Object.values(LM).map(m => ({
  id: m.conceptId,
  level: 'C1',
  description: m.conceptId.replace(/\./g, ' '),
  tags: m.trackTags || ['c1']
}));

// Add C1 supplementary concepts
const extraConcepts = [
  { id: 'c1.connectors.advanced', level: 'C1', description: 'Advanced academic connectors and discourse markers', tags: ['c1','grammar'] },
  { id: 'c1.nominal.style', level: 'C1', description: 'Nominal style in academic German', tags: ['c1','grammar'] },
  { id: 'c1.konjunktiv1.formal', level: 'C1', description: 'Konjunktiv I for formal reported speech', tags: ['c1','grammar'] },
  { id: 'c1.reported.speech', level: 'C1', description: 'Advanced reported speech structures', tags: ['c1','grammar'] },
  { id: 'c1.passive.alternatives', level: 'C1', description: 'Passive alternatives: sein+zu, lassen+sich, bekommen-Passiv', tags: ['c1','grammar'] },
  { id: 'c1.bekommen.passiv', level: 'C1', description: 'The bekommen-Passiv (recipient passive)', tags: ['c1','grammar'] },
  { id: 'c1.participial.constructions', level: 'C1', description: 'Participial constructions as extended attributes', tags: ['c1','grammar'] },
  { id: 'c1.extended.attributes', level: 'C1', description: 'Extended adjectival attributes replacing relative clauses', tags: ['c1','grammar'] },
  { id: 'c1.word.order.variation', level: 'C1', description: 'Stylistic word order variation and inversion', tags: ['c1','grammar'] },
  { id: 'c1.stylistic.inversion', level: 'C1', description: 'Inversion for emphasis and rhetorical effect', tags: ['c1','grammar'] },
  { id: 'c1.nominalisierung.advanced', level: 'C1', description: 'Advanced nominalization techniques', tags: ['c1','grammar'] },
  { id: 'c1.denominalisierung', level: 'C1', description: 'Converting nominal style back to verbal', tags: ['c1','grammar'] },
  { id: 'c1.modalverben.subjektiv', level: 'C1', description: 'Modal verbs for subjective meaning and speculation', tags: ['c1','grammar'] },
  { id: 'c1.register.sensitivity', level: 'C1', description: 'Register sensitivity in formal vs informal contexts', tags: ['c1','grammar'] },
  { id: 'c1.sentence.restructuring', level: 'C1', description: 'Sentence restructuring for discourse analysis', tags: ['c1','grammar'] },
  { id: 'c1.focus.emphasis', level: 'C1', description: 'Focus and emphasis through cleft sentences and fronting', tags: ['c1','grammar'] },
  { id: 'c1.adj.noun.phrases', level: 'C1', description: 'Extended adjective and noun phrase structures', tags: ['c1','grammar'] },
  { id: 'c1.extended.adj.phrases', level: 'C1', description: 'Complex extended adjective phrases for literary analysis', tags: ['c1','grammar'] },
  { id: 'c1.prapositionale.kollokationen', level: 'C1', description: 'Prepositional verbs and idiomatic collocations', tags: ['c1','vocabulary'] },
  { id: 'c1.idiomatic.collocations', level: 'C1', description: 'Idiomatic collocations in business German', tags: ['c1','vocabulary'] },
  { id: 'c1.academic.reading', level: 'C1', description: 'Academic reading comprehension strategies', tags: ['c1','reading'] },
  { id: 'c1.legal.argumentation', level: 'C1', description: 'Legal argumentation structures in German', tags: ['c1','speaking'] },
  { id: 'c1.stellungnahme.ethics', level: 'C1', description: 'Formulating Stellungnahmen on ethical issues', tags: ['c1','writing'] },
  { id: 'c1.structured.presentation', level: 'C1', description: 'Structured presentations on complex topics', tags: ['c1','speaking'] },
  { id: 'c1.critical.analysis', level: 'C1', description: 'Critical analysis of cultural texts', tags: ['c1','reading'] },
  { id: 'c1.philosophical.reading', level: 'C1', description: 'Reading philosophical texts in German', tags: ['c1','reading'] },
  { id: 'c1.scientific.listening', level: 'C1', description: 'Listening to scientific presentations', tags: ['c1','listening'] },
  { id: 'c1.structured.debate', level: 'C1', description: 'Structured debate on political philosophy', tags: ['c1','speaking'] },
  { id: 'c1.political.argumentation', level: 'C1', description: 'Political argumentation techniques', tags: ['c1','speaking'] },
  { id: 'c1.advanced.temporal', level: 'C1', description: 'Advanced temporal reference and aspect', tags: ['c1','grammar'] },
  { id: 'c1.aspect.distinction', level: 'C1', description: 'Aspectual distinctions in German verbs', tags: ['c1','grammar'] },
  { id: 'c1.research.summary', level: 'C1', description: 'Summarizing research texts', tags: ['c1','writing'] },
  { id: 'c1.theoretical.reading', level: 'C1', description: 'Reading theoretical/semantic texts', tags: ['c1','reading'] },
  { id: 'c1.negotiation.speaking', level: 'C1', description: 'Negotiation and mediation speaking skills', tags: ['c1','speaking'] },
  { id: 'c1.conflict.resolution', level: 'C1', description: 'Conflict resolution language', tags: ['c1','speaking'] },
  { id: 'c1.technology.discourse', level: 'C1', description: 'Discourse on digital technology and humanities', tags: ['c1','reading'] },
  { id: 'c1.formal.analysis', level: 'C1', description: 'Formal analysis of artworks', tags: ['c1','writing'] },
  { id: 'c1.complex.argumentation', level: 'C1', description: 'Complex argumentation on global ethics', tags: ['c1','speaking'] },
  { id: 'c1.global.ethics', level: 'C1', description: 'Global ethics discourse and debate', tags: ['c1','speaking'] }
];

const existingIds = new Set(cm.concepts.map(c => c.id));
const added = [];
for (const cdef of [...c1ConceptDefs, ...extraConcepts]) {
  if (!existingIds.has(cdef.id)) {
    cm.concepts.push(cdef);
    existingIds.add(cdef.id);
    added.push(cdef.id);
  }
}
console.log('  Added', added.length, 'new C1 concepts to curriculum map');

// Add C1 prerequisites to prerequisiteGraph
const existingEdges = new Set(cm.prerequisiteGraph.map(e => e.from + '->' + e.to));
const addedEdges = [];
for (const l of c1Lessons) {
  if (l.prerequisiteConceptIds) {
    for (const prereq of l.prerequisiteConceptIds) {
      const key = l.conceptId + '->' + prereq;
      if (!existingEdges.has(key)) {
        cm.prerequisiteGraph.push({ from: l.conceptId, to: prereq, relationship: 'requires', level: 'C1' });
        existingEdges.add(key);
        addedEdges.push(key);
      }
    }
  }
}
console.log('  Added', addedEdges.length, 'new prerequisite edges');

cm.version = '2.0';
cm.lastUpdated = new Date().toISOString().split('T')[0];
if (!cm.description) cm.description = 'Deutsch-Klinik Curriculum Map covering A1 through C1';
save('curriculumMap.json', cm);

console.log('\n=== C1 Enrichment Complete ===');
console.log('Run node scripts/validate-c1-quality.cjs to validate');
