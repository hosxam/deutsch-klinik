import fs from 'fs';
import { execSync } from 'child_process';

const listeningPath = 'src/data/listening.json';
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));

const b2 = listening.B2;
const prevCount = b2.length;
console.log(`Previous B2 listening count: ${prevCount}`);

const batch2 = [
  {
    id: 'B2_listen_14', lessonId: 'B2_lesson_10', level: 'B2',
    title: 'Radiobeitrag: Wohnungsmarkt in Muenchen',
    script: 'Der Wohnungsmarkt in Muenchen bleibt angespannt. Die Mietpreise sind in den letzten fuenf Jahren um durchschnittlich 20 Prozent gestiegen. Besonders betroffen sind Familien und Studierende. Die Stadt hat ein neues Foerderprogramm gestartet: Bauwillige, die Sozialwohnungen errichten, erhalten zinsguenstige Darlehen. Auch der Bau von Studierendenwohnheimen wird gefoerdert. Laut einer Studie der Stadtverwaltung fehlen in Muenchen mindestens 10000 bezahlbare Wohnungen. Die Nachfrage wird in den kommenden Jahren weiter steigen.',
    questions: [
      { id: 'b2l14a', type: 'mcq', question: 'Um wie viel Prozent sind die Mietpreise in Muenchen gestiegen?', options: ['10 Prozent', '15 Prozent', '20 Prozent', '25 Prozent'], answer: '20 Prozent' },
      { id: 'b2l14b', type: 'mcq', question: 'Was bekommen Bauwillige fuer den Bau von Sozialwohnungen?', options: ['Steuerfreiheit', 'Zinsguenstige Darlehen', 'Grundstuecke geschenkt', 'Hoehere Mieten'], answer: 'Zinsguenstige Darlehen' },
      { id: 'b2l14c', type: 'true-false', question: 'In Muenchen fehlen mindestens zehntausend bezahlbare Wohnungen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_15', lessonId: 'B2_lesson_18', level: 'B2',
    title: 'Durchsage: Aenderungen im Nahverkehr',
    script: 'Achtung Fahrgaeste, eine Durchsage der Verkehrsbetriebe. Ab dem ersten Juni kommt es zu Aenderungen im Fahrplan. Die Linie 7 wird im 10-Minuten-Takt verkehren. Die Haltestelle Hauptbahnhof Sued wird fuer drei Wochen geschlossen, nutzen Sie bitte die Ersatzhaltestelle am Theaterplatz. Die neuen Fahrplaene liegen an allen Haltestellen aus und sind auch online abrufbar. Wir bitten um Ihr Verstaendnis fuer die Bauarbeiten.',
    questions: [
      { id: 'b2l15a', type: 'mcq', question: 'Im welchen Takt wird die Linie 7 verkehren?', options: ['Im 5-Minuten-Takt', 'Im 10-Minuten-Takt', ['Im 15-Minuten-Takt', 'Im 20-Minuten-Takt']], answer: 'Im 10-Minuten-Takt' },
      { id: 'b2l15b', type: 'true-false', question: 'Die Haltestelle Hauptbahnhof Sued wird fuer drei Wochen geschlossen.', answer: 'true' },
      { id: 'b2l15c', type: 'mcq', question: 'Wo liegen die neuen Fahrplaene aus?', options: ['Nur online', 'An allen Haltestellen und online', 'Nur am Hauptbahnhof', 'Nur in der App'], answer: 'An allen Haltestellen und online' }
    ]
  },
  {
    id: 'B2_listen_16', lessonId: 'B2_lesson_8', level: 'B2',
    title: 'Infoabend: Pflegeausbildung',
    script: 'Herzlich willkommen zum Infoabend ueber die Ausbildung in der Pflege. Ich bin Herr Dr. Schneider, Pflegedirektor des Klinikums. Die Ausbildung zur Pflegefachkraft dauert drei Jahre und erfolgt im dualen System. Sie arbeiten in der Klinik und besuchen die Berufsschule. Die Verguetung betraegt im ersten Jahr rund 1200 Euro brutto. Nach der Ausbildung haben Sie hervorragende Berufsaussichten. Der Pflegeberuf bietet viele Spezialisierungsmoeglichkeiten, zum Beispiel in der Intensivpflege oder in der Palliativversorgung.',
    questions: [
      { id: 'b2l16a', type: 'mcq', question: 'Wie lange dauert die Pflegeausbildung?', options: ['Zwei Jahre', 'Drei Jahre', 'Vier Jahre', 'Fuenf Jahre'], answer: 'Drei Jahre' },
      { id: 'b2l16b', type: 'mcq', question: 'Wie hoch ist die Verguetung im ersten Jahr etwa?', options: ['800 Euro', '1000 Euro', '1200 Euro', '1500 Euro'], answer: '1200 Euro' },
      { id: 'b2l16c', type: 'true-false', question: 'Die Pflegeausbildung bietet nur wenige Spezialisierungsmoeglichkeiten.', answer: 'false' }
    ]
  },
  {
    id: 'B2_listen_17', lessonId: 'B2_lesson_14', level: 'B2',
    title: 'Betriebliches Gesundheitsmanagement',
    script: 'Liebe Mitarbeiterinnen und Mitarbeiter, unser Krankenhaus fuehrt ein neues Programm zur Gesundheitsfoerderung ein. Wir moechten die Work-Life-Balance verbessern und Stress reduzieren. Ab naechstem Monat bieten wir jeden Dienstag und Donnerstag Yoga-Kurse an. Ausserdem koennen Sie kostenlos an einem Rueckentraining teilnehmen. Fuer alle, die lieber allein trainieren, haben wir eine Kooperation mit dem Fitnessstudio CityFit, dort erhalten Sie zehn Prozent Rabatt mit Ihrem Mitarbeiterausweis. Melden Sie sich bis zum Ende der Woche im Personalbuero an.',
    questions: [
      { id: 'b2l17a', type: 'mcq', question: 'Welche Tage bieten die Yoga-Kurse an?', options: ['Montag und Mittwoch', 'Dienstag und Donnerstag', 'Mittwoch und Freitag', 'Samstag und Sonntag'], answer: 'Dienstag und Donnerstag' },
      { id: 'b2l17b', type: 'true-false', question: 'Das Rueckentraining ist kostenlos.', answer: 'true' },
      { id: 'b2l17c', type: 'mcq', question: 'Wie viel Rabatt gibt es im Fitnessstudio CityFit?', options: ['Fuenf Prozent', 'Zehn Prozent', 'Fuenfzehn Prozent', 'Zwanzig Prozent'], answer: 'Zehn Prozent' }
    ]
  },
  {
    id: 'B2_listen_18', lessonId: 'B2_lesson_11', level: 'B2',
    title: 'Interview: Integration von gefluechteten Aerzten',
    script: 'Heute spreche ich mit Dr. Ahmed Al-Khatib, einem Arzt aus Syrien, der seit zwei Jahren in Deutschland arbeitet. Dr. Al-Khatib, wie war Ihr Weg in den deutschen Arbeitsmarkt? "Die groesste Huerde war die Anerkennung meines Studiums. Ich musste mehrere Pruefungen ablegen und einen Sprachkurs auf C1-Niveau absolvieren. Das hat etwa anderthalb Jahre gedauert. Inzwischen arbeite ich in einer Praxis in Berlin-Kreuzberg und fuehle mich sehr wohl. Mein Tipp fuer andere gefluechtete Aerzte: Geben Sie nicht auf, der Aufwand lohnt sich."',
    questions: [
      { id: 'b2l18a', type: 'mcq', question: 'Welches Sprachniveau musste Dr. Al-Khatib erreichen?', options: ['B1', 'B2', 'C1', 'C2'], answer: 'C1' },
      { id: 'b2l18b', type: 'true-false', question: 'Die Anerkennung seines Studiums dauerte etwa anderthalb Jahre.', answer: 'true' },
      { id: 'b2l18c', type: 'mcq', question: 'Was ist Dr. Al-Khatibs Tipp fuer andere gefluechtete Aerzte?', options: ['Zurueck ins Heimatland gehen', 'Nicht aufgeben, der Aufwand lohnt sich', 'Einen anderen Beruf waehlen', 'Nur in der Pflege arbeiten'], answer: 'Nicht aufgeben, der Aufwand lohnt sich' }
    ]
  },
  {
    id: 'B2_listen_19', lessonId: 'B2_lesson_16', level: 'B2',
    title: 'Radiobericht: Datenschutz im Gesundheitswesen',
    script: 'Das Thema Datenschutz gewinnt im Gesundheitswesen weiter an Bedeutung. Ein aktueller Bericht des Bundesdatenschutzbeauftragten zeigt: Im vergangenen Jahr gab es in Deutschland ueber 200 gemeldete Datenpannen in Krankenhaeusern und Arztpraxen. In den meisten Faellen handelte es sich um versehentliche Weitergabe von Patientendaten. Experten empfehlen dringend, alle Mitarbeiter regelmaessig im Datenschutz zu schulen. Ab 2026 soll ein neues IT-Sicherheitsgesetz strengere Auflagen fuer Kliniken vorsehen.',
    questions: [
      { id: 'b2l19a', type: 'mcq', question: 'Wie viele Datenpannen gab es im vergangenen Jahr im Gesundheitswesen?', options: ['Ueber 50', 'Ueber 100', 'Ueber 200', 'Ueber 500'], answer: 'Ueber 200' },
      { id: 'b2l19b', type: 'mcq', question: 'Was war die haeufigste Ursache fuer Datenpannen?', options: ['Hackerangriffe', 'Versehentliche Weitergabe von Patientendaten', ['Gestohlene Geraete', 'Papierakten verloren']], answer: 'Versehentliche Weitergabe von Patientendaten' },
      { id: 'b2l19c', type: 'true-false', question: 'Ab 2026 soll ein neues IT-Sicherheitsgesetz strengere Auflagen vorsehen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_20', lessonId: 'B2_lesson_13', level: 'B2',
    title: 'Podcast: Social Media in der Arztpraxis',
    script: 'Herzlich willkommen zu unserem Praxispodcast. Heute fragen wir: Sollten Aerzte soziale Medien nutzen? Die Meinungen gehen auseinander. Viele Kollegen sind auf LinkedIn und Instagram aktiv, um ueber Gesundheitsthemen aufzuklaeren. Eine Studie zeigt, dass ueber 40 Prozent der Patienten vor dem Praxisbesuch online recherchieren. Allerdings gibt es Risiken: Falschinformationen verbreiten sich schnell, und die Schweigepflicht muss beachtet werden. Die Aerztekammer empfiehlt daher, dienstliche von privaten Inhalten strikt zu trennen.',
    questions: [
      { id: 'b2l20a', type: 'mcq', question: 'Wie viel Prozent der Patienten recherchieren vor dem Praxisbesuch online?', options: ['20 Prozent', '30 Prozent', '40 Prozent', '50 Prozent'], answer: '40 Prozent' },
      { id: 'b2l20b', type: 'true-false', question: 'Die Aerztekammer empfiehlt, dienstliche und private Inhalte zu trennen.', answer: 'true' },
      { id: 'b2l20c', type: 'mcq', question: 'Welches Risiko wird im Podcast genannt?', options: ['Zeitverschwendung', 'Falschinformationen und Verletzung der Schweigepflicht', 'Zu viele Follower', 'Negative Kommentare'], answer: 'Falschinformationen und Verletzung der Schweigepflicht' }
    ]
  },
  {
    id: 'B2_listen_21', lessonId: 'B2_lesson_9', level: 'B2',
    title: 'Interview: Ehrenamt im Hospiz',
    script: 'Ich spreche heute mit Frau Schubert, die seit fuenf Jahren ehrenamtlich in einem Hospiz arbeitet. Frau Schubert, was hat Sie zu diesem Ehrenamt bewogen? "Ich hatte eine persoenliche Erfahrung mit dem Tod meines Vaters und wollte etwas zurueckgeben. Im Hospiz begleite ich schwerkranke Menschen in ihrer letzten Lebensphase. Das ist nicht immer einfach, aber es ist sehr erfuellend." Welche Voraussetzungen braucht man? "Man sollte einfuehlsam sein und gut zuhoeren koennen. Die Ausbildung umfasst einen Vorbereitungskurs von 100 Stunden und regelmaessige Supervision."',
    questions: [
      { id: 'b2l21a', type: 'mcq', question: 'Wie lange arbeitet Frau Schubert schon ehrenamtlich im Hospiz?', options: ['Zwei Jahre', ['Drei Jahre', 'Vier Jahre', 'Fuenf Jahre']], answer: 'Fuenf Jahre' },
      { id: 'b2l21b', type: 'mcq', question: 'Wie viele Stunden umfasst der Vorbereitungskurs?', options: ['50 Stunden', '80 Stunden', '100 Stunden', '120 Stunden'], answer: '100 Stunden' },
      { id: 'b2l21c', type: 'true-false', question: 'Die Arbeit im Hospiz beschreibt Frau Schubert als nicht einfach, aber erfuellend.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_22', lessonId: 'B2_lesson_7', level: 'B2',
    title: 'Debatte: Patientenautonomie am Lebensende',
    script: 'Guten Abend und herzlich willkommen zu unserer Podiumsdiskussion. Das heutige Thema: Patientenautonomie am Lebensende. Sollte jeder Patient das Recht haben, ueber lebensverlaengernde Massnahmen selbst zu entscheiden? Unsere erste Gespraechspartnerin, Professorin Dr. Weiss von der Universitaet Heidelberg, vertritt die Position, dass die Patientenverfuegung ein zentrales Instrument der Selbstbestimmung ist. Sie ermoeglicht dem Patienten, fuer den Fall seiner Entscheidungsunfaehigkeit Vorsorge zu treffen. Kritiker weisen jedoch darauf hin, dass viele Menschen keine Patientenverfuegung haben, obwohl sie wichtig waere.',
    questions: [
      { id: 'b2l22a', type: 'mcq', question: 'Was ist das Thema der Podiumsdiskussion?', options: ['Organspende', 'Patientenautonomie am Lebensende', 'Sterbehilfe', 'Schmerztherapie'], answer: 'Patientenautonomie am Lebensende' },
      { id: 'b2l22b', type: 'true-false', question: 'Professorin Dr. Weiss vertritt die Meinung, dass Patientenverfuegungen wichtig fuer die Selbstbestimmung sind.', answer: 'true' },
      { id: 'b2l22c', type: 'mcq', question: 'Was kritisieren Gegner der aktuellen Regelung?', options: ['Patientenverfuegungen sind zu teuer', 'Viele Menschen haben keine Patientenverfuegung', 'Patientenverfuegungen sind ungueltig', 'Aerzte ignorieren Patientenverfuegungen'], answer: 'Viele Menschen haben keine Patientenverfuegung' }
    ]
  },
  {
    id: 'B2_listen_23', lessonId: 'B2_lesson_21', level: 'B2',
    title: 'Vortrag: Ambulante Rehabilitation nach Hüft-OP',
    script: 'Guten Tag, ich moechte Ihnen heute die Moeglichkeiten der ambulanten Rehabilitation vorstellen. Viele Patienten bevorzugen nach einer Hueftoperation die ambulante Reha, weil sie zu Hause bleiben koennen. Die Behandlung umfasst in der Regel zwei- bis dreimal pro Woche Physiotherapie und Ergotherapie ueber einen Zeitraum von sechs bis acht Wochen. Die Krankenkasse uebernimmt die Kosten. Voraussetzung ist, dass die Wohnung barrierefrei ist und eine Bezugsperson zur Verfuegung steht. Ziel der Reha ist es, die Beweglichkeit wiederherzustellen und den Patienten in den Alltag zurueckzufuehren.',
    questions: [
      { id: 'b2l23a', type: 'mcq', question: 'Wie oft pro Woche findet die ambulante Rehabilitation statt?', options: ['Einmal pro Woche', 'Zwei- bis dreimal pro Woche', 'Vier- bis fuenfmal pro Woche', ['Taeglich']], answer: 'Zwei- bis dreimal pro Woche' },
      { id: 'b2l23b', type: 'mcq', question: 'Wie lange dauert die ambulante Reha in der Regel?', options: ['Zwei bis vier Wochen', 'Vier bis sechs Wochen', 'Sechs bis acht Wochen', 'Acht bis zehn Wochen'], answer: 'Sechs bis acht Wochen' },
      { id: 'b2l23c', type: 'true-false', question: 'Die Wohnung muss fuer die ambulante Reha barrierefrei sein.', answer: 'true' }
    ]
  }
];

b2.push(...batch2);
console.log(`B2 count after batch 2: ${b2.length}`);

function validate() {
  const errors = [];
  if (b2.length !== 23) errors.push(`Expected 23 B2 items, got ${b2.length}`);

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
  console.log('\nBATCH 2 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
