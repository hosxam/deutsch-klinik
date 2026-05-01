import json

data = json.load(open('src/data/listening.json', encoding='utf-8'))
a1 = data['A1']

nid = 26
qid_counter = sum(len(v['questions']) for v in a1) + 100

def qid():
    global qid_counter
    qid_counter += 1
    return "lq%d" % qid_counter

def add(title, script, questions, lessonId):
    global nid
    ex = {"id": "A1_listen_%d" % nid, "level": "A1", "title": title, "script": script, "questions": questions, "lessonId": lessonId}
    nid += 1
    a1.append(ex)

def mcq(question, options, answer):
    return {"id": qid(), "type": "mcq", "question": question, "options": options, "answer": answer}

def tf(question, answer):
    return {"id": qid(), "type": "true-false", "question": question, "answer": answer}

# 26: Personal introduction (A1_lesson_1)
add("Sich vorstellen",
"Hallo. Ich heisse Julia Mueller. Ich bin 28 Jahre alt. Ich komme aus Oesterreich, aus Wien. Ich wohne jetzt in Berlin. Ich bin Deutschlehrerin. Ich arbeite an einer Sprachschule. Ich mag meinen Job.",
[mcq("Wie alt ist Julia?", ["26", "28", "30", "32"], "28"),
 tf("Julia kommt aus Deutschland.", "false"),
 mcq("Was ist Julia von Beruf?", ["Arztin", "Lehrerin", "Apothekerin", "Ingenieurin"], "Lehrerin")],
"A1_lesson_1")

# 27: Phone number (A1_lesson_2)
add("Telefonnummer auf dem Anrufbeantworter",
"Sie sind verbunden mit der Praxis Dr. Schneider. Unsere Telefonnummer ist: 0 3 0 - 8 7 6 5 4 3 2. Sie erreichen uns montags bis freitags von 8 bis 17 Uhr. Fuer Notfaelle waehlen Sie bitte den Notruf 1 1 2.",
[mcq("Welche Telefonnummer hat die Praxis?", ["030-8765432", "030-7654321", "030-9876543", "030-1234567"], "030-8765432"),
 tf("Fuer Notfaelle waehlt man 110.", "false"),
 tf("Die Praxis hat samstags geoeffnet.", "false")],
"A1_lesson_2")

# 28: Address announcement (A1_lesson_3)
add("Adresse der neuen Praxis",
"Wir sind umgezogen! Unsere neue Adresse ist: Bahnhofstrasse 25, 10115 Berlin. Der Eingang ist auf der Rueckseite des Gebaeudes. Der naechste Bus ist die Linie 142, Haltestelle Bahnhofstrasse.",
[tf("Die neue Adresse ist Bahnhofstrasse 25.", "true"),
 mcq("Wo ist der Eingang?", ["Auf der Vorderseite", "Auf der Rueckseite", "Im Keller", "Im 1. Stock"], "Auf der Rueckseite"),
 mcq("Welcher Bus faehrt zur Praxis?", ["Linie 100", "Linie 142", "Linie 200", "Linie 15"], "Linie 142")],
"A1_lesson_3")

# 29: Appointment booking (A1_lesson_4)
add("Termin vereinbaren",
"Sprechstundenhilfe: Praxis Dr. Weber, guten Tag. Sie moechten einen Termin? Termin morgen um 9:30 Uhr bei Dr. Weber. Der naechste freie Termin ist um 9:30 Uhr. Passt das? Gut. Dann morgen um 9:30 Uhr. Bitte bringen Sie Ihre Versicherungskarte mit. Auf Wiederhoeren.",
[mcq("Wann ist der Termin?", ["Heute", "Morgen", "Uebermorgen", "Am Montag"], "Morgen"),
 mcq("Um wie viel Uhr ist der Termin?", ["9:00 Uhr", "9:30 Uhr", "10:00 Uhr", "10:30 Uhr"], "9:30 Uhr"),
 tf("Der Patient soll die Versicherungskarte mitbringen.", "true")],
"A1_lesson_4")

