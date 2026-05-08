/**
 * production-smoke.spec.cjs
 *
 * Phase 8: Practical Playwright regression tests to verify
 * the app loads and key pages render without errors after
 * curriculum data changes.
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

test.describe('Production smoke tests', () => {

  test('app loads and renders the dashboard', async ({ page }) => {
    await goto(page, '/');
    // Dashboard should show level navigation or heading
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    // Check that the app rendered something (SPA - content loads via JS)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });

  test('flashcard page loads', async ({ page }) => {
    await goto(page, '/flashcards');
    // Should see level selector or flashcard content
    await expect(page.locator('body')).not.toHaveText(/404|Error|not found/i);
  });

  test('mistakes page loads', async ({ page }) => {
    await goto(page, '/mistakes');
    await expect(page.locator('body')).not.toHaveText(/404|Error|not found/i);
  });

  test('exam route guard does not crash', async ({ page }) => {
    await goto(page, '/exam');
    // Should either load exam or redirect — either is fine as long as no crash
    await expect(page.locator('body')).not.toHaveText(/Error|not found/i);
  });

  test('A1 daily mission does not crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(500);

    // Try selecting A1 level
    const a1Btn = page.locator('button, a, [role="button"]').filter({ hasText: 'A1' }).first();
    if (await a1Btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await a1Btn.click();
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toHaveText(/Error|not found|crash/i);
  });

  test('A2 daily mission does not crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(500);

    const a2Btn = page.locator('button, a, [role="button"]').filter({ hasText: 'A2' }).first();
    if (await a2Btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await a2Btn.click();
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toHaveText(/Error|not found|crash/i);
  });

  test('B1 daily mission does not crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(500);

    const b1Btn = page.locator('button, a, [role="button"]').filter({ hasText: 'B1' }).first();
    if (await b1Btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await b1Btn.click();
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toHaveText(/Error|not found|crash/i);
  });

  test('B2 daily mission does not crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(500);

    const b2Btn = page.locator('button, a, [role="button"]').filter({ hasText: 'B2' }).first();
    if (await b2Btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await b2Btn.click();
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toHaveText(/Error|not found|crash/i);
  });

  test('C1 daily mission does not crash', async ({ page }) => {
    await goto(page, '/daily');
    await page.waitForTimeout(500);

    const c1Btn = page.locator('button, a, [role="button"]').filter({ hasText: 'C1' }).first();
    if (await c1Btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await c1Btn.click();
      await page.waitForTimeout(1000);
    }
    await expect(page.locator('body')).not.toHaveText(/Error|not found|crash/i);
  });

});
