import json

g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']

gr_ids = [int(v['id'].split('_gr_')[1]) for v in a1 if v['id'].startswith('A1_gr_')]
next_id = max(gr_ids) + 1
print(f"Next id: A1_gr_{next_id}")

def fill(id, topic, prompt, answer, explanation):
    return {"id": id, "topic": topic, "type": "fill-blank", "prompt": prompt, "answer": answer, "explanation": explanation}

def mcq(id, topic, prompt, options, answer, explanation):
    return {"id": id, "topic": topic, "type": "mcq", "prompt": prompt, "options": options, "answer": answer, "explanation": explanation}

batch = []

# ====== Accusative case basics (8) ======
batch.append(fill(f"A1_gr_{next_id}", "Accusative Case", "Ich sehe ___ (der) Mann.", "den", "Der Mann -> accusative: den Mann.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Accusative Case", "Er hat ___ (die) Blume.", "die", "Die Blume stays die in accusative.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Accusative Case", "Sie kauft ___ (das) Buch.", "das", "Das Buch stays das in accusative.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Accusative Case", "Ich habe ___ Hund.", ["der", "die", "das", "den"], "den", "Hund is masculine, accusative direct object: den Hund.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Accusative Case", "Wir besuchen ___ (der) Arzt.", "den", "Der Arzt -> accusative: den Arzt.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Accusative Case", "Richtig? 'Ich sehe das Mädchen.'", ["richtig", "falsch"], "richtig", "Das Mädchen is neuter, stays das in accusative. Correct.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Accusative Case", "Er trinkt ___ (die) Milch.", "die", "Die Milch stays die in accusative (feminine no change).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Accusative Case", "Was ist der Akkusativ von 'der Tisch'?", ["der Tisch", "den Tisch", "dem Tisch", "des Tisches"], "den Tisch", "Masculine der changes to den in accusative.")); next_id += 1

# ====== Modal verbs (8) ======
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Ich ___ (können) schwimmen.", "kann", "Modal: kann + infinitive at end.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Du ___ (müssen) lernen.", "musst", "Du musst + infinitive lernen at end.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Er ___ (wollen) nach Hause gehen.", "will", "Er will + infinitive gehen at end.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Ich ___ (möchten) einen Kaffee.", "möchte", "Ich möchte (I would like) behaves like a modal.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Wir ___ (dürfen) hier parken.", "dürfen", "Wir dürfen + infinitive parken.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "Ihr ___ (sollen) pünktlich sein.", "sollt", "Ihr sollt + infinitive sein at end.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Modal Verbs", "Richtig? 'Ich kann gut singen.'", ["richtig", "falsch"], "richtig", "Correct: Ich kann + infinitive singen at end.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Modal Verbs", "___ (können) du mir helfen?", "Kannst", "Du form: Kannst du mir helfen?")); next_id += 1

# ====== Possessive adjectives (8) ======
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (my) Buch.", "mein", "Mein for neuter nominative: mein Buch.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (my) Mutter.", "meine", "Meine for feminine: meine Mutter.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (your, informal) Hund.", "dein", "Dein for masculine: dein Hund.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (his) Schwester.", "seine", "Seine for feminine: seine Schwester.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (her) Auto.", "ihr", "Ihr for neuter: ihr Auto.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Possessive Adjectives", "___ (my) Eltern wohnen in Berlin.", ["Mein", "Meine", "Meinen", "Meines"], "Meine", "Eltern is plural, so meine.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Possessive Adjectives", "Das ist ___ (our) Haus.", "unser", "Unser for neuter: unser Haus.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Possessive Adjectives", "___ (her) Bruder heiBt Max.", ["Ihre", "Ihr", "Ihren", "Ihrer"], "Ihr", "Bruder is masculine, so ihr (her).")); next_id += 1

# ====== Plural forms (8) ======
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Der Tisch -> die ___ (tables)", "Tische", "Most masculine nouns add -e: der Tisch -> die Tische.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Die Blume -> die ___ (flowers)", "Blumen", "Feminine nouns often add -(e)n: die Blume -> die Blumen.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Das Kind -> die ___ (children)", "Kinder", "Neuter nouns often add -er: das Kind -> die Kinder.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Der Apfel -> die ___ (apples)", "Äpfel", "Many masculine nouns add Umlaut: der Apfel -> die Äpfel.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Plural Forms", "Plural of 'der Bus'?", ["Busse", "Buse", "Bussen", "Busser"], "Busse", "Der Bus -> die Busse (adds -e).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Bruder -> ___ (brothers, two or more)", "Brüder", "Umlaut + nothing: der Bruder -> die Brüder.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Plural Forms", "Das Auge -> die ___ (eyes)", "Augen", "Das Auge -> die Augen (adds -n).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Plural Forms", "Plural of 'die Mutter'?", ["Mutter", "Mütter", "Muttern", "Mutteren"], "Mütter", "Die Mutter -> die Mütter (Umlaut, no ending).")); next_id += 1

# ====== Numbers and time (8) ======
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "3 + 5 = ___", "acht", "Drei plus funf ist acht.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "Es ist ___ Uhr. (2:00)", "zwei", "Zwei Uhr = 2 o'clock.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "Es ist Viertel nach ___. (3:15)", "drei", "15 minutes past 3 = Viertel nach drei.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "Es ist halb ___. (5:30)", "sechs", "Halb sechs = 5:30 (half to six). Note: halb is half TO the hour.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Numbers and Time", "Wie viel Uhr ist es? 8:45", ["Viertel nach acht", "Viertel vor neun", "Halb acht", "Acht Uhr fünfundvierzig"], "Viertel vor neun", "15 minutes before 9 = Viertel vor neun.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "Schreibe: 22 (zweiund___)", "zwanzig", "Zweiundzwanzig = 22.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Numbers and Time", "Es ist zehn Minuten nach ___. (10:10)", "zehn", "10:10 = zehn Minuten nach zehn.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Numbers and Time", "Was ist richtig? 'Es ist ___.' (12:00)", ["zwolf Uhr", "null Uhr", "Mittag", "Alle sind richtig"], "Alle sind richtig", "12:00 can be zwolf Uhr, null Uhr, or Mittag.")); next_id += 1

