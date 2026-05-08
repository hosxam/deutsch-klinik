// builder.mjs - Generates the complete b2-enrich-all.cjs
// Run: node builder.mjs
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
const outPath = path.join(__dirname, 'b2-enrich-all-new.cjs');
const DATA = path.join(__dirname, '..', 'src', 'data');

// Helper: format JS array as source code
function dump(obj) {
  return JSON.stringify(obj).replace(/"/g, function(m, i, s) {
    // Keep property names unquoted where possible
    return '\"';
  });
}

// Read lesson metadata
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'b2-lesson-metadata.json'), 'utf8'));

const COMMON_MISTAKES = {
  B2_lesson_1: [
    {mistake: "Agens falsch positioniert: Der Brief wird geschrieben von mir.", correction: "Der Brief wird von mir geschrieben.", explanation: "Agens nach 'von' direkt vor Partizip II"},
    {mistake: "Zustandspassiv vs Vorgangspassiv verwechselt", correction: "Das Fenster ist geoffnet (Zustand) vs wird geoffnet (Vorgang)", explanation: "Zustand = sein + Partizip II, Vorgang = werden + Partizip II"},
    {mistake: "worden im Zustandspassiv falsch verwendet", correction: "Das Auto ist gewaschen. (statt: ist gewaschen worden)", explanation: "Zustandspassiv = sein + Partizip II OHNE worden"},
    {mistake: "worden im Perfekt Vorgangspassiv vergessen", correction: "Der Brief ist gestern geschrieben worden.", explanation: "Im Perfekt Vorgangspassiv MUSS worden stehen"},
    {mistake: "Aktiv/Passiv verwechselt", correction: "Aktiv: Subjekt handelt. Passiv: Subjekt erleidet.", explanation: "Im Passiv wird Objekt der Handlung zum Subjekt"}
  ],
  B2_lesson_2: [
    {mistake: "sein+zu mehrdeutig verwendet", correction: "Durch Modalverb ersetzen: kann/muss gelesen werden", explanation: "sein+zu = mehrdeutig (Moglichkeit/Notwendigkeit)"},
    {mistake: "sich lassen mit Partizip II statt Infinitiv", correction: "Das Fenster lasst sich offnen. (Infinitiv)", explanation: "Nach sich lassen kommt Infinitiv, nicht Partizip II"},
    {mistake: "Passiversatz mit Passiv vermischt", correction: "Die Tur lasst sich offnen.", explanation: "sich lassen ersetzt konnen + Passiv"},
    {mistake: "sein+zu mit falschem Subjekt", correction: "Der Antrag ist zu stellen = Der Antrag muss gestellt werden", explanation: "Subjekt muss Objekt der Handlung sein"},
    {mistake: "Es lasst sich machen. falscher Kontext", correction: "Korrekt fur: Es ist moglich.", explanation: "Fester Ausdruck"}
  ],
  B2_lesson_3: [
    {mistake: "Ich warte fur den Bus. (falsche Praposition)", correction: "Ich warte auf den Bus.", explanation: "warten auf = feste Verbindung mit Akkusativ"},
    {mistake: "sich freuen auf vs uber verwechselt", correction: "auf + Akk (Zukunft), uber + Akk (Vergangenheit)", explanation: "Praposition andert zeitliche Bedeutung"},
    {mistake: "Da habe ich nicht von gedacht. statt daran", correction: "Daran habe ich nicht gedacht.", explanation: "denken an -> daran (da-Kompositum)"},
    {mistake: "Womit? statt Woruber? (falsches Frage-wo)", correction: "Woruber hast du gesprochen? (sprechen uber)", explanation: "Frage-wo richtet sich nach Verb-Praposition"},
    {mistake: "Kasus nach fester Praposition falsch", correction: "sich interessieren FUR + AKKUSATIV", explanation: "Feste Prapositionen haben feste Kasus"}
  ],
  B2_lesson_4: [
    {mistake: "Er kann krank sein. - objektiv/subjektiv verwechselt", correction: "Kontext: Fahigkeit vs. Vermutung (ca. 50%)", explanation: "Subjektives konnen = Vermutung"},
    {mistake: "Er muss 20 Jahre alt sein. = 100%?", correction: "Logische Schlussfolgerung, ca. 95%", explanation: "Subjektives mussen = hochste Wahrscheinlichkeit"},
    {mistake: "Er soll krank sein. = eigene Meinung?", correction: "Nein, Zitat von anderen Personen", explanation: "sollen = Behauptung von Dritten"},
    {mistake: "Sie will den Schlussel gefunden haben. = wahr?", correction: "Ihre Behauptung, muss nicht wahr sein", explanation: "wollen = Behauptung der Person selbst"},
    {mistake: "Er konnte der Tater sein. vs kann", correction: "konnte = geringere W'keit als kann", explanation: "Konjunktiv II reduziert Wahrscheinlichkeit"}
  ],
  B2_lesson_5: [
    {mistake: "Das Analysieren der Daten... statt Die Analyse", correction: "Die Analyse der Daten...", explanation: "Nicht jeder Infinitiv wird nominalisiert"},
    {mistake: "Die Forschung der Medikamente (falscher Genitiv)", correction: "Die Forschung an Medikamenten", explanation: "Forschen AN -> Forschung AN (Praposition bleibt)"},
    {mistake: "Eine Entscheidung machen statt treffen", correction: "Eine Entscheidung treffen", explanation: "Funktionsverbgefuge haben feste Verben"},
    {mistake: "Zu viel Nominalstil", correction: "Verben und Nominalisierungen abwechseln", explanation: "Nominalstil wirkt schwerfallig"},
    {mistake: "Der Import als Verb statt Nomen", correction: "importieren (Verb) vs der Import (Nomen)", explanation: "Nominalisierung andert Wortart"}
  ],
  B2_lesson_6: [
    {mistake: "Trotzdem die Globalisierung Vorteile hat...", correction: "Obwohl die Globalisierung Vorteile hat...", explanation: "trotzdem = Adverb, obwohl = Subjunktor"},
    {mistake: "Je mehr Export, desto besser. (unvollstandig)", correction: "Je mehr ein Land exportiert, desto besser...", explanation: "Je-desto braucht vollstandige Satze"},
    {mistake: "Entweder... oder falsche Satzstellung", correction: "Entweder fahren wir, oder wir bleiben.", explanation: "Nach entweder Verbposition 1"},
    {mistake: "Nicht nur... sondern auch vs weder... noch", correction: "Nicht nur... = Aufzahlung, weder... noch = Negation", explanation: "Positiv vs negativ"},
    {mistake: "Sowohl... als auch mit Singular-Verb", correction: "Sowohl X als auch Y sind... (Plural)", explanation: "Bei zwei Subjekten Verb im Plural"}
  ],
  B2_lesson_7: [
    {mistake: "Genitiv-Relativpronomen verwechselt", correction: "dessen (mask./neutr.), deren (fem./Plural)", explanation: "Besitzanzeige im Relativsatz"},
    {mistake: "Kasus nach Praposition im Relativsatz falsch", correction: "Praposition bestimmt Kasus", explanation: "mit deren Hilfe (Dativ)"},
    {mistake: "Umgangssprachliches wo in formellen Texten", correction: "Praposition + Relativpronomen bevorzugen", explanation: "die Stadt, in der... statt die Stadt, wo..."},
    {mistake: "Verbposition im Relativsatz falsch", correction: "Verb am Ende (Nebensatz)", explanation: "Relativsatz ist eingeleiteter Nebensatz"},
    {mistake: "Falscher Genus des Relativpronomens", correction: "Nach Genus des Bezugsworts", explanation: "der (mask), die (fem), das (neut)"}
  ],
  B2_lesson_8: [
    {mistake: "Indikativ statt K.I in indirekter Rede", correction: "Er sagt, er habe keine Zeit.", explanation: "K.I fur indirekte Rede"},
    {mistake: "K.I = Indikativ, kein K.II als Ersatz", correction: "Sie sagten, sie hatten... statt haben", explanation: "Wenn K.I = Indikativ, K.II als Ersatzform"},
    {mistake: "Indirekte Frage: Er fragt, kann er kommen?", correction: "Er fragt, ob er kommen kann.", explanation: "Verb am Ende in indirekten Fragen"},
    {mistake: "ob-Satz und w-Frage verwechselt", correction: "ob fur Ja/Nein, w-Wort fur W-Fragen", explanation: "Er fragt, ob... / warum... / wann..."},
    {mistake: "Kein K.I in Vergangenheit", correction: "Er sagte, er habe gearbeitet (K.I Perfekt)", explanation: "Auch Vergangenheit mit K.I"}
  ],
  B2_lesson_9: [
    {mistake: "Partizip I und II verwechselt", correction: "PI = aktiv (der lesende), PII = passiv (der gelesene)", explanation: "PI = gleichzeitig aktiv, PII = passiv/abgeschlossen"},
    {mistake: "Falsche Endung bei Partizipialattributen", correction: "Adjektivendungen nach Artikelwort", explanation: "der gelesene Artikel, ein gelesener Artikel"},
    {mistake: "Partizipialattribut zu lang (Schachtelsatz)", correction: "Durch Relativsatz ersetzen", explanation: "Lange Partizipialattribute schwer verstandlich"},
    {mistake: "Der gewonnen werdene Preis (zu wortlich)", correction: "Der gewonnene Preis", explanation: "Partizip II direkt als Attribut"},
    {mistake: "Nur Nominalstil (keine Verben)", correction: "Nominalisierungen und Verben abwechseln", explanation: "Guter Stil variiert"}
  ],
  B2_lesson_10: [
    {mistake: "Verbklammer nicht geschlossen", correction: "Ich habe gestern ein Buch gelesen.", explanation: "Finites Verb = 1. Teil, infinit = Ende"},
    {mistake: "Ausklammerung: Ich habe gelesen ein Buch.", correction: "Ich habe ein Buch gelesen.", explanation: "Mittelfeld bleibt in Klammer"},
    {mistake: "Falsche Stellung nach Adverb am Satzanfang", correction: "Gestern habe ich...", explanation: "Inversion nach Adverb am Satzanfang"},
    {mistake: "n-Deklination: den Kollege statt den Kollegen", correction: "den Kollegen", explanation: "Mask. Nomen auf -e: der Kollege, den Kollegen"},
    {mistake: "Doppelte Negation: kein Geld nicht", correction: "Ich habe kein Geld. (einfache Negation)", explanation: "Im Deutschen nur eine Negation"}
  ],
  B2_lesson_11: [
    {mistake: "Die Globalisierung hat Vorteile... (zu einfach)", correction: "Komplexe Satze mit Konnektoren", explanation: "B2 erwartet differenzierte Argumentation"},
    {mistake: "Keine Prapositionaladverbien (davon, darauf...)", correction: "Davon profitieren Industrienationen.", explanation: "Typisch fur B2"},
    {mistake: "Keine Nominalisierungen in Diskussion", correction: "Die Globalisierung fuhrt zu einer Erhohung...", explanation: "Formelle Diskussionen nutzen Nominalstil"},
    {mistake: "Fachbegriffe falsch ubersetzt", correction: "Deutsche Wirtschaftsbegriffe: BIP, Freihandel", explanation: "Wirtschaftsvokabular"},
    {mistake: "Kein Passiv in Analyse", correction: "Der Welthandel wird beeinflusst.", explanation: "Wirtschaftsanalyse im Passiv"}
  ],
  B2_lesson_12: [
    {mistake: "Subjektive Meinung ohne Kennzeichnung", correction: "Meiner Ansicht nach... / Aus ethischer Sicht...", explanation: "Wissenschaftsethik: klare Kennzeichnung"},
    {mistake: "Fehlende Argumentstruktur", correction: "These - Argument - Beispiel - Schlussfolgerung", explanation: "Klare wiss. Struktur"},
    {mistake: "Kein K.I in Zitaten", correction: "Der Forscher behauptet, die Studie sei valide.", explanation: "Indirekte Rede mit K.I"},
    {mistake: "Passiv in Diskussion vergessen", correction: "Die Ergebnisse wurden uberpruft.", explanation: "Passiv reduziert Subjektivitat"},
    {mistake: "Konnektoren fehlen (folglich, demnach, insofern)", correction: "Die Hypothese bestatigt sich nicht, folglich...", explanation: "Folgerungskonnektoren"}
  ],
  B2_lesson_13: [
    {mistake: "Bewerbung mit falscher Anrede", correction: "Sehr geehrte Damen und Herren", explanation: "Standardisierte formelle Anrede"},
    {mistake: "Kein K.II im Gesprach", correction: "Ich wurde sagen, dass ich uber Erfahrung verfuge.", explanation: "Hoeflichkeit durch K.II"},
    {mistake: "Zu direkte Fragen", correction: "Durfte ich fragen, welche Aufgaben...?", explanation: "Modalverben subjektiv fur Hoeflichkeit"},
    {mistake: "Falsche Zeitform im Lebenslauf", correction: "Prasens (aktuell), Prateritum (fruher)", explanation: "Tempuswechsel im Lebenslauf"},
    {mistake: "Anschreiben ohne Struktur", correction: "Einleitung - Motivation - Qualifikation - Schluss", explanation: "Klare Bewerbungsstruktur"}
  ],
  B2_lesson_14: [
    {mistake: "Ubermassiges man", correction: "Passiv oder bestimmtes Subjekt", explanation: "B2 vermeidet pauschales man"},
    {mistake: "Keine Nominalisierungen (Umwelt)", correction: "Die Reduzierung von CO2-Emissionen...", explanation: "Umwelt-Fachvokabular"},
    {mistake: "sorgen fur/um verwechselt", correction: "sorgen fur = verursachen, sich sorgen um = sich kummern", explanation: "Praposition andert Bedeutung"},
    {mistake: "Kein K.II fur Vorschlage", correction: "Man konnte mehr investieren.", explanation: "Vorschlage mit K.II"},
    {mistake: "Keine B2-Konnektoren", correction: "Je mehr wir investieren, desto schneller...", explanation: "Je-desto fur Zusammenhange"}
  ],
  B2_lesson_15: [
    {mistake: "Falsche Fachbegriffe", correction: "Aktie, Anleihe, Dividende, Fonds", explanation: "Wirtschaftsvokabular wichtig"},
    {mistake: "Kein Passiv in Wirtschaftstexten", correction: "Die Aktien werden an der Borse gehandelt.", explanation: "Passiv in Wirtschaftstexten"},
    {mistake: "Verb-Praposition falsch", correction: "investieren in (Akk), finanzieren durch", explanation: "Feste Prapositionen"},
    {mistake: "Funktionsverbgefuge fehlen", correction: "in Kraft treten, zur Verfugung stellen", explanation: "Typisch fur Wirtschaftsdeutsch"},
    {mistake: "Keine indirekte Rede", correction: "Der Vorstand gab bekannt, der Gewinn sei gestiegen.", explanation: "Wirtschaftsberichte mit indirekter Rede"}
  ],
  B2_lesson_16: [
    {mistake: "Integration vs Assimilation", correction: "Integration = gegenseitige Anpassung", explanation: "Begriffliche Differenzierung"},
    {mistake: "Kein K.I in Diskussion", correction: "Die Studie zeigt, dass Integration gelinge.", explanation: "Zitate mit K.I"},
    {mistake: "wo statt Praposition+Pronomen", correction: "die Gesellschaft, in der wir leben", explanation: "Formell: Praposition + Relativpronomen"},
    {mistake: "ankommen in/auf verwechselt", correction: "ankommen auf = abhangen von", explanation: "Praposition andert Bedeutung"},
    {mistake: "Keine komplexen Nebensatze", correction: "Obwohl Integration Herausforderungen birgt...", explanation: "B2 erwartet komplexe Strukturen"}
  ],
  B2_lesson_17: [
    {mistake: "Grundgesetz falscher Artikel", correction: "das Grundgesetz (Neutrum)", explanation: "Politische Begriffe mit korrektem Artikel"},
    {mistake: "Kein Passiv im Rechtskontext", correction: "Das Gesetz wurde vom Bundestag verabschiedet.", explanation: "Rechtstexte haufig Passiv"},
    {mistake: "Nominalstil in Gesetzen unverstandlich", correction: "Die Wahrnehmung von Rechten...", explanation: "Gesetzestexte stark nominalisiert"},
    {mistake: "Falsche Konnektoren juristisch", correction: "Insofern die Klage begrundet ist...", explanation: "Spezifische juristische Konnektoren"},
    {mistake: "Genitiv-Relativsatze falsch", correction: "die Rechte, deren Verletzung geklagt wird", explanation: "Haufig im Rechtsdeutsch"}
  ],
  B2_lesson_18: [
    {mistake: "Kein K.I in Medienanalyse", correction: "Der Artikel behauptet, die Pressefreiheit sei gefahrdet.", explanation: "Medienanalyse mit K.I"},
    {mistake: "Keine Partizipialattribute", correction: "Die von der Regierung kritisierte Berichterstattung...", explanation: "Verdichten Information"},
    {mistake: "schreiben uber/an verwechselt", correction: "uber (Thema), an (Adressat)", explanation: "Prapositionen unterscheiden"},
    {mistake: "Kein K.II bei Kritik", correction: "Man konnte die Berichterstattung als einseitig betrachten.", explanation: "Kritik mit K.II abschwachen"},
    {mistake: "Aktiv statt Passiv in Analyse", correction: "Die Medien werden von der Politik beeinflusst.", explanation: "Passiv betont Analyseobjekt"}
  ],
  B2_lesson_19: [
    {mistake: "Reflexivverben falsch (erinnern)", correction: "Ich erinnere MICH an... (reflexiv)", explanation: "Psychologie: viele Reflexivverben"},
    {mistake: "Kein K.II fur Hypothesen", correction: "Wenn mehr Menschen Sport trieben...", explanation: "Hypothesen mit K.II"},
    {mistake: "glauben an/auf falsch", correction: "glauben AN + Akk", explanation: "Feste Praposition"},
    {mistake: "Keine Da-Komposita", correction: "Daruber hinaus..., Hiervon ausgehend...", explanation: "Strukturieren Argumentation"},
    {mistake: "Kein K.I in Studienzitaten", correction: "Die Autoren argumentieren, Motivation sei entscheidend.", explanation: "Studienzitate mit K.I"}
  ],
  B2_lesson_20: [
    {mistake: "Reisen vs verreisen vs bereisen", correction: "reisen (allg.), verreisen (wegfahren), bereisen (Land)", explanation: "Differenzierung"},
    {mistake: "Genitiv bei Landernamen", correction: "die Kultur Italiens / die italienische Kultur", explanation: "Genitiv bei Landern mit Artikel"},
    {mistake: "Keine Prapositionaladverbien", correction: "Worauf kommt es beim Reisen an?", explanation: "Da-Komposita"},
    {mistake: "Wechselprapositionen verwechselt", correction: "in die Stadt fahren (Akk) vs in der Stadt sein (Dat)", explanation: "Wo? (Dat) vs Wohin? (Akk)"},
    {mistake: "Passiversatz sich lassen fehlt", correction: "Der Flug lasst sich nicht stornieren.", explanation: "Passiversatz im Reisekontext"}
  ],
  B2_lesson_21: [
    {mistake: "digitalisieren vs digital", correction: "digitalisieren (Verb), digital (Adj.)", explanation: "Wortbildung"},
    {mistake: "Keine Nominalisierungen", correction: "Die Vernetzung von Geraten...", explanation: "Technische Texte mit Nominalstil"},
    {mistake: "Kein Passiv mit Modalverben", correction: "KI kann in vielen Bereichen eingesetzt werden.", explanation: "Diskussion uber KI"},
    {mistake: "Falscher Konnektor: dadurch, dass", correction: "Dadurch, dass Prozesse automatisiert werden...", explanation: "Kausale Zusammenhange"},
    {mistake: "Keine Da-Komposita", correction: "Hiermit beschaftigt sich die aktuelle Forschung.", explanation: "Formelle Technikdiskussion"}
  ],
  B2_lesson_22: [
    {mistake: "Historisches Prasens vs Vergangenheit", correction: "Prasens fur Analyse, Prateritum fur Ereignisse", explanation: "Tempuswahl"},
    {mistake: "Passiv in Geschichte", correction: "Die Mauer wurde 1961 errichtet.", explanation: "Historische Ereignisse im Passiv"},
    {mistake: "K.I in Zitaten", correction: "Brandt sagte, der Mauerfall sei historisch.", explanation: "Zitate mit K.I"},
    {mistake: "Konnektoren fur zeitliche Abfolge", correction: "zunachst... daraufhin... schliesslich...", explanation: "Zeitliche Struktur"},
    {mistake: "Relativsatze mit Prapositionen", correction: "die Zeit, in der die Mauer stand", explanation: "Historische Zusammenhange"}
  ],
  B2_lesson_23: [
    {mistake: "Satzverkurzung mit Partizipien", correction: "Die steigende Urbanisierung fuhrt zu...", explanation: "Partizipialattribute statt Nebensatze"},
    {mistake: "Keine je-desto Vergleiche", correction: "Je dichter die Stadt, desto hoher die Mieten.", explanation: "Stadtentwicklung"},
    {mistake: "Keine Nominalisierungen", correction: "Die Verdichtung urbaner Raume...", explanation: "Nominalstil fur Stadtanalyse"},
    {mistake: "Kein Futur II fur Prognosen", correction: "Bis 2030 werden die Stadte dichter geworden sein.", explanation: "Zukunftsperspektiven"},
    {mistake: "Kein K.I in Planungsdiskussion", correction: "Der Stadtplaner sagt, der Verkehr solle reduziert werden.", explanation: "Planungszitate mit K.I"}
  ],
  B2_lesson_24: [
    {mistake: "Energiewende vs Klimawandel", correction: "Energiewende = politische Massnahme", explanation: "Begriffliche Differenzierung"},
    {mistake: "Kein Passiv in Umweltdiskussion", correction: "Erneuerbare Energien werden gefordert.", explanation: "Umweltpolitik im Passiv"},
    {mistake: "Keine Doppelkonnektoren", correction: "Nicht nur die Politik, sondern auch die Wirtschaft...", explanation: "Komplexe Zusammenhange"},
    {mistake: "Keine Nominalisierungen", correction: "Die Reduzierung von CO2 ist zentral.", explanation: "Umweltdeutsch nominalisiert"},
    {mistake: "Kein K.II fur Alternativszenarien", correction: "Wenn wir mehr investierten...", explanation: "Alternative Szenarien"}
  ],
  B2_lesson_25: [
    {mistake: "Kultur falscher Genus", correction: "die Kultur (feminin)", explanation: "Kulturbegriffe mit korrektem Artikel"},
    {mistake: "Keine Da-Komposita", correction: "Darunter versteht man kulturelle Vielfalt.", explanation: "Da-Komposita"},
    {mistake: "Relativsatze im Dativ falsch", correction: "die Kultur, in der wir leben", explanation: "Relativsatze mit Prapositionen"},
    {mistake: "Kein Passiv im Kulturvergleich", correction: "Mode wird von kulturellen Einflussen gepragt.", explanation: "Kulturanalyse im Passiv"},
    {mistake: "Kein K.I fur Zitate", correction: "Der Autor schreibt, Mode sei Ausdruck von Identitat.", explanation: "Kulturzitate mit K.I"}
  ]
};

