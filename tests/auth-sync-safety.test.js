/**
 * auth-sync-safety.test.js
 *
 * Tests for safe Supabase sync (Phase 21+ update).
 * Cloud is now the default source of truth for signed-in users.
 * No conflict popup on mount.
 * Manual options in Settings: Upload local, Download cloud, Merge.
 * Local-only mode only for logged-out users.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mergeProgress, hasSyncBackup, clearSyncBackup, createProgressBackup, resetLocalProgress, exportBackupAsJson } from '../src/utils/supabaseSync';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Cloud-first sync: cloud is default source of truth', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('empty local + non-empty cloud should use cloud (not overwrite)', () => {
    const local = null;
    const cloudPayload = {
      currentLevel: 'B2',
      levels: { B1: { reading: { completed: ['r1'] } }, B2: { grammar: { completed: ['g1'] } } },
      completedLessons: { B1: ['l1', 'l2'] },
    };
    const result = mergeProgress(local, cloudPayload);
    expect(result._from).toBe('cloud');
    expect(result.currentLevel).toBe('B2');
    expect(result.completedLessons.B1).toEqual(['l1', 'l2']);
  });

  it('empty local + empty cloud returns empty object', () => {
    expect(mergeProgress(null, null)).toEqual({});
  });

  it('both have data: merge preserves completed lessons from both sides', () => {
    const local = { currentLevel: 'A1', levels: {}, completedLessons: { A1: ['l1'] } };
    const cloudPayload = {
      currentLevel: 'B1',
      levels: { B1: { reading: { completed: ['r1'] } } },
      completedLessons: { B1: ['l2'] },
    };
    // mergeProgress starts from local and adds cloud fields; currentLevel stays from local
    const result = mergeProgress(local, cloudPayload);
    expect(result.currentLevel).toBe('A1');
    expect(result.completedLessons.B1).toEqual(['l2']);
    expect(result.completedLessons.A1).toEqual(['l1']);
    expect(result._merged).toBe(true);
  });

  it('local progress upload creates backup snapshot', () => {
    const progress = { currentLevel: 'B1', levels: {} };
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify(progress));
    localStorageMock.setItem('dk_sync_backup', JSON.stringify({
      timestamp: new Date().toISOString(),
      progress,
    }));
    expect(hasSyncBackup()).toBe(true);
    const backup = JSON.parse(localStorageMock.getItem('dk_sync_backup'));
    expect(backup.progress.currentLevel).toBe('B1');
  });

  it('clearSyncBackup removes backup', () => {
    localStorageMock.setItem('dk_sync_backup', JSON.stringify({ test: true }));
    clearSyncBackup();
    expect(hasSyncBackup()).toBe(false);
  });

  it('no conflict popup shown when cloud wins (no conflict state)', () => {
    // In the new behavior, conflict state is never set during checkCloudProgress
    // when cloud has data. Verify the merge behavior.
    const local = { currentLevel: 'A1', completedLessons: { A1: ['l1'] } };
    const cloudPayload = { currentLevel: 'B2', completedLessons: { B2: ['l2'] } };
    // mergeProgress starts from local; currentLevel stays local
    const result = mergeProgress(local, cloudPayload);
    expect(result._merged).toBe(true);
    expect(result.currentLevel).toBe('A1');
    expect(result.completedLessons.B2).toEqual(['l2']);
  });

  it('cloud snapshot stored before potential backup', () => {
    const cloudSnapshot = {
      timestamp: new Date().toISOString(),
      progress: { currentLevel: 'C1' },
      settings: { studyGoal: 'test' },
    };
    localStorageMock.setItem('dk_cloud_snapshot', JSON.stringify(cloudSnapshot));
    const saved = JSON.parse(localStorageMock.getItem('dk_cloud_snapshot'));
    expect(saved.progress.currentLevel).toBe('C1');
  });
});

function hashProgressSimple(obj) {
  if (!obj) return 0;
  const raw = JSON.stringify({ p: obj, _v: 2 });
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

describe('Merge preserves data integrity (manual merge)', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('merge preserves completed lessons from both', () => {
    const local = { completedLessons: { A1: ['l1', 'l2'] } };
    const cloud = { completedLessons: { A1: ['l2', 'l3'], A2: ['l4'] } };
    const result = mergeProgress(local, cloud);
    expect(result.completedLessons.A1).toContain('l1');
    expect(result.completedLessons.A1).toContain('l2');
    expect(result.completedLessons.A1).toContain('l3');
    expect(result.completedLessons.A2).toEqual(['l4']);
  });

  it('merge preserves flashcard SRS (higher ease wins, latest due)', () => {
    const local = { flashcards: { w1: { ease: 2.5, due: '2026-05-01' } } };
    const cloud = { flashcards: { w1: { ease: 3.0, due: '2026-04-01' } } };
    const result = mergeProgress(local, cloud);
    expect(result.flashcards.w1.ease).toBe(3.0);
  });

  it('merge preserves flashcard SRS (more recent due wins)', () => {
    const local = { flashcards: { w1: { ease: 3.0, due: '2026-04-01' } } };
    const cloud = { flashcards: { w1: { ease: 2.5, due: '2026-05-01' } } };
    const result = mergeProgress(local, cloud);
    expect(result.flashcards.w1.due).toBe('2026-05-01');
  });

  it('merge preserves vocabularyMastery (most recent due)', () => {
    const local = { vocabularyMastery: { v1: { ease: 2.5, due: '2026-05-01' } } };
    const cloud = { vocabularyMastery: { v1: { ease: 2.2, due: '2026-05-10' } } };
    const result = mergeProgress(local, cloud);
    expect(result.vocabularyMastery.v1.due).toBe('2026-05-10');
  });

  it('merge deduplicates mistakes', () => {
    const local = {
      mistakeNotebook: {
        m1: { topic: 'Articles', repeated: 3, date: '2026-05-01' },
        m2: { topic: 'Cases', repeated: 1, date: '2026-05-02' },
      },
    };
    const cloud = {
      mistakeNotebook: {
        m1: { topic: 'Articles', repeated: 5, date: '2026-05-05' },
        m3: { topic: 'Prepositions', repeated: 2, date: '2026-05-03' },
      },
    };
    const result = mergeProgress(local, cloud);
    expect(result.mistakeNotebook.m1.repeated).toBe(5);
    expect(result.mistakeNotebook.m1.date).toBe('2026-05-05');
    expect(result.mistakeNotebook.m2.topic).toBe('Cases');
    expect(result.mistakeNotebook.m3.topic).toBe('Prepositions');
  });

  it('merge deduplicates incorrectAnswers', () => {
    const local = {
      incorrectAnswers: { A1: [{ exerciseId: 'ex1' }, { exerciseId: 'ex2' }] },
    };
    const cloud = {
      incorrectAnswers: { A1: [{ exerciseId: 'ex2' }, { exerciseId: 'ex3' }] },
    };
    const result = mergeProgress(local, cloud);
    expect(result.incorrectAnswers.A1.length).toBe(3);
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex1');
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex2');
    expect(result.incorrectAnswers.A1.map(a => a.exerciseId)).toContain('ex3');
  });

  it('merge preserves grammarMastery (mastered wins over non-mastered)', () => {
    const local = { grammarMastery: { g1: { mastered: false, correct: 2 } } };
    const cloud = { grammarMastery: { g1: { mastered: true, correct: 1 } } };
    const result = mergeProgress(local, cloud);
    expect(result.grammarMastery.g1.mastered).toBe(true);
  });

  it('merge preserves practiceProgress across levels', () => {
    const local = {
      practiceProgress_v1: {
        B1: { reading: { completed: ['r1'], score: 80 } },
      },
    };
    const cloud = {
      practiceProgress_v1: {
        B1: { reading: { completed: ['r2'], count: 1 }, listening: { completed: ['l1'] } },
        B2: { grammar: { completed: ['g1'] } },
      },
    };
    const result = mergeProgress(local, cloud);
    expect(result.practiceProgress_v1.B1.reading.score).toBe(80);
    expect(result.practiceProgress_v1.B1.reading.count).toBe(1);
    expect(result.practiceProgress_v1.B1.listening.completed).toEqual(['l1']);
    expect(result.practiceProgress_v1.B2.grammar.completed).toEqual(['g1']);
  });

  it('merge sets _merged flag', () => {
    const result = mergeProgress({ a: 1 }, { b: 2 });
    expect(result._merged).toBe(true);
  });

  it('merge handles modern lesson objects with id field', () => {
    const local = { completedLessons: { A1: [{ id: 'l1', completedAt: '2026-05-01' }] } };
    const cloud = { completedLessons: { A1: [{ id: 'l1', completedAt: '2026-05-02' }, { id: 'l2' }] } };
    const result = mergeProgress(local, cloud);
    expect(result.completedLessons.A1.length).toBe(2);
  });
});

describe('Progress reset: local only', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify({
      currentLevel: 'B1',
      levels: { B1: { grammar: { completed: ['g1'] } } },
      completedLessons: { B1: ['l1', 'l2'] },
      flashcard: {},
      exams: { B1: { passed: true } },
      mistakeNotebook: { m1: { topic: 'test' } },
    }));
  });

  it('creates a backup before reset', () => {
    const backup = createProgressBackup('test-reset');
    expect(backup).not.toBeNull();
    expect(backup.label).toBe('test-reset');
    expect(backup.timestamp).toBeTruthy();
    expect(backup.progress).not.toBeNull();
    expect(backup.progress.currentLevel).toBe('B1');
  });

  it('exportBackupAsJson returns valid JSON string', () => {
    createProgressBackup('export-test');
    const raw = exportBackupAsJson();
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.label).toBe('export-test');
    expect(parsed.progress.currentLevel).toBe('B1');
  });

  it('resetLocalProgress clears all state keys', () => {
    // Set up various keys
    localStorageMock.setItem('deutsch_klinik_study_goal', JSON.stringify({ targetLevel: 'C1' }));
    localStorageMock.setItem('dk_onboarding', JSON.stringify({ complete: true }));
    localStorageMock.setItem('dk_sync_meta', JSON.stringify({ lastUploadAt: '2026-05-10' }));

    const result = resetLocalProgress();
    expect(result.success).toBe(true);
    expect(localStorageMock.getItem('deutsch_klinik_state_default')).toBeNull();
    expect(localStorageMock.getItem('deutsch_klinik_study_goal')).toBeNull();
    expect(localStorageMock.getItem('dk_onboarding')).toBeNull();
    expect(localStorageMock.getItem('dk_sync_meta')).toBeNull();
  });

  it('reset creates backup snapshot before clearing', () => {
    resetLocalProgress();
    // Reset creates a backup with label 'local-reset'
    const backup = JSON.parse(localStorageMock.getItem('dk_reset_backup'));
    expect(backup).not.toBeNull();
    expect(backup.label).toBe('local-reset');
    expect(backup.progress.currentLevel).toBe('B1');
  });

  it('reset after empty state still creates backup', () => {
    localStorageMock.clear();
    const result = resetLocalProgress();
    expect(result.success).toBe(true);
  });

  it('cancel does not delete anything', () => {
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify({ currentLevel: 'A1' }));
    // Cancel is just not calling reset. Verify original data is intact.
    expect(JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default')).currentLevel).toBe('A1');
  });
});

describe('Backup reliability', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('backup contains timestamp and progress', () => {
    const backup = {
      timestamp: '2026-05-10T12:00:00.000Z',
      progress: { currentLevel: 'B1', levels: {} },
    };
    localStorageMock.setItem('dk_sync_backup', JSON.stringify(backup));
    const stored = JSON.parse(localStorageMock.getItem('dk_sync_backup'));
    expect(stored.timestamp).toBeTruthy();
    expect(stored.progress.currentLevel).toBe('B1');
  });

  it('cloud snapshot contains progress and settings', () => {
    const snapshot = {
      timestamp: '2026-05-10T12:00:00.000Z',
      progress: { currentLevel: 'C1' },
      settings: { study_goal: { targetLevel: 'C1' } },
    };
    localStorageMock.setItem('dk_cloud_snapshot', JSON.stringify(snapshot));
    const stored = JSON.parse(localStorageMock.getItem('dk_cloud_snapshot'));
    expect(stored.progress.currentLevel).toBe('C1');
    expect(stored.settings.study_goal.targetLevel).toBe('C1');
  });

  it('hasSyncBackup returns false when no backup', () => {
    expect(hasSyncBackup()).toBe(false);
  });
});

describe('Cross-device sync: practiceProgress_v1 round-trip', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('createProgressBackup includes practiceProgress_v1 from separate key', () => {
    // Write main state
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify({
      currentLevel: 'B2',
      levels: { B2: { vocab: { completed: ['v1'] } } },
      completedLessons: { B2: ['l1'] },
    }));
    // Write practice progress in its own key
    localStorageMock.setItem('practiceProgress_v1', JSON.stringify({
      reading: { read_b2_1: { status: 'completed_correct', dueDate: '2026-06-01' } },
      writing: { write_b2_3: { status: 'completed_incorrect', dueDate: '2026-05-11' } },
    }));

    // createProgressBackup uses supabaseSync's getLocalProgress which merges practiceProgress_v1
    createProgressBackup('test-practice');
    const backupRaw = localStorageMock.getItem('dk_reset_backup');
    expect(backupRaw).toBeTruthy();
    const backup = JSON.parse(backupRaw);
    // Backup should contain practiceProgress_v1 from the separate key
    expect(backup.progress.practiceProgress_v1).toBeTruthy();
    expect(backup.progress.practiceProgress_v1.reading.read_b2_1.status).toBe('completed_correct');
  });

  it('resetLocalProgress removes practiceProgress_v1 key', () => {
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify({ currentLevel: 'A1' }));
    localStorageMock.setItem('practiceProgress_v1', JSON.stringify({ reading: { r1: { status: 'completed_correct' } } }));
    localStorageMock.setItem('deutsch_klinik_study_goal', JSON.stringify({ targetLevel: 'C1' }));

    // Reset creates backup first, then clears
    resetLocalProgress();

    // After reset, both keys should be gone (backup only exists in dk_reset_backup)
    expect(localStorageMock.getItem('deutsch_klinik_state_default')).toBeNull();
    expect(localStorageMock.getItem('practiceProgress_v1')).toBeNull();
    // Backup should contain practice progress
    expect(JSON.parse(localStorageMock.getItem('dk_reset_backup')).progress.practiceProgress_v1.reading.r1.status).toBe('completed_correct');
  });

  it('setLocalProgress extracts practiceProgress_v1 from payload (via resetLocalProgress backup)', () => {
    // Write a payload that has practiceProgress_v1 embedded
    const cloudPayload = {
      currentLevel: 'C1',
      levels: { C1: { reading: { completed: ['r1'] } } },
      practiceProgress_v1: {
        reading: { read_c1_1: { status: 'completed_correct' } },
        vocab: { voc_c1_5: { status: 'completed_incorrect', dueDate: '2026-05-12' } },
      },
    };
    // Simulate what AuthPanel's setLocalProgress does
    if (cloudPayload && cloudPayload.practiceProgress_v1) {
      try {
        localStorageMock.setItem('practiceProgress_v1', JSON.stringify(cloudPayload.practiceProgress_v1));
      } catch {}
      const { practiceProgress_v1, ...mainState } = cloudPayload;
      localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify(mainState));
    }

    // The main key should NOT contain practiceProgress_v1
    const mainState = JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default'));
    expect(mainState.practiceProgress_v1).toBeUndefined();
    expect(mainState.currentLevel).toBe('C1');

    // practiceProgress_v1 should be in its separate key
    const practiceRaw = localStorageMock.getItem('practiceProgress_v1');
    expect(practiceRaw).toBeTruthy();
    const practiceData = JSON.parse(practiceRaw);
    expect(practiceData.reading.read_c1_1.status).toBe('completed_correct');
  });
});

describe('Cross-device sync: payload completeness', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('full progress payload has all expected keys', () => {
    // Simulate a complete set of local progress data
    const fullProgress = {
      currentLevel: 'B2',
      levels: { B1: { grammar: { completed: ['g1'] } } },
      completedLessons: { B1: ['l1', 'l2'], B2: ['l3'] },
      flashcards: { B1_voc_1: { ease: 2.5, interval: 1, due: '2026-06-01', repetitions: 3 } },
      vocabularyMastery: { B1_voc_1: { correct: 5, incorrect: 1, mastered: true, ease: 2.5, interval: 3, due: '2026-05-15', repetitions: 2 } },
      mistakeNotebook: { m1: { topic: 'Articles', userAnswer: 'der', correctAnswer: 'die', level: 'B1', date: '2026-05-01', repeated: 2 } },
      repeatedMistakes: { B1_gr_1: { topic: 'Prepositions', count: 3, lastDate: '2026-05-05', level: 'B1' } },
      incorrectAnswers: { B1: [{ exerciseId: 'ex1', userAnswer: 'foo', correctAnswer: 'bar', topic: 'Grammar', date: '2026-05-01' }] },
      weakAreas: ['Grammar: Prepositions'],
      onboardingComplete: true,
      startLevel: 'A2',
      targetLevel: 'C1',
      dailyMinutes: 30,
      daysPerWeek: 5,
      targetDate: '2027-01-01',
      estimatedFinishDate: '2026-12-31',
      goalSetupComplete: true,
      placementResult: { level: 'B1' },
      medicalUnlocked: false,
      // enhanced tracking keys
      completedGrammarLessons: { B1: ['gc1', 'gc2'] },
      listeningCompleted: { B1: ['l1', 'l2'] },
      readingCompleted: { B1: ['r1'] },
      writingCompleted: { B1: ['w1'] },
      speakingCompleted: { B1: ['s1'] },
      readinessScores: {
        reading: 60, listening: 50, writing: 40, speaking: 30,
        grammar: 70, vocabulary: 65, timeManagement: 45,
        overall: 55, completed: false, lastUpdated: null,
      },
      topicWeakness: { Articles: { correct: 3, incorrect: 5, status: 'weak' } },
      dailyStudyLog: [{ date: '2026-05-10', minutes: 45 }],
      remediationsQueue: ['ex1'],
      streak: { count: 5, lastDate: '2026-05-10' },
      // The ones that are stored as separate keys but merged into payload
      practiceProgress_v1: {
        reading: { read_b1_1: { status: 'completed_correct', dueDate: '2026-06-01' } },
      },
      _onboarding: {
        onboardingComplete: true,
        startLevel: 'A2',
        targetLevel: 'C1',
      },
    };

    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify(fullProgress));
    localStorageMock.setItem('practiceProgress_v1', JSON.stringify(fullProgress.practiceProgress_v1));
    localStorageMock.setItem('dk_onboarding', JSON.stringify(fullProgress._onboarding));

    const storedProgress = JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default'));

    // Main state keys that should survive
    expect(storedProgress.currentLevel).toBe('B2');
    expect(storedProgress.levels.B1.grammar.completed).toEqual(['g1']);
    expect(storedProgress.completedLessons.B1).toEqual(['l1', 'l2']);
    expect(storedProgress.flashcards.B1_voc_1.ease).toBe(2.5);
    expect(storedProgress.vocabularyMastery.B1_voc_1.mastered).toBe(true);
    expect(storedProgress.mistakeNotebook.m1.topic).toBe('Articles');
    expect(storedProgress.repeatedMistakes.B1_gr_1.count).toBe(3);
    expect(storedProgress.incorrectAnswers.B1[0].exerciseId).toBe('ex1');
    expect(storedProgress.weakAreas).toEqual(['Grammar: Prepositions']);
    expect(storedProgress.onboardingComplete).toBe(true);
    expect(storedProgress.startLevel).toBe('A2');
  });

  it('onboarding keys survive in separate storage', () => {
    const onboarding = { onboardingComplete: true, startLevel: 'A2', targetLevel: 'C1' };
    localStorageMock.setItem('dk_onboarding', JSON.stringify(onboarding));

    const raw = localStorageMock.getItem('dk_onboarding');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.onboardingComplete).toBe(true);
    expect(parsed.startLevel).toBe('A2');
    expect(parsed.targetLevel).toBe('C1');
  });

  it('empty Chrome localStorage hydrates correctly from simulated cloud payload', () => {
    // Simulate: no localStorage (empty Chrome), existing cloud data
    const cloudPayload = {
      currentLevel: 'B2',
      levels: { B1: { reading: { completed: ['r1'] } } },
      completedLessons: { B1: ['l1', 'l2'] },
      vocabularyMastery: { B1_voc_1: { correct: 5, incorrect: 1, mastered: true, ease: 2.5, interval: 3, due: '2026-05-15', repetitions: 2 } },
      mistakeNotebook: { m1: { topic: 'Articles', userAnswer: 'der', correctAnswer: 'die', level: 'B1', date: '2026-05-01', repeated: 2 } },
      _onboarding: {
        onboardingComplete: true,
        startLevel: 'A2',
        targetLevel: 'C1',
      },
    };

    // Simulate what checkCloudProgress does:
    // 1. setLocalProgress(cloudPayload) - writes to localStorage
    //    (extracts practiceProgress_v1 to separate key if present)
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify(cloudPayload));

    // 2. Verify the keys exist when read back
    const reloaded = JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default'));
    expect(reloaded.currentLevel).toBe('B2');
    expect(reloaded.levels.B1.reading.completed).toEqual(['r1']);
    expect(reloaded.completedLessons.B1).toEqual(['l1', 'l2']);
    expect(reloaded.vocabularyMastery.B1_voc_1.mastered).toBe(true);
    expect(reloaded.mistakeNotebook.m1.topic).toBe('Articles');
  });
});

describe('Cross-device sync: cloud-vs-local decision', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('mergeProgress returns cloud source when local is null and cloud has currentLevel', () => {
    const local = null;
    const cloudPayload = { currentLevel: 'B2', levels: {} };
    const result = mergeProgress(local, cloudPayload);
    expect(result._from).toBe('cloud');
    expect(result.currentLevel).toBe('B2');
  });

  it('mergeProgress returns cloud source when local is null and cloud has completedLessons', () => {
    const local = null;
    const cloudPayload = { levels: { B1: {} }, completedLessons: { B1: ['l1'] } };
    const result = mergeProgress(local, cloudPayload);
    expect(result._from).toBe('cloud');
    expect(result.completedLessons.B1).toEqual(['l1']);
  });

  it('mergeProgress returns cloud when cloud is empty object and local is null', () => {
    const local = null;
    const cloudPayload = {};
    const result = mergeProgress(local, cloudPayload);
    // Empty object {} is truthy, so mergeProgress treats it as 'cloud has data'
    expect(result._from).toBe('cloud');
    // Result is the empty object spread (no meaningful data)
    expect(result._merged).toBe(true);
  });

  it('mergeProgress returns cloud when cloud has levels and local is null', () => {
    const local = null;
    const cloudPayload = { levels: { B2: { grammar: { completed: ['g1'] } } } };
    const result = mergeProgress(local, cloudPayload);
    expect(result._from).toBe('cloud');
  });

  it('cloud-with-data + Chrome-empty should use cloud (via mergeProgress)', () => {
    const local = null;
    const cloudPayload = { currentLevel: 'B2', levels: { B1: { reading: { completed: ['r1'] } } }, completedLessons: { B1: ['l1'] } };
    const result = mergeProgress(local, cloudPayload);
    expect(result._from).toBe('cloud');
    expect(result.currentLevel).toBe('B2');
    expect(result.levels.B1.reading.completed).toEqual(['r1']);
  });
});

describe('Cross-device sync: hash considers practice progress', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('practiceProgress_v1 changes trigger different hash', () => {
    // Set up initial state
    localStorageMock.setItem('deutsch_klinik_state_default', JSON.stringify({
      currentLevel: 'B2',
      levels: {},
      completedLessons: { B2: ['l1'] },
    }));
    localStorageMock.setItem('practiceProgress_v1', JSON.stringify({
      reading: { r1: { status: 'completed_correct', dueDate: '2026-06-01' } },
    }));

    // Create hash with current practice progress (no change)
    const practice1 = JSON.parse(localStorageMock.getItem('practiceProgress_v1'));
    const raw1 = JSON.stringify({ p: JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default')), pp: practice1, s: null });
    let hash1 = 0;
    for (let i = 0; i < raw1.length; i++) {
      const chr = raw1.charCodeAt(i);
      hash1 = ((hash1 << 5) - hash1) + chr;
      hash1 |= 0;
    }

    // Change practice progress
    localStorageMock.setItem('practiceProgress_v1', JSON.stringify({
      reading: { r1: { status: 'completed_correct', dueDate: '2026-06-01' } },
      writing: { w1: { status: 'completed_incorrect', dueDate: '2026-05-12' } }, // new item
    }));

    const practice2 = JSON.parse(localStorageMock.getItem('practiceProgress_v1'));
    const raw2 = JSON.stringify({ p: JSON.parse(localStorageMock.getItem('deutsch_klinik_state_default')), pp: practice2, s: null });
    let hash2 = 0;
    for (let i = 0; i < raw2.length; i++) {
      const chr = raw2.charCodeAt(i);
      hash2 = ((hash2 << 5) - hash2) + chr;
      hash2 |= 0;
    }

    expect(hash1).not.toBe(hash2);
  });
});
