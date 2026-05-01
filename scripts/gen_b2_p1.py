#!/usr/bin/env python3
"""Generate B2 lessons 6-15 (first 10 of 20)."""
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

# ===== B2 LESSONS 6-15 =====

add('B2', 6,
    'Debatte über Globalisierung',
    'Discuss globalization and its economic effects.',
    'Globalisierung: der Welthandel, die Lieferkette, die Ungleichheit, die Zusammenarbeit. Die Globalisierung hat Vor- und Nachteile.',
    ['Die Globalisierung hat Vor- und Nachteile.', 'Internationale Zusammenarbeit ist essenziell.', 'Globale Lieferketten sind krisenanfällig.', 'Kulturen vermischen sich zunehmend.'],
    'Globalization vocabulary',
    [('die Globalisierung','globalization'),('die Weltwirtschaft','global economy'),('der Welthandel','world trade'),('die Lieferkette','supply chain'),('die Zusammenarbeit','cooperation'),('die Ungleichheit','inequality'),('die Krise','crisis'),('protektionistisch','protectionist'),('der Standort','location'),('der Arbeitsmarkt','labor market')],
    [('Translate: "supply chain"','die Lieferkette'),('What does "die Ungleichheit" mean?','inequality')],
    'Die Globalisierung hat die Welt stark vernetzt. Unternehmen profitieren von globalen Lieferketten, aber die Pandemie hat gezeigt, wie verletzlich diese Systeme sind. Viele fordern eine faire Globalisierung.',
    'Was zeigt der Text als Problem?',
    ['zu wenig Handel','Verletzlichkeit der Systeme','zu viele Jobs','fehlende Technologie'],
    'Verletzlichkeit der Systeme',
    'Welche Globalisierung wird gefordert?',
    ['schnelle','faire','nationale','technische'],
    'faire',
    'A: Was hältst du von Globalisierung? B: Ein zweischneidiges Schwert. Ich profitiere von günstigen Produkten, aber die lokale Wirtschaft leidet.',
    'Wie bewertet B die Globalisierung?',
    ['positiv','negativ','zweischneidig','neutral'],
    'zweischneidig',
    'Write a balanced essay on the pros and cons of globalization.',
    'Discuss: How has globalization affected your country?',
    'die Globalisierung, der Welthandel, die Lieferkette, die Ungleichheit')

add('B2', 7,
    'Wissenschaftliche Ethik',
    'Discuss ethics in scientific research.',
    'Ethische Fragen: Tierversuche, Genforschung, Stammzellenforschung. Der Ethikrat berät zu Grenzen.',
    ['Tierversuche sind ethisch umstritten.', 'Die Genforschung wirft Fragen auf.', 'Einwilligung ist grundlegend.', 'Wo liegen die Grenzen der Wissenschaft?'],
    'Scientific ethics vocabulary',
    [('die Ethik','ethics'),('der Tierversuch','animal testing'),('die Genforschung','genetic research'),('die Stammzellenforschung','stem cell research'),('der Datenschutz','data protection'),('der Ethikrat','ethics council'),('die Einwilligung','consent'),('der Eingriff','intervention'),('die Keimbahn','germline'),('umstritten','controversial')],
    [('Translate: "animal testing is controversial"','Tierversuche sind umstritten'),('What does "der Ethikrat" mean?','ethics council')],
    'Der Ethikrat hat Richtlinien zur Genforschung veröffentlicht. Besonders umstritten ist die Veränderung von Embryonen. Befürworter sehen Chancen gegen Erbkrankheiten, Gegner warnen vor Risiken.',
    'Womit befasst sich der Bericht?',
    ['Tierversuchen','Grenzen der Genforschung','Klimaforschung','Weltraumforschung'],
    'Grenzen der Genforschung',
    'Was empfiehlt der Ethikrat?',
    ['keine Maßnahmen','Verbot der Keimbahn-Eingriffe','mehr Forschung','weniger Regeln'],
    'Verbot der Keimbahn-Eingriffe',
    'A: Darf Wissenschaft alles erforschen? B: Nicht alles, was möglich ist, ist ethisch vertretbar.',
    'Was sagt B?',
    ['alles ist erlaubt','nicht alles ist ethisch vertretbar','Forschung ist gefährlich','Technik ist neutral'],
    'nicht alles ist ethisch vertretbar',
    'Write an essay on genetic engineering pros and cons.',
    'Debate the ethics of animal testing.',
    'die Ethik, umstritten, der Tierversuch, die Genforschung, der Datenschutz')

