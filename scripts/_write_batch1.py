import json

data = json.load(open('src/data/writing.json', encoding='utf-8'))
a1 = data['A1']
nid = 26

def add(title, prompt, instructions, wordLimit, tips, lessonId):
    global nid
    ex = {
        "id": "A1_write_%d" % nid,
        "level": "A1",
        "title": title,
        "prompt": prompt,
        "instructions": instructions,
        "wordLimit": wordLimit,
        "tips": tips,
        "rubric": {
            "taskCompletion": "Vollstaendigkeit der Aufgabenstellung. Hast du alle Punkte beantwortet?",
            "grammarAccuracy": "Grammatikalische Korrektheit (Artikel, Verbkonjugation, Satzbau).",
            "vocabularyUse": "Angemessener Wortschatz und Wortwahl.",
            "wordOrder": "Satzstellung (Subjekt-Verb-Objekt, Position von Zeit- und Ortsangaben).",
            "spellingCapitalization": "Rechtschreibung und Grossschreibung (Nomen, Satzanfang, Sie/du).",
            "appropriateRegister": "Angemessene Hoefflichkeitsform (Sie/du) und Ton."
        },
        "rubricKeys": ["taskCompletion", "grammarAccuracy", "vocabularyUse", "wordOrder", "spellingCapitalization", "appropriateRegister"],
        "lessonId": lessonId
    }
    nid += 1
    a1.append(ex)

# 26: Introduce yourself in a short message (A1_lesson_1)
add("Kurze Vorstellung",
"Stellen Sie sich kurz vor. Schreiben Sie: Wie heissen Sie? Wie alt sind Sie? Woher kommen Sie? Wo wohnen Sie? Was machen Sie beruflich?",
"Schreiben Sie 3-5 vollstaendige Saetze.", 40,
"Schreiben Sie: Ich heisse ... Ich bin ... Jahre alt. Ich komme aus ... Ich wohne in ... Ich bin ... von Beruf.", "A1_lesson_1")

# 27: Email to a language school (A1_lesson_2)
add("E-Mail an die Sprachschule",
"Sie moechten einen Deutschkurs besuchen. Schreiben Sie eine kurze E-Mail an die Volkshochschule. Fragen Sie: Wann beginnt der Kurs? Wie viel kostet er? Wann ist der Unterricht?",
"Schreiben Sie eine formelle E-Mail mit Anrede und Grussformel. 4-6 Saetze.", 60,
"Schreiben Sie: Sehr geehrte Damen und Herren, ... Ich moechte ... Fragen: Wann ...? Wie viel ...? Mit freundlichen Gruessen, ...", "A1_lesson_2")

# 28: Book a doctor appointment (A1_lesson_3)
add("Termin beim Arzt buchen",
"Sie haben Rueckenschmerzen. Rufen Sie in der Praxis an und schreiben Sie eine Nachricht fuer die Terminbuchung. Sagen Sie: Wer Sie sind. Warum Sie einen Termin brauchen. Wann Sie Zeit haben.",
"Schreiben Sie eine kurze Notiz mit 3-4 Informationen.", 50,
"Schreiben Sie: Mein Name ist ... Ich habe ... Koennte ich am ... kommen?", "A1_lesson_3")

# 29: Cancel an appointment (A1_lesson_4)
add("Termin absagen",
"Sie haben einen Termin beim Arzt am Freitag. Sie koennen leider nicht kommen. Sagen Sie dem Arzt ab. Schreiben Sie: Wann der Termin ist. Warum Sie nicht kommen koennen. Ob Sie einen neuen Termin moechten.",
"Schreiben Sie 3-4 Saetze. Entschuldigen Sie sich.", 50,
"Schreiben Sie: Guten Tag, ... Leider kann ich am ... nicht kommen, weil ... Kann ich einen neuen Termin am ... haben?", "A1_lesson_4")

