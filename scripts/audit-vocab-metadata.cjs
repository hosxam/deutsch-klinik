const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

// Load data
const d = JSON.parse(fs.readFileSync(path.join(dataDir, 'germanVocabulary.json'), 'utf8'));
const fsp = JSON.parse(fs.readFileSync(path.join(dataDir, 'fspVocabulary.json'), 'utf8'));

// Real noun analysis
['A1','A2','B1','B2','C1'].forEach(lvl => {
  const items = d[lvl]||[];
  const nouns = items.filter(e => e.partOfSpeech === 'noun');
  const nounsNoArt = nouns.filter(e => !e.article || e.article === '');
  const nounsNoPl = nouns.filter(e => !e.plural || e.plural === '' || e.plural === 'plural');
  const placeholderPl = nouns.filter(e => e.plural === 'plural');
  const hasArticleButNotNoun = items.filter(e => e.article && e.article !== '' && e.partOfSpeech !== 'noun');
  
  console.log(lvl + ': items=' + items.length + ', nouns=' + nouns.length);
  console.log('  Missing article (noun POS): ' + nounsNoArt.length);
  console.log('  Missing plural (noun POS): ' + nounsNoPl.length);
  console.log('  Placeholder plural: ' + placeholderPl.length);
  console.log('  Has article but POS!=noun: ' + hasArticleButNotNoun.length);
  
  // POS distribution
  const posDist = {};
  items.forEach(e => {
    const pos = e.partOfSpeech || 'MISSING';
    posDist[pos] = (posDist[pos]||0) + 1;
  });
  const nonStd = Object.keys(posDist).filter(p => !['noun','verb','adjective','adverb','phrase','preposition','conjunction','pronoun','article','expression','other','question-word','modal-verb','conjunction','preposition'].includes(p));
  if (nonStd.length > 0) {
    console.log('  Non-standard POS values: ' + nonStd.join(', '));
    nonStd.forEach(p => console.log('    ' + p + ': ' + posDist[p] + ' entries'));
  }
  
  // Missing taughtInLessonId
  const noTeach = items.filter(e => !e.taughtInLessonId);
  console.log('  Missing taughtInLessonId: ' + noTeach.length);
  
  // Missing topic
  const noTopic = items.filter(e => !e.topic);
  console.log('  Missing topic: ' + noTopic.length);
  
  // Missing example
  const noExample = items.filter(e => !e.example);
  console.log('  Missing example: ' + noExample.length);
  
  console.log();
});

// FSP analysis
const fspArr = Array.isArray(fsp) ? fsp : Object.values(fsp).filter(e=>e&&typeof e==='object');
console.log('FSP: items=' + fspArr.length);
const fspPos = {};
fspArr.forEach(e => {
  const pos = e.partOfSpeech || 'unknown';
  fspPos[pos] = (fspPos[pos]||0) + 1;
});
console.log('POS dist: ' + JSON.stringify(fspPos));
const fspNoPos = fspArr.filter(e => !e.partOfSpeech || e.partOfSpeech === '' || e.partOfSpeech === 'unknown');
console.log('FSP unknown/no POS: ' + fspNoPos.length);
const fspNoTopic = fspArr.filter(e => !e.topic || e.topic === '');
console.log('FSP no topic: ' + fspNoTopic.length);

// Check fspVocabulary fields
const fspKeys = Object.keys(fspArr[0]||{});
console.log('FSP sample keys: ' + fspKeys.join(', '));
console.log('FSP sample: ' + JSON.stringify(fspArr[0], null, 2));
