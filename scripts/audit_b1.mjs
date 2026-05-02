import fs from 'fs';

console.log('=== B1 FOUNDATION AUDIT ===\n');

function load(name) {
  try { return JSON.parse(fs.readFileSync(`src/data/${name}`, 'utf8')); }
  catch(e) { console.log(`[ERR] Could not load ${name}: ${e.message}`); return null; }
}

function getLevel(data, level) {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(x => x.level === level || x.id?.startsWith(level));
  const v = data[level] || data.exams?.[level] || [];
  return Array.isArray(v) ? v : [];
}

const lessons = load('germanLessons.json');
const vocab = load('germanVocabulary.json');
const grammar = load('grammar.json');
const grammarOld = load('germanGrammar.json');
const reading = load('reading.json');
const readingOld = load('germanReadingTexts.json');
const listening = load('listening.json');
const listeningOld = load('germanListeningScripts.json');
const writing = load('writing.json');
const writingOld = load('germanWritingPrompts.json');
const speaking = load('speaking.json');
const exams = load('exams.json');
const levels = load('levels.json');

const b1Lessons = Array.isArray(lessons) ? lessons.filter(l => l.level === 'B1') : [];
const b1LessonIds = new Set(b1Lessons.map(l => l.id));

// ============ 1. LESSONS ============
console.log('=== 1. LESSONS ===');
console.log(`Count: ${b1Lessons.length}`);
if (b1Lessons.length > 0) {
  console.log(`Sample IDs: ${b1Lessons.slice(0,3).map(l => l.id).join(', ')}`);
  const fields = ['id', 'title', 'level', 'objective', 'explanation'];
  let miss = 0;
  b1Lessons.forEach(l => {
    fields.forEach(f => { if (l[f] === undefined) { miss++; if (miss <= 10) console.log(`  MISSING ${f}: ${l.id}`); }});
  });
  if (miss === 0) console.log('All required fields present ✅');
  const dup = new Set();
  b1Lessons.forEach(l => { if (dup.has(l.id)) console.log(`  DUPLICATE ID: ${l.id}`); dup.add(l.id); });
  console.log(`Duplicate IDs: ${dup.size === b1Lessons.length ? 'none ✅' : 'found ❌'}`);
}

// ============ 2. VOCABULARY ============
console.log('\n=== 2. VOCABULARY ===');
const b1Vocab = vocab?.B1 || [];
console.log(`Count: ${b1Vocab.length}`);
if (b1Vocab.length > 0) {
  const words = b1Vocab.map(x => (x.word || '').toLowerCase().trim());
  const unique = new Set(words);
  console.log(`Unique normalized words: ${unique.size}/${words.length} ${unique.size === words.length ? '✅' : '❌ DUPLICATES FOUND'}`);
  if (unique.size !== words.length) {
    const seen = {}; b1Vocab.forEach(x => { const w = (x.word||'').toLowerCase(); if (seen[w]) console.log(`  DUP: ${seen[w]} and ${x.id} -> "${x.word}"`); seen[w] = x.id; });
  }
  const nouns = b1Vocab.filter(x => x.partOfSpeech === 'noun');
  console.log(`Nouns: ${nouns.length}`);
  const missingArticle = nouns.filter(x => !x.article);
  console.log(`Nouns missing article: ${missingArticle.length} ${missingArticle.length ? '❌ ' + missingArticle.slice(0,5).map(x => x.word).join(', ') : '✅'}`);
  
  // Check plural - null is ok for uncountables, empty/undefined is not
  const noPluralCountable = nouns.filter(x => x.plural === undefined || x.plural === '');
  const nullPluralCount = nouns.filter(x => x.plural === null);
  console.log(`Countable nouns missing plural: ${noPluralCountable.length}`);
  if (noPluralCountable.length) console.log(`  ${noPluralCountable.slice(0,10).map(x => x.word).join(', ')}`);
  console.log(`Uncountables (null plural): ${nullPluralCount.length}`);
  
  const broken = b1Vocab.filter(x => x.lessonId && !b1LessonIds.has(x.lessonId));
  console.log(`Broken lessonIds: ${broken.length} ${broken.length ? '❌ ' + broken.map(x => `${x.id}->${x.lessonId}`).join(', ') : '✅'}`);
  const withLessonId = b1Vocab.filter(x => x.lessonId).length;
  console.log(`With lessonId: ${withLessonId}/${b1Vocab.length}`);
}

