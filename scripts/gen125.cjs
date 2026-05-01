/**
 * Complete generator for 100 German lessons (20 per level A1-C1).
 * 
 * Run: node scripts/gen125.cjs
 * 
 * This script generates ALL lesson data using a compact builder pattern,
 * then writes the combined JSON to src/data/germanLessonsNew.json
 */
"use strict";
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "src", "data");
const OUT = path.join(DATA_DIR, "germanLessonsNew.json");

function L(level, num, title, objective, explanation, examples, gFocus, vocabs, gps, rText, rQs, lScript, lQ, wP, sP, summary) {
  const ui = Math.min(Math.floor((num - 1) / 5), 4) + 1;
  return {
    level, unit: level + "_unit_" + ui, id: level + "_lesson_" + num,
    title, objective, explanation, examples: examples.split("|"),
    grammarFocus: gFocus,
    vocabulary: vocabs.split(";").map(x => { const [word,translation,example] = x.split(","); return {word,translation,example}; }),
    guidedPractice: gps.split(";").map(x => { const [prompt,answer] = x.split(","); return {prompt,answer}; }),
    readingTask: (() => {
      const parts = rQs.split("~");
      return { text: rText, questions: parts.map(p => { const [q,a,b,c,ans] = p.split("|"); return {question:q, options:[a,b,c], answer:ans}; }) };
    })(),
    listeningTask: { script: lScript, questions: [{question:lQ.split("|")[0], options:lQ.split("|").slice(1,4), answer:lQ.split("|")[4]}] },
    writingTask: { prompt: wP },
    speakingTask: { prompt: sP },
    reviewSummary: summary
  };
}

const all = [];

// ── A1 Lessons 6-25 ──────────────────────────────────────────
all.push(L("A1",6,
  "Die Wohnung beschreiben",
  "Describe rooms and furniture using 'es gibt' and location prepositions.",
  "Use 'es gibt' (there is/are) plus accusative. Prepositions like 'auf', 'neben', 'in' take dative for location.",
  "In meiner Wohnung gibt es drei Zimmer.|Das Schlafzimmer ist neben dem Bad.|Der Tisch steht in der K\u00fcche.|Die Lampe h\u00e4ngt \u00fcber dem Tisch.",
  "\"Es gibt\" + Accusative. Dative after location prepositions.",
  "die Wohnung,apartment,Meine Wohnung ist klein.;das Zimmer,room,Ein gro\u00dfes Fenster.;die K\u00fcche,kitchen,Moderne K\u00fcche.;das Schlafzimmer,bedroom,Ein Bett.;das Bad,bathroom,Sehr sauber.;der Tisch,table,Aus Holz.;der Stuhl,chair,Eine Katze sitzt drauf.",
  "In my apartment there are three rooms.,In meiner Wohnung gibt es drei Zimmer.;Bedroom next to bathroom.,Das Schlafzimmer ist neben dem Bad.;Table in kitchen.,Der Tisch steht in der K\u00fcche.",
  "Mona zeigt ihrer Freundin die neue Wohnung. \u201eHier ist das Wohnzimmer. Es gibt ein gro\u00dfes Sofa und einen Fernseher. Die K\u00fcche ist modern. Das Bad ist klein, aber sch\u00f6n.\u201c",
  "Was gibt es im Wohnzimmer?|Ein Bett und einen Schrank|Ein gro\u00dfes Sofa und einen Fernseher|Einen Tisch und vier St\u00fchle|Ein gro\u00dfes Sofa und einen Fernseher~Wie ist das Bad?|gro\u00df und modern|klein und schmutzig|klein, aber sch\u00f6n|klein, aber sch\u00f6n",
  "Lukas: \u201eWillkommen in meiner neuen Wohnung! Es gibt vier Zimmer: ein Wohnzimmer, eine K\u00fcche, ein Schlafzimmer und ein Bad.\u201c",
  "Wie viele Zimmer hat die Wohnung?|Drei|Vier|F\u00fcnf|Vier",
  "Beschreibe deine Wohnung oder dein Haus in 5 S\u00e4tzen. Welche R\u00e4ume gibt es? Was ist wo?",
  "Zeige und beschreibe dein Lieblingszimmer zu Hause. Nenne mindestens 3 Dinge, die darin sind.",
  "Du hast gelernt, R\u00e4ume und M\u00f6bel zu beschreiben und \u201ees gibt\u201c mit dem Akkusativ zu verwenden."
));

