import json

existing = json.load(open('../src/data/fspCases.json','r',encoding='utf-8'))
n = [len(existing)]
items = list(existing)

def make(title, setting, age, gender, complaint, hist, meds, allergies, pastHx,
         famHx, socialHx, tasks, must_ask, reds, phrases, d2d, rubric, tags):
    n[0] += 1
    items.append({
        "id": f"fsp_c_{n[0]:03d}",
        "title": title, "setting": setting,
        "patientRole": {
            "age": age, "gender": gender, "chiefComplaint": complaint,
            "history": hist, "medications": meds, "allergies": allergies,
            "pastHistory": pastHx, "familyHistory": famHx, "socialHistory": socialHx
        },
        "doctorTasks": tasks, "mustAsk": must_ask, "redFlags": reds,
        "usefulPhrases": phrases, "doctorToDoctorSummary": d2d,
        "scoringRubric": rubric, "tags": tags
    })

# Append: more abdominal pain, headache, back pain to reach 20

make(
    "Oberbauchschmerzen mit Sodbrennen", "clinic",
    "38", "weiblich", "Brennende Oberbauchschmerzen nach dem Essen",
    "Seit Wochen brennende Schmerzen im Oberbauch, saures Aufstoßen, besonders nach fettigem Essen und im Liegen. Kein Gewichtsverlust. Kein Erbrechen.",
    "Keine regelmasigen Medikamente, gelegentlich Antazida aus der Apotheke",
    "Keine",
    "Keine",
    "Magenprobleme bei der Mutter bekannt",
    "Krankenschwester, Nichtraucherin, selten Alkohol",
    ["Fragen Sie nach dem Schmerzcharakter und Auslosern", "Erfragen Sie die Dauer und den Verlauf", "Stellen Sie Fragen zu Alarmzeichen", "Erklaren Sie den Verdacht auf Refluxkrankheit", "Besprechen Sie Therapieoptionen (Lebensstil + Medikamente)"],
    ["Haben Sie Blut erbrochen oder schwarzen Stuhl bemerkt?", "Haben Sie ungewollt abgenommen?", "Nehmen Sie regelmasig Schmerzmittel?"],
    ["Dauerhafte Symptome uber Wochen", "Keine Alarmzeichen bisher", "Typische Refluxsymptomatik"],
    ["Das klingt nach Reflux, also dass Magensaft in die Speiserohre zuruckfließt.", "Wir konnen zunachst einen Therapieversuch mit einem Saureblocker machen."],
    "38-jahrige Patientin mit epigastrischen brennenden Schmerzen und saurem Aufstoßen. Keine Alarmzeichen. V. a. gastroosophageale Refluxkrankheit. Geplanter Therapieversuch mit PPI und Lebensstilberatung.",
    {"historyTaking": "Refluxsymptome und Alarmzeichen erfragen", "redFlags": "Dysphagie, Gewichtsverlust, Haematmensis erkennen", "patientLanguage": "Refluxmechanismus vereinfacht darstellen", "structure": "Symptome -> Ausloser -> Therapie", "medicalLogic": "GERD-Diagnostik und PPI-Therapie", "germanAccuracy": "Reflux, Epigastrium, PPI korrekt"},
    ["bauchschmerz", "reflux", "GERD", "oberbauch"]
)

