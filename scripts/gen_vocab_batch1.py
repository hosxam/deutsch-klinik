import json, sys

vocab = []

def a(id, word, article, plural, translation, lay, example, ex_tr, patient, doc, category, tags):
    vocab.append({
        "id": id, "level": "FSP", "word": word,
        "article": article, "plural": plural, "translation": translation,
        "layExplanation": lay, "example": example, "exampleTranslation": ex_tr,
        "patientFriendlyPhrase": patient, "doctorToDoctorPhrase": doc,
        "category": category, "tags": tags
    })

# 1-10 General Hospital
a("fsp_v_1","die Aufnahme","die",None,"admission","When a patient is formally admitted to hospital","Der Patient wurde gestern zur Aufnahme in die Klinik gebracht.","The patient was admitted yesterday.","Sie werden jetzt aufgenommen. Sie bekommen ein Zimmer.","Die Aufnahme erfolgte um 14 Uhr uber die Notaufnahme.","General Hospital",["admission"])
a("fsp_v_2","die Entlassung","die","die Entlassungen","discharge","When a patient leaves hospital","Die Entlassung ist fur morgen fruh geplant.","Discharge is planned for tomorrow.","Sie konnen morgen nach Hause.","Entlassung in die hausliche Versorgung.","General Hospital",["discharge"])
a("fsp_v_3","die Visite","die","die Visiten","ward rounds","Daily doctor visit at the patient's bedside","Die Visite beginnt jeden Morgen um 8 Uhr.","Rounds begin at 8 AM daily.","Guten Morgen, wir machen jetzt Visite.","Bei der Visite zeigte sich der Patient stabil.","General Hospital",["rounds"])
a("fsp_v_4","der Aufnahmebefund","der","die Aufnahmebefunde","admission findings","First examination findings on admission","Der Aufnahmebefund zeigte einen erhohten Blutdruck.","Admission findings showed high blood pressure.","Wir haben bei Aufnahme alles untersucht.","Aufnahmebefund: 45-jahriger Patient mit Thoraxschmerz.","General Hospital",["admission"])
a("fsp_v_5","die Verlegung","die","die Verlegungen","transfer","Moving a patient to another department","Die Verlegung auf die Intensivstation war notwendig.","Transfer to ICU was necessary.","Wir verlegen Sie zur besseren Uberwachung.","Bei Verschlechterung Verlegung auf ITS.","General Hospital",["transfer"])
a("fsp_v_6","die Notaufnahme","die",None,"emergency department","Where emergency patients are first seen","Der Patient kam uber die Notaufnahme zu uns.","The patient came via the ED.","Sie sind jetzt in der Notaufnahme.","Aufnahme uber die zentrale Notaufnahme.","General Hospital",["emergency"])
a("fsp_v_7","die Intensivstation","die","die Intensivstationen","intensive care unit (ICU)","Ward for critically ill patients","Der Patient wurde auf die Intensivstation verlegt.","The patient was transferred to ICU.","Sie werden auf der Intensivstation intensiv uberwacht.","Verlegung auf ITS bei Kreislaufinstabilitat.","General Hospital",["icu"])
a("fsp_v_8","die Normalstation","die","die Normalstationen","general ward","Regular hospital ward for stable patients","Der Patient kann morgen auf die Normalstation verlegt werden.","The patient can be transferred to the general ward tomorrow.","Sie kommen jetzt auf die Normalstation.","Verlegung von ITS auf Normalstation.","General Hospital",["ward"])
a("fsp_v_9","der Oberarzt","der","die Oberarzte","senior physician / attending","Senior doctor supervising the ward team","Der Oberarzt entscheidet uber die weitere Therapie.","The senior physician decides on further treatment.","Der Oberarzt wird sich Ihren Fall ansehen.","Rucksprache mit dem Oberarzt erforderlich.","General Hospital",["staff"])
a("fsp_v_10","der Chefarzt","der","die Chefartze","head physician / chief of department","Most senior doctor in charge of a department","Der Chefarzt leitet die Visite jeden Mittwoch.","The chief leads rounds every Wednesday.","Der Chefarzt wird Sie morgen fruh sehen.","Vorstellung im Chefarzt des Zentrums.","General Hospital",["staff"])

