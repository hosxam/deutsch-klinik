// This script appends the remaining ~284 B2 words to the generation script
const fs = require('fs');

// Read existing words from the generate script to count what we need
const existingTxt = fs.readFileSync('scripts/existing_b2.txt', 'utf-8');
const existingWords = new Set(existingTxt.split('\n').map(w => w.trim().toLowerCase().replace(/^(der |die |das )/, '')).filter(w => w));

const batchAdded = new Set();
function normalizeWord(w) { return w.trim().toLowerCase().replace(/^(der |die |das )/, ''); }

function add(a,p,pl,tr,ex,pos,top,tag) {
  const w = normalizeWord(a);
  if (existingWords.has(w) || batchAdded.has(w)) return null;
  batchAdded.add(w);
  return `['${a.replace(/'/g,"\\'")}','${p||''}','${pl||''}','${tr}','${ex}','${pos}','${top}','${tag}'],`;
}

// We already have topics 1-8 fully, and part of 9 (Media)
// Need topics 10-20 = 11 topics x 25 = 275 words

const lines = [];

function emit(topicNum, topicName, arr) {
  lines.push('');
  lines.push(`// ${topicNum}. ${topicName}`);
  lines.push('batch([');
  for (const e of arr) {
    const r = add(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]);
    if (r) lines.push(r);
  }
  lines.push(']);');
}

// But first, let's just generate the CSV directly to a temp file
// Check if we already have topic 9 partially in the file

// ============== REMAINING WORDS ===============

// Complete the Media topic (needs ~10 more)
const topic10 = [
['die Werbung','die','die Werbungen','advertisement','Die Werbung läuft im Fernsehen.','noun','Media and communication','b2;media'],
['die Anzeige','die','die Anzeigen','ad, notice','Die Anzeige stand in der Zeitung.','noun','Media and communication','b2;media'],
['die Übertragung','die','die Übertragungen','broadcast','Die Übertragung beginnt um 20 Uhr.','noun','Media and communication','b2;media'],
['der Moderator','der','die Moderatoren','host','Der Moderator führt durch die Sendung.','noun','Media and communication','b2;media'],
['die Kolumne','die','die Kolumnen','column','Die Kolumne erscheint wöchentlich.','noun','Media and communication','b2;media'],
['die Umfrage','die','die Umfragen','survey','Die Umfrage ergab klare Ergebnisse.','noun','Media and communication','b2;media'],
['die Zielgruppe','die','die Zielgruppen','target audience','Die Zielgruppe sind junge Erwachsene.','noun','Media and communication','b2;media'],
['der Kommentar','der','die Kommentare','commentary','Der Kommentar war kritisch.','noun','Media and communication','b2;media'],
['die Rubrik','die','die Rubriken','section','Die Rubrik erscheint sonntags.','noun','Media and communication','b2;media'],
['der Artikel','der','die Artikel','article','Der Artikel wurde veröffentlicht.','noun','Media and communication','b2;media'],
];

emit(9, 'Media and communication (continued)', topic10);

