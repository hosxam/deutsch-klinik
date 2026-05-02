import fs from 'fs';
import { execSync } from 'child_process';

const readingPath = 'src/data/reading.json';
const reading = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

const b2 = reading.B2;
const prevCount = b2.length;
console.log(`Previous B2 reading count: ${prevCount}`);

const batch3 = [
  {
    id: 'B2_read_24',
    lessonId: 'B2_lesson_21',
    level: 'B2',
    title: 'Vorsorgeuntersuchungen und Frueherkennung',
    text: 'Vorsorgeuntersuchungen helfen, Krankheiten fruehzeitig zu erkennen. Die gesetzlichen Krankenkassen uebernehmen die Kosten fuer viele Vorsorgeleistungen. Dazu gehoeren das Hautkrebsscreening ab 35, die Darmspiegelung ab 50 und der Gesundheits-Check-up alle drei Jahre. Viele Menschen nutzen diese Angebote jedoch nicht regelmaessig. Studien zeigen, dass die Teilnahme an Vorsorgeuntersuchungen von der Aufklaerung durch den Hausarzt abhaengt. Wer regelmaessig zur Vorsorge geht, hat bessere Heilungschancen bei vielen Erkrankungen.',
    questions: [
      { id: 'b2r24a', type: 'mcq', question: 'Welche Vorsorgeuntersuchung wird ab 35 von den Krankenkassen uebernommen?', options: ['Darmspiegelung', 'Hautkrebsscreening', 'Gesundheits-Check-up', 'Mammographie'], answer: 'Hautkrebsscreening' },
      { id: 'b2r24b', type: 'true-false', question: 'Die Teilnahme an Vorsorgeuntersuchungen haengt von der Aufklaerung durch den Hausarzt ab.', answer: 'true' },
      { id: 'b2r24c', type: 'mcq', question: 'Wie oft koennen Versicherte einen Gesundheits-Check-up machen?', options: ['Jaehrlich', 'Alle drei Jahre', 'Alle fuenf Jahre', 'Alle zehn Jahre'], answer: 'Alle drei Jahre' }
    ]
  },
  {
    id: 'B2_read_25',
    lessonId: 'B2_lesson_10',
    level: 'B2',
    title: 'Der richtige Umgang mit Medikamenten',
    text: 'Die korrekte Einnahme von Medikamenten ist entscheidend fuer den Behandlungserfolg. Der Beipackzettel enthaelt wichtige Informationen zur Dosierung, Einnahme und zu moeglichen Nebenwirkungen. Patienten sollten ihren Arzt oder Apotheker fragen, wenn sie etwas nicht verstehen. Ein Medikationsplan hilft, den Ueberblick ueber mehrere Medikamente zu behalten. Besonders aeltere Menschen nehmen oft mehrere Praeparate gleichzeitig ein. Hier ist die Beratung durch den Apotheker besonders wichtig.',
    questions: [
      { id: 'b2r25a', type: 'mcq', question: 'Was enthaelt der Beipackzettel?', options: ['Nur den Preis', 'Dosierung, Einnahme und Nebenwirkungen', 'Nur den Namen des Medikaments', 'Die Zutatenliste'], answer: 'Dosierung, Einnahme und Nebenwirkungen' },
      { id: 'b2r25b', type: 'true-false', question: 'Ein Medikationsplan hilft, mehrere Medikamente im Blick zu behalten.', answer: 'true' },
      { id: 'b2r25c', type: 'mcq', question: 'Welche Patientengruppe braucht besonders haeufig eine Medikamentenberatung?', options: ['Kinder', 'Junge Erwachsene', 'Aeltere Menschen', 'Sportler'], answer: 'Aeltere Menschen' }
    ]
  },
  {
    id: 'B2_read_26',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Das Arzt-Patienten-Gespraech',
    text: 'Ein gutes Arzt-Patienten-Gespraech ist die Grundlage jeder Behandlung. Der Arzt sollte dem Patienten aufmerksam zuhoeren und Fachbegriffe erklaeren. Der Patient wiederum sollte seine Symptome genau beschreiben und Fragen stellen. Offene Kommunikation schafft Vertrauen und verbessert die Therapietreue. In der medizinischen Ausbildung wird deshalb grosser Wert auf Kommunikationstraining gelegt. Schwierige Gespraeche wie die Uebermittlung einer schweren Diagnose erfordern besonderes Einfuehlungsvermoegen.',
    questions: [
      { id: 'b2r26a', type: 'mcq', question: 'Was ist die Grundlage jeder Behandlung?', options: ['Teure Medikamente', 'Ein gutes Arzt-Patienten-Gespraech', 'Moderne Geraete', 'Kurze Wartezeiten'], answer: 'Ein gutes Arzt-Patienten-Gespraech' },
      { id: 'b2r26b', type: 'true-false', question: 'Der Patient sollte seine Symptome genau beschreiben und Fragen stellen.', answer: 'true' },
      { id: 'b2r26c', type: 'mcq', question: 'Was erfordert die Uebermittlung einer schweren Diagnose?', options: ['Schnelligkeit', 'Viel Fachwissen', 'Besonderes Einfuehlungsvermoegen', 'Eine zweite Meinung'], answer: 'Besonderes Einfuehlungsvermoegen' }
    ]
  },
  {
    id: 'B2_read_27',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Das Anschreiben fuer Medizinstudenten',
    text: 'Ein ueberzeugendes Anschreiben ist der erste Schritt zu einem Praktikumsplatz oder einer Stelle im Krankenhaus. Medizinstudenten sollten ihre Motivation fuer das Fach deutlich machen. Praktische Erfahrungen, etwa im Pflegepraktikum oder durch studentische Mitarbeit, sind ein Plus. Auch ausseruniversitaeres Engagement zeigt Persoenlichkeit. Wichtig ist, dass das Anschreiben auf die jeweilige Stelle zugeschnitten ist. Ein Standardbrief ohne Bezug zur Klinik macht keinen guten Eindruck.',
    questions: [
      { id: 'b2r27a', type: 'mcq', question: 'Was sollten Medizinstudenten in ihrem Anschreiben zeigen?', options: ['Nur gute Noten', 'Motivation fuer das Fach und praktische Erfahrungen', 'Den Wunsch nach viel Freizeit', 'Die Bereitschaft zu Ueberstunden'], answer: 'Motivation fuer das Fach und praktische Erfahrungen' },
      { id: 'b2r27b', type: 'true-false', question: 'Ein Standardanschreiben ohne Bezug zur Klinik ist akzeptabel.', answer: 'false' },
      { id: 'b2r27c', type: 'mcq', question: 'Was zeigt ausseruniversitaeres Engagement?', options: ['Dass der Student viel Freizeit hat', 'Persoenlichkeit', 'Dass der Student reich ist', 'Dass der Student keine Noten hat'], answer: 'Persoenlichkeit' }
    ]
  },
  {
    id: 'B2_read_28',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Das Vorstellungsgespraech in der Klinik',
    text: 'Das Vorstellungsgespraech in einer Klinik unterscheidet sich von Gespraechen in der freien Wirtschaft. Fachfragen zur Medizin sind haeufig. Auch Fragen zur Teamfaehigkeit und zur Belastbarkeit sind wichtig. Bewerber sollten ihre Erfahrungen aus dem Studium und frueheren Taetigkeiten konkret darstellen. Ein:e Personalverantwortliche:r achtet auf Kommunikationsfaehigkeit und Empathie. Am Ende des Gespraechs haben Bewerber die Moeglichkeit, eigene Fragen zu stellen. Das zeigt Interesse und Engagement.',
    questions: [
      { id: 'b2r28a', type: 'mcq', question: 'Welche Fragen sind in einem Klinik-Vorstellungsgespraech haeufig?', options: ['Fragen zur Politik', 'Fachfragen zur Medizin und Fragen zur Teamfaehigkeit', 'Fragen zum Urlaub', 'Fragen zum Gehalt'], answer: 'Fachfragen zur Medizin und Fragen zur Teamfaehigkeit' },
      { id: 'b2r28b', type: 'true-false', question: 'Am Ende duerfen Bewerber eigene Fragen stellen.', answer: 'true' },
      { id: 'b2r28c', type: 'mcq', question: 'Worauf achten Personalverantwortliche besonders?', options: ['Auf die Kleidung', 'Auf Kommunikationsfaehigkeit und Empathie', 'Auf die Note im Abitur', 'Auf den Wohnort'], answer: 'Auf Kommunikationsfaehigkeit und Empathie' }
    ]
  },
  {
    id: 'B2_read_29',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Der Arztbrief nach dem Krankenhausaufenthalt',
    text: 'Nach einem Krankenhausaufenthalt erhalten Patienten einen Arztbrief. Dieses Dokument fasst den Grund des Aufenthalts, die durchgefuehrten Untersuchungen und die Behandlung zusammen. Auch die Medikation bei Entlassung und Empfehlungen fuer die weitere Versorgung sind enthalten. Der Arztbrief ist sowohl fuer den Patienten als auch fuer den weiterbehandelnden Hausarzt wichtig. Inzwischen werden Arztbriefe oft digital uebermittelt. Patienten sollten den Brief sorgfaeltig lesen und bei Unklarheiten nachfragen.',
    questions: [
      { id: 'b2r29a', type: 'mcq', question: 'Welche Informationen enthaelt ein Arztbrief?', options: ['Nur die Rechnung', 'Grund des Aufenthalts, Untersuchungen, Behandlung und Medikation', 'Nur die Diagnose', 'Nur den Entlassungstermin'], answer: 'Grund des Aufenthalts, Untersuchungen, Behandlung und Medikation' },
      { id: 'b2r29b', type: 'true-false', question: 'Der Arztbrief ist nur fuer den Patienten wichtig.', answer: 'false' },
      { id: 'b2r29c', type: 'mcq', question: 'Was sollten Patienten nach Erhalt des Arztbriefes tun?', options: ['Ihn sofort wegwerfen', 'Ihn sorgfaeltig lesen und bei Unklarheiten nachfragen', 'Ihn unterschreiben', 'Ihn dem Arbeitgeber zeigen'], answer: 'Ihn sorgfaeltig lesen und bei Unklarheiten nachfragen' }
    ]
  },
  {
    id: 'B2_read_30',
    lessonId: 'B2_lesson_12',
    level: 'B2',
    title: 'Die Einwilligungserklaerung verstehen',
    text: 'Vor medizinischen Eingriffen muessen Patienten eine Einwilligungserklaerung unterschreiben. Sie bestaetigt, dass der Patient ueber die Massnahme, ihre Risiken und moegliche Alternativen aufgeklaert wurde. Das Aufklaerungsgespraech fuehrt der behandelnde Arzt. Der Patient sollte alle Fragen stellen, die ihm wichtig sind. Die Einwilligung kann jederzeit widerrufen werden. Ohne gueltige Einwilligung darf kein medizinischer Eingriff durchgefuehrt werden, ausser in Notfaellen. Dieses Recht schuetzt die Selbstbestimmung des Patienten.',
    questions: [
      { id: 'b2r30a', type: 'mcq', question: 'Was bestaetigt die Einwilligungserklaerung?', options: ['Dass der Patient bezahlt hat', 'Dass der Patient ueber die Massnahme aufgeklaert wurde', 'Dass der Patient entlassen wird', 'Dass der Patient krank ist'], answer: 'Dass der Patient ueber die Massnahme aufgeklaert wurde' },
      { id: 'b2r30b', type: 'true-false', question: 'Die Einwilligung kann jederzeit widerrufen werden.', answer: 'true' },
      { id: 'b2r30c', type: 'mcq', question: 'Wer fuehrt das Aufklaerungsgespraech?', options: ['Die Krankenschwester', 'Der behandelnde Arzt', 'Der Apotheker', 'Der Patient selbst'], answer: 'Der behandelnde Arzt' }
    ]
  },
  {
    id: 'B2_read_31',
    lessonId: 'B2_lesson_14',
    level: 'B2',
    title: 'Konflikte im Krankenhausteam',
    text: 'Konflikte im Krankenhausteam sind keine Seltenheit. Unterschiedliche Meinungen ueber Behandlungsmethoden, Stress und Zeitdruck fuehren oft zu Spannungen zwischen Aerzten und Pflegekraeften. Ungeklaerte Konflikte koennen die Patientensicherheit gefaehrden. Viele Kliniken setzen deshalb auf Konfliktmanagement und Mediation. Teambesprechungen und regelmassiges Feedback helfen, Probleme fruehzeitig anzusprechen. Eine offene Fehlerkultur traegt ebenfalls zur Konfliktvermeidung bei.',
    questions: [
      { id: 'b2r31a', type: 'mcq', question: 'Was kann zu Konflikten zwischen Aerzten und Pflegekraeften fuehren?', options: ['Zu viel Urlaub', 'Unterschiedliche Meinungen, Stress und Zeitdruck', 'Zu viele Fortbildungen', 'Zu wenig Patienten'], answer: 'Unterschiedliche Meinungen, Stress und Zeitdruck' },
      { id: 'b2r31b', type: 'true-false', question: 'Ungeklaerte Konflikte koennen die Patientensicherheit gefaehrden.', answer: 'true' },
      { id: 'b2r31c', type: 'mcq', question: 'Was hilft, Konflikte im Team zu vermeiden?', options: ['Weniger Kommunikation', 'Eine offene Fehlerkultur und regelmassiges Feedback', 'Mehr Hierarchie', 'Weniger Besprechungen'], answer: 'Eine offene Fehlerkultur und regelmassiges Feedback' }
    ]
  },
  {
    id: 'B2_read_32',
    lessonId: 'B2_lesson_2',
    level: 'B2',
    title: 'Eine medizinische Studie verstehen',
    text: 'Medizinische Studien sind die Grundlage fuer neue Behandlungen. In wissenschaftlichen Artikeln werden die Methoden, Ergebnisse und Schlussfolgerungen einer Studie beschrieben. Wichtige Bestandteile sind die Einleitung, die Methodik, die Ergebnisse und die Diskussion. Leser sollten auf die Anzahl der Teilnehmer achten und ob die Studie randomisiert und kontrolliert war. Nicht alle Studien sind von gleicher Qualitaet. Eine kritische Bewertung der Studie ist daher wichtig, bevor man die Ergebnisse in der Praxis anwendet.',
    questions: [
      { id: 'b2r32a', type: 'mcq', question: 'Welche Bestandteile hat ein wissenschaftlicher Artikel?', options: ['Nur Ergebnisse', 'Einleitung, Methodik, Ergebnisse und Diskussion', 'Nur Diskussion', 'Titel, Autor, Datum'], answer: 'Einleitung, Methodik, Ergebnisse und Diskussion' },
      { id: 'b2r32b', type: 'true-false', question: 'Alle medizinischen Studien sind von gleicher Qualitaet.', answer: 'false' },
      { id: 'b2r32c', type: 'mcq', question: 'Worauf sollten Leser einer Studie achten?', options: ['Auf das Datum', 'Auf die Anzahl der Teilnehmer und ob die Studie randomisiert war', 'Auf den Namen des Autors', 'Auf die Laenge des Artikels'], answer: 'Auf die Anzahl der Teilnehmer und ob die Studie randomisiert war' }
    ]
  },
  {
    id: 'B2_read_33',
    lessonId: 'B2_lesson_16',
    level: 'B2',
    title: 'Gesundheits-Apps im Test',
    text: 'Gesundheits-Apps erfreuen sich wachsender Beliebtheit. Sie helfen bei der Dokumentation von Blutdruckwerten, erinnern an die Medikamenteneinnahme oder unterstuetzen bei der Ernaehrungsumstellung. Die Auswahl ist gross. Doch nicht alle Apps sind empfehlenswert. Das Bundesinstitut fuer Arzneimittel und Medizinprodukte (BfArM) prueft einige Gesundheits-Apps und kann sie als Digitale Gesundheitsanwendungen (DiGA) zulassen. Diese koennen Aerzte ihren Patienten auf Rezept verschreiben. Vor der Nutzung sollte man die Datenschutzbedingungen der App pruefen.',
    questions: [
      { id: 'b2r33a', type: 'mcq', question: 'Was koennen Gesundheits-Apps leisten?', options: ['Sie ersetzen den Arzt', 'Sie helfen bei der Dokumentation und erinnern an Medikamente', 'Sie stellen Diagnosen', 'Sie verkaufen Medikamente'], answer: 'Sie helfen bei der Dokumentation und erinnern an Medikamente' },
      { id: 'b2r33b', type: 'true-false', question: 'Das BfArM kann Gesundheits-Apps als DiGA zulassen.', answer: 'true' },
      { id: 'b2r33c', type: 'mcq', question: 'Was sollte man vor der Nutzung einer Gesundheits-App pruefen?', options: ['Die Farbe des Logos', 'Die Datenschutzbedingungen', 'Die Anzahl der Downloads', 'Den Preis im Vergleich'], answer: 'Die Datenschutzbedingungen' }
    ]
  }
];

b2.push(...batch3);
console.log(`B2 count after batch 3: ${b2.length}`);

function validate() {
  const errors = [];

  if (b2.length !== 33) errors.push(`Expected 33 B2 passages, got ${b2.length}`);

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
  const buildOutput = execSync('npm run build 2>&1', { timeout: 120000 });
  const out = buildOutput.toString();
  const lines = out.split('\n').filter(l => l.includes('built') || l.includes('✓') || l.includes('✗') || l.includes('error'));
  console.log(lines.join('\n'));
  console.log('\nBATCH 3 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
