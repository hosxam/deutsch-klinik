/**
 * validate-roleplay.cjs — Phase 28 roleplay scenario validator
 *
 * Checks:
 *   - All required fields present
 *   - Unique IDs
 *   - Valid level values (A1, A2, B1, B2, C1)
 *   - Valid type values
 *   - FSP roleplays link to valid case IDs (if caseId provided)
 *   - Rubric has all 4 fields
 *   - expectedPoints and checklist are non-empty arrays
 *
 * Usage: node scripts/validate-roleplay.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const rp = JSON.parse(fs.readFileSync(path.join(DATA, 'roleplayScenarios.json'), 'utf8'));

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const VALID_TYPES = ['everyday', 'FSP-patient', 'FSP-handover', 'FSP-explanation'];
const RUBRIC_FIELDS = ['grammar', 'vocabulary', 'structure', 'taskCompletion'];
const REQUIRED = ['id', 'level', 'type', 'title', 'scenario', 'userRole', 'goal', 'expectedPoints', 'checklist', 'rubric', 'tags'];

let errors = 0;
let warnings = 0;

function err(msg) { console.error('  ERROR: ' + msg); errors++; }
function warn(msg) { console.warn('  WARN: ' + msg); warnings++; }

console.log('Validating ' + rp.length + ' roleplay scenarios...\n');

// IDs
const ids = new Set();
let dupCount = 0;
for (const r of rp) {
  if (!r.id) { err('Scenario missing id at index ' + rp.indexOf(r)); continue; }
  if (ids.has(r.id)) { err('Duplicate id: ' + r.id); dupCount++; }
  ids.add(r.id);
}
if (dupCount === 0) console.log('  [OK] No duplicate IDs');

// Required fields
let reqOk = 0, reqBad = 0;
for (const r of rp) {
  let missing = REQUIRED.filter(f => r[f] === undefined || r[f] === null || (Array.isArray(r[f]) && r[f].length === 0));
  if (r.userRole === undefined || r.userRole === '' || r.userRole === null) missing.push('userRole');
  if (r.goal === undefined || r.goal === '') missing.push('goal');
  if (missing.length > 0) { err(r.id + ': missing required fields: ' + missing.join(', ')); reqBad++; }
  else reqOk++;
}
console.log('  [OK] Required fields: ' + reqOk + ' passed, ' + reqBad + ' failed');

// Levels
let lvlOk = 0, lvlBad = 0;
for (const r of rp) {
  if (!VALID_LEVELS.includes(r.level)) { warn(r.id + ': invalid level "' + r.level + '"'); lvlBad++; }
  else lvlOk++;
}
console.log('  [OK] Levels: ' + lvlOk + ' valid, ' + lvlBad + ' invalid (warnings)');

// Types
let typeOk = 0, typeBad = 0;
for (const r of rp) {
  if (!VALID_TYPES.includes(r.type)) { err(r.id + ': invalid type "' + r.type + '"'); typeBad++; }
  else typeOk++;
}
console.log('  [OK] Types: ' + typeOk + ' valid, ' + typeBad + ' invalid');

// Rubric
let rubOk = 0, rubBad = 0;
for (const r of rp) {
  const ru = r.rubric || {};
  const missing = RUBRIC_FIELDS.filter(f => !ru[f] || ru[f].trim() === '');
  if (missing.length > 0) { warn(r.id + ': rubric missing fields: ' + missing.join(', ')); rubBad++; }
  else rubOk++;
}
console.log('  [OK] Rubric completeness: ' + rubOk + ' ok, ' + rubBad + ' incomplete (warnings)');

// expectedPoints
let epOk = 0, epBad = 0;
for (const r of rp) {
  if (!r.expectedPoints || r.expectedPoints.length < 2) {
    warn(r.id + ': expectedPoints has < 2 items (' + (r.expectedPoints || []).length + ')');
    epBad++;
  } else epOk++;
}
console.log('  [OK] Expected points: ' + epOk + ' ok, ' + epBad + ' sparse (warnings)');

// Checklist
let clOk = 0, clBad = 0;
for (const r of rp) {
  if (!r.checklist || r.checklist.length < 1) {
    warn(r.id + ': checklist is empty');
    clBad++;
  } else clOk++;
}
console.log('  [OK] Checklists: ' + clOk + ' ok, ' + clBad + ' empty (warnings)');

// FSP caseId links (load fspCases to validate)
let fspCases;
try {
  fspCases = JSON.parse(fs.readFileSync(path.join(DATA, 'fspCases.json'), 'utf8'));
} catch { fspCases = []; }
const fspIds = new Set(fspCases.map(c => c.id));
let caseOk = 0, caseBad = 0;
for (const r of rp) {
  if (!r.caseId) continue;
  if (!fspIds.has(r.caseId)) {
    err(r.id + ': caseId "' + r.caseId + '" not found in fspCases.json');
    caseBad++;
  } else caseOk++;
}
console.log('  [OK] FSP caseId links: ' + caseOk + ' valid, ' + caseBad + ' invalid');

// Distribution
const byType = {};
rp.forEach(r => { byType[r.type] = (byType[r.type]||0)+1; });
console.log('\nDistribution by type:');
Object.entries(byType).sort(([a],[b]) => a < b ? -1 : 1).forEach(([k,v]) => console.log('  ' + k + ': ' + v));

// Summary
console.log('\n--- Summary ---');
console.log('Total: ' + rp.length);
console.log('Errors: ' + errors);
console.log('Warnings: ' + warnings);

if (errors > 0) {
  console.error('\nVALIDATION FAILED — ' + errors + ' error(s)');
  process.exit(1);
}
console.log('\nValidation passed.');
process.exit(0);
