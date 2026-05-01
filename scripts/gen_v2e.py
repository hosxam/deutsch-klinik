#!/usr/bin/env python3
"""Batch 5: A2 21-25, B1 11-15"""
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

# === A2 21-25 ===
add('A2', 21,
    'Wohnungssuche', 'Search for an apartment and describe requirements.',
    'Housing: die Wohnung, das Haus, die Miete (rent), die Kaution (deposit), die Nebenkosten (utilities), der Makler (agent), der Mietvertrag (lease), die Besichtigung (viewing), die Zimmeranzahl, die Quadratmeter, der Stadtteil (district). "Ich suche eine Wohnung in Berlin." "Wie hoch ist die Kaution?" "Sind die Nebenkosten inklusive?" "Die Wohnung hat drei Zimmer und einen Balkon."',
    ['Ich suche eine Wohnung in Muenchen.','Wie hoch ist die Kaltmiete?','Sind die Nebenkosten inklusive?','Wann ist die Besichtigung?'],
    'Housing search vocabulary',
    [('die Wohnung','apartment'),('die Miete','rent'),('die Kaution','deposit'),('die Nebenkosten','utilities'),('der Makler','real estate agent'),('der Mietvertrag','lease contract'),('die Besichtigung','viewing'),('der Stadtteil','district'),('der Balkon','balcony'),('der Keller','basement'),('die Garage','garage')],
    [('How do you ask about rent?','Wie hoch ist die Miete?'),('What does "Kaution" mean?','deposit'),('Translate "when is the viewing?"','Wann ist die Besichtigung?')],
    'Tim sucht eine Wohnung in Hamburg. Er hat ein gutes Angebot gefunden: eine 2-Zimmer-Wohnung mit Balkon im Stadtteil Eimsbuettel. Die Kaltmiete betraegt 750 Euro warm 950 Euro. Die Kaution sind 2250 Euro drei Kaltmieten. Tim ruft den Makler an und vereinbart einen Besichtigungstermin fuer naechsten Samstag.',
    [('Wie viele Zimmer hat die Wohnung?',['1','2','3','4'],'2'),('Wie hoch ist die Kaution?',['750','1500','2250','3000'],'2250')],
    'A: Ich habe eine Wohnung gefunden! 70 qm, drei Zimmer, zentral gelegen. B: Klingt toll! Wie hoch ist die Miete? A: 850 Euro warm.',
    'Wie gross ist die Wohnung?',['50 qm','60 qm','70 qm','80 qm'],'70 qm',
    'Write an ad for your ideal apartment: location, size, rooms, special features.',
    'Describe your dream apartment to a partner.',
    '"die Miete" = rent. "die Kaution" = deposit (usually 3 cold rents). "die Nebenkosten" = utilities. "die Besichtigung" = viewing.')

