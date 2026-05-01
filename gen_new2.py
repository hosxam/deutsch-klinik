#!/usr/bin/env python3
# Part 2 - Append more A1 lessons (16-25) to gen_new.py, add A2, B1, B2, C1

import json, os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'data')

def L(level, unit, lid, title, objective, explanation, examples, vocab_pairs,
      grammarFocus, guided_qs, reading_text, reading_qs,
      listening_script, listening_qs, writing, speaking, review):
    return {
        "level": level, "unit": unit, "id": lid, "title": title,
        "objective": objective, "explanation": explanation,
        "examples": examples if isinstance(examples, list) else [examples],
        "vocabulary": [{"word": w, "translation": t} for w, t in vocab_pairs],
        "grammarFocus": grammarFocus,
        "guidedPractice": [{"prompt": p, "answer": a} for p, a in guided_qs],
        "independentPractice": [
            {"prompt": "Write 5 sentences using the grammar from this lesson.", "type": "writing"},
            {"prompt": "Practice the vocabulary aloud.", "type": "speaking"}
        ],
        "readingTask": {
            "text": reading_text,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in reading_qs]
        },
        "listeningTask": {
            "script": listening_script,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in listening_qs]
        },
        "writingTask": writing, "speakingTask": speaking, "reviewSummary": review
    }

def unit_for_level(level, n):
    if 6 <= n <= 10: return f"{level}_unit_1"
    if 11 <= n <= 15: return f"{level}_unit_2"
    if 16 <= n <= 20: return f"{level}_unit_3"
    if 21 <= n <= 25: return f"{level}_unit_4"
    return f"{level}_unit_5"

NEW = []

# ══════════════════════════════════════════════════════════════════════════
# A1 Lessons 16-25
# ══════════════════════════════════════════════════════════════════════════

NEW.append(L("A1","A1_unit_3","A1_lesson_16",
"Essen und Trinken",
"Discuss food and drinks, use gern/nicht gern to express preferences, and use the accusative case with essen/trinken.",
"Use essen (to eat) and trinken (to drink) with accusative objects: Ich esse einen Apfel (m), eine Suppe (f), ein Brot (n). Ich esse gern... expresses likes. Use nicht gern for dislikes.",
["Ich esse gern Pizza.","Ich trinke Wasser.","Magst du Kaffee?","Er isst keinen Fisch.","Wir essen gern Schokolade."],
[("das Essen","food"),("trinken","to drink"),("das Wasser","water"),("der Kaffee","coffee"),("der Apfel","apple"),("die Suppe","soup"),("das Brot","bread"),("der Kaese","cheese"),("die Schokolade","chocolate")],
"essen is irregular: ich esse, du isst, er/sie isst, wir essen, ihr esst, sie essen. trinken is regular. Accusative objects after essen/trinken: einen Apfel, eine Suppe, ein Brot.",
[("Translate: I like eating pizza.","Ich esse gern Pizza."),("Complete: Ich ___ einen Apfel. (eat)","esse"),("Magst ___ Kaffee? (you)","du"),("Er isst keinen ___. (fish)","Fisch")],
"Peter isst gern. Zum Fruehstueck isst er Brot mit Kaese und trinkt Kaffee. Zum Mittagessen isst er Suppe oder Salat. Abends isst er gern Fleisch mit Gemuese.",
[("Was isst Peter zum Fruehstueck?","Brot mit Kaese."),("Was trinkt er?","Kaffee.")],
"Hoeren Sie: Ich mag italienisches Essen. Besonders gern esse ich Pizza und Pasta. Ich trinke gern Rotwein dazu. Zum Dessert nehme ich Tiramisu.",
[("Was mag die Person besonders gern?","Pizza und Pasta."),("Was trinkt sie dazu?","Rotwein.")],
"Write 4 sentences about foods you like and dislike.",
"Tell a partner what you eat for breakfast, lunch and dinner.",
"Food vocabulary (Apfel, Suppe, Brot, Kaese), essen/trinken conjugations, gern/nicht gern expressions."))

