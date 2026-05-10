# Phase 25A: Vocabulary Metadata Audit

**Date:** 2026-05-10
**Branch:** `vocab-import-pipeline`

## Methodology

All counts derived from analysis of `src/data/germanVocabulary.json` and `src/data/fspVocabulary.json`. 
Nouns are detected as entries where `partOfSpeech === "noun"`. Entries with `article: "article"` are 
**NOT** nouns -- this is a dummy/placeholder value that was incorrectly counted in Phase 24.

Key fields on each vocabulary entry:
- `id`, `level`, `word`, `translation`, `article`, `plural`, `example`, `exampleTranslation`
- `partOfSpeech`, `topic`, `tags`, `lessonId`, `taughtInLessonId`, `conceptId`, `pronunciationHint`
- `studyNote`, `usageNote`, `skillType`, `remediationLessonId`

---

## 1. Vocabulary Counts by Level

| Level | Total Entries | POS=noun | With Article (der/die/das) | Dummy Article ("article") | Bad POS |
|-------|--------------|----------|---------------------------|---------------------------|---------|
| A1    | 803          | 534      | 534                       | 0                         | 6       |
| A2    | 501          | 305      | 305                       | 0                         | 0       |
| B1    | 1,062        | 540      | 631                       | 267                       | 183     |
| B2    | 1,071        | 841      | 843                       | 93                        | 5       |
| C1    | 1,169        | 770      | 774                       | 335                       | 18      |
| FSP   | 1,000        | 0*       | 990                       | 0                         | 1,000*  |
| **Total** | **5,606** | **2,990** | **4,077**              | **695**                   | **1,212** |

\*FSP entries all have `partOfSpeech: "unknown"` and no `topic` field.

### Key Insight: Phase 24 noun counts were inflated

Phase 24 counted any entry with a truthy `article` field as a noun. This incorrectly counted entries 
with `article: "article"` (695 dummy values) as nouns. The actual noun count (POS field) is 2,990, 
not 4,773 as Phase 24 reported.

---

## 2. Nouns Missing Article (POS=noun, no valid article)

"Missing article" means `partOfSpeech === "noun"` but `article` is empty, null, or "article" (dummy).

| Level | Total Nouns | Missing Article | % | Details |
|-------|-------------|----------------|---|---------|
| A1    | 534         | 1              | 0.2% | `A1_v725 Ägypten` (country name, correct to have no article) |
| A2    | 305         | 0              | 0% | -- |
| B1    | 540         | 0              | 0% | Nouns all have correct articles (540/540). The dummy "article" values were on non-nouns. |
| B2    | 841         | 0              | 0% | -- |
| C1    | 770         | 0              | 0% | -- |
| **Total** | **2,990** | **1** | **0.03%** | |

**Verdict: Articles are nearly complete for entries correctly tagged as nouns.**
The 695 dummy articles are on non-noun entries and don't count as missing noun articles.

---

## 3. Nouns Missing Plural (POS=noun, no valid plural)

"Missing plural" means `partOfSpeech === "noun"` and `plural` is empty, null, "plural" (dummy), or absent.

| Level | Total Nouns | Missing Plural | % | Placeholder "plural" |
|-------|-------------|---------------|---|---------------------|
| A1    | 534         | 97            | 18.2% | 0 |
| A2    | 305         | 11            | 3.6%  | 0 |
| B1    | 540         | 18            | 3.3%  | 3 |
| B2    | 841         | 127           | 15.1% | 127 |
| C1    | 770         | 122           | 15.8% | 90 |
| **Total** | **2,990** | **375** | **12.5%** | **220** |

**Note:** Placeholder "plural" (string value "plural") indicates the plural was not yet filled in. 
These should be cleared to empty string so validators can flag them.

---

## 4. Entries Missing partOfSpeech

| Level | Missing/Empty POS | Invalid/Non-standard POS |
|-------|------------------|-------------------------|
| A1    | 0                | 6 (modal-verb → should be normalized to "modal-verb") |
| A2    | 0                | 0 |
| B1    | 0                | 183 (example sentences in POS field, mainly) |
| B2    | 0                | 5 (4 example sentences, 1 "Die Gemeinde...") |
| C1    | 0                | 18 (11 example sentences, 2 placeholder words, 5 clean entries) |
| FSP   | **1,000**        | 0 |
| **Total** | **1,000** | **212** |