# 11-20 Anamnesis
a("fsp_v_11","die Anamnese","die","die Anamnesen","medical history","The doctor-patient interview about the patient's history","Ich erhebe jetzt Ihre Anamnese.","I will now take your history.","Ich mochte Ihnen ein paar Fragen zu Ihrer Gesundheit stellen.","Anamnese: Brustschmerz seit 2 Stunden.","Anamnesis",["history"])
a("fsp_v_12","die Eigenanamnese","die","die Eigenanamnesen","patient's own history","History reported by the patient themselves","Der Patient gab in der Eigenanamnese Asthma an.","The patient reported asthma in his history.","Hatten Sie fruher schon gesundheitliche Probleme?","Eigenanamnese: Asthma seit Kindheit.","Anamnesis",["history"])
a("fsp_v_13","die Familienanamnese","die","die Familienanamnesen","family history","Diseases in the patient's family","Vater hatte mehrere Herzinfarkte.","The father had several heart attacks.","Gibt es Herzkrankheiten in Ihrer Familie?","Familienanamnese: kardiovaskulare Erkrankungen.","Anamnesis",["family"])
a("fsp_v_14","die Sozialanamnese","die",None,"social history","Patient's occupation, lifestyle and habits","Starke berufliche Belastung.","High occupational stress.","Was machen Sie beruflich?","Sozialanamnese: Schichtarbeiter, Nikotinkonsum.","Anamnesis",["social"])
a("fsp_v_15","die Hauptbeschwerde","die","die Hauptbeschwerden","chief complaint","Main symptom bringing the patient to see a doctor","Hauptbeschwerde sind Brustschmerzen.","Chief complaint is chest pain.","Was ist Ihr Hauptproblem?","Hauptbeschwerde: retrosternales Druckgefuhl.","Anamnesis",["complaint"])
a("fsp_v_16","der Beginn","der",None,"onset","When symptoms started","Beginn der Symptome vor 3 Tagen.","Onset of symptoms 3 days ago.","Wann haben die Beschwerden angefangen?","Beginn vor 72 Stunden.","Anamnesis",["timing"])
a("fsp_v_17","der Verlauf","der","die Verlaufe","course","How symptoms have developed","Der Verlauf war langsam fortschreitend.","Course was slowly progressive.","Haben sich die Beschwerden verschlimmert?","Progredienter Verlauf der Dyspnoe.","Anamnesis",["course"])
a("fsp_v_18","die Begleitsymptome","die",None,"accompanying symptoms","Other symptoms occurring with main complaint","Ubelkeit und Schwindel als Begleitsymptome.","Nausea and dizziness as accompanying symptoms.","Hatten Sie noch andere Beschwerden?","Begleitsymptome: Ubelkeit, kalter Schweiß.","Anamnesis",["symptoms"])
a("fsp_v_19","die Verschlimmerung","die","die Verschlimmerungen","exacerbation","Sudden worsening of symptoms","Bei Belastung kommt es zur Verschlimmerung.","Exertion leads to exacerbation.","Wird es schlimmer bei Bewegung?","Verschlimmerung unter Belastung.","Anamnesis",["exacerbation"])
a("fsp_v_20","der Ausloser","der","die Ausloser","trigger","Event that started the symptoms","Schweres Heben war der Ausloser.","Heavy lifting was the trigger.","Gab es etwas, das die Schmerzen ausgelost hat?","Ausloser: heben einer schweren Kiste.","Anamnesis",["trigger"])

