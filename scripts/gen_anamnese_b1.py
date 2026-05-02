import json, sys

items = []
def a(qid, cat, question, english, patient, followups, notes, tags):
    items.append({
        "id": qid,
        "category": cat,
        "doctorQuestion": question,
        "simpleEnglish": english,
        "patientPossibleAnswer": patient,
        "followUpQuestions": followups,
        "notes": notes,
        "tags": tags
    })

# 1-5: Begrüßung (Greeting / Opening)
a("ana_001", "Begrüßung",
   "Guten Morgen, Herr Müller. Ich bin Frau Dr. Weber. Setzen Sie sich doch bitte. Wie kann ich Ihnen helfen?",
   "Good morning Mr. Muller. I'm Dr. Weber. Please have a seat. How can I help you?",
   "Guten Morgen, Frau Doktor. Ich habe Schmerzen in der Brust.",
   ["Darf ich Ihnen noch ein paar Fragen zu Ihren Beschwerden stellen?", "Sind Sie zum ersten Mal bei uns in der Praxis?"],
   "Always introduce yourself and greet the patient formally. Use 'Sie' unless the patient is a child. The 'Praxis' context assumes outpatient.",
   ["begrüßung", "introduction", "formal"])

a("ana_002", "Begrüßung",
   "Hallo, ich bin der Pfleger hier auf Station. Ich werde Sie heute versorgen. Wie geht es Ihnen?",
   "Hello, I'm the nurse on this ward. I'll be taking care of you today. How are you feeling?",
   "Ganz gut, aber die Schmerzen sind noch da.",
   ["Haben Sie heute schon etwas gegessen?", "Haben Sie gut geschlafen?"],
   "Nurses also take histories in German hospitals. 'Pfleger' / 'Pflegekraft' is common.",
   ["begrüßung", "nurse", "ward"])

a("ana_003", "Begrüßung",
   "Guten Tag, mein Name ist Dr. Schmidt. Ich bin der zuständige Stationsarzt. Darf ich mich zu Ihnen setzen?",
   "Good day, my name is Dr. Schmidt. I'm the ward doctor responsible for you. May I sit down with you?",
   "Ja, gerne. Danke, dass Sie kommen.",
   ["Wie geht es Ihnen heute im Vergleich zu gestern?", "Haben Sie Fragen zu Ihrer Behandlung?"],
   "In hospital settings, ward doctors introduce themselves clearly. Asking to sit shows respect and puts the patient at ease.",
   ["begrüßung", "ward doctor", "station"])

a("ana_004", "Begrüßung",
   "Schön, dass Sie da sind. Nehmen Sie bitte Platz. Ich bin Frau Dr. Koch und werde heute Ihr Erstgespräch mit Ihnen führen.",
   "Nice to have you here. Please take a seat. I'm Dr. Koch and I'll be conducting your initial consultation today.",
   "Vielen Dank. Ich bin ein bisschen nervös.",
   ["Das brauchen Sie nicht zu sein. Wir besprechen alles in Ruhe.", "Haben Sie schon einmal so ein Gespräch geführt?"],
   "'Erstgespräch' is common in outpatient clinics and psychiatric contexts. Reassure the patient.",
   ["begrüßung", "first visit", "outpatient"])

a("ana_005", "Begrüßung",
   "Guten Tag, ich bin der Medizinstudent im Praktikum. Darf ich Ihnen unter Aufsicht von Frau Dr. Weber ein paar Fragen stellen?",
   "Good day, I'm the medical student on placement. May I ask you a few questions under the supervision of Dr. Weber?",
   "Ja, klar. Fragen Sie nur.",
   ["Sind Sie damit einverstanden, dass der Student das Gespräch führt?", "Haben Sie schon Erfahrung mit Studentengesprächen?"],
   "Medical students must identify themselves as such and mention supervision. Patients have the right to refuse.",
   ["begrüßung", "student", "supervision"])

