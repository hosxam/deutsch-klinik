const fs = require('fs');
const content = fs.readFileSync('scripts/generate_b2_batch.cjs', 'utf-8');
let n = 0;
for (const line of content.split('\n')) {
  const t = line.trimStart();
  if (t.startsWith("['") && t.includes("','")) n++;
}
console.log('Word entries in current file:', n);
console.log('Need 500, deficit:', 500 - n);
