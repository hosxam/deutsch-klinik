import json

with open('src/data/grammar.json', encoding='utf-8') as f:
    g = json.load(f)

for level in g:
    items = g[level]
    if isinstance(items, list):
        print(f"{level}: {len(items)} items")
    else:
        print(f"{level}: {type(items).__name__}")

a1 = g['A1']
gr = [v for v in a1 if v['id'].startswith('A1_gr_')]
ex = [v for v in a1 if v['id'].startswith('A1_ex_')]
print(f"\nA1_gr_ ids: {len(gr)}, range: {gr[0]['id']}-{gr[-1]['id']}")
print(f"A1_ex_ ids: {len(ex)}, range: {ex[0]['id']}-{ex[-1]['id']}")

print("\nAll A1 items:")
for v in a1:
    u = v.get('unit') or v.get('topic') or v.get('section') or '?'
    opts = 'options' in v
    print(f"  {v['id']}: unit={u} | type={v.get('type','?')} | options={opts}")

print(f"\nTotal A1: {len(a1)}")