# 21-30 Symptoms
a("fsp_v_21","das Symptom","das","die Symptome","symptom","Sign of illness","Symptome begannen vor 3 Tagen.","Symptoms began 3 days ago.","Welche Symptome haben Sie bemerkt?","Typische Symptomatik eines Herzinfarkts.","Symptoms",["symptom"])
a("fsp_v_22","die Beschwerde","die","die Beschwerden","complaint/discomfort","What troubles the patient","Patient klagt uber stechende Brustschmerzen.","Patient complains of stabbing chest pain.","Was fur Beschwerden haben Sie?","Hauptbeschwerde: retrosternales Druckgefuhl.","Symptoms",["complaint"])
a("fsp_v_23","das Fieber","das",None,"fever","Elevated body temperature","Fieber bis 39.5 Grad Celsius.","Fever up to 39.5 C.","Haben Sie Fieber gemessen?","Fieber bis 39.5 Grad, kein Schuttelfrost.","Symptoms",["fever"])
a("fsp_v_24","der Schuttelfrost","der",None,"rigors/chills","Severe shivering with fever","Nachtschweiß und Schuttelfrost.","Night sweats and chills.","Hatten Sie Schuttelfrost, starkes Frieren?","Schuttelfrost und Fieber bis 40 Grad.","Symptoms",["chills"])
a("fsp_v_25","der Nachtschweiß","der",None,"night sweats","Excessive sweating at night","Nachtschweiß in den letzten Wochen.","Night sweats in recent weeks.","Schwitzen Sie nachts stark?","Nachtschweiß und Gewichtsverlust.","Symptoms",["warning"])
a("fsp_v_26","der Gewichtsverlust","der",None,"weight loss","Unintentional loss of body weight","5 kg Gewichtsverlust in 2 Monaten.","5 kg weight loss in 2 months.","Haben Sie ungewollt abgenommen?","Ungewollter Gewichtsverlust von 5 kg.","Symptoms",["weight"])
a("fsp_v_27","die Appetitlosigkeit","die",None,"loss of appetite","No desire to eat","Appetitlosigkeit seit Beginn der Erkrankung.","Loss of appetite since illness began.","Haben Sie normalen Appetit?","Appetitlosigkeit und Gewichtsverlust.","Symptoms",["appetite"])
a("fsp_v_28","die Mudigkeit","die",None,"fatigue","Extreme tiredness","Der Patient klagt uber starke Mudigkeit.","Patient complains of severe fatigue.","Fuhlen Sie sich mud und erschopft?","Ausgepragte Fatigue bei Eisenmangelanamie.","Symptoms",["fatigue"])
a("fsp_v_29","der Schmerz","der","die Schmerzen","pain","Unpleasant physical sensation","Der Schmerz ist stechend und stark.","The pain is stabbing and severe.","Wo tut es weh?","Schmerzen in der Brust.","Symptoms",["pain"])
a("fsp_v_30","die Schwellung","die","die Schwellungen","swelling","Enlargement of body part due to fluid","Das Knie zeigt eine deutliche Schwellung.","The knee shows marked swelling.","Ist die Stelle geschwollen?","Schwellung und Rötung des Knies.","Symptoms",["swelling"])

# 31-40 Pain Description
a("fsp_v_31","stechend",None,None,"stabbing","Like a needle prick","Stechende Schmerzen hinter dem Brustbein.","Stabbing pain behind the sternum.","Fuhlt es sich stechend an?","Stechende retrosternale Schmerzen.","Pain Description",["quality"])
a("fsp_v_32","dumpf",None,None,"dull","Not sharp, like pressure","Dumpfe Kopfschmerzen.","Dull headache.","Eher dumpf und drueckend?","Dumpfe Oberbauchschmerzen.","Pain Description",["quality"])
a("fsp_v_33","kolikartig",None,None,"colicky","Coming in waves","Kolikartige Bauchschmerzen.","Colicky abdominal pain.","Kommen die Schmerzen in Wellen?","Kolikartige Schmerzen rechter Unterbauch.","Pain Description",["quality"])
a("fsp_v_34","brennend",None,None,"burning","Like a burning sensation","Brennende Schmerzen in der Speiserohre.","Burning pain in the esophagus.","Brennt es?","Brennende epigastrische Schmerzen.","Pain Description",["quality"])
a("fsp_v_35","druckend",None,None,"pressing","Like strong pressure from outside","Druckendes Gefuhl auf der Brust.","Pressing sensation on the chest.","Druckt es?","Druckender retrosternaler Schmerz.","Pain Description",["quality"])
a("fsp_v_36","pochend",None,None,"throbbing","In rhythm with heartbeat","Pochende Kopfschmerzen.","Throbbing headache.","Pocht der Schmerz?","Pochende einseitige Kopfschmerzen.","Pain Description",["quality"])
a("fsp_v_37","der Druckschmerz","der","die Druckschmerzen","tenderness","Pain on pressing","Druckschmerz im rechten Oberbauch.","Tenderness in right upper abdomen.","Tut es weh, wenn ich drucke?","Druckschmerz mit Loslassschmerz.","Pain Description",["tenderness"])
a("fsp_v_38","der Loslassschmerz","der","die Loslassschmerzen","rebound tenderness","Pain on sudden release of pressure","Positiver Loslassschmerz.","Positive rebound tenderness.","Ich drucke und lasse plotzlich los.","Positiver Loslassschmerz rechter Unterbauch.","Pain Description",["rebound"])
a("fsp_v_39","wandernd",None,None,"migrating","Changing location in the body","Wandernde Gelenkschmerzen.","Migrating joint pain.","Andert der Schmerz seine Position?","Wandernde Gelenkschmerzen.","Pain Description",["quality"])
a("fsp_v_40","belastungsabhangig",None,None,"exertion-dependent","Only occurring with activity","Schmerzen belastungsabhangig.","Pain exertion-dependent.","Treten Schmerzen nur bei Bewegung auf?","Belastungsabhangige Knieschmerzen.","Pain Description",["trigger"])