# 6-8: Identifikation (Identifying the patient)
a("ana_006", "Identifikation",
   "Darf ich zunächst Ihre Personalien aufnehmen? Wie ist Ihr vollständiger Name?",
   "May I first take down your personal details? What is your full name?",
   "Ja, mein Name ist Klaus-Peter Schneider.",
   ["Und Ihr Geburtsdatum?", "Und Ihre Adresse, bitte?"],
   "Always confirm patient identity before proceeding. In FSP, this is a standard step in history-taking.",
   ["identifikation", "name", "identity"])

a("ana_007", "Identifikation",
   "Können Sie mir bitte Ihr Geburtsdatum und Ihr Alter sagen?",
   "Could you please tell me your date of birth and age?",
   "Ich bin am 14. März 1978 geboren, also 48 Jahre alt.",
   ["Und wo wohnen Sie?", "Sind Sie hier in der Stadt gemeldet?"],
   "In FSP, birth date confirmation is a patient safety step. Ask even if you have the chart.",
   ["identifikation", "age", "birth date"])

a("ana_008", "Identifikation",
   "Ich brauche für die Unterlagen noch Ihre Krankenversicherungsdaten. Bei welcher Krankenkasse sind Sie versichert?",
   "I need your health insurance details for the records. Which health insurance are you with?",
   "Ich bin bei der AOK versichert.",
   ["Haben Sie Ihre Versichertenkarte dabei?", "Sind Sie privat oder gesetzlich versichert?"],
   "Insurance details are essential in German clinical settings. Either the doctor or the administrative staff may ask.",
   ["identifikation", "insurance", "administration"])

# 9-12: Hauptbeschwerde (Chief complaint)
a("ana_009", "Hauptbeschwerde",
   "Was führt Sie heute zu mir? Was ist Ihr Hauptproblem?",
   "What brings you to me today? What is your main problem?",
   "Ich habe seit gestern starke Kopfschmerzen und mir ist übel.",
   ["Seit wann haben Sie diese Beschwerden?", "Hatten Sie das schon einmal?"],
   "The classic opening for the chief complaint. Stay open-ended. Let the patient tell their story first.",
   ["hauptbeschwerde", "chief complaint", "open question"])

a("ana_010", "Hauptbeschwerde",
   "Was genau bereitet Ihnen momentan die größten Probleme?",
   "What exactly is causing you the most trouble right now?",
   "Am meisten stört mich, dass ich kaum Luft bekomme, wenn ich Treppen steige.",
   ["Seit wann geht das?", "Haben Sie das in Ruhe auch?"],
   "This phrasing gently prioritizes the patient's main concern. Useful for patients with multiple symptoms.",
   ["hauptbeschwerde", "prioritizing"])

a("ana_011", "Hauptbeschwerde",
   "Können Sie mir mit Ihren eigenen Worten schildern, was passiert ist?",
   "Can you describe in your own words what happened?",
   "Ich war beim Gärtnern und plötzlich hat es im Rücken gezwickt.",
   ["Was haben Sie genau gemacht, als der Schmerz anfing?", "Konnten Sie sich danach noch bewegen?"],
   "'Mit eigenen Worten' is a patient-friendly phrase that invites narrative. Good for acute presentations.",
   ["hauptbeschwerde", "narrative"])

a("ana_012", "Hauptbeschwerde",
   "Seit wann bestehen Ihre Beschwerden genau?",
   "Exactly since when have your symptoms been present?",
   "So etwa seit drei Tagen, aber heute ist es viel schlimmer geworden.",
   ["Hatten Sie die Beschwerden schon einmal?", "Haben Sie etwas unternommen dagegen?"],
   "Always get a clear timeline. 'Seit wann' is essential in every anamnesis.",
   ["hauptbeschwerde", "timeline"])

# 13-17: Aktuelle Anamnese (Current history)
a("ana_013", "Aktuelle Anamnese",
   "Haben Sie die Beschwerden zum ersten Mal oder kennen Sie das schon?",
   "Are you having these symptoms for the first time or do you know them already?",
   "Das hatte ich noch nie. So etwas ist mir zum ersten Mal passiert.",
   ["Gab es in der Vergangenheit ähnliche Beschwerden?", "Haben Sie früher schon einmal wegen der gleichen Sache einen Arzt aufgesucht?"],
   "Distinguishing first episode from recurrence is clinically important.",
   ["aktuelle anamnese", "first episode", "recurrence"])

