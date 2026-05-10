import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { updateLevelProgress, recordAnswer, completeListening } from '../utils/store';
import { getPracticeItemStatus, recordPracticeAttempt } from '../utils/practiceProgress';
import listeningData from '../data/listening.json';
import { verifyAudioMatch } from '../utils/audioGuard';
import LevelLock from '../components/LevelLock';
import { Play, Square, Volume2, Mic, ChevronDown, ChevronUp, CheckCircle, XCircle, FileAudio } from 'lucide-react';

const TTS_AVAILABLE = typeof window !== 'undefined' && 'speechSynthesis' in window;

// Resolve audio file path to an absolute URL using Vite's BASE_URL
// Supports relative paths (e.g. "audio/listening/file.mp3") and already-absolute paths.
const resolveAudioPath = (path) => {
  if (path && path.startsWith('http')) return path;
  const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL || '/' : '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  return path && !path.startsWith(cleanBase) ? cleanBase + path.replace(/^\//, '') : path || '';
};

const normalizeChoice = (value) => String(value || '').trim().toLowerCase();

export default function ListeningPage() {
  const { levelId } = useParams();
  const exercises = useMemo(() => listeningData[levelId] || [], [levelId]);
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
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const nextAudioRef = useRef(null);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const submittedRef = useRef(false);

  const ex = exercises[currentEx];

  // Whether this exercise has an audio file
  const hasAudio = ex && typeof ex.audio === 'string' && ex.audio.length > 0 && !audioError;

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

  // Cancel speech and stop audio on exercise change
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentEx]);

  // Reset state when changing exercises
  const goToExercise = (idx) => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentEx(idx);
    setAnswers({});
    setSubmitted(false);
    setShowTranscript(false);
    setPlaying(false);
    setPaused(false);
    setAudioError(false);
    setAudioLoading(false);
    setAudioDuration(0);
    setAudioCurrentTime(0);
    submittedRef.current = false;
  };

  // Handle audio file errors
  const handleAudioError = () => {
    setAudioError(true);
    setPlaying(false);
    setPaused(false);
  };

  // Audio file playback
  const playAudio = (rate) => {
    if (!ex || !ex.audio) return;

    // Guard: verify audio file matches current item before playing
    const audioUrl = resolveAudioPath(ex.audio);
    const matchCheck = verifyAudioMatch(audioUrl, ex);
    if (!matchCheck.ok) {
      if (import.meta.env.DEV) {
        console.warn('[AudioGuard] ' + matchCheck.reason + ' — falling back to TTS/script.');
      }
      handleAudioError();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audio.playbackRate = rate || 1;
    audioRef.current = audio;

    setAudioLoading(true);

    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration);
      setAudioLoading(false);
    };

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setPlaying(false);
      setPaused(false);
      setAudioCurrentTime(0);
      setAudioLoading(false);
    };

    audio.onerror = () => {
      setAudioLoading(false);
      handleAudioError();
    };

    setPlaying(true);
    setPaused(false);
    audio.play().catch(() => {
      setAudioLoading(false);
      handleAudioError();
    });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPaused(true);
  };

  const resumeAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(() => {
      handleAudioError();
    });
    setPaused(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlaying(false);
    setPaused(false);
    setAudioCurrentTime(0);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // TTS playback
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
    if (hasAudio) {
      if (paused) {
        resumeAudio();
        return;
      }
      playAudio(slowMode ? 0.75 : 1);
      return;
    }
    if (!TTS_AVAILABLE) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }
    speak();
  };

  

  const handleReplay = () => {
    if (hasAudio) {
      stopAudio();
      playAudio(1);
      return;
    }
    if (!TTS_AVAILABLE) return;
    speak();
  };

  const pausePlay = () => {
    if (hasAudio) {
      if (paused) {
        resumeAudio();
      } else if (playing) {
        pauseAudio();
      }
      return;
    }
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
    if (hasAudio) {
      stopAudio();
      return;
    }
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
    if (!ex || !ex.questions) return;
    submittedRef.current = true;
    let s = 0;
    ex.questions.forEach(q => {
      const correct = normalizeChoice(answers[q.id]) === normalizeChoice(q.answer);
      if (correct) {
        s++;
      } else {
        recordAnswer(levelId, `${ex.id}_${q.id}`, answers[q.id] || '', q.answer, ex.title || 'Listening', false, 'listening', {
          sourceQuestion: q.question || null,
          sourceOptions: q.options || null,
          sourceTitle: ex.title || 'Listening',
          sourceType: q.options ? 'mcq' : 'fill-blank',
          sourceItemId: `${ex.id}_${q.id}`,
        });
      }
    });
    setScore(s);
    setSubmitted(true);
    setShowTranscript(true);
    
    const allCorrect = s === ex.questions.length;
    // Use index-based key (matching status lookup format) for consistent progress tracking
    const listeningId = `listening_${levelId}_${currentEx}`;
    
    if (allCorrect) {
      completeListening(levelId, listeningId);
    }
    
    updateLevelProgress(levelId, 'listening', { date: new Date().toISOString(), score: s, total: ex.questions.length, exerciseId: listeningId });
    
    recordPracticeAttempt('listening', listeningId, {
      correct: allCorrect,
      score: s,
      maxScore: ex.questions.length,
      level: levelId,
      topic: ex.title || 'Listening',
    });
  };

  // Show transcript pre-submit when both TTS and audio files are unavailable
  useEffect(() => {
    if (!TTS_AVAILABLE && !hasAudio && !submitted) {
      setShowTranscript(true);
    }
  }, [currentEx, submitted, hasAudio]);

  // Determine if any answer has been selected
  const allAnswered = ex?.questions?.every(q => answers[q.id] !== undefined) || false;
  const scorePercent = ex?.questions?.length ? (score / ex.questions.length) * 100 : 0;
  const wrongAnswers = submitted
    ? (ex.questions || [])
      .filter(q => normalizeChoice(answers[q.id]) !== normalizeChoice(q.answer))
      .map(q => ({
        id: q.id,
        userAnswer: answers[q.id] || '(no answer)',
        correctAnswer: q.answer,
        explanation: q.explanation || 'Replay the audio, read the transcript, and answer this item again.',
      }))
    : [];
  const resetExercise = () => goToExercise(currentEx);

  // Preload next exercise audio metadata
  useEffect(() => {
    if (!ex || !ex.audio) return;
    const nextIdx = currentEx + 1;
    const nextItem = exercises[nextIdx];
    if (nextItem && nextItem.audio) {
      const url = resolveAudioPath(nextItem.audio);
      if (nextAudioRef.current) {
        nextAudioRef.current.src = url;
      } else {
        nextAudioRef.current = new Audio();
        nextAudioRef.current.preload = 'metadata';
      }
      nextAudioRef.current.src = url;
    }
  }, [currentEx, ex, exercises]);

  if (!ex) return null;

  // Audio source indicator text
  const sourceLabel = hasAudio ? 'Audio file' : (TTS_AVAILABLE ? 'Browser voice' : 'Unavailable');
  const listeningStatuses = exercises.map((_, i) => getPracticeItemStatus('listening', `listening_${levelId}_${i}`));

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Listening exercise selector">
          {exercises.map((_, i) => {
            const st = listeningStatuses[i];
            let bgColor = 'var(--bg-hover)';
            if (currentEx === i) bgColor = 'var(--accent)';
            else if (st.status === 'completed_correct' || st.status === 'mastered') bgColor = '#1a5c3a';
            else if (st.status === 'completed_incorrect') bgColor = '#5c1a2a';
            return (
            <button key={i} type="button" aria-label={`Listening exercise ${i + 1}`} aria-current={currentEx === i ? 'true' : undefined} onClick={() => goToExercise(i)}
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
        const completed = listeningStatuses.filter(s => s.status === 'completed_correct' || s.status === 'mastered').length;
        const needsReview = listeningStatuses.filter(s => s.status === 'completed_incorrect').length;
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

      {/* Audio card */}
      <div className="rounded-xl p-6 mb-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>{ex.title}</h2>

        {/* Source indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {hasAudio ? (
            <FileAudio size={13} style={{ color: '#8b5cf6' }} />
          ) : (
            <Mic size={13} style={{ color: 'var(--text-muted)' }} />
          )}
          <span className="text-xs" style={{ color: hasAudio ? '#8b5cf6' : 'var(--text-muted)' }}>
            {sourceLabel}
          </span>
        </div>

        {/* Audio error banner */}
        {audioError && (
          <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Audio file unavailable. Using browser voice instead.
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs mb-4 px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          {hasAudio || TTS_AVAILABLE ? 'Listen carefully. Answer the questions below after listening.' : 'Audio not available. Read the transcript and answer the questions below.'} {submitted ? 'Transcript is now available below.' : ''}
        </div>

        {!TTS_AVAILABLE && !hasAudio ? (
          /* Fallback for no audio at all */
          <div className="p-4 rounded-lg mb-3" style={{ backgroundColor: 'rgba(255,170,51,0.08)', border: '1px solid rgba(255,170,51,0.3)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#ffaa33' }}>Audio not available</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Your browser does not support speech synthesis. The transcript is shown below instead.
            </p>
          </div>
          ) : hasAudio ? (
          <>
            {/* Audio file controls */}
            <div className="flex flex-col items-center gap-3 mb-3">
              {/* Progress bar */}
              {audioDuration > 0 && (
                <div className="w-full max-w-xs h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(audioCurrentTime / audioDuration) * 100}%`, backgroundColor: '#8b5cf6' }} />
                </div>
              )}
              <div className="flex items-center gap-2">
                {audioLoading && playing ? (
                  <button type="button" disabled className="px-6 py-3 rounded-lg inline-flex items-center gap-2 text-sm" style={{ backgroundColor: '#6b7280', color: '#fff', cursor: 'wait' }}>
                    Loading audio...
                  </button>
                ) : !playing ? (
                  <button
                    type="button"
                    onClick={handlePlay}
                    disabled={audioLoading}
                    className="px-6 py-3 rounded-lg inline-flex items-center gap-2"
                    style={{
                      backgroundColor: audioLoading ? '#6b7280' : '#8b5cf6',
                      color: '#fff',
                      cursor: audioLoading ? 'wait' : 'pointer',
                    }}
                  >
                    <Play size={16} /> {submitted ? 'Replay Audio' : 'Play Audio'}
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={pausePlay} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
                      {paused ? <Play size={16} /> : <Volume2 size={16} />} {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button type="button" onClick={stop} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                      <Square size={16} /> Stop
                    </button>
                  </>
                )}

                {/* Speed toggle for audio files */}
                {!playing && (
                  <button
                    type="button"
                    aria-pressed={slowMode}
                    onClick={() => { setSlowMode(s => !s); }}
                    className="px-4 py-3 rounded-lg inline-flex items-center gap-2 text-sm"
                    style={{
                      backgroundColor: slowMode ? 'rgba(139,92,246,0.15)' : 'var(--bg-hover)',
                      color: slowMode ? '#8b5cf6' : 'var(--text-secondary)',
                      border: `1px solid ${slowMode ? '#8b5cf6' : 'var(--border)'}`,
                    }}
                    title={slowMode ? 'Switch to normal speed' : 'Play at 0.75x speed'}
                  >
                    <Volume2 size={14} /> {slowMode ? 'Normal (1x)' : 'Slow (0.75x)'}
                  </button>
                )}
              </div>
              {/* Time display */}
              <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                {audioLoading && !audioDuration ? (
                  <span>Loading...</span>
                ) : audioDuration > 0 ? (
                  <span>{formatTime(audioCurrentTime)} / {formatTime(audioDuration)}</span>
                ) : null}
                {!playing && !paused && !slowMode && 'Speed: 1x'}
                {!playing && !paused && slowMode && 'Speed: 0.75x'}
              </div>
            </div>

            {/* Replay button (after submission) */}
            {submitted && (
              <div className="mt-3">
                <button type="button" onClick={handleReplay} className="px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: '#8b5cf6', border: '1px solid var(--border)' }}>
                  <Play size={14} /> Replay Audio
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Voice selector and controls (TTS path) */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              <Mic size={14} style={{ color: 'var(--text-muted)' }} />
              {voices.length > 0 ? (
                <select
                  aria-label="Select German voice"
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
              <button type="button" onClick={() => {
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

            {/* Main playback controls (TTS) */}
            <div className="flex justify-center gap-3 flex-wrap">
              {!playing ? (
                <button type="button" onClick={handlePlay} className="px-6 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                  <Play size={16} /> {submitted ? 'Replay Audio' : 'Play Audio'}
                </button>
              ) : (
                <>
                  <button type="button" onClick={pausePlay} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
                    {paused ? <Play size={16} /> : <Volume2 size={16} />} {paused ? 'Resume' : 'Pause'}
                  </button>
                  <button type="button" onClick={stop} className="px-5 py-3 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                    <Square size={16} /> Stop
                  </button>
                </>
              )}

              {/* Slow mode toggle (TTS) */}
              {!playing && (
                <button
                  type="button"
                  aria-pressed={slowMode}
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
                <button type="button" onClick={handleReplay} className="px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
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
          const isCorrect = submitted && normalizeChoice(userAns) === normalizeChoice(q.answer);
          const isWrong = submitted && userAns && normalizeChoice(userAns) !== normalizeChoice(q.answer);
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
                    const isCorrectAnswer = submitted && normalizeChoice(opt) === normalizeChoice(q.answer);
                    let bg = 'var(--bg-hover)';
                    let txt = 'var(--text-primary)';
                    if (submitted && isCorrectAnswer) { bg = '#22c55e'; txt = '#fff'; }
                    else if (submitted && isUserChoice && !isCorrectAnswer) { bg = '#ef4444'; txt = '#fff'; }
                    else if (isUserChoice) { bg = 'var(--accent)'; txt = '#fff'; }
                    return (
                      <button key={opt} type="button" onClick={() => handleAnswer(q.id, opt)}
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
                    const isCorrectAnswer = submitted && normalizeChoice(opt) === normalizeChoice(q.answer);
                    let bg = 'var(--bg-hover)';
                    let txt = 'var(--text-secondary)';
                    if (submitted && isCorrectAnswer) { bg = '#22c55e'; txt = '#fff'; }
                    else if (submitted && isUserChoice && !isCorrectAnswer) { bg = '#ef4444'; txt = '#fff'; }
                    else if (isUserChoice) { bg = 'var(--accent)'; txt = '#fff'; }
                    return (
                      <button key={opt} type="button" onClick={() => handleAnswer(q.id, opt)}
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
          type="button"
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

          {scorePercent < 60 && (
            <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#ef4444' }}>Needs Work</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                You scored {Math.round(scorePercent)}%. Replay the audio, review the transcript, then retry the missed questions.
              </p>
              <div className="space-y-2">
                {wrongAnswers.map(q => (
                  <div key={q.id} className="text-xs rounded-lg p-3" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    <div><span style={{ color: '#ef4444' }}>{q.userAnswer}</span> {' -> '} <span style={{ color: '#22c55e' }}>{q.correctAnswer}</span></div>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{q.explanation}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {ex.lessonId && <Link to={`/level/${levelId}/lessons/${ex.lessonId}`} className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent)', textDecoration: 'none' }}>Review lesson</Link>}
                <button type="button" onClick={resetExercise} className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Try again</button>
              </div>
            </div>
          )}

          {/* Transcript toggle */}
          <button
            type="button"
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
