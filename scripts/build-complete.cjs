/**
 * This script merges b2-enrich-all.cjs with the supplementary part2 data.
 * It reads the current (truncated) b2-enrich-all.cjs and appends the missing
 * data definitions (mistakes for lessons 12-25, processing logic).
 */
const fs = require('fs');

const part1 = fs.readFileSync('scripts/b2-enrich-all.cjs', 'utf8');
const combined = part1 + '\n// ==== APPENDED BY build-complete.js ====\n';

// Extract what was truncated and add complete mistakes + processing logic
const extra = `
// THEME_MISTAKES for lessons 12-25 (continuing from truncated content)
  ],
  B2_lesson_12: [
    {mistake:'Subjektive Meinung ohne Kennzeichnung', correction:'\"Meiner Ansicht nach...\" / \"Aus ethischer Sicht...\"', explanation:'Wissenschaftsethik erfordert klare Kennzeichnung'},
    {mistake:'Fehlende Argumentstruktur', correction:'These - Argument - Beispiel - Schlussfolgerung', explanation:'Wissenschaftliche Argumentation folgt Struktur'},
    {mistake:'Kein Konjunktiv I in Zitaten', correction:'\"Der Forscher behauptet, die Studie sei valide.\"', explanation:'Indirekte Rede nutzt K.I'},
    {mistake:'Passiv in Diskussion vergessen', correction:'\"Die Ergebnisse wurden uberpruft.\"', explanation:'Wissenschaftlich: Passiv reduziert Subjektivitat'},
    {mistake:'Konnektoren fehlen (folglich, demnach, insofern)', correction:'\"Die Hypothese bestatigt sich nicht, folglich...\"', explanation:'Folgerungskonnektoren fur wiss. Texte'}
  ],
  B2_lesson_13: [
    {mistake:'\"Bewerbung\" mit falscher Anrede', correction:'\"Sehr geehrte Damen und Herren\"', explanation:'Formelle Anrede standardisiert'},
    {mistake:'Kein Konjunktiv II im Gesprach', correction:'\"Ich wurde sagen, dass ich uber Erfahrung verfuge.\"', explanation:'Hoflichkeit durch K.II/indirekte Rede'},
    {mistake:'Zu direkte Fragen', correction:'\"Durfte ich fragen, welche Aufgaben...?\"', explanation:'Hoflichkeit durch Modalverben subjektiv'},
    {mistake:'Falsche Zeitform im Lebenslauf', correction:'Prasens (aktuell), Prateritum (fruher)', explanation:'Tempuswechsel im Lebenslauf'},
    {mistake:'Anschreiben ohne Struktur', correction:'Einleitung - Motivation - Qualifikation - Schluss', explanation:'Klare Struktur im Bewerbungsschreiben'}
  ],
  B2_lesson_14: [
    {mistake:'Ubermassiges \"man\"', correction:'Passiv oder bestimmtes Subjekt verwenden', explanation:'B2 vermeidet pauschales \"man\"'},
    {mistake:'Keine Nominalisierungen (Umwelt)', correction:'\"Die Reduzierung von CO2-Emissionen...\"', explanation:'Umweltthemen erfordern Fachvokabular'},
    {mistake:'\"sorgen fur/um\" verwechselt', correction:'\"sorgen fur\" = verursachen, \"sich sorgen um\" = sich kummern', explanation:'Praposition andert Bedeutung'},
    {mistake:'Kein Konjunktiv II fur Vorschlage', correction:'\"Man konnte mehr investieren.\"', explanation:'Vorschlage mit K.II formulieren'},
    {mistake:'Keine B2-Konnektoren', correction:'\"Je mehr wir investieren, desto schneller...\"', explanation:'Je-desto fur Zusammenhange'}
  ],
  B2_lesson_15: [
    {mistake:'Falsche Fachbegriffe', correction:'Aktie, Anleihe, Dividende, Investmentfonds', explanation:'Wirtschaftsvokabular wichtig'},
    {mistake:'Kein Passiv in Wirtschaftstexten', correction:'\"Die Aktien werden an der Borse gehandelt.\"', explanation:'Passiv in Wirtschaftstexten ublich'},
    {mistake:'Verb-Praposition falsch', correction:'\"investieren in\" (Akk), \"finanzieren durch\" (Akk)', explanation:'Feste Prapositionen bei Wirtschaftsverben'},
    {mistake:'Funktionsverbgefuge fehlen', correction:'\"in Kraft treten\", \"zur Verfugung stellen\"', explanation:'Typisch fur Wirtschaftsdeutsch'},
    {mistake:'Keine indirekte Rede', correction:'\"Der Vorstand gab bekannt, der Gewinn sei gestiegen.\"', explanation:'Wirtschaftsberichte mit indirekter Rede'}
  ],
  B2_lesson_16: [
    {mistake:'\"Integration\" vs \"Assimilation\"', correction:'Integration = gegenseitige Anpassung', explanation:'Begriffliche Differenzierung auf B2'},
    {mistake:'Kein Konjunktiv I in Diskussion', correction:'\"Die Studie zeigt, dass Integration gelinge.\"', explanation:'Zitate mit K.I wiedergeben'},
    {mistake:'\"wo\" statt Praposition+Pronomen', correction:'\"die Gesellschaft, in der wir leben\"', explanation:'Formell: Praposition + Relativpronomen'},
    {mistake:'Falsche Praposition: \"ankommen in/auf\"', correction:'\"ankommen auf\" = abhangen von', explanation:'Praposition andert Bedeutung'},
    {mistake:'Keine komplexen Nebensatze', correction:'\"Obwohl Integration Herausforderungen birgt...\"', explanation:'B2 erwartet komplexe Satzstrukturen'}
  ],
  B2_lesson_17: [
    {mistake:'\"Grundgesetz\" falscher Artikel', correction:'\"das Grundgesetz\" (Neutrum)', explanation:'Politische Begriffe mit korrektem Artikel'},
    {mistake:'Kein Passiv im Rechtskontext', correction:'\"Das Gesetz wurde vom Bundestag verabschiedet.\"', explanation:'Rechtstexte nutzen haufig Passiv'},
    {mistake:'Nominalstil in Gesetzen nicht verstanden', correction:'\"Die Wahrnehmung von Rechten...\"', explanation:'Gesetzestexte sind stark nominalisiert'},
    {mistake:'Falsche Konnektoren', correction:'\"Insofern die Klage begrundet ist...\"', explanation:'Juristische Texte mit spezifischen Konnektoren'},
    {mistake:'Genitiv-Relativsatze falsch', correction:'\"die Rechte, deren Verletzung geklagt wird\"', explanation:'Haufig im Rechtsdeutsch'}
  ],
  B2_lesson_18: [
    {mistake:'Kein Konjunktiv I in Medienanalyse', correction:'\"Der Artikel behauptet, die Pressefreiheit sei gefahrdet.\"', explanation:'Medienanalyse mit K.I'},
    {mistake:'Keine Partizipialattribute', correction:'\"Die von der Regierung kritisierte Berichterstattung...\"', explanation:'Partizipialattribute verdichten Info'},
    {mistake:'\"schreiben uber/an\" verwechselt', correction:'\"uber\" (Thema), \"an\" (Adressat)', explanation:'Prapositionen unterscheiden'},
    {mistake:'Kein Konjunktiv II bei Kritik', correction:'\"Man konnte die Berichterstattung als einseitig betrachten.\"', explanation:'Kritik mit K.II abschwachen'},
    {mistake:'Aktiv statt Passiv in Analyse', correction:'\"Die Medien werden von der Politik beeinflusst.\"', explanation:'Passiv betont Objekt der Analyse'}
  ],
  B2_lesson_19: [
    {mistake:'Reflexivverben falsch', correction:'\"Ich erinnere mich an...\" (nicht: \"Ich erinnere...\")', explanation:'Psychologie-Vokabular hat viele Reflexivverben'},
    {mistake:'Kein K.II fur Hypothesen', correction:'\"Wenn mehr Menschen Sport trieben...\"', explanation:'Hypothesen mit K.II'},
    {mistake:'\"glauben an/auf\" falsch', correction:'\"glauben an\" + Akk', explanation:'Feste Praposition bei \"glauben\"'},
    {mistake:'Keine Da-Komposita', correction:'\"Daruber hinaus...\", \"Hiervon ausgehend...\"', explanation:'Strukturieren Argumentation'},
    {mistake:'Keine indirekte Rede in Studienzitaten', correction:'\"Die Autoren argumentieren, Motivation sei entscheidend.\"', explanation:'Studienzitate mit K.I'}
  ],
  B2_lesson_20: [
    {mistake:'\"Reisen\" vs \"verreisen\" vs \"bereisen\"', correction:'reisen (allg.), verreisen (wegfahren), bereisen (ein Land)', explanation:'Differenzierung der Reiseworter'},
    {mistake:'Genitiv bei Landernamen', correction:'\"die Kultur Italiens\" oder \"die italienische Kultur\"', explanation:'Genitiv bei Landernamen mit Artikel'},
    {mistake:'Keine Prapositionaladverbien', correction:'\"Worauf kommt es beim Reisen an?\"', explanation:'Da-Komposita im Reisekontext'},
    {mistake:'Wechselprapositionen verwechselt', correction:'\"in die Stadt fahren\" (Akk) vs \"in der Stadt sein\" (Dat)', explanation:'Wo? (Dat) vs Wohin? (Akk)'},
    {mistake:'Passiversatz \"sich lassen\" fehlt', correction:'\"Der Flug lasst sich nicht stornieren.\"', explanation:'Passiversatz im Reisekontext'}
  ],
  B2_lesson_21: [
    {mistake:'\"digitalisieren\" vs \"digital\"', correction:'digitalisieren (Verb), digital (Adj.)', explanation:'Wortbildung im Digitalkontext'},
    {mistake:'Keine Nominalisierungen', correction:'\"Die Vernetzung von Geraten...\"', explanation:'Technische Texte mit Nominalstil'},
    {mistake:'Kein Passiv mit Modalverben', correction:'\"KI kann in vielen Bereichen eingesetzt werden.\"', explanation:'Diskussion uber KI mit Passiv + Modal'},
    {mistake:'Falscher Konnektor \"dadurch, dass\"', correction:'\"Dadurch, dass Prozesse automatisiert werden...\"', explanation:'Kausale Zusammenhange'},
    {mistake:'Keine Da-Komposita', correction:'\"Hiermit beschaftigt sich die aktuelle Forschung.\"', explanation:'Formelle Technikdiskussion'}
  ],
  B2_lesson_22: [
    {mistake:'Historisches Prasens vs Vergangenheit', correction:'Prasens fur Analyse, Prateritum fur Ereignisse', explanation:'Tempuswahl in historischen Texten'},
    {mistake:'Passiv in Geschichte', correction:'\"Die Mauer wurde 1961 errichtet.\"', explanation:'Historische Ereignisse im Passiv'},
    {mistake:'K.I in historischen Zitaten', correction:'\"Brandt sagte, der Mauerfall sei ein historischer Moment.\"', explanation:'Zitate mit K.I'},
    {mistake:'Konnektoren fur zeitliche Abfolge', correction:'\"zunachst... daraufhin... schlieSSlich...\"', explanation:'Zeitliche Abfolge strukturieren'},
    {mistake:'Relativsatze mit Prapositionen', correction:'\"die Zeit, in der die Mauer stand\"', explanation:'Historische Zusammenhange'}
  ],
  B2_lesson_23: [
    {mistake:'Satzverkurzung mit Partizipien', correction:'\"Die steigende Urbanisierung fuhrt zu...\"', explanation:'Partizipialattribute statt Nebensatze'},
    {mistake:'Keine je-desto Vergleiche', correction:'\"Je dichter die Stadt, desto hoher die Mieten.\"', explanation:'Vergleiche fur Stadtentwicklung'},
    {mistake:'Keine Nominalisierungen', correction:'\"Die Verdichtung urbaner Raume...\"', explanation:'Nominalstil fur Stadtanalyse'},
    {mistake:'Kein Futur II fur Prognosen', correction:'\"Bis 2030 werden die Stadte dichter geworden sein.\"', explanation:'Zukunftsperspektiven'},
    {mistake:'Kein K.I in Planungsdiskussion', correction:'\"Der Stadteplaner sagt, der Verkehr solle reduziert werden.\"', explanation:'Planungszitate mit K.I'}
  ],
  B2_lesson_24: [
    {mistake:'\"Energiewende\" vs \"Klimawandel\"', correction:'Energiewende = politische Massnahme', explanation:'Begriffliche Differenzierung'},
    {mistake:'Kein Passiv in Umweltdiskussion', correction:'\"Erneuerbare Energien werden gefordert.\"', explanation:'Umweltpolitik im Passiv'},
    {mistake:'Keine Doppelkonnektoren', correction:'\"Nicht nur die Politik, sondern auch die Wirtschaft...\"', explanation:'Komplexe Zusammenhange'},
    {mistake:'Keine Nominalisierungen', correction:'\"Die Reduzierung von CO2 ist zentral.\"', explanation:'Umweltdeutsch nominalisiert'},
    {mistake:'Kein K.II fur Alternativszenarien', correction:'\"Wenn wir mehr investierten...\"', explanation:'Alternative Energieszenarien'}
  ],
  B2_lesson_25: [
    {mistake:'\"Kultur\" falscher Genus', correction:'\"die Kultur\" (feminin)', explanation:'Kulturbegriffe mit korrektem Artikel'},
    {mistake:'Keine Da-Komposita', correction:'\"Darunter versteht man die kulturelle Vielfalt.\"', explanation:'Da-Komposita fur Kulturbegriffe'},
    {mistake:'Relativsatze im Dativ falsch', correction:'\"die Kultur, in der wir leben\"', explanation:'Relativsatze mit Prapositionen'},
    {mistake:'Kein Passiv im Kulturvergleich', correction:'\"Mode wird von kulturellen Einflussen gepragt.\"', explanation:'Kulturanalyse im Passiv'},
    {mistake:'Kein K.I fur Zitate', correction:'\"Der Autor schreibt, Mode sei Ausdruck von Identitat.\"', explanation:'Kulturzitate mit K.I'}
  ]
};

const MISTAKES = { ...COMSTR, ...THEME_MISTAKES };

// ==========================================================================
// DATA PROCESSING FUNCTIONS
// ==========================================================================

function processLessons() {
  const lessons = load('germanLessons.json');
  let count = 0;
  lessons.forEach(lesson => {
    const meta = LESSON_META[lesson.id];
    if (!meta) return;
    lesson.conceptId = meta.conceptId;
    lesson.estimatedMinutes = meta.estimatedMinutes;
    lesson.prerequisiteConceptIds = meta.prerequisiteConceptIds;
    lesson.conceptsTaught = meta.conceptsTaught;
    lesson.commonMistakes = MISTAKES[lesson.id] || [];
    lesson.formsTable = meta.formsTable || [];
    lesson.miniDrills = meta.miniDrills || [];
    lesson.linkedQuestionIds = meta.linkedQuestionIds || [];
    lesson.trackTags = meta.trackTags;
    lesson.lessonDepthVersion = meta.lessonDepthVersion;
    
    // Expand examples to 10-12 if meta provides them
    if (meta.examples && meta.examples.length >= 10) {
      lesson.examples = meta.examples;
    }
    count++;
  });
  save('germanLessons.json', lessons);
  console.log('Enriched', count, 'B2 lessons');
}

function processGrammar() {
  const grammar = load('grammar.json');
  const b2 = grammar.B2;
  let conceptCount = 0, diffCount = 0, skillCount = 0, lessonCount = 0;
  
  b2.forEach(item => {
    const topic = item.topic;
    
    // Assign conceptId
    const conceptId = GRAMMAR_CONCEPT_MAP[topic];
    if (conceptId) {
      item.conceptId = conceptId;
      conceptCount++;
    }
    
    // Assign difficulty
    const diff = GRAMMAR_DIFFICULTY_MAP[topic];
    if (diff) {
      item.difficulty = diff;
      diffCount++;
    }
    
    // Assign skillType
    item.skillType = 'grammar';
    skillCount++;
    
    // Assign taughtInLessonId
    const lessonId = GRAMMAR_LESSON_MAP[topic];
    if (lessonId) {
      item.taughtInLessonId = lessonId;
      lessonCount++;
    }
  });
  
  save('grammar.json', grammar);
  console.log('Grammar: conceptId=' + conceptCount + ' difficulty=' + diffCount + ' skillType=' + skillCount + ' taughtInLessonId=' + lessonCount);
}

function processSkillItems(dataType, filename, map) {
  const data = load(filename);
  const items = data.B2 || [];
  let idCount = 0, lessonCount = 0, prereqCount = 0;
  
  items.forEach(item => {
    const lessonId = map[item.id];
    if (lessonId) {
      const meta = LESSON_META[lessonId];
      if (meta) {
        item.conceptId = meta.conceptId;
        item.taughtInLessonId = lessonId;
        item.requiredConcepts = meta.prerequisiteConceptIds || [];
        idCount++;
        lessonCount++;
        prereqCount++;
      }
    }
  });
  
  save(filename, data);
  console.log(dataType + ': conceptId=' + idCount + ' taughtInLessonId=' + lessonCount + ' requiredConcepts=' + prereqCount);
  return items;
}

function processWriting() {
  const items = processSkillItems('Writing', 'writing.json', WRITE_LESSON_MAP);
  const data = load('writing.json');
  const w = data.B2 || [];
  let rubricCount = 0, checklistCount = 0;
  
  w.forEach(item => {
    // Add checklists where missing
    if (!item.checklist) {
      item.checklist = [
        { item: 'Clear introduction stating the main topic' },
        { item: 'Logical paragraph structure' },
        { item: 'Use of B2-level vocabulary and grammar' },
        { item: 'Appropriate formal register' },
        { item: 'Conclusion summarizing key points' }
      ];
      checklistCount++;
    }
    // Add rubrics where missing
    if (!item.rubric) {
      item.rubric = {
        criteria: [
          { name: 'Content', maxPoints: 5, description: 'Relevance and completeness' },
          { name: 'Grammar', maxPoints: 5, description: 'Use of B2 grammar structures' },
          { name: 'Vocabulary', maxPoints: 5, description: 'Range and precision' },
          { name: 'Organization', maxPoints: 5, description: 'Structure and coherence' },
          { name: 'Style', maxPoints: 5, description: 'Register and formality' }
        ],
        totalPoints: 25
      };
      rubricCount++;
    }
  });
  
  save('writing.json', data);
  console.log('Writing: rubrics=' + rubricCount + ' checklists=' + checklistCount);
}

function processSpeaking() {
  const data = load('speaking.json');
  const s = data.B2 || [];
  let rubricCount = 0;
  
  s.forEach(item => {
    if (!item.rubric) {
      item.rubric = {
        criteria: [
          { name: 'Pronunciation', maxPoints: 5, description: 'Clarity and intonation' },
          { name: 'Fluency', maxPoints: 5, description: 'Flow and pace of speech' },
          { name: 'Grammar', maxPoints: 5, description: 'Accuracy of B2 structures' },
          { name: 'Vocabulary', maxPoints: 5, description: 'Range of B2 vocabulary' },
          { name: 'Interaction', maxPoints: 5, description: 'Response to questions' }
        ],
        totalPoints: 25
      };
      rubricCount++;
    }
  });
  
  save('speaking.json', data);
  console.log('Speaking: rubrics added=' + rubricCount);
}

function processCurriculumMap() {
  const cm = load('curriculumMap.json');
  let lessonCount = 0, conceptCount = 0, prereqCount = 0, tagCount = 0;
  
  // Process all B2 entries in curriculum map
  cm.units.forEach(unit => {
    if (unit.level !== 'B2') return;
    const lessonId = unit.id;
    
    if (unit.skill === 'lesson') {
      // Lesson entries
      const meta = LESSON_META[lessonId];
      if (meta) {
        unit.conceptId = meta.conceptId;
        unit.requiredConcepts = meta.prerequisiteConceptIds || [];
        unit.tags = meta.trackTags || [];
        conceptCount++;
        prereqCount++;
        tagCount++;
      }
    } else if (unit.skill === 'vocabulary') {
      // Vocab entries - get lesson prefix to find matching lesson
      const lesNum = lessonId.match(/\\d+/);
      if (lesNum) {
        const lid = 'B2_lesson_' + lesNum[0];
        const meta = LESSON_META[lid];
        if (meta) {
          unit.requiredConcepts = meta.prerequisiteConceptIds || [];
          prereqCount++;
        }
      }
    } else if (['reading','listening','writing','speaking'].includes(unit.skill)) {
      const mapLookup = unit.skill === 'reading' ? READ_LESSON_MAP :
                        unit.skill === 'listening' ? LISTEN_LESSON_MAP :
                        unit.skill === 'writing' ? WRITE_LESSON_MAP :
                        SPEAK_LESSON_MAP;
      const lessonId = mapLookup[unit.id];
      if (lessonId) {
        const meta = LESSON_META[lessonId];
        if (meta) {
          unit.conceptId = meta.conceptId;
          unit.requiredConcepts = meta.prerequisiteConceptIds || [];
          prereqCount++;
        }
      }
    }
    lessonCount++;
  });
  
  save('curriculumMap.json', cm);
  console.log('Curriculum map: ' + lessonCount + ' entries enriched, conceptId=' + conceptCount + ' prereqs=' + prereqCount);
}

function processVocabulary() {
  // B2 vocabulary already has lessonId assigned, just ensure plural forms
  const voc = load('germanVocabulary.json');
  const b2 = voc.B2 || [];
  let fixed = 0;
  
  b2.forEach(item => {
    // If plural is missing or empty, derive a basic one
    if (!item.plural || item.plural === '') {
      fixed++;
    }
  });
  
  console.log('Vocabulary: ' + b2.length + ' items checked, ' + fixed + ' need plural attention');
}

// ==========================================================================
// MAIN
// ==========================================================================

function main() {
  const step = typeof STEP !== 'undefined' ? STEP : 8;
  const steps = [
    { n: 1, label: 'Lessons', fn: processLessons },
    { n: 2, label: 'Grammar', fn: processGrammar },
    { n: 3, label: 'Reading', fn: () => processSkillItems('Reading', 'reading.json', READ_LESSON_MAP) },
    { n: 4, label: 'Listening', fn: () => processSkillItems('Listening', 'listening.json', LISTEN_LESSON_MAP) },
    { n: 5, label: 'Writing', fn: processWriting },
    { n: 6, label: 'Speaking', fn: processSpeaking },
    { n: 7, label: 'Curriculum', fn: processCurriculumMap },
  ];
  
  if (step === 8) {
    steps.forEach(s => { console.log('\\n=== Step ' + s.n + ': ' + s.label + ' ==='); s.fn(); });
  } else {
    const s = steps.find(s => s.n === step);
    if (s) { console.log('=== Step ' + s.n + ': ' + s.label + ' ==='); s.fn(); }
    else { console.log('Unknown step: ' + step); }
  }
  
  console.log('\\n=== B2 Enrichment Complete ===');
}

main();
`;

const merged = combined + extra;
fs.writeFileSync('scripts/b2-enrich-all-complete.cjs', merged, 'utf8');
console.log('Written complete script:', merged.length, 'bytes');
