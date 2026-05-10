# Phase 24: Vocabulary Expansion Plan

**Date:** 2026-05-10

## Current State

| Level | Current Count | Target Count | Gap |
|-------|--------------|--------------|-----|
| A1    | 803          | 800          | 0   |
| A2    | 501          | 600          | +99 |
| B1    | 1,062        | 1,800        | +738 |
| B2    | 1,071        | 2,000        | +929 |
| C1    | 1,169        | 2,000        | +831 |
| FSP   | 1,000        | 1,200        | +200 |
| **Total** | **5,606** | **8,400** | **+2,794** |

**Long-term target:** 10,000-12,000 entries

---

## 2. Expansion Priorities by Level

### A1 (803 -> 800)
No expansion needed. Focus on:
- Clean up stray part-of-speech annotations
- Ensure all 535 nouns have articles (1 missing) and plurals (98 missing)

### A2 (501 -> 600, +99)
Moderate expansion. Add:
- German life/admin vocabulary (forms, appointments, Anmeldung, banking basics)
- Food and restaurant vocabulary (menu items, ordering phrases, dietary needs)
- Transport vocabulary (tickets, signs, delays, announcements)
- Family and celebrations (family events, holidays, traditions)

### B1 (1,062 -> 1,800, +738) -- HIGH PRIORITY
Major expansion needed. Add:
- **Workplace German** (+150): job applications, interviews, contracts, meetings, emails
- **Health and medical** (+100): doctor visits, symptoms, pharmacy, insurance basics
- **Travel and transport** (+80): booking, itineraries, complaints, lost luggage
- **Technology and media** (+80): computer terms, social media, news, streaming
- **Housing and living** (+70): renting contracts, repairs, utilities, neighbors
- **German bureaucracy** (+60): authorities, forms, deadlines, certificates, registration
- **Environment** (+60): climate change, recycling, conservation, energy
- **Culture and society** (+60): politics basics, traditions, current events
- **Emotions and relationships** (+40): nuanced feelings, conflict, compromise
- **Cleanup required**: fix 267 missing articles, 285 missing plurals, fix POS data

### B2 (1,071 -> 2,000, +929) -- HIGH PRIORITY
Major expansion needed. Add:
- **Academic vocabulary** (+200): research methodology, academic writing verbs, essay connectors, argumentation structures, citation vocabulary
- **Professional communication** (+150): formal letters, presentations, negotiations, project management, reports
- **Formal register** (+130): official correspondence, complaints, legal terms, contracts, formal style
- **Science and technology** (+100): research terms, data analysis, statistics, IT infrastructure
- **Politics and society** (+100): political systems, social issues, policy debate, media analysis
- **Art and culture** (+60): literature analysis, music, film, exhibitions, philosophy
- **Finance and economics** (+60): markets, investments, taxes, accounting
- **Advanced daily life** (+60): customer service escalation, quality complaints, warranty claims
- **Emotions nuance** (+40): subtle emotional registers, sarcasm, irony, indirectness

### C1 (1,169 -> 2,000, +831) -- HIGH PRIORITY
Major expansion needed. Add:
- **Academic German** (+200): formal academic style, paper structure, academic vocabulary from humanities, social sciences, natural sciences
- **Formal writing** (+150): essay structure, formal connectors, nominal style, passive constructions, subjunctive II in formal contexts
- **Abstract concepts** (+100): philosophy, ethics, theories, models, paradigms
- **Literary German** (+80): literary analysis, metaphors, stylistic devices, interpretations
- **Media analysis** (+80): editorial vocabulary, opinion pieces, political commentary, media criticism
- **Advanced professional** (+80): management, strategy, corporate communication, expert-level presentations
- **Colloquial and idiomatic** (+60): authentic idioms, colloquial register, regional expressions
- **Fix metadata**: 335 missing articles, 457 missing plurals out of 1,109 nouns

### FSP (1,000 -> 1,200, +200)
- Add POS tagging to all 1,000 existing entries
- Add 200 additional clinical terms across:
  - Surgical procedures and instruments (+40)
  - Diagnostic procedures and imaging (+30)
  - Pharmacology and dosages (+40)
  - Patient communication (+40)
  - Medical documentation (+30)
  - Emergency medicine (+20)

---

## 3. Topic Targets for Expansion

| Topic | Current Est. | Target | Priority |
|-------|-------------|--------|----------|
| Academic vocabulary (B2/C1) | 100 | 600 | HIGH |
| Formal writing register (B2/C1) | 100 | 400 | HIGH |
| Medical/clinical (all levels) | 747 | 1,000 | HIGH |
| German life/admin (A2-B1) | 185 | 400 | HIGH |
| Workplace (B1-B2) | 200 | 400 | MEDIUM |
| Technology (B1-B2) | 100 | 250 | MEDIUM |
| Environment (B1-B2) | 80 | 200 | MEDIUM |
| Politics/society (B1-C1) | 150 | 350 | MEDIUM |
| Culture/arts (B1-C1) | 80 | 200 | LOW |
| Travel/transport (A2-B1) | 100 | 200 | LOW |
| Emotions/nuance (B1-C1) | 80 | 180 | LOW |

