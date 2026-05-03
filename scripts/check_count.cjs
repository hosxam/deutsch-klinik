const f=require('fs');
const c=f.readFileSync('scripts/gen_b2_compact.cjs','utf-8');
let n=0;
for(const l of c.split('\n')) {
  const t=l.trimStart();
  if(t.startsWith("['")&&t.includes("','")) n++;
}
console.log('Entries in gen_b2_compact.cjs:', n);
console.log('File ends with:', c.slice(-100));