# 41-50 Cardiovascular
a("fsp_v_41","der Herzinfarkt","der","die Herzinfarkte","heart attack","Blocked blood vessel in the heart","Akuter Herzinfarkt der Vorderwand.","Acute anterior wall heart attack.","Ein Gefass in Ihrem Herzen ist verschlossen.","ST-Hebungsinfarkt der Vorderwand.","Cardiovascular",["infarction"])
a("fsp_v_42","die Angina pectoris","die",None,"angina pectoris","Chest pressure due to low heart oxygen","Angina bei Belastung.","Angina on exertion.","Engegefuhl in der Brust beim Treppensteigen?","Stabile Angina pectoris CCS II.","Cardiovascular",["angina"])
a("fsp_v_43","die Herzinsuffizienz","die",None,"heart failure","Heart pumps insufficiently","Dekompensierte Herzinsuffizienz.","Decompensated heart failure.","Ihr Herz pumpt nicht mehr kraftig genug.","Dekompensierte Herzinsuffizienz.","Cardiovascular",["heart failure"])
a("fsp_v_44","der Blutdruck","der","die Blutdruckwerte","blood pressure","Pressure of blood in arteries","Blutdruck 150/90 mmHg.","Blood pressure 150/90.","Ihr Blutdruck ist etwas hoch.","Blutdruck bei Aufnahme 150/90.","Cardiovascular",["vital"])
a("fsp_v_45","die Rhythmusstorung","die","die Rhythmusstorungen","arrhythmia","Irregular heartbeat","Im EKG eine Rhythmusstorung.","ECG shows arrhythmia.","Ihr Herz schlagt unregelmasig.","Vorhofflimmern mit Arrhythmie.","Cardiovascular",["arrhythmia"])
a("fsp_v_46","die KHK","die",None,"CAD (coronary artery disease)","Narrowed coronary arteries","Bekannte koronare Herzkrankheit.","Known coronary artery disease.","Ihre Herzkranzgefasse sind verengt.","KHK mit Dreigefasserkrankung.","Cardiovascular",["cad"])
a("fsp_v_47","der Herzkatheter","der","die Herzkatheter","cardiac catheterization","Tube guided to heart through vessels","Herzkatheter morgen geplant.","Cardiac cath planned for tomorrow.","Wir schauen mit Katheter in Ihre Gefasse.","Geplante Koronarangiographie.","Cardiovascular",["procedure"])
a("fsp_v_48","der Stent","der","die Stents","stent","Small mesh tube keeping vessels open","Stent in die linke Koronararterie.","Stent in left coronary artery.","Ein kleines Rohrchen halt das Gefass offen.","Stenteinlage in RIVA.","Cardiovascular",["stent"])
a("fsp_v_49","die Herzfrequenz","die","die Herzfrequenzen","heart rate","Heartbeats per minute","Herzfrequenz 85/min.","Heart rate 85/min.","Ihr Herz schlagt 85 Mal pro Minute.","Herzfrequenz 85/min, normofrequent.","Cardiovascular",["vital"])
a("fsp_v_50","das Blutgerinnsel","das","die Blutgerinnsel","blood clot","Clumped blood blocking vessels","Gefahr eines Blutgerinnsels.","Risk of blood clot.","Ein Blutklumpen kann das Gefass verstopfen.","Thrombus bei Vorhofflimmern.","Cardiovascular",["clot"])

# Save
with open('../src/data/fspVocabulary.json','w',encoding='utf-8') as f:
    json.dump(vocab, f, ensure_ascii=False, indent=2)
print(f"Written {len(vocab)} vocabulary entries to fspVocabulary.json")
