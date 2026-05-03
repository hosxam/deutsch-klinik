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
- `PracticePage.jsx` -- article, plural, and fill-in-the-blank practice

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

## Vocabulary Practice Modes

Three practice modes are now available at:

**`src/pages/PracticePage.jsx`**

Route: `level/:levelId/vocabulary/practice`

Connected from the Practice button in `src/pages/VocabularyPage.jsx`.

All three modes generate questions directly from `src/data/germanVocabulary.json` at runtime. They do not use separate word lists or hardcoded datasets.

### 1. Article Practice
- Tests noun article knowledge (der/die/das).
- Shows the word, user taps one of three color-coded article buttons.
- Generates questions only from entries with a non-empty `article` field.
- Available: ~3,455 entries across A1-C1.

### 2. Plural Practice
- Tests plural form knowledge.
- Shows article + word, user types the plural form.
- Generates questions only from entries with a non-empty `plural` field.
- Accepts answers with or without the leading article.
- Available: ~2,481 entries across A1-C1.

### 3. Fill in the Blank
- Tests vocabulary in context.
- Shows a German sentence from the `example` field with the target word replaced by `_____`. User types the missing word.
- Generates questions only from entries with a real sentence example (not just `word: translation` format).
- Uses case-insensitive regex word-boundary matching to find the target word in the example sentence.
- Available: ~4,106 entries across A1-C1.

### Shared Features
- Level filter (A1-C1) with question count selector (10/20/30/50).
- Searchable topic filter: text input with dropdown that filters available topics by typed text. Selecting a topic refines all mode card counts and question generation.
- Topic selector supports full keyboard navigation: Arrow Down (next option), Arrow Up (previous option), Enter (select highlighted), Escape (close dropdown). Mouse hover also syncs with the highlighted option.
- Topic filter works with all three practice modes (Article, Plural, Fill in the Blank).
- Mode card counts update based on selected level and topic.
- Changing level resets topic to All topics.
- Per-question feedback (correct/incorrect with correct answer shown).
- Progress bar, score tracking, and hint panel.
- Results screen with mistake review (your answer vs. correct answer).
- Try Again to reshuffle and replay the same mode.
- Progress recorded via `recordVocabAnswer` and `updateLevelProgress` in `store.js`.
- Level-lock gated via `LevelLock` component.

### Current Limitations
- No spaced repetition scheduling -- only basic correct/incorrect tracking.
- Fill-in-the-blank uses simple regex word-boundary matching. May misidentify the blank target in edge cases (compound words, irregular inflections). Could be improved later with lemmatization or position-based detection.
- Article practice only tests der/die/das -- entries with other determiners are skipped.

## Important

- Do not edit `src/data/germanVocabulary.json` by hand. It is always regenerated.
- Do not edit `data/vocabulary_master.csv` manually unless you know what you are doing. Use the batch import workflow.
- All existing IDs in the master CSV are preserved during merges.
- New rows without IDs get IDs in the `A1_vNNN` format, continuing from the highest existing ID for that level.
- Practice modes should always use the central vocabulary data. Do not create separate article/plural/fill-in-the-blank datasets.

## Current Vocabulary Status (2026-05-03)

| Level | Count |
|-------|-------|
| A1    | 497   |
| A2    | 501   |
| B1    | 1,062 |
| B2    | 1,071 |
| C1    | 1,169 |
| **Total** | **4,300** |

### B2 Expansion
- Added 204 new B2 words to reach 1,071 (target was 1,034).
- Batch merge, import, and build all passed successfully.

### C1 Expansion
- Generated 683 candidates, added 668 new C1 words (15 duplicates skipped).
- C1 expanded from 501 to 1,169 (target was 1,000).
- Added broad coverage of academic, political, economic, and cultural vocabulary beyond the existing medical-heavy C1 set.

### B1 Expansion
- B1 expanded from 678 to 1,062 (target was 1,000).
- Generated 384 candidate words (A-Z coverage, batch file was built in multiple passes).
- All 384 were unique (0 duplicates with master).
- Batch merge, import, and build all passed successfully.

### Next Recommended Task
All levels now meet or exceed their targets. Vocabulary pipeline is complete for now. Consider:
- Expanding B1/B2 medical vocabulary for exam preparation
- Reviewing missing articles (748) and plurals (1,027) across all levels
- Adding lesson-specific words tied to remaining empty lessons
