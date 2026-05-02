// Direct mojibake fix: replace known 3 byte-patterns found in C1 content
import fs from 'fs';

function fixFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  let totalFixed = 0;
  
  // Ensure level + lessonId (already applied, but safe to re-do)
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') v.level = 'C1';
  });
  
  function fixString(str) {
    let result = '';
    let i = 0;
    let fixed = 0;
    
    while (i < str.length) {
      const cp = str.charCodeAt(i);
      
      // Check for the three mojibake patterns found in the files:
      if (cp === 0xC3 && i + 1 < str.length) {
        const next = str.charCodeAt(i + 1);
        
        if (next === 0x201E) {
          // 0xC3 0x201E = corrupted Ä → Ä (U+00C4)
          result += '\u00C4';
          i += 2;
          fixed++;
          continue;
        } else if (next === 0x178) {
          // 0xC3 0x0178 = corrupted ß → ß (U+00DF)
          result += '\u00DF';
          i += 2;
          fixed++;
          continue;
        } else if (next === 0x153) {
          // 0xC3 0x0153 = corrupted Ü → Ü (U+00DC)
          result += '\u00DC';
          i += 2;
          fixed++;
          continue;
        }
      }
      
      result += str[i];
      i++;
    }
    
    return { result, fixed };
  }
  
  function walk(obj, path) {
    if (!obj) return;
    if (Array.isArray(obj)) { obj.forEach((item, idx) => walk(item, path + '[' + idx + ']')); return; }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          const { result, fixed } = fixString(obj[k]);
          if (fixed > 0) {
            totalFixed += fixed;
            console.log(file + ': fixed ' + fixed + ' chars in ' + path + '.' + k);
            console.log('  BEFORE: ' + obj[k].substring(Math.max(0, obj[k].indexOf('\u00C3') - 5), Math.min(obj[k].length, obj[k].indexOf('\u00C3') + 10)));
            console.log('  AFTER:  ' + result.substring(Math.max(0, result.indexOf('Ä') - 5 >= 0 ? result.indexOf('Ä') - 5 : 0), Math.min(result.length, result.indexOf('Ä') + 10)));
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

let total = 0;
total += fixFile('reading.json');
total += fixFile('listening.json');
total += fixFile('writing.json');
total += fixFile('speaking.json');
console.log('\nGRAND TOTAL: ' + total + ' mojibake fixes');

// VERIFY
console.log('\n=== VERIFICATION ===');
['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  const name = f.replace('.json','').toUpperCase();
  
  let moji = 0;
  function checkMojibake(obj, path) {
    if (typeof obj === 'string') {
      for (let i = 0; i < obj.length - 1; i++) {
        const cp = obj.charCodeAt(i);
        if (cp === 0xC3) {
          console.log('MOJI REMAINING: ' + name + ' ' + path + ': ' + obj.substring(Math.max(0,i-5), i+10));
          moji++;
        }
      }
      return;
    }
    if (Array.isArray(obj)) { obj.forEach((item, idx) => checkMojibake(item, path + '[' + idx + ']')); return; }
    if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => checkMojibake(obj[k], path + '.' + k)); }
  }
  items.forEach(v => checkMojibake(v, v.id));
  
  console.log(name + ': count=' + items.length + ', mojibake=' + (moji > 0 ? 'FAIL (' + moji + ')' : 'PASS'));
  console.log('  Level=C1: ' + items.filter(v => v.level === 'C1').length + '/' + items.length);
  console.log('  LessonIds set: ' + items.filter(v => v.lessonId).length + '/' + items.length);
});
