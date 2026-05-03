const fs = require('fs');

function parseCSV(text) {
  const lines = [];
  let i = 0, current = '', inQuotes = false;
  function flushLine(lineStr) {
    if (!lineStr.trim()) return;
    const fields = [];
    let j = 0, field = '', inF = false;
    while (j < lineStr.length) {
      const ch = lineStr[j];
      if (!inF) {
        if (ch === '"') { inF = true; j++; continue; }
        if (ch === ',') { fields.push(field); field = ''; j++; continue; }
        field += ch; j++; continue;
      }
      if (ch === '"') {
        if (j+1 < lineStr.length && lineStr[j+1] === '"') { field += '"'; j+=2; continue; }
        inF = false; j++; continue;
      }
      field += ch; j++;
    }
    fields.push(field);
    lines.push(fields);
  }
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') { inQuotes = !inQuotes; current += ch; }
    else if (ch === '\r') {}
    else if (ch === '\n' && !inQuotes) { if (current.length > 0) flushLine(current); current = ''; }
    else { current += ch; }
    i++;
  }
  if (current.length > 0) flushLine(current);
  return lines;
}

const text = fs.readFileSync('data/vocabulary_master.csv', 'utf-8');
const clean = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
const rows = parseCSV(clean);
const header = rows[0];
const data = rows.slice(1);

const ci = {};
for (const col of ['id','level','word','article','plural','translation','example','partOfSpeech','topic','tags','lessonId']) {
  ci[col] = header.indexOf(col);
}

const B2rows = data.filter(r => r[ci.level] === 'B2');
console.log('B2 count:', B2rows.length);

const existingWords = new Set();
for (const r of B2rows) {
  let w = (r[ci.word] || '').trim().toLowerCase().replace(/^(der|die|das)\s+/, '');
  existingWords.add(w);
}
console.log('Unique existing B2 words:', existingWords.size);

const topics = new Set();
for (const r of B2rows) {
  if (r[ci.topic]) topics.add(r[ci.topic]);
}
console.log('Existing B2 topics:');
console.log([...topics].sort().join(', '));

const posSet = new Set();
for (const r of B2rows) {
  if (r[ci.partOfSpeech]) posSet.add(r[ci.partOfSpeech]);
}
console.log('\nExisting B2 parts of speech:', [...posSet].join(', '));

// Write word list
fs.writeFileSync('scripts/existing_b2.txt', [...existingWords].sort().join('\n'), 'utf-8');
console.log('\nWritten: scripts/existing_b2.txt');
