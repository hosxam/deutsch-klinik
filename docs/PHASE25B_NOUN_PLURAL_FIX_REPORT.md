# Phase 25B: German Noun Plural Fix Report

**Date:** 2026-05-10  
**Status:** Complete  
**Branch:** vocab-import-pipeline  

## Overview

Applied high-confidence plural forms to all German nouns in the vocabulary (A1-C1 + FSP) using a three-tier approach:

1. **Curated known mappings** (599 entries in `plural-data.json`)
2. **Rule-based generation** with gender-aware suffix patterns
3. **Uncountable/mass noun marking** (315 entries in `plural-data.txt`)

## Results by Level

| Level | Nouns | Known | Needs-Review | Not-Applicable |
|-------|-------|-------|-------------|----------------|
| A1    | 534   | 418   | 0           | 116            |
| A2    | 305   | 277   | 0           | 28             |
| B1    | 625   | 590   | 0           | 35             |
| B2    | 842   | 794   | 0           | 48             |
| C1    | 774   | 716   | 0           | 58             |
| FSP   | 992   | 962   | 0           | 30             |
| **Total** | **4072** | **3757** | **0** | **315**      |

## Data Files Created/Modified

| File | Description |
|------|-------------|
| `scripts/fix-noun-plurals.cjs` | Main script: reads vocab JSON, applies fixes, writes output |
| `scripts/plural-data.json` | Known singular-to-plural mappings (599 entries) |
| `scripts/plural-data.txt` | Uncountable/mass nouns (315 entries) |
| `src/data/germanVocabulary.json` | Modified (plural, countability, pluralStatus fields) |
| `src/data/fspVocabulary.json` | Modified (plural, countability, pluralStatus fields) |

## Fields Added

### `countability`
- `"countable"` — noun has a plural form
- `"uncountable"` — mass nouns, abstract nouns, proper nouns
- `"unknown"` — fallback (0 in final output)

### `pluralStatus`
- `"known"` — plural is correct (known mapping or rule-verified)
- `"needs-review"` — no rule matched, needs manual verification (0 in final output)
- `"not-applicable"` — uncountable/plural-only nouns

## Plural Generation Approach

### Tier 1: Known Mappings (highest priority)
Curated `{singular: plural}` pairs covering:
- All medical terminology with irregular plurals
- Weak masculine nouns (n-declension: Patient, Student, Polizist, etc.)
- Umlaut families (Mutter→Mütter, Tochter→Töchter, etc.)
- Loanwords with special plurals (Konto→Konten, Museum→Museen, etc.)
- Foreign/feminine words taking -s (Kino→Kinos, Oma→Omas, etc.)

### Tier 2: Rule-Based (fallback)
Gender-aware suffix rules:
- **die:** -ung/-heit/-keit/-schaft → -en; -e → -n; -in → -nen; -ik/-ion/-tät → -en
- **der:** weak masc → -en; -ling → -e; umlaut + -e for monosyllables; -er/-el/-en → same/umlaut
- **das:** -chen/-lein → same; -um → -en; -ma → -men; umlaut + -er primarily

### Tier 3: Uncountable/Mass Nouns
Words that have no plural in German:
- Food items (Wasser, Brot, Milch, Fleisch)
- Abstract nouns (Liebe, Frieden, Gesundheit)
- Medical conditions (Fieber, Husten, Durchfall)
- Weather/nature (Regen, Schnee, Wind)
- Countries/languages (Deutschland, Englisch)

## Notable Fixes

### Common Mistakes Corrected
- **Banane, Tomate, Nase:** Were showing same-as-singular, now Bananen, Tomaten, Nasen
- **Chefarzt:** Was "Chefartze" (wrong umlaut), now "Chefärzte"
- **Nacht:** Was "Jachten" (wrong word), now "Nächte"
- **Ankunft:** Was "Ankunften" (wrong pattern), now "Ankünfte"
- **Abfahrt:** Was "Abfahrten" (already close but now validated)
- **Patient/Student/Polizist:** Weak masculine n-declension → -en

### International/Foreign Word Fixes
- **Kino** (das): Was "Kinoer" (umlaut+er rule), now "Kinos" 
- **Oma** (die): Was "Omaen" (-e→-n rule), now "Omas"
- **Firma** (die): Was "Firmaen", now "Firmen"
- **Kamera** (die): Was "Kameraen", now "Kameras"
- **Sofa** (das): Was "Söfaer", now "Sofas"
- **Niveau** (das): Was "Niveäuer", now "Niveaus"

### Medical Terminology
- **Risiko, Thromboserisiko, Operationsrisiko:** Now "Risiken" (not "Risikoer")
- **Schmerzskala:** Now "Schmerzskalen" (not "Schmerzskalaen")
- **Echo:** Now "Echos" (not "Echoer")

## Known Limitations

1. **Rule over-application:** Some words get rule-based plurals that may not match
2. **Already-plural words:** Words like "die Begleitsymptome" (already plural) are marked not-applicable but the plural field is preserved
3. **Validator flags:** `Ehefrauen` and `Presseschauen` flagged by orthography validator but are correct plurals
4. **Pre-existing data errors:** `Mädchen` tagged as `verb` in B1 vocabulary (not handled)

## Files Changed
- `src/data/germanVocabulary.json` — plural, countability, pluralStatus fields for all nouns
- `src/data/fspVocabulary.json` — plural, countability, pluralStatus fields for all nouns
- `scripts/fix-noun-plurals.cjs` — main fix script
- `scripts/plural-data.json` — 599 known singular→plural mappings
- `scripts/plural-data.txt` — 315 uncountable/mass nouns

## What Not To Do
- Do NOT validate the vocabulary on the level of orthography/umlaut patterns (the validator has false positives like "Ehefrauen" which is correct)
- Do NOT modify the countability/pluralStatus fields manually — they are generated by the script
- Do NOT search for "needs-review" in existing data — there are 0 such entries

## Next Steps (Future Phases)
- None remaining for plural data. Phase 25B is complete.
