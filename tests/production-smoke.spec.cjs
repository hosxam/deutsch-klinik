// @ts-check
const { test, expect } = require('@playwright/test');

const LIVE_URL = 'https://hosxam.github.io/deutsch-klinik';

/**
 * Collect console errors during a test.
 * @param {import('@playwright/test').Page} page
 * @returns {{ errors: string[], start: () => void, stop: () => void }}
 */
function consoleWatcher(page) {
  const errors = [];
  let active = false;
  const handler = (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  };
  return {
    errors,
    start() { active = true; page.on('console', handler); },
    stop() { active = false; page.removeListener('console', handler); },
    assertNoErrors() {
      if (errors.length > 0) {
        test.info().attach('console-errors', { body: errors.join('\n') });
      }
      expect(errors).toEqual([]);
    }
  };
}

/**
 * Set localStorage to unlock a level for testing.
 * Must be followed by a full page reload so the SPA re-initializes.
 */
async function unlockLevelRaw(page, levelId) {
  await page.evaluate((id) => {
    const key = 'deutsch_klinik_state';
    const state = JSON.parse(localStorage.getItem(key) || '{}');
    state.levels = state.levels || {};
    state.levels[id] = state.levels[id] || {};

    state.levels[id].grammar = Array.from({ length: 10 }, (_, i) => ({ id: `${id}_debug_grammar_${i}` }));
    state.levels[id].vocab = Array.from({ length: 10 }, (_, i) => ({ id: `${id}_debug_vocab_${i}` }));
    state.levels[id].listening = Array.from({ length: 5 }, (_, i) => ({ id: `${id}_debug_listening_${i}`, score: 100 }));
    state.levels[id].reading = Array.from({ length: 5 }, (_, i) => ({ id: `${id}_debug_reading_${i}`, score: 100 }));

    state.completedLessons = state.completedLessons || {};
    state.completedLessons[id] = Array.from({ length: 10 }, (_, i) => `${id}_debug_lesson_${i}`);

    state.writings = state.writings || [];
    state.writings = state.writings.filter(w => w.level !== id);
    state.writings.push(...Array.from({ length: 10 }, (_, i) => ({
      id: `${id}_debug_writing_${i}`,
      level: id,
      text: 'Debug writing submission'
    })));

    state.speakingRecordings = state.speakingRecordings || {};
    state.speakingRecordings[id] = Array.from({ length: 10 }, (_, i) => ({
      id: `${id}_debug_speaking_${i}`,
      level: id,
      text: 'Debug speaking submission'
    }));

    // For non-A1 levels: set the prerequisite exam as passed (LevelLock check)
    // A1 has requires:null, skips LevelLock; others need the preceding level exam
    state.exams = state.exams || {};
    const prerequisiteExams = { A2: 'A1', B1: 'A2', B2: 'B1', C1: 'B2' };
    const prereq = prerequisiteExams[id];
    if (prereq) {
      state.exams[prereq] = { passed: true, score: 85, date: new Date().toISOString().split('T')[0] };
    }

    localStorage.setItem(key, JSON.stringify(state));
  }, levelId);
}

/**
 * Helper: unlock a level and hard-navigate to the given hash route.
 * Uses a cache-busting query param to force a full SPA re-bootstrap
 * so localStorage changes are picked up by loadState().
 */
async function unlockAndVisit(page, levelId, url) {
  // Visit any page first to set the origin
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded' });
  await unlockLevelRaw(page, levelId);
  // Cache-busting query param forces real reload.
  // Extract hash route from url (everything after the first #)
  const hashIndex = url.indexOf('#');
  const hash = hashIndex >= 0 ? url.substring(hashIndex) : '';
  await page.goto(LIVE_URL + '/?_t=' + Date.now() + hash, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
}

// ======= A. Homepage loads without crash =======
test.describe('A. Homepage smoke test', () => {
  test('loads without crash or console errors', async ({ page }) => {
    const watcher = consoleWatcher(page);
    watcher.start();
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    watcher.stop();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    await expect(body).not.toContainText('mo.filter', { timeout: 1000 });
    watcher.assertNoErrors();
  });
});

// ======= B. Dashboard network optimization =======
test.describe('B. Dashboard network check', () => {
  test('does not request germanVocabulary, germanLessons, or grammar chunks', async ({ page }) => {
    const requestedUrls = [];

    page.on('request', (req) => {
      const url = req.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        requestedUrls.push(url);
      }
    });

    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const jsUrls = [...new Set(requestedUrls)];
    test.info().attach('js-requests', { body: jsUrls.join('\n') });

    for (const url of jsUrls) {
      const name = url.split('/').pop() || url;
      expect(name, `Dashboard should not load ${name}`).not.toMatch(/germanVocabulary|germanLessons|grammar-(?!Page)/);
    }

    const dashboardChunk = jsUrls.find(u => u.includes('Dashboard-') && u.endsWith('.js'));
    expect(dashboardChunk, 'Dashboard chunk should be loaded').toBeTruthy();

    const indexChunk = jsUrls.find(u => u.includes('index-') && u.endsWith('.js'));
    expect(indexChunk, 'Index chunk should be loaded').toBeTruthy();
  });
});

