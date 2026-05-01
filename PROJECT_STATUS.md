# Deutsch Klinik - Project Status

## 1. Project Identity

- **Project name:** Deutsch Klinik
- **Live URL:** https://hosxam.github.io/deutsch-klinik
- **Repo:** `hosxam/deutsch-klinik` on GitHub
- **Framework:** React + Vite 8 (Rolldown bundler)
- **Deployment method:** `npm run deploy` (vite build + gh-pages push)
- **Route note:** Dashboard is at `#/`, not `#/dashboard`. Navigating to `#/dashboard` gives a 404-style "No routes matched" warning (harmless, just a wrong hash).
- **Workspace path:** `C:\Users\ASUS\.openclaw\workspace\deutsch-klinik`

## 2. Current Completed State

### A1 (Complete)
| Area | Count |
|------|-------|
| Lessons | 25 |
| Vocabulary | 497 clean unique words |
| Grammar | 200 exercises |
| Reading | 50 exercises |
| Listening | 50 exercises |
| Writing | 50 prompts |
| Speaking | 50 prompts |
| Exams | 5 full Goethe-style practice exams |

### A2 (Complete)
| Area | Count |
|------|-------|
| Lessons | 25 |
| Vocabulary | 500 clean unique words |
| Grammar | 200 exercises |
| Reading | 53 exercises |
| Listening | 50 exercises |
| Writing | 50 prompts |
| Speaking | 70 prompts |
| Exams | 5 full Goethe-style practice exams |

### B1 (Partially Complete)
| Area | Count | Status |
|------|-------|--------|
| Lessons | 25 | Done |
| Vocabulary | 679 | Done |
| Grammar | 250 | Done |
| Reading | 60 | Done |
| Listening | 60 | Done |
| Writing | 50 | Done |
| Speaking | 50 | Done |
| Exams | 1 dict | Incomplete, needs 5 |

### B2 (Placeholder)
All content is original shell/fake data. Needs full expansion.

### C1 (Placeholder)
All content is original shell/fake data. Needs full expansion.

## 3. Major Bugs Fixed

| Bug | File(s) | Fix |
|-----|---------|-----|
| GrammarPage crash: `style={s.tag}` passed function instead of object | `GrammarPage.jsx:141` | Changed to `style={s.tag()}` |
| VocabularyPage crash: `.filter()` on dict (germanVocabulary.json is `{A1:[],...}` not `[]`) | `VocabularyPage.jsx:10` | Changed to `(vocabData[levelId] || [])` |
| ResourcesPage crash: expected `{categories: [...]}` but got flat array | `ResourcesPage.jsx` (import) | Added `Array.isArray()` wrapper |
| Double UTF-8 encoding corruption in German chars | `grammar.json`, `reading.json`, `listening.json`, `writing.json` | Byte-level hex replacement (C3 83 C3 BC -> C3 BC etc.) |
| ~419 fake duplicate vocab entries (style labels like "Hallo (colloquial)") | `germanVocabulary.json` | Replaced via batch scripts with 497 real unique words |
| 10 duplicate grammar prompts in A1 | `grammar.json` A1 section | Replaced with unique exercises |
| Missing explanation in A1_gr_18 | `grammar.json` | Added explanation field |
| 3 pre-existing missing `level` fields in listening data | `listening.json` | Filled in |

## 4. Data Quality Rules

These are strict and must be followed for all future content generation:

- **No fake labels**: Never use parenthetical variants like "Hallo (colloquial)", "Hallo (formal)", "(written)", "(spoken)", "(regional)", "(literary)", "(common)", "(basic)"
- **No duplicate normalized words**: Run duplicate normalization check after every batch
- **Nouns require article**: `der`/`die`/`das` for all nouns
- **Countable nouns require plural**: Must provide plural form
- **Uncountable nouns use `plural: null`**: Grain, rice, weather, music, sports, etc.
- **Non-nouns use `article: null` and `plural: null`**: Verbs, adjectives, adverbs, prepositions, etc.
- **Verbs must be infinitive form**: "gehen", not "geht" or "ging"
- **Every entry should have `example` and `exampleTranslation`**: Realistic, grammatically correct A1-appropriate sentences
- **Lesson IDs must be valid**: Every `lessonId` must point to an existing lesson (A1_lesson_1 through A1_lesson_25 for A1)
- **Use real JSON `null`**: Never the string `"null"`
- **UTF-8 encoding**: All files use UTF-8 with `ensure_ascii=False`. German characters ä, ö, ü, Ä, Ö, Ü, ß must be preserved as actual Unicode characters

## 5. Current App Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Daily study plan with today's tasks, streak counter, weekly chart, daily checklist |
| **Level Locking** | Progress-based unlock system; each level requires completing previous level's requirements |
| **Lessons** | 25 per level, structured curriculum with lesson viewer |
| **Vocabulary Flashcards** | Paginated word list with Show Answer, quiz mode, SM-2 spaced repetition |
| **Grammar Exercises** | Topic-filtered MCQ exercises with explanations |
| **Reading Exercises** | Goethe-style texts with comprehension questions (MCQ + true-false) |
| **Listening Exercises** | TTS-based audio playback with voice selector, comprehension questions |
| **Writing Prompts** | Timed writing with rubric, AI correction copy-to-clipboard button |
| **Speaking Prompts** | Timed speaking with preparation phase, tip section, useful phrases |
| **Exams** | Multi-exam support for A1 (5 exams), exam selector screen with Lesen/Hören/Schreiben/Sprechen sections |
| **Mistake Notebook** | Filterable by skill/level, mark mastered, SM-2 spaced review |
| **Resources** | 18 external links across 6 categories (Goethe, DW, VHS, vocab, medical, testing) |
| **Medical German** | Topic-specific medical vocabulary and practice |
| **C1 Readiness** | Self-assessment for Goethe C1 exam readiness |

