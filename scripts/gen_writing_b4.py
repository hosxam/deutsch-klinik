import json

d = json.load(open('../src/data/fspWriting.json','r',encoding='utf-8'))
n = len(d)
print(f'Starting: {n}')

def add(caseTitle, task, patientData, history, examFindings, diagnostics, assessment, treatment, dischargePlan, expectedStructure, usefulPhrases, modelAnswer):
    global n
    n += 1
    d.append({
        "id": f"fsp_w_{n:03d}", "caseTitle": caseTitle, "task": task,
        "patientData": patientData, "history": history,
        "examFindings": examFindings, "diagnostics": diagnostics,
        "assessment": assessment, "treatment": treatment,
        "dischargePlan": dischargePlan,
        "expectedStructure": expectedStructure,
        "usefulPhrases": usefulPhrases,
        "modelAnswer": modelAnswer
    })

add("Akute Pankreatitis bei Hypertriglyzeridaemie", "Verfassen Sie einen Arztbrief fuer einen 38-jaehrigen Patienten mit akuter Pankreatitis bei Hypertriglyzeridaemie.",
    "38 Jahre, maennlich, 95 kg, BMI 32",
    "Starke epigastrische Schmerzen, Ausstrahlung in den Ruecken, Uebelkeit, Erbrechen. Bekannte Hypertriglyzeridaemie.",
    "BS 37.5, RR 135/85, HF 100. Abdomen gespannt, epigastrischer Druckschmerz.",
    "Lipase 3500, Triglyzeride 4500 mg/dL. CRP 60. Sono: Pankreas oedematoes.",
    "Akute Pankreatitis bei Hypertriglyzeridaemie.",
    "NPO, i.v.-Fluessigkeit, Insulinperfusor zur Triglyzeridsenkung, ggf. Plasmapherese.",
    "Triglyzerid-arm Diat, Fibrat (Fenofibrat). Vermeidung von Alkohol. Kontrolle der Triglyzeride.",
    ["Patientendaten", "Symptome", "Risikofaktor", "Labor und Sono", "Diagnose", "Therapie", "Diat", "Kontrolle"],
    ["Hypertriglyzeridaemie", "Fibrat", "Plasmapherese"],
    "Patient mit Pankreatitis bei HTG. Triglyzeride 4500. NPO, Insulin, Plasmapherese. Diat, Fenofibrat.")

add("Chronische Niereninsuffizienz (CKD 4)", "Verfassen Sie einen Arztbrief fuer eine 68-jaehrige mit CKD 4 bei diabetischer Nephropathie.",
    "68 Jahre, weiblich, 70 kg, BMI 26",
    "Muedigkeit, Juckreiz, Oedeme. DM Typ 2 seit 20 Jahren. Hypertonie.",
    "RR 150/85. Beinoedeme. Zyanotisches Hautkolorit.",
    "Kreatinin 3.2, eGFR 18. Hb 9.8. Kalium 5.3.",
    "CKD Stadium 4. Renale Anaemie. Hyperkaliamie.",
    "Furosemid, Erythropoetin, kaliumarme Diat. Dialyse-Shunt-OP geplant.",
    "Erythropoetin woechentlich, Furosemid, kaliumarme Diat. Shunt-Anlage in 4 Wochen.",
    ["Patientendaten", "Symptome", "Befund", "Labor (Kreatinin, eGFR, Hb, K)", "Diagnose", "Therapie", "Plan"],
    ["CKD", "eGFR", "Dialyse", "Shunt", "Anaemie"],
    "CKD 4 bei diabetischer Nephropathie. eGFR 18, renale Anaemie, Hyperkaliamie. Dialysevorbereitung.")

add("Schilddruesenknoten (Struma nodosa)", "Verfassen Sie einen Arztbrief fuer eine 42-jaehrige mit Struma nodosa.",
    "42 Jahre, weiblich, 58 kg",
    "Klossgefuehl im Hals, Schluckbeschwerden. Keine Hormonsymptome.",
    "Struma Grad II, derber Knoten rechts.",
    "TSH, fT3, fT4 normal. Sono: Knoten rechts 2.5 cm, echoarm, Mikrokalzifikationen. Szintigraphie: kalt.",
    "Struma nodosa rechts, kalter Knoten.",
    "Feinnadelpunktion des kalten Knotens.",
    "Bei Malignonverdacht: Operation. Sonst Kontrolle in 6 Monaten.",
    ["Patientendaten", "Symptome", "Befund", "Sono und Szinti", "Diagnose", "Plan"],
    ["Struma = Kroepfe", "kalter Knoten = szintigraphisch inaktiv", "Feinnadelpunktion"],
    "Struma nodosa mit kaltem Knoten rechts. Punktion geplant. Bei Malignonverdacht OP.")

