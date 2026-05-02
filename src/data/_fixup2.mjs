import fs from 'fs';

function fixFile(file, specificId, fixes) {
  let text = fs.readFileSync(file, 'utf8');
  let fixed = 0;
  
  fixes.forEach(([malformed, correct]) => {
    // Use a regex that matches the malformed bytes
    // The file is already decoded as UTF-8. The malformed characters appear as 
    // specific Unicode codepoints because the file was double-encoded.
    let count = 0;
    const newText = text.split(malformed).join(correct);
    count = (text.split(malformed).length - 1);
    text = newText;
    if (count > 0) {
      fixed += count;
      console.log(file + ': replaced ' + count + 'x "' + malformed.substring(0,2) + '" -> "' + correct + '" (for ' + specificId + ')');
    }
  });
  
  fs.writeFileSync(file, text, 'utf8');
  return fixed;
}

// C1-only mojibake fixes - targeted by context (we fix the known corrupted chars globally but only for C1 items)
// Actually, since we can't easily scope replacements to C1 items only within the text,
// and the corrupted chars are the same across all levels, let's fix ALL instances
// but only for the C1-relevant corrupted character patterns

// Wait - the instruction says fix C1 mojibake only. But if I fix "Ã„rzte" globally,
// it fixes A1 "Ã„rzte" too. That's fine - it's fixing corruption that affects all levels.
// The C1-specific fix locations are a subset of the global issue.

// Let me just fix C1 items by only touching C1 sections.
// I'll parse the JSON, fix C1 items only, and write back.

const readingFixesMap = {
  'C1_read_1': [
    ['Ã„rzte', 'Ärzte'],
    ['SchlieÃŸung', 'Schließung'],
  ],
  'C1_read_2': [
    ['Ã„rzte', 'Ärzte'],
    ['Ã„rztemangel', 'Ärztemangel'],
  ],
  'C1_read_3': [
    ['GroÃŸstädte', 'Großstädte'],
    ['MaÃŸnahmen', 'Maßnahmen'],
  ],
};

const listeningFixesMap = {
  'C1_listen_1': [
    ['gröÃŸte', 'größte'],
  ],
  'C1_listen_2': [],
  'C1_listen_3': [
    ['Ã„rzte', 'Ärzte'],
    ['Ã–ztürk', 'Öztürk'],
    ['Ã„quivalenz', 'Äquivalenz'],
  ],
};

function fixC1Items(file, fixesMap) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  let fixed = 0;
  
  items.forEach(v => {
    const itemFixes = fixesMap[v.id];
    if (!itemFixes || itemFixes.length === 0) return;
    
    function scanAndFix(obj) {
      if (!obj) return;
      if (typeof obj === 'string') {
        // handled at parent level - we mutate strings directly
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach(scanAndFix);
        return;
      }
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          itemFixes.forEach(([from, to]) => {
            if (obj[k].includes(from)) {
              obj[k] = obj[k].split(from).join(to);
              fixed++;
            }
          });
        } else if (typeof obj[k] === 'object') {
          scanAndFix(obj[k]);
        }
      });
    }
    scanAndFix(v);
  });
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(file + ': fixed ' + fixed + ' mojibake instances in C1 items');
  return fixed;
}

const r = fixC1Items('reading.json', readingFixesMap);
const l = fixC1Items('listening.json', listeningFixesMap);

// Also verify writing for C1 mojibake
const wData = JSON.parse(fs.readFileSync('writing.json', 'utf8'));
const wItems = wData.C1 || [];
let wFixed = 0;
wItems.forEach(v => {
  function scan(obj) {
    if (typeof obj === 'string') {
      const found = [];
      ['Ã„rzte','Ã„rztemangel','PräventionsmaÃŸnahmen'].forEach(p => {
        if (obj.includes(p)) { found.push(p); }
      });
      return found;
    }
    if (Array.isArray(obj)) { return obj.flatMap(scan); }
    if (obj && typeof obj === 'object') {
      return Object.values(obj).flatMap(scan);
    }
    return [];
  }
  const found = scan(v);
  if (found.length) {
    console.log('writing.json ' + v.id + ' still has mojibake: ' + found.join(', '));
  }
});
if (wFixed === 0) console.log('writing.json: no C1 mojibake found to fix');

// Also verify speaking
const sData = JSON.parse(fs.readFileSync('speaking.json', 'utf8'));
const sItems = sData.C1 || [];
let sHasMoji = false;
sItems.forEach(v => {
  function scan(obj) {
    if (typeof obj === 'string') {
      if (obj.includes('ÃŸ') || obj.includes('Ã„') || obj.includes('Ã¶') || obj.includes('Ã¼') || obj.includes('Ã–') || obj.includes('Ãœ')) {
        return [obj.substring(0,30)];
      }
      return [];
    }
    if (Array.isArray(obj)) { return obj.flatMap(scan); }
    if (obj && typeof obj === 'object') { return Object.values(obj).flatMap(scan); }
    return [];
  }
  const found = scan(v);
  if (found.length) {
    console.log('speaking.json ' + v.id + ' has mojibake: ' + found.join(', '));
    sHasMoji = true;
  }
});
if (!sHasMoji) console.log('speaking.json: no C1 mojibake found');
