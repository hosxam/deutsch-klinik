import os

d = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(d, '..', 'src', 'pages', 'DailyMissionPage.jsx')

with open(FILE, encoding='utf-8') as f:
    c = f.read()

# =============================================================
# 1. Add imports for aiCorrection functions and new icons
# =============================================================

old_imports = """import {
  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,
  SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight
} from 'lucide-react';"""

new_imports = """import {
  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,
  SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight,
  Sparkles, Copy, ClipboardCheck, ShieldCheck, AlertCircle, RefreshCw,
  Volume2, MessageSquare, Quote
} from 'lucide-react';
import { correctWriting, correctSpeaking, isCorrectionEnabled } from '../utils/aiCorrection';"""

c = c.replace(old_imports, new_imports, 1)
if new_imports in c and old_imports not in c:
    print("OK: Imports updated")
else:
    print("FAIL: Imports not found or replaced")
    # Check what's actually there
    if 'lucide-react' in c:
        idx = c.find("lucide-react'")
        print(f"  Found lucide-react import ending at {idx}")
        start = c.rfind('import', 0, idx)
        print(f"  Import block: {c[start:idx+20]}")

# =============================================================
# 2. Add AI state variables after existing writing/speaking state
# =============================================================

old_state = """  // Writing/speaking state
  const [wtCopied, setWtCopied] = useState(false);
  const [spCopied, setSpCopied] = useState(false);"""

new_state = """  // Writing/speaking state
  const [wtCopied, setWtCopied] = useState(false);
  const [spCopied, setSpCopied] = useState(false);
  // AI correction state for writing
  const [wtAiResult, setWtAiResult] = useState(null);
  const [wtAiLoading, setWtAiLoading] = useState(false);
  const [wtAiError, setWtAiError] = useState(null);
  // AI correction state for speaking
  const [spAiResult, setSpAiResult] = useState(null);
  const [spAiLoading, setSpAiLoading] = useState(false);
  const [spAiError, setSpAiError] = useState(null);
  const [spAiEnabled, setSpAiEnabled] = useState(() => isCorrectionEnabled());"""

# Check if the old_state text matches what's in the file
if old_state in c:
    c = c.replace(old_state, new_state, 1)
    print("OK: AI state variables added")
else:
    print("FAIL: Old state not found - checking for variations")
    if 'wtCopied' in c and 'spCopied' in c:
        # Find the line and replace
        idx = c.find('const [spCopied, setSpCopied] = useState(false);')
        end = c.find('\n', idx)
        rest_of_file = c[end:]
        c = c[:end+1] + new_state.split('\n', 1)[1] + '\n' + rest_of_file
        print("OK: AI state added after spCopied")
    else:
        print("TOTALLY FAILED to find state insertion point")

# =============================================================
# 3. Replace hWt handler - add AI correction action
# =============================================================

old_hwt = """  const hWt = () => {
    const cs = getState();
    const items = writingData[lvl] || [];
    const ni = (cs.writings || []).filter((w) => w.level === lvl).length;
    const item = items[ni];
    if (item) {
      const ws2 = [...(cs.writings || []), { level: lvl, id: item.id, title: item.title, text: wtText, date: new Date().toISOString() }];
      updateState({ writings: ws2 });
      setLS({ ...cs, writings: ws2 });
    }
    setWritingPrompt(item || null);
    setWtDone(true);
  };"""

new_hwt = """  const hWt = async () => {
    const cs = getState();
    const items = writingData[lvl] || [];
    const ni = (cs.writings || []).filter((w) => w.level === lvl).length;
    const item = items[ni];
    if (item) {
      const ws2 = [...(cs.writings || []), { level: lvl, id: item.id, title: item.title, text: wtText, date: new Date().toISOString() }];
      updateState({ writings: ws2 });
      setLS({ ...cs, writings: ws2 });
    }
    setWritingPrompt(item || null);
    // Try AI correction
    if (isCorrectionEnabled() && wtText.trim()) {
      setWtAiLoading(true);
      setWtAiError(null);
      try {
        const result = await correctWriting({
          level: lvl,
          task: (item?.prompt || '') + (item?.instructions ? ' -- ' + item.instructions : ''),
          userAnswer: wtText
        });
        setWtAiResult(result);
      } catch (e) {
        setWtAiError(e.message || 'AI correction unavailable');
        setWtAiResult(null);
      }
      setWtAiLoading(false);
    }
    setWtDone(true);
  };"""

if old_hwt in c:
    c = c.replace(old_hwt, new_hwt, 1)
    print("OK: hWt updated with AI correction")
else:
    print("FAIL: old hWt not found")
    # Debug: show what we can find
    idx = c.find('const hWt =')
    if idx >= 0:
        print(f"  Found hWt at {idx}")
        print(f"  Text: {c[idx:idx+400]}")

