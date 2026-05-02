import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
let c1 = data.C1 || [];

let maxQid = c1.reduce((m, v) => v.questions.reduce((m2, q) => {
  const n = parseInt(q.id.replace(/[^\d]/g, ''), 10);
  return Math.max(m2, n);
}, m), 0);

function nextQid() { maxQid++; return 'qr' + maxQid; }

function q(qid, type, question, answer, opts) {
  const o = { id: qid(), type, question };
  if (type === 'mcq' || type === 'gap-fill' || type === 'opinion-match') o.options = opts;
  o.answer = answer;
  return o;
}

function p(id, title, text, questions, lessonId) {
  return { id, title, text, questions, level: "C1", lessonId };
}

const batch2d = [
  // L17: Multimorbidität bei alternden Patienten
  p('C1_read_44', 'Multimorbidität und Komplexität in der Geriatrie',
   'Die Behandlung multimorbider älterer Patienten stellt eine der größten Herausforderungen der modernen Medizin dar. Multimorbidität, das gleichzeitige Vorliegen mehrerer chronischer Erkrankungen, erfordert eine umfassende Betrachtung des Patienten, die über die einzelne Erkrankung hinausgeht. Leitlinien sind meist für einzelne Krankheitsbilder entwickelt und können bei multimorbiden Patienten zu problematischen Wechselwirkungen und Polypharmazie führen. Ein ganzheitlicher Behandlungsansatz, der die Prioritäten und Lebensziele des Patienten in den Mittelpunkt stellt, ist daher erforderlich. Das geriatrische Assessment mit seiner standardisierten Erfassung von Mobilität, Kognition, Ernährung und sozialer Situation hat sich als wertvolles Instrument erwiesen. Eine enge Zusammenarbeit zwischen Hausärzten, Fachärzten, Pflegekräften und Therapeuten ist für die Versorgung dieser Patientengruppe unverzichtbar.',
   [
     q(nextQid, 'mcq', 'Was versteht man unter Multimorbidität?', 'Das gleichzeitige Vorliegen mehrerer chronischer Erkrankungen', ['Das Vorliegen einer schweren Erkrankung', 'Das gleichzeitige Vorliegen mehrerer chronischer Erkrankungen', ['Die akute Verschlechterung einer Erkrankung', 'Die vollständige Heilung einer Erkrankung']]),
     q(nextQid, 'true-false', 'Leitlinien sind in der Regel für multimorbide Patienten gut geeignet.', 'false'),
     q(nextQid, 'mcq', 'Welches Instrument hat sich in der Geriatrie als wertvoll erwiesen?', 'Das geriatrische Assessment', ['Das EKG', 'Das geriatrische Assessment', ['Die Magnetresonanztomographie', 'Der Blutdruckmessung']]),
     q(nextQid, 'gap-fill', 'Multimorbidität kann zu problematischer ____ führen.', 'Polypharmazie', ['Monotherapie', 'Polypharmazie', 'Überdosierung', 'Unterversorgung'])
   ], 'C1_lesson_17'),

  // L18: Partizipative Entscheidungsfindung
  p('C1_read_45', 'Shared Decision Making in der klinischen Praxis',
   'Das Konzept der partizipativen Entscheidungsfindung hat sich in den letzten Jahrzehnten als Ideal medizinischer Entscheidungsprozesse etabliert. Anders als das rein informierte Modell, bei dem der Arzt Informationen liefert und der Patient allein entscheidet, oder das paternalistische Modell, bei dem der Arzt die Entscheidung trifft, zielt Shared Decision Making auf einen gemeinsamen Entscheidungsprozess ab. Arzt und Patient tauschen Informationen aus, diskutieren Behandlungsoptionen und deren Konsequenzen und gelangen gemeinsam zu einer Entscheidung. Die Umsetzung scheitert in der Praxis oft an Zeitmangel und unzureichender Gesprächsführungskompetenz. Entscheidungshilfen, die Patienten über Behandlungsoptionen informieren, können den Prozess unterstützen. Studien zeigen, dass Shared Decision Making die Patientenzufriedenheit erhöht und zu besseren Behandlungsergebnissen führt.',
   [
     q(nextQid, 'mcq', 'Wodurch zeichnet sich Shared Decision Making aus?', 'Durch einen gemeinsamen Entscheidungsprozess von Arzt und Patient', ['Durch die alleinige Entscheidung des Arztes', 'Durch einen gemeinsamen Entscheidungsprozess von Arzt und Patient', ['Durch die alleinige Entscheidung des Patienten', 'Durch die Entscheidung der Angehörigen']]),
     q(nextQid, 'true-false', 'Die Umsetzung von Shared Decision Making scheitert oft an Zeitmangel.', 'true'),
     q(nextQid, 'mcq', 'Welche Hilfsmittel können den Entscheidungsprozess unterstützen?', 'Entscheidungshilfen für Patienten', ['Medikamentenverordnung', 'Entscheidungshilfen für Patienten', ['Chirurgische Eingriffe', 'Krankenhauseinweisungen']]),
     q(nextQid, 'gap-fill', 'Shared Decision Making erhöht die ____ der Patienten.', 'Zufriedenheit', ['Abhängigkeit', 'Zufriedenheit', 'Behandlungsdauer', 'Kosten'])
   ], 'C1_lesson_18'),

  // L19: Schmerztherapie
  p('C1_read_46', 'Multimodale Schmerztherapie bei chronischen Schmerzen',
   'Die Behandlung chronischer Schmerzen erfordert einen multimodalen Ansatz, der über die reine Medikamentengabe hinausgeht. Chronische Schmerzen sind ein komplexes Phänomen, bei dem biologische, psychologische und soziale Faktoren zusammenwirken. Das biopsychosoziale Modell bildet die Grundlage der modernen Schmerzmedizin. Die multimodale Schmerztherapie kombiniert medikamentöse Behandlung mit physiotherapeutischen Maßnahmen, psychotherapeutischer Begleitung und Edukation des Patienten. Ein zentrales Element ist die Aktivierung des Patienten zur eigenverantwortlichen Schmerzbewältigung. In Deutschland haben spezialisierte Schmerzzentren und Schmerztageskliniken die Versorgungsstruktur verbessert. Dennoch bleibt die flächendeckende Versorgung von Schmerzpatienten eine Herausforderung, insbesondere im ländlichen Raum. Die Weiterbildung zum speziellen Schmerztherapeuten ermöglicht eine qualifizierte Versorgung.',
   [
     q(nextQid, 'mcq', 'Welches Modell bildet die Grundlage der modernen Schmerzmedizin?', 'Das biopsychosoziale Modell', ['Das biomedizinische Modell', 'Das biopsychosoziale Modell', ['Das psychosoziale Modell', 'Das kognitive Modell']]),
     q(nextQid, 'true-false', 'Chronische Schmerzen sind ein rein biologisches Phänomen.', 'false'),
     q(nextQid, 'mcq', 'Welche Komponenten umfasst die multimodale Schmerztherapie?', 'Medikamente, Physiotherapie, Psychotherapie und Edukation', ['Nur Medikamente', 'Medikamente, Physiotherapie, Psychotherapie und Edukation', ['Nur Physiotherapie', 'Nur Psychotherapie']]),
     q(nextQid, 'gap-fill', 'Spezialisierte ____ haben die Versorgungsstruktur für Schmerzpatienten verbessert.', 'Schmerzzentren', ['Kliniken', 'Schmerzzentren', 'Praxen', 'Ambulanzen'])
   ], 'C1_lesson_19'),

  // L20: Chirurgische Risikokommunikation
  p('C1_read_47', 'Aufklärung über Operationsrisiken und realistische Erwartungen',
   'Die präoperative Aufklärung eines Patienten über Operationsrisiken ist nicht nur rechtlich vorgeschrieben, sondern auch medizinisch und ethisch geboten. Der Chirurg muss dem Patienten die geplante Operation, ihre Notwendigkeit, die Erfolgsaussichten, die Risiken und mögliche Alternativen verständlich darlegen. Dabei besteht die Herausforderung darin, Risiken realistisch zu kommunizieren, ohne unnötige Ängste zu schüren. Zahlen und Wahrscheinlichkeiten werden von Patienten häufig falsch interpretiert. Die Verwendung von natürlichen Häufigkeiten statt Prozentangaben kann das Verständnis verbessern. Zudem haben Studien gezeigt, dass Patienten die Erinnerung an Aufklärungsgespräche oft verzerrt wiedergeben. Die Kombination aus mündlicher Aufklärung und schriftlichen Informationen gilt als Goldstandard. Bei elektiven Eingriffen sollte dem Patienten ausreichend Bedenkzeit eingeräumt werden.',
   [
     q(nextQid, 'mcq', 'Worüber muss der Chirurg den Patienten präoperativ aufklären?', 'Über die Operation, Risiken, Erfolgsaussichten und Alternativen', ['Nur über die Operationsrisiken', 'Über die Operation, Risiken, Erfolgsaussichten und Alternativen', ['Nur über die Kosten', 'Nur über die Dauer des Krankenhausaufenthalts']]),
     q(nextQid, 'true-false', 'Die Verwendung von Prozentangaben verbessert das Verständnis von Risiken.', 'false'),
     q(nextQid, 'mcq', 'Welche Kombination gilt als Goldstandard der Aufklärung?', 'Mündliche Aufklärung kombiniert mit schriftlichen Informationen', ['Ausschließlich mündliche Aufklärung', 'Mündliche Aufklärung kombiniert mit schriftlichen Informationen', ['Ausschließlich schriftliche Informationen', 'Digitale Aufklärungsvideos']]),
     q(nextQid, 'gap-fill', 'Die Erinnerung an Aufklärungsgespräche wird von Patienten oft ____ wiedergegeben.', 'verzerrt', ['genau', 'verzerrt', 'vollständig', 'objektiv'])
   ], 'C1_lesson_20'),

  // L21: Datenschutz in der klinischen Forschung
  p('C1_read_48', 'Datenschutz und Forschungsdatenmanagement',
   'Die Nutzung von Patientendaten für die medizinische Forschung ist ein Spannungsfeld zwischen Datenschutz und wissenschaftlichem Erkenntnisinteresse. Die Europäische Datenschutz-Grundverordnung hat die Anforderungen an die Verarbeitung personenbezogener Daten verschärft. Für die Forschung gelten jedoch Erleichterungen, etwa bei der sekundären Nutzung von Behandlungsdaten. Die informierte Einwilligung des Patienten bleibt das zentrale Instrument zur Legitimation der Datennutzung. Allerdings ist die Einholung einer Einwilligung für jede einzelne Forschungsfrage praktisch oft nicht umsetzbar. Daher gewinnen Konzepte wie der Widerspruch oder die Treuhandstelle an Bedeutung. Forschungsdatenbanken und Biomaterialbanken unterliegen strengen Sicherheits- und Qualitätsanforderungen. Eine Pseudonymisierung der Daten ist in der Regel erforderlich, eine Anonymisierung anzustreben. Verstöße gegen Datenschutzbestimmungen können zu erheblichen Bußgeldern führen.',
   [
     q(nextQid, 'mcq', 'Welche Verordnung hat die Anforderungen an die Verarbeitung personenbezogener Daten verschärft?', 'Die Europäische Datenschutz-Grundverordnung', ['Das Bundesdatenschutzgesetz', 'Die Europäische Datenschutz-Grundverordnung', ['Das Patientenrechtegesetz', 'Das Sozialgesetzbuch']]),
     q(nextQid, 'true-false', 'Die informierte Einwilligung ist das zentrale Instrument zur Legitimation der Datennutzung.', 'true'),
     q(nextQid, 'mcq', 'Welche Alternative zur Einwilligung gewinnt an Bedeutung?', 'Der Widerspruch und die Treuhandstelle', ['Die pauschale Zustimmung', 'Der Widerspruch und die Treuhandstelle', ['Die vollständige Anonymisierung', 'Der Verzicht auf Forschung']]),
     q(nextQid, 'gap-fill', 'Eine ____ der Daten ist in der Forschung in der Regel erforderlich.', 'Pseudonymisierung', ['Anonymisierung', 'Pseudonymisierung', 'Löschung', 'Veröffentlichung'])
   ], 'C1_lesson_21'),

  // L22: Sektorenübergreifende Versorgung
  p('C1_read_49', 'Sektorenübergreifende Versorgung und Schnittstellenmanagement',
   'Die Verzahnung ambulanter und stationärer Versorgung gilt als eine der größten Baustellen des deutschen Gesundheitssystems. Patienten, die nach einem Krankenhausaufenthalt in die ambulante Weiterbehandlung entlassen werden, erleben häufig Informationsverluste und Versorgungsbrüche. Ein professionelles Schnittstellenmanagement zielt darauf ab, diese Übergänge nahtlos zu gestalten. Entlassmanagement, Überleitungsbögen und die rechtzeitige Einbindung von Hausärzten und Pflegediensten sind wesentliche Elemente. Besonders komplex ist die Versorgung von Patienten, die mehrere Fachrichtungen benötigen, etwa onkologische Patienten im Rahmen eines integrierten Versorgungsmodells. Die elektronische Patientenakte verspricht eine Verbesserung des Informationsflusses, ist jedoch in der Praxis noch nicht flächendeckend wirksam. Pflegeüberleitungen und die Koordination von Rehabilitationsterminen sind weitere kritische Punkte im Schnittstellenmanagement.',
   [
     q(nextQid, 'mcq', 'Was erleben Patienten häufig nach einem Krankenhausaufenthalt?', 'Informationsverluste und Versorgungsbrüche', ['Eine verbesserte Versorgung', 'Informationsverluste und Versorgungsbrüche', ['Eine nahtlose Weiterbehandlung', 'Eine Reduzierung der Medikamente']]),
     q(nextQid, 'true-false', 'Die elektronische Patientenakte ist bereits flächendeckend wirksam.', 'false'),
     q(nextQid, 'mcq', 'Welche Elemente gehören zu einem professionellen Schnittstellenmanagement?', 'Entlassmanagement, Überleitungsbögen und Einbindung von Hausärzten', ['Nur die Entlassung', 'Entlassmanagement, Überleitungsbögen und Einbindung von Hausärzten', ['Nur die Aufnahme', 'Nur die Pflegeplanung']]),
     q(nextQid, 'gap-fill', 'Die Verzahnung ambulanter und ____ Versorgung ist eine Baustelle des Gesundheitssystems.', 'stationärer', ['hausärztlicher', 'stationärer', 'privater', 'öffentlicher'])
   ], 'C1_lesson_22'),

  // L23: FSP-relevante Krankenhausdokumentation
  p('C1_read_50', 'Ärztliche Dokumentation im Krankenhausalltag',
   'Die ärztliche Dokumentation ist nicht nur eine lästige Pflicht, sondern ein zentrales Instrument der Patientenversorgung, der Qualitätssicherung und der rechtlichen Absicherung. Im Krankenhausalltag müssen Aufnahmebefund, Verlaufsdokumentation, Operationsberichte, Arztbriefe und Entlassungsdokumentation erstellt werden. Für ausländische Ärzte, die die Fachsprachprüfung ablegen, ist die Beherrschung der ärztlichen Dokumentation in korrektem medizinischem Deutsch eine besondere Herausforderung. Der Arztbrief als zentrale Schnittstelle zwischen stationärer und ambulanter Versorgung muss Diagnosen, durchgeführte Maßnahmen, Medikation und weitere Empfehlungen verständlich und vollständig enthalten. Die Einführung der elektronischen Patientenakte verändert die Dokumentationspraxis grundlegend, birgt aber auch Risiken wie die Übernahme von Textbausteinen ohne kritische Prüfung. Eine strukturierte und patientenorientierte Dokumentation ist Ausdruck ärztlicher Sorgfalt.',
   [
     q(nextQid, 'mcq', 'Welche Dokumente müssen im Krankenhausalltag erstellt werden?', 'Aufnahmebefund, Verlaufsdokumentation, OP-Berichte und Arztbriefe', ['Nur der Arztbrief', 'Aufnahmebefund, Verlaufsdokumentation, OP-Berichte und Arztbriefe', ['Nur der Entlassungsbericht', 'Nur das Rezept']]),
     q(nextQid, 'true-false', 'Der Arztbrief ist die zentrale Schnittstelle zwischen stationärer und ambulanter Versorgung.', 'true'),
     q(nextQid, 'mcq', 'Welche Herausforderung stellt die Dokumentation für ausländische Ärzte dar?', 'Die korrekte medizinische Fachsprache in der Dokumentation', ['Die technische Bedienung der Software', 'Die korrekte medizinische Fachsprache in der Dokumentation', ['Die rechtlichen Vorschriften', 'Die Länge der Dokumentation']]),
     q(nextQid, 'gap-fill', 'Der Arztbrief muss ____, durchgeführte Maßnahmen und Medikation enthalten.', 'Diagnosen', ['Untersuchungen', 'Diagnosen', 'Termine', 'Kosten'])
   ], 'C1_lesson_23'),
];

c1.push(...batch2d);
data.C1 = c1;
fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2D done: added C1_read_44 to C1_read_50');
console.log('C1 count now:', data.C1.length);
