import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getState, updateLevelProgress, recordVocabAnswer, getVocabMastery } from '../utils/store';
import vocabData from '../data/germanVocabulary.json';
import LevelLock from '../components/LevelLock';
import { Shuffle, BookMarked, CheckCircle, XCircle, Brain, Search, Filter, X, Hash, RotateCcw } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const POS_GROUPS = {
  noun: 'noun', verb: 'verb', adjective: 'adjective', adj: 'adjective',
  adverb: 'adverb', phrase: 'phrase', preposition: 'preposition',
  'modal verb': 'other', conjunction: 'other', number: 'other', 'question word': 'other',
};

const POS_FILTERS = ['all', 'noun', 'verb', 'adjective', 'adverb', 'phrase', 'other'];
const FILTERS_LS_KEY = 'deutsch_klinik_vocab_filters';

function loadSavedFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed;
  } catch { return null; }
}
function saveFilters(filters) {
  try { localStorage.setItem(FILTERS_LS_KEY, JSON.stringify(filters)); } catch {}
}
function clearSavedFilters() {
  try { localStorage.removeItem(FILTERS_LS_KEY); } catch {}
}

const MEDICAL_KEYWORDS = [
  'medical','health','klinik','hospital','doctor','patient','pharmacy','apotheke',
  'emergency','notfall','surgery','operation','orthopedics','orthopädie','diagnosis',
  'diagnose','diagnostic','therapy','therapie','documentation','dokumentation','fsp',
  'ethics','ethik','symptom','treatment','behandlung','prescription','rezept',
  'medication','medikament','examination','untersuchung','ward','station',
  'clinic','klinisch','nurse','krankenschwester','pflege','arzt','ärztlich',
  'krankheit','disease','infection','infektion','injury','verletzung',
  'pain','schmerz','fever','fieber','blood','blut','pressure','druck',
  'heart','herz','lung','lunge','bone','knochen','muscle','muskel',
  'nerve','nerv','brain','gehirn','skin','haut','cell','zelle',
  'anatomy','anatomie','physiology','physiologie','pathology','pathologie',
  'psychiatry','psychiatrie','psychology','psychologie','therapy','physio',
  'rehabilitation','reha','vaccination','impfung','screening','vorsorge',
  'imaging','bildgebung','ultraschall','röntgen','mrt','ct','ekg',
  'endoscopy','endoskopie','biopsy','biopsie','laboratory','labor',
  'pharmacology','pharmakologie','oncology','onkologie','cardiology',
  'kardiologie','neurology','neurologie','pediatrics','pädiatrie',
  'germ','keim','antibiotic','antibiotikum','surgery','chirurgie',
  'anesthesia','anästhesie','intensive care','intensiv','icu',
  'palliative','palliativ','hospice','hospiz','ethics committee',
  'ethikkommission','informed consent','aufklärung','patient education',
  'compliance','adhärenz','prognosis','prognose','diagnosis',
  'differential diagnosis','differentialdiagnose','follow-up',
  'nachsorge','aftercare','recovery','genesung','wound','wunde',
  'bandage','verband','cast','gips','crutch','krücke','wheelchair',
  'rollstuhl','stretcher','trage','ambulance','krankenwagen','rettung',
  'first aid','erste hilfe','hygiene','hygiene','sterile','steril',
  'disinfection','desinfektion','quarantine','quarantäne','isolation',
  'side effect','nebenwirkung','allergy','allergie','chronic','chronisch',
  'acute','akut','benign','gutartig','malignant','bösartig','tumor',
  'cancer','krebs','diabetes','diabetes','hypertension','hypertonie',
  'asthma','asthma','stroke','schlaganfall','heart attack','infarkt',
  'pneumonia','lungenentzündung','fracture','fraktur','sprain',
  'verstauchung','dislocation','luxation','hernia','hernie',
  'appendicitis','blinddarmentzündung','ulcer','geschwür','inflammation',
  'entzündung','edema','ödem','swelling','schwellung',
  'public health','gesundheitswesen','health insurance','krankenkasse',
  'sick note','krankschreibung','medical certificate','attest',
  'discharge','entlassung','referral','überweisung','admission',
  'aufnahme','chart','akte','medical record','krankenakte',
  'healthcare','gesundheitsversorgung','health system','gesundheitssystem',
];

