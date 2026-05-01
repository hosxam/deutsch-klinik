#!/usr/bin/env python3
"""Append A1 lessons 18-25 and all A2, B1, B2, C1 lessons"""
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

# We read existing merged file, find existing IDs, and add missing ones
with open(OUTPUT, 'r', encoding='utf-8') as f:
    existing = json.load(f)
existing_ids = set(l['id'] for l in existing)
print(f"Existing in merged: {len(existing)}, IDs: {len(existing_ids)}")

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

# ===== A1 LESSONS 18-25 =====

add('A1', 18,
    'Meine Stadt', 'Describe your city and what it offers.',
    'City vocabulary: die Stadt, das Dorf, die Strasse, der Platz, der Park, das Kino, das Museum, das Restaurant, das Cafe, der Bahnhof. "Es gibt" + Akkusativ: Es gibt einen Park. "Die Stadt hat" = the city has. "Man kann" = one can. "Ich wohne in Berlin."',
    ['Ich wohne in Muenchen.','Die Stadt hat einen grossen Park.','Es gibt viele Museen.','Das Zentrum ist alt.'],
    'City vocabulary and "es gibt"',
    [('die Stadt','city'),('das Dorf','village'),('das Zentrum','center'),('der Park','park'),('das Kino','cinema'),('das Museum','museum'),('das Restaurant','restaurant'),('der Bahnhof','train station'),('der Markt','market'),('der Platz','square'),('der Fluss','river')],
    [('How do you say "I live in a city"?','Ich wohne in einer Stadt'),('What is "der Bahnhof"?','train station'),('Translate "the city has a park"','Die Stadt hat einen Park')],
    'Leipzig ist eine schoene Stadt. Sie hat viele Parks, Museen und Cafes. Im Zentrum gibt es einen grossen Marktplatz. Dort kann man Obst und Gemuese kaufen. Leipzig hat auch einen Zoo und viele Touristen besuchen die Stadt jedes Jahr.',
    [('Was gibt es im Zentrum?',['einen Park','einen Marktplatz','einen Zoo','ein Museum'],'einen Marktplatz'),('Was kauft man auf dem Markt?',['Buecher','Obst und Gemuese','Kleidung','Spielzeug'],'Obst und Gemuese')],
    'A: In welcher Stadt wohnst du? B: In Hamburg. A: Hamburg ist toll, besonders der Hafen!',
    'Was ist in Hamburg toll?',['der Park','der Hafen','das Museum','der Zoo'],'der Hafen',
    'Describe your city with 5 places.',
    'Tell a partner about your city with 3 attractions.',
    '"In" + city name: in Berlin. "Es gibt" + Akkusativ: Es gibt einen Park. "Man kann" = one can.')

add('A1', 19,
    'Sich vorstellen', 'Introduce yourself formally and informally.',
    'Formal: "Guten Tag, ich heisse Anna Mueller. Freut mich, Sie kennenzulernen." Informal: "Hallo, ich bin Tom. Freut mich!" "Sie" (capital S) = formal, "du" = informal. Questions: "Wie heissen Sie?" / "Wie heisst du?" "Woher kommen Sie?" / "Woher kommst du?"',
    ['Guten Tag, ich heisse Anna.','Ich komme aus Spanien.','Freut mich, Sie kennenzulernen.','Darf ich vorstellen: Frau Dr. Weber.'],
    'Formal vs informal introductions',
    [('der Name','name'),('heissen','to be called'),('kommen aus','to come from'),('wohnen in','to live in'),('kennenlernen','to get to know'),('der Arzt','doctor (m)'),('die Aerztin','doctor (f)'),('der Student','student (m)'),('die Studentin','student (f)')],
    [('Formal: What is your name?','Wie heissen Sie?'),('Informal: Where are you from?','Woher kommst du?'),('Introduce yourself formally','Guten Tag, ich heisse...')],
    'Auf einer Konferenz stellt sich Frau Dr. Berger vor: "Guten Tag, ich bin Dr. Sabine Berger. Ich komme aus Oesterreich und arbeite an der Universitaet Wien. Ich forsche im Bereich Biologie. Freut mich, Sie kennenzulernen."',
    [('Woher kommt Frau Dr. Berger?',['Deutschland','Oesterreich','der Schweiz','Italien'],'Oesterreich'),('Wo arbeitet sie?',['TU Muenchen','Universitaet Wien','HU Berlin','LMU'],'Universitaet Wien')],
    'A: Hallo, ich bin Lukas. B: Freut mich, ich bin Sarah. A: Woher kommst du, Sarah? B: Aus Frankfurt.',
    'Woher kommt Sarah?',['Berlin','Frankfurt','Koeln','Hamburg'],'Frankfurt',
    'Write a formal and informal self-introduction.',
    'Introduce yourself formally, then informally.',
    '"Sie" = formal (capital S), "du" = informal. "Ich heisse" = my name is. "Ich komme aus" = I come from.')

