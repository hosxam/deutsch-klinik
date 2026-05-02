import json

d = json.load(open('../src/data/fspCases.json','r',encoding='utf-8'))
print(f'Starting: {len(d)}')

# Fix any broken entries
for i, item in enumerate(d):
    for field in ['usefulPhrases','doctorTasks','mustAsk','redFlags','tags']:
        if not isinstance(item.get(field), list):
            val = item.get(field)
            if isinstance(val, str):
                d[i][field] = [val]
            else:
                d[i][field] = ['Angabe erforderlich.']
            print(f'  Fixed {item["id"]} {field}')

n = len(d)

def add(title, setting, age, gender, complaint, hist, meds, allergies, pastHx,
        famHx, socialHx, tasks, mustask, reds, phrases, d2d, rubric, tags):
    global n
    n += 1
    d.append({
        "id": f"fsp_c_{n:03d}",
        "title": title, "setting": setting,
        "patientRole": {"age": age, "gender": gender, "chiefComplaint": complaint,
            "history": hist, "medications": meds, "allergies": allergies,
            "pastHistory": pastHx, "familyHistory": famHx, "socialHistory": socialHx},
        "doctorTasks": tasks, "mustAsk": mustask, "redFlags": reds,
        "usefulPhrases": phrases, "doctorToDoctorSummary": d2d,
        "scoringRubric": rubric, "tags": tags
    })

add("Armvenenthrombose nach Belastung", "emergency", "32", "maennlich",
    "Geschwollener linker Arm nach Krafttraining",
    "2 Tage nach Krafttraining Schwellung des linken Arms. Keine Schmerzen. Blaue Verfaerbung.",
    "Keine", "Keine", "Keine", "Keine", "Student, trainiert 5x/Woche",
    ["Fragen Sie nach der Schwellung und Belastung", "Pruefen Sie Durchblutung", "Erklaeren Sie die Armvenenthrombose"],
    ["Haben Sie Atemnot?", "Hatten Sie einen Zugang im Arm?"],
    ["Paget-von-Schroetter-Syndrom", "Lungenembolie ausschliessen"],
    ["Durch die Belastung kann ein Gerinnsel in der Armvene entstehen.", "Wir machen einen Ultraschall."],
    "Armvenenthrombose bei Belastung. Antikoagulation eingeleitet.",
    {"historyTaking": "Training, Schwellung, Risiken", "redFlags": "Lungenembolie", "patientLanguage": "Thrombose erklaeren", "structure": "Belastung -> Thrombose -> Therapie", "medicalLogic": "Paget-von-Schroetter", "germanAccuracy": "Armvenenthrombose, Antikoagulation"},
    ["thrombose", "arm", "sport", "vene"])

add("Chronische Pankreatitis bei Alkohol", "clinic", "55", "maennlich",
    "Wiederkehrende Oberbauchschmerzen, Durchfall, Gewichtsverlust",
    "Seit Monaten Oberbauchschmerzen mit Ausstrahlung in den Ruecken, fettiger Durchfall, 10 kg Verlust. Taeglicher Alkoholkonsum.",
    "Keine", "Keine", "Keine", "Keine", "Handwerker, 3-4 Bier taeglich",
    ["Fragen Sie nach Schmerz und Alkohol", "Erklaeren Sie Pankreatitis", "Besprechen Sie Karenz"],
    ["Wie viel Alkohol?", "Haben Sie fettigen Stuhl?"],
    ["Alkoholische Pankreatitis", "Pankreasinsuffizienz"],
    ["Die Bauchspeicheldruese ist entzuendet.", "Alkoholverzicht ist entscheidend."],
    "Chronische Pankreatitis bei Alkohol. Pankreasenzyme.",
    {"historyTaking": "Alkohol, Schmerz, Stuhl", "redFlags": "Karzinom", "patientLanguage": "Pankreatitis erklaeren", "structure": "Alkohol -> Pankreas -> Therapie", "medicalLogic": "Chronische Pankreatitis", "germanAccuracy": "Pankreatitis, Pankreasinsuffizienz"},
    ["pankreatitis", "alkohol", "bauchschmerz", "gewichtsverlust"])

