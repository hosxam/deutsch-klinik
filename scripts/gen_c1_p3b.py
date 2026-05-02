"""Part B: Topics 16-25"""
import json, os

ROOT = r"C:\Users\ASUS\.openclaw\workspace\deutsch-klinik\src\data"
PATH = os.path.join(ROOT, "grammar.json")

with open(PATH, "r") as f:
    data = json.load(f)
existing = data.get("C1", [])
existing_prompts = {e["prompt"].lower().strip()[:80] for e in existing}

NEW = []
def add(etype, prompt, answer, explanation, topic, lesson_id, options=None):
    norm = prompt.lower().strip()[:80]
    if norm in existing_prompts:
        return
    existing_prompts.add(norm)
    ex = {
        "id": f"C1_gr_{len(NEW)+len(existing)+1:03d}",
        "level": "C1", "topic": topic, "unit": topic[:20],
        "type": etype, "prompt": prompt, "answer": answer,
        "explanation": explanation, "lessonId": lesson_id,
    }
    if options: ex["options"] = options
    NEW.append(ex)

def lid(n):
    return f"C1_lesson_{n}"

# Topic 16: Register and Academic Style (9)
add("sentence-correction", "Ersetzen Sie: 'Der Patient isst nichts' durch medizinische Formulierung.", "Der Patient verweigert die Nahrungsaufnahme.", "Medizinisches Register.", "Register and Academic Style", lid(16))
add("sentence-correction", "Ersetzen Sie 'man' durch Passiv: 'Man beobachtete eine Besserung.'", "Eine Besserung wurde beobachtet.", "Passiv statt man.", "Register and Academic Style", lid(16))
add("fill-blank", "Statt 'zeigen' verwendet man in der Wissenschaft eher ...", "demonstrieren", "Demonstrieren = formeller.", "Register and Academic Style", lid(16), ["zeigen", "demonstrieren", "sehen", "machen"])
add("sentence-correction", "Formulieren Sie um: 'Die Werte sind besser geworden' (Wissenschaftsstil).", "Die Werte haben sich verbessert.", "Sich verbessern statt besser werden.", "Register and Academic Style", lid(16))
add("sentence-correction", "Formulieren Sie neutraler: 'Der Patient hat Krebs.'", "Bei dem Patienten wurde eine Krebserkrankung diagnostiziert.", "Med. Register.", "Register and Academic Style", lid(16))
add("fill-blank", "Statt 'viel' verwendet man in der Wissenschaft ...", "signifikant", "Signifikant = wissenschaftlich.", "Register and Academic Style", lid(16), ["viel", "signifikant", "gross", "wichtig"])
add("sentence-correction", "Ersetzen Sie: 'Der Test war total daneben.'", "Der Test ergab keine verwertbaren Ergebnisse.", "Umgangssprache korrigieren.", "Register and Academic Style", lid(16))
add("mcq", "Welche Formulierung ist akademisch angemessen?", "Die vorliegende Studie untersucht den Zusammenhang.", "Akademischer Stil.", "Register and Academic Style", lid(16), ["Die vorliegende Studie untersucht", "Diese Arbeit guckt sich an", "In dieser Arbeit geht es um", "Ich schreibe ueber"])
add("fill-blank", "Statt 'rausfinden' schreibt man in der Wissenschaft '...'", "ermitteln", "Ermitteln = wissenschaftlich.", "Register and Academic Style", lid(16), ["rausfinden", "ermitteln", "suchen", "sehen"])