all.push(L("A1",7,"M\u00f6bel und Farben","Name furniture items and describe by color and material.","Adjectives before nouns need endings: ein brauner Tisch (m), eine wei\u00dfe Lampe (f), ein rotes Buch (n). Use 'aus' + material.",
"Ich habe einen braunen Holztisch.|Die wei\u00dfe Lampe steht auf dem Tisch.|Mein Bett ist aus Metall.|Das rote Sofa ist sehr bequem.",
"Adjektivendungen Nominativ: ein brauner Tisch, eine wei\u00dfe Lampe, ein rotes Sofa.",
"das Sofa,sofa,Grau und neu.;der Schrank,wardrobe,Kleider drin.;das Regal,shelf,B\u00fccher drin.;die Lampe,lamp,Leuchtet hell.;der Teppich,carpet,Weich.;das Bett,bed,Sehr gro\u00df.;der Vorhang,curtain,Blau.",
"Brown table (nominative).,ein brauner Tisch;White lamp.,eine wei\u00dfe Lampe;Bed is wood.,Mein Bett ist aus Holz.",
"Anna richtet ihr Zimmer ein. \u201eIch m\u00f6chte ein wei\u00dfes Regal und einen blauen Teppich. Die Lampe soll aus Metall sein und das Bett aus Holz.\u201c",
"Welche Farbe hat das Regal?|Blau|Wei\u00df|Braun|Wei\u00df~Aus welchem Material ist das Bett?|Metall|Plastik|Holz|Holz",
"Verk\u00e4ufer: \u201eWir haben dieses graue Sofa aus Stoff f\u00fcr 599 Euro. Das braune Ledersofa kostet 899 Euro.\u201c",
"Wie viel kostet das graue Sofa?|499 Euro|599 Euro|899 Euro|599 Euro",
"Schreibe 5 S\u00e4tze \u00fcber deine Lieblingsm\u00f6bel. Beschreibe Farbe, Material und wo sie stehen.",
"Beschreibe einen Raum in deiner Wohnung mit mindestens 4 M\u00f6beln und ihren Farben.",
"M\u00f6bel und ihre Beschreibung mit Adjektivendungen gelernt."
));

all.push(L("A1",8,"Das Wetter","Talk about weather and seasons using 'es ist' and weather verbs.","Weather uses 'es' as subject: 'Es ist sonnig.', 'Es regnet.', 'Es schneit.' Seasons: Fr\u00fchling, Sommer, Herbst, Winter.",
"Es ist sonnig und warm.|Es regnet heute sehr stark.|Im Winter schneit es oft.|Wie ist das Wetter morgen?",
"\"Es\" as impersonal subject. Verbs: regnen, schneien.",
"die Sonne,sun,Scheint hell.;der Regen,rain,H\u00f6rt bald auf.;der Schnee,snow,Auf den Bergen.;der Wind,wind,Weht stark.;die Wolke,cloud,Viele Wolken.;die Temperatur,temperature,25 Grad.;der Fr\u00fchling,spring,Blumen bl\u00fchen.",
"It is sunny.,Es ist sonnig.;It is raining.,Es regnet.;Weather tomorrow?,Wie ist das Wetter morgen?",
"Der Wetterbericht: \u201eMorgen scheint die Sonne in ganz Deutschland. Temperaturen zwischen 22 und 28 Grad.\u201c",
"Wie ist das Wetter morgen?|Es regnet.|Es ist sonnig.|Es schneit.|Es ist sonnig.~Wie warm wird es?|18 Grad|22 bis 28 Grad|30 Grad|22 bis 28 Grad",
"Heute ist es bew\u00f6lkt und regnet manchmal. Die h\u00f6chste Temperatur ist 15 Grad.",
"Wie ist das Wetter heute?|sonnig und warm|bew\u00f6lkt mit Regen|kalt mit Schnee|bew\u00f6lkt mit Regen",
"Schreibe den Wetterbericht f\u00fcr morgen in 4 S\u00e4tzen.",
"Beschreibe das heutige Wetter in deiner Stadt. Welche Jahreszeit haben wir?",
"Wetter und Jahreszeiten gelernt."
));

