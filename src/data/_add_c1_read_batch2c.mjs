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

const batch2c = [
  // L7: Öffentliche Gesundheitskommunikation
  p('C1_read_34', 'Risikokommunikation in der öffentlichen Gesundheit',
   'Die Kommunikation von Gesundheitsrisiken an die breite Öffentlichkeit ist eine komplexe Aufgabe, die weit über die reine Informationsvermittlung hinausgeht. Insbesondere in Gesundheitskrisen wie der COVID-19-Pandemie hat sich gezeigt, dass eine unzureichende Risikokommunikation zu Verunsicherung und sinkendem Vertrauen in öffentliche Institutionen führen kann. Wissenschaftliche Unsicherheiten transparent darzustellen, ohne Panik zu erzeugen oder den Eindruck von Inkompetenz zu vermitteln, erfordert ein hohes Maß an Kommunikationskompetenz. Zielgruppenspezifische Ansprache, der Einsatz verschiedener Medienkanäle und die Zusammenarbeit mit Multiplikatoren sind wesentliche Elemente einer wirksamen Risikokommunikation. Die Gesundheitskompetenz der Bevölkerung zu stärken, ist dabei eine langfristige gesellschaftliche Aufgabe.',
   [
     q(nextQid, 'mcq', 'Wozu kann unzureichende Risikokommunikation in Gesundheitskrisen führen?', 'Zu Verunsicherung und sinkendem Vertrauen in Institutionen', ['Zu besserem Verständnis der Bevölkerung', 'Zu Verunsicherung und sinkendem Vertrauen in Institutionen', ['Zu höheren Impfraten', 'Zu mehr Forschung']]),
     q(nextQid, 'true-false', 'Die COVID-19-Pandemie hat die Bedeutung guter Risikokommunikation gezeigt.', 'true'),
     q(nextQid, 'mcq', 'Welche Elemente sind für wirksame Risikokommunikation wesentlich?', 'Zielgruppenspezifische Ansprache und Einsatz verschiedener Medienkanäle', ['Ausschließlich Pressemitteilungen', 'Zielgruppenspezifische Ansprache und Einsatz verschiedener Medienkanäle', ['Nur wissenschaftliche Publikationen', 'Einheitliche Sprachregelungen']]),
     q(nextQid, 'gap-fill', 'Die ____ der Bevölkerung zu stärken ist eine langfristige gesellschaftliche Aufgabe.', 'Gesundheitskompetenz', ['Wirtschaft', 'Gesundheitskompetenz', 'Bildung', 'Technologie'])
   ], 'C1_lesson_7'),

  // L8: Pandemievorsorge
  p('C1_read_35', 'Pandemievorsorge und Infektionsschutz',
   'Die Erfahrungen der COVID-19-Pandemie haben die Notwendigkeit einer systematischen Pandemievorsorge nachdrücklich verdeutlicht. Ein effektiver Infektionsschutz erfordert ein Zusammenspiel verschiedener Maßnahmen: Früherkennung durch Surveillance-Systeme, schnelle Diagnostik, Kontaktnachverfolgung, Impfstrategien und die Vorhaltung ausreichender Kapazitäten im Gesundheitswesen. Der Öffentliche Gesundheitsdienst spielt dabei eine zentrale Rolle. Die Pandemie hat jedoch auch strukturelle Schwächen offengelegt, etwa den Personalmangel in den Gesundheitsämtern und die unzureichende Digitalisierung der Meldewege. Der Pandemievertrag der Weltgesundheitsorganisation und der Nationale Pandemieplan bilden den politischen Rahmen für künftige Maßnahmen. Eine verbesserte Aus- und Weiterbildung des medizinischen Personals in Infektiologie und Hygiene ist eine weitere Konsequenz aus der Pandemie.',
   [
     q(nextQid, 'mcq', 'Welche Rolle spielt der Öffentliche Gesundheitsdienst in der Pandemievorsorge?', 'Eine zentrale Rolle', ['Eine untergeordnete Rolle', 'Eine zentrale Rolle', ['Nur eine beratende Rolle', 'Keine Rolle']]),
     q(nextQid, 'true-false', 'Die Digitalisierung der Meldewege war während der Pandemie optimal.', 'false'),
     q(nextQid, 'mcq', 'Welche strukturellen Schwächen wurden durch die Pandemie offengelegt?', 'Personalmangel in Gesundheitsämtern und unzureichende Digitalisierung', ['Zu viele Krankenhäuser', 'Personalmangel in Gesundheitsämtern und unzureichende Digitalisierung', ['Überfüllte medizinische Fakultäten', 'Zu viele Ärzte']]),
     q(nextQid, 'gap-fill', 'Der Nationale Pandemieplan bildet den ____ Rahmen für künftige Maßnahmen.', 'politischen', ['rechtlichen', 'politischen', 'finanziellen', 'organisatorischen'])
   ], 'C1_lesson_8'),

  // L9: Qualitätsmanagement in Krankenhäusern
  p('C1_read_36', 'Qualitätsmanagement und klinisches Risikomanagement',
   'Qualitätsmanagement in Krankenhäusern hat sich von einer freiwilligen Initiative zu einer gesetzlichen Verpflichtung entwickelt. Das Gemeinsame Bundesausschuss legt verbindliche Qualitätsanforderungen fest, deren Einhaltung durch externe Qualitätssicherungsverfahren überprüft wird. Zertifizierungen nach DIN EN ISO 9001 oder KTQ sind für viele Kliniken Standard. Im klinischen Risikomanagement geht es vor allem um die Identifikation, Analyse und Vermeidung von Risiken, die die Patientensicherheit gefährden können. Critical-Incident-Reporting-Systeme, regelmäßige Risikoanalysen und standardisierte OP-Checklisten sind etablierte Instrumente. Die Herausforderung besteht darin, Qualitätsmanagement nicht als bürokratische Pflichtübung zu betrachten, sondern als kontinuierlichen Verbesserungsprozess, der von allen Mitarbeitern getragen wird.',
   [
     q(nextQid, 'mcq', 'Welches Gremium legt verbindliche Qualitätsanforderungen in Krankenhäusern fest?', 'Der Gemeinsame Bundesausschuss', ['Das Robert Koch-Institut', 'Der Gemeinsame Bundesausschuss', ['Das Institut für Qualität und Wirtschaftlichkeit', 'Die Kassenärztliche Bundesvereinigung']]),
     q(nextQid, 'true-false', 'Qualitätsmanagement ist im Krankenhaus heute eine freiwillige Initiative.', 'false'),
     q(nextQid, 'mcq', 'Welche Instrumente des klinischen Risikomanagements werden genannt?', 'Critical-Incident-Reporting-Systeme, Risikoanalysen und OP-Checklisten', ['Mehr Personal und höhere Gehälter', 'Critical-Incident-Reporting-Systeme, Risikoanalysen und OP-Checklisten', ['Längere Arbeitszeiten', 'Mehr Bettenkapazität']]),
     q(nextQid, 'gap-fill', 'Qualitätsmanagement sollte als kontinuierlicher ____-Prozess verstanden werden.', 'Verbesserungs', ['Kontroll', 'Verbesserungs', 'Bewertungs', 'Dokumentations'])
   ], 'C1_lesson_9'),

  // L10: Akademisches Peer-Review
  p('C1_read_37', 'Herausforderungen des wissenschaftlichen Peer-Review-Prozesses',
   'Der Peer-Review-Prozess ist das etablierte Verfahren zur Qualitätssicherung wissenschaftlicher Publikationen. Gutachter bewerten eingereichte Manuskripte hinsichtlich ihrer methodischen Qualität, Originalität und Relevanz. In den letzten Jahren ist dieses System jedoch zunehmend in die Kritik geraten. Die steigende Zahl wissenschaftlicher Einreichungen führt zu einer Überlastung der Gutachter, was die Qualität der Begutachtung beeinträchtigen kann. Publikationsbias, bei dem positive Ergebnisse bevorzugt veröffentlicht werden, verzerrt die wissenschaftliche Evidenz. Zudem kommt es immer wieder zu Fällen von Plagiat oder Datenfälschung, die das Vertrauen in die wissenschaftliche Integrität gefährden. Open-Access-Modelle mit transparenten Review-Verfahren und die Einführung von Checklists wie CONSORT oder STROBE sollen die Qualität der Begutachtung verbessern.',
   [
     q(nextQid, 'mcq', 'Welche Aufgabe haben Gutachter im Peer-Review-Prozess?', 'Bewertung methodischer Qualität, Originalität und Relevanz', ['Finanzierung der Forschung', 'Bewertung methodischer Qualität, Originalität und Relevanz', ['Korrektur von Rechtschreibfehlern', 'Verwaltung der Publikationsdatenbank']]),
     q(nextQid, 'true-false', 'Publikationsbias bedeutet, dass negative Ergebnisse bevorzugt veröffentlicht werden.', 'false'),
     q(nextQid, 'mcq', 'Welche Maßnahmen sollen die Qualität der Begutachtung verbessern?', 'Open-Access-Modelle und Checklisten wie CONSORT', ['Kürzere Begutachtungszeiten', 'Open-Access-Modelle und Checklisten wie CONSORT', ['Höhere Publikationsgebühren', 'Mehr Verlage']]),
     q(nextQid, 'gap-fill', 'Die steigende Zahl wissenschaftlicher Einreichungen führt zu einer ____ der Gutachter.', 'Überlastung', ['Entlastung', 'Überlastung', 'Motivation', 'Spezialisierung'])
   ], 'C1_lesson_10'),

  // L11: Wissenschaftliche Integrität
  p('C1_read_38', 'Wissenschaftliche Integrität in der medizinischen Forschung',
   'Die Sicherung wissenschaftlicher Integrität ist eine Grundvoraussetzung für vertrauenswürdige medizinische Forschung. Fälle von wissenschaftlichem Fehlverhalten wie Datenfälschung, Plagiat oder unethischen Studien erschüttern immer wieder das Vertrauen der Öffentlichkeit in die Wissenschaft. Die Deutsche Forschungsgemeinschaft und die Hochschulen haben verbindliche Regeln zur guten wissenschaftlichen Praxis aufgestellt, deren Einhaltung regelmäßig überprüft wird. Ombudspersonen und unabhängige Untersuchungskommissionen sind Anlaufstellen für Hinweise auf Fehlverhalten. Besonders problematisch ist der Druck auf junge Wissenschaftler, möglichst viele Publikationen in kurzer Zeit vorzuweisen. Dieser Publikationsdruck wird als eine der Hauptursachen für wissenschaftliches Fehlverhalten angesehen. Eine nachhaltige Kultur wissenschaftlicher Integrität erfordert daher strukturelle Reformen im Wissenschaftssystem.',
   [
     q(nextQid, 'mcq', 'Welche Formen wissenschaftlichen Fehlverhaltens werden genannt?', 'Datenfälschung, Plagiat und unethische Studien', ['Nur Plagiat', 'Datenfälschung, Plagiat und unethische Studien', ['Nur Datenfälschung', 'Nur unethische Studien']]),
     q(nextQid, 'true-false', 'Ombudspersonen sind Anlaufstellen für Hinweise auf wissenschaftliches Fehlverhalten.', 'true'),
     q(nextQid, 'mcq', 'Was wird als eine der Hauptursachen für wissenschaftliches Fehlverhalten angesehen?', 'Der Publikationsdruck auf junge Wissenschaftler', ['Mangelnde Finanzierung', 'Der Publikationsdruck auf junge Wissenschaftler', ['Zu viele Studierende', 'Fehlende technische Ausstattung']]),
     q(nextQid, 'gap-fill', 'Die DFG hat verbindliche Regeln zur guten wissenschaftlichen ____ aufgestellt.', 'Praxis', ['Forschung', 'Praxis', 'Methodik', 'Ethik'])
   ], 'C1_lesson_11'),

  // L12: Interessenkonflikte
  p('C1_read_39', 'Interessenkonflikte in der medizinischen Versorgung',
   'Interessenkonflikte entstehen, wenn sekundäre Interessen wie finanzielle Anreize oder Karrierewünsche das primäre Interesse am Patientenwohl beeinflussen können. Sie sind in der Medizin allgegenwärtig, werden aber häufig nicht ausreichend thematisiert. Besonders relevant sind Interessenkonflikte in der klinischen Forschung, wo Pharmaunternehmen Studien finanzieren, und in der ärztlichen Fortbildung, die oft von Industrie gesponsert wird. Die Offenlegung potenzieller Interessenkonflikte ist ein erster Schritt zur Transparenz. Viele medizinische Fachzeitschriften und Kongresse verlangen inzwischen eine entsprechende Erklärung. Eine darüber hinausgehende Regulierung, etwa die vollständige Trennung von Fortbildung und Industriefinanzierung, wird kontrovers diskutiert. Ärzte sollten für Interessenkonflikte sensibilisiert sein und kritisch hinterfragen, ob ihre Entscheidungen unbeeinflusst vom Patientenwohl getroffen werden.',
   [
     q(nextQid, 'mcq', 'Was versteht man unter Interessenkonflikten in der Medizin?', 'Sekundäre Interessen, die das Patientenwohl beeinflussen können', ['Das primäre Interesse des Arztes am Patientenwohl', 'Sekundäre Interessen, die das Patientenwohl beeinflussen können', ['Die Zusammenarbeit mit Kollegen', 'Die Nutzung medizinischer Geräte']]),
     q(nextQid, 'true-false', 'Interessenkonflikte sind in der Medizin selten und werden offen diskutiert.', 'false'),
     q(nextQid, 'mcq', 'Welche Maßnahme wird zur Transparenz bei Interessenkonflikten gefordert?', 'Die Offenlegung potenzieller Interessenkonflikte', ['Die Abschaffung der Pharmaforschung', 'Die Offenlegung potenzieller Interessenkonflikte', ['Das Verbot von Industriekontakten', 'Höhere Gehälter für Ärzte']]),
     q(nextQid, 'gap-fill', 'Ärzte sollten für Interessenkonflikte ____ sein und ihre Entscheidungen kritisch hinterfragen.', 'sensibilisiert', ['immun', 'sensibilisiert', 'trainiert', 'informiert'])
   ], 'C1_lesson_12'),

  // L13: Reform der medizinischen Ausbildung
  p('C1_read_40', 'Medizinstudium im Wandel: Kompetenzorientierte Ausbildung',
   'Das Medizinstudium in Deutschland befindet sich in einem grundlegenden Reformprozess. Der Nationale Kompetenzbasierte Lernzielkatalog Medizin definiert die Fähigkeiten, die Absolventen am Ende ihres Studiums beherrschen sollen. Im Mittelpunkt stehen nicht mehr reine Wissensvermittlung, sondern Handlungskompetenzen, Kommunikationsfertigkeiten und interprofessionelle Zusammenarbeit. Mit der neuen Ärztlichen Approbationsordnung werden praktische Fertigkeiten und klinische Erfahrungen stärker gewichtet. Der verstärkte Einsatz von Simulationspatienten, Skills Labs und digitalen Lernplattformen soll die Ausbildung praxisnäher gestalten. Kritiker bemängeln jedoch, dass die Reformen den Personalmangel in der Lehre und die unzureichende Vergütung der Lehrtätigkeit nicht adressieren. Eine erfolgreiche Reform muss daher auch die strukturellen Bedingungen der medizinischen Lehre verbessern.',
   [
     q(nextQid, 'mcq', 'Was steht im Zentrum des kompetenzorientierten Lernzielkatalogs Medizin?', 'Handlungskompetenzen, Kommunikation und interprofessionelle Zusammenarbeit', ['Reine Wissensvermittlung', 'Handlungskompetenzen, Kommunikation und interprofessionelle Zusammenarbeit', ['Forschungskompetenzen', 'Verwaltungskompetenzen']]),
     q(nextQid, 'true-false', 'Die neue Ärztliche Approbationsordnung gewichtet praktische Fertigkeiten stärker.', 'true'),
     q(nextQid, 'mcq', 'Welche Lernmethoden sollen die Ausbildung praxisnäher gestalten?', 'Simulationspatienten, Skills Labs und digitale Lernplattformen', ['Vorlesungen und Seminare', 'Simulationspatienten, Skills Labs und digitale Lernplattformen', ['Selbststudium ohne Anleitung', 'Klausuren und Prüfungen']]),
     q(nextQid, 'gap-fill', 'Eine erfolgreiche Reform muss auch die ____ Bedingungen der Lehre verbessern.', 'strukturellen', ['finanziellen', 'strukturellen', 'organisatorischen', 'räumlichen'])
   ], 'C1_lesson_13'),

  // L14: Evidenzhierarchien
  p('C1_read_41', 'Evidenzhierarchien und die Grenzen der Evidenzbasierung',
   'In der evidenzbasierten Medizin werden Studiendesigns nach ihrer Aussagekraft hierarchisch geordnet. An der Spitze stehen systematische Übersichtsarbeiten und Metaanalysen, gefolgt von randomisierten kontrollierten Studien. Kohortenstudien, Fall-Kontroll-Studien und Expertenmeinungen bilden die unteren Stufen. Diese Hierarchie ist nützlich, um die Qualität von Evidenz zu bewerten, sie hat jedoch auch ihre Grenzen. Für viele klinische Fragestellungen, insbesondere in der Chirurgie oder der Palliativmedizin, liegen keine randomisierten Studien vor. Zudem können methodisch hochwertige Studien zu falschen Ergebnissen führen, wenn sie nicht auf die klinische Realität übertragbar sind. Evidenzhierarchien sollten daher als Orientierungshilfe, nicht als starres Bewertungsschema dienen. Die GRADE-Methodik bietet einen differenzierteren Ansatz zur Bewertung der Evidenzqualität.',
   [
     q(nextQid, 'mcq', 'Welche Studienform steht an der Spitze der Evidenzhierarchie?', 'Systematische Übersichtsarbeiten und Metaanalysen', ['Fallberichte', 'Systematische Übersichtsarbeiten und Metaanalysen', ['Expertenmeinungen', 'Tierexperimentelle Studien']]),
     q(nextQid, 'true-false', 'Für alle klinischen Fragestellungen liegen randomisierte Studien vor.', 'false'),
     q(nextQid, 'mcq', 'Welche Methodik bietet einen differenzierteren Ansatz zur Bewertung der Evidenzqualität?', 'Die GRADE-Methodik', ['Die Cochrane-Methodik', 'Die GRADE-Methodik', ['Die SIGN-Methodik', 'Die CONSORT-Methodik']]),
     q(nextQid, 'gap-fill', 'Evidenzhierarchien sollten als ____, nicht als starres Bewertungsschema dienen.', 'Orientierungshilfe', ['Entscheidungsgrundlage', 'Orientierungshilfe', 'Verordnung', 'Richtlinie'])
   ], 'C1_lesson_14'),

  // L15: Patient-Reported Outcomes
  p('C1_read_42', 'Patientenberichtete Endpunkte in der Versorgungsforschung',
   'Patient-Reported Outcome Measures erfassen die Gesundheitssituation aus der Perspektive des Patienten. Anders als klinische Parameter wie Blutwerte oder bildgebende Befunde messen PROMs subjektive Aspekte wie Lebensqualität, Schmerzintensität oder funktionellen Status. Sie gewinnen zunehmend an Bedeutung in der klinischen Forschung und Qualitätssicherung. Standardisierte Fragebögen wie der SF-36 oder der EQ-5D ermöglichen eine internationale Vergleichbarkeit. Die Integration von PROMs in den klinischen Alltag ist jedoch aufwendig: Die Auswahl geeigneter Instrumente, die Interpretation der Ergebnisse und die Rückmeldung an die Patienten erfordern spezifische Kenntnisse. Kritiker weisen darauf hin, dass PROMs kulturelle und sprachliche Unterschiede nur unzureichend abbilden. Dennoch werden sie als wichtiges Instrument angesehen, um die Patientenperspektive systematisch in die Versorgung einzubeziehen.',
   [
     q(nextQid, 'mcq', 'Was messen Patient-Reported Outcome Measures?', 'Subjektive Aspekte wie Lebensqualität und Schmerzintensität', ['Blutwerte und Laborparameter', 'Subjektive Aspekte wie Lebensqualität und Schmerzintensität', ['Bildgebende Befunde', 'Genetische Marker']]),
     q(nextQid, 'true-false', 'PROMs sind im klinischen Alltag einfach zu integrieren.', 'false'),
     q(nextQid, 'mcq', 'Welche standardisierten Fragebögen werden genannt?', 'Der SF-36 und der EQ-5D', ['Der BDI und der STAI', 'Der SF-36 und der EQ-5D', ['Der PHQ-9 und der GAD-7', 'Der MOCA und der MMST']]),
     q(nextQid, 'gap-fill', 'PROMs erfassen die Gesundheitssituation aus der ____ des Patienten.', 'Perspektive', ['Sichtweise', 'Perspektive', 'Erfahrung', 'Meinung'])
   ], 'C1_lesson_15'),

  // L16: Ethik von Screening-Programmen
  p('C1_read_43', 'Ethische Aspekte bevölkerungsbezogener Screening-Programme',
   'Screening-Programme zur Früherkennung von Erkrankungen wie Brustkrebs oder Darmkrebs versprechen eine verbesserte Prognose durch frühzeitige Behandlung. Aus ethischer Perspektive sind sie jedoch nicht unproblematisch. Grundsätzlich gilt, dass der potenzielle Nutzen eines Screenings die möglichen Schäden überwiegen muss. Zu den Schäden zählen falsch-positive Befunde, die zu unnötigen Ängsten und invasiven Nachuntersuchungen führen, sowie Überdiagnosen, bei denen Tumoren entdeckt werden, die ohne Behandlung nie symptomatisch geworden wären. Die informierte Entscheidung des Bürgers für oder gegen die Teilnahme an einem Screening setzt eine verständliche Aufklärung über Nutzen und Risiken voraus. Die gesetzlichen Krankenkassen in Deutschland sind verpflichtet, über qualitätsgesicherte Früherkennungsuntersuchungen zu informieren, ohne Druck auf die Versicherten auszuüben.',
   [
     q(nextQid, 'mcq', 'Was sind potenzielle Schäden von Screening-Programmen?', 'Falsch-positive Befunde und Überdiagnosen', ['Verzögerung der Behandlung', 'Falsch-positive Befunde und Überdiagnosen', ['Niedrigere Behandlungskosten', 'Weniger Arztbesuche']]),
     q(nextQid, 'true-false', 'Der potenzielle Nutzen eines Screenings muss die möglichen Schäden überwiegen.', 'true'),
     q(nextQid, 'mcq', 'Was setzt eine informierte Entscheidung zur Screening-Teilnahme voraus?', 'Eine verständliche Aufklärung über Nutzen und Risiken', ['Eine ärztliche Empfehlung', 'Eine verständliche Aufklärung über Nutzen und Risiken', ['Eine gesetzliche Verpflichtung', 'Eine Kostenübernahme']]),
     q(nextQid, 'gap-fill', '____ sind Tumoren, die ohne Behandlung nie symptomatisch geworden wären.', 'Überdiagnosen', ['Fehldiagnosen', 'Überdiagnosen', 'Spätdiagnosen', 'Frühdiagnosen'])
   ], 'C1_lesson_16'),
];

c1.push(...batch2c);
data.C1 = c1;
fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2C done: added C1_read_34 to C1_read_43');
console.log('C1 count now:', data.C1.length);