# Topic 17: Text Cohesion (9)
add("fill-blank", "Die Studie ergab positive Resultate. ... wurden nicht publiziert.", "Diese", "Diese = Rueckverweis.", "Text Cohesion and Reference", lid(17), ["Jene", "Diese", "Solche", "Welche"])
add("fill-blank", "Die Hypothese war umstritten. ... ungeachtet wurde sie getestet.", "Dem", "Dem ungeachtet = dessen ungeachtet.", "Text Cohesion and Reference", lid(17), ["Dem", "Das", "Denen", "Die"])
add("mcq", "Welches Verweiswort passt: 'Die Methode ist teuer. ... wird sie eingesetzt.'", "Trotzdem", "Adversativ.", "Text Cohesion and Reference", lid(17), ["Trotzdem", "Weil", "Obwohl", "Deshalb"])
add("fill-blank", "Die Probanden zeigten keine Nebenwirkungen. ... war die Studie erfolgreich.", "Folglich", "Konsekutiv.", "Text Cohesion and Reference", lid(17), ["Folglich", "Trotzdem", "Allerdings", "Zunaechst"])
add("fill-blank", "Es wurden drei Hypothesen aufgestellt. ... soll nun ueberprueft werden.", "Diese", "Ordinaler Verweis.", "Text Cohesion and Reference", lid(17), ["Diese", "Jene", "Erstere", "Letzteres"])
add("fill-blank", "... vorausgeschickt, dass die Daten nicht vollstaendig sind.", "Sei", "Sei vorausgeschickt = unpersoenlich.", "Text Cohesion and Reference", lid(17), ["Sei", "Wird", "Ist", "Habe"])
add("mcq", "Welches Wort schafft Kohaesion? '..., wie bereits erwahnt wurde'", "wie bereits erwahnt", "Rueckverweis.", "Text Cohesion and Reference", lid(17), ["wie bereits erwahnt", "wie vorher", "wie neu", "wie oben nicht"])
add("fill-blank", "Der Wirkstoff zeigte Wirkung. ... wurden die Ergebnisse kritisiert.", "Gleichwohl", "Adversativ.", "Text Cohesion and Reference", lid(17), ["Gleichwohl", "Weil", "Denn", "Folglich"])
add("fill-blank", "Die Autoren fuehren Daten an. ... soll die These gestuetzt werden.", "Damit", "Finaler Verweis.", "Text Cohesion and Reference", lid(17), ["Damit", "Weil", "Obwohl", "Trotz"])

# Topic 18: Modal Particles Formal (8)
add("fill-blank", "Die Ergebnisse sind ... nachvollziehbar.", "durchaus", "Durchaus = subjektive Verstaerkung.", "Modal Particles Formal", lid(17), ["durchaus", "sehr", "ganz", "auch"])
add("fill-blank", "Das ist ... nicht die optimale Loesung.", "eben", "Eben = abtonend.", "Modal Particles Formal", lid(17), ["eben", "auch", "nur", "schon"])
add("fill-blank", "Die Studie ist ... nicht repraesentativ.", "wohl", "Wohl = Annahme.", "Modal Particles Formal", lid(17), ["wohl", "schon", "auch", "eben"])
add("mcq", "Welche Modalpartikel passt: 'Das ist ... nicht die Aufgabe des Arztes.'", "doch", "Doch = betonend.", "Modal Particles Formal", lid(17), ["doch", "auch", "eben", "schon"])
add("fill-blank", "... dies sei an dieser Stelle erlaeutert.", "Kurzum", "Kurzum = resuemierend.", "Modal Particles Formal", lid(17), ["Kurzum", "Also", "Naemlich", "Denn"])
add("fill-blank", "Die Untersuchung ergab ... keine Auffaelligkeiten.", "zunaechst", "Zunaechst = temporal.", "Modal Particles Formal", lid(17), ["zunaechst", "schon", "eben", "auch"])
add("fill-blank", "Das Ergebnis war ... erwartet worden.", "wie", "Wie erwartet.", "Modal Particles Formal", lid(17), ["wie", "als", "dass", "denn"])
add("mcq", "Welche Partikel drueckt eine Vermutung aus?", "Die Theorie duerfte richtig sein.", "Duerfte = Vermutung.", "Modal Particles Formal", lid(17), ["Die Theorie duerfte richtig sein", "Die Theorie ist richtig", "Die Theorie war richtig", "Die Theorie wird richtig"])