---

## 4. Entry Quality Requirements

Every new vocabulary entry MUST include:

### Required fields
- `id` -- unique identifier (e.g., `B2_v1201`)
- `word` -- German word/phrase
- `translation` -- English translation
- `level` -- A1, A2, B1, B2, C1
- `lessonId` -- which lesson teaches this word
- `partOfSpeech` -- noun, verb, adjective, adverb, preposition, conjunction, phrase, question-word, modal-verb, other
- `topic` -- granular topic category (see existing topic list)
- `article` -- (required for nouns, empty string for non-nouns)
- `plural` -- (required for nouns where plural exists, "plural" string if no plural form)
- `example` -- full German sentence demonstrating usage
- `exampleTranslation` -- English translation of example
- `tags` -- array of keywords for filtering (e.g., ["b2", "academic", "formal"])

### Strongly recommended
- `conceptId` -- links to curriculum concept (must match existing conceptId values)
- `taughtInLessonId` -- which lesson teaches this word (can differ from lessonId)
- `skillType` -- "vocabulary" (standard)
- `remediationLessonId` -- which lesson to revisit upon failure
- `studyNote` -- learning strategy hint
- `usageNote` -- grammatical or contextual usage guidance
- `pronunciationHint` -- pronunciation guidance for difficult words

---

## 5. Flashcard Card Type Generation

Each vocabulary entry generates flashcard cards for SRS study:

### Card Type 1: Meaning
- **Front:** German word
- **Back:** English translation + example sentence
- **Generated from:** `word`, `translation`, `example`

### Card Type 2: Article
- **Front:** German word (noun only)
- **Back:** Article (der/die/das) + word
- **Generated from:** `article`, `word`

### Card Type 3: Plural
- **Front:** "Plural of [word]"
- **Back:** Plural form
- **Generated from:** `word`, `plural`

### Card Type 4: Phrase/Collocation
- **Front:** German phrase with blank (e.g., "____ Termin vereinbaren")
- **Back:** Full phrase + translation
- **Generated from:** `example` using key collocation extraction

### Card Type 5: Example Recall (future)
- **Front:** English sentence
- **Back:** German translation
- **Generated from:** `exampleTranslation`, `example`

---

## 6. Validator Requirements

All new vocabulary must pass:

1. **Article validator**: Every noun must have a valid article (der/die/das)
2. **Plural validator**: Every noun must have a plural form or explicit "plural" marker
3. **Example validator**: Every entry must have an example sentence
4. **Topic validator**: Every entry must belong to at least one registered topic
5. **POS validator**: Must use one of the registered part-of-speech values
6. **Orthography validator**: German text must pass the orthography checker (correct ß/ss, lowercase/uppercase, umlauts, etc.)
7. **Concept validator**: conceptId must reference an existing curriculum concept
8. **Lesson validator**: taughtInLessonId must reference an existing lesson
9. **Duplicate checker**: No duplicate word+translation pairs within the same level

---

## 7. Import/Generation Strategy

### Phase 25A -- Metadata Fix (no new vocab)
- Fix B1 missing articles (267 nouns) and plurals (285)
- Fix C1 missing articles (335) and plurals (457)
- Fix B2 missing articles (93) and plurals (220)
- Fix B1 noisy POS data
- Add POS tagging to FSP entries (1,000 entries)
- Clean A1 stray POS annotations

### Phase 25B -- Script-based Expansion (automated generation)
- Write a vocabulary generation script using a word list + template
- Generate bulk entries for:
  - Academic vocabulary (400 entries)
  - Formal register (300 entries)
  - German life/admin (200 entries)
  - Workplace German (200 entries)
- Script auto-generates IDs, example sentences from templates, and assigns topics

### Phase 25C -- Curated Expansion (manual review)
- Manually review and improve auto-generated entries
- Add medical/clinical terms (200 entries)
- Add colloquial/idiomatic expressions (100 entries)
- Add literary/C1 advanced entries (200 entries)
- Ensure all entries pass validators

### Phase 25D -- Validation and Integration
- Run all validators on expanded vocabulary
- Create/update curriculum mappings for new conceptIds
- Ensure each vocabulary word is linked to at least one lesson
- Run flashcard generation and verify card types

---

## 8. Staged Rollout

| Stage | Content | Entries | Effort |
|-------|---------|---------|--------|
| Stage 1 | Metadata fix + POS cleanup | ~2,000 fixes | 1-2 days |
| Stage 2 | Script-generated academic + formal + admin | ~900 new | 1-2 days |
| Stage 3 | Curated medical + colloquial + literary | ~500 new | 2-3 days |
| Stage 4 | Validation + integration | All | 1 day |

**Total new entries:** ~2,800 (target 8,400 total)
**Long-term stretch:** 10,000-12,000 with further topic expansions
