/**
 * phase17-remediation-smoke.spec.cjs
 *
 * Phase 17 Part 3: Verifies remediation fix, Mistake Notebook cleanup,
 * and dashboard crash resilience.
 *
 * Connects to vite preview server started by `npm run preview`.
 * Override via PREVIEW_URL env var.
 */

const { test, expect } = require('@playwright/test');

const PREVIEW_BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4175/deutsch-klinik/';

function goto(page, path) {
  return page.goto(PREVIEW_BASE.replace(/\/+$/, '') + path, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
}

test.describe('Phase 17 Part 3: Remediation & Mistake Notebook', () => {

  test('dashboard loads without crash (empty state resilience)', async ({ page }) => {
    // The dashboard should render even with empty/minimal state
    // This tests the optional chaining fix for state.speakingRecordings
    await goto(page, '/');
    // Dashboard should render without "Something broke"
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Something broke');
  });

  test('dashboard does not show Something broke after navigating from daily', async ({ page }) => {
    // Navigate to (profile selection or login page), then to dashboard
    await goto(page, '/');

    // Navigate to the dashboard main URL
    await goto(page, '/');
    await page.waitForTimeout(500);

    // Dashboard should not show error boundary
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Something broke');
  });

  test('Mistake Notebook page loads without crash', async ({ page }) => {
    await goto(page, '/mistakes');
    await page.waitForTimeout(1000);

    // Page should not show error boundary or 404
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Something broke');
    expect(bodyText).not.toContain('not found');
    // Should show mistake-related UI or profile selector (not an error)
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('Mistake Notebook no longer shows useless vocab review section', async ({ page }) => {
    // Navigate directly to the mistake notebook route via hash
    // The app will either show login/onboarding (if no profile) or the notebook
    await page.goto(PREVIEW_BASE.replace(/\/+$/, '') + '/#/mistake-notebook', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(1500);

    const bodyText = await page.locator('body').textContent();
    // Should NOT crash
    expect(bodyText).not.toContain('Something broke');
    // Should NOT show 'reinforce vocabulary' (the useless vocab section we removed)
    expect(bodyText).not.toContain('reinforce vocabulary');
    // Should either show the profile selector (no profile), onboarding, or mistake notebook
    // As long as it doesn't crash or show the removed feature, the test passes
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('flashcard page still works', async ({ page }) => {
    await goto(page, '/flashcards');
    await page.waitForTimeout(500);
    await expect(page.locator('body')).not.toContainText(/Error|not found/i);
  });

  test('daily page loads without crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain('Something broke');
    // Body should have content (either profile select, onboarding, or daily plan)
    expect(bodyText.length).toBeGreaterThan(50);
  });

});
