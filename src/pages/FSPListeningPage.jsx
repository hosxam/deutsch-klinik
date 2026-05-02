import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Headphones, ChevronLeft, ChevronDown, ChevronUp, Play } from 'lucide-react';

export default function FSPListeningPage() {
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showTranscript, setShowTranscript] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const module = await import('../data/fspListening.json');
      setExercises(module.default || module);
    } catch {
      setExercises([]);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
        <ChevronLeft size={14} /> Back to FSP Hub
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
          <Headphones size={18} style={{ color: '#22c55e' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Clinical Listening</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exercises.length} FSP listening exercises</p>
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading listening data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map(ex => (
            <div key={ex.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setExpanded(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                className="w-full flex items-center justify-between p-3 text-left"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{ex.title}</span>
                {expanded[ex.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expanded[ex.id] && (
                <div className="p-3 space-y-3">
                  {/* TTS Play */}
                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utter = new SpeechSynthesisUtterance(ex.script);
                        utter.lang = 'de-DE';
                        utter.rate = 0.9;
                        speechSynthesis.speak(utter);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs transition-colors"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <Play size={14} /> Read Aloud (TTS)
                  </button>

                  {/* Transcript (hidden by default) */}
                  <div>
                    <button
                      onClick={() => setShowTranscript(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                      className="text-xs mb-1" style={{ color: 'var(--accent)' }}
                    >
                      {showTranscript[ex.id] ? 'Hide transcript' : 'Show transcript'}
                    </button>
                    {showTranscript[ex.id] && (
                      <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-hover)' }}>
                        {ex.script}
                      </div>
                    )}
                  </div>

                  {/* Questions */}
                  {ex.questions && ex.questions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>Questions</p>
                      {ex.questions.map((q, i) => (
                        <div key={i} className="mb-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-hover)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>{q.question}</p>
                          {q.options && (
                            <div className="space-y-0.5">
                              {q.options.map((opt, j) => (
                                <label key={j} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  <input type="radio" name={`q_${ex.id}_${i}`} className="accent-[#06b6d4]" />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}
                          {ex.answers && ex.answers[i] && (
                            <p className="text-[11px] mt-1" style={{ color: '#22c55e' }}>
                              Answer: {ex.answers[i]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