all.push(L("A1",9,"Kleidung kaufen","Buy clothes and use the accusative case.","Accusative for direct objects. Masculine: der \u2192 den, ein \u2192 einen. Feminine and neuter unchanged.",
"Ich kaufe einen blauen Rock.|Sie tr\u00e4gt eine rote Jacke.|Er sucht ein wei\u00dfes Hemd.|Haben Sie diese Hose in Schwarz?",
"Accusative: der \u2192 den, ein \u2192 einen.",
"der Rock,skirt,Zu lang.;die Jacke,jacket,Warm.;das Hemd,shirt,Muss geb\u00fcgelt werden.;die Hose,pants,Passt perfekt.;der Schuh,shoe,Bequem.;anziehen,to put on,Jacke anziehen.;tragen,to wear,Anzug tragen.",
"I buy a blue skirt.,Ich kaufe einen blauen Rock.;She wears a red jacket.,Sie tr\u00e4gt eine rote Jacke.;These pants in black?,Haben Sie diese Hose in Schwarz?",
"\u201eIch suche einen warmen Pullover und eine schwarze Hose. Haben Sie das in Gr\u00f6\u00dfe M?\u201c",
"Was sucht die Person?|Einen Rock und eine Jacke|Einen Pullover und eine Hose|Ein Hemd und Schuhe|Einen Pullover und eine Hose~Welche Gr\u00f6\u00dfe?|S|M|L|M",
"Verk\u00e4uferin: \u201eDie Jacke kostet 89 Euro. Sie ist aus Wolle. Wir haben sie in Blau, Schwarz und Grau.\u201c",
"Aus welchem Material ist die Jacke?|Baumwolle|Wolle|Polyester|Wolle",
"Schreibe einen Dialog (8 Zeilen): Kleidung kaufen.",
"Beschreibe, was du heute tr\u00e4gst. Welche Kleidungsst\u00fccke? Welche Farben?",
"Kleidung benennen und Akkusativ verwenden gelernt."
));

all.push(L("A1",10,"In der Stadt unterwegs","Navigate the city using 'zu', 'nach', and 'in'.","Use 'zum' (zu+dem) for m/n, 'zur' (zu+der) for f, 'ins' (in+das) for n. 'Nach' for cities.",
"Ich gehe zum Bahnhof.|Sie f\u00e4hrt nach Berlin.|Wir gehen ins Museum.|Kannst du mich zur Post bringen?",
"Contractions: zum (m/n), zur (f), ins (n). Nach for cities.",
"der Bahnhof,train station,Zug kommt an.;die Post,post office,Muss zur Post.;das Museum,museum,Sehr interessant.;die Apotheke,pharmacy,Ge\u00f6ffnet.;die Bushaltestelle,bus stop,Um die Ecke.;das Kino,cinema,Neuer Film.;der Supermarkt,supermarket,Bis 22 Uhr.",
"Going to station.,Ich gehe zum Bahnhof.;Travels to Berlin.,Sie f\u00e4hrt nach Berlin.;Going to museum.,Wir gehen ins Museum.",
"Touristeninformation: \u201eDer Dom ist links. Das Rathaus ist geradeaus. Die Post ist neben dem Museum.\u201c",
"Wo ist das Rathaus?|Links|Rechts|Geradeaus|Geradeaus~Was ist neben dem Museum?|Der Dom|Das Schloss|Die Post|Die Post",
"\u201eWie komme ich zur Apotheke?\u201c \u201eGeradeaus, dann erste Stra\u00dfe rechts.\u201c",
"Wo ist die Apotheke?|Links, zweite Stra\u00dfe|Geradeaus, erste Stra\u00dfe rechts|Rechts, dann links|Geradeaus, erste Stra\u00dfe rechts",
"Schreibe eine Wegbeschreibung vom Bahnhof zum Museum.",
"Erkl\u00e4re den Weg zur n\u00e4chsten Bushaltestelle.",
"Orte in der Stadt und zum/zur/ins/nach gelernt."
));

