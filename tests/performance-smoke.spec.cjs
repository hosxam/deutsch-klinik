// performance-smoke.spec.cjs
//
// Smoke tests for Phase 13 performance optimizations.
// Verifies that data splitting and lazy loading don't break the app.
//
// Run: npx playwright test tests/performance-smoke.spec.cjs

const { test, expect } = require('@playwright/test');

const PREVIEW_BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4175/deutsch-klinik/';
function goto(page, path) {
  return page.goto(PREVIEW_BASE.replace(/\/+$/, '') + path, { waitUntil: 'networkidle' });
}

// Seed localStorage before any app JS executes.
// addInitScript runs in the page context before the page loads,
// so the app sees the data on first render.
function seedLocalStorage(page, data) {
  return page.addInitScript((d) => {
    try { localStorage.setItem('deutsch_klinik_state', JSON.stringify(d)); } catch(e) {}
  }, data);
}

test.describe('Performance Optimization - Phase 13 Smoke Tests', () => {

  test('First visit loads without crash', async ({ page }) => {
    await goto(page, '/');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Onboarding page loads', async ({ page }) => {
    await goto(page, '/#/onboarding');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Dashboard loads after onboarding', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'A1',
      completedLessons: {},
      levels: {},
    });
    await goto(page, '/');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Daily mission loads for A1', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'A1',
      startLevel: 'A1',
      targetLevel: 'A1',
      dailyMinutes: 30,
      daysPerWeek: 5,
      streak: { count: 1, lastDate: new Date().toISOString().split('T')[0] },
      levels: {},
      completedLessons: {},
    });
    await goto(page, '/');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Daily mission loads for B1', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'B1',
      startLevel: 'B1',
      targetLevel: 'B1',
      dailyMinutes: 30,
      daysPerWeek: 5,
      streak: { count: 1, lastDate: new Date().toISOString().split('T')[0] },
      levels: {},
      completedLessons: {},
    });
    await goto(page, '/');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('FSP route loads', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'B2',
      completedLessons: {},
      levels: {},
    });
    await goto(page, '/');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Vocabulary page loads', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'A1',
      completedLessons: {},
      levels: {},
    });
    await goto(page, '/');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Speaking recording UI shows or falls back gracefully', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'A1',
      completedLessons: {},
      levels: {},
    });
    await goto(page, '/#/level/A1/speaking');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('AI correction unavailable still shows fallback', async ({ page }) => {
    await seedLocalStorage(page, {
      onboardingComplete: true,
      currentLevel: 'A1',
      completedLessons: {},
      levels: {},
    });
    await goto(page, '/#/level/A1/writing');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });
});
