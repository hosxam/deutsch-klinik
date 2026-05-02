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

add("Akute Bronchitis", "Verfassen Sie einen Arztbrief fuer einen 35-jaehrigen Patienten mit akuter Bronchitis.",
    "35 Jahre, maennlich, 74 kg, BMI 23", "Seit 5 Tagen Husten, zunaechst trocken, jetzt gelblicher Auswurf. Fieber bis 38.2. Keine Dyspnoe.",
    "BS 37.8, AF normal, Lunge: vesikulaeres Atemgeraeusch, vereinzelt Brummen.",
    "CRP 35 mg/L, Leukozyten 8.5. Thorax-Roentgen: kein Infiltrat.",
    "Akute Bronchitis, vermutlich viral.",
    "Symptomatisch: ACC akut, Hustenstiller bei Bedarf. Keine Antibiotika.",
    "Symptomatische Therapie. Wiedervorstellung bei ausbleibender Besserung oder Fieber.", 
    ["Patientendaten", "Symptome und Verlauf", "Befund", "Diagnostik", "Diagnose", "Therapie"],
    ["Akute Bronchitis", "viraler Infekt", "Husten", "Raeuspern", "Sputum"],
    "35-jaehriger Patient mit akuter Bronchitis bei viralem Infekt. Symptomatische Therapie, keine Antibiose.")

add("Pyelonephritis in Schwangerschaft", "Verfassen Sie einen Arztbrief fuer eine 28-jaehrige Schwangere (28. SSW) mit Pyelonephritis.",
    "28 Jahre, weiblich, 65 kg, BMI 23, Schwangerschaft 28. SSW",
    "Seit 2 Tagen Fieber 39.0, Schmerzen rechte Flanke, Dysurie, Schuttelfrost.",
    "BS 38.9, RR 115/75, Klopfschmerz rechte Flanke, Abdomen gravid.",
    "CRP 180, Leukozyten 12.0, Urin: Leukos ++, Nitrit pos. Sono: Harnstau rechts Grad I.",
    "Akute Pyelonephritis rechts in der Schwangerschaft.",
    "Cefuroxim 1.5 g 3x/Tag i.v., Paracetamol bei Fieber. Tokolyse bei Wehentaetigkeit.",
    "Nach 48h klinischer Besserung Umstellung auf orales Cefuroxim 500 mg 2x/Tag fuer 10 Tage. Sono-Kontrolle. Vorstellung Gynaekologie.",
    ["Patientendaten und SSW", "HWI-Symptome", "Befund", "Labor und Sono", "Diagnose", "Therapie", "Entlassplan"],
    ["Pyelonephritis in SS", "Harnstau", "Schwangerschaft", "Tokolyse"],
    "Schwangere (28. SSW) mit Pyelonephritis rechts. Cefuroxim i.v., Fieber ruecklaeufig. Orale Antibiose fuer 10 Tage.")

add("Akute Sinusitis maxillaris", "Verfassen Sie einen Arztbrief fuer eine 42-jaehrige Patientin mit akuter Sinusitis.",
    "42 Jahre, weiblich, 62 kg, BMI 21",
    "Seit 1 Woche Schnupfen, dann eitriger Ausfluss aus der Nase, Gesichtsschmerz rechts, Fieber 38.0, Kopfschmerzen.",
    "BS 37.8, Nasenschleimhaut gerötet, eitrige Sekretion rechts. Druckschmerz Kieferhohle rechts.",
    "CRP 25. Roentgen-NNH: Verschattung Kieferhoehle rechts.",
    "Akute Sinusitis maxillaris rechts.",
    "Dekongestive Nasenspray (Otriven) fuer max. 7 Tage, Doxycyclin 200 mg/Tag fuer 7 Tage.",
    "Doxycyclin, nasale Pflege. Bei fehlender Besserung nach 7 Tagen HNO-Vorstellung.",
    ["Patientendaten", "Symptome und Verlauf", "Befund", "Diagnostik", "Diagnose", "Therapie"],
    ["Sinusitis = Nasennebenhoehlenentzuendung", "NNH-Verschattung", "Kieferhoehle", "Dekongestiva"],
    "42-jaehrige Patientin mit akuter Sinusitis maxillaris rechts (NNH-Verschattung, eitrige Sekretion). Doxycyclin, Dekongestiva.")