# ====== Separable verbs (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Separable Verbs", "Ich ___ um 8 Uhr ___ (aufstehen).", "stehe ... auf", "Aufstehen: prefix auf goes to the end.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Separable Verbs", "Er ___ dich ___ (anrufen).", "ruft ... an", "Anrufen: Er ruft dich an.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Separable Verbs", "Wir ___ morgen ___ (abfahren).", "fahren ... ab", "Abfahren: Wir fahren morgen ab.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Separable Verbs", "Richtig? 'Ich mache das Licht an.' (anschalten)", ["richtig", "falsch"], "falsch", "Anschalten: prefix an goes to end. 'Ich schalte das Licht an.'")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Separable Verbs", "Du ___ das Fenster ___ (aufmachen).", "machst ... auf", "Aufmachen: Du machst das Fenster auf.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Separable Verbs", "Wo steht 'ein' bei 'einkaufen'? 'Ich ___ Brot ___'", ["kaufe ... ein", "ein ... kaufe", "kauf ... eine", "einkaufe ..."], "kaufe ... ein", "Einkaufen: prefix ein goes to the end of the sentence.")); next_id += 1

# ====== Prepositions of place (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Prepositions of Place", "Das Buch liegt ___ dem Tisch. (on)", "auf", "Auf dem Tisch = on the table.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Prepositions of Place", "Die Katze sitzt ___ dem Stuhl. (on)", "auf", "Auf dem Stuhl = on the chair.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Prepositions of Place", "Der Stuhl steht ___ dem Tisch. (next to)", "neben", "Neben dem Tisch = next to the table.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Prepositions of Place", "Das Bild hangt ___ der Wand. (on, vertical)", ["auf", "an", "in", "neben"], "an", "An der Wand = on the wall (vertical surface). Auf = horizontal (table).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Prepositions of Place", "Wir wohnen ___ Berlin. (in)", "in", "In Berlin = in Berlin (city/town).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Prepositions of Place", "Das Auto steht ___ dem Haus. (in front of)", ["hinter", "vor", "neben", "auf"], "vor", "Vor dem Haus = in front of the house.")); next_id += 1

# ====== Simple imperatives (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Imperatives", "___ (sein) leise! (to one friend)", "Sei", "Sei leise! (du imperative: verb stem + no ending)")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Imperatives", "___ (kommen) her! (to one friend)", "Komm", "Komm her! (du imperative: verb stem)")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Imperatives", "___ (spielen) mit mir! (to one friend)", "Spiel", "Spiel mit mir! (du imperative)")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Imperatives", "___ (gehen) Sie nach links! (formal)", "Gehen", "Formal imperative uses Sie + infinitive: Gehen Sie.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Imperatives", "Richtig? 'Seid leise!' (to a group of friends)", ["richtig", "falsch"], "richtig", "Seid leise! is correct for ihr (group informal).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Imperatives", "___ (nehmen) Sie bitte Platz! (formal)", "Nehmen", "Nehmen Sie Platz! (formal imperative).")); next_id += 1

# ====== Present progressive review - mix (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Ich ___ (heiBen) Anna.", "heiBe", "Ich heiBe Anna.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Er ___ (trinken) Wasser.", "trinkt", "Er trinkt Wasser (regular verb).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Mixed Review", "Was ist richtig? 'Ihr ___ (gehen) nach Hause.'", ["geht", "gehen", "gehst", "gehe"], "geht", "Ihr geht = you all go.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Du ___ (tanzen) sehr gut.", "tanzt", "Du tanzt (regular, t-stem).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Wir ___ (kochen) heute Abend.", "kochen", "Wir kochen (plural stays infinitive).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Mixed Review", "'Es regnet.' What is the subject?", ["Es", "Regnet", "Kein Subjekt", "-t ending"], "Es", "Es is the subject (it is raining).")); next_id += 1

# ====== Final mix - more practice (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "___ (haben) ihr Geschwister?", "Habt", "Habt ihr Geschwister?")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Mein Bruder ___ (sein) 15 Jahre alt.", "ist", "Mein Bruder ist 15 Jahre alt.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "Wir ___ (müssen) heute arbeiten.", "müssen", "Wir mussen heute arbeiten.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Mixed Review", "Was ist richtig? 'Das ist ___ interessantes Buch.'", ["ein", "eine", "einen", "kein"], "ein", "Buch is neuter: ein interessantes Buch.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Mixed Review", "___ (können) du mir sagen, wie spat es ist?", "Kannst", "Kannst du mir sagen...?")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Mixed Review", "Wo ist der Fehler? 'Ich habe ein Katze.'", ["Ich", "habe", "ein", "Katze"], "ein", "Katze is feminine: Ich habe eine Katze.")); next_id += 1

print(f"Built {len(batch)} exercises. Next id would be: A1_gr_{next_id}")
print(f"Last exercise: {batch[-1]['id']}")

a1.extend(batch)
g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print(f"Added {len(batch)}. Total A1: {len(a1)}. Range: {batch[0]['id']} to {batch[-1]['id']}")
