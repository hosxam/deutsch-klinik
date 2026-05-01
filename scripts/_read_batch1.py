import json

r = json.load(open('src/data/reading.json', encoding='utf-8'))
a1 = r['A1']
existing_ids = [int(v['id'].split('_')[-1]) for v in a1]
nid = max(existing_ids) + 1

qid_counter = sum(len(v['questions']) for v in a1) + 100

def qid():
    global qid_counter
    qid_counter += 1
    return "qr%d" % qid_counter

def make_ex(title, text, questions, lessonId):
    global nid
    ex = {"id": "A1_read_%d" % nid, "title": title, "text": text, "questions": questions, "lessonId": lessonId}
    nid += 1
    return ex

def tf(q_text, answer, explanation):
    return {"id": qid(), "type": "true-false", "question": q_text, "answer": answer, "explanation": explanation}

def mcq(q_text, options, answer, explanation):
    return {"id": qid(), "type": "mcq", "question": q_text, "options": options, "answer": answer, "explanation": explanation}

batch = []

batch.append(make_ex("Mein Name ist Lukas","Hallo! Ich heisse Lukas. Ich bin 22 Jahre alt. Ich komme aus Muenchen. Ich wohne in Koeln. Von Beruf bin ich Krankenpfleger. Ich mag meinen Beruf sehr.",[tf("Lukas ist 22 Jahre alt.","true","Der Text sagt: 'Ich bin 22 Jahre alt.'"),tf("Lukas kommt aus Koeln.","false","Lukas kommt aus Muenchen, er wohnt in Koeln."),mcq("Was ist Lukas von Beruf?",["Arzt","Krankenpfleger","Lehrer","Ingenieur"],"Krankenpfleger","Der Text sagt: 'Von Beruf bin ich Krankenpfleger.'")],"A1_lesson_1"))

batch.append(make_ex("Eine E-Mail von Maria","Lieber Tom,\n\nwie geht es dir? Mir geht es gut. Ich bin jetzt in Berlin. Das Wetter ist schoen. Ich besuche meine Freundin Lisa. Wir gehen morgen ins Museum.\n\nViele Gruesse,\nMaria",[tf("Maria ist in Berlin.","true","Der Text sagt: 'Ich bin jetzt in Berlin.'"),mcq("Was machen Maria und Lisa morgen?",["Schwimmen","Ins Museum gehen","Einkaufen","Kochen"],"Ins Museum gehen","Der Text sagt: 'Wir gehen morgen ins Museum.'"),tf("Das Wetter ist schlecht.","false","Der Text sagt: 'Das Wetter ist schoen.'")],"A1_lesson_2"))

batch.append(make_ex("Terminbestaetigung","Sehr geehrte Frau Schulz,\n\nvielen Dank fuer Ihre Terminanfrage. Ihr Termin bei Dr. Weber ist am Mittwoch, den 15. Mai um 10:30 Uhr. Bitte bringen Sie Ihre Versicherungskarte mit. Die Adresse ist: Hauptstrasse 12, 2. Stock.\n\nMit freundlichen Gruessen,\nIhre Praxis Dr. Weber",[mcq("Wann ist der Termin?",["Am Montag","Am Mittwoch","Am Freitag","Am Samstag"],"Am Mittwoch","Der Termin ist am Mittwoch, den 15. Mai."),mcq("Was soll Frau Schulz mitbringen?",["Einen Ausweis","Die Versicherungskarte","Ein Rezept","Ein Foto"],"Die Versicherungskarte","Der Text sagt: 'Bitte bringen Sie Ihre Versicherungskarte mit.'"),tf("Die Praxis ist im 2. Stock.","true","Die Adresse ist Hauptstrasse 12, 2. Stock.")],"A1_lesson_3"))

