import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  CalendarCheck, ChevronLeft, Clock, Copy, Check, X, Mic, Square,
  Play, RotateCcw, ChevronDown, ChevronUp, FileText, MessageSquare,
  Users, Award, AlertTriangle
} from 'lucide-react';

const STAGE_CONFIG = {
  1: { label: 'Anamnesegespraech', icon: 'MessageSquare', timeLimit: 300 },
  2: { label: 'Arztbrief / Dokumentation', icon: 'FileText', timeLimit: 480 },
  3: { label: 'Arzt-Arzt-Gespraech / Fallvorstellung', icon: 'Users', timeLimit: 300 },
};

const STAGE2_SECTIONS = [
  'Patientendaten', 'Aufnahmegrund', 'Anamnese', 'Vorerkrankungen',
  'Medikamente', 'Allergien', 'Befund', 'Diagnostik', 'Beurteilung',
  'Therapie / Plan', 'Empfehlungen',
];

const ISBAR_WORDS = {
  I: ['identifikation', 'patient', 'alter', 'name', 'mann', 'frau', 'jahr'],
  S: ['situation', 'aktuell', 'problem', 'beschwerde', 'schmerz', 'symptom', 'dringend'],
  B: ['background', 'vorerkrankung', 'medikament', 'allergie', 'risikofaktor', 'anamnese', 'diagnose'],
  A: ['assessment', 'befund', 'einschaetzung', 'verdacht', 'status', 'klinisch', 'labor', 'ekg'],
  R: ['empfehlung', 'plan', 'weiteres', 'vorgehen', 'ueberweisung', 'therapie', 'massnahme'],
};

function fmt(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function Timer({ limit, onUp }) {
  var [r, setR] = useState(limit);
  useEffect(function() {
    if (r <= 0) { onUp && onUp(); return; }
    var t = setInterval(function() { setR(function(v) { return v - 1; }); }, 1000);
    return function() { clearInterval(t); };
  }, [r, onUp]);
  var pct = (r / limit) * 100;
  var c = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: c }}>
      <Clock size={14} />
      <span className="font-mono font-semibold">{fmt(r)}</span>
      <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: pct + '%', backgroundColor: c }} />
      </div>
    </div>
  );
}

function StageIntro({ num, onStart }) {
  var cfg = STAGE_CONFIG[num];
  var ic = num === 1 ? '#8b5cf6' : num === 2 ? '#ff6b00' : '#f59e0b';
  var bg = num === 1 ? 'rgba(139,92,246,0.15)' : num === 2 ? 'rgba(255,107,0,0.15)' : 'rgba(245,158,11,0.15)';
  var Icon = num === 1 ? MessageSquare : num === 2 ? FileText : Users;
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center py-8 space-y-3">
        <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon size={22} style={{ color: ic }} />
        </div>
        <h2 className="text-base font-bold" style={{ color: 'var(--accent)' }}>{cfg.label}</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Time limit: {fmt(cfg.timeLimit)}</p>
        <button onClick={onStart}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
          Start {cfg.label}
        </button>
      </div>
    </div>
  );
}

