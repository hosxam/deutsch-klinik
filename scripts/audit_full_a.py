#!/usr/bin/env python3
"""Full site audit across all levels."""
import json, os, sys
from collections import Counter

REQUIRED_FILES = [
    'src/data/germanLessons.json',
    'src/data/germanVocabulary.json',
    'src/data/grammar.json',
    'src/data/reading.json',
    'src/data/listening.json',
    'src/data/writing.json',
    'src/data/speaking.json',
    'src/data/exams.json',
    'src/data/levels.json',
    'src/data/vocabulary.json',
]

BASE = 'src/data'

def load(fname):
    with open(os.path.join(BASE, fname), 'r', encoding='utf-8') as f:
        return json.load(f)

def check_moji(v, path, errors):
    if isinstance(v, str):
        for ch in v:
            cp = ord(ch)
            if 0xFFF0 <= cp <= 0xFFFF:
                errors.append(f"MOJI: {path} (U+{cp:04X})")
    elif isinstance(v, list):
        for i, item in enumerate(v):
            check_moji(item, f"{path}[{i}]", errors)
    elif isinstance(v, dict):
        for k, subv in v.items():
            check_moji(subv, f"{path}.{k}", errors)

def check_null_string(v, path, errors):
    if isinstance(v, str) and v.strip().lower() == 'null':
        errors.append(f"NULL_STR: {path} = '{v}'")
    elif isinstance(v, list):
        for i, item in enumerate(v):
            check_null_string(item, f"{path}[{i}]", errors)
    elif isinstance(v, dict):
        for k, subv in v.items():
            check_null_string(subv, f"{path}.{k}", errors)

# 1. Lessons
lessons = load('germanLessons.json')
for level in ['A1','A2','B1','B2','C1']:
    arr = lessons.get(level, [])
    ids = [l['id'] for l in arr]
    print(f"Lessons {level}: {len(arr)} items")

# 2. Vocabulary - germanVocabulary.json
gv = load('germanVocabulary.json')
print(f"\n=== germanVocabulary.json ===")
print(f"Keys: {list(gv.keys())}")

# 3. Vocabulary - vocabulary.json
voc = load('vocabulary.json')
print(f"\n=== vocabulary.json ===")
print(f"Keys: {list(voc.keys())}")

# 4. Grammar
grammar = load('grammar.json')
print(f"\n=== grammar.json ===")
print(f"Keys: {list(grammar.keys())}")

# 5. Reading
reading = load('reading.json')
print(f"\n=== reading.json ===")
print(f"Keys: {list(reading.keys())}")

# 6. Listening
listening = load('listening.json')
print(f"\n=== listening.json ===")
print(f"Keys: {list(listening.keys())}")

# 7. Writing
writing = load('writing.json')
print(f"\n=== writing.json ===")
print(f"Keys: {list(writing.keys())}")

# 8. Speaking
speaking = load('speaking.json')
print(f"\n=== speaking.json ===")
print(f"Keys: {list(speaking.keys())}")

# 9. Exams
exams = load('exams.json')
print(f"\n=== exams.json ===")
print(f"Top keys: {list(exams.keys())}")
if 'exams' in exams:
    print(f"Exam levels: {list(exams['exams'].keys())}")

# 10. Levels (lock logic)
levels = load('levels.json')
print(f"\n=== levels.json ===")
print(json.dumps(levels, indent=2, ensure_ascii=False)[:2000])