batch.append(make_ex("Hinweis in der Praxis","Willkommen in der Praxis Dr. Mueller!\n\nUnsere Sprechzeiten:\nMontag bis Freitag: 8:00 - 17:00 Uhr\nSamstag: 9:00 - 13:00 Uhr\nSonntag: geschlossen\n\nBitte melden Sie sich an der Anmeldung. Nehmen Sie bitte im Wartezimmer Platz.",[tf("Die Praxis hat samstags bis 13:00 Uhr geoeffnet.","true","Der Text sagt: 'Samstag: 9:00 - 13:00 Uhr.'"),mcq("Wann ist die Praxis geschlossen?",["Am Montag","Am Samstag","Am Sonntag","Am Freitag"],"Am Sonntag","Der Text sagt: 'Sonntag: geschlossen.'"),tf("Patienten sollen sich an der Anmeldung melden.","true","Der Text sagt: 'Bitte melden Sie sich an der Anmeldung.'")],"A1_lesson_4"))

batch.append(make_ex("Oeffnungszeiten der Apotheke","Apotheke am Marktplatz\n\nOeffnungszeiten:\nMontag - Freitag: 8:00 - 18:30 Uhr\nSamstag: 8:00 - 14:00 Uhr\n\nNotdienst: Taeglich ab 18:30 Uhr bis 8:00 Uhr am naechsten Morgen.\nAdresse: Marktplatz 5, 10115 Berlin\nTelefon: 030 123456",[mcq("Bis wann hat die Apotheke samstags geoeffnet?",["14:00 Uhr","16:00 Uhr","18:30 Uhr","20:00 Uhr"],"14:00 Uhr","Der Text sagt: 'Samstag: 8:00 - 14:00 Uhr.'"),tf("Die Apotheke hat einen Notdienst.","true","Der Text sagt: 'Notdienst: Taeglich ab 18:30 Uhr.'"),mcq("Wie ist die Telefonnummer?",["030 654321","030 123456","030 789012","030 345678"],"030 123456","Die Telefonnummer ist 030 123456.")],"A1_lesson_5"))

batch.append(make_ex("Speisekarte Cafe Sonnenschein","Cafe Sonnenschein - Speisekarte\n\nFruehstueck:\n- Fruehstuecksteller: 5,50 Euro\n- Marmeladenbrot: 2,00 Euro\n- Ruehrei mit Brot: 4,50 Euro\n\nGetraenke:\n- Kaffee: 2,50 Euro\n- Tee: 2,00 Euro\n- Orangensaft: 3,00 Euro\n\nKuchen:\n- Apfelkuchen: 3,50 Euro\n- Schokoladenkuchen: 3,50 Euro",[mcq("Was kostet der Kaffee?",["2,00 Euro","2,50 Euro","3,00 Euro","3,50 Euro"],"2,50 Euro","Der Kaffee kostet 2,50 Euro."),tf("Der Apfelkuchen kostet 3,50 Euro.","true","Der Text sagt: 'Apfelkuchen: 3,50 Euro.'"),mcq("Was kostet das Ruehrei mit Brot?",["4,50 Euro","5,50 Euro","3,50 Euro","2,50 Euro"],"4,50 Euro","Der Text sagt: 'Ruehrei mit Brot: 4,50 Euro.'")],"A1_lesson_6"))

batch.append(make_ex("Fahrplan Bus 142","Bus 142 - Hauptbahnhof zum Marktplatz\n\nHaltestellen:\nHauptbahnhof: 9:00\nStadtmitte: 9:10\nMarktplatz: 9:20\n\nFahrkarten:\nEinzelfahrt: 2,80 Euro\nTageskarte: 5,50 Euro\nMonatskarte: 49,00 Euro\n\nKinder unter 6 Jahren fahren kostenlos.",[mcq("Wie lange faehrt der Bus vom Hauptbahnhof zum Marktplatz?",["10 Minuten","15 Minuten","20 Minuten","30 Minuten"],"20 Minuten","Abfahrt 9:00, Ankunft 9:20 = 20 Minuten."),tf("Die Monatskarte kostet 49 Euro.","true","Der Text sagt: 'Monatskarte: 49,00 Euro.'"),tf("Kinder unter 6 Jahren muessen keine Fahrkarte kaufen.","true","Der Text sagt: 'Kinder unter 6 Jahren fahren kostenlos.'")],"A1_lesson_7"))

