import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getState, updateState, isExamUnlocked } from '../utils/store';
import levelsData from '../data/levels.json';
import examsData from '../data/exams.json';
import LevelLock from '../components/LevelLock';
import GermanCharHelper from '../components/GermanCharHelper';
import { Volume2, Pause, Eye, EyeOff } from 'lucide-react';

export default function ExamPage() {
  const { levelId } = useParams();
  const levelData = levelsData.levels.find(l => l.id === levelId);
  const rawExam = examsData.exams[levelId];

  const [examList, setExamList] = useState(null);
  const [selectedExamIdx, setSelectedExamIdx] = useState(0);
  const [phase, setPhase] = useState(() => Array.isArray(rawExam) ? 'select' : 'intro');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [scores, setScores] = useState({});
  const [overallScore, setOverallScore] = useState(0);
  const [showTranscript, setShowTranscript] = useState({});

  const writingRef = useRef(null);
  const unlocked = levelData ? isExamUnlocked(levelId, levelData) : false;
  const state = getState();
  const levelProgress = state.levels?.[levelId] || {};
  const examRequirements = levelData ? [
    { label: 'Grammar', current: levelProgress.grammar?.length || 0, target: levelData.grammarUnits || 10 },
    { label: 'Vocabulary', current: levelProgress.vocab?.length || 0, target: levelData.vocabularyUnits || 10 },
    { label: 'Writing', current: (state.writings || []).filter(w => w.level === levelId).length, target: levelData.minWritingTasks || 10 },
    { label: 'Speaking', current: (state.speakingRecordings?.[levelId] || []).length, target: levelData.minSpeakingTasks || 10 },
    { label: 'Listening', current: levelProgress.listening?.length || 0, target: levelData.minListeningTests || 5 },
    { label: 'Reading', current: levelProgress.reading?.length || 0, target: levelData.minReadingTests || 5 },
  ] : [];
  const missingExamRequirements = examRequirements.filter(r => r.current < r.target);

  function normalizeAnswer(value) {
    return String(value || '')
      .trim()
      .replace(/[.!?,;:]+$/, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  function isShortAnswerCorrect(userAnswer, task) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const accepted = (task.acceptedAnswers && task.acceptedAnswers.length
      ? task.acceptedAnswers
      : [task.answer]
    ).map(normalizeAnswer);
    return accepted.includes(normalizedUser);
  }

  // Normalise: handle both single-exam dict and multi-exam list
  useEffect(() => {
    if (!rawExam) return;
    if (Array.isArray(rawExam)) {
      setExamList(rawExam);
      setSelectedExamIdx(0);
      setPhase('select');
    } else {
      setExamList(null);
      setPhase('intro');
    }
  }, [rawExam]);

  // The current exam object (single dict, or selected from list)
  const exam = Array.isArray(rawExam) ? rawExam[selectedExamIdx] : rawExam;
  
  const sectionKeys = Object.keys(exam?.sections || {});

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  if (!levelData) {
    return <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Level not found</div>;
  }

  if (!rawExam || !unlocked) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
          {!rawExam ? 'Exam not available' : 'Exam is locked'}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          {!unlocked ? 'Complete all requirements for this level first.' : ''}
        </p>
        {!unlocked && missingExamRequirements.length > 0 && (
          <div className="max-w-md mx-auto mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingExamRequirements.map(r => (
              <div key={r.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ color: r.current === 0 ? '#ef4444' : 'var(--accent)', fontWeight: 600 }}>{r.current}/{r.target}</span>
              </div>
            ))}
          </div>
        )}
        <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  const startExam = (idx) => {
    if (examList && idx !== undefined) setSelectedExamIdx(idx);
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
    // Only count gradable tasks (those with an answer field)
    const gradableTasks = tasks.filter(t => t.answer !== undefined && t.answer !== null);
    let score = 0;
    gradableTasks.forEach(t => {
      if (t.type === 'short-answer') {
        if (isShortAnswerCorrect(answers[t.id], t)) score++;
      } else {
        if (answers[t.id] === t.answer) score++;
      }
    });
    const newScores = { ...scores, [sectionKey]: { score, total: gradableTasks.length } };
    setScores(newScores);

    if (currentSection < sectionKeys.length - 1) {
      setCurrentSection(currentSection + 1);
      setAnswers({});
    } else {
      setTimerActive(false);
      const totalCorrect = Object.values(newScores).reduce((acc, s) => acc + s.score, 0);
      const maxPossible = Object.values(newScores).reduce((acc, s) => acc + s.total, 0);
      const pct = maxPossible > 0 ? Math.round((totalCorrect / maxPossible) * 100) : 0;
      setOverallScore(pct);
      setPhase('result');

      const state = getState();
      const nextExams = { ...state.exams, [levelId]: { passed: pct >= exam.passScore, score: pct, date: new Date().toISOString() } };
      let nextCurrentLevel = state.currentLevel;
      // Auto-advance to next level on pass
      if (pct >= exam.passScore) {
        const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
        const idx = levelsOrder.indexOf(levelId);
        if (idx >= 0 && idx < levelsOrder.length - 1) {
          nextCurrentLevel = levelsOrder[idx + 1];
        }
      }
      updateState({ exams: nextExams, currentLevel: nextCurrentLevel });
    }
  };

  const sectionKey = sectionKeys[currentSection];
  const section = exam.sections[sectionKey];
  const tasks = section?.tasks || [];

  const renderTaskButtons = (task) => {
    const userAns = answers[task.id];
    if (task.type === 'true-false') {
      return (
        <div className="flex gap-2 mt-2">
          {['true', 'false'].map(opt => (
            <button key={opt} type="button" onClick={() => setAnswers({ ...answers, [task.id]: opt })}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-secondary)' }}>
              {opt === 'true' ? 'True' : 'False'}
            </button>
          ))}
        </div>
      );
    }
    if (task.type === 'mcq' || task.type === 'heading-match' || task.type === 'opinion-match') {
      const options = task.options || [];
      return (
        <div className="grid grid-cols-1 gap-1 mt-2">
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => setAnswers({ ...answers, [task.id]: opt })}
              className="text-left px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (task.type === 'gap-fill' && task.options) {
      return (
        <div className="flex gap-2 flex-wrap mt-2">
          {task.options.map(opt => (
            <button key={opt} type="button" onClick={() => setAnswers({ ...answers, [task.id]: opt })}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: userAns === opt ? 'var(--accent)' : 'var(--bg-hover)', color: userAns === opt ? '#fff' : 'var(--text-primary)' }}>
              {opt}
            </button>
          ))}
        </div>
      );
    }
    if (task.type === 'short-answer') {
      return (
        <input
          type="text"
          aria-label="Exam short answer"
          value={answers[task.id] || ''}
          onChange={(e) => setAnswers({ ...answers, [task.id]: e.target.value })}
          placeholder="Type your answer..."
          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)'
          }}
        />
      );
    }
    return null;
  };

  // Exam selection phase (multi-exam levels like A1)
  if (phase === 'select' && examList) {
    return (
      <LevelLock levelId={levelId}>
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>A1 Practice Exams</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Goethe-style practice exams</p>
        <div className="space-y-3">
          {examList.map((ex, idx) => (
            <button key={ex.id} type="button" onClick={() => startExam(idx)}
              className="w-full text-left p-4 rounded-xl"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="font-semibold text-sm">{ex.name}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {Object.entries(ex.sections).map(([sk, sv]) =>
                  `${sk} (${sv.tasks?.length || 1})`
                ).join(' | ')}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Passing score: {ex.passScore}% | Time: ~60 min
              </div>
            </button>
          ))}
        </div>
      </div>
      </LevelLock>
    );
  }

  if (phase === 'intro') {
    return (
      <LevelLock levelId={levelId}>
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="flex items-center justify-between mb-6">
          {examList ? (
            <button type="button" onClick={() => setPhase('select')} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; All exams</button>
          ) : (
            <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
          )}
        </div>
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
        <button type="button" onClick={() => startExam(selectedExamIdx)} className="px-8 py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Start Exam
        </button>
      </div>
      </LevelLock>
    );
  }

  if (phase === 'result') {
    return (
      <LevelLock levelId={levelId}>
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="flex items-center justify-between mb-6">
          {examList ? (
            <button type="button" onClick={() => setPhase('select')} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; All exams</button>
          ) : (
            <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
          )}
        </div>
        <div className="text-5xl mb-4">{overallScore >= exam.passScore ? '\u{1F389}' : '\u{1F4AA}'}</div>
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
          <button type="button" onClick={() => { setPhase('intro'); setAnswers({}); setScores({}); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Review Exam
          </button>
          <button type="button" onClick={() => startExam(selectedExamIdx)} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Retake
          </button>
          {examList ? (
            <button type="button" onClick={() => setPhase('select')} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              More Exams
            </button>
          ) : (
            <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              Back to Level
            </Link>
          )}
        </div>
      </div>
    </LevelLock>
    );
  }

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {examList && (
            <button type="button" onClick={() => { setPhase('intro'); setAnswers({}); setScores({}); }} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              &larr; Exam Menu
            </button>
          )}
          <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{sectionKey}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {currentSection + 1}/{sectionKeys.length}
          </span>
          <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,51,85,0.1)', color: '#ff3355' }}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {renderSectionContent()}

      <button type="button" onClick={submitSection} className="mt-6 w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
        {currentSection < sectionKeys.length - 1 ? 'Next Section' : 'Finish Exam'}
      </button>
    </div>
    </LevelLock>
  );

  function renderSectionContent() {
    if (sectionKey === 'Hören') {
      return (
        <div className="space-y-4">
          {tasks.map(task => {
            const answered = answers[task.id] !== undefined;
            const transcriptVisible = showTranscript[task.id];
            return (
              <div key={task.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(task.question);
                      utterance.rate = 0.85;
                      utterance.lang = 'de-DE';
                      speechSynthesis.cancel();
                      speechSynthesis.speak(utterance);
                    }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                      <Volume2 size={14} /> Play
                    </button>
                    <button type="button" aria-label="Stop exam audio" onClick={() => speechSynthesis.cancel()} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <Pause size={12} />
                    </button>
                    {answered && (
                      <button type="button" onClick={() => setShowTranscript({ ...showTranscript, [task.id]: !transcriptVisible })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: transcriptVisible ? 'rgba(59,255,158,0.1)' : 'var(--bg-hover)', color: transcriptVisible ? '#3bff9e' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                        {transcriptVisible ? <EyeOff size={14} /> : <Eye size={14} />} {transcriptVisible ? 'Hide' : 'Show'} transcript
                      </button>
                    )}
                  </div>
                  {answered && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e' }}>Answered</span>}
                </div>
                {!answered && (
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Listen to the audio and answer the question.</p>
                )}
                {answered && transcriptVisible && (
                  <p className="text-sm mb-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                    {task.question}
                  </p>
                )}
                {renderTaskButtons(task)}
              </div>
            );
          })}
        </div>
      );
    }

    if (sectionKey === 'Schreiben') {
      return (
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-2">{tasks[0]?.prompt || 'Writing task'}</p>
          <div className="text-xs mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>Checklist</div>
            <ul className="space-y-0.5 list-disc pl-4">
              <li>Answer the task fully</li>
              <li>Use simple correct sentences</li>
              <li>Include greeting and closing if it is a message/email</li>
              <li>Stay near the word limit</li>
              <li>Check verb position and capitalization</li>
            </ul>
          </div>
          <textarea className="w-full h-48 p-4 rounded-lg text-sm outline-none resize-none"
            ref={writingRef}
            aria-label="Exam writing response"
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            placeholder="Write your response..."
            onChange={(e) => setAnswers({ ...answers, written: e.target.value })}
          />
          <GermanCharHelper targetRef={writingRef} compact style={{ marginTop: '0.25rem' }} />
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Words: {(answers.written || '').split(/\s+/).filter(Boolean).length} | Target: ~{tasks[0]?.wordLimit || 200}
          </div>
        </div>
      );
    }

    // Default: Lesen, Sprechen
    return (
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-3 break-words">{task.prompt || task.question}</p>
            {task.talkTime && (
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Talk time: ~{task.talkTime} seconds
              </p>
            )}
            {sectionKey === 'Sprechen' && (
              <p className="text-xs mb-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                {task.instructions || 'Prepare briefly, then speak in simple German.'}
              </p>
            )}
            {renderTaskButtons(task)}
          </div>
        ))}
      </div>
    );
  }
}
