import json

data = json.load(open('src/data/exams.json', encoding='utf-8'))

# Current single A1 exam - will be replaced by 5 exams
# Keep structure: each exam has id, name, passScore, sections {Lesen, Hören, Schreiben, Sprechen}
# Lesen: timeLimit + tasks [{id, type:mcq|true-false, question, options?, answer}]
# Hören: timeLimit + tasks [{id, type, question, options?, answer}]
# Schreiben: timeLimit + tasks [{id, prompt, wordLimit}]
# Sprechen: prepTime + tasks [{id, prompt, talkTime}]

def make_exam(eid, name, lesen_tasks, horen_tasks, schreiben_tasks, sprechen_tasks):
    return {
        "id": eid,
        "name": name,
        "passScore": 60,
        "sections": {
            "Lesen": {"timeLimit": 25, "tasks": lesen_tasks},
            "Hören": {"timeLimit": 20, "tasks": horen_tasks},
            "Schreiben": {"timeLimit": 20, "tasks": schreiben_tasks},
            "Sprechen": {"prepTime": 30, "tasks": sprechen_tasks}
        }
    }

def tf(qid, question, answer):
    return {"id": qid, "type": "true-false", "question": question, "answer": answer}

def mcq(qid, question, options, answer):
    return {"id": qid, "type": "mcq", "question": question, "options": options, "answer": answer}

def write_task(wid, prompt, wl):
    return {"id": wid, "prompt": prompt, "wordLimit": wl}

def sprech_task(sid, prompt, talk):
    return {"id": sid, "prompt": prompt, "talkTime": talk}

# ------------------- EXAM 1: General Basics -------------------
exam1 = make_exam("A1_exam_01", "A1 Practice Exam 1 - Basics",
    # Lesen - 5 tasks
    lesen_tasks=[
        mcq("A1_ex_l1_1", "Lesen Sie die Anzeige: 'Praxis Dr. Müller - Mo-Fr 8-18 Uhr, Sa 9-12 Uhr. Sonntag geschlossen.' An welchem Tag hat die Praxis geschlossen?",
            ["Montag", "Samstag", "Sonntag", "Freitag"], "Sonntag"),
        tf("A1_ex_l1_2", "Schild im Bus: 'Einfache Fahrt 2,80 Euro. Kinder unter 6 Jahren fahren kostenlos.' Ein Kind unter 6 Jahren muss bezahlen.", "false"),
        mcq("A1_ex_l1_3", "Text: 'Hallo Anna, wie geht es dir? Ich bin jetzt in Berlin. Das Wetter ist schön. Viele Grüße, Maria.' Wer ist in Berlin?",
            ["Anna", "Maria", "Tom", "Lisa"], "Maria"),
        tf("A1_ex_l1_4", "Speisekarte: 'Apfelkuchen 3,50 Euro, Kaffee 2,50 Euro, Tee 2,00 Euro.' Der Apfelkuchen kostet 3,50 Euro.", "true"),
        mcq("A1_ex_l1_5", "Anzeige: 'Wohnung in München zu vermieten. 2 Zimmer, 55 qm, 850 Euro warm.' Wie groß ist die Wohnung?",
            ["35 qm", "45 qm", "55 qm", "65 qm"], "55 qm"),
    ],
    # Hören - 3 tasks
    horen_tasks=[
        mcq("A1_ex_h1_1", "Sprechstundenhilfe: 'Ihr Termin ist am Dienstag, dem 15. Mai, um 10:30 Uhr.' Wann ist der Termin?",
            ["Dienstag, 15. Mai, 10:30", "Donnerstag, 15. Mai, 10:30", "Dienstag, 5. Mai, 10:30", "Dienstag, 15. Mai, 14:30"],
            "Dienstag, 15. Mai, 10:30"),
        tf("A1_ex_h1_2", "Durchsage: 'Der Zug nach Hamburg fährt ab Gleis 4.' Der Zug nach Hamburg fährt ab Gleis 4.", "true"),
        mcq("A1_ex_h1_3", "Apotheker: 'Das Medikament kostet 7,50 Euro. Nehmen Sie dreimal täglich einen Messlöffel.' Wie oft nehmen Sie das Medikament?",
            ["Einmal täglich", "Zweimal täglich", "Dreimal täglich", "Viermal täglich"], "Dreimal täglich"),
    ],
    # Schreiben - 1 task
    schreiben_tasks=[
        write_task("A1_ex_w1_1", "Sie sind krank. Schreiben Sie eine kurze E-Mail an Ihren Chef. Sagen Sie: Sie sind krank, Sie können heute nicht kommen, Wann Sie vielleicht wieder kommen können.", 40),
    ],
    # Sprechen - 2 tasks
    sprechen_tasks=[
        sprech_task("A1_ex_s1_1", "Stellen Sie sich vor. Sagen Sie: Wie Sie heißen, Wie alt Sie sind, Wo Sie wohnen.", 60),
        sprech_task("A1_ex_s1_2", "Sprechen Sie über Ihre Familie. Sagen Sie: Wie viele Personen, Wer sind sie, Was machen sie.", 60),
    ]
)

