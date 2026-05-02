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

# Joint pain
make(
    "Akute Gelenkschwellung im Knie", "emergency",
    "52", "mannlich", "Geschwollenes, rotes und heises Knie seit 2 Tagen",
    "Seit 2 Tagen schmerzhafte Schwellung des rechten Knies. Das Knie ist rot, uberwarmt und beweglichkeitseingeschrankt. Kein Fieber. Kein vorangegangenes Trauma.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Handwerker, Ubergewicht",
    ["Fragen Sie nach dem Beginn und der Kinetik der Schwellung", "Differenzieren Sie zwischen Trauma, Infekt und Arthritisschub", "Fragen Sie nach Fieber und Allgemeinsymptomen", "Erklaren Sie den Verdacht auf Gelenkenzundung", "Besprechen Sie die notige Punktion und Diagnostik"],
    ["Hatten Sie in den letzten Wochen einen Infekt?", "Hatten Sie schon einmal eine Gelenkschwellung?", "Hatten Sie Fieber oder Schuttelfrost?"],
    ["Monartikulare Schwellung mit Entzundungszeichen", "Infektarhtritis als Ausschlussdiagnose dringend", "Gichttophi an anderen Stellen?"],
    ["Die Entzundungszeichen im Knie konnen verschiedene Ursachen haben.", "Wir mussen das Knie punktieren, um eine bakterielle Infektion auszuschliessen."],
    "52-jahriger Patient mit akuter Monarthritis des rechten Knies, Rubor, Calor, Tumor, Dolor. V. a. infektiose Arthritis oder Gicht. Kniegelenkpunktion und Labor (CRP, Harnsaure, Borrelien) veranlasst.",
    {"historyTaking": "Beginn, Trauma, Infekt, Fieber", "redFlags": "Infektiose Arthritis als Notfall", "patientLanguage": "Gelenkpunktion erklaren", "structure": "Schwellung -> Differenzial -> Punktion", "medicalLogic": "Arthritis urica vs septische Arthritis vs aktivierte Arthrose", "germanAccuracy": "Monarthritis, Gichttophi, Gelenkpunktion korrekt"},
    ["gelenkschmerz", "arthritis", "knie", "punktion"]
)

make(
    "Rheumatoide Arthritis mit Schub", "clinic",
    "48", "weiblich", "Seit Wochen zunehmende Gelenkschmerzen und Morgensteifigkeit",
    "Seit Wochen zunehmende Schmerzen in den Handgrundgelenken, Fingergelenken beidseits. Morgensteifigkeit uber 1 Stunde. Kraftlosigkeit in den Handen. Bekannte rheumatoide Arthritis seit 5 Jahren.",
    "Methotrexat 15 mg/Woche, Folsäure, gelegentlich Ibuprofen",
    "Keine",
    "Rheumatoide Arthritis seit 5 Jahren",
    "Mutter hatte auch Rheuma",
    "Buroangestellte (eingeschrankt durch Handschmerzen), Nichtraucherin",
    ["Fragen Sie nach der Dauer und Lokalisation der Gelenkschmerzen", "Erheben Sie die Morgensteifigkeit und Funktionsbeeintrachtigung", "Fragen Sie nach aktueller Therapie und Compliance", "Erklaren Sie die Schubsymptomatik", "Besprechen Sie Therapieanpassung"],
    ["Haben Sie Ihre Medikamente regelmassig genommen?", "Hatten Sie Nebenwirkungen?", "Haben Sie morgens das Gefuhl, dass die Gelenke steif sind?"],
    ["Morgendliche Steifigkeit >30 Minuten als Zeichen der Entzundungsaktivitat", "Symmetrische Beteiligung der Hande"],
    ["Ihre rheumatoide Arthritis zeigt aktuell eine verstarkte Aktivitat.", "Wir mussen die Therapie anpassen und eventuell erganzen."],
    "48-jahrige Patientin mit bekannter RA, aktuell Schub mit Morgensteifigkeit und symmetrischer Polyarthritis. Unter MTX. V. a. aktive Erkrankung. Therapieanpassung (Dosiserhohung oder Biologikum) erforderlich.",
    {"historyTaking": "Morgensteifigkeit, Gelenkverteilung, Therapie", "redFlags": "Schnelle Gelenkdestruktion, viszerale Beteiligung", "patientLanguage": "Autoimmunerkrankung und Schubmechanismus erklaren", "structure": "Symptome -> Therapie -> Schub -> Anpassung", "medicalLogic": "RA-Aktivitat, DAS28, Eskalationstherapie", "germanAccuracy": "Polyarthritis, Morgensteifigkeit, MTX korrekt"},
    ["gelenkschmerz", "rheuma", "schub", "MTX"]
)

