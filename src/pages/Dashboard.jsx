import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getState, updateState, updateStreak, getLevelProgress } from '../utils/store';
import levelsData from '../data/levels.json';
import { Zap, Target, BarChart3, Award, TrendingUp, ChevronRight, Play, BookOpen, Mic, Headphones, PenTool, FileText } from 'lucide-react';

const skillIcons = {
  grammar: BookOpen,
  vocab: BookOpen,
  reading: FileText,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

export default function Dashboard() {
  const [state, setState] = useState(getState());
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    updateStreak();
    const s = getState();
    setState({ ...s });
    generateDailyTasks(s);
  }, []);

  const generateDailyTasks = (s) => {
    const level = s.currentLevel;
    const prog = s.levels[level] || {};
    const tasks = [];
    
    tasks.push({ id: 'grammar', label: '10 Grammar Questions', done: (prog.grammar && prog.grammar.length > 0) });
    tasks.push({ id: 'vocab', label: '20 Vocabulary Flashcards', done: (prog.vocab && prog.vocab.length > 0) });
    tasks.push({ id: 'reading', label: '1 Reading Exercise', done: (prog.reading && prog.reading.length > 0) });
    tasks.push({ id: 'listening', label: '1 Listening Exercise', done: (prog.listening && prog.listening.length > 0) });
    tasks.push({ id: 'writing', label: '1 Writing Prompt', done: (s.writings && s.writings.filter(w => w.level === level).length > 0) });
    tasks.push({ id: 'speaking', label: '1 Speaking Task', done: (s.speakingRecordings[level] && s.speakingRecordings[level].length > 0) });
    
    setTodayTasks(tasks);
  };

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
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
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

        {/* Right: Daily Tasks */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <Zap size={16} /> Daily Tasks ({state.currentLevel})
          </h2>
          <div className="space-y-2">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 text-sm" style={{ color: task.done ? '#3bff9e' : 'var(--text-secondary)' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{
                  backgroundColor: task.done ? 'rgba(59,255,158,0.15)' : 'var(--bg-hover)',
                  border: `1px solid ${task.done ? '#3bff9e' : 'var(--text-muted)'}`,
                  color: task.done ? '#3bff9e' : 'transparent',
                }}>
                  {task.done ? '✓' : ''}
                </div>
                {task.label}
              </div>
            ))}
          </div>
          <Link to={`/level/${state.currentLevel}`} className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            Go to level <ChevronRight size={14} />
          </Link>
        </div>
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
