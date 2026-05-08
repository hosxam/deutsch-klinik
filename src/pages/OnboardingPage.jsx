import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateState, getState } from '../utils/store';
import { setOnboardingState } from '../utils/onboardingState';
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
    // Mark that onboarding is in progress
    setOnboardingState({ onboardingStarted: true });
    navigate('/placement-test');
  };

  const handlePickLevel = (levelId) => {
    const levelIdx = LEVEL_ORDER.indexOf(levelId);
    const targetLevel = levelIdx < LEVEL_ORDER.length - 1
      ? LEVEL_ORDER[levelIdx + 1]
      : 'C1';

    // Save to store
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
      <div className="max-w-lg mx-auto py-8 px-4">
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
              <div>
                <span className="text-lg font-bold" style={{ color: lvl.color }}>{lvl.id}</span>
                <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>{lvl.label}</span>
              </div>
              <ChevronRight size={18} style={{ color: lvl.color }} />
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLevelPicker(false)}
          className="w-full py-2.5 rounded-lg text-sm"
          style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border)' }}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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

      {/* Option 1: Placement Test */}
      <button
        onClick={handlePlacementTest}
        className="w-full text-left mb-3 rounded-xl p-5 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(0,240,255,0.12)' }}
          >
            <ClipboardCheck size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Take a placement test
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Answer 30 questions about grammar, vocabulary, and reading to find your perfect starting level.
              Recommended for new learners.
            </p>
            <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              Start test <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </button>

      {/* Option 2: I know my level */}
      <button
        onClick={() => setShowLevelPicker(true)}
        className="w-full text-left mb-3 rounded-xl p-5 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(59,255,158,0.12)' }}
          >
            <Target size={24} style={{ color: '#3bff9e' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              I know my level
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Already know your German level? Pick it directly and skip the test.
            </p>
            <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: '#3bff9e' }}>
              Select level <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </button>

      {/* Option 3: Start from A1 */}
      <button
        onClick={handleStartFromA1}
        className="w-full text-left rounded-xl p-5 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(139,92,246,0.12)' }}
          >
            <BookOpen size={24} style={{ color: '#8b5cf6' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Start from A1 (Complete Beginner)
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Completely new to German? We'll start from absolute basics and work up to C1.
            </p>
            <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: '#8b5cf6' }}>
              Start learning <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </button>

      {/* Footer */}
      <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
        You can always change your level later in the dashboard settings.
      </p>
    </div>
  );
}