# Fever
make(
    "Fieber bei unbekannter Ursache", "clinic",
    "42", "weiblich", "Seit 2 Wochen Fieber bis 39 Grad, Nachtschweiss",
    "Seit 2 Wochen Fieber bis 39 Grad, starker Nachtschweiss, Mudigkeit, Gewichtsverlust 3 kg. Kein Husten, kein Durchfall. Kein spezifischer Infektfokus.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Lehrerin, kein Stress, keine Reisen",
    ["Fragen Sie nach dem Fieberverlauf und Fiebermessungen", "Erfragen Sie B-Symptome", "Fragen Sie nach Reisen, Tierkontakten, Infektionen", "Erklaren Sie den Begriff Fieber unklarer Genese", "Besprechen Sie die diagnostische Strategie"],
    ["Haben Sie in den letzten Monaten abgenommen?", "Hatten Sie Nachtschweiss?", "Hatten Sie Tierkontakt oder Zeckenbisse?"],
    ["Fieber >3 Wochen unklarer Genese", "B-Symptome: Nachtschweiss, Gewichtsverlust", "Breites Differenzialspektrum"],
    ["Fieber uber mehrere Wochen ohne erkennbare Ursache muss systematisch abgeklart werden.", "Wir beginnen mit Blutuntersuchungen und Bildgebung."],
    "42-jahrige Patientin mit Fieber unklarer Genese seit 2 Wochen, B-Symptomatik. Ausschluss von Infektionen, Autoimmunerkrankungen und Malignomen. Basisdiagnostik: Blutkulturen, Labor, Rontgen-Thorax, Abdomensonographie.",
    {"historyTaking": "Fieberkurve, B-Symptome, Reisen", "redFlags": "Hohes Fieber, rascher Gewichtsverlust, Nachtschweiss", "patientLanguage": "Systematische Abklarung erklaren", "structure": "Fieber -> Begleitsymptome -> Diagnostik", "medicalLogic": "FUO-Diagnostik-Algorithmus", "germanAccuracy": "Fieber unklarer Genese, B-Symptome korrekt"},
    ["fieber", "FUO", "unklar", "diagnostik"]
)

make(
    "Fieber bei Kind (besorgte Eltern)", "clinic",
    "2", "Kind", "Fieber seit 2 Tagen, weint viel",
    "Seit 2 Tagen Fieber bis 39.5 Grad. Kind ist weinerlich, trinkt weniger als sonst. Kein Husten, kein Durchfall. Kein Hautausschlag. Hatte gestern einen Impftermin. Die Eltern sind sehr besorgt.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Kind lebt bei berufstatigen Eltern, geht in Krippe",
    ["Fragen Sie nach der genauen Fieberhöhe und Messmethode", "Fragen Sie nach Trinkverhalten, Urinausscheidung, Bewusstsein", "Fragen Sie nach Impfungen und Impfreaktionen", "Untersuchen Sie das Kind (im FSP verbal)", "Beruhigen und beraten Sie die Eltern"],
    ["Wie hoch war das Fieber maximal?", "Trinkt das Kind noch gut?", "Hatte das Kind schon einen Fieberkrampf?", "Sind die Impfungen aktuell?"],
    ["Hohes Fieber bei Kleinkindern haufig viral bedingt", "Risiko von Fieberkrampfen bei raschern Fieberanstieg"],
    ["Fieber bei Kindern ist haufig und meist harmlos.", "Wichtig ist, dass Ihr Kind genug trinkt und Sie auf das Verhalten achten."],
    "2-jahriges Kind mit Fieber bis 39.5 Grad nach Impfung und bei Krippenbesuch. Keine Hinweise auf schweren Infekt. Beratung der Eltern zu Fiebermanagement und Wiedervorstellungskriterien.",
    {"historyTaking": "Fieberverlauf, Trinkverhalten, Impfstatus", "redFlags": "Fieberkrampf, Menningismus, Trinkverweigerung", "patientLanguage": "Fieber bei Kindern entdramatisieren", "structure": "Fieber -> Verhalten -> Impfung -> Beruhigung", "medicalLogic": "Fiebermanagement bei Kindern, Wiedervorstellungskriterien", "germanAccuracy": "Fieber, Impfreaktion, kindgerechte Kommunikation"},
    ["fieber", "kind", "eltern", "impfung"]
)

