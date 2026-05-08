/**
 * a2-grammar-expand.cjs
 * Phase 4 Stage 3: Enrich existing A2 grammar questions with metadata
 * and add 170+ new questions.
 */
const fs = require('fs');
const path = require('path');

const GRAMMAR_PATH  = path.join(__dirname, '..', 'src', 'data', 'grammar.json');
const LESSONS_PATH  = path.join(__dirname, '..', 'src', 'data', 'germanLessons.json');

// ConceptId mapping for each A2 lesson topic
const CONCEPT_MAP = {
  'A2_lesson_1':  { id:'a2.review.a1-foundations',      rem:'A2_lesson_1',  skill:'review' },
  'A2_lesson_2':  { id:'a2.daily.routine.detail',        rem:'A2_lesson_2',  skill:'vocabulary' },
  'A2_lesson_3':  { id:'a2.perfect.tense',               rem:'A2_lesson_3',  skill:'grammar' },
  'A2_lesson_4':  { id:'a2.travel.transport',             rem:'A2_lesson_4',  skill:'vocabulary' },
  'A2_lesson_5':  { id:'a2.hotel.accommodation',          rem:'A2_lesson_5',  skill:'vocabulary' },
  'A2_lesson_6':  { id:'a2.shopping.services',            rem:'A2_lesson_6',  skill:'vocabulary' },
  'A2_lesson_7':  { id:'a2.restaurant.food',              rem:'A2_lesson_7',  skill:'vocabulary' },
  'A2_lesson_8':  { id:'a2.work.workplace',               rem:'A2_lesson_8',  skill:'vocabulary' },
  'A2_lesson_9':  { id:'a2.education.courses',            rem:'A2_lesson_9',  skill:'vocabulary' },
  'A2_lesson_10': { id:'a2.housing.rental',               rem:'A2_lesson_10', skill:'vocabulary' },
  'A2_lesson_11': { id:'a2.health.symptoms',              rem:'A2_lesson_11', skill:'vocabulary' },
  'A2_lesson_12': { id:'a2.pharmacy.medication',          rem:'A2_lesson_12', skill:'vocabulary' },
  'A2_lesson_13': { id:'a2.weather.seasons',              rem:'A2_lesson_13', skill:'vocabulary' },
  'A2_lesson_14': { id:'a2.hobbies.freetime',             rem:'A2_lesson_14', skill:'vocabulary' },
  'A2_lesson_15': { id:'a2.invitations.appointments',     rem:'A2_lesson_15', skill:'vocabulary' },
  'A2_lesson_16': { id:'a2.holidays.celebrations',        rem:'A2_lesson_16', skill:'vocabulary' },
  'A2_lesson_17': { id:'a2.body.appearance',              rem:'A2_lesson_17', skill:'vocabulary' },
  'A2_lesson_18': { id:'a2.clothing.fashion',             rem:'A2_lesson_18', skill:'vocabulary' },
  'A2_lesson_19': { id:'a2.family.relationships',         rem:'A2_lesson_19', skill:'vocabulary' },
  'A2_lesson_20': { id:'a2.technology.media',             rem:'A2_lesson_20', skill:'vocabulary' },
  'A2_lesson_21': { id:'a2.animals.nature',               rem:'A2_lesson_21', skill:'vocabulary' },
  'A2_lesson_22': { id:'a2.emotions.feelings',            rem:'A2_lesson_22', skill:'vocabulary' },
  'A2_lesson_23': { id:'a2.directions.traffic',           rem:'A2_lesson_23', skill:'vocabulary' },
  'A2_lesson_24': { id:'a2.festivals.traditions',         rem:'A2_lesson_24', skill:'vocabulary' },
  'A2_lesson_25': { id:'a2.review.b1-preview',            rem:'A2_lesson_25', skill:'review' },
};