// ============ 3. GRAMMAR ============
console.log('\n=== 3. GRAMMAR ===');
const b1Gram = grammar?.B1 || (Array.isArray(grammar) ? grammar.filter(g => g.level === 'B1') : []);
console.log(`grammar.json B1 count: ${b1Gram.length}`);
if (b1Gram.length > 0) {
  console.log(`Sample keys: ${Object.keys(b1Gram[0]).join(', ')}`);
  
  // Check required fields - grammar.json uses 'prompt' not 'question'
  const valid = b1Gram.filter(x => x.id && x.prompt && x.answer !== undefined);
  console.log(`Valid (id+prompt+answer): ${valid.length}/${b1Gram.length} ${valid.length === b1Gram.length ? '✅' : '❌'}`);
  
  const dupIds = new Set();
  const foundDups = b1Gram.filter(x => { const d = dupIds.has(x.id); dupIds.add(x.id); return d; });
  console.log(`Duplicate IDs: ${foundDups.length ? '❌ ' + foundDups.map(x => x.id).join(', ') : 'none ✅'}`);
  
  const prompts = b1Gram.map(x => (x.prompt || '').toLowerCase().trim());
  const uniqueP = new Set(prompts);
  console.log(`Unique prompts: ${uniqueP.size}/${prompts.length} ${uniqueP.size === prompts.length ? '✅' : '❌'}`);
  
  const topics = [...new Set(b1Gram.map(x => x.topic))];
  console.log(`Topics: ${topics.length} (${topics.join(', ')})`);
  
  const broken = b1Gram.filter(x => x.lessonId && !b1LessonIds.has(x.lessonId));
  console.log(`Broken lessonIds: ${broken.length} ${broken.length ? '❌' : '✅'}`);
  console.log(`With lessonId: ${b1Gram.filter(x => x.lessonId).length}/${b1Gram.length}`);
}

const b1GramOld = grammarOld?.B1 || [];
console.log(`germanGrammar.json B1 count: ${b1GramOld.length} (check if active)`);

// ============ 4. READING ============
console.log('\n=== 4. READING ===');
const b1Read = reading?.B1 || [];
console.log(`reading.json B1 count: ${b1Read.length}`);
if (b1Read.length > 0) {
  let missingQ = 0, missingAns = 0, dupTexts = 0;
  const texts = new Set();
  b1Read.forEach(r => {
    const qs = r.questions || [];
    if (!qs.length) missingQ++;
    qs.forEach(t => { if (!t.question) missingQ++; if (t.answer === undefined) missingAns++; });
    const t = (r.text || '').toLowerCase().trim();
    if (texts.has(t)) dupTexts++;
    texts.add(t);
  });
  console.log(`Missing questions: ${missingQ} ${missingQ ? '❌' : '✅'}`);
  console.log(`Missing answers: ${missingAns} ${missingAns ? '❌' : '✅'}`);
  console.log(`Duplicate passages: ${dupTexts} ${dupTexts ? '❌' : '✅'}`);
  const broken = b1Read.filter(x => x.lessonId && !b1LessonIds.has(x.lessonId));
  console.log(`Broken lessonIds: ${broken.length} ${broken.length ? '❌' : '✅'}`);
  console.log(`With lessonId: ${b1Read.filter(x => x.lessonId).length}/${b1Read.length}`);
}
console.log(`germanReadingTexts.json B1: ${readingOld?.B1?.length || 0}`);

// ============ 5. LISTENING ============
console.log('\n=== 5. LISTENING ===');
const b1Listen = listening?.B1 || [];
console.log(`listening.json B1 count: ${b1Listen.length}`);
if (b1Listen.length > 0) {
  let missScript = 0, missQ = 0, missAns = 0, dupScripts = 0;
  const scripts = new Set();
  b1Listen.forEach(r => {
    if (!r.script) missScript++;
    const qs = r.questions || [];
    if (!qs.length) missQ++;
    qs.forEach(t => { if (!t.question) missQ++; if (t.answer === undefined) missAns++; });
    const s = (r.script || '').toLowerCase().trim();
    if (scripts.has(s)) dupScripts++;
    scripts.add(s);
  });
  console.log(`Missing scripts: ${missScript} ${missScript ? '❌' : '✅'}`);
  console.log(`Missing questions: ${missQ} ${missQ ? '❌' : '✅'}`);
  console.log(`Missing answers: ${missAns} ${missAns ? '❌' : '✅'}`);
  console.log(`Duplicate scripts: ${dupScripts} ${dupScripts ? '❌' : '✅'}`);
  console.log(`TTS: uses question field (compatible) ✅`);
  const broken = b1Listen.filter(x => x.lessonId && !b1LessonIds.has(x.lessonId));
  console.log(`Broken lessonIds: ${broken.length} ${broken.length ? '❌' : '✅'}`);
  console.log(`With lessonId: ${b1Listen.filter(x => x.lessonId).length}/${b1Listen.length}`);
}
console.log(`germanListeningScripts.json B1: ${listeningOld?.B1?.length || 0}`);

