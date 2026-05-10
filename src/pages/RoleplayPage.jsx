/**
 * RoleplayPage — Conversation Simulator
 *
 * Flow:
 *   1. Browse scenarios (filter by level, type, specialty).
 *   2. Click to start -> see role, goal, checklist, useful phrases.
 *   3. Respond: type OR speak (if AI Worker configured).
 *   4. Feedback: task completion, vocabulary, grammar, missing points.
 *   5. If AI unavailable: manual self-assessment with checkboxes.
 *   6. Save progress: recordPracticeAttempt('roleplay', id, { score, maxScore }).
 *   7. Mistakes from feedback -> recordAnswer() if score < 8/10.
 */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { PageShell, Card } from '../components/ui';
import { getState, completeSpeaking, recordAnswer } from '../utils/store';
import { recordPracticeAttempt } from '../utils/practiceProgress';
import { isCorrectionEnabled, correctWriting } from '../utils/aiCorrection';
import { Send, RefreshCw, CheckCircle, Lightbulb, MessageSquare, ChevronDown, ChevronUp, Play, BookOpen } from 'lucide-react';
import roleplayData from '../data/roleplayScenarios.json';

const SCENARIO_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'everyday', label: 'Everyday' },
  { value: 'FSP-patient', label: 'FSP Doctor-Patient' },
  { value: 'FSP-handover', label: 'FSP Doctor-Doctor' },
  { value: 'FSP-explanation', label: 'FSP Patient Education' },
];

const TYPE_STYLES = {
  everyday: { bg: '#f59e0b44', accent: '#f59e0b', icon: '\u{1F4AC}' },
  'FSP-patient': { bg: '#3b82f644', accent: '#3b82f6', icon: '\u{1FA7A}' },
  'FSP-handover': { bg: '#8b5cf644', accent: '#8b5cf6', icon: '\u{1F4CB}' },
  'FSP-explanation': { bg: '#10b98144', accent: '#10b981', icon: '\u{1F4DD}' },
};

const FALLBACK_STYLE = { bg: '#6b728044', accent: '#6b7280', icon: '\u{1F5E3}' };

function getUnique(items, field) {
  const set = new Set();
  items.forEach(i => { const v = i[field]; if (v) set.add(v); });
  return Array.from(set).sort();
}

/**
 * Local evaluation without AI. Checks the user's response against
 * expected points (keyword matching) and vocabulary targets.
 */
function evaluateLocally(userResponse, scenario) {
  const resp = userResponse.toLowerCase();
  const points = scenario.expectedPoints || [];
  const keyVocab = scenario.vocabularyTargets || [];
  const pointResults = points.map(p => {
    const words = p.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matches = words.filter(w => resp.includes(w)).length;
    return { point: p, matched: words.length === 0 || matches >= Math.min(2, words.length) };
  });
  const matchedPoints = pointResults.filter(r => r.matched).length;
  const vocabUsed = keyVocab.filter(v => resp.includes(v.toLowerCase())).length;
  const vocabRate = keyVocab.length > 0 ? vocabUsed / keyVocab.length : 0.5;
  const sentences = (userResponse.match(/[.!?]/g) || []).length;
  const words = userResponse.split(/\s+/).filter(Boolean).length;
  const taskScore = points.length > 0 ? matchedPoints / points.length : 0;
  const lenScore = Math.min(1, words / 50);
  const structScore = Math.min(1, sentences / Math.max(3, points.length));
  const raw = Math.round(((taskScore * 0.5) + (vocabRate * 0.2) + (structScore * 0.15) + (lenScore * 0.15)) * 10);
  return {
    score: Math.min(10, Math.max(1, raw)),
    matchedPoints,
    maxPoints: points.length,
    missing: pointResults.filter(r => !r.matched).map(r => r.point),
    pointResults,
    vocabRate,
  };
}

