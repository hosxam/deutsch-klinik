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

# Trauma - head, wrist, ankle
make(
    "Schadeltrauma nach Sturz", "emergency",
    "68", "mannlich", "Sturz auf den Kopf, kurz bewusstlos",
    "Von der Leiter gefallen (ca. 2 m), auf den Kopf gesturzt. War kurz bewusstlos (ca. 1 Minute). Jetzt Kopfschmerzen, Ubelkeit. Kein Erbrechen. Keine neurologischen Ausfalle. Nimmt Marcumar.",
    "Marcumar (Phenprocoumon) wegen Vorhofflimmern",
    "Keine",
    "Vorhofflimmern, arterielle Hypertonie",
    "Keine",
    "Rentner, lebt mit Ehefrau",
    ["Fragen Sie nach dem Unfallhergang und Hohe des Sturzes", "Fragen Sie nach Bewusstlosigkeit und Erinnerungslucken", "Fragen Sie nach Blutverdunnern", "Erklaren Sie die Notwendigkeit eines Kopf-CTs", "Besprechen Sie die stationare Aufnahme"],
    ["Waren Sie bewusstlos?", "Haben Sie Erinnerungslucken?", "Nehmen Sie Blutverdunner?", "Haben Sie Ubelkeit oder Erbrechen?"],
    ["Bewusstlosigkeit nach Schadeltrauma", "Marcumar-Einnahme (hoheres Blutungsrisiko)", "Alter uber 65"],
    ["Da Sie Blutverdunner nehmen und kurz bewusstlos waren, mussen wir ein CT vom Kopf machen."],
    "68-jahriger Patient unter Marcumar mit Schadeltrauma und kurzer Bewusstlosigkeit. V. a. intrakranielle Blutung. CCT veranlasst. Stationare Uberwachung bei Marcumar-Patienten.",
    {"historyTaking": "Trauma, Bewusstlosigkeit, Blutverdunner", "redFlags": "Antikoagulation, Bewusstlosigkeit, fokale Ausfalle", "patientLanguage": "Blutungsrisiko durch Marcumar erklaren", "structure": "Trauma -> Antikoagulation -> Diagnostik", "medicalLogic": "SHT-Diagnostik, CCT-Indikation", "germanAccuracy": "SHT, CCT, Marcumar, intrakranielle Blutung korrekt"},
    ["trauma", "sturz", "kopf", "blutverdunner"]
)

make(
    "Handgelenksfraktur", "emergency",
    "45", "weiblich", "Sturz auf die ausgestreckte Hand, Schmerzen im Handgelenk",
    "Auf eisglatter Strasse auf die rechte Hand gesturzt. Starke Schmerzen im rechten Handgelenk, Schwellung und Bewegungseinschrankung. Keine offene Wunde.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellte, Rechtshanderin",
    ["Fragen Sie nach dem Sturzmechanismus", "Fragen Sie nach Schmerzen, Schwellung und Funktion", "Fragen Sie nach Sensibilitatsstorungen", "Erklaren Sie den Verdacht auf Handgelenksbruch", "Besprechen Sie die notige Rontgendiagnostik"],
    ["Haben Sie Taubheitsgefuhl in den Fingern?", "Konnen Sie die Finger bewegen?", "Haben Sie Schmerzen auch im Unterarm?"],
    ["Klassische Fallhandverletzung", "Offene Fraktur und Gefassverletzung ausschliesen"],
    ["Bei einem Sturz auf die Hand ist ein Bruch des Handgelenks haufig.", "Wir machen ein Rontgen zur Sicherheit."],
    "45-jahrige Patientin mit Sturz auf das rechte Handgelenk. Schwellung und Druckschmerz uber dem distalen Radius. V. a. distale Radiusfraktur. Rontgen veranlasst.",
    {"historyTaking": "Sturzmechanismus, Schmerz, Funktion", "redFlags": "Offene Fraktur, Durchblutungsstorung, Nervenlasion", "patientLanguage": "Handgelenksbruch und Heilung erklaren", "structure": "Sturz -> Fraktur -> Rontgen -> Therapie", "medicalLogic": "Radiusfraktur, Klassifikation, OP-Indikation", "germanAccuracy": "Distale Radiusfraktur, Rontgen korrekt"},
    ["trauma", "fraktur", "hand", "radius"]
)