add('B2', 8,
    'Bewerbungsgespräch führen',
    'Conduct a job interview in German.',
    'Wichtige Phrasen: "Darf ich mich vorstellen?" "Was sind Ihre Stärken?" "Warum unser Unternehmen?" Höflichkeit und Beispiele sind wichtig.',
    ['Darf ich mich kurz vorstellen?', 'Meine Stärke liegt in Projektarbeit.', 'Ich bin teamfähig und belastbar.', 'Wo sehen Sie sich in fünf Jahren?'],
    'Job interview vocabulary',
    [('das Bewerbungsgespräch','job interview'),('die Stärke','strength'),('die Schwäche','weakness'),('das Unternehmen','company'),('der Arbeitgeber','employer'),('die Erfahrung','experience'),('die Position','position'),('sich bewerben','to apply'),('die Qualifikation','qualification'),('teamfähig','team-oriented')],
    [('How do you introduce yourself?','Darf ich mich kurz vorstellen?'),('What does "die Stärke" mean?','strength')],
    'Frau Müller bewirbt sich als Projektmanagerin. Sie betont Erfahrung in internationalen Teams. Ihre Schwäche: sie ist zu detailorientiert.',
    'Welche Position sucht Frau Müller?',
    ['Sekretärin','Projektmanagerin','Praktikantin','CEO'],
    'Projektmanagerin',
    'Welche Schwäche nennt sie?',
    ['keine Erfahrung','zu detailorientiert','zu langsam','keine Teamarbeit'],
    'zu detailorientiert',
    'A: Warum bei uns? B: Ihr Unternehmen hat einen hervorragenden Ruf im Bereich Nachhaltigkeit.',
    'Warum möchte B hier arbeiten?',
    ['wegen des Gehalts','wegen des Rufs','wegen der Lage','wegen flexibler Zeiten'],
    'wegen des Rufs',
    'Write your answer to "Was sind Ihre Stärken und Schwächen?"',
    'Practice a job interview with a partner.',
    'das Bewerbungsgespräch, die Stärke, der Arbeitgeber, die Qualifikation')

add('B2', 9,
    'Nachhaltigkeit im Alltag',
    'Discuss sustainability in daily life.',
    'Nachhaltigkeit: Ressourcen für zukünftige Generationen schonen. Erneuerbare Energien, CO2-Fußabdruck, Kreislaufwirtschaft, Mülltrennung.',
    ['Wir müssen den CO2-Fußabdruck reduzieren.', 'Mülltrennung ist Standard.', 'Erneuerbare Energien sind die Zukunft.', 'Jeder kann nachhaltiger leben.'],
    'Sustainability vocabulary',
    [('die Nachhaltigkeit','sustainability'),('erneuerbare Energie','renewable energy'),('der CO2-Fußabdruck','carbon footprint'),('die Kreislaufwirtschaft','circular economy'),('die Mülltrennung','waste separation'),('vermeiden','to avoid'),('reduzieren','to reduce'),('wiederverwerten','to recycle'),('der Ressourcenverbrauch','resource consumption'),('der Klimawandel','climate change')],
    [('Translate: "waste separation"','die Mülltrennung'),('What does "die Kreislaufwirtschaft" mean?','circular economy')],
    'Deutschland ist Vorreiter in Umweltpolitik. Mülltrennung ist gesetzlich geregelt. Trotzdem ist der CO2-Ausstoß zu hoch. Umweltschutz beginnt im Kleinen.',
    'In welchem Bereich ist Deutschland Vorreiter?',
    ['Autobau','Umweltpolitik','Tourismus','Technologie'],
    'Umweltpolitik',
    'Was wird als Problem genannt?',
    ['zu wenig Mülltrennung','zu hoher CO2-Ausstoß','zu viele Autos','zu wenig Strom'],
    'zu hoher CO2-Ausstoß',
    'A: Wie können wir nachhaltiger leben? B: Ich kaufe weniger Plastik, mehr regionale Produkte und fahre Fahrrad.',
    'Was tut B für die Umwelt?',
    ['kauft mehr Plastik','fährt Fahrrad','fährt mehr Auto','kauft Importprodukte'],
    'fährt Fahrrad',
    'List 10 things for sustainable living with explanations.',
    'Discuss: What does sustainability mean to you?',
    'die Nachhaltigkeit, die Mülltrennung, erneuerbare Energie, der Klimawandel')