all.push(L("A1",11,"Essen bestellen und bezahlen","Order food, ask about ingredients, pay the bill.","Use 'Ich h\u00e4tte gern...' for polite ordering. 'Getrennt' = separate, 'zusammen' = together.",
"Ich h\u00e4tte gern die Tomatensuppe.|Haben Sie vegetarische Gerichte?|Zahlen, bitte!|Das war sehr lecker!",
"\"H\u00e4tte gern\" (Konjunktiv II) for polite requests.",
"die Vorspeise,starter,Salat.;die Hauptspeise,main course,Schnitzel.;der Nachtisch,dessert,Kuchen.;das Getr\u00e4nk,drink,Wasser.;die Speisekarte,menu,Sehen bitte.;der Kellner,waiter,Bringt Essen.;das Trinkgeld,tip,10%.",
"Order soup.,Ich h\u00e4tte gern die Tomatensuppe.;Vegetarian?,Haben Sie vegetarische Gerichte?;Bill please.,Zahlen, bitte!",
"Speisekarte: Tomatensuppe 4,50\u20ac, Salat 5,80\u20ac, Schnitzel 12,50\u20ac, Pasta 9,90\u20ac, Apfelstrudel 4,20\u20ac.",
"Was kostet die Pasta?|9,90\u20ac|12,50\u20ac|5,80\u20ac|9,90\u20ac~Was kostet die Tomatensuppe?|4,50\u20ac|5,80\u20ac|4,20\u20ac|4,50\u20ac",
"Kellner: \u201eWas m\u00f6chten Sie trinken?\u201c Gast: \u201eEine Apfelschorle, bitte.\u201c",
"Was bestellt der Gast zu trinken?|Wasser|Apfelschorle|Cola|Apfelschorle",
"Schreibe einen Restaurant-Dialog (8 Zeilen).",
"Bestelle ein vollst\u00e4ndiges Men\u00fc und frage nach der Rechnung.",
"Im Restaurant bestellen und bezahlen gelernt."
));

all.push(L("A1",12,"Tagesablauf beschreiben","Describe daily routine with reflexive verbs.","Reflexive verbs: 'sich waschen', 'sich anziehen'. Pronoun: mich, dich, sich. Time: um (at), am (on), im (in).",
"Ich wasche mich jeden Morgen.|Um 7 Uhr ziehe ich mich an.|Am Montag stehe ich fr\u00fch auf.|Im Sommer jogge ich um 6.",
"Reflexive pronouns (accusative): mich, dich, sich, uns, euch, sich.",
"sich waschen,to wash,Ich wasche mich.;sich anziehen,to dress,Sie zieht sich an.;sich k\u00e4mmen,to comb,Er k\u00e4mmt sich.;fr\u00fchst\u00fccken,to breakfast,Um 7 Uhr.;duschen,to shower,Jeden Morgen.;der Spiegel,mirror,Vor dem Spiegel.;die Zahnb\u00fcrste,toothbrush,Neue bitte.",
"Ich ___ mich mit warmem Wasser.,wasche;Get dressed at 7.,Um 7 Uhr ziehe ich mich an.;Shower every morning.,Ich dusche jeden Morgen.",
"Marias Morgenroutine: \u201eIch stehe um 6:30 auf. Dann dusche ich mich. Um 7 fr\u00fchst\u00fccke ich. Um 7:45 gehe ich zur Arbeit.\u201c",
"Wann steht Maria auf?|6:00|6:30|7:00|6:30~Was macht Maria um 7:45?|Fr\u00fchst\u00fccken|Zur Arbeit gehen|Anziehen|Zur Arbeit gehen",
"\u201eIch stehe um 7 auf, dusche, fr\u00fchst\u00fccke und gehe zur Uni.\u201c",
"Wann steht die Person auf?|6|7|8|7",
"Beschreibe deinen Tagesablauf (6 S\u00e4tze) mit 2 reflexiven Verben.",
"Erz\u00e4hle deine Morgenroutine mit reflexiven Verben.",
"Reflexive Verben und Zeitangaben gelernt."
));

