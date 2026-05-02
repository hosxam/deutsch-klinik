import fs from 'fs';

const files = ['fsp_batch4_pt1', 'fsp_batch4_pt2', 'fsp_batch4_pt3'];

files.forEach(f => {
  let c = fs.readFileSync('scripts/' + f + '.json', 'utf8');
  
  // Replace all occurrences of nested arrays: , ["...", "..."]
  // This regex matches a comma followed by a nested JSON array
  c = c.replace(/,\s*\["([^"]*)"(?:\s*,\s*"([^"]*)")?\s*\]/g, ', "$1", "$2"');
  
  // Clean up trailing comma+space from cases where we got extra empty strings
  c = c.replace(/, "",/g, ',');
  c = c.replace(/"", /g, '');
  
  try {
    JSON.parse(c);
    console.log(f + ': FIXED and valid');
  } catch(e) {
    console.log(f + ': STILL BROKEN - ' + e.message.slice(0, 120));
    // Find the exact broken spot
    const m = e.message.match(/position (\d+)/);
    if (m) {
      const pos = parseInt(m[1]);
      console.log('  Around pos ' + pos + ': ...' + c.substring(Math.max(0,pos-40), Math.min(c.length,pos+40)) + '...');
    }
  }
  
  fs.writeFileSync('scripts/' + f + '.json', c);
});
