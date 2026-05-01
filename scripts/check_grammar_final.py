import json
g = json.load(open('src/data/grammar.json', encoding='utf-8'))
a1 = g['A1']
print(f'A) Previous: 40')
print(f'B) Added: {len(a1) - 40}')
print(f'C) Final A1 count: {len(a1)}')

ids = set(); dupes = set()
for v in a1:
    if v['id'] in ids: dupes.add(v['id'])
    ids.add(v['id'])
print(f'D) Duplicate IDs: {len(dupes)}')

prompts = set(); dup_prompts = 0
for v in a1:
    p = v['prompt'].strip().lower()
    if p in prompts: dup_prompts += 1
    prompts.add(p)
print(f'E) Duplicate/similar questions: {dup_prompts}')

required = ['id','prompt','answer','explanation']
missing = []
for v in a1:
    for f in required:
        if f not in v or not v[f]:
            missing.append(f'{v["id"]} missing {f}')
    if v.get('type') in ('mcq','article-select','multiple-choice'):
        if 'options' not in v or not v.get('options'):
            missing.append(f'{v["id"]} missing options')
print(f'G) Missing fields: {len(missing)}')
if missing:
    for m in missing: print(f'   {m}')