# 30: Reschedule an appointment (A1_lesson_5)
add("Termin verschieben",
"Sie haben einen Termin fuer Montag um 14:00 Uhr. Sie arbeiten an dem Tag. Schreiben Sie eine Nachricht und fragen Sie nach einem anderen Termin am Dienstag oder Mittwoch.",
"Schreiben Sie 3-4 Saetze. Schreiben Sie freundlich.", 50,
"Schreiben Sie: Hallo, ... Ich habe einen Termin am ... um ... Ich arbeite an dem Tag. Haben Sie am ... oder ... einen Termin frei?", "A1_lesson_5")

# 31: Message to a friend (A1_lesson_6)
add("Nachricht an einen Freund",
"Schreiben Sie eine kurze Nachricht an Ihre Freundin Anna. Fragen Sie: Wie geht es ihr? Was macht sie am Wochenende? Ob sie mit Ihnen ins Kino gehen moechte?",
"Schreiben Sie 4-5 Saetze. Benutzen Sie du.", 50,
"Schreiben Sie: Hallo Anna, ... Wie geht es dir? ... Am Wochenende ... Moechtest du ...?", "A1_lesson_6")

# 32: Birthday invitation (A1_lesson_7)
add("Geburtstagseinladung",
"Sie haben am Samstag Geburtstag. Schreiben Sie eine Einladung an einen Freund. Sagen Sie: Wann die Party ist. Wo die Party ist. Wann die Party beginnt. Was es zu essen und trinken gibt.",
"Schreiben Sie 5-6 Saetze. Schreiben Sie freundlich.", 70,
"Schreiben Sie: Liebe/r ..., Ich lade dich herzlich zu meinem Geburtstag ein! ... Am ... um ... Bei mir zu Hause ... Es gibt ... Bitte sag mir bis ... Bescheid.", "A1_lesson_7")

# 33: Reply to invitation (A1_lesson_8)
add("Antwort auf Einladung",
"Ihr Freund Tom hat Sie zu seiner Geburtstagsparty eingeladen. Schreiben Sie eine Antwort. Sagen Sie: Danke fuer die Einladung. Ob Sie kommen koennen. Was Sie mitbringen.",
"Schreiben Sie 3-4 Saetze. Antworten Sie auf die Einladung.", 50,
"Schreiben Sie: Hallo Tom, ... Vielen Dank fuer die Einladung! Ich komme gerne. ... Ich bringe ... mit.", "A1_lesson_8")

# 34: Ask for directions (A1_lesson_9)
add("Nach dem Weg fragen",
"Sie sind am Bahnhof und suchen das Krankenhaus. Schreiben Sie eine kurze Nachricht, um nach dem Weg zu fragen. Fragen Sie: Wie komme ich zum Krankenhaus? Wie lange dauert es zu Fuss? Gibt es einen Bus?",
"Schreiben Sie 3-4 Fragen. Benutzen Sie Hoeflichkeitsform.", 40,
"Schreiben Sie: Entschuldigung, ... Wie komme ich zum ...? Wie weit ist es? ... Welcher Bus fahert dort hin? Vielen Dank.", "A1_lesson_9")

# 35: Ask about opening hours (A1_lesson_10)
add("Oeffnungszeiten erfragen",
"Sie moechten zur Apotheke gehen. Schreiben Sie eine kurze Nachricht und fragen Sie nach den Oeffnungszeiten. Fragen Sie auch: Ob die Apotheke am Samstag geoeffnet hat? Ob es einen Notdienst gibt?",
"Schreiben Sie 3-4 Saetze oder Fragen.", 50,
"Schreiben Sie: Guten Tag, ... Wann hat die Apotheke geoeffnet? ... Hat samstags geoeffnet? ... Gibt es einen Notdienst? ... Vielen Dank.", "A1_lesson_10")

# 36: Write to a landlord (A1_lesson_11)
add("Nachricht an den Vermieter",
"Sie haben eine Wohnung gefunden. Schreiben Sie eine kurze Nachricht an den Vermieter. Fragen Sie: Ist die Wohnung noch frei? Ab wann kann man einziehen? Wie hoch ist die Kaution? Kann man die Wohnung besichtigen?",
"Schreiben Sie 4-5 Saetze. Schreiben Sie formell.", 70,
"Schreiben Sie: Sehr geehrte/r ..., Ich habe Ihre Anzeige gesehen. ... Ist die Wohnung noch frei? ... Ab wann kann ich einziehen? ... Wie hoch ist die Kaution? ... Mit freundlichen Gruessen, ...", "A1_lesson_11")

