import json

# Read existing
d = json.load(open('../src/data/fspWriting.json','r',encoding='utf-8'))
n = len(d)
print(f'Starting: {n}')

def add(caseTitle, task, patientData, history, examFindings, diagnostics, assessment, treatment, dischargePlan, expectedStructure, usefulPhrases, modelAnswer):
    global n
    n += 1
    d.append({
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
    "Akute Gastritis nach NSAR-Einnahme",
    "Verfassen Sie einen Arztbrief fuer eine 52-jaehrige Patientin mit akuter NSAR-Gastropathie.",
    "52 Jahre, weiblich, 66 kg, BMI 24",
    "Seit 3 Tagen Oberbauchschmerzen, Sodbrennen, Uebelkeit. Nimmt seit 2 Wochen Ibuprofen 600 mg 3x/Tag wegen Rueckenschmerzen.",
    "Epigastrium druckschmerzhaft, Abdomen weich, Darmgeraeusche regelrecht.",
    "Oesophagogastroduodenoskopie: Erythematose Gastritis im Antrum, Erosionen. H.-pylori-Schnelltest negativ.",
    "NSAR-induzierte akute Erosionsgastritis.",
    "Pausieren des Ibuprofens, Pantoprazol 40 mg 1x/Tag, Sucralfat. Alternative Schmerztherapie.",
    "Pantoprazol fuer 4 Wochen, regelmassige Einnahme. Bei erneuter NSAR-Notwendigkeit Magenschutz. Wiedervorstellung Gastro bei Beschwerdepersistenz.",
    ["Patientendaten", "Anamnese und NSAR-Einnahme", "Koerperlicher Befund", "Endoskopie-Befund", "Diagnose", "Therapie", "Medikation bei Entlassung"],
    ["NSAR = nichtsteroidales Antirheumatikum", "Gastropathie", "PPI = Protonenpumpeninhibitor", "Erosionsgastritis"],
    "52-jaehrige Patientin mit NSAR-induzierter Erosionsgastritis. Nach Pausieren des Ibuprofens und Pantoprazol-Therapie Beschwerdefreiheit. Magenschutz fuer 4 Wochen."
)

add(
    "Diabetes mellitus Entgleisung",
    "Schreiben Sie einen Arztbrief fuer einen 60-jaehrigen Patienten mit hyperosmolarem Koma.",
    "60 Jahre, mannlich, 95 kg, BMI 32",
    "Seit Tagen Schwaeche, vermehrtes Durstgefühl, haeufiges Wasserlassen, Gewichtsverlust. Heute zunehmend somnolent.",
    "BS 37.0, RR 100/60, HF 115/min, BZ 680 mg/dL, Sonnolenz, Exsikkose-Zeichen.",
    "BZ 680 mg/dL, Na 152, K 3.8, Kreatinin 1.8, pH 7.38, HCO3 24. BGA: keine Ketoazidose. HBA1c 11.2%.",
    "Hyperosmolares hyperglykaemisches Syndrom (HHS) bei neu manifestiertem DM Typ 2.",
    "Intensivstation, isotone Kochsalzloesung, Insulinperfusor nach Schema, Kaliumsubstitution bei Bedarf.",
    "Umstellung auf Insulin glargin + Insulin aspart. Diabetesberatung, Schulung. Ernährungsberatung, Fussinspektion. Vorstellung Diabetologie in 1 Woche.",
    ["Patientendaten", "Aktuelle Anamnese und Vorerkrankungen", "Aufnahmebefund (BS, RR, Puls, BZ, Neurologie)", "Labor (BZ, Elektrolyte, BGA, HbA1c)", "Diagnose", "Intensivtherapie", "Weitere Therapie und Entlassplan"],
    ["HHS = hyperosmolares hyperglykaemisches Syndrom", "Exsikkose", "Insulinperfusor", "HbA1c = Langzeitblutzucker"],
    "60-jaehriger Patient mit HHS bei Neumanifestation DM Typ 2. BZ 680 mg/dL, Hyponatriaemie 152, keine Ketoazidose. Intensivstation: Fluessigkeit, Insulinperfusor. Einstellung auf Insulin glargin/aspart. Diabeteschulung."
)

add(
    "Schlaganfall (Ischaemischer Insult)",
    "Verfassen Sie einen Arztbrief fuer eine 70-jaehrige Patientin mit akutem ischaemischen Schlaganfall.",
    "70 Jahre, weiblich, 63 kg, BMI 23",
    "Seit 2 Stunden Hemiparese rechts, Sprachstoerung, Mundwinkellaehmung rechts. Vorhofflimmern bekannt.",
    "RR 160/90, HF irregulaer 85/min. Hemiparese rechts (Kraftgrad 2/5 Arm, 3/5 Bein), Fazialisparese rechts, senso-motorische Aphasie. NIHSS 14.",
    "CCT: keine Blutung, kein frueher Infarktnachweis. MRT-DWI: Diffusionsstoerung Media links. EKG: Vorhofflimmern. Echo: linkes Vorhofohr-Thrombus.",
    "Akuter ischaemischer Insult links media bei Vorhofflimmern. NIHSS 14.",
    "Thrombolyse (rt-PA) innerhalb 2.5 Stunden nach Symptombeginn. Keine mechanische Thrombektomie. ASS 100 mg ab Tag 1.",
    "ASS 100 mg, Atorvastatin 40 mg, Bisoprolol 2.5 mg, Marcumar ab Tag 7 (CHADS-VASc 4). Logopaedie, Ergotherapie, Physiotherapie. Neurologische Rehabilitation.",
    ["Patientendaten", "Zeitlicher Ablauf", "Neurologischer Befund (NIHSS)", "Bildgebung", "Diagnose", "Akuttherapie (Thrombolyse)", "Sekundaerpraevention", "Rehabilitation"],
    ["ischaemischer Schlaganfall", "NIHSS = National Institutes of Health Stroke Scale", "Thrombolyse = Lyse-Therapie", "CHADS-VASc-Score", "Vorhofflimmern"],
    "70-jaehrige Patientin mit links-medialem Schlaganfall bei Vorhofflimmern. Thrombolyse innerhalb 2.5h. NIHSS 14. Sekundaerpraevention: ASS, Marcumar ab Tag 7, Statin. Rehabilitation eingeleitet."
)

add(
    "Cholezystitis",
    "Schreiben Sie einen Arztbrief fuer eine 55-jaehrige Patientin mit akuter Cholezystitis.",
    "55 Jahre, weiblich, 82 kg, BMI 30",
    "Seit 2 Tagen rechtseitige Oberbauchschmerzen, Fieber bis 38.8, Uebelkeit. Frueher schon Gallenkoliken.",
    "BS 38.5, RR 135/85, HF 95/min, Subikterus, Abdomen: Druckschmerz rechter Oberbauch, Murphy-Zeichen positiv.",
    "Leukozyten 15.2 G/L, CRP 180 mg/L, Bilirubin 2.8, GGT 220, AP 160. Sono: Gallenblasenwand verdickt (8mm), pericholezystische Fluessigkeit, Steine.",
    "Akute Cholezystitis bei Cholelithiasis.",
    "Ceftriaxon 2 g + Metronidazol 500 mg, NPO, i.v.-Fluessigkeit, PPI.",
    "Nach Rueckgang der Entzuendungsparameter: Laparoskopische Cholezystektomie. Vorstellung Chirurgie.",
    ["Patientendaten", "Anamnese und Symptome", "Koerperlicher Untersuchungsbefund", "Labor und Sono", "Diagnose", "Therapie", "OP-Planung"],
    ["Cholezystitis = Gallenblasenentzuendung", "Cholelithiasis = Gallensteine", "Murphy-Zeichen", "Cholezystektomie"],
    "55-jaehrige Patientin mit akuter Cholezystitis bei Cholelithiasis. Sono: verdickte Wand, Steine, pericholezystische Fluessigkeit. Antibiose. Laparoskopische Cholezystektomie nach Abklingen geplant."
)

add(
    "Asthma-Exazerbation bei Kind",
    "Verfassen Sie einen Arztbrief fuer ein 8-jaehriges Kind mit akuter Asthma-Exazerbation.",
    "8 Jahre, weiblich, 28 kg",
    "Seit 2 Tagen Husten und pfeifende Atmung. Heute Atemnot, spricht in Satzen, benoetigt den Notfallspray alle 2 Stunden.",
    "AF 32/min, SaO2 91%, HF 130/min, BS 37.2. Auskultation: exspiratorisches Giemen, verlängertes Exspirium, Hilfsmuskulatur eingesetzt.",
    "BGA: pH 7.38, pCO2 35, pO2 80, HCO3 22.",
    "Akute schwere Asthma-Exazerbation.",
    "Salbutamol per Vernebler (3x innerhalb 1h), Prednisolon 2 mg/kg p.o., Sauerstoff 2L/min.",
    "Fortfuehrung der Inhalationstherapie mit Budesonid/Formoterol. Asthma-Schulung. Peak-Flow-Protokoll. Vorstellung Pneumologie.",
    ["Patientendaten", "Anamnese des Asthmas", "Aktuelle Symptome und Medikation", "Klinischer Befund", "Diagnose", "Akuttherapie", "Daue-rtherapie bei Entlassung"],
    ["Asthma-Exazerbation", "Giemen = pfeifende RG", "Notfallspray", "Peak-Flow", "Hilfsmuskulatur"],
    "8-jaehrige Patientin mit schwerer Asthma-Exazerbation. Therapie: Salbutamol-Vernebler, Prednisolon, Sauerstoff. Besserung nach Akuttherapie. Dauertherapie: Budesonid/Formoterol. Asthmaschulung geplant."
)

add(
    "Depressive Episode mit Suizidgedanken",
    "Verfassen Sie einen Arztbrief fuer eine 35-jaehrige Patientin mit mittelschwerer Depression.",
    "35 Jahre, weiblich, 60 kg, BMI 22",
    "Seit 8 Wochen gedrueckte Stimmung, Antriebslosigkeit, Fruherwachen, Appetitlosigkeit, Gruebeln. Fuehlt sich hoffnungslos, aber keine konkreten Suizidplaene.",
    "BS und RR o.B., Affekt: gedrueckt, verlangsamt, leise Sprache. Keine psychotischen Symptome. Minimental 28/30.",
    "Labor: TSH, Vitamin B12, Vitamin D normal.",
    "Mittelschwere depressive Episode (ICD-10 F32.1), kein akutes Suizidrisiko.",
    "Stationaere psychiatrische Aufnahme, SSRI (Escitalopram 10 mg) einschleichend, Gespraechstherapie.",
    "Escitalopram 10 mg fuer 4 Wochen, dann Evaluation. Bei gutem Ansprechen auf 20 mg. Psychotherapie fortfuehren. Suizidpraevention besprochen.",
    ["Patientendaten", "Psychopathologischer Befund", "Suizidrisiko", "Diagnose", "Therapie (medikamentoes und psychotherapeutisch)", "Entlassplanung"],
    ["depressive Episode", "Anhedonie = Interessenverlust", "SSRI = selektiver Serotonin-Wiederaufnahmehemmer", "Frueherwachen"],
    "35-jaehrige Patientin mit mittelschwerer depressiver Episode. Keine akute Suizidalitaet. Therapie: Escitalopram 10 mg, Psychotherapie. Wiedervorstellung in 4 Wochen."
)

add(
    "Eisenmangelanaemie bei Hypermenorrhoe",
    "Schreiben Sie einen Arztbrief fuer eine 33-jaehrige Patientin mit Eisenmangelanaemie.",
    "33 Jahre, weiblich, 58 kg, BMI 21",
    "Seit Monaten zunehmende Muedigkeit, blasse Haut, Belastungsdyspnoe. Seit Jahren starke Regelblutungen.",
    "Blasse Haut und Schleimhaeute, RR 110/70, HF 95/min, leises Systolikum 2/6.",
    "Hb 8.2 g/dL, MCV 72 fl, Ferritin 8 ng/mL, Transferrinsaettigung 10%, Eisen 25 mcg/dL.",
    "Eisenmangelanaemie bei Hypermenorrhoe. Differenzialdiagnose: gastrointestinaler Blutverlust.",
    "Orale Eisensubstitution (Eisen-II-Sulfat 100 mg 2x/Tag), Vitamin C zur Resorptionssteigerung.",
    "Eisen fuer mindestens 3 Monate. Kontrolle: Hb + Ferritin in 4 Wochen. Gynaekologische Vorstellung zur Abklaerung der Hypermenorrhoe.",
    ["Patientendaten", "Symptome und Menses-Anamnese", "Koerperlicher Befund", "Labor (Blutbild, Ferritin, Eisen)", "Diagnose", "Therapie", "Weitere Abklaerung"],
    ["Eisenmangelanaemie", "Ferritin = Eisenspeicher", "Hypermenorrhoe = starke Regelblutung", "MCV = mittleres Erythrozytenvolumen"],
    "33-jaehrige Patientin mit Eisenmangelanaemie (Hb 8.2, Ferritin 8) bei Hypermenorrhoe. Orale Eisensubstitution. Gynaekologische Vorstellung zur Ursachenabklaerung."
)

add(
    "Verdacht auf Lungenembolie",
    "Verfassen Sie einen Arztbrief fuer eine 68-jaehrige Patientin mit V.a. Lungenembolie.",
    "68 Jahre, weiblich, 75 kg, BMI 27",
    "Ploetzliche Atemnot und Brustschmerzen seit 3 Stunden. Vor 5 Tagen Rueckflug aus Australien (12h Flug).",
    "RR 135/85, HF 105, BS 37.0, AF 24/min, SaO2 89% (Raumluft). Keine Beinschwellung.",
    "D-Dimer 4800 ng/mL. CT-Angiographie: Lungenembolie segmental links unten.",
    "Lungenembolie segmental links. Wells-Score 4.5 (hohe Wahrscheinlichkeit).",
    "Niedermolekulares Heparin (Enoxaparin 1 mg/kg s.c. 2x/Tag).",
    "Marcumar einschleichen (INR 2.0-3.0). Antikoagulation fuer mindestens 6 Monate. Kompressionssonographie Beine. Thrombophilie-Diagnostik erwogen.",
    ["Patientendaten", "Risikofaktoren und Reiseanamnese", "Klinischer Befund", "Diagnostik (D-Dimer, CT)", "Diagnose", "Therapie (Akut und Langzeit)"],
    ["Lungenembolie", "Wells-Score", "D-Dimer", "Antikoagulation", "CT-Angiographie"],
    "68-jaehrige Patientin mit segmentaler Lungenembolie links bei Flugreise. Therapie: Enoxaparin, Marcumar fuer 6 Monate. Thrombophilie-Diagnostik erwogen."
)

add(
    "Hyperthyreose bei Morbus Basedow",
    "Schreiben Sie einen Arztbrief fuer eine 30-jaehrige Patientin mit neu diagnostiziertem Morbus Basedow.",
    "30 Jahre, weiblich, 54 kg, BMI 19",
    "Seit Wochen Nervositaet, Zittern, Herzrasen, 6 kg Gewichtsverlust trotz Heisshunger. Hitzeintoleranz, verstaerkter Schweiss. Kloessgefuehl im Hals.",
    "HF 110/min, RR 125/70, Tremor, warmer, feuchter Haut. Struma Grad Ib, weich. Leichter Exophthalmus.",
    "TSH < 0.01, fT3 8.2, fT4 3.8. TRAK 15 U/L. Sono: diffus echoarme, vergroesserte Schilddruese.",
    "Morbus Basedow mit manifester Hyperthyreose.",
    "Thiamazol 20 mg/Tag (Thyreostase), Propranolol 40 mg 1-0-1 (Symtpomkontrolle).",
    "Thiamazol fuer 12-18 Monate, Reevaluation. TSH, fT3, fT4 nach 4 Wochen. Vorstellung Augenheilkunde bei Exophthalmus.",
    ["Patientendaten", "Symptome der UEberfunktion", "Status praesens (inkl. Hals, Augen)", "Labor (TSH, fT3, fT4, TRAK)", "Sono", "Diagnose", "Therapie"],
    ["Morbus Basedow = Autoimmun-Hyperthyreose", "TRAK = TSH-Rezeptor-Antikoerper", "Thyreostase = Schilddruesenhemmung", "Exophthalmus = Hervortreten der Augen"],
    "30-jaehrige Patientin mit Morbus Basedow: TSH supprimiert, fT3/fT4 erhoeht, TRAK positiv. Struma, Exophthalmus. Thyereostase mit Thiamazol 20 mg. Vorstellung Augenheilkunde."
)

add(
    "Chronische Obstipation mit Risikofaktoren",
    "Verfassen Sie einen Arztbrief fuer eine 68-jaehrige Patientin mit chronischer Obstipation.",
    "68 Jahre, weiblich, 64 kg, BMI 24",
    "Seit Jahren Verstopfung, Stuhlgang alle 3-4 Tage mit starkem Pressen. Laxanzienabhaengigkeit. Wenig Bewegung, geringe Trinkmenge.",
    "Abdomen: weich, leichter Druckschmerz linker Unterbauch, zeitweise fühlbare Kotballen. Keine Abwehrspannung.",
    "Koloskopie vor 2 Jahren: Sigmadivertikel, sonst o.B. Sonst keine relevante Diagonstik.",
    "Chronische Obstipation mit Laxanzienabhaengigkeit.",
    "Stufenweises Laxanzienmanagement: Zunaechst Macrogol (Movicol) 1-2x/Tag, ggf. Bisacodyl als Reserve. Ballaststoffreiche Ernaehrung, Trinkprotokoll.",
    "Macrogol fuer 4 Wochen, dann Ausschleichversuch. Taeglich 1.5-2 L trinken, 30 Min Bewegung. Probiotika erwogen.",
    ["Patientendaten", "Anamnese der Obstipation", "Laxanzieneinnahme", "Untersuchungsbefund", "Diagnose", "Therapieplan"],
    ["Obstipation = Verstopfung", "Laxanzienabhaengigkeit", "Macrogol = osmotisch wirkendes Laxans", "Ballaststoffe"],
    "68-jaehrige Patientin mit chronischer Obstipation und Laxanzienabhaengigkeit. Stufenweiser UUmstieg auf Macrogol. Ballaststoffe, Trinkmenge. Bewegungssteigerung."
)

add(
    "Pyschotische Symptome bei schizophrener Ersterkrankung",
    "Verfassen Sie einen Arztbrief fuer einen 24-jaehrigen Patienten mit Verdacht auf Schizophrenie.",
    "24 Jahre, mannlich, 70 kg, BMI 22",
    "Seit Wochen zunehmender Rueckzug, misstrauisch, hoert Stimmen, fuehlt sich verfolgt. Schlafstoeung, Konzentrationsstoeung.",
    "Affekt: verflacht, Misstrauen, akustische Halluzinationen. Keine akute Fremd- oder Eigengefaehrdung.",
    "Labor: Blutbild, TSH, Leberwerte, Drogenscreening o.B. CCT: unauffaellig.",
    "Erstmanifestation einer paranoiden Schizophrenie (ICD-10 F20.0).",
    "Stationaere psychiatrische Behandlung. Einleitung einer antipsychotischen Therapie mit Olanzapin 10 mg/Tag.",
    "Olanzapin 10 mg, Einstellung auf 20 mg bei Bedarf. Psychoedukation. Wiedervorstellung Psychiatrie in 2 Wochen.",
    ["Patientendaten", "Psychopathologischer Befund", "Ausschluss organischer Ursache", "Diagnose", "Medikamentoese Therapie", "Psychosoziale Betreuung"],
    ["paranoide Schizophrenie", "Halluzinationen", "Wahn", "Antipsychotikum (Neuroleptikum)", "Psychoedukation"],
    "24-jaehriger Patient mit paranoid-schizophrener Ersterkrankung. Akustische Halluzinationen, Verfolgungswahn. Einleitung Antipsychotikum (Olanzapin). Psychoedukation. Wiedervorstellung in 2 Wochen."
)

add(
    "Gichtanfall bei Hyperurikamie",
    "Schreiben Sie einen Arztbrief fuer einen 52-jaehrigen Patienten mit akutem Gichtanfall.",
    "52 Jahre, mannlich, 92 kg, BMI 30",
    "Seit heute Nacht plötzlich starke Schmerzen im rechten Grosszehengrundgelenk. Gelenk gerötet, geschwollen, ueberwarmt.",
    "RR 140/90, BS 37.2. Grosszehengrundgelenk rechts: Rötung, Schwellung, UEberwarmung, massiver Druckschmerz.",
    "Harnsaure 9.2 mg/dL. CRP 40 mg/L. Gelenkpunktion (echte Gichtkristalle).",
    "Akute Gichtarthritis (Podagra) bei Hyperurikaemie.",
    "NSAR (Diclofenac 75 mg 2x/Tag) fuer 5 Tage, Kuehlung, Schonung.",
    "Nach Abklingen des Anfalls: Allopurinol 100 mg/Tag einschleichend. Diat: Purinarme Kost, kein Alkohol, viel Trinken. Harnsaure-Ziel < 6 mg/dL.",
    ["Patientendaten", "Akutsymptomatik", "Befund", "Labor (Harnsaure, CRP), Punktion", "Diagnose", "Akuttherapie", "Dauertherapie"],
    ["Gicht, Podagra", "Hyperurikamie = erhohte Harnsaure", "NSAR", "Allopurinol = Harnsaeuresenker"],
    "52-jaehriger Patient mit akutem Gichtanfall (Podagra). Harnsaure 9.2 mg/dL. Akut: Diclofenac. Nach Abklingen: Allopurinol. Diatberatung."
)

add(
    "Ulcus cruris bei venoser Insuffizienz",
    "Verfassen Sie einen Arztbrief fuer eine 78-jaehrige Patientin mit Ulcus cruris venosum.",
    "78 Jahre, weiblich, 72 kg, BMI 27",
    "Seit 3 Monaten offene Stelle am linken Unterschenkel (Knöchelbereich). Naechtliche Wadenschmerzen, schwere Beine. Krampfadern bekannt.",
    "Linker Unterschenkel: Ulcus 3x4 cm über dem Innenknochel, granulierender Grund, wenig Exsudat. Atrophie blanche, Varikosis, Knöchelödem.",
    "ABI rechts 1.1, links 1.0 (pAVK unwahrscheinlich). Duplexsonographie: Stammveneninsuffizienz V. saphena magna beidseits, Venenklappeninsuffizienz.",
    "Ulcus cruris venosum bei chronisch-venoeser Insuffizienz CVI Stadium C6.",
    "Wundversorgung (Hydrokolloidverband), Kompressionstherapie (Kompressionsstrumpf Klasse II, mehralgig).",
    "Fortlaufende Kompressionstherapie, Wundkontrolle 1x/Woche. Bewegung (Gehen, Fusstraining) und Hochlagern. Vorstellung Hautarzt/Chirurgie.",
    ["Patientendaten", "Wundanamnese und Beinsymptome", "Gefaessstatus", "Duplex", "Diagnose", "Wundversorgung", "Kompression", "Weitere Therapie"],
    ["Ulcus cruris = offenes Bein", "CVI = chronisch-venoese Insuffizienz", "ABI = Knöchel-Arm-Index", "Kompressionstherapie"],
    "78-jaehrige Patientin mit Ulcus cruris venosum bei CVI C6. Wundversorgung und Kompressionstherapie eingeleitet. ABI unauffaellig fuer pAVK."
)

add(
    "Vorderer Kreuzbandriss (Sportverletzung)",
    "Schreiben Sie einen Arztbrief fuer einen 22-jaehrigen Patienten mit VKB-Ruptur.",
    "22 Jahre, mannlich, 80 kg, BMI 24",
    "Beim Fussballspielen ploetzlicher Schmerz im rechten Knie nach Drehung, Kniegelenkerguss. Knie instabil.",
    "Rechtes Knie: Gelenkerguss (rohes Dreieck), Schonhaltung. Lachman-Test positiv, vordere Schublade positiv. Varus/Valgus stabil.",
    "Roentgen: kein knöcherner Ausgriss. MRT: Komplette VKB-Ruptur, mediale Meniskuslaesion.",
    "Vorderer Kreuzbandriss rechts mit medialer Meniskuslaesion.",
    "Ruhigstellung, Kuehlung, Hochlagern, Stabilschiene, entlastend Gehen.",
    "Erst Muskulatur aufbauen (Physiotherapie), dann VKB-Plastik (Semitendinosus-Graft) in 6-8 Wochen. Kein Sport bis OP.",
    ["Patientendaten", "Unfallhergang und Symptome", "Koerperliche Untersuchung", "Bildgebung", "Diagnose", "Akutmassnahmen", "OP-Planung"],
    ["VKB = vorderes Kreuzband", "Lachman-Test", "Meniskuslaesion", "Gelenkerguss"],
    "22-jaehriger Patient mit VKB-Ruptur rechts und medialer Meniskuslaesion. Akut: Ruhigstellung, Kuehlung. OP (VKB-Plastik) in 6-8 Wochen nach Vorbereitung."
)

print(f"Total now: {len(d)}")
json.dump(d, open('../src/data/fspWriting.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved")
