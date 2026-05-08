// builder2.mjs - Generate remaining JSON data files for B2 enrichment
import fs from 'fs';
import path from 'path';
const __dirname = import.meta.dirname;

const FORMS_TABLES = {
  B2_lesson_1: [{
    title: "Vorgangspassiv vs Zustandspassiv",
    rows: [
      { form: "Vorgangspassiv (werden + PII)", use: "Handlung/Prozess", example: "Die Tur wird geoffnet." },
      { form: "Zustandspassiv (sein + PII)", use: "Zustand/Ergebnis", example: "Die Tur ist geoffnet." },
      { form: "Vorgang Perfekt (sein+PII+worden)", use: "Abgeschlossene Handlung", example: "Die Tur ist geoffnet worden." }
    ]
  },{
    title: "Passiv Zeitformen",
    rows: [
      { form: "Prasens: werden + PII", use: "Gegenwart", example: "Der Brief wird geschrieben." },
      { form: "Prateritum: wurde + PII", use: "Vergangenheit (schriftlich)", example: "Der Brief wurde geschrieben." },
      { form: "Perfekt: ist+PII+worden", use: "Vergangenheit (mundlich)", example: "Der Brief ist geschrieben worden." },
      { form: "Plusquamperfekt: war+PII+worden", use: "Vorvergangenheit", example: "Der Brief war geschrieben worden." },
      { form: "Futur I: wird+PII+werden", use: "Zukunft", example: "Der Brief wird geschrieben werden." }
    ]
  }],
  B2_lesson_6: [{
    title: "B2-Konnektoren",
    rows: [
      { form: "obwohl (Subjunktor)", use: "Einraumung/Gegensatz", example: "Obwohl es regnet, gehen wir spazieren." },
      { form: "trotzdem (Adverb)", use: "Gegensatz HS", example: "Es regnet. Trotzdem gehen wir." },
      { form: "sodass (Subjunktor)", use: "Konsequenz", example: "Er lernte viel, sodass er bestand." },
      { form: "indem (Subjunktor)", use: "Methode", example: "Man spart Energie, indem man isoliert." },
      { form: "je...desto/umso", use: "Proportionale Steigerung", example: "Je mehr man ubt, desto besser wird man." }
    ]
  },{
    title: "Doppelkonnektoren",
    rows: [
      { form: "nicht nur..., sondern auch...", use: "Positive Aufzahlung", example: "Nicht nur die Wirtschaft, sondern auch die Umwelt profitiert." },
      { form: "weder..., noch...", use: "Negative Aufzahlung", example: "Weder die Politik noch die Wirtschaft handelt." },
      { form: "entweder..., oder...", use: "Alternative", example: "Entweder wir handeln jetzt, oder es ist zu spat." },
      { form: "sowohl..., als auch...", use: "Parallelitat", example: "Sowohl Experten als auch Laien sind betroffen." },
      { form: "einerseits..., andererseits...", use: "Gegensatz", example: "Einerseits Vorteile, andererseits Nachteile." }
    ]
  }],
  B2_lesson_20: [{
    title: "Wechselprapositionen Wo? vs Wohin?",
    rows: [
      { form: "in + Dativ (Wo?)", use: "Position/Ort", example: "Ich bin in der Stadt." },
      { form: "in + Akkusativ (Wohin?)", use: "Richtung/Ziel", example: "Ich fahre in die Stadt." },
      { form: "an + Dativ", use: "Position an", example: "Das Hotel liegt am Meer." },
      { form: "an + Akkusativ", use: "Richtung an", example: "Wir fahren ans Meer." },
      { form: "auf + Dativ", use: "Position auf", example: "Das Gepack ist auf dem Trager." },
      { form: "auf + Akkusativ", use: "Richtung auf", example: "Ich stelle den Koffer auf den Trager." }
    ]
  }],
  B2_lesson_4: [{
    title: "Subjektive Modalverben",
    rows: [
      { form: "mussen (+ Inf.)", use: "100% logische Schlussfolgerung", example: "Er muss zu Hause sein." },
      { form: "durfte (+ Inf.)", use: "~90% Annahme", example: "Er durfte schon da sein." },
      { form: "konnen/mogen (+ Inf.)", use: "~50% Moglichkeit", example: "Er kann krank sein." },
      { form: "konnte (K.II)", use: "~30% geringe W'keit", example: "Er konnte der Tater sein." },
      { form: "sollen (+ Inf.)", use: "Zitat von Dritten", example: "Er soll in Berlin wohnen." },
      { form: "wollen (+ Inf.)", use: "Eigene Behauptung", example: "Sie will den Sieg errungen haben." }
    ]
  }],
  B2_lesson_10: [{
    title: "Stellungsfelder",
    rows: [
      { form: "Vorfeld (Position 1)", use: "Topik/Thema", example: "Gestern habe ich ein Buch gelesen." },
      { form: "Linke Klammer (Position 2)", use: "Finites Verb", example: "...habe ich ein Buch gelesen." },
      { form: "Mittelfeld", use: "Subjekt, Objekte, Adv.", example: "...ich gestern ein Buch..." },
      { form: "Rechte Klammer", use: "Infinit/PII", example: "...gelesen." },
      { form: "Nachfeld (Ausklammerung)", use: "Vergleiche/Nebensatze", example: "...als ich jung war." }
    ]
  }],
  B2_lesson_8: [{
    title: "Konjunktiv I Bildung",
    rows: [
      { form: "haben: er habe (K.I)", use: "Indirekte Rede Ggw.", example: "Er sagt, er habe keine Zeit." },
      { form: "sein: er sei (K.I)", use: "Indirekte Rede Zustand", example: "Sie sagt, er sei krank." },
      { form: "Modalv.: er konne (K.I)", use: "Indirekte Rede Modalv.", example: "Er sagt, er konne kommen." },
      { form: "K.I Perfekt: habe+PII", use: "Indirekte Rede Verg.", example: "Er sagt, er habe gearbeitet." },
      { form: "K.II Ersatzform", use: "Wenn K.I = Indikativ", example: "Sie hatten (statt haben)..." }
    ]
  }]
};