# ------------------- EXAM 2: Daily Life -------------------
exam2 = make_exam("A1_exam_02", "A1 Practice Exam 2 - Daily Life",
    lesen_tasks=[
        mcq("A1_ex_l2_1", "Öffnungszeiten: 'Supermarkt Frisch: Mo-Sa 7-21 Uhr, So geschlossen. Apotheke: Mo-Fr 8:30-18:30, Sa 9-14 Uhr.' Bis wann hat der Supermarkt samstags geöffnet?",
            ["18:30", "19:00", "20:00", "21:00"], "21:00"),
        tf("A1_ex_l2_2", "E-Mail: 'Lieber Tom, ich lade dich zu meinem Geburtstag ein. Am Samstag um 18 Uhr bei mir zu Hause. Liebe Grüße, Sarah.' Die Party ist am Sonntag.", "false"),
        mcq("A1_ex_l2_3", "Hinweis: 'Bitte melden Sie sich an der Anmeldung. Nehmen Sie im Wartezimmer Platz.' Was sollen Patienten zuerst machen?",
            ["Im Wartezimmer Platz nehmen", "Sich an der Anmeldung melden", "Nach Hause gehen", "Den Arzt rufen"], "Sich an der Anmeldung melden"),
        tf("A1_ex_l2_4", "Fahrplan: 'Bus 142: Hauptbahnhof 9:00, Stadtmitte 9:10, Marktplatz 9:20.' Der Bus braucht 20 Minuten vom Hauptbahnhof zum Marktplatz.", "true"),
        mcq("A1_ex_l2_5", "Text: 'Lisa steht um 6:30 Uhr auf. Um 7:15 Uhr frühstückt sie. Um 8:00 Uhr geht sie zur Arbeit. Um 17:00 Uhr geht sie nach Hause.' Wann frühstückt Lisa?",
            ["Um 6:30", "Um 7:00", "Um 7:15", "Um 8:00"], "Um 7:15"),
    ],
    horen_tasks=[
        mcq("A1_ex_h2_1", "Durchsage: 'Achtung, der Regionalzug RE5 nach Leipzig hat 10 Minuten Verspätung. Abfahrt jetzt um 14:45 Uhr.' Wohin fährt der Zug?",
            ["Nach Hamburg", "Nach Berlin", "Nach Leipzig", "Nach München"], "Nach Leipzig"),
        tf("A1_ex_h2_2", "Arzt: 'Sie haben kein Fieber. Nehmen Sie dieses Medikament dreimal täglich.' Der Patient hat Fieber.", "false"),
        mcq("A1_ex_h2_3", "Verkäuferin: 'Die Jacke kostet 49,90 Euro. Die Umkleidekabine ist dort hinten.' Was möchte der Kunde anprobieren?",
            ["Einen Pullover", "Eine Jacke", "Schuhe", "Eine Hose"], "Eine Jacke"),
    ],
    schreiben_tasks=[
        write_task("A1_ex_w2_1", "Schreiben Sie eine kurze Einladung zu Ihrem Geburtstag. Sagen Sie: Wann die Party ist, Wo sie ist, Was es zu essen gibt.", 50),
    ],
    sprechen_tasks=[
        sprech_task("A1_ex_s2_1", "Erzählen Sie von Ihrem Tagesablauf. Sagen Sie: Wann Sie aufstehen, Was Sie morgens machen, Was Sie abends machen.", 90),
        sprech_task("A1_ex_s2_2", "Fragen Sie Ihren Partner: 'Was machst du am Wochenende?' und antworten Sie auf seine/ihre Frage.", 60),
    ]
)

