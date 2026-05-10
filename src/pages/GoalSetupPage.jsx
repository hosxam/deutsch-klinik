import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { setOnboardingState } from '../utils/onboardingState';
import { PageShell, SectionHeader, Card, Button, LevelBadge, ProgressRing } from '../components/ui';

const LEVEL_MINUTES = {
  A1: 3131,
  A2: 3250,
  B1: 4271,
  B2: 3440,
  C1: 4525,
};

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];

const DAILY_MINUTES_OPTIONS = [15, 30, 45, 60, 90];
const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6, 7];

export default function GoalSetupPage() {
  const navigate = useNavigate();
  const state = getState();

  const startLevel = state.startLevel || 'A1';
  const currentTarget = state.targetLevel || 'C1';

  const [targetLevel, setTargetLevel] = useState(currentTarget);
  const [dailyMinutes, setDailyMinutes] = useState(state.dailyMinutes || 30);
  const [daysPerWeek, setDaysPerWeek] = useState(state.daysPerWeek || 5);
  const [targetDate, setTargetDate] = useState(state.targetDate || '');
  const [submitting, setSubmitting] = useState(false);

  const estimate = useMemo(() => {
    const startIdx = LEVEL_ORDER.indexOf(startLevel);
    const targetIdx = LEVEL_ORDER.indexOf(targetLevel);

    let totalMinutes = 0;
    for (let i = startIdx; i <= targetIdx; i++) {
      totalMinutes += LEVEL_MINUTES[LEVEL_ORDER[i]] || 0;
    }

    const weeklyMinutes = dailyMinutes * daysPerWeek;
    if (weeklyMinutes === 0) return { totalMinutes, estimatedDays: 0, estimatedMonths: 0 };

    const estimatedDays = Math.ceil(totalMinutes / weeklyMinutes);
    const estimatedMonths = Math.ceil(estimatedDays / 4.33);

    const now = new Date();
    const finishDate = new Date(now.getTime() + estimatedDays * 86400000);
    const finishStr = finishDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return {
      totalMinutes,
      estimatedDays,
      estimatedMonths,
      finishStr,
      finishDate: finishDate.toISOString().split('T')[0],
    };
  }, [startLevel, targetLevel, dailyMinutes, daysPerWeek]);

  const handleSubmit = () => {
    setSubmitting(true);

    const s = getState();
    s.startLevel = startLevel;
    s.targetLevel = targetLevel;
    s.currentLevel = startLevel;
    s.dailyMinutes = dailyMinutes;
    s.daysPerWeek = daysPerWeek;
    s.targetDate = targetDate || null;
    s.estimatedFinishDate = estimate.finishDate;
    s.onboardingComplete = true;
    s.goalSetupComplete = true;
    updateState(s);

    setOnboardingState({
      startLevel,
      targetLevel,
      dailyMinutes,
      daysPerWeek,
      targetDate: targetDate || null,
      estimatedFinishDate: estimate.finishDate,
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    navigate('/');
  };

  const levelCount = LEVEL_ORDER.indexOf(targetLevel) - LEVEL_ORDER.indexOf(startLevel) + 1;
  const progressPct = levelCount > 0
    ? ((LEVEL_ORDER.indexOf(targetLevel) - LEVEL_ORDER.indexOf(startLevel) + 1) / 5) * 100
    : 0;

  return (
    <PageShell maxWidth="max-w-lg">
      <SectionHeader
        title="Set Your Study Goals"
        subtitle={`Starting from ${startLevel}, let's define your target and schedule.`}
      />

      {/* Target Level */}
      <Card className="mb-4">
        <label className="text-sm font-semibold mb-3 block">Target Level</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {LEVEL_ORDER.map(lvl => {
            const isBefore = LEVEL_ORDER.indexOf(lvl) < LEVEL_ORDER.indexOf(startLevel);
            const isSelected = targetLevel === lvl;
            return (
              <button
                key={lvl}
                disabled={isBefore}
                onClick={() => setTargetLevel(lvl)}
                className="py-3 rounded-lg text-sm font-bold transition-all relative"
                style={{
                  backgroundColor: isSelected ? 'var(--accent)' : isBefore ? 'var(--bg-hover)' : 'var(--bg-hover)',
                  color: isSelected ? '#fff' : isBefore ? 'var(--text-muted)' : 'var(--text-primary)',
                  opacity: isBefore ? 0.4 : 1,
                  border: isSelected ? 'none' : '1px solid var(--border)',
                }}
              >
                {lvl}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <LevelBadge level={startLevel} size="sm" />
          <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
          <LevelBadge level={targetLevel} size="sm" />
        </div>
      </Card>

      {/* Daily Minutes */}
      <Card className="mb-4">
        <label className="text-sm font-semibold mb-3 block">Minutes per day</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {DAILY_MINUTES_OPTIONS.map(m => (
            <button
              key={m}
              onClick={() => setDailyMinutes(m)}
              className="py-3 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: dailyMinutes === m ? 'var(--accent)' : 'var(--bg-hover)',
                color: dailyMinutes === m ? '#fff' : 'var(--text-primary)',
                border: dailyMinutes === m ? 'none' : '1px solid var(--border)',
              }}
            >
              {m}m
            </button>
          ))}
        </div>
      </Card>

      {/* Days Per Week */}
      <Card className="mb-4">
        <label className="text-sm font-semibold mb-3 block">Days per week</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {DAYS_PER_WEEK_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setDaysPerWeek(d)}
              className="py-3 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: daysPerWeek === d ? 'var(--accent)' : 'var(--bg-hover)',
                color: daysPerWeek === d ? '#fff' : 'var(--text-primary)',
                border: daysPerWeek === d ? 'none' : '1px solid var(--border)',
              }}
            >
              {d}x
            </button>
          ))}
        </div>
      </Card>

      {/* Optional Target Date */}
      <Card className="mb-4">
        <label className="text-sm font-semibold mb-2 block">I have a deadline (optional)</label>
        <input
          type="date"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)}
          className="w-full p-3 rounded-lg text-sm"
          style={{
            backgroundColor: 'var(--bg-hover)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
        />
        {targetDate && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Target: {new Date(targetDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </Card>

      {/* Estimated Completion */}
      <Card className="mb-6" style={{ borderColor: 'var(--accent)' }}>
        <div className="flex items-center gap-6">
          <ProgressRing pct={progressPct} size={80} strokeWidth={6} />
          <div className="flex-1">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              Estimated study time
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {estimate.totalMinutes.toLocaleString()} min total
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              ~{estimate.estimatedDays} days ({estimate.estimatedMonths} months)
            </p>
            <p className="text-xs mt-1 font-semibold" style={{ color: targetDate && new Date(targetDate) < new Date(estimate.finishDate) ? '#ff3355' : '#3bff9e' }}>
              Est. completion: {estimate.finishStr}
            </p>
            {targetDate && new Date(targetDate) < new Date(estimate.finishDate) && (
              <p className="text-xs mt-1" style={{ color: '#ff3355' }}>
                Your deadline is before the estimated completion. Consider increasing study time.
              </p>
            )}
            {targetDate && new Date(targetDate) >= new Date(estimate.finishDate) && (
              <p className="text-xs mt-1" style={{ color: '#3bff9e' }}>
                You&apos;re on track to meet your deadline!
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Setting up...' : 'Start Learning'}
      </Button>
    </PageShell>
  );
}
