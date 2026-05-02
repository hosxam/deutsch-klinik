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

# More cases to reach 100 - mix of all remaining categories

make("Akute Nierenkolik", "emergency", "41", "mannlich", "Starke kolikartige Schmerzen im Rucken/Flanke",
     "Seit Stunden wellenartig zunehmende Schmerzen im rechten Rucken/Flanke, in den Unterbauch ausstrahlend. Ubelkeit, Erbrechen. Kein Fieber. Leichte rote Verfarbung des Urins bemerkt.",
     "Keine", "Keine", "Keine", "Keine", "Handwerker, trinkt wenig",
     ["Fragen Sie nach Schmerzcharakter und Ausstrahlung", "Fragen Sie nach Miktion und Urinfarbe", "Erklaren Sie den Verdacht auf Nierenstein", "Besprechen Sie die Diagnostik und Therapie"],
     ["Haben Sie Blut im Urin bemerkt?", "Haben Sie Fieber?", "Hatten Sie schon einmal Nierensteine?"],
     ["Koliktypische Schmerzen mit Hamaturie", "Fieber als Zeichen einer Infektion"],
     ["Die Schmerzen sind typisch fur einen Nierenstein, der im Hamleiter wandert.", "Wir machen eine Ultraschalluntersuchung."],
     "41-jahriger Patient mit Nierenkolik rechts, Hamaturie. V. a. Ureterstein. Sonographie und Urinuntersuchung veranlasst.",
     {"historyTaking": "Schmerzcharakter, Ausstrahlung, Urin", "redFlags": "Fieber, Anurie, Sepsis", "patientLanguage": "Steinbildung erklaren", "structure": "Schmerz -> Diagnostik -> Therapie", "medicalLogic": "Ureterstein: Diagnostik, Therapie", "germanAccuracy": "Nierenkolik, Ureterstein korrekt"},
     ["nierestein", "kolik", "akut", "schmerz"])

make("Blasenentleerungsstorung", "clinic", "65", "mannlich", "Harnverhalt seit gestern Abend",
     "Seit gestern kann er kein Wasser lassen, obwohl er starken Harndrang hat. Schmerzhafter Unterbauch. Bekannte Prostatavergroberung. Hatte schon einmal einen Harnverhalt vor 2 Jahren.",
     "Tamsulosin 0.4 mg", "Keine", "BPH, Herzinsuffizienz", "Keine", "Rentner, lebt mit Ehefrau",
     ["Fragen Sie nach dem Beginn und der Dauer", "Fragen Sie nach der Vorgeschichte", "Fragen Sie nach Operationen an der Prostata", "Erklaren Sie die notige Katheterisierung", "Besprechen Sie die weitere Behandlung"],
     ["Hatten Sie das schon einmal?", "Hatten Sie schon einen Katheter?", "Hatten Sie Schmerzen?"],
     ["Akuter Harnverhalt bei bekanntem BPH", "Katheterisierung dringend erforderlich"],
     ["Sie konnen Ihre Blase nicht entleeren und mussen einen Katheter bekommen.", "Danach besprechen wir, ob eine OP notig ist."],
     "65-jahriger Patient mit akutem Harnverhalt bei BPH. Katheterisierung erforderlich. Geplante urologische Vorstellung.",
     {"historyTaking": "Vorgeschichte, Medikation, Symptome", "redFlags": "Urosepsis, Nierenversagen", "patientLanguage": "Katheter und OP-Optionen erklaren", "structure": "Harnverhalt -> Katheter -> Urologie", "medicalLogic": "BPH-Management, Harnverhalt", "germanAccuracy": "Harnverhalt, BPH, Katheter korrekt"},
     ["urologie", "harnverhalt", "prostata", "katheter"])

