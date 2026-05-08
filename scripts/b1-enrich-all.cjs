#!/usr/bin/env node
/**
 * b1-enrich-all.cjs
 * Phase 5 B1 Enrichment: lessons, grammar, reading, listening,
 * writing, speaking, vocabulary fixes, curriculum map updates.
 * Deterministic data only. Preserves all existing data.
 *
 * Run: node scripts/b1-enrich-all.cjs
 * Dry-run: node scripts/b1-enrich-all.cjs --dry-run
 */
const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, '..', 'src', 'data');
const DRY = process.argv.includes('--dry-run');
function rd(f) { return JSON.parse(fs.readFileSync(path.join(D, f), 'utf-8')); }
function wr(f, d) { if(DRY) return console.log('[DRY-RUN] ' + f); fs.writeFileSync(path.join(D, f), JSON.stringify(d, null, 2), 'utf-8'); console.log('Wrote ' + f); }

// Load
const lessons = rd('germanLessons.json');
const grammar = rd('grammar.json');
const reading = rd('reading.json');
const listening = rd('listening.json');
const writing = rd('writing.json');
const speaking = rd('speaking.json');
const vocab = rd('germanVocabulary.json');
const cmap = rd('curriculumMap.json');

console.log('Loaded B1 lessons:' + lessons.filter(l=>l.level==='B1').length +
  ' grammar:' + (grammar.B1||[]).length + ' reading:' + (reading.B1||[]).length +
  ' listening:' + (listening.B1||[]).length + ' writing:' + (writing.B1||[]).length +
  ' speaking:' + (speaking.B1||[]).length + ' vocab:' + (vocab.B1||[]).length);

// ====================================================================
// 4a. LESSON ENRICHMENT
// ====================================================================
console.log('\n=== 4a. Enriching Lessons ===');

// Build conceptId map lesson->conceptId
const L = {
  B1_lesson_1:{cid:'b1.opinion.media',min:50,pre:['a2.opinions.dass','a2.connectors.weil'],ct:['b1.opinion.media','b1.subordinate.obwohl'],tags:['goethe','telc','opinion','media']},
  B1_lesson_2:{cid:'b1.environment.daily',min:45,pre:['a2.environment.basic','a2.connectors.coordinating'],ct:['b1.environment.daily','b1.connectors.complex','b1.damit.clauses'],tags:['goethe','telc','environment','connectors']},
  B1_lesson_3:{cid:'b1.education.future',min:45,pre:['a2.education.school','a2.comparisons.basic'],ct:['b1.education.system','b1.comparisons.complex','b1.indirect.questions'],tags:['goethe','telc','education','comparison']},
  B1_lesson_4:{cid:'b1.culture.festivals',min:45,pre:['a2.culture.holidays','a2.modal.verbs'],ct:['b1.culture.german.festivals','b1.konjunktiv2.politeness'],tags:['goethe','telc','culture','festivals','konjunktiv']},
  B1_lesson_5:{cid:'b1.technology.future',min:45,pre:['a2.technology.basic','a2.future.tenses'],ct:['b1.future.technology','b1.futur1'],tags:['goethe','telc','technology','future']},
  B1_lesson_6:{cid:'b1.telephone.formal',min:40,pre:['a2.telephone.basic','a2.prateritum.haben.sein'],ct:['b1.telephone.communication','b1.prateritum.haben.sein.modal'],tags:['goethe','telc','telephone','formal','prateritum']},
  B1_lesson_7:{cid:'b1.job.application',min:50,pre:['a2.jobs.professions','a2.formal.letter.basic'],ct:['b1.job.application.formal','b1.formal.letter.complex'],tags:['goethe','telc','job','application','formal-writing']},
  B1_lesson_8:{cid:'b1.social.media',min:45,pre:['a2.social.media.basic','a2.present.passive.basic'],ct:['b1.social.media','b1.passiv.praesens'],tags:['goethe','telc','social-media','media','passive']},
  B1_lesson_9:{cid:'b1.environment.protection',min:45,pre:['a2.environment.action','a2.infinitiv.zu'],ct:['b1.environment.conservation','b1.umzu.clauses'],tags:['goethe','telc','environment','nature','purpose']},
  B1_lesson_10:{cid:'b1.internship',min:45,pre:['a2.work.experience','a2.perfekt.basic'],ct:['b1.internship.experience','b1.perfekt.complex'],tags:['goethe','telc','internship','work','perfekt']},
  B1_lesson_11:{cid:'b1.film.discussion',min:45,pre:['a2.entertainment.hobbies','a2.relative.clauses.basic'],ct:['b1.film.culture','b1.relative.clauses.nom.acc'],tags:['goethe','telc','film','entertainment','relative-clauses']},
  B1_lesson_12:{cid:'b1.nutrition.healthy',min:45,pre:['a2.food.ordering','a2.relative.clauses.nom.acc'],ct:['b1.healthy.nutrition','b1.relative.clauses.dat.gen'],tags:['goethe','telc','nutrition','health','food','relative-clauses']},
  B1_lesson_13:{cid:'b1.future.plans',min:45,pre:['b1.future.technology','b1.futur1'],ct:['b1.future.plans','b1.konjunktiv2.wishes'],tags:['goethe','telc','future','plans','konjunktiv']},
  B1_lesson_14:{cid:'b1.rental.housing',min:50,pre:['a2.housing.vocab','a2.prepositions.basic'],ct:['b1.rental.housing','b1.prepositions.fixed.case'],tags:['goethe','telc','housing','daily-life']},
  B1_lesson_15:{cid:'b1.public.transport',min:45,pre:['a2.travel.vocab','a2.directions'],ct:['b1.public.transport','b1.genitive.intro'],tags:['goethe','telc','transport','daily-life']},
  B1_lesson_16:{cid:'b1.party.social',min:40,pre:['a2.invitations','a2.reflexive.basic'],ct:['b1.party.social','b1.reflexive.verbs.extended'],tags:['goethe','telc','social','party']},
  B1_lesson_17:{cid:'b1.news.understanding',min:50,pre:['b1.social.media','b1.passiv.praesens'],ct:['b1.news.understanding','b1.passiv.prateritum'],tags:['goethe','telc','news','media','passive']},
  B1_lesson_18:{cid:'b1.restaurant.critique',min:45,pre:['a2.restaurant.ordering','a2.complaint.simple'],ct:['b1.restaurant.critique','b1.complaint.formal'],tags:['goethe','telc','restaurant','complaint']},
  B1_lesson_19:{cid:'b1.travel.preparation',min:50,pre:['a2.travel.vocab','b1.public.transport'],ct:['b1.travel.preparation','b1.experience.reports'],tags:['goethe','telc','travel','daily-life']},
  B1_lesson_20:{cid:'b1.volunteering',min:45,pre:['b1.environment.conservation','b1.umzu.clauses'],ct:['b1.volunteering','b1.ohne.zu.anstatt.zu'],tags:['goethe','telc','volunteering','community']},
  B1_lesson_21:{cid:'b1.university.studies',min:55,pre:['b1.education.system','a2.study.vocab'],ct:['b1.university.studies','b1.nominalization'],tags:['goethe','telc','education','university','academic']},
  B1_lesson_22:{cid:'b1.reading.literature',min:45,pre:['b1.film.culture','b1.relative.clauses.nom.acc'],ct:['b1.reading.literature','b1.relative.clauses.wo.was'],tags:['goethe','telc','reading','literature','culture']},
  B1_lesson_23:{cid:'b1.sports.events',min:45,pre:['a2.sports.vocab','a2.hobbies'],ct:['b1.sports.events','b1.written.reports'],tags:['goethe','telc','sports','events']},
  B1_lesson_24:{cid:'b1.traffic.jam',min:40,pre:['b1.public.transport','b1.genitive.intro'],ct:['b1.traffic.jam','b1.adjective.endings.consolidation'],tags:['goethe','telc','traffic','transport','daily-life']},
  B1_lesson_25:{cid:'b1.finance.saving',min:50,pre:['a2.money.vocab','b1.konjunktiv2.wishes'],ct:['b1.finance.saving','b1.konjunktiv2.unreal'],tags:['goethe','telc','finance','saving','konjunktiv']}
};