### B1 Bad POS Breakdown (183 entries)

The B1 `partOfSpeech` field was corrupted for a contiguous block of entries. Instead of containing 
a POS tag, these fields contain example sentences or German sentences. For example:
- `B1_v804 beeilen` → POS is `"sonst kommen wir zu spät."`
- `B1_v885 der Hals` → POS is `"Der Hals tut weh."`
- `B1_v963 können` → POS is `"Er kann gut singen."`

These are concentrated in entries B1_v804 through B1_v1063 (the latter part of B1 vocabulary).

### C1 Bad POS Breakdown (18 entries)

Similar to B1, a smaller set of C1 entries also have example sentences in the POS field:
- C1_v503 abschließend → `"dass die Ergebnisse vielversprechend sind."`
- C1_v763 die Duldung → `"Law"` (topic leaked into POS)
- C1_v771 die Durchsetzungskraft → `"Psychology"` (topic leaked into POS)

---

## 5. Entries Missing Topic (or topic == "")

| Level | Missing Topic | Notes |
|-------|-------------|-------|
| A1    | 0            | All have meaningful topics |
| A2    | 0            | All have meaningful topics |
| B1    | 0            | All have meaningful topics |
| B2    | 0            | All have meaningful topics |
| C1    | 0            | All have meaningful topics |
| FSP   | **1,000**    | All have `category` field but no `topic` |
| **Total** | **1,000** | |

### Weak/Generic Topics

Some topics are too broad for effective SRS clustering:
- `Daily Life` (A2: uses it) — covers cooking, cleaning, working, shopping, appointments
- `Living` (A2) — generic housing/lifestyle
- `Workplace` (B2) — 50 entries in one bag is too large

These should be flagged but not aggressively split to avoid breaking existing UI filters.

---

## 6. Entries Missing Example Sentence

| Level | Missing Example | Notes |
|-------|-----------------|-------|
| A1    | 0               | -- |
| A2    | 0               | -- |
| B1    | 0               | -- |
| B2    | 0               | -- |
| C1    | 0               | -- |
| FSP   | 0               | -- |
| **Total** | **0** | All 5,606 entries have example sentences. |

---

## 7. Entries Missing taughtInLessonId / conceptId

| Level | Missing taughtInLessonId | Missing conceptId |
|-------|-------------------------|-------------------|
| A1    | 0                       | 0 |
| A2    | 0                       | **501** |
| B1    | 0                       | **1,062** |
| B2    | 0                       | 0 |
| C1    | **771**                 | **1,169** |
| FSP   | 0                       | 0 |
| **Total** | **771** | **2,732** |

**taughtInLessonId** is missing from 771 C1 entries. Most C1 entries have `lessonId` which can 
be copied into `taughtInLessonId`. 398 C1 entries already have it.

**conceptId** is missing from ALL A2, B1, C1 entries, and present in A1, B2, and FSP.
This field maps vocabulary to curriculum concepts. A2/B1/C1 entries need conceptId mapping.

---

## 8. FSP Vocabulary Details

| Field | Status |
|-------|--------|
| Total entries | 1,000 |
| With article (der/die/das) | 990 |
| With plural | 550 (345 missing, but many are uncountable medical terms) |
| With partOfSpeech | 0 (1,000 are "unknown") |
| With topic | 0 (1,000 missing — use category as source) |
| With category | 1,000 (38 unique categories) |
| With example | 1,000 |
| With taughtInLessonId | 1,000 |

### FSP Categories (38 unique)

General Hospital, Emergency Medicine, Internal Medicine, Surgery, Cardiology, Neurology, 
Pediatrics, Gynecology, Orthopedics, Dermatology, Ophthalmology, ENT, Psychiatry, 
Radiology, Anesthesiology, Laboratory, Pharmacy, Physiotherapy, Nursing, 
Administration, Symptoms, Vital Signs, Anatomy, Diagnostics, Medications, 
Treatment, Prevention, History, Medications/Allergies, Review of Systems, 
Physical Examination, Assessment, Plan, Discharge, Patient Education, 
Informed Consent, Medical Ethics, Documentation