add("Notfallmassnahme: Cardiogener Schock", "Verfassen Sie einen Arztbrief fuer einen 66-jaehrigen Patienten mit cardiogenem Schock bei Myokardinfarkt.",
    "66 Jahre, maennlich, 78 kg",
    "Kollaps zu Hause. Reanimation durch Ehemann. Notarzt: Kammerflimmern, Defibrillation. EKG: ST-Hebungen.",
    "Bewusstlos, HF 130, RR 80/45, SaO2 90%, Kaltschweissig. Lunge: RG basal.",
    "Troponin 8000 ng/L. Koronarangiographie: Hauptstammstenose + Dreigefasserkrankung.",
    "Cardiogener Schock bei akutem Vorderwandinfarkt + Kammerflimmern.",
    "Reanimation, IABP, PTCA + DES. Katecholamine (Noradrenalin). Beatmung.",
    "Nach Stabilisierung: Echokardiographie, ASS + Ticagrelor, Statin, ACE-Hemmer. Kardiale Rehabilitation. ICD-Praevention erwaegen.",
    ["Reanimation und Erstversorgung", "Befund", "Koronarstatus", "Diagnose", "Intensivtherapie", "Weiterer Plan"],
    ["cardigener Schock", "Katecholamine", "IABP = intraaortale Ballonpumpe", "Reanimation"],
    "Patient mit cardiogenem Schock bei Vorderwandinfarkt und Kammerflimmern. Reanimation, IABP, PTCA+DES. Auf Intensivstation stabilisiert.")

add("Pankreaskarzinom Verdacht", "Verfassen Sie einen Arztbrief fuer einen 70-jaehrigen Patienten mit Pankreaskopfkarzinom.",
    "70 Jahre, maennlich, 65 kg, BMI 22 (10 kg Verlust)",
    "Seit 3 Monaten schmerzloser Ikterus, Gewichtsverlust, Appetitlosigkeit, heller Stuhl, dunkler Urin. Starker Raucher.",
    "Ikterische Skleren und Haut. Leber druckschmerzhaft tastbar. Bauch weich.",
    "Bilirubin 8.2, AP 280, GGT 350, CA 19-9 450. CT: Pankreaskopfkarzinom 3.5 cm, Lebermetastasen.",
    "Pankreaskopfkarzinom mit Lebermetastasen (Stadium IV).",
    "Palliative Therapie: Chemotherapie (Gemcitabin + nab-Paclitaxel), Stent bei Gallengangstenose.",
    "Palliative Chemotherapie, Schmerztherapie, Ernaehrungsberatung. Vorstellung Onkologie.",
    ["Patientendaten", "Symptome und Risikofaktoren", "Befund", "Bildgebung und Tumorwerte", "Diagnose und Stadium", "Therapieplan"],
    ["Pankreaskarzinom", "CA 19-9 = Tumormarker", "Ikterus = Gelbsucht", "palliativ"],
    "Patient mit Pankreaskopfkarzinom Stadium IV bei Diagnose. Palliative Chemotherapie eingeleitet.")

add("Lungenentzuendung bei COPD", "Verfassen Sie einen Arztbrief fuer 66-jaehrigen mit COPD-Pneumonie.",
    "66 Jahre, maennlich, 70 kg, BMI 25",
    "Seit 2 Tagen Fieber 39, purulenter Auswurf, Dyspnoe in Ruhe. COPD GOLD III, letzte Exazerbation vor 6 Monaten.",
    "BS 39.2, RR 145/85, HF 105, AF 26/min, SaO2 86%. Auskultation: RG beidseits basal, Giemen.",
    "CRP 250, PCT 4.5. BGA: pH 7.34, pCO2 52, pO2 62. Thorax-CT: bilaterale Infiltrate.",
    "Ae-COP mit Pneumonie. Respiratorische Insuffizienz (Typ 2).",
    "Piperacillin/Tazobactam 4.5g 3x/Tag, Prednisolon 40 mg, Sauerstoff, Bronchodilatation.",
    "Orale Antibiose fuer 7 weitere Tage, inhalative Dauertherapie, Sauerstoff-Langzeittherapie. RSV-Impfung empfohlen.",
    ["Patientendaten", "Vorerkrankungen", "Infektzeichen und Lungenstatus", "Labor, BGA, Bildgebung", "Diagnose", "Intensivtherapie", "Entlassplanung"],
    ["Ae-COP", "CAP", "Piperacillin/Tazobactam", "respiratorische Insuffizienz"],
    "Patient mit Ae-COP und Pneumonie. Piperacillin/Tazobactam, Prednisolon, Sauerstoff. Resp. Insuffizienz Typ 2.")