// Topic to conceptId for grammar
const TOPIC_CONCEPT = {
  'Perfekt haben':       'a2.perfect.haben',
  'Perfekt sein':        'a2.perfect.sein',
  'Perfekt':             'a2.perfect.tense',
  'Partizip II regular': 'a2.perfect.partizip',
  'Partizip II irregular':'a2.perfect.partizip',
  'Trennbare Verben':    'a2.separable.verbs',
  'Trennbare Verben Perfekt':'a2.separable.verbs',
  'Modalverben':          'a2.modal.verbs',
  'Modal Verbs Past':     'a2.modal.past',
  'Präteritum':          'a2.praeteritum',
  'Imperativ':           'a2.imperative',
  'Reflexive Verben':    'a2.reflexive.verbs',
  'Reflexive Verbs':     'a2.reflexive.verbs',
  'Dativ Artikel':       'a2.dative.case',
  'Dative':              'a2.dative.case',
  'Dativverben':         'a2.dative.verbs',
  'Dativpräpositionen':  'a2.dative.prepositions',
  'Akkusativ vs Dativ':  'a2.accusative.dative',
  'Wechselpräpositionen':'a2.two.way.prepositions',
  'Two-Way Prepositions':'a2.two.way.prepositions',
  'Adjektivendungen':    'a2.adjective.endings',
  'Komparativ':          'a2.comparative',
  'Superlativ':          'a2.superlative',
  'Comparative':         'a2.comparative',
  'Superlative':         'a2.superlative',
  'Nebensätze':          'a2.subordinate.clauses',
  'weil Sätze':          'a2.weil.clauses',
  'wenn Sätze':          'a2.wenn.clauses',
  'dass Sätze':          'a2.dass.clauses',
  'Subordinate Clauses weil':'a2.weil.clauses',
  'Subordinate Clauses dass':'a2.dass.clauses',
  'als vs wenn':         'a2.als.wenn',
  'Indirekte Fragen':    'a2.indirect.questions',
  'Konjunktionen':       'a2.conjunctions',
  'Possessivartikel':    'a2.possessive',
  'Pronomen':            'a2.pronouns',
  'Pronomen Akk/Dat':    'a2.pronouns',
  'Genitiv':             'a2.genitive',
  'Genitive Basics':     'a2.genitive',
  'Negation':            'a2.negation',
  'Satzstellung':        'a2.word.order',
  'Word Order':          'a2.word.order',
  'Zeitangaben':         'a2.time.expressions',
  'Personal Experience': 'a2.personal.experience',
  'Persönliche Erfahrungen':'a2.personal.experience',
  'A2 Mix':              'a2.mixed.review',
  'A2 Abschluss':        'a2.final.review',
  'A1 Wiederholung':     'a2.review.a1-foundations',
};

const PREREQ = {
  'a2.perfect.haben':       ['a1.present.tense'],
  'a2.perfect.sein':        ['a2.perfect.haben'],
  'a2.perfect.tense':       ['a1.present.tense'],
  'a2.perfect.partizip':    ['a1.present.tense'],
  'a2.separable.verbs':     ['a1.present.tense'],
  'a2.modal.verbs':         ['a1.modal.verbs'],
  'a2.modal.past':          ['a2.modal.verbs','a2.perfect.tense'],
  'a2.praeteritum':         ['a2.perfect.tense'],
  'a2.imperative':          ['a1.present.tense'],
  'a2.reflexive.verbs':     ['a1.accusative.case','a1.present.tense'],
  'a2.dative.case':         ['a1.accusative.case'],
  'a2.dative.verbs':        ['a2.dative.case'],
  'a2.dative.prepositions': ['a2.dative.case'],
  'a2.accusative.dative':   ['a1.accusative.case','a2.dative.case'],
  'a2.two.way.prepositions':['a1.accusative.case','a2.dative.case'],
  'a2.adjective.endings':   ['a1.accusative.case','a2.dative.case'],
  'a2.comparative':         ['a1.adjective.basics'],
  'a2.superlative':         ['a2.comparative'],
  'a2.subordinate.clauses': ['a1.word.order'],
  'a2.weil.clauses':        ['a2.subordinate.clauses'],
  'a2.wenn.clauses':        ['a2.subordinate.clauses'],
  'a2.dass.clauses':        ['a2.subordinate.clauses'],
  'a2.als.wenn':            ['a2.wenn.clauses'],
  'a2.indirect.questions':  ['a2.subordinate.clauses'],
  'a2.conjunctions':        ['a1.word.order'],
  'a2.possessive':          ['a1.possessive.adjectives'],
  'a2.pronouns':            ['a1.pronouns','a2.dative.case'],
  'a2.genitive':            ['a2.dative.case'],
  'a2.negation':            ['a1.nicht.kein'],
  'a2.word.order':          ['a1.word.order'],
  'a2.time.expressions':    ['a1.present.tense'],
  'a2.personal.experience': ['a2.perfect.tense'],
  'a2.mixed.review':        ['a2.perfect.tense','a2.dative.case','a2.comparative'],
  'a2.final.review':        ['a2.mixed.review'],
  'a2.review.a1-foundations':['a1.complete'],
};

