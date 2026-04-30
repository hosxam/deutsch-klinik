import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { updateLevelProgress } from '../utils/store';
import listeningData from '../data/listening.json';
import { Play, Square, Volume2 } from 'lucide-react';

export default function ListeningPage() {
  const { levelId } = useParams();
  const exercises = listeningData[levelId] || [];
  const [currentEx, setCurrentEx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const synthRef = useRef(null);

  const ex = exercises[currentEx];

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No listening exercises for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
    );
  }

  const speak = () => {
    if (synthRef.current) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(ex.script);
    utterance.lang = 'de-DE';
    utterance.rate = levelId === 'A1' ? 0.7 : levelId === 'A2' ? 0.8 : levelId === 'B1' ? 0.9 : 1.0;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    synthRef.current = utterance;
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const handleAnswer = (qId, ans) => {
    setAnswers({ ...answers, [qId]: ans });
  };

  const submitAll = () => {
    let s = 0;
    ex.questions.forEach(q => {
      if (answers[q.id] === q.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
    updateLevelProgress(levelId, 'listening', { date: new Date().toISOString(), score: s, total: ex.questions.length });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex gap-2">
          {exercises.map((_, i) => (
            <button key={i} onClick={() => { setCurrentEx(i); setAnswers({}); setSubmitted(false); setShowTranscript(false); }}
              className="w-8 h-8 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: currentEx === i ? 'var(--accent)' : 'var(--bg-hover)', color: currentEx === i ? '#fff' : 'var(--text-secondary)' }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6 mb-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>{ex.title}</h2>
        {playing ? (
          <button onClick={stop} className="px-6 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#ff3355', color: '#fff' }}>
            <Square size={16} /> Stop
          </button>
        ) : (
          <button onClick={speak} className="px-6 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            <Play size={16} /> Play Audio
          </button>
        )}
        <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          <Volume2 size={12} className="inline mr-1" />
          Uses browser speech synthesis. Volume may vary.
        </div>
      </div>

      <div className="space-y-4">
        {ex.questions.map(q => {
          const userAns = answers[q.id];
          const isCorrect = submitted && userAns === q.answer;
          return (
            <div key={q.id} className="rounded-xl p-4" style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${isCorrect ? '#3bff9e' : submitted && userAns ? '#ff3355' : 'var(--border)'}`,
            }}>
              <p className="text-sm mb-3">{q.question}</p>
              {q.type === 'mcq' && q.options && (
                <div className="grid grid-cols-1 gap-1">
                  {q.options.map(opt => (
                    <button key={opt} onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="text-left px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)',
                        color: userAns === opt ? '#fff' : 'var(--text-primary)',
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === 'true-false' && (
                <div className="flex gap-2">
                  {['true', 'false'].map(opt => (
                    <button key={opt} onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)',
                        color: userAns === opt ? '#fff' : 'var(--text-secondary)',
                      }}>
                      {opt === 'true' ? 'True' : 'False'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button onClick={submitAll} className="mt-6 w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Submit All Answers
        </button>
      )}

      {submitted && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-lg font-bold" style={{ color: score >= ex.questions.length * 0.7 ? '#3bff9e' : '#ffaa33' }}>
              Score: {score}/{ex.questions.length}
            </p>
          </div>
          <button onClick={() => setShowTranscript(!showTranscript)} className="w-full py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          {showTranscript && (
            <div className="p-4 rounded-lg text-sm whitespace-pre-line" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
              {ex.script}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