add("Akute Divertikulitis", "Verfassen Sie einen Arztbrief fuer eine 60-jaehrige Patientin mit akuter Divertikulitis.",
    "60 Jahre, weiblich, 72 kg",
    "Seit 3 Tagen linke Unterbauchschmerzen, Fieber bis 38.5, Verstopfung, Uebelkeit.",
    "BS 38.2, Abdomen: Druckschmerz linker Unterbauch, Abwehrspannung, Darmgeraeusche abgeschwaecht.",
    "CRP 120, Leukozyten 14.0. CT: Sigmadivertikulitis mit perikolischer Entzuendung (Hinchey Ia).",
    "Akute Divertikulitis (Hinchey Ia).",
    "Metronidazol + Ciprofloxacin i.v., NPO, Fluessigkeit.",
    "Nach Besserung: flüssige Kost, orale Antibiose fuer 7 Tage, Koloskopie nach 6 Wochen.",
    ["Patientendaten", "Schmerz- und Fieberanamnese", "Befund", "CT und Labor", "Diagnose und Klassifikation", "Therapie"],
    ["Divertikulitis", "Hinchey-Klassifikation", "Sigma = Colon sigmoideum"],
    "Patientin mit Sigmadivertikulitis Hinchey Ia. Metronidazol+Ciprofloxacin, NPO. Koloskopie nach 6 Wochen.")

add("Hypertonie-Entgleisung", "Verfassen Sie einen Arztbrief fuer eine 55-jaehrige Patientin mit hypertensiver Krise.",
    "55 Jahre, weiblich, 85 kg, BMI 31",
    "Seit Tagen Kopfschmerzen, Sehstoerungen, Nasenbluten. RR 220/110 gemessen. Bekannte Hypertonie, nimmt Medis unregelmaessig.",
    "RR 210/105, HF 95. Augenhintergrund: Fundus hypertonicus II. Herz: betonter A2-Ton.",
    "Kreatinin 1.2, Kalium 3.5. EKG: Linkshypertrophie. Echo: keine LVH.",
    "Hypertensive Krise ohne akute Zielorganschaeden.",
    "Urapidil 25 mg i.v., dann orale Einstellung.",
    "Ramipril 5 mg + Amlodipin 5 mg. RR-Protokoll. Diabetberatung. RR-Kontrolle in 1 Woche.",
    ["Patientendaten", "Symptome und RR-Anamnese", "Befund", "Diagnose", "Akuttherapie", "Dauertherapie"],
    ["Hypertensive Krise", "Fundus hypertonicus", "RR-Protokoll", "ACE-Hemmer"],
    "Patientin mit hypertensiver Krise (RR 210/105). Urapidil i.v., dann Ramipril+Amlodipin. Kontrolle in 1 Woche.")

add("Verdacht auf Meningitis", "Verfassen Sie einen Arztbrief fuer einen 22-jaehrigen Patienten mit Meningitis-Verdacht.",
    "22 Jahre, maennlich, 72 kg, BMI 23",
    "Seit 12h Fieber 39.5, starke Kopfschmerzen, Nackensteifigkeit, Lichtscheu, Erbrechen. Kein Ausschlag.",
    "BS 39.4, HF 110, RR 120/70. Nackensteifigkeit, Kernig-Zeichen positiv, Meningsimus. Haut: keine Petschien.",
    "CRP 150, Leukozyten 15. Liquor: trueb, Zellen 1500/mcl (90% Neutrophile), Protein 1.2 g/L, Glukose 30 mg/dL.",
    "Akute bakterielle Meningitis. Kein Ausschlag (kein Meningokokken-V.a.).",
    "Dexamethason 10 mg i.v., Ceftriaxon 4 g + Ampicillin 2 g i.v., Isolierung.",
    "Antibiose fuer 7-10 Tage je nach Erreger. Liquorkontrolle. Impfung nach Genesung.",
    ["Patientendaten", "Meningitis-Symptome", "Befund", "Liquorbefund", "Diagnose", "Akuttherapie"],
    ["Meningitis", "Liquorpunktion", "Nackensteifigkeit", "Kernig-Zeichen", "Antibiose"],
    "Patient mit akuter bakterieller Meningitis. Liquor: neutrophile Pleozytose. Dexamethason, Ceftriaxon, Ampicillin.")

