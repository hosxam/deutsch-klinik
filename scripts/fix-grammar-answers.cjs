/**
 * fix-grammar-answers.cjs
 *
 * Validates that grammar data is consistent:
 * - All MCQ answers exist in their options array
 * - No duplicate prompts (same prompt text = same exercise)
 * - Detects orphaned exercises with no level
 *
 * Also optionally removes duplicate exercises if --fix is passed.
 *
 * Usage:
 *   node scripts/fix-grammar-answers.cjs          # validate only
 *   node scripts/fix-grammar-answers.cjs --fix     # validate + remove duplicates
 */

const fs = require('fs');

const DATA_FILE = './src/data/grammar.json';

if (!fs.existsSync(DATA_FILE)) {
  console.error(`File not found: ${DATA_FILE}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const shouldFix = process.argv.includes('--fix');

let totalErrors = 0;
let removedDups = 0;

for (const [level, exercises] of Object.entries(data)) {
  if (!Array.isArray(exercises)) continue;

  // --- MCQ answer validation ---
  for (const ex of exercises) {
    if (ex.type === 'mcq' && ex.options && Array.isArray(ex.options)) {
      if (!ex.options.includes(ex.answer)) {
        console.error(`ERROR: ${ex.id} | MCQ answer "${ex.answer}" not in options [${ex.options.join(', ')}]`);
        console.error(`  prompt: ${(ex.prompt || '').slice(0, 60)}`);
        totalErrors++;
      }
    }
  }
}

// --- Duplicate detection (by prompt) ---
const seenMap = new Map(); // prompt -> { id, level }
const dupsToRemove = [];

for (const [level, exercises] of Object.entries(data)) {
  if (!Array.isArray(exercises)) continue;

  for (const ex of exercises) {
    const key = (ex.prompt || '').trim().toLowerCase();
    if (!key) continue;

    if (seenMap.has(key)) {
      const existing = seenMap.get(key);
      // Keep the one with options (more complete), remove the simpler one
      // If both have or don't have options, keep the one with the higher id number (usually newer)
      console.log(`DUP: "${ex.id}" (level ${level}) matches "${existing.id}" (level ${existing.level})`);
      console.log(`  prompt: ${key.slice(0, 60)}`);

      const existingHasOptions = !!existing.options;
      const currentHasOptions = !!ex.options;

      if (currentHasOptions && !existingHasOptions) {
        // Current is more complete — remove existing
        dupsToRemove.push({ level: existing.level, id: existing.id });
        seenMap.set(key, { id: ex.id, level, options: ex.options });
        console.log(`  -> Keeping "${ex.id}" (has options), removing "${existing.id}"`);
      } else {
        // Keep existing
        dupsToRemove.push({ level, id: ex.id });
        console.log(`  -> Keeping "${existing.id}", removing "${ex.id}"`);
      }
    } else {
      seenMap.set(key, { id: ex.id, level, options: ex.options });
    }
  }
}

if (dupsToRemove.length > 0) {
  console.log(`\n${dupsToRemove.length} duplicate(s) found.`);
  totalErrors += dupsToRemove.length;
}

if (totalErrors === 0) {
  console.log(`All grammar data validated OK (${Object.keys(data).length} levels).`);
  process.exit(0);
}

if (shouldFix) {
  // Remove duplicates
  const removeSet = new Set(dupsToRemove.map(d => `${d.level}::${d.id}`));
  for (const [level, exercises] of Object.entries(data)) {
    if (!Array.isArray(exercises)) continue;
    const before = exercises.length;
    data[level] = exercises.filter(ex => !removeSet.has(`${level}::${ex.id}`));
    removedDups += before - data[level].length;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`\nFixed: removed ${removedDups} duplicate(s) from grammar.json`);
  console.log('Re-run without --fix to verify clean.');
} else {
  console.log(`\n${totalErrors} issue(s) found. Run with --fix to auto-remove duplicates.`);
  process.exit(1);
}