make(
    "Akuter Durchfall und Erbrechen", "emergency",
    "31", "mannlich", "Wassriger Durchfall und Erbrechen seit 2 Tagen",
    "Seit 2 Tagen wassriger Durchfall ca. 8x/Tag, Erbrechen. Kein Fieber. Krampfartige Bauchschmerzen. Freundin hat ahnliche Symptome. Keine relevante Auslandsreise.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Koch, Nichtraucher",
    ["Fragen Sie nach Stuhlfrequenz und Konsistenz", "Fragen Sie nach Infektionsquelle", "Bewerten Sie den Hydratationszustand", "Erklaren Sie die Therapie (Flussigkeit, Schonkost)", "Besprechen Sie Warnzeichen furWiedervorstellung"],
    ["Hatten Sie Blut im Stuhl oder Erbrochenem?", "Hatten Sie Fieber?", "Haben Sie ausreichend getrunken?"],
    ["Haufiger wassriger Stuhl mit Exsikkose-Risiko", "Kein Fieber, keine Blutbeimengungen als gute Prognosezeichen"],
    ["Das ist vermutlich ein Magen-Darm-Infekt.", "Am wichtigsten ist, dass Sie genug trinken."],
    "31-jahriger Patient mit akuter Gastroenteritis, wassriger Durchfall und Erbrechen. Kein Fieber, keine Blutbeimengung. V. a. viralen Infekt. Therapie: orale Rehydrierung, Schonkost. Bei Zeichen der Austrocknung Wiedervorstellung empfehlen.",
    {"historyTaking": "Infektquelle, Stuhlcharakter, Begleitsymptome", "redFlags": "Blutiger Durchfall, hohes Fieber, Exsikkosezeichen", "patientLanguage": "Klare Trinkempfehlung geben", "structure": "Symptome -> Infektquelle -> Therapie", "medicalLogic": "Gastroenteritis-Therapie und Exsikkose", "germanAccuracy": "Gastroenteritis, Rehydrierung, Exsikkose korrekt"},
    ["bauchschmerz", "durchfall", "gastroenteritis", "infektion"]
)

make(
    "Spannungskopfschmerz", "clinic",
    "41", "weiblich", "Dumpfe, druckende Kopfschmerzen fast taglich",
    "Seit Monaten fast taglich druckende Kopfschmerzen beidseits, eher nachmittags, verstarkt bei Stress. Keine Aura, keine Ubelkeit. Nimmt gelegentlich Ibuprofen.",
    "Keine regelmasig, Ibuprofen 400 mg bei Bedarf (ca. 2-3x/Woche)",
    "Keine",
    "Keine",
    "Migrane bei der Mutter",
    "Lehrerin, verheiratet, zwei Kinder, beruflicher Stress",
    ["Fragen Sie nach Kopfschmerzfrequenz, -dauer und -charakter", "Differenzieren Sie Migrane von Spannungskopfschmerz", "Fragen Sie nach Medikamentenubergebrauch", "Erklaren Sie die Diagnose", "Besprechen Sie nicht-medikamentose Optionen"],
    ["Haben Sie Schmerzmittel gegen die Kopfschmerzen genommen und wie oft?", "Hatten Sie Ubelkeit oder Lichtempfindlichkeit dabei?", "Haben Sie schon einen Neurologen gesehen?"],
    ["Täglicher oder fast taglicher Schmerz", "Medikamentenubergebrauch moglich (>10 Tage/Monat)", "Keine Begleitsymptome wie Ubelkeit oder Aura"],
    ["Die Beschwerden klingen nach Spannungskopfschmerzen.", "Zu haufige Schmerzmitteleinnahme kann selbst Kopfschmerzen verursachen.", "Es gibt wirksame nicht-medikamentose Behandlungen wie Entspannungsverfahren."],
    "41-jahrige Patientin mit dumpfen, druckenden Kopfschmerzen fast taglich, kein Migrane-Charakter. Haufige Ibuprofen-Einnahme. V. a. chronischer Spannungskopfschmerz mit moglichem Medikamentenubergebrauch. Beratung zu nicht-medikamentosen Verfahren und Reduktion der Bedarfsmedikation.",
    {"historyTaking": "Frequenz, Medikation, Ausschluss Migrane", "redFlags": "Medikamentenubergebrauch, plotzlicher Beginn, begleitende neurologische Symptome", "patientLanguage": "Prazise Erklarung, warum zu viele Schmerzmittel schaden", "structure": "Schmerz -> Medikation -> Differential -> Therapie", "medicalLogic": "Spannungskopfschmerz vs Migrane, Medikamentenubermaß", "germanAccuracy": "Spannungskopfschmerz, Medikamentenubergebrauch korrekt"},
    ["kopfschmerz", "spannungskopfschmerz", "chronisch", "medikation"]
)

