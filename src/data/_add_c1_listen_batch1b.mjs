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

const batch1b = [
  // 11. AI diagnostic tools - L12
  l('C1_listen_14', 'Vortrag: KI in der radiologischen Diagnostik',
   'Referent: Guten Morgen, meine Damen und Herren. Ich spreche heute über den Einsatz K\u00FCnstlicher Intelligenz in der radiologischen Diagnostik. Die Technologie hat sich rasant entwickelt.\n\nZuh\u00F6rerin: Welche konkreten Anwendungen gibt es schon?\n\nReferent: In der Mammographie-Screening-Programmen wird KI bereits eingesetzt, um auff\u00E4llige Befunde zu markieren. Die Treffsicherheit ist beeindruckend. Einige Studien zeigen, dass KI allein bei der Erkennung von Lungenkn\u00F6tchen mit erfahrenen Radiologen mithalten kann.\n\nZuh\u00F6rer: Ersetzt KI dann irgendwann den Radiologen?\n\nReferent: Das glaube ich nicht. KI ist ein Werkzeug, kein Ersatz. Der Radiologe beh\u00E4lt die letztendliche Verantwortung und muss die Befunde kritisch pr\u00FCfen. Die gr\u00F6\u00DFte Herausforderung ist die Validierung der Algorithmen an realen Patientendaten.\n\nZuh\u00F6rerin: Und die Haftung bei Fehldiagnosen?\n\nReferent: Das ist rechtlich noch nicht abschlie\u00DFend gekl\u00E4rt. Aktuell haftet der Arzt, der die KI anwendet.',
   [
    mkq('mcq', 'In welchem Bereich wird KI bereits in der Radiologie eingesetzt?', 'In Mammographie-Screening-Programmen', ['In der MRT-Diagnostik', 'In Mammographie-Screening-Programmen', 'In der Sonographie', 'In der Nuklearmedizin']),
    mkq('true-false', 'Der Referent glaubt, dass KI den Radiologen ersetzen wird.', 'false'),
    mkq('mcq', 'Was ist die gr\u00F6\u00DFte Herausforderung beim Einsatz von KI?', 'Die Validierung der Algorithmen an realen Patientendaten', ['Die Akzeptanz bei Patienten', 'Die Validierung der Algorithmen an realen Patientendaten', 'Die Anschaffungskosten', 'Die Stromversorgung']),
    mkq('gap-fill', 'Aktuell haftet der ____, der die KI anwendet.', 'Arzt', ['Hersteller', 'Arzt', 'Krankenhaustr\u00E4ger', 'Patient'])
   ], 'C1_lesson_12'),

  // 12. Clinical trial explanation - L13
  l('C1_listen_15', 'Aufkl\u00E4rungsgespr\u00E4ch: Klinische Studie',
   '\u00C4rztin: Herr M\u00FCller, sch\u00F6n dass Sie gekommen sind. Sie hatten ja Interesse an der Teilnahme an unserer klinischen Studie angemeldet. Ich m\u00F6chte Ihnen heute erkl\u00E4ren, worum es geht.\n\nPatient: Ja, gerne. Was wird denn genau untersucht?\n\n\u00C4rztin: Es geht um ein neues Medikament zur Behandlung von Rheumatoider Arthritis. Wir vergleichen es mit der aktuellen Standardtherapie. Die Studie ist randomisiert und doppelblind.\n\nPatient: Was bedeutet doppelblind?\n\n\u00C4rztin: Das hei\u00DFt, weder Sie noch ich wissen, ob Sie das neue Medikament oder das Standardmedikament erhalten. Das verhindert eine Beeinflussung der Ergebnisse.\n\nPatient: Und die Risiken?\n\n\u00C4rztin: \u00DCber die m\u00F6glichen Nebenwirkungen kl\u00E4ren wir Sie schriftlich auf. Sie k\u00F6nnen jederzeit und ohne Angabe von Gr\u00FCnden von der Studie zur\u00FCcktreten. Die Behandlung wird dann mit der Standardtherapie fortgesetzt.\n\nPatient: Das klingt gut. Ich m\u00F6chte teilnehmen.',
   [
    mkq('mcq', 'Was wird in der klinischen Studie untersucht?', 'Ein neues Medikament gegen Rheumatoide Arthritis', ['Ein neues Operationsverfahren', 'Ein neues Medikament gegen Rheumatoide Arthritis', 'Ein neues Diagnoseverfahren', 'Eine neue Physiotherapiemethode']),
    mkq('true-false', 'Die Studie ist doppelblind, das hei\u00DFt Arzt und Patient kennen die Gruppenzuteilung nicht.', 'true'),
    mkq('mcq', 'Was kann der Patient im Verlauf der Studie tun?', 'Jederzeit ohne Angabe von Gr\u00FCnden zur\u00FCcktreten', ['Die Studie nicht mehr verlassen', 'Jederzeit ohne Angabe von Gr\u00FCnden zur\u00FCcktreten', 'Das Studienmedikament selbst w\u00E4hlen', 'Die Ergebnisse einsehen']),
    mkq('gap-fill', 'Die Studie ist randomisiert und ____.', 'doppelblind', ['offen', 'doppelblind', 'einfachblind', 'kontrolliert'])
   ], 'C1_lesson_13'),

  // 13. Resource allocation debate - L14
  l('C1_listen_16', 'Debatte: Verteilung knapper Intensivbetten',
   'Moderator: Willkommen zur Gesundheitsdebatte. Heute: die Verteilung von Intensivbetten in der Krise. Frau Dr. Wagner von der Intensivstation, Herr Professor Meier vom Ethikrat.\n\nDr. Wagner: Wir stehen regelm\u00E4\u00DFig vor der Situation, dass wir nicht gen\u00FCgend Betten f\u00FCr alle Patienten haben. In der Pandemie wurde das besonders deutlich. Wir m\u00FCssen dann priorisieren.\n\nProf. Meier: Die Medizinethik bietet verschiedene Kriterien: die medizinische Dringlichkeit, die Erfolgsaussicht, aber auch den Grundsatz der Gleichbehandlung. Keines dieser Kriterien ist absolut.\n\nDr. Wagner: In der Praxis entscheiden wir nach dem Dringlichkeitsprinzip. Der Patient mit der akutesten Lebensgefahr kommt zuerst. Aber das f\u00FChrt zu schwierigen Abw\u00E4gungen.\n\nProf. Meier: Genau. Deshalb brauchen wir transparente Kriterien, die im Vorfeld festgelegt werden. Kein Arzt sollte unter Zeitdruck allein \u00FCber Leben und Tod entscheiden m\u00FCssen.',
   [
    mkq('mcq', 'Nach welchem Prinzip wird auf der Intensivstation priorisiert?', 'Nach dem Dringlichkeitsprinzip', ['Nach dem Alter der Patienten', 'Nach dem Dringlichkeitsprinzip', 'Nach dem Zufallsprinzip', 'Nach der Krankenkassenzugeh\u00F6rigkeit']),
    mkq('true-false', 'Professor Meier fordert transparente, im Vorfeld festgelegte Kriterien.', 'true'),
    mkq('mcq', 'Welche Kriterien nennt die Medizinethik f\u00FCr die Verteilung?', 'Medizinische Dringlichkeit, Erfolgsaussicht und Gleichbehandlung', ['Alter, Geschlecht und Beruf', 'Medizinische Dringlichkeit, Erfolgsaussicht und Gleichbehandlung', 'Versicherungsstatus, Herkunft und sozialer Status', 'Kosten, Nutzen und Effizienz']),
    mkq('true-false', 'Die Priorisierung war vor der Pandemie nie ein Problem.', 'false')
   ], 'C1_lesson_14'),

  // 14. Intercultural care training - L15
  l('C1_listen_17', 'Workshop: Interkulturelle Kompetenz im Krankenhaus',
   'Trainerin: Herzlich willkommen zum Workshop Interkulturelle Kompetenz. Wir besch\u00E4ftigen uns heute mit der Frage, wie wir Patienten aus verschiedenen Kulturen besser versorgen k\u00F6nnen. Frau Dr. Yilmaz, Sie haben t\u00FCrkische Wurzeln. Was sind Ihre Erfahrungen?\n\nDr. Yilmaz: Eine h\u00E4ufige Herausforderung ist das Verst\u00E4ndnis von Krankheit und Gesundheit. In manchen Kulturen wird Krankheit als Schicksal oder Pr\u00FCfung gesehen. Das beeinflusst die Therapiemotivation.\n\nTrainerin: Was empfehlen Sie f\u00FCr die Praxis?\n\nDr. Yilmaz: Wichtig ist, nachzufragen, wie der Patient seine Situation versteht. Nicht jede kulturelle Besonderheit muss man kennen, aber man sollte offen nachfragen. Auch die Einbeziehung der Familie ist in vielen Kulturen zentral.\n\nTrainerin: Und bei Sprachbarrieren?\n\nDr. Yilmaz: Professionelle Dolmetscher sind Gold wert. Familienangeh\u00F6rige zu \u00FCbersetzen ist problematisch, besonders bei schwierigen Diagnosen. Datenschutz ist dabei nat\u00FCrlich zu beachten.',
   [
    mkq('mcq', 'Was beeinflusst laut Dr. Yilmaz die Therapiemotivation von Patienten?', 'Das kulturelle Verst\u00E4ndnis von Krankheit und Gesundheit', ['Der Bildungsgrad', 'Das kulturelle Verst\u00E4ndnis von Krankheit und Gesundheit', 'Das Einkommen', 'Die Krankenversicherung']),
    mkq('true-false', 'Professionelle Dolmetscher werden als problematisch f\u00FCr die Verst\u00E4ndigung angesehen.', 'false'),
    mkq('mcq', 'Was wird zur Einbeziehung der Familie gesagt?', 'Die Einbeziehung der Familie ist in vielen Kulturen zentral', ['Familienangeh\u00F6rige sollten immer \u00FCbersetzen', 'Die Einbeziehung der Familie ist in vielen Kulturen zentral', 'Die Familie hat kein Mitspracherecht', 'Die Familie sollte immer anwesend sein']),
    mkq('gap-fill', 'Familienangeh\u00F6rige zum ____ ist besonders bei schwierigen Diagnosen problematisch.', '\u00DCbersetzen', ['Dolmetschen', '\u00DCbersetzen', 'Begleiten', 'Beraten'])
   ], 'C1_lesson_15'),

  // 15. Medical error disclosure - L16
  l('C1_listen_18', 'Gespr\u00E4ch nach einem Zwischenfall',
   'Oberarzt: Herr Schmidt, ich m\u00F6chte mit Ihnen \u00FCber den gestrigen Zwischenfall sprechen. Bei Ihrem Aufenthalt ist uns leider ein Fehler unterlaufen.\n\nPatient: Ein Fehler? Was ist passiert?\n\nOberarzt: Wir haben Ihnen versehentlich ein Medikament verabreicht, das f\u00FCr einen anderen Patienten bestimmt war. Es handelt sich um ein Blutdruckmedikament. Wir haben den Fehler sofort bemerkt und die Behandlung abgebrochen.\n\nPatient: Habe ich jetzt Sch\u00E4den davongetragen?\n\nOberarzt: Wir haben Sie intensiv \u00FCberwacht. Es gab keine negativen Auswirkungen auf Ihre Gesundheit. Wir haben den Vorfall im Fehlermeldesystem dokumentiert und werden unsere Prozesse \u00FCberpr\u00FCfen.\n\nPatient: Ich bin froh, dass nichts passiert ist. Aber es verunsichert mich schon.\n\nOberarzt: Das verstehe ich. Wir nehmen den Vorfall sehr ernst. Ich entschuldige mich in aller Form. Haben Sie Fragen dazu?\n\nPatient: Nein, im Moment nicht. Danke f\u00FCr die Offenheit.',
   [
    mkq('mcq', 'Was ist dem Patienten versehentlich verabreicht worden?', 'Ein f\u00FCr einen anderen Patienten bestimmtes Medikament', ['Eine falsche Dosis seines Medikaments', 'Ein f\u00FCr einen anderen Patienten bestimmtes Medikament', 'Ein abgelaufenes Medikament', 'Eine zu hohe Dosis']),
    mkq('true-false', 'Der Patient hat durch den Fehler gesundheitliche Sch\u00E4den davongetragen.', 'false'),
    mkq('mcq', 'Was hat das Krankenhaus nach dem Vorfall unternommen?', 'Den Vorfall dokumentiert und die Prozesse \u00FCberpr\u00FCft', ['Den Arzt entlassen', 'Den Vorfall dokumentiert und die Prozesse \u00FCberpr\u00FCft', 'Das Medikament aus dem Verkehr gezogen', 'Die Station geschlossen']),
    mkq('true-false', 'Der Oberarzt hat sich f\u00FCr den Vorfall entschuldigt.', 'true')
   ], 'C1_lesson_16'),

  // 16. Antibiotic stewardship roundtable - L17
  l('C1_listen_19', 'ABS-Roundtable: Rationaler Antibiotikaeinsatz',
   'Vorsitzende: Willkommen zum ABS-Team-Meeting. Wir besprechen heute die Resistenzlage auf unserer Station. Herr Dr. Klein, welche F\u00E4lle haben Sie?\n\nDr. Klein: Wir hatten in dieser Woche drei Patienten mit multiresistenten Erregern. Bei zwei F\u00E4llen handelte es sich um MRSA, bei einem um ESBL-bildende Bakterien.\n\nVorsitzende: Wurden vorher Antibiotika eingesetzt?\n\nDr. Klein: Ja, leider. Bei einem Patienten wurde bereits in der Notaufnahme mit einem Breitbandantibiotikum begonnen, ohne dass ein Erregernachweis vorlag.\n\nVorsitzende: Genau das wollen wir vermeiden. Wichtig ist: Vor jeder Antibiotikatherapie sollte, wenn m\u00F6glich, ein Erregernachweis erfolgen. Und wir m\u00FCssen die Therapie nach Erhalt des Antibiogramms gezielt anpassen.\n\nApotheker: Ich m\u00F6chte erg\u00E4nzen, dass wir die Dosierung bei Niereninsuffizienz anpassen m\u00FCssen. Das wird oft vergessen.\n\nVorsitzende: Guter Punkt. Wir versch\u00E4rfen die Kontrollen: Jede Antibiotikaverordnung ab morgen muss durch das ABS-Team freigegeben werden.',
   [
    mkq('mcq', 'Mit welchen multiresistenten Erregern wurde in dieser Woche gek\u00E4mpft?', 'MRSA und ESBL-bildende Bakterien', ['MRSA und VRE', 'MRSA und ESBL-bildende Bakterien', 'Pseudomonas und Acinetobacter', 'Clostridium difficile']),
    mkq('true-false', 'Breitbandantibiotika sollten ohne Erregernachweis eingesetzt werden.', 'false'),
    mkq('mcq', 'Was muss bei der Antibiotikadosierung beachtet werden?', 'Die Anpassung bei Niereninsuffizienz', ['Die Gabe zusammen mit Milchprodukten', 'Die Anpassung bei Niereninsuffizienz', 'Die Einnahme n\u00FCchtern', 'Die Kombination mit Alkohol']),
    mkq('gap-fill', 'Vor jeder Antibiotikatherapie sollte ein ____ erfolgen.', 'Erregernachweis', ['Blutbild', 'Erregernachweis', 'Allergietest', 'R\u00F6ntgen'])
   ], 'C1_lesson_17'),

  // 17. Chronic disease management - L18
  l('C1_listen_20', 'Schulung: Diabetes-Selbstmanagement',
   'Diabetesberaterin: Guten Morgen, meine Damen und Herren. Willkommen zur Schulung Diabetes-Selbstmanagement. Wir besprechen heute, wie Sie Ihren Blutzucker im Alltag im Griff behalten.\n\nTeilnehmerin: Ich habe Angst vor Unterzuckerungen. Woran erkenne ich sie rechtzeitig?\n\nDiabetesberaterin: Typische Fr\u00FChsymptome sind Zittern, Schwitzen, Herzklopfen und Hei\u00DFhunger. Wenn Sie das bemerken, messen Sie sofort den Blutzucker. Liegt er unter 70 mg\/dl, m\u00FCssen Sie schnell wirksame Kohlenhydrate zu sich nehmen, zum Beispiel Traubenzucker oder Saft.\n\nTeilnehmer: Und wie vermeide ich Unterzuckerungen?\n\nDiabetesberaterin: Regelm\u00E4\u00DFige Mahlzeiten, angepasste Insulindosierung und Bewegung sind entscheidend. Besprechen Sie Ihre Werte regelm\u00E4\u00DFig mit Ihrem Arzt. Eine gute Dokumentation hilft, Muster zu erkennen.\n\nTeilnehmerin: Darf ich trotz Diabetes S\u00FC\u00DFes essen?\n\nDiabetesberaterin: In Ma\u00DFen ja. Aber z\u00E4hlen Sie die Kohlenhydrate und passen Sie die Insulindosis entsprechend an. Verzichten m\u00FCssen Sie auf nichts.',
   [
    mkq('mcq', 'Welche Fr\u00FChsymptome einer Unterzuckerung werden genannt?', 'Zittern, Schwitzen, Herzklopfen und Hei\u00DFhunger', ['Kopfschmerzen und M\u00FCdigkeit', 'Zittern, Schwitzen, Herzklopfen und Hei\u00DFhunger', '\u00DCbelkeit und Erbrechen', 'Durst und h\u00E4ufiges Wasserlassen']),
    mkq('true-false', 'Bei einem Blutzucker unter 70 mg\/dl sollte man schnell wirksame Kohlenhydrate zu sich nehmen.', 'true'),
    mkq('mcq', 'Was ist entscheidend, um Unterzuckerungen zu vermeiden?', 'Regelm\u00E4\u00DFige Mahlzeiten, angepasste Insulin- und Bewegungsdosis', ['V\u00F6lliger Verzicht auf Kohlenhydrate', 'Regelm\u00E4\u00DFige Mahlzeiten, angepasste Insulin- und Bewegungsdosis', 'Nur einmal t\u00E4glich essen', 'Viel Fett essen']),
    mkq('true-false', 'Diabetiker m\u00FCssen vollst\u00E4ndig auf S\u00FC\u00DFes verzichten.', 'false')
   ], 'C1_lesson_18'),

  // 18. Orthopedic rehabilitation planning - L19
  l('C1_listen_21', 'Rehaplanung nach H\u00FCft-OP',
   'Physiotherapeutin: Herr Becker, ich bin Frau Schulz von der Physiotherapie. Morgen werden Sie an der H\u00FCfte operiert. Heute besprechen wir die Nachbehandlung.\n\nPatient: Wann kann ich nach der OP wieder laufen?\n\nPhysiotherapeutin: Am ersten Tag nach der OP werden wir Sie bereits mobilisieren. Zun\u00E4chst am Bettrand sitzen, dann mit dem Rollator ein paar Schritte gehen. Die Physiotherapie beginnt am OP-Tag selbst mit Atem\u00FCbungen.\n\nPatient: Wie lange muss ich mit Kr\u00FCcken laufen?\n\nPhysiotherapeutin: Das h\u00E4ngt vom Operationsverfahren ab. Bei einem minimalinvasiven Eingriff oft nur zwei bis drei Wochen, bei einem offenen Verfahren sechs bis acht Wochen. Aber das entscheidet Ihr Chirurg.\n\nPatient: Und wann kann ich wieder arbeiten?\n\nPhysiotherapeutin: Bei einem B\u00FCrojob nach etwa sechs Wochen, bei k\u00F6rperlicher Arbeit nach drei bis vier Monaten. Wichtig ist, dass Sie die \u00DCbungen regelm\u00E4\u00DFig machen. Die Rehabilitation ist entscheidend f\u00FCr den Erfolg der Operation.',
   [
    mkq('mcq', 'Wann beginnt die Mobilisation nach der H\u00FCft-OP?', 'Am ersten Tag nach der OP', ['Nach einer Woche', 'Am ersten Tag nach der OP', 'Nach zwei Wochen', 'Nach einem Monat']),
    mkq('true-false', 'Bei einem minimalinvasiven Eingriff sind Kr\u00FCcken oft nur zwei bis drei Wochen n\u00F6tig.', 'true'),
    mkq('mcq', 'Wann kann ein B\u00FCroangestellter nach der OP wieder arbeiten?', 'Nach etwa sechs Wochen', ['Nach zwei Wochen', 'Nach etwa sechs Wochen', 'Nach drei Monaten', 'Nach einem Jahr']),
    mkq('gap-fill', 'Die Rehabilitation ist entscheidend f\u00FCr den ____ der Operation.', 'Erfolg', ['Verlauf', 'Erfolg', 'Zeitpunkt', 'Beginn'])
   ], 'C1_lesson_19'),

  // 19. Trust in doctor-patient relationships - L20
  l('C1_listen_22', 'Radiobeitrag: Vertrauen in die Arzt-Patienten-Beziehung',
   'Reporterin: Vertrauen in die Medizin ist ein gro\u00DFes Thema. Ich spreche heute mit dem Medizinethiker Professor Dr. Wagner. Herr Professor, wie wichtig ist Vertrauen f\u00FCr den Behandlungserfolg?\n\nProf. Wagner: Vertrauen ist fundamental. Studien zeigen, dass Patienten mit einem vertrauensvollen Verh\u00E4ltnis zu ihrem Arzt bessere Therapieergebnisse erzielen. Sie nehmen Medikamente zuverl\u00E4ssiger ein und kommen zu Kontrollterminen.\n\nReporterin: Was gef\u00E4hrdet das Vertrauen?\n\nProf. Wagner: Zeitdruck ist ein gro\u00DFer Faktor. Wenn der Arzt keine Zeit f\u00FCr den Patienten hat, f\u00FChlt dieser sich nicht ernst genommen. Auch Kommunikationsfehler sind h\u00E4ufig. Ein weiteres Problem ist die zunehmende B\u00FCrokratie.\n\nReporterin: Wie kann man Vertrauen aufbauen?\n\nProf. Wagner: Indem man dem Patienten auf Augenh\u00F6he begegnet, aktiv zuh\u00F6rt und Entscheidungen transparent macht. Eine vertrauensvolle Beziehung entsteht nicht \u00FCber Nacht, sie muss aufgebaut und gepflegt werden.',
   [
    mkq('mcq', 'Was zeigen Studien zum Zusammenhang zwischen Vertrauen und Behandlungserfolg?', 'Vertrauensvolle Patienten erzielen bessere Behandlungsergebnisse', ['Vertrauen hat keinen Einfluss auf den Behandlungserfolg', 'Vertrauensvolle Patienten erzielen bessere Behandlungsergebnisse', 'Vertrauen verschlechtert die Ergebnisse', 'Vertrauen ist nur f\u00FCr die Psyche wichtig']),
    mkq('true-false', 'Zeitdruck gef\u00E4hrdet das Vertrauensverh\u00E4ltnis zwischen Arzt und Patient.', 'true'),
    mkq('mcq', 'Was empfiehlt Professor Wagner f\u00FCr den Vertrauensaufbau?', 'Auf Augenh\u00F6he begegnen, aktiv zuh\u00F6ren, transparent entscheiden', ['Mehr Zeit f\u00FCr B\u00FCrokratie', 'Auf Augenh\u00F6he begegnen, aktiv zuh\u00F6ren, transparent entscheiden', 'Weniger Gespr\u00E4che mit Patienten', 'Schnellere Diagnosen stellen']),
    mkq('true-false', 'Eine vertrauensvolle Beziehung entsteht \u00FCber Nacht.', 'false')
   ], 'C1_lesson_20'),

  // 20. Burnout and workload - L21
  l('C1_listen_23', 'Arbeitsbelastung und Burnout bei Medizinern',
   'Moderator: Frau Dr. Berger, Sie forschen zur psychischen Gesundheit von \u00C4rzten. Wie ist die aktuelle Lage?\n\nDr. Berger: Besorgniserregend. Etwa ein Drittel der Krankenhaus\u00E4rzte zeigt Burnout-Symptome. Die Hauptfaktoren sind \u00DCberstunden, Personalmangel und die emotionale Belastung durch schwierige Patientenschicksale.\n\nModerator: Welche Berufsgruppen sind besonders betroffen?\n\nDr. Berger: Intensivmediziner, Notfallmediziner und Onkologen sind \u00FCberdurchschnittlich gef\u00E4hrdet. Aber auch junge \u00C4rzte in der Weiterbildung leiden stark unter dem Druck.\n\nModerator: Was kann man dagegen tun?\n\nDr. Berger: Strukturelle Ma\u00DFnahmen sind notwendig: bessere Arbeitszeitmodelle, mehr Personal, Entlastung von B\u00FCrokratie. Aber auch individuelle Angebote wie Supervision und Balint-Gruppen helfen.\n\nModerator: Ist das Problem erkannt?\n\nDr. Berger: Inzwischen ja. Viele Kliniken haben betriebliches Gesundheitsmanagement eingef\u00FChrt. Aber die Umsetzung hinkt hinterher.',
   [
    mkq('mcq', 'Welcher Anteil der Krankenhaus\u00E4rzte zeigt Burnout-Symptome?', 'Etwa ein Drittel', ['Etwa zehn Prozent', 'Etwa ein Drittel', 'Etwa die H\u00E4lfte', 'Fast alle']),
    mkq('true-false', 'Intensivmediziner und Notfallmediziner sind besonders burn-out-gef\u00E4hrdet.', 'true'),
    mkq('mcq', 'Welche strukturellen Ma\u00DFnahmen werden vorgeschlagen?', 'Bessere Arbeitszeitmodelle, mehr Personal und Entlastung von B\u00FCrokratie', ['Mehr Gehalt und weniger Urlaub', 'Bessere Arbeitszeitmodelle, mehr Personal und Entlastung von B\u00FCrokratie', 'L\u00E4ngere Schichten und mehr Patienten', 'Weniger Fortbildungen']),
    mkq('gap-fill', 'Viele Kliniken haben betriebliches ____ eingef\u00FChrt.', 'Gesundheitsmanagement', ['Qualit\u00E4tsmanagement', 'Gesundheitsmanagement', 'Risikomanagement', 'Beschwerdemanagement'])
   ], 'C1_lesson_21'),
];

c1.push(...batch1b);
data.C1 = c1;
fs.writeFileSync('listening.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 1B done: added C1_listen_14 to C1_listen_23');
console.log('C1 count now:', data.C1.length);
