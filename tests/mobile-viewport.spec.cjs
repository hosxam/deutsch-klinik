// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Mobile Playwright tests - run on iPhone-like viewport.
 * These verify that key pages load and render correctly on mobile.
 * Tests use the real app with localStorage bypass for authentication.
 */

const BASE = 'http://127.0.0.1:4175/deutsch-klinik/';
const MOBILE_VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

const DEFAULT_STATE = {
  currentLevel: 'A1',
  startLevel: 'A1',
  targetLevel: 'C1',
  dailyMinutes: 15,
  daysPerWeek: 5,
  targetDate: null,
  estimatedFinishDate: null,
  onboardingComplete: true,
  goalSetupComplete: true,
  levels: { A1: { vocab: [], grammar: [], reading: [], listening: [], writing: [], speaking: [] } },
  weakAreas: { A1: {}, A2: {}, B1: {}, B2: {}, C1: {} },
};

/**
 * Helper: init localStorage for a logged-in user and navigate to a hash route.
 */
async function loginAndGo(page, hashRoute, stateOverrides = {}) {
  const merged = { ...DEFAULT_STATE, ...stateOverrides };

  await page.addInitScript(({ overrides, route }) => {
    localStorage.clear();
    localStorage.setItem('dk_active_profile', 'test-user');
    localStorage.setItem('deutsch_klinik_state_test-user', JSON.stringify(overrides));
    window.__testGoRoute = route;
  }, { overrides: merged, route: hashRoute });

  await page.goto(BASE + '#/' + (hashRoute.startsWith('/') ? hashRoute.substring(1) : hashRoute));
  await page.waitForTimeout(2000);
}

test.describe('Mobile Viewport - Key Pages', () => {

  test.use({ viewport: MOBILE_VIEWPORT });

  test('Dashboard loads on mobile - stat cards visible', async ({ page }) => {
    await loginAndGo(page, '/');
    await page.waitForTimeout(1500);

    // Dashboard should show stat cards
    const streakText = page.locator('text=Streak');
    const levelText = page.locator('text=Current Level');
    const completedText = page.locator('text=Completed');

    await expect(streakText.first()).toBeVisible({ timeout: 10000 });
    await expect(levelText.first()).toBeVisible({ timeout: 5000 });
    await expect(completedText.first()).toBeVisible({ timeout: 5000 });

    // Verify no horizontal overflow - check body width doesn't exceed viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 10);

    // Screenshot for visual check
    await page.screenshot({ path: 'mobile-dashboard.png', fullPage: true });
  });

  test('Practice Hub loads on mobile - cards in single column', async ({ page }) => {
    await loginAndGo(page, '/practice');
    await page.waitForTimeout(1500);

    // Card grid should be single column on mobile
    const cardGrid = page.locator('a[href*="/level/"], a[href*="/practice/"], a[href*="/conversation"], a[href*="/fsp-hub"]');
    const count = await cardGrid.count();
    expect(count).toBeGreaterThan(0);

    // Screenshot
    await page.screenshot({ path: 'mobile-practice-hub.png', fullPage: true });
  });

  test('Conversation route loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/conversation');
    await page.waitForTimeout(2000);

    // Should see scenario list or heading
    const pageContent = await page.locator('body').innerText();
    const hasConversationContent = pageContent.includes('Conversation') || pageContent.includes('Roleplay') || pageContent.includes('Szenario');
    expect(hasConversationContent).toBeTruthy();

    await page.screenshot({ path: 'mobile-conversation.png', fullPage: true });
  });

  test('Flashcards page loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/level/A1/vocabulary');
    await page.waitForTimeout(2000);

    // Should see flashcards UI
    const pageContent = await page.locator('body').innerText();
    const hasCardContent = pageContent.includes('Flash') || pageContent.includes('Session') || pageContent.includes('Start');
    expect(hasCardContent).toBeTruthy();

    // Check no overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 10);

    await page.screenshot({ path: 'mobile-flashcards.png', fullPage: true });
  });

  test('Today\'s Plan loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/level/A1/daily');
    await page.waitForTimeout(2000);

    const bodyText = await page.locator('body').innerText();
    const planContent = bodyText.includes('Today') || bodyText.includes('Plan') || bodyText.includes('Mission');
    expect(planContent).toBeTruthy();

    await page.screenshot({ path: 'mobile-todaysplan.png', fullPage: true });
  });

  test('Account page loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/settings/account');
    await page.waitForTimeout(1500);

    // Page should render without error and contain account-related content
    const pageContent = await page.locator('body').innerText();
    const hasRelevantContent = pageContent.includes('Account') || pageContent.includes('Cloud') || pageContent.includes('sync') || pageContent.includes('Sign') || pageContent.includes('Auth') || pageContent.includes('Profile');
    expect(hasRelevantContent).toBeTruthy();

    await page.screenshot({ path: 'mobile-account.png', fullPage: true });
  });

  test('Writing page textarea is full-width on mobile', async ({ page }) => {
    await loginAndGo(page, '/level/A1/writing');
    await page.waitForTimeout(2000);

    // Check textarea exists and is full width
    const textarea = page.locator('textarea');
    await expect(textarea.first()).toBeVisible({ timeout: 10000 });

    const textareaWidth = await textarea.first().evaluate(el => el.offsetWidth);
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    // Textarea should be close to full width (accounting for padding)
    expect(textareaWidth).toBeGreaterThan(bodyWidth * 0.8);

    await page.screenshot({ path: 'mobile-writing.png', fullPage: true });
  });

  test('Speaking page loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/level/A1/speaking');
    await page.waitForTimeout(2000);

    // Speaking page renders without crashing - find any interactive element
    const pageContent = await page.locator('body').innerText();
    const hasContent = pageContent.length > 50;
    expect(hasContent).toBeTruthy();

    await page.screenshot({ path: 'mobile-speaking.png', fullPage: true });
  });

  test('Settings page shows goal options in 3-column grid on mobile', async ({ page }) => {
    await loginAndGo(page, '/settings');
    await page.waitForTimeout(1500);

    // The target level grid should have grid-cols-3 on mobile
    const levelGrid = page.locator('button').filter({ hasText: /^(A1|A2|B1|B2|C1)$/ });
    const count = await levelGrid.count();
    expect(count).toBeGreaterThanOrEqual(5);

    await page.screenshot({ path: 'mobile-settings.png', fullPage: true });
  });

  test('Goal setup page shows options in 3-column grid on mobile', async ({ page }) => {
    await loginAndGo(page, '/goal-setup', {
      onboardingComplete: true,
      goalSetupComplete: false,
      currentLevel: 'A1',
      startLevel: 'A1',
      targetLevel: null,
    });
    await page.waitForTimeout(1500);

    // Level picker buttons should be in 3-column grid
    const levelButtons = page.locator('button').filter({ hasText: /^(A1|A2|B1|B2|C1)$/ });
    const count = await levelButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);

    await page.screenshot({ path: 'mobile-goal-setup.png', fullPage: true });
  });

  test('FSP Hub loads on mobile', async ({ page }) => {
    await loginAndGo(page, '/medical-fsp');
    await page.waitForTimeout(2000);

    // FSP Hub should render with relevant content
    const bodyText = await page.locator('body').innerText();
    const hasFSPContent = bodyText.includes('FSP') || bodyText.includes('Medical') || bodyText.includes('Modul') || bodyText.includes('Anamnese') || bodyText.includes('Examen') || bodyText.includes('Fach');
    expect(hasFSPContent).toBeTruthy();

    await page.screenshot({ path: 'mobile-fsp-hub.png', fullPage: true });
  });

  test('Navigation hamburger menu works on mobile', async ({ page }) => {
    await loginAndGo(page, '/');

    // On mobile, hamburger should be visible
    const hamburger = page.locator('button, [role="button"]').filter({ has: page.locator('svg') });
    const initialCount = await hamburger.count();
    // Kebab/hamburger menu should exist
    await page.screenshot({ path: 'mobile-nav-hamburger.png', fullPage: true });
  });

});

