/**
 * a2-phase4-generator.cjs
 * 
 * Phase 4: Deepen and complete A2 curriculum quality.
 * Generates enhanced lessons, vocabulary, grammar, and metadata for
 * reading/listening/writing/speaking items.
 * 
 * Run: node scripts/a2-phase4-generator.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// ============================================================================
// 1. LOAD EXISTING DATA
// ============================================================================

const lessons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanLessons.json'), 'utf-8'));
const vocab = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'germanVocabulary.json'), 'utf-8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar.json'), 'utf-8'));
const reading = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'reading.json'), 'utf-8'));
const listeningData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'listening.json'), 'utf-8'));
const writing = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'writing.json'), 'utf-8'));
const speakingData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'speaking.json'), 'utf-8'));
const curriculumMap = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculumMap.json'), 'utf-8'));

console.log('=== A2 Phase 4 Generator ===\n');

// ============================================================================
// 2. ENHANCE A2 LESSONS
// ============================================================================

/**
 * Deep enhancement data for each of the 25 A2 lessons.
 * Each entry adds: conceptId, prerequisiteConceptIds, linkedQuestionIds,
 * remediationLessonId, commonMistakes, formsTables, miniDrills,
 * conceptsTaught, prerequisites, lessonDepthVersion, trackTags,
 * expanded explanation, expanded examples, more vocabulary, more practice.
 */

