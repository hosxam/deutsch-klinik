#!/usr/bin/env python3
"""Generate C1 lessons 16-25 (second 10 of 20)."""
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

# ===== C1 LESSONS 16-25 =====

add('C1', 16,
    'Phänomenologie und Existenzialismus',
    'Understand phenomenology and existentialist philosophy.',
    'Phänomenologie (Husserl): "Zu den Sachen selbst" bedeutet, Phänomene ohne Vorurteile zu beschreiben. Existenzialismus (Sartre): "Existenz kommt vor Essenz" bedeutet, der Mensch ist frei, sich selbst zu definieren. Heidegger: Das "Dasein" ist ein In-der-Welt-Sein.',
    ['Zu den Sachen selbst. (Husserl)', 'Existenz kommt vor Essenz. (Sartre)', 'Der Mensch ist zur Freiheit verurteilt. (Sartre)', 'Das Dasein ist In-der-Welt-Sein. (Heidegger)'],
    'Phenomenology and existentialism vocabulary',
    [('die Phänomenologie','phenomenology'),('der Existenzialismus','existentialism'),('das Dasein','being/existence'),('die Essenz','essence'),('das Phänomen','phenomenon'),('die Freiheit','freedom'),('die Verantwortung','responsibility'),('das Bewusstsein','consciousness'),('die Absurdität','absurdity'),('die Authentizität','authenticity')],
    [('Translate: "Existence precedes essence"','Existenz kommt vor Essenz'),('What does "Dasein" mean for Heidegger?','being-in-the-world')],
    'Jean-Paul Sartres Hauptwerk "Das Sein und das Nichts" analysiert das menschliche Bewusstsein. Für Sartre ist der Mensch "zur Freiheit verurteilt": Wir können nicht nicht wählen. Diese Freiheit ist eine Last, die Angst (angoisse) erzeugt. Viele Menschen fliehen in die "Unaufrichtigkeit" (mauvaise foi), indem sie so tun, als hätten sie keine Wahl.',
    'Wie bezeichnet Sartre die Freiheit des Menschen?',
    ['ein Geschenk','eine Last und Verurteilung','eine Illusion','eine Option'],
    'eine Last und Verurteilung',
    'Was ist "Unaufrichtigkeit" bei Sartre?',
    ['ehrlich sein','tun, als hätte man keine Wahl','seine Pflicht tun','anderen helfen'],
    'tun, als hätte man keine Wahl',
    'A: Ich musste diesen Job nehmen. B: Sartre würde sagen: Du hast dich dafür entschieden. Sag nicht "ich musste", sag "ich habe gewählt". Das ist Verantwortung.',
    'Was würde Sartre laut B zu der Aussage "ich musste" sagen?',
    ['das stimmt','du hast gewählt, übernimm Verantwortung','es ist egal','höhere Gewalt'],
    'du hast gewählt, übernimm Verantwortung',
    'Write an existentialist analysis of a life decision.',
    'Discuss: Are humans truly free or determined by circumstances?',
    'der Existenzialismus, das Dasein, die Freiheit, die Verantwortung, die Authentizität')

