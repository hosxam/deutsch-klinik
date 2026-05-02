import fs from 'fs';

const data = JSON.parse(fs.readFileSync('reading.json', 'utf8'));
const c1 = data.C1 || [];

// Track max IDs
const maxId = c1.reduce((max, v) => {
  const qids = v.questions.map(q => parseInt(q.id.replace(/[^\d]/g,''), 10));
  return Math.max(max, ...qids);
}, 0);
let idCounter = maxId;

function nextQid() {
  idCounter++;
  return 'qr' + idCounter;
}

const newPassages = [
  // 1. Academic medical discourse - C1_lesson_1
  {
    "id": "C1_read_4",
    "title": "Wissenschaftliches Publizieren in der Medizin",
    "text": "Die Veröffentlichung von Forschungsergebnissen in medizinischen Fachzeitschriften unterliegt strengen Qualitätskriterien. Der Peer-Review-Prozess gilt als Goldstandard, um die Validität wissenschaftlicher Arbeiten zu sichern. Dennoch steht dieses System zunehmend in der Kritik: Publikationsbias, methodische Mängel in Studien und der Druck, in hochrangigen Journalen zu publizieren, gefährden die wissenschaftliche Integrität. Die medizinische Fakultät muss angehende Ärzte nicht nur in klinischen Fertigkeiten, sondern auch in der kritischen Bewertung wissenschaftlicher Literatur schulen, damit sie evidenzbasierte Entscheidungen treffen können.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Funktion hat der Peer-Review-Prozess in der medizinischen Forschung?",
        "options": [
          "Er beschleunigt die Veröffentlichung von Studien",
          "Er sichert die Qualität und Validität wissenschaftlicher Arbeiten",
          "Er finanziert Forschungsprojekte",
          "Er ersetzt die statistische Analyse"
        ],
        "answer": "Er sichert die Qualität und Validität wissenschaftlicher Arbeiten"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Der Publikationsdruck in der Wissenschaft wird als unproblematisch angesehen.",
        "answer": "false",
        "explanation": "Der Text sagt, der Publikationsdruck gefährde die wissenschaftliche Integrität."
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Fähigkeit sollten Medizinstudierende laut dem Text entwickeln?",
        "options": [
          "Ausschließlich klinische Fertigkeiten",
          "Die Fähigkeit, Forschungsergebnisse kritisch zu bewerten",
          "Die Beherrschung aller OP-Techniken",
          "Die Verwaltung von Krankenhausbudgets"
        ],
        "answer": "Die Fähigkeit, Forschungsergebnisse kritisch zu bewerten"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Der ____-Prozess gilt als Goldstandard für die Qualitätssicherung.",
        "options": [
          "Peer-Review",
          "Review-Peer",
          "Publication-Review",
          "Research-Check"
        ],
        "answer": "Peer-Review"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_1"
  },

  // 2. Healthcare system reform - C1_lesson_2
  {
    "id": "C1_read_5",
    "title": "Reformbedarf im Krankenhaussektor",
    "text": "Die deutsche Krankenhauslandschaft befindet sich in einem tiefgreifenden Umbruch. Die Einführung eines gestaffelten Vergütungssystems, das die reine Fallpauschale ablösen soll, steht im Zentrum der aktuellen Reformbemühungen. Kritiker bemängeln, dass das derzeitige System Fehlanreize setze: Kliniken würden wirtschaftlich rentable Eingriffe bevorzugen, während die Versorgung komplexer, multimorbider Patienten finanziell unattraktiv bleibe. Hinzu kommt der Fachkräftemangel, der die Arbeitsbedingungen des Pflegepersonals weiter verschärft. Eine nachhaltige Krankenhausreform muss daher nicht nur die Finanzierungsstruktur, sondern auch die Personalausstattung und die sektorenübergreifende Versorgung berücksichtigen.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Was soll das neue Vergütungssystem im Krankenhaussektor ersetzen?",
        "options": [
          "Die ambulante Versorgung",
          "Die reine Fallpauschale",
          "Die Privatversicherung",
          "Die Pflegepersonalregelung"
        ],
        "answer": "Die reine Fallpauschale"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Das derzeitige Vergütungssystem setzt laut Kritikern Fehlanreize.",
        "answer": "true"
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Patientengruppe bleibt im aktuellen System finanziell unattraktiv?",
        "options": [
          "Privatversicherte Patienten",
          "Multimorbide Patienten",
          "Akutpatienten",
          "Notfallpatienten"
        ],
        "answer": "Multimorbide Patienten"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Eine nachhaltige Reform muss auch die ____-Versorgung berücksichtigen.",
        "options": [
          "sektorenübergreifende",
          "sektorenspezifische",
          "intramurale",
          "präventive"
        ],
        "answer": "sektorenübergreifende"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_2"
  },

  // 3. Physician shortage and workforce planning - C1_lesson_4
  {
    "id": "C1_read_6",
    "title": "Ärztemangel und strategische Personalplanung",
    "text": "Der vielbeschworene Ärztemangel in Deutschland ist weniger ein absoluter Mangel an Medizinern als vielmehr ein Verteilungsproblem. Während Ballungszentren eine nahezu flächendeckende Versorgung aufweisen, klaffen auf dem Land erhebliche Lücken. Die Alterung der Ärzteschaft verschärft diese Problematik: Über ein Drittel der niedergelassenen Ärzte ist älter als 60 Jahre und wird in den nächsten Jahren in den Ruhestand treten. Strukturelle Maßnahmen wie die Förderung von Landarztpraxen, telemedizinische Angebote und eine Reform der Weiterbildungsordnung sollen dem entgegenwirken. Zudem gewinnt die arbeitszeitgerechte Beschäftigung junger Ärztinnen und Ärzte an Bedeutung, da die neue Generation von Medizinern Wert auf eine ausgewogene Work-Life-Balance legt.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Worin liegt laut dem Text die Hauptursache des Ärztemangels?",
        "options": [
          "Einem absoluten Mangel an Ärzten in Deutschland",
          "Einem Verteilungsproblem zwischen Stadt und Land",
          "Zu wenigen Medizinstudienplätzen",
          "Einer zu langen Weiterbildungszeit"
        ],
        "answer": "Einem Verteilungsproblem zwischen Stadt und Land"
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welcher Anteil der niedergelassenen Ärzte steht kurz vor dem Ruhestand?",
        "options": [
          "Etwa ein Viertel",
          "Über ein Drittel",
          "Knapp die Hälfte",
          "Mehr als zwei Drittel"
        ],
        "answer": "Über ein Drittel"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Junge Ärzte legen laut dem Text weniger Wert auf Work-Life-Balance als frühere Generationen.",
        "answer": "false",
        "explanation": "Der Text betont, dass die neue Generation Wert auf eine ausgewogene Work-Life-Balance legt."
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "____ Angebote sollen die Versorgung in ländlichen Regionen verbessern.",
        "options": [
          "Telemedizinische",
          "Stationäre",
          "Ambulante",
          "Präventive"
        ],
        "answer": "Telemedizinische"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_4"
  },

  // 4. Medical ethics and autonomy - C1_lesson_11 (already has one, add to it)
  {
    "id": "C1_read_7",
    "title": "Patientenautonomie in der modernen Medizin",
    "text": "Das Prinzip der Patientenautonomie hat in den letzten Jahrzehnten einen grundlegenden Wandel im Arzt-Patienten-Verhältnis bewirkt. War früher ein paternalistischer Ansatz vorherrschend, bei dem der Arzt die Behandlungsentscheidungen weitgehend allein traf, steht heute die informierte Einwilligung des Patienten im Mittelpunkt. Dies setzt voraus, dass der Patient umfassend über Diagnose, Therapieoptionen, Risiken und Alternativen aufgeklärt wird. In der Praxis stößt dieses Ideal jedoch an Grenzen: Nicht jeder Patient wünscht sich eine vollständige Entscheidungsautonomie, insbesondere bei schweren Erkrankungen. Die ethische Herausforderung besteht darin, die individuelle Selbstbestimmung zu respektieren, ohne den Patienten mit Entscheidungen zu überfordern, die er nicht treffen möchte.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welches Prinzip steht heute im Mittelpunkt des Arzt-Patienten-Verhältnisses?",
        "options": [
          "Der paternalistische Ansatz",
          "Die informierte Einwilligung des Patienten",
          "Die Kosten-Nutzen-Abwägung",
          "Die ärztliche Fürsorgepflicht"
        ],
        "answer": "Die informierte Einwilligung des Patienten"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Alle Patienten wünschen sich eine vollständige Entscheidungsautonomie bei schweren Erkrankungen.",
        "answer": "false",
        "explanation": "Der Text stellt klar, dass nicht jeder Patient dies wünscht."
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Was ist die ethische Herausforderung im Umgang mit Patientenautonomie?",
        "options": [
          "Patienten zu allen Entscheidungen zu zwingen",
          "Selbstbestimmung zu respektieren ohne zu überfordern",
          "Die Kosten für Behandlungen zu senken",
          "Die Arzt-Patienten-Kommunikation zu vermeiden"
        ],
        "answer": "Selbstbestimmung zu respektieren ohne zu überfordern"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Der Arzt muss den Patienten über ____, Risiken und Alternativen aufklären.",
        "options": [
          "Diagnose und Therapieoptionen",
          "Die Kosten der Behandlung",
          "Die Wartezeiten",
          "Die Personalausstattung"
        ],
        "answer": "Diagnose und Therapieoptionen"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_11"
  },

  // 5. Evidence-based medicine - C1_lesson_6
  {
    "id": "C1_read_8",
    "title": "Evidenzbasierte Medizin zwischen Anspruch und Wirklichkeit",
    "text": "Die evidenzbasierte Medizin hat sich als Leitparadigma der klinischen Praxis etabliert. Ihr Kern besteht darin, individuelle klinische Erfahrung mit der besten verfügbaren externen Evidenz aus systematischer Forschung zu verbinden. Randomisierte kontrollierte Studien gelten dabei als Goldstandard, doch ihre Übertragbarkeit auf den Einzelfall ist oft begrenzt. Ausschlusskriterien in Studien führen dazu, dass multimorbide oder ältere Patienten häufig unterrepräsentiert sind. Zudem besteht die Gefahr, dass Leitlinien als starre Vorschriften missverstanden werden, anstatt als Entscheidungshilfen zu dienen. Eine kritische Reflexion der Evidenz und ihre Anpassung an die individuelle Patientensituation bleiben daher unverzichtbare ärztliche Kompetenzen.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Was ist der Kern der evidenzbasierten Medizin?",
        "options": [
          "Ausschließliche Anwendung von Leitlinien",
          "Verbindung klinischer Erfahrung mit externer Evidenz",
          "Bevorzugung randomisierter Studien ohne Ausnahme",
          "Vollständige Digitalisierung der Patientenversorgung"
        ],
        "answer": "Verbindung klinischer Erfahrung mit externer Evidenz"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Multimorbide Patienten sind in randomisierten Studien oft überrepräsentiert.",
        "answer": "false",
        "explanation": "Der Text sagt, multimorbide Patienten seien häufig unterrepräsentiert."
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Gefahr sehen Fachleute im Umgang mit Leitlinien?",
        "options": [
          "Sie werden zu selten angewendet",
          "Sie werden als starre Vorschriften missverstanden",
          "Sie sind zu umfangreich",
          "Sie werden nicht aktualisiert"
        ],
        "answer": "Sie werden als starre Vorschriften missverstanden"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Randomisierte kontrollierte Studien gelten als ____ der klinischen Forschung.",
        "options": [
          "Goldstandard",
          "Silberstandard",
          "Basisniveau",
          "Mindestanforderung"
        ],
        "answer": "Goldstandard"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_6"
  },

  // 6. Digital patient records and data protection - C1_lesson_7
  {
    "id": "C1_read_9",
    "title": "Digitale Patientenakte und Datenschutz im Gesundheitswesen",
    "text": "Die Einführung der elektronischen Patientenakte in Deutschland hat eine kontroverse Debatte über Nutzen und Risiken der Digitalisierung im Gesundheitswesen ausgelöst. Befürworter heben hervor, dass die Verfügbarkeit von Behandlungsdaten über verschiedene Versorgungseinrichtungen hinweg die Behandlungsqualität verbessern und Doppeluntersuchungen vermeiden kann. Kritiker verweisen auf Datenschutzbedenken und die Gefahr des Missbrauchs sensibler Gesundheitsdaten. Besonders umstritten ist die Frage der Opt-out-Regelung: Sollten alle Versicherten automatisch eine elektronische Patientenakte erhalten, oder ist eine explizite Einwilligung erforderlich? Die Erfahrungen aus anderen europäischen Ländern zeigen, dass der Erfolg solcher Systeme maßgeblich von der Akzeptanz der Nutzer und der Benutzerfreundlichkeit abhängt.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welchen Vorteil nennen Befürworter der elektronischen Patientenakte?",
        "options": [
          "Reduzierung der Arzttermine",
          "Vermeidung von Doppeluntersuchungen",
          "Abschaffung der Papierakte",
          "Senkung der Medikamentenkosten"
        ],
        "answer": "Vermeidung von Doppeluntersuchungen"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Die Frage der Opt-out-Regelung ist in der Debatte unumstritten.",
        "answer": "false",
        "explanation": "Der Text bezeichnet die Opt-out-Regelung als besonders umstritten."
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Wovon hängt der Erfolg digitaler Patientenakten laut dem Text maßgeblich ab?",
        "options": [
          "Von der gesetzlichen Verpflichtung",
          "Von der Akzeptanz der Nutzer und Benutzerfreundlichkeit",
          "Von der Anzahl der Krankenhäuser",
          "Von der Finanzierung durch die Krankenkassen"
        ],
        "answer": "Von der Akzeptanz der Nutzer und Benutzerfreundlichkeit"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Kritiker der elektronischen Patientenakte verweisen auf ____-Bedenken.",
        "options": [
          "Datenschutz",
          "Kosten",
          "Zeitaufwand",
          "Kompatibilitäts"
        ],
        "answer": "Datenschutz"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_7"
  },

  // 7. Interdisciplinary teamwork - C1_lesson_8
  {
    "id": "C1_read_10",
    "title": "Interdisziplinäre Zusammenarbeit in der Patientenversorgung",
    "text": "Die zunehmende Spezialisierung in der Medizin erfordert eine enge interdisziplinäre Zusammenarbeit. Insbesondere bei der Behandlung von Krebspatienten, Schlaganfallpatienten und polytraumatisierten Notfallpatienten ist das Zusammenspiel verschiedener Fachdisziplinen entscheidend für den Behandlungserfolg. Tumorboards, in denen Chirurgen, Radiologen, Pathologen und Onkologen gemeinsam Therapieentscheidungen treffen, sind ein etabliertes Modell dieser Kooperation. Studien belegen, dass interdisziplinäre Teams bessere Behandlungsergebnisse erzielen als Einzelentscheidungen. Allerdings birgt die Zusammenarbeit auch Herausforderungen: Unterschiedliche Fachsprachen, Hierarchiedenken und Kommunikationsbarrieren können die Effektivität beeinträchtigen. Eine offene Feedbackkultur und regelmäßige Teambesprechungen sind daher essenziell für eine gelingende Zusammenarbeit.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Einrichtung wird als Beispiel für interdisziplinäre Zusammenarbeit genannt?",
        "options": [
          "Die Hausarztpraxis",
          "Das Tumorboard",
          "Die Notaufnahme",
          "Das Gesundheitsamt"
        ],
        "answer": "Das Tumorboard"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Interdisziplinäre Teams erzielen laut Studien schlechtere Behandlungsergebnisse.",
        "answer": "false",
        "explanation": "Der Text sagt, interdisziplinäre Teams erzielen bessere Ergebnisse."
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Herausforderung der interdisziplinären Zusammenarbeit wird genannt?",
        "options": [
          "Zu viele Teambesprechungen",
          "Unterschiedliche Fachsprachen und Hierarchiedenken",
          "Mangel an Spezialisten",
          "Zu hohe Kosten"
        ],
        "answer": "Unterschiedliche Fachsprachen und Hierarchiedenken"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Eine offene ____-Kultur ist essenziell für die Zusammenarbeit.",
        "options": [
          "Feedback",
          "Fehler",
          "Gesprächs",
          "Diskussions"
        ],
        "answer": "Feedback"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_8"
  },

  // 8. Error culture and patient safety - C1_lesson_5
  {
    "id": "C1_read_11",
    "title": "Fehlerkultur und Patientensicherheit im Krankenhaus",
    "text": "Jährlich ereignen sich in deutschen Krankenhäusern tausende unerwünschte Ereignisse, von denen ein erheblicher Teil vermeidbar wäre. Lange Zeit herrschte eine Schuldzuweisungskultur vor, die das Eingestehen von Fehlern erschwerte und damit aus Fehlern zu lernen behinderte. In den letzten Jahren hat ein Umdenken eingesetzt: Immer mehr Kliniken etablieren ein Fehlermeldesystem, das eine anonyme oder vertrauliche Berichterstattung ermöglicht. Ziel ist es, kritische Vorfälle systematisch zu analysieren und präventive Maßnahmen abzuleiten. Die Einführung von OP-Checklisten, standardisierten Übergabeprotokollen und Simulationstrainings hat nachweislich zur Verbesserung der Patientensicherheit beigetragen. Dennoch bleibt die Etablierung einer offenen Fehlerkultur eine anhaltende Herausforderung.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Kultur herrschte in Krankenhäusern lange Zeit vor?",
        "options": [
          "Eine offene Fehlerkultur",
          "Eine Schuldzuweisungskultur",
          "Eine präventive Kultur",
          "Eine Lernkultur"
        ],
        "answer": "Eine Schuldzuweisungskultur"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Fehlermeldesysteme ermöglichen eine anonyme Berichterstattung.",
        "answer": "true"
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Maßnahme hat zur Verbesserung der Patientensicherheit beigetragen?",
        "options": [
          "Längere Arbeitszeiten für Ärzte",
          "OP-Checklisten und Simulationstrainings",
          "Mehr Betten pro Station",
          "Höhere Fallpauschalen"
        ],
        "answer": "OP-Checklisten und Simulationstrainings"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Kritische Vorfälle sollen systematisch analysiert und ____ Maßnahmen abgeleitet werden.",
        "options": [
          "präventive",
          "reaktive",
          "disziplinarische",
          "finanzielle"
        ],
        "answer": "präventive"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_5"
  },

  // 9. Migration of physicians and integration - C1_lesson_9
  {
    "id": "C1_read_12",
    "title": "Migration von Ärzten und berufliche Integration",
    "text": "Deutschland ist auf die Zuwanderung ausländischer Ärztinnen und Ärzte angewiesen, um den steigenden Bedarf in der medizinischen Versorgung zu decken. Rund zwölf Prozent der Krankenhausärzte besitzen eine ausländische Staatsangehörigkeit, Tendenz steigend. Die berufliche Integration dieser Mediziner stellt jedoch sowohl die Zugewanderten als auch die aufnehmenden Einrichtungen vor erhebliche Herausforderungen. Sprachliche Hürden, kulturelle Unterschiede im Arzt-Patienten-Verhältnis und bürokratische Anerkennungsverfahren sind häufige Hindernisse. Viele Kliniken haben daher spezielle Integrationsprogramme entwickelt, die Sprachkurse, interkulturelle Trainings und Mentoring-Programme umfassen. Eine gelungene Integration kommt nicht nur den betroffenen Ärzten zugute, sondern verbessert nachweislich die Versorgungsqualität in multikulturellen Teams.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Wie hoch ist der Anteil der Ärzte mit ausländischer Staatsangehörigkeit in deutschen Krankenhäusern?",
        "options": [
          "Etwa fünf Prozent",
          "Rund zwölf Prozent",
          "Über zwanzig Prozent",
          "Etwa dreißig Prozent"
        ],
        "answer": "Rund zwölf Prozent"
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Herausforderung wird bei der Integration ausländischer Ärzte genannt?",
        "options": [
          "Zu niedrige Gehälter",
          "Sprachliche Hürden und bürokratische Anerkennungsverfahren",
          "Mangel an Wohnraum",
          "Fehlende Operationsmöglichkeiten"
        ],
        "answer": "Sprachliche Hürden und bürokratische Anerkennungsverfahren"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Eine gelungene Integration verbessert die Versorgungsqualität in multikulturellen Teams.",
        "answer": "true"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Kliniken entwickeln spezielle ____-Programme zur Unterstützung zugewanderter Ärzte.",
        "options": [
          "Integrations",
          "Rotations",
          "Forschungs",
          "Management"
        ],
        "answer": "Integrations"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_9"
  },

  // 10. Palliative care decision-making - C1_lesson_10
  {
    "id": "C1_read_13",
    "title": "Entscheidungsfindung in der Palliativmedizin",
    "text": "Die Palliativmedizin stellt Ärzte vor besondere ethische und kommunikative Herausforderungen. Wenn kurative Behandlungsmöglichkeiten ausgeschöpft sind, verschiebt sich der Fokus von der Lebensverlängerung zur Verbesserung der Lebensqualität. Die Erstellung eines individuellen Behandlungsplans erfordert eine sorgfältige Abwägung zwischen Symptomkontrolle, psychosozialer Unterstützung und der Respektierung des Patientenwillens. Advance Care Planning, also die vorausschauende Behandlungsplanung, gewinnt dabei zunehmend an Bedeutung. Patientenverfügungen und Vorsorgevollmachten sollen sicherstellen, dass der Patientenwille auch dann berücksichtigt wird, wenn der Patient selbst nicht mehr entscheidungsfähig ist. Die größte Herausforderung bleibt die rechtzeitige und einfühlsame Kommunikation mit Patienten und Angehörigen über das Lebensende.",
    "questions": [
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Worauf verschiebt sich der Fokus in der Palliativmedizin?",
        "options": [
          "Auf die vollständige Heilung",
          "Auf die Verbesserung der Lebensqualität",
          "Auf die Reduzierung der Behandlungskosten",
          "Auf die Verlängerung der Krankenhausaufenthalte"
        ],
        "answer": "Auf die Verbesserung der Lebensqualität"
      },
      {
        "id": nextQid(),
        "type": "true-false",
        "question": "Advance Care Planning bezeichnet die vorausschauende Behandlungsplanung.",
        "answer": "true"
      },
      {
        "id": nextQid(),
        "type": "mcq",
        "question": "Welche Dokumente sollen den Patientenwillen sichern?",
        "options": [
          "Krankenhausaufnahmeverträge",
          "Patientenverfügungen und Vorsorgevollmachten",
          "Krankschreibungen and Rezepte",
          "Überweisungsscheine"
        ],
        "answer": "Patientenverfügungen und Vorsorgevollmachten"
      },
      {
        "id": nextQid(),
        "type": "gap-fill",
        "question": "Die größte Herausforderung in der Palliativmedizin ist eine ____ Kommunikation mit Patienten und Angehörigen.",
        "options": [
          "rechtzeitige und einfühlsame",
          "schnelle und knappe",
          "standardisierte",
          "juristisch präzise"
        ],
        "answer": "rechtzeitige und einfühlsame"
      }
    ],
    "level": "C1",
    "lessonId": "C1_lesson_10"
  }
];

// Append to C1 array
c1.push(...newPassages);
data.C1 = c1;

fs.writeFileSync('reading.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Added', newPassages.length, 'new C1 reading passages');
console.log('C1 count:', data.C1.length);
console.log('New IDs:', newPassages.map(p => p.id + ' -> ' + p.lessonId).join(', '));
