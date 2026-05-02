import json

items = []
n = [0]  # mutable counter

def make(title, setting, age, gender, complaint, hist, meds, allergies, pastHx,
         famHx, socialHx, tasks, must_ask, reds, phrases, d2d, rubric, tags):
    n[0] += 1
    items.append({
        "id": f"fsp_c_{n[0]:03d}",
        "title": title,
        "setting": setting,
        "patientRole": {
            "age": age, "gender": gender, "chiefComplaint": complaint,
            "history": hist, "medications": meds, "allergies": allergies,
            "pastHistory": pastHx, "familyHistory": famHx, "socialHistory": socialHx
        },
        "doctorTasks": tasks,
        "mustAsk": must_ask,
        "redFlags": reds,
        "usefulPhrases": phrases,
        "doctorToDoctorSummary": d2d,
        "scoringRubric": rubric,
        "tags": tags
    })

# 1-4: Chest Pain
make(
    "Patient mit akutem Brustschmerz", "emergency",
    "58", "mannlich", "Akuter Brustschmerz seit 2 Stunden",
    "Plotzlich einsetzender, drueckender Schmerz retrosternal, in den linken Arm ausstrahlend. Begleitet von Ubelkeit und kaltem Schwitzen. Keine vergleichbare Episode zuvor.",
    "Keine regelmasigen Medikamente",
    "Keine bekannten Allergien",
    "Keine relevanten Vorerkrankungen",
    "Vater mit Herzinfarkt mit 62 Jahren",
    "Bauarbeiter, raucht 30 Zigaretten/Tag seit 35 Jahren",
    ["Fragen Sie nach Schmerzcharakter, Ausstrahlung und Beginn", "Erfragen Sie kardiovaskulare Risikofaktoren", "Klatzen Sie die Symptome in laienverstandlicher Sprache", "Erklaren Sie die nachsten diagnostischen Schritte", "Fassen Sie den Fall fur den Oberarzt zusammen"],
    ["Hatten Sie das Gefuhl, dass der Schmerz in den Arm oder Kiefer ausstrahlt?", "Hatten Sie dabei Ubelkeit oder Schwindel?", "Hatten Sie solche Schmerzen schon einmal?"],
    ["Ausstrahlung in linken Arm und Kiefer", "Kaltschweiigkeit und Ubelkeit", "Nikotinabusus und positive Familienanamnese"],
    ["Ich werde jetzt ein EKG machen und Blut abnehmen.", "Es besteht der Verdacht auf einen Herzinfarkt.", "Wir mussen schnell handeln."],
    "58-jahriger mannlicher Patient mit akutem retrosternalem Druckschmerz, Ausstrahlung in den linken Arm, Begleitsymptome Ubelkeit und Kaltschwei, Nikotinabusus, positive Familienanamnese. Verdacht auf akutes Koronarsyndrom. EKG und Troponin veranlasst.",
    {"historyTaking": "Alle kardiovaskularen Risikofaktoren erfragen", "redFlags": "Ausstrahlung, Begleitsymptome erkennen", "patientLanguage": "Komplexe Begriffe vermeiden, ruhig und klar sprechen", "structure": "Symptome -> Risikofaktoren -> Dringlichkeit", "medicalLogic": "ACS-Verdacht -> EKG + Troponin + Monitoring", "germanAccuracy": "Fachtermini korrekt verwenden"},
    ["brustschmerz", "ACS", "notfall", "kardial"]
)

