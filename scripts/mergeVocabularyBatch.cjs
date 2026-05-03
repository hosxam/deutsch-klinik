#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const masterPath = path.resolve(__dirname, '..', 'data', 'vocabulary_master.csv');
const batchPath = path.resolve(__dirname, '..', 'data', 'new_vocabulary_batch.csv');

// ---- CSV Parser (same as importVocabulary) ----
function parseCSV(text) {
  const lines = [];
  let i = 0;
  let current = '';
  let inQuotes = false;

  function flushLine(lineStr) {
    if (!lineStr.trim()) return; // skip empty
    const fields = [];
    let j = 0;
    let field = '';
    let inF = false;
    while (j < lineStr.length) {
      const ch = lineStr[j];
      if (!inF) {
        if (ch === '"') { inF = true; j++; continue; }
        if (ch === ',') { fields.push(field); field = ''; j++; continue; }
        field += ch;
        j++;
        continue;
      }
      if (ch === '"') {
        if (j + 1 < lineStr.length && lineStr[j + 1] === '"') {
          field += '"';
          j += 2;
          continue;
        }
        inF = false;
        j++;
        continue;
      }
      field += ch;
      j++;
    }
    fields.push(field);
    lines.push(fields);
  }

  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === '\r') {
      // skip CR
    } else if (ch === '\n' && !inQuotes) {
      if (current.length > 0) {
        flushLine(current);
      }
      current = '';
    } else {
      current += ch;
    }
    i++;
  }
  if (current.length > 0) {
    flushLine(current);
  }
  return lines;
}

