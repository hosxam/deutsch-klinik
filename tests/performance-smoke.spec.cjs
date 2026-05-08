// performance-smoke.spec.cjs — Smoke tests for Phase 13 performance optimization
//
// These tests verify that the application loads correctly after the data-splitting
// refactor. They check that pages which use dynamic per-level data loading still
// render and function properly.
//
// Run: npx playwright test tests/performance-smoke.spec.cjs
//
// NOTE: This file documents the expected test cases. Actual execution requires
// a running dev server (npm run dev). The tests assume the dev server is at
// http://localhost:5173.

const { test, expect } = require('@playwright/test');

const DEV_URL = process.env.DEV_URL || 'http://localhost:5173';

// Helper: complete onboarding to reach the app
async function completeOnboarding(page) {
  await page.goto(`${DEV_URL}/#/onboarding`);
  await page.waitForTimeout(500);
  // Look for the goal type selector
  const goalSelect = page.locator('select, [role="combobox"], [data-testid="goal-type"]').first();
  if (await goalSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    await goalSelect.selectOption('exam');
  }
  const targetSelect = page.locator('select, [role="combobox"], [data-testid="target-level"]').first();
  if (await targetSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
    await targetSelect.selectOption('A1');
  }
  // Click the get started / submit button
  const submitBtn = page.locator('button:has-text("Get Started"), button:has-text("Start"), button:has-text("Continue")').first();
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(1000);
  }
  // Clear localStorage onboarding flag if it exists
  await page.evaluate(() => {
    localStorage.removeItem('deutsch_klinik_onboarding');
    localStorage.removeItem('deutsch_klinik_study_goal');
    // Create a basic study goal
    const goal = JSON.stringify({ goalType: 'exam', targetLevel: 'A1', dailyMinutes: 30 });
    localStorage.setItem('deutsch_klinik_study_goal', goal);
  });
}

test.describe('Performance Optimization - Phase 13 Smoke Tests', () => {

  test('First visit loads without crash', async ({ page }) => {
    await page.goto(`${DEV_URL}/#/`);
    await page.waitForTimeout(2000);
    // Should redirect to onboarding or show a page (no blank screen)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('Onboarding page loads', async ({ page }) => {
    await page.goto(`${DEV_URL}/#/onboarding`);
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Dashboard loads after onboarding', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/dashboard`);
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Daily mission loads for A1', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/daily`);
    await page.waitForTimeout(5000);
    const bodyText = await page.locator('body').textContent();
    // Should show the daily plan, not an error
    expect(bodyText).not.toContain('Failed to load data');
    expect(bodyText).not.toContain('Error');
  });

  test('Daily mission loads for B1', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/B1/daily`);
    await page.waitForTimeout(5000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Failed to load data');
    expect(bodyText).not.toContain('Error');
  });

  test('FSP route loads', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/fsp/grammar`);
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Vocabulary page loads', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/vocabulary`);
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Speaking recording UI shows or falls back gracefully', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/speaking`);
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    // Should either show recording UI or a helpful fallback message
    expect(bodyText).not.toContain('Cannot read properties of undefined');
    expect(bodyText).not.toContain('TypeError');
  });

  test('AI correction unavailable still shows fallback', async ({ page }) => {
    // AI correction requires a backend API key. Without it, the UI should
    // still render with a loading state or fallback message.
    await page.goto(`${DEV_URL}/#/level/A1/daily`);
    // Navigate to a mission that would trigger AI
    // Just verify the page doesn't crash
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Supabase no-config fallback still works', async ({ page }) => {
    // Supabase operations should gracefully fail when no credentials configured
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/dashboard`);
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    // Should show dashboard content, not crash on Supabase call
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Level page loads for each CEFR level', async ({ page }) => {
    await completeOnboarding(page);
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1']) {
      await page.goto(`${DEV_URL}/#/level/${level}`);
      await page.waitForTimeout(2000);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.length).toBeGreaterThan(50);
    }
  });

  test('Navigation between pages works', async ({ page }) => {
    await completeOnboarding(page);
    await page.goto(`${DEV_URL}/#/level/A1/dashboard`);
    await page.waitForTimeout(2000);
    // Try navigating to daily mission
    await page.goto(`${DEV_URL}/#/level/A1/daily`);
    await page.waitForTimeout(3000);
    // Then to vocabulary
    await page.goto(`${DEV_URL}/#/level/A1/vocabulary`);
    await page.waitForTimeout(2000);
    // Back to dashboard
    await page.goto(`${DEV_URL}/#/level/A1/dashboard`);
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
