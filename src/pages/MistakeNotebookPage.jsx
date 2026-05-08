import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getState, getMistakesByLevel, getMistakeNotebookItems, getWeakTopics,
  recordAnswer,
  markMistakeMasteredById, clearMistakeByIndex,
} from '../utils/store';
import {
  AlertTriangle, X, Check, CheckCircle, RefreshCw, Filter,
  ChevronDown, ChevronUp, RotateCcw,
  Star, Trash2,
} from 'lucide-react';
import {
  PageShell, SectionHeader, Card, Button, Badge, LevelBadge, EmptyState, LoadingState,
} from '../components/ui';

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

  const currentLevel = getState().currentLevel || 'A1';

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

  return (
    <PageShell>
      <SectionHeader
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={22} style={{ color: '#ff6b00' }} /> Mistake Notebook
          </span>
        }
        subtitle={`Review your mistakes, re-practice weak areas, and reinforce vocabulary. ${totalMistakes} total mistakes tracked.`}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <Card className="text-center" style={{ padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff3355' }}>{totalMistakes}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mistakes</div>
        </Card>
        <Card className="text-center" style={{ padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{totalWeak}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Weak Topics</div>
        </Card>

        <Card className="text-center" style={{ padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3bff9e' }}>{retryCorrectCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Retries Correct</div>
        </Card>
      </div>

      {/* Skill counts mini display */}
      {Object.keys(skillCounts).length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([skill, count]) => (
            <Badge key={skill} label={`${skill}: ${count} mistakes`} color="#ff3355" />
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        {[
          { key: 'mistakes', label: 'Mistakes', icon: X, count: totalMistakes },
          { key: 'weak', label: 'Weak Topics', icon: AlertTriangle, count: totalWeak },

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
            <EmptyState
              icon="✅"
              title="No mistakes found"
              description="No mistakes found with current filters. Keep practicing!"
            />
          ) : (
            Object.entries(groupByLevel).map(([level, mistakes]) => (
              <div key={level} style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '15px', fontWeight: 'bold', marginBottom: '10px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <LevelBadge level={level} size="lg" />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({mistakes.length} mistakes)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mistakes.map((mistake, idx) => {
                    const key = level + '_' + idx;
                    const isExpanded = expandedMistake === key;
                    const actualMatcher = { exerciseId: mistake.exerciseId, date: mistake.date };
                    return (
                      <Card key={key} style={{ padding: '14px 16px' }}>
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
                              <div style={{ marginTop: '4px' }}>
                                <Badge label={mistake.skill} color="#8b5cf6" />
                              </div>
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
                                <Button
                                  onClick={() => checkMistakeRetry(mistake, key)}
                                  disabled={!retryAnswers[key]}
                                  size="sm"
                                  style={{ backgroundColor: levelColors[level] || 'var(--accent)', opacity: retryAnswers[key] ? 1 : 0.5 }}
                                >
                                  <RefreshCw size={12} style={{ marginRight: '6px' }} />
                                  Check
                                </Button>
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
                              <Button
                                onClick={() => {
                                  handleMarkMasteredById(level, mistake.exerciseId);
                                }}
                                size="sm"
                                variant="ghost"
                                style={{ border: '1px solid #3bff9e', color: '#3bff9e' }}
                              >
                                <Star size={12} style={{ marginRight: '4px' }} /> Mark as mastered
                              </Button>
                              <Button
                                onClick={() => {
                                  const storeMistakes = getMistakesByLevel(level) || [];
                                  const actualIdx = storeMistakes.findIndex(m => (actualMatcher.exerciseId && m.exerciseId === actualMatcher.exerciseId) || (actualMatcher.date && m.date === actualMatcher.date));
                                  if (actualIdx >= 0) {
                                    clearMistakeByIndex(level, actualIdx);
                                    setState({ ...getState() });
                                  }
                                }}
                                size="sm"
                                variant="danger"
                              >
                                <Trash2 size={12} style={{ marginRight: '4px' }} /> Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
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
            <EmptyState
              icon="🌟"
              title="No weak topics"
              description="No weak topics found. Keep up the good work!"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weakTopics.map((topic, idx) => (
                <Card key={idx} style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {topic.topic}
                      </span>
                      <Badge
                        label={topic.status}
                        color={topic.status === 'weak' ? '#ff3355' : '#f59e0b'}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Score: {topic.score || 'N/A'}
                    </span>
                  </div>
                  {topic.level && (
                    <div style={{ marginTop: '4px' }}>
                      <LevelBadge level={topic.level} size="sm" />
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
                  <Button
                    onClick={() => { setActiveTab('mistakes'); setFilterSkill(topic.topic); }}
                    size="sm"
                    variant="ghost"
                    style={{ color: '#f59e0b' }}
                  >
                    Review mistakes
                  </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

    </PageShell>
  );
}
