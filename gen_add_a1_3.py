#!/usr/bin/env python3
# Append more A1 lessons and start A2
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))
exec(compile(open('gen_base.py').read(), 'gen_base.py', 'exec'))

TMP = 'src/data/_new_lessons_part.json'
with open(TMP, 'r', encoding='utf-8') as f:
    NEW = json.load(f)

NEW.append(L("A1","A1_unit_1","A1_lesson_21","Jahreszeiten",
"Name seasons and months, use im for time expressions.",
"im + season (im Fruehling) or im + month (im Januar). Seasons: der Fruehling, der Sommer, der Herbst, der Winter. Months are masculine: der Januar, der Februar.",
["Der Fruehling beginnt im Maerz.","Im Sommer ist es heiss.","Im Dezember schneit es.","Welche Jahreszeit magst du?"],
[("der Fruehling","spring"),("der Sommer","summer"),("der Herbst","autumn"),("der Winter","winter"),("der Januar","January"),("der Mai","May")],
"im = in + dem. Months are all masculine. Seasons are masculine. im before masculine/neuter, am for specific dates.",
[("Translate: in spring","im Fruehling"),("Der Sommer ___ warm.","ist"),("Welche ___ magst du?","Jahreszeit")],
"Vier Jahreszeiten. Fruehling Maerz-Mai. Sommer Juni-August. Herbst September-November. Winter Dezember-Februar.",
[("Wann ist der Fruehling?","Maerz bis Mai.")],
"Mein Lieblingsmonat ist Dezember wegen Weihnachten.",
[("Warum mag die Person Dezember?","Wegen Weihnachten.")],
"Write 4 sentences about seasons.","Tell a partner your favorite season.","Seasons, months, im expressions."))

NEW.append(L("A1","A1_unit_1","A1_lesson_22","Gefuehle",
"Express feelings using sein + adjective and sich fuehlen.",
"Ich bin + adjective (Ich bin gluecklich). Ich fuehle mich + adjective (Ich fuehle mich gut). Fragen: Wie geht es dir? Wie fuehlst du dich?",
["Ich bin gluecklich.","Bist du muede?","Sie ist traurig.","Ich fuehle mich heute gut."],
[("gluecklich","happy"),("traurig","sad"),("muede","tired"),("Angst haben","afraid"),("sich fuehlen","to feel")],
"sein + adjective for states. sich fuehlen + adjective for feelings. Wie geht es dir? Mir geht es gut.",
[("Translate: I am happy.","Ich bin gluecklich."),("Wie ___ es dir?","geht"),("Ich fuehle mich ___.","gut")],
"Anna ist gluecklich wegen der guten Note. Maria ist traurig weil sie krank ist.",
[("Warum ist Anna gluecklich?","Wegen der guten Note.")],
"Mir geht es nicht so gut. Ich fuehle mich muede und habe Kopfschmerzen.",
[("Wie fuehlt sich die Person?","Muede.")],
"Write 5 sentences about feelings today.","Ask a partner how they feel.","Feelings vocabulary and sich fuehlen."))

NEW.append(L("A1","A1_unit_1","A1_lesson_23","Nach dem Weg fragen",
"Ask for directions using imperative forms.",
"Gehen Sie (go), Biegen Sie ab (turn), geradeaus (straight), links/rechts. Fragen: Wo ist der Bahnhof? Wie komme ich zum Museum?",
["Wo ist der Bahnhof?","Gehen Sie geradeaus.","Biegen Sie links ab.","Wie komme ich zum Museum?"],
[("geradeaus","straight"),("links","left"),("rechts","right"),("die Kreuzung","intersection"),("die Ampel","traffic light")],
"Imperatives: Gehen Sie (formal). Biegen Sie ab (separated). zu + dative: zum Museum, zur Post.",
[("Translate: Go straight.","Gehen Sie geradeaus."),("___ Sie links ab.","Biegen"),("Wie komme ich ___ Museum?","zum")],
"Gehen Sie geradeaus bis zur Ampel. Dann rechts. Der Bahnhof ist links.",
[("Wo ist der Bahnhof?","Links nach der Ampel.")],
"Entschuldigung, wie komme ich zum Rathaus? Gehen Sie geradeaus, dann links.",
[("Wohin moechte die Person?","Zum Rathaus.")],
"Write directions to a nearby place.","Give directions using links/rechts.","Directions, imperative, prepositions."))

NEW.append(L("A1","A1_unit_1","A1_lesson_24","Am Wochenende",
"Talk about weekend plans using werden (will) and future intentions.",
"Use Ich werde (I will) + infinitive to express future: Ich werde ins Kino gehen. Present tense with time is also common for near future.",
["Am Wochenende werde ich schlafen.","Was machst du am Samstag?","Ich gehe ins Kino.","Wir werden Fussball spielen."],
[("das Wochenende","weekend"),("der Samstag","Saturday"),("der Sonntag","Sunday"),("werden","to become/will"),("das Kino","cinema")],
"werden + infinitive: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. Present tense + time also works for near future.",
[("Translate: I will sleep.","Ich werde schlafen."),("Was ___ du am Samstag?","machst"),("Am Wochenende ___ ich Fussball spielen.","werde")],
"Am Samstag werde ich Freunde treffen. Am Sonntag werde ich zu Hause bleiben.",
[("Was macht die Person am Samstag?","Freunde treffen.")],
"Am Wochenende fahre ich ans Meer. Das Wetter wird schoen.",
[("Wohin faehrt die Person?","Ans Meer.")],
"Write 3 weekend plans.","Tell a partner your weekend plans.","Weekend activities and werden + infinitive."))

NEW.append(L("A1","A1_unit_1","A1_lesson_25","Einkaufen gehen",
"Go shopping, ask about prices, and use gefaellt/gefallen.",
"gefallen (to like, dative verb): Es gefaellt mir. Mir gefaellt das Kleid. Question: Wie viel kostet das? Darf ich das anprobieren?",
["Wie viel kostet das?","Das ist zu teuer.","Mir gefaellt der Rock.","Haben Sie das in Rot?"],
[("kaufen","to buy"),("der Preis","price"),("teuer","expensive"),("billig","cheap"),("anprobieren","to try on"),("die Groesse","size")],
"gefallen + dative: Mir gefaellt der Rock. Dir gefaellt das Kleid. Welche Groesse brauchen Sie? Darf ich anprobieren?",
[("Translate: How much is that?","Wie viel kostet das?"),("Mir ___ der Rock.","gefaellt"),("Haben Sie das in ___?","Rot")],
"Maria kauft ein Kleid fuer 45 Euro. Es gefaellt ihr sehr gut.",
[("Wie viel kostet das Kleid?","45 Euro.")],
"Ich suche ein Hemd in Gross M. Haben Sie das in Blau?",
[("Welche Groesse?","M.")],
"Write a shopping dialogue.","Role play buying clothes.","Shopping vocabulary and gefallen."))

with open(TMP, 'w', encoding='utf-8') as f:
    json.dump(NEW, f, ensure_ascii=False)
print(f"A1 complete: {len(NEW)} new lessons")
