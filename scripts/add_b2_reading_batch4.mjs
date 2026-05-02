import fs from 'fs';
import { execSync } from 'child_process';

const readingPath = 'src/data/reading.json';
const reading = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

const b2 = reading.B2;
const prevCount = b2.length;
console.log(`Previous B2 reading count: ${prevCount}`);

const batch4 = [
  {
    id: 'B2_read_34',
    lessonId: 'B2_lesson_21',
    level: 'B2',
    title: 'Hygiene im Krankenhaus',
    text: 'Hygiene ist im Krankenhaus von groesster Bedeutung. Die Haendedesinfektion ist die wichtigste Massnahme zur Vermeidung von Krankenhausinfektionen. Jeder Mitarbeiter muss die Hygieneregeln kennen und einhalten. Dazu gehoeren das Tragen von Schutzkleidung, die richtige Reinigung von Geraeten und die sterile Arbeitsweise bei Operationen. Das Krankenhaus-Hygienepersonal ueberwacht die Einhaltung der Vorschriften. Besonders gefaehrlich sind multiresistente Keime, gegen die viele Antibiotika nicht mehr wirken.',
    questions: [
      { id: 'b2r34a', type: 'mcq', question: 'Was ist die wichtigste Massnahme zur Vermeidung von Krankenhausinfektionen?', options: ['Antibiotika', 'Die Haendedesinfektion', 'Schutzimpfungen', 'Luftfilter'], answer: 'Die Haendedesinfektion' },
      { id: 'b2r34b', type: 'true-false', question: 'Das Hygienepersonal ueberwacht die Einhaltung der Vorschriften.', answer: 'true' },
      { id: 'b2r34c', type: 'mcq', question: 'Was sind multiresistente Keime?', options: ['Keime, die gegen viele Antibiotika nicht mehr wirken', 'Neue Viren', 'Keime, die nur im Sommer vorkommen', 'Harmlose Bakterien'], answer: 'Keime, die gegen viele Antibiotika nicht mehr wirken' }
    ]
  },
  {
    id: 'B2_read_35',
    lessonId: 'B2_lesson_14',
    level: 'B2',
    title: 'Schichtarbeit und Schlafstoerungen',
    text: 'Schichtarbeit ist fuer viele Beschaeftigte im Gesundheitswesen Alltag. Der stetige Wechsel zwischen Frueh-, Spaet- und Nachtschicht belastet den Koerper. Der natuerliche Schlaf-Wach-Rhythmus wird gestoert. Die Folgen sind Schlafstoerungen, Muedigkeit und Konzentrationsprobleme. Langfristig erhoeht Schichtarbeit das Risiko fuer Herz-Kreislauf-Erkrankungen. Experten empfehlen, nach der Nachtschicht ausreichend zu schlafen und auf eine gesunde Ernaehrung zu achten. Auch kurze Nickerchen vor der Nachtschicht koennen helfen.',
    questions: [
      { id: 'b2r35a', type: 'mcq', question: 'Welche Folgen hat Schichtarbeit?', options: ['Mehr Energie', 'Schlafstoerungen, Muedigkeit und Konzentrationsprobleme', 'Bessere Laune', 'Weniger Hunger'], answer: 'Schlafstoerungen, Muedigkeit und Konzentrationsprobleme' },
      { id: 'b2r35b', type: 'true-false', question: 'Schichtarbeit erhoeht das Risiko fuer Herz-Kreislauf-Erkrankungen.', answer: 'true' },
      { id: 'b2r35c', type: 'mcq', question: 'Was empfehlen Experten fuer Schichtarbeiter?', options: ['Weniger schlafen', 'Nach der Nachtschicht ausreichend schlafen und gesund essen', 'Keine festen Schlafzeiten', 'Viel Kaffee trinken'], answer: 'Nach der Nachtschicht ausreichend schlafen und gesund essen' }
    ]
  },
  {
    id: 'B2_read_36',
    lessonId: 'B2_lesson_12',
    level: 'B2',
    title: 'Patientenbeschwerde richtig formulieren',
    text: 'Wenn Patienten mit der Behandlung unzufrieden sind, haben sie das Recht, eine Beschwerde einzureichen. Die Beschwerde sollte sachlich und klar formuliert sein. Eine schriftliche Beschwerde an die Klinikleitung oder die Krankenkasse ist am effektivsten. Wichtig ist, den Sachverhalt genau zu beschreiben: Wann ist was passiert? Welche Folgen hatte der Vorfall? Die Klinik ist verpflichtet, innerhalb einer bestimmten Frist zu reagieren. Bei schwerwiegenden Faellen kann auch die Patientenberatungsstelle eingeschaltet werden.',
    questions: [
      { id: 'b2r36a', type: 'mcq', question: 'Wie sollte eine Patientenbeschwerde formuliert sein?', options: ['Emotional und laut', 'Sachlich und klar', 'Kurz ohne Details', 'Nur muendlich'], answer: 'Sachlich und klar' },
      { id: 'b2r36b', type: 'true-false', question: 'Die Klinik muss innerhalb einer bestimmten Frist auf Beschwerden reagieren.', answer: 'true' },
      { id: 'b2r36c', type: 'mcq', question: 'Wer kann bei schwerwiegenden Beschwerden helfen?', options: ['Der Hausarzt', 'Die Patientenberatungsstelle', 'Die Apotheke', 'Die Polizei'], answer: 'Die Patientenberatungsstelle' }
    ]
  },
  {
    id: 'B2_read_37',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Bedienungsanleitung fuer ein Blutdruckmessgeraet',
    text: 'Moderne Blutdruckmessgeraete sind einfach zu bedienen. Vor der Messung sollte der Patient fuenf Minuten ruhig sitzen. Die Manschette wird am Oberarm auf Herzhoche angelegt. Waehrend der Messung sollte der Patient nicht sprechen. Das Geraet zeigt den systolischen und diastolischen Wert an. Der normale Blutdruck liegt unter 120/80 mmHg. Bei wiederholt hohen Werten sollte ein Arzt aufgesucht werden. Die Geraete sollten regelmaessig ueberprueft werden, um genaue Messungen zu gewaehrleisten.',
    questions: [
      { id: 'b2r37a', type: 'mcq', question: 'Wie lange sollte man vor der Blutdruckmessung ruhig sitzen?', options: ['Eine Minute', 'Fuenf Minuten', 'Zehn Minuten', 'Dreissig Minuten'], answer: 'Fuenf Minuten' },
      { id: 'b2r37b', type: 'true-false', question: 'Waehrend der Messung sollte der Patient nicht sprechen.', answer: 'true' },
      { id: 'b2r37c', type: 'mcq', question: 'Welcher Blutdruck gilt als normal?', options: ['Ueber 140/90', 'Unter 120/80', 'Ueber 160/100', 'Genau 130/85'], answer: 'Unter 120/80' }
    ]
  },
  {
    id: 'B2_read_38',
    lessonId: 'B2_lesson_10',
    level: 'B2',
    title: 'Ablehnung einer Kostenuebernahme durch die Krankenkasse',
    text: 'Manchmal lehnen Krankenkassen die Uebernahme von Behandlungskosten ab. Der Bescheid enthaelt eine Begruendung und eine Rechtsbehelfsbelehrung. Versicherte haben die Moeglichkeit, innerhalb eines Monats Widerspruch einzulegen. Der Widerspruch sollte schriftlich erfolgen und die Gruende fuer die Ablehnung widerlegen. Eine arztliche Stellungnahme kann helfen. Kommt die Kasse dem Widerspruch nicht nach, kann vor dem Sozialgericht geklagt werden. Viele Versicherte scheuen den Aufwand, obwohl die Erfolgsaussichten oft gut sind.',
    questions: [
      { id: 'b2r38a', type: 'mcq', question: 'Wie viel Zeit hat man fuer einen Widerspruch gegen die Krankenkasse?', options: ['Eine Woche', 'Einen Monat', 'Drei Monate', 'Ein Jahr'], answer: 'Einen Monat' },
      { id: 'b2r38b', type: 'true-false', question: 'Der Widerspruch sollte schriftlich erfolgen.', answer: 'true' },
      { id: 'b2r38c', type: 'mcq', question: 'Was kann man tun, wenn die Kasse den Widerspruch ablehnt?', options: ['Nichts mehr tun', 'Vor dem Sozialgericht klagen', 'Eine neue Versicherung suchen', 'Den Arzt wechseln'], answer: 'Vor dem Sozialgericht klagen' }
    ]
  },
  {
    id: 'B2_read_39',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Arbeitssicherheit in der Klinik',
    text: 'Die Arbeitssicherheit in Krankenhaeusern umfasst viele Bereiche. Mitarbeiter sind Gefahren durch Infektionen, schwere Lasten und chemische Stoffe ausgesetzt. Deshalb gibt es genaue Vorschriften zum Arbeitsschutz. Dazu gehoeren das Tragen von Schutzkleidung, die richtige Hebe-Technik beim Bewegen von Patienten und der Umgang mit Gefahrstoffen. Die Berufsgenossenschaft fuer Gesundheitsdienst und Wohlfahrtspflege (BGW) berate Kliniken zum Arbeitsschutz. Regelmaessige Unterweisungen sind Pflicht fuer alle Mitarbeiter.',
    questions: [
      { id: 'b2r39a', type: 'mcq', question: 'Welchen Gefahren sind Klinikmitarbeiter ausgesetzt?', options: ['Lauten Geraeten', 'Infektionen, schweren Lasten und chemischen Stoffen', 'Heissem Wetter', 'Elektrischem Strom'], answer: 'Infektionen, schweren Lasten und chemischen Stoffen' },
      { id: 'b2r39b', type: 'true-false', question: 'Die BGW berate Kliniken zum Arbeitsschutz.', answer: 'true' },
      { id: 'b2r39c', type: 'mcq', question: 'Was ist fuer alle Mitarbeiter zur Arbeitssicherheit Pflicht?', options: ['Freiwillige Schulungen', 'Regelmaessige Unterweisungen', 'Einmalige Einweisung', 'Ein Fuehrerschein'], answer: 'Regelmaessige Unterweisungen' }
    ]
  },
  {
    id: 'B2_read_40',
    lessonId: 'B2_lesson_14',
    level: 'B2',
    title: 'Psychische Belastung im Pflegeberuf',
    text: 'Die psychische Belastung in Pflegeberufen ist hoch. Pflegekraefte sind taeglich mit Leid, Tod und schweren Schicksalen konfrontiert. Zeitdruck und Personalmangel verstaerken die Belastung. Viele Pflegekraefte entwickeln Symptome von Erschoepfung oder Depression. Supervision und psychologische Beratung werden daher immer wichtiger. Einige Kliniken bieten feste Ansprechpartner fuer psychische Probleme an. Auch der Austausch im Team hilft, mit belastenden Situationen umzugehen.',
    questions: [
      { id: 'b2r40a', type: 'mcq', question: 'Womit sind Pflegekraefte taeglich konfrontiert?', options: ['Mit Bueroarbeit', 'Mit Leid, Tod und schweren Schicksalen', 'Mit Finanzfragen', 'Mit Reparaturen'], answer: 'Mit Leid, Tod und schweren Schicksalen' },
      { id: 'b2r40b', type: 'true-false', question: 'Supervision und psychologische Beratung werden in der Pflege immer wichtiger.', answer: 'true' },
      { id: 'b2r40c', type: 'mcq', question: 'Was verstaerkt die psychische Belastung in der Pflege?', options: ['Mehr Urlaubstage', 'Zeitdruck und Personalmangel', 'Bessere Bezahlung', 'Moderne Geraete'], answer: 'Zeitdruck und Personalmangel' }
    ]
  },
  {
    id: 'B2_read_41',
    lessonId: 'B2_lesson_9',
    level: 'B2',
    title: 'Ernaehrungsempfehlungen fuer Diabetiker',
    text: 'Menschen mit Diabetes muessen auf ihre Ernaehrung besonders achten. Der Blutzuckerspiegel wird stark von der Nahrungsaufnahme beeinflusst. Empfohlen werden ballaststoffreiche Lebensmittel wie Vollkornprodukte, Gemuese und Huelsenfruechte. Zucker und stark verarbeitete Kohlenhydrate sollten vermieden werden. Die Mahlzeiten sollten ueber den Tag verteilt werden. Eine Ernaehrungsberatung durch geschultes Fachpersonal kann Betroffenen helfen, ihren Speiseplan optimal anzupassen.',
    questions: [
      { id: 'b2r41a', type: 'mcq', question: 'Welche Lebensmittel werden fuer Diabetiker empfohlen?', options: ['Weissbrot und Suessigkeiten', 'Ballaststoffreiche Lebensmittel wie Vollkorn und Gemuese', 'Fertiggerichte', 'Gesuessene Getraenke'], answer: 'Ballaststoffreiche Lebensmittel wie Vollkorn und Gemuese' },
      { id: 'b2r41b', type: 'true-false', question: 'Der Blutzuckerspiegel wird stark von der Nahrungsaufnahme beeinflusst.', answer: 'true' },
      { id: 'b2r41c', type: 'mcq', question: 'Was kann Diabetikern helfen, ihren Speiseplan zu optimieren?', options: ['Ein Tagebuch', 'Eine Ernaehrungsberatung', 'Medikamente allein', 'Verzicht auf alle Kohlenhydrate'], answer: 'Eine Ernaehrungsberatung' }
    ]
  },
  {
    id: 'B2_read_42',
    lessonId: 'B2_lesson_3',
    level: 'B2',
    title: 'Informationen zur Grippeimpfung',
    text: 'Die Staendige Impfkommission (STIKO) empfiehlt die jaehrliche Grippeimpfung fuer bestimmte Personengruppen. Dazu gehoeren Menschen ueber 60 Jahre, chronisch Kranke, Schwangere und medizinisches Personal. Die Impfung wird im Herbst verabreicht, idealerweise zwischen Oktober und November. Sie schuetzt vor den in der Saison zirkulierenden Virusstaemmen. Der Impfschutz baut sich innerhalb von zwei Wochen auf. Nebenwirkungen sind selten und meist mild, wie eine Roetung an der Einstichstelle oder leichte Muedigkeit.',
    questions: [
      { id: 'b2r42a', type: 'mcq', question: 'Welche Personengruppe wird zur Grippeimpfung empfohlen?', options: ['Nur Kinder', 'Menschen ueber 60, chronisch Kranke und medizinisches Personal', 'Nur Sportler', 'Nur Menschen unter 30'], answer: 'Menschen ueber 60, chronisch Kranke und medizinisches Personal' },
      { id: 'b2r42b', type: 'true-false', question: 'Der Impfschutz baut sich innerhalb von zwei Wochen auf.', answer: 'true' },
      { id: 'b2r42c', type: 'mcq', question: 'Wann sollte die Grippeimpfung idealerweise verabreicht werden?', options: ['Im Fruehling', 'Zwischen Oktober und November', 'Im Dezember', 'Im Sommer'], answer: 'Zwischen Oktober und November' }
    ]
  },
  {
    id: 'B2_read_43',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Die Videosprechstunde in der Praxis',
    text: 'Die Videosprechstunde hat sich in den letzten Jahren stark verbreitet. Patienten koennen ihren Arzt per Videoanruf konsultieren, ohne persoenlich in die Praxis kommen zu muessen. Geeignet ist die Videosprechstunde vor allem fuer Verlaufskontrollen, Beratungsgespraeche und die Besprechung von Befunden. Fuer koerperliche Untersuchungen ist sie weniger geeignet. Die technischen Voraussetzungen sind eine stabile Internetverbindung und eine Kamera. Die Krankenkassen uebernehmen die Kosten in vielen Faellen. Aerzte schaetzen die Zeitersparnis.',
    questions: [
      { id: 'b2r43a', type: 'mcq', question: 'Wofuer ist die Videosprechstunde besonders geeignet?', options: ['Fuer Operationen', 'Fuer Verlaufskontrollen und Beratungsgespraeche', 'Fuer Notfaelle', 'Fuer Blutabnahmen'], answer: 'Fuer Verlaufskontrollen und Beratungsgespraeche' },
      { id: 'b2r43b', type: 'true-false', question: 'Fuer koerperliche Untersuchungen ist die Videosprechstunde weniger geeignet.', answer: 'true' },
      { id: 'b2r43c', type: 'mcq', question: 'Welche technischen Voraussetzungen braucht man?', options: ['Ein Faxgeraet', 'Eine stabile Internetverbindung und eine Kamera', 'Einen Drucker', 'Ein spezielles Telefon'], answer: 'Eine stabile Internetverbindung und eine Kamera' }
    ]
  }
];