add('A2', 22,
    'Campingurlaub', 'Talk about camping and outdoor activities.',
    'Camping: das Zelt (tent), der Campingplatz, der Schlafsack (sleeping bag), die Isomatte, der Campingkocher (stove), das Lagerfeuer (campfire), der Wohnwagen (caravan), das Wohnmobil (motorhome). "Wir fahren campen." "Wir schlafen im Zelt." "Hast du eine Taschenlampe?" "Am Lagerfeuer sitzen und Geschichten erzaehlen." "die Natur geniessen."',
    ['Wir fahren nach Schweden campen.','Wir haben ein grosses Zelt dabei.','Am Abend machen wir ein Lagerfeuer.','Die Natur ist wunderschoen.'],
    'Camping and nature vocabulary',
    [('das Zelt','tent'),('der Campingplatz','campsite'),('der Schlafsack','sleeping bag'),('die Isomatte','sleeping mat'),('das Lagerfeuer','campfire'),('der Wohnwagen','caravan'),('der Campingkocher','camping stove'),('die Taschenlampe','flashlight'),('der Wanderweg','hiking trail'),('die Landschaft','landscape')],
    [('How do you say "tent" in German?','das Zelt'),('What does "Lagerfeuer" mean?','campfire'),('Translate "were going camping"','Wir fahren campen')],
    'Familie Klein macht jeden Sommer Campingurlaub. Letztes Jahr waren sie in Oesterreich in den Bergen. Sie haben dort eine Woche gezeltet. Jeden Tag sind sie gewandert und haben die Berglandschaft genossen. Abends haben sie am Lagerfeuer gesessen und Stockbrot gemacht. Dieses Jahr wollen sie an die Nordsee fahren.',
    [('Wo waren sie letztes Jahr?',['an der Nordsee','in den Bergen Oesterreichs','in Schweden','in Italien'],'in den Bergen Oesterreichs'),('Was haben sie abends gemacht?',['Fernsehen','Lagerfeuer und Stockbrot','Spiele gespielt','geangelt'],'Lagerfeuer und Stockbrot')],
    'A: Hast du schon mal gezeltet? B: Ja, letztes Jahr an der Ostsee. A: War es kalt nachts? B: Ein bisschen, aber der Schlafsack war warm genug.',
    'Wo hat B gezeltet?',['Nordsee','Ostsee','Bodensee','Mittelmeer'],'Ostsee',
    'Write about a camping trip or outdoor adventure.',
    'Describe your camping experience or dream camping trip.',
    '"campen fahren" = to go camping. "zelten" = to tent. "das Lagerfeuer" = campfire. "die Landschaft" = landscape.')

add('A2', 23,
    'Ein Museum besuchen', 'Visit a museum and describe art/exhibits.',
    'Museum: das Museum, die Ausstellung (exhibition), der Eintritt (admission), die Fuehrung (guided tour), das Gemaelde (painting), die Skulptur (sculpture), der Ausstellungsraum (exhibition room), der Audioguide, geoeffnet/geschlossen, der Ruhetag (closing day). "Das Museum ist montags geschlossen." "Der Eintritt kostet 12 Euro, ermaessigt 8 Euro." "Darf ich Fotos machen?"',
    ['Das Museum ist sehr interessant.','Der Eintritt kostet 10 Euro.','Darf ich Fotos machen?','Das Gemaelde gefaellt mir sehr.'],
    'Museum vocabulary and modal verbs',
    [('das Museum','museum'),('die Ausstellung','exhibition'),('der Eintritt','admission'),('die Fuehrung','guided tour'),('das Gemaelde','painting'),('die Skulptur','sculpture'),('der Audioguide','audio guide'),('geoeffnet','open'),('ermaeassigt','reduced'),('der Ruhetag','closing day')],
    [('How do you ask about admission?','Was kostet der Eintritt?'),('What does "ermaeassigt" mean?','reduced/discounted'),('Translate "can I take photos?"','Darf ich Fotos machen?')],
    'Am Wochenende besuchen Anna und Paul das Kunstmuseum in Koeln. Die Sonderausstellung heisst "Impressionismus in Deutschland" und zeigt Werke von Max Liebermann und Lovis Corinth. Der Eintritt kostet 14 Euro, fuer Studenten 8 Euro. Sie leihen sich einen Audioguide fuer 3 Euro extra. Die Ausstellung ist sehr beeindruckend, besonders Liebermanns Gartenbilder.',
    [('Wie heisst die Sonderausstellung?',['Moderne Kunst','Impressionismus in Deutschland','Romantik am Rhein','Berliner Maler'],'Impressionismus in Deutschland'),('Wie viel sparen sie mit dem Studententicket?',['2 Euro','4 Euro','6 Euro','8 Euro'],'6 Euro')],
    'A: Sollen wir am Samstag ins Deutsche Museum gehen? B: Gute Idee! Ich war noch nie dort. A: Es zeigt viele Exponate zur Technikgeschichte.',
    'Welches Museum wollen sie besuchen?',['Kunstmuseum','Deutsche Museum','Naturkundemuseum','Filmuseum'],'Deutsche Museum',
    'Write about a museum visit: what you saw, what impressed you.',
    'Describe your favorite museum or an exhibit you liked.',
    '"die Ausstellung" = exhibition. "die Fuehrung" = guided tour. "der Eintritt" = admission. "das Gemaelde" = painting.')

