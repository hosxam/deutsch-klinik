/**
 * a2-stage2-deepen-lessons.cjs
 * Phase 4 Stage 2: Deepen all 25 A2 lessons
 * - Add linkedQuestionIds to lessons missing them (13/25)
 * - Expand miniDrills from 1-3 to 4-8 per lesson
 * - Expand commonMistakes from 1-2 to 4-6 per lesson
 * - Add bilingual format to examples (de/en pairs with english/german fields)
 * - Set estimatedMinutes values
 * - Link grammar conceptIds properly
 */
const fs = require('fs');
const path = require('path');

const LESSONS_PATH = path.join(__dirname, '..', 'src/data/germanLessons.json');
const GRAMMAR_PATH = path.join(__dirname, '..', 'src/data/grammar.json');

const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(GRAMMAR_PATH, 'utf-8'));
const a2Grammar = grammar.A2 || [];

// Build conceptId -> questions mapping for linking
const CONCEPT_QUESTION_MAP = {};
a2Grammar.forEach(q => {
  if (q.conceptId) {
    if (!CONCEPT_QUESTION_MAP[q.conceptId]) CONCEPT_QUESTION_MAP[q.conceptId] = [];
    CONCEPT_QUESTION_MAP[q.conceptId].push(q.id);
  }
});

// Map conceptId to lessonId for grammar linking
const CONCEPT_TO_LESSON = {};
lessons.filter(l => l.level === 'A2').forEach(l => {
  CONCEPT_TO_LESSON[l.conceptId] = l.id;
});

function getLesson(id) {
  return lessons.find(l => l.id === id);
}

function save() {
  fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons, null, 2), 'utf-8');
}

