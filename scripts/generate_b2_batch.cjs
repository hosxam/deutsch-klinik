const fs = require('fs');

const existingTxt = fs.readFileSync('scripts/existing_b2.txt', 'utf-8');
const existingWords = new Set(existingTxt.split('\n').map(w => w.trim().toLowerCase().replace(/^(der |die |das )/, '')).filter(w => w));
const batchAdded = new Set();

function normalizeWord(word) {
  return word.trim().toLowerCase().replace(/^(der |die |das )/, '');
}

function esc(v) {
  if (v == null || v === '') return '';
  const s = String(v);
  return (s.indexOf(',') >= 0 || s.indexOf('"') >= 0) ? '"' + s.replace(/"/g,'""') + '"' : s;
}

function add(a,p,pl,tr,ex,pos,top,tag) {
  const w = normalizeWord(a);
  if (existingWords.has(w) || batchAdded.has(w)) return null;
  batchAdded.add(w);
  return ['','B2',a,p||'',pl||'',tr,ex,pos,top,tag,'B2_lesson_general'];
}

const allRows = [];
function batch(arr) { for (const e of arr) { const r = add(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7]); if (r) allRows.push(r); } }

// ==== 20 topics, 25 words each = 500 total ====

// 1. Professional Communication
batch([
['die Besprechung','die','die Besprechungen','meeting','Die Besprechung findet morgen statt.','noun','Professional communication','b2;professional'],
['der Vorschlag','der','die Vorschläge','suggestion','Der Vorschlag wurde angenommen.','noun','Professional communication','b2;professional'],
['die Präsentation','die','die Präsentationen','presentation','Die Präsentation war überzeugend.','noun','Professional communication','b2;professional'],
['die Zusammenarbeit','die','','cooperation','Die Zusammenarbeit funktioniert gut.','noun','Professional communication','b2;professional'],
['die Verhandlung','die','die Verhandlungen','negotiation','Die Verhandlung dauerte Stunden.','noun','Professional communication','b2;professional'],
['die Bescheinigung','die','die Bescheinigungen','certificate','Die Bescheinigung wurde ausgestellt.','noun','Professional communication','b2;professional'],
['der Vermerk','der','die Vermerke','memo','Der Vermerk wurde verteilt.','noun','Professional communication','b2;professional'],
['die Richtlinie','die','die Richtlinien','guideline','Die Richtlinie ist zu beachten.','noun','Professional communication','b2;professional'],
['die Weisung','die','die Weisungen','instruction','Die Weisung ist bindend.','noun','Professional communication','b2;professional'],
['die Rückmeldung','die','die Rückmeldungen','feedback','Ich warte auf Rückmeldung.','noun','Professional communication','b2;professional'],
['die Beschwerde','die','die Beschwerden','complaint','Die Beschwerde wurde bearbeitet.','noun','Professional communication','b2;professional'],
['die Unterschrift','die','die Unterschriften','signature','Die Unterschrift fehlt noch.','noun','Professional communication','b2;professional'],
['die Vorlage','die','die Vorlagen','template','Die Vorlage ist fertig.','noun','Professional communication','b2;professional'],
['die Mitteilung','die','die Mitteilungen','notification','Die Mitteilung kam per Mail.','noun','Professional communication','b2;professional'],
['der Anhang','der','die Anhänge','attachment','Der Anhang enthält die Datei.','noun','Professional communication','b2;professional'],
['die Absage','die','die Absagen','rejection','Die Absage kam heute.','noun','Professional communication','b2;professional'],
['die Zusage','die','die Zusagen','acceptance','Die Zusage ist da.','noun','Professional communication','b2;professional'],
['die Anfrage','die','die Anfragen','inquiry','Die Anfrage wurde beantwortet.','noun','Professional communication','b2;professional'],
['das Angebot','das','die Angebote','offer','Das Angebot ist gültig.','noun','Professional communication','b2;professional'],
['die Aufforderung','die','die Aufforderungen','request','Die Aufforderung kam per Post.','noun','Professional communication','b2;professional'],
['die Ablehnung','die','die Ablehnungen','refusal','Die Ablehnung wurde begründet.','noun','Professional communication','b2;professional'],
['die Stellungnahme','die','die Stellungnahmen','statement','Die Stellungnahme ist fällig.','noun','Professional communication','b2;professional'],
['die Zuständigkeit','die','die Zuständigkeiten','responsibility','Die Zuständigkeit liegt bei mir.','noun','Professional communication','b2;professional'],
['der Verteiler','der','die Verteiler','distribution list','Der Verteiler ist aktuell.','noun','Professional communication','b2;professional'],
['die Beauftragung','die','die Beauftragungen','assignment','Die Beauftragung erfolgte schriftlich.','noun','Professional communication','b2;professional'],
]);

