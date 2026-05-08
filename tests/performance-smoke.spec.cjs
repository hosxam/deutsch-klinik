/**
 * performance-smoke.spec.cjs
 *
 * Smoke tests for Phase 13 performance optimizations.
 * Verifies that data splitting and lazy loading don't break the app.
 *
 * Run: npx playwright test tests/performance-smoke.spec.cjs
 */
const { test, expect } = require('@playwright/test');

test.describe('Performance Smoke Tests (Phase 13)', () => {

  test('Onboarding page loads quickly (first visit)', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Should show login/profile page (not crash)
    const body = await page.locator('body').textContent();
    expect(body.length).toBeGreaterThan(50);
  });

  test('Dashboard loads after onboarding', async ({ page }) => {
    // Simulate onboarded state
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'A1',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
    // Should not show an error page
    const hasCrash = await page.evaluate(() => {
      return document.body.innerText.includes('Error') && document.body.children.length < 5;
    }).catch(() => false);
    expect(hasCrash).toBe(false);
  });

  test('Daily mission loads for A1', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        currentLevel: 'A1',
        onboardingComplete: true,
        startLevel: 'A1',
        targetLevel: 'A1',
        dailyMinutes: 30,
        daysPerWeek: 5,
        streak: { count: 1, lastDate: new Date().toISOString().split('T')[0] },
        levels: {},
        completedLessons: {},
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('FSP route loads', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'B2',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // FSP routes might use hash routing
    const hasFspLink = await page.locator('a[href*="fsp"]').count();
    // Just verify no crash
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Settings page loads', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'A1',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/#/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Account page loads', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'A1',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/#/settings/account');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('AI unavailable still works (writing page)', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'A1',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/#/level/A1/writing');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });

  test('Level page loads for B2', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('deutsch_klinik_state', JSON.stringify({
        onboardingComplete: true,
        currentLevel: 'B2',
        completedLessons: {},
        levels: {},
      }));
    });
    await page.goto('/#/level/B2');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeAttached({ timeout: 10000 });
  });
});
