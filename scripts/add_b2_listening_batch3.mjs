import fs from 'fs';
import { execSync } from 'child_process';

const listeningPath = 'src/data/listening.json';
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));

const b2 = listening.B2;
const prevCount = b2.length;
console.log(`Previous B2 listening count: ${prevCount}`);

const batch3 = [
  {
    id: 'B2_listen_24', lessonId: 'B2_lesson_3', level: 'B2',
    title: 'Radiobeitrag: Krebsvorsorge in Deutschland',
    script: 'In Deutschland nehmen immer weniger Menschen an Krebsvorsorgeuntersuchungen teil. Das zeigt eine aktuelle Studie der Deutschen Krebshilfe. Besonders betroffen sind die Darmspiegelung und der Hautkrebsscreening. Viele Menschen haben Angst vor den Untersuchungen oder wissen gar nicht, dass sie Anspruch darauf haben. Die Krankenkassen zahlen die wichtigsten Vorsorgeuntersuchungen ab einem bestimmten Alter vollstaendig. Experten empfehlen, die Termine zur Vorsorge direkt im Kalender zu notieren, sobald die Einladung der Krankenkasse kommt.',
    questions: [
      { id: 'b2l24a', type: 'mcq', question: 'Was zeigt die aktuelle Studie?', options: ['Immer mehr Menschen gehen zur Vorsorge', 'Immer weniger Menschen nehmen an der Vorsorge teil', 'Alle Menschen gehen zur Vorsorge', 'Die Vorsorge ist kostenpflichtig'], answer: 'Immer weniger Menschen nehmen an der Vorsorge teil' },
      { id: 'b2l24b', type: 'mcq', question: 'Welche Untersuchungen sind besonders betroffen?', options: ['Blutdruckmessung und Sehtest', 'Darmspiegelung und Hautkrebsscreening', 'Röntgen und Ultraschall', 'Hörtest und Allergietest'], answer: 'Darmspiegelung und Hautkrebsscreening' },
      { id: 'b2l24c', type: 'true-false', question: 'Die Krankenkasse zahlt die Vorsorgeuntersuchungen nicht.', answer: 'false' }
    ]
  },
  {
    id: 'B2_listen_25', lessonId: 'B2_lesson_22', level: 'B2',
    title: 'Apothekendurchsage: Richtige Medikamenteneinnahme',
    script: 'Guten Tag, liebe Kunden. Hier eine Information zur richtigen Einnahme von Medikamenten. Bitte beachten Sie die Hinweise auf dem Beipackzettel. Nehmen Sie Medikamente immer genau nach Absprache mit Ihrem Arzt ein. Veraendern Sie niemals eigenmaechtig die Dosierung. Falls Sie mehrere Medikamente gleichzeitig einnehmen, fragen Sie Ihren Apotheker nach moeglichen Wechselwirkungen. Lagern Sie Medikamente kuehl, trocken und ausserhalb der Reichweite von Kindern. Bei Fragen kommen Sie einfach zu uns ins Beratungszimmer.',
    questions: [
      { id: 'b2l25a', type: 'mcq', question: 'Wo stehen die Hinweise zur Medikamenteneinnahme?', options: ['Auf der Verpackung', 'Auf dem Beipackzettel', 'Auf einem extra Zettel', 'In der Arztpraxis'], answer: 'Auf dem Beipackzettel' },
      { id: 'b2l25b', type: 'true-false', question: 'Man darf die Dosierung eigenmaechtig veraendern.', answer: 'false' },
      { id: 'b2l25c', type: 'mcq', question: 'Wie sollen Medikamente gelagert werden?', options: ['Warm und feucht', 'Kuehl, trocken und kindersicher', 'Im Kuehlschrank ohne Verpackung', 'Im Badezimmerschrank'], answer: 'Kuehl, trocken und kindersicher' }
    ]
  },
  {
    id: 'B2_listen_26', lessonId: 'B2_lesson_8', level: 'B2',
    title: 'Rollenspiel: Arzt-Patienten-Gespraech',
    script: 'Guten Morgen, Herr Richter, setzen Sie sich. Was kann ich fuer Sie tun? "Herr Doktor, ich habe seit drei Wochen starke Rueckenschmerzen. Besonders morgens nach dem Aufstehen." Haben Sie schon etwas dagegen unternommen? "Ich habe Wärmepflaster ausprobiert, aber die helfen nur kurz." Dann werden wir das genauer untersuchen. Ich gebe Ihnen erstmal ein Rezept fuer entzuendungshemmende Salbe. Ausserdem ueberweise ich Sie zur Physiotherapie. Wenn die Schmerzen nach zwei Wochen nicht besser werden, machen wir ein MRT.',
    questions: [
      { id: 'b2l26a', type: 'mcq', question: 'Seit wann hat Herr Richter Rueckenschmerzen?', options: ['Seit einer Woche', 'Seit zwei Wochen', 'Seit drei Wochen', 'Seit einem Monat'], answer: 'Seit drei Wochen' },
      { id: 'b2l26b', type: 'true-false', question: 'Der Patient hat bereits Waermepflaster ausprobiert.', answer: 'true' },
      { id: 'b2l26c', type: 'mcq', question: 'Was bekommt der Patient vom Arzt?', options: ['Ein Rezept fuer Schmerztabletten', 'Ein Rezept fuer Salbe und eine Ueberweisung', 'Eine sofortige Operation', 'Krankengymnastik nur'], answer: 'Ein Rezept fuer Salbe und eine Ueberweisung' }
    ]
  },
  {
    id: 'B2_listen_27', lessonId: 'B2_lesson_1', level: 'B2',
    title: 'Workshop: Die perfekte Bewerbungsmappe',
    script: 'Herzlich willkommen zum Workshop Berufseinstieg im Gesundheitswesen. Heute zeige ich Ihnen, wie eine erfolgreiche Bewerbungsmappe aussieht. Das Anschreiben sollte maximal eine Seite lang sein und auf die Stelle zugeschnitten werden. Vermeiden Sie Floskeln wie "Hiermit bewerbe ich mich". Der Lebenslauf kommt in tabellarischer Form und ohne Luecken. Fuegen Sie relevante Zeugnisse und Nachweise bei. Ganz wichtig: Lassen Sie die Unterlagen von einer zweiten Person Korrektur lesen. Rechtschreibfehler sind ein haeufiger Ablehnungsgrund.',
    questions: [
      { id: 'b2l27a', type: 'mcq', question: 'Wie lang sollte das Anschreiben maximal sein?', options: ['Eine halbe Seite', 'Eine Seite', 'Zwei Seiten', 'Drei Seiten'], answer: 'Eine Seite' },
      { id: 'b2l27b', type: 'true-false', question: 'Der Lebenslauf soll in tabellarischer Form sein.', answer: 'true' },
      { id: 'b2l27c', type: 'mcq', question: 'Was ist ein haeufiger Ablehnungsgrund?', options: ['Zu viele Zeugnisse', 'Rechtschreibfehler', 'Zu lange Berufserfahrung', 'Farbige Bewerbungen'], answer: 'Rechtschreibfehler' }
    ]
  },
  {
    id: 'B2_listen_28', lessonId: 'B2_lesson_4', level: 'B2',
    title: 'Vorbereitungskurs: Das Vorstellungsgespraech',
    script: 'Herzlich willkommen zu unserem Kurs zur Vorbereitung auf das Vorstellungsgespraech. Ich bin Ihr Trainer und gebe Ihnen heute die wichtigsten Tipps. Bereiten Sie sich gut vor: Informieren Sie sich ueber das Krankenhaus, bei dem Sie sich bewerben. Ueben Sie typische Fragen, zum Beispiel: "Was sind Ihre Staerken und Schwaechen?" Wichtig ist auch die Koerpersprache: Sitzen Sie aufrecht, schauen Sie Ihrem Gespraechspartner in die Augen. Stellen Sie am Ende eigene Fragen, das zeigt Interesse. Und vergessen Sie nicht: Das Gespraech ist keine Pruefung, sondern ein Kennenlernen auf Augenhöhe.',
    questions: [
      { id: 'b2l28a', type: 'mcq', question: 'Was ist ein wichtiger Vorbereitungstipp?', options: ['Nichts ueber das Krankenhaus wissen', 'Sich ueber das Krankenhaus informieren', 'Alte Bewerbung wiederverwenden', 'Zu spaet kommen'], answer: 'Sich ueber das Krankenhaus informieren' },
      { id: 'b2l28b', type: 'mcq', question: 'Was wird zur Koerpersprache empfohlen?', options: ['Auf den Boden schauen', 'Aufrecht sitzen und Augenkontakt halten', 'Die Arme verschraenken', 'Auf dem Stuhl wippen'], answer: 'Aufrecht sitzen und Augenkontakt halten' },
      { id: 'b2l28c', type: 'true-false', question: 'Das Vorstellungsgespraech ist eine Pruefung.', answer: 'false' }
    ]
  },
  {
    id: 'B2_listen_29', lessonId: 'B2_lesson_21', level: 'B2',
    title: 'Aufnahmeinterview: Entlassungsplanung',
    script: 'Guten Tag, Frau Dr. Bauer vom Entlassungsmanagement. Ich moechte mit Ihnen den Ablauf nach Ihrem Krankenhausaufenthalt besprechen. Sie werden voraussichtlich am Freitag entlassen. Brauchen Sie zu Hause Unterstützung? "Ja, ich wohne alleine und habe Probleme beim Treppensteigen." Dann organisieren wir einen Pflegedienst, der zweimal taeglich vorbeikommt. Auch eine Haushaltshilfe koennen wir beantragen. Ausserdem bekommen Sie einen Reha-Sport verschrieben. Die Unterlagen gebe ich Ihnen am Entlassungstag. Haben Sie noch Fragen? "Nein, das klingt gut, vielen Dank."',
    questions: [
      { id: 'b2l29a', type: 'mcq', question: 'An welchem Tag wird die Patientin voraussichtlich entlassen?', options: ['Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'], answer: 'Freitag' },
      { id: 'b2l29b', type: 'true-false', question: 'Die Patientin wohnt alleine und hat Probleme beim Treppensteigen.', answer: 'true' },
      { id: 'b2l29c', type: 'mcq', question: 'Was wird fuer die Patientin organisiert?', options: ['Ein Pflegedienst und Reha-Sport', 'Ein Pflegeheimplatz', 'Eine Operation', 'Nur Medikamente'], answer: 'Ein Pflegedienst und Reha-Sport' }
    ]
  },
  {
    id: 'B2_listen_30', lessonId: 'B2_lesson_12', level: 'B2',
    title: 'Aufklaerungsgespraech: Einwilligung zur OP',
    script: 'Guten Tag, Herr Schmidt. Ich bin Oberarzt Dr. Wagner. Ich moechte Sie ueber den bevorstehenden Eingriff aufklaeren. Bei Ihnen wird eine Kniearthroskopie durchgefuehrt. Das ist ein minimalinvasiver Eingriff, bei dem wir durch zwei kleine Schnitte das Kniegelenk untersuchen und reparieren. Die OP dauert etwa 45 Minuten. Wie bei jedem Eingriff gibt es Risiken: Infektionen, Nachblutungen oder Thrombosen. Die Wahrscheinlichkeit ist aber gering. Haben Sie die Aufklaerungsbroschuere gelesen? "Ja, habe ich." Gut, dann unterschreiben Sie bitte hier die Einwilligungserklaerung.',
    questions: [
      { id: 'b2l30a', type: 'mcq', question: 'Um welchen Eingriff handelt es sich?', options: ['Eine Hüft-OP', 'Eine Kniearthroskopie', 'Eine Wirbelsaeulen-OP', 'Eine Schulter-OP'], answer: 'Eine Kniearthroskopie' },
      { id: 'b2l30b', type: 'mcq', question: 'Wie lange dauert die OP etwa?', options: ['20 Minuten', '30 Minuten', '45 Minuten', '60 Minuten'], answer: '45 Minuten' },
      { id: 'b2l30c', type: 'true-false', question: 'Die Wahrscheinlichkeit von Komplikationen ist gering.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_31', lessonId: 'B2_lesson_14', level: 'B2',
    title: 'Moderation: Teamkonflikt auf der Station',
    script: 'Ich begruesse Sie zur Teamsitzung der Station Beta. Wir muessen ein Problem besprechen, das in den letzten Wochen immer wieder aufgetreten ist. Zwischen der Frueh- und Spaetschicht gibt es Spannungen, weil Uebergaben nicht richtig funktionieren. Die Fruehschicht sagt, sie habe keine Zeit fuer ausfuehrliche Berichte. Die Spaetschicht fuehlt sich schlecht informiert. Mein Vorschlag: Wir fuehren ein standardisiertes Uebergabeprotokoll ein. Das dauert fuenf Minuten, sorgt aber fuer Klarheit und weniger Fehler. Sind alle einverstanden? Dann probieren wir das ab naechster Woche aus.',
    questions: [
      { id: 'b2l31a', type: 'mcq', question: 'Wo gibt es Spannungen?', options: ['Zwischen Aerzten und Pflege', 'Zwischen Frueh- und Spaetschicht', 'Zwischen Chirurgie und Innerer Medizin', 'Zwischen Verwaltung und Pflege'], answer: 'Zwischen Frueh- und Spaetschicht' },
      { id: 'b2l31b', type: 'true-false', question: 'Die Fruehschicht hat laut eigener Aussage keine Zeit fuer ausfuehrliche Berichte.', answer: 'true' },
      { id: 'b2l31c', type: 'mcq', question: 'Was wird als Loesung vorgeschlagen?', options: ['Mehr Personal einstellen', 'Ein standardisiertes Uebergabeprotokoll', 'Die Spaetschicht abschaffen', 'Weniger Patienten aufnehmen'], answer: 'Ein standardisiertes Uebergabeprotokoll' }
    ]
  },
  {
    id: 'B2_listen_32', lessonId: 'B2_lesson_2', level: 'B2',
    title: 'Fachvortrag: Zusammenfassung einer Studie',
    script: 'Ich moechte Ihnen heute die Ergebnisse einer aktuellen Studie aus dem New England Journal of Medicine vorstellen. Die Studie untersuchte die Wirksamkeit eines neuen Wirkstoffs gegen Migraene. In einer randomisierten kontrollierten Studie mit 1200 Patienten zeigte der Wirkstoff eine signifikante Reduktion der Migraeneta-ge um durchschnittlich 60 Prozent. Die Nebenwirkungen waren mild und beschraenkten sich auf Muedigkeit leichten Schwindel. Die Forscher betonen, dass weitere Studien noetig sind, um die Langzeitwirkungen zu untersuchen.',
    questions: [
      { id: 'b2l32a', type: 'mcq', question: 'Wie viele Patienten nahmen an der Studie teil?', options: ['500', '900', '1200', '2000'], answer: '1200' },
      { id: 'b2l32b', type: 'mcq', question: 'Um wie viel Prozent wurden die Migraeneta-ge reduziert?', options: ['40 Prozent', '50 Prozent', '60 Prozent', '70 Prozent'], answer: '60 Prozent' },
      { id: 'b2l32c', type: 'true-false', question: 'Eine weitere Studie ist nicht notwendig.', answer: 'false' }
    ]
  },
  {
    id: 'B2_listen_33', lessonId: 'B2_lesson_16', level: 'B2',
    title: 'Gesundheitspodcast: Die besten Health-Apps',
    script: 'Herzlich willkommen zu einer neuen Folge unseres Digital-Health-Podcasts. Heute testen wir drei Gesundheits-Apps. Die erste App heisst "MediTracker" und hilft bei der Medikamenteneinnahme. Sie erinnert an die Einnahme und dokumentiert, ob Tabletten genommen wurden. Die zweite App "SleepWell" ueberwacht die Schlafqualitaet. Das Highlight ist aber "BlutCheck". Die App analysiert mit der Handykamera den Blutdruck. Nicht so genau wie ein richtiges Geraet, sagt der Hersteller, aber gut fuer den Ueberblick. Alle drei Apps sind kostenlos im App Store erhaeltlich.',
    questions: [
      { id: 'b2l33a', type: 'mcq', question: 'Was kann die App MediTracker?', options: ['Blutdruck messen', 'An die Medikamenteneinnahme erinnern und dokumentieren', 'Den Schlaf ueberwachen', 'Termine verwalten'], answer: 'An die Medikamenteneinnahme erinnern und dokumentieren' },
      { id: 'b2l33b', type: 'true-false', question: 'Die App BlutCheck misst den Blutdruck mit der Handykamera.', answer: 'true' },
      { id: 'b2l33c', type: 'mcq', question: 'Was kosten die drei Apps?', options: ['Sie kosten alle Geld', 'Sie sind kostenlos', 'Zwei sind kostenlos', 'Nur die erste ist kostenlos'], answer: 'Sie sind kostenlos' }
    ]
  }
];

b2.push(...batch3);
console.log(`B2 count after batch 3: ${b2.length}`);

function validate() {
  const errors = [];
  if (b2.length !== 33) errors.push(`Expected 33 B2 items, got ${b2.length}`);

  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => { if (seen.has(id)) errors.push(`Duplicate ID: ${id}`); seen.add(id); });

  const scriptStarts = new Set();
  b2.forEach(p => {
    const s = p.script?.substring(0, 40).toLowerCase();
    if (scriptStarts.has(s)) errors.push(`Duplicate script start: ${p.id} - ${p.title}`);
    scriptStarts.add(s);
  });

  b2.forEach((p, i) => {
    if (!p.id) errors.push(`Index ${i}: missing id`);
    if (!p.title) errors.push(`Index ${i}: missing title`);
    if (!p.script) errors.push(`Index ${i}: missing script`);
    if (!p.lessonId || !p.lessonId.startsWith('B2_lesson_')) errors.push(`Index ${i}: invalid lessonId`);
    if (!p.questions || p.questions.length === 0) errors.push(`Index ${i} (${p.id}): missing questions`);
    else p.questions.forEach(q => {
      if (!q.id) errors.push(`${p.id}: question missing id`);
      if (!q.type) errors.push(`${p.id}: q missing type`);
      if (!q.question) errors.push(`${p.id}: q missing question`);
      if (!q.answer) errors.push(`${p.id}: q missing answer`);
      if (q.type === 'mcq' && (!q.options || q.options.length < 2)) errors.push(`${p.id}: MCQ missing options`);
      // Check for nested arrays in options
      if (q.options && q.type === 'mcq') {
        q.options.forEach((o, idx) => {
          if (Array.isArray(o)) errors.push(`${p.id}: ${q.id} option ${idx} is a nested array`);
        });
      }
    });
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
  console.log('\nBATCH 3 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