const a2LessonEnhancements = {
  "A2_lesson_1": {
    conceptId: "a2.review.a1-foundations",
    prerequisiteConceptIds: ["a1_lesson_25"],
    remediationLessonId: "A1_lesson_1",
    conceptsTaught: ["a2.review.a1-foundations", "a2_present_review"],
    prerequisites: [{ format: "completed", lessonId: "A1_lesson_25" }],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a1_present_tense", "a1_sein_haben", "a1_word_order"],
    estimatedMinutes: 20,
    commonMistakes: [
      "Word order: verb must be second element. 'Heute ich gehe' is wrong, it must be 'Heute gehe ich'.",
      "Using formal 'Sie' with friends. Use 'du' with people you know well.",
      "Forgetting 'es' in 'Wie geht es Ihnen?' - 'Wie geht Ihnen?' is incomplete.",
      "Confusing 'mein' and 'meine' - gender and case matter (mein Vater, meine Mutter).",
      "Using 'kommen von' instead of 'kommen aus' for origin. 'Ich komme aus Ägypten, nicht von Ägypten.'"
    ],
    formsTables: [
      { title: "sein (present tense)", rows: [
        ["ich bin","I am","Ich bin Arzt."],["du bist","you are (inf.)","Du bist Student."],
        ["er/sie/es ist","he/she/it is","Er ist in der Klinik."],["wir sind","we are","Wir sind bereit."],
        ["ihr seid","you (pl.) are","Ihr seid müde."],["sie sind","they are","Sie sind freundlich."],
        ["Sie sind","you (formal) are","Sind Sie Herr Müller?"]
      ]},
      { title: "Word order: verb second position", rows: [
        ["Ich heiße Maria.","Subject first, verb second","Simple statement"],
        ["Heute gehe ich einkaufen.","Time first, verb second, subject third","Time element first"],
        ["Im Krankenhaus arbeitet ein Arzt.","Place first, verb second","Place element first"]
      ]}
    ],
    miniDrills: [
      { prompt: "Conjugate 'sein' for 'ich'.", answer: "ich bin" },
      { prompt: "Conjugate 'haben' for 'Sie' (formal).", answer: "Sie haben" },
      { prompt: "Correct: 'Heute ich gehe zur Arbeit.'", answer: "Heute gehe ich zur Arbeit." },
      { prompt: "Translate: 'Where do you come from?' (formal)", answer: "Woher kommen Sie?" }
    ]
  },
  "A2_lesson_2": {
    conceptId: "a2.daily-routine.detail",
    prerequisiteConceptIds: ["a2.review.a1-foundations"],
    remediationLessonId: "A1_lesson_5",
    conceptsTaught: ["a2.daily-routine.detail", "a2_separable_verbs_present", "a2_time_expressions"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_1" }],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a1_present_tense", "a1_daily_routine"],
    estimatedMinutes: 22,
    commonMistakes: [
      "Separable prefix goes to the end: 'Ich stehe um 7 Uhr auf.' NOT 'Ich aufstehe um 7 Uhr.'",
      "Time before manner before place: 'Ich fahre morgens mit dem Bus zur Arbeit.'",
      "Using 'jeden Tag' correctly (accusative, not 'jeder Tag').",
      "Forgetting 'um' for clock times: 'um 8 Uhr' not just '8 Uhr'.",
      "Confusing 'morgens' (every morning) with 'am Morgen' (a specific morning)."
    ],
    formsTables: [
      { title: "Common separable prefix verbs", rows: [
        ["aufstehen","to get up","Ich stehe um 7 Uhr auf."],["einkaufen","to shop","Wir kaufen am Samstag ein."],
        ["anfangen","to begin","Der Kurs fängt um 9 Uhr an."],["mitkommen","to come along","Kommst du mit?"],
        ["fernsehen","to watch TV","Er sieht abends fern."],["aufräumen","to tidy up","Ich räume mein Zimmer auf."],
        ["anrufen","to call","Ruf mich morgen an!"]
      ]},
      { title: "Time expressions", rows: [
        ["morgens","in the mornings","Morgens dusche ich."],["vormittags","in the late morning","Vormittags arbeite ich."],
        ["mittags","at noon","Mittags esse ich."],["nachmittags","in the afternoon","Nachmittags lerne ich."],
        ["abends","in the evening","Abends sehe ich fern."],["nachts","at night","Nachts schlafe ich."],
        ["täglich","daily","Ich lerne täglich Vokabeln."]
      ]}
    ],
    miniDrills: [
      { prompt: "Conjugate 'aufstehen' for 'ich'.", answer: "ich stehe auf" },
      { prompt: "Correct: 'Wir aufräumen das Zimmer.'", answer: "Wir räumen das Zimmer auf." },
      { prompt: "Translate: 'I watch TV in the evening.'", answer: "Ich sehe abends fern." },
      { prompt: "Order: 'mit dem Bus / morgens / fahre / ich / zur Arbeit'", answer: "Morgens fahre ich mit dem Bus zur Arbeit." }
    ]
  },
  "A2_lesson_3": {
    conceptId: "a2.perfekt.mit-haben",
    prerequisiteConceptIds: ["a2.daily-routine.detail"],
    remediationLessonId: "A2_lesson_2",
    conceptsTaught: ["a2.perfekt.mit-haben", "a2_perfekt_regular", "a2_partizip_ii_regular"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_2" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_present_tense", "a2_separable_verbs_present"],
    estimatedMinutes: 25,
    commonMistakes: [
      "Word order: auxiliary in position 2, participle at the END: 'Ich habe gestern gearbeitet.'",
      "Regular participles: ge + stem + t. 'machen' -> 'gemacht', NOT 'gemachen'.",
      "Irregular participles: 'gehen' -> 'gegangen', NOT 'geht'.",
      "Verbs ending in -ieren: no 'ge-'. 'studieren' -> 'studiert', NOT 'gestudiert'.",
      "Separable verbs: -ge- between prefix and stem. 'einkaufen' -> 'eingekauft'."
    ],
    formsTables: [
      { title: "Regular Partizip II", rows: [
        ["machen","gemacht","Ich habe das Essen gemacht."],["kaufen","gekauft","Wir haben Brot gekauft."],
        ["sagen","gesagt","Er hat die Wahrheit gesagt."],["spielen","gespielt","Die Kinder haben gespielt."],
        ["lernen","gelernt","Ich habe Deutsch gelernt."],["wohnen","gewohnt","Sie hat in Berlin gewohnt."],
        ["arbeiten","gearbeitet","Ich habe gestern gearbeitet."],["kochen","gekocht","Sie hat Suppe gekocht."]
      ]},
      { title: "Common irregular Partizip II", rows: [
        ["nehmen","genommen","Ich habe die Tablette genommen."],["essen","gegessen","Wir haben gut gegessen."],
        ["trinken","getrunken","Er hat viel Wasser getrunken."],["finden","gefunden","Ich habe den Schlüssel gefunden."],
        ["geben","gegeben","Der Arzt hat ein Rezept gegeben."],["helfen","geholfen","Die Schwester hat mir geholfen."],
        ["schreiben","geschrieben","Ich habe eine E-Mail geschrieben."],["sehen","gesehen","Haben Sie den Arzt gesehen?"],
        ["kommen","gekommen","Er ist gestern gekommen."],["fahren","gefahren","Ich bin nach Berlin gefahren."]
      ]},
      { title: "-ieren verbs (no ge-)", rows: [
        ["studieren","studiert","Er hat Medizin studiert."],["probieren","probiert","Ich habe das Essen probiert."],
        ["telefonieren","telefoniert","Wir haben telefoniert."]
      ]}
    ],
    miniDrills: [
      { prompt: "Form Partizip II of 'sagen'.", answer: "gesagt" },
      { prompt: "Form Partizip II of 'finden'.", answer: "gefunden" },
      { prompt: "Correct: 'Ich habe gestern studiert Medizin.'", answer: "Ich habe gestern Medizin studiert." },
      { prompt: "Partizip II of 'einkaufen'.", answer: "eingekauft" },
      { prompt: "Translate: 'I ate breakfast.'", answer: "Ich habe gefrühstückt." }
    ]
  },
  "A2_lesson_4": {
    conceptId: "a2.travel-transport",
    prerequisiteConceptIds: ["a2.daily-routine.detail"],
    remediationLessonId: "A2_lesson_2",
    conceptsTaught: ["a2.travel-transport", "a2_prepositions_travel", "a2_imperative_polite"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_2" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_present_tense", "a2_separable_verbs_present"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Ich fahre mit dem Zug' not 'mit Zug' - article needed.",
      "'Nach Berlin' (cities) but 'in die Schweiz' (countries with article).",
      "'Reise' is noun (die Reise). Verb is 'reisen': 'Ich reise gern.'",
      "'Der Bahnhof' (station) vs 'der Flughafen' (airport) vs 'die Haltestelle' (stop).",
      "'Um...zu' for purpose: 'Ich fahre nach Köln, um meinen Freund zu besuchen.'"
    ],
    formsTables: [
      { title: "Means of transport with 'mit' + dative", rows: [
        ["mit dem Zug","by train","Ich fahre mit dem Zug nach München."],
        ["mit dem Bus","by bus","Die Schüler fahren mit dem Bus zur Schule."],
        ["mit der U-Bahn","by subway","Fahren Sie mit der U-Bahn zum Zentrum."],
        ["mit dem Taxi","by taxi","Wir fahren mit dem Taxi zum Flughafen."],
        ["mit dem Flugzeug","by plane","Er fliegt mit dem Flugzeug nach Berlin."],
        ["mit dem Fahrrad","by bicycle","Ich fahre mit dem Fahrrad zur Arbeit."],
        ["zu Fuß","on foot","Ich gehe zu Fuß zum Bahnhof."]
      ]},
      { title: "Directions with 'nach' and 'zu'", rows: [
        ["nach Berlin fahren","to go to Berlin"],["zum Bahnhof gehen","to go to the station"],
        ["zur Post gehen","to go to the post office"],["in die Stadt fahren","to go to the city center"],
        ["nach Hause gehen","to go home"],["zu Hause sein","to be at home"]
      ]}
    ],
    miniDrills: [
      { prompt: "Translate: 'I go by bus.'", answer: "Ich fahre mit dem Bus." },
      { prompt: "'nach' or 'zu'? 'Ich gehe ___ Arzt.'", answer: "zu (zum Arzt)" },
      { prompt: "Translate: 'to the train station'", answer: "zum Bahnhof" },
      { prompt: "Correct location: 'Ich fahre in Berlin.' (going TO Berlin)", answer: "Ich fahre nach Berlin." }
    ]
  },
  "A2_lesson_5": {
    conceptId: "a2.hotel-accommodation",
    prerequisiteConceptIds: ["a2.travel-transport"],
    remediationLessonId: "A2_lesson_4",
    conceptsTaught: ["a2.hotel-accommodation", "a2_modal_verbs_hotel"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_4" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_travel_vocab", "a2_present_tense"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Ich möchte' NOT 'Ich will' - 'möchte' is more polite.",
      "'Einzelzimmer' (single) vs 'Doppelzimmer' (double) are distinct words.",
      "'Das Frühstück ist inklusive' not 'inkludiert'.",
      "'Der Aufenthalt' (the stay), not 'das Bleiben'.",
      "Word order: 'Können Sie mir helfen?' not 'Können Sie helfen mir?'"
    ],
    formsTables: [
      { title: "Hotel phrases", rows: [
        ["Ich möchte ein Zimmer reservieren.","I would like to book a room."],
        ["Haben Sie ein Einzelzimmer frei?","Do you have a single room?"],
        ["Was kostet eine Übernachtung?","How much is one night?"],
        ["Ist das Frühstück inklusive?","Is breakfast included?"],
        ["Ich möchte drei Nächte bleiben.","I would like to stay three nights."],
        ["Kann ich bar bezahlen?","Can I pay cash?"],["Die Rechnung, bitte.","The bill, please."]
      ]},
      { title: "Room types", rows: [
        ["das Einzelzimmer","single room"],["das Doppelzimmer","double room"],
        ["das Familienzimmer","family room"],["das Einzelbett","single bed"],["das Doppelbett","double bed"]
      ]}
    ],
    miniDrills: [
      { prompt: "Translate: 'I would like a double room.'", answer: "Ich möchte ein Doppelzimmer." },
      { prompt: "Ask if breakfast is included.", answer: "Ist das Frühstück inklusive?" },
      { prompt: "What is 'die Rechnung'?", answer: "the bill" }
    ]
  },
  "A2_lesson_6": {
    conceptId: "a2.shopping-services",
    prerequisiteConceptIds: ["a2.hotel-accommodation"],
    remediationLessonId: "A2_lesson_5",
    conceptsTaught: ["a2.shopping-services", "a2_dative_articles_shopping"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_5" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_hotel_vocab", "a1_shopping"],
    estimatedMinutes: 22,
    commonMistakes: [
      "After 'mit' and 'von' use dative: 'mit dem Geld' not 'mit das Geld'.",
      "'Ich möchte...' is polite. 'Ich will...' can be too direct.",
      "'Der Preis' (price) plural: 'die Preise'.",
      "'Bezahlen' takes accusative: 'Ich bezahle den Einkauf.'",
      "'Kostet' vs 'kosten': 'Was kostet das?' (sg) vs 'Was kosten die Äpfel?' (pl)."
    ],
    formsTables: [
      { title: "Dative after 'mit'", rows: [
        ["der Kaffee -> mit dem Kaffee","Ich bezahle mit dem Kaffee."],
        ["die Milch -> mit der Milch","Mit der Milch, bitte."],
        ["das Brot -> mit dem Brot","Mit dem Brot, bitte."],
        ["die Äpfel (pl) -> mit den Äpfeln","Helfen Sie mir mit den Äpfeln?"]
      ]},
      { title: "Shopping phrases", rows: [
        ["Ich möchte...","I would like..."],["Was kostet das?","How much is that?"],
        ["Das ist zu teuer.","That's too expensive."],["Ich nehme das.","I'll take that."],
        ["Kann ich mit Karte bezahlen?","Can I pay by card?"]
      ]}
    ],
    miniDrills: [
      { prompt: "Dative of 'der Kaffee' after 'mit'.", answer: "mit dem Kaffee" },
      { prompt: "Translate: 'How much is that?'", answer: "Was kostet das?" },
      { prompt: "Say 'too expensive' in German.", answer: "zu teuer" }
    ]
  },
  "A2_lesson_7": {
    conceptId: "a2.restaurant-food",
    prerequisiteConceptIds: ["a2.shopping-services"],
    remediationLessonId: "A2_lesson_6",
    conceptsTaught: ["a2.restaurant-food", "a2_dative_personal_pronouns_food"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_6" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_dative_articles", "a2_shopping_vocab"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Schmeckt es dir?' uses dative (dir), not accusative (dich).",
      "'Das schmeckt mir gut.' - 'mir' is dative, 'to me'.",
      "No 'zu' after 'möchte etwas': 'Ich möchte etwas essen.'",
      "'Die Speisekarte' is the menu, not 'das Menu' (set meal)."
    ],
    formsTables: [
      { title: "Restaurant phrases", rows: [
        ["Ich hätte gern...","I would like (polite)...","Ich hätte gern die Suppe."],
        ["Könnte ich die Speisekarte haben?","Could I have the menu?"],
        ["Was empfehlen Sie?","What do you recommend?"],
        ["Schmeckt es Ihnen?","Do you like it?"],
        ["Es hat sehr gut geschmeckt.","It was very tasty."],
        ["Die Rechnung, bitte!","The bill, please!"]
      ]},
      { title: "Dative pronouns with 'schmecken'", rows: [
        ["mir","to me","Das schmeckt mir gut."],["dir","to you (inf.)","Schmeckt dir die Suppe?"],
        ["ihm","to him","Der Salat schmeckt ihm nicht."],["ihr","to her","Der Wein schmeckt ihr."],
        ["uns","to us","Das Essen schmeckt uns."],["Ihnen","to you (formal)","Schmeckt es Ihnen?"]
      ]}
    ],
    miniDrills: [
      { prompt: "Complete: 'Das schmeckt ___ (ich) sehr gut.'", answer: "mir" },
      { prompt: "Say 'The bill, please.'", answer: "Die Rechnung, bitte!" },
      { prompt: "What is 'die Speisekarte'?", answer: "the menu" }
    ]
  },
  "A2_lesson_8": {
    conceptId: "a2.work-workplace",
    prerequisiteConceptIds: ["a2.restaurant-food"],
    remediationLessonId: "A2_lesson_7",
    conceptsTaught: ["a2.work-workplace", "a2_two_way_prepositions_work"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_7" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_restaurant_vocab", "a2_dative_pronouns"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'In der Praxis' (dative = location) vs 'in die Praxis' (accusative = direction).",
      "'Der Kollege' (male) vs 'die Kollegin' (female).",
      "'Die Firma' (feminine) vs 'das Unternehmen' (neuter).",
      "'Beruf' (profession) vs 'Arbeit' (work): 'Was ist Ihr Beruf?'"
    ],
    formsTables: [
      { title: "Two-way prepositions: location vs direction", rows: [
        ["in (wo?)","in der Praxis (dat.)","Ich arbeite in der Praxis."],
        ["in (wohin?)","in die Praxis (acc.)","Ich gehe in die Praxis."],
        ["auf (wo?)","auf der Station","Die Schwester ist auf der Station."],
        ["auf (wohin?)","auf die Station","Die Schwester geht auf die Station."]
      ]},
      { title: "Workplace vocabulary", rows: [
        ["die Praxis","practice/clinic"],["der Arzt / die Ärztin","doctor"],
        ["die Sprechstunde","office hours"],["der Kollege / die Kollegin","colleague"],
        ["die Schicht","shift"],["das Büro","office"]
      ]}
    ],
    miniDrills: [
      { prompt: "Translate: 'I work in a clinic.'", answer: "Ich arbeite in einer Praxis." },
      { prompt: "Dative or accusative? 'Ich gehe in ___ (die Praxis).'", answer: "accusative: die Praxis" },
      { prompt: "What is 'die Schicht'?", answer: "shift" }
    ]
  },
  "A2_lesson_9": {
    conceptId: "a2.education-language",
    prerequisiteConceptIds: ["a2.work-workplace"],
    remediationLessonId: "A2_lesson_8",
    conceptsTaught: ["a2.education-language", "a2_modal_verbs_past"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_8" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_work_vocab", "a2_two_way_prepositions"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Teilnehmen' takes dative: 'an dem Kurs = am Kurs'.",
      "'Die Prüfung bestehen': 'bestehen' takes accusative.",
      "'Weil' clause: verb at the end. 'Ich lerne, weil ich in Deutschland arbeiten möchte.'",
      "'Der Unterricht' vs 'die Stunde' (lesson vs period)."
    ],
    formsTables: [
      { title: "Modal verbs in Präteritum", rows: [
        ["ich konnte/musste/wollte/durfte/sollte","I could/had to/wanted to..."],
        ["du konntest/musstest/wolltest/durftest/solltest","you could..."],
        ["er/sie/es konnte/musste...","he/she could..."],
        ["wir konnten/mussten...","we could..."],
        ["sie/Sie konnten/mussten...","they/you could..."]
      ]},
      { title: "Education vocabulary", rows: [
        ["der Sprachkurs","language course"],["der Unterricht","class"],
        ["die Prüfung","exam"],["das Zertifikat","certificate"],
        ["bestehen","to pass"],["teilnehmen an (+dat.)","to participate"]
      ]}
    ],
    miniDrills: [
      { prompt: "Translate: 'I had to study.'", answer: "Ich musste lernen." },
      { prompt: "Complete: 'Ich nehme ___ (der Kurs) teil.'", answer: "am Kurs" },
      { prompt: "Translate: 'I couldn't come yesterday.'", answer: "Ich konnte gestern nicht kommen." }
    ]
  },
  "A2_lesson_10": {
    conceptId: "a2.housing-rental",
    prerequisiteConceptIds: ["a2.education-language"],
    remediationLessonId: "A2_lesson_9",
    conceptsTaught: ["a2.housing-rental", "a2_adjective_endings"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_9" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_education_vocab", "a2_modal_verbs_past"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Die Wohnung' (apartment) vs 'das Haus' (house).",
      "'Mieten' (to rent) vs 'vermieten' (to rent out).",
      "'Die Miete' (rent payment) vs 'der Mietvertrag' (rental contract).",
      "Adjective endings after 'der' words: 'der große Raum', 'die schöne Wohnung'."
    ],
    formsTables: [
      { title: "Adjective endings after best. Artikel", rows: [
        ["der große Garten (nom.)","the big garden"],["den großen Garten (acc.)","the big garden"],
        ["dem großen Garten (dat.)","the big garden"],
        ["die schöne Wohnung (nom.)","the beautiful apartment"],
        ["die schöne Wohnung (acc.)","the beautiful apartment"],
        ["der schönen Wohnung (dat.)","the beautiful apartment"]
      ]},
      { title: "Housing vocabulary", rows: [
        ["die Wohnung","apartment"],["das Haus","house"],["das Zimmer","room"],
        ["die Küche","kitchen"],["das Bad","bathroom"],["das Schlafzimmer","bedroom"],
        ["die Miete","rent"],["der Vermieter","landlord"],["der Mietvertrag","rental contract"],
        ["die Kaution","deposit"],["die Nebenkosten","utility costs"]
      ]}
    ],
    miniDrills: [
      { prompt: "Complete: 'der groß___ Garten' (nominative)", answer: "der große Garten" },
      { prompt: "What is 'die Miete'?", answer: "the rent" },
      { prompt: "'mieten' vs 'vermieten' - difference?", answer: "mieten = to rent, vermieten = to rent out" }
    ]
  },
  "A2_lesson_11": {
    conceptId: "a2.health-symptoms",
    prerequisiteConceptIds: ["a2.housing-rental", "a2_two_way_prepositions_work"],
    remediationLessonId: "A2_lesson_10",
    conceptsTaught: ["a2.health-symptoms", "a2_body_parts", "a2_symptom_descriptions"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_10" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_housing_vocab", "a2_adjective_endings"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Ich habe Kopfschmerzen' (plural, not 'Kopfschmerz' singular).",
      "'Mir ist übel' uses dative (mir), not 'Ich bin übel'.",
      "'Der Arzt' (male) vs 'die Ärztin' (female). Use both in context.",
      "'Schmerzen haben' takes accusative: 'Ich habe Schmerzen im Rücken.'",
      "'Die Untersuchung' (examination) vs 'die Behandlung' (treatment)."
    ],
    formsTables: [
      { title: "Symptom expressions", rows: [
        ["Ich habe Kopfschmerzen.","I have a headache."],["Ich habe Halsschmerzen.","I have a sore throat."],
        ["Ich habe Rückenschmerzen.","I have back pain."],["Ich habe Fieber.","I have a fever."],
        ["Mir ist übel.","I feel nauseous."],["Mir ist schwindlig.","I feel dizzy."],
        ["Ich bin erkältet.","I have a cold."],["Ich habe Husten.","I have a cough."],
        ["Die Wunde tut weh.","The wound hurts."]
      ]},
      { title: "At the doctor's", rows: [
        ["Seit wann haben Sie die Schmerzen?","How long have you had the pain?"],
        ["Tut es hier weh?","Does it hurt here?"],
        ["Ich überweise Sie zum Facharzt.","I'm referring you to a specialist."],
        ["Sie müssen Medikamente nehmen.","You need to take medication."],
        ["Kommen Sie bitte in drei Tagen wieder.","Please come back in three days."]
      ]}
    ],
    miniDrills: [
      { prompt: "Say 'I have a headache.'", answer: "Ich habe Kopfschmerzen." },
      { prompt: "Translate: 'I feel nauseous.'", answer: "Mir ist übel." },
      { prompt: "Complete: 'Ich habe Schmerzen ___ Rücken.'", answer: "im Rücken (in + dem)" }
    ]
  },
  "A2_lesson_12": {
    conceptId: "a2.pharmacy-medication",
    prerequisiteConceptIds: ["a2.health-symptoms"],
    remediationLessonId: "A2_lesson_11",
    conceptsTaught: ["a2.pharmacy-medication", "a2_imperative_formal"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_11" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_health_vocab", "a2_symptom_descriptions"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Das Medikament' (neuter) vs 'die Tablette' (feminine) vs 'der Saft' (liquid medicine).",
      "'Nehmen Sie dreimal täglich eine Tablette.' - imperative with 'Sie'.",
      "'Das Rezept' (prescription) vs 'die Verschreibung' (prescription note).",
      "Dosage: 'morgens, mittags, abends' not 'am Morgen, am Mittag, am Abend' for instructions."
    ],
    formsTables: [
      { title: "At the pharmacy", rows: [
        ["Ich habe ein Rezept.","I have a prescription."],
        ["Ich brauche etwas gegen Kopfschmerzen.","I need something for headaches."],
        ["Gibt es das auch rezeptfrei?","Is this also available without prescription?"],
        ["Wie oft soll ich das nehmen?","How often should I take this?"],
        ["Nehmen Sie dreimal täglich eine Tablette.","Take one tablet three times a day."],
        ["Das Medikament gibt es in der Apotheke.","The medication is available at the pharmacy."]
      ]}
    ],
    miniDrills: [
      { prompt: "Say 'I have a prescription.'", answer: "Ich habe ein Rezept." },
      { prompt: "What is 'das Medikament'?", answer: "the medication" },
      { prompt: "Translate: 'Take one tablet three times a day.'", answer: "Nehmen Sie dreimal täglich eine Tablette." }
    ]
  },
  "A2_lesson_13": {
    conceptId: "a2.weather-seasons",
    prerequisiteConceptIds: ["a2.hotel-accommodation"],
    remediationLessonId: "A2_lesson_5",
    conceptsTaught: ["a2.weather-seasons", "a2_comparative_basics"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_5" }],
    lessonDepthVersion: 1, trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_travel_vocab", "a2_present_tense"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Das Wetter' is neuter, 'der Regen' is masculine.",
      "'Es regnet' NOT 'Es ist regnen' - 'regnen' is a verb, not adjective.",
      "'Heute ist es wärmer als gestern.' - comparative + 'als'.",
      "'Im Sommer' NOT 'im Sommerzeit'.",
      "'Der Grad' (degree): 'Es sind 25 Grad.' (plural) NOT 'Es ist 25 Grad.'"
    ],
    formsTables: [
      { title: "Comparative with 'als'", rows: [
        ["schnell - schneller","Der Zug ist schneller als das Auto."],
        ["warm - wärmer","Heute ist es wärmer als gestern."],
        ["kalt - kälter","Der Winter ist kälter als der Herbst."],
        ["teuer - teurer","Das Hotel ist teurer als die Pension."],
        ["gut - besser","Dein Deutsch ist besser als mein Deutsch."],
        ["viel - mehr","Ich habe mehr Zeit als du."]
      ]}
    ],
    miniDrills: [
