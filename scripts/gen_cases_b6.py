import json, sys

d = json.load(open('../src/data/fspCases.json','r',encoding='utf-8'))
print(f'Starting: {len(d)}')

n = len(d)

def add(title, setting, age, gender, complaint, hist, meds, allergies, pastHx, famHx, socialHx, tasks, mustask, reds, phrases, d2d, rubric, tags):
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

add("Schilddruesenknoten (Struma nodosa)", "clinic", "48", "weiblich",
    "Klossgefuehl im Hals",
    "Druckgefuehl im Hals, Knoten ertastet.",
    "Keine", "Keine", "Keine", "Knoten bei Mutter", "Pflegekraft",
    ["Tasten Sie die Schilddruese", "Besprechen Sie Sono und Punktion"],
    ["Gewichtsveraenderung?", "Herzrasen?"],
    ["Struma nodosa, euthyreot"],
    ["Wir machen eine Sonographie.", "Ggf. Punktion des Knotens."],
    "Struma nodosa. Sono und FNP.",
    {"historyTaking": "Knoten, Funktion", "redFlags": "Schnelles Wachstum", "patientLanguage": "Knoten erklaeren", "structure": "Knoten -> Sono -> Punktion", "medicalLogic": "Struma-Abklarung", "germanAccuracy": "Struma, FNP"},
    ["schilddruese", "knoten", "struma"])

add("Guertelrose (Herpes Zoster)", "clinic", "68", "maennlich",
    "Blaeschen mit Schmerzen am Brustkorb",
    "Brennende Schmerzen, seit gestern Blaeschen. Z.n. Chemo vor 2 Jahren.",
    "Keine", "Keine", "Z.n. Lymphom-Chemo", "Keine", "Rentner",
    ["Fragen Sie nach Haut und Schmerz", "Erklaeren Sie Zoster", "Verschreiben Sie Virostatika"],
    ["Windpocken gehabt?", "Immunsuppression?"],
    ["Herpes Zoster bei Immobilisation"],
    ["Das ist Guertelrose.", "Aciclovir und Schmerzmittel."],
    "Zoster thorakal. Aciclovir, Analgesie.",
    {"historyTaking": "Haut, Schmerz, Immunstatus", "redFlags": "Zoster ophthalmicus", "patientLanguage": "Zoster erklaeren", "structure": "Haut -> Schmerz -> Virostatika", "medicalLogic": "Herpes Zoster", "germanAccuracy": "Zoster, Aciclovir"},
    ["haut", "zoster", "infekt", "schmerz"])

add("Harnwegsinfekt bei Mann (kompliziert)", "clinic", "70", "maennlich",
    "Brennen beim Wasserlassen, Fieber",
    "Brennen, Harndrang, Fieber 38.5. BPH bekannt.",
    "Tamsulosin", "Keine", "BPH", "Keine", "Rentner",
    ["Fragen Sie nach HWI-Symptomen", "Erklaeren Sie komplizierten HWI"],
    ["Fieber?", "Flankenschmerz?", "Prostata bekannt?"],
    ["HWI bei Mann = kompliziert", "Prostatitis moeglich"],
    ["Bei Maennern ist ein HWI kompliziert.", "Sie brauchen Antibiotikum."],
    "Komplizierter HWI bei BPH. Antibiose.",
    {"historyTaking": "Symptome, Prostata", "redFlags": "Urosepsis", "patientLanguage": "HWI bei Mann", "structure": "Symptome -> HWI -> Antibiose", "medicalLogic": "Komplizierter HWI", "germanAccuracy": "HWI, kompliziert"},
    ["HWI", "prostata", "fieber"])

add("Tubargraviditaet (ektope SS)", "emergency", "30", "weiblich",
    "Unterbauchschmerz, Schmierblutung, SS pos.",
    "Schmerzen links, Schmierblutung, SS pos. Periode vor 7 Wochen.",
    "Keine", "Keine", "Keine", "Keine", "Angestellte",
    ["Fragen Sie nach Schmerz und SS", "Erklaeren Sie EU-Verdacht", "Planen Sie Sono"],
    ["Fruehere EU?", "Entzuendung?", "Schulterschmerzen?"],
    ["Ektope SS: Schmerz + Blutung + pos. SS"],
    ["Die SS ist vielleicht im Eileiter.", "Sofort Ultraschall."],
    "V.a. Tubargraviditaet. Sono, beta-hCG, OP.",
    {"historyTaking": "Schmerz, Blutung, SS", "redFlags": "Ruptur", "patientLanguage": "EU erklaeren", "structure": "Schmerz -> SS -> EU -> Sono", "medicalLogic": "Ektope SS", "germanAccuracy": "Tubargraviditaet"},
    ["gynaekologie", "ektope", "schwangerschaft", "notfall"])

