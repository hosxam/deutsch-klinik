const fs = require('fs');

// LISTENING.JSON - true-false answers and mojibake fixes
let listening = fs.readFileSync('./src/data/listening.json', 'utf8');
listening = listening.replace(/"trü"/g, '"true"');
listening = listening.replace(/heiÃŸe/g, 'heiße').replace(/heiÃŸt/g, 'heißt');
listening = listening.replace(/StraÃŸe/g, 'Straße').replace(/straÃŸe/g, 'straße');
listening = listening.replace(/"ÿber/g, '"Über');
listening = listening.replace(/ParkstraÃŸe/g, 'Parkstraße');
fs.writeFileSync('./src/data/listening.json', listening);
console.log('listening.json fixed');

// GRAMMAR.JSON - "teür" is not a German word (correct: teuer)
let grammar = fs.readFileSync('./src/data/grammar.json', 'utf8');
grammar = grammar.replace(/teür/g, 'teuer');
fs.writeFileSync('./src/data/grammar.json', grammar);
console.log('grammar.json fixed');

// WRITING.JSON - mojibake in prompts + "heisst" instead of "heißt"
let writing = fs.readFileSync('./src/data/writing.json', 'utf8');
writing = writing
  .replace(/heiÃŸe/g, 'heiße')
  .replace(/heiÃŸt/g, 'heißt')
  .replace(/Ã\u009c/g, 'Ü')
  .replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/writing.json', writing);
console.log('writing.json fixed');

// SPEAKING.JSON - "heisst" in prompts
let speaking = fs.readFileSync('./src/data/speaking.json', 'utf8');
speaking = speaking.replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/speaking.json', speaking);
console.log('speaking.json fixed');

// EXAMS.JSON - "heisst" in C1 exam question
let exams = fs.readFileSync('./src/data/exams.json', 'utf8');
exams = exams.replace(/heisst/g, 'heißt');
fs.writeFileSync('./src/data/exams.json', exams);
console.log('exams.json fixed');

// FSP VOCABULARY - word fields missing umlauts
let fspVocabulary = fs.readFileSync('./src/data/fspVocabulary.json', 'utf8');
fspVocabulary = fspVocabulary.replace(/"die Mudigkeit"/g, '"die Müdigkeit"');
fspVocabulary = fspVocabulary.replace(/"die Oberarzte"/g, '"die Oberärzte"');
fspVocabulary = fspVocabulary.replace(/ uber /g, ' über ').replace(/ fur /g, ' für ').replace(/ fruh /g, ' früh ');
fs.writeFileSync('./src/data/fspVocabulary.json', fspVocabulary);
console.log('fspVocabulary.json fixed');

console.log('\nAll data corruption fixed. Run validate scripts to confirm.');
