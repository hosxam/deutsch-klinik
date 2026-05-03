// Just run gen_b2_compact.cjs to see how many words it produces
const fs = require('fs');
const content = fs.readFileSync('scripts/gen_b2_compact.cjs', 'utf-8');
let n = 0;
for (const l of content.split('\n')) {
  const t = l.trimStart();
  if (t.startsWith("['") && t.includes("','")) n++;
}
console.log('Word entries in gen_b2_compact.cjs:', n);
console.log('Last 50 chars:', content.slice(-50));
