import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { clearOnboardingState } from '../utils/onboardingState';
import { isSupabaseConfigured } from '../lib/supabaseClient';

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
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
        Settings
      </h1>

      {/* Study Goal */}
      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-3">Study Goal</h2>

        <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Target Level</label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {LEVEL_ORDER.map(lvl => (
            <button key={lvl}
              onClick={() => setTargetLevel(lvl)}
              className="py-2 rounded-lg text-sm font-bold"
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
              className="py-2 rounded-lg text-sm font-bold"
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
              className="py-2 rounded-lg text-sm font-bold"
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

        <button onClick={handleSaveGoal}
          className="w-full py-2.5 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: saved ? 'rgba(59,255,158,0.2)' : 'var(--accent)',
            color: saved ? '#3bff9e' : '#fff',
            border: saved ? '1px solid rgba(59,255,158,0.3)' : 'none' }}
        >
          {saved ? 'Saved' : 'Save Goal'}
        </button>
      </div>

      {/* Actions */}
      <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold mb-3">Actions</h2>
        <div className="space-y-2">
          <button onClick={handleResetOnboarding}
            className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all hover:scale-[1.005]"
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            <span className="font-semibold">Reset Onboarding</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Go through the setup wizard again
            </span>
          </button>

          <button onClick={handleRetakePlacement}
            className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all hover:scale-[1.005]"
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            <span className="font-semibold">Retake Placement Test</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Find your recommended starting level again
            </span>
          </button>

          <button onClick={() => navigate('/settings/account')}
            className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all hover:scale-[1.005]"
            style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            <span className="font-semibold">Account & Cloud Sync</span>
            <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isSupabaseConfigured() ? 'Manage cloud backup and sync' : 'Enable cloud sync to save progress online'}
            </span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl p-5 mb-6" style={{
        backgroundColor: 'rgba(255,51,85,0.06)',
        border: '1px solid rgba(255,51,85,0.2)',
      }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#ff3355' }}>Danger Zone</h2>
        {!showResetConfirm ? (
          <button onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: 'rgba(255,51,85,0.1)',
              color: '#ff3355',
              border: '1px solid rgba(255,51,85,0.3)',
            }}
          >
            Reset All Local Progress
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              This will delete all your progress, including completed lessons, scores, and flashcards. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#ff3355', color: '#fff' }}
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
