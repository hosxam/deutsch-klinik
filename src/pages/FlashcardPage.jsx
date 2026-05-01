import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateState } from '../utils/store';
import vocabData from '../data/vocabulary.json';
import { RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function FlashcardPage() {
  const { levelId } = useParams();
  const [words] = useState(() => [...(vocabData[levelId] || [])].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [reviews, setReviews] = useState([]);

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No flashcards for {levelId}</p>
        <Link to={`/level/${levelId}/vocabulary`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
    );
  }

  const handleReview = (difficulty) => {
    const word = words[index];
    setReviews([...reviews, { wordId: word.id, difficulty }]);
    if (index < words.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      setDone(true);
      const state = getState();
      if (!state.flashcards) state.flashcards = {};
      const today = new Date().toISOString().split('T')[0];
      reviews.forEach(r => {
        const key = `${levelId}_${r.wordId}`;
        const card = state.flashcards[key] || { ease: 2.5, interval: 1, due: today, repetitions: 0 };
        if (r.difficulty >= 3) {
          card.repetitions += 1;
          card.interval = card.repetitions === 1 ? 1 : card.repetitions === 2 ? 6 : Math.round(card.interval * card.ease);
          card.due = new Date(Date.now() + card.interval * 86400000).toISOString().split('T')[0];
        } else {
          card.repetitions = 0;
          card.interval = 1;
          card.due = today;
          card.ease = Math.max(1.3, card.ease - 0.2);
        }
        state.flashcards[key] = card;
      });
      updateState({ flashcards: state.flashcards });
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">🎴</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Session Complete!</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{words.length} cards reviewed</p>
        <Link to={`/level/${levelId}/vocabulary`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Back to Vocabulary
        </Link>
      </div>
    );
  }

  const word = words[index];

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}/vocabulary`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{index + 1}/{words.length}</span>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className="rounded-xl p-10 text-center cursor-pointer transition-all min-h-[200px] flex items-center justify-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${flipped ? '#8b5cf6' : 'var(--border)'}`,
          boxShadow: flipped ? '0 0 30px rgba(139,92,246,0.15)' : 'none',
        }}
      >
        <div>
          <div className="text-2xl font-bold mb-3">{flipped ? word.english : word.german}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {flipped && word.beispiel}
            {!flipped && 'Click to reveal English'}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => handleReview(1)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355' }}>
            <ThumbsDown size={16} /> Hard
          </button>
          <button onClick={() => handleReview(3)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(59,255,158,0.15)', color: '#3bff9e' }}>
            <ThumbsUp size={16} /> Good
          </button>
          <button onClick={() => handleReview(5)} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'rgba(0,240,255,0.15)', color: 'var(--accent)' }}>
            <RefreshCw size={16} /> Easy
          </button>
        </div>
      )}
    </div>
  );
}