# =============================================================
# 4. Replace hSp handler - add AI feedback action
# =============================================================

old_hsp = """  const hSp = () => {
    const cs = getState();
    const items = speakingData[lvl] || [];
    const ni = (cs.speakingRecordings?.[lvl]?.length || 0);
    const item = items[ni];
    if (item) {
      const recs = [...(cs.speakingRecordings?.[lvl] || []), { id: item.id, title: item.title, script: spText, recordingUrl: spRecBlob, date: new Date().toISOString() }];
      updateState({ speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
      setLS({ ...cs, speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
    }
    setSpeakingPrompt(item || null);
    setSpDone(true);
  };"""

new_hsp = """  const hSp = async () => {
    const cs = getState();
    const items = speakingData[lvl] || [];
    const ni = (cs.speakingRecordings?.[lvl]?.length || 0);
    const item = items[ni];
    if (item) {
      const recs = [...(cs.speakingRecordings?.[lvl] || []), { id: item.id, title: item.title, script: spText, recordingUrl: spRecBlob, date: new Date().toISOString() }];
      updateState({ speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
      setLS({ ...cs, speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
    }
    setSpeakingPrompt(item || null);
    // Try AI speaking feedback
    if (isCorrectionEnabled() && spText.trim()) {
      setSpAiLoading(true);
      setSpAiError(null);
      try {
        const result = await correctSpeaking({
          level: lvl,
          task: item?.prompt || 'Speaking task',
          transcript: spText
        });
        setSpAiResult(result);
      } catch (e) {
        setSpAiError(e.message || 'AI feedback unavailable');
        setSpAiResult(null);
      }
      setSpAiLoading(false);
    }
    setSpDone(true);
  };"""

if old_hsp in c:
    c = c.replace(old_hsp, new_hsp, 1)
    print("OK: hSp updated with AI feedback")
else:
    print("FAIL: old hSp not found")
    idx = c.find('const hSp =')
    if idx >= 0:
        print(f"  Found hSp at {idx}")
        print(f"  Text: {c[idx:idx+400]}")

# =============================================================
# 5. Replace writing done section with AI results + fallback
# =============================================================

# Find writing done block boundaries
s = "{cm.type === 'writing' && wtDone && ("
ei = c.find(s)
if ei >= 0:
    # Find the closing of this block (next cm.type or end)
    nxt = c.find('{cm.type', ei + 5)
    if nxt < 0:
        nxt = c.find('{/* ', ei + 5)  # next comment
    if nxt < 0:
        nxt = len(c)
    
    # Find matching close - the block ends with )} before next section
    # Find the last )} that comes before nxt
    close_at = c.rfind(')}', ei, nxt)
    if close_at > 0:
        close_at += 2  # include )}

    old_block = c[ei:close_at] if close_at > 0 else c[ei:nxt]
    
    new_block = """{cm.type === 'writing' && wtDone && (() => {
        const wr = wtAiResult;
        const loading = wtAiLoading;
        const err = wtAiError;
        const items = writingData[lvl] || [];
        const ni = (getState().writings || []).filter((w) => w.level === lvl).length - 1;
        const item = ni >= 0 && ni < items.length ? items[ni] : null;
        return (
          <div style={sCard}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <PenTool size={36} style={{ color: '#ec4899', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ec4899', marginBottom: '0.25rem' }}>Writing Submitted!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your writing has been saved for review.</p>
            </div>

            {/* AI Correction Result */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1rem' }}>
                <RefreshCw size={24} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correcting your writing with AI...</p>
              </div>
            )}

            {err && !loading && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1rem', textAlign: 'center' }}>
                <AlertCircle size={16} style={{ color: '#ef4444', marginBottom: '0.25rem', display: 'inline' }} />
                <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>AI correction unavailable. You can still copy the correction prompt below.</p>
              </div>
            )}

            {wr && !loading && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                {/* Score */}
                {wr.score !== null && (
                  <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: wr.score >= 7 ? '#22c55e' : wr.score >= 4 ? '#f59e0b' : '#ef4444' }}>{wr.score}/10</div>
                  </div>
                )}

                {/* Rubric */}
                {wr.rubric && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Assessment</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {Object.entries(wr.rubric).map(([key, val]) => (
                        <span key={key} style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', background: val === 'good' || val === 'complete' ? 'rgba(34,197,94,0.1)' : val === 'basic' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: val === 'good' || val === 'complete' ? '#22c55e' : val === 'basic' ? '#f59e0b' : '#ef4444' }}>{key}: {val}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mistakes */}
                {wr.mistakes && wr.mistakes.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.4rem' }}>Mistakes ({wr.mistakes.length})</p>
                    {wr.mistakes.map((m, i) => (
                      <div key={i} style={{ padding: '0.4rem 0.6rem', marginBottom: '0.3rem', borderRadius: '6px', background: 'rgba(239,68,68,0.05)', fontSize: '0.8rem' }}>
                        {m.original && <div style={{ color: '#ef4444', marginBottom: '0.1rem' }}>"{m.original}"</div>}
                        {m.corrected && <div style={{ color: '#22c55e', marginBottom: '0.1rem' }}>"{m.corrected}"</div>}
                        {m.explanation && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{m.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Corrected Version */}
                {wr.correctedVersion && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.3rem' }}>Corrected Version</p>
                    <div style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', background: 'rgba(34,197,94,0.05)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{wr.correctedVersion}</div>
                  </div>
                )}

                {/* Improved Version */}
                {wr.improvedVersion && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '0.3rem' }}>Improved Version</p>
                    <div style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', background: 'rgba(139,92,246,0.05)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{wr.improvedVersion}</div>
                  </div>
                )}

                {/* Flashcards */}
                {wr.flashcards && wr.flashcards.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.3rem' }}>Flashcards from Mistakes ({wr.flashcards.length})</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {wr.flashcards.map((fc, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fc.front || fc.german}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{fc.back || fc.english}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Copy prompt fallback */}
            <div style={{ textAlign: 'center' }}>
              <button
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: wtCopied ? '2px solid #3bff9e' : '1px solid var(--border)', background: wtCopied ? 'rgba(59, 255, 158, 0.1)' : 'var(--bg-secondary)', color: wtCopied ? '#3bff9e' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}
                onClick={hWtCopy}
                disabled={wtCopied}
              >
                {wtCopied ? <><ClipboardCheck size={16} /> Copied to clipboard!</> : <><Copy size={16} /> Copy AI Correction Prompt</>}
              </button>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                Do not submit sensitive personal or medical information.
              </p>
              <button style={sBp} onClick={hWtN}>Next Mission <ChevronRight size={16} /></button>
            </div>
          </div>
        );
      })()}"""

    c = c.replace(old_block, new_block, 1)
    print("OK: Writing done section replaced with AI results")
