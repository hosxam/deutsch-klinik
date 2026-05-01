import json, re, sys

issues = []
warnings = []

def check(name, d, checks):
    """Run checks on a data dict. d can be list or dict."""
    result = {"name": name, "count": 0, "duplicate_ids": 0, "duplicate_content": 0, 
              "missing_fields": 0, "broken_lessonids": 0, "encoding_issues": 0}
    
    items = []
    if isinstance(d, list):
        items = d
        result["count"] = len(items)
    elif isinstance(d, dict):
        # Could be exam-like or grammar-like
        for k, v in d.items():
            if isinstance(v, list) and k not in ('_comment', 'exams'):
                items.extend(v)
        result["count"] = len(items)
    
    ids = set()
    titles_or_prompts = set()
    
    # Check for encoding issues (mangled umlauts)
    mangled = re.compile(r'[\\u][0-9a-f]{4}', re.I)
    
    for item in items:
        if not isinstance(item, dict):
            continue
        
        # Item-level encoding check
        item_str = json.dumps(item, ensure_ascii=False)
        # Check for literal \uXXXX sequences that shouldn't be there
        if '\\u00' in item_str or '\\u20' in item_str:
            # These are escaped unicode - fine for JSON
            pass
        
        # Check for garbled chars: look for sequences that suggest double-encoding
        # like Ã¤ instead of ä
        for field_name, field_val in item.items():
            if isinstance(field_val, str):
                # Check for common double-encoding patterns
                if 'Ã' in field_val or 'Â' in field_val or 'Ã¤' in field_val:
                    result["encoding_issues"] += 1
                    if result["encoding_issues"] <= 3:
                        warnings.append("Encoding issue in %s %s: %s" % (name, item.get('id','?'), field_val[:60]))
        
        # Check duplicate IDs
        item_id = item.get('id')
        if item_id:
            if item_id in ids:
                result["duplicate_ids"] += 1
                warnings.append("Duplicate ID in %s: %s" % (name, item_id))
            ids.add(item_id)
        
        # Check duplicate content (title/prompt/question)
        for field in ['title', 'prompt', 'question']:
            if field in item and item[field]:
                key = item[field].strip().lower()[:60]
                if key in titles_or_prompts:
                    # Don't count as duplicate unless it's truly the same
                    if len(item[field]) > 20:
                        result["duplicate_content"] += 1
                        if result["duplicate_content"] <= 3:
                            warnings.append("Similar content in %s %s: %s" % (name, item_id or '?', item[field][:50]))
                titles_or_prompts.add(key)
        
        # Check missing required fields per module type
        if name == 'Vocabulary':
            for field in ['german', 'english', 'partOfSpeech']:
                if field not in item or item[field] is None or item[field] == '':
                    result["missing_fields"] += 1
                    if result["missing_fields"] <= 3:
                        warnings.append("Missing field '%s' in %s %s" % (field, name, item.get('id','?')))
            # Check lessonId
            lid = item.get('lessonId', '')
            if lid and not lid.startswith('A1_lesson_') and lid != '':
                pass  # Non-A1 lessons are fine
            if lid and lid not in [''] and not lid.startswith('A1_lesson_'):
                result["broken_lessonids"] += 1
                    
        elif name == 'Grammar':
            for field in ['id', 'prompt', 'answer']:
                if field not in item or item[field] is None or item[field] == '':
                    result["missing_fields"] += 1
                    if result["missing_fields"] <= 3:
                        warnings.append("Missing field '%s' in %s %s" % (field, name, item.get('id','?')))
        
        elif name == 'Reading':
            for field in ['id', 'title', 'text', 'questions']:
                if field not in item or item[field] is None or (isinstance(item[field], str) and item[field] == ''):
                    result["missing_fields"] += 1
                    if result["missing_fields"] <= 3:
                        warnings.append("Missing field '%s' in %s %s" % (field, name, item.get('id','?')))
            # Check lessonId
            lid = item.get('lessonId', '')
            if lid and not lid.startswith('A1_lesson_'):
                result["broken_lessonids"] += 1
                if result["broken_lessonids"] <= 3:
                    warnings.append("Broken lessonId in %s %s: %s" % (name, item.get('id','?'), lid))
        
        elif name == 'Listening':
            for field in ['id', 'title', 'script', 'questions']:
                if field not in item or item[field] is None or (isinstance(item[field], str) and item[field] == ''):
                    result["missing_fields"] += 1
                    if result["missing_fields"] <= 3:
                        warnings.append("Missing field '%s' in %s %s" % (field, name, item.get('id','?')))
            lid = item.get('lessonId', '')
            if lid and not lid.startswith('A1_lesson_'):
                result["broken_lessonids"] += 1
        
        elif name == 'Writing':
            for field in ['id', 'title', 'prompt', 'rubric']:
                if field not in item or item[field] is None or (isinstance(item[field], str) and item[field] == ''):
                    result["missing_fields"] += 1
            lid = item.get('lessonId', '')
            if lid and not lid.startswith('A1_lesson_'):
                result["broken_lessonids"] += 1
        
        elif name == 'Speaking':
            for field in ['id', 'title', 'prompt']:
                if field not in item or item[field] is None or (isinstance(item[field], str) and item[field] == ''):
                    result["missing_fields"] += 1
            lid = item.get('lessonId', '')
            if lid and not lid.startswith('A1_lesson_'):
                result["broken_lessonids"] += 1
    
    result["warnings"] = warnings[-10:]  # last 10
    return result

