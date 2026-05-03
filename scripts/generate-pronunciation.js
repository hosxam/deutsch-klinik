// Run this script: node scripts/generate-pronunciation.js
// It generates src/data/pronunciationGuides.json

const fs = require('fs');
const path = require('path');

const guides = {};

// ====== A1 ======
guides.A1_lesson_1 = { title: "Greetings & Introductions", words: [
  { word: "Hallo", hint: "HAH-loh", warning: null, meaning: "hello" },
  { word: "Guten Morgen", hint: "GOO-ten MOR-gen", meaning: "good morning" },
  { word: "Guten Abend", hint: "GOO-ten AH-bent", meaning: "good evening" },
  { word: "Tsch\u00fcss", hint: "CHOOSS", warning: "Short, sharp ss sound. Not like English 'choose'", meaning: "bye" },
  { word: "ich hei\u00dfe", hint: "ikh HY-suh", warning: "ch is soft like Scottish 'loch'. \u00df = ss", meaning: "I am called" },
  { word: "Auf Wiedersehen", hint: "owf VEE-der-zay-en", meaning: "goodbye (formal)" },
  { word: "Freut mich", hint: "froyt mikh", warning: "eu sounds like English 'oy'", meaning: "nice to meet you" },
  { word: "der Name", hint: "dair NAH-muh", meaning: "the name" }
]};

guides.A1_lesson_2 = { title: "Alphabet & Numbers", words: [
  { word: "der Buchstabe", hint: "dair BOOKH-shtah-buh", warning: "ch is soft. Buch- rhymes with Scottish 'loch'", meaning: "the letter" },
  { word: "das Alphabet", hint: "dahs al-fah-BEHT", warning: "Stress on last syllable", meaning: "the alphabet" },
  { word: "zwanzig", hint: "TSVAHN-tsikh", warning: "ig at end = -ikh, not -ig", meaning: "twenty" },
  { word: "einundzwanzig", hint: "EYEN-oont-TSVAHN-tsikh", warning: "und is reduced: 'oont'", meaning: "twenty-one" },
  { word: "die Nummer", hint: "dee NOOM-er", meaning: "the number" },
  { word: "buchstabieren", hint: "bookH-shtah-BEE-ren", meaning: "to spell" },
  { word: "die Telefonnummer", hint: "dee teh-leh-FOHN-noom-er", meaning: "the phone number" }
]};

guides.A1_lesson_3 = { title: "My Family", words: [
  { word: "die Familie", hint: "dee fah-MEE-lee-uh", meaning: "the family" },
  { word: "der Vater", hint: "dair FAH-ter", warning: "V is pronounced as F in German", meaning: "the father" },
  { word: "die Mutter", hint: "dee MOO-ter", meaning: "the mother" },
  { word: "der Bruder", hint: "dair BROO-der", meaning: "the brother" },
  { word: "die Schwester", hint: "dee SHVES-ter", meaning: "the sister" },
  { word: "der Sohn", hint: "dair Zohn", warning: "S at start = voiced Z", meaning: "the son" },
  { word: "die Tochter", hint: "dee TOKH-ter", warning: "ch is soft from the throat", meaning: "the daughter" }
]};

guides.A1_lesson_4 = { title: "In the Restaurant", words: [
  { word: "das Restaurant", hint: "dahs res-toh-RAHNT", warning: "French pronunciation, stress on last syllable", meaning: "the restaurant" },
  { word: "bitte", hint: "BIT-tuh", meaning: "please / you're welcome" },
  { word: "danke", hint: "DAHN-kuh", meaning: "thank you" },
  { word: "die Speisekarte", hint: "dee SHPY-zuh-kar-tuh", warning: "ei = eye", meaning: "the menu" },
  { word: "die Rechnung", hint: "dee REKH-noong", warning: "ch is soft, -ung = -oong", meaning: "the bill" },
  { word: "der Tisch", hint: "dair teesh", meaning: "the table" },
  { word: "der Kellner", hint: "dair KEL-ner", meaning: "the waiter" }
]};