add('A2', 24,
    'Fotografie und Bilder', 'Talk about photography and describing pictures.',
    'Photography: das Foto (photo), der Fotoapparat (camera), fotografieren (to photograph), das Bild (image/picture), der Hintergrund (background), der Vordergrund (foreground), die Einstellung (setting), das Licht (light), der Schatten (shadow), scharf/unscharf (sharp/blurry). "Kannst du ein Foto von uns machen?" "Das Bild ist verwackelt." "Im Vordergrund sieht man..."',
    ['Kannst du ein Foto von uns machen?','Das Bild ist etwas unscharf.','Das Licht ist perfekt.','Im Vordergrund sieht man den Turm.'],
    'Photography vocabulary and picture descriptions',
    [('das Foto','photo'),('der Fotoapparat','camera'),('fotografieren','to photograph'),('das Bild','image'),('der Hintergrund','background'),('der Vordergrund','foreground'),('das Licht','light'),('scharf','sharp'),('unscharf','blurry'),('der Fotograf','photographer')],
    [('How do you ask someone to take a photo?','Kannst du ein Foto von uns machen?'),('What does "unscharf" mean?','blurry'),('Translate "in the foreground"','Im Vordergrund')],
    'Lena liebt Fotografie. Letzten Sonntag ist sie frueh aufgestanden, um den Sonnenaufgang zu fotografieren. Sie ist an den See gefahren und hat die perfekte Stelle gefunden. Das Licht war wunderschoen. Sie hat 50 Fotos gemacht, aber nur drei sind richtig gut geworden. Eins zeigt einen Schwan im Vordergrund und die untergehende Sonne im Hintergrund.',
    [('Wann ist Lena losgefahren?',['mittags','frueh morgens','abends','nachmittags'],'frueh morgens'),('Was ist im Vordergrund des besten Fotos?',['der See','ein Schwan','die Sonne','ein Baum'],'ein Schwan')],
    'A: Zeig mir deine Urlaubsfotos! B: Hier, das ist der Strand am Abend. A: Wow, das Licht ist fantastisch! Welche Kamera hast du?',
    'Was zeigt das Foto?',['einen Berg','einen Strand','eine Stadt','einen See'],'einen Strand',
    'Describe a photo you took: what, when, where, why it is special.',
    'Bring a photo and describe it in German to your partner.',
    '"das Foto machen" = to take a photo. "im Vordergrund" = in the foreground. "im Hintergrund" = in the background. "der Fotoapparat" = camera.')

