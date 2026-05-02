import json
with open('../src/data/exams.json') as f:
    e = json.load(f)
exams_data = e['exams']
for lvl, items in exams_data.items():
    print(f'{lvl}: {len(items)} exams')
    for ex in items:
        title = ex.get('title', '?') if isinstance(ex, dict) else str(ex)[:60]
        qty = len(ex.get('questions', [])) if isinstance(ex, dict) else 0
        ps = ex.get('passScore', '?') if isinstance(ex, dict) else '?'
        print(f'  "{title}": {qty} questions, passScore={ps}')
