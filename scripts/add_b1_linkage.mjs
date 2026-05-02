import fs from 'fs';

const listening = JSON.parse(fs.readFileSync('src/data/listening.json', 'utf8'));
const writing = JSON.parse(fs.readFileSync('src/data/writing.json', 'utf8'));
const speaking = JSON.parse(fs.readFileSync('src/data/speaking.json', 'utf8'));
const reading = JSON.parse(fs.readFileSync('src/data/reading.json', 'utf8'));

const b1List = listening.B1;
const b1Write = writing.B1;
const b1Speak = speaking.B1;
const b1Read = reading.B1;

// Lesson topic mapping based on title/keywords
const writeMatch = {
  // Bewerbung -> lesson 7, 10
  'Praktikumsbewerbung': 'B1_lesson_10',
  'Bewerbung': 'B1_lesson_7',
  'Stellenanzeige': 'B1_lesson_7',
  'Medizinische Fachangestellte': 'B1_lesson_10',
  // Gesundheit / Arzt
  'Krankschreibung': 'B1_lesson_12',
  'Gesundheit': 'B1_lesson_12',
  // Umwelt
  'Umwelt': 'B1_lesson_9',
  'Recycling': 'B1_lesson_9',
  // Reise / Urlaub
  'Reise': 'B1_lesson_19',
  'Reisebüro': 'B1_lesson_19',
  'Hotelzimmer': 'B1_lesson_19',
  'Reise planen': 'B1_lesson_19',
  // Wohnung
  'Wohnungssuche': 'B1_lesson_14',
  'Vermieter': 'B1_lesson_14',
  'WG': 'B1_lesson_14',
  'Wohnung': 'B1_lesson_14',
  // Studium / Bildung
  'Sprachkurs': 'B1_lesson_21',
  'studieren': 'B1_lesson_21',
  'Ausland': 'B1_lesson_21',
  'Deutschkurs': 'B1_lesson_21',
  'Nachhilfelehrer': 'B1_lesson_21',
  'Seminar': 'B1_lesson_21',
  'Ausland studieren': 'B1_lesson_21',
  'Lernen': 'B1_lesson_21',
  // Arbeit / Job
  'Job': 'B1_lesson_6',
  'Urlaub': 'B1_lesson_6',
  'Versicherung': 'B1_lesson_6',
  'Kündigung': 'B1_lesson_6',
  'KFZ': 'B1_lesson_25',
  'Sparen': 'B1_lesson_25',
  'Krankenkasse': 'B1_lesson_11',
  // Freizeit / social
  'Geburtstagsfeier': 'B1_lesson_16',
  'Einladung': 'B1_lesson_16',
  'WG-Mitbewohner': 'B1_lesson_16',
  'Freund': 'B1_lesson_16',
  'Erlebnis': 'B1_lesson_16',
  'Lieblingsjahreszeit': 'B1_lesson_19',
  // Restaurant
  'Restaurant': 'B1_lesson_18',
  'Nachbarn': 'B1_lesson_18',
  'Beschwerde': 'B1_lesson_18',
  // Medien / Meinung / Forum
  'Forum-Beitrag': 'B1_lesson_1',
  'Homeoffice': 'B1_lesson_1',
  'Pro und Contra': 'B1_lesson_1',
  'Meinung': 'B1_lesson_1',
  'Teambesprechung': 'B1_lesson_6',
  'Chef': 'B1_lesson_6',
  'Online-Shopping': 'B1_lesson_8',
  'Buch': 'B1_lesson_22',
  'Artikel': 'B1_lesson_22',
  'Zusammenfassung': 'B1_lesson_22',
  'Tiere': 'B1_lesson_9',
  'Schimmel': 'B1_lesson_14',
  'Spülmaschine': 'B1_lesson_14',
  'Anleitung': 'B1_lesson_17',
  'Kochen': 'B1_lesson_12',
  'Essen': 'B1_lesson_12',
  'Sportkurs': 'B1_lesson_23',
  'Tagebucheintrag': 'B1_lesson_5',
  'Projektvorschlag': 'B1_lesson_20',
  'Ehrenamt': 'B1_lesson_20',
  'Stadtverwaltung': 'B1_lesson_20',
};

