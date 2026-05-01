import json

s = json.load(open('src/data/speaking.json', encoding='utf-8'))
a1 = s['A1']
ids = sorted([int(v['id'].split('_')[-1]) for v in a1])
nid = max(ids) + 1

print(f"Current: {len(a1)} prompts, next ID: {nid}")

def make_prompt(title, prompt, instructions, tips, phrases, prep=30, talk=45):
    global nid
    r = {
        "id": f"A1_speak_{nid}",
        "title": title,
        "prompt": prompt,
        "instructions": instructions,
        "tips": tips,
        "prepTime": prep,
        "talkTime": talk,
        "usefulPhrases": phrases
    }
    nid += 1
    return r

batch = []

# 1. Talk about family
batch.append(make_prompt(
    "Meine Familie",
    "Erzahlen Sie von Ihrer Familie. Wie viele Personen? Wer sind sie?",
    "Sprechen Sie 45-60 Sekunden. Nennen Sie Eltern, Geschwister.",
    "Sagen Sie: 'Ich habe ...' oder 'Meine Familie hat ... Personen.'",
    ["Ich habe einen Bruder.", "Ich habe eine Schwester.", "Meine Mutter heibt ...", "Mein Vater arbeitet als ...", "Wir wohnen zusammen."],
    30, 60
))

# 2. Talk about work/study
batch.append(make_prompt(
    "Mein Beruf / Mein Studium",
    "Was machen Sie beruflich? Oder: Was studieren Sie?",
    "Sprechen Sie 30-45 Sekunden. Nennen Sie Ihren Beruf oder Ihr Studienfach.",
    "Benutzen Sie: 'Ich bin ...' oder 'Ich arbeite als ...' oder 'Ich studiere ...'",
    ["Ich bin Arzt.", "Ich arbeite als Ingenieur.", "Ich studiere Medizin.", "Ich gehe zur Schule.", "Mein Beruf ist ..."],
    30, 45
))

# 3. Daily routine morning
batch.append(make_prompt(
    "Mein Morgen",
    "Was machen Sie am Morgen? Beschreiben Sie Ihren typischen Morgen.",
    "Sprechen Sie 45-60 Sekunden. Nennen Sie 3-4 Aktivitaten.",
    "Sagen Sie: 'Ich wache auf ... Ich putze meine Zähne ... Ich fruhstucke ...'",
    ["Ich wache um 7 Uhr auf.", "Ich putze meine Zahne.", "Ich dusche.", "Ich fruhstucke.", "Ich gehe zur Arbeit / zur Schule."],
    30, 60
))

# 4. Daily routine evening
batch.append(make_prompt(
    "Mein Abend",
    "Was machen Sie am Abend nach der Arbeit oder Schule?",
    "Sprechen Sie 30-45 Sekunden. Was essen Sie? Was machen Sie dann?",
    "Verwenden Sie: 'Ich komme nach Hause ... Ich esse ... Ich sehe fern ... Ich gehe ins Bett.'",
    ["Ich komme um 18 Uhr nach Hause.", "Ich koche das Abendessen.", "Ich esse mit meiner Familie.", "Ich lese ein Buch.", "Ich gehe um 22 Uhr ins Bett."],
    30, 45
))

# 5. Drinks
batch.append(make_prompt(
    "Was mochten Sie trinken?",
    "Was trinken Sie gern? Tee, Kaffee, Saft, Wasser?",
    "Sprechen Sie 30 Sekunden. Was trinken Sie morgens, mittags, abends?",
    "Benutzen Sie: 'Ich trinke gern ...' oder 'Ich mag ...'",
    ["Ich trinke gern Kaffee.", "Ich mag Tee mit Zucker.", "Ich trinke Wasser.", "Ich trinke keinen Alkohol.", "Ein Glas Saft, bitte."],
    20, 30
))

# 6. Shopping food
batch.append(make_prompt(
    "Auf dem Markt / Im Supermarkt",
    "Was kaufen Sie ein? Nennen Sie 3-4 Lebensmittel.",
    "Sprechen Sie 30-45 Sekunden. Sagen Sie, was Sie kaufen und wie viel.",
    "Sagen Sie: 'Ich kaufe ...' Nennen Sie Obst, Gemuse oder Brot.",
    ["Ich kaufe Apfel.", "Ich mochte Brot.", "Wie viel kostet der Kase?", "Das ist zu teuer.", "Ich bezahle an der Kasse."],
    30, 45
))

# 7. Ask for prices
batch.append(make_prompt(
    "Nach Preisen fragen",
    "Fragen Sie nach Preisen: ein Brot, eine Milch, ein Kilo Apfel.",
    "Uben Sie: 'Was kostet ... Wie viel kostet ...'",
    "Fragen Sie hochlich: 'Entschuldigung, was kostet ...'",
    ["Was kostet das Brot?", "Wie viel kostet die Milch?", "Das kostet 2 Euro.", "Haben Sie etwas Gunstigeres?", "Das ist billig."],
    20, 30
))

