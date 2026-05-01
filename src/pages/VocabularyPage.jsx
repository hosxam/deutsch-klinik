import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateLevelProgress, recordVocabAnswer, getVocabMastery } from '../utils/store';
import vocabData from '../data/germanVocabulary.json';
import { Shuffle, BookMarked, CheckCircle, XCircle, Brain } from 'lucide-react';

export default function VocabularyPage() {
  const { levelId } = useParams();
  const words = vocabData.filter(w => w.level === levelId) || [];
  const [mode, setMode] = useState('browse');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setQuizDone(false);
    setQuizScore(0);
    setQuizTotal(0);
    setMode('browse');
  }, [levelId]);

  if (words.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ color: 'var(--text-muted)' }}>No vocabulary yet for {levelId}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Add words to germanVocabulary.json with level field set to {levelId}</p>
        <Link to={`/level/${levelId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>Back</Link>
      </div>
    );
  }

  const startQuiz = () => {
    setMode('quiz');
    setCurrentIndex(0);
    setQuizScore(0);
    setQuizTotal(0);
    setShowAnswer(false);
    setQuizDone(false);
  };

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

  const s = {
    card: { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' },
    btn: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
    btnPrimary: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
    tag: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
  };

  // Browse mode
  if (mode === 'browse') {
    const word = words[currentIndex];
    const mastery = getVocabMastery(`${levelId}_${word.id}`);
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)' }}>{levelId} Vocabulary</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{words.length} words</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={s.btn} onClick={() => setCurrentIndex(Math.floor(Math.random() * words.length))}><Shuffle size={14} style={{ marginRight: '0.4rem' }} />Random</button>
            <button style={s.btnPrimary} onClick={startQuiz}><Brain size={14} style={{ marginRight: '0.4rem' }} />Start Quiz</button>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{word.word}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{word.pos}</p>
            {!showAnswer ? (
              <button style={{ ...s.btn, marginTop: '1rem' }} onClick={() => setShowAnswer(true)}>Show Answer</button>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{word.translation}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>"{word.example}"</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Topic: {word.topic}</p>
                
                {/* Mastery display */}
                {mastery.mastered && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.75rem' }}>✓ Mastered ({mastery.correct} correct)</p>}
                {!mastery.mastered && mastery.correct + mastery.incorrect > 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    Progress: {mastery.correct} ✓ / {mastery.incorrect} ✗
                  </p>
                )}
                <button style={{ ...s.btn, marginTop: '1rem' }} onClick={() => { setCurrentIndex((currentIndex + 1) % words.length); setShowAnswer(false); }}>Next Word →</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          {words.map((w, idx) => (
            <button key={w.id} onClick={() => { setCurrentIndex(idx); setShowAnswer(false); }}
              style={{
                width: '2rem', height: '2rem', borderRadius: '4px', border: '1px solid var(--border)',
                background: idx === currentIndex ? 'var(--accent)' : 'var(--bg-secondary)',
                color: idx === currentIndex ? '#000' : 'var(--text-muted)',
                fontSize: '0.75rem', cursor: 'pointer',
              }}>{idx + 1}</button>
          ))}
        </div>
      </div>
    );
  }

  // Quiz mode
  if (mode === 'quiz') {
    if (quizDone) {
      return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
          <div style={s.card}>
            <CheckCircle size={40} color="#22c55e" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.75rem' }}>Quiz Complete!</h2>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e', margin: '0.5rem 0' }}>{quizScore}/{quizTotal}</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button style={s.btn} onClick={() => { setMode('browse'); setCurrentIndex(0); }}>Browse Words</button>
              <button style={s.btnPrimary} onClick={startQuiz}>Try Again</button>
            </div>
          </div>
        </div>
      );
    }

    const word = words[currentIndex];
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={s.tag}>Quiz Mode</span>
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
    );
  }
}