# Dizziness + Syncope
make(
    "Drehschwindel benigner Lagerungsschwindel", "clinic",
    "55", "mannlich", "Drehschwindel beim Umdrehen im Bett",
    "Seit einer Woche kurze heftige Drehschwindelanfalle beim Umdrehen im Bett oder beim Aufrichten. Dauer ca. 20-30 Sekunden. Dabei Ubelkeit, aber kein Erbrechen. Keine Horstorung. Kein Tinnitus.",
    "Keine",
    "Keine",
    "Keine",
    "Keine",
    "Rentner",
    ["Fragen Sie nach der genauen Schwindelqualität und Auslosern", "Differenzieren Sie vestibularen von zentralem Schwindel", "Fragen Sie nach Horstorung, Tinnitus, neurologischen Ausfallen", "Erklaren Sie die Diagnose", "Besprechen Sie das Behandlungsmanover"],
    ["Dreht sich alles oder schwankt es?", "Hatten Sie Ohrensausen oder Horverlust?", "Hatten Sie Kopfschmerzen?"],
    ["Lagerungsabhängiger Drehschwindel", "Keine Horstorung oder neurologische Ausfalle"],
    ["Das ist ein gutartiger Lagerungsschwindel.", "Es gibt ein einfaches Manover, das die Kristalle im Ohr wieder an den richtigen Platz bringt."],
    "55-jahriger Patient mit lagerungsabhangigem Drehschwindel, keine neurologischen oder vestibularen Ausfalle. V. a. benignen paroxysmalen Lagerungsschwindel (BPLS). Geplantes Befreiungsmanover nach Epley.",
    {"historyTaking": "Schwindelqualitat, Ausloser, Dauer", "redFlags": "Zentraler Schwindel, Horstorung, neurologische Herdsymptome", "patientLanguage": "Otolithen und Lagerungsschwindel erklaren", "structure": "Schwindel -> Ausloser -> Diagnose -> Manover", "medicalLogic": "BPLS vs Morbus Meniere vs zentraler Schwindel", "germanAccuracy": "BPLS, Drehschwindel, Otolithen korrekt"},
    ["schwindel", "lagerungsschwindel", "BPLS", "vestibular"]
)

make(
    "Synkope nach Aufstehen", "emergency",
    "74", "mannlich", "Kurzfristige Bewusstlosigkeit nach Aufstehen",
    "Heute Morgen nach dem Aufstehen plotzlich schwarz vor Augen geworden und kurz bewusstlos geworden. Nach wenigen Sekunden von selbst wieder aufgewacht. Keine Zuckungen. Keine Zungenbiss. Nimmt Blutdrucktabletten.",
    "Ramipril 10 mg, Hydrochlorothiazid 25 mg",
    "Keine",
    "Arterielle Hypertonie",
    "Keine",
    "Rentner",
    ["Fragen Sie nach dem genauen Hergang der Synkope", "Differenzieren Sie orthostatische Synkope von kardialer Synkope", "Fragen Sie nach Begleitsymptomen und Prodromi", "Fragen Sie nach Medikamenten", "Besprechen Sie die weiteren Schritte"],
    ["Hatten Sie vor der Ohnmacht Schwindel oder Schwarzwerden vor Augen?", "Hatten Sie dabei Herzrasen?", "Hatten Sie Zuckungen?"],
    ["Orthostatische Synkope bei antihypertensiver Therapie", "Kardiale Synkope muss ausgeschlossen werden"],
    ["Bei Ihren Blutdrucktabletten kann der Blutdruck beim Aufstehen zu weit absinken.", "Wir sollten Ihren Blutdruck im Liegen und Stehen messen."],
    "74-jahriger Patient mit orthostatischer Synkope nach Aufstehen unter antihypertensiver Kombinationstherapie. Keine kardialen oder neurologischen Warnsymptome. V. a. orthostatische Dysregulation. Anpassung der Medikation erwogen.",
    {"historyTaking": "Prodromi, Begleitsymptome, Medikation", "redFlags": "Synkope ohne Prodromi, bei Belastung, mit Verletzung", "patientLanguage": "Orthostatische Synkope erklaren", "structure": "Synkope -> Prodromi -> Medikation -> Abklarung", "medicalLogic": "Orthostatisch vs kardial vs neurogen", "germanAccuracy": "Synkope, orthostatisch, Prodromi korrekt"},
    ["synkope", "orthostase", "alter", "medikation"]
)

