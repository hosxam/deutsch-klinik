import { readFileSync, writeFileSync } from 'fs';

const path = new URL('../src/data/reading.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));
const a1 = data.A1;

console.log('Before: A1 count =', a1.length);

// ── Identify 2 weakest ──
const weakest = ['A1_read_17', 'A1_read_47'];
a1.filter(r => weakest.includes(r.id)).forEach(r =>
  console.log(`  Removing: ${r.id} - "${r.title}" (${r.lessonId})`)
);

// ── Replacement 1: Travel Plan (A1_read_17 slot, lesson 17) ──
const travelPlan = {
  id: 'A1_read_17',
  lessonId: 'A1_lesson_17',
  title: 'Reise nach Berlin',
  text: 'Lisa und ihre Familie fahren nach Berlin. Sie fahren mit dem Zug. Der Zug fahrt um 8 Uhr ab. Sie kommen um 12 Uhr in Berlin an. Lisa freut sich auf den Zoo und das Museum.',
  questions: [
    {
      id: 'qr17_1',
      type: 'true-false',
      question: 'Lisa fahrt mit dem Bus nach Berlin.',
      answer: 'false',
      explanation: 'Der Text sagt: "Sie fahren mit dem Zug."'
    },
    {
      id: 'qr17_2',
      type: 'true-false',
      question: 'Der Zug fahrt um 8 Uhr ab.',
      answer: 'true',
      explanation: 'Der Text sagt: "Der Zug fahrt um 8 Uhr ab."'
    },
    {
      id: 'qr17_3',
      type: 'mcq',
      question: 'Wann kommen sie in Berlin an?',
      options: ['Um 8 Uhr', 'Um 10 Uhr', 'Um 12 Uhr', 'Um 14 Uhr'],
      answer: 'Um 12 Uhr',
      explanation: 'Der Text sagt: "Sie kommen um 12 Uhr in Berlin an."'
    },
    {
      id: 'qr17_4',
      type: 'mcq',
      question: 'Worauf freut sich Lisa?',
      options: ['Auf das Hotel', 'Auf den Zoo und das Museum', 'Auf das Restaurant', 'Auf den Bahnhof'],
      answer: 'Auf den Zoo und das Museum',
      explanation: 'Der Text sagt: "Lisa freut sich auf den Zoo und das Museum."'
    }
  ]
};

// ── Replacement 2: Appointment Cancellation (A1_read_47 slot, lesson 22) ──
const cancelAppointment = {
  id: 'A1_read_47',
  lessonId: 'A1_lesson_22',
  title: 'Termin absagen',
  text: 'Herr Schmidt hat einen Termin bei Dr. Klein am Mittwoch um 10 Uhr. Er kann nicht kommen. Er ruft in der Praxis an. Er sagt: "Guten Tag, ich muss meinen Termin am Mittwoch absagen. Ich bin krank. Kann ich einen neuen Termin am Freitag bekommen?" Die Sprechstundenhilfe sagt: "Ja, am Freitag um 11 Uhr geht es."',
  questions: [
    {
      id: 'qr47_1',
      type: 'true-false',
      question: 'Herr Schmidt hat einen Termin am Dienstag.',
      answer: 'false',
      explanation: 'Der Termin ist am Mittwoch, nicht am Dienstag.'
    },
    {
      id: 'qr47_2',
      type: 'true-false',
      question: 'Herr Schmidt ruft in der Praxis an.',
      answer: 'true',
      explanation: 'Der Text sagt: "Er ruft in der Praxis an."'
    },
    {
      id: 'qr47_3',
      type: 'mcq',
      question: 'Warum kann Herr Schmidt nicht kommen?',
      options: ['Er hat Urlaub', 'Er ist krank', 'Er hat keine Zeit', 'Er ist im Urlaub'],
      answer: 'Er ist krank',
      explanation: 'Herr Schmidt sagt: "Ich bin krank."'
    },
    {
      id: 'qr47_4',
      type: 'mcq',
      question: 'Wann bekommt Herr Schmidt den neuen Termin?',
      options: ['Am Mittwoch um 10 Uhr', 'Am Freitag um 11 Uhr', 'Am Donnerstag um 10 Uhr', 'Am Freitag um 10 Uhr'],
      answer: 'Am Freitag um 11 Uhr',
      explanation: 'Die Sprechstundenhilfe sagt: "Am Freitag um 11 Uhr geht es."'
    }
  ]
};

// ── Replace in array ──
let replaced = 0;
for (let i = 0; i < a1.length; i++) {
  if (a1[i].id === 'A1_read_17') {
    a1[i] = travelPlan;
    replaced++;
    console.log('  Replaced A1_read_17 with "Reise nach Berlin"');
  } else if (a1[i].id === 'A1_read_47') {
    a1[i] = cancelAppointment;
    replaced++;
    console.log('  Replaced A1_read_47 with "Termin absagen"');
  }
}

console.log(`\nReplaced ${replaced} passages`);

// ── Validation ──
const ids = a1.map(e => e.id);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log('Duplicate IDs:', dupIds.length ? [...new Set(dupIds)].join(', ') : 'none');

const titles = a1.map(e => e.title.toLowerCase().replace(/\s+/g, ' ').trim());
const dupTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
console.log('Duplicate titles:', dupTitles.length ? [...new Set(dupTitles)].join(', ') : 'none');

const lessonIds = new Set(Array.from({length:25}, (_,i) => 'A1_lesson_' + (i+1)));
const broken = a1.filter(e => e.lessonId && !lessonIds.has(e.lessonId));
console.log('Broken lessonIds:', broken.length ? broken.map(e => `${e.id}:${e.lessonId}`).join(', ') : '0');

const hasQs = a1.filter(e => !e.questions || !Array.isArray(e.questions) || e.questions.length === 0);
console.log('Missing questions:', hasQs.length ? hasQs.map(e => e.id).join(', ') : '0');

const hasAnswers = a1.filter(e => !e.questions || e.questions.some(q => !q.answer && !q.options));
console.log('Missing answers in questions:', hasAnswers.length ? 'yes - check' : '0');

// Verify all 25 lessons covered
const covered = new Set(a1.map(e => e.lessonId));
const missing = [...lessonIds].filter(l => !covered.has(l));
console.log('Uncovered lessons:', missing.length ? missing.join(', ') : '0 (all 25 covered)');

console.log('\nFinal A1 reading count:', a1.length);

// ── Write ──
writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('File written.');
