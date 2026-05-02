#!/usr/bin/env python3
"""Full site audit for Deutsch Klinik app"""
import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
os.chdir(DATA_DIR)

LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

def load_json(name):
    with open(name, 'r', encoding='utf-8') as f:
        return json.load(f)

def count_by_level(data, levels=LEVELS):
    result = {}
    for lvl in levels:
        if isinstance(data, dict) and lvl in data:
            items = data[lvl]
            if isinstance(items, list):
                result[lvl] = len(items)
            elif isinstance(items, dict):
                result[lvl] = len(items)
            else:
                result[lvl] = 0
        else:
            result[lvl] = 0
    return result

# ============================================================
# SECTION 1: COUNTS BY LEVEL/MODULE
# ============================================================
print("=" * 70)
print("A) FINAL COUNTS BY LEVEL/MODULE")
print("=" * 70)

# 1. Lessons
lessons = load_json('germanLessons.json')
print("\n1. LESSONS (germanLessons.json): %d total" % len(lessons))
for lvl in LEVELS:
    cnt = sum(1 for l in lessons if l.get('level') == lvl)
    print("   %s: %d lessons" % (lvl, cnt))

# 2. Vocabulary
vocab = load_json('germanVocabulary.json')
vc = count_by_level(vocab)
total_v = sum(vc.values())
print("\n2. VOCABULARY (germanVocabulary.json):")
for lvl in LEVELS:
    print("   %s: %d entries" % (lvl, vc[lvl]))
print("   TOTAL: %d" % total_v)

# 3. Grammar
grammar = load_json('germanGrammar.json')
gc = count_by_level(grammar)
total_g = sum(gc.values())
print("\n3. GRAMMAR (germanGrammar.json):")
for lvl in LEVELS:
    print("   %s: %d entries" % (lvl, gc[lvl]))
print("   TOTAL: %d" % total_g)

# 4. Reading
reading = load_json('germanReadingTexts.json')
rc = count_by_level(reading)
total_r = sum(rc.values())
print("\n4. READING (germanReadingTexts.json):")
for lvl in LEVELS:
    print("   %s: %d texts" % (lvl, rc[lvl]))
print("   TOTAL: %d" % total_r)

# 5. Listening
listening = load_json('listening.json')
lc = count_by_level(listening)
total_li = sum(lc.values())
print("\n5. LISTENING (listening.json):")
for lvl in LEVELS:
    print("   %s: %d entries" % (lvl, lc[lvl]))
print("   TOTAL: %d" % total_li)

# Listening scripts
scripts = load_json('germanListeningScripts.json')
sc = count_by_level(scripts)
total_sc = sum(sc.values())
print("\n   LISTENING SCRIPTS (germanListeningScripts.json):")
for lvl in LEVELS:
    print("   %s: %d scripts" % (lvl, sc[lvl]))
print("   TOTAL: %d" % total_sc)

# 6. Writing
writing = load_json('writing.json')
wc = count_by_level(writing)
total_w = sum(wc.values())
print("\n6. WRITING (writing.json):")
for lvl in LEVELS:
    print("   %s: %d prompts" % (lvl, wc[lvl]))
print("   TOTAL: %d" % total_w)

# Writing prompts
wp = load_json('germanWritingPrompts.json')
wpc = count_by_level(wp)
total_wp = sum(wpc.values())
print("\n   WRITING PROMPTS (germanWritingPrompts.json):")
for lvl in LEVELS:
    print("   %s: %d entries" % (lvl, wpc[lvl]))
print("   TOTAL: %d" % total_wp)

# 7. Speaking
speaking = load_json('speaking.json')
spc = count_by_level(speaking)
total_sp = sum(spc.values())
print("\n7. SPEAKING (speaking.json):")
for lvl in LEVELS:
    print("   %s: %d entries" % (lvl, spc[lvl]))
print("   TOTAL: %d" % total_sp)

# 8. Exams
exams = load_json('exams.json')
print("\n8. EXAMS (exams.json):")
exams_data = exams.get('exams', {})
total_sections = 0
total_tasks = 0
for lvl in LEVELS:
    level_exams = exams_data.get(lvl, [])
    print("   %s: %d exams" % (lvl, len(level_exams)))
    for ex in level_exams:
        if isinstance(ex, dict):
            sections = ex.get('sections', {})
            print("      '%s': %d sections" % (ex.get('name', ex.get('title', '?')), len(sections)))
            total_sections += len(sections)
            for sec_name, sec_data in sections.items():
                if isinstance(sec_data, dict):
                    tasks = sec_data.get('tasks', [])
                    total_tasks += len(tasks)

