import json

existing = json.load(open('../src/data/fspAnamnese.json','r',encoding='utf-8'))
next_num = max(int(x['id'].split('_')[1]) for x in existing) + 1
items = list(existing)

def a(cat, question, english, patient, followups, notes, tags):
    global next_num
    qid = f"ana_{next_num:03d}"
    next_num += 1
    items.append({
        "id": qid, "category": cat, "doctorQuestion": question,
        "simpleEnglish": english, "patientPossibleAnswer": patient,
        "followUpQuestions": followups, "notes": notes, "tags": tags
    })

# 51-53: Nikotin (Smoking)
a("Nikotin",
   "Rauchen Sie? Wenn ja, was rauchen Sie und wie viel am Tag?",
   "Do you smoke? If yes, what do you smoke and how much per day?",
   "Ja, ich rauche Zigaretten, etwa 20 am Tag.",
   ["Seit wie vielen Jahren rauchen Sie?", "Haben Sie schon einmal versucht aufzuhören?"],
   "Essential part of every anamnesis. Calculate pack-years (Packs pro Jahr).",
   ["nikotin", "smoking", "pack years"])

a("Nikotin",
   "Haben Sie früher geraucht? Wenn ja, wann haben Sie aufgehört?",
   "Did you used to smoke? If yes, when did you quit?",
   "Ja, früher habe ich geraucht, aber vor fünf Jahren habe ich aufgehört.",
   ["Wie viel haben Sie damals geraucht?", "Warum haben Sie aufgehört?"],
   "Ex-smokers still carry elevated risk. Document duration and cessation date.",
   ["nikotin", "ex-smoker", "cessation"])

a("Nikotin",
   "Sind Sie in Ihrem Alltag oder Beruf Tabakrauch ausgesetzt, zum Beispiel passiv?",
   "Are you exposed to tobacco smoke in your daily life or at work, for example passively?",
   "Nein, da habe ich kaum Kontakt mit Rauch.",
   ["Rauchen Mitbewohner oder Familienmitglieder in Ihrer Wohnung?"],
   "Passive smoking is a genuine health risk. Always ask about household exposure.",
   ["nikotin", "passive smoking", "exposure"])

# 54-56: Alkohol
a("Alkohol",
   "Trinken Sie regelmäßig Alkohol? Wenn ja, wie viel und wie oft?",
   "Do you drink alcohol regularly? If yes, how much and how often?",
   "Ja, am Wochenende trinke ich ab und zu ein oder zwei Bier.",
   ["Trinken Sie auch unter der Woche?", "Hatten Sie schon einmal das Gefühl, dass Ihr Alkoholkonsum problematisch ist?"],
   "Ask neutrally. Record in standard drinks (ein Glas Wein, ein Bier, ein Schnaps).",
   ["alkohol", "alcohol consumption", "standard drinks"])

a("Alkohol",
   "Haben Sie jemals eine Alkoholentziehung gemacht oder wurde Ihnen schon einmal geraten, weniger zu trinken?",
   "Have you ever undergone alcohol detoxification or has anyone ever advised you to drink less?",
   "Nein, das war nie ein Thema bei mir.",
   ["Hatten Sie schon einmal Entzugserscheinungen?", "Kam es schon zu gesundheitlichen Problemen durch Alkohol?"],
   "Screening for alcohol dependence. CAGE questionnaire elements are relevant here.",
   ["alkohol", "dependency", "withdrawal"])

a("Alkohol",
   "Hatten Sie jemals einen Unfall unter Alkoholeinfluss oder sind Sie alkoholisiert Auto gefahren?",
   "Have you ever had an accident under the influence of alcohol or driven a car while intoxicated?",
   "Nein, das nicht. Ich trinke ohnehin sehr selten.",
   ["Wurde bei Ihnen jemals eine Fettleber oder Lebererkrankung festgestellt?"],
   "Assess social and medical consequences of alcohol use. Trauma history may be relevant.",
   ["alkohol", "trauma", "DUIDUI"])

# 57-58: Drogen
a("Drogen",
   "Nehmen Sie irgendwelche Drogen, zum Beispiel Cannabis, Kokain oder andere Substanzen?",
   "Do you use any drugs, for example cannabis, cocaine, or other substances?",
   "Ja, ich rauche ab und zu Cannabis, vielleicht einmal pro Woche.",
   ["Seit wann konsumieren Sie Cannabis?", "Haben Sie schon einmal härtere Drogen probiert?"],
   "Ask non-judgmentally. Normalize the question: 'I ask all my patients about this.'",
   ["drogen", "cannabis", "illegal substances"])

