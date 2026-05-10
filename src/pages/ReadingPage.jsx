import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { updateLevelProgress, recordAnswer, completeReading } from '../utils/store';
import readingData from '../data/reading.json';
import LevelLock from '../components/LevelLock';
import { getPracticeItemStatus, recordPracticeAttempt } from '../utils/practiceProgress';

export default function ReadingPage() {
  const { levelId } = useParams();
  const exercises = readingData[levelId] || [];
  const [currentEx, setCurrentEx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const ex = exercises[currentEx];
  const readingStatuses = exercises.map((_, i) => getPracticeItemStatus('reading', `reading_${levelId}_${i}`));

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

  // Guard against stale/null exercise (Back navigation edge case)
  if (!ex) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>Exercise not found</p>
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
    const allCorrect = s === ex.questions.length;
    const readingId = `reading_${levelId}_${currentEx}`;
    
    if (allCorrect) {
      completeReading(levelId, readingId);
    } else {
      // Record wrong answers as mistakes
      ex.questions.forEach(q => {
        if (answers[q.id] !== q.answer) {
          recordAnswer(levelId, readingId, answers[q.id] || '', q.answer, 'reading', false, 'reading', {
            sourceQuestion: q.question || null,
            sourceOptions: q.options || null,
            sourceTitle: ex.title || 'Reading',
            sourceType: q.options ? 'mcq' : 'true-false',
            sourceItemId: `${readingId}_${q.id}`,
          });
        }
      });
    }
    
    updateLevelProgress(levelId, 'reading', { date: new Date().toISOString(), score: s, total: ex.questions.length, exerciseId: readingId });
    
    recordPracticeAttempt('reading', readingId, {
      correct: allCorrect,
      score: s,
      maxScore: ex.questions.length,
      level: levelId,
      topic: ex.title || 'Reading',
    });
  };
  const allAnswered = ex.questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Reading exercise selector">
          {exercises.map((_, i) => {
            const st = readingStatuses[i];
            let bgColor = 'var(--bg-hover)';
            if (currentEx === i) bgColor = 'var(--accent)';
            else if (st.status === 'completed_correct' || st.status === 'mastered') bgColor = '#1a5c3a';
            else if (st.status === 'completed_incorrect') bgColor = '#5c1a2a';
            return (
            <button key={i} type="button" aria-label={`Reading exercise ${i + 1}`} aria-current={currentEx === i ? 'true' : undefined} onClick={() => { setCurrentEx(i); setAnswers({}); setSubmitted(false); }}
              className="w-11 h-11 flex-shrink-0 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ backgroundColor: bgColor, color: currentEx === i || st.status !== 'unattempted' ? '#fff' : 'var(--text-secondary)' }}>
              {i + 1}
            </button>
            );
          })}
        </div>
      </div>

      {/* Status summary bar */}
      {(() => {
        const completed = readingStatuses.filter(s => s.status === 'completed_correct' || s.status === 'mastered').length;
        const needsReview = readingStatuses.filter(s => s.status === 'completed_incorrect').length;
        const remaining = exercises.length - completed - needsReview;
        if (completed === 0 && needsReview === 0) return null;
        return (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.75rem' }}>
            {completed > 0 && <span style={{ color: '#22c55e' }}>{completed} completed</span>}
            {needsReview > 0 && <span style={{ color: '#ef4444' }}>{needsReview} needs review</span>}
            <span style={{ color: 'var(--text-muted)' }}>{remaining} remaining</span>
          </div>
        );
      })()}

      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>{ex.title}</h2>
        <div className="text-sm leading-relaxed whitespace-pre-line break-words" style={{ color: 'var(--text-secondary)' }}>{ex.text}</div>
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
                    <button key={opt} type="button" onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="px-4 py-3 rounded-lg text-sm"
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
                    <button key={opt} type="button" onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="text-left px-3 py-3 rounded-lg text-sm"
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
                    <button key={opt} type="button" onClick={() => !submitted && handleAnswer(q.id, opt)}
                      className="px-3 py-2.5 rounded-lg text-sm"
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
        <button
          type="button"
          onClick={submitAll}
          disabled={!allAnswered}
          className="mt-6 w-full py-3 rounded-lg font-semibold"
          style={{
            backgroundColor: allAnswered ? 'var(--accent)' : 'var(--bg-hover)',
            color: allAnswered ? '#fff' : 'var(--text-muted)',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
          }}
        >
          {allAnswered ? 'Submit All Answers' : 'Answer all questions to submit'}
        </button>
      )}

      {submitted && (
        <div className="mt-6 p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-bold" style={{ color: score >= ex.questions.length * 0.7 ? '#3bff9e' : '#ffaa33' }}>
            Score: {score}/{ex.questions.length}
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
              Retry
            </button>
            {currentEx < exercises.length - 1 && (
              <button type="button" onClick={() => { setCurrentEx(currentEx + 1); setAnswers({}); setSubmitted(false); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                Next Exercise
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