# Topic 19: Advanced Prepositional Phrases (8)
add("fill-blank", "... der Sachlage musste die Diagnose revidiert werden.", "Angesichts", "Angesichts + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Angesichts", "Wegen", "Trotz", "Dank"])
add("fill-blank", "... der Bedenken wurde die Therapie abgebrochen.", "Aufgrund", "Aufgrund + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Aufgrund", "Trotz", "Mittels", "Behufs"])
add("mcq", "Welche Praeposition passt: '... des Gesetzes ist die Handlung strafbar.'", "Zufolge", "Zufolge + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Zufolge", "Wegen", "Trotz", "Aufgrund"])
add("fill-blank", "Die Daten wurden ... eines standardisierten Verfahrens erhoben.", "mittels", "Mittels + Genitiv.", "Adv Prepositional Phrases", lid(18), ["mittels", "wegen", "trotz", "dank"])
add("fill-blank", "... der Therapie erholte sich der Patient.", "Infolge", "Infolge + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Infolge", "Laut", "Gemaess", "Mangels"])
add("mcq", "Welche Praepositionalangabe ist korrekt?", "Im Hinblick auf die Kosten wurde die Methode gewaehlt.", "Im Hinblick auf + Akkusativ.", "Adv Prepositional Phrases", lid(18), ["Im Hinblick auf die Kosten", "Hinsichtlich die Kosten", "In Hinblick die Kosten", "Im Hinblick der Kosten"])
add("fill-blank", "... eindeutiger Beweise wurde der Fall geschlossen.", "Mangels", "Mangels + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Mangels", "Wegen", "Aufgrund", "Dank"])
add("fill-blank", "... des Urteils koennen die Beteiligten Berufung einlegen.", "Unbeschadet", "Unbeschadet + Genitiv.", "Adv Prepositional Phrases", lid(18), ["Unbeschadet", "Trotz", "Wegen", "Mangels"])

# Topic 20: Medical Documentation (8)
add("fill-blank", "Der Patient klagte ueber ... im Bereich des Abdomens.", "Schmerzen", "Arztbrief Einstieg.", "Med Documentation", lid(18), ["Schmerzen", "Fieber", "Husten", "Kopfweh"])
add("sentence-correction", "Formulieren Sie medizinisch: 'Der Patient hat sich wehgetan'", "Der Patient gab Schmerzen im Bereich der linken Schulter an.", "Standardformel.", "Med Documentation", lid(18))
add("fill-blank", "In der Anamnese ... der Patient einen stattgehabten Myokardinfarkt.", "berichtete", "Anamnesebericht.", "Med Documentation", lid(18), ["berichtete", "sagte", "erzaehlte", "sprach"])
add("fill-blank", "Der Allgemeinzustand des Patienten war ...", "reduziert", "Standardformel.", "Med Documentation", lid(18), ["reduziert", "schlecht", "nicht gut", "unbefriedigend"])
add("fill-blank", "Der Patient war ... bezueglich Zeit, Ort und Person.", "voll orientiert", "Voll orientiert = Standard.", "Med Documentation", lid(18), ["voll orientiert", "wach", "wach und klar", "orientiert"])
add("sentence-correction", "Formulieren Sie: 'Dem Patienten geht es besser' im Arztbrief.", "Der Patient zeigte eine klinische Besserung.", "Standardformel.", "Med Documentation", lid(18))
add("fill-blank", "Die Medikation wurde ... vertragen.", "gut", "Gut vertragen = Standard.", "Med Documentation", lid(18), ["gut", "schlecht", "ausgezeichnet", "problemlos"])
add("fill-blank", "... wurde der Patient in die hausaerztliche Weiterbetreuung entlassen.", "Abschliessend", "Abschliessend = Schlusssatz.", "Med Documentation", lid(18), ["Abschliessend", "Endlich", "Letztlich", "Schlussendlich"])

# Topic 21: Arztbrief Phrasing (5)
add("fill-blank", "Hiermit ueberweisen wir den Patienten ... fachorthopaedische Mitbeurteilung.", "zur", "Zur Mitbeurteilung.", "Arztbrief Phrasing", lid(19), ["zur", "fuer", "zurueck", "nach"])
add("fill-blank", "Wir stellten die Diagnose einer ...", "Pneumonie", "Diagnose mit Genitiv.", "Arztbrief Phrasing", lid(19), ["Pneumonie", "Lungenentzuendung", "Pneumonitis", "Bronchitis"])
add("fill-blank", "Der Patient wurde ... auf die Intensivstation verlegt.", "umgehend", "Dringlichkeitsvermerk.", "Arztbrief Phrasing", lid(19), ["umgehend", "schnell", "bald", "sofort"])
add("fill-blank", "Als ... wurden 500 mg Amoxicillin verabreicht.", "Medikation", "Standard.", "Arztbrief Phrasing", lid(19), ["Medikation", "Mittel", "Praeparat", "Dosis"])
add("fill-blank", "Empfehlung: ... Bildgebung zur weiteren Abklaerung.", "Erneute", "Erneute Bildgebung.", "Arztbrief Phrasing", lid(19), ["Erneute", "Neue", "Weitere", "Zusaetzliche"])

