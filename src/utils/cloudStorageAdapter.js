/**
 * cloudStorageAdapter.js
 *
 * Supabase-backed cloud storage adapter.
 * Mirrors the localStorageAdapter interface but reads/writes to Supabase.
 * Returns { data, error } shaped responses.
 */
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient';

function handleError(fnName, error) {
  console.error('[cloudStorageAdapter.' + fnName + ']', error);
  return { error: error?.message || error };
}

function handleSuccess(data) {
  return { error: null, data };
}

function getUserOrThrow() {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase not configured');
  const { data: { user } } = sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user;
}

export const cloudStorageAdapter = {
  type: 'cloud',
  isOnline: () => isSupabaseConfigured(),
  getName: () => 'Cloud (Supabase)',

  async signUp(email, password) {
    const sb = getSupabase();
    if (!sb) return handleError('signUp', 'Supabase not configured');
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) return handleError('signUp', error);
    return handleSuccess(data);
  },

  async signIn(email, password) {
    const sb = getSupabase();
    if (!sb) return handleError('signIn', 'Supabase not configured');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return handleError('signIn', error);
    return handleSuccess(data);
  },

  async signOut() {
    const sb = getSupabase();
    if (!sb) return handleError('signOut', 'Supabase not configured');
    const { error } = await sb.auth.signOut();
    if (error) return handleError('signOut', error);
    return handleSuccess(null);
  },

  async getCurrentUser() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: { user } } = await sb.auth.getUser();
    return user;
  },

  async getProfile() {
    const sb = getSupabase();
    if (!sb) return handleError('getProfile', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('profiles').select('*').eq('user_id', user.id).single();
      if (error) return handleError('getProfile', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getProfile', e); }
  },

  async getUserSettings() {
    const sb = getSupabase();
    if (!sb) return handleError('getUserSettings', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      let { data, error } = await sb.from('user_settings').select('*').eq('user_id', user.id).single();
      if (error && error.code === 'PGRST116') {
        const defaults = {
          user_id: user.id,
          onboarding_complete: false,
          start_level: null,
          target_level: null,
          daily_minutes: 30,
          days_per_week: 5,
          deadline: null,
        };
        const { data: inserted, error: insertError } = await sb.from('user_settings').insert(defaults).select().single();
        if (insertError) return handleError('getUserSettings', insertError);
        return handleSuccess(inserted);
      }
      if (error) return handleError('getUserSettings', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getUserSettings', e); }
  },

  async saveUserSettings(settings) {
    const sb = getSupabase();
    if (!sb) return handleError('saveUserSettings', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('user_settings').upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('saveUserSettings', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveUserSettings', e); }
  },

  async getUserProgress() {
    const sb = getSupabase();
    if (!sb) return handleError('getUserProgress', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      let { data, error } = await sb.from('user_progress').select('*').eq('user_id', user.id).single();
      if (error && error.code === 'PGRST116') {
        return handleSuccess(null);
      }
      if (error) return handleError('getUserProgress', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getUserProgress', e); }
  },

  async saveUserProgress(progress) {
    const sb = getSupabase();
    if (!sb) return handleError('saveUserProgress', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('user_progress').upsert({
        user_id: user.id,
        current_level: progress.currentLevel || 'A1',
        levels: progress.levels || {},
        updated_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('saveUserProgress', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveUserProgress', e); }
  },

  async getLessonProgress() {
    const sb = getSupabase();
    if (!sb) return handleError('getLessonProgress', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('lesson_progress').select('*').eq('user_id', user.id);
      if (error) return handleError('getLessonProgress', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getLessonProgress', e); }
  },

  async saveLessonProgress(lessonId, completed, score) {
    const sb = getSupabase();
    if (!sb) return handleError('saveLessonProgress', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('lesson_progress').upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: completed,
        score: score,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('saveLessonProgress', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveLessonProgress', e); }
  },

  async saveMistakes(mistakes) {
    const sb = getSupabase();
    if (!sb) return handleError('saveMistakes', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const rows = (mistakes || []).map(m => ({
        user_id: user.id,
        item_id: m.exerciseId || m.item_id,
        item_type: 'vocab',
        level: m.level,
        context: m,
        times_mistaken: 1,
        last_mistake_at: m.date || new Date().toISOString(),
      }));
      if (rows.length === 0) return handleSuccess([]);
      const { data, error } = await sb.from('mistakes').upsert(rows, {
        onConflict: 'user_id,item_id,item_type,level',
        ignoreDuplicates: false,
      });
      if (error) return handleError('saveMistakes', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveMistakes', e); }
  },

  async saveFlashcards(flashcards) {
    const sb = getSupabase();
    if (!sb) return handleError('saveFlashcards', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const rows = Object.entries(flashcards || {}).map(([wordId, card]) => ({
        user_id: user.id,
        item_id: wordId,
        item_type: 'vocab',
        front: wordId,
        back: card.translation || '',
        level: wordId.split('_')[0] || 'A1',
      }));
      if (rows.length === 0) return handleSuccess([]);
      const { data, error } = await sb.from('flashcards').upsert(rows, {
        onConflict: 'user_id,item_id',
        ignoreDuplicates: false,
      });
      if (error) return handleError('saveFlashcards', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveFlashcards', e); }
  },

  async getDailySessions() {
    const sb = getSupabase();
    if (!sb) return handleError('getDailySessions', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('daily_sessions').select('*').eq('user_id', user.id);
      if (error) return handleError('getDailySessions', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getDailySessions', e); }
  },

  async saveDailySession(session) {
    const sb = getSupabase();
    if (!sb) return handleError('saveDailySession', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('daily_sessions').upsert({
        user_id: user.id,
        session_date: session.date,
        minutes_studied: session.minutes || 0,
        lessons_completed: session.lessons || 0,
        streak_count: session.streak || 0,
        updated_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('saveDailySession', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveDailySession', e); }
  },

  async saveExamAttempt(attempt) {
    const sb = getSupabase();
    if (!sb) return handleError('saveExamAttempt', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('exam_attempts').insert({
        user_id: user.id,
        exam_type: attempt.examType || 'level',
        level: attempt.level,
        score: attempt.score,
        max_score: attempt.maxScore,
        answers: attempt.answers || {},
        passed: attempt.passed || false,
        completed_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('saveExamAttempt', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveExamAttempt', e); }
  },

  async saveWritingAttempt(attempt) {
    const sb = getSupabase();
    if (!sb) return handleError('saveWritingAttempt', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('writing_attempts').insert({
        user_id: user.id,
        prompt_id: attempt.promptId,
        user_response: attempt.text || attempt.userResponse,
        evaluation: attempt.evaluation || null,
        level: attempt.level,
        score: attempt.score || null,
      }).select().single();
      if (error) return handleError('saveWritingAttempt', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveWritingAttempt', e); }
  },

  async saveSpeakingAttempt(attempt) {
    const sb = getSupabase();
    if (!sb) return handleError('saveSpeakingAttempt', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('speaking_attempts').insert({
        user_id: user.id,
        prompt_id: attempt.promptId,
        user_response: attempt.text || attempt.userResponse,
        evaluation: attempt.evaluation || null,
        level: attempt.level,
        score: attempt.score || null,
      }).select().single();
      if (error) return handleError('saveSpeakingAttempt', error);
      return handleSuccess(data);
    } catch (e) { return handleError('saveSpeakingAttempt', e); }
  },

  async updateSyncMeta(meta) {
    const sb = getSupabase();
    if (!sb) return handleError('updateSyncMeta', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('sync_metadata').upsert({
        user_id: user.id,
        ...meta,
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select().single();
      if (error) return handleError('updateSyncMeta', error);
      return handleSuccess(data);
    } catch (e) { return handleError('updateSyncMeta', e); }
  },

  async getSyncMeta() {
    const sb = getSupabase();
    if (!sb) return handleError('getSyncMeta', 'Supabase not configured');
    try {
      const user = getUserOrThrow();
      const { data, error } = await sb.from('sync_metadata').select('*').eq('user_id', user.id).single();
      if (error && error.code === 'PGRST116') return handleSuccess(null);
      if (error) return handleError('getSyncMeta', error);
      return handleSuccess(data);
    } catch (e) { return handleError('getSyncMeta', e); }
  },
};
