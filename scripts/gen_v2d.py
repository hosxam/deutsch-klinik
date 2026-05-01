#!/usr/bin/env python3
"""Batch 4: A2 16-25, B1 6-10"""
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

# === A2 16-25 ===
add('A2', 16,
    'Sport und Bewegung', 'Talk about sports and exercise.',
    'Sport: Fussball, Tennis, Schwimmen, Joggen, Yoga, Radfahren, Krafttraining. "Ich treibe Sport" = I do sports. "Ich gehe ins Fitnessstudio" = I go to the gym. "Wie oft trainierst du?" "trainieren" = to train. "der Verein" = club. "der Wettkampf" = competition. "gewinnen/verlieren" = win/lose.',
    ['Ich treibe gern Sport.','Ich gehe ins Fitnessstudio.','Wie oft trainierst du?','Fussball ist mein Lieblingssport.'],
    'Sports vocabulary and "treiben" (to do sports)',
    [('der Sport','sport'),('trainieren','to train'),('das Fitnessstudio','gym'),('der Verein','club'),('der Wettkampf','competition'),('gewinnen','to win'),('verlieren','to lose'),('die Mannschaft','team'),('der Trainer','coach'),('das Training','training')],
    [('How do you say "I do sports"?','Ich treibe Sport'),('What does "trainieren" mean?','to train'),('Translate "how often do you train?"','Wie oft trainierst du?')],
    'Mark ist begeisterter Sportler. Dreimal pro Woche geht er ins Fitnessstudio. Dort macht er Krafttraining und trainiert auf dem Laufband. Am Wochenende spielt er Fussball im Verein. Sein Team trainiert jeden Dienstag und Donnerstag. Letztes Jahr hat sein Verein die Stadtmeisterschaft gewonnen.',
    [('Wie oft geht Mark ins Fitnessstudio?',['einmal','zweimal','dreimal','viermal'],'dreimal'),('Was hat sein Team letztes Jahr gewonnen?',['den Pokal','die Stadtmeisterschaft','das Turnier','das Spiel'],'die Stadtmeisterschaft')],
    'A: Treibst du Sport? B: Ja, ich gehe joggen und mache Yoga. A: Wie oft? B: Joggen gehe ich dreimal pro Woche, Yoga einmal.',
    'Welche Sportarten macht B?',['Fussball und Tennis','Joggen und Yoga','Schwimmen und Radfahren','Krafttraining'],'Joggen und Yoga',
    'Write about your sports routine: what sports, how often, with whom.',
    'Describe your favorite sport and explain why you like it.',
    '"treiben" is used with Sport: "Ich treibe Sport." "trainieren" = to train. "gewinnen/verlieren" = win/lose. "der Verein" = club.')

add('A2', 17,
    'Auf dem Wochenmarkt', 'Shop at a farmers market and bargain.',
    'Market vocabulary: der Markt, der Stand, der Bauer, frisch, regional, bio, das Obst, das Gemuese, die Kaeufer, der Verkaeufer. "Was kostet das?" "Das ist aber teuer!" "Kann ich etwas weniger bekommen?" (Can I get a bit less?) "Das Kilo kostet..." "In welcher Menge?" "Darf ich probieren?"',
    ['Was kostet das Kilo Aepfel?','Das ist aber teuer!','Kann ich probieren?','Ich nehme ein Kilo Tomaten.'],
    'Market vocabulary and bargaining phrases',
    [('der Markt','market'),('der Stand','stall'),('der Bauer','farmer'),('frisch','fresh'),('regional','regional'),('bio','organic'),('das Obst','fruit'),('das Gemuese','vegetables'),('die Menge','quantity'),('probieren','to taste')],
    [('How do you ask the price?','Was kostet das?'),('What does "frisch" mean?','fresh'),('Translate "Can I taste?"','Darf ich probieren?')],
    'Jeden Samstag geht Familie Wagner auf den Wochenmarkt. Die Bauern verkaufen frisches Obst und Gemuese aus der Region. Frau Wagner kauft Aepfel fuer 2,50 Euro pro Kilo, Tomaten fuer 3 Euro und frische Kraeuter. Ihr Sohn mag die Erdbeeren, aber die sind noch teuer, 6 Euro pro Schale.',
    [('Wann geht Familie Wagner auf den Markt?',['sonntags','samstags','dienstags','mittwochs'],'samstags'),('Was kostet ein Kilo Aepfel?',['3 Euro','2,50 Euro','6 Euro','4 Euro'],'2,50 Euro')],
    'A: Guten Morgen, was kosten die Erdbeeren? B: 4 Euro die Schale. A: Ich nehme zwei Schalen, bitte.',
    'Was kauft A?',['Aepfel','Erdbeeren','Tomaten','Kraeuter'],'Erdbeeren',
    'Write a market dialogue between customer and farmer.',
    'Role play at a farmers market: buy 5 items.',
    '"das Kilo" = kilo. "die Schale" = punnet/box. "frisch vom Bauern" = fresh from the farmer. "probieren" = to taste.')