add('C1', 17,
    'Psycholinguistik und Sprachstörungen',
    'Study psycholinguistics and language disorders.',
    'Psycholinguistik erforscht die kognitiven Prozesse des Sprachverstehens und -produzierens. Broca-Aphasie: gestörte Sprachproduktion bei erhaltenem Verständnis. Wernicke-Aphasie: flüssige aber sinnlose Sprache mit gestörtem Verständnis. Der Bates-MacWhinney-Ansatz erklärt den Spracherwerb durch Wettbewerb zwischen Cues.',
    ['Broca-Aphasie betrifft die Sprachproduktion.', 'Wernicke-Aphasie betrifft das Sprachverständnis.', 'Spracherwerb ist ein kognitiver Wettbewerb.', 'Das mentale Lexikon organisiert Wortwissen.'],
    'Psycholinguistics vocabulary',
    [('die Psycholinguistik','psycholinguistics'),('die Aphasie','aphasia'),('das Sprachverständnis','language comprehension'),('die Sprachproduktion','language production'),('der Spracherwerb','language acquisition'),('das mentale Lexikon','mental lexicon'),('der Cue','cue'),('die Kognition','cognition'),('das Gehirn','brain'),('die Störung','disorder')],
    [('Translate: "speech production disorder"','die Sprachproduktionsstörung'),('What is Broca\'s aphasia?','impaired speech production')],
    'Die Aphasieforschung hat viel zum Verständnis der Sprachverarbeitung beigetragen. Patienten mit Broca-Aphasie sprechen in Telegrammstil: "Gehen... Arzt... heute." Sie verstehen aber komplexe Sätze. Wernicke-Patienten produzieren flüssige Sätze, die jedoch semantisch leer oder unsinnig sind: "Ich habe das mit dem Ding, wissen Sie."',
    'Wie sprechen Broca-Patienten?',
    ['flüssig und komplex','im Telegrammstil','sehr laut','gar nicht'],
    'im Telegrammstil',
    'Was ist charakteristisch für Wernicke-Patienten?',
    ['keine Sprache','flüssige aber sinnlose Sprache','nur flüstern','nur schreiben'],
    'flüssige aber sinnlose Sprache',
    'A: Mein Großvater hatte nach dem Schlaganfall eine Aphasie. B: Welche Art? A: Broca. Er konnte kaum sprechen, aber er hat alles verstanden. Das war frustrierend für ihn.',
    'Was konnte der Großvater trotz Aphasie?',
    ['fließend sprechen','alles verstehen','schreiben','singen'],
    'alles verstehen',
    'Write an essay on how language is processed in the brain.',
    'Explain the difference between Broca and Wernicke aphasia.',
    'die Psycholinguistik, die Aphasie, der Spracherwerb, die Kognition')

add('C1', 18,
    'Politische Philosophie der Moderne',
    'Analyze modern political philosophy.',
    'John Rawls\' "Theorie der Gerechtigkeit" (1971) verwendet den Schleier des Nichtwissens: In einer hypothetischen Ursprungssituation wählen Menschen faire Prinzipien, weil sie nicht wissen, welche Position sie in der Gesellschaft einnehmen werden. Zwei Prinzipien: gleiche Grundfreiheiten und soziales Ungleichgewicht nur zum Vorteil aller.',
    ['Der Schleier des Nichtwissens garantiert Fairness.', 'Gerechtigkeit ist Fairness.', 'Ungleichheit ist nur legitim, wenn sie allen nützt.', 'Grundfreiheiten sind unveräußerlich.'],
    'Political philosophy vocabulary',
    [('die Gerechtigkeit','justice'),('der Schleier des Nichtwissens','veil of ignorance'),('die Fairness','fairness'),('das Prinzip','principle'),('die Grundfreiheit','basic liberty'),('die Ungleichheit','inequality'),('legitim','legitimate'),('der Urzustand','original position'),('der Vertrag','contract'),('die Gesellschaft','society')],
    [('Translate: "veil of ignorance"','der Schleier des Nichtwissens'),('What is Rawls\' first principle?','equal basic liberties')],
    'Rawls\' Theorie fordert, dass soziale und wirtschaftliche Ungleichheiten zwei Bedingungen erfüllen müssen: Sie müssen mit Ämtern verbunden sein, die allen offen stehen (faire Chancengleichheit), und sie müssen den am wenigsten Begünstigten den größten Vorteil bringen (Differenzprinzip). Dies ist eine Alternative zum Utilitarismus.',
    'Was fordert das Differenzprinzip?',
    ['Gleichheit für alle','Vorteil für die am wenigsten Begünstigten','Reichtum für alle','Wachstum um jeden Preis'],
    'Vorteil für die am wenigsten Begünstigten',
    'Wogegen ist Rawls\' Theorie eine Alternative?',
    ['Libertarismus','Utilitarismus','Kommunismus','Anarchismus'],
    'Utilitarismus',
    'A: Ist Ungleichheit immer ungerecht? B: Rawls sagt: nein, nur wenn sie den Ärmsten nicht nützt. Wenn die Reichen reicher werden und die Armen auch profitieren, kann das fair sein.',
    'Wann ist Ungleichheit laut Rawls fair?',
    ['nie','wenn die Ärmsten auch profitieren','wenn alle gleich sind','wenn der Staat eingreift'],
    'wenn die Ärmsten auch profitieren',
    'Write an essay applying Rawls\' theory to a current political issue.',
    'Debate: Is inequality always unjust?',
    'die Gerechtigkeit, der Schleier des Nichtwissens, die Fairness, das Prinzip')