a("ana_014", "Aktuelle Anamnese",
   "Haben Sie in den letzten Tagen etwas unternommen, um die Beschwerden zu lindern?",
   "Have you done anything in the past few days to relieve the symptoms?",
   "Ich habe eine Schmerztablette genommen, aber die hat nicht geholfen.",
   ["Welches Medikament haben Sie genommen?", "Wie viel haben Sie genommen?", "Hat es etwas gebracht?"],
   "Check what self-medication the patient has tried before presenting. Important for medication history.",
   ["aktuelle anamnese", "self-medication", "relief"])

a("ana_015", "Aktuelle Anamnese",
   "Waren Sie deswegen schon bei einem anderen Arzt?",
   "Have you already seen another doctor about this?",
   "Ja, mein Hausarzt hat mich überwiesen. Er meinte, ich solle ins Krankenhaus.",
   ["Was hat der Arzt gesagt?", "Welche Untersuchungen wurden schon gemacht?"],
   "Important in FSP to determine what prior medical assessment has occurred.",
   ["aktuelle anamnese", "prior visit", "referral"])

a("ana_016", "Aktuelle Anamnese",
   "Haben Sie Fieber gemessen? Falls ja, wie hoch war die Temperatur?",
   "Have you taken your temperature? If yes, how high was it?",
   "Ja, gestern Abend hatte ich 38,5 Grad Fieber.",
   ["Hatten Sie Schüttelfrost?", "Seit wann haben Sie Fieber?"],
   "Fever history is basic but essential. Women may have slightly higher baseline temperatures.",
   ["aktuelle anamnese", "fever", "temperature"])

a("ana_017", "Aktuelle Anamnese",
   "Wie ist der Verlauf Ihrer Beschwerden? Sind sie besser, gleich oder schlechter geworden?",
   "How has the course of your symptoms been? Have they improved, stayed the same, or worsened?",
   "Eigentlich wird es von Tag zu Tag schlimmer.",
   ["Seit wann bemerken Sie die Verschlechterung?", "Gibt es etwas, das die Beschwerden bessert oder verschlechtert?"],
   "Documenting the trajectory is key. 'Progredienter Verlauf' or 'gleichbleibend' are standard chart entries.",
   ["aktuelle anamnese", "course", "progression"])

# 18-22: Schmerzbeschreibung (Pain description)
a("ana_018", "Schmerzbeschreibung",
   "Wo genau tut es weh? Können Sie mir die Stelle zeigen?",
   "Where exactly does it hurt? Can you show me the spot?",
   "Hier vorne in der Brust, ungefähr in der Mitte.",
   ["Zeigen Sie bitte mit einem Finger auf die schmerzende Stelle.", "Strahlte der Schmerz in andere Regionen aus?"],
   "Let the patient point. One finger localization is more precise than gesturing. In FSP, this demonstrates you can elicit quality of pain.",
   ["schmerzbeschreibung", "localization", "pointing"])

a("ana_019", "Schmerzbeschreibung",
   "Wie fühlt sich der Schmerz an? Ist er stechend, drückend, brennend oder eher dumpf?",
   "What does the pain feel like? Is it stabbing, pressing, burning, or rather dull?",
   "Eher drückend, wie wenn jemand auf meiner Brust sitzt.",
   ["Tritt der Schmerz anfallsweise auf oder ist er dauerhaft?", "Pocht er im Takt Ihres Herzschlags?"],
   "Offer categories but don't lead too strongly. The patient's spontaneous description is most valuable.",
   ["schmerzbeschreibung", "quality", "character"])

