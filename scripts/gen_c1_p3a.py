"""Generate remaining C1 exercises (180 more) for Deutsch Klinik."""
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

# Topic 6: Gerundive Constructions
add("fill-blank", "Die ... (bestaetigen) Diagnose wurde ueberprueft.", "zu bestaetigende", "Zu bestaetigende Diagnose = Diagnose, die bestaetigt werden muss.", "Gerundive Constructions", lid(11), ["bestaetigte", "zu bestaetigende", "bestaetigende", "bestaetigter"])
add("fill-blank", "Der ... (dokumentieren) Befund lag noch nicht vor.", "zu dokumentierende", "Zu dokumentierender Befund = Befund, der dokumentiert werden muss.", "Gerundive Constructions", lid(11), ["dokumentierte", "zu dokumentierende", "dokumentierender", "Dokument"])
add("mcq", "Welche Form ist gerundivisch?", "Die noch zu klaerende Frage", "Zu + Partizip = gerundivisch (Notwendigkeit).", "Gerundive Constructions", lid(11), ["Die geklaerte Frage", "Die noch zu klaerende Frage", "Die klaerende Frage", "Die klaren Fragen"])
add("fill-blank", "Die ... (behandeln) Erkrankung erforderte einen Spezialisten.", "zu behandelnde", "Zu behandelnde Erkrankung = Erkrankung, die behandelt werden muss.", "Gerundive Constructions", lid(11), ["behandelte", "zu behandelnde", "behandelnde", "behandelnder"])
add("fill-blank", "Ein ... (beruecksichtigen) Aspekt wurde uebersehen.", "zu beruecksichtigender", "Zu beruecksichtigender Aspekt = Aspekt, der beruecksichtigt werden muss.", "Gerundive Constructions", lid(11), ["beruecksichtigter", "zu beruecksichtigender", "beruecksichtigende", "beruecksichtigen"])

# Topic 7: Extended Adjective Phrases
add("fill-blank", "Der ... (vom Arzt dringend empfehlen) Therapieplan wurde umgesetzt.", "vom Arzt dringend empfohlene", "Erweitertes Attribut: Praepositionalphrase + Adverb + Partizip.", "Extended Adjective Phrases", lid(12), ["empfohlene", "vom Arzt dringend empfohlene", "dringend empfohlene", "empfehlende"])
add("mcq", "Welcher Satz hat die korrekte Erweiterung?", "Der seit Jahren bewaehrte Behandlungsansatz", "Erweitertes Attribut: seit Jahren + Partizip.", "Extended Adjective Phrases", lid(12), ["Der seit Jahren bewaerte Behandlungsansatz", "Der bewaerte seit Jahren Behandlungsansatz", "Der Behandlungsansatz seit Jahren bewaert", "Seit Jahren der bewaerte Behandlungsansatz"])
add("fill-blank", "Die ... (im Labor sorgfaeltig analysieren) Blutprobe ergab klare Werte.", "im Labor sorgfaeltig analysierte", "Erweitertes Attribut: Ort + Adverb + Partizip.", "Extended Adjective Phrases", lid(12), ["analysierte", "im Labor analysierte", "im Labor sorgfaeltig analysierte", "analysiert im Labor"])
add("fill-blank", "Ein ... (von der WHO offiziell anerkennen) Testverfahren wurde eingesetzt.", "von der WHO offiziell anerkanntes", "Erweitertes Partizipattribut mit Akteur und Adverb.", "Extended Adjective Phrases", lid(12), ["anerkanntes", "offiziell anerkanntes", "von der WHO anerkanntes", "von der WHO offiziell anerkanntes"])
add("mcq", "Welche Wortstellung ist korrekt?", "Die dem Patienten verschriebene Dosierung", "Praepositionalphrase (dem Patienten) + Partizip (verschriebene).", "Extended Adjective Phrases", lid(12), ["Dem Patienten die verschriebene Dosierung", "Die dem Patienten verschriebene Dosierung", "Die Dosierung dem Patienten verschrieben", "Die verschriebene dem Patienten Dosierung"])