# Palpitations
make(
    "Herzstolpern bei Extrasystolen", "clinic",
    "35", "weiblich", "Gefuhl von Herzstolpern und Aussetzern",
    "Seit Wochen Gefuhl, dass das Herz 'stolpert' oder aussetzt. Tritt in Ruhe auf. Keine Schmerzen, keine Atemnot. Hat sich viel informiert und hat Angst vor Herzinfarkt. Gesundheitsangstlich.",
    "Keine",
    "Keine",
    "Keine",
    "Herzkrankheiten beim Vater",
    "Anwaltin, viel Stress",
    ["Fragen Sie nach der genauen Wahrnehmung und Haufigkeit", "Fragen Sie nach Begleitsymptomen und Auslosern", "Bewerten Sie die Belastung durch die Symptome", "Erklaren Sie das Phanomen von Extrasystolen", "Beruhigen und besprechen Sie die Diagnostik"],
    ["Hatten Sie dabei Schwindel oder Atemnot?", "Tritt es in Ruhe oder bei Belastung auf?", "Hatten Sie schon ein EKG?"],
    ["Extrasystolen in Ruhe meist gutartig", "Angst vor Herzkrankheit kann die Symptome verstarken"],
    ["Herzstolpern ist meistens harmlos.", "Jeder Mensch hat zusatzliche Herzschlage, die man spuren kann."],
    "35-jahrige Patientin mit Palpitationen, Gefuhl von Herzaussetzern. Keine Begleitsymptome. V. a. benigne ventrikulare oder supraventrikulare Extrasystolen. Langzeit-EKG zur Quantifizierung und Beruhigung.",
    {"historyTaking": "Palpitationen, Ausloser, Angstdruck", "redFlags": "Gehaufte Symptome, Synkope, positive Familienanamnese fur plotzlichen Herztod", "patientLanguage": "Harmlose Extrasystolen erklaren", "structure": "Symptome -> EKG -> Beruhigung", "medicalLogic": "Benigne Extrasystolen vs Arrhythmie", "germanAccuracy": "Extrasystole, Palpitation, Langzeit-EKG korrekt"},
    ["herzrasen", "extrasystolen", "benigne", "palpitationen"]
)

# Cough / Dysuria
make(
    "Chronischer Husten bei Reflux", "clinic",
    "49", "mannlich", "Husten seit Wochen, besonders nachts",
    "Seit Wochen trockener Husten, besonders nachts und morgens. Saures Aufstossen, manchmal Sodbrennen. Kein Fieber. Kein Auswurf. Nichtraucher. Husten wird durch Hustenblocker nicht besser.",
    "Keine regelmasig, gelegentlich Antazida",
    "Keine",
    "Keine",
    "Keine",
    "Buroangestellter, Ubergewicht, 2 Kaffee/Tag, wenig Bewegung",
    ["Fragen Sie nach der Dauer und dem Charakter des Hustens", "Fragen Sie nach Refluxsymptomen", "Fragen Sie nach Allergien und Asthma", "Erklaren Sie den Zusammenhang zwischen Husten und Reflux", "Besprechen Sie die Therapie"],
    ["Haben Sie Sodbrennen oder saures Aufstossen?", "Haben Sie das Gefuhl, dass etwas im Hals hochkommt?", "Haben Sie Allergien oder Asthma?"],
    ["Husten >8 Wochen ohne Infekt", "Reflux als haufige Ursache fur chronischen Husten"],
    ["Chronischer Husten kann durch zuruckfließenden Magensaft verursacht werden.", "Oft ist ein Therapieversuch mit Magensaureblockern hilfreich."],
    "49-jahriger Patient mit chronischem trockenem Husten seit Wochen, Refluxsymptomatik. Nichtraucher. V. a. refluxbedingten Husten (LPR). Therapieversuch mit PPI fur 8 Wochen.",
    {"historyTaking": "Hustencharakter, Refluxsymptome, Allergie", "redFlags": "Hämoptysen, Gewichtsverlust, Heiserkeit uber Wochen", "patientLanguage": "Reflux-Husten-Mechanismus erklaren", "structure": "Husten -> Reflux -> Therapieversuch", "medicalLogic": "Chronischer Husten: Reflux, Asthma, Post-Nasal-Drip", "germanAccuracy": "LPR, chronischer Husten, PPI korrekt"},
    ["husten", "reflux", "chronisch", "LPR"]
)

