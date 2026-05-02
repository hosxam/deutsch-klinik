import fs from 'fs';

// === Topical mapping for C1 lessonIds ===

const readingLessonMap = {
  'C1_read_1': 'C1_lesson_3',  // healthcare system → clinical context
  'C1_read_2': 'C1_lesson_11', // ethics / end-of-life → medical ethics
  'C1_read_3': 'C1_lesson_3',  // staffing shortage → clinical/hospital
};

const listeningLessonMap = {
  'C1_listen_1': 'C1_lesson_3',  // digitalization in hospital → clinical
  'C1_listen_2': 'C1_lesson_6',  // medical tourism → evidence based / system
  'C1_listen_3': 'C1_lesson_3',  // foreign doctors / approbation → clinical / FSP
};

const writingLessonMap = {
  'C1_write_1':  'C1_lesson_1',  // social media & health → academic argumentation
  'C1_write_2':  'C1_lesson_13', // formal complaint → legal/admin
  'C1_write_3':  'C1_lesson_11', // organ donation stance → medical ethics
  'C1_write_4':  'C1_lesson_13', // response to open letter → formal communication
  'C1_write_5':  'C1_lesson_6',  // hospital reform summary → evidence-based/system
  'C1_write_6':  'C1_lesson_1',  // research proposal → academic communication
  'C1_write_7':  'C1_lesson_10', // AI in radiology → research/technology
  'C1_write_8':  'C1_lesson_9',  // hospital sustainability → prevention/public health
  'C1_write_9':  'C1_lesson_1',  // cooperation request → academic communication
  'C1_write_10': 'C1_lesson_3',  // foreign doctor integration → clinical context
};

const speakingLessonMap = {
  'C1_speak_1':  'C1_lesson_14', // precision medicine orthopedics → orthopedics
  'C1_speak_2':  'C1_lesson_12', // genetics ethics → psychiatry/ethics
  'C1_speak_3':  'C1_lesson_6',  // healthcare costs → evidence-based
  'C1_speak_4':  'C1_lesson_13', // confidentiality → legal/admin
  'C1_speak_5':  'C1_lesson_14', // error culture / patient safety → surgical/clinical
  'C1_speak_6':  'C1_lesson_1',  // self-chosen presentation → academic
  'C1_speak_7':  'C1_lesson_3',  // foreign doctor recruitment → clinical/FSP
  'C1_speak_8':  'C1_lesson_8',  // palliative care → interdisciplinary/geriatrics
  'C1_speak_9':  'C1_lesson_8',  // intercultural competence → interdisciplinary
  'C1_speak_10': 'C1_lesson_14', // patient handover orthopedics → surgical
};

function fixFile(file, lessonMap, fixes) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  let levelFixed = 0;
  let lessonFixed = 0;
  
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') {
      v.level = 'C1';
      levelFixed++;
    }
    if (!v.lessonId) {
      v.lessonId = lessonMap[v.id];
      if (v.lessonId) lessonFixed++;
    }
  });

  // Fix mojibake in C1 items
  let mojibakeFixed = 0;
  function fixText(obj) {
    if (!obj) return;
    if (typeof obj === 'string') {
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => fixText(item));
      return;
    }
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'string') {
        const orig = obj[k];
        fixes.forEach(([from, to]) => {
          if (obj[k].includes(from)) {
            obj[k] = obj[k].replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          }
        });
        if (orig !== obj[k]) mojibakeFixed++;
      } else if (typeof obj[k] === 'object') {
        fixText(obj[k]);
      }
    });
  }
  fixText(items);
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(file + ': level fixed=' + levelFixed + ', lessonId fixed=' + lessonFixed + ', mojibake fixed=' + mojibakeFixed);
  return { levelFixed, lessonFixed, mojibakeFixed };
}

// C1 mojibake fixes (only - only these specific patterns)
const readingFixes = [
  ['SchlieÃŸung', 'Schließung'],
  ['GroÃŸstädte', 'Großstädte'],
  ['MaÃŸnahmen', 'Maßnahmen'],
];
const listeningFixes = [
  ['gröÃŸte', 'größte'],
  ['Ã„rzte', 'Ärzte'],
  ['Ã–ztürk', 'Öztürk'],
];

let totalLevel = 0, totalLesson = 0, totalMoji = 0;

const r = fixFile('reading.json', readingLessonMap, readingFixes);
totalLevel += r.levelFixed; totalLesson += r.lessonFixed; totalMoji += r.mojibakeFixed;