// Forms tables per lesson
const FT = {
  B1_lesson_1: [
    {form:'Ich finde, dass ...',use:'state opinion with dass-clause',example:'Ich finde, dass die Medien oft uebertreiben.'},
    {form:'..., weil ...',use:'give a reason',example:'Ich lese Nachrichten, weil ich informiert bleiben moechte.'},
    {form:'..., obwohl ...',use:'express contrast',example:'Obwohl es Fake News gibt, vertraue ich Medien.'},
    {form:'Meiner Meinung nach ...',use:'express personal opinion',example:'Meiner Meinung nach sind soziale Medien gefaehrlich.'}
  ],
  B1_lesson_2: [
    {form:'..., um ... zu + Infinitiv',use:'purpose (same subject)',example:'Ich fahre mit dem Bus, um CO2 zu sparen.'},
    {form:'..., damit ...',use:'purpose (diff subject)',example:'Ich trenne Muell, damit die Anlage arbeiten kann.'},
    {form:'..., nicht nur ..., sondern auch ...',use:'add information',example:'Ich spare nicht nur Energie, sondern auch Geld.'},
    {form:'Entweder ... oder ...',use:'alternatives',example:'Entweder wir recyceln oder die Umwelt leidet.'}
  ],
  B1_lesson_3: [
    {form:'so ... wie',use:'positive comparison',example:'Das Gymnasium ist so anspruchsvoll wie die Realschule.'},
    {form:'groesser als / besser als',use:'comparative',example:'Das Abitur ist hoher als der Hauptschulabschluss.'},
    {form:'am groessten / am besten',use:'superlative',example:'Die Universitaet ist die groesste in der Stadt.'},
    {form:'je ..., desto/umso ...',use:'proportional',example:'Je mehr du lernst, desto besser wirst du.'}
  ],
  B1_lesson_4: [
    {form:'Koennten Sie ...?',use:'polite request KII',example:'Koennten Sie mir sagen, wann das Fest beginnt?'},
    {form:'Ich wuerde gern ...',use:'polite wish',example:'Ich wuerde gern mehr ueber Braeuche erfahren.'},
    {form:'Waere es moeglich ...?',use:'polite question',example:'Waere es moeglich, eine Fuehrung zu bekommen?'},
    {form:'Duefte ich ...?',use:'very polite request',example:'Duefte ich ein Foto von der Tradition machen?'}
  ],
  B1_lesson_5: [
    {form:'werden + Infinitiv',use:'future action',example:'Die Technologie wird sich weiterentwickeln.'},
    {form:'werden + Infinitiv (Vermutung)',use:'assumption',example:'Er wird schon zu Hause sein.'},
    {form:'wenn ..., dann ...',use:'conditional future',example:'Wenn die KI sich verbessert, werden Jobs automatisiert.'},
    {form:'bis + Futur',use:'future deadline',example:'Bis 2030 werden die Autos elektrisch sein.'}
  ],
  B1_lesson_6: [
    {form:'Ich hatte ...',use:'Prateritum haben',example:'Ich hatte gestern ein wichtiges Gespraech.'},
    {form:'Ich war ...',use:'Prateritum sein',example:'Ich war den ganzen Tag im Buero.'},
    {form:'Konnten Sie ...?',use:'past ability polite',example:'Konnten Sie mich gestern verstehen?'},
    {form:'Ich musste ...',use:'past necessity',example:'Ich musste die Nachricht weiterleiten.'}
  ],
  B1_lesson_7: [
    {form:'Sehr geehrte Damen und Herren,',use:'formal salutation',example:'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich ...'},
    {form:'Ich bewerbe mich um ...',use:'state position',example:'Ich bewerbe mich um die Stelle als Marketingassistent.'},
    {form:'Ich habe Erfahrung in ...',use:'state experience',example:'Ich habe Erfahrung in der Kundenbetreuung.'},
    {form:'Ueber eine Einladung wuerde ich mich freuen.',use:'polite closing',example:'Ueber eine Einladung wuerde ich mich freuen.'}
  ],
  B1_lesson_8: [
    {form:'wird + Partizip II',use:'Passiv Praesens sing.',example:'Der Beitrag wird geloescht.'},
    {form:'werden + Partizip II',use:'Passiv Praesens pl.',example:'Die Daten werden gespeichert.'},
    {form:'von + Dativ',use:'agent in passive',example:'Das Video wird von Millionen gesehen.'},
    {form:'Es wird ...',use:'impersonal passive',example:'Es wird viel ueber soziale Medien diskutiert.'}
  ],
  B1_lesson_9: [
    {form:'..., um ... zu + Infinitiv',use:'purpose',example:'Wir recyceln, um die Umwelt zu schuetzen.'},
    {form:'..., ohne ... zu + Infinitiv',use:'without doing',example:'Er geht, ohne das Licht auszuschalten.'},
    {form:'Anstatt ... zu + Infinitiv',use:'instead of',example:'Anstatt Auto zu fahren, nimmt er das Fahrrad.'},
    {form:'um ... zu with separable',use:'zu between prefix/verb',example:'..., um richtig mitzumachen.'}
  ],
  B1_lesson_10: [
    {form:'haben + Partizip II',use:'Perfekt with haben',example:'Ich habe ein Praktikum gemacht.'},
    {form:'sein + Partizip II',use:'Perfekt with sein',example:'Ich bin ins Buero gefahren.'},
    {form:'Partizip II separable',use:'prefix + ge- + stem',example:'Ich habe mitgemacht.'},
    {form:'Partizip II irregular',use:'common irregular',example:'Ich habe genommen, geschrieben, gesprochen.'}
  ],
  B1_lesson_11: [
    {form:'der/die/das (Nominativ)',use:'relative subject',example:'Der Film, der gestern lief, war spannend.'},
    {form:'den/die/das (Akkusativ)',use:'relative object',example:'Der Film, den ich sah, war gut.'},
    {form:'Relativpronomen nach Praep.',use:'relative with prep',example:'Der Film, ueber den wir sprachen, laeuft heute.'}
  ],
  B1_lesson_12: [
    {form:'dem/der/denen (Dativ)',use:'relative dative',example:'Der Mann, dem ich half, kocht gern.'},
    {form:'dessen/deren (Genitiv)',use:'relative possessive',example:'Die Frau, deren Kochbuch bekannt ist.'}
  ],
  B1_lesson_13: [
    {form:'Wenn ich ... haette, wuerde ich ...',use:'unreal wish',example:'Wenn ich mehr Zeit haette, wuerde ich reisen.'},
    {form:'Ich wuenschte, ...',use:'wish statement',example:'Ich wuenschte, ich koennte fliegen.'},
    {form:'waere/haette + gern',use:'polite wish',example:'Ich haette gern mehr Urlaub.'}
  ],
  B1_lesson_14: [
    {form:'aus, bei, mit, nach, seit, von, zu',use:'dative prepositions',example:'Ich wohne bei meinen Eltern.'},
    {form:'durch, fuer, gegen, ohne, um',use:'accusative prepositions',example:'Wir kaempfen fuer die Umwelt.'},
    {form:'trotz, wegen, waehrend (Genitiv)',use:'genitive prepositions',example:'Wegen des Larms ziehe ich um.'}
  ],
  B1_lesson_15: [
    {form:'des/der + Nomen + s',use:'genitive possession',example:'Das ist das Auto des Chefs.'},
    {form:'waehrend + Genitiv',use:'during (genitive)',example:'Waehrend des Tages bin ich unterwegs.'}
  ],
  B1_lesson_16: [
    {form:'sich + Akkusativ',use:'reflexive direct',example:'Ich wasche mich.'},
    {form:'sich + Dativ',use:'reflexive indirect',example:'Ich wasche mir die Haende.'},
    {form:'sich-Verben mit Modal',use:'reflexive with modals',example:'Ich kann mich erinnern.'}
  ],
  B1_lesson_17: [
    {form:'wurde + Partizip II',use:'Passiv Prateritum',example:'Der Artikel wurde gestern veroeeffentlicht.'},
    {form:'wurden + Partizip II',use:'Passiv Prateritum pl.',example:'Die Fenster wurden geoeffnet.'}
  ],
  B1_lesson_18: [
    {form:'Ich moechte mich beschweren, weil ...',use:'start complaint',example:'Ich moechte mich beschweren, weil das Essen kalt war.'},
    {form:'Leider war ... nicht zufriedenstellend.',use:'polite criticism',example:'Leider war der Service nicht zufriedenstellend.'}
  ],
  B1_lesson_19: [
    {form:'Ich bin nach/in ... gefahren.',use:'travel destination',example:'Ich bin nach Berlin gefahren.'},
    {form:'Zuerst habe ich ..., dann ...',use:'sequence',example:'Zuerst habe ich das Hotel gebucht, dann den Flug.'}
  ],
  B1_lesson_20: [
    {form:'..., ohne ... zu + Infinitiv',use:'without doing',example:'Er hilft, ohne Geld zu nehmen.'},
    {form:'Anstatt ... zu + Infinitiv',use:'instead of',example:'Anstatt zu klagen, handelt er.'}
  ],
  B1_lesson_21: [
    {form:'das + Verb (nominalisiert)',use:'nominalized verb',example:'Das Lernen macht mir Spass.'},
    {form:'die + Verb + ung',use:'-ung nominalization',example:'Die Prufung findet morgen statt.'}
  ],
  B1_lesson_22: [
    {form:'wo + Praeposition (womit, woran)',use:'wo-compounds',example:'Womit hast du das gemacht?'},
    {form:'was als Relativpronomen',use:'was for alles/nichts',example:'Alles, was ich mag, ist hier.'}
  ],
  B1_lesson_23: [
    {form:'Zuerst ..., dann ..., schliesslich ...',use:'temporal sequence',example:'Zuerst warmlaufen, dann starten.'},
    {form:'Das Spiel endete ...',use:'result statement',example:'Das Spiel endete 3:1.'}
  ],
  B1_lesson_24: [
    {form:'der gute, ein guter, guter',use:'adj endings def/indef/none',example:'Der schnelle Bus, ein schneller Bus, schneller Bus.'},
    {form:'Adjektivendungen im Dativ',use:'dative adjective endings',example:'Mit dem schnellen Bus.'}
  ],
  B1_lesson_25: [
    {form:'Wenn ich Geld haette, wuerde ich ...',use:'unreal condition',example:'Wenn ich Geld haette, wuerde ich reisen.'},
    {form:'Ich wuenschte, ich waere ...',use:'unreal wish',example:'Ich wuenschte, ich waere reich.'}
  ]
};

