import fs from 'fs';

const validLessons = new Set(Array.from({length: 25}, (_, i) => 'C1_lesson_' + (i+1)));
const data = JSON.parse(fs.readFileSync('listening.json', 'utf8'));
const items = data.C1 || [];

console.log('=== SUB-BATCH 1A VALIDATION ===\n');
console.log('C1 listening count: ' + items.length);

// Duplicate IDs
const ids = items.map(v => v.id);
const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
console.log('Duplicate IDs: ' + (dupIds.length > 0 ? [...new Set(dupIds)].join(', ') : 'none'));

// Broken lessonIds
const noLesson = items.filter(v => !v.lessonId);
const broken = items.filter(v => v.lessonId && !validLessons.has(v.lessonId));
console.log('Missing lessonId: ' + noLesson.length + ', Broken: ' + broken.length);

// Duplicate QIDs
const allQids = {};
let dupQ = 0;
items.forEach(v => v.questions.forEach(q => {
  if (allQids[q.id]) { console.log('Dup qid: ' + q.id); dupQ++; }
  allQids[q.id] = v.id;
}));
if (!dupQ) console.log('Duplicate question IDs: none');

// Missing fields
let missing = 0;
items.forEach(v => {
  ['id','title','script','questions','level','lessonId'].forEach(f => { if (!v[f]) { console.log('MISS ' + f + ' on ' + v.id); missing++; }});
  if (v.level !== 'C1') { console.log('Wrong level: ' + v.id); missing++; }
  if (!v.script || v.script.length < 20) { console.log('Short script: ' + v.id); missing++; }
  if (!v.questions || v.questions.length === 0) { console.log('No questions: ' + v.id); missing++; }
  else v.questions.forEach(q => {
    if (!q.question) { console.log('MISS question text on ' + v.id); missing++; }
    if (!q.answer) { console.log('MISS answer on ' + v.id + ' q:' + q.id); missing++; }
    if (['mcq','gap-fill','opinion-match'].includes(q.type) && (!q.options || !Array.isArray(q.options) || q.options.length < 2)) {
      console.log('MISS/bad options: ' + v.id + ' q:' + q.id + ' type:' + q.type + ' opts:' + JSON.stringify(q.options));
      missing++;
    }
  });
});
if (!missing) console.log('Required fields: all present');

// Mojibake
let moji = 0;
function checkM(obj, p) {
  if (typeof obj === 'string') { for (let i = 0; i < obj.length-1; i++) if (obj.charCodeAt(i) === 0xC3 && obj.charCodeAt(i+1) > 0x7F) { console.log('MOJI at ' + p); moji++; return; } return; }
  if (Array.isArray(obj)) { obj.forEach((item,i) => checkM(item, p+'['+i+']')); return; }
  if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => checkM(obj[k], p+'.'+k)); }
}
items.forEach(v => checkM(v, v.id));
console.log('Mojibake: ' + (moji > 0 ? 'FOUND ' + moji : 'none'));

// Lesson distribution
const dist = {};
items.forEach(v => { dist[v.lessonId] = (dist[v.lessonId]||0)+1; });
console.log('Lesson dist:', JSON.stringify(dist));

const ok = dupIds.length===0 && broken.length===0 && !dupQ && missing===0 && moji===0;
console.log('\nSub-batch 1A: ' + (ok ? 'PASS' : 'FAIL'));