add("Akute Appendizitis", "Verfassen Sie einen Arztbrief fuer einen 25-jaehrigen Patienten mit Appendizitis.",
    "25 Jahre, maennlich, 75 kg, BMI 23",
    "Seit 18h periumbilikale Schmerzen, dann rechter Unterbauch. Uebelkeit, Erbrechen, Appetitlosigkeit.",
    "BS 37.9, Abdomen: Druckschmerz rechter Unterbauch, Abwehrspannung, McBurney-Zeichen positiv, Psoaszeichen pos.",
    "CRP 85, Leukozyten 14.5. Sono: Appendix 8mm, nicht komprimierbar, Kokarde.",
    "Akute Appendizitis.",
    "Lapaparoskopische Appendektomie, perioperativ Ceftriaxon + Metronidazol.",
    "Stuhlgang, normaler Kostaufbau, Nahtkontrolle. Keine schweren koerperliche Aktivitaet fuer 2 Wochen.",
    ["Patientendaten", "Schmerz-Symptome", "Befund", "Sono und Labor", "Diagnose", "OP", "Postoperativer Verlauf"],
    ["Appendizitis = Blinddarmentzuendung", "McBurney-Punkt", "Appendektomie"],
    "Patient mit akuter Appendizitis. Laparoskopische Appendektomie. Unkomplizierter Verlauf.")

add("Pleuraerguss bei Herzinsuffizienz", "Verfassen Sie einen Arztbrief fuer eine 74-jaehrige Patientin mit Pleuraerguss bei Rechtsherzinsuffizienz.",
    "74 Jahre, weiblich, 80 kg, BMI 29",
    "Seit 2 Wochen zunehmende Dyspnoe, Orthopnoe, geschwollene Beine, 5 kg Gewichtszunahme. Bekannte Herzinsuffizienz NYHA III.",
    "RR 150/90, HF 95, AF 24, SaO2 91%. Halsvenen gestaut, RG beidseits basal bis mittig, Beinoedeme bis Knie.",
    "NT-proBNP 5500 pg/mL. Thorax-Roentgen: Kardiomegalie, bds. Pleuraerguss. Echo: LVEF 40%, dilatatierten Ventrikel.",
    "Dekompensierte Herzinsuffizienz NYHA III mit Pleuraerguss.",
    "Furosemid 40 mg i.v., Sauerstoff, ACE-Hemmer, Pleurapunktion bei Dyspnoe.",
    "Furosemid p.o. 40 mg, ACE-Hemmer, Beta-Blocker, Gewichtskontrolle. Kochsalzarme Diat. Kardiologische Kontrolle.",
    ["Patientendaten", "Symptome der Dekompensation", "Befund", "Echo, NT-proBNP, Roentgen", "Diagnose", "Therapie"],
    ["Herzinsuffizienz", "NT-proBNP", "Pleuraerguss", "Oedeme", "Dekompensation"],
    "Patientin mit kardial dekompensierter Herzinsuffizienz NYHA III. Furosemid, ACE-Hemmer, Pleurapunktion.")

add("Thyreotoxische Krise", "Verfassen Sie einen Arztbrief fuer eine 38-jaehrige Patientin mit thyreotoxischer Krise.",
    "38 Jahre, weiblich, 50 kg, BMI 18",
    "Seit 24h Fieber bis 40.0, Herzrasen, Verwirrtheit, Erbrechen, Durchfall. Bekannte Hyperthyreose, Therapie eigenmaechtig abgesetzt.",
    "BS 39.8, HF 160/min irregular, RR 100/60, Bewusstseinsgetruebt. Struma, Exophthalmus.",
    "TSH < 0.01, fT3 15, fT4 5.8. EKG: Tachykardie, Vorhofflimmern.",
    "Thyreotoxische Krise bei Morbus Basedow. Vorhofflimmern.",
    "Thiamazol 60 mg p.o., Propranolol 40 mg p.o., Dexamethason 8 mg i.v., Jodid-Loesung, Intensivstation.",
    "Thiamazol 20 mg/Tag, Betablocker. Vorstellung Nuklear-medizin fuer Radiojodtherapie.",
    ["Patientendaten", "Symptome der Krise", "Befund", "Schilddruesenlabor", "Diagnose", "Intensivtherapie"],
    ["thyreotoxische Krise", "Morbus Basedow", "Thiamazol", "Jodid", "Vorhofflimmern"],
    "Patientin mit thyreotoxischer Krise. Thiamazol, Jodid, Dexamethason, Betablocker. Intensivueberwachung.")