make(
    "Dysurie bei Mann (Alter)", "clinic",
    "68", "mannlich", "Brennen beim Wasserlassen und haufiger Harndrang",
    "Seit 3 Tagen Brennen beim Wasserlassen, muss haufig, auch nachts 3-4x. Gefuhl von unvollstandiger Entleerung. Bekannte Prostatavergroßerung.",
    "Tamsulosin 0.4 mg",
    "Keine",
    "Benigne Prostatahyperplasie",
    "Keine",
    "Rentner",
    ["Fragen Sie nach der genauen Symptomatik", "Fragen Sie nach Fieber und Flankenschmerz", "Fragen Sie nach der Prostataanamnese", "Erklaren Sie den Zusammenhang zwischen HWI und Prostata", "Besprechen Sie die Therapie"],
    ["Hatten Sie Fieber?", "Hatten Sie schon einmal einen Hamwegsinfekt?", "Haben Sie Schmerzen im unteren Rucken?"],
    ["Mannlicher HWI immer als kompliziert betrachten", "Prostatahyperplasie als Risikofaktor"],
    ["Bei Mannern ist ein Hamwegsinfekt immer etwas ernster zu nehmen.", "Die vergroserte Prostata kann die Blasenentleerung behindern."],
    "68-jahriger Patient mit Dysurie, Pollakisurie bei BPH. Kein Fieber. V. a. komplizierten HWI bei BPH. Urinkultur und Antibiose. Reevaluation der BPH-Therapie.",
    {"historyTaking": "Miktion, Fieber, Risikofaktoren", "redFlags": "Fieber, Flankenschmerz, Hamaturie", "patientLanguage": "HWI und Prostata erklaren", "structure": "Symptome -> Risikofaktoren -> Therapie", "medicalLogic": "Komplizierter HWI beim Mann", "germanAccuracy": "BPH, komplizierter HWI korrekt"},
    ["dysurie", "HWI", "prostata", "alter"]
)

# Diabetes
make(
    "Diabetes mellitus Neuentdeckung", "clinic",
    "55", "mannlich", "Gewichtsverlust, Durst, haufiges Wasserlassen",
    "Seit Wochen verstarkter Durst, haufiges Wasserlassen (auch nachts), Mudigkeit, 5 kg Gewichtsverlust in 2 Monaten. Keine Wundheilungsstorungen. Bislang kein Arztbesuch.",
    "Keine",
    "Keine",
    "Keine",
    "Diabetes bei beiden Eltern",
    "Bauunternehmer, ubergewichtich, wenig Bewegung, ungesunde Ernahrung",
    ["Fragen Sie nach den klassischen Diabetes-Symptomen", "Erfragen Sie Risikofaktoren und Familienanamnese", "Fragen Sie nach Folgesymptomen", "Erklaren Sie den Verdacht auf Diabetes", "Besprechen Sie die notigen Untersuchungen und die Therapie"],
    ["Hatten Sie in letzter Zeit vermehrt Durst?", "Mussen Sie nachts oft auf die Toilette?", "Haben Sie ungewollt abgenommen?", "Haben Sie Fussveranderungen oder Sehstorungen bemerkt?"],
    ["Klassische Symptome (Polydipsie, Polyurie, Gewichtsverlust)", "Starke positive Familienanamnese", "Ubergewicht als Risikofaktor"],
    ["Ihre Symptome passen zu einem Diabetes mellitus.", "Wir mussen den Blutzucker und den Langzeitzucker messen."],
    "55-jahriger Patient mit Polydipsie, Polyurie und Gewichtsverlust. Adipositas, positive Familienanamnese. V. a. manifesten Diabetes mellitus Typ 2. Diagnostik: Nuchternblutzucker, HbA1c. Therapie: Ernahrungsumstellung, Bewegung ggf. Metformin.",
    {"historyTaking": "Symptome, Risikofaktoren, Familienanamnese", "redFlags": "Gewichtsverlust, Ketoazidose-Zeichen, Sehstorungen", "patientLanguage": "Diabetes und Stoffwechsel erklaren", "structure": "Symptome -> Risikofaktoren -> Diagnostik -> Therapie", "medicalLogic": "Diabetes-Diagnostik, HbA1c, Therapieeinleitung", "germanAccuracy": "Polydipsie, Polyurie, HbA1c korrekt"},
    ["diabetes", "neudiagnose", "stoffwechsel", "pravention"]
)