add('A2', 25,
    'Einladungen und Absagen', 'Invite someone and respond to invitations.',
    'Invitations: "Moechtest du ins Kino kommen?" "Ich lade dich zu meiner Party ein." "Hast du am Samstag Zeit?" "Was haeltst du davon, wenn wir...?" Accepting: "Gerne!" "Klingt gut!" "Da bin ich dabei!" Declining: "Tut mir leid, ich habe schon was vor." "Leider kann ich nicht." "Ich habe keine Zeit." "Vielleicht ein andermal."',
    ['Moechtest du mit ins Kino kommen?','Das klingt gut, da bin ich dabei!','Tut mir leid, ich habe schon was vor.','Vielleicht ein andermal!'],
    'Invitation expressions and accepting/declining',
    [('einladen','to invite'),('die Einladung','invitation'),('teilnehmen','to attend'),('abzusagen','to cancel'),('die Zusage','acceptance'),('die Absage','rejection'),('die Verabredung','appointment/date'),('vielleicht ein andermal','maybe another time'),('sich freuen auf','to look forward to')],
    [('How do you invite someone to the cinema?','Moechtest du ins Kino kommen?'),('What does "leider kann ich nicht" mean?','unfortunately I cant'),('Translate "Im looking forward to it"','Ich freue mich darauf')],
    'Paula laedt ihre Freunde zu einer Geburtstagsparty ein: "Hey Leute, naechsten Samstag feiere ich meinen Geburtstag. Habt ihr Lust zu kommen? Es gibt Grillen und Musik, beginn um 18 Uhr." Tom antwortet: "Klingt super, ich komme gern!" Lisa sagt: "Oh schade, da habe ich leider schon was vor. Aber viel Spass!" Max schreibt: "Ich weiss noch nicht, ich melde mich."',
    [('Wer kommt zur Party?',['Lisa','Tom','Max','alle'],'Tom'),('Wann beginnt die Party?',['16 Uhr','17 Uhr','18 Uhr','19 Uhr'],'18 Uhr')],
    'A: Hast du Lust am Wochenende wandern zu gehen? B: Gern! Wohin sollen wir fahren? A: Wie waers mit dem Harz? B: Perfekt!',
    'Was wollen sie am Wochenende machen?',['schwimmen','wandern','Fahrrad fahren','Kino'],'wandern',
    'Write an invitation to a party/event and a response accepting and one declining.',
    'Invite your partner to an event. They accept or decline politely.',
    '"einladen" = to invite (separable). "Ich lade dich ein." "sich freuen auf + Akk" = to look forward to. "leider" = unfortunately.')

# === B1 11-15 ===
add('B1', 11,
    'Ueber Filme diskutieren', 'Discuss films, give opinions and recommendations.',
    'Film discussion: der Film, die Handlung (plot), der Schauspieler (actor), die Schauspielerin (actress), die Regie (direction), die Kamera (cinematography), der Soundtrack, die Kritik (review). "Die Handlung war fesselnd." "Der Film basiert auf einem Buch." "Ich wuerde den Film auf jeden Fall empfehlen." "Die schauspielerische Leistung war ueberzeugend."',
    ['Die Handlung war sehr fesselnd.','Der Schauspieler hat ueberzeugend gespielt.','Ich wuerde den Film auf jeden Fall empfehlen.','Die Kameraarbeit war beeindruckend.'],
    'Film analysis vocabulary and Konjunktiv II for recommendations',
    [('die Handlung','plot'),('der Schauspieler','actor'),('die Schauspielerin','actress'),('die Regie','direction'),('die Kamera','camera work'),('der Soundtrack','soundtrack'),('fesselnd','captivating'),('ueberzeugend','convincing'),('empfehlen','to recommend'),('die Kritik','review'),('der Filmpreis','film award')],
    [('How do you recommend a movie?','Ich wuerde den Film empfehlen'),('What does "fesselnd" mean?','captivating'),('Translate "the acting was convincing"','Die schauspielerische Leistung war ueberzeugend')],
    'Der Film "Das Leben der Anderen" aus dem Jahr 2006 spielt in der DDR und handelt von einem Stasi-Mann, der einen Schriftsteller ueberwacht. Die Handlung ist fesselnd und die Schauspieler ueberzeugen auf ganzer Linie. Der Film hat viele Preise gewonnen, darunter den Oscar fuer den besten fremdsprachigen Film. Ich wuerde den Film jedem empfehlen, der sich fuer deutsche Geschichte interessiert.',
    [('In welchem Jahr spielt der Film?',['2004','2006','2008','2010'],'2006'),('Welchen Preis hat der Film gewonnen?',['Goldene Palme','Oscar','Goldener Baer','Bambi'],'Oscar')],
    'A: Hast du "Parasite" gesehen? B: Ja, fantastischer Film! Die Regie war meisterhaft. A: Total! Die Handlung war so ueberraschend.',
    'Wie fand B den Film Parasite?',['langweilig','fantastisch','schlecht','verwirrend'],'fantastisch',
    'Write a film review in German (150 words) including plot, actors, direction, and recommendation.',
    'Discuss a movie with a partner. Give your opinion and recommendation.',
    '"Ich wuerde den Film empfehlen" = I would recommend the film. "fesselnd" = captivating. "ueberzeugend" = convincing. "die Handlung" = plot.')