all.push(L("A1",13,"Hobbys und Freizeit","Talk about hobbies with gern/lieber/am liebsten.","Add 'gern' after verb. 'lieber' = prefer. 'am liebsten' = most of all.",
"Ich lese gern B\u00fccher.|Was machst du in deiner Freizeit?|Ich spiele lieber Tennis.|Am liebsten gehe ich ins Kino.",
"\"gern\" (like), \"lieber\" (prefer), \"am liebsten\" (most).",
"das Hobby,hobby,Fotografie.;die Freizeit,free time,Malen.;Fu\u00dfball spielen,to play soccer,Im Verein.;schwimmen,to swim,Macht Spa\u00df.;kochen,to cook,Italienisch.;fotografieren,to photograph,Natur.;musizieren,to make music,Samstag.",
"I like to read.,Ich lese gern B\u00fccher.;I prefer soccer.,Ich spiele lieber Fu\u00dfball.;Free time?,Was machst du in deiner Freizeit?",
"Paul: \u201eAm liebsten spiele ich Gitarre. Ich lese gern und gehe oft schwimmen.\u201c",
"Was macht Paul am liebsten?|Schwimmen|Gitarre spielen|Fu\u00dfball|Gitarre spielen~Was macht Paul gern?|Lesen und Schwimmen|Tanzen und Malen|Kochen|Lesen und Schwimmen",
"\u201eIch tanze gern. Jeden Freitag in die Tanzschule.\u201c",
"Wann geht die Person tanzen?|Mittwoch|Freitag|Samstag|Freitag",
"Schreibe 5 S\u00e4tze \u00fcber deine Hobbys mit gern/lieber/am liebsten.",
"Erz\u00e4hle von deinen Hobbys.",
"\u00dcber Hobbys sprechen gelernt."
));

all.push(L("A1",14,"Uhrzeiten und Termine","Tell time and make appointments.","Official 24h: '14 Uhr 30.' Colloquial: 'halb drei.' 'Viertel nach' (past), 'Viertel vor' (to).",
"Es ist 9 Uhr.|Der Termin ist um 14:30.|Wir treffen uns um Viertel nach sieben.|Kannst du um halb drei kommen?",
"Time: um (at), ab (from), bis (until).",
"die Uhrzeit,time,Wie sp\u00e4t?;der Termin,appointment,Beim Arzt.;p\u00fcnktlich,punctual,Sei bitte!;die Verabredung,meeting,Um 20 Uhr.;der Wecker,alarm,6 Uhr.;die Minute,minute,5 Versp\u00e4tung.;halb,half,Halb acht.",
"It is 9 o'clock.,Es ist 9 Uhr.;Meet at 2:30.,Wir treffen uns um halb drei.;What time?,Wie viel Uhr ist es?",
"\u201eK\u00f6nnen wir uns um 15 Uhr treffen?\u201c \u201eWie w\u00e4re es um 16:30?\u201c \u201eGut, um halb f\u00fcnf im Caf\u00e9.\u201c",
"Um wie viel Uhr treffen sie sich?|15 Uhr|16:30|17 Uhr|16:30~Wo?|Restaurant|Caf\u00e9|Park|Caf\u00e9",
"Der Deutschkurs beginnt um 18:30 und endet um 20 Uhr.",
"Wann beginnt der Kurs?|18 Uhr|18:30|20 Uhr|18:30",
"Schreibe einen Terminplan f\u00fcr morgen mit 4 Uhrzeiten.",
"Erz\u00e4hle deinen Tagesplan f\u00fcr morgen.",
"Uhrzeiten und Termine vereinbaren gelernt."
));

