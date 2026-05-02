import fs from 'fs';
import { execSync } from 'child_process';

const listeningPath = 'src/data/listening.json';
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));

const b2 = listening.B2;
const prevCount = b2.length;
console.log(`Previous B2 listening count: ${prevCount}`);

const batch5 = [
  {
    id: 'B2_listen_44', lessonId: 'B2_lesson_7', level: 'B2',
    title: 'Sitzung: Ethikkommission der Universitaetsklinik',
    script: 'Ich eroeffne die Sitzung der Ethikkommission. Wir besprechen heute den Antrag zur Studie ueber ein neues Medikament gegen Alzheimer. Die Studie umfasst 200 Patienten ueber 65 Jahre. Wichtige ethische Fragen: Ist die Einwilligung der Patienten gewaehrleistet, auch bei beginnender Demenz? Der Antragsteller schlaegt vor, dass ein Betreuer zustimmen muss, falls der Patient nicht mehr einwilligungsfaehig ist. Die Kommission wird zudem die Datenschutzmassnahmen pruefen. Wir stimmen in 30 Minuten ab. Ich bitte um eine sachliche Diskussion.',
    questions: [
      { id: 'b2l44a', type: 'mcq', question: 'Wie viele Patienten sind in der geplanten Studie?', options: ['100', '150', '200', '300'], answer: '200' },
      { id: 'b2l44b', type: 'mcq', question: 'Was schlaegt der Antragsteller bei nicht einwilligungsfaehigen Patienten vor?', options: ['Die Studie abbrechen', 'Dass ein Betreuer zustimmen muss', 'Aeltere Patienten ausschliessen', 'Nur gesunde Probanden nehmen'], answer: 'Dass ein Betreuer zustimmen muss' },
      { id: 'b2l44c', type: 'true-false', question: 'Die Kommission wird in 30 Minuten abstimmen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_45', lessonId: 'B2_lesson_21', level: 'B2',
    title: 'Entlassungsgespraech mit der Pflegefachkraft',
    script: 'Guten Morgen, Frau Hoffmann, ich bin Schwester Sabine und werde mit Ihnen das Entlassungsgespraech fuehren. Sie duerfen heute nach Hause. Ich gebe Ihnen alle wichtigen Informationen. Sie bekommen einen Medikamentenplan, auf dem genau steht, welche Tabletten Sie wann nehmen muessen. Die naechste Kontrolle beim Hausarzt ist in zwei Wochen. Bitte vergessen Sie nicht, dort einen Termin zu machen. Falls Sie Fragen haben, koennen Sie uns taeglich zwischen acht und sechzehn Uhr anrufen. Hier ist der Entlassungsbrief fuer Ihren Hausarzt.',
    questions: [
      { id: 'b2l45a', type: 'mcq', question: 'Wann ist die naechste Kontrolle beim Hausarzt?', options: ['In einer Woche', 'In zwei Wochen', 'In drei Wochen', 'In einem Monat'], answer: 'In zwei Wochen' },
      { id: 'b2l45b', type: 'true-false', question: 'Die Patientin bekommt einen Medikamentenplan.', answer: 'true' },
      { id: 'b2l45c', type: 'mcq', question: 'Wann koennen Patienten anrufen, wenn sie Fragen haben?', options: ['Rund um die Uhr', 'Von acht bis zweiundzwanzig Uhr', 'Von acht bis sechzehn Uhr', 'Nur an Wochentagen'], answer: 'Von acht bis sechzehn Uhr' }
    ]
  },
  {
    id: 'B2_listen_46', lessonId: 'B2_lesson_2', level: 'B2',
    title: 'Ankuendigung: Deutscher Aerztekongress',
    script: 'Sehr geehrte Damen und Herren, ich darf Ihnen den diesjaehrigen Deutschen Aerztekongress ankündigen. Er findet vom 15. bis 17. Oktober in der Messe Berlin statt. Schwerpunktthemen sind diesmal die Digitalisierung in der Medizin und der aerztliche Nachwuchs. Es werden ueber 5000 Teilnehmer aus dem gesamten deutschsprachigen Raum erwartet. Fruehbucher erhalten bis zum 31. Juli einen Rabatt von 20 Prozent. Studierende der Medizin zahlen einen ermaessigten Beitrag von 80 Euro. Weitere Informationen finden Sie auf unserer Webseite.',
    questions: [
      { id: 'b2l46a', type: 'mcq', question: 'Wann findet der Deutsche Aerztekongress statt?', options: ['Vom 10. bis 12. September', 'Vom 15. bis 17. Oktober', 'Vom 20. bis 22. November', 'Vom 5. bis 7. Dezember'], answer: 'Vom 15. bis 17. Oktober' },
      { id: 'b2l46b', type: 'mcq', question: 'Wie viel betraegt der Fruehbucherrabatt?', options: ['10 Prozent', '15 Prozent', '20 Prozent', '25 Prozent'], answer: '20 Prozent' },
      { id: 'b2l46c', type: 'true-false', question: 'Medizinstudierende zahlen einen ermaessigten Beitrag.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_47', lessonId: 'B2_lesson_12', level: 'B2',
    title: 'Durchsage: Besuchsregeln fuer Besucher',
    script: 'Achtung, eine Durchsage fuer alle Besucher der Klinik. Bitte beachten Sie unsere aktuellen Besuchsregeln. Die Besuchszeit ist taeglich von 14 bis 19 Uhr. Es duerfen maximal zwei Besucher gleichzeitig am Bett eines Patienten sein. Bitte fuehren Sie keine lauten Gespraeche auf den Fluren. Besucher mit Husten Schnupfen oder Fieber duerfen die Station nicht betreten. Vor Betreten und Verlassen der Station desinfizieren Sie bitte Ihre Haende. Kinder unter sechs Jahren duerfen nur in Begleitung eines Erwachsenen auf die Station.',
    questions: [
      { id: 'b2l47a', type: 'mcq', question: 'Wie lange dauert die Besuchszeit taeglich?', options: ['Von 10 bis 16 Uhr', 'Von 14 bis 19 Uhr', 'Von 15 bis 18 Uhr', 'Von 12 bis 20 Uhr'], answer: 'Von 14 bis 19 Uhr' },
      { id: 'b2l47b', type: 'true-false', question: 'Es duerfen maximal vier Besucher gleichzeitig am Bett sein.', answer: 'false' },
      { id: 'b2l47c', type: 'mcq', question: 'Wer darf die Station nicht betreten?', options: ['Besucher ohne Ausweis', 'Besucher mit Husten, Schnupfen oder Fieber', 'Besucher ueber 70 Jahre', 'Besucher aus dem Ausland'], answer: 'Besucher mit Husten, Schnupfen oder Fieber' }
    ]
  },
  {
    id: 'B2_listen_48', lessonId: 'B2_lesson_3', level: 'B2',
    title: 'Radiospot: Organspendeaktion',
    script: 'Dieser Beitrag wird Ihnen praesentiert von der Deutschen Stiftung Organtransplantation. Wissen Sie, dass in Deutschland ueber achttausend Menschen auf ein Spenderorgan warten? Taeglich sterben drei von ihnen, weil nicht genug Organe verfuegbar sind. Dabei kann jeder ab 16 Jahren einen Organspendeausweis ausfuellen. Sie koennen den Ausweis online bestellen oder in Ihrer Arztpraxis abholen. Tragen Sie Ihre Entscheidung mit sich – das kann im Ernstfall Leben retten. Informieren Sie sich auch Ihre Familie ueber Ihren Willen. Es geht um Solidaritaet.',
    questions: [
      { id: 'b2l48a', type: 'mcq', question: 'Wie viele Menschen warten in Deutschland auf ein Spenderorgan?', options: ['Ueber dreitausend', 'Ueber fuenftausend', 'Ueber achttausend', 'Ueber zehntausend'], answer: 'Ueber achttausend' },
      { id: 'b2l48b', type: 'true-false', question: 'Taeglich sterben drei Menschen, weil nicht genug Organe verfuegbar sind.', answer: 'true' },
      { id: 'b2l48c', type: 'mcq', question: 'Ab welchem Alter kann man einen Organspendeausweis ausfuellen?', options: ['Ab 14 Jahren', 'Ab 16 Jahren', 'Ab 18 Jahren', 'Ab 21 Jahren'], answer: 'Ab 16 Jahren' }
    ]
  },
  {
    id: 'B2_listen_49', lessonId: 'B2_lesson_8', level: 'B2',
    title: 'Stellenanzeige: Assistenzarzt gesucht',
    script: 'Das Staedtische Klinikum Muenchen sucht zum naechstmoeglichen Zeitpunkt einen Assistenzarzt fuer die Innere Medizin. Die Stelle ist zunaechst auf zwei Jahre befristet mit der Option auf Verlaengerung. Wir bieten eine strukturierte Weiterbildung mit Rotation durch alle Fachbereiche, moderne Arbeitsplaetze und eine faire Verguetung nach Tarif. Voraussetzungen sind ein abgeschlossenes Medizinstudium und die Approbation. Erste klinische Erfahrung ist von Vorteil, aber nicht zwingend erforderlich. Initiativbewerbungen sind jederzeit willkommen. Wir freuen uns auf Ihre Unterlagen.',
    questions: [
      { id: 'b2l49a', type: 'mcq', question: 'Wie lange ist die Stelle zunaechst befristet?', options: ['Ein Jahr', '18 Monate', 'Zwei Jahre', 'Drei Jahre'], answer: 'Zwei Jahre' },
      { id: 'b2l49b', type: 'true-false', question: 'Erste klinische Erfahrung ist zwingend erforderlich.', answer: 'false' },
      { id: 'b2l49c', type: 'mcq', question: 'Was bietet das Klinikum?', options: ['Ein Auto zur Verfuegung', 'Einen Dienstwagen', 'Strukturierte Weiterbildung und faire Verguetung', 'Eine Wohnung'], answer: 'Strukturierte Weiterbildung und faire Verguetung' }
    ]
  },
  {
    id: 'B2_listen_50', lessonId: 'B2_lesson_25', level: 'B2',
    title: 'Workshop: Interkulturelle Kompetenz',
    script: 'Herzlich willkommen zum Workshop Interkulturelle Kompetenz im Krankenhaus. Ich bin Ihre Trainerin Frau Yilmaz. Wir arbeiten heute an drei Zielen: Erstens, Verstaendnis fuer kulturelle Unterschiede entwickeln. Zweitens, typische Missverstaendnisse erkennen und drittens, praktische Loesungen finden. Ein Beispiel: In manchen Kulturen ist es unueblich, dass eine Aerztin allein behandelt. Loesung: Fragen Sie den Patienten hoeflich nach seinen Wuenschen. Wir ueben gleich in Rollenspielen. Bitte haben Sie keine Scheu, Fehler zu machen. Der erste Schritt ist das Bewusstsein fuer die Unterschiede.',
    questions: [
      { id: 'b2l50a', type: 'mcq', question: 'Wie viele Ziele hat der Workshop?', options: ['Zwei', 'Drei', 'Vier', 'Fuenf'], answer: 'Drei' },
      { id: 'b2l50b', type: 'mcq', question: 'Was ist eine praktische Loesung bei kulturellen Unterschieden?', options: ['Nur maennliche Aerzte einsetzen', 'Den Patienten nach seinen Wuenschen fragen', 'Standardisiert behandeln', 'Keine auslaendischen Patienten aufnehmen'], answer: 'Den Patienten nach seinen Wuenschen fragen' },
      { id: 'b2l50c', type: 'true-false', question: 'Im Workshop wird in Rollenspielen geuebt.', answer: 'true' }
    ]
  }
];

b2.push(...batch5);
console.log(`B2 count after batch 5: ${b2.length}`);

function validate() {
  const errors = [];
  if (b2.length !== 50) errors.push(`Expected 50 B2 items, got ${b2.length}`);

  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => { if (seen.has(id)) errors.push(`Duplicate ID: ${id}`); seen.add(id); });

  const scriptStarts = new Set();
  b2.forEach(p => {
    const s = p.script.substring(0, 40).toLowerCase();
    if (scriptStarts.has(s)) errors.push(`Duplicate script start: ${p.id} - ${p.title}`);
    scriptStarts.add(s);
  });

  b2.forEach((p, i) => {
    if (!p.id) errors.push(`Index ${i}: missing id`);
    if (!p.title) errors.push(`Index ${i}: missing title`);
    if (!p.script) errors.push(`Index ${i}: missing script`);
    if (!p.lessonId || !p.lessonId.startsWith('B2_lesson_')) errors.push(`Index ${i}: invalid lessonId`);
    if (!p.level || p.level !== 'B2') errors.push(`Index ${i}: invalid/missing level`);
    if (!p.questions || p.questions.length === 0) errors.push(`Index ${i} (${p.id}): missing questions`);
    else p.questions.forEach(q => {
      if (!q.id) errors.push(`${p.id}: question missing id`);
      if (!q.type) errors.push(`${p.id}: q missing type`);
      if (!q.question) errors.push(`${p.id}: q missing question`);
      if (!q.answer) errors.push(`${p.id}: q missing answer`);
      if (q.type === 'mcq' && (!q.options || q.options.length < 2)) errors.push(`${p.id}: MCQ missing options`);
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
  console.log('\nBATCH 5 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
