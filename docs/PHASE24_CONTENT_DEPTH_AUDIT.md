# Phase 24: Content Depth Audit

**Date:** 2026-05-10

## 1. Vocabulary Counts by Level

| Level | Total Words | Nouns | Missing Article | Missing Plural | With Examples | With Topic |
|-------|-------------|-------|-----------------|----------------|---------------|------------|
| A1    | 803         | 535   | 1               | 98             | 803           | 803        |
| A2    | 501         | 305   | 0               | 11             | 501           | 501        |
| B1    | 1,062       | 898   | 267             | 285            | 1,062         | 1,062      |
| B2    | 1,071       | 936   | 93              | 220            | 1,071         | 1,071      |
| C1    | 1,169       | 1,109 | 335             | 457            | 1,169         | 1,169      |
| FSP   | 1,000       | 990   | 0               | 345            | 1,000         | 0          |
| **Total** | **5,606** | **4,773** | **696** | **1,416** | **5,606** | **4,606** |

### Issues Found

**Missing article/plural in nouns:**
- B1: 267 missing articles, 285 missing plurals (out of 898 nouns)
- C1: 335 missing articles, 457 missing plurals (out of 1,109 nouns)
- B2: 93 missing articles, 220 missing plurals (out of 936 nouns)
- FSP: 345 missing plurals (out of 990 nouns -- fields exist but plural schema differs)
- **14.6% of nouns are missing articles, 29.7% missing plurals overall**

**POS distribution issues:**
- B1 has noisy POS data (examples leaking into partOfSpeech field)
- FSP entries all have `partOfSpeech: "unknown"` -- zero POS tagging
- C1 has non-standard POS values ("verb (C1)", "conjunction" alongside "verb", "conjunction")

**B1 noun/article/plural gap is critical** -- nearly 30% of B1 nouns lack articles and plurals. This should be a priority cleanup.

**FSP vocabulary is entirely untagged for part of speech** -- 1,000 entries with no POS data, no topic mapping, no querying capability in the app.

---

## 2. Topic Coverage Analysis

### A1 Topics (51 unique)
Appointment Communication, Basic Verbs, Body, Body Parts, City Places, Clothing, Colors, Common Adjectives, Common Adverbs, Countries, Daily Life, Daily Routine, Days, Descriptions, Directions, etc.

**Verdict:** Good breadth for beginner level. 51 topics across 803 words is reasonable.

### A2 Topics (23 unique)
Admin, Culture, Daily Life, Education, Feelings, Finance, Food, Furniture, Grammar, Health, Hobbies, Housing, Living, Medical, Nature, etc.

**Verdict:** 501 words across 23 topics. Some topics feel too generic ("Daily Life", "Living"). Could be more granular.

### B1 Topics (14 unique)
Business and Economy, Daily Life, Education and Learning, Emotions and Relationships, Grammar and Language, Health and Body, Hobbies and Leisure, Home and Living, Nature and Environment, Shopping and Services, Society and Culture, Technology and Media, Travel and Transport, Work and Career

**Verdict:** Only 14 topics for 1,062 words is **too generic**. Words are lumped into broad categories. This lacks the granularity needed for effective SRS learning (e.g., mixing "Business and Economy" with "Emotions and Relationships" across 75+ words each makes targeted review harder).

### B2 Topics (84 unique)
Work and professional (50), Technology (40), Education (38), Healthcare (32), Environment (32), Law and consumer rights (31), Sports (31), Travel (31), Economy (29), Marketing (27), Art (27), etc.

**Verdict:** Much better granularity. Good academic and formal register coverage. Notable gaps: academic writing/formal register vocabulary is thinner than needed for C1 preparation.

### C1 Topics (109 unique)
clinical-communication (220!), Work (64), Politics (53), Law (47), Psychology (37), argumentation (34), Finance (29), Communication (27), arztbrief (26), Education (26), Science (25), etc.

**Verdict:** Strong medical focus (220 clinical-communication, 26 arztbrief, 15 consent, 12 health-policy, 11 evidence, 10 risk-benefit). Academic vocabulary is present but spread thinly across many granular topics.

### FSP Topics (0)
**Verdict:** No topic mapping at all. 1,000 entries unreachable by topic filtering.

---

## 3. B2/C1 Academic & Formal Register

### Academic vocabulary
- B2: topics like "Academic communication" (9 words), "Research and education" (8), "Argumentation" (9)
- C1: topics like "Academic" (16), "Analysis" (21), "Methodology" (20), "Research" (8), "Argumentation" (8)

**Verdict:** ~100 academic vocabulary words across B2/C1. This is insufficient for genuine academic study. A learner needs 500+ academic register words for university-level German.

### Formal register
- B2: "Formal feedback and evaluation" (9), "Formal complaints and solutions" (8)
- C1: "Formal" (6), "Formal Connectors" (5), "Administration" (22), "Law" (47), "Governance" (3)

