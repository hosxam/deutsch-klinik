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

make(
    "Fieber bei Hamwegsinfekt", "clinic",
    "34", "weiblich", "Brennen beim Wasserlassen und Fieber",
    "Seit 2 Tagen Brennen beim Wasserlassen, haufiger Harndrang. Seit gestern Fieber bis 38.9 Grad. Kein Flankenschmerz. Keine Ubelkeit.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellte, sexuell aktiv, verheiratet",
    ["Fragen Sie nach der genauen Symptomatik", "Erfragen Sie Risikofaktoren", "Bewerten Sie den Schweregrad", "Erklaren Sie die Diagnose", "Besprechen Sie die Therapie"],
    ["Hatten Sie schon einmal einen Hamwegsinfekt?", "Hatten Sie Blut im Urin?", "Hatten Sie Schmerzen in der Flanke?"],
    ["Fieber als Zeichen einer aufsteigenden Infektion", "Kein Flankenschmerz als gutes Zeichen"],
    ["Sie haben eine Blasenentzundung.", "Wir geben Ihnen ein Antibiotikum und Sie sollten viel trinken."],
    "34-jahrige Patientin mit Dysurie, Pollakisurie und Fieber. V. a. Hamwegsinfekt. Urinkultur und Antibiose nach Resistogram.",
    {"historyTaking": "Dysurie, Fieber, aufgehende Infektion", "redFlags": "Flankenschmerz, Ubelkeit als Zeichen einer Pyelonephritis", "patientLanguage": "Blasenentzundung vs Nierenbeckenentzundung erklaren", "structure": "Symptome -> Fieber -> Diagnostik", "medicalLogic": "Unkomplizierter vs komplizierter HWI", "germanAccuracy": "Dysurie, Pollakisurie, HWI korrekt"},
    ["fieber", "HWI", "dysurie", "antibiotika"]
)

make(
    "Schwindel bei Kreislaufproblemen", "clinic",
    "29", "weiblich", "Wiederkehrender Schwindel beim Aufstehen",
    "Seit Wochen immer wieder Schwindel beim Aufstehen, selten Schwarzwerden vor Augen. Kein Drehschwindel. Gelegentlich Herzrasen. Schlafmangel, Stress im Studium. Trinkt wenig.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Studentin, wenig Schlaf, selten Alkohol, wenig Bewegung",
    ["Fragen Sie nach der genauen Schwindelqualitat", "Differenzieren Sie orthostatischen und Drehschwindel", "Fragen Sie nach Begleitsymptomen", "Erklaren Sie den Verdacht auf Kreislaufdysregulation", "Besprechen Sie nicht-medikamentose Masnahmen"],
    ["Dreht sich alles oder ist Ihnen eher benommen?", "Haben Sie dabei Herzrasen oder Herzstolpern?", "Wurde Ihnen schon einmal schwarz vor Augen?"],
    ["Orthostatischer Schwindel mit potenzieller Synkope", "Ausschluss einer kardialen Ursache notwendig"],
    ["Ihr Schwindel deutet auf Kreislaufprobleme hin, besonders beim Aufstehen.", "Mehr trinken, langsam aufstehen, das kann schon viel helfen."],
    "29-jahrige Patientin mit orthostatischem Schwindel bei Dehydratation und Stress. Kein Drehschwindel. V. a. orthostatische Dysregulation. Beratung zu kreislaufstabilisierenden Masnahmen.",
    {"historyTaking": "Schwindelqualitat, Ausloser, Begleitsymptome", "redFlags": "Kardiale Synkope, neurologische Herdsymptome", "patientLanguage": "Kreislaufdysregulation einfach erklaren", "structure": "Schwindel -> Begleitsymptome -> Ursachen", "medicalLogic": "Orthostatische vs kardiale vs vestibulare Ursachen", "germanAccuracy": "Orthostatische Dysregulation, Schwindel korrekt"},
    ["schwindel", "orthostase", "jung", "kreislauf"]
)