add("Okulare Migraene", "Verfassen Sie einen Arztbrief fuer eine 32-jaehrige Patientin mit Migraene mit Aura.",
    "32 Jahre, weiblich, 58 kg, BMI 21",
    "Seit Jahren wiederkehrende Kopfschmerzen einseitig mit Uebelkeit, Lichtscheu. Jetzt erstmals visuelle Aura (Zickzacklinien, Skotom).",
    "Neurologisch unauffaellig. Keine Paresen. Sehkraft normal.",
    "CCT: unauffaellig. MRT: unauffaellig.",
    "Migraene mit Aura (visuell).",
    "Akut: Sumatriptan 50 mg p.o. Prophylaxe: Metoprolol 50 mg.",
    "Metoprolol 50 mg 1x/Tag. Kopfschmerztagebuch. Triggervermeidung. Neurologische Vorstellung.",
    ["Patientendaten", "Kopfschmerzcharakteristika", "Aura", "Bildgebung", "Diagnose", "Akut- und Prophylaxetherapie"],
    ["Migraene mit Aura", "Skotom = Gesichtsfeldausfall", "Triptane", "Metoprolol"],
    "Patientin mit Migraene mit visueller Aura. Sumatriptan akut, Metoprolol prophylaktisch. Kopfschmerztagebuch.")

add("HWS-Distorsion (Schleudertrama)", "Verfassen Sie einen Arztbrief fuer einen 30-jaehrigen Patienten mit HWS-Distorsion.",
    "30 Jahre, maennlich, 70 kg, BMI 22",
    "Vor 2 Tagen Auffahrunfall mit PKW bei 50 km/h. Seitdem Nakkenschmerzen und Bewegungseinschraenkung, Kopfschmerzen.",
    "HWS: schmerzhafte Bewegungseinschraenkung, verspannte Nackenmuskulatur. Keine radikulaere Symptome. Neuro o.B.",
    "Roentgen HWS: keine Fraktur, keine Instabilitaet, physiologische Lordose aufgehoben.",
    "HWS-Distorsion Grad I (Schleudertrauma).",
    "NSAR (Diclofenac), Waerme, vorsichtige Mobilisation, keine Schonhaltung.",
    "Fortfuehrung der Bewegungstherapie. Physiotherapie. Bei Persistenz nach 2 Wochen Vorstellung Orthopadie.",
    ["Patientendaten", "Unfallhergang", "Befund", "Roentgen", "Diagnose", "Therapie"],
    ["HWS-Distorsion", "Schleudertrauma", "Nackenschmerz", "Mobilisation"],
    "HWS-Distorsion Grad I nach Auffahrunfall. Keine Fraktur. NSAR, Mobilisation, Physiotherapie.")

add("Akute Perikarditis", "Verfassen Sie einen Arztbrief fuer einen 40-jaehrigen Mann mit akuter Perikarditis.",
    "40 Jahre, maennlich, 78 kg, BMI 24",
    "Seit einem Tag stechende Brustschmerzen retrosternal, im Liegen und beim Atmen staerker, sitzend besser.",
    "RR 120/75, HF 95, BS 37.5. Perikardreiben auskultierbar.",
    "EKG: diffuse ST-Hebungen, PR-Senkung. CRP 65. Troponin normal. Echo: minimale Perikarderguss.",
    "Akute Perikarditis, vermutlich viral.",
    "Ibuprofen 600 mg 3x/Tag, Colchicin 0.5 mg 2x/Tag.",
    "Ibuprofen ausschleichen ueber 2-3 Wochen, Colchicin fuer 3 Monate. Kein Sport fuer 4 Wochen.",
    ["Patientendaten", "Brustschmerzcharakter", "Befund", "EKG und Echo", "Diagnose", "Therapie"],
    ["Perikarditis = Herzbeutelentzuendung", "Perikardreiben", "Colchicin", "Ibuprofen"],
    "Patient mit akuter Perikarditis. Ibuprofen + Colchicin. ST-Hebungen und Perikardreiben ruecklaeufig.")

print(f"Total: {len(d)}")
json.dump(d, open('../src/data/fspWriting.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved")
