#!/usr/bin/env python3
"""Batch 3: A1 21-25, A2 11-20"""
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

# === A1 21-25 ===
add('A1', 21,
    'Transportmittel', 'Name means of transport and describe travel.',
    'Transport: das Auto, der Bus, die Bahn, die U-Bahn, der Zug, das Flugzeug, das Fahrrad, zu Fuss. "mit" + Dativ: mit dem Auto, mit der Bahn. "fahren" (to drive/ride), "nehmen" (to take). Question: "Wie kommst du zur Arbeit/Schule?" "zu Fuss" = on foot.',
    ['Ich fahre mit dem Bus.','Sie nimmt die U-Bahn.','Wie kommst du zur Schule?','Er faehrt Fahrrad.'],
    'Transport vocabulary with "mit" + Dativ',
    [('das Auto','car'),('der Bus','bus'),('die Bahn','train'),('die U-Bahn','subway'),('der Zug','train'),('das Flugzeug','airplane'),('das Fahrrad','bicycle'),('fahren','to drive/ride'),('nehmen','to take'),('zu Fuss','on foot')],
    [('How do you say "by bus"?','mit dem Bus'),('What does "nehmen" mean?','to take'),('Translate "I go by bicycle"','Ich fahre mit dem Fahrrad')],
    'Markus wohnt in einem Vorort von Berlin. Er faehrt jeden Morgen mit dem Zug in die Stadt zur Arbeit. Das dauert 30 Minuten. Seine Kollegin Lisa wohnt naeher und faehrt Fahrrad. Ihr Chef kommt mit dem Auto, weil er auch Kunden besucht.',
    [('Wie kommt Markus zur Arbeit?',['mit dem Bus','mit dem Zug','mit dem Auto','zu Fuss'],'mit dem Zug'),('Warum kommt der Chef mit dem Auto?',['schneller','er besucht Kunden','billiger','bequemer'],'er besucht Kunden')],
    'A: Wie kommst du zur Arbeit? B: Mit der U-Bahn, das ist am schnellsten.',
    'Wie kommt B zur Arbeit?',['Auto','U-Bahn','Bus','Fahrrad'],'U-Bahn',
    'Write 6 sentences about how you and your family travel.',
    'Ask 3 people how they get to work and report answers.',
    '"mit" + Dativ: mit dem Auto, mit der Bahn, mit dem Fahrrad. "zu Fuss" = on foot. "nehmen" = to take.')

add('A1', 22,
    'Telefonieren', 'Handle simple phone calls in German.',
    'Phone phrases: "Hallo, hier ist Anna." "Kann ich bitte Frau Mueller sprechen?" "Einen Moment, bitte." "Ich rufe spaeter nochmal an." "Wer spricht, bitte?" "Kann ich etwas ausrichten?" (Can I take a message?) "anrufen" = to call (separable: ich rufe an). "zurueckrufen" = call back.',
    ['Hallo, hier ist Anna.','Kann ich bitte Frau Mueller sprechen?','Einen Moment, bitte.','Ich rufe spaeter nochmal an.'],
    'Basic phone call vocabulary',
    [('anrufen','to call'),('das Telefon','telephone'),('das Handy','cell phone'),('sprechen mit','to speak with'),('die Nachricht','message'),('ausrichten','to pass on'),('zurueckrufen','to call back'),('besetzt','busy'),('der Anruf','the call'),('der Anrufbeantworter','answering machine')],
    [('How do you say "I am calling"?','Ich rufe an'),('What does "besetzt" mean?','busy'),('Can I leave a message?','Kann ich eine Nachricht hinterlassen?')],
    'Lisa ruft bei der Praxis Dr. Mueller an. "Guten Tag, hier ist Lisa Schmidt. Ich moechte einen Termin vereinbaren." Die Sprechstundenhilfe: "Gern, fuer wann moechten Sie kommen?" "Am besten naechste Woche Montag." "Da haben wir um 10 Uhr einen Termin frei."',
    [('Wen ruft Lisa an?',['die Firma','die Arztpraxis','das Restaurant','die Schule'],'die Arztpraxis'),('Wann ist der Termin?',['Dienstag','Montag 10 Uhr','Freitag','Mittwoch'],'Montag 10 Uhr')],
    'A: Firma Schmidt, guten Tag. B: Guten Tag, hier ist Peter Klein. Kann ich Herrn Schmidt sprechen?',
    'Mit wem moechte Klein sprechen?',['Frau Schmidt','Herrn Schmidt','der Sekretaerin','dem Chef'],'Herrn Schmidt',
    'Write a phone dialogue: calling a doctors office for an appointment.',
    'Practice a phone call: introduce yourself, ask for someone, leave a message.',
    '"anrufen" (separable: ich rufe an). "sprechen" (e->i: ich spreche, du sprichst). "Kann ich etwas ausrichten?" = Can I take a message?')

