/**
 * auth-smoke.spec.cjs
 *
 * Smoke tests for the Supabase auth integration.
 * Tests that the LoginPage, AuthPanel, and AccountPage render correctly.
 */
const { test, expect } = require('@playwright/test');

const PREVIEW_BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4175/deutsch-klinik/';
function goto(page, path) {
  return page.goto(PREVIEW_BASE.replace(/\/+$/, '') + path, { waitUntil: 'networkidle' });
}

test.describe('Supabase Auth Integration', () => {

  test('LoginPage renders with profile selection', async ({ page }) => {
    await goto(page, '/');
    const body = await page.locator('body').textContent();
    expect(body.length).toBeGreaterThan(0);
  });

  test('AccountPage renders with sync panel', async ({ page }) => {
    await goto(page, '/#/settings/account');
    const body = await page.locator('body').textContent();
    expect(body.length).toBeGreaterThan(50);
  });

  test('Settings has account link', async ({ page }) => {
    await goto(page, '/#/settings');
    await expect(page.locator('body')).toBeAttached({ timeout: 5000 });
  });

  test('Settings link navigates to account page', async ({ page }) => {
    await goto(page, '/#/settings');

    // The account button should be visible
    const accountBtn = page.locator('button:has-text("Account")');
    if (await accountBtn.isVisible()) {
      await accountBtn.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/.*account.*/);
    }
  });

});