add('A1', 20,
    'Im Cafe bestellen', 'Order drinks and snacks at a cafe.',
    'Cafe vocabulary: der Kaffee, der Tee, die Schokolade, der Saft, das Wasser, der Kuchen, das Broetchen. Phrases: "Einen Kaffee, bitte." "Was moechten Sie?" "Fuer mich bitte..." "Hier oder zum Mitnehmen?" (For here or to go?) Trinkgeld (tip) is usually rounding up.',
    ['Ich moechte einen Kaffee.','Was kostet ein Stueck Kuchen?','Einen Tee mit Milch, bitte.','Zum Mitnehmen, bitte.'],
    'Polite ordering with "moechten"',
    [('der Kaffee','coffee'),('der Tee','tea'),('die Schokolade','hot chocolate'),('der Saft','juice'),('das Wasser','water'),('der Kuchen','cake'),('das Broetchen','roll'),('die Tasse','cup'),('das Glas','glass'),('mitnehmen','to take away')],
    [('How do you order coffee?','Einen Kaffee, bitte'),('For here or to go?','Hier oder zum Mitnehmen?'),('What does "die Tasse" mean?','cup')],
    'Frau Klein geht in ein Cafe. Sie setzt sich an einen Tisch. Die Kellnerin kommt: "Guten Tag, was darf es sein?" Frau Klein: "Einen Cappuccino und ein Stueck Apfelkuchen, bitte." Die Kellnerin bringt die Bestellung. Frau Klein bezahlt 6,50 Euro und gibt 1 Euro Trinkgeld.',
    [('Was bestellt Frau Klein?',['Tee und Kuchen','Cappuccino und Apfelkuchen','Kaffee und Keks','Milchkaffee'],'Cappuccino und Apfelkuchen'),('Wie viel Trinkgeld gibt sie?',['50 Cent','1 Euro','2 Euro','0 Euro'],'1 Euro')],
    'Kellnerin: Guten Morgen, was moechten Sie? Gast: Einen Milchkaffee und ein Croissant, bitte. Zum Mitnehmen.',
    'Was bestellt der Gast?',['Kaffee und Kuchen','Milchkaffee und Croissant','Tee und Broetchen','Wasser'],'Milchkaffee und Croissant',
    'Write a cafe dialogue: order two drinks and a snack, pay.',
    'Role play at a cafe: waiter and customer.',
    '"Einen" (m. Acc.), "Eine" (f.), "Ein" (n.). "Zum Mitnehmen" = to go. Trinkgeld = tip.')