add("Delir nach Operation", "ward", "82", "maennlich",
    "Ploetzlich verwirrt und unruhig nach Hueft-OP",
    "Patient nach Hueft-TEP seit gestern verwirrt, schlaegt um sich. Wachheitsluecken.",
    "pausiert", "Keine", "Z.n. Hueft-TEP, Hypertonie", "Keine", "Rentner",
    ["Fragen Sie nach Beginn", "Pruefen Sie auf Ursachen", "Erklaeren Sie das Delir"],
    ["Wann begann es?", "Frueher schon Verwirrtheit?"],
    ["Postoperatives Delir", "Multifaktoriell"],
    ["Die Verwirrtheit kommt nach OP im Alter vor.", "Wir behandeln ohne Zwang."],
    "Postoperatives Delir. Ursachensuche, Orientierung.",
    {"historyTaking": "Beginn, Ursachen", "redFlags": "Infektion, Metabolisch", "patientLanguage": "Delir erklaeren", "structure": "Verwirrtheit -> Ursache -> Therapie", "medicalLogic": "Delir-Management", "germanAccuracy": "Delir, Verwirrtheit"},
    ["delir", "postoperativ", "alter", "verwirrtheit"])

add("Demenzielles Syndrom", "clinic", "78", "maennlich",
    "Vergesslichkeit, desorientiert",
    "Seit Monaten Vergesslichkeit, verliert Dinge, verirrt sich. Wesensveraenderung.",
    "Keine", "Keine", "Hypertonie", "Demenz bei Mutter", "Rentner mit Ehefrau",
    ["Fragen Sie nach Verlauf und Alltag", "Pruefen Sie Kognition", "Erklaeren Sie Demenz"],
    ["Fahren Sie noch Auto?", "Hatten Sie frueher eine Gedaechtnispruefung?"],
    ["Progressiv kognitiver Abbau", "Alzheimer-Verdacht"],
    ["Ihr Mann hat eine Gedaechtnisstoerung.", "Wir untersuchen die Ursache."],
    "Kognitive Beeintraechtigung. V.a. Demenz. Diagnostik: MMST, CCT.",
    {"historyTaking": "Beginn, Alltag", "redFlags": "Delir", "patientLanguage": "Demenz erklaeren", "structure": "Gedaechtnis -> Alltag -> Diagnostik", "medicalLogic": "Demenz-Diagnostik", "germanAccuracy": "Demenz, Alzheimer, MMST"},
    ["demenz", "vergesslichkeit", "alter", "neurologie"])

add("Multiple Sklerose Verdacht", "clinic", "32", "weiblich",
    "Sehstoerung, Kribbeln im Bein",
    "Vor 2 Wochen Sehstoerung am linken Auge. Jetzt Kribbeln im rechten Bein. Vor 1 Jahr aehnliche Episode.",
    "Keine", "Keine", "Keine", "Keine", "Angestellte",
    ["Fragen Sie nach Symptomen und Verlauf", "Erklaeren Sie MS-Verdacht", "Besprechen Sie MRT"],
    ["Frueher solche Symptome?", "Sehstoerungen gehabt?"],
    ["Schubweises Defizit = MS-Verdacht"],
    ["Das kann eine Entzuendung im Nervensystem sein.", "MRT gibt Klarheit."],
    "V.a. Multiple Sklerose. MRT Schaedel + Spinalkanal.",
    {"historyTaking": "Symptome, zeitlich", "redFlags": "Optikusneuritis", "patientLanguage": "MS erklaeren", "structure": "Symptome -> Schub -> MRT", "medicalLogic": "MS-Diagnosekriterien", "germanAccuracy": "MS, Optikusneuritis"},
    ["MS", "sehstoerung", "kribbeln", "neurologie"])

