import fs from 'fs';
import { createRequire } from 'module';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
let c1 = data.C1 || [];

// Track max question ID
let maxQid = c1.reduce((m, v) => v.questions.reduce((m2, q) => {
  const n = parseInt(q.id.replace(/[^\d]/g, ''), 10);
  return Math.max(m2, n);
}, m), 0);

function nextQid() { maxQid++; return 'qr' + maxQid; }

// Count existing per lesson
const counts = {};
c1.forEach(v => { counts[v.lessonId] = (counts[v.lessonId] || 0) + 1; });

// Lesson distribution target: all 25 lessons, roughly 2 each
// Currently used: L1(1), L2(1), L3(2), L4(1), L5(1), L6(1), L7(1), L8(1), L9(1), L10(1), L11(2)
// Unused: L12-L25 (14 lessons)
// Need to assign 37 passages across 25 lessons

const lessonPool = [];
for (let i = 1; i <= 25; i++) {
  const key = 'C1_lesson_' + i;
  const existing = counts[key] || 0;
  // Fill up to 2 per lesson
  for (let j = existing; j < 2; j++) lessonPool.push(key);
}
// Add any remaining passages distributed evenly
while (lessonPool.length < 37) {
  for (let i = 1; i <= 25 && lessonPool.length < 37; i++) {
    lessonPool.push('C1_lesson_' + i);
  }
}

// Shuffle the pool for even distribution (but keep it deterministic)
// Actually, let's assign sequentially by topic

// Map 37 topics to lessons, ensuring all 25 covered
const topicLessons = [
  // New topics mapped to fill unused lessons first, then balance
  'C1_lesson_12', // Scientific uncertainty and clinical decision-making
  'C1_lesson_13', // Informed consent in complex procedures
  'C1_lesson_14', // AI-assisted diagnostics
  'C1_lesson_15', // Clinical trial ethics
  'C1_lesson_16', // Resource allocation in hospitals
  'C1_lesson_17', // Intercultural communication in care
  'C1_lesson_18', // Medical error disclosure
  'C1_lesson_19', // End-of-life decision-making
  'C1_lesson_20', // Antibiotic stewardship
  'C1_lesson_21', // Chronic disease management
  // Sub-batch 2B: L12-L21 already covered, now use remaining + balance
  'C1_lesson_22', // Rehabilitation after orthopedic surgery
  'C1_lesson_23', // Doctor-patient trust
  'C1_lesson_24', // Burnout among physicians
  'C1_lesson_25', // Health economics
  'C1_lesson_1',  // Organ transplantation (back to L1 for balance)
  'C1_lesson_2',  // Genomic medicine
  'C1_lesson_3',  // Personalized medicine
  'C1_lesson_4',  // Medical professionalism
  'C1_lesson_5',  // Communication with relatives
  'C1_lesson_6',  // Digital health literacy
  // Sub-batch 2C
  'C1_lesson_7',  // Public health communication
  'C1_lesson_8',  // Pandemic preparedness
  'C1_lesson_9',  // Quality management in hospitals
  'C1_lesson_10', // Academic peer review
  'C1_lesson_11', // Research integrity
  'C1_lesson_12', // Conflicts of interest
  'C1_lesson_13', // Medical education reform
  'C1_lesson_14', // Evidence hierarchies
  'C1_lesson_15', // Patient-reported outcomes
  'C1_lesson_16', // Ethics of screening programs
  // Sub-batch 2D
  'C1_lesson_17', // Multimorbidity in aging patients
  'C1_lesson_18', // Shared decision-making
  'C1_lesson_19', // Pain management
  'C1_lesson_20', // Surgical risk communication
  'C1_lesson_21', // Data protection in clinical research
  'C1_lesson_22', // Cross-sector care coordination
  'C1_lesson_23', // FSP-relevant hospital documentation
];

// ===================== PASSAGE DEFINITIONS =====================

function p(id, title, text, questions, lessonId) {
  return { id, title, text, questions, level: "C1", lessonId };
}

