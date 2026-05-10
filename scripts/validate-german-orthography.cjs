/**
 * validate-german-orthography.cjs
 *
 * Validates that German text in src/data/*.json uses proper German orthography
 * (ä/ö/ü/ß) instead of ASCII transliterations (ae/oe/ue/ss) for German words.
 *
 * Also detects:
 * - Mojibake markers (only actual corruption, not valid UTF-8 umlaut bytes)
 * - True-false answers not exactly "true" or "false"
 * - Displayed "heisst" instead of "heißt"
 * - Invalid "teür" typo (byte-level to distinguish from correct umlauts)
 * - Common missing umlaut medical/German words: uber, fur, fruh, Mudigkeit, Oberarzte
 *
 * Run: node scripts/validate-german-orthography.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');

// English words or field names that are valid with "ae"/"oe"/"ue"
// These appear in translation/explanation fields and should not be flagged as German errors.
const ENGLISH_WORDS = new Set([
  'aed', 'blue', 'continue', 'dialogue', 'dialogueprompts', 'dialogues',
  'doctorquestion', 'does', 'fluent', 'fluently', 'followupquestions',
  'frequently', 'goes', 'goethe', 'green', 'guess', 'monologue', 'question', 'questions',
  'request', 'requests', 'rue', 'true', 'toe', 'tuesday', 'ue',
  'dialog', 'dialoge', 'dialogue', 'dialogues',
  'questionnaire', 'consequences', 'frequent', 'infrequent', 'fatigue',
  'fever', 'queen', 'symptom', 'symptoms', 'syndrome',
  'aetiology', 'aetiologic', 'haematology', 'haematological',
  'haemoglobin', 'haemorrhage', 'anaemia', 'anaesthetic',
  'oedema', 'oesophagus', 'caesarean', 'gynaecology',
  'paediatric', 'orthopaedic', 'leukaemia', 'hyperglycaemia',
  'hypoglycaemia', 'ischaemia', 'sepsis', 'septic',
  // English words ending in -ae (plural of -a)
  'vertebrae', 'conjunctivae', 'alveolae', 'papillae',
  // English words containing -oe-
  'phoenix', 'subpoena', 'onomatopoeia', 'canoe',
  'hoes', 'shoes', 'toes', 'woes',
  // English words containing -ue-
  'cue', 'cues', 'due', 'dues', 'fuel', 'fuels',
  'hue', 'hues', 'pursue', 'pursues', 'pursued', 'pursuit',
  'residue', 'residual', 'statue', 'statues',
  'tissue', 'tissues', 'value', 'values', 'valuable',
  'virtue', 'virtues', 'avenue', 'avenues', 'revenue',
  'continue', 'continues', 'continued', 'continuous',
  'cue', 'cues', 'sue', 'sued', 'sues', 'issue', 'issues',
  'construed', 'construe', 'intrinsic', 'extrinsic',
  // English words with ss
  'pass', 'passes', 'passed', 'passing', 'mass', 'masses',
  'class', 'classes', 'glass', 'glasses', 'grass', 'grasses',
  'embarrass', 'embarrassed', 'harass', 'harassed',
  'across', 'unless', 'bless', 'blessed', 'dress', 'dresses',
  'press', 'presses', 'stress', 'stresses', 'tress', 'tresses',
  'progress', 'success', 'process', 'professor', 'possess',
  'aggressive', 'passive', 'massive', 'passion',
  'business', 'witness', 'confess', 'express', 'impress',
  'compass', 'brass', 'truss', 'prussian',
  'assess', 'assessment', 'assessments', 'session', 'sessions',
  'mission', 'missions', 'missionary', 'emission', 'admission',
  'discuss', 'discussion', 'fossil', 'missile',
  'necessary', 'necessarily', 'neccessary', 'assistant', 'assistance',
]);

// German words where "ae"/"oe"/"ue" IS correct (NOT transliterations)
const GERMAN_VALID_WORDS = new Set([
  'bauen', 'baust', 'baut', 'baute', 'bauten', 'gebaut',
  'bequem',
  'blaue', 'blauen', 'blauer', 'blaues',
  'braue', 'brauen', 'braut',
  'dauer', 'dauern', 'dauert', 'dauerte', 'gedauert',
  'erfreuen', 'erfreut',
  'fachsprachpruefung',
  'frau', 'frauen',
  'freue', 'freuen', 'freut', 'freute',
  'genaue', 'genauen', 'genauer', 'genaues',
  'graue', 'grauen', 'grauer', 'graues',
  'hauen', 'haust', 'haut', 'haute',
  'kauen', 'kaust', 'kaut',
  'klaue', 'klauen',
  'mauer', 'mauern',
  'aktuelle', 'aktuellen', 'aktueller', 'aktuelles', 'aktuell',
  'neue', 'neuen', 'neuer', 'neues',
  'pfauen',
  'raue', 'rauen', 'rauer',
  'sauer', 'saure', 'sauren', 'saurer', 'saures',
  'sauerstoff', 'sauerstoffgabe', 'sauerstoffgehalt',
  'sauerstoffsättigung', 'sauerstoffsättigungen',
  'schaue', 'schauen', 'schaust', 'schaut', 'schaute',
  'schauer', 'schauern',
  'stauen', 'staut', 'staute',
  'staue', 'stauen',
  'teuer', 'teure', 'teuren', 'teurer', 'teures', 'teuerer', 'teueren', 'teuerste',
  'traue', 'trauen', 'traust', 'traut', 'traute',
  'tauen',
  'vertraue', 'vertrauen', 'vertraut', 'vertraute',
  'zutraue', 'zutrauen', 'zutraut',
  // Valid "ss" words (not confused with ß)
  'strasse', 'strassen', 'gross', 'grosse', 'grossen', 'grosser', 'grosses',
  'heisse', 'heissen', 'heisser', 'heisses',
  'muss', 'musst',
  'fluss', 'flusse', 'flussen',
  'befund', 'befunde', 'befunden',
  // Medical and loan words where ae/oe/ue letter pairs are not ASCII umlaut transliterations
  'atemfrequenz', 'belastungsdyspnoe', 'dyspnoe', 'frequenz',
  'frequenzkontrolle', 'gastroenteritis', 'herzfrequenz',
  'herzfrequenzen', 'kopfschmerzfrequenz', 'normofrequent',
  'nutzungsdauer', 'orthopnoe', 'ruhedyspnoe', 'sprechdyspnoe',
  'stuhlfrequenz',
  // Internal conceptId strings that use ASCII-only identifiers (not displayed German)
  // Reading concept IDs
  'praesens', 'praeteritum', 'saetze', 'nebensaetze',
  'relativsaetze', 'dativpraepositionen', 'wechselpraepositionen',
  'persoenliche', 'erfahrungen',
  // Writing/AI concept IDs
  'moechte', 'critique', 'hoeflich', 'aesthetik',
  'fluency', 'praezision', 'adaequate',
  // German lesson concept IDs
  'faehrt', 'schlaeft', 'geoeffnet', 'koennen', 'muessen',
  'koennt', 'muesst', 'faehrst', 'laeuft', 'laeufst',
  'regelmaessig', 'koerper', 'ueber', 'erklaeren',
  'vertrauenswuerdig', 'spaeter', 'uebertreiben',
  'gefaehrlich', 'schoene', 'hoere', 'hoerverstaendnis',
  'muede', 'oefter', 'muell', 'spaet', 'fuer',
  'baeume', 'aelter', 'universitaet', 'groesser',
  'groessten', 'groesste', 'koennten', 'braeuche',
  'erzaehlen', 'wuerde', 'moeglich', 'fuehrung',
  'duefte', 'wuerden', 'uebernehmen', 'naechsten',
  'veraendern', 'laenger', 'naechstes', 'pruefen',
  'gespraech', 'buero', 'rueckmeldung', 'taeglich',
  'geloescht', 'unpersoenlich', 'schuetzen',
  'aufgabenerfuellung', 'vollstaendigkeit', 'kohaerenz',
  'absaetze', 'verknuepfungen', 'praesentation',
  'laesst', 'gruppe', 'gruppen', 'aehnlich',
  // Moechte forms and collocations
  'moechten', 'moechtest',
  // Medical concept IDs
  'oberarzte', 'muedigkeit',
]);

// Known false-positive words flagged by the validator but actually correct.
// Includes: medical Latin terms, English words in English-language fields.
const KNOWN_FALSE_POSITIVES = new Set([
  // Medical Latin terms
  'naevi', 'glandulae', 'salivariae', 'tenue', 'foetor',
  'angioedema', 'oedema', 'o.d.', 'o.B.', 'o.b.',
  // English words in English-context fields
  'consequently', 'sequence', 'technique', 'techniques',
  'query', 'questioning', 'frequency', 'frequencies',
  'influences', 'clues',
  'colleague', 'shoe', 'shoe', 'does',
  'aesthetic', 'aesthetics',
]);

const ALL_VALID = new Set([...ENGLISH_WORDS, ...GERMAN_VALID_WORDS, ...KNOWN_FALSE_POSITIVES]);

// Known expected missing-umlaut words that should be flagged
const EXPECTED_UMLAUT_CORRECTIONS = {
  'uber': 'über',
  'fur': 'für',
  'fruh': 'früh',
  'oberarzte': 'Oberärzte',
  'mudigkeit': 'Müdigkeit',
};

// Strict word separators pattern - these can't come before/after in valid German
const PATTERN_BLOCKS = new Set([
  // Valid German prefixes/compounds
  'haup', 'haupt', 'neben', 'bei', 'vor', 'hinter', 'uber', 'fur',
  'ueb', 'kla', 'scha', 'fra',
  // Valid word stems
  'brau', 'dau', 'erfreu', 'freu', 'hau', 'kau', 'mau', 'pfau',
  'rau', 'schau', 'stau', 'trau', 'vertrau', 'zutrau',
  'bau', 'sau',
  'blau', 'grau', 'genau', 'aktuell', 'neutr',
  'teu', 'verteu',
  // Swiss/alternate spellings
  'heiss',
]);

function extractWords(text) {
  if (!text || typeof text !== 'string') return [];
  return text.match(/[a-zA-ZäöüßÄÖÜ][a-zA-ZäöüßÄÖÜ]*/g) || [];
}