make(
    "Umknicken mit Verdacht auf Bandverletzung", "emergency",
    "23", "mannlich", "Umgeknickt mit dem linken Fuss beim Fussball",
    "Beim Fussballspielen mit dem linken Fuss umgeknickt. Starke Schmerzen am ausseren Knochel, Schwellung. Kann nicht auftreten. Kein Knochengerausch gehort.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Student, spielt 2x/Woche Fussball",
    ["Fragen Sie nach dem Unfallhergang", "Fragen Sie nach Schmerzen und Belastbarkeit", "Fragen Sie nach fruheren Verletzungen", "Erklaren Sie den Unterschied zwischen Bandverletzung und Bruch", "Besprechen Sie die Ruhigstellung und Nachsorge"],
    ["Konnen Sie auftreten?", "Hatten Sie schon fruher Banderrisse?", "Haben Sie ein Knacksen oder Knirschen gehort?"],
    ["Laterale Bandverletzung nach Supinationstrauma", "Distorsion vs Ruptur, Ottawa-Ankle-Regeln"],
    ["Das Umknicken fuhrt oft zu einer Uberdehnung oder einem Riss der Aussenbander.", "Wir machen ein Rontgen, um einen Bruch auszuschliesen."],
    "23-jahriger Patient mit Supinationstrauma des linken OSG. Schwellung und Druckschmerz lateral. Keine sichere Fraktur nach Ottawa-Regeln. V. a. laterale Banddistorsion. Ruhigstellung und Physiotherapie.",
    {"historyTaking": "Trauma, Belastbarkeit, Vorverletzungen", "redFlags": "Instabilitat, Gelenkerguss, Ottawa-Ankle-Kriterien", "patientLanguage": "Banderverletzung vs Bruch erklaren", "structure": "Trauma -> Befund -> Rontgen -> Therapie", "medicalLogic": "OSG-Distorsion, funktionelle Therapie", "germanAccuracy": "Supinationstrauma, Distorsion, OSG korrekt"},
    ["trauma", "sport", "fuss", "band"]
)

# More abdominal: Diarrhea, Obstipation
make(
    "Chronische Verstopfung", "clinic",
    "72", "weiblich", "Seit Jahren Verstopfung, jetzt Bauchschmerzen",
    "Seit Jahren Verstopfung, jetzt zunehmende Bauchschmerzen und Völlegefühl. Stuhlgang nur alle 3-4 Tage mit starkem Pressen. Nimmt Laxanzien, aber mit nachlassender Wirkung.",
    "Bisacodyl bei Bedarf, Metamucil",
    "Keine",
    "Arterielle Hypertonie, Osteoporose",
    "Keine",
    "Witwe, lebt allein, wenig Bewegung, trinkt wenig",
    ["Fragen Sie nach der Stuhlfrequenz und Konsistenz", "Fragen Sie nach Laxanziengebrauch", "Fragen Sie nach Alarmzeichen", "Erklaren Sie die Chronifizierung von Obstipation", "Besprechen Sie eine Stufentherapie"],
    ["Haben Sie Blut im Stuhl bemerkt?", "Haben Sie ungewollt abgenommen?", "Haben Sie Schmerzen beim Stuhlgang?"],
    ["Langanhaltende Obstipation bei alterer Patientin", "Laxanzienabhangigkeit moglich"],
    ["Bei chronischer Verstopfung ist eine Umstellung der Ernahrung und ausreichend Flussigkeit der erste Schritt."],
    "72-jahrige Patientin mit chronischer Obstipation, Laxanziabhangigkeit, keine Alarmzeichen. Beratung zu Ballaststoffen, Flussigkeit und Bewegung. Stufenweiser Laxanzienentzug und Wechsel zu Macrogol.",
    {"historyTaking": "Stuhlfrequenz, Laxanzien, Alarmzeichen", "redFlags": "Blut im Stuhl, Gewichtsverlust, plotzliche Anderung der Stuhlgewohnheiten", "patientLanguage": "Darmtragheit und Laxanzien erklaren", "structure": "Symptome -> Laxanzien -> Ernahrung -> Therapie", "medicalLogic": "Chronische Obstipation, Laxanzienverhalten", "germanAccuracy": "Obstipation, Laxanzien, Macrogol korrekt"},
    ["bauchschmerz", "obstipation", "alter", "chronisch"]
)

