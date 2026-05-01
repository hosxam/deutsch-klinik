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
        "usefulPhrases": phrases,
        "level": "A1"
    }
    nid += 1
    return r

batch = []

# 21. Talk about home
batch.append(make_prompt(
    "Meine Wohnung / Mein Haus",
    "Beschreiben Sie Ihre Wohnung oder Ihr Haus. Wie viele Zimmer?",
    "Sprechen Sie 30-45 Sekunden. Nennen Sie die Raume.",
    "Sagen Sie: 'Ich wohne in einer Wohnung ... Es gibt ... Zimmer.'",
    ["Ich wohne in einer Wohnung.", "Es gibt drei Zimmer.", "Das Wohnzimmer ist grob.", "Die Kuche ist klein.", "Mein Schlafzimmer ist gemutlich."],
    30, 45
))

# 22. Furniture and rooms
batch.append(make_prompt(
    "Mobel in meinem Zimmer",
    "Welche Mobel haben Sie in Ihrem Zimmer?",
    "Sprechen Sie 30 Sekunden. Nennen Sie 3-4 Mobelstucke.",
    "Sagen Sie: 'In meinem Zimmer gibt es ...' oder 'Ich habe einen Tisch ...'",
    ["Ich habe einen Tisch.", "Es gibt einen Stuhl.", "Das Bett ist grob.", "Im Zimmer ist ein Schrank.", "Der Teppich ist blau."],
    20, 30
))

# 23. Colors
batch.append(make_prompt(
    "Farben",
    "Welche Farben mogen Sie? Beschreiben Sie 2-3 Gegenstande mit Farben.",
    "Sprechen Sie 30 Sekunden. Sagen Sie: 'Mein Auto ist blau ...'",
    "Farben auf Deutsch: rot, blau, grun, gelb, schwarz, weib, braun, grau.",
    ["Mein Auto ist rot.", "Ich mag die Farbe Blau.", "Die Wand ist weib.", "Meine Tasche ist schwarz.", "Das Gras ist grun."],
    15, 30
))

# 24. Food preferences
batch.append(make_prompt(
    "Essen und Kochen",
    "Was essen Sie gern? Was kochen Sie?",
    "Sprechen Sie 30-45 Sekunden. Nennen Sie 3-4 Lieblingsspeisen.",
    "Benutzen Sie: 'Ich esse gern ...' oder 'Ich mag ...' oder 'Ich koche ...'",
    ["Ich esse gern Pizza.", "Ich mag Spaghetti.", "Meine Mutter kocht gut.", "Ich esse viel Obst.", "Zum Fruhstuck esse ich Brot."],
    30, 45
))

# 25. Clothes and shopping
batch.append(make_prompt(
    "Kleidung kaufen",
    "Sie kaufen Kleidung. Welche Kleidung suchen Sie?",
    "Sprechen Sie 30-45 Sekunden. Fragen Sie nach Grobe und Farbe.",
    "Sagen Sie: 'Ich suche einen Pullover ... in Grobe M ... Haben Sie das in Blau?'",
    ["Ich suche ein Hemd.", "Haben Sie das in Grobe L?", "Die Hose gefallt mir.", "Darf ich es anprobieren?", "Ich mochte noch ein T-Shirt."],
    30, 45
))

# 26. Public transport
batch.append(make_prompt(
    "Mit dem Bus fahren",
    "Sie fahren mit dem Bus. Fragen Sie nach dem richtigen Bus.",
    "Sprechen Sie 30 Sekunden. Fragen Sie nach der Haltestelle.",
    "Sagen Sie: 'Welcher Bus fahrt zum Bahnhof? ... Wo ist die Bushaltestelle?'",
    ["Welcher Bus fahrt zum Bahnhof?", "Wo ist die Haltestelle?", "Fahrt dieser Bus zum Markt?", "Eine Fahrkarte, bitte.", "Ich muss am Marktplatz aussteigen."],
    20, 30
))

# 27. At a restaurant
batch.append(make_prompt(
    "Im Restaurant",
    "Sie sind im Restaurant. Bestellen Sie etwas zu essen.",
    "Sprechen Sie 30 Sekunden: BegruBung, Bestellung, Frage nach der Rechnung.",
    "Benutzen Sie: 'Ich mochte ...' oder 'Fur mich bitte ...'",
    ["Einen Tisch fur zwei Personen, bitte.", "Ich mochte eine Pizza.", "Fur mich bitte einen Salat.", "Die Speisekarte, bitte.", "Die Rechnung, bitte."],
    30, 45
))