a("Drogen",
   "Haben Sie schon einmal intravenöse Drogen gespritzt?",
   "Have you ever injected drugs intravenously?",
   "Nein, das habe ich nie gemacht.",
   ["Haben Sie schon einmal Nadeln mit anderen geteilt? Ist ein Hepatitis- oder HIV-Test jemals durchgeführt worden?"],
   "IV drug use is relevant for hepatitis, HIV, and endocarditis risk. Non-judgmental tone is critical.",
   ["drogen", "IV drugs", "hepatitis", "HIV"])

# 59-61: Beruf (Occupation)
a("Beruf",
   "Was sind Sie von Beruf und seit wann arbeiten Sie in diesem Bereich?",
   "What is your profession and how long have you been working in this field?",
   "Ich bin Bauarbeiter, seit 25 Jahren auf dem Bau.",
   ["Arbeiten Sie in Vollzeit oder Teilzeit?", "Sind Sie körperlich oder eher sitzend tätig?"],
   "Occupation can reveal exposure risks and physical strain. Important for musculoskeletal and respiratory history.",
   ["beruf", "occupation", "physical work"])

a("Beruf",
   "Sind Sie aktuell arbeitsfähig oder sind Sie krankgeschrieben?",
   "Are you currently able to work or are you on sick leave?",
   "Ich bin seit drei Tagen krankgeschrieben. Mein Hausarzt hat mich krankgeschrieben.",
   ["Seit wann sind Sie krankgeschrieben?", "Wann ist der voraussichtliche Wiedereintritt?"],
   "Assessing work capacity is part of the clinical picture and social anamnesis.",
   ["beruf", "sick leave", "work capacity"])

a("Beruf",
   "Sind Sie in Ihrem Beruf bestimmten Schadstoffen ausgesetzt, wie zum Beispiel Staub, Chemikalien oder Lärm?",
   "Are you exposed to any harmful substances in your job, such as dust, chemicals, or noise?",
   "Ja, auf dem Bau bin ich oft Staub ausgesetzt, auch wenn ich eine Maske trage.",
   ["Welche Schutzmaßnahmen stehen Ihnen zur Verfügung?", "Wurde bei Ihnen jemals eine Berufskrankheit festgestellt?"],
   "Occupational exposure is relevant for pulmonary, dermatological, and audiological conditions. Berufskrankheit (BK) is a specific legal category in Germany.",
   ["beruf", "occupational exposure", "respiratory", "work safety"])

# 62-64: Reiseanamnese
a("Reiseanamnese",
   "Waren Sie in den letzten Monaten im Ausland? Wenn ja, wo genau?",
   "Have you been abroad in the last few months? If yes, where exactly?",
   "Ja, ich war vor drei Wochen in Ägypten im Urlaub.",
   ["Wann genau sind Sie verreist und wann zurückgekommen?", "Hatten Sie dort gesundheitliche Probleme?"],
   "Travel history is essential for infectious disease workup. Ask about regions, duration, and symptoms during/after travel.",
   ["reiseanamnese", "travel", "tropical medicine"])

a("Reiseanamnese",
   "Haben Sie vor Ihrer Reise Impfungen erhalten oder eine Malariaprophylaxe genommen?",
   "Did you receive any vaccinations or take malaria prophylaxis before your trip?",
   "Nein, ich habe mich vor der Reise nicht impfen lassen. Ich wusste nicht, dass das nötig ist.",
   ["Welche Impfungen sind bei Ihnen dokumentiert?", "Hatten Sie jemals Reisedurchfall oder Fieber nach der Rückkehr?"],
   "Ask about pre-travel advice, vaccinations, and prophylaxis. Many patients travel without preparation.",
   ["reiseanamnese", "vaccination", "malaria", "travel medicine"])

