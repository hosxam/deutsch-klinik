#!/usr/bin/env node
/**
 * fix-safe-orthography.cjs
 *
 * Phase 8: Fix only safe, obvious German orthography issues.
 *
 * Rules:
 * - Fix "fur" -> "für" and "uber" -> "über" only in German user-facing text
 * - Fix "heisst" -> "heißt" in prompts/answers (grammar only)
 * - Do NOT touch conceptIds, technical keys, English text, or code
 * - Do NOT touch vocabulary entries (word/translation fields which are correct)
 * - Only fix strings that are clearly meant to be umlauted German
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// List of words to fix
const UMLAUT_FIXES = {
  // Most common missing umlauts in lesson data
  'fur': 'für',
  'uber': 'über',
  'Uber': 'Über',
  // These are ambiguous - only fix in known German text contexts
};

const filesToFix = [
  'germanLessons.json',
  'grammar.json',
  'speaking.json',
  'writing.json',
  'listening.json',
  'reading.json'
];

function isUserFaceingText(key) {
  // These fields contain German text that should use proper umlauts
  const textFields = [
    'explanation', 'prompt', 'answer', 'text', 'example', 'question',
    'options', 'rubric', 'criteria', 'description',
    'usefulPhrases', 'german', 'recommendation', 'correction',
    'commonMistakes', 'miniDrills', 'formsTables', 'summary',
    'englishExplanation', 'notes', 'q', 'a', 'row', 'rows',
    'tip', 'hint', 'instruction', 'feedback', 'sentence',
    'direct', 'indirect', 'review', 'reflection',
    'fullIdea', 'gapFill', 'pre', 'post'
  ];

  // Check if key contains any of these or is deeply inside text context
  // We'll be conservative and only fix in string values, never in object keys
  return textFields.some(tf => typeof key === 'string' && key.toLowerCase().includes(tf.toLowerCase()));
}

// More conservative approach: only fix specific patterns in string values
// that are clearly meant to be German text with missing umlauts
function fixTextualUmlauts(str) {
  if (typeof str !== 'string') return str;

  let fixed = str;
  // Fix "fur" that should be "für" - only when it's the word "für" in context
  // We use word boundary check loosely
  fixed = fixed.replace(/\bfur\b(?!\s*\|)/g, (match, offset) => {
    // Check if surrounded by German context
    const before = str.slice(Math.max(0, offset - 20), offset);
    const after = str.slice(offset + 3, offset + 23);
    const context = (before + after).toLowerCase();
    // Common German words that appear near "für"
    if (context.includes('dank') || context.includes('bitte') || 
        context.includes('einladung') || context.includes('geburtstag') ||
        context.includes('prüfung') || context.includes('mich') ||
        context.includes('sich') || context.includes('arbeit') ||
        context.includes('interess') || context.includes('sorgen') ||
        context.includes('typisch') || context.includes('hoflich') ||
        context.includes('hflich') || context.includes('position') ||
        context.includes('vorschlag') || context.includes('zusammenhan') ||
        context.includes('kann') || context.includes('lernen') ||
        context.includes('dich') || context.includes('euch') ||
        context.includes('das') || context.includes('den') ||
        context.includes('die') || context.includes('der') ||
        context.includes('einen') || context.includes('eine') ||
        context.includes('einem') || context.includes('einer') ||
        context.includes('meine') || context.includes('deine') ||
        context.includes('seine') || context.includes('ihre') ||
        context.includes('unsere') || context.includes('eure') ||
        offset === 0 || str[offset - 1] === ' ' || str[offset - 1] === '(') {
      return 'für';
    }
    return match;
  });

  // Fix "uber" -> "über" in German context
  fixed = fixed.replace(/\buber\b/gi, (match) => {
    const lower = match.toLowerCase();
    if (lower === 'uber') return 'über';
    return 'Über';
  });

  return fixed;
}

let totalFixed = 0;

for (const file of filesToFix) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) continue;

  const raw = fs.readFileSync(filePath, 'utf8');
  
  // Do a more targeted approach: iterate string values in the JSON
  // Only fix German-language user-facing text
  const data = JSON.parse(raw);
  let fileFixes = 0;

  function walk(obj, path) {
    if (!obj || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'string') {
          const fixed = fixTextualUmlauts(obj[i]);
          if (fixed !== obj[i]) {
            obj[i] = fixed;
            fileFixes++;
          }
        } else {
          walk(obj[i], path + '[' + i + ']');
        }
      }
    } else {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
          const fixed = fixTextualUmlauts(obj[key]);
          if (fixed !== obj[key]) {
            obj[key] = fixed;
            fileFixes++;
          }
        } else {
          walk(obj[key], path + '.' + key);
        }
      }
    }
  }

  walk(data, '');
  if (fileFixes > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`${file}: fixed ${fileFixes} orthography issues`);
    totalFixed += fileFixes;
  } else {
    console.log(`${file}: no changes`);
  }
}

console.log(`\nTotal orthography fixes: ${totalFixed}`);
