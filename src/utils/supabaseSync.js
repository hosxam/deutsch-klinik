/**
 * supabaseSync.js
 *
 * Handles migration of local progress to cloud and sync operations.
 * Uses the single-JSONB-payload approach with the user_progress table.
 */
import { getState, getCurrentProfileName } from './store';
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

const SYNC_BACKUP_KEY = 'dk_sync_backup';

/**
 * Get a profile-specific store key (same logic as store.js)
 */
function getStoreKey() {
  const profile = (() => {
    try { return localStorage.getItem('dk_active_profile') || 'default'; } catch { return 'default'; }
  })();
  return `deutsch_klinik_state_${profile}`;
}

/**
 * Read full app state from localStorage.
 */
function getLocalProgress() {
  try {
    const raw = localStorage.getItem(getStoreKey());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

/**
 * Write full app state to localStorage.
 */
function setLocalProgress(progress) {
  try {
    localStorage.setItem(getStoreKey(), JSON.stringify(progress));
  } catch { /* best-effort */ }
}

/**
 * Get study goal settings.
 */
function getLocalSettings() {
  const settings = {};
  const keys = [
    'deutsch_klinik_study_goal',
  ];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) settings[key] = JSON.parse(raw);
    } catch { /* skip */ }
  }
  return settings;
}

