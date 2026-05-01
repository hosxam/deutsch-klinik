#!/usr/bin/env python3
"""Generate B2 lessons 16-25 (second 10 of 20)."""
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

# ===== B2 LESSONS 16-25 =====

add('B2', 16,
    'Digitalisierung und Gesellschaft',
    'Discuss digitalization and its impact.',
    'Die Digitalisierung verändert alle Lebensbereiche. Künstliche Intelligenz, Automatisierung, Homeoffice, Cybersicherheit. Die Digitalisierung schafft neue Berufe aber bedroht traditionelle Arbeitsplätze.',
    ['Digitalisierung verändert die Arbeitswelt.', 'KI eröffnet neue Möglichkeiten.', 'Homeoffice ist Normalität geworden.', 'Datenschutz ist eine Herausforderung.'],
    'Digitalization vocabulary',
    [('die Digitalisierung','digitalization'),('die Automatisierung','automation'),('die Künstliche Intelligenz','artificial intelligence'),('das Homeoffice','remote work'),('die Cybersicherheit','cybersecurity'),('der Datenschutz','data protection'),('der Algorithmus','algorithm'),('digitale Kompetenz','digital literacy'),('die Cloud','cloud'),('die Vernetzung','networking')],
    [('Translate: "digitalization"','die Digitalisierung'),('What does "Cybersicherheit" mean?','cybersecurity')],
    'Die Digitalisierung schreitet rasant voran. Viele traditionelle Berufe verschwinden, neue entstehen. Homeoffice und KI verändern den Arbeitsalltag. Datenschutz wird immer wichtiger. Deutschland investiert in den Ausbau des digitalen Netzes.',
    'Was verschwindet durch Digitalisierung?',
    ['neue Berufe','traditionelle Berufe','Homeoffice','KI'],
    'traditionelle Berufe',
    'Was wird immer wichtiger?',
    ['Papierakten','Datenschutz','Faxgeräte','Briefpost'],
    'Datenschutz',
    'A: Homeoffice ist super! B: Ja, aber die Grenzen zwischen Arbeit und Freizeit verschwimmen. Das kann stressig sein.',
    'Was ist das Problem mit Homeoffice?',
    ['kein Internet','Grenzen verschwimmen','zu viel Schlaf','keine Kollegen'],
    'Grenzen verschwimmen',
    'Write about how digitalization changed your daily life.',
    'Discuss: Pros and cons of working from home.',
    'die Digitalisierung, die KI, das Homeoffice, der Datenschutz')

add('B2', 17,
    'Politisches System Deutschlands',
    'Understand the German political system.',
    'Deutschland ist eine parlamentarische Demokratie. Der Bundestag wird alle vier Jahre gewählt. Der Bundeskanzler ist Regierungschef. Der Bundespräsident hat repräsentative Aufgaben. Wichtige Begriffe: die Regierung, die Opposition, die Koalition, das Grundgesetz.',
    ['Der Bundestag wird alle vier Jahre gewählt.', 'Der Kanzler wird vom Bundestag gewählt.', 'Deutschland ist eine parlamentarische Demokratie.', 'Das Grundgesetz ist die Verfassung.'],
    'Political system vocabulary',
    [('die Demokratie','democracy'),('der Bundestag','federal parliament'),('der Bundeskanzler','chancellor'),('der Bundespräsident','federal president'),('die Regierung','government'),('die Opposition','opposition'),('die Koalition','coalition'),('das Grundgesetz','basic law'),('die Wahl','election'),('der Wähler','voter')],
    [('Translate: "federal parliament"','der Bundestag'),('What does "das Grundgesetz" mean?','basic law')],
    'Deutschland hat ein föderales System mit 16 Bundesländern. Der Bundestag beschließt Gesetze, der Bundesrat vertritt die Länder. Der Kanzler bestimmt die Richtlinien der Politik, aber das Bundesverfassungsgericht prüft die Verfassungsmäßigkeit.',
    'Wie viele Bundesländer hat Deutschland?',
    ['10','16','20','5'],
    '16',
    'Wer prüft die Verfassungsmäßigkeit?',
    ['der Kanzler','der Bundestag','das Bundesverfassungsgericht','der Bundespräsident'],
    'das Bundesverfassungsgericht',
    'A: Wie funktioniert die Regierungsbildung? B: Nach der Wahl verhandeln Parteien über eine Koalition. Die Koalition wählt dann den Kanzler.',
    'Was passiert nach der Wahl?',
    ['sofortige Regierung','Koalitionsverhandlungen','Neuwahl','keine Regierung'],
    'Koalitionsverhandlungen',
    'Write an explanation of the German political system.',
    'Discuss: What are the advantages of a federal system?',
    'der Bundestag, der Bundeskanzler, die Koalition, das Grundgesetz')

