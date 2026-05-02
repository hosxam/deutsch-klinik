import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const items = data.C1 || [];

// Check each individual options array
items[0].questions[0].options.forEach((opt, idx) => {
  console.log('opt['+idx+']:', JSON.stringify(opt), 'has 0xC3:', opt.includes('\u00C3'));
});

// Now do deepCheck with the same path
let found = 0;
function deepCheck(obj, path) {
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      if (typeof item === 'string') {
        if (item.includes('\u00C3')) {
          console.log('FOUND at ' + path + '[' + idx + ']');
          found++;
        }
      } else {
        deepCheck(item, path + '[' + idx + ']');
      }
    });
    return;
  }
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(k => deepCheck(obj[k], path + '.' + k));
  }
}

deepCheck(items, 'C1');
console.log('Total found via deepCheck:', found);

// Also check: is the object actually different?
console.log('\nDirect access check:');
console.log('items[0].questions[0].options is array?', Array.isArray(items[0].questions[0].options));
console.log('items[0].questions[0].options[0]:', items[0].questions[0].options[0]);
console.log('items[0].questions[0].options[0] includes 0xC3:', items[0].questions[0].options[0].includes('\u00C3'));
