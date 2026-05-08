/**
 * enhance-a2-lessons.cjs
 * 
 * Enhances all 25 A2 lessons to match the A1 Phase 3 quality standard.
 * Adds: conceptId, prerequisiteConceptIds, linkedQuestionIds, remediationLessonId,
 * commonMistakes, formsTables, miniDrills, conceptsTaught, prerequisites,
 * trackTags, expanded explanations, more examples, more vocabulary, more practice.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const lessonsPath = path.join(DATA_DIR, 'germanLessons.json');
const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'));

// Find A2 lessons
const a2Indices = [];
lessons.forEach((l, i) => {
  if (l.level === 'A2') a2Indices.push(i);
});

console.log(`Found ${a2Indices.length} A2 lessons to enhance`);

// ====== Lesson Enhancement Data ======

const enhancements = {
  "A2_lesson_1": { // Wiederholung von A1 und sich vorstellen
    conceptId: "a2.review.a1-foundations",
    prerequisiteConceptIds: ["a1_lesson_25"],
    remediationLessonId: "A1_lesson_1",
    conceptsTaught: ["a2.review.a1-foundations", "a2_present_review"],
    prerequisites: [{ format: "completed", lessonId: "A1_lesson_25" }],
    linkedPracticeConceptTags: ["a1_present_tense", "a1_sein_haben", "a1_word_order"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a1_present_tense", "a1_word_order"],
    estimatedMinutes: 20,
    commonMistakes: [
      "Word order: verb must be second element. 'Heute ich gehe' is wrong, it must be 'Heute gehe ich'.",
      "Using formal 'Sie' with friends. Use 'du' with people you know well.",
      "Forgetting 'es' in 'Wie geht es Ihnen?' - 'Wie geht Ihnen?' is incomplete.",
      "Confusing 'mein' and 'meine' - gender and case matter (mein Vater, meine Mutter).",
      "Using 'kommen von' instead of 'kommen aus' for origin. 'Ich komme aus Ägypten, nicht von Ägypten.'"
    ],
    formsTables: [
      {
        title: "sein (present tense)",
        rows: [
          ["ich bin", "I am", "Ich bin Arzt."],
          ["du bist", "you are (inf.)", "Du bist Student."],
          ["er/sie/es ist", "he/she/it is", "Er ist in der Klinik."],
          ["wir sind", "we are", "Wir sind bereit."],
          ["ihr seid", "you (pl.) are", "Ihr seid müde."],
          ["sie sind", "they are", "Sie sind freundlich."],
          ["Sie sind", "you (formal) are", "Sind Sie Herr Müller?"]
        ]
      },
      {
        title: "haben (present tense)",
        rows: [
          ["ich habe", "I have", "Ich habe eine Frage."],
          ["du hast", "you have (inf.)", "Du hast einen Termin."],
          ["er/sie/es hat", "he/she/it has", "Er hat Schmerzen."],
          ["wir haben", "we have", "Wir haben Zeit."],
          ["ihr habt", "you (pl.) have", "Ihr habt Glück."],
          ["sie haben", "they have", "Sie haben Fieber."],
          ["Sie haben", "you (formal) have", "Haben Sie einen Termin?"]
        ]
      },
      {
        title: "Word order: verb second position",
        rows: [
          ["Ich heiße Maria.", "Subject first, verb second", "Simple statement"],
          ["Heute gehe ich einkaufen.", "Time first, verb second, subject third", "Time element first"],
          ["Im Krankenhaus arbeitet ein Arzt.", "Place first, verb second", "Place element first"],
          ["Mein Bruder heißt Paul.", "Possessive + noun as first element", "Complex subject first"]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Conjugate 'sein' for 'ich'.", answer: "ich bin" },
      { prompt: "Conjugate 'haben' for 'Sie' (formal).", answer: "Sie haben" },
      { prompt: "Correct this sentence: 'Heute ich gehe zur Arbeit.'", answer: "Heute gehe ich zur Arbeit." },
      { prompt: "Translate: 'Where do you come from?' (formal)", answer: "Woher kommen Sie?" },
      { prompt: "Is this correct? 'Ich komme von Deutschland.'", answer: "No. Correct: 'Ich komme aus Deutschland.'" }
    ]
  },

  "A2_lesson_2": { // Alltagsroutine im Detail
    conceptId: "a2.daily-routine.detail",
    prerequisiteConceptIds: ["a2.review.a1-foundations", "a1_daily_routine"],
    remediationLessonId: "A1_lesson_5",
    conceptsTaught: ["a2.daily-routine.detail", "a2_separable_verbs_present", "a2_time_expressions"],
    prerequisites: [{ format: "completed", lessonId: "A1_lesson_5" }, { format: "completed", lessonId: "A2_lesson_1" }],
    linkedPracticeConceptTags: ["a2_separable_verbs_present", "a2_time_expressions"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a1_present_tense", "a1_daily_routine"],
    estimatedMinutes: 22,
    commonMistakes: [
      "Separable prefix goes to the end: 'Ich stehe um 7 Uhr auf.' NOT 'Ich aufstehe um 7 Uhr.'",
      "Time before manner before place: 'Ich fahre morgens mit dem Bus zur Arbeit.'",
      "Using 'jeden Tag' correctly (accusative, not 'jeder Tag').",
      "Forgetting 'um' for clock times: 'um 8 Uhr' not just '8 Uhr' in a sentence.",
      "Confusing 'morgens' (every morning) with 'am Morgen' (in the morning on a specific day)."
    ],
    formsTables: [
      {
        title: "Common separable prefix verbs",
        rows: [
          ["aufstehen", "to get up", "Ich stehe um 7 Uhr auf."],
          ["einkaufen", "to shop", "Wir kaufen am Samstag ein."],
          ["anfangen", "to begin", "Der Kurs fängt um 9 Uhr an."],
          ["mitkommen", "to come along", "Kommst du mit?"],
          ["fernsehen", "to watch TV", "Er sieht abends fern."],
          ["zumachen", "to close", "Die Praxis macht um 18 Uhr zu."],
          ["aufräumen", "to tidy up", "Ich räume mein Zimmer auf."],
          ["anrufen", "to call", "Ruf mich morgen an!"]
        ]
      },
      {
        title: "Time expressions",
        rows: [
          ["morgens", "in the mornings (habitual)", "Morgens dusche ich."],
          ["vormittags", "in the late morning", "Vormittags arbeite ich."],
          ["mittags", "at noon/midday", "Mittags esse ich."],
          ["nachmittags", "in the afternoon", "Nachmittags lerne ich Deutsch."],
          ["abends", "in the evening", "Abends sehe ich fern."],
          ["nachts", "at night", "Nachts schlafe ich."],
          ["täglich", "daily", "Ich lerne täglich Vokabeln."],
          ["einmal pro Woche", "once a week", "Einmal pro Woche putze ich."]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Conjugate 'aufstehen' for 'ich' in present tense.", answer: "ich stehe auf" },
      { prompt: "Correct: 'Wir aufräumen das Zimmer.'", answer: "Wir räumen das Zimmer auf." },
      { prompt: "Translate: 'I watch TV in the evening.'", answer: "Ich sehe abends fern." },
      { prompt: "Put these in correct order: 'mit dem Bus / morgens / fahre / ich / zur Arbeit'", answer: "Morgens fahre ich mit dem Bus zur Arbeit." },
      { prompt: "Is 'jeder Tag' correct in 'Ich lerne jeden Tag Deutsch'?", answer: "Yes, 'jeden Tag' (accusative) is correct." }
    ]
  },

  "A2_lesson_3": { // Vergangene Aktivitäten (Perfekt)
    conceptId: "a2.perfekt.mit-haben",
    prerequisiteConceptIds: ["a2.daily-routine.detail"],
    remediationLessonId: "A2_lesson_2",
    conceptsTaught: ["a2.perfekt.mit-haben", "a2_perfekt_regular", "a2_partizip_ii_regular"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_2" }],
    linkedPracticeConceptTags: ["a2_perfekt_regular", "a2_perfekt_irregular"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_present_tense", "a2_separable_verbs_present"],
    estimatedMinutes: 25,
    commonMistakes: [
      "Word order: auxiliary (haben/sein) in position 2, participle at the END: 'Ich habe gestern gearbeitet.'",
      "Regular participles: ge + stem + t. 'machen' -> 'gemacht', NOT 'gemachen'.",
      "Irregular participles must be memorized: 'gehen' -> 'gegangen', NOT 'geht'.",
      "Verbs ending in -ieren: no 'ge-' prefix. 'studieren' -> 'studiert', NOT 'gestudiert'.",
      "Separable verbs: -ge- goes between prefix and stem. 'einkaufen' -> 'eingekauft', NOT 'geeinkauft'."
    ],
    formsTables: [
      {
        title: "Regular Partizip II formation",
        rows: [
          ["machen", "ge + mach + t", "gemacht", "Ich habe das Essen gemacht."],
          ["kaufen", "ge + kauf + t", "gekauft", "Wir haben Brot gekauft."],
          ["sagen", "ge + sag + t", "gesagt", "Er hat die Wahrheit gesagt."],
          ["spielen", "ge + spiel + t", "gespielt", "Die Kinder haben gespielt."],
          ["lernen", "ge + lern + t", "gelernt", "Ich habe Deutsch gelernt."],
          ["wohnen", "ge + wohn + t", "gewohnt", "Sie hat in Berlin gewohnt."]
        ]
      },
      {
        title: "Common irregular Partizip II",
        rows: [
          ["nehmen", "genommen", "Ich habe die Tablette genommen."],
          ["essen", "gegessen", "Wir haben gut gegessen."],
          ["trinken", "getrunken", "Er hat viel Wasser getrunken."],
          ["finden", "gefunden", "Ich habe den Schlüssel gefunden."],
          ["geben", "gegeben", "Der Arzt hat mir ein Rezept gegeben."],
          ["helfen", "geholfen", "Die Schwester hat mir geholfen."],
          ["schreiben", "geschrieben", "Ich habe eine E-Mail geschrieben."],
          ["sehen", "gesehen", "Haben Sie den Arzt gesehen?"]
        ]
      },
      {
        title: "Partizip II with -ieren verbs",
        rows: [
          ["studieren", "studiert", "Er hat Medizin studiert."],
          ["probieren", "probiert", "Ich habe das Essen probiert."],
          ["telefonieren", "telefoniert", "Wir haben telefoniert."],
          ["diktieren", "diktiert", "Der Arzt hat den Befund diktiert."]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Form the Partizip II of 'sagen'.", answer: "gesagt" },
      { prompt: "Form the Partizip II of 'finden'.", answer: "gefunden" },
      { prompt: "Correct: 'Ich habe gestern studiert Medizin.'", answer: "Ich habe gestern Medizin studiert." },
      { prompt: "Put 'einkaufen' into Partizip II.", answer: "eingekauft" },
      { prompt: "Translate: 'I ate breakfast.'", answer: "Ich habe gefrühstückt." }
    ]
  },

  "A2_lesson_4": { // Reisen und Verkehrsmittel
    conceptId: "a2.travel-transport",
    prerequisiteConceptIds: ["a2.daily-routine.detail"],
    remediationLessonId: "A2_lesson_2",
    conceptsTaught: ["a2.travel-transport", "a2_prepositions_travel", "a2_imperative_polite"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_2" }],
    linkedPracticeConceptTags: ["a2_travel_vocab", "a2_prepositions_travel"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_present_tense", "a2_separable_verbs_present"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Ich fahre mit dem Zug' not 'Ich fahre mit Zug' - article needed with means of transport.",
      "'Ich fahre nach Berlin' (cities/countries without article) but 'in die Schweiz' (countries with article).",
      "Using 'um...zu' correctly: 'Ich fahre nach Köln, um meinen Freund zu besuchen.' NOT 'für besuchen'.",
      "'Reise' is a noun (die Reise), not a verb. The verb is 'reisen': 'Ich reise gern.'",
      "'Der Bahnhof' vs 'der Flughafen' - station vs airport. Don't confuse 'die Haltestelle' (stop) with 'der Bahnhof' (station)."
    ],
    formsTables: [
      {
        title: "Means of transport with 'mit'",
        rows: [
          ["mit dem Zug", "by train", "Ich fahre mit dem Zug nach München."],
          ["mit dem Bus", "by bus", "Die Schüler fahren mit dem Bus zur Schule."],
          ["mit der U-Bahn", "by subway", "Fahren Sie mit der U-Bahn zum Zentrum."],
          ["mit dem Taxi", "by taxi", "Wir fahren mit dem Taxi zum Flughafen."],
          ["mit dem Flugzeug", "by plane", "Er fliegt mit dem Flugzeug nach Berlin."],
          ["mit dem Fahrrad", "by bicycle", "Ich fahre mit dem Fahrrad zur Arbeit."],
          ["zu Fuß", "on foot", "Ich gehe zu Fuß zum Bahnhof."]
        ]
      },
      {
        title: "Directions with 'zu' and 'nach'",
        rows: [
          ["nach Berlin fahren", "to go to Berlin", "Ich fahre nach Berlin."],
          ["zum Bahnhof gehen", "to go to the station", "Gehen Sie zum Bahnhof."],
          ["zur Post gehen", "to go to the post office", "Ich gehe zur Post."],
          ["in die Stadt fahren", "to go to the city center", "Wir fahren in die Stadt."],
          ["nach Hause gehen", "to go home", "Ich gehe nach Hause."],
          ["zu Hause sein", "to be at home", "Ich bin zu Hause."]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Translate: 'I go by bus.'", answer: "Ich fahre mit dem Bus." },
      { prompt: "Is it 'nach' or 'zu'? 'Ich gehe ___ Arzt.'", answer: "zu (zum Arzt)" },
      { prompt: "Translate: 'to the train station'", answer: "zum Bahnhof" },
      { prompt: "Correct: 'Ich fahre in Berlin.' (today), meaning I'm going to Berlin.", answer: "Ich fahre nach Berlin." },
      { prompt: "What is 'die Haltestelle' in English?", answer: "the stop (bus/tram stop)" }
    ]
  },

  "A2_lesson_5": { // Hotel und Unterkunft
    conceptId: "a2.hotel-accommodation",
    prerequisiteConceptIds: ["a2.travel-transport"],
    remediationLessonId: "A2_lesson_4",
    conceptsTaught: ["a2.hotel-accommodation", "a2_modal_verbs_hotel"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_4" }],
    linkedPracticeConceptTags: ["a2_hotel_vocab", "a2_modal_verbs_hotel"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_travel_vocab", "a2_present_tense"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Ich möchte ein Zimmer reservieren' NOT 'Ich will ein Zimmer reservieren' - 'möchte' is more polite.",
      "'Einzelzimmer' (single room) vs 'Doppelzimmer' (double room) - distinct words.",
      "'Das Frühstück' is included (inklusive) not 'inkludiert' (that's English-based).",
      "'Der Aufenthalt' (the stay), not 'das Bleiben'.",
      "'Können Sie mir helfen?' is polite, not 'Können Sie helfen mir?' - verb second in question."
    ],
    formsTables: [
      {
        title: "Hotel phrases",
        rows: [
          ["Ich möchte ein Zimmer reservieren.", "I would like to book a room."],
          ["Haben Sie ein Einzelzimmer frei?", "Do you have a single room available?"],
          ["Was kostet eine Übernachtung?", "How much is one night?"],
          ["Ist das Frühstück inklusive?", "Is breakfast included?"],
          ["Ich möchte drei Nächte bleiben.", "I would like to stay three nights."],
          ["Haben Sie ein ruhiges Zimmer?", "Do you have a quiet room?"],
          ["Kann ich bar bezahlen?", "Can I pay cash?"],
          ["Die Rechnung, bitte.", "The bill, please."]
        ]
      },
      {
        title: "Room types",
        rows: [
          ["das Einzelzimmer", "single room"],
          ["das Doppelzimmer", "double room"],
          ["das Familienzimmer", "family room"],
          ["das Appartement", "apartment/suite"],
          ["das Einzelbett", "single bed"],
          ["das Doppelbett", "double bed"]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Translate: 'I would like a double room.'", answer: "Ich möchte ein Doppelzimmer." },
      { prompt: "How do you ask if breakfast is included?", answer: "Ist das Frühstück inklusive?" },
      { prompt: "What is 'die Rechnung'?", answer: "the bill" },
      { prompt: "Translate: 'For three nights.'", answer: "Für drei Nächte." },
      { prompt: "How do you say 'single room' in German?", answer: "Das Einzelzimmer" }
    ]
  },

  "A2_lesson_6": { // Einkaufen und Dienstleistungen
    conceptId: "a2.shopping-services",
    prerequisiteConceptIds: ["a2.hotel-accommodation"],
    remediationLessonId: "A2_lesson_5",
    conceptsTaught: ["a2.shopping-services", "a2_dative_articles_shopping"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_5" }],
    linkedPracticeConceptTags: ["a2_shopping_vocab", "a2_dative_articles"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_hotel_vocab", "a1_shopping"],
    estimatedMinutes: 22,
    commonMistakes: [
      "After 'mit' and 'von' always use dative: 'mit dem Geld' not 'mit das Geld'.",
      "'Ich möchte...' is polite. 'Ich will...' can be too direct.",
      "'Der Preis' (price) vs 'die Preise' (prices). Plural is die Preise.",
      "'Bezahlen' takes accusative: 'Ich bezahle den Einkauf.'",
      "'Kostet' vs 'kosten': 'Was kostet das?' (singular) vs 'Was kosten die Äpfel?' (plural)."
    ],
    formsTables: [
      {
        title: "Dative article changes after 'mit'",
        rows: [
          ["der Kaffee", "mit dem Kaffee", "Ich bezahle mit dem Kaffee."],
          ["die Milch", "mit der Milch", "Mit der Milch, bitte."],
          ["das Brot", "mit dem Brot", "Mit dem Brot, bitte."],
          ["die Äpfel (pl)", "mit den Äpfeln", "Helfen Sie mir mit den Äpfeln?"]
        ]
      },
      {
        title: "Shopping phrases",
        rows: [
          ["Ich möchte...", "I would like..."],
          ["Was kostet das?", "How much is that?"],
          ["Haben Sie...?", "Do you have...?"],
          ["Das ist zu teuer.", "That's too expensive."],
          ["Haben Sie etwas Günstigeres?", "Do you have something cheaper?"],
          ["Ich nehme das.", "I'll take that."],
          ["Kann ich mit Karte bezahlen?", "Can I pay by card?"],
          ["Können Sie mir helfen?", "Can you help me?"]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Complete: 'Ich bezahle ___ (der Einkauf).'", answer: "den Einkauf (accusative)" },
      { prompt: "Dative of 'mit der Tasche'? Is this correct?", answer: "Yes, 'die Tasche' -> 'mit der Tasche' is correct dative." },
      { prompt: "Translate: 'How much does this cost?'", answer: "Was kostet das?" },
      { prompt: "Say 'too expensive' in German.", answer: "zu teuer" },
      { prompt: "Correct: 'Ich will das kaufen.' (more politely)", answer: "Ich möchte das kaufen." }
    ]
  },

  "A2_lesson_7": { // Essen und Restaurantbesuch
    conceptId: "a2.restaurant-food",
    prerequisiteConceptIds: ["a2.shopping-services"],
    remediationLessonId: "A2_lesson_6",
    conceptsTaught: ["a2.restaurant-food", "a2_dative_personal_pronouns_food"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_6" }],
    linkedPracticeConceptTags: ["a2_food_vocab", "a2_dative_pronouns"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_dative_articles", "a2_shopping_vocab"],
    estimatedMinutes: 20,
    commonMistakes: [
      "'Ich möchte etwas essen.' NOT 'Ich möchte etwas zu essen.' (zu is not needed here).",
      "'Schmeckt es dir?' uses dative (dir), not accusative (dich).",
      "'Das schmeckt mir gut.' - 'mir' is dative, means 'to me'.",
      "'Bestellen' takes accusative: 'Ich bestelle einen Salat.'",
      "'Die Speisekarte' is the menu, not 'das Menu' (which is a set meal)."
    ],
    formsTables: [
      {
        title: "Restaurant phrases",
        rows: [
          ["Ich hätte gern...", "I would like (polite)...", "Ich hätte gern die Suppe."],
          ["Könnte ich die Speisekarte haben?", "Could I have the menu?", "Könnte ich die Speisekarte haben?"],
          ["Was empfehlen Sie?", "What do you recommend?", "Was empfehlen Sie heute?"],
          ["Ich möchte bestellen.", "I would like to order.", "Ich möchte bestellen, bitte."],
          ["Schmeckt es Ihnen?", "Do you like it? (formal)", "Schmeckt es Ihnen, Herr Doktor?"],
          ["Es hat sehr gut geschmeckt.", "It was very tasty.", "Es hat sehr gut geschmeckt."],
          ["Die Rechnung, bitte!", "The bill, please!", "Die Rechnung, bitte!"]
        ]
      },
      {
        title: "Dative personal pronouns (for 'schmecken')",
        rows: [
          ["mir", "to me", "Das schmeckt mir gut."],
          ["dir", "to you (inf.)", "Schmeckt dir die Suppe?"],
          ["ihm", "to him", "Der Salat schmeckt ihm nicht."],
          ["ihr", "to her", "Der Wein schmeckt ihr."],
          ["uns", "to us", "Das Essen schmeckt uns."],
          ["euch", "to you (pl.)", "Schmeckt euch das?"],
          ["ihnen", "to them", "Die Pizza schmeckt ihnen."],
          ["Ihnen", "to you (formal)", "Schmeckt es Ihnen?"]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Complete: 'Das schmeckt ___ (ich) sehr gut.'", answer: "mir" },
      { prompt: "Translate: 'What do you recommend?'", answer: "Was empfehlen Sie?" },
      { prompt: "Correct: 'Ich möchte etwas zu trinken bestellen.'", answer: "This is actually correct!" },
      { prompt: "Say 'The bill, please.'", answer: "Die Rechnung, bitte!" },
      { prompt: "What is 'die Speisekarte'?", answer: "the menu" }
    ]
  },

  "A2_lesson_8": { // Arbeit und Arbeitsplatz
    conceptId: "a2.work-workplace",
    prerequisiteConceptIds: ["a2.restaurant-food", "a2_review_a1_jobs"],
    remediationLessonId: "A1_lesson_9",
    conceptsTaught: ["a2.work-workplace", "a2_two_way_prepositions_work"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_7" }],
    linkedPracticeConceptTags: ["a2_work_vocab", "a2_two_way_prepositions"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_restaurant_vocab", "a2_dative_pronouns"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Ich arbeite in einer Praxis' (in + dative = location) vs 'Ich gehe in eine Praxis' (in + accusative = direction).",
      "'Der Kollege' vs 'die Kollegin' - male vs female colleague.",
      "'Die Firma' is feminine, 'das Unternehmen' is neuter.",
      "'Beruf' vs 'Arbeit': 'Was ist Ihr Beruf?' (What's your profession?) vs 'Ich gehe zur Arbeit.' (I go to work).",
      "'Schicht' (shift) - die Frühschicht, die Spätschicht, die Nachtschicht."
    ],
    formsTables: [
      {
        title: "Two-way prepositions at work (location vs direction)",
        rows: [
          ["in (wo?)", "in der Praxis (dative)", "Ich arbeite in der Praxis."],
          ["in (wohin?)", "in die Praxis (accusative)", "Ich gehe in die Praxis."],
          ["auf (wo?)", "auf der Station", "Die Schwester ist auf der Station."],
          ["auf (wohin?)", "auf die Station", "Die Schwester geht auf die Station."],
          ["an (wo?)", "am Schreibtisch", "Der Arzt sitzt am Schreibtisch."],
          ["an (wohin?)", "an den Schreibtisch", "Der Arzt geht an den Schreibtisch."]
        ]
      },
      {
        title: "Workplace vocabulary",
        rows: [
          ["die Praxis", "practice/clinic", "Ich arbeite in einer Praxis."],
          ["der Arzt / die Ärztin", "doctor (male/female)", "Der Arzt untersucht den Patienten."],
          ["die Sprechstunde", "office hours", "Die Sprechstunde ist von 9 bis 12 Uhr."],
          ["die Krankenschwester", "nurse (female)", "Die Schwester bringt Medikamente."],
          ["der Kollege / die Kollegin", "colleague", "Mein Kollege hilft mir."],
          ["die Schicht", "shift", "Heute habe ich Frühschicht."],
          ["das Büro", "office", "Das Büro ist im zweiten Stock."]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Translate: 'I work in a clinic.' (location)", answer: "Ich arbeite in einer Praxis." },
      { prompt: "Is it dative or accusative? 'Ich gehe ___ (die Praxis).' (direction)", answer: "accusative: in die Praxis" },
      { prompt: "What is 'die Schicht' in English?", answer: "shift" },
      { prompt: "'wo' or 'wohin'? 'Der Arzt sitzt ___ Schreibtisch.'", answer: "am Schreibtisch (wo -> dative)" },
      { prompt: "Translate: 'He is a colleague.' (male)", answer: "Er ist ein Kollege." }
    ]
  },

  "A2_lesson_9": { // Bildung und Sprachkurse
    conceptId: "a2.education-language",
    prerequisiteConceptIds: ["a2.work-workplace"],
    remediationLessonId: "A2_lesson_8",
    conceptsTaught: ["a2.education-language", "a2_modal_verbs_past"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_8" }],
    linkedPracticeConceptTags: ["a2_education_vocab", "a2_modal_verbs_past"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_work_vocab", "a2_two_way_prepositions"],
    estimatedMinutes: 22,
    commonMistakes: [
      "'Der Kurs' vs 'der Sprachkurs' - adding details: 'der Deutschkurs', 'der Medizinkurs'.",
      "'An einem Kurs teilnehmen' - 'teilnehmen' requires dative (an + dative: an dem Kurs = am Kurs).",
      "'Die Prüfung bestehen' - 'bestehen' (to pass) takes accusative: 'Ich bestehe die Prüfung.'",
      "'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.' - weil clause: verb at the end.",
      "'Der Unterricht' (class/teaching) vs 'die Stunde' (lesson period of 45/60 min)."
    ],
    formsTables: [
      {
        title: "Modal verbs in Präteritum (simple past)",
        rows: [
          ["ich konnte / musste / wollte / durfte / sollte", "I could/had to/wanted to/was allowed to/should"],
          ["du konntest / musstest / wolltest / durftest / solltest", "you could..."],
          ["er/sie/es konnte / musste / ...", "he/she/it could..."],
          ["wir konnten / mussten / ...", "we could..."],
          ["ihr konntet / musstet / ...", "you (pl.) could..."],
          ["sie / Sie konnten / mussten / ...", "they/you (formal) could..."],
          ["Example: Ich konnte gestern nicht kommen.", "I couldn't come yesterday."],
          ["Example: Er musste viel lernen.", "He had to study a lot."]
        ]
      },
      {
        title: "Education vocabulary",
        rows: [
          ["der Sprachkurs", "language course", "Ich besuche einen Sprachkurs."],
          ["der Unterricht", "class/lesson", "Der Unterricht beginnt um 9 Uhr."],
          ["die Prüfung", "exam", "Die Prüfung ist im Juni."],
          ["das Zertifikat", "certificate", "Ich möchte ein Zertifikat bekommen."],
          ["der Student / die Studentin", "student (male/female)", "Die Studentin lernt Deutsch."],
          ["bestehen", "to pass", "Ich habe die Prüfung bestanden."],
          ["teilnehmen an (+dat.)", "to participate in", "Ich nehme am Kurs teil."]
        ]
      }
    ],
    miniDrills: [
      { prompt: "Translate: 'I had to study.' using modal past.", answer: "Ich musste lernen." },
      { prompt: "Complete: 'Ich nehme ___ (der Kurs) teil.'", answer: "am Kurs (an + dem = am, dative)" },
      { prompt: "Correct: 'Ich wollte gestern nach Hause gehen.' Is this correct?", answer: "Yes, it's correct. 'I wanted to go home yesterday.'" },
      { prompt: "What is 'die Prüfung bestehen'?", answer: "to pass the exam" },
      { prompt: "Translate: 'I couldn't come yesterday.'", answer: "Ich konnte gestern nicht kommen." }
    ]
  },

  "A2_lesson_10": { // Wohnungssuche und Mieten
    conceptId: "a2.housing-rental",
    prerequisiteConceptIds: ["a2.education-language"],
    remediationLessonId: "A2_lesson_9",
    conceptsTaught: ["a2.housing-rental", "a2_adjective_endings"],
    prerequisites: [{ format: "completed", lessonId: "A2_lesson_9" }],
    linkedPracticeConceptTags: ["a2_housing_vocab", "a2_adjective_endings"],
    lessonDepthVersion: 1,
    trackTags: ["goethe", "full-mastery"],
    remediationTags: ["a2_education_vocab", "a2_modal_verbs_past"],
    estimatedMinutes