## 6. Files That Matter

### Data Files (src/data/)

| File | Format | Description |
|------|--------|-------------|
| `germanVocabulary.json` | Object: `{A1: [...], A2: [...], ...}` | All vocabulary by level. Each entry has: id, word, article, plural, translation, partOfSpeech, topic, example, exampleTranslation, lessonId, tags |
| `grammar.json` | Object: `{A1: [...], A2: [...], ...}` | Grammar exercises by level. Each entry has: id, prompt, answer, explanation, topic, options (if MCQ) |
| `germanLessons.json` | Flat array (not per-level) | 125 lessons total. Each has: id, level, unit, unitIndex, title, description, objectives, content sections |
| `reading.json` | Object: `{A1: [...], A2: [...], ...}` | Reading passages by level. Each has: id, level, title, text, questions array (with id, type, question, options?, answer, explanation), lessonId |
| `listening.json` | Object: `{A1: [...], A2: [...], ...}` | Listening scripts by level. Each has: id, level, title, script, questions (with id, type, question, options, answer), lessonId |
| `writing.json` | Object: `{A1: [...], A2: [...], ...}` | Writing prompts by level. Each has: id, title, prompt, instructions, wordLimit, tips, rubric, rubricKeys, lessonId |
| `speaking.json` | Object: `{A1: [...], A2: [...], ...}` | Speaking prompts by level. Each has: id, title, prompt, prepTime, talkTime, instructions, tips, usefulPhrases |
| `exams.json` | Object: `{A1: [exam1, exam2, ...], A2: [exam1, exam2, ...], B1: {...}, ...}` | A1 + A2 are arrays of 5 exam dicts each (multi-exam). B1-C1 are single dicts. Each exam has: Lesen, Hören, Schreiben, Sprechen sections with tasks and rubrics |
| `resources.json` | Flat array | 18 external resource links with category, title, url, description |
| `levels.json` | Object: `{A1: {...}, A2: {...}, ...}` | Level metadata with requirements for unlocking exams |

### Page Components (src/pages/)

| File | Description |
|------|-------------|
| `Dashboard.jsx` | Home page with study plan, streak, progress overview |
| `LevelPage.jsx` | Level landing page with links to all skill areas |
| `LessonsPage.jsx` | Lesson list grouped by unit |
| `LessonDetailPage.jsx` | Individual lesson viewer |
| `VocabularyPage.jsx` | Word list with flashcards (accesses `vocabData[levelId]`) |
| `GrammarPage.jsx` | MCQ grammar practice (uses `style={s.tag()}` pattern) |
| `ReadingPage.jsx` | Reading passages with questions |
| `ListeningPage.jsx` | TTS audio with comprehension (uses SpeechSynthesis API) |
| `WritingPage.jsx` | Timed writing with rubric |
| `SpeakingPage.jsx` | Timed speaking with preparation phase |
| `ExamPage.jsx` | Full exam with Lesen/Hören/Schreiben/Sprechen sections. Detects multi-exam via `Array.isArray()` |
| `ResourcesPage.jsx` | External links categorized |
| `MistakeNotebookPage.jsx` | Mistake review with skill/level filters |
| `MedicalPage.jsx` | Medical German topics |
| `C1ReadinessPage.jsx` | C1 exam readiness self-assessment |

### Other Key Files

| File | Description |
|------|-------------|
| `src/App.jsx` | Main app with route definitions |
| `src/components/LevelLock.jsx` | Level locking wrapper component |
| `src/components/Layout.jsx` | App shell with navigation |
| `src/utils/store.js` | LocalStorage state management |
| `vite.config.js` | Vite build config (monolithic bundle, no code splitting) |

## 7. Build / Deploy Status

- **Last confirmed build:** Passed
- **Latest bundle hash:** `index-D0MTcZ4L.js`
- **Bundle size:** ~2,222 KB JS / 510 KB gzipped
- **Deployment method:** `npm run deploy` (builds then pushes dist/ to gh-pages branch)
- **CDN caveat:** GitHub Pages CDN may take 1-2 minutes to propagate new bundle. Hard refresh (Ctrl+F5) usually resolves stale cache.
- **No code splitting:** Monolithic bundle kept intentionally; Vite 8 Rolldown chunk hash mismatches caused 404 errors on GitHub Pages during code-split attempt.
- **Build command:** `npx vite build`

## 8. Cleanup Status

- **Temporary Python/JS scripts in project root:** DELETED (all `_prefix` and `check_*` files removed)
- **Scripts directory preserved:** Tools in `scripts/` remain (batch generators, audit tools, format validators)
- **Backup chain files (`.pre_batch`, `.batch2`-`.batch7`):** May still exist. These are backup snapshots of germanVocabulary.json at various stages. Do not delete unless intentionally cleaning backups.
- **No other cleanup needed**

## 9. B1 Details (as of 2026-05-01)

### B1 Incomplete Items
- **Exams:** 1 dict (needs expansion to 5 full practice exams)

### B1 Vocabulary
- **Total entries:** 679
- **Unique normalized:** 679 (no duplicates)
- **Missing required fields:** 0
- **Bad lessonIds:** 0
- **Encoding errors:** 0

### B1 Grammar
- **Exercises:** 250
- **Duplicate IDs:** 0

### B1 Reading
- **Exercises:** 60
- **Duplicate IDs:** 0
- **Missing answers:** 0
- **Broken lessonIds:** 0

### B1 Listening
- **Exercises:** 60
- **Duplicate IDs:** 0
- **Missing answers:** 0

### B1 Writing
- **Prompts:** 50
- **Duplicate IDs:** 0

### B1 Speaking
- **Prompts:** 50
- **Duplicate IDs:** 0
