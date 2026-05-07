/**
 * map-curriculum-dependencies.cjs (Part 1 - Data + Logic)
 *
 * Infers taughtInLessonId for vocabulary and grammar items
 * that lack it (A2-C1) by matching topics and keywords to lessons.
 *
 * Usage: node scripts/map-curriculum-dependencies.cjs
 */

const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LEVELS = ['A1','A2','B1','B2','C1'];

function loadJSON(n) { return JSON.parse(fs.readFileSync(path.join(DATA_DIR,n),'utf-8')); }
function saveJSON(n,d) { fs.writeFileSync(path.join(DATA_DIR,n), JSON.stringify(d,null,2)+'\n','utf-8'); console.log('  Saved '+n); }

const lessons = loadJSON('germanLessons.json');
const wordByLevel = {}, lessonsByLevel = {};
lessons.forEach(l => {
  const lvl = l.level||'A1';
  if(!lessonsByLevel[lvl]) lessonsByLevel[lvl]=[];
  lessonsByLevel[lvl].push(l);
  if(!wordByLevel[lvl]) wordByLevel[lvl]={};
  (l.vocabulary||[]).forEach(v => {
    const w = (v.word||v.german||'').toLowerCase().trim();
    if(w) wordByLevel[lvl][w]=l.id;
  });
});

// Vocab topic -> lesson
const VT = {};
VT.A2={Travel:'A2_lesson_4',Health:'A2_lesson_11',Shopping:'A2_lesson_6',Feelings:'A2_lesson_18',Living:'A2_lesson_10',People:'A2_lesson_1',Work:'A2_lesson_8',Culture:'A2_lesson_24','Daily Life':'A2_lesson_2',Finance:'A2_lesson_6',Technology:'A2_lesson_21',Nature:'A2_lesson_13',Grammar:'A2_lesson_1',Time:'A2_lesson_2','Past Activities':'A2_lesson_3',Food:'A2_lesson_7',Education:'A2_lesson_9',Hobbies:'A2_lesson_14',Admin:'A2_lesson_20',Housing:'A2_lesson_10',Services:'A2_lesson_6',Furniture:'A2_lesson_10',Medical:'A2_lesson_11',Animals:'A2_lesson_13',Weather:'A2_lesson_13',Body:'A2_lesson_17',Clothing:'A2_lesson_6',Transportation:'A2_lesson_23'};
VT.B1={Media:'B1_lesson_1',Discussion:'B1_lesson_1',Environment:'B1_lesson_2',Nature:'B1_lesson_2',Education:'B1_lesson_3',Culture:'B1_lesson_4',Technology:'B1_lesson_5',Communication:'B1_lesson_6',Work:'B1_lesson_7','Social Media':'B1_lesson_8',Travel:'B1_lesson_19',Health:'B1_lesson_12',Food:'B1_lesson_12',Hobbies:'B1_lesson_11',Housing:'B1_lesson_14',Transportation:'B1_lesson_15',Festivals:'B1_lesson_16',News:'B1_lesson_17',Restaurant:'B1_lesson_18',Volunteer:'B1_lesson_20',University:'B1_lesson_21',Books:'B1_lesson_22',Sports:'B1_lesson_23',Traffic:'B1_lesson_24',Finance:'B1_lesson_25',Economy:'B1_lesson_25',Relationships:'B1_lesson_13',People:'B1_lesson_13',Feelings:'B1_lesson_13',Future:'B1_lesson_13','Daily Life':'B1_lesson_1',Living:'B1_lesson_14',Science:'B1_lesson_5',Society:'B1_lesson_24',Politics:'B1_lesson_22',History:'B1_lesson_22',Career:'B1_lesson_10',Shopping:'B1_lesson_6',Grammar:'B1_lesson_1',Weather:'B1_lesson_19',Law:'B1_lesson_18'};
VT.B2={Economy:'B2_lesson_1',Finance:'B2_lesson_10',Science:'B2_lesson_2',Politics:'B2_lesson_3',Literature:'B2_lesson_4',Migration:'B2_lesson_5',Globalization:'B2_lesson_6',Ethics:'B2_lesson_7',Work:'B2_lesson_8',Career:'B2_lesson_8',Environment:'B2_lesson_9',Sustainability:'B2_lesson_9',Nature:'B2_lesson_9',Law:'B2_lesson_12',Media:'B2_lesson_13',Psychology:'B2_lesson_14',Health:'B2_lesson_21',Travel:'B2_lesson_15',Tourism:'B2_lesson_15',Technology:'B2_lesson_16',Digitalization:'B2_lesson_16',Society:'B2_lesson_11',Urban:'B2_lesson_18',Energy:'B2_lesson_19',Fashion:'B2_lesson_20',Sports:'B2_lesson_21',History:'B2_lesson_22',Philosophy:'B2_lesson_23',EU:'B2_lesson_24',Culture:'B2_lesson_25',Communication:'B2_lesson_25',People:'B2_lesson_11',Education:'B2_lesson_3',Housing:'B2_lesson_18',Food:'B2_lesson_14',Hobbies:'B2_lesson_21','Daily Life':'B2_lesson_9',Feelings:'B2_lesson_14',Relationships:'B2_lesson_5',Grammar:'B2_lesson_1',Shopping:'B2_lesson_20'};
VT.C1={Academic:'C1_lesson_1',Education:'C1_lesson_1',Law:'C1_lesson_2',Ethics:'C1_lesson_2',Health:'C1_lesson_3',Medical:'C1_lesson_3',Medicine:'C1_lesson_3',Globalization:'C1_lesson_4',Sustainability:'C1_lesson_4',Environment:'C1_lesson_4',Rhetoric:'C1_lesson_5',Writing:'C1_lesson_6',Science:'C1_lesson_6',Linguistics:'C1_lesson_7',Discourse:'C1_lesson_8',Literature:'C1_lesson_9',Economy:'C1_lesson_10',Business:'C1_lesson_10',Cognitive:'C1_lesson_11',Psychology:'C1_lesson_11',Philosophy:'C1_lesson_12',Nature:'C1_lesson_14',Culture:'C1_lesson_15',Society:'C1_lesson_15',Politics:'C1_lesson_18',Media:'C1_lesson_1',Technology:'C1_lesson_23',Digital:'C1_lesson_23',History:'C1_lesson_22',Arts:'C1_lesson_24',Art:'C1_lesson_24',Justice:'C1_lesson_25',Discrimination:'C1_lesson_25',People:'C1_lesson_15',Work:'C1_lesson_10',Communication:'C1_lesson_7',Grammar:'C1_lesson_19',Language:'C1_lesson_19',Travel:'C1_lesson_15'};