# Postoperative
make(
    "Postoperative Ubelkeit nach Narkose", "ward",
    "35", "weiblich", "Ubelkeit und Erbrechen nach Gallenblasen-OP",
    "Nach laparoskopischer Cholezystektomie (gestern) starke Ubelkeit, mehrfach erbrochen. Keine Schmerzen im OP-Gebiet. Schwindel. Hat noch nichts gegessen.",
    "Metamizol, niedermolekulares Heparin, ggf. Ondansteron",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellte",
    ["Fragen Sie nach der Ubelkeit und dem Erbrechen", "Fragen Sie nach dem letzten Essen und Trinken", "Fragen Sie nach der Schmerzmedikation", "Erklaren Sie die haufigste Ursache fur postoperative Ubelkeit", "Besprechen Sie die antiemetische Therapie"],
    ["Haben Sie Schmerzen im Bauch?", "Haben Sie die Schmerzmittel gut vertragen?", "Hatten Sie schon nach fruheren Narkosen Ubelkeit?"],
    ["Postoperative Ubelkeit und Erbrechen (PONV) nach Allgemeinanasthesie", "Opiate als Risikofaktor"],
    ["Ubelkeit nach einer Narkose kommt haufig vor.", "Wir geben Ihnen ein Medikament gegen die Ubelkeit."],
    "35-jahrige Patientin mit PONV nach laparoskopischer Cholezystektomie. Keine chirurgischen Komplikationen. Therapie: Antiemetika, Flussigkeit, Kostaufbau.",
    {"historyTaking": "PONV-Risikofaktoren, Medikation", "redFlags": "Starke Bauchschmerzen, Fieber, Peritonitiszeichen", "patientLanguage": "PONV als harmlose Narkosefolge erklaren", "structure": "Narkose -> Ubelkeit -> Antiemetika", "medicalLogic": "PONV-Risiko, Antiemetika nach Stufenschema", "germanAccuracy": "PONV, Antiemetika, Narkose korrekt"},
    ["postoperativ", "narkose", "ubelkeit", "PONV"]
)

make(
    "Postoperative Schmerztherapie", "ward",
    "44", "weiblich", "Starke Schmerzen nach Kaiserschnitt",
    "Gestern Kaiserschnitt (Sectio caesarea). Starke Schmerzen im Unterbauch, besonders beim Bewegen und Stillen. Schmerzskala 7/10. Angst, dass Schmerzmittel dem Baby schaden konnten.",
    "Ibuprofen 600 mg 3x/Tag + Novaminsulfon bei Bedarf",
    "Keine",
    "Keine",
    "Keine",
    "Lehrerin, erstes Kind, lebt mit Partner, stillt",
    ["Fragen Sie nach der Schmerzintensitat und -lokalisation", "Fragen Sie nach der Schmerzqualitat", "Fragen Sie nach Stillen und Saeugling", "Erklaren Sie die Sicherheit von Schmerzmitteln beim Stillen", "Optimieren Sie die Schmerztherapie"],
    ["Haben Sie Schmerzen beim Stillen?", "Haben Sie das Gefuhl, dass die Schmerzmittel ausreichen?", "Stillen Sie?"],
    ["Unzureichende postoperative Schmerztherapie", "Stillen erfordert angepasste Medikation"],
    ["Gute Schmerztherapie ist nach einem Kaiserschnitt wichtig.", "Ibuprofen und Paracetamol sind auch beim Stillen sicher."],
    "44-jahrige Patientin am 1. Tag nach Sectio mit unzureichender Schmerztherapie. Stillt. Akuter Schmerz 7/10. Anpassung der Schmerzmedikation (Paracetamol + Ibuprofen als Basis, ggf. Opiat bei Bedarf).",
    {"historyTaking": "Schmerzintensitat, Stillen, Angst", "redFlags": "Fieber, Wundinfektion, tiefe Beinvenenthrombose", "patientLanguage": "Schmerzmittel beim Stillen erklaren", "structure": "OP -> Schmerz -> Stillen -> Therapie", "medicalLogic": "Postoperative Schmerztherapie unter Berucksichtigung der Laktation", "germanAccuracy": "Sectio, Schmerztherapie, Lakation korrekt"},
    ["postoperativ", "schmerz", "sectio", "stillen"]
)