// ---- CSV Serializer ----
function escapeCSV(val) {
  if (val == null || val === '') return '';
  const s = String(val);
  if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ---- Main ----
function main() {
  // Validate files exist
  for (const p of [masterPath, batchPath]) {
    if (!fs.existsSync(p)) {
      console.error(`File not found: ${p}`);
      process.exit(1);
    }
  }

  // Read master CSV
  let masterText = fs.readFileSync(masterPath, 'utf-8');
  if (masterText.charCodeAt(0) === 0xFEFF) masterText = masterText.slice(1);
  const masterRows = parseCSV(masterText);

  // Read batch CSV
  let batchText = fs.readFileSync(batchPath, 'utf-8');
  if (batchText.charCodeAt(0) === 0xFEFF) batchText = batchText.slice(1);
  const batchRows = parseCSV(batchText);

  if (masterRows.length < 2) {
    console.error('Master CSV has no data rows');
    process.exit(1);
  }

  // Column indices (from master header)
  const header = masterRows[0];
  const colIndex = {};
  const expectedColumns = ['id','level','word','article','plural','translation','example','partOfSpeech','topic','tags','lessonId'];
  for (const col of expectedColumns) {
    const idx = header.indexOf(col);
    if (idx === -1) {
      console.error(`Column "${col}" not found in master CSV header. Found: ${header.join(', ')}`);
      process.exit(1);
    }
    colIndex[col] = idx;
  }

  // Build lookup set from master: key = normalized level + normalized German word
  const masterLookup = new Set();
  const masterDataRows = masterRows.slice(1);

  for (const row of masterDataRows) {
    const level = (row[colIndex['level']] || '').trim().toLowerCase();
    const word = (row[colIndex['word']] || '').trim().toLowerCase().replace(/\s+/g, ' ');
    // Also normalize article prefix that might be baked into the word
    const wordWithoutArticle = word.replace(/^(der|die|das)\s+/, '');
    masterLookup.add(`${level}::${word}`);
    if (wordWithoutArticle !== word) {
      masterLookup.add(`${level}::${wordWithoutArticle}`);
    }
  }

  // Level-specific ID counters: find last used ID per level
  // Original style: A1_v001 (level prefix + _v + 3-digit num)
  // New style: a1_0001 (lowercase level prefix + _ + 4-digit num)
  const levelMaxId = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
  const idPatternOld = /^([a-z]+\d+_v)(\d{3})$/i;
  const idPatternNew = /^([a-z]+_\d+_)(\d{4})$/i;

  function getNumericId(id) {
    let m = String(id).match(idPatternOld);
    if (m) return parseInt(m[2], 10);
    m = String(id).match(idPatternNew);
    if (m) return parseInt(m[2], 10);
    return 0;
  }

  for (const row of masterDataRows) {
    const lvl = (row[colIndex['level']] || '').trim();
    const id = (row[colIndex['id']] || '').trim();
    const num = getNumericId(id);
    if (levelMaxId[lvl] !== undefined && num > levelMaxId[lvl]) {
      levelMaxId[lvl] = num;
    }
  }

  // Process batch rows
  const validLevels = new Set(['A1','A2','B1','B2','C1']);
  let added = 0;
  let skippedDuplicate = 0;
  let badLevel = 0;
  const addedRows = [];

  for (const row of batchRows.slice(1)) { // skip batch header
    if (!row || row.length < colIndex['level'] + 1) continue;

    const level = (row[colIndex['level']] || '').trim().toUpperCase();
    if (!validLevels.has(level)) {
      badLevel++;
      continue;
    }

    const word = (row[colIndex['word']] || '').trim().replace(/\s+/g, ' ');
    if (!word) continue; // skip totally empty rows

    const wordNorm = word.toLowerCase();
    const wordWithoutArticle = wordNorm.replace(/^(der|die|das)\s+/, '');
    const key1 = `${level.toLowerCase()}::${wordNorm}`;
    const key2 = `${level.toLowerCase()}::${wordWithoutArticle}`;

    // Check against both master and already-added rows in this batch
    if (masterLookup.has(key1) || masterLookup.has(key2)) {
      skippedDuplicate++;
      continue;
    }

    // Also check against already-added in this batch
    let alreadyInBatch = false;
    for (const addedRow of addedRows) {
      const aLevel = (addedRow[colIndex['level']] || '').trim().toLowerCase();
      const aWord = (addedRow[colIndex['word']] || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const aKey1 = `${aLevel}::${aWord}`;
      const aKey2 = `${aLevel}::${aWord.replace(/^(der|die|das)\s+/, '')}`;
      if (aKey1 === key1 || aKey1 === key2 || aKey2 === key1 || aKey2 === key2) {
        alreadyInBatch = true;
        break;
      }
    }
    if (alreadyInBatch) {
      skippedDuplicate++;
      continue;
    }

    // Handle ID
    let id = (row[colIndex['id']] || '').trim();
    if (!id) {
      // Generate stable ID matching legacy A1_vNNN style
      levelMaxId[level]++;
      const levelPrefix = level.toUpperCase();
      const numPart = String(levelMaxId[level]).padStart(3, '0');
      id = `${levelPrefix}_v${numPart}`;
    }

    // Build the new row preserving all fields from batch
    const newRow = [...header];
    newRow[colIndex['id']] = id;
    // level and word already in row, just keep them

    // Fill in from batch row (which has same column order)
    for (let c = 0; c < header.length; c++) {
      const val = (row[c] != null) ? row[c].trim() : '';
      if (val || c === colIndex['id']) {
        newRow[c] = c === colIndex['id'] ? id : val;
      }
    }

    addedRows.push(newRow);
    added++;
  }

  // Generate output CSV
  const allRows = [header, ...masterDataRows, ...addedRows];
  const csvLines = allRows.map(row => {
    return row.map((val, idx) => escapeCSV(val)).join(',');
  });

  // Add BOM
  const bom = '\uFEFF';
  const output = bom + csvLines.join('\r\n');

  fs.writeFileSync(masterPath, output, 'utf-8');

  // Report
  const oldTotal = masterDataRows.length;
  const batchTotal = batchRows.length - 1;
  const finalTotal = oldTotal + added;

  console.log('=== Merge Report ===');
  console.log(`Old total count:     ${oldTotal}`);
  console.log(`New batch count:     ${batchTotal}`);
  console.log(`Added count:         ${added}`);
  console.log(`Skipped duplicates:  ${skippedDuplicate}`);
  console.log(`Final total count:   ${finalTotal}`);

  // Count per level
  const levelCounts = {};
  for (const row of [...masterDataRows, ...addedRows]) {
    const lvl = (row[colIndex['level']] || '').trim();
    levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
  }
  console.log('\nCount per level:');
  for (const lvl of ['A1','A2','B1','B2','C1']) {
    console.log(`  ${lvl}: ${levelCounts[lvl] || 0}`);
  }

  if (badLevel > 0) {
    console.log(`\nRows with invalid levels skipped: ${badLevel}`);
  }
}

main();