// 2. Work and Professional Life
batch([
['die Gehaltserhöhung','die','die Gehaltserhöhungen','salary increase','Die Gehaltserhöhung wurde beantragt.','noun','Work and professional','b2;work'],
['die Arbeitsumgebung','die','die Arbeitsumgebungen','work environment','Die Arbeitsumgebung verbessert sich.','noun','Work and professional','b2;work'],
['der Arbeitgeber','der','die Arbeitgeber','employer','Der Arbeitgeber zahlt gut.','noun','Work and professional','b2;work'],
['der Arbeitnehmer','der','die Arbeitnehmer','employee','Der Arbeitnehmer hat Rechte.','noun','Work and professional','b2;work'],
['die Betriebsvereinbarung','die','die Betriebsvereinbarungen','works agreement','Die Vereinbarung regelt die Pausen.','noun','Work and professional','b2;work'],
['das Vorstellungsgespräch','das','die Vorstellungsgespräche','job interview','Das Gespräch verlief positiv.','noun','Work and professional','b2;work'],
['die Stellenausschreibung','die','die Stellenausschreibungen','job posting','Die Ausschreibung ist online.','noun','Work and professional','b2;work'],
['der Lebenslauf','der','die Lebensläufe','CV','Der Lebenslauf ist aktuell.','noun','Work and professional','b2;work'],
['das Anschreiben','das','die Anschreiben','cover letter','Das Anschreiben ist wichtig.','noun','Work and professional','b2;work'],
['die Probezeit','die','die Probezeiten','probation period','Die Probezeit dauert sechs Monate.','noun','Work and professional','b2;work'],
['die Befristung','die','die Befristungen','fixed term','Die Befristung ist zulässig.','noun','Work and professional','b2;work'],
['das Gehalt','das','die Gehälter','salary','Das Gehalt wird überwiesen.','noun','Work and professional','b2;work'],
['die Überstunde','die','die Überstunden','overtime','Überstunden werden vergütet.','noun','Work and professional','b2;work'],
['der Arbeitsschutz','der','','occupational safety','Der Arbeitsschutz hat Priorität.','noun','Work and professional','b2;work'],
['die Gewerkschaft','die','die Gewerkschaften','trade union','Die Gewerkschaft verhandelt.','noun','Work and professional','b2;work'],
['der Tarifvertrag','der','die Tarifverträge','collective agreement','Der Tarifvertrag gilt für alle.','noun','Work and professional','b2;work'],
['die Sozialleistung','die','die Sozialleistungen','social benefit','Sozialleistungen sind wichtig.','noun','Work and professional','b2;work'],
['der Ausbildungsplatz','der','die Ausbildungsplätze','training position','Der Platz ist noch frei.','noun','Work and professional','b2;work'],
['die Personalabteilung','die','die Personalabteilungen','HR department','Die Personalabteilung hilft.','noun','Work and professional','b2;work'],
['die Einstellung','die','die Einstellungen','hiring','Die Einstellung ist geplant.','noun','Work and professional','b2;work'],
['die Entlassung','die','die Entlassungen','dismissal','Die Entlassung war betriebsbedingt.','noun','Work and professional','b2;work'],
['die Kündigungsfrist','die','die Kündigungsfristen','notice period','Die Frist beträgt drei Monate.','noun','Work and professional','b2;work'],
['das Arbeitszeugnis','das','die Arbeitszeugnisse','reference letter','Das Zeugnis ist sehr gut.','noun','Work and professional','b2;work'],
['die Bewerbung','die','die Bewerbungen','application','Die Bewerbung ist vollständig.','noun','Work and professional','b2;work'],
['die Kündigung','die','die Kündigungen','termination','Die Kündigung muss schriftlich sein.','noun','Work and professional','b2;work'],
]);

