/**
 * a2-phase4-enhancer.cjs
 * 
 * Phase 4: Complete and deepen A2 curriculum quality.
 * Adds A1-quality structure/metadata to ALL A2 content.
 * 
 * Run: node scripts/a2-phase4-enhancer.cjs
 */

const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'src', 'data');

function load(name) { return JSON.parse(fs.readFileSync(path.join(DIR, name), 'utf-8')); }
function save(name, data) { fs.writeFileSync(path.join(DIR, name), JSON.stringify(data, null, 2), 'utf-8'); }

// ============================================================================
// HELPER: Next available IDs
// ============================================================================
let nextVId = 502; function nextVocabId() { return `A2_v${String(nextVId++).padStart(3,'0')}`; }
let nextGId = 199; function nextGramId() { return `A2_gr_${nextGId++}`; }

// ============================================================================
// PART 1: ENHANCE ALL 25 A2 LESSONS with A1-quality metadata
// ============================================================================
console.log('=== PART 1: Enhancing A2 Lessons ===');

const lessons = load('germanLessons.json');

const lessonEnhancements = {
  'A2_lesson_1': {
    conceptId: 'a2.review.a1-foundations',
    prerequisiteConceptIds: ['a1_lesson_25'],
    remediationLessonId: 'A1_lesson_1',
    conceptsTaught: ['a2.review.a1-foundations', 'a2_present_review'],
    prerequisites: [{ format: 'completed', lessonId: 'A1_lesson_25' }],
    lessonDepthVersion: 1, trackTags: ['goethe', 'full-mastery'],
    remediationTags: ['a1_present_tense', 'a1_sein_haben', 'a1_word_order'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a1_present_tense', 'a1_sein_haben', 'a1_word_order'],
    commonMistakes: [
      'Word order: verb must be second element. "Heute ich gehe" is wrong, it must be "Heute gehe ich".',
      'Using formal "Sie" with friends. Use "du" with people you know well.',
      'Forgetting "es" in "Wie geht es Ihnen?" - "Wie geht Ihnen?" is incomplete.',
      'Confusing "mein" and "meine" - gender and case matter (mein Vater, meine Mutter).',
      'Using "kommen von" instead of "kommen aus" for origin. "Ich komme aus Ägypten, nicht von Ägypten."'
    ],
    formsTables: [
      { title: 'sein (present tense)', rows: [
        ['ich bin','I am','Ich bin Arzt.'],['du bist','you are','Du bist Student.'],
        ['er/sie/es ist','he/she/it is','Er ist in der Klinik.'],['wir sind','we are','Wir sind bereit.'],
        ['ihr seid','you (pl.) are','Ihr seid müde.'],['sie sind','they are','Sie sind freundlich.'],
        ['Sie sind','you (formal) are','Sind Sie Herr Müller?']
      ]},
      { title: 'Word order: verb second position', rows: [
        ['Ich heiße Maria.','Subject first, verb second','Simple statement'],
        ['Heute gehe ich einkaufen.','Time first, verb second, subject third','Time element first'],
        ['Im Krankenhaus arbeitet ein Arzt.','Place first, verb second','Place element first']
      ]}
    ],
    miniDrills: [
      { prompt: 'Conjugate "sein" for "ich".', answer: 'ich bin' },
      { prompt: 'Conjugate "haben" for "Sie" (formal).', answer: 'Sie haben' },
      { prompt: 'Correct: "Heute ich gehe zur Arbeit."', answer: 'Heute gehe ich zur Arbeit.' },
      { prompt: 'Translate: "Where do you come from?" (formal)', answer: 'Woher kommen Sie?' }
    ]
  },
  'A2_lesson_2': {
    conceptId: 'a2.daily-routine.detail',
    prerequisiteConceptIds: ['a2.review.a1-foundations'],
    remediationLessonId: 'A1_lesson_5',
    conceptsTaught: ['a2.daily-routine.detail','a2_separable_verbs_present','a2_time_expressions'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_1' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a1_present_tense','a1_daily_routine'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_separable_verbs_present','a2_time_expressions'],
    commonMistakes: [
      'Separable prefix goes to the end: "Ich stehe um 7 Uhr auf." NOT "Ich aufstehe um 7 Uhr."',
      'Time before manner before place: "Ich fahre morgens mit dem Bus zur Arbeit."',
      'Using "jeden Tag" correctly (accusative, not "jeder Tag").',
      'Forgetting "um" for clock times: "um 8 Uhr" not just "8 Uhr".',
      'Confusing "morgens" (every morning) with "am Morgen" (a specific morning).'
    ],
    formsTables: [
      { title: 'Common separable prefix verbs', rows: [
        ['aufstehen','to get up','Ich stehe um 7 Uhr auf.'],['einkaufen','to shop','Wir kaufen am Samstag ein.'],
        ['anfangen','to begin','Der Kurs fängt um 9 Uhr an.'],['mitkommen','to come along','Kommst du mit?'],
        ['fernsehen','to watch TV','Er sieht abends fern.'],['aufräumen','to tidy up','Ich räume mein Zimmer auf.'],
        ['anrufen','to call','Ruf mich morgen an!']
      ]},
      { title: 'Time expressions', rows: [
        ['morgens','in the mornings','Morgens dusche ich.'],['vormittags','in the late morning','Vormittags arbeite ich.'],
        ['mittags','at noon','Mittags esse ich.'],['nachmittags','in the afternoon','Nachmittags lerne ich.'],
        ['abends','in the evening','Abends sehe ich fern.'],['nachts','at night','Nachts schlafe ich.'],
        ['täglich','daily','Ich lerne täglich Vokabeln.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Conjugate "aufstehen" for "ich".', answer: 'ich stehe auf' },
      { prompt: 'Correct: "Wir aufräumen das Zimmer."', answer: 'Wir räumen das Zimmer auf.' },
      { prompt: 'Translate: "I watch TV in the evening."', answer: 'Ich sehe abends fern.' },
      { prompt: 'Order: morgens / fahre / mit dem Bus / ich / zur Arbeit', answer: 'Morgens fahre ich mit dem Bus zur Arbeit.' }
    ]
  },
  'A2_lesson_3': {
    conceptId: 'a2.perfekt.mit-haben',
    prerequisiteConceptIds: ['a2.daily-routine.detail'],
    remediationLessonId: 'A2_lesson_2',
    conceptsTaught: ['a2.perfekt.mit-haben','a2_perfekt_regular','a2_partizip_ii_regular','a2_partizip_ii_irregular'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_2' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_present_tense','a2_separable_verbs_present'],
    estimatedMinutes: 25,
    linkedPracticeConceptTags: ['a2_perfekt_regular','a2_perfekt_irregular'],
    commonMistakes: [
      'Word order: auxiliary in position 2, participle at the END: "Ich habe gestern gearbeitet."',
      'Regular participles: ge + stem + t. "machen" -> "gemacht", NOT "gemachen".',
      'Irregular participles: "gehen" -> "gegangen", NOT "geht".',
      'Verbs ending in -ieren: no "ge-". "studieren" -> "studiert", NOT "gestudiert".',
      'Separable verbs: -ge- between prefix and stem. "einkaufen" -> "eingekauft".'
    ],
    formsTables: [
      { title: 'Regular Partizip II', rows: [
        ['machen','gemacht','Ich habe das Essen gemacht.'],['kaufen','gekauft','Wir haben Brot gekauft.'],
        ['sagen','gesagt','Er hat die Wahrheit gesagt.'],['arbeiten','gearbeitet','Ich habe gestern gearbeitet.'],
        ['kochen','gekocht','Sie hat Suppe gekocht.'],['lernen','gelernt','Ich habe Deutsch gelernt.']
      ]},
      { title: 'Common irregular Partizip II', rows: [
        ['nehmen','genommen','Ich habe die Tablette genommen.'],['essen','gegessen','Wir haben gut gegessen.'],
        ['trinken','getrunken','Er hat viel Wasser getrunken.'],['finden','gefunden','Ich habe den Schlüssel gefunden.'],
        ['geben','gegeben','Der Arzt hat ein Rezept gegeben.'],['helfen','geholfen','Die Schwester hat mir geholfen.'],
        ['schreiben','geschrieben','Ich habe eine E-Mail geschrieben.'],['sehen','gesehen','Haben Sie den Arzt gesehen?'],
        ['kommen','gekommen','Er ist gestern gekommen.'],['fahren','gefahren','Ich bin nach Berlin gefahren.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Form Partizip II of "sagen".', answer: 'gesagt' },
      { prompt: 'Form Partizip II of "finden".', answer: 'gefunden' },
      { prompt: 'Correct: "Ich habe gestern studiert Medizin."', answer: 'Ich habe gestern Medizin studiert.' },
      { prompt: 'Partizip II of "einkaufen".', answer: 'eingekauft' },
      { prompt: 'Translate: "I ate breakfast."', answer: 'Ich habe gefrühstückt.' }
    ]
  },
  'A2_lesson_4': {
    conceptId: 'a2.travel-transport',
    prerequisiteConceptIds: ['a2.daily-routine.detail'],
    remediationLessonId: 'A2_lesson_2',
    conceptsTaught: ['a2.travel-transport','a2_prepositions_travel'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_2' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_present_tense','a2_separable_verbs_present'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_travel_vocab','a2_prepositions_travel'],
    commonMistakes: [
      '"Ich fahre mit dem Zug" NOT "mit Zug" - article needed.',
      '"Nach Berlin" (cities) but "in die Schweiz" (countries with article).',
      '"Reise" is noun (die Reise). Verb is "reisen": "Ich reise gern."',
      '"Der Bahnhof" (station) vs "der Flughafen" (airport) vs "die Haltestelle" (stop).'
    ],
    formsTables: [
      { title: 'Means of transport with "mit" + dative', rows: [
        ['mit dem Zug','by train','Ich fahre mit dem Zug nach München.'],
        ['mit dem Bus','by bus','Die Schüler fahren mit dem Bus zur Schule.'],
        ['mit der U-Bahn','by subway','Fahren Sie mit der U-Bahn zum Zentrum.'],
        ['mit dem Taxi','by taxi','Wir fahren mit dem Taxi zum Flughafen.'],
        ['mit dem Flugzeug','by plane','Er fliegt mit dem Flugzeug nach Berlin.'],
        ['mit dem Fahrrad','by bicycle','Ich fahre mit dem Fahrrad zur Arbeit.'],
        ['zu Fuß','on foot','Ich gehe zu Fuß zum Bahnhof.']
      ]},
      { title: 'Directions with "nach" and "zu"', rows: [
        ['nach Berlin fahren','to go to Berlin'],['zum Bahnhof gehen','to go to the station'],
        ['zur Post gehen','to go to the post office'],['in die Stadt fahren','to go to the city center'],
        ['nach Hause gehen','to go home'],['zu Hause sein','to be at home']
      ]}
    ],
    miniDrills: [
      { prompt: 'Translate: "I go by bus."', answer: 'Ich fahre mit dem Bus.' },
      { prompt: '"nach" or "zu"? "Ich gehe ___ Arzt."', answer: 'zu (zum Arzt)' },
      { prompt: 'Translate: "to the train station"', answer: 'zum Bahnhof' },
      { prompt: 'Correct: "Ich fahre in Berlin." (meaning TO Berlin)', answer: 'Ich fahre nach Berlin.' }
    ]
  },
  'A2_lesson_5': {
    conceptId: 'a2.hotel-accommodation',
    prerequisiteConceptIds: ['a2.travel-transport'],
    remediationLessonId: 'A2_lesson_4',
    conceptsTaught: ['a2.hotel-accommodation'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_4' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_travel_vocab','a2_present_tense'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a2_hotel_vocab'],
    commonMistakes: [
      '"Ich möchte" NOT "Ich will" - "möchte" is more polite.',
      '"Einzelzimmer" (single) vs "Doppelzimmer" (double) are distinct words.',
      '"Das Frühstück ist inklusive" not "inkludiert" (Anglicism).'
    ],
    formsTables: [
      { title: 'Hotel phrases', rows: [
        ['Ich möchte ein Zimmer reservieren.','I would like to book a room.'],
        ['Haben Sie ein Einzelzimmer frei?','Do you have a single room?'],
        ['Was kostet eine Übernachtung?','How much is one night?'],
        ['Ist das Frühstück inklusive?','Is breakfast included?'],
        ['Kann ich bar bezahlen?','Can I pay cash?'],['Die Rechnung, bitte.','The bill, please.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Translate: "I would like a double room."', answer: 'Ich möchte ein Doppelzimmer.' },
      { prompt: 'Ask if breakfast is included.', answer: 'Ist das Frühstück inklusive?' }
    ]
  },
  'A2_lesson_6': {
    conceptId: 'a2.shopping-services',
    prerequisiteConceptIds: ['a2.hotel-accommodation'],
    remediationLessonId: 'A2_lesson_5',
    conceptsTaught: ['a2.shopping-services','a2_dative_articles'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_5' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_hotel_vocab','a1_shopping'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_shopping_vocab','a2_dative_articles'],
    commonMistakes: [
      'After "mit" and "von" use dative: "mit dem Geld" not "mit das Geld".',
      '"Bezahlen" takes accusative: "Ich bezahle den Einkauf."',
      '"Kostet" (sg) vs "kosten" (pl): "Was kostet das?" vs "Was kosten die Äpfel?"'
    ],
    formsTables: [
      { title: 'Dative after "mit"', rows: [
        ['der Kaffee -> mit dem Kaffee','Ich bezahle mit dem Kaffee.'],
        ['die Milch -> mit der Milch','Mit der Milch, bitte.'],
        ['das Brot -> mit dem Brot','Mit dem Brot, bitte.'],
        ['die Äpfel (pl) -> mit den Äpfeln','Helfen Sie mir mit den Äpfeln?']
      ]},
      { title: 'Shopping phrases', rows: [
        ['Ich möchte...','I would like...'],['Was kostet das?','How much is that?'],
        ['Das ist zu teuer.','That is too expensive.'],['Ich nehme das.','I will take that.'],
        ['Kann ich mit Karte bezahlen?','Can I pay by card?']
      ]}
    ],
    miniDrills: [
      { prompt: 'Dative of "der Kaffee" after "mit".', answer: 'mit dem Kaffee' },
      { prompt: 'Translate: "How much is that?"', answer: 'Was kostet das?' }
    ]
  },
  'A2_lesson_7': {
    conceptId: 'a2.restaurant-food',
    prerequisiteConceptIds: ['a2.shopping-services'],
    remediationLessonId: 'A2_lesson_6',
    conceptsTaught: ['a2.restaurant-food','a2_dative_pronouns'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_6' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_dative_articles','a2_shopping_vocab'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a2_food_vocab','a2_dative_pronouns'],
    commonMistakes: [
      '"Schmeckt es dir?" uses dative (dir), not accusative (dich).',
      '"Das schmeckt mir gut." - "mir" is dative, "to me".',
      '"Die Speisekarte" is the menu, not "das Menu" (set meal).'
    ],
    formsTables: [
      { title: 'Restaurant phrases', rows: [
        ['Ich hätte gern...','I would like (polite)...'],['Könnte ich die Speisekarte haben?','Could I have the menu?'],
        ['Was empfehlen Sie?','What do you recommend?'],['Schmeckt es Ihnen?','Do you like it?'],
        ['Es hat sehr gut geschmeckt.','It was very tasty.'],['Die Rechnung, bitte!','The bill, please!']
      ]},
      { title: 'Dative pronouns with "schmecken"', rows: [
        ['mir','to me','Das schmeckt mir gut.'],['dir','to you (inf.)','Schmeckt dir die Suppe?'],
        ['ihm','to him','Der Salat schmeckt ihm nicht.'],['ihr','to her','Der Wein schmeckt ihr.'],
        ['uns','to us','Das Essen schmeckt uns.'],['Ihnen','to you (formal)','Schmeckt es Ihnen?']
      ]}
    ],
    miniDrills: [
      { prompt: 'Complete: "Das schmeckt ___ (ich) sehr gut."', answer: 'mir' },
      { prompt: 'Say "The bill, please."', answer: 'Die Rechnung, bitte!' }
    ]
  },
  'A2_lesson_8': {
    conceptId: 'a2.work-workplace',
    prerequisiteConceptIds: ['a2.restaurant-food'],
    remediationLessonId: 'A2_lesson_7',
    conceptsTaught: ['a2.work-workplace','a2_two_way_prepositions'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_7' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_restaurant_vocab','a2_dative_pronouns'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_work_vocab','a2_two_way_prepositions'],
    commonMistakes: [
      '"In der Praxis" (dative = location) vs "in die Praxis" (accusative = direction).',
      '"Der Kollege" (male) vs "die Kollegin" (female).',
      '"Beruf" (profession) vs "Arbeit" (work): "Was ist Ihr Beruf?"'
    ],
    formsTables: [
      { title: 'Two-way prepositions: location vs direction', rows: [
        ['in (wo?)','in der Praxis (dat.)','Ich arbeite in der Praxis.'],
        ['in (wohin?)','in die Praxis (acc.)','Ich gehe in die Praxis.'],
        ['auf (wo?)','auf der Station','Die Schwester ist auf der Station.'],
        ['auf (wohin?)','auf die Station','Die Schwester geht auf die Station.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Translate: "I work in a clinic."', answer: 'Ich arbeite in einer Praxis.' },
      { prompt: 'Dative or accusative? "Ich gehe in ___ (die Praxis)."', answer: 'accusative: die Praxis' }
    ]
  },
  'A2_lesson_9': {
    conceptId: 'a2.education-language',
    prerequisiteConceptIds: ['a2.work-workplace'],
    remediationLessonId: 'A2_lesson_8',
    conceptsTaught: ['a2.education-language','a2_modal_verbs_past'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_8' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_work_vocab','a2_two_way_prepositions'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_education_vocab','a2_modal_verbs_past'],
    commonMistakes: [
      '"Teilnehmen" takes dative: "an dem Kurs = am Kurs".',
      '"Weil" clause: verb at the end. "Ich lerne, weil ich in Deutschland arbeiten möchte."'
    ],
    formsTables: [
      { title: 'Modal verbs in Präteritum', rows: [
        ['ich konnte/musste/wollte/durfte/sollte','I could/had to/wanted to/was allowed to/should'],
        ['du konntest/musstest/wolltest/durftest/solltest','you could...'],
        ['er/sie/es konnte/musste...','he/she could...'],['sie/Sie konnten/mussten...','they/you could...']
      ]}
    ],
    miniDrills: [
      { prompt: 'Translate: "I had to study."', answer: 'Ich musste lernen.' },
      { prompt: 'Complete: "Ich nehme ___ (der Kurs) teil."', answer: 'am Kurs' },
      { prompt: 'Translate: "I could not come yesterday."', answer: 'Ich konnte gestern nicht kommen.' }
    ]
  },
  'A2_lesson_10': {
    conceptId: 'a2.housing-rental',
    prerequisiteConceptIds: ['a2.education-language'],
    remediationLessonId: 'A2_lesson_9',
    conceptsTaught: ['a2.housing-rental','a2_adjective_endings'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_9' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_education_vocab','a2_modal_verbs_past'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_housing_vocab','a2_adjective_endings'],
    commonMistakes: [
      '"Die Wohnung" (apartment) vs "das Haus" (house).',
      '"Mieten" (to rent) vs "vermieten" (to rent out).',
      'Adjective endings after "der" words: "der große Raum", "die schöne Wohnung".'
    ],
    formsTables: [
      { title: 'Adjective endings after definite article', rows: [
        ['der große Garten (nom.)','the big garden'],['den großen Garten (acc.)'],
        ['dem großen Garten (dat.)'],['die schöne Wohnung (nom./acc.)','the beautiful apartment'],
        ['der schönen Wohnung (dat.)']
      ]}
    ],
    miniDrills: [
      { prompt: 'Complete: "der groß___ Garten" (nominative)', answer: 'der große Garten' },
      { prompt: 'What is "die Miete"?', answer: 'the rent' }
    ]
  },
  'A2_lesson_11': {
    conceptId: 'a2.health-symptoms',
    prerequisiteConceptIds: ['a2.housing-rental'],
    remediationLessonId: 'A2_lesson_10',
    conceptsTaught: ['a2.health-symptoms'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_10' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_housing_vocab','a2_adjective_endings'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_health_vocab'],
    commonMistakes: [
      '"Ich habe Kopfschmerzen" (plural, not "Kopfschmerz" singular).',
      '"Mir ist übel" uses dative (mir), not "Ich bin übel".',
      '"Der Arzt" (male) vs "die Ärztin" (female).'
    ],
    formsTables: [
      { title: 'Symptom expressions', rows: [
        ['Ich habe Kopfschmerzen.','I have a headache.'],['Ich habe Halsschmerzen.','I have a sore throat.'],
        ['Ich habe Rückenschmerzen.','I have back pain.'],['Ich habe Fieber.','I have a fever.'],
        ['Mir ist übel.','I feel nauseous.'],['Mir ist schwindlig.','I feel dizzy.'],
        ['Ich bin erkältet.','I have a cold.'],['Ich habe Husten.','I have a cough.']
      ]},
      { title: 'At the doctor', rows: [
        ['Seit wann haben Sie die Schmerzen?','How long have you had the pain?'],
        ['Tut es hier weh?','Does it hurt here?'],
        ['Ich überweise Sie zum Facharzt.','I am referring you to a specialist.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Say "I have a headache."', answer: 'Ich habe Kopfschmerzen.' },
      { prompt: 'Translate: "I feel nauseous."', answer: 'Mir ist übel.' },
      { prompt: 'Complete: "Ich habe Schmerzen ___ Rücken."', answer: 'im Rücken (in + dem)' }
    ]
  },
  'A2_lesson_12': {
    conceptId: 'a2.pharmacy-medication',
    prerequisiteConceptIds: ['a2.health-symptoms'],
    remediationLessonId: 'A2_lesson_11',
    conceptsTaught: ['a2.pharmacy-medication'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_11' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_health_vocab'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a2_pharmacy_vocab'],
    commonMistakes: [
      '"Das Medikament" (neuter) vs "die Tablette" (feminine).',
      '"Nehmen Sie dreimal täglich eine Tablette." - imperative with "Sie".'
    ],
    formsTables: [
      { title: 'At the pharmacy', rows: [
        ['Ich habe ein Rezept.','I have a prescription.'],
        ['Ich brauche etwas gegen Kopfschmerzen.','I need something for headaches.'],
        ['Gibt es das rezeptfrei?','Is this available without prescription?'],
        ['Nehmen Sie dreimal täglich eine Tablette.','Take one tablet three times a day.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Say "I have a prescription."', answer: 'Ich habe ein Rezept.' },
      { prompt: 'Translate: "Take one tablet three times a day."', answer: 'Nehmen Sie dreimal täglich eine Tablette.' }
    ]
  },
  'A2_lesson_13': {
    conceptId: 'a2.weather-seasons',
    prerequisiteConceptIds: ['a2.hotel-accommodation'],
    remediationLessonId: 'A2_lesson_5',
    conceptsTaught: ['a2.weather-seasons','a2_comparative_basics'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_5' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_travel_vocab'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a2_weather_vocab','a2_comparative'],
    commonMistakes: [
      '"Das Wetter" (neuter), "der Regen" (masculine).',
      '"Es regnet" NOT "Es ist regnen" - verb vs adjective.',
      '"Heute ist es wärmer als gestern." - comparative + "als".'
    ],
    formsTables: [
      { title: 'Comparative with "als"', rows: [
        ['schnell - schneller','Der Zug ist schneller als das Auto.'],
        ['warm - wärmer','Heute ist es wärmer als gestern.'],
        ['gut - besser','Dein Deutsch ist besser als mein Deutsch.'],
        ['viel - mehr','Ich habe mehr Zeit als du.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Complete: "Heute ist es wärmer ___ gestern."', answer: 'als' },
      { prompt: 'What is "das Wetter"?', answer: 'the weather' }
    ]
  },
  'A2_lesson_14': {
    conceptId: 'a2.hobbies-free-time',
    prerequisiteConceptIds: ['a2.daily-routine.detail'],
    remediationLessonId: 'A2_lesson_2',
    conceptsTaught: ['a2.hobbies-free-time','a2_opinion_expressions'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_2' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_present_tense','a2_time_expressions'],
    estimatedMinutes: 20,
    linkedPracticeConceptTags: ['a2_hobby_vocab','a2_opinion'],
    commonMistakes: [
      '"Mein Hobby ist" + noun: "Mein Hobby ist Schwimmen." (capitalized noun).',
      '"Ich spiele Fußball" vs "Ich mache Yoga". "Spielen" for ball sports.',
      '"Gern" vs "mag": "Ich spiele gern Fußball." or "Ich mag Fußball."'
    ],
    formsTables: [
      { title: 'Expressing opinions', rows: [
        ['Ich finde das gut/interessant.','I think that is good/interesting.'],
        ['Meiner Meinung nach ist das zu teuer.','In my opinion that is too expensive.'],
        ['Ich mag...','I like...'],['Das gefällt mir (nicht).','I (do not) like that.']
      ]}
    ],
    miniDrills: [
      { prompt: 'Translate: "I like playing football."', answer: 'Ich spiele gern Fußball.' },
      { prompt: 'Say "I think that is interesting."', answer: 'Ich finde das interessant.' }
    ]
  },
  'A2_lesson_15': {
    conceptId: 'a2.invitations-appointments',
    prerequisiteConceptIds: ['a2.hobbies-free-time','a2.weather-seasons'],
    remediationLessonId: 'A2_lesson_14',
    conceptsTaught: ['a2.invitations-appointments'],
    prerequisites: [{ format: 'completed', lessonId: 'A2_lesson_14' }],
    lessonDepthVersion: 1, trackTags: ['goethe','full-mastery'],
    remediationTags: ['a2_opinion_expressions','a2_time_expressions'],
    estimatedMinutes: 22,
    linkedPracticeConceptTags: ['a2_invitation_vocab'],
    commonMistakes: [
      '"Hast du am Samstag Zeit?" NOT "Hast du Zeit am Samstag?" - time usually before object.',
      '"Ich kann leider nicht kommen." - "leider" (unfortunately) softens rejection.',
      '"Wenn" for "if/when" sends verb to end: "Wenn du Zeit hast, können wir uns treffen."'
    ],
    miniDrills: [
      { prompt: 'Ask a friend: "Do you have time on Saturday?"', answer: 'Hast du am Samstag Zeit?' },
      { prompt: 'Say "I would like to invite you."