guides.A1_lesson_5 = { title: "Asking for Directions", words: [
  { word: "links", hint: "links", meaning: "left" },
  { word: "rechts", hint: "rekhts", warning: "ch is soft, not hard k", meaning: "right" },
  { word: "geradeaus", hint: "ge-RAH-duh-OUSS", meaning: "straight ahead" },
  { word: "die Stra\u00dfe", hint: "dee SHTRAH-suh", warning: "\u00df = ss", meaning: "the street" },
  { word: "die Kreuzung", hint: "dee KROYT-soong", warning: "eu = oy", meaning: "the intersection" },
  { word: "die Ampel", hint: "dee AHM-pel", meaning: "the traffic light" },
  { word: "Entschuldigung", hint: "ent-SHOOL-di-goong", warning: "ent-: t is almost silent", meaning: "excuse me" }
]};

guides.A1_lesson_6 = { title: "Telling Time", words: [
  { word: "die Uhrzeit", hint: "dee OOR-tsite", meaning: "the time" },
  { word: "die Uhr", hint: "dee oor", meaning: "the clock" },
  { word: "f\u00fcnf", hint: "fuenf", warning: "\u00fc: round lips and say ee", meaning: "five" },
  { word: "zehn", hint: "tsayn", warning: "z = ts", meaning: "ten" },
  { word: "halb", hint: "halp", meaning: "half" },
  { word: "Viertel", hint: "FEER-tel", warning: "V sounds like F", meaning: "quarter" },
  { word: "Minute", hint: "mee-NOO-tuh", meaning: "minute" }
]};

guides.A1_lesson_7 = { title: "Days & Months", words: [
  { word: "Montag", hint: "MOHN-tahk", warning: "Tag = -tahk, not 'tag'", meaning: "Monday" },
  { word: "Mittwoch", hint: "MIT-vokh", meaning: "Wednesday" },
  { word: "Samstag", hint: "ZAHMS-tahk", warning: "S = Z", meaning: "Saturday" },
  { word: "Januar", hint: "YAH-noo-ahr", warning: "J = English Y", meaning: "January" },
  { word: "Februar", hint: "FAY-broo-ahr", meaning: "February" },
  { word: "heute", hint: "HOY-tuh", warning: "eu = oy", meaning: "today" },
  { word: "morgen", hint: "MOR-gen", meaning: "tomorrow" }
]};

guides.A1_lesson_8 = { title: "Hobbies & Free Time", words: [
  { word: "das Hobby", hint: "dahs HO-bee", meaning: "the hobby" },
  { word: "lesen", hint: "LAY-zen", warning: "s between vowels = voiced Z", meaning: "to read" },
  { word: "spielen", hint: "SHPEE-len", meaning: "to play" },
  { word: "reisen", hint: "RY-zen", warning: "ei = eye", meaning: "to travel" },
  { word: "schwimmen", hint: "SHVIM-en", meaning: "to swim" },
  { word: "die Musik", hint: "dee moo-ZEEK", warning: "Stress on last syllable", meaning: "the music" },
  { word: "fernsehen", hint: "FERN-zay-en", meaning: "to watch TV" }
]};

guides.A1_lesson_9 = { title: "Grocery Shopping", words: [
  { word: "der Supermarkt", hint: "dair ZOO-per-markt", warning: "S = Z", meaning: "the supermarket" },
  { word: "das Brot", hint: "dahs broht", meaning: "the bread" },
  { word: "die Milch", hint: "dee milkh", warning: "ch is soft, not k", meaning: "the milk" },
  { word: "der K\u00e4se", hint: "dair KAY-zuh", warning: "\u00e4 is like 'e' in 'bed'", meaning: "the cheese" },
  { word: "die Flasche", hint: "dee FLAH-shuh", meaning: "the bottle" },
  { word: "kosten", hint: "KOS-ten", meaning: "to cost" },
  { word: "bezahlen", hint: "beh-TSAH-len", warning: "z = ts", meaning: "to pay" }
]};