# 8. Ask for directions
batch.append(make_prompt(
    "Nach dem Weg fragen",
    "Fragen Sie nach dem Weg zur nachsten Apotheke.",
    "Uben Sie: 'Entschuldigung, wo ist ...' oder 'Wie komme ich zu ...'",
    "Horen Sie genau zu. Die Antwort kann sein: 'Gehen Sie geradeaus ...'",
    ["Entschuldigung, wo ist die Apotheke?", "Wie komme ich zum Bahnhof?", "Gehen Sie geradeaus.", "Biegen Sie links ab.", "Es ist um die Ecke."],
    30, 45
))

# 9. Weather
batch.append(make_prompt(
    "Das Wetter heute",
    "Beschreiben Sie das Wetter. Ist es schon, kalt, regnerisch?",
    "Sprechen Sie 30 Sekunden. Sagen Sie die Temperatur: 'Es ist 25 Grad.'",
    "Sie konnen sagen: 'Es ist sonnig ... Es regnet ... Es ist kalt ...'",
    ["Die Sonne scheint.", "Es regnet.", "Es ist kalt heute.", "Die Temperatur ist 20 Grad.", "Es ist windig."],
    20, 30
))

# 10. Hobbies general
batch.append(make_prompt(
    "Meine Hobbys",
    "Was machen Sie in Ihrer Freizeit? Nennen Sie 2-3 Hobbys.",
    "Sprechen Sie 30-45 Sekunden. Wie oft machen Sie Ihre Hobbys?",
    "Benutzen Sie: 'Ich ... gern' oder 'In meiner Freizeit ...'",
    ["Ich lese gern Bucher.", "Ich spiele FuBball.", "Ich schwimme gern.", "Ich hore Musik.", "Am Wochenende gehe ich spazieren."],
    20, 45
))

# 11. Sport
batch.append(make_prompt(
    "Sport und Bewegung",
    "Machen Sie Sport? Welchen Sport mochten Sie?",
    "Sprechen Sie 30-45 Sekunden. Wie oft machen Sie Sport?",
    "Benutzen Sie: 'Ich mache ...' oder 'Ich spiele ...'",
    ["Ich mache Yoga.", "Ich gehe ins Fitnessstudio.", "Ich spiele Tennis.", "Ich jogge jeden Morgen.", "Sport macht Spa?."],
    20, 45
))

# 12. Book a doctor appointment
batch.append(make_prompt(
    "Termin beim Arzt",
    "Sie sind krank. Rufen Sie in der Praxis an und machen Sie einen Termin.",
    "Ein kurzes Telefonat: Nennen Sie Ihren Namen und Ihr Problem.",
    "Sagen Sie: 'Ich mochte einen Termin ...' oder 'Ich habe Schmerzen ...'",
    ["Guten Tag, ich mochte einen Termin.", "Ich habe Husten.", "Ich habe Fieber.", "Wann kann ich kommen?", "Vielen Dank."],
    30, 60
))

# 13. At hospital reception
batch.append(make_prompt(
    "An der Rezeption",
    "Sie sind im Krankenhaus. Was sagen Sie an der Rezeption?",
    "Sprechen Sie 30-45 Sekunden: Name, Versicherung, Grund.",
    "Sagen Sie Ihren Namen und warum Sie da sind.",
    ["Guten Tag, ich bin Patient.", "Mein Name ist ...", "Ich habe eine Uberweisung.", "Ich bin krankenversichert.", "Wo ist die Notaufnahme?"],
    20, 45
))

# 14. Describe simple symptoms
batch.append(make_prompt(
    "Meine Symptome",
    "Beschreiben Sie: Was tut weh? Seit wann haben Sie Schmerzen?",
    "Sprechen Sie 30-45 Sekunden. Nennen Sie 2-3 Symptome.",
    "Sagen Sie: 'Ich habe Kopfschmerzen ... Mein Rucken tut weh ...'",
    ["Ich habe Kopfschmerzen.", "Der Hals tut weh.", "Ich habe Husten.", "Ich habe Schnupfen.", "Seit drei Tagen."],
    30, 45
))

# 15. Ask for help at pharmacy
batch.append(make_prompt(
    "In der Apotheke",
    "Sie brauchen Medikamente. Fragen Sie in der Apotheke.",
    "Sprechen Sie 30-45 Sekunden. Was haben Sie? Was brauchen Sie?",
    "Fragen Sie: 'Haben Sie etwas gegen ...?' oder 'Ich brauche ...'",
    ["Haben Sie etwas gegen Husten?", "Ich brauche Schmerztabletten.", "Gibt es ein Rezeptfrei?", "Wie oft soll ich das nehmen?", "Danke fur Ihre Hilfe."],
    20, 45
))

