/**
 * Phase 28: Generate roleplayScenarios.json (Part 1: everyday + FSP-patient)
 * Run: node scripts/phase28-part1-everyday.cjs
 * Then append FSP handovers and explanations from part2
 */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname,'..','src','data');
const fspCases = JSON.parse(fs.readFileSync(path.join(DATA,'fspCases.json'),'utf8'));

const scenarios = [];
let id = 1;
function nextId() { return 'rp_' + String(id++).padStart(4,'0'); }
function mkRp(a) { return { id:nextId(), level:a.level||'B1', type:a.type, title:a.title, scenario:a.scenario,
  userRole:a.userRole, partnerRole:a.partnerRole||'', goal:a.goal,
  expectedPoints:a.expectedPoints||[], usefulPhrases:a.usefulPhrases||[],
  vocabularyTargets:a.vocabTargets||[], grammarTargets:a.grammarTargets||[],
  requiredConcepts:a.requiredConcepts||[], taughtInLessonId:a.taughtInLessonId||'',
  checklist:a.checklist||[], rubric:a.rubric||{grammar:'',vocabulary:'',structure:'',taskCompletion:''},
  sampleConversation:a.sampleConversation||'', fallbackScript:a.fallbackScript||'',
  tags:a.tags||[], ...(a.caseId?{caseId:a.caseId}:{}),
  ...(a.specialty?{specialty:a.specialty}:{}), ...(a.redFlags?{redFlags:a.redFlags}:{}),
  ...(a.handoverPoints?{handoverPoints:a.handoverPoints}:{}),
  ...(a.arztbriefPoints?{arztbriefPoints:a.arztbriefPoints}:{}) }; }

