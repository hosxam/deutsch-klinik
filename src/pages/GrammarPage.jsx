import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateState, updateLevelProgress, getLevelProgress } from '../utils/store';
import grammarData from '../data/grammar.json';

const typeLabels = {
  'fill-blank': 'Fill in the Blank',
  'mcq': 'Multiple Choice',
  'article-select': 'Article Selection',
  'sentence-correction': 'Sentence Correction',
};

export default function GrammarPage() {
  const { levelId } = useParams();
  const exercises = grammarData[levelId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null); // null | 'correct' | 'wrong'
  const [userAnswer, setUserAnswer] = useState('');
  const [completed, setCompleted] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const ex = exercises[currentIndex];
  if (!ex) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>No exercises for {levelId} yet</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Add more exercises to grammar.json</p>
        <Link to={`/level/${levelId}`} className="text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>Back to Level</Link>
      </div>
    );
  }

  const handleAnswer = (ans) => {
    if (showResult) return;
    const correct = ans === ex.answer;
    setShowResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(score + 1);
    if (quizMode) {
      setQuizTotal(quizTotal + 1);
      if (correct) setQuizScore(quizScore + 1);
    }
  };

  const next = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(null);
      setUserAnswer('');
    } else {
      setCompleted(true);
      // Save progress
      updateLevelProgress(levelId, 'grammar', { date: new Date().toISOString(), score: score, total: exercises.length });
    }
  };

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(null);
    setCompleted(false);
    setQuizScore(0);
    setQuizTotal(0);
  };

  if (completed) {
    const pct = Math.round((score / exercises.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : '💪'}</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Exercise Complete!</h2>
        <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Score: {score}/{exercises.length} ({pct}%)</p>
        {quizMode && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Quiz: {quizScore}/{quizTotal} correct</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setCurrentIndex(0); setScore(0); setCompleted(false); setShowResult(null); setQuizMode(false); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Retry
          </button>
          <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            Back to Level
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {exercises.length}
          {quizMode && ` | Quiz: ${quizScore}/${quizTotal}`}
        </div>
        {!quizMode && (
          <button onClick={startQuiz} className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            Quiz Mode
          </button>
        )}
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          {ex.unit} &middot; {typeLabels[ex.type] || ex.type}
        </div>
        <p className="text-lg mb-6">{ex.prompt}</p>

        {/* MCQ */}
        {ex.type === 'mcq' && ex.options && (
          <div className="grid grid-cols-1 gap-2">
            {ex.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)} className="text-left px-4 py-3 rounded-lg text-sm transition-all" style={{
                backgroundColor: showResult ? (opt === ex.answer ? 'rgba(59,255,158,0.12)' : (userAnswer === opt ? 'rgba(255,51,85,0.12)' : 'var(--bg-hover)')) : 'var(--bg-hover)',
                border: `1px solid ${showResult ? (opt === ex.answer ? '#3bff9e' : (userAnswer === opt ? '#ff3355' : 'var(--border)')) : 'var(--border)'}`,
                color: showResult && opt === ex.answer ? '#3bff9e' : 'var(--text-primary)',
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Article Select */}
        {ex.type === 'article-select' && ex.options && (
          <div className="flex gap-2 flex-wrap">
            {ex.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)} className="px-4 py-2 rounded-lg text-sm transition-all" style={{
                backgroundColor: showResult ? (opt === ex.answer ? 'rgba(59,255,158,0.12)' : 'var(--bg-hover)') : 'var(--bg-hover)',
                border: `1px solid ${showResult ? (opt === ex.answer ? '#3bff9e' : 'var(--border)') : 'var(--border)'}`,
                color: showResult && opt === ex.answer ? '#3bff9e' : 'var(--text-primary)',
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Fill in the blank */}
        {ex.type === 'fill-blank' && (
          <div>
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && userAnswer.trim()) handleAnswer(userAnswer.trim()); }}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            {userAnswer && !showResult && (
              <button onClick={() => handleAnswer(userAnswer.trim())} className="mt-2 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                Check
              </button>
            )}
          </div>
        )}

        {/* Sentence correction */}
        {ex.type === 'sentence-correction' && (
          <div>
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && userAnswer.trim()) handleAnswer(userAnswer.trim()); }}
              placeholder="Type the corrected sentence..."
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            {userAnswer && !showResult && (
              <button onClick={() => handleAnswer(userAnswer.trim())} className="mt-2 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                Check
              </button>
            )}
          </div>
        )}

        {/* Result feedback */}
        {showResult && (
          <div className="mt-4 p-4 rounded-lg text-sm" style={{
            backgroundColor: showResult === 'correct' ? 'rgba(59,255,158,0.08)' : 'rgba(255,51,85,0.08)',
            border: `1px solid ${showResult === 'correct' ? '#3bff9e' : '#ff3355'}`,
          }}>
            <div className="font-semibold mb-1" style={{ color: showResult === 'correct' ? '#3bff9e' : '#ff3355' }}>
              {showResult === 'correct' ? 'Correct!' : 'Wrong!'}
            </div>
            <div className="mb-1">Answer: <strong>{ex.answer}</strong></div>
            <div style={{ color: 'var(--text-secondary)' }}>{ex.explanation}</div>
            <button onClick={next} className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              {currentIndex < exercises.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
