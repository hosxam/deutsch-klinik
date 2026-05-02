import json, re
from collections import Counter

with open('../src/data/germanVocabulary.json') as f:
    v = json.load(f)

for lvl in ['A1', 'A2', 'B1', 'B2', 'C1']:
    items = v.get(lvl, [])
    missing = []
    for item in items:
        if item.get('partOfSpeech') == 'noun':
            p = item.get('plural', '')
            if not p or p.strip() == '':
                missing.append(item)
    print(f'{lvl}: {len(missing)} nouns missing plural')
    for item in missing[:5]:
        w = item.get('word', '')
        wid = item.get('id', '?')
        art = item.get('article', '')
        print(f'  {wid}: {w} (article={art!r})')
    arts = Counter()
    for item in missing:
        a = item.get('article', '')
        if not a or a.strip() == '':
            arts['no_article'] += 1
        else:
            arts[a] += 1
    if missing:
        print(f'  Articles: {dict(arts)}')
