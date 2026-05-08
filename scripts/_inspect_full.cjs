const fs = require('fs');

// Load all B2 data
const lessons = JSON.parse(fs.readFileSync('src/data/germanLessons.json', 'utf8'));
const grammar = JSON.parse(fs.readFileSync('src/data/grammar.json', 'utf8'));
const reading = JSON.parse(fs.readFileSync('src/data/reading.json', 'utf8'));
const listening = JSON.parse(fs.readFileSync('src/data/listening.json', 'utf8'));
const writing = JSON.parse(fs.readFileSync('src/data/writing.json', 'utf8'));
const speaking = JSON.parse(fs.readFileSync('src/data/speaking.json', 'utf8'));
const vocabulary = JSON.parse(fs.readFileSync('src/data/germanVocabulary.json', 'utf8'));
const curriculumMap = JSON.parse(fs.readFileSync('src/data/curriculumMap.json', 'utf8'));

const b2Lessons = lessons.filter(l => l.level === 'B2');
const b2Grammar = grammar.B2;
const b2Reading = reading.B2;
const b2Listening = listening.B2;
const b2Writing = writing.B2;
const b2Speaking = speaking.B2;
const b2Vocab = vocabulary.B2;

console.log('=== B2 Data Inventory ===');
console.log('Lessons:', b2Lessons.length);
console.log('Grammar items:', b2Grammar.length);
console.log('Reading items:', b2Reading.length);
console.log('Listening items:', b2Listening.length);
console.log('Writing items:', b2Writing.length);
console.log('Speaking items:', b2Speaking.length);
console.log('Vocabulary items:', b2Vocab.length);

// Check grammar topic distribution
const topicCounts = {};
b2Grammar.forEach(g => {
  topicCounts[g.topic] = (topicCounts[g.topic] || 0) + 1;
});
console.log('\n=== Grammar Topics ===');
Object.entries(topicCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  const inLesson = b2Grammar.filter(g => g.topic === k && g.taughtInLessonId).length;
  console.log(`  ${k}: ${v} items (${inLesson} assigned to lesson)`);
});

// Check which lessons currently have grammar assigned
const lessonGrammarCount = {};
b2Grammar.forEach(g => {
  const lid = g.taughtInLessonId || 'unassigned';
  lessonGrammarCount[lid] = (lessonGrammarCount[lid] || 0) + 1;
});
console.log('\n=== Grammar by Lesson Assignment ===');
Object.entries(lessonGrammarCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v} items`));

// Show curriculum map B2 entries
const b2Map = curriculumMap.units.filter(u => u.level === 'B2');
console.log('\n=== Curriculum Map B2 Entries ===');
b2Map.forEach(u => {
  console.log(`  ${u.id}: level=${u.level} skill=${u.skill} title=${u.title} conceptId=${u.conceptId} requiredConcepts=${JSON.stringify(u.requiredConcepts)} tags=${JSON.stringify(u.tags)}`);
});

console.log('\n=== Unit structure ===');
// Show the unit groupings
const lessonUnits = {};
b2Lessons.forEach(l => {
  lessonUnits[l.unit] = lessonUnits[l.unit] || [];
  lessonUnits[l.unit].push(l.id);
});
Object.entries(lessonUnits).forEach(([k,v]) => console.log(`  ${k}: ${v.join(', ')}`));
