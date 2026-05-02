import fs from 'fs';
let c = fs.readFileSync('scripts/add_b2_listening_batch5.mjs', 'utf8');

// Fix b2l45c - restore the brackets around options array
c = c.replace(
  "options: 'Rund um die Uhr', 'Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr', 'Nur an Wochentagen'",
  "options: ['Rund um die Uhr', 'Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr', 'Nur an Wochentagen']"
);

fs.writeFileSync('scripts/add_b2_listening_batch5.mjs', c);
console.log('Fixed');
