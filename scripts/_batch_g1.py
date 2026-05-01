import json

with open('src/data/grammar.json', encoding='utf-8') as f:
    grammar = json.load(f)

a1 = grammar['A1']

# Count existing IDs to find the next available number
gr_ids = [int(v['id'].split('_gr_')[1]) for v in a1 if v['id'].startswith('A1_gr_')]
next_id = max(gr_ids) + 1 if gr_ids else 131

print(f"Next available A1_gr_ id: A1_gr_{next_id}")
print(f"Current A1 count: {len(a1)}")

# Batch 1: 40 exercises covering seine haben, regular present tense, irregular present tense, personal pronouns
batch = []

def make_mcq(id, topic, prompt, options, answer, explanation):
    return {"id": id, "topic": topic, "type": "mcq", "prompt": prompt, "options": options, "answer": answer, "explanation": explanation}

def make_fill(id, topic, prompt, answer, explanation):
    return {"id": id, "topic": topic, "type": "fill-blank", "prompt": prompt, "answer": answer, "explanation": explanation}

# ====== sein (8 exercises) ======
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Ich ___ aus Deutschland.", "bin", "Ich uses bin with sein.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Du ___ sehr freundlich.", "bist", "Du uses bist with sein.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Er ___ mein Bruder.", "ist", "Er/sie/es uses ist with sein.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Wir ___ im Kino.", "sind", "Wir uses sind with sein.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Ihr ___ sehr nett.", "seid", "Ihr uses seid with sein.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Sie ___ aus Spanien.", "sind", "Sie (plural/formal) uses sind with sein.")); next_id += 1
batch.append(make_mcq(f"A1_gr_{next_id}", "sein", "Was ist richtig? 'Das ___ ein Buch.'", ["ist", "bist", "bin", "sind"], "ist", "Das is singular, so it uses ist.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "sein", "Meine Eltern ___ zu Hause.", "sind", "Meine Eltern (they) uses sind.")); next_id += 1

# ====== haben (8 exercises) ======
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Ich ___ einen Hund.", "habe", "Ich uses habe with haben.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Du ___ eine Frage.", "hast", "Du uses hast with haben.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Er ___ einen Bruder.", "hat", "Er uses hat with haben.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Wir ___ ein Auto.", "haben", "Wir uses haben (infinitive stays).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Ihr ___ viele Bucher.", "habt", "Ihr uses habt with haben.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Sie ___ eine Katze.", "hat", "Sie (singular) uses hat.")); next_id += 1
batch.append(make_mcq(f"A1_gr_{next_id}", "haben", "Was ist richtig? 'Meine Schwester ___ ein Haus.'", ["habe", "hast", "hat", "haben"], "hat", "Meine Schwester = sie (she), so hat is correct.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "haben", "Die Kinder ___ einen Ball.", "haben", "Die Kinder (they) uses haben.")); next_id += 1

# ====== Regular present tense verbs (8 exercises) ======
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Ich ___ (spielen) FuBball.", "spiele", "Ich uses spiel + e for regular verbs.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Du ___ (lernen) Deutsch.", "lernst", "Du uses lern + st.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Er ___ (arbeiten) im Buro.", "arbeitet", "Er uses arbeit + et (t-stem verbs add e).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Wir ___ (wohnen) in Berlin.", "wohnen", "Wir uses the infinitive: wohnen.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Ihr ___ (tanzen) gern.", "tanzt", "Ihr uses tanz + t.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Sie ___ (kaufen) ein Geschenk.", "kauft", "Sie (singular) uses kauf + t.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Regular Present Tense", "Die Studenten ___ (lernen) viel.", "lernen", "Die Studenten (they) uses the infinitive.")); next_id += 1
batch.append(make_mcq(f"A1_gr_{next_id}", "Regular Present Tense", "Was ist richtig? 'Er ___ (machen) die Hausaufgaben.'", ["macht", "mache", "machst", "machen"], "macht", "Er uses mach + t.")); next_id += 1

# ====== Common irregular present tense verbs (8 exercises) ======
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Ich ___ (fahren) nach Berlin.", "fahre", "Irregular: fahren keeps a in Ich form.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Du ___ (fahren) nach Hause.", "fahrst", "Irregular: du fahrst (a stays in du form).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Er ___ (fahren) mit dem Bus.", "fahrt", "Irregular: a changes to a in er/sie/es.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Ich ___ (lesen) ein Buch.", "lese", "Irregular: lesen - Ich lese (e stays).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Du ___ (lesen) die Zeitung.", "liest", "Irregular: du liest (e changes to ie).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Er ___ (lesen) gern.", "liest", "Irregular: er liest (e changes to ie).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Irregular Present Tense", "Ich ___ (sehen) den Film.", "sehe", "Irregular: sehen - Ich sehe.")); next_id += 1
batch.append(make_mcq(f"A1_gr_{next_id}", "Irregular Present Tense", "Was ist richtig? 'Du ___ (sprechen) Englisch.'", ["sprichst", "sprecht", "sprechest", "sprechen"], "sprichst", "Irregular: du sprichst (e to i change).")); next_id += 1

# ====== Personal pronouns (8 exercises) ======
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ bin mude. (I)", "Ich", "Ich is the pronoun for I.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ bist mein Freund. (you - informal)", "Du", "Du is the informal singular you.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ ist Lehrerin. (she)", "Sie", "Sie is the pronoun for she.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ wohnen in Koln. (they)", "Sie", "Sie (capital S) is they in German.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ seid lustig. (you all)", "Ihr", "Ihr is the plural you (informal).")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ haben ein Problem. (we)", "Wir", "Wir means we.")); next_id += 1
batch.append(make_mcq(f"A1_gr_{next_id}", "Personal Pronouns", "Welches Pronomen? '___ kommt aus Berlin.' (er/sie)", ["Er", "Sie", "Es", "Alle sind richtig"], "Alle sind richtig", "Er (he), Sie (she), and Es (it) are all correct - context decides.")); next_id += 1
batch.append(make_fill(f"A1_gr_{next_id}", "Personal Pronouns", "___ trinkst Wasser. (you informal)", "Du", "Du is the second person singular pronoun.")); next_id += 1

# Append to A1 array
a1.extend(batch)
grammar['A1'] = a1

with open('src/data/grammar.json', 'w', encoding='utf-8') as f:
    json.dump(grammar, f, ensure_ascii=False, indent=2)

print(f"Added {len(batch)} exercises. New A1 count: {len(a1)}")
print(f"ID range: {batch[0]['id']} to {batch[-1]['id']}")
