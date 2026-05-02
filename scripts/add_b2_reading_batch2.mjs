import fs from 'fs';
import { execSync } from 'child_process';

const readingPath = 'src/data/reading.json';
const reading = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

const b2 = reading.B2;
const prevCount = b2.length;
console.log(`Previous B2 reading count: ${prevCount}`);
console.log(`Adding batch 2 (B2_read_14 through B2_read_23)...`);

const batch2 = [
  {
    id: 'B2_read_14',
    lessonId: 'B2_lesson_10',
    title: 'Wohnungssuche in deutschen Grossstaedten',
    text: 'Die Wohnungssuche in deutschen Grossstaedten ist fuer viele Menschen eine Herausforderung. Die Mietpreise sind in den letzten Jahren stark gestiegen. Besonders in Muenchen, Frankfurt und Berlin ist bezahlbarer Wohnraum knapp. Bei der Wohnungsbesichtigung muessen Interessenten oft Unterlagen wie Gehaltsnachweise und Schufa-Auskunft vorlegen. Vermieter achten auf ein geregeltes Einkommen und eine positive Bonitaet. Viele Staedte foerdern den Bau von Sozialwohnungen, um dem Wohnungsmangel entgegenzuwirken.',
    questions: [
      { id: 'b2r14a', type: 'mcq', question: 'In welchen Staedten ist bezahlbarer Wohnraum besonders knapp?', options: ['Hamburg, Bremen und Hannover', 'Muenchen, Frankfurt und Berlin', 'Koeln, Stuttgart und Leipzig', 'Dresden, Duesseldorf und Dortmund'], answer: 'Muenchen, Frankfurt und Berlin' },
      { id: 'b2r14b', type: 'true-false', question: 'Vermieter verlangen oft Gehaltsnachweise und eine Schufa-Auskunft.', answer: 'true' },
      { id: 'b2r14c', type: 'mcq', question: 'Was tun Staedte gegen den Wohnungsmangel?', options: ['Sie bauen Einkaufszentren', 'Sie foerdern den Bau von Sozialwohnungen', 'Sie erhoehen die Steuern', 'Sie begrenzen die Einwohnerzahl'], answer: 'Sie foerdern den Bau von Sozialwohnungen' }
    ]
  },
  {
    id: 'B2_read_15',
    lessonId: 'B2_lesson_18',
    title: 'Oeffentlicher Nahverkehr in der Stadt',
    text: 'Der oeffentliche Nahverkehr (OePNV) ist das Rueckgrat der Mobilitaet in deutschen Staedten. Busse und Bahnen verbinden die Stadtteile miteinander und ermoeglichen ein Leben ohne Auto. Viele Staedte investieren in den Ausbau des OePNV und senken die Ticketpreise, um mehr Menschen zum Umstieg zu bewegen. Das 49-Euro-Ticket des Bundes macht den Nahverkehr noch attraktiver. Kritiker bemängeln jedoch, dass die Zuverlaessigkeit besonders in laendlichen Gebieten nicht ausreicht.',
    questions: [
      { id: 'b2r15a', type: 'mcq', question: 'Was ist das 49-Euro-Ticket?', options: ['Ein Ticket fuer Fernreisen', 'Ein bundesweites Nahverkehrsticket', 'Ein Ticket nur fuer Berlin', 'Ein Studententicket'], answer: 'Ein bundesweites Nahverkehrsticket' },
      { id: 'b2r15b', type: 'true-false', question: 'Der oeffentliche Nahverkehr ermoeglicht ein Leben ohne Auto.', answer: 'true' },
      { id: 'b2r15c', type: 'mcq', question: 'Was kritisieren Gegner des OePNV?', options: ['Die hohen Geschwindigkeiten', 'Die mangelnde Zuverlaessigkeit in laendlichen Gebieten', 'Die vielen Haltestellen', 'Die Sauberkeit'], answer: 'Die mangelnde Zuverlaessigkeit in laendlichen Gebieten' }
    ]
  },
  {
    id: 'B2_read_16',
    lessonId: 'B2_lesson_8',
    title: 'Ausbildung zum Medizinischen Fachangestellten',
    text: 'Die Ausbildung zum Medizinischen Fachangestellten (MFA) dauert in der Regel drei Jahre. Sie findet im dualen System statt: Die Auszubildenden arbeiten in einer Arztpraxis und gehen an bestimmten Tagen in die Berufsschule. Zu den Aufgaben gehoeren die Terminvergabe, die Patientenbetreuung, das Assistieren bei Untersuchungen und die Abrechnung mit Krankenkassen. Nach der Ausbildung gibt es vielfaeltige Weiterbildungsmoeglichkeiten, zum Beispiel zur Fachwirtin im Gesundheitswesen oder zum Studium der Medizin.',
    questions: [
      { id: 'b2r16a', type: 'mcq', question: 'Wie lange dauert die Ausbildung zum MFA?', options: ['Zwei Jahre', 'Drei Jahre', 'Vier Jahre', 'Fuenf Jahre'], answer: 'Drei Jahre' },
      { id: 'b2r16b', type: 'true-false', question: 'Die Ausbildung findet im dualen System statt.', answer: 'true' },
      { id: 'b2r16c', type: 'mcq', question: 'Welche Aufgabe gehoert NICHT zu den Aufgaben eines MFA?', options: ['Terminvergabe', 'Patientenbetreuung', 'Durchfuehrung von Operationen', 'Abrechnung mit Krankenkassen'], answer: 'Durchfuehrung von Operationen' }
    ]
  },
  {
    id: 'B2_read_17',
    lessonId: 'B2_lesson_14',
    title: 'Work-Life-Balance im Gesundheitswesen',
    text: 'Die Work-Life-Balance ist im Gesundheitswesen oft schwierig. Schichtdienst, Wochenendarbeit und Bereitschaftsdienste belasten die Beschaeftigten. Viele Kliniken haben deshalb flexible Arbeitszeitmodelle eingefuehrt. Teilzeit, Jobsharing und Homeoffice fuer Verwaltungstaetigkeiten werden angeboten. Auch betriebliche Gesundheitsfoerderung wie Yoga-Kurse und Ruheräume fuer Mitarbeiter gewinnen an Bedeutung. Eine gute Work-Life-Balance reduziert nicht nur den Stress, sondern verbessert auch die Patientenversorgung.',
    questions: [
      { id: 'b2r17a', type: 'mcq', question: 'Was belastet Beschaeftigte im Gesundheitswesen besonders?', options: ['Die Bezahlung', 'Schichtdienst, Wochenendarbeit und Bereitschaftsdienste', 'Die langen Urlaubszeiten', 'Die vielen Fortbildungen'], answer: 'Schichtdienst, Wochenendarbeit und Bereitschaftsdienste' },
      { id: 'b2r17b', type: 'true-false', question: 'Teilzeit und Jobsharing werden in Kliniken angeboten.', answer: 'true' },
      { id: 'b2r17c', type: 'mcq', question: 'Welchen Vorteil hat eine gute Work-Life-Balance fuer Kliniken?', options: ['Weniger Urlaubstage', 'Geringere Kosten', 'Bessere Patientenversorgung', 'Mehr Betten'], answer: 'Bessere Patientenversorgung' }
    ]
  },
  {
    id: 'B2_read_18',
    lessonId: 'B2_lesson_11',
    title: 'Integration von Migranten in den Arbeitsmarkt',
    text: 'Die Integration von Migranten in den deutschen Arbeitsmarkt ist ein wichtiges gesellschaftliches Ziel. Viele zugewanderte Menschen haben qualifizierte Abschluesse, die in Deutschland nicht automatisch anerkannt werden. Das Verfahren der Anerkennung ist oft langwierig und kompliziert. Fuer aerztliche Berufe ist die Approbation erforderlich. Sprachkurse und berufliche Weiterbildungsprogramme helfen Migranten, sich auf dem deutschen Arbeitsmarkt zu etablieren. Unternehmen profitieren von der kulturellen Vielfalt ihrer Mitarbeiter.',
    questions: [
      { id: 'b2r18a', type: 'mcq', question: 'Was ist ein Hindernis fuer Migranten auf dem deutschen Arbeitsmarkt?', options: ['Zu viele Arbeitsangebote', 'Die langwierige Anerkennung von Abschluessen', 'Die geringen Gehaelter', 'Der Mangel an Sprachkursen'], answer: 'Die langwierige Anerkennung von Abschluessen' },
      { id: 'b2r18b', type: 'true-false', question: 'Fuer aerztliche Berufe ist die Approbation erforderlich.', answer: 'true' },
      { id: 'b2r18c', type: 'mcq', question: 'Wie profitieren Unternehmen von der Integration?', options: ['Durch niedrigere Loehne', 'Durch kulturelle Vielfalt der Mitarbeiter', 'Durch weniger Steuern', 'Durch laengere Arbeitszeiten'], answer: 'Durch kulturelle Vielfalt der Mitarbeiter' }
    ]
  },
  {
    id: 'B2_read_19',
    lessonId: 'B2_lesson_16',
    title: 'Patientendaten und Datenschutz',
    text: 'Der Schutz von Patientendaten ist ein zentrales Thema im Gesundheitswesen. Mit der Einfuehrung der elektronischen Patientenakte werden sensible Daten digital gespeichert. Die Datenschutz-Grundverordnung (DSGVO) der Europaeischen Union regelt den Umgang mit personenbezogenen Daten. Patienten haben das Recht zu erfahren, welche Daten gespeichert sind und wer darauf zugreifen darf. Krankenhaeuser muessen hohe Sicherheitsstandards einhalten, um Datenlecks zu vermeiden. Cyberangriffe auf Krankenhaeuser sind in den letzten Jahren haeufiger geworden.',
    questions: [
      { id: 'b2r19a', type: 'mcq', question: 'Welche EU-Verordnung regelt den Umgang mit Patientendaten?', options: ['Das Grundgesetz', 'Die Datenschutz-Grundverordnung (DSGVO)', 'Die Patientenakte-Verordnung', 'Die Sozialgesetzgebung'], answer: 'Die Datenschutz-Grundverordnung (DSGVO)' },
      { id: 'b2r19b', type: 'true-false', question: 'Cyberangriffe auf Krankenhaeuser sind seltener geworden.', answer: 'false' },
      { id: 'b2r19c', type: 'mcq', question: 'Welches Recht haben Patienten bezueglich ihrer Daten?', options: ['Das Recht, Daten zu loeschen', 'Das Recht zu erfahren, welche Daten gespeichert sind', 'Das Recht auf Bezahlung', 'Das Recht auf Weitergabe aller Daten'], answer: 'Das Recht zu erfahren, welche Daten gespeichert sind' }
    ]
  },
  {
    id: 'B2_read_20',
    lessonId: 'B2_lesson_13',
    title: 'Soziale Medien in der Medizin',
    text: 'Soziale Medien spielen eine wachsende Rolle in der Medizin. Viele Aerzte und Kliniken nutzen Plattformen wie Instagram oder LinkedIn, um ueber Gesundheitsthemen zu informieren. Patientenforen bieten Austausch zu Erkrankungen und Behandlungen. Allerdings gibt es Risiken: Falschinformationen verbreiten sich schnell. Medizinisches Personal sollte bei der Nutzung sozialer Medien die Berufsordnung und die Schweigepflicht beachten. Einige Kliniken haben daher Richtlinien zur Social-Media-Nutzung fuer ihre Mitarbeiter erstellt.',
    questions: [
      { id: 'b2r20a', type: 'mcq', question: 'Wie nutzen Kliniken soziale Medien?', options: ['Nur fuer Werbung', 'Zur Aufklaerung ueber Gesundheitsthemen', 'Zum Verkauf von Medikamenten', 'Nicht erlaubt'], answer: 'Zur Aufklaerung ueber Gesundheitsthemen' },
      { id: 'b2r20b', type: 'true-false', question: 'In Patientenforen koennen sich Betroffene zu Erkrankungen austauschen.', answer: 'true' },
      { id: 'b2r20c', type: 'mcq', question: 'Worauf muessen Aerzte in sozialen Medien achten?', options: ['Auf viele Follower', 'Auf die Berufsordnung und Schweigepflicht', 'Auf taegliche Beitraege', 'Auf Werbepartnerschaften'], answer: 'Auf die Berufsordnung und Schweigepflicht' }
    ]
  },
  {
    id: 'B2_read_21',
    lessonId: 'B2_lesson_9',
    title: 'Ehrenamt im Rettungsdienst',
    text: 'Der Rettungsdienst in Deutschland ist ohne ehrenamtliche Helfer nicht denkbar. Organisationen wie das Deutsche Rote Kreuz, die Johanniter und die Malteser sind auf freiwillige Mitarbeiter angewiesen. Ehrenamtliche absolvieren eine Grundausbildung in Erster Hilfe und werden fuer den Sanitaetsdienst geschult. Sie sind bei Grossveranstaltungen, Unfaellen und Naturkatastrophen im Einsatz. Viele junge Menschen sammeln auf diese Weise erste Erfahrungen im Gesundheitswesen. Die Arbeit ist anspruchsvoll, aber auch sehr erfuellend.',
    questions: [
      { id: 'b2r21a', type: 'mcq', question: 'Welche Organisationen sind auf ehrenamtliche Helfer im Rettungsdienst angewiesen?', options: ['Die Polizei und die Feuerwehr', 'Das Rote Kreuz, die Johanniter und die Malteser', 'Die Krankenkassen', 'Die Ministerien'], answer: 'Das Rote Kreuz, die Johanniter und die Malteser' },
      { id: 'b2r21b', type: 'true-false', question: 'Ehrenamtliche Helfer muessen eine Grundausbildung in Erster Hilfe absolvieren.', answer: 'true' },
      { id: 'b2r21c', type: 'opinion-match', question: 'Wie wird die ehrenamtliche Arbeit im Rettungsdienst beschrieben?', options: ['Langweilig und einfach', 'Anspruchsvoll, aber erfuellend', 'Gefaehrlich und schlecht bezahlt', 'Nichts fuer junge Leute'], answer: 'Anspruchsvoll, aber erfuellend' }
    ]
  },
  {
    id: 'B2_read_22',
    lessonId: 'B2_lesson_7',
    title: 'Ethische Fragen der Organspende',
    text: 'Die Organspende wirft viele ethische Fragen auf. In Deutschland gilt die Entscheidungsloesung: Nur wer ausdruecklich zustimmt, wird zum Spender. Anders als in oesterreichischen Nachbarland, wo die Widerspruchsloesung gilt. Befuerworter der Widerspruchsloesung argumentieren, dass mehr Organe verfuegbar waeren. Kritiker sehen die Entscheidungsfreiheit jedes Einzelnen gefaehrdet. Medizinethiker betonen, dass die Entscheidung zur Organspende gut informiert und freiwillig sein muss.',
    questions: [
      { id: 'b2r22a', type: 'mcq', question: 'Welches System gilt fuer die Organspende in Deutschland?', options: ['Die Widerspruchsloesung', 'Die Entscheidungsloesung', 'Die Pflichtspende', 'Die Freiwilligkeit ohne Regelung'], answer: 'Die Entscheidungsloesung' },
      { id: 'b2r22b', type: 'true-false', question: 'In Oesterreich gilt die Widerspruchsloesung.', answer: 'true' },
      { id: 'b2r22c', type: 'mcq', question: 'Was argumentieren Befuerworter der Widerspruchsloesung?', options: ['Weniger Buerokratie', 'Mehr Organe waeren verfuegbar', 'Niedrigere Kosten', 'Mehr Transparenz'], answer: 'Mehr Organe waeren verfuegbar' }
    ]
  },
  {
    id: 'B2_read_23',
    lessonId: 'B2_lesson_21',
    title: 'Rehabilitation nach einer Operation',
    text: 'Nach einer schweren Operation ist die Rehabilitation ein wichtiger Schritt zur vollstaendigen Genesung. Die Reha-Massnahmen beginnen oft schon im Krankenhaus, bevor der Patient in eine Reha-Klinik verlegt wird. Dort arbeiten Aerzte, Physiotherapeuten und Ergotherapeuten zusammen. Die Dauer haengt von der Art der Operation ab. Die Krankenkasse uebernimmt die Kosten, wenn die Reha medizinisch notwendig ist. Ziel ist es, die Selbststaendigkeit des Patienten wiederherzustellen und die Rueckkehr in den Alltag zu ermoeglichen.',
    questions: [
      { id: 'b2r23a', type: 'mcq', question: 'Wo beginnt die Rehabilitation oft?', options: ['Zu Hause', 'Im Fitnessstudio', 'Schon im Krankenhaus', 'In einer Selbsthilfegruppe'], answer: 'Schon im Krankenhaus' },
      { id: 'b2r23b', type: 'true-false', question: 'Die Krankenkasse uebernimmt die Reha-Kosten, wenn sie medizinisch notwendig ist.', answer: 'true' },
      { id: 'b2r23c', type: 'mcq', question: 'Was ist das Ziel der Rehabilitation?', options: ['Den Patienten entlassen', 'Die Selbststaendigkeit wiederherstellen', 'Die OP zu wiederholen', 'Medikamente zu reduzieren'], answer: 'Die Selbststaendigkeit wiederherstellen' }
    ]
  }
];

// Add level to new passages
batch2.forEach(p => p.level = 'B2');

b2.push(...batch2);
console.log(`B2 count after batch 2: ${b2.length}`);

// Validate
function validate() {
  const errors = [];

  if (b2.length !== 23) errors.push(`Expected 23 B2 passages, got ${b2.length}`);

  // Duplicate IDs
  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => {
    if (seen.has(id)) errors.push(`Duplicate ID: ${id}`);
    seen.add(id);
  });

  // Duplicate titles
  const titles = b2.map(p => p.title.toLowerCase());
  const seenTitles = new Set();
  titles.forEach((t, i) => {
    if (seenTitles.has(t)) errors.push(`Duplicate title at index ${i}: "${b2[i].title}"`);
    seenTitles.add(t);
  });

  // Per-passage checks
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
  const lines = out.split('\n').filter(l => l.includes('built') || l.includes('✓') || l.includes('✗') || l.includes('error') || l.includes('Error'));
  console.log(lines.join('\n'));
  console.log('\nBATCH 2 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
