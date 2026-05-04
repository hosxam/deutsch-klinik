import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getState, updateState, updateLevelProgress, setLevelProgress, getLevelProgress,
  recordGrammarAnswer, recordAnswer, getGrammarMastery, getCompletedLessons,
  updateStreak, completeLesson, completeListening, completeReading,
  recordVocabAnswer
} from '../utils/store';
import { getStudyGoal } from '../components/StudyGoalTracker';
import grammarData from '../data/grammar.json';
import vocabData from '../data/germanVocabulary.json';
import readingData from '../data/reading.json';
import listeningData from '../data/listening.json';
import writingData from '../data/writing.json';
import speakingData from '../data/speaking.json';
import dashboardSummary from '../data/dashboardSummary.json';
import levelsData from '../data/levels.json';
import LevelLock from '../components/LevelLock';
import {
  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,
  SkipForward, Home, GraduationCap, Headphones, Play, ChevronRight
} from 'lucide-react';

function normalizeAnswer(str) {
  return (str || '').trim().toLowerCase().replace(/[.!?,;:]+$/, '');
}

function getLocalDateKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const DL_D = { grammar: 10, vocab: 20, lesson: 1, reading: 1, listening: 1, writing: 1, speaking: 1 };
const DL_MIN = { grammar: 5, vocab: 10, lesson: 1, reading: 1, listening: 1, writing: 1, speaking: 1 };
const DL_MAX = { grammar: 25, vocab: 50, lesson: 3, reading: 3, listening: 3, writing: 2, speaking: 2 };

const MISSION_META = {
  lesson: { title: 'Study a Lesson', icon: GraduationCap, accent: '#10b981' },
  grammar: { title: 'Grammar Practice', icon: BarChart3, accent: '#f59e0b' },
  vocabulary: { title: 'Vocabulary Quiz', icon: BookOpen, accent: '#3bff9e' },
  listening: { title: 'Listening Exercise', icon: Headphones, accent: '#06b6d4' },
  reading: { title: 'Reading Exercise', icon: FileText, accent: '#8b5cf6' },
  writing: { title: 'Writing Task', icon: PenTool, accent: '#ec4899' },
  speaking: { title: 'Speaking Task', icon: Mic, accent: '#f97316' },
};

const TYPE_LABELS = {
  'fill-blank': 'Fill in the Blank',
  mcq: 'Multiple Choice',
  'article-select': 'Article Selection',
  conjugation: 'Conjugation',
  'case-select': 'Case Selection',
};

const SESSION_KEY = 'deutsch_klinik_daily_session';

function loadSession(lev) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.dateKey === getLocalDateKey() && s.levelId === lev) return s;
  } catch (e) {}
  return null;
}

