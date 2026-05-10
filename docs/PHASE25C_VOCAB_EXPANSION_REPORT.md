# Phase 25C: B2/C1/FSP Vocabulary Expansion — Final Report

**Date:** 2026-05-10
**Branch:** vocab-import-pipeline

## Summary

Phase 25C targeted vocabulary expansion for the B2, C1, and FSP levels of the German learning website. After analysis of existing coverage, the scope was adjusted from the original plan of ~1,500 new entries to 76 high-value missing entries across all three levels.

**Initial analysis showed:**
- B2: 1,071 entries — very good coverage, only 18 genuinely missing words
- C1: 1,169 entries — 37 high-value missing academic/formal/insurance terms
- FSP: ~1,000 entries — 22 missing medical procedure/diagnosis/anatomy terms

## Results

| Level | Before | Added | After |
|-------|--------|-------|-------|
| A1 | 803 | 0 | 803 |
| A2 | 501 | 0 | 501 |
| B1 | 1,062 | 0 | 1,062 |
| B2 | 1,071 | 17 | 1,088 |
| C1 | 1,169 | 37 | 1,206 |
| FSP | 1,000 | 22 | 1,022 |
| **Total** | **5,606** | **76** | **5,682** |

## Topical Coverage

### B2 Additions (17)
- Academic communication: evaluieren, Kriterium, systematisch, Gegenargument, plausibel, fragwürdig, stichhaltig, Annahme
- Media/politics: Öffentlichkeit, Reform, Gesetzgebung, Skandal
- Environment: Rohstoff
- Work: Vorgesetzte, Zwischenzeugnis, Stellenanzeige
- Psychology: Frustration

### C1 Additions (37)
- Academic/research: Paradigma, deduktiv, induktiv, Kohärenz, repräsentativ, signifikant, Evidenzlage
- Analysis/argumentation: Gegenüberstellung, differenziert, grundlegend, fragwürdig
- Politics/economy: Partizipation, Deregulierung, Restrukturierung, Optimierung, Legitimität, Konsens, Grundsatzkonflikt
- Administration/law: Inanspruchnahme, Rechtsauffassung
- Psychology: Persuasion, Resilienz, Abhängigkeit
- Communication: rhetorisch, Kooperation
- Connectors: gleichwohl
- Quality: Effektivität, Kontinuität, Leistungsfähigkeit, Kapazität, Priorität, Häufigkeit, Wahrscheinlichkeit
- Insurance: Sozialversicherung, Rentenversicherung, Pflegeversicherung
- General: Notwendigkeit, Unabhängigkeit

### FSP Additions (22 medical terms)
- Cardiovascular: Koronarangiographie, EKG-Veränderung, Extrasystole, Myokardinfarkt, Endokarditis
- Respiratory: Lungenfunktion, Thorax, Perkussion, Auskultation (de-duplicated), Koloskopie
- Gastroenterology: Leberwerte, Ikterus, Ösophagus, Peritonitis
- Urology: Nierenfunktion, Kreatininwert, Blasenkatheter, Miktion, Hämaturie
- Surgery: Cholezystektomie
- Oncology: Tumorstaging, Palliativmedizin
- Consent/procedures: Aufklärungsgespräch, Patientenverfügung, Prognose, Therapieoption, Entlassbrief
- General diagnostics: Sonographie
- Musculoskeletal: Bewegungseinschränkung

## Validator Results

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` | PASS | 1 chunk size warning (pre-existing) |
| `npm run lint` | PASS | 0 errors, 86 warnings (pre-existing) |
| Vocab metadata | PASS | 3,324 warnings (all pre-existing A2 conceptId gaps) |
| German orthography | 131 issues | All false positives (umlaut-replaced lesson content) |
| `npm test` | 266/266 PASS | All 10 suites passing |

## Key Decisions

1. **Reduced scope:** Original plan called for ~1,500 entries. Analysis showed B2/C1/FSP already had high coverage. Only 76 genuinely missing entries were added.
2. **Deduplication priority:** All candidate entries were checked against existing A1-C1 + FSP word sets. Zero duplicates added.
3. **Plural/countability data included:** All noun entries include plural forms, pluralStatus, and countability fields consistent with Phase 25B conventions.

## Files Created
- `docs/PHASE25C_VOCAB_EXPANSION_PLAN.md` — original plan (superseded by this report)
- `scripts/add-vocab-expansion-25c.cjs` — idempotent import script
- `scripts/expansion-25c/b2-new.json` — B2 new entry data
- `scripts/expansion-25c/c1-new.json` — C1 new entry data
- `scripts/expansion-25c/fsp-new.json` — FSP new entry data

## Files Modified
- `src/data/germanVocabulary.json` — B2 + C1 entries appended
- `src/data/fspVocabulary.json` — FSP entries appended

## Commit
- Hash: _(generated at commit time)_
- Branch: `vocab-import-pipeline`
- Deployed to GitHub Pages after commit