guides.A1_lesson_10 = { title: "Ordering at a Restaurant", words: [
  { word: "bestellen", hint: "beh-SHTEL-en", meaning: "to order" },
  { word: "das Essen", hint: "dahs ES-en", meaning: "the food" },
  { word: "das Getr\u00e4nk", hint: "dahs ge-TRENK", meaning: "the drink" },
  { word: "der Saft", hint: "dair zahft", meaning: "the juice" },
  { word: "das Wasser", hint: "dahs VAH-ser", warning: "W = English v", meaning: "the water" },
  { word: "der Wein", hint: "dair vine", warning: "W = v", meaning: "the wine" },
  { word: "schmecken", hint: "SHMEK-en", meaning: "to taste" }
]};

guides.A1_lesson_11 = { title: "Weather", words: [
  { word: "das Wetter", hint: "dahs VET-er", warning: "W = v", meaning: "the weather" },
  { word: "die Sonne", hint: "dee ZON-uh", meaning: "the sun" },
  { word: "der Regen", hint: "dair RAY-gen", meaning: "the rain" },
  { word: "der Schnee", hint: "dair shnay", meaning: "the snow" },
  { word: "der Wind", hint: "dair vint", meaning: "the wind" },
  { word: "warm", hint: "varm", meaning: "warm" },
  { word: "kalt", hint: "kalt", meaning: "cold" },
  { word: "die Wolke", hint: "dee VOL-kuh", meaning: "the cloud" }
]};

guides.A1_lesson_12 = { title: "Colors & Clothing", words: [
  { word: "rot", hint: "roht", meaning: "red" },
  { word: "blau", hint: "blow", warning: "au = ow as in 'cow'", meaning: "blue" },
  { word: "gr\u00fcn", hint: "groon", warning: "\u00fc: round lips and say ee", meaning: "green" },
  { word: "gelb", hint: "gelp", warning: "b at end = p", meaning: "yellow" },
  { word: "schwarz", hint: "shvarts", warning: "z = ts", meaning: "black" },
  { word: "wei\u00df", hint: "vice", warning: "ei = eye", meaning: "white" },
  { word: "die Hose", hint: "dee HOH-zuh", meaning: "the pants" }
]};

guides.A1_lesson_13 = { title: "My Family (Extended)", words: [
  { word: "der Opa", hint: "dair OH-pah", meaning: "grandpa" },
  { word: "die Oma", hint: "dee OH-mah", meaning: "grandma" },
  { word: "der Onkel", hint: "dair ON-kel", meaning: "the uncle" },
  { word: "die Tante", hint: "dee TAN-tuh", meaning: "the aunt" },
  { word: "der Cousin", hint: "dair koo-ZAHNG", warning: "French nasal -in sound", meaning: "the cousin (male)" },
  { word: "die Cousine", hint: "dee koo-ZEE-nuh", meaning: "the cousin (female)" },
  { word: "der Hund", hint: "dair hoont", meaning: "the dog" }
]};

guides.A1_lesson_14 = { title: "My Home", words: [
  { word: "das Haus", hint: "dahs howss", warning: "au = ow", meaning: "the house" },
  { word: "die Wohnung", hint: "dee VOH-noong", meaning: "the apartment" },
  { word: "das Zimmer", hint: "dahs TSIM-er", meaning: "the room" },
  { word: "die K\u00fcche", hint: "dee KUEKH-uh", warning: "\u00fc + ch: round lips then soft ch", meaning: "the kitchen" },
  { word: "das Badezimmer", hint: "dahs BAH-duh-tsim-er", meaning: "the bathroom" },
  { word: "das Schlafzimmer", hint: "dahs SHLAHF-tsim-er", meaning: "the bedroom" },
  { word: "der Tisch", hint: "dair teesh", meaning: "the table" }
]};

guides.A1_lesson_15 = { title: "My Daily Routine", words: [
  { word: "aufwachen", hint: "OWF-vakh-en", meaning: "to wake up" },
  { word: "aufstehen", hint: "OWF-shtay-en", meaning: "to get up" },
  { word: "fr\u00fchst\u00fccken", hint: "FROO-shtuek-en", warning: "\u00fc: round lips", meaning: "to have breakfast" },
  { word: "die Arbeit", hint: "dee AR-bite", meaning: "the work" },
  { word: "nach Hause", hint: "nakh HOW-zuh", warning: "ch is soft", meaning: "home (direction)" },
  { word: "schlafen", hint: "SHLAH-fen", meaning: "to sleep" },
  { word: "putzen", hint: "POOT-sen", meaning: "to clean" }
]};

