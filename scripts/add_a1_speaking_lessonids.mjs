import { readFileSync, writeFileSync } from 'fs';

const path = new URL('../src/data/speaking.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));
const a1 = data.A1;

// Lesson ID mapping for each of the 50 A1 speaking prompts
const lessonMap = {
  'A1_speak_1':  'A1_lesson_1',   // Sich vorstellen → Begruessungen und Vorstellungen
  'A1_speak_2':  'A1_lesson_2',   // Buchstabieren → Alphabet und Zahlen
  'A1_speak_3':  'A1_lesson_2',   // Zahlen und Telefonnummer → Alphabet und Zahlen
  'A1_speak_4':  'A1_lesson_13',  // Einen Gegenstand beschreiben → Meine Familie (describing things/possessions)
  'A1_speak_5':  'A1_lesson_10',  // Essen und Trinken → Im Restaurant bestellen
  'A1_speak_6':  'A1_lesson_15',  // Mein Tag → Mein Tagesablauf
  'A1_speak_7':  'A1_lesson_1',   // Einfache Frage stellen → Begruessungen und Vorstellungen
  'A1_speak_8':  'A1_lesson_11',  // Wetter beschreiben → Das Wetter
  'A1_speak_9':  'A1_lesson_16',  // In der Praxis → Koerperteile und Gesundheit
  'A1_speak_10': 'A1_lesson_1',   // Verabschiedung → Begruessungen und Vorstellungen
  'A1_speak_11': 'A1_lesson_3',   // Meine Familie → Meine Familie
  'A1_speak_12': 'A1_lesson_19',  // Mein Beruf / Mein Studium → Sich vorstellen
  'A1_speak_13': 'A1_lesson_15',  // Mein Morgen → Mein Tagesablauf
  'A1_speak_14': 'A1_lesson_15',  // Mein Abend → Mein Tagesablauf
  'A1_speak_15': 'A1_lesson_20',  // Was mochten Sie trinken? → Im Cafe bestellen
  'A1_speak_16': 'A1_lesson_9',   // Auf dem Markt / Im Supermarkt → Im Supermarkt einkaufen
  'A1_speak_17': 'A1_lesson_9',   // Nach Preisen fragen → Im Supermarkt einkaufen
  'A1_speak_18': 'A1_lesson_5',   // Nach dem Weg fragen → Nach dem Weg fragen
  'A1_speak_19': 'A1_lesson_11',  // Das Wetter heute → Das Wetter
  'A1_speak_20': 'A1_lesson_8',   // Meine Hobbys → Hobbys und Freizeit
  'A1_speak_21': 'A1_lesson_8',   // Sport und Bewegung → Hobbys und Freizeit
  'A1_speak_22': 'A1_lesson_16',  // Termin beim Arzt → Koerperteile und Gesundheit
  'A1_speak_23': 'A1_lesson_16',  // An der Rezeption → Koerperteile und Gesundheit
  'A1_speak_24': 'A1_lesson_16',  // Meine Symptome → Koerperteile und Gesundheit
  'A1_speak_25': 'A1_lesson_16',  // In der Apotheke → Koerperteile und Gesundheit
  'A1_speak_26': 'A1_lesson_16',  // Was tut weh? → Koerperteile und Gesundheit
  'A1_speak_27': 'A1_lesson_6',   // Uhrzeiten und Termine → Die Uhrzeit
  'A1_speak_28': 'A1_lesson_6',   // Termin verschieben → Die Uhrzeit
  'A1_speak_29': 'A1_lesson_16',  // Im Notfall → Koerperteile und Gesundheit
  'A1_speak_30': 'A1_lesson_19',  // Sich vorstellen (ausfuhrlich) → Sich vorstellen
  'A1_speak_31': 'A1_lesson_14',  // Meine Wohnung / Mein Haus → Mein Zuhause
  'A1_speak_32': 'A1_lesson_14',  // Mobel in meinem Zimmer → Mein Zuhause
  'A1_speak_33': 'A1_lesson_12',  // Farben → Farben und Kleidung
  'A1_speak_34': 'A1_lesson_10',  // Essen und Kochen → Im Restaurant bestellen
  'A1_speak_35': 'A1_lesson_12',  // Kleidung kaufen → Farben und Kleidung
  'A1_speak_36': 'A1_lesson_21',  // Mit dem Bus fahren → Transportmittel
  'A1_speak_37': 'A1_lesson_4',   // Im Restaurant → Im Restaurant
  'A1_speak_38': 'A1_lesson_23',  // Einladung zum Geburtstag → Geburtstag feiern
  'A1_speak_39': 'A1_lesson_15',  // Tagesablauf mit Uhrzeiten → Mein Tagesablauf
  'A1_speak_40': 'A1_lesson_8',   // Am Wochenende → Hobbys und Freizeit
  'A1_speak_41': 'A1_lesson_17',  // Haustiere → Tiere im Zoo
  'A1_speak_42': 'A1_lesson_3',   // Eine Person beschreiben → Meine Familie
  'A1_speak_43': 'A1_lesson_18',  // Eine Wohnung suchen → Meine Stadt
  'A1_speak_44': 'A1_lesson_19',  // Komplimente machen → Sich vorstellen
  'A1_speak_45': 'A1_lesson_22',  // Ein kurzes Telefongesprach → Telefonieren
  'A1_speak_46': 'A1_lesson_5',   // Einen Gegenstand verloren → Nach dem Weg fragen
  'A1_speak_47': 'A1_lesson_20',  // Im Hotel → Im Cafe bestellen (hospitality/cafe context)
  'A1_speak_48': 'A1_lesson_18',  // Auf der Post → Meine Stadt
  'A1_speak_49': 'A1_lesson_4',   // Beim Abendessen → Im Restaurant
  'A1_speak_50': 'A1_lesson_23',  // Plane machen → Geburtstag feiern
};

// Validate lesson IDs exist
const lessons = new Set();
for (let i = 1; i <= 25; i++) lessons.add('A1_lesson_' + i);

let updated = 0;
let missingLesson = false;

a1.forEach(entry => {
  if (!lessonMap[entry.id]) {
    console.log('NO MAPPING for:', entry.id);
    return;
  }
  const lid = lessonMap[entry.id];
  if (!lessons.has(lid)) {
    console.log('BROKEN lessonId:', lid, 'for', entry.id);
    missingLesson = true;
    return;
  }
  entry.lessonId = lid;
  updated++;
});

console.log(`Updated ${updated} prompts with lessonIds`);

// Distribution check
const dist = {};
a1.forEach(e => { const l = e.lessonId || 'none'; dist[l] = (dist[l] || 0) + 1; });
console.log('\nDistribution:');
Object.entries(dist).sort().forEach(([k,v]) => console.log(`  ${k}: ${v} prompts`));

// Validate all have lessonId
const missingId = a1.filter(e => !e.lessonId);
console.log(`\nMissing lessonId: ${missingId.length} (${missingId.map(e=>e.id).join(', ') || 'none'})`);

// Validate all existing A1 lessons
const lessonIds = new Set(Array.from({length:25}, (_,i) => 'A1_lesson_' + (i+1)));
const broken = a1.filter(e => e.lessonId && !lessonIds.has(e.lessonId));
console.log(`Broken lessonIds: ${broken.length} ${broken.length ? broken.map(e=>e.id+':'+e.lessonId).join(', ') : ''}`);

// Check IDs
const ids = a1.map(e => e.id);
const dupIds = ids.filter((id,i) => ids.indexOf(id) !== i);
console.log(`Duplicate IDs: ${dupIds.length ? [...new Set(dupIds)].join(', ') : 'none'}`);

// Check required fields
const req = ['id','level','title','prompt','instructions','prepTime','talkTime','lessonId'];
let missingFields = 0;
a1.forEach(e => {
  req.forEach(f => { if (e[f] === undefined || e[f] === null || e[f] === '') { missingFields++; console.log(`  MISSING ${f}: ${e.id}`); } });
});
console.log(`Missing required fields: ${missingFields}`);

// Write
writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('\nFile written successfully.');
