// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://127.0.0.1:4175/deutsch-klinik/';

/**
 * Sets up localStorage for a logged-in FSP user with given state, then loads a hash route.
 */
async function loginAndGo(page, hashRoute, stateOverrides = {}) {
  const merged = {
    currentLevel: 'A1',
    startLevel: 'A1',
    targetLevel: 'FSP',
    dailyMinutes: 30,
    daysPerWeek: 5,
    onboardingComplete: true,
    goalSetupComplete: true,
    levels: {
      A1: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
    },
    ...stateOverrides,
  };

  await page.addInitScript(({ overrides, route }) => {
    localStorage.clear();
    localStorage.setItem('dk_active_profile', 'test-fsp-user');
    localStorage.setItem('deutsch_klinik_state_test-fsp-user', JSON.stringify(overrides));
  }, { overrides: merged, route: hashRoute });

  await page.goto(BASE + '#/' + (hashRoute.startsWith('/') ? hashRoute.substring(1) : hashRoute));
  await page.waitForTimeout(2000);
}

test.describe('FSP Track', () => {

  test('FSP hub page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasFspContent = bodyText.includes('FSP') || bodyText.includes('Fachsprachpruefung');
    expect(hasFspContent, 'FSP hub page should show FSP content').toBeTruthy();
  });

  test('FSP vocabulary page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp/vocabulary', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'FSP vocabulary page should have content').toBeTruthy();
  });

  test('FSP anamnese page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp/anamnese', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'FSP anamnese page should have content').toBeTruthy();
  });

  test('FSP cases page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp/cases', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'FSP cases page should have content').toBeTruthy();
  });

  test('FSP exam page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp/exams', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'FSP exam page should have content').toBeTruthy();
  });

  test('FSP grammar page loads', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp/grammar', {
      targetLevel: 'FSP',
      onboardingComplete: true,
      goalSetupComplete: true,
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'FSP grammar page should have content').toBeTruthy();
  });

  test('Dashboard does not crash with targetLevel=FSP', async ({ page }) => {
    await loginAndGo(page, '/', {
      targetLevel: 'FSP',
      startLevel: 'A1',
      currentLevel: 'A1',
      dailyMinutes: 30,
      daysPerWeek: 5,
      targetDate: null,
      estimatedFinishDate: '2027-01-01',
      onboardingComplete: true,
      goalSetupComplete: true,
      levels: {
        A1: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
        A2: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
        B1: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
        B2: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
        C1: { grammar: [], vocab: [], reading: [], listening: [], writing: [], speaking: [] },
      },
    });

    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const hasContent = bodyText && bodyText.length > 0;
    expect(hasContent, 'Dashboard should load with targetLevel=FSP').toBeTruthy();
  });

});
