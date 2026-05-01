import json

with open('src/data/grammar.json', encoding='utf-8') as f:
    g = json.load(f)

a1 = g['A1']
print(f"A) A1 grammar count: {len(a1)}")

# Check duplicate IDs
ids = set()
dupes = []
for v in a1:
    if v['id'] in ids:
        dupes.append(v['id'])
    ids.add(v['id'])
print(f"B) Duplicate IDs: {len(dupes)}")
if dupes:
    for d in dupes:
        print(f"   {d}")

# Check for duplicate/similar questions
prompts = set()
dup_qs = []
for v in a1:
    p = v['prompt'].strip().lower()
    if p in prompts:
        dup_qs.append(v['id'])
    prompts.add(p)
print(f"C) Duplicate/similar questions: {len(dup_qs)}")
if dup_qs:
    for d in dup_qs:
        print(f"   {d}")

# Check lessonId references - not applicable (A1 grammar uses topic/unit not lessonId)
print(f"D) lessonIds: N/A (grammar uses topic/unit field)")

# Check missing required fields
missing = []
required = ['id', 'prompt', 'answer', 'explanation']
for v in a1:
    for field in required:
        if field not in v or not v[field]:
            missing.append(f"{v['id']} missing {field}")
    if v.get('type') in ('mcq', 'article-select', 'multiple-choice'):
        if 'options' not in v or not v.get('options'):
            missing.append(f"{v['id']} missing options for type={v.get('type')}")
print(f"E) Missing required fields: {len(missing)}")
if missing:
    for m in missing[:10]:
        print(f"   {m}")

# Check type validity
valid_types = {'fill-blank', 'mcq', 'article-select', 'sentence-correction', 'multiple-choice', 'conjugation', 'case-select', 'drag-word', 'mixed'}
bad_types = []
for v in a1:
    if v.get('type') not in valid_types:
        bad_types.append(f"{v['id']}: type={v.get('type')}")
print(f"F) Invalid types: {len(bad_types)}")
if bad_types:
    for b in bad_types:
        print(f"   {b}")
