"""Part C: Additional exercises to reach ~250 total"""
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

# Fill in gaps for topics that need more coverage
# Topics needing expansion: Nominal Style, Verb-Noun Collocations, Passive Alternatives, Zustandspassiv, Participle

# Add to lesson 11+ for better distribution
add("fill-blank", "Nach ... der Blutwerte wurde die Diagnose gestellt.", "Auswertung", "Auswertung = evaluation. Nominalisierung von auswerten.", "Nominal Style", lid(11), ["Auswerten", "Auswertung", "Wertung", "Auswert"])
add("fill-blank", "Die ... (erklaeren) des Phaenomens gelang erst spaet.", "erklaeren", "Das Erklaeren = nominalisierter Infinitiv.", "Nominal Style", lid(12), ["Erklaerung", "erklaeren", "Erklaerens", "Erklaert"])
add("fill-blank", "Die ... (ueberweisen) des Patienten erfolgte umgehend.", "Ueberweisung", "Ueberweisen -> Ueberweisung.", "Nominal Style", lid(13), ["Ueberweisung", "Ueberweisen", "Weisung", "Ueberweis"])
add("fill-blank", "Eine ... (einschaetzen) des Risikos ist unerlaesslich.", "Einschaetzung", "Einschaetzen -> Einschaetzung.", "Nominal Style", lid(14), ["Einschaetzung", "Schatzung", "Einschaetzen", "Schatz"])
add("mcq", "Welche Nominalisierung ist korrekt? 'etwas in Betracht ziehen'", "Inbetrachtziehung", "In Betracht ziehen -> Inbetrachtziehung.", "Nominal Style", lid(15), ["Inbetrachtziehung", "Betrachtung", "Ziehung", "Betracht"])

add("fill-blank", "Der Arzt ... die Behandlung ein.", "leitete", "Eine Behandlung einleiten.", "Verb-Noun Collocations", lid(11), ["leitete", "machte", "gab", "stellte"])
add("fill-blank", "Die Forscher ... eine Hypothese auf.", "stellten", "Eine Hypothese aufstellen.", "Verb-Noun Collocations", lid(12), ["stellten", "machten", "gaben", "legten"])
add("mcq", "Welches Verb: Einen Beweis ...", "erbringen", "Einen Beweis erbringen.", "Verb-Noun Collocations", lid(13), ["erbringen", "zeigen", "machen", "geben"])
add("fill-blank", "Der Anwalt ... seinen Mandanten.", "vertrat", "Einen Mandanten vertreten.", "Verb-Noun Collocations", lid(14), ["vertrat", "half", "sah", "machte"])
add("fill-blank", "Die Firma ... ein neues Produkt.", "entwickelte", "Ein Produkt entwickeln.", "Verb-Noun Collocations", lid(15), ["entwickelte", "machte", "schuf", "gab"])

add("fill-blank", "Der Text ... sich leicht uebersetzen.", "laesst", "Sich lassen + Infinitiv.", "Adv Passive Alternatives", lid(11), ["kann", "laesst", "hat", "wird"])
add("mcq", "Welches ist ein Passiversatz?", "Das Problem ist nicht zu unterschaetzen.", "Sein + zu + Inf = Passiversatz.", "Adv Passive Alternatives", lid(12), ["Das Problem wird unterschaetzt", "Das Problem ist nicht zu unterschaetzen", "Das Problem unterschaetzt", "Das Problem hat unterschaetzt"])
add("fill-blank", "Diese Loesung ... sich sehen.", "kann", "Kann sich sehen lassen = feste Wendung.", "Adv Passive Alternatives", lid(13), ["kann", "laesst", "hat", "wird"])
add("fill-blank", "Die Maschine ... sich reparieren.", "laesst", "Sich lassen = Passiversatz.", "Adv Passive Alternatives", lid(14), ["wird", "laesst", "kann", "hat"])