make("Akute Gastritis durch NSAR", "clinic", "56", "weiblich", "Magenschmerzen nach Einnahme von Schmerzmitteln",
     "Seit 3 Tagen Oberbauchschmerzen, Saures Aufstossen, Ubelkeit nach dem Essen. Nimmt seit 2 Wochen taglich Ibuprofen 800 mg wegen Knieschmerzen.",
     "Ibuprofen 800 mg taglich", "Keine", "Gonarthrose", "Keine", "Buroangestellte",
     ["Fragen Sie nach dem zeitlichen Zusammenhang", "Fragen Sie nach Alarmzeichen", "Erklaren Sie die NSAR-Gastropathie", "Besprechen Sie Alternativen"],
     ["Haben Sie Teerstuhl oder Blut erbrochen?", "Hatten Sie schon ein Magengeschwur?"],
     ["NSAR-Einnahme + Oberbauchschmerzen", "Risiko fur Ulkusblutung"],
     ["Ibuprofen kann die Magenschleimhaut schadigen.", "Wir pausieren das Ibuprofen und geben einen Magenschutz."],
     "56-jahrige Patientin mit NSAR-Gastropathie. PPI-Therapie, NSAR-Pause.",
     {"historyTaking": "NSAR, Symptome,Ulkuszeichen", "redFlags": "GI-Blutung", "patientLanguage": "NSAR-Schadigung erklaren", "structure": "Medikament -> Symptom -> Therapie", "medicalLogic": "NSAR-Gastropathie, PPI-Prophylaxe", "germanAccuracy": "Gastropathie, NSAR, PPI"},
     ["bauchschmerz", "NSAR", "gastritis", "medikament"])

make("Metformin-Intoleranz bei Diabetes", "clinic", "62", "mannlich", "Durchfall und Ubelkeit nach Metformin",
     "Seit Beginn Metformin vor 2 Wochen Durchfall und Ubelkeit. Diabetes mellitus Typ 2 neu diagnostiziert.",
     "Metformin 500 mg 2x/Tag", "Keine", "DM Typ 2 (neu)", "DM bei Eltern", "Rentner",
     ["Fragen Sie nach dem zeitlichen Zusammenhang", "Fragen Sie nach der Dosierung", "Differenzieren Sie Nebenwirkung von anderen Ursachen", "Besprechen Sie Alternative"],
     ["Hatten Sie diese Symptome vor Metformin?", "Nehmen Sie die Tabletten zu den Mahlzeiten?"],
     ["Zeitlicher Zusammenhang Metformin + GI-Symptome", "Haufige Nebenwirkung zu Therapiebeginn"],
     ["Metformin verursacht haufig Magen-Darm-Probleme.", "Wir konnen auf eine retardierte Form umsteigen."],
     "Patient mit Metformin-Intoleranz. Wechsel auf retardiertes Metformin oder Alternative.",
     {"historyTaking": "Nebenwirkung, Dosierung, Einnahmemodus", "redFlags": "Laktatazidose (selten)", "patientLanguage": "Metformin-Nebenwirkungen erklaren", "structure": "Medikation -> Nebenwirkung -> Alternative", "medicalLogic": "Metformin-Intoleranz-Management", "germanAccuracy": "Metformin, retardiert, Laktatazidose"},
     ["diabetes", "medikamentennebenwirkung", "metformin", "intoleranz"])

make("Asthma-Kontrolle unzureichend", "clinic", "26", "weiblich", "Nachthusten und Belastungsdyspnoe bei Asthma",
     "Bekanntes Asthma, aber in letzter Zeit nachts Husten und beim Sport Atemnot. Benotigt den Notfallspray fast taglich. Keine regelmasige Basistherapie.",
     "Nur Salbutamol bei Bedarf", "Hausstaubmilben, Pollen",
     "Asthma bronchiale, saisonale Allergie", "Keine", "Studentin, Nichtraucherin",
     ["Fragen Sie nach Symptomkontrolle", "Prufen Sie die Therapieadhärenz", "Erklaren Sie den Unterschied zwischen Bedarfs- und Dauertherapie", "Passen Sie die Therapie an"],
     ["Wie oft benotigen Sie den Notfallspray?", "Wachen Sie nachts auf?", "Haben Sie eine regelmasige Therapie?"],
     ["Symptome >2x/Woche = unzureichende Kontrolle", "Fehlende Basistherapie"],
     ["Bei taglichem Bedarf an Notfallspray ist die Kontrolle nicht ausreichend.", "Sie brauchen eine zusatzliche tagliche Therapie."],
     "26-jahrige Patientin mit unzureichender Asthmakontrolle, fehlender Basistherapie. Eskalation auf ICS/LABA.",
     {"historyTaking": "Kontrolle, Medikation, Ausloser", "redFlags": "Schwere Exazerbation, Notarzteinsatz", "patientLanguage": "Bedarfs- vs Dauertherapie erklaren", "structure": "Kontrolle -> Medikation -> Eskalation", "medicalLogic": "Asthmastufentherapie, GINA-Leitlinie", "germanAccuracy": "Asthmakontrolle, ICS/LABA, GINA"},
     ["asthma", "kontrolle", "therapie", "allergie"])