add('C1', 19,
    'Tempus und Aspekt im Deutschen',
    'Master tense and aspect distinctions in German.',
    'Deutsch unterscheidet Tempus (Zeitstufe) und Aspekt (Verlaufsform/Perfectivity) weniger explizit als Slawisch oder Englisch. Dennoch gibt es Aspektunterschiede: "Er schrieb" (Präteritum, abgeschlossen) vs. "Er hat geschrieben" (Perfekt, resultatsbezogen). Der am-Progressiv: "Er ist am Arbeiten" (Verlaufsform, süßdeutsch).',
    ['Er arbeitet seit drei Jahren hier.', 'Er war am Arbeiten, als ich kam.', 'Sie hatte das Buch schon gelesen.', 'Wenn ich das gewusst hätte, wäre ich gekommen.'],
    'Tense and aspect in German',
    [('das Tempus','tense'),('der Aspekt','aspect'),('das Präteritum','preterite'),('das Perfekt','perfect'),('der Progressiv','progressive'),('das Plusquamperfekt','pluperfect'),('der Konjunktiv','subjunctive'),('das Futur','future'),('abgeschlossen','completed'),('resultatsbezogen','result-oriented')],
    [('Translate: "He is working" (progressive)','Er ist am Arbeiten'),('What is the difference between Präteritum and Perfekt?','Präteritum=narrative past, Perfekt=result-focused')],
    'Die Unterscheidung zwischen Präteritum und Perfekt ist im Deutschen komplexer geworden. Im Norden bevorzugt man das Präteritum in der Schriftsprache ("Er ging"), im Süden auch mündlich das Perfekt ("Er ist gegangen"). Der am-Progressiv ("Ich bin am Überlegen") breitet sich aus, gilt aber umgangssprachlich. Für C1 ist das Plusquamperfekt für Vorzeitigkeit in Erzählungen wichtig.',
    'Welche Tempusform bevorzugt der Norden in der Schriftsprache?',
    ['Perfekt','Präteritum','Plusquamperfekt','Futur II'],
    'Präteritum',
    'Was breitet sich im Deutschen aus?',
    ['Futur II','am-Progressiv','Imperfekt','Konjunktiv I'],
    'am-Progressiv',
    'A: Warum sagt man "Ich hab dich lieb" und nicht "Ich habe dich lieb"? B: Das ist eine regionale und stilistische Sache. Mündlich wird Perfekt häufiger, aber die Präteritum-Form "hatte" bleibt im Plusquamperfekt.',
    'Wann verwendet man Plusquamperfekt?',
    ['für die Zukunft','für Vorzeitigkeit in Erzählungen','für Befehle','für Wünsche'],
    'für Vorzeitigkeit in Erzählungen',
    'Write a narrative using multiple tenses correctly.',
    'Explain the difference between Präteritum and Perfekt to a learner.',
    'das Tempus, der Aspekt, das Präteritum, das Perfekt, der Progressiv')