make(
    "Herzrasen bei Vorhofflimmern", "emergency",
    "62", "mannlich", "Plotzliches Herzrasen ohne Ausloser",
    "Vor 2 Stunden plotzlich Herzrasen in Ruhe, Brustengegeful, leichter Schwindel. Keine Atemnot. Setzt sich nicht durch Valsalva. Erste Episode dieser Art. Fuhlt sich unruhig.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Rentner, fruher Schichtarbeiter",
    ["Fragen Sie nach Beginn, Dauer und Ausloser des Herzrasens", "Fragen Sie nach Begleitsymptomen", "Erfragen Sie Risikofaktoren fur Rhythmusstorungen", "Erklaren Sie den Verdacht auf Vorhofflimmern", "Besprechen Sie die nachsten diagnostischen Schritte"],
    ["Hatten Sie das schon einmal?", "Hat das Herzrasen plotzlich angefangen und hort es plotzlich auf?", "Hatten Sie das Gefuhl, ohnmachtig zu werden?"],
    ["Erstmanifestation tachyarrhythmischen Vorhofflimmerns", "Thrombembolisches Risiko bei Vorhofflimmern beachten"],
    ["Ihr Herz schlagt im Moment zu schnell und unregelmasig.", "Wir mussen das Herz zunachst verlangsamen und dann den Rhythmus wiederherstellen."],
    "62-jahriger Patient mit akutem palpitationen, erstmalig. EKG zeigt Vorhofflimmern mit rascher Uberleitung. Keine hamodynamische Instabilitat. Geplante Frequenzkontrolle und Echokardiographie.",
    {"historyTaking": "Palpitationen, Dauer, Ausloser", "redFlags": "Hamodynamische Instabilitat, Synkope, Brustschmerz", "patientLanguage": "Rhythmusstorung einfach erklaren", "structure": "Symptome -> EKG -> Diagnostik", "medicalLogic": "Vorhofflimmern: Frequenzkontrolle vs. Rhythmisierung", "germanAccuracy": "Tachyarrhythmie, Vorhofflimmern korrekt"},
    ["herzrasen", "vorhofflimmern", "tachyarrhythmie", "palpitationen"]
)

make(
    "Husten mit Auswurf bei Bronchitis", "clinic",
    "45", "mannlich", "Husten mit gelblichem Auswurf seit 10 Tagen",
    "Husten erst trocken, jetzt produktiv mit gelblichem Auswurf. Leichtes Fieber bis 38 Grad. Keine Atemnot. Leichte Gliederschmerzen. Hatte vor 2 Wochen eine Erkaltung.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Handwerker, Nichtraucher",
    ["Fragen Sie nach Dauer und Verlauf des Hustens", "Fragen Sie nach Auswurf (Farbe, Menge)", "Fragen Sie nach Fieber und Allgemeinzustand", "Erklaren Sie den Unterschied zwischen viral und bakteriell", "Besprechen Sie die Therapie"],
    ["Hatten Sie Fieber?", "Hatten Sie schon einmal Lungenentzundung?", "Rauchen Sie?"],
    ["Daueruber 7 Tage mit farbigem Auswurf", "Fieber als Infektzeichen"],
    ["Eine Bronchitis heilt meist von selbst aus.", "Wenn der Auswurf eitrig wird und Fieber langer anhalt, kann ein Antibiotikum notig sein."],
    "45-jahriger Patient mit produktivem Husten seit 10 Tagen, subfebril. V. a. akute Bronchitis bei protrahiertem Infekt. Bei anhaltendem eitrigem Auswurf und Fieber Antibiose erwogen.",
    {"historyTaking": "Hustendauer, Auswurf, Fieber", "redFlags": "Hämoptysen, Atemnot, Thoraxschmerz", "patientLanguage": "Viral vs bakteriell erklaren", "structure": "Husten -> Auswurf -> Verlauf -> Therapie", "medicalLogic": "Bronchitis vs Pneumonie, Antibiotika-Indikation", "germanAccuracy": "Bronchitis, produktiv, subfebril korrekt"},
    ["husten", "bronchitis", "infekt", "auswurf"]
)