batch.append(make_ex("Das Wetter am Wochenende","Wettervorhersage fuer Samstag und Sonntag:\n\nSamstag: Die Sonne scheint. Es ist warm. Temperatur: 22 Grad. Kein Regen.\n\nSonntag: Es regnet am Morgen. Am Nachmittag wird es sonnig. Temperatur: 18 Grad.\n\nAm Montag: Regen und Wind. Temperatur: 15 Grad.",[tf("Am Samstag scheint die Sonne.","true","Der Text sagt: 'Samstag: Die Sonne scheint.'"),mcq("Wie warm ist es am Sonntag?",["15 Grad","18 Grad","20 Grad","22 Grad"],"18 Grad","Der Text sagt: 'Sonntag: Temperatur: 18 Grad.'"),mcq("Wie ist das Wetter am Montag?",["Sonnig","Regen und Wind","Schnee","Nebel"],"Regen und Wind","Der Text sagt: 'Am Montag: Regen und Wind.'")],"A1_lesson_8"))

batch.append(make_ex("Kassenbon Supermarkt","SUPERMARKT FRISCH & GUENSTIG\n\nFiliale Berlin-Mitte\n\n1x Milch (1 Liter): 1,29 Euro\n1x Brot (Vollkorn): 2,49 Euro\n2x Apfel (1 kg): 2,98 Euro\n1x Butter: 1,89 Euro\n1x Kaese (200g): 3,49 Euro\n\nSumme: 12,14 Euro\nBezahlt mit Karte: 12,14 Euro\n\nVielen Dank fuer Ihren Einkauf!\nSamstag, 12. April 2025",[mcq("Wie viel kostet das Brot?",["1,29 Euro","2,49 Euro","2,98 Euro","3,49 Euro"],"2,49 Euro","Der Text sagt: 'Brot (Vollkorn): 2,49 Euro.'"),tf("Der Kunde hat mit Karte bezahlt.","true","Der Text sagt: 'Bezahlt mit Karte: 12,14 Euro.'"),mcq("Was kostet alles zusammen?",["10,14 Euro","11,14 Euro","12,14 Euro","13,14 Euro"],"12,14 Euro","Die Summe ist 12,14 Euro.")],"A1_lesson_9"))

batch.append(make_ex("Wohnung in Muenchen zu vermieten","Schoene 2-Zimmer-Wohnung in Muenchen-Schwabing zu vermieten.\n\nGroesse: 55 qm\nZimmer: 2 (Wohnzimmer, Schlafzimmer), Kueche, Bad, Balkon\nMiete: 850 Euro warm (inkl. Nebenkosten)\nKaution: 1700 Euro\nVerfuegbar: ab 1. Juni\n\nBesichtigung: Samstag, 10:00 - 12:00 Uhr\nTelefon: 089 789012",[mcq("Wie viele Zimmer hat die Wohnung?",["1","2","3","4"],"2","Der Text sagt: 'Zimmer: 2.'"),tf("Die Wohnung hat einen Balkon.","true","Der Text sagt: 'Balkon' in der Zimmerliste."),mcq("Wie hoch ist die Kaution?",["850 Euro","1000 Euro","1500 Euro","1700 Euro"],"1700 Euro","Der Text sagt: 'Kaution: 1700 Euro.'")],"A1_lesson_10"))

batch.append(make_ex("Familie Schmidt","Die Familie Schmidt wohnt in Hamburg. Herr Schmidt ist 45 Jahre alt und arbeitet als Busfahrer. Frau Schmidt ist 42 und arbeitet in einer Apotheke. Sie haben zwei Kinder: Jonas ist 10 und Emma ist 7. Die Familie hat einen kleinen Hund namens Bello. Am Wochenende gehen sie zusammen in den Park.",[tf("Herr Schmidt ist Busfahrer.","true","Der Text sagt: 'Herr Schmidt arbeitet als Busfahrer.'"),mcq("Wie alt ist Emma?",["7","10","12","15"],"7","Der Text sagt: 'Emma ist 7.'"),mcq("Was macht die Familie am Wochenende?",["Ins Kino gehen","In den Park gehen","Einkaufen","Verreisen"],"In den Park gehen","Der Text sagt: 'Am Wochenende gehen sie in den Park.'")],"A1_lesson_11"))

