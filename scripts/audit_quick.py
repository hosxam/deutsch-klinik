#!/usr/bin/env python3
"""Quick summary report - only critical issues."""
import json, os
from collections import Counter

BASE = 'src/data'

def load(fname):
    with open(os.path.join(BASE, fname), 'r', encoding='utf-8') as f:
        return json.load(f)

errors = []

# 1. Lessons
lessons = load('germanLessons.json')
lc = Counter(l['level'] for l in lessons)
print("=== LESSONS ===")
for lv in ['A1','A2','B1','B2','C1']:
    print(f"  {lv}: {lc.get(lv,0)}")

# Check lesson ID ranges
for l in lessons:
    lv = l['level']
    num = int(l['id'].split('_')[-1])
    if not (1 <= num <= 25):
        errors.append(f"Lesson out of range: {l['id']}")

# 2. germanVocabulary.json
print("\n=== VOCABULARY (germanVocabulary.json) ===")
gv = load('germanVocabulary.json')
gv_counts = {}
gv_missing = Counter()
for lv in ['A1','A2','B1','B2','C1']:
    arr = gv.get(lv, [])
    gv_counts[lv] = len(arr)
    for item in arr:
        if not item.get('german'):
            gv_missing[f'gv_{lv}_german'] += 1
        if not item.get('meaning'):
            gv_missing[f'gv_{lv}_meaning'] += 1
    # Check duplicate IDs
    ids = [x['id'] for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"gv_{lv} duplicate IDs: {dups}")
    print(f"  {lv}: {gv_counts[lv]} entries")

if gv_missing:
    print(f"  Missing fields: {dict(gv_missing)}")

# 3. vocabulary.json (flashcard vocab)
print("\n=== VOCABULARY (vocabulary.json) ===")
vj = load('vocabulary.json')
if isinstance(vj, dict):
    for lv in ['A1','A2','B1','B2','C1']:
        arr = vj.get(lv, [])
        print(f"  {lv}: {len(arr)} entries")
        ids = [x.get('id','?') for x in arr]
        dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
        if dups:
            errors.append(f"vj_{lv} duplicate IDs: {dups}")

# 4. Grammar
grammar = load('grammar.json')
print("\n=== GRAMMAR ===")
for lv in ['A1','A2','B1','B2','C1']:
    arr = grammar.get(lv, [])
    print(f"  {lv}: {len(arr)} exercises")
    ids = [x.get('id','?') for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"gram_{lv} duplicate IDs: {dups}")
    # Check for missing lessonIds
    missing = sum(1 for x in arr if 'lessonId' not in x)
    if missing:
        errors.append(f"gram_{lv}: {missing} items missing lessonId")
    # Missing explanations
    missing_exp = sum(1 for x in arr if 'explanation' not in x)
    if missing_exp:
        errors.append(f"gram_{lv}: {missing_exp} items missing explanation")

# 5. Reading
reading = load('reading.json')
print("\n=== READING ===")
for lv in ['A1','A2','B1','B2','C1']:
    arr = reading.get(lv, [])
    print(f"  {lv}: {len(arr)} passages")
    ids = [x.get('id','?') for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"rd_{lv} duplicate IDs: {dups}")
    missing_li = sum(1 for x in arr if 'lessonId' not in x)
    if missing_li:
        errors.append(f"rd_{lv}: {missing_li} items missing lessonId")

# 6. Listening
listening = load('listening.json')
print("\n=== LISTENING ===")
for lv in ['A1','A2','B1','B2','C1']:
    arr = listening.get(lv, [])
    print(f"  {lv}: {len(arr)} exercises")
    ids = [x.get('id','?') for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"ls_{lv} duplicate IDs: {dups}")
    missing_li = sum(1 for x in arr if 'lessonId' not in x)
    if missing_li:
        errors.append(f"ls_{lv}: {missing_li} items missing lessonId")

# 7. Writing
writing = load('writing.json')
print("\n=== WRITING ===")
for lv in ['A1','A2','B1','B2','C1']:
    arr = writing.get(lv, [])
    print(f"  {lv}: {len(arr)} prompts")
    ids = [x.get('id','?') for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"wr_{lv} duplicate IDs: {dups}")
    missing_li = sum(1 for x in arr if 'lessonId' not in x)
    if missing_li:
        errors.append(f"wr_{lv}: {missing_li} items missing lessonId")

# 8. Speaking
speaking = load('speaking.json')
print("\n=== SPEAKING ===")
for lv in ['A1','A2','B1','B2','C1']:
    arr = speaking.get(lv, [])
    print(f"  {lv}: {len(arr)} prompts")
    ids = [x.get('id','?') for x in arr]
    dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
    if dups:
        errors.append(f"sp_{lv} duplicate IDs: {dups}")

# 9. Exams
exams = load('exams.json')
print("\n=== EXAMS ===")
if 'exams' in exams:
    for lv in ['A1','A2','B1','B2','C1']:
        arr = exams['exams'].get(lv, [])
        print(f"  {lv}: {len(arr)} exams")
        ids = [x.get('id','?') for x in arr]
        dups = [id for id, cnt in Counter(ids).items() if cnt > 1]
        if dups:
            errors.append(f"ex_{lv} duplicate IDs: {dups}")

# 10. Levels
print("\n=== LEVELS (lock logic) ===")
levels = load('levels.json')
for lv, data in levels.items():
    req = data.get('requiredLevel', 'none')
    print(f"  {lv}: requires {req}")

# Print all errors
print("\n" + "=" * 60)
if errors:
    print(f"CRITICAL ISSUES: {len(errors)}")
    for e in errors:
        print(f"  - {e}")
else:
    print("NO CRITICAL DATA INTEGRITY ISSUES FOUND")

print("\nDone.")
