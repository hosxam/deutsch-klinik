/**
 * a2-stage3-grammar-expand.cjs
 * Phase 4 Stage 3: Add ~120+ new A2 grammar questions
 * Focus on weak topics: Adjektivendungen, Präteritum, Reflexive Verben,
 * Genitiv, Wechselpräpositionen, Indirekte Fragen, Trennbare Verben Perfekt,
 * Possessivartikel, Imperativ, Negation, Zeitangaben, als vs wenn
 */
const fs = require('fs');
const path = require('path');

const GRAM_PATH = path.join(__dirname, '..', 'src/data/grammar.json');
const data = JSON.parse(fs.readFileSync(GRAM_PATH, 'utf-8'));

// Find next available ID
const all = [...data.A1, ...data.A2, ...(data.B1||[]), ...(data.B2||[]), ...(data.C1||[])];
let NID = Math.max(...all.map(q => parseInt(q.id.replace(/.*_gr_/, ''), 10))) + 1;

const newQuestions = [];

function add(topic, type, prompt, options, answer, explanation, difficulty, conceptId, lid) {
  const typeMap = { fill:'fill-in-the-blank', mc:'multiple-choice', order:'sentence-order', correction:'correction' };
  newQuestions.push({
    id: 'A2_gr_' + (NID++),
    type: typeMap[type] || 'multiple-choice',
    prompt,
    options: options || [],
    answer,
    explanation,
    level: 'A2',
    topic,
    conceptId: conceptId || 'a2.' + topic.toLowerCase().replace(/[^a-z]/g,'.'),
    prerequisiteConceptIds: [],
    difficulty: difficulty || 'medium',
    skillType: 'grammar',
    taughtInLessonId: lid || 'A2_lesson_25',
    remediationLessonId: lid || 'A2_lesson_25'
  });
}

// Adjektivendungen (needs +8): Lesson 18
add('Adjektivendungen','fill','Der ___ Hund (groß) bellt laut.', ['große','großen','großer','großes'], 0,
    'After der/die/das (definite article), adjective takes -e in nominative singular: der große Hund.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Die ___ Blume (rot) blüht im Garten.', ['rote','roten','roter','rotes'], 0,
    'Die rote Blume - feminine nominative with definite article takes -e.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Das ___ Kind (klein) spielt draußen.', ['kleine','kleinen','kleiner','kleines'], 0,
    'Das kleine Kind - neuter nominative with definite article takes -e.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Ich sehe den ___ Mann (alt).', ['alten','alte','alter','altes'], 0,
    'After den (masculine accusative): den alten Mann - adjective takes -en.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Er gibt der ___ Frau (jung) ein Geschenk.', ['jungen','junge','junger','junges'], 0,
    'After der (feminine dative): der jungen Frau - adjective takes -en.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Ein ___ Tag (schön) beginnt.', ['schöner','schöne','schönen','schönes'], 0,
    'After ein (masculine nominative): ein schöner Tag - mixed declension: -er.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Ich möchte ein ___ Auto (neu).', ['neues','neue','neuen','neuer'], 0,
    'After ein (neuter nominative/accusative): ein neues Auto - mixed declension: -es.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Sie trägt eine ___ Jacke (blau).', ['blaue','blauen','blauer','blaues'], 0,
    'After eine (feminine nominative/accusative): eine blaue Jacke - mixed: -e.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Wir wohnen in einem ___ Haus (groß).', ['großen','große','großer','großes'], 0,
    'After einem (neuter dative): in einem großen Haus - adjective takes -en.','medium','a2.adjective.endings','A2_lesson_18');
add('Adjektivendungen','fill','Mit ___ Freunden (gut) gehe ich ins Kino.', ['guten','gute','guter','gutes'], 0,
    'Plural dative without article: mit guten Freunden - adjective takes -en.','hard','a2.adjective.endings','A2_lesson_18');

