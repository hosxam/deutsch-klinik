import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getState, updateState, updateStreak, getLevelProgress, getReadinessScores, getCompletedLessons } from '../utils/store';
import levelsData from '../data/levels.json';
import allLessonsData from '../data/germanLessons.json';
import { Zap, Target, BarChart3, Award, TrendingUp, ChevronRight, Play, BookOpen, Mic, Headphones, PenTool, FileText, ClipboardCheck, AlertTriangle, BookMarked, GraduationCap } from 'lucide-react';

const skillIcons = {
  grammar: BookOpen,
  vocab: BookOpen,
  reading: FileText,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

const allLessons = allLessonsData;

export default function Dashboard() {
  const [state, setState] = useState(getState());
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    updateStreak();
    const s = getState();
    setState({ ...s });
    generateDailyTasks(s);
  }, []);

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
    const nextLesson = levelLessons.find(l => !completedLessons.includes(l.id));

    if (nextLesson) {
      tasks.push({
        id: 'lesson',
        label: `Complete Lesson: ${nextLesson.title}`,
        done: completedLessons.includes(nextLesson.id),
        link: `/level/${level}/lessons/${nextLesson.id}`,
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
    tasks.push({ id: 'reading', label: '1 Reading Exercise', done: checkTodayActivity(prog.reading), link: `/level/${level}/reading` });
    tasks.push({ id: 'listening', label: '1 Listening Exercise', done: checkTodayActivity(prog.listening), link: `/level/${level}/listening` });
    tasks.push({ id: 'writing', label: '1 Writing Prompt', done: (s.writings || []).filter(w => w.level === level && w.date?.startsWith(today)).length > 0, link: `/level/${level}/writing` });
    tasks.push({ id: 'speaking', label: '1 Speaking Task', done: (s.speakingRecordings[level] || []).filter(r => r.date?.startsWith(today)).length > 0, link: `/level/${level}/speaking` });

    setTodayTasks(tasks);
  };

  const readiness = getReadinessScores();
  const totalLessonsCompleted = ['A1','A2','B1','B2','C1'].reduce((acc, lvl) => acc + getCompletedLessons(lvl).length, 0);
  const mistakesCount = Object.keys(state.mistakeNotebook || {}).length;

  const totalCompleted = levelsData.levels.reduce((acc, lvl) => {
    const p = state.levels[lvl.id] || {};
    return acc + (p.grammar?.length || 0) + (p.vocab?.length || 0) + (p.reading?.length || 0) + (p.listening?.length || 0) + (state.writings?.filter(w => w.level === lvl.id).length || 0) + ((state.speakingRecordings[lvl.id]?.length) || 0);
  }, 0);

  const currentLevelData = levelsData.levels.find(l => l.id === state.currentLevel);
  const weakestSkill = Object.entries(state.weakAreas[state.currentLevel] || {}).find(([_, v]) => v)?.[0] || 'none';

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
            <Link to={`/level/${state.currentLevel}`} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              <Play size={16} className="inline mr-1.5" />Start Today's Practice
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Left: Stats */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon={Zap} label="Streak" value={`${state.streak.count} days`} accent="#ff6b00" />
          <StatCard icon={BarChart3} label="Current Level" value={state.currentLevel} accent="var(--accent)" />
          <StatCard icon={Award} label="Total Completed" value={totalCompleted.toString()} accent="#3bff9e" />
          <StatCard icon={TrendingUp} label="Weakest Skill" value={weakestSkill.charAt(0).toUpperCase() + weakestSkill.slice(1)} accent="#ff3355" />
          <StatCard icon={Target} label="Exams Passed" value={Object.values(state.exams).filter(e => e.passed).length.toString()} accent="#8b5cf6" />
          <StatCard icon={Target} label="Med German" value={state.medicalUnlocked ? 'Unlocked' : 'Locked'} accent={state.medicalUnlocked ? '#3bff9e' : '#54587a'} />
        </div>

        {/* Right: Daily Study Plan */}
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

      {/* Lessons + Mistake Notebook Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Link to={`/level/${state.currentLevel}/lessons`} className="rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
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

        {/* Skill mini-bars */}
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
          const unlocked = state.currentLevel === lvl.id || (() => { if (!lvl.requires) return true; const e = state.exams[lvl.requires]; return e && e.passed; })() || false;

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
