import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { updateLevelProgress } from '../utils/store';
import listeningData from '../data/listening.json';
import LevelLock from '../components/LevelLock';
import { Play, Square, Volume2, Mic, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

const TTS_AVAILABLE = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function ListeningPage() {
  const { levelId } = useParams();
  const exercises = listeningData[levelId] || [];
  const [currentEx, setCurrentEx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [slowMode, setSlowMode] = useState(false);
  const utteranceRef = useRef(null);
  const submittedRef = useRef(false);

  const ex = exercises[currentEx];

  // Load available German voices
  useEffect(() => {
    if (!TTS_AVAILABLE) return;
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('de'));
      if (all.length > 0) {
        setVoices(all);
        const preferred = all.find(v => v.name.includes('Google') || v.name.includes('Microsoft'));
        setSelectedVoice(prev => prev || preferred || all[0]);
      }
    };
    loadVoices();
    const handler = () => loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
  }, []);

  // Cancel speech on exercise change
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentEx]);

  // Reset state when changing exercises
  const goToExercise = (idx) => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    setCurrentEx(idx);
    setAnswers({});
    setSubmitted(false);
    setShowTranscript(false);
    setPlaying(false);
    setPaused(false);
    submittedRef.current = false;
  };

  if (exercises.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No listening exercises for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  const speak = (rateOverride) => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(ex.script);
    utterance.lang = 'de-DE';
    utterance.rate = rateOverride !== undefined
      ? rateOverride
      : slowMode
        ? 0.5
        : levelId === 'A1' ? 0.6 : levelId === 'A2' ? 0.7 : levelId === 'B1' ? 0.8 : 0.9;
    utterance.pitch = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utteranceRef.current = utterance;
    utterance.onend = () => {
      setPlaying(false);
      setPaused(false);
    };
    setPlaying(true);
    setPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!TTS_AVAILABLE) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }
    speak();
  };

  const handleSlowPlay = () => {
    if (!TTS_AVAILABLE) return;
    speak(0.5);
  };

  const handleReplay = () => {
    if (!TTS_AVAILABLE) return;
    speak();
  };

  const pausePlay = () => {
    if (!TTS_AVAILABLE) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else if (playing) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    if (!TTS_AVAILABLE) return;
    window.speechSynthesis.cancel();
    setPlaying(false);
    setPaused(false);
  };

  const handleAnswer = (qId, ans) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: ans });
  };

  const submitAll = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    let s = 0;
    ex.questions.forEach(q => {
      if (answers[q.id] === q.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
    setShowTranscript(true);
    updateLevelProgress(levelId, 'listening', { date: new Date().toISOString(), score: s, total: ex.questions.length });
  };

  if (!ex) return null;

  // Show transcript pre-submit when TTS is unavailable (no audio fallback)
  useEffect(() => {
    if (!TTS_AVAILABLE && !submitted) {
      setShowTranscript(true);
    }
  }, [currentEx, submitted]);

  // Determine if any answer has been selected
  const allAnswered = ex.questions.every(q => answers[q.id] !== undefined);

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex gap-2">
          {exercises.map((_, i) => (
            <button key={i} onClick={() => goToExercise(i)}
              className="w-11 h-11 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-cyan-400"
              style={{ backgroundColor: currentEx === i ? 'var(--accent)' : 'var(--bg-hover)', color: currentEx === i ? '#fff' : 'var(--text-secondary)' }}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Audio card */}
      <div className="rounded-xl p-6 mb-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>{ex.title}</h2>

        {/* Instructions */}
        <div className="text-xs mb-4 px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          {TTS_AVAILABLE ? 'Listen carefully. Answer the questions below after listening.' : 'Audio not available. Read the transcript and answer the questions below.'} {submitted ? 'Transcript is now available below.' : ''}
        </div>

        {!TTS_AVAILABLE ? (
          /* Fallback for unsupported browsers */
          <div className="p-4 rounded-lg mb-3" style={{ backgroundColor: 'rgba(255,170,51,0.08)', border: '1px solid rgba(255,170,51,0.3)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#ffaa33' }}>Audio not available</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Your browser does not support speech synthesis. The transcript is shown below instead.
            </p>
          </div>
        ) : (
          <>
            {/* Voice selector and controls */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <Mic size={14} style={{ color: 'var(--text-muted)' }} />
              {voices.length > 0 ? (
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value) || voices[0])}
                  className="text-xs px-2 py-1 rounded outline-none"
                  style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xs" style={{ color: '#ffaa33' }}>No German voices detected &mdash; </span>
              )}
              <button onClick={() => {
                window.speechSynthesis.getVoices();
                const all = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('de'));
                if (all.length > 0) {
                  setVoices(all);
                  if (!selectedVoice) setSelectedVoice(all[0]);
                }
              }} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
                Reload
              </button>
            </div>

            {/* Main playback controls */}
            <div className="flex justify-center gap-3 flex-wrap">
              {!playing ? (
                <button onClick={handlePlay} className="px-6 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                  <Play size={16} /> {submitted ? 'Replay Audio' : 'Play Audio'}
                </button>
              ) : (
                <>
                  <button onClick={pausePlay} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
                    {paused ? <Play size={16} /> : <Volume2 size={16} />} {paused ? 'Resume' : 'Pause'}
                  </button>
                  <button onClick={stop} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                    <Square size={16} /> Stop
                  </button>
                </>
              )}

              {/* Slow mode toggle */}
              {!playing && (
                <button
                  onClick={() => { setSlowMode(s => !s); }}
                  className="px-4 py-3 rounded-lg inline-flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: slowMode ? 'rgba(139,92,246,0.15)' : 'var(--bg-hover)',
                    color: slowMode ? '#8b5cf6' : 'var(--text-secondary)',
                    border: `1px solid ${slowMode ? '#8b5cf6' : 'var(--border)'}`,
                  }}
                  title={slowMode ? 'Switch to normal speed' : 'Play at half speed'}
                >
                  <Volume2 size={14} /> {slowMode ? 'Normal Speed' : 'Slow (0.5x)'}
                </button>
              )}
            </div>

            {/* Speed info */}
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Speed: {slowMode ? '0.5x (slow)' : levelId === 'A1' ? '0.6x' : levelId === 'A2' ? '0.7x' : levelId === 'B1' ? '0.8x' : '0.9x'}
            </div>

            {/* Replay button (after submission) */}
            {submitted && (
              <div className="mt-3">
                <button onClick={handleReplay} className="px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                  <Play size={14} /> Replay Audio
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {ex.questions.map(q => {
          const userAns = answers[q.id];
          const isCorrect = submitted && userAns === q.answer;
          const isWrong = submitted && userAns && userAns !== q.answer;
          return (
            <div key={q.id} className="rounded-xl p-4" style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'var(--border)'}`,
            }}>
              <p className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{q.question}</p>
              {q.type === 'mcq' && q.options && (
                <div className="grid grid-cols-1 gap-1">
                  {q.options.map(opt => {
                    const isUserChoice = userAns === opt;
                    const isCorrectAnswer = submitted && opt === q.answer;
                    let bg = 'var(--bg-hover)';
                    let txt = 'var(--text-primary)';
                    if (submitted && isCorrectAnswer) { bg = '#22c55e'; txt = '#fff'; }
                    else if (submitted && isUserChoice && !isCorrectAnswer) { bg = '#ef4444'; txt = '#fff'; }
                    else if (isUserChoice) { bg = 'var(--accent)'; txt = '#fff'; }
                    return (
                      <button key={opt} onClick={() => handleAnswer(q.id, opt)}
                        disabled={submitted}
                        className="text-left px-3 py-3 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: bg,
                          color: txt,
                          cursor: submitted ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                        {submitted && isCorrectAnswer && <CheckCircle size={14} />}
                        {submitted && isUserChoice && !isCorrectAnswer && <XCircle size={14} />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
              {q.type === 'true-false' && (
                <div className="flex gap-2">
                  {['true', 'false'].map(opt => {
                    const isUserChoice = userAns === opt;
                    const isCorrectAnswer = submitted && opt === q.answer;
                    let bg = 'var(--bg-hover)';
                    let txt = 'var(--text-secondary)';
                    if (submitted && isCorrectAnswer) { bg = '#22c55e'; txt = '#fff'; }
                    else if (submitted && isUserChoice && !isCorrectAnswer) { bg = '#ef4444'; txt = '#fff'; }
                    else if (isUserChoice) { bg = 'var(--accent)'; txt = '#fff'; }
                    return (
                      <button key={opt} onClick={() => handleAnswer(q.id, opt)}
                        disabled={submitted}
                        className="px-4 py-3 rounded-lg text-sm transition-colors"
                        style={{
                          backgroundColor: bg,
                          color: txt,
                          cursor: submitted ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}>
                        {submitted && isCorrectAnswer && <CheckCircle size={14} />}
                        {submitted && isUserChoice && !isCorrectAnswer && <XCircle size={14} />}
                        {opt === 'true' ? 'True' : 'False'}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* After submission: show correct answer feedback */}
              {submitted && isWrong && (
                <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Correct answer: <span style={{ color: '#22c55e', fontWeight: 500 }}>{q.answer}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={submitAll}
          disabled={!allAnswered}
          className="mt-6 w-full py-3 rounded-lg font-semibold"
          style={{
            backgroundColor: allAnswered ? 'var(--accent)' : 'var(--bg-hover)',
            color: allAnswered ? '#fff' : 'var(--text-muted)',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            border: 'none',
          }}
        >
          {allAnswered ? 'Submit All Answers' : 'Answer all questions to submit'}
        </button>
      )}

      {/* Results and transcript section */}
      {submitted && (
        <div className="mt-6 space-y-4">
          {/* Score card */}
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-lg font-bold" style={{ color: score >= ex.questions.length * 0.7 ? '#22c55e' : score >= ex.questions.length * 0.5 ? '#f59e0b' : '#ef4444' }}>
              Score: {score}/{ex.questions.length}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {score >= ex.questions.length * 0.7 ? 'Well done!' : score >= ex.questions.length * 0.5 ? 'Keep practicing!' : 'Try again for a better result'}
            </p>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscript(s => !s)}
            className="w-full py-3 px-4 rounded-lg text-sm flex items-center justify-between"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <span className="flex items-center gap-2">
              <Volume2 size={14} style={{ color: 'var(--accent)' }} />
              Transcript
            </span>
            {showTranscript ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
          </button>
          {showTranscript && (
            <div className="p-4 rounded-lg text-sm whitespace-pre-line leading-relaxed"
              style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              {ex.script}
            </div>
          )}
        </div>
      )}
    </div>
    </LevelLock>
  );
}
