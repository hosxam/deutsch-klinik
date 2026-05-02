import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

console.log('=== C1 READING BATCH 1 VALIDATION ===');
console.log('');

// A) Previous count (we know it was 3)
// B) New passages added
console.log('A) Previous C1 reading count: 3');
console.log('B) New passages added: 10');
console.log('C) Current C1 reading count: ' + items.length);

// D) Broken lessonIds
const validLessons = new Set(Array.from({length: 25}, (_, i) => 'C1_lesson_' + (i+1)));
const brokenLessonIds = items.filter(v => !validLessons.has(v.lessonId));
const missingLessonIds = items.filter(v => !v.lessonId);
console.log('D) Broken lessonIds: ' + (brokenLessonIds.length > 0 ? brokenLessonIds.map(v => v.id + ':' + v.lessonId).join(', ') : 'none'));
console.log('   Missing lessonIds: ' + (missingLessonIds.length > 0 ? missingLessonIds.map(v => v.id).join(', ') : 'none'));

// E) Duplicate IDs
const ids = items.map(v => v.id);
const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
console.log('E) Duplicate IDs: ' + (dupIds.length > 0 ? [...new Set(dupIds)].join(', ') : 'none'));

// F) Similar passages (check titles for similarity)
const titles = items.map(v => v.title.toLowerCase());
let similarFound = false;
for (let i = 0; i < titles.length; i++) {
  for (let j = i + 1; j < titles.length; j++) {
    // Simple check: compare first 10 chars
    if (titles[i].substring(0, 15) === titles[j].substring(0, 15)) {
      console.log('F) Similar titles: ' + items[i].id + ' vs ' + items[j].id);
      similarFound = true;
    }
    // Check word overlap
    const words1 = new Set(titles[i].split(' '));
    const words2 = new Set(titles[j].split(' '));
    const overlap = [...words1].filter(w => words2.has(w) && w.length > 4).length;
    if (overlap >= 3 && words1.size >= 3 && words2.size >= 3) {
      const ratio = overlap / Math.min(words1.size, words2.size);
      if (ratio > 0.6) {
        console.log('F) High title similarity: ' + items[i].id + ' (' + items[i].title + ') vs ' + items[j].id + ' (' + items[j].title + ') overlap=' + overlap + '/' + Math.min(words1.size, words2.size));
        similarFound = true;
      }
    }
  }
}
if (!similarFound) console.log('F) Duplicate/similar passages: none detected');

// G) Missing questions/answers
let missingQ = 0;
items.forEach(v => {
  if (!v.questions || v.questions.length === 0) {
    console.log('G) Missing questions: ' + v.id);
    missingQ++;
  } else {
    v.questions.forEach(q => {
      if (!q.question) { console.log('   Missing question text: ' + v.id + ' q:' + q.id); missingQ++; }
      if (!q.answer) { console.log('   Missing answer: ' + v.id + ' q:' + q.id); missingQ++; }
      if (q.type === 'mcq' || q.type === 'opinion-match' || q.type === 'gap-fill') {
        if (!q.options || q.options.length < 2) {
          console.log('   Missing options: ' + v.id + ' q:' + q.id);
          missingQ++;
        }
      }
    });
  }
});
if (missingQ === 0) console.log('G) Items missing questions/answers: none');

// Also check required fields
items.forEach(v => {
  ['id', 'title', 'text', 'questions', 'level', 'lessonId'].forEach(f => {
    if (!v[f]) console.log('   Missing field "' + f + '" on ' + v.id);
  });
});

// H) Mojibake check - scan all string values for 0xC3 followed by high chars
let mojiCount = 0;
function checkMojibake(obj, path) {
  if (typeof obj === 'string') {
    for (let i = 0; i < obj.length - 1; i++) {
      const cp = obj.charCodeAt(i);
      if (cp === 0xC3 && obj.charCodeAt(i + 1) > 0x7F) {
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

// LessonId distribution
const dist = {};
items.forEach(v => {
  dist[v.lessonId] = (dist[v.lessonId] || 0) + 1;
});
console.log('\nLessonId distribution:');
Object.entries(dist).sort((a, b) => {
  const numA = parseInt(a[0].match(/\d+/)[0]);
  const numB = parseInt(b[0].match(/\d+/)[0]);
  return numA - numB;
}).forEach(([k, v]) => console.log('  ' + k + ': ' + v + ' items'));

// All questions
const allQids = {};
items.forEach(v => {
  v.questions.forEach(q => {
    if (allQids[q.id]) {
      console.log('  DUPLICATE question ID: ' + q.id + ' in ' + v.id + ' (also in ' + allQids[q.id] + ')');
    }
    allQids[q.id] = v.id;
  });
});
