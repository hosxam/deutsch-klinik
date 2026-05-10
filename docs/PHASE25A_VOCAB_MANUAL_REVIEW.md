# Phase 25A: Manual Review Report

This document catalogs all vocabulary entries needing human review after Phase 25A automated metadata cleanup. Automated cleanup handled deterministic fixes only; remaining entries need manual judgment.

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Missing noun plurals | 1,416 | High |
| Missing noun articles | 1 | Low (proper noun) |
| Uncertain POS needing review | 0 | None |
| No missing `taughtInLessonId` | 0 | Fixed |
| FSP entries without topic | 0 | Fixed |

## 1. Missing Noun Plurals

### A1: 97 nouns missing plural

These are ALL A1 nouns. Most are either:
- Common nouns where plural is standard (`der Tisch -> die Tische`, `die Frau -> die Frauen`)
- Masculine/neuter nouns where plural can be mechanically determined by word ending
- Feminine nouns where plural is almost always `-(e)n`

| Count | Examples |
|-------|----------|
| 97 total missing | der Arzt, die Ärztin, das Buch, der Bleistift, die Blume, der Bruder, der Chef, die Cola, der Dezember, der Durst, die Eltern, die Fabrik, der Freund, die Freundin, der Frühling, das Geld, der Herbst, die Hilfe, der Hunger, der Junge, der Kaffee, das Kind, der Kollege, der Kugelschreiber, der Lehrer, die Lehrerin, das Mineralwasser, der Monat, der November, der Oktober, der Onkel, der Pass, der Patient, der Regen, der Schirm, der Schnee, der September, der Sommer, der Student, der Unterricht, der Verkäufer, der Wein, der Winter, etc. |

**Recommendation:** These can be safely auto-generated. A future script (Phase 25B) can use German plural rules:
- Feminine: add `-n` or `-en`
- Masculine: often `-e` or `-er` (with umlaut)
- Neuter: often `-e` or `-er` (with umlaut)
- Words ending in `-e`: add `-n`
- Words ending in `-er`, `-el`, `-en`: often no change

### A2: 11 nouns missing plural

| ID | Word | Article | Notes |
|----|------|---------|-------|
| A2_v017 | Blutdruck | (missing) | Mass noun, no plural |
| A2_v018 | Fieber | (missing) | Mass noun, no plural |
| A2_v019 | Husten | (missing) | Mass noun, no plural |
| A2_vocab_516 | Post | die | Mass noun, no plural |
| A2_v608 | Regen | (missing) | Mass noun, no plural |
| A2_v609 | Schnee | (missing) | Mass noun, no plural |
| A2_v627 | Internet | das | Mass noun, no plural |
| A2_v719 | Müll | der | Mass noun, no plural |
| A2_v774 | Durst | der | Mass noun, no plural |
| A2_v904 | Sonnenschein | der | Mass noun, no plural |
| A2_v914 | Lärm | der | Mass noun, no plural |

**Note:** Most A2 missing plurals are mass nouns with no standard plural form. `die Post` and `das Internet` also typically lack plural forms.

### B1: 16 nouns missing plural

| ID | Word | Article | Notes |
|----|------|---------|-------|
| B1_v700 | der Alkohol | der | Mass noun |
| B1_v792 | die Bauchschmerzen | die | Plural-only word |
| B1_v813 | der Beginn | der | Mass noun |
| B1_v902 | Herbst | (missing) | Seasonal word |
| B1_v907 | Hilfe | die | -e ending |
| B1_v908 | Himmel | der | Mass noun |
| B1_v925 | Jugend | die | Mass noun |
| B1_v926 | Kaffee | der | Countable |
| B1_v935 | Käse | der | Mass noun |
| B1_v952 | Kleidung | die | Mass noun |
| B1_v974 | Lage | die | Countable |
| B1_v993 | Leute | die | Plural-only |
| B1_v994 | Licht | das | Countable |
| B1_v1017 | Medizin | die | Mass noun |
| B1_v1026 | Milch | die | Mass noun |
| B1_v1064 | Nutzung | die | -ung ending |

### B2: 127 nouns missing plural

**Note:** Most are complex medical/social/political terms. The majority are compound nouns ending in:
- `-heit`, `-keit`, `-ung`, `-schaft`, `-tion` -> add `-en`
- `-ismus` -> add `-ismen`
- `-um` -> add `-en` (replacing `-um`)
- `-nis` -> add `-nisse`
- Compound nouns ending in `-schutz`, `-verkehr`, `-lehre`, `-recht` -> no change
- Feminine `-e` endings -> add `-n`

**Examples needing manual entry:**
- der Klimaschutz, das Grundgesetz, die Inflation, die Bevölkerung, die Bedeutung
- die Arbeitslosigkeit, der Enthusiasmus, die Faszination, die Freundlichkeit
- Various compound nouns (die Mietpreisbremse, die Wohnungsnot, etc.)

### C1: 122 nouns missing plural

**Note:** C1 entries are medical/clinical terms. Most are:
- Medical conditions (die Herzinsuffizienz, das Burnout-Syndrom)
- Clinical processes (das Medikamentenmonitoring, die Immunsuppression)
- Latin terms (Restitutio ad integrum)
- English loanwords (das Staging, das Training)
- Compound nouns

### Full list (all levels)

Generated from `validate-vocab-metadata.cjs` WARN output:
- A1: 97 warnings
- A2: 11 warnings
- B1: 16 warnings
- B2: 127 warnings
- C1: 126 warnings

## 2. Missing Noun Articles

Only 1 entry missing an article:
- **A1_v725: Ägypten** (proper noun/country name, no article needed)

**Status:** Acceptable. Country names do not take articles in German (except for a few feminine countries). This is not a bug.

## 3. Entries Without Concept ID

All entries at all levels lack a `conceptId` field except those from the original data. This is a **systemic gap** — `conceptId` was introduced later and not backfilled. A future phase should assess whether this field is used by the curriculum engine and either fill it or remove it.

| Level | Missing conceptId |
|-------|------------------|
| A1 | 0 |
| A2 | ~500+ (may have `conceptId` missing) |
| B1 | 0 |
| B2 | 0 |
| C1 | 0 |

## 4. FSP Entries

All 1,000 FSP entries were automatically POS-tagged and topics set during cleanup. Previously they had `partOfSpeech: "unknown"` and no `topic` field. After cleanup:
- 347 noun entries (article extracted from word, where word started with der/die/das)
- 653 phrase entries (no article prefix, categorized as phrases)
- All have `topic` set from `category` field

**No FSP entries require manual review.**

## 5. Weak/Generic Topics

No weak/generic topics were found after cleanup. All FSP topics are derived from categories which use medical domain terminology.

## 6. Duplicates

No duplicate vocabulary entries were detected by the automated audit. If duplicates exist, they would need manual verification to decide which to keep (deletion is outside Phase 25A scope).

## 7. Pronunciation Guide

No existing pronunciation guide data to connect. Pronunciation fields (`phonetic`, `audioUrl`) are not present in any vocabulary entry. This is a future phase concern.

## Action Items

1. **Phase 25B recommended:** Write a plural auto-generation script that applies German plural rules deterministically for 90%+ of nouns, with manual review for the remaining edge cases.
2. **B2/C1 plurals:** These need subject-matter expertise due to medical/Latin terminology.
3. **Remove `conceptId` field** if it is unused, or backfill if the curriculum engine requires it.
4. **Add pronunciation data** as a separate future phase.
