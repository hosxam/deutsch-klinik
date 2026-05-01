#!/usr/bin/env python3
"""Generate C1 lessons 6-15 (first 10 of 20)."""
import json, os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
OUTPUT = os.path.join(DATA_DIR, 'germanLessonsNew.json')

UNITS = {
    'A1': ['A1_unit_1','A1_unit_2','A1_unit_3','A1_unit_4','A1_unit_5'],
    'A2': ['A2_unit_1','A2_unit_2','A2_unit_3','A2_unit_4','A2_unit_5'],
    'B1': ['B1_unit_1','B1_unit_2','B1_unit_3','B1_unit_4','B1_unit_5'],
    'B2': ['B2_unit_1','B2_unit_2','B2_unit_3','B2_unit_4','B2_unit_5'],
    'C1': ['C1_unit_1','C1_unit_2','C1_unit_3','C1_unit_4','C1_unit_5'],
}
def unit(level, num): return UNITS[level][min((num-1)//5, 4)]

def mk(level, num, title, obj, expl, examples, gf, vlist, gplist,
       rtext, rq1, rq1o, rq1a, rq2, rq2o, rq2a,
       lscript, lq, lqo, lqa,
       wprompt, sprompt, summary):
    return {
        'level': level, 'unit': unit(level, num), 'id': f'{level}_lesson_{num}',
        'title': title, 'objective': obj, 'explanation': expl,
        'examples': examples, 'grammarFocus': gf,
        'vocabulary': [{'word':w,'translation':t} for w,t in vlist],
        'guidedPractice': [{'prompt':p,'answer':a} for p,a in gplist],
        'readingTask': {'text': rtext, 'questions': [
            {'question':rq1,'options':[rq1o[0],rq1o[1],rq1o[2],rq1o[3]],'answer':rq1a},
            {'question':rq2,'options':[rq2o[0],rq2o[1],rq2o[2],rq2o[3]],'answer':rq2a}
        ]},
        'listeningTask': {'script':lscript, 'questions':[
            {'question':lq,'options':[lqo[0],lqo[1],lqo[2],lqo[3]],'answer':lqa}
        ]},
        'writingTask': {'prompt':wprompt},
        'speakingTask': {'prompt':sprompt},
        'reviewSummary': summary,
    }

with open(OUTPUT, 'r', encoding='utf-8') as f:
    existing = json.load(f)
existing_ids = set(l['id'] for l in existing)
new_lessons = []
added = 0

def add(*args):
    global added
    lid = f'{args[0]}_lesson_{args[1]}'
    if lid in existing_ids:
        print(f"  Skip: {lid}")
        return
    new_lessons.append(mk(*args))
    added += 1

# ===== C1 LESSONS 6-15 =====

add('C1', 6,
    'Wissenschaftliches Schreiben',
    'Write academic texts with sophisticated structure.',
    'Wissenschaftliches Schreiben erfordert klare Struktur: Einleitung, Hauptteil, Schluss. Vermeide Umgangssprache. Nutze Konnektoren wie "insofern", "demzufolge", "in Anbetracht dessen". Der Nominalstil ist typisch: "Die Untersuchung der Daten ergab..." statt "Wir haben die Daten untersucht...".',
    ['In Anbetracht der Ergebnisse lässt sich Folgendes konstatieren.', 'Demzufolge bedarf die Methodik einer Revision.', 'Insofern die Datenlage robust ist, sind die Schlussfolgerungen valide.', 'Es ist anzunehmen, dass weitere Studien notwendig sind.'],
    'Academic writing skills',
    [('die Abhandlung','treatise'),('die Analyse','analysis'),('die These','thesis'),('die Schlussfolgerung','conclusion'),('die Methodik','methodology'),('der Diskurs','discourse'),('die Validität','validity'),('die Relevanz','relevance'),('konstatieren','to ascertain'),('insofern','insofar as')],
    [('Formulate: "In view of the results" in German','In Anbetracht der Ergebnisse'),('What does "demzufolge" mean?','consequently')],
    'Die vorliegende Studie untersucht den Einfluss sozialer Medien auf das Wahlverhalten junger Erwachsener. In Anbetracht der steigenden Bedeutung digitaler Plattformen für die politische Meinungsbildung ist diese Fragestellung von hoher Relevanz. Die methodische Herangehensweise basiert auf einer quantitativen Befragung von 2000 Probanden. Demzufolge lassen sich repräsentative Aussagen treffen.',
    'Was untersucht die Studie?',
    ['Konsumverhalten','Einfluss sozialer Medien auf Wahlverhalten','Sprachwandel','Bildungssystem'],
    'Einfluss sozialer Medien auf Wahlverhalten',
    'Wie viele Probanden wurden befragt?',
    ['200','500','2000','10000'],
    '2000',
    'A: Wie schreibe ich eine wissenschaftliche Arbeit? B: Zunächst eine klare Gliederung erstellen. Dann pro Absatz einen Gedanken. Am Ende das Fazit mit Bezug zur Fragestellung.',
    'Was ist der erste Schritt?',
    ['Fazit schreiben','klare Gliederung erstellen','Literatur suchen','Korrektur lesen'],
    'klare Gliederung erstellen',
    'Write the introduction for an academic paper on a topic of your choice.',
    'Present the structure of your academic paper.',
    'die Analyse, die These, die Methodik, die Schlussfolgerung, die Validität')

add('C1', 7,
    'Sprachliche Nuancen und Register',
    'Master German registers and stylistic nuances.',
    'Register sind Sprachstile für unterschiedliche Situationen. Formal: "Ich möchte höflich um Auskunft bitten." Neutral: "Können Sie mir helfen?" Informal: "Hilfst du mir?" C1-Niveau erfordert sicheres Wechseln zwischen Registern. Besonders wichtig: indirekte Rede, Konjunktiv I für formelle Berichterstattung.',
    ['Der Minister erklärte, die Reform sei notwendig.', 'Man könnte argumentieren, dass der Ansatz zu kurz greift.', 'Es sei darauf hingewiesen, dass die Daten vorläufig sind.', 'Ich bitte ergebenst um Stellungnahme.'],
    'Register and style in German',
    [('die Auskunft','information'),('die Stellungnahme','statement'),('die Erwiderung','rebuttal'),('die Bekundung','declaration'),('ergebenst','respectfully (formal)'),('der Ansatz','approach'),('vorläufig','preliminary'),('die Reform','reform'),('die Berichterstattung','reporting'),('die indirekte Rede','reported speech')],
    [('Change to reported speech: "Die Reform ist notwendig"','Die Reform sei notwendig'),('What does "ergebenst" indicate?','formal/respectful register')],
    'In formellen Kontexten wird in der indirekten Rede der Konjunktiv I verwendet: "Er sagte, die Ergebnisse seien signifikant." Bei Zweideutigkeit greift man auf Konjunktiv II zurück: "Sie behauptete, sie hätten die Studie abgeschlossen." Der Wechsel zwischen Konjunktiv I und II ist typisch für C1-Niveau.',
    'Welche Konjunktivform für indirekte Rede?',
    ['Konjunktiv II nur','Konjunktiv I','Indikativ','Imperativ'],
    'Konjunktiv I',
    'Wann verwendet man Konjunktiv II in indirekter Rede?',
    ['bei positiven Aussagen','bei Zweideutigkeit','immer','nie'],
    'bei Zweideutigkeit',
    'A: Hast du die Nachrichten gehört? Der Kanzler sagte, die Wirtschaft wachse langsamer als erwartet. B: Ja, er hat den Konjunktiv I korrekt verwendet. Das klingt seriös und distanziert zugleich.',
    'Warum verwendete der Kanzler Konjunktiv I?',
    ['um zu übertreiben','für seriöse distanzierte Berichterstattung','weil er unsicher war','für Umgangssprache'],
    'für seriöse distanzierte Berichterstattung',
    'Write a formal press release and an informal summary of the same event.',
    'Explain the difference between formal and informal register to a learner.',
    'die indirekte Rede, der Konjunktiv, die Stellungnahme, das Register')

add('C1', 8,
    'Kritische Diskursanalyse',
    'Critically analyze political and media discourse.',
    'Die kritische Diskursanalyse nach Fairclough untersucht, wie Sprache Machtverhältnisse konstruiert. Wichtige Konzepte: Diskurs, Ideologie, Hegemonie, Framing. Ein politischer Text verwendet gezielte Wortwahl: "Sparmaßnahmen" klingt neutraler als "Kürzungen", "Reformen" positiver als "Einschnitte".',
    ['Sprache konstruiert Wirklichkeit.', 'Der Begriff "Reform" impliziert Fortschritt.', 'Framing beeinflusst die Wahrnehmung.', 'Diskursanalyse deckt Machtstrukturen auf.'],
    'Critical discourse analysis vocabulary',
    [('der Diskurs','discourse'),('die Ideologie','ideology'),('die Hegemonie','hegemony'),('das Framing','framing'),('die Machtstruktur','power structure'),('die Wortwahl','word choice'),('implizieren','to imply'),('konstruieren','to construct'),('die Wahrnehmung','perception'),('die Manipulation','manipulation')],
    [('Translate: "Language constructs reality"','Sprache konstruiert Wirklichkeit'),('What does "das Framing" mean in discourse analysis?','framing bias in language')],
    'Ein Vergleich zweier Zeitungsartikel zur selben Steuerreform zeigt deutliche Unterschiede: Während die eine Zeitung von "Entlastung für Bürger" spricht, titelt die andere "Steuergeschenke für Reiche". Beide beschreiben denselben Sachverhalt, aber das Framing erzeugt gegensätzliche Assoziationen. Die kritische Diskursanalyse deckt diese Strategien auf.',
    'Was vergleicht der Text?',
    ['zwei verschiedene Gesetze','Framing zweier Artikel zur selben Reform','zwei Länder','zwei Zeitungssprachen'],
    'Framing zweier Artikel zur selben Reform',
    'Was ist das Ziel kritischer Diskursanalyse?',
    ['Grammatik lehren','Machtstrukturen aufdecken','Texte übersetzen','Wörter definieren'],
    'Machtstrukturen aufdecken',
    'A: Die Presse ist doch objektiv! B: Aber sieh dir die Wortwahl an. "Flüchtlingsstrom" klingt bedrohlich, "Migrationsbewegung" ist neutral. Das ist Framing.',
    'Warum ist "Flüchtlingsstrom" laut B problematisch?',
    ['falsche Grammatik','bedrohliche Konnotation','zu lang','veraltet'],
    'bedrohliche Konnotation',
    'Analyze two news articles on the same topic for framing differences.',
    'Present and discuss your discourse analysis.',
    'der Diskurs, das Framing, die Ideologie, die Wortwahl, die Wahrnehmung')

add('C1', 9,
    'Literaturinterpretation',
    'Interpret German literary texts at an advanced level.',
    'Literaturinterpretation erfordert genaue Textanalyse und Kenntnis literarischer Mittel: Metapher (metaphor), Symbol, Allegorie, Ironie, Leitmotiv. Die Epochen der deutschen Literatur: Klassik (Goethe, Schiller), Romantik (Novalis, Eichendorff), Moderne (Kafka, Mann).',
    ['Goethes Faust ist ein Schlüsselwerk der Weltliteratur.', 'Kafkas Erzählungen sind vieldeutig.', 'Die Romantik betont das Gefühl.', 'Ein Leitmotiv durchzieht das gesamte Werk.'],
    'Literary analysis vocabulary',
    [('die Metapher','metaphor'),('das Symbol','symbol'),('die Allegorie','allegory'),('die Ironie','irony'),('das Leitmotiv','leitmotif'),('die Interpretation','interpretation'),('die Epoche','epoch'),('der Roman','novel'),('das Gedicht','poem'),('die Erzählung','narrative')],
    [('Translate: "the guiding motif"','das Leitmotiv'),('What does "die Allegorie" mean?','allegory')],
    'Franz Kafkas Erzählung "Die Verwandlung" beginnt mit dem Satz: "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheuren Ungeziefer verwandelt." Dieser berühmte Anfang ist eine Metapher für Entfremdung und Identitätsverlust in der modernen Arbeitswelt. Die Verwandlung ist zugleich wörtlich und symbolisch zu verstehen.',
    'Worauf ist Gregor Samsas Verwandlung eine Metapher?',
    ['Tierliebe','Entfremdung in der Arbeitswelt','Schlafstörungen','Familienleben'],
    'Entfremdung in der Arbeitswelt',
    'Wie ist die Verwandlung zu verstehen?',
    ['nur wörtlich','nur symbolisch','wörtlich und symbolisch','weder noch'],
    'wörtlich und symbolisch',
    'A: Ich finde Kafka schwer zu verstehen. B: Man muss nicht alles erklären können. Kafka wollte, dass seine Texte vieldeutig bleiben. Das macht die Faszination aus.',
    'Warum findet B Kafka faszinierend?',
    ['weil alles klar ist','weil die Texte vieldeutig sind','weil es Spannung gibt','weil es lustig ist'],
    'weil die Texte vieldeutig sind',
    'Write an interpretation of a short German poem or text.',
    'Present the analysis of a literary device in a German text.',
    'die Metapher, das Symbol, das Leitmotiv, die Interpretation, der Roman')

add('C1', 10,
    'Wirtschaftsdeutsch und Verhandlungen',
    'Conduct business negotiations in German.',
    'Verhandlungssprache auf C1-Niveau: "Ich bitte um Verständnis, dass wir an dieser Position festhalten müssen." "Können Sie uns in diesem Punkt entgegenkommen?" "Wir sehen hier noch Verhandlungsspielraum." Wichtige Konzepte: die Kompromissfindung, der Interessensausgleich, die Win-Win-Situation.',
    ['Wir sehen hier noch Verhandlungsspielraum.', 'Können Sie uns entgegenkommen?', 'An dieser Position müssen wir festhalten.', 'Ein Kompromiss wäre im beiderseitigen Interesse.'],
    'Business negotiation vocabulary',
    [('die Verhandlung','negotiation'),('der Verhandlungsspielraum','negotiating room'),('der Kompromiss','compromise'),('entgegenkommen','to accommodate'),('festhalten an','to insist on'),('der Interessensausgleich','balance of interests'),('die Win-Win-Situation','win-win situation'),('die Konditionen','terms'),('das Angebot','offer'),('die Absichtserklärung','letter of intent')],
    [('Translate: "negotiating room"','Verhandlungsspielraum'),('What does "entgegenkommen" mean in negotiations?','to accommodate')],
    'Bei internationalen Verhandlungen ist kulturelle Sensibilität entscheidend. Deutsche Verhandler gelten als direkt, sachlich und gut vorbereitet. Sie erwarten klare Fakten und Argumente. Small Talk ist weniger wichtig als in anderen Kulturen. Die Unterschrift unter einem Vertrag wird als verbindlich betrachtet.',
    'Wie gelten deutsche Verhandler?',
    ['emotional und spontan','direkt, sachlich, gut vorbereitet','unverbindlich','vage'],
    'direkt, sachlich, gut vorbereitet',
    'Was ist bei deutschen Verhandlungen weniger wichtig?',
    ['Fakten','Small Talk','Verträge','Vorbereitung'],
    'Small Talk',
    'A: Die Verhandlungen mit den deutschen Partnern waren sehr effizient. B: Ja, sie kommen schnell zum Punkt. Aber man muss sehr gut vorbereitet sein, sonst macht man keine gute Figur.',
    'Was ist entscheidend für Verhandlungen mit Deutschen?',
    ['gutes Essen','gute Vorbereitung','Small Talk','Geschenke'],
    'gute Vorbereitung',
    'Draft a negotiation strategy for a business scenario.',
    'Role-play a business negotiation in German.',
    'die Verhandlung, der Kompromiss, das Angebot, die Konditionen')

add('C1', 11,
    'Kognitive Linguistik',
    'Understand cognitive linguistics and language acquisition.',
    'Kognitive Linguistik erforscht, wie Sprache das Denken beeinflusst. Die Sapir-Whorf-Hypothese besagt, dass Sprache unsere Wahrnehmung der Realität formt. Metaphern sind nicht nur Sprachschmuck, sondern Denkmuster: "Zeit ist Geld", "Argumente sind Krieg".',
    ['Sprache formt unser Denken.', 'Metaphern sind kognitive Konzepte.', 'Die Sapir-Whorf-Hypothese ist umstritten.', 'Jede Sprache hat eine eigene Weltsicht.'],
    'Cognitive linguistics vocabulary',
    [('die Kognition','cognition'),('die Linguistik','linguistics'),('die Wahrnehmung','perception'),('die Hypothese','hypothesis'),('das Konzept','concept'),('die Metapher','metaphor'),('das Denkmuster','thought pattern'),('die Weltsicht','worldview'),('umstritten','controversial'),('beeinflussen','to influence')],
    [('Translate: "cognitive linguistics"','die kognitive Linguistik'),('What is the Sapir-Whorf hypothesis?','language shapes thought')],
    'Die Sapir-Whorf-Hypothese unterscheidet zwischen einer starken Version (linguistischer Determinismus: Sprache bestimmt Denken) und einer schwachen Version (linguistische Relativität: Sprache beeinflusst Denken). Die starke Version gilt heute als widerlegt, aber die schwache Version wird durch zahlreiche Studien gestützt. So haben verschiedene Sprachen unterschiedliche Farbkategorien, die die Farbwahrnehmung beeinflussen.',
    'Welche Version der Hypothese gilt als widerlegt?',
    ['schwache Version','starke Version','beide','keine'],
    'starke Version',
    'Was beeinflusst Sprache laut schwacher Version?',
    ['alles Denken','nur Grammatik','Farbwahrnehmung','mathematische Fähigkeiten'],
    'Farbwahrnehmung',
    'A: Findest du, dass Deutsch das Denken anders prägt als Englisch? B: Ja, definitiv. Deutsche Sätze können länger sein, bevor der Hauptsatz kommt. Das könnte analytisches Denken fördern.',
    'Was sagt B über deutsche Sätze?',
    ['sie sind kurz','sie können lang sein vor dem Hauptsatz','sie haben keine Grammatik','sie sind einfach'],
    'sie können lang sein vor dem Hauptsatz',
    'Write about how your native language influences your thinking.',
    'Discuss: Does language shape thought or vice versa?',
    'die Kognition, die Linguistik, die Hypothese, die Metapher, die Wahrnehmung')

add('C1', 12,
    'Jura: Rechtsphilosophie',
    'Discuss legal philosophy and fundamental rights.',
    'Rechtsphilosophie fragt nach dem Wesen des Rechts: Naturrecht vs. Rechtspositivismus. Naturrecht: Es gibt übergeordnete moralische Prinzipien. Rechtspositivismus: Recht ist, was gesetzt ist. Das Grundgesetz verankert die Menschenwürde als oberstes Prinzip (Art. 1 GG).',
    ['Die Menschenwürde ist unantastbar.', 'Naturrecht beruft sich auf universelle Prinzipien.', 'Der Rechtspositivismus trennt Recht und Moral.', 'Das Grundgesetz steht über einfachen Gesetzen.'],
    'Legal philosophy vocabulary',
    [('die Rechtsphilosophie','legal philosophy'),('das Naturrecht','natural law'),('der Rechtspositivismus','legal positivism'),('die Menschenwürde','human dignity'),('das Grundgesetz','basic law'),('universell','universal'),('der Grundsatz','principle'),('das Urteil','judgment'),('die Gerechtigkeit','justice'),('die Norm','norm')],
    [('Translate: "human dignity is inviolable"','Die Menschenwürde ist unantastbar'),('What does "Rechtspositivismus" mean?','legal positivism')],
    'Nach dem Zweiten Weltkrieg wurde das Grundgesetz bewusst als wehrhafte Demokratie konzipiert. Art. 1 GG: "Die Würde des Menschen ist unantastbar. Sie zu achten und zu schützen ist Verpflichtung aller staatlichen Gewalt." Diese Formulierung ist eine Absage an den Rechtspositivismus der NS-Zeit, wo "Recht" war, was der Gesetzgeber bestimmte.',
    'Warum wurde das Grundgesetz als wehrhafte Demokratie konzipiert?',
    ['wegen wirtschaftlicher Gründe','wegen der NS-Erfahrung','wegen der EU','wegen des Kalten Krieges'],
    'wegen der NS-Erfahrung',
    'Was ist die Verpflichtung aus Art. 1 GG?',
    ['Steuern zahlen','Würde achten und schützen','Wahlen durchführen','Gesetze erlassen'],
    'Würde achten und schützen',
    'A: Kann ein Gesetz ungerecht sein, wenn es korrekt erlassen wurde? B: Ja, dann ist es legal, aber nicht legitim. Die Menschenwürde setzt dem Gesetzgeber Grenzen.',
    'Was setzt dem Gesetzgeber Grenzen?',
    ['die Wirtschaft','die Menschenwürde','die Parteien','der Bundesrat'],
    'die Menschenwürde',
    'Write an essay on the relationship between law and morality.',
    'Discuss: Can a law be just but illegal, or unjust but legal?',
    'die Rechtsphilosophie, die Menschenwürde, das Grundgesetz, die Gerechtigkeit')

add('C1', 13,
    'Medizinethik',
    'Discuss advanced medical ethics issues.',
    'Medizinethik befasst sich mit Fragen am Lebensanfang und -ende: Pränataldiagnostik, Sterbehilfe, Organspende, Patientenautonomie. Zentrale Prinzipien: Autonomie, Fürsorge, Nichtschaden, Gerechtigkeit. Der hippokratische Eid verpflichtet Ärzte, keinen Schaden zuzufügen.',
    ['Die Patientenautonomie ist ein hohes Gut.', 'Aktive Sterbehilfe ist in Deutschland verboten.', 'Die Organspende wirft ethische Fragen auf.', 'Die Pränataldiagnostik erfordert verantwortungsvollen Umgang.'],
    'Medical ethics vocabulary',
    [('die Medizinethik','medical ethics'),('die Autonomie','autonomy'),('die Fürsorge','care'),('die Sterbehilfe','euthanasia'),('die Organspende','organ donation'),('die Pränataldiagnostik','prenatal diagnosis'),('der hippokratische Eid','Hippocratic Oath'),('die Patientenverfügung','advance directive'),('die Würde','dignity'),('einwilligen','to consent')],
    [('Translate: "patient autonomy"','die Patientenautonomie'),('What does "Sterbehilfe" mean?','euthanasia/assisted suicide')],
    'In Deutschland ist aktive Sterbehilfe (§ 216 StGB) verboten, aber die Hilfe zur Selbsttötung ist legal, solange sie nicht geschäftsmäßig angeboten wird. Die Patientenverfügung ermöglicht es, medizinische Behandlungen im Voraus abzulehnen. Der Bundesgerichtshof hat die Rechte von Patienten in diesem Bereich mehrfach gestärkt.',
    'Was sagt § 216 StGB zur aktiven Sterbehilfe?',
    ['sie ist legal','sie ist verboten','sie ist vorgeschrieben','nicht geregelt'],
    'sie ist verboten',
    'Was ermöglicht die Patientenverfügung?',
    ['Vermögen verwalten','Behandlungen ablehnen','Operationen durchführen','Medikamente verschreiben'],
    'Behandlungen ablehnen',
    'A: Was hältst du von Sterbehilfe? B: Ein sehr schwieriges Thema. Ich bin für Selbstbestimmung, aber ich verstehe auch die Sorgen vor Missbrauch.',
    'Was ist B\'s Haltung zur Sterbehilfe?',
    ['eindeutig dagegen','dafür mit Verständnis für Missbrauchssorgen','egal','keine Meinung'],
    'dafür mit Verständnis für Missbrauchssorgen',
    'Write an essay on the ethics of assisted suicide.',
    'Debate the pros and cons of organ donation opt-out systems.',
    'die Medizinethik, die Autonomie, die Sterbehilfe, die Patientenverfügung')

add('C1', 14,
    'Nachhaltigkeitsethik',
    'Discuss environmental ethics and intergenerational justice.',
    'Nachhaltigkeitsethik fragt nach der Verantwortung gegenüber zukünftigen Generationen. Der deutsche Philosoph Hans Jonas formulierte den "ökologischen Imperativ": Handle so, dass die Wirkungen deines Handelns verträglich sind mit der Permanenz echten menschlichen Lebens auf Erden.',
    ['Wir tragen Verantwortung für zukünftige Generationen.', 'Der ökologische Imperativ verlangt vorausschauendes Handeln.', 'Die Grenzen des Wachstums sind erreicht.', 'Nachhaltigkeit erfordert strukturelle Veränderungen.'],
    'Environmental ethics vocabulary',
    [('die Nachhaltigkeitsethik','sustainability ethics'),('die Verantwortung','responsibility'),('die zukünftige Generation','future generation'),('der Imperativ','imperative'),('die Permanenz','permanence'),('vorausschauend','forward-looking'),('die Struktur','structure'),('die Transformation','transformation'),('die Ressource','resource'),('die Begrenzung','limitation')],
    [('Translate: "intergenerational justice"','die Generationengerechtigkeit'),('Who formulated the "ecological imperative"?','Hans Jonas')],
    'Hans Jonas\' Hauptwerk "Das Prinzip Verantwortung" (1979) begründet eine Ethik für die technologische Zivilisation. Seine These: Die Reichweite menschlichen Handelns ist so groß geworden, dass die traditionelle Ethik nicht mehr ausreicht. Wir müssen die Fernwirkungen unseres Tuns bedenken. Besonders bekannt ist sein "Heuristik der Furcht": Wir sollten uns das Schlimmste vorstellen, um das Beste zu schützen.',
    'Womit begründet Jonas seine Ethik?',
    ['mit Religion','mit der Reichweite menschlichen Handelns','mit Wirtschaft','mit Tradition'],
    'mit der Reichweite menschlichen Handelns',
    'Was ist die "Heuristik der Furcht"?',
    ['Angst haben','sich das Schlimmste vorstellen, um das Beste zu schützen','Kriege vermeiden','traditionelle Werte bewahren'],
    'sich das Schlimmste vorstellen, um das Beste zu schützen',
    'A: Warum sollen wir auf die Umwelt achten? B: Nicht nur für uns, sondern für die, die nach uns kommen. Hans Jonas hat das gut formuliert: Die Zukunft der Menschheit hängt von unserer Verantwortung ab.',
    'Was ist laut B der Grund für Umweltschutz?',
    ['nur für uns selbst','für zukünftige Generationen','für die Wirtschaft','für die Politik'],
    'für zukünftige Generationen',
    'Write an essay on intergenerational justice and sustainability.',
    'Discuss: How can the ecological imperative guide policy today?',
    'die Nachhaltigkeitsethik, die Verantwortung, der Imperativ, die Transformation')

add('C1', 15,
    'Kulturkritik und Gesellschaftsanalyse',
    'Critically analyze culture and society.',
    'Die Frankfurter Schule (Adorno, Horkheimer, Habermas) prägte die Kulturkritik. Begriffe: die Kulturindustrie, die instrumentelle Vernunft, der autoritäre Charakter, die Dialektik der Aufklärung. Kultur wird zur Ware, Kunst verliert ihre kritische Funktion.',
    ['Die Kulturindustrie produziert standardisierte Ware.', 'Adorno kritisierte die Vermarktung von Kunst.', 'Habermas entwickelte die Theorie des kommunikativen Handelns.', 'Die Dialektik der Aufklärung analysiert den Fortschritt.'],
    'Culture critique vocabulary',
    [('die Kulturkritik','culture critique'),('die Kulturindustrie','culture industry'),('die instrumentelle Vernunft','instrumental reason'),('der autoritäre Charakter','authoritarian character'),('die Aufklärung','Enlightenment'),('die Dialektik','dialectics'),('das kommunikative Handeln','communicative action'),('die Ware','commodity'),('die Manipulation','manipulation'),('die Emanzipation','emancipation')],
    [('Translate: "culture industry"','die Kulturindustrie'),('What is Habermas known for?','theory of communicative action')],
    'Adorno und Horkheimer argumentieren in der "Dialektik der Aufklärung", dass der Fortschritt der Vernunft in sein Gegenteil umschlägt. Statt Emanzipation bringt die instrumentelle Vernunft neue Formen der Unterdrückung. Die Kulturindustrie produziert standardisierte Inhalte, die das Bewusstsein manipulieren und Konformität fördern.',
    'Worin schlägt der Fortschritt der Vernunft um?',
    ['in Technologie','in sein Gegenteil','in Wirtschaftswachstum','in Demokratie'],
    'in sein Gegenteil',
    'Was produziert die Kulturindustrie?',
    ['individuelle Kunst','standardisierte Inhalte','Politische Bildung','Wissenschaft'],
    'standardisierte Inhalte',
    'A: Ist Netflix auch Kulturindustrie? B: Ja, teilweise. Es gibt gute Serien, aber vieles ist nach Schema F produziert, um uns zu berieseln. Adorno würde das kritisieren.',
    'Was kritisiert B an Netflix?',
    ['es ist zu teuer','vieles ist nach Schema F produziert','es gibt zu wenig Filme','es ist illegal'],
    'vieles ist nach Schema F produziert',
    'Write a cultural critique of streaming platforms or social media.',
    'Discuss: Has art lost its critical function in the digital age?',
    'die Kulturkritik, die Kulturindustrie, die instrumentelle Vernunft, die Dialektik')

all_lessons = existing + new_lessons
print(f"New added: {added}")
counts = {}
for l in all_lessons:
    counts[l['level']] = counts.get(l['level'], 0) + 1
print(f"By level: {json.dumps(counts)}")
print(f"Total: {len(all_lessons)}")
with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(all_lessons, f, ensure_ascii=False, indent=2)
print("Written.")
