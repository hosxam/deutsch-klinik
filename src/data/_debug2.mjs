import fs from 'fs';

function fixString(str) {
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
    result += str[i]; i++;
  }
  return { result, fixed };
}

const file = 'reading.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const items = data.C1 || [];
let totalFixed = 0;

function walk(obj, path, depth) {
  if (depth > 20) return;
  if (!obj) return;
  if (Array.isArray(obj)) { 
    obj.forEach((item, idx) => walk(item, path+'['+idx+']', depth+1)); 
    return; 
  }
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'string') {
        // Check for mojibake
        for (let i = 0; i < obj[k].length - 1; i++) {
          if (obj[k].charCodeAt(i) === 0xC3) {
            console.log('SCAN: found 0xC3 at ' + path + '.' + k + ' pos ' + i);
            const { result, fixed } = fixString(obj[k]);
            if (fixed > 0) {
              console.log('  FIXING ' + fixed + ' chars');
              totalFixed += fixed;
              obj[k] = result;
            } else {
              console.log('  NOT FIXED by fixString!');
            }
            break;
          }
        }
      } else if (typeof obj[k] === 'object') {
        walk(obj[k], path + '.' + k, depth+1);
      }
    });
  }
}

walk(items, 'C1', 0);
console.log('Total fixed:', totalFixed);

if (totalFixed > 0) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log('Written.');
}