batch.append(make_ex("Ein Tag von Lisa","Lisa steht um 6:30 Uhr auf. Sie duscht und zieht sich an. Um 7:15 Uhr fruehstueckt sie. Sie isst Brot mit Kaese und trinkt Kaffee. Um 8:00 Uhr geht sie zur Arbeit. Sie arbeitet in einer Praxis. Um 12:30 Uhr macht sie Mittagspause. Sie isst in der Kantine. Um 17:00 Uhr geht sie nach Hause. Um 19:00 Uhr kocht sie Abendessen. Um 22:00 Uhr geht sie ins Bett.",[mcq("Wann steht Lisa auf?",["Um 6:00 Uhr","Um 6:30 Uhr","Um 7:00 Uhr","Um 7:30 Uhr"],"Um 6:30 Uhr","Der Text sagt: 'Lisa steht um 6:30 Uhr auf.'"),tf("Lisa arbeitet in einer Praxis.","true","Der Text sagt: 'Sie arbeitet in einer Praxis.'"),mcq("Was macht Lisa um 19:00 Uhr?",["Fruehstueckt","Geht nach Hause","Kocht Abendessen","Geht ins Bett"],"Kocht Abendessen","Der Text sagt: 'Um 19:00 Uhr kocht sie Abendessen.'")],"A1_lesson_12"))

batch.append(make_ex("Deutschkurs A1","Volkshochschule (VHS) Berlin\n\nDeutschkurs A1 - Anfaenger\nKursbeginn: Montag, 5. Mai\nKursende: Freitag, 27. Juni\nUnterrichtszeiten: Montag bis Freitag, 9:00 - 12:15 Uhr\nKursort: VHS Berlin, Zimmer 204\nKursleiter: Herr Fischer\nKosten: 200 Euro\n\nBitte bringen Sie ein Heft und einen Stift mit.",[mcq("Wann beginnt der Deutschkurs?",["Am 1. Mai","Am 5. Mai","Am 10. Mai","Am 15. Mai"],"Am 5. Mai","Der Text sagt: 'Kursbeginn: Montag, 5. Mai.'"),tf("Der Kurs kostet 200 Euro.","true","Der Text sagt: 'Kosten: 200 Euro.'"),mcq("Wer ist der Kursleiter?",["Frau Mueller","Herr Schmidt","Herr Fischer","Frau Weber"],"Herr Fischer","Der Text sagt: 'Kursleiter: Herr Fischer.'")],"A1_lesson_13"))

batch.append(make_ex("Arbeitsplan Mai","Arbeitsplan fuer Mai - Pfleger Thomas\n\nWoche 1 (5.-9. Mai): Fruehschicht (6:00 - 14:00 Uhr)\nWoche 2 (12.-16. Mai): Spaetschicht (14:00 - 22:00 Uhr)\nWoche 3 (19.-23. Mai): Nachtschicht (22:00 - 6:00 Uhr)\nWoche 4 (26.-30. Mai): Fruehschicht (6:00 - 14:00 Uhr)\n\nWochenende: frei\nFeiertage: 1. Mai (frei), 29. Mai (frei)",[mcq("Wann arbeitet Thomas in Woche 1?",["Fruehschicht","Spaetschicht","Nachtschicht","Frei"],"Fruehschicht","Der Text sagt: 'Woche 1: Fruehschicht.'"),tf("Am 1. Mai hat Thomas frei.","true","Der Text sagt: 'Feiertage: 1. Mai (frei).'"),mcq("Wie lang ist die Spaetschicht?",["6 Stunden","8 Stunden","10 Stunden","12 Stunden"],"8 Stunden","Von 14:00 bis 22:00 Uhr sind 8 Stunden.")],"A1_lesson_14"))