add('B1', 12,
    'Gesunde Ernaehrung', 'Talk about healthy eating and nutrition.',
    'Nutrition: die Ernaehrung (nutrition), gesund/ungesund, die Vitamine, die Naehrstoffe (nutrients), das Eiweiss (protein), die Kohlenhydrate (carbs), die Fette (fats), die Ballaststoffe (fiber), die Mahlzeit (meal), die Diaet (diet), vegetarisch/vegan. "Man sollte sich ausgewogen ernaehren." "Ich versuche, weniger Zucker zu essen." "Viel Obst und Gemuese ist wichtig." "Fruehstueck ist die wichtigste Mahlzeit."',
    ['Eine ausgewogene Ernaehrung ist wichtig.','Ich versuche, weniger Zucker zu essen.','Viel Obst und Gemuese ist gesund.','Frühstueck ist die wichtigste Mahlzeit.'],
    'Nutrition vocabulary and "sollte" (should)',
    [('die Ernaehrung','nutrition'),('gesund','healthy'),('ungesund','unhealthy'),('das Vitamin','vitamin'),('das Eiweiss','protein'),('die Kohlenhydrate','carbs'),('die Mahlzeit','meal'),('vegetarisch','vegetarian'),('vegan','vegan'),('die Ballaststoffe','fiber'),('ausgewogen','balanced')],
    [('How do you say "healthy eating"?','gesunde Ernaehrung'),('What does "ausgewogen" mean?','balanced'),('Translate "I try to eat less sugar"','Ich versuche, weniger Zucker zu essen')],
    'Die Deutsche Gesellschaft fuer Ernaehrung empfiehlt: taeglich fuenf Portionen Obst und Gemuese, ausreichend Vollkornprodukte, weniger Fleisch und mehr pflanzliche Eiweisse. Fruehstueck sollte nicht ausgelassen werden. Die Mahlzeiten sollten ueber den Tag verteilt sein. Zwei Liter Wasser oder ungesuessten Tee pro Tag sind ideal. Fertigprodukte enthalten oft zu viel Zucker und Salz.',
    [('Wie viele Portionen Obst und Gemuese taeglich?',['drei','fuenf','vier','zwei'],'fuenf'),('Wie viel Wasser sollte man pro Tag trinken?',['1 Liter','1,5 Liter','2 Liter','3 Liter'],'2 Liter')],
    'A: Ich versuche mich gesuender zu ernaehren. B: Was hast du geaendert? A: Ich esse mehr Salat und weniger Fleisch, stattdessen mehr Huelsenfruechte.',
    'Was isst A jetzt weniger?',['Obst','Fleisch','Brot','Kaese'],'Fleisch',
    'Write about your eating habits: what you eat, what you should change.',
    'Discuss healthy eating: diet, habits, changes you want to make.',
    '"sollte" = should (Konjunktiv II). "sich ernaehren" = to eat/nourish oneself. "ausgewogen" = balanced.')

