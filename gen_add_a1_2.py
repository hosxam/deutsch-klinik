#!/usr/bin/env python3
# Appends generated lessons to an intermediate JSON file
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))
exec(compile(open('gen_base.py').read(), 'gen_base.py', 'exec'))

TMP = os.path.join('src/data', '_new_lessons_part.json')

# Load existing tmp or start fresh
if os.path.exists(TMP):
    with open(TMP, 'r', encoding='utf-8') as f:
        NEW = json.load(f)
else:
    NEW = []

NEW.append(L("A1","A1_unit_2","A1_lesson_16","Essen und Trinken",
"Discuss food/drink and use gern/nicht gern with essen/trinken.",
"essen is irregular: ich esse, du isst, er isst. trinken is regular. Accusative: Ich esse einen Apfel. gern + verb = like doing. nicht gern = dislike.",
["Ich esse gern Pizza.","Ich trinke Wasser.","Magst du Kaffee?","Er isst keinen Fisch."],
[("das Essen","food"),("trinken","drink"),("der Kaffee","coffee"),("der Apfel","apple"),("die Suppe","soup"),("das Brot","bread")],
"essen conjugation: ich esse, du isst, er isst, wir essen, ihr esst, sie essen. Accusative with essen/trinken.",
[("Translate: I like pizza.","Ich esse gern Pizza."),("Ich ___ einen Apfel.","esse"),("Er isst ___ Fisch.","keinen")],
"Peter isst Brot mit Kaese zum Fruehstueck und trinkt Kaffee.",
[("Was isst Peter?","Brot mit Kaese.")],
"Ich mag Pizza und Pasta. Ich trinke Rotwein dazu.",
[("Was mag die Person?","Pizza und Pasta.")],
"Write 4 sentences about foods you like/dislike.","Tell a partner what you eat for meals.","Food vocabulary and essen/trinken with gern."))

NEW.append(L("A1","A1_unit_2","A1_lesson_17","Geburtstag feiern",
"Discuss birthdays using dates and ordinal numbers.",
"Ordinal numbers: 1-19 add -te (erste, zweite). 20+ add -ste (zwanzigste). am + ordinal + month: am fuenfzehnten Mai. Wann hast du Geburtstag? Ich habe am...",
["Wann hast du Geburtstag?","Ich habe am 15. Mai Geburtstag.","Herzlichen Glueckwunsch!","Ich bekomme ein Geschenk."],
[("der Geburtstag","birthday"),("das Geschenk","gift"),("die Torte","cake"),("feiern","to celebrate"),("einladen","to invite")],
"Ordinals: 1-19 -te, 20+ -ste. am + date: am dritten Oktober. Questions: Wann hast du Geburtstag? Wie alt wirst du?",
[("Translate: When is your birthday?","Wann hast du Geburtstag?"),("Ich habe am 15. ___ Geburtstag.","Mai"),("Alles ___ zum Geburtstag!","Gute")],
"Anna hat am 8. Maerz Geburtstag. Sie wird 25. Es gibt Torte und Geschenke.",
[("Wann hat Anna Geburtstag?","Am 8. Maerz.")],
"Herzlichen Glueckwunsch, Thomas! Ich wuensche dir alles Gute.",
[("Was wuenscht die Person?","Alles Gute.")],
"Write 3 birthday wishes in German.","Tell a partner your birthday.","Birthday vocabulary and ordinal dates."))

NEW.append(L("A1","A1_unit_2","A1_lesson_18","Zahlen und Rechnen",
"Use numbers 0-1M and basic math in German.",
"Numbers: 21 = einundzwanzig (ones-and-tens). Math: plus, minus, mal, geteilt durch = ist. Prices: 15,50E = fuenfzehn Euro fuenfzig.",
["Zwei plus drei ist fuenf.","Zehn minus vier ist sechs.","Fuenf mal drei ist fuenfzehn.","Wie viel kostet das?"],
[("plus","plus"),("minus","minus"),("mal","times"),("die Zahl","number"),("wie viel","how much")],
"Numbers combine ones before tens: 23 = dreiundzwanzig. Euro prices: 12,40E = zwoelf Euro vierzig.",
[("Complete: Zwei plus drei ___ fuenf.","ist"),("Translate: 23","dreiundzwanzig"),("Fuenf mal vier ist ___.","zwanzig")],
"Brot kostet 2,50E, Milch 1,20E, Eier 3,00E. Zusammen 6,70E.",
[("Wie viel kostet das Brot?","2,50 Euro.")],
"Ich habe 50 Euro ausgegeben. Hemd 25, Hose 20, Socken 5.",
[("Wie viel hat das Hemd gekostet?","25 Euro.")],
"Write 5 math problems in German.","Practice saying prices.","Numbers and basic math."))

NEW.append(L("A1","A1_unit_2","A1_lesson_19","In der Schule",
"Discuss school subjects using moegen (to like).",
"moegen: ich mag, du magst, er mag, wir moegen. + accusative: Ich mag Mathematik. Lieblings- prefix: mein Lieblingsfach. Fragen: Welches Fach magst du?",
["Ich mag Mathematik.","Welches Fach magst du?","Mein Lieblingsfach ist Deutsch.","Der Unterricht beginnt um 8 Uhr."],
[("die Schule","school"),("das Fach","subject"),("der Lehrer","teacher"),("die Hausaufgaben","homework")],
"moegen conjugation: mag, magst, mag, moegen. Lieblings- prefix attaches to subject: mein Lieblingsfach. Question: Welches Fach magst du?",
[("Translate: I like math.","Ich mag Mathematik."),("Mein Lieblings___ ist Deutsch.","fach"),("Welches Fach ___ du?","magst")],
"Mein Schultag beginnt um 8. Ich mag Biologie und Sport.",
[("Um wieviel Uhr beginnt die Schule?","Um 8.")],
"Am Montag habe ich Mathe, Deutsch und Englisch. Sport ist Freitag.",
[("Welches Fach hat die Person am Montag?","Mathe, Deutsch, Englisch.")],
"Write 4 sentences about favorite subjects.","Describe your school day.","School vocabulary and moegen."))

NEW.append(L("A1","A1_unit_2","A1_lesson_20","Sport",
"Discuss sports using spielen and machen.",
"spielen for ball sports (Fussball spielen). machen for activities (Yoga machen). gern expresses enjoyment. Fragen: Was machst du gern? Treibst du Sport?",
["Ich spiele gern Fussball.","Macht du Yoga?","Wir spielen Tennis am Wochenende.","Sport ist gesund."],
[("der Sport","sport"),("spielen","play"),("machen","do"),("der Fussball","soccer"),("das Tennis","tennis"),("das Schwimmen","swimming")],
"spielen (regular) for ball sports. machen for activities. Sport treiben = to do sports. Frequency: einmal pro Woche, jeden Tag.",
[("Complete: Ich ___ Fussball.","spiele"),("Translate: I do yoga.","Ich mache Yoga."),("Treibst du ___?","Sport")],
"Markus spielt Fussball und geht zweimal pro Woche schwimmen.",
[("Wie oft geht er schwimmen?","Zweimal pro Woche.")],
"Ich spiele Tennis. Dreimal pro Woche trainiere ich.",
[("Wie oft trainiert die Person?","Dreimal pro Woche.")],
"Write 4 sentences about sports you do.","Ask a partner about their sports.","Sports vocabulary, spielen vs machen."))

# Save
with open(TMP, 'w', encoding='utf-8') as f:
    json.dump(NEW, f, ensure_ascii=False)
print(f"Saved {len(NEW)} lessons to {TMP}")
