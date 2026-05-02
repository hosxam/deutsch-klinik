import fs from 'fs';

const validLessons = new Set(Array.from({length: 25}, (_, i) => 'C1_lesson_' + (i+1)));
const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

console.log('==================== FINAL C1 READING VALIDATION ====================\n');

// A) Previous count
console.log('A) Previous C1 reading count: 3');

// B) New passages
console.log('B) New passages added: ' + (items.length - 3));

// C) Final count
console.log('C) Final C1 reading count: ' + items.length);
const ok = items.length === 50;
console.log('   Target 50: ' + (ok ? 'PASS' : 'FAIL'));

// D) Broken lessonIds
const noLesson = items.filter(v => !v.lessonId);
const broken = items.filter(v => v.lessonId && !validLessons.has(v.lessonId));
console.log('\nD) Missing lessonId: ' + noLesson.length);
console.log('   Broken lessonId: ' + broken.length);
if (broken.length) broken.forEach(v => console.log('   ' + v.id + ': ' + v.lessonId));

// E) Duplicate IDs
const ids = items.map(v => v.id);
const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
console.log('\nE) Duplicate IDs: ' + (dupIds.length > 0 ? [...new Set(dupIds)].join(', ') : 'none'));

// Check duplicate question IDs across all items
const allQids = {};
let dupQid = 0;
items.forEach(v => {
  v.questions.forEach(q => {
    if (allQids[q.id]) {
      console.log('   Duplicate question ID: ' + q.id + ' in ' + v.id + ' (also in ' + allQids[q.id] + ')');
      dupQid++;
    }
    allQids[q.id] = v.id;
  });
});
if (dupQid === 0) console.log('   Duplicate question IDs: none');

// F) Duplicate/similar passages
let similarFound = false;
const titles = items.map(v => v.title.toLowerCase());
for (let i = 0; i < titles.length; i++) {
  for (let j = i + 1; j < titles.length; j++) {
    const words1 = new Set(titles[i].split(' '));
    const words2 = new Set(titles[j].split(' '));
    const overlap = [...words1].filter(w => words2.has(w) && w.length > 4).length;
    if (overlap >= 4 && Math.min(words1.size, words2.size) >= 3) {
      const ratio = overlap / Math.min(words1.size, words2.size);
      if (ratio > 0.65) {
        console.log('F) Suspicious title overlap: ' + items[i].id + ' vs ' + items[j].id);
        console.log('   ' + items[i].title + ' / ' + items[j].title);
        console.log('   overlap=' + overlap + '/' + Math.min(words1.size, words2.size));
        similarFound = true;
      }
    }
  }
}
if (!similarFound) console.log('F) Duplicate/similar passages: none detected');

// G) Missing questions/answers
let missing = 0;
items.forEach(v => {
  ['id', 'title', 'text', 'questions', 'level', 'lessonId'].forEach(f => {
    if (v[f] === undefined || v[f] === null || v[f] === '') {
      console.log('G) Missing ' + f + ' on ' + v.id);
      missing++;
    }
  });
  if (v.level !== 'C1') { console.log('G) Wrong level on ' + v.id + ': ' + v.level); missing++; }
  if (!v.questions || v.questions.length === 0) {
    console.log('G) No questions on ' + v.id);
    missing++;
  } else {
    v.questions.forEach(q => {
      if (!q.question) { console.log('   Missing question text: ' + v.id + ' q:' + q.id); missing++; }
      if (!q.answer) { console.log('   Missing answer: ' + v.id + ' q:' + q.id); missing++; }
      if (['mcq', 'gap-fill', 'opinion-match'].includes(q.type) && (!q.options || q.options.length < 2)) {
        console.log('   Missing/insufficient options: ' + v.id + ' q:' + q.id);
        missing++;
      }
    });
  }
});
if (missing === 0) console.log('G) Items missing required fields/questions/answers: none');

// H) Mojibake
let mojiCount = 0;
function checkMojibake(obj, path) {
  if (typeof obj === 'string') {
    for (let i = 0; i < obj.length - 1; i++) {
      if (obj.charCodeAt(i) === 0xC3 && obj.charCodeAt(i + 1) > 0x7F) {
        console.log('H) MOJIBAKE at ' + path + ': ' + obj.substring(Math.max(0,i-5), i+15));
        mojiCount++;
        return;
      }
    }
    return;
  }
  if (Array.isArray(obj)) { obj.forEach((item, idx) => checkMojibake(item, path+'['+idx+']')); return; }
  if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => checkMojibake(obj[k], path+'.'+k)); }
}
items.forEach(v => checkMojibake(v, v.id));
if (mojiCount === 0) console.log('H) Mojibake found: none');

// Lesson distribution
console.log('\nLessonId distribution:');
const dist = {};
items.forEach(v => {
  dist[v.lessonId] = (dist[v.lessonId] || 0) + 1;
});
// All 25 lessons should have at least 1
let uncovered = 0;
for (let i = 1; i <= 25; i++) {
  const key = 'C1_lesson_' + i;
  if (!dist[key]) {
    console.log('   UNCOVERED: ' + key);
    uncovered++;
  }
}
if (uncovered === 0) console.log('   All 25 lessons covered');
 Object.entries(dist).sort((a, b) => {
  const numA = parseInt(a[0].match(/\d+/)[0]);
  return numA - parseInt(b[0].match(/\d+/)[0]);
}).forEach(([k, v]) => console.log('   ' + k + ': ' + v + ' items'));

const allPass = ok && noLesson.length === 0 && broken.length === 0 && dupIds.length === 0 && dupQid === 0 && !similarFound && missing === 0 && mojiCount === 0;
console.log('\n' + (allPass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'));