// Präteritum (needs +6): Lesson 2, 13
add('Präteritum','fill','Gestern ___ ich zu Hause. (sein)', ['war','bin','warst','waren'], 0,
    'Ich war - Präteritum of sein for first person singular.','medium','a2.praeteritum','A2_lesson_2');
add('Präteritum','fill','Er ___ gestern keine Zeit. (haben)', ['hatte','hat','habt','hattest'], 0,
    'Er hatte - Präteritum of haben for third person singular.','medium','a2.praeteritum','A2_lesson_2');
add('Präteritum','fill','Wir ___ letzte Woche im Urlaub. (sein)', ['waren','sind','wurden','hatten'], 0,
    'Wir waren - Präteritum of sein for first person plural.','medium','a2.praeteritum','A2_lesson_2');
add('Präteritum','fill','Das Wetter ___ gestern sehr schön. (sein)', ['war','ist','wird','hat'], 0,
    'Das Wetter war - Präteritum of sein for weather descriptions.','medium','a2.praeteritum','A2_lesson_13');
add('Präteritum','fill','Es ___ den ganzen Tag. (regnen)', ['regnete','regnet','hat geregnet','regnet'], 0,
    'Es regnete - Präteritum of regnen for past weather.','hard','a2.praeteritum','A2_lesson_13');
add('Präteritum','fill','Die Sonne ___ den ganzen Tag. (scheinen)', ['schien','scheint','hat geschienen','schien'], 0,
    'Die Sonne schien - Präteritum of scheinen for past weather.','hard','a2.praeteritum','A2_lesson_13');

// Reflexive Verben (needs +4): Lessons 11, 22
add('Reflexive Verben','fill','Ich ___ mich auf die Prüfung. (vorbereiten)', ['bereite vor','vorbereite','vorbereit','bereit vor'], 0,
    'Ich bereite mich vor - reflexive separable verb, pronoun precedes.','medium','a2.reflexive.verbs','A2_lesson_11');
add('Reflexive Verben','fill','Er ___ sich die Zähne. (putzen)', ['putzt','putze','putzen','putzst'], 0,
    'Er putzt sich die Zähne - reflexive verb in third person.','medium','a2.reflexive.verbs','A2_lesson_11');
add('Reflexive Verben','fill','Wir ___ uns auf den Sommer. (freuen)', ['freuen','freut','freue','freust'], 0,
    'Wir freuen uns - reflexive freuen takes "uns" for first person plural.','medium','a2.reflexive.verbs','A2_lesson_22');
add('Reflexive Verben','fill','___ du dich gut? (fühlen)', ['Fühlst','Fühle','Fühlt','Fühlen'], 0,
    'Fühlst du dich - reflexive verb with du form.','medium','a2.reflexive.verbs','A2_lesson_22');

// Genitiv (needs +6): Lesson 19
add('Genitiv','fill','Das ist das Auto ___ Nachbarn. (der)', ['des','dem','den','der'], 0,
    'Das Auto des Nachbarn - genitive masculine singular: des + noun + s.','medium','a2.genitive','A2_lesson_19');
add('Genitiv','fill','Die Farbe ___ Himmels ist blau. (der)', ['des','dem','den','der'], 0,
    'Des Himmels - genitive masculine: des Himmels.','hard','a2.genitive','A2_lesson_19');
add('Genitiv','fill','Wegen ___ Regens bleiben wir zu Hause. (der)', ['des','dem','den','der'], 0,
    'Wegen des Regens - genitive after wegen.','hard','a2.genitive','A2_lesson_19');
add('Genitiv','fill','Das ist die Idee ___ Studentin. (die)', ['der','die','dem','des'], 0,
    'Die Idee der Studentin - genitive feminine: der Studentin.','medium','a2.genitive','A2_lesson_19');
add('Genitiv','fill','Die Bücher ___ Professors sind alt. (der)', ['des','dem','den','der'], 0,
    'Die Bücher des Professors - genitive masculine: des + s ending.','hard','a2.genitive','A2_lesson_19');