add('B2', 18,
    'Urbane Entwicklung und Smart Cities',
    'Discuss urban development and smart cities.',
    'Smart Cities nutzen Technologie für nachhaltige Stadtentwicklung. Begriffe: die Urbanisierung, die Infrastruktur, der öffentliche Nahverkehr, die Smart City, die Nachverdichtung, die Grünfläche, die Mobilitätswende.',
    ['Smart Cities nutzen Technologie.', 'Der öffentliche Nahverkehr muss ausgebaut werden.', 'Grünflächen verbessern die Lebensqualität.', 'Die Mobilitätswende ist notwendig.'],
    'Urban development vocabulary',
    [('die Urbanisierung','urbanization'),('die Infrastruktur','infrastructure'),('der öffentliche Nahverkehr','public transport'),('die Smart City','smart city'),('die Grünfläche','green space'),('die Mobilitätswende','mobility transition'),('die Nachhaltigkeit','sustainability'),('der Stadtteil','district'),('die Lebensqualität','quality of life'),('die Verdichtung','densification')],
    [('Translate: "public transport"','der öffentliche Nahverkehr'),('What does "Mobilitätswende" mean?','mobility transition')],
    'Städte wachsen weltweit. In Deutschland leben über 75% der Menschen in Städten. Smart Cities setzen auf digitale Lösungen für Verkehr, Energie und Verwaltung. Grünflächen und nachhaltige Mobilität sind zentral für die Lebensqualität. Barcelona und Kopenhagen gelten als Vorbilder.',
    'Wie viele Deutsche leben in Städten?',
    ['50%','über 75%','90%','30%'],
    'über 75%',
    'Welche Städte gelten als Vorbilder?',
    ['Berlin und München','Barcelona und Kopenhagen','Paris und London','Rom und Madrid'],
    'Barcelona und Kopenhagen',
    'A: Sollte man in der Stadt oder auf dem Land leben? B: Die Stadt bietet mehr Angebote, aber das Land mehr Ruhe. Eine gute Infrastruktur ist entscheidend.',
    'Was ist laut B entscheidend?',
    ['gute Infrastruktur','günstige Mieten','Nähe zur Natur','gute Schulen'],
    'gute Infrastruktur',
    'Write about the ideal city of the future.',
    'Discuss pros and cons of city vs. country living.',
    'die Smart City, die Urbanisierung, die Infrastruktur, die Lebensqualität')

