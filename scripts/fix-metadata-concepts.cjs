// fix-metadata-concepts.cjs - Update conceptsTaught in b2-lesson-metadata.json
const fs = require('fs');
const path = require('path');
const metaPath = path.join(__dirname, 'b2-lesson-metadata.json');
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

// Map lesson IDs to their concept conceptsTaught arrays
const CORRECT_CONCEPTS = {
  'B2_lesson_1': ['b2.passive.vorgang.zustand', 'b2.passive.vorgangspassiv', 'b2.passive.zustandspassiv'],
  'B2_lesson_2': ['b2.passive.alternatives', 'b2.passive.passiversatz', 'b2.passive.sein-zu'],
  'B2_lesson_3': ['b2.prapositionale.verben', 'b2.prapositionale.verb-praeposition', 'b2.prapositionale.da-komposita'],
  'B2_lesson_4': ['b2.modalverben.subjektiv', 'b2.modalverben.subjektive-bedeutung'],
  'B2_lesson_5': ['b2.nominalisierung', 'b2.nominalisierung.funktionsverbgefuege'],
  'B2_lesson_6': ['b2.konnektoren.formal', 'b2.konnektoren.doppelkonnektoren'],
  'B2_lesson_7': ['b2.relativsaetze', 'b2.relativsaetze.erweitert'],
  'B2_lesson_8': ['b2.indirekte.rede', 'b2.indirekte.rede.konjunktiv-i'],
  'B2_lesson_9': ['b2.nominalstil', 'b2.nominalstil.partizipialattribute'],
  'B2_lesson_10': ['b2.satzbau', 'b2.satzbau.stellungsfelder'],
  'B2_lesson_11': ['b2.globalisierung', 'b2.globalisierung.wirtschaftsdeutsch'],
  'B2_lesson_12': ['b2.ethik.wissenschaft', 'b2.ethik.wissenschaftsethik'],
  'B2_lesson_13': ['b2.bewerbung', 'b2.bewerbung.formelle-kommunikation'],
  'B2_lesson_14': ['b2.nachhaltigkeit', 'b2.nachhaltigkeit.umwelt'],
  'B2_lesson_15': ['b2.finanzen.wirtschaft', 'b2.finanzen.wirtschaftsdeutsch'],
  'B2_lesson_16': ['b2.migration.integration', 'b2.migration.vielfalt'],
  'B2_lesson_17': ['b2.recht.gerechtigkeit', 'b2.recht.grundgesetz'],
  'B2_lesson_18': ['b2.medien', 'b2.medien.journalismus'],
  'B2_lesson_19': ['b2.psychologie', 'b2.psychologie.lernen-motivation'],
  'B2_lesson_20': ['b2.tourismus', 'b2.tourismus.kultur-reisen'],
  'B2_lesson_21': ['b2.digitalisierung', 'b2.digitalisierung.ki'],
  'B2_lesson_22': ['b2.politik.gesellschaft', 'b2.politik.demokratie'],
  'B2_lesson_23': ['b2.smart.cities', 'b2.urbanisierung.stadtentwicklung'],
  'B2_lesson_24': ['b2.energie.klima', 'b2.energie.erneuerbare'],
  'B2_lesson_25': ['b2.kultur.leben', 'b2.kultur.kunst-sport']
};

for (const [k, v] of Object.entries(meta)) {
  if (CORRECT_CONCEPTS[k]) {
    v.conceptsTaught = CORRECT_CONCEPTS[k];
  }
}

fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
console.log('Updated conceptsTaught for', Object.keys(CORRECT_CONCEPTS).length, 'lessons');
