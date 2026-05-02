import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

// Direct check - just manually access and fix
console.log('Direct check of C1_read_1 q[0] opt[0]:');
const str = items[0].questions[0].options[0];
console.log('  String:', JSON.stringify(str));
console.log('  Contains 0xC3:', str.includes('\u00C3'));
console.log('  codepoints:', Array.from(str).map(c => 'U+' + c.charCodeAt(0).toString(16).toUpperCase()).join(' '));

// Check walk's actual behavior by a simpler loop
let totalFixed = 0;
for (let vi = 0; vi < items.length; vi++) {
  const v = items[vi];
  // Recursively check all string values
  function deepCheck(obj, path) {
    if (!obj) return;
    if (Array.isArray(obj)) { obj.forEach((item, i) => deepCheck(item, path+'['+i+']')); return; }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          if (obj[k].includes('\u00C3')) {
            console.log('FOUND moji in ' + path + '.' + k + ' = ' + obj[k].substring(0, 30));
            // Fix it directly
            const orig = obj[k];
            let result = '';
            let i = 0;
            while (i < orig.length) {
              const cp = orig.charCodeAt(i);
              if (cp === 0xC3 && i + 1 < orig.length) {
                const next = orig.charCodeAt(i + 1);
                if (next === 0x201E) { result += '\u00C4'; i += 2; totalFixed++; continue; }
                if (next === 0x178) { result += '\u00DF'; i += 2; totalFixed++; continue; }
                if (next === 0x153) { result += '\u00DC'; i += 2; totalFixed++; continue; }
              }
              result += orig[i]; i++;
            }
            obj[k] = result;
          }
        } else if (typeof obj[k] === 'object') {
          deepCheck(obj[k], path + '.' + k);
        }
      });
    }
  }
  deepCheck(v, v.id);
}

console.log('Total fixed in this direct run:', totalFixed);

if (totalFixed > 0) {
  fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('File written');
}

// Final verify
const data2 = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
let remaining = 0;
function checkMoji(obj, path) {
  if (typeof obj === 'string') {
    for (let i = 0; i < obj.length; i++) {
      if (obj.charCodeAt(i) === 0xC3) {
        console.log('STILL: ' + path + ' ' + obj.substring(Math.max(0,i-5), i+10));
        remaining++;
      }
    }
    return;
  }
  if (Array.isArray(obj)) { obj.forEach((item, idx) => checkMoji(item, path+'['+idx+']')); return; }
  if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => checkMoji(obj[k], path+'.'+k)); }
}
data2.C1.forEach(v => checkMoji(v, v.id));
console.log('Remaining:', remaining);
