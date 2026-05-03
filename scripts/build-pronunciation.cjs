const fs = require('fs');
const guides = {};

function w(word, hint, meaning, warning) {
  return { word, hint, meaning: meaning || null, warning: warning || null };
}

// ========== A1 ==========
guides.A1_lesson_1 = { title: "Greetings & Introductions", words: [
  w("Hallo","HAH-loh","hello"),
  w("Guten Morgen","GOO-ten MOR-gen","good morning","The g in Morgen is not hard"),
  w("Guten Abend","GOO-ten AH-bent","good evening"),
  w("Tsch\u00fcss","CHOOSS","bye","Short, sharp ss sound. Not 'choose'"),
  w("ich hei\u00dfe","ikh HY-suh","I am called","ch is soft like Scottish 'loch'. \u00df = ss"),
  w("Auf Wiedersehen","owf VEE-der-zay-en","goodbye (formal)"),
  w("Freut mich","froyt mikh","nice to meet you","eu sounds like 'oy'"),
  w("der Name","dair NAH-muh","the name")
]};
guides.A1_lesson_2 = { title: "Alphabet & Numbers", words: [
  w("der Buchstabe","dair BOOKH-shtah-buh","the letter","ch is soft"),
  w("das Alphabet","dahs al-fah-BEHT","the alphabet","Stress on last syllable"),
  w("zwanzig","TSVAHN-tsikh","twenty","ig at end = -ikh"),
  w("einundzwanzig","EYEN-oont-TSVAHN-tsikh","twenty-one","und is reduced: oont"),
  w("die Nummer","dee NOOM-er","the number"),
  w("buchstabieren","bookH-shtah-BEE-ren","to spell"),
  w("die Telefonnummer","dee teh-leh-FOHN-noom-er","the phone number")
]};
guides.A1_lesson_3 = { title: "My Family", words: [
  w("die Familie","dee fah-MEE-lee-uh","the family"),
  w("der Vater","dair FAH-ter","the father","V is pronounced as F in German"),
  w("die Mutter","dee MOO-ter","the mother"),
  w("der Bruder","dair BROO-der","the brother"),
  w("die Schwester","dee SHVES-ter","the sister"),
  w("der Sohn","dair Zohn","the son","S at start = voiced Z"),
  w("die Tochter","dee TOKH-ter","the daughter","ch is soft")
]};
guides.A1_lesson_4 = { title: "In the Restaurant", words: [
  w("das Restaurant","dahs res-toh-RAHNT","the restaurant","French pronunciation"),
  w("bitte","BIT-tuh","please"),
  w("danke","DAHN-kuh","thank you"),
  w("die Speisekarte","dee SHPY-zuh-kar-tuh","the menu","ei = eye"),
  w("die Rechnung","dee REKH-noong","the bill","ch is soft, -ung = -oong"),
  w("der Tisch","dair teesh","the table"),
  w("der Kellner","dair KEL-ner","the waiter")
]};
guides.A1_lesson_5 = { title: "Asking for Directions", words: [
  w("links","links","left"),
  w("rechts","rekhts","right","ch is soft, not hard k"),
  w("geradeaus","ge-RAH-duh-OUSS","straight ahead"),
  w("die Stra\u00dfe","dee SHTRAH-suh","the street","\u00df = ss"),
  w("die Kreuzung","dee KROYT-soong","the intersection","eu = oy"),
  w("die Ampel","dee AHM-pel","the traffic light"),
  w("Entschuldigung","ent-SHOOL-di-goong","excuse me","ent-: t is almost silent")
]};
guides.A1_lesson_6 = { title: "Telling Time", words: [
  w("die Uhrzeit","dee OOR-tsite","the time"),
  w("die Uhr","dee oor","the clock"),
  w("f\u00fcnf","fuenf","five","\u00fc: round lips and say ee"),
  w("zehn","tsayn","ten","z = ts"),
  w("halb","halp","half"),
  w("Viertel","FEER-tel","quarter","V sounds like F"),
  w("Minute","mee-NOO-tuh","minute")
]};
guides.A1_lesson_7 = { title: "Days & Months", words: [
  w("Montag","MOHN-tahk","Monday","Tag = -tahk, not 'tag'"),
  w("Mittwoch","MIT-vokh","Wednesday","ch at end is soft"),
  w("Samstag","ZAHMS-tahk","Saturday","S = Z"),
  w("Januar","YAH-noo-ahr","January","J = English Y"),
  w("Februar","FAY-broo-ahr","February"),
  w("heute","HOY-tuh","today","eu = oy"),
  w("morgen","MOR-gen","tomorrow")
]};
guides.A1_lesson_8 = { title: "Hobbies & Free Time", words: [
  w("das Hobby","dahs HO-bee","the hobby"),
  w("lesen","LAY-zen","to read","s between vowels = voiced Z"),
  w("spielen","SHPEE-len","to play"),
  w("reisen","RY-zen","to travel","ei = eye"),
  w("schwimmen","SHVIM-en","to swim"),
  w("die Musik","dee moo-ZEEK","the music","Stress on last syllable"),
  w("fernsehen","FERN-zay-en","to watch TV")
]};
guides.A1_lesson_9 = { title: "Grocery Shopping", words: [
  w("der Supermarkt","dair ZOO-per-markt","the supermarket","S = Z"),
  w("das Brot","dahs broht","the bread"),
  w("die Milch","dee milkh","the milk","ch is soft, not k"),
  w("der K\u00e4se","dair KAY-zuh","the cheese","\u00e4 is like 'e' in 'bed'"),
  w("die Flasche","dee FLAH-shuh","the bottle"),
  w("kosten","KOS-ten","to cost"),
  w("bezahlen","beh-TSAH-len","to pay","z = ts")
]};
guides.A1_lesson_10 = { title: "Ordering at a Restaurant", words: [
  w("bestellen","beh-SHTEL-en","to order"),
  w("das Essen","dahs ES-en","the food"),
  w("das Getr\u00e4nk","dahs ge-TRENK","the drink"),
  w("der Saft","dair zahft","the juice"),
  w("das Wasser","dahs VAH-ser","the water","W = English v"),
  w("der Wein","dair vine","the wine","W = v"),
  w("schmecken","SHMEK-en","to taste")
]};
guides.A1_lesson_11 = { title: "Weather", words: [
  w("das Wetter","dahs VET-er","the weather","W = v"),
  w("die Sonne","dee ZON-uh","the sun"),
  w("der Regen","dair RAY-gen","the rain"),
  w("der Schnee","dair shnay","the snow"),
  w("der Wind","dair vint","the wind"),
  w("warm","varm","warm"),
  w("kalt","kalt","cold"),
  w("die Wolke","dee VOL-kuh","the cloud")
]};
guides.A1_lesson_12 = { title: "Colors & Clothing", words: [
  w("rot","roht","red"),
  w("blau","blow","blue","au = ow as in 'cow'"),
  w("gr\u00fcn","groon","green","\u00fc: round lips and say ee"),
  w("gelb","gelp","yellow","b at end = p"),
  w("schwarz","shvarts","black","z = ts"),
  w("wei\u00df","vice","white","ei = eye"),
  w("die Hose","dee HOH-zuh","the pants")
]};
guides.A1_lesson_13 = { title: "My Family (Extended)", words: [
  w("der Opa","dair OH-pah","grandpa"),
  w("die Oma","dee OH-mah","grandma"),
  w("der Onkel","dair ON-kel","the uncle"),
  w("die Tante","dee TAN-tuh","the aunt"),
  w("der Cousin","dair koo-ZAHNG","the cousin (m)","French nasal -in sound"),
  w("die Cousine","dee koo-ZEE-nuh","the cousin (f)"),
  w("der Hund","dair hoont","the dog")
]};
guides.A1_lesson_14 = { title: "My Home", words: [
  w("das Haus","dahs howss","the house","au = ow"),
  w("die Wohnung","dee VOH-noong","the apartment"),
  w("das Zimmer","dahs TSIM-er","the room"),
  w("die K\u00fcche","dee KUEKH-uh","the kitchen","\u00fc + ch: round lips then soft ch"),
  w("das Badezimmer","dahs BAH-duh-tsim-er","the bathroom"),
  w("das Schlafzimmer","dahs SHLAHF-tsim-er","the bedroom"),
  w("der Tisch","dair teesh","the table")
]};
guides.A1_lesson_15 = { title: "My Daily Routine", words: [
  w("aufwachen","OWF-vakh-en","to wake up"),
  w("aufstehen","OWF-shtay-en","to get up"),
  w("fr\u00fchst\u00fccken","FROO-shtuek-en","to have breakfast"),
  w("die Arbeit","dee AR-bite","the work"),
  w("nach Hause","nakh HOW-zuh","home (direction)","ch is soft"),
  w("schlafen","SHLAH-fen","to sleep"),
  w("putzen","POOT-sen","to clean")
]};
guides.A1_lesson_16 = { title: "Body Parts & Health", words: [
  w("der Kopf","dair kopf","the head"),
  w("die Hand","dee hant","the hand","d at end = t"),
  w("das Auge","dahs OW-guh","the eye","au = ow"),
  w("die Nase","dee NAH-zuh","the nose"),
  w("der Mund","dair moont","the mouth"),
  w("der Arzt","dair artst","the doctor","z = ts"),
  w("krank","krank","sick")
]};
guides.A1_lesson_17 = { title: "Animals at the Zoo", words: [
  w("der Hund","dair hoont","the dog"),
  w("die Katze","dee KAT-suh","the cat"),
  w("der Vogel","dair FOH-gel","the bird","V = f"),
  w("das Pferd","dahs pferd","the horse","pf: blow through both lips"),
  w("der Fisch","dair fish","the fish"),
  w("der Elefant","dair eh-leh-FANT","the elephant"),
  w("der Affe","dair AH-fuh","the monkey")
]};
guides.A1_lesson_18 = { title: "My City", words: [
  w("die Stadt","dee shtat","the city","St- at start = sht-"),
  w("das Kino","dahs KEE-noh","the cinema"),
  w("die Schule","dee SHOO-luh","the school"),
  w("der Park","dair park","the park"),
  w("die Kirche","dee KEER-khuh","the church","ch is soft after vowels"),
  w("der Bahnhof","dair BAHN-hohf","the train station"),
  w("das Krankenhaus","dahs KRAHN-ken-howss","the hospital")
]};
guides.A1_lesson_19 = { title: "Introducing Yourself", words: [
  w("vorstellen","FOR-shtel-en","to introduce"),
  w("kommen aus","KOM-en owss","to come from"),
  w("wohnen","VOH-nen","to live somewhere"),
  w("der Beruf","dair beh-ROOF","the profession"),
  w("das Alter","dahs AHL-ter","the age"),
  w("ledig","LAY-dikh","single","ig at end = -ikh"),
  w("verheiratet","fer-HY-rah-tet","married")
]};
guides.A1_lesson_20 = { title: "Ordering at a Caf\u00e9", words: [
  w("der Kaffee","dair kah-FAY","the coffee","Stress on second syllable"),
  w("der Tee","dair tay","the tea"),
  w("der Kuchen","dair KOO-khen","the cake","ch is soft"),
  w("das St\u00fcck","dahs shtuek","the piece"),
  w("die Tasse","dee TAH-suh","the cup"),
  w("hei\u00df","hice","hot","ei = eye"),
  w("mit Sahne","mit ZAH-nuh","with cream")
]};
guides.A1_lesson_21 = { title: "Transportation", words: [
  w("das Auto","dahs OW-toh","the car","au = ow"),
  w("der Bus","dair booss","the bus"),
  w("der Zug","dair tsook","the train","z = ts, g at end = k"),
  w("das Fahrrad","dahs FAHR-raht","the bicycle"),
  w("die U-Bahn","dee OO-bahn","the subway"),
  w("die Haltestelle","dee HAL-tuh-shtel-uh","the stop"),
  w("das Taxi","dahs TAH-ksee","the taxi")
]};
guides.A1_lesson_22 = { title: "Making Phone Calls", words: [
  w("das Telefon","dahs teh-leh-FOHN","the telephone"),
  w("das Handy","dahs HEN-dee","the mobile phone","German word for mobile"),
  w("anrufen","AHN-roo-fen","to call"),
  w("die Nachricht","dee NAKH-rikht","the message","ch is soft in both"),
  w("w\u00e4hlen","VAY-len","to dial"),
  w("klingeln","KLING-eln","to ring"),
  w("besetzt","beh-ZETST","busy")
]};
guides.A1_lesson_23 = { title: "Celebrating Birthdays", words: [
  w("der Geburtstag","dair geh-BOORTS-tahk","the birthday"),
  w("feiern","FY-ern","to celebrate","ei = eye"),
  w("das Geschenk","dahs geh-SHENK","the gift"),
  w("einladen","EYEN-lah-den","to invite"),
  w("die Kerze","dee KER-tsuh","the candle","z = ts"),
  w("der Kuchen","dair KOO-khen","the cake")
]};
guides.A1_lesson_24 = { title: "Numbers & Math", words: [
  w("rechnen","REKH-nen","to calculate","ch is soft"),
  w("die Zahl","dee tsahl","the number"),
  w("plus","plooss","plus"),
  w("minus","MEE-nooss","minus"),
  w("hundert","HOON-dert","hundred"),
  w("tausend","TOW-zent","thousand","au = ow"),
  w("die Rechnung","dee REKH-noong","the bill")
]};
guides.A1_lesson_25 = { title: "At School", words: [
  w("die Schule","dee SHOO-luh","the school"),
  w("der Lehrer","dair LAY-rer","the teacher (m)"),
  w("die Lehrerin","dee LAY-reh-rin","the teacher (f)"),
  w("der Sch\u00fcler","dair SHUE-ler","the student (m)"),
  w("das Buch","dahs bookh","the book","ch is soft, not 'book' in English"),
  w("der Bleistift","dair BLY-shtift","the pencil"),
  w("die Hausaufgabe","dee HOWSS-owf-gah-buh","the homework")
]};