add('A2', 18,
    'Auf der Post', 'Send letters and packages at the post office.',
    'Post: die Post, die Briefmarke (stamp), der Brief (letter), das Paket (package), der Umschlag (envelope), die Postkarte (postcard), das Einschreiben (registered mail), das Porto (postage). "Ich moechte diesen Brief nach Deutschland schicken." "Was kostet das Porto?" "Wie lange dauert der Versand?" "Luftpost oder Standard?"',
    ['Ich moechte dieses Paket schicken.','Was kostet der Brief nach Deutschland?','Fuenf Briefmarken, bitte.','Wie lange dauert der Versand?'],
    'Post office vocabulary',
    [('die Post','post office'),('die Briefmarke','stamp'),('der Brief','letter'),('das Paket','package'),('der Umschlag','envelope'),('die Postkarte','postcard'),('das Einschreiben','registered mail'),('das Porto','postage'),('der Versand','shipping'),('der Empfaenger','recipient'),('der Absender','sender')],
    [('How do you say "I want to send this letter"?','Ich moechte diesen Brief schicken'),('What is "die Briefmarke"?','stamp'),('Translate "registered mail"','Einschreiben')],
    'Thomas will seiner Freundin in Australien ein Geburtstagspaket schicken. Er geht zur Post und stellt sich an. "Guten Tag, ich moechte dieses Paket nach Australien schicken, bitte." Die Mitarbeiterin wiegt das Paket: "Das sind 2,5 Kilo. Porto 45 Euro." "Mit Einschreiben?" "Dann kostet es 52 Euro." "OK, mit Einschreiben, bitte."',
    [('Wohin schickt Thomas das Paket?',['Deutschland','Australien','Oesterreich','USA'],'Australien'),('Wie schwer ist das Paket?',['1 Kilo','2,5 Kilo','3 Kilo','500 Gramm'],'2,5 Kilo')],
    'A: Guten Tag, ich brauche fuenf Briefmarken fuer Briefe nach Deutschland. B: Fuer Standard oder Luftpost? A: Standard, bitte.',
    'Wohin gehen die Briefe?',['nach Oesterreich','nach Deutschland','in die Schweiz','nach Frankreich'],'nach Deutschland',
    'Write a dialogue at the post office sending a package.',
    'Role play: sending a letter and a package, asking about prices and delivery time.',
    '"schicken" = to send. "der Absender" = sender. "der Empfaenger" = recipient. "das Einschreiben" = registered mail.')

add('A2', 19,
    'Auf der Bank', 'Open an account and do basic banking.',
    'Bank: die Bank, das Konto (account), das Girokonto (current account), das Sparbuch (savings book), die Kreditkarte, die EC-Karte, der Geldautomat (ATM), ueberweisen (to transfer), einzahlen (to deposit), abheben (to withdraw). "Ich moechte ein Konto eroeffnen." "Wie hoch sind die Gebuehren?" "Meine Karte ist gesperrt."',
    ['Ich moechte ein Konto eroeffnen.','Wie hoch sind die Gebuehren?','Ich moechte Geld abheben.','Meine Karte ist gesperrt.'],
    'Banking vocabulary',
    [('die Bank','bank'),('das Konto','account'),('die Kreditkarte','credit card'),('die EC-Karte','debit card'),('der Geldautomat','ATM'),('ueberweisen','to transfer'),('einzahlen','to deposit'),('abheben','to withdraw'),('die Gebuehr','fee'),('gesperrt','blocked'),('der Kontoauszug','bank statement')],
    [('How do you say "I want to open an account"?','Ich moechte ein Konto eroeffnen'),('What does "abheben" mean?','to withdraw'),('Translate "my card is blocked"','Meine Karte ist gesperrt')],
    'Herr Schneider moechte ein Konto bei der Sparkasse eroeffnen. Er hat einen Termin mit der Bankberaterin. "Ich brauche ein Girokonto fuer mein Gehalt." Die Beraterin erklaert: "Das Konto ist kostenlos, wenn monatlich mindestens 1000 Euro eingehen. Sie bekommen eine EC-Karte und koennen Online-Banking nutzen." Herr Schneider eroeffnet das Konto sofort.',
    [('Welche Bank waehlt Herr Schneider?',['Deutsche Bank','Sparkasse','Commerzbank','Postbank'],'Sparkasse'),('Was braucht er fuer sein Gehalt?',['Sparbuch','Girokonto','Kreditkarte','Depot'],'Girokonto')],
    'A: Guten Tag, ich moechte Geld von meinem Konto abheben. B: Selbstverstaendlich. Wie viel moechten Sie abheben? A: 200 Euro, bitte.',
    'Wie viel moechte A abheben?',['100 Euro','200 Euro','300 Euro','500 Euro'],'200 Euro',
    'Write a banking dialogue: open an account or withdraw money.',
    'Role play at the bank: customer and bank employee.',
    '"das Konto eroeffnen" = to open an account. "abheben" = to withdraw (separable). "einzahlen" = to deposit. "ueberweisen" = to transfer.')

