import json, sys

# Read existing
existing = json.load(open('../src/data/fspVocabulary.json','r',encoding='utf-8'))
used_ids = set(x['id'] for x in existing)

next_id = max(int(x['id'].split('_')[2]) for x in existing) + 1

def i():
    global next_id
    r = f"fsp_v_{next_id}"
    next_id += 1
    return r

vocab = existing

def a(word, article, plural, translation, lay, example, ex_tr, patient, doc, category, tags):
    vocab.append({
        "id": i(), "level": "FSP", "word": word,
        "article": article, "plural": plural, "translation": translation,
        "layExplanation": lay, "example": example, "exampleTranslation": ex_tr,
        "patientFriendlyPhrase": patient, "doctorToDoctorPhrase": doc,
        "category": category, "tags": tags
    })

# 51-60: Respiratory
a("die Atemnot","die",None,"shortness of breath","Feeling of not getting enough air","Atemnot seit Tagen zunehmend.","Progressive shortness of breath for days.","Bekommen Sie genug Luft?","Ruhedyspnoe bei COPD GOLD III.","Respiratory",["dyspnea"])
a("der Husten","der",None,"cough","Reflexive expulsion of air from airways","Husten seit 2 Wochen.","Cough for 2 weeks.","Haben Sie Husten?","Produktiver Husten mit Auswurf.","Respiratory",["cough"])
a("der Auswurf","der",None,"sputum","Secretions coughed up from lungs","Auswurf gelblich und zah.","Sputum yellowish and thick.","Kommt beim Husten etwas hoch?","Eitriger Auswurf.","Respiratory",["sputum"])
a("die Lungenentzundung","die","die Lungenentzundungen","pneumonia","Inflammation of lung tissue","Lungenentzundung rechter Unterlappen.","Pneumonia right lower lobe.","Eine Infektion in der Lunge.","Ambulant erworbene Pneumonie.","Respiratory",["pneumonia"])
a("die Sauerstoffsattigung","die","die Sauerstoffsattigungen","oxygen saturation","Percentage of oxygen in blood","Sauerstoffsattigung 94 Prozent.","Oxygen saturation 94 percent.","Ihr Sauerstoffgehalt ist etwas niedrig.","SpO2 88 Prozent unter Raumluft.","Respiratory",["oxygen"])
a("die COPD","die",None,"COPD","Chronic lung disease with narrowed airways","COPD GOLD III.","COPD stage GOLD III.","Chronische Lungenerkrankung.","COPD GOLD III, Exazerbation.","Respiratory",["copd"])
a("das Asthma","das",None,"asthma","Recurrent airway narrowing","Asthma seit Kindheit.","Asthma since childhood.","Ihre Atemwege verengen sich anfallsartig.","Asthma bronchiale unter ICS/LABA.","Respiratory",["asthma"])
a("die Bronchitis","die","die Bronchitiden","bronchitis","Inflammation of the bronchi","Akute Bronchitis.","Acute bronchitis.","Entzundung der Atemwege.","Akute obstruktive Bronchitis.","Respiratory",["bronchitis"])
a("die Lungenembolie","die","die Lungenembolien","pulmonary embolism","Blood clot blocking a lung vessel","Verdacht auf Lungenembolie.","Suspected pulmonary embolism.","Ein Gerinnsel hat ein Lungengefass verstopft.","Akute Lungenembolie.","Respiratory",["embolism"])
a("die Lungenfibrose","die","die Lungenfibrosen","pulmonary fibrosis","Scarring of lung tissue","Lungenfibrose mit restriktiver Storung.","Pulmonary fibrosis with restrictive disorder.","Das Lungengewebe vernarbt.","Idiopathische Lungenfibrose.","Respiratory",["fibrosis"])

