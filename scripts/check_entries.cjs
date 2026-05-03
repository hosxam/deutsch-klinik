const f=require('fs');
const c=f.readFileSync('scripts/generate_new_batch.cjs','utf-8');
let n=0;
for(const l of c.split('\n')){
  if(l.trimStart().startsWith("['") && l.includes("','")) n++;
}
console.log('Entries in file:', n);
console.log('Last 50 chars:', c.slice(-50));