guides.A1_lesson_16 = { title: "Body Parts & Health", words: [
  { word: "der Kopf", hint: "dair kopf", meaning: "the head" },
  { word: "die Hand", hint: "dee hant", warning: "d at end = t", meaning: "the hand" },
  { word: "das Auge", hint: "dahs OW-guh", warning: "au = ow", meaning: "the eye" },
  { word: "die Nase", hint: "dee NAH-zuh", meaning: "the nose" },
  { word: "der Mund", hint: "dair moont", meaning: "the mouth" },
  { word: "der Arzt", hint: "dair artst", warning: "z = ts", meaning: "the doctor" },
  { word: "krank", hint: "krank", meaning: "sick" }
]};

guides.A1_lesson_17 = { title: "Animals at the Zoo", words: [
  { word: "der Hund", hint: "dair hoont", meaning: "the dog" },
  { word: "die Katze", hint: "dee KAT-suh", meaning: "the cat" },
  { word: "der Vogel", hint: "dair FOH-gel", warning: "V = f", meaning: "the bird" },
  { word: "das Pferd", hint: "dahs pferd", warning: "pf is one sound: blow through both lips", meaning: "the horse" },
  { word: "der Fisch", hint: "dair fish", meaning: "the fish" },
  { word: "der Elefant", hint: "dair eh-leh-FANT", meaning: "the elephant" },
  { word: "der Affe", hint: "dair AH-fuh", meaning: "the monkey" }
]};

guides.A1_lesson_18 = { title: "My City", words: [
  { word: "die Stadt", hint: "dee shtat", warning: "St- at start = sht-", meaning: "the city" },
  { word: "das Kino", hint: "dahs KEE-noh", meaning: "the cinema" },
  { word: "die Schule", hint: "dee SHOO-luh", meaning: "the school" },
  { word: "der Park", hint: "dair park", meaning: "the park" },
  { word: "die Kirche", hint: "dee KEER-khuh", warning: "ch is soft after vowels", meaning: "the church" },
  { word: "der Bahnhof", hint: "dair BAHN-hohf", meaning: "the train station" },
  { word: "das Krankenhaus", hint: "dahs KRAHN-ken-howss", meaning: "the hospital" }
]};

guides.A1_lesson_19 = { title: "Introducing Yourself", words: [
  { word: "vorstellen", hint: "FOR-shtel-en", meaning: "to introduce" },
  { word: "kommen aus", hint: "KOM-en owss", meaning: "to come from" },
  { word: "wohnen", hint: "VOH-nen", meaning: "to live (somewhere)" },
  { word: "der Beruf", hint: "dair beh-ROOF", meaning: "the profession" },
  { word: "das Alter", hint: "dahs AHL-ter", meaning: "the age" },
  { word: "ledig", hint: "LAY-dikh", warning: "ig at end = -ikh", meaning: "single" },
  { word: "verheiratet", hint: "fer-HY-rah-tet", meaning: "married" }
]};

guides.A1_lesson_20 = { title: "Ordering at a Caf\u00e9", words: [
  { word: "der Kaffee", hint: "dair kah-FAY", warning: "Stress on second syllable", meaning: "the coffee" },
  { word: "der Tee", hint: "dair tay", meaning: "the tea" },
  { word: "der Kuchen", hint: "dair KOO-khen", warning: "ch is soft", meaning: "the cake" },
  { word: "das St\u00fcck", hint: "dahs shtuek", meaning: "the piece" },
  { word: "die Tasse", hint: "dee TAH-suh", meaning: "the cup" },
  { word: "hei\u00df", hint: "hice", warning: "ei = eye", meaning: "hot" },
  { word: "mit Sahne", hint: "mit ZAH-nuh", meaning: "with cream" }
]};