export default function FSPExamPage() {
  var [exams, setExams] = useState([]);
  var [view, setView] = useState('list');
  var [activeExam, setActiveExam] = useState(null);
  var [stage, setStage] = useState(0);
  var [responses, setResponses] = useState({ 1: '', 2: '', 3: '' });
  var [scores, setScores] = useState({});
  var [totalScore, setTotalScore] = useState(0);
  var [revealed, setRevealed] = useState({});
  var [expanded, setExpanded] = useState({});
  var [saved, setSaved] = useState(null);
  var [attempts, setAttempts] = useState({});
  var [done, setDone] = useState({});
  var [c2, setC2] = useState({});
  var [recording, setRecording] = useState(false);
  var [hasRec, setHasRec] = useState(false);
  var [audioUrl, setAudioUrl] = useState('');
  var [copied, setCopied] = useState(false);
  var mRef = useRef(null);
  var chRef = useRef([]);

  useEffect(function() {
    fetchData();
    loadAttempts();
    setHasRec(typeof MediaRecorder !== 'undefined');
  }, []);

  async function fetchData() {
    try {
      var m = await import('../data/fspExams.json');
      setExams(m.default || m);
    } catch (e) { setExams([]); }
  }

  function loadAttempts() {
    try {
      var r = localStorage.getItem('fsp_exam_attempts');
      if (r) setAttempts(JSON.parse(r));
    } catch (e) {}
  }

  function saveAttempts(d) {
    try {
      var n = {};
      for (var k in attempts) n[k] = attempts[k];
      n[d.examId] = d;
      setAttempts(n);
      localStorage.setItem('fsp_exam_attempts', JSON.stringify(n));
    } catch (e) {}
  }

  function getAttempt(id) { return attempts[id] || null; }

  function startExam(ex) {
    var a = getAttempt(ex.id);
    if (a && !a.completedAt) setSaved(a);
    setActiveExam(ex);
    setStage(0); setResponses({ 1: '', 2: '', 3: '' });
    setScores({}); setTotalScore(0); setRevealed({}); setDone({}); setC2({}); setAudioUrl('');
    setView('exam');
  }

  function resumeExam(ex) {
    var a = getAttempt(ex.id);
    if (!a) return;
    setActiveExam(ex);
    setResponses(a.responses || { 1: '', 2: '', 3: '' });
    setScores(a.scores || {});
    setTotalScore(a.totalScore || 0);
    setRevealed({ 1: !!(a.scores && a.scores.stage1), 2: !!(a.scores && a.scores.stage2), 3: !!(a.scores && a.scores.stage3) });
    setDone({ 1: !!(a.scores && a.scores.stage1), 2: !!(a.scores && a.scores.stage2), 3: !!(a.scores && a.scores.stage3) });
    setC2(a.c2 || {});
    setAudioUrl(a.audioUrl || '');
    var rs = 1;
    if (a.scores && a.scores.stage1) rs = a.scores.stage2 ? (a.scores.stage3 ? 4 : 3) : 2;
    if (a.completedAt) rs = 4;
    setStage(rs);
    setView('exam');
    setSaved(null);
  }

  function discardSaved() { setSaved(null); }

  function scoreS1() {
    if (!activeExam) return 0;
    var p1 = activeExam.part1_patientConversation || {};
    var ma = p1.mustAsk || [];
    var rf = p1.redFlags || [];
    var t = (responses[1] || '').toLowerCase();
    var mm = 0;
    ma.forEach(function(item) {
      var ws = item.toLowerCase().split(' ').filter(function(w) { return w.length > 3; });
      var m = ws.filter(function(w) { return t.includes(w); });
      if (m.length >= Math.ceil(ws.length * 0.4)) mm++;
    });
    var mr = 0;
    rf.forEach(function(item) {
      var ws = item.toLowerCase().split(' ').filter(function(w) { return w.length > 3; });
      var m = ws.filter(function(w) { return t.includes(w); });
      if (m.length >= Math.ceil(ws.length * 0.3)) mr++;
    });
    return Math.round((ma.length > 0 ? (mm / ma.length) * 50 : 0) + (rf.length > 0 ? (mr / rf.length) * 50 : 0));
  }

  function scoreS2() {
    if (!activeExam) return 0;
    var p2 = activeExam.part2_documentation || {};
    var ki = p2.keyInformation || [];
    var t = responses[2] || '';
    var cc = 0; for (var k in c2) { if (c2[k]) cc++; }
    var ss = (cc / STAGE2_SECTIONS.length) * 50;
    var mi = 0;
    ki.forEach(function(item) {
      var ws = item.toLowerCase().split(' ').filter(function(w) { return w.length > 3; });
      var m = ws.filter(function(w) { return t.toLowerCase().includes(w); });
      if (m.length >= Math.ceil(ws.length * 0.4)) mi++;
    });
    return Math.round(ss + (ki.length > 0 ? (mi / ki.length) * 50 : 0));
  }

  function scoreS3() {
    var t = responses[3] || '';
    var mt = 0;
    for (var s in ISBAR_WORDS) {
      var kw = ISBAR_WORDS[s];
      var m = kw.filter(function(w) { return t.toLowerCase().includes(w); });
      if (m.length >= 2) mt++;
    }
    return Math.round((mt / 5) * 100);
  }

  function finishStage(n) {
    var sc = n === 1 ? scoreS1() : n === 2 ? scoreS2() : scoreS3();
    var ns = {}; for (var k in scores) ns[k] = scores[k]; ns['stage' + n] = sc;
    var nd = {}; for (var k in done) nd[k] = done[k]; nd[n] = true;
    var nr = {}; for (var k in revealed) nr[k] = revealed[k]; nr[n] = true;
    var tot = 0; for (var k in ns) tot += ns[k];
    setScores(ns); setTotalScore(tot); setDone(nd); setRevealed(nr);

    var ad = getAttempt(activeExam.id) || {};
    ad.examId = activeExam.id;
    if (!ad.startedAt) ad.startedAt = new Date().toISOString();
    ad.responses = Object.assign({}, responses);
    ad.c2 = Object.assign({}, c2);
    ad.audioUrl = audioUrl;
    ad.scores = ns;
    ad.totalScore = tot;
    if (n < 3) { ad.completedAt = null; saveAttempts(ad); setStage(n + 1); }
    else { ad.completedAt = new Date().toISOString(); saveAttempts(ad); setStage(4); }
  }

  function restart() {
    setStage(0); setResponses({ 1: '', 2: '', 3: '' });
    setScores({}); setTotalScore(0); setRevealed({}); setDone({}); setC2({}); setAudioUrl('');
  }

  function toList() {
    setView('list'); setActiveExam(null); setStage(0); setSaved(null);
  }

  function setResp(n, v) {
    var r = {}; for (var k in responses) r[k] = responses[k]; r[n] = v; setResponses(r);
  }

  function startRec() {
    if (!hasRec) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      var mr = new MediaRecorder(stream);
      mRef.current = mr;
      chRef.current = [];
      mr.ondataavailable = function(e) { if (e.data.size > 0) chRef.current.push(e.data); };
      mr.onstop = function() {
        var blob = new Blob(chRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(function(t) { t.stop(); });
      };
      mr.start();
      setRecording(true);
    }).catch(function() {});
  }

  function stopRec() {
    if (mRef.current && mRef.current.state !== 'inactive') {
      mRef.current.stop();
      setRecording(false);
    }
  }

  function buildPrompt() {
    if (!activeExam) return '';
    var r1 = responses[1] || '';
    var r2 = responses[2] || '';
    var r3 = responses[3] || '';
    var rub = activeExam.rubric || {};
    var rt = '';
    for (var k in rub) rt += k + ': ' + rub[k] + '\n';
    return 'FSP Mock Exam AI Assessment Request\n\n' +
      'Exam: ' + activeExam.title + '\n' +
      'Case: ' + (activeExam.case || '') + '\n\n' +
      '--- Stage 1: Anamnesegespraech ---\n' + (r1 || '(no response)') + '\n\n' +
      '--- Stage 2: Arztbrief / Documentation ---\n' + (r2 || '(no response)') + '\n\n' +
      '--- Stage 3: Arzt-Arzt-Gespraech / Fallvorstellung ---\n' + (r3 || '(no response)') + '\n\n' +
      '--- Rubric ---\n' + rt + '\n' +
      'Please assess:\n' +
      '1. Medical completeness\n2. Missing red flags\n3. Patient-friendly German\n' +
      '4. Arztbrief structure\n5. Doctor-to-doctor handover quality\n' +
      '6. Grammar and vocabulary\n7. Corrected and improved versions';
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildPrompt());
    } catch (e) {
      var ta = document.createElement('textarea');
      ta.value = buildPrompt();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  // === LIST VIEW ===
  if (view === 'list') {
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/medical-fsp" className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> Back to FSP Hub
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
            <CalendarCheck size={18} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>FSP Mock Exams</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exams.length} full FSP practice exams</p>
          </div>
        </div>
        {exams.length === 0 ? (
          <div className="text-center py-12"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p></div>
        ) : (
          <div className="space-y-4">
            {exams.map(function(exam) {
              var att = getAttempt(exam.id);
              var best = att && att.totalScore != null ? att.totalScore : null;
              return (
                <div key={exam.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <button onClick={function() {
                    var n = {}; for (var k in expanded) n[k] = expanded[k];
                    n[exam.id] = !n[exam.id]; setExpanded(n);
                  }} className="w-full flex items-center justify-between p-3 text-left" style={{ backgroundColor: 'var(--bg-hover)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{exam.title}</span>
                      {best !== null && <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{best}%</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={function(e) { e.stopPropagation(); startExam(exam); }}
                        className="text-[11px] px-3 py-1 rounded-lg font-medium transition-opacity hover:opacity-80"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                        {att && att.completedAt ? 'Retake' : 'Start Exam'}
                      </button>
                      {att && !att.completedAt && (
                        <button onClick={function(e) { e.stopPropagation(); resumeExam(exam); }}
                          className="text-[11px] px-3 py-1 rounded-lg font-medium transition-opacity hover:opacity-80"
                          style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                          Resume
                        </button>
                      )}
                      {expanded[exam.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>
                  {expanded[exam.id] && (
                    <div className="p-3 space-y-2">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{exam.case}</p>
                      {exam.terminology && (
                        <div className="flex flex-wrap gap-1">
                          {exam.terminology.map(function(t, i) {
                            return <span key={i} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>{t}</span>;
                          })}
                        </div>
                      )}
                      {att && att.completedAt && (
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          Completed: {new Date(att.completedAt).toLocaleDateString()} - Score: {att.totalScore}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!activeExam) return null;
  var p1 = (activeExam.part1_patientConversation || {});
  var p2 = (activeExam.part2_documentation || {});
  var p3 = (activeExam.part3_doctorDoctorConversation || {});

  // Saved attempt dialog
  if (stage === 0 && saved) {
    return (
      <div className="max-w-lg mx-auto py-8 text-center space-y-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--accent)' }}>Unfinished Exam Found</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You have an unfinished attempt for {activeExam.title}.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={function() { resumeExam(activeExam); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Resume</button>
          <button onClick={function() { discardSaved(); setStage(1); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>Start Fresh</button>
        </div>
      </div>
    );
  }

  // === STAGE 1: Intro ===
  if (stage === 1 && !done[1] && !revealed[1]) {
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <StageIntro num={1} onStart={function() { setStage(1); }} />
      </div>
    );
  }

  // === STAGE 1: Active ===
  if (stage === 1) {
    var s1r = revealed[1];
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: '#8b5cf6' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Stage 1: Anamnesegespraech</span>
          </div>
          <Timer limit={STAGE_CONFIG[1].timeLimit} onUp={function() { finishStage(1); }} />
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#8b5cf6' }}>Setting</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p1.setting}</p>
          {p1.patientRole && (
            <div className="mt-2 space-y-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <p>Patient: {p1.patientRole.age}y, {p1.patientRole.gender}</p>
              <p>Complaint: {p1.patientRole.chiefComplaint}</p>
              <p>History: {p1.patientRole.history}</p>
              <p>Medications: {p1.patientRole.medications}</p>
              {p1.patientRole.allergies && <p>Allergies: {p1.patientRole.allergies}</p>}
            </div>
          )}
          {p1.doctorTasks && p1.doctorTasks.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1" style={{ color: '#8b5cf6' }}>Your tasks:</p>
              <ul className="space-y-0.5">
                {p1.doctorTasks.map(function(t, i) {
                  return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>&bull; {t}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Write your anamnesis questions:</p>
          <textarea value={responses[1]} onChange={function(e) { setResp(1, e.target.value); }} disabled={done[1]}
            placeholder="Type your questions for the patient..."
            className="w-full h-32 p-3 rounded-lg text-xs resize-y"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>
        {!done[1] && (
          <button onClick={function() { finishStage(1); }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#8b5cf6', color: '#fff' }}>Finish Stage 1</button>
        )}
        {s1r && (
          <div className="space-y-3">
            {p1.mustAsk && p1.mustAsk.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#22c55e' }}>
                  <Check size={12} className="inline mr-1" /> Must-Ask Questions ({p1.mustAsk.length})
                </p>
                <ul className="space-y-0.5">
                  {p1.mustAsk.map(function(q, i) {
                    return <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {q}</li>;
                  })}
                </ul>
              </div>
            )}
            {p1.redFlags && p1.redFlags.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#ef4444' }}>
                  <AlertTriangle size={12} className="inline mr-1" /> Red Flags ({p1.redFlags.length})
                </p>
                <ul className="space-y-0.5">
                  {p1.redFlags.map(function(r, i) {
                    return <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {r}</li>;
                  })}
                </ul>
              </div>
            )}
            {p1.usefulPhrases && p1.usefulPhrases.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6,182,212,0.06)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#06b6d4' }}>
                  <MessageSquare size={12} className="inline mr-1" /> Useful Phrases
                </p>
                <ul className="space-y-0.5">
                  {p1.usefulPhrases.map(function(p, i) {
                    return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>&quot;{p}&quot;</li>;
                  })}
                </ul>
              </div>
            )}
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#8b5cf6' }}>
                <Award size={12} className="inline mr-1" /> Score: {scores.stage1 || 0}%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Based on must-ask and red flag coverage.</p>
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button onClick={function() { setStage(2); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#ff6b00', color: '#fff' }}>Go to Stage 2</button>
          <button onClick={restart}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={12} className="inline mr-1" /> Restart
          </button>
        </div>
      </div>
    );
  }

  // === STAGE 2: Intro ===
  if (stage === 2 && !done[2] && !revealed[2]) {
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <StageIntro num={2} onStart={function() { setStage(2); }} />
      </div>
    );
  }

  // === STAGE 2: Active ===
  if (stage === 2) {
    var s2r = revealed[2];
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: '#ff6b00' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Stage 2: Arztbrief / Documentation</span>
          </div>
          <Timer limit={STAGE_CONFIG[2].timeLimit} onUp={function() { finishStage(2); }} />
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,107,0,0.06)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#ff6b00' }}>Task</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p2.task}</p>
        </div>
        {!done[2] && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#ff6b00' }}>Required Sections:</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGE2_SECTIONS.map(function(sec) {
                return (
                  <button key={sec} onClick={function() {
                    var n = {}; for (var k in c2) n[k] = c2[k];
                    n[sec] = !n[sec]; setC2(n);
                  }} className="text-[11px] px-2 py-1 rounded-full border transition-all"
                    style={{
                      backgroundColor: c2[sec] ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      color: c2[sec] ? '#22c55e' : 'var(--text-secondary)',
                      borderColor: c2[sec] ? 'rgba(34,197,94,0.3)' : 'transparent',
                    }}>
                    {c2[sec] ? <Check size={10} className="inline mr-1" /> : <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />}
                    {sec}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Write your Arztbrief:</p>
          <textarea value={responses[2]} onChange={function(e) { setResp(2, e.target.value); }} disabled={done[2]}
            placeholder="Write your structured Arztbrief here..."
            className="w-full h-40 p-3 rounded-lg text-xs resize-y"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>
        {!done[2] && (
          <button onClick={function() { finishStage(2); }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#ff6b00', color: '#fff' }}>Finish Stage 2</button>
        )}
        {s2r && (
          <div className="space-y-3">
            {p2.keyInformation && p2.keyInformation.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#22c55e' }}>
                  <Check size={12} className="inline mr-1" /> Key Information
                </p>
                <ul className="space-y-0.5">
                  {p2.keyInformation.map(function(info, i) {
                    return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {info}</li>;
                  })}
                </ul>
              </div>
            )}
            {p2.modelOutline && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,107,0,0.06)' }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#ff6b00' }}>Model Outline</p>
                <pre className="text-xs whitespace-pre-wrap font-sans" style={{ color: 'var(--text-secondary)' }}>{p2.modelOutline}</pre>
              </div>
            )}
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#ff6b00' }}>
                <Award size={12} className="inline mr-1" /> Score: {scores.stage2 || 0}%
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button onClick={function() { setStage(3); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#f59e0b', color: '#fff' }}>Go to Stage 3</button>
          <button onClick={restart}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={12} className="inline mr-1" /> Restart
          </button>
        </div>
      </div>
    );
  }

  // === STAGE 3: Intro ===
  if (stage === 3 && !done[3] && !revealed[3]) {
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-4" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <StageIntro num={3} onStart={function() { setStage(3); }} />
      </div>
    );
  }

  // === STAGE 3: Active ===
  if (stage === 3) {
    var s3r = revealed[3];
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: '#f59e0b' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Stage 3: Fallvorstellung</span>
          </div>
          <Timer limit={STAGE_CONFIG[3].timeLimit} onUp={function() { finishStage(3); }} />
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.06)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#f59e0b' }}>Task</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p3.task}</p>
        </div>
        {p3.handoverStructure && p3.handoverStructure.length > 0 && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.04)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>ISBAR Handover Structure</p>
            <ul className="space-y-0.5">
              {p3.handoverStructure.map(function(h, i) {
                return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>&bull; {h}</li>;
              })}
            </ul>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Type your structured handover according to ISBAR:
          </p>
          <textarea value={responses[3]} onChange={function(e) { setResp(3, e.target.value); }} disabled={done[3]}
            placeholder="Write your ISBAR handover..."
            className="w-full h-32 p-3 rounded-lg text-xs resize-y"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} />
        </div>

        {/* Voice Recording */}
        {!done[3] && hasRec && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.04)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#f59e0b' }}>Optional: Record your handover</p>
            {!recording ? (
              <button onClick={startRec}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                <Mic size={14} /> Start Recording
              </button>
            ) : (
              <button onClick={stopRec}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                <Square size={14} /> Stop Recording
              </button>
            )}
            {audioUrl && (
              <div className="mt-2">
                <audio src={audioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>
        )}

        {!done[3] && (
          <button onClick={function() { finishStage(3); }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#f59e0b', color: '#fff' }}>Finish Stage 3</button>
        )}

        {s3r && (
          <div className="space-y-3">
            {p3.expectedSummary && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>
                  <Check size={12} className="inline mr-1" /> Expected Summary
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p3.expectedSummary}</p>
              </div>
            )}
            {p3.differentials && p3.differentials.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#ef4444' }}>
                  <AlertTriangle size={12} className="inline mr-1" /> Differential Diagnoses
                </p>
                <ul className="space-y-0.5">
                  {p3.differentials.map(function(d, i) {
                    return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {d}</li>;
                  })}
                </ul>
              </div>
            )}
            {p3.plan && p3.plan.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6,182,212,0.06)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Management Plan</p>
                <ul className="space-y-0.5">
                  {p3.plan.map(function(p, i) {
                    return <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {p}</li>;
                  })}
                </ul>
              </div>
            )}
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>
                <Award size={12} className="inline mr-1" /> Score: {scores.stage3 || 0}%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Based on ISBAR coverage.</p>
            </div>
          </div>
        )}

        <button onClick={function() {
          finishStage(3);
        }} className="hidden" />

        <div className="flex gap-2 pt-2">
          <button onClick={function() { setStage(4); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#22c55e', color: '#fff' }}>View Final Review</button>
          <button onClick={restart}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
            <RotateCcw size={12} className="inline mr-1" /> Restart
          </button>
        </div>
      </div>
    );
  }

  // === FINAL REVIEW (Stage 4) ===
  if (stage === 4) {
    var rub = activeExam.rubric || {};
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={toList} className="inline-flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--accent)' }}>
          <ChevronLeft size={14} /> All Exams
        </button>

        <div className="text-center py-4">
          <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Exam Complete</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activeExam.title}</p>
        </div>

        {/* Score Overview */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-center mb-4">
            <Award size={36} className="mx-auto mb-2" style={{ color: totalScore >= 70 ? '#22c55e' : totalScore >= 40 ? '#f59e0b' : '#ef4444' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalScore}%</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Needs work' : 'Keep practicing'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}>
              <p className="text-[10px]" style={{ color: '#8b5cf6' }}>Anamnese</p>
              <p className="text-base font-bold" style={{ color: '#8b5cf6' }}>{scores.stage1 || 0}%</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,107,0,0.08)' }}>
              <p className="text-[10px]" style={{ color: '#ff6b00' }}>Arztbrief</p>
              <p className="text-base font-bold" style={{ color: '#ff6b00' }}>{scores.stage2 || 0}%</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
              <p className="text-[10px]" style={{ color: '#f59e0b' }}>Uebergabe</p>
              <p className="text-base font-bold" style={{ color: '#f59e0b' }}>{scores.stage3 || 0}%</p>
            </div>
          </div>
        </div>

        {/* Rubric */}
        {Object.keys(rub).length > 0 && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#22c55e' }}>
              <Award size={12} className="inline mr-1" /> Scoring Rubric
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {Object.entries(rub).map(function(entry) {
                return (
                  <div key={entry[0]} className="p-2 rounded" style={{ backgroundColor: 'var(--bg-card)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{entry[0]}: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{entry[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User Responses */}
        <details className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
          <summary className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Your Responses</summary>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#8b5cf6' }}>Stage 1: Anamnesegespraech</p>
              <pre className="text-xs whitespace-pre-wrap font-sans p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                {responses[1] || '(no response)'}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#ff6b00' }}>Stage 2: Arztbrief</p>
              <pre className="text-xs whitespace-pre-wrap font-sans p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                {responses[2] || '(no response)'}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: '#f59e0b' }}>Stage 3: Fallvorstellung</p>
              <pre className="text-xs whitespace-pre-wrap font-sans p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                {responses[3] || '(no response)'}
              </pre>
            </div>
          </div>
        </details>

        {/* Model Answers */}
        <details className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
          <summary className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Model Answers</summary>
          <div className="mt-3 space-y-3">
            {p3.expectedSummary && (
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#22c55e' }}>Expected Handover Summary</p>
                <p className="text-xs p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>{p3.expectedSummary}</p>
              </div>
            )}
            {p2.modelOutline && (
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#ff6b00' }}>Arztbrief Model</p>
                <pre className="text-xs whitespace-pre-wrap font-sans p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>{p2.modelOutline}</pre>
              </div>
            )}
          </div>
        </details>

        {/* AI Feedback Prompt */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Get AI Feedback</p>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Copy this prompt to an AI assistant (ChatGPT, Claude) for detailed feedback on your exam performance.
          </p>
          <button onClick={copyPrompt}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            <Copy size={12} /> {copied ? 'Copied!' : 'Copy AI Feedback Prompt'}
          </button>
          <pre className="text-xs whitespace-pre-wrap font-sans p-2 rounded mt-2 max-h-48 overflow-y-auto"
            style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            {buildPrompt()}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center py-4">
          <button onClick={restart}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            <RotateCcw size={12} /> Retake This Exam
          </button>
          <button onClick={toList}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
            Back to All Exams
          </button>
        </div>
      </div>
    );
  }

  // Fallback - show stage intro if no match
  if (stage >= 1 && stage <= 3) {
    return <StageIntro num={stage} onStart={function() { setStage(stage); }} />;
  }

  return null;
}