function q(qid, type, question, answer, opts) {
  const o = { id: qid(), type, question };
  if (type === 'mcq' || type === 'gap-fill' || type === 'opinion-match') o.options = opts;
  if (type === 'true-false') o.answer = answer;
  else o.answer = answer;
  // Add explanation for true-false questions
  return o;
}

// Sub-batch 2A: C1_read_14 to C1_read_23
const batch2a = [
  p('C1_read_14', 'Wissenschaftliche Unsicherheit in der klinischen Entscheidungsfindung',
   'Medizinische Entscheidungen sind häufig mit Unsicherheit behaftet, da diagnostische Verfahren nicht immer eindeutige Ergebnisse liefern und Therapieerfolge nicht garantiert werden können. Diese Unsicherheit zu kommunizieren, ohne das Vertrauen des Patienten zu verlieren, ist eine besondere ärztliche Herausforderung. In der klinischen Praxis zeigt sich, dass Ärzte dazu neigen, Unsicherheiten zu verschleiern, um Sicherheit zu suggerieren. Dabei kann eine ehrliche Kommunikation der Unsicherheit das Vertrauensverhältnis sogar stärken. Die Entwicklung von Entscheidungsalgorithmen und Risikomodellen kann helfen, Unsicherheiten besser zu quantifizieren und in die Behandlungsplanung einzubeziehen.',
   [
     q(nextQid, 'mcq', 'Was ist eine besondere Herausforderung bei der Kommunikation medizinischer Unsicherheit?', 'Das Vertrauen des Patienten nicht zu verlieren', ['Die Behandlungskosten zu senken', 'Das Vertrauen des Patienten nicht zu verlieren', 'Die Wartezeiten zu verkürzen', 'Die Medikamentendosis zu erhöhen']),
     q(nextQid, 'true-false', 'Ärzte neigen dazu, Unsicherheiten in der Praxis offen zu thematisieren.', 'false'),
     q(nextQid, 'mcq', 'Was kann helfen, Unsicherheiten in der Behandlungsplanung besser zu berücksichtigen?', 'Entscheidungsalgorithmen und Risikomodelle', ['Mehr Medikamentenstudien', 'Entscheidungsalgorithmen und Risikomodelle', 'Längere Krankenhausaufenthalte', 'Mehr Facharzttermine']),
     q(nextQid, 'gap-fill', 'Eine ehrliche Kommunikation der ____ kann das Vertrauensverhältnis stärken.', 'Unsicherheit', ['Sicherheit', 'Unsicherheit', 'Diagnose', 'Prognose'])
   ], topicLessons[0]),
  
  p('C1_read_15', 'Informierte Einwilligung bei komplexen Eingriffen',
   'Die Aufklärung eines Patienten vor einem operativen Eingriff ist nicht nur eine rechtliche Verpflichtung, sondern auch ein zentraler Bestandteil der medizinischen Ethik. Bei komplexen Operationen wie Organtransplantationen oder onkologischen Eingriffen wird die informierte Einwilligung zur besonderen Herausforderung. Der Patient muss nicht nur über die unmittelbaren Operationsrisiken aufgeklärt werden, sondern auch über langfristige Folgen, alternative Behandlungsmöglichkeiten und die Erfolgsaussichten. Studien zeigen, dass Patienten häufig nicht alle Informationen behalten oder verstehen, die ihnen im Aufklärungsgespräch vermittelt werden. Daher gewinnen strukturierte Aufklärungsbögen und ergänzende digitale Informationsmaterialien an Bedeutung, um die Einwilligungsfähigkeit der Patienten zu stärken.',
   [
     q(nextQid, 'mcq', 'Worüber muss ein Patient bei komplexen Eingriffen aufgeklärt werden?', 'Über unmittelbare Risiken, langfristige Folgen und Alternativen', ['Nur über die Operationsrisiken', 'Über unmittelbare Risiken, langfristige Folgen und Alternativen', 'Nur über die Kosten der Behandlung', 'Nur über die Erfolgsaussichten']),
     q(nextQid, 'true-false', 'Patienten behalten und verstehen in der Regel alle Informationen aus dem Aufklärungsgespräch.', 'false'),
     q(nextQid, 'mcq', 'Welche Hilfsmittel gewinnen für die Aufklärung an Bedeutung?', 'Strukturierte Aufklärungsbögen und digitale Informationsmaterialien', ['Mehr Zeit für Aufklärungsgespräche', 'Strukturierte Aufklärungsbögen und digitale Informationsmaterialien', 'Rechtliche Beratung durch Anwälte', 'Kürzere Aufklärungszeiten']),
     q(nextQid, 'gap-fill', 'Die Aufklärung vor einem Eingriff ist eine rechtliche ____ und ein ethisches Gebot.', 'Verpflichtung', ['Empfehlung', 'Verpflichtung', 'Option', 'Möglichkeit'])
   ], topicLessons[1]),
  
  p('C1_read_16', 'Künstliche Intelligenz in der medizinischen Diagnostik',
   'Künstliche Intelligenz hält zunehmend Einzug in die medizinische Diagnostik. Algorithmen des maschinellen Lernens erreichen in der Bildgebung, etwa bei der Erkennung von Tumoren in radiologischen Aufnahmen oder bei der Analyse histologischer Präparate, mittlerweile eine Treffsicherheit, die mit erfahrenen Fachärzten vergleichbar ist. Dennoch bleibt der Einsatz von KI in der klinischen Praxis umstritten. Kritische Stimmen verweisen auf die mangelnde Transparenz der Entscheidungsprozesse vieler Algorithmen und die Gefahr von Verzerrungen durch unzureichende Trainingsdaten. Zudem stellt sich die Haftungsfrage: Wer trägt die Verantwortung, wenn eine KI-basierte Diagnose falsch ist? Eine verantwortungsvolle Integration der KI in den klinischen Alltag erfordert daher klare rechtliche Rahmenbedingungen und eine kritische ärztliche Prüfung der Ergebnisse.',
   [
     q(nextQid, 'mcq', 'In welchem Bereich erreicht KI eine mit Fachärzten vergleichbare Treffsicherheit?', 'In der Bildgebung und Erkennung von Tumoren', ['In der Patientenkommunikation', 'In der Bildgebung und Erkennung von Tumoren', 'In der operativen Durchführung', 'In der Medikamentenentwicklung']),
     q(nextQid, 'true-false', 'Die Entscheidungsprozesse von KI-Algorithmen sind vollständig transparent.', 'false'),
     q(nextQid, 'mcq', 'Welche Frage stellt sich bei KI-basierten Diagnosen?', 'Die Haftungsfrage bei falschen Diagnosen', ['Die Kostenfrage der Technologie', 'Die Haftungsfrage bei falschen Diagnosen', 'Die Frage nach der Akzeptanz bei Patienten', 'Die Frage nach der Ausbildungsdauer']),
     q(nextQid, 'gap-fill', 'Eine verantwortungsvolle KI-Integration erfordert eine kritische ____ Prüfung der Ergebnisse.', 'ärztliche', ['technische', 'ärztliche', 'rechtliche', 'ethische'])
   ], topicLessons[2]),
  
  p('C1_read_17', 'Ethik klinischer Studien und Probandenschutz',
   'Die Durchführung klinischer Studien ist an strenge ethische Standards gebunden, die aus den historischen Lehren medizinischer Verbrechen während des Nationalsozialismus hervorgegangen sind. Der Helsinki-Deklaration des Weltärztebundes zufolge steht das Wohl des Probanden über den Interessen der Wissenschaft und Gesellschaft. Besonders sensibel ist die Forschung mit vulnerablen Gruppen wie Kindern, Schwangeren oder kognitiv eingeschränkten Personen. Hier bedarf es zusätzlicher Schutzmaßnahmen und einer besonderen ethischen Rechtfertigung. Unabhängige Ethikkommissionen prüfen Studienprotokolle vor Beginn und überwachen die Einhaltung ethischer Grundsätze während der Durchführung. Trotz dieser Sicherungen kommt es immer wieder zu Fehlverhalten, etwa durch selektive Berichterstattung oder unzureichende Risikoaufklärung.',
   [
     q(nextQid, 'mcq', 'Welche Deklaration legt die ethischen Standards für klinische Studien fest?', 'Die Helsinki-Deklaration', ['Die Genfer Deklaration', 'Die Helsinki-Deklaration', 'Die Tokio-Deklaration', 'Die Lissabon-Deklaration']),
     q(nextQid, 'mcq', 'Welche Personengruppen gelten als besonders vulnerabel in der Forschung?', 'Kinder, Schwangere und kognitiv eingeschränkte Personen', ['Chirurgen und Anästhesisten', 'Kinder, Schwangere und kognitiv eingeschränkte Personen', 'Erwachsene Männer', 'Privatversicherte Patienten']),
     q(nextQid, 'true-false', 'Ethikkommissionen prüfen Studienprotokolle ausschließlich vor Beginn der Studie.', 'false'),
     q(nextQid, 'gap-fill', 'Das Wohl des ____ steht über den Interessen der Wissenschaft.', 'Probanden', ['Arztes', 'Probanden', 'Forschers', 'Sponsors'])
   ], topicLessons[3]),
  
  p('C1_read_18', 'Ressourcenallokation im Krankenhausalltag',
   'Die Verteilung knapper medizinischer Ressourcen stellt Kliniken täglich vor ethische und organisatorische Herausforderungen. Bettenkapazitäten, OP-Zeiten, Geräte und nicht zuletzt das Personal sind begrenzt. In Zeiten der Personalknappheit müssen Priorisierungsentscheidungen getroffen werden, die unter Umständen über Leben und Qualität der Behandlung entscheiden. Die medizinische Ethik unterscheidet zwischen verschiedenen Verteilungsprinzipien: dem Bedarfsprinzip, dem Nutzenprinzip und dem Dringlichkeitsprinzip. In der Triage-Situation, etwa in der Notaufnahme, kommt das Dringlichkeitsprinzip zur Anwendung, bei dem die Schwere der Erkrankung und die Behandlungsdringlichkeit ausschlaggebend sind. Transparente und nachvollziehbare Entscheidungskriterien sind essenziell, um das Vertrauen der Patienten und der Öffentlichkeit in die Fairness der Ressourcenverteilung zu erhalten.',
   [
     q(nextQid, 'mcq', 'Welches Verteilungsprinzip kommt in der Triage-Situation zur Anwendung?', 'Das Dringlichkeitsprinzip', ['Das Bedarfsprinzip', 'Das Nutzenprinzip', 'Das Dringlichkeitsprinzip', 'Das Gleichheitsprinzip']),
     q(nextQid, 'true-false', 'Die Verteilung medizinischer Ressourcen ist ausschließlich eine organisatorische, keine ethische Frage.', 'false'),
     q(nextQid, 'mcq', 'Was ist für das Vertrauen in die Ressourcenverteilung essenziell?', 'Transparente und nachvollziehbare Entscheidungskriterien', ['Schnelle Entscheidungen ohne Diskussion', 'Transparente und nachvollziehbare Entscheidungskriterien', 'Mehr finanzielle Mittel', 'Automatische Zuteilungssysteme']),
     q(nextQid, 'gap-fill', 'In der ____-Situation ist die Schwere der Erkrankung ausschlaggebend.', 'Triage', ['Aufklärungs', 'Triage', 'Dokumentations', 'Evaluations'])
   ], topicLessons[4]),
  
  p('C1_read_19', 'Interkulturelle Kommunikation in der medizinischen Versorgung',
   'In einer zunehmend multikulturellen Gesellschaft sind Ärzte täglich mit Patienten aus unterschiedlichen kulturellen Kontexten konfrontiert. Kulturelle Unterschiede betreffen nicht nur die Sprache, sondern auch das Krankheitsverständnis, die Erwartungen an die medizinische Versorgung und die Rolle der Familie in Entscheidungsprozessen. In manchen Kulturen ist die Einbeziehung der gesamten Familie in die Diagnosemitteilung üblich, während das deutsche Modell der Patientenautonomie eine persönliche Aufklärung vorsieht. Interkulturelle Kompetenz bedeutet daher nicht, jede kulturelle Besonderheit zu kennen, sondern eine grundsätzliche Sensibilität für kulturelle Unterschiede zu entwickeln und diese im Gespräch zu thematisieren. Sprachmittler und interkulturelle Trainings können die Verständigung erleichtern, ersetzen jedoch nicht die ärztliche Gesprächsführungskompetenz.',
   [
     q(nextQid, 'mcq', 'Welche kulturellen Unterschiede sind in der medizinischen Versorgung relevant?', 'Krankheitsverständnis, Erwartungen und Rolle der Familie', ['Nur die Sprache', 'Nur die Essgewohnheiten', 'Krankheitsverständnis, Erwartungen und Rolle der Familie', 'Nur die Religion']),
     q(nextQid, 'true-false', 'Interkulturelle Kompetenz erfordert, jede kulturelle Besonderheit im Detail zu kennen.', 'false'),
     q(nextQid, 'mcq', 'Was kann die Verständigung mit Patienten aus anderen Kulturen erleichtern?', 'Sprachmittler und interkulturelle Trainings', ['Automatische Übersetzungsprogramme', 'Sprachmittler und interkulturelle Trainings', 'Kürzere Gesprächszeiten', 'Schriftliche Aufklärung in mehreren Sprachen']),
     q(nextQid, 'gap-fill', 'Die Sensibilität für kulturelle ____ sollte im ärztlichen Gespräch thematisiert werden.', 'Unterschiede', ['Konflikte', 'Unterschiede', 'Traditionen', 'Normen'])
   ], topicLessons[5]),
  
  p('C1_read_20', 'Offenlegung medizinischer Behandlungsfehler',
   'Der Umgang mit Behandlungsfehlern gehört zu den schwierigsten Situationen im ärztlichen Berufsalltag. Lange Zeit herrschte die Praxis vor, Fehler zu verschweigen oder zu beschönigen, aus Angst vor rechtlichen Konsequenzen und Imageschäden. In den letzten Jahren hat ein Umdenken stattgefunden: Immer mehr medizinische Fachgesellschaften empfehlen eine offene Fehlerkommunikation gegenüber den betroffenen Patienten. Studien belegen, dass eine ehrliche und empathische Fehlermitteilung das Vertrauensverhältnis nicht zwangsläufig beschädigt, sondern im Gegenteil oft stabilisiert. Patienten erwarten in erster Linie eine aufrichtige Entschuldigung und eine Erklärung, wie der Fehler passieren konnte. Rechtliche Rahmenbedingungen wie das Patientenrechtegesetz von 2013 haben die Position der Patienten gestärkt und die Transparenzpflichten der Behandler konkretisiert.',
   [
     q(nextQid, 'mcq', 'Welche Praxis herrschte lange Zeit im Umgang mit Behandlungsfehlern vor?', 'Fehler zu verschweigen oder zu beschönigen', ['Fehler offen zu kommunizieren', 'Fehler zu verschweigen oder zu beschönigen', 'Fehler zu bestrafen', 'Fehler zu dokumentieren']),
     q(nextQid, 'true-false', 'Eine offene Fehlermitteilung beschädigt das Vertrauensverhältnis in der Regel nachhaltig.', 'false'),
     q(nextQid, 'mcq', 'Was erwarten Patienten in erster Linie bei einem Behandlungsfehler?', 'Eine aufrichtige Entschuldigung und eine Erklärung', ['Eine finanzielle Entschädigung', 'Eine aufrichtige Entschuldigung und eine Erklärung', 'Eine strafrechtliche Verfolgung des Arztes', 'Eine Überweisung an einen Spezialisten']),
     q(nextQid, 'gap-fill', 'Das ____ von 2013 hat die Transparenzpflichten der Behandler konkretisiert.', 'Patientenrechtegesetz', ['Krankenhausfinanzierungsgesetz', 'Patientenrechtegesetz', 'Arzneimittelgesetz', 'Sozialgesetzbuch'])
   ], topicLessons[6]),
  
  p('C1_read_21', 'Entscheidungen am Lebensende und Patientenverfügung',
   'Die medizinische Behandlung am Lebensende wirft komplexe ethische Fragen auf. Im Mittelpunkt steht das Spannungsfeld zwischen der ärztlichen Pflicht, Leben zu erhalten, und der Verpflichtung, unnötiges Leiden zu vermeiden. Patientenverfügungen sollen sicherstellen, dass der Wille des Patienten auch dann respektiert wird, wenn dieser nicht mehr einwilligungsfähig ist. Allerdings zeigt die Praxis, dass Patientenverfügungen oft zu vage formuliert sind, um in konkreten Behandlungssituationen eine eindeutige Entscheidung zu ermöglichen. Die gesetzliche Regelung von 2009 hat die Verbindlichkeit der Patientenverfügung gestärkt, verlangt aber zugleich, dass die behandelnden Ärzte prüfen, ob die Verfügung auf die aktuelle Lebens- und Behandlungssituation zutrifft. Advance Care Planning, die vorausschauende Behandlungsplanung im Gespräch mit dem Patienten, soll diese Lücke schließen.',
   [
     q(nextQid, 'mcq', 'Welches Spannungsfeld prägt die medizinische Behandlung am Lebensende?', 'Leben erhalten versus Leiden vermeiden', ['Kosten senken versus Leben verlängern', 'Leben erhalten versus Leiden vermeiden', 'Ärztliche Freiheit versus Patientenwille', 'Kurative versus palliative Behandlung']),
     q(nextQid, 'true-false', 'Patientenverfügungen sind meist präzise genug für eindeutige Entscheidungen in konkreten Situationen.', 'false'),
     q(nextQid, 'mcq', 'Was soll die Lücke schließen, die Patientenverfügungen hinterlassen?', 'Advance Care Planning als vorausschauende Behandlungsplanung', ['Eine gesetzliche Neuregelung', 'Advance Care Planning als vorausschauende Behandlungsplanung', 'Ein standardisiertes Formular', 'Eine richterliche Entscheidung']),
     q(nextQid, 'gap-fill', 'Die ____ der Patientenverfügung wurde durch die gesetzliche Regelung von 2009 gestärkt.', 'Verbindlichkeit', ['Verfügbarkeit', 'Verbindlichkeit', 'Flexibilität', 'Lesbarkeit'])
   ], topicLessons[7]),
  
  p('C1_read_22', 'Antibiotikaresistenzen und rationale Antibiotikatherapie',
   'Die zunehmende Verbreitung antibiotikaresistenter Erreger stellt eine der größten Herausforderungen der modernen Medizin dar. Ursächlich sind vor allem der übermäßige und unsachgemäße Einsatz von Antibiotika in der Human- und Tiermedizin. Antibiotic Stewardship-Programme zielen darauf ab, den verantwortungsvollen Umgang mit Antibiotika zu fördern. Dazu gehören die Indikationsstellung vor jeder Verordnung, die Wahl des geeigneten Wirkstoffs, die richtige Dosierung und Therapiedauer sowie die regelmäßige Überprüfung der Therapie anhand mikrobiologischer Befunde. In deutschen Krankenhäusern sind ABS-Teams aus Infektiologen, klinischen Pharmazeuten und Mikrobiologen etabliert worden, um die rationale Antibiotikatherapie zu unterstützen. Der Erfolg dieser Maßnahmen hängt maßgeblich von der interdisziplinären Zusammenarbeit und der Compliance der behandelnden Ärzte ab.',
   [
     q(nextQid, 'mcq', 'Was ist die Hauptursache für die Verbreitung antibiotikaresistenter Erreger?', 'Übermäßiger und unsachgemäßer Einsatz von Antibiotika', ['Natürliche Evolution der Bakterien', 'Übermäßiger und unsachgemäßer Einsatz von Antibiotika', 'Unzureichende Krankenhaushygiene', 'Fehlende Impfungen']),
     q(nextQid, 'true-false', 'Antibiotic Stewardship-Programme fördern den unkontrollierten Einsatz von Antibiotika.', 'false'),
     q(nextQid, 'mcq', 'Welche Fachrichtungen sind in ABS-Teams vertreten?', 'Infektiologen, klinische Pharmazeuten und Mikrobiologen', ['Chirurgen und Anästhesisten', 'Infektiologen, klinische Pharmazeuten und Mikrobiologen', 'Radiologen und Pathologen', 'Hausärzte und Internisten']),
     q(nextQid, 'gap-fill', 'Der Erfolg von ABS-Maßnahmen hängt von der interdisziplinären ____ ab.', 'Zusammenarbeit', ['Forschung', 'Zusammenarbeit', 'Finanzierung', 'Dokumentation'])
   ], topicLessons[8]),
  
  p('C1_read_23', 'Chronisches Krankheitsmanagement und Patientenschulung',
   'Die Behandlung chronischer Erkrankungen wie Diabetes mellitus, Hypertonie oder COPD erfordert ein Umdenken im ärztlichen Behandlungsverständnis. Anders als bei akuten Erkrankungen steht nicht die einmalige Heilung im Vordergrund, sondern das langfristige Krankheitsmanagement. Der Patient wird dabei vom passiven Behandlungsempfänger zum aktiven Partner in der Therapie. Chronisch kranke Patienten verbringen nur einen Bruchteil ihrer Zeit in ärztlicher Behandlung, den Großteil ihres Krankheitsalltags müssen sie eigenverantwortlich bewältigen. Strukturierte Schulungsprogramme, die Wissen über die Erkrankung, praktische Fertigkeiten und psychosoziale Unterstützung vermitteln, haben sich als wirksam erwiesen. Die Herausforderung besteht darin, Patienten zur Selbstmanagement-Kompetenz zu befähigen, ohne sie mit der Verantwortung zu überfordern.',
   [
     q(nextQid, 'mcq', 'Was steht bei der Behandlung chronischer Erkrankungen im Vordergrund?', 'Das langfristige Krankheitsmanagement', ['Die einmalige Heilung', 'Das langfristige Krankheitsmanagement', 'Die operative Behandlung', 'Die stationäre Aufnahme']),
     q(nextQid, 'true-false', 'Chronisch kranke Patienten verbringen den Großteil ihrer Zeit in ärztlicher Behandlung.', 'false'),
     q(nextQid, 'mcq', 'Was vermitteln strukturierte Schulungsprogramme für chronisch Kranke?', 'Wissen, praktische Fertigkeiten und psychosoziale Unterstützung', ['Nur medizinisches Wissen', 'Wissen, praktische Fertigkeiten und psychosoziale Unterstützung', 'Ausschließlich Ernährungsberatung', 'Nur Bewegungsprogramme']),
     q(nextQid, 'gap-fill', 'Der Patient wird vom passiven Empfänger zum aktiven ____ in der Therapie.', 'Partner', ['Patienten', 'Partner', 'Beobachter', 'Zahler'])
   ], topicLessons[9]),
];

// Write sub-batch 2A
c1.push(...batch2a);
data.C1 = c1;
fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2A done: added C1_read_14 to C1_read_23');
console.log('C1 count now:', data.C1.length);