add("Chronische Niereninsuffizienz", "clinic", "68", "weiblich",
    "Muedigkeit, Beinschwellung, Juckreiz",
    "Seit Monaten zunehmende Muedigkeit, geschwollene Beine, Hautjucken. Bekannter Diabetes und Hypertonie.",
    "Metformin, Ramipril", "Keine", "DM Typ 2, Hypertonie", "Keine", "Rentnerin",
    ["Fragen Sie nach Symptomen", "Prufen Sie Oedeme und Haut", "Erklaeren Sie die Niereninsuffizienz", "Besprechen Sie Diaet und Therapie"],
    ["Wie viel trinken Sie?", "Haben Sie Juckreiz?", "Wie ist der Urin?"],
    ["Fortgeschrittene Niereninsuffizienz bei DM + Hypertonie", "Dialysepflichtigkeit absehbar"],
    ["Die Nieren arbeiten nicht mehr richtig.", "Wir muessen die Nierenwerte kontrollieren und die Medikamente anpassen."],
    "Patientin mit CKD Stadium 4 bei diabetischer Nephropathie. Konservative Therapie, Dialysevorbereitung.",
    {"historyTaking": "Nierensymptome, DM, Hypertonie", "redFlags": "Hyperkaliaemie, Uraemie", "patientLanguage": "Niereninsuffizienz erklaeren", "structure": "Symptome -> Ursache -> Nierenwerte -> Therapie", "medicalLogic": "CKD-Management", "germanAccuracy": "Niereninsuffizienz, CKD, Dialyse"},
    ["niere", "chronisch", "diabetes", "insuffizienz"])

add("Psoriasis (Schuppenflechte)", "clinic", "42", "maennlich",
    "Rote schuppende Stellen an Ellenbogen und Knien",
    "Seit Jahren rote, silbrig schuppende Plaques an den Streckseiten der Ellenbogen und Knie. Juckreiz. Nagelveraenderungen.",
    "Keine", "Keine", "Keine", "Psoriasis bei Vater", "Buerokaufmann",
    ["Fragen Sie nach Hautbefund und Verlauf", "Erklaeren Sie Psoriasis", "Besprechen Sie topische Therapie"],
    ["Hautprobleme in der Familie?", "Gelenkschmerzen? (Psoriasis-Arthritis)"],
    ["Psoriasis vulgaris mit typischen Plaques", "Nagelbeteiligung"],
    ["Das ist Schuppenflechte.", "Cortisoncreme und spezielle Pflege helfen."],
    "Patient mit Psoriasis vulgaris. Topische Kortikoide, Vitamin-D-Analoga.",
    {"historyTaking": "Haut, Gelenke, Familie", "redFlags": "Psoriasis-Arthritis", "patientLanguage": "Psoriasis erklaeren", "structure": "Haut -> Gelenke -> Therapie", "medicalLogic": "Psoriasis-Management", "germanAccuracy": "Psoriasis, Plaques"},
    ["haut", "psoriasis", "chronisch", "juckreiz"])

add("Lymphknotenschwellung bei Infekt", "clinic", "28", "weiblich",
    "Geschwollene Lymphknoten am Hals und Fieber",
    "Seit 3 Tagen Halsschmerzen, geschwollene Lymphknoten beidseits am Hals, Fieber bis 38.5, Muedigkeit. Mandeln gerotet und geschwollen.",
    "Keine", "Keine", "Keine", "Keine", "Lehrerin",
    ["Fragen Sie nach Hals und Lymphknoten", "Fragen Sie nach Infektzeichen", "Differenzieren Sie zu Mononukleose", "Beruhigen Sie"],
    ["Haben Sie Schluckbeschwerden?", "Hatten Sie schon eine Angina?", "Ist der Hals sehr schmerzhaft?"],
    ["Zervikale Lymphadenitis bei Tonsillitis", "V. a. Streptokokken-Angina oder EBV"],
    ["Die Lymphknoten sind geschwollen, weil der Koerper gegen die Infektion kaempft.", "Wenn die Mandeln eitrig sind, brauchen Sie Antibiotikum."],
    "Patientin mit Tonsillitis und reaktiven Lymphknoten. Antibiose bei Streptokokken-Nachweis.",
    {"historyTaking": "Hals, Fieber, Lymphknoten", "redFlags": "Abszess, Mononukleose-Milzruptur", "patientLanguage": "Lymphknoten erklren", "structure": "Hals -> Lymphknoten -> Therapie", "medicalLogic": "Tonsillitis, Lymphadenitis", "germanAccuracy": "Tonsillitis, Lymphknoten"},
    ["infekt", "lymphknoten", "hals", "fieber"])