a("Reiseanamnese",
   "Haben Sie nach der Rückkehr Durchfall, Fieber oder Hautausschlag bemerkt?",
   "Did you notice any diarrhea, fever, or skin rash after returning?",
   "Ja, seit der Rückkehr habe ich Durchfall, aber kein Fieber.",
   ["Seit wann genau haben Sie Durchfall?", "Ist Blut im Stuhl?", "Hatten Sie Kontakt zu Tieren auf der Reise?"],
   "Post-travel symptoms require careful characterization. Diarrhea, fever, and rash are key.",
   ["reiseanamnese", "post-travel", "diarrhea", "rash"])

# 65-67: System Review (body systems review)
a("System Review",
   "Haben Sie in letzter Zeit Veränderungen Ihres Appetits oder Ihres Durstgefühls bemerkt?",
   "Have you noticed any changes in your appetite or thirst recently?",
   "Ja, ich habe ständig Durst und muss nachts oft auf die Toilette.",
   ["Seit wann haben Sie vermehrten Durst?", "Haben Sie auch vermehrten Harndrang?", "Wie viel trinken Sie am Tag?"],
   "Polyuria/polydipsia are classic diabetes symptoms. Part of the system review.",
   ["system review", "appetite", "thirst", "diabetes"])

a("System Review",
   "Haben Sie Probleme mit der Verdauung, wie Sodbrennen, Völlegefühl oder Blähungen?",
   "Do you have any digestive problems, such as heartburn, bloating, or flatulence?",
   "Ja, nach dem Essen habe ich oft Sodbrennen. Das kenne ich schon länger.",
   ["Seit wann besteht das Sodbrennen?", "Nehmen Sie etwas dagegen?", "Tritt es auch nachts im Liegen auf?"],
   "Systematic GI review. Symptoms may point to reflux, gastritis, or functional dyspepsia.",
   ["system review", "GI", "reflux", "digestion"])

a("System Review",
   "Haben Sie Probleme mit dem Stuhlgang, wie Verstopfung oder Durchfall, oder haben Sie Blut im Stuhl bemerkt?",
   "Do you have any problems with bowel movements, such as constipation or diarrhea, or have you noticed blood in your stool?",
   "Eher Verstopfung. Blut habe ich noch nie bemerkt.",
   ["Wie oft haben Sie Stuhlgang?", "Haben Sie Schmerzen beim Stuhlgang?", "Hatten Sie schon eine Darmspiegelung?"],
   "Bowel habit changes and blood in stool require prompt evaluation. Red flags for colorectal pathology.",
   ["system review", "bowel habits", "blood in stool", "GI"])

# 68-70: Zusammenfassung und Rückversicherung
a("Zusammenfassung und Rückversicherung",
   "Habe ich das richtig zusammengefasst? Sie haben seit drei Tagen Schmerzen in der Brust, die in den linken Arm ausstrahlen, begleitet von Übelkeit. Ist das so korrekt?",
   "Did I summarize that correctly? You have had chest pain radiating to your left arm for three days, accompanied by nausea. Is that correct?",
   "Ja, genau. Das trifft es gut.",
   ["Habe ich etwas Wichtiges vergessen?", "Gibt es noch etwas, das Sie mir mitteilen möchten?"],
   "Summarizing and checking back is an FSP requirement. It shows you were listening and ensures accuracy.",
   ["zusammenfassung", "summary", "verification"])

a("Zusammenfassung und Rückversicherung",
   "Gibt es noch etwas, das Sie mir sagen möchten, was ich noch nicht gefragt habe?",
   "Is there anything else you would like to tell me that I haven't asked about yet?",
   "Eigentlich nicht. Ich glaube, das war alles.",
   ["Haben Sie noch Fragen an mich?", "Gibt es etwas, das Sie beunruhigt?"],
   "The final open question gives the patient space to add relevant information. Required in FSP history-taking.",
   ["zusammenfassung", "closing", "patient concerns"])

a("Zusammenfassung und Rückversicherung",
   "Darf ich Sie noch kurz körperlich untersuchen? Danach besprechen wir das weitere Vorgehen.",
   "May I briefly examine you physically? After that, we'll discuss the next steps.",
   "Ja, gerne. Machen Sie bitte.",
   ["Haben Sie Schmerzen an einer bestimmten Stelle, die ich vorsichtig untersuchen soll?"],
   "Transition from history-taking to physical examination. Always ask permission in FSP.",
   ["zusammenfassung", "examination transition", "next steps"])

# Save
with open('../src/data/fspAnamnese.json','w',encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total items to fspAnamnese.json")
