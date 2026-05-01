"use strict";
const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "src", "data");
const OUT = path.join(DATA, "germanLessonsNew.json");

// Load existing from all files
const existing = [];
try {
  existing.push(...JSON.parse(fs.readFileSync(path.join(DATA, "germanLessons.json"), "utf8")));
  existing.push(...JSON.parse(fs.readFileSync(path.join(DATA, "germanLessonsB1.json"), "utf8")));
  existing.push(...JSON.parse(fs.readFileSync(path.join(DATA, "germanLessonsBC.json"), "utf8")));
} catch(e) {
  // fallback
}
const existingIds = new Set(existing.map(l => l.id));
console.log("Existing lessons:", existing.length);

// S = separator for split
const S = "|";
const QS = "~";
// Vocabulary: word,tran;word,tran
// Guided practice: prompt|answer;prompt|answer
// Reading text + questions: text~q|o1|o2|o3|ans~q|o1|o2|o3|ans
// Listening: script~q|o1|o2|o3|ans
// Writing prompt
// Speaking prompt
// Summary

function L(level, num, title, obj, expl, exStr, gf, vStr, gpStr, rStr, wStr, sStr, sum) {
  // h=hardcoded to keep things simple... let's just parse the arguments
  // Actually, let me write lessons as already-built objects
}

// Alternative: just build the objects directly using a helper that parses compact strings
// but given the file size limit, I'll pre-define every lesson inline

const allNew = [];

// ==================== UNIT / LEVEL HELPERS ====================
function unitFor(level, num) {
  const i = Math.min(Math.floor((num - 1) / 5), 4);
  const units = {
    A1: ["A1_unit_1","A1_unit_2","A1_unit_3","A1_unit_4","A1_unit_5"],
    A2: ["A2_unit_1","A2_unit_2","A2_unit_3","A2_unit_4","A2_unit_5"],
    B1: ["B1_unit_1","B1_unit_2","B1_unit_3","B1_unit_4","B1_unit_5"],
    B2: ["B2_unit_1","B2_unit_2","B2_unit_3","B2_unit_4","B2_unit_5"],
    C1: ["C1_unit_1","C1_unit_2","C1_unit_3","C1_unit_4","C1_unit_5"]
  };
  return units[level][i];
}

// Line-based compact format:
// Each lesson is one long string with sections separated by double pipe ||
// Section order: num | title | obj | expl | examples | gf | vocab | gp | reading | listening | writing | speaking | summary
// Vocab: word=translation;word=translation
// GP: prompt|answer;prompt|answer
// Reading: text~~q|o1|o2|o3|ans~~q|o1|o2|o3|ans
// Listening: script~~q|o1|o2|o3|ans

const lessonLines = [];

// ---- A1 ----
lessonLines.push('6|Die Uhrzeit|Tell time using official and colloquial formats.|In German there are two ways to tell time. Official uses Uhr between hours and minutes 14:30 Uhr. Colloquial uses nach past and vor to the hour: Viertel nach drei. Important: halb drei means half past two half way to the next hour not half past three.|Es ist drei Uhr' + S + 'Es ist halb zehn' + S + 'Es ist Viertel nach sieben' + S + 'Fuenf vor zwolf|Time expressions Uhr Stunde Minute|die Uhr=clock;die Stunde=hour;die Minute=minute;viertel=quarter;halb=half;nach=past/after;vor=before/to;puenktlich=on time;spaet=late|How do you say half past eight' + S + 'halb acht;Translate at three o clock' + S + 'um drei Uhr;What is 14:45 colloquially' + S + 'Viertel vor drei|Der Wecker klingelt um 7 Uhr Maria steht auf und fruehstueckt Um 8.15 Uhr geht sie zur Arbeit Um 12.30 Uhr hat sie Mittagspause Um 17 Uhr ist Feierabend Um 18.45 Uhr kocht sie Abendessen Um 22.30 Uhr geht sie ins Bett' + QS + 'Wann klingelt der Wecker' + S + '7 Uhr' + S + '8 Uhr' + S + '6 Uhr' + S + '7 Uhr' + QS + 'Wann hat Maria Mittagspause' + S + '11.30' + S + '12.30' + S + '13.30' + S + '12.30|A Entschuldigung wie spaet ist es B Es ist Viertel nach drei A Danke sehr B Bitte schoen' + QS + 'Wie spaet ist es' + S + 'Viertel nach drei' + S + 'halb vier' + S + 'drei Uhr' + S + 'Viertel nach drei|Write 5 sentences about your daily schedule using both official and colloquial time formats|Ask a partner for the time at 3 different times of day and answer colloquially|Use nach for minutes past the hour and vor for minutes to. Halb means half way TO the next hour halb drei is 2:30. Official time uses Uhr between hours and minutes.');

