import fs from 'fs';
import { execSync } from 'child_process';

const readingPath = 'src/data/reading.json';
const reading = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

const b2 = reading.B2;
const prevCount = b2.length;
console.log(`Previous B2 reading count: ${prevCount}`);

const batch5 = [
  {
    id: 'B2_read_44',
    lessonId: 'B2_lesson_7',
    level: 'B2',
    title: 'Die Ethikkommission der Universitaetsklinik',
    text: 'Jede medizinische Studie an Menschen muss von einer Ethikkommission genehmigt werden. Die Kommission prueft, ob die Studie ethischen Standards entspricht und die Rechte der Teilnehmer geschuetzt sind. Wichtige Kriterien sind die informierte Einwilligung, der Datenschutz und das Verhaeltnis von Nutzen und Risiko. Die Kommission besteht aus Medizinern, Juristen, Theologen und Laienmitgliedern. Ohne die Zulassung der Ethikkommission darf die Studie nicht beginnen. Die Arbeit der Kommission ist freiwillig und ehrenamtlich.',
    questions: [
      { id: 'b2r44a', type: 'mcq', question: 'Was prueft die Ethikkommission?', options: ['Die Kosten der Studie', 'Die ethischen Standards und den Schutz der Teilnehmer', 'Die Bekanntheit der Forscher', 'Die Dauer der Studie'], answer: 'Die ethischen Standards und den Schutz der Teilnehmer' },
      { id: 'b2r44b', type: 'true-false', question: 'Die Ethikkommission besteht nur aus Medizinern.', answer: 'false' },
      { id: 'b2r44c', type: 'mcq', question: 'Wann darf eine medizinische Studie beginnen?', options: ['Sofort nach der Planung', 'Nach der Zulassung durch die Ethikkommission', 'Nach der Finanzierung', 'Nach der Veroeffentlichung'], answer: 'Nach der Zulassung durch die Ethikkommission' }
    ]
  },
  {
    id: 'B2_read_45',
    lessonId: 'B2_lesson_21',
    level: 'B2',
    title: 'Der Entlassungsprozess aus dem Krankenhaus',
    text: 'Die Entlassung aus dem Krankenhaus erfordert eine gute Planung. Bereits bei der Aufnahme wird der voraussichtliche Entlassungstag besprochen. Der Arzt erstellt einen Entlassungsbericht und verordnet notwendige Medikamente. Die Pflegekraefte geben Anleitungen zur weiteren Versorgung zu Hause. Bei Bedarf wird ein Pflegedienst oder eine Rehabilitation organisiert. Der Patient sollte vor der Entlassung alle Fragen klären, besonders zu Medikamenten und Folgeterminen. Eine gute Vorbereitung verhindert Wiederaufnahmen.',
    questions: [
      { id: 'b2r45a', type: 'mcq', question: 'Wann wird der voraussichtliche Entlassungstag besprochen?', options: ['Am Tag der Entlassung', 'Bereits bei der Aufnahme', 'Eine Woche vorher', 'Gar nicht'], answer: 'Bereits bei der Aufnahme' },
      { id: 'b2r45b', type: 'true-false', question: 'Bei Bedarf wird ein Pflegedienst oder eine Rehabilitation organisiert.', answer: 'true' },
      { id: 'b2r45c', type: 'mcq', question: 'Was verhindert eine gute Entlassungsvorbereitung?', options: ['Kosten', 'Wiederaufnahmen', 'Arztbesuche', 'Medikamente'], answer: 'Wiederaufnahmen' }
    ]
  },
  {
    id: 'B2_read_46',
    lessonId: 'B2_lesson_2',
    level: 'B2',
    title: 'Der Deutsche Aerztekongress',
    text: 'Jedes Jahr findet der Deutsche Aerztekongress in Berlin statt. Tausende Mediziner aus dem In- und Ausland nehmen teil. Das Programm umfasst Vortraege, Workshops und Diskussionsrunden zu aktuellen medizinischen Themen. Schwerpunkte sind neue Behandlungsmethoden, Digitalisierung und Praevention. Neben den Fachvortraegen gibt es Ausstellungen von Medizintechnikunternehmen. Der Kongress bietet auch Moeglichkeiten zur Vernetzung mit Kollegen. Die Teilnahme wird von den Aerztekammern als Fortbildung anerkannt.',
    questions: [
      { id: 'b2r46a', type: 'mcq', question: 'Wo findet der Deutsche Aerztekongress statt?', options: ['In Muenchen', 'In Berlin', 'In Hamburg', 'In Koeln'], answer: 'In Berlin' },
      { id: 'b2r46b', type: 'true-false', question: 'Der Kongress bietet nur Vortraege und keine Workshops an.', answer: 'false' },
      { id: 'b2r46c', type: 'mcq', question: 'Welche Funktion hat der Kongress neben den Fachvortraegen?', options: ['Urlaubsreise', 'Vernetzung mit Kollegen', 'Sportveranstaltung', 'Kulturelles Programm'], answer: 'Vernetzung mit Kollegen' }
    ]
  },
  {
    id: 'B2_read_47',
    lessonId: 'B2_lesson_12',
    level: 'B2',
    title: 'Besucherregeln im Krankenhaus',
    text: 'Krankenhaeuser haben klare Regeln fuer Besucher. Die Besuchszeiten sind meist begrenzt, um den Heilungsprozess der Patienten nicht zu stoeren. In der Regel duerfen zwei Besucher pro Patient gleichzeitig kommen. Kinder unter sechs Jahren duerfen oft nur in Ausnahmefaellen auf die Station. Besucher mit Infektionskrankheiten sollten nicht kommen. Auf Intensivstationen gelten strenge Regelungen. Die Einhaltung der Regeln dient der Sicherheit aller Patienten und der Behandlungsqualitaet.',
    questions: [
      { id: 'b2r47a', type: 'mcq', question: 'Warum sind Besuchszeiten begrenzt?', options: ['Weil das Personal weniger Arbeit hat', 'Um den Heilungsprozess nicht zu stoeren', 'Weil die Raeume klein sind', 'Weil es gesetzlich vorgeschrieben ist'], answer: 'Um den Heilungsprozess nicht zu stoeren' },
      { id: 'b2r47b', type: 'true-false', question: 'Kinder unter sechs Jahren duerfen immer auf die Station.', answer: 'false' },
      { id: 'b2r47c', type: 'mcq', question: 'Was gilt fuer Besucher mit Infektionskrankheiten?', options: ['Sie duerfen kommen, aber mit Maske', 'Sie sollten nicht kommen', 'Sie muessen vorher anrufen', 'Sie duerfen nur kurz bleiben'], answer: 'Sie sollten nicht kommen' }
    ]
  },
  {
    id: 'B2_read_48',
    lessonId: 'B2_lesson_3',
    level: 'B2',
    title: 'Kampagne zur Organspendebereitschaft',
    text: 'Die Bundesregierung startet eine neue Kampagne zur Erhoehung der Organspendebereitschaft. Trotz vieler Aufklaerungsaktionen ist die Zahl der Organspender in Deutschland niedrig. Viele Menschen haben keinen Spenderausweis. Die Kampagne setzt auf persoenliche Geschichten von Betroffenen und informiert ueber den Ablauf einer Organspende. Auch Aufklaerung ueber die Entscheidungsmoeglichkeiten ist ein Schwerpunkt. Die Aktion wird von Krankenkassen, Kliniken und Selbsthilfegruppen unterstuetzt.',
    questions: [
      { id: 'b2r48a', type: 'mcq', question: 'Was ist das Ziel der Kampagne?', options: ['Mehr Geld fuer Krankenhaeuser', 'Die Erhoehung der Organspendebereitschaft', 'Neue Medikamente entwickeln', 'Mehr Kliniken bauen'], answer: 'Die Erhoehung der Organspendebereitschaft' },
      { id: 'b2r48b', type: 'true-false', question: 'Die Kampagne informiert ueber persoenliche Geschichten von Betroffenen.', answer: 'true' },
      { id: 'b2r48c', type: 'mcq', question: 'Wer unterstuetzt die Aktion?', options: ['Nur die Regierung', 'Krankenkassen, Kliniken und Selbsthilfegruppen', 'Nur Krankenkassen', 'Nur Kliniken'], answer: 'Krankenkassen, Kliniken und Selbsthilfegruppen' }
    ]
  },
  {
    id: 'B2_read_49',
    lessonId: 'B2_lesson_8',
    level: 'B2',
    title: 'Stellenanzeige: Assistenzarzt gesucht',
    text: 'Ein mittelgrosses Krankenhaus in Bayern sucht einen Assistenzarzt fuer die Innere Medizin. Voraussetzungen sind ein abgeschlossenes Medizinstudium, die Approbation und erste klinische Erfahrungen. Gewuenscht werden Teamfaehigkeit, Belastbarkeit und Interesse an wissenschaftlicher Arbeit. Die Stelle ist ab sofort zu besetzen und zunaechst auf zwei Jahre befristet. Die Klinik bietet strukturierte Weiterbildung, flexible Arbeitszeiten und ein motiviertes Team. Bewerbungen mit Lebenslauf und Zeugnissen werden per E-Mail erbeten.',
    questions: [
      { id: 'b2r49a', type: 'mcq', question: 'Welche Voraussetzungen werden in der Anzeige genannt?', options: ['Nur das Medizinstudium', 'Medizinstudium, Approbation und erste klinische Erfahrungen', 'Eine Promotion', 'Nur die Approbation'], answer: 'Medizinstudium, Approbation und erste klinische Erfahrungen' },
      { id: 'b2r49b', type: 'true-false', question: 'Die Stelle ist unbefristet.', answer: 'false' },
      { id: 'b2r49c', type: 'mcq', question: 'Was bietet die Klinik?', options: ['Ein hohes Gehalt', 'Strukturierte Weiterbildung, flexible Arbeitszeiten und ein motiviertes Team', 'Einen Dienstwagen', 'Eine Wohnung'], answer: 'Strukturierte Weiterbildung, flexible Arbeitszeiten und ein motiviertes Team' }
    ]
  },
  {
    id: 'B2_read_50',
    lessonId: 'B2_lesson_25',
    level: 'B2',
    title: 'Interkulturelle Kompetenz im Gesundheitswesen',
    text: 'Interkulturelle Kompetenz wird im Gesundheitswesen immer wichtiger. Patienten aus verschiedenen Kulturen haben unterschiedliche Vorstellungen von Krankheit und Behandlung. Manche vermeiden bestimmte Medikamente aus religioesen Gruenden, andere bevorzugen traditionelle Heilmethoden. Fachkraefte sollten diese Unterschiede kennen und respektieren. Interkulturelle Schulungen fuer Klinikpersonal helfen, Missverstaendnisse zu vermeiden. Auch Dolmetscherdienste tragen zur besseren Versorgung bei. Eine kultursensible Pflege verbessert das Vertrauen der Patienten.',
    questions: [
      { id: 'b2r50a', type: 'mcq', question: 'Was haben Patienten aus verschiedenen Kulturen?', options: ['Die gleichen Vorstellungen von Gesundheit', 'Unterschiedliche Vorstellungen von Krankheit und Behandlung', 'Keine besonderen Wuensche', 'Immer die gleichen Medikamente'], answer: 'Unterschiedliche Vorstellungen von Krankheit und Behandlung' },
      { id: 'b2r50b', type: 'true-false', question: 'Interkulturelle Schulungen helfen, Missverstaendnisse zu vermeiden.', answer: 'true' },
      { id: 'b2r50c', type: 'mcq', question: 'Was verbessert interkulturelle Kompetenz im Krankenhaus?', options: ['Die Kosten', 'Das Vertrauen der Patienten', 'Die Geschwindigkeit der Behandlung', 'Die Anzahl der Betten'], answer: 'Das Vertrauen der Patienten' }
    ]
  }
];

b2.push(...batch5);
console.log(`B2 count after batch 5: ${b2.length}`);

function validate() {
  const errors = [];

  if (b2.length !== 50) errors.push(`Expected 50 B2 passages, got ${b2.length}`);

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
console.log('\nAll 50 B2 reading passages validated. Ready for build and deploy.');
