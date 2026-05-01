import json
with open('src/data/grammar.json', encoding='utf-8') as f:
    a1 = json.load(f)['A1']
prompts = {}
for v in a1:
    p = v['prompt'].strip().lower()
    if p in prompts:
        print(f"DUP: [{p}]")
        print(f"  First:  {prompts[p]}")
        print(f"  Second: {v['id']}")
    else:
        prompts[p] = v['id']