# Topic 22: Case Presentation (6)
add("fill-blank", "Wir berichten ueber den Fall einer ... Patientin.", "43-jaehrigen", "Standard.", "Case Presentation", lid(19), ["43-jaehrigen", "43 alte", "jungen", "erwachsenen"])
add("fill-blank", "Die Patientin stellte sich mit ... Luftnot vor.", "akuter", "Sich mit etwas vorstellen.", "Case Presentation", lid(19), ["akuter", "vieler", "grosser", "schlimmer"])
add("fill-blank", "... erfolgte die Aufnahme auf unsere Station.", "Daraufhin", "Temporal.", "Case Presentation", lid(19), ["Daraufhin", "Vorher", "Danach nicht", "Nach"])
add("fill-blank", "Im ... wurde eine Echokardiographie durchgefuehrt.", "Verlauf", "Im Verlauf.", "Case Presentation", lid(19), ["Verlauf", "Laufe", "Klinik", "Befund"])
add("fill-blank", "Die ... ergab eine linksventrikulaere Ejektionsfraktion von 45%.", "Untersuchung", "Standard.", "Case Presentation", lid(19), ["Untersuchung", "Messung", "Bildgebung", "Diagnose"])
add("mcq", "Welche Formulierung ist typisch fuer eine Fallpraesentation?", "Wir berichten ueber eine 55-jaehrige Patientin mit Z. n. Myokardinfarkt.", "Z. n. = Zustand nach.", "Case Presentation", lid(19), ["Wir berichten ueber eine 55-jaehrige Patientin mit Z. n. Myokardinfarkt", "Der Patient war 55", "Eine 55-jaehrige Patientin kam", "Die Patientin hatte einen Herzinfarkt"])

# Topic 23: Scientific Writing (9)
add("fill-blank", "In der ... Studie wurde der Zusammenhang untersucht.", "vorliegenden", "In der vorliegenden Studie = Standard.", "Scientific Writing", lid(20), ["vorliegenden", "aktuellen", "neuen", "wichtigen"])
add("fill-blank", "Die ... der Arbeit war es, die Hypothese zu ueberpruefen.", "Zielsetzung", "Wissenschaftlich.", "Scientific Writing", lid(20), ["Zielsetzung", "Idee", "Punkt", "Sache"])
add("fill-blank", "Im ... wird zunaechst der Forschungsstand dargelegt.", "theoretischen Teil", "Standardstruktur.", "Scientific Writing", lid(20), ["theoretischen Teil", "Anfang", "ersten Kapitel", "Buch"])
add("fill-blank", "Die ... erfolgte mittels eines standardisierten Fragebogens.", "Datenerhebung", "Wissenschaftlich.", "Scientific Writing", lid(20), ["Datenerhebung", "Datensammlung", "Befragung", "Umfrage"])
add("fill-blank", "Die ... der Ergebnisse erfolgt im folgenden Kapitel.", "Diskussion", "Standard.", "Scientific Writing", lid(20), ["Diskussion", "Besprechung", "Sprechen", "Rede"])
add("fill-blank", "... muss die Fragestellung praezisiert werden.", "Zunaechst", "Gliederung.", "Scientific Writing", lid(20), ["Zunaechst", "Dann", "Nachher", "Sofort"])
add("mcq", "Welche Formulierung ist im Methodenteil korrekt?", "Die Probanden wurden mittels Randomisierung zwei Gruppen zugeteilt.", "Methodenteil Standard.", "Scientific Writing", lid(20), ["Die Probanden wurden mittels Randomisierung zwei Gruppen zugeteilt", "Die Leute wurden zufaellig in zwei Gruppen eingeteilt", "Man hat die Leute in Gruppen getan", "Die Gruppe wurde randomisiert"])
add("fill-blank", "Die ... sind in Tabelle 1 zusammengefasst.", "Ergebnisse", "Standard.", "Scientific Writing", lid(20), ["Ergebnisse", "Resultate", "Zahlen", "Dinge"])
add("fill-blank", "Zusammenfassend ... die vorliegende Studie, dass die Hypothese bestaetigt werden konnte.", "zeigt", "Zusammenfassend = Abschluss.", "Scientific Writing", lid(20), ["zeigt", "macht klar", "beweist", "demonstriert"])

