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

const batch2b = [
  // L22: Rehabilitation nach orthopädischen Eingriffen
  p('C1_read_24', 'Rehabilitation nach orthopädischen Operationen',
   'Die postoperative Rehabilitation ist ein entscheidender Faktor für den Langzeiterfolg orthopädischer Eingriffe. Nach Hüft- oder Kniegelenkersatz, Wirbelsäuleneingriffen oder Sportverletzungen beginnt der Heilungsprozess nicht im Operationssaal, sondern in der strukturierten Nachsorge. Ein interdisziplinäres Team aus Orthopäden, Physiotherapeuten, Ergotherapeuten und Psychologen erstellt einen individuellen Rehabilitationsplan, der auf die spezifischen Bedürfnisse und Ziele des Patienten zugeschnitten ist. Die Rehabilitation umfasst nicht nur den Wiederaufbau von Kraft und Beweglichkeit, sondern auch die Schmerztherapie und die Anpassung an den Alltag. Studien belegen, dass eine frühzeitige und konsequente Rehabilitation die Rückkehr zur Arbeitsfähigkeit beschleunigt und die Lebensqualität nachhaltig verbessert.',
   [
     q(nextQid, 'mcq', 'Welche Berufsgruppen sind am interdisziplinären Rehabilitationsteam beteiligt?', 'Orthopäden, Physiotherapeuten, Ergotherapeuten und Psychologen', ['Nur Orthopäden und Physiotherapeuten', 'Orthopäden, Physiotherapeuten, Ergotherapeuten und Psychologen', 'Nur Chirurgen und Anästhesisten', 'Nur Pflegekräfte und Sozialarbeiter']),
     q(nextQid, 'true-false', 'Die Rehabilitation beginnt erst Wochen nach der Operation.', 'false'),
     q(nextQid, 'mcq', 'Welchen Effekt hat eine frühzeitige und konsequente Rehabilitation?', 'Sie beschleunigt die Rückkehr zur Arbeitsfähigkeit und verbessert die Lebensqualität', ['Sie verlängert den Krankenhausaufenthalt', 'Sie beschleunigt die Rückkehr zur Arbeitsfähigkeit und verbessert die Lebensqualität', 'Sie erhöht das Infektionsrisiko', 'Sie ist nur bei jungen Patienten wirksam']),
     q(nextQid, 'gap-fill', 'Die Rehabilitation umfasst den Wiederaufbau von ____ und Beweglichkeit.', 'Kraft', ['Ausdauer', 'Kraft', 'Schnelligkeit', 'Koordination'])
   ], 'C1_lesson_22'),

  // L23: Arzt-Patienten-Vertrauen
  p('C1_read_25', 'Vertrauen als Grundlage der Arzt-Patienten-Beziehung',
   'Das Vertrauensverhältnis zwischen Arzt und Patient gilt als eine der tragenden Säulen einer erfolgreichen medizinischen Behandlung. Vertrauen entsteht nicht automatisch mit dem Berufstitel, sondern muss durch kompetentes, empathisches und transparentes Handeln immer wieder neu erworben werden. Die zunehmende Ökonomisierung des Gesundheitswesens, der Zeitdruck in der Sprechstunde und die wachsende Komplexität der Medizin stellen dieses Vertrauensverhältnis jedoch zunehmend auf die Probe. Patienten reagieren sensibel auf Desinteresse, mangelnde Zuwendung oder unzureichende Erklärungen. Das Vertrauensverhältnis ist zudem asymmetrisch: Der Patient gibt sich dem Arzt in einer verletzlichen Position preis und ist auf dessen Wohlwollen angewiesen. Eine vertrauensvolle Beziehung wirkt sich nachweislich positiv auf die Therapietreue und den Behandlungserfolg aus.',
   [
     q(nextQid, 'mcq', 'Wodurch entsteht Vertrauen zwischen Arzt und Patient?', 'Durch kompetentes, empathisches und transparentes Handeln', ['Durch den Berufstitel und die Position', 'Durch kompetentes, empathisches und transparentes Handeln', 'Durch die Länge der Berufserfahrung', 'Durch die Anzahl der behandelten Patienten']),
     q(nextQid, 'true-false', 'Die Ökonomisierung des Gesundheitswesens hat keinen Einfluss auf das Vertrauensverhältnis.', 'false'),
     q(nextQid, 'mcq', 'Welche Auswirkung hat eine vertrauensvolle Arzt-Patienten-Beziehung?', 'Positive Wirkung auf Therapietreue und Behandlungserfolg', ['Kürzere Behandlungszeiten', 'Positive Wirkung auf Therapietreue und Behandlungserfolg', 'Höhere Behandlungskosten', 'Mehr Überweisungen an Spezialisten']),
     q(nextQid, 'gap-fill', 'Die Arzt-Patienten-Beziehung ist aufgrund der ____ des Patienten asymmetrisch.', 'Verletzlichkeit', ['Zahlungsfähigkeit', 'Verletzlichkeit', 'Bildung', 'Versicherung'])
   ], 'C1_lesson_23'),

  // L24: Burnout bei Ärzten
  p('C1_read_26', 'Burnout-Prävention im ärztlichen Beruf',
   'Der ärztliche Beruf zählt zu den Berufsgruppen mit dem höchsten Burnout-Risiko. Lange Arbeitszeiten, emotional belastende Entscheidungen, bürokratische Anforderungen und die ständige Konfrontation mit Leid und Tod führen bei vielen Medizinern zu chronischer Erschöpfung. Studien zeigen, dass etwa ein Drittel der Krankenhausärzte Symptome eines Burnouts aufweist. Die Folgen sind nicht nur für die betroffenen Ärzte gravierend, sondern auch für die Patientensicherheit: Erschöpfte Ärzte machen häufiger Fehler und weisen eine geringere Empathiefähigkeit auf. Präventive Maßnahmen wie Balint-Gruppen, Supervision, Achtsamkeitstrainings und eine Verbesserung der Arbeitsorganisation können das Risiko reduzieren. Eine offene Kultur, in der psychische Belastungen thematisiert werden dürfen, ist eine wesentliche Voraussetzung für wirksame Prävention.',
   [
     q(nextQid, 'mcq', 'Welcher Anteil der Krankenhausärzte zeigt Symptome eines Burnouts?', 'Etwa ein Drittel', ['Etwa fünf Prozent', 'Etwa ein Drittel', 'Etwa die Hälfte', 'Fast alle']),
     q(nextQid, 'true-false', 'Burnout bei Ärzten hat keine Auswirkungen auf die Patientensicherheit.', 'false'),
     q(nextQid, 'mcq', 'Welche präventiven Maßnahmen gegen Burnout werden genannt?', 'Balint-Gruppen, Supervision und Achtsamkeitstrainings', ['Längere Arbeitspausen', 'Balint-Gruppen, Supervision und Achtsamkeitstrainings', 'Mehr Gehalt', 'Weniger Patienten']),
     q(nextQid, 'gap-fill', 'Erschöpfte Ärzte weisen eine geringere ____-Fähigkeit auf.', 'Empathie', ['Kommunikations', 'Empathie', 'Entscheidungs', 'Führungs'])
   ], 'C1_lesson_24'),

  // L25: Gesundheitsökonomie
  p('C1_read_27', 'Gesundheitsökonomische Bewertung medizinischer Leistungen',
   'Die Gesundheitsökonomie befasst sich mit der effizienten Allokation knapper Ressourcen im Gesundheitswesen. Kosteneffektivitätsanalysen bewerten medizinische Maßnahmen nicht nur nach ihrem medizinischen Nutzen, sondern auch nach ihrem Verhältnis von Kosten und Nutzen. Das Institut für Qualität und Wirtschaftlichkeit im Gesundheitswesen prüft in Deutschland den Zusatznutzen neuer Arzneimittel und Therapieverfahren und gibt Empfehlungen für die Erstattungsfähigkeit. Kritiker bemängeln, dass rein ökonomische Betrachtungen die individuelle Patientensituation nicht ausreichend berücksichtigen. Die Herausforderung besteht darin, wirtschaftliche Notwendigkeiten mit dem ethischen Anspruch einer bedarfsgerechten Versorgung zu vereinbaren. In Zeiten steigender Gesundheitsausgaben gewinnt die gesundheitsökonomische Bewertung weiter an Bedeutung.',
   [
     q(nextQid, 'mcq', 'Womit befasst sich die Gesundheitsökonomie?', 'Mit der effizienten Allokation knapper Ressourcen im Gesundheitswesen', ['Mit der Entwicklung neuer Medikamente', 'Mit der effizienten Allokation knapper Ressourcen im Gesundheitswesen', ['Mit der Ausbildung von Ärzten', 'Mit der Organisation von Krankenhäusern']]),
     q(nextQid, 'true-false', 'Das IQWiG prüft den Zusatznutzen neuer Arzneimittel.', 'true'),
     q(nextQid, 'mcq', 'Was bemängeln Kritiker an rein ökonomischen Betrachtungen?', 'Dass sie die individuelle Patientensituation nicht ausreichend berücksichtigen', ['Dass sie zu teuer sind', 'Dass sie die individuelle Patientensituation nicht ausreichend berücksichtigen', 'Dass sie zu langsam sind', 'Dass sie nur für Krankenhäuser gelten']),
     q(nextQid, 'gap-fill', 'Das IQWiG gibt Empfehlungen für die ____-Fähigkeit neuer Therapien.', 'Erstattungs', ['Anwendungs', 'Erstattungs', 'Zulassungs', 'Studien'])
   ], 'C1_lesson_25'),

  // L1: Organtransplantation
  p('C1_read_28', 'Organtransplantation und Wartelistenmanagement',
   'Die Organtransplantation ist eines der komplexesten Gebiete der modernen Medizin. Der Mangel an verfügbaren Spenderorganen führt zu langen Wartezeiten und einer hohen Sterblichkeit auf den Wartelisten. In Deutschland gilt die erweiterte Zustimmungslösung: Eine Organspende ist nur möglich, wenn der Verstorbene zu Lebzeiten ausdrücklich zugestimmt hat oder die Angehörigen zustimmen. Die Verteilung der Organe erfolgt über Eurotransplant nach medizinischen Kriterien wie Dringlichkeit, Erfolgsaussicht und Wartezeit. Ethische Konflikte entstehen bei der Frage, ob Suchterkrankte oder ältere Patienten benachteiligt werden. Transplantationszentren sind gesetzlich verpflichtet, ihre Wartelisten und Entscheidungskriterien transparent zu machen, um das Vertrauen in das System zu sichern.',
   [
     q(nextQid, 'mcq', 'Welches Modell der Organspende gilt in Deutschland?', 'Die erweiterte Zustimmungslösung', ['Die Widerspruchslösung', 'Die erweiterte Zustimmungslösung', ['Die Zustimmungslösung mit Angehörigenbefragung', 'Die Marktlösung']]),
     q(nextQid, 'true-false', 'Die Organverteilung erfolgt nach medizinischen Kriterien durch Eurotransplant.', 'true'),
     q(nextQid, 'mcq', 'Welche Kriterien sind für die Organverteilung maßgeblich?', 'Dringlichkeit, Erfolgsaussicht und Wartezeit', ['Alter und Geschlecht', 'Dringlichkeit, Erfolgsaussicht und Wartezeit', ['Wohnort und Beruf', 'Versicherungsstatus']]),
     q(nextQid, 'gap-fill', 'Der ____ an Spenderorganen führt zu langen Wartezeiten.', 'Mangel', ['Überschuss', 'Mangel', 'Bedarf', 'Zugang'])
   ], 'C1_lesson_1'),

  // L2: Genomische Medizin
  p('C1_read_29', 'Genomische Medizin und personalisierte Diagnostik',
   'Die Entschlüsselung des menschlichen Genoms hat der Medizin völlig neue Möglichkeiten eröffnet. Heute können genetische Risikofaktoren für zahlreiche Erkrankungen bereits vor ihrem Ausbruch identifiziert werden. Die Genomsequenzierung ermöglicht eine personalisierte Diagnostik und Therapie, insbesondere in der Onkologie, wo Tumormutationen gezielt mit maßgeschneiderten Wirkstoffen behandelt werden können. Allerdings wirft die Verfügbarkeit genetischer Daten auch ethische und rechtliche Fragen auf: Darf ein Arbeitgeber oder eine Versicherung genetische Informationen nutzen? Wie geht man mit Zufallsfunden um, die auf bisher unbekannte Erkrankungsrisiken hinweisen? Der Gesetzgeber hat mit dem Gendiagnostikgesetz einen rechtlichen Rahmen geschaffen, der die informationelle Selbstbestimmung der Patienten schützt und die Anwendung genetischer Untersuchungen regelt.',
   [
     q(nextQid, 'mcq', 'In welchem medizinischen Bereich werden Tumormutationen gezielt mit maßgeschneiderten Wirkstoffen behandelt?', 'In der Onkologie', ['In der Kardiologie', 'In der Onkologie', ['In der Orthopädie', 'In der Pädiatrie']]),
     q(nextQid, 'true-false', 'Das Gendiagnostikgesetz schützt die informationelle Selbstbestimmung der Patienten.', 'true'),
     q(nextQid, 'mcq', 'Welche ethischen Fragen wirft die Genomsequenzierung auf?', 'Nutzung genetischer Daten durch Arbeitgeber und Umgang mit Zufallsfunden', ['Kostenübernahme der Analyse', 'Nutzung genetischer Daten durch Arbeitgeber und Umgang mit Zufallsfunden', ['Dauer der Sequenzierung', 'Auswahl der Gene']]),
     q(nextQid, 'gap-fill', 'Die Genomsequenzierung ermöglicht eine personalisierte ____ und Therapie.', 'Diagnostik', ['Medikation', 'Diagnostik', 'Operation', 'Prognose'])
   ], 'C1_lesson_2'),

  // L3: Personalisierte Medizin
  p('C1_read_30', 'Personalisierte Medizin in der klinischen Praxis',
   'Die personalisierte Medizin zielt darauf ab, Behandlungen individuell auf die genetischen, molekularen und umweltbedingten Besonderheiten jedes Patienten abzustimmen. Anders als der traditionelle Ansatz, bei dem Standardtherapien für alle Patienten mit derselben Diagnose angewendet werden, berücksichtigt die personalisierte Medizin die Heterogenität von Erkrankungen. In der Onkologie ist dieser Ansatz bereits weit fortgeschritten: Biomarker-Tests bestimmen, ob ein Tumor auf bestimmte Medikamente anspricht. In anderen Fachgebieten wie der Kardiologie oder Rheumatologie steckt die Personalisierung noch in den Anfängen. Limitierende Faktoren sind die hohen Kosten der Genomanalysen, die komplexe Dateninterpretation und der Mangel an validierten Biomarkern. Die personalisierte Medizin könnte langfristig zu einer effizienteren und nebenwirkungsärmeren Behandlung führen.',
   [
     q(nextQid, 'mcq', 'Worauf zielt die personalisierte Medizin ab?', 'Behandlungen auf individuelle genetische und molekulare Besonderheiten abzustimmen', ['Standardtherapien für alle Patienten anzuwenden', 'Behandlungen auf individuelle genetische und molekulare Besonderheiten abzustimmen', ['Nur seltene Erkrankungen zu behandeln', 'Die Kosten medizinischer Behandlungen zu senken']]),
     q(nextQid, 'true-false', 'In der Kardiologie ist die personalisierte Medizin bereits weit fortgeschritten.', 'false'),
     q(nextQid, 'mcq', 'Welcher Faktor limitiert die personalisierte Medizin?', 'Hohe Kosten der Genomanalysen und Mangel an validierten Biomarkern', ['Mangel an geschultem Personal', 'Hohe Kosten der Genomanalysen und Mangel an validierten Biomarkern', ['Fehlende gesetzliche Grundlagen', 'Mangel an Patientenzustimmung']]),
     q(nextQid, 'gap-fill', 'Biomarker-Tests bestimmen, ob ein Tumor auf bestimmte ____ anspricht.', 'Medikamente', ['Operationen', 'Medikamente', 'Bestrahlungen', 'Diäten'])
   ], 'C1_lesson_3'),

  // L4: Ärztliche Professionalität
  p('C1_read_31', 'Ärztliche Professionalität und Berufsethos',
   'Ärztliche Professionalität umfasst weit mehr als fachliche Kompetenz. Sie beinhaltet eine Haltung, die durch Verantwortungsbewusstsein, Integrität, Empathie und die Ausrichtung am Patientenwohl geprägt ist. Der hippokratische Eid und das Genfer Gelöbnis formulieren die grundlegenden ethischen Verpflichtungen des Arztberufs. In der heutigen Zeit stehen Ärzte vor der Herausforderung, dieses Berufsethos unter erschwerten Bedingungen zu bewahren: Ökonomischer Druck, Zeitknappheit und bürokratische Anforderungen erschweren die patientenzentrierte Versorgung. Medizinische Fakultäten haben daher vermehrt Kurse zur professionellen Identitätsentwicklung in die Curricula aufgenommen. Studien zeigen, dass eine starke professionelle Identität Ärzte widerstandsfähiger gegen Burnout macht und die Qualität der Patientenversorgung verbessert.',
   [
     q(nextQid, 'mcq', 'Was umfasst ärztliche Professionalität neben fachlicher Kompetenz?', 'Verantwortungsbewusstsein, Integrität und Empathie', ['Nur die fachliche Kompetenz', 'Verantwortungsbewusstsein, Integrität und Empathie', ['Die wirtschaftliche Effizienz', 'Die administrative Erfahrung']]),
     q(nextQid, 'true-false', 'Eine starke professionelle Identität macht Ärzte anfälliger für Burnout.', 'false'),
     q(nextQid, 'mcq', 'Welche Faktoren erschweren die patientenzentrierte Versorgung heute?', 'Ökonomischer Druck, Zeitknappheit und bürokratische Anforderungen', ['Mangel an Medikamenten', 'Ökonomischer Druck, Zeitknappheit und bürokratische Anforderungen', ['Zu viele Patienten', 'Fehlende Technologie']]),
     q(nextQid, 'gap-fill', 'Das Genfer ____ formuliert die ethischen Verpflichtungen des Arztberufs.', 'Gelöbnis', ['Gesetz', 'Gelöbnis', 'Protokoll', 'Statut'])
   ], 'C1_lesson_4'),

  // L5: Kommunikation mit Angehörigen
  p('C1_read_32', 'Kommunikation mit Angehörigen kritisch kranker Patienten',
   'Die Kommunikation mit Angehörigen kritisch kranker Patienten ist eine der anspruchsvollsten Aufgaben im ärztlichen Alltag. In der Intensivmedizin oder Onkologie müssen Ärzte nicht nur den Patienten, sondern auch dessen Familie einfühlsam begleiten. Angehörige durchleben häufig eigene emotionale Krisen und benötigen klare, ehrliche Informationen über den Zustand und die Prognose des Patienten. Studien belegen, dass regelmäßige Angehörigengespräche die Zufriedenheit und das Verständnis verbessern und Konflikte reduzieren können. Besonders herausfordernd ist die Überbringung schlechter Nachrichten. Das SPIKES-Modell bietet eine strukturierte Gesprächsführung für diese Situationen und hat sich in der ärztlichen Ausbildung etabliert. Eine gute Kommunikation mit Angehörigen entlastet zudem die Pflegekräfte auf Station.',
   [
     q(nextQid, 'mcq', 'Welche emotionale Erfahrung durchleben Angehörige kritisch kranker Patienten häufig?', 'Eigene emotionale Krisen', ['Keine besonderen Reaktionen', 'Eigene emotionale Krisen', ['Nur positive Gefühle', 'Gleichgültigkeit']]),
     q(nextQid, 'true-false', 'Regelmäßige Angehörigengespräche reduzieren nachweislich Konflikte.', 'true'),
     q(nextQid, 'mcq', 'Welches Modell bietet eine strukturierte Gesprächsführung für die Überbringung schlechter Nachrichten?', 'Das SPIKES-Modell', ['Das Calgary-Cambridge-Modell', 'Das SPIKES-Modell', ['Das BATHE-Modell', 'Das FOUR-Modell']]),
     q(nextQid, 'gap-fill', 'Die Kommunikation mit Angehörigen gehört zu den ____ Aufgaben im ärztlichen Alltag.', 'anspruchsvollsten', ['einfachsten', 'anspruchsvollsten', 'seltensten', 'unnötigsten'])
   ], 'C1_lesson_5'),

  // L6: Digitale Gesundheitskompetenz
  p('C1_read_33', 'Digitale Gesundheitskompetenz von Patienten',
   'Die zunehmende Digitalisierung des Gesundheitswesens stellt neue Anforderungen an die Gesundheitskompetenz der Patienten. Immer mehr Menschen nutzen Gesundheits-Apps, Online-Symptomprüfer und medizinische Informationsportale. Diese Entwicklung birgt Chancen, aber auch Risiken: Während gut informierte Patienten eigenverantwortlicher handeln können, besteht die Gefahr von Fehlinformationen und WhatsApp-Theorien. Studien zeigen, dass die digitale Gesundheitskompetenz in der Bevölkerung stark variiert und insbesondere ältere und bildungsferne Gruppen benachteiligt sind. Ärzte stehen vor der Aufgabe, Patienten bei der Bewertung digitaler Gesundheitsinformationen zu unterstützen und gemeinsam evidenzbasierte Entscheidungen zu treffen. Gesundheitspolitische Maßnahmen zielen darauf ab, die digitale Gesundheitskompetenz durch Aufklärungskampagnen und Schulungen zu fördern.',
   [
     q(nextQid, 'mcq', 'Welche Risiken birgt die Nutzung digitaler Gesundheitsinformationen?', 'Fehlinformationen und nicht evidenzbasierte Inhalte', ['Zu hohe Kosten für die Patienten', 'Fehlinformationen und nicht evidenzbasierte Inhalte', ['Zeitaufwand für die Recherche', 'Mangel an verfügbaren Informationen']]),
     q(nextQid, 'true-false', 'Die digitale Gesundheitskompetenz ist in der Bevölkerung gleichmäßig verteilt.', 'false'),
     q(nextQid, 'mcq', 'Welche Aufgabe haben Ärzte im Zusammenhang mit digitaler Gesundheitskompetenz?', 'Patienten bei der Bewertung digitaler Gesundheitsinformationen zu unterstützen', ['Die Nutzung digitaler Angebote zu verbieten', 'Patienten bei der Bewertung digitaler Gesundheitsinformationen zu unterstützen', ['Selbst alle digitalen Angebote zu nutzen', 'Digitale Angebote zu entwickeln']]),
     q(nextQid, 'gap-fill', 'Die digitale ____ variiert in der Bevölkerung stark.', 'Gesundheitskompetenz', ['Bildung', 'Gesundheitskompetenz', 'Versorgung', 'Kommunikation'])
   ], 'C1_lesson_6'),
];

c1.push(...batch2b);
data.C1 = c1;
fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2B done: added C1_read_24 to C1_read_33');
console.log('C1 count now:', data.C1.length);
