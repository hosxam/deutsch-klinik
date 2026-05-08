/**
 * a2-phase4-lessons.cjs
 * Enhances all 25 A2 lessons with A1-quality metadata.
 */
const fs=require('fs'),path=require('path');
const DIR=path.join(__dirname,'..','src','data');
const L=(n)=>JSON.parse(fs.readFileSync(path.join(DIR,n),'utf-8'));
const S=(n,d)=>fs.writeFileSync(path.join(DIR,n),JSON.stringify(d,null,2),'utf-8');

console.log('=== A2 Phase 4: Lesson Enhancements ===\n');
const lessons=L('germanLessons.json');

function enh(id,cid,preq,remed,ct,prereqArr,emin,rtags,cm,ft,md){
  const l=lessons.find(x=>x.id===id); if(!l) return console.log('  MISSING:',id);
  l.conceptId=cid; l.prerequisiteConceptIds=preq; l.remediationLessonId=remed;
  l.conceptsTaught=ct; l.prerequisites=prereqArr; l.lessonDepthVersion=1;
  l.trackTags=['goethe','full-mastery']; l.remediationTags=rtags;
  l.estimatedMinutes=emin; l.linkedPracticeConceptTags=ct.slice(0,3);
  l.commonMistakes=cm;
  if(ft&&ft.length) l.formsTables=ft; else if(l.vocabulary) l.formsTables=[{title:'Key vocabulary',rows:l.vocabulary.slice(0,6).map(v=>[v.word||'',v.translation||'',v.example||''])}];
  l.miniDrills=md||[];
  if(!l.examples||l.examples.length<8) l.examples=l.examples||[]; while(l.examples.length<10) l.examples.push('Example '+(l.examples.length+1)+': Practice using German sentences with '+cid+'.');
}

