import fs from 'fs';

['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  
  items.forEach(v => {
    function scan(obj, path) {
      if (typeof obj === 'string') {
        for (let i = 0; i < obj.length - 1; i++) {
          const cp1 = obj.charCodeAt(i);
          const cp2 = obj.charCodeAt(i + 1);
          if (cp1 === 0xC3) {
            // Show the exact char pair with hex codes
            const c1hex = cp1.toString(16).toUpperCase();
            const c2hex = cp2.toString(16).toUpperCase();
            console.log(f + ' ' + path + ': 0x' + c1hex + ' 0x' + c2hex + ' (' + obj[i] + obj[i+1] + ') context: ' + obj.substring(Math.max(0,i-3), i+8));
          }
        }
        return;
      }
      if (Array.isArray(obj)) { obj.forEach((item, idx) => scan(item, path + '[' + idx + ']')); return; }
      if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => scan(obj[k], path + '.' + k)); }
    }
    scan(v, v.id);
  });
});