guides.A1_lesson_21 = { title: "Transportation", words: [
  { word: "das Auto", hint: "dahs OW-toh", warning: "au = ow", meaning: "the car" },
  { word: "der Bus", hint: "dair booss", meaning: "the bus" },
  { word: "der Zug", hint: "dair tsook", warning: "z = ts, g at end = k", meaning: "the train" },
  { word: "das Fahrrad", hint: "dahs FAHR-raht", meaning: "the bicycle" },
  { word: "die U-Bahn", hint: "dee OO-bahn", meaning: "the subway" },
  { word: "die Haltestelle", hint: "dee HAL-tuh-shtel-uh", meaning: "the stop" },
  { word: "das Taxi", hint: "dahs TAH-ksee", meaning: "the taxi" }
]};

guides.A1_lesson_22 = { title: "Making Phone Calls", words: [
  { word: "das Telefon", hint: "dahs teh-leh-FOHN", meaning: "the telephone" },
  { word: "das Handy", hint: "dahs HEN-dee", warning: "German uses this for mobile", meaning: "the mobile phone" },
  { word: "anrufen", hint: "AHN-roo-fen", meaning: "to call" },
  { word: "die Nachricht", hint: "dee NAKH-rikht", warning: "ch is soft in both places", meaning: "the message" },
  { word: "w\u00e4hlen", hint: "VAY-len", meaning: "to dial" },
  { word: "klingeln", hint: "KLING-eln", meaning: "to ring" },
  { word: "besetzt", hint: "beh-ZETST", meaning: "busy (engaged)" }
]};

guides.A1_lesson_23 = { title: "Celebrating Birthdays", words: [
  { word: "der Geburtstag", hint: "dair geh-BOORTS-tahk", meaning: "the birthday" },
  { word: "feiern", hint: "FY-ern", warning: "ei = eye", meaning: "to celebrate" },
  { word: "das Geschenk", hint: "dahs geh-SHENK", meaning: "the gift" },
  { word: "einladen", hint: "EYEN-lah-den", meaning: "to invite" },
  { word: "die Kerze", hint: "dee KER-tsuh", warning: "z = ts", meaning: "the candle" },
  { word: "der Kuchen", hint: "dair KOO-khen", meaning: "the cake" }
]};

guides.A1_lesson_24 = { title: "Numbers & Math", words: [
  { word: "rechnen", hint: "REKH-nen", warning: "ch is soft", meaning: "to calculate" },
  { word: "die Zahl", hint: "dee tsahl", meaning: "the number" },
  { word: "plus", hint: "plooss", meaning: "plus" },
  { word: "minus", hint: "MEE-nooss", meaning: "minus" },
  { word: "hundert", hint: "HOON-dert", meaning: "hundred" },
  { word: "tausend", hint: "TOW-zent", warning: "au = ow", meaning: "thousand" },
  { word: "die Rechnung", hint: "dee REKH-noong", meaning: "the bill" }
]};

guides.A1_lesson_25 = { title: "At School", words: [
  { word: "die Schule", hint: "dee SHOO-luh", meaning: "the school" },
  { word: "der Lehrer", hint: "dair LAY-rer", meaning: "the teacher (male)" },
  { word: "die Lehrerin", hint: "dee LAY-reh-rin", meaning: "the teacher (female)" },
  { word: "der Sch\u00fcler", hint: "dair SHUE-ler", meaning: "the student (male)" },
  { word: "das Buch", hint: "dahs bookh", warning: "ch is soft, not 'book' in English", meaning: "the book" },
  { word: "der Bleistift", hint: "dair BLY-shtift", meaning: "the pencil" },
  { word: "die Hausaufgabe", hint: "dee HOWSS-owf-gah-buh", meaning: "the homework" }
]};

// ====== A2 ======
guides.A2_lesson_1 = { title: "Review of A1 & Self-Introduction", words: [
  { word: "wiederholen", hint: "VEE-der-hoh-len", warning: "W = v", meaning: "to repeat" },
  { word: "die Vorstellung", hint: "dee FOR-shtel-oong", meaning: "the introduction" },
  { word: "der Nachname", hint: "dair NAKH-nah-muh", meaning: "the surname" },
  { word: "der Vorname", hint: "dair FOR-nah-muh", meaning: "the first name" },
  { word: "die Adresse", hint: "dee ah-DRES-uh", meaning: "the address" },
  { word: "die Nationalit\u00e4t", hint: "dee nah-tsee-oh-nah-lee-TAYT", warning: "ti = tsee", meaning: "the nationality" }
]};