batch.append(make_ex("Einladung zum Geburtstag","Liebe Anna,\n\nich lade dich herzlich zu meinem Geburtstag ein!\n\nWann: Samstag, 10. Mai\nUhrzeit: 18:00 Uhr\nWo: Bei mir zu Hause, Muehlerstrasse 23\n\nEs gibt Kuchen, Pizza und Getraenke. Ich freue mich auf dich!\n\nBitte sag mir bis Donnerstag Bescheid, ob du kommen kannst.\n\nLiebe Gruesse,\nSarah",[tf("Die Party ist am Freitag.","false","Der Text sagt: 'Samstag, 10. Mai.'"),mcq("Wann soll Anna Bescheid sagen?",["Bis Mittwoch","Bis Donnerstag","Bis Freitag","Bis Samstag"],"Bis Donnerstag","Der Text sagt: 'Bitte sag mir bis Donnerstag Bescheid.'"),tf("Es gibt Kuchen, Pizza und Getraenke.","true","Der Text sagt: 'Es gibt Kuchen, Pizza und Getraenke.'")],"A1_lesson_15"))

batch.append(make_ex("Hotel Stadt Berlin","Hotel Stadt Berlin\n\nWillkommen! Informationen fuer unsere Gaeste:\n\nFruehstueck: 7:00 - 10:00 Uhr im Restaurant (1. Stock)\nCheck-in: ab 14:00 Uhr\nCheck-out: bis 11:00 Uhr\n\nZimmerausstattung:\n- Telefon\n- TV\n- WLAN (kostenlos)\n- Bad mit Dusche\n\nRezeption: 24 Stunden besetzt\nTelefon: 030 987654",[tf("Das Fruehstueck ist von 7:00 bis 10:00 Uhr.","true","Der Text sagt: 'Fruehstueck: 7:00 - 10:00 Uhr.'"),mcq("Bis wann ist der Check-out?",["10:00 Uhr","11:00 Uhr","12:00 Uhr","14:00 Uhr"],"11:00 Uhr","Der Text sagt: 'Check-out: bis 11:00 Uhr.'"),mcq("Was kostet WLAN im Hotel?",["5 Euro pro Tag","10 Euro pro Tag","Kostenlos","2 Euro pro Stunde"],"Kostenlos","Der Text sagt: 'WLAN (kostenlos).'")],"A1_lesson_16"))

batch.append(make_ex("Weg zur Bibliothek","So finden Sie die Stadtbibliothek:\n\nSie sind am Hauptbahnhof. Gehen Sie geradeaus bis zur Kreuzung. Biegen Sie links in die Bahnhofstrasse. Gehen Sie 200 Meter geradeaus. Die Bibliothek ist auf der rechten Seite, neben dem Cafe.\n\nOeffnungszeiten:\nMontag - Freitag: 10:00 - 19:00 Uhr\nSamstag: 10:00 - 14:00 Uhr\nSonntag: geschlossen",[tf("Die Bibliothek ist neben einem Cafe.","true","Der Text sagt: 'Die Bibliothek ist auf der rechten Seite, neben dem Cafe.'"),mcq("In welche Strasse biegen Sie ein?",["Hauptstrasse","Bahnhofstrasse","Marktstrasse","Schulstrasse"],"Bahnhofstrasse","Der Text sagt: 'Biegen Sie links in die Bahnhofstrasse.'"),tf("Die Bibliothek hat sonntags geoeffnet.","false","Der Text sagt: 'Sonntag: geschlossen.'")],"A1_lesson_17"))