add("Borreliose nach Zeckenstich", "clinic", "48", "maennlich",
    "Roter Ring und Gelenkschmerzen",
    "Vor 3 Wochen Zeckenstich. Jetzt Wanderroete und Kniegelenkschmerzen.",
    "Keine", "Keine", "Keine", "Keine", "Gaertner",
    ["Fragen Sie nach Zecke und Haut", "Erklaeren Sie Borreliose", "Verschreiben Sie Antibiose"],
    ["Zeckenstich gehabt?", "Roten Ring bemerkt?"],
    ["Erythema migrans", "Lyme-Arthritis moeglich"],
    ["Der rote Ring ist typisch fuer Borreliose.", "Sie brauchen Antibiotika."],
    "Erythema migrans mit Lyme-Arthritis. Doxycyclin.",
    {"historyTaking": "Zecke, Haut, Gelenke", "redFlags": "Neuroborreliose", "patientLanguage": "Borreliose erklaeren", "structure": "Zecke -> Haut -> Gelenk -> Antibiose", "medicalLogic": "Lyme-Borreliose", "germanAccuracy": "Borreliose, Erythema migrans"},
    ["borreliose", "zecke", "infekt", "gelenk"])

add("Brustkrebsverdacht bei Knoten", "clinic", "52", "weiblich",
    "Tastbarer Knoten in der Brust",
    "Knoten in der rechten Brust selbst ertastet. Nicht schmerzhaft.",
    "Hormonersatztherapie", "Keine", "Keine", "Brustkrebs bei Mutter", "Friseurin",
    ["Fragen Sie nach Knoten und Risiken", "Erklaeren Sie Dringlichkeit", "Besprechen Sie Mammographie"],
    ["Zufaellig entdeckt?", "Brustkrebs in Familie?"],
    ["Knoten + Familienanamnese + Alter > 50", "Dringend abklaeren"],
    ["Jeder Knoten muss abgeklaert werden.", "Wir ueberweisen zur Mammographie."],
    "V.a. Mammakarzinom. Mammographie und Biopsie.",
    {"historyTaking": "Knoten, Risiken", "redFlags": "Entzuendlicher Brustkrebs", "patientLanguage": "Tumorverdacht erklaeren", "structure": "Knoten -> Risiko -> Mammographie", "medicalLogic": "Mammakarzinom-Diagnostik", "germanAccuracy": "Mammakarzinom, Mammographie"},
    ["onkologie", "brust", "tumor", "mammographie"])

add("Lungenembolie nach Flug", "emergency", "58", "weiblich",
    "Ploetzliche Atemnot nach Langstreckenflug",
    "2 Tage nach 10h-Flug Atemnot, Brustschmerzen, Haemoptyse.",
    "Keine", "Keine", "Krampfadern, Uebergewicht", "Keine", "Angestellte",
    ["Fragen Sie nach Flug und Atemnot", "Erklaeren Sie LE", "Leiten Sie Therapie ein"],
    ["Beinschwellung gehabt?", "Schmerzen im Bein?"],
    ["Wells-Score erhoeht: Flug + Dyspnoe + Haemoptyse"],
    ["Ein Gerinnsel aus dem Bein ist in die Lunge gewandert.", "Wir machen ein CT."],
    "Lungenembolie nach Flug. Antikoagulation.",
    {"historyTaking": "Flug, Dyspnoe, Bein", "redFlags": "Rechtsherzbelastung", "patientLanguage": "LE erklaeren", "structure": "Flug -> Gerinnsel -> Lunge", "medicalLogic": "LE-Diagnostik, Wells-Score", "germanAccuracy": "Lungenembolie, Wells-Score"},
    ["lungenembolie", "flug", "dyspnoe", "thrombose"])