NEW.append(L("A1","A1_unit_3","A1_lesson_17",
"Geburtstag feiern",
"Discuss birthdays, use dates, numbers up to 31, and the verb bekommen.",
"For dates use ordinal numbers: der erste Mai, der zweite Juni, der fuenfundzwanzigste Dezember. The question is Wann hast du Geburtstag? Use Ich habe am + date + Geburtstag.",
["Wann hast du Geburtstag?","Ich habe am 15. Mai Geburtstag.","Herzlichen Glueckwunsch!","Ich bekomme ein Geschenk.","Alles Gute zum Geburtstag!"],
[("der Geburtstag","birthday"),("das Geschenk","gift/present"),("die Party","party"),("die Kerze","candle"),("die Torte","cake"),("der Monat","month"),("feiern","to celebrate"),("bekommen","to receive"),("einladen","to invite")],
"Ordinal numbers: 1.-19. add -te (erste, zweite, dritte...), 20+ add -ste (zwanzigste). Am + ordinal + month: am fuenfzehnten Mai. Wann hast du Geburtstag? Ich habe am...",
[("Translate: When is your birthday?","Wann hast du Geburtstag?"),("Complete: Ich habe am 15. ___ Geburtstag. (May)","Mai"),("Alles ___ zum Geburtstag!","Gute"),("Ich bekomme ein ___. (gift)","Geschenk")],
"Anna hat am 8. Maerz Geburtstag. Sie wird 25 Jahre alt. Sie feiert mit Freunden und Familie. Es gibt eine grosse Torte mit Kerzen. Sie bekommt viele Geschenke.",
[("Wann hat Anna Geburtstag?","Am 8. Maerz."),("Wie alt wird sie?","25.")],
"Hoeren Sie: Herzlichen Glueckwunsch zum Geburtstag, lieber Thomas! Ich wuensche dir alles Gute, viel glueck und Gesundheit. Lass uns am Samstag feiern!",
[("Was wuenscht die Person Thomas?","Alles Gute, viel Glueck und Gesundheit."),("Wann wird gefeiert?","Am Samstag.")],
"Write 3 birthday wishes in German.",
"Tell a partner when your birthday is and what you usually do.",
"Birthday vocabulary (Geburtstag, Geschenk, Torte, feiern), ordinal numbers, am + date."))

NEW.append(L("A1","A1_unit_3","A1_lesson_18",
"Zahlen und Rechnen",
"Use numbers 0-1,000,000, do basic math in German, and ask about prices and quantities.",
"Numbers: 21 = einundzwanzig (one-and-twenty), 99 = neunundneunzig. Hundreds: zweihundert. Thousands: dreitausend. Millions: eine Million. Math: plus, minus, mal, geteilt durch, ist/gleich.",
["Zwei plus drei ist fuenf.","Zehn minus vier ist sechs.","Fuenf mal drei ist fuenfzehn.","Wie viel kostet das?","Das macht zusammen 27 Euro."],
[("plus","plus"),("minus","minus"),("mal","times"),("geteilt durch","divided by"),("die Zahl","number"),("die Summe","sum"),("der Euro","euro"),("der Cent","cent"),("wie viel","how much")],
"Numbers combine ones before tens: 23 = dreiundzwanzig. Geld: 15,50E = fuenfzehn Euro fuenfzig. Euro is masculine. Question: Wie viel kostet...?",
[("Complete: Zwei plus drei ___ fuenf. (is)","ist"),("Translate: 23","dreiundzwanzig"),("Fuenf mal vier ist ___.","zwanzig"),("Uebersetzen: How much does this cost?","Wie viel kostet das?")],
"Im Supermarkt kauft Maria ein. Sie kauft Brot fuer 2,50E und Milch fuer 1,20E und Eier fuer 3,00E. Zusammen bezahlt sie 6,70E. Sie gibt 10 Euro und bekommt 3,30E zurueck.",
[("Wie viel kostet das Brot?","2,50 Euro."),("Wie viel bekommt sie zurueck?","3,30 Euro.")],
"Hoeren Sie: Ich habe 50 Euro ausgegeben. Das Hemd hat 25 Euro gekostet, die Hose 20 Euro und die Socken 5 Euro. Insgesamt sind es 50 Euro.",
[("Wieviel hat das Hemd gekostet?","25 Euro."),("Wie viel hat die Hose gekostet?","20 Euro.")],
"Write 5 math problems in German and answer them.",
"Practice saying prices of 5 objects around you.",
"Numbers 0-1M, math operations (plus/minus/mal/geteilt durch), prices and Euro."))