// Grammar topic -> lesson
const GM = {};
GM.A2=[
  {x:['satzstellung','wortstellung','verbposition','word order','verb second'],id:'A2_lesson_1'},
  {x:['trennbar','trennbare','prefix','partikelverb','separ'],id:'A2_lesson_2'},
  {x:['perfekt','haben','partizip','vergangenheit'],id:'A2_lesson_3'},
  {x:['dativ preposition','prap mit','prap nach','prap aus','prap zu','prap bei','prap von'],id:'A2_lesson_4'},
  {x:['mochten','modalverb','wurde','would like'],id:'A2_lesson_5'},
  {x:['dieser','demonstrativ','artikel','demonstrative'],id:'A2_lesson_6'},
  {x:['schmecken','dativ','schmeckt','dative verb'],id:'A2_lesson_7'},
  {x:['wechselpraposition','dativ akkusativ','two way'],id:'A2_lesson_8'},
  {x:['wollen','modal verb'],id:'A2_lesson_9'},
  {x:['adjektivendung','adjective ending','nach ein'],id:'A2_lesson_10'},
  {x:['weh tun','tut weh','pain'],id:'A2_lesson_11'},
  {x:['etwas gegen','gegen',],id:'A2_lesson_12'},
  {x:['es ist','wetter','es gibt'],id:'A2_lesson_13'},
  {x:['adverb','frequenz','selten','haufig','frequency'],id:'A2_lesson_14'},
  {x:['hast du lust','zu infinitiv','infinitivsatz','zu infinitive'],id:'A2_lesson_15'},
  {x:['mir dir','wem','dative pronoun'],id:'A2_lesson_16'},
  {x:['tragen','starkes verb','kleidung','anziehen'],id:'A2_lesson_17'},
  {x:['finden','adjektiv','akkusativ','opinion'],id:'A2_lesson_18'},
  {x:['imperativ','sie','formal','befehlsform'],id:'A2_lesson_19'},
  {x:['ausfullen','antrag','separable'],id:'A2_lesson_20'},
  {x:['konnen','ability','can'],id:'A2_lesson_21'},
  {x:['sollen','empfehlung','ratschlag','should'],id:'A2_lesson_22'},
  {x:['einsteigen','aussteigen','umsteigen','prefix verb'],id:'A2_lesson_23'},
  {x:['reflexiv','sich','gewohnen','reflexive','sich verb'],id:'A2_lesson_24'},
  {x:['wiederholung','review','prufung'],id:'A2_lesson_25'}
];
GM.B1=[
  {x:['dass','subordinate','nebensatz','verb at end'],id:'B1_lesson_1'},
  {x:['relative clause','relativsatz','der die das','relativpronomen'],id:'B1_lesson_2'},
  {x:['konjunktiv ii','wurde','hatte','conditional','subjunctive'],id:'B1_lesson_3'},
  {x:['passiv','passive','werden','partizip ii'],id:'B1_lesson_4'},
  {x:['futur i','werden','future','infinitive at end'],id:'B1_lesson_5'},
  {x:['telefon','phone','connector','formal communication'],id:'B1_lesson_6'},
  {x:['bewerbung','cover letter','anschreiben'],id:'B1_lesson_7'},
  {x:['reflexiv','social media','sich verb'],id:'B1_lesson_8'},
  {x:['mussen','durfen','modal verb','environment'],id:'B1_lesson_9'},
  {x:['internship','beruf','praktikum','career'],id:'B1_lesson_10'},
  {x:['film','recommendation','konjunktiv'],id:'B1_lesson_11'},
  {x:['ernahrung','sollte','nutrition'],id:'B1_lesson_12'},
  {x:['future','zukunft','hoffen','werden'],id:'B1_lesson_13'},
  {x:['rental','miete','wohnung','vermieten','dativ preposition'],id:'B1_lesson_14'},
  {x:['public transport','nahverkehr'],id:'B1_lesson_15'},
  {x:['party','feier','socializing'],id:'B1_lesson_16'},
  {x:['reported speech','indirekte rede','news'],id:'B1_lesson_17'},
  {x:['restaurant','kritik','complaint','criticism'],id:'B1_lesson_18'},
  {x:['travel','reise','vorbereitung'],id:'B1_lesson_19'},
  {x:['volunteer','ehrenamt','engagement'],id:'B1_lesson_20'},
  {x:['university','studium','hochschule'],id:'B1_lesson_21'},
  {x:['book','lesen','literatur'],id:'B1_lesson_22'},
  {x:['sport','event','wettkampf'],id:'B1_lesson_23'},
  {x:['traffic','stau','commuting','pendeln'],id:'B1_lesson_24'},
  {x:['finance','finanz','sparen','geld','konto'],id:'B1_lesson_25'}
];
GM.B2=[
  {x:['vorgangspassiv','zustandspassiv','process passive','state passive'],id:'B2_lesson_1'},
  {x:['konjunktiv i','indirect speech','indirekte','subjunctive i'],id:'B2_lesson_2'},
  {x:['partizip i','partizip ii','participial','extended partic'],id:'B2_lesson_3'},
  {x:['historical present','prasens','literature plot'],id:'B2_lesson_4'},
  {x:['modal verb subjective','mussen','konnen','durften'],id:'B2_lesson_5'},
  {x:['globalization','globalisierung','debate'],id:'B2_lesson_6'},
  {x:['ethics','ethik','wissenschaft'],id:'B2_lesson_7'},
  {x:['interview','bewerbungsgesprach'],id:'B2_lesson_8'},
  {x:['sustainability','nachhaltigkeit','okologisch'],id:'B2_lesson_9'},
  {x:['finance','finanz','geld','konto','vermogen'],id:'B2_lesson_10'},
  {x:['migration','integration','gesellschaft'],id:'B2_lesson_11'},
  {x:['recht','justiz','gericht','gesetz','anwalt','legal'],id:'B2_lesson_12'},
  {x:['medien','journalismus','presse','media'],id:'B2_lesson_13'},
  {x:['psychologie','wohlbefinden','mental','emotion'],id:'B2_lesson_14'},
  {x:['tourismus','reise','urlaub','travel'],id:'B2_lesson_15'},
  {x:['digitalisierung','digital','vernetzung'],id:'B2_lesson_16'},
  {x:['politisches system','demokratie','regierung','parlament'],id:'B2_lesson_17'},
  {x:['urbane entwicklung','stadt','smart city','infrastruktur'],id:'B2_lesson_18'},
  {x:['energie','energiewende','erneuerbar'],id:'B2_lesson_19'},
  {x:['mode','kleidung','textil','fashion'],id:'B2_lesson_20'},
  {x:['sport','gesundheit','fitness','training','bewegung'],id:'B2_lesson_21'},
  {x:['geschichte','geteilt','brd','ddr','wiedervereinigung'],id:'B2_lesson_22'},
  {x:['philosophie','existenz','wahrheit'],id:'B2_lesson_23'},
  {x:['europaische union','eu','europa'],id:'B2_lesson_24'},
  {x:['interkulturell','kommunikation','vielfalt'],id:'B2_lesson_25'}
];
GM.C1=[
  {x:['connector','insofern','demzufolge','nichtsdestotrotz','advanced'],id:'C1_lesson_1'},
  {x:['subjunctive','reported opinion','differential'],id:'C1_lesson_2'},
  {x:['nominal group','article adjective noun','komplex nominal'],id:'C1_lesson_3'},
  {x:['idiomatic expression','figurative language','zweischneidig'],id:'C1_lesson_4'},
  {x:['stylistic device','sentence structure','rhetoric'],id:'C1_lesson_5'},
  {x:['academic writing','wissenschaftlich','schreiben','forschung'],id:'C1_lesson_6'},
  {x:['register','nuance','stil','formal','informal'],id:'C1_lesson_7'},
  {x:['discourse analysis','kritisch','diskurs'],id:'C1_lesson_8'},
  {x:['literatur','interpretation','roman','gedicht'],id:'C1_lesson_9'},
  {x:['business','wirtschaft','verhandlung','vertrag'],id:'C1_lesson_10'},
  {x:['kognitiv','linguistik','grammatik','sprache'],id:'C1_lesson_11'},
  {x:['jura','rechtsphilosophie','paragraf'],id:'C1_lesson_12'},
  {x:['medizinethik','sterbehilfe','genetik','pranatal'],id:'C1_lesson_13'},
  {x:['umweltethik','nachhaltigkeit','okologisch'],id:'C1_lesson_14'},
  {x:['kulturkritik','gesellschaft','analyse','soziologie'],id:'C1_lesson_15'},
  {x:['phanomenologie','existenzialismus','heidegger','sartre'],id:'C1_lesson_16'},
  {x:['psycholinguistik','sprachstorung','aphasie','dyslexie'],id:'C1_lesson_17'},
  {x:['politische philosophie','moderne','staat','macht'],id:'C1_lesson_18'},
  {x:['tempus','aspekt','zeitform','tense'],id:'C1_lesson_19'},
  {x:['wissenschaftssoziologie','forschungsethik','wissen'],id:'C1_lesson_20'},
  {x:['semantik','pragmatik','bedeutung','kontext'],id:'C1_lesson_21'},
  {x:['mediation','konflikt','losung','vermittlung'],id:'C1_lesson_22'},
  {x:['digital humanities','digital','computerlinguistik'],id:'C1_lesson_23'},
  {x:['kunsttheorie','asthetik','kunst','malerei','skulptur'],id:'C1_lesson_24'},
  {x:['globale gerechtigkeit','gerechtigkeit','armut','menschenrecht'],id:'C1_lesson_25'}
];