# Psychiatric
make(
    "Depressive Episode", "clinic",
    "38", "mannlich", "Seit Wochen niedergeschlagen, antriebslos, schlaflos",
    "Seit 6 Wochen gedruckte Stimmung, Interessenverlust, Antriebslosigkeit, Fruherwachen. Fuhlt sich uberfordert mit der Arbeit. Keine suizidalen Gedanken. Hat sich zuruckgezogen.",
    "Keine",
    "Keine",
    "Keine",
    "Depression beim Vater bekannt",
    "Angestellter in IT, verheiratet, zwei Kinder, hoher Leistungsdruck",
    ["Fragen Sie nach der Dauer der Symptome", "Fragen Sie nach den Kernsymptomen einer Depression", "Fragen Sie nach Suizidalitat", "Erklaren Sie das Krankheitsbild der Depression", "Besprechen Sie Behandlungsoptionen"],
    ["Hatten Sie schon Gedanken, dass das Leben nicht mehr lebenswert ist?", "Haben Sie noch Freude an Dingen?", "Wie ist Ihr Schlaf?"],
    ["Anhaltende depressive Symptomatik uber Wochen mit funktioneller Beeintrachtigung", "Suizidalitat muss immer erfragt werden"],
    ["Depression ist eine Erkrankung des Gehirns und keine Charakterschwache.", "Es gibt gute Behandlungsmoglichkeiten mit Psychotherapie und Medikamenten."],
    "38-jahriger Patient mit depressiver Episode (Fruherwachen, Antriebslosigkeit, Interessenverlust). Keine akute Suizidalitat. V. a. mittelschwere depressive Episode. Psychotherapie und SSRI empfohlen.",
    {"historyTaking": "Zielsymptome, Dauer, Suizidalitat", "redFlags": "Akute Suizidalitat, Psychose, Manie", "patientLanguage": "Depression als behandelbare Erkrankung entstigmatisieren", "structure": "Symptome -> Diagnostik -> Suizidalitat -> Therapie", "medicalLogic": "Depression: Schweregrad, Therapie, SSRI", "germanAccuracy": "Depression, Fruherwachen, Anhedonie, SSRI korrekt"},
    ["psychiatrie", "depression", "antriebslos", "schlafstorung"]
)

