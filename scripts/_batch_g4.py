import json

g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']

gr_ids = [int(v['id'].split('_gr_')[1]) for v in a1 if v['id'].startswith('A1_gr_')]
nid = max(gr_ids) + 1

def fill(topic, prompt, answer, explanation):
    global nid
    r = {"id": f"A1_gr_{nid}", "topic": topic, "type": "fill-blank", "prompt": prompt, "answer": answer, "explanation": explanation}
    nid += 1
    return r

def mcq(topic, prompt, options, answer, explanation):
    global nid
    r = {"id": f"A1_gr_{nid}", "topic": topic, "type": "mcq", "prompt": prompt, "options": options, "answer": answer, "explanation": explanation}
    nid += 1
    return r

batch = []
batch.append(fill("Mixed Review", "Ich ___ (heiBen) Max und komme aus Berlin.", "heiBe", "Ich heiBe Max - heiBen conjugated for ich."))
batch.append(mcq("Mixed Review", 'Richtig? "Er hat kein Zeit."', ["richtig", "falsch"], "falsch", "Zeit is feminine, so it should be keine Zeit."))
batch.append(fill("Mixed Review", "___ du morgen frueh ___ (aufstehen)?", "Stehst ... auf", "Du form of aufstehen: prefix auf goes to the end."))
batch.append(fill("Mixed Review", "Der Arzt ___ den Patienten. (untersuchen)", "untersucht", "Er untersucht den Patienten (regular verb)."))
batch.append(mcq("Mixed Review", 'Plural von "das Haus"?', ["Hause", "Haeuser", "Hausen", "Haus"], "Haeuser", "Das Haus -> die Haeuser (Umlaut + -er)."))
batch.append(fill("Mixed Review", "___ (fahren) du mit dem Zug?", "Faehrst", "Du faehrst (irregular: a -> ae in du/er forms)."))
batch.append(mcq("Mixed Review", '"Wohin gehst du?" What does Wohin ask?', ["where to", "where from", "when", "why"], "where to", "Wohin = where to. Woher = where from."))
batch.append(fill("Mixed Review", "Meine Mutter ___ (arbeiten) in einer Klinik.", "arbeitet", "Sie arbeitet (t-stem verb: arbeit + et)."))
batch.append(fill("Mixed Review", "___ (sein) ihr schon fertig?", "Seid", "Ihr seid -> Seid ihr schon fertig?"))
batch.append(mcq("Mixed Review", "Richtig oder falsch? 'Ich moechte einen Kaffee.'", ["richtig", "falsch"], "richtig", "Correct: Ich moechte einen Kaffee."))

a1.extend(batch)
g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f"Added {len(batch)}. Total A1: {len(a1)}. Range: {batch[0]['id']} to {batch[-1]['id']}")