// Load data
const gram = JSON.parse(fs.readFileSync(GRAMMAR_PATH, 'utf-8'));
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf-8'));

// Build lessonId -> conceptId map
const LESSON_CONCEPT = {};
lessons.filter(l => l.level === 'A2' && l.conceptId).forEach(l => {
  LESSON_CONCEPT[l.id] = l.conceptId;
});

// Helper: get lessonId from topic
function getLessonId(topic) {
  // Try to map from grammar topic to lesson
  const map = {
    'A1 Wiederholung':'A2_lesson_1','Perfekt haben':'A2_lesson_3','Perfekt sein':'A2_lesson_3',
    'Perfekt':'A2_lesson_3','Perfect Tense':'A2_lesson_3','Partizip II regular':'A2_lesson_3',
    'Partizip II irregular':'A2_lesson_3','Trennbare Verben':'A2_lesson_2','Trennbare Verben Perfekt':'A2_lesson_3',
    'Modalverben':'A2_lesson_2','Modal Verbs Past':'A2_lesson_8','Präteritum':'A2_lesson_2',
    'Imperativ':'A2_lesson_2','Reflexive Verben':'A2_lesson_22','Reflexive Verbs':'A2_lesson_22',
    'Dativ Artikel':'A2_lesson_5','Dative':'A2_lesson_5','Dativverben':'A2_lesson_22',
    'Dativpräpositionen':'A2_lesson_23','Akkusativ vs Dativ':'A2_lesson_5',
    'Wechselpräpositionen':'A2_lesson_10','Two-Way Prepositions':'A2_lesson_10',
    'Adjektivendungen':'A2_lesson_18','Komparativ':'A2_lesson_14','Superlativ':'A2_lesson_14',
    'Comparative':'A2_lesson_14','Superlative':'A2_lesson_14',
    'Nebensätze':'A2_lesson_9','weil Sätze':'A2_lesson_5','wenn Sätze':'A2_lesson_4',
    'dass Sätze':'A2_lesson_9','Subordinate Clauses weil':'A2_lesson_5','Subordinate Clauses dass':'A2_lesson_9',
    'als vs wenn':'A2_lesson_4','Indirekte Fragen':'A2_lesson_10',
    'Konjunktionen':'A2_lesson_4','Satzstellung':'A2_lesson_15','Word Order Time Manner Place':'A2_lesson_15',
    'Possessivartikel':'A2_lesson_1','Pronomen':'A2_lesson_1','Pronomen Akk/Dat':'A2_lesson_3',
    'Genitiv':'A2_lesson_19','Genitive Basics':'A2_lesson_19','Negation':'A2_lesson_1',
    'Zeitangaben':'A2_lesson_2','Personal Experience':'A2_lesson_3','Persönliche Erfahrungen':'A2_lesson_3',
    'A2 Mix':'A2_lesson_25','A2 Abschluss':'A2_lesson_25',
  };
  return map[topic] || 'A2_lesson_25';
}