console.log("COMMON_MISTAKES defined for", Object.keys(COMMON_MISTAKES).length, "lessons");

const FORMS_TABLES = {
  B2_lesson_1: [
    { title: "Vorgangspassiv vs Zustandspassiv",
      rows: [
        { form: "Vorgangspassiv (werden + Partizip II)", use: "Handlung/Prozess", example: "Die Tur wird geoffnet." },
        { form: "Zustandspassiv (sein + Partizip II)", use: "Zustand/Ergebnis", example: "Die Tur ist geoffnet." },
        { form: "Vorgang Perfekt (sein + PII + worden)", use: "Abgeschlossene Handlung", example: "Die Tur ist geoffnet worden." }
      ]
    },
    { title: "Passiv - Zeitformen",
      rows: [
        { form: "Prasens: werden + PII", use: "Gegenwart", example: "Der Brief wird geschrieben." },
        { form: "Prateritum: wurde + PII", use: "Vergangenheit (schriftlich)", example: "Der Brief wurde geschrieben." },
        { form: "Perfekt: ist + PII + worden", use: "Vergangenheit (mundlich)", example: "Der Brief ist geschrieben worden." },
        { form: "Plusquamperfekt: war + PII + worden", use: "Vorvergangenheit", example: "Der Brief war geschrieben worden." },
        { form: "Futur I: wird + PII + werden", use: "Zukunft", example: "Der Brief wird geschrieben werden." }
      ]
    }
  ],
  B2_lesson_6: [
    { title: "B2-Konnektoren - Ubersicht",
      rows: [
        { form: "obwohl (Subjunktor)", use: "Einraumung/Gegensatz", example: "Obwohl es regnet, gehen wir spazieren." },
        { form: "trotzdem (Adverb)", use: "Gegensatz (Hauptsatz)", example: "Es regnet. Trotzdem gehen wir spazieren." },
        { form: "sodass (Subjunktor)", use: "Konsequenz", example: "Er lernte viel, sodass er die Prufung bestand." },
        { form: "indem (Subjunktor)", use: "Methode/Mittel", example: "Man spart Energie, indem man isoliert." },
        { form: "je...desto/umso", use: "Proportionale Steigerung", example: "Je mehr man ubt, desto besser wird man." }
      ]
    },
    { title: "Doppelkonnektoren",
      rows: [
        { form: "nicht nur..., sondern auch...", use: "Positive Aufzahlung", example: "Nicht nur die Wirtschaft, sondern auch die Umwelt profitiert." },
        { form: "weder..., noch...", use: "Negative Aufzahlung", example: "Weder die Politik noch die Wirtschaft handelt." },
        { form: "entweder..., oder...", use: "Alternative", example: "Entweder wir handeln jetzt, oder es ist zu spat." },
        { form: "sowohl..., als auch...", use: "Parallelitat", example: "Sowohl Experten als auch Laien sind betroffen." },
        { form: "einerseits..., andererseits...", use: "Gegensatz", example: "Einerseits gibt es Vorteile, andererseits Nachteile." }
      ]
    }
  ],
  B2_lesson_20: [
    { title: "Wechselprapositionen - Wo? vs Wohin?",
      rows: [
        { form: "in + Dativ (Wo?)", use: "Position/Ort", example: "Ich bin in der Stadt." },
        { form: "in + Akkusativ (Wohin?)", use: "Richtung/Ziel", example: "Ich fahre in die Stadt." },
        { form: "an + Dativ", use: "Position an etwas", example: "Das Hotel liegt am Meer." },
        { form: "an + Akkusativ", use: "Richtung an etwas", example: "Wir fahren ans Meer." },
        { form: "auf + Dativ", use: "Position auf etwas", example: "Das Gepack ist auf dem Gepacktrager." },
        { form: "auf + Akkusativ", use: "Richtung auf etwas", example: "Ich stelle den Koffer auf den Gepacktrager." }
      ]
    }
  ],
  B2_lesson_10: [
    { title: "Satzbau - Stellungsfelder",
      rows: [
        { form: "Vorfeld: Position 1", use: "Topik (Thema)", example: "Gestern habe ich ein Buch gelesen." },
        { form: "linke Klammer: Position 2", use: "Finites Verb", example: "...habe ich ein Buch gelesen." },
        { form: "Mittelfeld", use: "Subjekt, Objekte, Adverbiale", example: "...ich gestern ein Buch..." },
        { form: "rechte Klammer: Satzende", use: "Infinites Verb/PII", example: "...gelesen." },
        { form: "Nachfeld (Ausklammerung)", use: "Vergleiche/Nebensatze", example: "...als ich jung war." }
      ]
    }
  ],
  B2_lesson_4: [
    { title: "Subjektive Modalverben - Wahrscheinlichkeit",
      rows: [
        { form: "mussen (+ Infinitiv)", use: "100% logische Schlussfolgerung", example: "Er muss zu Hause sein." },
        { form: "durfte (+ Infinitiv)", use: "~90% Annahme", example: "Er durfte schon da sein." },
        { form: "konnen/mogen (+ Infinitiv)", use: "~50% Moglichkeit", example: "Er kann krank sein." },
        { form: "konnte/durfte (K.II)", use: "~30% geringe W'keit", example: "Er konnte der Tater sein." },
        { form: "sollen (+ Infinitiv)", use: "Zitat von Dritten", example: "Er soll in Berlin wohnen." },
        { form: "wollen (+ Infinitiv)", use: "Eigene Behauptung", example: "Sie will den Sieg errungen haben." }
      ]
    }
  ],
  B2_lesson_8: [
    { title: "Konjunktiv I - Bildung",
      rows: [
        { form: "haben: er habe (K.I)", use: "Indirekte Rede Gegenwart", example: "Er sagt, er habe keine Zeit." },
        { form: "sein: er sei (K.I)", use: "Indirekte Rede Zustand", example: "Sie sagt, er sei krank." },
        { form: "Modalverb: er konne (K.I)", use: "Indirekte Rede mit Modalv.", example: "Er sagt, er konne kommen." },
        { form: "K.I Perfekt: habe + PII", use: "Indirekte Rede Vergangenheit", example: "Er sagt, er habe gearbeitet." },
        { form: "K.II Ersatzform", use: "Wenn K.I = Indikativ", example: "Sie hatten (statt haben) ..." }
      ]
    }
  ]
};

