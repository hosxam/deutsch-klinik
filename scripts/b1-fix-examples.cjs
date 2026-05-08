/**
 * b1-fix-examples.cjs
 * Expand B1 lesson examples to 10 minimum.
 * Preserves existing examples, adds contextually appropriate ones.
 */

const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');
const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf-8'));

const EXTRA_EXAMPLES = {
  "B1_lesson_6": [
    "Könnten Sie mich bitte mit Frau Doktor Wagner verbinden?",
    "Ich rufe an, weil ich meinen Termin bestätigen möchte."
  ],
  "B1_lesson_7": [
    "Sehr geehrte Damen und Herren, hiermit bewerbe ich mich um die Stelle.",
    "Ich habe bereits drei Jahre Erfahrung im Bereich Marketing."
  ],
  "B1_lesson_8": [
    "In sozialen Medien werden täglich Millionen von Fotos hochgeladen.",
    "Die Diskussion wurde im Forum von vielen Nutzern verfolgt."
  ],
  "B1_lesson_9": [
    "Wir pflanzen Bäume, um das Stadtklima zu verbessern.",
    "Anstatt Plastiktüten zu benutzen, nehme ich immer einen Stoffbeutel mit."
  ],
  "B1_lesson_10": [
    "Letztes Jahr habe ich ein dreimonatiges Praktikum bei Siemens gemacht.",
    "Hast du schon Erfahrung in der Patientenbetreuung gesammelt?"
  ],
  "B1_lesson_11": [
    "Der Film, den wir gestern gesehen haben, war wirklich spannend.",
    "Die Schauspielerin, die in diesem Film mitspielt, ist sehr bekannt."
  ],
  "B1_lesson_12": [
    "Eine ausgewogene Ernährung ist wichtig für die Gesundheit.",
    "Lebensmittel, die viele Vitamine enthalten, sind besonders wertvoll."
  ],
  "B1_lesson_13": [
    "Wenn ich mehr Zeit hätte, würde ich ein Musikinstrument lernen.",
    "Ich wünschte, ich könnte nächstes Jahr nach Japan reisen."
  ],
  "B1_lesson_14": [
    "Laut dem Mietvertrag ist die Kaution drei Monatsmieten.",
    "Während der Besichtigung sollten Sie Fragen zur Wohnung stellen."
  ],
  "B1_lesson_15": [
    "Die Fahrkarte des Regionalzugs kostet weniger als der ICE.",
    "Wegen des Streiks fahren heute viele Züge nicht."
  ],
  "B1_lesson_16": [
    "Ich freue mich sehr auf die Party am Samstag.",
    "Kannst du dich um die Getränke kümmern?"
  ],
  "B1_lesson_17": [
    "Der Präsident wurde gestern im Fernsehen interviewt.",
    "Die Wahl wurde von der Mehrheit der Bürger gewonnen."
  ],
  "B1_lesson_18": [
    "Die Suppe ist leider kalt. Könnten Sie sie bitte erwärmen?",
    "Ich hatte mir das Steak etwas anders vorgestellt."
  ],
  "B1_lesson_19": [
    "Vor der Reise sollten Sie die Unterkunft buchen.",
    "Während der Reise haben wir viele interessante Leute kennengelernt."
  ],
  "B1_lesson_20": [
    "Ohne zu zögern, meldete er sich freiwillig für die Aktion.",
    "Anstatt nur zu kritisieren, sollte man selbst mit anpacken."
  ],
  "B1_lesson_21": [
    "Das Studium der Medizin erfordert viel Disziplin.",
    "Die Bewerbung für einen Studienplatz muss bis Juli eingereicht werden."
  ],
  "B1_lesson_22": [
    "Das Buch, worüber wir gesprochen haben, ist ein Bestseller.",
    "Alles, was ich über Geschichte weiß, habe ich aus Büchern."
  ],
  "B1_lesson_23": [
    "Das Finale war gestern. Die Heimmannschaft hat mit 3:1 gewonnen.",
    "Der Marathon, der jedes Jahr stattfindet, ist sehr beliebt."
  ],
  "B1_lesson_24": [
    "Im Stau zu stehen ist extrem frustrierend.",
    "Die neue Straße wird die Verkehrssituation in der Stadt verbessern."
  ],
  "B1_lesson_25": [
    "Wenn ich mehr sparen würde, hätte ich jetzt genug Geld für ein Auto.",
    "Ich würde gern in Aktien investieren, aber ich habe keine Erfahrung."
  ]
};

let fixed = 0;
const b1 = lessons.filter(l => l.level === 'B1');
b1.forEach(lesson => {
  const extra = EXTRA_EXAMPLES[lesson.id];
  if (!extra) return;
  const current = lesson.examples || [];
  const needed = 10 - current.length;
  if (needed <= 0) return;
  const add = extra.slice(0, needed);
  lesson.examples = current.concat(add);
  console.log('  ' + lesson.id + ': ' + current.length + ' -> ' + lesson.examples.length + ' examples');
  fixed++;
});

fs.writeFileSync(path.join(DATA, 'germanLessons.json'), JSON.stringify(lessons, null, 2), 'utf-8');
console.log('\nFixed ' + fixed + ' lessons. Done.');