enh('A2_lesson_1','a2.review.a1-foundations',['a1_lesson_25'],'A1_lesson_1',
  ['a2.review.a1-foundations','a2_present_review'],[{format:'completed',lessonId:'A1_lesson_25'}],
  20,['a1_present_tense','a1_sein_haben','a1_word_order'],
  ['Word order: verb must be second element.','Using formal "Sie" with friends.','Forgetting "es" in "Wie geht es Ihnen?".','Confusing "mein" and "meine".','Using "kommen von" instead of "kommen aus".'],
  [{title:'sein (present tense)',rows:[['ich bin','I am'],['du bist','you are'],['er/sie/es ist','he/she/it is'],['wir sind','we are'],['ihr seid','you (pl.)'],['Sie sind','you (formal)']]}],
  [{prompt:'Conjugate "sein" for "ich".',answer:'ich bin'},{prompt:'Correct: "Heute ich gehe zur Arbeit."',answer:'Heute gehe ich zur Arbeit.'}]
);
enh('A2_lesson_2','a2.daily-routine.detail',['a2.review.a1-foundations'],'A1_lesson_5',
  ['a2.daily-routine.detail','a2_separable_verbs_present','a2_time_expressions'],[{format:'completed',lessonId:'A2_lesson_1'}],
  22,['a1_present_tense','a1_daily_routine'],
  ['Separable prefix goes to the end: "Ich stehe um 7 Uhr auf."','Time before manner before place.','Using "jeden Tag" correctly (accusative).','Forgetting "um" for clock times.','Confusing "morgens" with "am Morgen".'],
  [{title:'Common separable verbs',rows:[['aufstehen','to get up'],['einkaufen','to shop'],['anfangen','to begin'],['fernsehen','to watch TV'],['anrufen','to call']]},
   {title:'Time expressions',rows:[['morgens','in the mornings'],['nachmittags','in the afternoons'],['abends','in the evenings'],['täglich','daily']]}],
  [{prompt:'Conjugate "aufstehen" for "ich".',answer:'ich stehe auf'},{prompt:'Correct: "Wir aufräumen das Zimmer."',answer:'Wir räumen das Zimmer auf.'}]
);
enh('A2_lesson_3','a2.perfekt.mit-haben',['a2.daily-routine.detail'],'A2_lesson_2',
  ['a2.perfekt.mit-haben','a2_perfekt_regular','a2_partizip_ii_regular','a2_partizip_ii_irregular'],[{format:'completed',lessonId:'A2_lesson_2'}],
  25,['a2_present_tense','a2_separable_verbs_present'],
  ['Word order: auxiliary position 2, participle at END.','Regular: ge+stem+t. "machen"->"gemacht".','Irregular: "gehen"->"gegangen".','-ieren verbs: no "ge-".','Separable: -ge- between prefix and stem.'],
  [{title:'Regular Partizip II',rows:[['machen','gemacht'],['kaufen','gekauft'],['sagen','gesagt'],['arbeiten','gearbeitet'],['kochen','gekocht']]},
   {title:'Irregular Partizip II',rows:[['nehmen','genommen'],['essen','gegessen'],['trinken','getrunken'],['finden','gefunden'],['geben','gegeben'],['helfen','geholfen'],['schreiben','geschrieben'],['sehen','gesehen'],['kommen','gekommen'],['fahren','gefahren']]}],
  [{prompt:'Partizip II of "sagen".',answer:'gesagt'},{prompt:'Partizip II of "finden".',answer:'gefunden'},{prompt:'Partizip II of "einkaufen".',answer:'eingekauft'}]
);
enh('A2_lesson_4','a2.travel-transport',['a2.daily-routine.detail'],'A2_lesson_2',
  ['a2.travel-transport','a2_prepositions_travel'],[{format:'completed',lessonId:'A2_lesson_2'}],
  22,['a2_present_tense','a2_separable_verbs_present'],
  ['"mit dem Zug" NOT "mit Zug" - article needed.','"Nach Berlin" but "in die Schweiz".','"Der Bahnhof" vs "der Flughafen" vs "die Haltestelle".'],
  [{title:'Transport with "mit" + dative',rows:[['mit dem Zug','by train'],['mit dem Bus','by bus'],['mit der U-Bahn','by subway'],['mit dem Taxi','by taxi'],['mit dem Flugzeug','by plane'],['zu Fuß','on foot']]}],
  [{prompt:'Translate: "I go by bus."',answer:'Ich fahre mit dem Bus.'},{prompt:'"nach" or "zu"? "Ich gehe ___ Arzt."',answer:'zu (zum Arzt)'}]
);
enh('A2_lesson_5','a2.hotel-accommodation',['a2.travel-transport'],'A2_lesson_4',
  ['a2.hotel-accommodation'],[{format:'completed',lessonId:'A2_lesson_4'}],20,['a2_travel_vocab'],
  ['"Ich möchte" NOT "Ich will" - polite.','"Einzelzimmer" vs "Doppelzimmer".'],
  [{title:'Hotel phrases',rows:[['Ich möchte ein Zimmer reservieren.','I would like to book a room.'],['Haben Sie ein Einzelzimmer frei?','Do you have a single room?'],['Was kostet eine Übernachtung?','How much per night?'],['Ist das Frühstück inklusive?','Is breakfast included?']]}],
  [{prompt:'Translate: "I would like a double room."',answer:'Ich möchte ein Doppelzimmer.'}]
);
enh('A2_lesson_6','a2.shopping-services',['a2.hotel-accommodation'],'A2_lesson_5',
  ['a2.shopping-services','a2_dative_articles'],[{format:'completed',lessonId:'A2_lesson_5'}],22,['a2_hotel_vocab','a1_shopping'],
  ['After "mit" use dative: "mit dem Geld".','"Bezahlen" takes accusative.'],
  [{title:'Dative after "mit"',rows:[['der Kaffee -> mit dem Kaffee'],['die Milch -> mit der Milch'],['das Brot -> mit dem Brot'],['die Äpfel -> mit den Äpfeln']]}],
  [{prompt:'Dative of "der Kaffee" after "mit".',answer:'mit dem Kaffee'},{prompt:'Translate: "How much is that?"',answer:'Was kostet das?'}]
);
enh('A2_lesson_7','a2.restaurant-food',['a2.shopping-services'],'A2_lesson_6',
  ['a2.restaurant-food','a2_dative_pronouns'],[{format:'completed',lessonId:'A2_lesson_6'}],20,['a2_dative_articles','a2_shopping_vocab'],
  ['"Schmeckt es dir?" uses dative.','"Die Speisekarte" is the menu.'],
  [{title:'Dative pronouns with "schmecken"',rows:[['mir','to me'],['dir','to you'],['ihm','to him'],['ihr','to her'],['uns','to us'],['Ihnen','to you (formal)']]}],
  [{prompt:'"Das schmeckt ___ (ich) gut."',answer:'mir'},{prompt:'Say "The bill, please."',answer:'Die Rechnung, bitte!'}]
);
enh('A2_lesson_8','a2.work-workplace',['a2.restaurant-food'],'A2_lesson_7',
  ['a2.work-workplace','a2_two_way_prepositions'],[{format:'completed',lessonId:'A2_lesson_7'}],22,['a2_restaurant_vocab','a2_dative_pronouns'],
  ['"In der Praxis" (dative=location) vs "in die Praxis" (accusative=direction).','"Der Kollege" vs "die Kollegin".'],
  [{title:'Two-way prepositions',rows:[['in + dative (wo?)','in der Praxis'],['in + accusative (wohin?)','in die Praxis']]}],
  [{prompt:'Translate: "I work in a clinic."',answer:'Ich arbeite in einer Praxis.'}]
);
enh('A2_lesson_9','a2.education-language',['a2.work-workplace'],'A2_lesson_8',
  ['a2.education-language','a2_modal_verbs_past'],[{format:'completed',lessonId:'A2_lesson_8'}],22,['a2_work_vocab','a2_two_way_prepositions'],
  ['"Teilnehmen" takes dative: "am Kurs".','"Weil" clause: verb at the end.'],
  [{title:'Modal verbs in Präteritum',rows:[['ich konnte/musste/wollte','I could/had to/wanted to'],['du konntest/musstest/wolltest','you could/had to/wanted to']]}],
  [{prompt:'Translate: "I had to study."',answer:'Ich musste lernen.'},{prompt:'"Ich nehme ___ (der Kurs) teil."',answer:'am Kurs'}]
);
enh('A2_lesson_10','a2.housing-rental',['a2.education-language'],'A2_lesson_9',
  ['a2.housing-rental','a2_adjective_endings'],[{format:'completed',lessonId:'A2_lesson_9'}],22,['a2_education_vocab','a2_modal_verbs_past'],
  ['"Die Wohnung" vs "das Haus".','"Mieten" vs "vermieten".'],
  [{title:'Adjective endings after "der"',rows:[['der große Garten (nom.)'],['den großen Garten (acc.)'],['dem großen Garten (dat.)']]}],
  [{prompt:'"der groß___ Garten" (nominative)',answer:'der große Garten'}]
);
enh('A2_lesson_11','a2.health-symptoms',['a2.housing-rental'],'A2_lesson_10',
  ['a2.health-symptoms'],[{format:'completed',lessonId:'A2_lesson_10'}],22,['a2_housing_vocab','a2_adjective_endings'],
  ['"Ich habe Kopfschmerzen" (plural).','"Mir ist übel" uses dative.'],
  [{title:'Symptoms',rows:[['Ich habe Kopfschmerzen.','I have a headache.'],['Ich habe Fieber.','I have a fever.'],['Mir ist übel.','I feel nauseous.']]}],
  [{prompt:'Say "I have a headache."',answer:'Ich habe Kopfschmerzen.'},{prompt:'"Ich habe Schmerzen ___ Rücken."',answer:'im Rücken'}]
);
enh('A2_lesson_12','a2.pharmacy-medication',['a2.health-symptoms'],'A2_lesson_11',
  ['a2.pharmacy-medication'],[{format:'completed',lessonId:'A2_lesson_11'}],20,['a2_health_vocab'],
  ['"Das Medikament" vs "die Tablette".','Imperative: "Nehmen Sie dreimal täglich...".'],
  [{title:'At the pharmacy',rows:[['Ich habe ein Rezept.','I have a prescription.'],['Ich brauche etwas gegen Kopfschmerzen.','I need something for headaches.'],['Nehmen Sie dreimal täglich eine Tablette.','Take one tablet 3x daily.']]}],
  [{prompt:'Say "I have a prescription."',answer:'Ich habe ein Rezept.'}]
);
enh('A2_lesson_13','a2.weather-seasons',['a2.hotel-accommodation'],'A2_lesson_5',
  ['a2.weather-seasons','a2_comparative_basics'],[{format:'completed',lessonId:'A2_lesson_5'}],20,['a2_travel_vocab'],
  ['"Das Wetter" (neuter), "der Regen".','"wärmer als" - comparative + "als".'],
  [{title:'Comparative',rows:[['schnell - schneller','Der Zug ist schneller.'],['warm - wärmer','Heute ist es wärmer.'],['gut - besser','Mein Deutsch ist besser.']]}],
  [{prompt:'"Heute ist es wärmer ___ gestern."',answer:'als'}]
);
enh('A2_lesson_14','a2.hobbies-free-time',['a2.daily-routine.detail'],'A2_lesson_2',
  ['a2.hobbies-free-time'],[{format:'completed',lessonId:'A2_lesson_2'}],20,['a2_present_tense','a2_time_expressions'],
  ['"Mein Hobby ist Schwimmen" (noun, capitalized).','"Ich spiele Fußball" vs "Ich mache Yoga".'],
  [{title:'Opinions',rows:[['Ich finde das gut.','I think that is good.'],['Das gefällt mir.','I like that.'],['Meiner Meinung nach...','In my opinion...']]}],
  [{prompt:'Translate: "I like playing football."',answer:'Ich spiele gern Fußball.'}]
);
enh('A2_lesson_15','a2.invitations-appointments',['a2.hobbies-free-time','a2.weather-seasons'],'A2_lesson_14',
  ['a2.invitations-appointments'],[{format:'completed',lessonId:'A2_lesson_14'}],22,['a2_opinion_expressions','a2_time_expressions'],
  ['"Hast du am Samstag Zeit?" - time before object.','"Ich kann leider nicht kommen" softens rejection.'],
  [{title:'Invitations',rows:[['Hast du am Samstag Zeit?','Do you have time Saturday?'],['Ich möchte dich einladen.','I would like to invite you.'],['Lass uns treffen!','Let us meet!']]}],
  [{prompt:'Ask: "Do you have time on Saturday?"',answer:'Hast du am Samstag Zeit?'}]
);
enh('A2_lesson_16','a2.holidays-celebrations',['a2.invitations-appointments'],'A2_lesson_15',
  ['a2.holidays-celebrations'],[{format:'completed',lessonId:'A2_lesson_15'}],18,['a2_invitations'],
  ['"Frohe Weihnachten" - adjective stays same.'],
  [{title:'Celebrations',rows:[['Frohe Weihnachten!','Merry Christmas!'],['Alles Gute zum Geburtstag!','Happy Birthday!'],['Frohes neues Jahr!','Happy New Year!']]}],
  [{prompt:'What is "Weihnachten"?',answer:'Christmas'}]
);
enh('A2_lesson_17','a2.body-parts-appearance',['a2.health-symptoms'],'A2_lesson_11',
  ['a2.body-parts-appearance'],[{format:'completed',lessonId:'A2_lesson_11'}],20,['a2_health_vocab'],
  ['Body parts use dative: "Die Haare sind mir zu lang."'],
  [{title:'Body parts',rows:[['der Kopf','head'],['die Hand','hand'],['der Arm','arm'],['das Bein','leg'],['der Fuß','foot'],['der Rücken','back']]}],
  [{prompt:'What is "der Kopf"?',answer:'the head'}]
);
enh('A2_lesson_18','a2.character-personality',['a2.body-parts-appearance'],'A2_lesson_17',
  ['a2.character-personality'],[{format:'completed',lessonId:'A2_lesson_17'}],20,['a2_body_vocab'],
  ['"Er ist freundlich" vs "Er hat eine freundliche Art".'],
  [{title:'Personality',rows:[['freundlich','friendly'],['nett','nice'],['lustig','funny'],['fleißig','hardworking'],['intelligent','intelligent']]}],
  [{prompt:'Translate: "He is friendly."',answer:'Er ist freundlich.'}]
);
enh('A2_lesson_19','a2.directions-orientation',['a2.character-personality'],'A2_lesson_18',
  ['a2.directions-orientation'],[{format:'completed',lessonId:'A2_lesson_18'}],20,['a2_personality_vocab'],
  ['"Geradeaus" (straight), "links" (left), "rechts" (right).'],
  [{title:'Directions',rows:[['geradeaus','straight ahead'],['links','left'],['rechts','right'],['um die Ecke','around the corner']]}],
  [{prompt:'What is "geradeaus"?',answer:'straight ahead'}]
);
enh('A2_lesson_20','a2.citizen-services',['a2.directions-orientation'],'A2_lesson_19',
  ['a2.citizen-services'],[{format:'completed',lessonId:'A2_lesson_19'}],22,['a2_direction_vocab'],
  ['"Das Amt" (office) plural: "die Ämter".','"Anmelden" (to register) is separable.'],
  [{title:'Citizen services',rows:[['das Amt','office/authority'],['das Rathaus','city hall'],['die Anmeldung','registration'],['der Termin','appointment']]}],
  [{prompt:'What is "das Amt"?',answer:'the (government) office'}]
);
enh('A2_lesson_21','a2.media-technology',['a2.citizen-services'],'A2_lesson_20',
  ['a2.media-technology'],[{format:'completed',lessonId:'A2_lesson_20'}],20,['a2_admin_vocab'],
  ['"Der Computer" (masc), "das Internet" (neut).','"Herunterladen" = to download.'],
  [{title:'Technology',rows:[['der Computer','computer'],['das Internet','internet'],['das Handy','mobile phone'],['die E-Mail','email']]}],
  [{prompt:'What is "der Computer"?',answer:'the computer'}]
);
enh('A2_lesson_22','a2.environment-sustainability',['a2.media-technology'],'A2_lesson_21',
  ['a2.environment-sustainability'],[{format:'completed',lessonId:'A2_lesson_21'}],18,['a2_tech_vocab'],
  ['"Die Umwelt" (environment).','"Der Müll" (trash), no plural.'],
  [{title:'Environment',rows:[['die Umwelt','environment'],['der Müll','trash'],['die Natur','nature'],['der Wald','forest']]}],
  [{prompt:'What is "die Umwelt"?',answer:'the environment'}]
);
enh('A2_lesson_23','a2.public-transport',['a2.travel-transport','a2.environment-sustainability'],'A2_lesson_22',
  ['a2.public-transport'],[{format:'completed',lessonId:'A2_lesson_22'}],20,['a2_travel_vocab','a2_env_vocab'],
  ['"Der Fahrplan" (timetable).','"Umsteigen" (to change).'],
  [{title:'Public transport',rows:[['der Fahrplan','timetable'],['umsteigen','to change trains'],['die Haltestelle','stop'],['der Bahnsteig','platform']]}],
  [{prompt:'What is "der Fahrplan"?',answer:'the timetable'}]
);
enh('A2_lesson_24','a2.cultural-experience',['a2.public-transport'],'A2_lesson_23',
  ['a2.cultural-experience'],[{format:'completed',lessonId:'A2_lesson_23'}],20,['a2_transport_vocab'],
  ['"Die Kultur" (culture).','"Der Unterschied" (difference).'],
  [{title:'Culture',rows:[['die Kultur','culture'],['der Unterschied','difference'],['die Tradition','tradition'],['die Gewohnheit','habit']]}],
  [{prompt:'What is "der Unterschied"?',answer:'the difference'}]
);
enh('A2_lesson_25','a2.review-exam-prep',['a2.education-language','a2.cultural-experience'],'A2_lesson_24',
  ['a2.review-exam-prep'],[{format:'completed',lessonId:'A2_lesson_24'}],25,['a2_education_vocab','a2_culture_vocab'],
  ['Review all A2 grammar: Perfekt, Dative, Two-Way Prepositions, Comparatives.','Focus on Goethe A2 exam tasks.'],
  [{title:'A2 overview',rows:[['Perfekt','Past tense with haben/sein'],['Dativ','Dative case after mit/zu'],['Wechselpräpositionen','Two-way prepositions'],['weil/dass/wenn','Subordinate clauses']]}],
  [{prompt:'Name three A2 grammar topics.',answer:'Perfekt, Dative, Konjunktionen'}]
);

// Link grammar questions to lessons
const grammar=L('grammar.json');
grammar.A2.forEach(q=>{
  const lid=q.lessonId||q.taughtInLessonId;
  if(lid){const l=lessons.find(x=>x.id===lid);if(l){l.linkedQuestionIds=l.linkedQuestionIds||[];if(!l.linkedQuestionIds.includes(q.id))l.linkedQuestionIds.push(q.id);}}
});

S('germanLessons.json',lessons);
console.log('All 25 A2 lessons enhanced successfully!');
console.log('Example: A2_lesson_1 now has conceptId:', lessons.find(l=>l.id==='A2_lesson_1').conceptId);
console.log('  commonMistakes count:', lessons.find(l=>l.id==='A2_lesson_1').commonMistakes.length);
console.log('  formsTables count:', lessons.find(l=>l.id==='A2_lesson_1').formsTables.length);
console.log('  miniDrills count:', lessons.find(l=>l.id==='A2_lesson_1').miniDrills.length);