lessonLines.push('7|Die Wochentage und Monate|Name the days months and say dates.|Days are masculine in German der Montag der Dienstag. Use am day for on specific days. Months Januar Dezember. Ordinal numbers for dates: der erste Mai der dritte Oktober. The question is Der wievielte ist heute What is today date. Adverbial form mittwochs on Wednesdays means every Wednesday.|Heute ist Montag' + S + 'Morgen ist Dienstag' + S + 'Heute ist der 3. Mai' + S + 'Januar ist der erste Monat|Days months and ordinal numbers|der Montag=Monday;der Dienstag=Tuesday;der Mittwoch=Wednesday;der Donnerstag=Thursday;der Freitag=Friday;der Samstag=Saturday;der Sonntag=Sunday;der Monat=month;der Geburtstag=birthday;das Jahr=year|What day comes after Mittwoch' + S + 'Donnerstag;Say today is Friday' + S + 'Heute ist Freitag;Ordinal for 1st' + S + 'erste|Am Montag gehe ich zur Schule Am Dienstag habe ich Sport Mittwochs besuche ich meine Oma Donnerstags koche ich Freitags gehe ich ins Kino Samstags schlafe ich lange Sonntags mache ich einen Spaziergang' + QS + 'Was mache ich am Montag' + S + 'zur Schule gehen' + S + 'ins Kino gehen' + S + 'schlafen' + S + 'zur Schule gehen' + QS + 'Wann besuche ich meine Oma' + S + 'dienstags' + S + 'mittwochs' + S + 'donnerstags' + S + 'mittwochs|A Der wievielte ist heute B Heute ist der 15 Juni A Ach so dann habe ich naechste Woche Geburtstag|Welcher Monat wird genannt' + S + 'Mai' + S + 'Juni' + S + 'Juli' + S + 'Juni|Write your weekly schedule in German using am for specific days|Tell your partner your favorite day of the week|Days are masculine der. Use am day for on. Ordinal numbers add te der erste der zweite. Adverbial form montags on Mondays.');

lessonLines.push('8|Hobbys und Freizeit|Talk about hobbies and free time activities.|Use gern after the verb to express enjoyment Ich spiele gern FuSsball. Verb conjugation ich spiele du spielst er spielt wir spielen. Frage Was machst du in deiner Freizeit. Use nicht gern for things you do not like. Use lieber for prefer and am liebsten for favorite.|Ich spiele gern FuSsball' + S + 'Sie liest gern Buecher' + S + 'Was machst du in deiner Freizeit' + S + 'Wir tanzen gern|Verb conjugation with gern|das Hobby=hobby;spielen=to play;lesen=to read;malen=to paint;tanzen=to dance;kochen=to cook;reisen=to travel;der FuSsball=soccer;die Musik=music;gern=like to|How do you say I like to dance' + S + 'Ich tanze gern;What does lesen mean' + S + 'to read;Translate we like to cook' + S + 'Wir kochen gern|Thomas hat viele Hobbys Er spielt gern FuSsball und trainiert zweimal pro Woche Seine Schwester Anna malt gern Sie hat schon 20 Bilder gemalt Ihr Bruder Max hoert gern Musik und spielt Gitarre Am Wochenende gehen sie zusammen schwimmen' + QS + 'Wie oft trainiert Thomas' + S + 'einmal pro Woche' + S + 'zweimal pro Woche' + S + 'dreimal pro Woche' + S + 'zweimal pro Woche' + QS + 'Was macht Anna gern' + S + 'FuSsball' + S + 'malen' + S + 'Musik hoeren' + S + 'malen|A Was machst du in deiner Freizeit B Ich lese gern Romane und gehe spazieren|Was macht B gern' + S + 'lesen' + S + 'kochen' + S + 'tanzen' + S + 'lesen|Write 6 sentences about your hobbies using gern include likes dislikes and preferences|Describe 3 hobbies you enjoy and how often you do them|gern after verb means like to. nicht gern = not like. lieber = prefer. am liebsten = favorite activity.');

