/**
 * onboardingState.js
 * Utility functions for managing onboarding flow state.
 * Persists to localStorage alongside main store.
 */

import { getState } from './store';

const ONBOARDING_KEY = 'dk_onboarding';

export function isOnboardingComplete() {
  // Check main store first
  const state = getState();
  if (state.onboardingComplete === true) return true;

  // Fallback: check separate localStorage key
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.onboardingComplete === true;
    }
  } catch {
    // ignore
  }

  return false;
}

export function setOnboardingState(data) {
  try {
    // Save to both main store key (for backwards compat)
    // and the dedicated key
    const existing = getOnboardingState();
    const merged = { ...existing, ...data };
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save onboarding state.', e);
  }
}

export function getOnboardingState() {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    onboardingComplete: false,
    startLevel: null,
    targetLevel: null,
    dailyMinutes: 30,
    daysPerWeek: 5,
    targetDate: null,
    estimatedFinishDate: null,
    goalSetupComplete: false,
  };
}

export function clearOnboardingState() {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // ignore
  }
}