/**
 * Upload current local progress to Supabase.
 * Uses the single user_progress table with full state as JSONB payload.
 */
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

  // Backup local progress before migration
  try {
    const progress = getLocalProgress();
    if (progress) {
      localStorage.setItem(SYNC_BACKUP_KEY, JSON.stringify({
        timestamp: new Date().toISOString(),
        progress,
      }));
    }
  } catch { /* backup best-effort */ }

  // Upload full state as JSONB payload
  try {
    const state = getState();
    const settings = getLocalSettings();
    const profile = getCurrentProfileName() || 'default';
    const { error } = await sb
      .from('user_progress')
      .upsert({
        user_id: user.id,
        current_level: state.currentLevel || 'A1',
        levels: state.levels || {},
        payload: state,
        settings,
        profile,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) errors.push('upload: ' + error.message);
  } catch (e) {
    errors.push('upload: ' + e.message);
  }

  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Download cloud progress and apply to local state.
 */
export async function syncFromCloud() {
  const synced = [];
  const errors = [];

  if (!isSupabaseConfigured()) {
    return { success: false, synced, errors: ['Supabase not configured'] };
  }

  const sb = getSupabase();
  if (!sb) return { success: false, synced, errors: ['Supabase client not available'] };
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    return { success: false, synced, errors: ['Not authenticated'] };
  }

  try {
    const { data, error } = await sb
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      errors.push('fetch: ' + error.message);
    } else if (data) {
      // Read from payload first (new column), fall back to progress (legacy)
      const cloudPayload = data.payload || data.progress || {};
      if (typeof cloudPayload === 'object' && Object.keys(cloudPayload).length > 0) {
        setLocalProgress(cloudPayload);
        synced.push('payload');
      }

      // Restore settings
      if (data.settings) {
        try {
          Object.entries(data.settings).forEach(([key, val]) => {
            localStorage.setItem(key, JSON.stringify(val));
          });
        } catch { /* best-effort */ }
        synced.push('settings');
      }
    } else {
      synced.push('no-data');
    }
  } catch (e) {
    errors.push('fetch: ' + e.message);
  }

  return {
    success: errors.length === 0,
    synced,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Save full local progress to cloud (uses direct Supabase call).
 */
export async function saveCloudProgress() {
  if (!isSupabaseConfigured()) return { success: false, errors: ['Not configured'] };
  const sb = getSupabase();
  if (!sb) return { success: false, errors: ['No client'] };
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { success: false, errors: ['Not authenticated'] };

  try {
    let state = getState();
    // Merge separate onboarding key into payload
    try {
      const onboardingRaw = localStorage.getItem('dk_onboarding');
      if (onboardingRaw) {
        const onboardingData = JSON.parse(onboardingRaw);
        state._onboarding = onboardingData;
      }
    } catch { /* best-effort */ }
    const settings = getLocalSettings();
    const profile = getCurrentProfileName() || 'default';
    const { error } = await sb
      .from('user_progress')
      .upsert({
        user_id: user.id,
        current_level: state.currentLevel || 'A1',
        levels: state.levels || {},
        payload: state,
        settings,
        profile,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    if (error) return { success: false, errors: [error.message] };
    return { success: true };
  } catch (e) {
    return { success: false, errors: [e.message] };
  }
}

/**
 * Merge local and cloud progress safely.
 * Strategy: preserve completed lessons from both, best progress per skill,
 * flashcard SRS with latest updatedAt, mistakes deduplicated.
 */
export function mergeProgress(localProgress, cloudPayload) {
  if (!localProgress && !cloudPayload) return {};
  if (!localProgress) return { ...cloudPayload, _merged: true, _from: 'cloud' };
  if (!cloudPayload) return { ...localProgress, _merged: true, _from: 'local' };

  const merged = { ...localProgress };

  // Preserve completed lessons from both
  if (cloudPayload.completedLessons) {
    merged.completedLessons = merged.completedLessons || {};
    for (const [level, lessons] of Object.entries(cloudPayload.completedLessons)) {
      const existing = merged.completedLessons[level] || [];
      const existingIds = new Set(existing.map(l => typeof l === 'string' ? l : l?.id));
      for (const lesson of lessons) {
        const id = typeof lesson === 'string' ? lesson : lesson?.id;
        if (id && !existingIds.has(id)) {
          existing.push(lesson);
        }
      }
      merged.completedLessons[level] = existing;
    }
  }

  // Preserve best progress per skill
  const skillFields = ['vocabularyMastery', 'grammarMastery', 'flashcards'];
  for (const field of skillFields) {
    if (cloudPayload[field]) {
      merged[field] = merged[field] || {};
      for (const [key, val] of Object.entries(cloudPayload[field])) {
        const existing = merged[field][key];
        if (!existing) {
          merged[field][key] = val;
        } else if (field === 'vocabularyMastery' || field === 'flashcards') {
          // SM-2: keep entry with most recent due or highest ease
          if ((val.due || '') > (existing.due || '') || val.ease > existing.ease) {
            merged[field][key] = val;
          }
        } else if (field === 'grammarMastery') {
          // Keep the one with more correct answers or marked mastered
          if (val.mastered && !existing.mastered) {
            merged[field][key] = val;
          } else if (val.correct > existing.correct) {
            merged[field][key] = val;
          }
        }
      }
    }
  }

  // Deduplicate mistakes
  if (cloudPayload.mistakeNotebook) {
    merged.mistakeNotebook = merged.mistakeNotebook || {};
    for (const [id, mistake] of Object.entries(cloudPayload.mistakeNotebook)) {
      if (!merged.mistakeNotebook[id]) {
        merged.mistakeNotebook[id] = mistake;
      } else {
        // If both have same mistake, merge counts
        merged.mistakeNotebook[id].repeated = Math.max(
          merged.mistakeNotebook[id].repeated || 0,
          mistake.repeated || 0
        );
        // Keep the most recent date
        if ((mistake.date || '') > (merged.mistakeNotebook[id].date || '')) {
          merged.mistakeNotebook[id].date = mistake.date;
        }
      }
    }
  }

  // Deduplicate incorrect answers
  if (cloudPayload.incorrectAnswers) {
    merged.incorrectAnswers = merged.incorrectAnswers || {};
    for (const [level, answers] of Object.entries(cloudPayload.incorrectAnswers)) {
      const existingAnswers = merged.incorrectAnswers[level] || [];
      const existingKeys = new Set(existingAnswers.map(a => a.exerciseId || a.exercise_id));
      for (const answer of answers) {
        const key = answer.exerciseId || answer.exercise_id;
        if (!key || !existingKeys.has(key)) {
          existingAnswers.push(answer);
        }
      }
      merged.incorrectAnswers[level] = existingAnswers;
    }
  }

  // Preserve practiceProgress from both
  if (cloudPayload.practiceProgress_v1) {
    merged.practiceProgress_v1 = merged.practiceProgress_v1 || {};
    for (const [level, progress] of Object.entries(cloudPayload.practiceProgress_v1)) {
      // Deep merge per category
      merged.practiceProgress_v1[level] = merged.practiceProgress_v1[level] || {};
      for (const [cat, data] of Object.entries(progress)) {
        const existing = merged.practiceProgress_v1[level][cat];
        if (!existing) {
          merged.practiceProgress_v1[level][cat] = data;
        } else if (typeof data === 'object' && data !== null) {
          merged.practiceProgress_v1[level][cat] = { ...existing, ...data };
        }
      }
    }
  }

  merged._merged = true;
  return merged;
}

export function hasSyncBackup() {
  try { return !!localStorage.getItem(SYNC_BACKUP_KEY); } catch { return false; }
}

export function clearSyncBackup() {
  try { localStorage.removeItem(SYNC_BACKUP_KEY); } catch { /* ignore */ }}