NEW.append(L("A1","A1_unit_3","A1_lesson_19",
"In der Schule",
"Discuss school subjects, classroom objects, and use moegen to express preferences for subjects.",
"Use the verb moegen (to like): ich mag, du magst, er/sie mag, wir moegen, ihr moegt, sie/Sie moegen. Followed by accusative noun or infinitive: Ich mag Mathematik. Ich mag lesen.",
["Ich mag Mathematik.","Welches Fach magst du?","Mein Lieblingsfach ist Deutsch.","Der Unterricht beginnt um 8 Uhr.","Hausaufgaben machen ist langweilig."],
[("die Schule","school"),("der Unterricht","class/lesson"),("das Fach","subject"),("die Mathematik","math"),("die Geschichte","history"),("die Biologie","biology"),("der Lehrer","teacher"),("die Hausaufgaben","homework"),("der Stundenplan","timetable")],
"moegen conjugation: ich mag, du magst, er mag. Lieblings- prefix: mein Lieblingsfach, mein Lieblingslehrer. Welches Fach + inverted order: Welches Fach magst du?",
[("Translate: I like mathematics.","Ich mag Mathematik."),("Complete: Mein Lieblings___ ist Deutsch. (subject)","fach"),("Welches Fach ___ du?","magst"),("Der ___ beginnt um 8 Uhr. (class)","Unterricht")],
"Mein Schultag beginnt um 8 Uhr. Ich mag Biologie und Sport. Mein Lieblingslehrer unterrichtet Deutsch. Um 13 Uhr ist die Schule zu Ende und ich mache Hausaufgaben.",
[("Um wieviel Uhr beginnt die Schule?","Um 8 Uhr."),("Welche Faecher mag die Person?","Biologie und Sport.")],
"Hoeren Sie: Ich gehe in die 10. Klasse. Mein Stundenplan ist voll. Am Montag habe ich Mathe, Deutsch und Englisch. Am Dienstag habe ich Biologie und Geschichte. Sport ist am Freitag.",
[("Welche Faecher hat die Person am Montag?","Mathe, Deutsch und Englisch."),("Wann ist Sport?","Am Freitag.")],
"Write 4 sentences about your favorite school subjects.",
"Describe your school day to a partner.",
"School vocabulary (Schule, Fach, Lehrer, Hausaufgaben), moegen conjugation, Lieblings- prefix."))

NEW.append(L("A1","A1_unit_3","A1_lesson_20",
"Sport",
"Discuss sports, hobbies, and active leisure activities with the verb spielen and machen.",
"Use spielen for ball sports (Ich spiele Fussball) and machen for other activities (Ich mache Yoga). Use gern to express enjoyment. Fragen: Was machst du gern? Treibst du Sport?",
["Ich spiele gern Fussball.","Macht du Yoga?","Er macht Judo.","Wir spielen Tennis am Wochenende.","Sport ist gesund."],
[("der Sport","sport"),("spielen","to play"),("machen","to do"),("der Fussball","soccer"),("das Tennis","tennis"),("der Basketball","basketball"),("das Schwimmen","swimming"),("das Joggen","jogging"),("die Turnhalle","gym")],
"spielen is regular: ich spiele, du spielst, er spielt. machen is regular: ich mache, du machst, er macht. Sport expressions: Sport treiben (to do sports), Fussball spielen (to play soccer).",
[("Complete: Ich ___ gern Fussball. (play)","spiele"),("Translate: I do yoga.","Ich mache Yoga."),("Treibst du ___? (sports)","Sport"),("Wir spielen Tennis am ___. (weekend)","Wochenende")],
"Markus treibt viel Sport. Er spielt Fussball im Verein und geht zweimal pro Woche schwimmen. Am Wochenende joggt er im Park. Sport macht ihm viel Spass.",
[("Welche Sportarten macht Markus?","Fussball, Schwimmen, Joggen."),("Wie oft geht er schwimmen?","Zweimal pro Woche.")],
"Hoeren Sie: Ich spiele gern Tennis. Dreimal pro Woche trainiere ich. Im Sommer spiele ich draussen, im Winter in der Halle. Mein Trainer sagt, ich werde immer besser.",
[("Wie oft trainiert die Person?","Dreimal pro Woche."),("Wo spielt sie im Winter?","In der Halle.")],
"Write 4 sentences about sports and hobbies you do.",
"Ask a partner what sports they like and how often they do them.",
"Sports vocabulary (Fussball, Tennis, Schwimmen, Yoga), spielen vs machen, frequency expressions."))