const l = fixFile('listening.json', listeningLessonMap, listeningFixes);
totalLevel += l.levelFixed; totalLesson += l.lessonFixed; totalMoji += l.mojibakeFixed;

const w = fixFile('writing.json', writingLessonMap, []);
totalLevel += w.levelFixed; totalLesson += w.lessonFixed; totalMoji += w.mojibakeFixed;

const s = fixFile('speaking.json', speakingLessonMap, []);
totalLevel += s.levelFixed; totalLesson += s.lessonFixed; totalMoji += s.mojibakeFixed;

console.log('\nTotal: level=' + totalLevel + ', lessonId=' + totalLesson + ', mojibake=' + totalMoji);

// === Validation ===
const validLessons = new Set(Array.from({length:25}, (_,i) => 'C1_lesson_' + (i+1)));
let ok = true;

['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  const name = f.replace('.json','').toUpperCase();
  
  console.log('\n--- ' + name + ' ---');
  console.log('Count: ' + items.length);
  
  const noLevel = items.filter(v => !v.level || v.level !== 'C1');
  const noLesson = items.filter(v => !v.lessonId);
  const brokenLesson = items.filter(v => v.lessonId && !validLessons.has(v.lessonId));
  const ids = items.map(v => v.id);
  const dupIds = ids.length - new Set(ids).size;
  
  if (noLevel.length) { console.log('  ERROR: ' + noLevel.length + ' missing level!'); ok = false; }
  if (noLesson.length) { console.log('  ERROR: ' + noLesson.length + ' missing lessonId!'); ok = false; }
  if (brokenLesson.length) { console.log('  ERROR: ' + brokenLesson.length + ' broken lessonIds!'); brokenLesson.forEach(v => console.log('    ' + v.id + ': ' + v.lessonId)); ok = false; }
  if (dupIds) { console.log('  ERROR: ' + dupIds + ' duplicate IDs!'); ok = false; }
  
  // Check mojibake in C1 items
  items.forEach(v => {
    function scan(obj, path) {
      if (typeof obj === 'string') {
        if (obj.includes('ÃŸ') || obj.includes('Ã„') || obj.includes('Ã¶') || obj.includes('Ã¼') || obj.includes('Ã–')) {
          console.log('  MOJIBAKE REMAINS: ' + v.id + ' ' + path + ': ' + obj.substring(0,60));
          ok = false;
        }
        return;
      }
      if (Array.isArray(obj)) { obj.forEach((item,i) => scan(item, path+'['+i+']')); return; }
      if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => scan(obj[k], path+'.'+k)); }
    }
    scan(v, v.id);
  });
  
  // Missing required fields
  let missing = 0;
  items.forEach(v => {
    ['id','level','lessonId'].forEach(f => { if (!v[f]) { console.log('  MISS ' + f + ' on ' + v.id); missing++; ok = false; }});
    if (name === 'READING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; ok = false; }
      if (!v.passage && !v.text) { console.log('  MISS passage on ' + v.id); missing++; ok = false; }
      if (!v.questions || v.questions.length === 0) { console.log('  MISS questions on ' + v.id); missing++; ok = false; }
    }
    if (name === 'LISTENING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; ok = false; }
      if (!v.script) { console.log('  MISS script on ' + v.id); missing++; ok = false; }
      if (!v.questions || v.questions.length === 0) { console.log('  MISS questions on ' + v.id); missing++; ok = false; }
    }
    if (name === 'WRITING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; ok = false; }
      if (!v.prompt) { console.log('  MISS prompt on ' + v.id); missing++; ok = false; }
      if (!v.instructions) { console.log('  MISS instructions on ' + v.id); missing++; ok = false; }
      if (!v.wordLimit) { console.log('  MISS wordLimit on ' + v.id); missing++; ok = false; }
    }
    if (name === 'SPEAKING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; ok = false; }
      if (!v.prompt) { console.log('  MISS prompt on ' + v.id); missing++; ok = false; }
      if (!v.instructions) { console.log('  MISS instructions on ' + v.id); missing++; ok = false; }
      if (!v.prepTime) { console.log('  MISS prepTime on ' + v.id); missing++; ok = false; }
      if (!v.talkTime) { console.log('  MISS talkTime on ' + v.id); missing++; ok = false; }
    }
  });
  console.log('Missing required fields: ' + missing);
});

console.log('\nAll validations: ' + (ok ? 'PASS' : 'FAIL'));
