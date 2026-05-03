const f=require('fs');
const path=require('path');

// Read existing words
const existingTxt=f.readFileSync('scripts/existing_b2.txt','utf-8');
const existing=new Set(existingTxt.split('\n').map(x=>x.trim().toLowerCase().replace(/^(der|die|das) /,'')).filter(x=>x));
const batchAdded=new Set();
function nw(w){return w.trim().toLowerCase().replace(/^(der|die|das) /,'');}
function esc(v){if(v==null||v==='')return '';const s=String(v);return s.indexOf(',')>=0||s.indexOf('"')>=0?'"'+s.replace(/"/g,'""')+'"':s;}
function word(a,p,pl,tr,ex,pos,top,tag){const w=nw(a);if(existing.has(w)||batchAdded.has(w))return null;batchAdded.add(w);return ['','B2',esc(a),esc(p||''),esc(pl||''),esc(tr),esc(ex),esc(pos),esc(top),esc(tag),'B2_lesson_general'].join(',');}
const rows=[];

// Load all part files
let totalLoaded=0;
for(let i=0;i<10;i++){
  const p='scripts/b2_words_part'+i+'.json';
  try{
    const data=JSON.parse(f.readFileSync(p,'utf-8'));
    totalLoaded+=data.length;
    for(const e of data){
      const r=word(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]);
      if(r)rows.push(r);
    }
    console.log('Part '+i+': loaded '+data.length+' words, added '+rows.length+' unique so far');
  }catch(e){/* file may not exist */}
}

console.log('\nTotal loaded from JSON:',totalLoaded);
console.log('After dedup: '+rows.length+' new B2 words');

if(rows.length===0){
  console.log('No new words to add. Exiting.');
  process.exit(0);
}

// Write CSV (with BOM for Excel)
const header='id,level,word,article,plural,translation,example,partOfSpeech,topic,tags,lessonId';
const csv='\uFEFF'+header+'\n'+rows.join('\n');
f.writeFileSync('data/new_vocabulary_batch.csv',csv,'utf-8');
console.log('Wrote '+rows.length+' words to data/new_vocabulary_batch.csv');

// Now run the pipeline
// Use project root (parent of scripts dir) as base
const basedir=require('path').dirname(__dirname);
const {execSync}=require('child_process');
console.log('\n--- Merging into master CSV ---');
try{
  execSync('node scripts/mergeVocabularyBatch.cjs',{stdio:'inherit',cwd:basedir});
}catch(e){
  console.error('Merge failed:',e.message);
  process.exit(1);
}

console.log('\n--- Importing to JSON ---');
try{
  execSync('node scripts/importVocabulary.cjs',{stdio:'inherit',cwd:basedir});
}catch(e){
  console.error('Import failed:',e.message);
  process.exit(1);
}

console.log('\n--- Running build ---');
try{
  execSync('npm run build 2>&1',{stdio:'inherit',cwd:basedir});
}catch(e){
  console.error('Build failed:',e.message);
  process.exit(1);
}

console.log('\nDONE! Pipeline completed successfully.');
