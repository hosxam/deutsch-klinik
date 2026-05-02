import fs from 'fs';

let c = fs.readFileSync('scripts/add_b2_listening_batch5.mjs', 'utf8');

c = c.replace(
  "['Rund um die Uhr', ['Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr', 'Nur an Wochentagen']]",
  "'Rund um die Uhr', 'Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr', 'Nur an Wochentagen'"
);

fs.writeFileSync('scripts/add_b2_listening_batch5.mjs', c);
console.log('Done');