# 30: Appointment cancellation (A1_lesson_5)
add("Termin absagen",
"Anrufbeantworter der Praxis Dr. Mueller. Sie haben einen Termin fuer Mittwoch, den 15. Mai um 14:15 Uhr bei Dr. Mueller. Bitte sagen Sie ab, wenn Sie nicht kommen koennen. Sie koennen uns auch eine E-Mail schreiben an: info at praxis-mueller dot de.",
[tf("Der Termin ist am Mittwoch.", "true"),
 mcq("Wie kann man den Termin absagen?", ["Nur telefonisch", "Per Brief", "Per E-Mail oder Telefon", "Nur persoenlich"], "Per E-Mail oder Telefon"),
 mcq("Wie ist die E-Mail-Adresse?", ["info@praxis-mueller.de", "info@dr-mueller.de", "kontakt@praxis-mueller.de", "mueller@praxis.de"], "info@praxis-mueller.de")],
"A1_lesson_5")

# 31: Clinic reception dialogue (A1_lesson_6)
add("An der Anmeldung",
"Sprechstundenhilfe: Guten Morgen, wie heissen Sie? Patient: Ich heisse Peter Braun. Ich habe einen Termin um 10:00 Uhr. Sprechstundenhilfe: Einen Moment bitte. Ja, Herr Braun, Termin um 10:00 Uhr bei Frau Dr. Klein. Nehmen Sie bitte im Wartezimmer Platz. Es dauert etwa 10 Minuten. Patient: Vielen Dank.",
[tf("Der Patient heisst Peter Braun.", "true"),
 mcq("Wann hat der Patient den Termin?", ["Um 9:00 Uhr", "Um 10:00 Uhr", "Um 11:00 Uhr", "Um 14:00 Uhr"], "Um 10:00 Uhr"),
 tf("Der Patient muss 30 Minuten warten.", "false")],
"A1_lesson_6")

# 32: Pharmacy dialogue (A1_lesson_7)
add("In der Apotheke",
"Apotheker: Guten Tag, was kann ich fuer Sie tun? Kunde: Ich brauche etwas gegen Husten. Apotheker: Haben Sie ein Rezept? Kunde: Ja, hier bitte. Apotheker: Einen Moment bitte. Hier ist Ihr Medikament. Es kostet 7,50 Euro. Dreimal taeglich einen Messloeffel. Kunde: Vielen Dank.",
[mcq("Was braucht der Kunde?", ["Etwas gegen Kopfschmerzen", "Etwas gegen Husten", "Etwas gegen Fieber", "Etwas gegen Allergien"], "Etwas gegen Husten"),
 mcq("Wie viel kostet das Medikament?", ["5,50 Euro", "6,50 Euro", "7,50 Euro", "8,50 Euro"], "7,50 Euro"),
 tf("Der Kunde hat ein Rezept.", "true")],
"A1_lesson_7")

# 33: Simple symptom conversation (A1_lesson_8)
add("Beim Arzt - Symptome",
"Arzt: Guten Tag, Herr Schmidt. Was fehlt Ihnen? Patient: Ich habe seit drei Tagen Husten und Schnupfen. Und ich fuehle mich muede. Arzt: Haben Sie Fieber? Patient: Ja, gestern hatte ich 38,5 Grad. Arzt: Dann untersuche ich Sie jetzt kurz.",
[tf("Der Patient hat Husten und Schnupfen.", "true"),
 mcq("Seit wann hat der Patient die Symptome?", ["Seit einem Tag", "Seit zwei Tagen", "Seit drei Tagen", "Seit einer Woche"], "Seit drei Tagen"),
 mcq("Welche Temperatur hatte der Patient gestern?", ["37,5 Grad", "38,0 Grad", "38,5 Grad", "39,0 Grad"], "38,5 Grad")],
"A1_lesson_8")

# 34: Bus/train announcement (A1_lesson_9)
add("Durchsage im Bahnhof",
"Achtung, eine Durchsage: Der Regionalzug RE5 nach Leipzig von Gleis 2 hat 10 Minuten Verspaetung. Abfahrt ist jetzt um 14:45 Uhr. Grund: technische Stoerung. Wir bitten um Entschuldigung. Der Zug nach Hamburg auf Gleis 4 faehrt planmaessig um 15:00 Uhr.",
[mcq("Wohin faehrt der verspaetete Zug?", ["Nach Hamburg", "Nach Leipzig", "Nach Berlin", "Nach Muenchen"], "Nach Leipzig"),
 mcq("Wie viel Verspaetung hat der Zug?", ["5 Minuten", "10 Minuten", "15 Minuten", "20 Minuten"], "10 Minuten"),
 mcq("Um wie viel Uhr faehrt der Zug jetzt?", ["14:35 Uhr", "14:45 Uhr", "14:50 Uhr", "15:00 Uhr"], "14:45 Uhr")],
"A1_lesson_9")