make(
    "Durchfall nach Auslandsreise", "clinic",
    "33", "mannlich", "Durchfall seit Ruckkehr aus Indien",
    "Seit 5 Tagen wassriger Durchfall, 4-5x/Tag, krampfartige Bauchschmerzen. Kein Fieber, kein Blut. War 3 Wochen in Indien. Hatte dort mehrmals Durchfall, jetzt anhaltend.",
    "Loperamid zeitweise, keine Antibiotika",
    "Keine",
    "Keine",
    "Keine",
    "Ingenieur, Nichtraucher",
    ["Fragen Sie nach Reiseziel, Aufenthaltsdauer und Symptomen", "Fragen Sie nach Reisemedizin und Impfungen", "Fragen Sie nach Blutbeimengung und Fieber", "Besprechen Sie die Differenzialdiagnose", "Erklaren Sie die Therapie"],
    ["Hatten Sie Fieber?", "Haben Sie Blut im Stuhl bemerkt?", "Haben Sie vor der Reise Impfungen bekommen?"],
    ["Anhaltender Durchfall nach Tropenreise uber 5 Tage", "Ausschluss einer parasitaren Infektion notwendig"],
    ["Reisedurchfall ist haufig, aber wenn er langer als 3-4 Tage anhalt, sollten wir eine Stuhlprobe untersuchen."],
    "33-jahriger Patient mit wassrigem Durchfall nach Indienaufenthalt. Kein Blut, kein Fieber. V. a. protrahierte infektiose Gastroenteritis. Stuhldiagnostik auf Bakterien und Parasiten veranlasst.",
    {"historyTaking": "Reiseanamnese, Stuhlcharakter, Begleitsymptome", "redFlags": "Blutiger Durchfall, hohes Fieber, Dehydratation", "patientLanguage": "Reisedurchfall und Tropeninfektion unterscheiden", "structure": "Reise -> Symptome -> Diagnostik", "medicalLogic": "Infektiose vs parasitar, Reisediarrhoe", "germanAccuracy": "Reisediarrhoe, parasitare Infektion korrekt"},
    ["durchfall", "reise", "infektion", "tropen"]
)

make(
    "Allergischer Hautausschlag nach Medikament", "emergency",
    "28", "weiblich", "Juckender Hautausschlag nach Antibiotikum",
    "Seit 3 Tagen juckender, roter, fleckiger Ausschlag am ganzen Korper. Hat vor 7 Tagen ein Antibiotikum (Amoxicillin) wegen Zahninfektion bekommen. Keine Atemnot. Kein Fieber.",
    "Amoxicillin (seit 7 Tagen), ansonsten keine",
    "Bislang keine bekannten Allergien",
    "Keine",
    "Keine",
    "Buroangestellte",
    ["Fragen Sie nach dem zeitlichen Zusammenhang mit dem Medikament", "Fragen Sie nach Ausdehnung und Juckreiz", "Bewerten Sie den Schweregrad der Reaktion", "Erklaren Sie den Verdacht auf Arzneimittelallergie", "Besprechen Sie das weitere Vorgehen"],
    ["Hatten Sie Atemnot oder Schwellungen im Gesicht?", "Haben Sie das Antibiotikum abgesetzt?", "Hatten Sie schon einmal eine allergische Reaktion?"],
    ["Zeitlicher Zusammenhang: Exanthem nach Amoxicillin", "Keine Anzeichen einer schweren systemischen Reaktion"],
    ["Das ist wahrscheinlich eine allergische Reaktion auf das Antibiotikum.", "Sie durfen Amoxicillin und verwandte Antibiotika nicht mehr nehmen."],
    "28-jahrige Patientin mit medikamentosem Exanthem nach Amoxicillin. Keine systemische Beteiligung. V. a. Typ-IV-Allergie. Absetzen des Antibiotikums, antihistaminerge Therapie. Allergiepass ausgestellt.",
    {"historyTaking": "Medikamentenanamnese und zeitlicher Zusammenhang", "redFlags": "Dyspnoe, Angioödem, Kreislaufreaktion", "patientLanguage": "Allergische Reaktion vs Nebenwirkung erklaren", "structure": "Ausschlag -> Medikament -> Allergie", "medicalLogic": "Allergische Reaktion vom verzogerten Typ", "germanAccuracy": "Exanthem, Arzneimittelallergie, Antihistaminikum korrekt"},
    ["allergie", "exanthem", "medikament", "antibiotikum"]
)