// 3. Technology and Digital Life
batch([
['die Verschlüsselung','die','die Verschlüsselungen','encryption','Die Verschlüsselung schützt Daten.','noun','Technology and digital life','b2;tech'],
['die Schnittstelle','die','die Schnittstellen','interface','Die Schnittstelle verbindet Systeme.','noun','Technology and digital life','b2;tech'],
['die Programmiersprache','die','die Programmiersprachen','programming language','Python ist eine Programmiersprache.','noun','Technology and digital life','b2;tech'],
['die Anwendung','die','die Anwendungen','application','Die Anwendung läuft stabil.','noun','Technology and digital life','b2;tech'],
['die Firewall','die','die Firewalls','firewall','Die Firewall blockiert Angriffe.','noun','Technology and digital life','b2;tech'],
['der Speicherplatz','der','die Speicherplätze','storage space','Der Speicherplatz reicht nicht.','noun','Technology and digital life','b2;tech'],
['die Aktualisierung','die','die Aktualisierungen','update','Die Aktualisierung ist fertig.','noun','Technology and digital life','b2;tech'],
['das Passwort','das','die Passwörter','password','Das Passwort wurde geändert.','noun','Technology and digital life','b2;tech'],
['der Benutzername','der','die Benutzernamen','username','Der Name ist bereits vergeben.','noun','Technology and digital life','b2;tech'],
['die Suchmaschine','die','die Suchmaschinen','search engine','Google ist eine Suchmaschine.','noun','Technology and digital life','b2;tech'],
['die Datenbank','die','die Datenbanken','database','Die Datenbank ist aktualisiert.','noun','Technology and digital life','b2;tech'],
['das Betriebssystem','das','die Betriebssysteme','operating system','Windows ist ein Betriebssystem.','noun','Technology and digital life','b2;tech'],
['die Fehlermeldung','die','die Fehlermeldungen','error message','Die Meldung erscheint beim Start.','noun','Technology and digital life','b2;tech'],
['die Installation','die','die Installationen','installation','Die Installation ist einfach.','noun','Technology and digital life','b2;tech'],
['das Netzwerk','das','die Netzwerke','network','Das Netzwerk ist schnell.','noun','Technology and digital life','b2;tech'],
['die Authentifizierung','die','die Authentifizierungen','authentication','Die Authentifizierung ist erforderlich.','noun','Technology and digital life','b2;tech'],
['der Algorithmus','der','die Algorithmen','algorithm','Der Algorithmus ist effizient.','noun','Technology and digital life','b2;tech'],
['die Cloud','die','','cloud','Die Daten sind in der Cloud.','noun','Technology and digital life','b2;tech'],
['die Sicherheitslücke','die','die Sicherheitslücken','security gap','Die Lücke wurde geschlossen.','noun','Technology and digital life','b2;tech'],
['der Datenschutz','der','','data protection','Datenschutz ist wichtig.','noun','Technology and digital life','b2;tech'],
['die Softwarelizenz','die','die Softwarelizenzen','software license','Die Lizenz ist abgelaufen.','noun','Technology and digital life','b2;tech'],
['die Tastatur','die','die Tastaturen','keyboard','Die Tastatur ist kabellos.','noun','Technology and digital life','b2;tech'],
['der Bildschirm','der','die Bildschirme','screen','Der Bildschirm ist groß.','noun','Technology and digital life','b2;tech'],
['der Browser','der','die Browser','browser','Der Browser ist aktuell.','noun','Technology and digital life','b2;tech'],
['die E-Mail-Adresse','die','die E-Mail-Adressen','email address','Bitte geben Sie Ihre Adresse an.','noun','Technology and digital life','b2;tech'],
]);