// ── 20 Everyday Roleplays ──
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Im Supermarkt — nach dem Weg fragen',
  scenario:'Sie sind neu in der Stadt und suchen ein bestimmtes Produkt im Supermarkt.',
  userRole:'Kunde/Kundin', partnerRole:'Supermarktmitarbeiter',
  goal:'Nach Produkt fragen und Antwort verstehen',
  expectedPoints:['Höfliche Anrede','Produkt klar benennen','Frage höflich formulieren','Auf Antwort reagieren'],
  usefulPhrases:['Entschuldigung, wo finde ich...?','Können Sie mir bitte helfen?','Ich suche...','Vielen Dank!'],
  vocabTargets:['Lebensmittel','Abteilung','Regal'], grammarTargets:['Fragesätze','Höflichkeitsform'],
  checklist:['Höflich begrüßt','Produkt korrekt benannt','Frage verständlich gestellt','Sich bedankt'],
  rubric:{grammar:'Satzstellung bei Fragen',vocabulary:'Produktnamen',structure:'Frage-Antwort-Sequenz',taskCompletion:'Ziel erreicht'},
  tags:['everyday','shopping','orientation'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Arzttermin vereinbaren',
  scenario:'Sie rufen in einer Arztpraxis an, um einen Termin zu vereinbaren.',
  userRole:'Patient/Patientin', partnerRole:'Arzthelferin',
  goal:'Einen Termin telefonisch vereinbaren',
  expectedPoints:['Sich vorstellen','Grund nennen','Zeitwunsch äußern','Termin bestätigen'],
  usefulPhrases:['Ich möchte gerne einen Termin vereinbaren.','Haben Sie am... einen Termin frei?','Das passt gut.','Vielen Dank, auf Wiederhören.'],
  vocabTargets:['der Termin','die Praxis','die Versichertenkarte'], grammarTargets:['Modalverben (möchte, können)','Terminangaben'],
  checklist:['Sich mit Namen vorgestellt','Grund genannt','Termin bestätigt','Höflich verabschiedet'],
  rubric:{grammar:'Modalverben korrekt',vocabulary:'Terminwortschatz',structure:'Gesprächsablauf',taskCompletion:'Termin vereinbart'},
  tags:['everyday','telephone','appointment'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'In der Apotheke',
  scenario:'Sie haben Kopfschmerzen und gehen in die Apotheke, um ein Medikament zu kaufen.',
  userRole:'Kunde/Kundin', partnerRole:'Apothekerin',
  goal:'Ein rezeptfreies Medikament kaufen und die Dosierung erfragen',
  expectedPoints:['Symptom beschreiben','Nach Medikament fragen','Dosierung erfragen','Bezahlen'],
  usefulPhrases:['Ich habe starke Kopfschmerzen.','Können Sie mir etwas empfehlen?','Wie oft soll ich das einnehmen?'],
  vocabTargets:['das Medikament','die Tablette','die Dosierung','die Nebenwirkung'],
  grammarTargets:['Krankheitsbeschreibung','Mengenangaben'],
  checklist:['Symptom beschrieben','Nach Medikament gefragt','Dosierung erfragt','Bezahlt'],
  rubric:{grammar:'Symptome beschreiben',vocabulary:'Medikamentenvokabular',structure:'Kaufgespräch',taskCompletion:'Medikament erhalten'},
  tags:['everyday','pharmacy','health'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Wohnungssuche — Besichtigung',
  scenario:'Sie besichtigen eine Wohnung. Stellen Sie Fragen dazu.',
  userRole:'Interessent/in', partnerRole:'Vermieterin',
  goal:'Wichtige Fragen zur Wohnung stellen',
  expectedPoints:['Begrüßung','Fragen zur Größe','Fragen zur Miete','Fragen zum Einzugstermin'],
  usefulPhrases:['Wie groß ist die Wohnung?','Sind Nebenkosten enthalten?','Ab wann ist die Wohnung frei?'],
  vocabTargets:['die Wohnung','die Miete','die Kaution','das Wohnzimmer'],
  grammarTargets:['Fragen mit wie','Präpositionen (ab, bis)'],
  checklist:['Sich vorgestellt','Nach Größe gefragt','Nach Kosten gefragt','Nach Verfügbarkeit gefragt'],
  rubric:{grammar:'Fragen korrekt',vocabulary:'Wohnungswortschatz',structure:'Besichtigungsgespräch',taskCompletion:'Informationen erhalten'},
  tags:['everyday','housing','viewing'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Im Restaurant bestellen',
  scenario:'Sie gehen in ein deutsches Restaurant und möchten essen und trinken bestellen.',
  userRole:'Gast', partnerRole:'Kellnerin',
  goal:'Essen und Getränke bestellen und bezahlen',
  expectedPoints:['Begrüßung','Getränk bestellen','Essen bestellen','Nach Bezahlen fragen'],
  usefulPhrases:['Ich hätte gern...','Was empfehlen Sie?','Könnte ich bitte zahlen?','Das war sehr lecker.'],
  vocabTargets:['die Vorspeise','das Hauptgericht','der Nachtisch','die Rechnung'],
  grammarTargets:['Konjunktiv II (hätte, könnte)','Bestellformeln'],
  checklist:['Getränk bestellt','Essen bestellt','Nachgefragt','Bezahlt'],
  rubric:{grammar:'Konjunktiv II',vocabulary:'Speisekarte',structure:'Bestellablauf',taskCompletion:'Essen bestellt und bezahlt'},
  tags:['everyday','restaurant','food'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Auf der Bank ein Konto eröffnen',
  scenario:'Sie möchten ein Girokonto eröffnen. Sie sprechen mit einem Bankberater.',
  userRole:'Kunde/Kundin', partnerRole:'Bankberater',
  goal:'Konto eröffnen und Konditionen verstehen',
  expectedPoints:['Sich vorstellen','Kontoart nennen','Nach Konditionen fragen','Unterlagen erfragen'],
  usefulPhrases:['Ich möchte ein Konto eröffnen.','Welche Unterlagen brauchen Sie?','Gibt es monatliche Gebühren?'],
  vocabTargets:['das Konto','die Überweisung','die Gebühr','der PIN'],
  grammarTargets:['Höflichkeitsform','Fragesätze'],
  checklist:['Sich vorgestellt','Kontoart genannt','Nach Kosten gefragt','Unterlagen erfragt'],
  rubric:{grammar:'Höflichkeitsform',vocabulary:'Bankwortschatz',structure:'Beratungsgespräch',taskCompletion:'Konto eröffnet'},
  tags:['everyday','bank','administration'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Beim Arzt — Krankmeldung',
  scenario:'Sie sind krank. Lassen Sie sich beim Hausarzt krankschreiben.',
  userRole:'Patient/Patientin', partnerRole:'Arzt/Ärztin',
  goal:'Symptome beschreiben und Krankschreibung erhalten',
  expectedPoints:['Begrüßung','Symptome beschreiben','Seit wann fragen','Krankschreibung erhalten'],
  usefulPhrases:['Seit drei Tagen habe ich Fieber.','Ich fühle mich sehr schwach.','Brauche ich eine Krankschreibung?'],
  vocabTargets:['das Fieber','der Husten','der Schnupfen','die Krankschreibung'],
  grammarTargets:['Zeitangaben (seit, ab)','Körperteile'],
  checklist:['Symptome beschrieben','Beginn genannt','Nach Krankschreibung gefragt','Medikament erfragt'],
  rubric:{grammar:'Symptome beschreiben',vocabulary:'Krankheit',structure:'Arztgespräch',taskCompletion:'Krankschreibung erhalten'},
  tags:['everyday','doctor','health'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Nach dem Weg fragen (Stadt)',
  scenario:'Sie suchen den Bahnhof. Fragen Sie einen Passanten.',
  userRole:'Fußgänger/in', partnerRole:'Passant/in',
  goal:'Nach dem Weg fragen und Erklärung verstehen',
  expectedPoints:['Höflich fragen','Ort nennen','Antwort quittieren','Sich bedanken'],
  usefulPhrases:['Entschuldigung, wie komme ich zum...?','Ist es weit von hier?','Gehen Sie geradeaus...','Danke schön!'],
  vocabTargets:['geradeaus','links','rechts','die Kreuzung'],
  grammarTargets:['Imperativ (gehen Sie)','Richtungsangaben'],
  checklist:['Höflich gefragt','Ort genannt','Antwort verstanden','Sich bedankt'],
  rubric:{grammar:'Richtungsanweisungen',vocabulary:'Wegebeschreibung',structure:'Frage-Antwort',taskCompletion:'Weg gefunden'},
  tags:['everyday','navigation','city'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Beschwerde im Hotel',
  scenario:'Ihr Hotelzimmer hat Probleme. Beschweren Sie sich an der Rezeption.',
  userRole:'Gast', partnerRole:'Hotelrezeptionistin',
  goal:'Problem sachlich beschreiben und Lösung aushandeln',
  expectedPoints:['Problem nennen','Sachlich bleiben','Lösung vorschlagen','Kompromiss finden'],
  usefulPhrases:['Leider habe ich ein Problem mit...','Das Zimmer ist...','Könnten Sie bitte...?','Das wäre eine angemessene Lösung.'],
  vocabTargets:['die Heizung','die Klimaanlage','der Lärm','die Reklamation'],
  grammarTargets:['Konjunktiv II für Höflichkeit','Kausalsätze (weil, da)'],
  checklist:['Problem sachlich genannt','Lösungsvorschlag','Nicht unhöflich','Einigung erzielt'],
  rubric:{grammar:'Konjunktiv II',vocabulary:'Beschwerdevokabular',structure:'Reklamation',taskCompletion:'Lösung erreicht'},
  tags:['everyday','hotel','complaint'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Vereinbarung mit Kollegen treffen',
  scenario:'Sie müssen mit einem Kollegen ein Projekt planen. Finden Sie einen Termin.',
  userRole:'Angestellte/r', partnerRole:'Kollege/Kollegin',
  goal:'Besprechungstermin koordinieren',
  expectedPoints:['Vorschlag machen','Terminvorschläge nennen','Kompromiss finden','Bestätigen'],
  usefulPhrases:['Hätten Sie am Montag Zeit?','Mir passt es um 14 Uhr besser.','Dann machen wir es so.'],
  vocabTargets:['die Besprechung','der Termin','der Vorschlag'],
  grammarTargets:['Konjunktiv II (hätten, könnte)','Zeitpräpositionen (am, um)'],
  checklist:['Termin vorgeschlagen','Alternativen genannt','Einigung erzielt','Bestätigt'],
  rubric:{grammar:'Konjunktiv II',vocabulary:'Arbeitswortschatz',structure:'Terminabsprache',taskCompletion:'Termin gefunden'},
  tags:['everyday','work','meeting'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Paket auf der Post abholen',
  scenario:'Sie haben eine Benachrichtigung für ein Paket. Sie sind auf der Post.',
  userRole:'Kunde/Kundin', partnerRole:'Postmitarbeiterin',
  goal:'Ein Paket abholen',
  expectedPoints:['Sich ausweisen','Benachrichtigung zeigen','Paket identifizieren','Empfang bestätigen'],
  usefulPhrases:['Ich habe eine Benachrichtigung bekommen.','Ich möchte ein Paket abholen.','Hier ist meine Benachrichtigung.'],
  vocabTargets:['das Paket','der Empfang','der Ausweis'],
  grammarTargets:['Perfekt (habe bekommen)','Bestätigungsformeln'],
  checklist:['Benachrichtigung gezeigt','Ausweis vorgelegt','Paket erhalten','Unterschrieben'],
  rubric:{grammar:'Perfekt',vocabulary:'Postwortschatz',structure:'Abholvorgang',taskCompletion:'Paket erhalten'},
  tags:['everyday','post','package'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Bewerbungsgespräch',
  scenario:'Sie haben eine Einladung zum Bewerbungsgespräch als Arzthelfer/in.',
  userRole:'Bewerber/in', partnerRole:'Personalchefin',
  goal:'Sich professionell präsentieren und Fragen beantworten',
  expectedPoints:['Sich vorstellen','Motivation nennen','Stärken präsentieren','Fragen zur Stelle stellen'],
  usefulPhrases:['Ich habe Erfahrung in...','Meine Stärke ist...','Was sind die Arbeitszeiten?'],
  vocabTargets:['die Berufserfahrung','die Qualifikation','das Team'],
  grammarTargets:['Perfekt','Relativsätze'],
  checklist:['Sich vorgestellt','Motivation genannt','Stärken genannt','Rückfragen gestellt'],
  rubric:{grammar:'Relativsätze',vocabulary:'Bewerbung',structure:'Vorstellungsgespräch',taskCompletion:'Überzeugend präsentiert'},
  tags:['everyday','job','interview'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Nachbar um Hilfe bitten',
  scenario:'Ihre Wohnungstür ist zugefallen. Bitten Sie den Nachbarn um Hilfe.',
  userRole:'Bewohner/in', partnerRole:'Nachbar/in',
  goal:'Höflich um Hilfe bitten und Lösung finden',
  expectedPoints:['Situation erklären','Höflich bitten','Alternativen vorschlagen','Sich bedanken'],
  usefulPhrases:['Mir ist etwas Peinliches passiert.','Könnten Sie mir bitte helfen?','Darf ich Ihr Telefon benutzen?'],
  vocabTargets:['der Schlüssel','der Notdienst','das Telefon'],
  grammarTargets:['Bitten mit können/dürfen','Situationsbeschreibung'],
  checklist:['Situation erklärt','Höflich gebeten','Alternative vorgeschlagen','Sich bedankt'],
  rubric:{grammar:'Modalverben',vocabulary:'Hilfe bitten',structure:'Bitte',taskCompletion:'Hilfe erhalten'},
  tags:['everyday','neighbor','help'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Fahrkarte am Automaten kaufen',
  scenario:'Sie sind am Bahnhof und müssen eine Fahrkarte kaufen.',
  userRole:'Reisende/r', partnerRole:'Bahnmitarbeiterin',
  goal:'Eine Fahrkarte kaufen',
  expectedPoints:['Ziel nennen','Ticketart wählen','Bezahlen','Kontrollieren'],
  usefulPhrases:['Ich möchte eine Fahrkarte nach...','Einfach oder hin und zurück?','Kann ich mit Karte zahlen?'],
  vocabTargets:['die Fahrkarte','der Schalter','der Automat'],
  grammarTargets:['Wechselpräpositionen (nach, zu)','Zahlen'],
  checklist:['Ziel genannt','Ticket gewählt','Bezahlt','Geprüft'],
  rubric:{grammar:'Zielangaben',vocabulary:'Reisen',structure:'Kaufvorgang',taskCompletion:'Ticket erhalten'},
  tags:['everyday','travel','train'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Kind vom Kindergarten abmelden',
  scenario:'Sie müssen Ihr Kind wegen Umzug abmelden. Sprechen Sie mit der Leiterin.',
  userRole:'Elternteil', partnerRole:'Kindergartenleitung',
  goal:'Kind formell abmelden',
  expectedPoints:['Anliegen nennen','Kündigungsfrist erfragen','Grund nennen','Dokumente klären'],
  usefulPhrases:['Wir müssen leider abmelden.','Wie lange ist die Kündigungsfrist?','Wir ziehen um.'],
  vocabTargets:['die Abmeldung','der Umzug','die Kündigungsfrist'],
  grammarTargets:['Kausalsätze (weil, da)','formelle Anrede'],
  checklist:['Grund genannt','Frist erfragt','Dokumente geklärt','Formular ausgefüllt'],
  rubric:{grammar:'Kausalsätze',vocabulary:'Verwaltung',structure:'Abmeldegespräch',taskCompletion:'Erfolgreich abgemeldet'},
  tags:['everyday','kindergarten','administration'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Versicherungsschaden melden',
  scenario:'Ihr Laptop ist kaputt. Melden Sie den Schaden Ihrer Versicherung.',
  userRole:'Versicherungsnehmer/in', partnerRole:'Sachbearbeiterin',
  goal:'Schaden sachlich melden',
  expectedPoints:['Schaden beschreiben','Datum nennen','Police-Nummer nennen','Nächste Schritte erfragen'],
  usefulPhrases:['Ich möchte einen Schaden melden.','Meine Police-Nummer ist...','Wann bekomme ich Bescheid?'],
  vocabTargets:['der Schaden','die Versicherung','die Police'],
  grammarTargets:['Perfekt','Passiv (wird bearbeitet)'],
  checklist:['Police genannt','Schaden beschrieben','Datum genannt','Nächste Schritte erfragt'],
  rubric:{grammar:'Perfekt/Passiv',vocabulary:'Versicherung',structure:'Schadenmeldung',taskCompletion:'Schaden gemeldet'},
  tags:['everyday','insurance','administrative'] }));
scenarios.push(mkRp({ type:'everyday',level:'A2', title:'Auf dem Amt — Anmeldung',
  scenario:'Sie sind umgezogen und müssen sich im Bürgeramt anmelden.',
  userRole:'Bürger/in', partnerRole:'Sachbearbeiterin',
  goal:'Sich anmelden und Vorgang abschließen',
  expectedPoints:['Sich vorstellen','Formular ausfüllen','Unterlagen zeigen','Bestätigung erhalten'],
  usefulPhrases:['Ich möchte mich anmelden.','Meine neue Adresse ist...','Welche Unterlagen brauchen Sie?'],
  vocabTargets:['die Anmeldung','die Adresse','der Pass'],
  grammarTargets:['Ortsangaben (in, nach)','Formulardaten'],
  checklist:['Sich vorgestellt','Formular ausgefüllt','Unterlagen gezeigt','Bestätigung erhalten'],
  rubric:{grammar:'Ortsangaben',vocabulary:'Behörden',structure:'Anmeldevorgang',taskCompletion:'Angemeldet'},
  tags:['everyday','authority','registration'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Handyvertrag kündigen',
  scenario:'Sie möchten Ihren Handyvertrag kündigen. Rufen Sie beim Kundenservice an.',
  userRole:'Kunde/Kundin', partnerRole:'Kundenservice-Mitarbeiter',
  goal:'Vertrag kündigen',
  expectedPoints:['Vertragsdaten nennen','Kündigungsgrund nennen','Frist erfragen','Bestätigung fordern'],
  usefulPhrases:['Ich möchte meinen Vertrag kündigen.','Meine Kundennummer ist...','Bitte senden Sie mir eine Bestätigung.'],
  vocabTargets:['die Kündigung','die Kündigungsfrist','die Bestätigung'],
  grammarTargets:['formelle Anrede','Satzgefüge'],
  checklist:['Vertragsdaten genannt','Gekündigt','Frist erfragt','Bestätigung gefordert'],
  rubric:{grammar:'formelle Anrede',vocabulary:'Telekommunikation',structure:'Kündigungsgespräch',taskCompletion:'Gekündigt'},
  tags:['everyday','telephone','contract'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Arbeitsunfall melden',
  scenario:'Sie haben sich bei der Arbeit am Rücken verletzt. Melden Sie den Unfall.',
  userRole:'Angestellte/r', partnerRole:'Vorgesetzte/r',
  goal:'Unfall sachlich melden und Vorgehen klären',
  expectedPoints:['Unfall beschreiben','Verletzung nennen','Dokumentation erfragen','Arztbesuch klären'],
  usefulPhrases:['Mir ist ein Unfall passiert.','Ich habe mir den Rücken verletzt.','Muss ich zum Durchgangsarzt?'],
  vocabTargets:['der Arbeitsunfall','die Verletzung','der Durchgangsarzt'],
  grammarTargets:['Perfekt','Passiv (wird gemeldet)'],
  checklist:['Unfall beschrieben','Verletzung genannt','Nächste Schritte geklärt','Bericht ausgefüllt'],
  rubric:{grammar:'Perfekt/Passiv',vocabulary:'Arbeitsunfall',structure:'Unfallmeldung',taskCompletion:'Unfall gemeldet'},
  tags:['everyday','work','accident'] }));
scenarios.push(mkRp({ type:'everyday',level:'B1', title:'Elterngespräch in der Schule',
  scenario:'Ihr Kind hat Probleme in Mathe. Sie sprechen mit der Lehrerin.',
  userRole:'Elternteil', partnerRole:'Lehrerin',
  goal:'Situation besprechen und Fördermöglichkeiten klären',
  expectedPoints:['Anliegen nennen','Problem beschreiben','Fördermöglichkeiten erfragen','Nächste Schritte klären'],
  usefulPhrases:['Mein Kind hat Schwierigkeiten in Mathe.','Was können wir tun?','Gibt es Nachhilfemöglichkeiten?'],
  vocabTargets:['die Nachhilfe','die Förderung','das Zeugnis'],
  grammarTargets:['Vergleiche','Konjunktiv II für Vorschläge'],
  checklist:['Problem beschrieben','Nach Ursachen gefragt','Fördermöglichkeiten besprochen','Nächste Schritte vereinbart'],
  rubric:{grammar:'Konjunktiv II',vocabulary:'Schule',structure:'Elterngespräch',taskCompletion:'Lösungswege besprochen'},
  tags:['everyday','school','parents'] }));

// ── 30 FSP Doctor-Patient Roleplays ──
for (let i = 101; i <= 130; i++) {
  const cid = 'fsp_c_'+i;
  const c = fspCases.find(fc => fc.id === cid);
  if (!c) continue;
  const ln = parseInt(c.taughtInLessonId.replace('fsp_l_',''),10);
  const cleaner = (t) => t.replace(/^(Fragen Sie|Erfragen Sie|Klären Sie|Erklären Sie|Dokumentieren Sie|Besprechen Sie|Erstellen Sie)\s*/,'');
  scenarios.push(mkRp({ type:'FSP-patient', level:ln<=10?'B1':'B2',
    title:c.title,
    scenario:'Sie sind Ärztin/Arzt in einer deutschen Klinik. Ein Patient kommt: '+c.patientRole.chiefComplaint+'. Führen Sie das Gespräch.',
    userRole:'Ärztin/Arzt', partnerRole:'Patient/in ('+c.patientRole.age+', '+c.patientRole.gender+')',
    goal:'Vollständige Anamnese erheben und Fall strukturieren',
    expectedPoints:['Patient begrüßen','Symptome erfragen','Red Flags abfragen',...(c.doctorTasks||[]).map(cleaner),'In verständlicher Sprache erklären'],
    usefulPhrases:c.usefulPhrases||['Was führt Sie zu mir?','Können Sie mir Ihre Symptome beschreiben?'],
    vocabTargets:c.requiredConcepts||['Anamnese','Symptome'], grammarTargets:['Fragesätze','Konjunktiv II'],
    requiredConcepts:c.requiredConcepts||[], taughtInLessonId:c.taughtInLessonId,
    checklist:['Patient begrüßt','Symptome erfragt','Red Flags geprüft','Verständlich erklärt','Dokumentiert'],
    rubric:c.scoringRubric||{grammar:'Anamnese-Sprache',vocabulary:'medizinisch',structure:'Gesprächsablauf',taskCompletion:'Anamnese vollständig'},
    tags:[...new Set([...(c.tags||[]),'fsp','doctor-patient'])],
    caseId:c.id, specialty:c.setting, redFlags:c.redFlags||[],
    handoverPoints:c.doctorToDoctorSummary?[c.doctorToDoctorSummary]:[],
    arztbriefPoints:c.doctorToDoctorSummary?[c.doctorToDoctorSummary]:[] }));
}

// ════════════════════════════════════════════
// 10 Doctor-Doctor Handover Roleplays
// ════════════════════════════════════════════
const hcKeys = ['fsp_c_101','fsp_c_105','fsp_c_107','fsp_c_116','fsp_c_117','fsp_c_118','fsp_c_119','fsp_c_121','fsp_c_126','fsp_c_127'];
const hc = hcKeys.map(k=>fspCases.find(fc=>fc.id===k)).filter(Boolean);
const hcTemplates = [
  {t:'Übergabe: Neuer Patient mit Brustschmerz',g:'Fall strukturiert an Oberarzt übergeben'},
  {t:'Übergabe: ACS-Verdacht',g:'Akuten Fall präzise an Schichtarzt übergeben'},
  {t:'Übergabe: Rückenschmerz mit Red Flags',g:'Red Flags zusammenfassen'},
  {t:'Übergabe: Donnerschlag-Kopfschmerz',g:'Dringenden Neuro-Fall übergeben'},
  {t:'Übergabe: Kardiale Dekompensation',g:'Akute Verschlechterung übergeben'},
  {t:'Übergabe: Schlaganfall-Verdacht',g:'Stroke-Verdacht an Neurologie übergeben'},
  {t:'Übergabe: Kind mit Fieber',g:'Pädiatrischen Fall übergeben'},
  {t:'Übergabe: Asthma-Exazerbation',g:'Pulmonalen Notfall übergeben'},
  {t:'Übergabe: Ältere Patientin mit HWI',g:'Geriatrischen Fall dokumentiert übergeben'},
  {t:'Übergabe: Anaphylaxie',g:'Allergologischen Notfall übergeben'},
];
for (let i=0; i<hc.length && i<hcTemplates.length; i++) {
  const c=hc[i], t=hcTemplates[i];
  if (!c) continue;
  scenarios.push(mkRp({ type:'FSP-handover', level:'B2', title:t.t,
    scenario:'Sie sind Stationsarzt/-ärztin. Übergeben Sie den Fall ('+c.patientRole.age+'J, '+c.patientRole.gender+', '+c.patientRole.chiefComplaint+') an den nächsten Dienst.',
    userRole:'Stationsarzt/-ärztin', partnerRole:'Diensthabende/r Kollege/in', goal:t.g,
    expectedPoints:['Patient vorstellen (Alter, Geschlecht)','Aufnahmegrund nennen','Red Flags hervorheben','Aktuellen Status beschreiben','Weitere Maßnahmen vorschlagen'],
    usefulPhrases:['Ich übergebe Ihnen...','Aufnahmegrund ist...','Die Red Flags sind...','Bitte beachten Sie...'],
    vocabTargets:['Übergabe','Dokumentation','Red Flags'], grammarTargets:['Passiv','Perfekt','Nebensätze'],
    requiredConcepts:c.requiredConcepts||[], taughtInLessonId:c.taughtInLessonId,
    checklist:['Patient vorgestellt','Diagnose genannt','Red Flags hervorgehoben','Weitere Schritte genannt'],
    rubric:{grammar:'ISBAR-Struktur',vocabulary:'Fachtermini',structure:'Übergabe',taskCompletion:'Alle relevanten Infos übergeben'},
    tags:['fsp','handover','ISBAR',c.setting], caseId:c.id, specialty:c.setting, redFlags:c.redFlags||[],
    handoverPoints:[c.doctorToDoctorSummary||'Fall dokumentiert','Weitere Diagnostik veranlassen','Verlauf dokumentieren'],
    arztbriefPoints:[c.patientRole.chiefComplaint||'',...(c.redFlags||[]).slice(0,3)] }));
}

// ════════════════════════════════════════════
// 10 Patient Explanation Roleplays
// ════════════════════════════════════════════
const expSources = [
  { t:'Erklärung: Diabetes Typ 2 verstehen', cid:'fsp_c_110', pt:'Patient mit neu diagnostiziertem Diabetes. Erklären Sie die Erkrankung in einfacher Sprache.' },
  { t:'Erklärung: Blutverdünnung nach OP', cid:'fsp_c_111', pt:'Patient benötigt nach OP eine Antikoagulation. Erklären Sie Risiken und Nutzen.' },
  { t:'Erklärung: Notfallplan bei Allergie', cid:'fsp_c_112', pt:'Patient hatte eine anaphylaktische Reaktion. Erklären Sie den Notfallplan.' },
  { t:'Erklärung: MRT-Untersuchung vorbereiten', cid:'fsp_c_116', pt:'Patient braucht ein MRT. Erklären Sie den Ablauf und die Vorbereitung.' },
  { t:'Erklärung: Bewegung nach Hüft-OP', cid:'fsp_c_123', pt:'Patient nach Hüft-TEP. Erklären Sie die Nachsorge und Bewegungsgrenzen.' },
  { t:'Erklärung: Hautkrebs-Screening', cid:'fsp_c_128', pt:'Patient zur Hautkrebsvorsorge. Erklären Sie die Untersuchung.' },
  { t:'Erklärung: Schilddrüsenknoten abklären', cid:'fsp_c_130', pt:'Patient hat einen Schilddrüsenknoten. Erklären Sie die nächsten Schritte.' },
  { t:'Erklärung: Depression als Erkrankung', cid:'fsp_c_120', pt:'Patient versteht Depression nicht als Erkrankung. Erklären Sie einfühlsam.' },
  { t:'Erklärung: Röntgenaufnahme', cid:'fsp_c_107', pt:'Patient braucht ein Röntgen des Rückens. Erklären Sie den Ablauf.' },
  { t:'Erklärung: Inhalation bei Asthma', cid:'fsp_c_121', pt:'Patient mit Asthma. Erklären Sie die richtige Inhalationstechnik.' },
];
for (const e of expSources) {
  const c = fspCases.find(fc => fc.id === e.cid);
  if (!c) continue;
  scenarios.push(mkRp({ type:'FSP-explanation', level:'B1', title:e.t, scenario:e.pt,
    userRole:'Ärztin/Arzt', partnerRole:'Patient/in',
    goal:'Medizinischen Sachverhalt in Laiensprache erklären',
    expectedPoints:['Patient abholen','Fachbegriffe vermeiden oder erklären','Bildliche Sprache verwenden','Rückfragen ermöglichen','Wichtigkeit vermitteln'],
    usefulPhrases:['Ich erkläre Ihnen das in einfachen Worten.','Vergleichen kann man es mit...','Haben Sie Fragen dazu?'],
    vocabTargets:['Aufklärung','Patientensprache','Behandlung'], grammarTargets:['Hauptsätze','einfache Nebensätze'],
    requiredConcepts:c.requiredConcepts||[], taughtInLessonId:c.taughtInLessonId,
    checklist:['Fachbegriffe vermieden oder erklärt','Bildsprache verwendet','Nach Verständnis gefragt','Nächste Schritte erklärt'],
    rubric:{grammar:'Einfache Sätze',vocabulary:'Laiensprache',structure:'Aufklärungsgespräch',taskCompletion:'Patient versteht'},
    tags:['fsp','explanation','patient-education',c.setting], caseId:c.id, specialty:c.setting,
    handoverPoints:[c.doctorToDoctorSummary||''] }));
}

fs.writeFileSync(path.join(DATA,'roleplayScenarios.json'), JSON.stringify(scenarios,null,2));
console.log('Generated '+scenarios.length+' roleplay scenarios');
console.log('Types:');
const byType = {};
scenarios.forEach(s => { byType[s.type] = (byType[s.type]||0)+1; });
Object.entries(byType).forEach(([k,v]) => console.log('  '+k+': '+v));