make(
    "Sturz im Alter mit Verdacht auf Fraktur", "emergency",
    "78", "weiblich", "Sturz zu Hause, Schmerzen im rechten Oberschenkel",
    "Beim Aufstehen gestolpert und auf die rechte Seite gefallen. Kann das rechte Bein nicht belasten. Starke Schmerzen im rechten Oberschenkel. Kein Bewusstseinsverlust.",
    "Ramipril, Metoprolol, ASS (Blutverdunner)",
    "Keine",
    "Arterielle Hypertonie, Vorhofflimmern, Osteoporose",
    "Keine",
    "Witwe, lebt allein, hausliche Hilfe 1x/Woche",
    ["Fragen Sie nach dem Sturzhergang", "Fragen Sie nach Schmerzen, Belastbarkeit und Fehlstellung", "Fragen Sie nach Blutverdunnern", "Erklaren Sie den Verdacht auf Oberschenkelhalsbruch", "Besprechen Sie die notige Diagnostik und OP-Vorbereitung"],
    ["Haben Sie Blutverdunner genommen?", "Konnen Sie den Fuß anheben (Tragen)?", "Haben Sie sich den Kopf gestoben?"],
    ["Hochrisiko-Patientin (Alter, Osteoporose, Sturz)", "ASS-Einnahme vor OP relevant", "Verdacht auf mediale Schenkelhalsfraktur"],
    ["Nach einem solchen Sturz ist ein Knochenbruch sehr wahrscheinlich.", "Wir mussen ein Rontgen machen und die Operation vorbereiten."],
    "78-jahrige Patientin mit Sturz, schmerzhaftem und nicht belastbarem rechten Bein. ASS-Einnahme. V. a. Schenkelhalsfraktur rechts. Rontgen veranlasst. Geplante operative Versorgung, ASS-Pause pra-OP.",
    {"historyTaking": "Sturzmechanismus, Belastbarkeit, Blutverdunner", "redFlags": "Offene Fraktur, Gefaßverletzung, Bewusstseinsverlust", "patientLanguage": "Operationsnotwendigkeit und Vorbereitung erklaren", "structure": "Sturz -> Fraktur -> OP-Vorbereitung", "medicalLogic": "Schenkelhalsfraktur: Dringlichkeit, Antikoagulation", "germanAccuracy": "Schenkelhalsfraktur, Antikoagulation korrekt"},
    ["sturz", "fraktur", "osteoporose", "alter"]
)