add('B2', 19,
    'Energiepolitik und Energiewende',
    'Discuss energy policy and the energy transition.',
    'Die Energiewende ist der Umstieg von fossilen auf erneuerbare Energien. Begriffe: die Sonnenenergie, die Windkraft, die Atomkraft, der Strommix, der CO2-Preis, die Energieeffizienz, die Photovoltaik.',
    ['Die Energiewende ist ein zentrales Projekt.', 'Erneuerbare Energien sollen fossile ersetzen.', 'Windkraft und Sonnenenergie wachsen.', 'Energieeffizienz spart Kosten.'],
    'Energy policy vocabulary',
    [('die Energiewende','energy transition'),('die Sonnenenergie','solar energy'),('die Windkraft','wind power'),('die Atomkraft','nuclear power'),('der Strommix','electricity mix'),('der CO2-Preis','carbon price'),('die Energieeffizienz','energy efficiency'),('die Photovoltaik','photovoltaics'),('fossil','fossil'),('der Ausbau','expansion')],
    [('Translate: "energy transition"','die Energiewende'),('What does "der CO2-Preis" mean?','carbon price')],
    'Deutschland hat 2022 die letzten Atomkraftwerke abgeschaltet. Die Energiewende sieht vor, bis 2045 klimaneutral zu sein. Erneuerbare Energien decken bereits über 50% des Strombedarfs. Kritiker bemängeln die hohen Kosten und Netzinstabilität. Befürworter betonen den Klimaschutz.',
    'Was geschah 2022 in der Energiepolitik?',
    ['AKW-Neubau','letzte AKW abgeschaltet','mehr Kohle','Gasimporte gestoppt'],
    'letzte AKW abgeschaltet',
    'Wie viel Strom kommt aus erneuerbaren Energien?',
    ['10%','über 50%','90%','25%'],
    'über 50%',
    'A: Ist die Energiewende realistisch? B: Ja, aber sie erfordert massive Investitionen in Netze und Speicher. Ohne Speichertechnologie wird es schwierig.',
    'Was wird laut B benötigt?',
    ['mehr Atomkraft','Investitionen in Netze und Speicher','weniger Windkraft','Kohleausstieg stoppen'],
    'Investitionen in Netze und Speicher',
    'Write an analysis of Germany\'s energy transition.',
    'Discuss: Can renewable energy replace fossil fuels completely?',
    'die Energiewende, die Windkraft, die Sonnenenergie, der CO2-Preis')

add('B2', 20,
    'Mode und Nachhaltigkeit',
    'Discuss sustainable fashion and consumer behavior.',
    'Die Modeindustrie ist einer der größten Umweltverschmutzer. Fast Fashion bedeutet billige, schnell produzierte Kleidung. Nachhaltige Mode setzt auf faire Produktion, Bio-Materialien und Langlebigkeit. Second Hand wird immer beliebter.',
    ['Fast Fashion schadet der Umwelt.', 'Nachhaltige Mode ist teurer aber besser.', 'Second Hand ist im Trend.', 'Weniger kaufen ist am nachhaltigsten.'],
    'Fashion vocabulary',
    [('die Mode','fashion'),('die Fast Fashion','fast fashion'),('nachhaltige Mode','sustainable fashion'),('die Produktion','production'),('das Material','material'),('die Langlebigkeit','durability'),('der Second Hand','second hand'),('fair','fair'),('die Kleidung','clothing'),('die Kollektion','collection')],
    [('Translate: "sustainable fashion"','nachhaltige Mode'),('What does "Fast Fashion" mean?','fast fashion')],
    'Die Modebranche produziert jährlich über 100 Milliarden Kleidungsstücke. Davon landen viele auf Müllhalden. Nachhaltige Labels setzen auf Bio-Baumwolle und faire Löhne. Immer mehr junge Menschen kaufen Second Hand oder tauschen Kleidung.',
    'Wie viele Kleidungsstücke werden jährlich produziert?',
    ['10 Milliarden','über 100 Milliarden','1 Milliarde','500 Millionen'],
    'über 100 Milliarden',
    'Was tun mehr junge Menschen?',
    ['mehr kaufen','Second Hand kaufen','nur Designermode','Kleidung wegwerfen'],
    'Second Hand kaufen',
    'A: Ich habe schon wieder neue Klamotten gekauft. B: Weißt du, Fast Fashion ist richtig schlecht für die Umwelt. Vielleicht probierst du mal Second Hand?',
    'Was kritisiert B?',
    ['den Preis','Fast Fashion','den Stil','die Farbe'],
    'Fast Fashion',
    'Write about your fashion consumption habits.',
    'Discuss: Would you buy more sustainable fashion?',
    'die Mode, die Fast Fashion, nachhaltige Mode, der Second Hand, fair')