add('A1', 23,
    'Geburtstag feiern', 'Talk about birthday celebrations.',
    'Birthday vocabulary: der Geburtstag, die Party, das Geschenk, die Torte, die Kerze. "Wann hast du Geburtstag?" "Ich habe am 5. Mai Geburtstag." "Alles Gute zum Geburtstag!" (Happy Birthday) "einladen" = to invite (separable: ich lade ein). "feiern" = to celebrate.',
    ['Wann hast du Geburtstag?','Ich habe am 5. Mai Geburtstag.','Alles Gute zum Geburtstag!','Ich lade dich zu meiner Party ein.'],
    'Birthday vocabulary and celebrations',
    [('der Geburtstag','birthday'),('feiern','to celebrate'),('die Party','party'),('das Geschenk','present'),('die Torte','cake'),('die Kerze','candle'),('einladen','to invite'),('schenken','to give as gift'),('bekommen','to receive'),('der Gast','guest')],
    [('How do you say Happy Birthday?','Alles Gute zum Geburtstag'),('What does "einladen" mean?','to invite'),('When is your birthday?','Wann hast du Geburtstag?')],
    'Tim hat Geburtstag und wird 10 Jahre alt. Seine Mutter hat eine schoene Torte gebacken mit 10 Kerzen. Tim hat viele Geschenke bekommen: ein Buch, einen Fussball und ein neues Fahrrad. Seine Freunde sind zur Party eingeladen. Sie spielen, tanzen und essen Torte.',
    [('Wie alt wird Tim?',['8','10','12','9'],'10'),('Was hat Tim bekommen?',['einen Fussball','Geld','Buch, Fussball, Fahrrad','einen Hund'],'Buch, Fussball, Fahrrad')],
    'A: Wann hast du Geburtstag? B: Am 15. September. A: Dann kann ich kommen!',
    'Wann hat B Geburtstag?',['15. August','15. September','15. Oktober','15. Juli'],'15. September',
    'Write a birthday invitation with date, time, and location.',
    'Role play inviting someone to your birthday party.',
    '"Alles Gute zum Geburtstag" = Happy Birthday. "einladen" = to invite (separable). "Ich habe am [date] Geburtstag."')