add('Genitiv','fill','Das ist der Hund ___ Kinder. (die/plural)', ['der','die','den','des'], 0,
    'Der Hund der Kinder - genitive plural: der Kinder.','medium','a2.genitive','A2_lesson_19');

// Wechselpräpositionen (needs +5): Lesson 10
add('Wechselpräpositionen','fill','Das Buch liegt auf ___ Tisch. (der)', ['dem','den','die','das'], 0,
    'Auf dem Tisch - dative for static position (wo?).','medium','a2.two.way.prepositions','A2_lesson_10');
add('Wechselpräpositionen','fill','Ich lege das Buch auf ___ Tisch. (der)', ['den','dem','die','das'], 0,
    'Auf den Tisch - accusative for direction (wohin?).','medium','a2.two.way.prepositions','A2_lesson_10');
add('Wechselpräpositionen','fill','Die Katze sitzt unter ___ Stuhl. (der)', ['dem','den','die','das'], 0,
    'Unter dem Stuhl - dative for position.','medium','a2.two.way.prepositions','A2_lesson_10');
add('Wechselpräpositionen','fill','Die Katze läuft unter ___ Stuhl. (der)', ['den','dem','die','das'], 0,
    'Unter den Stuhl - accusative for movement.','medium','a2.two.way.prepositions','A2_lesson_10');
add('Wechselpräpositionen','fill','Das Bild hängt an ___ Wand. (die)', ['der','die','den','dem'], 0,
    'An der Wand - dative for position on vertical surface.','medium','a2.two.way.prepositions','A2_lesson_10');

// Indirekte Fragen (needs +6): Lesson 6, 10, 20
add('Indirekte Fragen','fill','Können Sie mir sagen, wo der Bahnhof ___? (sein)', ['ist','seid','bin','sind'], 0,
    'Wo der Bahnhof ist - indirect question with verb at end.','medium','a2.indirect.questions','A2_lesson_6');
add('Indirekte Fragen','fill','Weißt du, wann der Zug ___? (ankommen)', ['ankommt','kommt an','ankommen','ankommst'], 0,
    'Wann der Zug ankommt - separable verb at end in indirect question.','hard','a2.indirect.questions','A2_lesson_6');
add('Indirekte Fragen','fill','Ich möchte wissen, wie viel das ___. (kosten)', ['kostet','koste','kosten','kostest'], 0,
    'Wie viel das kostet - indirect question, verb at end.','medium','a2.indirect.questions','A2_lesson_6');
add('Indirekte Fragen','fill','Ich frage mich, ___ er morgen kommt.', ['ob','wenn','dass','weil'], 0,
    'Ich frage mich, ob - indirect yes/no question uses "ob".','medium','a2.indirect.questions','A2_lesson_20');
add('Indirekte Fragen','fill','Er fragt, ___ ich das gemacht habe.', ['ob','wenn','dass','weil'], 0,
    'Er fragt, ob - ob introduces indirect yes/no questions.','medium','a2.indirect.questions','A2_lesson_20');
add('Indirekte Fragen','fill','Kannst du mir sagen, ___ ich jetzt machen soll?', ['was','ob','dass','wenn'], 0,
    'Was ich machen soll - was introduces indirect question for "what".','medium','a2.indirect.questions','A2_lesson_20');

// Trennbare Verben Perfekt (needs +6): Lesson 3
add('Trennbare Verben Perfekt','fill','Ich bin heute früh ___. (aufstehen)', ['aufgestanden','aufsteht','aufgestehen','aufstand'], 0,
    'Aufgestanden - Perfekt of aufstehen, ge between prefix and stem.','medium','a2.separable.verbs','A2_lesson_3');
add('Trennbare Verben Perfekt','fill','Hast du die Tür ___? (aufmachen)', ['aufgemacht','aufmachte','gemacht auf','aufmacht'], 0,
    'Aufgemacht - Perfekt of aufmachen, ge- between auf and macht.','medium','a2.separable.verbs','A2_lesson_3');
