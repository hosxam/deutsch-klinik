import os

d = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(d, '..', 'src', 'pages', 'DailyMissionPage.jsx')

with open(FILE, encoding='utf-8') as f:
    c = f.read()

# =============================================================
# LISTENING NOT DONE
# =============================================================
s = "{cm.type === 'listening' && !lrnDone && ("
e = "{cm.type === 'listening' && lrnDone && ("

si = c.find(s)
ei = c.find(e)

if si >= 0 and ei > si:
    # Find the matching close for the first block
    # Pattern: {cond && ( ... )}
    # Walk from opening ( to find matching closing ) before the next block
    depth = 0
    close_at = -1
    for i in range(si, ei):
        if c[i] == '(':
            depth += 1
        elif c[i] == ')':
            depth -= 1
            if depth == 0:
                close_at = i
                break
    
    if close_at >= 0:
        close_at += 1  # include the )
        # The }} is after the )
        # Actually the pattern is {cm... && ( <jsx> )}
        # So after ) we have } which ends the JS expression
        while close_at < len(c) and c[close_at] in '} ':
            close_at += 1
        
        old = c[si:close_at]
        new = """{cm.type === 'listening' && !lrnDone && (() => {
        const items = listeningData[lvl] || [];
        const ni = state.levels?.[lvl]?.listening?.length || 0;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        const qs = item?.questions || [];
        if (!item || items.length === 0) {
          return <div style={sCard}><div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <Headphones size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No listening exercises available for {lvl} yet.</p>
            <button style={sBtn} onClick={hLrnSk}><SkipForward size={14} /> Skip for now</button>
          </div></div>;
        }
        const qIdx = lrq;
        const q = qs[qIdx];
        if (lrq >= qs.length) return null;
        if (!q) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Loading question...</p></div>;
        
        const qHasAns = lra[String(qIdx)] !== undefined;
        const qUserAns = lra[String(qIdx)];
        const qCorrect = lrcorr[String(qIdx)];
        
        const optBtn = (ov) => ({
          ...(qHasAns
            ? (String(ov) === String(q.answer)
                ? { ...sos, borderColor: '#22c55e', color: '#22c55e', background: 'rgba(34,197,94,0.08)' }
                : String(qUserAns) === String(ov)
                  ? { ...so, borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.08)' }
                  : so)
            : (qUserAns === ov ? sos : so))
        });
        
        return (
          <div style={sCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Q {qIdx + 1} of {qs.length}</span>
            </div>
            {ttsAvailable && (
              <div style={{ marginBottom: '0.75rem' }}>
                <button style={{ ...sBtn, fontSize: '0.8rem' }} onClick={() => { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(item.script); u.lang = 'de-DE'; u.rate = 0.85; window.speechSynthesis.speak(u); }}>
                  <Volume2 size={14} /> Read Aloud
                </button>
              </div>
            )}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
              &quot;{item.script}&quot;
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{q.question}</p>
              {q.type === 'true-false' ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['true', 'false'].map((v) => (
                    <button key={v} style={optBtn(v)} onClick={() => { if (!qHasAns) hLrnA(qIdx, v); }} disabled={qHasAns}>
                      {v === 'true' ? 'True' : 'False'}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {(q.options || []).map((o, i) => (
                    <button key={i} style={optBtn(o)} onClick={() => { if (!qHasAns) hLrnA(qIdx, o); }} disabled={qHasAns}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
              {qHasAns && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem', borderRadius: '6px', background: qCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: qCorrect ? '#22c55e' : '#ef4444', marginBottom: '0.3rem' }}>
                    {qCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!qCorrect && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Correct answer: {q.answer}</p>}
                  {qCorrect && qIdx + 1 >= qs.length && (
                    <button style={{ ...sBp, marginTop: '0.3rem' }} onClick={() => setLrnDone(true)}>See Results <ChevronRight size={14} /></button>
                  )}
                  {!qCorrect && (
                    <button style={{ ...sBp, marginTop: '0.3rem' }} onClick={() => {
                      setLrc(prev => prev + 1);
                      if (qIdx + 1 < qs.length) setLrq(qIdx + 1);
                      else setLrnDone(true);
                    }}>{qIdx + 1 < qs.length ? 'Next Question' : 'See Results'} <ChevronRight size={14} /></button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}"""
        
        c = c.replace(old, new, 1)
        print("OK: Listening not-done section")
        
        # Now adjust indices since content changed
        offset = len(new) - len(old)
        ei = c.find(e)  # re-find
    else:
        print("FAIL: Cannot find closing of listening not-done block")
else:
    print("FAIL: Listening sections not found")

# =============================================================
# LISTENING DONE
# =============================================================
if ei >= 0:
    s2 = "{cm.type === 'listening' && lrnDone && ("
    # Find where READING starts
    e2 = c.find("{cm.type === 'reading' && !rdDone && (", ei)
    if e2 < 0:
        e2 = c.find('READING MISSION')
    
    # Find close of this block
    depth = 0
    close_at = -1
    for i in range(ei, e2 if e2 > 0 else len(c)):
        if c[i] == '(':
            depth += 1
        elif c[i] == ')':
            depth -= 1
            if depth == 0:
                close_at = i
                break
    
    if close_at >= 0:
        close_at += 1
        while close_at < len(c) and c[close_at] in '} ':
            close_at += 1
        
        old2 = c[ei:close_at]
        new2 = """{cm.type === 'listening' && lrnDone && (() => {
        const items = listeningData[lvl] || [];
        const ni = state.levels?.[lvl]?.listening?.length || 0;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        const qs = item?.questions || [];
        const wrong = qs.length - lrc;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <Headphones size={36} style={{ color: '#06b6d4', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.5rem' }}>{item?.title || 'Listening Complete'}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: lrc >= qs.length * 0.6 ? '#22c55e' : '#f59e0b', marginBottom: '0.5rem' }}>{lrc}/{qs.length}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Correct: {lrc} | Wrong: {wrong}</p>
            <button style={sBp} onClick={hLrnN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}"""
        
        c = c.replace(old2, new2, 1)
        print("OK: Listening done section")
    else:
        print("FAIL: Cannot find close of listening done block")

