import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { getState, updateLevelProgress, recordVocabAnswer, getLocalDateKey } from '../utils/store';
import { loadLevelVocabulary, loadAllVocabulary } from '../utils/dataLoaders';
import { RefreshCw, ThumbsUp, ThumbsDown, RotateCcw, Search, X, BookMarked } from 'lucide-react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, LoadingState } from '../components/ui';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const SESSION_SIZES = [5, 10, 15, 20, 25];
const DEFAULT_SESSION_SIZE = 20;
const MAX_NEW_CARDS = 10;
const MAX_TOTAL_CARDS = 25;

// Card type concepts for noun-specific practice
const CARD_TYPES = ['meaning', 'article', 'plural'];
const CARD_TYPE_LABELS = { meaning: 'Meaning', article: 'Article', plural: 'Plural' };

// Medical keywords (same logic as VocabularyPage)
const MEDICAL_KEYWORDS = [
  'medical', 'health', 'klinik', 'hospital', 'doctor', 'patient', 'pharmacy', 'apotheke',
  'emergency', 'notfall', 'surgery', 'operation', 'orthopedics', 'orthopädie', 'diagnosis',
  'diagnose', 'diagnostic', 'therapy', 'therapie', 'documentation', 'dokumentation', 'fsp',
  'ethics', 'ethik', 'symptom', 'treatment', 'behandlung', 'prescription', 'rezept',
  'medication', 'medikament', 'examination', 'untersuchung', 'ward', 'station',
  'clinic', 'klinisch', 'nurse', 'krankenschwester', 'pflege', 'arzt', 'ärztlich',
  'krankheit', 'disease', 'infection', 'infektion', 'injury', 'verletzung',
  'pain', 'schmerz', 'fever', 'fieber', 'blood', 'blut', 'pressure', 'druck',
  'heart', 'herz', 'lung', 'lunge', 'bone', 'knochen', 'muscle', 'muskel',
  'nerve', 'nerv', 'brain', 'gehirn', 'skin', 'haut', 'cell', 'zelle',
  'anatomy', 'anatomie', 'physiology', 'physiologie', 'pathology', 'pathologie',
  'psychiatry', 'psychiatrie', 'psychology', 'psychologie', 'therapy', 'physio',
  'rehabilitation', 'reha', 'vaccination', 'impfung', 'screening', 'vorsorge',
  'imaging', 'bildgebung', 'ultraschall', 'röntgen', 'mrt', 'ct', 'ekg',
  'endoscopy', 'endoskopie', 'biopsy', 'biopsie', 'laboratory', 'labor',
  'pharmacology', 'pharmakologie', 'oncology', 'onkologie', 'cardiology',
  'kardiologie', 'neurology', 'neurologie', 'pediatrics', 'pädiatrie',
  'germ', 'keim', 'antibiotic', 'antibiotikum', 'chirurgie',
  'anesthesia', 'anästhesie', 'intensive care', 'intensiv', 'icu',
  'palliative', 'palliativ', 'hospiz', 'ethikkommission',
  'informed consent', 'aufklärung', 'patient education',
  'compliance', 'adhärenz', 'prognosis', 'prognose', 'diagnosis',
  'differential diagnosis', 'differentialdiagnose', 'follow-up',
  'nachsorge', 'aftercare', 'recovery', 'genesung', 'wound', 'wunde',
  'bandage', 'verband', 'gips', 'krücke', 'rollstuhl',
  'trage', 'ambulance', 'krankenwagen', 'rettung',
  'first aid', 'erste hilfe', 'hygiene', 'hygiene', 'steril',
  'disinfection', 'desinfektion', 'quarantine', 'quarantäne',
  'side effect', 'nebenwirkung', 'allergy', 'allergie', 'chronic', 'chronisch',
  'acute', 'akut', 'benign', 'gutartig', 'malignant', 'bösartig', 'tumor',
  'cancer', 'krebs', 'diabetes', 'hypertension', 'hypertonie',
  'asthma', 'stroke', 'schlaganfall', 'infarkt',
  'pneumonia', 'lungenentzündung', 'fracture', 'fraktur', 'sprain',
  'verstauchung', 'luxation', 'hernie',
  'blinddarmentzündung', 'ulcer', 'geschwür', 'inflammation',
  'entzündung', 'edema', 'ödem', 'swelling', 'schwellung',
  'public health', 'gesundheitswesen', 'krankenkasse',
  'sick note', 'krankschreibung', 'medical certificate', 'attest',
  'discharge', 'entlassung', 'referral', 'überweisung', 'admission',
  'aufnahme', 'akte', 'medical record', 'krankenakte',
  'healthcare', 'gesundheitsversorgung', 'health system', 'gesundheitssystem',
];