make(
    "Schlafstorung bei Belastung", "clinic",
    "32", "weiblich", "Einschlafstorung und Durchschlafstorung seit Wochen",
    "Seit Wochen Probleme beim Einschlafen, wacht nachts auf und findet keinen Schlaf. Grundliches Gruebeln. Tagsuber mud und gereizt. Belastet durch Trennungsphase.",
    "Gelegentlich Baldrian, kein regelmassiges Medikament",
    "Keine",
    "Keine",
    "Keine",
    "Sozialarbeiterin, frisch getrennt, ein Kind",
    ["Fragen Sie nach dem genauen Schlafmuster", "Fragen Sie nach Auslosern und Belastungen", "Fragen Sie nach Tagesbefindlichkeit", "Erklaren Sie die Schlafhygiene", "Besprechen Sie Therapieoptionen ohne Medikamente"],
    ["Wann gehen Sie ins Bett und wann wachen Sie auf?", "Grunbeln Sie im Bett?", "Nehmen Sie Nahrungsergainzungsmittel?"],
    ["Schlafstorung bei psychosozialer Belastung", "Keine Hinweise auf Depression oder Angststorung"],
    ["Schlafprobleme bei Belastung sind haufig.", "Strukturierte Schlafhygiene und Entspannungsverfahren konnen helfen."],
    "32-jahrige Patientin mit Ein- und Durchschlafstorung bei Trennungsstress. Keine Depression. Beratung zu Schlafhygiene, Entspannungstechniken, ggf. Kurzzeittherapie.",
    {"historyTaking": "Schlafmuster, Belastungen, Tagesbefindlichkeit", "redFlags": "Depressive Symptome, Suizidalitat, Schlafapnoe", "patientLanguage": "Schlafhygiene praktisch vermitteln", "structure": "Schlaf -> Belastung -> Hygiene -> Therapie", "medicalLogic": "Primare vs sekundare Schlafstorung, Zolpidem-Risiko", "germanAccuracy": "Insomnie, Schlafhygiene, Zolpidem korrekt"},
    ["psychiatrie", "schlafstorung", "stress", "insomnie"]
)

# More trauma: ribs
make(
    "Rippenprellung nach Sturz", "emergency",
    "71", "weiblich", "Sturz auf die Brust, Schmerzen beim Atmen",
    "Auf der Treppe gesturzt und mit der Brust auf die Kante gefallen. Starke Schmerzen rechts thorakal, verstarkt beim tiefen Atmen und Husten. Keine Atemnot.",
    "Keine",
    "Keine",
    "Osteoporose",
    "Keine",
    "Rentnerin",
    ["Fragen Sie nach dem Sturzmechanismus", "Fragen Sie nach Schmerzcharakter und Atemabhangigkeit", "Fragen Sie nach Atemnot", "Erklaren Sie den Unterschied zwischen Prellung und Bruch", "Besprechen Sie die Therapie"],
    ["Haben Sie Atemnot?", "Haben Sie das Gefuhl, dass sich die Rippen bewegen (Rippenserie)?"],
    ["Alter + Osteoporose = hoheres Frakturrisiko", "Atemabhangige Schmerzen typisch fur Rippenfraktur"],
    ["Die Schmerzen beim Atmen konnen von einem Rippenbruch kommen.", "Wir machen ein Rontgen zur Sicherheit."],
    "71-jahrige Patientin mit Sturz auf den Thorax. Atemabhangige Schmerzen rechts. Osteoporose. V. a. Rippenfraktur. Rontgen-Thorax veranlasst. Konservative Therapie mit Analgetika.",
    {"historyTaking": "Trauma, Schmerzqualitat, Dyspnoe", "redFlags": "Hamo-Pneumothorax, Rippenserie mit instabilem Thorax", "patientLanguage": "Rippenfraktur vs Prellung erklaren", "structure": "Sturz -> Schmerz -> Rontgen -> Ruhe", "medicalLogic": "Rippenfraktur: Komplikationen erkennen", "germanAccuracy": "Rippenfraktur, Prellung, Thoraxkorrekt"},
    ["trauma", "sturz", "brust", "rippen"]
)

