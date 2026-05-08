/**
 * supabaseSync.js
 *
 * Handles migration of local progress to cloud and sync operations.
 */
import { getState, updateState } from './store';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { cloudStorageAdapter } from './cloudStorageAdapter';

const SYNC_BACKUP_KEY = 'dk_sync_backup';

export async function migrateLocalToCloud() {
  const errors = [];

  if (!isSupabaseConfigured()) {
    return { success: false, errors: ['Supabase not configured'] };
  }

  const sb = getSupabase();
  if (!sb) return { success: false, errors: ['Supabase client not available'] };
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    return { success: false, errors: ['Not authenticated'] };
  }

  try {
    const currentState = getState();
    localStorage.setItem(SYNC_BACKUP_KEY, JSON.stringify({
      timestamp: new Date().toISOString(),
      state: currentState,
    }));
  } catch (e) {
    console.warn('[migrateLocalToCloud] Backup failed:', e);
  }

  try {
    const state = getState();
    await cloudStorageAdapter.saveUserSettings({
      onboarding_complete: state.onboardingComplete || false,
      start_level: state.startLevel || null,
      target_level: state.targetLevel || null,
      daily_minutes: state.dailyMinutes || 30,
      days_per_week: state.daysPerWeek || 5,
      deadline: state.targetDate || null,
    });
  } catch (e) {
    errors.push('settings: ' + e.message);
  }

  try {
    const state = getState();
    await cloudStorageAdapter.saveUserProgress({
      currentLevel: state.currentLevel || 'A1',
      levels: state.levels || {},
    });
  } catch (e) {
    errors.push('progress: ' + e.message);
  }

  try {
    const state = getState();
    const completedLessons = state.completedLessons || {};
    for (const [level, lessons] of Object.entries(completedLessons)) {
      if (Array.isArray(lessons)) {
        for (const lesson of lessons) {
          const lessonId = typeof lesson === 'string' ? lesson : lesson?.id;
          if (lessonId) {
            await cloudStorageAdapter.saveLessonProgress(lessonId, true, null);
          }
        }
      }
    }
  } catch (e) {
    errors.push('lesson_progress: ' + e.message);
  }

  try {
    const state = getState();
    const allMistakes = [];
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
    for (const level of levels) {
      const mistakes = state.incorrectAnswers?.[level] || [];
      mistakes.forEach(function(m) {
        allMistakes.push({ ...m, level: level });
      });
    }
    if (allMistakes.length > 0) {
      await cloudStorageAdapter.saveMistakes(allMistakes.slice(0, 500));
    }
  } catch (e) {
    errors.push('mistakes: ' + e.message);
  }

  try {
    const state = getState();
    const studyLog = state.studyLog || {};
    for (const [date, data] of Object.entries(studyLog)) {
      if (data?.minutes > 0) {
        await cloudStorageAdapter.saveDailySession({
          date: date,
          minutes: data.minutes,
          lessons: data.sessions || 0,
          streak: state.streak?.count || 0,
        });
      }
    }
  } catch (e) {
    errors.push('daily_sessions: ' + e.message);
  }

  try {
    const state = getState();
    const exams = state.exams || {};
    for (const [level, exam] of Object.entries(exams)) {
      if (exam) {
        await cloudStorageAdapter.saveExamAttempt({
          examType: 'level',
          level: level,
          score: exam.score || 0,
          maxScore: exam.maxScore || 100,
          answers: {},
          passed: exam.passed || false,
        });
      }
    }
  } catch (e) {
    errors.push('exam_attempts: ' + e.message);
  }

  try {
    await cloudStorageAdapter.updateSyncMeta({
      local_updated_at: new Date().toISOString(),
      cloud_updated_at: new Date().toISOString(),
      conflicts_resolved: 0,
    });
  } catch (e) {
    errors.push('sync_meta: ' + e.message);
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function syncFromCloud() {
  const synced = [];
  const errors = [];

  if (!isSupabaseConfigured()) {
    return { success: false, synced: synced, errors: ['Supabase not configured'] };
  }

  try {
    const settingsResult = await cloudStorageAdapter.getUserSettings();
    if (!settingsResult.error && settingsResult.data) {
      const s = settingsResult.data;
      updateState({
        onboardingComplete: s.onboarding_complete || false,
        startLevel: s.start_level || null,
        targetLevel: s.target_level || null,
        dailyMinutes: s.daily_minutes || 30,
        daysPerWeek: s.days_per_week || 5,
        targetDate: s.deadline || null,
      });
      synced.push('settings');
    }
  } catch (e) {
    errors.push('settings: ' + e.message);
  }

  try {
    const progressResult = await cloudStorageAdapter.getUserProgress();
    if (!progressResult.error && progressResult.data) {
      const p = progressResult.data;
      updateState({
        currentLevel: p.current_level || 'A1',
        levels: p.levels || {},
      });
      synced.push('progress');
    }
  } catch (e) {
    errors.push('progress: ' + e.message);
  }

  try {
    const lessonsResult = await cloudStorageAdapter.getLessonProgress();
    if (!lessonsResult.error && Array.isArray(lessonsResult.data)) {
      const completedLessons = {};
      for (const lp of lessonsResult.data) {
        if (lp.completed) {
          const level = lp.lesson_id.split('_')[0] || 'A1';
          if (!completedLessons[level]) completedLessons[level] = [];
          completedLessons[level].push({
            id: lp.lesson_id,
            completedAt: lp.last_activity_at || lp.created_at,
          });
        }
      }
      updateState({ completedLessons: completedLessons });
      synced.push('lessons');
    }
  } catch (e) {
    errors.push('lessons: ' + e.message);
  }

  try {
    await cloudStorageAdapter.updateSyncMeta({
      last_sync_at: new Date().toISOString(),
    });
  } catch (e) {
  }

  return {
    success: errors.length === 0,
    synced: synced,
    errors: errors,
  };
}

export function hasSyncBackup() {
  try {
    return !!localStorage.getItem(SYNC_BACKUP_KEY);
  } catch {
    return false;
  }
}

export function clearSyncBackup() {
  try {
    localStorage.removeItem(SYNC_BACKUP_KEY);
  } catch {
  }
}
