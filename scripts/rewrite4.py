import os

d = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(d, '..', 'src', 'pages', 'DailyMissionPage.jsx')

with open(FILE, encoding='utf-8') as f:
    c = f.read()

# =============================================================
# WRITING NOT DONE
# =============================================================
s = "{cm.type === 'writing' && !wtDone && ("
e = "{cm.type === 'writing' && wtDone && ("

si = c.find(s)
ei = c.find(e)

if si >= 0 and ei > si:
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
        close_at += 1
        while close_at < len(c) and c[close_at] in '} ':
            close_at += 1
        
        old = c[si:close_at]
        new = """{cm.type === 'writing' && !wtDone && (() => {
        const items = writingData[lvl] || [];
        const ni = (getState().writings || []).filter((w) => w.level === lvl).length;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        if (!item || items.length === 0) {
          return <div style={sCard}><div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <PenTool size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No writing tasks available for {lvl} yet.</p>
            <button style={sBtn} onClick={hWtSk}><SkipForward size={14} /> Skip for now</button>
          </div></div>;
        }
        return (
          <div style={sCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
            {item.instructions && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {item.instructions}
              </div>
            )}
            <div style={{ background: 'rgba(236,72,153,0.08)', padding: '0.7rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <strong style={{ color: '#ec4899' }}>Prompt: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{item.prompt}</span>
            </div>
            {item.wordLimit && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Word limit: {item.wordLimit} words</p>}
            {item.tips && <p style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.5rem' }}>Tip: {item.tips}</p>}
            <textarea
              style={{ width: '100%', minHeight: '140px', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
              value={wtText}
              onChange={(e) => setWtText(e.target.value)}
              placeholder={'Write your ' + lvl + '-level German response here...'}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button style={sBp} onClick={hWt} disabled={!wtText.trim()}><CheckCircle size={16} /> Submit Writing</button>
              <button style={sBtn} onClick={hWtSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          </div>
        );
      })()}"""
        
        c = c.replace(old, new, 1)
        print("OK: Writing not-done section")
        
        ei = c.find(e)  # re-find
    else:
        print("FAIL: Cannot find close of writing not-done")
else:
    print("FAIL: Writing sections not found")

# =============================================================
# WRITING DONE
# =============================================================
if ei >= 0:
    s2 = "{cm.type === 'writing' && wtDone && ("
    e2 = c.find("{cm.type === 'speaking' && !spDone && (", ei)
    if e2 < 0:
        e2 = c.find('SPEAKING MISSION', ei)
    
    if e2 > ei:
        depth = 0
        close_at = -1
        for i in range(ei, e2):
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
            new2 = """{cm.type === 'writing' && wtDone && (() => {
        const items = writingData[lvl] || [];
        const ni = (getState().writings || []).filter((w) => w.level === lvl).length - 1;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <PenTool size={36} style={{ color: '#ec4899', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ec4899', marginBottom: '0.5rem' }}>Writing Submitted!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your writing has been saved for review.</p>
            <button style={{ ...sBp, marginBottom: '0.5rem' }} onClick={handleCopyPrompt}><Copy size={14} /> Copy AI Correction Prompt</button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Paste this into ChatGPT or Claude to get corrections on your writing.</p>
            <button style={sBp} onClick={hWtN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}"""
            
            c = c.replace(old2, new2, 1)
            print("OK: Writing done section")
        else:
            print("FAIL: Cannot find close of writing done")
    else:
        print("FAIL: writing done section - next block not found")
else:
    print("FAIL: Writing done section not found")

