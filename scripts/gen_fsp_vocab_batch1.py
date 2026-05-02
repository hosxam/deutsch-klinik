import json, os, sys

vocab = [
    # 1-5: General Hospital Vocabulary
    {
        "id": "fsp_v_1", "level": "FSP", "word": "die Aufnahme",
        "article": "die", "plural": null, "translation": "admission",
        "layExplanation": "Wenn ein Patient ins Krankenhaus kommt und offiziell aufgenommen wird.",
        "example": "Der Patient wurde gestern zur Aufnahme in die Klinik gebracht.",
        "exampleTranslation": "The patient was brought to the hospital for admission yesterday.",
        "patientFriendlyPhrase": "Sie werden jetzt aufgenommen. Das heisst, Sie bekommen ein Zimmer und wir kummern uns um Sie.",
        "doctorToDoctorPhrase": "Die Aufnahme erfolgte um 14 Uhr uber die Notaufnahme.",
        "category": "General Hospital", "tags": ["hospital", "admission"]
    },
    {
        "id": "fsp_v_2", "level": "FSP", "word": "die Entlassung",
        "article": "die", "plural": "die Entlassungen", "translation": "discharge",
        "layExplanation": "Wenn der Patient das Krankenhaus wieder verlassen darf.",
        "example": "Die Entlassung ist fur morgen fruh geplant.",
        "exampleTranslation": "The discharge is planned for tomorrow morning.",
        "patientFriendlyPhrase": "Sie konnen morgen nach Hause. Wir besprechen vorher noch alles Wichtige.",
        "doctorToDoctorPhrase": "Entlassung in die hausliche Versorgung bei stabiler Kreislaufsituation.",
        "category": "General Hospital", "tags": ["hospital", "discharge"]
    },
    {
        "id": "fsp_v_3", "level": "FSP", "word": "die Visite",
        "article": "die", "plural": "die Visiten", "translation": "rounds / ward visit",
        "layExplanation": "Der tagliche Besuch des Arztes am Patientenbett.",
        "example": "Die Visite beginnt jeden Morgen um 8 Uhr.",
        "exampleTranslation": "Rounds begin every morning at 8 o'clock.",
        "patientFriendlyPhrase": "Guten Morgen, wir machen jetzt Visite. Ich schaue kurz, wie es Ihnen geht.",
        "doctorToDoctorPhrase": "Bei der Visite zeigte sich der Patient kreislaufstabil.",
        "category": "General Hospital", "tags": ["hospital", "rounds"]
    },
    {
        "id": "fsp_v_4", "level": "FSP", "word": "der Aufnahmebefund",
        "article": "der", "plural": "die Aufnahmebefunde", "translation": "admission findings",
        "layExplanation": "Die erste Untersuchung und der Zustand des Patienten bei der Aufnahme.",
        "example": "Der Aufnahmebefund zeigte einen erhöhten Blutdruck.",
        "exampleTranslation": "The admission findings showed elevated blood pressure.",
        "patientFriendlyPhrase": "Wir haben bei Ihrer Aufnahme alles untersucht und dokumentiert.",
        "doctorToDoctorPhrase": "Aufnahmebefund: 45-jahriger Patient mit akutem Thoraxschmerz.",
        "category": "General Hospital", "tags": ["hospital", "admission"]
    },
    {
        "id": "fsp_v_5", "level": "FSP", "word": "der Verlegung",
        "article": "die", "plural": "die Verlegungen", "translation": "transfer",
        "layExplanation": "Wenn ein Patient in eine andere Abteilung oder ein anderes Krankenhaus gebracht wird.",
        "example": "Die Verlegung auf die Intensivstation war notwendig.",
        "exampleTranslation": "The transfer to the ICU was necessary.",
        "patientFriendlyPhrase": "Wir verlegen Sie auf die Intensivstation, wo Sie besser uberwacht werden konnen.",
        "doctorToDoctorPhrase": "Bei Verschlechterung Verlegung auf ITS erwogen.",
        "category": "General Hospital", "tags": ["hospital", "transfer"]
    },
    # 6-10: Anamnesis Terms
    {
        "id": "fsp_v_6", "level": "FSP", "word": "die Anamnese",
        "article": "die", "plural": "die Anamnesen", "translation": "medical history / anamnesis",
        "layExplanation": "Das Gesprach, bei dem der Arzt die Krankengeschichte des Patienten erfragt.",
        "example": "Zunachst erhebe ich Ihre Anamnese, also Ihre Krankengeschichte.",
        "exampleTranslation": "First I will take your history, meaning your medical history.",
        "patientFriendlyPhrase": "Ich mochte Ihnen jetzt ein paar Fragen zu Ihrer Gesundheit stellen.",
        "doctorToDoctorPhrase": "Anamnese: Typische Angina-pectoris-Symptomatik seit 3 Tagen.",
        "category": "Anamnesis", "tags": ["history", "anamnesis"]
    },
    {
        "id": "fsp_v_7", "level": "FSP", "word": "die Eigenanamnese",
        "article": "die", "plural": "die Eigenanamnesen", "translation": "patient's own medical history",
        "layExplanation": "Die Krankengeschichte, die der Patient selbst berichtet.",
        "example": "In der Eigenanamnese gab der Patient Asthma an.",
        "exampleTranslation": "In his own history, the patient reported asthma.",
        "patientFriendlyPhrase": "Hatten Sie fruher schon einmal gesundheitliche Probleme?",
        "doctorToDoctorPhrase": "Eigenanamnese: Asthma bronchiale seit Kindheit.",
        "category": "Anamnesis", "tags": ["history"]
    },
    {
        "id": "fsp_v_8", "level": "FSP", "word": "die Familienanamnese",
        "article": "die", "plural": "die Familienanamnesen", "translation": "family history",
        "layExplanation": "Informationen uber Krankheiten in der Familie des Patienten.",
        "example": "Die Familienanamnese ergab mehrere Herzinfarkte beim Vater.",
        "exampleTranslation": "The family history revealed several heart attacks in the father.",
        "patientFriendlyPhrase": "Gibt es in Ihrer Familie Erkrankungen wie Herzinfarkt oder Diabetes?",
        "doctorToDoctorPhrase": "Familienanamnese: kardiovaskulare Erkrankungen beim Vater bekannt.",
        "category": "Anamnesis", "tags": ["family", "history"]
    },
    {
        "id": "fsp_v_9", "level": "FSP", "word": "die Sozialanamnese",
        "article": "die", "plural": null, "translation": "social history",
        "layExplanation": "Informationen uber Beruf, Lebensumstande und Gewohnheiten des Patienten.",
        "example": "Die Sozialanamnese ergab starke berufliche Belastung.",
        "exampleTranslation": "The social history revealed high occupational stress.",
        "patientFriendlyPhrase": "Darf ich fragen, was Sie beruflich machen und wie Sie leben?",
        "doctorToDoctorPhrase": "Sozialanamnese: Schichtarbeiter, starker Nikotinkonsum.",
        "category": "Anamnesis", "tags": ["social", "history"]
    },
    {
        "id": "fsp_v_10", "level": "FSP", "word": "der Ausloser",
        "article": "der", "plural": "die Ausloser", "translation": "trigger",
        "layExplanation": "Der Ausloser ist das Ereignis, das die Beschwerden gestartet hat.",
        "example": "Der Ausloser der Schmerzen war schweres Heben.",
        "exampleTranslation": "The trigger of the pain was heavy lifting.",
        "patientFriendlyPhrase": "Gab es etwas Bestimmtes, das die Schmerzen ausgelost hat?",
        "doctorToDoctorPhrase": "Als Ausloser wurde heavy lifting angegeben.",
        "category": "Anamnesis", "tags": ["anamnesis", "trigger"]
    },
    # 11-15: Symptoms
    {
        "id": "fsp_v_11", "level": "FSP", "word": "das Symptom",
        "article": "das", "plural": "die Symptome", "translation": "symptom",
        "layExplanation": "Ein Zeichen oder eine Beschwerde, die auf eine Krankheit hinweist.",
        "example": "Die Symptome begannen vor drei Tagen.",
        "exampleTranslation": "The symptoms began three days ago.",
        "patientFriendlyPhrase": "Welche Symptome haben Sie genau bemerkt?",
        "doctorToDoctorPhrase": "Die Symptomatik ist vereinbar mit einem akuten Koronarsyndrom.",
        "category": "Symptoms", "tags": ["symptom"]
    },
    {
        "id": "fsp_v_12", "level": "FSP", "word": "die Beschwerde",
        "article": "die", "plural": "die Beschwerden", "translation": "complaint / discomfort",
        "layExplanation": "Das, was dem Patienten wehtut oder Probleme macht.",
        "example": "Der Patient klagt uber stechende Beschwerden in der Brust.",
        "exampleTranslation": "The patient complains of stabbing discomfort in the chest.",
        "patientFriendlyPhrase": "Was fur Beschwerden haben Sie?",
        "doctorToDoctorPhrase": "Hauptbeschwerde: retrosternales Druckgefuhl.",
        "category": "Symptoms", "tags": ["symptom", "complaint"]
    },
    {
        "id": "fsp_v_13", "level": "FSP", "word": "das Krankheitsgefuhl",
        "article": "das", "plural": null, "translation": "feeling of illness / malaise",
        "layExplanation": "Das allgemeine Gefuhl, krank zu sein, ohne genaue Ursache.",
        "example": "Der Patient berichtet uber ein allgemeines Krankheitsgefuhl seit einer Woche.",
        "exampleTranslation": "The patient reports general malaise for one week.",
        "patientFriendlyPhrase": "Fuhlen Sie sich allgemein krank oder haben Sie konkrete Schmerzen?",
        "doctorToDoctorPhrase": "Allgemeines Krankheitsgefuhl bei subfebrilen Temperaturen.",
        "category": "Symptoms", "tags": ["symptom", "malaise"]
    },
    {
        "id": "fsp_v_14", "level": "FSP", "word": "die Schmerzausstrahlung",
        "article": "die", "plural": "die Schmerzausstrahlungen", "translation": "radiation of pain",
        "layExplanation": "Wenn der Schmerz von einer Stelle in andere Korperregionen ausstrahlt.",
        "example": "Die Schmerzausstrahlung erfolgt in den linken Arm.",
        "exampleTranslation": "The pain radiates into the left arm.",
        "patientFriendlyPhrase": "Strahlten die Schmerzen in andere Korperteile aus?",
        "doctorToDoctorPhrase": "Schmerzausstrahlung in den linken Arm und Kiefer.",
        "category": "Symptoms", "tags": ["pain", "symptom"]
    },
    {
        "id": "fsp_v_15", "level": "FSP", "word": "der Schweregrad",
        "article": "der", "plural": "die Schweregrade", "translation": "severity",
        "layExplanation": "Wie stark die Beschwerden sind.",
        "example": "Der Schweregrad der Schmerzen wurde mit 8 von 10 angegeben.",
        "exampleTranslation": "The severity of pain was rated 8 out of 10.",
        "patientFriendlyPhrase": "Auf einer Skala von 1 bis 10, wie stark sind die Schmerzen?",
        "doctorToDoctorPhrase": "Schweregrad der Dyspnoe nach NYHA III.",
        "category": "Symptoms", "tags": ["severity", "symptom"]
    },
    # 16-20: Pain Description
    {
        "id": "fsp_v_16", "level": "FSP", "word": "stechend",
        "article": null, "plural": null, "translation": "stabbing",
        "layExplanation": "Ein Schmerz, der sich anfuhlt wie ein Stich mit einer Nadel.",
        "example": "Der Patient beschreibt stechende Schmerzen hinter dem Brustbein.",
        "exampleTranslation": "The patient describes stabbing pain behind the sternum.",
        "patientFriendlyPhrase": "Fuhlt es sich an wie ein Stechen oder eher wie ein Druck?",
        "doctorToDoctorPhrase": "Stechende retrosternale Schmerzen, typisch fur Perikarditis.",
        "category": "Pain Description", "tags": ["pain", "quality"]
    },
    {
        "id": "fsp_v_17", "level": "FSP", "word": "dumpf",
        "article": null, "plural": null, "translation": "dull",
        "layExplanation": "Ein Schmerz, der nicht scharf ist, sondern eher wie ein Druckgefuhl.",
        "example": "Die Kopfschmerzen werden als dumpf und drueckend beschrieben.",
        "exampleTranslation": "The headaches are described as dull and pressing.",
        "patientFriendlyPhrase": "Ist der Schmerz eher dumpf und drueckend oder scharf und stechend?",
        "doctorToDoctorPhrase": "Dumpfe Oberbauchschmerzen, typisch fur eine Pankreatitis.",
        "category": "Pain Description", "tags": ["pain", "quality"]
    },
    {
        "id": "fsp_v_18", "level": "FSP", "word": "kolikartig",
        "article": null, "plural": null, "translation": "colicky / cramping",
        "layExplanation": "Wellenförmige Schmerzen, die kommen und gehen, wie bei Bauchkrämpfen.",
        "example": "Die Bauchschmerzen sind kolikartig und treten wellenförmig auf.",
        "exampleTranslation": "The abdominal pain is colicky and occurs in waves.",
        "patientFriendlyPhrase": "Kommen die Schmerzen in Wellen oder sind sie dauerhaft?",
        "doctorToDoctorPhrase": "Kolikartige Schmerzen im rechten Unterbauch, Verdacht auf Nierenstein.",
        "category": "Pain Description", "tags": ["pain", "quality"]
    },
    {
        "id": "fsp_v_19", "level": "FSP", "word": "brennend",
        "article": null, "plural": null, "translation": "burning",
        "layExplanation": "Ein Schmerz, der sich anfuhlt wie ein Brennen auf der Haut oder im Korper.",
        "example": "Der Patient klagt uber brennende Schmerzen in der Speiserohre.",
        "exampleTranslation": "The patient complains of burning pain in the esophagus.",
        "patientFriendlyPhrase": "Fuhlt es sich brennend an, zum Beispiel wie Sodbrennen?",
        "doctorToDoctorPhrase": "Brennende epigastrische Schmerzen, typisch fur Refluxösophagitis.",
        "category": "Pain Description", "tags": ["pain", "quality"]
    },
    {
        "id": "fsp_v_20", "level": "FSP", "word": "der Druckschmerz",
        "article": "der", "plural": "die Druckschmerzen", "translation": "tenderness / pressure pain",
        "layExplanation": "Schmerz, der entsteht, wenn man auf eine bestimmte Stelle druckt.",
        "example": "Bei der Untersuchung zeigte sich ein Druckschmerz im rechten Oberbauch.",
        "exampleTranslation": "On examination, tenderness was found in the right upper abdomen.",
        "patientFriendlyPhrase": "Tut es weh, wenn ich hier drucke?",
        "doctorToDoctorPhrase": "Druckschmerz im rechten Oberbauch mit Loslassschmerz.",
        "category": "Pain Description", "tags": ["pain", "tenderness"]
    },
    # 21-25: Cardiovascular
    {
        "id": "fsp_v_21", "level": "FSP", "word": "der Herzinfarkt",
        "article": "der", "plural": "die Herzinfarkte", "translation": "heart attack / myocardial infarction",
        "layExplanation": "Wenn ein Blutgefass im Herzen blockiert ist und Herzmuskelgewebe abstirbt.",
        "example": "Der Patient erlitt einen akuten Herzinfarkt.",
        "exampleTranslation": "The patient suffered an acute heart attack.",
        "patientFriendlyPhrase": "Sie haben einen Herzinfarkt. Das bedeutet, dass ein Blutgefass in Ihrem Herzen verschlossen ist.",
        "doctorToDoctorPhrase": "Akuter ST-Hebungsinfarkt der Vorderwand.",
        "category": "Cardiovascular", "tags": ["cardio", "infarction"]
    },
    {
        "id": "fsp_v_22", "level": "FSP", "word": "die Angina pectoris",
        "article": "die", "plural": null, "translation": "angina pectoris",
        "layExplanation": "Ein Druck- oder Engegefuhl in der Brust, weil das Herz nicht genug Sauerstoff bekommt.",
        "example": "Der Patient klagt uber Angina-pectoris-Beschwerden bei Belastung.",
        "exampleTranslation": "The patient complains of angina symptoms on exertion.",
        "patientFriendlyPhrase": "Haben Sie ein Engegefuhl in der Brust, zum Beispiel beim Treppensteigen?",
        "doctorToDoctorPhrase": "Stabile Angina pectoris CCS II bei bekannter KHK.",
        "category": "Cardiovascular", "tags": ["cardio", "angina"]
    },
    {
        "id": "fsp_v_23", "level": "FSP", "word": "die Herzinsuffizienz",
        "article": "die", "plural": null, "translation": "heart failure",
        "layExplanation": "Das Herz pumpt nicht mehr stark genug, um den Korper ausreichend mit Blut zu versorgen.",
        "example": "Der Patient wird wegen einer dekompensierten Herzinsuffizienz stationar aufgenommen.",
        "exampleTranslation": "The patient is admitted for decompensated heart failure.",
        "patientFriendlyPhrase": "Ihr Herz pumpt nicht mehr so kräftig, deshalb haben Sie Wasser in den Beinen und werden schnell luftarm.",
        "doctorToDoctorPhrase": "Dekompensierte Herzinsuffizienz bei eingeschrankter LV-Funktion.",
        "category": "Cardiovascular", "tags": ["cardio", "heart failure"]
    },
    {
        "id": "fsp_v_24", "level": "FSP", "word": "der Blutdruck",
        "article": "der", "plural": "die Blutdruckwerte", "translation": "blood pressure",
        "layExplanation": "Der Druck, mit dem das Blut durch die Arterien stromt.",
        "example": "Der Blutdruck betragt 150/90 mmHg.",
        "exampleTranslation": "The blood pressure is 150/90 mmHg.",
        "patientFriendlyPhrase": "Ihr Blutdruck ist ein bisschen hoch. Wir werden das im Auge behalten.",
        "doctorToDoctorPhrase": "Blutdruck bei Aufnahme 150/90 mmHg, keine antihypertensive Therapie.",
        "category": "Cardiovascular", "tags": ["cardio", "vital"]
    },
    {
        "id": "fsp_v_25", "level": "FSP", "word": "die Rhythmusstorung",
        "article": "die", "plural": "die Rhythmusstorungen", "translation": "arrhythmia",
        "layExplanation": "Wenn das Herz unregelmassig oder zu schnell oder zu langsam schlagt.",
        "example": "Im EKG zeigte sich eine Rhythmusstorung.",
        "exampleTranslation": "The ECG showed an arrhythmia.",
        "patientFriendlyPhrase": "Ihr Herz schlagt manchmal unregelmassig. Das nennt man Rhythmusstorung.",
        "doctorToDoctorPhrase": "Vorhofflimmern mit absoluter Arrhythmie, ventrikulare Frequenz um 110/min.",
        "category": "Cardiovascular", "tags": ["cardio", "arrhythmia"]
    },
    # 26-30: Respiratory
    {
        "id": "fsp_v_26", "level": "FSP", "word": "die Atemnot",
        "article": "die", "plural": null, "translation": "shortness of breath / dyspnea",
        "layExplanation": "Das Gefühl, nicht genug Luft zu bekommen.",
        "example": "Der Patient leidet seit Tagen unter zunehmender Atemnot.",
        "exampleTranslation": "The patient has been suffering from progressive shortness of breath for days.",
        "patientFriendlyPhrase": "Haben Sie das Gefühl, nicht genug Luft zu bekommen?",
        "doctorToDoctorPhrase": "Ruhedyspnoe bei bekanter COPD GOLD III.",
        "category": "Respiratory", "tags": ["resp", "dyspnea"]
    },
    {
        "id": "fsp_v_27", "level": "FSP", "word": "der Husten",
        "article": "der", "plural": null, "translation": "cough",
        "layExplanation": "Das reflektorische Ausstoen von Luft aus den Atemwegen.",
        "example": "Der Husten besteht seit etwa zwei Wochen.",
        "exampleTranslation": "The cough has been present for about two weeks.",
        "patientFriendlyPhrase": "Haben Sie Husten und wenn ja, kommt etwas dabei hoch?",
        "doctorToDoctorPhrase": "Produktiver Husten mit gelblichem Auswurf.",
        "category": "Respiratory", "tags": ["resp", "cough"]
    },
    {
        "id": "fsp_v_28", "level": "FSP", "word": "der Auswurf",
        "article": "der", "plural": null, "translation": "sputum / phlegm",
        "layExplanation": "Das Sekret, das beim Husten aus der Lunge hochkommt.",
        "example": "Der Auswurf ist gelblich und zäh.",
        "exampleTranslation": "The sputum is yellowish and thick.",
        "patientFriendlyPhrase": "Kommt beim Husten etwas hoch? Welche Farbe hat das?",
        "doctorToDoctorPhrase": "Eitriger Auswurf, farblos bis gelblich.",
        "category": "Respiratory", "tags": ["resp", "sputum"]
    },
    {
        "id": "fsp_v_29", "level": "FSP", "word": "die Lungenentzündung",
        "article": "die", "plural": "die Lungenentzündungen", "translation": "pneumonia",
        "layExplanation": "Eine Entzündung im Lungengewebe, oft durch Bakterien oder Viren verursacht.",
        "example": "Die Diagnose lautet Lungenentzündung des rechten Unterlappens.",
        "exampleTranslation": "The diagnosis is pneumonia of the right lower lobe.",
        "patientFriendlyPhrase": "Sie haben eine Lungenentzündung. Das ist eine Infektion in Ihrer Lunge, die wir mit Antibiotika behandeln.",
        "doctorToDoctorPhrase": "Ambulant erworbene Pneumonie des rechten Unterlappens, CRB-65 Score 1.",
        "category": "Respiratory", "tags": ["resp", "pneumonia"]
    },
    {
        "id": "fsp_v_30", "level": "FSP", "word": "die Sauerstoffsattigung",
        "article": "die", "plural": "die Sauerstoffsattigungen", "translation": "oxygen saturation",
        "layExplanation": "Der Anteil des Sauerstoffs im Blut, gemessen in Prozent.",
        "example": "Die Sauerstoffsattigung betragt 94 Prozent unter Raumluft.",
        "exampleTranslation": "The oxygen saturation is 94 percent on room air.",
        "patientFriendlyPhrase": "Ihr Sauerstoffgehalt im Blut ist ein wenig niedrig. Sie bekommen zusatzlich Sauerstoff.",
        "doctorToDoctorPhrase": "SpO2 88% unter Raumluft, 2 Liter O2 erforderlich.",
        "category": "Respiratory", "tags": ["resp", "oxygen"]
    },
    # 31-35: Gastrointestinal
    {
        "id": "fsp_v_31", "level": "FSP", "word": "die Übelkeit",
        "article": "die", "plural": null, "translation": "nausea",
        "layExplanation": "Das Gefühl, sich übergeben zu müssen.",
        "example": "Der Patient klagt über starke Übelkeit nach dem Essen.",
        "exampleTranslation": "The patient complains of severe nausea after eating.",
        "patientFriendlyPhrase": "Ist Ihnen übel? Müssen Sie sich übergeben?",
        "doctorToDoctorPhrase": "Postprandiale Übelkeit ohne Erbrechen.",
        "category": "Gastrointestinal", "tags": ["gi", "nausea"]
    },
    {
        "id": "fsp_v_32", "level": "FSP", "word": "das Erbrechen",
        "article": "das", "plural": null, "translation": "vomiting",
        "layExplanation": "Wenn der Mageninhalt durch den Mund wieder herauskommt.",
        "example": "Das Erbrechen trat mehrmals täglich auf.",
        "exampleTranslation": "The vomiting occurred several times a day.",
        "patientFriendlyPhrase": "Mussten Sie sich schon übergeben?",
        "doctorToDoctorPhrase": "Wiederholtes Erbrechen, zuletzt gallig.",
        "category": "Gastrointestinal", "tags": ["gi", "vomiting"]
    },
    {
        "id": "fsp_v_33", "level": "FSP", "word": "der Durchfall",
        "article": "der", "plural": null, "translation": "diarrhea",
        "layExplanation": "Häufiger, dünner Stuhlgang.",
        "example": "Seit drei Tagen leidet der Patient unter wässrigem Durchfall.",
        "exampleTranslation": "For three days the patient has had watery diarrhea.",
        "patientFriendlyPhrase": "Haben Sie Durchfall oder ist der Stuhlgang normal?",
        "doctorToDoctorPhrase": "Wässrige Diarrhoe, 5-6 Stühle pro Tag.",
        "category": "Gastrointestinal", "tags": ["gi", "diarrhea"]
    },
    {
        "id": "fsp_v_34", "level": "FSP", "word": "die Verstopfung",
        "article": "die", "plural": null, "translation": "constipation",
        "layExplanation": "Wenn der Stuhlgang selten und hart ist oder Schmerzen beim Stuhlgang verursacht.",
        "example": "Die Verstopfung besteht seit mehreren Tagen.",
        "exampleTranslation": "The constipation has been present for several days.",
        "patientFriendlyPhrase": "Hatten Sie in letzter Zeit Probleme mit dem Stuhlgang?",
        "doctorToDoctorPhrase": "Seit 5 Tagen Obstipation trotz Laxanzien.",
        "category": "Gastrointestinal", "tags": ["gi", "constipation"]
    },
    {
        "id": "fsp_v_35", "level": "FSP", "word": "der Oberbauchschmerz",
        "article": "der", "plural": "die Oberbauchschmerzen", "translation": "epigastric pain / upper abdominal pain",
        "layExplanation": "Schmerzen im oberen Bereich des Bauches, direkt unter dem Brustbein.",
        "example": "Der Patient klagt über Oberbauchschmerzen nach den Mahlzeiten.",
        "exampleTranslation": "The patient complains of upper abdominal pain after meals.",
        "patientFriendlyPhrase": "Wo genau tut der Bauch weh? Hier oben oder eher unten?",
        "doctorToDoctorPhrase": "Epigastrische Schmerzen mit Ausstrahlung in den Rücken.",
        "category": "Gastrointestinal", "tags": ["gi", "pain"]
    },
    # 36-40: Neurology
    {
        "id": "fsp_v_36", "level": "FSP", "word": "der Schlaganfall",
        "article": "der", "plural": "die Schlaganfälle", "translation": "stroke",
        "layExplanation": "Wenn die Blutversorgung im Gehirn unterbrochen wird und Hirngewebe abstirbt.",
        "example": "Der Patient wurde mit Verdacht auf Schlaganfall eingeliefert.",
        "exampleTranslation": "The patient was admitted with suspected stroke.",
        "patientFriendlyPhrase": "Sie haben einen Schlaganfall. Das bedeutet, dass Ihr Gehirn nicht genug Durchblutung bekommt.",
        "doctorToDoctorPhrase": "Akuter ischämischer Schlaganfall im Versorgungsgebiet der A. cerebri media links.",
        "category": "Neurology", "tags": ["neuro", "stroke"]
    },
    {
        "id": "fsp_v_37", "level": "FSP", "word": "der Schwindel",
        "article": "der", "plural": null, "translation": "dizziness / vertigo",
        "layExplanation": "Das Gefühl, dass sich alles dreht oder man unsicher auf den Beinen ist.",
        "example": "Der Schwindel tritt plötzlich auf und hält etwa 30 Sekunden an.",
        "exampleTranslation": "The dizziness appears suddenly and lasts about 30 seconds.",
        "patientFriendlyPhrase": "Ist Ihnen schwindelig? Dreht sich alles oder fühlen Sie sich nur benommen?",
        "doctorToDoctorPhrase": "Anfallsartiger Drehschwindel mit Nystagmus.",
        "category": "Neurology", "tags": ["neuro", "dizziness"]
    },
    {
        "id": "fsp_v_38", "level": "FSP", "word": "die Lähmung",
        "article": "die", "plural": "die Lähmungen", "translation": "paralysis",
        "layExplanation": "Wenn man einen Körperteil nicht mehr bewegen kann.",
        "example": "Der Patient zeigt eine Lähmung der rechten Körperseite.",
        "exampleTranslation": "The patient shows paralysis of the right side of the body.",
        "patientFriendlyPhrase": "Können Sie beide Arme und Beine bewegen?",
        "doctorToDoctorPhrase": "Hemiparese rechts, Betonung des Arms.",
        "category": "Neurology", "tags": ["neuro", "paralysis"]
    },
    {
        "id": "fsp_v_39", "level": "FSP", "word": "die Migräne",
        "article": "die", "plural": "die Migränen", "translation": "migraine",
        "layExplanation": "Starke, oft einseitige Kopfschmerzen, manchmal mit Übelkeit und Lichtempfindlichkeit.",
        "example": "Die Migräneattacken treten etwa einmal pro Monat auf.",
        "exampleTranslation": "The migraine attacks occur about once a month.",
        "patientFriendlyPhrase": "Haben Sie starke, pochende Kopfschmerzen, vielleicht nur auf einer Seite?",
        "doctorToDoctorPhrase": "Migräne mit Aura, typische einseitige Kopfschmerzen mit Übelkeit.",
        "category": "Neurology", "tags": ["neuro", "migraine"]
    },
    {
        "id": "fsp_v_40", "level": "FSP", "word": "das Krampfanfall",
        "article": "der", "plural": "die Krampfanfälle", "translation": "seizure",
        "layExplanation": "Wenn der Körper unkontrolliert zuckt und man das Bewusstsein verlieren kann.",
        "example": "Der Patient hatte gestern einen ersten Krampfanfall.",
        "exampleTranslation": "The patient had a first seizure yesterday.",
        "patientFriendlyPhrase": "Hatten Sie schon einmal einen Krampfanfall?",
        "doctorToDoctorPhrase": "Generalisierter tonisch-klonischer Krampfanfall, Erstmanifestation.",
        "category": "Neurology", "tags": ["neuro", "seizure"]
    },
    # Continue with more entries...

    # Adding more entries up to 100
    # 41-45: Musculoskeletal
    {
        "id": "fsp_v_41", "level": "FSP", "word": "der Bandscheibenvorfall",
        "article": "der", "plural": "die Bandscheibenvorfälle", "translation": "herniated disc / slipped disc",
        "layExplanation": "Wenn eine Bandscheibe zwischen den Wirbeln verrutscht und auf Nerven drückt.",
        "example": "Der Patient wurde wegen eines Bandscheibenvorfalls operiert.",
        "exampleTranslation": "The patient was operated on for a herniated disc.",
        "patientFriendlyPhrase": "Sie haben einen Bandscheibenvorfall. Das bedeutet, dass eine der Polster zwischen Ihren Wirbeln auf einen Nerv drückt.",
        "doctorToDoctorPhrase": "Medianer Bandscheibenvorfall L4/L5 mit Nervenwurzelkompression.",
        "category": "Musculoskeletal", "tags": ["ortho", "spine"]
    },
    {
        "id": "fsp_v_42", "level": "FSP", "word": "der Gelenkerguss",
        "article": "der", "plural": "die Gelenkergüsse", "translation": "joint effusion",
        "layExplanation": "Flüssigkeitsansammlung in einem Gelenk, das dann geschwollen ist.",
        "example": "Das Knie zeigt einen deutlichen Gelenkerguss.",
        "exampleTranslation": "The knee shows a marked joint effusion.",
        "patientFriendlyPhrase": "Ihr Knie ist geschwollen, weil sich Flüssigkeit darin angesammelt hat.",
        "doctorToDoctorPhrase": "Kniegelenkerguss rechts bei bekannter Gonarthrose.",
        "category": "Musculoskeletal", "tags": ["ortho", "joint"]
    },
    {
        "id": "fsp_v_43", "level": "FSP", "word": "die Arthrose",
        "article": "die", "plural": "die Arthrosen", "translation": "osteoarthritis",
        "layExplanation": "Verschleiß des Knorpels in einem Gelenk,