**Verdict:** ~100 formal register words. Business German (B1's "Business and Economy: 132") is covered, but formal writing registers (letters, emails, academic essays, official correspondence) are thin.

---

## 4. Medical/FSP Vocabulary

| Level | Medical/Health Words |
|-------|---------------------|
| A1    | 114                 |
| A2    | 51                  |
| B1    | 106                 |
| B2    | 72                  |
| C1    | 390                 |
| FSP   | 14                  |
| **Total** | **747**        |

C1 has strong medical coverage (390 words across topics like clinical-communication, arztbrief, consent, health-policy, evidence, risk-benefit, ethics, research).

FSP vocabulary file has 1,000 clinical entries (body parts, symptoms, diseases, treatments, medications) but with zero topic/POS metadata. These should be tagged and integrated.

**Gap:** ~250-500 additional clinical terms with proper metadata would make the FSP module fully self-contained.

---

## 5. Lesson Depth Assessment

| Aspect | A1 | A2 | B1 | B2 | C1 |
|--------|----|----|----|----|----|
| Lessons | 25 | 25 | 25 | 25 | 25 |
| Avg explanation (chars) | 406 | 268 | 341 | 176 | 286 |
| With examples | 25/25 | 25/25 | 25/25 | 25/25 | 25/25 |
| Common mistakes | 25/25 | 25/25 | 25/25 | 25/25 | 25/25 |
| Forms tables | 25/25 | 25/25 | 25/25 | 25/25 | 25/25 |
| Pronunciation notes | 25/25 | **0/25** | **0/25** | **0/25** | **0/25** |
| Medical/FSP notes | 12/25 | **0/25** | **0/25** | **0/25** | **0/25** |
| Mini-drills | 17/25 | 25/25 | 25/25 | 25/25 | 25/25 |
| Linked exercises | **1/25** | 25/25 | 25/25 | 23/25 | 13/25 |
| Guided practice | 25/25 | 25/25 | 25/25 | 25/25 | 25/25 |
| Independent practice | 13/25 | 25/25 | **5/25** | **5/25** | **5/25** |
| Review summary | 25/25 | 25/25 | 25/25 | 25/25 | 25/25 |

### Critical Issues

1. **Pronunciation notes disappear after A1**
   A1 has 25/25 with notes. A2 through C1 have 0 pronunciation note fields, despite the pronunciation guide file having entries for all 50 lesson IDs. The data exists but isn't connected.

2. **Medical/FSP field unused after A1**
   12/25 A1 lessons have medical notes. Zero lessons in A2-C1 utilize the `medicalFspNotes` field. This is a missed opportunity for medical-context learning.

3. **B2 lessons are too thin**
   Average explanation length is 176 chars. 14 of 25 lessons are under 200 chars. These are essentially vocabulary lists with minimal explanation. A B2 lesson should have 400-800 chars of explanation.

4. **Independent practice dropped at B1+**
   Only 5/25 lessons in B1, B2, and C1 have independent practice sections. A2 has 25/25. This means higher-level learners get less practice, not more.

5. **Linked exercises incomplete at A1, C1**
   A1 has 1/25 with linked exercises (likely due to its design as the oldest level). C1 has 13/25, suggesting some C1 lessons need exercise linking.

---

## 6. Skill Exercise Counts

| Skill    | A1 | A2 | B1 | B2 | C1 | Total |
|----------|----|----|----|----|----|-------|
| Reading  | 50 | 53 | 60 | 50 | 50 | 263   |
| Listening| 50 | 50 | 60 | 50 | 50 | 260   |
| Writing  | 50 | 50 | 50 | 50 | 50 | 250   |
| Speaking | 50 | 70 | 50 | 50 | 50 | 270   |
| Grammar  | 406| 247| 242| 246| 304| 1,445 |
| Exams    | 5  | 5  | 5  | 5  | 5  | 25    |
| **Total** | **611** | **475** | **467** | **451** | **509** | **2,513** |

### Balanced but minimal
All four skills have ~50 exercises per level (50-70 range). This is consistent but minimal. For comparison, a dedicated coursebook would have 100+ exercises per skill per level.

---

## 7. Pronunciation Guide

- 50 guide entries exist in `pronunciationGuides.json`
- Covers A1-C1 (all 25 A1/C1 lesson slots plus A2-B1 reuses some)
- Entries include phonetic hints, word lists, and warning notes
- **BUT**: pronunciation notes in lessons (`pronunciationNotes` field) are only populated for A1 (25/25). A2-C1 don't render pronunciation data from the guide despite the data existing.

---

## 8. FSP Specific Content

| Resource | Entries | Quality |
|----------|---------|---------|
| fspLessons.json | 40 | 0 avg content length (metadata only?) |
| fspAnamnese.json | 141 | Detailed doctor-patient Q&A pairs |
| fspCases.json | 100 | Case studies with patient roles, must-ask questions |
| fspPresentations.json | 100 | Patient presentation exercises |
| fspVocabulary.json | 1,000 | Clinical terms (untagged, no POS) |

FSP is content-rich in case studies, anamnesis, and presentations but the vocabulary and lessons need structuring.

---

## 9. Key Gaps Summary

| Gap | Severity | Details |
|-----|----------|---------|
| B1 noun metadata | HIGH | 267 missing articles, 285 missing plurals |
| C1 noun metadata | HIGH | 335 missing articles, 457 missing plurals |
| B2 lesson depth | HIGH | 14/25 thin lessons (<200 chars) |
| Pronunciation notes A2-C1 | HIGH | Not populated in lessons despite guide existing |
| Independent practice B1-C1 | MEDIUM | Only 5/25 lessons per level |
| Medical notes A2-C1 | MEDIUM | `medicalFspNotes` field unused after A1 |
| FSP vocab untagged | MEDIUM | No POS, no topics, no queries |
| A1 linked exercises | MEDIUM | Only 1/25 lessons |
| C1 linked exercises | LOW-MEDIUM | 13/25 linked, 12 missing |
| Academic vocabulary B2/C1 | LOW-MEDIUM | ~100 words, needs 500+ |
| Topic granularity B1 | LOW | Only 14 broad topics |
| FSP lesson content depth | LOW | 40 entries with 0 avg content |
