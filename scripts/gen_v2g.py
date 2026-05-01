#!/usr/bin/env python3
"""Batch 7: B2 6-25"""
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

def make(level, num, title, obj, expl, examples, gf, vlist, gplist,
         rtext, rquestions, lscript, lq, lopt, lans,
         wprompt, sprompt, summary):
    return {
        'level': level, 'unit': unit(level, num), 'id': f'{level}_lesson_{num}',
        'title': title, 'objective': obj, 'explanation': expl,
        'examples': examples, 'grammarFocus': gf,
        'vocabulary': [{'word':w,'translation':t} for w,t in vlist],
        'guidedPractice': [{'prompt':p,'answer':a} for p,a in gplist],
        'readingTask': {'text': rtext, 'questions': [
            {'question':q,'options':o,'answer':a} for q,o,a in rquestions
        ]},
        'listeningTask': {'script': lscript, 'questions': [
            {'question':lq,'options':lopt,'answer':lans}
        ]},
        'writingTask': {'prompt': wprompt},
        'speakingTask': {'prompt': sprompt},
        'reviewSummary': summary,
    }

with open(OUTPUT, 'r', encoding='utf-8') as f:
    existing = json.load(f)
existing_ids = set(l['id'] for l in existing)
new_lessons = []
added = 0

def add(*args, **kwargs):
    global added
    lid = f'{args[0]}_lesson_{args[1]}'
    if lid in existing_ids:
        print(f"  Skip: {lid}")
        return
    new_lessons.append(make(*args, **kwargs))
    added += 1

# === B2 6-25 ===
add('B2', 6,
    'Debatte ueber Globalisierung', 'Discuss globalization and its effects.',
    'Globalization: die Globalisierung, die Weltwirtschaft (global economy), der Welthandel (world trade), der globale Norden/Sueden, die Migration, der Kulturtransfer (cultural exchange), die multinationalen Konzerne, die Lieferkette (supply chain). "Die Globalisierung hat Vor- und Nachteile." "Internationale Zusammenarbeit ist wichtiger denn je." "Die globalen Lieferketten sind anfaellig fuer Krisen." "Kulturen vermischen sich zunehmend."',
    ['Die Globalisierung hat Vor- und Nachteile.','Internationale Zusammenarbeit ist essenziell.','Globale Lieferketten sind krisenanfaellig.','Kulturen vermischen sich zunehmend.'],
    'Globalization vocabulary and Konjunktiv II',
    [('die Globalisierung','globalization'),('die Weltwirtschaft','global economy'),('der Welthandel','world trade'),('die Migration','migration'),('der Kulturtransfer','cultural exchange'),('das multinationale Unternehmen','multinational corporation'),('die Lieferkette','supply chain'),('die Krise','crisis'),('protektionistisch','protectionist'),('die Zusammenarbeit','cooperation')],
    [('How do you say "globalization has pros and cons"?','Die Globalisierung hat Vor- und Nachteile'),('What does "die Lieferkette" mean?','supply chain'),('Translate "cultural exchange"','Kulturtransfer')],
    'Die Globalisierung hat die Welt in den letzten Jahrzehnten staerker vernetzt als je zuvor. Waherhandelsabkommen haben den Austausch von Waren und Dienstleistungen erleichtert. Gleichzeitig sind die globalen Lieferketten anfaellig geworden: Die Pandemie und geopolitische Konflikte haben gezeigt, wie verletzlich diese Systeme sind. Kritiker bemängeln die wachsende Ungleichheit zwischen globalem Norden und Sueden. Befuerworter betonen die Chancen durch internationale Zusammenarbeit und Technologietransfer.',
    [('Was kritisieren Gegner der Globalisierung?',['zu wenig Handel','wachsende Ungleichheit','zu viel Technologie','fehlende Vernetzung'],'wachsende Ungleichheit'),('Welche Ereignisse haben die Verletzlichkeit globaler Lieferketten gezeigt?',['Erdbeben','Pandemie und Konflikte','Wetter','Wahlen'],'Pandemie und Konflikte')],
    'A: Was haelst du von der Globalisierung? B: Ein zweischneidiges Schwert. Einerseits profitiere ich von guenstigen Produkten, andererseits leidet die lokale Wirtschaft.',
    'Wie bewertet B die Globalisierung?',['nur positiv','nur negativ','zweischneidig','neutral'],'zweischneidig',
    'Write a balanced essay (200 words) on the pros and cons of globalization.',
    'Debate the effects of globalization with a partner.',
    '"die Globalisierung" = globalization. "die Lieferkette" = supply chain. "die Zusammenarbeit" = cooperation.')

add('B2', 7,
    'Wissenschaftliche Ethik', 'Discuss ethics in scientific research.',
    'Research ethics: die Ethik, die Forschung (research), der Wissenschaftler (scientist), der Ethikrat (ethics council), der Tierversuch (animal testing), die Genforschung (genetic research), die Stammzellenforschung (stem cell research), der Datenschutz (data protection), die Einwilligung (consent). "Wo liegen die ethischen Grenzen der Forschung?" "Tierversuche sind ethisch umstritten." "Informed Consent ist grundlegend." "Jeder Patient muss aufgeklaert werden."',
    ['Tierversuche sind ethisch umstritten.','Die Genforschung wirft ethische Fragen auf.','Informed Consent ist ethisch grundlegend.','Wo liegen die Grenzen der Wissenschaft?'],
    'Research ethics vocabulary',
    [('die Ethik','ethics'),('die Forschung','research'),('der Tierversuch','animal testing'),('die Genforschung','genetic research'),('die Stammzellenforschung','stem cell research'),('der Datenschutz','data protection'),('die Einwilligung','consent'),('umstritten','controversial'),('der Ethikrat','ethics council'),('aufklaeren','to inform/enlighten'),('der Patient','patient')],
    [('How do you say "animal testing is controversial"?','Tierversuche sind umstritten'),('What does "der Datenschutz" mean?','data protection'),('Translate "informed consent"','Informierte Einwilligung')],
    'Ein aktueller Ethikrat-Bericht befasst sich mit den Grenzen der Genforschung. Die Moeglichkeit, menschliche Embryonen genetisch zu veraendern, wirft fundamentale ethische Fragen auf. Befuerworter argumentieren mit der Chance, Erbkrankheiten auszurotten. Gegner warnen vor einer neuen Form der Eugenik und unkalkulierbaren Risiken fuer zukuenftige Generationen. Der Ethikrat empfiehlt ein striktes Verbot von Eingriffen in die menschliche Keimbahn.',
    [('Womit befasst sich der Bericht?',['Tierversuchen','Grenzen der Genforschung','Stammzellen','Klimaforschung'],'Grenzen der Genforschung'),('Was empfiehlt der Ethikrat?',('keine Massnahmen','striktes Verbot der Keimbahn-Eingriffe','mehr Forschung','weniger Regeln')],'striktes Verbot der Keimbahn-Eingriffe'],
    'A: Darf die Wissenschaft alles erforschen? B: Nicht alles, was technisch moeglich ist, ist auch ethisch vertretbar. A: Wie findet man die Grenze? B: Durch breite gesellschaftliche Debatten.',
    'Was ist noetig, um ethische Grenzen zu finden?',['Expertenmeinungen','gesellschaftliche Debatten','Politik','Religion'],'gesellschaftliche Debatten',
    'Write an essay (200 words) on a controversial scientific topic.',
    'Debate the ethics of genetic engineering or animal testing.',
    '"die Ethik" = ethics. "umstritten" = controversial. "der Tierversuch" = animal experiment. "die Genforschung" = genetic research.')

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