# 16. Say what hurts
batch.append(make_prompt(
    "Was tut weh?",
    "Zeigen und sagen Sie: Welcher Korperteil tut weh?",
    "Sprechen Sie 30 Sekunden. Nennen Sie mindestens zwei Korperteile.",
    "Sagen Sie: 'Mein ... tut weh' oder 'Ich habe Schmerzen im ...'",
    ["Mein Kopf tut weh.", "Der Rucken tut weh.", "Mein Bauch tut weh.", "Ich habe Schmerzen im Bein.", "Die Hand tut weh."],
    15, 30
))

# 17. Talk about time
batch.append(make_prompt(
    "Uhrzeiten und Termine",
    "Sagen Sie: Wie spat ist es? Nennen Sie 3 verschiedene Uhrzeiten.",
    "Sagen Sie: 'Es ist 14 Uhr ... Es ist halb drei ...'",
    "Uben Sie ganze Stunden und halbe Stunden.",
    ["Es ist 9 Uhr.", "Es ist halb vier.", "Es ist Viertel nach sieben.", "Der Termin ist um 10 Uhr.", "Ich habe um 15 Uhr Zeit."],
    20, 30
))

# 18. Make/reschedule/cancel appointment
batch.append(make_prompt(
    "Termin verschieben",
    "Sie konnen nicht zum Termin kommen. Sagen Sie Bescheid.",
    "Sprechen Sie 30 Sekunden: Entschuldigen Sie sich und nennen Sie einen neuen Termin.",
    "Sagen Sie: 'Es tut mir leid ... Ich kann am ... nicht kommen. Geht es am ... ?'",
    ["Es tut mir leid.", "Ich kann morgen nicht kommen.", "Konnen wir den Termin verschieben?", "Geht es am Freitag?", "Um 14 Uhr passt es besser."],
    20, 30
))

# 19. Simple emergency phrases
batch.append(make_prompt(
    "Im Notfall",
    "Was sagen Sie im Notfall? Sie brauchen Hilfe.",
    "Sprechen Sie 20-30 Sekunden. Rufen Sie Hilfe. Sagen Sie, was passiert ist.",
    "Wichtige Worter: 'Hilfe! ... Notarzt ... Krankenwagen ... Unfall ...'",
    ["Hilfe!", "Rufen Sie den Notarzt!", "Es gibt einen Unfall.", "Ich brauche einen Krankenwagen.", "Hier ist die Adresse: ..."],
    15, 30
))

# 20. Introduce yourself (extended)
batch.append(make_prompt(
    "Sich vorstellen (ausfuhrlich)",
    "Stellen Sie sich ausfuhrlich vor: Name, Alter, Herkunft, Beruf, Familie, Wohnort, Hobbys.",
    "Sprechen Sie 60-90 Sekunden. Verbinden Sie alles zu einem kurzen Vortrag.",
    "Das ist eine typische A1 Prufungsaufgabe. Uben Sie flussig zu sprechen.",
    ["Ich heibe ... und bin ... Jahre alt.", "Ich komme aus ...", "Ich wohne in ...", "Von Beruf bin ich ...", "In meiner Freizeit ..."],
    60, 90
))

a1.extend(batch)
s['A1'] = a1
json.dump(s, open('src/data/speaking.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print(f"Added {len(batch)} prompts. Total A1: {len(a1)}")
print(f"Range: {batch[0]['id']} to {batch[-1]['id']}")

# Validate
ids = set(); dupes = []
prompts_set = set(); dup_prompts = []
missing = []
required = ['id', 'level', 'title', 'prompt', 'instructions', 'tips', 'prepTime', 'talkTime', 'usefulPhrases']
for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
    p = v.get('prompt', '').strip().lower()
    if p in prompts_set: dup_prompts.append(v['id'])
    prompts_set.add(p)
    for f in required:
        if f not in v or v[f] is None:
            missing.append(f"{v['id']} missing {f}")
        elif f in ('usefulPhrases',) and (not isinstance(v[f], list) or len(v[f]) == 0):
            missing.append(f"{v['id']} empty {f}")

print(f"\nValidation:")
print(f"  Duplicate IDs: {len(dupes)}")
print(f"  Duplicate prompts: {len(dup_prompts)}")
print(f"  Missing fields: {len(missing)}")
for m in missing: print(f"    {m}")
for v in a1:
    if 'level' not in v:
        # Add level if missing in old entries
        v['level'] = 'A1'

s['A1'] = a1
json.dump(s, open('src/data/speaking.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f"\n  All entries now have level field.")