# 35: Shopping dialogue (A1_lesson_10)
add("Beim Einkaufen",
"Verkauferin: Guten Tag. Kann ich Ihnen helfen? Kunde: Ja, ich suche eine warme Jacke. Verkauferin: Welche Groesse? Kunde: Groesse M. Verkauferin: Hier ist eine schwarze Jacke fuer 49,90 Euro. Kunde: Die gefaellt mir. Kann ich sie anprobieren? Verkauferin: Ja, natuerlich. Die Umkleidekabine ist dort hinten.",
[mcq("Was sucht der Kunde?", ["Einen Mantel", "Eine Jacke", "Einen Pullover", "Schuhe"], "Eine Jacke"),
 mcq("Welche Groesse braucht der Kunde?", ["S", "M", "L", "XL"], "M"),
 tf("Die Jacke kostet 59,90 Euro.", "false")],
"A1_lesson_10")

# 36: Cafe order (A1_lesson_11)
add("Im Cafe",
"Kellner: Guten Tag, was darf es sein? Gast: Ich haette gern einen Kaffee und ein Stueck Apfelkuchen. Kellner: Kommt sofort. Das macht 6,00 Euro zusammen. Gast: Hier sind 10 Euro. Kellner: Und 4 Euro zurueck. Vielen Dank. Gast: Danke, auf Wiederhoeren.",
[mcq("Was bestellt der Gast?", ["Tee und Kuchen", "Kaffee und Kuchen", "Kaffee und ein Brot", "Eine heisse Schokolade"], "Kaffee und Kuchen"),
 mcq("Wie viel kostet alles zusammen?", ["4,00 Euro", "5,00 Euro", "6,00 Euro", "7,00 Euro"], "6,00 Euro"),
 tf("Der Gast bekommt 4 Euro Wechselgeld zurueck.", "true")],
"A1_lesson_11")

# 37: Restaurant reservation (A1_lesson_12)
add("Tisch reservieren",
"Restaurant Zur Lindenbaum am Apparat. Guten Abend. Sie moechten einen Tisch reservieren? Fuer zwei Personen am Samstag um 19:00 Uhr. Ihr Name bitte? Frau Schulz. Tisch fuer zwei Personen am Samstag um 19:00 Uhr. Perfekt. Vielen Dank fuer Ihre Reservierung. Auf Wiederhoeren.",
[mcq("Fuer wie viele Personen ist die Reservierung?", ["Eine Person", "Zwei Personen", "Drei Personen", "Vier Personen"], "Zwei Personen"),
 mcq("Wann ist die Reservierung?", ["Am Freitag", "Am Samstag", "Am Sonntag", "Am Montag"], "Am Samstag"),
 mcq("Um wie viel Uhr ist der Tisch reserviert?", ["18:00 Uhr", "19:00 Uhr", "20:00 Uhr", "21:00 Uhr"], "19:00 Uhr")],
"A1_lesson_12")

# 38: Weather forecast (A1_lesson_13)
add("Wettervorhersage",
"Das Wetter fuer morgen: Am Morgen regnet es. Nehmen Sie einen Regenschirm mit. Am Nachmittag wird es sonnig. Die Temperatur steigt auf 20 Grad. Am Abend ist es bewolkt, aber es bleibt trocken. Der Wind ist schwach. Ein guter Tag fuer einen Spaziergang.",
[tf("Am Morgen regnet es.", "true"),
 mcq("Wie warm wird es am Nachmittag?", ["15 Grad", "18 Grad", "20 Grad", "22 Grad"], "20 Grad"),
 tf("Am Abend gibt es starken Wind.", "false")],
"A1_lesson_13")

# 39: Time/date announcement (A1_lesson_14)
add("Ansage - Uhrzeit und Datum",
"Hier ist die Zeitansage. Nach dem Signal ist es genau: Donnerstag, der fuenfzehnte Mai, vierzehn Uhr dreissig. Punkt 14:30 Uhr. Wetter: sonnig bei 21 Grad. Naechste Zeitansage in zwei Stunden.",
[mcq("Welcher Wochentag ist heute?", ["Mittwoch", "Donnerstag", "Freitag", "Samstag"], "Donnerstag"),
 mcq("Wie spaet ist es?", ["14:00 Uhr", "14:15 Uhr", "14:30 Uhr", "15:00 Uhr"], "14:30 Uhr"),
 mcq("Der wievielte Mai ist heute?", ["Der 5.", "Der 10.", "Der 15.", "Der 20."], "Der 15.")],
"A1_lesson_14")

