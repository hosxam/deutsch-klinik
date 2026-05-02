import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getState, updateState } from '../utils/store';
import speakingData from '../data/speaking.json';
import { Mic, Square, Clock, Lightbulb, Copy, ClipboardCheck } from 'lucide-react';
import LevelLock from '../components/LevelLock';

export default function SpeakingPage() {
  const { levelId } = useParams();
  const prompts = speakingData[levelId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('ready'); // ready | prep | talk | done
  const [prepTime, setPrepTime] = useState(0);
  const [talkTime, setTalkTime] = useState(0);
  const [prepTimer, setPrepTimer] = useState(null);
  const [talkTimer, setTalkTimer] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const prompt = prompts[currentIndex];

  useEffect(() => {
    const s = getState();
    setRecordings(s.speakingRecordings[levelId] || []);
  }, [levelId]);

  useEffect(() => {
    return () => {
      if (prepTimer) clearInterval(prepTimer);
      if (talkTimer) clearInterval(talkTimer);
    };
  }, [prepTimer, talkTimer]);

  const startPrep = () => {
    setPhase('prep');
    setPrepTime(prompt.prepTime);
    const interval = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setPrepTimer(null);
          startTalk();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setPrepTimer(interval);
  };

  const startTalk = () => {
    setPhase('talk');
    setTalkTime(prompt.talkTime);
    const interval = setInterval(() => {
      setTalkTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTalkTimer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTalkTimer(interval);
  };

  const done = () => {
    if (prepTimer) clearInterval(prepTimer);
    if (talkTimer) clearInterval(talkTimer);
    // Save recording attempt
    const s = getState();
    const recs = s.speakingRecordings[levelId] || [];
    recs.push({ id: prompt.id, date: new Date().toISOString() });
    if (!s.speakingRecordings) s.speakingRecordings = {};
    s.speakingRecordings[levelId] = recs;
    updateState({ speakingRecordings: s.speakingRecordings });
    setRecordings(recs);
    setPhase('done');
  };

  if (prompts.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No speaking tasks for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <select onChange={(e) => { setCurrentIndex(Number(e.target.value)); setPhase('ready'); }} value={currentIndex}
          className="px-3 py-1.5 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          {prompts.map((p, i) => (
            <option key={p.id} value={i}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Level {levelId} | Prep: {prompt.prepTime}s | Talk: {prompt.talkTime}s</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--accent)' }}>{prompt.title}</h2>
        <p className="text-sm mb-4 break-words">{prompt.prompt}</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>{prompt.instructions}</p>

        {/* Tips */}
        <details className="mb-4">
          <summary className="text-sm cursor-pointer flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            <Lightbulb size={14} /> Tips & Useful Phrases
          </summary>
          <div className="mt-2 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>{prompt.tips}</p>
            {prompt.usefulPhrases?.map((p, i) => (
              <div key={i} className="py-1" style={{ color: 'var(--accent)' }}>{p}</div>
            ))}
          </div>
        </details>

        {/* Timer display */}
        {(phase === 'prep' || phase === 'talk') && (
          <div className="text-center mb-6">
            <div className="text-3xl font-bold" style={{ color: phase === 'prep' ? '#f59e0b' : '#ff3355' }}>
              {phase === 'prep' ? prepTime : talkTime}s
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {phase === 'prep' ? 'Preparation Time' : 'Speaking Time'}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {phase === 'ready' && (
            <button onClick={startPrep} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              <Clock size={16} /> Start Preparation
            </button>
          )}
          {(phase === 'prep' || phase === 'talk') && (
            <button onClick={done} className="flex items-center gap-2 px-6 py-3 rounded-lg" style={{ backgroundColor: '#ff3355', color: '#fff' }}>
              <Square size={16} /> Stop & Complete
            </button>
          )}
        </div>
      </div>

      {/* Recording attempts */}
      {recordings.length > 0 && (
        <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>Completed Tasks ({recordings.length})</h3>
          <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {recordings.slice().reverse().map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mic size={12} style={{ color: '#3bff9e' }} />
                Completed: {r.date?.split('T')[0] || 'Unknown'}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="mt-4 text-center">
          <div className="mb-3">
            <button onClick={() => setShowAiPrompt(!showAiPrompt)} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid #8b5cf6' }}>
              {showAiPrompt ? 'Hide' : 'Copy prompt for AI correction'}
            </button>
            {showAiPrompt && (
              <div className="mt-2 rounded-xl p-3 text-left" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid #8b5cf6' }}>
                <textarea readOnly value={`I practiced this German speaking task. Identify grammar mistakes, vocabulary mistakes, and sentence structure problems based on the topic. My level is ${levelId}. The task was: ${prompt.prompt}. My spoken answer would be about: ${prompt.tips || ''}. Please give me a corrected sample response at A2 level.`} rows={5}
                  className="w-full p-2 rounded-lg text-xs outline-none resize-none"
                  style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={() => { navigator.clipboard.writeText(`I practiced this German speaking task. Identify grammar mistakes, vocabulary mistakes, and sentence structure problems based on the topic. My level is ${levelId}. The task was: ${prompt.prompt}. My spoken answer would be about: ${prompt.tips || ''}. Please give me a corrected sample response at A2 level.`); setAiCopied(true); setTimeout(() => setAiCopied(false), 2000); }}
                  className="mt-1 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
                  {aiCopied ? <><ClipboardCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy to clipboard</>}
                </button>
              </div>
            )}
          </div>
          <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            Back to Level
          </Link>
        </div>
      )}
    </div>
    </LevelLock>
  );
}
