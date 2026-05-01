#!/usr/bin/env python3
"""Batch 6: B1 16-25"""
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

# === B1 16-25 ===
add('B1', 16,
    'Auf einer Party', 'Socialize at a party or gathering.',
    'Party: die Party, die Feier, der Gastgeber (host), der Gast, die Musik, der Tanz, das Buffet, das Getraenk (drink). "Danke fuer die Einladung!" "Darauf prost!" (cheers!) "Lass uns tanzen!" "Kennst du viele Leute hier?" "Ich fuehle mich wohl/unwohl." Small talk: "Was machst du beruflich?" "Wie kennst du den Gastgeber?" "Das Essen ist lecker!"',
    ['Danke fuer die Einladung!','Prost!','Lass uns tanzen gehen.','Kennst du viele Leute hier?'],
    'Party and socializing vocabulary',
    [('die Party','party'),('der Gastgeber','host'),('der Gast','guest'),('tanzen','to dance'),('prosten','to toast'),('das Buffet','buffet'),('das Getraenk','drink'),('sich wohlfuehlen','to feel comfortable'),('der Smalltalk','small talk'),('die Stimmung','mood/atmosphere')],
    [('How do you say "cheers"?','Prost!'),('What does "der Gastgeber" mean?','the host'),('Translate "the food is delicious"','Das Essen ist lecker')],
    'Auf der Geburtstagsparty von Anna sind viele Leute. Die Stimmung ist ausgelassen. Tim kommt zur Tuer herein und begruesst die Gastgeberin: "Herzlichen Glueckwunsch zum Geburtstag, Anna!" Er gibt ihr eine Flasche Wein und eine Karte. "Danke, Tim! Komm rein, die anderen sind schon im Wohnzimmer." Tim holt sich ein Getraenk und sucht das Gespraech mit anderen Gaesten.',
    [('Wessen Geburtstag wird gefeiert?',['Tims','Annas','des Gastgebers','der Gastgeberin'],'Annas'),('Was bringt Tim als Geschenk mit?',['Blumen','Wein und eine Karte','Buch','Schokolade'],'Wein und eine Karte')],
    'A: Feierst du heute Abend mit? B: Ja gern! Was soll ich mitbringen? A: Vielleicht was zu trinken. B: Kein Problem, ich bringe eine Flasche Wein mit.',
    'Was bringt B mit?',['Bier','Wein','Saft','Schnaps'],'Wein',
    'Describe a party you attended: the host, the guests, the atmosphere.',
    'Practice small talk at a party with a partner.',
    '"Prost!" = Cheers! "sich wohlfuehlen" = to feel comfortable. "der Gastgeber" = host. "die Stimmung" = atmosphere/mood.')

add('B1', 17,
    'Nachrichten verstehen', 'Understand and discuss news articles.',
    'News: die Nachrichten (news), die Schlagzeile (headline), der Artikel, der Journalist, die Quelle (source), die Berichterstattung (coverage), aktuell (current), die Nachrichtenagentur (news agency). "Hast du die Nachrichten gehoert?" "Der Artikel handelt von..." "Laut der Studie..." "Die Schlagzeile heute ist..." "Die Berichterstattung ist ausgewogen/einseitig."',
    ['Hast du die Nachrichten gehoert?','Der Artikel handelt von der neuen Steuerreform.','Laut einer Studie steigen die Temperaturen.','Die Berichterstattung ist nicht ausgewogen.'],
    'News vocabulary and reported speech',
    [('die Nachrichten','news'),('die Schlagzeile','headline'),('der Artikel','article'),('der Journalist','journalist'),('die Quelle','source'),('aktuell','current'),('berichten','to report'),('handeln von','to be about'),('ausgewogen','balanced'),('der Leitartikel','editorial')],
    [('How do you ask "did you hear the news"?','Hast du die Nachrichten gehoert?'),('What does "die Schlagzeile" mean?','headline'),('Translate "according to the study"','Laut der Studie')],
    'Die heutige Schlagzeile der SZ: "Klimakonferenz einigt sich auf neue Ziele." Der Artikel berichtet, dass sich 195 Laender auf strengere Klimaziele geeinigt haben. Die Reduktionsziele fuer CO2 wurden verschaerft. Deutschland will bis 2045 klimaneutral sein. Kritiker meinen, die Ziele seien nicht ausreichend. Befuerworter loben den Kompromiss.',
    [('Welche Zeitung wird zitiert?',['FAZ','SZ','Bild','Zeit'],'SZ'),('Bis wann will Deutschland klimaneutral sein?',['2030','2035','2045','2050'],'2045')],
    'A: Hast du den Artikel ueber die Wahl gelesen? B: Ja, die Umfragen zeigen ein knappes Rennen. A: Wann ist die Wahl? B: In drei Wochen.',
    'Was ist in drei Wochen?',['die Wahl','der Feiertag','die Konferenz','das Fest'],'die Wahl',
    'Summarize a news article in German (100 words).',
    'Discuss a current news topic with a partner.',
    '"berichten von/ueber" = to report on. "laut" + Dativ/Genitiv = according to. "die Schlagzeile" = headline. "die Quelle" = source.')

