import fs from 'fs';

// Test the fixString function against known mojibake
const mojibakeChars = ['\u00C3\u201E', '\u00C3\u0178', '\u00C3\u0153'];
const expectedGerman = ['Ä', 'ß', 'Ü'];

mojibakeChars.forEach((pair, idx) => {
  const str = 'test ' + pair + ' more';
  console.log('Testing: ' + str + ' -> chars: ' + str.length);
  // Run fix
  let result = '';
  let i = 0;
  while (i < str.length) {
    const cp = str.charCodeAt(i);
    if (cp === 0xC3 && i + 1 < str.length) {
      const next = str.charCodeAt(i + 1);
      if (next === 0x201E) { result += '\u00C4'; i += 2; continue; }
      if (next === 0x178) { result += '\u00DF'; i += 2; continue; }
      if (next === 0x153) { result += '\u00DC'; i += 2; continue; }
    }
    result += str[i]; i++;
  }
  console.log('  Fixed: ' + result);
  console.log('  Expected: test ' + expectedGerman[idx] + ' more');
});

// Now fix the actual files
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

function fixFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  let totalFixed = 0;
  
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') v.level = 'C1';
  });
  
  function walk(obj, path) {
    if (!obj) return;
    if (Array.isArray(obj)) { obj.forEach((item, i) => walk(item, path+'['+i+']')); return; }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          const { result, fixed } = fixString(obj[k]);
          if (fixed > 0) {
            totalFixed += fixed;
            console.log(file + ': ' + path + '.' + k + ' fixed ' + fixed + ' chars');
            obj[k] = result;
          }
        } else if (typeof obj[k] === 'object') {
          walk(obj[k], path + '.' + k);
        }
      });
    }
  }
  
  walk(items, 'C1');
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(file + ': total=' + totalFixed + ' fixes');
  return totalFixed;
}

console.log('\n=== FIXING ===');
fixFile('reading.json');
fixFile('listening.json');
fixFile('writing.json');
fixFile('speaking.json');

console.log('\n=== VERIFY ===');
['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  let moji = 0;
  function check(obj, path) {
    if (typeof obj === 'string') {
      for (let i = 0; i < obj.length; i++) {
        if (obj.charCodeAt(i) === 0xC3) {
          // Check if it's a false positive (legitimate C3 in the path name or key)
          // Only count if followed by problematic chars
          const next = i+1 < obj.length ? obj.charCodeAt(i+1) : 0;
          if (next > 0x7F) {
            console.log('MOJI: ' + path + ': ' + obj.substring(Math.max(0,i-5),i+10));
            moji++;
          }
        }
      }
      return;
    }
    if (Array.isArray(obj)) { obj.forEach((item,i) => check(item, path+'['+i+']')); return; }
    if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => check(obj[k], path+'.'+k)); }
  }
  items.forEach(v => check(v, v.id));
  console.log(f + ': mojibake=' + (moji > 0 ? 'FAIL (' + moji + ')' : 'PASS'));
  console.log('  level=C1: ' + items.filter(v => v.level === 'C1').length + '/' + items.length);
  console.log('  lessonId set: ' + items.filter(v => v.lessonId).length + '/' + items.length);
});