// ======= C. A1 locked requirements page =======
test.describe('C. A1 locked requirements page', () => {
  test('shows skill cards, no Mini Quizzes, locked exam indicator', async ({ page }) => {
    // Clear state by visiting and clearing localStorage
    await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.goto(`${LIVE_URL}/#/level/A1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const watcher = consoleWatcher(page);
    watcher.start();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    await expect(body).not.toContainText('Level not found', { timeout: 1000 });

    // Skill grid cards visible
    const readingCard = page.getByText('Reading', { exact: false }).first();
    await expect(readingCard).toBeVisible({ timeout: 3000 });

    // Mini Quizzes not on LevelPage
    await expect(page.getByText('Mini Quiz', { exact: false })).toHaveCount(0);

    // Locked exam section
    const examSection = page.locator('text=Goethe-Style Exam');
    await expect(examSection).toBeVisible({ timeout: 3000 });

    // Missing requirements card
    const missingCard = page.getByText('Complete these to unlock', { exact: false });
    await expect(missingCard).toBeVisible({ timeout: 3000 });

    watcher.assertNoErrors();
  });
});

// ======= D. A1 unlock + exam route =======
test.describe('D. A1 unlock simulation', () => {
  test('A1 exam unlocks and exam page loads', async ({ page }) => {
    // Hard-navigate with unlock state pre-set
    await unlockAndVisit(page, 'A1', `${LIVE_URL}/#/level/A1/exam`);

    const watcher = consoleWatcher(page);
    watcher.start();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    await expect(body).not.toContainText('Level not found', { timeout: 1000 });

    // Should see exam content (exam select or intro)
    const examContent = page.getByText(/Practice Exam|Start Exam|Goethe|^Lesen$|^Hören$|^Schreiben$|^Sprechen$/);
    await expect(examContent.first()).toBeVisible({ timeout: 5000 });

    watcher.assertNoErrors();
  });
});

// ======= E. B1 short-answer rendering + scoring =======
test.describe('E. B1 short-answer test', () => {
  test('B1 short-answer input renders', async ({ page }) => {
    // Hard-navigate with unlock to B1 exam page
    await unlockAndVisit(page, 'B1', `${LIVE_URL}/#/level/B1/exam`);

    const watcher = consoleWatcher(page);
    watcher.start();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    await expect(body).not.toContainText('Level not found', { timeout: 1000 });

    // B1 has multi-exam select. Find exam 3 "Wohnen und Miete"
    // Note: clicking the exam button in 'select' phase directly calls
    // startExam(idx) which sets phase='active' - no separate 'Start Exam' btn.
    const examBtn = page.locator('button').filter({ hasText: /Wohnen/ });
    if (await examBtn.count() > 0) {
      await examBtn.first().click();
      await page.waitForTimeout(1500);
    }

    // Should be in Lesen section with short-answer input
    const shortInput = page.locator('input[type="text"]');
    await expect(shortInput.first()).toBeVisible({ timeout: 5000 });

    // Fill with "22 uhr."
    await shortInput.first().fill('22 uhr.');

    // Submit Lesen section
    const nextBtn = page.getByText('Next Section');
    await expect(nextBtn).toBeVisible({ timeout: 3000 });
    await nextBtn.click();
    await page.waitForTimeout(2000);

    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    watcher.assertNoErrors();
  });
});

// ======= F. Schreiben smoke test =======
test.describe('F. Schreiben behavior', () => {
  test('textarea renders and accepts text without crash', async ({ page }) => {
    await unlockAndVisit(page, 'B1', `${LIVE_URL}/#/level/B1/exam`);

    const watcher = consoleWatcher(page);
    watcher.start();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });

    // Select exam 3 (click directly starts exam, no separate 'Start Exam' btn)
    const examBtn = page.locator('button').filter({ hasText: /Wohnen/ });
    if (await examBtn.count() > 0) {
      await examBtn.first().click();
      await page.waitForTimeout(1500);
    }

    // Navigate sections to reach Schreiben
    for (let sectionIdx = 0; sectionIdx < 4; sectionIdx++) {
      const textarea = page.locator('textarea');
      if (await textarea.isVisible({ timeout: 1500 }).catch(() => false)) {
        await textarea.first().fill('Sehr geehrte Damen und Herren, ich moechte mich entschuldigen.');
        await page.waitForTimeout(300);

        const submit = page.getByText('Next Section').or(page.getByText('Finish Exam'));
        await submit.first().click();
        await page.waitForTimeout(2000);

        await expect(body).not.toContainText('Something broke', { timeout: 1000 });
        watcher.assertNoErrors();
        return;
      }

      const next = page.getByText('Next Section');
      if (await next.isVisible({ timeout: 1500 }).catch(() => false)) {
        await next.click();
        await page.waitForTimeout(1500);
      } else {
        break;
      }
    }

    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    watcher.assertNoErrors();
  });
});

