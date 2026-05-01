#!/usr/bin/env python3
"""
Generate 20 new lessons per level (A1-C1) and merge with existing 25 = 125 total.
Output: src/data/germanLessonsNew.json

Each lesson: level, unit, id, title, objective, explanation, examples[],
vocabulary[{word,translation}], grammarFocus, guidedPractice[{prompt,answer}],
independentPractice[{prompt,type}], readingTask{text,questions[{question,options[],answer}]},
listeningTask{script,questions[{question,options[],answer}]},
writingTask, speakingTask, reviewSummary
"""

import json, os, copy

DATA_DIR = os.path.join(os.path.dirname(__file__), 'src', 'data')

# ─── Helpers ───
def L(level, unit, lid, title, objective, explanation, examples, vocab_pairs,
      grammarFocus, guided_qs, reading_text, reading_qs,
      listening_script, listening_qs, writing, speaking, review):
    """Build a lesson object from compact args."""
    return {
        "level": level,
        "unit": unit,
        "id": lid,
        "title": title,
        "objective": objective,
        "explanation": explanation,
        "examples": examples if isinstance(examples, list) else [examples],
        "vocabulary": [{"word": w, "translation": t} for w, t in vocab_pairs],
        "grammarFocus": grammarFocus,
        "guidedPractice": [{"prompt": p, "answer": a} for p, a in guided_qs],
        "independentPractice": [
            {"prompt": "Write 5 sentences using the grammar from this lesson.", "type": "writing"},
            {"prompt": "Practice the vocabulary aloud.", "type": "speaking"}
        ],
        "readingTask": {
            "text": reading_text,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in reading_qs]
        },
        "listeningTask": {
            "script": listening_script,
            "questions": [{"question": q, "options": [], "answer": a} for q, a in listening_qs]
        },
        "writingTask": writing,
        "speakingTask": speaking,
        "reviewSummary": review
    }

# ─── Unit rules: lessons 6-10 = unit_1, 11-15 = unit_2, 16-20 = unit_3, 21-25 = unit_4 ───
def unit_for_level(level, lesson_num):
    if 6 <= lesson_num <= 10: return f"{level}_unit_1"
    if 11 <= lesson_num <= 15: return f"{level}_unit_2"
    if 16 <= lesson_num <= 20: return f"{level}_unit_3"
    if 21 <= lesson_num <= 25: return f"{level}_unit_4"
    return f"{level}_unit_5"

def lid(level, n):
    return f"{level}_lesson_{n}"

