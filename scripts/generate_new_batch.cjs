// This script TAKES WHATEVER WORDS exist in gen_b2_compact.cjs, 
// runs the generation, and writes the CSV batch file.
// Then it runs the full pipeline.

const fs = require('fs');

// ==== Step 1: Evaluate any existing word data from gen_b2_compact.cjs ====
// We can't require() it since it's not a module, so let's redefine the words

const existingTxt = fs.readFileSync('scripts/existing_b2.txt','utf-8');
const existing = new Set(existingTxt.split('\n').map(x=>x.trim().toLowerCase().replace(/^(der|die|das) /,'')).filter(x=>x));
const batchAdded = new Set();
function nw(w){return w.trim().toLowerCase().replace(/^(der|die|das) /,'');}
function esc(v){if(v==null||v==='')return '';const s=String(v);return s.indexOf(',')>=0||s.indexOf('"')>=0?'"'+s.replace(/"/g,'""')+'"':s;}
function word(a,p,pl,tr,ex,pos,top,tag){const w=nw(a);if(existing.has(w)||batchAdded.has(w))return null;batchAdded.add(w);return ['','B2',esc(a),esc(p||''),esc(pl||''),esc(tr),esc(ex),esc(pos),esc(top),esc(tag),'B2_lesson_general'].join(',');}
const rows=[];
function add(ar){for(const e of ar){const r=word(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]);if(r)rows.push(r);}}

// Now define exactly 300 words across 12 additional topics (25 each)
// Topics 9-20

// T9: Media and Communication (25)
add([
['die Berichterstattung','die','','reporting','Die Berichterstattung ist ausgewogen.','noun','Media and communication','b2;media'],
['der Journalist','der','die Journalisten','journalist','Der Journalist recherchiert.','noun','Media and communication','b2;media'],
['die Schlagzeile','die','die Schlagzeilen','headline','Die Schlagzeile ist reißerisch.','noun','Media and communication','b2;media'],
['die Pressemitteilung','die','die Pressemitteilungen','press release','Die PM wurde veröffentlicht.','noun','Media and communication','b2;media'],
['der Sender','der','die Sender','broadcaster','Der Sender zeigt die Nachrichten.','noun','Media and communication','b2;media'],
['die Reportage','die','die Reportagen','report','Die Reportage war interessant.','noun','Media and communication','b2;media'],
['das Interview','das','die Interviews','interview','Das Interview wurde aufgezeichnet.','noun','Media and communication','b2;media'],
['die Auflage','die','die Auflagen','circulation','Die Auflage sinkt.','noun','Media and communication','b2;media'],
['die Öffentlichkeit','die','','public','Die Öffentlichkeit wurde informiert.','noun','Media and communication','b2;media'],
['die Einschaltquote','die','die Einschaltquoten','ratings','Die Quote ist hoch.','noun','Media and communication','b2;media'],
['die Redaktion','die','die Redaktionen','editorial team','Die Redaktion arbeitet rund um die Uhr.','noun','Media and communication','b2;media'],
['die Zeitschrift','die','die Zeitschriften','magazine','Die Zeitschrift erscheint monatlich.','noun','Media and communication','b2;media'],
['die Tageszeitung','die','die Tageszeitungen','daily newspaper','Die Zeitung kommt jeden Morgen.','noun','Media and communication','b2;media'],
['die Werbung','die','die Werbungen','advertisement','Die Werbung läuft im Fernsehen.','noun','Media and communication','b2;media'],
['die Anzeige','die','die Anzeigen','ad','Die Anzeige stand in der Zeitung.','noun','Media and communication','b2;media'],
['die Übertragung','die','die Übertragungen','broadcast','Die Übertragung beginnt um 20 Uhr.','noun','Media and communication','b2;media'],
['die Kolumne','die','die Kolumnen','column','Die Kolumne erscheint wöchentlich.','noun','Media and communication','b2;media'],
['die Umfrage','die','die Umfragen','survey','Die Umfrage ergab klare Ergebnisse.','noun','Media and communication','b2;media'],
['die Zielgruppe','die','die Zielgruppen','target audience','Die Zielgruppe sind junge Erwachsene.','noun','Media and communication','b2;media'],
['der Kommentar','der','die Kommentare','commentary','Der Kommentar war kritisch.','noun','Media and communication','b2;media'],
['der Artikel','der','die Artikel','article','Der Artikel wurde veröffentlicht.','noun','Media and communication','b2;media'],
['die Rubrik','die','die Rubriken','section','Die Rubrik erscheint sonntags.','noun','Media and communication','b2;media'],
['die Nachrichtenagentur','die','die Nachrichtenagenturen','news agency','Die Agentur beliefert alle Sender.','noun','Media and communication','b2;media'],
['die Presserfreiheit','die','','press freedom','Die Presserfreiheit ist ein Grundrecht.','noun','Media and communication','b2;media'],
['der Chef vom Dienst','der','','editor on duty','Der Chef vom Dienst prüft die Artikel.','noun','Media and communication','b2;media'],
]);

// T10: Housing and Living (25)
add([
['die Mietwohnung','die','die Mietwohnungen','rental apartment','Die Mietwohnung hat drei Zimmer.','noun','Housing and living','b2;housing'],
['der Mietvertrag','der','die Mietverträge','rental contract','Der Mietvertrag wurde unterschrieben.','noun','Housing and living','b2;housing'],
['die Wohnungsbesichtigung','die','die Wohnungsbesichtigungen','apartment viewing','Die Besichtigung ist morgen.','noun','Housing and living','b2;housing'],
['die Nebenkosten','die','','utility costs','Die Nebenkosten sind hoch.','noun','Housing and living','b2;housing'],
['die Kaution','die','die Kautionen','deposit','Die Kaution beträgt drei Monatsmieten.','noun','Housing and living','b2;housing'],
['der Vermieter','der','die Vermieter','landlord','Der Vermieter ist freundlich.','noun','Housing and living','b2;housing'],
['der Mieter','der','die Mieter','tenant','Der Mieter zahlt pünktlich.','noun','Housing and living','b2;housing'],
['der Grundriss','der','die Grundrisse','floor plan','Der Grundriss zeigt drei Zimmer.','noun','Housing and living','b2;housing'],
['die Einbauküche','die','die Einbauküchen','fitted kitchen','Die Einbauküche ist modern.','noun','Housing and living','b2;housing'],
['der Balkon','der','die Balkone','balcony','Der Balkon geht nach Süden.','noun','Housing and living','b2;housing'],
['die Heizung','die','die Heizungen','heating','Die Heizung funktioniert gut.','noun','Housing and living','b2;housing'],
['die Renovierung','die','die Renovierungen','renovation','Die Renovierung kostet viel.','noun','Housing and living','b2;housing'],
['die Wohnungseinrichtung','die','','furnishing','Die Einrichtung ist modern.','noun','Housing and living','b2;housing'],
['das Stockwerk','das','die Stockwerke','floor','Das Stockwerk ist der dritte.','noun','Housing and living','b2;housing'],
['der Fahrstuhl','der','die Fahrstühle','elevator','Der Fahrstuhl ist defekt.','noun','Housing and living','b2;housing'],
['die Hausordnung','die','die Hausordnungen','house rules','Die Hausordnung hängt im Flur.','noun','Housing and living','b2;housing'],
['der Hausmeister','der','die Hausmeister','janitor','Der Hausmeister repariert alles.','noun','Housing and living','b2;housing'],
['die Terrasse','die','die Terrassen','terrace','Die Terrasse ist groß.','noun','Housing and living','b2;housing'],
['der Keller','der','die Keller','basement','Der Keller ist feucht.','noun','Housing and living','b2;housing'],
['der Dachboden','der','die Dachböden','attic','Der Dachboden wird als Lager genutzt.','noun','Housing and living','b2;housing'],
['die Mietpreisbremse','die','','rent control','Die Mietpreisbremse gilt hier.','noun','Housing and living','b2;housing'],
['die Wohnungsanzeige','die','die Wohnungsanzeigen','housing ad','Die Anzeige war online.','noun','Housing and living','b2;housing'],
['die Eigentumswohnung','die','die Eigentumswohnungen','condo','Die Eigentumswohnung wurde gekauft.','noun','Housing and living','b2;housing'],
['der Wohnungsmarkt','der','','housing market','Der Wohnungsmarkt ist angespannt.','noun','Housing and living','b2;housing'],
['die Wohnungsnot','die','','housing shortage','Die Wohnungsnot ist ein großes Problem.','noun','Housing and living','b2;housing'],
]);

// T11: Travel and Transport (25)
add([
['die Fahrkarte','die','die Fahrkarten','ticket','Die Fahrkarte kostet 50 Euro.','noun','Travel and transport','b2;travel'],
['die Verspätung','die','die Verspätungen','delay','Die Verspätung beträgt 20 Minuten.','noun','Travel and transport','b2;travel'],
['der Flugverkehr','der','','air traffic','Der Flugverkehr nimmt zu.','noun','Travel and transport','b2;travel'],
['der Nahverkehr','der','','local transport','Der Nahverkehr ist zuverlässig.','noun','Travel and transport','b2;travel'],
['der Fernverkehr','der','','long-distance transport','Der Fernverkehr ist teurer.','noun','Travel and transport','b2;travel'],
['der Anschlusszug','der','die Anschlusszüge','connecting train','Der Anschlusszug wartet nicht.','noun','Travel and transport','b2;travel'],
['die Bordkarte','die','die Bordkarten','boarding pass','Die Bordkarte wurde ausgedruckt.','noun','Travel and transport','b2;travel'],
['das Gepäck','das','','luggage','Das Gepäck wurde aufgegeben.','noun','Travel and transport','b2;travel'],
['der Koffer','der','die Koffer','suitcase','Der Koffer ist schwer.','noun','Travel and transport','b2;travel'],
['der Reisepass','der','die Reisepässe','passport','Der Reisepass ist gültig.','noun','Travel and transport','b2;travel'],
['das Visum','das','die Visa','visa','Das Visum wurde beantragt.','noun','Travel and transport','b2;travel'],
['die Unterkunft','die','die Unterkünfte','accommodation','Die Unterkunft ist gebucht.','noun','Travel and transport','b2;travel'],
['die Buchung','die','die Buchungen','booking','Die Buchung ist bestätigt.','noun','Travel and transport','b2;travel'],
['die BahnCard','die','die BahnCards','rail discount card','Die BahnCard gibt 25% Rabatt.','noun','Travel and transport','b2;travel'],
['der Mietwagen','der','die Mietwagen','rental car','Der Mietwagen steht bereit.','noun','Travel and transport','b2;travel'],
['die Autobahn','die','die Autobahnen','highway','Die Autobahn ist voll.','noun','Travel and transport','b2;travel'],
['die Umleitung','die','die Umleitungen','detour','Die Umleitung ist ausgeschildert.','noun','Travel and transport','b2;travel'],
['der Stau','der','die Staus','traffic jam','Der Stau ist 10 Kilometer lang.','noun','Travel and transport','b2;travel'],
['der Bahnsteig','der','die Bahnsteige','platform','Der Zug fährt ab Bahnsteig 3.','noun','Travel and transport','b2;travel'],
['die Abfahrt','die','die Abfahrten','departure','Die Abfahrt ist um 14 Uhr.','noun','Travel and transport','b2;travel'],
['die Ankunft','die','die Ankünfte','arrival','Die Ankunft ist verspätet.','noun','Travel and transport','b2;travel'],
['der Grenzübergang','der','die Grenzübergänge','border crossing','Der Grenzübergang ist kontrolliert.','noun','Travel and transport','b2;travel'],
['die Fahrplanauskunft','die','','timetable info','Die Auskunft ist online.','noun','Travel and transport','b2;travel'],
['die Parkgebühr','die','die Parkgebühren','parking fee','Die Parkgebühr beträgt 2 Euro.','noun','Travel and transport','b2;travel'],
['die Reiserücktrittsversicherung','die','','travel cancellation insurance','Die Versicherung zahlt bei Stornierung.','noun','Travel and transport','b2;travel'],
]);

// T12: Culture and Society (25)
add([
['die Integration','die','','integration','Die Integration ist eine Herausforderung.','noun','Culture and society','b2;culture'],
['die Gleichberechtigung','die','','equal rights','Die Gleichberechtigung ist gesetzlich verankert.','noun','Culture and society','b2;culture'],
['die Toleranz','die','','tolerance','Toleranz ist wichtig.','noun','Culture and society','b2;culture'],
['der Brauch','der','die Bräuche','custom','Der Brauch wird seit Jahrhunderten gepflegt.','noun','Culture and society','b2;culture'],
['die Tradition','die','die Traditionen','tradition','Die Tradition wird weitergegeben.','noun','Culture and society','b2;culture'],
['der Feiertag','der','die Feiertage','public holiday','Der Feiertag ist gesetzlich.','noun','Culture and society','b2;culture'],
['das Volksfest','das','die Volksfeste','folk festival','Das Volksfest findet im Mai statt.','noun','Culture and society','b2;culture'],
['die Kinderbetreuung','die','','childcare','Die Kinderbetreuung ist kostenlos.','noun','Culture and society','b2;culture'],
['das Ehrenamt','das','','voluntary work','Das Ehrenamt ist wertvoll.','noun','Culture and society','b2;culture'],
['die Emanzipation','die','','emancipation','Die Emanzipation der Frau schreitet voran.','noun','Culture and society','b2;culture'],
['der Lebensstandard','der','','standard of living','Der Lebensstandard ist hoch.','noun','Culture and society','b2;culture'],
['die Lebensqualität','die','','quality of life','Die Lebensqualität ist gut.','noun','Culture and society','b2;culture'],
['die Armut','die','','poverty','Die Armut nimmt zu.','noun','Culture and society','b2;culture'],
['die Diskriminierung','die','','discrimination','Diskriminierung ist verboten.','noun','Culture and society','b2;culture'],
['die Inklusion','die','','inclusion','Inklusion in Schulen wird gefördert.','noun','Culture and society','b2;culture'],
['die Vielfalt','die','','diversity','Vielfalt ist eine Stärke.','noun','Culture and society','b2;culture'],
['die Zivilcourage','die','','civil courage','Zivilcourage wird belohnt.','noun','Culture and society','b2;culture'],
['der Wertewandel','der','','value shift','Der Wertewandel betrifft die Gesellschaft.','noun','Culture and society','b2;culture'],
['das Zusammenleben','das','','coexistence','Das Zusammenleben funktioniert gut.','noun','Culture and society','b2;culture'],
['die Bevölkerungsentwicklung','die','','population development','Die Entwicklung zeigt einen Rückgang.','noun','Culture and society','b2;culture'],
['der Migrationshintergrund','der','','migration background','Viele haben einen Migrationshintergrund.','noun','Culture and society','b2;culture'],
['die Bürgergesellschaft','die','','civil society','Die Bürgergesellschaft engagiert sich.','noun','Culture and society','b2;culture'],
['die Wohlstandsgesellschaft','die','','affluent society','Die Wohlstandsgesellschaft konsumiert viel.','noun','Culture and society','b2;culture'],
['die Vereinbarkeit','die','','compatibility','Die Vereinbarkeit von Familie und Beruf ist wichtig.','noun','Culture and society','b2;culture'],
['die Völkerverständigung','die','','international understanding','Die Völkerverständigung fördert den Frieden.','noun','Culture and society','b2;culture'],
]);

// T13: Food and Nutrition (25)
add([
['die Ernährungsweise','die','','diet','Die Ernährungsweise ist ausgewogen.','noun','Food and nutrition','b2;food'],
['die Lebensmittelindustrie','die','','food industry','Die Lebensmittelindustrie produziert viel.','noun','Food and nutrition','b2;food'],
['das Biolabel','das','die Biolabels','organic label','Das Biolabel garantiert Qualität.','noun','Food and nutrition','b2;food'],
['der Nährwert','der','','nutritional value','Der Nährwert steht auf der Verpackung.','noun','Food and nutrition','b2;food'],
['die Zutat','die','die Zutaten','ingredient','Die Zutaten sind alle natürlich.','noun','Food and nutrition','b2;food'],
['die Mahlzeit','die','die Mahlzeiten','meal','Die Mahlzeit ist fertig.','noun','Food and nutrition','b2;food'],
['das Rezept','das','die Rezepte','recipe','Das Rezept ist einfach.','noun','Food and nutrition','b2;food'],
['die Vorspeise','die','die Vorspeisen','starter','Die Vorspeise war lecker.','noun','Food and nutrition','b2;food'],
['die Hauptspeise','die','die Hauptspeisen','main course','Die Hauptspeise wird serviert.','noun','Food and nutrition','b2;food'],
['die Nachspeise','die','die Nachspeisen','dessert','Die Nachspeise ist süß.','noun','Food and nutrition','b2;food'],
['das Buffet','das','die Buffets','buffet','Das Buffet ist reichhaltig.','noun','Food and nutrition','b2;food'],
['die Speisekarte','die','die Speisekarten','menu','Die Speisekarte bietet viel Auswahl.','noun','Food and nutrition','b2;food'],
['die Reservierung','die','die Reservierungen','reservation','Die Reservierung ist für 20 Uhr.','noun','Food and nutrition','b2;food'],
['der Kellner','der','die Kellner','waiter','Der Kellner bringt die Getränke.','noun','Food and nutrition','b2;food'],
['die Bedienung','die','','service','Die Bedienung war sehr gut.','noun','Food and nutrition','b2;food'],
['das Trinkgeld','das','die Trinkgelder','tip','Das Trinkgeld ist hier üblich.','noun','Food and nutrition','b2;food'],
['die Lebensmittelverschwendung','die','','food waste','Die Lebensmittelverschwendung ist ein Problem.','noun','Food and nutrition','b2;food'],
['die Frische','die','','freshness','Die Frische der Produkte ist wichtig.','noun','Food and nutrition','b2;food'],
['die Tiefkühlkost','die','','frozen food','Tiefkühlkost ist praktisch.','noun','Food and nutrition','b2;food'],
['die Küche','die','die Küchen','cuisine','Die italienische Küche ist beliebt.','noun','Food and nutrition','b2;food'],
['die Ernährung','die','','nutrition','Ernährung beeinflusst die Gesundheit.','noun','Food and nutrition','b2;food'],
['der Geschmack','der','die Geschmäcker','taste','Der Geschmack ist ausgezeichnet.','noun','Food and nutrition','b2;food'],
['die Lebensmittelvergiftung','die','','food poisoning','Die Lebensmittelvergiftung war schlimm.','noun','Food and nutrition','b2;food'],
['die Nahrungsergänzung','die','die Nahrungsergänzungen','supplement','Nahrungsergänzung kann sinnvoll sein.','noun','Food and nutrition','b2;food'],
['die Kochshow','die','die Kochshows','cooking show','Die Kochshow läuft samstags.','noun','Food and nutrition','b2;food'],
]);

// T14: Sports and Fitness (25)
add([
['die Sportart','die','die Sportarten','type of sport','Meine Sportart ist Schwimmen.','noun','Sports and fitness','b2;sports'],
['der Wettkampf','der','die Wettkämpfe','competition','Der Wettkampf findet am Samstag statt.','noun','Sports and fitness','b2;sports'],
['die Meisterschaft','die','die Meisterschaften','championship','Die Meisterschaft beginnt im Juni.','noun','Sports and fitness','b2;sports'],
['die Mannschaft','die','die Mannschaften','team','Die Mannschaft hat gewonnen.','noun','Sports and fitness','b2;sports'],
['der Trainer','der','die Trainer','coach','Der Trainer motiviert die Spieler.','noun','Sports and fitness','b2;sports'],
['das Training','das','','training','Das Training ist anstrengend.','noun','Sports and fitness','b2;sports'],
['die Ausdauer','die','','endurance','Die Ausdauer verbessert sich.','noun','Sports and fitness','b2;sports'],
['die Beweglichkeit','die','','flexibility','Die Beweglichkeit ist wichtig.','noun','Sports and fitness','b2;sports'],
['die Kraft','die','die Kräfte','strength','Die Kraft nimmt zu.','noun','Sports and fitness','b2;sports'],
['die Verletzung','die','die Verletzungen','injury','Die Verletzung heilt langsam.','noun','Sports and fitness','b2;sports'],
['der Sportverein','der','die Sportvereine','sports club','Der Sportverein hat viele Mitglieder.','noun','Sports and fitness','b2;sports'],
['die Sportstätte','die','die Sportstätten','sports venue','Die Sportstätte ist modern.','noun','Sports and fitness','b2;sports'],
['das Stadion','das','die Stadien','stadium','Das Stadion fasst 50.000 Zuschauer.','noun','Sports and fitness','b2;sports'],
['der Zuschauer','der','die Zuschauer','spectator','Die Zuschauer feierten den Sieg.','noun','Sports and fitness','b2;sports'],
['der Schiedsrichter','der','die Schiedsrichter','referee','Der Schiedsrichter pfeift das Spiel an.','noun','Sports and fitness','b2;sports'],
['die Weltmeisterschaft','die','die Weltmeisterschaften','world championship','Die Weltmeisterschaft findet alle vier Jahre statt.','noun','Sports and fitness','b2;sports'],
['die Olympischen Spiele','die','','Olympic Games','Die Olympischen Spiele sind ein großes Event.','noun','Sports and fitness','b2;sports'],
['die Medaille','die','die Medaillen','medal','Die Medaille ist aus Gold.','noun','Sports and fitness','b2;sports'],
['der Sportler','der','die Sportler','athlete','Der Sportler trainiert täglich.','noun','Sports and fitness','b2;sports'],
['der Freizeitsport','der','','recreational sports','Freizeitsport ist gut für die Gesundheit.','noun','Sports and fitness','b2;sports'],
['die Fitness','die','','fitness','Fitness ist wichtig.','noun','Sports and fitness','b2;sports'],
['das Fitnessstudio','das','die Fitnessstudios','gym','Das Fitnessstudio ist gut ausgestattet.','noun','Sports and fitness','b2;sports'],
['die Körperhaltung','die','','posture','Die Körperhaltung verbessert sich.','noun','Sports and fitness','b2;sports'],
['die Regeneration','die','','recovery','Die Regeneration ist wichtig nach dem Training.','noun','Sports and fitness','b2;sports'],
['der Leistungssport','der','','competitive sports','Leistungssport erfordert Disziplin.','noun','Sports and fitness','b2;sports'],
]);

// T15: Art and Entertainment (25)
add([
['die Ausstellung','die','die Ausstellungen','exhibition','Die Ausstellung ist bis Ende des Monats.','noun','Art and entertainment','b2;arts'],
['das Museum','das','die Museen','museum','Das Museum hat eine neue Sammlung.','noun','Art and entertainment','b2;arts'],
['die Galerie','die','die Galerien','gallery','Die Galerie zeigt moderne Kunst.','noun','Art and entertainment','b2;arts'],
['das Theater','das','die Theater','theatre','Das Theater spielt ein neues Stück.','noun','Art and entertainment','b2;arts'],
['die Oper','die','die Opern','opera','Die Oper war ausverkauft.','noun','Art and entertainment','b2;arts'],
['das Konzert','das','die Konzerte','concert','Das Konzert beginnt um 20 Uhr.','noun','Art and entertainment','b2;arts'],
['der Film','der','die Filme','film','Der Film läuft seit letzter Woche.','noun','Art and entertainment','b2;arts'],
['die Aufführung','die','die Aufführungen','performance','Die Aufführung war beeindruckend.','noun','Art and entertainment','b2;arts'],
['die Karte','die','die Karten','ticket','Die Karte kostet 25 Euro.','noun','Art and entertainment','b2;arts'],
['die Vorstellung','die','die Vorstellungen','show','Die Vorstellung beginnt um 19.30 Uhr.','noun','Art and entertainment','b2;arts'],
['der Künstler','der','die Künstler','artist','Der Künstler malt in Öl.','noun','Art and entertainment','b2;arts'],
['das Gemälde','das','die Gemälde','painting','Das Gemälde hängt im Museum.','noun','Art and entertainment','b2;arts'],
['die Skulptur','die','die Skulpturen','sculpture','Die Skulptur steht im Park.','noun','Art and entertainment','b2;arts'],
['die Kultur','die','','culture','Die Kultur ist vielfältig.','noun','Art and entertainment','b2;arts'],
['das Festival','das','die Festivals','festival','Das Festival findet im Sommer statt.','noun','Art and entertainment','b2;arts'],
['die Premiere','die','die Premieren','premiere','Die Premiere war ein großer Erfolg.','noun','Art and entertainment','b2;arts'],
['die Kritik','die','die Kritiken','review','Die Kritik fiel positiv aus.','noun','Art and entertainment','b2;arts'],
['der Regisseur','der','die Regisseure','director','Der Regisseur dreht einen neuen Film.','noun','Art and entertainment','b2;arts'],
['der Schauspieler','der','die Schauspieler','actor','Der Schauspieler spielt die Hauptrolle.','noun','Art and entertainment','b2;arts'],
['die Leinwand','die','die Leinwände','screen','Die Leinwand ist riesig.','noun','Art and entertainment','b2;arts'],
['die Auszeichnung','die','die Auszeichnungen','award','Die Auszeichnung wurde verliehen.','noun','Art and entertainment','b2;arts'],
['das Publikum','das','','audience','Das Publikum applaudierte.','noun','Art and entertainment','b2;arts'],
['die Inszenierung','die','die Inszenierungen','staging','Die Inszenierung war modern.','noun','Art and entertainment','b2;arts'],
['das Bühnenbild','das','','set design','Das Bühnenbild war beeindruckend.','noun','Art and entertainment','b2;arts'],
['die Unterhaltungsbranche','die','','entertainment industry','Die Unterhaltungsbranche wächst.','noun','Art and entertainment','b2;arts'],
]);

// T16: Psychology and Personal Growth (25)
add([
['die Persönlichkeit','die','die Persönlichkeiten','personality','Die Persönlichkeit entwickelt sich.','noun','Psychology and personal growth','b2;psychology'],
['die Selbstwahrnehmung','die','','self-perception','Die Selbstwahrnehmung ist wichtig.','noun','Psychology and personal growth','b2;psychology'],
['das Selbstbewusstsein','das','','self-confidence','Das Selbstbewusstsein stärkt.','noun','Psychology and personal growth','b2;psychology'],
['die Motivation','die','','motivation','Die Motivation ist hoch.','noun','Psychology and personal growth','b2;psychology'],
['das Ziel','das','die Ziele','goal','Das Ziel ist erreicht.','noun','Psychology and personal growth','b2;psychology'],
['der Erfolg','der','die Erfolge','success','Der Erfolg stellt sich ein.','noun','Psychology and personal growth','b2;psychology'],
['das Scheitern','das','','failure','Das Scheitern gehört zum Leben.','noun','Psychology and personal growth','b2;psychology'],
['die Krise','die','die Krisen','crisis','Die Krise wurde überwunden.','noun','Psychology and personal growth','b2;psychology'],
['die Belastbarkeit','die','','resilience','Die Belastbarkeit ist gefragt.','noun','Psychology and personal growth','b2;psychology'],
['der Stress','der','','stress','Stress ist gesundheitsschädlich.','noun','Psychology and personal growth','b2;psychology'],
['die Entspannung','die','','relaxation','Entspannung ist wichtig.','noun','Psychology and personal growth','b2;psychology'],
['die Achtsamkeit','die','','mindfulness','Achtsamkeit hilft beim Umgang mit Stress.','noun','Psychology and personal growth','b2;psychology'],
['die Kommunikation','die','','communication','Kommunikation ist der Schlüssel.','noun','Psychology and personal growth','b2;psychology'],
['das Verhalten','das','','behavior','Das Verhalten ändert sich.','noun','Psychology and personal growth','b2;psychology'],
['die Einstellung','die','die Einstellungen','attitude','Die Einstellung ist positiv.','noun','Psychology and personal growth','b2;psychology'],
['die Gewohnheit','die','die Gewohnheiten','habit','Die Gewohnheit abzulegen ist schwer.','noun','Psychology and personal growth','b2;psychology'],
['die Entwicklung','die','die Entwicklungen','development','Die Entwicklung schreitet voran.','noun','Psychology and personal growth','b2;psychology'],
['die Fähigkeit','die','die Fähigkeiten','ability','Die Fähigkeit wird trainiert.','noun','Psychology and personal growth','b2;psychology'],
['die Emotion','die','die Emotionen','emotion','Emotionen zu verstehen ist wichtig.','noun','Psychology and personal growth','b2;psychology'],
['die Empathie','die','','empathy','Empathie ist eine wichtige Eigenschaft.','noun','Psychology and personal growth','b2;psychology'],
['die Entscheidung','die','die Entscheidungen','decision','Die Entscheidung ist gefallen.','noun','Psychology and personal growth','b2;psychology'],
['die Verantwortung','die','die Verantwortungen','responsibility','Die Verantwortung wird übernommen.','noun','Psychology and personal growth','b2;psychology'],
['die Dankbarkeit','die','','gratitude','Dankbarkeit fördert das Wohlbefinden.','noun','Psychology and personal growth','b2;psychology'],
['die Zufriedenheit','die','','satisfaction','Die Zufriedenheit ist gestiegen.','noun','Psychology and personal growth','b2;psychology'],
['die Work-Life-Balance','die','','work-life balance','Die Work-Life-Balance ist wichtig.','noun','Psychology and personal growth','b2;psychology'],
]);

// T17: Politics and Government (25)
add([
['die Politik','die','','politics','Die Politik beschäftigt sich mit aktuellen Themen.','noun','Politics and government','b2;politics'],
['die Regierung','die','die Regierungen','government','Die Regierung stellt neue Gesetze vor.','noun','Politics and government','b2;politics'],
['die Partei','die','die Parteien','political party','Die Partei hat eine neue Vorsitzende.','noun','Politics and government','b2;politics'],
['der Wähler','der','die Wähler','voter','Die Wähler gehen zur Wahl.','noun','Politics and government','b2;politics'],
['die Wahl','die','die Wahlen','election','Die Wahl findet im September statt.','noun','Politics and government','b2;politics'],
['der Kanzler','der','die Kanzler','chancellor','Der Kanzler regiert das Land.','noun','Politics and government','b2;politics'],
['das Parlament','das','die Parlamente','parliament','Das Parlament debattiert das Gesetz.','noun','Politics and government','b2;politics'],
['die Demokratie','die','','democracy','Die Demokratie lebt von der Beteiligung.','noun','Politics and government','b2;politics'],
['die Opposition','die','','opposition','Die Opposition kritisiert die Regierung.','noun','Politics and government','b2;politics'],
['das Gesetz','das','die Gesetze','law','Das Gesetz wurde verabschiedet.','noun','Politics and government','b2;politics'],
['die Steuer','die','die Steuern','tax','Die Steuer wird erhoben.','noun','Politics and government','b2;politics'],
['der Haushalt','der','die Haushalte','budget','Der Haus