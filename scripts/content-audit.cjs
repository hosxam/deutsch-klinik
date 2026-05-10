const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

// 1. Vocab audit
const vocRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'germanVocabulary.json'), 'utf8'));
const byLevel = {};

Object.entries(vocRaw).forEach(([lvlKey, arr]) => {
  if (!Array.isArray(arr)) return;
  // lvlKey is "A1", "A2", "B1", "B2", "C1"
  if (!byLevel[lvlKey]) byLevel[lvlKey] = [];
  arr.forEach(entry => byLevel[lvlKey].push(entry));
});

// FSP entries
const fspVoc = JSON.parse(fs.readFileSync(path.join(dataDir, 'fspVocabulary.json'), 'utf8'));
const fspEntries = Object.values(fspVoc).filter(e => e && typeof e === 'object');
const fspArray = Array.isArray(fspVoc) ? fspVoc : fspEntries;
byLevel['FSP'] = fspArray;

console.log('=== VOCABULARY COUNTS BY LEVEL ===\n');
const targetLevels = ['A1','A2','B1','B2','C1','FSP'];
let totalVocab = 0;
targetLevels.forEach(lvl => {
  const items = byLevel[lvl] || [];
  totalVocab += items.length;
  const hasWordField = items.filter(e => e.word).length;
  const hasGermanField = items.filter(e => e.german).length;
  
  const nouns = items.filter(e => {
    const pos = (e.partOfSpeech||'').toLowerCase();
    return pos === 'noun' || pos === 'nomen' || !!e.article;
  });
  const missingArticle = nouns.filter(n => !n.article || n.article === '' || n.article === 'article');
  const missingPlural = nouns.filter(n => !n.plural || n.plural === '' || n.plural === 'plural');
  const withExample = items.filter(e => e.example || e.beispiel || e.usageExample || e.exampleSentence || e.sentence);
  const withTopic = items.filter(e => e.topic);
  const topics = [...new Set(items.filter(e => e.topic).map(e => e.topic))].sort();
  const withConceptId = items.filter(e => e.conceptId || e.taughtInLessonId);
  
  const posCounts = {};
  items.forEach(e => {
    const pos = (e.partOfSpeech || 'unknown').toLowerCase();
    posCounts[pos] = (posCounts[pos] || 0) + 1;
  });
  
  console.log(`Level ${lvl}: ${items.length} words`);
  console.log(`  Word field: ${hasWordField}, German field: ${hasGermanField}`);
  console.log(`  Nouns: ${nouns.length} (missing article: ${missingArticle.length}, missing plural: ${missingPlural.length})`);
  console.log(`  With examples: ${withExample.length}`);
  console.log(`  With topic: ${withTopic.length}`);
  console.log(`  With conceptId/taughtInLessonId: ${withConceptId.length}`);
  if (topics.length > 0 && topics.length <= 20) {
    console.log(`  Topics: ${topics.join(', ')}`);
  } else if (topics.length > 20) {
    console.log(`  Topics (${topics.length}, first 15): ${topics.slice(0,15).join(', ')}...`);
  }
  console.log(`  POS dist: ${Object.entries(posCounts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(', ')}`);
  console.log();
});

console.log(`TOTAL across A1-FSP: ${totalVocab}\n`);

// B2/C1 topic analysis
console.log('=== B2/C1 TOPIC COVERAGE ===\n');
['B2','C1'].forEach(lvl => {
  const items = byLevel[lvl] || [];
  const topics = {};
  items.forEach(e => {
    const t = e.topic || 'UNTAGGED';
    topics[t] = (topics[t] || 0) + 1;
  });
  console.log(`${lvl}: ${Object.keys(topics).length} topics, ${items.length} words`);
  Object.entries(topics).sort((a,b) => b[1]-a[1]).forEach(([t, c]) => {
    console.log(`  ${t}: ${c}`);
  });
  console.log();
});