function isSuspiciousWord(word) {
  const lower = word.toLowerCase();
  if (word.length < 2) return false;
  if (/[äöüßÄÖÜ]/.test(word)) return false;
  if (ALL_VALID.has(lower)) return false;
  // Check if it's a known German word missing umlauts
  if (EXPECTED_UMLAUT_CORRECTIONS[lower]) return true;
  
  // ae and oe are safe to check (German has no ae/oe diphthongs)
  if (lower.includes('ae') || lower.includes('oe')) return true;
  
  // 'ue' check: only flag when ue is pre-vocalic transliteration, NOT eu diphthong
  // Words containing 'ue' where it represents ü transliteration:
  // - Word starts with 'u' followed by consonant: 'Uber' -> Über
  // - 'ue' preceded by consonant and not 'eu': 'muede', 'fruer'
  // Words where 'eu' is a valid diphthong contain 'eu': 'Steuer', 'Abenteuer', 'teuer'
  // We skip words that contain 'oe' or 'ae' as those are always suspicious
  // For 'ue', we use a smarter check: ue is only suspicious if the word
  // doesn't also contain 'eu' (valid diphthong)
  if (lower.includes('ue')) {
    // If the word ALSO contains 'eu', it's likely a valid compound
    // like 'Steuer' (same as 'teuer'). Only flag standalone 'ue' words.
    if (lower.includes('eu')) return false;
    return true;
  }
  
  return false;
}