add('C1', 20,
    'Wissenschaftssoziologie',
    'Understand the sociology of science.',
    'Wissenschaftssoziologie untersucht, wie wissenschaftliches Wissen sozial konstruiert wird. Thomas Kuhns "Struktur wissenschaftlicher Revolutionen": Wissenschaft entwickelt sich durch Paradigmenwechsel. Ein Paradigma ist ein geteilter Rahmen von Annahmen. Neue Paradigmen setzen sich nicht nur durch Fakten durch, sondern durch soziale Prozesse.',
    ['Wissenschaftliche Revolutionen verändern Paradigmen.', 'Ein Paradigma prägt die Forschung.', 'Normale Wissenschaft löst Rätsel im Paradigma.', 'Paradigmenwechsel sind nicht rein rational.'],
    'Sociology of science vocabulary',
    [('die Wissenschaftssoziologie','sociology of science'),('das Paradigma','paradigm'),('der Paradigmenwechsel','paradigm shift'),('die Revolution','revolution'),('die normale Wissenschaft','normal science'),('das Rätsel','puzzle'),('der Rahmen','framework'),('die Annahme','assumption'),('der Konsens','consensus'),('das Falsifikationsprinzip','falsification principle')],
    [('Translate: "paradigm shift"','der Paradigmenwechsel'),('Who wrote "The Structure of Scientific Revolutions"?','Thomas Kuhn')],
    'Thomas Kuhn argumentierte, dass Wissenschaft nicht kontinuierlich fortschreitet, sondern in Phasen verläuft: normale Wissenschaft (Rätsellösen im bestehenden Paradigma), Krise (Anomalien häufen sich), und Revolution (neues Paradigma setzt sich durch). Das neue Paradigma ist nicht einfach "wahrer", sondern inkommensurabel: Es sieht die Welt anders.',
    'Was passiert in der Phase der Krise?',
    ['neues Paradigma sofort','Anomalien häufen sich','alles ist normal','Forschung hört auf'],
    'Anomalien häufen sich',
    'Was bedeutet Inkommensurabilität?',
    ['Paradigmen sind vergleichbar','Paradigmen sehen die Welt anders','alles ist gleich','nur ein Paradigma ist richtig'],
    'Paradigmen sehen die Welt anders',
    'A: Aber die Wissenschaft findet doch die Wahrheit! B: Kuhn würde sagen: Die Wissenschaft wechselt nur ihre Brille. Was wir sehen, hängt von der Theorie ab, die wir tragen.',
    'Was meint B mit "Brille wechseln"?',
    ['neue Sehstärke','Paradigmenwechsel verändert die Perspektive','neue Mode','andere Farbe'],
    'Paradigmenwechsel verändert die Perspektive',
    'Write an essay on how scientific revolutions change our worldview.',
    'Discuss: Is science objective or socially constructed?',
    'das Paradigma, der Paradigmenwechsel, die Revolution, die Wissenschaftssoziologie')

add('C1', 21,
    'Semantik und Pragmatik',
    'Master semantics and pragmatics in German.',
    'Semantik untersucht die Bedeutung von Wörtern und Sätzen. Pragmatik untersucht die Bedeutung im Kontext. Grice\'sche Konversationsmaximen: Quantität (so informativ wie nötig), Qualität (wahr), Relation (relevant), Modalität (klar). Implikaturen sind Bedeutungen, die über das wörtlich Gesagte hinausgehen.',
    ['"Es zieht" impliziert: Mach das Fenster zu.', 'Die Maxime der Relevanz steuert Gespräche.', 'Wörtliche Bedeutung und Sprecherbedeutung können differieren.', 'Pragmatik erklärt, wie Kontext Bedeutung erzeugt.'],
    'Semantics and pragmatics vocabulary',
    [('die Semantik','semantics'),('die Pragmatik','pragmatics'),('die Implikatur','implicature'),('die Maxime','maxim'),('die Relevanz','relevance'),('der Kontext','context'),('die wörtliche Bedeutung','literal meaning'),('die Äußerung','utterance'),('die Konversation','conversation'),('die Inferenz','inference')],
    [('Translate: "conversational implicature"','die Konversationsimplikatur'),('What does "Es zieht" pragmatically imply?','close the window')],
    'Wenn jemand bei offenem Fenster sagt "Es zieht", ist die wörtliche Bedeutung eine Feststellung über Luftzug. Pragmatisch ist es aber eine Aufforderung, das Fenster zu schließen. H.P. Grice zeigte, dass Kommunikation durch Kooperationsprinzip und Maximen funktioniert. Verstöße gegen Maximen erzeugen besondere Implikaturen: Ironie, Metapher, Übertreibung.',
    'Welche Maxime wird durch "Es zieht" als Aufforderung verletzt?',
    ['Qualität','Modalität','keine, es ist eine Implikatur','Quantität'],
    'keine, es ist eine Implikatur',
    'Was erzeugen Verstöße gegen Maximen?',
    ['Missverständnisse','besondere Implikaturen (Ironie etc.)','Lügen','Schweigen'],
    'besondere Implikaturen (Ironie etc.)',
    'A: Kannst du mir helfen? B: Ich bin gerade beschäftigt. A: (wartet) B: Okay, ich komme. A hat verstanden: B hilft später, nicht jetzt.',
    'Was hat A aus B\'s Antwort inferiert?',
    ['B hilft nie','B hilft später','B ist weg','B ist sauer'],
    'B hilft später',
    'Write an analysis of pragmatic meaning in a short dialogue.',
    'Explain how context changes meaning with examples.',
    'die Semantik, die Pragmatik, die Implikatur, der Kontext, die Relevanz')