add("Kniegelenksinfektion postoperativ", "emergency", "65", "maennlich",
    "Geschwollenes Knie mit Fieber",
    "Seit 2 Tagen geschwollenes, rotes Knie, Fieber 39C. Z.n. Arthroskopie.",
    "Keine", "Keine", "Z.n. Arthroskopie Knie", "Keine", "Rentner",
    ["Fragen Sie nach OP und Knie", "Erklaeren Sie Infekt", "Planen Sie Punktion"],
    ["OP am Knie gehabt?", "Fieber gemessen?"],
    ["Postoperative Kniegelenksinfektion", "Dringend Punktion"],
    ["Das Knie hat sich nach der OP entzuendet.", "Wir muessen punktieren."],
    "Postoperativer Knieinfekt. Punktion, Antibiose.",
    {"historyTaking": "OP, Knie, Fieber", "redFlags": "Sepsis", "patientLanguage": "Gelenkinfekt erklaeren", "structure": "OP -> Gelenk -> Punktion", "medicalLogic": "Septische Arthritis", "germanAccuracy": "Gelenkinfekt, Punktion"},
    ["gelenk", "infekt", "postoperativ", "knie"])

add("Ulcus cruris venosum", "clinic", "72", "weiblich",
    "Offenes Bein seit 3 Monaten",
    "Offene Stelle am Unterschenkel. Naechtliche Wadenschmerzen, schwere Beine.",
    "Keine", "Keine", "CVI, Hypertonie", "Keine", "Rentnerin",
    ["Fragen Sie nach Wunde und Venen", "Pruefen Sie Durchblutung", "Besprechen Sie Kompression"],
    ["Krampfadern?", "Zucker oder pAVK?"],
    ["Venoeses Ulcus cruris bei CVI"],
    ["Das offene Bein kommt von schwachen Venen.", "Kompressionsstruempfe helfen."],
    "Venoeses Ulcus cruris. Wundversorgung, Kompression.",
    {"historyTaking": "Wunde, Venen, Durchblutung", "redFlags": "pAVK", "patientLanguage": "CVI erklaeren", "structure": "Wunde -> Venen -> Kompression", "medicalLogic": "Ulcus cruris, CVI", "germanAccuracy": "Ulcus cruris, CVI"},
    ["haut", "ulcus", "chronisch", "vene"])

add("Erysipel (Wundrose)", "clinic", "60", "weiblich",
    "Rote, glaenzende Haut am Bein mit Fieber",
    "Seit 2 Tagen roter, schmerzhafter Bezirk am Unterschenkel. Fieber 38.8.",
    "Keine", "Keine", "Keine", "Keine", "Rentnerin",
    ["Fragen Sie nach Haut und Fieber", "Erklaeren Sie Erysipel", "Verordnen Sie Antibiose"],
    ["Eintrittspforte (Pilz, Wunde)?", "Schon einmal gehabt?"],
    ["Erysipel mit systemischen Zeichen"],
    ["Sie haben eine bakterielle Hautinfektion.", "Antibiotikum ist noetig."],
    "Erysipel. Antibiose, Ruhigstellung.",
    {"historyTaking": "Haut, Fieber, Eintritt", "redFlags": "Sepsis, Abszess", "patientLanguage": "Erysipel erklaeren", "structure": "Haut -> Infekt -> Antibiose", "medicalLogic": "Erysipel", "germanAccuracy": "Erysipel, Wundrose"},
    ["haut", "erysipel", "infekt", "fieber"])

