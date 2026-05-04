#!/usr/bin/env python3
"""Replace listening/reading/writing/speaking handlers + JSX in DailyMissionPage.jsx"""

import os

DIR = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.join(DIR, '..', 'src', 'pages', 'DailyMissionPage.jsx')

with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# ===== Replace listening handlers =====
old = '''  const hLrn = () => {
    const items = listeningData[lvl] || [];
    const ni = state.levels?.[lvl]?.listening?.length || 0;
    const item = items[ni];
    if (item) {
      const existing = (state.levels?.[lvl]?.listening || []).filter((x) => x !== item.id);
      updateLevelProgress(lvl, 'listening', [item.id, ...existing]);
      refresh();
    }
    setLrnDone(true);
  };
  const hLrnSk = () => advance('listening', { skipped: true });
  const hLrnN = () => advance('listening', {});'''

new = '''  const hLrnSk = () => advance('listening', { skipped: true });
  const hLrnN = () => {
    setLrq(0); setLrc(0); setLra({}); setLrcorr({});
    advance('listening', {});
  };
  const hLrnA = (qIdx, answer) => {
    const items = listeningData[lvl] || [];
    const ni = state.levels?.[lvl]?.listening?.length || 0;
    const item = items[ni];
    if (!item) return;
    const q = item.questions?.[qIdx];
    if (!q) return;
    const correct = q.type === 'true-false'
      ? String(answer).toLowerCase() === String(q.answer).toLowerCase()
      : String(answer).toLowerCase().trim() === String(q.answer).toLowerCase().trim();
    setLra(prev => ({ ...prev, [qIdx]: answer }));
    setLrcorr(prev => ({ ...prev, [qIdx]: correct }));
    if (correct) setLrc(c => c + 1);
    if (qIdx + 1 < (item.questions?.length || 0)) {
      setLrq(qIdx + 1);
    } else {
      const totalQ = item.questions.length;
      const allCorrect = lrc + (correct ? 1 : 0);
      const existing = (state.levels?.[lvl]?.listening || []).filter((x) => x !== item.id);
      updateLevelProgress(lvl, 'listening', [item.id, ...existing]);
      const cs = getState();
      const ld = cs.levels || {};
      const ll = ld[lvl] || {};
      updateState({ levels: { ...ld, [lvl]: { ...ll, listeningResults: { ...(ll.listeningResults || {}), [item.id]: { completed: true, correct: allCorrect, total: totalQ, date: new Date().toISOString() } } } } });
      refresh();
      setLrnDone(true);
    }
  };'''

if old in content:
    content = content.replace(old, new)
    print("OK: listening handlers")
else:
    print("FAIL: listening handlers")

# ===== Replace reading handlers =====
old = '''  const hRd = () => {
    const items = readingData[lvl] || [];
    const ni = state.levels?.[lvl]?.reading?.length || 0;
    const item = items[ni];
    if (item) {
      const existing = (state.levels?.[lvl]?.reading || []).filter((x) => x !== item.id);
      updateLevelProgress(lvl, 'reading', [item.id, ...existing]);
      refresh();
    }
    setRdDone(true);
  };
  const hRdSk = () => advance('reading', { skipped: true });
  const hRdN = () => advance('reading', {});'''

new = '''  const hRdSk = () => advance('reading', { skipped: true });
  const hRdN = () => {
    setRrq(0); setRrc(0); setRra({}); setRrcorr({});
    advance('reading', {});
  };
  const hRdA = (qIdx, answer) => {
    const items = readingData[lvl] || [];
    const ni = state.levels?.[lvl]?.reading?.length || 0;
    const item = items[ni];
    if (!item) return;
    const q = item.questions?.[qIdx];
    if (!q) return;
    const correct = q.type === 'true-false'
      ? String(answer).toLowerCase() === String(q.answer).toLowerCase()
      : String(answer).toLowerCase().trim() === String(q.answer).toLowerCase().trim();
    setRra(prev => ({ ...prev, [qIdx]: answer }));
    setRrcorr(prev => ({ ...prev, [qIdx]: correct }));
    if (correct) setRrc(c => c + 1);
    if (qIdx + 1 < (item.questions?.length || 0)) {
      setRrq(qIdx + 1);
    } else {
      const totalQ = item.questions.length;
      const allCorrect = rrc + (correct ? 1 : 0);
      const existing = (state.levels?.[lvl]?.reading || []).filter((x) => x !== item.id);
      updateLevelProgress(lvl, 'reading', [item.id, ...existing]);
      const cs = getState();
      const ld = cs.levels || {};
      const ll = ld[lvl] || {};
      updateState({ levels: { ...ld, [lvl]: { ...ll, readingResults: { ...(ll.readingResults || {}), [item.id]: { completed: true, correct: allCorrect, total: totalQ, date: new Date().toISOString() } } } } });
      refresh();
      setRdDone(true);
    }
  };'''