make("Palpitationen bei Schilddrusenuberfunktion", "clinic", "34", "weiblich", "Herzrasen, Nervositat und Schwitzen",
     "Seit Wochen Herzrasen besonders in Ruhe, fuhlt sich unruhig, schwitzt viel, hat abgenommen trotz gutem Appetit. Bemerkt einen Kloß im Hals.",
     "Keine", "Keine", "Keine", "Schilddrusenerkrankungen bei der Mutter",
     "Verkauferin",
     ["Fragen Sie nach allen Hyperthyreose-Symptomen", "Fragen Sie nach der Familienanamnese", "Untersuchen Sie die Schilddrüse", "Erklären Sie den Verdacht", "Besprechen Sie die Diagnostik"],
     ["Haben Sie zugenommen oder abgenommen?", "Fühlen Sie einen Kloß im Hals?", "Habenz Sie zittrige Hande?"],
     ["Palpitationen + Gewichtsverlust + positive Familienanamnese", "Morbus Basedow moglich"],
     ["Ihre Symptome passen zu einer Schilddrusenuberfunktion.", "Wir messen Ihre Schilddrusenwerte."],
     "34-jahrige Patientin mit Palpitationen und Gewichtsverlust. V. a. Hyperthyreose. TSH, fT3, fT4, Sonographie.",
     {"historyTaking": "Palpitation, Gewichtsverlust, Schilddruse", "redFlags": "Vorhofflimmern, Thyreotoxikose", "patientLanguage": "Schilddrusenfunktion erklaren", "structure": "Symptome -> Schilddruse -> Diagnostik", "medicalLogic": "Hyperthyreose-Abklarung", "germanAccuracy": "Hyperthyreose, Basedow, TSH"},
     ["palpitationen", "hyperthyreose", "schilddruse", "gewichtsverlust"])

make("Akute Pankreatitis Verdacht", "emergency", "38", "weiblich", "Starke Oberbauchschmerzen nach Essen",
     "Nach fettreichem Essen (Fondue) starke Oberbauchschmerzen mit Ausstrahlung in den Rucken. Erbrechen. Bekannte Gallensteine.",
     "Keine", "Keine", "Gallensteine bekannt", "Keine", "Buroangestellte",
     ["Fragen Sie nach dem Ausloser", "Fragen Sie nach Gallensteinen", "Erklaren Sie die Pankreatitis", "Besprechen Sie die stationare Aufnahme"],
     ["Hatten Sie Gallensteine?", "Hatten Sie fruher schon Pankreatitis?"],
     ["Gallensteine + fettreiche Mahlzeit = Pankreatitis-Risiko"],
     ["Die Schmerzen passen zu einer Entzundung der Bauchspeicheldruse.", "Sie mussen stationar aufgenommen werden."],
     "38-jahrige Patientin mit biliaer Pankreatitis. Lipase erhoht. Stationare Therapie.",
     {"historyTaking": "Ausloser, Gallensteine, Alkohol", "redFlags": "Hamorrhagische Verlauf", "patientLanguage": "Pankreatitis erklaren", "structure": "Ausloser -> Diagnose -> Therapie", "medicalLogic": "Biliaere Pankreatitis, Ranson-Score", "germanAccuracy": "Pankreatitis, Gallenstein, Lipase"},
     ["pankreatitis", "gallenstein", "bauchschmerz", "stationar"])