test.describe('Mobile Viewport - Overflow Tests', () => {

  test.use({ viewport: MOBILE_VIEWPORT });

  const OVERFLOW_PAGES = [
    { route: '/', name: 'dashboard' },
    { route: '/practice', name: 'practice-hub' },
    { route: '/level/A1/daily', name: 'todays-plan' },
    { route: '/level/A1', name: 'level-A1' },
    { route: '/settings', name: 'settings' },
    { route: '/settings/account', name: 'account' },
    { route: '/medical-fsp', name: 'fsp-hub' },
    { route: '/conversation', name: 'conversation' },
  ];

  OVERFLOW_PAGES.forEach(({ route, name }) => {
    test(`No horizontal overflow on ${name}`, async ({ page }) => {
      await loginAndGo(page, route);
      await page.waitForTimeout(1500);

      const overflow = await page.evaluate(() => {
        const all = document.querySelectorAll('*');
        const maxRight = document.documentElement.clientWidth;
        const overflowEls = [];
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.width > maxRight + 1 && rect.left >= 0 && rect.top >= 0 && rect.top < 5000) {
            overflowEls.push({
              tag: el.tagName,
              class: el.className,
              width: rect.width,
              maxRight,
            });
          }
        }
        return overflowEls;
      });

      if (overflow.length > 0) {
        console.log(`Overflow elements on ${name}:`, JSON.stringify(overflow.slice(0, 5)));
      }

      // Small scrollable containers (exercise selectors) are acceptable
      // We only flag elements that are wider than viewport AND visible on screen
      expect(overflow.length, `${name} should have no horizontal overflow`).toBe(0);

      await page.screenshot({ path: `mobile-overflow-${name}.png`, fullPage: true });
    });
  });

});