if old in content:
    content = content.replace(old, new)
    print("OK: reading handlers")
else:
    print("FAIL: reading handlers")

# ===== Replace writing handlers =====
old = '''  const hWt = () => {
    const cs = getState();
    const items = writingData[lvl] || [];
    const ni = (cs.writings || []).filter((w) => w.level === lvl).length;
    const item = items[ni];
    if (item) {
      const ws2 = [...(cs.writings || []), { level: lvl, id: item.id, title: item.title, text: wtText, date: new Date().toISOString() }];
      updateState({ writings: ws2 });
      setLS({ ...cs, writings: ws2 });
    }
    setWtDone(true);
  };
  const hWtSk = () => advance('writing', { skipped: true });
  const hWtN = () => { setWtText(''); advance('writing', {}); };'''

new = '''  const handleCopyPrompt = () => {
    const items = writingData[lvl] || [];
    const ni = (getState().writings || []).filter((w) => w.level === lvl).length - 1;
    const item = ni >= 0 && ni < len(items) ? items[ni] : null;
    const written = wtText;
    const prompt = 'I am learning German at CEFR level ' + lvl + '. Please review my German writing and provide feedback.\\n\\nTASK: ' + (item?.prompt || 'Writing task') + '\\nINSTRUCTIONS: ' + (item?.instructions || '') + '\\n\\nMY WRITING:\\n' + written + '\\n\\nPlease provide:\\n1. A corrected version of my text\\n2. Grammar mistakes: For each mistake, show the original phrase, the correction, and a short explanation in English\\n3. Vocabulary suggestions: Any better word choices\\n4. Overall feedback: 2-3 sentences about what I did well and what to improve\\n5. A simplified version at A2 level (if my writing is B1 or above)\\n\\nPlease keep your feedback encouraging and focus on the most important improvements.';
    try { navigator.clipboard.writeText(prompt); } catch(e) {}
  };
  const hWt = () => {
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
  };
  const hWtSk = () => advance('writing', { skipped: true });
  const hWtN = () => { setWtText(''); setWritingPrompt(null); advance('writing', {}); };'''

if old in content:
    content = content.replace(old, new)
    print("OK: writing handlers")
else:
    print("FAIL: writing handlers")

# ===== Replace speaking handlers =====
old = '''  const hSp = () => {
    const cs = getState();
    const items = speakingData[lvl] || [];
    const ni = (cs.speakingRecordings?.[lvl]?.length || 0);
    const item = items[ni];
    if (item) {
      const recs = [...(cs.speakingRecordings?.[lvl] || []), { id: item.id, title: item.title, script: spText, date: new Date().toISOString() }];
      updateState({ speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
      setLS({ ...cs, speakingRecordings: { ...(cs.speakingRecordings || {}), [lvl]: recs } });
    }
    setSpDone(true);
  };
  const hSpSk = () => advance('speaking', { skipped: true });
  const hSpN = () => { setSpText(''); advance('speaking', {}); };'''

new = '''  const handleSpCopyPrompt = () => {
    const items = speakingData[lvl] || [];
    const ni = (getState().speakingRecordings?.[lvl]?.length || 0) - 1;
    const item = ni >= 0 && ni < len(items) ? items[ni] : null;
    const spoken = spText;
    const prompt = 'I am learning German at CEFR level ' + lvl + '. This is my spoken response to a speaking task. Please review my spoken German and provide feedback.\\n\\nTASK: ' + (item?.prompt || 'Speaking task') + '\\nINSTRUCTIONS: ' + (item?.instructions || '') + '\\n\\nMY SPOKEN RESPONSE (SCRIPT):\\n' + spoken + '\\n\\nPlease provide:\\n1. A corrected version of my script\\n2. Grammar mistakes with corrections and explanations\\n3. Pronunciation notes (any difficult sounds, word stress)\\n4. Natural alternative phrasings a native speaker would use\\n5. Overall feedback: 2-3 sentences about what I did well and what to improve\\n\\nKeep your feedback encouraging.';
    try { navigator.clipboard.writeText(prompt); } catch(e) {}
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setSpRecBlob(URL.createObjectURL(blob));
        setSpRecState('done');
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setSpRecState('recording');
      window.__dmpRecorder = mediaRecorder;
    } catch(e) {
      console.warn('Microphone access denied:', e);
    }
  };
  const stopRecording = () => {
    if (window.__dmpRecorder) {
      window.__dmpRecorder.stop();
      window.__dmpRecorder = null;
    }
  };
  const hSp = () => {
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
  };
  const hSpSk = () => advance('speaking', { skipped: true });
  const hSpN = () => { setSpText(''); setSpRecBlob(null); setSpRecState('idle'); setSpeakingPrompt(null); advance('speaking', {}); };'''

if old in content:
    content = content.replace(old, new)
    print("OK: speaking handlers")
else:
    print("FAIL: speaking handlers")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)
print("\nHandlers saved. Now replace JSX sections...")
