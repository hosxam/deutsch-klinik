/**
 * a2-vocab-expand.cjs
 * Phase 4 Stage 2: Expand A2 vocabulary from 746 to 1000+ entries.
 * Adds new, original German words appropriate for A2 learners.
 * Preserves all existing vocabulary - only adds missing words.
 */
const fs = require('fs');
const path = require('path');

const VOCAB_PATH = path.join(__dirname, '..', 'src', 'data', 'germanVocabulary.json');

// Topic to lesson ID mapping (must match lesson conceptIds)
const TOPIC_LESSON = {
  'Travel':           'A2_lesson_4',
  'Daily Life':       'A2_lesson_2',
  'Past Activities':  'A2_lesson_3',
  'Health':           'A2_lesson_11',
  'Food':             'A2_lesson_7',
  'Work':             'A2_lesson_8',
  'Education':        'A2_lesson_9',
  'Housing':          'A2_lesson_10',
  'Hobbies':          'A2_lesson_14',
  'Feelings':         'A2_lesson_22',
  'Technology':       'A2_lesson_21',
  'Admin':            'A2_lesson_20',
  'Clothing':         'A2_lesson_18',
  'Communication':    'A2_lesson_15',
  'Medical':          'A2_lesson_12',
  'Shopping':         'A2_lesson_6',
  'Nature':           'A2_lesson_22',
  'Culture':          'A2_lesson_24',
  'People':           'A2_lesson_17',
  'Finance':          'A2_lesson_6',
  'Furniture':        'A2_lesson_10',
  'Time':             'A2_lesson_2',
  'Wetter':           'A2_lesson_13',
  'Living':           'A2_lesson_10',
  'Grammar':          'A2_lesson_25',
  'Services':         'A2_lesson_6',
};

