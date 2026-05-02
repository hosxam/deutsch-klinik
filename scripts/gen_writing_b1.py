import json

items = []
n = 0

def add(caseTitle, task, patientData, history, examFindings, diagnostics, assessment, treatment, dischargePlan, expectedStructure, usefulPhrases, modelAnswer):
    global n
    n += 1
    items.append({
        "id": f"fsp_w_{n:03d}",
        "caseTitle": caseTitle, "task": task,
        "patientData": patientData, "history": history,
        "examFindings": examFindings, "diagnostics": diagnostics,
        "assessment": assessment, "treatment": treatment,
        "dischargePlan": dischargePlan,
        "expectedStructure": expectedStructure,
        "usefulPhrases": usefulPhrases,
        "modelAnswer": modelAnswer
    })

add(
    "Akute Dyspnoe bei COPD",
    "Verfassen Sie einen Arztbrief fuer einen 68-jaehrigen Patienten mit akuter Dyspnoe bei bekannter COPD.",
    "68 Jahre, mannlich, 78 kg, BMI 27, Nichtraucher seit 5 Jahren (45 pack years)",
    "COPD GOLD III, 3 Exazerbationen im letzten Jahr. Seit 2 Tagen zunehmende Dyspnoe, purulenter Auswurf, Fieber 38.5 Grad.",
    "AF 28/min, SaO2 88% (Raumluft), BS 38.6 Grad, RR 145/85. Auskultation: beidseits FEuchte RG, exspiratorisches Giemen.",
    "BGA: pH 7.32, pCO2 55, pO2 65, HCO3 27. CRP 120 mg/L. Leukozyten 14.5 G/L. Roentgen-Thorax: beidseits Infiltrate.",
    "AE-COP mit bakterieller Exazerbation. Respiratorische Partialinsuffizienz (Typ 1).",
    "Sauerstoff 2L/min ueber Nasenbrille, Prednisolon 40 mg i.v., Amoxicillin/Clavulansaeure 875/125 mg 3x/Tag, Salbutamol/Ipratropium per Vernebler.",
    "Fortfuehrung der inhalativen Therapie, Antibiotika fuer 7 Tage, Sauerstoff-Langzeittherapie pruefen. Wiedervorstellung beim Pneumologen in 2 Wochen.",
    ["Patientendaten (Alter, Geschlecht, Gewicht)", "Aktuelle Symptomatik und Vorgeschichte", "Klinischer Untersuchungsbefund", "Diagnostik (Labor, BGA, Bildgebung)", "Diagnose", "Therapie", "Medikamente bei Entlassung", "Empfehlungen und Wiedervorstellung"],
    ["bei bekannter COPD", "mit purulentem Auswurf", "respiratorische Partialinsuffizienz", "AE-COP = akute Exazerbation der COPD", "Sauerstoff-Langzeittherapie"],
    "68-jaehriger Patient mit bekannter COPD GOLD III. Aufnahme wegen akuter Dyspnoe bei bakterieller Exazerbation mit respiratorischer Partialinsuffizienz. Klinisch: AF 28/min, SaO2 88%, Fieber. BGA: pH 7.32, pCO2 55 mmHg. CRP 120 mg/L. Thorax-Roentgen: beidseitige Infiltrate. Therapie: Sauerstoff 2L/min, Prednisolon 40 mg i.v., Amoxicillin/Clavulansaeure 875/125 mg, Bronchodilatation per Vernebler. Unter Therapie klinische Besserung. Bei Entlassung: Fortfuehrung der inhalativen Therapie, Antibiotika fuer 7 Tage, pneumologische Wiedervorstellung in 2 Wochen, Sauerstoff-Langzeittherapie pruefen."
)

