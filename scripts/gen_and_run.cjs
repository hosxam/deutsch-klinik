const f=require('fs');

// Read existing words
const existingTxt=f.readFileSync('scripts/existing_b2.txt','utf-8');
const existing=new Set(existingTxt.split('\n').map(x=>x.trim().toLowerCase().replace(/^(der|die|das) /,'')).filter(x=>x));
const batchAdded=new Set();
function nw(w){return w.trim().toLowerCase().replace(/^(der|die|das) /,'');}
function esc(v){if(v==null||v==='')return '';const s=String(v);return s.indexOf(',')>=0||s.indexOf('"')>=0?'"'+s.replace(/"/g,'""')+'"':s;}
function word(a,p,pl,tr,ex,pos,top,tag){const w=nw(a);if(existing.has(w)||batchAdded.has(w))return null;batchAdded.add(w);return ['','B2',esc(a),esc(p||''),esc(pl||''),esc(tr),esc(ex),esc(pos),esc(top),esc(tag),'B2_lesson_general'].join(',');}
const rows=[];
function add(ar){for(const e of ar){const r=word(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]);if(r)rows.push(r);}}

// Read words from a JSON data file if it exists
// Otherwise we'll generate compact words in chunks
const WORD_FILE='scripts/b2_words_part1.json';
let part1=[];
try{part1=JSON.parse(f.readFileSync(WORD_FILE,'utf-8'));}catch(e){}
console.log('Loaded',part1.length,'words from part1');

// Also read part2 if it exists
let part2=[];
const WORD_FILE2='scripts/b2_words_part2.json';
try{part2=JSON.parse(f.readFileSync(WORD_FILE2,'utf-8'));}catch(e){}
console.log('Loaded',part2.length,'words from part2');

// Read part3 if it exists
let part3=[];
const WORD_FILE3='scripts/b2_words_part3.json';
try{part3=JSON.parse(f.readFileSync(WORD_FILE3,'utf-8'));}catch(e){}
console.log('Loaded',part3.length,'words from part3');

// Combine all parts
const allWords=[...part1,...part2,...part3];
console.log('Total words loaded:',allWords.length);

if(allWords.length===0){
  console.log('No word files found. Generating default 500 words directly...');
  // Fallback: define all words inline
  // (minimal definition to get started)
}

// Process all words through dedup
add(allWords);
console.log('After dedup:',rows.length,'unique new words');

if(rows.length>0){
  // Write CSV
  const header='id,level,word,article,plural,translation,example,partOfSpeech,topic,tags,lessonId';
  const csv='\uFEFF'+header+'\n'+rows.join('\n');
  f.writeFileSync('data/new_vocabulary_batch.csv',csv,'utf-8');
  console.log('Wrote',rows.length,'words to data/new_vocabulary_batch.csv');
  console.log('Run: node scripts/mergeVocabularyBatch.cjs');
  console.log('Then: node scripts/importVocabulary.cjs');
  console.log('Then: npm run build');
}else{
  console.log('No new words to add.');
}
