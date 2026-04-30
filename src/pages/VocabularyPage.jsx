import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getState, updateLevelProgress } from '../utils/store';
import vocabData from '../data/vocabulary.json';
import { Shuffle, BookMarked } from 'lucide-react';

export default function VocabularyPage() {
  const { levelId } = useParams();
  const words = vocabData[levelId] || [];
  const [mode, setMode] = useState('browse'); // browse | quiz | matching
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [matchState, setMatchState] = useState(null);

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No vocabulary yet for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
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
    setQuizTotal(quizTotal + 1);
    if (correct) setQuizScore(quizScore + 1);
    setShowAnswer(true);
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

  // Matching game: create shuffled pairs
  const startMatching = () => {
    const pairs = words.slice(0, 8).map((w, i) => ({ id: w.id, german: w.german, english: w.english, pairId: i }));
    const shuffled = [...pairs.flatMap(p => [
      { id: `${p.id}_de`, text: p.german, pairId: p.pairId, type: 'de' },
      { id: `${p.id}_en`, text: p.english, pairId: p.pairId, type: 'en' },
    ])].sort(() => Math.random() - 0.5);
    setMatchState({ cards: shuffled, selected: null, matched: new Set(), pairs });
    setMode('matching');
  };

  const handleMatchClick = (card) => {
    if (!matchState || matchState.matched.has(card.pairId)) return;
    if (matchState.selected === null) {
      setMatchState({ ...matchState, selected: card.pairId, selectedCard: card.id });
    } else {
      if (matchState.selected === card.pairId && matchState.selectedCard !== card.id) {
        const newMatched = new Set(matchState.matched);
        newMatched.add(card.pairId);
        setMatchState({ ...matchState, selected: null, selectedCard: null, matched: newMatched });
        if (newMatched.size === matchState.pairs.length) {
          updateLevelProgress(levelId, 'vocab', { date: new Date().toISOString(), mode: 'matching' });
        }
      } else {
        setMatchState({ ...matchState, selected: null, selectedCard: null });
      }
    }
  };

  if (mode === 'quiz') {
    if (quizDone) {
      return (
        <div className="max-w-lg mx-auto text-center py-12">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Quiz Complete!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Score: {quizScore}/{quizTotal}</p>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => { setMode('browse'); setCurrentIndex(0); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>Browse</button>
            <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Back</Link>
          </div>
        </div>
      );
    }

    const word = words[currentIndex];
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{currentIndex + 1}/{words.length} | Score: {quizScore}/{quizTotal}</div>
        <div className="text-2xl font-bold mb-6">{showAnswer ? word.english : word.german}</div>
        {showAnswer && <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{word.beispiel}</div>}
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="px-6 py-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Show Answer
          </button>
        ) : (
          <div className="flex gap-3 justify-center">
            <button onClick={() => handleQuizAnswer(true)} className="px-6 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'rgba(59,255,158,0.15)', color: '#3bff9e' }}>Knew it</button>
            <button onClick={() => handleQuizAnswer(false)} className="px-6 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355' }}>Didn't know</button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'matching' && matchState) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: 'var(--accent)' }}>Match German to English</h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{matchState.matched.size}/{matchState.pairs.length} matched</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {matchState.cards.map(card => (
            <button key={card.id} onClick={() => handleMatchClick(card)} className="p-3 rounded-lg text-sm transition-all" style={{
              backgroundColor: matchState.matched.has(card.pairId) ? 'rgba(59,255,158,0.12)' : (matchState.selected === card.pairId ? 'rgba(0,240,255,0.12)' : 'var(--bg-hover)'),
              border: `1px solid ${matchState.matched.has(card.pairId) ? '#3bff9e' : (matchState.selected === card.pairId ? 'var(--accent)' : 'var(--border)')}`,
              opacity: matchState.matched.has(card.pairId) ? 0.6 : 1,
              color: 'var(--text-primary)',
            }}>
              {card.text}
            </button>
          ))}
        </div>
        {matchState.matched.size === matchState.pairs.length && (
          <div className="text-center mt-6">
            <p className="text-lg mb-3" style={{ color: '#3bff9e' }}>All matched!</p>
            <button onClick={() => { setMode('browse'); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Back to Browse</button>
          </div>
        )}
      </div>
    );
  }

  // Browse mode
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <h2 className="font-semibold" style={{ color: 'var(--accent)' }}>Vocabulary - {levelId}</h2>
        <div className="flex gap-2">
          <button onClick={startQuiz} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e' }}>
            <Shuffle size={12} /> Quiz
          </button>
          <button onClick={startMatching} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>
            <BookMarked size={12} /> Match
          </button>
          <Link to={`/level/${levelId}/vocabulary/flashcards`} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
            Flashcards
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {words.map(w => (
          <div key={w.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex-1">
              <span className="font-semibold">{w.german}</span>
              <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>{w.english}</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
