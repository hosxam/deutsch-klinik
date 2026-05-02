import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

// Ultra direct approach: manually traverse and fix
let totalFixed = 0;

// C1_read_1.q[0].options[0] 
const opt1 = items[0].questions[0].options;
console.log('opt1[0] before:', opt1[0]);
console.log('opt1[0] has mojibake:', opt1[0].includes('\u00C3'));

// Direct character-by-character fix
let s = opt1[0];
let result = '';
for (let i = 0; i < s.length; i++) {
  const cp = s.charCodeAt(i);
  if (cp === 0xC3 && i + 1 < s.length) {
    const next = s.charCodeAt(i + 1);
    console.log('Found 0xC3 at pos', i, 'next=U+' + next.toString(16));
    if (next === 0x201E) {
      result += '\u00C4';
      i++;
      continue;
    }
  }
  result += s[i];
}
// Re-check the approach
s = opt1[0];
result = '';
for (let i = 0; i < s.length; i++) {
  const cp = s.charCodeAt(i);
  if (cp === 0xC3) {
    const next = s.charCodeAt(i + 1);
    if (next === 0x201E) {
      result += '\u00C4';
      i++;
      continue;
    }
    if (next === 0x178) {
      result += '\u00DF';
      i++;
      continue;
    }
    if (next === 0x153) {
      result += '\u00DC';
      i++;
      continue;
    }
  }
  result += s[i];
}
console.log('Fixed option:', result);
console.log('Changed:', s !== result);