add('A2', 20,
    'Ein Konzert besuchen', 'Talk about concerts and music events.',
    'Music: das Konzert, die Band, das Lied (song), der Saenger (singer), die Musikrichtung (genre), die Karte (ticket), der Vorverkauf (advance sale), ausverkauft (sold out), der Auftritt (performance). "Ich gehe auf ein Konzert." "Die Band spielt Rock/Pop/Jazz." "Die Karten sind leider ausverkauft." "Das Konzert war fantastisch!"',
    ['Ich gehe auf ein Rockkonzert.','Die Karten sind leider ausverkauft.','Das Konzert war fantastisch!','Welche Musikrichtung magst du?'],
    'Concert and music vocabulary',
    [('das Konzert','concert'),('die Band','band'),('das Lied','song'),('der Saenger','singer'),('die Musikrichtung','music genre'),('der Vorverkauf','advance sale'),('ausverkauft','sold out'),('der Auftritt','performance'),('die Buehne','stage'),('der Fan','fan'),('applaudieren','to applaud')],
    [('How do you say "Im going to a concert"?','Ich gehe auf ein Konzert'),('What does "ausverkauft" mean?','sold out'),('Translate "the concert was fantastic"','Das Konzert war fantastisch')],
    'Die Freunde Lena und Tom gehen auf ein Konzert ihrer Lieblingsband. Die Band "Die Gluhenden" spielt im ausverkauften Berliner Club. Der Vorverkauf war schon vor Wochen gestartet. Lena hat die Karten im Internet bestellt. Der Auftritt beginnt um 20 Uhr. Die Stimmung ist toll, alle tanzen und singen mit.',
    [('Welche Band spielt?',['Die Fliessenden','Die Gluhenden','Die Singenden','Die Tanzenden'],'Die Gluhenden'),('Wann beginnt der Auftritt?',['18 Uhr','19 Uhr','20 Uhr','21 Uhr'],'20 Uhr')],
    'A: Gehst du auf das Konzert von "Die Toten Hosen"? B: Ja, ich habe Karten fuer naechsten Samstag! A: Echt? Ich dachte, das Konzert ist ausverkauft!',
    'Wann ist das Konzert?',['Freitag','Samstag','Sonntag','Montag'],'Samstag',
    'Write about a concert experience: the band, the music, the atmosphere.',
    'Describe a concert you attended or would like to attend.',
    '"ein Konzert besuchen" = to attend a concert. "ausverkauft" = sold out. "der Vorverkauf" = advance sale. "die Karte" = ticket.')

