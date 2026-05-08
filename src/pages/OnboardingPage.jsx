import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { setOnboardingState } from '../utils/onboardingState';
import { PageShell, FeatureCard, Card, LevelBadge, Button } from '../components/ui';
import { Target, ClipboardCheck, BookOpen, ArrowRight, ChevronRight } from 'lucide-react';

const LEVELS = [
  { id: 'A1', color: '#10b981', label: 'Beginner' },
  { id: 'A2', color: '#14b8a6', label: 'Elementary' },
  { id: 'B1', color: '#f59e0b', label: 'Intermediate' },
  { id: 'B2', color: '#ef4444', label: 'Upper Intermediate' },
  { id: 'C1', color: '#8b5cf6', label: 'Advanced' },
];

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const handlePlacementTest = () => {
    setOnboardingState({ onboardingStarted: true });
    navigate('/placement-test');
  };

  const handlePickLevel = (levelId) => {
    const levelIdx = LEVEL_ORDER.indexOf(levelId);
    const targetLevel = levelIdx < LEVEL_ORDER.length - 1
      ? LEVEL_ORDER[levelIdx + 1]
      : 'C1';

    const state = getState();
    state.startLevel = levelId;
    state.targetLevel = targetLevel;
    state.currentLevel = levelId;
    updateState(state);

    setOnboardingState({
      startLevel: levelId,
      targetLevel: targetLevel,
      onboardingStarted: true,
    });

    navigate('/goal-setup');
  };

  const handleStartFromA1 = () => {
    const state = getState();
    state.startLevel = 'A1';
    state.targetLevel = 'C1';
    state.currentLevel = 'A1';
    updateState(state);

    setOnboardingState({
      startLevel: 'A1',
      targetLevel: 'C1',
      onboardingStarted: true,
    });

    navigate('/goal-setup');
  };

  if (showLevelPicker) {
    return (
      <PageShell maxWidth="max-w-lg">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            What is your current level?
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Pick the level that best describes your German right now.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handlePickLevel(lvl.id)}
              className="w-full text-left px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: lvl.color + '12',
                border: '2px solid ' + lvl.color + '44',
              }}
            >
              <div className="flex items-center gap-3">
                <LevelBadge level={lvl.id} size="md" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{lvl.label}</span>
              </div>
              <ChevronRight size={18} style={{ color: lvl.color }} />
            </button>
          ))}
        </div>

        <Button variant="secondary" className="w-full" onClick={() => setShowLevelPicker(false)}>
          Back
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">👋</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
          Welcome to Deutsch Klinik!
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Let's get you started. How would you like to begin?
        </p>
      </div>

      {/* Option 1: I know my level */}
      <FeatureCard
        title="I know my level"
        description="Already know your German level? Pick it directly and skip the test."
        icon={<Target size={28} />}
        accent="#3bff9e"
        onClick={() => setShowLevelPicker(true)}
        className="mb-3"
      />

      {/* Option 3: Start from A1 */}
      <FeatureCard
        title="Start from A1 (Complete Beginner)"
        description="Completely new to German? We'll start from absolute basics and work up to C1."
        icon={<BookOpen size={28} />}
        accent="#8b5cf6"
        onClick={handleStartFromA1}
        className="mb-3"
      />

      {/* Footer */}
      <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
        You can always change your level later in the dashboard settings.
      </p>
    </PageShell>
  );
}