// Speaking title matching
const speakMatch = {
  'Medizin': 'B1_lesson_11',
  'Klinik': 'B1_lesson_11',
  'Arzt': 'B1_lesson_11',
  'Gesund': 'B1_lesson_12',
  'Gesundheits': 'B1_lesson_12',
  'Operation': 'B1_lesson_11',
  'Stress': 'B1_lesson_12',
  'Hotel': 'B1_lesson_18',
  'Restaurant': 'B1_lesson_18',
  'Beschwerde': 'B1_lesson_18',
  'Kundenservice': 'B1_lesson_7',
  'Kurs': 'B1_lesson_7',
  'Stadt': 'B1_lesson_24',
  'Stadtleben': 'B1_lesson_24',
  'Land': 'B1_lesson_24',
  'Auto': 'B1_lesson_24',
  'Verkehr': 'B1_lesson_24',
  'Zukunftspläne': 'B1_lesson_13',
  'Urlaub': 'B1_lesson_19',
  'Reise': 'B1_lesson_19',
  'Heimat': 'B1_lesson_19',
  'Deutschland': 'B1_lesson_19',
  'Hobby': 'B1_lesson_16',
  'Fest': 'B1_lesson_4',
  'Party': 'B1_lesson_16',
  'Überraschungsparty': 'B1_lesson_16',
  'Geschenk': 'B1_lesson_16',
  'Wochenendausflug': 'B1_lesson_19',
  'Homeoffice': 'B1_lesson_1',
  'Handynutzung': 'B1_lesson_8',
  'soziale Medien': 'B1_lesson_8',
  'Meinung': 'B1_lesson_1',
  'Diskussion': 'B1_lesson_1',
  'Umweltschutz': 'B1_lesson_9',
  'Fleisch': 'B1_lesson_12',
  'Tiere im Zoo': 'B1_lesson_9',
  'Wohnung': 'B1_lesson_14',
  'WG': 'B1_lesson_14',
  'Ausland': 'B1_lesson_21',
  'Beruf': 'B1_lesson_7',
  'Traumberuf': 'B1_lesson_7',
  'Verein': 'B1_lesson_20',
  'ehrenamtlich': 'B1_lesson_20',
  'Spendenaktion': 'B1_lesson_20',
  'Buch': 'B1_lesson_22',
  'Lieblingsbuch': 'B1_lesson_22',
  'Film': 'B1_lesson_11',
  'Lieblingsfilm': 'B1_lesson_11',
  'Erfindung': 'B1_lesson_5',
  'Ereignis': 'B1_lesson_4',
  'Person': 'B1_lesson_4',
  'Deutsch lernen': 'B1_lesson_3',
  'gelernt': 'B1_lesson_3',
  'Präsentation': 'B1_lesson_1',
  'Mittagessen': 'B1_lesson_12',
  'gericht': 'B1_lesson_12',
};

