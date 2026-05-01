import json, copy

g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']

# Track what we fix
fixed_18 = None
replaced_ids = []
new_exercises = []

# Fix A1_gr_18: missing level, topic, explanation
for v in a1:
    if v['id'] == 'A1_gr_18':
        v['level'] = 'A1'
        v['topic'] = v.pop('unit', 'Modal Verbs')
        v['explanation'] = 'Modalverb: du form of koennen is kannst. Kannst du morgen kommen?'
        fixed_18 = v
        break

# Replace A1_gr_121-130 (weaker duplicates) with new unique questions
# Keep the better A1_ex_1-10 versions
replacements = {
    'A1_gr_121': {  # was "Ich ___ Student." (same as A1_ex_1)
        'id': 'A1_gr_121', 'level': 'A1', 'topic': 'sein', 'type': 'fill-blank',
        'prompt': 'Das Wetter ___ heute nicht gut.',
        'options': None, 'answer': 'ist', 'explanation': 'Das Wetter ist singular, so ist is correct with sein.'
    },
    'A1_gr_122': {  # was "Translate: How are you? (formal)" (same as A1_ex_2)
        'id': 'A1_gr_122', 'level': 'A1', 'topic': 'W-Questions', 'type': 'fill-blank',
        'prompt': '___ heiBt deine Schwester? (what)',
        'options': None, 'answer': 'Wie', 'explanation': 'Wie heiBt... asks for a name. Wie heiBt deine Schwester?'
    },
    'A1_gr_123': {  # was "What is die Milch in English?" (same as A1_ex_3)
        'id': 'A1_gr_123', 'level': 'A1', 'topic': 'Word Order', 'type': 'fill-blank',
        'prompt': 'Richtig stellen: (gehen / heute / wir / ins Kino)',
        'options': None, 'answer': 'Wir gehen heute ins Kino.',
        'explanation': 'Verb is 2nd position: Wir (1st) gehen (2nd) heute (3rd) ins Kino.'
    },
    'A1_gr_124': {  # was "What is child in German?" (same as A1_ex_4)
        'id': 'A1_gr_124', 'level': 'A1', 'topic': 'Accusative Case', 'type': 'fill-blank',
        'prompt': 'Ich sehe ___ (der) Lehrer.',
        'options': None, 'answer': 'den', 'explanation': 'Der Lehrer -> accusative: den Lehrer. Ich sehe den Lehrer.'
    },
    'A1_gr_125': {  # was "Correct article for Frau" (same as A1_ex_5)
        'id': 'A1_gr_125', 'level': 'A1', 'topic': 'Definite Articles', 'type': 'mcq',
        'prompt': 'Was ist der richtige Artikel fur "Mann"?',
        'options': ['der', 'die', 'das', 'den'], 'answer': 'der',
        'explanation': 'Mann is masculine, so the correct article is der.'
    },
    'A1_gr_126': {  # was "Translate I have a book" (same as A1_ex_6)
        'id': 'A1_gr_126', 'level': 'A1', 'topic': 'Modal Verbs', 'type': 'fill-blank',
        'prompt': 'Er ___ (wollen) Arzt werden.',
        'options': None, 'answer': 'will', 'explanation': 'Er will Arzt werden. (wollen - er form: will + infinitive at end)'
    },
    'A1_gr_127': {  # was "Translate to go to German" (same as A1_ex_7)
        'id': 'A1_gr_127', 'level': 'A1', 'topic': 'Separable Verbs', 'type': 'fill-blank',
        'prompt': 'Ich ___ um 6 Uhr ___ (aufwachen).',
        'options': None, 'answer': 'wache ... auf', 'explanation': 'Aufwachen: prefix auf goes to end. Ich wache um 6 Uhr auf.'
    },
    'A1_gr_128': {  # was "Correct article for Kind" (same as A1_ex_8)
        'id': 'A1_gr_128', 'level': 'A1', 'topic': 'Negative Articles', 'type': 'fill-blank',
        'prompt': 'Sie hat ___ Geld. (no money)',
        'options': None, 'answer': 'kein', 'explanation': 'Geld is neuter, so kein. Sie hat kein Geld.'
    },
    'A1_gr_129': {  # was "Er ___ einen Hund." (same as A1_ex_9)
        'id': 'A1_gr_129', 'level': 'A1', 'topic': 'Imperatives', 'type': 'fill-blank',
        'prompt': '___ (gehen) Sie geradeaus! (formal)',
        'options': None, 'answer': 'Gehen', 'explanation': 'Formal imperative: Gehen Sie geradeaus! (verb + Sie + rest)'
    },
    'A1_gr_130': {  # was "What is der Bleistift?" (same as A1_ex_10)
        'id': 'A1_gr_130', 'level': 'A1', 'topic': 'Personal Pronouns', 'type': 'fill-blank',
        'prompt': '___ spielen FuBball. (we)',
        'options': None, 'answer': 'Wir', 'explanation': 'Wir is the pronoun for we. Wir spielen FuBball.'
    }
}

# Apply replacements
for v in a1:
    if v['id'] in replacements:
        new_data = replacements[v['id']]
        v.clear()
        v.update(new_data)
        replaced_ids.append(v['id'])

# Write back
g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# Print report
print(f"Fixed A1_gr_18: added level, topic, explanation")
print(f"  level: {fixed_18.get('level')}")
print(f"  topic: {fixed_18.get('topic')}")
print(f"  explanation: {fixed_18.get('explanation')[:50]}...")

print(f"\nReplaced {len(replaced_ids)} duplicate A1_gr entries:")
for rid in replaced_ids:
    r = replacements[rid]
    print(f"  {rid} -> new topic: {r['topic']}, prompt: {r['prompt'][:40]}...")

# Verify
print(f"\nFinal A1 count: {len(a1)}")

# Check dupes
ids = set(); dupes = []
for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
print(f"Duplicate IDs: {len(dupes)}")

prompts = set(); dup_prompts = []
for v in a1:
    p = v['prompt'].strip().lower()
    if p in prompts: dup_prompts.append(f"{v['id']}: {p}")
    prompts.add(p)
print(f"Duplicate/similar questions: {len(dup_prompts)}")
for d in dup_prompts:
    print(f"  {d}")

# Check missing fields
required = ['id', 'level', 'topic', 'prompt', 'answer', 'explanation']
missing = []
for v in a1:
    for f in required:
        if f not in v or v[f] is None or (isinstance(v[f], str) and not v[f]):
            missing.append(f"{v['id']} missing/empty {f}")
    if v.get('type') in ('mcq', 'article-select', 'multiple-choice'):
        if 'options' not in v or not v.get('options'):
            missing.append(f"{v['id']} missing options for type={v.get('type')}")
print(f"Missing fields: {len(missing)}")
for m in missing:
    print(f"  {m}")