add("Spannungskopfschmerz", "clinic", "41", "weiblich",
    "Taegliche Kopfschmerzen wie ein Ring um den Kopf",
    "Fast taeglich dumpfe, drueckende Kopfschmerzen. Buero am Bildschirm.",
    "Keine", "Keine", "Keine", "Keine", "Angestellte",
    ["Differenzieren Sie zu Migraene", "Erklaeren Sie Spannungstyp", "Besprechen Sie nicht-medis"],
    ["Einseitige Schmerzen?", "Uebelkeit oder Sehstoerungen?"],
    ["Spannungskopfschmerz ohne Aura"],
    ["Die Schmerzen sind haeufig aber gutartig.", "Bildschirmpausen helfen."],
    "Spannungskopfschmerz. Entspannungstechniken.",
    {"historyTaking": "Schmerz, Frequenz", "redFlags": "Donnerschlag", "patientLanguage": "Kopfschmerz erklren", "structure": "Schmerz -> Charakter -> Therapie", "medicalLogic": "Primaere Kopfschmerzen", "germanAccuracy": "Spannungskopfschmerz"},
    ["kopfschmerz", "spannung", "chronisch", "buero"])

add("Gichtanfall (Podagra)", "clinic", "56", "maennlich",
    "Akute Grosszehenschwellung",
    "Ploetzlich schmerzhaftes Grosszehengrundgelenk. Rot, geschwollen. Vortag: Fleisch und Bier.",
    "Keine", "Keine", "Keine", "Gicht bei Vater", "Handwerker",
    ["Fragen Sie nach Gelenk und Ernaehrung", "Erklaeren Sie Gicht"],
    ["Schon einmal gehabt?", "Vortag Fleisch oder Alkohol?"],
    ["Klassischer Gichtanfall", "Podagra"],
    ["Das ist ein Gichtanfall.", "Ibuprofen und Kuehlen."],
    "Akuter Gichtanfall. NSAR, Allopurinol spaeter.",
    {"historyTaking": "Gelenk, Ausloeser", "redFlags": "Septische Arthritis", "patientLanguage": "Gicht erklaeren", "structure": "Gelenk -> Harnsaeure -> Therapie", "medicalLogic": "Gicht", "germanAccuracy": "Gicht, Podagra"},
    ["gicht", "gelenk", "akut", "fuss"])

add("Bandscheibenvorfall L5 mit Parese", "clinic", "44", "maennlich",
    "Rueckenschmerz, Fussschwaeche",
    "Nach Heben einer Kiste Rueckenschmerzen, Fussschwaeche links.",
    "Ibuprofen", "Keine", "Keine", "Keine", "Handwerker",
    ["Pruefen Sie Kraft und Sensibilitaet", "Fragen Sie nach Cauda-equina"],
    ["Fussspitze anheben?", "Blasen-Darmstoerungen?", "Taubheit im Schritt?"],
    ["L5-Syndrom mit Fusheberparese"],
    ["Der Nerv wird gedrueckt.", "MRT und OP-Indikation pruefen."],
    "L5-Radikulopathie. Fusheberparese. MRT, Neurochirurgie.",
    {"historyTaking": "Ausloeser, Kraft", "redFlags": "Cauda-equina", "patientLanguage": "Bandscheibe erklaeren", "structure": "Ruecken -> Nerv -> Parese", "medicalLogic": "LWS-Bandscheibenvorfall", "germanAccuracy": "Bandscheibenvorfall, Radikulopathie"},
    ["bandscheibe", "parese", "ruecken", "neurochirurgie"])

add("Gastroenteritis in Schwangerschaft", "clinic", "29", "weiblich",
    "Durchfall und Erbrechen 26. SSW",
    "Erbrechen und Durchfall. Sorge um Baby.",
    "Eisen, Folsaeure", "Keine", "Schwangerschaft", "Keine", "Schwangere",
    ["Bewerten Sie Hydratation", "Beruhigen Sie", "Besprechen Sie Rehydrierung"],
    ["Fieber?", "Kindsbewegungen?", "Bauchschmerz?"],
    ["GI-Infekt in SS", "Exsikkose-Risiko"],
    ["Magen-Darm-Infekte in SS sind haeufig.", "Viel trinken ist wichtig."],
    "Gastroenteritis in SS. Orale Rehydrierung.",
    {"historyTaking": "Symptome, Fluessigkeit", "redFlags": "Fruehwehen", "patientLanguage": "Infekt in SS", "structure": "SSW -> Symptome -> Rehydrierung", "medicalLogic": "GI-Infekt Schwangerschaft", "germanAccuracy": "Gastroenteritis, SS"},
    ["schwangerschaft", "durchfall", "erbrechen", "infekt"])