add(
    "Akutes Koronarsyndrom",
    "Verfassen Sie einen Arztbrief fuer einen 55-jaehrigen Patienten mit akutem ST-Hebungsinfarkt.",
    "55 Jahre, mannlich, 82 kg, BMI 28",
    "Seit 2 Stunden retrosternaler Druck, ausstrahlend in den linken Arm, mit Dyspnoe und Uebelkeit. Nikotin 30 pack years, Hypertonie, Hyperlipidamie.",
    "RR 160/95, HF 110/min, BS 36.8 Grad. Herz: 2/6 Systolikum, Lunge o.B., keine Oedeme.",
    "EKG: ST-Hebungen in V2-V5. Troponin T: 4500 ng/L. CK: 890 U/L. Koronarangiographie: proximaler RIVA-Verschluss.",
    "Akuter Vorderwandinfarkt bei RIVA-Verschluss.",
    "Priaortaet PTCA + DES RIVA. ASS 250 mg i.v., Ticagrelor 180 mg, Heparin. Clopidogrel 75 mg fuer 1 Jahr.",
    "ASS 100 mg taeglich lebenslang, Ticagrelor 90 mg 2x/Tag fuer 12 Monate, Ramipril, Bisoprolol, Atorvastatin 40 mg. Kardiale Rehabilitation. Wiedervorstellung Kardiologie in 4 Wochen.",
    ["Aufnahmegrund und Symptomatik", "Kardiovaskulaere Risikofaktoren", "Klinischer Befund bei Aufnahme", "EKG und Labor", "Koronarangiographie-Befund", "Diagnose", "Akuttherapie", "Medikation bei Entlassung", "Weiteres Procedere"],
    ["retrosternaler Druck", "ST-Hebungsinfarkt", "RIVA-Verschluss", "PTCA = perkutane transluminale Koronarangioplastie", "DES = Drug Eluting Stent"],
    "55-jaehriger Patient mit akutem STEMI der Vorderwand bei RIVA-Verschluss. Kardiovaskulaere Risikofaktoren: Nikotin, Hypertonie, Hyperlipidamie. Akuttherapie: primaere PTCA mit DES-Implantation. Medikation: ASS, Ticagrelor, Ramipril, Bisoprolol, Atorvastatin. Kardiale Rehabilitation empfohlen."
)

add(
    "Statioenaere Aufnahme bei Pneumonie",
    "Schreiben Sie einen Arztbrief fuer eine 76-jaehrige Patientin mit ambulanter Pneumonie.",
    "76 Jahre, weiblich, 65 kg, BMI 23",
    "Seit 5 Tagen Husten, Fieber bis 39 Grad, purulenter Auswurf, Dyspnoe bei Belastung. Bekannte Herzinsuffizienz NYHA II.",
    "RR 140/80, HF 92/min, BS 38.7 Grad, AF 22/min, SaO2 91% (Raumluft). Auskultation: EG rechts basal.",
    "CRP 185 mg/L, Leukozyten 12.3 G/L, PCT 3.2 ng/mL. Thorax-Roentgen: Rechtsseitige Unterlappenpneumonie.",
    "Ambulant erworbene Pneumonie (CAP) rechts basal. CRB-65 Score 1.",
    "Ceuroxim 1.5 g 3x/Tag i.v. fuer 7 Tage, Prednisolon 40 mg fuer 3 Tage, Sauerstoff 2L/min, Antipyrese.",
    "Umstellung auf orale Antibiose (Cefuroxim-Axetil), Fortfuehrung der Herzinsuffizienz-Therapie. Wiedervorstellung Pneumologie. Pneumokokken- und Grippeimpfung empfohlen.",
    ["Patientendaten", "Anamnese und Vorerkrankungen", "Klinischer Befund", "Diagnostische Ergebnisse", "Diagnose", "Statioenaere Therapie", "Entlassmedikation", "Empfehlungen"],
    ["ambulant erworbene Pneumonie", "CRB-65 Score", "purulenter Auswurf", "Antibiose", "Unterlappenpneumonie"],
    "76-jaehrige Patientin mit ambulanter Pneumonie rechts basal. CRB-65 Score 1. Aufnahmebefund: Fieber, Tachypnoe, Rechtsbasale RG. CRP 185 mg/L. Therapie: Ceuroxim i.v., Prednisolon, Sauerstoff. Klinische Besserung unter Therapie. Entlassung: orale Antibiose, Impfung empfohlen."
)