add('A1', 24,
    'Zahlen und Rechnen', 'Use numbers and do simple math.',
    'Numbers 1-100: eins, zwei, drei, zehn, zwanzig, dreissig, vierzig, fuenfzig, sechzig, siebzig, achtzig, neunzig, hundert. 21+ = ones before tens: einundzwanzig, zweiundvierzig. Math: "plus", "minus", "mal", "geteilt durch", "gleich". "Wie viel ist 5 plus 3?" "5 plus 3 gleich 8."',
    ['Eins, zwei, drei, vier.','Zehn plus fuenf ist fuenfzehn.','Wie viel ist drei mal vier?','Zwanzig geteilt durch fuenf ist vier.'],
    'Numbers and math expressions',
    [('eins','one'),('zwei','two'),('drei','three'),('zehn','ten'),('zwanzig','twenty'),('hundert','hundred'),('plus','plus'),('minus','minus'),('mal','times'),('geteilt durch','divided by'),('gleich','equals')],
    [('What is 21 in German?','einundzwanzig'),('How do you say 10 + 5?','10 plus 5'),('Translate "equals"','gleich')],
    'Familie Schmidt hat eine Rechnung im Restaurant: Das Schnitzel kostet 12,50 Euro. Der Salat kostet 8,00 Euro. Die Getraenke kosten 6,50 Euro. Wie viel muessen sie insgesamt bezahlen? 12,50 plus 8,00 plus 6,50 gleich 27,00 Euro. Und sie geben 3 Euro Trinkgeld, also 30 Euro.',
    [('Was kostet das Schnitzel?',['10,50','12,50','14,50','8,00'],'12,50'),('Wie viel bezahlen sie insgesamt?',['25,00','27,00','30,00','28,00'],'27,00')],
    'A: Wie viel ist 12 plus 15? B: 27. A: Richtig! Und 27 minus 8? B: 19.',
    'Was ist 12 plus 15?',['25','27','28','30'],'27',
    'Write 5 math problems in German with answers.',
    'Quiz your partner with 3 math problems.',
    '21-99: ones before tens: einundzwanzig (21), zweiundvierzig (42). "gleich" = equals. Use "ist" instead of "gleich" conversationally.')

add('A1', 25,
    'In der Schule', 'Talk about school subjects and classroom objects.',
    'School vocabulary: die Schule, der Unterricht, das Fach, die Mathematik, Deutsch, Englisch, Geschichte, Biologie, der Lehrer, die Schueler, das Buch, der Bleistift, der Tisch, die Tafel. "Wir haben heute Mathe." "Ich mag Geschichte." "Der Lehrer erklaert die Grammatik." "Hausaufgaben" = homework.',
    ['Wir haben heute Mathe.','Ich mag Geschichte.','Der Lehrer erklaert die Grammatik.','Hast du deine Hausaufgaben gemacht?'],
    'School subjects and classroom objects',
    [('die Schule','school'),('der Unterricht','lesson'),('das Fach','subject'),('Mathematik','mathematics'),('Deutsch','German'),('Englisch','English'),('Geschichte','history'),('Biologie','biology'),('der Lehrer','teacher'),('der Schueler','student'),('die Hausaufgaben','homework'),('die Tafel','blackboard')],
    [('How do you say "We have math today"?','Wir haben heute Mathe'),('What does "Geschichte" mean?','history'),('Translate "the teacher explains"','Der Lehrer erklaert')],
    'Herr Mueller ist Mathelehrer. Jeden Montag hat er in der ersten Stunde Unterricht mit der Klasse 8a. Heute erklaert er Bruchrechnung. Lisa mag Mathe nicht so gern, aber ihr Freund Tom findet es interessant. Paula hilft Lisa bei den Hausaufgaben.',
    [('Welches Fach unterrichtet Herr Mueller?',['Deutsch','Mathe','Englisch','Geschichte'],'Mathe'),('Wer hilft Lisa bei den Hausaufgaben?',['der Lehrer','Tom','Paula','Herr Mueller'],'Paula')],
    'A: Welches Fach magst du am liebsten? B: Ich mag Biologie, Tiere finde ich interessant.',
    'Welches Fach mag B?',['Mathe','Biologie','Geschichte','Deutsch'],'Biologie',
    'Write your school schedule for one week with subjects and times.',
    'Describe your favorite subject and explain why.',
    'School subjects: Die Mathematik, die Biologie, die Geschichte. "Ich mag" = I like. "Der Lehrer erklaert" = the teacher explains.')