# 61-70: Gastrointestinal
a("die Ubelkeit","die",None,"nausea","Feeling of needing to vomit","Ubelkeit nach dem Essen.","Nausea after eating.","Ist Ihnen ubel?","Postprandiale Ubelkeit.","Gastrointestinal",["nausea"])
a("das Erbrechen","das",None,"vomiting","Stomach contents coming out through mouth","Erbrechen mehrmals taglich.","Vomiting several times daily.","Mussten Sie sich ubergeben?","Wiederholtes Erbrechen.","Gastrointestinal",["vomiting"])
a("der Durchfall","der",None,"diarrhea","Frequent loose stools","Wassriger Durchfall seit 3 Tagen.","Watery diarrhea for 3 days.","Haben Sie Durchfall?","Wassrige Diarrhoe.","Gastrointestinal",["diarrhea"])
a("die Verstopfung","die",None,"constipation","Infrequent hard stools","Verstopfung seit Tagen.","Constipation for days.","Probleme mit Stuhlgang?","Obstipation trotz Laxanzien.","Gastrointestinal",["constipation"])
a("der Oberbauchschmerz","der","die Oberbauchschmerzen","epigastric pain","Pain in upper abdomen","Oberbauchschmerzen nach Mahlzeiten.","Epigastric pain after meals.","Tut es hier oben weh?","Epigastrische Schmerzen.","Gastrointestinal",["pain"])
a("der Unterbauchschmerz","der","die Unterbauchschmerzen","lower abdominal pain","Pain in lower abdomen","Schmerzen rechts starker.","Pain worse on right.","Tut es hier unten rechts weh?","Rechts Unterbauchschmerzen.","Gastrointestinal",["pain"])
a("die Gastritis","die","die Gastritiden","gastritis","Inflammation of stomach lining","Erosive Gastritis.","Erosive gastritis.","Ihre Magenschleimhaut ist entzundet.","Erosive Antrumgastritis.","Gastrointestinal",["gastritis"])
a("das Magengeschwur","das","die Magengeschwure","gastric ulcer","Open sore in stomach lining","Blutendes Magengeschwur.","Bleeding gastric ulcer.","Ein Geschwur im Magen.","Ulcus ventriculi.","Gastrointestinal",["ulcer"])
a("die Pankreatitis","die","die Pankreatitiden","pancreatitis","Inflammation of pancreas","Akute Pankreatitis stationar.","Acute pancreatitis inpatient.","Bauchspeicheldruse ist entzundet.","Akute Pankreatitis, biliar.","Gastrointestinal",["pancreatitis"])
a("die Appendizitis","die","die Appendizitiden","appendicitis","Inflammation of appendix","Akute Appendizitis.","Acute appendicitis.","Ihr Blinddarm ist entzundet.","Akute Appendizitis sonografisch.","Gastrointestinal",["appendicitis"])

# 71-80: Neurology
a("der Schlaganfall","der","die Schlaganfalle","stroke","Interrupted blood supply to brain","Verdacht auf Schlaganfall.","Suspected stroke.","Durchblutungsstorung im Gehirn.","Akuter ischamischer Schlaganfall.","Neurology",["stroke"])
a("der Schwindel","der",None,"dizziness","Feeling of spinning or unsteadiness","Drehschwindel fur 30 Sekunden.","Vertigo for 30 seconds.","Ist Ihnen schwindelig?","Benigner paroxysmaler Lagerungsschwindel.","Neurology",["dizziness"])
a("die Lahnung","die","die Lahnungen","paralysis","Inability to move a body part","Lahnung der rechten Seite.","Right-sided paralysis.","Konnen Sie alles bewegen?","Hemiparese rechts.","Neurology",["paralysis"])
a("die Migrane","die","die Migranen","migraine","Severe often one-sided headache","Migrane 1x pro Monat.","Migraine once monthly.","Pochende Kopfschmerzen auf einer Seite?","Migrane mit Aura.","Neurology",["migraine"])
a("der Krampfanfall","der","die Krampfanfalle","seizure","Uncontrolled body convulsions","Erster Krampfanfall gestern.","First seizure yesterday.","Hatten Sie Krampfanfalle?","Tonisch-klonischer Krampfanfall.","Neurology",["seizure"])
a("die Epilepsie","die","die Epilepsien","epilepsy","Recurrent seizure disorder","Bekannte Epilepsie.","Known epilepsy.","Neigung zu Krampfanfallen.","Fokale Epilepsie.","Neurology",["epilepsy"])
a("der Kopfschmerz","der","die Kopfschmerzen","headache","Pain in the head","Kopfschmerzen seit Tagen.","Headache for days.","Tut der Kopf weh?","Spannungskopfschmerz.","Neurology",["headache"])
a("die Sensibilitatsstorung","die","die Sensibilitatsstorungen","sensory disturbance","Abnormal sensation like numbness","Taubheitsgefuhl im linken Arm.","Numbness in left arm.","Fuhlt es sich taub an?","Sensibilitatsstorung linke Korperhalfte.","Neurology",["sensory"])
a("der Tremor","der",None,"tremor","Involuntary shaking","Handtremor in Ruhe.","Hand tremor at rest.","Zittern Ihre Hande?","Ruhetremor bei Morbus Parkinson.","Neurology",["tremor"])
a("die Gedachtnisstorung","die","die Gedachtnisstorungen","memory impairment","Problems with memory","Zunehmende Gedachtnisstorungen.","Progressive memory impairment.","Haben Sie Probleme mit dem Gedachtnis?","Kognitive Einschrankung bei Demenz.","Neurology",["memory"])