# 28. Birthday party invite
batch.append(make_prompt(
    "Einladung zum Geburtstag",
    "Laden Sie einen Freund zu Ihrer Geburtstagsfeier ein.",
    "Sprechen Sie 30 Sekunden: Wann, wo, was gibt es?",
    "Sagen Sie: 'Ich habe am ... Geburtstag. Kommst du zu meiner Party?'",
    ["Ich habe am Samstag Geburtstag.", "Kommst du zu meiner Party?", "Die Party ist um 18 Uhr.", "Es gibt Kuchen und Getranke.", "Ich freue mich auf dich!"],
    20, 30
))

# 29. Daily routine - time expressions
batch.append(make_prompt(
    "Tagesablauf mit Uhrzeiten",
    "Beschreiben Sie Ihren Tagesablauf mit Uhrzeiten.",
    "Sprechen Sie 45-60 Sekunden: Von morgens bis abends mit Uhrzeit.",
    "Verbinden Sie: 'Um 7 Uhr wache ich auf. Um 8 Uhr fruhstucke ich. Um 9 Uhr ...'",
    ["Um 7 Uhr wache ich auf.", "Um 8 Uhr fruhstucke ich.", "Um 9 Uhr beginnt die Arbeit.", "Um 12 Uhr esse ich zu Mittag.", "Um 22 Uhr gehe ich ins Bett."],
    30, 60
))

# 30. Weekend activities
batch.append(make_prompt(
    "Am Wochenende",
    "Was machen Sie am Wochenende?",
    "Sprechen Sie 30-45 Sekunden. Nennen Sie 3 Aktivitaten am Wochenende.",
    "Benutzen Sie: 'Am Samstag ...' und 'Am Sonntag ...'",
    ["Am Samstag gehe ich einkaufen.", "Ich treffe Freunde.", "Am Sonntag schlafe ich lang.", "Wir gehen spazieren.", "Am Wochenende habe ich frei."],
    30, 45
))

# 31. Talk about pets
batch.append(make_prompt(
    "Haustiere",
    "Haben Sie ein Haustier? Beschreiben Sie es.",
    "Sprechen Sie 30 Sekunden. Grobe, Farbe, Name, was es mag.",
    "Sagen Sie: 'Ich habe einen Hund ... Er heibt ... Er mag ...'",
    ["Ich habe einen Hund.", "Meine Katze heibt Mietze.", "Der Hund ist braun und weib.", "Er mag spazieren gehen.", "Das Haustier ist klein und nett."],
    20, 30
))

# 32. Describe a person
batch.append(make_prompt(
    "Eine Person beschreiben",
    "Beschreiben Sie einen Freund oder ein Familienmitglied. Wie sieht er/sie aus?",
    "Sprechen Sie 30-45 Sekunden: Grobe, Haare, Augen, Charakter.",
    "Sagen Sie: 'Meine Freundin ist grob ... Sie hat blonde Haare ... Sie ist nett.'",
    ["Mein Bruder ist grob.", "Sie hat braune Augen.", "Er hat kurze Haare.", "Meine Mutter ist freundlich.", "Er ist lustig und klug."],
    30, 45
))

# 33. Apartment search
batch.append(make_prompt(
    "Eine Wohnung suchen",
    "Sie suchen eine Wohnung. Fragen Sie nach der Miete und den Zimmern.",
    "Sprechen Sie 30 Sekunden: Grobe, Zimmeranzahl, Miete.",
    "Fragen Sie: 'Wie viel kostet die Miete? ... Wie viele Zimmer?'",
    ["Ich suche eine Wohnung.", "Wie viele Zimmer hat die Wohnung?", "Was kostet die Miete?", "Gibt es einen Balkon?", "Ist die Wohnung mogbliert?"],
    20, 30
))

# 34. Compliments
batch.append(make_prompt(
    "Komplimente machen",
    "Machen Sie einem Freund oder einer Freundin ein Kompliment.",
    "Sprechen Sie 20 Sekunden. Sagen Sie etwas Nettes.",
    "Einfache Komplimente: 'Dein Kleid ist schon ... Das Essen schmeckt gut ...'",
    ["Dein Kleid ist schon.", "Das Essen schmeckt sehr gut.", "Du siehst gut aus.", "Tolle Arbeit!", "Du bist sehr freundlich."],
    10, 20
))