# ------------------- EXAM 3: Shopping & Food -------------------
exam3 = make_exam("A1_exam_03", "A1 Practice Exam 3 - Shopping & Food",
    lesen_tasks=[
        mcq("A1_ex_l3_1", "Speisekarte: 'Fruhstucksteller 5,50 Euro, Marmeladenbrot 2,00 Euro, Ruhrei mit Brot 4,50 Euro, Kaffee 2,50 Euro.' Was kostet das Fruhstucksteller?",
            ["2,00 Euro", "4,50 Euro", "5,50 Euro", "2,50 Euro"], "5,50 Euro"),
        tf("A1_ex_l3_2", "Kassenbon: 'Milch 1,29 Euro, Brot 2,49 Euro, Butter 1,89 Euro. Summe: 5,67 Euro.' Der Kunde hat 5,67 Euro bezahlt.", "true"),
        mcq("A1_ex_l3_3", "Angebot: 'Wassermelone statt 3,49 Euro nur 1,99 Euro. Huhnchenbrust statt 5,99 Euro nur 4,49 Euro.' Was kostet die Wassermelone im Angebot?",
            ["3,49 Euro", "2,99 Euro", "1,99 Euro", "4,49 Euro"], "1,99 Euro"),
        tf("A1_ex_l3_4", "Schild: 'Zahlung: Bar oder Karte. Bitte bezahlen Sie an der Kasse.' Man kann nur bar bezahlen.", "false"),
        mcq("A1_ex_l3_5", "Text: 'Ich brauche: 1 Liter Milch, 2 Apfel, 500g Butter, 1 Brot, 6 Eier.' Wie viele Apfel kauft die Person?",
            ["1", "2", "3", "6"], "2"),
    ],
    horen_tasks=[
        mcq("A1_ex_h3_1", "Kellner: 'Guten Tag, was darf es sein?' Gast: 'Ich hatte gern einen Kaffee und ein Stuck Apfelkuchen.' Kellner: 'Das macht 6,00 Euro.' Was bestellt der Gast?",
            ["Tee und Kuchen", "Kaffee und Kuchen", "Kaffee und Brot", "Heiße Schokolade"], "Kaffee und Kuchen"),
        tf("A1_ex_h3_2", "Kunde: 'Ich suche eine warme Jacke in Große M.' Verkauferin: 'Hier ist eine schwarze Jacke fur 49,90 Euro.' Der Kunde sucht eine Jacke.", "true"),
        mcq("A1_ex_h3_3", "Durchsage: 'Der Zug nach Berlin fahrt in 5 Minuten ab Gleis 3.' In wie vielen Minuten fahrt der Zug?",
            ["3 Minuten", "5 Minuten", "10 Minuten", "15 Minuten"], "5 Minuten"),
    ],
    schreiben_tasks=[
        write_task("A1_ex_w3_1", "Schreiben Sie eine Einkaufsliste fur die Woche. Schreiben Sie 6-8 Dinge mit Mengen.", 30),
    ],
    sprechen_tasks=[
        sprech_task("A1_ex_s3_1", "Sie sind im Restaurant. Bestellen Sie etwas zu essen und zu trinken.", 60),
        sprech_task("A1_ex_s3_2", "Sprechen Sie uber Ihr Lieblingsessen. Sagen Sie: Was Sie gern essen, Was Sie nicht gern essen, Was Sie gut kochen konnen.", 60),
    ]
)