function isMedicalWord(word) {
  const fields = [
    word.word, word.translation, word.topic, word.example, word.exampleTranslation,
    ...(word.tags || []), word.lessonId, word.category
  ].filter(Boolean).map(f => f.toLowerCase());
  const searchText = fields.join(' ');
  return MEDICAL_KEYWORDS.some(kw => searchText.includes(kw.toLowerCase()));
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate card types for a given word
// Returns array of { cardId, front, back, cardType, wordRef }
function generateCardTypes(word) {
  const art = word.article || '';
  const baseWord = word.word || '';
  const translation = word.translation || '';
  const isNoun = word.partOfSpeech === 'noun' || !!art;
  const cards = [];

  // Meaning card: always generated
  const meaningFront = art ? `${art} ${baseWord}` : baseWord;
  if (word.plural && isNoun) {
    cards.push({
      cardId: `${word._level}_${word.id}_meaning`,
      front: `${meaningFront} (${word.plural})`,
      back: translation,
      cardType: 'meaning',
      wordRef: `${word._level}_${word.id}`,
    });
  } else {
    cards.push({
      cardId: `${word._level}_${word.id}_meaning`,
      front: meaningFront,
      back: translation,
      cardType: 'meaning',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  // Article card: only for nouns
  if (isNoun) {
    const cleanWord = baseWord.replace(/^(der|die|das)\s+/i, '').trim();
    cards.push({
      cardId: `${word._level}_${word.id}_article`,
      front: `Article of "${cleanWord}"?`,
      back: art ? `${art} ${cleanWord}` : cleanWord,
      cardType: 'article',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  // Plural card: only for nouns with plural form
  if (isNoun && word.plural) {
    const cleanWord = baseWord.replace(/^(der|die|das)\s+/i, '').trim();
    cards.push({
      cardId: `${word._level}_${word.id}_plural`,
      front: `Plural of "${art} ${cleanWord}"?`,
      back: word.plural,
      cardType: 'plural',
      wordRef: `${word._level}_${word.id}`,
    });
  }

  return cards;
}

/**
 * Build the SRS queue for flashcards.
 * Returns structured queue with card types generated from eligible words.
 */
function buildFlashcardQueue(words, sessionSize) {
  const state = getState();
  const today = getLocalDateKey();
  const mastery = state.vocabularyMastery || {};
  const qDue = [];
  const qMistake = [];
  const qNew = [];

  words.forEach(w => {
    const id = `${w._level}_${w.id}`;
    const m = mastery[id];
    if (!m) {
      qNew.push(w);
    } else if (m.incorrect > m.correct && m.incorrect >= 2) {
      qMistake.push(w);
    } else if (m.due <= today) {
      qDue.push(w);
    }
  });

  // Generate card types for each word in priority order
  const cards = [];
  const generateCards = (wordList, limit) => {
    const result = [];
    for (const w of wordList) {
      if (result.length >= limit) break;
      const types = generateCardTypes(w);
      // For due/mistake cards, include ALL card types the word supports
      // For new cards, only meaning card (simpler intro)
      const eligible = (wordList === qNew)
        ? types.filter(t => t.cardType === 'meaning')
        : types;
      for (const t of eligible) {
        if (result.length < limit) result.push(t);
      }
    }
    return result;
  };

  // Priority: due reviews > mistake cards > new cards
  cards.push(...generateCards(qDue, sessionSize));
  if (cards.length < sessionSize) {
    cards.push(...generateCards(qMistake, sessionSize - cards.length));
  }
  if (cards.length < sessionSize) {
    const newRoom = Math.min(MAX_NEW_CARDS, sessionSize - cards.length);
    cards.push(...generateCards(qNew, newRoom));
  }

  return cards;
}

// Count queue stats
function getQueueStats(wordIds) {
  const state = getState();
  const today = getLocalDateKey();
  const mastery = state.vocabularyMastery || {};
  let dueCount = 0;
  let newCount = 0;
  let mistakeCount = 0;

  wordIds.forEach(id => {
    const m = mastery[id];
    if (!m) {
      newCount++;
    } else if (m.incorrect > m.correct && m.incorrect >= 2) {
      mistakeCount++;
    } else if (m.due <= today) {
      dueCount++;
    }
  });

  return { dueCount, newCount, mistakeCount };
}

// allWords is now loaded dynamically via loadAllVocabulary() inside the component

export default function FlashcardPage() {
  const { levelId } = useParams();
  const [filter, setFilter] = useState('due');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionCards, setSessionCards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sessionSize, setSessionSize] = useState(DEFAULT_SESSION_SIZE);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Dynamic vocabulary loading
  const [vocabData, setVocabData] = useState(null);
  const [vocabLoading, setVocabLoading] = useState(true);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState(levelId || 'all');
  const [medicalOnly, setMedicalOnly] = useState(false);

  // Load vocabulary for current level filter
  useEffect(() => {
    let cancelled = false;
    setVocabLoading(true);
    async function load() {
      try {
        let data;
        if (levelFilter === 'all') {
          data = await loadAllVocabulary();
        } else {
          const arr = await loadLevelVocabulary(levelFilter);
          data = { [levelFilter]: arr };
        }
        if (!cancelled) {
          setVocabData(data);
          setVocabLoading(false);
        }
      } catch {
        if (!cancelled) {
          setVocabData(null);
          setVocabLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [levelFilter]);

  // When route levelId changes, sync the level filter
  useEffect(() => {
    if (levelId) setLevelFilter(levelId);
  }, [levelId]);

  // All words for the current level filter
  const sourceWords = useMemo(() => {
    if (!vocabData) return [];
    if (levelFilter === 'all') {
      return LEVELS.flatMap(level =>
        (vocabData[level] || []).map(w => ({ ...w, _level: level }))
      );
    }
    return (vocabData[levelFilter] || []).map(w => ({ ...w, _level: levelFilter }));
  }, [levelFilter, vocabData]);

  // Apply search + medical filter
  const searchedWords = useMemo(() => {
    let words = sourceWords;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      words = words.filter(w =>
        w.word.toLowerCase().includes(q) ||
        (w.translation || '').toLowerCase().includes(q) ||
        (w.example || '').toLowerCase().includes(q) ||
        (w.exampleTranslation || '').toLowerCase().includes(q) ||
        (w.topic || '').toLowerCase().includes(q) ||
        (w.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (medicalOnly) {
      words = words.filter(w => isMedicalWord(w));
    }

    return words;
  }, [sourceWords, search, medicalOnly]);

  // Queue stats for session setup display
  const wordIds = useMemo(() => searchedWords.map(w => `${w._level}_${w.id}`), [searchedWords]);
  const stats = useMemo(() => getQueueStats(wordIds), [wordIds]);

  // Build the session cards when starting
  const buildSession = (size) => {
    const cards = buildFlashcardQueue(searchedWords, size);
    setSessionCards(cards);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setReviews([]);
    setSessionStarted(true);
    setSessionSize(size);
  };

  // Handle review rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  const handleReview = (rating) => {
    const card = sessionCards[index];
    const labels = ['', 'Again', 'Hard', 'Good', 'Easy'];

    // Record the answer using the wordRef (base word id, not card-specific id)
    // Pass cardType and wordText for rich mistake flashcard context
    const wordText = card.front ? card.front.replace(/^Article of "(.*?)"\?$/, '$1').replace(/^Plural of "(.*?)"\?$/, '$1').split(' (')[0] : card.wordRef;
    recordVocabAnswer(card.wordRef, rating, {
      level: levelFilter !== 'all' ? levelFilter : card.wordRef.split('_')[0],
      userAnswer: rating >= 3 ? 'Knew it' : '[flashcard]',
      correctAnswer: card.back || '',
      translation: card.back,
      topic: 'Vocabulary',
      cardType: card.cardType,
      wordText: wordText,
    });
    updateLevelProgress(
      levelFilter !== 'all' ? levelFilter : card.wordRef.split('_')[0],
      'vocab',
      {
        date: new Date().toISOString(),
        wordId: card.wordRef,
        correct: rating >= 3,
      }
    );
    setReviews([...reviews, { cardId: card.cardId, wordRef: card.wordRef, cardType: card.cardType, rating, label: labels[rating] }]);
    if (index < sessionCards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  const s = {
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' },
    select: { padding: '0.5rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', minWidth: '80px' },
    filterBtn: (active) => ({
      padding: '0.4rem 0.8rem', borderRadius: '6px', border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
      background: active ? 'rgba(0,240,255,0.1)' : 'var(--bg-hover)',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      cursor: 'pointer', fontSize: '0.75rem', fontWeight: active ? 600 : 400,
    }),
  };

  if (vocabLoading) {
    return (
      <PageShell maxWidth="max-w-4xl">
        <LoadingState message="Loading vocabulary..." />
      </PageShell>
    );
  }

  if (sourceWords.length === 0 && levelFilter !== 'all') {
    return (
      <PageShell maxWidth="max-w-4xl">
        <LoadingState message={`No vocabulary for ${levelFilter}`} />
        <div className="text-center mt-4">
          <Link to={`/level/${levelFilter}/vocabulary`} style={{ color: 'var(--accent)' }}>Back to Vocabulary</Link>
        </div>
      </PageShell>
    );
  }

  // Session setup screen (before cards start)
  if (!sessionStarted) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="mb-6">
          <SectionHeader
            title="Flashcards"
            subtitle="Spaced repetition vocabulary"
            action={
              <Link to="/practice" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>&larr; Practice Hub</Link>
            }
          />
        </div>

        <div className="rounded-xl p-6 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <BookMarked size={24} style={{ color: '#06b6d4' }} />
            <div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{levelFilter !== 'all' ? `Level ${levelFilter}` : 'All Levels'}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {searchedWords.length} available words
                {medicalOnly ? ' (Medical)' : ''}
              </div>
            </div>
          </div>

          {/* Quick queue stats */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center text-xs">
            <div className="p-2 rounded" style={{ backgroundColor: 'rgba(59,255,158,0.08)', color: '#3bff9e' }}>
              <div className="text-lg font-bold">{stats.dueCount}</div>
              Due
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: 'rgba(6,182,212,0.08)', color: '#06b6d4' }}>
              <div className="text-lg font-bold">{stats.newCount}</div>
              New
            </div>
            <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,170,51,0.08)', color: '#ffaa33' }}>
              <div className="text-lg font-bold">{stats.mistakeCount}</div>
              Mistakes
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Cards per session</div>
            <div className="flex gap-2 flex-wrap">
              {SESSION_SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSessionSize(s)}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: sessionSize === s ? 'var(--accent)' : 'var(--bg-hover)',
                    color: sessionSize === s ? '#000' : 'var(--text-primary)',
                    border: `1px solid ${sessionSize === s ? 'var(--accent)' : 'var(--border)'}`,
                    fontWeight: sessionSize === s ? 700 : 400,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Card type toggle */}
          <div className="mb-3">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Card types</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Nouns get article and plural cards automatically. All words get meaning recall cards.
            </div>
          </div>
        </div>

        {/* Search + filter options */}
        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="mb-3">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...s.input, paddingLeft: '2.2rem', fontSize: '0.85rem' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={s.select}>
              <option value="all">All Levels</option>
              {LEVELS.map(l => (
                <option key={l} value={l}>{l} ({((vocabData && vocabData[l]) || []).length})</option>
              ))}
            </select>
            <button onClick={() => setMedicalOnly(!medicalOnly)} style={s.filterBtn(medicalOnly)}>
              {medicalOnly ? '✓ ' : ''}Medical
            </button>
          </div>
        </div>

        <Button variant="primary" onClick={() => buildSession(sessionSize)} className="w-full py-3 text-base">
          Start {sessionSize} Card{ sessionSize > 1 ? 's' : '' }
        </Button>
      </PageShell>
    );
  }

  // Done screen
  if (done) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🎴</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Session Complete!</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{sessionCards.length} cards reviewed</p>
          <div className="mb-6">
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Ratings breakdown:</div>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs text-center">
              <div className="p-1.5 sm:p-2 rounded" style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355' }}>
                <div className="font-bold text-sm sm:text-base">{reviews.filter(r => r.rating === 1).length}</div>
                <div className="text-[10px] sm:text-xs">Again</div>
              </div>
              <div className="p-1.5 sm:p-2 rounded" style={{ backgroundColor: 'rgba(255,170,51,0.1)', color: '#ffaa33' }}>
                <div className="font-bold text-sm sm:text-base">{reviews.filter(r => r.rating === 2).length}</div>
                <div className="text-[10px] sm:text-xs">Hard</div>
              </div>
              <div className="p-1.5 sm:p-2 rounded" style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e' }}>
                <div className="font-bold text-sm sm:text-base">{reviews.filter(r => r.rating === 3).length}</div>
                <div className="text-[10px] sm:text-xs">Good</div>
              </div>
              <div className="p-1.5 sm:p-2 rounded" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>
                <div className="font-bold text-sm sm:text-base">{reviews.filter(r => r.rating === 4).length}</div>
                <div className="text-[10px] sm:text-xs">Easy</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="primary" onClick={() => { setSessionStarted(false); setDone(false); }}>
              New Session
            </Button>
            <Link to="/practice" className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
              Practice Hub
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  // Empty cards
  if (sessionCards.length === 0) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="mb-4">
          <SectionHeader
            title="Flashcards"
            subtitle="0 cards"
            action={
              <button onClick={() => setSessionStarted(false)} style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none' }}>&larr; Back</button>
            }
          />
        </div>
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-3xl mb-3">🎉</div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>All caught up!</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            No cards due for this level. Check back later or try a different level.
          </p>
          <Button variant="primary" size="sm" onClick={() => setSessionStarted(false)}>
            Change Settings
          </Button>
        </div>
      </PageShell>
    );
  }

  // Active card session
  const card = sessionCards[index];

  // Build the front/back display
  const getCardDisplay = () => {
    if (card.cardType === 'article') {
      return { front: card.front, back: card.back };
    }
    if (card.cardType === 'plural') {
      return { front: card.front, back: card.back };
    }
    // Meaning card
    return { front: card.front, back: card.back };
  };

  const display = getCardDisplay();
  const totalCards = sessionCards.length;

  return (
    <PageShell maxWidth="max-w-lg">
      <div className="mb-4">
        <SectionHeader
          title="Flashcards"
          subtitle={
            <div className="flex items-center gap-2">
              {levelFilter !== 'all' && <LevelBadge level={levelFilter} />}
              <span style={{ fontSize: '0.85rem' }}>{index + 1}/{totalCards}</span>
            </div>
          }
          action={
            <button onClick={() => setSessionStarted(false)} style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '0.85rem' }}>&larr; Exit</button>
          }
        />
      </div>

      {/* Session progress bar */}
      <div className="w-full h-1 rounded mb-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div
          className="h-full rounded transition-all"
          style={{ width: `${((index + 1) / totalCards) * 100}%`, backgroundColor: 'var(--accent)' }}
        />
      </div>

      {/* Reviews mini-bar */}
      {index > 0 && reviews.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3 text-xs text-center">
          <div className="p-1 rounded" style={{ backgroundColor: 'rgba(255,51,85,0.08)', color: '#ff3355' }}>
            <span className="font-bold">{reviews.filter(r => r.rating === 1).length}</span> A
          </div>
          <div className="p-1 rounded" style={{ backgroundColor: 'rgba(255,170,51,0.08)', color: '#ffaa33' }}>
            <span className="font-bold">{reviews.filter(r => r.rating === 2).length}</span> H
          </div>
          <div className="p-1 rounded" style={{ backgroundColor: 'rgba(59,255,158,0.08)', color: '#3bff9e' }}>
            <span className="font-bold">{reviews.filter(r => r.rating === 3).length}</span> G
          </div>
          <div className="p-1 rounded" style={{ backgroundColor: 'rgba(0,240,255,0.08)', color: 'var(--accent)' }}>
            <span className="font-bold">{reviews.filter(r => r.rating === 4).length}</span> E
          </div>
        </div>
      )}

      {/* Card type badge */}
      <div className="text-center mb-2">
        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
          style={{
            backgroundColor: card.cardType === 'article' ? 'rgba(255,170,51,0.12)' :
              card.cardType === 'plural' ? 'rgba(139,92,246,0.12)' :
                'rgba(6,182,212,0.12)',
            color: card.cardType === 'article' ? '#ffaa33' :
              card.cardType === 'plural' ? '#8b5cf6' : 'var(--accent)',
          }}
        >
          {CARD_TYPE_LABELS[card.cardType] || 'Meaning'}
        </span>
      </div>

      {/* Flashcard */}
      <Card
        className="cursor-pointer min-h-[200px] flex items-center justify-center text-center p-8"
        style={{
          borderColor: flipped ? '#8b5cf6' : 'var(--border)',
          boxShadow: flipped ? '0 0 30px rgba(139,92,246,0.15)' : 'none',
        }}
        onClick={() => setFlipped(!flipped)}
        hover={false}
      >
        <div>
          <div className="text-xl font-bold mb-3 break-words">{flipped ? display.back : display.front}</div>
          {!flipped && (
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Click to reveal answer
            </div>
          )}
        </div>
      </Card>

      {flipped && (
        <div className="flex gap-2 justify-center mt-6 flex-wrap">
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleReview(1)}
            className="flex items-center gap-1"
            title="Forgot: card comes back in ~10 min"
          >
            <RotateCcw size={14} /> Again
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReview(2)}
            className="flex items-center gap-1"
            style={{ backgroundColor: 'rgba(255,170,51,0.1)', color: '#ffaa33', border: '1px solid rgba(255,170,51,0.3)' }}
            title="Remembered with effort: shorter interval"
          >
            <ThumbsDown size={14} /> Hard
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleReview(3)}
            className="flex items-center gap-1"
            title="Remembered: normal SM-2 interval"
          >
            <ThumbsUp size={14} /> Good
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleReview(4)}
            className="flex items-center gap-1"
            title="Easy: 1.3x bonus interval"
          >
            <RefreshCw size={14} /> Easy
          </Button>
        </div>
      )}
    </PageShell>
  );
}