add("Magenulkus durch Helicobacter", "clinic", "52", "weiblich",
    "Magenschmerzen nach dem Essen, Sodbrennen",
    "Seit Wochen Oberbauchschmerzen 1-2 Stunden nach dem Essen. Sodbrennen. Hatte schon frueher ein Magengeschwuer. Kein Teerstuhl.",
    "Keine", "Keine", "Z.n. Ulcus ventriculi", "Magenkrebs bei Grossvater", "Hausfrau",
    ["Fragen Sie nach der zeitlichen Abhaengigkeit", "Fragen Sie nach Alarmzeichen", "Besprechen Sie die Oesophagogastroduodenoskopie", "Erklaeren Sie Helicobacter-Eradikation"],
    ["Haben Sie Blut erbrochen oder Teerstuhl?", "Hatten Sie schon eine Magenspiegelung?"],
    ["Wiederkehrende Ulkussymptomatik", "Helicobacter-Infektion wahrscheinlich"],
    ["Ein Magengeschwuer wird haeufig durch das Bakterium Helicobacter verursacht.", "Eine Magenspiegelung mit Gewebeprobe gibt Klarheit."],
    "Patientin mit Ulcus ventriculi. Oesophagogastroduodenoskopie und H.-pylori-Testung.",
    {"historyTaking": "Schmerz, Ulkus, Alarmzeichen", "redFlags": "GI-Blutung", "patientLanguage": "Ulcus und Helicobacter erklren", "structure": "Schmerz -> Magen -> Helicobacter -> Eradikation", "medicalLogic": "Ulcus ventriculi, Eradikation", "germanAccuracy": "Ulcus, Helicobacter, Eradikation"},
    ["bauchschmerz", "ulkus", "helicobacter", "magen"])

add("Haemorrhoiden", "clinic", "44", "mannlich",
    "Blut auf dem Toilettenpapier, Juckreiz am After",
    "Seit Wochen hellrotes Blut auf dem Klopapier, Juckreiz und Druckgefuehl am After. Viel sitzende Taetigkeit und harter Stuhl.",
    "Keine", "Keine", "Keine", "Keine", "Softwareentwickler, viel Sitzen",
    ["Fragen Sie nach der Blutungsquelle", "Fragen Sie nach Stuhlgewohnheiten", "Erklaeren Sie Haemorrhoiden", "Besprechen Sie konservative Therapie"],
    ["Haben Sie Blut auf dem Papier oder im Stuhl?", "Haben Sie Schmerzen beim Stuhlgang?"],
    ["Helles Blut auf dem Papier spricht fuer Haemorrhoiden", "Ausschluss einer anderen Blutungsquelle"],
    ["Das Blut kommt von vergroesserten Aderpolstern am After.", "Meist hilft weicher Stuhl und Salben."],
    "Patient mit Haemorrhoiden Grad I-II. Konservative Therapie: Ballaststoffe, Sitzbaeder, Salben.",
    {"historyTaking": "Blutung, Stuhl, Schmerz", "redFlags": "Tumorausschluss bei Risikopatienten", "patientLanguage": "Haemorrhoiden erklaeren", "structure": "Blutung -> Stuhl -> Haemorrhoiden -> Therapie", "medicalLogic": "Haemorrhoidalleiden", "germanAccuracy": "Haemorrhoiden, Proktologie"},
    ["proktologie", "blutung", "haemorrhoiden", "stuhlgang"])

