import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, SectionHeader, Card, StatCard, ProgressCard, SkillCard, ActionCard, Button, LevelBadge, ProgressRing, FeatureCard, Badge } from '../components/ui';
import { getState, getReadinessScores, getCompletedLessons, getWeakTopics, getDueVocabWords, isLevelUnlocked, isExamUnlocked, getCompletedGrammarLessons } from '../utils/store';
import { collectActivityDates, calculateCurrentStreak, getLast7DaysActivity, getWeeklyActiveCount, getBestWeeklyActivity, getMostRecentActivity, getActivityRoute, formatRelativeTime, getLocalDateKey } from '../utils/activityStreak';
import levelsData from '../data/levels.json';
import dashboardSummary from '../data/dashboardSummary.json';
import grammarCurriculum from '../data/grammarCurriculum.json';
import { Zap, Target, BarChart3, Award, TrendingUp, ChevronRight, ChevronDown, Play, BookOpen, Mic, Headphones, PenTool, FileText, ClipboardCheck, AlertTriangle, BookMarked, GraduationCap, CheckCircle, Clock, ArrowRight, ListOrdered, FlaskConical, MessageSquare, Flame, Lightbulb, Settings, Crosshair, CalendarCheck, Stethoscope } from 'lucide-react';
import StudyGoalTracker, { getStudyGoal } from '../components/StudyGoalTracker';
import DebugProgressPanel from '../components/DebugProgressPanel';
import AuthPanel from '../components/AuthPanel';
import { buildAdaptiveTargets, getGoalEstimate, calculateTodayMinutes as calculateAdaptiveTodayMinutes, getRemediationRecommendation } from '../utils/adaptivePlan';

const allLessons = Object.values(dashboardSummary.lessonSummaries || {}).flat();

// Skill area definitions used for weakness-based daily task ranking
// Lower completion ratio = higher priority
const SKILL_AREAS = [
  { id: 'lesson',    name: 'Lessons',    icon: FileText,       linkSuffix: 'lessons',    label: 'Complete 1 lesson',            getCount: (s, lvl) => getCompletedLessons(lvl).length,                     getTotal: (lvl) => dashboardSummary.lessonCounts?.[lvl] || 25 },
  { id: 'grammarLesson', name: 'Grammar Lessons', icon: BookMarked, linkSuffix: 'daily', label: 'Study 1 grammar lesson', getCount: (s, lvl) => getCompletedGrammarLessons(lvl).length, getTotal: (lvl) => (grammarCurriculum[lvl] || []).length || 20 },
  { id: 'grammar',   name: 'Grammar',    icon: BarChart3,      linkSuffix: 'grammar',    label: 'Complete 1 grammar unit',      getCount: (s, lvl) => (s.levels?.[lvl]?.grammar?.length || 0),            getTotal: (lvl) => dashboardSummary.grammarCounts?.[lvl] || 200 },
  { id: 'vocab',     name: 'Vocabulary', icon: BookOpen,       linkSuffix: 'vocabulary', label: 'Review 20 vocabulary words',    getCount: (s, lvl) => (s.levels?.[lvl]?.vocab?.length || 0),             getTotal: (lvl) => dashboardSummary.vocabCounts?.[lvl] || 500 },
  { id: 'reading',   name: 'Reading',    icon: FileText,       linkSuffix: 'reading',     label: 'Complete 1 reading test',      getCount: (s, lvl) => (s.levels?.[lvl]?.reading?.length || 0),            getTotal: () => 5 },
  { id: 'listening', name: 'Listening',  icon: Headphones,     linkSuffix: 'listening',  label: 'Complete 1 listening test',    getCount: (s, lvl) => (s.levels?.[lvl]?.listening?.length || 0),          getTotal: () => 5 },
  { id: 'writing',   name: 'Writing',    icon: PenTool,        linkSuffix: 'writing',    label: 'Submit 1 writing task',         getCount: (s, lvl) => (s.writings || []).filter(w => w.level === lvl).length, getTotal: (lvl) => levelsData.levels.find(l => l.id === lvl)?.minWritingTasks || 10 },
  { id: 'speaking',  name: 'Speaking',   icon: Mic,            linkSuffix: 'speaking',   label: 'Complete 1 speaking task',     getCount: (s, lvl) => (s.speakingRecordings?.[lvl]?.length || 0),         getTotal: (lvl) => levelsData.levels.find(l => l.id === lvl)?.minSpeakingTasks || 10 },
];

// Count vocab entries per level (from summary)
const VOCAB_COUNT = dashboardSummary.vocabCounts;

// Count grammar entries per level (from summary)
const GRAMMAR_COUNT = dashboardSummary.grammarCounts;








/** Compute dynamic daily limits from the user's goal. Returns { grammar, vocab }. */
function computeDailyLimitsFor(levelId, state) {
  return buildAdaptiveTargets(levelId, state, getStudyGoal());
}