# More general: fatigue, weight change
make(
    "Mudigkeit bei Eisenmangel", "clinic",
    "33", "weiblich", "Seit Monaten mud, blass, kurzatmig bei Belastung",
    "Seit Monaten zunehmende Mudigkeit, blasse Hautfarbe, Kurzatmigkeit beim Treppensteigen. Starke Regelblutungen. Nagel bruchig. Kalte Hande und Fuse.",
    "Eisen pausiert wegen Magenbeschwerden, kein regelmassiges Medikament",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellte, viel Stress",
    ["Fragen Sie nach der genauen Symptomatik", "Fragen Sie nach der Menstruationsanamnese", "Fragen Sie nach Blutverlust", "Erklaren Sie den Zusammenhang zwischen Eisenmangel und Mudigkeit", "Besprechen Sie die Eisensubstitution"],
    ["Hatten Sie starke Regelblutungen?", "Haben Sie Blut im Stuhl bemerkt?", "Haben Sie schon Eisen pabiert?"],
    ["Eisenmangelanamie bei Hypermenorrhoe", "Weitere Blutverlustquellen ausschliesen"],
    ["Ihre Müdigkeit kommt sehr wahrscheinlich von Eisenmangel.", "Wir messen das Blutbild und das Eisen und beginnen dann eine Eisentherapie."],
    "33-jahrige Patientin mit Mudigkeit, Blasse, Belastungsdyspnoe bei Hypermenorrhoe. V. a. Eisenmangelanamie. Diagnostik: Blutbild, Ferritin. Therapie: orales Eisen, ggf. gynakologische Abklarung der Hypermenorrhoe.",
    {"historyTaking": "Mudigkeit, Blutungsanamnese, GI-Blutverlust", "redFlags": "Schwere Anamie, Malignonverdacht, GI-Blutung", "patientLanguage": "Eisenmangel und Hamoglobin erklaren", "structure": "Mudigkeit -> Menstruation -> Eisenmangel -> Therapie", "medicalLogic": "Eisenmangelanamie: Ursachen, Diagnostik, Therapie", "germanAccuracy": "Eisenmangel, Anamie, Ferritin, Hypermenorrhoe korrekt"},
    ["mudigkeit", "anamie", "eisenmangel", "menstruation"]
)

make(
    "Schilddrusenuberfunktion", "clinic",
    "28", "mannlich", "Nervositat, Gewichtsverlust, Herzklopfen",
    "Seit Wochen zunehmend nervos, zittrig, Herzklopfen, 7 kg Gewichtsverlust trotz guten Appetit. Hitzeintoleranz, verstarktes Schwitzen. Schlafstorungen.",
    "Keine",
    "Keine",
    "Keine",
    "Schilddrusenerkrankungen bei der Mutter",
    "Student, normaler Alltag",
    ["Fragen Sie nach den Symptomen einer Schilddrusenuberfunktion", "Fragen Sie nach der Familienanamnese", "Fragen Sie nach Halsveranderungen", "Erklaren Sie die Hyperthyreose", "Besprechen Sie die Diagnostik"],
    ["Haben Sie einen Kloß im Halsgefuhl oder Schluckbeschwerden?", "Haben Sie herzrasen?", "Haben Sie verkurzten Schlaf?"],
    ["Gewichtsverlust bei gesteigertem Appetit", "Tachykardie, Tremor, Nervositat"],
    ["Ihre Symptome passen zu einer Schilddrusenuberfunktion.", "Mit einer Blutuntersuchung konnen wir die Diagnose sichern."],
    "28-jahriger Patient mit Gewichtsverlust, Tachykardie, Tremor. Positive Familienanamnese. V. a. Hyperthyreose. TSH, fT3, fT4 bestimmen. ggf. Schilddrusensonographie.",
    {"historyTaking": "Hyperthyreose-Symptome, Familienanamnese", "redFlags": "Tachykardie, Vorhofflimmern, Thyreotoxische Krise", "patientLanguage": "Schilddrusenhormonwirkung erklaren", "structure": "Symptome -> Schilddruse -> Hormone -> Diagnostik", "medicalLogic": "Hyperthyreose: Morbus Basedow vs autonomes Adenom", "germanAccuracy": "Hyperthyreose, TSH, fT3, fT4 korrekt"},
    ["schilddruse", "hyperthyreose", "gewichtsverlust", "tremor"]
)

with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total cases")
