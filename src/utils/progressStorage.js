/**
 * progressStorage.js
 *
 * Main storage adapter. Selects local vs cloud based on auth state.
 * App code imports from this module and doesn't care which backend is active.
 */
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { getSupabase } from '../lib/supabaseClient';
import { localStorageAdapter } from './localStorageAdapter';
import { cloudStorageAdapter } from './cloudStorageAdapter';

export function getStorageAdapter() {
  if (isSupabaseConfigured()) {
    const sb = getSupabase();
    if (sb) {
      const { data: { user } } = sb.auth.getUser();
      if (user) {
        return cloudStorageAdapter;
      }
    }
  }
  return localStorageAdapter;
}

export function isCloudAuthenticated() {
  if (!isSupabaseConfigured()) return false;
  const sb = getSupabase();
  if (!sb) return false;
  const { data: { user } } = sb.auth.getUser();
  return !!user;
}

export function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabase();
  if (!sb) return null;
  const { data: { user } } = sb.auth.getUser();
  return user || null;
}

export function getStorageName() {
  return getStorageAdapter().getName();
}

export { localStorageAdapter, cloudStorageAdapter };