// Common mistakes per lesson
const CM = {};
CM.B1_lesson_1 = ['dass-clause verb-end: "Ich denke, dass es wichtig ist."','weil verb-end: "weil ich keine Zeit habe."','obwohl verb-final order','"Meiner Meinung nach" verb position 2','Comma before subordinate clauses'];
CM.B1_lesson_2 = ['um...zu same subject only','damit as subordinating conj verb-end','Comma before um...zu/damit','Nicht nur at position 0 then verb-2','Confusing um...zu with zu+infinitive'];
CM.B1_lesson_3 = ['als takes nominative: "groesser als ich"','Je...desto verb-final both clauses','Umlaut in comparatives: gross->groesser','am + -(e)sten for superlative'];
CM.B1_lesson_4 = ['KII politer than Praesens','haette not "haben wuerde"','Modal verbs have own KII forms','No "wuerde" with modals: "ich koennte"'];
CM.B1_lesson_5 = ['werden auxiliary + Inf at end','Praesens OK for planned events','werden to end in Nebensatz','werden auxiliary vs full verb'];
CM.B1_lesson_6 = ['hatte not habte','war not "sein gehabt"','Praet. for haben/sein in writing','Modal Praet.: konnte, musste, sollte','Formal Sie on phone'];
CM.B1_lesson_7 = ['No du in formal letters','Date format TT.MM.JJJJ','Letter starts lowercase after salutation','Betreff without period','Verb-second in main clauses'];
CM.B1_lesson_8 = ['Passiv uses werden not sein','Partizip II at end','Only transitive verbs form passive','In Nebensatz werden before Partizip'];
CM.B1_lesson_9 = ['um...zu same subject only','With separable: zu between prefix/verb','Ohne/Anstatt + zu same subject','Not confusing um...zu with damit'];
CM.B1_lesson_10 = ['Movement verbs use sein','bleiben uses sein','Separable: anrufen->angerufen','Inseparable: no ge- (verstanden)'];
CM.B1_lesson_11 = ['Relative pronoun: gender/number=antecedent, case=function','den (acc m) vs der (nom m)','was for alles/nichts not specific nouns','Comma before relative clause'];
CM.B1_lesson_12 = ['Dativ: dem/der/denen','Genitiv: dessen/deren','Not confusing Dativ Relativ with Demonstrativ','Verb-final in relative clause'];
CM.B1_lesson_13 = ['Simple KII forms preferred: haette not wuerde haben','KII for unreal wishes: Wenn ich Zeit haette','Not indicative for hypothetical'];
CM.B1_lesson_14 = ['Fixed case after prepositions','trotz (gen) vs trotzdem (adv)','wegen + genitive in formal','aus/by/mit + dative'];
CM.B1_lesson_15 = ['Genitive vs vom','Weak masculine: der Herr -> den Herrn','Genitive s for m/n: des Bahnhofs'];
CM.B1_lesson_16 = ['Reflexive pronoun case: mich vs mir','sich required for sich-Verben','sich position with modal verbs'];
CM.B1_lesson_17 = ['wurde gemacht not "ward gemacht"','von + Dativ for agent','Passiv vs Aktiv register choice'];
CM.B1_lesson_18 = ['KII for polite complaints','Formal complaint structure','Avoid overly aggressive criticism'];
CM.B1_lesson_19 = ['nach vs in for destinations','mit dem Zug not bei dem Zug','Time-manner-place word order'];
CM.B1_lesson_20 = ['ohne...zu needs verb complement','anstatt = statt (more formal)','Comma with infinitive clauses'];
CM.B1_lesson_21 = ['Nominalized verbs always neuter','-ung ending feminine','zu+Inf vs nominalized form register'];
CM.B1_lesson_22 = ['was for alles/nichts not specific','wo compounds: womit, woran','Preposition choice in wo-compounds'];
CM.B1_lesson_23 = ['Praet. for past event reports','Temporal sequence words','Perfekt not Praet. in formal written'];
CM.B1_lesson_24 = ['Adj endings: der gute, ein guter, guter','Weak vs mixed declension','Strong after alles/viele/manche'];
CM.B1_lesson_25 = ['KII not indicative for unreal','wuerde + Inf not wuerde + Praet.','haette/waere not hatte/war','Verb-end in wenn-clause then verb-first'];

