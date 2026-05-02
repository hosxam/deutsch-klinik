import json

d = json.load(open('../src/data/fspCases.json','r',encoding='utf-8'))
print(f'Current count: {len(d)}')

# Fix any broken entries
fixes = 0
for i, item in enumerate(d):
    for field in ['usefulPhrases','doctorTasks','mustAsk','redFlags','tags']:
        if not isinstance(item.get(field), list):
            val = item.get(field)
            print(f'Fixing entry {i} {item["id"]}: {field} is {type(val).__name__} = {val}')
            if isinstance(val, str):
                d[i][field] = [val]
            else:
                d[i][field] = ['Angabe erforderlich.']
            fixes += 1
if fixes:
    print(f'Fixed {fixes} issues')
else:
    print('All entries valid')

# Now add cases to reach 100
start = len(d)
new_cases = [
    {
        "title": "Armvenenthrombose nach Belastung",
        "setting": "emergency",
        "patientRole": {
            "age": "32", "gender": "maennlich",
            "chiefComplaint": "Geschwollener linker Arm nach Krafttraining",
            "history": "2 Tage nach Krafttraining Schwellung und Schweregefuehl im linken Arm. Keine Schmerzen. Leicht blaeuliche Verfarbung.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Student, trainiert 5x/Woche"
        },
        "doctorTasks": [
            "Fragen Sie nach der Schwellung und dem Training",
            "Pruefen Sie Durchblutung und Puls",
            "Erklaeren Sie die Armvenenthrombose",
            "Besprechen Sie die Therapie"
        ],
        "mustAsk": [
            "Haben Sie einen Zugang im Arm gehabt?",
            "Haben Sie Atemnot?"
        ],
        "redFlags": [
            "Belastungsinduzierte Armvenenthrombose (Paget-von-Schroetter)",
            "Lungenembolie ausschliessen"
        ],
        "usefulPhrases": [
            "Durch die starke Belastung kann ein Blutgerinnsel in der Armvene entstehen.",
            "Wir machen eine Ultraschalluntersuchung."
        ],
        "doctorToDoctorSummary": "Patient mit Armvenenthrombose bei Belastung. Therapie: Antikoagulation, ggf. Lyse.",
        "scoringRubric": {
            "historyTaking": "Training, Schwellung, Risikofaktoren",
            "redFlags": "Lungenembolie",
            "patientLanguage": "Armvenenthrombose erklaeren",
            "structure": "Belastung -> Thrombose -> Diagnostik",
            "medicalLogic": "Paget-von-Schroetter-Syndrom",
            "germanAccuracy": "Armvenenthrombose, Antikoagulation"
        },
        "tags": ["thrombose", "arm", "sport", "venen"]
    },
    {
        "title": "Chronische Pankreatitis",
        "setting": "clinic",
        "patientRole": {
            "age": "55", "gender": "maennlich",
            "chiefComplaint": "Wiederkehrende Oberbauchschmerzen, Durchfall, Gewichtsverlust",
            "history": "Seit Monaten Oberbauchschmerzen, faettiger Durchfall, 10 kg Gewichtsverlust. Trinkt taeglich Alkohol.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Handwerker, trinkt taeglich 3-4 Bier"
        },
        "doctorTasks": [
            "Fragen Sie nach Schmerzcharakter",
            "Fragen Sie nach Alkoholkonsum",
            "Erklaeren Sie die chronische Pankreatitis",
            "Besprechen Sie Alkoholkarenz und Therapie"
        ],
        "mustAsk": [
            "Wie viel Alkohol trinken Sie?",
            "Haben Sie faettigen Durchfall?"
        ],
        "redFlags": [
            "Chronische Pankreatitis bei Alkoholabusus",
            "Pankreasinsuffizienz mit Malabsorption"
        ],
        "usefulPhrases": [
            "Die Bauchspeicheldruese ist durch Alkohol chronisch entzuendet.",
            "Alkoholverzicht ist der wichtigste Schritt."
        ],
        "doctorToDoctorSummary": "Patient mit chronischer Pankreatitis bei Alkohol. Pankreasenzyme, Alkoholkarenz.",
        "scoringRubric": {
            "historyTaking": "Alkohol, Schmerz, Stuhl",
            "redFlags": "Pankreaskarzinom",
            "patientLanguage": "Pankreasinsuffizienz erklaeren",
            "structure": "Alkohol -> Pankreas -> Malabsorption",
            "medicalLogic": "Chronische Pankreatitis, Enzymersatz",
            "germanAccuracy": "Pankreatitis, Malabsorption"
        },
        "tags": ["bauchschmerz", "pankreatitis", "alkohol", "gewichtsverlust"]
    },
    {
        "title": "Delir bei aelterem Patienten",
        "setting": "ward",
        "patientRole": {
            "age": "82", "gender": "maennlich",
            "chiefComplaint": "Ploetzlich verwirrt, unruhig, Halluzinationen",
            "history": "Patient nach Hueft-TEP-OP seit gestern Abend ploetzlich verwirrt, schlaegt um sich. Hin und wieder Wachheitsluecken.",
            "medications": "Trifft pausiert", "allergies": "Keine",
            "pastHistory": "Z. n. Hueft-TEP, Hypertonie",
            "familyHistory": "Keine", "socialHistory": "Rentner"
        },
        "doctorTasks": [
            "Fragen Sie nach dem zeitlichen Beginn",
            "Pruefen Sie auf organische Ursachen",
            "Erklaeren Sie das Delir",
            "Besprechen Sie Massnahmen"
        ],
        "mustAsk": [
            "Wann hat die Verwirrtheit begonnen?",
            "Hatte er schon frueher Verwirrtheit?"
        ],
        "redFlags": [
            "Postoperatives Delir bei aelterem Patienten",
            "Multifaktorielle Ursache"
        ],
        "usefulPhrases": [
            "Die Verwirrtheit kommt haeufig nach einer Operation im Alter vor.",
            "Wir suchen nach Ursachen und behandeln ohne Zwang."
        ],
        "doctorToDoctorSummary": "Patient mit postoperativem Delir. Screening. Orientierung, Fluessigkeit, ggf. Neuroleptika.",
        "scoringRubric": {
            "historyTaking": "Beginn, Ursachen, Medikamente",
            "redFlags": "Infektion, metabolische Entgleisung",
            "patientLanguage": "Delir erklaeren",
            "structure": "Verwirrtheit -> Ursachensuche -> Therapie",
            "medicalLogic": "Delir-Management, CAM",
            "germanAccuracy": "Delir, Verwirrtheit, CAM"
        },
        "tags": ["delir", "postoperativ", "alter", "verwirrtheit"]
    },
    {
        "title": "Demenzielles Syndrom",
        "setting": "clinic",
        "patientRole": {
            "age": "78", "gender": "maennlich",
            "chiefComplaint": "Vergesslichkeit seit Monaten, desorientiert",
            "history": "Seit Monaten Vergesslichkeit, verliert Gegenstaende, verirrt sich in der Wohnung. Frau berichtet von Wesensveraenderung.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Hypertonie",
            "familyHistory": "Demenz bei Mutter", "socialHistory": "Rentner, lebt mit Ehefrau"
        },
        "doctorTasks": [
            "Fragen Sie nach Beginn und Verlauf",
            "Fragen Sie nach Einschraenkungen im Alltag",
            "Pruefen Sie den kognitiven Status",
            "Erklaeren Sie die Demenz",
            "Besprechen Sie die Diagnostik"
        ],
        "mustAsk": [
            "Haben Sie schon frueher eine Gedaechtnispruefung gehabt?",
            "Fahren Sie noch Auto?"
        ],
        "redFlags": [
            "Progressives demenzielles Syndrom",
            "Sturzbeginn = vaskulaer, schleichend = neurodegenerativ"
        ],
        "usefulPhrases": [
            "Ihr Mann leidet an einer Gedaechtnisstoerung.",
            "Wir machen eine genaue Untersuchung, um die Ursache zu finden."
        ],
        "doctorToDoctorSummary": "Patient mit kognitiver Beeintraechtigung. V. a. Demenz vom Alzheimer-Typ.",
        "scoringRubric": {
            "historyTaking": "Beginn, Alltag, Wesensveraenderung",
            "redFlags": "Delir, metabolisch",
            "patientLanguage": "Demenz erklaeren",
            "structure": "Vergesslichkeit -> Alltag -> Diagnostik",
            "medicalLogic": "Demenz-Diagnostik, MMST",
            "germanAccuracy": "Demenz, Alzheimer, MMST"
        },
        "tags": ["neurologie", "demenz", "vergesslichkeit", "alter"]
    },
    {
        "title": "Multiple Sklerose Verdacht",
        "setting": "clinic",
        "patientRole": {
            "age": "32", "gender": "weiblich",
            "chiefComplaint": "Sehstoerung auf einem Auge, Kribbeln im Bein",
            "history": "Vor 2 Wochen Sehstoerung am linken Auge. Jetzt Kribbeln und Taubheit im rechten Bein. Vor einem Jahr schon Kribbeln gehabt.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Bueroangestellte"
        },
        "doctorTasks": [
            "Fragen Sie nach Symptomen und zeitlichem Ablauf",
            "Fragen Sie nach frueheren Episoden",
            "Erklaeren Sie den MS-Verdacht",
            "Besprechen Sie die MRT-Diagnostik"
        ],
        "mustAsk": [
            "Hatten Sie schon frueher solche Symptome?",
            "Hatten Sie Sehstoerungen?"
        ],
        "redFlags": [
            "Schubweises neurologisches Defizit zeitlich und raeumlich getrennt = MS-Verdacht"
        ],
        "usefulPhrases": [
            "Die Symptome deuten auf eine Entzuendung des Nervensystems hin.",
            "Ein MRT kann Klarheit bringen."
        ],
        "doctorToDoctorSummary": "Patientin mit V. a. Multiple Sklerose. MRT Schaedel + Spinalkanal.",
        "scoringRubric": {
            "historyTaking": "Symptome, zeitlicher Verlauf, Vorereignisse",
            "redFlags": "Optikusneuritis, Querschnittsmyelitis",
            "patientLanguage": "MS erklaeren",
            "structure": "Symptome -> Schub -> Diagnostik",
            "medicalLogic": "MS-Diagnosekriterien",
            "germanAccuracy": "Multiple Sklerose, Optikusneuritis, MRT"
        },
        "tags": ["neurologie", "MS", "sehstoerung", "kribbeln"]
    },
    {
        "title": "Borreliose nach Zeckenstich",
        "setting": "clinic",
        "patientRole": {
            "age": "48", "gender": "maennlich",
            "chiefComplaint": "Roter Ring um Zeckenstich, Gelenkschmerzen",
            "history": "Vor 3 Wochen Zeckenstich, jetzt roter Ring um die Stichstelle. Gelenkschmerzen in den Kniegelenken. Muedigkeit.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Gaertner"
        },
        "doctorTasks": [
            "Fragen Sie nach dem Zeckenstich",
            "Fragen Sie nach der Wanderroete",
            "Erklaeren Sie die Borreliose",
            "Besprechen Sie die Antibiose"
        ],
        "mustAsk": [
            "Hatten Sie einen Zeckenstich?",
            "Haben Sie den roten Ring bemerkt?"
        ],
        "redFlags": [
            "Wanderroete als klassisches Erythema migrans",
            "Gelenkbeteiligung moeglich (Lyme-Arthritis)"
        ],
        "usefulPhrases": [
            "Der rote Ring ist ein typisches Zeichen fuer Borreliose.",
            "Eine Antibiotikatherapie ist notwendig."
        ],
        "doctorToDoctorSummary": "Patient mit Erythema migrans und Lyme-Arthritis. Antibiose mit Doxycyclin.",
        "scoringRubric": {
            "historyTaking": "Zecke, Wanderroete, Gelenke",
            "redFlags": "Neuroborreliose",
            "patientLanguage": "Borreliose erklaeren",
            "structure": "Zeckenstich -> Haut -> Gelenke -> Antibiose",
            "medicalLogic": "Lyme-Borreliose-Stadien",
            "germanAccuracy": "Borreliose, Erythema migrans, Doxycyclin"
        },
        "tags": ["infekt", "borreliose", "zecke", "gelenk"]
    },
    {
        "title": "Brustkrebsverdacht bei Knoten",
        "setting": "clinic",
        "patientRole": {
            "age": "52", "gender": "weiblich",
            "chiefComplaint": "Tastbarer Knoten in der rechten Brust",
            "history": "Selbst einen Knoten in der rechten Brust ertastet. Nicht schmerzhaft. Keine Hautveraenderung.",
            "medications": "Hormonersatztherapie", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Brustkrebs bei Schwester und Mutter",
            "socialHistory": "Friseurin"
        },
        "doctorTasks": [
            "Fragen Sie nach dem Knoten",
            "Fragen Sie nach Risikofaktoren",
            "Erklaeren Sie die Dringlichkeit",
            "Besprechen Sie Mammographie und Biopsie"
        ],
        "mustAsk": [
            "Haben Sie den Knoten zufaellig entdeckt?",
            "Gibt es Brustkrebs in der Familie?"
        ],
        "redFlags": [
            "Tastbarer Knoten + positive Familienanamnese + Alter ueber 50",
            "Dringende Vorstellung"
        ],
        "usefulPhrases": [
            "Jeder Knoten in der Brust muss abgeklaert werden.",
            "Wir ueberweisen Sie zur Mammographie."
        ],
        "doctorToDoctorSummary": "Patientin mit suspektem Mammatumor. Mammographie und Biopsie.",
        "scoringRubric": {
            "historyTaking": "Knoten, Risikofaktoren, Familienanamnese",
            "redFlags": "Entzuendlicher Brustkrebs",
            "patientLanguage": "Mammakarzinom-Verdacht erklaeren",
            "structure": "Knoten -> Risiko -> Mammographie",
            "medicalLogic": "Mammakarzinom-Diagnostik",
            "germanAccuracy": "Mammakarzinom, Mammographie, Biopsie"
        },
        "tags": ["onkologie", "brust", "mammographie", "tumor"]
    },
    {
        "title": "Lungenembolie nach Flugreise",
        "setting": "emergency",
        "patientRole": {
            "age": "58", "gender": "weiblich",
            "chiefComplaint": "Ploetzliche Atemnot nach Langstreckenflug",
            "history": "2 Tage nach 10-Stunden-Flug ploetzlich Atemnot, Brustschmerzen beim Atmen. Leichte Haemoptyse.",
            "medications": "Keine", "allergies": "Keine",
            "pastHistory": "Krampfadern, Uebergewicht",
            "familyHistory": "Keine", "socialHistory": "Bueroangestellte"
        },
        "doctorTasks": [
            "Fragen Sie nach Atemnot und Schmerzen",
            "Fragen Sie nach dem Flug",
            "Erklaeren Sie die Lungenembolie",
            "Besprechen Sie die Therapie"
        ],
        "mustAsk": [
            "Hatten Sie Schwellungen im Bein?",
            "Hat das Bein weh getan?"
        ],
        "redFlags": [
            "Wells-Score: Flugreise + Dyspnoe + Haemoptyse = hohe Wahrscheinlichkeit"
        ],
        "usefulPhrases": [
            "Nach einem langen Flug kann sich ein Gerinnsel bilden und in die Lunge wandern.",
            "Wir machen ein CT zur Sicherheit."
        ],
        "doctorToDoctorSummary": "Patientin mit Lungenembolie nach Flug. Antikoagulation.",
        "scoringRubric": {
            "historyTaking": "Flug, Dyspnoe, Beinschwellung",
            "redFlags": "Rechtsherzbelastung, Schock",
            "patientLanguage": "Lungenembolie erklaeren",
            "structure": "Flug -> Gerinnsel -> Lunge -> Therapie",
            "medicalLogic": "Lungenembolie-Diagnostik, Wells-Score",
            "germanAccuracy": "Lungenembolie, Wells-Score, CT"
        },
        "tags": ["lungenembolie", "flug", "dyspnoe", "thrombose"]
    },
    {
        "title": "Kniegelenksinfektion nach Arthroskopie",
        "setting": "emergency",
        "patientRole": {
            "age": "65", "gender": "maennlich",
            "chiefComplaint": "Geschwollenes, rotes, heisses Knie mit Fieber",
            "history": "Seit 2 Tagen schmerzhaft geschwollenes Knie. Fieber bis 39 Grad. Z. n. Kniegelenksspiegelung vor 2 Wochen.",
            "medications": "Keine", "allergies": "Keine",
            "pastHistory": "Z. n. Arthroskopie Knie",
            "familyHistory": "Keine", "socialHistory": "Rentner"
        },
        "doctorTasks": [
            "Fragen Sie nach Gelenk und Eingriff",
            "Pruefen Sie die Gelenkfunktion",
            "Erklaeren Sie den Infektionsverdacht",
            "Besprechen Sie die noetige Punktion"
        ],
        "mustAsk": [
            "Hatten Sie eine Operation am Knie?",
            "Hatten Sie Fieber?"
        ],
        "redFlags": [
            "Postoperative Kniegelenksinfektion",
            "Dringend Punktion und Antibiose"
        ],
        "usefulPhrases": [
            "Nach Ihrer Knie-OP hat sich das Gelenk entzuendet.",
            "Wir muessen das Knie punktieren."
        ],
        "doctorToDoctorSummary": "Patient mit postoperativem Kniegelenksinfekt. Punktion, Antibiose.",
        "scoringRubric": {
            "historyTaking": "OP, Gelenk, Fieber",
            "redFlags": "Sepsis",
            "patientLanguage": "Gelenkinfekt erklaeren",
            "structure": "OP -> Gelenk -> Punktion -> Therapie",
            "medicalLogic": "Septische Arthritis",
            "germanAccuracy": "Gelenkinfekt, Punktion, Arthroskopie"
        },
        "tags": ["gelenk", "infekt", "postoperativ", "knie"]
    },
    {
        "title": "Ulcus cruris bei venoeser Insuffizienz",
        "setting": "clinic",
        "patientRole": {
            "age": "72", "gender": "weiblich",
            "chiefComplaint": "Offenes Bein seit 3 Monaten",
            "history": "Seit 3 Monaten offene Stelle am Unterschenkel. Naechtliche Wadenschmerzen, schwere Beine.",
            "medications": "Keine", "allergies": "Keine",
            "pastHistory": "Venoese Insuffizienz, Hypertonie",
            "familyHistory": "Keine", "socialHistory": "Rentnerin"
        },
        "doctorTasks": [
            "Fragen Sie nach der Wunde",
            "Pruefen Sie die Durchblutung",
            "Erklaeren Sie die venoese Insuffizienz",
            "Besprechen Sie Wundversorgung und Kompression"
        ],
        "mustAsk": [
            "Haben Sie Krampfadern?",
            "Haben Sie Zucker oder Durchblutungsstoerungen?"
        ],
        "redFlags": [
            "Ulcus cruris venosum bei chronisch venoeser Insuffizienz"
        ],
        "usefulPhrases": [
            "Das offene Bein kommt von schwachen Venen.",
            "Wichtig sind Kompressionsstruempfe und Bewegung."
        ],
        "doctorToDoctorSummary": "Patientin mit venoesem Ulcus cruris. Wundversorgung, Kompressionstherapie.",
        "scoringRubric": {
            "historyTaking": "Wunde, Venen, Durchblutung",
            "redFlags": "Arterielle Verschlusskrankheit",
            "patientLanguage": "Veneninsuffizienz erklaeren",
            "structure": "Wunde -> Venen -> Kompression",
            "medicalLogic": "Ulcus cruris, CVI-Stadien",
            "germanAccuracy": "Ulcus cruris, CVI, Kompression"
        },
        "tags": ["haut", "ulcus", "chronisch", "venen"]
    },
    {
        "title": "Wundrose (Erysipel)",
        "setting": "clinic",
        "patientRole": {
            "age": "60", "gender": "weiblich",
            "chiefComplaint": "Roter, glaenzender Hautbezirk am Unterschenkel mit Fieber",
            "history": "Seit 2 Tagen roter, schmerzhafter Hautbezirk am rechten Unterschenkel. Fieber 38.8. Schuettelfrost.",
            "medications": "Keine", "allergies": "Keine",
            "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Rentnerin"
        },
        "doctorTasks": [
            "Fragen Sie nach dem Hautbefund",
            "Fragen Sie nach Fieber",
            "Erklaeren Sie das Erysipel",
            "Besprechen Sie die Antibiose"
        ],
        "mustAsk": [
            "Haben Sie eine Eintrittspforte (Pilz, kleine Wunde)?",
            "Hatten Sie das schon einmal?"
        ],
        "redFlags": [
            "Erysipel mit typischem Hautbefund und systemischen Zeichen"
        ],
        "usefulPhrases": [
            "Sie haben eine bakterielle Hautinfektion.",
            "Sie brauchen ein Antibiotikum."
        ],
        "doctorToDoctorSummary": "Patientin mit Erysipel am Unterschenkel. Antibiose, Ruhigstellung.",
        "scoringRubric": {
            "historyTaking": "Haut, Fieber, Eintrittspforte",
            "redFlags": "Abszedierung, Sepsis",
            "patientLanguage": "Erysipel erklaeren",
            "structure": "Haut -> Infekt -> Antibiose",
            "medicalLogic": "Erysipel, Antibiose",
            "germanAccuracy": "Erysipel, Wundrose, Antibiose"
        },
        "tags": ["haut", "erysipel", "infekt", "fieber"]
    },
    {
        "title": "Kopfschmerz vom Spannungstyp",
        "setting": "clinic",
        "patientRole": {
            "age": "41", "gender": "weiblich",
            "chiefComplaint": "Taegliche Kopfschmerzen, Gefuehl wie ein enger Ring um den Kopf",
            "history": "Fast taeglich dumpfe Kopfschmerzen beidseits. Keine Uebelkeit. Bueroarbeit am Bildschirm.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Bueroangestellte"
        },
        "doctorTasks": [
            "Fragen Sie nach dem Kopfschmerzcharakter",
            "Differenzieren Sie zu Migraene",
            "Besprechen Sie nicht-medikamentoese Therapie"
        ],
        "mustAsk": [
            "Haben Sie einseitige Schmerzen?",
            "Haben Sie Uebelkeit oder Sehstoerungen?"
        ],
        "redFlags": [
            "Spannungskopfschmerz ohne Migraene-Zeichen"
        ],
        "usefulPhrases": [
            "Ihre Kopfschmerzen sind haeufig, aber gutartig.",
            "Bildschirmpausen und Nackenentspannung koennen helfen."
        ],
        "doctorToDoctorSummary": "Patientin mit Spannungskopfschmerz. Entspannungstechniken.",
        "scoringRubric": {
            "historyTaking": "Kopfschmerzqualitaet, Frequenz",
            "redFlags": "Ploetzlicher Donnerschlag-Kopfschmerz",
            "patientLanguage": "Spannungskopfschmerz erklaeren",
            "structure": "Schmerz -> Charakter -> Therapie",
            "medicalLogic": "Primaere vs sekundaere Kopfschmerzen",
            "germanAccuracy": "Spannungskopfschmerz, Migraene"
        },
        "tags": ["kopfschmerz", "spannung", "chronisch", "buero"]
    },
    {
        "title": "Gichtanfall (Podagra)",
        "setting": "clinic",
        "patientRole": {
            "age": "56", "gender": "maennlich",
            "chiefComplaint": "Akute schmerzhafte Schwellung des Grosszehengelenks",
            "history": "Ploetzlich starke Schmerzen im linken Grosszehengrundgelenk. Gelenk rot, geschwollen. Hat am Vortag viel Fleisch gegessen und Bier getrunken.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Gicht beim Vater", "socialHistory": "Handwerker"
        },
        "doctorTasks": [
            "Fragen Sie nach Schmerzbeginn",
            "Fragen Sie nach Ernaehrung",
            "Erklaeren Sie die Gicht",
            "Besprechen Sie die Therapie"
        ],
        "mustAsk": [
            "Hatten Sie das schon einmal?",
            "Hatten Sie am Vortag viel Fleisch oder Alkohol?"
        ],
        "redFlags": [
            "Klassischer Gichtanfall mit Podagra",
            "Hyperurikaemie als Ursache"
        ],
        "usefulPhrases": [
            "Das ist ein Gichtanfall.",
            "Akut helfen Ibuprofen und Kuehlen."
        ],
        "doctorToDoctorSummary": "Patient mit akutem Gichtanfall. NSAR, Kuehlung. Allopurinol nach Abklingen.",
        "scoringRubric": {
            "historyTaking": "Gelenk, Ausloeser",
            "redFlags": "Septische Arthritis",
            "patientLanguage": "Gicht erklaeren",
            "structure": "Gelenk -> Harnsaeure -> Therapie",
            "medicalLogic": "Gicht-Management, Allopurinol",
            "germanAccuracy": "Gicht, Podagra, Harnsaeure"
        },
        "tags": ["gelenk", "gicht", "akut", "ernaehrung"]
    },
    {
        "title": "Bandscheibenvorfall LWS mit Fusheberparese",
        "setting": "clinic",
        "patientRole": {
            "age": "44", "gender": "maennlich",
            "chiefComplaint": "Rueckenschmerzen mit Ausstrahlung ins Bein, Fussschwaeche",
            "history": "Seit 3 Tagen Rueckenschmerzen, ausstrahlend in den linken Fuss. Zehen kann er nicht anheben. Nach Heben einer schweren Kiste.",
            "medications": "Ibuprofen", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Handwerker"
        },
        "doctorTasks": [
            "Fragen Sie nach dem Ausloeser",
            "Pruefen Sie Kraft, Sensibilitaet, Reflexe",
            "Besprechen Sie OP-Indikation"
        ],
        "mustAsk": [
            "Koennen Sie die Fusspitze anheben?",
            "Haben Sie Blasen- oder Darmstoerungen?",
            "Haben Sie Taubheit im Schritt?"
        ],
        "redFlags": [
            "L5-Syndrom mit Fusheberparese = dringende Vorstellung"
        ],
        "usefulPhrases": [
            "Der Bandscheibenvorfall drueckt auf einen Nerv.",
            "Wir machen ein MRT."
        ],
        "doctorToDoctorSummary": "Patient mit L5-Radikulopathie. Fusheberparese. MRT und Neurochirurgie.",
        "scoringRubric": {
            "historyTaking": "Ausloeser, Kraft, Sensibilitaet",
            "redFlags": "Cauda-equina",
            "patientLanguage": "Bandscheibenvorfall erklaeren",
            "structure": "Ruecken -> Nerv -> Parese -> MRT",
            "medicalLogic": "LWS-Bandscheibenvorfall",
            "germanAccuracy": "Bandscheibenvorfall, Radikulopathie"
        },
        "tags": ["rueckenschmerz", "bandscheibe", "parese", "neurochirurgie"]
    },
    {
        "title": "Magen-Darm-Infekt bei Schwangerer",
        "setting": "clinic",
        "patientRole": {
            "age": "29", "gender": "weiblich",
            "chiefComplaint": "Erbrechen und Durchfall in 26. SSW",
            "history": "Erbrechen 4x, Durchfall 5x/24h. Trinkt weniger. Hat Angst um das Baby.",
            "medications": "Eisen, Folsaeure", "allergies": "Keine",
            "pastHistory": "Schwangerschaft 26. SSW",
            "familyHistory": "Keine", "socialHistory": "Schwangere"
        },
        "doctorTasks": [
            "Fragen Sie nach Symptomen",
            "Bewerten Sie den Hydratationszustand",
            "Beruhigen Sie die Patientin",
            "Besprechen Sie orale Rehydrierung"
        ],
        "mustAsk": [
            "Haben Sie Fieber?",
            "Spueren Sie Kindsbewegungen?",
            "Haben Sie Schmerzen im Bauch?"
        ],
        "redFlags": [
            "Gastroenteritis in der Schwangerschaft",
            "Fruehzeitige Rehydrierung wegen SS-Risiko"
        ],
        "usefulPhrases": [
            "Magen-Darm-Infekte sind in der Schwangerschaft haeufig.",
            "Wichtig ist, dass Sie genug trinken."
        ],
        "doctorToDoctorSummary": "Schwangere mit Gastroenteritis. Orale Rehydrierung.",
        "scoringRubric": {
            "historyTaking": "Symptome, Fluessigkeit, Kindsbewegungen",
            "redFlags": "Fruehwehen, Exsikkose",
            "patientLanguage": "Infekt in SS erklaeren",
            "structure": "SSW -> Symptome -> Rehydrierung",
            "medicalLogic": "Gastroenteritis in Schwangerschaft",
            "germanAccuracy": "Gastroenteritis, Schwangerschaft"
        },
        "tags": ["schwangerschaft", "durchfall", "erbrechen", "fruehgeburt"]
    },
    {
        "title": "Hautpilz (Tinea pedis)",
        "setting": "clinic",
        "patientRole": {
            "age": "35", "gender": "maennlich",
            "chiefComplaint": "Juckende schuppende Haut zwischen den Zehen",
            "history": "Seit Wochen Juckreiz und schuppende Haut zwischen den Zehen. Traegt taeglich Sicherheitsschuhe.",
            "medications": "Keine", "allergies": "Keine", "pastHistory": "Keine",
            "familyHistory": "Keine", "socialHistory": "Lagerarbeiter"
        },
        "doctorTasks": [
            "Fragen Sie nach Juckreiz und Dauer",
            "Erklaeren Sie die Tinea",
            "Besprechen Sie die Therapie"
        ],
        "mustAsk": [
            "Haben Sie Fusspilz schon einmal gehabt?",
            "Haben Sie Diabetes?"
        ],
        "redFlags": [
            "Tinea pedis interdigitalis"
        ],
        "usefulPhrases": [
            "Sie haben Fusspilz zwischen den Zehen.",
            "Eine Creme ueber 4 Wochen und trockene Fuesse."
        ],
        "doctorToDoctorSummary": "Patient mit Tinea pedis. Topisches Antimyzetikum.",
        "scoringRubric": {
            "historyTaking": "Juckreiz, Risiko, Dauer",
            "redFlags": "DM, Immunsuppression",
            "patientLanguage": "Fusspilz erklaeren",
            "structure": "Haut -> Pilz -> Creme",
            "medicalLogic": "Tinea, Antimyzetika",
            "germanAccuracy": "Tinea pedis, Fusspilz"
        },
        "tags": ["haut", "pilz", "fuss", "tinea"]
    },
    {
        "title": "Portkatheter-Infektion bei Chemotherapie",
        "setting": "ward",
        "patientRole": {
            "age": "62", "gender": "weiblich",
            "chiefComplaint": "Fieber und Roete um den Port",
            "history": "Mammakarzinom unter Chemotherapie. Seit gestern Fieber 38.9, Schuettelfrost. Haut rot