# 40: Birthday invitation (A1_lesson_15)
add("Einladung zum Geburtstag",
"Hallo Lisa, hier ist Anna. Ich moechte dich zu meinem Geburtstag einladen. Meine Party ist am Samstag, den 20. Mai. Sie beginnt um 18:00 Uhr bei mir zu Hause. Es gibt Kuchen, Pizza und Getraenke. Du kannst gerne einen Freund mitbringen. Bitte sag mir bis Freitag Bescheid. Ich freue mich auf dich!",
[mcq("Wann ist die Geburtstagsparty?", ["Am 15. Mai", "Am 20. Mai", "Am 25. Mai", "Am 30. Mai"], "Am 20. Mai"),
 mcq("Um wie viel Uhr beginnt die Party?", ["16:00 Uhr", "17:00 Uhr", "18:00 Uhr", "19:00 Uhr"], "18:00 Uhr"),
 tf("Lisa soll bis Freitag Bescheid sagen.", "true")],
"A1_lesson_15")

# 41: School/course information (A1_lesson_16)
add("Informationen zum Deutschkurs",
"Herzlich willkommen zum Deutschkurs A1. Der Kurs beginnt am Montag, den 3. Juni. Der Unterricht ist von 9:00 bis 12:15 Uhr, montags bis freitags. Der Kursort ist Raum 204, VHS Berlin. Bitte bringen Sie ein Heft, einen Stift und das Kursbuch mit. Bei Fragen fragen Sie bitte Ihre Kursleiterin, Frau Fischer.",
[mcq("Wann beginnt der Deutschkurs?", ["Am 1. Juni", "Am 3. Juni", "Am 5. Juni", "Am 10. Juni"], "Am 3. Juni"),
 mcq("Wie lange dauert der Unterricht taeglich?", ["2 Stunden", "3 Stunden", "3 Stunden 15 Minuten", "4 Stunden"], "3 Stunden 15 Minuten"),
 tf("Die Kursleiterin heisst Frau Fischer.", "true")],
"A1_lesson_16")

# 42: Work schedule (A1_lesson_17)
add("Arbeitsplan Durchsage",
"Achtung, eine wichtige Information fuer alle Mitarbeiter: Der Arbeitsplan fuer naechste Woche ist online. Frau Schneider arbeitet von Montag bis Mittwoch Fruehschicht von 6:00 bis 14:00 Uhr. Herr Braun hat Donnerstag und Freitag Spaetschicht von 14:00 bis 22:00 Uhr. Am Wochenende hat die Praxis geschlossen.",
[tf("Frau Schneider hat Fruehschicht.", "true"),
 mcq("Wann arbeitet Herr Braun spaet?", ["Am Montag und Dienstag", "Am Dienstag und Mittwoch", "Am Donnerstag und Freitag", "Am Samstag und Sonntag"], "Am Donnerstag und Freitag"),
 mcq("Wie lange dauert die Fruehschicht?", ["6 Stunden", "8 Stunden", "10 Stunden", "12 Stunden"], "8 Stunden")],
"A1_lesson_17")

# 43: Hotel check-in (A1_lesson_18)
add("Hotel Check-in",
"Rezeption: Guten Abend, willkommen im Hotel Central. Gast: Guten Abend, ich habe ein Zimmer reserviert. Rezeption: Ihr Name bitte? Gast: Thomas Wagner. Rezeption: Ein Einzelzimmer fuer drei Naechte. Richtig. Zimmer 305 im dritten Stock. Das Fruehstueck gibt es von 7:00 bis 10:00 Uhr im Restaurant. Gast: Vielen Dank.",
[tf("Der Gast heisst Thomas Wagner.", "true"),
 mcq("In welchem Stock ist das Zimmer?", ["Im 1. Stock", "Im 2. Stock", "Im 3. Stock", "Im 4. Stock"], "Im 3. Stock"),
 mcq("Wann gibt es Fruehstueck?", ["Von 6:00 bis 9:00", "Von 7:00 bis 10:00", "Von 8:00 bis 11:00", "Von 7:30 bis 9:30"], "Von 7:00 bis 10:00")],
"A1_lesson_18")

