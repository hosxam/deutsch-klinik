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

# 71-75: Gynäkologische Anamnese
a("Gynäkologische Anamnese",
   "Wann war Ihre letzte Regelblutung? Ist der Zyklus regelmäßig?",
   "When was your last menstrual period? Is your cycle regular?",
   "Meine letzte Periode war vor zwei Wochen. Der Zyklus ist regelmäßig, alle 28 Tage.",
   ["Haben Sie Zwischenblutungen?", "Haben Sie Schmerzen während der Periode?"],
   "First question in gynecological anamnesis. LMP is essential for all women of reproductive age.",
   ["gynäkologie", "menstruation", "LMP", "cycle"])

a("Gynäkologische Anamnese",
   "Besteht die Möglichkeit, dass Sie schwanger sein könnten?",
   "Is there any possibility you could be pregnant?",
   "Ja, es ist möglich. Ich bin nicht sicher.",
   ["Wann war Ihre letzte Periode?", "Verhüten Sie?", "Haben Sie einen Schwangerschaftstest gemacht?"],
   "Must be asked in every applicable context. Document carefully before any imaging or medication.",
   ["gynäkologie", "schwangerschaft", "pregnancy", "safety"])

a("Gynäkologische Anamnese",
   "Hatten Sie schon einmal Schwangerschaften oder Geburten? Falls ja, wie viele?",
   "Have you had any pregnancies or births? If yes, how many?",
   "Ja, ich habe zwei Kinder, beide natürliche Geburten.",
   ["Waren die Schwangerschaften komplikationslos?", "Hatten Sie Fehlgeburten oder Abtreibungen?"],
   "Document as G/P/A (Gravida/Para/Abortus). Ask sensitively.",
   ["gynäkologie", "pregnancies", "births", "obstetrics"])

a("Gynäkologische Anamnese",
   "Nehmen Sie hormonelle Verhütungsmittel? Wenn ja, welche?",
   "Do you use hormonal contraception? If yes, which one?",
   "Ja, ich nehme die Pille. Die Microgynon.",
   ["Seit wann nehmen Sie die Pille?", "Hatten Sie Nebenwirkungen?", "Rauchen Sie zusätzlich?"],
   "Hormonal contraception plus smoking increases thrombosis risk. Important safety question.",
   ["gynäkologie", "contraception", "pill", "thrombosis risk"])

a("Gynäkologische Anamnese",
   "Hatten Sie schon auffällige PAP-Abstriche oder wurden Sie gynäkologisch schon einmal operiert?",
   "Have you ever had abnormal Pap smears or any gynecological surgeries?",
   "Ja, einmal hatte ich einen auffälligen Befund, aber die Kontrolle war unauffällig.",
   ["Wann war Ihr letzter PAP-Abstrich?", "Hatten Sie eine Konisation oder andere Eingriffe?"],
   "Cervical cancer screening history is essential. Document prior abnormal results and interventions.",
   ["gynäkologie", "pap smear", "cervical screening", "gynecologic surgery"])

# 76-79: Pädiatrische Anamnese
a("Pädiatrische Anamnese",
   "Wie war die Schwangerschaft und die Geburt Ihres Kindes? Gab es Komplikationen?",
   "How was the pregnancy and birth of your child? Were there any complications?",
   "Die Schwangerschaft war normal, aber die Geburt war ein Kaiserschnitt wegen Steißlage.",
   ["War es eine Termingeburt? Wie war der APGAR-Score?", "Gab es Probleme nach der Geburt?"],
   "Perinatal history is the foundation of pediatric anamnesis. Document gestational age, delivery mode, and APGAR.",
   ["pädiatrie", "perinatal", "birth", "pregnancy"])

a("Pädiatrische Anamnese",
   "Wie ist der Impfstatus Ihres Kindes? Sind die Impfungen nach STIKO-Empfehlung erfolgt?",
   "What is your child's vaccination status? Have the vaccinations been given according to STIKO recommendations?",
   "Ja, mein Kind ist nach dem Impfkalender geimpft. Alle Standardimpfungen sind gemacht.",
   ["Welche Impfungen wurden bereits gegeben?", "Gab es Impfreaktionen?", "Ist die Maserimpfung erfolgt?"],
   "Vaccination status is critical in pediatric assessment. STIKO is the German vaccination committee.",
   ["pädiatrie", "vaccination", "STIKO", "immunization"])

a("Pädiatrische Anamnese",
   "Wie ist die Entwicklung Ihres Kindes? Läuft und spricht es altersgerecht?",
   "How is your child's development? Is he/she walking and talking age-appropriately?",
   "Es läuft schon seit ein paar Monaten und spricht einzelne Wörter. Ich denke, es ist altersgerecht.",
   ["Wann hat Ihr Kind angefangen zu krabbeln, zu laufen, zu sprechen?", "Gab es Auffälligkeiten in der Entwicklung?"],
   "Developmental milestones are key. Ask about motor, language, and social development milestones.",
   ["pädiatrie", "development", "milestones", "growing"])