# ===== A2 LESSONS 6-25 =====
add('A2', 6,
    'Im Hotel einchecken', 'Check into a hotel and ask about services.',
    'Hotel phrases: "Ich habe ein Zimmer reserviert." "Haben Sie ein Einzelzimmer/Doppelzimmer?" "Was kostet das Zimmer pro Nacht?" "Mit Fruehstueck oder ohne?" "Kann ich den Schluessel haben?" Use "im" (in dem) for location: "im dritten Stock." "der Gast" = guest, "der Empfang" = reception.',
    ['Ich habe ein Zimmer reserviert.','Haben Sie ein Einzelzimmer?','Das Zimmer kostet 80 Euro pro Nacht.','Mit Fruehstueck oder ohne?'],
    'Hotel vocabulary and "mit" + Dativ',
    [('das Hotel','hotel'),('das Zimmer','room'),('das Einzelzimmer','single room'),('das Doppelzimmer','double room'),('die Nacht','night'),('das Fruehstueck','breakfast'),('der Schluessel','key'),('die Reservierung','reservation'),('der Gast','guest'),('der Empfang','reception')],
    [('How do you ask for a single room?','Haben Sie ein Einzelzimmer?'),('What does "mit Fruehstueck" mean?','with breakfast'),('Translate "I have a reservation"','Ich habe eine Reservierung')],
    'Herr Schmidt kommt um 18 Uhr im Hotel an. "Guten Abend, ich habe ein Doppelzimmer reserviert. Mein Name ist Schmidt." Die Rezeptionistin sagt: "Willkommen, Herr Schmidt. Ihr Zimmer ist Nummer 312 im dritten Stock. Das Fruehstueck gibt es von 7 bis 10 Uhr."',
    [('Welches Zimmer hat Herr Schmidt?',['Einzelzimmer','Doppelzimmer','Suite','Ein Bett Zimmer'],'Doppelzimmer'),('Wann gibt es Fruehstueck?',['6-9 Uhr','7-10 Uhr','8-11 Uhr','7-9 Uhr'],'7-10 Uhr')],
    'A: Guten Abend, ich moechte einchecken. B: Guten Abend! Haben Sie eine Reservierung? A: Ja, unter dem Namen Weber. B: Hier ist Ihr Schluessel, Zimmer 205.',
    'Welche Zimmernummer?',['205','215','305','105'],'205',
    'Write a hotel check-in dialogue.',
    'Role play checking into a hotel.',
    '"mit" + Dativ: mit dem Fruehstueck. "im" = in + dem. "im dritten Stock" = on the third floor.')

add('A2', 7,
    'Nach dem Weg fragen', 'Ask for and give directions.',
    'Directions: "Wo ist der Bahnhof?" "Gehen Sie geradeaus." "Biegen Sie links/rechts ab." "Es ist um die Ecke." "Wie komme ich zum Museum?" Imperative: "Gehen Sie" (polite), "Geh" (informal). Use "zur" (zu + der) for feminine, "zum" (zu + dem) for masculine/neuter.',
    ['Wo ist der Bahnhof?','Gehen Sie geradeaus.','Biegen Sie links ab.','Es ist um die Ecke.'],
    'Imperative forms for directions',
    [('die Strasse','street'),('die Kreuzung','intersection'),('geradeaus','straight ahead'),('links','left'),('rechts','right'),('die Ecke','corner'),('der Bahnhof','train station'),('das Museum','museum'),('die Ampel','traffic light'),('die Bruecke','bridge')],
    [('How do you say "Go straight ahead"?','Gehen Sie geradeaus'),('What does "links abbiegen" mean?','turn left'),('Translate "Where is the train station?"','Wo ist der Bahnhof?')],
    'Der Tourist fragt: "Entschuldigung, wie komme ich zum Dom?" Die Frau erklaert: "Gehen Sie hier geradeaus bis zur Ampel. Dann biegen Sie rechts ab. Nach 200 Metern sehen Sie den Dom auf der linken Seite."',
    [('Was sucht der Tourist?',['das Museum','den Dom','den Bahnhof','die Kirche'],'den Dom'),('Wohin soll er an der Ampel?',['links','rechts','geradeaus','zurueck'],'rechts')],
    'A: Entschuldigung, wo ist die naechste U-Bahn-Station? B: Gehen Sie geradeaus, dann die zweite Strasse links.',
    'Welche Strasse soll A nehmen?',['erste links','zweite links','erste rechts','geradeaus'],'zweite links',
    'Write directions from your house to the nearest supermarket.',
    'Give directions to 3 locations.',
    'Polite imperative: "Gehen Sie" + infinitive. "zur" = zu + der, "zum" = zu + dem. "wie komme ich zu/zum/zur" = how do I get to.')