add('C1', 22,
    'Mediationsverfahren und Konfliktlösung',
    'Lead mediation and conflict resolution processes.',
    'Mediation ist ein strukturiertes Verfahren zur Konfliktlösung mit neutralem Dritten. Phasen: Eröffnung, Sammlung, Konfrontation, Lösung, Vereinbarung. Der Mediator ist allparteilich. Techniken: aktives Zuhören, Paraphrasieren, Ich-Botschaften, Fragetechniken.',
    ['Der Mediator ist allparteilich.', 'Aktives Zuhören ist die Basis.', 'Ich-Botschaften vermeiden Vorwürfe.', 'Die Lösung muss von den Parteien kommen.'],
    'Mediation vocabulary',
    [('die Mediation','mediation'),('der Mediator','mediator'),('der Konflikt','conflict'),('das Verfahren','process'),('die Allparteilichkeit','multi-partiality'),('aktives Zuhören','active listening'),('die Ich-Botschaft','I-message'),('paraphrasieren','to paraphrase'),('der Kompromiss','compromise'),('die Vereinbarung','agreement')],
    [('Translate: "active listening"','aktives Zuhören'),('What does "allparteilich" mean?','multi-partial, not neutral')],
    'Mediation unterscheidet sich von Gerichtsverfahren: Die Parteien entscheiden selbst über die Lösung. Der Mediator schafft einen geschützten Rahmen. Nach § 1 MediationsG ist Mediation ein vertrauliches Verfahren. Besonders in Familien- und Wirtschaftskonflikten ist Mediation erfolgreicher als ein Rechtsstreit, weil sie die Beziehung erhält.',
    'Was unterscheidet Mediation vom Gerichtsverfahren?',
    ['Mediator entscheidet','Parteien entscheiden selbst','Richter ist Vermittler','es gibt kein Gesetz'],
    'Parteien entscheiden selbst',
    'In welchen Konflikten ist Mediation besonders erfolgreich?',
    ['Nachbarschaft nur','Familien- und Wirtschaftskonflikten','Strafrecht','Verkehrsdelikten'],
    'Familien- und Wirtschaftskonflikten',
    'A: Wir streiten uns ständig über das Sorgerecht. B: Vielleicht wäre Mediation besser als vor Gericht. Der Mediator hilft euch, eine Lösung zu finden, mit der beide leben können.',
    'Was empfiehlt B?',
    ['vor Gericht gehen','Mediation','nichts tun','streiten'],
    'Mediation',
    'Write a mediation protocol for a fictional conflict.',
    'Role-play a mediation session.',
    'die Mediation, der Konflikt, der Mediator, die Vereinbarung, aktives Zuhören')

