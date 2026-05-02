import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

// Test: does deepCheck style work
function deepCheck(obj, path, depth) {
  if (!obj) { console.log(path + ' is null'); return; }
  if (Array.isArray(obj)) { 
    console.log(path + ' is array, len=' + obj.length);
    obj.forEach((item, idx) => deepCheck(item, path+'['+idx+']', depth+1)); 
    return; 
  }
  if (typeof obj === 'object') {
    console.log(path + ' type=' + typeof obj + ' keys=' + Object.keys(obj));
    Object.keys(obj).forEach(k => {
      console.log('  key=' + k + ' type=' + typeof obj[k]);
      if (typeof obj[k] === 'string') {
        if (obj[k].includes('\u00C3')) {
          console.log('  FOUND moji at ' + path + '.' + k);
        }
      } else if (typeof obj[k] === 'object') {
        deepCheck(obj[k], path + '.' + k, depth+1);
      }
    });
  }
}

deepCheck(items, 'items');
