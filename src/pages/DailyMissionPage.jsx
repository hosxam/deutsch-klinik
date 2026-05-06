import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getState, updateState, setLevelProgress, getLevelProgress,
  recordGrammarAnswer, recordAnswer, getGrammarMastery, getCompletedLessons,
  updateStreak, completeLesson, completeListening, completeReading,
  recordVocabAnswer, completeGrammarLesson, getCompletedGrammarLessons,
  getNextGrammarLesson, recordStudyMinutes, addRemediationRecommendation
} from '../utils/store';
import { getStudyGoal } from '../components/StudyGoalTracker';
import { buildAdaptiveTargets, MINUTES, getRemediationRecommendation } from '../utils/adaptivePlan';
import grammarData from '../data/grammar.json';
import grammarCurriculum from '../data/grammarCurriculum.json';
import vocabData from '../data/germanVocabulary.json';
import readingData from '../data/reading.json';
import listeningData from '../data/listening.json';
import germanLessons from '../data/germanLessons.json';
import writingData from '../data/writing.json';
import speakingData from '../data/speaking.json';
import dashboardSummary from '../data/dashboardSummary.json';
import LevelLock from '../components/LevelLock';
import GermanCharHelper from '../components/GermanCharHelper';

/** Safely coerce a JSON field to array for .map()/.slice() calls */
function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) return [v];
  if (v && typeof v === 'object') return Object.values(v).filter(Boolean);
  return [];
}

function lessonText(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (Array.isArray(item)) return item.filter(Boolean).join(' - ');
  if (typeof item === 'object') {
    return [
      item.form, item.word, item.prompt, item.de, item.german, item.title,
      item.wrong, item.correct, item.answer, item.use, item.translation,
      item.en, item.explanation, item.example,
    ].filter(Boolean).join(' - ');
  }
  return String(item);
}

import {
  CheckCircle, XCircle, BarChart3, BookOpen, FileText, PenTool, Mic,
  SkipForward, Home, GraduationCap, Headphones, Play, ChevronLeft, ChevronRight,
  Sparkles, Copy, ClipboardCheck, ShieldCheck, AlertCircle, RefreshCw,
  Volume2, MessageSquare, BookMarked,
  Square, Lightbulb
} from 'lucide-react';
import { correctWriting, correctSpeaking, isCorrectionEnabled, transcribeAudio } from '../utils/aiCorrection';

function normalizeAnswer(str) {
  return (str || '').trim().toLowerCase()
    .replace(/[.!?,;:]+$/, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
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

function grammarMasteryRatio(exerciseId) {
  const mastery = getGrammarMastery(exerciseId);
  const total = mastery.correct + mastery.incorrect;
  return total > 0 ? mastery.correct / total : 0;
}

const MISSION_META = {
  lesson: { title: 'Study a Lesson', icon: GraduationCap, accent: '#10b981' },
  grammarLesson: { title: 'Grammar Lesson', icon: BookMarked, accent: '#a855f7' },
  grammar: { title: 'Grammar Practice', icon: BarChart3, accent: '#f59e0b' },
  vocabulary: { title: 'Vocabulary Quiz', icon: BookOpen, accent: '#3bff9e' },
  listening: { title: 'Listening Exercise', icon: Headphones, accent: '#06b6d4' },
  reading: { title: 'Reading Exercise', icon: FileText, accent: '#8b5cf6' },
  writing: { title: 'Writing Task', icon: PenTool, accent: '#ec4899' },
  speaking: { title: 'Speaking Task', icon: Mic, accent: '#f97316' },
  flashcards: { title: 'Flashcard Review', icon: BookOpen, accent: '#3bff9e' },
  remediation: { title: 'Remediation', icon: RefreshCw, accent: '#ff3355' },
};

const TYPE_LABELS = {
  'fill-blank': 'Fill in the Blank',
  mcq: 'Multiple Choice',
  'article-select': 'Article Selection',
  conjugation: 'Conjugation',
  'case-select': 'Case Selection',
  'sentence-correction': 'Sentence Correction',
  'sentence-reorder': 'Sentence Reorder',
  mixed: 'Mixed Exercise',
};

const SESSION_KEY = 'deutsch_klinik_daily_session';

const GRAMMAR_LESSON_TO_EXPANDED_LESSON = {
  A1_gc_1: 'A1_lesson_2',
  A1_gc_2: 'A1_lesson_1',
};

function getExpandedGrammarLesson(grammarLesson) {
  const mappedLessonId = GRAMMAR_LESSON_TO_EXPANDED_LESSON[grammarLesson?.id];
  if (!mappedLessonId) return null;
  return germanLessons.find((lesson) => lesson.id === mappedLessonId) || null;
}

function loadSession(lev) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.dateKey === getLocalDateKey() && s.levelId === lev) return s;
  } catch { /* empty */ }
  return null;
}

function saveSession(s) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* empty */ }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* empty */ }
}

function calculateDailyTargets(levelId, state, goal) {
  return buildAdaptiveTargets(levelId, state, goal);
}

function getLessonIds(value) {
  if (!Array.isArray(value)) return [];
  return value.map(item => (typeof item === 'string' ? item : item?.id)).filter(Boolean);
}

function getLessonConceptIds(lessonIds) {
  const ids = new Set(lessonIds);
  return new Set(
    germanLessons
      .filter(lesson => ids.has(lesson.id))
      .flatMap(lesson => [
        lesson.conceptId,
        ...(lesson.conceptsTaught || []),
        ...(lesson.linkedPracticeConceptTags || []),
      ])
      .filter(Boolean)
  );
}

function getPracticeContext(levelId, session, currentState) {
  const planLessonIds = session?.planLessonIds || [];
  const completedLessonIds = getLessonIds(currentState.completedLessons?.[levelId]);
  const completedSet = new Set(completedLessonIds);
  const todayLessonIds = planLessonIds.filter(id => completedSet.has(id));
  const allowedLessonIds = new Set(completedLessonIds);
  return {
    planLessonIds,
    completedLessonIds,
    todayLessonIds,
    allowedLessonIds,
    allowedConceptIds: getLessonConceptIds([...allowedLessonIds]),
    todayConceptIds: getLessonConceptIds(todayLessonIds),
    isFreePractice: Boolean(session?.forceType),
  };
}

function getQuestionLessonId(question) {
  return question?.taughtInLessonId || question?.remediationLessonId || '';
}

function getWordLessonId(word) {
  return word?.taughtInLessonId || word?.lessonId || word?.remediationLessonId || '';
}