add('B1', 18,
    'Im Restaurant Kritik ueben', 'Give feedback and complain at a restaurant.',
    'Complaint: "Das Essen ist kalt." "Ich habe etwas anderes bestellt." "Die Bedienung war sehr langsam." "Das Fleisch ist nicht durchgebraten." "Da stimmt etwas nicht." "Koennen Sie bitte den Chef holen?" Polite feedback: "Es war ganz gut, aber..." "Mir hat die Suppe sehr gut geschmeckt, aber der Hauptgang war etwas salzig." "Die Portion war zu klein." "Darf ich eine Reklamation einreichen?"',
    ['Das Essen ist leider kalt.','Ich habe etwas anderes bestellt.','Die Bedienung war sehr langsam.','Das Fleisch ist nicht durchgebraten.'],
    'Restaurant complaints and polite criticism',
    [('die Beschwerde','complaint'),('reklamieren','to complain'),('die Bedienung','service'),('der Kellner','waiter'),('durchgebraten','well done'),('salzig','salty'),('wuerzig','spicy'),('die Rechnung','bill'),('die Portion','portion'),('die Entschuldigung','apology')],
    [('How do you say "the food is cold"?','Das Essen ist kalt'),('What does "reklamieren" mean?','to complain'),('Translate "I ordered something different"','Ich habe etwas anderes bestellt')],
    'Herr Wagner geht in ein Steakhouse. Er bestellt ein Medium-Steak mit Pommes und einem Salat. Als das Essen kommt, ist das Steak durchgebraten und der Salat ist verwelkt. Er ruft den Kellner: "Entschuldigung, ich habe das Steak medium bestellt, aber es ist durch. Koennen Sie es bitte zuruecknehmen?" Der Kellner entschuldigt sich und bringt ein neues Steak. Der Chef kommt persoenlich an den Tisch und bietet einen Digestif als Entschuldigung an.',
    [('Wie hat Herr Wagner das Steak bestellt?',['durchgebraten','medium','blutig','englisch'],'medium'),('Was bietet der Chef als Entschuldigung an?',['Rabatt','einen Digestif','ein Dessert','Gratis-Pommes'],'einen Digestif')],
    'A: Wie war das Essen? B: Ganz gut, aber der Fisch war etwas trocken. A: Das sollte man zurueckgehen lassen. B: Ach, ich will kein Theater machen.',
    'Was war mit dem Fisch?',['kalt','trocken','salzig','roh'],'trocken',
    'Write a restaurant complaint dialogue politely.',
    'Role play: complain about food/service at a restaurant.',
    '"reklamieren" = to complain/complain about. "durchgebraten" = well done. "die Beschwerde" = complaint. "zuruecknehmen" = to take back.')

