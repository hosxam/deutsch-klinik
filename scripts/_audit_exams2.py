import json
data = json.load(open('src/data/exams.json', encoding='utf-8'))
a1 = data['exams']['A1']
print('A1 keys:', list(a1.keys()))
print()

for k in a1:
    if isinstance(a1[k], dict):
        ex = a1[k]
        name = ex.get('name', '???')
        eid = ex.get('id', '?')
        print("Exam:", name, "(id:", eid, ")")
        print("  passScore:", ex.get('passScore'))
        sections = ex.get('sections', {})
        for sk, sv in sections.items():
            tasks = sv.get('tasks', [])
            print("  %s: %d tasks" % (sk, len(tasks)))
            if tasks:
                t0 = tasks[0]
                print("    task keys:", list(t0.keys())[:8])
                if 'questions' in t0:
                    print("    questions:", len(t0['questions']))
                if 'rubric' in t0:
                    r = t0['rubric']
                    if isinstance(r, dict):
                        print("    rubric keys:", list(r.keys())[:6])
                    else:
                        print("    rubric type:", type(r).__name__)
                if 'script' in t0:
                    print("    has script:", t0['script'][:60])
        print()
