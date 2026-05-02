import fs from 'fs';
import { execSync } from 'child_process';

const readingPath = 'src/data/reading.json';
const reading = JSON.parse(fs.readFileSync(readingPath, 'utf8'));

const existing = reading.B2.filter(p => ['B2_read_1','B2_read_2','B2_read_3'].includes(p.id));
console.log(`Existing B2 passages: ${existing.length}`);

// Assign lessonIds to existing 3 for consistency
existing.find(p => p.id === 'B2_read_1').lessonId = 'B2_lesson_16';
existing.find(p => p.id === 'B2_read_2').lessonId = 'B2_lesson_7';
existing.find(p => p.id === 'B2_read_3').lessonId = 'B2_lesson_2';

const batch1 = [
  {
    id: 'B2_read_4',
    lessonId: 'B2_lesson_8',
    title: 'Kommunikation am Arbeitsplatz',
    text: 'Eine gute Kommunikation am Arbeitsplatz ist fuer den Erfolg eines Unternehmens entscheidend. Missverstaendnisse zwischen Kollegen oder zwischen Arzt und Patient koennen schwerwiegende Folgen haben. In der Medizin ist eine klare und eindeutige Kommunikation besonders wichtig. Studien zeigen, dass viele Behandlungsfehler auf Kommunikationsprobleme zurueckzufuehren sind. Deshalb legen immer mehr Kliniken Wert auf Schulungen zur Gespraechsfuehrung. Auch die Dokumentation von Patientengespraechen wird verbessert.',
    questions: [
      {
        id: 'b2r4a',
        type: 'mcq',
        question: 'Warum ist Kommunikation am Arbeitsplatz wichtig?',
        options: ['Weil sie Zeit spart', 'Weil Missverstaendnisse schwere Folgen haben koennen', 'Weil sie gesetzlich vorgeschrieben ist', 'Weil sie die Hierarchie staerkt'],
        answer: 'Weil Missverstaendnisse schwere Folgen haben koennen',
        explanation: 'Missverstaendnisse zwischen Kollegen oder zwischen Arzt und Patient koennen schwerwiegende Folgen haben.'
      },
      {
        id: 'b2r4b',
        type: 'true-false',
        question: 'Viele Behandlungsfehler sind auf Kommunikationsprobleme zurueckzufuehren.',
        answer: 'true'
      },
      {
        id: 'b2r4c',
        type: 'mcq',
        question: 'Was tun Kliniken, um die Kommunikation zu verbessern?',
        options: ['Sie stellen mehr Personal ein', 'Sie bieten Schulungen zur Gespraechsfuehrung an', 'Sie verkuerzen die Arbeitszeit', 'Sie schaffen Hierarchien ab'],
        answer: 'Sie bieten Schulungen zur Gespraechsfuehrung an'
      }
    ]
  },
  {
    id: 'B2_read_5',
    lessonId: 'B2_lesson_2',
    title: 'Lernstrategien fuer Medizinstudenten',
    text: 'Das Medizinstudium gilt als eines der anspruchsvollsten Studiengaenge. Gute Lernstrategien sind daher entscheidend. Erfolgreiche Studierende nutzen verschiedene Methoden: aktives Wiederholen, Arbeiten in Lerngruppen und das Erklaeren von Zusammenhaengen. Auch digitale Karteikarten und Online-Plattformen werden immer beliebter. Die Faehigkeit, Informationen zu strukturieren und Prioritaeten zu setzen, ist wichtiger als reines Auswendiglernen. Viele Universitaeten bieten Kurse zum wissenschaftlichen Arbeiten an.',
    questions: [
      {
        id: 'b2r5a',
        type: 'mcq',
        question: 'Welche Lernstrategien nutzen erfolgreiche Medizinstudenten?',
        options: ['Reines Auswendiglernen', 'Aktives Wiederholen und Arbeiten in Lerngruppen', 'Nur Online-Kurse', 'Passives Lesen'],
        answer: 'Aktives Wiederholen und Arbeiten in Lerngruppen',
        explanation: 'Erfolgreiche Studierende nutzen aktives Wiederholen, Arbeiten in Lerngruppen und das Erklaeren von Zusammenhaengen.'
      },
      {
        id: 'b2r5b',
        type: 'true-false',
        question: 'Das Medizinstudium gilt als anspruchsvoll.',
        answer: 'true'
      },
      {
        id: 'b2r5c',
        type: 'mcq',
        question: 'Was ist wichtiger als reines Auswendiglernen?',
        options: ['Die Faehigkeit zu strukturieren und Prioritaeten zu setzen', 'Schnelles Lesen', 'Viele Buecher zu lesen', 'Alle Vorlesungen zu besuchen'],
        answer: 'Die Faehigkeit zu strukturieren und Prioritaeten zu setzen'
      }
    ]
  },
  {
    id: 'B2_read_6',
    lessonId: 'B2_lesson_12',
    title: 'Patientensicherheit im Krankenhaus',
    text: 'Die Patientensicherheit hat in deutschen Krankenhaeusern oberste Prioritaet. Massnahmen wie die Checkliste fuer Operationen und die korrekte Patientenidentifikation sind Standard. Das CIRS-System (Critical Incident Reporting System) erlaubt es Mitarbeitern, Beinahefehler anonym zu melden. Aus diesen Meldungen werden Verbesserungen abgeleitet. Die Weltgesundheitsorganisation hat neun Ziele fuer die Patientensicherheit definiert. Dazu gehoeren die Vermeidung von Infektionen und die sichere Medikamentengabe.',
    questions: [
      {
        id: 'b2r6a',
        type: 'mcq',
        question: 'Wozu dient das CIRS-System?',
        options: ['Zur Patientenabrechnung', 'Zur anonymen Meldung von Beinahefehlern', 'Zur Terminvergabe', 'Zur Personalplanung'],
        answer: 'Zur anonymen Meldung von Beinahefehlern',
        explanation: 'Das CIRS erlaubt es Mitarbeitern, Beinahefehler anonym zu melden.'
      },
      {
        id: 'b2r6b',
        type: 'true-false',
        question: 'Die Weltgesundheitsorganisation hat neun Ziele fuer die Patientensicherheit definiert.',
        answer: 'true'
      },
      {
        id: 'b2r6c',
        type: 'mcq',
        question: 'Welche Massnahmen sind Standard fuer die Patientensicherheit?',
        options: ['Checkliste fuer Operationen und Patientenidentifikation', 'Mehr Betten auf den Stationen', 'Laengere Arbeitszeiten', 'Mehr Medikamente'],
        answer: 'Checkliste fuer Operationen und Patientenidentifikation'
      }
    ]
  },
  {
    id: 'B2_read_7',
    lessonId: 'B2_lesson_21',
    title: 'Der Alltag auf einer Krankenstation',
    text: 'Der Arbeitsalltag auf einer Krankenstation beginnt frueh. Die Fruehschicht startet meist um sechs Uhr mit der Uebergabe von der Nachtschicht. Danach folgen die Visite, bei der der Arzt den Zustand der Patienten beurteilt. Pflegekraefte teilen Medikamente aus, wechseln Verbaende und dokumentieren den Zustand der Patienten. Zwischendurch kommen neue Patienten hinzu oder werden entlassen. Der Tag ist oft hektisch und erfordert gute Organisation und Teamarbeit.',
    questions: [
      {
        id: 'b2r7a',
        type: 'mcq',
        question: 'Wann beginnt die Fruehschicht meist?',
        options: ['Um fuenf Uhr', 'Um sechs Uhr', 'Um sieben Uhr', 'Um acht Uhr'],
        answer: 'Um sechs Uhr'
      },
      {
        id: 'b2r7b',
        type: 'true-false',
        question: 'Die Visite dient dazu, den Zustand der Patienten zu beurteilen.',
        answer: 'true'
      },
      {
        id: 'b2r7c',
        type: 'mcq',
        question: 'Was erfordert der Alltag auf einer Station besonders?',
        options: ['Schnelligkeit', 'Gute Organisation und Teamarbeit', 'Koerperliche Kraft', 'Technisches Wissen'],
        answer: 'Gute Organisation und Teamarbeit'
      }
    ]
  },
  {
    id: 'B2_read_8',
    lessonId: 'B2_lesson_16',
    title: 'Terminvergabesysteme in der Praxis',
    text: 'Viele Arztpraxen haben inzwischen auf digitale Terminvergabesysteme umgestellt. Patienten koennen online Termine buchen und erhalten automatische Erinnerungen per E-Mail oder SMS. Das reduziert die Zahl der nicht wahrgenommenen Termine. Einige Praxen bieten auch Videosprechstunden an. Allerdings haben aeltere Patienten manchmal Schwierigkeiten mit der digitalen Terminvergabe. Deshalb bieten die meisten Praxen weiterhin auch telefonische Terminvereinbarungen an.',
    questions: [
      {
        id: 'b2r8a',
        type: 'mcq',
        question: 'Was reduziert die digitale Terminvergabe?',
        options: ['Die Wartezeiten', 'Die Zahl der nicht wahrgenommenen Termine', 'Die Kosten', 'Die Anzahl der Patienten'],
        answer: 'Die Zahl der nicht wahrgenommenen Termine',
        explanation: 'Patienten erhalten automatische Erinnerungen, wodurch weniger Termine ausfallen.'
      },
      {
        id: 'b2r8b',
        type: 'true-false',
        question: 'Alle Praxen bieten nur noch digitale Terminvergabe an.',
        answer: 'false'
      },
      {
        id: 'b2r8c',
        type: 'mcq',
        question: 'Welche Schwierigkeit kann bei der digitalen Terminvergabe auftreten?',
        options: ['Sie ist zu teuer', 'Aeltere Patienten haben manchmal Probleme damit', 'Sie funktioniert oft nicht', 'Sie ist zu langsam'],
        answer: 'Aeltere Patienten haben manchmal Probleme damit'
      }
    ]
  },
  {
    id: 'B2_read_9',
    lessonId: 'B2_lesson_10',
    title: 'Die gesetzliche Krankenversicherung verstehen',
    text: 'Die gesetzliche Krankenversicherung (GKV) ist das Fundament des deutschen Gesundheitssystems. Etwa 90 Prozent der Bevoelkerung sind gesetzlich versichert. Der Beitrag richtet sich nach dem Einkommen und wird zur Haelfte vom Arbeitgeber bezahlt. Die GKV bietet einen umfassenden Leistungskatalog. Dazu gehoeren Arztbesuche, Krankenhausaufenthalte und Medikamente. Fuer bestimmte Leistungen wie das Zahnersatz gibt es Zuzahlungen. Versicherte sollten sich ueber ihren Versicherungsschutz informieren.',
    questions: [
      {
        id: 'b2r9a',
        type: 'mcq',
        question: 'Wie viel Prozent der Bevoelkerung sind gesetzlich versichert?',
        options: ['Etwa 50 Prozent', 'Etwa 70 Prozent', 'Etwa 90 Prozent', 'Etwa 95 Prozent'],
        answer: 'Etwa 90 Prozent'
      },
      {
        id: 'b2r9b',
        type: 'true-false',
        question: 'Der Arbeitgeber zahlt die Haelfte des Krankenversicherungsbeitrags.',
        answer: 'true'
      },
      {
        id: 'b2r9c',
        type: 'mcq',
        question: 'Wofuer gibt es Zuzahlungen in der GKV?',
        options: ['Fuer Arztbesuche', 'Fuer Krankenhausaufenthalte', 'Fuer Zahnersatz', 'Fuer Medikamente'],
        answer: 'Fuer Zahnersatz'
      }
    ]
  },
  {
    id: 'B2_read_10',
    lessonId: 'B2_lesson_3',
    title: 'Oeffentliche Gesundheitsvorsorge',
    text: 'Die oeffentliche Gesundheitsvorsorge ist eine Aufgabe des Staates. Dazu gehoeren Impfprogramme, Aufklaerungskampagnen und die Ueberwachung von Infektionskrankheiten. Das Robert Koch-Institut uebernimmt in Deutschland diese Aufgaben. In den letzten Jahren hat die Bedeutung der oeffentlichen Gesundheit zugenommen. Die COVID-19-Pandemie hat gezeigt, wie wichtig ein starkes Gesundheitssystem ist. Experten fordern mehr Investitionen in die Praevention und die Gesundheitsaufklaerung.',
    questions: [
      {
        id: 'b2r10a',
        type: 'mcq',
        question: 'Welche Aufgaben gehoeren zur oeffentlichen Gesundheitsvorsorge?',
        options: ['Nur Impfungen', 'Impfprogramme, Aufklaerungskampagnen und Ueberwachung von Infektionen', 'Nur die Krankenhausverwaltung', 'Nur die Arzneimittelzulassung'],
        answer: 'Impfprogramme, Aufklaerungskampagnen und Ueberwachung von Infektionen'
      },
      {
        id: 'b2r10b',
        type: 'true-false',
        question: 'Das Robert Koch-Institut uebernimmt Aufgaben der oeffentlichen Gesundheit.',
        answer: 'true'
      },
      {
        id: 'b2r10c',
        type: 'mcq',
        question: 'Was fordern Experten nach der Pandemie?',
        options: ['Weniger Impfungen', 'Mehr Investitionen in Praevention und Gesundheitsaufklaerung', 'Weniger staatliche Kontrolle', 'Mehr Privatisierung'],
        answer: 'Mehr Investitionen in Praevention und Gesundheitsaufklaerung'
      }
    ]
  },
  {
    id: 'B2_read_11',
    lessonId: 'B2_lesson_16',
    title: 'Digitalisierung in der Pflegedokumentation',
    text: 'Die Digitalisierung hat auch die Pflegedokumentation erfasst. Frueher wurden alle Informationen auf Papier festgehalten. Heute nutzen viele Pflegeeinrichtungen elektronische Dokumentationssysteme. Die Pflegekraefte erfassen Vitaldaten, durchgefuehrte Massnahmen und den Zustand der Patienten digital. Das spart Zeit und reduziert Fehler. Allerdings kritisieren einige Pflegekraefte, dass die Arbeit am Computer die Zeit mit den Patienten verringert. Ein guter Ausgleich zwischen Digitalisierung und persoenlicher Zuwendung ist wichtig.',
    questions: [
      {
        id: 'b2r11a',
        type: 'mcq',
        question: 'Welche Vorteile hat die elektronische Pflegedokumentation?',
        options: ['Sie ist billiger', 'Sie spart Zeit und reduziert Fehler', 'Sie ist einfacher zu lernen', 'Sie ersetzt das Pflegepersonal'],
        answer: 'Sie spart Zeit und reduziert Fehler'
      },
      {
        id: 'b2r11b',
        type: 'true-false',
        question: 'Einige Pflegekraefte kritisieren, dass die Digitalisierung die Zeit mit Patienten verringert.',
        answer: 'true'
      },
      {
        id: 'b2r11c',
        type: 'mcq',
        question: 'Was ist bei der Digitalisierung der Pflege wichtig?',
        options: ['Komplette Digitalisierung', 'Ein guter Ausgleich zwischen Digitalisierung und persoenlicher Zuwendung', 'Weniger Pflegekraefte', 'Mehr Computer'],
        answer: 'Ein guter Ausgleich zwischen Digitalisierung und persoenlicher Zuwendung'
      }
    ]
  },
  {
    id: 'B2_read_12',
    lessonId: 'B2_lesson_9',
    title: 'Ernaehrung und Lebensstil',
    text: 'Eine ausgewogene Ernaehrung ist die Grundlage fuer Gesundheit. Die Deutsche Gesellschaft fuer Ernaehrung empfiehlt, taeglich Obst und Gemuese zu essen, ausreichend zu trinken und auf stark verarbeitete Lebensmittel zu verzichten. Viele Menschen ernaehren sich jedoch ungesund. Die Folgen sind Uebergewicht, Diabetes und Herz-Kreislauf-Erkrankungen. In der medizinischen Ausbildung wird das Thema Ernaehrungsberatung immer wichtiger. Aerzte sollten ihre Patienten zu einem gesunden Lebensstil motivieren koennen.',
    questions: [
      {
        id: 'b2r12a',
        type: 'mcq',
        question: 'Was empfiehlt die Deutsche Gesellschaft fuer Ernaehrung?',
        options: ['Nur Fleisch essen', 'Taeglich Obst, Gemuese und ausreichend trinken', 'Auf Kohlenhydrate verzichten', 'Drei Mahlzeiten pro Tag'],
        answer: 'Taeglich Obst, Gemuese und ausreichend trinken'
      },
      {
        id: 'b2r12b',
        type: 'true-false',
        question: 'Uebergewicht und Diabetes sind Folgen ungesunder Ernaehrung.',
        answer: 'true'
      },
      {
        id: 'b2r12c',
        type: 'mcq',
        question: 'Welche Rolle spielt Ernaehrungsberatung in der medizinischen Ausbildung?',
        options: ['Sie spielt keine Rolle', 'Sie wird immer wichtiger', 'Sie ist der wichtigste Bereich', 'Sie ist optional'],
        answer: 'Sie wird immer wichtiger'
      }
    ]
  },
  {
    id: 'B2_read_13',
    lessonId: 'B2_lesson_18',
    title: 'Umwelt und Gesundheit',
    text: 'Die Umwelt hat einen grossen Einfluss auf die Gesundheit. Luftverschmutzung in Staedten kann Atemwegserkrankungen verursachen. Laermbelastung erhoeht das Risiko fuer Herz-Kreislauf-Probleme. Gleichzeitig foerdern gruene Flaschen in der Stadt die Bewegung und das Wohlbefinden. Die Weltgesundheitsorganisation betont den Zusammenhang zwischen Umwelt- und Gesundheitsschutz. Kommunen versuchen, durch umweltfreundliche Verkehrspolitik und mehr Begruenung die Lebensqualitaet zu verbessern.',
    questions: [
      {
        id: 'b2r13a',
        type: 'mcq',
        question: 'Welche Gesundheitsprobleme kann Luftverschmutzung verursachen?',
        options: ['Kopfschmerzen', 'Atemwegserkrankungen', 'Hautausschlag', 'Allergien'],
        answer: 'Atemwegserkrankungen'
      },
      {
        id: 'b2r13b',
        type: 'true-false',
        question: 'Gruene Flaschen in der Stadt foerdern die Bewegung und das Wohlbefinden.',
        answer: 'true'
      },
      {
        id: 'b2r13c',
        type: 'mcq',
        question: 'Wie versuchen Kommunen, die Lebensqualitaet zu verbessern?',
        options: ['Durch mehr Strassenbau', 'Durch umweltfreundliche Verkehrspolitik und Begruenung', 'Durch hoehere Steuern', 'Durch weniger Parks'],
        answer: 'Durch umweltfreundliche Verkehrspolitik und Begruenung'
      }
    ]
  }
];

// Add lessonIds to existing
reading.B2 = existing;

// Add batch 1
reading.B2.push(...batch1);
console.log(`B2 count after batch 1: ${reading.B2.length}`);

// Validate
function validate() {
  const b2 = reading.B2;
  const errors = [];

  // Check counts
  if (b2.length !== 13) errors.push(`Expected 13 B2 passages, got ${b2.length}`);

  // Check for duplicate IDs
  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => {
    if (seen.has(id)) errors.push(`Duplicate ID: ${id}`);
    seen.add(id);
  });

  // Check unique titles
  const titles = b2.map(p => p.title.toLowerCase());
  const seenTitles = new Set();
  titles.forEach((t, i) => {
    if (seenTitles.has(t)) errors.push(`Duplicate title at index ${i}: "${b2[i].title}"`);
    seenTitles.add(t);
  });

  // Check each passage
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

// Write back
fs.writeFileSync(readingPath, JSON.stringify(reading, null, 2) + '\n');
console.log('File written successfully.');

// Run build
console.log('\nRunning npm build...');
try {
  const buildOutput = execSync('npm run build 2>&1', { timeout: 120000 });
  console.log('Build output:', buildOutput.toString().slice(0, 500));
  console.log('\nBATCH 1 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