make("Postoperative Vena-cava-Thrombose", "ward", "70", "weiblich", "Geschwollenes Bein nach Hueft-OP",
     "5 Tage nach Hutf-TEP-OP Schwellung und Schweregeful im linken Bein. Wade druckschmerzhaft. Keine Atemnot.",
     "Niedermolekulares Heparin", "Keine", "Koksarthrose, Hypertonie", "Keine", "Rentnerin",
     ["Fragen Sie nach der Schwellung und den Schmerzen", "Prufen Sie die Thromboseprophylaxe", "Erklaren Sie den Verdacht auf Thrombose", "Besprechen Sie die notige Diagnostik"],
     ["Haben Sie das Heparin bekommen?", "Haben Sie Atemnot oder Brustschmerzen?"],
     ["Postoperative tiefe Beinvenenthrombose", "Lungenembolie als Komplikation"],
     ["Nach einer Hueft-OP kann es zu einem Blutgerinnsel im Bein kommen.", "Wir machen eine Ultraschalluntersuchung."],
     "70-jahrige Patientin postoperativ mit V. a. TVT. Kompressionssonographie. Antikoagulation eingeleitet.",
     {"historyTaking": "Schwellung, Schmerz, Thromboserisiko", "redFlags": "Lungenembolie, Phlegmasie", "patientLanguage": "Thrombose erklaren", "structure": "OP -> Symptom -> Diagnostik", "medicalLogic": "TVT-Diagnostik, Wells-Score", "germanAccuracy": "TVT, Lungenembolie, Antikoagulation"},
     ["postoperativ", "thrombose", "bein", "stationar"])

make("Gastroenteritis bei Kind", "clinic", "3", "Kind", "Durchfall und Erbrechen seit 2 Tagen",
     "Seit 2 Tagen Durchfall 6x/Tag, Erbrechen 3x. Trinkt weniger. Noch nasse Windeln, aber weniger als sonst. Kein Fieber. Die Krippe hat gehausste Durchfallerkrankungen.",
     "Keine", "Keine", "Keine", "Keine", "Geht in Krippe",
     ["Fragen Sie nach der Symptomatik", "Bewerten Sie den Hydratationszustand", "Beraten Sie die Eltern", "Erklaren Sie die orale Rehydrierung", "Nennen Sie Wiedervorstellungskriterien"],
     ["Trinkt das Kind noch?", "Hatte das Kind Fieber?", "Hat das Kind noch nasse Windeln?"],
     ["Kind mit Exsikkose-Risiko bei Gastroenteritis"],
     ["Das Wichtigste ist, dass Ihr Kind genug Flussigkeit bekommt.", "Wenn es weniger als die Halfte der normalen Menge trinkt, mussen Sie wiederkommen."],
     "3-jahriges Kind mit akuter Gastroenteritis, leichter Exsikkose. Orale Rehydrierung. Elternberatung.",
     {"historyTaking": "Symptome, Flussigkeit, Urin", "redFlags": "Schwere Exsikkose, Krampfanfall", "patientLanguage": "Rehydrierung kindgerecht erklaren", "structure": "Symptome -> Rehydrierung -> Wiedervorstellung", "medicalLogic": "Kindliche Gastroenteritis, WHO-Plan", "germanAccuracy": "Gastroenteritis, Exsikkose, Rehydrierung"},
     ["durchfall", "kind", "gastroenteritis", "eltern"])