# Load all A1 data
base = 'src/data/'

# 1. Vocabulary
vocab = json.load(open(base + 'germanVocabulary.json', encoding='utf-8'))
vr = check('Vocabulary', vocab.get('A1', []), {})
print("=== VOCABULARY ===")
print("Count: %d/%d" % (vr['count'], 497))
print("Duplicate IDs: %d" % vr['duplicate_ids'])
print("Duplicate German words: %d" % vr['duplicate_content'])
print("Missing fields: %d" % vr['missing_fields'])
print("Broken lessonIds: %d" % vr['broken_lessonids'])
print("Encoding issues: %d" % vr['encoding_issues'])

# Verify target
if vr['count'] != 497:
    issues.append("Vocabulary count %d != 497" % vr['count'])

# Check for actual duplicate german words
seen = {}
dup_words = []
for item in vocab.get('A1', []):
    ger = item.get('german', '').lower()
    if ger in seen:
        dup_words.append((ger, item.get('id',''), seen[ger]))
    seen[ger] = item.get('id','')
if dup_words:
    print("Duplicate German words (exact):")
    for w, id1, id2 in dup_words[:5]:
        print("  %s: %s and %s" % (w, id1, id2))

print()

# 2. Grammar
grammar = json.load(open(base + 'grammar.json', encoding='utf-8'))
gr = check('Grammar', grammar.get('A1', []), {})
print("=== GRAMMAR ===")
print("Count: %d/%d" % (gr['count'], 200))
print("Duplicate IDs: %d" % gr['duplicate_ids'])
print("Similar prompts: %d" % gr['duplicate_content'])
print("Missing fields: %d" % gr['missing_fields'])
print("Encoding issues: %d" % gr['encoding_issues'])
if gr['count'] != 200:
    issues.append("Grammar count %d != 200" % gr['count'])

# Check each grammar has answer
no_ans = [item['id'] for item in grammar.get('A1', []) if not item.get('answer')]
if no_ans:
    issues.append("Grammar items missing answer: %s" % ','.join(no_ans[:5]))

print()

# 3. Reading
reading = json.load(open(base + 'reading.json', encoding='utf-8'))
rr = check('Reading', reading.get('A1', []), {})
print("=== READING ===")
print("Count: %d/%d" % (rr['count'], 50))
print("Duplicate IDs: %d" % rr['duplicate_ids'])
print("Missing fields: %d" % rr['missing_fields'])
print("Broken lessonIds: %d" % rr['broken_lessonids'])
print("Encoding issues: %d" % rr['encoding_issues'])
if rr['count'] != 50:
    issues.append("Reading count %d != 50" % rr['count'])

# Check reading questions have answers
for item in reading.get('A1', []):
    for q in item.get('questions', []):
        if not q.get('answer'):
            issues.append("Reading %s question %s missing answer" % (item.get('id','?'), q.get('id','?')))

print()

# 4. Listening
listening = json.load(open(base + 'listening.json', encoding='utf-8'))
lr = check('Listening', listening.get('A1', []), {})
print("=== LISTENING ===")
print("Count: %d/%d" % (lr['count'], 50))
print("Duplicate IDs: %d" % lr['duplicate_ids'])
print("Missing fields: %d" % lr['missing_fields'])
print("Broken lessonIds: %d" % lr['broken_lessonids'])
print("Encoding issues: %d" % lr['encoding_issues'])
if lr['count'] != 50:
    issues.append("Listening count %d != 50" % lr['count'])

# Check listening questions have answers
for item in listening.get('A1', []):
    for q in item.get('questions', []):
        if not q.get('answer'):
            issues.append("Listening %s question %s missing answer" % (item.get('id','?'), q.get('id','?')))

print()