// 10. Housing and Living
const topic11 = [
['die Mietwohnung','die','die Mietwohnungen','rental apartment','Die Mietwohnung hat drei Zimmer.','noun','Housing and living','b2;housing'],
['der Mietvertrag','der','die Mietverträge','rental contract','Der Mietvertrag wurde unterschrieben.','noun','Housing and living','b2;housing'],
['die Wohnungsbesichtigung','die','die Wohnungsbesichtigungen','apartment viewing','Die Besichtigung ist morgen.','noun','Housing and living','b2;housing'],
['die Nebenkosten','die','','utility costs','Die Nebenkosten sind hoch.','noun','Housing and living','b2;housing'],
['die Kaution','die','die Kautionen','deposit','Die Kaution beträgt drei Monatsmieten.','noun','Housing and living','b2;housing'],
['der Vermieter','der','die Vermieter','landlord','Der Vermieter ist freundlich.','noun','Housing and living','b2;housing'],
['der Mieter','der','die Mieter','tenant','Der Mieter zahlt pünktlich.','noun','Housing and living','b2;housing'],
['die Wohnungsanzeige','die','die Wohnungsanzeigen','housing ad','Die Anzeige war online.','noun','Housing and living','b2;housing'],
['der Grundriss','der','die Grundrisse','floor plan','Der Grundriss zeigt drei Zimmer.','noun','Housing and living','b2;housing'],
['die Einbauküche','die','die Einbauküchen','fitted kitchen','Die Einbauküche ist modern.','noun','Housing and living','b2;housing'],
['der Balkon','der','die Balkone','balcony','Der Balkon geht nach Süden.','noun','Housing and living','b2;housing'],
['die Heizung','die','die Heizungen','heating','Die Heizung funktioniert gut.','noun','Housing and living','b2;housing'],
['die Renovierung','die','die Renovierungen','renovation','Die Renovierung kostet viel.','noun','Housing and living','b2;housing'],
['der Hausrat','der','','household contents','Der Hausrat ist versichert.','noun','Housing and living','b2;housing'],
['die Wohnungseinrichtung','die','die Wohnungseinrichtungen','furnishing','Die Einrichtung ist modern.','noun','Housing and living','b2;housing'],
['das Stockwerk','das','die Stockwerke','floor, storey','Das Stockwerk ist der dritte.','noun','Housing and living','b2;housing'],
['der Fahrstuhl','der','die Fahrstühle','elevator','Der Fahrstuhl ist defekt.','noun','Housing and living','b2;housing'],
['die Hausordnung','die','die Hausordnungen','house rules','Die Hausordnung hängt im Flur.','noun','Housing and living','b2;housing'],
['die Mülltonne','die','die Mülltonnen','trash bin','Die Mülltonne wird montags geleert.','noun','Housing and living','b2;housing'],
['der Hausmeister','der','die Hausmeister','janitor','Der Hausmeister repariert alles.','noun','Housing and living','b2;housing'],
['die Terrasse','die','die Terrassen','terrace','Die Terrasse ist groß.','noun','Housing and living','b2;housing'],
['der Keller','der','die Keller','basement','Der Keller ist feucht.','noun','Housing and living','b2;housing'],
['der Dachboden','der','die Dachböden','attic','Der Dachboden wird als Lager genutzt.','noun','Housing and living','b2;housing'],
['die Wohnungsgenossenschaft','die','die Wohnungsgenossenschaften','housing cooperative','Die Genossenschaft ist günstig.','noun','Housing and living','b2;housing'],
['die Mietpreisbremse','die','','rent control','Die Mietpreisbremse gilt hier.','noun','Housing and living','b2;housing'],
];
emit(10, 'Housing and Living', topic11);

// 11. Travel and Transport
const topic12 = [
['der Flugverkehr','der','','air traffic','Der Flugverkehr nimmt zu.','noun','Travel and transport','b2;travel'],
['die Fahrplanauskunft','die','','timetable information','Die Auskunft ist online.','noun','Travel and transport','b2;travel'],
['der Nahverkehr','der','','local transport','Der Nahverkehr ist zuverlässig.','noun','Travel and transport','b2;travel'],
['der Fernverkehr','der','','long-distance transport','Der Fernverkehr ist teurer.','noun','Travel and transport','b2;travel'],
['die Fahrkarte','die','die Fahrkarten','ticket','Die Fahrkarte kostet 50 Euro.','noun','Travel and transport','b2;travel'],
['die Verspätung','die','die Verspätungen','delay','Die Verspätung beträgt 20 Minuten.','noun','Travel and transport','b2;travel'],
['der Anschlusszug','der','die Anschlusszüge','connecting train','Der Anschlusszug wartet nicht.','noun','Travel and transport','b2;travel'],
['die Bordkarte','die','die Bordkarten','boarding pass','Die Bordkarte wurde ausgedruckt.','noun','Travel and transport','b2;travel'],
['das Gepäck','das','','luggage','Das Gepäck wurde aufgegeben.','noun','Travel and transport','b2;travel'],
['der Koffer','der','die Koffer','suitcase','Der Koffer ist schwer.','noun','Travel and transport','b2;travel'],
['der Reisepass','der','die Reisepässe','passport','Der Reisepass ist gültig.','noun','Travel and transport','b2;travel'],
['das Visum','das','die Visa','visa','Das Visum wurde beantragt.','noun','Travel and transport','b2;travel'],
['die Unterkunft','die','die Unterkünfte','accommodation','Die Unterkunft ist gebucht.','noun','Travel and transport','b2;travel'],
['die Buchung','die','die Buchungen','booking','Die Buchung ist bestätigt.','noun','Travel and transport','b2;travel'],
['die Reiserücktrittsversicherung','die','','travel cancellation insurance','Die Versicherung zahlt bei Stornierung.','noun','Travel and transport','b2;travel'],
['die BahnCard','die','die BahnCards','rail discount card','Die BahnCard gibt 25 Prozent Rabatt.','noun','Travel and transport','b2;travel'],
['der Mietwagen','der','die Mietwagen','rental car','Der Mietwagen steht bereit.','noun','Travel and transport','b2;travel'],
['die Autobahn','die','die Autobahnen','highway','Die Autobahn ist voll.','noun','Travel and transport','b2;travel'],
['die Umleitung','die','die Umleitungen','detour','Die Umleitung ist ausgeschildert.','noun','Travel and transport','b2;travel'],
['der Stau','der','die Staus','traffic jam','Der Stau ist 10 Kilometer lang.','noun','Travel and transport','b2;travel'],
['die Parkgebühr','die','die Parkgebühren','parking fee','Die Parkgebühr beträgt 2 Euro pro Stunde.','noun','Travel and transport','b2;travel'],
['der Bahnsteig','der','die Bahnsteige','platform','Der Zug fährt ab Bahnsteig 3.','noun','Travel and transport','b2;travel'],
['die Abfahrt','die','die Abfahrten','departure','Die Abfahrt ist um 14 Uhr.','noun','Travel and transport','b2;travel'],
['die Ankunft','die','die Ankünfte','arrival','Die Ankunft ist verspätet.','noun','Travel and transport','b2;travel'],
['der Grenzübergang','der','die Grenzübergänge','border crossing','Der Grenzübergang ist kontrolliert.','noun','Travel and transport','b2;travel'],
];
emit(11, 'Travel and Transport', topic12);

