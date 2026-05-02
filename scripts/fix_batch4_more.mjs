import fs from 'fs';

let c = fs.readFileSync('scripts/add_b2_listening_batch4.mjs', 'utf8');

const replacements = {};
replacements["['Selbst weggehen', 'Die Polizei rufen']"] = "'Selbst weggehen', 'Die Polizei rufen'";
replacements["['Nur elektronisch', 'Muss es selbst abholen']"] = "'Nur elektronisch', 'Muss es selbst abholen'";

for (const [oldT, newT] of Object.entries(replacements)) {
  if (c.includes(oldT)) {
    c = c.replace(oldT, newT);
    console.log('Fixed');
  } else {
    console.log('NOT FOUND:', oldT);
  }
}

fs.writeFileSync('scripts/add_b2_listening_batch4.mjs', c);
console.log('Done');
