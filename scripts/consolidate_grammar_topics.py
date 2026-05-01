import json

g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']

# Consolidate old messy topic names from the original 40
rename_map = {
    'Verb: Sein': 'sein',
    'Verb: Haben': 'haben',
    'Present Tense Regular': 'Regular Present Tense',
    'Present Tense Irregular': 'Irregular Present Tense',
    'Accusative Basics': 'Accusative Case',
    'Negation': 'nicht vs kein',
    'Questions': 'W-Questions',
}

renames = 0
for v in a1:
    old_topic = v.get('topic', '')
    if old_topic in rename_map:
        v['topic'] = rename_map[old_topic]
        renames += 1
        print(f"  {v['id']}: {old_topic} -> {v['topic']}")

g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f"\nRenamed {renames} old topic entries to canonical names.")
print(f"Final A1 count: {len(a1)}")

# Final audit
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
print(f"Duplicate questions: {len(dup_prompts)}")
for d in dup_prompts: print(f"  {d}")

required = ['id', 'level', 'topic', 'prompt', 'answer', 'explanation']
missing = []
for v in a1:
    for f in required:
        if f not in v or v[f] is None or (isinstance(v[f], str) and not v[f].strip()):
            missing.append(f"{v['id']} missing {f}")
print(f"Missing fields: {len(missing)}")
for m in missing: print(f"  {m}")

topics = {}
for v in a1:
    t = v.get('topic','??')
    topics[t] = topics.get(t,0) + 1
print(f"\nClean topics ({len(topics)}):")
for t,c in sorted(topics.items(), key=lambda x:-x[1]):
    print(f"  {t}: {c}")