else:
    print("FAIL: Writing done section not found")

# =============================================================
# 6. Replace speaking done section with AI results + fallback
# =============================================================

s = "{cm.type === 'speaking' && spDone && ("
ei = c.find(s)
if ei >= 0:
    nxt = c.find('{/* ', ei + 5)
    if nxt < 0:
        nxt = c.find('  </div>', ei + 5)
        if nxt > 0:
            nxt = c.find('  </LevelLock>', nxt)
    
    close_at = c.rfind(')}', ei, nxt if nxt > 0 else len(c))
    if close_at > 0:
        close_at += 2
    
    old_block = c[ei:close_at] if close_at > 0 else c[ei:nxt]

    new_block = """{cm.type === 'speaking' && spDone && (() => {
        const sr = spAiResult;
        const loading = spAiLoading;
        const err = spAiError;
        const items = speakingData[lvl] || [];
        const ni = (getState().speakingRecordings?.[lvl]?.length || 0) - 1;
        const item = ni >= 0 && ni < items.length ? items[ni] : null;
        return (
          <div style={sCard}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Mic size={36} style={{ color: '#f97316', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f97316', marginBottom: '0.25rem' }}>Speaking Submitted!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your speaking response has been saved for review.</p>
            </div>

            {/* AI Speaking Feedback */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1rem' }}>
                <RefreshCw size={24} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzing your speaking with AI...</p>
              </div>
            )}

            {err && !loading && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1rem', textAlign: 'center' }}>
                <AlertCircle size={16} style={{ color: '#ef4444', marginBottom: '0.25rem', display: 'inline' }} />
                <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>AI feedback unavailable. You can still copy the speaking feedback prompt below.</p>
              </div>
            )}

            {sr && !loading && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                {/* Score */}
                {sr.score !== null && (
                  <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: sr.score >= 7 ? '#22c55e' : sr.score >= 4 ? '#f59e0b' : '#ef4444' }}>{sr.score}/10</div>
                  </div>
                )}

                {/* Rubric */}
                {sr.rubric && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Assessment</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {Object.entries(sr.rubric).map(([key, val]) => (
                        <span key={key} style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', background: val === 'good' || val === 'complete' || val === 'fully completed' || val === 'mostly correct' ? 'rgba(34,197,94,0.1)' : val === 'basic' || val === 'simple' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: val === 'good' || val === 'complete' || val === 'fully completed' || val === 'mostly correct' ? '#22c55e' : val === 'basic' || val === 'simple' ? '#f59e0b' : '#ef4444' }}>{key}: {val}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mistakes */}
                {sr.mistakes && sr.mistakes.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.4rem' }}>Mistakes ({sr.mistakes.length})</p>
                    {sr.mistakes.map((m, i) => (
                      <div key={i} style={{ padding: '0.4rem 0.6rem', marginBottom: '0.3rem', borderRadius: '6px', background: 'rgba(239,68,68,0.05)', fontSize: '0.8rem' }}>
                        {m.original && <div style={{ color: '#ef4444', marginBottom: '0.1rem' }}>"{m.original}"</div>}
                        {m.corrected && <div style={{ color: '#22c55e', marginBottom: '0.1rem' }}>"{m.corrected}"</div>}
                        {m.explanation && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{m.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Better Phrases */}
                {sr.betterPhrases && sr.betterPhrases.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '0.3rem' }}>Better Phrases</p>
                    {sr.betterPhrases.map((bp, i) => (
                      <div key={i} style={{ padding: '0.4rem 0.6rem', marginBottom: '0.25rem', borderRadius: '6px', background: 'rgba(139,92,246,0.05)', fontSize: '0.8rem' }}>
                        <div style={{ color: '#ef4444', marginBottom: '0.1rem' }}>"{bp.original}"</div>
                        <div style={{ color: '#22c55e', marginBottom: '0.1rem' }}>"{bp.better}"</div>
                        {bp.explanation && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{bp.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Corrected Transcript */}
                {sr.correctedTranscript && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.3rem' }}>Corrected Transcript</p>
                    <div style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', background: 'rgba(34,197,94,0.05)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{sr.correctedTranscript}</div>
                  </div>
                )}

                {/* Stronger Answer */}
                {sr.strongerAnswer && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f97316', marginBottom: '0.3rem' }}>Stronger Answer</p>
                    <div style={{ padding: '0.5rem 0.7rem', borderRadius: '6px', background: 'rgba(249,115,22,0.05)', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{sr.strongerAnswer}</div>
                  </div>
                )}

                {/* Phrases to Memorize */}
                {sr.phrasesToMemorize && sr.phrasesToMemorize.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.3rem' }}>Phrases to Memorize ({sr.phrasesToMemorize.length})</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {sr.phrasesToMemorize.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'var(--bg-primary)', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.german}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{p.english}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Copy prompt fallback */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <MessageSquare size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                Recording is saved locally for practice. Automatic AI feedback uses your typed/pasted transcript, not the audio recording.
              </p>
              <button
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', border: spCopied ? '2px solid #3bff9e' : '1px solid var(--border)', background: spCopied ? 'rgba(59, 255, 158, 0.1)' : 'var(--bg-secondary)', color: spCopied ? '#3bff9e' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}
                onClick={hSpCopy}
                disabled={spCopied}
              >
                {spCopied ? <><ClipboardCheck size={16} /> Copied to clipboard!</> : <><Copy size={16} /> Copy AI Speaking Feedback Prompt</>}
              </button>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                Do not submit sensitive personal or medical information.
              </p>
              <button style={sBp} onClick={hSpN}>Next Mission <ChevronRight size={16} /></button>
            </div>
          </div>
        );
      })()}"""

    c = c.replace(old_block, new_block, 1)
    print("OK: Speaking done section replaced with AI results")