add("Asthma-Exazerbation", "Schreiben Sie einen Arztbrief fuer einen 42-jaehrigen mit schwerer Asthma-Exazerbation.",
    "42 Jahre, weiblich, 60 kg",
    "Seit 3 Tagen zunehmende Dyspnoe, pfeifende Atmung, spricht in Woertern. Bekanntes Asthma.",
    "AF 30, SaO2 87%, HF 115. Exspiratorisches Giemen, verlängertes Exspirium.",
    "BGA: pH 7.36, pCO2 42, pO2 70.",
    "Schwere Asthma-Exazerbation.",
    "Salbutamol+Ipratropium per Vernebler, Prednisolon 50 mg i.v., Sauerstoff.",
    "Prednisolon ausschleichen ueber 5 Tage. Fortfuehrung ICS/LABA. Asthmaschulung, Peakflow-Tagebuch.",
    ["Patientendaten", "Symptome", "Befund und BGA", "Diagnose", "Akuttherapie", "Dauertherapie"],
    ["Asthma-Exazerbation", "ICS/LABA", "Vernebler", "Peakflow"],
    "Schwere Asthma-Exazerbation. Vernebler, Prednisolon, Sauerstoff. ICS/LABA fortfuehren.")

add("Schlafapnoe", "Verfassen Sie einen Arztbrief fuer einen 55-jaehrigen Patienten mit obstruktiver Schlafapnoe.",
    "55 Jahre, maennlich, 100 kg, BMI 35",
    "Starke Tagesmuedigkeit, lautes Schnarchen, Atemaussetzer. Partner berichtet. Beruf: LKW-Fahrer.",
    "Uebergewicht, RR 145/90, enger Oropharynx.",
    "Polysomnographie: AHI 35/h. Naedrigen SaO2 78%.",
    "Obstruktive Schlafapnoe (AHI 35, schwer).",
    "CPAP-Therapie. Fahrtauglichkeit prufen.",
    "CPAP-Geraet. Gewichtsreduktion. Vorstellung Schlafmedizin. Fahrverbot bis zur Einstellung.",
    ["Patientendaten", "Symptome", "Risikofaktor Beruf", "Polysomnographie", "Diagnose", "CPAP, Fahrverbot"],
    ["Schlafapnoe", "AHI = Apnoe-Hypopnoe-Index", "CPAP", "Fahrtauglichkeit"],
    "Patient mit schwerer OSA (AHI 35). CPAP Therapie. Fahrverbot. Gewichtsreduktion.")

add("Akute Nierenkolik", "Verfassen Sie einen Arztbrief fuer einen 50-jaehrigen Patienten mit Nierenkolik.",
    "50 Jahre, maennlich, 82 kg",
    "Ploetzlicher, wellenartiger Schmerz rechte Flanke, ausstrahlend in den Unterbauch. Uebelkeit, Erbrechen.",
    "RR 145/90, BS 36.8. Klopfschmerz rechte Flanke. Kein Fieber.",
    "Urin: Ery +++. Sono: Nierenstein rechtes Nierenbecken, Harnstau Grad II.",
    "Nierenkolik bei Ureterstein.",
    "Diclofenac i.v., reichlich trinken, Alfuzosin (Steinaustreibungsfoerderung).",
    "Steinaustreibung abwarten. CT-Urogramm in 2 Wochen. Urologische Vorstellung.",
    ["Patientendaten", "Schmerz-Charakter", "Befund", "Sono, Urin", "Diagnose", "Therapie"],
    ["Nierenkolik", "Ureterstein", "Harnstau", "Alfuzosin"],
    "Patient mit Nierenkolik. Ureterstein rechts. Diclofenac, Alfuzosin. Urologische Vorstellung.")