make("Schlafapnoe-Syndrom", "clinic", "52", "mannlich", "Mudigkeit tagsuber, lautes Schnarchen",
     "Seit Jahren starke Mudigkeit tagsuber, schlaft bei der Arbeit ein (Beifahrer). Schnarcht sehr laut, die Frau berichtet von Atemaussetzern nachts. Kopfschmerzen morgens.",
     "Keine", "Keine", "Ubergewicht", "Keine", "LKW-Fahrer",
     ["Fragen Sie nach Schnarchen und Atemaussetzern", "Fragen Sie nach der taglichen Schlafrigkeit", "Erklären Sie das Schlafapnoe-Syndrom", "Besprechen Sie die Diagnostik und Therapie", "Weisen Sie auf das Fahrverbot hin (!!)"],
     ["Schnarchen Sie laut?", "Wurden bei Ihnen Atemaussetzer beobachtet?", "Schlafen Sie tagsuber ein?"],
     ["Schlafapnoe mit Einschlafneigung am Steuer (Berufskraftfahrer!)", "Kardiovaskulare Folgeerkrankungen"],
     ["Ihre Symptome deuten auf eine Schlafapnoe hin.", "Wegen Ihres Berufes muss das dringend abgeklart werden."],
     "52-jahriger Patient mit obstruktiver Schlafapnoe, hoher Tagesschlafrigkeit, Berufskraftfahrer. Polysomnographie eingeleitet. CPAP-Therapie und Fahrtauglichkeit prufen.",
     {"historyTaking": "Schnarchen, Atemaussetzer, Tagesschlafrigkeit", "redFlags": "Verkehrstauglichkeit, Herzrhythmusstorungen", "patientLanguage": "Schlafapnoe und CPAP erklaren", "structure": "Symptome -> Diagnostik -> Therapie -> Fahrverbot", "medicalLogic": "OSA: Diagnostik, Therapie, Verkehrsrecht", "germanAccuracy": "Schlafapnoe, CPAP, Polysomnographie"},
     ["schlafapnoe", "mudigkeit", "schnarchen", "beruf"])

make("Akute Bronchitis bei Kind", "clinic", "5", "Kind", "Husten und Fieber seit 3 Tagen",
     "Seit 3 Tagen Husten, Fieber bis 38.8 Grad. Leichte Atemnot? (Eltern unsicher). Trinkt normal. Hatte schon fruher 'Asthmaanfalle' bei schweren Infekten.",
     "Keine", "Keine", "Keine", "Keine", "Geht in Kindergarten",
     ["Fragen Sie nach Atemnot, Trinkverhalten", "Fragen Sie nach fruheren Episoden", "Beruhigen Sie die Eltern", "Erklaren Sie die Therapie"],
     ["Hatten Sie das Gefuhl, dass Ihr Kind schlecht Luft bekommt?", "Trinkt Ihr Kind normal?"],
     ["Obstruktive Bronchitis bei Kleinkind haufig", "Asthma bronchiale als Differential"],
     ["Bei Kindern verengen sich die Atemwege bei Infekten leicht.", "Inhalation kann helfen, die Atemwege zu offnen."],
     "5-jahriges Kind mit obstruktiver Bronchitis bei Infekt. Keine schwere Atemnot. Inhalative Therapie.",
     {"historyTaking": "Atmung, Trinken, Fieber", "redFlags": "Schwere Dyspnoe, Zyanose", "patientLanguage": "Obstruktion kindgerecht erklaren", "structure": "Infekt -> Atemwege -> Therapie", "medicalLogic": "Obstruktive Bronchitis vs Asthma", "germanAccuracy": "Obstruktive Bronchitis, Inhalation"},
     ["husten", "kind", "bronchitis", "infekt"])

make("Hyperkalzamie bei Knochenmetastasen", "emergency", "72", "mannlich", "Schwache, Ubelkeit, Verwirrtheit",
     "Seit Tagen zunehmend schwach, Ubelkeit, verstopft, verwirrt. Bekanntes Prostatakarzinom mit Knochenmetastasen. Letzte Chemo vor 3 Monaten.",
     "Schmerzpflaster, keine Kortikoide", "Keine", "Prostatakarzinom mit Knochenmetastasen", "Keine", "Rentner",
     ["Fragen Sie nach Symptomen Hyperkalzamie", "Fragen Sie nach der Tumorerkrankung", "Besprechen Sie die Dringlichkeit", "Leiten Sie die Therapie ein"],
     ["Haben Sie viel getrunken?", "Hatten Sie Verstopfung?", "Sind Sie verwirrt?"],
     ["Tumorpatient mit Knochenmetastasen = hohes Hyperkalzamie-Risiko", "Verwirrtheit als Zeichen der schweren Hyperkalzamie"],
     ["Bei Ihrer Erkrankung kann der Kalziumspiegel gefahrlich ansteigen.", "Wir mussen sofort Blut abnehmen und behandeln."],
     "Patient mit Tumorhyperkalzamie. Kalzium erhoht. Therapie: Flussigkeit, Bisphosphonate, Kalzitonin.",
     {"historyTaking": "Tumoranamnese, Symptome", "redFlags": "Bewusstseinstorung, Herzrythmusstorungen", "patientLanguage": "Hyperkalzamie erklaren", "structure": "Symptome -> Ursache -> Therapie", "medicalLogic": "Tumorhyperkalzamie-Management", "germanAccuracy": "Hyperkalzamie, Bisphosphonate korrekt"},
     ["onkologie", "hyperkalzamie", "notfall", "tumor"])