NEW.append(L("A1","A1_unit_2","A1_lesson_21",
"Jahreszeiten und Monate",
"Name all four seasons and 12 months, use im for seasons and months, describe typical weather.",
"Use im + season (im Fruehling) or im + month (im Januar). Prepositions: im for masculine/neuter months, am + date for specific days. Seasons are masculine: der Fruehling, der Sommer, der Herbst, der Winter.",
["Der Fruehling beginnt im Maerz.","Im Sommer ist es heiss.","Der Herbst ist bunt.","Im Dezember schneit es.","Welche Jahreszeit magst du?"],
[("der Fruehling","spring"),("der Sommer","summer"),("der Herbst","autumn/fall"),("der Winter","winter"),("der Januar","January"),("der Februar","February"),("der Maerz","March"),("der April","April"),("der Mai","May"),("der Juni","June"),("der Juli","July"),("der August","August"),("der September","September"),("der Oktober","October"),("der November","November"),("der Dezember","December")],
"All months are masculine (der). im = in + dem: im Januar, im Februar. Im + season: im Fruehling, im Winter. Der (season) + ist: Der Sommer ist warm.",
[("Translate: in spring","im Fruehling"),("Complete: Der Sommer ___ warm. (is)","ist"),("Im Dezember ___ es. (snows)","schneit"),("Welche ___ magst du? (season)","Jahreszeit")],
"Es gibt vier Jahreszeiten. Der Fruehling ist von Maerz bis Mai. Der Sommer von Juni bis August. Der Herbst von September bis November. Der Winter von Dezember bis Februar.",
[("Wann ist der Fruehling?","Von Maerz bis Mai."),("Welche Monate hat der Winter?","Dezember, Januar, Februar.")],
"Hoeren Sie: Mein Lieblingsmonat ist der Dezember, weil Weihnachten ist. Der Juli ist auch schoen, weil ich Urlaub habe und ans Meer fahre.",
[("Warum mag die Person den Dezember?","Wegen Weihnachten."),("Warum mag sie den Juli?","Wegen Urlaub am Meer.")],
"Write 4 sentences about your favorite season and why.",
"Tell a partner which months are special for you and why.",
"Seasons (Fruehling, Sommer, Herbst, Winter), months, im + time expressions."))

NEW.append(L("A1","A1_unit_2","A1_lesson_22",
"Gefuehle",
"Express feelings and emotions using sein + adjective construction and the verb sich fuehlen.",
"Use Ich bin + adjective (I am happy/sad/tired) for permanent or current states. Use Ich fuehle mich + adjective to emphasize how you feel. Question: Wie fuehlst du dich? (How do you feel?)",
["Ich bin gluecklich.","Bist du muede?","Sie ist traurig.","Wir sind aufgeregt.","Ich fuehle mich heute gut."],
[("gluecklich","happy"),("traurig","sad"),("muede","tired"),("aufgeregt","excited/nervous"),("Angst haben","to be afraid"),("froh","glad"),("sauer","angry"),("sich fuehlen","to feel"),("die Freude","joy")],
"Sein + adjective: Ich bin gluecklich. Ich fuehle mich + adjective (reflexive): Ich fuehle mich gut. Question: Wie geht es dir? = How are you? Mir geht es gut = I am fine.",
[("Translate: I am happy.","Ich bin gluecklich."),("Complete: Wie ___ es dir? (goes)","geht"),("Ich fuehle mich heute ___. (good)","gut"),("Bist du ___. (tired)","muede")],
"Anna ist heute gluecklich. Sie hat eine gute Note in der Pruefung bekommen. Ihr Freund Peter ist auch froh. Aber Maria ist traurig, weil sie krank ist.",
[("Warum ist Anna gluecklich?","Wegen der guten Note."),("Warum ist Maria traurig?","Weil sie krank ist.")],
"Hoeren Sie: Hallo, wie geht es dir? Mir geht es nicht so gut. Ich fuehle mich muede und ich habe Kopfschmerzen. Vielleicht sollte ich frueher ins Bett gehen.",
[("Wie fuehlt sich die Person?","Muede mit Kopfschmerzen."),("Was sollte sie tun?","Frueher ins Bett gehen.")],
"Write 5 sentences describing how you feel today and why.",
"Ask a partner how they feel and respond in German.",
"Feelings (gluecklich, traurig, muede, aufgeregt), bin/fuehle mich, Wie geht es dir?"))
]

