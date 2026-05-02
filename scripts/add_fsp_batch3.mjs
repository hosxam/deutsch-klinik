// This script adds Batch 3 (l41-l60) to fspListening.json
// Run with: node scripts/add_fsp_batch3.mjs

import fs from 'fs';
import { execSync } from 'child_process';

const fspPath = 'src/data/fspListening.json';
const data = JSON.parse(fs.readFileSync(fspPath, 'utf8'));

console.log(`Previous FSP listening count: ${data.length}`);

// Load batch 3 data from separate file
const batch3 = JSON.parse(fs.readFileSync('scripts/fsp_batch3_data.json', 'utf8'));

// Validate no duplicate IDs
const existingIds = new Set(data.map(d => d.id));
batch3.forEach(item => {
  if (existingIds.has(item.id)) {
    console.log(`ERROR: Duplicate ID ${item.id}`);
    process.exit(1);
  }
});

data.push(...batch3);
console.log(`Count after batch 3: ${data.length}`);

function validate() {
  const errors = [];

  if (data.length !== 60) errors.push(`Expected 60 items, got ${data.length}`);

  // Duplicate IDs
  const allIds = data.map(d => d.id);
  const seen = new Map();
  allIds.forEach((id, i) => {
    if (seen.has(id)) errors.push(`Duplicate ID ${id} at index ${i}`);
    seen.set(id, i);
  });

  // Duplicate/similar scripts (first 50 chars)
  const scripts = data.map(d => d.script?.substring(0, 60).toLowerCase().replace(/\s+/g, ' '));
  const seenScripts = new Map();
  scripts.forEach((s, i) => {
    if (seenScripts.has(s)) errors.push(`Similar script at index ${i} (${data[i].id}): matches ${data[seenScripts.get(s)].id}`);
    seenScripts.set(s, i);
  });

  // Check each entry
  data.forEach((item, i) => {
    const fields = ['id','title','type','script','questions','answers','transcriptHiddenByDefault','vocabularyFocus','tags'];
    fields.forEach(f => {
      if (item[f] === undefined || item[f] === null) errors.push(`${item.id}: missing field "${f}"`);
    });

    // Check questions have answers
    if (item.questions && item.answers) {
      if (item.questions.length !== item.answers.length) {
        errors.push(`${item.id}: ${item.questions.length} questions but ${item.answers.length} answers`);
      }
      item.questions.forEach((q, qi) => {
        if (!q.question) errors.push(`${item.id}: question ${qi} missing question text`);
        if (!q.options || q.options.length < 2) errors.push(`${item.id}: question ${qi} missing options`);
        if (qi < item.answers.length) {
          const ans = item.answers[qi];
          if (!q.options.includes(ans)) errors.push(`${item.id}: answer "${ans}" not in options for Q${qi}`);
        }
      });
    }
  });

  return errors;
}

const errors = validate();
if (errors.length > 0) {
  console.log('\nVALIDATION ERRORS:');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}

fs.writeFileSync(fspPath, JSON.stringify(data, null, 2) + '\n');
console.log('File written successfully.');

// Run build
console.log('\nRunning npm build...');
try {
  execSync('npm run build 2>&1', { timeout: 120000, cwd: '.' });
  console.log('\nBATCH 3 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 2000) || e.message);
  process.exit(1);
}