# Topic 8: Advanced Relative Clauses (add 3-4)
add("fill-blank", "Die Kollegin, ... Hilfe ich mich bediente, war kompetent.", "deren", "Sich einer Sache bedienen + Genitiv. Deren = Genitiv feminin.", "Advanced Relative Clauses", lid(12), ["deren", "dessen", "der", "welcher"])
add("fill-blank", "Der Anwalt, ... Mandant freigesprochen wurde, feierte.", "dessen", "Dessen = Genitiv maskulin.", "Advanced Relative Clauses", lid(12), ["dessen", "deren", "dem", "der"])
add("mcq", "Welcher Relativsatz ist korrekt?", "Die Methode, derer wir uns bedienten, ist neu.", "Sich einer Sache bedienen + Genitiv Plural: derer.", "Advanced Relative Clauses", lid(12), ["Die Methode, welcher wir uns bedienten", "Die Methode, derer wir uns bedienten", "Die Methode, deren wir uns bedienten", "Die Methode, die wir uns bedienten"])

# Topic 9: Indirect Speech (add 4)
add("fill-blank", "Die Studie legt nahe, dass die Hypothese ... (zutreffen).", "zutreffe", "Konjunktiv I: zutreffe.", "Indirect Speech", lid(13), ["zutrifft", "zutreffe", "zutraefe", "wuerde zutreffen"])
add("fill-blank", "Der Minister erklaerte, er ... zu dem Vorfall keine Stellung.", "nehme", "Konjunktiv I: nehme.", "Indirect Speech", lid(13), ["nimmt", "nehme", "naehme", "wuerde nehmen"])
add("mcq", "Indirekte Rede: 'Sie sagte, sie ... morgen ab.'", "fliege", "Fliege = Konjunktiv I von fliegen.", "Indirect Speech", lid(13), ["fliegt", "fliege", "floege", "wuerde fliegen"])
add("fill-blank", "Die Zeugin gab an, sie ... den Angeklagten nie gesehen.", "habe", "Habe = Konjunktiv I.", "Indirect Speech", lid(13), ["hat", "habe", "haette", "wurde"])

# Topic 11: Complex Connectors (add 3)
add("fill-blank", "Die Methode erwies sich als effektiv, ... sie aufwaendig war.", "wenngleich", "Wenngleich = obwohl. Konzessiver Konnektor.", "Complex Connectors", lid(14), ["weil", "wenngleich", "denn", "da"])
add("mcq", "Welcher Konnektor drueckt eine Einschraenkung aus?", "Die Ergebnisse sind vielversprechend, allerdings fehlen Langzeitdaten.", "Allerdings = einschraenkend.", "Complex Connectors", lid(14), ["weil Daten fehlen", "allerdings fehlen Langzeitdaten", "und Daten fehlen", "denn Daten fehlen"])
add("fill-blank", "Die Therapie schlug an, ... der Patient jung war.", "zumal", "Zumal = besonders weil.", "Complex Connectors", lid(14), ["weil", "zumal", "denn", "obwohl"])

# Topic 12: Concessive Structures (add 4)
add("fill-blank", "..., dass niemand kam, feierten wir allein.", "Obgleich", "Obgleich = obwohl.", "Concessive Structures", lid(14), ["Obgleich", "Weil", "Waehrend", "Trotz"])
add("fill-blank", "Die Massnahme war richtig, ... sie unpopulaer war.", "auch wenn", "Auch wenn = konzessiv.", "Concessive Structures", lid(14), ["auch wenn", "weil", "denn", "sodass"])
add("mcq", "Welcher Satz ist konzessiv?", "Mag die Situation auch schwierig sein, wir geben nicht auf.", "Mag ... auch = konzessiv.", "Concessive Structures", lid(14), ["Mag die Situation auch schwierig sein", "Weil die Situation schwierig ist", "Wenn die Situation schwierig ist", "Die Situation ist schwierig, denn"])
add("fill-blank", "..., der Versuch wurde abgebrochen.", "Allen Einwaenden zum Trotz", "Allen Einwaenden zum Trotz = konzessive PP.", "Concessive Structures", lid(14), ["Allen Einwaenden zum Trotz", "Obwohl Einwaende", "Trotz Einwaende", "Zum Trotz"])

# Topic 13: Consecutive and Final (add 4)
add("fill-blank", "Die Dosis wurde reduziert, ... Nebenwirkungen zu vermeiden.", "um", "Um zu = final.", "Consecutive/Final", lid(15), ["damit", "um", "weil", "denn"])
add("fill-blank", "Der Patient fuehrte ein Tagebuch, ... die Symptome dokumentiert wurden.", "damit", "Damit = final. Subjektverschiedenheit.", "Consecutive/Final", lid(15), ["um", "damit", "sodass", "weil"])
add("mcq", "Welcher Satz ist konsekutiv?", "Das Fieber stieg so stark an, sodass der Patient eingeliefert wurde.", "Sodass = Folge.", "Consecutive/Final", lid(15), ["weil der Patient krank war", "sodass der Patient eingeliefert wurde", "damit der Patient behandelt wird", "obwohl der Patient Medikamente nahm"])
add("fill-blank", "Sie trainierte intensiv, ... den Wettkampf zu gewinnen.", "um", "Um zu = final. Subjektgleichheit.", "Consecutive/Final", lid(15), ["damit", "um", "sodass", "denn"])