add(
    "Chronisches Nierenversagen (CKD)",
    "Verfassen Sie einen Arztbrief fuer eine 72-jaehrige Patientin mit chronischer Niereninsuffizienz Stadium 4.",
    "72 Jahre, weiblich, 68 kg, BMI 26",
    "Zunehmende Muedigkeit, Juckreiz, geschwollene Beine seit Wochen. Bekannte diabetische Nephropathie. DM Typ 2 seit 20 Jahren, Hypertonie.",
    "RR 155/90, HF 80/min. Beinodeme beidseits bis Unterschenkel. Haut trocken, Kratzspuren.",
    "Kreatinin 3.8 mg/dL, eGFR 15 mL/min, Kalium 5.2 mmol/L, Hb 10.1 g/dL. Urin: Proteinurie 3.5 g/Tag. Sono-Niere: verkleinert, echoarm.",
    "Chronische Niereninsuffizienz Stadium 4 bei diabetischer Nephropathie. Renale Anamie. Hyperkaliämie.",
    "Diaetberatung (kaliumarm, phosphatarm, eiweissreduziert). Furosemid 40 mg, Erythropoetin, Kalzium-Acetat. Dialysevorbereitung (Shunt-Anlage).",
    "Fortfuehrung der diuretischen Therapie, Erythropoetin subkutan 1x/Woche, kaliumarme Diat. Dialyse-Checkliste: Shunt-Chirurgie innerhalb 3 Monaten. Vorstellung Nephrologie in 2 Wochen.",
    ["Patientendaten und Grunderkrankung", "Aktuelle Symptomatik", "Klinischer Untersuchungsbefund", "Labor- und Sonographiebefunde", "Diagnose", "Therapie und Medikation", "Dialysevorbereitung", "Wiedervorstellung"],
    ["diabetische Nephropathie", "eGFR = estimated GFR", "renale Anamie", "Hyperkaliamie", "Dialyse-Shunt"],
    "72-jaehrige Patientin mit CKD Stadium 4 bei diabetischer Nephropathie. Kreatinin 3.8 mg/dL, eGFR 15. Hyperkaliamie, renale Anamie. Therapie: Erythropoetin, Diuretika, kaliumarme Diat. Dialysevorbereitung (Shunt-Anlage) eingeleitet."
)

add(
    "Akute Pankreatitis",
    "Schreiben Sie einen Arztbrief fuer eine 45-jaehrige Patientin mit akuter biliaerer Pankreatitis.",
    "45 Jahre, weiblich, 74 kg, BMI 27",
    "Nach fettreicher Mahlzeit starke Oberbauchschmerzen mit Ausstrahlung in den Ruecken. Uebelkeit, Erbrechen. Bekannte Gallensteine.",
    "BS 37.8 Grad, RR 130/80, HF 105/min, Abdomen: Druckschmerz Epigastrium, Abwehrspannung, Darmgerausche abgeschwacht.",
    "Lipase 2400 U/L. CRP 45 mg/L. Leberwerte: GGT 180 U/L, AP 140 U/L, Bilirubin 2.1 mg/dL. Sono: Multiple Gallenblasensteine, Pankreas oedematös, freie Flüssigkeit.",
    "Akute biliaere Pankreatitis (Grad I nach Atlanta).",
    "Nulla per os, i.v.-Fluessigkeit (Ringer-Laktat 100 mL/h), Pethidin bei Schmerz, PPI. Keine Antibiotika (keine Infektionszeichen).",
    "Beginnender Kostaufbau nach 48h (bei Rueckgang der Lipase). Elektive Cholezystektomie nach Abklingen (4-6 Wochen). Vorstellung Chirurgie.",
    ["Aufnahmedatum, Patientendaten", "Aktuelle Beschwerden", "Befund und Diagnostik", "Diagnose", "Stationarer Verlauf und Therapie", "Medikamente bei Entlassung", "Weitere Empfehlungen"],
    ["biliaere Pankreatitis", "Gallenstein assoziiert", "Lipase erhoeht", "Nulla per os", "Cholezystektomie"],
    "45-jaehrige Patientin mit akuter biliaerer Pankreatitis (Lipase 2400 U/L) bei bekannter Cholelithiasis. Konservative Therapie: NPO, i.v.-Fluessigkeit, Analgesie. Kostaufbau nach 48h. Elektive Cholezystektomie nach Abklingen geplant."
)