add('B2', 21,
    'Sport und Gesundheit',
    'Discuss sports, fitness and healthy lifestyle.',
    'Sport ist wichtig für körperliche und geistige Gesundheit. Ausdauertraining, Krafttraining, Beweglichkeit. Regelmäßige Bewegung beugt Krankheiten vor.',
    ['Sport hält gesund.', 'Regelmäßiges Training beugt Krankheiten vor.', 'Ausdauertraining stärkt das Herz.', 'Bewegung im Alltag ist wichtig.'],
    'Sports vocabulary',
    [('der Sport','sport'),('das Training','training'),('die Bewegung','exercise'),('die Ausdauer','endurance'),('die Kraft','strength'),('die Fitness','fitness'),('die Gesundheit','health'),('der Muskel','muscle'),('das Joggen','jogging'),('das Schwimmen','swimming')],
    [('Translate: "exercise keeps you healthy"','Bewegung hält gesund'),('What does "die Ausdauer" mean?','endurance')],
    'Die Weltgesundheitsorganisation empfiehlt 150 Minuten moderate Bewegung pro Woche. In Deutschland treiben etwa 65% der Erwachsenen regelmäßig Sport. Beliebt sind Joggen, Schwimmen und Radfahren. Auch Yoga und Pilates gewinnen an Beliebtheit.',
    'Wie viel Bewegung empfiehlt die WHO?',
    ['30 Minuten pro Woche','150 Minuten pro Woche','10 Stunden pro Woche','einmal im Monat'],
    '150 Minuten pro Woche',
    'Wie viele Erwachsene in Deutschland treiben Sport?',
    ['25%','etwa 65%','90%','40%'],
    'etwa 65%',
    'A: Ich sollte mehr Sport machen. B: Fang mit Joggen an. Dreimal die Woche 20 Minuten reicht schon für den Anfang.',
    'Was empfiehlt B für den Anfang?',
    ['Schwimmen','Joggen','Yoga','Krafttraining'],
    'Joggen',
    'Write about your weekly exercise routine.',
    'Discuss: How do you stay fit and healthy?',
    'der Sport, die Bewegung, die Fitness, die Gesundheit, das Training')

add('B2', 22,
    'Geschichte des geteilten Deutschlands',
    'Discuss the history of divided Germany.',
    'Nach dem Zweiten Weltkrieg wurde Deutschland in BRD und DDR geteilt. 1961 wurde die Berliner Mauer gebaut. 1989 fiel die Mauer, 1990 erfolgte die Wiedervereinigung.',
    ['Deutschland war 40 Jahre geteilt.', 'Die Berliner Mauer trennte Ost und West.', '1989 fiel die Mauer.', 'Die Wiedervereinigung kam 1990.'],
    'History vocabulary',
    [('die Teilung','division'),('die BRD','Federal Republic'),('die DDR','GDR'),('die Berliner Mauer','Berlin Wall'),('der Mauerfall','fall of the wall'),('die Wiedervereinigung','reunification'),('der Kalte Krieg','Cold War'),('die Grenze','border'),('die Flucht','escape'),('die friedliche Revolution','peaceful revolution')],
    [('Translate: "reunification"','die Wiedervereinigung'),('What does "der Mauerfall" mean?','fall of the wall')],
    'Die friedliche Revolution in der DDR begann im Herbst 1989. Montagsdemonstrationen in Leipzig und anderen Städten forderten Freiheit und Reformen. Am 9. November 1989 fiel die Mauer. Am 3. Oktober 1990 wurde die Wiedervereinigung offiziell vollzogen.',
    'Was begann im Herbst 1989?',
    ['Krieg','friedliche Revolution','Wirtschaftskrise','Olympische Spiele'],
    'friedliche Revolution',
    'Wann fiel die Mauer?',
    ['9. November 1989','3. Oktober 1990','1. Januar 1990','17. Juni 1953'],
    '9. November 1989',
    'A: Die DDR war eine Diktatur. B: Ja, aber viele Ostdeutsche haben trotzdem positive Erinnerungen an die Gemeinschaft und die Sicherheit.',
    'Was sagt B über die DDR?',
    ['alles war schlecht','es gab auch positive Aspekte','es gab keine Probleme','alle wollten weg'],
    'es gab auch positive Aspekte',
    'Write about the peaceful revolution of 1989.',
    'Discuss: How does the division still affect Germany today?',
    'die Teilung, die DDR, die Berliner Mauer, die Wiedervereinigung')