batch.append(make_ex("Ihr Termin bei Dr. Klein","Sehr geehrter Herr Braun,\n\nIhr Termin bei Dr. Klein wurde bestaetigt.\n\nDatum: Donnerstag, 22. Mai\nUhrzeit: 14:45 Uhr\nAdresse: Goethestraffe 45, 80336 Muenchen\n\nBitte kommen Sie 10 Minuten frueher. Bringen Sie Ihre Versicherungskarte und Ihren Terminpass mit. Die Sprechstunde kostet nichts.\n\nBei Verhinderung bitte 24 Stunden vorher absagen.\n\nMit freundlichen Gruessen,\nIhre Praxis Dr. Klein",[mcq("Wann ist der Termin?",["Am Dienstag","Am Mittwoch","Am Donnerstag","Am Freitag"],"Am Donnerstag","Der Text sagt: 'Donnerstag, 22. Mai.'"),tf("Der Termin kostet 10 Euro.","false","Der Text sagt: 'Die Sprechstunde kostet nichts.'"),mcq("Bis wann soll Herr Braun absagen?",["12 Stunden vorher","24 Stunden vorher","48 Stunden vorher","Eine Woche vorher"],"24 Stunden vorher","Der Text sagt: '24 Stunden vorher absagen.'")],"A1_lesson_18"))

batch.append(make_ex("Anmeldebogen Praxis Dr. Klein","Praxis Dr. Klein - Anmeldebogen\n\nPatient: Klaus Weber\nGeburtsdatum: 15.03.1980\n\nBeschwerden (seit 3 Tagen):\n- Husten\n- Halsschmerzen\n- Leichtes Fieber (38,2 Grad)\n\nAllergien: Keine\nMedikamente: Keine\n\nBlutdruck: 130/85\nVersicherung: AOK",[mcq("Wie lange hat Klaus Weber die Beschwerden?",["Seit 1 Tag","Seit 2 Tagen","Seit 3 Tagen","Seit einer Woche"],"Seit 3 Tagen","Der Text sagt: 'Beschwerden (seit 3 Tagen).'"),tf("Klaus Weber hat Allergien.","false","Der Text sagt: 'Allergien: Keine.'"),mcq("Welche Versicherung hat Klaus Weber?",["TK","AOK","DAK","Barmer"],"AOK","Der Text sagt: 'Versicherung: AOK.'")],"A1_lesson_19"))

batch.append(make_ex("Fundbuero - Gefunden!","Fundbuero Berlin Hauptbahnhof\n\nGefunden am 10. Mai:\n- Eine schwarze Geldboerse mit 20 Euro und einer EC-Karte\n- Ein blauer Rucksack mit einem Buch und einem Heft\n- Ein silberner Schluesselbund\n\nDiese Gegenstaende koennen Sie im Fundbuero abholen (Raum 103, Erdgeschoss).\nOeffnungszeiten: 7:00 - 22:00 Uhr\nBitte bringen Sie Ihren Ausweis mit.",[mcq("Wo ist das Fundbuero?",["Im 1. Stock","Im Erdgeschoss","Im 2. Stock","Im Keller"],"Im Erdgeschoss","Der Text sagt: 'Raum 103, Erdgeschoss.'"),tf("In der Geldboerse ist eine EC-Karte.","true","Der Text sagt: 'Eine schwarze Geldboerse mit 20 Euro und einer EC-Karte.'"),tf("Das Fundbuero hat bis 20:00 Uhr geoeffnet.","false","Der Text sagt: 'Oeffnungszeiten: 7:00 - 22:00 Uhr.'")],"A1_lesson_20"))

batch.append(make_ex("Angebote diese Woche","Supermarkt GUENSTIG PREIS - Angebote gueltig bis Samstag\n\nWassermelone (Stueck): statt 3,49 Euro nur 1,99 Euro\nJoghurt (4er-Pack): statt 2,49 Euro nur 1,79 Euro\nHaehnchenbrust (500g): statt 5,99 Euro nur 4,49 Euro\nToilettenpapier (8 Rollen): statt 4,99 Euro nur 3,49 Euro\n\nOeffnungszeiten:\nMontag - Samstag: 7:00 - 21:00 Uhr\nSonntag: geschlossen",[mcq("Was kostet die Wassermelone im Angebot?",["1,79 Euro","1,99 Euro","2,49 Euro","3,49 Euro"],"1,99 Euro","Der Text sagt: 'Wassermelone: statt 3,49 Euro nur 1,99 Euro.'"),tf("Das Toilettenpapier kostet 3,49 Euro.","true","Der Text sagt: 'Toilettenpapier: statt 4,99 Euro nur 3,49 Euro.'"),tf("Der Supermarkt hat sonntags geoeffnet.","false","Der Text sagt: 'Sonntag: geschlossen.'")],"A1_lesson_21"))