add("Panikattacke", "Verfassen Sie einen Arztbrief fuer eine 28-jaehrige mit Panikattacke.",
    "28 Jahre, weiblich, 55 kg",
    "Ploetzliche Angstdepressiver, Herzrasen, Hyperventilation, Todesangst. 3. Episode in 4 Wochen.",
    "BS 37.0, RR 125/80, HF 110, afebril. Hyperventilation. Neurologisch o.B.",
    "ECG: Tachykardie. Troponin, Kalium, TSH normal.",
    "Panikattacke (F41.0).",
    "Beruhigung, Rueckatmung in die Haende, Aufklaerung. Akut: Lorazepam 1 mg sublingual.",
    "SSRI (Escitalopram 10 mg) zur Prophylaxe. Psychotherapie. Notfallplan.",
    ["Patientendaten", "Symptome", "Ausschluss organische Ursache", "Diagnose", "Akutmassnahmen", "Langzeittherapie"],
    ["Panikattacke", "Hyperventilation", "Lorazepam", "Escitalopram"],
    "Patientin mit Panikattacke. Herz-Kreislauf o.B. Beruhigung, Lorazepam. Escitalopram fuer Prophylaxe.")

add("Lungenkarzinom Verdacht", "Verfassen Sie einen Arztbrief fuer einen 66-jaehrigen Patienten mit Bronchialkarzinom-Verdacht.",
    "66 Jahre, maennlich, 60 kg, BMI 20",
    "Seit 3 Monaten Husten, Haemoptyse, Dyspnoe, 8 kg Gewichtsverlust. Starker Raucher (50 pack years).",
    "AF 22, SaO2 90%. Lunge: linksseitig abgeschwaechter Atemschall. Hals: Lymphknoten supraklavikulaer links.",
    "Roentgen: Verschattung linker Oberlappen. CT: Tumor 5 cm, Mediastinallymphknoten. Biopsie: Plattenepithelkarzinom.",
    "Bronchialkarzinom links (Plattenepithel).",
    "Staging: CT Thorax/Abdomen, PET-CT, Bronchoskopie, Sono-Abdomen.",
    "Staging abwarten, dann Tumorkonferenz. Palliative Chemotherapie/Immuntherapie je nach PD-L1.",
    ["Patientendaten", "Symptome und Risikofaktoren", "Befund", "Bildgebung", "Biopsie", "Staging"],
    ["Bronchialkarzinom", "Haemoptyse = Bluthusten", "PD-L1 = Immuntherapie-Marker", "Staging"],
    "Patient mit Bronchialkarzinom links. Staging abwarten. Tumorkonferenz zur Therapieplanung.")

add("Erektile Dysfunktion", "Verfassen Sie einen Arztbrief fuer einen 55-jaehrigen Patienten mit erektiler Dysfunktion.",
    "55 Jahre, maennlich, 88 kg, BMI 29",
    "Seit Monaten Erektionsprobleme, verminderte Libido. DM Typ 2, Hypertonie, Raucher.",
    "RR 145/85, Puls 75, Gynaekomastie leicht. Genital o.B., Prostata unauffällig.",
    "Testosteron 280 ng/dL (niedrig-normal). TSH, Prolaktin normal.",
    "Erektile Dysfunktion bei vaskulaeren Risikofaktoren.",
    "PDE5-Hemmer (Tadalafil 5 mg taeglich oder Sildenafil 50 mg bei Bedarf).",
    "Tadalafil 5 mg. RR/Diabetes optimieren. Nikotinkarenz. Ggfs. Andrologie.",
    ["Patientendaten", "Symptome", "Risikofaktoren", "Labor", "Diagnose", "Therapie"],
    ["ED = erektile Dysfunktion", "PDE5-Hemmer", "Tadalafil", "Testosteron"],
    "ED bei vaskulaeren Risiken. PDE5-Hemmer. Nikotinkarenz, RR-Optimierung.")

add("Harnverhalt bei BPH", "Verfassen Sie einen Arztbrief fuer einen 68-jaehrigen mit akutem Harnverhalt.",
    "68 Jahre, maennlich, 76 kg",
    "Seit 12h kann nicht Wasserlassen, schmerzhafter Unterbauch.",
    "Unterbauch prall gefuellt, Druckempfindlich. Prostata vergroessert.",
    "Sono: Restharn 800 mL.",
    "Akuter Harnverhalt bei BPH.",
    "Transurethraler Dauerkatheter. Tamsulosin 0.4 mg.",
    "Nach 48h Auslassversuch. Bei Erfolg: Tamsulosin. Bei Misserfolg: TURP.",
    ["Patientendaten", "Symptome", "Befund", "Sono", "Diagnose", "Katheter", "Medikation und OP"],
    ["Harnverhalt", "BPH = benigne Prostatahyperplasie", "TURP", "Katheter"],
    "Patient mit akutem Harnverhalt bei BPH. Katheter. Tamsulosin. Auslassversuch in 2 Tagen.")

print(f"Total: {len(d)}")
json.dump(d, open('../src/data/fspWriting.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved")
