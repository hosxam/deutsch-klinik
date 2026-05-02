import fs from 'fs';

let content = fs.readFileSync('scripts/add_b2_listening_batch4.mjs', 'utf8');

const fixes = {};
fixes["['Schutzkittel tragen', 'Fusssohlen desinfizieren']"] = "'Schutzkittel tragen', 'Fusssohlen desinfizieren'";
fixes["['Die Verdauung', 'Das Sehvermoegen']"] = "'Die Verdauung', 'Das Sehvermoegen'";
fixes["['Durch mehr Sport', 'Durch frueheres Zubettgehen']"] = "'Durch mehr Sport', 'Durch frueheres Zubettgehen'";
fixes["['Ueber die Wartezeit', 'Ueber die Reinigung']"] = "'Ueber die Wartezeit', 'Ueber die Reinigung'";
fixes["['Eine Woche vorher', 'Gar nicht']"] = "'Eine Woche vorher', 'Gar nicht'";
fixes["['Am Oberarm oben', 'Am Unterarm']"] = "'Am Oberarm oben', 'Am Unterarm'";
fixes["['Blutdruck zu hoch', 'Geraet defekt']"] = "'Blutdruck zu hoch', 'Geraet defekt'";
fixes["['Der Antrag war zu spaet', 'Die Versicherung wurde gekuendigt']"] = "'Der Antrag war zu spaet', 'Die Versicherung wurde gekuendigt'";
fixes["['Lautes Reden', 'Allein arbeiten']"] = "'Lautes Reden', 'Allein arbeiten'";
fixes["['Vier Wochen', 'Sechs Wochen', 'Acht Wochen']"] = "'Vier Wochen', 'Sechs Wochen', 'Acht Wochen'";
fixes["['Ob die Arbeitszeit reduziert wird', 'Ob ein Arbeitsplatzwechsel noetig ist']"] = "'Ob die Arbeitszeit reduziert wird', 'Ob ein Arbeitsplatzwechsel noetig ist'";
fixes["['Vier', 'Fuenf']"] = "'Vier', 'Fuenf'";
fixes["['Das Gewicht', 'Den Blutdruck']"] = "'Das Gewicht', 'Den Blutdruck'";
fixes["['Alle zehn Jahre']"] = "'Alle zehn Jahre'";
fixes["['Einen Impfpass', 'Eine Ueberweisung']"] = "'Einen Impfpass', 'Eine Ueberweisung'";

for (const [oldText, newText] of Object.entries(fixes)) {
  if (content.includes(oldText)) {
    content = content.replace(oldText, newText);
    console.log('Fixed:', oldText.substring(0, 50));
  } else {
    console.log('NOT FOUND:', oldText.substring(0, 50));
  }
}

fs.writeFileSync('scripts/add_b2_listening_batch4.mjs', content);
console.log('\nAll replacements attempted.');
