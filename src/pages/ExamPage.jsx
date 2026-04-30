import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateState, isExamUnlocked } from '../utils/store';
import levelsData from '../data/levels.json';
import examsData from '../data/exams.json';

export default function ExamPage() {
  const { levelId } = useParams();
  const levelData = levelsData.levels.find(l => l.id === levelId);
  const exam = examsData.exams[levelId];
  const [phase, setPhase] = useState('intro'); // intro | active | result
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);

  const unlocked = isExamUnlocked(levelId, levelData);
  const sections = exam?.sections ? Object.entries(exam.sections) : [];
  const sectionKeys = Object.keys(exam?.sections || {});

  useEffect(() => {
    if (timerActive) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive]);

  if (!exam || !unlocked) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
          {!exam ? 'Exam not available' : 'Exam is locked'}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          {!unlocked && 'Complete all requirements for this level first.'}
        </p>
        <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Back</Link>
      </div>
    );
  }

  const startExam = () => {
    setPhase('active');
    setCurrentSection(0);
    setAnswers({});
    setScores({});
    setTimer(0);
    setTimerActive(true);
  };

  const submitSection = () => {
    const sectionKey = sectionKeys[currentSection];
    const section = exam.sections[sectionKey];
    const tasks = section.tasks || [];
    let s = 0;
    tasks.forEach(t => {
      if (answers[t.id] === t.answer) s++;
    });
    const newScores = { ...scores, [sectionKey]: { score: s, total: tasks.length } };
    setScores(newScores);
    
    if (currentSection < sectionKeys.length - 1) {
      setCurrentSection(currentSection + 1);
      setAnswers({});
    } else {
      setTimerActive(false);
      const total = Object.values(newScores).reduce((acc, s) => acc + s.score, 0);
      const maxTotal = Object.values(newScores).reduce((acc, s) => acc + s.total, 0);
      const pct = Math.round((total / maxTotal) * 100);
      setOverallScore(pct);
      setPhase('result');
      
      const state = getState();
      state.exams[levelId] = { passed: pct >= exam.passScore, score: pct, date: new Date().toISOString() };
      updateState({ exams: state.exams });
    }
  };

  const sectionKey = sectionKeys[currentSection];
  const section = exam.sections[sectionKey];
  const tasks = section?.tasks || [];

  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>{exam.name}</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Level {levelId} - Goethe-style practice exam</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {sectionKeys.map(sk => {
            const s = exam.sections[sk];
            return (
              <div key={sk} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="font-semibold text-sm">{sk}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.timeLimit} min | {s.tasks?.length || 1} tasks</div>
              </div>
            );
          })}
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Passing score: {exam.passScore}%</p>
        <button onClick={startExam} className="px-8 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Start Exam
        </button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="text-5xl mb-4">{overallScore >= exam.passScore ? '🎉' : '💪'}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: overallScore >= exam.passScore ? '#3bff9e' : '#ffaa33' }}>
          {overallScore >= exam.passScore ? 'Passed!' : 'Not quite'}
        </h2>
        <p className="text-lg mb-6">Score: {overallScore}%</p>
        <div className="space-y-2 mb-6">
          {Object.entries(scores).map(([sk, s]) => (
            <div key={sk} className="flex justify-between p-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <span>{sk}</span>
              <span style={{ color: s.score >= s.total * 0.7 ? '#3bff9e' : '#ff3355' }}>{s.score}/{s.total}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={startExam} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Retake
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
        <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{sectionKey}</div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {currentSection + 1}/{sectionKeys.length}
          </span>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355' }}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {sectionKey === 'Schreiben' ? (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-4">{tasks[0]?.prompt || 'Writing task'}</p>
          <textarea className="w-full h-48 p-4 rounded-lg text-sm outline-none resize-none" 
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            placeholder="Write your response..."
            onChange={(e) => setAnswers({ ...answers, written: e.target.value })}
          />
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Words: {(answers.written || '').split(/\s+/).filter(Boolean).length} | Target: ~{tasks[0]?.wordLimit || 200}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => {
            const userAns = answers[task.id];
            return (
              <div key={task.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-sm mb-3">{task.question}</p>
                
                {task.type === 'true-false' && (
                  <div className="flex gap-2">
                    {['true', 'false'].map(opt => (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [task.id]: opt })}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-secondary)' }}>
                        {opt === 'true' ? 'True' : 'False'}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'mcq' && task.options && (
                  <div className="grid grid-cols-1 gap-1">
                    {task.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [task.id]: opt })}
                        className="text-left px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'gap-fill' && task.options && (
                  <div className="flex gap-2 flex-wrap">
                    {task.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [task.id]: opt })}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'heading-match' && task.options && (
                  <div className="grid grid-cols-1 gap-1">
                    {task.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [task.id]: opt })}
                        className="text-left px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {task.type === 'opinion-match' && task.options && (
                  <div className="grid grid-cols-1 gap-1">
                    {task.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [task.id]: opt })}
                        className="text-left px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button onClick={submitSection} className="mt-6 w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
        {currentSection < sectionKeys.length - 1 ? 'Next Section' : 'Finish Exam'}
      </button>
    </div>
  );
}
