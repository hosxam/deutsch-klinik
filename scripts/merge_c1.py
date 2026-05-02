"""Merge parts A, B, C into grammar.json"""
import json, os
from collections import Counter

ROOT = r"C:\Users\ASUS\.openclaw\workspace\deutsch-klinik\src\data"
PATH = os.path.join(ROOT, "grammar.json")

with open(PATH, "r") as f:
    data = json.load(f)

existing = data.get("C1", [])
ids = {e["id"] for e in existing}
prompts = {e["prompt"].lower().strip()[:80] for e in existing}

# Load parts
parts = []
for fn in ["_c1_partA.json", "_c1_partB.json", "_c1_partC.json"]:
    fp = os.path.join(ROOT, "..", "..", fn)
    with open(fp) as f:
        parts.append(json.load(f))

all_new = []
for part in parts:
    for ex in part:
        if ex["id"] in ids:
            # Re-assign id
            ex["id"] = f"C1_gr_{len(existing)+len(all_new)+1:03d}"
        all_new.append(ex)

# Check for dup prompts in new
new_prompts = set()
deduped = []
for ex in all_new:
    norm = ex["prompt"].lower().strip()[:80]
    if norm in prompts or norm in new_prompts:
        continue
    new_prompts.add(norm)
    deduped.append(ex)

print(f"New from parts: {len(all_new)}, deduped: {len(deduped)}")

# Reassign IDs cleanly
for i, ex in enumerate(deduped):
    ex["id"] = f"C1_gr_{len(existing)+i+1:03d}"

merged = existing + deduped
data["C1"] = merged

with open(PATH, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Existing: {len(existing)}, Added: {len(deduped)}, Total C1: {len(merged)}")

# Validation
ids_all = [e["id"] for e in merged]
dup_ids = [id for id, c in Counter(ids_all).items() if c > 1]
print(f"Dup IDs: {len(dup_ids)} {'None' if not dup_ids else dup_ids[:10]}")

prompts_all = [e["prompt"].lower().strip()[:80] for e in merged]
dup_prompts = [p for p, c in Counter(prompts_all).items() if c > 1]
print(f"Dup prompts: {len(dup_prompts)}")

missing_fields = []
for e in merged:
    for fld in ["id","level","topic","type","prompt","answer","explanation","lessonId"]:
        if not e.get(fld):
            missing_fields.append((e["id"], fld))
print(f"Missing fields: {len(missing_fields)} {'None' if not missing_fields else missing_fields[:5]}")

types = Counter(e["type"] for e in merged)
print(f"Types: {dict(types)}")

topics = Counter(e["topic"] for e in merged)
print(f"\nTopics ({len(topics)}):")
for t in sorted(topics):
    print(f"  {t}: {topics[t]}")

lessons = Counter(e["lessonId"] for e in merged)
print(f"\nLessons ({len(lessons)}):")
for l in sorted(lessons):
    print(f"  {l}: {lessons[l]}")

# Check for bad lessonIds
valid_lessons = {f"C1_lesson_{n}" for n in range(1,26)}
bad = [e["id"] for e in merged if e["lessonId"] not in valid_lessons]
print(f"\nBad lessonIds: {len(bad)} {'None' if not bad else bad}")
