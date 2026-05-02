import fs from 'fs';

const data = JSON.parse(fs.readFileSync('listening.json', 'utf8'));
let c1 = data.C1 || [];

let maxQid = c1.reduce((m, v) => v.questions.reduce((m2, q) => {
  const n = parseInt(q.id.replace(/[^\d]/g, ''), 10);
  return Math.max(m2, n);
}, m), 0);

function nextQid() { maxQid++; return 'ql' + maxQid; }

function q(qid, type, question, answer, opts) {
  const o = { id: qid(), type, question };
  if (type === 'mcq' || type === 'gap-fill' || type === 'opinion-match') o.options = opts;
  o.answer = answer;
  return o;
}

function l(id, title, script, questions, lessonId) {
  return { id, title, script, questions, level: "C1", lessonId };
}

const batch1a = [
  // 1. Academic medical lecture - L1
  l('C1_listen_4', 'Vorlesung: Grundlagen der evidenzbasierten Medizin',
   `Prof. Dr. Berger: Meine Damen und Herren, herzlich willkommen zur Vorlesung Evidenzbasierte Medizin. Wir beschäftigen uns heute mit der Frage, wie wir wissenschaftliche Erkenntnisse in die klinische Praxis übertragen.\n\nStudent: Wann ist eine Studie eigentlich aussagekräftig genug?\n\nProf. Dr. Berger: Eine gute Frage. Grundsätzlich gilt: Randomisierte kontrollierte Studien liefern die zuverlässigste Evidenz. Aber sie sind nicht immer durchführbar. Bei seltenen Erkrankungen oder in der Chirurgie müssen wir oft auf andere Studiendesigns zurückgreifen.\n\nStudentin: Wie gehen wir mit Widersprüchen zwischen Studien um?\n\nProf. Dr. Berger: Das ist tatsächlich eine große Herausforderung. Hier helfen systematische Übersichtsarbeiten und Metaanalysen. Sie fassen mehrere Studien zusammen und gewichten sie nach ihrer Qualität. Wichtig ist: Evidenz allein reicht nicht. Wir müssen sie immer auf die individuelle Patientensituation anwenden.`,
   [
     q(nextQid, 'mcq', 'Welche Studienform liefert die zuverlässigste Evidenz?', 'Randomisierte kontrollierte Studien', ['Fallberichte', 'Randomisierte kontrollierte Studien', ['Expertenmeinungen', 'Tierexperimentelle Studien']]),
     q(nextQid, 'true-false', 'In der Chirurgie sind randomisierte Studien immer durchführbar.', 'false'),
     q(nextQid, 'mcq', 'Was hilft bei Widersprüchen zwischen verschiedenen Studien?', 'Systematische Übersichtsarbeiten und Metaanalysen', ['Die Meinung des Chefarztes', 'Systematische Übersichtsarbeiten und Metaanalysen', ['Eine einzelne neue Studie', 'Eine Patientenabfrage']]),
     q(nextQid, 'true-false', 'Evidenz muss auf die individuelle Patientensituation angewendet werden.', 'true')
   ], 'C1_lesson_1'),

  // 2. Hospital reform panel discussion - L2
  l('C1_listen_5', 'Podiumsdiskussion: Krankenhausreform',
   `Moderatorin: Willkommen zur Podiumsdiskussion zur geplanten Krankenhausreform. Bei uns sind Frau Dr. Schäfer von der Krankenhausgesellschaft und Herr Professor Neumann von der medizinischen Fakultät. Frau Dr. Schäfer, was sind die zentralen Punkte der Reform?\n\nDr. Schäfer: Die Reform zielt auf eine grundlegende Neuausrichtung der Krankenhausvergütung ab. Statt der reinen Fallpauschale soll ein System mit gestaffelten Leistungsgruppen treten. Das soll Fehlanreize korrigieren.\n\nProf. Neumann: Ich sehe das kritisch. Die Reform adressiert nicht den Personalmangel, der unser dringendstes Problem ist. Wir brauchen mehr Investitionen in die Pflege und bessere Arbeitsbedingungen.\n\nDr. Schäfer: Da stimme ich zu. Die Finanzierung ist nur ein Aspekt. Ohne ausreichend Personal nützt das beste Vergütungssystem nichts.`,
   [
     q(nextQid, 'mcq', 'Was soll die reine Fallpauschale in der Reform ersetzen?', 'Ein System mit gestaffelten Leistungsgruppen', ['Eine pauschale Pro-Kopf-Vergütung', 'Ein System mit gestaffelten Leistungsgruppen', ['Ein reines Budgetsystem', 'Eine Einzelleistungsvergütung']]),
     q(nextQid, 'true-false', 'Professor Neumann hält den Personalmangel für das dringendste Problem.', 'true'),
     q(nextQid, 'mcq', 'Welchem Thema stimmen beide Diskussionsteilnehmer zu?', 'Personalmangel ist ein entscheidendes Problem', ['Die Reform ist perfekt', 'Personalmangel ist ein entscheidendes Problem', ['Fallpauschalen sind optimal', 'Investitionen sind unnötig']]),
     q(nextQid, 'gap-fill', 'Die Reform soll ____ in der Krankenhausvergütung korrigieren.', 'Fehlanreize', ['Kosten', 'Fehlanreize', 'Defizite', 'Fehlentscheidungen'])
   ], 'C1_lesson_2'),

  // 3. Physician shortage interview - L4
  l('C1_listen_6', 'Interview: Wege gegen den Ärztemangel',
   `Reporter: Herr Dr. Weber, Sie leiten die Arztvermittlung der Kassenärztlichen Vereinigung. Wie schlimm ist der Ärztemangel wirklich?\n\nDr. Weber: Der Mangel ist regional sehr unterschiedlich. In Großstädten haben wir eine gute Versorgung. In ländlichen Regionen sieht es anders aus. Dort finden wir kaum noch Nachfolger für ausscheidende Landärzte.\n\nReporter: Was tut die Politik dagegen?\n\nDr. Weber: Es gibt verschiedene Programme. Die Landarztquote im Studium, finanzielle Anreize für die Niederlassung auf dem Land und der Ausbau telemedizinischer Angebote. Aber der entscheidende Faktor ist die Arbeitszeitgestaltung. Die junge Ärztegeneration will keine 60-Stunden-Woche mehr.\n\nReporter: Wie sehen Sie die Zukunft?\n\nDr. Weber: Wir werden nicht umhinkommen, mehr Ärzte aus dem Ausland zu gewinnen und gleichzeitig die Arbeitsbedingungen zu verbessern. Die Integration ausländischer Kollegen muss besser unterstützt werden.`,
   [
     q(nextQid, 'mcq', 'Wo ist der Ärztemangel besonders ausgeprägt?', 'In ländlichen Regionen', ['In Großstädten', 'In ländlichen Regionen', ['In Universitätskliniken', 'In privaten Praxen']]),
     q(nextQid, 'true-false', 'Die junge Ärztegeneration ist bereit für eine 60-Stunden-Woche.', 'false'),
     q(nextQid, 'mcq', 'Welche Maßnahmen werden gegen den Ärztemangel ergriffen?', 'Landarztquote, finanzielle Anreize und Telemedizin', ['Mehr Studienplätze in Großstädten', 'Landarztquote, finanzielle Anreize und Telemedizin', ['Kürzere Arbeitszeiten für alle', 'Automatisierung aller Arztpraxen']]),
     q(nextQid, 'gap-fill', 'Die ____ ausländischer Kollegen muss besser unterstützt werden.', 'Integration', ['Ausbildung', 'Integration', 'Bezahlung', 'Rekrutierung'])
   ], 'C1_lesson_4'),

  // 4. Ethics committee discussion - L11
  l('C1_listen_7', 'Ethikkommission: Fallberatung',
   `Vorsitzender: Wir besprechen heute den Fall einer 82-jährigen Patientin mit fortgeschrittener Demenz. Die Tochter wünscht eine Magensonde, der behandelnde Arzt hält dies für nicht indiziert. Frau Dr. Lange, Ihr ethisches Votum?\n\nDr. Lange: Die Patientin hat keine Patientenverfügung. Wir müssen nach mutmaßlichem Willen entscheiden. Die Frage lautet: Wäre eine Sondenernährung aus Patientensicht wirklich gewünscht?\n\nVorsitzender: Der Arzt berichtet, dass die Patientin zuvor mehrfach geäußert habe, nicht künstlich ernährt werden zu wollen.\n\nDr. Lange: Das ist ein starkes Indiz. Der mutmaßliche Wille spricht gegen die Sonde. Zudem ist der medizinische Nutzen bei fortgeschrittener Demenz umstritten. Ich empfehle eine palliative Begleitung.\n\nVorsitzender: Wir folgen dieser Einschätzung. Die Entscheidung wird dokumentiert und der Tochter erläutert.`,
   [
     q(nextQid, 'mcq', 'Welche ethische Frage wird in der Ethikkommission besprochen?', 'Ob eine Magensonde bei einer Patientin mit Demenz indiziert ist', ['Ob die Patientin verlegt werden soll', 'Ob eine Magensonde bei einer Patientin mit Demenz indiziert ist', ['Ob die Tochter das Sorgerecht erhält', 'Ob die Medikamente reduziert werden sollen']]),
     q(nextQid, 'true-false', 'Die Patientin hat eine Patientenverfügung hinterlassen.', 'false'),
     q(nextQid, 'mcq', 'Was spricht laut Dr. Lange gegen die Magensonde?', 'Der mutmaßliche Wille der Patientin und der umstrittene medizinische Nutzen', ['Die Kosten der Behandlung', 'Der mutmaßliche Wille der Patientin und der umstrittene medizinische Nutzen', ['Die Meinung des Pflegepersonals', 'Die räumlichen Gegebenheiten']]),
     q(nextQid, 'gap-fill', 'Die Ethikkommission empfiehlt eine ____ Begleitung.', 'palliative', ['stationäre', 'palliative', 'intensivmedizinische', 'häusliche'])
   ], 'C1_lesson_11'),

  // 5. Evidence-based medicine seminar - L6
  l('C1_listen_8', 'Seminar: Studien kritisch bewerten',
   `Dozentin: Im heutigen Seminar schauen wir uns eine aktuelle Studie zum Thema Blutdrucksenkung an. Was fällt Ihnen als erstes auf?\n\nTeilnehmerin: Die Studie wurde von einem Pharmaunternehmen finanziert.\n\nDozentin: Sehr gut erkannt. Interessenkonflikte müssen wir immer berücksichtigen. Was ist mit dem Studiendesign?\n\nTeilnehmer: Es ist eine randomisierte kontrollierte Studie mit über 10.000 Patienten. Das spricht für eine hohe Aussagekraft.\n\nDozentin: Richtig. Aber schauen Sie auf die Einschlusskriterien: Nur Patienten unter 75 Jahren und ohne relevante Vorerkrankungen. Das schränkt die Übertragbarkeit auf den typischen Bluthochdruckpatienten ein.\n\nTeilnehmerin: Der primäre Endpunkt ist ein kombinierter Endpunkt aus Herzinfarkt, Schlaganfall und Tod. Ist das sinnvoll?\n\nDozentin: Grundsätzlich ja, aber wir müssen die Einzelkomponenten betrachten. Der Effekt wurde vor allem durch die Reduktion von Schlaganfällen getrieben. Also: Die Studie zeigt, dass die Therapie bei dieser spezifischen Patientengruppe Schlaganfälle verhindert.`,
   [
     q(nextQid, 'mcq', 'Welcher Kritikpunkt am Studiendesign wird genannt?', 'Die Einschlusskriterien schränken die Übertragbarkeit ein', ['Die Studie ist zu klein', 'Die Einschlusskriterien schränken die Übertragbarkeit ein', ['Die Studiendauer ist zu kurz', 'Der Endpunkt ist falsch gewählt']]),
     q(nextQid, 'true-false', 'Die Studie wurde von einem Pharmaunternehmen finanziert.', 'true'),
     q(nextQid, 'mcq', 'Welche Patientengruppe wurde von der Studie ausgeschlossen?', 'Patienten über 75 Jahre und mit Vorerkrankungen', ['Patienten unter 50 Jahren', 'Patienten über 75 Jahre und mit Vorerkrankungen', ['Patienten mit leichtem Bluthochdruck', 'Patienten mit Diabetes']]),
     q(nextQid, 'gap-fill', 'Der primäre Endpunkt ist ein kombinierter Endpunkt aus Herzinfarkt, Schlaganfall und ____.', 'Tod', ['Operation', 'Tod', 'Krankenhausaufenthalt', 'Nierenversagen'])
   ], 'C1_lesson_6'),

  // 6. Data protection podcast - L7
  l('C1_listen_9', 'Podcast: Datenschutz in der Patientenversorgung',
   `Moderator: Herzlich willkommen zum Gesundheitspodcast. Heute zum Thema Datenschutz in Kliniken. Zu Gast ist Frau Dr. Sommer, Datenschutzbeauftragte einer Universitätsklinik. Frau Dr. Sommer, wie sicher sind Patientendaten im Krankenhaus?\n\nDr. Sommer: Grundsätzlich sind die Systeme gut geschützt. Wir haben verschlüsselte Netzwerke, Zugriffsberechtigungen und regelmäßige Sicherheitsaudits. Die größte Gefahr geht vom Menschen aus, nicht von der Technik.\n\nModerator: Was meinen Sie damit?\n\nDr. Sommer: Mitarbeiter, die ihre Passwörter teilen oder Rechner unversperrt lassen. Oder versehentlich Patientendaten per E-Mail an die falsche Adresse schicken. Hier hilft nur konsequente Schulung und Sensibilisierung.\n\nModerator: Wie geht man mit dem Wunsch von Patienten nach Löschung ihrer Daten um?\n\nDr. Sommer: Das ist rechtlich komplex. Für die Behandlung benötigte Daten unterliegen der Dokumentationspflicht und dürfen nicht gelöscht werden. Aber für Forschungsdaten gilt das anders.`,
   [
     q(nextQid, 'mcq', 'Wo liegt nach Einschätzung von Frau Dr. Sommer die größte Gefahr für Patientendaten?', 'Beim Menschen, nicht bei der Technik', ['Bei der Verschlüsselung', 'Beim Menschen, nicht bei der Technik', ['Bei externen Hackern', 'Bei der Krankenhaussoftware']]),
     q(nextQid, 'true-false', 'Patientendaten zu Behandlungszwecken dürfen auf Wunsch gelöscht werden.', 'false'),
     q(nextQid, 'mcq', 'Welche Schutzmaßnahmen werden im Krankenhaus eingesetzt?', 'Verschlüsselte Netzwerke, Zugriffsberechtigungen und Sicherheitsaudits', ['Private E-Mail-Kommunikation', 'Verschlüsselte Netzwerke, Zugriffsberechtigungen und Sicherheitsaudits', ['Offene WLAN-Netze', 'Gemeinsame Passwörter']]),
     q(nextQid, 'true-false', 'Mitarbeiter werden im Umgang mit Patientendaten geschult.', 'true')
   ], 'C1_lesson_7'),

  // 7. Interdisciplinary case conference - L8
  l('C1_listen_10', 'Fallkonferenz: Polytrauma-Patient',
   `Oberärztin: Guten Morgen, Kolleginnen und Kollegen. Wir besprechen heute den 34-jährigen Patienten Müller, der gestern nach einem Motorradunfall eingeliefert wurde. Befund: Mehrfachfrakturen, Milzruptur, Thoraxtrauma. Herr Dr. Khan, Chirurgie, bitte.\n\nDr. Khan: Wir haben die Milz entfernt und die Frakturen an der unteren Extremität versorgt. Der Patient ist kreislaufstabil. Morgen planen wir die Versorgung der Oberarmfraktur.\n\nOberärztin: Aus radiologischer Sicht, Frau Dr. Chen?\n\nDr. Chen: Die Aufnahmen von heute Morgen zeigen eine beginnende Pneumonie im rechten Unterlappen. Wir sollten antibiotisch abdecken.\n\nOberärztin: Gut. Herr Dr. Weber von der Anästhesie?\n\nDr. Weber: Wir planen die Extubation im Laufe des Tages. Der Patient ist wach und kooperativ. Die Schmerztherapie läuft über einen Periduralkatheter.\n\nOberärztin: Perfekt. Dann stimmen wir ab: OP morgen früh um acht, antibiotische Abschirmung beginnt sofort.`,
   [
     q(nextQid, 'mcq', 'Welche Verletzungen hat der Patient erlitten?', 'Mehrfachfrakturen, Milzruptur und Thoraxtrauma', ['Nur eine Fraktur am Bein', 'Mehrfachfrakturen, Milzruptur und Thoraxtrauma', ['Schädel-Hirn-Trauma und Wirbelsäulenfraktur', 'Verbrennungen und Schnittverletzungen']]),
     q(nextQid, 'true-false', 'Die Radiologie hat eine beginnende Pneumonie festgestellt.', 'true'),
     q(nextQid, 'mcq', 'Welche Komplikation zeigt sich in den aktuellen Aufnahmen?', 'Eine beginnende Pneumonie', ['Eine Nachblutung', 'Eine beginnende Pneumonie', ['Eine Thrombose', 'Eine Wundinfektion']]),
     q(nextQid, 'gap-fill', 'Die Schmerztherapie läuft über einen ____.', 'Periduralkatheter', ['Venenzugang', 'Periduralkatheter', 'Wundschmerzpflaster', 'Muskelrelaxans'])
   ], 'C1_lesson_8'),

  // 8. Patient safety meeting - L5
  l('C1_listen_11', 'Qualitätszirkel: Patientensicherheit',
   `Qualitätsmanagerin: Ich begrüße Sie zum monatlichen Qualitätszirkel. Thema heute: Stürze auf der Station. Wir hatten im letzten Monat drei Sturzereignisse auf der Inneren. Herr Dr. Fischer, was ist passiert?\n\nDr. Fischer: Ein Patient ist nachts beim Toilettengang gestürzt. Er war verwirrt und hatte trotz Bettgitter versucht aufzustehen. Wir haben die Sturznachsorge nach Standard durchgeführt.\n\nQualitätsmanagerin: Wurde die Sturzrisikoeinschätzung bei Aufnahme dokumentiert?\n\nDr. Fischer: Ja. Der Patient hatte ein erhöhtes Risiko, aber die dokumentierten Maßnahmen waren Bettgitter und eine Rufbereitschaft. Offenbar war die Rufbereitschaft nachts nicht ausreichend.\n\nQualitätsmanagerin: Vorschlag: Wir führen eine zusätzliche nächtliche Visite für sturzgefährdete Patienten ein. Und wir überprüfen die Dokumentation der Sturzrisikoeinschätzung bei jedem neuen Patienten. Einverstanden?\n\nAlle: Einverstanden.`,
   [
     q(nextQid, 'mcq', 'Was ist das Thema des heutigen Qualitätszirkels?', 'Stürze auf der Station', ['Medikationsfehler', 'Stürze auf der Station', ['Hygienemängel', 'Personalausfall']]),
     q(nextQid, 'true-false', 'Die Sturznachsorge wurde nach dem Vorfall nicht durchgeführt.', 'false'),
     q(nextQid, 'mcq', 'Welche Maßnahme wird als Lösung vorgeschlagen?', 'Eine zusätzliche nächtliche Visite für sturzgefährdete Patienten', ['Mehr Bettgitter für alle Patienten', 'Eine zusätzliche nächtliche Visite für sturzgefährdete Patienten', ['Weniger nächtliche Toilettengänge', 'Eine Fixierung aller Risikopatienten']]),
     q(nextQid, 'true-false', 'Die Sturzrisikoeinschätzung des Patienten war bei Aufnahme dokumentiert.', 'true')
   ], 'C1_lesson_5'),

  // 9. Foreign doctors integration - L9
  l('C1_listen_12', 'Bericht: Integration internationaler Ärzte',
   `Chefarzt: Frau Dr. Kowalski, Sie sind vor zwei Jahren aus Polen zu uns gekommen. Wie war Ihre Erfahrung?\n\nDr. Kowalski: Der Anfang war nicht leicht, obwohl ich schon gutes Deutsch konnte. Die medizinische Fachsprache ist nochmal eine andere Herausforderung. Besonders der Arztbrief und die Dokumentation.\n\nChefarzt: Wie hat die Klinik Sie unterstützt?\n\nDr. Kowalski: Ich hatte einen Mentor, der mir die Abläufe erklärt hat. Es gab einen Intensivsprachkurs für Mediziner und später ein Kommunikationstraining für schwierige Gespräche.\n\nChefarzt: Was würden Sie anderen Kliniken empfehlen?\n\nDr. Kowalski: Eine strukturierte Einarbeitungsphase von mindestens drei Monaten ist wichtig. Und man sollte die Kollegen nicht nur fachlich, sondern auch kulturell unterstützen. Die Erwartungen an Hierarchien oder die Zusammenarbeit mit Pflege unterscheiden sich oft.\n\nChefarzt: Vielen Dank für Ihre offenen Worte.`,
   [
     q(nextQid, 'mcq', 'Was war für Frau Dr. Kowalski besonders herausfordernd?', 'Die medizinische Fachsprache und die Dokumentation', ['Die Bezahlung', 'Die medizinische Fachsprache und die Dokumentation', ['Die Wohnungssuche', 'Die Kollegen']]),
     q(nextQid, 'true-false', 'Frau Dr. Kowalski hatte einen Mentor zur Unterstützung.', 'true'),
     q(nextQid, 'mcq', 'Welche Dauer wird für die Einarbeitungsphase empfohlen?', 'Mindestens drei Monate', ['Eine Woche', 'Mindestens drei Monate', ['Sechs Monate', 'Ein Jahr']]),
     q(nextQid, 'gap-fill', 'Die Erwartungen an ____ und Zusammenarbeit unterscheiden sich kulturell oft.', 'Hierarchien', ['Gehälter', 'Hierarchien', 'Arbeitszeiten', 'Urlaubsregelungen'])
   ], 'C1_lesson_9'),

  // 10. Palliative care family meeting - L10
  l('C1_listen_13', 'Palliativvisite: Gespräch mit Angehörigen',
   `Oberärztin: Frau Schmidt, vielen Dank, dass Sie heute da sind. Wir möchten mit Ihnen über den weiteren Verlauf der Behandlung Ihres Vaters sprechen. Die Chemotherapie hat leider nicht den gewünschten Erfolg gebracht.\n\nTochter: Was bedeutet das jetzt?\n\nOberärztin: Wir haben die verschiedenen Optionen im Team besprochen. Eine weitere aggressive Therapie wäre aus unserer Sicht nicht sinnvoll. Wir empfehlen stattdessen, den Fokus auf die Lebensqualität zu legen.\n\nTochter: Also aufgeben?\n\nOberärztin: Nein, wir geben nicht auf. Wir verlagern den Schwerpunkt. Wir werden die Schmerzen lindern, die Atemnot behandeln und dafür sorgen, dass Ihr Vater so gut wie möglich leben kann. Das Palliativteam wird ihn begleiten.\n\nTochter: Das ist schwer zu akzeptieren.\n\nOberärztin: Das verstehe ich sehr gut. Nehmen Sie sich Zeit. Wir sind für alle Ihre Fragen da. Auch die psychosoziale Unterstützung kann Ihnen helfen.`,
   [
     q(nextQid, 'mcq', 'Welche Therapie hat nicht den gewünschten Erfolg gebracht?', 'Die Chemotherapie', ['Die Strahlentherapie', 'Die Chemotherapie', ['Die Operation', 'Die Physiotherapie']]),
     q(nextQid, 'true-false', 'Das Ärzteteam empfiehlt eine weitere aggressive Therapie.', 'false'),
     q(nextQid, 'mcq', 'Worauf soll der Behandlungsschwerpunkt verlagert werden?', 'Auf die Lebensqualität und Symptomkontrolle', ['Auf eine operative Intervention', 'Auf die Lebensqualität und Symptomkontrolle', ['Auf eine neue Chemotherapie', 'Auf eine Verlegung in ein anderes Krankenhaus']]),
     q(nextQid, 'gap-fill', 'Das ____ wird den Patienten begleiten.', 'Palliativteam', ['Pflegeteam', 'Palliativteam', 'Chirurgenteam', 'Psychologenteam'])
   ], 'C1_lesson_10'),
];

c1.push(...batch1a);
data.C1 = c1;
fs.writeFileSync('listening.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 1A done: added C1_listen_4 to C1_listen_13');
console.log('C1 count now:', data.C1.length);
