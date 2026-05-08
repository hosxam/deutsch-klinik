/**
 * auth-smoke.spec.cjs
 *
 * Smoke tests for the Supabase auth integration.
 * Tests that the LoginPage, AuthPanel, and AccountPage render
 * and interact correctly.
 */
const { test, expect } = require('@playwright/test');

test.describe('Supabase Auth Integration', () => {

  test('LoginPage renders with profile selection', async ({ page }) => {
    // Clear any stored profile
    await page.evaluate(() => localStorage.removeItem('dk_active_profile'));
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should show the LoginPage (profile picker)
    await expect(page.locator('text=Hossam')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Medical German')).toBeVisible();
  });

  test('LoginPage allows profile selection', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('dk_active_profile'));
    await page.goto('/');

    // Click Hossam profile
    await page.locator('button:has-text("Hossam")').first().click();

    // Should redirect to dashboard or onboarding
    await page.waitForURL(/.*(dashboard|onboarding).*/);
  });

  test('AccountPage renders with sync panel', async ({ page }) => {
    await page.goto('/#/settings/account');
    await page.waitForLoadState('networkidle');

    // Account page should show
    await expect(page.locator('text=Account')).toBeVisible({ timeout: 5000 });

    // Should mention Cloud Sync
    const body = await page.locator('body').textContent();
    expect(body).toContain('Cloud Sync');
  });

  test('Settings has account link', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Cloud Sync')).toBeVisible({ timeout: 5000 });
  });

});