// Mini-drills per lesson
const MD = {};
MD.B1_lesson_1 = [
  {q:'Ich glaube, ___ Deutsch eine schoene Sprache ist. (dass)',a:'dass'},
  {q:'Ich hoere Podcasts, ___ ich mein Hoerverstaendnis verbessern moechte. (weil)',a:'weil'},
  {q:'___ ich muede bin, gehe ich trotzdem zum Kurs. (obwohl)',a:'Obwohl'},
  {q:'Meiner Meinung ___ ist Social Media problematisch. (nach)',a:'nach'},
  {q:'Er denkt, ___ die Nachrichten nicht objektiv sind. (dass)',a:'dass'}
];
MD.B1_lesson_2 = [
  {q:'Ich kaufe regional, ___ die Umwelt ___ schonen. (um...zu)',a:'um ... zu'},
  {q:'Wir pflanzen Baeume, ___ das Klima sich verbessert. (damit)',a:'damit'},
  {q:'Er faehrt Fahrrad, ___ fit ___ bleiben. (um...zu)',a:'um ... zu'},
  {q:'___ ich Strom, ___ auch Wasser. (nicht nur..., sondern auch)',a:'Nicht nur ... spare, sondern auch'}
];
MD.B1_lesson_3 = [
  {q:'Ein Studium ist ___ anstrengend ___ eine Ausbildung. (so...wie)',a:'so ... wie'},
  {q:'Das Abitur ist ___ (schwer) als der Hauptschulabschluss.',a:'schwerer'},
  {q:'___ mehr Praxis ___ besser die Chancen. (je..., desto)',a:'Je ... desto'},
  {q:'Welches Fach findest du ___ (interessant)? (superlativ)',a:'am interessantesten'}
];
MD.B1_lesson_4 = [
  {q:'___ Sie mir bitte helfen? (koennen KII)',a:'Koennten'},
  {q:'Ich ___ gern ein Ticket kaufen. (moechten KII)',a:'moechte'},
  {q:'___ es moeglich den Termin zu verschieben? (sein KII)',a:'Waere'},
  {q:'Wir ___ gern an der Fuehrung teilnehmen. (wuerden)',a:'wuerden'}
];
MD.B1_lesson_5 = [
  {q:'In Zukunft ___ es mehr Technologie geben. (werden)',a:'wird'},
  {q:'Die Menschen ___ laenger leben. (werden)',a:'werden'},
  {q:'___ du naechstes Jahr studieren? (werden)',a:'Wirst'},
  {q:'Er ___ wahrscheinlich zu spaet kommen. (werden)',a:'wird'}
];
MD.B1_lesson_6 = [
  {q:'Gestern ___ ich einen wichtigen Anruf. (haben Praet.)',a:'hatte'},
  {q:'Wir ___ nicht im Buero. (sein Praet.)',a:'waren'},
  {q:'___ Sie mich verstehen? (koennen Praet.)',a:'Konnten'},
  {q:'Er ___ die Nachricht verstehen. (koennen Praet.)',a:'konnte'}
];
MD.B1_lesson_7 = [
  {q:'___ geehrte Damen und Herren',a:'Sehr'},
  {q:'Ich bewerbe ___ um die Stelle.',a:'mich'},
  {q:'Ich habe Erfahrung ___ der Arbeit. (in)',a:'in'},
  {q:'___ Anschreiben finden Sie den Lebenslauf. (im)',a:'Im'}
];
MD.B1_lesson_8 = [
  {q:'In sozialen Medien ___ viele Fotos ___ (hochladen)',a:'werden ... hochgeladen'},
  {q:'Der Beitrag ___ von der Community ___ (melden)',a:'wird ... gemeldet'},
  {q:'Hier ___ Deutsch ___ (sprechen unpersoenlich)',a:'wird ... gesprochen'},
  {q:'Die Daten ___ regelmaessig ___ (aktualisieren)',a:'werden ... aktualisiert'}
];
MD.B1_lesson_9 = [
  {q:'Wir sparen Energie ___ die Umwelt ___ schuetzen. (um...zu)',a:'um ... zu'},
  {q:'Er faehrt Bus ___ das Klima ___ schonen. (um...zu)',a:'um ... zu'},
  {q:'Sie geht ___ eine Tasche ___ kaufen. (ohne...zu)',a:'ohne ... zu'},
  {q:'___ mit dem Auto zu fahren nimmt er den Zug. (anstatt...zu)',a:'Anstatt ...'}
];
MD.B1_lesson_10 = [
  {q:'Ich ___ ein Praktikum ___ (machen)',a:'habe ... gemacht'},
  {q:'Er ___ nach Berlin ___ (fahren)',a:'ist ... gefahren'},
  {q:'Wir ___ viel ___ (lernen)',a:'haben ... gelernt'},
  {q:'Sie ___ im Team ___ (arbeiten)',a:'hat ... gearbeitet'}
];
MD.B1_lesson_11 = [
  {q:'Der Film ___ gestern lief war super. (Nom mask)',a:'der'},
  {q:'Die Schauspielerin ___ ich toll finde kommt aus FR. (Akk fem)',a:'die'},
  {q:'Das Buch ___ ich gelesen habe war langweilig. (Akk neut)',a:'das'},
  {q:'Der Regisseur ___ einen Oscar gewann ist beruehmt. (Nom mask)',a:'der'}
];
MD.B1_lesson_12 = [
  {q:'Der Freund ___ ich das Rezept gab kocht gern. (Dat mask)',a:'dem'},
  {q:'Die Kollegin ___ ich den Salat empfehle ist Vegi. (Dat fem)',a:'der'},
  {q:'Die Frau ___ Kochbuch beruehmt ist gibt Seminar. (Gen fem)',a:'deren'},
  {q:'Das Restaurant ___ Kueche ausgezeichnet ist liegt Altstadt. (Gen neut)',a:'dessen'}
];
MD.B1_lesson_13 = [
  {q:'Wenn ich mehr Zeit ___. (haben KII)',a:'haette'},
  {q:'Ich ___ gern verreisen. (wuerde)',a:'wuerde'},
  {q:'Wenn ich Geld ___, wuerde ich ein Haus kaufen. (haben KII)',a:'haette'},
  {q:'Ich wuenschte ich ___ jung. (sein KII)',a:'waere'}
];
MD.B1_lesson_14 = [
  {q:'Ich wohne ___ meinen Eltern. (bei + Dativ)',a:'bei'},
  {q:'Das Geschenk ist ___ meinen Freund. (fuer + Akk)',a:'fuer'},
  {q:'___ des Regens gehen wir spazieren. (trotz + Gen)',a:'Trotz'},
  {q:'Ich komme ___ der Arbeit. (von + Dat)',a:'von'}
];
MD.B1_lesson_15 = [
  {q:'Das ist das Auto ___ Chefs. (Gen mask)',a:'des'},
  {q:'___ des Tages bin ich unterwegs. (waehrend Gen)',a:'Waehrend'},
  {q:'Der Preis ___ Tickets ist hoch. (Gen neut)',a:'des'},
  {q:'Die Arbeit ___ Mitarbeiter ist wichtig. (Gen pl)',a:'der'}
];
MD.B1_lesson_16 = [
  {q:'Ich wasche ___ die Haende. (Dativ)',a:'mir'},
  {q:'Er erinnert ___ an den Termin. (Akkusativ)',a:'sich'},
  {q:'Wir freuen ___ auf den Urlaub.',a:'uns'},
  {q:'Sie kaemmt ___ vor dem Spiegel.',a:'sich'}
];
MD.B1_lesson_17 = [
  {q:'Der Artikel ___ gestern ___ (veroeffentlichen Passiv Praet.)',a:'wurde ... veroeffentlicht'},
  {q:'Die Fenster ___ geoeffnet. (werden Praet. pl)',a:'wurden'},
  {q:'Das Haus ___ 1990 ___ (bauen Passiv Praet.)',a:'wurde ... gebaut'}
];
MD.B1_lesson_18 = [
  {q:'Ich moechte ___ beschweren.',a:'mich'},
  {q:'Leider ___ der Service nicht gut. (sein Praet.)',a:'war'},
  {q:'Das Essen ___ kalt. (sein Praet.)',a:'war'},
  ]
MD.B1_lesson_19 = [
  {q:'Ich ___ nach Berlin ___ (fahren Perfekt)',a:'bin ... gefahren'},
  {q:'Zuerst ___ ich das Hotel ___ (buchen)',a:'habe ... gebucht'},
  {q:'Wir ___ im Hotel ___ (sein Perfekt)',a:'sind ... gewesen'},
  {q:'___ hast du den Urlaub ___ (verbringen)',a:'Wie ... verbracht'}
];
MD.B1_lesson_20 = [
  {q:'Er hilft ___ Geld ___ nehmen. (ohne...zu)',a:'ohne ... zu'},
  {q:'___ zu klagen handelt er. (anstatt...zu)',a:'Anstatt ...'},
  {q:'Sie arbeitet ___ eine Pause ___ machen. (ohne...zu)',a:'ohne ... zu'}
];
MD.B1_lesson_21 = [
  {q:'Das ___ macht mir Spass. (lernen, nominalisiert)',a:'Lernen'},
  {q:'Die ___ findet morgen statt. (pruefen, nominalisiert)',a:'Pruefung'},
  {q:'Die ___ des Projekts dauert lange. (durchfuehren)',a:'Durchfuehrung'}
];
MD.B1_lesson_22 = [
  {q:'___ hast du das gemacht? (wo + mit)',a:'Womit'},
  {q:'Alles ___ ich mag ist hier. (was)',a:'was'},
  {q:'___ denkst du? (wo + an)',a:'Woran'},
  {q:'Nichts ___ er sagt ist wahr. (was)',a:'was'}
];
MD.B1_lesson_23 = [
  {q:'___ warmlaufen ___ starten. (zuerst, dann)',a:'Zuerst ... dann'},
  {q:'Das Spiel ___ 3:1. (enden Praet.)',a:'endete'},
  {q:'Die Mannschaft ___ gut ___ (spielen Praet.)',a:'spielte ... gut'}
];
MD.B1_lesson_24 = [
  {q:'Der ___ Bus kommt um 8 Uhr. (schnell)',a:'schnelle'},
  {q:'Ein ___ Bus kommt um 9. (schnell)',a:'schneller'},
  {q:'Mit dem ___ Bus fahren wir. (schnell)',a:'schnellen'},
  {q:'___ alte Auto steht in der Garage. (das)',a:'Das'}
];
MD.B1_lesson_25 = [
  {q:'Wenn ich Geld ___ wuerde ich reisen. (haben KII)',a:'haette'},
  {q:'Ich wuenschte ich ___ reich. (sein KII)',a:'waere'},
  {q:'Wenn ich mehr verdienen ___ koennte ich sparen. (wuerde)',a:'wuerde'},
  {q:'Er ___ gern ein Haus kaufen. (wuerde)',a:'wuerde'}
];