function wordPos(w) {
  return w.partOfSpeech || 'other';
}

function wordNounArticle(w) {
  return w.article || '';
}

function isMedicalWord(word) {
  const fields = [
    word.word, word.translation, word.topic, word.example, word.exampleTranslation,
    ...(word.tags || []), word.lessonId, word.category
  ].filter(Boolean).map(f => f.toLowerCase());
  const searchText = fields.join(' ');
  return MEDICAL_KEYWORDS.some(kw => searchText.includes(kw.toLowerCase()));
}

function isConnectorWord(word) {
  const pos = wordPos(word);
  return pos === 'conjunction' || pos === 'preposition' || pos === 'adverb' || pos === 'phrase';
}

function isFormalWord(word) {
  const tags = (word.tags || []).map(t => t.toLowerCase());
  const fields = [word.word, word.translation, word.topic].filter(Boolean).map(f => f.toLowerCase());
  const combined = [...tags, ...fields].join(' ');
  return /formal|formell|officious|amtlich|bürokratisch|behörde|official|schriftlich|gehoben/.test(combined);
}

function isExamWord(word) {
  const tags = (word.tags || []).map(t => t.toLowerCase());
  const fields = [word.word, word.translation, word.topic].filter(Boolean).map(f => f.toLowerCase());
  const combined = [...tags, ...fields].join(' ');
  return /exam|prüfung|test|fsp|goethe|telc|ösd|b1|b2|c1|a1|a2|important|wichtig|common|häufig|key|schlüssel/.test(combined);
}

function displayWord(word) {
  const articleMatch = word.word.match(/^(der|die|das)\s+(.+)/i);
  if (articleMatch) {
    return { display: articleMatch[2], article: articleMatch[1].toLowerCase() };
  }
  return { display: word.word, article: wordNounArticle(word) };
}

const allWords = LEVELS.flatMap(level =>
  (vocabData[level] || []).map(w => ({ ...w, _level: level }))
);

function validateFilter(key, value, allowed) {
  if (value === undefined || value === null) return false;
  if (allowed && !allowed.includes(value)) return false;
  return true;
}

