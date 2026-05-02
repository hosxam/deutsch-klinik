import json, sys

# Read existing + get next ID
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

# 26-30: Vorerkrankungen (Pre-existing conditions)
a("Vorerkrankungen",
   "Haben Sie bekannte Vorerkrankungen? Leiden Sie zum Beispiel an Bluthochdruck, Diabetes oder Asthma?",
   "Do you have known pre-existing conditions? For example, do you suffer from high blood pressure, diabetes, or asthma?",
   "Ja, ich habe Bluthochdruck und Asthma. Diabetes habe ich nicht.",
   ["Seit wann besteht der Bluthochdruck?", "Welche Medikamente nehmen Sie dagegen ein?", "Ist der Asthma medikamentös eingestellt?"],
   "Always ask about the three most common chronic conditions first. Then ask if there are others.",
   ["vorerkrankungen", "hypertension", "diabetes", "asthma"])

a("Vorerkrankungen",
   "Wurde bei Ihnen schon einmal eine Herzerkrankung oder ein Schlaganfall diagnostiziert?",
   "Have you ever been diagnosed with heart disease or a stroke?",
   "Ja, ich hatte vor zwei Jahren einen leichten Schlaganfall. Die Durchblutung ist wieder gut.",
   ["Welche Folgen hat der Schlaganfall hinterlassen?", "Nehmen Sie Blutverdünner?", "Wurde eine Ursache gefunden?"],
   "Cardiovascular and cerebrovascular history is essential. If yes, ask about anticoagulation and residual deficits.",
   ["vorerkrankungen", "cardiac", "stroke", "cerebrovascular"])

a("Vorerkrankungen",
   "Haben Sie eine Nierenerkrankung oder Lebererkrankung?",
   "Do you have any kidney or liver disease?",
   "Nein, weder noch. Das wurde zumindest noch nie festgestellt.",
   ["Wurden Ihre Nieren- oder Leberwerte in letzter Zeit kontrolliert?", "Hatten Sie schon einmal eine Nierenbeckenentzündung oder Gelbsucht?"],
   "Important for medication dosing. Many drugs are renally or hepatically cleared.",
   ["vorerkrankungen", "renal", "hepatic", "medication safety"])

a("Vorerkrankungen",
   "Haben Sie eine bekannte Schilddrüsenerkrankung?",
   "Do you have a known thyroid condition?",
   "Ja, ich habe eine Schilddrüsenunterfunktion. Ich nehme L-Thyroxin.",
   ["Seit wann besteht die Schilddrüsenunterfunktion?", "Wie ist die Dosierung?", "Werden die Werte regelmäßig kontrolliert?"],
   "Thyroid disease is common, especially in women. Always ask about medication and monitoring.",
   ["vorerkrankungen", "thyroid", "hypothyroidism"])

a("Vorerkrankungen",
   "Sind bei Ihnen psychische Erkrankungen wie Depressionen oder Angststörungen bekannt?",
   "Do you have any known mental health conditions such as depression or anxiety disorders?",
   "Ja, ich habe seit mehreren Jahren eine Depression. Die Behandlung läuft gut.",
   ["Welche Behandlung erhalten Sie?", "Nehmen Sie Antidepressiva?", "Sind Sie in psychotherapeutischer Behandlung?"],
   "Mental health history is relevant for many physical presentations. Ask sensitively. Normalize the question.",
   ["vorerkrankungen", "mental health", "depression", "anxiety"])

# 31-34: Operationen (Surgeries)
a("Operationen",
   "Wurden Sie schon einmal operiert? Wenn ja, welche Operationen hatten Sie?",
   "Have you ever had surgery? If yes, which operations have you had?",
   "Ja, mir wurde vor fünf Jahren die Gallenblase entfernt.",
   ["In welchem Jahr war die Operation?", "Gab es Komplikationen?", "Sind Sie damals gut aus der Narkose aufgewacht?"],
   "Surgical history should include year, indication, complications, and anesthesia tolerance.",
   ["operationen", "surgery", "history"])