# 44: City directions (A1_lesson_19)
add("Nach dem Weg fragen",
"Tourist: Entschuldigung, wo ist die Stadtbibliothek? Passant: Die Bibliothek? Gehen Sie hier geradeaus bis zur naechsten Kreuzung. Dann biegen Sie rechts in die Goethestraffe. Nach 200 Metern sehen Sie das Museum. Die Bibliothek ist gegenueber vom Museum. Tourist: Vielen Dank!",
[mcq("Was sucht der Tourist?", ["Das Museum", "Die Bibliothek", "Das Krankenhaus", "Den Bahnhof"], "Die Bibliothek"),
 tf("Die Bibliothek ist gegenueber vom Museum.", "true"),
 mcq("In welche Strasse biegt der Tourist ein?", ["Hauptstrasse", "Schulstrasse", "Goethestraffe", "Bahnhofstrasse"], "Goethestraffe")],
"A1_lesson_19")

# 45: Lost item report (A1_lesson_20)
add("Fundsache melden",
"Guten Tag. Ich bin gestern mit dem Bus 142 gefahren und habe meinen Rucksack verloren. Er ist blau. Inhalt: ein Buch, ein Heft und ein Portemonnaie mit 20 Euro. Ich war gestern um 16 Uhr an der Haltestelle Hauptbahnhof. Koennen Sie mir helfen?",
[mcq("Was hat der Kunde verloren?", ["Einen Schirm", "Einen Rucksack", "Eine Tasche", "Ein Handy"], "Einen Rucksack"),
 tf("Der Rucksack ist schwarz.", "false"),
 mcq("Mit welchem Bus ist der Kunde gefahren?", ["Bus 100", "Bus 142", "Bus 200", "Bus 15"], "Bus 142")],
"A1_lesson_20")

# 46: Emergency call basics (A1_lesson_21)
add("Notruf - Erste Hilfe",
"Notrufzentrale, was ist passiert? Anrufer: Ein Unfall. Ein Mann liegt auf der Strasse. Notruf: Ihre Adresse bitte? Anrufer: Hauptstrasse 50 in Berlin-Mitte. Notruf: Warten Sie einen Moment. Der Krankenwagen kommt sofort. Bleiben Sie beim Patienten. Notruf 112 ist immer kostenlos.",
[mcq("Welche Nummer ruft man im Notfall?", ["110", "112", "115", "116117"], "112"),
 tf("Der Unfall ist in der Hauptstrasse 50.", "true"),
 mcq("Was soll der Anrufer tun?", ["Nach Hause gehen", "Beim Patienten bleiben", "Den Bus nehmen", "Ins Krankenhaus laufen"], "Beim Patienten bleiben")],
"A1_lesson_21")

# 47: Hospital visiting hours (A1_lesson_22)
add("Krankenhaus Besuchszeiten Ansage",
"Willkommen im Krankenhaus St. Josef. Die Besuchszeiten sind taeglich von 14:00 bis 19:00 Uhr. Es duerfen maximal zwei Besucher pro Patient kommen. Bitte desinfizieren Sie Ihre Haende am Eingang. Die Cafeteria im Erdgeschoss hat von 8:00 bis 20:00 Uhr geoeffnet.",
[mcq("Bis wann sind die Besuchszeiten?", ["17:00 Uhr", "18:00 Uhr", "19:00 Uhr", "20:00 Uhr"], "19:00 Uhr"),
 tf("Es duerfen maximal 3 Besucher pro Patient kommen.", "false"),
 mcq("Wo ist die Cafeteria?", ["Im 1. Stock", "Im Erdgeschoss", "Im Keller", "Im 2. Stock"], "Im Erdgeschoss")],
"A1_lesson_22")

# 48: Waiting room announcement (A1_lesson_23)
add("Ansage im Wartezimmer",
"Achtung, eine Durchsage. Frau Sonja Meier wird gebeten, in das Behandlungszimmer 2 zu kommen. Herr Dr. Weber wartet dort. Und Herr Klaus Braun, bitte gehen Sie zum Behandlungszimmer 1. Die naechsten Patienten sind: Frau Schulz und Herr Fischer. Bitte haben Sie noch etwas Geduld.",
[mcq("Wer wird in Behandlungszimmer 2 gerufen?", ["Herr Braun", "Frau Meier", "Herr Mueller", "Frau Schulz"], "Frau Meier"),
 tf("Herr Braun soll in Behandlungszimmer 1.", "true"),
 mcq("Welcher Arzt wartet in Behandlungszimmer 2?", ["Dr. Mueller", "Dr. Klein", "Dr. Weber", "Dr. Fischer"], "Dr. Weber")],
"A1_lesson_23")

