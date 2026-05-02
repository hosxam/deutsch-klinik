import json, re

with open('../src/data/germanVocabulary.json', encoding='utf-8') as f:
    v = json.load(f)

def clean_word(w):
    return re.sub(r'^(der|die|das)\s+', '', w).strip()

def normalize(low):
    return low.replace('ü', 'ue').replace('ö', 'oe').replace('ä', 'ae').replace('ß', 'ss')

def wl(item):
    return normalize(clean_word(item.get('word', '')).lower())

all_missing = [item for lvl in v for item in v[lvl]
               if item.get('partOfSpeech') == 'noun'
               and not (item.get('plural') or '').strip()]

decisions = {}

def setp(id_val, value, reason):
    decisions[id_val] = (value, reason)

# 1. Pluraletantum
p_set = set(['eltern', 'geschwister', 'nachrichten', 'leute', 'ferien', 'kosten',
             'masern', 'pocken', 'daten', 'nebenkosten',
             'kopfschmerzen', 'halsschmerzen', 'rueckenschmerzen',
             'kenntnisse', 'bedenken',
             'leberwerte', 'nierenretentionsparameter'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'pluraletantum')

# 2. Proper place names
p_set = set(['deutschland', 'frankreich', 'italien', 'spanien', 'oesterreich', 'schweiz',
             'europa', 'amerika', 'asien', 'afrika', 'australien', 'england', 'tuerkei'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'place_name')

# 3. Language names
p_set = set(['deutsch', 'englisch', 'franzoesisch', 'spanisch', 'italienisch',
             'russisch', 'chinesisch', 'japanisch', 'arabisch', 'tuerkisch',
             'polnisch', 'portugiesisch', 'niederlaendisch', 'schwedisch',
             'griechisch', 'latein'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'language_name')

# 4. Time units
p_set = set(['januar', 'februar', 'maerz', 'april', 'mai', 'juni', 'juli', 'august',
             'september', 'oktober', 'november', 'dezember',
             'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag',
             'fruehling', 'sommer', 'herbst', 'winter'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'time_unit')

# 5. Meals
for item in all_missing:
    if wl(item) in set(['fruehstueck', 'mittagessen', 'abendessen']):
        setp(item['id'], None, 'meal_name')

# 6. Mass nouns
p_set = set(['wasser', 'milch', 'brot', 'butter', 'kaese', 'fleisch', 'obst', 'gemuese',
             'reis', 'salz', 'zucker', 'honig', 'mehl', 'oel', 'luft', 'regen', 'schnee',
             'wind', 'feuer', 'eis', 'gold', 'silber', 'holz', 'glas', 'papier', 'plastik',
             'muell', 'schmutz', 'staub', 'dreck', 'kaffee', 'sport', 'post', 'internet',
             'sonnenschein', 'glaube', 'durst', 'laerm'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'mass_noun')

# 7. Medical uncountables
p_set = set(['fieber', 'husten', 'schnupfen', 'blut', 'blutdruck', 'urin', 'schleim', 'schweiss',
             'durchfall', 'reha', 'osteoporose', 'sepsis', 'arthrose',
             'hygienemanagement', 'risikomanagement', 'fehlermanagement',
             'beschwerdemanagement', 'komplikationsmanagement',
             'sturzprophylaxe', 'rezidivprophylaxe',
             'schockraumversorgung', 'blutzuckereinstellung',
             'postoperative ueberwachung', 'sekundaerheilung',
             'alltag', 'hirndruck', 'multiple sklerose', 'parkinson-syndrom',
             'burnout-syndrom', 'staging', 'medikamentenmonitoring',
             'qualitaetsmanagement'])
for item in all_missing:
    if wl(item) in p_set:
        setp(item['id'], None, 'medical_uncountable')

# 8. Abstract suffix nouns
abstract_suffixes = ['ion', 'itaet', 'heit', 'keit', 'schaft', 'tum', 'nis', 'ung', 'ik', 'ie']
for item in all_missing:
    if item['id'] in decisions:
        continue
    low = wl(item)
    for s in abstract_suffixes:
        if low.endswith(s) and len(low) > len(s) + 1:
            setp(item['id'], None, f'abstract_suffix_{s}')
            break

# 9. Abstract uncountable concepts
abstract_items = [
    'geld', 'verkehr', 'stress', 'unterricht', 'fortschritt', 'hilfe',
    'frieden', 'liebe', 'hass', 'glueck', 'mut', 'geduld', 'zeit', 'arbeit',
    'energie', 'waerme', 'kaelte', 'wetter',
    'wohlstand', 'wohlbefinden',
    'selbstbewusstsein', 'selbstvertrauen',
    'mitgefuehl', 'mitleid', 'vertrauen', 'respekt',
    'umweltschutz', 'naturschutz', 'datenschutz', 'versicherungsschutz',
    'vorsorge', 'nachsorge', 'eifersucht', 'ruecksicht', 'neugier',
    'trauer', 'zusammenhalt', 'familienstand', 'auslaenderanteil',
    'freiwilligenarbeit', 'zusammenarbeit', 'hausrat',
    'co2-ausstoss', 'zahlungsverkehr',
    'konjunktur', 'nachfrage', 'vertrieb', 'teilnahme',
    'lebensstandard', 'wohnungsmarkt', 'wohnungssuche',
    'nahverkehr', 'berufsverkehr', 'durchschnitt',
    'marketing', 'service', 'versand', 'schutz', 'wuerde', 'toleranz', 'bewusstsein',
    'mode', 'aussehen', 'geschmack', 'fitness',
    'relevanz', 'signifikanz', 'kausalitaet', 'tragweite', 'validitaet', 'reliabilitaet',
    'datenlage', 'studienlage',
    'sterbehilfe', 'schweigepflicht', 'dokumentationspflicht',
    'aufklaerungsbedarf', 'handlungsbedarf',
    'kontaktaufnahme', 'anbau', 'knochenaufbau',
    'gesundheitswesen', 'immunsystem',
    'bewegungstraining', 'gangschule',
    'gelenkverschleiss', 'schichtdienst', 'patientenwohl', 'patientenwille',
    'herzinsuffizienz', 'niereninsuffizienz',
    'mundpflege', 'symptomkontrolle', 'therapieadhaerenz', 'lebensqualitaet',
    'literatur', 'architektur', 'wasserkraft', 'erdwaerme',
    'natur', 'umwelt', 'erde',
    'gepaeck', 'zoll', 'buergergeld', 'bonitaet',
    'muellabfuhr', 'reichweite',
    'ernaehrung', 'erholung', 'erziehung', 'kindheit', 'sicherheit',
    'biotechnologie', 'umweltverschmutzung', 'erderwaermung',
    'arbeitslosigkeit', 'einsamkeit', 'begeisterung',
    'berichterstattung', 'herstellung',
    'lebenserwartung', 'tierhaltung', 'lagerung', 'bewirtung',
    'gastronomie', 'logistik', 'gerechtigkeit',
    'windenergie', 'landwirtschaft',
    'aufgabenverteilung',
    'qualitaetssicherung', 'patientensicherheit',
    'einwilligung', 'selbstbestimmung', 'entscheidungsfindung',
    'wundheilung', 'bildgebung', 'informationsvermittlung',
    'risikokommunikation', 'risikoaufklaerung',
    'frueherkennung', 'muskelkraeftigung',
    'drg-kodierung', 'therapiemotivation',
    'psychopharmakotherapie', 'echokardiographie',
    'verhaltenstherapie', 'ergotherapie', 'physiotherapie',
    'hypertonie', 'polypharmazie', 'patientenautonomie', 'autonomie',
    'symptomatik', 'differentialdiagnostik', 'stufendiagnostik',
    'anamnesetechnik', 'gentechnik',
    'belastbarkeit', 'gebrechlichkeit', 'vertraeglichkeit', 'dringlichkeit',
    'reproduzierbarkeit', 'einwilligungsfaehigkeit', 'einwilligungsunfaehigkeit',
    'immunsuppression', 'praevention', 'kuration',
    'versorgungsforschung', 'leistungserbringung',
    'regelversorgung', 'patientenversorgung',
    'palliativversorgung', 'sterbebegleitung',
    'tumornachsorge',
    'fruehstueck', 'muell', 'durst', 'laerm', 'co2-ausstoss',
    'mitgefuehl', 'ruecksicht', 'gepaeck', 'buergergeld', 'bonitaet',
    'erste hilfe', 'auslaenderanteil',
    'wuerde', 'fuersorgepflicht',
    'hippokratische eid',
    'neurologische status',
    'gelenkverschleiss', 'aufklaerungsbedarf',
    'aerztliche schweigepflicht', 'interdisziplinaere zusammenarbeit',
    'odds ratio', 'ekt', 'restitutio ad integrum',
]
abstract_set = set()
for vv in abstract_items:
    abstract_set.add(vv)

for item in all_missing:
    if item['id'] in decisions:
        continue
    if wl(item) in abstract_set:
        setp(item['id'], None, 'abstract_uncountable')

# 10. Zero plural (-er, -el, -en, -chen, -lein)
for item in all_missing:
    if item['id'] in decisions:
        continue
    w = clean_word(item.get('word', ''))
    art = item.get('article', '').lower()
    if (art == 'der' or art == 'das') and w.endswith('er'):
        setp(item['id'], w, 'zero_plural_er')
    elif (art == 'der' or art == 'das') and w.endswith('el'):
        setp(item['id'], w, 'zero_plural_el')
    elif art == 'der' and w.endswith('en'):
        setp(item['id'], w, 'zero_plural_en')
    elif w.endswith('chen') or w.endswith('lein'):
        setp(item['id'], w, 'zero_plural_diminutive')
    elif art == 'das' and w == 'Gebirge':
        setp(item['id'], w, 'zero_plural_e')

# 11. Specific countable nouns needing actual plural forms
plural_map = {
    'Sonne': 'Sonnen',
    'Rettungsdienst': 'Rettungsdienste',
    'Strom': 'Stroeme',
    'Verhalten': 'Verhalten',
    'Ausschluss': 'Ausschuesse',
    'p-Wert': 'p-Werte',
}
for item in all_missing:
    if item['id'] in decisions:
        continue
    w = clean_word(item.get('word', ''))
    if w in plural_map:
        setp(item['id'], plural_map[w], 'needs_plural')

# Now apply changes
changes_by_level = {lvl: 0 for lvl in v}
changes_total = 0

for lvl in v:
    for item in v[lvl]:
        if item['id'] in decisions:
            val, reason = decisions[item['id']]
            old = item.get('plural', '')
            if val is None:
                item['plural'] = None
            else:
                item['plural'] = val
            changes_by_level[lvl] += 1
            changes_total += 1

# Write
with open('../src/data/germanVocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(v, f, ensure_ascii=False, indent=2)

# Print summary
categories = {}
for item in all_missing:
    reason = decisions[item['id']][1]
    categories.setdefault(reason, 0)
    categories[reason] += 1

print(f'Total nouns without plural: {len(all_missing)}')
print(f'Changes applied: {changes_total}')
print(f'Changes by level: {json.dumps(changes_by_level)}')
print(f'\nCategorization:')
for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
    print(f'  {cat}: {count}')

# Count nouns with plural:null
null_plurals = 0
actual_plurals = 0
for item in all_missing:
    val = decisions[item['id']][0]
    if val is None:
        null_plurals += 1
    else:
        actual_plurals += 1
print(f'\nplural: null: {null_plurals}')
print(f'actual plural forms: {actual_plurals}')
print(f'TOTAL missing filled: {null_plurals + actual_plurals}')

# Verify no noun remains with empty plural
remaining = 0
for lvl in v:
    for item in v[lvl]:
        if item.get('partOfSpeech') == 'noun' and not (item.get('plural') or ''):
            remaining += 1
            print(f'  STILL MISSING: {lvl} | {item["id"]} | {item.get("word","")}')
print(f'\nNouns still missing plural after fix: {remaining}')

if remaining == 0:
    print('ALL CLEAN: Every noun has a plural field.')
else:
    print('WARNING: Some nouns still missing plurals.')