# HTN
make(
    "Hypertonie-Krise", "emergency",
    "58", "weiblich", "Starke Kopfschmerzen, Blutdruck 210/120",
    "Seit Stunden starke Kopfschmerzen, Schwindel, Nasenbluten. Vom Hausarzt mit Blutdruck 210/120 mmHg eingewiesen. Bekannter Bluthochdruck, aber Medikamente unregelmassig genommen.",
    "Vom Hausarzt verschrieben: Ramipril 10 mg, aber oft vergessen",
    "Keine",
    "Arterielle Hypertonie seit Jahren",
    "Bluthochdruck bei den Eltern",
    "Krankenschwester (im Ruhestand), lebt allein",
    ["Fragen Sie nach der Symptomatik und ihrer Dauer", "Fragen Sie nach Medikamenteneinnahme", "Fragen Sie nach Endorganschaden (Sehen, Brustschmerz, Atemnot)", "Erklaren Sie die hypertensive Krise", "Besprechen Sie die notige senkung und Anpassung"],
    ["Haben Sie Brustschmerzen oder Atemnot?", "Haben Sie Sehstorungen?", "Haben Sie Ihre Medikamente genommen?"],
    ["Blutdruck deutlich uber 180/120", "Medikamentenadharenez als Ursache", "Hypertensive Notfall mit Endorganschaden? (Sehstorung, Thoraxschmerz)"],
    ["Ihr Blutdruck ist gefahrlich hoch.", "Wir mussen ihn vorsichtig senken und Ihre Medikation neu einstellen."],
    "58-jahrige Patientin mit hypertensiver Krise bei Non-Adharenz. Blutdruck 210/120. Keine Hinweise auf hypertensive Notfall (kein Thoraxschmerz, keine Sehstorung, kein Lungenodem). Blutdrucksenkung po und Therapieoptimierung.",
    {"historyTaking": "Symptome, Medikation, Endorganschaden", "redFlags": "Hypertensive Notfall: Lungenodem, Aortendissektion, Enzephalopathie", "patientLanguage": "Bluthochdruck und Endorganschaden erklaren", "structure": "Symptome -> Blutdruck -> Notfall vs Krise -> Therapie", "medicalLogic": "Hypertensive Krise vs hypertensiver Notfall", "germanAccuracy": "Hypertonie, hypertensive Krise, Endorganschaden korrekt"},
    ["hypertonie", "krise", "notfall", "adharenz"]
)

# Medication side effects
make(
    "Medikamentennebenwirkung: Statin-Muskelschmerzen", "clinic",
    "62", "mannlich", "Muskelschmerzen seit Beginn der Cholesterinsenkertherapie",
    "Seit Beginn von Atorvastatin vor 6 Wochen Muskelschmerzen in beiden Oberschenkeln. Keine Kraftminderung. Keine Gelenkschmerzen. Labor: CK leicht erhoht.",
    "Atorvastatin 20 mg",
    "Keine",
    "Hypercholesterinamie, arterielle Hypertonie",
    "Keine",
    "Buroangestellter, geht 3x/Woche joggen",
    ["Fragen Sie nach dem zeitlichen Zusammenhang", "Fragen Sie nach der genauen Symptomatik", "Bewerten Sie das Risiko-Nutzen-Verhaltnis", "Erklaren Sie die mogliche Nebenwirkung", "Besprechen Sie Alternativen"],
    ["Seit wann genau haben Sie die Muskelschmerzen?", "Haben Sie Kraftminderung?", "Haben Sie Ihren Sport reduziert?"],
    ["Zeitlicher Zusammenhang: Statinbeginn + Muskelschmerzen", "CK-Erhohung bestatigt Verdacht"],
    ["Statine konnen Muskelschmerzen verursachen.", "Wir pausieren das Medikament und schauen, ob die Schmerzen verschwinden."],
    "62-jahriger Patient mit Muskelschmerzen und CK-Erhohung 6 Wochen nach Statinbeginn. V. a. Statin-Myopathie. Therapiepause und Wechsel auf ein alternatives Statin oder Ezetimib erwogen.",
    {"historyTaking": "Zeitlicher Zusammenhang, CK-Werte, Sport", "redFlags": "Rhabdomyolyse, dunkler Urin, starke CK-Erhohung", "patientLanguage": "Statin-Nebenwirkungen erklaren", "structure": "Symptome -> Medikation -> Nebenwirkung -> Alternative", "medicalLogic": "Statin-Myopathie vs andere Ursachen", "germanAccuracy": "Myopathie, CK, Statin korrekt"},
    ["medikamentennebenwirkung", "statin", "muskelschmerz", "myopathie"]
)

with open('../src/data/fspCases.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total cases")