# === B1 6-10 ===
add('B1', 6,
    'Telefonieren auf Deutsch', 'Handle formal and informal phone calls.',
    'Formal phone: "Firma Schmidt, guten Tag." "Hier spricht ..." "Kann ich bitte Herrn Maier sprechen?" "Ich verbinde Sie." "Moechten Sie eine Nachricht hinterlassen?" "Sagen Sie ihm, dass ich angerufen habe." Informal: "Kannst du mich zurueckrufen?" "Ruf mich spaeter an!" Use "Sie" in business, "du" with friends.',
    ['Firma Schmidt, guten Tag.','Hier spricht Anna Weber.','Kann ich Sie bitte mit Herrn Mueller verbinden?','Ich rufe wegen einer Bestellung an.'],
    'Formal phone communication and connector "dass"',
    [('anrufen','to call'),('verbinden','to connect'),('die Durchwahl','direct dial'),('besetzt','busy'),('der Anrufbeantworter','answering machine'),('die Nachricht','message'),('hinterlassen','to leave behind'),('zurueckrufen','to call back'),('erreichen','to reach'),('die Leitung','line')],
    [('How do you ask to be connected?','Kann ich mit Herrn Mueller verbunden werden?'),('What does "besetzt" mean?','busy'),('Formal: leave a message','Kann ich eine Nachricht hinterlassen?')],
    'Frau Schneider ruft bei der Firma Huber an. "Guten Tag, Firma Huber, was kann ich fuer Sie tun?" "Hier ist Katrin Schneider von der Firma Weber GmbH. Ich moechte bitte Frau Doktor Wagner sprechen." "Einen Moment, ich verbinde Sie." Nach kurzer Wartezeit: "Frau Wagner ist leider in einer Besprechung. Moechten Sie eine Nachricht hinterlassen?"',
    [('Wen moechte Frau Schneider sprechen?',['Herrn Huber','Frau Dr. Wagner','die Sekretaerin','den Chef'],'Frau Dr. Wagner'),('Warum kann Frau Wagner nicht sprechen?',['Sie ist krank','Sie ist in einer Besprechung','Sie ist im Urlaub','Sie ist im Meeting'],'Sie ist in einer Besprechung')],
    'A: Guten Tag, hier ist Max Bauer von der Firma Schneider GmbH. Kann ich bitte Herrn Klein sprechen? B: Herr Klein ist leider nicht im Haus. Moechten Sie eine Nachricht hinterlassen? A: Ja, sagen Sie ihm, dass ich angerufen habe.',
    'Warum kann Herr Klein nicht ans Telefon?',['er ist krank','er ist nicht im Haus','er ist besetzt','er hat Urlaub'],'er ist nicht im Haus',
    'Write a formal phone dialogue: call a company, ask for someone, leave a message.',
    'Practice two phone scenarios: formal (business) and informal (friend).',
    '"verbinden" = to connect. "im Hause sein" = to be in the office. "dass" + subordinate clause: "Sagen Sie ihm, dass ich angerufen habe."')

add('B1', 7,
    'Eine Bewerbung schreiben', 'Write a job application and CV.',
    'Application: die Bewerbung, der Lebenslauf (CV), das Anschreiben (cover letter), die Stelle (position), der Arbeitgeber (employer), der Arbeitnehmer (employee), die Erfahrung (experience), die Qualifikation, das Vorstellungsgespraech (interview). "Hiermit bewerbe ich mich um die Stelle als ..." "Ich verfuege ueber ... Jahre Erfahrung." "Mit freundlichen Gruessen."',
    ['Hiermit bewerbe ich mich um die Stelle.','Ich habe drei Jahre Berufserfahrung.','Meine Staerken sind Teamarbeit und Flexibilitaet.','Mit freundlichen Gruessen, ...'],
    'Formal job application language',
    [('die Bewerbung','application'),('der Lebenslauf','CV'),('das Anschreiben','cover letter'),('die Stelle','position'),('der Arbeitgeber','employer'),('der Arbeitnehmer','employee'),('die Erfahrung','experience'),('die Qualifikation','qualification'),('das Vorstellungsgespraech','job interview'),('die Referenz','reference')],
    [('How do you start a cover letter?','Sehr geehrte Damen und Herren'),('What does "Lebenslauf" mean?','CV'),('Translate "I have 5 years of experience"','Ich habe fuenf Jahre Berufserfahrung')],
    'Anna schreibt eine Bewerbung fuer ein Praktikum. Betreff: "Bewerbung als Praktikantin im Marketing." Sehr geehrte Frau Dr. Hoffmann, hiermit bewerbe ich mich um die Stelle als Praktikantin im Bereich Marketing. Ich studiere Betriebswirtschaftslehre im 5. Semester und habe bereits ein Praktikum bei einer Werbeagentur absolviert. Meine Staerken sind Kreativitaet und Teamfaehigkeit. Ueber eine Einladung zu einem Vorstellungsgespraech wuerde ich mich sehr freuen. Mit freundlichen Gruessen, Anna Schmidt.',
    [('Worum bewirbt sich Anna?',['als Festangestellte','als Praktikantin','als Werkstudentin','als Auszubildende'],'als Praktikantin'),('In welchem Bereich?',['Finanzen','Marketing','Personal','IT'],'Marketing')],
    'A: Hast du dich schon auf die Stelle beworben? B: Ja, ich habe gestern meine Bewerbung mit Lebenslauf und Anschreiben abgeschickt. A: Daumen druchen!',
    'Was hat B gestern abgeschickt?',['nur den Lebenslauf','Bewerbung mit Lebenslauf und Anschreiben','nur das Anschreiben','die Referenzen'],'Bewerbung mit Lebenslauf und Anschreiben',
    'Write a cover letter for a job application (150 words).',
    'Present yourself in a mock job interview.',
    '"Hiermit bewerbe ich mich um..." = I hereby apply for... "Mit freundlichen Gruessen" = standard formal closing. "der Lebenslauf" = CV.')