add("fill-blank", "Die Wunde war ... worden.", "gereinigt", "Vorgangspassiv Vergangenheit: war gereinigt worden.", "Zustands-/Vorgangspassiv", lid(11), ["gereinigt", "gereinigt worden", "rein", "reinigen"])
add("fill-blank", "Die Tuer war ... .", "verschlossen", "Zustandspassiv Vergangenheit: war verschlossen.", "Zustands-/Vorgangspassiv", lid(12), ["verschlossen", "verschlossen worden", "schliessen", "zugemacht"])
add("mcq", "Zustands- oder Vorgangspassiv: 'Der Brief ist geschrieben worden.'", "Vorgangspassiv", "Ist geschrieben worden = Vorgang, Perfekt.", "Zustands-/Vorgangspassiv", lid(13), ["Vorgangspassiv", "Zustandspassiv", "Aktiv", "Futur"])
add("fill-blank", "Der Patient ... entlassen worden.", "war", "Vorgangspassiv Plusquamperfekt.", "Zustands-/Vorgangspassiv", lid(14), ["war", "ist", "wurde", "wird"])
add("fill-blank", "Die OP ... beendet.", "war", "Zustand: war beendet.", "Zustands-/Vorgangspassiv", lid(15), ["war", "wurde", "ist", "wird"])

add("fill-blank", "Die ... (sitzen) Patientin wartete auf den Arzt.", "sitzende", "Partizip Praesens: die sitzende Patientin.", "Participle Constructions", lid(11), ["sitzende", "gesessene", "sitzender", "Sitzung"])
add("fill-blank", "Ein ... (wachen) Blick genuegte.", "wachsender", "Wachsender Blick = Partizip Praesens.", "Participle Constructions", lid(12), ["wachsender", "gewachsener", "wachsen", "gewachsen"])
add("fill-blank", "Die ... (heilen) Wunde schmerzte noch.", "heilende", "Partizip Praesens: die heilende Wunde.", "Participle Constructions", lid(13), ["heilende", "geheilte", "heilen", "Heilung"])
add("fill-blank", "Der ... (behandeln) Arzt war erfahren.", "behandelnde", "Partizip Praesens: der behandelnde Arzt.", "Participle Constructions", lid(14), ["behandelnde", "behandelte", "Behandlung", "behandeln"])
add("fill-blank", "Ein ... (lesen) Mensch ist ein reicher Mensch.", "lesender", "Partizip Praesens: ein lesender Mensch.", "Participle Constructions", lid(15), ["lesender", "gelesener", "lesen", "Lesung"])

# More Concessive + Causal/Conditional
add("fill-blank", "... widriger Umstaende wurde das Projekt abgeschlossen.", "Allen", "Allen widrigen Umstaenden zum Trotz = konzessiv.", "Concessive Structures", lid(16), ["Allen", "Trotz", "Wegen", "Allen ... zum Trotz"])

# More for Scientific Writing lessons 22-24
add("fill-blank", "Im ... Kapitel werden die Ergebnisse diskutiert.", "fuenften", "Gliederungsangabe.", "Scientific Writing", lid(22), ["fuenften", "fuenfte", "fuenft", "5"])
add("fill-blank", "Die vorliegende Arbeit ... sich in fuenf Kapitel.", "gliedert", "Sich gliedern in = Standard.", "Scientific Writing", lid(22), ["gliedert", "teilt", "trennt", "unterteilt"])
add("mcq", "Welcher Satz ist in der Einleitung typisch?", "Der vorliegende Beitrag beschaftigt sich mit der Frage, ob...", "Typische Einleitung.", "Scientific Writing", lid(23), ["Der vorliegende Beitrag beschaftigt sich mit der Frage, ob...", "Ich schreibe ueber...", "In diesem Text geht es um...", "Hier steht etwas ueber..."])
add("fill-blank", "Die ... zeigte keine statistische Signifikanz.", "Korrelation", "Korrelation = Fachbegriff.", "Scientific Writing", lid(23), ["Korrelation", "Beziehung", "Verhaeltnis", "Zusammenhang"])