a("Pädiatrische Anamnese",
   "Ihr Kind hat Fieber. Seit wann? Hatten Sie schon einmal Fieberkrämpfe?",
   "Your child has a fever. Since when? Has your child ever had febrile seizures?",
   "Seit gestern Abend. Fieberkrämpfe hatten wir noch nie.",
   ["Wie hoch war das Fieber?", "Hat das Kind Schmerzen? Trinkt es ausreichend?"],
   "Febrile illness in children requires careful assessment. Febrile seizures are age-dependent and generally benign but frightening for parents.",
   ["pädiatrie", "fever", "febrile seizure", "child"])

# 80-82: Sexualanamnese
a("Sexualanamnese",
   "Ich frage jetzt aus medizinischen Gründen. Sind Sie sexuell aktiv?",
   "I am asking for medical reasons. Are you sexually active?",
   "Ja, ich bin in einer festen Beziehung und sexuell aktiv.",
   ["Hatten Sie ungeschützten Geschlechtsverkehr?", "Besteht der Wunsch nach einer Schwangerschaft?"],
   "Ask sexan with context. Normalize the question. Relevant for GU symptoms, abdominal pain, and family planning.",
   ["sexualanamnese", "sexual activity", "safe sex"])

a("Sexualanamnese",
   "Hatten Sie in der Vergangenheit sexuell übertragbare Infektionen?",
   "Have you had any sexually transmitted infections in the past?",
   "Nein, nie. Ich wurde aber auch nie getestet.",
   ["Möchten Sie einen Test auf sexuell übertragbare Krankheiten durchführen lassen?", "Hatten Sie Symptome wie Ausfluss oder Brennen?"],
   "STI history is relevant for GU symptoms, infertility, and certain systemic conditions.",
   ["sexualanamnese", "STI", "sexual health"])

a("Sexualanamnese",
   "Haben Sie Schmerzen beim Geschlechtsverkehr?",
   "Do you have pain during sexual intercourse?",
   "Ja, in letzter Zeit habe ich Schmerzen. Das war vorher nicht so.",
   ["Seit wann bestehen die Schmerzen?", "Wo genau sind die Schmerzen lokalisiert?"],
   "Dyspareunia can have multiple causes (endometriosis, infection, vaginismus). Ask sensitively.",
   ["sexualanamnese", "dyspareunia", "pain"])

# 83-85: More System Review (to add depth)
a("System Review",
   "Haben Sie Probleme beim Wasserlassen, wie Brennen, Schmerzen oder häufigen Harndrang?",
   "Do you have any problems with urination, such as burning, pain, or frequent urination?",
   "Ja, ich muss nachts mehrmals raus und es brennt beim Wasserlassen.",
   ["Seit wann besteht das Brennen?", "Haben Sie Blut im Urin bemerkt?", "Hatten Sie Fieber oder Flankenschmerzen?"],
   "Urinary symptoms are part of the system review. Important for UTIs, BPH, and urological conditions.",
   ["system review", "urinary", "dysuria", "frequency"])

a("System Review",
   "Haben Sie in letzter Zeit Veränderungen an Ihrer Haut bemerkt, wie neue Muttermale, Ausschlag oder Juckreiz?",
   "Have you noticed any changes to your skin recently, such as new moles, rash, or itching?",
   "Ja, ich habe einen Ausschlag an den Armen, der juckt.",
   ["Seit wann haben Sie den Ausschlag?", "Hatten Sie das schon einmal?", "Haben Sie neue Pflegeprodukte verwendet?"],
   "Skin review is part of comprehensive history. New or changing moles require dermatological evaluation.",
   ["system review", "skin", "rash", "dermatology"])

a("System Review",
   "Haben Sie Schmerzen in den Gelenken oder Muskeln? Wenn ja, welche Gelenke sind betroffen?",
   "Do you have any pain in your joints or muscles? If yes, which joints are affected?",
   "Ja, die Knie schmerzen, besonders beim Treppensteigen.",
   ["Seit wann bestehen die Gelenkschmerzen?", "Sind die Schmerzen belastungsabhängig?", "Sind die Gelenke geschwollen?"],
   "Joint and muscle review. Differentiate inflammatory (morning stiffness, swelling from osteoarthritis (exertional pain).",
   ["system review", "joints", "musculoskeletal", "arthritis"])