# ------------------- EXAM 4: Health & Appointments -------------------
exam4 = make_exam("A1_exam_04", "A1 Practice Exam 4 - Health & Appointments",
    lesen_tasks=[
        mcq("A1_ex_l4_1", "Text: 'Ihr Termin bei Dr. Weber ist am Mittwoch, den 15. Mai um 10:30 Uhr. Bitte bringen Sie Ihre Versicherungskarte mit.' Was sollen Sie mitbringen?",
            ["Einen Ausweis", "Die Versicherungskarte", "Ein Rezept", "Bargeld"], "Die Versicherungskarte"),
        tf("A1_ex_l4_2", "Aushang: 'Besuchszeiten: Montag bis Sonntag 14:00-19:00 Uhr. Maximal 2 Besucher pro Patient.' Es durfen 3 Besucher kommen.", "false"),
        mcq("A1_ex_l4_3", "Anmeldebogen: 'Patient: Klaus Weber. Beschwerden: Husten, Halsschmerzen, Fieber 38,2 Grad. Seit 3 Tagen.' Wie lange hat der Patient die Beschwerden?",
            ["Seit 1 Tag", "Seit 2 Tagen", "Seit 3 Tagen", "Seit einer Woche"], "Seit 3 Tagen"),
        tf("A1_ex_l4_4", "Sprechzeiten: 'Mo-Fr 8-17 Uhr, Sa 9-13 Uhr, So geschlossen.' Die Praxis hat sonntags geschlossen.", "true"),
        mcq("A1_ex_l4_5", "Hinweis: 'Notdienst: Taglich ab 18:30 bis 8:00 Uhr am nachsten Morgen.' Wann beginnt der Notdienst?",
            ["Um 8:00 Uhr", "Um 17:00 Uhr", "Um 18:30 Uhr", "Um 20:00 Uhr"], "Um 18:30 Uhr"),
    ],
    horen_tasks=[
        mcq("A1_ex_h4_1", "Sprechstundenhilfe: 'Guten Morgen, wie heißen Sie?' Patient: 'Ich heiße Peter Braun. Ich habe einen Termin um 10:00 Uhr.' Wie heißt der Patient?",
            ["Peter Braun", "Peter Schulz", "Klaus Weber", "Thomas Wagner"], "Peter Braun"),
        tf("A1_ex_h4_2", "Apotheker: 'Hier ist Ihr Medikament. Es kostet 7,50 Euro. Dreimal taglich einen Messloffel.' Das Medikament kostet 8,50 Euro.", "false"),
        mcq("A1_ex_h4_3", "Ansage: 'Frau Sonja Meier wird gebeten, in das Behandlungszimmer 2 zu kommen.' Wer wird gerufen?",
            ["Herr Braun", "Frau Meier", "Herr Muller", "Frau Schulz"], "Frau Meier"),
    ],
    schreiben_tasks=[
        write_task("A1_ex_w4_1", "Sie haben einen Termin beim Arzt und mussen absagen. Schreiben Sie eine kurze Nachricht. Sagen Sie: Wann der Termin war, Warum Sie nicht kommen konnen, Ob Sie einen neuen Termin mochten.", 50),
    ],
    sprechen_tasks=[
        sprech_task("A1_ex_s4_1", "Sie sind beim Arzt. Sagen Sie: Was Ihnen fehlt, Seit wann Sie die Symptome haben, Was der Arzt machen soll.", 60),
        sprech_task("A1_ex_s4_2", "Sie sind in der Apotheke. Fragen Sie: Nach einem Medikament gegen Husten, Nach dem Preis, Wie oft Sie es nehmen sollen.", 60),
    ]
)