guides.A2_lesson_2 = { title: "Daily Routine in Detail", words: [
  { word: "der Tagesablauf", hint: "dair TAH-guhs-ahp-lowf", meaning: "the daily routine" },
  { word: "aufr\u00e4umen", hint: "OWF-roy-men", meaning: "to tidy up" },
  { word: "einkaufen", hint: "EYEN-kow-fen", meaning: "to go shopping" },
  { word: "vorbereiten", hint: "FOR-beh-ry-ten", meaning: "to prepare" },
  { word: "erledigen", hint: "er-LAY-di-gen", meaning: "to get done" },
  { word: "ausruhen", hint: "OWSS-roo-en", meaning: "to rest" }
]};

guides.A2_lesson_3 = { title: "Past Activities (Perfekt)", words: [
  { word: "gegangen", hint: "geh-GAHNG-en", meaning: "gone / walked" },
  { word: "gesehen", hint: "geh-ZAY-en", meaning: "seen" },
  { word: "gefahren", hint: "geh-FAH-ren", meaning: "driven / traveled" },
  { word: "geschlafen", hint: "geh-SHLAH-fen", meaning: "slept" },
  { word: "gegessen", hint: "geh-GES-en", meaning: "eaten" },
  { word: "getrunken", hint: "geh-TROON-ken", meaning: "drunk" },
  { word: "gemacht", hint: "geh-MAKHT", meaning: "done / made" }
]};

guides.A2_lesson_4 = { title: "Travel & Transportation", words: [
  { word: "die Reise", hint: "dee RY-zuh", warning: "ei = eye", meaning: "the trip" },
  { word: "der Flughafen", hint: "dair FLOOK-hah-fen", meaning: "the airport" },
  { word: "der Bahnhof", hint: "dair BAHN-hohf", meaning: "the train station" },
  { word: "die Fahrkarte", hint: "dee FAHR-kar-tuh", meaning: "the ticket" },
  { word: "der Koffer", hint: "dair KOF-er", meaning: "the suitcase" },
  { word: "abfahren", hint: "AP-fah-ren", meaning: "to depart" },
  { word: "ankommen", hint: "AHN-kom-en", meaning: "to arrive" }
]};

guides.A2_lesson_5 = { title: "Hotel & Accommodation", words: [
  { word: "das Hotel", hint: "dahs hoh-TEL", meaning: "the hotel" },
  { word: "das Zimmer", hint: "dahs TSIM-er", meaning: "the room" },
  { word: "der Schl\u00fcssel", hint: "dair SHLUES-el", meaning: "the key" },
  { word: "die Reservierung", hint: "dee reh-zer-VEE-roong", meaning: "the reservation" },
  { word: "der Fr\u00fchst\u00fcck", hint: "dair FROO-shtuek", meaning: "the breakfast" },
  { word: "bezahlen", hint: "beh-TSAH-len", meaning: "to pay" }
]};

guides.A2_lesson_6 = { title: "Shopping & Services", words: [
  { word: "der Laden", hint: "dair LAH-den", meaning: "the shop" },
  { word: "die Gr\u00f6\u00dfe", hint: "dee GRUR-suh", warning: "\u00d6: round lips and say 'air'", meaning: "the size" },
  { word: "passen", hint: "PAH-sen", meaning: "to fit" },
  { word: "anprobieren", hint: "AHN-proh-bee-ren", meaning: "to try on" },
  { word: "der Preis", hint: "dair price", warning: "ei = eye", meaning: "the price" },
  { word: "die Quittung", hint: "dee KVIT-oong", warning: "Q = kv", meaning: "the receipt" }
]};