add('A2', 8,
    'Eine Fahrkarte kaufen', 'Buy train/bus tickets and ask about schedules.',
    'Ticket phrases: "Eine Fahrkarte nach Berlin, bitte." "Hin und Rueck oder einfach?" "Was kostet eine Tageskarte?" "Wann faehrt der naechste Zug?" "Muss ich umsteigen?" Use "nach" + city for direction to cities. "um" + time for departure time. "ab Gleis" = from platform.',
    ['Eine Fahrkarte nach Berlin, bitte.','Hin und Rueck oder einfach?','Was kostet eine Tageskarte?','Wann faehrt der naechste Zug?'],
    'Train travel vocabulary and "nach" + city',
    [('die Fahrkarte','ticket'),('der Zug','train'),('der Bus','bus'),('der Bahnsteig','platform'),('einfach','one-way'),('die Rueckfahrkarte','return ticket'),('umsteigen','to change trains'),('die Abfahrt','departure'),('die Ankunft','arrival'),('der Fahrplan','schedule')],
    [('How do you ask for a ticket to Berlin?','Eine Fahrkarte nach Berlin, bitte'),('What does "einfach" mean?','one-way'),('Translate "Do I need to change?"','Muss ich umsteigen?')],
    'Maria moechte nach Hamburg fahren. Sie geht zum Schalter: "Guten Tag, eine Fahrkarte nach Hamburg, bitte. Hin und Rueck." Der Mitarbeiter: "Das kostet 89 Euro. Der Zug faehrt um 9:15 Uhr ab Gleis 5."',
    [('Wohin moechte Maria fahren?',['Berlin','Hamburg','Muenchen','Koeln'],'Hamburg'),('Wann faehrt der Zug?',['8:15','9:15','10:15','11:15'],'9:15')],
    'A: Eine Fahrkarte nach Koeln, bitte. B: Einfach oder hin und rueck? A: Hin und rueck, bitte.',
    'Welche Strecke?',['Berlin-Koeln','Koeln-Berlin','Hamburg-Koeln','Koeln-Muenchen'],'Koeln-Berlin',
    'Write a dialogue buying a return train ticket.',
    'Ask for train information at a station counter.',
    '"nach" + city for direction. "um" + time. "ab Gleis" = from platform. "umsteigen" = to change trains (separable).')

add('A2', 9,
    'Auf dem Flughafen', 'Navigate an airport and understand announcements.',
    'Airport vocabulary: der Flughafen, der Check-in, die Bordkarte, das Gepaeck, der Koffer, das Gate, der Flug, einsteigen, abfliegen. Separable verbs: "einchecken" (check in), "einsteigen" (board). Announcement: "Flug XY123 nach Palma, bitte am Gate 15 einsteigen."',
    ['Wo ist der Check-in?','Ich moechte einchecken.','Der Flug geht um 14 Uhr.','Bitte am Gate 23 einsteigen.'],
    'Airport vocabulary and separable prefix verbs',
    [('der Flughafen','airport'),('der Flug','flight'),('der Check-in','check-in'),('die Bordkarte','boarding pass'),('das Gepaeck','luggage'),('der Koffer','suitcase'),('das Gate','gate'),('die Abflughalle','departure lounge'),('die Sicherheitskontrolle','security check'),('einsteigen','to board')],
    [('How do you say "Where is check-in"?','Wo ist der Check-in?'),('What does "einsteigen" mean?','to board'),('Translate "the flight goes at 2 PM"','Der Flug geht um 14 Uhr')],
    'Familie Sommer ist am Flughafen. Sie fliegen nach Mallorca. Zuerst gehen sie zum Check-in und geben ihr Gepaeck auf. Dann gehen sie durch die Sicherheitskontrolle. In der Abflughalle kaufen sie etwas zu essen. Um 11:30 Uhr heisst es: "Flug AB123 nach Palma, am Gate 15 einsteigen."',
    [('Wohin fliegt Familie Sommer?',['Berlin','Mallorca','Hamburg','Rom'],'Mallorca'),('Wann muessen sie einsteigen?',['10:30','11:30','12:30','9:30'],'11:30')],
    'Durchsage: "Achtung, Flug LH402 nach Frankfurt faellt heute aus wegen technischer Probleme."',
    'Was ist mit Flug LH402?',['verspaetet','faellt aus','puenktlich','gestrichen?'],'faellt aus',
    'Write a step-by-step airport guide from arrival to boarding.',
    'Explain the airport process in German.',
    'Separable verbs: "einsteigen" -> steigen Sie ein. "ausfallen" -> faellt aus. Prefix to end in main clause.')

