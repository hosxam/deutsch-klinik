import json
data = json.load(open('src/data/exams.json', encoding='utf-8'))
a1 = data['exams']['A1']
print('A1 exams type:', type(a1).__name__, 'len:', len(a1))
if isinstance(a1, dict):
    for k in a1:
        print(f'  {k}:')
        if isinstance(a1[k], dict):
            for sk in a1[k]:
                print(f'    {sk}: {type(a1[k][sk]).__name__}')
else:
    print('Not a dict, examining first few items:')
    for i, item in enumerate(a1[:3]):
        if isinstance(item, dict):
            print(f'  Item {i}: keys={list(item.keys())[:10]}')
        else:
            print(f'  Item {i}: {type(item).__name__} =', str(item)[:100])