make("Hautausschlag bei Windpocken (Kind)", "clinic", "6", "Kind", "Blaschenfoermiger Ausschlag und Fieber",
     "Seit 2 Tagen Fieber, seit gestern juckender blaschenformiger Ausschlag am ganzen Korper. Andere Kinder im Kindergarten haben Windpocken.",
     "Keine", "Keine", "Keine", "Keine", "Geht in Kindergarten",
     ["Fragen Sie nach Fieber und Juckreiz", "Fragen Sie nach Impfstatus", "Erklaren Sie die Diagnose", "Besprechen Sie Therapie und Isolierung"],
     ["Ist Ihr Kind gegen Windpocken geimpft?", "Hatte es Kontakt zu Windpocken?"],
     ["Typischer Windpockenausschlag + Kontakt + Fieber", "Kein Impfschutz"],
     ["Ihr Kind hat Windpocken.", "Den Juckreiz konnen wir mit einem Gel lindern. Das Kind darf nicht in den Kindergarten."],
     "Kind mit Varizellen. Symptomatische Therapie. Hausliche Isolierung bis alle Blaschen verkrustet sind.",
     {"historyTaking": "Fieber, Ausschlag, Kontakt, Impfung", "redFlags": "Superinfektion, Pneumonie, Enzephalitis", "patientLanguage": "Windpocken und Isolierung erklaren", "structure": "Ausschlag -> Impfung -> Therapie -> Isolierung", "medicalLogic": "Varizellen, Komplikationen, Impfung", "germanAccuracy": "Varizellen, Windpocken, Isolierung"},
     ["haut", "kind", "windpocken", "infekt"])

make("Gutenartiger Lagerungsschwindel (zweiter Fall)", "clinic", "62", "weiblich", "Drehschwindel beim Aufstehen",
     "Seit Tagen Drehschwindel beim Aufstehen aus dem Bett und beim Blicken nach oben. Dauert jeweils 20-30 Sekunden. Keine Ubelkeit.",
     "Keine", "Keine", "Keine", "Keine", "Rentnerin",
     ["Fragen Sie nach der genauen Schwindelqualitat", "Differenzieren Sie zu zentralem Schwindel", "Prufen Sie den Lagerungstest", "Erklaren Sie BPLS", "Machen Sie das Epley-Manover"],
     ["Dreht sich alles?", "Hatten Sie Kopfschmerzen oder Sehstorungen?", "Hatten Sie Horstorung oder Tinnitus?"],
     ["Klassischer BPLS", "Keine zentralen oder vestibularen Zeichen"],
     ["Das ist gutartiger Lagerungsschwindel.", "Es gibt ein einfaches Manover, das die Kristalle im Ohr verschiebt."],
     "62-jahrige Patientin mit BPLS posteriorer Kanal rechts. Epley-Manover durchgefuhrt.",
     {"historyTaking": "Schwindelqualitat, Ausloser, Dauer", "redFlags": "Zentraler Schwindel", "patientLanguage": "BPLS erklaren", "structure": "Schwindel -> Differential -> Manover", "medicalLogic": "BPLS-Diagnostik und Therapie", "germanAccuracy": "BPLS, Epley, Schwindel"},
     ["schwindel", "lagerungsschwindel", "BPLS", "vestibular"])