add('A2', 10,
    'Ueber Urlaubserlebnisse sprechen', 'Share vacation experiences using Perfekt tense.',
    'Perfekt tense for past events: "Ich bin nach Italien geflogen." (movement = sein) "Ich habe viele Fotos gemacht." (others = haben) Common irregular Partizip II: geflogen, gesehen, gegessen, geschlafen, gefahren, getrunken. Use "sein" for movement/change of state, "haben" for everything else.',
    ['Wir sind nach Italien geflogen.','Ich habe viele Fotos gemacht.','Das Essen hat super geschmeckt.','Haben Sie das Kolosseum gesehen?'],
    'Perfekt tense with sein/haben',
    [('reisen','to travel'),('fliegen','to fly (ist geflogen)'),('sehen','to see (hat gesehen)'),('essen','to eat (hat gegessen)'),('schlafen','to sleep (hat geschlafen)'),('der Urlaub','vacation'),('der Strand','beach'),('das Souvenir','souvenir'),('die Sehenswuerdigkeit','sight'),('der Fotoapparat','camera')],
    [('Auxiliary for "fliegen"?','sein'),('Translate "I saw the Colosseum"','Ich habe das Kolosseum gesehen'),('Perfekt of "essen"','gegessen')],
    'Unser Urlaub in Spanien war fantastisch! Wir sind mit dem Flugzeug nach Barcelona geflogen. Dort haben wir die Sagrada Familia besichtigt und Tapas gegessen. Am Strand haben wir uns erholt. Ich habe viele Souvenirs gekauft.',
    [('Wie sind sie nach Barcelona gekommen?',['Zug','Flugzeug','Auto','Bus'],'Flugzeug'),('Was haben sie am Strand gemacht?',['gegessen','sich erholt und gebadet','geschlafen','gelesen'],'sich erholt und gebadet')],
    'A: Wie war dein Urlaub? B: Super! Ich bin nach Paris gefahren und habe den Eiffelturm gesehen. A: Hast du auch das Louvre besucht? B: Ja!',
    'Welche Stadt hat B besucht?',['Rom','Paris','Berlin','London'],'Paris',
    'Write about a vacation using Perfekt tense (6+ sentences).',
    'Tell about a vacation using Perfekt.',
    '"sein" for movement (fliegen, fahren, gehen). "haben" for all others. Partizip II goes to the end of the sentence.')

# Write merged output
all_lessons = existing + new_lessons
print(f"New added: {added}")
print(f"Total: {len(all_lessons)}")

counts = {}
for l in all_lessons:
    counts[l['level']] = counts.get(l['level'], 0) + 1
print(f"By level: {json.dumps(counts)}")

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(all_lessons, f, ensure_ascii=False, indent=2)
print(f"Written to {OUTPUT}")