# Error Correction - more
add("sentence-correction", "Korrigieren: 'Mein Freund hat ein Auto, was sehr schnell ist.'", "Mein Freund hat ein Auto, das sehr schnell ist.", "Das, nicht was fuer Sachen.", "Error Correction", lid(21))
add("sentence-correction", "Korrigieren: 'Ich freue mich auf den Sommerferien.'", "Ich freue mich auf die Sommerferien.", "Sich freuen auf + Akkusativ (die).", "Error Correction", lid(22))
add("sentence-correction", "Korrigieren: 'Er ist groesser wie ich.'", "Er ist groesser als ich.", "Komparativ mit als, nicht wie.", "Error Correction", lid(23))
add("sentence-correction", "Korrigieren: 'Sie hat ihm den Brief nicht geschickt, denn sie hatte vergessen.'", "Sie hat ihm den Brief nicht geschickt, denn sie hatte es vergessen.", "Es als Objekt.", "Error Correction", lid(24))
add("sentence-correction", "Korrigieren: 'Wenn ich Zeit hatte, werde ich kommen.'", "Wenn ich Zeit habe, werde ich kommen.", "Tempuskongruenz.", "Error Correction", lid(21))
add("sentence-correction", "Korrigieren: 'Trotzdem es regnet, gehen wir spazieren.'", "Obwohl es regnet, gehen wir spazieren.", "Trotzdem ist Adverb, nicht Konjunktion.", "Error Correction", lid(22))
add("sentence-correction", "Korrigieren: 'Er hat die Absicht, dass er morgen abreist.'", "Er hat die Absicht, morgen abzureisen.", "Umformung: dass-Satz -> zu + Infinitiv.", "Error Correction", lid(23))
add("sentence-correction", "Korrigieren: 'Der Film, den ich gesehen habe, war langweilig.'", "Der Film, den ich gesehen habe, war langweilig.", "Ist bereits korrekt.", "Error Correction", lid(24))
add("sentence-correction", "Korrigieren: 'Sie fragte, ob ich kann morgen kommen.'", "Sie fragte, ob ich morgen kommen kann.", "Verb-Endstellung im Nebensatz.", "Error Correction", lid(25))

# More Argumentation
add("fill-blank", "... der Argumente ist die Studienlage eindeutig.", "Ungeachtet", "Ungeachtet + Genitiv = konzessiv.", "Argumentation and Counter", lid(22), ["Ungeachtet", "Trotz", "Wegen", "Dank"])
add("fill-blank", "... bleibt festzuhalten, dass die Nullhypothese verworfen wurde.", "Nichtsdestotrotz", "Trotzdem.", "Argumentation and Counter", lid(23), ["Nichtsdestotrotz", "Weil", "Weiter", "Und"])

# Text Cohesion more
add("fill-blank", "Die Theorie wurde mehrfach widerlegt. ... wird sie noch gelehrt.", "Dennoch", "Dennoch = adversativ.", "Text Cohesion and Reference", lid(21), ["Dennoch", "Weil", "Denn", "Und"])
add("fill-blank", "... bedeutet, dass die ursprüngliche Annahme falsch war.", "Dies", "Dies = Rueckverweis.", "Text Cohesion and Reference", lid(22), ["Dies", "Das", "Es", "Jenes"])

# Modal particles more
add("fill-blank", "Das ist ... eine interessante Fragestellung.", "durchaus", "Durchaus = betont.", "Modal Particles Formal", lid(23), ["durchaus", "auch", "nur", "eben"])
add("fill-blank", "Die Ergebnisse sind ... bemerkenswert.", "immerhin", "Immerhin = einschraenkend.", "Modal Particles Formal", lid(24), ["immerhin", "sehr", "total", "ganz"])

# Add for lesson balance
add("mcq", "Welche Form ist korrekt im Passiv? 'Das Haus ... (bauen) 1990.'", "wurde gebaut", "Vorgangspassiv Praeteritum.", "Zustands-/Vorgangspassiv", lid(16), ["wurde gebaut", "ist gebaut", "wird gebaut", "hat gebaut"])

# Medical more
add("sentence-correction", "Formulieren Sie im Arztstil: 'Der Patient hat Bluthochdruck'", "Bei dem Patienten besteht eine arterielle Hypertonie.", "Medizinisches Register.", "Med Documentation", lid(20))
add("sentence-correction", "Formulieren Sie medizinisch: 'Das Bein tut weh'", "Der Patient gibt Schmerzen im Bereich des rechten Beins an.", "Standard.", "Med Documentation", lid(20))

print(f"Part C generated: {len(NEW)}")
with open(os.path.join(ROOT, "..", "..", "_c1_partC.json"), "w") as f:
    json.dump(NEW, f, indent=2, ensure_ascii=False)