function saveSession(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

function calculateDailyTargets(levelId, state, goal) {
  if (!goal || !goal.targetDate) return { ...DL_D };
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.max(1, Math.ceil((targetDate - today) / 86400000));
  const targetLevelIdx = LEVEL_ORDER[goal.targetLevel];
  if (targetLevelIdx === undefined) return { ...DL_D };
  const planType = goal.planType || 'exam';
  const curLvlData = levelsData.levels.find((l) => l.id === levelId);
  const planGTotal = curLvlData && planType === 'exam' ? curLvlData.grammarUnits : (dashboardSummary.grammarCounts?.[levelId] || 200);
  const planVTotal = curLvlData && planType === 'exam' ? curLvlData.vocabularyUnits : (dashboardSummary.vocabCounts?.[levelId] || 500);
  const gRem = Math.max(1, planGTotal - (state.levels?.[levelId]?.grammar?.length || 0));
  const vRem = Math.max(1, planVTotal - (state.levels?.[levelId]?.vocab?.length || 0));
  const grammar = Math.min(DL_MAX.grammar, Math.max(DL_MIN.grammar, Math.ceil(gRem / daysRemaining)));
  const vocab = Math.min(DL_MAX.vocab, Math.max(DL_MIN.vocab, Math.ceil(vRem / daysRemaining)));
  return { grammar, vocab, lesson: 1, reading: 1, listening: 1, writing: 1, speaking: 1 };
}

function buildMissions(levelId, state, targets) {
  const missions = [];
  const lls = Object.values(dashboardSummary.lessonSummaries || {}).flat().filter((l) => l.level === levelId);
  const cids = getCompletedLessons(levelId);
  const nl = lls.find((l) => !cids.includes(l.id));
  if (nl && targets.lesson > 0) {
    missions.push({ type: 'lesson', target: targets.lesson, label: 'Study 1 lesson', nextLesson: nl });
  }
  if (targets.grammar > 0) missions.push({ type: 'grammar', target: targets.grammar, label: 'Complete ' + targets.grammar + ' questions' });
  if (targets.vocab > 0) missions.push({ type: 'vocabulary', target: targets.vocab, label: 'Learn ' + targets.vocab + ' words' });
  if (targets.listening > 0) missions.push({ type: 'listening', target: targets.listening, label: 'Complete 1 listening test' });
  if (targets.reading > 0) missions.push({ type: 'reading', target: targets.reading, label: 'Complete 1 reading test' });
  if (targets.writing > 0) missions.push({ type: 'writing', target: targets.writing, label: 'Complete 1 writing task' });
  if (targets.speaking > 0) missions.push({ type: 'speaking', target: targets.speaking, label: 'Complete 1 speaking task' });
  return missions;
}

export default function DailyMissionPage() {
  const { levelId } = useParams();
  const lvl = (levelId || '').toUpperCase();
  const [state, setLS] = useState(() => getState());
  const [sesh, setSesh] = useState(() => loadSession(lvl));
  const [mi, setMi] = useState(0);
  const [ms, setMs] = useState([]);
  const [initDone, setInitDone] = useState(false);
  const [lsStart, setLsStart] = useState(false);
  const [lsDone, setLsDone] = useState(false);
  const [fullLesson, setFullLesson] = useState(null);
  const [gi, setGi] = useState(0);
  const [gq, setGq] = useState([]);
  const [ga, setGa] = useState('');
  const [gr, setGr] = useState(null);
  const [gc, setGc] = useState(0);
  const [gw, setGw] = useState(0);
  const [vi, setVi] = useState(0);
  const [vq, setVq] = useState([]);
  const [vr, setVr] = useState(null);
  const [vc, setVc] = useState(0);
  const [vd, setVd] = useState(0);
  const [lrnDone, setLrnDone] = useState(false);
  const [rdDone, setRdDone] = useState(false);
  const [wtDone, setWtDone] = useState(false);
  const [wtText, setWtText] = useState('');
  const [spDone, setSpDone] = useState(false);
  const [spText, setSpText] = useState('');
  const [compShow, setCompShow] = useState(false);

  // Listening question state
  const [lrq, setLrq] = useState(0);
  const [lrc, setLrc] = useState(0);
  const [lra, setLra] = useState({});
  const [lrcorr, setLrcorr] = useState({});

  // Reading question state
  const [rrq, setRrq] = useState(0);
  const [rrc, setRrc] = useState(0);
  const [rra, setRra] = useState({});
  const [rrcorr, setRrcorr] = useState({});

  // Writing/speaking state
  const [writingPrompt, setWritingPrompt] = useState(null);
  const [speakingPrompt, setSpeakingPrompt] = useState(null);
  const [spRecBlob, setSpRecBlob] = useState(null);
  const [spRecState, setSpRecState] = useState('idle');
  const [ttsAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [lrnTTS, setLrnTTS] = useState(false);
  const [wtCopied, setWtCopied] = useState(false);
  const [spCopied, setSpCopied] = useState(false);

  const refresh = useCallback(() => setLS({ ...getState() }), []);

  useEffect(() => {
    const goal = getStudyGoal();
    const cs = getState();
    const t = calculateDailyTargets(lvl, cs, goal);
    const m = buildMissions(lvl, cs, t);
    const ld = loadSession(lvl);
    if (ld) {
      setSesh(ld);
      setMi(ld.currentMission);
      if (ld.completedMissions?.length >= m.length) setCompShow(true);
      if (ld.selectedExerciseIds?.grammar?.length > 0) setGq(ld.selectedExerciseIds.grammar);
      if (ld.selectedExerciseIds?.vocab?.length > 0) setVq(ld.selectedExerciseIds.vocab);
    } else {
      const ns = {
        dateKey: getLocalDateKey(), levelId: lvl, currentMission: 0,
        completedMissions: [], missionResults: {},
        selectedExerciseIds: { grammar: [], vocab: [] }
      };
      saveSession(ns);
      setSesh(ns);
      setMi(0);
    }
    setMs(m);
    setInitDone(true);
  }, [lvl]);

  const getCm = () => mi < ms.length ? ms[mi] : null;
  const getMeta = () => { const c = getCm(); return c ? MISSION_META[c.type] : null; };

  const advance = (type, result) => {
    const ld = loadSession(lvl) || sesh;
    const up = {
      ...ld,
      currentMission: (ld.currentMission || 0) + 1,
      completedMissions: [...(ld.completedMissions || []), type],
      missionResults: { ...(ld.missionResults || {}), [type]: result }
    };
    saveSession(up);
    setSesh(up);
    if (up.currentMission >= ms.length) {
      updateStreak();
      setCompShow(true);
      clearSession();
    } else {
      setMi(up.currentMission);
    }
  };
  const hLs = () => {
    const cm = getCm();
    if (cm?.nextLesson?.id) {
      try {
        const lessons = require('./data/germanLessons.json');
        const found = Array.isArray(lessons) ? lessons.find(l => l.id === cm.nextLesson.id) : null;
        if (found) setFullLesson(found);
      } catch(e) {}
    }
    setLsStart(true);
  };
  const hLsk = () => advance('lesson', { skipped: true });
  const hLc = () => {
    const cm = getCm();
    if (cm?.nextLesson?.id) {
      completeLesson(lvl, cm.nextLesson.id);
      refresh();
    }
    setLsDone(true);
  };
  const hLn = () => advance('lesson', { skipped: false });

  const hGa = (ans) => {
    const ex = grammarData[lvl]?.find((e) => e.id === gq[gi]);
    if (!ex) return;
    const correct = normalizeAnswer(ans) === normalizeAnswer(ex.answer);
    recordGrammarAnswer(ex.id, correct);
    recordAnswer(lvl, ex.id, ans, ex.answer, ex.topic || 'grammar', correct, 'grammar');
    const existing = (state.levels?.[lvl]?.grammar || []).filter((x) => x !== ex.id);
    updateLevelProgress(lvl, 'grammar', [ex.id, ...existing]);
    setGr({ userAnswer: ans, answer: ex.answer, correct });
    if (correct) setGc((c) => c + 1);
    setGw((w) => w + 1);
    refresh();
  };
  const hGn = () => {
    setGi((i) => i + 1);
    setGa('');
    setGr(null);
  };

  useEffect(() => {
    if (!initDone) return;
    const cm = getCm();
    if (!cm || cm.type !== 'grammar') return;
    if (gq.length > 0) return;
    const all = grammarData[lvl] || [];
    const done = state.levels?.[lvl]?.grammar || [];
    const p = getCompletedLessons(lvl) || [];
    const allIds = all.map((x) => x.id);
    const unmastered = all.filter((x) => (done.includes(x.id) ? getGrammarMastery(x.id) < 0.7 : true));
    const count = Math.min(cm.target, unmastered.length);
    const selected = shuffleArray(unmastered).slice(0, count).map((x) => x.id);
    if (selected.length === 0) {
      const fallback = shuffleArray(all).slice(0, Math.min(cm.target, all.length)).map((x) => x.id);
      setGq(fallback);
      const ld = loadSession(lvl) || sesh;
      saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), grammar: fallback } });
      return;
    }
    setGq(selected);
    const ld = loadSession(lvl) || sesh;
    if (ld) saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), grammar: selected } });
  }, [initDone, mi]);

  const hVa = (sel, correct) => {
    const word = vocabData[lvl]?.find((w) => w.id === vq[vi]);
    const isCorrect = sel === correct;
    if (word) {
      recordVocabAnswer(word.id, isCorrect);
      const existing = (state.levels?.[lvl]?.vocab || []).filter((x) => x !== word.id);
      updateLevelProgress(lvl, 'vocab', [word.id, ...existing]);
    }
    setVr({ userAnswer: sel, answer: correct, correct: isCorrect });
    if (isCorrect) setVc((c) => c + 1);
    setVd((d) => d + 1);
    refresh();
  };
  const hVn = () => {
    setVi((i) => i + 1);
    setVr(null);
  };

  useEffect(() => {
    if (!initDone) return;
    const cm = getCm();
    if (!cm || cm.type !== 'vocabulary') return;
    if (vq.length > 0) return;
    const all = vocabData[lvl] || [];
    const done = state.levels?.[lvl]?.vocab || [];
    const unseen = all.filter((x) => !done.includes(x.id));
    const pool = unseen.length >= cm.target ? unseen : all;
    const count = Math.min(cm.target, pool.length);
    const selected = shuffleArray(pool).slice(0, count).map((x) => x.id);
    if (selected.length === 0) {
      const fallback = shuffleArray(all).slice(0, Math.min(cm.target, all.length)).map((x) => x.id);
      setVq(fallback);
      const ld = loadSession(lvl) || sesh;
      saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), vocab: fallback } });
      return;
    }
    setVq(selected);
    const ld = loadSession(lvl) || sesh;
    if (ld) saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), vocab: selected } });
  }, [initDone, mi]);

  const hLrnSk = () => advance('listening', { skipped: true });
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
  };

  const hLrnTTS = () => {
    if (!ttsAvailable) return;
    const items = listeningData[lvl] || [];
    const ni = state.levels?.[lvl]?.listening?.length || 0;
    const item = items[ni];
    if (!item || !item.script) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(item.script);
    utter.lang = 'de-DE';
    utter.rate = 0.85;
    utter.onstart = () => setLrnTTS(true);
    utter.onend = () => setLrnTTS(false);
    window.speechSynthesis.speak(utter);
  };

  const hWtCopy = () => {
    handleCopyPrompt();
    setWtCopied(true);
    setTimeout(() => setWtCopied(false), 2500);
  };

  const hSpCopy = () => {
    handleSpCopyPrompt();
    setSpCopied(true);
    setTimeout(() => setSpCopied(false), 2500);
  };

  const hSpStartRec = startRecording;
  const hSpStopRec = stopRecording;

  const hRdSk = () => advance('reading', { skipped: true });
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
  };

  const handleCopyPrompt = () => {
    const items = writingData[lvl] || [];
    const ni = (getState().writings || []).filter((w) => w.level === lvl).length - 1;
    const item = ni >= 0 && ni < items.length ? items[ni] : null;
    const written = wtText;
    const prompt = 'I am learning German at CEFR level ' + lvl + '. Please review my German writing and provide feedback.\n\nTASK: ' + (item?.prompt || 'Writing task') + '\nINSTRUCTIONS: ' + (item?.instructions || '') + '\n\nMY WRITING:\n' + written + '\n\nPlease provide:\n1. A corrected version of my text\n2. Grammar mistakes: For each mistake, show the original phrase, the correction, and a short explanation in English\n3. Vocabulary suggestions: Any better word choices\n4. Overall feedback: 2-3 sentences about what I did well and what to improve\n5. A simplified version at A2 level (if my writing is B1 or above)\n\nPlease keep your feedback encouraging and focus on the most important improvements.';
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
  const hWtN = () => { setWtText(''); setWritingPrompt(null); advance('writing', {}); };

  const handleSpCopyPrompt = () => {
    const items = speakingData[lvl] || [];
    const ni = (getState().speakingRecordings?.[lvl]?.length || 0) - 1;
    const item = ni >= 0 && ni < items.length ? items[ni] : null;
    const spoken = spText;
    const prompt = 'I am learning German at CEFR level ' + lvl + '. This is my spoken response to a speaking task. Please review my spoken German and provide feedback.\n\nTASK: ' + (item?.prompt || 'Speaking task') + '\nINSTRUCTIONS: ' + (item?.instructions || '') + '\n\nMY SPOKEN RESPONSE (SCRIPT):\n' + spoken + '\n\nPlease provide:\n1. A corrected version of my script\n2. Grammar mistakes with corrections and explanations\n3. Pronunciation notes (any difficult sounds, word stress)\n4. Natural alternative phrasings a native speaker would use\n5. Overall feedback: 2-3 sentences about what I did well and what to improve\n\nKeep your feedback encouraging.';
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
  const hSpN = () => { setSpText(''); setSpRecBlob(null); setSpRecState('idle'); setSpeakingPrompt(null); advance('speaking', {}); };

  // ─── COMPLETION SCREEN ───
  if (compShow) {
    const r = (sesh?.missionResults || {});
    const gr2 = r.grammar || {};
    const vr2 = r.vocabulary || {};
    return (
      <LevelLock levelId={lvl}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem', textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#22c55e', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>Daily Plan Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Great job! You completed today&apos;s study plan for {lvl}.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              {r.lesson && !r.lesson.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={16} style={{ color: '#10b981' }} /><span>Lesson completed</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
              {gr2.total > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={16} style={{ color: '#f59e0b' }} /><span>Grammar: {gr2.correct || 0}/{gr2.total} correct</span>
                  {gr2.wrong > 0 ? <XCircle size={14} style={{ color: '#ef4444', marginLeft: 'auto' }} /> : <CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />}
                </div>
              )}
              {vr2.total > 0 && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} style={{ color: '#3bff9e' }} /><span>Vocabulary: {vr2.correct || 0}/{vr2.total} correct</span>
                  {vr2.wrong > 0 ? <XCircle size={14} style={{ color: '#ef4444', marginLeft: 'auto' }} /> : <CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />}
                </div>
              )}
              {r.listening && !r.listening.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Headphones size={16} style={{ color: '#06b6d4' }} /><span>Listening completed</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
              {r.reading && !r.reading.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} style={{ color: '#8b5cf6' }} /><span>Reading completed</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
              {r.writing && !r.writing.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PenTool size={16} style={{ color: '#ec4899' }} /><span>Writing submitted</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
              {r.speaking && !r.speaking.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mic size={16} style={{ color: '#f97316' }} /><span>Speaking submitted</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
            </div>
            <Link to={'/level/' + levelId} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
              <Home size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </LevelLock>
    );
  }
  // ─── LOADING / ALL CAUGHT UP ───
  if (!initDone || !getCm()) {
    return (
      <LevelLock levelId={lvl}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem', textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
            {ms.length === 0 ? (
              <>
                <GraduationCap size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>All Caught Up!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>All missions for {lvl} are complete for today.</p>
                <Link to={'/level/' + levelId} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                  <Home size={16} /> Back to Dashboard
                </Link>
              </>
            ) : <p style={{ color: 'var(--text-muted)' }}>Loading your daily plan...</p>}
          </div>
        </div>
      </LevelLock>
    );
  }

  const meta = getMeta();
  const cm = getCm();

  // Current mission items from data
  const listeningItem = cm.type === 'listening' ? getNextListening(lvl) : null;
  const readingItem = cm.type === 'reading' ? getNextReading(lvl) : null;
  const writingItem = cm.type === 'writing' ? getNextWriting(lvl) : null;
  const speakingItem = cm.type === 'speaking' ? getNextSpeaking(lvl) : null;

  // Style objects
  const sCard = { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' };
  const sBtn = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' };
  const sBp = { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' };
  const sBs = { padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' };
  const tag = (bg) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: bg || 'var(--bg-secondary)', color: 'var(--text-secondary)' });
  const so = { display: 'block', width: '100%', padding: '0.7rem 1rem', marginBottom: '0.4rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' };
  const sos = { display: 'block', width: '100%', padding: '0.7rem 1rem', marginBottom: '0.4rem', borderRadius: '8px', border: '2px solid var(--accent)', background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' };

  return (
    <LevelLock levelId={lvl}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Today&apos;s Plan</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {meta && React.createElement(meta.icon, { size: 18, style: { color: meta.accent } })}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Mission {mi + 1} of {ms.length}
              </span>
            </div>
            <Link to={'/level/' + levelId} style={sBs}><Home size={14} /> Dashboard</Link>
          </div>
          {meta && <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: meta.accent, margin: '0.3rem 0' }}>{meta.title}</h2>}
          {cm && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target: {cm.label}</p>}
        </div>

        {/* LESSON */}
        {cm.type === 'lesson' && !lsDone && (
          <div style={sCard}>
            {!lsStart ? (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{cm.nextLesson?.title || 'Next Lesson'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{cm.nextLesson?.objective || 'Study this lesson to continue.'}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={sBp} onClick={hLs}><Play size={16} /> Study Lesson</button>
                  <button style={sBtn} onClick={hLsk}><SkipForward size={14} /> Skip for now</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{cm.nextLesson?.title || 'Lesson'}</h3>
                {fullLesson?.explanation && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent)' }}>Explanation:</strong>
                    <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{fullLesson.explanation}</p>
                  </div>
                )}
                {fullLesson?.examples?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Examples:</strong>
                    <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {fullLesson.examples.slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {fullLesson?.grammarFocus && (
                  <div style={{ background: 'rgba(245,158,11,0.1)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#f59e0b' }}>Grammar Focus: </strong><span style={{ color: 'var(--text-secondary)' }}>{fullLesson.grammarFocus}</span>
                  </div>
                )}
                {/* Vocabulary */}
                {fullLesson?.vocabulary?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Key Vocabulary:</strong>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      {fullLesson.vocabulary.slice(0, 6).map((v, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.4rem', background: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent', borderRadius: '4px', marginBottom: '0.15rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{v.word}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{v.translation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Guided Practice */}
                {fullLesson?.guidedPractice?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Practice Questions:</strong>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      {fullLesson.guidedPractice.slice(0, 3).map((p, i) => (
                        <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', marginBottom: '0.3rem' }}>
                          <p style={{ color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{p.prompt}</p>
                          <p style={{ color: '#059669', fontStyle: 'italic' }}>Answer: {p.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {fullLesson?.reviewSummary && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                    <strong style={{ color: '#10b981' }}>Summary: </strong><span style={{ color: 'var(--text-secondary)' }}>{fullLesson.reviewSummary}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button style={sBp} onClick={hLc}><CheckCircle size={16} /> Mark Lesson Complete</button>
                  <button style={sBtn} onClick={hLsk}><SkipForward size={14} /> Skip for now</button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Lesson complete */}
        {cm.type === 'lesson' && lsDone && (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <CheckCircle size={36} style={{ color: '#22c55e', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.5rem' }}>Lesson Complete!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{cm.nextLesson?.title} completed.</p>

          <button style={sBp} onClick={hLn}>Next Mission <ChevronRight size={16} /></button>
        </div>
      )}
      {/* GRAMMAR */}
      {cm.type === 'grammar' && (() => {
        const ex = grammarData[lvl]?.find((e) => e.id === gq[gi]);
        if (!ex && gq.length > 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Loading grammar...</p></div>;
        if (!ex && gq.length === 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Selecting questions...</p></div>;
        if (gw >= gq.length && gq.length > 0) {
          const wr = gw - gc;
          return (
            <div style={{ ...sCard, textAlign: 'center' }}>
              <BarChart3 size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>Grammar Mission Complete</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: gc >= gq.length * 0.7 ? '#22c55e' : '#f59e0b', marginBottom: '0.5rem' }}>{gc}/{gq.length}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Correct: {gc} | Wrong: {wr}</p>
              <button style={sBp} onClick={() => { advance('grammar', { total: gq.length, correct: gc, wrong: wr }); setGi(0); setGq([]); setGw(0); setGc(0); setGr(null); setGa(''); }}>Next Mission <ChevronRight size={16} /></button>
            </div>
          );
        }
        const hasAns = gr !== null;
        return (
          <div style={sCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={tag(ex.type === 'fill-blank' ? 'rgba(59,130,246,0.15)' : ex.type === 'article-select' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)')}>
                {(TYPE_LABELS[ex.type] || ex.type)} &middot; {(ex.topic || 'General')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question {gw + 1} of {gq.length}</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', lineHeight: '1.5' }}>{ex.prompt}</p>
            {ex.type === 'fill-blank' ? (
              <div>
                <input type='text' style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} value={ga} onChange={(e) => setGa(e.target.value)} placeholder='Type your answer...' disabled={hasAns} onKeyDown={(e) => { if (e.key === 'Enter' && !hasAns && ga.trim()) hGa(ga.trim()); }} />
                {!hasAns && <button style={{ ...sBp, marginTop: '0.5rem' }} onClick={() => { if (ga.trim()) hGa(ga.trim()); }} disabled={!ga.trim()}><CheckCircle size={14} /> Check</button>}
              </div>
            ) : (
              <div>
                {(ex.options || []).map((o, i) => (
                  <button key={i} style={ga === o ? sos : so} onClick={() => { if (!hasAns) { setGa(o); hGa(o); } }} disabled={hasAns}>{o}</button>
                ))}
              </div>
            )}
            {hasAns && (
              <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', borderRadius: '6px', background: gr.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {gr.correct ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : <XCircle size={16} style={{ color: '#ef4444' }} />}
                  <span style={{ fontWeight: 600, color: gr.correct ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>{gr.correct ? 'Correct!' : 'Incorrect'}</span>
                </div>
                {!gr.correct && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correct answer: <strong style={{ color: '#22c55e' }}>{gr.answer}</strong></p>}
                <div style={{ marginTop: '0.5rem' }}>
                  <button style={sBp} onClick={hGn}>{gw >= gq.length ? 'See Results' : 'Next Question'} <ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* VOCABULARY */}
      {cm.type === 'vocabulary' && (() => {
        const word = vocabData[lvl]?.find((w) => w.id === vq[vi]);
        if (!word && vq.length > 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Loading vocabulary...</p></div>;
        if (!word && vq.length === 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Selecting words...</p></div>;
        if (vd >= vq.length && vq.length > 0) {
          const wr = vd - vc;
          return (
            <div style={{ ...sCard, textAlign: 'center' }}>
              <BookOpen size={36} style={{ color: '#3bff9e', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>Vocabulary Mission Complete</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: vc >= vq.length * 0.7 ? '#22c55e' : '#3bff9e', marginBottom: '0.5rem' }}>{vc}/{vq.length}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Correct: {vc} | Wrong: {wr}</p>
              <button style={sBp} onClick={() => { advance('vocabulary', { total: vq.length, correct: vc, wrong: wr }); setVi(0); setVq([]); setVd(0); setVc(0); setVr(null); }}>Next Mission <ChevronRight size={16} /></button>
            </div>
          );
        }

        const translations = [word.translation];
        const options = vocabData[lvl]?.filter((w) => w.id !== word.id).map((w) => w.translation) || [];
        const shuffled = [word.translation, ...shuffleArray(options).slice(0, 3)];
        const finalOptions = shuffleArray(shuffled);

        return (
          <div style={sCard}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem 0' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{word.word}</h3>
              {word.article && <span style={tag('rgba(59,130,246,0.15)')}>{word.article}</span>}
              {word.partOfSpeech && word.partOfSpeech !== 'other' && <span style={{ ...tag(), marginLeft: '0.3rem' }}>{word.partOfSpeech}</span>}
              {word.topic && <span style={{ ...tag(), marginLeft: '0.3rem' }}>{word.topic}</span>}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>What does this word mean?</p>
            {vr === null ? (
              <div>
                {finalOptions.map((opt, idx) => (
                  <button key={idx} style={so} onClick={() => hVa(opt, word.translation)}>
                    {opt}
                  </button>
                ))}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                  <button style={sBtn} onClick={hVn}><SkipForward size={14} /> Skip</button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', background: vr.correct ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  {vr.correct ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : <XCircle size={16} style={{ color: '#ef4444' }} />}
                  <span style={{ fontWeight: 600, color: vr.correct ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>{vr.correct ? 'Correct!' : 'Incorrect'}</span>
                </div>
                {!vr.correct && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correct answer: <strong style={{ color: '#22c55e' }}>{vr.answer}</strong></p>}
                <div style={{ marginTop: '0.5rem' }}>
                  <button style={sBp} onClick={hVn}>{vd >= vq.length ? 'See Results' : 'Next Word'} <ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ───── LISTENING MISSION ───── */}
      {cm.type === 'listening' && !lrnDone && (() => {
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
      })()}
      {cm.type === 'listening' && lrnDone && (() => {
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
      })()}

      {/* ───── READING MISSION ───── */}
      {cm.type === 'reading' && !rdDone && (() => {
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
      })()}
      {cm.type === 'reading' && rdDone && (() => {
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
      })()}

      {/* ───── WRITING MISSION ───── */}
      {cm.type === 'writing' && !wtDone && (() => {
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
      })()}
      {cm.type === 'writing' && wtDone && (() => {
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
      })()}

      {/* ───── SPEAKING MISSION ───── */}
      {cm.type === 'speaking' && !spDone && (() => {
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
      })()}
      {cm.type === 'speaking' && spDone && (() => {
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
      })()}
    </div>
  </LevelLock>
);
}