add('C1', 23,
    'Digital Humanities',
    'Explore digital humanities as an interdisciplinary field.',
    'Digital Humanities verbinden Informatik mit Geisteswissenschaften. Methoden: Text Mining, Korpuslinguistik, Netzwerkanalyse, digitale Editionen. große Textmengen werden algorithmisch analysiert. Stilometrie kann Autorschaft bestimmen. Kritik: Quantifizierung von Geisteswissenschaften ist umstritten.',
    ['Digital Humanities nutzen Algorithmen für Textanalyse.', 'Stilometrie kann Autorschaft bestimmen.', 'Korpora ermöglichen große Sprachstudien.', 'Die Digitalisierung verändert die Geisteswissenschaften.'],
    'Digital humanities vocabulary',
    [('die Digital Humanities','digital humanities'),('das Text Mining','text mining'),('die Korpuslinguistik','corpus linguistics'),('die Netzwerkanalyse','network analysis'),('die Stilometrie','stylometry'),('die Autorschaft','authorship'),('der Algorithmus','algorithm'),('das Korpus','corpus'),('die Quantifizierung','quantification'),('die Edition','edition')],
    [('Translate: "digital humanities"','die Digital Humanities'),('What does Stilometrie analyse?','writing style for authorship')],
    'Ein bekanntes Beispiel der Digital Humanities ist die Analyse der Federalist Papers: Durch Stilometrie konnte die Autorschaft der anonymen Artikel bestimmt werden. In der deutschen Literaturwissenschaft werden Korpora von Goethe, Schiller und Kafka maschinell analysiert, um Themen, Stilwandel und Einflüsse zu untersuchen.',
    'Welches Problem löste Stilometrie?',
    ['Grammatik korrigieren','Autorschaft bestimmen','Texte übersetzen','Bücher digitalisieren'],
    'Autorschaft bestimmen',
    'Welche deutschen Autoren werden maschinell analysiert?',
    ['nur Goethe','Goethe, Schiller, Kafka','nur moderne','nur Kinderbücher'],
    'Goethe, Schiller, Kafka',
    'A: Werden Computer bald Literatur interpretieren? B: Sie können Muster finden, die kein Mensch sieht. Aber Interpretation braucht Verstehen und Kontext, das können Maschinen nicht.',
    'Was können Maschinen laut B?',
    ['alles interpretieren','Muster finden, aber nicht interpretieren','gar nichts','besser interpretieren als Menschen'],
    'Muster finden, aber nicht interpretieren',
    'Write about how digital methods can enhance literary studies.',
    'Discuss the opportunities and risks of Digital Humanities.',
    'die Digital Humanities, das Text Mining, die Stilometrie, die Korpuslinguistik')

add('C1', 24,
    'Kunsttheorie und Ästhetik',
    'Understand art theory and aesthetics.',
    'Ästhetik fragt nach dem Wesen der Kunst und des Schönen. Kant: Das Schöne gefällt ohne Interesse. Hegel: Kunst ist das sinnliche Scheinen der Idee. Adorno: Kunst ist gesellschaftliches Bewusstsein und zugleich autonom. Benjamin: Das Kunstwerk im Zeitalter seiner technischen Reproduzierbarkeit verliert seine Aura.',
    ['Das Schöne gefällt ohne Interesse.', 'Kunst ist das sinnliche Scheinen der Idee.', 'Das Kunstwerk verliert seine Aura.', 'Kunst ist gesellschaftliches Bewusstsein.'],
    'Art theory vocabulary',
    [('die Ästhetik','aesthetics'),('die Kunsttheorie','art theory'),('die Aura','aura'),('die Reproduktion','reproduction'),('die Autonomie','autonomy'),('das Kunstwerk','work of art'),('das Schöne','the beautiful'),('das Erhabene','the sublime'),('die Avantgarde','avant-garde'),('die Institution','institution')],
    [('Translate: "the aura of the artwork"','die Aura des Kunstwerks'),('What does Kant say about beauty?','it pleases without interest')],
    'Walter Benjamin argumentierte in seinem berühmten Essay, dass die technische Reproduktion (Fotografie, Film) die Aura des Kunstwerks zerstört. Die Aura ist die Einmaligkeit und Echtheit des Originals, seine Anwesenheit an einem bestimmten Ort. Für Benjamin hatte dieser Verlust auch emanzipatorisches Potenzial: Kunst wird demokratischer.',
    'Was zerstört die Aura des Kunstwerks?',
    ['schlechte Kunst','technische Reproduktion','Zeit','Kritiker'],
    'technische Reproduktion',
    'Was ist das positive Potenzial des Aurverlusts?',
    ['Kunst wird teurer','Kunst wird demokratischer','Kunst verschwindet','Kunst wird elitärer'],
    'Kunst wird demokratischer',
    'A: Ein Poster ist doch nicht dasselbe wie das Originalgemälde. B: Benjamin würde sagen: Nein, das Original hat Aura. Aber durch Reproduktion kann jeder Kunst erleben, nicht nur im Museum.',
    'Welchen Vorteil sieht B in der Reproduktion?',
    ['keinen','jeder kann Kunst erleben','Originale sind wertvoller','Poster sind schöner'],
    'jeder kann Kunst erleben',
    'Write an essay on how digital reproduction changes art today.',
    'Discuss: Is a digital NFT art? Does it have aura?',
    'die Ästhetik, die Aura, das Kunstwerk, die Reproduktion, die Autonomie')