make(
    "Brustschmerz bei bekannter KHK", "clinic",
    "67", "mannlich", "Wiederkehrende Brustschmerzen seit einer Woche",
    "Seit einer Woche zunehmend Brustschmerzen bei Belastung (Treppensteigen). In Ruhe keine Schmerzen. Dauer ca. 5-10 Minuten, Besserung nach Ruhe. Bekannte KHK mit Stentversorgung vor 3 Jahren.",
    "ASS 100 mg, Atorvastatin 20 mg, Ramipril 5 mg, Metoprolol 50 mg",
    "Keine Allergien",
    "Zustand nach Stent-PCI des RIVA vor 3 Jahren, arterielle Hypertonie, Hypercholesterinamie",
    "Keine relevanten kardialen Erkrankungen in der Familie",
    "Rentner, fruher Buroangestellter, Ex-Raucher seit 5 Jahren",
    ["Ermitteln Sie die genaue Symptomatik und Ausloser", "Pruefen Sie die Medikamenteneinhaltung", "Besprechen Sie die nachsten Untersuchungen", "Besprechen Sie Therapieoptionen", "Dokumentieren Sie den Verlauf furs Protokoll"],
    ["Haben Sie Ihre Medikamente regelmasig genommen?", "Wann traten die Schmerzen genau auf?", "Hatten Sie die Schmerzen auch in Ruhe?"],
    ["Zunehmende Symptomatik trotz Medikation", "Belastungsabhangigkeit als Stabilitatskriterium"],
    ["Ich mochte ein Belastungs-EKG durchfuhren.", "Bitte nehmen Sie Ihre Medikamente weiterhin regelmassig.", "Wir sollten den Verlauf engmaschig kontrollieren."],
    "67-jahriger Patient mit bekannter KHK und Z. n. Stent-PCI. Seit einer Woche zunehmende belastungsabhangige Angina pectoris. Medikation wird eingehalten. Geplante Vorstellung zur Koronarangiographie bei Verdacht auf In-Stent-Stenose oder Progredienz der KHK.",
    {"historyTaking": "Belastungsabhangigkeit und Medikamenteneinhaltung erfragen", "redFlags": "Ruheschmerz als Zeichen der Instabilitat erkennen", "patientLanguage": "Klare, einfache Erklarung zur Notwendigkeit invasiver Diagnostik", "structure": "Verlauf -> Medikation -> weitere Diagnostik", "medicalLogic": "Instabile Angina vs stabile Angina differenzieren", "germanAccuracy": "Korrekte Verwendung kardiologischer Termini"},
    ["brustschmerz", "KHK", "stent", "stabil"]
)

make(
    "Brustschmerz bei Angstpatientin", "emergency",
    "34", "weiblich", "Brustschmerz und Engegefuhl",
    "Seit einem akuten Stressereignis (Streit mit Partner) Engegefuhl in der Brust, Kribbeln in den Handen und um den Mund herum. Keine Atemnot. Hatte ahnliche Episoden fruher schon mehrmals.",
    "Keine regelmasigen Medikamente",
    "Keine",
    "Keine kardialen Vorerkrankungen. Gelegentlich Panikattacken.",
    "Keine relevanten Familienanamnesen",
    "Buroangestellte, lebt mit Partner, keine Suchtmittel",
    ["Fragen Sie nach dem akuten Ausloser", "Differenzieren Sie kardiale von psychogener Ursache", "Bewerten Sie den Schweregrad und beruhigen Sie die Patientin", "Erklaren Sie Ihre Verdachtsdiagnose", "Besprechen Sie das weitere Vorgehen"],
    ["Hatten Sie das Gefuhl, dass der Schmerz ausstrahlt?", "Hatten Sie solche Episoden fruher schon?", "Gibt es einen konkreten Ausloser?"],
    ["Atemnot begleitend", "Kribbelparasthesien als Hinweis auf Hyperventilation", "Bekannte Panikattacken in der Vorgeschichte"],
    ["Das Engegefuhl ist sehr beunruhigend, aber mein erster Eindruck ist, dass es vom Herzen kommt.", "Ihre Symptome passen zu einer Angstreaktion.", "Ich mochte trotzdem sicherheitshalber ein EKG machen."],
    "34-jahrige Patientin mit akutem Engegefuhl in der Brust nach psychischer Belastung. Keine Ausstrahlung, kein Schwindel. Bekannte Panikattacken. V. a. hyperventilationsbedingte Angstattacke. Kardiale Ursache soll durch EKG und Labor ausgeschlossen werden.",
    {"historyTaking": "Psychosozialen Ausloser aktiv erfragen", "redFlags": "Kardiale Symptome Ernst nehmen, auch bei bekannter Angststorung", "patientLanguage": "Validieren der Angst, aber entpathologisieren", "structure": "Somatisch -> psychisch -> Sicherheit schaffen", "medicalLogic": "Ausschlussdiagnostik vor Diagnose einer Angsterkrankung", "germanAccuracy": "Angemessene Differenzierung zwischen somatisch und psychisch"},
    ["brustschmerz", "angst", "hyperventilation", "panik"]
)