add('B2', 10,
    'Finanzen verwalten',
    'Manage personal finances.',
    'Finanzbegriffe: das Konto, die Überweisung, der Kredit, die Versicherung, die Aktie, die Anlage, die Rendite, der Zins.',
    ['Ich möchte ein Konto eröffnen.', 'Wie hoch sind die Zinsen?', 'Ich investiere in Aktien.', 'Eine Versicherung ist wichtig.'],
    'Personal finance vocabulary',
    [('das Konto','account'),('die Überweisung','transfer'),('der Kredit','loan'),('die Versicherung','insurance'),('die Aktie','stock'),('die Anlage','investment'),('die Rendite','return'),('der Zins','interest'),('die Sparrate','savings rate'),('das Girokonto','current account')],
    [('Translate: "interest rates"','die Zinsen'),('What does "die Versicherung" mean?','insurance')],
    'Herr Schmidt nimmt einen Kredit für ein Haus auf. Er vergleicht Angebote: 3,5% vs 4,2% Zinsen. Sein Berater empfiehlt, monatlich 200 Euro in Aktienfonds zu investieren.',
    'Wofür der Kredit?',
    ['Auto','Haus','Reise','Studium'],
    'Haus',
    'Was empfiehlt der Berater?',
    ['teuren Kredit','Aktienfonds-Investition','Geld ausgeben','keine Versicherung'],
    'Aktienfonds-Investition',
    'A: Sparen oder investieren? B: Bei heutigen Zinsen bringt Sparen kaum etwas. Investieren ist sinnvoll.',
    'Was sagt B zum Sparen?',
    ['es bringt viel','es bringt kaum etwas','es ist riskant','es ist illegal'],
    'es bringt kaum etwas',
    'Write a guide on managing personal finances.',
    'Discuss: Saving vs. investing?',
    'das Konto, der Kredit, die Aktie, die Anlage, die Rendite')

add('B2', 11,
    'Migration und Integration',
    'Discuss migration and integration.',
    'Migration: der Migrant, der Flüchtling, die Integration, der Spracherwerb, die Willkommenskultur, die Vorurteile.',
    ['Sprache ist der Schlüssel zur Integration.', 'Kulturelle Vielfalt bereichert.', 'Integration ist gegenseitig.', 'Vorurteile erschweren das Zusammenleben.'],
    'Migration vocabulary',
    [('der Migrant','migrant'),('der Flüchtling','refugee'),('die Integration','integration'),('der Spracherwerb','language acquisition'),('die Willkommenskultur','welcoming culture'),('das Vorurteil','prejudice'),('die Vielfalt','diversity'),('die Anpassung','adaptation'),('gesellschaftlich','societal'),('der Zusammenhalt','cohesion')],
    [('What does "Willkommenskultur" mean?','welcoming culture'),('Translate: "Language is the key"','Sprache ist der Schlüssel')],
    'Deutschland hat viele Migranten aufgenommen. Sprachkurse und Arbeitsintegration sind zentral. Studien zeigen: gut integrierte Migranten leisten positiven Wirtschaftsbeitrag.',
    'Was sind zentrale Integrationsmaßnahmen?',
    ['Steuererhöhungen','Sprachkurse und Arbeitsintegration','Grenzschließung','Militär'],
    'Sprachkurse und Arbeitsintegration',
    'Welchen Beitrag leisten gut integrierte Migranten?',
    ['keinen','negativen','positiven Wirtschaftsbeitrag','nur kulturellen'],
    'positiven Wirtschaftsbeitrag',
    'A: Ist Integration wichtig? B: Ja, ohne Integration entstehen Parallelgesellschaften.',
    'Was passiert ohne Integration?',
    ['nichts','Parallelgesellschaften','Wirtschaftswachstum','Kulturblüte'],
    'Parallelgesellschaften',
    'Write on challenges and opportunities of migration.',
    'Discuss: What does successful integration look like?',
    'der Migrant, der Flüchtling, die Integration, die Vielfalt, das Vorurteil')

