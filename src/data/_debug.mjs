import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1;

// Check what the fix function actually sees in each string
items.forEach(v => {
  function scan(obj, path) {
    if (typeof obj === 'string') {
      for (let i = 0; i < obj.length - 1; i++) {
        const cp = obj.charCodeAt(i);
        if (cp === 0xC3) {
          const next = obj.charCodeAt(i + 1);
          console.log('FOUND at ' + path + ' pos ' + i + ': U+' + cp.toString(16) + ' U+' + next.toString(16));
          console.log('  Context: ' + obj.substring(Math.max(0,i-5), i+10));
          console.log('  next === 0x201E?', next === 0x201E);
          console.log('  next === 0x178?', next === 0x178);
          console.log('  next === 0x153?', next === 0x153);
        }
      }
      return;
    }
    if (Array.isArray(obj)) { obj.forEach((item, idx) => scan(item, path + '[' + idx + ']')); return; }
    if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => scan(obj[k], path + '.' + k)); }
  }
  scan(v, v.id);
});

// Now test: run fix against the actual object and see if the result changes
console.log('\n--- Running fix on C1_read_1 q[0] opt[0] ---');
const str = data.C1[0].questions[0].options[0];
console.log('Original:', JSON.stringify(str.substring(8, 12)));
let result = '';
let i = 0;
let fixed = 0;
while (i < str.length) {
  const cp = str.charCodeAt(i);
  if (cp === 0xC3 && i + 1 < str.length) {
    const next = str.charCodeAt(i + 1);
    if (next === 0x201E) { result += '\u00C4'; i += 2; fixed++; continue; }
    if (next === 0x178) { result += '\u00DF'; i += 2; fixed++; continue; }
    if (next === 0x153) { result += '\u00DC'; i += 2; fixed++; continue; }
  }
  result += str[i];
  i++;
}
console.log('Fixed version:', JSON.stringify(result.substring(8, 12)));
console.log('Chars fixed:', fixed);
console.log('Matches:', str !== result);