# ══════════════════════════════════════════════════════════════════════════════
# A1 Lessons 6-25
# ══════════════════════════════════════════════════════════════════════════════
A1_LESSONS = [
L("A1", unit_for_level("A1",6),"A1_lesson_6",
"Wetter und Jahreszeiten",
"Talk about weather, seasons, and use weather expressions with es ist and es gibt.",
"In German, weather uses es ist + adjective (es ist sonnig) or es regnet/schneit as impersonal verbs. Question: Wie ist das Wetter?",
["Es ist sonnig.","Es regnet.","Im Winter schneit es.","Die Sonne scheint.","Es gibt viel Wind."],
[("der Regen","rain"),("die Sonne","sun"),("der Schnee","snow"),("der Wind","wind"),("warm","warm"),("kalt","cold"),("der Sommer","summer"),("der Winter","winter")],
"es ist + adjective (sonnig, wolkig, regnerisch) vs es gibt + noun (Regen, Schnee). Impersonal verbs: es regnet, es schneit, es donnert.",
[("Translate: It is sunny.","Es ist sonnig."),("Complete: Im Winter ___ es. (snows)","schneit"),("How is the weather?","Wie ist das Wetter?"),("Translate: There is a lot of wind.","Es gibt viel Wind.")],
"Heute ist das Wetter wunderschoen. Die Sonne scheint und es ist warm. Es gibt keinen Wind und kein Regen.",
[("Wie ist das Wetter heute?","Schoen und sonnig."),("Was gibt es nicht?","Wind und Regen.")],
"Hoeren Sie: Heute ist es kalt. Es schneit. Ziehen Sie einen warmen Mantel an. Der Winter ist da. Die Temperatur ist minus fuenf Grad.",
[("Wie ist die Temperatur?","Minus fuenf Grad."),("Was sollen Sie anziehen?","Einen warmen Mantel.")],
"Write 3 sentences describing today's weather.",
"Describe the weather in your city in German.",
"Weather vocabulary (Regen, Schnee, Sonne, Wind), es ist + adjective, es regnet/schneit constructions."),

L("A1", unit_for_level("A1",7),"A1_lesson_7",
"Farben und Kleidung",
"Learn colors and clothing items with correct adjective endings after ein/mein/kein.",
"Colors are adjectives that come before nouns. After ein/mein/kein, add endings: ein roter Hut (m), eine rote Bluse (f), ein rotes Kleid (n).",
["Das ist ein roter Hut.","Ich trage einen blauen Pullover.","Meine Schuhe sind schwarz.","Welche Farbe hat dein Hemd?","Der Rock ist gruen."],
[("rot","red"),("blau","blue"),("gruen","green"),("gelb","yellow"),("der Hut","hat"),("das Hemd","shirt"),("der Rock","skirt"),("die Hose","pants"),("die Schuhe","shoes")],
"Adjective endings after ein: ein roter (m), eine rote (f), ein rotes (n). After definite article: der rote, die rote, das rote. Predicate adjectives: Der Hut ist rot (no ending).",
[("Translate: a red dress","Ein rotes Kleid."),("Ich trage ___ blauen Pullover. (a)","einen"),("Complete: Meine Schuhe sind ___. (black)","schwarz"),("Translate: the green skirt","Der gruene Rock.")],
"Maria geht einkaufen. Sie kauft ein rotes Kleid und weisse Schuhe. Ihr gelber Hut passt perfekt dazu. Die blaue Handtasche ist auch schoen.",
[("Was kauft Maria?","Ein rotes Kleid."),("Welche Farbe hat der Hut?","Gelb.")],
"Hoeren Sie: Ich kaufe einen blauen Anzug fuer die Hochzeit. Dazu trage ich ein weisses Hemd und eine rote Krawatte. Die braunen Schuhe sind neu.",
[("Was kauft die Person?","Einen blauen Anzug."),("Welche Farbe hat die Krawatte?","Rot.")],
"Describe what you are wearing today in 4 sentences.",
"Point to 5 objects and name their colors in German.",
"Colors (rot, blau, gruen, gelb), clothing (Hut, Hemd, Hose, Schuhe), adjective endings."),

L("A1", unit_for_level("A1",8),"A1_lesson_8",
"Meine Familie",
"Introduce family members and use possessive articles mein/dein/sein/ihr/unser.",
"Possessive articles: mein (my), dein (your), sein (his), ihr (her), unser (our). They follow the same declension as ein: mein Vater, meine Mutter, mein Kind.",
["Das ist meine Mutter.","Mein Vater heisst Hans.","Hast du einen Bruder?","Ihre Schwester ist fuenf Jahre alt.","Unsere Familie ist gross."],
[("die Mutter","mother"),("der Vater","father"),("der Bruder","brother"),("die Schwester","sister"),("der Sohn","son"),("die Tochter","daughter"),("die Grossmutter","grandmother"),("der Grossvater","grandfather")],
"Possessive articles: mein/e, dein/e, sein/e, ihr/e, unser/e. The ending matches noun gender in nominative (-e for feminine/plural, -er for masculine, -es for neuter).",
[("Translate: my mother","meine Mutter"),("Hast du ___ Bruder? (a)","einen"),("Sein Vater heisst ___. (Peter)","Peter"),("Complete: Unsere ___ sind nett. (grandparents)","Grosseltern")],
"Hallo, ich heisse Lisa. Das ist meine Familie. Mein Vater ist Arzt und meine Mutter ist Lehrerin. Mein Bruder geht zur Schule. Unsere Grossmutter wohnt bei uns.",
[("Was ist Lisas Vater?","Arzt."),("Wer wohnt bei der Familie?","Die Grossmutter.")],
"Hoeren Sie: In meiner Familie gibt es vier Personen. Mein Vater heisst Thomas. Meine Mutter heisst Anna. Ich habe einen Bruder und keine Schwester. Unser Haus ist nicht gross.",
[("Wie viele Personen gibt es?","Vier."),("Hat die Person eine Schwester?","Nein.")],
"Write 4 sentences introducing your family members.",
"Introduce your family to a partner in German.",
"Family vocabulary (Mutter, Vater, Bruder, Schwester), possessive articles mein/dein/sein/ihr/unser."),

L("A1", unit_for_level("A1",9),"A1_lesson_9",
"Zuhause und Wohnung",
"Describe your home, rooms, and furniture using es gibt and location prepositions.",
"Use es gibt (there is/are) with accusative to describe rooms. Location prepositions: in, auf, unter, neben, zwischen, hinter with dative (wo?) or accusative (wohin?).",
["Das ist mein Haus.","Es gibt drei Zimmer.","Das Wohnzimmer ist gross.","Die Kueche ist neben dem Bad.","Mein Bett steht im Schlafzimmer."],
[("das Haus","house"),("die Wohnung","apartment"),("das Zimmer","room"),("die Kueche","kitchen"),("das Bad","bathroom"),("das Wohnzimmer","living room"),("das Schlafzimmer","bedroom"),("der Tisch","table"),("der Stuhl","chair")],
"es gibt + accusative: Es gibt einen Garten. Prepositions with dative for location: auf dem Tisch, in der Kueche, neben dem Bad. Fragen: Wo ist...?",
[("Translate: There is a kitchen.","Es gibt eine Kueche."),("Complete: Das Bad ist ___ der Kueche. (next to)","neben"),("Wo ist das Buch? (on the table)","Auf dem Tisch."),("Translate: the living room is big","Das Wohnzimmer ist gross.")],
"Ich wohne in einer Wohnung im zweiten Stock. Es gibt ein Wohnzimmer, eine Kueche, zwei Schlafzimmer und ein Bad. Der Balkon ist klein, aber schoen.",
[("Wie viele Schlafzimmer gibt es?","Zwei."),("In welchem Stock ist die Wohnung?","Im zweiten Stock.")],
"Hoeren Sie: Unsere Wohnung hat fuenf Zimmer. Das Wohnzimmer ist sehr gross mit einem Balkon. Die Kueche ist modern. Mein Schlafzimmer ist klein aber gemuetlich.",
[("Wie viele Zimmer hat die Wohnung?","Fuenf."),("Wie ist das Schlafzimmer?","Klein aber gemuetlich.")],
"Describe your dream apartment in 5 sentences.",
"Describe your home to a partner using location prepositions.",
"Home vocabulary (Haus, Wohnung, Zimmer, Kueche), es gibt constructions, location prepositions."),

L("A1", unit_for_level("A1",10),"A1_lesson_10",
"Mein Tagesablauf",
"Describe your daily routine using separable prefix verbs and time expressions.",
"Separable prefix verbs: aufstehen (stand up), anziehen (dress), ausgehen (go out). In main clauses the prefix goes to the end: Ich stehe um 7 auf. Time: um (at specific time), am (on days), von...bis.",
["Ich stehe um 7 Uhr auf.","Ich ziehe mich an.","Um 8 Uhr fruehstuecke ich.","Ich gehe um 23 Uhr ins Bett.","Am Wochenende schlafe ich laenger."],
[("aufstehen","to get up"),("fruehstuecken","to have breakfast"),("das Fruehstueck","breakfast"),("das Mittagessen","lunch"),("das Abendessen","dinner"),("sich anziehen","to get dressed"),("ins Bett gehen","to go to bed"),("die Arbeit","work")],
"Separable verbs: prefixes (auf-, an-, aus-, mit-) separate and go to the end in main clauses. Word order: time (wann) before activity (was).",
[("Complete: Ich ___ um 7 auf. (stand)","stehe"),("Translate: I get dressed.","Ich ziehe mich an."),("Uebersetzen: I have breakfast at 8.","Ich fruehstuecke um 8 Uhr."),("Complete: Um 22 Uhr gehe ich ins ___.","Bett")],
"Mein Tag beginnt um 6:30. Ich stehe auf, dusche und ziehe mich an. Um 8 Uhr fruehstuecke ich. Um 12 Uhr esse ich zu Mittag. Um 18 Uhr komme ich nach Hause. Um 23 Uhr gehe ich ins Bett.",
[("Wann beginnt der Tag?","Um 6:30."),("Wann geht die Person ins Bett?","Um 23 Uhr.")],
"Hoeren Sie: Ich stehe um sieben Uhr auf. Zuerst fuehre ich den Hund aus. Dann fruehstuecke ich. Um neun Uhr beginne ich die Arbeit. Um fuenf Uhr bin ich fertig und gehe nach Hause.",
[("Wann fuehrt die Person den Hund aus?","Nach dem Aufstehen um sieben."),("Wann beginnt die Arbeit?","Um neun Uhr.")],
"Write your daily routine in 6 sentences using separable verbs.",
"Describe your morning routine step by step in German.",
"Daily routine vocabulary, separable prefix verbs (aufstehen, anziehen), time expressions with um/am/von...bis."),

L("A1", unit_for_level("A1",11),"A1_lesson_11",
"Koerperteile",
"Name body parts and describe physical ailments with haben and weh tun.",
"Use Ich habe + article + body part + Schmerzen (I have + body part pain) or Es tut mir + body part + weh. The dative pronoun mir is used with weh tun.",
["Ich habe Kopfschmerzen.","Mein Arm tut weh.","Der Arzt untersucht den Hals.","Sie hat blaue Augen.","Mir tut der Ruecken weh."],
[("der Kopf","head"),("das Auge","eye"),("die Nase","nose"),("der Mund","mouth"),("der Arm","arm"),("das Bein","leg"),("der Fuss","foot"),("der Ruecken","back"),("der Hals","neck/throat")],
"Pain expressions: Ich habe + Nomen + Schmerzen (Kopfschmerzen, Rueckenschmerzen) vs. Body part + tut + mir + weh. Both are common. Possessive: mein Arm, dein Bein.",
[("Translate: I have a headache.","Ich habe Kopfschmerzen."),("Complete: Mein ___ tut weh. (foot)","Fuss"),("Mir tut der ___ weh. (back)","Ruecken"),("Sie hat blaue ___. (eyes)","Augen")],
"Der Patient hat starke Kopfschmerzen und Fieber. Der Arzt untersucht den Hals. Er hoert die Lunge ab und misst den Blutdruck. Die Diagnose ist eine Erkältung.",
[("Was hat der Patient?","Kopfschmerzen und Fieber."),("Was macht der Arzt?","Untersucht den Hals und hoert die Lunge ab.")],
"Hoeren Sie: Ich habe starke Rueckenschmerzen. Mir tut der Ruecken weh, besonders nach dem Sitzen. Der Arzt sagt, ich soll mehr Sport machen und mich mehr bewegen.",
[("Was tut weh?","Der Ruecken."),("Was empfiehlt der Arzt?","Mehr Sport und Bewegung.")],
"Write 4 sentences: describe 2 body parts and 2 ailments.",
"Point to body parts on yourself and name them in German.",
"Body parts (Kopf, Auge, Arm, Bein, Ruecken), haben + Schmerzen, weh tun construction."),

L("A1", unit_for_level("A1",12),"A1_lesson_12",
"Tiere",
"Name common animals, describe pets, and use the accusative case with haben.",
"Animals are important vocabulary. Use haben (to have) with accusative article: Ich habe einen Hund (m), eine Katze (f), ein Pferd (n). The accusative changes der -> den, ein -> einen.",
["Ich habe einen Hund.","Die Katze ist schwarz.","Mein Hamster heisst Felix.","Hast du ein Haustier?","Das Pferd laeuft schnell."],
[("der Hund","dog"),("die Katze","cat"),("der Vogel","bird"),("der Fisch","fish"),("das Pferd","horse"),("der Hamster","hamster"),("das Kaninchen","rabbit"),("das Haustier","pet")],
"Accusative case with haben: der->den, die->die, das->das, ein->einen, eine->eine, ein->ein. Masculine nouns change, feminine and neuter stay the same.",
[("Translate: I have a dog.","Ich habe einen Hund."),("Complete: Sie hat ___ Katze. (a)","eine"),("Hast du ___ Hamster? (a)","einen"),("Uebersetzen: The bird is yellow.","Der Vogel ist gelb.")],
"Anna hat viele Haustiere. Sie hat einen Hund, eine Katze und zwei Kaninchen. Der Hund heisst Bello und ist sehr gross. Die Katze ist klein und schwarz. Die Kaninchen sind weiss.",
[("Welche Haustiere hat Anna?","Einen Hund, eine Katze, zwei Kaninchen."),("Wie heisst der Hund?","Bello.")],
"Hoeren Sie: Mein Lieblingstier ist der Hund. Ich habe einen goldenen Retriever. Er heisst Max. Er ist fuenf Jahre alt und sehr freundlich. Wir gehen jeden Tag spazieren.",
[("Wie heisst der Hund?","Max."),("Wie alt ist der Hund?","Fuenf Jahre.")],
"Write 3 sentences: describe your pet or a pet you'd like to have.",
"Name 5 animals in German and say one fact about each.",
"Animal vocabulary (Hund, Katze, Vogel, Pferd), accusative with haben, describing pets."),

L("A1", unit_for_level("A1",13),"A1_lesson_13",
"Meine Stadt",
"Describe your city or neighborhood using es gibt, location phrases, and basic adjectives.",
"Use es gibt (there is/are) with accusative to list places. Wo ist...? to ask for locations. Use adjectives: gross, klein, schoen, alt, neu, modern, ruhig, laut.",
["In meiner Stadt gibt es einen Markt.","Das Rathaus ist alt.","Der Park ist ruhig.","Gibt es einen Supermarkt?","Die Stadt ist sehr schoen."],
[("die Stadt","city"),("der Markt","market"),("der Park","park"),("das Rathaus","city hall"),("der Supermarkt","supermarket"),("die Kirche","church"),("das Museum","museum"),("der Bahnhof","train station"),("das Krankenhaus","hospital")],
"Wo? questions with location: Wo ist der Bahnhof? Der Bahnhof ist neben dem Park. Prepositions: in der Stadt, auf dem Markt, an der Kirche.",
[("Translate: There is a market.","Es gibt einen Markt."),("Complete: Der Park ist sehr ___. (quiet)","ruhig"),("Wo ist das Museum? (next to the church)","Neben der Kirche."),("Translate: Is there a supermarket?","Gibt es einen Supermarkt?")],
"Meine Stadt heisst Heidelberg. Es gibt eine alte Brucke, ein grosses Schloss und viele Parks. Der Marktplatz ist im Zentrum. Das Rathaus ist sehr alt und schoen.",
[("Wie heisst die Stadt?","Heidelberg."),("Was gibt es in der Stadt?","Eine Brucke, ein Schloss, Parks und einen Marktplatz.")],
"Hoeren Sie: Ich wohne in einer kleinen Stadt. Es gibt einen Bahnhof, einen Supermarkt und ein Krankenhaus. Der Park ist im Zentrum. Die Stadt ist ruhig und sicher.",
[("Gibt es ein Krankenhaus?","Ja."),("Wie ist die Stadt?","Ruhig und sicher.")],
"Describe your city in 5 sentences using es gibt and location phrases.",
"Describe your neighborhood to a partner.",
"City vocabulary (Stadt, Markt, Bahnhof, Museum), es gibt constructions, adjectives for describing places."),

L("A1", unit_for_level("A1",14),"A1_lesson_14",
"Im Cafe",
"Order food and drinks in a cafe, use polite requests, and practice basic numbers for prices.",
"In a cafe use Ich haette gern... (I would like) or Ich moechte... Ich bekomme... (also common). Bitte (please) and Danke (thanks). Prices: Euro und Cent.",
["Ich haette gern einen Kaffee.","Was moechten Sie?","Ein Stueck Kuchen, bitte.","Die Rechnung, bitte.","Wie viel kostet das?"],
[("der Kaffee","coffee"),("der Tee","tea"),("der Kuchen","cake"),("das Wasser","water"),("der Saft","juice"),("das Broetchen","bread roll"),("die Rechnung","the bill"),("kosten","to cost"),("bezahlen","to pay")],
"Polite requests with Konjunktiv II: Ich haette gern (I would like), Ich moechte (I would like to). Question: Was moechten Sie? (What would you like?). Prices: funf Euro, drei Euro fuenfzig.",
[("Translate: I would like a coffee.","Ich haette gern einen Kaffee."),("Complete: Ein Stueck ___, bitte. (cake)","Kuchen"),("Wie ___ kostet das? (much)","viel"),("Uebersetzen: The bill, please.","Die Rechnung, bitte.")],
"Anna geht ins Cafe. Sie bestellt einen Kaffee und ein Stueck Apfelkuchen. Der Kaffee kostet 3 Euro und der Kuchen 2 Euro 50. Sie bezahlt 5 Euro 50.",
[("Was bestellt Anna?","Kaffee und Apfelkuchen."),("Wie viel bezahlt sie?","5 Euro 50.")],
"Hoeren Sie: Guten Tag, was moechten Sie? Ich haette gern einen Tee mit Zitrone und ein Wasser. Moechten Sie auch etwas zu essen? Ja, ein Broetchen mit Kaese, bitte.",
[("Was bestellt die Person zu trinken?","Tee mit Zitrone und Wasser."),("Was isst die Person?","Ein Broetchen mit Kaese.")],
"Write a short dialogue between a customer and a waiter in a cafe.",
"Role play ordering in a cafe with a partner.",
"Cafe vocabulary (Kaffee, Tee, Kuchen, Rechnung), polite requests (Ich haette gern, Ich moechte), prices and numbers."),

L("A1", unit_for_level("A1",15),"A1_lesson_15",
"Transport und Verkehr",
"Discuss transportation options and use modal verb koennen to express ability.",
"Modal verb koennen (can): ich kann, du kannst, er/sie kann, wir koennen, ihr koennt, sie/Sie koennen. The main verb goes to the end in infinitive: Ich kann Bus fahren.",
["Kann ich mit dem Bus fahren?","Der Zug kommt um 10 Uhr.","Wo ist die Bushaltestelle?","Ich kann mit dem Auto fahren.","Die U-Bahn ist am schnellsten."],
[("der Bus","bus"),("der Zug","train"),("das Auto","car"),("die U-Bahn","subway"),("die Bushaltestelle","bus stop"),("der Bahnhof","train station"),("das Taxi","taxi"),("das Fahrrad","bicycle"),("fahren","to drive/ride")],
"Modal verb koennen in present: kann, kannst, kann, koennen, koennt, koennen. Main verb infinitive at end: Ich kann Bus fahren. Ich kann Deutsch sprechen.",
[("Complete: Ich ___ mit dem Bus fahren. (can)","kann"),("Translate: Can you drive?","Kannst du fahren?"),("Wo ist die ___? (bus stop)","Bushaltestelle"),("Der ___ kommt um 10 Uhr. (train)","Zug")],
"In meiner Stadt gibt es Busse und eine U-Bahn. Ich kann mit dem Bus zur Arbeit fahren. Der Bus kommt alle 15 Minuten. Das Taxi ist teurer, aber schneller.",
[("Welche Verkehrsmittel gibt es?","Busse und U-Bahn."),("Wie oft kommt der Bus?","Alle 15 Minuten.")],
"Hoeren Sie: Ich fahre jeden Tag mit der U-Bahn zur Arbeit. Ich kann in 20 Minuten ins Zentrum fahren. Mein Freund faehrt lieber mit dem Fahrrad, weil es gesuender ist.",
[("Wie lange faehrt die Person mit der U-Bahn?","20 Minuten."),("Warum faehrt der Freund Fahrrad?","Weil es gesuender ist.")],
"Write 4 sentences about how you travel in your city.",
"Ask a partner how they get to work/school.",
"Transport vocabulary (Bus, Zug, Auto, U-Bahn), modal verb koennen, directions to places."),
]

print(f"A1: {len(A1_LESSONS)} lessons generated")