# Topic 14: Causal and Conditional (add 5)
add("fill-blank", "..., erholte sich der Patient.", "Angenommen die Prognose war pessimistisch", "Angenommen = konditional.", "Causal/Conditional", lid(15), ["Angenommen die Prognose war pessimistisch", "Weil die Prognose pessimistisch war", "Obwohl die Prognose pessimistisch war", "Waehrend die Prognose pessimistisch war"])
add("fill-blank", "... die Mehrheit dafuer stimmt, wird der Antrag angenommen.", "Falls", "Falls = konditional.", "Causal/Conditional", lid(15), ["Weil", "Falls", "Obwohl", "Nachdem"])
add("mcq", "Welcher Satz ist kausal?", "Da die Werte auffaellig waren, wurden weitere Tests durchgefuehrt.", "Da = kausal.", "Causal/Conditional", lid(15), ["Da die Werte auffaellig waren", "Falls die Werte auffaellig waren", "Obwohl die Werte auffaellig waren", "Waehrend die Werte auffaellig waren"])
add("fill-blank", "... des positiven Befunds wurde die Therapie fortgesetzt.", "Wegen", "Wegen + Genitiv = kausal.", "Causal/Conditional", lid(15), ["Wegen", "Trotz", "Ob", "Falls"])
add("fill-blank", "... du die Pruefung nicht bestehst, kannst du sie wiederholen.", "Gesetzt den Fall", "Gesetzt den Fall = konditional.", "Causal/Conditional", lid(15), ["Gesetzt den Fall", "Weil", "Obwohl", "Nachdem"])

# Topic 15: Sentence Transformation (9)
add("sentence-correction", "Transformieren: 'Der Arzt untersucht den Patienten.' -> 'Der Patient ...'", "wird vom Arzt untersucht", "Aktiv -> Passiv.", "Sentence Transformation", lid(16))
add("sentence-correction", "Transformieren: 'Man sagt, dass die Methode wirksam ist.' -> Passiversatz", "Die Methode soll wirksam sein.", "Soll + Infinitiv = indirekte Rede.", "Sentence Transformation", lid(16))
add("sentence-correction", "Ersetzen Sie: 'Obwohl er krank war, arbeitete er.' -> 'Trotz ...'", "Trotz seiner Krankheit arbeitete er", "Obwohl -> Trotz + Genitiv.", "Sentence Transformation", lid(16))
add("sentence-correction", "Transformieren: 'Die Studien, die vor kurzem veroefentlicht wurden' -> Partizip", "die vor kurzem veroefentlichten Studien", "Relativsatz -> Partizipialattribut.", "Sentence Transformation", lid(16))
add("sentence-correction", "Transformieren Sie ins Nominalstil: 'Weil er sich verspaetet hat' -> 'Aufgrund ...'", "Aufgrund seiner Verspaetung", "Weil + Satz -> Aufgrund + Genitiv.", "Sentence Transformation", lid(16))
add("sentence-correction", "Ersetzen Sie: 'Sie rief an, um zu fragen.' -> 'Sie rief an, ...'", "mit der Frage", "Um zu -> Praeposition + Nomen.", "Sentence Transformation", lid(16))
add("sentence-correction", "Transformieren: 'Er verlies die Sitzung, waehrend er schimpfte.' -> Partizip", "schimpfend die Sitzung", "Waehrend + Satz -> Partizip Praesens.", "Sentence Transformation", lid(16))
add("sentence-correction", "Bilden Sie einen Satz mit 'lassen': 'Man kann das Problem loesen.'", "Das Problem laesst sich loesen.", "Passiv mit sich lassen.", "Sentence Transformation", lid(16))
add("sentence-correction", "Transformieren in indirekte Rede: 'Der Arzt: Der Patient hat sich erholt.'", "Der Arzt sagte, der Patient habe sich erholt.", "Konjunktiv I.", "Sentence Transformation", lid(16))

print(f"Part A generated: {len(NEW)}")
with open(os.path.join(ROOT, "..", "..", "_c1_partA.json"), "w") as f:
    json.dump(NEW, f, indent=2, ensure_ascii=False)
print("Saved to _c1_partA.json")