# 37: Shopping list (A1_lesson_12)
add("Einkaufsliste schreiben",
"Sie gehen einkaufen. Schreiben Sie eine Einkaufsliste fuer die Woche. Schreiben Sie 8-10 Dinge, die Sie kaufen wollen. Schreiben Sie auch die Menge (z.B. 1 Liter, 500g, 2 Stueck).",
"Schreiben Sie eine Liste mit Stichpunkten.", 30,
"Schreiben Sie: - 1 Liter Milch, - 2 Aepfel, - 500g Butter, - 1 Brot, - Kaese, - 6 Eier, - ...", "A1_lesson_12")

# 38: Daily routine (A1_lesson_13)
add("Mein Tagesablauf",
"Schreiben Sie ueber Ihren typischen Tag. Beschreiben Sie: Wann stehen Sie auf? Was fruehstuecken Sie? Wann gehen Sie zur Arbeit/Schule? Wann essen Sie zu Mittag? Wann kochen Sie Abendessen? Wann gehen Sie ins Bett?",
"Schreiben Sie 6-8 Saetze. Benutzen Sie Uhrzeiten.", 80,
"Schreiben Sie: Ich stehe um ... Uhr auf. Um ... Uhr fruehstuecke ich. Danach ... Um ... Uhr gehe ich zur Arbeit. Um ... Uhr ...", "A1_lesson_13")

# 39: Write about your family (A1_lesson_14)
add("Meine Familie",
"Stellen Sie Ihre Familie vor. Schreiben Sie: Wie viele Personen sind in Ihrer Familie? Wie heissen sie? Wie alt sind sie? Was machen sie beruflich?",
"Schreiben Sie 5-6 Saetze.", 70,
"Schreiben Sie: Meine Familie hat ... Personen. Das sind ... Mein Vater heisst ... und ist ... Jahre alt. Meine Mutter ... Ich habe einen Bruder/eine Schwester ...", "A1_lesson_14")

# 40: Write about work/study (A1_lesson_15)
add("Mein Beruf / Mein Studium",
"Schreiben Sie ueber Ihren Beruf oder Ihr Studium. Beschreiben Sie: Was machen Sie? Wo arbeiten/studieren Sie? Seit wann? Gefaellt es Ihnen? Was sind Ihre Aufgaben?",
"Schreiben Sie 5-6 Saetze.", 70,
"Schreiben Sie: Ich bin ... von Beruf / Ich studiere ... Ich arbeite bei / an der ... Meine Aufgaben sind ... Der Beruf gefaellt mir, weil ...", "A1_lesson_15")

# 41: Pharmacy request (A1_lesson_16)
add("Anfrage in der Apotheke",
"Sie haben Husten. Schreiben Sie eine kurze Nachricht an die Apotheke. Sagen Sie: Welche Symptome Sie haben. Ob Sie ein Medikament brauchen. Fragen Sie nach dem Preis.",
"Schreiben Sie 3-4 Saetze. Schreiben Sie hoeflich.", 50,
"Schreiben Sie: Guten Tag, ... Ich habe Husten und ... Brauchen Sie ein Rezept oder gibt es ein Medikament ohne Rezept? Wie viel kostet es?", "A1_lesson_16")

# 42: Short symptom description (A1_lesson_17)
add("Symptome beschreiben",
"Sie fuehlen sich krank. Schreiben Sie eine kurze Beschreibung fuer den Arzt. Sagen Sie: Welche Symptome Sie haben. Seit wann. Haben Sie Fieber? Welche Temperatur?",
"Schreiben Sie 4-5 Saetze.", 60,
"Schreiben Sie: Seit ... Tagen habe ich ... Ich habe auch ... und ... Meine Temperatur ist ... Grad. Ich fuehle mich ...", "A1_lesson_17")

