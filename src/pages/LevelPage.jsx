import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PageShell, SectionHeader, Card, Button, LevelBadge, ProgressRing, FeatureCard } from '../components/ui';
import { getState, getLevelProgress, isExamUnlocked, getCompletedLessons } from '../utils/store';
import { getPracticeItemStatus } from '../utils/practiceProgress';
import levelsData from '../data/levels.json';
import '../data/curriculum.json';
import writingData from '../data/writing.json';
import speakingData from '../data/speaking.json';
import { BookOpen, PenTool, Mic, Headphones, FileText, ShieldCheck, Lock, ChevronRight, BookMarked, GraduationCap, ArrowRight } from 'lucide-react';

const skills = [
  { key: 'grammar', label: 'Grammar', icon: BookOpen, color: '#00f0ff', desc: 'Articles, cases, tenses, syntax' },
  { key: 'vocabulary', label: 'Vocabulary', icon: BookMarked, color: '#3bff9e', desc: 'Words, phrases, flashcards, SRS' },
  { key: 'reading', label: 'Reading', icon: FileText, color: '#f59e0b', desc: 'Goethe-style texts and comprehension' },
  { key: 'listening', label: 'Listening', icon: Headphones, color: '#8b5cf6', desc: 'Dialogues, interviews, lectures' },
  { key: 'writing', label: 'Writing', icon: PenTool, color: '#ff3bcd', desc: 'Emails, essays, formal letters' },
  { key: 'speaking', label: 'Speaking', icon: Mic, color: '#ff6b00', desc: 'Presentations, discussions, dialogues' },
];

