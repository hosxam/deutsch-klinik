import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateLevelProgress, recordGrammarAnswer, getGrammarMastery, getMistakesByLevel } from '../utils/store';
import grammarData from '../data/grammar.json';
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, BookOpen } from 'lucide-react';

const typeLabels = {
  'fill-blank': 'Fill in the Blank',
  'mcq': 'Multiple Choice',
  'multiple-choice': 'Multiple Choice',
  'article-select': 'Article Selection',
  'sentence-reorder': 'Sentence Reordering',
  'sentence-correction': 'Sentence Correction',
};

export default function GrammarPage() {
  const { levelId } = useParams();
  const exercises = grammarData.filter(e => e.level === levelId) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [completed, setCompleted] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const ex = exercises[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setUserAnswer('');
    setCompleted(false);
  }, [levelId]);

  if (!ex) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem' }}>No exercises for {levelId} yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Add exercises to germanGrammar.json for this level.</p>
        <Link to={`/level/${levelId}`} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--bg-hover)', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Level</Link>
      </div>
    );
  }

  const handleAnswer = (ans) => {
    if (showResult) return;
    const correct = ans.trim().toLowerCase() === ex.answer.trim().toLowerCase();
    setShowResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(score + 1);
    if (quizMode) {
      setQuizTotal(quizTotal + 1);
      if (correct) setQuizScore(quizScore + 1);
    }
    // Track in store
    recordGrammarAnswer(ex.id, correct);
    const mastery = getGrammarMastery(ex.id);
    const total = mastery.correct + mastery.incorrect;
    if (total > 0 && total % 3 === 0) {
      updateLevelProgress(levelId, 'grammar', { date: new Date().toISOString(), exerciseId: ex.id, correct: mastery.correct, total });
    }
  };

  const next = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
    setQuizMode(false);
    setQuizScore(0);
    setQuizTotal(0);
  };

  // Mistake notebook link
  const mistakes = getMistakesByLevel(levelId);

  const s = {
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' },
    btn: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' },
    btnPrimary: { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    tag: (bg) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: bg || 'var(--bg-secondary)', color: 'var(--text-secondary)' }),
  };

  if (completed) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <div style={s.card}>
          <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>Grammar Completed!</h2>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', margin: '1rem 0' }}>{score}/{exercises.length}</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={s.btn} onClick={reset}><RotateCcw size={14} style={{ marginRight: '0.4rem' }} />Try Again</button>
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
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>Grammar Exercises</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{levelId} | {exercises.length} exercises</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={s.tag}>{currentIndex + 1}/{exercises.length}</span>
          <span style={s.tag} style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>Score: {score}</span>
          {mistakes.length > 0 && (
            <span style={s.tag} style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>{mistakes.length} mistakes</span>
          )}
        </div>
      </div>

      {/* Exercise Card */}
      <div style={s.card}>
        <span style={{ ...s.tag('rgba(139,92,246,0.15)'), color: 'var(--accent2)', marginBottom: '0.75rem', display: 'inline-block' }}>
          {typeLabels[ex.type] || ex.type} · {ex.topic}
        </span>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, margin: '1rem 0' }}>{ex.prompt}</p>

        {ex.type === 'fill-blank' && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {(ex.options || []).map(opt => (
              <button key={opt} style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: showResult
                  ? opt.toLowerCase() === ex.answer.toLowerCase() ? '2px solid #22c55e'
                  : userAnswer === opt ? '2px solid #ef4444' : '1px solid var(--border)'
                  : '1px solid var(--border)',
                background: showResult && opt.toLowerCase() === ex.answer.toLowerCase() ? 'rgba(34,197,94,0.1)'
                  : showResult && userAnswer === opt ? 'rgba(239,68,68,0.1)'
                  : 'var(--bg-secondary)',
                color: 'var(--text-primary)', cursor: showResult ? 'default' : 'pointer', fontSize: '0.9rem',
              }}
                disabled={!!showResult} onClick={() => { setUserAnswer(opt); handleAnswer(opt); }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {ex.type === 'multiple-choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
            {(ex.options || []).map((opt, idx) => (
              <button key={idx} style={{
                padding: '0.75rem', borderRadius: '8px', border: showResult
                  ? idx === ex.answer ? '2px solid #22c55e' : userAnswer === opt ? '2px solid #ef4444' : '1px solid var(--border)'
                  : userAnswer === opt ? '2px solid var(--accent)' : '1px solid var(--border)',
                background: showResult && idx === ex.answer ? 'rgba(34,197,94,0.1)'
                  : showResult && userAnswer === opt ? 'rgba(239,68,68,0.1)'
                  : userAnswer === opt ? 'rgba(0,240,255,0.08)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)', cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: '0.95rem',
              }}
                disabled={!!showResult} onClick={() => { setUserAnswer(opt); handleAnswer(opt); }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {ex.type === 'sentence-reorder' && (
          <div style={{ marginTop: '0.75rem' }}>
            <input type="text" placeholder="Type the correct sentence..."
              value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', border: showResult
                  ? userAnswer.trim().toLowerCase() === ex.answer.toLowerCase() ? '2px solid #22c55e' : '2px solid #ef4444'
                  : '1px solid var(--border)',
                background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem',
              }} disabled={!!showResult} />
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
              {currentIndex < exercises.length - 1 ? 'Next Question →' : 'Show Results'}
            </button>
          </div>
        )}
      </div>

      {/* Mastery Stats */}
      {getGrammarMastery(ex.id).correct > 0 && (
        <div style={{ ...s.card, padding: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <BookOpen size={14} /> Mastery: <span style={{ color: '#22c55e' }}>{getGrammarMastery(ex.id).correct} correct</span>
            / <span style={{ color: '#ef4444' }}>{getGrammarMastery(ex.id).incorrect} incorrect</span>
            {getGrammarMastery(ex.id).mastered && <span style={{ background: 'rgba(34,197,94,0.15)', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', color: '#22c55e' }}>Mastered</span>}
          </div>
        </div>
      )}
    </div>
  );
}