// 12. Culture and Society
const topic13 = [
['die Bevölkerungsentwicklung','die','','population development','Die Entwicklung zeigt einen Rückgang.','noun','Culture and society','b2;culture'],
['die Integration','die','','integration','Die Integration ist eine Herausforderung.','noun','Culture and society','b2;culture'],
['der Migrationshintergrund','der','','migration background','Viele haben einen Migrationshintergrund.','noun','Culture and society','b2;culture'],
['die Gleichberechtigung','die','','equal rights','Die Gleichberechtigung ist gesetzlich verankert.','noun','Culture and society','b2;culture'],
['die Toleranz','die','','tolerance','Toleranz ist wichtig für das Zusammenleben.','noun','Culture and society','b2;culture'],
['der Brauch','der','die Bräuche','custom, tradition','Der Brauch wird seit Jahrhunderten gepflegt.','noun','Culture and society','b2;culture'],
['die Tradition','die','die Traditionen','tradition','Die Tradition wird weitergegeben.','noun','Culture and society','b2;culture'],
['das Brauchtum','das','','customs and traditions','Das Brauchtum ist vielfältig.','noun','Culture and society','b2;culture'],
['der Feiertag','der','die Feiertage','public holiday','Der Feiertag ist gesetzlich.','noun','Culture and society','b2;culture'],
['der Volksfest','das','die Volksfeste','folk festival','Das Volksfest findet im Mai statt.','noun','Culture and society','b2;culture'],
['die Vereinbarkeit','die','','compatibility','Die Vereinbarkeit von Familie und Beruf ist wichtig.','noun','Culture and society','b2;culture'],
['die Kinderbetreuung','die','','childcare','Die Kinderbetreuung ist kostenlos.','noun','Culture and society','b2;culture'],
['das Ehrenamt','das','','voluntary work','Das Ehrenamt ist wertvoll.','noun','Culture and society','b2;culture'],
['die Bürgergesellschaft','die','','civil society','Die Bürgergesellschaft engagiert sich.','noun','Culture and society','b2;culture'],
['die Emanzipation','die','','emancipation','Die Emanzipation der Frau schreitet voran.','noun','Culture and society','b2;culture'],
['der Lebensstandard','der','','standard of living','Der Lebensstandard ist hoch.','noun','Culture and society','b2;culture'],
['die Lebensqualität','die','','quality of life','Die Lebensqualität ist gut.','noun','Culture and society','b2;culture'],
['die Armut','die','','poverty','Die Armut nimmt zu.','noun','Culture and society','b2;culture'],
['die Wohlstandsgesellschaft','die','','affluent society','Die Wohlstandsgesellschaft konsumiert viel.','noun','Culture and society','b2;culture'],
['das Zusammenleben','das','','coexistence','Das Zusammenleben funktioniert gut.','noun','Culture and society','b2;culture'],
['die Diskriminierung','die','','discrimination','Diskriminierung ist verboten.','noun','Culture and society','b2;culture'],
['die Inklusion','die','','inclusion','Inklusion in Schulen wird gefördert.','noun','Culture and society','b2;culture'],
['die Vielfalt','die','','diversity','Vielfalt ist eine Stärke.','noun','Culture and society','b2;culture'],
['der Wertewandel','der','','value shift','Der Wertewandel betrifft die ganze Gesellschaft.','noun','Culture and society','b2;culture'],
['die Zivilcourage','die','','civil courage','Zivilcourage wird belohnt.','noun','Culture and society','b2;culture'],
];
emit(12, 'Culture and Society', topic13);

// Write the appendix
const appendix = lines.join('\n');
const filePath = 'scripts/remainder_b2_words.txt';
fs.writeFileSync(filePath, appendix, 'utf-8');
console.log('Generated', lines.filter(l => l.startsWith("['")).length, 'word entries');
console.log('Total batch words so far:', batchAdded.size);
console.log('Written to:', filePath);