print("   Total exams: %d" % sum(len(exams_data.get(lvl, [])) for lvl in LEVELS))
print("   Total sections across all exams: %d" % total_sections)
print("   Total individual tasks: %d" % total_tasks)

# ============================================================
# SECTION 2: DATA INTEGRITY
# ============================================================
print("\n" + "=" * 70)
print("B) DATA INTEGRITY ISSUES")
print("=" * 70)

issues = []

# 2a: Duplicate IDs within each level
print("\n2a. Duplicate IDs within each file/level:")
for lvl in LEVELS:
    items = vocab.get(lvl, [])
    ids = [item.get('id') for item in items if isinstance(item, dict)]
    dup_ids = [x for x in ids if ids.count(x) > 1]
    if dup_ids:
        dup_unique = sorted(set(dup_ids))
        print("   %s vocab: %d duplicate IDs - %s" % (lvl, len(dup_unique), str(dup_unique[:10])))
        for did in dup_unique:
            issues.append("Duplicate vocab ID %s in %s" % (did, lvl))
    else:
        print("   %s vocab: OK" % lvl)

# Duplicate IDs in grammar
for lvl in LEVELS:
    items = grammar.get(lvl, [])
    if isinstance(items, list):
        ids = [g.get('id') for g in items if isinstance(g, dict)]
        dup_ids = [x for x in ids if ids.count(x) > 1]
        if dup_ids:
            print("   %s grammar: %d duplicate IDs" % (lvl, len(set(dup_ids))))
        else:
            print("   %s grammar: OK" % lvl)

# 2b: Cross-level ID duplicates
print("\n2b. Cross-level ID duplicates:")
all_ids = {}
cross_dups = 0
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            vid = item.get('id')
            if vid in all_ids:
                cross_dups += 1
                if cross_dups <= 3:
                    issues.append("Cross-level duplicate ID %s in %s and %s" % (vid, lvl, all_ids[vid]))
            else:
                all_ids[vid] = lvl
if cross_dups == 0:
    print("   OK - no cross-level duplicates")
else:
    print("   %d cross-level duplicates" % cross_dups)

# 2c: Duplicate/fake vocabulary entries (same word in same level)
print("\n2c. Duplicate word entries within same level:")
dup_words = 0
for lvl in LEVELS:
    items = vocab.get(lvl, [])
    seen = {}
    for item in items:
        if isinstance(item, dict):
            w = item.get('word', '').lower().strip()
            if w in seen:
                dup_words += 1
                issues.append("Duplicate word '%s' in %s: IDs %s and %s" % (
                    item.get('word'), lvl, seen[w].get('id'), item.get('id')))
            else:
                seen[w] = item
if dup_words == 0:
    print("   OK - no duplicate words within any level")
else:
    print("   %d duplicate words found" % dup_words)

# 2d: Missing required fields
print("\n2d. Missing required fields:")
required_fields = ['id', 'level', 'word', 'partOfSpeech']
missing_count = 0
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if not isinstance(item, dict):
            issues.append("Non-dict item in %s: %s" % (lvl, str(item)[:50]))
            continue
        for field in required_fields:
            if field not in item:
                issues.append("Missing field '%s' in %s item %s" % (field, lvl, item.get('id', '?')))
                missing_count += 1
if missing_count == 0:
    print("   OK - no missing required fields")
else:
    print("   %d missing field instances" % missing_count)

# 2e: Missing or broken lessonIds
print("\n2e. Broken lessonId references:")
valid_lessons = set()
for l in lessons:
    if isinstance(l, dict) and 'id' in l:
        valid_lessons.add(l['id'])

broken_lesson_ids = set()
missing_lesson_ids = 0
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            lid = item.get('lessonId')
            if lid is None or lid == '':
                missing_lesson_ids += 1
                if missing_lesson_ids <= 3:
                    issues.append("Missing lessonId in %s item %s" % (lvl, item.get('id')))
            elif lid not in valid_lessons:
                broken_lesson_ids.add(lid)
                if len(broken_lesson_ids) <= 5:
                    issues.append("Broken lessonId '%s' in vocab item %s" % (lid, item.get('id')))