add('B1', 13,
    'Zukunftsplaene', 'Talk about future plans and goals.',
    'Future: die Zukunft, der Plan, das Ziel (goal), der Traum (dream), der Berufswunsch (career ambition), in naechster Zeit (soon/next), in fuenf Jahren. Use "werden" + infinitive or present with time phrase for future: "Ich werde naechstes Jahr mein Studium abschliessen." "Naechstes Jahr mache ich einen Sprachkurs." "Ich hoffe, dass ich einen guten Job finde."',
    ['Ich werde naechstes Jahr mein Studium abschliessen.','Mein Ziel ist es, als Arzt zu arbeiten.','In fuenf Jahren moechte ich im Ausland leben.','Ich hoffe, dass alles klappt.'],
    'Future tense with "werden" and "hoffen"',
    [('die Zukunft','future'),('der Plan','plan'),('das Ziel','goal'),('hoffen','to hope'),('abschliessen','to finish/complete'),('der Berufswunsch','career goal'),('der Traum','dream'),('der Wunsch','wish'),('verwirklichen','to realize/achieve'),('der Auslandsaufenthalt','stay abroad')],
    [('How do you say "I will finish my studies"?','Ich werde mein Studium abschliessen'),('What does "das Ziel" mean?','the goal'),('Translate "I hope to find a good job"','Ich hoffe, einen guten Job zu finden')],
    'Maria hat klare Zukunftsplaene: Sie studiert Medizin im 6. Semester und wird voraussichtlich in zwei Jahren ihr Studium abschliessen. Danach moechte sie ihre Facharztausbildung in der Inneren Medizin machen. Ihr grosser Traum ist es, fuer ein Jahr in einem Entwicklungsland zu arbeiten und dort medizinische Hilfe zu leisten. Ihr Freund plant, mitzukommen und als Ingenieur zu arbeiten.',
    [('Was studiert Maria?',['BWL','Medizin','Jura','Ingenieurwesen'],'Medizin'),('Wo moechte sie arbeiten?',['einer Klinik','einem Entwicklungsland','einem Forschungsinstitut','einer Praxis'],'einem Entwicklungsland')],
    'A: Was sind deine Ziele fuer die naechsten fuenf Jahre? B: Ich moechte meine Firma ausbauen und vielleicht nach Oesterreich ziehen.',
    'Wohin moechte B vielleicht ziehen?',['Deutschland','die Schweiz','Oesterreich','USA'],'Oesterreich',
    'Write about your plans for the next 1, 5, and 10 years.',
    'Discuss your future plans and goals with a partner.',
    '"werden" + Infinitiv = future tense. "Ich hoffe, dass..." = I hope that... "Moechte" = polite "want to." "das Ziel" = goal.')

add('B1', 14,
    'Eine Wohnung vermieten', 'Rent out or sublet an apartment.',
    'Rental: vermieten (to rent out), der Mieter (tenant), der Vermieter (landlord), der Mietvertrag, die Mietdauer, die Kündigung (cancellation), die Betriebskosten (operating costs), die Hausordnung (house rules). "Ich vermiete mein Zimmer unter." "Der Mietvertrag laeuft auf 12 Monate." "Die Kuendigungsfrist betraegt drei Monate." "Die Kaution wird bei Auszug zurueckgezahlt."',
    ['Ich vermiete mein Zimmer unter.','Der Mietvertrag gilt fuer 12 Monate.','Die Kuendigungsfrist betraegt 3 Monate.','In den Nebenkosten sind Wasser und Heizung enthalten.'],
    'Rental vocabulary and prepositions with Dativ',
    [('vermieten','to rent out'),('der Mieter','tenant'),('der Vermieter','landlord'),('der Mietvertrag','lease'),('die Mietdauer','rental period'),('die Kuendigung','cancellation'),('die Kuendigungsfrist','notice period'),('die Betriebskosten','operating costs'),('die Hausordnung','house rules'),('der Auszug','moving out'),('untermieten','to sublet')],
    [('How do you say "I sublet my room"?','Ich vermiete mein Zimmer unter'),('What does "Kuendigungsfrist" mean?','notice period'),('Translate "the deposit will be returned"','Die Kaution wird zurueckgezahlt')],
    'Lisa studiert in Heidelberg und hat ein WG-Zimmer gefunden. Sie unterschreibt einen Mietvertrag mit 12 Monaten Laufzeit. Die Kaltmiete betraegt 400 Euro, plus 100 Euro Nebenkosten fuer Wasser, Heizung und Internet. Die Kaution in Hoehe von 1200 Euro ueberweist sie auf ein Kautionskonto. Die Kuendigungsfrist betraegt drei Monate zum Monatsende.',
    [('Wie hoch ist die Kaltmiete?',['350','400','450','500'],'400'),('Wie lang ist die Kuendigungsfrist?',['einen Monat','zwei Monate','drei Monate','sechs Monate'],'drei Monate')],
    'A: Ich moechte meine Wohnung zum 1. Oktober kuendigen. B: Aber die Kuendigungsfrist betraegt drei Monate, das waere erst Januar.',
    'Wann kann B fruehestens ausziehen?',['Oktober','November','Dezember','Januar'],'Januar',
    'Write a dialogue between landlord and tenant about a rental contract.',
    'Role play: discuss a rental contract with a potential tenant.',
    '"vermieten" = to rent out. "kuendigen" = to cancel. "die Kuendigungsfrist" = notice period. "die Kaution" = deposit.')