# 49: Daily routine monologue (A1_lesson_24)
add("Mein Tagesablauf",
"Hallo, ich bin Lena. Ich stehe jeden Tag um 6:30 Uhr auf. Dann dusche ich und fruehstuecke um 7:00 Uhr. Um 8:00 Uhr gehe ich zur Arbeit. Ich arbeite in einer Apotheke. Um 12:30 Uhr mache ich Mittagspause. Um 17:00 Uhr bin ich zu Hause. Um 19:00 Uhr koche ich Abendessen. Um 22:30 Uhr gehe ich ins Bett.",
[mcq("Wann steht Lena auf?", ["Um 6:00 Uhr", "Um 6:30 Uhr", "Um 7:00 Uhr", "Um 7:30 Uhr"], "Um 6:30 Uhr"),
 tf("Lena arbeitet in einer Apotheke.", "true"),
 mcq("Wann geht Lena ins Bett?", ["Um 21:30 Uhr", "Um 22:00 Uhr", "Um 22:30 Uhr", "Um 23:00 Uhr"], "Um 22:30 Uhr")],
"A1_lesson_24")

# 50: Weekend plan dialogue (A1_lesson_25)
add("Plane fuer das Wochenende",
"Tom: Hallo Lisa, hast du schon Plaene fuer das Wochenende? Lisa: Ja, am Samstag gehe ich ins Schwimmbad. Und du? Tom: Am Samstag spiele ich Fussball. Lisa: Und am Sonntag? Tom: Am Sonntag besuche ich meine Oma. Lisa: Das klingt schoen. Vielleicht koennen wir naechste Woche etwas zusammen machen.",
[mcq("Was macht Lisa am Samstag?", ["Fussball spielen", "Ins Schwimmbad gehen", "Ihre Oma besuchen", "Einkaufen"], "Ins Schwimmbad gehen"),
 tf("Tom spielt am Samstag Fussball.", "true"),
 mcq("Was macht Tom am Sonntag?", ["Er geht ins Kino", "Er besucht seine Oma", "Er lernt Deutsch", "Er arbeitet"], "Er besucht seine Oma")],
"A1_lesson_25")

# Save
data['A1'] = a1
json.dump(data, open('src/data/listening.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print("Added %d listening exercises. Total A1: %d" % (25, len(a1)))
print("Range: A1_listen_26 to A1_listen_50")

# ---- VALIDATION ----
ids = set(); dupes = []
scripts_lower = set(); dup_scripts = []
broken_lessons = []; missing_answers = []; missing_fields = []
required = ['id', 'level', 'title', 'script', 'questions', 'lessonId']

all_lesson_ids = set(x['id'] for x in json.load(open('src/data/germanLessons.json',encoding='utf-8')) if x.get('level')=='A1')

for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
    s_lower = v.get('script', '').strip().lower()[:100]
    if s_lower in scripts_lower: dup_scripts.append(v['id'])
    scripts_lower.add(s_lower)
    for f in required:
        if f not in v or v[f] is None:
            missing_fields.append("%s missing %s" % (v['id'], f))
    lid = v.get('lessonId')
    if lid and lid not in all_lesson_ids:
        broken_lessons.append("%s: lessonId=%s not found" % (v['id'], lid))
    for q in v.get('questions', []):
        if 'answer' not in q or q['answer'] is None:
            missing_answers.append("%s Q missing answer" % (v['id']))

print()
print("=== VALIDATION RESULTS ===")
print("Duplicate IDs: %d" % len(dupes))
if dupes: print("  ", dupes)
print("Duplicate/similar scripts: %d" % len(dup_scripts))
if dup_scripts: print("  ", dup_scripts)
print("Broken lessonIds: %d" % len(broken_lessons))
for m in broken_lessons: print("  " + m)
print("Questions missing answers: %d" % len(missing_answers))
for m in missing_answers: print("  " + m)
print("Missing required fields: %d" % len(missing_fields))
for m in missing_fields: print("  " + m)

total_issues = len(dupes) + len(dup_scripts) + len(broken_lessons) + len(missing_answers) + len(missing_fields)
print()
print("Total issues: %d" % total_issues)
if total_issues == 0:
    print("ALL GOOD!")
else:
    print("Issues found!")