const MINI_DRILLS = {
  B2_lesson_1: [
    { question: "Aktiv: Der Mechaniker repariert das Auto. - Passiv Prasens", answer: "Das Auto wird (von dem Mechaniker) repariert." },
    { question: "Aktiv: Die Firma lieferte die Ware. - Passiv Prateritum", answer: "Die Ware wurde (von der Firma) geliefert." },
    { question: "Zustandspassiv: Das Fenster ist geschlossen. - Bedeutung?", answer: "Das Fenster ist im Zustand geschlossen (Ergebnis)." },
    { question: "Vorgangspassiv: Die Tur wird geoffnet. - Bedeutung?", answer: "Jemand offnet die Tur (Prozess)." },
    { question: "Aktiv: Man hat den Vertrag unterschrieben. - Passiv Perfekt", answer: "Der Vertrag ist unterschrieben worden." },
    { question: "Passiv m. Modal: Man muss die Rechnung bezahlen.", answer: "Die Rechnung muss bezahlt werden." }
  ],
  B2_lesson_2: [
    { question: "Umschreiben: Man kann das Problem losen. (sich lassen)", answer: "Das Problem lasst sich losen." },
    { question: "Umschreiben: Der Antrag muss gestellt werden. (sein+zu)", answer: "Der Antrag ist zu stellen." },
    { question: "The door can be opened. (sich lassen)", answer: "Die Tur lasst sich offnen." },
    { question: "This document must be signed. (sein+zu)", answer: "Dieses Dokument ist zu unterschreiben." },
    { question: "Ubersetzen: The problem is solvable.", answer: "Das Problem ist losbar. / Das Problem lasst sich losen." },
    { question: "Passiversatz: Man kann das leicht erklaren. (2 Varianten)", answer: "Das ist leicht zu erklaren. / Das lasst sich leicht erklaren." }
  ],
  B2_lesson_3: [
    { question: "Ich warte ___ den Bus. (Praposition)", answer: "Ich warte auf den Bus." },
    { question: "Ich denke an die Reise. -> da-Kompositum", answer: "Ich denke daran." },
    { question: "Er spricht uber Politik. -> Frage mit wo-", answer: "Woruber spricht er?" },
    { question: "Sie interessiert sich ___ Kunst.", answer: "Sie interessiert sich fur Kunst." },
    { question: "Wir freuen uns ___ den Urlaub. (Zukunft)", answer: "Wir freuen uns auf den Urlaub." },
    { question: "Er wartet auf den Zug. -> Frage", answer: "Worauf wartet er?" }
  ],
  B2_lesson_4: [
    { question: "Vermutung (50%): Vielleicht ist er krank.", answer: "Er kann krank sein." },
    { question: "Logik (95%): Er ist wahrscheinlich der Tater.", answer: "Er muss der Tater sein." },
    { question: "Zitat: Die Nachbarn sagen, sie sei verreist.", answer: "Sie soll verreist sein." },
    { question: "Behauptung: Sie sagt, sie habe den Fehler gefunden.", answer: "Sie will den Fehler gefunden haben." },
    { question: "Geringe W'keit: Er kommt kaum.", answer: "Er konnte kommen." },
    { question: "Zitat Vergangenheit: Angeblich hat er das Buch gelesen.", answer: "Er soll das Buch gelesen haben." }
  ],
  B2_lesson_5: [
    { question: "Nomen zu: importieren", answer: "der Import / das Importieren" },
    { question: "Nomen zu: analysieren", answer: "die Analyse" },
    { question: "Funktionsverb: eine Entscheidung ____", answer: "eine Entscheidung treffen" },
    { question: "Funktionsverb: zur Verfugung ____", answer: "zur Verfugung stellen" },
    { question: "Funktionsverb: in Kraft ____", answer: "in Kraft treten" },
    { question: "Die Wirtschaft wachst -> Nominalisierung", answer: "das Wirtschaftswachstum" }
  ],
  B2_lesson_6: [
    { question: "Konnektor fur Gegensatz: ... es regnet, gehen wir spazieren.", answer: "Obwohl es regnet, gehen wir spazieren." },
    { question: "Konnektor fur Konsequenz: Er lernte viel, ... er die Prufung bestand.", answer: "...sodass er die Prufung bestand." },
    { question: "Doppelkonnektor: ... die Wirtschaft ... die Umwelt profitiert.", answer: "Nicht nur die Wirtschaft, sondern auch die Umwelt profitiert." },
    { question: "Doppelkonnektor negativ: ... die Politik ... die Wirtschaft handelt.", answer: "Weder die Politik noch die Wirtschaft handelt." },
    { question: "Je-desto: ... mehr man ubt, ... besser wird man.", answer: "Je mehr man ubt, desto besser wird man." },
    { question: "Doppelkonnektor: ... Vorteile ... Nachteile.", answer: "Einerseits gibt es Vorteile, andererseits Nachteile." }
  ],
  B2_lesson_7: [
    { question: "Relativpronomen Genitiv maskulin: der Mann, ... Auto gestohlen wurde", answer: "...dessen Auto gestohlen wurde" },
    { question: "Relativpronomen Genitiv feminin: die Frau, ... Hilfe ich benotigte", answer: "...deren Hilfe ich benotigte" },
    { question: "Relativsatz mit Praposition: die Stadt, ... ich lebe", answer: "die Stadt, in der ich lebe" },
    { question: "Verbposition: Das ist der Mann, der das Auto...", answer: "...gestohlen hat. (Verb am Ende!)" },
    { question: "wo-Kompositum: das Haus, ... ich wohne (formell)", answer: "das Haus, in dem ich wohne" },
    { question: "Relativpronomen nach Praposition: die Menschen, mit ... ich arbeite", answer: "...mit denen ich arbeite" }
  ],
  B2_lesson_8: [
    { question: "Er sagt: Ich habe keine Zeit. - Indirekte Rede", answer: "Er sagt, er habe keine Zeit." },
    { question: "Sie fragt: Kommst du? - Indirekte Frage", answer: "Sie fragt, ob ich komme." },
    { question: "Er fragt: Wann fahrt der Zug? - Indirekt", answer: "Er fragt, wann der Zug fahrt." },
    { question: "Sie sagt: Ich bin krank. - Indirekte Rede", answer: "Sie sagt, sie sei krank." },
    { question: "Er sagte: Ich habe gearbeitet. - Indirekt Vergangenheit", answer: "Er sagte, er habe gearbeitet." },
    { question: "Sie sagten: Wir haben keine Zeit. - K.II Ersatzform", answer: "Sie sagten, sie hatten keine Zeit." }
  ],
  B2_lesson_9: [
    { question: "Der Student, der liest -> Partizipialattribut", answer: "der lesende Student" },
    { question: "Der Artikel, der gelesen wird -> Partizipialattribut", answer: "der gelesene Artikel" },
    { question: "Die Analyse, die prasentiert wird -> kurz", answer: "die prasentierte Analyse" },
    { question: "Partizip I oder II?: das laufende Band", answer: "Partizip I (aktiv, gleichzeitig)" },
    { question: "Partizip I oder II?: das reparierte Auto", answer: "Partizip II (passiv, abgeschlossen)" },
    { question: "Der Vorschlag, der von der Regierung gemacht wurde -> kurz", answer: "der von der Regierung gemachte Vorschlag" }
  ],
  B2_lesson_10: [
    { question: "Erganzen: Ich habe gestern ein Buch ____.", answer: "...gelesen. (rechte Klammer schlieSSen)" },
    { question: "Inversion: Ich habe gestern ein Buch gelesen. -> Gestern...", answer: "Gestern habe ich ein Buch gelesen." },
    { question: "n-Deklination: der Kollege, den ____", answer: "den Kollegen" },
    { question: "Ausklammerung oder nicht?: Ich habe ... gelesen, das Buch.", answer: "Ich habe das Buch gelesen. (keine Ausklammerung)" },
    { question: "Position der Negation: Ich habe nicht das Buch gelesen vs Ich habe das Buch nicht gelesen.", answer: "Ich habe das Buch nicht gelesen. (Negation vor PII)" },
    { question: "Dativ: Ich helfe ____ (der Kollege) - n-Deklination?", answer: "dem Kollegen (n-Deklination: Kollege -> Kollegen)" }
  ],
  B2_lesson_11: [
    { question: "Nennen Sie 3 Vorteile der Globalisierung.", answer: "Z.B.: Freier Handel, kultureller Austausch, technologischer Fortschritt." },
    { question: "Nennen Sie 3 Nachteile der Globalisierung.", answer: "Z.B.: Umweltverschmutzung, Ausbeutung, Verlust kultureller Identitat." },
    { question: "Was bedeutet BIP?", answer: "Bruttoinlandsprodukt (Gross Domestic Product)." },
    { question: "Formulieren Sie eine These zur Globalisierung.", answer: "Die Globalisierung fuhrt zu einer zunehmenden wirtschaftlichen Verflechtung." },
    { question: "Konnektor: ...die Globalisierung wirtschaftliche Vorteile bringt, ...sie auch Risiken birgt.", answer: "Obwohl die Globalisierung wirtschaftliche Vorteile bringt, birgt sie auch Risiken." },
    { question: "Passiv: Man muss den Welthandel regulieren.", answer: "Der Welthandel muss reguliert werden." }
  ],
  B2_lesson_12: [
    { question: "Struktur einer wissenschaftlichen Argumentation", answer: "These - Argument - Beispiel - Schlussfolgerung" },
    { question: "Wie kennzeichnet man eine eigene Meinung?", answer: "Meiner Ansicht nach... / Aus ethischer Sicht..." },
    { question: "Indirekte Rede: Der Forscher behauptet: Die Studie ist valide.", answer: "Der Forscher behauptet, die Studie sei valide." },
    { question: "Passiv: Man uberprufte die Ergebnisse.", answer: "Die Ergebnisse wurden uberpruft." },
    { question: "Folgerungskonnektor: Die Hypothese bestatigt sich nicht, ...muss sie revidiert werden.", answer: "...folglich muss sie revidiert werden." },
    { question: "Wissenschaftlicher Stil: man / Passiv / Aktiv?", answer: "Passiv bevorzugen: Die Daten wurden analysiert (statt: Man analysierte...)" }
  ],
  B2_lesson_13: [
    { question: "Formelle Anrede in der Bewerbung", answer: "Sehr geehrte Damen und Herren," },
    { question: "Hoflich fragen im Vorstellungsgesprach", answer: "Durfte ich fragen, welche Aufgaben...?" },
    { question: "K.II fur Hoflichkeit: Ich ... sagen, dass...", answer: "Ich wurde sagen, dass..." },
    { question: "Zeitform Lebenslauf: aktuelle Position", answer: "Prasens (z.B.: Ich arbeite bei...)" },
    { question: "Zeitform Lebenslauf: fruhere Positionen", answer: "Prateritum (z.B.: Ich arbeitete bei...)" },
    { question: "Struktur des Anschreibens", answer: "Einleitung - Motivation - Qualifikation - Schluss" }
  ],
  B2_lesson_14: [
    { question: "Nennen Sie 3 erneuerbare Energiequellen", answer: "Sonne, Wind, Wasser" },
    { question: "Warum ist Nachhaltigkeit wichtig?", answer: "Um Ressourcen fur zukunftige Generationen zu erhalten." },
    { question: "Vorschlag mit K.II: Mehr in erneuerbare Energien investieren", answer: "Man konnte mehr in erneuerbare Energien investieren." },
    { question: "Passiv: Die Regierung fordert erneuerbare Energien.", answer: "Erneuerbare Energien werden (von der Regierung) gefordert." },
    { question: "sorgen fur vs sich sorgen um - Unterschied", answer: "sorgen fur = verursachen, sich sorgen um = sich kummern" },
    { question: "Je-desto: ... mehr wir investieren, ... schneller die Energiewende.", answer: "Je mehr wir investieren, desto schneller die Energiewende." }
  ],
  B2_lesson_15: [
    { question: "Was ist eine Aktie?", answer: "Ein Anteil an einem Unternehmen." },
    { question: "Was ist eine Dividende?", answer: "Der Gewinnanteil, der an Aktionare ausgeschuttet wird." },
    { question: "Passiv: Man handelt die Aktien an der Borse.", answer: "Die Aktien werden an der Borse gehandelt." },
    { question: "Funktionsverb: Das neue Gesetz tritt in...", answer: "Das neue Gesetz tritt in Kraft." },
    { question: "Indirekte Rede: Der Vorstand: Der Gewinn ist gestiegen.", answer: "Der Vorstand gab bekannt, der Gewinn sei gestiegen." },
    { question: "Verben mit Praposition: investieren ___ (Praposition)", answer: "investieren IN + Akkusativ" }
  ],
  B2_lesson_16: [
    { question: "Integration vs Assimilation - Unterschied", answer: "Integration = gegenseitige Anpassung, Assimilation = vollstandige Angleichung" },
    { question: "Relativsatz: die Gesellschaft, ... wir leben", answer: "die Gesellschaft, in der wir leben" },
    { question: "K.I: Die Studie zeigt: Integration gelingt.", answer: "Die Studie zeigt, dass Integration gelinge." },
    { question: "Obwohl-Satz zu Integration", answer: "Obwohl die Integration Herausforderungen birgt, bietet sie Chancen." },
    { question: "ankommen auf vs ankommen in", answer: "ankommen AUF = abhangen von, ankommen IN = Ort erreichen" },
    { question: "Nebensatz: ... Migration viele Chancen bietet, ... gibt es auch Herausforderungen.", answer: "Obwohl Migration viele Chancen bietet, gibt es auch Herausforderungen." }
  ],
  B2_lesson_17: [
    { question: "Artikel von Grundgesetz", answer: "das Grundgesetz (Neutrum)" },
    { question: "Passiv: Der Bundestag verabschiedete das Gesetz.", answer: "Das Gesetz wurde vom Bundestag verabschiedet." },
    { question: "Relativsatz Genitiv: die Rechte, ... Verletzung geklagt wird", answer: "die Rechte, deren Verletzung geklagt wird" },
    { question: "Insofern-Konnektor: ... die Klage begrundet ist, wird ihr stattgegeben.", answer: "Insofern die Klage begrundet ist, wird ihr stattgegeben." },
    { question: "Nominalisierung: Gesetze verabschieden -> Nomen", answer: "die Verabschiedung von Gesetzen" },
    { question: "Funktionsverb: ein Urteil...", answer: "ein Urteil fallen / ein Urteil sprechen" }
  ],
  B2_lesson_18: [
    { question: "K.I: Der Artikel behauptet: Die Pressefreiheit ist gefahrdet.", answer: "Der Artikel behauptet, die Pressefreiheit sei gefahrdet." },
    { question: "Partizipialattribut: Die Berichterstattung, die von der Regierung kritisiert wird", answer: "die von der Regierung kritisierte Berichterstattung" },
    { question: "Praposition: ein Artikel ___ (Thema) vs schreiben ___ (Adressat)", answer: "ein Artikel UBER (Thema) vs schreiben AN (Adressat)" },
    { question: "K.II fur Kritik: Die Berichterstattung ist einseitig.", answer: "Man konnte die Berichterstattung als einseitig betrachten." },
    { question: "Passiv: Die Politik beeinflusst die Medien.", answer: "Die Medien werden von der Politik beeinflusst." },
    { question: "Passiversatz: Die Pressefreiheit kann uberwacht werden.", answer: "Die Pressefreiheit lasst sich uberwachen." }
  ],
  B2_lesson_19: [
    { question: "Richtiges Reflexivverb: Ich erinnere ... an...", answer: "Ich erinnere MICH an..." },
    { question: "K.II: Wenn mehr Menschen Sport ...", answer: "Wenn mehr Menschen Sport trieben, waren sie gesunder." },
    { question: "Feste Praposition: glauben ___ (Praposition)", answer: "glauben AN + Akkusativ" },
    { question: "Da-Kompositum: Daruber hinaus, Hiervon ausgehend - Funktion?", answer: "Sie strukturieren die Argumentation." },
    { question: "K.I: Die Autoren argumentieren: Motivation ist entscheidend.", answer: "Die Autoren argumentieren, Motivation sei entscheidend." },
    { question: "Nennen Sie 3 Faktoren fur Motivation", answer: "Z.B.: Autonomie, Kompetenz, soziale Zugehorigkeit" }
  ],
  B2_lesson_20: [
    { question: "reisen vs verreisen vs bereisen", answer: "reisen (allg.), verreisen (wegfahren), bereisen (ein Land)" },
    { question: "Genitiv: die Kultur ___ (Italien)", answer: "die Kultur Italiens" },
    { question: "Wo? vs Wohin?: ... bin in der Stadt (Wo/Wohin?)", answer: "Wo? (in + Dativ: Ich bin in der Stadt)" },
    { question: "Wo? vs Wohin?: ... fahre in die Stadt (Wo/Wohin?)", answer: "Wohin? (in + Akk: Ich fahre in die Stadt)" },
    { question: "Passiversatz: Der Flug kann nicht storniert werden.", answer: "Der Flug lasst sich nicht stornieren." },
    { question: "Frage: ... kommt es beim Reisen an? (wor-)", answer: "Worauf kommt es beim Reisen an?" }
  ],
  B2_lesson_21: [
    { question: "digitalisieren (Verb) vs digital (Adj.)", answer: "digitalisieren = in digitale Form umwandeln, digital = elektronisch" },
    { question: "Nominalisierung: Gerate vernetzen -> Nomen", answer: "die Vernetzung von Geraten" },
    { question: "Passiv m. Modal: Man kann KI in vielen Bereichen einsetzen.", answer: "KI kann in vielen Bereichen eingesetzt werden." },
    { question: "dadurch, dass: ... Prozesse automatisiert werden, steigt die Effizienz.", answer: "Dadurch, dass Prozesse automatisiert werden, steigt die Effizienz." },
    { question: "Da-Kompositum: ... beschaftigt sich die aktuelle Forschung.", answer: "Hiermit beschaftigt sich die aktuelle Forschung." },
    { question: "Nennen Sie 3 Bereiche fur KI-Anwendungen", answer: "Medizin, Verkehr, Kommunikation" }
  ],
  B2_lesson_22: [
    { question: "Historisches Prasens oder Prateritum fur Ereignisse?", answer: "Prateritum fur Ereignisse, Prasens fur Analyse" },
    { question: "Passiv: Man errichtete die Mauer 1961.", answer: "Die Mauer wurde 1961 errichtet." },
    { question: "K.I: Brandt: Der Mauerfall ist ein historischer Moment.", answer: "Brandt sagte, der Mauerfall sei ein historischer Moment." },
    { question: "Konnektoren zeitliche Abfolge", answer: "zunachst... daraufhin... schliesslich..." },
    { question: "Relativsatz: die Zeit, ... die Mauer stand", answer: "die Zeit, in der die Mauer stand" },
    { question: "Was bedeutet Demokratie fur Sie?", answer: "(Freie Antwort: Volksherrschaft, Grundrechte, Meinungsfreiheit...)" }
  ],
  B2_lesson_23: [
    { question: "Partizipialattribut: Die Urbanisierung, die steigt", answer: "die steigende Urbanisierung" },
    { question: "Je-desto: ... dichter die Stadt, ... hoher die Mieten.", answer: "Je dichter die Stadt, desto hoher die Mieten." },
    { question: "Nominalisierung: urbane Raume verdichten", answer: "die Verdichtung urbaner Raume" },
    { question: "Futur II: Bis 2030 werden die Stadte dichter geworden ___.", answer: "...sein." },
    { question: "K.I: Der Stadtplaner sagt: Der Verkehr soll reduziert werden.", answer: "Der Stadtplaner sagt, der Verkehr solle reduziert werden." },
    { question: "Was ist eine Smart City?", answer: "Eine Stadt, die Technologie fur Effizienz und Nachhaltigkeit nutzt." }
  ],
  B2_lesson_24: [
    { question: "Energiewende vs Klimawandel - Unterschied", answer: "Energiewende = politische Massnahme, Klimawandel = Naturphanomen" },
    { question: "Passiv: Man fordert erneuerbare Energien.", answer: "Erneuerbare Energien werden gefordert." },
    { question: "Doppelkonnektor: ... die Politik, ... die Wirtschaft ist gefordert.", answer: "Nicht nur die Politik, sondern auch die Wirtschaft ist gefordert." },
    { question: "Nominalisierung: CO2 reduzieren -> Nomen", answer: "die Reduzierung von CO2" },
    { question: "K.II: ... wir mehr investierten, ...", answer: "Wenn wir mehr investierten, wurden die Emissionen sinken." },
    { question: "Nennen Sie 3 erneuerbare Energiequellen", answer: "Sonne, Wind, Wasserkraft" }
  ],
  B2_lesson_25: [
    { question: "Artikel von Kultur", answer: "die Kultur (feminin)" },
    { question: "Da-Kompositum: ... versteht man kulturelle Vielfalt.", answer: "Darunter versteht man kulturelle Vielfalt." },
    { question: "Relativsatz: die Kultur, ... wir leben", answer: "die Kultur, in der wir leben" },
    { question: "Passiv: Kulturelle Einflusse pragen die Mode.", answer: "Mode wird von kulturellen Einflussen gepragt." },
    { question: "K.I: Der Autor schreibt: Mode ist Ausdruck von Identitat.", answer: "Der Autor schreibt, Mode sei Ausdruck von Identitat." },
    { question: "Was ist Ihre Meinung: Ist Mode Ausdruck von Kultur?", answer: "(Freie Antwort: Ja, Mode spiegelt gesellschaftliche Werte wider...)" }
  ]
};

// Write all as JSON files
const mistakesPath = path.join(__dirname, 'b2-common-mistakes.json');