// Linked question IDs per lesson (pulled from B1 grammar)
const LQ = {
  B1_lesson_1:['B1_gr_1','B1_gr_3','B1_gr_5','B1_gr_11','B1_gr_15','B1_gr_28','B1_gr_31','B1_gr_43','B1_gr_22'],
  B1_lesson_2:['B1_gr_7','B1_gr_22','B1_gr_33','B1_gr_35','B1_gr_36'],
  B1_lesson_3:['B1_gr_8','B1_gr_14','B1_gr_18','B1_gr_60','B1_gr_61','B1_gr_62','B1_gr_63','B1_gr_64','B1_gr_65','B1_gr_66'],
  B1_lesson_4:['B1_gr_19','B1_gr_24','B1_gr_38','B1_gr_89','B1_gr_90','B1_gr_91','B1_gr_92','B1_gr_93','B1_gr_94','B1_gr_95','B1_gr_96','B1_gr_97'],
  B1_lesson_5:['B1_gr_9','B1_gr_27','B1_gr_111','B1_gr_112','B1_gr_113','B1_gr_114','B1_gr_115','B1_gr_20'],
  B1_lesson_6:['B1_gr_4','B1_gr_12','B1_gr_23','B1_gr_126','B1_gr_127','B1_gr_128','B1_gr_129','B1_gr_130','B1_gr_131','B1_gr_132'],
  B1_lesson_7:['B1_gr_25','B1_gr_35','B1_gr_42','B1_gr_134','B1_gr_135','B1_gr_136','B1_gr_137'],
  B1_lesson_8:['B1_gr_2','B1_gr_13','B1_gr_29','B1_gr_155','B1_gr_156','B1_gr_157','B1_gr_158','B1_gr_159','B1_gr_160','B1_gr_162'],
  B1_lesson_9:['B1_gr_20','B1_gr_36','B1_gr_175','B1_gr_176','B1_gr_178','B1_gr_179','B1_gr_68','B1_gr_69'],
  B1_lesson_10:['B1_gr_17','B1_gr_26','B1_gr_45','B1_gr_193','B1_gr_194','B1_gr_195','B1_gr_196','B1_gr_197','B1_gr_198'],
  B1_lesson_11:['B1_gr_206','B1_gr_207','B1_gr_208','B1_gr_209'],
  B1_lesson_12:['B1_gr_210','B1_gr_211','B1_gr_212','B1_gr_213','B1_gr_214'],
  B1_lesson_13:['B1_gr_9','B1_gr_24','B1_gr_37'],
  B1_lesson_14:['B1_gr_3','B1_gr_32','B1_gr_44'],
  B1_lesson_15:['B1_gr_6','B1_gr_33','B1_gr_47'],
  B1_lesson_16:['B1_gr_34','B1_gr_40','B1_gr_48'],
  B1_lesson_17:['B1_gr_2','B1_gr_13','B1_gr_29'],
  B1_lesson_18:['B1_gr_25','B1_gr_35','B1_gr_49'],
  B1_lesson_19:['B1_gr_38','B1_gr_43','B1_gr_50'],
  B1_lesson_20:['B1_gr_36','B1_gr_46','B1_gr_14','B1_gr_68'],
  B1_lesson_21:['B1_gr_22','B1_gr_40','B1_gr_46'],
  B1_lesson_22:['B1_gr_1','B1_gr_30','B1_gr_39'],
  B1_lesson_23:['B1_gr_12','B1_gr_23','B1_gr_45'],
  B1_lesson_24:['B1_gr_7','B1_gr_28','B1_gr_47'],
  B1_lesson_25:['B1_gr_24','B1_gr_37','B1_gr_50']
};

// Additional examples per lesson (to reach 10-12 total)
const EX = {
  B1_lesson_1:['Ich bin der Meinung dass Social Media negative Auswirkungen hat.','Was denkst du ueber die aktuelle politische Lage?','Aus meiner Sicht ist die Berichterstattung oft einseitig.','Ich moechte meinen Standpunkt dazu erklaeren.','Glaubst du dass die Nachrichten vertrauenswuerdig sind?','Koennen wir dieses Thema spaeter diskutieren?','Ich bin ueberzeugt dass die Medien objektiv berichten sollten.'],
  B1_lesson_2:['Wir sollten oefter das Fahrrad nehmen um CO2 zu sparen.','Ich trenne meinen Muell damit weniger Abfall verbrannt wird.','Nicht nur Plastik sondern auch Glas kann recycelt werden.','Entweder wir handeln jetzt oder es ist zu spaet.','Je mehr Menschen mitmachen desto besser fuer die Umwelt.'],
  B1_lesson_3:['In Deutschland gibt es verschiedene Schularten.','Das Abitur ist vergleichbar mit dem High-School-Abschluss.','Mein Bruder ist aelter als ich und studiert bereits.','Die Universitaet bietet mehr Kurse an als die Fachhochschule.','Je fleissiger du lernst desto besser werden deine Noten.'],
  B1_lesson_4:['Das Oktoberfest ist das bekannteste deutsche Fest.','Zu Weihnachten feiern die Deutschen mit der Familie.','An Silvester gibt es ein grosses Feuerwerk.','In vielen Regionen Deutschlands gibt es eigene Traditionen.','Koennten Sie mir mehr ueber die Braeuche in Bayern erzaehlen?'],
  B1_lesson_5:['In Zukunft werden Roboter viele Arbeiten uebernehmen.','Wirst du dir ein Elektroauto kaufen?','Die Technologie wird sich in den naechsten Jahren stark veraendern.','Bis 2040 werden die meisten Autos autonom fahren.','Ich glaube dass die Digitalisierung unser Leben verbessern wird.'],
  B1_lesson_6:['Gestern hatte ich ein langes Telefonat mit der Firma.','Ich war letzte Woche auf einer Konferenz in Berlin.','Konnten Sie mich gestern Abend erreichen?','Wir mussten den Termin leider verschieben.','Hatten Sie schon Gelegenheit die Unterlagen zu pruefen?'],
  B1_lesson_7:['Hiermit bewerbe ich mich um die Stelle als Buchhalter.','Im Anhang finden Sie meinen Lebenslauf und meine Zeugnisse.','Ich habe bereits drei Jahre Berufserfahrung in diesem Bereich.','Meine Deutschkenntnisse auf B1-Niveau moechte ich anwenden.','Ueber eine positive Rueckmeldung wuerde ich mich sehr freuen.'],
  B1_lesson_8:['In sozialen Netzwerken werden taeglich Millionen Fotos geteilt.','Der Beitrag wurde von der Community gemeldet.','Persoenliche Daten werden oft ohne Zustimmung gesammelt.','Es wird immer mehr ueber Datenschutz diskutiert.','Fake News werden in sozialen Medien schnell verbreitet.'],
  B1_lesson_9:['Wir pflanzen Baeume um das Klima zu verbessern.','Er geht zur Arbeit zu Fuss um Geld und Energie zu sparen.','Anstatt Plastik zu kaufen benutzt sie Stoffbeutel.','Viele schalten das Licht aus ohne daran zu denken.','Um die Natur zu schuetzen sollten wir weniger Fleisch essen.'],
  B1_lesson_10:['Ich habe im Sommer ein Praktikum bei einer Bank gemacht.','Sie ist jeden Tag mit dem Zug zur Arbeit gefahren.','Hast du schon Erfahrung in einem Buero gesammelt?','Wir haben viel ueber die Arbeitsablaeufe gelernt.','Mein Kollege hat mir bei den ersten Aufgaben geholfen.'],
  B1_lesson_11:['Der Film den ich gestern gesehen habe war sehr emotional.','Die Schauspielerin die in diesem Film mitspielt ist bekannt.','Ein Film der zum Nachdenken anregt gefaellt mir am besten.','Das Drehbuch das der Autor geschrieben hat ist preisgekroent.','Kennst du den Film ueber den alle sprechen?'],
  B1_lesson_12:['Der Salat dem ich Olivenoel hinzugefuegt habe schmeckt besser.','Die Zutaten mit denen ich koche sind alle biologisch.','Der Bauer von dem wir das Gemsue kaufen liefert frisch.','Das Restaurant dessen Speisekarte vegetarisch ist hat tolles Essen.'],
  B1_lesson_13:['Wenn ich mehr Zeit haette wuerde ich ein Instrument lernen.','Ich wuenschte ich koennte naechstes Jahr nach Japan reisen.','Waere ich doch nur frueher aufgestanden.','Haette ich das Ticket doch frueher gebucht.'],
  B1_lesson_14:['Die Wohnung ist laut der Beschreibung sehr modern.','Wegen des Laerms kann ich nicht schlafen.','Ich wohne seit drei Monaten in der neuen Wohnung.','Die Kaution betraegt laut Vertrag drei Kaltmieten.'],
  B1_lesson_15:['Der Fahrpreis des Busses ist gestiegen.','Waehrend der Fahrt kann man lesen.','Die Abfahrt des Zuges verspaetet sich.','Das ist das Ende der Linie.'],
  B1_lesson_16:['Ich freue mich auf die Party naechstes Wochenende.','Wir treffen uns um acht Uhr vor dem Club.','Er aergert sich ueber die laute Musik.','Sie bedankt sich fuer die Einladung.'],
  B1_lesson_17:['Der Praesident wurde gestern im Fernsehen interviewt.','Die neue Bruecke wurde letztes Jahr gebaut.','Die Tuer wurde von einem Mitarbeiter geoeffnet.','Die Verhandlungen wurden erfolgreich abgeschlossen.'],
  B1_lesson_18:['Ich moechte mich ueber das kalte Essen beschweren.','Der Kellner war leider sehr unaufmerksam.','Ich hatte mir mehr von diesem Restaurant versprochen.','Die Suppe war versalzen und das Fleisch zaeh.'],
  B1_lesson_19:['Zuerst habe ich den Flug gebucht dann das Hotel.','Ich bin letztes Jahr nach Oesterreich gefahren.','Am ersten Tag haben wir die Altstadt besichtigt.','Das Essen im Hotel war ausgezeichnet.'],
  B1_lesson_20:['Er engagiert sich ehrenamtlich im Tierschutz.','Ohne eine Gegenleistung zu erwarten hilft sie anderen.','Anstatt zu Hause zu sitzen macht er Strassen sauber.','Viele Menschen spenden Zeit ohne Geld zu nehmen.'],
  B1_lesson_21:['Das Studium an der Universitaet Heidelberg ist anspruchsvoll.','Die Einschreibung erfolgt online ueber das Portal.','Die Vorlesung findet im Hoersaal statt.','Die Zusammenarbeit mit Kommilitonen ist wichtig.'],
  B1_lesson_22:['Das Buch das ich gerade lese ist sehr spannend.','Alles was der Autor schreibt ist lesenswert.','Worueber schreibt der Autor in diesem Kapitel?','Die Geschichte mit der ich mich identifizieren kann ist beruehrend.'],
  B1_lesson_23:['Das Fussballspiel endete 2:1 fuer die Heimmannschaft.','Der Sportler trainierte taeglich fuer den Wettkampf.','Die Zuschauer feierten den Sieg ausgelassen.','Zuerst kam das Aufwaermen dann das Rennen.'],
  B1_lesson_24:['Ich stehe jeden Morgen im Stau auf der A9.','Der oeffentliche Nahverkehr ist eine gute Alternative.','Bei rotem Licht muss man warten.','Die neue Umgehungsstrasse entlastet die Innenstadt.'],
  B1_lesson_25:['Wenn ich mehr Geld haette wuerde ich in eine groessere Wohnung ziehen.','Ich wuenschte ich haette frueher mit dem Sparen angefangen.','Waere ich doch nicht so viel ausgegangen.','Die Inflation hat meine Ersparnisse reduziert.']
};

