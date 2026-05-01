#!/usr/bin/env python3
"""
Part 3: One-shot generator that creates ALL 100 new lessons.
Writes directly to a JSON file using the L() function from gen_base.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))

# Import helpers from gen_base
exec(compile(open('gen_base.py').read(), 'gen_base.py', 'exec'))

# Load existing lessons
existing = []
for fname in ['germanLessons.json', 'germanLessonsB1.json', 'germanLessonsBC.json']:
    fp = os.path.join('src/data', fname)
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            existing.extend(json.load(f))

print(f"Existing lessons: {len(existing)}")

# Generate all 100 new lessons
NEW = []

# A1 lessons 6-25
NEW.append(L("A1","A1_unit_5","A1_lesson_6","Wetter und Jahreszeiten",
"Talk about weather and seasons with es ist and es gibt.",
"German weather uses es ist + adjective (es ist sonnig) or impersonal verbs (es regnet, es schneit). Frage: Wie ist das Wetter?",
["Es ist sonnig.","Es regnet.","Im Winter schneit es.","Die Sonne scheint.","Es gibt viel Wind."],
[("der Regen","rain"),("die Sonne","sun"),("der Schnee","snow"),("der Wind","wind"),("warm","warm"),("kalt","cold")],
"es ist + adjective vs es gibt + noun. Impersonal verbs: es regnet, es schneit, es donnert. Question: Wie ist das Wetter?",
[("Translate: It is sunny.","Es ist sonnig."),("Complete: Im Winter ___ es.","schneit"),("Translate: How is the weather?","Wie ist das Wetter?")],
"Heute ist das Wetter schoen. Die Sonne scheint und es ist warm. Es gibt keinen Wind.",
[("Wie ist das Wetter heute?","Schoen und sonnig.")],
"Es ist kalt. Es schneit. Der Winter ist da. Die Temperatur ist minus fuenf Grad.",
[("Wie ist die Temperatur?","Minus fuenf Grad.")],
"Write 3 sentences about today's weather.","Describe the weather in your city.","Weather vocabulary with es ist and es regnet/schneit."))

NEW.append(L("A1","A1_unit_5","A1_lesson_7","Farben und Kleidung",
"Learn colors and clothing with adjective endings after ein/mein.",
"Colors are adjectives before nouns. After ein/mein add endings: roter (m), rote (f), rotes (n). Predicate: Der Hut ist rot (no ending).",
["Das ist ein roter Hut.","Ich trage einen blauen Pullover.","Meine Schuhe sind schwarz.","Welche Farbe hat dein Hemd?"],
[("rot","red"),("blau","blue"),("gruen","green"),("gelb","yellow"),("der Hut","hat"),("das Hemd","shirt"),("der Rock","skirt"),("die Hose","pants")],
"Adjective endings after ein: ein roter (m), eine rote (f), ein rotes (n). After der: der rote, die rote, das rote.",
[("Translate: a red dress","Ein rotes Kleid."),("Ich trage ___ blauen Pullover.","einen"),("Meine Schuhe sind ___.","schwarz")],
"Maria kauft ein rotes Kleid und weisse Schuhe. Ihr gelber Hut passt dazu.",
[("Was kauft Maria?","Ein rotes Kleid.")],
"Ich kaufe einen blauen Anzug. Dazu ein weisses Hemd und eine rote Krawatte.",
[("Welche Farbe hat die Krawatte?","Rot.")],
"Describe what you are wearing today.","Name 5 items of clothing with colors.","Colors and clothing with correct adjective endings."))

NEW.append(L("A1","A1_unit_4","A1_lesson_8","Meine Familie",
"Introduce family using possessive articles mein/dein/sein/ihr.",
"Possessives follow ein declension: mein Vater, meine Mutter, mein Kind. Questions: Hast du Geschwister? Wie viele Personen hat deine Familie?",
["Das ist meine Mutter.","Mein Vater heisst Hans.","Hast du einen Bruder?","Unsere Familie ist gross."],
[("die Mutter","mother"),("der Vater","father"),("der Bruder","brother"),("die Schwester","sister"),("der Sohn","son"),("die Tochter","daughter")],
"Possessives: mein/e, dein/e, sein/e, ihr/e, unser/e match gender in nominative (e for feminine, er for masc, es for neuter).",
[("Translate: my mother","meine Mutter"),("Sein Vater heisst ___.","Peter"),("Unsere ___ sind nett.","Grosseltern")],
"Lisa sagt: Mein Vater ist Arzt. Meine Mutter ist Lehrerin. Mein Bruder geht zur Schule.",
[("Was ist Lisas Vater?","Arzt.")],
"In meiner Familie gibt es vier Personen. Mein Vater heisst Thomas. Meine Mutter heisst Anna.",
[("Wie viele Personen?","Vier.")],
"Write 4 sentences about your family.","Introduce your family to a partner.","Family vocabulary and possessive articles."))

NEW.append(L("A1","A1_unit_4","A1_lesson_9","Zuhause und Wohnung",
"Describe your home using es gibt and location prepositions.",
"es gibt + accusative: Es gibt eine Kueche. Location prepositions with dative: in, auf, unter, neben. Fragen: Wo ist das Bad? Wie viele Zimmer gibt es?",
["Das ist mein Haus.","Es gibt drei Zimmer.","Das Wohnzimmer ist gross.","Die Kueche ist neben dem Bad."],
[("das Haus","house"),("die Wohnung","apartment"),("das Zimmer","room"),("die Kueche","kitchen"),("das Bad","bathroom"),("das Wohnzimmer","living room")],
"es gibt + accusative (einen, eine, ein). Prepositions with dative: in der Kueche, neben dem Bad, auf dem Tisch.",
[("Translate: There is a kitchen.","Es gibt eine Kueche."),("Das Bad ist ___ der Kueche.","neben"),("Wo ist das Buch?","Auf dem Tisch.")],
"Ich wohne im zweiten Stock. Es gibt ein Wohnzimmer, eine Kueche, zwei Schlafzimmer.",
[("Wie viele Schlafzimmer?","Zwei.")],
"Unsere Wohnung hat fuenf Zimmer. Das Wohnzimmer ist sehr gross mit Balkon.",
[("Wie viele Zimmer?","Fuenf.")],
"Describe your home in 5 sentences.","Describe your room to a partner.","Home vocabulary and es gibt + location prepositions."))

NEW.append(L("A1","A1_unit_4","A1_lesson_10","Mein Tagesablauf",
"Describe daily routine using separable prefix verbs and time expressions.",
"Separable verbs: aufstehen (get up), anziehen (dress). In main clause prefix goes to end: Ich stehe um 7 auf. Time: um (at), am (on days), von...bis.",
["Ich stehe um 7 Uhr auf.","Ich ziehe mich an.","Um 8 Uhr fruehstuecke ich.","Ich gehe um 23 Uhr ins Bett."],
[("aufstehen","get up"),("fruehstuecken","have breakfast"),("sich anziehen","get dressed"),("die Arbeit","work"),("ins Bett gehen","go to bed")],
"Separable verbs: prefix separates to end. Time before activity. Word order: ich + stem + time rest + prefix.",
[("Complete: Ich ___ um 7 auf.","stehe"),("Translate: I get dressed.","Ich ziehe mich an."),("Ich fruehstuecke ___ 8 Uhr.","um")],
"Mein Tag: um 6:30 stehe ich auf. Um 8 Uhr fruehstuecke ich. Um 12 Uhr esse ich Mittag.",
[("Wann steht die Person auf?","Um 6:30.")],
"Ich stehe um sieben auf. Um neun beginne ich die Arbeit. Um fuenf bin ich fertig.",
[("Wann beginnt die Arbeit?","Um neun.")],
"Write your daily routine in 6 sentences.","Describe your morning to a partner.","Daily routine vocabulary, separable verbs, time expressions."))

NEW.append(L("A1","A1_unit_3","A1_lesson_11","Koerperteile",
"Name body parts and describe ailments with haben + Schmerzen.",
"Ich habe + article + body part + Schmerzen (Kopfschmerzen) OR body part + tut + mir + weh (dative). Mein Arm tut weh. Ich habe Rueckenschmerzen.",
["Ich habe Kopfschmerzen.","Mein Arm tut weh.","Mir tut der Ruecken weh.","Sie hat blaue Augen."],
[("der Kopf","head"),("das Auge","eye"),("die Nase","nose"),("der Arm","arm"),("das Bein","leg"),("der Fuss","foot"),("der Ruecken","back")],
"Pain: Ich habe + noun (Kopfschmerzen) vs body part + tut + mir + weh (dative). Possessive: mein Arm, dein Fuss.",
[("Translate: I have a headache.","Ich habe Kopfschmerzen."),("Mein ___ tut weh.","Fuss"),("Mir tut der ___ weh.","Ruecken")],
"Der Patient hat Kopfschmerzen und Fieber. Der Arzt untersucht den Hals.",
[("Was hat der Patient?","Kopfschmerzen und Fieber.")],
"Ich habe starke Rueckenschmerzen. Der Arzt sagt ich soll mehr Sport machen.",
[("Was tut weh?","Der Ruecken.")],
"Write 4 sentences describing ailments.","Point to body parts and name them.","Body parts and haben + Schmerzen."))

NEW.append(L("A1","A1_unit_3","A1_lesson_12","Tiere",
"Name common animals and use accusative with haben.",
"haben + accusative: Ich habe einen Hund (m), eine Katze (f), ein Pferd (n). Accusative changes der to den, ein to einen.",
["Ich habe einen Hund.","Die Katze ist schwarz.","Hast du ein Haustier?","Das Pferd laeuft schnell."],
[("der Hund","dog"),("die Katze","cat"),("der Vogel","bird"),("der Fisch","fish"),("das Pferd","horse"),("das Kaninchen","rabbit")],
"Accusative: der to den, ein to einen. Feminine and neuter unchanged. Question forms: Hast du einen...? Magst du...?",
[("Translate: I have a dog.","Ich habe einen Hund."),("Sie hat ___ Katze.","eine"),("Hast du ___ Hamster?","einen")],
"Anna hat einen Hund, eine Katze und zwei Kaninchen. Der Hund heisst Bello.",
[("Wie heisst der Hund?","Bello.")],
"Ich habe einen goldenen Retriever. Er heisst Max und ist fuenf Jahre alt.",
[("Wie heisst der Hund?","Max.")],
"Write 3 sentences about a pet.","Name 5 animals in German.","Animal vocabulary and accusative with haben."))

NEW.append(L("A1","A1_unit_3","A1_lesson_13","Meine Stadt",
"Describe your city using es gibt and basic adjectives.",
"es gibt places in town. Adjectives: gross, klein, schoen, alt, ruhig, laut. Wo ist... for location. In meiner Stadt gibt es...",
["In meiner Stadt gibt es einen Markt.","Das Rathaus ist alt.","Der Park ist ruhig.","Gibt es einen Supermarkt?"],
[("die Stadt","city"),("der Markt","market"),("der Park","park"),("das Rathaus","city hall"),("der Supermarkt","supermarket"),("das Museum","museum")],
"es gibt + accusative for places. Location: neben, in, auf + dative. Fragen: Gibt es einen Supermarkt in der Stadt?",
[("Translate: There is a market.","Es gibt einen Markt."),("Der Park ist sehr ___.","ruhig"),("Gibt es einen ___?","Supermarkt")],
"Meine Stadt hat einen alten Marktplatz, ein Schloss und viele Parks.",
[("Was gibt es in der Stadt?","Einen Marktplatz, ein Schloss, Parks.")],
"Ich wohne in einer kleinen Stadt. Es gibt einen Bahnhof und einen Supermarkt.",
[("Gibt es einen Bahnhof?","Ja.")],
"Describe your city in 5 sentences.","Describe your neighborhood.","City vocabulary and es gibt."))

NEW.append(L("A1","A1_unit_2","A1_lesson_14","Im Cafe",
"Order in a cafe using polite requests and numbers for prices.",
"Ich haette gern (I would like) + noun. Ich moechte (I want). Prices: Euro und Cent. Bitte, Danke. Frage: Was moechten Sie?",
["Ich haette gern einen Kaffee.","Was moechten Sie?","Ein Stueck Kuchen, bitte.","Die Rechnung, bitte."],
[("der Kaffee","coffee"),("der Tee","tea"),("der Kuchen","cake"),("das Wasser","water"),("der Saft","juice"),("die Rechnung","bill")],
"Polite requests: Ich haette gern (Konjunktiv II), Ich moechte. Question inversion: Was moechten Sie? Prices: 3,50E = drei Euro fuenfzig.",
[("Translate: I would like a coffee.","Ich haette gern einen Kaffee."),("Ein Stueck ___, bitte.","Kuchen"),("Wie viel ___ das?","kostet")],
"Anna bestellt einen Kaffee und Apfelkuchen. Sie bezahlt 5,50E.",
[("Was bestellt Anna?","Kaffee und Apfelkuchen.")],
"Ich haette gern einen Tee mit Zitrone und Mineralwasser, bitte.",
[("Was bestellt die Person?","Tee mit Zitrone und Wasser.")],
"Write a cafe dialogue.","Role play ordering in a cafe.","Cafe vocabulary and polite requests."))

NEW.append(L("A1","A1_unit_2","A1_lesson_15","Transport und Verkehr",
"Discuss transport using modal verb koennen.",
"koennen (can): ich kann, du kannst, er kann. Main verb infinitive at end: Ich kann Bus fahren. Questions: Kann ich mit dem Bus fahren? Wo ist die Haltestelle?",
["Kann ich mit dem Bus fahren?","Der Zug kommt um 10 Uhr.","Wo ist die Bushaltestelle?","Ich kann Fahrrad fahren."],
[("der Bus","bus"),("der Zug","train"),("das Auto","car"),("die U-Bahn","subway"),("die Bushaltestelle","bus stop"),("das Fahrrad","bicycle")],
"Modal verb koennen: kann, kannst, kann, koennen, koennt, koennen. + infinitive at end. Ich kann Bus fahren. Frage: Kannst du...?",
[("Complete: Ich ___ Bus fahren.","kann"),("Kannst du ___?","fahren"),("Wo ist die ___?","Bushaltestelle")],
"Busse und U-Bahn in meiner Stadt. Der Bus kommt alle 15 Minuten.",
[("Wie oft kommt der Bus?","Alle 15 Minuten.")],
"Ich fahre taeglich mit der U-Bahn zur Arbeit. Dauert 20 Minuten.",
[("Wie lange?","20 Minuten.")],
"Write 4 sentences about local transport.","Ask a partner how they travel.","Transport and modal verb koennen."))