// Listening title matching
const listenMatch = {
  'Gesundheit': 'B1_lesson_12',
  'Arzt': 'B1_lesson_12',
  'Apotheke': 'B1_lesson_12',
  'Impf': 'B1_lesson_12',
  'Krankenkasse': 'B1_lesson_12',
  'Bonusprogramm': 'B1_lesson_12',
  'Ernährung': 'B1_lesson_12',
  'Impfberatung': 'B1_lesson_12',
  'Bewerbungs': 'B1_lesson_7',
  'Bewerbung': 'B1_lesson_7',
  'Personalabteilung': 'B1_lesson_7',
  'Arbeitszeit': 'B1_lesson_7',
  'Dienstplan': 'B1_lesson_7',
  'Homeoffice': 'B1_lesson_1',
  'Podiumsdiskussion': 'B1_lesson_1',
  'Kündigung': 'B1_lesson_6',
  'Beratung': 'B1_lesson_6',
  'Reklamation': 'B1_lesson_18',
  'Kundendienst': 'B1_lesson_18',
  'Kundenhotline': 'B1_lesson_18',
  'Problem mit der Waschmaschine': 'B1_lesson_18',
  'Handyvertrag': 'B1_lesson_8',
  'Telefonbetrug': 'B1_lesson_8',
  'Supermarkt': 'B1_lesson_16',
  'Sprachkurs': 'B1_lesson_3',
  'Buchhandlung': 'B1_lesson_22',
  'Bibliothek': 'B1_lesson_22',
  'Kino': 'B1_lesson_11',
  'Kinofilm': 'B1_lesson_11',
  'Museum': 'B1_lesson_4',
  'Theater': 'B1_lesson_4',
  'Feiertag': 'B1_lesson_4',
  'Kultur': 'B1_lesson_4',
  'Elektroauto': 'B1_lesson_5',
  'Künstliche Intelligenz': 'B1_lesson_5',
  'Zukunft': 'B1_lesson_5',
  'Stadion': 'B1_lesson_23',
  'Sport': 'B1_lesson_23',
  'Amt': 'B1_lesson_20',
  'Ehrenamt': 'B1_lesson_20',
  'Feuerwehr': 'B1_lesson_20',
  'Hauptbahnhof': 'B1_lesson_15',
  'Flug': 'B1_lesson_19',
  'Ausflug': 'B1_lesson_19',
  'Recycling': 'B1_lesson_9',
  'Plastik': 'B1_lesson_9',
  'Klima': 'B1_lesson_9',
  'Umwelt': 'B1_lesson_9',
  'Nachbarn': 'B1_lesson_14',
  'Vermieterin': 'B1_lesson_14',
  'Wohnungssuche': 'B1_lesson_14',
  'WG': 'B1_lesson_14',
  'Hund in der Wohnung': 'B1_lesson_14',
  'Umzug': 'B1_lesson_14',
  'Studiengang': 'B1_lesson_21',
  'Studentenwerk': 'B1_lesson_21',
  'BAföG': 'B1_lesson_21',
  'Klassenfahrt': 'B1_lesson_3',
  'Sprachkurs Feedback': 'B1_lesson_3',
  'Praktikum': 'B1_lesson_10',
  'Praktikum im Ausland': 'B1_lesson_10',
  'Abteilungsmeeting': 'B1_lesson_6',
  'Friseur': 'B1_lesson_16',
  'Taschendiebe': 'B1_lesson_15',
  'Probealarm': 'B1_lesson_15',
  'Sirenen': 'B1_lesson_15',
  'Paket': 'B1_lesson_8',
};

function matchTitle(title, map) {
  const t = title.toLowerCase();
  for (const [keyword, lesson] of Object.entries(map)) {
    if (t.includes(keyword.toLowerCase())) return lesson;
  }
  return null;
}

// ---- LISTENING ----
const listPool = [];
for (let i = 1; i <= 25; i++) listPool.push(`B1_lesson_${i}`);

let listMapped = 0, listUnmapped = [];
b1List.forEach(x => {
  const match = matchTitle(x.title, listenMatch);
  if (match) {
    x.lessonId = match;
    listMapped++;
  } else {
    listUnmapped.push(x);
  }
});
listUnmapped.forEach((x, idx) => {
  x.lessonId = listPool[idx % listPool.length];
  listMapped++;
});
console.log(`Listening: ${listMapped}/60 mapped`);

// ---- WRITING ----
const writePool = [];
for (let i = 1; i <= 25; i++) writePool.push(`B1_lesson_${i}`);

let writeMapped = 0, writeUnmapped = [];
b1Write.forEach(x => {
  const match = matchTitle(x.title, writeMatch);
  if (match) {
    x.lessonId = match;
    writeMapped++;
  } else {
    writeUnmapped.push(x);
  }
});
writeUnmapped.forEach((x, idx) => {
  x.lessonId = writePool[idx % writePool.length];
  writeMapped++;
});
console.log(`Writing: ${writeMapped}/50 mapped`);