function buildMissions(levelId, state, targets, forceType) {
  if (forceType === 'listening' || forceType === 'reading' || forceType === 'writing' || forceType === 'speaking') {
    return [{ type: forceType, target: 1, label: 'Complete 1 ' + forceType + ' test' }];
  }
  if (forceType === 'grammar') {
    return [{ type: 'grammar', target: 10, label: 'Complete 10 questions' }];
  }
  if (forceType === 'vocabulary') {
    return [{ type: 'vocabulary', target: 5, label: 'Learn 5 words' }];
  }
  if (forceType === 'flashcards') {
    return [{ type: 'flashcards', target: 10, label: 'Review 10 flashcards' }];
  }
  if (forceType === 'remediation') {
    return [{ type: 'remediation', target: 1, label: 'Complete remediation task' }];
  }
  if (forceType === 'lesson') {
    const lls = Object.values(dashboardSummary.lessonSummaries || {}).flat().filter((l) => l.level === levelId);
    const nl = lls.find((l) => !getCompletedLessons(levelId).includes(l.id)) || lls[0];
    return nl ? [{ type: 'lesson', target: 1, label: 'Study 1 lesson', nextLesson: nl }] : [];
  }
  const missions = [];
  const lls = Object.values(dashboardSummary.lessonSummaries || {}).flat().filter((l) => l.level === levelId);
  const cids = getCompletedLessons(levelId);
  const nextLessons = lls.filter((l) => !cids.includes(l.id));
  const lessonCount = targets.lesson > 0
    ? Math.min(nextLessons.length, Math.max(targets.lesson, targets.estimatedMinutes >= 30 ? 2 : targets.lesson))
    : 0;
  nextLessons.slice(0, lessonCount).forEach((lesson, index) => {
    missions.push({ type: 'lesson', target: 1, label: `Study lesson ${index + 1} of ${lessonCount}`, nextLesson: lesson });
  });
  if (lessonCount === 0 && nextLessons[0] && targets.lesson > 0) {
    missions.push({ type: 'lesson', target: 1, label: 'Study 1 lesson', nextLesson: nextLessons[0] });
  }
  // Grammar Lesson: find next incomplete grammar curriculum lesson
  const nextGc = getNextGrammarLesson(levelId, grammarCurriculum);
  if (nextGc && targets.lesson > 0) {
    missions.push({ type: 'grammarLesson', target: 1, label: 'Study: ' + nextGc.title, nextGcLesson: nextGc });
  }
  if (targets.grammar > 0) missions.push({ type: 'grammar', target: targets.grammar, label: 'Complete ' + targets.grammar + ' questions' });
  if (targets.vocab > 0) missions.push({ type: 'vocabulary', target: targets.vocab, label: 'Learn ' + targets.vocab + ' words' });
  if (targets.flashcards > 0) missions.push({ type: 'flashcards', target: targets.flashcards, label: 'Review ' + targets.flashcards + ' due/weak flashcards' });
  if (targets.listening > 0) missions.push({ type: 'listening', target: targets.listening, label: 'Complete 1 listening test' });
  if (targets.reading > 0) missions.push({ type: 'reading', target: targets.reading, label: 'Complete 1 reading test' });
  if (targets.writing > 0) missions.push({ type: 'writing', target: targets.writing, label: 'Complete 1 writing task' });
  if (targets.speaking > 0) missions.push({ type: 'speaking', target: targets.speaking, label: 'Complete 1 speaking task' });
  if (targets.remediation > 0 && getRemediationRecommendation(state, levelId)) {
    missions.push({ type: 'remediation', target: 1, label: 'Follow up on your weakest skill' });
  }
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
  const [gEmpty, setGEmpty] = useState(false);
  const [ga, setGa] = useState('');
  const [gr, setGr] = useState(null);
  const [gc, setGc] = useState(0);
  const [gw, setGw] = useState(0);
  const [vi, setVi] = useState(0);
  const [vq, setVq] = useState([]);
  const [vEmpty, setVEmpty] = useState(false);
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
  const [, setLrc] = useState(0);
  const [lra, setLra] = useState({});
  const [lrcorr, setLrcorr] = useState({});

  // Reading question state
  const [rrq, setRrq] = useState(0);
  const [, setRrc] = useState(0);
  const [rra, setRra] = useState({});
  const [rrcorr, setRrcorr] = useState({});

  // Writing/speaking state
  const [, setWritingPrompt] = useState(null);
  const [, setSpeakingPrompt] = useState(null);
  const [spRecBlob, setSpRecBlob] = useState(null);
  const [spRecState, setSpRecState] = useState('idle');
  const [spTranscriptionLoading, setSpTranscriptionLoading] = useState(false);
  const [spTranscriptionError, setSpTranscriptionError] = useState(null);
  const [spIsListening, setSpIsListening] = useState(false);
  const spRecognitionRef = useRef(null);
  const spMediaRecorderRef = useRef(null);
  const spChunksRef = useRef([]);
  const spStreamRef = useRef(null);
  // Cleanup: stop media tracks on unmount
  useEffect(() => {
    return () => {
      if (spStreamRef.current) {
        spStreamRef.current.getTracks().forEach(t => t.stop());
        spStreamRef.current = null;
      }
      if (spMediaRecorderRef.current && spMediaRecorderRef.current.state === 'recording') {
        spMediaRecorderRef.current.stop();
        spMediaRecorderRef.current = null;
      }
    };
  }, []);

  const spSpeechSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [ttsAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [lrnTTS, setLrnTTS] = useState(false);
  const [gcStart, setGcStart] = useState(false);
  const [gcDone, setGcDone] = useState(false);
  const [gcLesson, setGcLesson] = useState(null);
  const [gcTopicLinks, setGcTopicLinks] = useState([]);
  const [gWrongList, setGWrongList] = useState([]);
  const [gReviewMode, setGReviewMode] = useState(false);
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
  const [remStarted, setRemStarted] = useState(false);
  const [remIndex, setRemIndex] = useState(0);
  const [remCompleted, setRemCompleted] = useState([]);
  const [remSummary, setRemSummary] = useState(null);
  const aiEnabled = isCorrectionEnabled();


  const refresh = useCallback(() => setLS({ ...getState() }), []);

  useEffect(() => {
    const goal = getStudyGoal();
    const cs = getState();
    const t = calculateDailyTargets(lvl, cs, goal);
    const planSignature = JSON.stringify({
      dailyMinutes: goal?.dailyMinutes || 30,
      planType: goal?.planType || 'exam',
      targetLevel: goal?.targetLevel || lvl,
      targets: t,
    });
    const forceType = new URLSearchParams(window.location.hash.split('?')[1] || '').get('forceMission') || null;
    const m = buildMissions(lvl, cs, t, forceType);
    const planLessonIds = m.filter(x => x.type === 'lesson' && x.nextLesson?.id).map(x => x.nextLesson.id);
    const planConceptIds = [...getLessonConceptIds(planLessonIds)];
    const ld = loadSession(lvl);
    if (ld && !forceType && ld.planSignature === planSignature) {
      const upgraded = {
        ...ld,
        planLessonIds: ld.planLessonIds || planLessonIds,
        planConceptIds: ld.planConceptIds || planConceptIds,
        forceType: ld.forceType || null,
      };
      if (!ld.planLessonIds || !ld.planConceptIds) saveSession(upgraded);
      setSesh(upgraded);
      setMi(ld.currentMission);
      if (ld.completedMissions?.length >= m.length) setCompShow(true);
      if (ld.selectedExerciseIds?.grammar?.length > 0) setGq(ld.selectedExerciseIds.grammar);
      if (ld.selectedExerciseIds?.vocab?.length > 0) setVq(ld.selectedExerciseIds.vocab);
    } else {
      const ns = {
        dateKey: getLocalDateKey(), levelId: lvl, currentMission: 0,
        completedMissions: [], missionResults: {},
        selectedExerciseIds: { grammar: [], vocab: [] },
        planLessonIds,
        planConceptIds,
        forceType,
        planSignature,
      };
      saveSession(ns);
      setSesh(ns);
      setMi(0);
    }
    setMs(m);
    setInitDone(true);
  }, [lvl]);

  const getCm = useCallback(() => mi < ms.length ? ms[mi] : null, [mi, ms]);
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
        const found = Array.isArray(germanLessons) ? germanLessons.find(l => l.id === cm.nextLesson.id) : null;
        if (found) setFullLesson(found);
      } catch { /* empty */ }
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

  // === GRAMMAR CURRICULUM LESSON HANDLERS ===
  const hGcStart = () => {
    const cm = getCm();
    if (cm?.nextGcLesson) {
      const expandedLesson = getExpandedGrammarLesson(cm.nextGcLesson);
      setGcLesson(expandedLesson ? { ...cm.nextGcLesson, expandedLesson } : cm.nextGcLesson);
      // Find related grammar practice questions linked to this lesson's topics
      const topics = cm.nextGcLesson.linkedGrammarTopics || [];
      const allQs = grammarData[lvl] || [];
      const linked = allQs.filter(q => q.topic && topics.includes(q.topic));
      setGcTopicLinks(linked.slice(0, 5));
    }
    setGcStart(true);
  };
  const hGcComplete = () => {
    const cm = getCm();
    if (cm?.nextGcLesson?.id) {
      completeGrammarLesson(lvl, cm.nextGcLesson.id);
      refresh();
    }
    setGcDone(true);
  };
  const hGcSkip = () => advance('grammarLesson', { skipped: true });
  const hGcNext = () => advance('grammarLesson', { skipped: false });

  const hGa = (ans) => {
    const ex = grammarData[lvl]?.find((e) => e.id === gq[gi]);
    if (!ex) return;
    const correct = normalizeAnswer(ans) === normalizeAnswer(ex.answer);
    recordGrammarAnswer(ex.id, correct);
    recordAnswer(lvl, ex.id, ans, ex.answer, ex.topic || 'grammar', correct, 'grammar');
    const existing = (state.levels?.[lvl]?.grammar || []).filter((x) => x !== ex.id);
    setLevelProgress(lvl, 'grammar', [ex.id, ...existing]);
    setGr({ userAnswer: ans, answer: ex.answer, correct });
    if (correct) { setGc((c) => c + 1); } else {
      setGWrongList((prev) => [...prev, { prompt: ex.prompt, userAnswer: ans, correctAnswer: ex.answer, explanation: ex.explanation || '' }]);
    }
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
    const context = getPracticeContext(lvl, sesh, state);
    const taggedPool = lvl === 'A1' && !context.isFreePractice
      ? all.filter((x) => context.allowedLessonIds.has(getQuestionLessonId(x)))
      : all;
    const unmastered = taggedPool.filter((x) => (done.includes(x.id) ? grammarMasteryRatio(x.id) < 0.7 : true));
    const count = Math.min(cm.target, unmastered.length);

    // Prefer practice from lessons completed earlier in today's generated plan,
    // then review concepts from lessons completed before today.
    const topicPreferred = unmastered.filter(x => context.todayLessonIds.includes(getQuestionLessonId(x)));
    const reviewPool = unmastered.filter(x => !topicPreferred.includes(x));

    let selected;
    if (topicPreferred.length >= count) {
      selected = shuffleArray(topicPreferred).slice(0, count).map((x) => x.id);
    } else if (topicPreferred.length > 0) {
      selected = [
        ...shuffleArray(topicPreferred).map((x) => x.id),
        ...shuffleArray(reviewPool).slice(0, count - topicPreferred.length).map((x) => x.id)
      ];
    } else {
      selected = shuffleArray(unmastered).slice(0, count).map((x) => x.id);
    }

    const todayLessonTitles = germanLessons
      .filter(lesson => context.todayLessonIds.includes(lesson.id))
      .map(lesson => lesson.title);
    const topicLabel = todayLessonTitles.length > 0 ? todayLessonTitles.join(', ') : 'Completed lesson review';

    if (selected.length === 0) {
      setGEmpty(true);
      const ld = loadSession(lvl) || sesh;
      saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), grammar: [] }, grammarPracticeTopic: topicLabel, grammarSelectionExhausted: true });
      return;
    }
    setGEmpty(false);
    setGq(selected);
    const ld = loadSession(lvl) || sesh;
    if (ld) saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), grammar: selected }, grammarPracticeTopic: topicLabel, grammarSelectionExhausted: false });
  }, [getCm, gq.length, initDone, lvl, mi, sesh, state]);

  const hVa = (sel, correct) => {
    const word = vocabData[lvl]?.find((w) => w.id === vq[vi]);
    const isCorrect = sel === correct;
    if (word) {
      recordVocabAnswer(`${lvl}_${word.id}`, isCorrect, {
        level: lvl,
        userAnswer: sel,
        correctAnswer: correct,
        topic: word.topic || 'Vocabulary',
      });
      const existing = (state.levels?.[lvl]?.vocab || []).filter((x) => x !== word.id);
      setLevelProgress(lvl, 'vocab', [word.id, ...existing]);
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
    const context = getPracticeContext(lvl, sesh, state);
    const introduced = lvl === 'A1' && !context.isFreePractice
      ? all.filter((x) => context.allowedLessonIds.has(getWordLessonId(x)))
      : all;
    const todayWords = introduced.filter((x) => context.todayLessonIds.includes(getWordLessonId(x)));
    const reviewWords = introduced.filter((x) => !context.todayLessonIds.includes(getWordLessonId(x)));
    const unseenToday = todayWords.filter((x) => !done.includes(x.id));
    const unseenReview = reviewWords.filter((x) => !done.includes(x.id));
    const seenWordIds = new Set();
    const pool = [...unseenToday, ...unseenReview, ...todayWords, ...reviewWords].filter((word) => {
      if (seenWordIds.has(word.id)) return false;
      seenWordIds.add(word.id);
      return true;
    });
    const count = Math.min(cm.target, pool.length);
    const selected = shuffleArray(pool).slice(0, count).map((x) => x.id);
    if (selected.length === 0) {
      setVEmpty(true);
      const ld = loadSession(lvl) || sesh;
      saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), vocab: [] }, vocabSelectionExhausted: true });
      return;
    }
    setVEmpty(false);
    setVq(selected);
    const ld = loadSession(lvl) || sesh;
    if (ld) saveSession({ ...ld, selectedExerciseIds: { ...(ld.selectedExerciseIds || {}), vocab: selected }, vocabSelectionExhausted: false });
  }, [getCm, initDone, lvl, mi, sesh, state, vq.length]);

  const hLrnSk = () => advance('listening', { skipped: true });
  const hLrnN = () => {
    setLrq(0); setLrc(0); setLra({}); setLrcorr({});
    advance('listening', {});
  };
  const hLrnA = (qIdx, answer) => {
    // IMPORTANT: Use the render-computed listeningItem, NOT deriving from
    // state.levels[lvl].listening.length which will be stale or changed
    // after the first answer updates the state.
    const item = listeningItem;
    if (!item) return;
    const q = item.questions?.[qIdx];
    if (!q) return;
    const correct = q.type === 'true-false'
      ? String(answer).toLowerCase() === String(q.answer).toLowerCase()
      : String(answer).toLowerCase().trim() === String(q.answer).toLowerCase().trim();
    setLra(prev => ({ ...prev, [qIdx]: answer }));
    setLrcorr(prev => ({ ...prev, [qIdx]: correct }));
    if (correct) setLrc(c => c + 1);
    if (qIdx + 1 >= (item.questions?.length || 0)) {
      const totalQ = item.questions.length;
      // Use setLevelProgress to replace the entire array (not push which nests arrays)
      const existing = (getLevelProgress(lvl, 'listening') || []).filter((x) => x !== item.id);
      setLevelProgress(lvl, 'listening', [item.id, ...existing]);
      const cs = getState();
      const ld = cs.levels || {};
      const ll = ld[lvl] || {};
      setLrc(prev => {
        const trueCount = prev + (correct ? 1 : 0);
        updateState({ levels: { ...ld, [lvl]: { ...ll, listeningResults: { ...(ll.listeningResults || {}), [item.id]: { completed: true, correct: trueCount, total: totalQ, date: new Date().toISOString() } } } } });
        if (trueCount / Math.max(totalQ, 1) < 0.6) {
          addRemediationRecommendation({
            level: lvl,
            skill: 'listening',
            why: 'A listening result was below 60%.',
            task: 'Repeat the audio, review the transcript, and review unknown words.',
            route: `/level/${lvl}/listening`,
          });
        }
        return trueCount;
      });
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

  // Speaking speech recognition (browser-native, no audio upload)
  const startSpTranscription = () => {
    if (!spSpeechSupported) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      setSpText(full);
    };
    recognition.onerror = () => setSpIsListening(false);
    recognition.onend = () => setSpIsListening(false);
    spRecognitionRef.current = recognition;
    recognition.start();
    setSpIsListening(true);
  };

  const stopSpTranscription = () => {
    if (spRecognitionRef.current) {
      try { spRecognitionRef.current.stop(); } catch { /* empty */ }
    }
    setSpIsListening(false);
  };

  const hSpCopy = () => {
    handleSpCopyPrompt();
    setSpCopied(true);
    setTimeout(() => setSpCopied(false), 2500);
  };

  const hRdSk = () => advance('reading', { skipped: true });
  const hRdN = () => {
    setRrq(0); setRrc(0); setRra({}); setRrcorr({});
    advance('reading', {});
  };
  const hRdA = (qIdx, answer) => {
    // IMPORTANT: Use the render-computed readingItem, NOT deriving from
    // state.levels[lvl].reading.length which will be stale or changed
    // after the first answer updates the state.
    const item = readingItem;
    if (!item) return;
    const q = item.questions?.[qIdx];
    if (!q) return;
    const correct = q.type === 'true-false'
      ? String(answer).toLowerCase() === String(q.answer).toLowerCase()
      : String(answer).toLowerCase().trim() === String(q.answer).toLowerCase().trim();
    setRra(prev => ({ ...prev, [qIdx]: answer }));
    setRrcorr(prev => ({ ...prev, [qIdx]: correct }));
    if (correct) setRrc(c => c + 1);
    if (qIdx + 1 >= (item.questions?.length || 0)) {
      const totalQ = item.questions.length;
      const existing = (getLevelProgress(lvl, 'reading') || []).filter((x) => x !== item.id);
      setLevelProgress(lvl, 'reading', [item.id, ...existing]);
      const cs = getState();
      const ld = cs.levels || {};
      const ll = ld[lvl] || {};
      setRrc(prev => {
        const trueCount = prev + (correct ? 1 : 0);
        updateState({ levels: { ...ld, [lvl]: { ...ll, readingResults: { ...(ll.readingResults || {}), [item.id]: { completed: true, correct: trueCount, total: totalQ, date: new Date().toISOString() } } } } });
        if (trueCount / Math.max(totalQ, 1) < 0.6) {
          addRemediationRecommendation({
            level: lvl,
            skill: 'reading',
            why: 'A reading result was below 60%.',
            task: 'Reread the text, review target vocabulary, and retry the questions.',
            route: `/level/${lvl}/reading`,
          });
        }
        return trueCount;
      });
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
    try { navigator.clipboard.writeText(prompt); } catch { /* empty */ }
  };
  const hWt = async () => {
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
    if (aiEnabled && wtText.trim()) {
      setWtAiLoading(true);
      setWtAiError(null);
      try {
        const result = await correctWriting({
          level: lvl,
          task: (item?.prompt || '') + (item?.instructions ? ' -- ' + item.instructions : ''),
          userAnswer: wtText
        });
        setWtAiResult(result);
        if (Number(result.score) < 6) {
          addRemediationRecommendation({
            level: lvl,
            skill: 'writing',
            why: 'A writing correction scored below 6/10.',
            task: 'Review the corrected version, then rewrite with one grammar focus.',
            route: `/level/${lvl}/writing`,
          });
        }
      } catch (e) {
        setWtAiError(e.message || 'AI correction unavailable');
        setWtAiResult(null);
      }
      setWtAiLoading(false);
    }
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
    try { navigator.clipboard.writeText(prompt); } catch { /* empty */ }
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      spStreamRef.current = stream;
      spChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) spChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(spChunksRef.current, { type: 'audio/webm' });
        setSpRecBlob(URL.createObjectURL(blob));
        setSpRecState('done');
        stream.getTracks().forEach(t => t.stop());
        spStreamRef.current = null;
      };
      recorder.start();
      spMediaRecorderRef.current = recorder;
      setSpRecState('recording');
    } catch(e) {
      console.warn('Microphone access denied:', e);
    }
  };
  const stopRecording = () => {
    if (spMediaRecorderRef.current && spMediaRecorderRef.current.state === 'recording') {
      spMediaRecorderRef.current.stop();
      spMediaRecorderRef.current = null;
    }
  };

  const transcribeRecording = async () => {
    if (spRecState !== 'done') return;
    setSpTranscriptionLoading(true);
    setSpTranscriptionError(null);
    try {
      const blob = new Blob(spChunksRef.current, { type: 'audio/webm' });
      const result = await transcribeAudio(blob);
      setSpText(result.transcript);
    } catch (err) {
      setSpTranscriptionError(err.message);
    } finally {
      setSpTranscriptionLoading(false);
    }
  };
  const hSp = async () => {
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
    if (aiEnabled && spText.trim()) {
      setSpAiLoading(true);
      setSpAiError(null);
      try {
        const result = await correctSpeaking({
          level: lvl,
          task: item?.prompt || 'Speaking task',
          transcript: spText
        });
        setSpAiResult(result);
        if (Number(result.score) < 6) {
          addRemediationRecommendation({
            level: lvl,
            skill: 'speaking',
            why: 'A speaking correction scored below 6/10.',
            task: 'Practice a model answer, focus on pronunciation, and record again.',
            route: `/level/${lvl}/speaking`,
          });
        }
      } catch (e) {
        setSpAiError(e.message || 'AI feedback unavailable');
        setSpAiResult(null);
      }
      setSpAiLoading(false);
    }
    setSpDone(true);
  };
  const hSpSk = () => advance('speaking', { skipped: true });
  const hSpN = () => { setSpText(''); setSpRecBlob(null); setSpRecState('idle'); setSpeakingPrompt(null); advance('speaking', {}); };

  const hFlashcardsDone = () => {
    const ids = (dashboardSummary.vocabIds?.[lvl] || []).slice(0, cm?.target || 10);
    const existing = (getLevelProgress(lvl, 'vocab') || [])
      .flatMap(item => typeof item === 'string' ? [item] : (item?.wordIds || []));
    setLevelProgress(lvl, 'vocab', [...new Set([...existing, ...ids])]);
    recordStudyMinutes({ level: lvl, type: 'flashcards', minutes: MINUTES.flashcards, id: `daily_flashcards_${getLocalDateKey()}` });
    refresh();
    advance('flashcards', { reviewed: ids.length, minutes: MINUTES.flashcards });
  };

  const hRemediationDone = () => {
    const rec = getRemediationRecommendation(getState(), lvl);
    recordStudyMinutes({ level: lvl, type: 'remediation', minutes: MINUTES.remediation, id: `daily_remediation_${getLocalDateKey()}` });
    refresh();
    advance('remediation', { completed: true, skill: rec?.skill || 'review', improved: remCompleted.length });
  };

  const buildRemediationSession = () => {
    const cs = getState();
    const rec = getRemediationRecommendation(cs, lvl);
    const mistakes = cs.incorrectAnswers?.[lvl] || [];
    const vocabMistakes = mistakes.filter(m => ['vocab', 'vocabulary'].includes(String(m.skill || '').toLowerCase()));
    const weakIds = Object.entries(cs.vocabularyMastery || {})
      .filter(([id, m]) => id.startsWith(`${lvl}_`) && (m.incorrect > m.correct || !m.mastered))
      .map(([id]) => id.replace(`${lvl}_`, ''));
    const mistakeIds = vocabMistakes.map(m => String(m.exerciseId || '').replace(`${lvl}_`, ''));
    const poolIds = [...new Set([...mistakeIds, ...weakIds])];
    const words = poolIds
      .map(id => (vocabData[lvl] || []).find(w => String(w.id) === String(id)))
      .filter(Boolean)
      .slice(0, 10);
    const fallbackWords = words.length > 0 ? words : (vocabData[lvl] || []).slice(0, 5);
    const sourceCount = vocabMistakes.length || mistakes.length || weakIds.length;
    const skill = rec?.skill || (vocabMistakes.length ? 'Vocabulary' : 'Review');
    return {
      rec,
      skill,
      items: fallbackWords,
      source: sourceCount > 0 ? `Based on ${sourceCount} recent mistakes or weak review items` : 'Based on your current level review queue',
      target: skill === 'Vocabulary' ? 'Review weak vocabulary from your mistakes, due flashcards, and current level words.' : (rec?.task || 'Repeat the weakest recent task and review mistakes.'),
      action: skill === 'Vocabulary' ? `Start ${Math.min(fallbackWords.length, 10)}-word targeted vocab review` : 'Start targeted review task',
      result: skill === 'Vocabulary' ? 'Correct answers update vocabulary mastery and can move mistake words out of your weak queue.' : 'Completion logs remediation minutes and keeps this weak area visible for follow-up.',
      why: rec?.why || 'A recent answer or score showed a weak area.',
    };
  };

  const handleRemediationAnswer = (item, correct) => {
    if (item?.id) {
      recordVocabAnswer(`${lvl}_${item.id}`, correct, {
        level: lvl,
        userAnswer: correct ? (item.translation || item.english || 'Knew it') : 'Still learning',
        correctAnswer: item.translation || item.english || '',
        topic: item.topic || 'Vocabulary',
      });
    }
    const nextCompleted = [...remCompleted, { id: item?.id, correct }];
    setRemCompleted(nextCompleted);
    const session = buildRemediationSession();
    if (remIndex + 1 >= session.items.length) {
      setRemSummary({
        mastered: nextCompleted.filter(x => x.correct).length,
        remaining: Math.max(0, session.items.length - nextCompleted.filter(x => x.correct).length),
      });
      refresh();
      return;
    }
    setRemIndex(i => i + 1);
    refresh();
  };

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
              {r.flashcards && !r.flashcards.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} style={{ color: '#3bff9e' }} /><span>Flashcards: {r.flashcards.reviewed || 0} reviewed</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
                </div>
              )}
              {r.remediation && !r.remediation.skipped && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} style={{ color: '#ff3355' }} /><span>Remediation completed</span><CheckCircle size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
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

  // Difficulty label helper
  const getDifficulty = (item) => {
    if (!item) return { label: 'Easy', color: '#22c55e' };
    const scriptLen = item.script?.length || item.text?.length || 0;
    const qCount = item.questions?.length || 0;
    const score = scriptLen + qCount * 50;
    if (score <= 250) return { label: 'Easy', color: '#22c55e' };
    if (score <= 400) return { label: 'Medium', color: '#f97316' };
    return { label: 'Hard', color: '#ef4444' };
  };

  // Current mission items from data
  const getNextListening = (level) => {
    const s = getState();
    const completed = new Set((s.listeningCompleted?.[level] || []).map(x => typeof x === 'string' ? x : (x.id || x.exerciseId)));
    const items = (listeningData[level] || []).filter(item => !completed.has(item.id));
    // Sort by difficulty (script length + question count) so easier items come first
    items.sort((a, b) => {
      const scoreA = (a.script?.length || 0) + (a.questions?.length || 0) * 50;
      const scoreB = (b.script?.length || 0) + (b.questions?.length || 0) * 50;
      return scoreA - scoreB;
    });
    return items[0] || (listeningData[level] || [])[0] || null;
  };
  const getNextReading = (level) => {
    const s = getState();
    const completed = new Set((s.readingCompleted?.[level] || []).map(x => typeof x === 'string' ? x : (x.id || x.exerciseId)));
    const items = (readingData[level] || []).filter(item => !completed.has(item.id));
    items.sort((a, b) => {
      const scoreA = (a.text?.length || 0) + (a.questions?.length || 0) * 50;
      const scoreB = (b.text?.length || 0) + (b.questions?.length || 0) * 50;
      return scoreA - scoreB;
    });
    return items[0] || (readingData[level] || [])[0] || null;
  };
  const getNextWriting = (level) => {
    const s = getState();
    const completed = new Set((s.levels?.[level]?.writing || []).map(x => x.id || x.exerciseId || x));
    const data = writingData[level] || [];
    return data.find(item => !completed.has(item.id)) || data[0] || null;
  };
  const getNextSpeaking = (level) => {
    const s = getState();
    const completed = new Set((s.levels?.[level]?.speaking || []).map(x => x.id || x.exerciseId || x));
    const data = speakingData[level] || [];
    return data.find(item => !completed.has(item.id)) || data[0] || null;
  };
  const listeningItem = cm.type === 'listening' ? getNextListening(lvl) : null;
  const readingItem = cm.type === 'reading' ? getNextReading(lvl) : null;
  const writingItem = cm.type === 'writing' ? getNextWriting(lvl) : null;
  const speakingItem = cm.type === 'speaking' ? getNextSpeaking(lvl) : null;

  const listeningDone = lrnDone || ((listeningItem?.questions?.length || 0) > 0 && lrq >= (listeningItem?.questions?.length || 0));
  const readingDone = rdDone || ((readingItem?.questions?.length || 0) > 0 && rrq >= (readingItem?.questions?.length || 0));

  // Style objects
  const sCard = { background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1rem' };
  const sBtn = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' };
  const sBp = { padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' };
  const sBs = { padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' };
  const tag = (bg) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', background: bg || 'var(--bg-secondary)', color: 'var(--text-secondary)' });
  const so = { display: 'block', width: '100%', padding: '0.7rem 1rem', marginBottom: '0.4rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' };
  const sos = { display: 'block', width: '100%', padding: '0.7rem 1rem', marginBottom: '0.4rem', borderRadius: '8px', border: '2px solid var(--accent)', background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' };

  return (
    <LevelLock levelId={lvl}><style>{'@keyframes dmp-spin{to{transform:rotate(360deg)}}@keyframes dmp-pulse{0%,100%{opacity:1}50%{opacity:0.4}}'}</style>
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
          <div aria-label="Daily plan mission list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
            {ms.map((mission, idx) => (
              <span key={`${mission.type}_${idx}`} style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.45rem',
                borderRadius: '999px',
                background: idx === mi ? 'rgba(0,240,255,0.12)' : 'var(--bg-hover)',
                color: idx === mi ? 'var(--accent)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}>
                {mission.label}
              </span>
            ))}
          </div>
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
                      {toArray(fullLesson.examples).slice(0, 6).map((e, i) => <li key={i}>{e}</li>)}
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
                      {toArray(fullLesson.vocabulary).slice(0, 6).map((v, i) => (
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
                      {toArray(fullLesson.guidedPractice).slice(0, 3).map((p, i) => (
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

      {/* GRAMMAR CURRICULUM LESSON */}
      {cm.type === 'grammarLesson' && !gcDone && (
        <div style={sCard}>
          {!gcStart ? (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {cm.nextGcLesson?.title || 'Grammar Lesson'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Unit {cm.nextGcLesson?.unit} &middot; {cm.nextGcLesson?.topic}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {cm.nextGcLesson?.explanation?.substring(0, 120)}...
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={sBp} onClick={hGcStart}><Play size={16} /> Study Grammar Lesson</button>
                <button style={sBtn} onClick={hGcSkip}><SkipForward size={14} /> Skip for now</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {gcLesson?.expandedLesson?.title || gcLesson?.title || 'Grammar Lesson'}
              </h3>
              <span style={tag('rgba(168,85,247,0.15)')}>
                Unit {gcLesson?.unit} &middot; {gcLesson?.expandedLesson ? `${gcLesson.topic} linked to ${gcLesson.expandedLesson.id}` : gcLesson?.topic}
                {gcLesson?.expandedLesson?.estimatedMinutes ? ` · ${gcLesson.expandedLesson.estimatedMinutes} min` : ''}
              </span>

              {/* Explanation */}
              {(gcLesson?.expandedLesson?.explanation || gcLesson?.explanation) && (
                <div style={{ background: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '6px', marginTop: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--accent)' }}>Explanation:</strong>
                  <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{gcLesson?.expandedLesson?.explanation || gcLesson.explanation}</p>
                </div>
              )}

              {/* Rules */}
              {(gcLesson?.expandedLesson?.grammarFocus || gcLesson?.rules?.length > 0) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rules:</strong>
                  {gcLesson?.expandedLesson?.grammarFocus ? (
                    <p style={{ marginTop: '0.3rem', color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.85rem', whiteSpace: 'pre-line' }}>{gcLesson.expandedLesson.grammarFocus}</p>
                  ) : (
                    <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {toArray(gcLesson.rules).map((r, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{r}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {/* Forms and tables from expanded lesson */}
              {gcLesson?.expandedLesson?.formsTables?.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Forms and Tables:</strong>
                  {gcLesson.expandedLesson.formsTables.map((table, i) => (
                    <div key={i} style={{ marginTop: '0.4rem', padding: '0.5rem 0.6rem', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
                      {table.title && <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', fontSize: '0.82rem' }}>{table.title}</p>}
                      {toArray(table.rows).map((row, j) => (
                        <div key={j} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.25rem 0', borderTop: j > 0 ? '1px solid var(--border)' : 'none', fontSize: '0.82rem' }}>
                          {toArray(row).map((cell, k) => (
                            <span key={k} style={{ color: k === 0 ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: k === 0 ? 700 : 400 }}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Examples */}
              {(gcLesson?.expandedLesson?.examples?.length > 0 || gcLesson?.examples?.length > 0) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Examples:</strong>
                  <div style={{ marginTop: '0.3rem' }}>
                    {toArray(gcLesson?.expandedLesson?.examples || gcLesson.examples).slice(0, 6).map((ex, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: i % 2 === 0 ? 'var(--bg-secondary)' : 'transparent', borderRadius: '4px', marginBottom: '0.2rem', fontSize: '0.85rem' }}>
                        {typeof ex === 'object' && (ex.de || ex.german) ? (
                          <>
                            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{ex.de || ex.german}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{ex.en || ex.translation}</span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-primary)' }}>{lessonText(ex)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pronunciation from expanded lesson */}
              {gcLesson?.expandedLesson?.pronunciationNotes?.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#06b6d4' }}>Pronunciation Guide:</strong>
                  <ul style={{ marginTop: '0.3rem', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {toArray(gcLesson.expandedLesson.pronunciationNotes).map((note, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{lessonText(note)}</li>)}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {((gcLesson?.expandedLesson?.commonMistakes || gcLesson?.commonMistakes || gcLesson?.mistakes)?.length > 0) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>Common Mistakes:</strong>
                  {toArray(gcLesson?.expandedLesson?.commonMistakes || gcLesson.commonMistakes || gcLesson.mistakes).slice(0, 5).map((m, i) => (
                    <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.08)', borderRadius: '6px', marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      {typeof m === 'object' && (m.wrong || m.correct) ? (
                        <>
                          <div style={{ color: '#ef4444', marginBottom: '0.1rem' }}>Wrong: "{m.wrong}"</div>
                          <div style={{ color: '#22c55e', marginBottom: '0.1rem' }}>Correct: "{m.correct}"</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.explanation}</div>
                        </>
                      ) : (
                        <div style={{ color: 'var(--text-secondary)' }}>{lessonText(m)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mini Practice */}
              {((gcLesson?.expandedLesson?.miniDrills || gcLesson?.miniPractice || gcLesson?.practice)?.length > 0) && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Quick Practice:</strong>
                  {toArray(gcLesson?.expandedLesson?.miniDrills || gcLesson.miniPractice || gcLesson.practice).slice(0, 5).map((p, i) => (
                    <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'rgba(168,85,247,0.06)', borderRadius: '6px', marginTop: '0.3rem', fontSize: '0.85rem' }}>
                      <p style={{ color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{lessonText(p.prompt || p)}</p>
                      <p style={{ color: '#059669', fontStyle: 'italic' }}>Answer: {p.answer}</p>
                      {p.explanation && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Linked grammar practice */}
              {gcTopicLinks?.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Related Grammar Practice:</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', marginBottom: '0.3rem' }}>
                    These practice questions relate to today&apos;s lesson topic(s).
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {(gcLesson.linkedGrammarTopics || gcLesson.expandedLesson?.linkedPracticeConceptTags || []).map((t, i) => (
                      <span key={i} style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: '0.75rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button style={sBp} onClick={hGcComplete}><CheckCircle size={16} /> Mark Lesson Complete</button>
                <button style={sBtn} onClick={hGcSkip}><SkipForward size={14} /> Skip for now</button>
              </div>
            </div>
          )}
        </div>
      )}
      {cm.type === 'grammarLesson' && gcDone && (
        <div style={{ ...sCard, textAlign: 'center' }}>
          <BookMarked size={36} style={{ color: '#a855f7', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#a855f7', marginBottom: '0.5rem' }}>Grammar Lesson Complete!</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{gcLesson?.title} completed.</p>
          <button style={sBp} onClick={hGcNext}>Next Mission <ChevronRight size={16} /></button>
        </div>
      )}

      {/* GRAMMAR PRACTICE */}
      {cm.type === 'grammar' && (() => {
        const ex = grammarData[lvl]?.find((e) => e.id === gq[gi]);
        if (gEmpty) {
          return (
            <div style={sCard}>
              <Lightbulb size={28} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>No aligned grammar questions yet</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Today's plan will not test grammar from lessons you have not studied. Continue with review, flashcards, or the next mission.
              </p>
              <button style={{ ...sBp, marginTop: '0.75rem' }} onClick={() => advance('grammar', { total: 0, correct: 0, alignedOnly: true })}>Next Mission <ChevronRight size={16} /></button>
            </div>
          );
        }
        if (!ex && gq.length > 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Loading grammar...</p></div>;
        const gcCompletedIds = getCompletedGrammarLessons(lvl);
        let practicingTopic = sesh?.grammarPracticeTopic || '';
        if (!practicingTopic && gcCompletedIds.length > 0) {
          const lastGc = (grammarCurriculum[lvl] || []).find(g => g.id === gcCompletedIds[gcCompletedIds.length - 1]);
          if (lastGc) practicingTopic = lastGc.title;
        }
        if (!ex && gq.length === 0) return <div style={sCard}><p style={{ color: 'var(--text-muted)' }}>Selecting questions...</p></div>;
        if (gw >= gq.length && gq.length > 0) {
          const wr = gw - gc;
          return (
            <div style={sCard}>
              {!gReviewMode ? (
                <div style={{ textAlign: 'center' }}>
                  <BarChart3 size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.5rem' }}>Grammar Mission Complete</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: gc >= gq.length * 0.7 ? '#22c55e' : '#f59e0b', marginBottom: '0.5rem' }}>{gc}/{gq.length}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Correct: {gc} | Wrong: {wr}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                    {gWrongList.length > 0 && (
                      <button style={{ ...sBtn, width: '100%', maxWidth: '250px' }} onClick={() => setGReviewMode(true)}>
                        <FileText size={14} /> Review Mistakes ({gWrongList.length})
                      </button>
                    )}
                    <button style={sBp} onClick={() => { advance('grammar', { total: gq.length, correct: gc, wrong: wr }); setGi(0); setGq([]); setGw(0); setGc(0); setGr(null); setGa(''); setGWrongList([]); setGReviewMode(false); }}>Next Mission <ChevronRight size={16} /></button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent)' }}>Mistake Review</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{gc}/{gq.length} correct</span>
                  </div>
                  {gWrongList.length === 0 ? (
                    <p style={{ color: '#22c55e', textAlign: 'center', padding: '1rem' }}>No mistakes. Great job!</p>
                  ) : (
                    gWrongList.map((item, i) => (
                      <div key={i} style={{ background: 'rgba(239,68,68,0.08)', padding: '0.7rem', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        <p style={{ fontWeight: 500, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>{item.prompt}</p>
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.15rem' }}>Your answer: <strong>{item.userAnswer}</strong></p>
                        <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: '0.15rem' }}>Correct: <strong>{item.correctAnswer}</strong></p>
                        {item.explanation && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>{item.explanation}</p>}
                      </div>
                    ))
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <button style={sBp} onClick={() => setGReviewMode(false)}><ChevronLeft size={14} /> Back to Summary</button>
                  </div>
                </div>
              )}
            </div>
          );
        }
        const hasAns = gr !== null;
        
        const optionTypes = ['mcq', 'article-select', 'case-select', 'conjugation'];
        // Defensive: check if exercise actually has options; if not, always render text input
        const hasOptions = Array.isArray(ex.options) && ex.options.length > 0;
        const isTextType = !hasOptions;
        const typeColor = isTextType ? 'rgba(59,130,246,0.15)' : optionTypes.includes(ex.type) ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)';
        const recommendedLessonId = ex.taughtInLessonId || ex.remediationLessonId;
        const recommendedLesson = recommendedLessonId ? germanLessons.find((lesson) => lesson.id === recommendedLessonId) : null;
        const completedLessonIds = getCompletedLessons(lvl);
        const shouldRecommendLesson = Boolean(recommendedLesson && recommendedLessonId && !completedLessonIds.includes(recommendedLessonId));
        return (
          <div style={sCard}>
            {practicingTopic && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(168,85,247,0.12)', color: '#a855f7', fontSize: '0.75rem', fontWeight: 600 }}>
                  Practicing: {practicingTopic}
                </span>
              </div>
            )}
            {shouldRecommendLesson && (
              <div style={{ padding: '0.65rem 0.8rem', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--text-secondary)' }}>
                  <Lightbulb size={14} style={{ color: '#f59e0b', marginRight: '0.35rem', verticalAlign: '-2px' }} />
                  You should study this lesson first: <Link to={`/level/${lvl}/lessons/${recommendedLessonId}`} style={{ color: '#f59e0b', fontWeight: 700 }}>{recommendedLesson.title}</Link>.
                </p>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={tag(typeColor)}>
                {(TYPE_LABELS[ex.type] || ex.type)} &middot; {(ex.topic || 'General')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question {gw + 1} of {gq.length}</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem', lineHeight: '1.5' }}>{ex.prompt}</p>
            {isTextType ? (
              <div>
                <input type='text' style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} value={ga} onChange={(e) => setGa(e.target.value)} placeholder='Type your answer...' disabled={hasAns} onKeyDown={(e) => { if (e.key === 'Enter' && !hasAns && ga.trim()) hGa(ga.trim()); }} />
                {!hasAns && <GermanCharHelper onInsert={(c) => setGa(prev => prev + c)} compact style={{ marginTop: '0.25rem' }} />}
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
                {ex.explanation && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.3rem' }}>{ex.explanation}</p>}
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
        if (vEmpty) {
          return (
            <div style={sCard}>
              <BookOpen size={28} style={{ color: '#3bff9e', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>No introduced vocabulary due</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The daily plan is avoiding words from lessons you have not studied. Use flashcards or continue to the next mission.
              </p>
              <button style={{ ...sBp, marginTop: '0.75rem' }} onClick={() => advance('vocabulary', { total: 0, correct: 0, alignedOnly: true })}>Next Mission <ChevronRight size={16} /></button>
            </div>
          );
        }
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

      {/* LISTENING MISSION */}
      {cm.type === 'listening' && listeningDone && (() => {
        const qs = listeningItem?.questions || [];
        const total = qs.length;
        const correct = Object.values(lrcorr || {}).filter(Boolean).length;
        const wrong = total - correct;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <Headphones size={36} style={{ color: '#06b6d4', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#06b6d4', marginBottom: '0.5rem' }}>Listening Complete!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{correct} / {total} correct</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{wrong > 0 ? wrong + ' incorrect' : 'Perfect score!'}</p>
            <button style={sBp} onClick={hLrnN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}
      {cm.type === 'listening' && !listeningDone && (
        <div style={sCard}>
          {!listeningItem || (listeningItem.questions || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <Headphones size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No listening exercises available for {lvl} yet.</p>
              <button style={sBtn} onClick={hLrnSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {listeningItem.title}
                </h3>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600, background: (() => { const d = getDifficulty(listeningItem); return d.color + '22'; })(), color: getDifficulty(listeningItem).color }}>
                  {getDifficulty(listeningItem).label}
                </span>
              </div>

              {/* TTS Read Aloud */}
              <div style={{ marginBottom: '1rem' }}>
                <button
                  style={lrnTTS ? { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'not-allowed', padding: '0.5rem 0.9rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', opacity: 0.6 } : { ...sBtn }}
                  onClick={hLrnTTS}
                  disabled={lrnTTS}
                >
                  {lrnTTS ? (
                    <><Square size={14} /> Speaking...</>
                  ) : (
                    <><Volume2 size={14} /> Read Script Aloud (TTS)</>
                  )}
                </button>
                {ttsAvailable && (
                  <button
                    style={{ ...sBtn, marginLeft: '0.5rem' }}
                    onClick={() => { window.speechSynthesis.cancel(); setLrnTTS(false); }}
                  >
                    <Square size={14} /> Stop
                  </button>
                )}
              </div>

              {/* Script block */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.06)', borderRadius: '8px',
                padding: '1rem', marginBottom: '1rem',
                border: '1px solid rgba(6, 182, 212, 0.15)',
                maxHeight: '200px', overflowY: 'auto'
              }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {listeningItem.script}
                </p>
              </div>

              {/* Questions */}
              {(listeningItem.questions || []).length > 0 && (() => {
                const qs = listeningItem.questions;
                if (lrq >= qs.length) return null;
                const q = qs[lrq];
                const ans = lra?.[lrq];
                const correct = lrcorr?.[lrq];
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', fontWeight: 600 }}>
                        {q.type === 'true-false' ? 'True/False' : 'Multiple Choice'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lrq + 1} of {qs.length}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      {q.question}
                    </p>
                    {ans !== undefined ? (
                      <div style={{
                        padding: '0.6rem 0.8rem', borderRadius: '8px',
                        background: correct ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        marginBottom: '0.75rem', fontSize: '0.85rem'
                      }}>
                        {correct ? (
                          <span style={{ color: '#22c55e', fontWeight: 600 }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} /> Correct!</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 600 }}><XCircle size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} /> Incorrect. Answer: {q.answer === 'true' ? 'True' : q.answer === 'false' ? 'False' : q.answer}</span>
                        )}
                      </div>
                    ) : (
                      <div>
                        {q.type === 'true-false' ? (
                          ['true', 'false'].map((opt) => {
                            const label = opt === 'true' ? 'Richtig' : 'Falsch';
                            return (
                              <button
                                key={opt}
                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'block', width: '100%', marginBottom: '0.4rem', transition: 'all 0.15s' }}
                                onClick={() => hLrnA(lrq, opt)}
                              >
                                {label}
                              </button>
                            );
                          })
                        ) : (
                          (q.options || []).map((opt, i) => (
                            <button
                              key={i}
                              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'block', width: '100%', marginBottom: '0.4rem', transition: 'all 0.15s' }}
                              onClick={() => hLrnA(lrq, opt)}
                            >
                              {opt}
                            </button>
                          ))
                        )}
                        {(q.options || []).length === 0 && q.type !== 'true-false' && (
                          <div style={{ padding: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Unsupported question type.
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {ans === undefined && (
                        <button style={sBtn} onClick={hLrnSk}><SkipForward size={14} /> Skip for now</button>
                      )}
                      {ans !== undefined && lrq + 1 < qs.length && (
                        <button style={sBp} onClick={() => setLrq(lrq + 1)}>
                          Next Question <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
              {(!listeningItem.questions || listeningItem.questions.length === 0) && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={sBp} onClick={() => { const existing = (getLevelProgress(lvl, 'listening') || []).filter((x) => x !== listeningItem.id); setLevelProgress(lvl, 'listening', [listeningItem.id, ...existing]); completeListening(lvl); refresh(); setLrnDone(true); }}><CheckCircle size={16} /> Mark Complete</button>
                  <button style={sBtn} onClick={hLrnSk}><SkipForward size={14} /> Skip for now</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* READING MISSION */}
      {cm.type === 'reading' && readingDone && (() => {
        const qs = readingItem?.questions || [];
        const total = qs.length;
        const correct = Object.values(rrcorr || {}).filter(Boolean).length;
        const wrong = total - correct;
        return (
          <div style={{ ...sCard, textAlign: 'center' }}>
            <FileText size={36} style={{ color: '#a78bfa', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#a78bfa', marginBottom: '0.5rem' }}>Reading Complete!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{correct} / {total} correct</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{wrong > 0 ? wrong + ' incorrect' : 'Perfect score!'}</p>
            <button style={sBp} onClick={hRdN}>Next Mission <ChevronRight size={16} /></button>
          </div>
        );
      })()}
      {cm.type === 'reading' && !readingDone && (
        <div style={sCard}>
          {!readingItem || (readingItem.questions || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No reading exercises available for {lvl} yet.</p>
              <button style={sBtn} onClick={hRdSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {readingItem.title}
              </h3>

              {/* Reading passage */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.06)', borderRadius: '8px',
                padding: '1rem', marginBottom: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                maxHeight: '250px', overflowY: 'auto'
              }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {readingItem.text}
                </p>
              </div>

              {/* Questions */}
              {(readingItem.questions || []).length > 0 && (() => {
                const qs = readingItem.questions;
                if (rrq >= qs.length) return null;
                const q = qs[rrq];
                const ans = rra?.[rrq];
                const correct = rrcorr?.[rrq];
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontWeight: 600 }}>
                        {q.type === 'true-false' ? 'True/False' : 'Multiple Choice'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rrq + 1} of {qs.length}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      {q.question}
                    </p>
                    {ans !== undefined ? (
                      <div>
                        <div style={{
                          padding: '0.6rem 0.8rem', borderRadius: '8px',
                          background: correct ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          marginBottom: '0.5rem', fontSize: '0.85rem'
                        }}>
                          {correct ? (
                            <span style={{ color: '#22c55e', fontWeight: 600 }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} /> Correct!</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}><XCircle size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} /> Incorrect. Answer: {q.answer === 'true' ? 'True' : q.answer === 'false' ? 'False' : q.answer}</span>
                          )}
                        </div>
                        {q.explanation && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {q.type === 'true-false' ? (
                          ['true', 'false'].map((opt) => {
                            const label = opt === 'true' ? 'Richtig' : 'Falsch';
                            return (
                              <button
                                key={opt}
                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'block', width: '100%', marginBottom: '0.4rem', transition: 'all 0.15s' }}
                                onClick={() => hRdA(rrq, opt)}
                              >
                                {label}
                              </button>
                            );
                          })
                        ) : (
                          (q.options || []).map((opt, i) => (
                            <button
                              key={i}
                              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', display: 'block', width: '100%', marginBottom: '0.4rem', transition: 'all 0.15s' }}
                              onClick={() => hRdA(rrq, opt)}
                            >
                              {opt}
                            </button>
                          ))
                        )}
                        {(q.options || []).length === 0 && q.type !== 'true-false' && (
                          <div style={{ padding: '0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Unsupported question type.
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {ans === undefined && (
                        <button style={sBtn} onClick={hRdSk}><SkipForward size={14} /> Skip for now</button>
                      )}
                      {ans !== undefined && rrq + 1 < qs.length && (
                        <button style={sBp} onClick={() => setRrq(rrq + 1)}>
                          Next Question <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
              {(!readingItem.questions || readingItem.questions.length === 0) && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={sBp} onClick={() => { const existing = (getLevelProgress(lvl, 'reading') || []).filter((x) => x !== readingItem.id); setLevelProgress(lvl, 'reading', [readingItem.id, ...existing]); completeReading(lvl); refresh(); setRdDone(true); }}><CheckCircle size={16} /> Mark Complete</button>
                  <button style={sBtn} onClick={hRdSk}><SkipForward size={14} /> Skip for now</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FLASHCARD MISSION */}
      {cm.type === 'flashcards' && (
        <div style={sCard}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <BookOpen size={40} style={{ color: '#3bff9e', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3bff9e', marginBottom: '0.25rem' }}>Flashcards in Today&apos;s Plan</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Review due, weak, or track-relevant vocabulary before adding more new words. This counts toward study minutes and vocabulary progress.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/level/${lvl}/vocabulary/flashcards`} style={{ ...sBp, textDecoration: 'none' }}>
                <BookOpen size={16} /> Open Flashcards
              </Link>
              <button style={sBp} onClick={hFlashcardsDone}>
                <CheckCircle size={16} /> Mark Flashcards Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMEDIATION MISSION */}
      {cm.type === 'remediation' && (() => {
        const session = buildRemediationSession();
        const item = session.items[remIndex];
        return (
          <div style={sCard}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <RefreshCw size={40} style={{ color: '#ff3355', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ff3355', marginBottom: '0.25rem' }}>Targeted Remediation</h3>
              <div style={{ display: 'grid', gap: '0.55rem', textAlign: 'left', margin: '1rem 0' }}>
                {[
                  ['Weak area', session.skill],
                  ['Source', session.source],
                  ['Target', session.target],
                  ['Action', session.action],
                  ['Result', session.result],
                  ['Progress', `${remCompleted.length}/${session.items.length || 1} completed`],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>{value}</div>
                  </div>
                ))}
              </div>
              {!remStarted && !remSummary && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button style={sBp} onClick={() => setRemStarted(true)}>
                    <RefreshCw size={16} /> Start Remediation
                  </button>
                  <Link to={session.rec?.route || `/level/${lvl}`} style={{ ...sBp, textDecoration: 'none' }}>
                    <BookOpen size={16} /> Open related practice
                  </Link>
                </div>
              )}
              {remStarted && !remSummary && item && (
                <div style={{ textAlign: 'left', background: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.18)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#ff8aa0', marginBottom: '0.4rem' }}>Selected because it appears in mistakes, weak mastery, due flashcards, or your current {lvl} review queue.</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.article ? `${item.article} ` : ''}{item.word || item.german}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{item.translation || item.english}</div>
                  {item.example && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>&quot;{item.example}&quot;</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                    <button style={sBp} onClick={() => handleRemediationAnswer(item, true)}>
                      <CheckCircle size={16} /> I know this
                    </button>
                    <button style={sBtn} onClick={() => handleRemediationAnswer(item, false)}>
                      <XCircle size={16} /> Still weak
                    </button>
                  </div>
                </div>
              )}
              {remSummary && (
                <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#3bff9e', marginBottom: '0.5rem' }}>Remediation summary</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mastered items: {remSummary.mastered}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Remaining weak items: {remSummary.remaining}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.9rem' }}>Next recommended task: review these words again in Vocab Review or flashcards.</p>
                  <button style={sBp} onClick={hRemediationDone}>
                    <CheckCircle size={16} /> Complete Remediation
                  </button>
                </div>
              )}
              {!item && !remSummary && (
                <button style={sBp} onClick={hRemediationDone}>
                  <CheckCircle size={16} /> Mark Remediation Done
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* WRITING MISSION */}
      {cm.type === 'writing' && !wtDone && (
        <div style={sCard}>
          {!writingItem ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <PenTool size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No writing tasks available for {lvl} yet.</p>
              <button style={sBtn} onClick={hWtSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {writingItem.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                {writingItem.prompt}
              </p>
              {writingItem.instructions && (
                <div style={{ background: 'rgba(236, 72, 153, 0.06)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Instructions:</strong> {writingItem.instructions}
                </div>
              )}
              {writingItem.wordLimit && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Word limit: {writingItem.wordLimit} words
                </p>
              )}
              {toArray(writingItem.tips).length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ec4899', marginBottom: '0.25rem' }}>Tips:</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {toArray(writingItem.tips).slice(0, 4).map((tip, i) => <li key={i} style={{ marginBottom: '0.15rem' }}>{tip}</li>)}
                  </ul>
                </div>
              )}
              <textarea
                style={{ width: '100%', minHeight: '120px', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                value={wtText}
                onChange={(e) => setWtText(e.target.value)}
                placeholder='Write your response in German...'
              />
              <GermanCharHelper onInsert={(c) => setWtText(prev => prev + c)} compact style={{ marginTop: '0.25rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button style={sBp} onClick={hWt} disabled={!wtText.trim()}><CheckCircle size={16} /> Submit Writing</button>
                <button style={sBtn} onClick={hWtSk}><SkipForward size={14} /> Skip for now</button>
              </div>
            </div>
          )}
        </div>
      )}
      {cm.type === 'writing' && wtDone && (() => {
        const wr = wtAiResult;
        const loading = wtAiLoading;
        const err = wtAiError;
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
                <RefreshCw size={24} style={{ color: 'var(--accent)', animation: 'dmp-spin 1s linear infinite', marginBottom: '0.5rem' }} />
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
      })()}

      {/* SPEAKING MISSION */}
      {cm.type === 'speaking' && !spDone && (
        <div style={sCard}>
          {!speakingItem ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <Mic size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No speaking tasks available for {lvl} yet.</p>
              <button style={sBtn} onClick={hSpSk}><SkipForward size={14} /> Skip for now</button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {speakingItem.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                {speakingItem.prompt}
              </p>
              {speakingItem.instructions && (
                <div style={{ background: 'rgba(249, 115, 22, 0.06)', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Instructions:</strong> {speakingItem.instructions}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {speakingItem.prepTime && <span>Prep time: {speakingItem.prepTime}</span>}
                {speakingItem.talkTime && <span>Talk time: {speakingItem.talkTime}</span>}
              </div>

              {toArray(speakingItem.tips).length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f97316', marginBottom: '0.25rem' }}>
                    <Lightbulb size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                    Tips
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {toArray(speakingItem.tips).slice(0, 3).map((tip, i) => <li key={i} style={{ marginBottom: '0.15rem' }}>{tip}</li>)}
                  </ul>
                </div>
              )}

              {toArray(speakingItem.usefulPhrases).length > 0 && (
                <div style={{ marginBottom: '0.75rem', background: 'rgba(249, 115, 22, 0.04)', padding: '0.5rem 0.8rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f97316', marginBottom: '0.25rem' }}>Useful Phrases:</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {toArray(speakingItem.usefulPhrases).slice(0, 5).map((ph, i) => (
                      <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' }}>{ph}</span>
                    ))}
                  </div>
                </div>
              )}

              {ttsAvailable && typeof MediaRecorder !== 'undefined' && (
                <div style={{ marginBottom: '0.75rem' }}>
                  {spRecState === 'idle' && (
                    <button style={sBp} onClick={startRecording}><Mic size={14} /> Start Recording</button>
                  )}
                  {spRecState === 'recording' && (
                    <button style={{ ...sBp, background: '#ef4444', color: '#fff' }} onClick={stopRecording}>
                      <Square size={14} /> Stop Recording
                    </button>
                  )}
                  {spRecState !== 'idle' && spRecState !== 'recording' && spRecBlob && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <audio controls src={spRecBlob} style={{ width: '100%', height: '36px' }} />
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Recording saved. You can also type your answer below.</p>
                    </div>
                  )}
                  {spRecState === 'done' && spRecBlob && (
                    <div className="mt-2 flex gap-2 items-center">
                      <button
                        onClick={transcribeRecording}
                        disabled={spTranscriptionLoading}
                        style={{ ...sBp, fontSize: '0.8rem' }}>
                        {spTranscriptionLoading ? (
                          <><RefreshCw size={14} style={{ animation: 'dmp-spin 1s linear infinite' }} /> Transcribing...</>
                        ) : (
                          <><Sparkles size={14} /> Transcribe Recording (Whisper AI)</>
                        )}
                      </button>
                      {spTranscriptionError && (
                        <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{spTranscriptionError}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              {(!ttsAvailable || typeof MediaRecorder === 'undefined') && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Audio recording is not available in your browser. Please type your response below.
                </p>
              )}

              {/* Speech-to-Text: browser-native transcription */}
              {spSpeechSupported ? (
                <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {!spIsListening ? (
                    <button style={{ ...sBp, fontSize: '0.8rem' }} onClick={startSpTranscription}>
                      <Volume2 size={14} /> Start Transcription
                    </button>
                  ) : (
                    <button style={{ ...sBp, background: '#ef4444', color: '#fff', fontSize: '0.8rem' }} onClick={stopSpTranscription}>
                      <Square size={14} /> Stop Transcription
                    </button>
                  )}
                  {spIsListening && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', animation: 'dmp-pulse 1s infinite' }}>
                      Listening...
                    </span>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Speech recognition is not supported in this browser. You can type or paste your transcript.
                </p>
              )}
              {spIsListening && (
                <p style={{ fontSize: '0.7rem', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  Speaking in German. Your transcript is sent for AI feedback only when you click Submit Response.
                </p>
              )}

              <textarea
                style={{ width: '100%', minHeight: '100px', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                value={spText}
                onChange={(e) => setSpText(e.target.value)}
                placeholder='Write your spoken answer or paste your transcription here.'
              />
              <GermanCharHelper onInsert={(c) => setSpText(prev => prev + c)} compact style={{ marginTop: '0.25rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button style={sBp} onClick={hSp} disabled={!spText.trim()}><CheckCircle size={16} /> Submit Response</button>
                <button style={sBtn} onClick={hSpSk}><SkipForward size={14} /> Skip for now</button>
              </div>
            </div>
          )}
        </div>
      )}
      {cm.type === 'speaking' && spDone && (() => {
        const sr = spAiResult;
        const loading = spAiLoading;
        const err = spAiError;
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
                <RefreshCw size={24} style={{ color: 'var(--accent)', animation: 'dmp-spin 1s linear infinite', marginBottom: '0.5rem' }} />
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
      })()}
    </div>
  </LevelLock>
);
}
