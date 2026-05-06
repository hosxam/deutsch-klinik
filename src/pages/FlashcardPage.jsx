import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { getState, updateState, setLevelProgress, getLevelProgress, recordVocabAnswer } from '../utils/store';
import fullVocabData from '../data/germanVocabulary.json';
import { RefreshCw, ThumbsUp, ThumbsDown, Search, X } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const FILTERS = [
  { key: 'all', label: 'All Cards' },
  { key: 'due', label: 'Due Today' },
  { key: 'weak', label: 'Weak Cards' },
];

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

function getLocalDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// All words from all levels with level info attached
const allWords = LEVELS.flatMap(level =>
  (fullVocabData[level] || []).map(w => ({ ...w, _level: level }))
);

// Build display fields from germanVocabulary structure
function displayWord(card) {
  const w = card.word || '';
  const art = card.article || '';
  const hasArticleInWord = /^(der|die|das)\s+/i.test(w.trim());
  let result = art && !hasArticleInWord ? `${art} ${w}` : w;
  if (card.partOfSpeech === 'noun' && card.plural) {
    result += ` (${card.plural})`;
  }
  return result;
}

export default function FlashcardPage() {
  const { levelId } = useParams();
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState(levelId || 'all');
  const [medicalOnly, setMedicalOnly] = useState(false);

  // When route levelId changes, sync the level filter
  // (but if user manually changed filter, respect that until next route change)
  useEffect(() => {
    if (levelId) setLevelFilter(levelId);
  }, [levelId]);

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

  // All words for the current level filter
  const sourceWords = useMemo(() => {
    if (levelFilter === 'all') return allWords;
    return (fullVocabData[levelFilter] || []).map(w => ({ ...w, _level: levelFilter }));
  }, [levelFilter]);

  // Apply search + medical filter
  const searchedWords = useMemo(() => {
    let words = sourceWords;

    // Search
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

    // Medical
    if (medicalOnly) {
      words = words.filter(w => isMedicalWord(w));
    }

    return words;
  }, [sourceWords, search, medicalOnly]);

  const words = useMemo(() => {
    const state = getState();
    const today = getLocalDateKey();

    // Start from searched/filtered words
    let filtered = [...searchedWords];

    // Apply SM-2 filter
    if (filter === 'due') {
      filtered = filtered.filter(w => {
        const card = state.vocabularyMastery[w.id] || state.flashcards?.[`${w._level}_${w.id}`];
        return !card || card.due <= today || !card.mastered;
      });
    } else if (filter === 'weak') {
      filtered = filtered.filter(w => {
        const card = state.vocabularyMastery[w.id] || state.flashcards?.[`${w._level}_${w.id}`];
        return card && (card.repetitions < 2 || card.ease < 2.3);
      });
    }

    return filtered.sort((a, b) => `${a._level}_${a.id}`.localeCompare(`${b._level}_${b.id}`));
  }, [searchedWords, filter]);

  // Reset card on level/filter/search/medical change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setReviews([]);
  };

  const handleLevelChange = (newLevel) => {
    setLevelFilter(newLevel);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setReviews([]);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setReviews([]);
  };

  const toggleMedical = () => {
    setMedicalOnly(!medicalOnly);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setReviews([]);
  };

  if (sourceWords.length === 0 && levelFilter !== 'all') {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No vocabulary for {levelFilter}</p>
        <Link to={`/level/${levelFilter}/vocabulary`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
    );
  }

  const handleReview = (difficulty) => {
    const word = words[index];
    setReviews([...reviews, { wordId: word.id, level: word._level, difficulty }]);
    if (index < words.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setDone(true);
      const state = getState();
      const flashcards = { ...(state.flashcards || {}) };
      const today = getLocalDateKey();
      const allReviews = [...reviews, { wordId: word.id, level: word._level, difficulty }];
      allReviews.forEach(r => {
        const key = `${r.level}_${r.wordId}`;
        const card = { ...(flashcards[key] || { ease: 2.5, interval: 1, due: today, repetitions: 0 }) };
        recordVocabAnswer(r.wordId, r.difficulty >= 3);
        if (r.difficulty >= 3) {
          card.repetitions += 1;
          card.interval = card.repetitions === 1 ? 1 : card.repetitions === 2 ? 6 : Math.round(card.interval * card.ease);
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + card.interval);
          card.due = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
        } else {
          card.repetitions = 0;
          card.interval = 1;
          card.due = today;
          card.ease = Math.max(1.3, card.ease - 0.2);
        }
        card.mastered = card.repetitions >= 5 && card.ease >= 2.5;
        flashcards[key] = card;
      });
      // Track each reviewed word as vocab progress
      const levelIds = [...new Set(allReviews.map(r => r.level))];
      levelIds.forEach(lvl => {
        const existing = getLevelProgress(lvl, 'vocab')
          .flatMap(item => typeof item === 'string' ? [item] : (item?.wordIds || []));
        const reviewedIds = allReviews.filter(r => r.level === lvl).map(r => r.wordId);
        setLevelProgress(lvl, 'vocab', [
          ...new Set([...existing, ...reviewedIds]),
        ]);
      });
      updateState({ flashcards });
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">&#x1F3B4;</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Session Complete!</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{words.length} cards reviewed</p>
        <Link to={`/level/${levelId}/vocabulary`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Back to Vocabulary
        </Link>
      </div>
    );
  }

  // No cards matching filters
  if (words.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/level/${levelId}/vocabulary`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => handleFilterChange(f.key)}
              className="px-3 py-1 text-xs rounded-full transition-all"
              style={{
                backgroundColor: filter === f.key ? 'var(--accent)' : 'var(--bg-card)',
                color: filter === f.key ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              aria-label="Search flashcards"
              placeholder="Search cards..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              style={{ ...s.input, paddingLeft: '2.2rem' }}
            />
            {search && (
              <button
                type="button"
                aria-label="Clear flashcard search"
                onClick={() => handleSearchChange('')}
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <select aria-label="Filter flashcards by level" value={levelFilter} onChange={e => handleLevelChange(e.target.value)} style={s.select}>
            <option value="all">All Levels</option>
            {LEVELS.map(l => (
              <option key={l} value={l}>{l} ({(fullVocabData[l] || []).length})</option>
            ))}
          </select>
          <button type="button" aria-pressed={medicalOnly} onClick={toggleMedical} style={s.filterBtn(medicalOnly)}>
            {medicalOnly ? '✓ ' : ''}Medical
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>0 cards available</p>
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-muted)' }}>No flashcards match these filters.</p>
        <button
            type="button"
            className="mt-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent)', border: '1px solid var(--border)', cursor: 'pointer' }}
            onClick={() => { handleSearchChange(''); setMedicalOnly(false); handleLevelChange(levelId || 'all'); }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  const word = words[index];
  const displayGerman = displayWord(word);
  const displayEnglish = word.translation || '';
  const displayExample = word.example || '';
  const displayExampleTranslation = word.exampleTranslation || '';

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}/vocabulary`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{index + 1}/{words.length}</span>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 justify-center mb-4 flex-wrap">
        {FILTERS.map(f => (
        <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => handleFilterChange(f.key)}
            className="px-3 py-1 text-xs rounded-full transition-all"
            style={{
              backgroundColor: filter === f.key ? 'var(--accent)' : 'var(--bg-card)',
              color: filter === f.key ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs px-2 py-1" style={{ color: 'var(--text-muted)' }}>
          {words.length} cards
        </span>
      </div>

      {/* Search + Filters */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            aria-label="Search flashcards"
            placeholder="Search cards..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            style={{ ...s.input, paddingLeft: '2.2rem' }}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear flashcard search"
              onClick={() => handleSearchChange('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <select aria-label="Filter flashcards by level" value={levelFilter} onChange={e => handleLevelChange(e.target.value)} style={s.select}>
          <option value="all">All Levels</option>
          {LEVELS.map(l => (
            <option key={l} value={l}>{l} ({(fullVocabData[l] || []).length})</option>
          ))}
        </select>
        <button type="button" aria-pressed={medicalOnly} onClick={toggleMedical} style={s.filterBtn(medicalOnly)}>
          {medicalOnly ? '✓ ' : ''}Medical
        </button>
      </div>

      {/* Card count */}
      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
        {search || medicalOnly || levelFilter !== (levelId || 'all') ? `${words.length} cards available` : `${words.length} cards`}
      </p>

      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={flipped ? 'Hide flashcard translation' : 'Reveal flashcard translation'}
        className="w-full rounded-xl p-10 text-center cursor-pointer transition-all min-h-[220px] flex items-center justify-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${flipped ? '#8b5cf6' : 'var(--border)'}`,
          boxShadow: flipped ? '0 0 30px rgba(139,92,246,0.15)' : 'none',
          color: 'var(--text-primary)',
        }}
      >
        <div>
          <div className="text-2xl font-bold mb-2 break-words">{flipped ? displayEnglish : displayGerman}</div>
          <div className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {flipped ? (
              <div>
                <div>{word.word}</div>
                {word.example && <div className="mt-2 italic">{displayExample}</div>}
                {word.exampleTranslation && <div className="mt-1 text-xs">{displayExampleTranslation}</div>}
              </div>
            ) : (
              <div>
                {word.partOfSpeech && <span className="inline-block px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: 'var(--accent)' }}>{word.partOfSpeech}</span>}
                <div className="mt-2">Click to reveal translation</div>
              </div>
            )}
          </div>
        </div>
      </button>

      {flipped && (
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => handleReview(1)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355' }}>
            <ThumbsDown size={16} /> Hard
          </button>
          <button onClick={() => handleReview(3)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(59,255,158,0.15)', color: '#3bff9e' }}>
            <ThumbsUp size={16} /> Good
          </button>
          <button onClick={() => handleReview(5)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(0,240,255,0.15)', color: 'var(--accent)' }}>
            <RefreshCw size={16} /> Easy
          </button>
        </div>
      )}
    </div>
  );
}
