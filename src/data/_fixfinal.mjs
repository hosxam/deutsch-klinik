import fs from 'fs';

['reading.json','listening.json','writing.json','speaking.json'].forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  let totalFixed = 0;
  
  // Ensure level+lessonId
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') v.level = 'C1';
  });
  
  // Same working traversal as debug6
  function fixStrings(obj) {
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => {
        if (typeof item === 'string') {
          const orig = item;
          let result = '';
          let fixed = 0;
          let i = 0;
          while (i < orig.length) {
            const cp = orig.charCodeAt(i);
            if (cp === 0xC3 && i + 1 < orig.length) {
              const next = orig.charCodeAt(i + 1);
              if (next === 0x201E) { result += '\u00C4'; i += 2; fixed++; continue; }
              if (next === 0x178) { result += '\u00DF'; i += 2; fixed++; continue; }
              if (next === 0x153) { result += '\u00DC'; i += 2; fixed++; continue; }
            }
            result += orig[i]; i++;
          }
          if (fixed > 0) {
            obj[idx] = result;
            totalFixed += fixed;
          }
        } else if (item && typeof item === 'object') {
          fixStrings(item);
        }
      });
      return;
    }
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(k => fixStrings(obj[k]));
    }
  }
  
  fixStrings(items);
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(file + ': fixed ' + totalFixed + ' mojibake');
});

// Verify
console.log('\n=== VERIFY ===');
['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  let moji = 0;
  function check(obj) {
    if (typeof obj === 'string') { for (let i = 0; i < obj.length; i++) if (obj.charCodeAt(i) === 0xC3) moji++; return; }
    if (Array.isArray(obj)) { obj.forEach(check); return; }
    if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => check(obj[k])); }
  }
  check(items);
  console.log(f + ': mojibake=' + (moji > 0 ? 'FAIL('+moji+')' : 'PASS'));
  console.log('  level=C1: ' + items.filter(v => v.level === 'C1').length + '/' + items.length);
  console.log('  lessonId set: ' + items.filter(v => v.lessonId).length + '/' + items.length);
});