make("Sodbrennen und Reflux bei Ubergewicht", "clinic", "44", "mannlich", "Saures Aufstossen und Sodbrennen nach dem Essen",
     "Seit Monaten saures Aufstossen, Sodbrennen besonders nach fettigen Mahlzeiten und im Liegen. Hat 20 kg Ubergewicht. Nimmt gelegentlich Antazida.",
     "Keine", "Keine", "Keine", "Keine", "Buroangestellter, wenig Bewegung",
     ["Fragen Sie nach Refluxsymptomen", "Fragen Sie nach Lebensstil", "Erklaren Sie den Zusammenhang mit Ubergewicht", "Besprechen Sie Lebensstilanderung und PPI"],
     ["Haben Sie das auch nachts im Liegen?", "Haben Sie schon Saureblocker probiert?"],
     ["Reflux bei Adipositas", "Keine Alarmzeichen"],
     ["Ubergewicht erhoht den Druck auf den Magen und begünstigt Reflux.", "Neben einer Gewichtsreduktion konnen wir medikamentos helfen."],
     "Patient mit GERD bei Adipositas. PPI-Therapie und Gewichtsreduktion empfohlen.",
     {"historyTaking": "Reflux, Ubergewicht, Ernahrung", "redFlags": "Dysphagie, Gewichtsverlust", "patientLanguage": "Reflux und Ubergewicht erklaren", "structure": "Symptome -> Ursache -> Therapie", "medicalLogic": "GERD-Management, Gewichtsreduktion", "germanAccuracy": "GERD, Reflux, PPI"},
     ["reflux", "ubergewicht", "GERD", "pravention"])

# Add 5 more quick cases

make("Zervikales Scheibensyndrom", "clinic", "39", "mannlich", "Nackenschmerzen mit Ausstrahlung in den rechten Arm",
     "Seit 2 Wochen Nackenschmerzen, ausstrahlend in den rechten Arm bis in den Daumen. Kribbeln im Daumen. Buroarbeit am Bildschirm.",
     "Ibuprofen gelegentlich", "Keine", "Keine", "Keine", "Softwareentwickler, viel Bildschirmarbeit",
     ["Fragen Sie nach der Symptomatik", "Fragen Sie nach Kraftverlust oder Taubheit", "Besprechen Sie konservative Therapie"],
     ["Haben Sie Kraftverlust im Arm?", "Haben Sie Taubheitsgefuhl?"],
     ["Radikulare Symptomatik C6 oder C7", "Keine Cauda- oder langen Bahnen"],
     ["Ein gereizter Nerv in der Halswirbelsaule verursacht Ihre Armbeschwerden.", "Physiotherapie und Bewegung helfen."],
     "Patient mit zervikaler Radikulopathie C6/C7 rechts. Konservative Therapie.",
     {"historyTaking": "Schmerzausstrahlung, Kribbeln", "redFlags": "Progrediente Parese, Cauda-Symptome", "patientLanguage": "Nervenreizung erklaren", "structure": "Schmerz -> Ausstrahlung -> Therapie", "medicalLogic": "Zervikale Radikulopathie", "germanAccuracy": "Radikulopathie, zervikal"},
     ["ruckenschmerz", "nacken", "radikular", "arm"])

make("Schwindel bei Morbus Meniere", "clinic", "48", "weiblich", "Schwindelanfalle mit Ohrensausen",
     "Seit 2 Jahren immer wieder Schwindelanfalle (Drehschwindel) fur 20-60 Minuten, begleitet von Ohrensausen und Horverlust im rechten Ohr. Ubelkeit, Erbrechen.",
     "Keine", "Keine", "Keine", "Keine", "Buroangestellte",
     ["Fragen Sie nach der Schwindelqualitat und Dauer", "Fragen Sie nach Horstorung und Tinnitus", "Erklaren Sie Morbus Meniere", "Besprechen Sie die Therapie"],
     ["Haben Sie Ohrensausen?", "Horen Sie auf dem betroffenen Ohr schlechter?"],
     ["Klassische Trias: Drehschwindel + Tinnitus + Horverlust"],
     ["Ihre Anfalle passen zu Morbus Meniere.", "Wir uberweisen Sie zum HNO-Arzt."],
     "Patientin mit Meniere-Symptomatik. HNO-Vorstellung veranlasst. Salzmreduktion und Betahistin erwogen.",
     {"historyTaking": "Trias, Dauer, Frequenz", "redFlags": "Neurologische Herdsymptome", "patientLanguage": "Meniere erklaren", "structure": "Schwindel -> Ohr -> HNO", "medicalLogic": "M. Meniere, Betahistin", "germanAccuracy": "Meniere, Tinnitus, Betahistin"},
     ["schwindel", "meniere", "tinnitus", "HNO"])