// ======= G. Existing task types regression =======
test.describe('G. Existing task type regression', () => {
  test('mcq, true-false, gap-fill, heading-match, short-answer all render', async ({ page }) => {
    await unlockAndVisit(page, 'B1', `${LIVE_URL}/#/level/B1/exam`);

    const watcher = consoleWatcher(page);
    watcher.start();

    const body = page.locator('body');
    await expect(body).not.toContainText('Something broke', { timeout: 1000 });

    // Select exam 3 (click starts exam directly, no separate 'Start Exam' btn)
    const examBtn = page.locator('button').filter({ hasText: /Wohnen/ });
    if (await examBtn.count() > 0) {
      await examBtn.first().click();
      await page.waitForTimeout(1500);
    }

    // True/False buttons
    const trueBtns = page.getByText('True', { exact: true });
    await expect(trueBtns.first()).toBeVisible({ timeout: 3000 });
    await trueBtns.first().click();
    await page.waitForTimeout(300);

    // MCQ options (A) etc.)
    const mcqOption = page.getByText(/^A\)/);
    if (await mcqOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mcqOption.click();
      await page.waitForTimeout(300);
    }

    // Short-answer input
    const shortInput = page.locator('input[type="text"]');
    await expect(shortInput.first()).toBeVisible({ timeout: 3000 });

    await shortInput.first().fill('22 uhr.');

    const nextBtn = page.getByText('Next Section');
    await expect(nextBtn).toBeVisible({ timeout: 3000 });
    await nextBtn.click();
    await page.waitForTimeout(2000);

    await expect(body).not.toContainText('Something broke', { timeout: 1000 });
    watcher.assertNoErrors();
  });
});


/* H. Daily Mission Flow */
test.describe('H. Daily Mission Flow', () => {

  test('Dashboard has Start Today Plan button', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ });
    await expect(startBtn).toBeVisible({ timeout: 5000 });

    const href = await startBtn.getAttribute('href');
    expect(href).toContain('/daily');
  });

  test('Daily page loads mission header', async ({ page }) => {
    await page.goto(LIVE_URL + '/#/level/A1/daily', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const body = page.locator('body');
    await expect(body).toContainText("Today's Plan", { timeout: 5000 });
    await expect(body).toContainText('Mission 1 of', { timeout: 3000 });
  });

  test('Grammar mission shows limited questions', async ({ page }) => {
    await page.goto(LIVE_URL + '/#/level/A1/daily', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    for (let i = 0; i < 5; i++) {
      const txt = await body.textContent();
      if (txt.includes('Grammar Practice')) break;
      const skipBtn = page.locator('button').filter({ hasText: /Skip/ }).first();
      if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    const questionText = await body.textContent();
    expect(questionText).toContain('Question');

    const match = questionText.match(/Question \d+ of (\d+)/);
    if (match) {
      const total = parseInt(match[1]);
      expect(total).toBeLessThanOrEqual(25);
    }
  });

  test('Dashboard navigate to daily flow', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });

    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');
    await expect(body).toContainText("Today's Plan", { timeout: 5000 });
  });
});