# Topic 24: Argumentation and Counterargument (9)
add("fill-blank", "... der genannten Vorteile sind jedoch auch Nachteile zu bedenken.", "Trotz", "Trotz + Genitiv = konzessiv.", "Argumentation and Counter", lid(21), ["Trotz", "Wegen", "Dank", "Mittels"])
add("fill-blank", "Fuer die These spricht ..., dass sie empirisch belegt ist.", "zunaechst", "Zunaechst = erstens.", "Argumentation and Counter", lid(21), ["zunaechst", "dagegen", "aber", "jedoch"])
add("fill-blank", "... ist einzuwenden, dass die Stichprobe zu klein war.", "Gegen die These", "Gegendarstellung.", "Argumentation and Counter", lid(21), ["Gegen die These", "Fuer die These", "Zudem", "Weiterhin"])
add("mcq", "Welche Einleitung passt zu einem Gegenargument?", "Dem ist entgegenzuhalten, dass...", "Standard Gegenargument.", "Argumentation and Counter", lid(21), ["Dem ist entgegenzuhalten, dass...", "Erstens moechte ich sagen", "Ich finde auch", "Die Theorie sagt"])
add("fill-blank", "Ein weiteres ... fuer die Hypothese ist die Reproduzierbarkeit.", "Argument", "Standard.", "Argumentation and Counter", lid(21), ["Argument", "Grund", "Beweis", "Punkt"])
add("fill-blank", "... muss jedoch beruecksichtigt werden, dass die Kosten steigen.", "Gleichzeitig", "Gleichzeitig = adversativ.", "Argumentation and Counter", lid(21), ["Gleichzeitig", "Danach", "Vorher", "Spaeter"])
add("fill-blank", "Allerdings ... die Annahme auf schwachen Belegen.", "basiert", "Basiert auf = Standard.", "Argumentation and Counter", lid(21), ["basiert", "steht", "liegt", "baut"])
add("fill-blank", "Die Argumentation ... darin, dass die Methodik mangelhaft war.", "greift zu kurz", "Gelaeufige Wendung.", "Argumentation and Counter", lid(21), ["greift zu kurz", "ist gut", "ist richtig", "stimmt"])
add("mcq", "Welches Wort markiert eine Gegenposition?", "Demgegenueber ist festzustellen...", "Demgegenueber = kontrastiv.", "Argumentation and Counter", lid(21), ["Demgegenueber ist festzustellen", "Zunaechst ist festzustellen", "Ferner ist festzustellen", "Auch ist festzustellen"])

# Topic 25: Error Correction (9 sentence-correction)
add("sentence-correction", "Korrigieren Sie: 'Wegen der Patient krank war, blieb er zu Hause.'", "Weil der Patient krank war, blieb er zu Hause.", "Wegen + Genitiv, nicht Nebensatz.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Trotz er hat kein Geld, kauft er das Auto.'", "Obwohl er kein Geld hat, kauft er das Auto.", "Trotz + Nomen, nicht Nebensatz.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Das ist das Haus wo er wohnt.'", "Das ist das Haus, in dem er wohnt.", "Wo = Fragewort, nicht Relativpronomen fuer Sachen.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Ich habe Angst vor den Hund.'", "Ich habe Angst vor dem Hund.", "Angst vor + Dativ.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Er hat den Brief geschrieben von seinem Vater.'", "Er hat den Brief von seinem Vater geschrieben.", "Praepositionalphrase vor Partizip.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Ich moechte, dass du kommst und bringst das Buch mit.'", "Ich moechte, dass du kommst und das Buch mitbringst.", "Verbklammer im Nebensatz.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Das Buch, welches ich gelesen habe, war interessant.'", "Das Buch, das ich gelesen habe, war interessant.", "Welches ist stilistisch schwach. Das ist richtig.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Er hat vorgeschlagen, dass wir gehen nach Hause.'", "Er hat vorgeschlagen, dass wir nach Hause gehen.", "Verb am Ende im Nebensatz.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Sie ist die Frau welcher ich geholfen habe.'", "Sie ist die Frau, der ich geholfen habe.", "Helfen + Dativ: der, nicht welcher.", "Error Correction", lid(25))

