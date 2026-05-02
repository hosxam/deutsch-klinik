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

const batch1c = [
  // 21. Sepsis protocols - L22
  l('C1_listen_24', 'Fortbildung: Sepsis-Protokoll',
   'Oberarzt: Guten Morgen, Kolleginnen und Kollegen. Willkommen zur monatlichen Fortbildung. Heute besprechen wir die aktualisierten Sepsis-Leitlinien. Sepsis ist ein medizinischer Notfall, bei dem jede Minute z\u00E4hlt.\n\nAssistenzarzt: Welche \u00C4nderungen gibt es gegen\u00FCber der alten Leitlinie?\n\nOberarzt: Der gr\u00F6\u00DFte Unterschied ist der Fokus auf die fr\u00FChe Erkennung. Wir verwenden jetzt den qSOFA-Score als Screening-Instrument. Drei Kriterien: Atemfrequenz, Bewusstsein und systolischer Blutdruck.\n\nAssistenzarztin: Und was ist die erste Ma\u00DFnahme bei Verdacht?\n\nOberarzt: Blutkulturen abnehmen, Breitbandantibiotikum geben und Volumentherapie starten. Alles innerhalb der ersten Stunde. Das Sepsis-Bundle muss innerhalb von 60 Minuten komplett sein.\n\nAssistenzarzt: Wie hoch ist die Letalit\u00E4t?\n\nOberarzt: Ohne fr\u00FChe Therapie liegt sie bei \u00FCber 30 Prozent. Mit konsequenter Umsetzung des Protokolls k\u00F6nnen wir sie auf unter 15 Prozent senken.',
   [
    mkq('mcq', 'Welches Screening-Instrument wird f\u00FCr die fr\u00FChe Sepsis-Erkennung genannt?', 'Der qSOFA-Score', ['Der Glasgow Coma Scale', 'Der qSOFA-Score', 'Der APACHE-II-Score', 'Der Barthel-Index']),
    mkq('true-false', 'Das Sepsis-Bundle muss innerhalb von 60 Minuten abgeschlossen sein.', 'true'),
    mkq('mcq', 'Welche drei Kriterien enth\u00E4lt der qSOFA-Score?', 'Atemfrequenz, Bewusstsein und systolischer Blutdruck', ['Puls, Temperatur und Sauerstoffs\u00E4ttigung', 'Atemfrequenz, Bewusstsein und systolischer Blutdruck', 'Leukozyten, CRP und Procalcitonin', 'Alter, Geschlecht und Vorerkrankungen']),
    mkq('gap-fill', 'Die erste Ma\u00DFnahme bei Sepsis-Verdacht ist: Blutkulturen, Antibiotikum und ____.', 'Volumentherapie', ['Sauerstoffgabe', 'Volumentherapie', 'Dialyse', 'Operation'])
   ], 'C1_lesson_22'),

  // 22. Health insurance reform - L23
  l('C1_listen_25', 'Diskussion: Reform der gesetzlichen Krankenversicherung',
   'Moderator: Die Beitr\u00E4ge zur gesetzlichen Krankenversicherung steigen weiter. Was sind die Ursachen, Herr Professor Dr. Schulz?\n\nProf. Schulz: Wir haben mehrere Faktoren. Die Bev\u00F6lkerung wird \u00E4lter, medizinische Leistungen werden teurer, und es gibt immer mehr chronisch Kranke. Der Generationsvertrag ger\u00E4t unter Druck.\n\nModerator: Welche L\u00F6sungen werden diskutiert?\n\nProf. Schulz: Die B\u00FCrgererversicherung, in die auch Beamte und Selbstst\u00E4ndige einzahlen, ist ein Modell. Oder die St\u00E4rkung des Wettbewerbs zwischen den Kassen. Die Politik ist sich uneinig.\n\nModerator: Was bedeutet das f\u00FCr die \u00E4rztliche Versorgung?\n\nProf. Schulz: Der Kostendruck f\u00FChrt zu Rationalisierung. Weniger Personal, k\u00FCrzere Liegezeiten, Fallpauschalen. Die Frage ist, ob die Qualit\u00E4t darunter leidet. Das sehen die \u00C4rzte kritisch.\n\nModerator: Und die Privatversicherung?\n\nProf. Schulz: Sie steht vor \u00E4hnlichen Herausforderungen. Die Demografie trifft auch sie. Die Alterungsr\u00FCckstellungen sind ein zentrales Problem.',
   [
    mkq('mcq', 'Welche Faktoren treiben die Krankenversicherungsbeitr\u00E4ge?', '\u00C4ltere Bev\u00F6lkerung, teurere Leistungen, mehr chronisch Kranke', ['Mehr \u00C4rzte und h\u00F6here Steuern', '\u00C4ltere Bev\u00F6lkerung, teurere Leistungen, mehr chronisch Kranke', 'Niedrigere L\u00F6hne und weniger Patienten', 'Weniger Krankenh\u00E4user und niedrigere Beitr\u00E4ge']),
    mkq('true-false', 'Die Privatversicherung ist von der demografischen Entwicklung nicht betroffen.', 'false'),
    mkq('mcq', 'Welches Reformmodell wird in der Diskussion genannt?', 'Die B\u00FCrgererversicherung', ['Die Kopfpauschale', 'Die B\u00FCrgererversicherung', 'Das Krankengeldmodell', 'Die Pr\u00E4mienentlastung']),
    mkq('gap-fill', 'Der Kostendruck f\u00FChrt zu ____ und k\u00FCrzeren Liegezeiten.', 'Rationalisierung', ['Mehr Personal', 'Rationalisierung', 'H\u00F6heren L\u00F6hnen', 'Mehr Betten'])
   ], 'C1_lesson_23'),

  // 23. Preventive medicine health check - L24
  l('C1_listen_26', 'Check-up-Gespr\u00E4ch: Prim\u00E4rpr\u00E4vention',
   '\u00C4rztin: Herr Wagner, sch\u00F6n, dass Sie zum Gesundheits-Check-up gekommen sind. Sie haben ja noch keine Beschwerden, richtig?\n\nPatient: Genau. Ich bin 48 und dachte, es ist Zeit, mal einen gro\u00DFen Check zu machen.\n\n\u00C4rztin: Sehr vern\u00FCnftig. Der Check-up ab 35 umfasst die Blutdruckmessung, Blutuntersuchung und eine Urinanalyse. Ich empfehle zus\u00E4tzlich einen Cholesterinwert und die Darmkrebsvorsorge.\n\nPatient: Muss ich da Angst haben?\n\n\u00C4rztin: Nein, \u00FCberhaupt nicht. Pr\u00E4vention bedeutet, Risiken fr\u00FCh zu erkennen. Bei Ihrem Alter empfehle ich auch die Hautkrebsvorsorge alle zwei Jahre. Und wir sollten \u00FCber Ihren Impfstatus sprechen.\n\nPatient: Welche Impfungen brauche ich?\n\n\u00C4rztin: Standard ist die Grippeimpfung f\u00FCr \u00DCber-60-J\u00E4hrige, aber ich empfehle sie allen. Dazu Tetanus, Diphtherie und Keuchhusten. Und wenn Sie viel im Ausland sind, vielleicht auch Hepatitis.',
   [
    mkq('mcq', 'Ab welchem Alter wird der gro\u00DFe Gesundheits-Check-up empfohlen?', 'Ab 35', ['Ab 30', 'Ab 35', 'Ab 40', 'Ab 50']),
    mkq('true-false', 'Die Hautkrebsvorsorge wird alle zwei Jahre empfohlen.', 'true'),
    mkq('mcq', 'Welche zus\u00E4tzlichen Untersuchungen empfiehlt die \u00C4rztin?', 'Cholesterinwert und Darmkrebsvorsorge', ['MRT und CT', 'Cholesterinwert und Darmkrebsvorsorge', 'Allergietest und Schilddr\u00FCsensonographie', 'Belastungs-EKG und Lungenfunktion']),
    mkq('gap-fill', 'Der Check-up umfasst Blutdruckmessung, Blutuntersuchung und eine ____.', 'Urinanalyse', ['R\u00F6ntgenaufnahme', 'Urinanalyse', 'Ultraschalluntersuchung', 'EKG-Ableitung'])
   ], 'C1_lesson_24'),

  // 24. Telemedicine consultation - L25
  l('C1_listen_27', 'Telemedizin-Sprechstunde',
   '\u00C4rztin: Guten Tag, Herr Schmidt. Sch\u00F6n, dass Sie die Videosprechstunde nutzen. Was kann ich f\u00FCr Sie tun?\n\nPatient: Ich habe seit drei Tagen Halsschmerzen und Schluckbeschwerden. Fieber habe ich nicht gemessen.\n\n\u00C4rztin: K\u00F6nnen Sie in den Spiegel schauen und mir beschreiben, wie Ihr Rachen aussieht? R\u00F6tungen? Bel\u00E4ge?\n\nPatient: Es ist rot, aber keine Bel\u00E4ge.\n\n\u00C4rztin: Das klingt nach einer viralen Rachenentz\u00FCndung. Antibiotika sind nicht n\u00F6tig. Ich empfehle: viel trinken, lutschen Sie Lutschpastillen und bei Bedarf Ibuprofen gegen die Schmerzen. Wenn es in drei Tagen nicht besser ist oder Fieber dazu kommt, kommen Sie in die Praxis.\n\nPatient: Danke, das ist sehr hilfreich. Kann ich sofort eine Krankschreibung bekommen?\n\n\u00C4rztin: Ja, ich kann Ihnen eine Krankschreibung f\u00FCr zwei Tage ausstellen. Sie erhalten sie per Post oder k\u00F6nnen sie in der Praxis abholen.',
   [
    mkq('mcq', 'Welche Symptome beschreibt der Patient?', 'Halsschmerzen und Schluckbeschwerden seit drei Tagen', ['Fieber und Husten', 'Halsschmerzen und Schluckbeschwerden seit drei Tagen', 'Ohrenschmerzen und Schwindel', 'Bauchschmerzen und \u00DCbelkeit']),
    mkq('true-false', 'Der Patient bekommt ein Antibiotikum verschrieben.', 'false'),
    mkq('mcq', 'Wie lange kann der Patient eine Krankschreibung bekommen?', 'F\u00FCr zwei Tage', ['F\u00FCr einen Tag', 'F\u00FCr zwei Tage', 'F\u00FCr eine Woche', 'Gar keine']),
    mkq('gap-fill', 'Wenn sich die Symptome nicht bessern, soll der Patient in die ____ kommen.', 'Praxis', ['Apotheke', 'Praxis', 'Notaufnahme', 'Reha-Klinik'])
   ], 'C1_lesson_25'),

  // 25. Medical research ethics - backfill L1
  l('C1_listen_28', 'Forschungskolloquium: Ethikvotum',
   'Professorin: Willkommen zum Forschungskolloquium. Frau Dr. Braun stellt heute ihr Projekt vor. Bitte.\n\nDr. Braun: Ich plane eine retrospektive Studie \u00FCber den Einsatz von ECMO bei ARDS-Patienten. Daf\u00FCr ben\u00F6tige ich ein Ethikvotum der zust\u00E4ndigen Kommission.\n\nProfessorin: Welche Daten wollen Sie erheben?\n\nDr. Braun: Krankenakten der letzten f\u00FCnf Jahre. Da es sich um eine reine Datenanalyse ohne zus\u00E4tzliche Belastung der Patienten handelt, hoffe ich auf ein vereinfachtes Verfahren.\n\nProfessorin: Bei retrospektiven Studien ist das meist unproblematisch. Aber achten Sie auf die Pseudonymisierung. Keine Patientennamen in Ihrer Auswertung.\n\nDr. Braun: Selbstverst\u00E4ndlich. Die Daten werden verschl\u00FCsselt und getrennt von den Identit\u00E4ten gespeichert.\n\nProfessorin: Gut. Dann w\u00FCnsche ich Ihnen viel Erfolg mit dem Antrag.',
   [
    mkq('mcq', 'Welche Art von Studie plant Dr. Braun?', 'Eine retrospektive Studie \u00FCber ECMO bei ARDS', ['Eine prospektive randomisierte Studie', 'Eine retrospektive Studie \u00FCber ECMO bei ARDS', 'Eine qualitative Befragungsstudie', 'Eine tierexperimentelle Studie']),
    mkq('true-false', 'F\u00FCr die Studie ist ein Ethikvotum erforderlich.', 'true'),
    mkq('mcq', 'Welchen Datenschutzstandard fordert die Professorin?', 'Pseudonymisierung der Patientendaten', ['Einwilligung aller Patienten', 'Pseudonymisierung der Patientendaten', 'Ver\u00F6ffentlichung aller Daten', 'L\u00F6schung der Akten nach Auswertung']),
    mkq('true-false', 'F\u00FCr die retrospektive Studie werden Patienten zus\u00E4tzlich untersucht.', 'false')
   ], 'C1_lesson_1'),

  // 26. Clinical handover - backfill L2
  l('C1_listen_29', '\u00DCbergabe im Schichtdienst: ISBAR',
   'Pfleger: Guten Morgen, \u00DCbergabe der Nachtwache f\u00FCr Zimmer 202. Patient Klaus Weber, 67 Jahre, Z. n. H\u00FCft-OP gestern.\n\n\u00C4rztin: Gab es Besonderheiten in der Nacht?\n\nPfleger: Ja, der Patient hatte um 2 Uhr starke Schmerzen, wir haben nach R\u00FCcksprache mit dem Hintergrunddienst Novalgin gegeben. Danach war er stabil.\n\n\u00C4rztin: Vitalparameter?\n\nPfleger: Blutdruck 130/80, Puls 78, Temperatur 37,2. Die Schmerzskala vor Novalgin war 7 von 10, danach 3.\n\n\u00C4rztin: Gut. Ich mache gleich Visite und schaue mir die Wunde an. Der Patient soll heute mobilisiert werden. Danke f\u00FCr die klare \u00DCbergabe.\n\nPfleger: Bitte sch\u00F6n. Die Infusion l\u00E4uft noch, der Zugang ist sauber.',
   [
    mkq('mcq', 'Welches \u00DCbergabesystem wird hier verwendet?', 'Eine strukturierte \u00DCbergabe mit Identifikation, Situation und Vitalwerten (ISBAR-\u00E4hnlich)', ['Eine formlose \u00DCbergabe', 'Eine strukturierte \u00DCbergabe mit Identifikation, Situation und Vitalwerten (ISBAR-\u00E4hnlich)', 'Eine schriftliche \u00DCbergabe per E-Mail', 'Eine Aufnahme per Telefon']),
    mkq('true-false', 'Der Patient hatte in der Nacht starke Schmerzen und bekam ein Schmerzmittel.', 'true'),
    mkq('mcq', 'Welche Schmerzskala-Angabe wurde gemacht?', 'Vor Medikation 7 von 10, danach 3 von 10', ['Vor Medikation 10 von 10, danach 0', 'Vor Medikation 7 von 10, danach 3 von 10', 'Vor Medikation 5 von 10, danach 5 von 10', 'Keine Angabe']),
    mkq('gap-fill', 'Der Patient soll heute ____ werden.', 'mobilisiert', ['entlassen', 'mobilisiert', 'operiert', 'verlegt'])
   ], 'C1_lesson_2'),

  // 27. Emergency triage - backfill L3
  l('C1_listen_30', 'Notaufnahme: Triage-Priorisierung',
   'Notfallpfleger: N\u00E4chster Patient, bitte. Wie ist Ihr Name?\n\nPatientin: Maria Schneider. Ich habe seit heute Morgen starke Unterbauchschmerzen.\n\nNotfallpfleger: Auf einer Skala von 1 bis 10?\n\nPatientin: Acht.\n\nNotfallpfleger: Haben Sie Fieber? \u00DCbelkeit?\n\nPatientin: Ja, Fieber habe ich gef\u00FChlt. Und mir ist \u00FCbel.\n\nNotfallpfleger: Sind Sie schwanger?\n\nPatientin: Das wei\u00DF ich nicht.\n\nNotfallpfleger: Dann nehmen Sie bitte Platz. Ich ordne Sie in Kategorie gelb ein. Ein Arzt kommt in K\u00FCrze. Wir werden noch Blut abnehmen und einen Ultraschall machen.\n\nPatientin: Wie lange muss ich warten?\n\nNotfallpfleger: Bei gelb etwa 30 bis 60 Minuten. Wenn es schlimmer wird, sagen Sie sofort Bescheid.',
   [
    mkq('mcq', 'In welche Triage-Kategorie wird die Patientin eingestuft?', 'Gelb', ['Rot', 'Gelb', 'Gr\u00FCn', 'Blau']),
    mkq('true-false', 'Die Patientin hat Unterbauchschmerzen mit Fieber und \u00DCbelkeit.', 'true'),
    mkq('mcq', 'Welche Untersuchungen werden angek\u00FCndigt?', 'Blutabnahme und Ultraschall', ['CT und R\u00F6ntgen', 'Blutabnahme und Ultraschall', 'MRT und EKG', 'Koloskopie und Gastroskopie']),
    mkq('gap-fill', 'Die Wartezeit f\u00FCr Kategorie gelb betr\u00E4gt etwa 30 bis 60 ____.', 'Minuten', ['Sekunden', 'Minuten', 'Stunden', 'Tage'])
   ], 'C1_lesson_3'),

  // 28. Pharmacology round - backfill L4
  l('C1_listen_31', 'Pharmakologische Visite: Medikationscheck',
   'Apothekerin: Guten Tag, Herr Dr. Weber. Ich mache heute den Medikationscheck f\u00FCr Ihre Station. Vor welchen Patienten sitzen wir?\n\nDr. Weber: Fangen wir mit Frau M\u00FCller an, 78 Jahre, sie bekommt Marcumar und mehrere neue Medikamente.\n\nApothekerin: Das ist ein Fall f\u00FCr uns. Marcumar hat viele Wechselwirkungen. Welche Diagnose hat sie?\n\nDr. Weber: Vorhofflimmern, arterielle Hypertonie und eine beginnende Niereninsuffizienz.\n\nApothekerin: Mit der Niereninsuffizienz m\u00FCssen wir vorsichtig sein. Ich empfehle, die INR engmaschig zu kontrollieren. Das Ciprofloxacin, das sie bekommt, kann die Wirkung von Marcumar verst\u00E4rken.\n\nDr. Weber: Sie haben recht. Ich werde die Dosis anpassen und morgen die INR bestimmen.\n\nApothekerin: Gut. N\u00E4chster Patient: Herr Schulz, 65 Jahre, mit neu verordnetem Metformin.',
   [
    mkq('mcq', 'Welches Medikament von Frau M\u00FCller hat viele Wechselwirkungen?', 'Marcumar', ['Metformin', 'Marcumar', 'Ciprofloxacin', 'Novalgin']),
    mkq('true-false', 'Ciprofloxacin kann die Wirkung von Marcumar verst\u00E4rken.', 'true'),
    mkq('mcq', 'Welche Grunderkrankungen hat Frau M\u00FCller?', 'Vorhofflimmern, Hypertonie und Niereninsuffizienz', ['Diabetes, Hypertonie und Asthma', 'Vorhofflimmern, Hypertonie und Niereninsuffizienz', 'Herzinsuffizienz, COPD und Gicht', 'Demenz, Osteoporose und An\u00E4mie']),
    mkq('gap-fill', 'Die ____ soll bei Frau M\u00FCller engmaschig kontrolliert werden.', 'INR', ['Temperatur', 'INR', 'Blutzucker', 'Blutdruck'])
   ], 'C1_lesson_4'),

  // 29. Discharge planning - backfill L5
  l('C1_listen_32', 'Sozialdienst: Entlassungsmanagement',
   'Sozialarbeiterin: Herr M\u00FCller, ich bin Frau Koch vom Sozialdienst. Ich m\u00F6chte mit Ihnen besprechen, wie es nach Ihrem Krankenhausaufenthalt weitergeht.\n\nPatient: Ich wei\u00DF noch nicht genau. Meine Frau kann mich nicht versorgen, sie ist selbst krank.\n\nSozialarbeiterin: Dann schauen wir, welche Optionen es gibt. Ben\u00F6tigen Sie eine Kurzzeitpflege oder kommen Sie mit ambulanter Unterst\u00FCtzung zurecht?\n\nPatient: Was w\u00FCrden Sie empfehlen?\n\nSozialarbeiterin: Wenn Sie wieder selbstst\u00E4ndig sind, reichen vielleicht ein Pflegedienst und Essen auf R\u00E4dern. F\u00FCr die \u00DCbergangszeit k\u00F6nnten wir eine Kurzzeitpflege im Pflegeheim organisieren.\n\nPatient: Und was kostet das?\n\nSozialarbeiterin: Die Krankenkasse \u00FCbernimmt einen Teil. Ich beantrage f\u00FCr Sie eine h\u00F6here Pflegestufe. Haben Sie eine Vorsorgevollmacht?\n\nPatient: Ja, meine Tochter hat die.\n\nSozialarbeiterin: Perfekt. Dann k\u00FCmmert sie sich um die Formalit\u00E4ten. Ich schreibe heute den Entlassungsbrief.',
   [
    mkq('mcq', 'Welche Unterst\u00FCtzung wird f\u00FCr die \u00DCbergangszeit vorgeschlagen?', 'Eine Kurzzeitpflege im Pflegeheim', ['Ein Klinikaufenthalt', 'Eine Kurzzeitpflege im Pflegeheim', 'Eine Reha-Ma\u00DFnahme', 'Ein ambulanter Pflegedienst']),
    mkq('true-false', 'Der Patient hat eine Vorsorgevollmacht f\u00FCr seine Tochter.', 'true'),
    mkq('mcq', 'Was wird f\u00FCr die Zeit nach der Kurzzeitpflege vorgeschlagen?', 'Pflegedienst und Essen auf R\u00E4dern', ['Vollstation\u00E4re Pflege', 'Pflegedienst und Essen auf R\u00E4dern', 'Umzug ins betreute Wohnen', 'H\u00E4usliche Pflege durch die Ehefrau']),
    mkq('gap-fill', 'Die Krankenkasse \u00FCbernimmt einen ____ der Kosten.', 'Teil', ['vollen Betrag', 'Teil', 'geringen Teil', 'keinen']),
   ], 'C1_lesson_5'),

  // 30. Epidemiology conference - backfill L6
  l('C1_listen_33', 'Epidemiologische Tagung: Impfquoten',
   'Referentin: Guten Morgen. Ich pr\u00E4sentiere heute Daten zu den Impfquoten in Deutschland. Wie Sie sehen, sind wir bei den Masernimpfungen noch weit vom WHO-Ziel entfernt.\n\nZuh\u00F6rer: Wo liegen die gr\u00F6\u00DFten Defizite?\n\nReferentin: Bei den Zweitimpfungen im Jugendalter. Viele Eltern vergessen die Auffrischung. Au\u00DFerdem gibt es regionale Unterschiede: In Bayern und Baden-W\u00FCrttemberg sind die Quoten niedriger als im Norden.\n\nZuh\u00F6rerin: Welche Rolle spielen Impfgegner?\n\nReferentin: Die Impfskepsis betrifft etwa f\u00FCnf Prozent der Bev\u00F6lkerung. Aber der gr\u00F6\u00DFere Effekt kommt von Impfvergesslichkeit und organisatorischen H\u00FCrden.\n\nZuh\u00F6rer: Was ist die L\u00F6sung?\n\nReferentin: Ein Impfregister w\u00FCrde helfen und die Einladungssysteme wie in Skandinavien. Au\u00DFerdem niedrigschwellige Angebote in Schulen und Betrieben.',
   [
    mkq('mcq', 'Wovon ist das WHO-Ziel noch weit entfernt?', 'Den Masernimpfquoten', ['Den Grippeimpfungen', 'Den Masernimpfquoten', 'Den COVID-Impfungen', 'Den Tetanusimpfungen']),
    mkq('true-false', 'Die gr\u00F6\u00DFten Defizite liegen bei den Erstimpfungen von Kleinkindern.', 'false'),
    mkq('mcq', 'Welche Ma\u00DFnahmen werden zur Verbesserung der Impfquoten vorgeschlagen?', 'Impfregister, Einladungssysteme und niedrigschwellige Angebote', ['Impfpflicht', 'Impfregister, Einladungssysteme und niedrigschwellige Angebote', 'H\u00F6here Strafen f\u00FCr Impfgegner', 'Mehr Impfstoffproduktion']),
    mkq('gap-fill', 'Die Impfskepsis betrifft etwa ____ Prozent der Bev\u00F6lkerung.', 'f\u00FCnf', ['zwei', 'f\u00FCnf', 'zehn', 'zwanzig'])
   ], 'C1_lesson_6'),
];

c1.push(...batch1c);
data.C1 = c1;
fs.writeFileSync('listening.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 1C done: added C1_listen_24 to C1_listen_33');
console.log('C1 count now:', data.C1.length);
