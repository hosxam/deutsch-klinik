/**
 * add-vocab-expansion-25c.cjs
 *
 * Idempotent expansion script for Phase 25C.
 * Merges new B2, C1, and FSP vocabulary from data files into main vocab JSON.
 *
 * Usage: node scripts/add-vocab-expansion-25c.cjs
 *
 * Safety guarantees:
 * - Duplicate-safe: rejects entries whose normalized word already exists
 * - Preserves existing entries entirely
 * - Idempotent: safe to run multiple times
 * - Logs before/after counts
 */

const F = require('fs');
const P = require('path');

const DATA_DIR = P.join(__dirname, '..', 'src', 'data');
const VOC_PATH = P.join(DATA_DIR, 'germanVocabulary.json');
const FSP_PATH = P.join(DATA_DIR, 'fspVocabulary.json');

// ====== Helpers ======

function loadJson(p) {
  return JSON.parse(F.readFileSync(p, 'utf8'));
}

function saveJson(p, data) {
  F.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function normalizeWord(w) {
  if (!w || typeof w !== 'string') return '';
  return w.replace(/^(der|die|das)\s+/i, '').trim().toLowerCase();
}

function buildWordIndex(entries) {
  const idx = new Set();
  entries.forEach(e => {
    if (e.word) idx.add(normalizeWord(e.word));
  });
  return idx;
}

// Get next available ID
function getNextId(items, prefix, padLen) {
  const nums = items
    .filter(e => e.id && e.id.startsWith(prefix))
    .map(e => parseInt(e.id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  const next = max + 1;
  const padded = String(next).padStart(padLen, '0');
  return prefix + padded;
}

function isEntryEqual(a, b) {
  return normalizeWord(a.word) === normalizeWord(b.word);
}

/** Validate a single entry against schema rules */
function validateEntry(e, level) {
  const issues = [];
  if (!e.id) issues.push('missing id');
  if (!e.word) issues.push('missing word');
  if (!e.translation && e.translation !== '') issues.push('missing translation');
  if (!e.partOfSpeech) issues.push('missing partOfSpeech');

  const validPOS = ['noun', 'verb', 'adjective', 'adverb', 'phrase', 'expression',
    'preposition', 'conjunction', 'pronoun', 'article', 'other', 'modal-verb', 'question-word'];
  if (e.partOfSpeech && !validPOS.includes(e.partOfSpeech)) {
    issues.push('invalid partOfSpeech: ' + e.partOfSpeech);
  }

  if (e.partOfSpeech === 'noun') {
    if (!e.article) issues.push('missing article for noun');
    if (e.article && !['der', 'die', 'das'].includes(e.article)) {
      issues.push('invalid article: ' + e.article);
    }
    if (!e.pluralStatus) issues.push('missing pluralStatus for noun');
    if (!e.countability) issues.push('missing countability for noun');
    if (e.countability === 'countable' && (!e.plural || e.plural === '')) {
      issues.push('missing plural for countable noun');
    }
  }

  if (!e.topic) issues.push('missing topic');
  if (!e.tags || !Array.isArray(e.tags) || e.tags.length === 0) issues.push('missing tags');

  if (level === 'FSP') {
    // FSP extra validation is laxer - category is preferred but not required
  }

  return issues;
}

// ====== Main ======

function main() {
  console.log('=== Phase 25C Vocabulary Expansion ===\n');

  // Load existing data
  const voc = loadJson(VOC_PATH);
  const fsp = loadJson(FSP_PATH);

  // Before counts
  console.log('Before counts:');
  ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(l => {
    console.log(`  ${l}: ${voc[l].length} entries`);
  });
  const fspArr = Array.isArray(fsp) ? fsp : Object.values(fsp);
  console.log(`  FSP: ${fspArr.length} entries`);
  console.log(`  Total: ${Object.values(voc).flat().length + fspArr.length}\n`);

  // Build existing word index for duplicate check (across ALL levels + FSP)
  const existingWords = new Set();
  ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(l => {
    (voc[l] || []).forEach(e => {
      if (e.word) existingWords.add(normalizeWord(e.word));
    });
  });
  fspArr.forEach(e => {
    if (e.word) existingWords.add(normalizeWord(e.word));
  });

  console.log(`Existing unique words in index: ${existingWords.size}`);

  // Load new data files
  const expansionDir = P.join(__dirname, 'expansion-25c');
  const files = ['b2-new.json', 'c1-new.json', 'fsp-new.json'];

  let addedTotal = 0;
  let skippedTotal = 0;
  const errors = [];
  const byLevel = { B2: 0, C1: 0, FSP: 0 };

  files.forEach(fname => {
    const fpath = P.join(expansionDir, fname);
    if (!F.existsSync(fpath)) {
      console.log(`\n[${fname}] NOT FOUND - skipping`);
      return;
    }

    const newEntries = loadJson(fpath);
    if (!Array.isArray(newEntries) || newEntries.length === 0) {
      console.log(`\n[${fname}] empty or invalid - skipping`);
      return;
    }

    const level = fname.replace('-new.json', '').toUpperCase();
    console.log(`\n[${level}] Loading ${newEntries.length} candidate entries...`);

    // Determine target array
    let target;
    let idPrefix;
    let idPad;
    if (level === 'FSP') {
      target = fspArr;
      idPrefix = 'fsp_v_';
      idPad = 0; // no padding for FSP
    } else {
      if (!voc[level]) voc[level] = [];
      target = voc[level];
      idPrefix = level === 'B2' ? 'B2_vocab_' : 'C1_v';
      idPad = 0;
    }

    let added = 0;
    let skipped = 0;

    newEntries.forEach(e => {
      // Validate
      const issues = validateEntry(e, level);
      if (issues.length > 0) {
        skipped++;
        errors.push(`${level}/${e.word || '(no word)'}: ${issues.join(', ')}`);
        return;
      }

      // Duplicate check
      const nw = normalizeWord(e.word);
      if (existingWords.has(nw)) {
        skipped++;
        skippedTotal++;
        return;
      }

      // Assign ID if missing
      if (!e.id) {
        e.id = getNextId(target, idPrefix, idPad);
      }

      // Set level if missing
      if (!e.level) e.level = level;

      // Set source/license
      if (!e.source) e.source = 'original';
      if (!e.license) e.license = 'custom/original';

      // Add to existing word index
      existingWords.add(nw);

      // Add to target
      target.push(e);
      added++;
      addedTotal++;
      byLevel[level] = (byLevel[level] || 0) + 1;
    });

    // Sort by index (FSP) or id
    if (level === 'FSP') {
      target.sort((a, b) => {
        const na = parseInt(a.id.replace('fsp_v_', ''), 10);
        const nb = parseInt(b.id.replace('fsp_v_', ''), 10);
        return na - nb;
      });
    } else {
      target.sort((a, b) => a.id.localeCompare(b.id));
    }

    console.log(`  Added: ${added}, Skipped: ${skipped}`);
  });

  // Save back
  if (!Array.isArray(fsp)) {
    // If FSP is object with keys, we saved to fspArr - need to determine format
    // Current FSP format is an array
  }

  saveJson(VOC_PATH, voc);
  saveJson(FSP_PATH, fspArr);

  // After counts
  console.log('\n=== After counts ===');
  ['A1', 'A2', 'B1', 'B2', 'C1'].forEach(l => {
    console.log(`  ${l}: ${voc[l].length} entries`);
  });
  console.log(`  FSP: ${fspArr.length} entries`);
  console.log(`  Total: ${Object.values(voc).flat().length + fspArr.length}`);

  console.log(`\n=== Summary ===`);
  console.log(`  Total added: ${addedTotal}`);
  console.log(`  Total skipped: ${skippedTotal}`);
  console.log(`  By level: ${JSON.stringify(byLevel)}`);

  if (errors.length > 0) {
    console.log(`\n=== Validation Errors (${errors.length}) ===`);
    errors.slice(0, 20).forEach(e => console.log(`  ${e}`));
    if (errors.length > 20) console.log(`  ... and ${errors.length - 20} more`);
  }

  console.log('\nDone.');
}

main();