// 4. Healthcare
batch([
['die Diagnose','die','die Diagnosen','diagnosis','Die Diagnose wurde bestätigt.','noun','Healthcare','b2;medical'],
['die Behandlung','die','die Behandlungen','treatment','Die Behandlung beginnt bald.','noun','Healthcare','b2;medical'],
['der Blutdruck','der','','blood pressure','Der Blutdruck ist normal.','noun','Healthcare','b2;medical'],
['die Blutprobe','die','die Blutproben','blood sample','Die Probe wird untersucht.','noun','Healthcare','b2;medical'],
['die Impfung','die','die Impfungen','vaccination','Die Impfung schützt.','noun','Healthcare','b2;medical'],
['die Operation','die','die Operationen','surgery','Die OP war erfolgreich.','noun','Healthcare','b2;medical'],
['die Untersuchung','die','die Untersuchungen','examination','Die Untersuchung dauert 30 Minuten.','noun','Healthcare','b2;medical'],
['der Facharzt','der','die Fachärzte','specialist','Der Facharzt wurde überwiesen.','noun','Healthcare','b2;medical'],
['das Rezept','das','die Rezepte','prescription','Das Rezept ist ausgestellt.','noun','Healthcare','b2;medical'],
['die Krankenakte','die','die Krankenakten','medical record','Die Akte ist vertraulich.','noun','Healthcare','b2;medical'],
['die Wunde','die','die Wunden','wound','Die Wunde heilt gut.','noun','Healthcare','b2;medical'],
['die Vorsorge','die','','preventive care','Vorsorge ist wichtig.','noun','Healthcare','b2;medical'],
['die Therapie','die','die Therapien','therapy','Die Therapie hilft.','noun','Healthcare','b2;medical'],
['stationär','','','inpatient','Der Patient wird stationär aufgenommen.','adjective','Healthcare','b2;medical'],
['ambulant','','','outpatient','Die Behandlung ist ambulant.','adjective','Healthcare','b2;medical'],
['die Nachsorge','die','','aftercare','Nachsorge ist nötig.','noun','Healthcare','b2;medical'],
['der Impfstoff','der','die Impfstoffe','vaccine','Der Impfstoff ist verfügbar.','noun','Healthcare','b2;medical'],
['der Befund','der','die Befunde','finding','Der Befund liegt vor.','noun','Healthcare','b2;medical'],
['die Nebenwirkung','die','die Nebenwirkungen','side effect','Nebenwirkungen sind selten.','noun','Healthcare','b2;medical'],
['chronisch','','','chronic','Die Erkrankung ist chronisch.','adjective','Healthcare','b2;medical'],
['die Überweisung','die','die Überweisungen','referral','Die Überweisung ist ausgestellt.','noun','Healthcare','b2;medical'],
['die Krankheit','die','die Krankheiten','illness','Die Krankheit heilt aus.','noun','Healthcare','b2;medical'],
['der Arzttermin','der','die Arzttermine','appointment','Der Termin ist um zehn.','noun','Healthcare','b2;medical'],
['die Vorsorgeuntersuchung','die','die Vorsorgeuntersuchungen','preventive check-up','Die Untersuchung ist jährlich.','noun','Healthcare','b2;medical'],
['die Notaufnahme','die','die Notaufnahmen','emergency room','Die Notaufnahme ist voll.','noun','Healthcare','b2;medical'],
]);