# 86-88: More Vorerkrankungen
a("Vorerkrankungen",
   "Haben Sie eine chronische Lungenerkrankung, wie zum Beispiel COPD oder Lungenfibrose?",
   "Do you have a chronic lung disease, such as COPD or pulmonary fibrosis?",
   "Nein, meine Lunge war immer gesund.",
   ["Hatten Sie schon einmal eine Lungenentzündung?", "Wurde bei Ihnen jemals Asthma diagnostiziert?"],
   "Chronic lung disease affects oxygen requirements, anesthesia risk, and prognosis.",
   ["vorerkrankungen", "pulmonary", "COPD", "lung"])

a("Vorerkrankungen",
   "Haben Sie eine Blutgerinnungsstörung oder hatten Sie schon einmal Thrombosen oder Embolien?",
   "Do you have a blood clotting disorder or have you ever had thrombosis or emboli?",
   "Nein, nie. Ich hatte noch nie Probleme mit Thrombosen.",
   ["Gibt es in Ihrer Familie Thrombosefälle?", "Wurde bei Ihnen jemals eine Thrombophilie festgestellt?"],
   "Thrombosis history is crucial before prescribing hormonal contraception or planning surgery.",
   ["vorerkrankungen", "thrombosis", "coagulation", "embolism"])

a("Vorerkrankungen",
   "Haben Sie eine chronisch-entzündliche Darmerkrankung, wie Morbus Crohn oder Colitis ulcerosa?",
   "Do you have a chronic inflammatory bowel disease, such as Crohn's disease or ulcerative colitis?",
   "Ja, ich habe Morbus Crohn. Die Erkrankung ist gut eingestellt.",
   ["Seit wann besteht die Erkrankung?", "Welche Medikamente nehmen Sie?", "Hatten Sie schon Operationen am Darm?"],
   "IBD affects many organ systems beyond the GI tract. Important for immunosuppression and cancer surveillance.",
   ["vorerkrankungen", "IBD", "Crohn's", "colitis"])

# 89-91: More Medikamente
a("Medikamente",
   "Nehmen Sie Schilddrüsenmedikamente oder Medikamente gegen Diabetes?",
   "Do you take thyroid medication or diabetes medication?",
   "Ja, L-Thyroxin 100 Mikrogramm täglich und Metformin.",
   ["Nehmen Sie auch Insulin?", "Wie sind Ihre Blutzuckerwerte aktuell?", "Haben Sie die Medikamente heute genommen?"],
   "Thyroid and diabetes meds are among the most common. Crucial to know for many clinical decisions.",
   ["medikamente", "thyroid", "diabetes", "insulin"])

a("Medikamente",
   "Nehmen Sie Schmerzmittel regelmäßig ein? Wenn ja, welche und wie oft?",
   "Do you take pain medication regularly? If yes, which ones and how often?",
   "Ja, ich nehme fast täglich Ibuprofen 400 mg wegen meiner Knieschmerzen.",
   ["Seit wann nehmen Sie regelmäßig Ibuprofen?", "Haben Sie schon einmal Magenschmerzen oder Sodbrennen durch Ibuprofen bemerkt?"],
   "Regular NSAID use increases risk of GI bleeding and renal impairment. Always quantify frequency and duration.",
   ["medikamente", "painkillers", "NSAIDs", "analgesics"])

a("Medikamente",
   "Nehmen Sie Medikamente gegen erhöhte Blutfette, also Cholesterinsenker?",
   "Do you take medication for high blood lipids, i.e., cholesterol-lowering drugs?",
   "Ja, ich nehme Atorvastatin 20 mg abends.",
   ["Seit wann nehmen Sie Statine?", "Haben Sie die Medikamente gut vertragen?"],
   "Statins are common cardiovascular medication. Ask about tolerance (muscle pain, liver enzymes).",
   ["medikamente", "statins", "cholesterol", "lipids"])

# 92-94: More Sozialanamnese
a("Sozialanamnese",
   "Haben Sie Angehörige, die sich im Notfall um Sie kümmern können?",
   "Do you have relatives who can take care of you in an emergency?",
   "Ja, meine Tochter wohnt um die Ecke. Sie kann kommen, wenn es nötig ist.",
   ["Haben Sie einen Hausnotruf?", "Sind Sie in einem Senioren- oder Pflegeheim?"],
   "Social support network is essential for discharge planning. Especially important for elderly or disabled patients.",
   ["sozialanamnese", "support network", "emergency contact"])

a("Sozialanamnese",
   "Sind Sie Mitglied in einer Selbsthilfegruppe oder erhalten Sie psychologische Unterstützung?",
   "Are you a member of a support group or do you receive psychological support?",
   "Ja, ich gehe einmal pro Woche zur Psychotherapie wegen meiner Angststörung.",
   ["Seit wann sind Sie in Behandlung?", "Wer ist Ihr Therapeut?"],
   "Self-help groups and therapy are part of the social history. Shows coping strategies and support systems.",
   ["sozialanamnese", "therapy", "support group", "mental health"])