add(
    "Harnwegsinfektion bei Pyelonephritis",
    "Verfassen Sie einen Arztbrief fuer eine 34-jaehrige Patientin mit akuter Pyelonephritis.",
    "34 Jahre, weiblich, 62 kg, BMI 22",
    "Seit 2 Tagen Fieber bis 39.5 Grad, Schuttelfrost, Flankenschmerz rechts, Dysurie. Keine Vorerkrankungen.",
    "BS 39.2 Grad, RR 110/70, HF 110/min. Klopfschmerz rechte Flanke. Abdomen weich.",
    "Urin: Leukozyten +++, Nitrit pos. CRP 240 mg/L. Kreatinin 0.9 mg/dL. Blutkulturen abgenommen. Sono Niere: Stau rechts Grad I.",
    "Akute Pyelonephritis rechts.",
    "Ciprofloxacin 400 mg i.v. 2x/Tag, antipyretisch, Fluessigkeit. Urinkultur lauft.",
    "Nach 48h i.v.-Therapie Umstellung auf orales Ciprofloxacin 500 mg 2x/Tag fuer 10 Tage. Sonographiekontrolle in 4 Wochen.",
    ["Aufnahmegrund", "Anamnese", "Klinischer Befund", "Diagnostik (Urin, Labor, Sono)", "Diagnose", "Therapie", "Entlassungsmedikation", "Kontrolle"],
    ["Pyelonephritis", "Flankenschmerz", "Schuttelfrost", "HWI = Harnwegsinfekt", "Antibiose i.v."],
    "34-jaehrige Patientin mit akuter Pyelonephritis rechts. Klinik: Fieber, Schuttelfrost, Flankenschmerz. CRP 240 mg/L, Urin: Leukozyten und Nitrit positiv. Therapie: Ciprofloxacin i.v., Umstellung auf oral fuer 10 Tage. Sonographiekontrolle in 4 Wochen."
)

add(
    "Akute Urtikaria mit Angiooedem",
    "Schreiben Sie einen Arztbrief fuer eine 28-jaehrige Patientin mit akuter Urtikaria/Angiooedem.",
    "28 Jahre, weiblich, 55 kg, BMI 20",
    "30 Minuten nach Einnahme von Ibuprofen wegen Kopfschmerzen: Rote Quaddeln an Armen und Beinen, Schwellung der Lippen und Augenlider. Leichte Dyspnoe.",
    "BS 37.0 Grad, RR 115/75, HF 95/min, SaO2 97%. Haut: disseminierte Urtikaria. Lippen und periorbital geschwollen. Lunge o.B.",
    "Keine wegweisenden Laborveraenderungen.",
    "Akute Urtikaria mit Angiooedem nach NSAR-Einnahme.",
    "Feniramin 4 mg, Prednisolon 250 mg i.v. Gute Besserung innerhalb 1 Stunde.",
    "NSAR-Meidung, Allergiepass. Vorstellung Allergologie zur Testung. Alternative Schmerzmedikation: Paracetamol. Omeprazol als Magenschutz.",
    ["Patientendaten", "Ausloeser und Symptome", "Befund", "Diagnose", "Akutmassnahmen", "Empfehlungen und Allergiepass"],
    ["Urtikaria = Nesselsucht", "Angiooedem", "NSAR-Intoleranz", "Allergiepass", "Feniramin"],
    "28-jaehrige Patientin mit akuter Urtikaria und Angiooedem 30 min nach Ibuprofen-Einnahme. Akuttherapie: Feniramin, Prednisolon i.v., vollstaendige Rueckbildung. Allergiepass ausgestellt. Allergologische Testung empfohlen."
)

add(
    "Kniegelenksarthrose mit OP-Indikation",
    "Verfassen Sie einen Arztbrief fuer eine 74-jaehrige Patientin mit Kniegelenksarthrose.",
    "74 Jahre, weiblich, 85 kg, BMI 31",
    "Seit Jahren zunehmende Knieschmerzen beidseits, rechts staerker. Anlaufschmerz, Treppensteigen kaum noch moeglich. Ibuprofen nicht ausreichend.",
    "Rechtes Knie: mäßiger Gelenkerguss, Krepitation, Schmerz bei Flexion > 90 Grad, Bandstabil.",
    "Roentgen: Medialer Gelenkspaltverschmälerung rechts, Osteophyten. MRT: Knorpelschaden Grad IV medial, freie Gelenkkoerper.",
    "Gonarthrose rechts Grad IV bei Adipositas.",
    "Konservativ ausgeschöoft (Physiotherapie, NSAR, Hyaluronsaeure), unzureichender Erfolg.",
    "Indikation zur Knie-TEP rechts gestellt. Gewichtsreduktion vor OP empfohlen. Aufnahme zur OP in 4 Wochen. Praeoperative Vorbereitung: Röntgen, EKG, Labor.",
    ["Patientendaten", "Aktuelle Beschwerden und Vorbehandlung", "Klinischer Befund", "Bildgebung", "Diagnose", "Bisherige Therapieversuche", "OP-Planung", "Praoperative Vorbereitung"],
    ["Gonarthrose = Kniegelenksarthrose", "Knie-TEP = Knie-Totalendoprothese", "Gelenkspaltverschmälerung", "Krepitation", "Anlaufschmerz"],
    "74-jaehrige Patientin mit Gonarthrose rechts Grad IV. Konservative Massnahmen ausgeschoepft. Indikation zur Knie-TEP gestellt. Adipositas als Risikofaktor. Gewichtsreduktion praeoperativ empfohlen. Aufnahme in 4 Wochen."
)