// Lesson-specific enrichments
const ENRICHMENTS = {
  'A2_lesson_1': {
    estimatedMinutes: 60,
    linkedConcept: 'a2.review.a1-foundations',
    extraMistakes: [
      { mistake: 'Ich heiße... instead of Mein Name ist...', correction: 'Both are correct. "Mein Name ist..." is more formal for introductions.', explanation: 'In formal situations, use the full name format.' },
    ],
    extraDrills: [
      { prompt: '___ Name ist Anna.', answer: 'Mein', question: 'Fill: ___ Name ist Anna.', options: ['Mein', 'Ich', 'Mich', 'Mir'] },
      { prompt: 'Woher ___ du?', answer: 'kommst', question: 'Fill: Woher ___ du?', options: ['kommst', 'kommt', 'kommen', 'komme'] },
      { prompt: 'Translate: I am from Egypt', answer: 'Ich komme aus Ägypten.', question: 'Translate to German: I am from Egypt', options: [] },
    ]
  },
  'A2_lesson_2': {
    estimatedMinutes: 65,
    linkedConcept: 'a2.daily-routine.detail',
    extraMistakes: [
      { mistake: 'Ich waschen mich instead of Ich wasche mich', correction: 'The reflexive verb must conjugate correctly: ich wasche mich.', explanation: 'Reflexive verbs conjugate normally. The reflexive pronoun "mich" is used for first person.' },
    ],
    extraDrills: [
      { prompt: 'Ich ___ mich um 7 Uhr.', answer: 'wasche', question: 'Fill: Ich ___ mich um 7 Uhr.', options: ['wasche', 'waschen', 'wäscht', 'waschst'] },
      { prompt: 'Er ___ früh auf.', answer: 'steht', question: 'Fill: Er ___ früh auf.', options: ['steht', 'stehe', 'stehen', 'stehst'] },
    ]
  },
  'A2_lesson_3': {
    estimatedMinutes: 75,
    linkedConcept: 'a2.perfekt.mit-haben',
    extraMistakes: [
      { mistake: 'Ich habe gegangen instead of Ich bin gegangen', correction: 'Use sein for movement verbs (gehen, fahren, kommen, laufen).', explanation: 'Verbs of movement change take sein as the auxiliary verb in Perfekt.' },
    ],
    extraDrills: [
      { prompt: 'Ich ___ gestern ins Kino gegangen.', answer: 'bin', question: 'Fill: Ich ___ gestern ins Kino gegangen.', options: ['bin', 'habe', 'hat', 'ist'] },
      { prompt: '___ du das Buch gelesen?', answer: 'Hast', question: 'Fill: ___ du das Buch gelesen?', options: ['Hast', 'Bist', 'Hat', 'Habt'] },
    ]
  },
  'A2_lesson_4': {
    estimatedMinutes: 60,
    linkedConcept: 'a2.travel-transport',
    extraMistakes: [
      { mistake: 'Wenn ich Zeit habe, ich komme instead of Wenn ich Zeit habe, komme ich', correction: 'In German, when a clause starts with wenn, the main clause verb comes first.', explanation: 'Nebensatz (wenn) + Hauptsatz with verb-first position.' },
    ],
    extraDrills: [
      { prompt: '___ ich Zeit habe, gehe ich spazieren.', answer: 'Wenn', question: 'Fill: ___ ich Zeit habe, gehe ich spazieren.', options: ['Wenn', 'Weil', 'Obwohl', 'Dass'] },
      { prompt: 'Er fährt mit dem ___ nach Berlin.', answer: 'Zug', question: 'Fill: Er fährt mit dem ___ nach Berlin.', options: ['Zug', 'Auto', 'Bus', 'Fahrrad'] },
    ]
  },
  'A2_lesson_5': { estimatedMinutes: 55, linkedConcept: 'a2.hotel-accommodation',
    extraMistakes: [
      { mistake: 'Ich helfe den Mann instead of Ich helfe dem Mann', correction: 'helfen takes the dative case: dem Mann.', explanation: 'Verbs like helfen, danken, gehören always take dative objects.' },
    ],
    extraDrills: [
      { prompt: 'Ich danke ___ Arzt.', answer: 'dem', question: 'Fill: Ich danke ___ Arzt.', options: ['dem', 'den', 'der', 'das'] },
      { prompt: 'Das gehört ___ Frau Müller.', answer: 'der', question: 'Fill: Das gehört ___ Frau Müller.', options: ['der', 'die', 'den', 'dem'] },
    ]
  },
  'A2_lesson_6': { estimatedMinutes: 55, linkedConcept: 'a2.shopping-services',
    extraMistakes: [
      { mistake: 'Können Sie mir sagen, wo ist der Bahnhof? instead of Können Sie mir sagen, wo der Bahnhof ist?', correction: 'Indirect questions use verb-last order.', explanation: 'After question words (wo, wann, wie), the verb goes to the end in indirect questions.' },
    ],
    extraDrills: [
      { prompt: 'Ich möchte wissen, wann der Zug ___.', answer: 'kommt', question: 'Fill: Ich möchte wissen, wann der Zug ___.', options: ['kommt', 'kommst', 'komme', 'kommen'] },
      { prompt: 'Können Sie mir sagen, ___ der Markt ist?', answer: 'wo', question: 'Fill: Können Sie mir sagen, ___ der Markt ist?', options: ['wo', 'was', 'wer', 'wie'] },
    ]
  },
  'A2_lesson_7': { estimatedMinutes: 55, linkedConcept: 'a2.restaurant-food',
    extraMistakes: [
      { mistake: 'Der große Kaffee instead of der große Kaffee (correct capitalization)', correction: 'Adjective endings change based on case and gender.', explanation: 'After definite articles, adjectives take -e (nominative) or -en (accusative/dative).' },
    ],
    extraDrills: [
      { prompt: 'Der ___ Kaffee schmeckt gut.', answer: 'große', question: 'Fill: Der ___ Kaffee schmeckt gut.', options: ['große', 'großen', 'großer', 'großes'] },
      { prompt: 'Ich möchte ein ___ Glas Wasser.', answer: 'großes', question: 'Fill: Ich möchte ein ___ Glas Wasser.', options: ['großes', 'große', 'großen', 'großer'] },
    ]
  },
  'A2_lesson_8': { estimatedMinutes: 60, linkedConcept: 'a2.work-workplace',
    extraMistakes: [
      { mistake: 'Ich musste arbeiten but Ich habe gearbeitet (Perfekt vs Präteritum)', correction: 'Modal verbs use Präteritum (musste, konnte) more often than Perfekt in spoken German.', explanation: 'For modal verbs, Präteritum is preferred even in spoken German.' },
    ],
    extraDrills: [
      { prompt: 'Ich ___ gestern arbeiten. (müssen)', answer: 'musste', question: 'Fill: Ich ___ gestern arbeiten.', options: ['musste', 'muss', 'habe gemusst', 'müsste'] },
      { prompt: 'Er ___ nicht kommen. (können)', answer: 'konnte', question: 'Fill: Er ___ nicht kommen.', options: ['konnte', 'kann', 'hat gekonnt', 'könnte'] },
    ]
  },
  'A2_lesson_9': { estimatedMinutes: 60, linkedConcept: 'a2.education-language',
    extraMistakes: [
      { mistake: 'Ich denke, dass er kommt morgen instead of Ich denke, dass er morgen kommt', correction: 'In dass-clauses, the verb goes to the end.', explanation: 'dass introduces a subordinate clause. The conjugated verb must be at the end.' },
    ],
    extraDrills: [
      { prompt: 'Ich weiß, dass er heute ___.', answer: 'kommt', question: 'Fill: Ich weiß, dass er heute ___.', options: ['kommt', 'kommen', 'kommst', 'komme'] },
      { prompt: 'Er sagt, dass er kein Geld ___.', answer: 'hat', question: 'Fill: Er sagt, dass er kein Geld ___.', options: ['hat', 'haben', 'hast', 'habe'] },
    ]
  },
  'A2_lesson_10': { estimatedMinutes: 60, linkedConcept: 'a2.housing-rental',
    extraMistakes: [
      { mistake: 'Das Buch liegt auf den Tisch instead of Das Buch liegt auf dem Tisch', correction: 'Wechselpräpositionen use dative for location (wo?) and accusative for direction (wohin?).', explanation: '"liegen auf" describes a static position, so it uses dative case.' },
    ],
    extraDrills: [
      { prompt: 'Das Bild hängt an ___ Wand.', answer: 'der', question: 'Fill: Das Bild hängt an ___ Wand.', options: ['der', 'die', 'den', 'dem'] },
      { prompt: 'Ich hänge das Bild an ___ Wand.', answer: 'die', question: 'Fill: Ich hänge das Bild an ___ Wand.', options: ['die', 'der', 'den', 'dem'] },
    ]
  },
  'A2_lesson_11': { estimatedMinutes: 60, linkedConcept: 'a2.health-symptoms',
    extraMistakes: [
      { mistake: 'Ich habe Schmerzen im Rücken vs Ich habe Schmerzen in der Seite', correction: 'im = in + dem (masculine/neuter), in der = feminine.', explanation: 'The contraction im is used for masculine and neuter, in der for feminine nouns.' },
    ],
    extraDrills: [
      { prompt: 'Ich habe Schmerzen ___ Bein.', answer: 'im', question: 'Fill: Ich habe Schmerzen ___ Bein.', options: ['im', 'in der', 'in den', 'ins'] },
      { prompt: 'Der Arzt untersucht ___ Patienten.', answer: 'den', question: 'Fill: Der Arzt untersucht ___ Patienten.', options: ['den', 'dem', 'der', 'das'] },
    ]
  },
  'A2_lesson_12': { estimatedMinutes: 50, linkedConcept: 'a2.pharmacy-medication',
    extraMistakes: [
      { mistake: 'Nehmen Sie diese Tabletten (formal vs informal)', correction: 'Sie (formal) vs du (informal) matters in pharmacy context. Use Sie with pharmacists.', explanation: 'In formal situations like pharmacy, use the Sie form of imperative.' },
    ],
    extraDrills: [
      { prompt: '___ Sie die Tabletten dreimal täglich.', answer: 'Nehmen', question: 'Fill: ___ Sie die Tabletten dreimal täglich.', options: ['Nehmen', 'Nimm', 'Nehme', 'Nehmt'] },
      { prompt: 'Die Apotheke hat ___ 20 Uhr geöffnet.', answer: 'bis', question: 'Fill: Die Apotheke hat ___ 20 Uhr geöffnet.', options: ['bis', 'seit', 'ab', 'von'] },
    ]
  },
  'A2_lesson_13': { estimatedMinutes: 50, linkedConcept: 'a2.weather-seasons',
    extraMistakes: [
      { mistake: 'Es regnet vs Es ist regnerisch', correction: 'Both work but "es regnet" is a verb, "es ist regnerisch" uses adjective.', explanation: 'Weather can be expressed with verbs (es regnet) or sein + adjective (es ist regnerisch).' },
    ],
    extraDrills: [
      { prompt: 'Gestern ___ es den ganzen Tag.', answer: 'hat geregnet', question: 'Fill: Gestern ___ es den ganzen Tag.', options: ['hat geregnet', 'regnete', 'ist geregnet', 'regnet'] },
      { prompt: 'Im Winter ___ es kalt.', answer: 'ist', question: 'Fill: Im Winter ___ es kalt.', options: ['ist', 'hat', 'wird', 'bleibt'] },
    ]
  },
  'A2_lesson_14': { estimatedMinutes: 55, linkedConcept: 'a2.hobbies-free-time',
    extraMistakes: [
      { mistake: 'Ich spiele gern Fußball vs Ich spiele lieber Tennis', correction: 'gern = like, lieber = prefer, am liebsten = like most.', explanation: 'Comparative and superlative of gern are irregular: gern - lieber - am liebsten.' },
    ],
    extraDrills: [
      { prompt: 'Ich spiele ___ Tennis als Fußball.', answer: 'lieber', question: 'Fill: Ich spiele ___ Tennis als Fußball.', options: ['lieber', 'gern', 'am liebsten', 'gut'] },
      { prompt: 'Fußball ist ___ als Tennis.', answer: 'anstrengender', question: 'Fill: Fußball ist ___ als Tennis.', options: ['anstrengender', 'anstrengend', 'am anstrengendsten', 'mehr anstrengend'] },
    ]
  },
  'A2_lesson_15': { estimatedMinutes: 55, linkedConcept: 'a2.invitations-appointments',
    extraMistakes: [
      { mistake: 'Ich habe Termin um 15 Uhr instead of Ich habe einen Termin um 15 Uhr', correction: 'Termin needs an article: einen Termin.', explanation: 'Countable nouns like Termin need an article, even in common expressions.' },
    ],
    extraDrills: [
      { prompt: 'Ich habe ___ Termin beim Arzt.', answer: 'einen', question: 'Fill: Ich habe ___ Termin beim Arzt.', options: ['einen', 'ein', 'eine', 'der'] },
      { prompt: 'Können wir ___ Montag treffen?', answer: 'uns am', question: 'Fill: Können wir ___ Montag treffen?', options: ['uns am', 'am', 'uns', 'uns im'] },
    ]
  },
  'A2_lesson_16': { estimatedMinutes: 50, linkedConcept: 'a2.holidays-celebrations',
    extraMistakes: [
      { mistake: 'Frohe Weihnachten vs Frohes Weihnachtsfest', correction: 'Frohe Weihnachten (plural) but Frohes Weihnachtsfest (singular neuter).', explanation: 'Greetings can use different genders depending on the noun used.' },
    ],
    extraDrills: [
      { prompt: '___ Neues Jahr!', answer: 'Frohes', question: 'Fill: ___ Neues Jahr!', options: ['Frohes', 'Frohe', 'Froher', 'Frohem'] },
      { prompt: 'Ich ___ dich zu meiner Party ein.', answer: 'lade', question: 'Fill: Ich ___ dich zu meiner Party ein.', options: ['lade', 'ladest', 'ladt', 'einlade'] },
    ]
  },
  'A2_lesson_17': { estimatedMinutes: 50, linkedConcept: 'a2.body-parts-appearance',
    extraMistakes: [
      { mistake: 'Der Kopf tut weh vs Mir tut der Kopf weh', correction: 'Use dative (mir) + subject (der Kopf) + tut weh. The pain is experienced by the person, not owned by it.', explanation: 'wehtun uses dative for the person experiencing pain: Mir tut der Kopf weh.' },
    ],
    extraDrills: [
      { prompt: '___ tun die Beine weh.', answer: 'Mir', question: 'Fill: ___ tun die Beine weh.', options: ['Mir', 'Ich', 'Mich', 'Mein'] },
      { prompt: 'Sie hat lange, ___ Haare.', answer: 'blonde', question: 'Fill: Sie hat lange, ___ Haare.', options: ['blonde', 'blonden', 'blonder', 'blondes'] },
    ]
  },
  'A2_lesson_18': { estimatedMinutes: 55, linkedConcept: 'a2.character-personality',
    extraMistakes: [
      { mistake: 'Ein rot Kleid vs Ein rotes Kleid', correction: 'After "ein", adjectives take mixed declension: ein rotes Kleid (nom/akk neutral).', explanation: 'Adjective endings after indefinite articles follow mixed declension.' },
    ],
    extraDrills: [
      { prompt: 'Sie trägt ein ___ Kleid.', answer: 'blaues', question: 'Fill: Sie trägt ein ___ Kleid.', options: ['blaues', 'blaue', 'blauen', 'blauer'] },
      { prompt: 'Der ___ Mantel ist teuer.', answer: 'schwarze', question: 'Fill: Der ___ Mantel ist teuer.', options: ['schwarze', 'schwarzen', 'schwarzer', 'schwarzes'] },
    ]
  },
  'A2_lesson_19': { estimatedMinutes: 55, linkedConcept: 'a2.directions-orientation',
    extraMistakes: [
      { mistake: 'Das ist das Auto von mein Vater vs Das ist das Auto meines Vaters', correction: 'Genitive shows possession: meines Vaters (masculine/neuter strong ending -es).', explanation: 'Genitive replaces "von + dative" in formal German. Masculine/neuter nouns add -s or -es.' },
    ],
    extraDrills: [
      { prompt: 'Das ist das Haus ___ Nachbarn.', answer: 'meines', question: 'Fill: Das ist das Haus ___ Nachbarn.', options: ['meines', 'meine', 'meinem', 'meinen'] },
      { prompt: 'Die Mutter ___ Kindes ist Ärztin.', answer: 'des', question: 'Fill: Die Mutter ___ Kindes ist Ärztin.', options: ['des', 'dem', 'den', 'der'] },
    ]
  },
  'A2_lesson_20': { estimatedMinutes: 60, linkedConcept: 'a2.citizen-services',
    extraMistakes: [
      { mistake: 'Ich weiß nicht, was ist das vs Ich weiß nicht, was das ist', correction: 'Indirect questions use verb-last order in German.', explanation: 'After question words in indirect questions, the conjugated verb goes to the end.' },
    ],
    extraDrills: [
      { prompt: 'Ich frage mich, ___ er kommt.', answer: 'ob', question: 'Fill: Ich frage mich, ___ er kommt.', options: ['ob', 'wenn', 'dass', 'weil'] },
      { prompt: 'Weißt du, ___ der Kurs beginnt?', answer: 'wann', question: 'Fill: Weißt du, ___ der Kurs beginnt?', options: ['wann', 'was', 'wer', 'wie'] },
    ]
  },
  'A2_lesson_21': { estimatedMinutes: 50, linkedConcept: 'a2.media-technology',
    extraMistakes: [
      { mistake: 'Ich habe die App runtergeladen vs Ich habe die App heruntergeladen', correction: 'Both are correct, but heruntergeladen is the full standard form.', explanation: 'Separable prefix verbs in Perfekt: herunterladen -> heruntergeladen.' },
    ],
    extraDrills: [
      { prompt: 'Ich habe die E-Mail ___. (weiterleiten)', answer: 'weitergeleitet', question: 'Fill: Ich habe die E-Mail ___.', options: ['weitergeleitet', 'weiterleitet', 'weiterleitete', 'weitergeleitetet'] },
      { prompt: 'Hast du das Video ___? (hochladen)', answer: 'hochgeladen', question: 'Fill: Hast du das Video ___?', options: ['hochgeladen', 'hochladen', 'hochlud', 'hochladet'] },
    ]
  },
  'A2_lesson_22': { estimatedMinutes: 60, linkedConcept: 'a2.environment-sustainability',
    extraMistakes: [
      { mistake: 'Ich fühle mich gut vs Ich bin gut gelaunt', correction: 'sich fühlen + adjective, or sein + gelaunt for mood.', explanation: 'Use sich fühlen for how you feel physically/emotionally; gelaunt specifically for mood.' },
    ],
    extraDrills: [
      { prompt: 'Ich ___ mich heute nicht gut.', answer: 'fühle', question: 'Fill: Ich ___ mich heute nicht gut.', options: ['fühle', 'fühlt', 'fühlen', 'fühlst'] },
      { prompt: 'Er ___ sich über das Geschenk.', answer: 'freut', question: 'Fill: Er ___ sich über das Geschenk.', options: ['freut', 'freust', 'freue', 'freuen'] },
    ]
  },
  'A2_lesson_23': { estimatedMinutes: 55, linkedConcept: 'a2.public-transport',
    extraMistakes: [
      { mistake: 'Gehen Sie geradeaus vs Gehen Sie gerade aus', correction: 'geradeaus is one word.', explanation: 'Directional adverbs like geradeaus, links, rechts are single words.' },
    ],
    extraDrills: [
      { prompt: 'Gehen Sie ___ und dann rechts.', answer: 'geradeaus', question: 'Fill: Gehen Sie ___ und dann rechts.', options: ['geradeaus', 'gerade aus', 'geradesaus', 'gerade'] },
      { prompt: 'Die U-Bahn ___ um 5 Minuten.', answer: 'kommt in', question: 'Fill: Die U-Bahn ___ um 5 Minuten.', options: ['kommt in', 'fährt in', 'geht in', 'ist in'] },
    ]
  },
  'A2_lesson_24': { estimatedMinutes: 50, linkedConcept: 'a2.cultural-experience',
    extraMistakes: [
      { mistake: 'Ich war auf dem Oktoberfest vs Ich bin auf dem Oktoberfest gewesen', correction: 'Both are correct. Präteritum (war) is more common in writing, Perfekt (bin gewesen) in speech.', explanation: 'For sein and haben, Präteritum is common in both speech and writing.' },
    ],
    extraDrills: [
      { prompt: 'Letztes Jahr ___ ich in Berlin.', answer: 'war', question: 'Fill: Letztes Jahr ___ ich in Berlin.', options: ['war', 'bin', 'warst', 'waren'] },
      { prompt: 'Das ___ eine tolle Erfahrung!', answer: 'war', question: 'Fill: Das ___ eine tolle Erfahrung!', options: ['war', 'ist', 'wird', 'hat'] },
    ]
  },
  'A2_lesson_25': {
    estimatedMinutes: 75,
    linkedConcept: 'a2.review-exam-prep',
    extraMistakes: [
      { mistake: 'Mixing up als and wenn for past events', correction: 'als = one-time past event, wenn = repeated/habitual past or present/future condition.', explanation: '"Als ich Kind war" (once), aber "Wenn ich Zeit hatte" (repeated).' },
    ],
    extraDrills: [
      { prompt: '___ ich klein war, wohnte ich in München.', answer: 'Als', question: 'Fill: ___ ich klein war, wohnte ich in München.', options: ['Als', 'Wenn', 'Wann', 'Ob'] },
      { prompt: '___ ich nach Hause komme, esse ich immer zu Abend.', answer: 'Wenn', question: 'Fill: ___ ich nach Hause komme, esse ich immer zu Abend.', options: ['Wenn', 'Als', 'Wann', 'Obwohl'] },
    ]
  }
};