make(
    "Migrane mit Aura", "clinic",
    "34", "weiblich", "Wiederkehrende starke Kopfschmerzen einseitig mit Sehstorung",
    "Seit Jahren immer wieder einseitige, pochende Kopfschmerzen, manchmal mit Flimmerskotomen (Lichtblitze). Ubelkeit und Lichtempfindlichkeit. Etwa 4 Anfalle pro Monat.",
    "Triptan bei Bedarf (wirkt gut, wenn fruhzeitig eingenommen), keine Prophylaxe",
    "Keine",
    "Keine",
    "Migrane bei der Mutter und Schwester",
    "Grafikdesignerin, geregelter Alltag, Schlafmangel als bekannter Trigger",
    ["Fragen Sie nach Anfallshaufigkeit und -dauer", "Erfragen Sie die Aura und Begleitsymptome", "Bewerten Sie die aktuelle Therapie und Prophylaxebedarf", "Erklaren Sie die Migranepathophysiologie vereinfacht", "Besprechen Sie Trigger-Management und Prophylaxeoptionen"],
    ["Haben Sie eine Aura (Sehstorungen, Kribbeln)?", "Wie stark sind die Schmerzen auf einer Skala von 1 bis 10?", "Nehmen Sie die Triptane fruhzeitig ein?"],
    ["Haufige Migraneattacken (uber 4/Monat) mit Prophylaxebedarf", "Aura als Risikofaktor fur Schlaganfall (v. a. bei Raucherinnen + Pilleneinnahme)"],
    ["Migrane ist eine neurologische Erkrankung, bei der das Gehirn uberempfindlich auf Reize reagiert.", "Es gibt vorbeugende Behandlungen, wenn die Anfalle zu haufig sind."],
    "34-jahrige Patientin mit bekannter Migrane mit Aura, 4 Anfalle/Monat. Gutes Ansprechen auf Triptane, aber noch keine Prophylaxe. Beratung zu Prophylaxeoptionen (Betablocker, Topiramat) und Trigermanagement empfohlen.",
    {"historyTaking": "Anfallshaufigkeit, Auracharakter, Schweregrad", "redFlags": "Neue Aura-Qualitat, plotzlicher Schlaganfall-ahnlicher Beginn", "patientLanguage": "Migrane als neurologische Erkrankung erklaren", "structure": "Episoden -> Aura -> Therapie -> Prophylaxe", "medicalLogic": "Migraneprophylaxe-Indikation und -Optionen", "germanAccuracy": "Aura, Flimmerskotome, Triptan, Prophylaxe korrekt"},
    ["kopfschmerz", "migrane", "aura", "prophylaxe"]
)