export default function LevelPage() {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const [state, setState] = useState(getState());
  const levelData = levelsData.levels.find(l => l.id === levelId);

  useEffect(() => {
    const interval = setInterval(() => {
      setState({ ...getState() });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!levelData) {
    return <PageShell><div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Level not found</div></PageShell>;
  }

  const prog = state.levels[levelId] || {};
  const examUnlocked = isExamUnlocked(levelId, levelData);

  const completedLessons = getCompletedLessons(levelId);

  // Count writing prompts that are completed_correct via practiceProgress
  const levelPrompts = (writingData[levelId] || []);
  const writingCompletedCount = levelPrompts.filter(p => getPracticeItemStatus('writing', p.id).status === 'completed_correct').length;
  const levelSpeakingPrompts = speakingData[levelId] || [];
  const speakingCompletedCount = levelSpeakingPrompts.filter(p => getPracticeItemStatus('speaking', p.id).status === 'completed_correct').length;
  const speakingNeedsReviewCount = levelSpeakingPrompts.filter(p => getPracticeItemStatus('speaking', p.id).status === 'completed_incorrect').length;

  // Compute missing exam requirements for locked messaging
  const requirements = [
    { label: 'Grammar', current: prog.grammar?.length || 0, target: levelData?.grammarUnits || 10 },
    { label: 'Vocabulary', current: prog.vocab?.length || 0, target: levelData?.vocabularyUnits || 10 },
    { label: 'Lessons', current: completedLessons.length, target: 10 },
    { label: 'Writing', current: writingCompletedCount, target: levelData?.minWritingTasks || 10 },
    { label: 'Speaking', current: speakingCompletedCount, target: levelData?.minSpeakingTasks || 10 },
    { label: 'Listening', current: prog.listening?.length || 0, target: levelData?.minListeningTests || 5 },
    { label: 'Reading', current: prog.reading?.length || 0, target: levelData?.minReadingTests || 5 },
  ];
  const missingRequirements = requirements.filter(r => r.current < r.target);

  return (
    <PageShell>
      <SectionHeader
        title={<span className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg inline-flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${levelData.color}20`, color: levelData.color }}>{levelId}</span> <span style={{ color: levelData.color }}>Level {levelId}</span></span>}
        subtitle={levelData.description}
        action={<LevelBadge level={levelId} size="lg" />}
      />

      {/* Structured Lessons Card */}
      <Card hover onClick={() => navigate(`/level/${levelId}/lessons`)} className="mb-6 flex items-center gap-4" style={{
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
      </Card>

      {/* Skill Grid */}
      <SectionHeader title="Skill Modules" subtitle="Practice each area to unlock the exam" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {skills.map(skill => {
          const doneCount = getLevelProgress(levelId, skill.key === 'vocabulary' ? 'vocab' : skill.key).length;
          const isVocab = skill.key === 'vocabulary';
          const path = isVocab ? `/level/${levelId}/vocabulary` : `/level/${levelId}/${skill.key}`;
          // Map skill key to the appropriate levels.json target field
          const targetFieldMap = {
            grammar: 'grammarUnits',
            vocabulary: 'vocabularyUnits',
            reading: 'minReadingTests',
            listening: 'minListeningTests',
            writing: 'minWritingTasks',
            speaking: 'minSpeakingTasks',
          };
          const target = levelData[targetFieldMap[skill.key]] || 10;
          // Writing and speaking use different storage paths than getLevelProgress
          let displayCount = doneCount;
          if (skill.key === 'writing') {
            displayCount = levelPrompts.filter(p => getPracticeItemStatus('writing', p.id).status === 'completed_correct').length;
          } else if (skill.key === 'speaking') {
            displayCount = levelSpeakingPrompts.filter(p => getPracticeItemStatus('speaking', p.id).status === 'completed_correct').length;
          }
          
          return (
            <Card key={skill.key} hover onClick={() => navigate(path)} className="flex flex-col gap-2 p-4" style={{ border: `1px solid ${displayCount > 0 ? `${skill.color}40` : 'var(--border)'}` }}>
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
                  <div className="h-full rounded-full" style={{ width: `${Math.min((displayCount / target) * 100, 100)}%`, backgroundColor: skill.color }} />
                </div>
                {displayCount} done
              </div>
            </Card>
          );
        })}
      </div>

      {/* Mini Tests and Exam */}
      <SectionHeader title="Review & Exam" subtitle="Prepare for your Goethe-style exam" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card hover onClick={() => navigate(`/level/${levelId}/vocabulary/flashcards`)} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,255,158,0.1)' }}>
            <BookMarked size={20} style={{ color: '#3bff9e' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Flashcard Review</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Spaced repetition vocabulary practice</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3" style={{
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
            <Button onClick={() => navigate(`/level/${levelId}/exam`)} variant="primary" size="sm" className="shrink-0" style={{ backgroundColor: levelData.color, color: '#fff' }}>
              Start Exam
            </Button>
          )}
        </Card>
      </div>

      {/* Missing requirements card — only shown when exam is locked */}
      {!examUnlocked && missingRequirements.length > 0 && (
        <Card className="mb-4" style={{ border: '1px solid #ef4444' }}>
          <SectionHeader
            title={<span className="flex items-center gap-2" style={{ color: '#ef4444', fontSize: '0.85rem' }}>Complete these to unlock the exam</span>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {missingRequirements.map(r => (
              <div key={r.label} className="flex items-center justify-between py-1 px-2 rounded" style={{
                backgroundColor: 'var(--bg-hover)',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: r.current === 0 ? '#ef4444' : 'var(--accent)' }}>
                  {r.current}/{r.target}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Exam Requirements Progress */}
      {examUnlocked && (
        <Card>
          <SectionHeader title="Exam Requirements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Requirement label="Grammar Units" current={prog.grammar?.length || 0} target={levelData.grammarUnits} />
            <Requirement label="Vocabulary Units" current={prog.vocab?.length || 0} target={levelData.vocabularyUnits} />
            <Requirement label="Writing Tasks" current={writingCompletedCount} target={levelData.minWritingTasks} />
            <Requirement label="Speaking Tasks" current={speakingCompletedCount} target={levelData.minSpeakingTasks} />
            <Requirement label="Listening Tests" current={prog.listening?.length || 0} target={levelData.minListeningTests} />
            <Requirement label="Reading Tests" current={prog.reading?.length || 0} target={levelData.minReadingTests} />
          </div>
        </Card>
      )}

      {/* Weak Areas for this level */}
      {(() => {
        // Defensive: always coerce weakAreas to array (survives corrupt localStorage)
        const w = Array.isArray(state.weakAreas) ? state.weakAreas : [];
        return w.filter(i => i.level === levelId || !i.level).length > 0;
      })() && (
        <Card className="mt-4" style={{ border: '1px solid rgba(255,51,85,0.3)' }}>
          <SectionHeader
            title={<span className="flex items-center gap-2" style={{ color: '#ff3355', fontSize: '0.85rem' }}>Weak Areas</span>}
          />
          <div className="space-y-2">
            {(() => {
              const safeAreas = Array.isArray(state.weakAreas) ? state.weakAreas : [];
              return safeAreas
                .filter(w => w.level === levelId || !w.level)
                .slice(0, 10)
                .map((weak, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--bg-hover)' }}>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weak.topic}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{weak.count || 1} {weak.count === 1 ? 'error' : 'errors'}</span>
                </div>
              ));
            })()}
          </div>
          <Link
            to="/mistake-notebook"
            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
            style={{ color: '#ffaa33' }}
          >
            Review all mistakes <ArrowRight size={14} />
          </Link>
        </Card>
      )}
    </PageShell>
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