add('B1', 15,
    'Oeffentlicher Nahverkehr', 'Navigate public transport systems.',
    'Public transport: der Nahverkehr (local transport), die Haltestelle (stop), der Fahrplan (timetable), die Linie (line), die Verspaetung (delay), der Fahrschein (ticket), die Monatskarte (monthly pass), die Fahrkartenkontrolle (ticket inspection). "Wann kommt die naechste Bahn?" "Der Zug hat 10 Minuten Verspaetung." "Ich habe eine Monatskarte." "Entschuldigung, ist hier noch frei?"',
    ['Wann kommt die naechste U-Bahn?','Der Zug hat 10 Minuten Verspaetung.','Ich habe eine Monatskarte.','Entschuldigung, ist hier noch frei?'],
    'Public transport vocabulary',
    [('der Nahverkehr','local transport'),('die Haltestelle','stop'),('der Fahrplan','schedule'),('die Linie','line'),('die Verspaetung','delay'),('der Fahrschein','ticket'),('die Monatskarte','monthly pass'),('die Fahrkartenkontrolle','ticket inspection'),('das Abteil','compartment'),('der Zugfuehrer','train driver'),('der Fahrgast','passenger')],
    [('How do you ask when the next train comes?','Wann kommt der naechste Zug?'),('What does "Verspaetung" mean?','delay'),('Translate "the bus is late"','Der Bus hat Verspaetung')],
    'In Berlin ist der oeffentliche Nahverkehr gut ausgebaut. U-Bahn, S-Bahn, Busse und Strassenbahnen fahren in alle Stadtteile. Die Berliner Verkehrsbetriebe (BVG) bieten verschiedene Tickets an: Einzelfahrschein, Tageskarte, Monatskarte. In den letzten Jahren wurden die Fahrpreise erhoeht. Pendler beklagen sich ueber die haeufigen Verspaetungen, besonders auf den S-Bahn-Linien.',
    [('Welche Verkehrsmittel gibt es in Berlin?',['nur Busse','U-Bahn, S-Bahn, Busse, Strassenbahn','nur U-Bahn','S-Bahn und Busse'],'U-Bahn, S-Bahn, Busse, Strassenbahn'),('Was kritisieren Pendler?',['die Preise','die Verspaetungen','die Sauberkeit','die Sicherheit'],'die Verspaetungen')],
    'A: Entschuldigung, faehrt diese U-Bahn zum Alexanderplatz? B: Ja, Linie U8 Richtung Wittenau. A: Danke! Wie viele Stationen sind es? B: vier Stationen.',
    'Welche Linie sollen sie nehmen?',['U5','U8','U9','S3'],'U8',
    'Write about the public transport system in your city.',
    'Give directions using public transport to a tourist.',
    '"die Verspaetung" = delay. "der Fahrschein" = ticket. "die Haltestelle" = stop. "die Linie" = line.')

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