# 81-90: Musculoskeletal
a("der Bandscheibenvorfall","der","die Bandscheibenvorfalle","herniated disc","Disc pressing on nerve","Bandscheibenvorfall L4/L5.","Herniated disc L4/L5.","Eine Bandscheibe druckt auf einen Nerv.","Bandscheibenvorfall mit Wurzelkompression.","Musculoskeletal",["spine"])
a("der Gelenkerguss","der","die Gelenkergusse","joint effusion","Fluid in a joint","Kniegelenkerguss rechts.","Right knee effusion.","Knie geschwollen durch Flussigkeit.","Kniegelenkerguss bei Gonarthrose.","Musculoskeletal",["joint"])
a("die Arthrose","die","die Arthrosen","osteoarthritis","Joint cartilage wear","Gonarthrose beidseits.","Bilateral knee osteoarthritis.","Gelenkverschleiß.","Gonarthrose rechts.","Musculoskeletal",["arthritis"])
a("die Arthritis","die","die Arthritiden","arthritis","Joint inflammation","Rheumatoide Arthritis.","Rheumatoid arthritis.","Entzundung in den Gelenken.","Rheumatoide Arthritis der Hande.","Musculoskeletal",["arthritis"])
a("die Osteoporose","die",None,"osteoporosis","Bone density loss","Osteoporose mit Frakturrisiko.","Osteoporosis with fracture risk.","Die Knochen werden dunn und bruchig.","Osteoporose T-Score -3.0.","Musculoskeletal",["bone"])
a("der Bruch","der","die Bruche","fracture","Broken bone","Oberschenkelfraktur.","Femur fracture.","Knochen gebrochen.","Subtrochantare Femurfraktur.","Musculoskeletal",["fracture"])
a("die Verstauchung","die","die Verstauchungen","sprain","Ligament injury","Sprunggelenk verstaucht.","Ankle sprain.","Bandverletzung ohne Bruch.","Distorsion des oberen Sprunggelenks.","Musculoskeletal",["sprain"])
a("die Prellung","die","die Prellungen","contusion/bruise","Blunt force injury","Prellung der Brustwand.","Chest wall contusion.","Bluterguss durch Stoß.","Kontusion der Thoraxwand.","Musculoskeletal",["contusion"])
a("der Hexenschuss","der","die Hexenschusse","lumbago","Acute lower back pain","Hexenschuss beim Bücken.","Lumbago when bending over.","Akuter Ruckenschmerz.","Lumbago mit muskularem Hartspann.","Musculoskeletal",["back"])
a("der Bandscheibenvorfall","der","die Bandscheibenvorfalle","slipped disc","Nerve compression by a disc","Bandscheibenvorfall HWS.","Cervical disc herniation.","Der Bandscheibe ist im Halsbereich raus.","Zervikaler Bandscheibenvorfall.","Musculoskeletal",["spine"])

# 90-100: Urology / Emergency
a("die Harnwegsinfektion","die","die Harnwegsinfektionen","UTI","Urinary tract infection","Harnwegsinfektion mit Brennen.","UTI with burning.","Infektion in den Harnwegen.","Harnwegsinfekt, E. coli.","Urology",["uti"])
a("der Nierenstein","der","die Nierensteine","kidney stone","Mineral deposit in kidney","Nierenstein mit Kolik.","Kidney stone with colic.","Stein in der Niere oder im Harnleiter.","Ureterstein mit Nierenkolik.","Urology",["stone"])
a("die Inkontinenz","die",None,"incontinence","Loss of bladder/bowel control","Harninkontinenz seit Geburt.","Urinary incontinence since birth.","Sie konnen den Urin nicht halten.","Belastungsinkontinenz Grad II.","Urology",["incontinence"])
a("der Notfall","der","die Notfalle","emergency","Acute life-threatening situation","Herz-Kreislauf-Notfall.","Cardiovascular emergency.","Akuter medizinischer Notfall.","Internistischer Notfall.","Emergency Medicine",["emergency"])
a("die Reanimation","die","die Reanimationen","resuscitation","Restoring vital functions","Reanimation nach Kreislaufstillstand.","Resuscitation after cardiac arrest.","Wiederbelebung.","Kardiopulmonale Reanimation uber 15 Minuten.","Emergency Medicine",["resuscitation"])
a("die allergische Reaktion","die","die allergischen Reaktionen","allergic reaction","Immune response to an allergen","Allergische Reaktion auf Penicillin.","Allergic reaction to penicillin.","Uberempfindlichkeitsreaktion.","Anaphylaktische Reaktion.","Allergies",["allergy"])
a("der Hautausschlag","der","die Hautausschlage","rash","Visible change on skin","Juckender Hautausschlag.","Itchy rash.","Ausschlag auf der Haut.","Urticarieller Hautausschlag.","Dermatology",["rash"])
a("die Ekzem","das","die Ekzeme","eczema","Inflammatory skin condition","Chronisches Ekzem an den Handen.","Chronic hand eczema.","Entzundliche Hauterkrankung.","Atopisches Ekzem.","Dermatology",["eczema"])
a("die Wundheilungsstorung","die","die Wundheilungsstorungen","wound healing disorder","Impaired wound healing","Wundheilungsstorung nach OP.","Impaired wound healing after surgery.","Die Wunde heilt nicht richtig.","Wundheilungsstorung bei Diabetes.","Procedures",["wound"])
a("die Drainage","die","die Drainagen","drain","Tube to drain fluid","Drainage nach der Operation.","Drain after surgery.","Ein Schlauch fur Wundsekret.","Wunddrainage, Forderung seros.","Procedures",["drain"])

with open('../src/data/fspVocabulary.json','w',encoding='utf-8') as f:
    json.dump(vocab, f, ensure_ascii=False, indent=2)
print(f"Written {len(vocab)} total entries to fspVocabulary.json")