make(
    "Akuter Ruckenschmerz mit Ausstrahlung", "emergency",
    "52", "mannlich", "Akute starke Ruckenschmerzen mit Ausstrahlung ins rechte Bein",
    "Beim Bücken stechender Schmerz im unteren Rucken. Ausstrahlung uber das Gesass in den rechten Oberschenkel bis in den Fuß. Kribbeln im rechten Fuß. Keine Taubheit. Keine Inkontinenz.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Handwerker (Maurer), taglich korperlich schwer tatig",
    ["Fragen Sie nach dem genauen Schmerzbeginn und Ausloser", "Fragen Sie nach Sensibilitatsstorungen und Kraftminderung", "Fragen Sie nach Blasen- und Mastdarmfunktion (!! rote Flagge)", "Erklaren Sie den Verdacht auf Bandscheibenvorfall", "Besprechen Sie konservative Therapie und Warnsymptome"],
    ["Haben Sie ein Taubheitsgefuhl im Bein oder Fuß?", "Spuren Sie, wenn Sie auf die Toilette mussen?", "Haben Sie Probleme, den Fuß zu heben (Fußheberparese)?"],
    ["Cauda-equina-Syndrom: Inkontinenz, Reitparese, Sattelanaesthesie (Notfall)", "Progrediente Parese, schwere sensible Ausfalle"],
    ["Ein Bandscheibenvorfall kann auf einen Nerven drucken und die Schmerzen im Bein verursachen.", "In den meisten Fallen hilft schonen und Geduld."],
    "52-jahriger Patient mit akutem lumbalem Schmerz mit radikularer Ausstrahlung ins rechte Bein nach Belastung. Keine Cauda-equina-Symptome. V. a. lumbalen Bandscheibenvorfall. Konservative Therapie. MRT bei ausbleibender Besserung.",
    {"historyTaking": "Akuter Schmerz, Ausstrahlung, Kribbeln, Cauda-equina-Fragen", "redFlags": "Cauda-equina (Sattelanaesthesie, Inkontinenz), progrediente Parese", "patientLanguage": "Anatomie von Wirbelsaule und Nerven einfach erklaren", "structure": "Ausloser -> Symptome -> rote Flaggen -> Therapie", "medicalLogic": "Radikulare Symptomatik und Bandscheibenvorfall", "germanAccuracy": "Radikular, Cauda-equina, Bandscheibenvorfall korrekt"},
    ["ruckenschmerz", "bandscheibenvorfall", "radikular", "akut"]
)

make(
    "Chronischer Ruckenschmerz (sogenannter unspezifischer)", "clinic",
    "47", "weiblich", "Seit Jahren immer wiederkehrende Ruckenschmerzen",
    "Seit Jahren immer wieder dumpfe Kreuzschmerzen, mal starker, mal schwacher. Keine Ausstrahlung in die Beine. Verschlimmert durch langes Sitzen, besser bei Bewegung. Viele Arztbesuche, bildgebende Verfahren unauffallig.",
    "Ibuprofen zeitweise, Physiotherapie in der Vergangenheit",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellte (Sitzendtatigkeit), 15 kg Ubergewicht, wenig Bewegung",
    ["Fragen Sie nach der Dauer und den Auslosern der Schmerzen", "Fragen Sie nach Ausstrahlung und sensiblen Ausfallen", "Erklaren Sie den Begriff 'unspezifischer Ruckenschmerz'", "Besprechen Sie aktive Therapie (Bewegung, Muskeltraining)", "Ermutigen Sie zu mehr Bewegung im Alltag"],
    ["Haben Sie Schmerzen in den Beinen oder Taubheitsgefuhl?", "Wurden die Schmerzen schon einmal bildgebend untersucht?", "Was haben Sie bisher dagegen unternommen?"],
    ["Keine radikulare Symptomatik", "Chronisch-rezidivierend ohne neurologische Ausfalle"],
    ["Ihre Wirbelsaule ist in Ordnung. Die Schmerzen kommen von verspannten Muskeln und mangelnder Bewegung.", "Das Beste, was Sie tun konnen, ist tagliche Bewegung und Ruckenubungen."],
    "47-jahrige Patientin mit chronischen, nicht-radikularen LWS-Schmerzen. Bildgebung unauffallig. V. a. unspezifischen chronischen Ruckenschmerz bei Bewegungsmangel und Ubergewicht. Therapie: Aktivierung, Physiotherapie, Gewichtsreduktion.",
    {"historyTaking": "Schmerzchronifizierung und biopsychosoziale Faktoren", "redFlags": "Neurologische Ausfalle, Cauda-equina, Tumoranamnese", "patientLanguage": "Positive Sprache ('Bewegung hilft') statt negative ('Ihnen fehlt nichts')", "structure": "Schmerz -> Diagnostik -> Erklarung -> Aktivierung", "medicalLogic": "Chronische unspezifische Ruckenschmerzen, biopsychosoziales Modell", "germanAccuracy": "Unspezifischer Ruckenschmerz, Chronifizierung korrekt"},
    ["ruckenschmerz", "chronisch", "unspezifisch", "aktivierung"]
)

# Save
with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total cases")