add('Trennbare Verben Perfekt','fill','Er hat das Fenster ___. (zumachen)', ['zugemacht','zumacht','zugemachen','gemacht zu'], 0,
    'Zugemacht - Perfekt of zumachen with ge- between zu and macht.','medium','a2.separable.verbs','A2_lesson_3');
add('Trennbare Verben Perfekt','fill','Wir haben gestern ___. (einkaufen)', ['eingekauft','einkauft','eingekaufen','gekauft ein'], 0,
    'Eingekauft - Perfekt of einkaufen, ge- between ein and kauft.','medium','a2.separable.verbs','A2_lesson_3');
add('Trennbare Verben Perfekt','fill','Sie hat mich ___. (anrufen)', ['angerufen','angeruft','angreufen','ruft an'], 0,
    'Angerufen - Perfekt of anrufen, irregular participle.','hard','a2.separable.verbs','A2_lesson_3');
add('Trennbare Verben Perfekt','fill','Ich habe das Licht ___. (anmachen)', ['angemacht','anmacht','angemachen','macht an'], 0,
    'Angemacht - Perfekt of anmachen with ge- between an and macht.','medium','a2.separable.verbs','A2_lesson_3');

// Possessivartikel (needs +6): Lesson 1, 16
add('Possessivartikel','fill','Das ist ___ Buch. (ich)', ['mein','meine','meinen','meiner'], 0,
    'Mein Buch - possessive for ich, neuter nominative takes no ending.','medium','a2.possessive','A2_lesson_1');
add('Possessivartikel','fill','Ist das ___ Schwester? (du)', ['deine','dein','deinen','deiner'], 0,
    'Deine Schwester - possessive for du, feminine nominative takes -e.','medium','a2.possessive','A2_lesson_1');
add('Possessivartikel','fill','Wo ist ___ Auto? (wir)', ['unser','unsere','unseren','unserer'], 0,
    'Unser Auto - possessive for wir, neuter nominative takes no ending.','medium','a2.possessive','A2_lesson_1');
add('Possessivartikel','fill','___ Eltern wohnen in Berlin. (er)', ['Seine','Sein','Seinen','Seiner'], 0,
    'Seine Eltern - possessive for er, plural takes -e.','medium','a2.possessive','A2_lesson_1');
add('Possessivartikel','fill','Ich gebe ___ Freundin ein Geschenk. (ich)', ['meiner','meine','meinen','mein'], 0,
    'Meiner Freundin - dative feminine possessive takes -er.','hard','a2.possessive','A2_lesson_16');
add('Possessivartikel','fill','Er hilft ___ Bruder. (er)', ['seinem','seinen','seine','seiner'], 0,
    'Seinem Bruder - dative masculine possessive takes -em.','hard','a2.possessive','A2_lesson_16');

// Imperativ (needs +4): Lesson 2, 12
add('Imperativ','fill','___ bitte leise! (sein/Sie)', ['Seien','Sei','Seid','Sind'], 0,
    'Seien Sie - formal imperative of sein.','medium','a2.imperative','A2_lesson_2');
add('Imperativ','mc','___ Sie die Tabletten zweimal täglich. (nehmen)', ['Nehmen','Nimm','Nehme','Nehmt'], 0,
    'Nehmen Sie - formal imperative, verb first then Sie.','medium','a2.imperative','A2_lesson_12');
add('Imperativ','fill','___ mir bitte! (helfen/du)', ['Hilf','Helfe','Helft','Helf'], 0,
    'Hilf mir - informal imperative of helfen, vowel changes from e to i.','hard','a2.imperative','A2_lesson_2');
add('Imperativ','fill','___ nicht so schnell! (fahren/Sie)', ['Fahren','Fahr','Fahrt','Fahre'], 0,
    'Fahren Sie - formal imperative with verb first.','medium','a2.imperative','A2_lesson_2');