make(
    "Brustschmerz junger Patient", "emergency",
    "24", "mannlich", "Stechende Brustschmerzen",
    "Seit Stunden zunehmende stechende Schmerzen retrosternal, verstarkt durch tiefe Einatmung und im Liegen. Fieber bis 38.5 Grad. Kein Husten, kein Auswurf. Keine Ausstrahlung.",
    "Keine",
    "Keine",
    "Keine Vorerkrankungen",
    "Keine relevanten Herz-Kreislauf-Erkrankungen",
    "Student, gelegentlich Alkohol, Nichtraucher",
    ["Fragen Sie nach Schmerzcharakter und Atemabhangigkeit", "Erheben Sie Infektzeichen und Fieberverlauf", "Uberlegen Sie Differenzialdiagnosen", "Erklaren Sie Ihre Verdachtsdiagnose", "Besprechen Sie die nachsten Schritte"],
    ["Andert sich der Schmerz beim Atmen?", "Haben Sie Fieber gemessen?", "Konnen Sie sich an einen Ausloser erinnern?"],
    ["Stechende Schmerzen, atemabhangig", "Fieber und anhaltender Schmerz im Liegen"],
    ["Die stechenden Schmerzen beim Atmen deuten eher auf die Lungenhaut oder den Herzbeutel hin.", "Ich werde ein EKG, eine Blutuntersuchung und ein Rontgen des Brustkorbs machen."],
    "24-jahriger Patient mit atemabhangigen stechenden Thoraxschmerzen und Fieber. Keine Ausstrahlung, keine kardialen Risikofaktoren. V. a. Perikarditis oder Pleuritis. EKG, Entzundungsparameter und Rontgen-Thorax veranlasst.",
    {"historyTaking": "Atemabhangigkeit und Fieberanamnese", "redFlags": "Perikarderguss, Myokarditis als mogliche Komplikation", "patientLanguage": "Anatomische Lage von Herzbeutel und Lungenhaut laienverstandlich erklaren", "structure": "Schmerz -> Infekt -> kardiopulmonale Abklarung", "medicalLogic": "Perikarditis vs. Pleuritis vs. Lungenembolie differenzieren", "germanAccuracy": "Fachtermini zu Perikarditis und Pleuritis korrekt"},
    ["brustschmerz", "perikarditis", "jung", "fieber"]
)

# 5-8: Shortness of breath
make(
    "Akute Atemnot bei COPD", "emergency",
    "72", "mannlich", "Atemnot seit 2 Tagen, deutlich verschlechtert",
    "Seit 2 Tagen zunehmende Atemnot, schon in Ruhe. Husten mit gelblichem Auswurf. Bekannte COPD GOLD III. Kein Fieber. Sauerstoff zu Hause 2 l/min.",
    "Inhalatives Cortison und langwirksames Beta-2-Mimetikum, bei Bedarf Salbutamol",
    "Keine",
    "COPD GOLD III, arterielle Hypertonie",
    "Keine Atemwegserkrankungen",
    "Rentner, Ex-Raucher (60 pack years)",
    ["Fragen Sie nach der Verschlechterung und Auslosern", "Erfragen Sie Auswurf, Fieber und Infektzeichen", "Beurteilen Sie die Atemfrequenz und Sauerstoffsattigung", "Besprechen Sie die Akuttherapie", "Stellen Sie den Fall fur die Stationsubergabe dar"],
    ["Haben Sie Fieber gemessen?", "Hat sich die Farbe oder Menge des Auswurfs verandert?", "Haben Sie Ihre Medikamente wie gewohnt genommen?"],
    ["Ruhedyspnoe bei Vorschadigung", "Grün-gelblicher Auswurf als Infektzeichen", "COPD-Exazerbation mit Risiko der respiratorischen Insuffizienz"],
    ["Wir geben Ihnen zunachst Sauerstoff und inhalieren mit einem starkeren Medikament.", "Es besteht der Verdacht auf eine COPD-Verschlechterung durch eine Infektion."],
    "72-jahriger Patient mit bekannter COPD GOLD III, seit 2 Tagen zunehmende Atemnot und purulenter Auswurf. Ruhedyspnoe. V. a. infektexazerbierte COPD. Therapie: Sauerstoff, inhalative Bronchodilatation, orales Kortison und Antibiose nach Rontgen-Thorax.",
    {"historyTaking": "Dauer, Ausloser, Infektzeichen erheben", "redFlags": "Ruhedyspnoe, Zyanose, Eintrubung erkennen", "patientLanguage": "Atemmechanik und Inhalativa verstandlich erklaren", "structure": "Akut -> Medikation -> Diagnostik", "medicalLogic": "Exazerbation erkennen und leitliniengerecht behandeln", "germanAccuracy": "Termini wie COPD-Exazerbation, purulenter Auswurf korrekt"},
    ["atemnoth", "COPD", "exazerbation", "respiratorisch"]
)