// 5. Environment and Climate
batch([
['die Umweltverschmutzung','die','','pollution','Die Verschmutzung nimmt zu.','noun','Environment and climate','b2;environment'],
['der Klimawandel','der','','climate change','Der Klimawandel ist real.','noun','Environment and climate','b2;environment'],
['die Erderwärmung','die','','global warming','Die Erderwärmung schreitet voran.','noun','Environment and climate','b2;environment'],
['die Nachhaltigkeit','die','','sustainability','Nachhaltigkeit ist wichtig.','noun','Environment and climate','b2;environment'],
['die Solarenergie','die','','solar energy','Solarenergie ist sauber.','noun','Environment and climate','b2;environment'],
['die Windkraft','die','','wind power','Windkraft erzeugt Strom.','noun','Environment and climate','b2;environment'],
['das Ökosystem','das','die Ökosysteme','ecosystem','Das Ökosystem ist bedroht.','noun','Environment and climate','b2;environment'],
['die Artenvielfalt','die','','biodiversity','Die Artenvielfalt nimmt ab.','noun','Environment and climate','b2;environment'],
['der Treibhauseffekt','der','','greenhouse effect','Der Effekt wird verstärkt.','noun','Environment and climate','b2;environment'],
['die Mülltrennung','die','','waste separation','Mülltrennung ist Pflicht.','noun','Environment and climate','b2;environment'],
['der Recyclinghof','der','die Recyclinghöfe','recycling center','Der Hof nimmt Elektroschrott an.','noun','Environment and climate','b2;environment'],
['die Luftverschmutzung','die','','air pollution','Die Luft ist verschmutzt.','noun','Environment and climate','b2;environment'],
['die Abgase','die','','exhaust fumes','Abgase belasten die Luft.','noun','Environment and climate','b2;environment'],
['der Umweltschutz','der','','environmental protection','Umweltschutz ist wichtig.','noun','Environment and climate','b2;environment'],
['ressourcenschonend','','','resource-efficient','Das Verfahren ist ressourcenschonend.','adjective','Environment and climate','b2;environment'],
['der CO2-Ausstoß','der','','CO2 emissions','Der Ausstoß muss sinken.','noun','Environment and climate','b2;environment'],
['ökologisch','','','ecological','Ökologische Landwirtschaft ist besser.','adjective','Environment and climate','b2;environment'],
['die Kläranlage','die','die Kläranlagen','sewage plant','Die Anlage reinigt das Wasser.','noun','Environment and climate','b2;environment'],
['emissionsfrei','','','emission-free','Das Auto fährt emissionsfrei.','adjective','Environment and climate','b2;environment'],
['der Artenschutz','der','','species protection','Artenschutz ist nötig.','noun','Environment and climate','b2;environment'],
['die Umweltpolitik','die','','environmental policy','Die Politik wurde kritisiert.','noun','Environment and climate','b2;environment'],
['der Klimaschutz','der','','climate protection','Klimaschutz geht uns alle an.','noun','Environment and climate','b2;environment'],
['die Müllvermeidung','die','','waste prevention','Müllvermeidung ist am besten.','noun','Environment and climate','b2;environment'],
['die Umweltbelastung','die','','environmental burden','Die Belastung ist zu hoch.','noun','Environment and climate','b2;environment'],
['die Erneuerbare Energie','die','','renewable energy','Erneuerbare sind die Zukunft.','noun','Environment and climate','b2;environment'],
]);