// Negation (needs +5): Lesson 1
add('Negation','fill','Ich habe ___ Zeit.', ['keine','nicht','kein','keinen'], 0,
    'Keine Zeit - negation of noun with kein (feminine).','medium','a2.negation','A2_lesson_1');
add('Negation','fill','Er spricht ___ Deutsch.', ['kein','keine','nicht','keinen'], 0,
    'Kein Deutsch - kein negates nouns (neuter).','medium','a2.negation','A2_lesson_1');
add('Negation','fill','Das ist ___ Problem.', ['kein','keine','nicht','keinen'], 0,
    'Kein Problem - kein for neuter noun.','medium','a2.negation','A2_lesson_1');
add('Negation','fill','Ich mag ___ Fleisch.', ['kein','keine','nicht','keinen'], 0,
    'Kein Fleisch - kein for neuter accusative.','medium','a2.negation','A2_lesson_1');
add('Negation','fill','Sie hat ___ Geschwister.', ['keine','kein','nicht','keinen'], 0,
    'Keine Geschwister - kein for plural.','medium','a2.negation','A2_lesson_1');

// Zeitangaben (needs +5): Lesson 2, 15
add('Zeitangaben','fill','Der Kurs beginnt ___ 9 Uhr.', ['um','am','im','seit'], 0,
    'Um 9 Uhr - um for specific clock time.','medium','a2.time.expressions','A2_lesson_2');
add('Zeitangaben','fill','Ich arbeite ___ Montag bis Freitag.', ['von','ab','seit','am'], 0,
    'Von Montag bis Freitag - von...bis for duration.','medium','a2.time.expressions','A2_lesson_2');
add('Zeitangaben','fill','Wir treffen uns ___ 15. Mai.', ['am','im','um','seit'], 0,
    'Am 15. Mai - am for specific dates.','medium','a2.time.expressions','A2_lesson_15');
add('Zeitangaben','fill','___ Sommer fahren wir nach Spanien.', ['Im','Am','Um','Seit'], 0,
    'Im Sommer - im for seasons.','medium','a2.time.expressions','A2_lesson_13');
add('Zeitangaben','fill','Ich lerne jetzt ___ drei Monaten Deutsch.', ['seit','vor','für','ab'], 0,
    'Seit drei Monaten - seit for ongoing action from past to present.','hard','a2.time.expressions','A2_lesson_2');

// als vs wenn (needs +5): Lesson 4
add('als vs wenn','fill','___ ich klein war, wohnte ich in München.', ['Als','Wenn','Wann','Ob'], 0,
    'Als - for one-time event in past.','medium','a2.als.wenn','A2_lesson_4');
add('als vs wenn','fill','___ ich nach Hause komme, esse ich zu Abend.', ['Wenn','Als','Wann','Ob'], 0,
    'Wenn - for habitual/repeated action.','medium','a2.als.wenn','A2_lesson_4');
add('als vs wenn','fill','___ ich 18 wurde, feierte ich eine große Party.', ['Als','Wenn','Wann','Ob'], 0,
    'Als - specific moment in past.','medium','a2.als.wenn','A2_lesson_4');
add('als vs wenn','fill','___ es regnet, bleibe ich zu Hause.', ['Wenn','Als','Wann','Ob'], 0,
    'Wenn - for general condition or repeated.','medium','a2.als.wenn','A2_lesson_4');
add('als vs wenn','fill','___ ich gestern im Park war, traf ich einen alten Freund.', ['Als','Wenn','Wann','Ob'], 0,
    'Als - one-time past event with specific time marker "gestern".','hard','a2.als.wenn','A2_lesson_4');

// Modalverben (needs +3): Lesson 2, 8
add('Modalverben','fill','Ich ___ heute nicht kommen. (können)', ['kann','könnte','konnte','kan'], 0,
    'Ich kann - present tense of können, first person.','medium','a2.modal.verbs','A2_lesson_2');