make("Postthrombotisches Syndrom", "clinic", "65", "mannlich", "Geschwollenes Bein nach TVT vor 2 Jahren",
     "Nach einer tiefen Beinvenenthrombose vor 2 Jahren immer wieder Schwellung und Schweregeful im linken Bein, besonders abends. Hautveranderungen am Unterschenkel.",
     "Keine Antikoagulation mehr", "Keine", "Z. n. TVT links", "Keine", "Rentner",
     ["Fragen Sie nach der Symptomatik", "Fragen Sie nach der fruheren TVT", "Untersuchen Sie das Bein", "Besprechen Sie Kompressionsstrupfe"],
     ["Tragen Sie Kompressionsstrupfe?", "Haben Sie offene Stellen am Bein?"],
     ["Postthrombotisches Syndrom als TVT-Folge", "Risiko fur Ulcus cruris"],
     ["Nach einer Thrombose bleibt das Bein haufig zuruck.", "Kompressionsstrupfe helfen."],
     "Patient mit postthrombotischem Syndrom. Kompressionstherapie.",
     {"historyTaking": "TVT-Anamnese, Schwellung, Haut", "redFlags": "Ulcus cruris", "patientLanguage": "Postthrombotisches Syndrom erklaren", "structure": "TVT -> Folgen -> Therapie", "medicalLogic": "Postthrombotisches Syndrom", "germanAccuracy": "TVT, postthrombotisch, Kompression"},
     ["thrombose", "postthrombotisch", "kompression", "chronisch"])

make("Gewichtsverlust bei Malabsorption", "clinic", "55", "mannlich", "Gewichtsverlust und Durchfall seit Monaten",
     "Seit 3 Monaten 12 kg Gewichtsverlust, fettiger Durchfall, Bauchschmerzen, Blahungen. Hat Zoliakie in der Familie. Ist kein Brot mehr, aber keine Besserung.",
     "Keine", "Gluten (Verdacht)", "Keine", "Zoliakie bei der Schwester", "Angestellter",
     ["Fragen Sie nach der genauen Nahrungsmittelvertraglichkeit", "Fragen Sie nach Stuhlcharakter", "Erklaren Sie den Malabsorptionsverdacht", "Besprechen Sie die Diagnostik"],
     ["Haben Sie gebrochen?", "Ist der Stuhl fettig und riecht ubel?"],
     ["Gewichtsverlust + fettiger Durchfall = Malabsorption", "Zoliakie in der Familie"],
     ["Die Symptome deuten auf eine gestorte Nahrstoffaufnahme im Darm hin.", "Eine Darmspiegelung mit Biopsie kann Klarheit bringen."],
     "Patient mit Malabsorptionssyndrom. V. a. Zoliakie oder chronische Pankreatitis. Endoskopie + Elastase.",
     {"historyTaking": "Stuhl, Gewicht, Nahrung", "redFlags": "Nachtschweiß, Tumorzeichen", "patientLanguage": "Malabsorption erklaren", "structure": "Gewichtsverlust -> Stuhl -> Diagnostik", "medicalLogic": "Malabsorption: Zoliakie vs Pankreasinsuffizienz", "germanAccuracy": "Malabsorption, Zoliakie, Pankreasinsuffizienz"},
     ["gewichtsverlust", "malabsorption", "durchfall", "zoliakie"])

with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total cases")
