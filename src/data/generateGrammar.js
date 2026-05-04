// Script to generate grammarCurriculum.json with all CEFR levels
const fs = require('fs');

const curriculum = {
  "A1": [
    {
      "id": "A1_gc_1", "level": "A1", "unit": 1,
      "title": "Alphabet and pronunciation basics",
      "topic": "German alphabet and pronunciation",
      "explanation": "The German alphabet has 26 letters plus umlauts (ä, ö, ü) and the ß (Eszett). Pronunciation differs from English in key ways. Learning correct pronunciation early helps with listening comprehension and speaking confidence in medical contexts.",
      "rules": [
        "Vowels: a[a:], e[e:], i[i:], o[o:], u[u:] - long vowels in open syllables",
        "Umlauts: ä[ɛ:], ö[ø:], ü[y:] - round lips for ö and ü",
        "ß (Eszett) is pronounced like double 's' [s], e.g. Straße",
        "W is pronounced [v] like English 'v', e.g. was (what)",
        "V is pronounced [f] in most words, e.g. Vater (father)",
        "Z is pronounced [ts] like 'ts', e.g. Zeit (time)",
        "CH after a,o,u is guttural [x]; after e,i,ä,ö,ü is soft [ç]"
      ],
      "examples": [
        { "de": "Der Arzt [aːɐtst]", "en": "The doctor (pronunciation)" },
        { "de": "Die Ärztin [ˈɛːɐtstɪn]", "en": "The female doctor" },
        { "de": "Das Krankenhaus [ˈkʁaŋkənhaʊs]", "en": "The hospital" },
        { "de": "Öffnen Sie den Mund [ˈœfnən ziː deːn mʊnt]", "en": "Open your mouth" }
      ],
      "commonMistakes": [
        { "wrong": "Pronouncing 'w' as English 'w' in 'was'", "correct": "Pronounce 'w' as 'v': was = vas", "explanation": "German w is always like English v." },
        { "wrong": "Pronouncing 'v' as English 'v' in 'Vater'", "correct": "Pronounce 'v' as 'f': Vater = fater", "explanation": "Most German v is pronounced [f]." },
        { "wrong": "Ignoring umlauts: sagen vs. sägen", "correct": "sagen (to say) vs. sägen (to saw)", "explanation": "Umlauts change meaning. Pronounce them distinctly." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "German 'w' is pronounced like English '__'.", "answer": "v", "explanation": "German w = English v." },
        { "type": "fill-blank", "prompt": "'z' in 'Zeit' is pronounced like '__'.", "answer": "ts", "explanation": "German z is always [ts]." },
        { "type": "fill-blank", "prompt": "Letter 'ß' is pronounced like double '__'.", "answer": "s", "explanation": "ß = [s], as in 'Straße'." }
      ],
      "linkedGrammarTopics": ["Greetings", "Numbers"]
    },
    {
      "id": "A1_gc_2", "level": "A1", "unit": 2,
      "title": "Personal pronouns and sein",
      "topic": "Personal pronouns and the verb sein",
      "explanation": "Personal pronouns (ich, du, er/sie/es, wir, ihr, sie/Sie) are the foundation of German sentences. The verb 'sein' (to be) is irregular and essential for introductions and descriptions. In medical contexts: 'Ich bin Arzt' (I am a doctor), 'Sie ist Patientin' (She is a patient).",
      "rules": [
        "ich bin (I am)", "du bist (you are, informal sing.)",
        "er/sie/es ist (he/she/it is)", "wir sind (we are)",
        "ihr seid (you are, informal pl.)", "sie/Sie sind (they/you formal are)"
      ],
      "examples": [
        { "de": "Ich bin Hossam.", "en": "I am Hossam." },
        { "de": "Du bist Arzt.", "en": "You are a doctor." },
        { "de": "Sie ist Krankenschwester.", "en": "She is a nurse." },
        { "de": "Wir sind im Krankenhaus.", "en": "We are in the hospital." }
      ],
      "commonMistakes": [
        { "wrong": "Ich ist Arzt.", "correct": "Ich bin Arzt.", "explanation": "Ich always takes bin, not ist." },
        { "wrong": "Du sind Patient.", "correct": "Du bist Patient.", "explanation": "Du always takes bist, not sind." },
        { "wrong": "Wir ist Ärzte.", "correct": "Wir sind Ärzte.", "explanation": "Wir always takes sind, not ist." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Ich ___ Student.", "answer": "bin", "explanation": "Use bin with ich." },
        { "type": "fill-blank", "prompt": "Er ___ Arzt.", "answer": "ist", "explanation": "Use ist with er." },
        { "type": "fill-blank", "prompt": "Wir ___ im OP.", "answer": "sind", "explanation": "Use sind with wir." }
      ],
      "linkedGrammarTopics": ["sein", "Personal Pronouns", "Greetings"]
    },
    {
      "id": "A1_gc_3", "level": "A1", "unit": 3,
      "title": "Verb haben",
      "topic": "The verb haben (to have)",
      "explanation": "'Haben' (to have) is the second most important verb after 'sein'. It is irregular and used for possession, feelings, and symptoms. 'Ich habe Schmerzen' (I have pain). Also used as auxiliary for the perfect tense.",
      "rules": [
        "ich habe", "du hast", "er/sie/es hat",
        "wir haben", "ihr habt", "sie/Sie haben"
      ],
      "examples": [
        { "de": "Ich habe Fieber.", "en": "I have a fever." },
        { "de": "Er hat Kopfschmerzen.", "en": "He has a headache." },
        { "de": "Sie haben einen Termin.", "en": "You have an appointment (formal)." },
        { "de": "Wir haben eine Praxis.", "en": "We have a practice." }
      ],
      "commonMistakes": [
        { "wrong": "Du haben Fieber.", "correct": "Du hast Fieber.", "explanation": "Du takes hast, not haben." },
        { "wrong": "Sie hat kein Termin.", "correct": "Sie hat keinen Termin.", "explanation": "Termin is masculine accusative: keinen." },
        { "wrong": "Wir hast einen Termin.", "correct": "Wir haben einen Termin.", "explanation": "Wir takes haben, not hast." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Ich ___ Schmerzen im Rücken.", "answer": "habe", "explanation": "Use habe with ich." },
        { "type": "fill-blank", "prompt": "Der Patient ___ hohes Fieber.", "answer": "hat", "explanation": "Use hat with er (der Patient)." },
        { "type": "fill-blank", "prompt": "___ ihr einen Termin?", "answer": "Habt", "explanation": "Ihr takes habt." }
      ],
      "linkedGrammarTopics": ["haben", "Personal Pronouns", "Verbs"]
    },
    {
      "id": "A1_gc_4", "level": "A1", "unit": 4,
      "title": "Regular present tense verbs",
      "topic": "Regular verb conjugation in present tense",
      "explanation": "Regular verbs follow a predictable pattern: stem + ending. Common medical regular verbs: untersuchen (to examine), fragen (to ask), warten (to wait), arbeiten (to work). The endings change based on the subject pronoun.",
      "rules": [
        "stem + ending: machen - ich mach-e, du mach-st, er/sie/es mach-t",
        "wir mach-en, ihr mach-t, sie/Sie mach-en",
        "Verbs ending in -t,-d,-chn,-ffn add -e before -st/-t: du arbeit-e-st, er arbeit-e-t",
        "Some verbs change stem vowel in du/er/sie/es (sehen: du siehst, er sieht)"
      ],
      "examples": [
        { "de": "Ich untersuche den Patienten.", "en": "I examine the patient." },
        { "de": "Sie fragt nach den Symptomen.", "en": "She asks about the symptoms." },
        { "de": "Wir warten auf die Ergebnisse.", "en": "We wait for the results." },
        { "de": "Der Arzt arbeitet im Krankenhaus.", "en": "The doctor works in the hospital." }
      ],
      "commonMistakes": [
        { "wrong": "Du arbeiten im Krankenhaus.", "correct": "Du arbeitest im Krankenhaus.", "explanation": "Du takes -st (or -est after -t)." },
        { "wrong": "Er machst das.", "correct": "Er macht das.", "explanation": "Er/sie/es takes -t, not -st." },
        { "wrong": "Ich arbeitet.", "correct": "Ich arbeite.", "explanation": "Ich takes -e, not -t." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Ich ___ (arbeiten) in der Klinik.", "answer": "arbeite", "explanation": "Ich takes -e, -t stem adds -e." },
        { "type": "fill-blank", "prompt": "Der Arzt ___ (untersuchen) den Patienten.", "answer": "untersucht", "explanation": "Er takes -t: untersucht." },
        { "type": "fill-blank", "prompt": "Wir ___ (warten) auf den Befund.", "answer": "warten", "explanation": "Wir takes -en." }
      ],
      "linkedGrammarTopics": ["Regular Present Tense", "Verbs", "People"]
    },
    {
      "id": "A1_gc_5", "level": "A1", "unit": 5,
      "title": "Verb position in main clauses",
      "topic": "Verb second position (V2 rule)",
      "explanation": "In German main clauses, the conjugated verb ALWAYS goes in second position (V2 rule). The first position can be the subject or another element. If a time/place phrase starts the sentence, the subject moves after the verb.",
      "rules": [
        "The conjugated verb is always the second element in a main clause.",
        "Position 1 can be subject OR another element (time, place, object).",
        "If position 1 is not the subject, the subject goes to position 3.",
        "The verb never moves to the end in a main clause."
      ],
      "examples": [
        { "de": "Ich bin heute im Krankenhaus.", "en": "I am in the hospital today." },
        { "de": "Heute bin ich im Krankenhaus.", "en": "Today I am in the hospital." },
        { "de": "Der Arzt untersucht den Patienten.", "en": "The doctor examines the patient." },
        { "de": "Morgen hat der Patient eine OP.", "en": "Tomorrow the patient has surgery." }
      ],
      "commonMistakes": [
        { "wrong": "Heute ich bin im Krankenhaus.", "correct": "Heute bin ich im Krankenhaus.", "explanation": "When a time phrase is first, subject moves after verb." },
        { "wrong": "Der Patient gestern hatte Fieber.", "correct": "Der Patient hatte gestern Fieber.", "explanation": "Verb must stay in position 2." },
        { "wrong": "Im Krankenhaus der Arzt arbeitet.", "correct": "Im Krankenhaus arbeitet der Arzt.", "explanation": "Place phrase first verb = position 2." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Morgen ___ ich einen Termin.", "answer": "habe", "explanation": "Verb in position 2 even after time." },
        { "type": "fill-blank", "prompt": "Im OP ___ der Chirurg.", "answer": "ist", "explanation": "Verb in position 2 after place phrase." },
        { "type": "fill-blank", "prompt": "Du ___ heute Dienst.", "answer": "hast", "explanation": "Verb in position 2." }
      ],
      "linkedGrammarTopics": ["Word Order", "Regular Present Tense", "sein"]
    },
    {
      "id": "A1_gc_6", "level": "A1", "unit": 6,
      "title": "Yes/no questions",
      "topic": "Forming yes/no questions",
      "explanation": "Yes/no questions are formed by putting the conjugated verb at the start (position 1). This verb-first structure is simple but must be used consistently. In medical contexts: 'Haben Sie Schmerzen?' (Do you have pain?)",
      "rules": [
        "Verb goes to position 1 (start of sentence).",
        "Subject follows the verb (position 2).",
        "Rest of the sentence stays the same as a statement.",
        "Answer with Ja (yes) or Nein (no)."
      ],
      "examples": [
        { "de": "Haben Sie Schmerzen?", "en": "Do you have pain?" },
        { "de": "Ist der Patient wach?", "en": "Is the patient awake?" },
        { "de": "Kommen Sie aus Deutschland?", "en": "Do you come from Germany?" },
        { "de": "Arbeitet sie in der Praxis?", "en": "Does she work in the practice?" }
      ],
      "commonMistakes": [
        { "wrong": "Du hast Schmerzen? (statement order)", "correct": "Hast du Schmerzen?", "explanation": "Verb must come first in yes/no questions." },
        { "wrong": "Ist sie hat Fieber?", "correct": "Hat sie Fieber?", "explanation": "Only one verb at position 1." },
        { "wrong": "Der Patient ist müde? (statement)", "correct": "Ist der Patient müde?", "explanation": "Question order is verb-first." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "___ Sie Allergien?", "answer": "Haben", "explanation": "Question starts with the verb." },
        { "type": "fill-blank", "prompt": "___ der Patient Fieber?", "answer": "Hat", "explanation": "Hat at position 1." },
        { "type": "fill-blank", "prompt": "___ du morgen frei?", "answer": "Hast", "explanation": "Verb-first question with du." }
      ],
      "linkedGrammarTopics": ["Yes/No Questions", "Word Order", "sein"]
    },
    {
      "id": "A1_gc_7", "level": "A1", "unit": 7,
      "title": "W-questions",
      "topic": "Question words: wer, was, wo, wann, warum, wie",
      "explanation": "W-questions use question words starting with 'w'. The verb stays in position 2, right after the question word. Essential for patient interviews: 'Wo haben Sie Schmerzen?' (Where do you have pain?)",
      "rules": [
        "Question word position 1, verb position 2, subject position 3.",
        "wer (who/Nominative), wen (who/Accusative), wem (who/Dative)",
        "was (what), wo (where), wann (when), warum (why), wie (how)",
        "wie + adjective: wie alt (how old), wie lange (how long)"
      ],
      "examples": [
        { "de": "Wo haben Sie Schmerzen?", "en": "Where do you have pain?" },
        { "de": "Wie heißen Sie?", "en": "What is your name?" },
        { "de": "Seit wann haben Sie Fieber?", "en": "Since when do you have a fever?" },
        { "de": "Wer ist der behandelnde Arzt?", "en": "Who is the attending doctor?" }
      ],
      "commonMistakes": [
        { "wrong": "Was ist Ihre Name?", "correct": "Wie ist Ihr Name? / Wie heißen Sie?", "explanation": "For names use 'wie' not 'was'." },
        { "wrong": "Wo du hast Schmerzen?", "correct": "Wo hast du Schmerzen?", "explanation": "After W-word, verb in position 2." },
        { "wrong": "Warum der Patient weint?", "correct": "Warum weint der Patient?", "explanation": "Verb follows question word." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "___ haben Sie Schmerzen? (Where)", "answer": "Wo", "explanation": "Use Wo for location of pain." },
        { "type": "fill-blank", "prompt": "___ alt sind Sie?", "answer": "Wie", "explanation": "Use 'Wie alt' for age." },
        { "type": "fill-blank", "prompt": "___ ist Ihr Hausarzt? (Who)", "answer": "Wer", "explanation": "Use Wer for a person." }
      ],
      "linkedGrammarTopics": ["W-Questions", "Word Order", "Personal Pronouns"]
    },
    {
      "id": "A1_gc_8", "level": "A1", "unit": 8,
      "title": "Noun gender and articles der/die/das",
      "topic": "Definite articles and noun gender",
      "explanation": "Every German noun has a gender: masculine (der), feminine (die), or neuter (das). Learn each noun WITH its article. Medical nouns: der Arzt (doctor, m), die Ärztin (doctor, f), das Krankenhaus (hospital, n).",
      "rules": [
        "Masculine (der): male people, days, months, seasons, most -er nouns",
        "Feminine (die): female people, nouns ending in -ung, -heit, -keit, -schaft, -tion",
        "Neuter (das): young beings, most -chen, -lein nouns, many borrowed words",
        "Patterns: -er (masculine), -in (feminine), -chen (neuter)"
      ],
      "examples": [
        { "de": "Der Arzt kommt um zehn Uhr.", "en": "The doctor comes at ten." },
        { "de": "Die Ärztin untersucht die Patientin.", "en": "The doctor examines the patient." },
        { "de": "Das Krankenhaus ist groß.", "en": "The hospital is big." },
        { "de": "Die Praxis hat morgen geschlossen.", "en": "The practice is closed tomorrow." }
      ],
      "commonMistakes": [
        { "wrong": "Das Arzt", "correct": "Der Arzt", "explanation": "Arzt is masculine: der Arzt." },
        { "wrong": "Der Krankenhaus", "correct": "Das Krankenhaus", "explanation": "Krankenhaus is neuter." },
        { "wrong": "Die Schmerz (feminine)", "correct": "Der Schmerz", "explanation": "Schmerz is masculine." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "___ Patient hat Husten. (the)", "answer": "Der", "explanation": "Patient is masculine." },
        { "type": "fill-blank", "prompt": "___ Krankenschwester hilft. (the)", "answer": "Die", "explanation": "Krankenschwester is feminine." },
        { "type": "fill-blank", "prompt": "___ Rezept ist fertig. (the/neuter)", "answer": "Das", "explanation": "Rezept is neuter." }
      ],
      "linkedGrammarTopics": ["Definite Articles", "Articles", "People"]
    },
    {
      "id": "A1_gc_9", "level": "A1", "unit": 9,
      "title": "Indefinite articles ein/eine",
      "topic": "Indefinite articles ein and eine",
      "explanation": "'Ein' (a/an) changes based on gender: 'ein' for masculine and neuter (Nominative), 'eine' for feminine. No plural indefinite article. Medical: 'Ein Patient wartet' (A patient is waiting), 'Eine Krankenschwester kommt' (A nurse is coming).",
      "rules": [
        "Masculine: ein (ein Arzt)", "Feminine: eine (eine Ärztin)",
        "Neuter: ein (ein Krankenhaus)",
        "No indefinite article in plural: 'Patienten warten'"
      ],
      "examples": [
        { "de": "Ein Patient wartet im Wartezimmer.", "en": "A patient is waiting in the waiting room." },
        { "de": "Eine Schwester bringt die Medikamente.", "en": "A nurse brings the medication." },
        { "de": "Ist das ein Notfall?", "en": "Is this an emergency?" },
        { "de": "Das ist eine Praxis für Allgemeinmedizin.", "en": "This is a general medicine practice." }
      ],
      "commonMistakes": [
        { "wrong": "Eine Arzt", "correct": "Ein Arzt", "explanation": "Arzt is masculine, so 'ein'." },
        { "wrong": "Ein Ärztin", "correct": "Eine Ärztin", "explanation": "Ärztin is feminine, so 'eine'." },
        { "wrong": "Ein Patienten (with plural)", "correct": "Patienten (no article)", "explanation": "No plural indefinite article." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Das ist ___ Notfall. (a)", "answer": "ein", "explanation": "Notfall is masculine." },
        { "type": "fill-blank", "prompt": "Sie ist ___ Ärztin.", "answer": "eine", "explanation": "Ärztin is feminine." },
        { "type": "fill-blank", "prompt": "Wir brauchen ___ Rezept. (a/neuter)", "answer": "ein", "explanation": "Rezept is neuter." }
      ],
      "linkedGrammarTopics": ["Indefinite Articles", "Articles", "People"]
    },
    {
      "id": "A1_gc_10", "level": "A1", "unit": 10,
      "title": "Plural basics",
      "topic": "Forming plural nouns",
      "explanation": "German plurals are formed by adding -e, -er, -en/-n, -s, or umlaut changes. Medical plurals: der Arzt -> die Ärzte, die Tablette -> die Tabletten, das Rezept -> die Rezepte, der Schmerz -> die Schmerzen.",
      "rules": [
        "Most masculine nouns add -e (often Umlaut): der Arzt -> die Ärzte",
        "Most feminine nouns add -en/-n: die Tablette -> die Tabletten",
        "Neuter nouns often add -er or -e: das Kind -> die Kinder",
        "Foreign words add -s: das Labor -> die Labors"
      ],
      "examples": [
        { "de": "Die Ärzte haben Visite.", "en": "The doctors have rounds." },
        { "de": "Diese Tabletten sind gegen Schmerzen.", "en": "These tablets are for pain." },
        { "de": "Die Rezepte sind fertig.", "en": "The prescriptions are ready." },
        { "de": "Viele Patienten warten in der Praxis.", "en": "Many patients are waiting." }
      ],
      "commonMistakes": [
        { "wrong": "Die Arzt (singular)", "correct": "Der Arzt - die Ärzte", "explanation": "Arzt gets Umlaut + -e in plural." },
        { "wrong": "Der Patient - die Patienten (n-declension)", "correct": "Der Patient - die Patienten", "explanation": "Patient follows n-declension." },
        { "wrong": "Der Schmerz - die Schmerzen", "correct": "Der Schmerz - die Schmerzen", "explanation": "Some masculine nouns take -en." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Der Arzt - die ___", "answer": "Ärzte", "explanation": "Umlaut + -e." },
        { "type": "fill-blank", "prompt": "Die Tablette - die ___", "answer": "Tabletten", "explanation": "Add -n." },
        { "type": "fill-blank", "prompt": "Das Rezept - die ___", "answer": "Rezepte", "explanation": "Add -e." }
      ],
      "linkedGrammarTopics": ["Plural Forms", "Articles", "Definite Articles"]
    },
    {
      "id": "A1_gc_11", "level": "A1", "unit": 11,
      "title": "Accusative case basics",
      "topic": "The accusative case for direct objects",
      "explanation": "The accusative case marks the direct object. Articles change: der -> den, die -> die, das -> das. Medical: 'Ich untersuche den Patienten' (I examine the patient), 'Sie hat einen Termin' (She has an appointment).",
      "rules": [
        "Masculine: der -> den (ein -> einen)",
        "Feminine: die -> die (eine -> eine, no change)",
        "Neuter: das -> das (ein -> ein, no change)",
        "Plural: die -> die (no indefinite article)"
      ],
      "examples": [
        { "de": "Ich untersuche den Patienten.", "en": "I examine the patient." },
        { "de": "Der Arzt hat einen Termin.", "en": "The doctor has an appointment." },
        { "de": "Die Schwester bringt die Medikamente.", "en": "The nurse brings the medication." },
        { "de": "Er öffnet das Fenster.", "en": "He opens the window." }
      ],
      "commonMistakes": [
        { "wrong": "Ich untersuche der Patient.", "correct": "Ich untersuche den Patienten.", "explanation": "Patient is masculine accusative: den." },
        { "wrong": "Sie hat der Termin.", "correct": "Sie hat den Termin.", "explanation": "Termin is masculine accusative: den." },
        { "wrong": "Er verschreibt die Rezept.", "correct": "Er verschreibt das Rezept.", "explanation": "Rezept is neuter, no change." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Ich sehe ___ Arzt. (the)", "answer": "den", "explanation": "Masculine accusative: den." },
        { "type": "fill-blank", "prompt": "Sie braucht ___ Rezept. (a)", "answer": "ein", "explanation": "Neuter: no change." },
        { "type": "fill-blank", "prompt": "Wir rufen ___ Schwester. (the)", "answer": "die", "explanation": "Feminine: no change." }
      ],
      "linkedGrammarTopics": ["Accusative Case", "Articles", "Definite Articles"]
    },
    {
      "id": "A1_gc_12", "level": "A1", "unit": 12,
      "title": "Negation nicht/kein",
      "topic": "Using nicht and kein for negation",
      "explanation": "Two main negation words: 'nicht' (not) for verbs/adjectives/adverbs; 'kein' (no/not a) for nouns with indefinite articles. Medical: 'Ich habe keine Schmerzen' (I have no pain), 'Der Patient schläft nicht' (The patient is not sleeping).",
      "rules": [
        "nicht negates verbs, adjectives, adverbs: Er schläft nicht.",
        "nicht goes at end for simple verbs: Ich verstehe nicht.",
        "kein negates nouns without/with indefinite article.",
        "kein declines like ein: kein (m/n), keine (f/pl), keinen (m acc.)"
      ],
      "examples": [
        { "de": "Ich habe keine Schmerzen.", "en": "I have no pain." },
        { "de": "Der Patient schläft nicht.", "en": "The patient is not sleeping." },
        { "de": "Er ist kein Arzt, er ist Student.", "en": "He is not a doctor, he is a student." },
        { "de": "Wir haben keinen Termin frei.", "en": "We have no appointment available." }
      ],
      "commonMistakes": [
        { "wrong": "Ich habe nicht Schmerzen.", "correct": "Ich habe keine Schmerzen.", "explanation": "With nouns use kein, not nicht." },
        { "wrong": "Er ist nicht ein Arzt.", "correct": "Er ist kein Arzt.", "explanation": "Don't use 'nicht ein', use kein." },
        { "wrong": "Ich habe keine Schmerz. (singular)", "correct": "Ich habe keine Schmerzen.", "explanation": "Schmerz is usually plural." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "Ich habe ___ Termin. (no)", "answer": "keinen", "explanation": "Masculine accusative: keinen." },
        { "type": "fill-blank", "prompt": "Der Patient hat ___ Fieber. (no)", "answer": "kein", "explanation": "Neuter: kein." },
        { "type": "fill-blank", "prompt": "Sie arbeitet ___ heute. (not)", "answer": "nicht", "explanation": "Negating verb: nicht." }
      ],
      "linkedGrammarTopics": ["nicht vs kein", "Negative Articles", "Accusative Case"]
    },
    {
      "id": "A1_gc_13", "level": "A1", "unit": 13,
      "title": "Possessive articles mein/dein",
      "topic": "Possessive articles: mein, dein, sein, ihr, unser, euer, Ihr",
      "explanation": "Possessive articles show ownership. They decline like kein. Medical: 'Mein Patient' (my patient), 'Ihre Krankenakte' (your medical file), 'Sein Blutdruck' (his blood pressure).",
      "rules": [
        "ich -> mein, du -> dein, er/sie/es -> sein/ihr/sein",
        "wir -> unser, ihr -> euer, sie -> ihr, Sie -> Ihr",
        "Endings follow kein pattern: -e for feminine/plural nom., -en for m. acc."
      ],
      "examples": [
        { "de": "Mein Patient hat hohen Blutdruck.", "en": "My patient has high blood pressure." },
        { "de": "Ihre Krankenakte ist hier.", "en": "Your medical file is here (formal)." },
        { "de": "Sein Rezept ist fertig.", "en": "His prescription is ready." },
        { "de": "Ihre Praxis ist sehr gut.", "en": "Her practice is very good." }
      ],
      "commonMistakes": [
        { "wrong": "Meine Patient (with feminine ending)", "correct": "Mein Patient", "explanation": "Patient is masculine, so mein." },
        { "wrong": "Ihr Rezept (her - neuter is fine)", "correct": "Ihr Rezept", "explanation": "Correct. Rezept is neuter, so Ihr." },
        { "wrong": "Deine Arzt (feminine ending)", "correct": "Dein Arzt", "explanation": "Arzt is masculine: dein." }
      ],
      "miniPractice": [
        { "type": "fill-blank", "prompt": "___ Patient hat Fieber. (my)", "answer": "Mein", "explanation": "Patient is masculine." },
        { "type": "fill-blank", "prompt": "___ Schwester hilft. (your formal)", "answer": "Ihre", "explanation": "Schwester feminine: Ihre." },
        { "type": "fill-blank", "prompt": "___ Rezept ist fertig. (his)", "answer": "Sein", "explanation": "Rezept is neuter: sein." }
      ],
      "linkedGrammarTopics": ["Possessive Adjectives", "Personal Pronouns", "Articles"]
    },
    {
      "id": "A1_gc_14", "level": "A1", "unit": 14,
      "title": "Modal verbs können/müssen/wollen",
      "topic": "Introduction to modal verbs",
      "explanation": "Modal verbs change the meaning of the main verb. They go in position 2, and the main verb goes to the end as an infinitive. Medical: 'Ich kann nicht kommen' (I cannot come), 'Sie müssen warten' (You must wait), 'Der Patient will nach Hause' (The patient wants to go home).",
      "rules": [
        "können (can): ich kann, du kannst, er kann, wir können, ihr könnt, sie können",
        "müssen (must): ich muss, du musst, er muss, wir müssen, ihr müsst, sie müssen",
        "wollen (want): ich will, du willst, er will, wir wollen, ihr wollt, sie wollen",
        "Modal verb in position 2, main verb as infinitive at the end"
      ],
      "examples": [
        { "de": "Ich kann heute nicht kommen.", "en": "I cannot come today." },
        { "de": "Sie müssen im Wartezimmer warten.", "en": "You must wait in the waiting room." },
        { "de": "Der Patient will den Arzt sprechen.", "en": "The patient wants to speak to the doctor." },
        { "de": "Wir können die Medikamente wechseln.", "en": "We can change the medication." }
      ],
      "commonMistakes": [
        { "wrong": "Ich kann komme.", "correct": "Ich kann kommen.", "explanation": "Main verb stays as infinitive after modal." },
        { "wrong": "Sie müsst warten.", "correct": "Sie müssen warten.", "explanation": "Sie (formal/plural) takes müssen." },
        { "wrong": "Er will