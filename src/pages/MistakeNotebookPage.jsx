import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getState, getMistakesByLevel, getMistakeNotebookItems, getWeakTopics,
  getDueVocabWords, recordVocabAnswer, recordAnswer,
  markMistakeMasteredById, clearMistakeByIndex,
} from '../utils/store';
import vocabData from '../data/germanVocabulary.json';
import {
  AlertTriangle, X, Check, RefreshCw, Filter,
  ChevronDown, ChevronUp, RotateCcw, Brain,
  Star, Trash2,
} from 'lucide-react';

const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

const skillOptions = [
  { value: 'all', label: 'All Skills' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'vocab', label: 'Vocabulary' },
  { value: 'exam', label: 'Exam' },
  { value: 'mistake-retry', label: 'Retry' },
];

export default function MistakeNotebookPage() {
  const [, setState] = useState(getState());
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [retryAnswers, setRetryAnswers] = useState({});
  const [retryResults, setRetryResults] = useState({});
  const [retryCorrectCount, setRetryCorrectCount] = useState(0);
  const [activeTab, setActiveTab] = useState('mistakes');
  const [expandedMistake, setExpandedMistake] = useState(null);
  const [reviewedVocab, setReviewedVocab] = useState([]);

  useEffect(() => {
    const i = setInterval(() => setState({ ...getState() }), 1000);
    return () => clearInterval(i);
  }, []);

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

  // Mistakes data using the unified getMistakeNotebookItems
  const allMistakes = {};
  levels.forEach(l => {
    const ms = getMistakesByLevel(l) || [];
    if (ms.length > 0) allMistakes[l] = ms;
  });

  const mistakeness = {};
  levels.forEach(l => {
    mistakeness[l] = getMistakesByLevel(l)?.length || 0;
  });

  // Get filtered items using store function
  const filteredItems = getMistakeNotebookItems(filterLevel, filterSkill);

  // Skill counts
  const skillCounts = {};
  levels.forEach(l => {
    const ms = getMistakesByLevel(l) || [];
    ms.forEach(m => {
      const skill = m.skill || m.topic || 'general';
      if (!skillCounts[skill]) skillCounts[skill] = 0;
      skillCounts[skill]++;
    });
  });

  // Group filtered by level for display
  const groupByLevel = {};
  filteredItems.forEach(m => {
    const lvl = m.level;
    if (!groupByLevel[lvl]) groupByLevel[lvl] = [];
    groupByLevel[lvl].push(m);
  });

  // Weak topics
  const weakTopics = getWeakTopics() || [];

  // Due vocab words
  const currentLevel = getState().currentLevel || 'A1';
  const vocabMistakeIds = new Set(filteredItems
    .filter(m => (m.skill || '').includes('vocab'))
    .map(m => String(m.exerciseId || '').replace(/^[A-C][12]_/, '')));
  const levelWords = (vocabData[currentLevel] || []).map(w => ({ ...w, level: currentLevel }));
  const dueIds = new Set(getDueVocabWords(levelWords.map(w => `${currentLevel}_${w.id}`)).map(id => String(id).replace(/^[A-C][12]_/, '')));
  const weakWords = levelWords.filter(w => {
    const m = getState().vocabularyMastery?.[`${currentLevel}_${w.id}`];
    return m && m.incorrect > m.correct;
  });
  const vocabItems = [
    ...levelWords.filter(w => dueIds.has(w.id)),
    ...levelWords.filter(w => vocabMistakeIds.has(w.id)),
    ...weakWords,
  ]
    .filter((w, idx, arr) => arr.findIndex(x => x.id === w.id) === idx)
    .filter(w => !reviewedVocab.includes(`${currentLevel}_${w.id}`))
    .slice(0, 20);

  const handleVocabReview = (wordId, correct) => {
    const word = levelWords.find(w => w.id === wordId) || {};
    recordVocabAnswer(`${currentLevel}_${wordId}`, correct, {
      level: currentLevel,
      userAnswer: correct ? word.translation || word.english || 'Knew it' : 'Still learning',
      correctAnswer: word.translation || word.english || '',
      topic: word.topic || 'Vocabulary',
    });
    setReviewedVocab(prev => [...prev, `${currentLevel}_${wordId}`]);
    setState({ ...getState() });
  };

  const handleMistakeRetry = (mistakeKey, answer) => {
    setRetryAnswers(prev => ({ ...prev, [mistakeKey]: answer }));
  };

  const checkMistakeRetry = (mistake, mistakeKey) => {
    const answer = retryAnswers[mistakeKey];
    if (!answer) return;
    const correct = answer.toLowerCase().trim() === mistake.correctAnswer.toLowerCase().trim();
    setRetryResults(prev => ({ ...prev, [mistakeKey]: correct }));
    if (correct) setRetryCorrectCount(c => c + 1);
    recordAnswer(mistake.level, 'mistake-retry-' + mistakeKey, answer, mistake.correctAnswer, 'mistakeNotebook', correct, 'mistake-retry');
    setState({ ...getState() });
  };

  const handleMarkMasteredById = (level, exerciseId) => {
    markMistakeMasteredById(level, exerciseId);
    setState({ ...getState() });
  };

  const totalMistakes = Object.values(allMistakes).reduce((a, b) => a + b.length, 0);
  const totalWeak = weakTopics.length;
  const totalDue = vocabItems.length;

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={22} style={{ color: '#ff6b00' }} /> Mistake Notebook
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Review your mistakes, re-practice weak areas, and reinforce vocabulary.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff3355' }}>{totalMistakes}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mistakes</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{totalWeak}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weak Topics</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{totalDue}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vocab Due</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3bff9e' }}>{retryCorrectCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Retries Correct</div>
        </div>
      </div>

      {/* Skill counts mini display */}
      {Object.keys(skillCounts).length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([skill, count]) => (
            <div key={skill} style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', backgroundColor: 'rgba(255,51,85,0.08)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.2)' }}>
              {skill}: {count} mistakes
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        {[
          { key: 'mistakes', label: 'Mistakes', icon: X, count: totalMistakes },
          { key: 'weak', label: 'Weak Topics', icon: AlertTriangle, count: totalWeak },
          { key: 'vocab', label: 'Vocab Review', icon: Brain, count: totalDue },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              border: 'none', borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              backgroundColor: 'transparent', color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                fontSize: '11px', padding: '1px 6px', borderRadius: '10px',
                backgroundColor: activeTab === tab.key ? 'var(--accent)' : 'var(--bg-hover)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Mistakes */}
      {activeTab === 'mistakes' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '13px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', outline: 'none',
              }}
            >
              <option value="all">All Levels</option>
              {levels.map(l => (
                <option key={l} value={l}>{l} ({mistakeness[l] || 0})</option>
              ))}
            </select>
            <select
              value={filterSkill}
              onChange={e => setFilterSkill(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '13px',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', outline: 'none',
              }}
            >
              {skillOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label} {opt.value !== 'all' && skillCounts[opt.value] ? `(${skillCounts[opt.value]})` : ''}</option>
              ))}
            </select>
          </div>

          {Object.keys(groupByLevel).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Check size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#3bff9e' }} />
              <p>No mistakes found with current filters. Keep practicing!</p>
            </div>
          ) : (
            Object.entries(groupByLevel).map(([level, mistakes]) => (
              <div key={level} style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '15px', fontWeight: 'bold', marginBottom: '10px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: levelColors[level] || 'var(--text-primary)',
                }}>
                  <span style={{ color: levelColors[level] }}>Level {level}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({mistakes.length} mistakes)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mistakes.map((mistake, idx) => {
                    const key = level + '_' + idx;
                    const isExpanded = expandedMistake === key;
                    const actualMatcher = { exerciseId: mistake.exerciseId, date: mistake.date };
                    return (
                      <div key={key} style={{
                        borderRadius: '10px', padding: '14px 16px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                      }}>
                        <div
                          onClick={() => setExpandedMistake(isExpanded ? null : key)}
                          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {mistake.question || mistake.prompt || 'Question'}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
                              <span style={{ color: '#ff3355' }}>
                                Your answer: <strong>{mistake.userAnswer || mistake.wrongAnswer || 'N/A'}</strong>
                              </span>
                              <span style={{ color: '#3bff9e' }}>
                                Correct: <strong>{mistake.correctAnswer || 'N/A'}</strong>
                              </span>
                            </div>
                            {mistake.skill && (
                              <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block', backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                                {mistake.skill}
                              </span>
                            )}
                          </div>
                          <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                            {/* Retry section */}
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                              Try again:
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                value={retryAnswers[key] || ''}
                                onChange={e => handleMistakeRetry(key, e.target.value)}
                                placeholder="Type correct answer..."
                                disabled={retryResults[key] !== undefined}
                                style={{
                                  flex: 1, padding: '8px 12px', borderRadius: '6px', fontSize: '13px',
                                  border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
                                  color: 'var(--text-primary)', outline: 'none',
                                }}
                              />
                              {retryResults[key] === undefined && (
                                <button
                                  onClick={() => checkMistakeRetry(mistake, key)}
                                  disabled={!retryAnswers[key]}
                                  style={{
                                    padding: '8px 16px', borderRadius: '6px', border: 'none',
                                    backgroundColor: levelColors[level] || 'var(--accent)',
                                    color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                    opacity: retryAnswers[key] ? 1 : 0.5,
                                  }}
                                >
                                  <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                  Check
                                </button>
                              )}
                            </div>
                            {retryResults[key] !== undefined && (
                              <div style={{
                                marginTop: '8px', padding: '8px', borderRadius: '6px', fontSize: '13px',
                                backgroundColor: retryResults[key] ? 'rgba(59,255,158,0.1)' : 'rgba(255,51,85,0.1)',
                                color: retryResults[key] ? '#3bff9e' : '#ff3355',
                                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                              }}>
                                {retryResults[key] ? <Check size={16} /> : <X size={16} />}
                                {retryResults[key] ? 'Correct this time!' : 'Still incorrect. Keep practicing!'}
                              </div>
                            )}

                            {/* Mark as mastered */}
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  handleMarkMasteredById(level, mistake.exerciseId);
                                }}
                                style={{
                                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #3bff9e',
                                  backgroundColor: 'transparent', color: '#3bff9e',
                                  fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                              >
                                <Star size={12} /> Mark as mastered
                              </button>
                              <button
                                onClick={() => {
                                  const storeMistakes = getMistakesByLevel(level) || [];
                                  const actualIdx = storeMistakes.findIndex(m => (actualMatcher.exerciseId && m.exerciseId === actualMatcher.exerciseId) || (actualMatcher.date && m.date === actualMatcher.date));
                                  if (actualIdx >= 0) {
                                    clearMistakeByIndex(level, actualIdx);
                                    setState({ ...getState() });
                                  }
                                }}
                                style={{
                                  padding: '6px 12px', borderRadius: '6px', border: '1px solid #ff3355',
                                  backgroundColor: 'transparent', color: '#ff3355',
                                  fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Weak Topics */}
      {activeTab === 'weak' && (
        <div>
          {weakTopics.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Check size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#3bff9e' }} />
              <p>No weak topics found. Keep up the good work!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weakTopics.map((topic, idx) => (
                <div key={idx} style={{
                  padding: '14px 16px', borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {topic.topic}
                      </span>
                      <span style={{
                        fontSize: '11px', marginLeft: '8px', padding: '1px 6px', borderRadius: '4px',
                        backgroundColor: topic.status === 'weak' ? 'rgba(255,51,85,0.1)' : 'rgba(245,158,11,0.1)',
                        color: topic.status === 'weak' ? '#ff3355' : '#f59e0b',
                      }}>
                        {topic.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Score: {topic.score || 'N/A'}
                    </span>
                  </div>
                  {topic.level && (
                    <div style={{ fontSize: '11px', marginTop: '4px', color: levelColors[topic.level] || 'var(--text-muted)' }}>
                      Level: {topic.level}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <Link to={`/level/${topic.level || currentLevel}/grammar?topic=${encodeURIComponent(topic.topic)}`} style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
                    fontSize: '11px', backgroundColor: 'var(--bg-hover)', color: 'var(--accent)',
                    textDecoration: 'none', fontWeight: '600',
                  }}>
                    Practice {topic.topic}
                  </Link>
                  <Link to={`/level/${topic.level || currentLevel}/lessons`} style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
                    fontSize: '11px', backgroundColor: 'var(--bg-hover)', color: '#3bff9e',
                    textDecoration: 'none', fontWeight: '600',
                  }}>
                    Recommended lesson
                  </Link>
                  <button onClick={() => { setActiveTab('mistakes'); setFilterSkill(topic.topic); }} style={{
                    display: 'inline-block', padding: '4px 10px', borderRadius: '6px', border: 'none',
                    fontSize: '11px', backgroundColor: 'var(--bg-hover)', color: '#f59e0b',
                    fontWeight: '600', cursor: 'pointer',
                  }}>
                    Review mistakes
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Vocab Review (Spaced Repetition) */}
      {activeTab === 'vocab' && (
        <div>
          {vocabItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Brain size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#3bff9e' }} />
              <p>No due, weak, or recent-mistake vocabulary for {currentLevel}. Check back later!</p>
              <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                All your vocab is up to date. <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vocabItems.map((word, idx) => (
                <div key={word.id || idx} style={{
                  padding: '14px 16px', borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      {word.article && <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>{word.article}</span>}
                      <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {word.word || word.german}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                        {word.translation || word.english}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                      backgroundColor: levelColors[word.level] + '20',
                      color: levelColors[word.level] || 'var(--text-muted)',
                    }}>
                      {currentLevel}
                    </span>
                  </div>
                  {word.example && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                      "{word.example}"
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleVocabReview(word.id, true)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
                        backgroundColor: 'rgba(59,255,158,0.15)', color: '#3bff9e',
                        fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      }}
                    >
                      <Check size={14} /> Knew it
                    </button>
                    <button
                      onClick={() => handleVocabReview(word.id, false)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
                        backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355',
                        fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      }}
                    >
                      <X size={14} /> Still learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