# ══════════════════════════════════════════════════════════════════════════
# A2 Lessons 6-25
# ══════════════════════════════════════════════════════════════════════════

NEW.append(L("A2","A2_unit_1","A2_lesson_6",
"Hotel Check-in",
"Check into a hotel, make simple requests, and use haben Sie... and Koennen Sie... politely.",
"Use Koennen Sie mir helfen? (Can you help me?) and Ich haette gern... (I would like...) for polite requests. Fragen an der Rezeption: Haben Sie ein freies Zimmer? Wie viel kostet eine Nacht?",
["Ich habe ein Zimmer reserviert.","Haben Sie ein Einzelzimmer?","Koennen Sie mir helfen?","Der Fruehstuecksservice ist ab 7 Uhr.","Ich haette gern die Rechnung."],
[("das Hotel","hotel"),("die Rezeption","reception"),("das Zimmer","room"),("das Einzelzimmer","single room"),("das Doppelzimmer","double room"),("der Schluessel","key"),("der Fruehstuecksservice","breakfast service"),("die Nacht","night"),("der Aufenthalt","stay")],
"Polite requests: Koennen Sie + infinitive? Haben Sie + noun? Ich haette gern + noun. Question word order after haben Sie: inversion. Zimmer types: Einzelzimmer (single), Doppelzimmer (double).",
[("Translate: Do you have a single room?","Haben Sie ein Einzelzimmer?"),("Complete: Ich haette gern den ___. (key)","Schluessel"),("Wie viel ___ eine Nacht? (costs)","kostet"),("Das Fruehstueck ist ab ___ Uhr. (time) asking for specific)","7")],
"Herr Mueller kommt im Hotel an. An der Rezeption sagt er: 'Guten Abend, ich habe ein Doppelzimmer reserviert.' Die Rezeptionistin gibt ihm den Schluessel. Zimmer 215 ist im zweiten Stock.",
[("Welches Zimmer hat Herr Mueller reserviert?","Ein Doppelzimmer."),("In welchem Stock ist Zimmer 215?","Im zweiten Stock.")],
"Hoeren Sie: Guten Tag, ich haette gern ein Einzelzimmer fuer drei Naechte. Mit Fruehstueck, bitte. Koennen Sie mir ein ruhiges Zimmer geben? Ja, wir haben ein Zimmer zum Hof hin.",
[("Wie viele Naechte?","Drei."),("Was wuenscht der Gast zum Zimmer?","Ein ruhiges Zimmer.")],
"Write a check-in dialogue (guest + receptionist, 6 exchanges).",
"Role play checking into a hotel with a partner.",
"Hotel vocabulary (Rezeption, Zimmer, Einzelzimmer, Schluessel), polite requests, questions about rooms."))

