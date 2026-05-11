# deutsch-klinik-german-content

German language content quality, FSP medical terminology, and orthography validation.

## When to Use

Use this skill when:
- Adding or editing German content (lesson texts, exercises, questions)
- Adding FSP medical terminology
- Checking German grammar accuracy in lessons
- Validating articles, plurals, and gender
- Running orthography checks
- Ensuring CEFR level appropriateness
- Reviewing writing/speaking prompts for clarity

## Files to Inspect

- `data/germanVocabulary.js` or similar — vocabulary word data (articles, plurals, POS, countability)
- `data/germanLessons.js` or similar — lesson content (dialogues, explanations, examples)
- `data/germanGrammar.js` or similar — grammar explanations and exercises
- `data/germanReading.js` or similar — reading passages
- `data/germanListening.js` or similar — listening scripts
- `data/fsp*.js` or `data/medical*.js` — FSP-specific content (anamnese, cases, presentations)
- `data/curriculumMap.js` or similar — lesson-to-concept mapping
- `scripts/validate-orthography.mjs` — German spelling validator
- `scripts/check-fsp-quality.mjs` — FSP content quality checks

## Required Checks

### 1. German Orthography
Run the orthography validator and review ALL reported issues, not just new ones:
```
node scripts/validate-orthography.mjs
```
Known pre-existing issues (false positives from technical terms, names, abbreviations) should be documented.

### 2. Articles and Gender
Every German noun in vocabulary data must have:
- Correct article (der/die/das)
- Correct plural form
- Correct gender assignment

### 3. Countability and POS
- Countable/uncountable flags should be accurate
- Part of speech (POS) tags should match actual usage

### 4. CEFR Appropriateness
- Content tagged A1 should be basic, high-frequency vocabulary
- Content tagged B2+ can include complex grammar and medical terms
- FSP content at low levels should still use appropriate medical context

### 5. FSP Medical Terminology
- Medical terms should be accurate for clinical German
- Anamnese questions should reflect real doctor-patient interactions
- Case presentations should use correct medical vocabulary
- No anglicisms where standard German medical terms exist

### 6. Grammar Explanations
- Grammar rules should be accurate for standard German
- Examples should match the rule they illustrate
- No contradictory rule statements

### 7. Writing/Speaking Prompts
- Prompts should be clear and unambiguous
- Expected output should be reasonable for the CEFR level
- Medical scenarios should be clinically realistic

### 8. Mistake Cards
- Mistake card context should match the original exercise
- Corrections should be grammatically accurate

## Commands to Run

```bash
cd deutsch-klinik
node scripts/validate-orthography.mjs
node scripts/check-fsp-quality.mjs
npm run build
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|------|
| Orthography flagged spelling | Valid false positive (name, tech term, Latin) | Add to exclude list or ignore |
| FSP quality check fails | Missing medical term, incomplete anamnese question | Fix the flagged content |
| Grammar rule contradicts itself | Copy-paste from different level | Rewrite for consistency |
| Wrong article on noun | Data entry error | Fix der/die/das |
| Plural missing | New word added without plural | Add plural form |
| Prompt unclear for CEFR level | CEFR tag wrong or prompt too complex | Adjust prompt or tag |

## Final Report Format

```
## German Content Audit

| Check | Status |
|-------|--------|
| Orthography | PASS/FAIL (N pre-existing, N new) |
| FSP quality | PASS/FAIL |
| Articles/gender | PASS/FAIL |
| CEFR appropriateness | PASS/FAIL |
| Grammar accuracy | PASS/FAIL |

## New Issues Found
- [only report issues introduced since last audit]

## Pre-existing Known Issues
- [documented false positives]
```