if missing_lesson_ids == 0 and len(broken_lesson_ids) == 0:
    print("   OK - all lessonIds valid")
else:
    print("   Missing lessonIds: %d" % missing_lesson_ids)
    print("   Broken lessonIds: %d - %s" % (len(broken_lesson_ids), str(broken_lesson_ids)))

# 2f+2g: Nouns missing articles/plurals
print("\n2f/2g. Nouns missing articles / plurals:")
nouns_no_article = 0
nouns_no_plural = 0
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            pos = item.get('partOfSpeech', '')
            if pos == 'noun':
                article = item.get('article')
                if not article or article.strip() == '':
                    nouns_no_article += 1
                plural = item.get('plural')
                if not plural or plural.strip() == '':
                    nouns_no_plural += 1
print("   Nouns missing article: %d" % nouns_no_article)
print("   Nouns missing plural: %d" % nouns_no_plural)
# Add summary issue if significant
if nouns_no_article > 10:
    issues.append("Many nouns missing article: %d of %d total vocab entries" % (nouns_no_article, total_v))
if nouns_no_plural > 10:
    issues.append("Many nouns missing plural: %d" % nouns_no_plural)

# 2h: Invalid JSON - already passed load
print("\n2h. Invalid JSON: None (all files loaded successfully)")

# 2i: Mojibake/encoding corruption
print("\n2i. Encoding corruption (mojibake):")
mojibake_count = 0
mojibake_samples = []
# Check all vocab files
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            for key, val in item.items():
                if isinstance(val, str):
                    if '\ufffd' in val:
                        mojibake_count += 1
                        if len(mojibake_samples) < 5:
                            mojibake_samples.append((item.get('id'), key, val[:60]))
# Also check exams.json
for lvl in LEVELS:
    for ex in exams_data.get(lvl, []):
        if isinstance(ex, dict):
            for key, val in ex.items():
                if isinstance(val, str) and '\ufffd' in val:
                    mojibake_count += 1
                elif isinstance(val, dict):
                    # recurse sections
                    for sk, sv in val.items():
                        if isinstance(sv, str) and '\ufffd' in sv:
                            mojibake_count += 1
                        elif isinstance(sv, list):
                            for t in sv:
                                if isinstance(t, dict):
                                    for tk, tv in t.items():
                                        if isinstance(tv, str) and '\ufffd' in tv:
                                            mojibake_count += 1

# Also check for UTF-8 double-encoding (like Ã¼ instead of ü)
print("\n2i-b. Double-encoded UTF-8 / garbage bytes:")
double_encoded = 0
bad_patterns = ['\u00c3', '\u00c2', '\u00c4', '\u00c5', '\u00c6', '\u00c7',
                '\u00c8', '\u00c9', '\u00ca', '\u00cb', '\u00cc', '\u00cd',
                '\u00ce', '\u00cf', '\u00d0', '\u00d1', '\u00d2', '\u00d3',
                '\u00d4', '\u00d5', '\u00d6', '\u00d7', '\u00d8', '\u00d9',
                '\u00da', '\u00db', '\u00dc', '\u00dd', '\u00de', '\u00df']
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            for key, val in item.items():
                if isinstance(val, str):
                    for bp in bad_patterns:
                        if bp in val:
                            double_encoded += 1
                            if double_encoded <= 5:
                                issues.append("Double-encoding in %s.%s: %s" % (item.get('id'), key, val[:80]))
                            break

print("   Mojibake count: %d" % mojibake_count)
print("   Double-encoded bytes: %d" % double_encoded)

# 2j: String 'null' instead of JSON null
print("\n2j. String 'null' instead of JSON null:")
string_null = 0
for lvl in LEVELS:
    for item in vocab.get(lvl, []):
        if isinstance(item, dict):
            for key, val in item.items():
                if isinstance(val, str) and val.lower() == 'null':
                    string_null += 1
                    if string_null <= 5:
                        issues.append("String 'null' in %s.%s" % (item.get('id'), key))
