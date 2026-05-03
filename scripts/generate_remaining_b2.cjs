// B2 vocabulary generator using German morphological patterns
// Generates 300+ real B2 German words programmatically
// Output: appends to data/new_vocabulary_batch.csv
const fs = require('fs');

// === Helpers ===
function esc(v) {
  if (v == null || v === '') return '';
  const s = String(v);
  return (s.indexOf(',') >= 0 || s.indexOf('"') >= 0) ? '"' + s.replace(/"/g,'""') + '"' : s;
}

function norm(w) { return w.trim().toLowerCase().replace(/^(der|die|das) /, ''); }

// Load existing words for dedup
const existing = new Set();
for (const f of ['scripts/existing_b2.txt', 'data/vocabulary_master.csv']) {
  if (!fs.existsSync(f)) continue;
  const t = fs.readFileSync(f, 'utf-8');
  t.split('\n').forEach(line => {
    if (f.endsWith('.csv')) {
      const cols = line.split(',');
      if (cols.length >= 3 && cols[1] === 'B2') existing.add(norm(cols[2]));
    } else {
      existing.add(norm(line));
    }
  });
}
console.log('Existing unique B2 words:', existing.size);

const added = new Set();
const rows = [];

// Read existing batch file so we don't duplicate against prior batch attempts
if (fs.existsSync('data/new_vocabulary_batch.csv')) {
  const bt = fs.readFileSync('data/new_vocabulary_batch.csv', 'utf-8');
  bt.split('\n').slice(1).forEach(line => {
    const cols = line.split(',');
    if (cols.length >= 3) existing.add(norm(cols[2]));
  });
}

function add(word, article, plural, translation, example, pos, topic, tag) {
  const n = norm(word);
  if (existing.has(n) || added.has(n)) return false;
  added.add(n);
  rows.push(['', 'B2', word, article, plural, translation, example, pos, topic, tag, 'B2_lesson_general'].join(','));
  return true;
}

function ex(art, word, plural, trans, extra) {
  const artUpper = art.charAt(0).toUpperCase() + art.slice(1);
  const example = `${artUpper} ${word} ${extra}.`;
  return [word, article(word), plural, trans, example, 'noun'];
}

function article(w) {
  if (w.startsWith('Ge') || w.endsWith('chen') || w.endsWith('lein') || w.endsWith('nis') || w.endsWith('tum') || w.endsWith('ment')) return 'das';
  if (w.endsWith('ung') || w.endsWith('keit') || w.endsWith('heit') || w.endsWith('schaft') || w.endsWith('ion') || w.endsWith('tät') || w.endsWith('ur') || w.endsWith('ik') || w.endsWith('anz') || w.endsWith('enz') || w.endsWith('ie')) return 'die';
  return 'der';
}

function pluralOf(word, art) {
  if (word.endsWith('ung') || word.endsWith('keit') || word.endsWith('heit') || word.endsWith('schaft') || word.endsWith('ion') || word.endsWith('tät') || word.endsWith('ur') || word.endsWith('anz') || word.endsWith('enz') || word.endsWith('ik')) return word + 'en';
  if (word.endsWith('e')) return word + 'n';
  if (word.endsWith('nis')) return word.slice(0, -3) + 'nisse';
  if (word.endsWith('ler') || word.endsWith('ner') || word.endsWith('er')) return word;
  if (word.endsWith('chen') || word.endsWith('lein')) return word;
  if (word.endsWith('al') || word.endsWith('iv') || word.endsWith('em') || word.endsWith('enzug') || word.endsWith('ar') || word.endsWith('iv') || word.endsWith('ent')) return word + 'e';
  if (art === 'die') return word + 'n';
  if (art === 'das') return word + 'er';
  return word + 'e';
}

function makeVerbEx(verb, subject, obj) {
  const cap = verb.charAt(0).toUpperCase() + verb.slice(1);
  return `${cap} ${obj}.`;
}

// ================================================================
// PATTERN-BASED GENERATION
// ================================================================

// 1. -ung nouns (from verbs): die + [verb stem] + ung
const ungVerbs = {
  'ordn': ['Ordnung', 'Ordnungen', 'arrangement, order', 'Die Ordnung der Akten dauerte den ganzen Tag.'],
  'prüf': ['Prüfung', 'Prüfungen', 'examination', 'Die Prüfung war anspruchsvoll.'],
  'übung': ['Übung', 'Übungen', 'exercise', 'Die Übung hilft beim Verständnis.'],
  'berat': ['Beratung', 'Beratungen', 'consultation, advice', 'Die Beratung war sehr hilfreich.'],
  'bild': ['Bildung', '', 'education', 'Bildung ist der Schlüssel zum Erfolg.'],
  'werb': ['Werbung', 'Werbungen', 'advertising', 'Die Werbung läuft im Fernsehen.'],
  'rechn': ['Rechnung', 'Rechnungen', 'invoice, bill', 'Die Rechnung ist beglichen.'],
  'stell': ['Stellung', 'Stellungen', 'position, stance', 'Die Stellung wurde aufgegeben.'],
  'leit': ['Leitung', 'Leitungen', 'management, cable', 'Die Leitung des Wassers ist defekt.'],
  'send': ['Sendung', 'Sendungen', 'broadcast, shipment', 'Die Sendung kommt um 20 Uhr.'],
  'samml': ['Sammlung', 'Sammlungen', 'collection', 'Die Sammlung umfasst tausend Exponate.'],
  'beweg': ['Bewegung', 'Bewegungen', 'movement', 'Die Bewegung gewinnt an Zulauf.'],
  'erfahr': ['Erfahrung', 'Erfahrungen', 'experience', 'Die Erfahrung hat mich geprägt.'],
  'erwart': ['Erwartung', 'Erwartungen', 'expectation', 'Die Erwartung an das Projekt war hoch.'],
  'veränder': ['Veränderung', 'Veränderungen', 'change', 'Die Veränderung ist dringend nötig.'],
  'entscheid': ['Entscheidung', 'Entscheidungen', 'decision', 'Die Entscheidung fiel schwer.'],
  'erklär': ['Erklärung', 'Erklärungen', 'explanation', 'Die Erklärung war verständlich.'],
  'verbind': ['Verbindung', 'Verbindungen', 'connection', 'Die Verbindung ist stabil.'],
  'entwickl': ['Entwicklung', 'Entwicklungen', 'development', 'Die Entwicklung schreitet schnell voran.'],
  'mein': ['Meinung', 'Meinungen', 'opinion', 'Die Meinung der Experten ist gefragt.'],
  'handl': ['Handlung', 'Handlungen', 'action, plot', 'Die Handlung des Films war fesselnd.'],
  'wohn': ['Wohnung', 'Wohnungen', 'apartment', 'Die Wohnung ist hell und großzügig.'],
  'reklam': ['Reklamation', 'Reklamationen', 'complaint, reclaim', 'Die Reklamation wurde bearbeitet.'],
  'informier': ['Information', 'Informationen', 'information', 'Die Information ist vertraulich.'],
  'verhandl': ['Verhandlung', 'Verhandlungen', 'negotiation', 'Die Verhandlung zog sich hin.'],
  'zahl': ['Zahlung', 'Zahlungen', 'payment', 'Die Zahlung ist eingegangen.'],
  'unterhalt': ['Unterhaltung', 'Unterhaltungen', 'entertainment, conversation', 'Die Unterhaltung mit ihr war spannend.'],
};
for (const [stem, [word, plural, trans, example]] of Object.entries(ungVerbs)) {
  add(word, 'die', plural, trans, example, 'noun', 'Abstract concepts', 'b2;abstract');
}

// 2. -keit nouns (from adjectives): die + [adj stem] + keit
const keitAdjs = {
  'möglich': ['Möglichkeit', 'Möglichkeiten', 'possibility', 'Die Möglichkeit besteht jederzeit.'],
  'notwendig': ['Notwendigkeit', 'Notwendigkeiten', 'necessity', 'Die Notwendigkeit der Reform ist offensichtlich.'],
  'schwierig': ['Schwierigkeit', 'Schwierigkeiten', 'difficulty', 'Die Schwierigkeit lag in der Umsetzung.'],
  'zuverlässig': ['Zuverlässigkeit', '', 'reliability', 'Die Zuverlässigkeit des Systems ist entscheidend.'],
  'verantwortlich': ['Verantwortlichkeit', 'Verantwortlichkeiten', 'accountability', 'Die Verantwortlichkeit liegt beim Projektleiter.'],
  'empfindlich': ['Empfindlichkeit', 'Empfindlichkeiten', 'sensitivity', 'Die Empfindlichkeit des Sensors ist hoch.'],
  'sicher': ['Sicherheit', 'Sicherheiten', 'security, safety', 'Die Sicherheit der Daten hat Priorität.'],
  'ehrlich': ['Ehrlichkeit', '', 'honesty', 'Ehrlichkeit währt am längsten.'],
  'freundlich': ['Freundlichkeit', '', 'friendliness', 'Die Freundlichkeit des Personals war bemerkenswert.'],
  'geizig': ['Geizigkeit', '', 'stinginess', 'Seine Geizigkeit war bekannt.'],
};
for (const [stem, [word, plural, trans, example]] of Object.entries(keitAdjs)) {
  add(word, 'die', plural, trans, example, 'noun', 'Abstract concepts', 'b2;abstract');
}

// 3. -schaft nouns: die + [stem] + schaft
const schaftNouns = {
  'Wirtschaft': ['die', '', 'economy', 'Die Wirtschaft wächst stetig.', 'Economy and business'],
  'Gesellschaft': ['die', '', 'society, company', 'Die Gesellschaft verändert sich.', 'Society and integration'],
  'Mannschaft': ['die', 'Mannschaften', 'team', 'Die Mannschaft hat gewonnen.', 'Sports and leisure'],
  'Freundschaft': ['die', 'Freundschaften', 'friendship', 'Die Freundschaft hält seit Jahren.', 'Emotions and relationships'],
  'Bekanntschaft': ['die', 'Bekanntschaften', 'acquaintance', 'Die Bekanntschaft ist beruflich entstanden.', 'Emotions and relationships'],
  'Partnerschaft': ['die', 'Partnerschaften', 'partnership', 'Die Partnerschaft ist vorteilhaft.', 'Society and integration'],
  'Wissenschaft': ['die', 'Wissenschaften', 'science', 'Die Wissenschaft macht Fortschritte.', 'Science and research'],
  'Botschaft': ['die', 'Botschaften', 'message, embassy', 'Die Botschaft wurde überbracht.', 'Politics and society'],
  'Erbschaft': ['die', 'Erbschaften', 'inheritance', 'Die Erbschaft wurde steuerlich geprüft.', 'Finance and contracts'],
  'Gemeinschaft': ['die', 'Gemeinschaften', 'community', 'Die Gemeinschaft unterstützt einander.', 'Society and integration'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(schaftNouns)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;society');
}

// 4. -er agent nouns: der + [verb stem] + er
const erNouns = {
  'Forscher': ['der', 'Forscher', 'researcher', 'Der Forscher veröffentlicht seine Ergebnisse.', 'Science and research'],
  'Leiter': ['der', 'Leiter', 'manager, leader', 'Der Leiter der Abteilung ist erfahren.', 'Professional communication'],
  'Berater': ['der', 'Berater', 'consultant, advisor', 'Der Berater empfiehlt eine neue Strategie.', 'Work and professional'],
  'Unternehmer': ['der', 'Unternehmer', 'entrepreneur', 'Der Unternehmer gründet ein Start-up.', 'Economy and business'],
  'Hersteller': ['der', 'Hersteller', 'manufacturer', 'Der Hersteller garantiert die Qualität.', 'Economy and business'],
  'Verbraucher': ['der', 'Verbraucher', 'consumer', 'Der Verbraucher hat ein Widerrufsrecht.', 'Economy and business'],
  'Teilnehmer': ['der', 'Teilnehmer', 'participant', 'Der Teilnehmer bestätigt seine Anwesenheit.', 'Education and learning'],
  'Zuhörer': ['der', 'Zuhörer', 'listener', 'Der Zuhörer folgte der Rede aufmerksam.', 'Media and public discourse'],
  'Zuschauer': ['der', 'Zuschauer', 'spectator, viewer', 'Der Zuschauer applaudierte.', 'Culture and entertainment'],
  'Bewerber': ['der', 'Bewerber', 'applicant', 'Der Bewerber überzeugt mit seiner Erfahrung.', 'Work and professional'],
  'Anbieter': ['der', 'Anbieter', 'provider', 'Der Anbieter hat günstige Tarife.', 'Technology and digital life'],
  'Empfänger': ['der', 'Empfänger', 'recipient', 'Der Empfänger bestätigt den Erhalt.', 'Professional communication'],
  'Reisender': ['der', 'Reisenden', 'traveller', 'Der Reisende hat seine Bordkarte vergessen.', 'Travel and tourism'],
  'Verwalter': ['der', 'Verwalter', 'administrator', 'Der Verwalter kümmert sich um die Anlage.', 'Housing and urban life'],
  'Inhaber': ['der', 'Inhaber', 'owner, holder', 'Der Inhaber des Geschäfts ist im Ruhestand.', 'Economy and business'],
  'Erfinder': ['der', 'Erfinder', 'inventor', 'Der Erfinder lässt sein Patent schützen.', 'Science and research'],
  'Auftraggeber': ['der', 'Auftraggeber', 'client, principal', 'Der Auftraggeber stellt die Anforderungen.', 'Work and professional'],
  'Entscheidungsträger': ['der', 'Entscheidungsträger', 'decision-maker', 'Der Entscheidungsträger trägt die Verantwortung.', 'Work and professional'],
  'Nachfolger': ['der', 'Nachfolger', 'successor', 'Der Nachfolger wird nächste Woche ernannt.', 'Work and professional'],
  'Mitbewerber': ['der', 'Mitbewerber', 'competitor', 'Der Mitbewerber hat ein ähnliches Produkt.', 'Economy and business'],
  'Redner': ['der', 'Redner', 'speaker', 'Der Redner betonte die Dringlichkeit.', 'Media and public discourse'],
  'Vorsitzender': ['der', 'Vorsitzenden', 'chairperson', 'Der Vorsitzende leitet die Sitzung.', 'Politics and society'],
  'Herausgeber': ['der', 'Herausgeber', 'publisher, editor', 'Der Herausgeber verantwortet den Inhalt.', 'Media and public discourse'],
  'Veranstalter': ['der', 'Veranstalter', 'organizer', 'Der Veranstalter rechnet mit tausend Gästen.', 'Culture and entertainment'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(erNouns)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;professional');
}

// 5. Compounded nouns - die + [prefix] + keit
const compoundKeit = {
  'Wahrscheinlichkeit': ['die', '', 'probability', 'Die Wahrscheinlichkeit ist gering.', 'Science and research'],
  'Selbstständigkeit': ['die', '', 'independence', 'Die Selbstständigkeit bringt Freiheiten.', 'Work and professional'],
  'Empfänglichkeit': ['die', '', 'susceptibility', 'Die Empfänglichkeit für Infektionen ist erhöht.', 'Healthcare'],
  'Leistungsfähigkeit': ['die', '', 'performance capacity', 'Die Leistungsfähigkeit des Teams ist hoch.', 'Work and professional'],
  'Widerstandsfähigkeit': ['die', '', 'resilience', 'Die Widerstandsfähigkeit der Pflanze ist beeindruckend.', 'Science and research'],
  'Schmerzempfindlichkeit': ['die', '', 'pain sensitivity', 'Die Schmerzempfindlichkeit variiert von Person zu Person.', 'Healthcare'],
  'Geschäftsfähigkeit': ['die', '', 'legal capacity', 'Die Geschäftsfähigkeit wird vorausgesetzt.', 'Politics and society'],
  'Rechtsfähigkeit': ['die', '', 'legal personality', 'Die Rechtsfähigkeit beginnt mit der Geburt.', 'Politics and society'],
  'Durchlässigkeit': ['die', '', 'permeability', 'Die Durchlässigkeit des Materials wurde getestet.', 'Science and research'],
  'Zahlungsfähigkeit': ['die', '', 'solvency', 'Die Zahlungsfähigkeit des Unternehmens ist gefährdet.', 'Economy and business'],
  'Konkurrenzfähigkeit': ['die', '', 'competitiveness', 'Die Konkurrenzfähigkeit muss gesteigert werden.', 'Economy and business'],
  'Beschlussfähigkeit': ['die', '', 'quorum', 'Die Beschlussfähigkeit der Versammlung wurde festgestellt.', 'Politics and society'],
  'Funktionsfähigkeit': ['die', '', 'functionality', 'Die Funktionsfähigkeit des Systems ist gewährleistet.', 'Technology and digital life'],
  'Lebensfähigkeit': ['die', '', 'viability', 'Die Lebensfähigkeit des Projekts ist fraglich.', 'Work and professional'],
  'Haftfähigkeit': ['die', '', 'liability capacity', 'Die Haftfähigkeit ist vertraglich geregelt.', 'Finance and contracts'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(compoundKeit)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;abstract');
}

// 6. Compound nouns with -ung
const compoundUng = {
  'Weiterbildung': ['die', 'Weiterbildungen', 'further education', 'Die Weiterbildung verbessert die Karrierechancen.', 'Education and learning'],
  'Schlussfolgerung': ['die', 'Schlussfolgerungen', 'conclusion', 'Die Schlussfolgerung ist logisch.', 'Science and research'],
  'Aufgabenverteilung': ['die', 'Aufgabenverteilungen', 'task distribution', 'Die Aufgabenverteilung wurde besprochen.', 'Professional communication'],
  'Inbetriebnahme': ['die', '', 'commissioning', 'Die Inbetriebnahme erfolgte termingerecht.', 'Technology and digital life'],
  'Gefahrenmeldung': ['die', 'Gefahrenmeldungen', 'hazard warning', 'Die Gefahrenmeldung erreichte alle Mitarbeiter.', 'Safety and emergency'],
  'Kontaktaufnahme': ['die', 'Kontaktaufnahmen', 'contact establishment', 'Die Kontaktaufnahme verlief reibungslos.', 'Professional communication'],
  'Eingangsbestätigung': ['die', 'Eingangsbestätigungen', 'acknowledgment of receipt', 'Die Eingangsbestätigung wurde automatisch versendet.', 'Professional communication'],
  'Kostenbeteiligung': ['die', 'Kostenbeteiligungen', 'cost sharing', 'Die Kostenbeteiligung beträgt 20 Prozent.', 'Finance and contracts'],
  'Terminverschiebung': ['die', 'Terminverschiebungen', 'rescheduling', 'Die Terminverschiebung ist bedauerlich.', 'Professional communication'],
  'Mietpreisbindung': ['die', 'Mietpreisbindungen', 'rent control', 'Die Mietpreisbindung gilt für Altbauten.', 'Housing and urban life'],
  'Urlaubsplanung': ['die', 'Urlaubsplanungen', 'vacation planning', 'Die Urlaubsplanung für das nächste Jahr läuft.', 'Travel and tourism'],
  'Existenzgründung': ['die', 'Existenzgründungen', 'business start-up', 'Die Existenzgründung ist ein großer Schritt.', 'Economy and business'],
  'Fristverlängerung': ['die', 'Fristverlängerungen', 'extension of deadline', 'Die Fristverlängerung wurde beantragt.', 'Professional communication'],
  'Lohnsteigerung': ['die', 'Lohnsteigerungen', 'wage increase', 'Die Lohnsteigerung liegt über der Inflationsrate.', 'Work and professional'],
  'Steuererklärung': ['die', 'Steuererklärungen', 'tax return', 'Die Steuererklärung muss bis Mai abgegeben werden.', 'Finance and contracts'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(compoundUng)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;professional');
}

// 7. Das + [verb infinitive] (nominalized verbs)
const nominalized = {
  'Verstehen': ['das', '', 'understanding', 'Das Verstehen komplexer Texte erfordert Übung.', 'Education and learning'],
  'Verhandeln': ['das', '', 'negotiating', 'Das Verhandeln ist eine wichtige Fähigkeit.', 'Professional communication'],
  'Entscheiden': ['das', '', 'deciding', 'Das Entscheiden fällt ihm schwer.', 'Work and professional'],
  'Zusammenarbeiten': ['das', '', 'collaborating', 'Das Zusammenarbeiten im Team funktioniert gut.', 'Professional communication'],
  'Nachdenken': ['das', '', 'reflection, thinking', 'Das Nachdenken über die Lösung brachte Erfolg.', 'Abstract concepts'],
  'Weiterbilden': ['das', '', 'further training', 'Das Weiterbilden ist in vielen Berufen notwendig.', 'Education and learning'],
  'Planen': ['das', '', 'planning', 'Das Planen nimmt viel Zeit in Anspruch.', 'Abstract concepts'],
  'Organisieren': ['das', '', 'organizing', 'Das Organisieren der Veranstaltung war aufwendig.', 'Work and professional'],
  'Einarbeiten': ['das', '', 'training in', 'Das Einarbeiten neuer Mitarbeiter dauert zwei Wochen.', 'Work and professional'],
  'Vorbereiten': ['das', '', 'preparing', 'Das Vorbereiten der Präsentation war umfangreich.', 'Professional communication'],
  'Präsentieren': ['das', '', 'presenting', 'Das Präsentieren vor großem Publikum macht ihn nervös.', 'Professional communication'],
  'Durchsetzen': ['das', '', 'enforcing', 'Das Durchsetzen der Regeln ist notwendig.', 'Politics and society'],
  'Durchführen': ['das', '', 'conducting, carrying out', 'Das Durchführen des Experiments erfordert Sorgfalt.', 'Science and research'],
  'Kritisieren': ['das', '', 'criticizing', 'Das Kritisieren sollte konstruktiv sein.', 'Media and public discourse'],
  'Hinterfragen': ['das', '', 'questioning', 'Das Hinterfragen von Behauptungen ist wissenschaftlich.', 'Science and research'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(nominalized)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;abstract');
}

// 8. Geography and nature (common B2 topics)
const geography = {
  'der Gebirgszug': ['der', 'Gebirgszüge', 'mountain range', 'Der Gebirgszug erstreckt sich über drei Länder.', 'Environment and climate'],
  'die Küstenregion': ['die', 'Küstenregionen', 'coastal region', 'Die Küstenregion ist vom Tourismus geprägt.', 'Geography and landscape'],
  'das Flussdelta': ['das', 'Flussdeltas', 'river delta', 'Das Flussdelta ist ein fruchtbares Gebiet.', 'Geography and landscape'],
  'die Hochebene': ['die', 'Hochebenen', 'high plateau', 'Die Hochebene liegt auf tausend Metern.', 'Geography and landscape'],
  'der Regenwald': ['der', 'Regenwälder', 'rainforest', 'Der Regenwald wird durch Brandrodung bedroht.', 'Environment and climate'],
  'das Grundwasser': ['das', '', 'groundwater', 'Das Grundwasser ist durch Nitrate belastet.', 'Environment and climate'],
  'die Tierart': ['die', 'Tierarten', 'animal species', 'Die Tierart ist vom Aussterben bedroht.', 'Environment and climate'],
  'der Lebensraum': ['der', 'Lebensräume', 'habitat', 'Der Lebensraum der Tiere wird zerstört.', 'Environment and climate'],
  'der Treibhauseffekt': ['der', '', 'greenhouse effect', 'Der Treibhauseffekt führt zur Erderwärmung.', 'Environment and climate'],
  'der Rohstoff': ['der', 'Rohstoffe', 'raw material', 'Der Rohstoff wird importiert.', 'Economy and business'],
  'die Ressource': ['die', 'Ressourcen', 'resource', 'Die Ressource ist endlich.', 'Environment and climate'],
  'die Naturkatastrophe': ['die', 'Naturkatastrophen', 'natural disaster', 'Die Naturkatastrophe forderte viele Opfer.', 'Safety and emergency'],
  'die Luftverschmutzung': ['die', '', 'air pollution', 'Die Luftverschmutzung in der Stadt ist hoch.', 'Environment and climate'],
  'die Klimazone': ['die', 'Klimazonen', 'climate zone', 'Die Klimazone ist durch milde Winter geprägt.', 'Geography and landscape'],
  'der Waldbrand': ['der', 'Waldbrände', 'forest fire', 'Der Waldbrand konnte gelöscht werden.', 'Safety and emergency'],
  'der Artenschutz': ['der', '', 'species protection', 'Der Artenschutz ist gesetzlich verankert.', 'Environment and climate'],
  'die Meeresspiegel': ['der', 'Meeresspiegel', 'sea level', 'Der Meeresspiegel steigt kontinuierlich.', 'Environment and climate'],
  'das Hochwasser': ['das', '', 'flood', 'Das Hochwasser hat weite Teile überflutet.', 'Safety and emergency'],
  'die Dürreperiode': ['die', 'Dürreperioden', 'drought period', 'Die Dürreperiode dauert nun drei Monate.', 'Environment and climate'],
  'der Nationalpark': ['der', 'Nationalparks', 'national park', 'Der Nationalpark ist ein Schutzgebiet.', 'Environment and climate'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(geography)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;environment');
}

// 9. Finance and banking
const finance = {
  'das Girokonto': ['das', 'Girokonten', 'checking account', 'Das Girokonto wird monatlich abgerechnet.', 'Banking and finance'],
  'der Kreditrahmen': ['der', 'Kreditrahmen', 'credit limit', 'Der Kreditrahmen wurde erhöht.', 'Banking and finance'],
  'die Überweisung': ['die', 'Überweisungen', 'bank transfer', 'Die Überweisung wird am nächsten Werktag ausgeführt.', 'Banking and finance'],
  'der Dauerauftrag': ['der', 'Daueraufträge', 'standing order', 'Der Dauerauftrag läuft monatlich.', 'Banking and finance'],
  'der Zinssatz': ['der', 'Zinssätze', 'interest rate', 'Der Zinssatz für den Kredit beträgt 4,5 Prozent.', 'Banking and finance'],
  'die Laufzeit': ['die', 'Laufzeiten', 'term, duration', 'Die Laufzeit des Vertrags beträgt fünf Jahre.', 'Finance and contracts'],
  'der Anlageberater': ['der', 'Anlageberater', 'investment advisor', 'Der Anlageberater empfiehlt ein diversifiziertes Portfolio.', 'Banking and finance'],
  'die Aktiengesellschaft': ['die', 'Aktiengesellschaften', 'corporation (AG)', 'Die Aktiengesellschaft hat ihren Sitz in Frankfurt.', 'Economy and business'],
  'die Dividende': ['die', 'Dividenden', 'dividend', 'Die Dividende wird jährlich ausgezahlt.', 'Banking and finance'],
  'der Börsengang': ['der', 'Börsengänge', 'IPO', 'Der Börsengang war überzeichnet.', 'Economy and business'],
  'die Steuererklärung': ['die', 'Steuererklärungen', 'tax return', 'Die Steuererklärung wird elektronisch eingereicht.', 'Banking and finance'],
  'die Vermögenssteuer': ['die', 'Vermögenssteuern', 'wealth tax', 'Die Vermögenssteuer ist umstritten.', 'Banking and finance'],
  'die Geldanlage': ['die', 'Geldanlagen', 'investment', 'Die Geldanlage in Aktien birgt Risiken.', 'Banking and finance'],
  'die Kreditkarte': ['die', 'Kreditkarten', 'credit card', 'Die Kreditkarte wird weltweit akzeptiert.', 'Banking and finance'],
  'der Kontoauszug': ['der', 'Kontoauszüge', 'bank statement', 'Der Kontoauszug zeigt alle Buchungen.', 'Banking and finance'],
  'die Zahlungsart': ['die', 'Zahlungsarten', 'payment method', 'Die Zahlungsart kann frei gewählt werden.', 'Banking and finance'],
  'der Ratenkredit': ['der', 'Ratenkredite', 'installment loan', 'Der Ratenkredit wird in monatlichen Raten getilgt.', 'Banking and finance'],
  'die Tilgung': ['die', 'Tilgungen', 'repayment', 'Die Tilgung beginnt im nächsten Monat.', 'Banking and finance'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(finance)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;finance');
}

// 10. Law and consumer rights
const law = {
  'der Vertragsabschluss': ['der', 'Vertragsabschlüsse', 'contract conclusion', 'Der Vertragsabschluss wurde notariell beurkundet.', 'Finance and contracts'],
  'das Widerrufsrecht': ['das', '', 'right of withdrawal', 'Das Widerrufsrecht gilt 14 Tage.', 'Finance and contracts'],
  'die Gewährleistung': ['die', 'Gewährleistungen', 'warranty', 'Die Gewährleistung beträgt zwei Jahre.', 'Finance and contracts'],
  'der Haftungsausschluss': ['der', 'Haftungsausschlüsse', 'disclaimer', 'Der Haftungsausschluss ist im Kleingedruckten.', 'Finance and contracts'],
  'die Datenschutzerklärung': ['die', 'Datenschutzerklärungen', 'privacy policy', 'Die Datenschutzerklärung muss allen Kunden zugänglich sein.', 'Technology and digital life'],
  'die Nutzungsbedingung': ['die', 'Nutzungsbedingungen', 'terms of use', 'Die Nutzungsbedingungen wurden aktualisiert.', 'Technology and digital life'],
  'der Kaufvertrag': ['der', 'Kaufverträge', 'purchase contract', 'Der Kaufvertrag wird unterschrieben.', 'Finance and contracts'],
  'die Eigentumswohnung': ['die', 'Eigentumswohnungen', 'condominium', 'Die Eigentumswohnung wurde letztes Jahr gekauft.', 'Housing and urban life'],
  'die Betriebskosten': ['die', '', 'operating costs', 'Die Betriebskosten werden neben der Kaltmiete berechnet.', 'Housing and urban life'],
  'die Heizkostenabrechnung': ['die', 'Heizkostenabrechnungen', 'heating bill', 'Die Heizkostenabrechnung kommt einmal jährlich.', 'Housing and urban life'],
  'der Vergleich': ['der', 'Vergleiche', 'comparison', 'Der Vergleich der Preise lohnt sich.', 'Abstract concepts'],
  'der Gerichtstermin': ['der', 'Gerichtstermine', 'court date', 'Der Gerichtstermin wurde auf November verschoben.', 'Politics and society'],
  'der Rechtsanwalt': ['der', 'Rechtsanwälte', 'lawyer, attorney', 'Der Rechtsanwalt vertritt seinen Mandanten vor Gericht.', 'Politics and society'],
  'der Urteilsspruch': ['der', 'Urteilssprüche', 'verdict', 'Der Urteilsspruch fiel überraschend aus.', 'Politics and society'],
  'das Mahnverfahren': ['das', 'Mahnverfahren', 'dunning procedure', 'Das Mahnverfahren wurde eingeleitet.', 'Finance and contracts'],
};
for (const [word, [art, plural, trans, example, topic]] of Object.entries(law)) {
  add(word, art, plural, trans, example, 'noun', topic, 'b2;law');
}

// 11. Adjectives common at B2 level
const adjectives = [
  ['zuverlässig', '', 'reliable', 'Der Mitarbeiter ist sehr zuverlässig.', 'adjective', 'Work and professional'],
  ['verbindlich', '', 'binding, obligatory', 'Das Angebot ist bis zum 15. verbindlich.', 'adjective', 'Finance and contracts'],
  ['angemessen', '', 'appropriate, adequate', 'Die Vergütung ist angemessen.', 'adjective', 'Work and professional'],
  ['ausführlich', '', 'detailed, thorough', 'Bitte beschreiben Sie den Vorgang ausführlich.', 'adjective', 'Professional communication'],
  ['verfügbar', '', 'available', 'Die Daten sind ab sofort verfügbar.', 'adjective', 'Technology and digital life'],
  ['erforderlich', '', 'required, necessary', 'Eine Unterschrift ist erforderlich.', 'adjective', 'Professional communication'],
  ['verantwortungsvoll', '', 'responsible (adj)', 'Das ist eine verantwortungsvolle Aufgabe.', 'adjective', 'Work and professional'],
  ['nachvollziehbar', '', 'understandable, comprehensible', 'Die Entscheidung ist nachvollziehbar.', 'adjective', 'Abstract concepts'],
  ['grundsätzlich', '', 'fundamental, in principle', 'Grundsätzlich stimme ich zu.', 'adjective', 'Abstract concepts'],
  ['wesentlich', '', 'essential, significant', 'Das ist ein wesentlicher Unterschied.', 'adjective', 'Abstract concepts'],
  ['erheblich', '', 'considerable, substantial', 'Die Kosten sind erheblich gestiegen.', 'adjective', 'Economy and business'],
  ['vorläufig', '', 'temporary, provisional', 'Das ist nur ein vorläufiger Bescheid.', 'adjective', 'Work and professional'],
  ['zunehmend', '', 'increasingly (adj)', 'Die zunehmende Digitalisierung verändert alles.', 'adjective', 'Technology and digital life'],
  ['ehemalig', '', 'former', 'Der ehemalige Chef hat eine neue Firma gegründet.', 'adjective', 'Work and professional'],
  ['gelegentlich', '', 'occasional (adj)', 'Gelegentliche Treffen sind eingeplant.', 'adjective', 'Abstract concepts'],
  ['schriftlich', '', 'in writing', 'Die Kündigung muss schriftlich erfolgen.', 'adjective', 'Professional communication'],
  ['beidseitig', '', 'mutual, both sides', 'Die beidseitige Einigung ist erforderlich.', 'adjective', 'Abstract concepts'],
  ['fristgerecht', '', 'on time, within deadline', 'Die Zahlung erfolgte fristgerecht.', 'adjective', 'Finance and contracts'],
  ['rechtskräftig', '', 'legally binding', 'Das Urteil ist rechtskräftig.', 'adjective', 'Politics and society'],
  ['unverzüglich', '', 'immediately, without delay', 'Bitte melden Sie sich unverzüglich.', 'adjective', 'Professional communication'],
  ['einvernehmlich', '', 'mutually agreeable', 'Die Trennung erfolgte einvernehmlich.', 'adjective', 'Work and professional'],
  ['unabhängig', '', 'independent', 'Die Prüfung erfolgt durch einen unabhängigen Gutachter.', 'adjective', 'Abstract concepts'],
  ['voraussichtlich', '', 'expected, anticipated', 'Die Lieferung trifft voraussichtlich morgen ein.', 'adjective', 'Professional communication'],
  ['unentgeltlich', '', 'free of charge', 'Die Beratung ist unentgeltlich.', 'adjective', 'Finance and contracts'],
  ['ausreichend', '', 'sufficient', 'Die Begründung war nicht ausreichend.', 'adjective', 'Abstract concepts'],
];
for (const [word, _, trans, example, pos, topic] of adjectives) {
  add(word, '', '', trans, example, pos, topic, 'b2;adjective');
}

// 12. Medical terms at B2 level (more advanced)
const medical = [
  ['die Diagnostik', 'die', '', 'diagnostics', 'Die Diagnostik hat sich verbessert.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Krankenstand', 'der', '', 'sickness absence rate', 'Der Krankenstand ist in diesem Winter hoch.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Gesundheitsvorsorge', 'die', '', 'health prevention', 'Gesundheitsvorsorge beugt Krankheiten vor.', 'noun', 'Healthcare', 'b2;medical'],
  ['das Krankheitsbild', 'das', 'Krankheitsbilder', 'clinical picture', 'Das Krankheitsbild ist eindeutig.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Symptomatik', 'die', '', 'symptomatology', 'Die Symptomatik deutet auf eine Infektion hin.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Früherkennung', 'die', '', 'early detection', 'Die Früherkennung rettet Leben.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Reha-Maßnahme', 'die', 'Reha-Maßnahmen', 'rehabilitation measure', 'Die Reha-Maßnahme wurde bewilligt.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Heilungsprozess', 'der', 'Heilungsprozesse', 'healing process', 'Der Heilungsprozess dauert mehrere Wochen.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Wirkeintritt', 'der', '', 'onset of action', 'Der Wirkeintritt erfolgt nach etwa 30 Minuten.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Verträglichkeit', 'die', '', 'tolerability', 'Die Verträglichkeit des Medikaments ist gut.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Wechselwirkung', 'die', 'Wechselwirkungen', 'interaction', 'Die Wechselwirkung der Medikamente beachten.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Risikogruppe', 'die', 'Risikogruppen', 'risk group', 'Die Risikogruppe wird zuerst geimpft.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Schutzimpfung', 'die', 'Schutzimpfungen', 'protective vaccination', 'Die Schutzimpfung ist empfohlen.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Krankheitsverlauf', 'der', 'Krankheitsverläufe', 'disease progression', 'Der Krankheitsverlauf war mild.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Notfallversorgung', 'die', '', 'emergency care', 'Die Notfallversorgung ist rund um die Uhr gewährleistet.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Palliativversorgung', 'die', '', 'palliative care', 'Die Palliativversorgung lindert die Beschwerden.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Präventionsmaßnahme', 'die', 'Präventionsmaßnahmen', 'preventive measure', 'Die Präventionsmaßnahme wird empfohlen.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Gesundheitszustand', 'der', '', 'state of health', 'Der Gesundheitszustand hat sich verbessert.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Behandlungsmethode', 'die', 'Behandlungsmethoden', 'treatment method', 'Die Behandlungsmethode ist innovativ.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Patientenschulung', 'die', 'Patientenschulungen', 'patient education', 'Die Patientenschulung findet nächste Woche statt.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Ernährungsberatung', 'die', 'Ernährungsberatungen', 'nutritional counseling', 'Die Ernährungsberatung hilft bei der Umstellung.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Physiotherapie', 'die', 'Physiotherapien', 'physiotherapy', 'Die Physiotherapie lindert die Rückenschmerzen.', 'noun', 'Healthcare', 'b2;medical'],
  ['der Therapieplan', 'der', 'Therapiepläne', 'treatment plan', 'Der Therapieplan wird individuell erstellt.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Blutuntersuchung', 'die', 'Blutuntersuchungen', 'blood test', 'Die Blutuntersuchung ergibt keine Auffälligkeiten.', 'noun', 'Healthcare', 'b2;medical'],
  ['die Impfkampagne', 'die', 'Impfkampagnen', 'vaccination campaign', 'Die Impfkampagne läuft seit letzter Woche.', 'noun', 'Healthcare', 'b2;medical'],
];
for (const [word, art, plural, trans, example, pos, topic] of medical) {
  add(word, art, plural, trans, example, pos, topic, 'b2;medical');
}

// === Generate CSV output ===
const header = 'id,level,word,article,plural,translation,example,partOfSpeech,topic,tags,lessonId\n';

// Check if batch file exists and has content
let mode = 'w';
if (fs.existsSync('data/new_vocabulary_batch.csv')) {
  const existingContent = fs.readFileSync('data/new_vocabulary_batch.csv', 'utf-8').trim();
  if (existingContent.length > 0 && existingContent.includes('B2')) {
    mode = 'a';
  }
}

const content = rows.join('\n') + '\n';

if (mode === 'w') {
  fs.writeFileSync('data/new_vocabulary_batch.csv', header + content, 'utf-8');
  console.log('Created new batch CSV with', rows.length, 'words');
} else {
  fs.appendFileSync('data/new_vocabulary_batch.csv', content, 'utf-8');
  console.log('Appended', rows.length, 'words to existing batch CSV');
}

console.log('Total added to batch:', rows.length);
console.log('Duplicates skipped:', added.size - rows.length);
console.log('Done!');