add('B2', 23,
    'Philosophie im Alltag',
    'Apply philosophical concepts to daily life.',
    'Philosophische Fragen begleiten uns: Was ist Glück? Was ist Gerechtigkeit? Was ist der Sinn des Lebens? Bekannte deutsche Philosophen: Kant, Nietzsche, Arendt, Habermas.',
    ['Philosophie hilft, das Leben zu hinterfragen.', 'Was ist ein gutes Leben?', 'Kant fragte nach der Vernunft.', 'Nietzsche kritisierte die Moral.'],
    'Philosophy vocabulary',
    [('die Philosophie','philosophy'),('die Vernunft','reason'),('die Moral','morality'),('die Gerechtigkeit','justice'),('das Glück','happiness'),('der Sinn','meaning'),('die Freiheit','freedom'),('die Ethik','ethics'),('der Philosoph','philosopher'),('hinterfragen','to question')],
    [('Translate: "What is happiness?"','Was ist Glück?'),('What does "die Gerechtigkeit" mean?','justice')],
    'Der Philosoph Immanuel Kant formulierte den kategorischen Imperativ: Handle nur nach der Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde. Diese Frage nach der Verallgemeinerbarkeit moralischer Regeln ist bis heute aktuell.',
    'Wer formulierte den kategorischen Imperativ?',
    ['Nietzsche','Kant','Arendt','Habermas'],
    'Kant',
    'Was ist der kategorische Imperativ?',
    ['eine mathematische Formel','eine ethische Regel','eine politische Theorie','eine naturwissenschaftliche These'],
    'eine ethische Regel',
    'A: Ist es okay zu lügen, wenn es jemanden schützt? B: Kant würde sagen: Nein, Lügen ist immer falsch. Aber ich denke, im Notfall darf man lügen.',
    'Was sagt B über Lügen im Notfall?',
    ['nie erlaubt','im Notfall erlaubt','immer erlaubt','egal'],
    'im Notfall erlaubt',
    'Write about a philosophical question that interests you.',
    'Discuss: Is it ever acceptable to lie?',
    'die Philosophie, die Moral, die Gerechtigkeit, das Glück, die Freiheit')

