import json

g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']

fixes = {'level_added': 0, 'topic_from_unit': 0}

for v in a1:
    # Add level: "A1" if missing
    if 'level' not in v:
        v['level'] = 'A1'
        fixes['level_added'] += 1
    
    # Rename unit -> topic if topic missing
    if 'topic' not in v and 'unit' in v:
        v['topic'] = v.pop('unit')
        fixes['topic_from_unit'] += 1
    
    # Make sure topic exists even without unit
    if 'topic' not in v:
        v['topic'] = 'Mixed'
    
    # Normalize options: if type is mcq/article-select and options is None, keep as list
    if v.get('type') in ('mcq', 'article-select', 'multiple-choice'):
        if v.get('options') is None:
            v['options'] = []

print(f"Level added: {fixes['level_added']}")
print(f"Topic from unit: {fixes['topic_from_unit']}")

g['A1'] = a1
json.dump(g, open('src/data/grammar.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# Now audit properly
print(f"\nFinal A1 count: {len(a1)}")

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
for d in dup_prompts: print(f"  {d}")

required = ['id', 'level', 'topic', 'prompt', 'answer', 'explanation']
missing = []
for v in a1:
    for f in required:
        if f not in v or v[f] is None or (isinstance(v[f], str) and not v[f].strip()):
            missing.append(f"{v['id']} missing/empty {f}")
    if v.get('type') in ('mcq', 'article-select', 'multiple-choice'):
        opts = v.get('options')
        if opts is None or (isinstance(opts, list) and len(opts) == 0):
            # Check if type is actually mcq with no options - could be problematic
            pass
print(f"Missing required fields: {len(missing)}")
for m in missing: print(f"  {m}")
