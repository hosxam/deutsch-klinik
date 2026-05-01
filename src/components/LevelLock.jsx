import { getState } from '../utils/store';
import levelsData from '../data/levels.json';
import { Lock } from 'lucide-react';

export default function LevelLock({ levelId, children }) {
  const state = getState();

  const isUnlocked = (lid) => {
    const lvl = levelsData.levels.find(l => l.id === lid);
    if (!lvl || !lvl.requires) return true;
    const examResult = state.exams[lvl.requires];
    return examResult && examResult.passed;
  };

  const lvl = levelsData.levels.find(l => l.id === levelId);
  if (!lvl) return <>{children}</>;

  if (!isUnlocked(levelId)) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          backgroundColor: 'rgba(239,68,68,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1rem',
        }}>
          <Lock size={32} style={{ color: '#ef4444' }} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Level Locked
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          This level is locked. Complete and pass the <strong style={{ color: 'var(--accent)' }}>{lvl.requires}</strong> level exam to unlock it.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