add('B2', 12,
    'Recht und Justiz',
    'Discuss legal systems and justice.',
    'Das Gesetz, der Richter, der Anwalt, das Gericht, die Klage, die Strafe, das Urteil, die Beweise, die Berufung.',
    ['Das Gesetz gilt für alle.', 'Sie haben das Recht zu schweigen.', 'Das Gericht fällt das Urteil.', 'Gegen das Urteil kann Berufung eingelegt werden.'],
    'Legal vocabulary',
    [('das Gesetz','law'),('der Richter','judge'),('der Anwalt','lawyer'),('das Gericht','court'),('die Klage','lawsuit'),('die Strafe','penalty'),('das Urteil','verdict'),('die Beweise','evidence'),('die Berufung','appeal'),('der Freispruch','acquittal')],
    [('Translate: "the court reached a verdict"','Das Gericht hat das Urteil gefällt'),('What does "die Berufung" mean?','appeal')],
    'In Deutschland gibt es verschiedene Gerichte. Das Amtsgericht für kleine Fälle, das Landgericht für schwerwiegende. Jeder Angeklagte hat Recht auf Verteidiger.',
    'Welches Gericht für kleine Fälle?',
    ['Bundesgerichtshof','Amtsgericht','Verfassungsgericht','Europäischer Gerichtshof'],
    'Amtsgericht',
    'In welcher Zeit kann Berufung eingelegt werden?',
    ['einem Monat','einer Woche','einem Jahr','einem Tag'],
    'einer Woche',
    'A: Was bei Unzufriedenheit mit Urteil? B: Berufung einlegen, dann prüft ein höheres Gericht.',
    'Was bedeutet "Berufung"?',
    ['Urteil akzeptieren','höheres Gericht prüft','Strafe zahlen','Richter wechseln'],
    'höheres Gericht prüft',
    'Write on the importance of independent judiciary.',
    'Discuss: What rights should accused people have?',
    'das Gesetz, der Richter, der Anwalt, das Urteil, die Berufung')

add('B2', 13,
    'Medienlandschaft in Deutschland',
    'Understand German media landscape.',
    'Öffentlich-rechtliche Sender (ARD, ZDF) und private Medien. Pressefreiheit, Berichterstattung, Fake News, Medienkompetenz.',
    ['Pressefreiheit ist ein hohes Gut.', 'ARD und ZDF finanzieren sich durch Rundfunkbeiträge.', 'Fake News verbreiten sich schnell.', 'Medienkompetenz ist wichtig.'],
    'Media vocabulary',
    [('die Pressefreiheit','freedom of press'),('die Berichterstattung','reporting'),('der Journalist','journalist'),('die Quelle','source'),('die Fake News','fake news'),('der Rundfunk','broadcasting'),('recherchieren','to research'),('die Schlagzeile','headline'),('die Medienkompetenz','media literacy'),('öffentlich-rechtlich','publicly funded')],
    [('What does "Pressefreiheit" mean?','freedom of the press'),('Translate: "public broadcasting"','der öffentlich-rechtliche Rundfunk')],
    'ARD und ZDF finanzieren sich durch Rundfunkbeiträge. Daneben gibt es private Sender. Medienkompetenz wird wichtiger, um Fake News zu erkennen.',
    'Wie finanzieren sich ARD und ZDF?',
    ['Werbung','Rundfunkbeiträge','Steuern','Spenden'],
    'Rundfunkbeiträge',
    'Was wird wichtiger?',
    ['mehr Fernsehen','Medienkompetenz','mehr Zeitungen','Social Media'],
    'Medienkompetenz',
    'A: Vertraust du den Nachrichten? B: Öffentlich-rechtlichen Sendern ja, bei Social Media bin ich vorsichtig.',
    'Welchen Medien vertraut B?',
    ['allen','öffentlich-rechtlichen','sozialen Medien','keinen'],
    'öffentlich-rechtlichen',
    'Compare public broadcasting vs. social media news.',
    'Discuss: How do you verify news?',
    'die Pressefreiheit, die Quelle, die Fake News, der Journalist')