add('B1', 19,
    'Reisevorbereitungen', 'Plan and prepare for a trip.',
    'Travel planning: die Reise (trip), die Unterkunft (accommodation), der Reiseveranstalter (tour operator), die Buchung (booking), der Reiseplan, die Versicherung (insurance), der Reisepass (passport), das Visum. "Ich buche einen Flug." "Hast du eine Reiseversicherung abgeschlossen?" "Der Reisepass muss noch gueltig sein." "Ich packe meinen Koffer." "Die Reiseapotheke nicht vergessen!"',
    ['Ich buche einen Flug nach Thailand.','Hast du eine Reiseversicherung abgeschlossen?','Der Koffer ist gepackt.','Hast du an den Reisepass gedacht?'],
    'Travel planning vocabulary',
    [('die Reise','trip'),('die Unterkunft','accommodation'),('die Buchung','booking'),('der Reiseveranstalter','tour operator'),('das Visum','visa'),('der Reisepass','passport'),('.die Versicherung','insurance'),('packen','to pack'),('der Koffer','suitcase'),('die Reiseapotheke','travel pharmacy')],
    [('How do you say "I book a flight"?','Ich buche einen Flug'),('What does "die Unterkunft" mean?','accommodation'),('Translate "dont forget your passport"','Vergiss den Reisepass nicht')],
    'Familie Mueller plant eine grosse Reise: Drei Wochen durch Suedostasien. Sie haben bereits die Flugtickets gebucht und die Hotels fuer die erste Woche reserviert. Herr Mueller hat eine Reiseruecktrittsversicherung abgeschlossen. Frau Mueller hat eine Packliste gemacht: leichte Kleidung, Sonnencreme, Mueckenschutz und die Reiseapotheke. Die Kinder sind aufgeregt und zaehlen die Tage bis zum Abflug.',
    [('Wie lange reist Familie Mueller?',['eine Woche','zwei Wochen','drei Wochen','einen Monat'],'drei Wochen'),('Was hat Frau Mueller auf die Packliste gesetzt?',['warme Kleidung','leichte Kleidung, Sonnencreme','Buecher','elektronische Geraete'],'leichte Kleidung, Sonnencreme')],
    'A: Wohin geht deine naechste Reise? B: Nach Peru, ich will die Inka-Staetten sehen. A: Wow, wie lange bleibst du? B: Drei Wochen.',
    'Wohin faehrt B?',['nach Mexiko','nach Peru','nach Brasilien','nach Kolumbien'],'nach Peru',
    'Plan a trip: destination, duration, accommodation, packing list.',
    'Present your travel plans to your partner.',
    '"buchen" = to book. "der Reisepass" = passport. "die Reiseversicherung" = travel insurance. "packen" = to pack.')

add('B1', 20,
    'Ehrenamtliche Arbeit', 'Talk about volunteering and community work.',
    'Volunteering: die ehrenamtliche Arbeit (volunteer work), der Freiwillige (volunteer), das Ehrenamt (volunteer position), die Unterstuetzung (support), die Hilfsorganisation (aid organization), die Spende (donation), das Engagement (commitment). "Ich engagiere mich ehrenamtlich." "Ich helfe im Tierheim." "Wir sammeln Spenden fuer...". "Freiwilligenarbeit ist erfuellend." "Jeder kann etwas beitragen."',
    ['Ich engagiere mich ehrenamtlich.','Ich helfe jeden Samstag im Tierheim.','Wir sammeln Spenden fuer die Tafel.','Freiwilligenarbeit macht mir viel Freude.'],
    'Volunteering and social engagement vocabulary',
    [('ehrenamtlich','voluntary'),('der Freiwillige','volunteer'),('das Ehrenamt','volunteer position'),('die Hilfsorganisation','aid organization'),('die Spende','donation'),('das Engagement','commitment'),('das Tierheim','animal shelter'),('die Tafel','food bank'),('beitragen','to contribute'),('erfuellend','fulfilling')],
    [('How do you say "I volunteer"?','Ich engagiere mich ehrenamtlich'),('What does "das Tierheim" mean?','animal shelter'),('Translate "we collect donations"','Wir sammeln Spenden')],
    'In Deutschland engagieren sich ueber 30 Millionen Menschen ehrenamtlich. Besonders beliebt sind die Freiwillige Feuerwehr, das Deutsche Rote Kreuz und die Tafeln, die Lebensmittel an Beduerftige verteilen. Auch in Sportvereinen, Kirchengemeinden und kulturellen Einrichtungen sind viele Freiwillige aktiv. Das Engagement wird durch die Ehrenamtskarte und steuerliche Verguenstigungen gefordert.',
    [('Wie viele Menschen engagieren sich ehrenamtlich?',['10 Millionen','20 Millionen','30 Millionen','40 Millionen'],'30 Millionen'),('Welche Organisation verteilt Lebensmittel?',['Rotes Kreuz','die Tafeln','Feuerwehr','Caritas'],'die Tafeln')],
    'A: Bist du ehrenamtlich taetig? B: Ja, ich gebe einmal pro Woche Nachhilfe fuer Kinder aus benachteiligten Familien.',
    'Welche ehrenamtliche Taetigkeit macht B?',['Tierheim','Nachhilfe','Feuerwehr','Krankenhaus'],'Nachhilfe',
    'Write about volunteering: why it matters, what you/d others could do.',
    'Discuss the importance of volunteer work with a partner.',
    '"sich engagieren" = to be involved/committed. "ehrenamtlich" = on a voluntary basis. "beitragen" = to contribute (separable). "erfuellend" = fulfilling.')

