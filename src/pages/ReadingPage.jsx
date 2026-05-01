import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { updateLevelProgress } from '../utils/store';
import readingData from '../data/reading.json';
import LevelLock from '../components/LevelLock';

export default function ReadingPage() {
  const { levelId } = useParams();
  const exercises = readingData[levelId] || [];
  const [currentEx, setCurrentEx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const ex = exercises[currentEx];

  if (exercises.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No reading exercises for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

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
    updateLevelProgress(levelId, 'reading', { date: new Date().toISOString(), score: s, total: ex.questions.length });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex gap-2">
          {exercises.map((_, i) => (
            <button key={i} onClick={() => { setCurrentEx(i); setAnswers({}); setSubmitted(false); }}
              className="w-8 h-8 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: currentEx === i ? 'var(--accent)' : 'var(--bg-hover)', color: currentEx === i ? '#fff' : 'var(--text-secondary)' }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>{ex.title}</h2>
        <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{ex.text}</div>
      </div>

      <div className="space-y-4">
        {ex.questions.map(q => {
          const userAns = answers[q.id];
          const isCorrect = submitted && userAns === q.answer;
          const isWrong = submitted && userAns && userAns !== q.answer;

          return (
            <div key={q.id} className="rounded-xl p-4" style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${isCorrect ? '#3bff9e' : isWrong ? '#ff3355' : 'var(--border)'}`,
            }}>
              <p className="text-sm mb-3">{q.question}</p>

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

              {q.type === 'gap-fill' && q.options && (
                <div className="flex gap-2 flex-wrap">
                  {q.options.map(opt => (
                    <button key={opt} onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{
                        backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)',
                        color: userAns === opt ? '#fff' : 'var(--text-primary)',
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {submitted && q.explanation && (
                <div className="mt-2 text-xs" style={{ color: isCorrect ? '#3bff9e' : 'var(--text-secondary)' }}>
                  {q.explanation}
                  {!userAns && <span className="ml-2" style={{ color: '#ffaa33' }}>(Answer: {q.answer})</span>}
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
        <div className="mt-6 p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-bold" style={{ color: score >= ex.questions.length * 0.7 ? '#3bff9e' : '#ffaa33' }}>
            Score: {score}/{ex.questions.length}
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
              Retry
            </button>
            {currentEx < exercises.length - 1 && (
              <button onClick={() => { setCurrentEx(currentEx + 1); setAnswers({}); setSubmitted(false); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                Next Exercise
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