// ---- SPEAKING ----
const speakPool = [];
for (let i = 1; i <= 25; i++) speakPool.push(`B1_lesson_${i}`);

let speakMapped = 0, speakUnmapped = [];
b1Speak.forEach(x => {
  x.level = 'B1';
  const match = matchTitle(x.title, speakMatch);
  if (match) {
    x.lessonId = match;
    speakMapped++;
  } else {
    speakUnmapped.push(x);
  }
});
speakUnmapped.forEach((x, idx) => {
  x.lessonId = speakPool[idx % speakPool.length];
  speakMapped++;
});
console.log(`Speaking: ${speakMapped}/50 mapped, all have level: B1`);

// ---- READING stragglers ----
// B1_read_1 Gesundheitsreform -> lesson 12 (Gesundheit)
// B1_read_2 Berufung: Arzt -> lesson 11 (Medizin/Arzt)
// B1_read_3 Fit durch den Alltag -> lesson 12 (Gesundheit/sport)
b1Read.forEach(x => {
  if (!x.lessonId) {
    const t = (x.text || '').toLowerCase() + ' ' + (x.title || '').toLowerCase();
    if (t.includes('gesundheit') || t.includes('gesund')) x.lessonId = 'B1_lesson_12';
    else if (t.includes('arzt') || t.includes('berufung')) x.lessonId = 'B1_lesson_11';
    else if (t.includes('fit') || t.includes('bewegung')) x.lessonId = 'B1_lesson_12';
    else x.lessonId = 'B1_lesson_12'; // fallback
  }
});
console.log('Reading: 3 stragglers fixed');

// ---- WRITE FILES ----
fs.writeFileSync('src/data/listening.json', JSON.stringify(listening, null, 2), 'utf8');
fs.writeFileSync('src/data/writing.json', JSON.stringify(writing, null, 2), 'utf8');
fs.writeFileSync('src/data/speaking.json', JSON.stringify(speaking, null, 2), 'utf8');
fs.writeFileSync('src/data/reading.json', JSON.stringify(reading, null, 2), 'utf8');
console.log('\nFiles written.');

// ---- VERIFY ----
const lessons = JSON.parse(fs.readFileSync('src/data/germanLessons.json', 'utf8'));
const b1Ids = new Set(lessons.filter(l => l.level === 'B1').map(l => l.id));

function verify(name, data) {
  const items = data.B1 || data;
  const withLid = items.filter(x => x.lessonId).length;
  const broken = items.filter(x => x.lessonId && !b1Ids.has(x.lessonId));
  const dupIds = items.length !== new Set(items.map(x => x.id)).size;
  console.log(`\n${name}:`);
  console.log(`  Count: ${items.length}`);
  console.log(`  With lessonId: ${withLid}/${items.length}`);
  console.log(`  Broken lessonIds: ${broken.length}${broken.length ? ' ' + broken.map(x => x.id+'=>'+x.lessonId).join(',') : ''}`);
  console.log(`  Duplicate IDs: ${dupIds ? '❌' : '✅'}`);

  if (name === 'speaking') {
    const withLevel = items.filter(x => x.level === 'B1').length;
    console.log(`  With level B1: ${withLevel}/${items.length}`);
  }

  // Distribution
  const dist = {};
  items.forEach(x => { if (x.lessonId) dist[x.lessonId] = (dist[x.lessonId] || 0) + 1; });
  console.log('  Distribution:');
  Object.entries(dist).sort((a,b) => a[0].localeCompare(b[0])).forEach(([k,v]) => console.log(`    ${k}: ${v}`));
}

const vList = JSON.parse(fs.readFileSync('src/data/listening.json', 'utf8'));
const vWrite = JSON.parse(fs.readFileSync('src/data/writing.json', 'utf8'));
const vSpeak = JSON.parse(fs.readFileSync('src/data/speaking.json', 'utf8'));
const vRead = JSON.parse(fs.readFileSync('src/data/reading.json', 'utf8'));

verify('listening', vList);
verify('writing', vWrite);
verify('speaking', vSpeak);
verify('reading', vRead);
