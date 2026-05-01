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

# ====== Definite articles der/die/das (6) ======
batch.append(mcq(f"A1_gr_{next_id}", "Definite Articles", "___ Tisch (table) ist neu.", ["Der", "Die", "Das", "Den"], "Der", "Tisch is masculine, so der is correct.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Definite Articles", "___ Blume ist schon.", ["Der", "Die", "Das", "Den"], "Die", "Blume is feminine, so die is correct.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Definite Articles", "___ Kind spielt drauBen.", ["Der", "Die", "Das", "Den"], "Das", "Kind is neuter, so das is correct.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Definite Articles", "___ Hund (the dog) ist braun.", "Der", "Hund is masculine, so der is correct.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Definite Articles", "___ Sonne (the sun) scheint.", "Die", "Sonne is feminine, so die is correct.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Definite Articles", "___ Wasser ist kalt.", "Das", "Wasser is neuter, so das is correct.")); next_id += 1

# ====== Indefinite articles ein/eine (5) ======
batch.append(fill(f"A1_gr_{next_id}", "Indefinite Articles", "Das ist ___ Hund. (a)", "ein", "Hund is masculine, so ein (not eine).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Indefinite Articles", "Das ist ___ Katze. (a)", "eine", "Katze is feminine, so eine.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Indefinite Articles", "Das ist ___ Auto. (a)", "ein", "Auto is neuter, so ein.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Indefinite Articles", "Er hat ___ Bruder.", ["ein", "eine", "einen", "einer"], "einen", "Bruder is masculine, and it is accusative (direct object), so einen.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Indefinite Articles", "Sie kauft ___ Tasche.", ["ein", "eine", "einen", "einer"], "eine", "Tasche is feminine, accusative: eine Tasche.")); next_id += 1

# ====== Negative articles kein/keine (5) ======
batch.append(fill(f"A1_gr_{next_id}", "Negative Articles", "Ich habe ___ Hund. (no)", "keinen", "Hund is masculine accusative: keinen.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Negative Articles", "Das ist ___ Blume. (not a)", "keine", "Blume is feminine: keine.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Negative Articles", "Er hat ___ Buch. (no)", "kein", "Buch is neuter: kein.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Negative Articles", "Wir haben ___ Zeit. (no)", "keine", "Zeit is feminine: keine.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Negative Articles", "Was ist richtig? 'Das ist ___ Tisch.' (not a)", ["kein", "keine", "keinen", "keiner"], "kein", "Tisch is masculine nominative: kein.")); next_id += 1

# ====== nicht vs kein (6) ======
batch.append(fill(f"A1_gr_{next_id}", "nicht vs kein", "Er arbeitet ___ sonntags. (not on Sundays)", "nicht", "nicht negates verbs/adverbs/adjectives, kein negates nouns.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "nicht vs kein", "Das ist ___ Apfel. (not an apple)", "kein", "kein negates the noun Apfel.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "nicht vs kein", "Ich mag Kaffee ___. (not)", "nicht", "nicht comes after the verb when negating the action/object.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "nicht vs kein", "Sie hat ___ Schwester. (no sister)", "keine", "keine negates the feminine noun Schwester.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "nicht vs kein", "Was ist richtig? 'Er ist ___ Arzt.' (not a doctor)", ["nicht", "kein", "keine", "keinen"], "kein", "kein negates the profession noun Arzt.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "nicht vs kein", "Was ist richtig? 'Ich bin ___ mude.' (not tired)", ["kein", "nicht", "keine", "keinen"], "nicht", "nicht negates the adjective mude.")); next_id += 1

# ====== Word order in statements (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Word Order", "Ich ___ heute ___ (gehen / ins Kino).", "gehe ... ins Kino", "Verb is 2nd position: Ich gehe heute ins Kino.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Word Order", "Richtig oder falsch? 'Heute gehe ich ins Kino.'", ["richtig", "falsch"], "richtig", "When a time phrase starts the sentence, the verb stays 2nd. Heute (1st) gehe (2nd) ich (3rd).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Word Order", "Richtig oder falsch? 'Ich ins Kino gehe heute.'", ["richtig", "falsch"], "falsch", "The verb gehe must be in 2nd position: Ich gehe heute ins Kino.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Word Order", "Morgen ___ (fahren) wir nach Berlin.", "fahren", "Verb 2nd position after time expression. Morgen (1st) fahren (2nd).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Word Order", "___ du gern im Park? (spielen)", "Spielst", "Questions start with verb. Verb is 1st position.")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Word Order", "Richtig? 'Ich habe heute keine Zeit.'", ["richtig", "falsch"], "richtig", "Correct: Ich (1st) habe (2nd) heute (3rd) keine Zeit.")); next_id += 1

# ====== Yes/no questions (6) ======
batch.append(fill(f"A1_gr_{next_id}", "Yes/No Questions", "___ du aus Deutschland? (come)", "Kommst", "Yes/no questions start with the verb: Kommst du aus Deutschland?")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Yes/No Questions", "___ ihr Hunger? (have)", "Habt", "Ihr form: Habt ihr Hunger?")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Yes/No Questions", "Bilde die Frage: '___ Sie Frau Muller?'", ["Sind", "Ist", "Haben", "Seid"], "Sind", "Sind Sie Frau Muller? (formal Sie uses sind).")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "Yes/No Questions", "Was ist die richtige Frage? 'Er heiBt Max.'", ["HeiBt er Max?", "Er heiBt Max?", "Max er heiBt?", "HeiBt Max er?"], "HeiBt er Max?", "Verb first, then subject: HeiBt er Max?")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Yes/No Questions", "___ das dein Buch? (is)", "Ist", "Ist das dein Buch? Verb first in yes/no questions.")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "Yes/No Questions", "___ du morgen Zeit? (have)", "Hast", "Hast du morgen Zeit?")); next_id += 1

# ====== W-questions (6) ======
batch.append(fill(f"A1_gr_{next_id}", "W-Questions", "___ heiBen Sie? (what)", "Wie", "Wie heiBen Sie? (What is your name?)")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "W-Questions", "___ wohnst du? (where)", "Wo", "Wo wohnst du? (Where do you live?)")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "W-Questions", "___ kommt er? (from where)", ["Wo", "Wohin", "Woher", "Wann"], "Woher", "Woher asks about origin (from where).")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "W-Questions", "___ alt bist du? (how)", "Wie", "Wie alt bist du? (How old are you?)")); next_id += 1
batch.append(mcq(f"A1_gr_{next_id}", "W-Questions", "___ Uhr ist es? (what time)", ["Was", "Wie viel", "Wann", "Welche"], "Wie viel", "Wie viel Uhr ist es? (What time is it?)")); next_id += 1
batch.append(fill(f"A1_gr_{next_id}", "W-Questions", "___ machst du? (what)", "Was", "Was machst du? (What are you doing?)")); next_id += 1

a1.extend(batch)
g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print(f"Added {len(batch)}. Total A1: {len(a1)}. Range: {batch[0]['id']} to {batch[-1]['id']}")
