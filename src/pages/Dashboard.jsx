import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageShell, SectionHeader, Card } from '../components/ui';
import {
  getState, getCompletedLessons, getDueVocabWords, getCurrentStudyLevel, getCompletedGrammarLessons
} from '../utils/store';
import { collectActivityDates, calculateCurrentStreak, getLast7DaysActivity, getWeeklyActiveCount, getLocalDateKey } from '../utils/activityStreak';
import levelsData from '../data/levels.json';
import dashboardSummary from '../data/dashboardSummary.json';
import grammarCurriculum from '../data/grammarCurriculum.json';
import {
  Target, BarChart3, Award, BookOpen, Mic, Headphones, PenTool, FileText,
  BookMarked, GraduationCap, CheckCircle, AlertTriangle, ArrowRight, Flame, ChevronRight
} from 'lucide-react';
import StudyGoalTracker from '../components/StudyGoalTracker';
import AuthPanel from '../components/AuthPanel';

const allLessons = Object.values(dashboardSummary.lessonSummaries || {}).flat();

const levelColors = { A1: '#10b981', A2: '#14b8a6', B1: '#f59e0b', B2: '#ef4444', C1: '#8b5cf6' };

export default function Dashboard() {
  const [state] = useState(getState());
  const studyLevel = getCurrentStudyLevel();

  // === Level progress counts ===
  const levelData = levelsData.levels.find(l => l.id === studyLevel);
  const prog = state.levels[studyLevel] || {};
  const lessonsCompleted = getCompletedLessons(studyLevel).length;
  const totalLessons = allLessons.filter(l => l.level === studyLevel).length;
  const gcLevel = grammarCurriculum[studyLevel] || [];
  const gcDone = getCompletedGrammarLessons(studyLevel).length;
  const grammarDone = (prog.grammar?.length || 0);
  const grammarTarget = levelData?.grammarUnits || 10;
  const vocabDone = (prog.vocab?.length || 0);
  const vocabTarget = levelData?.vocabularyUnits || 10;
  const readingDone = (prog.reading?.length || 0);
  const listeningDone = (prog.listening?.length || 0);
  const writingDone = (state.writings || []).filter(w => w.level === studyLevel).length;
  const speakingDone = (state.speakingRecordings[studyLevel]?.length || 0);
  const mistakesCount = Object.keys(state.mistakeNotebook || {}).length;

  // === Due vocab count ===
  const dueVocabCount = useMemo(() => {
    const ids = dashboardSummary.vocabIds[studyLevel] || [];
    return getDueVocabWords(ids).length;
  }, [studyLevel]);

  // === Streak ===
  const activityDatesSet = useMemo(() => collectActivityDates(state), [state]);
  const currentStreak = useMemo(() => calculateCurrentStreak(activityDatesSet), [activityDatesSet]);
  const last7Days = useMemo(() => getLast7DaysActivity(activityDatesSet), [activityDatesSet]);
  const weeklyActiveCount = useMemo(() => getWeeklyActiveCount(activityDatesSet), [activityDatesSet]);
  const activeToday = useMemo(() => activityDatesSet.has(getLocalDateKey()), [activityDatesSet]);

  // === Total completed across all levels ===
  const totalCompleted = levelsData.levels.reduce((acc, lvl) => {
    const p = state.levels[lvl.id] || {};
    return acc + (p.grammar?.length || 0) + (p.vocab?.length || 0) + (p.reading?.length || 0) + (p.listening?.length || 0) + (state.writings?.filter(w => w.level === lvl.id).length || 0) + ((state.speakingRecordings[lvl.id]?.length) || 0);
  }, 0);

  const supabaseUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : null;

  return (
    <PageShell>
      {/* Hero section */}
      <div className="rounded-xl p-6 md:p-8 mb-6" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(139,92,246,0.08))', border: '1px solid var(--border)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              Deutsch Klinik C1 Trainer
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Your central study hub. Tracks progress, stores mistakes, and connects lessons with practice.
            </p>
            <p className="mt-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {levelsData.levels.find(l => l.id === studyLevel)?.description || 'Learn German from A1 to C1'}
            </p>
          </div>
          <Link to={`/level/${studyLevel}/daily`} className="px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5" style={{ backgroundColor: 'var(--accent)', color: '#000' }}>
            <ArrowRight size={16} />Start Today’s Session
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '3px solid #ff6b00' }}>
          <Flame size={18} style={{ color: '#ff6b00' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: '#ff6b00' }}>{currentStreak}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Streak</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${levelColors[studyLevel] || 'var(--accent)'}` }}>
          <Target size={18} style={{ color: levelColors[studyLevel] || 'var(--accent)' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: levelColors[studyLevel] || 'var(--accent)' }}>{studyLevel}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Current Level</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '3px solid #3bff9e' }}>
          <Award size={18} style={{ color: '#3bff9e' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: '#3bff9e' }}>{totalCompleted}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Completed</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '3px solid #8b5cf6' }}>
          <BarChart3 size={18} style={{ color: '#8b5cf6' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: '#8b5cf6' }}>{Object.values(state.exams).filter(e => e.passed).length}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Exams Passed</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '3px solid #f59e0b' }}>
          <BookMarked size={18} style={{ color: '#f59e0b' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>{dueVocabCount}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Flashcards Due</div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `3px solid ${state.medicalUnlocked ? '#3bff9e' : '#54587a'}` }}>
          <Award size={18} style={{ color: state.medicalUnlocked ? '#3bff9e' : '#54587a' }} className="mb-2" />
          <div className="text-3xl font-bold mb-1" style={{ color: state.medicalUnlocked ? '#3bff9e' : '#54587a' }}>{state.medicalUnlocked ? 'Yes' : 'No'}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Med German</div>
        </div>
      </div>

      {/* Current Level Overview */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><Target size={18} /> Current Level: {studyLevel}</span>}
          subtitle={<>Lessons: <strong>{lessonsCompleted}</strong>/{totalLessons} completed</>}
        />
        <div className="space-y-2 mb-4">
          <ProgressBarCompact label="Lessons" done={lessonsCompleted} total={totalLessons} color={levelColors[studyLevel] || 'var(--accent)'} />
          {gcLevel.length > 0 && <ProgressBarCompact label="Grammar Lessons" done={gcDone} total={gcLevel.length} color="#a855f7" />}
          <ProgressBarCompact label="Grammar" done={grammarDone} total={grammarTarget} color="#f59e0b" />
          <ProgressBarCompact label="Vocab" done={vocabDone} total={vocabTarget} color="#3bff9e" />
          <ProgressBarCompact label="Reading" done={readingDone} total={levelData?.minReadingTests || 5} color="#06b6d4" />
          <ProgressBarCompact label="Listening" done={listeningDone} total={levelData?.minListeningTests || 5} color="#ec4899" />
          <ProgressBarCompact label="Writing" done={writingDone} total={levelData?.minWritingTasks || 10} color="#ff3bcd" />
          <ProgressBarCompact label="Speaking" done={speakingDone} total={levelData?.minSpeakingTasks || 10} color="#ff6b00" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/level/${studyLevel}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            View Level
          </Link>
          <Link to={`/level/${studyLevel}/lessons`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: levelColors[studyLevel] || 'var(--accent)', color: '#000' }}>
            Continue Lessons <ArrowRight size={16} />
          </Link>
        </div>
      </Card>

      {/* Study Goal Tracker */}
      <div className="mb-6">
        <StudyGoalTracker />
      </div>

      {/* Recommended Practice */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><GraduationCap size={18} /> Recommended Practice</span>}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {mistakesCount > 0 ? 'Review Your Mistakes' : 'Start Today’s Session'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {mistakesCount > 0
                ? `You have ${mistakesCount} mistake${mistakesCount === 1 ? '' : 's'} that need review.`
                : 'Continue your daily practice and stay on track.'}
            </div>
          </div>
          <Link
            to={mistakesCount > 0 ? '/mistake-notebook' : `/level/${studyLevel}/daily`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0"
            style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
          >
            {mistakesCount > 0 ? 'Review Mistakes' : 'Start Session'} <ArrowRight size={16} />
          </Link>
        </div>
      </Card>

      {/* Mistake Review */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><AlertTriangle size={18} /> Mistake Review</span>}
        />
        {mistakesCount > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'rgba(255,170,51,0.12)', color: '#ffaa33', border: '2px solid rgba(255,170,51,0.25)' }}>
                {mistakesCount}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {mistakesCount} {mistakesCount === 1 ? 'mistake' : 'mistakes'} recorded
                </div>
              </div>
            </div>
            <Link
              to="/mistake-notebook"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#ffaa33', color: '#000' }}
            >
              Review Mistakes <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No mistakes recorded. Keep up the good work!
          </p>
        )}
      </Card>

      {/* Flashcards Due */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><BookMarked size={18} /> Flashcards Due</span>}
        />
        {dueVocabCount > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'rgba(59,255,158,0.12)', color: '#3bff9e', border: '2px solid rgba(59,255,158,0.25)' }}>
                {dueVocabCount}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {dueVocabCount} word{dueVocabCount === 1 ? '' : 's'} due for review
                </div>
              </div>
            </div>
            <Link
              to={`/level/${studyLevel}/vocabulary/flashcards`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#3bff9e', color: '#000' }}
            >
              Review Flashcards <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No flashcards due. Add vocabulary to your study to get started.
          </p>
        )}
      </Card>

      {/* Study Streak */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2"><Flame size={18} /> Study Streak</span>}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
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
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: '#ff6b00', fontWeight: 600 }}>{weeklyActiveCount}</span>/7 days this week
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-end gap-1.5 sm:gap-2.5 justify-center sm:justify-start">
            {last7Days.map((day) => (
              <div key={day.dateKey} className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: day.active
                      ? day.isToday
                        ? 'rgba(255,107,0,0.25)'
                        : 'rgba(59,255,158,0.15)'
                      : 'var(--bg-hover)',
                    border: `1px solid ${
                      day.isToday ? '#ff6b00' : day.active ? 'rgba(59,255,158,0.3)' : 'var(--border)'
                    }`,
                    color: day.active ? (day.isToday ? '#ff6b00' : '#3bff9e') : 'var(--text-muted)',
                  }}
                >
                  {day.active ? (day.isToday ? '⚡' : '✓') : '·'}
                </div>
                <span className="text-[10px] font-medium" style={{ color: day.isToday ? '#ff6b00' : 'var(--text-muted)' }}>
                  {day.dayLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Account & Cloud Sync */}
      <Card className="mb-6">
        <SectionHeader
          title={<span className="flex items-center gap-2">Account & Cloud Sync</span>}
        />
        {supabaseUrl ? (
          <>
            <AuthPanel />
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Link to="/settings/account" className="text-xs" style={{ color: 'var(--accent)' }}>
                Manage account settings
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Cloud sync is not configured. Progress is saved on this device.
          </p>
        )}
      </Card>
    </PageShell>
  );
}

function ProgressBarCompact({ label, done, total, color }) {
  const pct = total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-hover)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-right" style={{ color, minWidth: '3rem' }}>
        {done}{total != null ? `/${total}` : ''}
      </span>
    </div>
  );
}