all.push(L("A1",15,"Im Supermarkt einkaufen","Shop for groceries, ask for items, understand prices.","Use 'Ich m\u00f6chte...' or 'Ich nehme...'. Quantities: 'ein Kilo', 'eine Flasche'.",
"Ich m\u00f6chte ein Kilo \u00c4pfel.|Was kostet die Milch?|Haben Sie frische Br\u00f6tchen?|Das macht 12 Euro 50.",
"Accusative after m\u00f6chte/nehmen. Unit words: ein Kilo, eine Flasche.",
"das Obst,fruit,Frisches.;das Gem\u00fcse,vegetables,Im Angebot.;das Brot,bread,Frisches bitte.;die Milch,milk,1,19\u20ac.;der K\u00e4se,cheese,200g.;die Kasse,checkout,Schlange.;der Einkaufswagen,cart,Nimm einen!",
"One kilo apples.,Ein Kilo \u00c4pfel, bitte.;Milk cost?,Was kostet die Milch?;Fresh rolls?,Haben Sie frische Br\u00f6tchen?",
"Angebote: \u00c4pfel 1,99\u20ac/kg, Milch 0,99\u20ac, Brot 2,49\u20ac, K\u00e4se 3,99\u20ac/200g.",
"Was kostet ein Kilo \u00c4pfel?|0,99\u20ac|1,99\u20ac|2,49\u20ac|1,99\u20ac~Was kostet 0,99\u20ac?|Brot|K\u00e4se|Milch|Milch",
"\u201eEin Pfund Tomaten und eine Flasche Oliven\u00f6l.\u201c \u201eDas macht 8,30\u20ac.\u201c",
"Was kostet der Einkauf?|6,30\u20ac|8,30\u20ac|10,30\u20ac|8,30\u20ac",
"Schreibe eine Einkaufsliste und einen Kassen-Dialog.",
"Spiele einen Einkauf: begr\u00fc\u00dfe, frage nach 3 Produkten, bezahle.",
"Im Supermarkt einkaufen gelernt."
));

all.push(L("A1",16,"K\u00f6rperteile","Name body parts and describe sensations.","'Mir tut der Kopf weh.' (Dative + weh tun). 'Ich habe Kopfschmerzen.' (have + pain).",
"Mir tut der Kopf weh.|Ich habe Zahnschmerzen.|Die Beine tun mir weh.|Hast du Halsschmerzen?",
"Dative + weh tun. Ich habe + [body]schmerzen.",
"der Kopf,head,Hut drauf.;der Arm,arm,Gebrochen.;das Bein,leg,Tut weh.;der R\u00fccken,back,Schmerzen.;der Bauch,stomach,Schmerzen.;die Hand,hand,Ring.;der Fu\u00df,foot,Kalt.",
"My head hurts.,Mir tut der Kopf weh.;Stomachache.,Ich habe Bauchschmerzen.;Fever?,Haben Sie Fieber?",
"\u201eGuten Tag Herr Doktor. Mir tut der R\u00fccken weh seit drei Tagen. Au\u00dferdem Husten.\u201c",
"Was tut weh?|Kopf|R\u00fccken|Bauch|R\u00fccken~Seit wann?|Ein Tag|Drei Tage|Eine Woche|Drei Tage",
"Patient: \u201eIch habe Fieber und Halsschmerzen. Mir tun die Ohren weh.\u201c",
"Welche Symptome?|Kopfschmerzen|Fieber und Halsschmerzen|Bauchschmerzen|Fieber und Halsschmerzen",
"Schreibe einen Arzt-Patienten-Dialog.",
"Rolle: Du bist beim Arzt. Beschreibe deine Symptome.",
"K\u00f6rperteile und Arzt-Vokabular gelernt."
));

