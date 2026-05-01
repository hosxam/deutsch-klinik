const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "src", "data");

const L = [];

const SEP = "||";
const QSEP = "~~";
const OPTSEP = "|";

function a1(num, title, obj, expl, examples, gf, v, gp, rt, rq, lt, lq, wp, sp, summary) {
  return {
    level: "A1",
    unit: "A1_unit_" + Math.min(Math.floor((num-1)/5)+1, 5),
    id: "A1_lesson_" + num,
    title: title,
    objective: obj,
    explanation: expl,
    examples: examples.split(SEP),
    grammarFocus: gf,
    vocabulary: v.split(";").map(function(x) {
      var i = x.indexOf(",");
      return { word: x.slice(0,i), translation: x.slice(i+1) };
    }),
    guidedPractice: gp.split(";").map(function(x) {
      var i = x.indexOf(OPTSEP);
      return { prompt: x.slice(0,i), answer: x.slice(i+1) };
    }),
    readingTask: (function() {
      var qs = rq.split(QSEP).map(function(q) {
        var p = q.split(OPTSEP);
        return { question: p[0], options: [p[1],p[2],p[3]], answer: p[4] };
      });
      return { text: rt, questions: qs };
    })(),
    listeningTask: (function() {
      var p = lq.split(OPTSEP);
      return { script: lt, questions: [{ question: p[0], options: [p[1],p[2],p[3]], answer: p[4] }] };
    })(),
    writingTask: { prompt: wp },
    speakingTask: { prompt: sp },
    reviewSummary: summary
  };
}

// A1 lessons 6-25
L.push(a1(6,"Die Uhrzeit",
"Tell time in German using official and colloquial formats.",
"In German there are two ways to tell time: official (digital) and colloquial. Official uses Uhr between hours and minutes: 14:30 Uhr. Colloquial uses nach (past) and vor (to): Viertel nach drei (quarter past three). Important: halb drei means half past two, not half past three. Halb refers to the half point before the next hour.",
"Es ist drei Uhr." + SEP + "Es ist halb zehn." + SEP + "Es ist Viertel nach sieben." + SEP + "Fuenf vor zwolf.",
"Time: official vs colloquial",
"die Uhr,clock;die Stunde,hour;die Minute,minute;viertel,quarter;halb,half;nach,past;vor,to;puenktlich,on time;spaet,late",
"How do you say half past eight?|halb acht;Translate at three o clock|um drei Uhr;What is 14:45 colloquially?|Viertel vor drei",
"Der Wecker klingelt um 7 Uhr. Maria steht auf und fruehstueckt. Um 8.15 Uhr geht sie zur Arbeit. Um 12.30 Uhr hat sie Mittagspause. Um 17 Uhr ist Feierabend.",
"Wann klingelt der Wecker?" + OPTSEP + "7 Uhr" + OPTSEP + "8 Uhr" + OPTSEP + "6 Uhr" + OPTSEP + "7 Uhr" + QSEP + "Wann hat Maria Mittagspause?" + OPTSEP + "11.30" + OPTSEP + "12.30" + OPTSEP + "13.30" + OPTSEP + "12.30",
"A: Entschuldigung, wie spaet ist es? B: Es ist Viertel nach drei. A: Danke sehr!",
"Wie spaet ist es?" + OPTSEP + "Viertel nach drei" + OPTSEP + "halb vier" + OPTSEP + "drei Uhr" + OPTSEP + "Viertel nach drei",
"Write 5 sentences about your daily schedule using both official and colloquial time formats.",
"Ask a partner for the time at 3 different times of day. Answer using colloquial format.",
"Use nach for minutes past the hour and vor for minutes to. Halb means half way TO the next hour (halb drei = 2:30). Official time uses Uhr between hours and minutes."));

L.push(a1(7,"Die Wochentage und Monate",
"Name the days of the week, months, and say dates.",
"Days are masculine in German: der Montag, der Dienstag. Use am + day for on specific days: am Montag (on Monday). Use the adverbial form for regular events: montags (on Mondays). Months: Januar bis Dezember. Ordinal numbers for dates: der erste Mai, der dritte Oktober. The question is: Der wievielte ist heute?",
"Heute ist Montag." + SEP + "Morgen ist Dienstag." + SEP + "Heute ist der 3. Mai." + SEP + "Januar ist der erste Monat.",
"Days, months, and ordinal numbers",
"der Montag,Monday;der Dienstag,Tuesday;der Mittwoch,Wednesday;der Donnerstag,Thursday;der Freitag,Friday;der Samstag,Saturday;der Sonntag,Sunday;der Monat,month;der Geburtstag,birthday;das Jahr,year",
"What day comes after Mittwoch?" + OPTSEP + "Donnerstag;Say today is Friday" + OPTSEP + "Heute ist Freitag;Ordinal for 1st?" + OPTSEP + "erste",
"Am Montag gehe ich zur Schule. Am Dienstag habe ich Sport. Mittwochs besuche ich meine Oma. Donnerstags koche ich. Freitags gehe ich ins Kino. Samstags schlafe ich lange. Sonntags mache ich einen Spaziergang.",
"Was mache ich am Montag?" + OPTSEP + "zur Schule gehen" + OPTSEP + "Kino" + OPTSEP + "schlafen" + OPTSEP + "zur Schule gehen" + QSEP + "Wann besuche ich meine Oma?" + OPTSEP + "dienstags" + OPTSEP + "mittwochs" + OPTSEP + "donnerstags" + OPTSEP + "mittwochs",
"A: Der wievielte ist heute? B: Heute ist der 15. Juni. A: Ach so, dann habe ich bald Geburtstag!",
"Welcher Monat wird genannt?" + OPTSEP + "Mai" + OPTSEP + "Juni" + OPTSEP + "Juli" + OPTSEP + "Juni",
"Write your weekly schedule in German. Use am for specific days and the adverbial form for regular activities.",
"Tell your partner your favorite day of the week and explain why.",
"Days are masculine (der). Use am + day for on. Ordinal numbers add -te: der erste, der zweite. Adverbial form: montags (on Mondays)."));