# 35. Phone call
batch.append(make_prompt(
    "Ein kurzes Telefongesprach",
    "Sie rufen einen Freund an. Was sagen Sie?",
    "Sprechen Sie 30 Sekunden: Begrubung, Frage, Verabschiedung.",
    "Am Telefon: 'Hallo ... Hier ist ... Kann ich bitte ... sprechen?'",
    ["Hallo, hier ist ...", "Kann ich bitte mit ... sprechen?", "Mochtest du ins Kino gehen?", "Ja, gerne.", "Tschuss, bis morgen!"],
    20, 30
))

# 36. Lost item
batch.append(make_prompt(
    "Einen Gegenstand verloren",
    "Sie haben etwas verloren. Fragen Sie an der Information.",
    "Sprechen Sie 30 Sekunden: Was haben Sie verloren? Wo?",
    "Sagen Sie: 'Ich habe meine Tasche verloren ... Haben Sie eine gefunden?'",
    ["Ich habe meine Tasche verloren.", "Haben Sie einen Schlussel gefunden?", "Wo ist das Fundburo?", "Mein Handy ist weg.", "Kann ich bitte suchen?"],
    20, 30
))

# 37. At the hotel
batch.append(make_prompt(
    "Im Hotel",
    "Sie kommen im Hotel an. Was sagen Sie an der Rezeption?",
    "Sprechen Sie 30 Sekunden: Reservierung, Zimmer, Schussel, Frubstuck.",
    "Sagen Sie: 'Ich habe ein Zimmer reserviert ... fur zwei Nachte ...'",
    ["Ich habe ein Zimmer reserviert.", "Mein Name ist ...", "Fur zwei Nachte, bitte.", "Gibt es Frubstuck?", "Wo ist mein Zimmer?"],
    20, 45
))

# 38. Post office
batch.append(make_prompt(
    "Auf der Post",
    "Sie sind auf der Post. Sie wollen ein Paket schicken.",
    "Sprechen Sie 30 Sekunden: Wohin? Was? Wie viel kostet es?",
    "Sagen Sie: 'Ich mochte ein Paket schicken ... nach Agypten ...'",
    ["Ich mochte ein Paket schicken.", "Das Paket geht nach ...", "Wie viel kostet das?", "Wie lange dauert es?", "Ich mochte bitte eine Briefmarke."],
    20, 30
))

# 39. Compliments on food
batch.append(make_prompt(
    "Beim Abendessen",
    "Sie sind zu Gast beim Abendessen. Sagen Sie, dass es schmeckt.",
    "Sprechen Sie 20-30 Sekunden: Danke sagen, das Essen loben.",
    "Hoflich sein: 'Das Essen schmeckt sehr gut ... Danke fur die Einladung.'",
    ["Das Essen schmeckt sehr gut.", "Danke fur die Einladung.", "Alles ist sehr lecker.", "Kann ich helfen?", "Ich bin satt. Danke."],
    10, 30
))

# 40. Making plans
batch.append(make_prompt(
    "Plane machen",
    "Machen Sie einen Plan mit einem Freund. Was machen Sie morgen?",
    "Sprechen Sie 30-45 Sekunden: Fragen, vorschlagen, zustimmen.",
    "Benutzen Sie: 'Wollen wir ... Gehen wir ... Mochtest du ...'",
    ["Wollen wir ins Kino gehen?", "Gehen wir morgen schwimmen?", "Das ist eine gute Idee.", "Um wie viel Uhr treffen wir uns?", "Bis morgen!"],
    30, 45
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
required = ['id', 'title', 'prompt', 'instructions', 'tips', 'prepTime', 'talkTime', 'usefulPhrases']
for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
    p = v.get('prompt', '').strip().lower()
    if p in prompts_set: dup_prompts.append(v['id'])
    prompts_set.add(p)
    for f in required:
        if f not in v or v[f] is None:
            missing.append(f"{v['id']} missing {f}")
        elif f == 'usefulPhrases' and (not isinstance(v[f], list) or len(v[f]) == 0):
            missing.append(f"{v['id']} empty usefulPhrases")

print(f"\nValidation:")
print(f"  Duplicate IDs: {len(dupes)}")
print(f"  Duplicate prompts: {len(dup_prompts)}")
print(f"  Missing fields: {len(missing)}")
for m in missing: print(f"    {m}")
