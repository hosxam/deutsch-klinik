const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/grammar.json', 'utf8'));
const seen = new Set();
let removed = 0;

for (const [level, exercises] of Object.entries(data)) {
  if (!Array.isArray(exercises)) continue;

  data[level] = exercises.filter((exercise) => {
    const key = exercise.prompt?.trim().toLowerCase().slice(0, 60);
    if (seen.has(key)) {
      removed += 1;
      return false;
    }
    seen.add(key);
    return true;
  });
}

fs.writeFileSync('./src/data/grammar.json', JSON.stringify(data, null, 2));
console.log(`Removed ${removed} duplicate exercises`);
