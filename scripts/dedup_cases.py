import json
from collections import Counter

d = json.load(open('../src/data/fspCases.json','r',encoding='utf-8'))
print(f'Before: {len(d)}')

seen = {}
dupe_indices = []
for i, x in enumerate(d):
    t = x.get('title','')
    if t in seen:
        dupe_indices.append(i)
    else:
        seen[t] = i

print(f'Found {len(dupe_indices)} duplicates')
for idx in sorted(dupe_indices, reverse=True):
    dup = d.pop(idx)
    print(f'  Removed idx {idx}: {dup["id"]} - {dup["title"]}')

# Re-number
for i, x in enumerate(d):
    x['id'] = f'fsp_c_{i+1:03d}'

print(f'After cleanup: {len(d)} items')
titles = [x.get('title','') for x in d]
dupes = [t for t,c in Counter(titles).items() if c>1]
if dupes:
    print(f'STILL DUPLICATE: {dupes}')
else:
    print('No duplicates')

json.dump(d, open('../src/data/fspCases.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('Saved')