// ====================================================================
// MAIN EXECUTION
// ====================================================================

// 4a. Apply lesson enrichment
B1lessons = lessons.filter(function(l){return l.level==='B1';});
B1lessons.forEach(function(lesson){
  var lid = lesson.id;
  var m = L[lid];
  if(!m) return;
  lesson.conceptId = m.cid;
  lesson.estimatedMinutes = m.min;
  lesson.prerequisiteConceptIds = m.pre;
  lesson.conceptsTaught = m.ct;
  lesson.trackTags = m.tags;
  lesson.linkedQuestionIds = LQ[lid] || [];
  lesson.lessonDepthVersion = '2.0';
  lesson.commonMistakes = CM[lid] || [];
  lesson.formsTable = FT[lid] || [];
  lesson.miniDrills = (MD[lid]||[]).map(function(x){return {question:x.q,answer:x.a};});
  // Expand examples to 10-12
  var extra = (EX[lid]||[]).slice(0, 8);
  if(lesson.examples.length < 10) {
    var combined = lesson.examples.slice();
    extra.forEach(function(e){
      if(combined.length < 12 && combined.indexOf(e)===-1) combined.push(e);
    });
    lesson.examples = combined.slice(0,12);
  }
  console.log('  Enriched lesson ' + lid + ': ' + lesson.examples.length + ' examples, ' + (lesson.miniDrills.length) + ' drills');
});

// 4b. Enrich grammar items
console.log('\n=== 4b. Enriching Grammar ===');
var grammarTopicCount = {};
B1grammar = grammar.B1;
B1grammar.forEach(function(q){
  // taughtInLessonId
  if(!q.taughtInLessonId) {
    q.taughtInLessonId = getLessonForGrammarTopic(q.topic || '');
  }
  // difficulty
  if(!q.difficulty) {
    q.difficulty = getDifficulty(q.topic || '');
  }
  // skillType
  if(!q.skillType) {
    q.skillType = 'grammar';
  }
  // conceptId based on topic
  if(!q.conceptId) {
    q.conceptId = getConceptIdForGrammarTopic(q.topic || '');
  }
  var t = (q.topic||'unknown').trim();
  grammarTopicCount[t] = (grammarTopicCount[t]||0)+1;
});
console.log('  Grammar topics covered: ' + Object.keys(grammarTopicCount).length);
var assignedG = B1grammar.filter(function(q){return q.taughtInLessonId;}).length;
console.log('  Grammar with taughtInLessonId: ' + assignedG + '/' + B1grammar.length);

// 4c. Enrich reading items
console.log('\n=== 4c. Enriching Reading ===');
B1reading = reading.B1;
B1reading.forEach(function(r){
  r.conceptId = getConceptIdForLesson(r.lessonId);
  r.taughtInLessonId = r.lessonId;
  r.requiredConcepts = getReqConceptsForLesson(r.lessonId);
  // Add missing explanations
  if(r.questions) {
    r.questions.forEach(function(q){
      if(!q.explanation) {
        q.explanation = 'This question tests understanding of the reading passage: "' + r.title + '". Refer to the text to find the correct answer.';
      }
    });
  }
});
console.log('  Reading enriched: ' + B1reading.length + ' items');

// 4d. Enrich listening items
console.log('\n=== 4d. Enriching Listening ===');
B1listening = listening.B1;
B1listening.forEach(function(r){
  r.conceptId = getConceptIdForLesson(r.lessonId);
  r.taughtInLessonId = r.lessonId;
  r.requiredConcepts = getReqConceptsForLesson(r.lessonId);
  if(r.questions) {
    r.questions.forEach(function(q){
      if(!q.explanation) {
        q.explanation = 'This question tests understanding of the listening passage: "' + r.title + '". Listen carefully to find the correct answer.';
      }
    });
  }
});
console.log('  Listening enriched: ' + B1listening.length + ' items');

// 4e. Enrich writing items
console.log('\n=== 4e. Enriching Writing ===');
B1writing = writing.B1;
var writingRubric = [
  {criterion:'Structure',description:'Logical organization and coherence',points:5},
  {criterion:'Content',description:'Relevance and depth of ideas',points:5},
  {criterion:'Language',description:'Grammar, vocabulary, and accuracy',points:5},
  {criterion:'Task Completion',description:'All parts of the task addressed',points:5}
];
B1writing.forEach(function(w){
  var lid = w.lessonId;
  w.conceptId = getConceptIdForLesson(lid);
  w.taughtInLessonId = lid;
  w.requiredConcepts = getReqConceptsForLesson(lid);
  w.rubric = writingRubric;
  // Writing-specific usefulPhrases
  var phrases = getWritingPhrasesByTopic(w.title || '');
  if(!w.usefulPhrases || w.usefulPhrases.length === 0) {
    w.usefulPhrases = phrases;
  }
});
console.log('  Writing enriched: ' + B1writing.length + ' items');