// Medical vocab check
console.log('=== MEDICAL/HEALTH VOCAB CHECK ===\n');
let medTotal = 0;
targetLevels.forEach(lvl => {
  const items = byLevel[lvl] || [];
  const med = items.filter(e => {
    const t = (e.topic || '').toLowerCase();
    const word = (e.word || e.german || '').toLowerCase();
    const tags = Array.isArray(e.tags) ? e.tags.map(t => t.toLowerCase()) : [];
    const tagStr = tags.join(' ');
    return t.includes('medic') || t.includes('health') || t.includes('körper') || t.includes('symptom') || 
           t.includes('pharmacy') || t.includes('body') || t.includes('hospital') || t.includes('emergency') ||
           t.includes('krank') || t.includes('arzt') || t.includes('patient') || t.includes('diagnosis') ||
           tagStr.includes('medic') || tagStr.includes('clinic') || tagStr.includes('health') || t.includes('body');
  });
  medTotal += med.length;
  console.log(`${lvl}: ${med.length} medical/health`);
  if (med.length > 0 && med.length <= 10) med.forEach(m => console.log(`    ${m.word||m.german||'?'} (${m.topic||'no topic'})`));
});
console.log(`Total medical/health: ${medTotal}`);

// Life admin/workplace
console.log('\n=== LIFE/ADMIN/WORKPLACE VOCAB ===\n');
['A1','A2','B1','B2','C1','FSP'].forEach(lvl => {
  const items = byLevel[lvl] || [];
  const admin = items.filter(e => {
    const t = (e.topic || '').toLowerCase();
    const tags = Array.isArray(e.tags) ? e.tags.map(t => t.toLowerCase()) : [];
    const tagStr = tags.join(' ');
    const word = (e.word || e.german || '').toLowerCase();
    return t.includes('admin') || t.includes('work') || t.includes('bureau') || t.includes('insurance') ||
           t.includes('bank') || t.includes('govern') || t.includes('authority') || t.includes('register') ||
           t.includes('document') || t.includes('appointment') || t.includes('office') || t.includes('anmeldung') ||
           t.includes('employment') || t.includes('contract') || t.includes('arbeit') || t.includes('beruf') ||
           tagStr.includes('admin') || tagStr.includes('workplace') || tagStr.includes('bureaucracy') ||
           tagStr.includes('arbeit');
  });
  console.log(`${lvl}: ${admin.length} life/admin/workplace`);
  if (admin.length > 0 && admin.length <= 5) admin.forEach(m => console.log(`    ${m.word||m.german||'?'} (${m.topic||'no topic'})`));
});

// Lesson audit
console.log('\n=== LESSON DEPTH ===\n');
const lessons = JSON.parse(fs.readFileSync(path.join(dataDir, 'germanLessons.json'), 'utf8'));
const lessonEntries = Object.values(lessons);
const byLevelLessons = {};
lessonEntries.forEach(l => {
  const lvl = l.level || 'UNKNOWN';
  if (!byLevelLessons[lvl]) byLevelLessons[lvl] = [];
  byLevelLessons[lvl].push(l);
});

targetLevels.filter(l => l !== 'FSP').forEach(lvl => {
  const ls = byLevelLessons[lvl] || [];
  if (ls.length === 0) { console.log(`${lvl}: NO LESSONS`); return; }
  
  const hasContent = ls.filter(l => l.explanation).length;
  const hasExamples = ls.filter(l => l.examples && l.examples.length > 0).length;
  const hasLinkedExercises = ls.filter(l => l.linkedQuestionIds && l.linkedQuestionIds.length > 0).length;
  const hasCommonMistakes = ls.filter(l => l.commonMistakes && l.commonMistakes.length > 0).length;
  const hasFormsTable = ls.filter(l => l.formsTable || l.formsTables).length;
  const hasPronNotes = ls.filter(l => l.pronunciationNotes).length;
  const hasMedicalNotes = ls.filter(l => l.medicalFspNotes).length;
  const hasMiniDrills = ls.filter(l => l.miniDrills && l.miniDrills.length > 0).length;
  const hasVocab = ls.filter(l => l.vocabulary && l.vocabulary.length > 0).length;
  const hasGuidedPractice = ls.filter(l => l.guidedPractice).length;
  const hasIndependentPractice = ls.filter(l => l.independentPractice).length;
  const hasReview = ls.filter(l => l.reviewSummary).length;
  
  let totalLen = 0, minLen = Infinity, maxLen = 0;
  ls.forEach(l => {
    const text = l.explanation || '';
    totalLen += text.length;
    if (text.length < minLen) minLen = text.length;
    if (text.length > maxLen) maxLen = text.length;
  });
  
  console.log(`${lvl}: ${ls.length} lessons`);
  console.log(`  Explanation: avg=${Math.round(totalLen/ls.length)} chars, min=${minLen}, max=${maxLen}`);
  console.log(`  Examples: ${hasExamples}/${ls.length}`);
  console.log(`  Common mistakes: ${hasCommonMistakes}/${ls.length}`);
  console.log(`  Forms tables: ${hasFormsTable}/${ls.length}`);
  console.log(`  Pronunciation notes: ${hasPronNotes}/${ls.length}`);
  console.log(`  Medical/FSP notes: ${hasMedicalNotes}/${ls.length}`);
  console.log(`  Mini-drills: ${hasMiniDrills}/${ls.length}`);
  console.log(`  Vocab section: ${hasVocab}/${ls.length}`);
  console.log(`  Linked exercises: ${hasLinkedExercises}/${ls.length}`);
  console.log(`  Guided practice: ${hasGuidedPractice}/${ls.length}`);
  console.log(`  Independent practice: ${hasIndependentPractice}/${ls.length}`);
  console.log(`  Review summary: ${hasReview}/${ls.length}`);
  
  // Find thin lessons
  const thin = ls.filter(l => (l.explanation||'').length < 200);
  if (thin.length > 0) {
    console.log(`  THIN LESSONS (<200 chars): ${thin.length}`);
    thin.forEach(l => console.log(`    ${l.id || l.lessonId || l.title}: "${(l.explanation||'').slice(0,80)}..."`));
  }
  console.log();
});

