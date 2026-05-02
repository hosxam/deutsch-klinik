import fs from 'fs';

const badChars = ['\u00c3\u00b8', '\u00c3\u2013', '\u00c3\u0178', '\u00c2', '\u00c3\u201e', '\u00c3\u00a4', '\u00c3\u2013', '\u00c3\u2013'];

['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, ln) => {
    // Look for the specific corrupted byte sequences
    const codes = Array.from(line);
    for (let i = 0; i < codes.length - 1; i++) {
      const c1 = codes[i].charCodeAt(0);
      const c2 = codes[i+1] ? codes[i+1].charCodeAt(0) : 0;
      // The mojibake pattern: 0xC3 followed by a high-byte character
      if (c1 === 0xC3 && c2 >= 0x80) {
        const hex = c2.toString(16);
        // These are what appear as ÃŸ, Ã„, Ã–, Ã¼, Ã¤ etc.
        // Let me print the actual hex bytes
        console.log(f + ' L' + (ln+1) + ': byte 0xC3 0x' + hex + ' context: ' + line.substring(Math.max(0,i-10), i+20));
        break; // one per line is enough
      }
    }
  });
});