// 4f. Enrich speaking items
console.log('\n=== 4f. Enriching Speaking ===');
B1speaking = speaking.B1;
B1speaking.forEach(function(s){
  var lid = s.lessonId;
  s.conceptId = getConceptIdForLesson(lid);
  s.taughtInLessonId = lid;
  s.requiredConcepts = getReqConceptsForLesson(lid);
  s.rubric = writingRubric;
  if(!s.usefulPhrases || s.usefulPhrases.length === 0) {
    s.usefulPhrases = ['Ich bin der Meinung dass ...','Meiner Erfahrung nach ...'];
  }
});
console.log('  Speaking enriched: ' + B1speaking.length + ' items');

// 4g. Fix missing noun plurals
console.log('\n=== 4g. Fixing Missing Noun Plurals ===');
B1vocab = vocab.B1;
var fixedPlurals = 0;
B1vocab.forEach(function(v){
  if(v.article && !v.plural) {
    // Add sensible plural or '---' for uncountable
    v.plural = guessPlural(v.article, v.word);
    fixedPlurals++;
  }
  // Also add taughtInLessonId from lessonId
  if(v.lessonId && !v.taughtInLessonId) {
    v.taughtInLessonId = v.lessonId;
  }
});
console.log('  Fixed noun plurals: ' + fixedPlurals);

// 4h. Update curriculumMap
console.log('\n=== 4h. Updating Curriculum Map ===');
var cUnits = cmap.units || [];
var updated = 0;
cUnits.forEach(function(u){
  if(u.level !== 'B1' || u.skill !== 'lesson') return;
  var lid = u.id;
  var m = L[lid];
  if(!m) return;
  u.taughtConcepts = m.ct;
  u.requiredConcepts = m.pre || [];
  u.conceptId = m.cid;
  u.estimatedMinutes = m.min;
  u.tags = m.tags;
  updated++;
});
console.log('  Updated curriculum map units: ' + updated);

// Write all files
wr('germanLessons.json', lessons);
wr('grammar.json', grammar);
wr('reading.json', reading);
wr('listening.json', listening);
wr('writing.json', writing);
wr('speaking.json', speaking);
wr('germanVocabulary.json', vocab);
wr('curriculumMap.json', cmap);

console.log('\n=== Enrichment complete! ===');

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

function getConceptIdForGrammarTopic(topic) {
  var t = (topic||'').trim().toLowerCase();
  t = t.replace(/[\\\/]/g,'');
  if(t.indexOf('relative clauses')!==-1) {
    if(t.indexOf('nominative')!==-1) return 'b1.relative.clauses.nom';
    if(t.indexOf('accusative')!==-1) return 'b1.relative.clauses.acc';
    if(t.indexOf('dative')!==-1) return 'b1.relative.clauses.dat';
    return 'b1.relative.clauses.general';
  }
  if(t.indexOf('passive voice present')!==-1||t.indexOf('passiv prasens')!==-1) return 'b1.passiv.praesens';
  if(t.indexOf('passive voice past')!==-1||t.indexOf('passiv prateritum')!==-1) return 'b1.passiv.prateritum';
  if(t.indexOf('konjunktiv')!==-1) {
    if(t.indexOf('hatte')!==-1||t.indexOf('ware')!==-1) return 'b1.konjunktiv2.wishes';
    if(t.indexOf('konnte')!==-1||t.indexOf('musste')!==-1||t.indexOf('sollte')!==-1) return 'b1.konjunktiv2.modal';
    if(t.indexOf('wurde')!==-1||t.indexOf('wuerde')!==-1) return 'b1.konjunktiv2.irreal';
    return 'b1.konjunktiv2.general';
  }
  if(t.indexOf('comparative')!==-1||t.indexOf('superlative')!==-1) return 'b1.comparisons.complex';
  if(t.indexOf('adjective endings')!==-1) {
    if(t.indexOf('nominative')!==-1) return 'b1.adjective.endings.nom';
    if(t.indexOf('accusative')!==-1) return 'b1.adjective.endings.acc';
    if(t.indexOf('dative')!==-1) return 'b1.adjective.endings.dat';
    return 'b1.adjective.endings.general';
  }
  if(t.indexOf('genitive')!==-1||t.indexOf('genitiv')!==-1) return 'b1.genitive.intro';
  if(t.indexOf('reflexive')!==-1) return 'b1.reflexive.verbs.extended';
  if(t.indexOf('preposition')!==-1||t.indexOf('praposition')!==-1) return 'b1.prepositions.fixed.case';
  if(t.indexOf('two-way')!==-1||t.indexOf('wechsel')!==-1) return 'b1.prepositions.two.way';
  if(t.indexOf('pronominal')!==-1) return 'b1.pronominal.adverbs';
  if(t.indexOf('infinitiv')!==-1||t.indexOf('um ... zu')!==-1||t.indexOf('um...zu')!==-1||t.indexOf('brauchen')!==-1) return 'b1.umzu.clauses';
  if(t.indexOf('damit')!==-1) return 'b1.damit.clauses';
  if(t.indexOf('lassen')!==-1) return 'b1.lassen.usage';
  if(t.indexOf('prateritum')!==-1) return 'b1.prateritum.haben.sein.modal';
  if(t.indexOf('participle adjective')!==-1) return 'b1.participle.adjectives';
  if(t.indexOf('n-declension')!==-1||t.indexOf('n-deklination')!==-1) return 'b1.n.declension';
  if(t.indexOf('neben')!==-1) {
    if(t.indexOf('dass')!==-1) return 'b1.subordinate.dass';
    if(t.indexOf('weil')!==-1) return 'b1.subordinate.weil';
    if(t.indexOf('obwohl')!==-1) return 'b1.subordinate.obwohl';
    if(t.indexOf('wenn')!==-1) return 'b1.subordinate.wenn';
    return 'b1.subordinate.clauses';
  }
  if(t.indexOf('cause')!==-1||t.indexOf('consequence')!==-1) return 'b1.connectors.cause.effect';
  if(t.indexOf('contrast')!==-1) return 'b1.connectors.complex';
  if(t.indexOf('temporal')!==-1) return 'b1.temporal.connectors';
  if(t.indexOf('word order')!==-1) return 'b1.word.order.complex';
  if(t.indexOf('sentence transformation')!==-1) return 'b1.sentence.transformation';
  if(t.indexOf('error correction')!==-1||t.indexOf('mixed review')!==-1||t.indexOf('mixed b1 review')!==-1) return 'b1.mixed.review';
  if(t.indexOf('formal request')!==-1||t.indexOf('formal req')!==-1) return 'b1.konjunktiv2.politeness';
  if(t.indexOf('indirect question')!==-1) return 'b1.indirect.questions';
  if(t.indexOf('verbs with prepositions')!==-1||t.indexOf('verb with prep')!==-1) return 'b1.prepositions.fixed.case';
  if(t.indexOf('pronouns')!==-1) return 'b1.pronouns.general';
  return 'b1.grammar.general';
}

