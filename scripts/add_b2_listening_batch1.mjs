import fs from 'fs';
import { execSync } from 'child_process';

const listeningPath = 'src/data/listening.json';
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));

const b2 = listening.B2;
const prevCount = b2.length;
console.log(`Previous B2 listening count: ${prevCount}`);

// Ensure lessonId + level on existing 3
b2[0].lessonId = 'B2_lesson_7';
b2[0].level = 'B2';
b2[1].lessonId = 'B2_lesson_16';
b2[1].level = 'B2';
b2[2].lessonId = 'B2_lesson_22';
b2[2].level = 'B2';

const batch1 = [
  {
    id: 'B2_listen_4',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Durchsage: Kommunikation in der Klinik',
    script: 'Guten Morgen, liebe Kolleginnen und Kollegen. Wir haben festgestellt, dass es in letzter Zeit vermehrt zu Missverstaendnissen zwischen den Stationen gekommen ist. Bitte denken Sie daran, alle wichtigen Informationen zur Patientenuebergabe schriftlich zu dokumentieren und bei der Uebergabe persoenlich zu besprechen. Ab naechster Woche bieten wir einen Workshop zur effektiven Kommunikation an. Die Teilnahme ist fuer alle Pflegekraefte und Aerzte der Inneren Medizin verpflichtend.',
    questions: [
      { id: 'b2l4a', type: 'true-false', question: 'Die Durchsage betrifft nur Aerzte.', answer: 'false' },
      { id: 'b2l4b', type: 'mcq', question: 'Was ist das Problem in der Klinik?', options: ['Zu wenig Personal', 'Missverstaendnisse zwischen Stationen', 'Zu viele Patienten', 'Defekte Geraete'], answer: 'Missverstaendnisse zwischen Stationen' },
      { id: 'b2l4c', type: 'mcq', question: 'Fuer wen ist der Workshop verpflichtend?', options: ['Alle Mitarbeiter des Krankenhauses', 'Pflegekraefte und Aerzte der Inneren Medizin', 'Nur die Pflegekraefte', 'Nur die Aerzte'], answer: 'Pflegekraefte und Aerzte der Inneren Medizin' }
    ]
  },
  {
    id: 'B2_listen_5',
    lessonId: 'B2_lesson_2',
    level: 'B2',
    title: 'Studienberatung fuer Medizinstudenten',
    script: 'Herzlich willkommen zur Studienberatung. Ich bin Frau Dr. Weber von der Fachschaft Medizin. Viele von Ihnen fragen sich, wie sie sich am besten auf die anstehenden Pruefungen vorbereiten koennen. Mein wichtigster Tipp: Planen Sie feste Lernzeiten ein und bilden Sie Lerngruppen. Untersuchungen zeigen, dass Studierende in Gruppen effektiver lernen als allein. Nutzen Sie auch die digitalen Angebote der Bibliothek. Die Online-Datenbanken sind rund um die Uhr verfuegbar. Vergessen Sie nicht, regelmaessig Pausen zu machen. Ihr Gehirn braucht Erholung, um Gelerntes zu verarbeiten.',
    questions: [
      { id: 'b2l5a', type: 'mcq', question: 'Was ist Frau Dr. Webers wichtigster Tipp?', options: ['Mehr Buecher lesen', 'Feste Lernzeiten und Lerngruppen', 'Weniger schlafen', 'Allein lernen'], answer: 'Feste Lernzeiten und Lerngruppen' },
      { id: 'b2l5b', type: 'true-false', question: 'Die Online-Datenbanken sind rund um die Uhr verfuegbar.', answer: 'true' },
      { id: 'b2l5c', type: 'mcq', question: 'Warum sind Pausen wichtig?', options: ['Weil das Gehirn Erholung braucht', 'Weil man sonst zu muede wird', 'Weil die Bibliothek schliesst', 'Weil der Koerper Schlaf braucht'], answer: 'Weil das Gehirn Erholung braucht' }
    ]
  },
  {
    id: 'B2_listen_6',
    lessonId: 'B2_lesson_12',
    level: 'B2',
    title: 'Anweisung zur Patientenidentifikation',
    script: 'Achtung, wichtige Sicherheitsinformation. Ab sofort muessen alle Patienten vor jeder Medikamentengabe mit zwei Identifikationsmerkmalen ueberprueft werden. Fragen Sie den Patienten nach seinem Namen und Geburtsdatum und vergleichen Sie die Angaben mit dem Armband. Bei bewusstlosen Patienten verwenden Sie ausschliesslich das Armband. Dieses Verfahren reduziert das Risiko von Medikationsfehlern erheblich. Bei Unstimmigkeiten informieren Sie sofort den Stationsarzt. Wir moechten in diesem Monat keine Zwischenfaelle mehr melden.',
    questions: [
      { id: 'b2l6a', type: 'mcq', question: 'Wie viele Identifikationsmerkmale muessen geprueft werden?', options: ['Eins', 'Zwei', 'Drei', 'Vier'], answer: 'Zwei' },
      { id: 'b2l6b', type: 'true-false', question: 'Bei bewusstlosen Patienten wird ausschliesslich das Armband verwendet.', answer: 'true' },
      { id: 'b2l6c', type: 'mcq', question: 'Was sollen Mitarbeiter bei Unstimmigkeiten tun?', options: ['Nichts tun', 'Den Stationsarzt informieren', 'Den Patienten entlassen', 'Das Medikament trotzdem geben'], answer: 'Den Stationsarzt informieren' }
    ]
  },
  {
    id: 'B2_listen_7',
    lessonId: 'B2_lesson_21',
    level: 'B2',
    title: 'Morgenbesprechung auf der Station',
    script: 'Guten Morgen, meine Damen und Herren. Hier die wichtigsten Informationen fuer die Fruehschicht. Wir haben heute 28 Patienten auf der Station, zwei Neuaufnahmen sind fuer heute Vormittag angemeldet. Frau Mueller auf Zimmer 12 wird heute entlassen. Bitte bereiten Sie die Entlassungspapiere vor. Herr Schmidt auf Zimmer 8 hat eine erhoehte Temperatur, hier ist eine Blutkultur abzunehmen. Die Visite beginnt heute um neun Uhr. Nach der Visite findet eine Fortbildung zur Wundversorgung statt, Beginn zehn Uhr im Konferenzraum.',
    questions: [
      { id: 'b2l7a', type: 'mcq', question: 'Wie viele Patienten sind auf der Station?', options: ['22', '25', '28', '30'], answer: '28' },
      { id: 'b2l7b', type: 'true-false', question: 'Frau Mueller auf Zimmer 12 wird heute entlassen.', answer: 'true' },
      { id: 'b2l7c', type: 'mcq', question: 'Um wie viel Uhr beginnt die Fortbildung?', options: ['Acht Uhr', 'Neun Uhr', 'Zehn Uhr', 'Elf Uhr'], answer: 'Zehn Uhr' }
    ]
  },
  {
    id: 'B2_listen_8',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Telefonansage: Terminbuchung online',
    script: 'Sie sind verbunden mit der Praxis Dres. Wagner und Kollegen. Unsere aktuellen Wartezeiten betragen etwa 15 Minuten. Wir weisen darauf hin, dass Sie Termine auch bequem online ueber unsere Webseite buchen koennen. Dafuer benoetigen Sie Ihre Versichertenkarte mit der persoenlichen Zugangsnummer. Falls Sie einen Termin nicht wahrnehmen koennen, sagen Sie bitte spaetestens 24 Stunden vorher ab. Andernfalls berechnen wir eine Ausfallgebuehr von 25 Euro. Fuer akute Notfaelle waehlen Sie bitte den Notruf 112.',
    questions: [
      { id: 'b2l8a', type: 'mcq', question: 'Wie lange betraegt die aktuelle Wartezeit?', options: ['5 Minuten', '10 Minuten', '15 Minuten', '20 Minuten'], answer: '15 Minuten' },
      { id: 'b2l8b', type: 'true-false', question: 'Termine koennen online ueber die Webseite gebucht werden.', answer: 'true' },
      { id: 'b2l8c', type: 'mcq', question: 'Wie viel kostet die Ausfallgebuehr?', options: ['10 Euro', '15 Euro', '20 Euro', '25 Euro'], answer: '25 Euro' }
    ]
  },
  {
    id: 'B2_listen_9',
    lessonId: 'B2_lesson_10',
    level: 'B2',
    title: 'Radiobericht: Krankenversicherung fuer Existenzgruender',
    script: 'Immer mehr Existenzgruender in Deutschland stehen vor der Frage: Welche Krankenversicherung ist die richtige? Unser Gesundheitsexperte erklaert: Wer sich selbststaendig macht, muss sich innerhalb von drei Monaten entscheiden. Die gesetzliche Versicherung ist fuer viele eine gute Wahl, weil die Beitraege vom Einkommen abhaengen. Die private Versicherung bietet oft mehr Leistungen, ist aber langfristig teurer. Experten raten, vor der Entscheidung einen unabhaengigen Versicherungsberater aufzusuchen.',
    questions: [
      { id: 'b2l9a', type: 'mcq', question: 'Wie viel Zeit haben Existenzgruender fuer die Entscheidung?', options: ['Einen Monat', 'Zwei Monate', 'Drei Monate', 'Sechs Monate'], answer: 'Drei Monate' },
      { id: 'b2l9b', type: 'true-false', question: 'Experten raten, einen Versicherungsberater aufzusuchen.', answer: 'true' },
      { id: 'b2l9c', type: 'mcq', question: 'Warum ist die gesetzliche Versicherung fuer viele eine gute Wahl?', options: ['Weil sie billiger ist', 'Weil die Beitraege vom Einkommen abhaengen', 'Weil sie alle Leistungen abdeckt', 'Weil sie einfacher ist'], answer: 'Weil die Beitraege vom Einkommen abhaengen' }
    ]
  },
  {
    id: 'B2_listen_10',
    lessonId: 'B2_lesson_3',
    level: 'B2',
    title: 'Vortrag: Gesundheitspolitik in Deutschland',
    script: 'Meine Damen und Herren, ich moechte Ihnen heute einen Ueberblick ueber die Gesundheitspolitik in Deutschland geben. Der Gesundheitsfonds, der 2009 eingefuehrt wurde, buendelt die Beitragszahlungen aller Versicherten und verteilt sie an die Krankenkassen. Ein Problem ist der demografische Wandel: Immer mehr aeltere Menschen brauchen medizinische Versorgung, waehrend weniger junge Menschen Beitraege zahlen. Die Politik sucht nach Loesungen, um das System zukunftssicher zu machen. Dazu gehoeren mehr Investitionen in die Praevention und der Ausbau der digitalen Gesundheitsangebote.',
    questions: [
      { id: 'b2l10a', type: 'mcq', question: 'Seit wann gibt es den Gesundheitsfonds?', options: ['1999', '2005', '2009', '2015'], answer: '2009' },
      { id: 'b2l10b', type: 'true-false', question: 'Der demografische Wandel belastet das Gesundheitssystem.', answer: 'true' },
      { id: 'b2l10c', type: 'mcq', question: 'Was ist eine Loesung fuer die Zukunft des Gesundheitssystems?', options: ['Weniger Krankenhaeuser', 'Investitionen in Praevention und digitale Angebote', 'Hoehere Steuern', 'Weniger Versicherte'], answer: 'Investitionen in Praevention und digitale Angebote' }
    ]
  },
  {
    id: 'B2_listen_11',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Podcast: Die elektronische Patientenakte',
    script: 'Herzlich willkommen zu unserem Gesundheitspodcast. Heute geht es um die elektronische Patientenakte, kurz ePA. Seit 2021 koennen alle gesetzlich Versicherten in Deutschland eine ePA einrichten. Die ePA speichert Befunde, Medikationsplaene und Impfungen an einem zentralen Ort. Der grosse Vorteil: Im Notfall haben alle behandelnden Aerzte sofort Zugriff auf wichtige Daten. Allerdings gibt es Datenschutzbedenken. Versicherte entscheiden selbst, wer welche Daten einsehen darf. Die Krankenkassen sind verpflichtet, ueber die Funktionsweise zu informieren.',
    questions: [
      { id: 'b2l11a', type: 'mcq', question: 'Seit wann koennen Versicherte eine ePA einrichten?', options: ['2019', '2020', '2021', '2022'], answer: '2021' },
      { id: 'b2l11b', type: 'mcq', question: 'Was speichert die ePA?', options: ['Nur Impfungen', 'Befunde, Medikationsplaene und Impfungen', 'Nur Rezepte', 'Nur Krankschreibungen'], answer: 'Befunde, Medikationsplaene und Impfungen' },
      { id: 'b2l11c', type: 'true-false', question: 'Jeder Arzt darf alle Daten in der ePA ohne Einschraenkung einsehen.', answer: 'false' }
    ]
  },
  {
    id: 'B2_listen_12',
    lessonId: 'B2_lesson_9',
    level: 'B2',
    title: 'Vortrag: Gesunde Ernaehrung im Alltag',
    script: 'Guten Abend. Ich bin Oekotrophologin Julia Meier und halte heute einen Vortrag zum Thema gesunde Ernaehrung. Viele Menschen denken, gesund essen sei kompliziert und teuer. Dabei sind die Grundregeln einfach: Essen Sie bunt und abwechslungsreich. Greifen Sie zu saisonalem Obst und Gemuese. Vollkornprodukte sollten auf Ihrem Speiseplan stehen. Trinken Sie ausreichend, am besten Wasser oder ungesuessten Tee. Vermeiden Sie stark verarbeitete Lebensmittel. Mein Tipp: Planen Sie Ihre Mahlzeiten fuer die Woche im Voraus. Das spart Zeit und Geld und hilft, ungesunde Spontankaeufe zu vermeiden.',
    questions: [
      { id: 'b2l12a', type: 'mcq', question: 'Was empfiehlt die Expertin zum Thema Ernaehrung?', options: ['Nur teure Lebensmittel kaufen', 'Bunt und abwechslungsreich essen', 'Nur Fleisch essen', 'Auf Kohlenhydrate verzichten'], answer: 'Bunt und abwechslungsreich essen' },
      { id: 'b2l12b', type: 'true-false', question: 'Stark verarbeitete Lebensmittel sollten vermieden werden.', answer: 'true' },
      { id: 'b2l12c', type: 'mcq', question: 'Welchen Tipp gibt die Expertin fuer die Woche?', options: ['Taeglich frisch kochen', 'Mahlzeiten im Voraus planen', 'Im Restaurant essen', 'Fertiggerichte kaufen'], answer: 'Mahlzeiten im Voraus planen' }
    ]
  },
  {
    id: 'B2_listen_13',
    lessonId: 'B2_lesson_18',
    level: 'B2',
    title: 'Radiobeitrag: Stadtklima und Gesundheit',
    script: 'In deutschen Staedten wird es immer heisser. Das hat direkte Auswirkungen auf die Gesundheit der Bewohner. Besonders aeltere Menschen und Kinder leiden unter Hitzewellen. Die Stadtverwaltung in Freiburg hat ein neues Projekt gestartet: Auf mehreren Daechem wurden begruente Flaschen angelegt. Sie kuehlen die Umgebung und verbessern die Luftqualitaet. Erste Messungen zeigen, dass die Temperatur auf begruenten Daechem bis zu fuenf Grad niedriger ist als auf herkoemmlichen Daechem. Das Projekt soll auf andere Staedte ausgeweitet werden.',
    questions: [
      { id: 'b2l13a', type: 'mcq', question: 'Wer leidet besonders unter Hitzewellen?', options: ['Junge Erwachsene', 'Aeltere Menschen und Kinder', 'Sportler', 'Touristen'], answer: 'Aeltere Menschen und Kinder' },
      { id: 'b2l13b', type: 'mcq', question: 'Wie viel Grad kuehler ist es auf begruenten Daechem?', options: ['Bis zu 2 Grad', 'Bis zu 5 Grad', 'Bis zu 8 Grad', 'Bis zu 10 Grad'], answer: 'Bis zu 5 Grad' },
      { id: 'b2l13c', type: 'true-false', question: 'Das Projekt in Freiburg soll auf andere Staedte ausgeweitet werden.', answer: 'true' }
    ]
  }
];

b2.push(...batch1);
console.log(`B2 count after batch 1: ${b2.length}`);

function validate() {
  const errors = [];

  if (b2.length !== 13) errors.push(`Expected 13 B2 listening items, got ${b2.length}`);

  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => { if (seen.has(id)) errors.push(`Duplicate ID: ${id}`); seen.add(id); });

  const scripts = b2.map(p => p.script?.substring(0, 50).toLowerCase());
  const seenScripts = new Set();
  scripts.forEach((s, i) => {
    if (seenScripts.has(s)) errors.push(`Similar script start at index ${i}: "${b2[i].title}"`);
    seenScripts.add(s);
  });

  b2.forEach((p, i) => {
    if (!p.id) errors.push(`Index ${i}: missing id`);
    if (!p.title) errors.push(`Index ${i}: missing title`);
    if (!p.script) errors.push(`Index ${i}: missing script`);
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

fs.writeFileSync(listeningPath, JSON.stringify(listening, null, 2) + '\n');
console.log('File written successfully.');

console.log('\nRunning npm build...');
try {
  execSync('npm run build 2>&1', { timeout: 120000 });
  console.log('\nBATCH 1 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