NEW.append(L("A2","A2_unit_1","A2_lesson_7",
"Nach dem Weg fragen",
"Ask for and give directions using imperative forms and prepositions of direction.",
"Use Gehen Sie (go), Biegen Sie ab (turn), Folgen Sie (follow). Direction prepositions: geradeaus (straight), links (left), rechts (right), an der Kreuzung (at the intersection). fragen: Wo ist...? Wie komme ich zu...?",
["Wo ist der Bahnhof?","Gehen Sie geradeaus.","Biegen Sie an der Kreuzung links ab.","Wie komme ich zum Museum?","Es ist neben der Kirche."],
[("geradeaus","straight ahead"),("links","left"),("rechts","right"),("die Kreuzung","intersection"),("die Ampel","traffic light"),("die Ecke","corner"),("der Weg","way/path"),("biegen","to turn"),("folgen","to follow")],
"Imperatives: Gehen Sie (formal), Geh (informal). Abbiegen is separable: Biegen Sie ab. Prepositions: zu + dative (zum, zur), neben + dative. Question: Wie komme ich zum...?",
[("Translate: Go straight.","Gehen Sie geradeaus."),("Complete: ___ Sie links ab. (turn)","Biegen"),("Wie komme ich ___ Museum? (to the)","zum"),("Es ist ___ der Kirche. (next to)","neben")],
"Entschuldigung, wo ist der Hauptbahnhof? Gehen Sie hier geradeaus bis zur Ampel. Dann biegen Sie rechts ab. Der Bahnhof ist dann auf der linken Seite. Etwa fuenf Minuten zu Fuss.",
[("Woran erkennt man den Weg?","Geradeaus bis zur Ampel, dann rechts."),("Wie lange braucht man?","Fuenf Minuten.")],
"Hoeren Sie: Entschuldigung, wie komme ich zum Rathaus? Gehen Sie geradeaus bis zur zweiten Strasse. Biegen Sie links ab. Das Rathaus ist an der Ecke. Sie koennen es nicht verpassen.",
[("Woran ist das Rathaus?","An der Ecke."),("Was sagt die Person am Ende?","Sie koennen es nicht verpassen.")],
"Write directions from your home to the nearest supermarket.",
"Give directions to a partner using right/left/straight.",
"Directions vocabulary (geradeaus, links, rechts, Kreuzung), imperative forms, zu prepositions."))

NEW.append(L("A2","A2_unit_1","A2_lesson_8",
"Zugtickets kaufen",
"Buy train tickets, ask about departures and platforms, understand ticket types.",
"Use Einmal/Einmal hin und zurueck (single/return ticket). Ask: Wann faehrt der Zug nach...? Von welchem Gleis? (Which platform?). Types: ICE, Regionalbahn, S-Bahn.",
["Einmal Berlin, bitte.","Hin und zurueck oder einfach?","Wann faehrt der Zug?","Von welchem Gleis?","Der ICE hat 10 Minuten Verspaetung."],
[("die Fahrkarte","ticket"),("einfach","single"),("hin und zurueck","return"),("die Abfahrt","departure"),("die Ankunft","arrival"),("das Gleis","platform"),("die Verspaetung","delay"),("der Schaffner","conductor")],
"Ticket requests: Einmal + destination + bitte. Question word order: Wann faehrt...? Hin und zurueck (return) vs einfach (single). Preise: erste Klasse (first) or zweite Klasse (second).",
[("Translate: A single ticket to Berlin, please.","Einmal Berlin, einfach bitte."),("Complete: Wann faehrt der ___? (train)","Zug"),("Von ___ Gleis? (which)","welchem"),("Der Zug hat ___ Minuten Verspaetung. (delay) Verspaetung has 10?","10")],
"Am Bahnhof kauft Thomas eine Fahrkarte. Einmal Hamburg und zurueck, zweite Klasse. Der Zug faehrt um 10:34 Uhr von Gleis 5. Die Fahrt dauert 4 Stunden.",
[("Wohin faehrt Thomas?","Hamburg."),("Um wieviel Uhr faehrt der Zug?","10:34 Uhr.")],
"Hoeren Sie: Guten Tag, ich moechte eine Fahrkarte nach Muenchen, bitte. Einfach oder hin und zurueck? Hin und zurueck, bitte. Das macht 98 Euro. Der Zug faehrt um 14 Uhr von Gleis 7.",
[("Wie viel kostet die Fahrkarte?","98 Euro."),("Von welchem Gleis?","Gleis 7.")],
"Write a dialogue buying a train ticket.",
"Role play buying a ticket at a train station.",
"Train travel vocabulary (Fahrkarte, einfache Fahrt, Gleis, Abfahrt), ticket types and prices."))