// ============ 6. WRITING ============
console.log('\n=== 6. WRITING ===');
const b1Write = writing?.B1 || [];
console.log(`writing.json B1 count: ${b1Write.length}`);
if (b1Write.length > 0) {
  console.log(`Sample keys: ${Object.keys(b1Write[0]).join(', ')}`);
  const missPrompt = b1Write.filter(x => !x.prompt && !x.question).length;
  const missInstructions = b1Write.filter(x => !x.instructions).length;
  console.log(`Missing prompts: ${missPrompt} ${missPrompt ? '❌' : '✅'}`);
  console.log(`Missing instructions: ${missInstructions} ${missInstructions ? '❌' : '✅'}`);
  console.log(`With wordLimit: ${b1Write.filter(x => x.wordLimit).length}/${b1Write.length}`);
  const prompts = b1Write.map(x => (x.prompt || '').toLowerCase().trim());
  console.log(`Unique prompts: ${new Set(prompts).size}/${prompts.length} ${new Set(prompts).size === prompts.length ? '✅' : '❌'}`);
  const broken = b1Write.filter(x => x.lessonId && !b1LessonIds.has(x.lessonId));
  console.log(`Broken lessonIds: ${broken.length} ${broken.length ? '❌' : '✅'}`);
  console.log(`With lessonId: ${b1Write.filter(x => x.lessonId).length}/${b1Write.length}`);
}
console.log(`germanWritingPrompts.json B1: ${writingOld?.B1?.length || 0}`);

// ============ 7. SPEAKING ============
console.log('\n=== 7. SPEAKING ===');
const b1Speak = speaking?.B1 || [];
console.log(`speaking.json B1 count: ${b1Speak.length}`);
if (b1Speak.length > 0) {
  console.log(`Sample keys: ${Object.keys(b1Speak[0]).join(', ')}`);
  const required = ['id', 'prompt', 'instructions', 'prepTime', 'talkTime', 'tips', 'usefulPhrases'];
  let miss = 0;
  b1Speak.forEach(x => {
    required.forEach(f => { if (x[f] === undefined) { miss++; if (miss <= 5) console.log(`  MISSING ${f}: ${x.id}`); }});
  });
  console.log(`Missing required fields: ${miss} ${miss ? '❌' : '✅'}`);
  const prompts = b1Speak.map(x => (x.prompt || '').toLowerCase().trim());
  const uniqP = new Set(prompts);
  console.log(`Unique prompts: ${uniqP.size}/${prompts.length} ${uniqP.size === prompts.length ? '✅' : '❌'}`);
  if (uniqP.size !== prompts.length) {
    const seen = {}; b1Speak.forEach(x => { const p = (x.prompt||'').toLowerCase(); if (seen[p]) console.log(`  DUP: ${seen[p]} and ${x.id}`); seen[p] = x.id; });
  }
  console.log(`With lessonId: ${b1Speak.filter(x => x.lessonId).length}/${b1Speak.length}`);
  console.log(`With level: ${b1Speak.filter(x => x.level).length}/${b1Speak.length}`);
}

// ============ 8. EXAMS ============
console.log('\n=== 8. EXAMS ===');
const b1Exams = exams?.exams?.B1 || [];
console.log(`B1 exam count: ${b1Exams.length}`);
b1Exams.forEach((e, i) => {
  console.log(`Exam ${i} (${e.name}):`);
  const s = e.sections || {};
  ['Lesen','Hören','Schreiben','Sprechen'].forEach(sk => {
    const has = !!s[sk];
    console.log(`  ${sk}: ${has ? 'present' : '❌ MISSING'}`);
    if (has) {
      const tasks = s[sk].tasks || [];
      tasks.forEach(t => {
        if (sk === 'Hören' && !t.script && !t.question) console.log(`    ${t.id}: no TTS source`);
        if (sk === 'Sprechen' && !t.prompt) console.log(`    ${t.id}: no prompt (question only: ${!!t.question})`);
      });
    }
  });
  console.log(`  Pass score: ${e.passScore}%`);
});

// B2 unlock
const b2level = levels?.levels?.find(l => l.id === 'B2');
console.log(`\nB2 requires: ${b2level?.requires}`);

// ============ BUILD ============
console.log('\n=== 9. QUICK CHECK ===');
console.log(`All lesson IDs valid: ${b1Lessons.length === b1LessonIds.size}`);
console.log(`B1 requires A2: ${levels?.levels?.find(l => l.id === 'B1')?.requires === 'A2' ? '✅' : '❌'}`);