make(
    "Akute Atemnot junger Patient", "emergency",
    "22", "weiblich", "Plotzliche Atemnot und pfeifende Atmung",
    "Nach dem Besuch bei einer Freundin, die eine Katze hat, akut einsetzende Atemnot mit pfeifendem Atemgerausch. Bekanntes Asthma bronchiale. Hat den Notfallspray bereits 2 Hub genommen ohne ausreichende Besserung.",
    "Salbutamol bei Bedarf, budesonid/formoterol taglich",
    "Katze, Pollen (bekannt)",
    "Asthma bronchiale, saisonaler Heuschnupfen",
    "Keine Atemwegserkrankungen",
    "Studentin, Nichtraucherin",
    ["Erfragen Sie den Ausloser der akuten Verschlechterung", "Fragen Sie nach der aktuellen Asthmakontrolle", "Beurteilen Sie den Schweregrad und die Therapie", "Erklaren Sie die Akuttherapie", "Besprechen Sie die Praventionsmasnahmen"],
    ["Haben Sie den Notfallspray schon genommen?", "Hatten Sie schon einmal einen so starken Anfall?", "Mussten Sie schon ins Krankenhaus wegen Asthma?"],
    ["Unzureichendes Ansprechen auf den Notfallspray", "Pfeifende Atmung als Zeichen der Bronchialobstruktion", "Bekannte Allergene als Ausloser"],
    ["Sie haben einen akuten Asthmaanfall. Ihr Bronchialspray allein reicht im Moment nicht aus.", "Wir geben Ihnen zusatzlich Sauerstoff und inhalieren mit einem starkeren Medikament."],
    "22-jahrige Patientin mit bekanntem Asthma bronchiale. Nach Katzenkontakt akute Dyspnoe mit Giemen. Salbutamol unzureichend wirksam. V. a. akute Asthmaexazerbation. Therapie: Sauerstoff, inhalative Bronchodilatation, systemische Kortikosteroide erwogen.",
    {"historyTaking": "Ausloser und Schweregrad erfragen", "redFlags": "Sprechdyspnoe, Einsatz der Atemhilfsmuskulatur, Zyanose erkennen", "patientLanguage": "Klare und beruhigende Ansprache", "structure": "Notfall -> Allergen -> Medikation", "medicalLogic": "Akuttherapie nach Stufenschema und Klinik", "germanAccuracy": "Begriffe wie Giemen, Exazerbation korrekt"},
    ["atemnoth", "asthma", "allergisch", "jung"]
)

make(
    "Luftnot bei Herzinsuffizienz", "emergency",
    "80", "weiblich", "Atemnot seit Tagen, Beinschwellung",
    "Zunehmende Atemnot in den letzten Tagen, kann nachts nicht flach liegen (3 Kissen). Beide Unterschenkel geschwollen. Gewichtszunahme von 3 kg in einer Woche. Bekannte Herzinsuffizienz.",
    "Ramipril 10 mg, Bisoprolol 2.5 mg, Torasemid 10 mg",
    "Keine",
    "Chronische Herzinsuffizienz, arterielle Hypertonie, Vorhofflimmern",
    "Keine",
    "Witwe, lebt allein, hat hausliche Hilfe",
    ["Fragen Sie nach der Symptomentwicklung", "Erheben Sie Zeichen der Dekompensation", "Pruefen Sie die Medikamenteneinhaltung und Ernahrung", "Erklaren Sie die Dekompensation in laienverstandlichen Worten", "Besprechen Sie die stationare Aufnahme"],
    ["Konnen Sie nachts flach liegen oder mussen Sie sich aufsetzen?", "Haben Sie Ihr Gewicht in letzter Zeit kontrolliert?", "Haben Sie Ihre Wassertabletten regelmasig genommen?"],
    ["Orthopnoe (nicht flach liegen konnen)", "Gewichtszunahme und Beinodeme", "Nichterkennen der Dekompensationszeichen"],
    ["Ihr Herz pumpt im Moment nicht kraftig genug, dadurch staut sich Wasser in der Lunge und in den Beinen.", "Wir mussen Sie stationar aufnehmen und die Wassertabletten anpassen."],
    "80-jahrige Patientin mit bekannter Herzinsuffizienz, seit Tagen zunehmende Dyspnoe, Orthopnoe, Beinodeme und Gewichtszunahme. Medikamenteneinnahme unzureichend. V. a. dekompensierte Herzinsuffizienz. Stationare Aufnahme zur Diagnostik und Therapieanpassung.",
    {"historyTaking": "Dekompensationszeichen systematisierend erheben", "redFlags": "Orthopnoe, Gewichtszunahme, Anasarka", "patientLanguage": "Herz-Kreislauf-Mechanik einfach erklaren", "structure": "Symptome -> Medikation -> Dekompensation", "medicalLogic": "Herzinsuffizienz-Dekompensation erkennen und behandeln", "germanAccuracy": "Dekompensation, Orthpnoe, Odeme korrekt"},
    ["atemnoth", "herzinsuffizienz", "dekompensation", "stationar"]
)

