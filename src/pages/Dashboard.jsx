import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getState, updateState, updateStreak, getLevelProgress, getReadinessScores, getCompletedLessons, getWeakTopics, getDueVocabWords, isLevelUnlocked, isExamUnlocked } from '../utils/store';
import levelsData from '../data/levels.json';
import allLessonsData from '../data/germanLessons.json';
import germanVocabulary from '../data/germanVocabulary.json';
import grammarData from '../data/grammar.json';
import { Zap, Target, BarChart3, Award, TrendingUp, ChevronRight, Play, BookOpen, Mic, Headphones, PenTool, FileText, ClipboardCheck, AlertTriangle, BookMarked, GraduationCap, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const skillIcons = {
  grammar: BookOpen,
  vocabulary: BookOpen,
  reading: FileText,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

const allLessons = allLessonsData;

// Day of week -> skill task mapping
const DAY_SKILL = {
  0: { name: 'Reading', icon: FileText, linkSuffix: 'reading', label: '1 Reading Exercise' },
  1: { name: 'Listening', icon: Headphones, linkSuffix: 'listening', label: '1 Listening Exercise' },
  2: { name: 'Writing', icon: PenTool, linkSuffix: 'writing', label: '1 Writing Prompt' },
  3: { name: 'Speaking', icon: Mic, linkSuffix: 'speaking', label: '1 Speaking Task' },
  4: { name: 'Reading', icon: FileText, linkSuffix: 'reading', label: '1 Reading Exercise' },
  5: { name: 'Listening', icon: Headphones, linkSuffix: 'listening', label: '1 Listening Exercise' },
  6: { name: 'Review Mistakes', icon: BookMarked, linkSuffix: null, label: 'Review Mistakes / Exam Practice' },
};

// Count vocab entries per level
const VOCAB_COUNT = {};
['A1','A2','B1','B2','C1'].forEach(l => { VOCAB_COUNT[l] = (germanVocabulary[l] || []).length; });

// Count grammar entries per level
const GRAMMAR_COUNT = {};
['A1','A2','B1','B2','C1'].forEach(l => { GRAMMAR_COUNT[l] = (grammarData[l] || []).length; });

export default function Dashboard() {
  const [state, setState] = useState(getState());
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    updateStreak();
    const s = getState();
    setState({ ...s });
    generateDailyTasks(s);
  }, []);

  // === Unlocked level detection ===
  const activeLevel = useMemo(() => {
    // Check C1 down to A1 -- find the highest level that is unlocked
    const order = ['A1','A2','B1','B2','C1'];
    for (let i = order.length - 1; i >= 0; i--) {
      if (isLevelUnlocked(order[i], levelsData.levels)) {
        return order[i];
      }
    }
    return 'A1';
  }, [state.exams]);

  // === Highest passed level ===
  const highestPassedLevel = useMemo(() => {
    const order = ['A1','A2','B1','B2','C1'];
    for (let i = order.length - 1; i >= 0; i--) {
      if (state.exams[order[i]]?.passed) return order[i];
    }
    return null;
  }, [state.exams]);

  // === Current study level (active unlocked, or the one being worked on) ===
  const studyLevel = state.currentLevel;

  // === Next incomplete lesson ===
  const nextLesson = useMemo(() => {
    const completed = state.completedLessons?.[studyLevel] || [];
    const levelLessons = allLessons.filter(l => l.level === studyLevel);
    return levelLessons.find(l => !completed.includes(l.id)) || null;
  }, [state.completedLessons, studyLevel]);

  // === All lessons done for current level? ===
  const allLessonsDone = useMemo(() => {
    const completed = state.completedLessons?.[studyLevel] || [];
    const levelLessons = allLessons.filter(l => l.level === studyLevel);
    return levelLessons.length > 0 && levelLessons.every(l => completed.includes(l.id));
  }, [state.completedLessons, studyLevel]);

  // === Exam unlocked? ===
  const examReady = useMemo(() => {
    const levelData = levelsData.levels.find(l => l.id === studyLevel);
    if (!levelData) return false;
    return isExamUnlocked(studyLevel, levelData);
  }, [state.levels, studyLevel, state.writings, state.speakingRecordings]);

  // === Due vocab words ===
  const dueVocabCount = useMemo(() => {
    const words = germanVocabulary[studyLevel] || [];
    const ids = words.map(w => w.id);
    return getDueVocabWords(ids).length;
  }, [studyLevel, state.vocabularyMastery]);

  // === Grammar progress ===
  const grammarProgress = useMemo(() => {
    const prog = state.levels[studyLevel];
    if (!prog || !prog.grammar) return 0;
    return Math.min(prog.grammar.length, GRAMMAR_COUNT[studyLevel]);
  }, [state.levels, studyLevel]);

  // === Lesson progress ===
  const lessonProgress = useMemo(() => {
    const completed = state.completedLessons?.[studyLevel] || [];
    const total = allLessons.filter(l => l.level === studyLevel).length;
    return { completed: completed.length, total };
  }, [state.completedLessons, studyLevel]);

  // === Weak areas ===
  const weakTopics = useMemo(() => {
    try {
      const topics = getWeakTopics();
      return topics.slice(0, 3);
    } catch {
      return [];
    }
  }, [state.topicWeakness]);

  // === Mistake count ===
  const mistakesCount = Object.keys(state.mistakeNotebook || {}).length;

  // === Today's skill based on day of week ===
  const todaySkill = DAY_SKILL[new Date().getDay()];

  const checkTodayActivity = (items) => {
    if (!items || !items.length) return false;
    const today = new Date().toISOString().split('T')[0];
    return items.some(item => {
      if (typeof item === 'string') return item.startsWith(today);
      if (item.date) return item.date.startsWith(today);
      return false;
    });
  };

  const generateDailyTasks = (s) => {
    const level = s.currentLevel;
    const prog = s.levels[level] || {};
    const today = new Date().toISOString().split('T')[0];
    const tasks = [];

    const completedLessons = s.completedLessons[level] || [];
    const levelLessons = allLessons.filter(l => l.level === level);
    const next = levelLessons.find(l => !completedLessons.includes(l.id));

    if (next) {
      tasks.push({
        id: 'lesson',
        label: `Complete Lesson: ${next.title}`,
        done: completedLessons.includes(next.id),
        link: `/level/${level}/lessons/${next.id}`,
      });
    } else if (levelLessons.length) {
      tasks.push({
        id: 'lesson',
        label: 'All lessons complete! Take the exam.',
        done: true,
        link: `/level/${level}/exam`,
      });
    }

    tasks.push({ id: 'grammar', label: '10 Grammar Questions', done: checkTodayActivity(prog.grammar), link: `/level/${level}/grammar` });
    tasks.push({ id: 'vocab', label: '20 Vocabulary Flashcards', done: checkTodayActivity(prog.vocab), link: `/level/${level}/vocabulary` });

    // Rotating skill task
    const daySkill = DAY_SKILL[new Date().getDay()];
    if (daySkill.linkSuffix) {
      const skillKey = daySkill.linkSuffix;
      const done = skillKey === 'writing'
        ? (s.writings || []).filter(w => w.level === level && w.date?.startsWith(today)).length > 0
        : skillKey === 'speaking'
          ? (s.speakingRecordings[level] || []).filter(r => r.date?.startsWith(today)).length > 0
          : checkTodayActivity(prog[skillKey]);
      tasks.push({
        id: daySkill.linkSuffix,
        label: daySkill.label,
        done,
        link: `/level/${level}/${daySkill.linkSuffix}`,
      });
    }

    setTodayTasks(tasks);
  };

  const readiness = getReadinessScores();
  const totalLessonsCompleted = ['A1','A2','B1','B2','C1'].reduce((acc, lvl) => acc + getCompletedLessons(lvl).length, 0);

  const totalCompleted = levelsData.levels.reduce((acc, lvl) => {
    const p = state.levels[lvl.id] || {};
    return acc + (p.grammar?.length || 0) + (p.vocab?.length || 0) + (p.reading?.length || 0) + (p.listening?.length || 0) + (state.writings?.filter(w => w.level === lvl.id).length || 0) + ((state.speakingRecordings[lvl.id]?.length) || 0);
  }, 0);

  const currentLevelData = levelsData.levels.find(l => l.id === state.currentLevel);
  const weakestSkill = Object.entries(state.weakAreas[state.currentLevel] || {}).find(([_, v]) => v)?.[0] || 'none';

  // Level unlock progress
  const levelData = levelsData.levels.find(l => l.id === studyLevel);
  const levelProg = state.levels[studyLevel] || {};
  const grammarDone = (levelProg.grammar?.length || 0);
  const grammarTarget = GRAMMAR_COUNT[studyLevel] || 200;
  const vocabDone = (levelProg.vocab?.length || 0);
  const vocabTarget = VOCAB_COUNT[studyLevel] || 500;
  const readingDone = (levelProg.reading?.length || 0);
  const listeningDone = (levelProg.listening?.length || 0);
  const writingDone = (state.writings || []).filter(w => w.level === studyLevel).length;
  const speakingDone = (state.speakingRecordings[studyLevel]?.length || 0);

  return (
    <div>
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
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/placement-test" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
              <Target size={16} className="inline mr-1.5" />Placement Test
            </Link>
            <Link to={`/level/${studyLevel}`} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              <Play size={16} className="inline mr-1.5" />Start Today's Practice
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon={Zap} label="Streak" value={`${state.streak.count} days`} accent="#ff6b00" />
          <StatCard icon={BarChart3} label="Current Level" value={studyLevel} accent="var(--accent)" />
          <StatCard icon={Award} label="Total Completed" value={totalCompleted.toString()} accent="#3bff9e" />
          <StatCard icon={TrendingUp} label="Weekly Focus" value={todaySkill.name} accent="#ff3355" />
          <StatCard icon={Target} label="Exams Passed" value={Object.values(state.exams).filter(e => e.passed).length.toString()} accent="#8b5cf6" />
          <StatCard icon={Target} label="Med German" value={state.medicalUnlocked ? 'Unlocked' : 'Locked'} accent={state.medicalUnlocked ? '#3bff9e' : '#54587a'} />
        </div>

        {/* Daily Study Plan */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <Zap size={16} /> Today's Study Plan ({state.currentLevel})
          </h2>
          <div className="space-y-2">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 text-sm" style={{ color: task.done ? '#3bff9e' : 'var(--text-secondary)' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{
                  backgroundColor: task.done ? 'rgba(59,255,158,0.15)' : 'var(--bg-hover)',
                  border: `1px solid ${task.done ? '#3bff9e' : 'var(--text-muted)'}`,
                  color: task.done ? '#3bff9e' : 'transparent',
                }}>
                  {task.done ? '✓' : ''}
                </div>
                {task.link ? (
                  <Link to={task.link} className="hover:underline" style={{ color: task.done ? '#3bff9e' : 'var(--text-secondary)' }}>
                    {task.label}
                  </Link>
                ) : (
                  <span>{task.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
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
          to={`/level/${studyLevel}/grammar`}
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
          to="/mistake-notebook"
          icon={BookMarked}
          label={`Mistakes${mistakesCount > 0 ? ` (${mistakesCount})` : ''}`}
          accent="#ffaa33"
        />
        <ActionButton
          to={allLessonsDone || examReady ? `/level/${studyLevel}/exam` : `/level/${studyLevel}`}
          icon={ClipboardCheck}
          label={allLessonsDone || examReady ? 'Exam' : 'Level Page'}
          accent="#8b5cf6"
        />
      </div>

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
      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#ff3355' }}>
          <AlertTriangle size={16} /> Weak Areas
        </h2>
        {weakTopics.length > 0 ? (
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
        ) : (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <CheckCircle size={14} style={{ color: '#3bff9e' }} />
            No weak areas yet. Keep studying and they'll appear here.
          </div>
        )}
        {weakTopics.length > 0 && (
          <div className="mt-3 text-right">
            <Link to="/mistake-notebook" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
              View all mistakes and weak areas →
            </Link>
          </div>
        )}
      </div>

      {/* Lessons + Mistake Notebook Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
        <Link to="/mistake-notebook" className="rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,170,51,0.1)' }}>
            <BookMarked size={20} style={{ color: '#ffaa33' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: '#ffaa33' }}>Mistake Notebook</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{mistakesCount} mistakes to review</div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </Link>
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
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
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
