/**
 * validate-vocab-metadata.cjs
 *
 * Validates vocabulary metadata quality after Phase 25A cleanup.
 * Distinguishes errors (structurally wrong) from warnings (needs review).
 *
 * Usage: node scripts/validate-vocab-metadata.cjs
 * Exit code: 0 = all pass, 1 = errors found
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const vocPath = path.join(dataDir, 'germanVocabulary.json');
const fspPath = path.join(dataDir, 'fspVocabulary.json');

const VALID_POS = new Set([
  'noun', 'verb', 'adjective', 'adverb', 'phrase', 'preposition',
  'conjunction', 'pronoun', 'article', 'expression', 'other',
  'question-word', 'modal-verb'
]);

const VALID_ARTICLES = new Set(['der', 'die', 'das']);

const voc = JSON.parse(fs.readFileSync(vocPath, 'utf8'));
const fspRaw = JSON.parse(fs.readFileSync(fspPath, 'utf8'));
const fspArr = Array.isArray(fspRaw) ? fspRaw : Object.values(fspRaw).filter(e => e && typeof e === 'object');

let errors = 0;
let warnings = 0;

function error(msg, id, word) {
  errors++;
  console.log(`  ERROR: ${msg} [${id}] ${word || ''}`);
}

function warn(msg, id, word) {
  warnings++;
  console.log(`  WARN:  ${msg} [${id}] ${word || ''}`);
}

function isPlaceholderText(s) {
  if (!s || typeof s !== 'string') return false;
  return (s.includes(' ') && s.length > 12) || s === 'Law' || s === 'Psychology';
}

console.log('=== VOCABULARY METADATA VALIDATOR ===\n');

// ====== Check 1: Bad partOfSpeech ======
console.log('--- Check 1: Valid partOfSpeech ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    const pos = e.partOfSpeech || '';
    if (!pos || pos === '') {
      error(`Missing partOfSpeech`, e.id, e.word);
    } else if (!VALID_POS.has(pos)) {
      if (isPlaceholderText(pos)) {
        error(`partOfSpeech contains example text: "${pos.substring(0, 40)}..."`, e.id, e.word);
      } else {
        error(`Invalid partOfSpeech: "${pos}"`, e.id, e.word);
      }
    }
  });
});

// FSP check
fspArr.forEach(e => {
  const pos = e.partOfSpeech || '';
  if (!pos || pos === 'unknown' || pos === '') {
    error(`Missing partOfSpeech`, e.id, e.word);
  } else if (!VALID_POS.has(pos)) {
    error(`Invalid partOfSpeech: "${pos}"`, e.id, e.word);
  }
});

// ====== Check 2: Missing article for nouns ======
console.log('\n--- Check 2: Article for nouns ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (e.partOfSpeech === 'noun') {
      if (!e.article || e.article === '' || e.article === 'article') {
        warn(`Noun missing article: "${e.word}"`, e.id, e.word);
      } else if (!VALID_ARTICLES.has(e.article)) {
        warn(`Non-standard article: "${e.article}" for word "${e.word}"`, e.id, e.word);
      }
    }
  });
});

fspArr.forEach(e => {
  if (e.partOfSpeech === 'noun') {
    if (!e.article || e.article === '' || e.article === 'article') {
      warn(`FSP noun missing article: "${e.word}"`, e.id, e.word);
    } else if (!VALID_ARTICLES.has(e.article)) {
      warn(`FSP non-standard article: "${e.article}"`, e.id, e.word);
    }
  }
});

// ====== Check 3: Missing plural for nouns ======
console.log('\n--- Check 3: Plural for nouns ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (e.partOfSpeech === 'noun') {
      if (!e.plural || e.plural === '' || e.plural === 'plural') {
        warn(`Noun missing plural: "${e.word}"`, e.id, e.word);
      }
    }
  });
});

fspArr.forEach(e => {
  if (e.partOfSpeech === 'noun') {
    if (!e.plural || e.plural === '' || e.plural === 'plural') {
      warn(`FSP noun missing plural: "${e.word}"`, e.id, e.word);
    }
  }
});

// ====== Check 4: Missing topic ======
console.log('\n--- Check 4: Topic field ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (!e.topic || e.topic === '') {
      warn(`Missing topic`, e.id, e.word);
    }
  });
});

fspArr.forEach(e => {
  if (!e.topic || e.topic === '') {
    warn(`FSP missing topic`, e.id, e.word);
  }
});

// ====== Check 5: Missing taughtInLessonId ======
console.log('\n--- Check 5: taughtInLessonId ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (!e.taughtInLessonId && !e.lessonId) {
      warn(`Missing taughtInLessonId and lessonId`, e.id, e.word);
    } else if (!e.taughtInLessonId && e.lessonId) {
      warn(`Missing taughtInLessonId (has lessonId: "${e.lessonId}")`, e.id, e.word);
    }
  });
});

// ====== Check 6: Missing example ======
console.log('\n--- Check 6: Example sentences ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (!e.example || e.example === '') {
      warn(`Missing example sentence`, e.id, e.word);
    }
  });
});

fspArr.forEach(e => {
  if (!e.example || e.example === '') {
    warn(`FSP missing example sentence`, e.id, e.word);
  }
});

// ====== Check 7: Missing conceptId ======
console.log('\n--- Check 7: conceptId ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  items.forEach(e => {
    if (!e.conceptId || e.conceptId === '') {
      warn(`Missing conceptId`, e.id, e.word);
    }
  });
});

// ====== Check 8: Duplicates (same level, same word) ======
console.log('\n--- Check 8: Duplicate words (within level) ---');
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl] || [];
  const seen = {};
  items.forEach(e => {
    const word = (e.word || '').toLowerCase().trim();
    if (word) {
      if (seen[word]) {
        warn(`Duplicate word "${e.word}" (also ${seen[word]})`, e.id, e.word);
      }
      seen[word] = e.id;
    }
  });
});

// FSP duplicates
const fspSeen = {};
fspArr.forEach(e => {
  const word = (e.word || '').toLowerCase().trim();
  if (word) {
    if (fspSeen[word]) {
      warn(`FSP duplicate word "${e.word}" (also ${fspSeen[word]})`, e.id, e.word);
    }
    fspSeen[word] = e.id;
  }
});

// ====== Check 9: FSP missing medical category ======
console.log('\n--- Check 9: FSP medical category ---');
fspArr.forEach(e => {
  if (!e.category || e.category === '') {
    warn(`FSP missing medical category`, e.id, e.word);
  }
});

// ====== Summary ======
console.log(`\n=== RESULTS ===`);
console.log(`Errors:   ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.log(`\n❌ FAILED: ${errors} error(s) found. Fix before commit.`);
  process.exit(1);
} else {
  console.log(`\n✅ PASSED (with ${warnings} warnings)`);
  process.exit(0);
}