add('Modalverben','fill','Wir ___ morgen früher anfangen. (müssen)', ['müssen','müsst','muss','mussten'], 0,
    'Wir müssen - present tense of müssen, first person plural.','medium','a2.modal.verbs','A2_lesson_2');
add('Modalverben','fill','___ du mir helfen? (können)', ['Kannst','Kann','Könnt','Können'], 0,
    'Kannst du - second person singular of können.','medium','a2.modal.verbs','A2_lesson_2');

// Nebensätze weildass (needs +4): Lesson 5, 9
add('weil Sätze','fill','Ich bleibe zu Hause, ___ es regnet.', ['weil','obwohl','trotzdem','denn'], 0,
    'Weil es regnet - weil introduces subordinate clause.','medium','a2.weil.clauses','A2_lesson_5');
add('weil Sätze','fill','Er lernt Deutsch, ___ er in Deutschland arbeiten möchte.', ['weil','obwohl','damit','dass'], 0,
    'Weil - introduces reason/cause in subordinate clause.','medium','a2.weil.clauses','A2_lesson_5');
add('dass Sätze','fill','Ich finde, ___ Deutsch eine schöne Sprache ist.', ['dass','ob','wenn','weil'], 0,
    'Ich finde, dass - dass introduces a subordinate clause after opinion verbs.','medium','a2.dass.clauses','A2_lesson_9');
add('dass Sätze','fill','Er sagt, ___ er morgen kommt.', ['dass','ob','wenn','weil'], 0,
    'Er sagt, dass - dass after verbs of saying.','medium','a2.dass.clauses','A2_lesson_9');

// Satzstellung (needs 0, currently 10, but worth covering time-manner-place): Lesson 15
add('Satzstellung','order','ich / bin / gestern / nach Berlin / gefahren', ['Ich bin gestern nach Berlin gefahren.','Gestern bin ich nach Berlin gefahren.'], 0,
    'Time-manner-place: gestern (time) + nach Berlin (place). Both orders work.',
    'hard','a2.word.order','A2_lesson_15');
add('Satzstellung','order','er / fährt / morgen / mit dem Zug / nach München', ['Er fährt morgen mit dem Zug nach München.','Morgen fährt er mit dem Zug nach München.'], 0,
    'Time (morgen), manner (mit dem Zug), place (nach München).',
    'hard','a2.word.order','A2_lesson_15');

// A2 Mix questions for review
add('A2 Mix','fill','Ich ___ mich jeden Morgen.', ['wasche','waschen','wäscht','waschst'], 0,
    'Ich wasche mich - reflexive verb in first person.','medium','a2.mixed.review','A2_lesson_25');
add('A2 Mix','fill','Das ist ___ schönen Tag.', ['ein','eine','einen','einer'], 0,
    'Ein schönen Tag - ein with adjective ending -en in accusative.','hard','a2.mixed.review','A2_lesson_25');
add('A2 Mix','fill','Er ist gestern mit ___ Fahrrad gefahren.', ['dem','den','der','das'], 0,
    'Mit dem Fahrrad - mit takes dative.','medium','a2.mixed.review','A2_lesson_25');
add('A2 Mix','correction','Ich habe gestern ins Kino gehen.', ['Ich bin gestern ins Kino gegangen.'], 0,
    'gehen uses sein as auxiliary in Perfekt: ich bin gegangen.','hard','a2.mixed.review','A2_lesson_25');

const before = data.A2.length;
data.A2 = data.A2.concat(newQuestions);
const after = data.A2.length;

fs.writeFileSync(GRAM_PATH, JSON.stringify(data, null, 2), 'utf-8');

console.log('=== Stage 3 Complete ===');
console.log('New questions:', newQuestions.length);
console.log('A2 grammar before:', before);
console.log('A2 grammar after:', after);

// Verify all have required fields
const bad = data.A2.filter(q => !q.conceptId || !q.taughtInLessonId || !q.explanation);
console.log('Missing required fields:', bad.length);