a("Sozialanamnese",
   "Haben Sie einen Vorsorgevollmacht oder eine Patientenverfügung?",
   "Do you have an advance directive or a living will?",
   "Nein, habe ich nicht. Sollte ich mir Gedanken darüber machen?",
   ["Haben Sie mit Ihren Angehörigen über Ihre Wünsche für medizinische Notfälle gesprochen?"],
   "Advance care planning documents are legally recognized in Germany. Important to address, especially in chronic or terminal illness.",
   ["sozialanamnese", "advance directive", "living will", "Vorsorgevollmacht"])

# 95-97: More Aktuelle Anamnese
a("Aktuelle Anamnese",
   "Haben Sie vor Beginn der Beschwerden etwas Besonderes gegessen oder getrunken?",
   "Did you eat or drink anything unusual before the symptoms started?",
   "Ja, ich war am Abend in einem Restaurant und habe Fisch gegessen.",
   ["Hatten andere Personen, die mit Ihnen gegessen haben, auch Beschwerden?", "Was genau haben Sie gegessen?"],
   "Food history can identify food poisoning, allergic reactions, or GI triggers.",
   ["aktuelle anamnese", "food", "trigger", "diet"])

a("Aktuelle Anamnese",
   "Hatten Sie in der letzten Zeit Stress oder besondere Belastungen?",
   "Have you had stress or particular burdens recently?",
   "Ja, ich hatte viel Stress auf der Arbeit. Mein Chef macht mir Druck.",
   ["Haben Sie das Gefühl, dass der Stress mit Ihren Beschwerden zusammenhängt?", "Wie schlafen Sie?"],
   "Stress can trigger or exacerbate many conditions. Part of understanding the context of illness.",
   ["aktuelle anamnese", "stress", "psychological", "triggers"])

a("Aktuelle Anamnese",
   "Haben Sie in den letzten 24 Stunden etwas eingenommen, was ich wissen sollte? Auch pflanzliche Mittel oder Nahrungsergänzungsmittel?",
   "Have you taken anything in the last 24 hours that I should know about? Including herbal remedies or supplements?",
   "Nein, gar nichts. Nur meine normalen Medikamente.",
   ["Nehmen Sie regelmäßig Vitamine oder Nahrungsergänzungsmittel?", "Haben Sie pflanzliche Präparate wie Johanniskraut oder Ginkgo genommen?"],
   "Herbal supplements can interact with medications. Johanniskraut (St. John's wort) induces CYP450 enzymes.",
   ["aktuelle anamnese", "supplements", "herbal", "interactions"])

# 98-100: More Zusammenfassung
a("Zusammenfassung und Rückversicherung",
   "Ich habe mir Notizen gemacht. Darf ich Ihnen kurz zusammenfassen, was ich bis jetzt verstanden habe?",
   "I've taken some notes. May I briefly summarize what I've understood so far?",
   "Ja, gerne. Das hilft mir auch, ob ich nichts vergessen habe.",
   ["Was ich bisher verstanden habe, ist Folgendes:... Habe ich etwas falsch verstanden?", "Darf ich das so dokumentieren?"],
   "Always ask for permission before summarizing. This is an important communication skill in FSP.",
   ["zusammenfassung", "summarizing", "patient approval"])

a("Zusammenfassung und Rückversicherung",
   "Gibt es Fragen, die ich nicht gestellt habe, die aber wichtig für Sie sind?",
   "Are there any questions I haven't asked that are important to you?",
   "Eigentlich haben Sie alles gefragt, was mir wichtig ist.",
   ["Haben Sie Bedenken bezüglich der weiteren Behandlung?", "Haben Sie Angst vor bestimmten Untersuchungen?"],
   "Gives the patient the final opportunity to contribute. FSP examiners look for this.",
   ["zusammenfassung", "patient questions", "concerns"])

a("Zusammenfassung und Rückversicherung",
   "Vielen Dank für das ausführliche Gespräch. Ich werde jetzt die weitere Diagnostik einleiten. Haben Sie dazu noch Fragen?",
   "Thank you for this detailed conversation. I will now initiate further diagnostics. Do you have any questions about that?",
   "Nein, vielen Dank für Ihre ausführliche Erklärung.",
   ["Ich werde Sie über die Ergebnisse informieren, sobald sie vorliegen.", "Wenn Sie zwischendurch Fragen haben, zögern Sie nicht zu fragen."],
   "Closing the anamnesis politely sets the stage for the next clinical steps. In FSP, a clear closing is expected.",
   ["zusammenfassung", "closing", "next steps", "patient education"])

# Save
with open('../src/data/fspAnamnese.json','w',encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total items to fspAnamnese.json")