add('C1', 25,
    'Globale Gerechtigkeit',
    'Analyze theories of global justice.',
    'Globale Gerechtigkeit fragt, ob Prinzipien der Gerechtigkeit national oder global gelten. Cosmopolitanism (Pogge, Singer): Reiche Nationen haben Pflichten gegenüber armen. Nationalism (Rawls, Nagel): Gerechtigkeit gilt nur innerhalb von Staaten. Singer: Wenn wir ein Kind aus einem Teich retten können, müssen wir es tun - analog zur globalen Armut.',
    ['Singers Teich-Analogie verpflichtet zur Hilfe.', 'Kosmopolitismus fordert globale Verteilungsgerechtigkeit.', 'Nationalisten begrenzen Gerechtigkeit auf Staaten.', 'Globale Armut ist ein moralisches Versagen.'],
    'Global justice vocabulary',
    [('die globale Gerechtigkeit','global justice'),('der Kosmopolitismus','cosmopolitanism'),('der Nationalismus','nationalism/national approach'),('die Verteilungsgerechtigkeit','distributive justice'),('die Armut','poverty'),('die Verpflichtung','obligation'),('die Moral','morality'),('die Analogie','analogy'),('das Menschenrecht','human right'),('die Souveränität','sovereignty')],
    [('Translate: "global justice"','die globale Gerechtigkeit'),('What is Singer\'s pond analogy about?','obligation to help the poor')],
    'Peter Singer argumentiert: Wenn wir ein Kind, das in einem flachen Teich zu ertrinken droht, ohne Gefahr retten können, sind wir moralisch dazu verpflichtet. Genauso sind wir verpflichtet, gegen globale Armut zu handeln, solange wir unseren Lebensstandard nicht wesentlich einschränken müssen. Kritiker wenden ein, dass Distanz und Verantwortungskomplexität eine Rolle spielen.',
    'Was fordert Singers Teich-Analogie?',
    ['nur lokale Hilfe','moralische Verpflichtung zur Hilfe','keine Hilfe','staatliche Hilfe nur'],
    'moralische Verpflichtung zur Hilfe',
    'Was kritisieren Gegner an Singer?',
    ['er fordert zu viel','Distanz und Verantwortungskomplexität spielen eine Rolle','er ist zu konservativ','er ignoriert die Wirtschaft'],
    'Distanz und Verantwortungskomplexität spielen eine Rolle',
    'A: Sollten wir mehr für Entwicklungshilfe ausgeben? B: Singer würde sagen: Ja, weil wir die Pflicht haben, Leben zu retten, wenn es uns wenig kostet. Ich finde das überzeugend.',
    'Warum sollten wir laut Singer mehr Hilfe geben?',
    ['weil es sich gut anfühlt','weil wir moralisch verpflichtet sind','weil es Wirtschaft hilft','weil es Gesetz ist'],
    'weil wir moralisch verpflichtet sind',
    'Write an essay on the moral obligations of rich countries towards poor ones.',
    'Debate: Do we have a duty to help people in other countries?',
    'die globale Gerechtigkeit, der Kosmopolitismus, die Verteilungsgerechtigkeit, die Armut')

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