add('B2', 14,
    'Psychologie und Wohlbefinden',
    'Discuss mental health and well-being.',
    'Wohlbefinden, psychische Gesundheit, Stress, Burnout, Resilienz, Achtsamkeit, Therapie. "Stress kann krank machen."',
    ['Psychische Gesundheit ist genauso wichtig.', 'Stressbewältigung ist eine wichtige Fähigkeit.', 'Achtsamkeit hilft.', 'Über Probleme zu sprechen ist der erste Schritt.'],
    'Psychology vocabulary',
    [('das Wohlbefinden','well-being'),('die psychische Gesundheit','mental health'),('der Stress','stress'),('das Burnout','burnout'),('die Resilienz','resilience'),('die Achtsamkeit','mindfulness'),('die Depression','depression'),('die Therapie','therapy'),('der Psychologe','psychologist'),('bewältigen','to cope')],
    [('Translate: "mental health"','die psychische Gesundheit'),('What does "Resilienz" mean?','resilience')],
    'Immer mehr Menschen leiden unter Stress. Psychologen empfehlen Achtsamkeit und Pausen. Die Wartezeit auf Therapieplätze in Deutschland ist oft lang.',
    'Was empfehlen Psychologen?',
    ['mehr Arbeit','Achtsamkeit und Pausen','weniger Schlaf','mehr Koffein'],
    'Achtsamkeit und Pausen',
    'Was ist ein Problem bei Therapie in Deutschland?',
    ['zu viele Therapeuten','lange Wartezeiten','zu günstig','keine Angebote'],
    'lange Wartezeiten',
    'A: Ich bin gestresst. B: Hast du Achtsamkeit probiert? Einfach tief durchatmen hilft.',
    'Was empfiehlt B?',
    ['mehr arbeiten','Achtsamkeit','Medikamente','Urlaub'],
    'Achtsamkeit',
    'Write a guide on managing stress.',
    'Discuss: What do you do for mental well-being?',
    'das Wohlbefinden, der Stress, das Burnout, die Achtsamkeit, die Resilienz')

add('B2', 15,
    'Tourismus und Reisen',
    'Discuss tourism and travel experiences.',
    'Reisevokabular: die Reise, der Urlaub, die Unterkunft, die Buchung, das Reiseziel, die Besichtigung, die Reiseversicherung.',
    ['Ich buche Urlaub online.', 'Das Hotel war fantastisch.', 'Eine Reiseversicherung ist empfehlenswert.', 'Wir haben die Altstadt besichtigt.'],
    'Travel vocabulary',
    [('die Reise','trip'),('der Urlaub','vacation'),('die Unterkunft','accommodation'),('die Buchung','booking'),('die Reiseversicherung','travel insurance'),('das Reiseziel','destination'),('die Besichtigung','sightseeing'),('die Rundreise','tour'),('der Reiseführer','travel guide'),('die Erfahrung','experience')],
    [('Translate: "travel insurance"','die Reiseversicherung'),('What does "Besichtigung" mean?','sightseeing')],
    'Tourismus in Deutschland ist ein wichtiger Wirtschaftsfaktor. Berlin, München und Hamburg sind beliebt. Nachhaltiger Tourismus gewinnt an Bedeutung.',
    'Welche Städte werden genannt?',
    ['Paris, London, Rom','Berlin, München, Hamburg','Wien, Zürich, Prag','Madrid, Barcelona'],
    'Berlin, München, Hamburg',
    'Welche Art Tourismus gewinnt an Bedeutung?',
    ['Massentourismus','nachhaltiger Tourismus','Geschäftstourismus','Abenteuer'],
    'nachhaltiger Tourismus',
    'A: Wohin in Urlaub? B: Rundreise durch die Schweiz, Berge erkunden.',
    'Welche Reise macht B?',
    ['Strandurlaub','Rundreise Schweiz','Städtereise','Kreuzfahrt'],
    'Rundreise Schweiz',
    'Write a travel blog about your ideal vacation.',
    'Share best and worst travel experiences.',
    'die Reise, der Urlaub, die Unterkunft, die Besichtigung')

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
