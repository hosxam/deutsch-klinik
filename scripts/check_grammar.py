import json
with open('../src/data/grammar.json') as f:
    g = json.load(f)
for lvl in ['A1', 'A2', 'B1', 'B2', 'C1']:
    items = g.get(lvl, [])
    print(f'{lvl}: {len(items)} grammar items')
    for i, item in enumerate(items[:3]):
        title = item.get('title', item.get('topic', '?'))
        print(f'  [{i}] id={item.get("id","?")}, title={str(title)[:50]}')