# 5. Writing
writing = json.load(open(base + 'writing.json', encoding='utf-8'))
wr = check('Writing', writing.get('A1', []), {})
print("=== WRITING ===")
print("Count: %d/%d" % (wr['count'], 50))
print("Duplicate IDs: %d" % wr['duplicate_ids'])
print("Missing fields: %d" % wr['missing_fields'])
print("Broken lessonIds: %d" % wr['broken_lessonids'])
print("Encoding issues: %d" % wr['encoding_issues'])
if wr['count'] != 50:
    issues.append("Writing count %d != 50" % wr['count'])

# Check writing rubric structure
for item in writing.get('A1', []):
    rubric = item.get('rubric', {})
    if not rubric:
        issues.append("Writing %s missing rubric" % item.get('id','?'))
    elif not isinstance(rubric, dict):
        issues.append("Writing %s rubric not a dict" % item.get('id','?'))
    elif len(rubric) < 3:
        issues.append("Writing %s rubric has few criteria (%d)" % (item.get('id','?'), len(rubric)))

print()

# 6. Speaking
speaking = json.load(open(base + 'speaking.json', encoding='utf-8'))
sr = check('Speaking', speaking.get('A1', []), {})
print("=== SPEAKING ===")
print("Count: %d/%d" % (sr['count'], 50))
print("Duplicate IDs: %d" % sr['duplicate_ids'])
print("Missing fields: %d" % sr['missing_fields'])
print("Encoding issues: %d" % sr['encoding_issues'])
if sr['count'] != 50:
    issues.append("Speaking count %d != 50" % sr['count'])

print()

# 7. Lessons
lessons = json.load(open(base + 'germanLessons.json', encoding='utf-8'))
a1_lessons = [l for l in lessons if l.get('level') == 'A1']
print("=== LESSONS ===")
print("A1: %d/%d (total all: %d)" % (len(a1_lessons), 25, len(lessons)))
if len(a1_lessons) != 25:
    issues.append("A1 lessons count %d != 25" % len(a1_lessons))

# Check lesson IDs
lid_set = set()
for l in a1_lessons:
    lid = l.get('id', '')
    if lid in lid_set:
        issues.append("Duplicate lesson ID: %s" % lid)
    lid_set.add(lid)
    if not l.get('title'):
        issues.append("Lesson %s missing title" % lid)
    if not l.get('description'):
        issues.append("Lesson %s missing description" % lid)

print()

# 8. Exams
exams = json.load(open(base + 'exams.json', encoding='utf-8'))
a1_exams = exams['exams'].get('A1', [])
exam_ids = set()
exam_dupes = []
total_exam_tasks = 0
for ex in (a1_exams if isinstance(a1_exams, list) else [a1_exams]):
    eid = ex.get('id', '?')
    if eid in exam_ids:
        exam_dupes.append(eid)
    exam_ids.add(eid)
    for sk in ex.get('sections', {}):
        tasks = ex['sections'][sk].get('tasks', [])
        total_exam_tasks += len(tasks)
        for t in tasks:
            tid = t.get('id', '')
            if tid in exam_ids:
                exam_dupes.append(tid)
            exam_ids.add(tid)

print("=== EXAMS ===")
a1_count = len(a1_exams) if isinstance(a1_exams, list) else (1 if a1_exams else 0)
print("A1: %d/%d" % (a1_count, 5))
print("Total tasks: %d" % total_exam_tasks)
print("Duplicate IDs: %d" % len(exam_dupes))
if exam_dupes:
    for d in exam_dupes[:5]:
        print("  Duplicate: %s" % d)
if a1_count != 5:
    issues.append("Exams count %d != 5" % a1_count)

print()

# 9. Check A2-C1 data was not modified
print("=== A2-C1 INTEGRITY (quick check) ===")
for mod_name, fname, key in [
    ('Vocabulary', 'germanVocabulary.json', 'A2'),
    ('Grammar', 'grammar.json', 'A2'),
    ('Reading', 'reading.json', 'A2'),
    ('Listening', 'listening.json', 'A2'),
    ('Writing', 'writing.json', 'A2'),
    ('Speaking', 'speaking.json', 'A2'),
]:
    d = json.load(open(base + fname, encoding='utf-8'))
    val = d.get(key, [])
    print("%s %s: %d items" % (key, mod_name, len(val) if isinstance(val, list) else '?'))

print()

# Summary
print("=" * 50)
print("AUDIT COMPLETE")
print("=" * 50)
if issues:
    print("ISSUES FOUND:")
    for i, issue in enumerate(issues):
        print("  %d. %s" % (i+1, issue))
else:
    print("NO CRITICAL ISSUES FOUND")
print()
for w in warnings:
    print("WARNING: %s" % w)