a("Operationen",
   "Hatten Sie schon einmal eine Operation in Vollnarkose?",
   "Have you ever had surgery under general anesthesia?",
   "Ja, bei der Gallenblasen-OP. Das war die einzige.",
   ["Haben Sie die Narkose gut vertragen?", "Gab es Probleme mit der Narkose?"],
   "Anesthesia tolerance is important for future procedures. Ask separately if no surgeries listed.",
   ["operationen", "anesthesia", "complications"])

a("Operationen",
   "Wurden bei Ihnen schon einmal Endoskopien durchgeführt, zum Beispiel eine Magenspiegelung oder Darmspiegelung?",
   "Have you ever had any endoscopic procedures, for example a gastroscopy or colonoscopy?",
   "Ja, eine Darmspiegelung vor drei Jahren. Es wurden ein paar Polypen entfernt.",
   ["Was war der Befund?", "Wurden Polypen gefunden und entfernt?", "Wann war die letzte Vorsorgeuntersuchung?"],
   "Endoscopies count as procedures in the anamnesis. Important for cancer screening and gastroenterological history.",
   ["operationen", "endoscopy", "colonoscopy", "gastroscopy"])

a("Operationen",
   "Haben Sie Implantate oder künstliche Gelenke?",
   "Do you have any implants or artificial joints?",
   "Ja, ich habe ein künstliches Hüftgelenk rechts seit zwei Jahren.",
   ["Wurde die Hüft-OP gut vertragen?", "Sind Sie darüber in der Nachsorge?"],
   "Implants are relevant for MRI safety, infection risk, and anticoagulation decisions.",
   ["operationen", "implants", "joint replacement", "MRI safety"])

# 35-39: Medikamente (Medications)
a("Medikamente",
   "Welche Medikamente nehmen Sie regelmäßig ein? Bitte nennen Sie mir alle, auch pflanzliche und rezeptfreie.",
   "Which medications do you take regularly? Please name all of them, including herbal and over-the-counter ones.",
   "Ich nehme täglich Ramipril 5 mg gegen den Blutdruck und bei Bedarf Ibuprofen bei Kopfschmerzen.",
   ["Seit wann nehmen Sie Ramipril?", "Wie oft nehmen Sie Ibuprofen?", "Nehmen Sie noch andere Schmerzmittel?"],
   "Ask about all medications including OTC. 'Bei Bedarf' (as needed) medications are often forgotten by patients.",
   ["medikamente", "medication list", "chronic medication"])

a("Medikamente",
   "Nehmen Sie blutverdünnende Medikamente, zum Beispiel Marcumar, Xarelto oder Aspirin?",
   "Do you take any blood-thinning medications, for example Marcumar, Xarelto, or Aspirin?",
   "Ja, ich nehme Aspirin 100 mg täglich wegen meiner Herzkrankheit.",
   ["Seit wann nehmen Sie den Blutverdünner?", "Welche Dosierung genau?", "Wurde Ihnen das vom Kardiologen verordnet?"],
   "Anticoagulants are critical for bleeding risk assessment. Always ask about dosage and prescribing specialist.",
   ["medikamente", "anticoagulation", "blood thinner"])

a("Medikamente",
   "Nehmen Sie Antibiotika oder Kortison?",
   "Are you taking any antibiotics or cortisone?",
   "Nein, nichts dergleichen im Moment.",
   ["Haben Sie in den letzten Wochen Antibiotika genommen?", "Nehmen Sie Kortison als Spray oder Tablette?"],
   "Recent antibiotics affect microbiological diagnostics. Steroids affect immune status. Specify route for steroids.",
   ["medikamente", "antibiotics", "steroids", "cortisone"])