all.push(L("A1",17,"Im Caf\u00e9","Order drinks and snacks.","Use 'Ich h\u00e4tte gern...' or 'F\u00fcr mich bitte...' 'Zum Mitnehmen' = to go.",
"Ich h\u00e4tte gern einen Cappuccino.|F\u00fcr mich bitte ein St\u00fcck Kuchen.|Zum Mitnehmen, bitte.|Zahlen, getrennt bitte.",
"Accusative with einen/eine/ein. zum Mitnehmen vs hier essen.",
"der Cappuccino,cappuccino,Bitte.;der Kuchen,cake,Lecker.;der Tee,tea,M\u00f6chte ich.;der Kaffee,coffee,Mit Milch.;die Tasse,cup,Kaffee.;die Bedienung,waiter,Kommt.;mitnehmen,to go,Zum Mitnehmen.",
"Order cappuccino.,Ich h\u00e4tte gern einen Cappuccino.;To go please.,Zum Mitnehmen, bitte.;Piece of cake.,Ein St\u00fcck Kuchen, bitte.",
"Caf\u00e9-Men\u00fc: Cappuccino 3,50\u20ac, Latte 3,80\u20ac, Tee 2,80\u20ac, Kuchen 4,20\u20ac, Sandwich 5,50\u20ac.",
"Was kostet Cappuccino?|2,80\u20ac|3,50\u20ac|4,20\u20ac|3,50\u20ac~Was kostet Sandwich?|4,20\u20ac|5,50\u20ac|3,80\u20ac|5,50\u20ac",
"\u201eF\u00fcr mich einen Latte Macchiato und ein St\u00fcck Kuchen. Hier essen.\u201c",
"Was bestellt der Gast?|Tee und Sandwich|Latte und Kuchen|Cappuccino und Kuchen|Latte und Kuchen",
"Schreibe einen Caf\u00e9-Besuch als Dialog.",
"Bestelle zwei Getr\u00e4nke und einen Snack. Frage nach zum Mitnehmen.",
"Im Caf\u00e9 bestellen gelernt."
));

all.push(L("A1",18,"Farben und Eigenschaften","Describe objects using colors and adjectives.","Adjectives: gro\u00df, klein, lang, kurz, schwer, leicht. Adjective endings with ein/eine/ein.",
"Der Apfel ist rot.|Das ist ein gro\u00dfer Tisch.|Die Tasche ist schwer.|Er hat kurze Haare.",
"Adjektivendungen Nominativ mit unbestimmtem Artikel.",
"rot,red,Roter Apfel.;blau,blue,Blaues Meer.;gro\u00df,big,Gro\u00dfer Tisch.;klein,small,Kleines Zimmer.;lang,long,Langer Weg.;kurz,short,Kurze Haare.;schwer,heavy,Schwere Tasche.",
"Red apple.,Der Apfel ist rot.;Big table.,Ein gro\u00dfer Tisch.;Short hair.,Kurze Haare.",
"Peter beschreibt seinen Tag: \u201eIch habe einen gro\u00dfen Hund. Er hat lange Ohren und kurze Beine. Er ist schwer.\u201c",
"Was f\u00fcr einen Hund hat Peter?|Klein|Gro\u00df|Alt|Gro\u00df~Wie sind die Ohren?|Kurz|Lang|Klein|Lang",
"\u201eMeine Wohnung hat ein gro\u00dfes Wohnzimmer und eine kleine K\u00fcche.\u201c",
"Wei\u00dfe Lampe?|Gro\u00dfe|Kleine|Wei\u00dfe", // placeholder
"Gro\u00dfes Wohzimmer und kleine K\u00fcche.",
"Schreibe 5 Beschreibungen von Dingen mit Farben und Eigenschaften.",
"Beschreibe deinen Lieblingsgegenstand mit 3 Adjektiven.",
"Farben und Eigenschaftsw\u00f6rter gelernt."
));

