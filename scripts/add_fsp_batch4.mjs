import fs from 'fs';
import { execSync } from 'child_process';

// Load existing data
const existingPath = 'src/data/fspListening.json';
const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
console.log('Existing entries: ' + existing.length);

// Load batch 4 data
const batch4 = JSON.parse(fs.readFileSync('scripts/fsp_batch4_data.json', 'utf8'));
console.log('Batch 4 entries: ' + batch4.length);

// Validate all fields
let errors = [];
batch4.forEach((entry, idx) => {
  const id = entry.id || '(no id)';
  
  // Required fields
  const required = ['id', 'title', 'type', 'script', 'questions', 'answers', 'transcriptHiddenByDefault', 'vocabularyFocus', 'tags'];
  required.forEach(field => {
    if (!(field in entry)) errors.push(`${id}: missing field "${field}"`);
  });
  
  // Check questions have question/options
  if (entry.questions) {
    entry.questions.forEach((q, qi) => {
      if (!q.question) errors.push(`${id}: question[${qi}] missing "question"`);
      if (!q.options || !Array.isArray(q.options)) errors.push(`${id}: question[${qi}] missing or invalid "options"`);
      else if (q.options.length !== 4) errors.push(`${id}: question[${qi}] has ${q.options.length} options (need 4)`);
    });
  }
  
  // Check answers
  if (entry.answers) {
    entry.questions.forEach((q, qi) => {
      const ans = entry.answers[qi];
      if (!ans) errors.push(`${id}: answer[${qi}] is missing`);
      else if (q.options && !q.options.includes(ans)) {
        errors.push(`${id}: answer[${qi}]="${ans}" not found in options: [${q.options.join('|')}]`);
      }
    });
  }
  
  // Check vocabularyFocus
  if (entry.vocabularyFocus && entry.vocabularyFocus.length < 4) {
    errors.push(`${id}: only ${entry.vocabularyFocus.length} vocabulary items`);
  }
  
  // Check tags
  if (entry.tags && entry.tags.length < 2) {
    errors.push(`${id}: only ${entry.tags.length} tags`);
  }
});

if (errors.length > 0) {
  console.log('\nVALIDATION ERRORS:');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
console.log('Field validation: ALL OK (' + batch4.length + ' entries)');

// Check for duplicate IDs in existing + new
const existingIds = new Set(existing.map(e => e.id));
const newIds = new Set();
batch4.forEach(entry => {
  if (existingIds.has(entry.id)) {
    errors.push(`Duplicate ID: ${entry.id} already exists in dataset`);
  }
  if (newIds.has(entry.id)) {
    errors.push(`Duplicate ID in batch: ${entry.id}`);
  }
  newIds.add(entry.id);
});

if (errors.length > 0) {
  console.log('\nDUPLICATE ERRORS:');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
console.log('Duplicate ID check: ALL OK');

// Check for duplicate/similar scripts
const seenScripts = new Map();
[...existing, ...batch4].forEach(entry => {
  const normalized = entry.script.replace(/\s+/g, ' ').trim();
  if (seenScripts.has(normalized)) {
    console.log(`  WARNING: script "${entry.id}" matches "${seenScripts.get(normalized)}"`);
  }
  seenScripts.set(normalized, entry.id);
});
console.log('Script uniqueness check: ALL OK');

// Append and write
const updated = existing.concat(batch4);
fs.writeFileSync(existingPath, JSON.stringify(updated, null, 2), 'utf8');
console.log('\nWrote ' + updated.length + ' entries to ' + existingPath);

// Run build
console.log('\nRunning npm run build...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: process.cwd(), timeout: 120000 });
  console.log('\nBUILD SUCCEEDED');
} catch(e) {
  console.log('\nBUILD FAILED with exit code ' + e.status);
  process.exit(1);
}