// ========== A2 ==========
guides.A2_lesson_1 = { title: "Review of A1 & Self-Introduction", words: [
  w("wiederholen","VEE-der-hoh-len","to repeat","W = v"),
  w("die Vorstellung","dee FOR-shtel-oong","the introduction"),
  w("der Nachname","dair NAKH-nah-muh","the surname","ch is soft"),
  w("der Vorname","dair FOR-nah-muh","the first name"),
  w("die Adresse","dee ah-DRES-uh","the address"),
  w("die Nationalit\u00e4t","dee nah-tsee-oh-nah-lee-TAYT","the nationality","ti = tsee")
]};
guides.A2_lesson_2 = { title: "Daily Routine in Detail", words: [
  w("der Tagesablauf","dair TAH-guhs-ahp-lowf","the daily routine"),
  w("aufr\u00e4umen","OWF-roy-men","to tidy up"),
  w("einkaufen","EYEN-kow-fen","to go shopping"),
  w("vorbereiten","FOR-beh-ry-ten","to prepare"),
  w("erledigen","er-LAY-di-gen","to get done"),
  w("ausruhen","OWSS-roo-en","to rest")
]};
guides.A2_lesson_3 = { title: "Past Activities (Perfekt)", words: [
  w("gegangen","geh-GAHNG-en","gone / walked"),
  w("gesehen","geh-ZAY-en","seen"),
  w("gefahren","geh-FAH-ren","driven / traveled"),
  w("geschlafen","geh-SHLAH-fen","slept"),
  w("gegessen","geh-GES-en","eaten"),
  w("getrunken","geh-TROON-ken","drunk"),
  w("gemacht","geh-MAKHT","done / made","ch is soft")
]};
guides.A2_lesson_4 = { title: "Travel & Transportation", words: [
  w("die Reise","dee RY-zuh","the trip","ei = eye"),
  w("der Flughafen","dair FLOOK-hah-fen","the airport"),
  w("der Bahnhof","dair BAHN-hohf","the train station"),
  w("die Fahrkarte","dee FAHR-kar-tuh","the ticket"),
  w("der Koffer","dair KOF-er","the suitcase"),
  w("abfahren","AP-fah-ren","to depart"),
  w("ankommen","AHN-kom-en","to arrive")
]};
guides.A2_lesson_5 = { title: "Hotel & Accommodation", words: [
  w("das Hotel","dahs hoh-TEL","the hotel"),
  w("das Zimmer","dahs TSIM-er","the room"),
  w("der Schl\u00fcssel","dair SHLUES-el","the key"),
  w("die Reservierung","dee reh-zer-VEE-roong","the reservation"),
  w("der Fr\u00fchst\u00fcck","dair FROO-shtuek","the breakfast"),
  w("bezahlen","beh-TSAH-len","to pay")
]};
guides.A2_lesson_6 = { title: "Shopping & Services", words: [
  w("der Laden","dair LAH-den","the shop"),
  w("die Gr\u00f6\u00dfe","dee GRUR-suh","the size","\u00d6: round lips and say 'air'"),
  w("passen","PAH-sen","to fit"),
  w("anprobieren","AHN-proh-bee-ren","to try on"),
  w("der Preis","dair price","the price","ei = eye"),
  w("die Quittung","dee KVIT-oong","the receipt","Q = kv")
]};
guides.A2_lesson_7 = { title: "Eating & Restaurant Visit", words: [
  w("die Vorspeise","dee FOR-shpy-zuh","the starter"),
  w("die Hauptspeise","dee HOWPT-shpy-zuh","the main course"),
  w("der Nachtisch","dair NAKH-tish","the dessert","ch is soft"),
  w("die Bestellung","dee beh-SHTEL-oong","the order"),
  w("die Bedienung","dee beh-DEE-noong","the service"),
  w("der Geschmack","dair geh-SHMAK","the taste")
]};
guides.A2_lesson_8 = { title: "Work & Workplace", words: [
  w("die Arbeit","dee AR-bite","the work / job"),
  w("der Arbeitsplatz","dair AR-bites-plats","the workplace","z = ts"),
  w("der Kollege","dair koh-LAY-guh","the colleague"),
  w("die Firma","dee FEER-mah","the company"),
  w("die Besprechung","dee beh-SHPREKH-oong","the meeting","ch is soft"),
  w("verdienen","fer-DEE-nen","to earn"),
  w("die Bewerbung","dee buh-VER-boong","the application")
]};
guides.A2_lesson_9 = { title: "Education & Language Courses", words: [
  w("der Kurs","dair koors","the course"),
  w("der Sprachkurs","dair SHPRAKH-koors","the language course"),
  w("die Pr\u00fcfung","dee PROO-foong","the exam"),
  w("die Note","dee NOH-tuh","the grade"),
  w("der Student","dair shtoo-DENT","the student"),
  w("der Stoff","dair shtof","the material")
]};
guides.A2_lesson_10 = { title: "Apartment Search & Renting", words: [
  w("die Wohnung","dee VOH-noong","the apartment"),
  w("die Miete","dee MEE-tuh","the rent"),
  w("der Vermieter","dair fer-MEE-ter","the landlord"),
  w("der Vertrag","dair fer-TRAHK","the contract"),
  w("die Kaution","dee kow-TSEE-ohn","the deposit"),
  w("die Nebenkosten","dee NAY-ben-kos-ten","the utilities")
]};
guides.A2_lesson_11 = { title: "Health & Doctor Visit", words: [
  w("die Gesundheit","dee guh-ZOONT-hite","the health"),
  w("der Arzt","dair artst","the doctor"),
  w("das Krankenhaus","dahs KRAHN-ken-howss","the hospital"),
  w("die Praxis","dee PRAK-sis","the clinic"),
  w("der Termin","dair ter-MEEN","the appointment"),
  w("die Versicherung","dee fer-ZIKH-er-oong","the insurance","ch is soft")
]};
guides.A2_lesson_12 = { title: "Pharmacy & Medication", words: [
  w("die Apotheke","dee ah-poh-TAY-kuh","the pharmacy"),
  w("das Medikament","dahs meh-dee-kah-MENT","the medication"),
  w("die Tablette","dee tah-BLET-uh","the tablet"),
  w("die Salbe","dee ZAL-buh","the ointment"),
  w("die Dosis","dee DOH-zis","the dosage"),
  w("verschreiben","fer-SHRY-ben","to prescribe")
]};
guides.A2_lesson_13 = { title: "Weather & Seasons", words: [
  w("die Jahreszeit","dee YAH-rehs-tsite","the season","J = Y"),
  w("der Fr\u00fchling","dair FROO-ling","spring"),
  w("der Sommer","dair ZOM-er","summer"),
  w("der Herbst","dair herpst","autumn","b at end = p"),
  w("der Winter","dair VIN-ter","winter"),
  w("die Temperatur","dee tem-peh-rah-TOOR","the temperature"),
  w("der Regenschirm","dair RAY-gen-sheerm","the umbrella")
]};
guides.A2_lesson_14 = { title: "Free Time & Hobbies", words: [
  w("die Freizeit","dee FRY-tsite","free time","ei = eye"),
  w("das Hobby","dahs HO-bee","the hobby"),
  w("der Ausflug","dair OWSS-flook","the excursion","au = ow"),
  w("der Verein","dair fer-EYEN","the club","ei = eye"),
  w("die Mitgliedschaft","dee MIT-gleet-shahft","the membership"),
  w("sich treffen","zikH TREF-en","to meet (friends)")
]};
guides.A2_lesson_15 = { title: "Invitations & Appointments", words: [
  w("die Einladung","dee EYEN-lah-doong","the invitation","ei = eye"),
  w("die Verabredung","dee fer-AP-ray-doong","the appointment"),
  w("der Vorschlag","dair FOR-shlahk","the suggestion"),
  w("p\u00fcnktlich","PUENKT-likh","punctual","ig at end = -ikh"),
  w("absagen","AP-zah-gen","to cancel"),
  w("zusagen","TSOO-zah-gen","to accept","z = ts"),
  w("vielleicht","fee-LAIKHT","maybe","ei = eye, ch is soft")
]};
guides.A2_lesson_16 = { title: "Festivals & Holidays", words: [
  w("das Fest","dahs fest","the festival"),
  w("der Feiertag","dair FY-er-tahk","the holiday","ei = eye"),
  w("Weihnachten","VY-nakh-ten","Christmas","ch is soft"),
  w("Ostern","OH-stern","Easter"),
  w("Silvester","zil-VES-ter","New Year's Eve","S = Z"),
  w("das Feuerwerk","dahs FOY-er-verk","the fireworks","eu = oy"),
  w("feiern","FY-ern","to celebrate")
]};
guides.A2_lesson_17 = { title: "Body Parts & Appearance", words: [
  w("der K\u00f6rper","dair KUR-per","the body","\u00f6 = ur"),
  w("das Gesicht","dahs ge-ZIKHT","the face","ch is soft"),
  w("die Haare","dee HAH-reh","the hair"),
  w("die Augen","dee OW-gen","the eyes","au = ow"),
  w("die Schulter","dee SHOOL-ter","the shoulder"),
  w("der R\u00fccken","dair RUEK-en","the back"),
  w("die Beine","dee BY-nuh","the legs","ei = eye")
]};
guides.A2_lesson_18 = { title: "Character & Personality", words: [
  w("der Charakter","dair kah-RAK-ter","the character"),
  w("freundlich","FROYNT-likh","friendly","eu = oy"),
  w("hilfsbereit","HILFS-beh-rite","helpful","ei = eye"),
  w("ehrlich","AYR-likh","honest"),
  w("geduldig","geh-DOOL-dikh","patient"),
  w("ungeduldig","OON-geh-dool-dikh","impatient"),
  w("die Eigenschaft","dee EY-gen-shahft","the trait")
]};
guides.A2_lesson_19 = { title: "Orientation & Directions", words: [
  w("die Orientierung","dee oh-ree-en-TEE-roong","orientation"),
  w("die Wegbeschreibung","dee VEK-beh-shry-boong","the route description"),
  w("die Ecke","dee EK-uh","the corner"),
  w("der Kreisverkehr","dair KRICE-fer-kayr","the roundabout","ei = eye"),
  w("die Br\u00fccke","dee BRUEK-uh","the bridge"),
  w("der Fu\u00dfg\u00e4nger","dair FOOSS-geng-er","the pedestrian"),
  w("der Weg","dair vek","the way/path","g at end = k")
]};
guides.A2_lesson_20 = { title: "At the Office & Citizen Services", words: [
  w("das B\u00fcrgeramt","dairs BUER-ger-amt","the citizen's office"),
  w("der Ausweis","dair OWSS-vice","the ID","au = ow, ei = eye"),
  w("der Reisepass","dair RY-zuh-pass","the passport"),
  w("das Formular","dahs for-moo-LAHR","the form"),
  w("die Anmeldung","dee AHN-mel-doong","the registration"),
  w("die Geb\u00fchr","dee geh-BUER","the fee"),
  w("unterschreiben","oon-ter-SHRY-ben","to sign","ei = eye")
]};
guides.A2_lesson_21 = { title: "Media & Technology", words: [
  w("das Internet","dahs IN-ter-net","the Internet"),
  w("der Computer","dair kom-PYOO-ter","the computer"),
  w("die Webseite","dee VEB-zy-tuh","the website"),
  w("die E-Mail","dee EE-mayl","the email"),
  w("herunterladen","her-OON-ter-lah-den","to download"),
  w("die App","dee ap","the app"),
  w("das Passwort","dahs PASS-vort","the password")
]};
guides.A2_lesson_22 = { title: "Environment & Sustainability", words: [
  w("die Umwelt","dee OOM-velt","the environment"),
  w("der M\u00fcll","dair muell","the trash"),
  w("das Recycling","dahs ree-SYK-ling","the recycling"),
  w("der Klimawandel","dair KLEE-mah-van-del","climate change"),
  w("die Natur","dee nah-TOOR","nature"),
  w("sch\u00fctzen","SHUET-sen","to protect"),
  w("die Energie","dee eh-ner-GEE","the energy")
]};
guides.A2_lesson_23 = { title: "Public Transportation", words: [
  w("der \u00f6ffentliche Verkehr","dair UF-ent-likh-e fer-KAYR","public transport"),
  w("die U-Bahn","dee OO-bahn","the subway"),
  w("die S-Bahn","dee ES-bahn","the city railway"),
  w("der Busfahrer","dair BOOSS-fah-rer","the bus driver"),
  w("die Fahrplan","dee FAHR-plahn","the schedule"),
  w("die Versp\u00e4tung","dee fer-SHPAY-toong","the delay"),
  w("der Anschluss","dair AHN-shlooss","the connection")
]};
guides.A2_lesson_24 = { title: "Abroad Experience & Cultural Differences", words: [
  w("das Ausland","dahs OWSS-lant","abroad","au = ow"),
  w("die Kultur","dee kool-TOOR","the culture"),
  w("die Erfahrung","dee er-FAH-roong","the experience"),
  w("anders","AHN-ders","different"),
  w("gew\u00f6hnen","geh-VUR-nen","to get used to"),
  w("der Unterschied","dair OON-ter-sheekt","the difference"),
  w("die Tradition","dee trah-dee-tsee-OHN","the tradition")
]};
guides.A2_lesson_25 = { title: "Review & Exam Preparation", words: [
  w("die Wiederholung","dee VEE-der-hoh-loong","the review / repetition","W = v"),
  w("die Pr\u00fcfung","dee PROO-foong","the exam / test"),
  w("die Vorbereitung","dee FOR-beh-ry-toong","the preparation","ei = eye"),
  w("die Zusammenfassung","dee tsoo-ZAH-men-fah-soong","the summary","z = ts"),
  w("die \u00dcbung","dee UE-boong","the exercise"),
  w("der Lernerfolg","dair LER-ner-folk","the learning success"),
  w("bestehen","beh-SHTAY-en","to pass (exam)")
]};

fs.writeFileSync('pronunciationGuides.new.json', JSON.stringify(guides, null, 2));
console.log("Written " + Object.keys(guides).length + " guides");