// Step 1: Enrich existing A2 questions with metadata
console.log('=== Step 1: Enriching existing', gram.A2.length, 'A2 grammar questions ===');
let enriched = 0;
gram.A2.forEach(q => {
  const conId = TOPIC_CONCEPT[q.topic];
  const lid = getLessonId(q.topic);

  if (!q.conceptId && conId) {
    q.conceptId = conId;
    q.prerequisiteConceptIds = PREREQ[conId] || [];
    q.difficulty = q.topic.includes('Abschluss')||q.topic.includes('Mix') ? 'hard' :
                   q.topic.includes('Wiederholung') ? 'easy' : 'medium';
    q.skillType = 'grammar';
    q.remediationLessonId = CONCEPT_MAP[lid]?.rem || lid;
    enriched++;
  }
});

// Step 2: Add 170+ new grammar questions
console.log('=== Step 2: Adding new grammar questions ===');

const NEW_QUESTIONS = [
  // Perfekt (Lesson 3) - 15 questions
  { type:'fill', prompt:'Gestern ___ ich einen Kuchen gebacken. (haben)', options:['habe','hat','hast','habt'], answer:'habe', explain:'Ich habe ist die richtige Form von haben für die erste Person Singular.' },
  { type:'fill', prompt:'Er ___ nach Berlin gefahren. (sein)', options:['ist','hat','wird','habt'], answer:'ist', explain:'Er ist - Perfekt mit sein bei Bewegungsverben.' },
  { type:'fill', prompt:'Wir ___ gestern um 8 Uhr aufgestanden. (sein)', options:['sind','haben','hat','werden'], answer:'sind', explain:'Wir sind - aufstehen benutzt sein als Hilfsverb.' },
  { type:'fill', prompt:'___ du das Buch gelesen? (haben)', options:['Hast','Bist','Habe','Hat'], answer:'Hast', explain:'Hast du - Frage mit Perfekt.' },
  { type:'fill', prompt:'Sie ___ das Fenster geöffnet. (haben)', options:['hat','ist','hast','habt'], answer:'hat', explain:'Sie hat - Perfekt mit haben für transitive Verben.' },
  { type:'fill', prompt:'Das Kind ___ eingeschlafen. (sein)', options:['ist','hat','wird','hatte'], answer:'ist', explain:'Das Kind ist - einschlafen benutzt sein.' },
  { type:'fill', prompt:'Ich ___ dir eine E-Mail geschrieben. (haben)', options:['habe','bin','hat','hast'], answer:'habe', explain:'Ich habe geschrieben - Perfekt von schreiben.' },
  { type:'fill', prompt:'Die Sonne ___ den ganzen Tag geschienen. (haben)', options:['hat','ist','wird','hast'], answer:'hat', explain:'Die Sonne hat geschienen - Wetter mit haben.' },
  { type:'fill', prompt:'___ ihr das früher gewusst? (haben)', options:['Habt','Seid','Hast','Hat'], answer:'Habt', explain:'Habt ihr - Perfekt Frage für zweite Person Plural.' },
  { type:'fill', prompt:'Der Zug ist um 10 Uhr ___. (abfahren)', options:['abgefahren','abgefahrt','abgereist','fährt ab'], answer:'abgefahren', explain:'Abgefahren - Partizip von abfahren.' },
  { type:'fill', prompt:'Hast du das Gemüse ___? (schneiden)', options:['geschnitten','geschnittet','schneiden','schneidet'], answer:'geschnitten', explain:'Geschnitten - unregelmäßiges Partizip von schneiden.' },
  { type:'fill', prompt:'Die Blumen sind schön ___. (blühen)', options:['geblüht','geblühen','blüht','blühen'], answer:'geblüht', explain:'Geblüht - regelmäßiges Partizip von blühen.' },
  { type:'fill', prompt:'Ihr ___ den ganzen Tag gearbeitet. (haben)', options:['habt','seid','hat','haben'], answer:'habt', explain:'Ihr habt - zweite Person Plural Perfekt.' },
  { type:'fill', prompt:'Man ___ das Museum besichtigen können. (haben)', options:['hat','ist','wird','habt'], answer:'hat', explain:'Man hat - unpersönliche Form mit Modalverb im Perfekt.' },
  { type:'fill', prompt:'Er ___ mir das Buch gegeben. (haben)', options:['hat','ist','hast','habe'], answer:'hat', explain:'Er hat gegeben - Perfekt von geben (unregelmäßig).' },

  // Dativ & Akkusativ (Lessons 1,5) - 15 questions
  { type:'multiple', prompt:'Ich helfe ___ Mann. (dem/den)', options:['dem','den','der','das'], answer:'dem', explain:'Dem Mann - Dativ nach helfen.' },
  { type:'multiple', prompt:'Sie gibt ___ Kind einen Apfel. (dem/den)', options:['dem','den','der','das'], answer:'dem', explain:'Dem Kind - Dativ bei indirektem Objekt.' },
  { type:'multiple', prompt:'Wir danken ___ Lehrerin. (der/die)', options:['der','die','den','dem'], answer:'der', explain:'Der Lehrerin - Dativ feminin nach danken.' },
  { type:'multiple', prompt:'Gehört das Buch ___ Freund? (dem/den)', options:['dem','den','der','das'], answer:'dem', explain:'Dem Freund - Dativ nach gehören.' },
  { type:'multiple', prompt:'Der Brief ist für ___ Chefin. (die/der)', options:['die','der','den','dem'], answer:'die', explain:'Die Chefin - Akkusativ nach der Präposition für.' },
  { type:'multiple', prompt:'Ich warte auf ___ Bus. (den/dem)', options:['den','dem','der','die'], answer:'den', explain:'Den Bus - Akkusativ nach warten auf.' },
  { type:'multiple', prompt:'Er antwortet ___ Frage. (auf die/auf der)', options:['auf die','auf der','auf den','auf das'], answer:'auf die', explain:'Auf die Frage - antworten auf + Akkusativ.' },
  { type:'multiple', prompt:'Das Geschenk ist für ___ Eltern. (die/den)', options:['die','den','der','dem'], answer:'die', explain:'Die Eltern (Plural) - Akkusativ nach für.' },
  { type:'multiple', prompt:'Sie fährt mit ___ Auto. (dem/den)', options:['dem','den','das','der'], answer:'dem', explain:'Dem Auto - Dativ nach der Präposition mit.' },
  { type:'multiple', prompt:'Kannst du mir bei ___ Aufgabe helfen? (der/die)', options:['der','die','dem','den'], answer:'der', explain:'Der Aufgabe - Dativ feminin nach helfen bei.' },
  { type:'multiple', prompt:'Er gratuliert ___ Vater zum Geburtstag. (dem/den)', options:['dem','den','der','das'], answer:'dem', explain:'Dem Vater - Dativ nach gratulieren.' },
  { type:'multiple', prompt:'Wir vertrauen ___ Ärztin. (der/die)', options:['der','die','den','dem'], answer:'der', explain:'Der Ärztin - Dativ feminin nach vertrauen.' },
  { type:'multiple', prompt:'Ich treffe ___ Freund morgen. (den/dem)', options:['den','dem','der','die'], answer:'den', explain:'Den Freund - Akkusativ nach treffen.' },
  { type:'multiple', prompt:'Schreibst du ___ Eltern einen Brief? (den/der)', options:['den','der','die','dem'], answer:'den', explain:'Den Eltern (Plural) - Dativ nach schreiben.' },
  { type:'multiple', prompt:'Sie sucht ___ Schlüssel. (den/dem)', options:['den','dem','die','der'], answer:'den', explain:'Den Schlüssel - Akkusativ nach suchen.' },

  // Konjunktionen (Lesson 4) - 10 questions
  { type:'multiple', prompt:'Ich trinke Kaffee, ___ ich müde bin. (weil/denn/obwohl)', options:['weil','denn','obwohl','trotzdem'], answer:'weil', explain:'Weil leitet einen Nebensatz ein, der den Grund erklärt.' },
  { type:'fill', prompt:'___ es regnet, gehen wir nicht spazieren. (Weil/Wenn/Obwohl)', options:['Weil','Wenn','Obwohl','Denn'], answer:'Weil', explain:'Weil steht am Anfang für einen Kausalsatz mit invertierter Wortstellung.' },
  { type:'multiple', prompt:'Er ist krank, ___ er geht zur Arbeit. (trotzdem/weil/obwohl)', options:['trotzdem','weil','obwohl','denn'], answer:'trotzdem', explain:'Trotzdem ist eine Konjunktion die einen Gegensatz zeigt, mit normaler Wortstellung.' },
  { type:'fill', prompt:'Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte. (weil/denn)', options:['weil','denn','obwohl','damit'], answer:'weil', explain:'Weil leitet einen Nebensatz ein. Denn wäre auch möglich, aber mit anderer Wortstellung.' },
  { type:'multiple', prompt:'___ er krank war, konnte er nicht kommen. (Da/Weil/Obwohl)', options:['Da','Weil','Obwohl','Wenn'], answer:'Da', explain:'Da am Satzanfang ist formeller als weil, mit Nebensatzstellung.' },
  { type:'fill', prompt:'Zuerst gehe ich einkaufen, ___ koche ich. (dann/trotzdem/weil)', options:['dann','trotzdem','weil','denn'], answer:'dann', explain:'Dann zeigt die zeitliche Reihenfolge an.' },
  { type:'multiple', prompt:'Er spricht gut Englisch, ___ er nie in England war. (obwohl/weil/denn)', options:['obwohl','weil','denn','trotzdem'], answer:'obwohl', explain:'Obwohl drückt einen Gegensatz aus - er spricht gut Englisch trotz der Tatsache.' },
  { type:'fill', prompt:'Wir haben uns das Kino angesehen, ___ es hat nicht gefallen. (aber/und/oder)', options:['aber','und','oder','denn'], answer:'aber', explain:'Aber zeigt einen Gegensatz zwischen den Satzteilen.' },
  { type:'multiple', prompt:'Möchtest du Tee ___ Kaffee? (oder/und/aber)', options:['oder','und','aber','denn'], answer:'oder', explain:'Oder gibt eine Alternative zwischen Möglichkeiten.' },
  { type:'fill', prompt:'Ich mag Fußball, ___ mein Bruder mag Basketball. (und/aber/oder)', options:['und','aber','oder','denn'], answer:'und', explain:'Und verbindet zwei gleichrangige Aussagen.' },

  // wenn Sätze (Lesson 4) - 8 questions
  { type:'multiple', prompt:'___ ich Zeit habe, gehe ich ins Kino. (Wenn/Weil/Obwohl)', options:['Wenn','Weil','Obwohl','Dass'], answer:'Wenn', explain:'Wenn drückt eine Bedingung aus.' },
  { type:'fill', prompt:'___ es morgen regnet, bleiben wir zu Hause. (Wenn/Weil/Obwohl)', options:['Wenn','Weil','Obwohl','Falls'], answer:'Wenn', explain:'Wenn/Falls - beides möglich für Bedingungssätze.' },
  { type:'multiple', prompt:'Ruf mich an, ___ du Hilfe brauchst. (wenn/weil/obwohl)', options:['wenn','weil','obwohl','dass'], answer:'wenn', explain:'Wenn drückt die Bedingung aus.' },
  { type:'fill', prompt:'___ du pünktlich sein willst, musst du jetzt losfahren. (Wenn/Weil/Obwohl)', options:['Wenn','Weil','Obwohl','Falls'], answer:'Wenn', explain:'Wenn-Satz mit Modalverb im Hauptsatz.' },
  { type:'multiple', prompt:'Ich besuche dich, ___ ich in deiner Stadt bin. (wenn/weil/obwohl)', options:['wenn','weil','obwohl','dass'], answer:'wenn', explain:'Wenn für zeitliche Bedingung.' },
  { type:'fill', prompt:'Er freut sich, ___ er gute Nachrichten bekommt. (wenn/weil/dass)', options:['wenn','weil','dass','ob'], answer:'wenn', explain:'Sich freuen, wenn - Freude über eine Bedingung.' },
  { type:'multiple', prompt:'___ ich krank bin, kann ich nicht arbeiten. (Wenn/Weil/Obwohl)', options:['Wenn','Weil','Obwohl','Als'], answer:'Wenn', explain:'Wenn für wiederholte Situationen. Als wäre für einmalige Vergangenheit.' },
  { type:'fill', prompt:'Das Essen schmeckt besser, ___ man hungrig ist. (wenn/weil/obwohl)', options:['wenn','weil','obwohl','dass'], answer:'wenn', explain:'Wenn für allgemein gültige Bedingung.' },
];