all.push(L("A1",19,"Meine Haustiere","Talk about pets and animals.","Use 'Ich habe einen/eine/ein' + animal. 'Der Hund', 'die Katze', 'das Pferd'.",
"Ich habe einen Hund.|Meine Katze ist drei Jahre alt.|Hast du Haustiere?|Das Pferd ist gro\u00df.",
"Accusative for pets: einen Hund, eine Katze, ein Pferd.",
"der Hund,dog,Gro\u00df und freundlich.;die Katze,cat,Drei Jahre.;der Vogel,bird,Kann singen.;das Pferd,horse,Gro\u00df.;der Fisch,fish,Im Aquarium.;das Kaninchen,rabbit,S\u00fc\u00df.;das Haustier,pet,Ich habe ein Haustier.",
"I have a dog.,Ich habe einen Hund.;Do you have pets?,Hast du Haustiere?;My cat is 3.,Meine Katze ist drei Jahre alt.",
"Lisa: \u201eIch habe einen Hund und zwei Katzen. Mein Hund hei\u00dft Bello und ist sehr freundlich. Die Katzen sind klein und s\u00fc\u00df.\u201c",
"Was f\u00fcr Haustiere hat Lisa?|Einen Hund und zwei Katzen|Zwei Hunde|Drei Katzen|Einen Hund und zwei Katzen~Wie ist Bello?|B\u00f6se|Freundlich|Gro\u00df|Freundlich",
"\u201eHast du Haustiere?\u201c \u201eJa, ich habe einen Vogel. Er kann sprechen!\u201c",
"Was f\u00fcr ein Haustier?|Hund|Vogel|Katze|Vogel",
"Schreibe \u00fcber dein Haustier oder Wunschhaustier.",
"Beschreibe dein Haustier oder Wunschhaustier.",
"\u00dcber Haustiere sprechen gelernt."
));

all.push(L("A1",20,"Deutsche Sprache und Kultur","Learn basic cultural facts and phrases.","German has 26 letters + \u00e4, \u00f6, \u00fc, \u00df. \"Guten Morgen\" before 10am, \"Guten Tag\" 10am-6pm, \"Guten Abend\" after 6pm.",
"In Deutschland sagt man \u201eGuten Tag\u201c.|Die Woche beginnt am Montag.|\u00d6sterreich und die Schweiz sprechen auch Deutsch.",
"Formal vs informal: Sie (formal) vs du (informal).",
"der Gru\u00df,greeting,Formeller Gru\u00df.;die Kultur,culture,Deutsche Kultur.;der Buchstabe,letter,26 Buchstaben.;das \u00df,eszett,Stra\u00dfe mit \u00df.;der Montag,Monday,Erster Tag.;formell,formal,Sie benutzen.;die Schweiz,Switzerland,Sprechen Deutsch.",
"Before 10am say...,Guten Morgen.;Formal you is...,Sie.;Goodbye formal...,Auf Wiedersehen.",
"Kurze Kulturtexte: \u201eIn Deutschland isst man viel Brot. Es gibt \u00fcber 300 Brotsorten! Das Abendessen hei\u00dft oft Abendbrot.\u201c",
"Wie viele Brotsorten gibt es?|100|300|500|300~Wie hei\u00dft das Abendessen oft?|Abendmahl|Abendbrot|Nachtessen|Abendbrot",
"\u201eWillkommen in Deutschland! Hier spricht man Deutsch. Die Leute sind freundlich und p\u00fcnktlich.\u201c",
"Wie sind die Leute?|Freundlich|Laut|Still|Freundlich",
"Schreibe 5 Fakten \u00fcber Deutschland.",
"Erz\u00e4hle, was du \u00fcber Deutschland wei\u00dft.",
"Deutsche Kultur und Basics gelernt."
));

all.push(L("A1",21,"Tiere und Natur","Name animals and describe nature.","Use 'der/die/das' for animals. Die Natur = nature. 'Der Wald', 'der Berg', 'der Fluss', 'das Meer'.",
"Der Hund rennt im Park.|V\u00f6gel fliegen \u00fcber den Baum.|Das Meer ist blau.|Im Wald gibt es B\u00e4ume.",
"Articles: der Hund, die Katze, das Pferd. Location: im (in+dem) Wald.",
"der Vogel,bird,Fliegt hoch.;der Baum,tree,Gro\u00dfer Baum.;der Wald,forest,Spazieren im Wald.;der Berg,mountain,Hohler Berg.;der Fluss,river,Langer Fluss.;das Meer,sea,Blaues Meer.;die Blume,flower,Sch\u00f6ne Blume.",
"Birds fly...,V\u00f6gel fliegen.;The sea is blue.,Das Meer ist blau.;In the forest...,Im Wald gibt es B\u00e4ume.",
"Im Park: \u201eEs gibt viele B\u00e4ume und Blumen. V\u00f6gel singen in den