# === A2 11-20 ===
add('A2', 11,
    'Beim Arzt', 'Describe symptoms and get medical help.',
    'Doctor visit: "Ich habe Schmerzen." "Was fehlt Ihnen?" "Ich fuehle mich krank." "Ich habe Fieber/Husten/Schnupfen." "Seit wann haben Sie die Schmerzen?" "Der Arzt verschreibt Medikamente." "Krankmeldung" = sick note. "Krankenversicherungskarte" = health insurance card.',
    ['Ich habe starke Schmerzen.','Was fehlt Ihnen?','Ich habe Fieber und Husten.','Seit drei Tagen.'],
    'Doctor visit vocabulary and "sich fuehlen"',
    [('der Schmerz','pain'),('das Fieber','fever'),('der Husten','cough'),('der Schnupfen','runny nose'),('die Erkaltung','cold'),('verschreiben','to prescribe'),('das Medikament','medication'),('der Termin','appointment'),('die Krankenversicherung','health insurance'),('die Apotheke','pharmacy')],
    [('How do you say "I feel sick"?','Ich fuehle mich krank'),('What does "Fieber" mean?','fever'),('Translate "since when"','Seit wann?')],
    'Frau Meier geht zum Arzt, weil sie sich seit drei Tagen krank fuehlt. Der Arzt misst Fieber: 38,5 Grad. "Sie haben eine Grippe", sagt er. "Ich verschreibe Ihnen ein Medikament. Ruhen Sie sich aus und trinken Sie viel." Frau Meier geht in die Apotheke und holt das Medikament.',
    [('Wie lange fuehlt Frau Meier sich krank?',['einen Tag','drei Tage','eine Woche','zwei Wochen'],'drei Tage'),('Was verschreibt der Arzt?',['Tee','ein Medikament','Sport','Tabletten'],'ein Medikament')],
    'Arzt: Guten Tag, was kann ich fuer Sie tun? Patient: Ich habe Halsschmerzen und Husten. Arzt: Seit wann? Patient: Seit fuenf Tagen.',
    'Welche Symptome hat der Patient?',['Fieber','Halsschmerzen und Husten','Kopfschmerzen','Bauchschmerzen'],'Halsschmerzen und Husten',
    'Write a doctor visit dialogue with 3 symptoms and prescription.',
    'Role play: doctor and patient describing symptoms.',
    '"sich krank fuehlen" = to feel sick. "Seit" + time = since/for. "verschreiben" = to prescribe. "die Apotheke" = pharmacy.')

add('A2', 12,
    'Einkaufen und Mode', 'Go shopping for clothes, ask about sizes and prices.',
    'Shopping: "Ich moechte eine Hose anprobieren." "Haben Sie das in meiner Groesse?" "Welche Groesse haben Sie?" "Das ist zu gross/klein." "Passt mir gut." "Gibt es das in Rot?" "Der Pullover kostet 49,99 Euro." "Haben Sie eine Umkleidekabine?" (fitting room).',
    ['Ich moechte diese Hose anprobieren.','Haben Sie das in meiner Groesse?','Das ist zu gross.','Gibt es das in Blau?'],
    'Shopping for clothes: sizes, colors, prices',
    [('anprobieren','to try on'),('die Groesse','size'),('die Umkleidekabine','fitting room'),('passen','to fit'),('zu gross','too big'),('zu klein','too small'),('der Preis','price'),('bezahlen','to pay'),('die Kreditkarte','credit card'),('bar','cash')],
    [('How do you say "I want to try this on"?','Ich moechte das anprobieren'),('What does "passen" mean?','to fit'),('Translate "Do you have this in blue?"','Gibt es das in Blau?')],
    'Julia geht in ein Modegeschaeft. Sie sucht ein Kleid fuer eine Hochzeit. Die Verkaeuferin fragt: "Kann ich Ihnen helfen?" Julia: "Ja, ich suche ein blaues Kleid in Groesse 38." Die Verkaeuferin zeigt ihr drei Kleider. Julia probiert zwei an. Das dritte passt perfekt und kostet 79,99 Euro. Sie kauft es.',
    [('Was sucht Julia?',['eine Hose','ein Kleid','einen Rock','einen Pullover'],'ein Kleid'),('Welche Groesse hat Julia?',['36','38','40','42'],'38')],
    'A: Kann ich Ihnen helfen? B: Ja, ich suche eine schwarze Hose. A: Welche Groesse? B: Groesse 40, bitte.',
    'Welche Groesse sucht der Kunde?',['38','40','42','44'],'40',
    'Write a shopping dialogue: asking for help, trying on, buying.',
    'Role play: customer and shop assistant in a clothing store.',
    '"anprobieren" = to try on. "passen" = to fit. "zu gross/klein" = too big/small. "Gibt es das in..." = Do you have this in...')

