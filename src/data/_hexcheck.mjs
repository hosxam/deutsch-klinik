import fs from 'fs';
const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const c1_read_1 = data.C1[0];
const opt = c1_read_1.questions[0].options[0];
console.log('Option:', opt);
console.log('Code points:');
for (let i = 0; i < opt.length; i++) {
  const cp = opt.codePointAt(i);
  console.log('  [' + i + '] U+' + cp.toString(16).toUpperCase() + ' = ' + opt[i]);
  if (cp > 0xFFFF) i++; // skip surrogate pairs
}