function getLessonForGrammarTopic(topic) {
  var t = (topic||'').trim().toLowerCase();
  if(t.indexOf('relative')!==-1 && t.indexOf('nominative')!==-1) return 'B1_lesson_11';
  if(t.indexOf('relative')!==-1 && (t.indexOf('accusative')!==-1||t.indexOf('dative')!==-1)) return 'B1_lesson_12';
  if(t.indexOf('relative')!==-1 && (t.indexOf('wo')!==-1||t.indexOf('was')!==-1)) return 'B1_lesson_22';
  if(t.indexOf('relative')!==-1||t.indexOf('relativ')!==-1) return 'B1_lesson_11';
  if(t.indexOf('passive voice present')!==-1||t.indexOf('passiv prasens')!==-1) return 'B1_lesson_8';
  if(t.indexOf('passive voice past')!==-1||t.indexOf('passiv prateritum')!==-1) return 'B1_lesson_17';
  if(t.indexOf('passiv')!==-1||t.indexOf('passive')!==-1) return 'B1_lesson_8';
  if(t.indexOf('konjunktiv')!==-1&&(t.indexOf('hatte')!==-1||t.indexOf('ware')!==-1||t.indexOf('konnte')!==-1||t.indexOf('musste')!==-1||t.indexOf('sollte')!==-1||t.indexOf('wurde')!==-1)) return 'B1_lesson_13';
  if(t.indexOf('konjunktiv')!==-1&&(t.indexOf('polite')!==-1||t.indexOf('hoflich')!==-1)) return 'B1_lesson_4';
  if(t.indexOf('konjunktiv')!==-1&&(t.indexOf('unreal')!==-1||t.indexOf('irreal')!==-1)) return 'B1_lesson_25';
  if(t.indexOf('konjunktiv')!==-1||t.indexOf('konnte')!==-1||t.indexOf('wurde')!==-1) return 'B1_lesson_13';
  if(t.indexOf('futur')!==-1) return 'B1_lesson_5';
  if(t.indexOf('prateritum')!==-1) return 'B1_lesson_6';
  if(t.indexOf('perfekt')!==-1||t.indexOf('perfect')!==-1) return 'B1_lesson_10';
  if(t.indexOf('genitiv')!==-1||t.indexOf('genitive')!==-1) return 'B1_lesson_15';
  if(t.indexOf('praposition')!==-1||t.indexOf('preposition')!==-1) return 'B1_lesson_14';
  if(t.indexOf('two-way')!==-1||t.indexOf('wechsel')!==-1) return 'B1_lesson_14';
  if(t.indexOf('infinitiv')!==-1||t.indexOf('um ... zu')!==-1||t.indexOf('um...zu')!==-1) return 'B1_lesson_9';
  if(t.indexOf('brauchen')!==-1||t.indexOf('lassen')!==-1) return 'B1_lesson_9';
  if(t.indexOf('adjective ending')!==-1||t.indexOf('adjektiv')!==-1||t.indexOf('participle adjective')!==-1) return 'B1_lesson_24';
  if(t.indexOf('reflexiv')!==-1) return 'B1_lesson_16';
  if(t.indexOf('n-declension')!==-1||t.indexOf('n-deklination')!==-1) return 'B1_lesson_16';
  if(t.indexOf('nominalis')!==-1) return 'B1_lesson_21';
  if(t.indexOf('connector')!==-1||t.indexOf('konjunktion')!==-1||t.indexOf('dass')!==-1||t.indexOf('weil')!==-1||t.indexOf('obwohl')!==-1||t.indexOf('wenn')!==-1) return 'B1_lesson_1';
  if(t.indexOf('temporal')!==-1||t.indexOf('contrast')!==-1||t.indexOf('cause')!==-1) return 'B1_lesson_1';
  if(t.indexOf('word order')!==-1||t.indexOf('sentence transformation')!==-1) return 'B1_lesson_1';
  if(t.indexOf('damit')!==-1) return 'B1_lesson_2';
  if(t.indexOf('pronominal')!==-1||t.indexOf('pronoun')!==-1) return 'B1_lesson_14';
  if(t.indexOf('error')!==-1||t.indexOf('mixed review')!==-1) return 'B1_lesson_25';
  if(t.indexOf('comparative')!==-1||t.indexOf('superlative')!==-1) return 'B1_lesson_3';
  if(t.indexOf('indirect question')!==-1) return 'B1_lesson_3';
  if(t.indexOf('formal request')!==-1||t.indexOf('formal req')!==-1) return 'B1_lesson_4';
  return 'B1_lesson_1';
}

function getDifficulty(topic) {
  var t = (topic||'').trim().toLowerCase();
  if(t.indexOf('prateritum')!==-1&&t.indexOf('modal')===-1) return 'easy';
  if(t.indexOf('perfekt')!==-1) return 'easy';
  if(t.indexOf('futur')!==-1) return 'easy';
  if(t.indexOf('comparative')!==-1) return 'easy';
  if(t.indexOf('connector')!==-1||t.indexOf('cause')!==-1||t.indexOf('temporal')!==-1) return 'easy';
  if(t.indexOf('genitiv')!==-1||t.indexOf('genitive')!==-1) return 'hard';
  if(t.indexOf('n-declension')!==-1) return 'hard';
  if(t.indexOf('participle adjective')!==-1) return 'hard';
  if(t.indexOf('nominalis')!==-1) return 'hard';
  if(t.indexOf('pronominal')!==-1) return 'hard';
  if(t.indexOf('sentence transformation')!==-1) return 'hard';
  if(t.indexOf('error')!==-1||t.indexOf('mixed review')!==-1) return 'hard';
  if(t.indexOf('word order complex')!==-1) return 'hard';
  return 'medium';
}

function getConceptIdForLesson(lid) {
  var m = L[lid];
  return m ? m.cid : 'b1.general';
}

function getReqConceptsForLesson(lid) {
  var m = L[lid];
  return m ? (m.pre || []) : [];
}

function guessPlural(article, word) {
  if(!article) return word + 's'; // fallback
  // Simple rules for common B1 patterns
  var lower = word.toLowerCase();
  // Uncountable or abstract
  var uncountable = ['.tion','.ismus','.ik','-en','das wasser','das bier','das brot','das geld','das obst','das gemuese','das fleisch','der reis','der zucker','das chaos','das wetter','das glueck','das pech','der regen','der schnee','der wind','der laerm','der hunger','der durst','die gesundheit','die liebe','die musik','die arbeit','die information','die wissenschaft','die natur','die erde','die luft'];
  for(var i=0;i<uncountable.length;i++){
    if(lower.indexOf(uncountable[i])!==-1) return '---';
  }
  // -e ending feminin
  if(article==='die' && word.match(/e$/)) return word + 'n';
  // -ung, -heit, -keit, -schaft
  if(article==='die' && word.match(/(ung|heit|keit|schaft)$/)) return word.replace(/(ung|heit|keit|schaft)$/, function(m){return m+'en';});
  // maskulin -er, -el, -en
  if(article==='der' && word.match(/(er|el|en)$/)) return word + (word.match(/er$/)?'':(word.match(/el$/)?'n':''));
  // neutral -chen, -lein always same
  if(word.match(/(chen|lein)$/)) return word;
  // default: add -e with umlaut where possible
  if(article==='der') {
    // Try umlaut + e
    var umlauted = word.replace(/a/g,'ae').replace(/o/g,'oe').replace(/u/g,'ue').replace(/au/g,'au'); // already replaced
    // actually just use standard patterns
    if(word.match(/[aou]/)) {
      // Simple vowel umlaut mapping
      return word.replace(/a/g,'a'+String.fromCharCode(776)).replace(/o/g,'o'+String.fromCharCode(776)).replace(/u/g,'u'+String.fromCharCode(776)) + 'e';
    }
    return word + 'e';
  }
  if(article==='die') return word + 'n';
  if(article==='das') return word + 'er';
  return word + 'e';
}

function getWritingPhrasesByTopic(title) {
  var t = (title||'').toLowerCase();
  if(t.indexOf('bewerbung')!==-1||t.indexOf('stelle')!==-1||t.indexOf('job')!==-1) {
    return ['Ich bin sehr motiviert und moechte mich in diesem Bereich weiterentwickeln.','Ueber eine Einladung zu einem Vorstellungsgespraech wuerde ich mich freuen.'];
  }
  if(t.indexOf('beschwerde')!==-1||t.indexOf('reklamation')!==-1) {
    return ['Ich moechte mich hoeflich aber deutlich ueber folgendes beschweren.','Ich erwarte Ihre Stellungnahme bis zum naechsten Freitag.'];
  }
  if(t.indexOf('meinung')!==-1||t.indexOf('pro und contra')!==-1||t.indexOf('diskussion')!==-1) {
    return ['Meiner Meinung nach gibt es sowohl Vor- als auch Nachteile.','Einerseits ... andererseits muss man auch bedenken dass ...'];
  }
  if(t.indexOf('email')!==-1||t.indexOf('e-mail')!==-1||t.indexOf('brief')!==-1) {
    return ['Mit freundlichen Gruessen','Ich bedanke mich im Voraus fuer Ihre Bemuehungen.'];
  }
  return ['Ich bin der Meinung dass ...','Ich wuerde mich freuen bald von Ihnen zu hoeren.'];
}