add('A2', 13,
    'Im Kino', 'Talk about movies and going to the cinema.',
    'Cinema: der Film, das Kino, die Karte, der Platz, die Vorstellung, der Filmstart, der Trailer, die Hauptrolle, der Regisseur. "Welcher Film laeuft?" "Ich moechte zwei Karten fuer den Film um 20 Uhr." "Der Film hat mir gut gefallen." "Was kommt heute im Kino?" Genre: der Horrorfilm, die Komoedie, der Liebesfilm, der Actionfilm.',
    ['Ich moechte zwei Karten, bitte.','Welcher Film laeuft heute?','Der Film hat mir gut gefallen.','Was kommt im Kino?'],
    'Cinema vocabulary and opinion expressions',
    [('der Film','movie'),('das Kino','cinema'),('die Karte','ticket'),('die Vorstellung','screening'),('gefallen','to please'),('die Hauptrolle','lead role'),('der Regisseur','director'),('die Komoedie','comedy'),('der Horrorfilm','horror movie'),('spannend','exciting'),('langweilig','boring'),('lustig','funny')],
    [('How do you say "two tickets please"?','Zwei Karten, bitte'),('What does "gefallen" mean?','to like/please'),('Translate "the movie was exciting"','Der Film war spannend')],
    'Paul und Anna gehen ins Kino. Sie sehen den neuen Film "Der Himmel ueber Berlin". Paul findet den Film sehr spannend, aber Anna findet ihn ein bisschen langweilig. "Mir hat die Musik am besten gefallen", sagt Anna. Paul: "Ich fand die Schauspieler toll." Danach gehen sie noch etwas essen.',
    [('Welchen Film sehen Paul und Anna?',['eine Komoedie','Der Himmel ueber Berlin','einen Horrorfilm','einen Actionfilm'],'Der Himmel ueber Berlin'),('Was hat Anna am besten gefallen?',['die Schauspieler','die Musik','die Geschichte','das Ende'],'die Musik')],
    'A: Wie war der Film? B: Super! Sehr spannend. Die Hauptdarstellerin war grossartig.',
    'Wie fand B den Film?',['langweilig','spannend und super','schlecht','lustig'],'spannend und super',
    'Write a movie review in German (100 words).',
    'Describe a movie you saw recently and give your opinion.',
    '"Der Film hat mir (nicht) gefallen." = I (didnt) like the movie. "finden" = to find/think: Ich finde den Film spannend. "spannend" = exciting, "langweilig" = boring.')

