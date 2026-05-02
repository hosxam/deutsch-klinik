import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, updateState } from '../utils/store';
import writingData from '../data/writing.json';
import LevelLock from '../components/LevelLock';
import { Copy, ClipboardCheck } from 'lucide-react';

export default function WritingPage() {
  const { levelId } = useParams();
  const prompts = writingData[levelId] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pastWritings, setPastWritings] = useState([]);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);

  const prompt = prompts[currentIndex];

  useEffect(() => {
    const state = getState();
    setPastWritings((state.writings || []).filter(w => w.level === levelId));
  }, [levelId]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const startTimer = () => {
    setTimer(0);
    setTimerActive(true);
  };

  const submitWriting = () => {
    setTimerActive(false);
    setSubmitted(true);
    const state = getState();
    const writings = state.writings || [];
    writings.push({
      id: Date.now(),
      level: levelId,
      promptId: prompt.id,
      title: prompt.title,
      prompt: prompt.prompt,
      text,
      time: timer,
      date: new Date().toISOString(),
    });
    updateState({ writings });
  };

  if (prompts.length === 0) {
    return (
      <LevelLock levelId={levelId}>
      <div className="text-center py-12">
        <p style={{ color: 'var(--text-muted)' }}>No writing prompts for {levelId}</p>
        <Link to={`/level/${levelId}`} className="text-sm mt-4 inline-block" style={{ color: 'var(--accent)' }}>Back</Link>
      </div>
      </LevelLock>
    );
  }

  if (submitted) {
    return (
      <LevelLock levelId={levelId}>
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Submitted!</h2>
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Time: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Words: {text.split(/\s+/).filter(Boolean).length} / Target: ~{prompt.wordLimit}</p>

        <div className="rounded-xl p-4 mb-4 text-left" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{text}</p>
        </div>

        <div className="rounded-xl p-4 mb-4 text-left" style={{ backgroundColor: 'rgba(139,92,246,0.08)', border: '1px solid #8b5cf6' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#8b5cf6' }}>Self-Assessment Checklist</p>
          {['Followed the instructions', 'Used vocabulary from this level', 'Correct word order', 'Correct articles/cases', 'Meeting the word count'].map(item => (
            <label key={item} className="flex items-center gap-2 text-sm py-1" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" className="rounded" /> {item}
            </label>
          ))}
        </div>

        {/* AI Correction section */}
        <div className="mt-4">
          <button onClick={() => setShowAiPrompt(!showAiPrompt)} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid #8b5cf6' }}>
            {showAiPrompt ? 'Hide' : 'Copy prompt for AI correction'}
          </button>
          {showAiPrompt && (
            <div className="mt-2 rounded-xl p-3" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid #8b5cf6' }}>
              <textarea readOnly value={`Correct my German answer. Identify grammar mistakes, vocabulary mistakes, sentence structure problems, and give me a corrected version. My level is ${levelId}. The task was: ${prompt.prompt}. My answer is: ${text}.`} rows={5}
                className="w-full p-2 rounded-lg text-xs outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              <button onClick={() => { navigator.clipboard.writeText(`Correct my German answer. Identify grammar mistakes, vocabulary mistakes, sentence structure problems, and give me a corrected version. My level is ${levelId}. The task was: ${prompt.prompt}. My answer is: ${text}.`); setAiCopied(true); setTimeout(() => setAiCopied(false), 2000); }}
                className="mt-1 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
                {aiCopied ? <><ClipboardCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy to clipboard</>}
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setText(''); setSubmitted(false); setTimer(0); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>
            Try Again
          </button>
          <Link to={`/level/${levelId}`} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            Back to Level
          </Link>
        </div>
      </div>
      </LevelLock>
    );
  }

  return (
    <LevelLock levelId={levelId}>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/level/${levelId}`} className="text-sm" style={{ color: 'var(--accent)' }}>&larr; Back</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: timerActive ? 'rgba(0,240,255,0.1)' : 'var(--bg-hover)', color: 'var(--text-muted)' }}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
          {!timerActive && <button onClick={startTimer} className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Start</button>}
        </div>
      </div>

      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Prompt {currentIndex + 1}/{prompts.length}</div>
        <h2 className="font-bold mb-2" style={{ color: 'var(--accent)' }}>{prompt.title}</h2>
        <p className="text-sm mb-2 break-words">{prompt.prompt}</p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{prompt.instructions}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>Target: ~{prompt.wordLimit} words</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}>{text.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your response here..."
        className="w-full h-64 p-4 rounded-xl text-sm outline-none resize-none"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />

      <div className="flex gap-3 mt-4">
        <button onClick={submitWriting} disabled={text.trim().length < 10}
          className="flex-1 py-3 rounded-lg font-semibold disabled:opacity-40" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Submit
        </button>
        <select onChange={(e) => setCurrentIndex(Number(e.target.value))} value={currentIndex}
          className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          {prompts.map((p, i) => (
            <option key={p.id} value={i}>{p.title}</option>
          ))}
        </select>
      </div>

      {pastWritings.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent)' }}>Previous Writings ({pastWritings.length})</h3>
          <div className="space-y-2">
            {pastWritings.slice(-5).reverse().map(w => (
              <div key={w.id} className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="font-medium">{w.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {w.date?.split('T')[0]} | {w.text?.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </LevelLock>
  );
}
