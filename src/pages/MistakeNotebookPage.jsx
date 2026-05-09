import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getState, getMistakesByLevel, getMistakeNotebookItems, getWeakTopics,
  recordVocabAnswer,
  markMistakeMasteredById, clearMistakeByIndex, getLocalDateKey, getVocabMastery,
} from '../utils/store';
import {
  AlertTriangle, X, CheckCircle, RefreshCw, Filter,
  ChevronDown, ChevronUp, RotateCcw,
  Star, Trash2,
} from 'lucide-react';
import {
  PageShell, SectionHeader, Card, Button, Badge, LevelBadge, EmptyState,
} from '../components/ui';

const skillOptions = [
  { value: 'all', label: 'All Skills' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'reading', label: 'Reading' },
  { value: 'listening', label: 'Listening' },
  { value: 'writing', label: 'Writing' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'exam', label: 'Exam' },
];

export default function MistakeNotebookPage() {
  const [, setState] = useState(getState());
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [activeTab, setActiveTab] = useState('mistakes');
  const [expandedMistake, setExpandedMistake] = useState(null);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(null);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [lastRatingFeedback, setLastRatingFeedback] = useState(null);

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

  // Shared style for SM-2 rating buttons (matches FlashcardPage / DailyMissionPage style)
  const smBtnStyle = { padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' };

  const handleMarkMasteredById = (level, exerciseId) => {
    markMistakeMasteredById(level, exerciseId);
    setState({ ...getState() });
  };

  const totalMistakes = Object.values(allMistakes).reduce((a, b) => a + b.length, 0);
  const totalWeak = weakTopics.length;

  // Get due count for today
  const today = getLocalDateKey();

  // Helper: check if a single mistake is due today
  function isMistakeDueToday(lvl, m) {
    const mistakeId = 'mistake_' + lvl + '_' + (m.exerciseId || '');
    const vm = getVocabMastery(mistakeId);
    if (vm && vm.due && vm.due <= today) return true;
    if (!vm || !vm.due) return true; // No SRS data yet = due
    return false;
  }

  const dueMistakeCount = (() => {
    let count = 0;
    Object.entries(allMistakes).forEach(([lvl, ms]) => {
      ms.forEach(m => {
        if (isMistakeDueToday(lvl, m)) count++;
      });
    });
    return count;
  })();

  // Build the due review queue: flat array of { level, mistake } sorted by level
  function buildDueQueue() {
    const queue = [];
    Object.entries(allMistakes).forEach(([lvl, ms]) => {
      ms.forEach(m => {
        if (isMistakeDueToday(lvl, m)) {
          queue.push({ level: lvl, mistake: m });
        }
      });
    });
    return queue;
  }

  // Start review mode: compute due queue, set index to 0
  function startReview() {
    const q = buildDueQueue();
    setReviewQueue(q);
    setCurrentReviewIdx(q.length > 0 ? 0 : null);
    setLastRatingFeedback(null);
  }

  // Get readable next review label from SRS object
  function getNextReviewLabel(mistakeId) {
    const vm = getVocabMastery(mistakeId);
    if (!vm || !vm.due) return 'now';
    const d = vm.due;
    if (d === today) return 'today';
    if (d < today) return 'now';
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
    return d;
  }

  // Handle rating: update SRS, show feedback, advance queue
  function handleRating(level, mistake, rating) {
    const mistakeId = 'mistake_' + level + '_' + (mistake.exerciseId || '');
    recordVocabAnswer(mistakeId, rating, {
      level,
      userAnswer: mistake.userAnswer || '',
      correctAnswer: mistake.correctAnswer || '',
      topic: mistake.topic || (mistake.skill || 'general'),
    });

    const labels = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };
    const nextLabel = getNextReviewLabel(mistakeId);
    setLastRatingFeedback({
      text: `${labels[rating] || 'Rated'} - next review: ${nextLabel}`,
      color: rating === 1 ? '#ff3355' : rating === 2 ? '#ffaa33' : rating === 3 ? '#3bff9e' : 'var(--accent)',
    });

    const advanced = advanceToNextDue(level, mistake.exerciseId || '');
    // Re-read state to update derived values (due count, etc.)
    setTimeout(() => setState({ ...getState() }), 0);
  }

  // Advance review queue past the current card
  function advanceToNextDue(skipLevel, skipExerciseId) {
    const skipId = 'mistake_' + skipLevel + '_' + skipExerciseId;
    // Find next card in the current queue that is still due
    const startIdx = currentReviewIdx !== null ? currentReviewIdx + 1 : 0;
    for (let i = startIdx; i < reviewQueue.length; i++) {
      const item = reviewQueue[i];
      const itemId = 'mistake_' + item.level + '_' + (item.mistake.exerciseId || '');
      if (itemId !== skipId && isMistakeDueToday(item.level, item.mistake)) {
        setCurrentReviewIdx(i);
        return true;
      }
    }
    // Nothing found in current queue, try a full rebuild
    const q = buildDueQueue();
    setReviewQueue(q);
    if (q.length > 0) {
      // Find first item not the one we just rated
      for (let i = 0; i < q.length; i++) {
        const itemId = 'mistake_' + q[i].level + '_' + (q[i].mistake.exerciseId || '');
        if (itemId !== skipId) {
          setCurrentReviewIdx(i);
          return true;
        }
      }
    }
    // Queue empty or only contains the rated card (which may still be due for Again)
    setCurrentReviewIdx(null);
    return false;
  }

  // Handle Mark as Mastered
  function handleMasteredAndAdvance(level, exerciseId) {
    markMistakeMasteredById(level, exerciseId);
    setState({ ...getState() });
    setLastRatingFeedback({ text: 'Marked as mastered', color: '#3bff9e' });
    const advanced = advanceToNextDue(level, exerciseId || '');
    if (!advanced) setCurrentReviewIdx(null);
  }

  // Handle Remove
  function handleRemoveAndAdvance(level, mistake) {
    const storeMistakes = getMistakesByLevel(level) || [];
    const actualIdx = storeMistakes.findIndex(m =>
      (mistake.exerciseId && m.exerciseId === mistake.exerciseId) ||
      (mistake.date && m.date === mistake.date)
    );
    if (actualIdx >= 0) {
      clearMistakeByIndex(level, actualIdx);
      setState({ ...getState() });
    }
    setLastRatingFeedback({ text: 'Removed', color: 'var(--text-muted)' });
    const advanced = advanceToNextDue(level, mistake.exerciseId || '');
    if (!advanced) setCurrentReviewIdx(null);
  }

  return (
    <PageShell>
      <SectionHeader
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={22} style={{ color: '#ff6b00' }} /> Mistake Notebook
          </span>
        }
        subtitle={`Review your mistakes and re-practice weak areas. ${totalMistakes} total mistakes tracked.`}
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
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3bff9e' }}>{dueMistakeCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due Today</div>
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
          {/* Filters + Review Mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {currentReviewIdx === null ? (
              <>
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
                {dueMistakeCount > 0 && (
                  <Button
                    onClick={() => {
                      setExpandedMistake(null);
                      startReview();
                    }}
                    size="sm"
                    variant="primary"
                    style={{ marginLeft: 'auto', backgroundColor: '#3bff9e', color: '#000' }}
                  >
                    Review {dueMistakeCount} due cards
                  </Button>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Reviewing mistakes ({currentReviewIdx + 1} of {reviewQueue.length})
                </span>
                <Button
                  onClick={() => {
                    setCurrentReviewIdx(null);
                    setReviewQueue([]);
                    setLastRatingFeedback(null);
                    setExpandedMistake(null);
                  }}
                  size="sm"
                  variant="ghost"
                  style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}
                >
                  X Exit review
                </Button>
              </div>
            )}
          </div>

          {/* Review Mode: one card at a time */}
          {currentReviewIdx !== null && reviewQueue[currentReviewIdx] && (() => {
            const item = reviewQueue[currentReviewIdx];
            const lvl = item.level;
            const mistake = item.mistake;

            return (
              <Card key={'review_' + currentReviewIdx + '_' + (mistake.exerciseId || '')} style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <LevelBadge level={lvl} size="sm" />
                  {mistake.skill && <Badge label={mistake.skill} color="#8b5cf6" />}
                </div>

                {/* Front: what went wrong */}
                <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.5' }}>
                  {mistake.question || mistake.prompt || 'Mistake review'}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{ color: '#ff3355' }}>
                    Your answer: <strong>{mistake.userAnswer || mistake.wrongAnswer || 'N/A'}</strong>
                  </span>
                  <span style={{ color: '#3bff9e' }}>
                    Correct: <strong>{mistake.correctAnswer || 'N/A'}</strong>
                  </span>
                </div>

                {/* Correct answer box */}
                <div style={{
                  padding: '12px', borderRadius: '8px', marginBottom: '14px',
                  backgroundColor: 'rgba(59,255,158,0.06)', border: '1px solid rgba(59,255,158,0.2)',
                  fontSize: '0.9rem', color: 'var(--text-primary)',
                }}>
                  <div style={{ fontWeight: 600, color: '#3bff9e', marginBottom: '4px' }}>
                    Correct answer:
                  </div>
                  <div>{mistake.correctAnswer || 'N/A'}</div>
                </div>

                {/* Feedback banner */}
                {lastRatingFeedback && (
                  <div style={{
                    padding: '8px 12px', borderRadius: '8px', marginBottom: '12px',
                    backgroundColor: lastRatingFeedback.color + '18',
                    color: lastRatingFeedback.color, fontWeight: 600, fontSize: '13px',
                    textAlign: 'center',
                  }}>
                    {lastRatingFeedback.text}
                  </div>
                )}

                {/* SM-2 rating buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <button
                    onClick={() => handleRating(lvl, mistake, 1)}
                    style={{ ...smBtnStyle, background: 'rgba(255,51,85,0.12)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.25)' }}
                    title="Forgot: comes back in ~10 min"
                  >
                    <RotateCcw size={12} /> Again
                  </button>
                  <button
                    onClick={() => handleRating(lvl, mistake, 2)}
                    style={{ ...smBtnStyle, background: 'rgba(255,170,51,0.1)', color: '#ffaa33', border: '1px solid rgba(255,170,51,0.25)' }}
                    title="Remembered with effort: shorter interval"
                  >
                    <RefreshCw size={12} /> Hard
                  </button>
                  <button
                    onClick={() => handleRating(lvl, mistake, 3)}
                    style={{ ...smBtnStyle, background: 'rgba(59,255,158,0.1)', color: '#3bff9e', border: '1px solid rgba(59,255,158,0.25)' }}
                    title="Remembered: normal SM-2 interval"
                  >
                    <Star size={12} /> Good
                  </button>
                  <button
                    onClick={() => handleRating(lvl, mistake, 4)}
                    style={{ ...smBtnStyle, background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)' }}
                    title="Easy: 1.3x bonus interval"
                  >
                    <CheckCircle size={12} /> Easy
                  </button>
                </div>

                {/* Mark as mastered / Remove */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Button
                    onClick={() => handleMasteredAndAdvance(lvl, mistake.exerciseId)}
                    size="sm"
                    variant="ghost"
                    style={{ border: '1px solid #3bff9e', color: '#3bff9e' }}
                  >
                    <Star size={12} style={{ marginRight: '4px' }} /> Mark as mastered
                  </Button>
                  <Button
                    onClick={() => handleRemoveAndAdvance(lvl, mistake)}
                    size="sm"
                    variant="danger"
                  >
                    <Trash2 size={12} style={{ marginRight: '4px' }} /> Remove
                  </Button>
                </div>
              </Card>
            );
          })()}

          {/* Review mode: empty state - queue empty after all rated */}
          {currentReviewIdx !== null && (!reviewQueue.length || currentReviewIdx >= reviewQueue.length || (reviewQueue.length > 0 && !reviewQueue[currentReviewIdx])) && (
            <EmptyState
              icon="🎉"
              title="No more mistake cards due today"
              description={
                lastRatingFeedback
                  ? `All due mistakes reviewed. ${lastRatingFeedback.text}`
                  : 'All caught up! No mistake cards due for review today.'
              }
            />
          )}

          {/* Browse mode: show all mistakes (when not in review) */}
          {currentReviewIdx === null && Object.keys(groupByLevel).length === 0 && (
            <EmptyState
              icon="✅"
              title="No mistakes found"
              description="No mistakes found with current filters. Keep practicing!"
            />
          )}
          {currentReviewIdx === null && Object.keys(groupByLevel).length > 0 && (
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
                            {/* Show correct answer as flashcard back */}
                            <div style={{
                              padding: '12px', borderRadius: '8px', marginBottom: '10px',
                              backgroundColor: 'rgba(59,255,158,0.06)', border: '1px solid rgba(59,255,158,0.2)',
                              fontSize: '0.9rem', color: 'var(--text-primary)',
                            }}>
                              <div style={{ fontWeight: 600, color: '#3bff9e', marginBottom: '4px' }}>
                                Correct answer:
                              </div>
                              <div>{mistake.correctAnswer || 'N/A'}</div>
                            </div>

                            {/* SM-2 rating buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <button
                                onClick={() => {
                                  const mistakeId = 'mistake_' + level + '_' + mistake.exerciseId;
                                  recordVocabAnswer(mistakeId, 1, {
                                    level,
                                    userAnswer: mistake.userAnswer || 'Did not know',
                                    correctAnswer: mistake.correctAnswer || '',
                                    topic: mistake.topic || (mistake.skill || 'general'),
                                  });
                                  setState({ ...getState() });
                                }}
                                style={{ ...smBtnStyle, background: 'rgba(255,51,85,0.12)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.25)' }}
                                title="Forgot: comes back in ~10 min"
                              >
                                <RotateCcw size={12} /> Again
                              </button>
                              <button
                                onClick={() => {
                                  const mistakeId = 'mistake_' + level + '_' + mistake.exerciseId;
                                  recordVocabAnswer(mistakeId, 2, {
                                    level,
                                    userAnswer: mistake.userAnswer || 'Remembered with effort',
                                    correctAnswer: mistake.correctAnswer || '',
                                    topic: mistake.topic || (mistake.skill || 'general'),
                                  });
                                  setState({ ...getState() });
                                }}
                                style={{ ...smBtnStyle, background: 'rgba(255,170,51,0.1)', color: '#ffaa33', border: '1px solid rgba(255,170,51,0.25)' }}
                                title="Remembered with effort: shorter interval"
                              >
                                <RefreshCw size={12} /> Hard
                              </button>
                              <button
                                onClick={() => {
                                  const mistakeId = 'mistake_' + level + '_' + mistake.exerciseId;
                                  recordVocabAnswer(mistakeId, 3, {
                                    level,
                                    userAnswer: mistake.userAnswer || 'Knew it',
                                    correctAnswer: mistake.correctAnswer || '',
                                    topic: mistake.topic || (mistake.skill || 'general'),
                                  });
                                  setState({ ...getState() });
                                }}
                                style={{ ...smBtnStyle, background: 'rgba(59,255,158,0.1)', color: '#3bff9e', border: '1px solid rgba(59,255,158,0.25)' }}
                                title="Remembered: normal SM-2 interval"
                              >
                                <Star size={12} /> Good
                              </button>
                              <button
                                onClick={() => {
                                  const mistakeId = 'mistake_' + level + '_' + mistake.exerciseId;
                                  recordVocabAnswer(mistakeId, 4, {
                                    level,
                                    userAnswer: mistake.userAnswer || 'Easy',
                                    correctAnswer: mistake.correctAnswer || '',
                                    topic: mistake.topic || (mistake.skill || 'general'),
                                  });
                                  setState({ ...getState() });
                                }}
                                style={{ ...smBtnStyle, background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)' }}
                                title="Easy: 1.3x bonus interval"
                              >
                                <CheckCircle size={12} /> Easy
                              </button>
                            </div>

                            {/* Mark as mastered / Remove */}
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