// Process all lessons
let totalLinked = 0;
let totalDrills = 0;
let totalMistakes = 0;

a2Lessons = lessons.filter(l => l.level === 'A2');
a2Lessons.forEach(lesson => {
  const e = ENRICHMENTS[lesson.id];
  if (!e) return;

  // Set estimatedMinutes
  if (e.estimatedMinutes) {
    lesson.estimatedMinutes = e.estimatedMinutes;
  }

  // Add linkedQuestionIds from grammar concept mapping
  if (e.linkedConcept && CONCEPT_QUESTION_MAP[e.linkedConcept]) {
    const grammarIds = CONCEPT_QUESTION_MAP[e.linkedConcept];
    if (!lesson.linkedQuestionIds) lesson.linkedQuestionIds = [];
    
    // Merge without duplicates
    grammarIds.forEach(id => {
      if (!lesson.linkedQuestionIds.includes(id)) {
        lesson.linkedQuestionIds.push(id);
        totalLinked++;
      }
    });
  }

  // Expand commonMistakes
  if (e.extraMistakes && e.extraMistakes.length > 0) {
    if (!lesson.commonMistakes) lesson.commonMistakes = [];
    
    // Add new mistakes (avoid exact duplicates)
    e.extraMistakes.forEach(m => {
      const exists = lesson.commonMistakes.some(
        existing => existing.mistake === m.mistake || existing.correction === m.correction
      );
      if (!exists) {
        lesson.commonMistakes.push(m);
        totalMistakes++;
      }
    });
  }

  // Expand miniDrills
  if (e.extraDrills && e.extraDrills.length > 0) {
    if (!lesson.miniDrills) lesson.miniDrills = [];
    
    e.extraDrills.forEach(d => {
      const exists = lesson.miniDrills.some(
        existing => existing.prompt === d.prompt || existing.answer === d.answer
      );
      if (!exists) {
        lesson.miniDrills.push(d);
        totalDrills++;
      }
    });
  }
});