// [topic, word, translation, article, plural, example, partOfSpeech]
const ENTRIES = [
  // === CLOTHING (needs more - only 8) ===
  ['Clothing','der Badeanzug','swimsuit','der','-züge','Der Badeanzug ist blau.','noun'],
  ['Clothing','die Badehose','swim trunks','die','-n','Die Badehose ist nass.','noun'],
  ['Clothing','der Bikini','bikini','der','-s','Der Bikini ist bunt.','noun'],
  ['Clothing','der Gürtel','belt','der','-','Der Gürtel ist aus Leder.','noun'],
  ['Clothing','der Handschuh','glove','der','-e','Die Handschuhe sind warm.','noun'],
  ['Clothing','die Mütze','hat','die','-n','Die Mütze ist gestrickt.','noun'],
  ['Clothing','der Ohrring','earring','der','-e','Die Ohrringe sind golden.','noun'],
  ['Clothing','das T-Shirt','T-shirt','das','-s','Das T-Shirt ist weiß.','noun'],
  ['Clothing','der Schuh','shoe','der','-e','Die Schuhe sind bequem.','noun'],
  ['Clothing','der Stoff','fabric','der','-e','Der Stoff ist weich.','noun'],
  ['Clothing','die Wolle','wool','die','-','Die Wolle wärmt gut.','noun'],
  ['Clothing','die Baumwolle','cotton','die','-','Baumwolle ist atmungsaktiv.','noun'],
  ['Clothing','die Seide','silk','die','-','Die Seide ist glatt.','noun'],
  ['Clothing','die Größe','size','die','-n','Welche Größe haben Sie?','noun'],
  ['Clothing','die Farbe','color','die','-n','Die Farbe steht Ihnen gut.','noun'],
  ['Clothing','das Muster','pattern','das','-','Das Muster ist gestreift.','noun'],
  ['Clothing','die Lederjacke','leather jacket','die','-n','Die Lederjacke ist klassisch.','noun'],
  ['Clothing','der Trainingsanzug','tracksuit','der','-züge','Der Trainingsanzug ist bequem.','noun'],
  ['Clothing','die Jeans','jeans (pl)','pl','-','Die Jeans passt gut.','noun'],
  ['Clothing','der Kleiderbügel','hanger','der','-','Der Kleiderbügel ist aus Holz.','noun'],
  ['Clothing','der Schuhschrank','shoe cabinet','der','-schränke','Der Schuhschrank ist voll.','noun'],

  // === FURNITURE (needs more - only 8) ===
  ['Furniture','der Kleiderschrank','wardrobe','der','-schränke','Der Kleiderschrank ist voll.','noun'],
  ['Furniture','der Nachttisch','nightstand','der','-e','Auf dem Nachttisch steht eine Lampe.','noun'],
  ['Furniture','der Esstisch','dining table','der','-e','Der Esstisch ist gedeckt.','noun'],
  ['Furniture','die Kommode','chest of drawers','die','-n','In der Kommode sind Socken.','noun'],
  ['Furniture','der Sessel','armchair','der','-','Der Sessel ist bequem.','noun'],
  ['Furniture','das Bücherregal','bookshelf','das','-e','Das Bücherregal steht an der Wand.','noun'],
  ['Furniture','der Hocker','stool','der','-','Der Hocker ist klein.','noun'],
  ['Furniture','die Stehlampe','floor lamp','die','-n','Die Stehlampe leuchtet hell.','noun'],
  ['Furniture','die Kommode','dresser','die','-n','In der Kommode sind Kleider.','noun'],
  ['Furniture','das Wandregal','wall shelf','das','-e','Das Wandregal hängt über dem Bett.','noun'],
  ['Furniture','der Schaukelstuhl','rocking chair','der','-stühle','Der Schaukelstuhl wiegt sich.','noun'],
  ['Furniture','der Beistelltisch','side table','der','-e','Der Beistelltisch ist klein.','noun'],

  // === COMMUNICATION (needs more - only 9) ===
  ['Communication','der Anrufbeantworter','answering machine','der','-','Der Anrufbeantworter nimmt Nachrichten auf.','noun'],
  ['Communication','der Chat','chat','der','-s','Der Chat ist privat.','noun'],
  ['Communication','die Benachrichtigung','notification','die','-en','Die Benachrichtigung erscheint auf dem Bildschirm.','noun'],
  ['Communication','die Sprachnachricht','voice message','die','-en','Die Sprachnachricht ist 30 Sekunden.','noun'],
  ['Communication','der Videoanruf','video call','der','-e','Der Videoanruf ist kostenlos.','noun'],
  ['Communication','die Statusmeldung','status update','die','-en','Die Statusmeldung ist öffentlich.','noun'],
  ['Communication','der Kontakt','contact','der','-e','Der Kontakt ist gespeichert.','noun'],
  ['Communication','das Profilbild','profile picture','das','-er','Das Profilbild ist aktuell.','noun'],
  ['Communication','die Signatur','signature','die','-en','Die Signatur steht unter der E-Mail.','noun'],
  ['Communication','die Voicemail','voicemail','die','-s','Die Voicemail ist voll.','noun'],
  ['Communication','die Durchsage','announcement','die','-n','Die Durchsage am Bahnhof.','noun'],
  ['Communication','die Fallnummer','case number','die','-n','Die Fallnummer ist 12345.','noun'],
  ['Communication','die Gruppenchat','group chat','die','-s','Der Gruppenchat ist aktiv.','noun'],

  // === MEDICAL (needs more - only 11) ===
  ['Medical','die Tablette','tablet','die','-n','Die Tablette gegen Schmerzen.','noun'],
  ['Medical','die Kapsel','capsule','die','-n','Die Kapsel ist schwer zu schlucken.','noun'],
  ['Medical','die Salbe','ointment','die','-n','Die Salbe für die Haut.','noun'],
  ['Medical','die Creme','cream','die','-s','Die Creme für die Hände.','noun'],
  ['Medical','das Pflaster','band-aid','das','-','Das Pflaster auf der Wunde.','noun'],
  ['Medical','die Mullbinde','gauze bandage','die','-n','Die Mullbinde für den Verband.','noun'],
  ['Medical','die Schere','scissors','die','-n','Die Schere schneidet den Verband.','noun'],
  ['Medical','die Pinzette','tweezers','die','-n','Die Pinzette entfernt den Splitter.','noun'],
  ['Medical','das Fieberthermometer','fever thermometer','das','-','Das Fieberthermometer zeigt 38 Grad.','noun'],
  ['Medical','das Rezept','prescription','das','-e','Der Arzt schreibt ein Rezept.','noun'],
  ['Medical','die Diagnose','diagnosis','die','-n','Die Diagnose ist klar.','noun'],
  ['Medical','die Behandlung','treatment','die','-en','Die Behandlung hilft.','noun'],
  ['Medical','das Antibiotikum','antibiotic','das','-ka','Das Antibiotikum wirkt.','noun'],
  ['Medical','die Dosis','dose','die','Dosen','Die Dosis ist niedrig.','noun'],
  ['Medical','die Nebenwirkung','side effect','die','-en','Die Nebenwirkung ist mild.','noun'],
  ['Medical','die Vorsorge','prevention','die','-','Vorsorge ist wichtig.','noun'],
  ['Medical','der Patient','patient','der','-en','Der Patient wartet.','noun'],
  ['Medical','die Notaufnahme','emergency room','die','-n','Die Notaufnahme hat 24 Stunden offen.','noun'],
  ['Medical','der Bluttest','blood test','der','-s','Der Bluttest ist negativ.','noun'],
  ['Medical','der Kaiserschnitt','C-section','der','-e','Der Kaiserschnitt ist geplant.','noun'],
  ['Medical','die Hebamme','midwife','die','-n','Die Hebamme kommt nach Hause.','noun'],
  ['Medical','der Kinderarzt','pediatrician','der','-ärzte','Der Kinderarzt untersucht das Baby.','noun'],

  // === CULTURE (needs more - only 16) ===
  ['Culture','der Nationalfeiertag','national holiday','der','-e','Der Nationalfeiertag ist der 3. Oktober.','noun'],
  ['Culture','der Umzug','parade','der','-züge','Der Umzug zieht durch die Stadt.','noun'],
  ['Culture','das Feuerwerk','fireworks','das','-e','Das Feuerwerk an Silvester ist schön.','noun'],
  ['Culture','der Weihnachtsmann','Santa Claus','der','-männer','Der Weihnachtsmann bringt Geschenke.','noun'],
  ['Culture','der Osterhase','Easter bunny','der','-hasen','Der Osterhase versteckt Eier.','noun'],
  ['Culture','die Weihnachtskarte','Christmas card','die','-n','Ich schreibe Weihnachtskarten.','noun'],
  ['Culture','die Geschenkidee','gift idea','die','-n','Die Geschenkidee ist kreativ.','noun'],
  ['Culture','die Bescherung','gift-giving','die','-en','Die Bescherung ist am Heiligabend.','noun'],
  ['Culture','der Heiligabend','Christmas Eve','der','-e','Heiligabend ist am 24.12.','noun'],
  ['Culture','der Silvesterabend','New Year Eve','der','-e','Der Silvesterabend wird gefeiert.','noun'],
  ['Culture','die Party','party','die','-s','Die Party war toll.','noun'],
  ['Culture','der Sekt','sparkling wine','der','-','Wir stoßen mit Sekt an.','noun'],
  ['Culture','das Buffet','buffet','das','-s','Das Buffet ist reichhaltig.','noun'],
  ['Culture','der Gastgeber','host','der','-','Die Gastgeber sind freundlich.','noun'],
  ['Culture','anstoßen','to clink glasses','','','Wir stoßen auf das neue Jahr an.','verb'],
  ['Culture','sich verkleiden','to dress up','','','Wir verkleiden uns zu Karneval.','verb'],
  ['Culture','der Jahreswechsel','turn of the year','der','-','Der Jahreswechsel ist am 31. Dezember.','noun'],
  ['Culture','die Silvesterparty','New Year party','die','-s','Die Silvesterparty ist laut.','noun'],

  // === PEOPLE (needs more - only 19) ===
  ['People','die Bekannte','acquaintance (f)','die','-n','Die Bekannte wohnt in Berlin.','noun'],
  ['People','der Nachbar','neighbor (m)','der','-n','Der Nachbar ist hilfreich.','noun'],
  ['People','die Nachbarin','neighbor (f)','die','-nen','Die Nachbarin gießt die Blumen.','noun'],
  ['People','der Gast','guest','der','-gäste','Der Gast kommt um 18 Uhr.','noun'],
  ['People','der Partner','partner (m)','der','-','Der Partner ist verständnisvoll.','noun'],
  ['People','die Partnerin','partner (f)','die','-nen','Die Partnerin arbeitet im Krankenhaus.','noun'],
  ['People','der Verwandte','relative (m)','der','-n','Der Verwandte besucht uns.','noun'],
  ['People','die Verwandte','relative (f)','die','-n','Die Verwandte wohnt in München.','noun'],
  ['People','der Mitbewohner','roommate (m)','der','-','Der Mitbewohner ist Student.','noun'],
  ['People','die Mitbewohnerin','roommate (f)','die','-nen','Die Mitbewohnerin kocht gern.','noun'],
  ['People','der Chef','boss (m)','der','-s','Der Chef ist zufrieden.','noun'],
  ['People','die Chefin','boss (f)','die','-nen','Die Chefin gibt Anweisungen.','noun'],
  ['People','der Zwilling','twin','der','-e','Die Zwillinge sehen gleich aus.','noun'],

  // === FINANCE (needs more - only 13) ===
  ['Finance','das Bargeld','cash','das','-','Ich habe kein Bargeld.','noun'],
  ['Finance','die Münze','coin','die','-n','Die Münze ist 2 Euro.','noun'],
  ['Finance','der Schein','bill','der','-e','Der Schein ist 50 Euro.','noun'],
  ['Finance','die Sparkasse','savings bank','die','-n','Die Sparkasse ist zuverlässig.','noun'],
  ['Finance','die Versicherung','insurance','die','-en','Die Versicherung zahlt.','noun'],
  ['Finance','die Steuer','tax','die','-n','Die Steuer wird abgezogen.','noun'],
  ['Finance','der Lohn','wage','der','-löhne','Der Lohn wird überwiesen.','noun'],
  ['Finance','sparen','to save (money)','','','Ich spare für den Urlaub.','verb'],
  ['Finance','verdienen','to earn','','','Sie verdient gut.','verb'],
  ['Finance','die Gebühr','fee','die','-en','Die Gebühr beträgt 50 Euro.','noun'],
  ['Finance','die Kreditkarte','credit card','die','-n','Ich bezahle mit Kreditkarte.','noun'],
  ['Finance','die Überweisung','bank transfer','die','-en','Die Überweisung dauert einen Tag.','noun'],
  ['Finance','das Konto','bank account','das','-konten','Das Konto ist gedeckt.','noun'],
  ['Finance','der Geldautomat','ATM','der','-en','Der Geldautomat ist neben der Bank.','noun'],
  ['Finance','die EC-Karte','debit card','die','-n','Ohne EC-Karte geht es nicht.','noun'],
  ['Finance','der Kontoauszug','bank statement','der','-züge','Der Kontoauszug ist da.','noun'],
  ['Finance','die Rate','installment','die','-n','Die Rate ist 200 Euro pro Monat.','noun'],
  ['Finance','der Zins','interest','der','-en','Die Zinsen sind niedrig.','noun'],

  // === SERVICES (needs more - only 22) ===
  ['Services','der Friseur','hairdresser','der','-e','Der Friseur hat geöffnet.','noun'],
  ['Services','die Friseurin','hairdresser (f)','die','-nen','Die Friseurin schneidet die Haare.','noun'],
  ['Services','die Reinigung','dry cleaner','die','-en','Die Reinigung ist gut.','noun'],
  ['Services','die Tankstelle','gas station','die','-n','Die Tankstelle hat geöffnet.','noun'],
  ['Services','der Schlüsseldienst','locksmith','der','-e','Der Schlüsseldienst öffnet die Tür.','noun'],
  ['Services','der Handwerker','craftsman','der','-','Der Handwerker repariert den Wasserhahn.','noun'],
  ['Services','die Werkstatt','workshop','die','-stätten','Die Werkstatt repariert Autos.','noun'],
  ['Services','der Service','service','der','-s','Der Service ist gut.','noun'],
  ['Services','die Reparatur','repair','die','-en','Die Reparatur dauert 2 Stunden.','noun'],
  ['Services','der Kundendienst','customer service','der','-e','Der Kundendienst hilft bei Problemen.','noun'],

  // === NATURE (needs more - only 42, keep quality) ===
  ['Nature','die Pflanze','plant','die','-n','Die Pflanze braucht Wasser.','noun'],
  ['Nature','der Strauch','bush','der','-sträucher','Der Strauch blüht im Frühling.','noun'],
  ['Nature','der Pilz','mushroom','der','-e','Der Pilz ist essbar.','noun'],
  ['Nature','das Moos','moss','das','-e','Das Moos wächst im Schatten.','noun'],
  ['Nature','das Gras','grass','das','-gräser','Das Gras ist grün.','noun'],
  ['Nature','die Wurzel','root','die','-n','Die Wurzel ist tief.','noun'],
  ['Nature','das Blatt','leaf','das','-blätter','Das Blatt fällt im Herbst.','noun'],
  ['Nature','die Blüte','blossom','die','-n','Die Blüte duftet.','noun'],
  ['Nature','der Bach','stream','der','-bäche','Der Bach fließt durch den Wald.','noun'],
  ['Nature','der Regenbogen','rainbow','der','-bogen','Der Regenbogen hat 7 Farben.','noun'],
  ['Nature','der Frost','frost','der','-','Der Frost kommt im Winter.','noun'],
  ['Nature','der Nebel','fog','der','-','Der Nebel ist dicht.','noun'],
  ['Nature','der Hagel','hail','der','-','Der Hagel beschädigt das Auto.','noun'],
  ['Nature','die Wolke','cloud','die','-n','Die Wolken sind grau.','noun'],
  ['Nature','der Blitz','lightning','der','-e','Der Blitz erhellt den Himmel.','noun'],
  ['Nature','der Donner','thunder','der','-','Der Donner folgt dem Blitz.','noun'],

  // === HOUSING (already 34, add a few more for depth) ===
  ['Housing','der Mietvertrag','lease','der','-träge','Der Mietvertrag ist unterschrieben.','noun'],
  ['Housing','die Wohnungsbesichtigung','apartment viewing','die','-en','Die Besichtigung ist am Samstag.','noun'],
  ['Housing','die Wohnungsanzeige','apartment ad','die','-n','Die Anzeige ist online.','noun'],
  ['Housing','der Makler','realtor','der','-','Der Makler zeigt die Wohnung.','noun'],
  ['Housing','die Provision','commission','die','-en','Die Provision beträgt 2 Kaltmieten.','noun'],
  ['Housing','die Hausverwaltung','property management','die','-en','Der Hausverwaltung melde ich Schäden.','noun'],
  ['Housing','die Wohnungstür','apartment door','die','-en','Die Wohnungstür ist abgeschlossen.','noun'],
  ['Housing','die Klingel','doorbell','die','-n','Die Klingel ist kaputt.','noun'],
  ['Housing','der Briefkasten','mailbox','der','-kästen','Der Briefkasten ist im Hausflur.','noun'],
  ['Housing','der Hausflur','hallway','der','-e','Der Hausflur ist sauber.','noun'],
  ['Housing','die Treppe','stairs','die','-n','Die Treppe ist steil.','noun'],
  ['Housing','der Aufzug','elevator','der','-züge','Der Aufzug ist außer Betrieb.','noun'],
  ['Housing','die Betriebskosten','operating costs (pl)','pl','-','Die Betriebskosten sind 150 Euro.','noun'],
  ['Housing','der Strom','electricity','der','-','Der Strom ist teuer.','noun'],
  ['Housing','das Gas','gas','das','-e','Das Gas heizt die Wohnung.','noun'],
  ['Housing','die Heizkosten','heating costs (pl)','pl','-','Die Heizkosten sind hoch.','noun'],
  ['Housing','die Bodenkammer','attic','die','-n','In der Bodenkammer sind Kartons.','noun'],
  ['Housing','der Fahrradkeller','bike basement','der','-','Im Fahrradkeller stehen die Räder.','noun'],

  // === SHOPPING (already 33, add relevant items) ===
  ['Shopping','die Tüte','bag','die','-n','Die Tüte ist aus Plastik.','noun'],
  ['Shopping','die Papiertüte','paper bag','die','-n','Die Papiertüte ist umweltfreundlich.','noun'],
  ['Shopping','das Pfand','deposit','das','-','Das Pfand für die Flasche ist 25 Cent.','noun'],
  ['Shopping','der Pfandautomat','deposit machine','der','-en','Der Pfandautomat gibt einen Bon.','noun'],
  ['Shopping','der Wocheneinkauf','weekly shopping','der','-e','Der Wocheneinkauf ist erledigt.','noun'],
  ['Shopping','die Aktion','promotion','die','-en','Die Aktion startet am Montag.','noun'],
  ['Shopping','die Kundenkarte','loyalty card','die','-n','Mit der Kundenkarte sparen Sie.','noun'],
  ['Shopping','der Kassenbon','receipt','der','-s','Der Kassenbon ist im Beutel.','noun'],
  ['Shopping','die Kaufberatung','purchase advice','die','-en','Die Beratung ist kostenlos.','noun'],
  ['Shopping','der Flohmarkt','flea market','der','-märkte','Der Flohmarkt ist am Sonntag.','noun'],
  ['Shopping','der Secondhandladen','thrift store','der','-läden','Der Secondhandladen hat günstige Kleidung.','noun'],

  // === HOBBIES (already 25, add specific activities) ===
  ['Hobbies','das Schach','chess','das','-','Schach ist ein Strategiespiel.','noun'],
  ['Hobbies','das Kartenspiel','card game','das','-e','Das Kartenspiel macht Spaß.','noun'],
  ['Hobbies','das Gesellschaftsspiel','board game','das','-e','Das Gesellschaftsspiel ist für 4 Personen.','noun'],
  ['Hobbies','der Waldweg','forest trail','der','-e','Der Waldweg ist schön zum Wandern.','noun'],
  ['Hobbies','die Radtour','bike tour','die','-en','Die Radtour geht durchs Grüne.','noun'],
  ['Hobbies','das Angeln','fishing','das','-','Angeln ist entspannend.','noun'],
  ['Hobbies','das Lied','song','das','-er','Das Lied hat eine schöne Melodie.','noun'],
  ['Hobbies','das Konzertticket','concert ticket','das','-s','Das Konzertticket kostet 50 Euro.','noun'],
  ['Hobbies','die Eintrittskarte','entrance ticket','die','-n','Die Eintrittskarte ist am Eingang.','noun'],
  ['Hobbies','der Künstler','artist','der','-','Der Künstler malt Ölbilder.','noun'],
  ['Hobbies','der Malkurs','painting class','der','-e','Der Malkurs ist dienstags.','noun'],
  ['Hobbies','der Yogakurs','yoga class','der','-e','Der Yogakurs entspannt.','noun'],
  ['Hobbies','der Kochkurs','cooking class','der','-e','Der Kochkurs lehrt italienische Küche.','noun'],
  ['Hobbies','der Musikgeschmack','music taste','der','-','Mein Musikgeschmack ist vielfältig.','noun'],
  ['Hobbies','die Melodie','melody','die','-n','Die Melodie ist eingängig.','noun'],

  // === EDUCATION (already 41, add depth) ===
  ['Education','das Lernziel','learning goal','das','-e','Das Lernziel ist das A2-Zertifikat.','noun'],
  ['Education','die Lernmethode','learning method','die','-n','Die Lernmethode ist effektiv.','noun'],
  ['Education','das Arbeitsblatt','worksheet','das','-blätter','Das Arbeitsblatt ist für Hausaufgaben.','noun'],
  ['Education','die Vokabelliste','vocab list','die','-n','Die Vokabelliste enthält 50 Wörter.','noun'],
  ['Education','die Grammatikregel','grammar rule','die','-n','Die Grammatikregel ist klar.','noun'],
  ['Education','das Leseverständnis','reading comprehension','das','-','Das Leseverständnis verbessert sich.','noun'],
  ['Education','das Hörverständnis','listening comprehension','das','-','Das Hörverständnis ist schwer.','noun'],
  ['Education','das Sprachniveau','language level','das','-s','Das Sprachniveau ist A2.','noun'],
  ['Education','das Selbststudium','self-study','das','-','Das Selbststudium ist wichtig.','noun'],
  ['Education','auffrischen','to refresh','','','Ich frische meine Kenntnisse auf.','verb'],
  ['Education','vertiefen','to deepen','','','Ich vertiefe die Grammatik.','verb'],

  // === TECHNOLOGY (already 33, add essential terms) ===
  ['Technology','das Betriebssystem','operating system','das','-e','Das Betriebssystem ist aktualisiert.','noun'],
  ['Technology','die Software','software','die','-','Die Software ist installiert.','noun'],
  ['Technology','die Datei','file','die','-en','Die Datei ist zu groß.','noun'],
  ['Technology','der Ordner','folder','der','-','Der Ordner enthält Dokumente.','noun'],
  ['Technology','die Verbindung','connection','die','-en','Die Verbindung ist schlecht.','noun'],
  ['Technology','das WLAN','Wi-Fi','das','-','Das WLAN ist langsam.','noun'],
  ['Technology','das Netzwerk','network','das','-e','Das Netzwerk ist sicher.','noun'],
  ['Technology','der Browser','browser','der','-','Der Browser ist auf dem neuesten Stand.','noun'],
  ['Technology','die Suchmaschine','search engine','die','-n','Die Suchmaschine findet alles.','noun'],
  ['Technology','der Link','link','der','-s','Der Link funktioniert nicht.','noun'],
  ['Technology','hochladen','to upload','','','Ich lade das Foto hoch.','verb'],
  ['Technology','der Stream','stream','der','-s','Der Stream ruckelt.','noun'],
  ['Technology','der Datenschutz','data protection','der','-','Datenschutz ist wichtig.','noun'],
  ['Technology','die Sicherheit','security','die','-en','Die Sicherheit des Systems ist gut.','noun'],
  ['Technology','der Virus','virus','der','-Viren','Der Virus infiziert den Computer.','noun'],

  // === FEELINGS (already 58, add nuanced emotions) ===
  ['Feelings','das Glücksgefühl','feeling of happiness','das','-e','Das Glücksgefühl ist unbeschreiblich.','noun'],
  ['Feelings','das Mitgefühl','compassion','das','-','Ich habe Mitgefühl.','noun'],
  ['Feelings','die Sehnsucht','longing','die','-','Sehnsucht nach der Heimat.','noun'],
  ['Feelings','gelangweilt','bored','','','Ich bin gelangweilt.','adjective'],
  ['Feelings','begeistert','enthusiastic','','','Ich bin begeistert.','adjective'],
  ['Feelings','verwirrt','confused','','','Ich bin verwirrt.','adjective'],
  ['Feelings','einsam','lonely','','','Er fühlt sich einsam.','adjective'],
  ['Feelings','verliebt','in love','','','Sie ist verliebt.','adjective'],
  ['Feelings','neidisch','jealous','','','Er ist neidisch auf den Erfolg.','adjective'],
  ['Feelings','stolz','proud','','','Ich bin stolz auf dich.','adjective'],
  ['Feelings','überrascht','surprised','','','Ich bin überrascht.','adjective'],
  ['Feelings','besorgt','worried','','','Sie ist besorgt um ihre Gesundheit.','adjective'],
  ['Feelings','erleichtert','relieved','','','Ich bin erleichtert.','adjective'],
  ['Feelings','enttäuscht','disappointed','','','Ich bin enttäuscht.','adjective'],

  // === TIME (already 26, add essential words) ===
  ['Time','der Morgen','morning','der','-','Am Morgen stehe ich auf.','noun'],
  ['Time','der Vormittag','late morning','der','-e','Am Vormittag arbeite ich.','noun'],
  ['Time','der Mittag','noon','der','-e','Am Mittag esse ich.','noun'],
  ['Time','der Nachmittag','afternoon','der','-e','Am Nachmittag lerne ich.','noun'],
  ['Time','der Abend','evening','der','-e','Am Abend sehe ich fern.','noun'],
  ['Time','die Nacht','night','die','-nächte','In der Nacht schlafe ich.','noun'],
  ['Time','die Minute','minute','die','-n','Die Minute vergeht schnell.','noun'],
  ['Time','die Stunde','hour','die','-n','Die Stunde hat 60 Minuten.','noun'],
  ['Time','die Sekunde','second','die','-n','Eine Sekunde ist kurz.','noun'],
  ['Time','der Augenblick','moment','der','-e','Im Augenblick bin ich beschäftigt.','noun'],
  ['Time','die Dauer','duration','die','-','Die Dauer beträgt 2 Stunden.','noun'],
  ['Time','der Zeitraum','time period','der','-räume','Der Zeitraum ist drei Monate.','noun'],

  // === ADMIN (already 23, add common official terms) ===
  ['Admin','der Bürgersteig','sidewalk','der','-e','Der Bürgersteig ist sauber.','noun'],
  ['Admin','die Müllabfuhr','garbage collection','die','-','Die Müllabfuhr kommt freitags.','noun'],
  ['Admin','die Polizei','police','die','-','Die Polizei hilft.','noun'],
  ['Admin','die Feuerwehr','fire department','die','-','Die Feuerwehr löscht das Feuer.','noun'],
  ['Admin','der Führerschein','drivers license','der','-e','Der Führerschein ist neu.','noun'],
  ['Admin','die Genehmigung','permit','die','-en','Die Genehmigung dauert vier Wochen.','noun'],
  ['Admin','die Unterschrift','signature','die','-en','Die Unterschrift fehlt noch.','noun'],
  ['Admin','die Standesamt','registry office','das','-ämter','Zum Standesamt für die Heirat.','noun'],
  ['Admin','das Einwohnermeldeamt','residents registration office','das','-ämter','Beim Einwohnermeldeamt anmelden.','noun'],
  ['Admin','die Ausländerbehörde','immigration office','die','-n','Die Ausländerbehörde bearbeitet den Antrag.','noun'],
  ['Admin','der Antrag','application','der','-träge','Ich stelle einen Antrag.','noun'],
  ['Admin','das Formular','form','das','-e','Bitte füllen Sie das Formular aus.','noun'],
];