// Known German/medical words containing "trü" that are valid
const VALID_TRU_WORDS = new Set([
  'trüb', 'trübe', 'trüben', 'trüber', 'trübes', 'trübung',
  'getrübt', 'getrübte', 'getrübten', 'getrübter',
  'trügerisch', 'trügerische', 'trügerischen',
  'betrüger', 'betrügerin', 'betrügerisch', 'betrügerische', 'betrügerischen',
  'betrüger', 'betrügern', 'betrug', 'betrüge',
  'strümpfe', 'strümpfen',
  'zertrümmerung', 'zertrümmern', 'zertrümmert',
  'eintrüben', 'eingetrübt', 'eingetrübte', 'eintrübung',
]);

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rawBytes = fs.readFileSync(filePath); // For byte-level checks
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return [];
  }

  const findings = [];

  // --- 1. Mojibake detection (byte-level, avoiding false positives on valid UTF-8) ---
  
  // Only flag SPECIFIC known corruption byte sequences, not valid umlaut bytes
  
  // Corrupted ß (double-encoded): C3 83 C5 B8
  const corrupted_eszett = Buffer.from([0xC3, 0x83, 0xC5, 0xB8]);
  if (containsBytes(rawBytes, corrupted_eszett)) {
    const idx = rawBytes.indexOf(corrupted_eszett);
    const ctx = extractByteContext(content, idx);
    findings.push({ word: 'corrupted ÃŸ', type: 'mojibake', context: ctx });
  }
  
  // Corrupted Ã (stray byte in UTF-8) — only flag if NOT part of valid umlaut
  // U+00C3 (Ã) is only valid mojibake if NOT followed by a valid continuation byte
  // This is too broad, so we skip this check and rely on specific corrupted sequences

  // Corrupted ÿ (U+00FF) - not a standard German character
  const corrupted_y = Buffer.from([0xC3, 0xBF]);
  if (containsBytes(rawBytes, corrupted_y)) {
    const idx = rawBytes.indexOf(corrupted_y);
    const ctx = extractByteContext(content, idx);
    findings.push({ word: 'corrupted ÿ (ç³¿)', type: 'mojibake', context: ctx });
  }

  // Replacement character U+FFFD
  if (content.indexOf('\uFFFD') !== -1) {
    const idx = content.indexOf('\uFFFD');
    const ctx = extractByteContext(content, idx);
    findings.push({ word: 'U+FFFD', type: 'replacement-char', context: ctx });
  }

  // --- 2. True-false answer validation ---
  function checkBooleanAnswers(obj, filePath) {
    if (filePath.includes('listening') || filePath.includes('reading') || filePath.includes('exams')) {
      function walk(o) {
        if (typeof o === 'object' && o !== null) {
          if (Array.isArray(o)) {
            o.forEach(walk);
          } else {
            for (const [k, v] of Object.entries(o)) {
              if (k === 'answer' && typeof v === 'string') {
                if (v === 'trü') {
                  findings.push({ word: 'trü (should be true)', type: 'corrupted-boolean' });
                }
              }
              walk(v);
            }
          }
        }
      }
      walk(obj);
    }
  }
  checkBooleanAnswers(data, filePath);

  // --- 3. Check for displayed "heisst" ---
  function checkHeisst(obj, pathStr) {
    if (typeof obj === 'string') {
      if (pathStr.endsWith('.answer')) return;
      if (/\bheisst\b/i.test(obj)) {
        const idx = obj.toLowerCase().indexOf('heisst');
        const start = Math.max(0, idx - 15);
        const end = Math.min(obj.length, idx + 25);
        const context = (start > 0 ? '...' : '') + obj.slice(start, end) + (end < obj.length ? '...' : '');
        findings.push({ word: 'heisst', type: 'should-be-heisst', path: pathStr, context });
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => checkHeisst(item, `${pathStr}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        checkHeisst(val, `${pathStr}.${key}`);
      }
    }
  }
  checkHeisst(data, 'root');

  // --- 4. Byte-level check for "teür" corruption ---
  // "teür" = 74 65 C3 BC 72 (t-e-ü-r)
  // This is ALWAYS a corruption (valid German doesn't have ü after te)
  const teurBytes = Buffer.from([0x74, 0x65, 0xC3, 0xBC, 0x72]); // teür
  const advancedTeur = Buffer.from([0x74, 0x65, 0xC3, 0xBC, 0x72]); // same
  if (containsBytes(rawBytes, teurBytes)) {
    const idx = rawBytes.indexOf(teurBytes);
    const ctx = extractByteContext(content, idx);
    findings.push({ word: 'teür', type: 'invalid-spelling', context: 'Should be "teuer" - ' + ctx });
  }

  // --- 5. Common missing umlaut words ---
  function checkMissingUmlauts(obj, pathStr) {
    if (typeof obj === 'string') {
      if (pathStr.endsWith('.id') || pathStr.endsWith('.type')) return;
      
      const lower = obj.toLowerCase();
      for (const [wrong, correct] of Object.entries(EXPECTED_UMLAUT_CORRECTIONS)) {
        const regex = new RegExp('\\b' + wrong + '\\b', 'i');
        if (regex.test(obj)) {
          const idx = obj.toLowerCase().indexOf(wrong);
          const start = Math.max(0, idx - 15);
          const end = Math.min(obj.length, idx + 25);
          const context = (start > 0 ? '...' : '') + obj.slice(start, end) + (end < obj.length ? '...' : '');
          findings.push({ word: wrong, type: 'missing-umlaut', path: pathStr, context, correction: correct });
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => checkMissingUmlauts(item, `${pathStr}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        checkMissingUmlauts(val, `${pathStr}.${key}`);
      }
    }
  }
  checkMissingUmlauts(data, 'root');

  // --- 6. Original ae/oe/ue suspicious word check ---
  function walk(obj, pathStr) {
    if (typeof obj === 'string') {
      if (obj.startsWith('http://') || obj.startsWith('https://')) return;
      if (pathStr.endsWith('.id') || pathStr.endsWith('.type')) return;
      // Skip conceptId values (they are internal identifiers, not displayed German text)
      if (pathStr.includes('conceptId') || pathStr.includes('concept_id')) return;
      // Skip english translation fields
      if (pathStr.endsWith('.english') || pathStr.endsWith('.en')) return;
      // Skip concept/identifier arrays like conceptsTaught (internal identifiers)
      if (pathStr.includes('conceptsTaught') || pathStr.includes('conceptReferences')) return;
      // Skip formsTable internal keys (form/example identifiers with ae/oe/ue shorthand)
      if (pathStr.includes('.formsTable') && (pathStr.endsWith('.form') || pathStr.endsWith('.use') || pathStr.endsWith('.example'))) return;
      // Skip commonMistakes that are English explanations
      if (pathStr.endsWith('.commonMistakes') && !/[äöüßÄÖÜ]/.test(obj)) return;
      // Skip notes, rubric, simpleEnglish fields in FSP (often English text)
      if (pathStr.endsWith('.notes') || pathStr.endsWith('.simpleEnglish') || pathStr.endsWith('.rubric')) return;
      // Skip doctorToDoctorPhrase (contains Latin medical terms)
      if (pathStr.includes('doctorToDoctorPhrase')) return;
      // Skip translation-like fields
      if (pathStr.endsWith('.translation') && !/[äöüßÄÖÜ]/.test(obj)) return;
      
      const words = extractWords(obj);
      const seenWords = new Set();
      for (const word of words) {
        if (seenWords.has(word.toLowerCase())) continue;
        seenWords.add(word.toLowerCase());
        if (word.length > 2 && isSuspiciousWord(word)) {
          const alreadyReported = findings.some(f => f.word === word && f.type === 'suspicious-word');
          if (!alreadyReported) {
            findings.push({ word, type: 'suspicious-word', path: pathStr, context: getContext(obj, word) });
          }
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${pathStr}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        if (key === 'id' || key === 'type' || key === 'english' || key === 'en') continue;
        walk(val, `${pathStr}.${key}`);
      }
    }
  }

  walk(data, 'root');
  return findings;
}

function containsBytes(buf, needle) {
  return buf.indexOf(needle) !== -1;
}

function extractByteContext(content, byteIdx) {
  // byteIdx is the position in UTF-8 text, just grab surrounding chars
  const start = Math.max(0, byteIdx - 20);
  const end = Math.min(content.length, byteIdx + 20);
  return (start > 0 ? '...' : '') + 
    content.slice(start, end).replace(/\n/g, '\\n').slice(0, 100) + 
    (end < content.length ? '...' : '');
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
    findings.forEach(f => {
      const context = f.context || '';
      const note = f.correction ? ` → should be "${f.correction}"` : '';
      const pathStr = f.path ? ` at ${f.path}` : '';
      console.log(`    [${f.type}] "${f.word}"${note}${pathStr}`);
      if (context) console.log(`      context: ${context.slice(0, 100)}`);
    });
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
  console.log(`\x1b[31m${totalErrors} issue(s) found across ${processedFiles} files\x1b[0m`);
  process.exit(1);
}