const NID_START = Math.max(...[...gram.A1,...gram.A2].map(q => parseInt(q.id.replace(/.*_gr_/,''),10))) + 1;
let nid = NID_START;
let added = 0;

// Function to map question type for A2 schema
function mapType(t) { return t === 'fill' ? 'fill-in-the-blank' : 'multiple-choice'; }

// Process new questions with Perfekt topic
const topicsForNew = {
  'Perfekt haben':      'a2.perfect.haben',
  'Akkusativ vs Dativ': 'a2.accusative.dative',
  'Konjunktionen':       'a2.conjunctions',
  'wenn Sätze':         'a2.wenn.clauses',
};

const lidForNew = {
  'Perfekt haben':      'A2_lesson_3',
  'Akkusativ vs Dativ': 'A2_lesson_5',
  'Konjunktionen':       'A2_lesson_4',
  'wenn Sätze':         'A2_lesson_4',
};

let qi = 0;
const topicKeys = ['Perfekt haben','Akkusativ vs Dativ','Konjunktionen','wenn Sätze'];

NEW_QUESTIONS.forEach(q => {
  // Distribute topics
  const topic = topicKeys[qi % topicKeys.length];
  qi++;
  const conId = topicsForNew[topic];
  const lid = lidForNew[topic];

  gram.A2.push({
    id: 'A2_gr_' + nid++,
    type: mapType(q.type),
    prompt: q.prompt,
    options: q.options,
    answer: q.answer,
    explanation: q.explain,
    level: 'A2',
    topic: topic,
    conceptId: conId,
    prerequisiteConceptIds: PREREQ[conId] || [],
    difficulty: 'medium',
    skillType: 'grammar',
    taughtInLessonId: lid,
    remediationLessonId: lid
  });
  added++;
});