# =============================================================
# SPEAKING NOT DONE
# =============================================================
s3 = "{cm.type === 'speaking' && !spDone && ("
e3 = "{cm.type === 'speaking' && spDone && ("

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
        new3 = """{cm.type === 'speaking' && !spDone && (() => {
        const items = speakingData[lvl] || [];
        const ni = (getState().speakingRecordings?.[lvl]?.length || 0);
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        if (!item || items.length === 0) {
          return <div style={sCard}><div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <Mic size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No speaking tasks available for {lvl} yet.</p>
            <button style={sBtn} onClick={hSpSk}><SkipForward size={14} /> Skip for now</button>
          </div></div>;
        }
        return (
          <div style={sCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.title}</h3>
            {item.instructions && (
              <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {item.instructions}
              </div>
            )}
            <div style={{ background: 'rgba(249,115,22,0.08)', padding: '0.7rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <strong style={{ color: '#f97316' }}>Prompt: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{item.prompt}</span>
            </div>
            {item.prepTime && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Preparation time: {item.prepTime}</p>}
            {item.talkTime && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Speaking time: {item.talkTime}</p>}
            {item.tips && <p style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '0.3rem' }}>Tip: {item.tips}</p>}
            {item.usefulPhrases?.length > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Useful phrases:</p>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {item.usefulPhrases.slice(0, 4).map((p, i) => (
                    <span key={i} style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Recording */}
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Record your response:</p>
              {spRecState === 'idle' && (
                <button style={sBtn} onClick={startRecording}><Play size={14} /> Start Recording</button>
              )}
              {spRecState === 'recording' && (
                <div>
                  <span style={{ display: 'inline-block', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Recording...</span>
                  <button style={{ ...sBtn, borderColor: '#ef4444', color: '#ef4444' }} onClick={stopRecording}>Stop Recording</button>
                </div>
              )}
              {spRecState === 'done' && spRecBlob && (
                <div>
                  <audio src={spRecBlob} controls style={{ width: '100%', marginBottom: '0.3rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#22c55e' }}>Recording saved</p>
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Or type your response below:</p>
            </div>
            <textarea
              style={{ width: '100%', minHeight: '100px', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
              value={spText}
              onChange={(e) => setSpText(e.target.value)}
              placeholder={'Type your ' + lvl + '-level response here...'}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button style={sBp} onClick={hSp} disabled={!spText.trim() && spRecState !== 'done'}><CheckCircle size={16} /> Submit Response</button>
              <button style={sBtn} onClick={hSpSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          </div>
        );
      })()}"""
        
        c = c.replace(old3, new3, 1)
        print("OK: Speaking not-done section")
        
        ei3 = c.find(e3)  # re-find
    else:
        print("FAIL: Cannot find close of speaking not-done")

# =============================================================
# SPEAKING DONE
# =============================================================
if ei3 >= 0:
    s4 = "{cm.type === 'speaking' && spDone && ("
    # Find end of file or next section
    e4 = c.find('\n    </div>\n  </LevelLock>', ei3)
    if e4 < 0:
        e4 = len(c)
    
    if e4 > ei3:
        depth = 0
        close_at = -1
        for i in range(ei3, e4):
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
            new4 = """{cm.type === 'speaking' && spDone && (() => {
        const items = speakingData[lvl] || [];
        const ni = (getState().speakingRecordings?.[lvl]?.length || 0) - 1;
        const item = (ni >= 0 && ni < items.length) ? items[ni] : null;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <Mic size={36} style={{ color: '#f97316', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f97316', marginBottom: '0.5rem' }}>Speaking Submitted!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your speaking response has been saved.</p>
            <button style={{ ...sBp, marginBottom: '0.5rem' }} onClick={handleSpCopyPrompt}><Copy size={14} /> Copy AI Feedback Prompt</button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Paste this into ChatGPT or Claude to get corrections on your spoken German.</p>
            <button style={sBp} onClick={hSpN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}"""
            
            c = c.replace(old4, new4, 1)
            print("OK: Speaking done section")
        else:
            print("FAIL: Cannot find close of speaking done")
    else:
        print("FAIL: speaking done section - end not found")
else:
    print("FAIL: Speaking done section not found")

# Save
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(c)

print("\nSaved final file!")