add('B1', 21,
    'Studium und Hochschule', 'Talk about university studies and campus life.',
    'University: die Hochschule (university/college), der Studiengang (degree program), das Semester, die Vorlesung (lecture), das Seminar, die Pruefung (exam), die Klausur (written exam), die Hausarbeit (term paper), der Studienabschluss (degree), die Bibliothek (library). "Ich studiere im 4. Semester." "Die Vorlesung beginnt um 10 Uhr." "Ich muss eine Hausarbeit schreiben." "In der Pruefungszeit lerne ich viel."',
    ['Ich studiere im 5. Semester.','Die Vorlesung beginnt um 10:15 Uhr.','Ich muss eine Hausarbeit ueber Goethe schreiben.','Die Pruefungszeit ist sehr stressig.'],
    'University vocabulary',
    [('die Hochschule','university'),('der Studiengang','degree program'),('die Vorlesung','lecture'),('das Seminar','seminar'),('die Pruefung','exam'),('die Klausur','written exam'),('die Hausarbeit','term paper'),('der Studienabschluss','degree'),('die Bibliothek','library'),('der Professor','professor'),('das Semesterticket','semester ticket')],
    [('How do you say "I study in the 4th semester"?','Ich studiere im 4. Semester'),('What does "die Vorlesung" mean?','lecture'),('Translate "I have to write a term paper"','Ich muss eine Hausarbeit schreiben')],
    'Paul studiert Maschinenbau an der TU Berlin. Er ist im 6. Semester und hat in diesem Semester fuenf Vorlesungen und zwei Seminare. Die Pruefungszeit beginnt in vier Wochen. Paul geht jeden Tag in die Bibliothek, um fuer die Klausuren zu lernen. Seine Freundin Marie studiert Germanistik und muss eine Hausarbeit ueber Thomas Mann schreiben.',
    [('Was studiert Paul?',['Germanistik','BWL','Maschinenbau','Informatik'],'Maschinenbau'),('Wo lernt Paul fuer die Klausuren?',['zu Hause','in der Bibliothek','im Cafe','bei Freunden'],'in der Bibliothek')],
    'A: In welchem Semester bist du? B: Ich bin im 3. Semester und studiere Psychologie. A: Wie findest du dein Studium? B: Anstrengend, aber interessant.',
    'Was studiert B?',['Medizin','Psychologie','Jura','Biologie'],'Psychologie',
    'Write about your studies or a subject you are interested in.',
    'Describe your university experience or academic plans.',
    '"studieren" = to study at university. "die Vorlesung" = lecture. "die Pruefung" = exam. "die Hausarbeit" = term paper.')

add('B1', 22,
    'Buecher und Lesen', 'Talk about books and reading habits.',
    'Reading: das Buch (book), der Roman (novel), die Kurzgeschichte (short story), der Autor, die Autorin, die Gattung (genre), der Krimi (crime novel), der Bestseller, die Leseliste (reading list), verschlingen (to devour). "Ich lese gern Krimis und Science-Fiction." "Das Buch hat mich von Anfang an gefesselt." "Der Schreibstil ist mitreissend." "Kannst du mir ein gutes Buch empfehlen?"',
    ['Ich lese gern historische Romane.','Das Buch hat mich sehr gefesselt.','Der Schreibstil ist mitreissend.','Kannst du mir ein Buch empfehlen?'],
    'Books and reading vocabulary',
    [('das Buch','book'),('der Roman','novel'),('die Kurzgeschichte','short story'),('der Krimi','crime novel'),('der Bestseller','bestseller'),('fesseln','to captivate'),('der Schreibstil','writing style'),('mitreissend','gripping'),('empfehlen','to recommend'),('verschlingen','to devour'),('das Kapitel','chapter'),('die Seite','page')],
    [('How do you ask for a book recommendation?','Kannst du mir ein gutes Buch empfehlen?'),('What does "fesseln" mean?','to captivate'),('Translate "I read crime novels"','Ich lese gern Krimis')],
    'In Deutschland werden pro Jahr etwa 80.000 neue Buecher veroefentlicht. Der Buchmarkt ist einer der groessten der Welt. Besonders beliebt sind Krimis, historische Romane und Ratgeber. Die Frankfurter Buchmesse ist die groesste Buchmesse der Welt. Viele Deutsche sind Mitglied in Buchclubs oder leihen Buecher in oeffentlichen Bibliotheken aus. E-Books gewinnen an Beliebtheit, aber gedruckte Buecher sind immer noch am verbreitetsten.',
    [('Wie viele neue Buecher erscheinen pro Jahr in Deutschland?',['40.000','60.000','80.000','100.000'],'80.000'),('Welche Buchmesse ist die groesste?',['Leipziger','Frankfurter','Berliner','Hamburger'],'Frankfurter')],
    'A: Was liest du gerade? B: Einen Krimi von Sebastian Fitzek. A: Ist der gut? B: Sehr spannend, ich kann es kaum weglegen!',
    'Was liest B gerade?',['einen Roman','einen Krimi','eine Biografie','ein Sachbuch'],'einen Krimi',
    'Write about a book you recently read: title, author, genre, opinion.',
    'Recommend a book to your partner and explain why you liked it.',
    '"fesseln" = to captivate. "der Krimi" = crime novel. "empfehlen" = to recommend. "der Schreibstil" = writing style.')