lessonLines.push('9|Im Supermarkt einkaufen|Shop for food use quantities and ask about prices.|Key phrases Ich moechte I would like Ich brauche I need Was kostet how much. Accusative case einen Apfel m eine Milch f ein Brot n drei Eier pl. Prices use comma as decimal 1 99 Euro. An der Kasse bezahlen pay at register. Ich habe einen Euro zu wenig I am one euro short.|Ich moechte einen Apfel' + S + 'Was kostet die Milch' + S + 'Das Brot kostet 2 49 Euro' + S + 'Ich brauche drei Eier|Accusative articles with moechten and brauchen|der Apfel=apple;die Milch=milk;das Brot=bread;das Ei=egg;der Kaese=cheese;die Tomate=tomato;die Flasche=bottle;das Kilo=kilo;kosten=to cost;bezahlen=to pay|Ask for the price of milk' + S + 'Was kostet die Milch;Translate three eggs' + S + 'drei Eier;Plural of der Apfel' + S + 'die Aepfel|Peter geht in den Supermarkt Er braucht Milch Brot und Kaese Die Milch kostet 1 19 Euro Das Brot kostet 2 49 Euro Der Kaese kostet 3 99 Euro An der Kasse bezahlt er 7 67 Euro Dann geht er nach Hause' + QS + 'Was kostet das Brot' + S + '1 19' + S + '2 49' + S + '3 99' + S + '2 49' + QS + 'Wie viel bezahlt Peter' + S + '5 67' + S + '7 67' + S + '9 67' + S + '7 67|A Kann ich Ihnen helfen B Ja ich suche frische Tomaten A Die Tomaten sind dort im Gemueseregal|Was sucht der Kunde' + S + 'Milch' + S + 'Tomaten' + S + 'Kaese' + S + 'Tomaten|Write a shopping list with 8 items and estimated prices then a short dialogue at the register|Role play customer and shopkeeper ask for 3 items and their prices|Plurals are unpredictable always learn the plural form. der Apfel to die Aepfel. Euro stays same in plural. An der Kasse = at the register.');

lessonLines.push('10|Im Restaurant bestellen|Order food and drinks at a German restaurant.|Key restaurant phrases Ich moechte I would like Ich haette gern more polite Was empfehlen Sie what do you recommend. Der Kellner brings the Speisekarte menu. Vorspeise starter Hauptgang main Nachtisch dessert. Zahlen bitte or Die Rechnung bitte for the bill. Trinkgeld tip is usually 5 to 10 percent.|Ich moechte ein Schnitzel' + S + 'Was moechten Sie trinken' + S + 'Ich haette gern die Suppe' + S + 'Kann ich die Rechnung haben|The modal verb moechten would like|die Speisekarte=menu;die Vorspeise=starter;der Hauptgang=main course;der Nachtisch=dessert;das Getraenk=drink;die Rechnung=bill;der Kellner=waiter;bestellen=to order;schmecken=to taste;empfehlen=to recommend|How do you order water' + S + 'Ich moechte Wasser;What does die Rechnung mean' + S + 'the bill;Could I have the menu' + S + 'Kann ich die Speisekarte haben|Familie Mueller geht ins Restaurant Herr Mueller bestellt ein Schnitzel mit Pommes Frau Mueller nimmt den Salat Die Kinder bestellen Spaghetti Der Kellner bringt Apfelsaft und Mineralwasser Das Essen schmeckt allen sehr gut Am Ende sagt Herr Mueller Zahlen bitte' + QS + 'Was bestellt Herr Mueller' + S + 'Salat' + S + 'Schnitzel' + S + 'Spaghetti' + S + 'Schnitzel' + QS + 'Was trinken die Kinder' + S + 'Cola' + S + 'Apfelsaft' + S + 'Bier' + S + 'Apfelsaft|Kellner Guten Abend was moechten Sie bestellen Gast Ich haette gern die Tomatensuppe dann den Braten Kellner Und zu trinken Gast Ein Glas Rotwein bitte|Was ist die Vorspeise' + S + 'Braten' + S + 'Tomatensuppe' + S + 'Salat' + S + 'Tomatensuppe|Write a full restaurant dialogue greeting order starter main drink ask for bill|Role play ordering in a German restaurant partner plays waiter|Ich moechte polite request. Ich haette gern is more polite. Kann ich haben Can I have. Trinkgeld tip 5 to 10 percent.');

// Save const, write later
// Output allNew
const allLessons = existing.concat(allNew);
fs.writeFileSync(OUT, JSON.stringify(allLessons, null, 2));
const cnt = {};
allLessons.forEach(l => { cnt[l.level] = (cnt[l.level] || 0) + 1; });
console.log("Total:", allLessons.length);
console.log("Counts:", JSON.stringify(cnt));