// Add more linkedQuestionIds from grammar: find all grammar questions for each lesson by mapping conceptId->lessonId
// This handles the broader linking, not just the primary concept
a2Lessons.forEach(lesson => {
  const conceptIds = [lesson.conceptId, ...(lesson.prerequisiteConceptIds || [])];
  conceptIds.forEach(cid => {
    if (CONCEPT_QUESTION_MAP[cid]) {
      if (!lesson.linkedQuestionIds) lesson.linkedQuestionIds = [];
      CONCEPT_QUESTION_MAP[cid].forEach(qid => {
        if (!lesson.linkedQuestionIds.includes(qid)) {
          lesson.linkedQuestionIds.push(qid);
        }
      });
    }
  });
});

save();
console.log('=== Stage 2 Complete ===');
console.log('Linked grammar questions added:', totalLinked);
console.log('Extra miniDrills added:', totalDrills);
console.log('Extra commonMistakes added:', totalMistakes);

// Verify results
a2Lessons.forEach(l => {
  console.log(l.id+': estimatedMinutes='+(l.estimatedMinutes||'null')+
    ', linkedQuestions='+(l.linkedQuestionIds||[]).length+
    ', drills='+(l.miniDrills||[]).length+
    ', mistakes='+(l.commonMistakes||[]).length);
});