export default function VocabularyPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDaily = searchParams.get('daily') === '1';
  const dailyLimit = parseInt(searchParams.get('limit') || '10', 10);

  // In daily mode, start in practice mode with a limited set of words
  const initialMode = isDaily ? 'quiz' : 'browse';

  const [mode, setMode] = useState(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [posFilter, setPosFilter] = useState('all');
  const [lessonFilter, setLessonFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState(null);
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const saved = loadSavedFilters();
    if (saved) {
      if (validateFilter('search', saved.search)) setSearch(saved.search);
      if (validateFilter('levelFilter', saved.levelFilter, [...LEVELS, 'all'])) setLevelFilter(saved.levelFilter);
      if (validateFilter('posFilter', saved.posFilter, POS_FILTERS)) setPosFilter(saved.posFilter);
      if (validateFilter('lessonFilter', saved.lessonFilter)) setLessonFilter(saved.lessonFilter);
      if (validateFilter('quickFilter', saved.quickFilter)) setQuickFilter(saved.quickFilter);
      if (validateFilter('masteryFilter', saved.masteryFilter, ['all', 'unseen', 'weak', 'mastered'])) setMasteryFilter(saved.masteryFilter);
    }
    setFiltersLoaded(true);
  }, []);

  // Reset state when levelId changes
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setQuizDone(false);
    setQuizScore(0);
    setQuizTotal(0);
    setMode(isDaily ? 'quiz' : 'browse');
  }, [levelId]);

  // Save filters to localStorage when they change (only after initial load)
  useEffect(() => {
    if (!filtersLoaded) return;
    saveFilters({ search, levelFilter, posFilter, lessonFilter, quickFilter, masteryFilter });
  }, [search, levelFilter, posFilter, lessonFilter, quickFilter, masteryFilter, filtersLoaded]);

  // Derive which words to show based on level filter
  const levelWords = useMemo(() => {
    if (levelFilter === 'all') return allWords;
    return (vocabData[levelFilter] || []).map(w => ({ ...w, _level: levelFilter }));
  }, [levelFilter]);

  // Validate lesson filter when level changes
  const validLessonFilter = useMemo(() => {
    const lessonsSet = new Set();
    levelWords.forEach(w => { if (w.lessonId) lessonsSet.add(w.lessonId); });
    if (lessonFilter !== 'all' && !lessonsSet.has(lessonFilter)) return 'all';
    return lessonFilter;
  }, [lessonFilter, levelWords]);

  // Filtered words based on all active filters
  const filteredWords = useMemo(() => {
    let words = levelWords;

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      words = words.filter(w =>
        w.word.toLowerCase().includes(q) ||
        (w.translation || '').toLowerCase().includes(q) ||
        (w.example || '').toLowerCase().includes(q) ||
        (w.exampleTranslation || '').toLowerCase().includes(q) ||
        (w.topic || '').toLowerCase().includes(q) ||
        (w.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (w.article || '').toLowerCase().includes(q)
      );
    }

    // Part of speech filter
    if (posFilter !== 'all') {
      if (posFilter === 'noun') {
        words = words.filter(w => wordPos(w) === 'noun');
      } else if (posFilter === 'verb') {
        words = words.filter(w => wordPos(w) === 'verb');
      } else if (posFilter === 'adjective') {
        words = words.filter(w => wordPos(w) === 'adjective' || wordPos(w) === 'adj');
      } else if (posFilter === 'adverb') {
        words = words.filter(w => wordPos(w) === 'adverb');
      } else if (posFilter === 'phrase') {
        words = words.filter(w => wordPos(w) === 'phrase');
      } else {
        words = words.filter(w => {
          const p = wordPos(w);
          return p !== 'noun' && p !== 'verb' && p !== 'adjective' && p !== 'adj' && p !== 'adverb' && p !== 'phrase';
        });
      }
    }

    // Quick filter (mutually exclusive categories)
    if (quickFilter === 'medical') {
      words = words.filter(w => isMedicalWord(w));
    } else if (quickFilter === 'nouns') {
      words = words.filter(w => wordPos(w) === 'noun');
    } else if (quickFilter === 'verbs') {
      words = words.filter(w => wordPos(w) === 'verb');
    } else if (quickFilter === 'connectors') {
      words = words.filter(w => isConnectorWord(w));
    } else if (quickFilter === 'formal') {
      words = words.filter(w => isFormalWord(w));
    } else if (quickFilter === 'exam') {
      words = words.filter(w => isExamWord(w));
    }

    // Mastery filter
    if (masteryFilter !== 'all') {
      words = words.filter(w => {
        const mastery = getVocabMastery(`${w._level}_${w.id}`);
        if (masteryFilter === 'unseen') return mastery.correct === 0 && mastery.incorrect === 0;
        if (masteryFilter === 'weak') return mastery.incorrect > mastery.correct;
        if (masteryFilter === 'mastered') return mastery.mastered;
        return true;
      });
    }

    // Lesson filter
    if (validLessonFilter !== 'all') {
      words = words.filter(w => w.lessonId === validLessonFilter);
    }

    return words;
  }, [levelWords, search, posFilter, quickFilter, masteryFilter, validLessonFilter]);

  // Unique lessons for the lesson filter (within selected level)
  const lessons = useMemo(() => {
    const set = new Set();
    levelWords.forEach(w => { if (w.lessonId) set.add(w.lessonId); });
    return [...set].sort();
  }, [levelWords]);

  // Quick filter counts
  const quickFilterCounts = useMemo(() => {
    return {
      nouns: levelWords.filter(w => wordPos(w) === 'noun').length,
      verbs: levelWords.filter(w => wordPos(w) === 'verb').length,
      medical: levelWords.filter(w => isMedicalWord(w)).length,
      connectors: levelWords.filter(w => isConnectorWord(w)).length,
      formal: levelWords.filter(w => isFormalWord(w)).length,
      exam: levelWords.filter(w => isExamWord(w)).length,
    };
  }, [levelWords]);

  const clearAllFilters = useCallback(() => {
    setSearch('');
    setLevelFilter('all');
    setPosFilter('all');
    setLessonFilter('all');
    setQuickFilter(null);
    setMasteryFilter('all');
    clearSavedFilters();
  }, []);

  const hasActiveFilters = search || levelFilter !== 'all' || posFilter !== 'all' || lessonFilter !== 'all' || quickFilter || masteryFilter !== 'all';

  const activeFilterLabels = useMemo(() => {
    const labels = [];
    if (levelFilter !== 'all') labels.push(`Level: ${levelFilter}`);
    if (posFilter !== 'all') labels.push(`Type: ${posFilter}`);
    if (quickFilter) {
      const qfLabels = { nouns: 'Nouns', verbs: 'Verbs', medical: 'Medical', connectors: 'Connectors', formal: 'Formal', exam: 'Exam' };
      labels.push(qfLabels[quickFilter] || quickFilter);
    }
    if (masteryFilter !== 'all') labels.push(`Mastery: ${masteryFilter}`);
    if (lessonFilter !== 'all') labels.push(`Lesson: ${lessonFilter}`);
    if (search) labels.push(`"${search}"`);
    return labels;
  }, [levelFilter, posFilter, quickFilter, masteryFilter, lessonFilter, search]);

  const s = {
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' },
    btn: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
    btnPrimary: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    tag: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' },
    select: { padding: '0.5rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', minWidth: '80px' },
    filterBtn: (active) => ({
      padding: '0.4rem 0.8rem', borderRadius: '6px', border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
      background: active ? 'rgba(0,240,255,0.1)' : 'var(--bg-hover)',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      cursor: 'pointer', fontSize: '0.75rem', fontWeight: active ? 600 : 400,
    }),
  };

  // Quiz mode
  if (mode === 'quiz') {
    const allLevelWords = vocabData[levelId] || [];
    // In daily mode, pick dailyLimit words; otherwise use all words
    const words = isDaily
      ? [...allLevelWords].sort(() => Math.random() - 0.5).slice(0, Math.min(dailyLimit, allLevelWords.length))
      : allLevelWords;

    const startQuiz = () => {
      setCurrentIndex(0);
      setQuizScore(0);
      setQuizTotal(0);
      setShowAnswer(false);
      setQuizDone(false);
    };

    if (quizDone) {
      return (
        <LevelLock levelId={levelId}>
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
          <div style={s.card}>
            <CheckCircle size={40} color="#22c55e" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.75rem' }}>
              {isDaily ? 'Daily Mission Complete!' : 'Quiz Complete!'}
            </h2>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', margin: '0.5rem 0' }}>{quizScore}/{quizTotal}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {isDaily ? (
                <Link to="/" style={{ ...s.btnPrimary, textDecoration: 'none' }}>Back to Dashboard</Link>
              ) : (
                <>
                  <button style={s.btn} onClick={() => { setMode('browse'); setCurrentIndex(0); }}>Browse Words</button>
                  <button style={s.btnPrimary} onClick={startQuiz}>Try Again</button>
                </>
              )}
            </div>
          </div>
        </div>
        </LevelLock>
      );
    }

    const word = words[currentIndex];
    return (
      <LevelLock levelId={levelId}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={s.tag}>{isDaily ? 'Daily Vocabulary Mission' : 'Quiz Mode'}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentIndex + 1}/{words.length} | Score: {quizScore}/{quizTotal}</span>
        </div>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{showAnswer ? word.translation : word.word}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {showAnswer ? 'Translation' : 'What does this mean?'}
            </p>
          </div>
          {!showAnswer ? (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button style={{ ...s.btn, border: '2px solid #ef4444', padding: '0.75rem 2rem' }} onClick={() => handleQuizAnswer(false)}>I don't know</button>
              <button style={{ ...s.btnPrimary, padding: '0.75rem 2rem' }} onClick={() => handleQuizAnswer(true)}>I know it</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Example: "{word.example}"</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Topic: {word.topic}</p>
            </div>
          )}
        </div>
      </div>
      </LevelLock>
    );
  }

  // Browse mode
  const words = (vocabData[levelId] || []);

  // Empty vocab check
  if (words.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ color: 'var(--text-muted)' }}>No vocabulary yet for {levelId}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Add words to germanVocabulary.json with level field set to {levelId}</p>
        <Link to={`/level/${levelId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  const handleQuizAnswer = (correct) => {
    const word = words[currentIndex];
    setQuizTotal(quizTotal + 1);
    if (correct) setQuizScore(quizScore + 1);
    setShowAnswer(true);
    recordVocabAnswer(`${levelId}_${word.id}`, correct);
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        setQuizDone(true);
        updateLevelProgress(levelId, 'vocab', { date: new Date().toISOString(), score: quizScore + (correct ? 1 : 0), total: words.length });
      }
    }, 800);
  };

  // Use the filtered list for browsing
  const browseWords = filteredWords;
  const totalWords = levelWords.length;

  return (
    <LevelLock levelId={levelId}>
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>
            {levelId} Vocabulary
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {words.length} words
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={s.btn} onClick={() => setCurrentIndex(Math.floor(Math.random() * words.length))}>
            <Shuffle size={14} style={{ marginRight: '0.4rem' }} />Random
          </button>
          <button style={s.btnPrimary} onClick={() => navigate(`/level/${levelId}/vocabulary/practice`)}>
            <Hash size={14} style={{ marginRight: '0.4rem' }} />Practice
          </button>
          <button style={s.btnPrimary} onClick={() => setMode('quiz')}>
            <Brain size={14} style={{ marginRight: '0.4rem' }} />Start Quiz
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by German, English, topic, or example..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentIndex(0); }}
            style={{ ...s.input, paddingLeft: '2.2rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter dropdowns row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <Filter size={14} style={{ color: 'var(--text-muted)' }} />

        {/* Level filter */}
        <select
          value={levelFilter}
          onChange={e => { setLevelFilter(e.target.value); setCurrentIndex(0); }}
          style={s.select}
        >
          <option value="all">All Levels</option>
          {LEVELS.map(l => (
            <option key={l} value={l}>{l} ({(vocabData[l] || []).length})</option>
          ))}
        </select>

        {/* Part of speech filter */}
        <select
          value={posFilter}
          onChange={e => { setPosFilter(e.target.value); setCurrentIndex(0); }}
          style={s.select}
        >
          {POS_FILTERS.map(p => (
            <option key={p} value={p}>{p === 'all' ? 'All Types' : p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>

        {/* Mastery filter */}
        <select
          value={masteryFilter}
          onChange={e => { setMasteryFilter(e.target.value); setCurrentIndex(0); }}
          style={s.select}
        >
          <option value="all">All Mastery</option>
          <option value="unseen">Unseen</option>
          <option value="weak">Weak</option>
          <option value="mastered">Mastered</option>
        </select>

        {/* Lesson filter (only when a specific level is selected) */}
        {levelFilter !== 'all' && lessons.length > 0 && (
          <select
            value={validLessonFilter}
            onChange={e => { setLessonFilter(e.target.value); setCurrentIndex(0); }}
            style={s.select}
          >
            <option value="all">All Lessons</option>
            {lessons.map(lid => (
              <option key={lid} value={lid}>{lid}</option>
            ))}
          </select>
        )}

        {/* Reset filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{ ...s.btn, color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Quick filter buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {[
          { key: 'nouns', label: 'Nouns', count: quickFilterCounts.nouns },
          { key: 'verbs', label: 'Verbs', count: quickFilterCounts.verbs },
          { key: 'medical', label: 'Medical', count: quickFilterCounts.medical },
          { key: 'connectors', label: 'Connectors', count: quickFilterCounts.connectors },
          { key: 'formal', label: 'Formal', count: quickFilterCounts.formal },
          { key: 'exam', label: 'Exam', count: quickFilterCounts.exam },
        ].map(qf => (
          <button
            key={qf.key}
            onClick={() => { setQuickFilter(quickFilter === qf.key ? null : qf.key); setCurrentIndex(0); }}
            style={s.filterBtn(quickFilter === qf.key)}
          >
            {qf.label}
            <span style={{ marginLeft: '0.3rem', opacity: 0.6, fontSize: '0.7rem' }}>{qf.count}</span>
          </button>
        ))}
      </div>

      {/* Active filter labels */}
      {activeFilterLabels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active filters:</span>
          {activeFilterLabels.map((label, i) => (
            <span key={i} style={{ ...s.tag, background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', fontSize: '0.7rem' }}>{label}</span>
          ))}
        </div>
      )}

      {/* Result count */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Showing {browseWords.length} of {totalWords} words
      </p>

      {/* No results state */}
      {browseWords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <X size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No vocabulary found for this search/filter.</p>
          <button style={{ ...s.btn, marginTop: '1rem' }} onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Word list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {browseWords.slice(0, 100).map((word, idx) => {
              const { display, article } = displayWord(word);
              const isNoun = wordPos(word) === 'noun';
              const mastery = getVocabMastery(`${word._level}_${word.id}`);
              return (
                <div key={word.id} style={s.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      {/* Word + article for nouns */}
                      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {isNoun && article && (
                          <span style={{ color: word.article === 'der' ? '#ef4444' : word.article === 'die' ? '#3b82f6' : word.article === 'das' ? '#22c55e' : 'var(--text-muted)', fontWeight: 400, marginRight: '0.3rem' }}>
                            {article}
                          </span>
                        )}
                        <span style={{ color: 'var(--text-primary)' }}>{display}</span>
                        {isNoun && word.plural != null && word.plural !== '' && (
                          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.3rem' }}>
                            ({word.plural})
                          </span>
                        )}
                      </div>

                      {/* Translation */}
                      <div style={{ fontSize: '0.9rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                        {word.translation}
                      </div>

                      {/* Example */}
                      {word.example && word.exampleTranslation && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                          "{word.example}" — {word.exampleTranslation}
                        </div>
                      )}

                      {/* Topic / tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                        {word.topic && <span style={s.tag}>{word.topic}</span>}
                        {wordPos(word) !== 'other' && <span style={{ ...s.tag, background: 'rgba(0,240,255,0.08)', color: 'var(--accent)' }}>{wordPos(word)}</span>}
                        {word.lessonId && <span style={{ ...s.tag, background: 'rgba(139,92,246,0.08)', color: '#a78bfa' }}>{word.lessonId}</span>}
                      </div>
                    </div>

                    {/* Mastery indicator */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      {mastery.mastered && <CheckCircle size={18} color="#22c55e" />}
                      {!mastery.mastered && mastery.correct + mastery.incorrect > 0 && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ✓{mastery.correct} ✗{mastery.incorrect}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show count at bottom too */}
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Showing {Math.min(browseWords.length, 100)} of {browseWords.length} words
            {browseWords.length > 100 && ' (first 100 shown)'}
          </p>
        </>
      )}
    </div>
    </LevelLock>
  );
}