a("ana_020", "Schmerzbeschreibung",
   "Auf einer Skala von 1 bis 10, wobei 1 kaum spürbar und 10 der stärkste vorstellbare Schmerz ist: Wie stark sind Ihre Schmerzen jetzt?",
   "On a scale of 1 to 10, where 1 is barely noticeable and 10 is the worst imaginable pain, how strong is your pain right now?",
   "Im Moment etwa eine 6. Auf dem Höhepunkt war es eine 9.",
   ["Und wie stark war der Schmerz auf dem Höhepunkt?", "Haben Sie nach der Einnahme von Schmerzmitteln nachgefragt?"],
   "NRS (Numeric Rating Scale) is standard. Follow up with worst and best scores.",
   ["schmerzbeschreibung", "severity", "NRS"])

a("ana_021", "Schmerzbeschreibung",
   "Seit wann haben Sie die Schmerzen genau? Haben sie plötzlich angefangen oder sind sie langsam gekommen?",
   "Exactly since when do you have the pain? Did it start suddenly or gradually?",
   "Es hat gestern Nachmittag plötzlich angefangen, ganz ohne Vorwarnung.",
   ["Können Sie sich an einen konkreten Auslöser erinnern?", "Hatten Sie solche Schmerzen schon einmal?"],
   "Sudden onset suggests vascular or acute events (e.g., dissection, thrombosis). Gradual onset suggests inflammation or chronic processes.",
   ["schmerzbeschreibung", "onset", "acute"])

a("ana_022", "Schmerzbeschreibung",
   "Strahlten die Schmerzen in andere Körperteile aus, zum Beispiel in die Arme, den Kiefer oder den Rücken?",
   "Did the pain radiate to other parts of your body, for example into your arms, jaw, or back?",
   "Ja, in den linken Arm. Und auch ein bisschen in den Kiefer.",
   ["In welchen Arm genau?", "Bis wohin genau strahlt es aus?"],
   "Radiation is key in cardiac, pancreatic, and neurological pain. Chest pain radiating to left arm and jaw is classic for MI.",
   ["schmerzbeschreibung", "radiation", "cardiac"])

# 23-25: Begleitsymptome (Accompanying symptoms)
a("ana_023", "Begleitsymptome",
   "Hatten Sie neben den Hauptbeschwerden noch andere Symptome, wie zum Beispiel Übelkeit, Schwindel oder Schwitzen?",
   "Did you have any other symptoms besides the main complaints, such as nausea, dizziness, or sweating?",
   "Ja, mir war übel und ich habe stark geschwitzt, obwohl mir kalt war.",
   ["Haben Sie sich übergeben müssen?", "War der Schweiß kalt oder warm?"],
   "Cold sweat plus nausea are classic vagal symptoms associated with MI, pain shock, or vasovagal episodes.",
   ["begleitsymptome", "nausea", "sweating"])

a("ana_024", "Begleitsymptome",
   "Hatten Sie dabei das Gefühl, dass Ihnen schwindelig oder schwarz vor Augen wird?",
   "Did you feel dizzy or like things were going black in front of your eyes during the episode?",
   "Ja, kurzzeitig wurde mir schwarz vor Augen, aber dann ging es wieder.",
   ["Wie lange hat das angefahren?", "Sind Sie deswegen gestürzt?"],
   "Syncope or presyncope requires prompt attention. Clarify duration and whether there was a fall.",
   ["begleitsymptome", "syncope", "dizziness"])

a("ana_025", "Begleitsymptome",
   "Hatten Sie in letzter Zeit ungewollt Gewicht verloren oder hatten Sie Nachtschweiß?",
   "Have you unintentionally lost weight recently or had night sweats?",
   "Ja, ich habe in den letzten drei Monaten etwa fünf Kilo abgenommen.",
   ["Haben Sie bewusst weniger gegessen?", "Muss der Nachtschweiß die Kleidung wechseln?"],
   "B-symptoms (weight loss, night sweats, fever) are red flags requiring further investigation.",
   ["begleitsymptome", "B-symptoms", "weight loss", "night sweats"])

# Save
outpath = '../src/data/fspAnamnese.json'
with open(outpath, 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} anamnese items to fspAnamnese.json")