# 43: Simple clinic form (A1_lesson_18)
add("Anmeldebogen ausfuellen",
"Sie sind in der Praxis. Fuellen Sie einen kurzen Anmeldebogen aus. Schreiben Sie: Ihren vollstaendigen Namen. Ihre Adresse. Ihr Geburtsdatum. Ihre Telefonnummer. Ihre Versicherung.",
"Schreiben Sie in Stichpunkten oder kurzen Saetzen.", 40,
"Schreiben Sie: Name: ... Adresse: ... Geburtsdatum: ... Telefon: ... Versicherung: ...", "A1_lesson_18")

# 44: Hotel request (A1_lesson_19)
add("Hotelzimmer reservieren",
"Sie wollen naechste Woche nach Berlin reisen. Schreiben Sie eine kurze E-Mail an ein Hotel. Fragen Sie: Ist ein Einzelzimmer frei? Wie viel kostet es? Gibt es Fruehstueck? Koennen Sie ab dem 15. Mai einchecken?",
"Schreiben Sie 4-5 Saetze. Schreiben Sie formell.", 70,
"Schreiben Sie: Sehr geehrte Damen und Herren, ... Ich moechte ein Einzelzimmer vom ... bis ... reservieren. ... Wie viel kostet das Zimmer pro Nacht? ... Ist Fruehstueck inklusive? ... Mit freundlichen Gruessen, ...", "A1_lesson_19")

# 45: Restaurant reservation (A1_lesson_20)
add("Tisch reservieren im Restaurant",
"Sie wollen am Samstag mit einem Freund essen gehen. Schreiben Sie eine Nachricht an das Restaurant und reservieren Sie einen Tisch. Sagen Sie: Fuer wie viele Personen. An welchem Tag. Um wie viel Uhr. Ihr Name.",
"Schreiben Sie 3-4 Saetze.", 50,
"Schreiben Sie: Guten Tag, ... Ich moechte einen Tisch fuer ... Personen am ... um ... Uhr reservieren. ... Mein Name ist ... Vielen Dank.", "A1_lesson_20")

# 46: Write about your weekend (A1_lesson_21)
add("Mein Wochenende",
"Schreiben Sie, was Sie am letzten Wochenende gemacht haben. Beschreiben Sie: Was haben Sie am Samstag gemacht? Was haben Sie am Sonntag gemacht? Hat es Ihnen gefallen?",
"Schreiben Sie 5-6 Saetze. Benutzen Sie die Vergangenheit (Perfekt oder Praeteritum von haben/sein).", 80,
"Schreiben Sie: Am Samstag bin ich ... gegangen. ... habe ich ... gemacht. Am Sonntag habe ich ... Das Wochenende war ...", "A1_lesson_21")

# 47: Write about the weather (A1_lesson_22)
add("Das Wetter beschreiben",
"Schreiben Sie ueber das Wetter heute und morgen. Beschreiben Sie: Wie ist das Wetter heute? Wie wird das Wetter morgen sein? Welche Kleidung ziehen Sie an?",
"Schreiben Sie 4-5 Saetze.", 60,
"Schreiben Sie: Heute scheint die Sonne / regnet es. Die Temperatur ist ... Grad. Morgen wird es ... Ich ziehe eine Jacke / einen Pullover an, weil ...", "A1_lesson_22")

# 48: Lost item notice (A1_lesson_23)
add("Fundsache melden",
"Sie haben Ihren Rucksack im Bus verloren. Schreiben Sie eine Nachricht an das Fundbuero. Beschreiben Sie: Wo und wann haben Sie ihn verloren? Wie sieht der Rucksack aus? Was ist drin? Ihre Kontaktdaten.",
"Schreiben Sie 5-6 Saetze.", 80,
"Schreiben Sie: Sehr geehrte Damen und Herren, ... Ich habe am ... im Bus ... meinen Rucksack verloren. ... Er ist ... und hat ... Farbe. ... Inhalt: ... Bitte rufen Sie mich an unter ... Mit freundlichen Gruessen, ...", "A1_lesson_23")