export default function RoleplayPage() {
  const [scenarios, setScenarios] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [activeScenario, setActiveScenario] = useState(null);
  const [phase, setPhase] = useState('browse');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(isCorrectionEnabled());
  const [manualChecks, setManualChecks] = useState({});
  const [manualScore, setManualScore] = useState(5);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState({});
  const inputRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    try { setScenarios(Array.isArray(roleplayData) ? roleplayData : []); }
    catch { setScenarios([]); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const st = getState();
      const done = st.speakingCompleted?.roleplay || [];
      setCompletedIds(new Set(done));
    } catch {}
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      const raw = JSON.parse(localStorage.getItem('practiceProgress_v1') || '{}');
      setAttempts(raw.roleplay || {});
    } catch {}
  }, [ready]);

  const specialties = useMemo(() => getUnique(scenarios, 'specialty'), [scenarios]);
  const levels = useMemo(() => {
    const s = new Set(scenarios.map(r => r.level));
    return Array.from(s).sort();
  }, [scenarios]);

  const filtered = useMemo(() => scenarios.filter(s => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterLevel !== 'all' && s.level !== filterLevel) return false;
    if (filterSpecialty !== 'all' && (s.specialty || '') !== filterSpecialty) return false;
    return true;
  }), [scenarios, filterType, filterLevel, filterSpecialty]);

  const goHome = useCallback(() => {
    setActiveScenario(null); setPhase('browse'); setUserInput('');
    setFeedback(null); setManualChecks({}); setManualScore(5);
    setShowTranscript(false); setShowSuccess(false);
  }, []);

  const initManual = useCallback((sc) => {
    const c = {}; (sc.checklist || []).forEach((_, i) => { c[i] = false; });
    setManualChecks(c);
  }, []);

  const startScenario = useCallback((sc) => {
    setActiveScenario(sc);
    setPhase('prep');
    setUserInput('');
    setFeedback(null);
    setManualScore(5);
    setShowTranscript(false);
    setShowSuccess(false);
    setAiAvailable(isCorrectionEnabled());
    setShowPoints(false);
    initManual(sc);
  }, [initManual]);

  const submitResponse = useCallback(async () => {
    if (!userInput.trim() || !activeScenario) return;
    setLoading(true);
    try {
      if (aiAvailable) {
        const task = [
          'Roleplay: ' + activeScenario.title,
          'Scenario: ' + activeScenario.scenario,
          'Your role: ' + activeScenario.userRole,
          'Partner role: ' + activeScenario.partnerRole,
          'Goal: ' + activeScenario.goal,
        ].join('\n');
        const res = await correctWriting({ task, userResponse: userInput.trim(), level: activeScenario.level });
        setFeedback({
          mode: 'ai', score: res.score,
          mistakes: res.mistakes || [],
          feedback: res.feedback || '',
          suggestions: res.suggestions || res.improvedVersion || '',
          corrected: res.correctedVersion || '',
          stronger: res.strongerAnswer || '',
        });
      } else {
        setFeedback(evaluateLocally(userInput.trim(), activeScenario));
      }
    } catch {
      setFeedback(evaluateLocally(userInput.trim(), activeScenario));
    }
    setLoading(false);
  }, [userInput, activeScenario, aiAvailable]);

  const submitManual = useCallback(() => {
    if (!activeScenario) return;
    const checked = Object.values(manualChecks).filter(Boolean).length;
    const total = (activeScenario.checklist || []).length;
    const taskPct = total > 0 ? checked / total : 0;
    const raw = Math.round(((taskPct * 0.6) + (manualScore / 10 * 0.4)) * 10);
    const score = Math.min(10, Math.max(1, raw));
    const missing = (activeScenario.checklist || []).filter((_, i) => !manualChecks[i]);
    setFeedback({ mode: 'manual', score, matchedPoints: checked, maxPoints: total, missing, manual: true });
  }, [activeScenario, manualChecks, manualScore]);

  const saveAttempt = useCallback((score) => {
    if (!activeScenario) return;
    const id = activeScenario.id;
    const good = score >= 8;
    try { completeSpeaking('roleplay', id); } catch {}
    try {
      const d = new Date(); d.setDate(d.getDate() + (good ? 14 : 1));
      recordPracticeAttempt('roleplay', id, { score, maxScore: 10, correct: good, dueDate: d.toISOString() });
    } catch {}
    if (!good && feedback && feedback.missing && feedback.missing.length > 0) {
      try {
        recordAnswer(activeScenario.level, id, userInput,
          feedback.suggestions || feedback.stronger || activeScenario.sampleConversation || '',
          activeScenario.type === 'everyday' ? 'everyday conversation' : 'medical roleplay',
          false, 'roleplay');
      } catch {}
    }
    setCompletedIds(prev => new Set([...prev, id]));
    setShowSuccess(true);
  }, [activeScenario, userInput, feedback]);

  // ── BROWSE PHASE ──
  if (phase === 'browse') {
    return (
      <PageShell>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            <MessageSquare className="inline mr-2" size={28} />
            Conversation Practice
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Practice real conversations for everyday life and medical settings.
            {!aiAvailable && <span className="ml-2 text-amber-400">(Self-assessment mode)</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)' }}>
            {SCENARIO_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)' }}>
            <option value="all">All Levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {specialties.length > 0 && (
            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)' }}>
              <option value="all">All Topics</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <span className="text-xs self-center" style={{ color:'var(--text-muted)' }}>
            {filtered.length} scenario{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(s => {
            const att = attempts[s.id];
            const done = completedIds.has(s.id);
            const ts = TYPE_STYLES[s.type] || FALLBACK_STYLE;
            return (
              <button key={s.id} onClick={() => startScenario(s)}
                className="text-left rounded-xl p-4 transition-all hover:scale-[1.01] hover:shadow-lg"
                style={{ backgroundColor:'var(--bg-card)', border:'1px solid ' + ts.accent + '33',
                  borderLeft:'4px solid ' + ts.accent, opacity: done ? 0.7 : 1 }}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-lg">{ts.icon}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:ts.bg, color:ts.accent }}>
                      {s.level}
                    </span>
                    {done && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:'#22c55e33', color:'#22c55e' }}>Done</span>}
                    {att && att.score !== undefined && !done && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: att.score >= 8 ? '#22c55e33' : '#ef444433', color: att.score >= 8 ? '#22c55e' : '#ef4444' }}>
                        {att.score}/10
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>
                  {s.scenario ? s.scenario.substring(0, 120) : ''}
                  {s.scenario && s.scenario.length > 120 ? '...' : ''}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor:'var(--bg-secondary)', color:'var(--text-muted)' }}>
                    {s.userRole}
                  </span>
                  {s.partnerRole && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor:'var(--bg-secondary)', color:'var(--text-muted)' }}>
                      {'->'} {s.partnerRole}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color:'var(--text-muted)' }}>
            No scenarios match the selected filters.
          </div>
        )}
      </PageShell>
    );
  }

  // ── PREP PHASE ──
  if (phase === 'prep') {
    const s = activeScenario;
    if (!s) return null;
    return (
      <PageShell>
        <div className="mb-4">
          <button onClick={goHome} className="text-sm mb-3" style={{ color:'var(--accent)' }}>
            {'<-'} Back to scenarios
          </button>
          <h1 className="text-xl font-bold" style={{ color:'var(--accent)' }}>{s.title}</h1>
        </div>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color:'var(--accent)' }}>Scenario</h3>
              <p className="text-sm" style={{ color:'var(--text-primary)' }}>{s.scenario}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-xs" style={{ color:'var(--text-muted)' }}>Your role: </span>
                <span className="ml-1 text-sm font-bold" style={{ color:'var(--text-primary)' }}>{s.userRole}</span>
              </div>
              {s.partnerRole && (
                <div>
                  <span className="text-xs" style={{ color:'var(--text-muted)' }}>Partner: </span>
                  <span className="ml-1 text-sm" style={{ color:'var(--text-primary)' }}>{s.partnerRole}</span>
                </div>
              )}
              <div>
                <span className="text-xs" style={{ color:'var(--text-muted)' }}>Level: </span>
                <span className="ml-1 text-sm" style={{ color:'var(--text-primary)' }}>{s.level}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color:'var(--accent)' }}>
                <CheckCircle size={14} className="inline mr-1" />Goal
              </h3>
              <p className="text-sm" style={{ color:'var(--text-primary)' }}>{s.goal}</p>
            </div>
            {s.usefulPhrases && s.usefulPhrases.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color:'var(--accent)' }}>
                  <Lightbulb size={14} className="inline mr-1" />Useful Phrases
                </h3>
                <div className="flex flex-wrap gap-1">
                  {s.usefulPhrases.map((p, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor:'var(--bg-secondary)', color:'var(--accent)', border:'1px dashed var(--accent)' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {s.vocabularyTargets && s.vocabularyTargets.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color:'var(--text-muted)' }}>
                  <BookOpen size={14} className="inline mr-1" />Vocabulary Targets
                </h3>
                <div className="flex flex-wrap gap-1">
                  {s.vocabularyTargets.map((v, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor:'#22c55e22', color:'#22c55e' }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
        <div className="mt-6 flex gap-3">
          <button onClick={() => { setPhase('respond'); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="px-6 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
            Start Practice
          </button>
          <button onClick={goHome} className="px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor:'var(--bg-card)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>
            Cancel
          </button>
        </div>
      </PageShell>
    );
  }

  // ── RESPOND PHASE ──
  const s = activeScenario;
  if (!s) return null;

  const isManual = feedback && feedback.mode === 'manual' && !feedback.manual;
  const isAi = feedback && feedback.mode === 'ai';
  const isManualDone = feedback && feedback.mode === 'manual' && feedback.manual;

  return (
    <PageShell>
      <div className="mb-4">
        <button onClick={goHome} className="text-sm" style={{ color:'var(--text-muted)' }}>{'<-'} Back</button>
        <h2 className="text-lg font-bold mt-1" style={{ color:'var(--accent)' }}>{s.title}</h2>
        <p className="text-xs" style={{ color:'var(--text-muted)' }}>
          Your role: {s.userRole} | Level: {s.level}
        </p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold" style={{ color:'var(--accent)' }}>Expected Points</h3>
          <button onClick={() => setShowPoints(!showPoints)} className="text-xs" style={{ color:'var(--text-muted)' }}>
            {showPoints ? 'Hide' : 'Show'} {showPoints ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />}
          </button>
        </div>
        {showPoints && (s.expectedPoints || []).length > 0 && (
          <ul className="text-xs space-y-0.5" style={{ color:'var(--text-muted)' }}>
            {s.expectedPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-1"><span>{'\u2022'}</span><span>{p}</span></li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-3">
        <textarea ref={inputRef} value={userInput} onChange={e => setUserInput(e.target.value)}
          placeholder="Type your response in German..."
          className="w-full p-4 rounded-xl min-h-[120px] text-sm resize-y"
          style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)' }} />
        <div className="flex gap-2 mt-2">
          <button onClick={submitResponse} disabled={!userInput.trim() || loading}
            className="flex items-center gap-1 px-5 py-2 rounded-lg font-medium text-sm disabled:opacity-40"
            style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'Evaluating...' : 'Submit'}
          </button>
          <span className="text-xs self-center" style={{ color:'var(--text-muted)' }}>
            {aiAvailable ? 'AI feedback available' : 'Self-assessment mode'}
          </span>
        </div>
      </div>

      {s.sampleConversation && (
        <div className="mt-3">
          <button onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1 text-xs" style={{ color:'var(--text-muted)' }}>
            <Play size={12} /> {showTranscript ? 'Hide' : 'Show'} sample conversation
          </button>
          {showTranscript && (
            <pre className="mt-1 text-xs p-3 rounded-lg whitespace-pre-wrap"
              style={{ backgroundColor:'var(--bg-secondary)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>
              {s.sampleConversation}
            </pre>
          )}
        </div>
      )}

      {/* AI FEEDBACK */}
      {isAi && feedback && (
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
          <h3 className="font-bold text-sm mb-2" style={{ color:'var(--accent)' }}>AI Feedback</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={'text-2xl font-bold ' + (feedback.score >= 8 ? 'text-green-400' : feedback.score >= 5 ? 'text-amber-400' : 'text-red-400')}>
              {feedback.score}/10
            </span>
            <span className="text-xs" style={{ color:'var(--text-muted)' }}>
              {feedback.score >= 8 ? 'Great job!' : feedback.score >= 5 ? 'Good, room for improvement' : 'Needs more work'}
            </span>
          </div>
          {feedback.feedback && <p className="text-sm" style={{ color:'var(--text-primary)' }}>{feedback.feedback}</p>}
          {feedback.suggestions && (
            <div className="mt-2">
              <span className="text-xs font-bold" style={{ color:'var(--accent)' }}>Suggested Answer:</span>
              <p className="text-xs mt-0.5 p-2 rounded" style={{ backgroundColor:'var(--bg-card)', color:'var(--text-primary)' }}>
                {feedback.suggestions}
              </p>
            </div>
          )}
          {feedback.stronger && (
            <div className="mt-2">
              <span className="text-xs font-bold" style={{ color:'var(--accent)' }}>Stronger Version:</span>
              <p className="text-xs mt-0.5 p-2 rounded" style={{ backgroundColor:'var(--bg-card)', color:'var(--text-primary)' }}>
                {feedback.stronger}
              </p>
            </div>
          )}
          {feedback.mistakes && feedback.mistakes.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-bold" style={{ color:'#ef4444' }}>Areas to Improve:</span>
              <ul className="mt-1 space-y-0.5">
                {feedback.mistakes.map((m, i) => (
                  <li key={i} className="text-xs flex items-start gap-1" style={{ color:'var(--text-muted)' }}>
                    <span>{'\u2022'}</span>
                    <span>{typeof m === 'string' ? m : m.message || 'See feedback above'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!showSuccess && feedback.score !== undefined && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => saveAttempt(feedback.score)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
                Save & Complete
              </button>
            </div>
          )}
        </div>
      )}

      {/* MANUAL SELF-ASSESSMENT */}
      {isManual && feedback && (
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
          <h3 className="font-bold text-sm mb-2" style={{ color:'var(--accent)' }}>Self-Assessment</h3>
          <div>
            <h4 className="text-xs font-bold mb-1" style={{ color:'var(--accent)' }}>Checklist</h4>
            {(s.checklist || []).map((item, i) => (
              <label key={i} className="flex items-center gap-2 py-0.5 text-xs cursor-pointer" style={{ color:'var(--text-primary)' }}>
                <input type="checkbox" checked={manualChecks[i] || false}
                  onChange={() => setManualChecks(p => ({...p, [i]: !p[i]}))} />
                {item}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold mb-1" style={{ color:'var(--accent)' }}>
              Self-score: {manualScore}/10
            </h4>
            <input type="range" min={0} max={10} step={1} value={manualScore}
              onChange={e => setManualScore(parseInt(e.target.value))}
              className="w-full max-w-xs" />
          </div>
          <button onClick={submitManual} className="px-4 py-2 rounded-lg text-sm font-medium mt-2"
            style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
            Score My Response
          </button>
        </div>
      )}

      {/* MANUAL DONE */}
      {isManualDone && feedback && (
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor:'var(--bg-secondary)', border:'1px solid var(--border)' }}>
          <h3 className="font-bold text-sm mb-2" style={{ color:'var(--accent)' }}>Self-Assessment</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={'text-2xl font-bold ' + (feedback.score >= 8 ? 'text-green-400' : feedback.score >= 5 ? 'text-amber-400' : 'text-red-400')}>
              {feedback.score}/10
            </span>
          </div>
          <p className="text-sm" style={{ color:'var(--text-primary)' }}>
            You covered {feedback.matchedPoints} of {feedback.maxPoints} expected points.
          </p>
          {feedback.missing && feedback.missing.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-bold" style={{ color:'#ef4444' }}>Missing:</span>
              <ul className="mt-1 space-y-0.5">
                {feedback.missing.map((m, i) => (
                  <li key={i} className="text-xs flex items-start gap-1" style={{ color:'var(--text-muted)' }}>
                    <span>{'\u2022'}</span><span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.sampleConversation && (
            <div className="mt-2">
              <span className="text-xs font-bold" style={{ color:'var(--accent)' }}>Reference conversation:</span>
              <pre className="mt-0.5 text-xs p-2 rounded whitespace-pre-wrap"
                style={{ backgroundColor:'var(--bg-card)', color:'var(--text-primary)' }}>
                {s.sampleConversation}
              </pre>
            </div>
          )}
          {!showSuccess && (
            <button onClick={() => saveAttempt(feedback.score)}
              className="px-4 py-2 rounded-lg text-sm font-medium mt-3"
              style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
              Save & Complete
            </button>
          )}
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor:'rgba(0,0,0,0.6)' }}>
          <div className="p-8 rounded-xl max-w-sm text-center" style={{ backgroundColor:'var(--bg-card)', border:'1px solid var(--border)' }}>
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color:'#22c55e' }} />
            <h2 className="text-lg font-bold mb-2" style={{ color:'var(--text-primary)' }}>Practice Saved!</h2>
            {feedback && <p className="text-sm mb-4" style={{ color:'var(--text-muted)' }}>Score: {feedback.score}/10</p>}
            <div className="flex gap-2 justify-center">
              <button onClick={goHome} className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor:'var(--accent)', color:'#fff' }}>
                Back to Scenarios
              </button>
              <button onClick={() => startScenario(s)} className="px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor:'var(--bg-card)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
