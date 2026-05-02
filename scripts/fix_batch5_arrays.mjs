import fs from 'fs';

let c = fs.readFileSync('scripts/add_b2_listening_batch5.mjs', 'utf8');

// Replace each nested array pattern individually
const fixes = {};

fixes["['Aeltere Patienten ausschliessen', 'Nur gesunde Probanden nehmen']"] = "'Aeltere Patienten ausschliessen', 'Nur gesunde Probanden nehmen'";
fixes["['In drei Wochen', 'In einem Monat']"] = "'In drei Wochen', 'In einem Monat'";
fixes["['Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr']"] = "'Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr'";
fixes["['Vom 20. bis 22. November', 'Vom 5. bis 7. Dezember']"] = "'Vom 20. bis 22. November', 'Vom 5. bis 7. Dezember'";
fixes["['Von 15 bis 18 Uhr', 'Von 12 bis 20 Uhr']"] = "'Von 15 bis 18 Uhr', 'Von 12 bis 20 Uhr'";
fixes["['Besucher ueber 70 Jahre', 'Besucher aus dem Ausland']"] = "'Besucher ueber 70 Jahre', 'Besucher aus dem Ausland'";
fixes["['Ab 18 Jahren', 'Ab 21 Jahren']"] = "'Ab 18 Jahren', 'Ab 21 Jahren'";
fixes["['18 Monate', 'Zwei Jahre', 'Drei Jahre']"] = "'18 Monate', 'Zwei Jahre', 'Drei Jahre'";
fixes["['Einen Dienstwagen', 'Strukturierte Weiterbildung und faire Verguetung']"] = "'Einen Dienstwagen', 'Strukturierte Weiterbildung und faire Verguetung'";
fixes["['Vier', 'Fuenf']"] = "'Vier', 'Fuenf'";
fixes["['Nur maennliche Aerzte einsetzen', 'Den Patienten nach seinen Wuenschen fragen']"] = "'Nur maennliche Aerzte einsetzen', 'Den Patienten nach seinen Wuenschen fragen'";
fixes["['Standardisiert behandeln', 'Keine auslaendischen Patienten aufnehmen']"] = "'Standardisiert behandeln', 'Keine auslaendischen Patienten aufnehmen'";

// Also fix the options that got truncated - these still have nested from other contexts
fixes["['Einen Dienstwagen', 'Strukturierte Weiterbildung und faire Verguetung', 'Eine Wohnung']"] = "'Einen Dienstwagen', 'Strukturierte Weiterbildung und faire Verguetung', 'Eine Wohnung'";

let count = 0;
for (const [oldT, newT] of Object.entries(fixes)) {
  const before = c;
  c = c.replace(oldT, newT);
  if (c !== before) count++;
}

fs.writeFileSync('scripts/add_b2_listening_batch5.mjs', c);
console.log('Fixed', count, 'nested arrays');