a("Medikamente",
   "Nehmen Sie die Pille oder andere Hormonpräparate?",
   "Are you taking the pill or other hormonal preparations?",
   "Ja, ich nehme die Pille zur Verhütung.",
   ["Welche Pille genau?", "Seit wann nehmen Sie sie?", "Hatten Sie schon einmal Thrombosen?"],
   "Hormonal contraception is relevant for thrombosis risk. Ask in all women of reproductive age.",
   ["medikamente", "contraception", "hormones", "women's health"])

a("Medikamente",
   "Haben Sie Ihre Medikamente heute schon eingenommen?",
   "Have you already taken your medication today?",
   "Ja, ich habe alles wie gewohnt eingenommen.",
   ["Welche Medikamente waren das genau?", "Um welche Uhrzeit nehmen Sie sie normalerweise?"],
   "Always confirm today's medication intake. In emergency settings, this may affect treatment decisions.",
   ["medikamente", "today's medication", "adherence"])

# 40-43: Allergien (Allergies)
a("Allergien",
   "Haben Sie bekannte Allergien, insbesondere gegen Medikamente oder bestimmte Nahrungsmittel?",
   "Do you have any known allergies, particularly to medications or certain foods?",
   "Ich bin allergisch gegen Penicillin. Das weiß ich seit einer Reaktion vor zehn Jahren.",
   ["Welche Reaktion hatten Sie genau?", "Wissen Sie, ob Sie andere Antibiotika vertragen?"],
   "Medication allergies are the most critical. Document the reaction type (rash, anaphylaxis).",
   ["allergien", "drug allergy", "penicillin"])

a("Allergien",
   "Sind Sie allergisch gegen Pflaster oder Latex?",
   "Are you allergic to bandages or latex?",
   "Das weiß ich nicht. Ich hatte noch nie Probleme damit.",
   ["Hatten Sie schon einmal Hautausschlag durch Pflaster?", "Vertragen Sie Latexhandschuhe?"],
   "Important for surgical, wound care, and examination contexts. Latex allergy is increasingly common.",
   ["allergien", "latex", "adhesive", "contact allergy"])

a("Allergien",
   "Haben Sie Heuschnupfen, Neurodermitis oder andere allergische Erkrankungen?",
   "Do you have hay fever, eczema, or other allergic conditions?",
   "Ja, ich habe Heuschnupfen im Frühjahr.",
   ["Nehmen Sie etwas dagegen?", "Haben Sie Asthmabeschwerden im Rahmen der Allergie?"],
   "Atopic conditions (hay fever, asthma, eczema) often co-exist. Important for overall allergic history.",
   ["allergien", "hay fever", "atopic", "allergy"]) 

a("Allergien",
   "Vertragen Sie Jod? Hatten Sie schon einmal Kontrastmittel bei einer CT- oder MRT-Untersuchung?",
   "Do you tolerate iodine? Have you ever had contrast medium during a CT or MRI examination?",
   "Ja, ich hatte schon Kontrastmittel. Das war kein Problem.",
   ["Wissen Sie, ob jemals eine allergische Reaktion auf Kontrastmittel dokumentiert wurde?"],
   "Iodine/contrast allergy is essential before imaging. This is a common FSP question.",
   ["allergien", "iodine", "contrast medium", "imaging"])

# 44-47: Familienanamnese
a("Familienanamnese",
   "Gibt es in Ihrer Familie Erkrankungen, die gehäuft vorkommen, wie zum Beispiel Bluthochdruck, Diabetes oder Herzerkrankungen?",
   "Are there any conditions that run in your family, such as high blood pressure, diabetes, or heart disease?",
   "Mein Vater hatte Bluthochdruck und ist mit 62 an einem Herzinfarkt gestorben.",
   ["In welchem Alter traten die Erkrankungen bei Ihren Familienmitgliedern auf?", "Gibt es Krebserkrankungen in der Familie?"],
   "Family history should include cardiovascular disease, diabetes, cancer, and autoimmune disorders. Include age of onset for family members.",
   ["familienanamnese", "cardiovascular", "genetic risk"])

