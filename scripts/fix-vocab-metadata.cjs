/**
 * fix-vocab-metadata.cjs
 *
 * Deterministic, idempotent metadata cleanup for deutsch-klinik vocabulary.
 *
 * Fixes:
 *   1. Dummy article values ("article") cleared to ""
 *   2. Bad partOfSpeech containing example text -> restored via word-based classification
 *   3. Placeholder plurals "plural" -> cleared to ""
 *   4. FSP vocabulary: POS inferred from article/word, topic from category
 *   5. C1 missing taughtInLessonId -> copy from lessonId
 *   6. A1 "modal verb" -> "modal-verb"
 *
 * Does NOT:
 *   - Guess uncertain articles/plurals
 *   - Delete entries
 *   - Modify lessonId, conceptId, or SRS-related fields
 *
 * Usage: node scripts/fix-vocab-metadata.cjs
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const vocPath = path.join(dataDir, 'germanVocabulary.json');
const fspPath = path.join(dataDir, 'fspVocabulary.json');

const voc = JSON.parse(fs.readFileSync(vocPath, 'utf8'));
const fspRaw = JSON.parse(fs.readFileSync(fspPath, 'utf8'));
const fspArr = Array.isArray(fspRaw) ? fspRaw : Object.values(fspRaw).filter(e => e && typeof e === 'object');

const report = {};

// ====== COMPREHENSIVE WORD CLASSIFICATION ======
// These override any heuristic - definitive POS for known German words
const KNOWN_WORDS = {
  // Adverbs
  'heute': 'adverb', 'hier': 'adverb', 'da': 'adverb', 'dort': 'adverb',
  'links': 'adverb', 'rechts': 'adverb', 'oben': 'adverb', 'unten': 'adverb',
  'vorn': 'adverb', 'hinten': 'adverb', 'gerne': 'adverb', 'gern': 'adverb',
  'sofort': 'adverb', 'bald': 'adverb', 'später': 'adverb', 'früher': 'adverb',
  'immer': 'adverb', 'nie': 'adverb', 'niemals': 'adverb', 'manchmal': 'adverb',
  'oft': 'adverb', 'häufig': 'adverb', 'selten': 'adverb', 'schon': 'adverb',
  'noch': 'adverb', 'wieder': 'adverb', 'vielleicht': 'adverb', 'natürlich': 'adverb',
  'leider': 'adverb', 'hoffentlich': 'adverb', 'etwa': 'adverb', 'ungefähr': 'adverb',
  'kaum': 'adverb', 'zwar': 'adverb', 'weiter': 'adverb', 'deshalb': 'adverb',
  'deswegen': 'adverb', 'trotzdem': 'adverb', 'außerdem': 'adverb', 'allerdings': 'adverb',
  'jedenfalls': 'adverb', 'jeweils': 'adverb', 'überhaupt': 'adverb', 'eigentlich': 'adverb',
  'nämlich': 'adverb', 'zusammen': 'adverb', 'lange': 'adverb', 'lang': 'adverb',
  'leise': 'adverb', 'nur': 'adverb', 'nein': 'adverb', 'dann': 'adverb',
  'denn': 'conjunction', 'davor': 'adverb', 'danach': 'adverb', 'dort': 'adverb',
  'endlich': 'adverb', 'fast': 'adverb', 'ganz': 'adverb', 'gar': 'adverb',
  'genau': 'adverb', 'nochmal': 'adverb', 'recht': 'adverb', 'sehr': 'adverb',
  'sogar': 'adverb', 'ziemlich': 'adverb',
  // Adjectives
  'hungrig': 'adjective', 'müde': 'adjective', 'krank': 'adjective', 'klar': 'adjective',
  'kaputt': 'adjective', 'hart': 'adjective', 'hell': 'adjective', 'hoch': 'adjective',
  'kalt': 'adjective', 'kurz': 'adjective', 'niedrig': 'adjective', 'möglich': 'adjective',
  'nötig': 'adjective', 'langweilig': 'adjective', 'leicht': 'adjective', 'kompliziert': 'adjective',
  'normal': 'adjective', 'schwer': 'adjective', 'lieb': 'adjective', 'warm': 'adjective',
  'langsam': 'adjective', 'laut': 'adjective', 'hell': 'adjective', 'nahe': 'adjective',
  'neu': 'adjective', 'gut': 'adjective', 'schlecht': 'adjective', 'groß': 'adjective',
  'klein': 'adjective', 'schnell': 'adjective', 'früh': 'adjective', 'spät': 'adjective',
  'alt': 'adjective', 'jung': 'adjective', 'billig': 'adjective', 'teuer': 'adjective',
  'richtig': 'adjective', 'falsch': 'adjective', 'einfach': 'adjective', 'schwierig': 'adjective',
  'wichtig': 'adjective', 'froh': 'adjective', 'dankbar': 'adjective', 'sicher': 'adjective',
  'gefährlich': 'adjective', 'bekannt': 'adjective', 'beliebt': 'adjective',
  'fleißig': 'adjective', 'klug': 'adjective', 'mutig': 'adjective', 'ehrlich': 'adjective',
  'freundlich': 'adjective', 'höflich': 'adjective', 'praktisch': 'adjective',
  'gründlich': 'adjective', 'sorgfältig': 'adjective', 'vorsichtig': 'adjective',
  'persönlich': 'adjective', 'allgemein': 'adjective', 'positiv': 'adjective', 'negativ': 'adjective',
  'typisch': 'adjective', 'verantwortlich': 'adjective', 'logisch': 'adjective',
  'regelmäßig': 'adjective', 'notwendig': 'adjective', 'ausreichend': 'adjective',
  'ähnlich': 'adjective', 'unterschiedlich': 'adjective', 'verschieden': 'adjective',
  'gewöhnlich': 'adjective', 'vergangen': 'adjective', 'zukünftig': 'adjective',
  'wahrscheinlich': 'adjective', 'tatsächlich': 'adjective',
  // Pronouns
  'man': 'pronoun', 'jemand': 'pronoun', 'niemand': 'pronoun', 'keiner': 'pronoun',
  'alle': 'pronoun', 'beide': 'pronoun', 'nichts': 'pronoun', 'etwas': 'pronoun',
  // Prepositions
  'neben': 'preposition',
  // Conjunctions/Connectors
  'jedoch': 'conjunction', 'deshalb': 'adverb', 'deswegen': 'adverb',
  'trotzdem': 'adverb', 'allerdings': 'adverb',
  // Articles
  'kein': 'article', 'mein': 'article', 'dein': 'article', 'sein': 'article',
  'ihr': 'article', 'unser': 'article', 'euer': 'article',
  // Question words
  'wer': 'question-word', 'was': 'question-word', 'wann': 'question-word',
  'wo': 'question-word', 'wohin': 'question-word', 'woher': 'question-word',
  'warum': 'question-word', 'weshalb': 'question-word', 'wieso': 'question-word',
  'wie': 'question-word', 'welch': 'question-word',
  // Special: 'halb' = adjective (die Hälfte is noun, halb is adjective)
  'halb': 'adjective',
};

function isBadPOSField(s) {
  if (!s || typeof s !== 'string') return false;
  return (s.includes(' ') && s.length > 12) || s === 'Law' || s === 'Psychology';
}

function classifyWord(word) {
  if (!word || typeof word !== 'string') return 'verb';
  const w = word.toLowerCase().trim();

  // Check known words first
  if (KNOWN_WORDS[w]) return KNOWN_WORDS[w];

  // Verb detection
  if (w.endsWith('en') || w.endsWith('eln') || w.endsWith('ern') || w.endsWith('ieren')) return 'verb';

  // Adjective endings
  if (w.endsWith('lich') || w.endsWith('ig') || w.endsWith('bar') ||
      w.endsWith('sam') || w.endsWith('haft') || w.endsWith('los') ||
      w.endsWith('abel') || w.endsWith('ibel')) return 'adjective';

  // Starts with article
  const firstWord = w.split(' ')[0];
  if (['der', 'die', 'das'].includes(firstWord)) return 'noun';

  // Numbers
  if (/^(ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|hundert|tausend)$/.test(w)) return 'other';

  return 'verb'; // default
}

// ====== FIX 1: Clear dummy articles ======
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl];
  report[lvl] = { dummyArtCleared: 0, badPOSFixed: 0, plCleared: 0, modalFixed: 0, tilFilled: 0 };
  items.forEach(e => {
    if (e.article === 'article' || e.article === 'Article' || e.article === 'Artikel') {
      e.article = '';
      report[lvl].dummyArtCleared++;
    }
  });
});

// ====== FIX 2: Fix bad partOfSpeech ======
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl];
  items.forEach(e => {
    const pos = e.partOfSpeech || '';

    if (isBadPOSField(pos)) {
      // Fix: classify by word
      const guessed = classifyWord(e.word);
      e.partOfSpeech = guessed;

      // Also check if word starts with article prefix that should be extracted
      if (e.word && typeof e.word === 'string') {
        const parts = e.word.split(' ');
        if (['der', 'die', 'das'].includes(parts[0]) && parts.length > 1) {
          e.article = parts[0];
          e.word = parts.slice(1).join(' ');
        }
      }
      report[lvl].badPOSFixed++;
    } else if (KNOWN_WORDS[(e.word || '').toLowerCase().trim()] && 
               KNOWN_WORDS[(e.word || '').toLowerCase().trim()] !== 'verb' &&
               KNOWN_WORDS[(e.word || '').toLowerCase().trim()] !== pos) {
      // Also fix if the word is in known words but POS doesn't match
      // Only if it's NOT a verb (verb is the conservative default from previous runs)
      const correct = KNOWN_WORDS[(e.word || '').toLowerCase().trim()];
      if (correct && correct !== pos) {
        e.partOfSpeech = correct;
        report[lvl].badPOSFixed++;
      }
    }
  });
});

// ====== FIX 3: Clear placeholder plurals ======
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl];
  items.forEach(e => {
    if (e.partOfSpeech === 'noun' && e.plural === 'plural') {
      e.plural = '';
      report[lvl].plCleared++;
    }
  });
});

// ====== FIX 4: Normalize modal-verb ======
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const items = voc[lvl];
  items.forEach(e => {
    if (e.partOfSpeech === 'modal verb') {
      e.partOfSpeech = 'modal-verb';
      report[lvl].modalFixed++;
    }
  });
});

// ====== FIX 5: Fill missing taughtInLessonId ======
['C1'].forEach(lvl => {
  const items = voc[lvl];
  items.forEach(e => {
    if (!e.taughtInLessonId && e.lessonId) {
      e.taughtInLessonId = e.lessonId;
      report[lvl].tilFilled++;
    }
  });
});

// ====== FIX 6: Do NOT auto-fix A1 missing plurals (need manual review) ======

// ====== FIX 7: FSP vocabulary ======
report.FSP = { posFixed: 0, topicFixed: 0, artExtracted: 0 };

fspArr.forEach(e => {
  // Fix partOfSpeech
  if (!e.partOfSpeech || e.partOfSpeech === 'unknown') {
    if (e.article && ['der', 'die', 'das'].includes(e.article)) {
      e.partOfSpeech = 'noun';
      report.FSP.posFixed++;
    } else if (e.word && typeof e.word === 'string') {
      const parts = e.word.split(' ');
      if (['der', 'die', 'das'].includes(parts[0]) && parts.length > 1) {
        e.article = parts[0];
        e.word = parts.slice(1).join(' ');
        e.partOfSpeech = 'noun';
        report.FSP.posFixed++;
        report.FSP.artExtracted++;
      } else {
        // Guess by word classification
        e.partOfSpeech = classifyWord(e.word);
        report.FSP.posFixed++;
      }
    } else {
      e.partOfSpeech = 'phrase';
      report.FSP.posFixed++;
    }
  }

  // Set topic from category
  if ((!e.topic || e.topic === '') && e.category) {
    e.topic = e.category;
    report.FSP.topicFixed++;
  }
});

// ====== WRITE ======
fs.writeFileSync(vocPath, JSON.stringify(voc, null, 2), 'utf8');
console.log('Wrote: ' + vocPath);
fs.writeFileSync(fspPath, JSON.stringify(fspRaw, null, 2), 'utf8');
console.log('Wrote: ' + fspPath);

// ====== REPORT ======
console.log('\n=== FIX REPORT ===');
let totalFixed = 0;
['A1', 'A2', 'B1', 'B2', 'C1'].forEach(lvl => {
  const s = report[lvl] || {};
  console.log(`--- ${lvl} ---`);
  if (s.dummyArtCleared) { console.log(`  Dummy articles cleared: ${s.dummyArtCleared}`); totalFixed += s.dummyArtCleared; }
  if (s.badPOSFixed) { console.log(`  Bad POS fixed: ${s.badPOSFixed}`); totalFixed += s.badPOSFixed; }
  if (s.plCleared) { console.log(`  Placeholder plurals cleared: ${s.plCleared}`); totalFixed += s.plCleared; }
  if (s.modalFixed) { console.log(`  Modal verb normalized: ${s.modalFixed}`); totalFixed += s.modalFixed; }
  if (s.tilFilled) { console.log(`  taughtInLessonId filled: ${s.tilFilled}`); totalFixed += s.tilFilled; }
});
console.log(`--- FSP ---`);
console.log(`  POS fixed: ${report.FSP.posFixed}`);
console.log(`  Topic fixed: ${report.FSP.topicFixed}`);
console.log(`  Articles extracted: ${report.FSP.artExtracted}`);
totalFixed += report.FSP.posFixed + report.FSP.topicFixed;
console.log(`\n=== TOTAL: ${totalFixed} changes ===`);
