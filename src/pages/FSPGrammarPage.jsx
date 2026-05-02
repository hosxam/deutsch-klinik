import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

export default function FSPGrammarPage() {
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedAnswer, setSelectedAnswer] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspGrammar.json');
      setExercises(module.default || module);
    } catch {
      setExercises([]);
    }
  }

  const topics = [...new Set(exercises.map(e => e.topic))].sort();
  const filtered = selectedTopic === 'all' ? exercises : exercises.filter(e => e.topic === selectedTopic);

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(168,85,247,0.15)' }}>
          <Star size={18} style={{ color: '#a855f7' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Medical Documentation Grammar</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exercises.length} FSP grammar exercises</p>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedTopic('all')}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ backgroundColor: selectedTopic === 'all' ? '#a855f7' : 'var(--bg-card)', color: selectedTopic === 'all' ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            All ({exercises.length})
          </button>
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ backgroundColor: selectedTopic === t ? '#a855f7' : 'var(--bg-card)', color: selectedTopic === t ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {t} ({exercises.filter(e => e.topic === t).length})
            </button>
          ))}
        </div>
      )}

      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading grammar data...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ex => (
            <div key={ex.id} className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                  {ex.topic}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-primary)' }}>{ex.question}</p>
              {ex.options && (
                <div className="space-y-1">
                  {ex.options.map((opt, i) => {
                    const isSelected = selectedAnswer[ex.id] === i;
                    const isCorrect = opt === ex.answer;
                    const showResult = selectedAnswer[ex.id] !== undefined;
                    let bg = 'transparent';
                    if (showResult && isSelected) {
                      bg = isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(255,51,85,0.15)';
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => !showResult && setSelectedAnswer(prev => ({ ...prev, [ex.id]: i }))}
                        className="w-full text-left p-2 rounded-lg text-xs transition-colors"
                        style={{
                          backgroundColor: bg || 'var(--bg-hover)',
                          color: showResult && isSelected && !isCorrect ? '#ff3355' : 'var(--text-secondary)',
                          border: '1px solid ' + (showResult && isSelected ? (isCorrect ? '#22c55e' : '#ff3355') : 'var(--border)'),
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedAnswer[ex.id] !== undefined && ex.explanation && (
                <p className="text-[11px] mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.06)', color: 'var(--text-secondary)' }}>
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