guides.A2_lesson_7 = { title: "Eating & Restaurant Visit", words: [
  { word: "die Vorspeise", hint: "dee FOR-shpy-zuh", meaning: "the starter" },
  { word: "die Hauptspeise", hint: "dee HOWPT-shpy-zuh", meaning: "the main course" },
  { word: "der Nachtisch", hint: "dair NAKH-tish", meaning: "the dessert" },
  { word: "die Bestellung", hint: "dee beh-SHTEL-oong", meaning: "the order" },
  { word: "die Bedienung", hint: "dee beh-DEE-noong", meaning: "the service" },
  { word: "der Geschmack", hint: "dair geh-SHMAK", meaning: "the taste" }
]};

guides.A2_lesson_8 = { title: "Work & Workplace", words: [
  { word: "die Arbeit", hint: "dee AR-bite", meaning: "the work / job" },
  { word: "der Arbeitsplatz", hint: "dair AR-bites-plats", warning: "z = ts", meaning: "the workplace" },
  { word: "der Kollege", hint: "dair koh-LAY-guh", meaning: "the colleague" },
  { word: "die Firma", hint: "dee FEER-mah", meaning: "the company" },
  { word: "die Besprechung", hint: "dee beh-SHPREKH-oong", warning: "ch is soft", meaning: "the meeting" },
  { word: "verdienen", hint: "fer-DEE-nen", meaning: "to earn" },
  { word: "die Bewerbung", hint: "dee buh-VER-boong", meaning: "the application" }
]};

guides.A2_lesson_9 = { title: "Education & Language Courses", words: [
  { word: "der Kurs", hint: "dair koors", meaning: "the course" },
  { word: "der Sprachkurs", hint: "dair SHPRAKH-koors", meaning: "the language course" },
  { word: "die Pr\u00fcfung", hint: "dee PROO-foong", meaning: "the exam" },
  { word: "die Note", hint: "dee NOH-tuh", meaning: "the grade" },
  { word: "der Student", hint: "dair shtoo-DENT", meaning: "the student" },
  { word: "der Stoff", hint: "dair shtof", meaning: "the material" }
]};

guides.A2_lesson_10 = { title: "Apartment Search & Renting", words: [
  { word: "die Wohnung", hint: "dee VOH-noong", meaning: "the apartment" },
  { word: "die Miete", hint: "dee MEE-tuh", meaning: "the rent" },
  { word: "der Vermieter", hint: "dair fer-MEE-ter", meaning: "the landlord" },
  { word: "der Vertrag", hint: "dair fer-TRAHK", meaning: "the contract" },
  { word: "die Kaution", hint: "dee kow-TSEE-ohn", meaning: "the deposit" },
  { word: "die Nebenkosten", hint: "dee NAY-ben-kos-ten", meaning: "the utilities" }
]};

guides.A2_lesson_11 = { title: "Health & Doctor Visit", words: [
  { word: "die Gesundheit", hint: "dee guh-ZOONT-hite", meaning: "the health" },
  { word: "der Arzt", hint: "dair artst", meaning: "the doctor" },
  { word: "das Krankenhaus", hint: "dahs KRAHN-ken-howss", meaning: "the hospital" },
  { word: "die Praxis", hint: "dee PRAK-sis", meaning: "the practice / clinic" },
  { word: "der Termin", hint: "dair ter-MEEN", meaning: "the appointment" },
  { word: "die Versicherung", hint: "dee fer-ZIKH-er-oong", meaning: "the insurance" }
]};

guides.A2_lesson_12 = { title: "Pharmacy & Medication", words: [
  { word: "die Apotheke", hint: "dee ah-poh-TAY-kuh", meaning: "the pharmacy" },
  { word: "das Medikament", hint: "dahs meh-dee-kah-MENT", meaning: "the medication" },
  { word: "die Tablette", hint: "dee tah-BLET-uh", meaning: "the tablet" },
  { word: "die Salbe", hint: "dee ZAL-buh", meaning: "the ointment" },
  { word: "die Dosis", hint: "dee DOH-zis", meaning: "the dosage" },
  { word: "verschreiben", hint: "fer-SHRY-ben", meaning: "to prescribe" }
]};

guides.A2_lesson_13 = { title