else:
    print("FAIL: Speaking done section not found")

# =============================================================
# 7. Add CSS animation for spin
# =============================================================

if '@keyframes spin' not in c:
    # Add style tag in the component - find a good place
    idx = c.find('const sCard')
    if idx > 0:
        # Find closing of return statement area - add a style tag right before the component return
        # Actually let's just use inline style with an existing pattern - React already supports animation via style
        # The animation won't work inline without a stylesheet. Let's add a <style> tag.
        return_start = c.find('return (', idx)
        if return_start > 0:
            # Put a <style> block right after <LevelLock>
            level_lock = c.find('<LevelLock', return_start)
            if level_lock > 0:
                # Insert after <LevelLock ...>
                lock_close = c.find('>', level_lock)
                if lock_close > 0:
                    style_insert = """<style>{'@keyframes dmp-spin{to{transform:rotate(360deg)}}'}</style>"""
                    c = c[:lock_close+1] + style_insert + c[lock_close+1:]
                    print("OK: Added spin animation style")
                else:
                    print("WARN: LevelLock tag not properly closed")
            else:
                print("WARN: LevelLock not found")
    else:
        print("WARN: sCard not found")

# =============================================================
# 8. Update animation reference to use dmp-spin class
# =============================================================

# The RefreshCw icons use animation: spin 1s - change to dmp-spin
c = c.replace("animation: 'spin 1s linear infinite'", "animation: 'dmp-spin 1s linear infinite'")
print("OK: Updated spin animation references")

# Save
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(c)

print("\nAll changes applied!")
