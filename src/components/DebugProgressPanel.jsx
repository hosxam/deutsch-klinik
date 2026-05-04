import { getState, updateState, isExamUnlocked, getCompletedLessons } from '../utils/store';
import levelsData from '../data/levels.json';

export default function DebugProgressPanel({ currentLevel }) {
  const state = getState();
  const levelId = currentLevel || state.currentLevel || 'A1';
  const levelData = levelsData.levels.find(l => l.id === levelId);
  const prog = state.levels[levelId] || {};
  const completedLessons = getCompletedLessons(levelId);
  const examUnlocked = isExamUnlocked(levelId, levelData);

  const grammarCount = prog.grammar?.length || 0;
  const vocabCount = prog.vocab?.length || 0;
  const writingCount = (state.writings || []).filter(w => w.level === levelId).length;
  const speakingCount = (state.speakingRecordings?.[levelId] || []).length;
  const listeningCount = prog.listening?.length || 0;
  const readingCount = prog.reading?.length || 0;

  const handleExport = () => {
    const raw = localStorage.getItem('deutsch_klinik_state');
    navigator.clipboard.writeText(raw || '{}').catch(() => {});
  };

  const handleReset = () => {
    if (!window.confirm('Reset all progress? This cannot be undone.')) return;
    localStorage.removeItem('deutsch_klinik_state');
    window.location.reload();
  };

  const handleUnlock = () => {
    if (!window.confirm(`Fill minimum progress to unlock ${levelId} exam?`)) return;
    const grammarFill = levelData?.grammarUnits || 10;
    const vocabFill = levelData?.vocabularyUnits || 10;
    const writingFill = levelData?.minWritingTasks || 10;
    const speakingFill = levelData?.minSpeakingTasks || 10;
    const listeningFill = levelData?.minListeningTests || 5;
    const readingFill = levelData?.minReadingTests || 5;
    const state = getState();

    if (!state.levels[levelId]) state.levels[levelId] = {};
    const prog = state.levels[levelId];

    // Fill grammar
    if (!prog.grammar || prog.grammar.length < grammarFill) {
      prog.grammar = Array.from({ length: grammarFill }, (_, i) => ({
        id: `debug_fill_grammar_${i}`,
        score: 100,
        date: new Date().toISOString(),
      }));
    }

    // Fill vocab
    if (!prog.vocab || prog.vocab.length < vocabFill) {
      prog.vocab = Array.from({ length: vocabFill }, (_, i) => ({
        id: `debug_fill_vocab_${i}`,
        score: 100,
        date: new Date().toISOString(),
      }));
    }

    // Fill listening
    if (!prog.listening || prog.listening.length < listeningFill) {
      prog.listening = Array.from({ length: listeningFill }, (_, i) => ({
        id: `debug_fill_listening_${i}`,
        score: 100,
        date: new Date().toISOString(),
      }));
    }

    // Fill reading
    if (!prog.reading || prog.reading.length < readingFill) {
      prog.reading = Array.from({ length: readingFill }, (_, i) => ({
        id: `debug_fill_reading_${i}`,
        score: 100,
        date: new Date().toISOString(),
      }));
    }

    // Fill lessons
    if (!state.completedLessons[levelId] || state.completedLessons[levelId].length < 10) {
      state.completedLessons[levelId] = Array.from({ length: 10 }, (_, i) => `debug_fill_lesson_${i}`);
    }

    // Fill writings
    if ((state.writings || []).filter(w => w.level === levelId).length < writingFill) {
      const existing = state.writings || [];
      const need = writingFill - existing.filter(w => w.level === levelId).length;
      const newWritings = Array.from({ length: need }, (_, i) => ({
        id: `debug_fill_writing_${i}`,
        level: levelId,
        prompt: 'Debug fill writing',
        text: 'Debug fill',
        date: new Date().toISOString(),
      }));
      state.writings = [...existing, ...newWritings];
    }

    // Fill speaking
    if (!state.speakingRecordings[levelId] || state.speakingRecordings[levelId].length < speakingFill) {
      state.speakingRecordings[levelId] = Array.from({ length: speakingFill }, (_, i) => ({
        id: `debug_fill_speaking_${i}`,
        level: levelId,
        prompt: 'Debug fill speaking',
        date: new Date().toISOString(),
        blobUrl: '',
      }));
    }

    updateState(state);
    window.location.reload();
  };

  return (
    <div style={{
      marginTop: '1rem',
      padding: '0.75rem',
      borderRadius: '10px',
      border: '1px solid #f59e0b',
      backgroundColor: '#1a1a2e',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
    }}>
      <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem' }}>
        Debug Panel (DEV only)
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155' }}>
            <th style={thStyle}>Key</th>
            <th style={thStyle}>Count</th>
            <th style={thStyle}>Target</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'Level', current: levelId, target: '–' },
            { label: 'Grammar', current: grammarCount, target: levelData?.grammarUnits || 10 },
            { label: 'Vocabulary', current: vocabCount, target: levelData?.vocabularyUnits || 10 },
            { label: 'Lessons', current: completedLessons.length, target: 10 },
            { label: 'Writing', current: writingCount, target: levelData?.minWritingTasks || 10 },
            { label: 'Speaking', current: speakingCount, target: levelData?.minSpeakingTasks || 10 },
            { label: 'Listening', current: listeningCount, target: levelData?.minListeningTests || 5 },
            { label: 'Reading', current: readingCount, target: levelData?.minReadingTests || 5 },
            { label: 'Exam', current: examUnlocked ? 'YES' : 'NO', target: '–' },
          ].map(row => (
            <tr key={row.label} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={tdStyle}>{row.label}</td>
              <td style={{ ...tdStyle, color: row.current === 'YES' ? '#3bff9e' : row.current === 'NO' ? '#ef4444' : '#e2e8f0' }}>{row.current}</td>
              <td style={{ ...tdStyle, color: '#64748b' }}>{row.target}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={handleExport} style={btnStyle}>Export State</button>
        <button onClick={handleUnlock} style={{ ...btnStyle, borderColor: '#3bff9e', color: '#3bff9e' }}>Unlock {levelId}</button>
        <button onClick={handleReset} style={{ ...btnStyle, borderColor: '#ef4444', color: '#ef4444' }}>Reset Progress</button>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '0.25rem 0.5rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.65rem',
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '0.25rem 0.5rem',
  color: '#e2e8f0',
};

const btnStyle = {
  padding: '0.25rem 0.5rem',
  fontSize: '0.7rem',
  borderRadius: '6px',
  border: '1px solid #f59e0b',
  backgroundColor: 'transparent',
  color: '#f59e0b',
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontWeight: 600,
};