NEW.append(L("A2","A2_unit_1","A2_lesson_9",
"Am Flughafen",
"Navigate the airport, check in for a flight, and understand announcements.",
"Use Ich moechte einchecken (I want to check in). Questions about flights: Wann geht der Flug? Welches Gate? Der Flug geht um... Questions at security: Haben Sie Fluessigkeiten?",
["Wo ist der Check-in?","Ich moechte einchecken.","Welches Gate?","Der Flug geht um 15 Uhr.","Bitte den Reisepass."],
[("der Flughafen","airport"),("der Flug","flight"),("das Gate","gate"),("der Koffer","suitcase"),("das Handgepaeck","hand luggage"),("der Reisepass","passport"),("die Bordkarte","boarding pass"),("sicherheit","security"),("ankommen","to arrive")],
"Flight vocabulary: der Flug (flight), das Gate (gate), die Bordkarte (boarding pass). Fragen: Wann geht der Flug nach...? (When does the flight to... leave?) Welches Gate? (Which gate?)",
[("Translate: I would like to check in.","Ich moechte einchecken."),("Complete: Welches ___? (gate)","Gate"),("Wann geht der ___ nach Dubai? (flight)","Flug"),("Bitte den ___. (passport)","Reisepass")],
"Am Flughafen Frankfurt. Der Flug LH456 nach New York geht um 14:30 Uhr. Check-in Schalter 12. Das Gate ist B45. Bitte haben Sie Ihren Reisepass und Ihre Bordkarte bereit.",
[("Wohin geht der Flug?","New York."),("Welcher Schalter?","Schalter 12.")],
"Hoeren Sie: Achtung, Flug LH456 nach New York. Bitte begeben Sie sich zu Gate B45. Das Boarding beginnt um 14:00 Uhr. Bitte halten Sie Ihre Bordkarte bereit.",
[("Wann beginnt das Boarding?","Um 14:00 Uhr."),("Welches Gate?","B45.")],
"Write a check-in dialogue at the airport counter.",
"Role play checking in for an international flight.",
"Airport vocabulary (Flughafen, Flug, Gate, Koffer), check-in expressions, airport announcements."))

NEW.append(L("A2","A2_unit_1","A2_lesson_10",
"Urlaubserinnerungen",
"Share vacation memories, use simple past of sein and haben, and describe what you saw/did.",
"Use war (was, simple past of sein) and hatte (had, simple past of haben): Ich war im Urlaub. Ich hatte viel Spass. Use perfect tense: Ich habe...besucht, gesehen, gemacht. Question: Wie war dein Urlaub?",
["Wie war dein Urlaub?","Ich war am Strand.","Das Wetter war super.","Ich habe viel gesehen.","Der Urlaub war wunderschoen."],
[("der Urlaub","vacation"),("das Meer","sea"),("der Strand","beach"),("die Reise","trip"),("besuchen","to visit"),("sehen","to see"),("geniessen","to enjoy"),("das Hotel","hotel"),("der Ausflug","excursion")],
"Simple past of sein: ich war, du warst, er war, wir waren, ihr wart, sie waren. Simple past of haben: ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten.",
[("Complete: Wie ___ dein Urlaub? (was)","war"),("Ich war am ___. (beach)","Strand"),("Das Wetter ___ super. (was)","war"),("Ich habe viel ___. (seen)","gesehen")],
"Mein Urlaub in Spanien war toll. Ich war eine Woche am Strand. Das Wetter war immer sonnig. Ich habe viele Museen besucht und die Stadt erkundet. Das Essen war ausgezeichnet.",
[("Wo war der Urlaub?","In Spanien."),("Wie war das Wetter?","Immer sonnig.")],
"Hoeren Sie: Unser Urlaub in der Tuerkei war wunderschoen. Wir waren zwei Wochen am Meer. Das Hotel war sehr gut. Das Personal war freundlich. Das Essen hat hervorragend geschmeckt.",
[("Wie lange waren sie?","Zwei Wochen."),("Wie war das Personal?","Freundlich.")],
"Write 5 sentences about your last vacation using war/hatte.",
"Describe a memorable trip to a partner in German.",
"Vacation vocabulary (Urlaub, Strand, Meer, Reise), simple past of sein/haben, describing experiences."))
]

# ══════════════════════════════════════════════════════════════════════════
# Save intermediate output
# ══════════════════════════════════════════════════════════════════════════

print(f"Part2: added {len(NEW)} lessons")
with open(os.path.join(DATA_DIR, 'part2.json'), 'w', encoding='utf-8') as f:
    json.dump(NEW, f, ensure_ascii=False)
print("Saved to part2.json")
