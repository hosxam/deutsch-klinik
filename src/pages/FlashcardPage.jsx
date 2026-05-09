import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { getState, updateState, updateLevelProgress, recordVocabAnswer, getDailyFlashcardQueue } from '../utils/store';
import fullVocabData from '../data/germanVocabulary.json';
import { RefreshCw, ThumbsUp, ThumbsDown, RotateCcw, Search, X, ChevronRight } from 'lucide-react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, ProgressRing, LoadingState } from '../components/ui';

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
  const [filter, setFilter] = useState('due');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState(levelId || 'all');
  const [medicalOnly, setMedicalOnly] = useState(false);

  // When route levelId changes, sync the level filter
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

  // Filtered and queued cards
  const words = useMemo(() => {
    const state = getState();
    const today = getLocalDateKey();
    let filtered = [...searchedWords];

    if (filter === 'due') {
      filtered = filtered.filter(w => {
        const card = state.vocabularyMastery[w.id] || state.flashcards?.[`${w._level}_${w.id}`];
        return !card || card.due <= today || !card.mastered;
      });
      // Apply daily queue for "due" filter
      const ids = filtered.map(w => `${w._level}_${w.id}`);
      const queuedIds = new Set(getDailyFlashcardQueue(ids));
      filtered = filtered.filter(w => queuedIds.has(`${w._level}_${w.id}`));
    } else if (filter === 'weak') {
      filtered = filtered.filter(w => {
        const card = state.vocabularyMastery[w.id] || state.flashcards?.[`${w._level}_${w.id}`];
        return card && (card.repetitions < 2 || card.ease < 2.3);
      });
    }

    return filtered.sort((a, b) => `${a._level}_${a.id}`.localeCompare(`${b._level}_${b.id}`));
  }, [searchedWords, filter]);

  // Compute stats for StatCards
  const stats = useMemo(() => {
    const state = getState();
    const today = getLocalDateKey();
    let dueCount = 0;
    let newCount = 0;
    let reviewCount = 0;

    searchedWords.forEach(w => {
      const card = state.vocabularyMastery[w.id] || state.flashcards?.[`${w._level}_${w.id}`];
      if (!card) {
        newCount++;
        dueCount++;
      } else if (!card.mastered || card.due <= today) {
        dueCount++;
      }
      if (card && card.repetitions > 0) {
        reviewCount++;
      }
    });

    return { dueCount, newCount, reviewCount };
  }, [searchedWords]);

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
      <PageShell maxWidth="max-w-4xl">
        <LoadingState message={`No vocabulary for ${levelFilter}`} />
        <div className="text-center mt-4">
          <Link to={`/level/${levelFilter}/vocabulary`} style={{ color: 'var(--accent)' }}>Back to Vocabulary</Link>
        </div>
      </PageShell>
    );
  }

  // Handle review rating: 1=Again, 2=Hard, 3=Good, 4=Easy
  const handleReview = (rating) => {
    const word = words[index];
    const labels = ['', 'Again', 'Hard', 'Good', 'Easy'];
    recordVocabAnswer(`${word._level}_${word.id}`, rating, {
      level: word._level,
      userAnswer: rating >= 3 ? 'Knew it' : '[flashcard]',
      correctAnswer: word.translation || word.english || word.word || '',
      translation: word.translation,
      topic: word.topic || 'Vocabulary',
    });
    updateLevelProgress(word._level, 'vocab', {
      date: new Date().toISOString(),
      wordId: word.id,
      correct: rating >= 3,
    });
    setReviews([...reviews, { wordId: word.id, level: word._level, rating, label: labels[rating] }]);
    if (index < words.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎴</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Session Complete!</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{words.length} cards reviewed</p>
          <div className="mb-6">
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Ratings breakdown:</div>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355' }}>
                <div className="font-bold">{reviews.filter(r => r.rating === 1).length}</div>
                <div>Again</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255,170,51,0.1)', color: '#ffaa33' }}>
                <div className="font-bold">{reviews.filter(r => r.rating === 2).length}</div>
                <div>Hard</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e' }}>
                <div className="font-bold">{reviews.filter(r => r.rating === 3).length}</div>
                <div>Good</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>
                <div className="font-bold">{reviews.filter(r => r.rating === 4).length}</div>
                <div>Easy</div>
              </div>
            </div>
          </div>
          <Link to={`/level/${levelId}/vocabulary`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            Back to Vocabulary
          </Link>
        </div>
      </PageShell>
    );
  }

  if (words.length === 0) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="mb-4">
          <SectionHeader
            title="Flashcards"
            subtitle={
              <div className="flex items-center gap-2">
                {levelFilter !== 'all' && <LevelBadge level={levelFilter} />}
                <span>0 cards</span>
              </div>
            }
            action={
              <Link to={`/level/${levelId}/vocabulary`} style={{ color: 'var(--accent)' }}>&larr; Back</Link>
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button variant="primary" size="sm">Due ({stats.dueCount})</Button>
          <Button variant="success" size="sm">New ({stats.newCount})</Button>
          <Button variant="ghost" size="sm">Reviews ({stats.reviewCount})</Button>
        </div>

        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          {FILTERS.map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

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

        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>No flashcards match these filters</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { handleSearchChange(''); setMedicalOnly(false); handleLevelChange(levelId || 'all'); }}
          >
            Clear Filters
          </Button>
        </div>
      </PageShell>
    );
  }

  const word = words[index];
  const displayGerman = displayWord(word);
  const displayEnglish = word.translation || '';
  const displayExample = word.example || '';
  const displayExampleTranslation = word.exampleTranslation || '';
  const progressPct = words.length > 0 ? ((index) / words.length) * 100 : 0;

  return (
    <PageShell maxWidth="max-w-lg">
      <div className="mb-4">
        <SectionHeader
          title="Flashcards"
          subtitle={
            <div className="flex items-center gap-2">
              {word._level && <LevelBadge level={word._level} />}
              <span>{index + 1}/{words.length}</span>
            </div>
          }
          action={
            <Link to={`/level/${levelId}/vocabulary`} style={{ color: 'var(--accent)' }}>&larr; Back</Link>
          }
        />
      </div>

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

      {/* Filter bar */}
      <div className="flex gap-2 justify-center mb-3 flex-wrap">
        {FILTERS.map(f => (
          <Button
            key={f.key}
            variant={filter === f.key ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleFilterChange(f.key)}
          >
            {f.label}
          </Button>
        ))}
        <span className="text-xs px-2 py-1" style={{ color: 'var(--text-muted)' }}>
          {words.length} cards
        </span>
      </div>

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
            <button aria-label="Clear flashcard search" onClick={() => handleSearchChange('')} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}><X size={16} /></button>
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

      {/* Flashcard */}
      <Card
        className="cursor-pointer min-h-[220px] flex items-center justify-center text-center p-10"
        style={{
          borderColor: flipped ? '#8b5cf6' : 'var(--border)',
          boxShadow: flipped ? '0 0 30px rgba(139,92,246,0.15)' : 'none',
        }}
        onClick={() => setFlipped(!flipped)}
        hover={false}
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