// === Main mapping functions ===

function findVocabLessonId(word, level, obj) {
  if(!wordByLevel[level]) return null;
  const w = (word||'').toLowerCase().trim();
  if(!w) return null;
  // 1) exact match from lesson embedded vocab
  if(wordByLevel[level][w]) return wordByLevel[level][w];
  // 2) topic field match (case-insensitive + partial keyword lookup)
  const tRaw = obj.topic||'';
  if(tRaw) {
    // Direct match (case-insensitive)
    const vt = VT[level]||{};
    for(const [vtKey, vtId] of Object.entries(vt)) {
      if(tRaw.toLowerCase() === vtKey.toLowerCase()) return vtId;
    }

    // Per-level keyword mapping
    const tLower = tRaw.toLowerCase();
    const KW = {
      A2: {},
      B1: {},
      B2: {},
      C1: {},
    };
    // A2 keywords
    KW.A2['travel']='A2_lesson_4'; KW.A2['health']='A2_lesson_11'; KW.A2['medical']='A2_lesson_11';
    KW.A2['food']='A2_lesson_7'; KW.A2['nature']='A2_lesson_13'; KW.A2['weather']='A2_lesson_13';
    KW.A2['hobby']='A2_lesson_14'; KW.A2['sport']='A2_lesson_14'; KW.A2['leisure']='A2_lesson_14';
    KW.A2['shopping']='A2_lesson_6'; KW.A2['service']='A2_lesson_6'; KW.A2['clothing']='A2_lesson_6';
    KW.A2['finance']='A2_lesson_6'; KW.A2['money']='A2_lesson_6';
    KW.A2['work']='A2_lesson_8'; KW.A2['job']='A2_lesson_8'; KW.A2['career']='A2_lesson_8';
    KW.A2['education']='A2_lesson_9'; KW.A2['learning']='A2_lesson_9';
    KW.A2['culture']='A2_lesson_24'; KW.A2['society']='A2_lesson_24';
    KW.A2['home']='A2_lesson_10'; KW.A2['living']='A2_lesson_10'; KW.A2['housing']='A2_lesson_10';
    KW.A2['technology']='A2_lesson_21'; KW.A2['media']='A2_lesson_21';
    KW.A2['body']='A2_lesson_17'; KW.A2['feeling']='A2_lesson_18'; KW.A2['emotion']='A2_lesson_18';
    KW.A2['time']='A2_lesson_2'; KW.A2['daily']='A2_lesson_2';
    KW.A2['people']='A2_lesson_1'; KW.A2['travel']='A2_lesson_4'; KW.A2['transport']='A2_lesson_23';
    KW.A2['admin']='A2_lesson_20'; KW.A2['past']='A2_lesson_3'; KW.A2['verb']='A2_lesson_1';

    // B1 keywords
    KW.B1['media']='B1_lesson_1'; KW.B1['discussion']='B1_lesson_1'; KW.B1['communication']='B1_lesson_6';
    KW.B1['environment']='B1_lesson_2'; KW.B1['nature']='B1_lesson_2'; KW.B1['climate']='B1_lesson_2';
    KW.B1['education']='B1_lesson_3'; KW.B1['learning']='B1_lesson_3'; KW.B1['school']='B1_lesson_3';
    KW.B1['culture']='B1_lesson_4'; KW.B1['festival']='B1_lesson_4';
    KW.B1['technology']='B1_lesson_5'; KW.B1['digital']='B1_lesson_5'; KW.B1['science']='B1_lesson_5';
    KW.B1['work']='B1_lesson_7'; KW.B1['career']='B1_lesson_10'; KW.B1['professional']='B1_lesson_10';
    KW.B1['application']='B1_lesson_7'; KW.B1['internship']='B1_lesson_10';
    KW.B1['social media']='B1_lesson_8'; KW.B1['online']='B1_lesson_8';
    KW.B1['health']='B1_lesson_12'; KW.B1['food']='B1_lesson_12'; KW.B1['nutrition']='B1_lesson_12';
    KW.B1['society']='B1_lesson_24'; KW.B1['social']='B1_lesson_24';
    KW.B1['politics']='B1_lesson_22'; KW.B1['history']='B1_lesson_22';
    KW.B1['travel']='B1_lesson_19'; KW.B1['transport']='B1_lesson_15';
    KW.B1['housing']='B1_lesson_14'; KW.B1['home']='B1_lesson_14'; KW.B1['real estate']='B1_lesson_14';
    KW.B1['hobby']='B1_lesson_11'; KW.B1['leisure']='B1_lesson_11'; KW.B1['film']='B1_lesson_11';
    KW.B1['sport']='B1_lesson_23'; KW.B1['fitness']='B1_lesson_23';
    KW.B1['finance']='B1_lesson_25'; KW.B1['economy']='B1_lesson_25'; KW.B1['business']='B1_lesson_25';
    KW.B1['relationship']='B1_lesson_13'; KW.B1['emotion']='B1_lesson_13'; KW.B1['future']='B1_lesson_13';
    KW.B1['news']='B1_lesson_17'; KW.B1['book']='B1_lesson_22'; KW.B1['reading']='B1_lesson_22';
    KW.B1['restaurant']='B1_lesson_18'; KW.B1['party']='B1_lesson_16';
    KW.B1['volunteer']='B1_lesson_20'; KW.B1['university']='B1_lesson_21'; KW.B1['student']='B1_lesson_21';
    KW.B1['grammar']='B1_lesson_3'; KW.B1['language']='B1_lesson_6';
    KW.B1['traffic']='B1_lesson_24'; KW.B1['shopping']='B1_lesson_6';

    // B2 keywords
    KW.B2['economy']='B2_lesson_1'; KW.B2['business']='B2_lesson_1'; KW.B2['market']='B2_lesson_1';
    KW.B2['science']='B2_lesson_2'; KW.B2['research']='B2_lesson_2'; KW.B2['study']='B2_lesson_2';
    KW.B2['politics']='B2_lesson_3'; KW.B2['government']='B2_lesson_3';
    KW.B2['literature']='B2_lesson_4'; KW.B2['art']='B2_lesson_25'; KW.B2['culture']='B2_lesson_25';
    KW.B2['migration']='B2_lesson_5'; KW.B2['globalization']='B2_lesson_6';
    KW.B2['ethics']='B2_lesson_7'; KW.B2['moral']='B2_lesson_7'; KW.B2['scientific']='B2_lesson_7';
    KW.B2['work']='B2_lesson_8'; KW.B2['career']='B2_lesson_8'; KW.B2['interview']='B2_lesson_8';
    KW.B2['environment']='B2_lesson_9'; KW.B2['sustainability']='B2_lesson_9'; KW.B2['climate']='B2_lesson_9';
    KW.B2['nature']='B2_lesson_9'; KW.B2['ecology']='B2_lesson_9';
    KW.B2['finance']='B2_lesson_10'; KW.B2['investment']='B2_lesson_10'; KW.B2['tax']='B2_lesson_10';
    KW.B2['society']='B2_lesson_11'; KW.B2['social']='B2_lesson_11'; KW.B2['integration']='B2_lesson_11';
    KW.B2['law']='B2_lesson_12'; KW.B2['legal']='B2_lesson_12'; KW.B2['justice']='B2_lesson_12';
    KW.B2['crime']='B2_lesson_12'; KW.B2['consumer']='B2_lesson_12';
    KW.B2['media']='B2_lesson_13'; KW.B2['journalism']='B2_lesson_13';
    KW.B2['psychology']='B2_lesson_14'; KW.B2['mental']='B2_lesson_14'; KW.B2['wellbeing']='B2_lesson_14';
    KW.B2['health']='B2_lesson_21'; KW.B2['medical']='B2_lesson_14'; KW.B2['healthcare']='B2_lesson_14';
    KW.B2['travel']='B2_lesson_15'; KW.B2['tourism']='B2_lesson_15';
    KW.B2['digital']='B2_lesson_16'; KW.B2['technology']='B2_lesson_16';
    KW.B2['urban']='B2_lesson_18'; KW.B2['city']='B2_lesson_18'; KW.B2['housing']='B2_lesson_18';
    KW.B2['energy']='B2_lesson_19'; KW.B2['renewable']='B2_lesson_19';
    KW.B2['fashion']='B2_lesson_20'; KW.B2['clothing']='B2_lesson_20';
    KW.B2['sport']='B2_lesson_21'; KW.B2['fitness']='B2_lesson_21'; KW.B2['exercise']='B2_lesson_21';
    KW.B2['history']='B2_lesson_22'; KW.B2['geography']='B2_lesson_22';
    KW.B2['philosophy']='B2_lesson_23'; KW.B2['thinking']='B2_lesson_23';
    KW.B2['eu']='B2_lesson_24'; KW.B2['europe']='B2_lesson_24';
    KW.B2['communication']='B2_lesson_25'; KW.B2['intercultural']='B2_lesson_25';
    KW.B2['education']='B2_lesson_3'; KW.B2['learning']='B2_lesson_3';
    KW.B2['food']='B2_lesson_14'; KW.B2['nutrition']='B2_lesson_14';
    KW.B2['grammar']='B2_lesson_1'; KW.B2['emotion']='B2_lesson_14';
    KW.B2['transport']='B2_lesson_15'; KW.B2['hospitality']='B2_lesson_15';
    KW.B2['marketing']='B2_lesson_10'; KW.B2['advertising']='B2_lesson_10';
    KW.B2['demographic']='B2_lesson_17'; KW.B2['architecture']='B2_lesson_18';
    KW.B2['war']='B2_lesson_22'; KW.B2['peace']='B2_lesson_22';
    KW.B2['personality']='B2_lesson_14'; KW.B2['abstract']='B2_lesson_1';

    // C1 keywords
    KW.C1['academic']='C1_lesson_1'; KW.C1['discourse']='C1_lesson_1'; KW.C1['research']='C1_lesson_6';
    KW.C1['law']='C1_lesson_2'; KW.C1['legal']='C1_lesson_2'; KW.C1['ethics']='C1_lesson_2';
    KW.C1['ethical']='C1_lesson_2'; KW.C1['medical']='C1_lesson_3'; KW.C1['clinical']='C1_lesson_3';
    KW.C1['healthcare']='C1_lesson_3'; KW.C1['medicine']='C1_lesson_3'; KW.C1['patient']='C1_lesson_3';
    KW.C1['treatment']='C1_lesson_3'; KW.C1['diagnosis']='C1_lesson_3'; KW.C1['arztbrief']='C1_lesson_3';
    KW.C1['consent']='C1_lesson_3'; KW.C1['therapy']='C1_lesson_3';
    KW.C1['globalization']='C1_lesson_4'; KW.C1['sustainability']='C1_lesson_4';
    KW.C1['rhetoric']='C1_lesson_5'; KW.C1['writing']='C1_lesson_6'; KW.C1['methodology']='C1_lesson_6';
    KW.C1['register']='C1_lesson_7'; KW.C1['nuance']='C1_lesson_7'; KW.C1['connector']='C1_lesson_1';
    KW.C1['discourse']='C1_lesson_8'; KW.C1['critical']='C1_lesson_8';
    KW.C1['literature']='C1_lesson_9'; KW.C1['interpretation']='C1_lesson_9';
    KW.C1['business']='C1_lesson_10'; KW.C1['economy']='C1_lesson_10'; KW.C1['negotiation']='C1_lesson_10';
    KW.C1['linguistics']='C1_lesson_11'; KW.C1['cognitive']='C1_lesson_11'; KW.C1['psycholinguistics']='C1_lesson_17';
    KW.C1['philosophy']='C1_lesson_12'; KW.C1['jura']='C1_lesson_12'; KW.C1['existential']='C1_lesson_16';
    KW.C1['genetics']='C1_lesson_13'; KW.C1['bioethics']='C1_lesson_13';
    KW.C1['environment']='C1_lesson_14'; KW.C1['nature']='C1_lesson_14';
    KW.C1['culture']='C1_lesson_15'; KW.C1['society']='C1_lesson_15'; KW.C1['sociology']='C1_lesson_20';
    KW.C1['politics']='C1_lesson_18'; KW.C1['political']='C1_lesson_18';
    KW.C1['grammar']='C1_lesson_19'; KW.C1['tense']='C1_lesson_19'; KW.C1['language']='C1_lesson_19';
    KW.C1['semantics']='C1_lesson_21'; KW.C1['pragmatics']='C1_lesson_21';
    KW.C1['digital']='C1_lesson_23'; KW.C1['humanities']='C1_lesson_23';
    KW.C1['conflict']='C1_lesson_22'; KW.C1['mediation']='C1_lesson_22';
    KW.C1['art']='C1_lesson_24'; KW.C1['aesthetics']='C1_lesson_24'; KW.C1['theory']='C1_lesson_24';
    KW.C1['justice']='C1_lesson_25'; KW.C1['discrimination']='C1_lesson_25'; KW.C1['human rights']='C1_lesson_25';
    KW.C1['education']='C1_lesson_1'; KW.C1['learning']='C1_lesson_1';
    KW.C1['psychology']='C1_lesson_11'; KW.C1['behavior']='C1_lesson_11';
    KW.C1['biology']='C1_lesson_13'; KW.C1['mathematics']='C1_lesson_23';
    KW.C1['statistics']='C1_lesson_20'; KW.C1['evidence']='C1_lesson_13';
    KW.C1['history']='C1_lesson_22'; KW.C1['geography']='C1_lesson_4';
    KW.C1['finance']='C1_lesson_10'; KW.C1['economics']='C1_lesson_10';
    KW.C1['idiom']='C1_lesson_4'; KW.C1['colloquial']='C1_lesson_7';
    KW.C1['abstract']='C1_lesson_1'; KW.C1['noun']='C1_lesson_1'; KW.C1['verb']='C1_lesson_1'; KW.C1['adjective']='C1_lesson_1';
    KW.C1['emotion']='C1_lesson_11'; KW.C1['social']='C1_lesson_15';
    KW.C1['health']='C1_lesson_3'; KW.C1['medicine']='C1_lesson_3'; KW.C1['patient']='C1_lesson_3';
    KW.C1['science']='C1_lesson_6'; KW.C1['work']='C1_lesson_10';
    KW.C1['administration']='C1_lesson_1'; KW.C1['admin']='C1_lesson_1';
    KW.C1['personality']='C1_lesson_15'; KW.C1['disaster']='C1_lesson_4';
    KW.C1['family']='C1_lesson_15'; KW.C1['sport']='C1_lesson_5';
    KW.C1['urban']='C1_lesson_18'; KW.C1['housing']='C1_lesson_18';
    KW.C1['time']='C1_lesson_19'; KW.C1['governance']='C1_lesson_18';
    KW.C1['corporate']='C1_lesson_10'; KW.C1['food']='C1_lesson_3';
    KW.C1['innovation']='C1_lesson_6'; KW.C1['planning']='C1_lesson_10';
    KW.C1['quality']='C1_lesson_7'; KW.C1['standard']='C1_lesson_7';

    const lk = KW[level]||{};
    for(const [kw, lid] of Object.entries(lk)) {
      if(tLower.includes(kw)) return lid;
    }
  }
  return null;
}