add("Claviculafraktur beim Kind", "emergency", "7", "Kind",
    "Sturz auf die Schulter, Schluesselbein geschwollen",
    "Beim Spielen auf die rechte Schulter gestuerzt. Schmerzen und Schwellung ueber dem Schluesselbein. Kann den Arm nicht heben.",
    "Keine", "Keine", "Keine", "Keine", "Schueler",
    ["Fragen Sie nach dem Sturzmechanismus", "Prufen Sie Durchblutung und Sensibilitaet", "Erklaeren Sie die haeufigste Fraktur im Kindesalter", "Besprechen Sie die konservative Therapie"],
    ["Konnen Sie die Finger bewegen?", "Haben Sie Taubheitsgefuehl?"],
    ["Klassische Kleeblattfraktur bei Kindern", "Sehr gute Heilungstendenz"],
    ["Ein Bruch des Schluesselbeins heilt bei Kindern von allein.", "Eine Schlinge fuer ein paar Wochen reicht aus."],
    "Kind mit Claviculafraktur rechts. Konservative Therapie mit Rucksackverband.",
    {"historyTaking": "Sturz, Schmerz, Funktion", "redFlags": "Offene Fraktur, Gefaessverletzung", "patientLanguage": "Claviculafraktur im Kindesalter erklaeren", "structure": "Sturz -> Schluesselbein -> Schlinge -> Heilung", "medicalLogic": "Claviculafraktur Kind", "germanAccuracy": "Clavicula, Fraktur"},
    ["fraktur", "kind", "schulter", "clavicula"])

add("Plazentaretention (Nachblutung)", "ward", "32", "weiblich",
    "Starke Blutung nach Geburt, Plazenta nicht vollstaendig",
    "Nach Spontangeburt vor 6 Stunden staerkere Blutung als ueblich. Bei Untersuchung Plazentaretention vermutet. Kreislauf stabil.",
    "Oxytocin", "Keine", "Spontangeburt (36. SSW)", "Keine", "Friseurin",
    ["Fragen Sie nach der Geburt und Blutung", "Bewerten Sie den Blutverlust", "Erklaeren Sie die Plazentaretention", "Besprechen Sie die manuelle Nachtoastung"],
    ["Wie viele Vorlagen haben Sie gewechselt?", "Wurde die Plazenta vollstaendig geboren?"],
    ["Postpartale Blutung bei Plazentaretention", "Manuelle Austastung noetig"],
    ["Die Plazenta ist nicht vollstaendig und verursacht die Blutung.", "Wir muessen unter Narkose kontrollieren."],
    "Patientin mit postpartaler Blutung bei Plazentaretention. Manuelle Austastung in Narkose.",
    {"historyTaking": "Geburt, Blutverlust, Plazenta", "redFlags": "H Shock, Verbrauchskoagulopathie", "patientLanguage": "Plazentaretention erklaeren", "structure": "Geburt -> Blutung -> Plazenta -> Austastung", "medicalLogic": "Postpartale Blutung", "germanAccuracy": "Plazentaretention, postpartal"},
    ["gynaekologie", "geburt", "blutung", "postpartal"])

add("Zervixkarzinom-Frueherkennung", "clinic", "39", "weiblich",
    "Pap-Abstrich auffaellig (Pap III), will wissen was das bedeutet",
    "Routinemassiger Pap-Abstrich ergab Pap III. Keine Beschwerden. Keine Zwischenblutungen. Sexuell aktiv, 3 Kinder.",
    "Keine", "Keine", "Keine", "Gebaermutterhalskrebs bei Schwester", "Krankenschwester",
    ["Erklaeren Sie die Pap-Klassifikation", "Fragen Sie nach Risikofaktoren", "Besprechen Sie die weiteren Schritte", "Ermutigen Sie zur Kolposkopie"],
    ["Hatten Sie schon auffaellige Abstriche?", "Wurden Sie gegen HPV geimpft?"],
    ["Pap III = auffaelliger Abstrich, keine Krebsdiagnose", "HPV-assoziierte Veraenderung moeglich"],
    ["Ein Pap III bedeutet, dass einzelne Zellen auffaellig sind.", "Zur Sicherheit machen wir eine Spiegelung des Gebaermutterhalses."],
    "Patientin mit Pap III. Kolposkopie und ggf. Biopsie empfohlen.",
    {"historyTaking": "Abstrich, Risikofaktoren, Impfung", "redFlags": "Sichtbare Laesion", "patientLanguage": "Pap-Abstrich und Krebsfrueherkennung erklren", "structure": "Befund -> Pap -> Kolposkopie -> Therapie", "medicalLogic": "Zervixkarzinom-Frueherkennung", "germanAccuracy": "Pap, Kolposkopie, Zervix"},
    ["gynaekologie", "pap", "vorsorge", "HPV"])

print(f"Total now: {len(d)}")
json.dumps(d, ensure_ascii=False)
json.dump(d, open('../src/data/fspCases.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print("Saved")