b2.push(...batch4);
console.log(`B2 count after batch 4: ${b2.length}`);

function validate() {
  const errors = [];

  if (b2.length !== 43) errors.push(`Expected 43 B2 passages, got ${b2.length}`);

  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => { if (seen.has(id)) errors.push(`Duplicate ID: ${id}`); seen.add(id); });

  const titles = b2.map(p => p.title.toLowerCase());
  const seenTitles = new Set();
  titles.forEach((t, i) => { if (seenTitles.has(t)) errors.push(`Duplicate title: "${b2[i].title}"`); seenTitles.add(t); });

  b2.forEach((p, i) => {
    if (!p.id) errors.push(`Index ${i}: missing id`);
    if (!p.title) errors.push(`Index ${i}: missing title`);
    if (!p.text) errors.push(`Index ${i}: missing text`);
    if (!p.lessonId) errors.push(`Index ${i}: missing lessonId`);
    else if (!p.lessonId.startsWith('B2_lesson_')) errors.push(`Index ${i}: invalid lessonId ${p.lessonId}`);
    if (!p.questions || p.questions.length === 0) errors.push(`Index ${i} (${p.id}): missing questions`);
    else {
      p.questions.forEach(q => {
        if (!q.id) errors.push(`${p.id}: question missing id`);
        if (!q.type) errors.push(`${p.id}: question ${q.id} missing type`);
        if (!q.question) errors.push(`${p.id}: question ${q.id} missing question text`);
        if (!q.answer) errors.push(`${p.id}: question ${q.id} missing answer`);
        if (q.type === 'mcq' && (!q.options || q.options.length < 2)) errors.push(`${p.id}: question ${q.id} MCQ missing options`);
      });
    }
  });

  return errors;
}

const errors = validate();
if (errors.length > 0) {
  console.log('\nVALIDATION ERRORS:');
  errors.forEach(e => console.log(`  - ${e}`));
  process.exit(1);
}

fs.writeFileSync(readingPath, JSON.stringify(reading, null, 2) + '\n');
console.log('File written successfully.');

console.log('\nRunning npm build...');
try {
  execSync('npm run build 2>&1', { timeout: 120000 });
  console.log('\nBATCH 4 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