// Load existing vocabulary
const vocab = JSON.parse(fs.readFileSync(VOCAB_PATH, 'utf-8'));
const existing = new Set(vocab.A2.map(v => v.word.trim().toLowerCase()));

let nextId = Math.max(...vocab.A2.map(v => parseInt(v.id.replace('A2_v', ''),10)))+1;

let added = 0, skipped = 0;
ENTRIES.forEach(w => {
  const word = w[1].trim().toLowerCase();
  if (existing.has(word)) { skipped++; return; }

  const topic = w[0];
  const lid = TOPIC_LESSON[topic] || 'A2_lesson_1';
  const id = 'A2_v' + String(nextId++).padStart(3, '0');
  const tags = [topic.toLowerCase().replace(/[^a-z]/g,'') + '_vocab'];

  vocab.A2.push({
    id,
    word,
    translation: w[2],
    article: w[3] || '',
    plural: w[4] || '-',
    example: w[5],
    tags,
    lessonId: lid,
    level: 'A2',
    partOfSpeech: w[6] || 'noun',
    topic,
    taughtInLessonId: lid
  });
  existing.add(word);
  added++;
});

fs.writeFileSync(VOCAB_PATH, JSON.stringify(vocab, null, 2), 'utf-8');
console.log('=== Vocabulary Expansion Complete ===');
console.log('Added:', added, 'new entries');
console.log('Skipped (duplicates):', skipped);
console.log('Total A2 vocabulary:', vocab.A2.length);
console.log();

// Validation
const bad = vocab.A2.filter(v => !v.id || !v.word || !v.lessonId);
if (bad.length) {
  console.log('WARNING:', bad.length, 'entries with missing fields!');
  bad.forEach(v => console.log('  BAD:', v.id || 'NO_ID', v.word || 'NO_WORD'));
} else {
  console.log('All entries have required fields. OK.');
}