add('B1', 8,
    'Soziale Medien', 'Talk about social media use.',
    'Social media: die sozialen Medien, Facebook, Instagram, TikTok, LinkedIn, der Beitrag (post), der Follower, das Profil, der Account, teilen (share), liken, kommentieren (comment), folgen (follow), hochladen (upload), die Privatsphaere (privacy). "Ich verbringe zu viel Zeit auf Social Media." "Man sollte vorsichtig mit persoenlichen Daten sein."',
    ['Ich nutze taeglich soziale Medien.','Wieviel Zeit verbringst du auf Instagram?','Man sollte auf die Privatsphaere achten.','Sein Beitrag wurde tausendmal geteilt.'],
    'Social media vocabulary and reflexive verbs',
    [('die sozialen Medien','social media'),('der Beitrag','post'),('teilen','to share'),('liken','to like'),('kommentieren','to comment'),('folgen','to follow'),('hochladen','to upload'),('die Privatsphaere','privacy'),('der Follower','follower'),('das Profil','profile'),('die Datenschutzeinstellungen','privacy settings')],
    [('How do you say "social media" in German?','die sozialen Medien'),('What does "hochladen" mean?','to upload'),('Translate "protect your privacy"','Schuetze deine Privatsphaere')],
    'Eine Studie zeigt: Deutsche Jugendliche verbringen durchschnittlich 2,5 Stunden taeglich in sozialen Medien. Instagram und TikTok sind am beliebtesten. Viele Jugendliche folgen Influencern und lassen sich von ihnen inspirieren. Experten warnen jedoch vor zu viel Bildschirmzeit und raten zu mehr Bewegung an der frischen Luft.',
    [('Wie viel Zeit verbringen Jugendliche taeglich in sozialen Medien?',['1 Stunde','2,5 Stunden','3 Stunden','4 Stunden'],'2,5 Stunden'),('Welche Plattformen sind am beliebtesten?',['Facebook und Twitter','Instagram und TikTok','LinkedIn und Snapchat','Pinterest und YouTube'],'Instagram und TikTok')],
    'A: Wie viele Follower hast du auf Instagram? B: Ungefaehr 500. Ich poste etwa einmal pro Woche. A: Ich folge dir!',
    'Wie oft postet B?',['taeglich','einmal pro Woche','einmal pro Monat','selten'],'einmal pro Woche',
    'Write about your social media habits: which platforms, how often, what you post.',
    'Discuss the pros and cons of social media with a partner.',
    '"soziale Medien" (pl., always with article "die"). "hochladen" = upload (separable). "die Privatsphaere" = privacy. "das Profil" = profile.')

