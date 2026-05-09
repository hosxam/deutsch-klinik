import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  updateLevelProgress, setLevelProgress, getLevelProgress,
  recordGrammarAnswer, getGrammarMastery, getMistakesByLevel, recordAnswer, getState
} from '../utils/store';
import { getUnlockedItems, hasCurriculumMap } from '../utils/teachBeforeTest';
import { recordPracticeAttempt, getPracticeItemStatus } from '../utils/practiceProgress';
import grammarData from '../data/grammar.json';
import LevelLock from '../components/LevelLock';
import GermanCharHelper from '../components/GermanCharHelper';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, BookOpen, Play, Settings } from 'lucide-react';

function normalizeAnswer(str) {
  return (str || '').trim().toLowerCase()
    .replace(/[.!?,;:]+$/, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuestionLessonId(question) {
  return question?.taughtInLessonId || question?.remediationLessonId || '';
}

const typeLabels = {
  'fill-blank': 'Fill in the Blank',
  'mcq': 'Multiple Choice',
  'multiple-choice': 'Multiple Choice',
  'article-select': 'Article Selection',
  'sentence-reorder': 'Sentence Reordering',
  'sentence-correction': 'Sentence Correction',
};

const SESSION_SIZES = [5, 10, 15, 20, 25];

export default function GrammarPage() {
  const { levelId } = useParams();
  const [searchParams] = useSearchParams();
  const isDaily = searchParams.get('daily') === '1';
  const dailyLimit = parseInt(searchParams.get('limit') || '10', 10);
  const topicFilter = searchParams.get('topic');

  // Session setup state
  const [sessionSize, setSessionSize] = useState(10);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState([]); // IDs selected for this session

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [completed, setCompleted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const inputRef = useRef(null);

  const currentQuestionId = sessionQuestions[currentIndex];
  const currentQuestion = (currentQuestionId && grammarData[levelId]?.find(ex => ex.id === currentQuestionId)) || null;

  // -- Session question selection logic --
  const buildSessionPool = useCallback((size) => {
    const all = (grammarData[levelId] || []).filter(ex => !topicFilter || ex.topic === topicFilter);
    if (all.length === 0) return [];

    const state = getState();
    const completedLessonIds = new Set(state.completedLessons?.[levelId] || []);

    // 1. Filter by unlocked lessons using teachBeforeTest logic
    const context = {
      allowedLessonIds: completedLessonIds,
      todayLessonIds: [],
      isFreePractice: false,
    };
    const hasCurriculum = hasCurriculumMap(levelId);
    let unlocked;
    if (hasCurriculum) {
      unlocked = getUnlockedItems(all, levelId, state, context);
    } else {
      unlocked = all.filter(x => completedLessonIds.has(getQuestionLessonId(x)));
    }

    // 2. Remove completed_correct items (they are done)
    const available = unlocked.filter(ex => {
      const pp = getPracticeItemStatus('grammar', ex.id);
      return pp.status !== 'completed_correct' && pp.status !== 'mastered';
    });

    if (available.length === 0) return [];

    // 3. Build priority pools
    const practiceProgress = (() => {
      try { return JSON.parse(localStorage.getItem('practiceProgress_v1') || '{}'); } catch { return {}; }
    })();
    const ppGrammar = practiceProgress.grammar || {};

    // Priority 1: grammar mistakes / needs review (incorrect answers)
    const needsReview = available.filter(ex => ppGrammar[ex.id]?.status === 'completed_incorrect');
    // Priority 2: weak concepts (mastery ratio < 0.7 but at least 1 attempt)
    const weak = available.filter(ex => {
      const m = getGrammarMastery(ex.id);
      const total = m.correct + m.incorrect;
      return total > 0 && (m.correct / total) < 0.7 && !needsReview.includes(ex);
    });
    // Priority 3: incomplete from completed lessons
    const fromCompleted = available.filter(ex => {
      const lessonId = getQuestionLessonId(ex);
      return lessonId && completedLessonIds.has(lessonId) && !needsReview.includes(ex) && !weak.includes(ex);
    });
    // Priority 4: new unlocked questions
    const newUnlocked = available.filter(ex => !needsReview.includes(ex) && !weak.includes(ex) && !fromCompleted.includes(ex));

    // 4. Build selected list respecting priority order
    const selected = [];
    const addPool = (pool) => {
      const shuffled = shuffleArray(pool);
      for (const item of shuffled) {
        if (selected.length >= size) break;
        if (!selected.includes(item)) selected.push(item);
      }
    };
    addPool(needsReview);
    addPool(weak);
    addPool(fromCompleted);
    addPool(newUnlocked);

    return selected.slice(0, size).map(ex => ex.id);
  }, [levelId, topicFilter]);

  // Reset state when level changes
  useEffect(() => {
    setSessionActive(false);
    setSessionQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setUserAnswer('');
    setCompleted(false);
    setWrongAnswers([]);
  }, [levelId, topicFilter]);

  // Daily mode: auto-start session
  useEffect(() => {
    if (isDaily && !sessionActive) {
      const pool = buildSessionPool(dailyLimit);
      setSessionQuestions(pool);
      setSessionSize(dailyLimit);
      setSessionActive(true);
    }
  }, [isDaily, dailyLimit, sessionActive, buildSessionPool]);

  const startSession = () => {
    const pool = buildSessionPool(sessionSize);
    setSessionQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setUserAnswer('');
    setCompleted(false);
    setWrongAnswers([]);
    setSessionActive(true);
  };

  const exitSession = () => {
    setSessionActive(false);
    setSessionQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setUserAnswer('');
    setCompleted(false);
    setWrongAnswers([]);
  };

  const handleAnswer = (ans) => {
    if (showResult || !currentQuestion) return;
    const ex = currentQuestion;
    const correct = (ex.type === 'fill-blank' || ex.type === 'sentence-reorder' || ex.type === 'sentence-correction')
      ? normalizeAnswer(ans) === normalizeAnswer(ex.answer)
      : ans.trim().toLowerCase() === ex.answer.trim().toLowerCase();

    setShowResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);

    if (!correct) {
      setWrongAnswers(prev => [...prev, {
        id: ex.id,
        userAnswer: ans,
        correctAnswer: ex.answer,
        explanation: ex.explanation || 'Review the rule for this topic, then retry the exercise.',
        lessonId: ex.lessonId || ex.taughtInLessonId || ex.remediationLessonId,
      }]);
    }

    // 1. Track grammar mastery in store.js
    recordGrammarAnswer(ex.id, correct);

    // 2. Track in practiceProgress.js with dueDate scheduling
    recordPracticeAttempt('grammar', ex.id, { correct });

    // 3. Track mistakes for Mistake Notebook
    recordAnswer(levelId, ex.id, ans, ex.answer, ex.topic || ex.type, correct, 'grammar');

    // 4. Update level progress
    const existing = getLevelProgress(levelId, 'grammar');
    const existingIdx = existing.findIndex(e => e.exerciseId === ex.id);
    const newEntry = { date: new Date().toISOString(), exerciseId: ex.id, correct: getGrammarMastery(ex.id).correct, total: getGrammarMastery(ex.id).correct + getGrammarMastery(ex.id).incorrect };
    if (existingIdx >= 0) {
      const updated = [...existing];
      updated[existingIdx] = newEntry;
      setLevelProgress(levelId, 'grammar', updated);
    } else {
      updateLevelProgress(levelId, 'grammar', newEntry);
    }
  };

  const next = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowResult(null);
      setUserAnswer('');
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setUserAnswer('');
    setCompleted(false);
    setWrongAnswers([]);
  };

  // --- Setup Screen: Session Size Selector ---
  if (!sessionActive) {
    const all = (grammarData[levelId] || []).filter(ex => !topicFilter || ex.topic === topicFilter);
    const state = getState();
    const completedLessonIds = new Set(state.completedLessons?.[levelId] || []);
    // Count available questions for display
    const context = { allowedLessonIds: completedLessonIds, todayLessonIds: [], isFreePractice: false };
    const hasCurriculum = hasCurriculumMap(levelId);
    let unlocked = hasCurriculum
      ? getUnlockedItems(all, levelId, state, context)
      : all.filter(x => completedLessonIds.has(getQuestionLessonId(x)));
    const available = unlocked.filter(ex => {
      const pp = getPracticeItemStatus('grammar', ex.id);
      return pp.status !== 'completed_correct' && pp.status !== 'mastered';
    });
    const totalInLevel = all.length;
    const completedCount = totalInLevel - available.length;

    return (
      <LevelLock levelId={levelId}>
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border)' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <BookOpen size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>
                Grammar Practice
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {levelId} | {totalInLevel} total exercises
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{available.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e' }}>{completedCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#eab308' }}>
                  {unlocked.filter(ex => getPracticeItemStatus('grammar', ex.id).status === 'completed_incorrect').length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Needs Review</div>
              </div>
            </div>

            {/* Session Size Selector */}
            {available.length > 0 && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Questions per session:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {SESSION_SIZES.map(size => (
                      <button key={size}
                        onClick={() => setSessionSize(size)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: sessionSize === size ? '2px solid var(--accent)' : '1px solid var(--border)',
                          background: sessionSize === size ? 'rgba(0,240,255,0.1)' : 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: sessionSize === size ? 700 : 400,
                          minWidth: '48px',
                        }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={startSession}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                    background: 'var(--accent)', color: '#000', cursor: 'pointer',
                    fontWeight: 700, fontSize: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  }}>
                  <Play size={18} /> Start Session ({Math.min(sessionSize, available.length)} questions)
                </button>
              </>
            )}

            {/* Empty State */}
            {available.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  All Caught Up!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  You have completed all available grammar exercises for {levelId}.
                  {completedCount > 0 && ` (${completedCount}/${totalInLevel} exercises done)`}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Complete more lessons to unlock new questions.
                </p>
                <Link to={`/level/${levelId}`}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-hover)', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Back to Level
                </Link>
              </div>
            )}

            {topicFilter && (
              <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Topic filter: <strong style={{ color: 'var(--accent)' }}>{topicFilter}</strong>
                  {' '}<Link to={`/level/${levelId}/grammar`} style={{ color: '#ff3355', fontSize: '0.85rem', textDecoration: 'none' }}>Clear</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </LevelLock>
    );
  }

  // --- Empty state during session (shouldn't normally happen) ---
  if (sessionQuestions.length === 0) {
    return (
      <LevelLock levelId={levelId}>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem' }}>No exercises available</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {topicFilter ? `No exercises matched "${topicFilter}". ` : ''}
            Complete lessons to unlock grammar questions.
          </p>
          <button onClick={exitSession} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', marginRight: '0.5rem' }}>
            Back to Setup
          </button>
          <Link to={`/level/${levelId}`} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-hover)', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Back to Level
          </Link>
        </div>
      </LevelLock>
    );
  }

  // --- Current question (not rendered if completed) ---
  const ex = currentQuestion;
  const mistakes = getMistakesByLevel(levelId);

  const s = {
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' },
    btn: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' },
    btnPrimary: { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    tag: (bg) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: bg || 'var(--bg-secondary)', color: 'var(--text-secondary)' }),
  };

  if (completed) {
    return (
      <LevelLock levelId={levelId}>
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
          <div style={s.card}>
            <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
              {isDaily ? 'Daily Mission Complete!' : 'Session Complete!'}
            </h2>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', margin: '1rem 0' }}>{score}/{sessionQuestions.length}</p>
            {sessionQuestions.length > 0 && (score / sessionQuestions.length) * 100 < 60 && (
              <div style={{ textAlign: 'left', padding: '1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', marginBottom: '1rem' }}>
                <h3 style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Needs Work</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  You scored {Math.round((score / sessionQuestions.length) * 100)}%. Review the missed rule examples, then try this set again.
                </p>
                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {wrongAnswers.map(q => (
                    <div key={q.id} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-card)', fontSize: '0.8rem' }}>
                      <div><span style={{ color: '#ef4444' }}>{q.userAnswer}</span> {' -> '} <span style={{ color: '#22c55e' }}>{q.correctAnswer}</span></div>
                      <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{q.explanation}</p>
                    </div>
                  ))}
                </div>
                {wrongAnswers[0]?.lessonId && (
                  <Link to={`/level/${levelId}/lessons/${wrongAnswers[0].lessonId}`}
                    style={{ ...s.btn, textDecoration: 'none', marginRight: '0.5rem' }}>
                    Review Lesson
                  </Link>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={s.btn} onClick={reset}><RotateCcw size={14} style={{ marginRight: '0.4rem' }} />Try Again</button>
              {!isDaily && (
                <button style={s.btn} onClick={exitSession}><Settings size={14} style={{ marginRight: '0.4rem' }} />New Session</button>
              )}
              <Link to={`/level/${levelId}`} style={{ ...s.btn, textDecoration: 'none' }}>Back to Level</Link>
            </div>
          </div>
          {mistakes.length > 0 && (
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={16} color="#eab308" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Mistakes to Review ({mistakes.length})</h3>
              </div>
              {mistakes.slice(-5).reverse().map((m, i) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{m.topic}:</span> You wrote "{m.userAnswer}", correct: <span style={{ color: '#22c55e' }}>{m.correctAnswer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </LevelLock>
    );
  }

  return (
    <LevelLock levelId={levelId}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>
              {isDaily ? 'Daily Grammar Mission' : 'Grammar Practice'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {levelId} | {sessionQuestions.length} questions
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={s.tag()}>{currentIndex + 1}/{sessionQuestions.length}</span>
            <span style={{ ...s.tag(), background: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>Score: {score}</span>
            {!isDaily && (
              <button onClick={exitSession} style={{
                ...s.btn, padding: '0.4rem 0.7rem', fontSize: '0.75rem',
                display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                <Settings size={12} /> Exit
              </button>
            )}
          </div>
        </div>

        {/* Topic filter indicator */}
        {topicFilter && (
          <div style={{ ...s.card, padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Practicing only: <strong style={{ color: 'var(--accent)' }}>{topicFilter}</strong>
            </span>
            <Link to={`/level/${levelId}/grammar`} style={{ color: '#ff3355', fontSize: '0.85rem', textDecoration: 'none' }}>
              Clear filter x
            </Link>
          </div>
        )}

        {/* Exercise Card */}
        {ex && (
          <div style={s.card}>
            <span style={{ ...s.tag('rgba(139,92,246,0.15)'), color: 'var(--accent2)', marginBottom: '0.75rem', display: 'inline-block' }}>
              {typeLabels[ex.type] || ex.type} &middot; {ex.topic}
            </span>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, margin: '1rem 0', wordBreak: 'break-word' }}>{ex.prompt}</p>

            {['fill-blank'].includes(ex.type) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input type="text" aria-label="Grammar answer" placeholder="Type your answer..."
                  ref={inputRef}
                  value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: showResult
                      ? normalizeAnswer(userAnswer) === normalizeAnswer(ex.answer)
                        ? '2px solid #22c55e' : '2px solid #ef4444'
                      : '1px solid var(--border)',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem',
                  }} disabled={!!showResult} />
                {!showResult && <GermanCharHelper targetRef={inputRef} compact style={{ marginTop: '0.25rem' }} />}
                <button style={{ ...s.btnPrimary, marginTop: '0.5rem' }} disabled={!!showResult || !userAnswer.trim()}
                  onClick={() => handleAnswer(userAnswer)}>Check</button>
              </div>
            )}

            {['mcq', 'multiple-choice', 'article-select', 'conjugation', 'case-select', 'drag-word'].includes(ex.type) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                {(ex.options || []).map((opt, idx) => {
                  const correctAnswer = typeof ex.answer === 'number' ? ex.options[ex.answer] : ex.answer;
                  const isSelected = userAnswer === opt;
                  const isCorrectOption = opt.toLowerCase() === (correctAnswer || '').toLowerCase();
                  return (
                    <button key={idx} style={{
                      padding: '0.75rem', borderRadius: '8px', border: showResult
                        ? isCorrectOption ? '2px solid #22c55e' : isSelected ? '2px solid #ef4444' : '1px solid var(--border)'
                        : isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: showResult && isCorrectOption ? 'rgba(34,197,94,0.1)'
                        : showResult && isSelected ? 'rgba(239,68,68,0.1)'
                        : isSelected ? 'rgba(0,240,255,0.08)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)', cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: '0.95rem',
                    }}
                      disabled={!!showResult} onClick={() => { setUserAnswer(opt); handleAnswer(opt); }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {ex.type === 'sentence-reorder' && (
              <div style={{ marginTop: '0.75rem' }}>
                <input type="text" aria-label="Correct sentence answer" placeholder="Type the correct sentence..."
                  ref={inputRef}
                  value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: showResult
                      ? normalizeAnswer(userAnswer) === normalizeAnswer(typeof ex.answer === 'string' ? ex.answer : '')
                        ? '2px solid #22c55e' : '2px solid #ef4444'
                      : '1px solid var(--border)',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem',
                  }} disabled={!!showResult} />
                {!showResult && <GermanCharHelper targetRef={inputRef} compact style={{ marginTop: '0.25rem' }} />}
                <button style={{ ...s.btnPrimary, marginTop: '0.5rem' }} disabled={!!showResult || !userAnswer.trim()}
                  onClick={() => handleAnswer(userAnswer)}>Check</button>
              </div>
            )}

            {ex.type === 'sentence-correction' && (
              <div style={{ marginTop: '0.75rem' }}>
                <input type="text" aria-label="Correct sentence answer" placeholder="Type the correct sentence..."
                  ref={inputRef}
                  value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: showResult
                      ? normalizeAnswer(userAnswer) === normalizeAnswer(typeof ex.answer === 'string' ? ex.answer : '')
                        ? '2px solid #22c55e' : '2px solid #ef4444'
                      : '1px solid var(--border)',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem',
                  }} disabled={!!showResult} />
                {!showResult && <GermanCharHelper targetRef={inputRef} compact style={{ marginTop: '0.25rem' }} />}
                <button style={{ ...s.btnPrimary, marginTop: '0.5rem' }} disabled={!!showResult || !userAnswer.trim()}
                  onClick={() => handleAnswer(userAnswer)}>Check</button>
              </div>
            )}

            {showResult && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: showResult === 'correct' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${showResult === 'correct' ? '#22c55e' : '#ef4444'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {showResult === 'correct' ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
                  <span style={{ fontWeight: 600, color: showResult === 'correct' ? '#22c55e' : '#ef4444' }}>
                    {showResult === 'correct' ? 'Correct!' : `Wrong. Correct answer: ${ex.answer}`}
                  </span>
                </div>
                <button style={{ ...s.btn, marginTop: '0.5rem' }} onClick={next}>
                  {currentIndex < sessionQuestions.length - 1 ? 'Next Question' : 'Show Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mastery Stats */}
        {ex && getGrammarMastery(ex.id).correct > 0 && (
          <div style={{ ...s.card, padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <BookOpen size={14} /> Mastery: <span style={{ color: '#22c55e' }}>{getGrammarMastery(ex.id).correct} correct</span>
              / <span style={{ color: '#ef4444' }}>{getGrammarMastery(ex.id).incorrect} incorrect</span>
              {getGrammarMastery(ex.id).mastered && <span style={{ background: 'rgba(34,197,94,0.15)', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', color: '#22c55e' }}>Mastered</span>}
            </div>
          </div>
        )}
      </div>
    </LevelLock>
  );
}
