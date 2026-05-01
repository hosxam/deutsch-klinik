import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getState, getMistakesByLevel, getWeakTopics, getDueVocabWords,
  recordVocabAnswer, recordAnswer,
} from '../utils/store';
import vocabData from '../data/germanVocabulary.json';
import levelsData from '../data/levels.json';
import {
  AlertTriangle, X, Check, RefreshCw, BookOpen, Filter,
  ChevronDown, ChevronUp, RotateCcw, Brain,
} from 'lucide-react';

const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

export default function MistakeNotebookPage() {
  const [state, setState] = useState(getState());
  const [filterLevel, setFilterLevel] = useState('all');
  const [retryAnswers, setRetryAnswers] = useState({});
  const [retryResults, setRetryResults] = useState({});
  const [activeTab, setActiveTab] = useState('mistakes'); // mistakes | vocab | weak
  const [expandedMistake, setExpandedMistake] = useState(null);

  useEffect(() => {
    const i = setInterval(() => setState({ ...getState() }), 1000);
    return () => clearInterval(i);
  }, []);

  // Mistakes data
  const allMistakes = {};
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  levels.forEach(l => {
    const ms = getMistakesByLevel(l) || [];
    if (ms.length > 0) allMistakes[l] = ms;
  });

  const filteredMistakes = filterLevel === 'all'
    ? allMistakes
    : { [filterLevel]: allMistakes[filterLevel] || [] };

  // Weak topics
  const weakTopics = getWeakTopics() || [];

  // Due vocab words
  const allVocabIds = Object.values(vocabData).flatMap(arr => arr.map(v => v.id));
  const dueVocab = getDueVocabWords(allVocabIds);

  const vocabItems = dueVocab.map(id => {
    for (const arr of Object.values(vocabData)) {
      const found = arr.find(v => v.id === id);
      if (found) return found;
    }
    return null;
  }).filter(Boolean);

  const handleVocabReview = (wordId, correct) => {
    recordVocabAnswer(wordId, correct);
    // Refresh state
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
    recordAnswer(mistake.level, 'mistake-retry', mistake.correctAnswer, answer, 'mistakeNotebook');
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
      </div>

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
          {/* Level filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
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
                <option key={l} value={l}>{l} ({allMistakes[l]?.length || 0})</option>
              ))}
            </select>
          </div>

          {Object.keys(filteredMistakes).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Check size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#3bff9e' }} />
              <p>No mistakes recorded yet. Keep practicing!</p>
            </div>
          ) : (
            Object.entries(filteredMistakes).map(([level, mistakes]) => (
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
                          </div>
                          <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
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
                                  Check
                                </button>
                              )}
                            </div>
                            {retryResults[key] !== undefined && (
                              <div style={{
                                marginTop: '8px', fontSize: '13px', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                color: retryResults[key] ? '#3bff9e' : '#ff3355',
                              }}>
                                {retryResults[key] ? <Check size={14} /> : <X size={14} />}
                                {retryResults[key] ? ' Correct!' : ` Correct: ${mistake.correctAnswer}`}
                              </div>
                            )}
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
              <p>No weak topics identified. Great work!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weakTopics.map((wt, idx) => (
                <div key={idx} style={{
                  padding: '14px 16px', borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: wt.status === 'weak' ? 'rgba(255,51,85,0.1)' : 'rgba(245,158,11,0.1)',
                    color: wt.status === 'weak' ? '#ff3355' : '#f59e0b',
                    fontSize: '13px', fontWeight: 'bold',
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {wt.topic}
                    </div>
                    <div style={{
                      fontSize: '12px', color: wt.status === 'weak' ? '#ff3355' : '#f59e0b',
                    }}>
                      {wt.status === 'weak' ? 'Needs attention' : 'Improving'}
                    </div>
                  </div>
                  <Link
                    to={`/level/${wt.topic?.charAt?.(0) || 'A1'}`}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                      backgroundColor: 'var(--bg-hover)', color: 'var(--accent)',
                      textDecoration: 'none', fontWeight: '600',
                    }}
                  >
                    Practice
                  </Link>
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
              <p>No vocabulary words due for review. Check back later!</p>
              <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                All your vocab is up to date. <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vocabItems.map((word, idx) => (
                <div key={word.id || idx} style={{
                  padding: '14px 16px', borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
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
                      {word.level}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                    {word.example}
                  </p>
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
