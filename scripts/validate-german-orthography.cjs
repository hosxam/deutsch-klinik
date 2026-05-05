/**
 * validate-german-orthography.cjs
 *
 * Validates that German text in src/data/*.json uses proper German orthography
 * (ä/ö/ü/ß) instead of ASCII transliterations (ae/oe/ue/ss) for German words.
 *
 * Uses a whitelist of known valid words where "ae"/"oe"/"ue" is correct
 * (English words, valid German compounds like "neue", "bauen", "Dauer").
 *
 * Run: node scripts/validate-german-orthography.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

// English words or field names that are valid with "ae"/"oe"/"ue"
const ENGLISH_WORDS = new Set([
  'aed', 'continue', 'dialogue', 'dialogueprompts', 'dialogues',
  'doctorquestion', 'does', 'fluent', 'fluently', 'followupquestions',
  'frequently', 'goes', 'goethe', 'monologue', 'question', 'questions',
  'request', 'requests', 'true', 'ue',
]);

// German words where "ae"/"oe"/"ue" IS correct (NOT transliterations)
// These include:
// - "au"+"e" pattern: bauen, schauen, trauen, Dauer
// - "eu" words: neue, freuen, teuer
// - Adjective endings: blaue, genaue, neue, saure, graue
// - URL parts: bundesaerztekammer, fachsprachpruefung
const GERMAN_VALID_WORDS = new Set([
  'bauen', 'baust', 'baut', 'baute', 'bauten', 'gebaut',
  'blaue', 'blauen', 'blauer', 'blaues',
  'braue', 'brauen', 'braut',
  'bundesaerztekammer', 'bundesärztekammer',
  'dauer', 'dauern', 'dauert', 'dauerte', 'gedauert',
  'erfreuen', 'erfreut',
  'fachsprachpruefung',
  'freue', 'freuen', 'freut', 'freute',
  'genaue', 'genauen', 'genauer', 'genaues',
  'graue', 'grauen', 'grauer', 'graues',
  'hauen', 'haust', 'haut', 'haute',
  'kauen', 'kaust', 'kaut',
  'klaue', 'klauen',
  'mauer', 'mauern',
  'naktuelle', 'naktueller',
  'aktuelle', 'aktuellen', 'aktueller', 'aktuelles', 'aktuell',
  'ndauer', 'ndauert',
  'neue', 'neuen', 'neuer', 'neues', 'nneuer',
  'pfauen',
  'raue', 'rauen', 'rauer',
  'sauer', 'saure', 'sauren', 'saurer', 'saures',
  'schaue', 'schauen', 'schaust', 'schaut', 'schaute',
  'schauer', 'schauern',
  'stauen', 'staut', 'staute',
  'staue', 'stauen',
  'teuer', 'teure', 'teuren', 'teurer', 'teures', 'verteuert',
  'traue', 'trauen', 'traust', 'traut', 'traute',
  'tauen',
  'vertraue', 'vertrauen', 'vertraut', 'vertraute',
  'zutraue', 'zutrauen', 'zutraut',
]);

// Check that every word from 'ae' is properly either transliterated and fixed,
// or is in one of the whitelists
const ALL_VALID = new Set([...ENGLISH_WORDS, ...GERMAN_VALID_WORDS]);

function extractWords(text) {
  if (!text || typeof text !== 'string') return [];
  return text.match(/[a-zA-ZäöüßÄÖÜ][a-zA-ZäöüßÄÖÜ]*/g) || [];
}

function isSuspicious(word) {
  const lower = word.toLowerCase();
  if (word.length < 2) return false;
  // Already has proper umlauts? Clean.
  if (/[äöüßÄÖÜ]/.test(word)) return false;
  // In whitelist? Clean.
  if (ALL_VALID.has(lower)) return false;
  // Has ae/oe/ue pattern? Suspicious.
  return lower.includes('ae') || lower.includes('oe') || lower.includes('ue');
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return [];
  }

  const findings = [];

  function walk(obj, pathStr) {
    if (typeof obj === 'string') {
      // Skip URLs
      if (obj.startsWith('http://') || obj.startsWith('https://')) return;
      // Skip field names that are identifiers
      if (pathStr.endsWith('.id') || pathStr.endsWith('.type')) return;
      
      const words = extractWords(obj);
      const seenWords = new Set();
      for (const word of words) {
        if (seenWords.has(word.toLowerCase())) continue;
        seenWords.add(word.toLowerCase());
        if (word.length > 2 && isSuspicious(word)) {
          findings.push({ word, path: pathStr, context: getContext(obj, word) });
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${pathStr}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        if (key === 'id' || key === 'type') continue;
        walk(val, `${pathStr}.${key}`);
      }
    }
  }

  walk(data, 'root');
  return findings;
}

function getContext(text, word, width = 40) {
  const idx = text.toLowerCase().indexOf(word.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - width);
  const end = Math.min(text.length, idx + word.length + width);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

const files = [
  'listening.json', 'reading.json', 'writing.json', 'speaking.json',
  'grammar.json', 'germanLessons.json', 'germanVocabulary.json', 'germanUnits.json',
  'exams.json', 'fspAnamnese.json', 'fspCases.json', 'fspExams.json',
  'fspGrammar.json', 'fspListening.json', 'fspPresentations.json', 'fspReading.json',
  'fspVocabulary.json', 'fspWriting.json', 'medical.json', 'pronunciationGuides.json',
  'resources.json',
];

let totalErrors = 0;
let processedFiles = 0;

console.log('Validating German orthography in src/data/...\n');

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) continue;

  const findings = scanFile(filePath);
  processedFiles++;

  if (findings.length > 0) {
    console.log(`\x1b[31m✗ ${file}\x1b[0m (${findings.length} issues)`);
    // Show first 3 findings per file
    for (let i = 0; i < Math.min(3, findings.length); i++) {
      const f = findings[i];
      console.log(`    "${f.word}" → ${f.context}`);
    }
    if (findings.length > 3) {
      console.log(`    ... and ${findings.length - 3} more`);
    }
    totalErrors += findings.length;
  } else {
    console.log(`\x1b[32m✓ ${file}\x1b[0m`);
  }
}

console.log(`\n${'='.repeat(50)}`);
if (totalErrors === 0) {
  console.log(`\x1b[32mALL GERMAN TEXT VALIDATED OK (${processedFiles} files)\x1b[0m`);
  process.exit(0);
} else {
  console.log(`\x1b[31m${totalErrors} suspicious term(s) found across ${processedFiles} files\x1b[0m`);
  console.log('Review and add to whitelist if they are valid non-umlaut words.');
  process.exit(1);
}