# Also add some to lesson 21-24 for better lesson distribution
# Lesson 21 (add more Argumentation & Counter)
add("fill-blank", "Dafuer spricht ..., dass die Kosten niedrig sind.", "zudem", "Zudem = ausserdem.", "Argumentation and Counter", lid(21), ["zudem", "dagegen", "nichts", "kaum"])
add("fill-blank", "... muss die rechtliche Lage geprueft werden.", "Abschliessend", "Abschliessend = Zusammenfassung.", "Argumentation and Counter", lid(21), ["Abschliessend", "Am Anfang", "Vorher", "Endlich"])

# Lesson 22 - add some Scientific Writing alternatives
add("fill-blank", "Die ... dieser Arbeit ergab keine signifikanten Unterschiede.", "Auswertung", "Auswertung = Analyse.", "Scientific Writing", lid(22), ["Auswertung", "Rechnung", "Antwort", "Look"])
add("fill-blank", "Im ... mit der Kontrollgruppe zeigte die Experimentalgruppe bessere Werte.", "Vergleich", "Im Vergleich mit.", "Scientific Writing", lid(22), ["Vergleich", "Gegenteil", "Kontrast", "Fall"])

# Lesson 23
add("fill-blank", "... ist die Studie als methodisch solide zu bewerten.", "Insgesamt", "Insgesamt = Fazit.", "Scientific Writing", lid(23), ["Insgesamt", "Endlich", "Schlussendlich", "Fazit"])
add("fill-blank", "Die Arbeit ... einen wichtigen Beitrag zur Forschung.", "leistet", "Einen Beitrag leisten = Kollokation.", "Scientific Writing", lid(23), ["leistet", "macht", "gibt", "hat"])

# Lesson 24
add("fill-blank", "Die ... der Studie limitiert die Aussagekraft der Ergebnisse.", "geringe Stichprobengroesse", "Typische Limitation.", "Scientific Writing", lid(24), ["geringe Stichprobengroesse", "schlechte Qualitaet", "wenige", "limitierte Groesse"])
add("fill-blank", "Weitere Forschung ist ... um die Ergebnisse zu untermauern.", "noetig", "Noetig = notwendig.", "Scientific Writing", lid(24), ["noetig", "schoen", "gut", "schnell"])

# A few more for lessons 22-25 mixing categories
add("fill-blank", "... duerfen wir die ethischen Aspekte nicht vernachlaessigen.", "Jedoch", "Jedoch = einschraenkend.", "Argumentation and Counter", lid(22), ["Jedoch", "Und", "Auch", "Zudem"])
add("sentence-correction", "Korrigieren Sie: 'Der Patient, welcher wir behandelt haben.'", "Der Patient, den wir behandelt haben.", "Akkusativ, nicht welcher.", "Error Correction", lid(24))
add("sentence-correction", "Korrigieren Sie: 'Ich interessiere mich dafuer.' -> richtige Wortstellung", "Dafuer interessiere ich mich.", "Verb an Position 2.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Er hat gesagt, dass er kommt morgen.'", "Er hat gesagt, dass er morgen kommt.", "Verb-Endstellung.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Das ist die Idee von was ich dir erzaehlt habe.'", "Das ist die Idee, von der ich dir erzaehlt habe.", "Von der nicht von was.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Wegen des Wetters, wir bleiben zu Hause.'", "Wegen des Wetters bleiben wir zu Hause.", "Verb an Position 2.", "Error Correction", lid(25))
add("sentence-correction", "Korrigieren Sie: 'Bevor er geht, er macht das Licht aus.'", "Bevor er geht, macht er das Licht aus.", "Verb nach Hauptsatzposition 2.", "Error Correction", lid(25))

print(f"Part B generated: {len(NEW)}")
with open(os.path.join(ROOT, "..", "..", "_c1_partB.json"), "w") as f:
    json.dump(NEW, f, indent=2, ensure_ascii=False)
print("Saved to _c1_partB.json")