add(
    "Akute tiefe Beinvenenthrombose",
    "Schreiben Sie einen Arztbrief fuer eine 62-jaehrige Patientin mit akuter TVT.",
    "62 Jahre, weiblich, 70 kg, BMI 26",
    "Seit 3 Tagen Schwellung und Schweregefuehl im linken Bein. Wade druckschmerzhaft. 8-Stunden-Flug vor 2 Wochen.",
    "Linkes Bein: Umfang 3 cm grosser als rechts, Wadendruckschmerz, homans-Zeichen positiv, keine UEberwaermung.",
    "D-Dimer 3200 mg/mL. Kompressionssonographie: Thrombose der V. poplitea und V. femoralis superficialis links.",
    "Akute tiefe Beinvenenthrombose links (proximal).",
    "Enoxaparin 1 mg/kgKG s.c. 2x/Tag, Phenprocoumon (Marcumar) einschleichend, Kompressionsstrumpf Klasse II.",
    "Marcumar-Ziele: INR 2.0-3.0 fuer 6 Monate. Enoxaparin bis INR im Zielbereich. Kompression fuer 2 Jahre. Koerperliche Bewegung. Keine Oestrogene.",
    ["Patientendaten", "Symptome und Risikofaktoren", "Klinischer Befund", "Diagnostik (D-Dimer, Sono)", "Diagnose", "Akuttherapie", "Langzeittherapie", "Kontrollen"],
    ["TVT = tiefe Beinvenenthrombose", "Compressionssonographie", "Marcumar/Phenprocoumon", "Kompressionsstrumpf", "Antikoagulation"],
    "62-jaehrige Patientin mit akuter proximaler TVT links bei Flugreise. Kompressionssonographie bestätigte Thrombose der V. poplitea et femoralis. Therapie: Enoxaparin, Marcumar, Kompression. INR-Ziel 2.0-3.0 fuer 6 Monate."
)

add(
    "Bandscheibenvorfall L4/L5",
    "Verfassen Sie einen Arztbrief fuer einen 48-jaehrigen Patienten mit Bandscheibenvorfall L4/L5.",
    "48 Jahre, mannlich, 88 kg, BMI 29",
    "Seit 3 Tagen heftige Lumbago mit Ausstrahlung in den linken Fuss. Kribbeln im Fussruecken. Zehenheben nicht mehr moeglich.",
    "LWS: Bewegungseinschränkung, Druckschmerz L4/L5 links. Nervendehnungszeichen positiv links. Zehen- und Fusheberschwaeche (Kraftgrad 3/5).",
    "MRT LWS: Medialer Bandscheibenvorfall L4/L5 links mit Einengung des Spinalnervs L5.",
    "Lumbale Radikulopathie L5 links bei Bandscheibenvorfall L4/L5 mit Fusheberparese.",
    "Konservativ: NSAR, Physiotherapie, Rueckenschule.",
    "Bei fehlender Besserung der Parese innerhalb 48h operative Entlastung. MRT-Kontrolle. Neurochirurgische Vorstellung. Arbeitsunfaehig.",
    ["Patientendaten", "Aktuelle Symptome", "Neurologischer Befund", "Bildgebung", "Diagnose", "Therapie", "Notfallkriterien"],
    ["Lumbago = Rueckenschmerz", "Radikulopathie = Nervenwurzelreizung", "Fusheberparese", "Nervendehnungszeichen", "Cauda-equina-Syndrom"],
    "48-jaehriger Patient mit Bandscheibenvorfall L4/L5 links. Fusheberparese (Kraftgrad 3/5), Kribbeln im L5-Dermatom. Konservative Therapie eingeleitet, bei fehlender Rueckbildung innerhalb 48h operative Entlastung. Neurochirurgie involviert."
)

# Add 15 more to reach 25
# (continuing below)

print(f"Generated {n} items")
json.dump(items, open('../src/data/fspWriting.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print(f"Written to ../src/data/fspWriting.json")