batch.append(make_ex("Cafe Bluemchen","Herzlich willkommen im Cafe Bluemchen!\n\nWir haben frische Kuchen und Kaffee fuer Sie.\n\nUnsere Spezialitaeten:\n- Hausgemachter Apfelkuchen: 3,50 Euro\n- Cappuccino: 3,00 Euro\n- Heisse Schokolade: 2,80 Euro\n- Kaeskuchen: 3,80 Euro\n\nWLAN Passwort: cafe2025\n\nZahlung: Bar oder Karte\nBitte bezahlen Sie an der Kasse.",[mcq("Was kostet der Cappuccino?",["2,50 Euro","2,80 Euro","3,00 Euro","3,50 Euro"],"3,00 Euro","Der Text sagt: 'Cappuccino: 3,00 Euro.'"),tf("Man kann mit Karte bezahlen.","true","Der Text sagt: 'Zahlung: Bar oder Karte.'"),mcq("Was ist das WLAN Passwort?",["cafe2024","cafe2025","bluemchen","kaffee"],"cafe2025","Der Text sagt: 'WLAN Passwort: cafe2025.'")],"A1_lesson_22"))

batch.append(make_ex("Aushang in der Postfiliale","DEUTSCHE POST - Wichtige Informationen\n\nOeffnungszeiten:\nMontag - Freitag: 8:30 - 18:00 Uhr\nSamstag: 9:00 - 13:00 Uhr\n\nBriefporto (Inland):\n- Standardbrief (bis 20g): 0,85 Euro\n- Kompaktbrief (bis 50g): 1,00 Euro\n- Grossbrief (bis 500g): 1,80 Euro\n\nPaket (bis 2 kg): 5,99 Euro\nPaket (bis 5 kg): 7,49 Euro\nPaket (bis 10 kg): 9,99 Euro\n\nBitte beachten Sie: Ab 18:00 Uhr keine Paketannahme mehr.",[mcq("Was kostet ein Standardbrief?",["0,75 Euro","0,85 Euro","1,00 Euro","1,80 Euro"],"0,85 Euro","Der Text sagt: 'Standardbrief: 0,85 Euro.'"),tf("Die Post hat freitags bis 18:00 Uhr geoeffnet.","true","Der Text sagt: 'Montag - Freitag: 8:30 - 18:00 Uhr.'"),mcq("Bis zu welchem Gewicht kostet ein Paket 5,99 Euro?",["Bis 1 kg","Bis 2 kg","Bis 5 kg","Bis 10 kg"],"Bis 2 kg","Der Text sagt: 'Paket (bis 2 kg): 5,99 Euro.'")],"A1_lesson_23"))

batch.append(make_ex("Sportverein Fit und Gesund","Sportverein Fit und Gesund e.V.\n\nKursangebot fuer Mitglieder:\n\nMontag: Yoga (17:00 - 18:00 Uhr) - Raum 1\nDienstag: Schwimmen (18:00 - 19:30 Uhr) - Hallenbad\nMittwoch: Fussball (17:00 - 18:30 Uhr) - Sportplatz\nDonnerstag: Tanzen (19:00 - 20:00 Uhr) - Raum 2\nFreitag: Krafttraining (16:00 - 17:30 Uhr) - Fitnessraum\n\nMonatsbeitrag: 25 Euro\nProbetraining: Kostenlos (1 Woche)\n\nAdresse: Sportstrasse 10, 10115 Berlin",[tf("Yoga ist montags um 17:00 Uhr.","true","Der Text sagt: 'Montag: Yoga (17:00 - 18:00 Uhr).'"),mcq("Wie viel kostet der Monatsbeitrag?",["15 Euro","20 Euro","25 Euro","30 Euro"],"25 Euro","Der Text sagt: 'Monatsbeitrag: 25 Euro.'"),tf("Das Probetraining kostet 10 Euro.","false","Der Text sagt: 'Probetraining: Kostenlos (1 Woche).'")],"A1_lesson_24"))