add('B1', 23,
    'Sportevents und Wettkaempfe', 'Talk about sports events and competitions.',
    'Sports events: das Stadion, der Wettkampf (competition), der Gegner (opponent), das Finale, der Sieg (victory), die Niederlage (defeat), die Meisterschaft (championship), der Zuschauer (spectator), der Spielstand (score), das Unentschieden (draw). "Welche Mannschaften spielen gegeneinander?" "Das Spiel endete 2:2." "Wer hat gewonnen?" "Im Elfmeterschiessen entschieden."',
    ['Welche Mannschaften spielen heute?','Das Spiel endete 2:2 Unentschieden.','Deutschland hat die Meisterschaft gewonnen.','Im Stadion war eine tolle Atmosphäre.'],
    'Sports events vocabulary',
    [('das Stadion','stadium'),('der Wettkampf','competition'),('der Gegner','opponent'),('das Finale','final'),('der Sieg','victory'),('die Niederlage','defeat'),('die Meisterschaft','championship'),('der Zuschauer','spectator'),('der Spielstand','score'),('das Unentschieden','draw'),('die Verlaengerung','extra time'),('das Elfmeterschiessen','penalty shootout')],
    [('How do you ask about the score?','Wie steht das Spiel?'),('What does "Unentschieden" mean?','draw'),('Translate "who won the championship?"','Wer hat die Meisterschaft gewonnen?')],
    'Das Fussballspiel zwischen Bayern Muenchen und Borussia Dortmund war ein Highlight der Saison. 75.000 Zuschauer waren im Stadion. Nach 90 Minuten stand es 1:1. In der Verlaengerung konnte keine Mannschaft ein Tor schiessen. Das Elfmeterschiessen musste entscheiden. Bayern Muenchen gewann mit 5:4 und zog ins Finale ein. Die Stimmung im Stadion war elektrisierend.',
    [('Wie viele Zuschauer waren im Stadion?',['50.000','65.000','75.000','90.000'],'75.000'),('Wie wurde das Spiel entschieden?',['durch ein Tor','Elfmeterschiessen','Verlaengerung','Losentscheid'],'Elfmeterschiessen')],
    'A: Hast du das Finale gesehen? B: Ja, unglaublich! Das war das beste Spiel der Saison.',
    'Wie fand B das Finale?',['langweilig','unglaublich','schlecht','vorhersehbar'],'unglaublich',
    'Write about a sports event you watched or attended.',
    'Discuss a sports event: teams, score, atmosphere, result.',
    '"der Sieg" = victory. "die Niederlage" = defeat. "das Unentschieden" = draw. "der Zuschauer" = spectator.')