// 6. Law and Consumer Rights
batch([
['das Gericht','das','die Gerichte','court','Das Gericht entscheidet.','noun','Law and consumer rights','b2;law'],
['das Urteil','das','die Urteile','verdict','Das Urteil ist gefallen.','noun','Law and consumer rights','b2;law'],
['der Kläger','der','die Kläger','plaintiff','Der Kläger fordert Schadenersatz.','noun','Law and consumer rights','b2;law'],
['die Klage','die','die Klagen','lawsuit','Die Klage wurde eingereicht.','noun','Law and consumer rights','b2;law'],
['der Vertragsbruch','der','die Vertragsbrüche','breach of contract','Der Bruch hatte Folgen.','noun','Law and consumer rights','b2;law'],
['das Grundgesetz','das','','Basic Law','Das Grundgesetz schützt Rechte.','noun','Law and consumer rights','b2;law'],
['die Verfassung','die','die Verfassungen','constitution','Die Verfassung garantiert Freiheit.','noun','Law and consumer rights','b2;law'],
['die Verordnung','die','die Verordnungen','regulation','Die Verordnung trat in Kraft.','noun','Law and consumer rights','b2;law'],
['die Gewährleistung','die','','warranty','Die Garantie gilt zwei Jahre.','noun','Law and consumer rights','b2;law'],
['das Widerrufsrecht','das','','right of withdrawal','Das Recht gilt 14 Tage.','noun','Law and consumer rights','b2;law'],
['die Rechnung','die','die Rechnungen','invoice','Die Rechnung ist bezahlt.','noun','Law and consumer rights','b2;law'],
['der Kaufvertrag','der','die Kaufverträge','purchase contract','Der Vertrag ist unterschrieben.','noun','Law and consumer rights','b2;law'],
['die Mietkaution','die','die Mietkautionen','security deposit','Die Kaution wird zurückgezahlt.','noun','Law and consumer rights','b2;law'],
['rechtlich','','','legal','Rechtlich ist das in Ordnung.','adjective','Law and consumer rights','b2;law'],
['anfechten','','','to contest','Er ficht die Entscheidung an.','verb','Law and consumer rights','b2;law'],
['verklagen','','','to sue','Er verklagt die Firma.','verb','Law and consumer rights','b2;law'],
['die Straftat','die','die Straftaten','criminal offense','Die Tat wurde gemeldet.','noun','Law and consumer rights','b2;law'],
['die Ermittlung','die','die Ermittlungen','investigation','Die Ermittlungen laufen.','noun','Law and consumer rights','b2;law'],
['der Tatverdächtige','der','die Tatverdächtigen','suspect','Der Verdächtige wurde befragt.','noun','Law and consumer rights','b2;law'],
['der Rechtsanwalt','der','die Rechtsanwälte','lawyer','Der Anwalt berät mich.','noun','Law and consumer rights','b2;law'],
['der Vertrag','der','die Verträge','contract','Der Vertrag läuft aus.','noun','Law and consumer rights','b2;law'],
['die Schadensersatzforderung','die','die Schadensersatzforderungen','damages claim','Die Forderung beträgt 5000 Euro.','noun','Law and consumer rights','b2;law'],
['die Ordnungswidrigkeit','die','die Ordnungswidrigkeiten','administrative offense','Die Ordnungswidrigkeit wird bestraft.','noun','Law and consumer rights','b2;law'],
['die Fahrerlaubnis','die','die Fahrerlaubnisse','driving license','Die Fahrerlaubnis wurde entzogen.','noun','Law and consumer rights','b2;law'],
['die Durchsetzung','die','','enforcement','Die Durchsetzung erfolgt vor Gericht.','noun','Law and consumer rights','b2;law'],
]);