batch.append(make_ex("Besuchszeiten Krankenhaus St. Josef","Krankenhaus St. Josef - Besucherinformationen\n\nBesuchszeiten:\nMontag bis Sonntag: 14:00 - 19:00 Uhr\n\nBitte beachten Sie:\n- Maximal 2 Besucher pro Patient gleichzeitig\n- Bitte desinfizieren Sie Ihre Haende am Eingang\n- Besuchen Sie keine anderen Patientenzimmer\n- Keine Blumen auf der Intensivstation\n- Kinder unter 12 Jahren nur mit Erwachsenen\n\nCafeteria: 8:00 - 20:00 Uhr (Erdgeschoss)\nParkplatz: 2 Euro pro Stunde",[tf("Die Besuchszeit ist von 14:00 bis 19:00 Uhr.","true","Der Text sagt: 'Besuchszeiten: 14:00 - 19:00 Uhr.'"),mcq("Wie viele Besucher duerfen gleichzeitig kommen?",["1","2","3","4"],"2","Der Text sagt: 'Maximal 2 Besucher pro Patient gleichzeitig.'"),mcq("Was muessen Besucher am Eingang machen?",["Anmelden","Die Haende desinfizieren","Einen Mundschutz anziehen","Bezahlen"],"Die Haende desinfizieren","Der Text sagt: 'Bitte desinfizieren Sie Ihre Haende am Eingang.'")],"A1_lesson_25"))

# Add and save
a1.extend(batch)
r['A1'] = a1
json.dump(r, open('src/data/reading.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

print("Added %d reading exercises. Total A1: %d" % (len(batch), len(a1)))
print("Range: A1_read_26 to A1_read_%d" % (nid-1))

# Validate
ids = set(); dupes = []
texts = set(); dup_texts = []
broken_lessons = []; missing_answers = []; missing_fields = []
required = ['id', 'title', 'text', 'questions', 'lessonId']

all_lesson_ids = set(x['id'] for x in json.load(open('src/data/germanLessons.json',encoding='utf-8')) if x.get('level')=='A1')

for v in a1:
    if v['id'] in ids: dupes.append(v['id'])
    ids.add(v['id'])
    txt = v.get('text', '').strip()
    if txt in texts: dup_texts.append(v['id'])
    texts.add(txt)
    for f in required:
        if f not in v or v[f] is None:
            missing_fields.append("%s missing %s" % (v['id'], f))
    lid = v.get('lessonId')
    if lid and lid not in all_lesson_ids:
        broken_lessons.append("%s: lessonId=%s not found" % (v['id'], lid))
    for q in v.get('questions', []):
        if 'answer' not in q or q['answer'] is None:
            missing_answers.append("%s question %s missing answer" % (v['id'], q.get('id','?')))

print()
print("Validation results:")
print("  Duplicate IDs: %d" % len(dupes))
print("  Duplicate texts: %d" % len(dup_texts))
print("  Broken lessonIds: %d" % len(broken_lessons))
print("  Questions missing answers: %d" % len(missing_answers))
print("  Missing required fields: %d" % len(missing_fields))
for m in missing_fields: print("    " + m)
for m in broken_lessons: print("    " + m)
for m in missing_answers: print("    " + m)

print()
print("All good!" if (len(dupes)+len(dup_texts)+len(broken_lessons)+len(missing_answers)+len(missing_fields))==0 else "Issues found above!")