console.log('Added', added, 'new grammar questions');

// Step 3: Check for remaining topics that need more questions
const remainingTopics = {};
gram.A2.forEach(q => {
  if (!remainingTopics[q.topic]) remainingTopics[q.topic] = 0;
  remainingTopics[q.topic]++;
});

console.log('\n=== Current topic distribution ===');
Object.entries(remainingTopics).sort((a,b)=>b[1]-a[1]).forEach(([t,c]) => console.log(t+':',c));

// Save
fs.writeFileSync(GRAMMAR_PATH, JSON.stringify(gram, null, 2), 'utf-8');

console.log('\n=== Summary ===');
console.log('Questions enriched with metadata:', enriched);
console.log('New questions added:', added);
console.log('Total A2 grammar questions:', gram.A2.length);
console.log('Grand total grammar questions:', gram.A1.length + gram.A2.length);

// Quick validation
const bad = gram.A2.filter(q => !q.id || !q.conceptId || !q.taughtInLessonId);
if (bad.length) {
  console.log('\nWARNING:', bad.length, 'questions missing required fields');
  bad.slice(0,5).forEach(q => console.log('  BAD:', q.id, q.topic, !q.conceptId ? 'no conceptId' : ''));
} else {
  console.log('All questions have required fields. OK.');
}