// 7. Economy and Business
batch([
['der Aktienkurs','der','die Aktienkurse','stock price','Der Kurs ist gestiegen.','noun','Economy and business','b2;economy'],
['die Inflation','die','','inflation','Die Inflation steigt.','noun','Economy and business','b2;economy'],
['der Zinssatz','der','die Zinssätze','interest rate','Der Satz beträgt drei Prozent.','noun','Economy and business','b2;economy'],
['die Investition','die','die Investitionen','investment','Die Investition lohnt sich.','noun','Economy and business','b2;economy'],
['der Gewinn','der','die Gewinne','profit','Der Gewinn stieg.','noun','Economy and business','b2;economy'],
['der Verlust','der','die Verluste','loss','Der Verlust ist hoch.','noun','Economy and business','b2;economy'],
['die Bilanz','die','die Bilanzen','balance sheet','Die Bilanz ist positiv.','noun','Economy and business','b2;economy'],
['der Umsatz','der','die Umsätze','revenue','Der Umsatz wuchs.','noun','Economy and business','b2;economy'],
['die Dividende','die','die Dividenden','dividend','Die Dividende wird ausgezahlt.','noun','Economy and business','b2;economy'],
['der Finanzmarkt','der','die Finanzmärkte','financial market','Der Markt reagiert.','noun','Economy and business','b2;economy'],
['die Währung','die','die Währungen','currency','Der Euro ist die Währung.','noun','Economy and business','b2;economy'],
['der Wechselkurs','der','die Wechselkurse','exchange rate','Der Kurs schwankt.','noun','Economy and business','b2;economy'],
['die Subvention','die','die Subventionen','subsidy','Die Subvention wurde bewilligt.','noun','Economy and business','b2;economy'],
['der Marktanteil','der','die Marktanteile','market share','Der Anteil beträgt 25 Prozent.','noun','Economy and business','b2;economy'],
['die Wettbewerbsfähigkeit','die','','competitiveness','Die Fähigkeit muss gestärkt werden.','noun','Economy and business','b2;economy'],
['die Globalisierung','die','','globalization','Die Globalisierung schreitet voran.','noun','Economy and business','b2;economy'],
['der Auftrag','der','die Aufträge','order','Der Auftrag wurde geliefert.','noun','Economy and business','b2;economy'],
['der Unternehmer','der','die Unternehmer','entrepreneur','Der Unternehmer gründete eine Firma.','noun','Economy and business','b2;economy'],
['das Eigenkapital','das','','equity capital','Das Kapital beträgt eine Million.','noun','Economy and business','b2;economy'],
['die Konjunktur','die','','economic cycle','Die Konjunktur erholt sich.','noun','Economy and business','b2;economy'],
['die Steuererklärung','die','die Steuererklärungen','tax return','Die Erklärung muss abgegeben werden.','noun','Economy and business','b2;economy'],
['die Aktie','die','die Aktien','stock','Die Aktie fällt.','noun','Economy and business','b2;economy'],
['der Börsengang','der','die Börsengänge','IPO','Der Gang an die Börse war erfolgreich.','noun','Economy and business','b2;economy'],
['die Lieferkette','die','die Lieferketten','supply chain','Die Kette wurde unterbrochen.','noun','Economy and business','b2;economy'],
['das Bruttoinlandsprodukt','das','','GDP','Das BIP ist gestiegen.','noun','Economy and business','b2;economy'],
]);

// 8. Education and Learning
batch([
['die Vorlesung','die','die Vorlesungen','lecture','Die Vorlesung beginnt.','noun','Education and learning','b2;education'],
['das Seminar','das','die Seminare','seminar','Das Seminar findet donnerstags statt.','noun','Education and learning','b2;education'],
['die Prüfung','die','die Prüfungen','exam','Die Prüfung ist schwer.','noun','Education and learning','b2;education'],
['der Studiengang','der','die Studiengänge','degree program','Der Studiengang dauert sechs Semester.','noun','Education and learning','b2;education'],
['die Abschlussarbeit','die','die Abschlussarbeiten','thesis','Die Arbeit wird benotet.','noun','Education and learning','b2;education'],
['der Dozent','der','die Dozenten','lecturer','Der Dozent erklärt den Stoff.','noun','Education and learning','b2;education'],
['die Einschreibung','die','die Einschreibungen','enrollment','Die Einschreibung beginnt im August.','noun','Education and learning','b2;education'],
['das Stipendium','das','die Stipendien','scholarship','Das Stipendium deckt die Kosten.','noun','Education and learning','b2;education'],
['die Forschung','die','','research','Die Forschung wird gefördert.','noun','Education and learning','b2;education'],
['die Studiengebühr','die','die Studiengebühren','tuition fee','Die Gebühren sind hoch.','noun','Education and learning','b2;education'],
['das Praktikum','das','die Praktika','internship','Das Praktikum dauert drei Monate.','noun','Education and learning','b2;education'],
['das Auslandssemester','das','die Auslandssemester','semester abroad','Das Semester war toll.','noun','Education and learning','b2;education'],
['die Studienordnung','die','die Studienordnungen','study regulations','Die Ordnung regelt den Ablauf.','noun','Education and learning','b2;education'],
['die Prüfungsordnung','die','die Prüfungsordnungen','exam regulations','Die Ordnung ist online.','noun','Education and learning','b2;education'],
['die Immatrikulation','die','','matriculation','Die Immatrikulation ist erfolgt.','noun','Education and learning','b2;education'],
['das Studienfach','das','die Studienfächer','subject','Mein Fach ist Medizin.','noun','Education and learning','b2;education'],
['die Hausarbeit','die','die Hausarbeiten','term paper','Die Arbeit ist abgegeben.','noun','Education and learning','b2;education'],
['das Tutorium','das','die Tutorien','tutorial','Das Tutorium hilft beim Lernen.','noun','Education and learning','b2;education'],
['die Bibliothek','die','die Bibliotheken','library','Die Bibliothek hat viele Bücher.','noun','Education and learning','b2;education'],
['der Semesterbeitrag','der','die Semesterbeiträge','semester fee','Der Beitrag ist fällig.','noun','Education and learning','b2;education'],
['die Voraussetzung','die','die Voraussetzungen','prerequisite','Die Voraussetzung ist erfüllt.','noun','Education and learning','b2;education'],
['die Note','die','die Noten','grade','Die Note ist gut.','noun','Education and learning','b2;education'],
['die Leistungsbewertung','die','die Leistungsbewertungen','performance assessment','Die Bewertung ist fair.','noun','Education and learning','b2;education'],
['die Exmatrikulation','die','','exmatriculation','Die Exmatrikulation erfolgt zum Semesterende.','noun','Education and learning','b2;education'],
['das Semesterticket','das','die Semestertickets','transit pass','Das Ticket gilt im ganzen Land.','noun','Education and learning','b2;education'],
]);