// Skill counts
console.log('=== SKILL EXERCISE COUNTS ===\n');
const reading = JSON.parse(fs.readFileSync(path.join(dataDir, 'reading.json'), 'utf8'));
const listening = JSON.parse(fs.readFileSync(path.join(dataDir, 'listening.json'), 'utf8'));
const writing = JSON.parse(fs.readFileSync(path.join(dataDir, 'writing.json'), 'utf8'));
const speaking = JSON.parse(fs.readFileSync(path.join(dataDir, 'speaking.json'), 'utf8'));
const grammar = JSON.parse(fs.readFileSync(path.join(dataDir, 'grammar.json'), 'utf8'));
const exams = JSON.parse(fs.readFileSync(path.join(dataDir, 'exams.json'), 'utf8'));
const levelsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'levels.json'), 'utf8'));
const levelsArr = levelsData.levels || [];

levelsArr.forEach(lvl => {
  const id = lvl.id;
  const readCount = (reading[id] || []).length;
  const listenCount = (listening[id] || []).length;
  const writeCount = (writing[id] || []).length;
  const speakCount = (speaking[id] || []).length;
  const gramCount = (grammar[id] || []).length;
  let examCount = 0;
  if (exams.exams && exams.exams[id]) {
    examCount = Array.isArray(exams.exams[id]) ? exams.exams[id].length : 1;
  }
  console.log(`${id}: read=${readCount} listen=${listenCount} write=${writeCount} speak=${speakCount} grammar=${gramCount} exams=${examCount}`);
});

// Pronunciation
console.log('\n=== PRONUNCIATION GUIDE ===\n');
const pron = JSON.parse(fs.readFileSync(path.join(dataDir, 'pronunciationGuides.json'), 'utf8'));
const pronKeys = Object.keys(pron);
console.log(`Pronunciation guide entries: ${pronKeys.length}`);
const pronLessonsCovered = new Set(pronKeys);
console.log(`Unique lessons covered: ${pronLessonsCovered.size}`);
const firstPron = pron[pronKeys[0]];
if (firstPron) {
  console.log(`Sample entry: ${pronKeys[0]} -> ${JSON.stringify(firstPron).slice(0,120)}...`);
}

// FSP specific
console.log('\n=== FSP SPECIFIC ===\n');
['fspLessons', 'fspAnamnese', 'fspCases', 'fspPresentations'].forEach(f => {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, `${f}.json`), 'utf8'));
  const vals = Array.isArray(d) ? d : Object.values(d);
  console.log(`${f}.json: ${vals.length} entries`);
  if (vals.length > 0) {
    console.log(`  Sample keys: ${Object.keys(vals[0]||{}).slice(0,8).join(', ')}`);
  }
});