add('B1', 24,
    'Im Stau stehen', 'Talk about traffic jams and commuting.',
    'Traffic: der Stau (traffic jam), der Berufsverkehr (rush hour), die Umleitung (detour), die Baustelle (construction site), der Unfall (accident), der Pendler (commuter), das Stauende (end of traffic jam), die Vollsperrung (full closure). "Ich stecke im Stau fest." "Der Berufsverkehr beginnt um 7 Uhr." "Wegen eines Unfalls ist die Autobahn gesperrt." "Ich brauche eine Stunde zur Arbeit."',
    ['Ich stecke im Stau fest.','Der Berufsverkehr ist unertraeglich.','Wegen eines Unfalls ist die Autobahn gesperrt.','Ich brauche taeglich eine Stunde zur Arbeit.'],
    'Traffic and commuting vocabulary',
    [('der Stau','traffic jam'),('der Berufsverkehr','rush hour'),('die Umleitung','detour'),('die Baustelle','construction site'),('der Unfall','accident'),('der Pendler','commuter'),('gesperrt','closed'),('die Autobahn','highway'),('die Ausweichroute','alternative route'),('das Navi','GPS/nav')],
    [('How do you say "Im stuck in traffic"?','Ich stecke im Stau fest'),('What does "die Umleitung" mean?','detour'),('Translate "the highway is closed"','Die Autobahn ist gesperrt')],
    'Herr Wagner ist Pendler und faehrt taeglich 40 Kilometer von seinem Wohnort in die Stadt zur Arbeit. Morgens um 7 Uhr beginnt der Berufsverkehr. Oft steht er 30 Minuten im Stau. Heute ist es besonders schlimm: wegen eines Unfalls auf der A8 ist die Autobahn zwischen zwei Anschlussstellen voll gesperrt. Er muss eine Umleitung ueber die Landstrasse nehmen und kommt 45 Minuten spaeter zur Arbeit.',
    [('Wie viele Kilometer faehrt Herr Wagner zur Arbeit?',['20','30','40','50'],'40'),('Warum ist die Autobahn heute gesperrt?',['Baustelle','Stau','Unfall','Wetter'],'Unfall')],
    'A: Bist du im Stau gestanden? B: Ja, ich war eine Stunde zu spaet dran. Die Umleitung hat auch nichts gebracht.',
    'Wie spaet kam B zur Arbeit?',['eine halbe Stunde','eine Stunde','zwei Stunden','15 Minuten'],'eine Stunde',
    'Write about commuting in your city: time, distance, problems.',
    'Discuss traffic problems and possible solutions.',
    '"im Stau stehen/stecken" = to be in traffic. "die Umleitung" = detour. "gesperrt" = closed. "der Berufsverkehr" = rush hour.')

add('B1', 25,
    'Finanzen und Sparen', 'Talk about money management and saving.',
    'Finance: das Geld (money), sparen (to save), das Sparkonto (savings account), die Ausgaben (expenses), die Einnahmen (income), das Budget, die Sparkasse (savings bank), die Versicherung (insurance), die Aktie (stock), die Altersvorsorge (retirement provision). "Ich lege jeden Monat Geld zur Seite." "Man sollte ein Budget erstellen." "Ich investiere in Aktien." "Eine finanzielle Reserve fuer Notfaelle ist wichtig."',
    ['Ich lege jeden Monat Geld zur Seite.','Man sollte ein Budget erstellen.','Ich investiere in ETFs.','Eine finanzielle Reserve ist wichtig.'],
    'Personal finance vocabulary',
    [('sparen','to save'),('die Ausgaben','expenses'),('die Einnahmen','income'),('das Budget','budget'),('die Aktie','stock'),('die Versicherung','insurance'),('die Altersvorsorge','retirement provision'),('die Reserve','reserve/emergency fund'),('der Zins','interest rate'),('das Sparkonto','savings account')],
    [('How do you say "I save money"?','Ich spare Geld'),('What does "die Ausgaben" mean?','expenses'),('Translate "create a budget"','Ein Budget erstellen')],
    'Julia verdient 3200 Euro netto im Monat. Sie hat ein Budget erstellt: 1000 Euro fuer die Miete, 400 Euro fuer Lebensmittel, 200 Euro fuer Versicherungen, 150 Euro fuer Mobilfunk und Internet, 300 Euro fuer Freizeit und Hobbys. Am Ende des Monats bleiben 450 Euro uebrig. Davon legt sie 300 Euro auf ihr Sparkonto und 150 Euro investiert sie in ETF-Fonds fuer die Altersvorsorge.',
    [('Wie viel verdient Julia netto?',['2800','3000','3200','3500'],'3200'),('Wie viel spart Julia pro Monat?',['150','300','450','600'],'300')],
    'A: Wie schaffst du es zu sparen? B: Ich ueberweise am Monatsanfang automatisch Geld auf mein Sparkonto. So gebe ich es nicht aus.',
    'Wann ueberweist B Geld aufs Sparkonto?',['am Monatsende','am Monatsanfang','mitten im Monat','nach Gehaltseingang'],'am Monatsanfang',
    'Create a monthly budget in German: income, expenses, savings.',
    'Discuss personal finance: budgeting, saving, investing.',
    '"sparen" = to save. "die Ausgaben" = expenses. "die Einnahmen" = income. "die Altersvorsorge" = retirement provision.')

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