function findGrammarLessonId(level, obj) {
  const topic = (obj.topic||'').toLowerCase();
  const prompt = (obj.prompt||'').toLowerCase();
  const answer = (obj.answer||'').toLowerCase();
  const combined = topic+' '+prompt+' '+answer;
  const levelMap = GM[level]||[];

  // Try topic+prompt matching against grammar map (normalized)
  const normalized = combined.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for(const m of levelMap) {
    if(m.x.some(k => combined.includes(k) || normalized.includes(k))) return m.id;
  }

  // Fallback: compare with lesson grammarFocus
  const ll = lessonsByLevel[level]||[];
  for(const lesson of ll) {
    const focus = (lesson.grammarFocus||'').toLowerCase();
    // Check for significant overlap: at least 2 keywords matching
    const focusWds = focus.split(/[^a-zäöüß]+/).filter(s=>s.length>3);
    const promptWds = combined.split(/[^a-zäöüß]+/).filter(s=>s.length>3);
    const overlap = promptWds.filter(w => focusWds.includes(w));
    if(overlap.length >= 2) return lesson.id;
  }

  return null;
}

// === Main ===
console.log('=== Curriculum Mapping ===\n');

// Vocab
console.log('--- Vocabulary ---');
const vocab = loadJSON('germanVocabulary.json');
let vm=0, vs=0;
LEVELS.forEach(level => {
  if(level==='A1') return;
  (vocab[level]||[]).forEach(w => {
    if(w.taughtInLessonId) return;
    const lid = findVocabLessonId(w.word||'', level, w);
    if(lid) { w.taughtInLessonId=lid; vm++; }
    else vs++;
  });
});
console.log('  Mapped: '+vm+', Still missing: '+vs);
saveJSON('germanVocabulary.json', vocab);

// Grammar
console.log('\n--- Grammar ---');
const grammar = loadJSON('grammar.json');
let gm2=0, gs=0;
LEVELS.forEach(level => {
  if(level==='A1') return;
  (grammar[level]||[]).forEach(g => {
    if(g.taughtInLessonId) return;
    const lid = findGrammarLessonId(level, g);
    if(lid) { g.taughtInLessonId=lid; gm2++; }
    else gs++;
  });
});
console.log('  Mapped: '+gm2+', Still missing: '+gs);
saveJSON('grammar.json', grammar);

console.log('\n=== Done ===');
