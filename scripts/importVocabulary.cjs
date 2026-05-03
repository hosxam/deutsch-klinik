#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const csvPath = path.resolve(__dirname, '..', 'data', 'vocabulary_master.csv');
const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'germanVocabulary.json');
const backupPath = path.resolve(__dirname, '..', 'src', 'data', 'germanVocabulary.pre-import-backup.json');
const originalPath = path.resolve(__dirname, '..', 'src', 'data', 'germanVocabulary.json');

// ---- CSV Parser ----
function parseCSV(text) {
  const lines = [];
  let i = 0;
  let current = '';
  let inQuotes = false;

  function flushLine(lineStr) {
    // Parse fields respecting quotes
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
      // inside quotes
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

// ---- Main ----
function main() {
  // Step 1: Read CSV
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found: ${csvPath}`);
    process.exit(1);
  }
  let csvText = fs.readFileSync(csvPath, 'utf-8');
  // Strip UTF-8 BOM if present
  if (csvText.charCodeAt(0) === 0xFEFF) {
    csvText = csvText.slice(1);
  }
  const rows = parseCSV(csvText);

  if (rows.length < 2) {
    console.error('CSV has no data rows');
    process.exit(1);
  }

  const header = rows[0];
  const dataRows = rows.slice(1);

  // Map header to indices
  const colIndex = {};
  const expectedColumns = ['id','level','word','article','plural','translation','example','partOfSpeech','topic','tags','lessonId'];
  for (const col of expectedColumns) {
    const idx = header.indexOf(col);
    if (idx === -1) {
      console.error(`Column "${col}" not found in CSV header. Found: ${header.join(', ')}`);
      process.exit(1);
    }
    colIndex[col] = idx;
  }

  // Stats counters
  const validLevels = new Set(['A1','A2','B1','B2','C1']);
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
  let duplicatesSkipped = 0;
  let missArticle = 0;
  let missPlural = 0;
  let missTrans = 0;
  let missExample = 0;
  let totalValid = 0;
  const seenIds = new Set();

  // Build the output structure
  const output = {};

  for (const row of dataRows) {
    const level = (row[colIndex['level']] || '').trim();
    if (!validLevels.has(level)) continue;

    let id = (row[colIndex['id']] || '').trim();
    if (!id) {
      // Generate stable ID
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      const levelPrefix = level.toLowerCase().replace(/([a-z])(\d)/, '$1_$2');
      id = `${levelPrefix}_${String(levelCounts[level]).padStart(4, '0')}`;
    }

    // Dedup
    if (seenIds.has(id)) {
      duplicatesSkipped++;
      continue;
    }
    seenIds.add(id);

    const getField = (col) => {
      const val = row[colIndex[col]];
      return (val != null) ? val.trim() : '';
    };

    const word = getField('word');
    const translation = getField('translation');
    const article = getField('article');
    const plural = getField('plural');
    const example = getField('example');
    const partOfSpeech = getField('partOfSpeech');
    const topic = getField('topic');
    const lessonId = getField('lessonId');

    // Tags: semicolon-separated string back to array
    let tags = [];
    const tagsRaw = getField('tags');
    if (tagsRaw) {
      tags = tagsRaw.split(';').map(t => t.trim()).filter(t => t.length > 0);
    }

    // Stats
    if (!article) missArticle++;
    if (!plural) missPlural++;
    if (!translation) missTrans++;
    if (!example) missExample++;

    if (!output[level]) output[level] = [];
    output[level].push({
      id,
      level,
      word,
      translation,
      article,
      plural,
      example,
      exampleTranslation: '',
      tags,
      lessonId,
      partOfSpeech,
      topic
    });

    levelCounts[level]++;
    totalValid++;
  }

  // Step 2: Create backup of original file
  if (fs.existsSync(originalPath)) {
    fs.copyFileSync(originalPath, backupPath);
    console.log(`Backup created: ${path.relative(path.resolve(__dirname, '..'), backupPath)}`);
  }

  // Step 3: Write output
  const jsonStr = JSON.stringify(output, null, 2);
  fs.writeFileSync(outputPath, jsonStr, 'utf-8');
  console.log(`Written: ${path.relative(path.resolve(__dirname, '..'), outputPath)}`);

  // Step 4: Print report
  console.log('\n=== Import Report ===');
  console.log(`Total words: ${totalValid}`);
  console.log('Count per level:');
  for (const lvl of ['A1','A2','B1','B2','C1']) {
    console.log(`  ${lvl}: ${levelCounts[lvl]}`);
  }
  console.log(`Duplicates skipped: ${duplicatesSkipped}`);
  console.log(`Missing article count: ${missArticle}`);
  console.log(`Missing plural count: ${missPlural}`);
  console.log(`Missing translation count: ${missTrans}`);
  console.log(`Missing example count: ${missExample}`);

  // Verification step
  const verifyRaw = fs.readFileSync(outputPath, 'utf-8');
  const verifyData = JSON.parse(verifyRaw);
  let verifyTotal = 0;
  for (const lvl of ['A1','A2','B1','B2','C1']) {
    verifyTotal += (verifyData[lvl] || []).length;
  }
  console.log(`\nVerification: Re-read file has ${verifyTotal} words.`);
  if (verifyTotal === totalValid) {
    console.log('SUCCESS: Counts match.');
  } else {
    console.log(`WARNING: Count mismatch. Expected ${totalValid}, got ${verifyTotal}.`);
  }
}

main();