# ------------------- EXAM 5: Directions & Travel -------------------
exam5 = make_exam("A1_exam_05", "A1 Practice Exam 5 - Directions & Travel",
    lesen_tasks=[
        mcq("A1_ex_l5_1", "Wegbeschreibung: 'Gehen Sie geradeaus bis zur Kreuzung. Biegen Sie links in die Bahnhofstraße. Die Bibliothek ist auf der rechten Seite.' In welche Straße biegen Sie?",
            ["Hauptstraße", "Schulstraße", "Bahnhofstraße", "Marktstraße"], "Bahnhofstraße"),
        tf("A1_ex_l5_2", "Hotelinfo: 'Fruhstuck 7-10 Uhr im Restaurant (1. Stock). Check-in ab 14 Uhr. Check-out bis 11 Uhr.' Das Fruhstuck ist im Erdgeschoss.", "false"),
        mcq("A1_ex_l5_3", "Post: 'Standardbrief (bis 20g): 0,85 Euro. Paket (bis 2 kg): 5,99 Euro.' Was kostet ein Standardbrief?",
            ["0,75 Euro", "0,85 Euro", "1,00 Euro", "5,99 Euro"], "0,85 Euro"),
        tf("A1_ex_l5_4", "Schild: 'Fundburo: Raum 103, Erdgeschoss. Geöffnet 7-22 Uhr.' Das Fundburo ist im 1. Stock.", "false"),
        mcq("A1_ex_l5_5", "Text: 'Hotel Stadt Berlin. WLAN kostenlos. Rezeption 24 Stunden besetzt. Telefon: 030 987654.' Was kostet WLAN?",
            ["5 Euro pro Tag", "10 Euro pro Tag", "Kostenlos", "2 Euro pro Stunde"], "Kostenlos"),
    ],
    horen_tasks=[
        mcq("A1_ex_h5_1", "Rezeption: 'Guten Abend, willkommen im Hotel Central. Ihr Zimmer ist Nummer 305 im dritten Stock. Fruhstuck von 7 bis 10 Uhr.' In welchem Stock ist das Zimmer?",
            ["Im 1. Stock", "Im 2. Stock", "Im 3. Stock", "Im 4. Stock"], "Im 3. Stock"),
        tf("A1_ex_h5_2", "Tourist: 'Entschuldigung, wo ist die Stadtbibliothek?' Passant: 'Gehen Sie geradeaus, dann rechts in die Goethestraße. Die Bibliothek ist gegenuber vom Museum.' Die Bibliothek ist neben dem Museum.", "false"),
        mcq("A1_ex_h5_3", "Notruf: 'Notrufzentrale, was ist passiert?' Anrufer: 'Ein Unfall auf der Hauptstraße 50.' Notruf: 'Der Krankenwagen kommt sofort.' Welche Nummer hat der Anrufer gewahlt?",
            ["110", "112", "115", "116117"], "112"),
    ],
    schreiben_tasks=[
        write_task("A1_ex_w5_1", "Sie wollen ein Hotelzimmer reservieren. Schreiben Sie eine kurze E-Mail. Fragen Sie nach: Einem Einzelzimmer fur 3 Nachte, Dem Preis, Ob Fruhstuck inklusive ist.", 60),
    ],
    sprechen_tasks=[
        sprech_task("A1_ex_s5_1", "Fragen Sie nach dem Weg zur Bibliothek. Ihr Partner gibt Ihnen die Antwort. Wechseln Sie dann die Rollen.", 60),
        sprech_task("A1_ex_s5_2", "Erzahlen Sie von Ihrem letzten Urlaub oder Wochenende. Sagen Sie: Wo Sie waren, Mit wem, Was Sie gemacht haben.", 90),
    ]
)

# Store as list of exam dicts under A1
data['exams']['A1'] = [exam1, exam2, exam3, exam4, exam5]

json.dump(data, open('src/data/exams.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print("A1 exams: replaced 1 dict with 5 exam dicts")

# Validate
exams_list = data['exams']['A1']
print("  Count:", len(exams_list))

ids = set(); dupes = []
all_answers_ok = True
all_sections_ok = True
all_rubrics_ok = True

for ex in exams_list:
    eid = ex['id']
    if eid in ids: dupes.append(eid)
    ids.add(eid)
    
    sections = ex.get('sections', {})
    for sk in ['Lesen', 'Hören', 'Schreiben', 'Sprechen']:
        if sk not in sections:
            print("  MISSING section in %s: %s" % (eid, sk))
            all_sections_ok = False
            continue
        tasks = sections[sk].get('tasks', [])
        for t in tasks:
            tid = t['id']
            if tid in ids: dupes.append(tid)
            ids.add(tid)
            
            if sk in ['Lesen', 'Hören']:
                if 'answer' not in t or t['answer'] is None:
                    print("  MISSING answer: %s" % tid)
                    all_answers_ok = False

print("  Duplicate IDs:", len(dupes))
if dupes: print("   ", dupes[:10])
print("  All sections present:", all_sections_ok)
print("  All questions have answers:", all_answers_ok)

total_issues = len(dupes) + (0 if all_sections_ok else 1) + (0 if all_answers_ok else 1)
print()
print("Total issues:", total_issues)
if total_issues == 0:
    print("ALL GOOD!")
else:
    print("Issues found!")
