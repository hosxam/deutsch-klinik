import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import { getState, recordVocabAnswer, getVocabMastery, updateLevelProgress } from '../utils/store';
import vocabData from '../data/germanVocabulary.json';
import LevelLock from '../components/LevelLock';
import {
  Hash, Shuffle, CheckCircle, XCircle, ArrowLeft, ArrowRight,
  RefreshCw, List, Filter, BookMarked, Beaker,
  ClipboardCopy, Download,
} from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const PRACTICE_MODES = [
  {
    key: 'article',
    label: 'Article Practice',
    icon: Hash,
    desc: 'Guess the correct article (der/die/das)',
    color: '#22c55e',
  },
  {
    key: 'plural',
    label: 'Plural Practice',
    icon: Beaker,
    desc: 'Type the plural form of the noun',
    color: '#a78bfa',
  },
  {
    key: 'fillblank',
    label: 'Fill in the Blank',
    icon: BookMarked,
    desc: 'Complete the sentence with the missing word',
    color: '#f59e0b',
  },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Article colors
const articleColor = (art) => {
  if (art === 'der') return '#ef4444';
  if (art === 'die') return '#3b82f6';
  if (art === 'das') return '#22c55e';
  return 'var(--text-muted)';
};

function stripLeadingArticle(word) {
  return word.replace(/^(der|die|das)\s+/i, '').trim();
}

// Get unique topics from a level's words, sorted alphabetically
function getTopics(level) {
  const words = vocabData[level] || [];
  const topics = new Set();
  words.forEach(w => {
    if (w.topic && w.topic.trim()) topics.add(w.topic.trim());
  });
  return [...topics].sort();
}

// Filter a word array by topic (empty string or 'all' means no filter)
function filterByTopic(words, topic) {
  if (!topic || topic === 'all') return words;
  return words.filter(w => (w.topic || '').trim().toLowerCase() === topic.toLowerCase());
}

// Generate article questions from words that have article field
function getArticleQuestions(level, topic) {
  const words = filterByTopic(vocabData[level] || [], topic);
  return words
    .filter(w => w.article && w.article.trim())
    .map((w, idx) => {
      const display = stripLeadingArticle(w.word);
      return {
        id: `article_${level}_${w.id || idx}`,
        word: display,
        article: w.article.toLowerCase(),
        translation: w.translation || '',
        plural: w.plural || '',
        sourceWord: w,
        prompt: `What is the article for "${display}"?`,
        answer: w.article.toLowerCase(),
        hint: w.translation,
      };
    });
}

// Generate plural questions from words that have plural field
function getPluralQuestions(level, topic) {
  const words = filterByTopic(vocabData[level] || [], topic);
  return words
    .filter(w => w.plural && w.plural.trim())
    .map((w, idx) => {
      const display = stripLeadingArticle(w.word);
      return {
        id: `plural_${level}_${w.id || idx}`,
        word: display,
        article: w.article ? w.article.toLowerCase() : '',
        plural: w.plural,
        translation: w.translation || '',
        sourceWord: w,
        prompt: `What is the plural of "${display}"?`,
        answer: w.plural,
        hint: `${w.article ? w.article + ' ' : ''}(${w.translation})`,
      };
    });
}

// Check if a word has a real sentence example (not just word: translation)
function hasRealExample(w) {
  const ex = (w.example || '').trim();
  if (!ex) return false;
  const idx = ex.indexOf(':');
  if (idx > 0) {
    const before = ex.substring(0, idx).trim().toLowerCase();
    const after = ex.substring(idx + 1).trim().toLowerCase();
    const strippedBefore = stripLeadingArticle(before);
    const strippedWord = stripLeadingArticle(w.word.toLowerCase());
    const isJustDef = (before === w.word.toLowerCase() || strippedBefore === strippedWord || before === ((w.article || '') + ' ' + w.word).trim().toLowerCase()) &&
                      (after === (w.translation || '').toLowerCase() || !w.exampleTranslation);
    if (isJustDef) return false;
  }
  return true;
}

// Generate fill-in-the-blank questions from words with example field
function getFillBlankQuestions(level, topic) {
  const words = filterByTopic(vocabData[level] || [], topic);
  return words
    .filter(w => hasRealExample(w))
    .map((w, idx) => {
      const ex = (w.example || '').trim();
      const wordClean = stripLeadingArticle(w.word);
      // Create a blank: replace the word in the example with _____
      // Match case-insensitively
      let blanked = ex;
      let answer = wordClean;

      // Try replacing the first occurrence of the word in the example
      const escapedWord = wordClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const wordInExample = new RegExp(`\\b${escapedWord}\\b`, 'i');
      if (wordInExample.test(ex)) {
        blanked = ex.replace(wordInExample, '_____');
      } else {
        // Try article + word
        const artWord = ((w.article || '') + ' ' + wordClean).trim();
        const escapedArtWord = artWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const artWordRe = new RegExp(`\\b${escapedArtWord}\\b`, 'i');
        if (artWordRe.test(ex)) {
          blanked = ex.replace(artWordRe, '_____');
          answer = artWord;
        }
      }

      return {
        id: `fill_${level}_${w.id || idx}`,
        word: wordClean,
        article: w.article || '',
        translation: w.translation || '',
        sourceWord: w,
        prompt: 'Fill in the blank:',
        fullSentence: blanked,
        answer: answer,
        hint: w.translation,
        exampleTranslation: w.exampleTranslation || '',
      };
    });
}

// Normalize answer for comparison
function normalizeAnswer(a) {
  return a.trim().toLowerCase().replace(/\s+/g, ' ').replace(/^der |^die |^das /i, '').trim();
}

export default function PracticePage() {
  const { levelId } = useParams();
  const [mode, setMode] = useState(null); // null = pick mode, or 'article'/'plural'/'fillblank'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [sessionResults, setSessionResults] = useState([]);

  // Level filter state
  const [selectedLevel, setSelectedLevel] = useState(levelId);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topicSearch, setTopicSearch] = useState('');
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [topicHighlightedIndex, setTopicHighlightedIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(20);

  // Available topics for the selected level
  const availableTopics = useMemo(() => getTopics(selectedLevel), [selectedLevel]);

  // Filtered topic options for the searchable dropdown
  const filteredTopicOptions = useMemo(() => {
    const results = ['All topics'];
    const q = topicSearch.toLowerCase().trim();
    if (!q) return [...results, ...availableTopics];
    availableTopics.forEach(t => {
      if (t.toLowerCase().includes(q)) results.push(t);
    });
    return results;
  }, [topicSearch, availableTopics]);

  const s = {
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' },
    btn: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
    btnPrimary: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    btnSuccess: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    btnDanger: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' },
    input: { width: '100%', padding: '0.7rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' },
    select: { padding: '0.5rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', minWidth: '80px' },
    tag: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
  };

  // Generate questions when starting
  const startPractice = useCallback(() => {
    let qs = [];
    if (mode === 'article') {
      qs = getArticleQuestions(selectedLevel, selectedTopic);
    } else if (mode === 'plural') {
      qs = getPluralQuestions(selectedLevel, selectedTopic);
    } else if (mode === 'fillblank') {
      qs = getFillBlankQuestions(selectedLevel, selectedTopic);
    }

    qs = shuffleArray(qs);
    setQuestions(qs.slice(0, questionCount));
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setResult(null);
    setUserAnswer('');
    setShowHint(false);
    setQuizDone(false);
    setMistakes([]);
    setSessionResults([]);
    setReviewingMistakes(false);
  }, [mode, selectedLevel, selectedTopic, questionCount]);

  // Review mistakes only mode
  const [reviewingMistakes, setReviewingMistakes] = useState(false);

  const questionsReady = questions.length > 0;
  const currentQ = questionsReady ? questions[currentIndex] : null;
  const totalQ = questions.length;
  const isMultiChoiceArticle = mode === 'article';

  const handleSubmitAnswer = () => {
    if (result) return;

    let isCorrect = false;
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(currentQ.answer);

    if (isMultiChoiceArticle) {
      isCorrect = userAnswer.toLowerCase() === currentQ.answer;
    } else {
      isCorrect = normalizedUser === normalizedCorrect ||
                  normalizedUser === normalizedCorrect.replace(/^die\s+/i, '') ||
                  normalizedUser === normalizedCorrect.replace(/^der\s+/i, '') ||
                  normalizedUser === normalizedCorrect.replace(/^das\s+/i, '');
    }

    setResult(isCorrect ? 'correct' : 'wrong');
    setScore(prev => isCorrect ? prev + 1 : prev);
    setTotalAnswered(prev => prev + 1);

    if (!isCorrect) {
      setMistakes(prev => [...prev, {
        question: currentQ,
        userAnswer,
        correctAnswer: currentQ.answer,
      }]);
    }

    setSessionResults(prev => [...prev, { id: currentQ.id, correct: isCorrect }]);

    const sourceWord = currentQ.sourceWord;
    if (sourceWord && sourceWord.id) {
      const wordId = `${sourceWord._level || selectedLevel}_${sourceWord.id}`;
      recordVocabAnswer(wordId, isCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setResult(null);
      setShowHint(false);
    } else {
      setQuizDone(true);
      updateLevelProgress(selectedLevel, 'vocab', {
        date: new Date().toISOString(),
        score,
        total: totalQ,
        mode,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !result) {
      if (userAnswer.trim()) {
        handleSubmitAnswer();
      }
    } else if (e.key === 'Enter' && result) {
      handleNext();
    }
  };

  // Mode selector
  if (!mode) {
    // Check question availability per level & topic & mode
    const topicWords = filterByTopic(vocabData[selectedLevel] || [], selectedTopic);
    const articleCount = topicWords.filter(w => w.article && w.article.trim()).length;
    const pluralCount = topicWords.filter(w => w.plural && w.plural.trim()).length;
    const fillCount = topicWords.filter(w => hasRealExample(w)).length;

    const modeAvailability = {
      article: articleCount,
      plural: pluralCount,
      fillblank: fillCount,
    };

    return (
      <LevelLock levelId={selectedLevel}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Link to={`/level/${selectedLevel}/vocabulary`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.85rem' }}>
              &larr; Back to Vocabulary
            </Link>
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
            Vocabulary Practice
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Choose a practice mode to get started.
          </p>

          {/* Level + topic + count selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedLevel}
              onChange={e => {
                setSelectedLevel(e.target.value);
                setSelectedTopic('all');
                setTopicSearch('');
                setTopicDropdownOpen(false);
                setTopicHighlightedIndex(0);
              }}
              style={s.select}
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{l} ({(vocabData[l] || []).length} words)</option>
              ))}
            </select>

            {/* Searchable topic selector */}
            <div style={{ position: 'relative', flex: '1 1 auto', minWidth: '140px', maxWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search topic..."
                value={topicSearch}
                onChange={e => {
                  setTopicSearch(e.target.value);
                  setTopicDropdownOpen(true);
                  setTopicHighlightedIndex(0);
                }}
                onFocus={() => setTopicDropdownOpen(true)}
                onBlur={() => setTimeout(() => setTopicDropdownOpen(false), 180)}
                onKeyDown={e => {
                  const opts = filteredTopicOptions;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setTopicDropdownOpen(true);
                    setTopicHighlightedIndex(prev => Math.min(prev + 1, opts.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setTopicDropdownOpen(true);
                    setTopicHighlightedIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter') {
                    if (opts.length === 0) return;
                    const idx = Math.min(topicHighlightedIndex, opts.length - 1);
                    const selected = opts[idx];
                    setSelectedTopic(selected === 'All topics' ? 'all' : selected);
                    setTopicSearch(selected === 'All topics' ? '' : selected);
                    setTopicDropdownOpen(false);
                  } else if (e.key === 'Escape') {
                    setTopicDropdownOpen(false);
                  }
                }}
                style={{
                  padding: '0.5rem 1.6rem 0.5rem 0.6rem',
                  fontSize: '0.85rem',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-hover)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              {/* Clear button when topic is selected */}
              {selectedTopic !== 'all' && (
                <button
                  onClick={() => {
                    setSelectedTopic('all');
                    setTopicSearch('');
                    setTopicDropdownOpen(false);
                    setTopicHighlightedIndex(0);
                  }}
                  style={{
                    position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.8rem', padding: '2px 6px',
                  }}
                  title="Clear topic filter"
                >
                  X
                </button>
              )}
              {topicDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  zIndex: 50, marginTop: '2px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  maxHeight: '200px', overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  {filteredTopicOptions.length === 0 ? (
                    <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No topics match
                    </div>
                  ) : filteredTopicOptions.map((t, idx) => {
                    const isHighlighted = idx === topicHighlightedIndex;
                    const isActive = (t === 'All topics' && selectedTopic === 'all') || (t === selectedTopic);
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const value = t === 'All topics' ? 'all' : t;
                          setSelectedTopic(value);
                          setTopicSearch(t === 'All topics' ? '' : t);
                          setTopicDropdownOpen(false);
                        }}
                        onMouseEnter={() => setTopicHighlightedIndex(idx)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '0.45rem 0.75rem', fontSize: '0.85rem',
                          background: isHighlighted ? 'var(--bg-hover)' : isActive ? 'var(--bg-secondary)' : 'transparent',
                          color: 'var(--text-primary)',
                          border: 'none', cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Questions:</span>
            <select
              value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))}
              style={s.select}
            >
              {[10, 20, 30, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Mode cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PRACTICE_MODES.map(pm => {
              const count = modeAvailability[pm.key];
              const Icon = pm.icon;
              return (
                <button
                  key={pm.key}
                  onClick={() => {
                    setMode(pm.key);
                    setCurrentIndex(0);
                    setScore(0);
                    setTotalAnswered(0);
                    setResult(null);
                    setUserAnswer('');
                    setShowHint(false);
                    setQuizDone(false);
                    setMistakes([]);
                    setSessionResults([]);
                    setReviewingMistakes(false);
                  }}
                  disabled={count === 0}
                  style={{
                    ...s.card,
                    cursor: count === 0 ? 'not-allowed' : 'pointer',
                    opacity: count === 0 ? 0.4 : 1,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    transition: 'all 0.2s',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => {
                    if (count > 0) e.currentTarget.style.borderColor = pm.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: `${pm.color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={22} color={pm.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {pm.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {pm.desc}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {count} questions
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </LevelLock>
    );
  }

  // Auto-start on mode select
  if (!questionsReady) {
    // Generate on first render
    const qs = (() => {
      if (mode === 'article') return getArticleQuestions(selectedLevel, selectedTopic);
      if (mode === 'plural') return getPluralQuestions(selectedLevel, selectedTopic);
      if (mode === 'fillblank') return getFillBlankQuestions(selectedLevel, selectedTopic);
      return [];
    })();

    if (qs.length > 0) {
      const shuffled = shuffleArray(qs);
      setQuestions(shuffled.slice(0, questionCount));
    } else {
      return (
        <LevelLock levelId={selectedLevel}>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No questions available for this mode at {selectedLevel}.</p>
            <button style={s.btn} onClick={() => setMode(null)}>Pick Another Mode</button>
          </div>
        </LevelLock>
      );
    }
  }

  const modeLabelForExport = PRACTICE_MODES.find(m => m.key === mode)?.label || mode;
  const topicLabelForExport = selectedTopic === 'all' ? 'All topics' : selectedTopic;

  const csvEscape = (v) => {
    if (v == null || v === '') return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const copyMistakesToClipboard = () => {
    const lines = mistakes.map(m => {
      const q = m.question;
      const sw = q.sourceWord;
      const parts = ['Word: ' + (q.word || '-'), 'Your answer: ' + m.userAnswer, 'Correct answer: ' + m.correctAnswer];
      if (q.translation) parts.push('Translation: ' + q.translation);
      if (q.article) parts.push('Article: ' + q.article);
      if (q.plural) parts.push('Plural: ' + q.plural);
      if (sw && sw.example) parts.push('Example: ' + sw.example);
      return parts.join(', ');
    });
    const text = 'Mode: ' + modeLabelForExport + ', Level: ' + selectedLevel + ', Topic: ' + topicLabelForExport + '\n\n' + lines.join('\n');
    navigator.clipboard.writeText(text);
  };

  const downloadMistakesCsv = () => {
    const header = 'mode,level,topic,question,userAnswer,correctAnswer,word,article,plural,translation,example';
    const rows = mistakes.map(m => {
      const q = m.question;
      const sw = q.sourceWord;
      return [
        csvEscape(modeLabelForExport),
        csvEscape(selectedLevel),
        csvEscape(topicLabelForExport),
        csvEscape(q.word || ''),
        csvEscape(m.userAnswer),
        csvEscape(m.correctAnswer),
        csvEscape(q.word || ''),
        csvEscape(q.article || ''),
        csvEscape(q.plural || ''),
        csvEscape(q.translation || ''),
        csvEscape(sw && sw.example || ''),
      ].join(',');
    });
    const csv = header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mistakes_' + selectedLevel + '_' + mode + '_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startMistakeReview = () => {
    const qs = mistakes.map(m => m.question);
    const shuffled = shuffleArray(qs);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setResult(null);
    setUserAnswer('');
    setShowHint(false);
    setQuizDone(false);
    setMistakes([]);
    setSessionResults([]);
    setReviewingMistakes(true);
  };

  // Helper to render mistake card details
  const renderMistakeCard = (m, idx) => {
    const q = m.question;
    const sw = q.sourceWord;
    const fields = [];
    if (q.word) fields.push({ label: 'Word', value: q.word });
    if (q.article) fields.push({ label: 'Article', value: q.article });
    if (q.translation) fields.push({ label: 'Translation', value: q.translation });
    if (q.plural) fields.push({ label: 'Plural', value: q.plural });
    if (sw?.example) fields.push({ label: 'Example', value: sw.example });

    return (
      <div key={idx} style={{
        background: 'rgba(239,68,68,0.06)', borderRadius: '10px',
        padding: '0.75rem 0.9rem', fontSize: '0.82rem',
        border: '1px solid rgba(239,68,68,0.2)',
        textAlign: 'left',
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
          {q.word}
        </div>
        {fields.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 0.6rem', marginBottom: '0.35rem' }}>
            {fields.map(f => (
              <span key={f.label} style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {f.label}: {f.value}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
          <span>
            You: <span style={{ color: '#ef4444', fontWeight: 500 }}>{m.userAnswer}</span>
          </span>
          <span>
            Correct: <span style={{ color: '#22c55e', fontWeight: 500 }}>{m.correctAnswer}</span>
          </span>
        </div>
      </div>
    );
  };

  // Results screen
  if (quizDone) {
    const incorrect = totalAnswered - score;
    const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    const grade = percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good job!' : percentage >= 50 ? 'Keep practicing!' : 'Needs more work';
    const gradeColor = percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#a78bfa' : percentage >= 50 ? '#f59e0b' : '#ef4444';
    const modeLabel = PRACTICE_MODES.find(m => m.key === mode)?.label || mode;
    const topicLabel = selectedTopic === 'all' ? 'All topics' : selectedTopic;

    return (
      <LevelLock levelId={selectedLevel}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1rem' }}>
          <div style={s.card}>
            {/* Grade icon + text */}
            <div style={{ textAlign: 'center' }}>
              {percentage >= 70 ? (
                <CheckCircle size={42} color={gradeColor} />
              ) : (
                <XCircle size={42} color={gradeColor} />
              )}
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: gradeColor, marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                {grade}
              </h2>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '0.75rem 0 0.5rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: gradeColor }}>{score}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: incorrect > 0 ? '#ef4444' : 'var(--text-muted)' }}>{incorrect}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incorrect</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)' }}>{percentage}%</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
              </div>
            </div>

            {/* Session info tags */}
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={s.tag}>{modeLabel}</span>
              <span style={s.tag}>{selectedLevel}</span>
              <span style={s.tag}>{topicLabel}</span>
              <span style={s.tag}>{totalAnswered} questions</span>
            </div>

            {/* Mistakes list */}
            {mistakes.length > 0 && (
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '0.6rem', justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444' }}>
                    Mistakes ({mistakes.length})
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      title="Copy mistakes"
                      onClick={copyMistakesToClipboard}
                      style={{
                        background: 'transparent', border: '1px solid var(--border)',
                        borderRadius: '6px', padding: '0.3rem 0.5rem', cursor: 'pointer',
                        color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                        fontSize: '0.75rem', gap: '0.25rem', lineHeight: 1,
                      }}
                    >
                      <ClipboardCopy size={12} /> Copy
                    </button>
                    <button
                      title="Download CSV"
                      onClick={downloadMistakesCsv}
                      style={{
                        background: 'transparent', border: '1px solid var(--border)',
                        borderRadius: '6px', padding: '0.3rem 0.5rem', cursor: 'pointer',
                        color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                        fontSize: '0.75rem', gap: '0.25rem', lineHeight: 1,
                      }}
                    >
                      <Download size={12} /> CSV
                    </button>
                  </div>
                </div>
                <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mistakes.map((m, i) => renderMistakeCard(m, i))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button style={s.btn} onClick={() => setMode(null)}>
                <List size={14} style={{ marginRight: '0.3rem' }} />Modes
              </button>
              <button style={s.btnPrimary} onClick={startPractice}>
                <RefreshCw size={14} style={{ marginRight: '0.3rem' }} />Try Again
              </button>
              {mistakes.length > 0 && (
                <button
                  style={{ ...s.btnDanger, borderColor: '#ef4444' }}
                  onClick={startMistakeReview}
                >
                  <BookMarked size={14} style={{ marginRight: '0.3rem' }} />Review Mistakes ({mistakes.length})
                </button>
              )}
              <Link to={`/level/${selectedLevel}/vocabulary`}>
                <button style={s.btn}>
                  <ArrowLeft size={14} style={{ marginRight: '0.3rem' }} />Vocabulary
                </button>
              </Link>
            </div>
          </div>
        </div>
      </LevelLock>
    );
  }

  // No questions loaded yet
  if (!currentQ) {
    return (
      <LevelLock levelId={selectedLevel}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading questions...</p>
        </div>
      </LevelLock>
    );
  }

  const modeInfo = PRACTICE_MODES.find(m => m.key === mode);

  return (
    <LevelLock levelId={selectedLevel}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button style={{ ...s.btn, padding: '0.4rem 0.7rem' }} onClick={() => setMode(null)}>
              <ArrowLeft size={14} />
            </button>
            <span style={{ ...s.tag, background: `${modeInfo.color}15`, color: modeInfo.color }}>
              <modeInfo.icon size={12} style={{ marginRight: '0.3rem', display: 'inline' }} />
              {modeInfo.label}
            </span>
            <span style={s.tag}>{selectedLevel}</span>
            {reviewingMistakes && (
              <span style={{ ...s.tag, background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                <BookMarked size={11} style={{ marginRight: '0.2rem', display: 'inline' }} />Mistakes only
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {currentIndex + 1}/{totalQ}
            </span>
            {totalAnswered > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>
                {score}/{totalAnswered}
              </span>
            )}
          </div>
        </div>

        {/* Question card */}
        <div style={s.card}>
          {/* Prompt */}
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {currentQ.prompt}
            </p>

            {/* For fill-in-blank, show the sentence */}
            {mode === 'fillblank' && (
              <div style={{
                fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.6,
                color: 'var(--text-primary)', padding: '0.75rem',
                background: 'var(--bg-secondary)', borderRadius: '8px',
                marginBottom: '0.75rem',
              }}>
                {currentQ.fullSentence}
              </div>
            )}

            {/* For article, show just the word */}
            {mode === 'article' && (
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>
                {currentQ.word}
              </h3>
            )}

            {/* For plural, show article + word */}
            {mode === 'plural' && (
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>
                  {currentQ.article ? (
                    <span style={{ color: articleColor(currentQ.article), fontWeight: 400, marginRight: '0.3rem' }}>
                      {currentQ.article}
                    </span>
                  ) : null}
                  {currentQ.word}
                </h3>
              </div>
            )}

            {/* Hint */}
            {currentQ.hint && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {currentQ.hint}
              </p>
            )}
          </div>

          {/* Answer area */}
          {!result ? (
            <div>
              {isMultiChoiceArticle ? (
                // Article buttons
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1rem 0' }}>
                  {['der', 'die', 'das'].map(art => (
                    <button
                      key={art}
                      onClick={() => {
                        setUserAnswer(art);
                        setTimeout(() => {
                          setResult(art === currentQ.answer ? 'correct' : 'wrong');
                          setScore(prev => art === currentQ.answer ? prev + 1 : prev);
                          setTotalAnswered(prev => prev + 1);

                          if (art !== currentQ.answer) {
                            setMistakes(prev => [...prev, {
                              question: currentQ,
                              userAnswer: art,
                              correctAnswer: currentQ.answer,
                            }]);
                          }

                          setSessionResults(prev => [...prev, { id: currentQ.id, correct: art === currentQ.answer }]);

                          const sourceWord = currentQ.sourceWord;
                          if (sourceWord && sourceWord.id) {
                            const wordId = `${sourceWord._level || selectedLevel}_${sourceWord.id}`;
                            recordVocabAnswer(wordId, art === currentQ.answer);
                          }
                        }, 100);
                      }}
                      style={{
                        ...s.btn,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        padding: '0.75rem 1.5rem',
                        minWidth: '80px',
                        border: `2px solid ${articleColor(art)}`,
                        color: articleColor(art),
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${articleColor(art)}15`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }}
                    >
                      {art}
                    </button>
                  ))}
                </div>
              ) : (
                // Text input
                <div style={{ marginTop: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder={`Type the ${mode === 'plural' ? 'plural form' : 'missing word'}...`}
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={s.input}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'space-between' }}>
                    <button
                      style={{ ...s.btn, fontSize: '0.8rem' }}
                      onClick={() => setShowHint(h => !h)}
                    >
                      {showHint ? 'Hide' : 'Show'} Hint
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      style={{
                        ...s.btnPrimary,
                        opacity: !userAnswer.trim() ? 0.5 : 1,
                        cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Check Answer
                    </button>
                  </div>

                  {/* Hint panel */}
                  {showHint && (
                    <div style={{
                      marginTop: '0.5rem', padding: '0.5rem 0.75rem',
                      background: 'rgba(139,92,246,0.08)', borderRadius: '8px',
                      fontSize: '0.8rem', color: 'var(--text-secondary)',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}>
                      Hint: {currentQ.hint}
                      {mode === 'plural' && currentQ.article && (
                        <div style={{ marginTop: '0.25rem' }}>
                          Article: <span style={{ color: articleColor(currentQ.article), fontWeight: 600 }}>{currentQ.article}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Result feedback
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.2rem', borderRadius: '8px',
                background: result === 'correct' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result === 'correct' ? '#22c55e' : '#ef4444'}`,
                marginBottom: '0.75rem',
              }}>
                {result === 'correct' ? (
                  <CheckCircle size={20} color="#22c55e" />
                ) : (
                  <XCircle size={20} color="#ef4444" />
                )}
                <span style={{ fontWeight: 600, color: result === 'correct' ? '#22c55e' : '#ef4444' }}>
                  {result === 'correct' ? 'Correct!' : 'Incorrect'}
                </span>
              </div>

              {result === 'wrong' && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Correct answer: <span style={{ fontWeight: 700, color: '#22c55e' }}>{currentQ.answer}</span>
                </div>
              )}

              {mode === 'fillblank' && currentQ.exampleTranslation && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {currentQ.exampleTranslation}
                </p>
              )}

              <button
                style={s.btnPrimary}
                onClick={handleNext}
                autoFocus
              >
                {currentIndex < totalQ - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight size={14} style={{ marginLeft: '0.3rem' }} />
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%', height: '4px', borderRadius: '2px',
          background: 'var(--bg-secondary)',
          marginTop: '0.5rem',
        }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: 'var(--accent)',
            width: `${((currentIndex + (result ? 1 : 0)) / totalQ) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </LevelLock>
  );
}