add('B1', 9,
    'Umwelt und Natur schuetzen', 'Talk about environmental protection.',
    'Environment: die Umwelt (environment), der Klimawandel (climate change), die Erderwaermung (global warming), der Umweltschutz (environmental protection), recyceln (recycle), die Muelltrennung (waste separation), erneuerbare Energien (renewable energy), nachhaltig (sustainable), der CO2-Ausstoss (CO2 emissions). "Was kann ich fuer die Umwelt tun?" "Wir muessen nachhaltiger leben."',
    ['Wir muessen die Umwelt schuetzen.','Was kann ich fuer den Klimaschutz tun?','Ich trenne meinen Muell.','Erneuerbare Energien sind wichtig.'],
    'Environmental vocabulary and modal verbs (muessen/duerfen)',
    [('die Umwelt','environment'),('der Klimawandel','climate change'),('der Umweltschutz','environmental protection'),('recyceln','to recycle'),('die Muelltrennung','waste separation'),('nachhaltig','sustainable'),('erneuerbare Energien','renewable energy'),('der CO2-Ausstoss','CO2 emissions'),('das Elektroauto','electric car'),('die Energiewende','energy transition')],
    [('How do you say "protect the environment"?','Die Umwelt schuetzen'),('What does "nachhaltig" mean?','sustainable'),('Translate "I recycle"','Ich recycele')],
    'Die Stadt Freiburg gilt als Vorreiter im Umweltschutz. Viele Haushalte nutzen Solarenergie. Die Muelltrennung wird streng kontrolliert: Biomuell, Papier, Glas, Plastik und Restmuell. In der Innenstadt fahren Elektrobusse. Die Stadt foerdert Fahrradfahren mit guten Radwegen. Buerger, die ein Elektroauto kaufen, bekommen einen Zuschuss.',
    [('Welche Stadt ist ein Vorreiter im Umweltschutz?',['Berlin','Hamburg','Freiburg','Dresden'],'Freiburg'),('Wie viele Muellarten werden getrennt?',['drei','vier','fuenf','sechs'],'fuenf')],
    'A: Was tust du fuer die Umwelt? B: Ich trenne Muell, kaufe regionale Produkte und fahre meist Fahrrad.',
    'Wie kommt B meistens zur Arbeit?',['mit dem Auto','mit dem Bus','mit dem Fahrrad','zu Fuss'],'mit dem Fahrrad',
    'Write about 3 things you do to help the environment.',
    'Discuss environmental issues and what individuals can do.',
    '"die Umwelt schuetzen" = to protect the environment. "nachhaltig" = sustainable. "der Umweltschutz" = environmental protection.')

add('B1', 10,
    'Ein Praktikum absolvieren', 'Talk about internships and work experience.',
    'Internship: das Praktikum (internship), der Praktikant (intern), betreuen (to supervise), die Abteilung (department), der Vorgesetzte (supervisor), die Aufgabe (task), das Projekt, der Berufseinstieg (career start), die Berufserfahrung (work experience). "Ich mache ein Praktikum bei ..." "Meine Aufgaben umfassen ..." "Das Praktikum dauert drei Monate."',
    ['Ich mache ein Praktikum bei Siemens.','Meine Aufgaben sind vielfaeltig.','Das Praktikum dauert drei Monate.','Ich sammle wertvolle Berufserfahrung.'],
    'Career and internship vocabulary',
    [('das Praktikum','internship'),('der Praktikant','intern'),('betreuen','to supervise'),('die Abteilung','department'),('der Vorgesetzte','supervisor'),('die Aufgabe','task'),('das Projekt','project'),('der Berufseinstieg','career start'),('die Berufserfahrung','work experience'),('der Arbeitsalltag','daily work routine')],
    [('How do you say "I am doing an internship"?','Ich mache ein Praktikum'),('What does "betreuen" mean?','to supervise'),('Translate "the internship lasts 3 months"','Das Praktikum dauert drei Monate')],
    'Lisa absolviert ein dreimonatiges Praktikum in der Marketingabteilung eines grossen Konzerns. Ihr Vorgesetzter, Herr Wagner, betreut sie und gibt ihr eigene Aufgaben. Lisa hilft bei der Erstellung von Werbematerialien, recherchiert Marktdaten und nimmt an Teambesprechungen teil. Sie ist begeistert von der Arbeit und hat schon viel gelernt. Nach dem Praktikum moechte sie eine Festanstellung bekommen.',
    [('In welcher Abteilung arbeitet Lisa?',['Personal','Marketing','Finanzen','IT'],'Marketing'),('Wie lange dauert das Praktikum?',['einen Monat','zwei Monate','drei Monate','sechs Monate'],'drei Monate')],
    'A: Hast du schon ein Praktikum gemacht? B: Ja, letztes Jahr bei BMW in der Produktion. A: Wie war es? B: Sehr lehrreich, aber auch anstrengend.',
    'Wo hat B sein Praktikum gemacht?',['bei VW','bei BMW','bei Mercedes','bei Audi'],'bei BMW',
    'Write about your internship experience or one you would like to do.',
    'Describe your work experience or internship plans.',
    '"ein Praktikum absolvieren/machen" = to do an internship. "betreuen" = to supervise. "die Abteilung" = department. "der Berufseinstieg" = career start.')

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