a("Familienanamnese",
   "Sind bei Ihren Eltern oder Geschwistern Krebserkrankungen bekannt?",
   "Are there any known cancer diagnoses among your parents or siblings?",
   "Ja, meine Mutter hatte Brustkrebs mit 50. Sie ist geheilt.",
   ["Welche Krebsart genau?", "In welchem Alter?", "Gibt es erbliche Krebserkrankungen in der Familie?"],
   "Cancer family history may warrant genetic counseling. Specify type and age of diagnosis.",
   ["familienanamnese", "cancer", "genetic"])

a("Familienanamnese",
   "Haben Ihre Eltern oder Geschwister eine Autoimmunerkrankung, zum Beispiel Rheuma, Morbus Crohn oder Multiple Sklerose?",
   "Do your parents or siblings have an autoimmune disease, for example rheumatism, Crohn's disease, or multiple sclerosis?",
   "Soweit ich weiß, hat niemand in der Familie so etwas.",
   ["Gibt es in der Familie rheumatische Erkrankungen?", "Ist jemand in der Familie an chronisch-entzündlichen Darmerkrankungen erkrankt?"],
   "Autoimmune conditions often have a genetic component. Worth asking even if no known cases.",
   ["familienanamnese", "autoimmune", "rheumatism"])

a("Familienanamnese",
   "Gibt es in Ihrer Familie erbliche Erkrankungen, wie zum Beispiel Bluterkrankheit oder Muskelschwund?",
   "Are there any hereditary diseases in your family, such as hemophilia or muscular dystrophy?",
   "Nicht, dass ich wüsste. In unserer Familie ist niemand an so etwas erkrankt.",
   ["Wurde bei Ihnen jemals ein Gentest durchgeführt?", "Gibt es Verwandte mit bekannten Erbkrankheiten?"],
   "Inherited diseases cover hemophilia, hemoglobinopathies, metabolic disorders, and neuromuscular conditions.",
   ["familienanamnese", "hereditary", "genetic disorder"])

# 48-50: Sozialanamnese
a("Sozialanamnese",
   "Leben Sie allein oder mit jemandem zusammen?",
   "Do you live alone or with someone?",
   "Ich wohne mit meiner Frau und den zwei Kindern zusammen.",
   ["Haben Sie zu Hause Unterstützung? Wer kümmert sich um Sie, wenn Sie krank sind?", "Haben Sie Angehörige, die im Notfall helfen können?"],
   "Living situation affects discharge planning and home care. Key for social anamnesis.",
   ["sozialanamnese", "living situation", "support"])

a("Sozialanamnese",
   "Haben Sie eine Pflegestufe oder sind Sie als schwerbehindert eingestuft?",
   "Do you have a care level or are you registered as severely disabled?",
   "Nein, ich bin selbstständig und brauche keine Pflege.",
   ["Haben Sie bereits einen Pflegegrad beantragt?", "Nutzen Sie Hilfsmittel wie Rollator oder Gehstock?"],
   "Pflegestufe/Pflegegrad and Schwerbehinderung are relevant for assessing functional status and social support needs.",
   ["sozialanamnese", "care level", "disability"])

a("Sozialanamnese",
   "Wie ist Ihre Wohnsituation? Gibt es Treppen in Ihrer Wohnung oder haben Sie einen Fahrstuhl?",
   "How is your housing situation? Are there stairs in your apartment or do you have an elevator?",
   "Wir wohnen im dritten Stock ohne Fahrstuhl.",
   ["Ist die Wohnung barrierefrei?", "Gibt es eine Toilette und Dusche auf derselben Etage?"],
   "Home environment affects mobility and discharge planning. Especially important after surgery or stroke.",
   ["sozialanamnese", "housing", "accessibility", "stairs"])

# Save
with open('../src/data/fspAnamnese.json','w',encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)
print(f"Written {len(items)} total items to fspAnamnese.json")