add('B2', 24,
    'Europäische Union',
    'Discuss the European Union and its institutions.',
    'Die EU ist ein Wirtschafts- und Politikverbund von 27 Mitgliedstaaten. Wichtige Institutionen: die Europäische Kommission, das Europäische Parlament, der Europäische Rat, der Euro als gemeinsame Währung.',
    ['Die EU hat 27 Mitgliedstaaten.', 'Der Euro ist die gemeinsame Währung.', 'Das EU-Parlament wird direkt gewählt.', 'Die EU fördert Frieden und Zusammenarbeit.'],
    'EU vocabulary',
    [('die Europäische Union','European Union'),('das Europäische Parlament','European Parliament'),('die Europäische Kommission','European Commission'),('der Euro','euro'),('der Mitgliedstaat','member state'),('die Erweiterung','enlargement'),('die Zusammenarbeit','cooperation'),('der Binnenmarkt','single market'),('die Freizügigkeit','free movement'),('die Gesetzgebung','legislation')],
    [('Translate: "single market"','der Binnenmarkt'),('What does "die Freizügigkeit" mean?','free movement')],
    'Die EU entstand nach dem Zweiten Weltkrieg aus dem Wunsch nach Frieden und wirtschaftlicher Zusammenarbeit. Der Binnenmarkt ermöglicht freien Waren-, Dienstleistungs-, Personen- und Kapitalverkehr. Das EU-Parlament wird alle fünf Jahre von den Bürgern gewählt.',
    'Warum entstand die EU?',
    ['für militärische Stärke','Wunsch nach Frieden und Zusammenarbeit','für eine gemeinsame Sprache','für eine Weltregierung'],
    'Wunsch nach Frieden und Zusammenarbeit',
    'Wie oft wird das EU-Parlament gewählt?',
    ['alle 4 Jahre','alle 5 Jahre','alle 6 Jahre','alle 10 Jahre'],
    'alle 5 Jahre',
    'A: Ist die EU wichtig für Deutschland? B: Absolut. Deutschland profitiert sehr vom Binnenmarkt und der Freizügigkeit. Über die Hälfte unserer Exporte gehen in EU-Länder.',
    'Wovon profitiert Deutschland besonders?',
    ['vom Euro','vom Binnenmarkt und der Freizügigkeit','von den Subventionen','von der Außenpolitik'],
    'vom Binnenmarkt und der Freizügigkeit',
    'Write about the benefits and challenges of the EU.',
    'Discuss: Should the EU have more or less power?',
    'die EU, der Binnenmarkt, die Freizügigkeit, der Euro, das Parlament')

add('B2', 25,
    'Interkulturelle Kommunikation',
    'Navigate intercultural communication effectively.',
    'Interkulturelle Kompetenz ist im globalisierten Arbeitsleben wichtig. Kulturelle Unterschiede betreffen: direkte vs. indirekte Kommunikation, Hierarchieverständnis, Zeitwahrnehmung. Deutsche Kommunikation gilt oft als direkt.',
    ['Kulturen kommunizieren unterschiedlich.', 'Direktheit ist nicht überall gleich.', 'Missverständnisse entstehen leicht.', 'Kulturelle Sensibilität ist wichtig.'],
    'Intercultural communication vocabulary',
    [('die interkulturelle Kommunikation','intercultural communication'),('die Kompetenz','competence'),('der Unterschied','difference'),('das Missverständnis','misunderstanding'),('die Direktheit','directness'),('die Höflichkeit','politeness'),('die Hierarchie','hierarchy'),('die Sensibilität','sensitivity'),('die Wahrnehmung','perception'),('die Anpassung','adaptation')],
    [('Translate: "intercultural communication"','die interkulturelle Kommunikation'),('What does "das Missverständnis" mean?','misunderstanding')],
    'In Deutschland wird direkte Kommunikation geschätzt. "Ehrlich währt am längsten" lautet ein Sprichwort. In vielen asiatischen Kulturen ist indirekte Kommunikation höflicher. Missverständnisse entstehen oft durch unterschiedliche Erwartungen an Direktheit, Hierarchie und Pünktlichkeit.',
    'Welche Kommunikation wird in Deutschland geschätzt?',
    ['indirekte','direkte','nonverbale','laute'],
    'direkte',
    'Wo entstehen oft Missverständnisse?',
    ['beim Wetter','bei unterschiedlichen Erwartungen','beim Essen','beim Sport'],
    'bei unterschiedlichen Erwartungen',
    'A: Der Kollege aus Japan hat nicht direkt Nein gesagt. B: Das ist typisch für indirekte Kommunikation. Man muss zwischen den Zeilen lesen.',
    'Was ist typisch für japanische Kommunikation?',
    ['sehr direkt','indirekt','laut','emotional'],
    'indirekt',
    'Write about a cross-cultural experience or challenge.',
    'Discuss: How do you adapt communication with people from other cultures?',
    'die interkulturelle Kommunikation, das Missverständnis, die Direktheit, die Sensibilität')

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