add("Tinea pedis (Fusspilz)", "clinic", "35", "maennlich",
    "Juckende Haut zwischen den Zehen",
    "Juckreiz, schuppende Haut zwischen 4./5. Zehe. Sicherheitsschuhe.",
    "Keine", "Keine", "Keine", "Keine", "Lagerarbeiter",
    ["Fragen Sie nach Juckreiz", "Erklaeren Sie Tinea", "Verschreiben Sie Creme"],
    ["Schon Fusspilz gehabt?", "Diabetes?"],
    ["Tinea pedis interdigitalis"],
    ["Sie haben Fusspilz.", "Creme 4 Wochen, Fuesse trocken halten."],
    "Tinea pedis. Topisches Antimyzetikum.",
    {"historyTaking": "Juckreiz, Risiko", "redFlags": "DM", "patientLanguage": "Fusspilz erklaeren", "structure": "Haut -> Pilz -> Creme", "medicalLogic": "Tinea", "germanAccuracy": "Tinea pedis"},
    ["haut", "pilz", "fuss", "tinea"])

add("Portkatheter-Infektion", "ward", "62", "weiblich",
    "Fieber und Roete um den Port",
    "Chemo bei Mammakarzinom. Fieber 38.9, Port roetlich.",
    "Chemotherapie", "Keine", "Mammakarzinom", "Brustkrebs", "Rentnerin",
    ["Pruefen Sie Port", "Erklaeren Sie Infektion", "Planen Sie Blutkulturen"],
    ["Schuettelfrost?", "Port roetlich und warm?"],
    ["Portkatheter-Infektion bei Immunsuppression", "Sepsis-Risiko"],
    ["Der Port ist infiziert.", "Blutkulturen und Portentfernung."],
    "Portkatheter-Infektion. Antibiose, Port entfernen.",
    {"historyTaking": "Fieber, Port", "redFlags": "Sepsis", "patientLanguage": "Portinfekt", "structure": "Port -> Fieber -> Therapie", "medicalLogic": "Katheterinfektion", "germanAccuracy": "Port, Sepsis"},
    ["onkologie", "port", "fieber", "infektion"])

add("Epikondylitis (Tennisarm)", "clinic", "45", "weiblich",
    "Schmerz an der Ellenbogenaussenseite",
    "Schmerzen am Ellenbogen beim Greifen. Mausarbeit.",
    "Ibuprofen gelegentlich", "Keine", "Keine", "Keine", "Sekretaerin",
    ["Pruefen Sie Druckschmerz", "Erklaeren Sie Ueberlastung", "Besprechen Sie Therapie"],
    ["Schmerzen beim Tassenheben?", "Handgelenkstrecken?"],
    ["Laterale Epikondylitis"],
    ["Eine Sehnenreizung durch Ueberlastung.", "Physiotherapie hilft."],
    "Epikondylitis. Konservative Therapie.",
    {"historyTaking": "Schmerz, Beruf", "redFlags": "Arthritis", "patientLanguage": "Tennisarm", "structure": "Schmerz -> Sehne -> Therapie", "medicalLogic": "Epikondylitis", "germanAccuracy": "Epikondylitis"},
    ["ellenbogen", "ueberlastung", "arm", "gelenk"])

print(f"Total now: {len(d)}")

# Validate all JSON
json.dumps(d, ensure_ascii=False)
print("JSON valid")

json.dump(d, open('../src/data/fspCases.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print("Written")
