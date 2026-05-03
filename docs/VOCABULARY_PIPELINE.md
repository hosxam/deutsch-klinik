# Vocabulary Pipeline

This document describes how vocabulary data flows through the Deutsch Klinik project. Follow this whenever you need to add, update, or inspect vocabulary words.

## Source of Truth

**`data/vocabulary_master.csv`** is the permanent, authoritative vocabulary source.

Columns:
```
id, level, word, article, plural, translation, example, partOfSpeech, topic, tags, lessonId
```

- `id`: Stable identifier (e.g. `A1_v001`, `B2_vocab_531`). Leave blank to auto-generate.
- `level`: One of `A1`, `A2`, `B1`, `B2`, `C1`.
- `word`: The German word (may include article prefix, e.g. `der Tisch`).
- `article`: Grammatical article (`der`/`die`/`das`) for nouns.
- `plural`: Plural form for nouns.
- `translation`: English translation.
- `example`: Example German sentence.
- `partOfSpeech`: e.g. `noun`, `verb`, `adjective`, `preposition`, `other`.
- `topic`: Semantic category (e.g. `Greetings`, `Family`, `Anatomy`).
- `tags`: Semicolon-separated tags (e.g. `a1;medical`).
- `lessonId`: Associated lesson identifier.

## Generated File

**`src/data/germanVocabulary.json`** is auto-generated from the CSV. Do not edit it manually. It is consumed by all React components.

Consuming pages:
- `VocabularyPage.jsx` -- browse, search, quiz mode
- `FlashcardPage.jsx` -- flashcard review
- `MistakeNotebookPage.jsx` -- review incorrect answers
- `Dashboard.jsx` -- progress overview

New words added to the CSV automatically appear in all of these after importing.

## Batch Import Workflow

To add new vocabulary:

### 1. Prepare the batch file

Place new rows in **`data/new_vocabulary_batch.csv`** with the same column format.

Rules:
- Only include new words. Do not duplicate existing entries.
- Leave the `id` column blank for auto-generation.
- Leave optional fields blank rather than inventing data.
- For nouns, provide `article` and `plural` if known.
- Use the correct A1-C1 level.
- Tags should be semicolon-separated (e.g. `a1;medical`).
- German umlauts (a, o, u, ß) are fully supported.

Do not paste thousands of words into chat messages. Use the CSV batch file only.

### 2. Run the merge

```bash
node scripts/mergeVocabularyBatch.cjs
```

This merges `new_vocabulary_batch.csv` into `vocabulary_master.csv`. Duplicate detection uses a normalized combination of level + German word (case-insensitive, article prefix stripped).

### 3. Regenerate the JSON

```bash
node scripts/importVocabulary.cjs
```

This reads `vocabulary_master.csv` and writes `src/data/germanVocabulary.json`. A backup of the previous JSON is saved as `src/data/germanVocabulary.pre-import-backup.json`.

### 4. Build

```bash
npm run build
```

Compiles the project so the new words are available in production.

## Duplicate Detection

When merging a batch, a row is skipped if its normalized level + German word already exists in the master CSV. Normalization means:
- Lowercased
- Whitespace collapsed
- Leading article (`der`/`die`/`das`) stripped for comparison

This prevents accidentally adding the same word twice at the same level.

## Scripts Reference

| Script | Purpose |
|---|---|
| `scripts/importVocabulary.cjs` | Reads CSV, writes `germanVocabulary.json`, creates backup |
| `scripts/mergeVocabularyBatch.cjs` | Merges new batch into master CSV with dedup |
| `data/vocabulary_master.csv` | Permanent master vocabulary |
| `data/new_vocabulary_batch.csv` | Temporary batch import file |

## Important

- Do not edit `src/data/germanVocabulary.json` by hand. It is always regenerated.
- Do not edit `data/vocabulary_master.csv` manually unless you know what you are doing. Use the batch import workflow.
- All existing IDs in the master CSV are preserved during merges.
- New rows without IDs get IDs in the `A1_vNNN` format, continuing from the highest existing ID for that level.

## Current Vocabulary Status (2026-05-03)

| Level | Count |
|-------|-------|
| A1    | 497   |
| A2    | 501   |
| B1    | 678   |
| B2    | 1,071 |
| C1    | 501   |
| **Total** | **3,248** |

### B2 Expansion
- Added 204 new B2 words to reach 1,071 (target was 1,034).
- Batch merge, import, and build all passed successfully.
- Vocabulary is added through CSV batch pipeline only.
- Do not manually edit `src/data/germanVocabulary.json`.

### Next Recommended Task
Expand C1 vocabulary next, but only after committing the current B2 work.
