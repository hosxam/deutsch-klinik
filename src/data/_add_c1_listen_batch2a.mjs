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

const batch2a = [
  // 31. Hospice conversation - L11
  l('C1_listen_34', 'Hospiz: Begleitung am Lebensende',
   'Hospizmitarbeiterin: Guten Tag, Frau Wagner. Ich bin Schwester Klara vom Hospizdienst. Ich werde Ihren Mann in den n\u00E4chsten Tagen begleiten.\n\nFrau Wagner: Mein Mann hat nicht mehr lange, sagen die \u00C4rzte. Ich wei\u00DF nicht, wie ich damit umgehen soll.\n\nHospizmitarbeiterin: Das ist eine sehr schwere Situation. Wir sind nicht nur f\u00FCr Ihren Mann da, sondern auch f\u00FCr Sie. Haben Sie jemanden, mit dem Sie sprechen k\u00F6nnen?\n\nFrau Wagner: Ja, meine Tochter hilft mir. Aber es ist alles so \u00FCberw\u00E4ltigend.\n\nHospizmitarbeiterin: Das verstehe ich. Wir arbeiten nach dem Konzept der ganzheitlichen Palliativversorgung. Das bedeutet: Schmerzlinderung, Angstabbau, spirituelle Begleitung. Wir m\u00F6chten, dass Ihr Mann w\u00FCrdevoll gehen kann.\n\nFrau Wagner: Kann ich etwas tun, um ihm zu helfen?\n\nHospizmitarbeiterin: Seien Sie einfach da. Halten Sie seine Hand. Reden Sie mit ihm. H\u00F6ren ist genauso wichtig wie Sprechen.',
   [
    mkq('mcq', 'Nach welchem Konzept arbeitet der Hospizdienst?', 'Ganzheitliche Palliativversorgung', ['Aktive Sterbehilfe', 'Ganzheitliche Palliativversorgung', 'Kurative Intensivtherapie', 'Alternative Medizin']),
    mkq('true-false', 'Der Hospizdienst ist nur f\u00FCr den Patienten da, nicht f\u00FCr die Angeh\u00F6rigen.', 'false'),
    mkq('mcq', 'Welche Aspekte geh\u00F6ren zur ganzheitlichen Palliativversorgung?', 'Schmerzlinderung, Angstabbau und spirituelle Begleitung', ['Nur Schmerzlinderung', 'Schmerzlinderung, Angstabbau und spirituelle Begleitung', 'Medikament\u00F6se Behandlung', 'Physiotherapie und Ergotherapie']),
    mkq('gap-fill', 'Der Patient soll w\u00FCrdevoll ____ k\u00F6nnen.', 'gehen', ['leben', 'gehen', 'schlafen', 'genesen'])
   ], 'C1_lesson_11'),

  // 32. Medical journal club - L7
  l('C1_listen_35', 'Journal Club: Aktuelle Publikation',
   'Fellow: Hallo zusammen. F\u00FCr den heutigen Journal Club habe ich eine aktuelle Studie aus dem New England Journal ausgew\u00E4hlt. Es geht um den Vergleich von zwei Operationstechniken bei Knie-TEP.\n\nChefarzt: Interessant. Was ist die Fragestellung?\n\nFellow: Die Autoren wollten wissen, ob die computerassistierte Navigation gegen\u00FCber der konventionellen Technik bessere klinische Ergebnisse liefert.\n\nOberarzt: Studiendesign?\n\nFellow: Multizentrische, randomisierte kontrollierte Studie mit 500 Patienten. Nachbeobachtungszeit zwei Jahre.\n\nChefarzt: Ergebnisse?\n\nFellow: \u00DCberraschenderweise zeigte sich kein signifikanter Unterschied in den klinischen Scores. Die navigierte OP war signifikant l\u00E4nger, hatte aber eine geringere Rate an Fehlstellungen.\n\nOberarzt: Was bedeutet das f\u00FCr unsere Klinik?\n\nFellow: Wir sollten die Navigation weiter einsetzen, aber standardm\u00E4\u00DFig. Der Zeitverlust ist vertretbar, wenn die Pr\u00E4zision steigt.',
   [
    mkq('mcq', 'Was wurde in der Studie verglichen?', 'Computerassistierte Navigation vs. konventionelle Technik bei Knie-TEP', ['Knie-TEP vs. H\u00FCft-TEP', 'Computerassistierte Navigation vs. konventionelle Technik bei Knie-TEP', 'Fr\u00FChe vs. sp\u00E4te Mobilisation', 'Zwei verschiedene Implantat-Modelle']),
    mkq('true-false', 'Die navigierte OP zeigte signifikant bessere klinische Ergebnisse.', 'false'),
    mkq('mcq', 'Welchen Vorteil hatte die navigierte OP?', 'Geringere Rate an Fehlstellungen', ['K\u00FCrzere Operationszeit', 'Geringere Rate an Fehlstellungen', 'H\u00F6here Patientenzufriedenheit', 'Schnellere Entlassung']),
    mkq('true-false', 'Der Fellow empfiehlt, die Navigation weiter einzusetzen.', 'true')
   ], 'C1_lesson_7'),

  // 33. Quality circle - L8
  l('C1_listen_36', 'Qualit\u00E4tszirkel: Medikationsfehler vermeiden',
   'Qualit\u00E4tsmanagerin: Willkommen zum Qualit\u00E4tszirkel. Thema heute ist die Reduktion von Medikationsfehlern. Wir hatten im letzten Quartal 15 dokumentierte Vorf\u00E4lle. Das ist zu viel.\n\nStationsapotheker: Die h\u00E4ufigsten Fehler sind Verwechslungen von \u00E4hnlich klingenden Medikamenten. Zum Beispiel Novalgin und Novaminsulfon oder Amoxicillin und Ampicillin.\n\nPflegekraft: In der Hektik auf Station passiert das schnell. Wir brauchen ein besseres System.\n\nQualit\u00E4tsmanagerin: Vorschlag: Wir f\u00FChren eine Doppel-Check-Pflicht bei Hochrisikomedikamenten ein. Au\u00DFerdem trennen wir die Lagerung von \u00E4hnlichen Pr\u00E4paraten.\n\nOberarzt: Und scannen wir die Medikamente direkt am Patientenbett.\n\nQualit\u00E4tsmanagerin: Gute Idee. Wir testen das zun\u00E4chst auf einer Pilotstation.',
   [
    mkq('mcq', 'Wie viele Medikationsfehler gab es im letzten Quartal?', '15', ['5', '15', '25', '50']),
    mkq('true-false', '\u00C4hnlich klingende Medikamentennamen sind eine h\u00E4ufige Fehlerursache.', 'true'),
    mkq('mcq', 'Welche Ma\u00DFnahmen werden zur Fehlerreduktion vorgeschlagen?', 'Doppel-Check-Pflicht, getrennte Lagerung, Scannen am Patientenbett', ['Mehr Personal', 'Doppel-Check-Pflicht, getrennte Lagerung, Scannen am Patientenbett', 'Weniger Medikamente verschreiben', 'L\u00E4ngere Arbeitszeiten']),
    mkq('true-false', 'Die Ma\u00DFnahmen sollen sofort im gesamten Krankenhaus eingef\u00FChrt werden.', 'false')
   ], 'C1_lesson_8'),

  // 34. Public health campaign - L9
  l('C1_listen_37', 'Kampagne: Organspende',
   'Moderator: Die Zahl der Organspenden ist r\u00FCckl\u00E4ufig. Warum, Frau Dr. Hoffmann?\n\nDr. Hoffmann: Es gibt mehrere Gr\u00FCnde. Ein gro\u00DFes Problem ist die fehlende Bereitschaft zur Auseinandersetzung mit dem Thema. Viele Menschen haben keinen Ausweis, weil sie sich nicht entscheiden wollen.\n\nModerator: Wie k\u00F6nnte man das \u00E4ndern?\n\nDr. Hoffmann: Die Widerspruchsl\u00F6sung w\u00FCrde helfen. In \u00D6sterreich gilt jeder als Organspender, der nicht widersprochen hat. Die Spenderzahlen sind dort deutlich h\u00F6her.\n\nModerator: Wie steht die Medizin dazu?\n\nDr. Hoffmann: Die \u00E4rzteschaft ist gespalten. Die einen bef\u00FCrworten die Widerspruchsl\u00F6sung, die anderen sehen die Entscheidungsfreiheit des Einzelnen gef\u00E4hrdet.\n\nModerator: Was w\u00FCrden Sie empfehlen?\n\nDr. Hoffmann: Informieren Sie sich und treffen Sie eine Entscheidung. Ein Organspendeausweis entlastet auch Ihre Angeh\u00F6rigen, die sonst im Ungl\u00FCcksfall entscheiden m\u00FCssen.',
   [
    mkq('mcq', 'Warum haben viele Menschen keinen Organspendeausweis?', 'Sie k\u00F6nnen sich nicht entscheiden', ['Sie lehnen Organspende ab', 'Sie k\u00F6nnen sich nicht entscheiden', 'Sie wissen nicht, wo es den Ausweis gibt', 'Sie sind dagegen']),
    mkq('true-false', 'In \u00D6sterreich gilt die Widerspruchsl\u00F6sung f\u00FCr Organspenden.', 'true'),
    mkq('mcq', 'Was ist die Widerspruchsl\u00F6sung?', 'Jeder gilt als Organspender, der nicht widersprochen hat', ['Jeder muss der Spende explizit zustimmen', 'Jeder gilt als Organspender, der nicht widersprochen hat', 'Nur registrierte Personen d\u00FCrfen spenden', 'Die Angeh\u00F6rigen entscheiden']),
    mkq('gap-fill', 'Ein Organspendeausweis entlastet auch die ____.', 'Angeh\u00F6rigen', ['Pfleger', 'Angeh\u00F6rigen', '\u00C4rzte', 'Krankenkasse'])
   ], 'C1_lesson_9'),

  // 35. Patient education - L10
  l('C1_listen_38', 'Patientenschulung: INR-Selbstmessung',
   'Arzthelferin: Herr Sommer, ich zeige Ihnen heute, wie Sie Ihren INR-Wert selbst messen k\u00F6nnen. Das macht Sie unabh\u00E4ngiger von Arztbesuchen.\n\nPatient: Das Ger\u00E4t habe ich schon. Aber ich traue mich nicht, es allein zu machen.\n\nArzthelferin: Das ist am Anfang ganz normal. Sehen Sie: Sie stechen sich in die Fingerkuppe, tropfen das Blut auf den Teststreifen und das Ger\u00E4t zeigt den Wert an. Ziel ist ein INR zwischen 2,0 und 3,0.\n\nPatient: Und was mache ich, wenn der Wert zu hoch ist?\n\nArzthelferin: Wenn der INR \u00FCber 4,0 ist, setzen Sie eine Marcumar-Dosis aus und rufen uns an. Bei \u00FCber 5,0 kommen Sie sofort in die Praxis.\n\nPatient: Und wenn er zu niedrig ist?\n\nArzthelferin: Unter 2,0 bedeutet erh\u00F6htes Thromboserisiko. Dann nehmen Sie die verordnete Dosis und wir passen beim n\u00E4chsten Mal an.\n\nPatient: Wie oft muss ich messen?\n\nArzthelferin: Einmal pro Woche, bei stabilen Werten alle zwei Wochen.',
   [
    mkq('mcq', 'In welchem Bereich soll der INR-Wert liegen?', 'Zwischen 2,0 und 3,0', ['Zwischen 1,0 und 2,0', 'Zwischen 2,0 und 3,0', 'Zwischen 3,0 und 4,0', 'Zwischen 4,0 und 5,0']),
    mkq('true-false', 'Ein INR \u00FCber 5,0 erfordert den sofortigen Besuch in der Praxis.', 'true'),
    mkq('mcq', 'Bei welchem INR-Wert sollte eine Marcumar-Dosis ausgesetzt werden?', '\u00DCber 4,0', ['\u00DCber 3,0', '\u00DCber 4,0', '\u00DCber 5,0', '\u00DCber 6,0']),
    mkq('gap-fill', 'Bei stabilen Werten reicht eine Messung alle ____ Wochen.', 'zwei', ['einer', 'zwei', 'drei', 'vier'])
   ], 'C1_lesson_10'),

  // 36. Medical research presentation - L12
  l('C1_listen_39', 'Posterpr\u00E4sentation: Kongress',
   'Dr. Fischer: Guten Tag. Darf ich Ihnen mein Poster vorstellen? Ich habe die Effekte eines strukturierten Rehabilitationsprogramms nach Schlaganfall untersucht.\n\nBesucher: Klingt spannend. Was war Ihr Studiendesign?\n\nDr. Fischer: Eine prospektive Kohortenstudie mit 120 Patienten. Die Interventionsgruppe erhielt ein zus\u00E4tzliches motorisches Training, die Kontrollgruppe die Standardtherapie.\n\nBesucher: Was waren die Hauptergebnisse?\n\nDr. Fischer: Die Interventionsgruppe zeigte eine signifikant bessere Verbesserung im Barthel-Index und im Timed-Up-and-Go-Test. Der Effekt war nach sechs Monaten noch nachweisbar.\n\nBesucher: Gibt es Limitationen?\n\nDr. Fischer: Ja, die Studie war nicht randomisiert. Die Gruppenzuteilung erfolgte nach Wohnort. Wir planen jetzt eine randomisierte Studie zur Best\u00E4tigung.\n\nBesucher: Vielen Dank. Viel Erfolg damit.',
   [
    mkq('mcq', 'Welches Studiendesign wurde verwendet?', 'Eine prospektive Kohortenstudie', ['Eine randomisierte kontrollierte Studie', 'Eine prospektive Kohortenstudie', 'Eine Fall-Kontroll-Studie', 'Eine qualitative Studie']),
    mkq('true-false', 'Die Interventionsgruppe zeigte eine signifikant bessere Verbesserung als die Kontrollgruppe.', 'true'),
    mkq('mcq', 'Welche Limitation der Studie wird genannt?', 'Die Studie war nicht randomisiert', ['Die Stichprobe war zu klein', 'Die Studie war nicht randomisiert', 'Der Endpunkt war ungeeignet', 'Die Nachbeobachtungszeit war zu kurz']),
    mkq('gap-fill', 'Die Effekte waren nach sechs Monaten noch ____.', 'nachweisbar', ['sichtbar', 'nachweisbar', 'vorhanden', 'messbar'])
   ], 'C1_lesson_12'),

  // 37. Biobank and genomic medicine - L13
  l('C1_listen_40', 'Vortrag: Biobanken in der medizinischen Forschung',
   'Referent: Guten Tag. Ich m\u00F6chte Ihnen heute das Konzept der Biobanken vorstellen. Biobanken sammeln, verarbeiten und lagern menschliches Probenmaterial f\u00FCr Forschungszwecke.\n\nZuh\u00F6rerin: Welche Proben werden gesammelt?\n\nReferent: Blut, Gewebe, Urin, Speichel und DNA-Proben. Dazu geh\u00F6ren klinische Daten der Spender. Das erm\u00F6glicht gro\u00DF angelegte bev\u00F6lkerungsbasierte Studien.\n\nZuh\u00F6rer: Welche ethischen Fragen stellen sich?\n\nReferent: Die informierte Einwilligung ist zentral. Der Spender muss genau verstehen, wof\u00FCr seine Proben verwendet werden. Und er kann jederzeit zur\u00FCcktreten.\n\nZuh\u00F6rerin: Was ist mit Datenschutz?\n\nReferent: Die Daten werden pseudonymisiert. Nur ein Treuh\u00E4nder kann die Zuordnung zu Personen herstellen. Die Biomaterialien sind kodiert.\n\nZuh\u00F6rer: Welche Forschung profitiert davon?\n\nReferent: Vor allem die Genomforschung, die personalisierte Medizin und die Suche nach Biomarkern.',
   [
    mkq('mcq', 'Was sammeln und lagern Biobanken?', 'Menschliches Probenmaterial f\u00FCr Forschungszwecke', ['Medikamente f\u00FCr klinische Studien', 'Menschliches Probenmaterial f\u00FCr Forschungszwecke', 'Medizinische Ger\u00E4te', 'Patientendaten von Krankenkassen']),
    mkq('true-false', 'Spender k\u00F6nnen jederzeit ihre Einwilligung zur\u00FCckziehen.', 'true'),
    mkq('mcq', 'Wie werden die Daten in Biobanken gesch\u00FCtzt?', 'Pseudonymisiert mit Treuh\u00E4nder f\u00FCr die Zuordnung', ['Vollst\u00E4ndig anonymisiert', 'Pseudonymisiert mit Treuh\u00E4nder f\u00FCr die Zuordnung', 'Unverschl\u00FCsselt aber passwortgesch\u00FCtzt', 'Nicht gesch\u00FCtzt']),
    mkq('gap-fill', 'Die Forschung an Biobanken hilft vor allem der genomischen und ____ Medizin.', 'personalisierten', ['alternativen', 'personalisierten', 'traditionellen', 'pr\u00E4ventiven'])
   ], 'C1_lesson_13'),

  // 38. Surgical quality conference - L14
  l('C1_listen_41', 'Chirurgische Qualit\u00E4tskonferenz',
   'Chefchirurg: Willkommen zur monatlichen Qualit\u00E4tskonferenz. Wir besprechen heute die Morbidit\u00E4ts- und Mortalit\u00E4tsrate des letzten Monats.\n\nOberarzt: Wir hatten 15 gr\u00F6\u00DFere Eingriffe bei kolorektalen Karzinomen. Davon drei Komplikationen: eine Anastomoseninsuffizienz, eine Wundinfektion und eine Nachblutung.\n\nChefchirurg: Die Anastomoseninsuffizienz ist wie aufgetreten?\n\nOberarzt: Am f\u00FCnften postoperativen Tag. Der Patient hatte Fieber und Peritonitis-Zeichen. Wir haben revisioniert und ein Stoma angelegt. Der Patient erholt sich langsam.\n\nChefchirurg: Was lernen wir daraus?\n\nOberarzt: Bei Risikopatienten sollten wir fr\u00FCher eine second look-OP erw\u00E4gen. Und die Nahttechnik k\u00F6nnen wir noch standardisieren.\n\nChefchirurg: Guter Punkt. Protokollieren Sie das bitte.',
   [
    mkq('mcq', 'Wie viele Komplikationen gab es bei den kolorektalen Eingriffen?', 'Drei', ['Eine', 'Drei', 'F\u00FCnf', 'Zehn']),
    mkq('true-false', 'Die Anastomoseninsuffizienz trat am f\u00FCnften postoperativen Tag auf.', 'true'),
    mkq('mcq', 'Welche Komplikationen werden genannt?', 'Anastomoseninsuffizienz, Wundinfektion und Nachblutung', ['Anastomoseninsuffizienz, Wundinfektion und Nachblutung', 'Thrombose, Embolie und Pneumonie', 'Ileus, Perforation und Abszess', 'Fistel, Stenose und Rezidiv']),
    mkq('gap-fill', 'Bei Risikopatienten sollte eine second look-OP fr\u00FCher ____ werden.', 'erwogen', ['durchgef\u00FChrt', 'erwogen', 'abgelehnt', 'besprochen'])
   ], 'C1_lesson_14'),

  // 39. Community health - L15
  l('C1_listen_42', 'Gesundheitsprojekt: Schule und Bewegung',
   'Projektleiterin: Guten Morgen. Ich stelle unser neues Pr\u00E4ventionsprojekt vor. Wir bringen Bewegungsangebote in Grundschulen.\n\nLehrerin: Warum liegt der Fokus auf Grundschulen?\n\nProjektleiterin: Weil hier die Weichen f\u00FCr ein gesundes Leben gestellt werden. Kinder, die sich viel bewegen, haben ein geringeres Risiko f\u00FCr \u00DCbergewicht, Diabetes und Herz-Kreislauf-Erkrankungen im Erwachsenenalter.\n\nLehrerin: Wie ist das Konzept?\n\nProjektleiterin: Drei zus\u00E4tzliche Bewegungsstunden pro Woche. Kein Leistungsdruck, sondern Spiel und Spa\u00DF. Wir arbeiten mit Physiotherapeuten und Sportwissenschaftlern zusammen.\n\nLehrerin: Was kostet das?\n\nProjektleiterin: Das Projekt wird von der Krankenkasse finanziert. F\u00FCr die Schule ist es kostenlos. Im n\u00E4chsten Schuljahr starten wir mit zehn Schulen in der Region.',
   [
    mkq('mcq', 'Warum liegt der Fokus des Projekts auf Grundschulen?', 'Weil hier die Weichen f\u00FCr ein gesundes Leben gestellt werden', ['Weil Grundschulkinder \u00FCbergewichtig sind', 'Weil hier die Weichen f\u00FCr ein gesundes Leben gestellt werden', 'Weil es am einfachsten umsetzbar ist', 'Weil die Lehrer Zeit haben']),
    mkq('true-false', 'Das Projekt wird von der Schule selbst finanziert.', 'false'),
    mkq('mcq', 'Mit wem arbeitet das Projekt zusammen?', 'Mit Physiotherapeuten und Sportwissenschaftlern', ['Mit \u00C4rzten und Krankenkassen', 'Mit Physiotherapeuten und Sportwissenschaftlern', 'Mit Ern\u00E4hrungsberatern', 'Mit Psychologen und Sozialarbeitern']),
    mkq('gap-fill', 'Kinder, die sich viel bewegen, haben ein geringeres Risiko f\u00FCr ____ im Erwachsenenalter.', '\u00DCbergewicht und Diabetes', ['Asthma', '\u00DCbergewicht und Diabetes', 'Allergien', 'Infektionen'])
   ], 'C1_lesson_15'),

  // 40. Clinical audit - L16
  l('C1_listen_43', 'Klinisches Audit: Dekubitusprophylaxe',
   'Auditorin: Guten Tag, ich f\u00FChre heute das j\u00E4hrliche klinische Audit zur Dekubitusprophylaxe durch. Frau Stationsleitung, zeigen Sie mir bitte die Dokumentation.\n\nStationsleitung: Selbstverst\u00E4ndlich. Hier sind die Risikoeinsch\u00E4tzungen aller Patienten nach Braden-Skala.\n\nAuditorin: Ich sehe, dass bei drei Patienten mit hohem Risiko keine regelm\u00E4\u00DFige Umlagerung dokumentiert ist. Wie erkl\u00E4ren Sie das?\n\nStationsleitung: Das liegt an der Personalknappheit in der Nacht. Wir haben nicht genug Personal f\u00FCr die zweist\u00FCndliche Umlagerung aller Risikopatienten.\n\nAuditorin: Das ist kritisch. Ein Dekubitus ist eine vermeidbare Komplikation. Ich empfehle: Belegen Sie die Umlagerung auf dem Dokumentationsbogen und nutzen Sie Hilfsmittel wie druckentlastende Matratzen.\n\nStationsleitung: Die Antr\u00E4ge f\u00FCr Spezialmatratzen sind gestellt. Ich hoffe auf baldige Genehmigung.',
   [
    mkq('mcq', 'Welches Instrument wird zur Risikoeinsch\u00E4tzung verwendet?', 'Die Braden-Skala', ['Die Glasgow Coma Scale', 'Die Braden-Skala', 'Die Barthel-Skala', 'Die WHO-Skala']),
    mkq('true-false', 'Die regelm\u00E4\u00DFige Umlagerung ist bei allen Risikopatienten dokumentiert.', 'false'),
    mkq('mcq', 'Welche Ursache wird f\u00FCr die fehlende Umlagerungsdokumentation genannt?', 'Personalknappheit in der Nacht', ['Fehlende Schulung', 'Personalknappheit in der Nacht', 'Fehlende Hilfsmittel', 'Unwilligkeit des Personals']),
    mkq('gap-fill', 'Der Auditor empfiehlt druckentlastende ____.', 'Matratzen', ['Kissen', 'Matratzen', 'Verb\u00E4nde', 'Lagerungen'])
   ], 'C1_lesson_16'),
];

c1.push(...batch2a);
data.C1 = c1;
fs.writeFileSync('listening.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sub-batch 2A done: added C1_listen_34 to C1_listen_43');
console.log('C1 count now:', data.C1.length);
