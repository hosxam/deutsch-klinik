import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { clearOnboardingState } from '../utils/onboardingState';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { PageShell, SectionHeader, Card, Button, LevelBadge } from '../components/ui';

const DAILY_MINUTES_OPTIONS = [15, 30, 45, 60, 90];
const DAYS_PER_WEEK_OPTIONS = [3, 4, 5, 6, 7];
const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function SettingsPage() {
  const navigate = useNavigate();
  const state = getState();

  const [dailyMinutes, setDailyMinutes] = useState(state.dailyMinutes || 30);
  const [daysPerWeek, setDaysPerWeek] = useState(state.daysPerWeek || 5);
  const [targetDate, setTargetDate] = useState(state.targetDate || '');
  const [targetLevel, setTargetLevel] = useState(state.targetLevel || 'C1');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveGoal = () => {
    const s = getState();
    s.dailyMinutes = dailyMinutes;
    s.daysPerWeek = daysPerWeek;
    s.targetDate = targetDate || null;
    s.targetLevel = targetLevel;
    updateState(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetOnboarding = () => {
    const s = getState();
    s.onboardingComplete = false;
    s.goalSetupComplete = false;
    s.startLevel = null;
    s.targetLevel = null;
    s.dailyMinutes = 30;
    s.daysPerWeek = 5;
    s.targetDate = null;
    s.estimatedFinishDate = null;
    s.placementResult = null;
    updateState(s);
    clearOnboardingState();
    navigate('/onboarding');
  };

  const handleRetakePlacement = () => {
    const s = getState();
    s.placementResult = null;
    updateState(s);
    navigate('/placement-test');
  };

  const handleResetProgress = () => {
    const s = getState();
    s.levels = {};
    s.exams = {};
    s.writings = [];
    s.speakingRecordings = {};
    s.flashcards = {};
    s.completedLessons = {};
    s.incorrectAnswers = {};
    s.repeatedMistakes = {};
    s.mistakeNotebook = {};
    s.vocabularyMastery = {};
    s.grammarMastery = {};
    s.listeningCompleted = {};
    s.readingCompleted = {};
    s.completedGrammarLessons = {};
    s.readinessScores = {
      reading: 0, listening: 0, writing: 0, speaking: 0,
      grammar: 0, vocabulary: 0, timeManagement: 0,
      overall: 0, completed: false, lastUpdated: null,
    };
    s.topicWeakness = {};
    s.dailyStudyLog = [];
    s.studyLog = {};
    s.remediationQueue = [];
    s.streak = { count: 0, lastDate: null };
    updateState(s);
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleClearAndRestart = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const startLevel = state.startLevel || 'A1';
  const estimate = useMemo(() => {
    const startIdx = LEVEL_ORDER.indexOf(startLevel);
    const targetIdx = LEVEL_ORDER.indexOf(targetLevel);
    let totalMinutes = 0;
    const LEVEL_MINUTES = { A1: 3131, A2: 3250, B1: 4271, B2: 3440, C1: 4525 };
    for (let i = startIdx; i <= targetIdx; i++) {
      totalMinutes += LEVEL_MINUTES[LEVEL_ORDER[i]] || 0;
    }
    const weekly = dailyMinutes * daysPerWeek;
    if (weekly === 0) return null;
    const days = Math.ceil(totalMinutes / weekly);
    const finish = new Date(Date.now() + days * 86400000);
    return finish.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [startLevel, targetLevel, dailyMinutes, daysPerWeek]);

  return (
    <PageShell maxWidth="max-w-lg">
      <SectionHeader
        title="Settings"
        subtitle="Customize your learning experience"
      />

      {/* Study Goal */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-3">Study Goal</h2>

        <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Target Level</label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {LEVEL_ORDER.map(lvl => (
            <button key={lvl}
              onClick={() => setTargetLevel(lvl)}
              className="py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: targetLevel === lvl ? 'var(--accent)' : 'var(--bg-hover)',
                color: targetLevel === lvl ? '#fff' : 'var(--text-primary)',
                border: targetLevel === lvl ? 'none' : '1px solid var(--border)',
              }}
            >{lvl}</button>
          ))}
        </div>

        <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Minutes per day</label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {DAILY_MINUTES_OPTIONS.map(m => (
            <button key={m} onClick={() => setDailyMinutes(m)}
              className="py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: dailyMinutes === m ? 'var(--accent)' : 'var(--bg-hover)',
                color: dailyMinutes === m ? '#fff' : 'var(--text-primary)',
                border: dailyMinutes === m ? 'none' : '1px solid var(--border)',
              }}
            >{m}m</button>
          ))}
        </div>

        <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Days per week</label>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {DAYS_PER_WEEK_OPTIONS.map(d => (
            <button key={d} onClick={() => setDaysPerWeek(d)}
              className="py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: daysPerWeek === d ? 'var(--accent)' : 'var(--bg-hover)',
                color: daysPerWeek === d ? '#fff' : 'var(--text-primary)',
                border: daysPerWeek === d ? 'none' : '1px solid var(--border)',
              }}
            >{d}x</button>
          ))}
        </div>

        {estimate && (
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Est. completion: <strong style={{ color: 'var(--accent)' }}>{estimate}</strong>
          </p>
        )}

        <Button onClick={handleSaveGoal} variant={saved ? 'success' : 'primary'} className="w-full">
          {saved ? 'Saved' : 'Save Goal'}
        </Button>
      </Card>

      {/* Level Progress */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-3">Your Level</h2>
        <div className="flex items-center gap-3">
          <LevelBadge level={startLevel} size="lg" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Starting from &rarr; aiming for{' '}
            <strong style={{ color: 'var(--accent)' }}>{targetLevel}</strong>
          </span>
          <LevelBadge level={targetLevel} size="lg" />
        </div>
      </Card>

      {/* Actions */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold mb-3">Actions</h2>
        <div className="space-y-2">
          <Button onClick={handleResetOnboarding} variant="ghost" className="w-full text-left justify-start">
            <span className="font-semibold">Reset Onboarding</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Go through the setup wizard again
            </span>
          </Button>

          <Button onClick={handleRetakePlacement} variant="ghost" className="w-full text-left justify-start">
            <span className="font-semibold">Retake Placement Test</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Find your recommended starting level again
            </span>
          </Button>

          <Button onClick={() => navigate('/settings/account')} variant="ghost" className="w-full text-left justify-start">
            <span className="font-semibold">Account & Cloud Sync</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isSupabaseConfigured() ? 'Manage cloud backup and sync' : 'Enable cloud sync to save progress online'}
            </span>
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="mb-6" style={{
        background: 'rgba(255,51,85,0.06)',
        border: '1px solid rgba(255,51,85,0.2)',
      }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#ff3355' }}>Danger Zone</h2>
        {!showResetConfirm ? (
          <Button onClick={() => setShowResetConfirm(true)} variant="danger" className="w-full">
            Reset All Local Progress
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              This will delete all your progress, including completed lessons, scores, and flashcards. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowResetConfirm(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleResetProgress} variant="danger" className="flex-1">
                Yes, Reset Everything
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* About */}
      <Card className="mb-6">
        <h2 className="text-sm font-semibold mb-3">About</h2>
        <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex justify-between">
            <span>App</span>
            <span style={{ color: 'var(--text-primary)' }}>Deutsch Klinik C1 Trainer</span>
          </div>
          <div className="flex justify-between">
            <span>Release Phase</span>
            <span style={{ color: 'var(--accent)' }}>Phase 17 complete</span>
          </div>
          <div className="flex justify-between">
            <span>Commit</span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.7rem' }}>2e405bf</span>
          </div>
        </div>

        <div className="mt-4">
          {!showClearConfirm ? (
            <Button onClick={() => setShowClearConfirm(true)} variant="ghost" className="w-full">
              <span className="font-semibold" style={{ color: '#ff3355' }}>Clear Local App Data and Restart</span>
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                This will clear all localStorage data including progress, settings, and session state. The page will reload.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setShowClearConfirm(false)} variant="secondary" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleClearAndRestart} variant="danger" className="flex-1">
                  Clear and Restart
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </PageShell>
  );
}