# =============================================================
# READING NOT DONE
# =============================================================
s3 = "{cm.type === 'reading' && !rdDone && ("
e3 = "{cm.type === 'reading' && rdDone && ("

si3 = c.find(s3)
ei3 = c.find(e3)

if si3 >= 0 and ei3 > si3:
    depth = 0
    close_at = -1
    for i in range(si3, ei3):
        if c[i] == '(':
            depth += 1
        elif c[i] == ')':
            depth -= 1
            if depth == 0:
                close_at = i
                break
    
    if close_at >= 0:
        close_at += 1
        while close_at < len(c) and c[close_at] in '} ':
            close_at += 1
        
        old3 = c[si3:close_at]
        new3 = """{cm.type === 'reading' && !rdDone && (() => {
        const items = readingData[lvl] || [];
        const ni = state.levels?.[lvl]?.reading?.length || 0;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        const qs = item?.questions || [];
        if (!item || items.length === 0) {
          return <div style={sCard}><div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No reading exercises available for {lvl} yet.</p>
            <button style={sBtn} onClick={hRdSk}><SkipForward size={14} /> Skip for now</button>
          </div></div>;
        }
        const qIdx = rrq;
        const q = qs[qIdx];
        if (rrq >= qs.length) return null;
        if (!q) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Loading question...</p></div>;
        
        const qHasAns = rra[String(qIdx)] !== undefined;
        const qUserAns = rra[String(qIdx)];
        const qCorrect = rrcorr[String(qIdx)];
        
        const optBtn = (ov) => ({
          ...(qHasAns
            ? (String(ov) === String(q.answer)
                ? { ...sos, borderColor: '#22c55e', color: '#22c55e', background: 'rgba(34,197,94,0.08)' }
                : String(qUserAns) === String(ov)
                  ? { ...so, borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.08)' }
                  : so)
            : (qUserAns === ov ? sos : so))
        });
        
        return (
          <div style={sCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Q {qIdx + 1} of {qs.length}</span>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {item.passage}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{q.question}</p>
              {q.type === 'true-false' ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['true', 'false'].map((v) => (
                    <button key={v} style={optBtn(v)} onClick={() => { if (!qHasAns) hRdA(qIdx, v); }} disabled={qHasAns}>
                      {v === 'true' ? 'True' : 'False'}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {(q.options || []).map((o, i) => (
                    <button key={i} style={optBtn(o)} onClick={() => { if (!qHasAns) hRdA(qIdx, o); }} disabled={qHasAns}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
              {qHasAns && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem', borderRadius: '6px', background: qCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: qCorrect ? '#22c55e' : '#ef4444', marginBottom: '0.3rem' }}>
                    {qCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  {!qCorrect && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Correct answer: {q.answer}</p>}
                  {qCorrect && qIdx + 1 >= qs.length && (
                    <button style={{ ...sBp, marginTop: '0.3rem' }} onClick={() => setRdDone(true)}>See Results <ChevronRight size={14} /></button>
                  )}
                  {!qCorrect && (
                    <button style={{ ...sBp, marginTop: '0.3rem' }} onClick={() => {
                      setRrc(prev => prev + 1);
                      if (qIdx + 1 < qs.length) setRrq(qIdx + 1);
                      else setRdDone(true);
                    }}>{qIdx + 1 < qs.length ? 'Next Question' : 'See Results'} <ChevronRight size={14} /></button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}"""
        
        c = c.replace(old3, new3, 1)
        print("OK: Reading not-done section")
        
        # re-find e3
        ei3 = c.find(e3)
    else:
        print("FAIL: Cannot find close of reading not-done block")
else:
    print("FAIL: Reading not-done not found")

# =============================================================
# READING DONE
# =============================================================
if ei3 >= 0:
    s4 = "{cm.type === 'reading' && rdDone && ("
    e4 = c.find("{cm.type === 'writing' && !wtDone && (", ei3)
    if e4 < 0:
        e4 = c.find('WRITING MISSION', ei3)
    
    depth = 0
    close_at = -1
    for i in range(ei3, e4 if e4 > 0 else len(c)):
        if c[i] == '(':
            depth += 1
        elif c[i] == ')':
            depth -= 1
            if depth == 0:
                close_at = i
                break
    
    if close_at >= 0:
        close_at += 1
        while close_at < len(c) and c[close_at] in '} ':
            close_at += 1
        
        old4 = c[ei3:close_at]
        new4 = """{cm.type === 'reading' && rdDone && (() => {
        const items = readingData[lvl] || [];
        const ni = state.levels?.[lvl]?.reading?.length || 0;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        const qs = item?.questions || [];
        const wrong = qs.length - rrc;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <FileText size={36} style={{ color: '#8b5cf6', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '0.5rem' }}>{item?.title || 'Reading Complete'}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: rrc >= qs.length * 0.6 ? '#22c55e' : '#f59e0b', marginBottom: '0.5rem' }}>{rrc}/{qs.length}</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Correct: {rrc} | Wrong: {wrong}</p>
            <button style={sBp} onClick={hRdN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}"""
        
        c = c.replace(old4, new4, 1)
        print("OK: Reading done section")
    else:
        print("FAIL: Cannot find close of reading done block")

# Save intermediate
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(c)
print("\nSaved intermediate file. Now run part 2 for writing/speaking.")