export default function Dashboard() {
  const [state] = useState(getState());

  const studyLevel = state.currentLevel;
  const activeGoal = useMemo(() => getStudyGoal(), []);
  const goalEstimate = useMemo(() => getGoalEstimate(state, activeGoal), [state, activeGoal]);
  const adaptiveTargets = useMemo(() => buildAdaptiveTargets(studyLevel, state, activeGoal), [studyLevel, state, activeGoal]);
  const todayMinutesDone = useMemo(() => calculateAdaptiveTodayMinutes(state), [state]);
  const remediation = useMemo(() => getRemediationRecommendation(state, studyLevel), [state, studyLevel]);

  // === Next incomplete lesson ===
  const nextLesson = useMemo(() => {
    const completed = getCompletedLessons(studyLevel);
    const levelLessons = allLessons.filter(l => l.level === studyLevel);
    return levelLessons.find(l => !completed.includes(l.id)) || null;
  }, [studyLevel]);

  // === All lessons done for current level? ===
  const allLessonsDone = useMemo(() => {
    const completed = getCompletedLessons(studyLevel);
    const levelLessons = allLessons.filter(l => l.level === studyLevel);
    return levelLessons.length > 0 && levelLessons.every(l => completed.includes(l.id));
  }, [studyLevel]);

  // === Exam unlocked? ===
  const examReady = useMemo(() => {
    const levelData = levelsData.levels.find(l => l.id === studyLevel);
    if (!levelData) return false;
    return isExamUnlocked(studyLevel, levelData);
  }, [studyLevel]);

  // === Due vocab count (from summary ids, no full vocab import needed) ===
  const dueVocabCount = useMemo(() => {
    const ids = dashboardSummary.vocabIds[studyLevel] || [];
    return getDueVocabWords(ids).length;
  }, [studyLevel]);

  // === Lesson progress ===
  const lessonProgress = useMemo(() => {
    const completed = getCompletedLessons(studyLevel);
    const total = allLessons.filter(l => l.level === studyLevel).length;
    return { completed: completed.length, total };
  }, [studyLevel]);

  // === Weak areas ===
  const weakTopics = useMemo(() => {
    try {
      const topics = getWeakTopics();
      return topics.slice(0, 3);
    } catch {
      return [];
    }
  }, []);

  // === Mistake count ===
  const mistakesCount = Object.keys(state.mistakeNotebook || {}).length;

  // === Mistake Review Card data ===
  const mistakeReviewData = useMemo(() => {
    const notebook = state.mistakeNotebook || {};
    const total = Object.keys(notebook).length;

    // Count by level
    const byLevel = {};
    // Count recent (last 7 days)
    let recentCount = 0;
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    for (const entry of Object.values(notebook)) {
      if (!entry) continue;
      const level = entry.level;
      if (level && typeof level === 'string') {
        byLevel[level] = (byLevel[level] || 0) + 1;
      }
      try {
        const dateVal = entry.date;
        if (dateVal) {
          const ts = new Date(dateVal).getTime();
          if (!isNaN(ts) && now - ts < sevenDays) {
            recentCount++;
          }
        }
      } catch { /* empty */ }
    }

    // Most common level
    let topLevel = null;
    let topCount = 0;
    for (const [lvl, cnt] of Object.entries(byLevel)) {
      if (cnt > topCount) { topLevel = lvl; topCount = cnt; }
    }

    return { total, recentCount, topLevel, topCount, hasMistakes: total > 0 };
  }, [state.mistakeNotebook]);

  // === Weakness-based daily skill ===
  // Derived from the area with the lowest completion ratio
  const todaySkill = useMemo(() => {
    const level = state.currentLevel;
    let worst = SKILL_AREAS[0];
    let worstRatio = 1;

    for (const area of SKILL_AREAS) {
      const count = area.getCount(state, level);
      const total = area.getTotal(level);
      const ratio = total > 0 ? count / total : 0;
      if (ratio < worstRatio) {
        worstRatio = ratio;
        worst = area;
      }
    }

    return { name: worst.name, icon: worst.icon, linkSuffix: worst.linkSuffix, id: worst.id };
  }, [state]);

  const readiness = getReadinessScores();
  const totalLessonsCompleted = ['A1','A2','B1','B2','C1'].reduce((acc, lvl) => acc + getCompletedLessons(lvl).length, 0);

  const totalCompleted = levelsData.levels.reduce((acc, lvl) => {
    const p = state.levels[lvl.id] || {};
    return acc + (p.grammar?.length || 0) + (p.vocab?.length || 0) + (p.reading?.length || 0) + (p.listening?.length || 0) + (state.writings?.filter(w => w.level === lvl.id).length || 0) + ((state.speakingRecordings[lvl.id]?.length) || 0);
  }, 0);

  const currentLevelData = levelsData.levels.find(l => l.id === state.currentLevel);

  // Level unlock progress
  const levelData = levelsData.levels.find(l => l.id === studyLevel);
  const levelProg = state.levels[studyLevel] || {};
  const grammarDone = (levelProg.grammar?.length || 0);
  const grammarTarget = levelData?.grammarUnits || 10;
  const vocabDone = (levelProg.vocab?.length || 0);
  const vocabTarget = levelData?.vocabularyUnits || 10;
  const readingDone = (levelProg.reading?.length || 0);
  const listeningDone = (levelProg.listening?.length || 0);
  const writingDone = (state.writings || []).filter(w => w.level === studyLevel).length;
  const speakingDone = (state.speakingRecordings[studyLevel]?.length || 0);

  // === Recompute streak with full memo data ===
  const activityDatesSet = useMemo(() => collectActivityDates(state), [state]);
  const currentStreak = useMemo(() => calculateCurrentStreak(activityDatesSet), [activityDatesSet]);
  const last7Days = useMemo(() => getLast7DaysActivity(activityDatesSet), [activityDatesSet]);
  const weeklyActiveCount = useMemo(() => getWeeklyActiveCount(activityDatesSet), [activityDatesSet]);
  const bestWeekly = useMemo(() => getBestWeeklyActivity(activityDatesSet), [activityDatesSet]);
  const activeToday = useMemo(() => activityDatesSet.has(getLocalDateKey()), [activityDatesSet]);

  // === Resume Last Activity ===
  const recentActivity = useMemo(() => getMostRecentActivity(state), [state]);
  const resumeRoute = useMemo(() => getActivityRoute(recentActivity, studyLevel), [recentActivity, studyLevel]);
  // Target level from store onboarding first, then study goal, fallback to current level
  const targetLevel = useMemo(() => {
    // Check store for onboarding targetLevel first
    if (state.targetLevel && state.targetLevel !== 'Medical FSP') {
      return state.targetLevel;
    }
    try {
      const goal = getStudyGoal();
      if (goal && goal.targetLevel && goal.targetLevel !== 'Medical FSP') {
        return goal.targetLevel;
      }
    } catch { /* empty */ }
    return studyLevel;
  }, [studyLevel, state.targetLevel]);

  // === Current Level Overview data ===
  const displayLevel = useMemo(() => {
    try {
      const goal = getStudyGoal();
      if (goal && goal.targetLevel && goal.targetLevel !== 'Medical FSP') {
        return goal.targetLevel;
      }
    } catch { /* empty */ }
    return state.currentLevel || 'A1';
  }, [state]);

  const overallPct = useMemo(() => {
    const lessonsCompleted = getCompletedLessons(displayLevel).length;
    const totalLessons = allLessons.filter(l => l.level === displayLevel).length;
    const prog = state.levels[displayLevel] || {};
    const levelData = levelsData.levels.find(l => l.id === displayLevel);
    const grammarCount = (prog.grammar?.length || 0);
    const vocabCount = (prog.vocab?.length || 0);
    const readingCount = (prog.reading?.length || 0);
    const listeningCount = (prog.listening?.length || 0);
    const writingCount = (state.writings || []).filter(w => w.level === displayLevel).length;
    const speakingCount = (state.speakingRecordings[displayLevel]?.length || 0);

    const gcLevel = grammarCurriculum[displayLevel] || [];
    const gcDone = getCompletedGrammarLessons(displayLevel).length;
    const readingTarget = levelData?.minReadingTests || 0;
    const listeningTarget = levelData?.minListeningTests || 0;
    const writingTarget = levelData?.minWritingTasks || 0;
    const speakingTarget = levelData?.minSpeakingTasks || 0;
    const done = Math.min(lessonsCompleted, totalLessons)
      + Math.min(gcDone, gcLevel.length)
      + Math.min(grammarCount, GRAMMAR_COUNT[displayLevel] || 200)
      + Math.min(vocabCount, VOCAB_COUNT[displayLevel] || 500)
      + Math.min(readingCount, readingTarget)
      + Math.min(listeningCount, listeningTarget)
      + Math.min(writingCount, writingTarget)
      + Math.min(speakingCount, speakingTarget);
    const max = Math.max(totalLessons + gcLevel.length + (GRAMMAR_COUNT[displayLevel] || 200) + (VOCAB_COUNT[displayLevel] || 500) + readingTarget + listeningTarget + writingTarget + speakingTarget, 1);
    return Math.min(Math.round((done / max) * 100), 100);
  }, [state, displayLevel]);

  // Estimated finish date from onboarding
  const estimatedFinishDate = useMemo(() => {
    if (state.estimatedFinishDate) {
      try {
        const d = new Date(state.estimatedFinishDate);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
      } catch { /* empty */ }
    }
    return null;
  }, [state.estimatedFinishDate]);

  // === Level overview counts ===
  const overviewData = useMemo(() => {
    const lessonsCompleted = getCompletedLessons(displayLevel).length;
    const totalLessons = allLessons.filter(l => l.level === displayLevel).length;
    const prog = state.levels[displayLevel] || {};
    const gcLevel = grammarCurriculum[displayLevel] || [];
    const gcDone = getCompletedGrammarLessons(displayLevel).length;

    return {
      lessons: { done: lessonsCompleted, total: totalLessons },
      grammarLesson: { done: gcDone, total: gcLevel.length },
      grammar: { done: (prog.grammar?.length || 0), total: GRAMMAR_COUNT[displayLevel] || 0 },
      vocab: { done: (prog.vocab?.length || 0), total: VOCAB_COUNT[displayLevel] || 0 },
      reading: { done: (prog.reading?.length || 0), total: null },
      listening: { done: (prog.listening?.length || 0), total: null },
    };
  }, [state, displayLevel]);

  // === Weakest area determination ===
  const weakestArea = useMemo(() => {
    const d = overviewData;
    const areas = [];

    if (d.lessons.total > 0) {
      const pct = (d.lessons.done / d.lessons.total) * 100;
      areas.push({ key: 'lessons', pct, done: d.lessons.done, total: d.lessons.total });
    }
    if (d.grammar.total > 0) {
      const pct = (d.grammar.done / d.grammar.total) * 100;
      areas.push({ key: 'grammar', pct, done: d.grammar.done, total: d.grammar.total });
    }
    if (d.vocab.total > 0) {
      const pct = (d.vocab.done / d.vocab.total) * 100;
      areas.push({ key: 'vocab', pct, done: d.vocab.done, total: d.vocab.total });
    }
    // reading/listening: no total, treat done===0 as incomplete (pct=0) / done>=1 as complete (pct=100)
    areas.push({ key: 'reading', pct: d.reading.done > 0 ? 100 : 0, done: d.reading.done, total: null });
    areas.push({ key: 'listening', pct: d.listening.done > 0 ? 100 : 0, done: d.listening.done, total: null });

    areas.sort((a, b) => a.pct - b.pct);


    const weakest = areas[0];
    if (!weakest) return null;

    // If everything is at 100%, return 'exam'
    const allDone = areas.every(a => a.pct >= 100);
    if (allDone) return { key: 'exam', label: 'Practice Weakest Area', routePart: 'exam' };

    const routeMap = { lessons: 'lessons', grammar: 'grammar', vocab: 'vocabulary', reading: 'reading', listening: 'listening' };
    const labelMap = { lessons: 'Lessons', grammar: 'Grammar', vocab: 'Vocabulary', reading: 'Reading', listening: 'Listening' };

    return {
      key: weakest.key,
      label: `Practice ${labelMap[weakest.key] || 'Weakest Area'}`,
      routePart: routeMap[weakest.key] || '',
    };
  }, [overviewData]);

  const weakestRoute = useMemo(() => {
    if (!weakestArea) return `/level/${displayLevel}`;
    if (weakestArea.key === 'exam') return `/level/${displayLevel}/exam`;
    return `/level/${displayLevel}/${weakestArea.routePart}`;
  }, [weakestArea, displayLevel]);

  // === Recommended Next Session ===
  const recommendedSession = useMemo(() => {
    // Priority 1: recent mistakes
    if (mistakesCount > 0) {
      return {
        label: 'Review mistakes',
        route: '/mistake-notebook',
        duration: 10,
        reason: 'You have mistakes waiting for review.',
      };
    }

    // Priority 2: weakest area
    if (weakestArea && weakestArea.key !== 'exam') {
      const name = weakestArea.label.replace('Practice ', '');
      return {
        label: `Practice ${name}`,
        route: weakestRoute,
        duration: weakestArea.key === 'reading' || weakestArea.key === 'listening' ? 15
          : weakestArea.key === 'writing' || weakestArea.key === 'speaking' ? 20
          : weakestArea.key === 'exam' ? 30
          : 10,
        reason: `${name} is currently your lowest progress area.`,
      };
    }

    // Priority 3: incomplete lessons
    if (!allLessonsDone && nextLesson) {
      return {
        label: 'Continue lessons',
        route: `/level/${displayLevel}/lessons`,
        duration: 15,
        reason: 'You still have unfinished lessons in this level.',
      };
    }

    // Priority 4: exam
    return {
      label: 'Try mock exam',
      route: `/level/${displayLevel}/exam`,
      duration: 30,
      reason: 'Your core areas look complete enough to test yourself.',
    };
  }, [mistakesCount, weakestArea, weakestRoute, allLessonsDone, nextLesson, displayLevel]);

  // === Dashboard settings export/import ===
  const ALLOWED_SETTINGS_KEYS = ['deutsch_klinik_dashboard_collapsed', 'deutsch_klinik_session_starts', 'deutsch_klinik_study_goal', 'deutsch_klinik_vocab_filters'];
  const [settingsMessage, setSettingsMessage] = useState(null);

  // === Progress backup ===
  const PROGRESS_KEY = 'deutsch_klinik_state';
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [progressMessage, setProgressMessage] = useState(null);
  const [allExportMessage, setAllExportMessage] = useState(null);
  const [progressStagedData, setProgressStagedData] = useState(null);
  const [progressConfirmText, setProgressConfirmText] = useState('');
  const [progressNeedsRefresh, setProgressNeedsRefresh] = useState(false);
  const [fullImportData, setFullImportData] = useState(null);
  const [fullImportChecks, setFullImportChecks] = useState({});
  const [fullImportMessage, setFullImportMessage] = useState(null);
  const [fullImportFileSize, setFullImportFileSize] = useState(null);
  const [fullImportNeedsRefresh, setFullImportNeedsRefresh] = useState(false);
  const [fullImportProgressConfirmText, setFullImportProgressConfirmText] = useState('');

  const exportProgress = () => {
    try {
      const val = localStorage.getItem(PROGRESS_KEY);
      if (val === null) {
        setProgressMessage({ text: 'No progress data found.', isError: true });
        return;
      }
      const data = { [PROGRESS_KEY]: val };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deutsch-klinik-progress-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      setProgressMessage({ text: 'Progress backup exported.', isError: false });
      setProgressNeedsRefresh(false);
    } catch {
      setProgressMessage({ text: 'Export failed.', isError: true });
    }
  };

  const importProgress = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          setProgressMessage({ text: 'Invalid backup file.', isError: true });
          setProgressNeedsRefresh(false);
          return;
        }
        if (PROGRESS_KEY in parsed) {
          setProgressStagedData(parsed[PROGRESS_KEY]);
          setProgressConfirmText('');
          setProgressNeedsRefresh(false);
          setProgressMessage(null);
        } else {
          setProgressMessage({ text: 'No progress data found in file.', isError: true });
          setProgressNeedsRefresh(false);
        }
      } catch {
        setProgressMessage({ text: 'Invalid JSON file.', isError: true });
        setProgressNeedsRefresh(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmProgressImport = () => {
    if (progressConfirmText !== 'RESTORE' || progressStagedData === null) return;
    try {
      localStorage.setItem(PROGRESS_KEY, progressStagedData);
      setProgressMessage({ text: 'Progress backup imported. Refresh the page to reload progress.', isError: false });
      setProgressNeedsRefresh(true);
    } catch {
      setProgressMessage({ text: 'Failed to write progress data.', isError: true });
      setProgressNeedsRefresh(false);
    }
    setProgressStagedData(null);
    setProgressConfirmText('');
  };

  const cancelProgressImport = () => {
    setProgressStagedData(null);
    setProgressConfirmText('');
    setProgressNeedsRefresh(false);
    setProgressMessage(null);
  };

  const clearProgress = () => {
    if (clearConfirmText !== 'CLEAR') return;
    try {
      localStorage.removeItem(PROGRESS_KEY);
      setProgressMessage({ text: 'Progress cleared. Refresh the page to reload progress.', isError: false });
      setProgressNeedsRefresh(true);
      setShowClearConfirm(false);
      setClearConfirmText('');
    } catch {
      setProgressMessage({ text: 'Failed to clear progress.', isError: true });
    }
  };

  const exportAllData = () => {
    const ALL_KEYS = [PROGRESS_KEY, ...ALLOWED_SETTINGS_KEYS];
    const data = {
      exportedAt: new Date().toISOString(),
      app: 'Deutsch Klinik',
      backupType: 'full',
      backupVersion: 1,
    };
    let foundAny = false;
    for (const key of ALL_KEYS) {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) {
          data[key] = val;
          foundAny = true;
        }
      } catch { /* empty */ }
    }
    if (!foundAny) {
      setAllExportMessage({ text: 'No data found to export.', isError: true });
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deutsch-klinik-full-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      setAllExportMessage({ text: 'All data exported.', isError: false });
    } catch {
      setAllExportMessage({ text: 'Export failed.', isError: true });
    }
  };

  const FULL_BACKUP_KEYS = ['deutsch_klinik_state', 'deutsch_klinik_dashboard_collapsed', 'deutsch_klinik_session_starts', 'deutsch_klinik_study_goal', 'deutsch_klinik_vocab_filters'];
  const FULL_BACKUP_INTERNAL_MAP = {
    deutsch_klinik_state: 'Restore progress',
    deutsch_klinik_dashboard_collapsed: 'Restore dashboard layout',
    deutsch_klinik_session_starts: 'Restore recent sessions',
    deutsch_klinik_study_goal: 'Restore study goal',
    deutsch_klinik_vocab_filters: 'Restore vocabulary filters',
  };

  const handleFullImportFile = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          setFullImportMessage({ text: 'Invalid JSON file.', isError: true });
          setFullImportData(null);
          return;
        }
        if (parsed.app !== 'Deutsch Klinik' || parsed.backupType !== 'full') {
          setFullImportMessage({ text: 'Not a valid Deutsch Klinik full backup.', isError: true });
          setFullImportData(null);
          return;
        }
        if ('backupVersion' in parsed && parsed.backupVersion !== 1) {
          setFullImportMessage({ text: 'Unsupported backup version.', isError: true });
          setFullImportData(null);
          return;
        }
        const detected = {};
        for (const key of FULL_BACKUP_KEYS) {
          if (key in parsed) {
            detected[key] = true;
          }
        }
        if (Object.keys(detected).length === 0) {
          setFullImportMessage({ text: 'No recognizable data found in file.', isError: true });
          setFullImportData(null);
          return;
        }
        setFullImportData(parsed);
        setFullImportFileSize(file?.size || ev.target.result.length);
        setFullImportChecks(detected);
        setFullImportMessage(null);
        setFullImportProgressConfirmText('');
      } catch {
        setFullImportMessage({ text: 'Invalid JSON file.', isError: true });
        setFullImportData(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmFullImport = () => {
    if (!fullImportData) return;
    let writtenCount = 0;
    for (const key of FULL_BACKUP_KEYS) {
      if (fullImportChecks[key] && key in fullImportData) {
        try {
          localStorage.setItem(key, fullImportData[key]);
          writtenCount++;
        } catch { /* empty */ }
      }
    }
    if (writtenCount > 0) {
      const progressRestored = fullImportChecks['deutsch_klinik_state'] && 'deutsch_klinik_state' in fullImportData;
      const restoredLabels = [];
      for (const key of FULL_BACKUP_KEYS) {
        if (fullImportChecks[key] && key in fullImportData) {
          const short = FULL_BACKUP_INTERNAL_MAP[key] ? FULL_BACKUP_INTERNAL_MAP[key].replace('Restore ', '') : key;
          restoredLabels.push(short.toLowerCase());
        }
      }
      if (progressRestored) {
        setFullImportMessage({ text: `Full backup restored: ${restoredLabels.join(', ')}. Refresh the page to reload progress.`, isError: false });
        setFullImportNeedsRefresh(true);
      } else {
        setFullImportMessage({ text: `Dashboard settings restored: ${restoredLabels.join(', ')}.`, isError: false });
        setFullImportNeedsRefresh(false);
      }
      setSessionRefresh(n => n + 1);
      if (fullImportChecks['deutsch_klinik_dashboard_collapsed']) {
        try {
          const raw = localStorage.getItem('deutsch_klinik_dashboard_collapsed');
          if (raw) {
            const p = JSON.parse(raw);
            setCollapsed({ recentSessions: !!p.recentSessions, studyStreak: !!p.studyStreak, mistakeReview: !!p.mistakeReview, quickActions: !!p.quickActions, weakAreas: !!p.weakAreas });
          }
        } catch { /* empty */ }
      }
    } else {
      setFullImportMessage({ text: 'No items were selected for restore.', isError: true });
    }
    setFullImportData(null);
    setFullImportChecks({});
    setFullImportFileSize(null);
    setFullImportNeedsRefresh(false);
    setFullImportProgressConfirmText('');
  };

  const cancelFullImport = () => {
    setFullImportData(null);
    setFullImportFileSize(null);
    setFullImportNeedsRefresh(false);
    setFullImportProgressConfirmText('');
    setFullImportChecks({});
    setFullImportMessage(null);
  };

  const exportSettings = () => {
    const data = {};
    for (const key of ALLOWED_SETTINGS_KEYS) {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) data[key] = val;
      } catch { /* empty */ }
    }
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deutsch-klinik-dashboard-settings.json';
      a.click();
      URL.revokeObjectURL(url);
      setSettingsMessage({ text: 'Dashboard settings exported.', isError: false });
    } catch {
      setSettingsMessage({ text: 'Export failed.', isError: true });
    }
  };

  const importSettings = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          setSettingsMessage({ text: 'Invalid settings file.', isError: true });
          return;
        }
        let importedCount = 0;
        for (const key of ALLOWED_SETTINGS_KEYS) {
          if (key in parsed) {
            try {
              localStorage.setItem(key, parsed[key]);
              importedCount++;
            } catch { /* empty */ }
          }
        }
        if (importedCount > 0) {
          setSessionRefresh(n => n + 1);
          setCollapsed(getDefaultCollapsed());
          const names = [];
          for (const key of ALLOWED_SETTINGS_KEYS) {
            if (key in parsed) {
              const short = key.replace('deutsch_klinik_', '').replace(/_/g, ' ');
              names.push(short);
            }
          }
          setSettingsMessage({ text: `Dashboard settings imported: ${names.join(', ')}.`, isError: false });
        } else {
          setSettingsMessage({ text: 'No recognizable settings found in file.', isError: true });
        }
      } catch {
        setSettingsMessage({ text: 'Invalid JSON file.', isError: true });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearSettings = () => {
    let clearedCount = 0;
    for (const key of ALLOWED_SETTINGS_KEYS) {
      try {
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      } catch { /* empty */ }
    }
    setSessionRefresh(n => n + 1);
    setCollapsed({ recentSessions: false, studyStreak: false, mistakeReview: false, quickActions: false, weakAreas: false });
    setSettingsMessage({ text: `Dashboard settings cleared: ${clearedCount} key(s).`, isError: false });
  };

  const getDefaultCollapsed = () => ({ recentSessions: false, studyStreak: false, mistakeReview: false, quickActions: false, weakAreas: false, accountSync: false });

  // === Collapsed state for secondary cards ===
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem('deutsch_klinik_dashboard_collapsed');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return {
            recentSessions: !!parsed.recentSessions,
            studyStreak: !!parsed.studyStreak,
            mistakeReview: !!parsed.mistakeReview,
            quickActions: !!parsed.quickActions,
            weakAreas: !!parsed.weakAreas,
            accountSync: !!parsed.accountSync,
          };
        }
      }
    } catch { /* empty */ }
    return { recentSessions: false, studyStreak: false, mistakeReview: false, quickActions: false, weakAreas: false, accountSync: false };
  });

  const toggleCollapsed = (key) => {
    setCollapsed(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem('deutsch_klinik_dashboard_collapsed', JSON.stringify(next)); } catch { /* empty */ }
      return next;
    });
  };

  const expandAll = () => {
    const all = getDefaultCollapsed();
    setCollapsed(all);
    try { localStorage.setItem('deutsch_klinik_dashboard_collapsed', JSON.stringify(all)); } catch { /* empty */ }
  };

  const collapseAll = () => {
    const all = { recentSessions: true, studyStreak: true, mistakeReview: true, quickActions: true, weakAreas: true };
    setCollapsed(all);
    try { localStorage.setItem('deutsch_klinik_dashboard_collapsed', JSON.stringify(all)); } catch { /* empty */ }
  };

  const resetLayout = () => {
    try { localStorage.removeItem('deutsch_klinik_dashboard_collapsed'); } catch { /* empty */ }
    setCollapsed(getDefaultCollapsed());
  };

  // === Recent Sessions from localStorage ===
  const [sessionRefresh, setSessionRefresh] = useState(0);

  const recentSessions = useMemo(() => {
    sessionRefresh;
    try {
      const raw = localStorage.getItem('deutsch_klinik_session_starts');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.slice(-3).reverse();
    } catch {
      return [];
    }
  }, [sessionRefresh]);

  const logSessionStart = (session) => {
    try {
      const raw = localStorage.getItem('deutsch_klinik_session_starts');
      let records = [];
      if (raw) {
        try { records = JSON.parse(raw); } catch { records = []; }
        if (!Array.isArray(records)) records = [];
      }
      records.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: session.label.toLowerCase().replace(/\s+/g, '_'),
        level: displayLevel,
        route: session.route,
        title: session.label,
        estimatedMinutes: session.duration,
        startedAt: new Date().toISOString(),
      });
      if (records.length > 50) records = records.slice(-50);
      localStorage.setItem('deutsch_klinik_session_starts', JSON.stringify(records));
      setSessionRefresh(n => n + 1);
    } catch { /* empty */ }
  };

  return (
    <PageShell>
      {/* Today's Study Plan */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><ListOrdered size={18} /> Today's Study Plan</span>}
          subtitle={`Suggested order for ${targetLevel} · Complete each step to stay on track`}
        />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
          <MiniPlanMetric label="Target" value={`${todayMinutesDone}/${goalEstimate.dailyMinutes} min`} accent={todayMinutesDone >= goalEstimate.dailyMinutes ? '#3bff9e' : '#ffd700'} />
          <MiniPlanMetric label="Remaining" value={`${Math.max(0, goalEstimate.dailyMinutes - todayMinutesDone)} min`} accent="var(--accent)" />
          <MiniPlanMetric label="Finish estimate" value={goalEstimate.predictedFinishDate} accent="#3bff9e" />
          <MiniPlanMetric label="Track" value={goalEstimate.track} accent="#8b5cf6" />
          <MiniPlanMetric label="Plan scale" value={adaptiveTargets.intensity} accent="#06b6d4" />
        </div>
        {remediation && (
          <div className="mb-4 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between" style={{ backgroundColor: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.25)' }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#ff3355' }}>Weakest area: {remediation.skill}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{remediation.task}</div>
            </div>
            <Link to={remediation.route} className="px-3 py-2 rounded-lg text-xs font-semibold text-center" style={{ backgroundColor: '#ff3355', color: '#fff' }}>
              Start remediation
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StudyPlanButton
            step={1} label="Continue Lessons"
            to={nextLesson ? `/level/` + targetLevel + `/lessons/` + nextLesson.id : `/level/` + targetLevel + `/lessons`}
            icon={GraduationCap} accent={levelColors[targetLevel] || 'var(--accent)'}
            desc={nextLesson ? nextLesson.title : 'Browse all lessons'}
          />
          <StudyPlanButton
            step={2} label="Practice Vocabulary"
            to={`/level/` + targetLevel + `/daily`}
            icon={BookOpen} accent="#3bff9e"
            desc={dueVocabCount > 0 ? dueVocabCount + ' due for review' : 'Flashcards & filters'}
          />
          <StudyPlanButton
            step={3} label="Practice Grammar"
            to={`/level/` + targetLevel + `/daily`}
            icon={BarChart3} accent="#f59e0b"
            desc={grammarDone + '/' + grammarTarget + ' exercises done'}
          />
          <StudyPlanButton
            step={4} label="Listening Practice"
            to={`/level/` + targetLevel + `/daily`}
            icon={Headphones} accent="#06b6d4"
            desc="Improve listening comprehension"
          />
          <StudyPlanButton
            step={5} label="Writing Practice"
            to={`/level/` + targetLevel + `/daily`}
            icon={PenTool} accent="#ec4899"
            desc="Practice written expression"
          />
          <StudyPlanButton
            step={6} label="Speaking Practice"
            to={`/level/` + targetLevel + `/daily`}
            icon={MessageSquare} accent="#f97316"
            desc="Practice spoken communication"
          />
          <StudyPlanButton
            step={7} label="Medical FSP"
            to="/medical-fsp"
            icon={FlaskConical} accent="#ef4444"
            desc="Medical German exam prep"
          />
        </div>
      </Card>

      {/* Hero section */}
      <div className="rounded-xl p-6 md:p-8 mb-6" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(139,92,246,0.08))', border: '1px solid var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              ⭐ Deutsch Klinik C1 Trainer
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Your central study hub. It organizes daily learning, tracks progress, stores mistakes, and connects lessons with practice. Use it alongside Goethe-Institut materials, native content, and live correction.
            </p>
            <p className="mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {currentLevelData?.description || 'Learn German from A1 to C1'}
            </p>
            {targetLevel && targetLevel !== studyLevel && (
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="text-xs inline-flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(59,255,158,0.1)', color: '#3bff9e', border: '1px solid rgba(59,255,158,0.2)' }}>
                  <Target size={12} /> Current: <strong>{studyLevel}</strong>
                </span>
                <span className="text-xs inline-flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Award size={12} /> Target: <strong>{targetLevel}</strong>
                </span>
                {estimatedFinishDate && (
                  <span className="text-xs inline-flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)' }}>
                    <CalendarCheck size={12} /> Est. finish: <strong>{estimatedFinishDate}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/placement-test" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
              <Target size={16} className="inline mr-1.5" />Placement Test
            </Link>
            <Link to={`/level/${studyLevel}/daily`} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              <Play size={16} className="inline mr-1.5" />Start Today's Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard icon={<Zap size={18} />} label="Streak" value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`} accent="#ff6b00" />
          <StatCard icon={<BarChart3 size={18} />} label="Current Level" value={studyLevel} accent="var(--accent)" />
          <StatCard icon={<Award size={18} />} label="Total Completed" value={totalCompleted.toString()} accent="#3bff9e" />
          <StatCard icon={<TrendingUp size={18} />} label="Weekly Focus" value={todaySkill.name} accent="#ff3355" />
          <StatCard icon={<Target size={18} />} label="Exams Passed" value={Object.values(state.exams).filter(e => e.passed).length.toString()} accent="#8b5cf6" />
          <StatCard icon={<Target size={18} />} label="Med German" value={state.medicalUnlocked ? 'Unlocked' : 'Locked'} accent={state.medicalUnlocked ? '#3bff9e' : '#54587a'} />
      </div>



      {/* Resume Last Activity */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><TrendingUp size={18} /> Resume Last Activity</span>}
        />
        {recentActivity ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {recentActivity.type === 'grammar' && '📝 Grammar'}
                {recentActivity.type === 'vocab' && '📚 Vocabulary'}
                {recentActivity.type === 'reading' && '📖 Reading'}
                {recentActivity.type === 'listening' && '🎧 Listening'}
                {recentActivity.type === 'writing' && '✍️ Writing'}
                {recentActivity.type === 'speaking' && '🎤 Speaking'}
                {recentActivity.type === 'exam' && '📋 Exam'}
                {recentActivity.type === 'mistakes' && '📓 Mistake Review'}
                {recentActivity.type === 'lesson' && '📘 Lesson'}
                {recentActivity.level ? ` (${recentActivity.level})` : ''}
              </div>
              {recentActivity.date && (
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatRelativeTime(recentActivity.date)}
                </div>
              )}
            </div>
            <Link
              to={resumeRoute}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)', color: '#000' }}
            >
              Continue <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              No recent activity yet. Start with a lesson or practice exercise.
            </p>
            <Link
              to={`/level/${studyLevel}/lessons`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: '#000' }}
            >
              Go to Lessons <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </Card>

      {/* Current Level Overview Card */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><Target size={18} /> Current Level Overview</span>}
          subtitle={<>Level: <span className="font-bold" style={{ color: levelColors[displayLevel] || 'var(--accent)' }}>{displayLevel}</span> <span className="ml-2">Overall: <span className="font-bold" style={{ color: 'var(--accent)' }}>{overallPct}%</span></span></>}
        />


        {/* Progress bars */}
        <div className="space-y-2 mb-4">
          <ProgressBarCompact label="Lessons" done={overviewData.lessons.done} total={overviewData.lessons.total} color={levelColors[displayLevel] || 'var(--accent)'} />
          {overviewData.grammarLesson.total > 0 && <ProgressBarCompact label="Grammar Lessons" done={overviewData.grammarLesson.done} total={overviewData.grammarLesson.total} color="#a855f7" />}
          <ProgressBarCompact label="Grammar" done={overviewData.grammar.done} total={overviewData.grammar.total} color="#f59e0b" />
          <ProgressBarCompact label="Vocab" done={overviewData.vocab.done} total={overviewData.vocab.total} color="#3bff9e" />
          <ProgressBarCompact label="Reading" done={overviewData.reading.done} total={overviewData.reading.total} color="#06b6d4" />
          <ProgressBarCompact label="Listening" done={overviewData.listening.done} total={overviewData.listening.total} color="#ec4899" />
        </div>

        {/* Readiness text */}
        <div className="mb-4 text-xs" style={{ color: overallPct >= 80 ? 'var(--accent)' : overallPct >= 50 ? '#f59e0b' : 'var(--text-muted)' }}>
          {overallPct >= 80
            ? 'You are close to exam-ready. Try a mock exam.'
            : overallPct >= 50
              ? 'Good progress. Strengthen weak areas before the mock exam.'
              : 'Focus on lessons and core practice first.'}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/level/${displayLevel}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            View Level <ChevronRight size={16} />
          </Link>
          <Link
            to={`/level/${displayLevel}/lessons`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: levelColors[displayLevel] || 'var(--accent)', color: '#000' }}
          >
            Continue Lessons <ArrowRight size={16} />
          </Link>
          {weakestArea && (
            <Link
              to={weakestRoute}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'rgba(255,51,85,0.12)', border: '1px solid rgba(255,51,85,0.3)', color: '#ff3355' }}
            >
              <Crosshair size={14} /> {weakestArea.label}
            </Link>
          )}
          {overallPct >= 80 && weakestArea?.key !== 'exam' && (
            <Link
              to={`/level/${displayLevel}/exam`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
            >
              <ClipboardCheck size={14} /> Try Mock Exam
            </Link>
          )}
        </div>
      </Card>

      {/* Study Goal Tracker */}
      <div className="mb-6">
        <StudyGoalTracker />
      </div>

      {/* Recommended Next Session */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><Lightbulb size={18} /> Recommended Next Session</span>}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {recommendedSession.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {recommendedSession.reason} (est. {recommendedSession.duration} min)
            </div>
          </div>
          <Link
            to={recommendedSession.route}
            onClick={() => logSessionStart(recommendedSession)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
            style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
          >
            Start Session <Play size={16} />
          </Link>
        </div>
      </Card>

      {/* Account & Cloud Sync */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title={<span className="flex items-center gap-2"><Settings size={16} /> Account & Cloud Sync</span>}
          />
          <button type="button" onClick={() => toggleCollapsed('accountSync')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
            <ChevronDown size={16} style={{ transform: collapsed.accountSync ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        {!collapsed.accountSync && (
          <>
            <AuthPanel />
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                Dashboard settings (layout, sessions, study goal, vocab filters)
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportSettings} className="text-xs px-3 py-1.5 rounded transition-colors" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>Export settings</button>
                <label className="text-xs px-3 py-1.5 rounded transition-colors cursor-pointer" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                  Import settings
                  <input type="file" accept=".json" className="hidden" onChange={importSettings} />
                </label>
                <button type="button" onClick={clearSettings} className="text-xs px-3 py-1.5 rounded transition-colors" style={{ color: '#ff3355', backgroundColor: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.3)' }}>Clear dashboard settings</button>
              </div>
              {settingsMessage && (
                <p className="text-xs mt-2" style={{ color: settingsMessage.isError ? '#ff3355' : '#3bff9e' }}>{settingsMessage.text}</p>
              )}
            </div>
          </>
        )}
        {collapsed.accountSync && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {state.username ? `Signed in as ${state.username}` : 'Not signed in'} &middot; Dashboard settings
          </p>
        )}
      </Card>

      {/* Recent Sessions */}
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#8b5cf6' }}>
            <Clock size={18} /> Recent Sessions
          </h2>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => toggleCollapsed('recentSessions')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
              <ChevronDown size={16} style={{ transform: collapsed.recentSessions ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {recentSessions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('deutsch_klinik_session_starts');
                  setSessionRefresh(n => n + 1);
                }}
                className="text-xs px-2.5 py-1 rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {!collapsed.recentSessions && (
        recentSessions.length > 0 ? (
        <div className="space-y-2">
          {recentSessions.slice(0, 3).map((s, i) => {
            const timeAgo = formatRelativeTime(s.startedAt);
            return (
              <Link
                key={s.id || i}
                to={s.route || '#'}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {s.title || 'Session'}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {s.level && <span>{s.level}</span>}
                    {s.estimatedMinutes && <span>{s.estimatedMinutes} min</span>}
                    <span>{timeAgo}</span>
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
        ) : (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No sessions started yet.
        </p>
        ))}
      </div>

      {/* --- Daily Tasks / Progress Tracking divider --- */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid var(--border)' }}></div></div>
        <div className="relative flex justify-center items-center gap-2"><span className="px-3 text-xs font-semibold" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>Progress Overview</span>
          <button type="button" onClick={expandAll} className="text-xs px-2 py-0.5 rounded transition-colors" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border)' }}>Expand all</button>
          <button type="button" onClick={collapseAll} className="text-xs px-2 py-0.5 rounded transition-colors" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border)' }}>Collapse all</button>
          <button type="button" onClick={resetLayout} className="text-xs px-2 py-0.5 rounded transition-colors" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border)' }}>Reset layout</button>
        </div>
      </div>

      {/* Study Streak Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title={<span className="flex items-center gap-2"><Flame size={18} /> Study Streak</span>}
          />
          <button type="button" onClick={() => toggleCollapsed('studyStreak')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
            <ChevronDown size={16} style={{ transform: collapsed.studyStreak ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        {!collapsed.studyStreak && (<>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Streak count */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                backgroundColor: currentStreak > 0 ? 'rgba(255,107,0,0.15)' : 'var(--bg-hover)',
                border: `3px solid ${currentStreak > 0 ? '#ff6b00' : 'var(--text-muted)'}`,
                color: currentStreak > 0 ? '#ff6b00' : 'var(--text-muted)',
              }}
            >
              {currentStreak}
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: currentStreak > 0 ? '#ff6b00' : 'var(--text-muted)' }}>
                {currentStreak === 1 ? '1 day' : `${currentStreak} days`}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>current streak</div>
            </div>
          </div>

          {/* Activity today + weekly summary */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: activeToday ? 'rgba(59,255,158,0.12)' : 'var(--bg-hover)',
                  color: activeToday ? '#3bff9e' : 'var(--text-muted)',
                  border: `1px solid ${activeToday ? 'rgba(59,255,158,0.3)' : 'var(--border)'}`,
                }}
              >
                {activeToday ? 'Active today' : 'No activity today'}
              </div>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: '#ff6b00', fontWeight: 600 }}>{weeklyActiveCount}</span>/7 days this week
              <span className="ml-2">
                Best: <span style={{ color: '#3bff9e', fontWeight: 600 }}>{bestWeekly}</span> days
              </span>
            </div>
          </div>
        </div>

        {/* 7-day activity row */}
        <div className="mt-4">
          <div className="flex items-end gap-1.5 sm:gap-2.5 justify-center sm:justify-start">
            {last7Days.map((day) => (
              <div key={day.dateKey} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: day.active
                      ? day.isToday
                        ? 'rgba(255,107,0,0.25)'
                        : 'rgba(59,255,158,0.15)'
                      : 'var(--bg-hover)',
                    border: `1px solid ${
                      day.isToday
                        ? '#ff6b00'
                        : day.active
                          ? 'rgba(59,255,158,0.3)'
                          : 'var(--border)'
                    }`,
                    color: day.active
                      ? day.isToday
                        ? '#ff6b00'
                        : '#3bff9e'
                      : 'var(--text-muted)',
                  }}
                >
                  {day.active ? (day.isToday ? '⚡' : '✓') : '·'}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: day.isToday ? '#ff6b00' : 'var(--text-muted)',
                  }}
                >
                  {day.dayLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
        </>)}
      </Card>

      {/* Mistake Review Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title={<span className="flex items-center gap-2"><BookMarked size={18} /> Mistake Review</span>}
          />
          <button type="button" onClick={() => toggleCollapsed('mistakeReview')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
            <ChevronDown size={16} style={{ transform: collapsed.mistakeReview ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        {!collapsed.mistakeReview ? (
          mistakeReviewData.hasMistakes ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: 'rgba(255,170,51,0.12)', color: '#ffaa33', border: '2px solid rgba(255,170,51,0.25)' }}
              >
                {mistakeReviewData.total}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {mistakeReviewData.total} {mistakeReviewData.total === 1 ? 'mistake' : 'mistakes'}
                </div>
                {mistakeReviewData.recentCount > 0 && (
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {mistakeReviewData.recentCount} in last 7 days
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {mistakeReviewData.topLevel && (
                <div className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                  Most: {mistakeReviewData.topLevel} ({mistakeReviewData.topCount})
                </div>
              )}
              <Link
                to="/mistake-notebook"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#ffaa33', color: '#000' }}
              >
                Review Mistakes <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No mistakes recorded. Keep up the good work!
          </p>
        )
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {mistakeReviewData.hasMistakes ? `${mistakeReviewData.total} mistakes` : 'No mistakes recorded.'}
          </p>
        )}
      </Card>

      {/* Quick Action Buttons row */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title={<span className="flex items-center gap-2"><Zap size={16} /> Quick Actions</span>}
          />
          <button type="button" onClick={() => toggleCollapsed('quickActions')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
            <ChevronDown size={16} style={{ transform: collapsed.quickActions ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        {!collapsed.quickActions && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <ActionButton
          to={nextLesson ? `/level/${studyLevel}/lessons/${nextLesson.id}` : `/level/${studyLevel}/lessons`}
          icon={GraduationCap}
          label={nextLesson ? 'Next Lesson' : 'Lessons'}
          accent="var(--accent)"
        />
        <ActionButton
          to={`/level/${studyLevel}/vocabulary/flashcards`}
          icon={BookOpen}
          label={`Flashcards${dueVocabCount > 0 ? ` (${dueVocabCount})` : ''}`}
          accent="#3bff9e"
        />
        <ActionButton
          to={`/level/${studyLevel}/grammar?daily=1&limit=${computeDailyLimitsFor(studyLevel, state).grammar}`}
          icon={BarChart3}
          label="Grammar"
          accent="#f59e0b"
        />
        <ActionButton
          to={todaySkill.linkSuffix ? `/level/${studyLevel}/${todaySkill.linkSuffix}` : '/mistake-notebook'}
          icon={todaySkill.icon}
          label={todaySkill.name}
          accent="#ff3355"
        />
        <ActionButton
          to={allLessonsDone || examReady ? `/level/${studyLevel}/exam` : `/level/${studyLevel}`}
          icon={ClipboardCheck}
          label={allLessonsDone || examReady ? 'Exam' : 'Level Page'}
          accent="#8b5cf6"
        />
      </div>
        )}
      </Card>

      {/* Next Lesson + Progress section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Next lesson card */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <GraduationCap size={16} /> Next Up
          </h2>
          {nextLesson ? (
            <div>
              <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{nextLesson.title}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Lesson {lessonProgress.completed + 1} of {lessonProgress.total}
              </div>
              <Link
                to={`/level/${studyLevel}/lessons/${nextLesson.id}`}
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'var(--accent)', color: '#000' }}
              >
                <Play size={14} /> Start Lesson
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div>
              {lessonProgress.total > 0 ? (
                <div>
                  <div className="font-bold text-lg" style={{ color: '#3bff9e' }}>All lessons complete!</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {studyLevel} - Ready for the exam.
                  </div>
                  <Link
                    to={`/level/${studyLevel}/exam`}
                    className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: '#3bff9e', color: '#000' }}
                  >
                    <ClipboardCheck size={14} /> Take Exam
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No lessons found for this level.</div>
              )}
            </div>
          )}
          <div className="mt-4">
            <ProgressBar
              value={lessonProgress.completed}
              max={lessonProgress.total}
              label="Lessons"
              color="var(--accent)"
            />
          </div>
        </div>

        {/* Right: Exam unlock progress */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#8b5cf6' }}>
            <Target size={16} /> Exam Progress ({studyLevel})
          </h2>
          <div className="space-y-2.5">
            <ProgressBar value={lessonProgress.completed} max={lessonProgress.total} label="Lessons" color="var(--accent)" />
            <ProgressBar value={getCompletedGrammarLessons(studyLevel).length} max={(grammarCurriculum[studyLevel] || []).length} label="Grammar Lessons" color="#a855f7" />
            <ProgressBar value={grammarDone} max={grammarTarget} label="Grammar" color="#f59e0b" />
            <ProgressBar value={vocabDone} max={vocabTarget} label="Vocabulary" color="#3bff9e" />
            <ProgressBar value={readingDone} max={levelData?.minReadingTests || 5} label="Reading" color="#ff3355" />
            <ProgressBar value={listeningDone} max={levelData?.minListeningTests || 5} label="Listening" color="#06b6d4" />
            <ProgressBar value={writingDone} max={levelData?.minWritingTasks || 10} label="Writing" color="#ec4899" />
            <ProgressBar value={speakingDone} max={levelData?.minSpeakingTasks || 10} label="Speaking" color="#f97316" />
          </div>
          {examReady ? (
            <Link
              to={`/level/${studyLevel}/exam`}
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg text-sm font-semibold w-full justify-center"
              style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
            >
              <ClipboardCheck size={14} /> Exam Ready - Take It!
            </Link>
          ) : (
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
              Complete all requirements above to unlock the exam.
            </p>
          )}
        </div>
      </div>

      {/* Weak Areas */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title={<span className="flex items-center gap-2"><AlertTriangle size={16} /> Weak Areas</span>}
          />
          <button type="button" onClick={() => toggleCollapsed('weakAreas')} className="p-0.5 rounded transition-colors hover:scale-110" style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}>
            <ChevronDown size={16} style={{ transform: collapsed.weakAreas ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        {!collapsed.weakAreas ? (<>
        {weakTopics.length > 0 ? (
          <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weakTopics.map((topic, i) => {
              const total = topic.correct + topic.incorrect;
              const pct = total > 0 ? Math.round((topic.correct / total) * 100) : 0;
              const isWeak = topic.status === 'weak';
              return (
                <div key={topic.topic} className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {i + 1}. {topic.topic}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: pct >= 60 ? '#3bff9e' : '#ff3355' }}>{pct}% correct</span>
                    <span>({topic.correct}/{total})</span>
                    {isWeak && <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(255,51,85,0.15)', color: '#ff3355' }}>weak</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {weakTopics.length > 0 && (
            <div className="mt-3 text-right">
              <Link to="/mistake-notebook" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
                View all mistakes and weak areas →
              </Link>
            </div>
          )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <CheckCircle size={14} style={{ color: '#3bff9e' }} />
            No weak areas yet. Keep studying and they'll appear here.
          </div>
        )}
        </>) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {weakTopics.length > 0 ? `${weakTopics.length} weak areas` : 'No weak areas'}
          </p>
        )}
      </Card>

      {/* Lessons Card */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <Link to={`/level/${studyLevel}/lessons`} className="rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,240,255,0.1)' }}>
            <GraduationCap size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Structured Lessons</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{totalLessonsCompleted} lessons completed</div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </Link>

      </div>

      {/* --- Level Overview divider --- */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: '1px solid var(--border)' }}></div></div>
        <div className="relative flex justify-center"><span className="px-3 text-xs font-semibold" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)' }}>Level & Exam</span></div>
      </div>

      {/* C1 Readiness Card */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,240,255,0.08))', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <ClipboardCheck size={20} /> C1 Readiness
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {readiness && readiness.completed
                ? `Overall score: ${readiness.overall}% (last assessed ${new Date(readiness.lastUpdated).toLocaleDateString('en-GB')})`
                : 'Not yet assessed. Check your readiness for the Goethe C1 exam.'}
            </p>
          </div>
          <div className="flex gap-2">
            {readiness && readiness.completed && (
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{
                  border: `3px solid ${readiness.overall >= 80 ? '#3bff9e' : readiness.overall >= 60 ? '#ffd700' : '#ff3355'}`,
                  color: readiness.overall >= 80 ? '#3bff9e' : readiness.overall >= 60 ? '#ffd700' : '#ff3355',
                }}>
                  {readiness.overall}%
                </div>
              </div>
            )}
            <Link to="/c1-readiness" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              {readiness && readiness.completed ? 'View Report' : 'Take Assessment'}
            </Link>
          </div>
        </div>

        {readiness && readiness.completed && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {['reading', 'listening', 'writing', 'speaking', 'grammar', 'vocabulary', 'timeManagement'].slice(0, 7).map(skill => (
              <div key={skill} className="text-center">
                <div className="text-xs capitalize mb-1" style={{ color: 'var(--text-muted)' }}>{skill}</div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${readiness[skill] || 0}%`,
                    backgroundColor: readiness[skill] >= 80 ? '#3bff9e' : readiness[skill] >= 60 ? '#ffd700' : '#ff3355',
                  }} />
                </div>
                <div className="text-xs font-bold mt-0.5" style={{
                  color: readiness[skill] >= 80 ? '#3bff9e' : readiness[skill] >= 60 ? '#ffd700' : '#ff3355',
                }}>{readiness[skill] || 0}%</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level Progress Cards */}
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--accent)' }}>Your Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {levelsData.levels.map(lvl => {
          const p = state.levels[lvl.id] || {};
          const total = (p.grammar?.length || 0) + (p.vocab?.length || 0) + (p.quizzes?.length || 0) + (p.reading?.length || 0) + (p.listening?.length || 0);
          const exam = state.exams[lvl.id];
          const unlocked = isLevelUnlocked(lvl.id, levelsData.levels);

          return (
            <Link key={lvl.id} to={`/level/${lvl.id}`} className="rounded-xl p-4 transition-all hover:scale-[1.02]" style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${total > 0 ? lvl.color : 'var(--border)'}`,
              opacity: unlocked ? 1 : 0.5,
            }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold" style={{ color: lvl.color }}>{lvl.id}</span>
                {exam?.passed ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(59,255,158,0.15)', color: '#3bff9e' }}>Passed ✓</span> :
                 total > 0 ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,240,255,0.1)', color: 'var(--accent)' }}>In Progress</span> : null}
              </div>
              <div className="h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--bg-hover)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(total * 5, 100)}%`, backgroundColor: lvl.color }} />
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {total} exercises | {exam ? `${exam.score}% exam` : 'Exam not taken'}
              </div>
            </Link>
          );
        })}
      </div>

      {/* FSP Medical German Track */}
      <div className="mb-6">
        {((state.targetLevel === 'Medical FSP' || state.targetLevel === 'FSP') || state.exams?.B2?.passed || state.levels?.B2?.grammar?.length > 0 || state.levels?.B2?.vocab?.length > 0 || state.levels?.C1?.grammar?.length > 0) ? (
          <Link to="/medical-fsp" className="rounded-xl p-5 block transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.4)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
                <Stethoscope size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: '#8b5cf6' }}>FSP Medical German Track</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Fachsprachpruefung preparation</div>
              </div>
              <ChevronRight size={18} style={{ color: '#8b5cf6', marginLeft: 'auto' }} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Focused preparation for the medical German language exam required for international doctors
              to work in Germany. Covers patient history, diagnosis explanations, case presentations,
              medical documentation, and full mock exams.
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <GraduationCap size={12} />
              <span>20 modules &middot; 40 lessons &middot; 9 skill areas</span>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', opacity: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}>
                <Stethoscope size={20} style={{ color: '#54587a' }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: '#54587a' }}>FSP Medical German Track</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Locked</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The FSP track requires B2/C1 level completion. Set your target level to "Medical FSP"
              in onboarding or settings to unlock focused Fachsprachpruefung preparation.
            </p>
          </div>
        )}
      </div>

      {/* Progress Backup */}
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,170,51,0.3)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#ffaa33' }}>
            <AlertTriangle size={16} /> Progress Backup
          </h2>
        </div>
        <p className="text-xs mb-3" style={{ color: '#ffaa33' }}>
          Affects real study progress. Lessons, grammar, vocabulary, exams, mistakes.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" onClick={exportProgress} className="text-xs px-3 py-1.5 rounded transition-colors" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>Export progress</button>
          <label className="text-xs px-3 py-1.5 rounded transition-colors cursor-pointer" style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
            Import progress
            <input type="file" accept=".json" className="hidden" onChange={importProgress} />
          </label>
          <button type="button" onClick={() => setShowClearConfirm(true)} className="text-xs px-3 py-1.5 rounded transition-colors" style={{ color: '#ff3355', backgroundColor: 'rgba(255,51,85,0.08)', border: '1px solid rgba(255,51,85,0.3)' }}>Clear progress</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Full backup can include both progress and UI settings.
          </p>
          <button type="button" onClick={exportAllData} className="text-xs px-3 py-1.5 rounded transition-colors" style={{ color: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)' }}>Export all data</button>
          <label className="text-xs px-3 py-1.5 rounded transition-colors cursor-pointer" style={{ color: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)' }}>
            Import full backup
            <input type="file" accept=".json" className="hidden" onChange={handleFullImportFile} />
          </label>
        </div>
        {allExportMessage && (
          <p className="text-xs mb-2" style={{ color: allExportMessage.isError ? '#ff3355' : '#3bff9e' }}>{allExportMessage.text}</p>
        )}
        {fullImportMessage && !fullImportData && (
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs" style={{ color: fullImportMessage.isError ? '#ff3355' : '#3bff9e' }}>{fullImportMessage.text}</p>
            {fullImportNeedsRefresh && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none' }}
              >
                Refresh now
              </button>
            )}
          </div>
        )}
        {fullImportData && (
          <div className="rounded-lg p-3 mb-2" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
            {/* File preview */}
            <div className="text-xs mb-3 space-y-0.5" style={{ color: 'var(--text-muted)' }}>
              <div>Backup version: {'backupVersion' in fullImportData ? fullImportData.backupVersion : 'legacy'}</div>
              <div>Exported: {(() => {
                try {
                  const d = new Date(fullImportData.exportedAt);
                  if (!isNaN(d.getTime())) return d.toLocaleString();
                  return 'Unknown export date';
                } catch { return 'Unknown export date'; }
              })()}</div>
              <div>Keys detected: {FULL_BACKUP_KEYS.filter(k => k in fullImportData).length}</div>
              <div style={{ color: 'deutsch_klinik_state' in fullImportData ? '#ffaa33' : 'var(--text-muted)' }}>
                Progress: {'deutsch_klinik_state' in fullImportData ? 'Included' : 'Not included'}
              </div>
              <div>UI settings: {FULL_BACKUP_KEYS.filter(k => k !== 'deutsch_klinik_state' && k in fullImportData).length > 0 ? 'Included' : 'Not included'}</div>
              <div>File size: {fullImportFileSize ? (fullImportFileSize / 1024).toFixed(1) + ' KB' : 'Unknown'}</div>
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#8b5cf6' }}>Select what to restore:</p>
            {FULL_BACKUP_KEYS.map(key => {
              if (!(key in fullImportData)) return null;
              return (
                <label key={key} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!fullImportChecks[key]}
                    onChange={() => { setFullImportChecks(prev => ({ ...prev, [key]: !prev[key] })); setFullImportProgressConfirmText(''); }}
                    className="rounded"
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{FULL_BACKUP_INTERNAL_MAP[key] || key}</span>
                  {key === 'deutsch_klinik_state' && (
                    <span className="text-xs" style={{ color: '#ff3355' }}>(overwrites real progress)</span>
                  )}
                </label>
              );
            })}
            {fullImportChecks['deutsch_klinik_state'] && (
              <div className="rounded p-2 mt-1 mb-2" style={{ backgroundColor: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.2)' }}>
                <p className="text-xs mb-1" style={{ color: '#ff3355' }}>Type RESTORE to confirm progress overwrite:</p>
                <input
                  type="text"
                  value={fullImportProgressConfirmText}
                  onChange={(e) => setFullImportProgressConfirmText(e.target.value)}
                  placeholder="RESTORE"
                  className="w-full text-xs px-2 py-1.5 rounded"
                  style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                />
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={confirmFullImport}
                disabled={(() => {
                  const anyChecked = Object.values(fullImportChecks).some(v => v);
                  const needConfirm = fullImportChecks['deutsch_klinik_state'];
                  return !anyChecked || (needConfirm && fullImportProgressConfirmText !== 'RESTORE');
                })()}
                className="text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none' }}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={cancelFullImport}
                className="text-xs px-3 py-1.5 rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {showClearConfirm && (
          <div className="rounded-lg p-3 mb-2" style={{ backgroundColor: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.2)' }}>
            <p className="text-xs mb-2" style={{ color: '#ff3355' }}>Type CLEAR to confirm:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={clearConfirmText}
                onChange={(e) => setClearConfirmText(e.target.value)}
                placeholder="CLEAR"
                className="flex-1 text-xs px-2 py-1.5 rounded"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              />
              <button
                type="button"
                onClick={clearProgress}
                disabled={clearConfirmText !== 'CLEAR'}
                className="text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-colors"
                style={{ backgroundColor: clearConfirmText === 'CLEAR' ? '#ff3355' : 'var(--bg-hover)', color: clearConfirmText === 'CLEAR' ? '#fff' : 'var(--text-muted)', border: '1px solid rgba(255,51,85,0.3)' }}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => { setShowClearConfirm(false); setClearConfirmText(''); }}
                className="text-xs px-3 py-1.5 rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {progressStagedData && (
          <div className="rounded-lg p-3 mb-2" style={{ backgroundColor: 'rgba(255,51,85,0.06)', border: '1px solid rgba(255,51,85,0.2)' }}>
            <p className="text-xs mb-1" style={{ color: '#ff3355' }}>
              This will overwrite real study progress.
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Type RESTORE to confirm:
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={progressConfirmText}
                onChange={(e) => setProgressConfirmText(e.target.value)}
                placeholder="RESTORE"
                className="flex-1 text-xs px-2 py-1.5 rounded"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              />
              <button
                type="button"
                onClick={confirmProgressImport}
                disabled={progressConfirmText !== 'RESTORE'}
                className="text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-colors"
                style={{ backgroundColor: progressConfirmText === 'RESTORE' ? '#ff3355' : 'var(--bg-hover)', color: progressConfirmText === 'RESTORE' ? '#fff' : 'var(--text-muted)', border: '1px solid rgba(255,51,85,0.3)' }}
              >
                Confirm Import
              </button>
              <button
                type="button"
                onClick={cancelProgressImport}
                className="text-xs px-3 py-1.5 rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {progressMessage && (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs" style={{ color: progressMessage.isError ? '#ff3355' : '#3bff9e' }}>{progressMessage.text}</p>
            {progressNeedsRefresh && !progressMessage.isError && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none' }}
              >
                Refresh now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dev debug panel — only renders in dev mode */}
      {import.meta.env.DEV && <DebugProgressPanel currentLevel={studyLevel} />}
    </PageShell>
  );
}

const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

function MiniPlanMetric({ label, value, accent }) {
  return (
    <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-xs font-bold truncate" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function StudyPlanButton({ step, label, to, icon: Icon, accent, desc }) {
  return (
    <Link
      to={to}
      className="rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02]"
      style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: accent + '20', color: accent }}
      >
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
          <Icon size={14} style={{ color: accent }} />
          <span>{label}</span>
        </div>
        <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </Link>
  );
}

function DashStatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <Icon size={18} style={{ color: accent }} />
      <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-lg font-bold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function ActionButton({ to, icon: Icon, label, accent }) {
  return (
    <Link
      to={to}
      className="rounded-xl p-3 flex flex-col items-center gap-1.5 text-center transition-all hover:scale-[1.04]"
      style={{ backgroundColor: 'var(--bg-card)', border: `1px solid ${accent}33` }}
    >
      <Icon size={18} style={{ color: accent }} />
      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </Link>
  );
}

function ProgressBarCompact({ label, done, total, color }) {
  const pct = total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-14 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-14 text-right" style={{ color }}>
        {done}{total != null ? `/${total}` : ''}
      </span>
    </div>
  );
}

function ProgressBar({ value, max, label, color }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-12 text-right" style={{ color }}>{value}/{max}</span>
    </div>
  );
}