L.push(a1(8,"Hobbys und Freizeit",
"Talk about hobbies and free time activities using gern.",
"Use gern after the verb to express enjoyment: Ich spiele gern FuSsball. Verb conjugation changes by subject: ich spiele, du spielst, er spielt, wir spielen, ihr spielt, sie spielen. Frage: Was machst du gern in deiner Freizeit? Antwort: Ich ... gern. Use nicht gern for things you don't like.",
"Ich spiele gern FuSsball." + SEP + "Sie liest gern Buecher." + SEP + "Was machst du in deiner Freizeit?" + SEP + "Wir tanzen gern.",
"Verb conjugation with gern (like to)",
"das Hobby,hobby;spielen,to play;lesen,to read;malen,to paint;tanzen,to dance;kochen,to cook;reisen,to travel;der FuSsball,soccer;die Musik,music;gern,like to",
"How do you say I like to dance?" + OPTSEP + "Ich tanze gern;What does lesen mean?" + OPTSEP + "to read;Translate we like to cook" + OPTSEP + "Wir kochen gern",
"Thomas hat viele Hobbys. Er spielt gern FuSsball und trainiert zweimal pro Woche. Seine Schwester Anna malt gern. Sie hat schon 20 Bilder gemalt. Ihr Bruder Max hoert gern Musik und spielt Gitarre. Am Wochenende gehen sie zusammen schwimmen.",
"Wie oft trainiert Thomas?" + OPTSEP + "einmal" + OPTSEP + "zweimal" + OPTSEP + "dreimal" + OPTSEP + "zweimal" + QSEP + "Was macht Anna gern?" + OPTSEP + "FuSsball" + OPTSEP + "malen" + OPTSEP + "Musik" + OPTSEP + "malen",
"A: Was machst du gern in deiner Freizeit? B: Ich lese gern und gehe spazieren. A: Liest du lieber Romane oder Sachbuecher? B: Romane, am liebsten Krimis.",
"Was liest B am liebsten?" + OPTSEP + "Science-Fiction" + OPTSEP + "Krimis" + OPTSEP + "Romane" + OPTSEP + "Krimis",
"Write 6 sentences about your hobbies using gern. Include things you like and dont like.",
"Describe 3 hobbies you enjoy and say how often you do them.",
"Use gern after the verb to express liking. Use nicht gern for disliking. Use lieber (prefer) and am liebsten (favorite)."));

L.push(a1(9,"Im Supermarkt einkaufen",
"Shop for food, use quantities, and ask for prices.",
"In the supermarket you need key phrases: Ich moechte (I would like), Ich brauche (I need), Was kostet (how much). The accusative case is used after these: einen Apfel (m), eine Milch (f), ein Brot (n), drei Eier (pl). Prices use a comma as decimal: 1,99 Euro. An der Kasse bezahlen (pay at the register).",
"Ich moechte einen Apfel." + SEP + "Was kostet die Milch?" + SEP + "Das Brot kostet 2,49 Euro." + SEP + "Ich brauche drei Eier.",
"Accusative case with moechten and brauchen",
"der Apfel,apple;die Milch,milk;das Brot,bread;das Ei,egg;der Kaese,cheese;die Tomate,tomato;die Flasche,bottle;das Kilo,kilo;kosten,to cost;bezahlen,to pay",
"Ask for the price of milk" + OPTSEP + "Was kostet die Milch?" + OPTSEP + "three eggs" + OPTSEP + "drei Eier;Plural of der Apfel" + OPTSEP + "die Aepfel",
"Peter geht in den Supermarkt. Er braucht Milch, Brot und Kaese. Die Milch kostet 1,19 Euro. Das Brot kostet 2,49 Euro. Der Kaese kostet 3,99 Euro. An der Kasse bezahlt er 7,67 Euro. Dann geht er nach Hause.",
"Was kostet das Brot?" + OPTSEP + "1,19" + OPTSEP + "2,49" + OPTSEP + "3,99" + OPTSEP + "2,49" + QSEP + "Wie viel bezahlt Peter?" + OPTSEP + "5,67" + OPTSEP + "7,67" + OPTSEP + "9,67" + OPTSEP + "7,67",
"A: Kann ich Ihnen helfen? B: Ja, ich suche frische Tomaten. A: Die Tomaten sind dort im Gemueseregal.",
"Was sucht der Kunde?" + OPTSEP + "Milch" + OPTSEP + "Tomaten" + OPTSEP + "Kaese" + OPTSEP + "Tomaten",
"Write a shopping list with 8 items and their estimated prices. Then write a short dialogue at the register.",
"Role play: You are a customer and your partner is the shopkeeper. Ask for 3 items and their prices.",
"Plurals are unpredictable. Always learn plural form: der Apfel -> die Aepfel. The Euro sign comes after the amount."));