make(
    "Luftnot nach OP (Lungenembolie-Verdacht)", "ward",
    "55", "mannlich", "Akute Atemnot am 3. Tag nach Knie-OP",
    "3 Tage nach geplanter Knie-TEP-OP plotzlich Atemnot. Kein Husten. Zustand nach langer Bettruhe post-OP. Leichte Schwellung der linken Wade.",
    "Niedermolekulares Heparin als Thromboseprophylaxe, Novaminsulfon bei Bedarf",
    "Keine",
    "Keine relevanten Vorerkrankungen",
    "Keine Thrombosen in der Familie",
    "Selbstandig, Buroangestellter, Ubergewicht (BMI 32)",
    ["Fragen Sie nach der genauen Symptomatik", "Erheben Sie Thrombosefaktoren", "Bewerten Sie den zeitlichen Zusammenhang zur OP", "Erklaren Sie den Verdacht auf Lungenembolie", "Leiten Sie die notige Diagnostik ein"],
    ["Haben Sie Schmerzen oder Schwellungen in den Beinen?", "Hatten Sie in der Vergangenheit Thrombosen?", "Haben Sie das Heparin bekommen?"],
    ["Postoperativer Zustand mit Ruhigstellung", "Plotzliche Atemnot mit Wadenschwellung", "Ubergewicht als Risikofaktor"],
    ["Nach einer Operation besteht ein erhohtes Risiko fur Blutgerinnsel.", "Ich habe den Verdacht, dass sich ein Gerinnsel gelost hat und in Ihre Lunge gelangt ist."],
    "55-jahriger Patient am 3. Tag nach Knie-TEP mit akuter Dyspnoe, Wadenschwellung links und Immobilisation. V. a. Lungenembolie. CT-Angiographie und D-Dimer veranlasst, therapeutische Antikoagulation eingeleitet.",
    {"historyTaking": "Thrombosefaktoren und Symptomtrias erheben", "redFlags": "Akute Dyspnoe postoperativ + Wadenschwellung", "patientLanguage": "Thrombose-Embolie-Mechanismus verstandlich erklaren", "structure": "Postoperativ -> Symptome -> Risiko -> Diagnostik", "medicalLogic": "Wells-Score und D-Dimer-Diagnostik verstehen", "germanAccuracy": "Lungenembolie, Thrombose, Embolie korrekt"},
    ["atemnoth", "lungenembolie", "postoperativ", "thrombose"]
)

