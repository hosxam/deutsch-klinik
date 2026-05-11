# Local OpenClaw Skills Report

Created 2026-05-11 for the deutsch-klinik project.

## Files Created

| Skill | Path | Purpose |
|-------|------|---------|
| QA | `skills/deutsch-klinik-qa/SKILL.md` | Build, lint, test, validator, console error checks |
| Supabase | `skills/deutsch-klinik-supabase/SKILL.md` | Auth, sync, cross-device safety, cloud-state merge |
| Curriculum | `skills/deutsch-klinik-curriculum/SKILL.md` | Curriculum map, teach-before-test, exam unlock |
| German Content | `skills/deutsch-klinik-german-content/SKILL.md` | Orthography, FSP quality, articles, CEFR level, grammar accuracy |
| Performance | `skills/deutsch-klinik-performance/SKILL.md` | Bundle size, lazy loading, dead code, duplicate data |

## How to Invoke Each Skill

In future tasks, include the skill name in your prompt to trigger the correct SKILL.md:

### QA Task
```
Use skills/deutsch-klinik-qa. I changed X files. Run QA checks.
```

### Supabase Task
```
Use skills/deutsch-klinik-supabase. I modified sync logic. Check for overwrite risks.
```

### Curriculum Task
```
Use skills/deutsch-klinik-curriculum. I added a new lesson. Validate curriculum integrity.
```

### German Content Task
```
Use skills/deutsch-klinik-german-content. I updated FSP vocabulary. Run orthography and quality checks.
```

### Performance Task
```
Use skills/deutsch-klinik-performance. Audit bundle sizes and suggest lazy loading improvements.
```

## Structure

Each SKILL.md contains:
- **When to Use** — what triggers the skill
- **Files to Inspect** — full list of relevant source files
- **Required Checks** — step-by-step verification tasks
- **Commands to Run** — exact shell commands
- **Common Failure Modes** — symptom/cause/fix table
- **Final Report Format** — template for audit output

## Relationship to Existing Docs

These skills live alongside the existing `docs/` directory:
- `docs/PHASE32_ADAPTIVE_PLAN_AUDIT.md` — Phase 32 technical audit
- `docs/PHASE32_ADAPTIVE_PLAN_FINAL_REPORT.md` — Phase 32 final report
- `docs/PHASE31B_VOCAB_MISTAKE_AND_SYNC_AUDIT.md` — Phase 31B audit
- `docs/PHASE31B_VOCAB_MISTAKE_AND_SYNC_FINAL_REPORT.md` — Phase 31B final report
- `docs/TODAYS_PLAN_LISTENING_AUDIO_MISMATCH_AUDIT.md` — Phase 33 bug audit
- `docs/TODAYS_PLAN_LISTENING_AUDIO_MISMATCH_FIX_REPORT.md` — Phase 33 fix report

Skills automate the QA checklist; docs provide the detailed technical history.

## Coverage

| Concern | Handled By |
|---------|-----------|
| Build succeeds | deutsch-klinik-qa |
| No lint errors | deutsch-klinik-qa |
| Tests pass | deutsch-klinik-qa |
| Validators pass | deutsch-klinik-qa, deutsch-klinik-german-content |
| No console errors | deutsch-klinik-qa |
| Auth/sync safety | deutsch-klinik-supabase |
| Cross-device merge | deutsch-klinik-supabase |
| Teach-before-test | deutsch-klinik-curriculum |
| Exam unlock | deutsch-klinik-curriculum |
| Daily plan content | deutsch-klinik-curriculum |
| German orthography | deutsch-klinik-german-content |
| FSP quality | deutsch-klinik-german-content |
| Bundle size | deutsch-klinik-performance |
| Lazy loading | deutsch-klinik-performance |
| Dead code | deutsch-klinik-performance |

No app files were modified. No dependencies were added. No third-party skills were installed.
