import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getState, getLevelProgress, isExamUnlocked, getCompletedLessons } from '../utils/store';
import levelsData from '../data/levels.json';
import lessonsData from '../data/curriculum.json';
import { BookOpen, PenTool, Mic, Headphones, FileText, ShieldCheck, Lock, ChevronRight, BookMarked, GraduationCap, ListChecks } from 'lucide-react';

const skills = [
  { key: 'grammar', label: 'Grammar', icon: BookOpen, color: '#00f0ff', desc: 'Articles, cases, tenses, syntax' },
  { key: 'vocabulary', label: 'Vocabulary', icon: BookMarked, color: '#3bff9e', desc: 'Words, phrases, flashcards, SRS' },
  { key: 'reading', label: 'Reading', icon: FileText, color: '#f59e0b', desc: 'Goethe-style texts and comprehension' },
  { key: 'listening', label: 'Listening', icon: Headphones, color: '#8b5cf6', desc: 'Dialogues, interviews, lectures' },
  { key: 'writing', label: 'Writing', icon: PenTool, color: '#ff3bcd', desc: 'Emails, essays, formal letters' },
  { key: 'speaking', label: 'Speaking', icon: Mic, color: '#ff6b00', desc: 'Presentations, discussions, dialogues' },
];

export default function LevelPage() {
  const { levelId } = useParams();
  const [state, setState] = useState(getState());
  const levelData = levelsData.levels.find(l => l.id === levelId);
  const prog = state.levels[levelId] || {};
  const examUnlocked = isExamUnlocked(levelId, levelData);

  useEffect(() => {
    const interval = setInterval(() => {
      setState({ ...getState() });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedLessons = getCompletedLessons(levelId);

  if (!levelData) {
    return <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Level not found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${levelData.color}20`, color: levelData.color }}>
          {levelId}
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: levelData.color }}>Level {levelId}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{levelData.description}</p>
        </div>
      </div>

      {/* Structured Lessons Card */}
      <Link to={`/level/${levelId}/lessons`} className="rounded-xl p-5 mb-6 flex items-center gap-4 transition-all hover:scale-[1.01] group" style={{
        background: `linear-gradient(135deg, ${levelData.color}15, var(--bg-card))`,
        border: `1px solid ${completedLessons.length > 0 ? levelData.color : 'var(--border)'}`,
      }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${levelData.color}20` }}>
          <GraduationCap size={26} style={{ color: levelData.color }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2" style={{ color: levelData.color }}>
            Structured Lessons
            <ChevronRight size={16} />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {completedLessons.length} lessons completed &middot; Follow a step-by-step curriculum from start to exam-ready
          </p>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{
            border: `2px solid ${completedLessons.length > 0 ? levelData.color : 'var(--text-muted)'}`,
            color: completedLessons.length > 0 ? levelData.color : 'var(--text-muted)',
          }}>
            {completedLessons.length}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>done</div>
        </div>
      </Link>

      {/* Skill Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {skills.map(skill => {
          const doneCount = getLevelProgress(levelId, skill.key === 'vocabulary' ? 'vocab' : skill.key).length;
          const isVocab = skill.key === 'vocabulary';
          const path = isVocab ? `/level/${levelId}/vocabulary` : `/level/${levelId}/${skill.key}`;
          
          return (
            <Link key={skill.key} to={path} className="rounded-xl p-4 transition-all hover:scale-[1.02] group" style={{
              backgroundColor: 'var(--bg-card)',
              border: `1px solid ${doneCount > 0 ? `${skill.color}40` : 'var(--border)'}`,
            }}>
              <div className="flex items-center gap-3 mb-2">
                <skill.icon size={22} style={{ color: skill.color }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: skill.color }}>{skill.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{skill.desc}</div>
                </div>
                <ChevronRight size={16} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <div className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min((doneCount / 20) * 100, 100)}%`, backgroundColor: skill.color }} />
                </div>
                {doneCount} done
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mini Tests and Exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link to={`/level/${levelId}/vocabulary/flashcards`} className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,255,158,0.1)' }}>
            <BookMarked size={20} style={{ color: '#3bff9e' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Flashcard Review</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Spaced repetition vocabulary practice</div>
          </div>
        </Link>

        <div className="rounded-xl p-4 flex items-center gap-3" style={{
          backgroundColor: 'var(--bg-card)',
          border: `1px solid ${examUnlocked ? levelData.color : 'var(--border)'}`,
          opacity: examUnlocked ? 1 : 0.6,
        }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${levelData.color}20` }}>
            <ShieldCheck size={20} style={{ color: examUnlocked ? levelData.color : 'var(--text-muted)' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2">
              Goethe-Style Exam
              {!examUnlocked && <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {examUnlocked ? 'Ready to take!' : 'Complete all requirements to unlock'}
            </div>
          </div>
          {examUnlocked && (
            <Link to={`/level/${levelId}/exam`} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: levelData.color, color: '#fff' }}>
              Start Exam
            </Link>
          )}
        </div>
      </div>

      {/* Requirements Progress */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--accent)' }}>Exam Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <Requirement label="Grammar Units" current={prog.grammar?.length || 0} target={levelData.grammarUnits} />
          <Requirement label="Vocabulary Units" current={prog.vocab?.length || 0} target={levelData.vocabularyUnits} />
          <Requirement label="Mini Quizzes" current={prog.quizzes?.length || 0} target={3} />
          <Requirement label="Writing Tasks" current={(state.writings || []).filter(w => w.level === levelId).length} target={levelData.minWritingTasks} />
          <Requirement label="Speaking Tasks" current={(state.speakingRecordings[levelId] || []).length} target={levelData.minSpeakingTasks} />
          <Requirement label="Listening Tests" current={prog.listening?.length || 0} target={levelData.minListeningTests} />
        </div>
      </div>
    </div>
  );
}

function Requirement({ label, current, target }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1" style={{ color: 'var(--text-secondary)' }}>
        <span>{label}</span>
        <span>{current}/{target}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#3bff9e' : 'var(--accent)' }} />
      </div>
    </div>
  );
}