const MINI_DRILLS = {
  B2_lesson_1: [
    { q: "Aktiv: Der Mechaniker repariert das Auto. -> Passiv Prasens", a: "Das Auto wird (vom Mechaniker) repariert." },
    { q: "Aktiv: Die Firma lieferte die Ware. -> Passiv Prateritum", a: "Die Ware wurde (von der Firma) geliefert." },
    { q: "Zustandspassiv: Das Fenster ist geschlossen. Bedeutung?", a: "Das Fenster ist im Zustand geschlossen (Ergebnis)." },
    { q: "Vorgangspassiv: Die Tur wird geoffnet. Bedeutung?", a: "Jemand offnet die Tur (Prozess)." },
    { q: "Aktiv: Man hat den Vertrag unterschrieben. -> Passiv Perfekt", a: "Der Vertrag ist unterschrieben worden." },
    { q: "Passiv m. Modal: Man muss die Rechnung bezahlen.", a: "Die Rechnung muss bezahlt werden." }
  ],
  B2_lesson_2: [
    { q: "Umschreiben: Man kann das Problem losen. (sich lassen)", a: "Das Problem lasst sich losen." },
    { q: "Umschreiben: Der Antrag muss gestellt werden. (sein+zu)", a: "Der Antrag ist zu stellen." },
    { q: "The door can be opened. (sich lassen)", a: "Die Tur lasst sich offnen." },
    { q: "This document must be signed. (sein+zu)", a: "Dieses Dokument ist zu unterschreiben." },
    { q: "Ubersetzen: The problem is solvable.", a: "Das Problem ist losbar / lasst sich losen." },
    { q: "Passiversatz: Man kann das leicht erklaren. (2 Varianten)", a: "Das ist leicht zu erklaren / lasst sich leicht erklaren." }
  ],
  B2_lesson_3: [
    { q: "Ich warte ___ den Bus. (Praposition)", a: "Ich warte auf den Bus." },
    { q: "Ich denke an die Reise. -> da-Kompositum", a: "Ich denke daran." },
    { q: "Er spricht uber Politik. -> Frage mit wo-", a: "Woruber spricht er?" },
    { q: "Sie interessiert sich ___ Kunst.", a: "Sie interessiert sich fur Kunst." },
    { q: "Wir freuen uns ___ den Urlaub. (Zukunft)", a: "Wir freuen uns auf den Urlaub." },
    { q: "Er wartet auf den Zug. -> Frage", a: "Worauf wartet er?" }
  ],
  B2_lesson_4: [
    { q: "Vermutung (50%): Vielleicht ist er krank.", a: "Er kann krank sein." },
    { q: "Logik (95%): Er ist wahrscheinlich der Tater.", a: "Er muss der Tater sein." },
    { q: "Zitat: Die Nachbarn sagen, sie sei verreist.", a: "Sie soll verreist sein." },
    { q: "Behauptung: Sie sagt, sie habe den Fehler gefunden.", a: "Sie will den Fehler gefunden haben." },
    { q: "Geringe W'keit: Er kommt kaum.", a: "Er konnte kommen." },
    { q: "Zitat Verg.: Angeblich hat er das Buch gelesen.", a: "Er soll das Buch gelesen haben." }
  ],
  B2_lesson_5: [
    { q: "Nomen zu: importieren", a: "der Import / das Importieren" },
    { q: "Nomen zu: analysieren", a: "die Analyse" },
    { q: "Funktionsverb: eine Entscheidung ____", a: "eine Entscheidung treffen" },
    { q: "Funktionsverb: zur Verfugung ____", a: "zur Verfugung stellen" },
    { q: "Funktionsverb: in Kraft ____", a: "in Kraft treten" },
    { q: "Die Wirtschaft wachst -> Nominalisierung", a: "das Wirtschaftswachstum" }
  ],
  B2_lesson_6: [
    { q: "Konnektor Gegensatz: ... es regnet, gehen wir.", a: "Obwohl es regnet, gehen wir spazieren." },
    { q: "Konnektor Konsequenz: Er lernte viel, ... er bestand.", a: "...sodass er die Prufung bestand." },
    { q: "Doppelkonnektor positiv: ... Wirtschaft ... Umwelt profitiert.", a: "Nicht nur die Wirtschaft, sondern auch die Umwelt profitiert." },
    { q: "Doppelkonnektor negativ: ... Politik ... Wirtschaft handelt.", a: "Weder die Politik noch die Wirtschaft handelt." },
    { q: "Je-desto: ... mehr man ubt, ... besser wird man.", a: "Je mehr man ubt, desto besser wird man." },
    { q: "Einerseits... andererseits: ...", a: "Einerseits gibt es Vorteile, andererseits Nachteile." }
  ],
  B2_lesson_7: [
    { q: "Relativpronomen Genitiv mask: der Mann, ... Auto gestohlen", a: "...dessen Auto gestohlen wurde" },
    { q: "Relativpronomen Genitiv fem: die Frau, ... Hilfe ich brauchte", a: "...deren Hilfe ich brauchte" },
    { q: "Relativsatz mit Praposition: die Stadt, ... ich lebe", a: "die Stadt, in der ich lebe" },
    { q: "Verbposition: Das ist der Mann, der das Auto...", a: "...gestohlen hat. (Verb am Ende)" },
    { q: "wo-Kompositum formell: das Haus, ... ich wohne", a: "das Haus, in dem ich wohne" },
    { q: "Relativpronomen n.Praposition: die Leute, mit ... ich arbeite", a: "...mit denen ich arbeite" }
  ],
  B2_lesson_8: [
    { q: "Er sagt: Ich habe keine Zeit. -> Indirekte Rede", a: "Er sagt, er habe keine Zeit." },
    { q: "Sie fragt: Kommst du? -> Indirekte Frage", a: "Sie fragt, ob ich komme." },
    { q: "Er fragt: Wann fahrt der Zug? -> Indirekt", a: "Er fragt, wann der Zug fahrt." },
    { q: "Sie sagt: Ich bin krank. -> Indirekte Rede", a: "Sie sagt, sie sei krank." },
    { q: "Er sagte: Ich habe gearbeitet. -> Indirekt Verg.", a: "Er sagte, er habe gearbeitet." },
    { q: "Sie sagten: Wir haben keine Zeit. -> K.II Ersatz", a: "Sie sagten, sie hatten keine Zeit." }
  ],
  B2_lesson_9: [
    { q: "Der Student, der liest -> Partizipialattribut", a: "der lesende Student" },
    { q: "Der Artikel, der gelesen wird -> Partizipialattribut", a: "der gelesene Artikel" },
    { q: "Die Analyse, die prasentiert wird -> kurz", a: "die prasentierte Analyse" },
    { q: "Partizip I oder II?: das laufende Band", a: "Partizip I (aktiv, gleichzeitig)" },
    { q: "Partizip I oder II?: das reparierte Auto", a: "Partizip II (passiv, abgeschlossen)" },
    { q: "Der Vorschlag von der Regierung -> kurz", a: "der von der Regierung gemachte Vorschlag" }
  ],
  B2_lesson_10: [
    { q: "Ich habe gestern ein Buch ____.", a: "...gelesen. (rechte Klammer schlieSSen)" },
    { q: "Inversion: Ich habe gestern... -> Gestern...", a: "Gestern habe ich ein Buch gelesen." },
    { q: "n-Deklination: der Kollege, den ____", a: "den Kollegen" },
    { q: "Ich habe ... gelesen, das Buch. (Ausklammerung?)", a: "Nein: Ich habe das Buch gelesen." },
    { q: "Negation: Ich habe nicht das Buch gelesen vs richtig?", a: "Ich habe das Buch nicht gelesen. (Negation vor PII)" },
    { q: "Dativ: Ich helfe ____ (der Kollege)", a: "dem Kollegen (n-Deklination)" }
  ],
  B2_lesson_11: [
    { q: "3 Vorteile der Globalisierung?", a: "Freier Handel, kultureller Austausch, technologischer Fortschritt." },
    { q: "3 Nachteile der Globalisierung?", a: "Umweltverschmutzung, Ausbeutung, Verlust kultureller Identitat." },
    { q: "Was bedeutet BIP?", a: "Bruttoinlandsprodukt." },
    { q: "These zur Globalisierung formulieren", a: "Die Globalisierung fuhrt zu zunehmender wirtschaftlicher Verflechtung." },
    { q: "Konnektor: ... Globalisierung Vorteile bringt, ... Risiken", a: "Obwohl die Globalisierung Vorteile bringt, birgt sie Risiken." },
    { q: "Passiv: Man muss den Welthandel regulieren.", a: "Der Welthandel muss reguliert werden." }
  ],
  B2_lesson_12: [
    { q: "Struktur wissenschaftlicher Argumentation", a: "These - Argument - Beispiel - Schlussfolgerung" },
    { q: "Wie kennzeichnet man eigene Meinung?", a: "Meiner Ansicht nach... / Aus ethischer Sicht..." },
    { q: "Indirekte Rede: Der Forscher: Die Studie ist valide.", a: "Der Forscher behauptet, die Studie sei valide." },
    { q: "Passiv: Man uberprufte die Ergebnisse.", a: "Die Ergebnisse wurden uberpruft." },
    { q: "Folgerungskonnektor: Die Hypothese bestatigt sich nicht...", a: "...folglich muss sie revidiert werden." },
    { q: "Wissenschaftlicher Stil: man/Passiv/Aktiv?", a: "Passiv bevorzugen: Die Daten wurden analysiert." }
  ],
  B2_lesson_13: [
    { q: "Formelle Anrede in der Bewerbung", a: "Sehr geehrte Damen und Herren," },
    { q: "Hoflich fragen im Vorstellungsgesprach", a: "Durfte ich fragen, welche Aufgaben...?" },
    { q: "K.II fur Hoflichkeit: Ich ... sagen...", a: "Ich wurde sagen, dass..." },
    { q: "Zeitform fur aktuelle Position im Lebenslauf", a: "Prasens (Ich arbeite bei...)" },
    { q: "Zeitform fur fruhere Positionen", a: "Prateritum (Ich arbeitete bei...)" },
    { q: "Struktur des Anschreibens", a: "Einleitung - Motivation - Qualifikation - Schluss" }
  ],
  B2_lesson_14: [
    { q: "3 erneuerbare Energiequellen?", a: "Sonne, Wind, Wasser." },
    { q: "Warum ist Nachhaltigkeit wichtig?", a: "Um Ressourcen fur zukunftige Generationen zu erhalten." },
    { q: "Vorschlag K.II: Mehr in Erneuerbare investieren", a: "Man konnte mehr in erneuerbare Energien investieren." },
    { q: "Passiv: Die Regierung fordert Erneuerbare.", a: "Erneuerbare Energien werden gefordert." },
    { q: "sorgen fur vs sich sorgen um", a: "sorgen fur = verursachen, sich sorgen um = sich kummern" },
    { q: "Je-desto: ... mehr investieren, ... schneller Wende", a: "Je mehr wir investieren, desto schneller die Wende." }
  ],
  B2_lesson_15: [
    { q: "Was ist eine Aktie?", a: "Ein Anteil an einem Unternehmen." },
    { q: "Was ist eine Dividende?", a: "Gewinnanteil fur Aktionare." },
    { q: "Passiv: Man handelt Aktien an der Borse.", a: "Die Aktien werden an der Borse gehandelt." },
    { q: "Funktionsverb: Das Gesetz tritt in...", a: "...in Kraft." },
    { q: "Indirekte Rede: Vorstand: Der Gewinn ist gestiegen.", a: "Der Vorstand gab bekannt, der Gewinn sei gestiegen." },
    { q: "Verb-Praposition: investieren ___", a: "investieren IN + Akkusativ" }
  ],
  B2_lesson_16: [
    { q: "Integration vs Assimilation?", a: "Integration = gegenseitig, Assimilation = vollstandige Angleichung." },
    { q: "Relativsatz: die Gesellschaft, ... wir leben", a: "die Gesellschaft, in der wir leben" },
    { q: "K.I: Die Studie zeigt: Integration gelingt.", a: "Die Studie zeigt, dass Integration gelinge." },
    { q: "Obwohl-Satz zu Integration", a: "Obwohl Integration Herausforderungen birgt, bietet sie Chancen." },
    { q: "ankommen auf vs ankommen in", a: "ankommen AUF = abhangen, ankommen IN = Ort erreichen" },
    { q: "Nebensatz: ... Migration Chancen bietet, ... Herausforderungen", a: "Obwohl Migration Chancen bietet, gibt es Herausforderungen." }
  ],
  B2_lesson_17: [
    { q: "Artikel von Grundgesetz", a: "das Grundgesetz (Neutrum)" },
    { q: "Passiv: Der Bundestag verabschiedete das Gesetz.", a: "Das Gesetz wurde vom Bundestag verabschiedet." },
    { q: "Relativsatz Genitiv: die Rechte, ... Verletzung...", a: "die Rechte, deren Verletzung geklagt wird" },
    { q: "Insofern: ... die Klage begrundet ist, wird stattgegeben.", a: "Insofern die Klage begrundet ist, wird ihr stattgegeben." },
    { q: "Nominalisierung: Gesetze verabschieden", a: "die Verabschiedung von Gesetzen" },
    { q: "Funktionsverb: ein Urteil...", a: "ein Urteil fallen / sprechen" }
  ],
  B2_lesson_18: [
    { q: "K.I: Der Artikel: Die Pressefreiheit ist gefahrdet.", a: "Der Artikel behauptet, die Pressefreiheit sei gefahrdet." },
    { q: "Partizipialattribut: Die von der Regierung kritisierte...", a: "...Berichterstattung." },
    { q: "Praposition: ein Artikel ___ (Thema) vs schreiben ___ (Adressat)", a: "ein Artikel UBER/thema vs schreiben AN/Adressat" },
    { q: "K.II fur Kritik: Die Berichterstattung ist einseitig.", a: "Man konnte sie als einseitig betrachten." },
    { q: "Passiv: Die Politik beeinflusst die Medien.", a: "Die Medien werden von der Politik beeinflusst." },
    { q: "Passiversatz: Pressefreiheit kann uberwacht werden.", a: "Die Pressefreiheit lasst sich uberwachen." }
  ],
  B2_lesson_19: [
    { q: "Richtiges Reflexivverb: Ich erinnere ... an...", a: "Ich erinnere MICH an..." },
    { q: "K.II: Wenn mehr Menschen Sport ...", a: "...trieben, waren sie gesunder." },
    { q: "Feste Praposition: glauben ___", a: "glauben AN + Akkusativ" },
    { q: "Da-Komposita: Daruber hinaus, Hiervon ausgehend - Funktion?", a: "Sie strukturieren die Argumentation." },
    { q: "K.I: Die Autoren: Motivation ist entscheidend.", a: "Die Autoren argumentieren, Motivation sei entscheidend." },
    { q: "3 Faktoren fur Motivation?", a: "Autonomie, Kompetenz, soziale Zugehorigkeit." }
  ],
  B2_lesson_20: [
    { q: "reisen vs verreisen vs bereisen", a: "reisen=allg., verreisen=wegfahren, bereisen=Land" },
    { q: "Genitiv: die Kultur ___ (Italien)", a: "die Kultur Italiens" },
    { q: "Wo?: Ich bin in der Stadt. (Wo/Wohin?)", a: "Wo (in + Dativ)" },
    { q: "Wohin?: Ich fahre in die Stadt. (Wo/Wohin?)", a: "Wohin (in + Akk)" },
    { q: "Passiversatz: Der Flug kann nicht storniert werden.", a: "Der Flug lasst sich nicht stornieren." },
    { q: "Frage: ... kommt es beim Reisen an?", a: "Worauf kommt es beim Reisen an?" }
  ],
  B2_lesson_21: [
    { q: "digitalisieren (Verb) vs digital (Adj.)", a: "digitalisieren=in digitale Form, digital=elektronisch" },
    { q: "Nominalisierung: Gerate vernetzen", a: "die Vernetzung von Geraten" },
    { q: "Passiv m. Modal: Man kann KI einsetzen.", a: "KI kann in vielen Bereichen eingesetzt werden." },
    { q: "dadurch, dass: ... Prozesse automatisiert werden, steigt...", a: "Dadurch, dass Prozesse automatisiert werden, steigt die Effizienz." },
    { q: "Da-Kompositum: ... beschaftigt sich die Forschung.", a: "Hiermit beschaftigt sich die aktuelle Forschung." },
    { q: "3 Bereiche fur KI?", a: "Medizin, Verkehr, Kommunikation." }
  ],
  B2_lesson_22: [
    { q: "Tempus fur Ereignisse vs Analyse", a: "Prateritum fur Ereignisse, Prasens fur Analyse." },
    { q: "Passiv: Man errichtete die Mauer 1961.", a: "Die Mauer wurde 1961 errichtet." },
    { q: "K.I: Brandt: Der Mauerfall ist historisch.", a: "Brandt sagte, der Mauerfall sei historisch." },
    { q: "Konnektoren zeitliche Abfolge", a: "zunachst... daraufhin... schlieSSlich..." },
    { q: "Relativsatz: die Zeit, ... die Mauer stand", a: "die Zeit, in der die Mauer stand" },
    { q: "Was bedeutet Demokratie?", a: "Volksherrschaft, Grundrechte, Meinungsfreiheit." }
  ],
  B2_lesson_23: [
    { q: "Partizipialattribut: Die Urbanisierung, die steigt", a: "die steigende Urbanisierung" },
    { q: "Je-desto: ... dichter die Stadt, ... hoher die Mieten.", a: "Je dichter die Stadt, desto hoher die Mieten." },
    { q: "Nominalisierung: urbane Raume verdichten", a: "die Verdichtung urbaner Raume" },
    { q: "Futur II: Bis 2030 werden die Stadte dichter...", a: "...geworden sein." },
    { q: "K.I: Der Stadtplaner: Der Verkehr soll reduziert werden.", a: "Der Stadtplaner sagt, der Verkehr solle reduziert werden." },
    { q: "Was ist eine Smart City?", a: "Stadt, die Technologie fur Effizienz und Nachhaltigkeit nutzt." }
  ],
  B2_lesson_24: [
    { q: "Energiewende vs Klimawandel?", a: "Energiewende=politische MaSSnahme, Klimawandel=Naturphanomen." },
    { q: "Passiv: Man fordert erneuerbare Energien.", a: "Erneuerbare Energien werden gefordert." },
    { q: "Doppelkonnektor: ... Politik ... Wirtschaft gefordert.", a: "Nicht nur die Politik, sondern auch die Wirtschaft ist gefordert." },
    { q: "Nominalisierung: CO2 reduzieren", a: "die Reduzierung von CO2" },
    { q: "K.II: ... wir mehr investierten...", a: "Wenn wir mehr investierten, wurden die Emissionen sinken." },
    { q: "3 erneuerbare Energiequellen?", a: "Sonne, Wind, Wasserkraft." }
  ],
  B2_lesson_25: [
    { q: "Artikel von Kultur", a: "die Kultur (feminin)" },
    { q: "Da-Kompositum: ... versteht man kulturelle Vielfalt.", a: "Darunter versteht man kulturelle Vielfalt." },
    { q: "Relativsatz: die Kultur, ... wir leben", a: "die Kultur, in der wir leben" },
    { q: "Passiv: Kulturelle Einflusse pragen Mode.", a: "Mode wird von kulturellen Einflussen gepragt." },
    { q: "K.I: Der Autor: Mode ist Ausdruck von Identitat.", a: "Der Autor schreibt, Mode sei Ausdruck von Identitat." },
    { q: "Ist Mode Ausdruck von Kultur? (Ihre Meinung)", a: "(Freie Antwort: Mode spiegelt gesellschaftliche Werte wider.)" }
  ]
};

// Write files
const tablesPath = path.join(__dirname, 'b2-forms-tables.json');
fs.writeFileSync(tablesPath, JSON.stringify(FORMS_TABLES, null, 2));
console.log("Written", tablesPath);

const drillsPath = path.join(__dirname, 'b2-mini-drills.json');
fs.writeFileSync(drillsPath, JSON.stringify(MINI_DRILLS, null, 2));
console.log("Written", drillsPath);

// Also write the common mistakes (already in builder, but let's ensure it)
const COMMON_MISTAKES = JSON.parse(fs.readFileSync(path.join(__dirname, 'b2-common-mistakes.json'), 'utf8'));
// Fix: convert to string format matching B1 pattern
const MISTAKES_STRINGS = {};
for (const [lesson, arr] of Object.entries(COMMON_MISTAKES)) {
  MISTAKES_STRINGS[lesson] = arr.map(m => m.mistake + " - " + m.correction + ". " + m.explanation);
}
const mistakesStrPath = path.join(__dirname, 'b2-common-mistakes-strings.json');
fs.writeFileSync(mistakesStrPath, JSON.stringify(MISTAKES_STRINGS, null, 2));
console.log("Written", mistakesStrPath);