make(
    "Postoperative Wundheilungsstorung", "ward",
    "55", "mannlich", "Wundrotung und Schwellung 5 Tage nach Bauch-OP",
    "5 Tage nach laparoskopischer Cholezystektomie zunehmende Rötung, Schwellung und Druckschmerz an der Trokar-Eintrittstelle im Bauchnabel. Leichtes Fieber 38.1 Grad. Kein eitriger Ausfluss.",
    "Metamizol bei Bedarf, niedermolekulares Heparin",
    "Keine",
    "Keine",
    "Keine",
    "Selbstandig, normalgewicht",
    ["Fragen Sie nach dem zeitlichen Verlauf der Symptome", "Fragen Sie nach Fieber, Schuttelfrost, Ausfluss", "Bewerten Sie die Wunde klinisch", "Erklaren Sie den Verdacht auf Wundinfekt", "Besprechen Sie die notigen Schritte"],
    ["Haben Sie Fieber gemessen?", "Haben Sie das Gefuhl, dass die Wunde warm ist?", "Tritt Flussigkeit aus der Wunde aus?"],
    ["Perioperative Wundinfektion mit Fieber", "Trokareinstichstelle als typische Lokalisation"],
    ["Die Wunde ist entzundet. Das ist eine haufige Komplikation nach Operationen.", "Wir nehmen eine Wundabstrich und leiten eine Antibiotikatherapie ein."],
    "55-jahriger Patient am 5. post-OP-Tag mit lokaler Wundinfektion an der Trokareintrittstelle, subfebril. Keine systemische Infektion. Wundabstrich und kalkulierte Antibiose. Engmaschige Wundkontrolle.",
    {"historyTaking": "Postoperativer Verlauf, Lokalbefund, Fieber", "redFlags": "Sepsiszeichen, ausgedehnte Zellulitis, tiefe Wunddehiszenz", "patientLanguage": "Wundinfektion als typische OP-Komplikation erklaren", "structure": "OP -> Wunde -> Infektion -> Therapie", "medicalLogic": "Postoperative Wundinfektion, Antibiotika, Wundmanagement", "germanAccuracy": "Wundinfekt, Trokar, Zellulitis korrekt"},
    ["postoperativ", "wundinfektion", "chirurgisch", "stationar"]
)

make(
    "Angst- und Panikstorung mit somatischer Prufentation", "clinic",
    "36", "mannlich", "Wiederkehrende Angstanfalle mit korperlichen Symptomen",
    "Seit Monaten immer wieder anfallsartig Herzklopfen, Schwindel, Engegefuhl, Schwitzen, Angst zu sterben. Bisherige kardiale Diagnostik (EKG, Belastungs-EKG, Echo) unauffallig. Symptome treten ohne Ausloser auf.",
    "Keine regelmasig",
    "Keine",
    "Keine kardialen Vorerkrankungen",
    "Angststorungen bei der Mutter",
    "IT-Projektmanager, hoher beruflicher Druck, wenig Schlaf",
    ["Fragen Sie nach der genauen Symptomatik wahrend der Anfalle", "Differenzieren Sie zwischen Panikattacke und kardialer Ursache", "Fragen Sie nach psychosozialen Belastungen", "Erklaren Sie das biopsychosoziale Modell", "Besprechen Sie Behandlungsoptionen"],
    ["Hatten Sie das Gefuhl, dass Sie sterben mussten?", "Vermeiden Sie bestimmte Situationen aus Angst vor einem Anfall?", "Haben Sie schon einmal eine Psychotherapie gemacht?"],
    ["Wiederholte negative kardiale Diagnostik", "Angst vor dem nacksten Anfall (Antizipationsangst)", "Soziale/berufliche Beeintrachtigung"],
    ["Ihre korperlichen Symptome sind echt, kommen aber von Ihrer Angstreaktion und nicht vom Herzen.", "Eine Psychotherapie kann Ihnen helfen, die Angst zu verstehen und zu bewaltigen."],
    "36-jahriger Patient mit Panikattacken, ausgiebiger negativer somatischer Abklarung. Leidet unter Antizipationsangst. V. a. Panikstorung. Empfehlung: Psychotherapie, ggf. SSRI, Stressmanagement.",
    {"historyTaking": "Symptome wahrend Anfall, Angstdauer, Vermeidungsverhalten", "redFlags": "Suizidgedanken, schwere Depression, Substanzgebrauch", "patientLanguage": "Psychosomatische Zusammenhange entpathologisierend erklaren", "structure": "Symptome -> Diagnostik -> Erklarung -> Therapie", "medicalLogic": "Panikstorung vs kardiale Ursache differenzieren", "germanAccuracy": "Panikattacke, Antizipationsangst, SSRI korrekt"},
    ["psychiatrie", "angst", "panik", "somatisch"]
)

with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total cases")