# 49: Thank-you message (A1_lesson_24)
add("Dankeschoen sagen",
"Ihr Freund Thomas hat Ihnen bei einem Umzug geholfen. Schreiben Sie ihm eine kurze Nachricht. Bedanken Sie sich. Sagen Sie, dass die Hilfe sehr nett war. Vielleicht einladen zum Kaffee als Dank.",
"Schreiben Sie 3-4 Saetze. Benutzen Sie du.", 50,
"Schreiben Sie: Hallo Thomas, ... Vielen Dank fuer deine Hilfe beim Umzug! ... Ohne dich haette ich das nicht geschafft. ... Hast du am Wochenende Zeit fuer einen Kaffee?", "A1_lesson_24")

# 50: Apology message (A1_lesson_25)
add("Entschuldigungsnachricht",
"Sie hatten gestern einen Termin bei der Ärztin, aber Sie sind nicht gekommen. Schreiben Sie eine Entschuldigung. Sagen Sie: Entschuldigung fuer das Nichtkommen. Der Grund. Ob Sie einen neuen Termin moechten.",
"Schreiben Sie 3-4 Saetze. Entschuldigen Sie sich hoeflich.", 60,
"Schreiben Sie: Guten Tag, ... Ich moechte mich entschuldigen, dass ich gestern nicht zum Termin gekommen bin. ... Ich war leider krank. ... Kann ich einen neuen Termin bekommen? ... Vielen Dank.", "A1_lesson_25")

# Save
data['A1'] = a1
json.dump(data, open('src/data/writing.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print("Added %d writing prompts. Total A1: %d" % (25, len(a1)))
print("Range: A1_write_26 to A1_write_50")

# ---- VALIDATION ----
ids = set(); dupes = []
prompts_lower = set(); dup_prompts = []
broken_lessons = []; missing_rubric = []; missing_fields = []
required = ['id', 'title', 'prompt', 'instructions', 'wordLimit', 'tips', 'rubric', 'rubricKeys', 'lessonId']

all_lesson_ids = set(x['id'] for x in json.load(open('src/data/germanLessons.json',encoding='utf-8')) if x.get('level')=='A1')
rubric_keys = ['taskCompletion', 'grammarAccuracy', 'vocabularyUse', 'wordOrder', 'spellingCapitalization', 'appropriateRegister']

for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
    p_lower = v.get('prompt','').strip().lower()[:80]
    if p_lower in prompts_lower: dup_prompts.append(v['id'])
    prompts_lower.add(p_lower)
    for f in required:
        if f not in v or v[f] is None:
            missing_fields.append("%s missing %s" % (v['id'], f))
    lid = v.get('lessonId')
    if lid and lid not in all_lesson_ids:
        broken_lessons.append("%s: lessonId=%s not found" % (v['id'], lid))
    r = v.get('rubric')
    if not r:
        missing_rubric.append("%s no rubric dict" % v['id'])
    else:
        for rk in rubric_keys:
            if rk not in r:
                missing_rubric.append("%s rubric missing '%s'" % (v['id'], rk))
    rk_list = v.get('rubricKeys')
    if not rk_list or not isinstance(rk_list, list):
        missing_fields.append("%s missing rubricKeys list" % v['id'])

print()
print("=== VALIDATION RESULTS ===")
print("Duplicate IDs: %d" % len(dupes))
if dupes: print("  ", dupes)
print("Duplicate/similar prompts: %d" % len(dup_prompts))
if dup_prompts: print("  ", dup_prompts)
print("Broken lessonIds: %d" % len(broken_lessons))
for m in broken_lessons: print("  " + m)
print("Prompts missing rubric: %d" % len(missing_rubric))
for m in missing_rubric: print("  " + m)
print("Missing required fields: %d" % len(missing_fields))
for m in missing_fields: print("  " + m)

total = len(dupes)+len(dup_prompts)+len(broken_lessons)+len(missing_rubric)+len(missing_fields)
print()
print("Total issues: %d" % total)
if total == 0:
    print("ALL GOOD!")
else:
    print("Issues found!")