L.push(a1(10,"Im Restaurant bestellen",
"Order food and drinks confidently at a German restaurant.",
"Key restaurant phrases: Ich moechte (I would like), Ich haette gern (I would like more polite), Was empfehlen Sie? (What do you recommend?). Der Kellner brings the Speisekarte (menu). Typical structure: Vorspeise (starter), Hauptgang (main), Nachtisch (dessert). To pay: Zahlen, bitte! or Die Rechnung, bitte! Trinkgeld (tip) is usually 5-10%.",
"Ich moechte ein Schnitzel." + SEP + "Was moechten Sie trinken?" + SEP + "Ich haette gern die Suppe." + SEP + "Kann ich die Rechnung haben?",
"The modal verb moechten (would like)",
"die Speisekarte,menu;die Vorspeise,starter;der Hauptgang,main course;der Nachtisch,dessert;das Getraenk,drink;die Rechnung,bill;der Kellner,waiter;bestellen,to order;schmecken,to taste;empfehlen,to recommend",
"How do you order water?" + OPTSEP + "Ich moechte Wasser;What does die Rechnung mean?" + OPTSEP + "the bill;Could I have the menu?" + OPTSEP + "Kann ich die Speisekarte haben?",
"Familie Mueller geht ins Restaurant. Herr Mueller bestellt ein Schnitzel mit Pommes. Frau Mueller nimmt den Salat. Die Kinder bestellen Spaghetti. Der Kellner bringt Apfelsaft und Mineralwasser. Das Essen schmeckt allen sehr gut. Am Ende sagt Herr Mueller: Zahlen, bitte!",
"Was bestellt Herr Mueller?" + OPTSEP + "Salat" + OPTSEP + "Schnitzel" + OPTSEP + "Spaghetti" + OPTSEP + "Schnitzel" + QSEP + "Was trinken die Kinder?" + OPTSEP + "Cola" + OPTSEP + "Apfelsaft" + OPTSEP + "Bier" + OPTSEP + "Apfelsaft",
"Kellner: Guten Abend, was moechten Sie bestellen? Gast: Ich haette gern die Tomatensuppe, dann den Braten. Kellner: Und zu trinken? Gast: Ein Glas Rotwein, bitte.",
"Was ist die Vorspeise?" + OPTSEP + "Braten" + OPTSEP + "Suppe" + OPTSEP + "Salat" + OPTSEP + "Suppe",
"Write a complete restaurant dialogue: greeting, ordering a starter, main course, drink, and asking for the bill.",
"Role play ordering in a German restaurant. Partner plays the waiter.",
"Ich moechte = polite request. Ich haette gern = even more polite. Kann ich ... haben = Can I have. Trinkgeld = tip (usually 5-10%)."));

// Write output
var outFile = path.join(DATA, "germanLessonsNew.json");

// Check for existing
var existing = [];
try {
  var f1 = JSON.parse(fs.readFileSync(path.join(DATA, "germanLessons.json"), "utf8"));
  var f2 = JSON.parse(fs.readFileSync(path.join(DATA, "germanLessonsB1.json"), "utf8"));
  var f3 = JSON.parse(fs.readFileSync(path.join(DATA, "germanLessonsBC.json"), "utf8"));
  existing = f1.concat(f2).concat(f3);
  console.log("Existing lessons loaded: " + existing.length);
} catch(e) {
  console.log("No existing lessons found.");
}

var existingIds = {};
existing.forEach(function(l) { existingIds[l.id] = true; });

var newOnes = L.filter(function(l) { return !existingIds[l.id]; });
console.log("New lessons to add: " + newOnes.length);

var all = existing.concat(newOnes);
console.log("Total: " + all.length);

// Count by level
var cnt = {};
all.forEach(function(l) {
  if (!cnt[l.level]) cnt[l.level] = 0;
  cnt[l.level]++;
});
console.log("By level:", JSON.stringify(cnt));

fs.writeFileSync(outFile, JSON.stringify(all, null, 2));
console.log("Written to", outFile);