add('A2', 14,
    'Essen zubereiten', 'Cook a meal and follow a recipe.',
    'Cooking: die Zutaten (ingredients), das Rezept (recipe), kochen (to cook), schneiden (to cut), mischen (to mix), braten (to fry), backen (to bake), kochen (to boil), der Herd (stove), der Ofen (oven), der Topf (pot), die Pfanne (pan). "Zuerst ... dann ... danach ... zum Schluss" (first, then, after that, finally).',
    ['Was sind die Zutaten?','Zuerst schneide ich das Gemuese.','Dann brate ich die Zwiebeln.','Das Rezept ist einfach.'],
    'Cooking vocabulary and sequential connectors',
    [('die Zutat','ingredient'),('das Rezept','recipe'),('schneiden','to cut'),('mischen','to mix'),('braten','to fry'),('kochen','to cook/boil'),('backen','to bake'),('der Herd','stove'),('der Ofen','oven'),('die Pfanne','pan'),('der Topf','pot'),('das Gemuese','vegetables')],
    [('How do you say "first I cut the onions"?','Zuerst schneide ich die Zwiebeln'),('What does "braten" mean?','to fry'),('Translate "mix the ingredients"','Die Zutaten mischen')],
    'Daniel kocht heute Spaghetti Bolognese. Zuerst schneidet er Zwiebeln und Knoblauch klein. Dann bratet er das Hackfleisch in einer Pfanne an. Danach gibt er die Tomatensauce dazu und lasst alles 20 Minuten kochen. Zum Schluss kocht er die Spaghetti und mischt alles. Fertig!',
    [('Was kocht Daniel?',['Pizza','Spaghetti Bolognese','Salat','Suppe'],'Spaghetti Bolognese'),('Wie lange kocht die Sauce?',['10 Minuten','20 Minuten','30 Minuten','5 Minuten'],'20 Minuten')],
    'A: Was kochst du heute? B: Ich mache einen Gemueseauflauf. A: Klingt lecker! Brauchst du Hilfe? B: Ja, kannst du das Gemuese schneiden?',
    'Was macht B heute?',['Salat','Gemueseauflauf','Suppe','Kuchen'],'Gemueseauflauf',
    'Write a recipe in German with ingredients and step-by-step instructions.',
    'Explain how to cook your favorite dish step by step.',
    'Use "zuerst" (first), "dann" (then), "danach" (after that), "zum Schluss" (finally). Recipes use present tense for instructions.')

add('A2', 15,
    'Feste und Traditionen', 'Describe holidays and cultural traditions.',
    'German holidays: Weihnachten (Christmas), Ostern (Easter), Silvester (New Years Eve), der Geburtstag, die Hochzeit (wedding). Traditions: "Weihnachten feiert man am 24. Dezember." "Zu Ostern bemalen wir Eier." "An Silvester gibt es Feuerwerk." "Man schenkt sich Geschenke." "Typisch deutsch: der Weihnachtsmarkt, der Adventskranz, der Osterhase."',
    ['Weihnachten feiert man am 24. Dezember.','Zu Ostern bemalen wir Eier.','An Silvester gibt es Feuerwerk.','Man schenkt sich Geschenke.'],
    'Holiday vocabulary and "man" (impersonal pronoun)',
    [('Weihnachten','Christmas'),('Ostern','Easter'),('Silvester','New Years Eve'),('feiern','to celebrate'),('das Feuerwerk','fireworks'),('der Weihnachtsmarkt','Christmas market'),('schenken','to give as a gift'),('der Brauch','custom'),('die Tradition','tradition'),('der Feiertag','public holiday')],
    [('How do you say "Christmas" in German?','Weihnachten'),('What does "feiern" mean?','to celebrate'),('Translate "one gives gifts"','Man schenkt Geschenke')],
    'In Deutschland ist Weihnachten das wichtigste Fest. Am 24. Dezember, dem Heiligabend, feiern die meisten Familien zu Hause. Es gibt einen Weihnachtsbaum mit Kerzen und Schmuck. Die Kinder bekommen Geschenke. Vor Weihnachten besuchen viele Leute den Weihnachtsmarkt. Dort gibt es Gluehwein, gebrannte Mandeln und Weihnachtsschmuck.',
    [('Wann wird Weihnachten in Deutschland gefeiert?',['25. Dezember','24. Dezember','6. Dezember','1. Januar'],'24. Dezember'),('Was gibt es auf dem Weihnachtsmarkt?',['Feuerwerk','Gluehwein und Mandeln','Ostereier','Kostueme'],'Gluehwein und Mandeln')],
    'A: Feiert ihr Weihnachten zu Hause? B: Ja, wir feiern mit der ganzen Familie am Heiligabend. A: Was gibt es zu essen? B: Wir machen Raclette.',
    'Wann feiert B Weihnachten?',['25. Dezember','24. Dezember','26. Dezember','1. Januar'],'24. Dezember',
    'Describe a holiday tradition from your culture or a German tradition.',
    'Talk about your favorite holiday and how you celebrate it.',
    '"man" = one/people (impersonal). "An Silvester" = on NYE. "Zu Ostern" = at Easter. "Weihnachten feiern" = to celebrate Christmas.')

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