---

## 9. Pronunciation Hint Coverage

| Level | With pronunciationHint | % |
|-------|----------------------|---|
| A1    | 251                  | 31.3% |
| A2    | 0                    | 0% |
| B1    | 0                    | 0% |
| B2    | 0                    | 0% |
| C1    | 0                    | 0% |
| FSP   | 0                    | 0% |
| **Total** | **251** | **4.5%** |

Pronunciation hints exist only in A1 vocabulary. These are textual hints (e.g., "The German 'ch' 
is softer than English 'k'.") rather than IPA. Expansion to A2-C1 is deferred to Phase 25C.

---

## 10. Duplicate Detection

### Exact word duplicates within same level

| Level | Unique Words | Duplicates Found | Pairs |
|-------|-------------|-----------------|-------|
| A1    | 790         | 13              | 13     |
| A2    | 496         | 5               | 5      |
| B1    | 1,024       | 35              | 38     |
| B2    | 1,047       | 21              | 24     |
| C1    | 1,149       | 14              | 20     |
| FSP   | 1,000       | 0               | 0      |

**Cross-level duplicates** (same normalized word in multiple levels):
- A1-A2: 47 words (mostly basic vocab carried over)
- A2-B1: 34 words (mostly health/everyday vocab)
- B1-B2: 31 words (mostly workplace/academic overlap)
- B2-C1: 42 words (advanced vocabulary overlap, expected at transition)

Note: Cross-level duplicates are intentional (spaced repetition across CEFR levels).
Only same-level duplicates warrant investigation.

---

## 11. Fields Needed for Flashcard Generation

| Flashcard Type | Required Fields | Available? |
|----------------|----------------|------------|
| Meaning card (German → English) | word, translation, example | All 5,606 entries OK |
| Article card (der/die/das) | word, article (valid), partOfSpeech=noun | 2,989 of 2,990 nouns OK |
| Plural card | word, plural (valid), partOfSpeech=noun | 2,615 of 2,990 nouns OK |
| Phrase/collocation card | word, partOfSpeech=phrase | Minimal phrase tagging exists |
| Pronunciation card | word, pronunciationHint | Only 251 A1 entries |

### Article Card Gap
Only 1 noun (A1_v725 Ägypten) lacks article — and it's correct (country names don't always need articles).

### Plural Card Gap
375 nouns missing plurals (12.5% of all nouns). Worst levels: A1 (97 missing), B2 (127 missing), C1 (122 missing).

### Phrase Card Gap
Very few entries tagged as `phrase`. Multi-word expressions exist but are mostly tagged as 
nouns or verbs. Adding phrasal POS tags would enable collocation flashcards.

---

## 12. Summary of All Issues

| Severity | Count | Issue |
|----------|-------|-------|
| **BLOCKER** | 1,000 | FSP vocabulary has `partOfSpeech: "unknown"` (cannot generate POS-aware flashcards) |
| **BLOCKER** | 695 | Non-noun entries have `article: "article"` dummy value (confuses detection) |
| **BLOCKER** | 1,000 | FSP vocabulary has no `topic` field |
| **HIGH** | 183 | B1 entries have example text in `partOfSpeech` field |
| **HIGH** | 375 | Nouns missing plurals (can't generate plural flashcards) |
| **HIGH** | 771 | C1 entries missing `taughtInLessonId` |
| **MEDIUM** | 220 | Placeholder "plural" values should be cleared |
| **MEDIUM** | 18 | C1 entries have bad POS values |
| **MEDIUM** | 2,732 | ConceptId missing from A2/B1/C1 entries |
| **LOW** | 6 | A1 "modal verb" POS needs normalization (non-breaking) |
| **LOW** | 97 | A1 nouns missing plurals (placeholders, need manual review) |
| **LOW** | 11 | A2 nouns missing plurals |
| **NONE** | 0 | No entries are truly missing example sentences |
| **NONE** | 0 | No entries missing topic among main levels (A1-C1) |
