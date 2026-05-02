import fs from 'fs';
const text = fs.readFileSync('_add_c1_listen_batch1b.mjs', 'utf8');
const lines = text.split('\n');
lines.forEach((line, i) => {
  let opens = 0, closes = 0;
  let inStr = false, esc = false;
  for (let j = 0; j < line.length; j++) {
    if (esc) { esc = false; continue; }
    if (line[j] === '\\') { esc = true; continue; }
    if (line[j] === "'" && !esc) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (line[j] === '[') opens++;
    if (line[j] === ']') closes++;
  }
  if (opens > 0 && opens !== closes) {
    console.log('Line ' + (i+1) + ': opens=' + opens + ' closes=' + closes + ' -> ' + line.trim().substring(0, 120));
  }
});