# 9-12: Abdominal pain
make(
    "Akute rechtsseitige Unterbauchschmerzen", "emergency",
    "28", "mannlich", "Rechtsseitige Unterbauchschmerzen seit 24 Stunden",
    "Zunachst Schmerzen um den Bauchnabel herum, dann in den rechten Unterbauch gewandert. Ubelkeit, Erbrechen einmalig. Appetitlosigkeit. Kein Stuhlgang seit 2 Tagen.",
    "Keine",
    "Keine",
    "Keine Vorerkrankungen",
    "Keine relevanten Baucherkrankungen",
    "Buroangestellter, Nichtraucher, wenig Alkohol",
    ["Fragen Sie nach Schmerzbeginn und -wanderung", "Erfragen Sie Begleitsymptome wie Ubelkeit, Erbrechen, Fieber", "Fragen Sie nach Appetit und Stuhlgang", "Erklaren Sie den Verdacht auf Blinddarmentzundung", "Besprechen Sie die weiteren Schritte"],
    ["Wann genau haben die Schmerzen angefangen und wo?", "Sind die Schmerzen gewandert?", "Hatten Sie Fieber?", "Hatten Sie schon einmal solche Schmerzen?"],
    ["Schmerzwanderung vom Mittelbauch in den rechten Unterbauch", "Ubelkeit, Erbrechen, Appetitlosigkeit", "Positiver Loslassschmerz moglich"],
    ["Die Schmerzen sind typisch fur eine Entzundung des Blinddarms.", "Ich werde Blut abnehmen und eine Ultraschalluntersuchung machen."],
    "28-jahriger Patient mit Schmerzwanderung in den rechten Unterbauch, Ubelkeit und Erbrechen. V. a. akute Appendizitis. Laborkontrolle und Abdomensonographie veranlasst. Bei Bestatigung operative Appendektomie indiziert.",
    {"historyTaking": "Schmerzlokalisation und -wanderung systematisch erfragen", "redFlags": "Peritonitiszeichen, Tachykardie, Fieber", "patientLanguage": "Blinddarmentzundung einfach erklaren", "structure": "Schmerz -> Begleitsymptome -> Diagnostik", "medicalLogic": "Appendizitisdiagnostik mit klinischen Scores", "germanAccuracy": "Appendizitis, Peritonitis, Schmerzwanderung korrekt"},
    ["bauchschmerz", "appendizitis", "akut", "chirurgisch"]
)

make(
    "Oberbauchschmerzen mit Ausstrahlung in den Rucken", "emergency",
    "45", "mannlich", "Starke Oberbauchschmerzen mit Ausstrahlung in den Rucken",
    "Nach reichhaltigem Essen und Alkoholkonsum starke gurtelfoermige Oberbauchschmerzen. Ausstrahlung in den Rucken. Ubelkeit, Erbrechen. Bekannte Fettstoffwechselstorung.",
    "Keine regelmasigen Medikamente",
    "Keine",
    "Hypercholesterinamie",
    "Keine",
    "Selbstandiger, ubergewichtiger Unternehmer, regelmassiger Alkoholkonsum (2-3 Bier/Tag)",
    ["Fragen Sie nach dem Schmerzcharakter und Ausstrahlung", "Erfragen Sie Ausloser (Essen, Alkohol)", "Fragen Sie nach Gallensteinen oder Pankreatitis in der Vorgeschichte", "Erklaren Sie den Verdacht auf Bauchspeicheldrusenentzundung", "Besprechen Sie die notige Klinikaufnahme"],
    ["Hatten Sie vorher etwas Besonderes gegessen oder getrunken?", "Hatten Sie schon einmal eine Bauchspeicheldrusenentzundung?", "Hatten Sie Gallensteine?"],
    ["Gurtelfoermige Schmerzen mit Ruckenausstrahlung", "Trigger: Fettreiche Mahlzeit + Alkohol", "Erhohter Alkoholkonsum als Risikofaktor"],
    ["Die Schmerzen passen zu einer Entzundung der Bauchspeicheldruse.", "Sie mussen stationar aufgenommen werden, damit wir Sie uberwachen und behandeln konnen."],
    "45-jahriger Patient mit gurtelfoermigen Oberbauchschmerzen nach fettreicher Mahlzeit und Alkoholkonsum. Ausstrahlung in den Rucken. Ubelkeit. V. a. akute Pankreatitis. Stationare Aufnahme, Laborkontrolle (Lipase, CRP), Nahrungskarenz und Volumengabe.",
    {"historyTaking": "Ausloser, Charakter, Vorerkrankungen", "redFlags": "Hamo- bzw.nekrotisierende Pankreatitis mit Kreislaufinstabilitat", "patientLanguage": "Bauchspeicheldruse und ihre Funktion einfach erklaren", "structure": "Ausloser -> Symptome -> Diagnose", "medicalLogic": "Pankreatitis-Diagnostik und Schweregrade", "germanAccuracy": "Pankreatitis, gurtelfoermig, Ausstrahlung korrekt"},
    ["bauchschmerz", "pankreatitis", "alkohol", "stationar"]
)

with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} cases")