// 9. Media and Communication
batch([
['die Berichterstattung','die','','reporting','Die Berichterstattung ist ausgewogen.','noun','Media and communication','b2;media'],
['der Journalist','der','die Journalisten','journalist','Der Journalist recherchiert.','noun','Media and communication','b2;media'],
['die Schlagzeile','die','die Schlagzeilen','headline','Die Schlagzeile ist reißerisch.','noun','Media and communication','b2;media'],
['die Pressemitteilung','die','die Pressemitteilungen','press release','Die Mitteilung wurde veröffentlicht.','noun','Media and communication','b2;media'],
['die Nachrichtenquelle','die','die Nachrichtenquellen','news source','Die Quelle ist vertrauenswürdig.','noun','Media and communication','b2;media'],
['der Sender','der','die Sender','broadcaster','Der Sender zeigt die Nachrichten.','noun','Media and communication','b2;media'],
['die Reportage','die','die Reportagen','report','Die Reportage war interessant.','noun','Media and communication','b2;media'],
['das Interview','das','die Interviews','interview','Das Interview wurde aufgezeichnet.','noun','Media and communication','b2;media'],
['die Auflage','die','die Auflagen','circulation','Die Auflage sinkt.','noun','Media and communication','b2;media'],
['der Chefredakteur','der','die Chefredakteure','editor-in-chief','Der Chefredakteur entscheidet.','noun','Media and communication','b2;media'],
['die Öffentlichkeit','die','','public','Die Öffentlichkeit wurde informiert.','noun','Media and communication','b2;media'],
['die Einschaltquote','die','die Einschaltquoten','ratings','Die Quote ist hoch.','noun','Media and communication','b2;media'],
['das Medium','das','die Medien','medium','Das Medium berichtet objektiv.','noun','Media and communication','b2;media'],
['die Redaktion','die','die Redaktionen','editorial team','Die Redaktion arbeitet rund um die Uhr.','noun','Media and communication','b2;media'],
['die Zeitschrift','die','die Zeitschriften','magazine','Die Zeitschrift erscheint monatlich.','noun','Media and communication','b2;media'],
['die Tageszeitung','die','die Tageszeitungen','daily newspaper','Die Zeitung kommt jeden Morgen.','noun','Media and communication','b2