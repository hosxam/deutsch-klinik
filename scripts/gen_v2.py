#!/usr/bin/env python3
"""Programmatic German lesson generator - generates 20 lessons per level (A1-C1)"""
import json, os, sys

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
OUTPUT = os.path.join(DATA_DIR, 'germanLessonsNew.json')

UNITS = {
    'A1': ['A1_unit_1','A1_unit_2','A1_unit_3','A1_unit_4','A1_unit_5'],
    'A2': ['A2_unit_1','A2_unit_2','A2_unit_3','A2_unit_4','A2_unit_5'],
    'B1': ['B1_unit_1','B1_unit_2','B1_unit_3','B1_unit_4','B1_unit_5'],
    'B2': ['B2_unit_1','B2_unit_2','B2_unit_3','B2_unit_4','B2_unit_5'],
    'C1': ['C1_unit_1','C1_unit_2','C1_unit_3','C1_unit_4','C1_unit_5'],
}

def unit(level, num):
    return UNITS[level][min((num-1)//5, 4)]

def make(level, num, title, obj, expl, examples, gf, vlist, gplist,
         rtext, rquestions, lscript, lq, lopt, lans,
         wprompt, sprompt, summary):
    return {
        'level': level,
        'unit': unit(level, num),
        'id': f'{level}_lesson_{num}',
        'title': title,
        'objective': obj,
        'explanation': expl,
        'examples': examples,
        'grammarFocus': gf,
        'vocabulary': [{'word':w, 'translation':t} for w,t in vlist],
        'guidedPractice': [{'prompt':p, 'answer':a} for p,a in gplist],
        'readingTask': {'text': rtext, 'questions': [
            {'question':q, 'options':o, 'answer':a} for q,o,a in rquestions
        ]},
        'listeningTask': {'script': lscript, 'questions': [
            {'question':lq, 'options':lopt, 'answer':lans}
        ]},
        'writingTask': {'prompt': wprompt},
        'speakingTask': {'prompt': sprompt},
        'reviewSummary': summary,
    }

def load_existing():
    all_l = []
    ids = set()
    for f in ['germanLessons.json','germanLessonsB1.json','germanLessonsBC.json']:
        fp = os.path.join(DATA_DIR, f)
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
                for l in data:
                    ids.add(l['id'])
                all_l.extend(data)
    return all_l, ids

existing, existing_ids = load_existing()
print(f"Existing: {len(existing)}, IDs: {len(existing_ids)}")

new_lessons = []
added = 0

def add(*args, **kwargs):
    global added
    lid = f'{args[0]}_lesson_{args[1]}'
    if lid in existing_ids:
        print(f"  Skipping existing: {lid}")
        return
    new_lessons.append(make(*args, **kwargs))
    added += 1

# ============================================================
# A1 LESSONS (6-25)
# ============================================================

add('A1', 6,
    'Die Uhrzeit',
    'Tell time using official and colloquial formats.',
    'In German there are two ways to tell time. Official uses "Uhr" between hours and minutes: 14:30 Uhr. Colloquial uses "nach" (past) and "vor" (to): Viertel nach drei. Important: "halb drei" means half past two (half way TO the next hour). Learn both because Germans use both interchangeably.',
    ['Es ist drei Uhr.', 'Es ist halb zehn.', 'Es ist Viertel nach sieben.', 'Fuenf vor zwolf.'],
    'Time expressions: official vs colloquial',
    [('die Uhr','clock'),('die Stunde','hour'),('die Minute','minute'),('viertel','quarter'),('halb','half'),('nach','after/past'),('vor','before/to'),('puenktlich','on time'),('spaet','late')],
    [('How do you say half past eight (7:30)?','halb acht'),('Translate "at 3 o\'clock"','um drei Uhr'),('What is 14:45 colloquially?','Viertel vor drei')],
    'Der Wecker klingelt um 7 Uhr. Maria steht auf und fruehstueckt. Um 8.15 Uhr geht sie zur Arbeit. Um 12.30 Uhr hat sie Mittagspause. Um 17 Uhr ist Feierabend. Um 18.45 Uhr kocht sie Abendessen. Um 22.30 Uhr geht sie ins Bett.',
    [('Wann klingelt der Wecker?',['7 Uhr','8 Uhr','6 Uhr','7:30'],'7 Uhr'),('Wann hat Maria Mittagspause?',['11:30','12:30','13:30','12:00'],'12:30')],
    'A: Entschuldigung, wie spaet ist es? B: Es ist Viertel nach drei. A: Danke sehr! B: Bitte schoen.',
    'Wie spaet ist es?',['Viertel nach drei','halb vier','drei Uhr','Viertel vor drei'],'Viertel nach drei',
    'Write 5 sentences about your daily schedule using both official and colloquial time formats.',
    'Ask a partner for the time at 3 different times of day and answer colloquially.',
    'Use "nach" for minutes past the hour and "vor" for minutes to. "Halb" means half way TO the next hour. Official time uses "Uhr" between hours and minutes.')

add('A1', 7,
    'Die Wochentage und Monate',
    'Name the days, months, and say dates.',
    'Days are masculine in German: der Montag. Use "am" + day for "on": am Montag. Months: Januar to Dezember. Ordinal numbers for dates: "der erste Mai", "der dritte Oktober". Question: "Der wievielte ist heute?" Adverbial form: "montags" = on Mondays (regularly).',
    ['Heute ist Montag.','Morgen ist Dienstag.','Heute ist der 3. Mai.','Januar ist der erste Monat.'],
    'Days, months, and ordinal numbers',
    [('der Montag','Monday'),('der Dienstag','Tuesday'),('der Mittwoch','Wednesday'),('der Donnerstag','Thursday'),('der Freitag','Friday'),('der Samstag','Saturday'),('der Sonntag','Sunday'),('der Monat','month'),('der Geburtstag','birthday'),('das Jahr','year')],
    [('What day comes after Mittwoch?','Donnerstag'),('Say "today is Friday"','Heute ist Freitag'),('Ordinal for 1st?','erste')],
    'Am Montag gehe ich zur Schule. Am Dienstag habe ich Sport. Mittwochs besuche ich meine Oma. Donnerstags koche ich mit Freunden. Freitags gehe ich ins Kino. Samstags schlafe ich lange. Sonntags mache ich einen Spaziergang.',
    [('Was mache ich am Montag?',['zur Schule gehen','ins Kino gehen','schlafen','Sport haben'],'zur Schule gehen'),('Wann besuche ich meine Oma?',['dienstags','mittwochs','donnerstags','freitags'],'mittwochs')],
    'A: Der wievielte ist heute? B: Heute ist der 15. Juni. A: Ach so, dann habe ich naechste Woche Geburtstag!',
    'Welcher Monat wird genannt?',['Mai','Juni','Juli','August'],'Juni',
    'Write your weekly schedule in German using "am" for specific days.',
    'Tell your partner your favorite day of the week and explain why.',
    'Days are masculine (der). Use "am" + day for "on". Ordinal numbers add "-te": der erste, der zweite. Adverbial form: montags.')

add('A1', 8,
    'Hobbys und Freizeit',
    'Talk about hobbies using "gern" and correct verb conjugation.',
    'Use "gern" after the verb to express enjoyment: Ich spiele gern FuSSball. Verb conjugation: ich spiele, du spielst, er spielt, wir spielen. Question: Was machst du in deiner Freizeit? Use "nicht gern" for dislike and "lieber"/"am liebsten" for comparison/superlative.',
    ['Ich spiele gern FuSSball.','Sie liest gern Buecher.','Was machst du in deiner Freizeit?','Wir tanzen gern.'],
    'Verb conjugation with "gern" (like to)',
    [('das Hobby','hobby'),('spielen','to play'),('lesen','to read'),('malen','to paint'),('tanzen','to dance'),('kochen','to cook'),('reisen','to travel'),('der FuSSball','soccer'),('die Musik','music')],
    [('How do you say "I like to dance"?','Ich tanze gern'),('What does "lesen" mean?','to read'),('Translate "we like to cook"','Wir kochen gern')],
    'Thomas hat viele Hobbys. Er spielt gern FuSSball und trainiert zweimal pro Woche. Seine Schwester Anna malt gern. Sie hat schon 20 Bilder gemalt. Ihr Bruder Max hoert gern Musik und spielt Gitarre. Am Wochenende gehen sie zusammen schwimmen.',
    [('Wie oft trainiert Thomas?',['einmal pro Woche','zweimal pro Woche','dreimal pro Woche','jeden Tag'],'zweimal pro Woche'),('Was macht Anna gern?',['FuSSball','malen','Musik hoeren','kochen'],'malen')],
    'A: Was machst du in deiner Freizeit? B: Ich lese gern Romane und gehe spazieren.',
    'Was macht B gern?',['lesen','kochen','tanzen','Filme sehen'],'lesen',
    'Write 6 sentences about your hobbies using "gern". Include likes, dislikes, and preferences.',
    'Describe 3 hobbies you enjoy and how often you do them.',
    '"gern" after verb = like to. "nicht gern" = not like. "lieber" = prefer. "am liebsten" = favorite.')

add('A1', 9,
    'Im Supermarkt einkaufen',
    'Shop for food, use quantities, and ask about prices.',
    'Key phrases: Ich moechte (I would like), Ich brauche (I need), Was kostet (how much). Accusative case: einen Apfel (m), eine Milch (f), ein Brot (n), drei Eier (pl). Prices use comma as decimal: 1,99 Euro. "An der Kasse bezahlen" = pay at register.',
    ['Ich moechte einen Apfel.','Was kostet die Milch?','Das Brot kostet 2,49 Euro.','Ich brauche drei Eier.'],
    'Accusative articles with "moechten" and "brauchen"',
    [('der Apfel','apple'),('die Milch','milk'),('das Brot','bread'),('das Ei','egg'),('der Kaese','cheese'),('die Tomate','tomato'),('die Flasche','bottle'),('das Kilo','kilo'),('kosten','to cost'),('bezahlen','to pay')],
    [('Ask for the price of milk','Was kostet die Milch?'),('Translate "three eggs"','drei Eier'),('Plural of "der Apfel"','die Aepfel')],
    'Peter geht in den Supermarkt. Er braucht Milch, Brot und Kaese. Die Milch kostet 1,19 Euro. Das Brot kostet 2,49 Euro. Der Kaese kostet 3,99 Euro. An der Kasse bezahlt er 7,67 Euro. Dann geht er nach Hause.',
    [('Was kostet das Brot?',['1,19 Euro','2,49 Euro','3,99 Euro','0,99 Euro'],'2,49 Euro'),('Wie viel bezahlt Peter insgesamt?',['5,67 Euro','7,67 Euro','9,67 Euro','6,67 Euro'],'7,67 Euro')],
    'A: Kann ich Ihnen helfen? B: Ja, ich suche frische Tomaten. A: Die Tomaten sind dort im Gemueseregal.',
    'Was sucht der Kunde?',['Milch','Tomaten','Kaese','Brot'],'Tomaten',
    'Write a shopping list with 8 items and estimated prices.',
    'Role play customer and shopkeeper. Ask for 3 items and prices.',
    'Plurals are unpredictable. Always learn the plural: der Apfel -> die Aepfel. Euro stays the same in plural. "An der Kasse" = at the register.')

add('A1', 10,
    'Im Restaurant bestellen',
    'Order food and drinks at a German restaurant.',
    'Key phrases: Ich moechte (I would like), Ich haette gern (more polite), Was empfehlen Sie (what do you recommend). Der Kellner brings the Speisekarte (menu). Vorspeise (starter), Hauptgang (main), Nachtisch (dessert). For the bill: "Zahlen, bitte!" or "Die Rechnung, bitte!" Trinkgeld (tip) is usually 5-10%.',
    ['Ich moechte ein Schnitzel.','Was moechten Sie trinken?','Ich haette gern die Suppe.','Kann ich die Rechnung haben?'],
    'The modal verb "moechten" (would like)',
    [('die Speisekarte','menu'),('die Vorspeise','starter'),('der Hauptgang','main course'),('der Nachtisch','dessert'),('das Getraenk','drink'),('die Rechnung','bill'),('der Kellner','waiter'),('bestellen','to order'),('schmecken','to taste'),('empfehlen','to recommend')],
    [('How do you order water?','Ich moechte Wasser'),('What does "die Rechnung" mean?','the bill'),('Could I have the menu?','Kann ich die Speisekarte haben?')],
    'Familie Mueller geht ins Restaurant. Herr Mueller bestellt ein Schnitzel mit Pommes. Frau Mueller nimmt den Salat. Die Kinder bestellen Spaghetti. Der Kellner bringt Apfelsaft und Mineralwasser. Das Essen schmeckt allen sehr gut. Am Ende sagt Herr Mueller: "Zahlen, bitte!"',
    [('Was bestellt Herr Mueller?',['Salat','Schnitzel','Spaghetti','Fisch'],'Schnitzel'),('Was trinken die Kinder?',['Cola','Apfelsaft','Bier','Wasser'],'Apfelsaft')],
    'Kellner: Guten Abend, was moechten Sie bestellen? Gast: Ich haette gern die Tomatensuppe, dann den Braten. Kellner: Und zu trinken? Gast: Ein Glas Rotwein, bitte.',
    'Was ist die Vorspeise?',['Braten','Tomatensuppe','Salat','Brot'],'Tomatensuppe',
    'Write a full restaurant dialogue including greeting, ordering, and asking for the bill.',
    'Role play ordering in a German restaurant. Partner plays the waiter.',
    '"Ich moechte" = polite request. "Ich haette gern" = even more polite. "Kann ich ... haben?" = Can I have... Trinkgeld = tip (5-10%).')

add('A1', 11,
    'Das Wetter',
    'Describe the weather and seasons.',
    'Weather phrases use "es ist" + adjective: Es ist sonnig, Es ist kalt. For actions: Es regnet (it is raining), Es schneit (it is snowing). Seasons: der Fruehling (spring), der Sommer (summer), der Herbst (autumn), der Winter (winter). Use "im" for "in" a season: im Sommer. Question: Wie ist das Wetter?',
    ['Es ist sonnig.','Es regnet.','Wie ist das Wetter?','Im Sommer ist es warm.'],
    'Weather vocabulary and "es" phrases',
    [('das Wetter','weather'),('die Sonne','sun'),('der Regen','rain'),('der Schnee','snow'),('der Wind','wind'),('die Wolke','cloud'),('warm','warm'),('kalt','cold'),('heiss','hot'),('regnen','to rain')],
    [('How do you say "it is sunny"?','Es ist sonnig'),('What does "es regnet" mean?','it is raining'),('Translate "it is cold"','Es ist kalt')],
    'Heute ist das Wetter schoen. Die Sonne scheint und es ist warm, 25 Grad. Lisa geht mit ihren Freunden in den Park. Dort essen sie Eis. Aber morgen regnet es. Dann bleiben Lisa und ihre Freunde zu Hause.',
    [('Wie ist das Wetter heute?',['schoen und warm','schlecht','kalt','regnerisch'],'schoen und warm'),('Was macht Lisa bei Regen?',['in den Park gehen','zu Hause bleiben','Eis essen','Freunde treffen'],'zu Hause bleiben')],
    'A: Wie ist das Wetter heute? B: Es regnet leider. A: Schade, dann bleiben wir zu Hause.',
    'Wie ist das Wetter?',['sonnig','regnerisch','warm','kalt'],'regnerisch',
    'Write a weather report for 4 different days.',
    'Describe todays weather and what you will do accordingly.',
    'Use "Es ist" + adjective for conditions. "Es" + verb for actions (Es regnet, Es schneit). "Im" + season = in the season.')

add('A1', 12,
    'Farben und Kleidung',
    'Describe colors and clothing items.',
    'Colors: rot, blau, gruen, gelb, schwarz, weiss, grau, braun, lila, orange, pink. Clothing: der Pullover, die Jacke, das Hemd, die Hose, der Rock, der Schuh. Color adjectives before nouns change endings: ein roter Pullover, eine blaue Jacke, ein weisses Hemd. "tragen" = to wear (ich trage, du traegst, er traegt).',
    ['Ich trage einen roten Pullover.','Meine Jacke ist blau.','Welche Farbe hat dein Hemd?','Das Kleid ist wunderschoen.'],
    'Color adjectives and their endings',
    [('rot','red'),('blau','blue'),('gruen','green'),('gelb','yellow'),('schwarz','black'),('weiss','white'),('der Pullover','sweater'),('die Jacke','jacket'),('das Hemd','shirt'),('die Hose','pants'),('der Schuh','shoe'),('tragen','to wear')],
    [('How do you say "a red sweater"?','ein roter Pullover'),('What is "die Jacke"?','the jacket'),('Translate "blue shoes"','blaue Schuhe')],
    'Anna geht einkaufen. Sie kauft einen gruenen Rock und ein weisses Hemd. Ihr Bruder Tom kauft eine schwarze Hose und einen blauen Pullover. Die Sachen kosten 120 Euro insgesamt.',
    [('Was kauft Anna?',['gruener Rock, weisses Hemd','schwarze Hose','blauer Pullover','rote Schuhe'],'gruener Rock, weisses Hemd'),('Wie viel kosten die Sachen?',['80 Euro','100 Euro','120 Euro','90 Euro'],'120 Euro')],
    'A: Welche Farbe hat dein neues Kleid? B: Es ist rot. Ich liebe rote Kleider!',
    'Welche Farbe hat das Kleid?',['blau','rot','gruen','gelb'],'rot',
    'Describe your outfit today using colors and clothing vocabulary (5 sentences).',
    'Describe what you are wearing today in German.',
    'Adjective endings: ein roter Pullover (m.), eine rote Jacke (f.), ein rotes Hemd (n.) "tragen" = to wear.')

add('A1', 13,
    'Meine Familie',
    'Talk about your family members.',
    'Family vocabulary: der Vater, die Mutter, der Bruder, die Schwester, der Opa, die Oma, der Onkel, die Tante. Possessive articles: "mein" (my for m./n.), "meine" (my for f./pl.), "dein" (your). Questions: Hast du Geschwister? Wie viele Geschwister hast du?',
    ['Das ist meine Familie.','Ich habe einen Bruder.','Meine Mutter heisst Anna.','Hast du Geschwister?'],
    'Possessive articles "mein" and "dein"',
    [('der Vater','father'),('die Mutter','mother'),('der Bruder','brother'),('die Schwester','sister'),('der Opa','grandpa'),('die Oma','grandma'),('der Onkel','uncle'),('die Tante','aunt'),('die Familie','family'),('der Sohn','son'),('die Tochter','daughter')],
    [('Translate "my mother"','meine Mutter'),('How do you say "I have a brother"?','Ich habe einen Bruder'),('What is "die Schwester"?','sister')],
    'Thomas stellt seine Familie vor: Das ist mein Vater Klaus. Er ist Arzt. Meine Mutter Maria ist Lehrerin. Ich habe einen Bruder, Lukas, und eine Schwester, Emma. Wir haben auch einen Hund namens Bello. Meine Oma und mein Opa wohnen in Berlin.',
    [('Wer ist Klaus?',['der Vater','der Bruder','der Opa','der Onkel'],'der Vater'),('Wo wohnen die Grosseltern?',['Hamburg','Berlin','Muenchen','Koeln'],'Berlin')],
    'A: Hast du Geschwister? B: Ja, ich habe eine Schwester. Sie ist 10 Jahre alt.',
    'Hat B einen Bruder oder eine Schwester?',['einen Bruder','eine Schwester','keine','zwei'],'eine Schwester',
    'Write 8 sentences about your family with names and facts.',
    'Introduce your family with names, ages, and professions.',
    '"mein" = my for masc./neut. "meine" = my for fem./plural. "Hast du Geschwister?" = Do you have siblings?')

add('A1', 14,
    'Mein Zuhause',
    'Describe your home and its rooms.',
    'Rooms: das Wohnzimmer (living room), die Kueche (kitchen), das Schlafzimmer (bedroom), das Badezimmer (bathroom), der Flur (hallway). Furniture: der Tisch (table), der Stuhl (chair), das Bett (bed), der Schrank (closet), das Sofa (couch). Location prepositions: in, auf, unter, neben, zwischen. Use "im" = in dem.',
    ['Mein Haus hat fuenf Zimmer.','Das Wohnzimmer ist gross.','In der Kueche steht ein Tisch.','Mein Bett ist bequem.'],
    'Rooms, furniture, and location prepositions',
    [('das Haus','house'),('die Wohnung','apartment'),('das Wohnzimmer','living room'),('die Kueche','kitchen'),('das Schlafzimmer','bedroom'),('das Badezimmer','bathroom'),('der Tisch','table'),('der Stuhl','chair'),('das Bett','bed'),('der Schrank','closet'),('das Sofa','couch')],
    [('How do you say "the kitchen"?','die Kueche'),('What does "Schlafzimmer" mean?','bedroom'),('Translate "a large living room"','ein grosses Wohnzimmer')],
    'Marie wohnt in einer Wohnung in Berlin. Ihre Wohnung hat drei Zimmer: ein Wohnzimmer, ein Schlafzimmer und eine Kueche. Das Wohnzimmer ist hell und gross. In der Kueche gibt es einen neuen Tisch und vier Stuehle. Im Schlafzimmer steht ein grosses Bett.',
    [('Wie viele Zimmer hat Maries Wohnung?',['zwei','drei','vier','eins'],'drei'),('Was steht in der Kueche?',['ein Sofa','ein Tisch und Stuehle','ein Bett','ein Schrank'],'ein Tisch und Stuehle')],
    'A: Wie gross ist deine Wohnung? B: 70 Quadratmeter mit drei Zimmern.',
    'Wie gross ist die Wohnung?',['50 qm','60 qm','70 qm','80 qm'],'70 qm',
    'Describe your home: rooms, furniture, favorite room.',
    'Describe your dream house with at least 5 rooms.',
    '"in" + Dativ = location (wo). "in" + Akkusativ = direction (wohin). "auf dem Tisch" = on the table.')

add('A1', 15,
    'Mein Tagesablauf',
    'Describe your daily routine using separable prefix verbs.',
    'Separable prefix verbs: "aufstehen" (get up) -> Ich stehe um 7 Uhr auf. The prefix goes to the end. Activities: aufstehen, fruehstuecken, duschen, zur Arbeit gehen, Mittag essen, nach Hause kommen, fernsehen, schlafen gehen. Use "um" + time.',
    ['Ich stehe um 7 Uhr auf.','Dann fruehstuecke ich.','Um 8 Uhr gehe ich zur Arbeit.','Abends sehe ich fern.'],
    'Separable prefix verbs and time expressions',
    [('aufstehen','to get up'),('fruehstuecken','to have breakfast'),('duschen','to shower'),('die Arbeit','work'),('das Mittagessen','lunch'),('nach Hause kommen','to come home'),('fernsehen','to watch TV'),('schlafen gehen','to go to sleep'),('einkaufen','to shop'),('der Tagesablauf','daily routine')],
    [('Conjugate "aufstehen" for "ich"','stehe auf'),('What does "fernsehen" mean?','to watch TV'),('Translate "I go to bed at 10 PM"','Ich gehe um 22 Uhr schlafen')],
    'Lena steht jeden Tag um 6:30 Uhr auf. Sie fruehstueckt um 7 Uhr und geht um 8 Uhr zur Arbeit. Um 12:30 Uhr hat sie Mittagspause. Nach der Arbeit geht sie einkaufen. Um 19 Uhr kocht sie Abendessen. Um 22 Uhr geht sie ins Bett.',
    [('Wann steht Lena auf?',['6 Uhr','6:30 Uhr','7 Uhr','7:30 Uhr'],'6:30 Uhr'),('Was macht sie nach der Arbeit?',['einkaufen','schlafen','fernsehen','kochen'],'einkaufen')],
    'A: Wann stehst du auf? B: Um 7 Uhr, am Wochenende schlafe ich laenger.',
    'Wann steht B am Wochenende auf?',['frueher','spaeter','gleich','gar nicht'],'spaeter',
    'Write your daily routine with 5 separable verbs.',
    'Describe a weekday vs weekend day.',
    'Separable verbs: prefix separates in main clause. "aufstehen" -> "Ich stehe...auf". Prefix goes to end.')

# Continue with A1 16-25
add('A1', 16,
    'Koerperteile und Gesundheit',
    'Name body parts and describe symptoms.',
    'Body parts: der Kopf (head), die Hand (hand), der Arm (arm), das Bein (leg), der Fuss (foot), der Ruecken (back), der Bauch (stomach), das Auge (eye), der Mund (mouth). Pain: "Mein Kopf tut weh." "Ich habe Kopfschmerzen." Doctor: "Wo tut es weh?" "weh tun" uses Dativ: Mir tut der Kopf weh.',
    ['Mein Kopf tut weh.','Ich habe Halsschmerzen.','Der Arzt fragt: Wo tut es weh?','Mein Ruecken schmerzt.'],
    'Body parts and Schmerzen expressions',
    [('der Kopf','head'),('die Hand','hand'),('der Arm','arm'),('das Bein','leg'),('der Fuss','foot'),('der Ruecken','back'),('der Bauch','stomach'),('das Auge','eye'),('der Mund','mouth'),('weh tun','to hurt'),('die Schmerzen','pain (pl)')],
    [('How do you say "My head hurts"?','Mein Kopf tut weh'),('What is Kopfschmerzen?','headache'),('Translate "I have a stomachache"','Ich habe Bauchschmerzen')],
    'Herr Mueller fuehlt sich krank. Er geht zum Arzt: "Mein Kopf tut weh und ich habe Fieber." Der Arzt sagt: "Sie haben eine Erkaltung. Bleiben Sie drei Tage zu Hause und trinken Sie viel Tee."',
    [('Was hat Herr Mueller?',['Kopfschmerzen und Fieber','Bauchschmerzen','Halsschmerzen','Rueckenschmerzen'],'Kopfschmerzen und Fieber'),('Was empfiehlt der Arzt?',['Sport','zu Hause bleiben, Tee trinken','arbeiten','schlafen'],'zu Hause bleiben, Tee trinken')],
    'Arzt: Was fehlt Ihnen? Patient: Ich habe starke Rueckenschmerzen.',
    'Welche Schmerzen hat der Patient?',['Kopfschmerzen','Rueckenschmerzen','Bauchschmerzen','Halsschmerzen'],'Rueckenschmerzen',
    'Write a doctor-patient dialogue with 3 symptoms.',
    'Role play doctor and patient.',
    '"weh tun" + Dativ: Mir tut der Kopf weh. Schmerzen: Kopfschmerzen, Rueckenschmerzen, Bauchschmerzen, Halsschmerzen.')

add('A1', 17,
    'Tiere im Zoo',
    'Name animals and describe them.',
    'Animals: der Hund, die Katze, der Vogel, der Elefant, der Lowe, der Tiger, der Affe, die Schlange, das Pferd. Use "es gibt" (there is/are). Animals "fressen" (eat), people "essen". Adjectives: gross, stark, gefaehrlich, lustig, klein.',
    ['Im Zoo gibt es Loewen.','Der Elefant ist gross.','Der Affe frisst Bananen.','Die Schlangen sind gefaehrlich.'],
    'Animals and "es gibt"',
    [('der Hund','dog'),('die Katze','cat'),('der Vogel','bird'),('der Elefant','elephant'),('der Lowe','lion'),('der Tiger','tiger'),('der Affe','monkey'),('die Schlange','snake'),('das Pferd','horse'),('fressen','to eat (animals)'),('gefaerlich','dangerous')],
    [('How do you say "there are lions"?','Es gibt Loewen'),('What does the monkey eat?','Bananen'),('Translate "a big elephant"','ein grosser Elefant')],
    'Die Klasse 3a macht einen Ausflug in den Zoo. Sie sehen viele Tiere: Loewen, Tiger, Elefanten und Affen. Der Elefant ist sehr gross. Die Affen sind lustig und klettern auf Baeume. Ein Tiger schlaft im Schatten.',
    [('Welches Tier schlaft im Schatten?',['der Elefant','der Lowe','der Tiger','der Affe'],'der Tiger'),('Was machen die Affen?',['schlafen','klettern','fressen','schwimmen'],'klettern')],
    'A: Welches Tier magst du am liebsten? B: Ich mag Elefanten. Sie sind gross und klug!',
    'Welches Tier mag B?',['Loewen','Elefanten','Affen','Tiger'],'Elefanten',
    'Write a zoo story with 5 animals.',
    'Describe your favorite animal.',
    '"Es gibt" = there is/are. Animals "fressen". People "essen".')

# Write output
print(f"New lessons generated: {added}")

# Merge
all_lessons = existing + new_lessons
print(f"Total: {len(all_lessons)}")

counts = {}
for l in all_lessons:
    counts[l['level']] = counts.get(l['level'], 0) + 1
print(f"By level: {json.dumps(counts)}")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(all_lessons, f, ensure_ascii=False, indent=2)

print(f"Written to {OUTPUT}")
