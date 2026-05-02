import fs from 'fs';

const data = JSON.parse(fs.readFileSync('listening.json', 'utf8'));
let c1 = data.C1 || [];

let maxQid = c1.reduce((m, v) => v.questions.reduce((m2, q) => {
  const n = parseInt(q.id.replace(/[^\d]/g, ''), 10);
  return Math.max(m2, n);
}, m), 0);

function nq() { maxQid++; return 'ql' + maxQid; }

function mkq(type, question, answer, opts) {
  const o = { id: nq(), type, question };
  if (opts) o.options = opts;
  o.answer = answer;
  return o;
}

function l(id, title, script, questions, lessonId) {
  return { id, title, script, questions, level: "C1", lessonId };
}

const batch2b = [
  // 41. Occupational health exam - L17
  l('C1_listen_44', 'Betriebs\u00E4rztliche Untersuchung',
   'Betriebsarzt: Guten Tag, Herr Schr\u00F6der. Ich bin Dr. Bergmann, der Betriebsarzt. Sie arbeiten in der Produktion, richtig?\n\nMitarbeiter: Ja, in der Metallverarbeitung.\n\nBetriebsarzt: Dann m\u00FCssen wir heute die G 25 Untersuchung machen, also die arbeitsmedizinische Vorsorge f\u00FCr L\u00E4rm- und Gefahrstoffexposition.\n\nMitarbeiter: Ist das Pflicht?\n\nBetriebsarzt: Ja, gesetzlich vorgeschrieben. Wir testen Ihr Geh\u00F6r, machen einen Lungenfunktionstest und pr\u00FCfen die Haut. Au\u00DFerdem besprechen wir Ihren Impfschutz.\n\nMitarbeiter: Ich hatte letztes Jahr eine berufsbedingte Hautentz\u00FCndung.\n\nBetriebsarzt: Das ist wichtig. Dann m\u00FCssen wir das besonders dokumentieren und gegebenenfalls eine Hautschutzberatung durchf\u00FChren. Tragen Sie bitte die pers\u00F6nliche Schutzausr\u00FCstung konsequent.\n\nMitarbeiter: Mache ich, aber bei der Hitze im Sommer ist das schwierig.\n\nBetriebsarzt: Ich verstehe. Aber Hauterkrankungen sind die h\u00E4ufigste Berufskrankheit in Ihrem Bereich.',
   [
    mkq('mcq', 'Welche arbeitsmedizinische Vorsorge wird genannt?', 'Die G 25 Untersuchung f\u00FCr L\u00E4rm- und Gefahrstoffexposition', ['Die G 35 Untersuchung f\u00FCr Bildschirmarbeit', 'Die G 25 Untersuchung f\u00FCr L\u00E4rm- und Gefahrstoffexposition', 'Die G 40 Untersuchung f\u00FCr Nachtschicht', 'Die G 50 Untersuchung f\u00FCr F\u00FChrerschein']),
    mkq('true-false', 'Die Untersuchung ist gesetzlich vorgeschrieben.', 'true'),
    mkq('mcq', 'Welche Untersuchungen werden durchgef\u00FChrt?', 'Geh\u00F6rtest, Lungenfunktionstest und Hautpr\u00FCfung', ['EKG und Blutdruck', 'Geh\u00F6rtest, Lungenfunktionstest und Hautpr\u00FCfung', 'Sehtest und R\u00F6ntgen', 'Blutbild und Urinanalyse']),
    mkq('gap-fill', 'Hauterkrankungen sind die h\u00E4ufigste ____ in der Metallverarbeitung.', 'Berufskrankheit', ['Todesursache', 'Berufskrankheit', 'Unfallursache', 'Arbeitsunzeit'])
   ], 'C1_lesson_17'),

  // 42. Maternity ward consultation - L18
  l('C1_listen_45', 'Geburtsplanungsgespr\u00E4ch',
   'Hebamme: Frau M\u00FCller, sch\u00F6n, dass Sie zum Geburtsplanungsgespr\u00E4ch gekommen sind. Sie sind jetzt in der 32. Schwangerschaftswoche. Haben Sie schon Vorstellungen, wie Ihre Geburt aussehen soll?\n\nPatientin: Ich w\u00FCnsche mir eine m\u00F6glichst nat\u00FCrliche Geburt, aber ich habe Angst vor den Schmerzen.\n\nHebamme: Das ist v\u00F6llig normal. Wir besprechen heute alle Optionen. Sie k\u00F6nnen verschiedene Schmerzlinderungsmethoden nutzen: Atemtechniken, Bewegung, warme B\u00E4der oder bei Bedarf eine PDA.\n\nPatientin: Was ist, wenn etwas schiefgeht?\n\nHebamme: Daf\u00FCr haben wir einen Notfallplan. Wir sind ein Perinatalzentrum, das hei\u00DFt, wir k\u00F6nnen auch Fr\u00FChgeburten und Komplikationen versorgen. Ihr Kind wird nach der Geburt von Kinder\u00E4rzten untersucht.\n\nPatientin: Kann mein Mann dabei sein?\n\nHebamme: Selbstverst\u00E4ndlich. Er ist herzlich willkommen und kann Sie die ganze Zeit begleiten.',
   [
    mkq('mcq', 'In welcher Schwangerschaftswoche befindet sich die Patientin?', 'In der 32. SSW', ['In der 28. SSW', 'In der 32. SSW', 'In der 36. SSW', 'In der 40. SSW']),
    mkq('true-false', 'Der Ehemann darf bei der Geburt nicht dabei sein.', 'false'),
    mkq('mcq', 'Welche Schmerzlinderungsm\u00F6glichkeiten werden genannt?', 'Atemtechniken, Bewegung, warme B\u00E4der und PDA', ['Nur PDA', 'Atemtechniken, Bewegung, warme B\u00E4der und PDA', 'Nur Medikamente', 'Nur Atemtechniken']),
    mkq('gap-fill', 'Die Klinik ist ein ____ und kann auch Fr\u00FChgeburten versorgen.', 'Perinatalzentrum', ['Krankenhaus', 'Perinatalzentrum', 'Geburtshaus', 'Gesundheitszentrum'])
   ], 'C1_lesson_18'),

  // 43. Multimorbidity conference - L19
  l('C1_listen_46', 'Geriatrische Fallkonferenz',
   'Geriatrin: Guten Morgen zum Fallgespr\u00E4ch. Wir besprechen Herrn Kr\u00FCger, 86 Jahre, mit sieben Diagnosen und zw\u00F6lf Medikamenten. Die Herausforderung ist die Polypharmazie.\n\nApotheker: Ich habe den Medikationsplan analysiert. Drei der Medikamente sind m\u00F6glicherweise verzichtbar. Das sollten wir \u00FCberpr\u00FCfen.\n\nGeriatrin: Welche Priorisierung schlagen Sie vor?\n\nApotheker: Die Protonenpumpenhemmer sind nicht mehr indiziert, das Antihistaminikum k\u00F6nnen wir absetzen. Der Patient ist in den letzten Wochen dreimal gest\u00FCrzt, m\u00F6glicherweise wegen der Blutdrucksenker.\n\nPhysiotherapeutin: Ich habe die Mobilit\u00E4t getestet. Der Timed-Up-and-Go lag bei 18 Sekunden, also ein erh\u00F6htes Sturzrisiko.\n\nGeriatrin: Dann empfehle ich: Medikamente reduzieren, Physiotherapie intensivieren und eine Sturzprophylaxe einleiten.\n\nSozialarbeiterin: Die h\u00E4usliche Versorgung ist kritisch. Ich beantrage einen Pflegegrad.',
   [
    mkq('mcq', 'Was ist die gr\u00F6\u00DFte Herausforderung bei diesem Patienten?', 'Die Polypharmazie mit zw\u00F6lf Medikamenten', ['Die sieben Diagnosen', 'Die Polypharmazie mit zw\u00F6lf Medikamenten', 'Das hohe Alter', 'Die fehlende Mobilit\u00E4t']),
    mkq('true-false', 'Der Apotheker empfiehlt, alle Medikamente beizubehalten.', 'false'),
    mkq('mcq', 'Welche Medikamente k\u00F6nnten abgesetzt werden?', 'Protonenpumpenhemmer und Antihistaminikum', ['Blutdrucksenker und Diuretikum', 'Protonenpumpenhemmer und Antihistaminikum', 'Schmerzmittel und Antidepressivum', 'Insulin und Metformin']),
    mkq('gap-fill', 'Der Timed-Up-and-Go lag bei 18 Sekunden, was auf ein ____ Sturzrisiko hinweist.', 'erh\u00F6htes', ['niedriges', 'erh\u00F6htes', 'normales', 'unver\u00E4ndertes'])
   ], 'C1_lesson_19'),

  // 44. CPR training - L20
  l('C1_listen_47', 'Reanimationstraining: Basic Life Support',
   'Trainer: Willkommen zum BLS-Training. Heute \u00FCben wir die Wiederbelebung. Das Schema ist einfach: Pr\u00FCfen, Rufen, Dr\u00FCcken.\n\nTeilnehmer: Was ist der erste Schritt?\n\nTrainer: Pr\u00FCfen Sie die Bewusstlosigkeit: Ansprechen, Anfassen. Wenn keine Reaktion kommt: Laut um Hilfe rufen. Dann den Notruf 112 w\u00E4hlen.\n\nTeilnehmer: Und dann?\n\nTrainer: Dann beginnen Sie mit der Herzdruckmassage. 30 Mal dr\u00FCcken, dann zweimal beatmen. Die Drucktiefe betr\u00E4gt mindestens f\u00FCnf Zentimeter, die Frequenz 100 bis 120 pro Minute.\n\nTeilnehmer: Keine Pause?\n\nTrainer: Minimal. Je l\u00E4nger die Pause, desto schlechter die Durchblutung des Gehirns. Wenn ein AED verf\u00FCgbar ist, holen Sie ihn und schalten Sie ihn ein. Das Ger\u00E4t gibt Ansagen.\n\nTeilnehmer: Wie lange mache ich das?\n\nTrainer: Bis der Rettungsdienst kommt oder der Patient Lebenszeichen zeigt. H\u00F6ren Sie nicht vorher auf.',
   [
    mkq('mcq', 'Welches Schema wird f\u00FCr die Wiederbelebung genannt?', 'Pr\u00FCfen, Rufen, Dr\u00FCcken', ['Dr\u00FCcken, Beatmen, Defibrillieren', 'Pr\u00FCfen, Rufen, Dr\u00FCcken', 'Rufen, Dr\u00FCcken, Beatmen', 'Beatmen, Pr\u00FCfen, Rufen']),
    mkq('true-false', 'Die Herzdruckmassage soll mit einer Frequenz von 100 bis 120 pro Minute durchgef\u00FChrt werden.', 'true'),
    mkq('mcq', 'Welche Drucktiefe wird f\u00FCr die Herzdruckmassage empfohlen?', 'Mindestens f\u00FCnf Zentimeter', ['Zwei bis drei Zentimeter', 'Mindestens f\u00FCnf Zentimeter', 'Sieben bis acht Zentimeter', 'Zehn Zentimeter']),
    mkq('gap-fill', 'Wenn ein ____ verf\u00FCgbar ist, schalten Sie ihn ein.', 'AED', ['Sauerstoff', 'AED', 'Absaugger\u00E4t', 'Monitor'])
   ], 'C1_lesson_20'),

  // 45. Healthcare administration - L21
  l('C1_listen_48', 'Krankenhaus-Controlling: Budgetverhandlung',
   'Controllerin: Guten Morgen, Herr ChefArzt. Wir m\u00FCssen das Budget f\u00FCr das n\u00E4chste Jahr besprechen. Ihre Abteilung hatte im letzten Jahr ein Defizit von 350.000 Euro.\n\nChefarzt: Das ist mir bewusst. Die Fallzahlen sind gestiegen, aber die Verg\u00FCtung ist nicht entsprechend gewachsen.\n\nControllerin: Sie haben eine h\u00F6here Verweildauer als der Landesdurchschnitt. Das k\u00F6nnen wir uns nicht leisten.\n\nChefarzt: Wir haben \u00FCberdurchschnittlich viele multimorbide Patienten. Das kostet Zeit. Ich kann Patienten nicht fr\u00FCher entlassen, nur weil das Budget nicht stimmt.\n\nControllerin: Ich schlage vor: Wir optimieren die Kodierung. Es gibt DRGs, die Sie noch nicht aussch\u00F6pfen. Eine Kodierfachkraft k\u00F6nnte helfen.\n\nChefarzt: Das ist ein guter Ansatz. Ich stimme zu, wenn wir zus\u00E4tzlich \u00FCber eine Case-Management-Stelle nachdenken.\n\nControllerin: Einverstanden. Das verhandeln wir mit der Gesch\u00E4ftsf\u00FChrung.',
   [
    mkq('mcq', 'Wie hoch war das Defizit der Abteilung im letzten Jahr?', '350.000 Euro', ['150.000 Euro', '350.000 Euro', '500.000 Euro', '1 Million Euro']),
    mkq('true-false', 'Die Verweildauer der Patienten liegt \u00FCber dem Landesdurchschnitt.', 'true'),
    mkq('mcq', 'Was schl\u00E4gt die Controllerin zur Budgetoptimierung vor?', 'Optimierung der Kodierung und eine Kodierfachkraft', ['Entlassung von Personal', 'Optimierung der Kodierung und eine Kodierfachkraft', 'Schlie\u00DFung von Betten', 'Reduzierung der Operationen']),
    mkq('gap-fill', 'Der Chefarzt w\u00FCnscht sich zus\u00E4tzlich eine ____-Stelle.', 'Case-Management', ['Controlling', 'Case-Management', 'Pflege', 'Verwaltung'])
   ], 'C1_lesson_21'),

  // 46. Tropical medicine lecture - L22
  l('C1_listen_49', 'Vorlesung: Tropenmedizin',
   'Professor: Guten Morgen. Heute sprechen wir \u00FCber importierte Infektionskrankheiten. Nach der Pandemie hat die Reiset\u00E4tigkeit wieder zugenommen, und damit auch die Zahl der Tropenerkrankungen.\n\nStudent: Welche Erkrankungen sehen wir am h\u00E4ufigsten?\n\nProfessor: Malaria ist nach wie vor die h\u00E4ufigste importierte Tropenkrankheit. Dengue-Fieber nimmt stark zu. Auch Typhus und Hepatitis kommen regelm\u00E4\u00DFig vor.\n\nStudentin: Wie sieht die Diagnostik aus?\n\nProfessor: Drei Dinge sind entscheidend: die Reiseanamnese, die Inkubationszeit und die typischen Symptome. Bei Malaria: Fieber, Sch\u00FCttelfrost und Thrombozytopenie. Ein dicker Tropfen und ein Schnelltest best\u00E4tigen die Diagnose.\n\nStudent: Was ist mit der Chemoprophylaxe?\n\nProfessor: F\u00FCr Malariagebiete empfehlen wir Atovaquon-Proguanil oder Doxycyclin. Aber die wichtigste Ma\u00DFnahme ist der M\u00FCckenschutz. Impfungen sind f\u00FCr bestimmte L\u00E4nder obligatorisch, wie Gelbfieber.',
   [
    mkq('mcq', 'Welches ist die h\u00E4ufigste importierte Tropenkrankheit?', 'Malaria', ['Dengue-Fieber', 'Malaria', 'Typhus', 'Hepatitis']),
    mkq('true-false', 'Der dicke Tropfen und ein Schnelltest best\u00E4tigen die Malaria-Diagnose.', 'true'),
    mkq('mcq', 'Welche drei Dinge sind f\u00FCr die Diagnostik entscheidend?', 'Reiseanamnese, Inkubationszeit und typische Symptome', ['Fieber, Sch\u00FCttelfrost und Thrombozytopenie', 'Reiseanamnese, Inkubationszeit und typische Symptome', 'Blutbild, Urinstatus und R\u00F6ntgen', 'PCR, Kultur und Serologie']),
    mkq('gap-fill', 'Die wichtigste Ma\u00DFnahme gegen Malaria ist der ____.', 'M\u00FCckenschutz', ['Impfschutz', 'M\u00FCckenschutz', 'Chemoprophylaxe', 'Reiseverzicht'])
   ], 'C1_lesson_22'),

  // 47. Palliative sedation discussion - L23
  l('C1_listen_50', 'Ethische Fallbesprechung: Palliative Sedierung',
   'Ober\u00E4rztin: Wir besprechen heute den Fall von Frau Kaiser, 68 Jahre, mit terminalem Ovarialkarzinom. Die Symptome sind trotz maximaler palliativer Therapie nicht kontrollierbar. Wir erw\u00E4gen eine palliative Sedierung.\n\nAngeh\u00F6riger: Mein Verst\u00E4ndnis: Meine Mutter soll k\u00FCnstlich in den Schlaf versetzt werden?\n\nOber\u00E4rztin: Ja, aber nicht als T\u00F6tung. Es geht darum, unertr\u00E4gliches Leiden zu lindern. Die Sedierung wird so dosiert, dass Ihre Mutter keine Schmerzen und keine Atemnot mehr sp\u00FCrt.\n\nAngeh\u00F6riger: Wacht sie wieder auf?\n\nOber\u00E4rztin: Wenn wir die Sedierung reduzieren, kann sie aufwachen. Aber in dieser Situation rechnen wir damit, dass sie nicht mehr aufwachen wird. Die Sedierung ist eine M\u00F6glichkeit, einen w\u00FCrdevollen Tod zu erm\u00F6glichen.\n\nAngeh\u00F6riger: D\u00FCrfen wir dabei sein?\n\nOber\u00E4rztin: Selbstverst\u00E4ndlich. Wir begleiten Sie und Ihre Familie durch diesen Prozess. Wir sind immer f\u00FCr Sie da.',
   [
    mkq('mcq', 'Warum wird eine palliative Sedierung erwogen?', 'Weil Symptome trotz maximaler palliativer Therapie nicht kontrollierbar sind', ['Weil der Patient nicht mehr leben m\u00F6chte', 'Weil Symptome trotz maximaler palliativer Therapie nicht kontrollierbar sind', 'Weil die Krankenkasse keine weitere Behandlung bezahlt', 'Weil die \u00C4rzte keine Therapie mehr durchf\u00FChren wollen']),
    mkq('true-false', 'Die palliative Sedierung zielt darauf ab, den Patienten zu t\u00F6ten.', 'false'),
    mkq('mcq', 'Was wird durch die palliative Sedierung erreicht?', 'Lindern von Schmerzen und Atemnot', ['Heilung der Krankheit', 'Lindern von Schmerzen und Atemnot', 'Verl\u00E4ngerung des Lebens', 'Aktive Sterbehilfe']),
    mkq('true-false', 'Die Angeh\u00F6rigen d\u00FCrfen w\u00E4hrend der Sedierung nicht dabei sein.', 'false')
   ], 'C1_lesson_23'),
];

c1.push(...batch2b);
data.C1 = c1;
fs.writeFileSync('listening.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2B done: added C1_listen_44 to C1_listen_50');
console.log('C1 count now:', data.C1.length);
