import fs from 'fs';
import { execSync } from 'child_process';

const listeningPath = 'src/data/listening.json';
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));

const b2 = listening.B2;
const prevCount = b2.length;
console.log(`Previous B2 listening count: ${prevCount}`);

const batch4 = [
  {
    id: 'B2_listen_34', lessonId: 'B2_lesson_21', level: 'B2',
    title: 'Unterweisung: Hygieneplan der Klinik',
    script: 'Guten Morgen, ich begruesse Sie zur jaehrlichen Hygieneschulung. Das ist fuer alle Mitarbeiter, die direkt mit Patienten arbeiten, verpflichtend. Die wichtigste Massnahme bleibt die Haendedesinfektion vor und nach jedem Patientenkontakt. Bitte beachten Sie: Kein Schmuck an Haenden und Unterarmen. Tragen Sie bei jedem Patientenkontakt Einmalhandschuhe. Antibiotikaresistente Keime nehmen zu, deshalb ist die Einhaltung der Hygieneregeln wichtiger denn je. Nach der Schulung gibt es einen kurzen Test. Wer besteht, bekommt eine Bescheinigung.',
    questions: [
      { id: 'b2l34a', type: 'mcq', question: 'Fuer wen ist die Hygieneschulung verpflichtend?', options: ['Nur Aerzte', 'Nur Pflegekraefte', 'Alle Mitarbeiter mit direktem Patientenkontakt', 'Nur neue Mitarbeiter'], answer: 'Alle Mitarbeiter mit direktem Patientenkontakt' },
      { id: 'b2l34b', type: 'mcq', question: 'Was ist die wichtigste Hygienemassnahme?', options: ['Desinfektion der Geraete', 'Haendedesinfektion vor und nach Patientenkontakt', 'Schutzkittel tragen', 'Fusssohlen desinfizieren'], answer: 'Haendedesinfektion vor und nach Patientenkontakt' },
      { id: 'b2l34c', type: 'true-false', question: 'Nach der Schulung gibt es einen kurzen Test.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_35', lessonId: 'B2_lesson_14', level: 'B2',
    title: 'Infoabend: Gesund im Schichtdienst',
    script: 'Guten Abend und herzlich willkommen zum Vortrag Gesund im Schichtdienst. Ich bin Schlafmediziner Dr. Nowak. Schichtarbeit belastet den Koerper, besonders den Schlaf-Wach-Rhythmus. Meine Empfehlungen: Halten Sie auch am freien Tag einen regelmaessigen Schlafrhythmus ein. Dunkeln Sie Ihr Schlafzimmer komplett ab. Vermeiden Sie schwere Mahlzeiten vor dem Schlafengehen und trinken Sie nach 14 Uhr keinen Kaffee mehr. Wichtig: Bei anhaltenden Schlafstoerungen suchen Sie einen Arzt auf. Das ist kein Zeichen von Schwaeche.',
    questions: [
      { id: 'b2l35a', type: 'mcq', question: 'Was belastet Schichtarbeit besonders?', options: ['Den Blutdruck', 'Den Schlaf-Wach-Rhythmus', 'Die Verdauung', 'Das Sehvermoegen'], answer: 'Den Schlaf-Wach-Rhythmus' },
      { id: 'b2l35b', type: 'true-false', question: 'Man sollte nach 14 Uhr keinen Kaffee mehr trinken.', answer: 'true' },
      { id: 'b2l35c', type: 'mcq', question: 'Wie sollen anhaltende Schlafstoerungen behandelt werden?', options: ['Mit Schlafmitteln aus der Apotheke', 'Durch einen Arztbesuch', 'Durch mehr Sport', 'Durch frueheres Zubettgehen'], answer: 'Durch einen Arztbesuch' }
    ]
  },
  {
    id: 'B2_listen_36', lessonId: 'B2_lesson_12', level: 'B2',
    title: 'Telefonat: Patientenbeschwerde',
    script: 'Guten Tag, Beschwerdemanagement des Klinikums, mein Name ist Schubert. "Guten Tag, ich bin Frau Krueger. Mein Vater war letzte Woche bei Ihnen auf Station zehn. Ich bin sehr unzufrieden." Was war das Problem? "Niemand hat uns ueber die Entlassung informiert. Wir wurden voellig ueberrascht, als er ploetzlich zu Hause stand." Das tut mir leid. Normalerweise bekommen Angehoerige am Tag vor der Entlassung einen Anruf. Ich werde den Vorfall an die Stationsleitung weiterleiten. "Danke, das moechte ich."',
    questions: [
      { id: 'b2l36a', type: 'mcq', question: 'Worueber beschwert sich Frau Krueger?', options: ['Ueber das Essen', 'Ueber die fehlende Information zur Entlassung', 'Ueber die Wartezeit', 'Ueber die Reinigung'], answer: 'Ueber die fehlende Information zur Entlassung' },
      { id: 'b2l36b', type: 'mcq', question: 'Normalerweise bekommen Angehoerige wann einen Anruf?', options: ['Am Tag der Entlassung', 'Am Tag vor der Entlassung', 'Eine Woche vorher', 'Gar nicht'], answer: 'Am Tag vor der Entlassung' },
      { id: 'b2l36c', type: 'true-false', question: 'Der Mitarbeiter leitet den Vorfall an die Stationsleitung weiter.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_37', lessonId: 'B2_lesson_16', level: 'B2',
    title: 'Anleitung: Blutdruckmessgeraet bedienen',
    script: 'Willkommen zur Einweisung in das neue Blutdruckmessgeraet Modell Meditec 3000. Bitte legen Sie die Manschette etwa zwei Zentimeter oberhalb der Ellenbeuge an. Die Manschette sollte fest sitzen, aber nicht einschnueren. Druecken Sie dann die Starttaste. Das Geraet pumpt automatisch auf und zeigt nach etwa 30 Sekunden den Blutdruck an. Wichtig: Messen Sie immer am selben Arm und zur selben Tageszeit. Fuehren Sie vor der Messung keine anstrengenden Taetigkeiten aus. Bei Fehlermeldung E4 ist die Manschette nicht richtig angebracht.',
    questions: [
      { id: 'b2l37a', type: 'mcq', question: 'Wo wird die Manschette angebracht?', options: ['Am Handgelenk', 'Zwei Zentimeter oberhalb der Ellenbeuge', 'Am Oberarm oben', 'Am Unterarm'], answer: 'Zwei Zentimeter oberhalb der Ellenbeuge' },
      { id: 'b2l37b', type: 'true-false', question: 'Das Geraet zeigt nach etwa 30 Sekunden den Blutdruck an.', answer: 'true' },
      { id: 'b2l37c', type: 'mcq', question: 'Was bedeutet die Fehlermeldung E4?', options: ['Batterie leer', 'Manschette nicht richtig angebracht', 'Blutdruck zu hoch', 'Geraet defekt'], answer: 'Manschette nicht richtig angebracht' }
    ]
  },
  {
    id: 'B2_listen_38', lessonId: 'B2_lesson_10', level: 'B2',
    title: 'Ablehnungsbescheid der Krankenkasse',
    script: 'Guten Tag, hier spricht Frau Lorenz von der AOK. Ich habe Ihren Antrag auf Kostenuebernahme fuer die Reha geprueft. Leider muss ich Ihnen mitteilen, dass wir die Kosten nicht uebernehmen koennen. Die Begruendung: Die beantragte Reha-Einrichtung ist nicht in unserem Vertragsnetz. Bitte lassen Sie sich von Ihrem Hausarzt eine Verordnung fuer eine Vertragseinrichtung ausstellen. Sie haben ab Erhalt dieses Bescheids vier Wochen Zeit, Widerspruch einzulegen. Moechten Sie, dass ich Ihnen die Details zuschicke?',
    questions: [
      { id: 'b2l38a', type: 'mcq', question: 'Warum uebernimmt die Krankenkasse die Kosten nicht?', options: ['Die Reha ist nicht noetig', 'Die Einrichtung ist nicht im Vertragsnetz', 'Der Antrag war zu spaet', 'Die Versicherung wurde gekuendigt'], answer: 'Die Einrichtung ist nicht im Vertragsnetz' },
      { id: 'b2l38b', type: 'mcq', question: 'Wie viel Zeit hat der Patient fuer einen Widerspruch?', options: ['Zwei Wochen', 'Drei Wochen', 'Vier Wochen', 'Sechs Wochen'], answer: 'Vier Wochen' },
      { id: 'b2l38c', type: 'true-false', question: 'Der Arzt muss eine Verordnung fuer eine Vertragseinrichtung ausstellen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_39', lessonId: 'B2_lesson_6', level: 'B2',
    title: 'Sicherheitsunterweisung: Arbeiten im Labor',
    script: 'Herzlich willkommen zur Sicherheitsunterweisung fuer das medizinische Labor. Bitte beachten Sie folgende Regeln: Tragen Sie immer einen Laborkittel und geschlossene Schuhe. Essen und Trinken ist im Labor strengstens verboten. Arbeiten Sie mit infektiösem Material nur unter der Sicherheitswerkbank. Nach der Arbeit desinfizieren Sie Ihre Arbeitsflaeche. Alle Abfaelle muessen getrennt entsorgt werden: Restmuell, Glas und Spitzenbehaelter. Bei einem Unfall benachrichtigen Sie sofort den Labormanager und betätigen Sie die Notdusche.',
    questions: [
      { id: 'b2l39a', type: 'mcq', question: 'Was ist im Labor strengstens verboten?', options: ['Telefonieren', 'Essen und Trinken', 'Lautes Reden', 'Allein arbeiten'], answer: 'Essen und Trinken' },
      { id: 'b2l39b', type: 'true-false', question: 'Arbeiten mit infektioesem Material sind unter der Sicherheitswerkbank erlaubt.', answer: 'true' },
      { id: 'b2l39c', type: 'mcq', question: 'Was soll man bei einem Unfall tun?', options: ['Warten, bis jemand kommt', 'Den Labormanager informieren und die Notdusche betätigen', 'Selbst weggehen', 'Die Polizei rufen'], answer: 'Den Labormanager informieren und die Notdusche betätigen' }
    ]
  },
  {
    id: 'B2_listen_40', lessonId: 'B2_lesson_20', level: 'B2',
    title: 'Personalgespraech: Psychische Belastung am Arbeitsplatz',
    script: 'Guten Tag, Herr Saenger, danke, dass Sie gekommen sind. Unser Betriebsarzt hat mir Ihre Krankschreibung gezeigt. Sechs Wochen wegen Burnout, das ist eine lange Zeit. "Ja, ich habe lange versucht, weiterzuarbeiten, aber es ging nicht mehr." Das verstehe ich. Wir bieten allen Mitarbeitern ein vertrauliches Gespraech mit der psychologischen Beratungsstelle an. Ausserdem koennen Sie staerker von der flexiblen Arbeitszeitregelung profitieren. Und ganz wichtig: Wir besprechen nach Ihrer Rueckkehr gemeinsam, wie wir Ihre Aufgaben besser verteilen koennen.',
    questions: [
      { id: 'b2l40a', type: 'mcq', question: 'Wie lange ist Herr Saenger krankgeschrieben?', options: ['Zwei Wochen', 'Vier Wochen', 'Sechs Wochen', 'Acht Wochen'], answer: 'Sechs Wochen' },
      { id: 'b2l40b', type: 'true-false', question: 'Die Klinik bietet ein Gespraech mit der psychologischen Beratungsstelle an.', answer: 'true' },
      { id: 'b2l40c', type: 'mcq', question: 'Was wird nach der Rueckkehr besprochen?', options: ['Ob Herr Saenger gekuendigt wird', 'Wie die Aufgaben besser verteilt werden', 'Ob die Arbeitszeit reduziert wird', 'Ob ein Arbeitsplatzwechsel noetig ist'], answer: 'Wie die Aufgaben besser verteilt werden' }
    ]
  },
  {
    id: 'B2_listen_41', lessonId: 'B2_lesson_9', level: 'B2',
    title: 'Beratungsgespraech: Ernaehrung bei Diabetes',
    script: 'Guten Tag, Frau Weiss, ich bin Ihre Ernaehrungsberaterin. Sie haben neu diagnostizierten Diabetes Typ 2. Keine Sorge, mit der richtigen Ernaehrung koennen Sie viel erreichen. Wichtig ist: Essen Sie regelmaessig, drei Hauptmahlzeiten pro Tag. Vermeiden Sie zuckerhaltige Getraenke und stark verarbeitete Lebensmittel. Setzen Sie auf Vollkornprodukte, Gemuese und mageres Eiweiss. Notieren Sie zwei Wochen lang, was Sie essen, dann sehen wir gemeinsam, wo wir ansetzen koennen. Bewegung ist auch wichtig: 30 Minuten Spaziergang taeglich wirken Wunder.',
    questions: [
      { id: 'b2l41a', type: 'mcq', question: 'Wie viele Hauptmahlzeiten werden empfohlen?', options: ['Zwei', 'Drei', 'Vier', 'Fuenf'], answer: 'Drei' },
      { id: 'b2l41b', type: 'mcq', question: 'Was sollen die Patienten zwei Wochen lang notieren?', options: ['Die Blutzuckerwerte', 'Was sie essen', 'Das Gewicht', 'Den Blutdruck'], answer: 'Was sie essen' },
      { id: 'b2l41c', type: 'true-false', question: '30 Minuten taeglicher Spaziergang wird empfohlen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_42', lessonId: 'B2_lesson_3', level: 'B2',
    title: 'Arztvortrag: Impfempfehlungen fuer Erwachsene',
    script: 'Guten Abend, meine Damen und Herren. Heute geht es um Impfungen fuer Erwachsene. Viele denken, Impfungen seien nur fuer Kinder wichtig. Das ist nicht richtig. Die Staendige Impfkommission empfiehlt allen Erwachsenen ab 60 Jahren eine Grippeimpfung und eine Impfung gegen Pneumokokken. Alle fuenf Jahre sollte der Tetanus- und Diphtherie-Schutz aufgefrischt werden. Die Impfung gegen FSME wird fuer Menschen empfohlen, die in Risikogebieten wohnen oder dorthin reisen. Lassen Sie Ihren Impfausweis regelmaessig vom Hausarzt ueberpruefen.',
    questions: [
      { id: 'b2l42a', type: 'mcq', question: 'Ab welchem Alter wird die Grippeimpfung empfohlen?', options: ['Ab 50', 'Ab 55', 'Ab 60', 'Ab 65'], answer: 'Ab 60' },
      { id: 'b2l42b', type: 'mcq', question: 'Wie oft sollte der Tetanus- und Diphtherie-Schutz aufgefrischt werden?', options: ['Jedes Jahr', 'Alle drei Jahre', 'Alle fuenf Jahre', 'Alle zehn Jahre'], answer: 'Alle fuenf Jahre' },
      { id: 'b2l42c', type: 'true-false', question: 'Die FSME-Impfung wird fuer Menschen in Risikogebieten empfohlen.', answer: 'true' }
    ]
  },
  {
    id: 'B2_listen_43', lessonId: 'B2_lesson_5', level: 'B2',
    title: 'Patienteninfo: Videosprechstunde',
    script: 'Herzlich willkommen zur Videosprechstunde der Praxis Dres. Hoffmann. Sie haben heute einen Termin per Video. Bitte achten Sie auf folgende Punkte: Sorgen Sie fuer eine ruhige Umgebung und eine gute Internetverbindung. Halten Sie Ihre Versicherungskarte und eine Liste Ihrer aktuellen Medikamente bereit. Die Videosprechstunde ersetzt nicht den persoenlichen Arztbesuch, ist aber sehr gut geeignet fuer Verlaufskontrollen und Folgerezepte. Nach dem Gespraech erhalten Sie ein Rezept per Post oder elektronisch. Bei technischen Problemen waehlen Sie bitte die Praxisnummer.',
    questions: [
      { id: 'b2l43a', type: 'mcq', question: 'Was soll der Patient bereithalten?', options: ['Das letzte Rezept', 'Die Versicherungskarte und eine Medikamentenliste', 'Einen Impfpass', 'Eine Ueberweisung'], answer: 'Die Versicherungskarte und eine Medikamentenliste' },
      { id: 'b2l43b', type: 'true-false', question: 'Die Videosprechstunde ersetzt den persoenlichen Arztbesuch komplett.', answer: 'false' },
      { id: 'b2l43c', type: 'mcq', question: 'Wie erhaelt der Patient das Rezept?', options: ['Nur per Post', 'Per Post oder elektronisch', 'Nur elektronisch', 'Muss es selbst abholen'], answer: 'Per Post oder elektronisch' }
    ]
  }
];

b2.push(...batch4);
console.log(`B2 count after batch 4: ${b2.length}`);

function validate() {
  const errors = [];
  if (b2.length !== 43) errors.push(`Expected 43 B2 items, got ${b2.length}`);

  const allIds = b2.map(p => p.id);
  const seen = new Set();
  allIds.forEach(id => { if (seen.has(id)) errors.push(`Duplicate ID: ${id}`); seen.add(id); });

  const scriptStarts = new Set();
  b2.forEach(p => {
    const s = p.script.substring(0, 40).toLowerCase();
    if (scriptStarts.has(s)) errors.push(`Duplicate script start: ${p.id} - ${p.title}`);
    scriptStarts.add(s);
  });

  b2.forEach((p, i) => {
    if (!p.id) errors.push(`Index ${i}: missing id`);
    if (!p.title) errors.push(`Index ${i}: missing title`);
    if (!p.script) errors.push(`Index ${i}: missing script`);
    if (!p.lessonId || !p.lessonId.startsWith('B2_lesson_')) errors.push(`Index ${i}: invalid lessonId`);
    if (!p.questions || p.questions.length === 0) errors.push(`Index ${i} (${p.id}): missing questions`);
    else p.questions.forEach(q => {
      if (!q.id) errors.push(`${p.id}: question missing id`);
      if (!q.type) errors.push(`${p.id}: q missing type`);
      if (!q.question) errors.push(`${p.id}: q missing question`);
      if (!q.answer) errors.push(`${p.id}: q missing answer`);
      if (q.type === 'mcq' && (!q.options || q.options.length < 2)) errors.push(`${p.id}: MCQ missing options`);
      if (q.options && q.type === 'mcq') {
        q.options.forEach((o, idx) => {
          if (Array.isArray(o)) errors.push(`${p.id}: ${q.id} option ${idx} is a nested array`);
        });
      }
    });
  });

  return errors;
}

const errors = validate();
if (errors.length > 0) {
  console.log('\nVALIDATION ERRORS:');
  errors.forEach(e => console.log(`  - ${e}`));
  process.exit(1);
}

fs.writeFileSync(listeningPath, JSON.stringify(listening, null, 2) + '\n');
console.log('File written successfully.');

console.log('\nRunning npm build...');
try {
  execSync('npm run build 2>&1', { timeout: 120000 });
  console.log('\nBATCH 4 COMPLETE - ALL CHECKS PASSED');
} catch (e) {
  console.log('BUILD FAILED:', e.stderr?.toString().slice(0, 1000) || e.message);
  process.exit(1);
}