if string_null == 0:
    print("   OK - no string 'null'")
else:
    print("   %d 'null' string instances" % string_null)

# Additional: Check all other data files for duplicate IDs
print("\n2k. Grammar - duplicate IDs:")
for lvl in LEVELS:
    items = grammar.get(lvl, [])
    if isinstance(items, list):
        ids = [g.get('id') for g in items if isinstance(g, dict)]
        dup = [x for x in ids if ids.count(x) > 1]
        if dup:
            issues.append("Duplicate grammar IDs in %s: %s" % (lvl, str(sorted(set(dup)))))
            print("   %s: %d duplicates" % (lvl, len(set(dup))))
        else:
            print("   %s: OK" % lvl)

print("\n2l. Reading - duplicate IDs:")
for lvl in LEVELS:
    items = reading.get(lvl, [])
    if isinstance(items, list):
        ids = [r.get('id') for r in items if isinstance(r, dict)]
        dup = [x for x in ids if ids.count(x) > 1]
        if dup:
            issues.append("Duplicate reading IDs in %s: %s" % (lvl, str(sorted(set(dup)))))
            print("   %s: %d duplicates" % (lvl, len(set(dup))))
        else:
            print("   %s: OK" % lvl)

print("\n2m. Listening - duplicate IDs:")
for lvl in LEVELS:
    items = listening.get(lvl, [])
    if isinstance(items, list):
        ids = [l.get('id') for l in items if isinstance(l, dict)]
        dup = [x for x in ids if ids.count(x) > 1]
        if dup:
            issues.append("Duplicate listening IDs in %s: %s" % (lvl, str(sorted(set(dup)))))
            print("   %s: %d duplicates" % (lvl, len(set(dup))))
        else:
            print("   %s: OK" % lvl)

print("\n2n. Writing - duplicate IDs:")
for lvl in LEVELS:
    items = writing.get(lvl, [])
    if isinstance(items, list):
        ids = [w.get('id') for w in items if isinstance(w, dict)]
        dup = [x for x in ids if ids.count(x) > 1]
        if dup:
            issues.append("Duplicate writing IDs in %s: %s" % (lvl, str(sorted(set(dup)))))
            print("   %s: %d duplicates" % (lvl, len(set(dup))))
        else:
            print("   %s: OK" % lvl)

print("\n2o. Speaking - duplicate IDs:")
for lvl in LEVELS:
    items = speaking.get(lvl, [])
    if isinstance(items, list):
        ids = [s.get('id') for s in items if isinstance(s, dict)]
        dup = [x for x in ids if ids.count(x) > 1]
        if dup:
            issues.append("Duplicate speaking IDs in %s: %s" % (lvl, str(sorted(set(dup)))))
            print("   %s: %d duplicates" % (lvl, len(set(dup))))
        else:
            print("   %s: OK" % lvl)

# Print consolidated issue list
if issues:
    print("\n" + "=" * 70)
    print("CONSOLIDATED DATA ISSUES: %d" % len(issues))
    for i, issue in enumerate(issues, 1):
        print("  %d. %s" % (i, issue))
else:
    print("\n   No data integrity issues found!")

# ============================================================
# SECTION 3: C1 VOCAB DETAILS
# ============================================================
print("\n" + "=" * 70)
print("C1 VOCAB DETAILS")
print("=" * 70)
c1_items = vocab.get('C1', [])
print("C1 total vocab: %d" % len(c1_items))
pos_counts = defaultdict(int)
for item in c1_items:
    pos = item.get('partOfSpeech', 'unknown')
    pos_counts[pos] += 1
print("C1 POS breakdown: %s" % dict(pos_counts))

lesson_vocab = defaultdict(int)
lesson_nouns = defaultdict(int)
for item in c1_items:
    lid = item.get('lessonId', 'none')
    lesson_vocab[lid] += 1
    if item.get('partOfSpeech') == 'noun':
        lesson_nouns[lid] += 1

print("C1 lessons with vocab: %d" % len(lesson_vocab))
for lid in sorted(lesson_vocab.keys()):
    print("   %s: %d entries (%d nouns)" % (lid, lesson_vocab[lid], lesson_nouns[lid]))

# ============================================================
print("\n" + "=" * 70)
print("AUDIT COMPLETE")
print("=" * 70)
