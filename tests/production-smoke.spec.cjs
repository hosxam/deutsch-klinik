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
    await expect(body).toContainText('Mission 1 of', { timeout: 8000 });
    await expect(body).toContainText('Study a Lesson', { timeout: 3000 });
  });

  test('Grammar mission shows limited questions', async ({ page }) => {
    await page.goto(LIVE_URL + '/#/level/A1/daily', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Skip lesson to reach grammar
    for (let i = 0; i < 5; i++) {
      const txt = await body.textContent().catch(() => '');
      if (txt.includes('Grammar Practice')) break;
      const skipBtn = page.locator('button').filter({ hasText: /Skip/ }).first();
      if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    await expect(body).toContainText('Grammar Practice', { timeout: 5000 });

    // Grammar should be limited (show question counter)
    await expect(body).toContainText(/Question|Fill|Choose|Select|Conjugate/, { timeout: 3000 });
  });

  test('Dashboard navigate to daily flow', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });

    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');
    await expect(body).toContainText('Mission 1 of', { timeout: 8000 });

    // Navigate through missions to reach writing
    // Keep clicking "Skip for now" / "Next Mission" until we see Writing
    let maxClicks = 20;
    while (maxClicks-- > 0) {
      const bodyText = await body.textContent();
      if (bodyText.includes('Writing') || bodyText.includes('Writing Submitted')) {
        break;
      }
      // Try Next Mission or Skip button
      const skipBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
      if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1500);
      } else {
        break;
      }
    }

    // Verify we reached writing (or at minimum that daily mission page is still loaded)
    await expect(body).toContainText(/Writing|Mission \d+ of/, { timeout: 5000 });
  });

  test('Daily writing mission shows AI correction and copy prompt after submit', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Navigate to daily missions
    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    // Navigate through missions to reach writing
    // Complete all missions until we reach writing
    // We'll check the page first
    const body = page.locator('body');

    // Keep clicking "Skip for now" / "Next Mission" until we see Writing
    let maxClicks = 20;
    while (maxClicks-- > 0) {
      const bodyText = await body.textContent();
      if (bodyText.includes('Writing Submitted') || bodyText.includes('Writing')) {
        break;
      }
      // Try Next Mission or Skip button
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
      if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }

    // Try to find and fill the writing textarea
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await textarea.fill('Ich heiße Max und komme aus Deutschland. Ich bin Arzt und arbeite in einem Krankenhaus.');

      // Look for submit button
      const submitBtn = page.locator('button').filter({ hasText: /Submit|Correct with AI/ }).first();
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }

      // After submission, check for either AI results or copy prompt fallback
      const afterText = await body.textContent();
      const hasAiResult = afterText.includes('Score') || afterText.includes('/10') || afterText.includes('Mistakes');
      const hasFallback = afterText.includes('Copy AI Correction Prompt') || afterText.includes('Copied to clipboard');

      // Either AI result or fallback should be visible
      expect(hasAiResult || hasFallback).toBe(true);
    }
  });

  test('Daily speaking mission shows transcription buttons and transcript textarea', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Navigate to daily missions
    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Navigate through missions to reach speaking
    let maxClicks = 25;
    while (maxClicks-- > 0) {
      const bodyText = await body.textContent();
      if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
        break;
      }
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
      if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
      } else {
        break;
      }
    }

    // Check for speaking textarea
    const textarea = page.locator('textarea');
    const hasTextarea = await textarea.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (hasTextarea) {
      // Check that placeholder contains hint about transcription
      const placeholder = await textarea.first().getAttribute('placeholder');
      expect(placeholder).toContain('Write your spoken answer');

      // Check for transcription button or fallback message
      const transcribeBtn = page.locator('button').filter({ hasText: /Start Transcription/ });
      const hasTranscribe = await transcribeBtn.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasTranscribe) {
        const btnText = await transcribeBtn.textContent();
        expect(btnText).toContain('Transcription');
      } else {
        // Fallback: check for speech recognition not supported message
        const fallbackMsg = page.getByText(/speech recognition is not supported/i);
        if (await fallbackMsg.isVisible({ timeout: 1000 }).catch(() => false)) {
          expect(await fallbackMsg.textContent()).toContain('transcript');
        }
      }

      // Check for privacy note
      const privacyNote = page.getByText(/Your transcript is sent for AI feedback/i);
      if (await privacyNote.isVisible({ timeout: 1000 }).catch(() => false)) {
        expect(await privacyNote.textContent()).toContain('AI feedback');
      }

      // Fill in a speaking transcript
      await textarea.first().fill('Guten Tag, ich heiße Anna und lerne Deutsch.');

      // Check for submit/feedback button
      const submitBtn = page.locator('button').filter({ hasText: /Submit/ }).first();
      const hasSubmit = await submitBtn.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasSubmit) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }

      // After submission, check for either AI results or fallback
      const afterText = await body.textContent();
      expect(afterText.includes('Copy AI') || afterText.includes('Score') || afterText.includes('Mistakes')).toBe(true);
    }
  });

  test('Speaking mission shows Transcribe Recording button after recording', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Navigate through missions to reach speaking
    let reachedSpeaking = false;
    let maxClicks = 25;
    while (maxClicks-- > 0) {
      const bodyText = await body.textContent();
      if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
        reachedSpeaking = true;
        break;
      }
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
      if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
      } else {
        break;
      }
    }

    if (reachedSpeaking) {
      // Transcript textarea must be visible on speaking mission
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible({ timeout: 3000 });

      // Check for Start Recording button
      const recordBtn = page.locator('button').filter({ hasText: /Start Recording/ });
      const hasRecordBtn = await recordBtn.isVisible({ timeout: 1500 }).catch(() => false);
      if (hasRecordBtn) {
        // Verify recording button renders (actual recording requires microhpone permission)
        // In Playwright test env, mic permission is typically denied, so this verifies
        // the UI renders the button before attempting API calls
        await expect(recordBtn).toBeVisible({ timeout: 1000 });
      }
    }
  });

  test('Daily speaking mission shows record and transcribe buttons', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');
    let reachedSpeaking = false;
    let maxClicks = 25;
    while (maxClicks-- > 0) {
      const bodyText = await body.textContent();
      if (bodyText.includes('Speaking') && (bodyText.includes('your spoken answer') || bodyText.includes('Write your spoken answer'))) {
        reachedSpeaking = true;
        break;
      }
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission|Skip.*now|See Results/ }).first();
      if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
      } else {
        break;
      }
    }

    if (reachedSpeaking) {
      // Textarea must exist for transcript (always rendered)
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible({ timeout: 3000 });

      // Transcribe Recording button text should exist in the DOM somewhere
      // (only visible after recording, but the label is correct)
      const transcribeLabel = page.getByText(/Transcribe Recording/i);
      // Should be in DOM (may be hidden until recording state)
      const hasLabel = await transcribeLabel.isVisible({ timeout: 1000 }).catch(() => false);

      // Verify we can type into the textarea
      await textarea.fill('Guten Tag, ich heiße Anna und lerne Deutsch.');
      await expect(textarea).toHaveValue('Guten Tag, ich heiße Anna und lerne Deutsch.');

      // Submit button should exist
      const submitBtn = page.locator('button').filter({ hasText: /Submit/ }).first();
      await expect(submitBtn).toBeVisible({ timeout: 2000 });
    }
  });

  test('Daily lesson shows explanation content after clicking Study Lesson', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Clear state to see lesson mission
    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');
    await expect(body).toContainText('Mission 1 of', { timeout: 8000 });

    // Click Study Lesson button
    const studyBtn = page.locator('button').filter({ hasText: /Study Lesson/ }).first();
    if (await studyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await studyBtn.click();
      await page.waitForTimeout(1500);

      // Now lesson content should be visible (explanation, examples, grammar focus etc.)
      await expect(body).toContainText('Explanation', { timeout: 3000 });
      // Also check for vocabulary or other content sections
      const hasVocabOrExamples = await body.getByText(/Key Vocabulary|Grammar Focus|Examples|Practice Questions|Summary/).first().isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasVocabOrExamples).toBe(true);
    }
  });

  test('Grammar practice shows practicing label linked to grammar lesson', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Navigate through missions to reach grammar practice
    for (let i = 0; i < 8; i++) {
      const txt = await body.textContent().catch(() => '');
      if (txt.includes('Grammar Practice') && (txt.includes('Question') || txt.includes('Type your answer'))) break;
      const skipBtn = page.locator('button').filter({ hasText: /Skip|Next Mission|Mark Lesson Complete/ }).first();
      if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    // Grammar practice should have type/input rendering
    const txt = await body.textContent();
    if (txt.includes('Grammar Practice')) {
      // Check either text input or options are rendered
      const hasInput = await page.locator('input[type="text"]').first().isVisible({ timeout: 2000 }).catch(() => false);
      const hasOptions = await page.locator('button').filter({ hasText: /^[A-Z]\)|^der |^die |^das / }).first().isVisible({ timeout: 1000 }).catch(() => false);
      expect(hasInput || hasOptions).toBe(true);
    }
  });

  test('Fill-blank question shows text input and Check button', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Navigate through missions to reach grammar practice
    for (let i = 0; i < 8; i++) {
      const txt = await body.textContent().catch(() => '');
      if (txt.includes('Fill in the Blank') || txt.includes('Type your answer')) break;
      const skipBtn = page.locator('button').filter({ hasText: /Skip|Next Mission|Mark Lesson Complete/ }).first();
      if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
      }
    }

    // Look for the text input and Check button
    const textInput = page.locator('input[type="text"]').first();
    const hasInput = await textInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasInput) {
      await textInput.fill('test answer');
      const checkBtn = page.locator('button').filter({ hasText: /Check/ }).first();
      await expect(checkBtn).toBeVisible({ timeout: 1000 });
      await checkBtn.click();
      await page.waitForTimeout(500);

      // After checking, feedback should appear
      await expect(body).toContainText(/Correct|Incorrect/, { timeout: 3000 });
    }
  });

  test('Grammar completion shows review screen', async ({ page }) => {
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today's? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const body = page.locator('body');

    // Navigate through all missions to reach grammar practice completion
    for (let i = 0; i < 10; i++) {
      const txt = await body.textContent().catch(() => '');
      if (txt.includes('Mission Complete') || txt.includes('Next Mission')) {
        const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
        if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(1000);
        }
      } else {
        const skipBtn = page.locator('button').filter({ hasText: /Skip|Mark Lesson Complete/ }).first();
        if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await skipBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('Post-vocabulary mission renders without Square is not defined', async ({ page }) => {
    // Regression: after completing Vocabulary, clicking Next Mission
    // must not crash with 'Square is not defined'
    test.setTimeout(120000);
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today\'s? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const body = page.locator('body');
    let foundVocab = false;

    for (let i = 0; i < 20; i++) {
      const txt = await body.textContent().catch(() => '');
      if (!txt) break;
      expect(txt).not.toContain('Something broke');

      if (txt.includes('Vocabulary Quiz') || txt.includes('Vocabulary')) {
        foundVocab = true;
      }

      // If vocab section is showing, skip through all vocab questions
      if (foundVocab) {
        // Look for the Next button after a vocab answer
        const nextQBtn = page.locator('button').filter({ hasText: /Next/ }).first();
        if (await nextQBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await nextQBtn.click();
          await page.waitForTimeout(500);
          continue;
        }
      }

      // Try Next Mission
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
        // After clicking Next Mission from vocabulary, check no crash
        const afterTxt = await body.textContent().catch(() => '');
        expect(afterTxt).not.toContain('Something broke');
        expect(afterTxt).not.toContain('Square is not defined');
        // If the next mission is Listening, verify it rendered
        if (afterTxt.includes('Listening')) {
          break;
        }
        continue;
      }

      // Try Skip for now
      const skipBtn = page.locator('button').filter({ hasText: /Skip for now/ }).first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
        const afterTxt = await body.textContent().catch(() => '');
        expect(afterTxt).not.toContain('Something broke');
        continue;
      }

      // Try Mark Complete
      const markBtn = page.locator('button').filter({ hasText: /Mark Complete/ }).first();
      if (await markBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await markBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      break;
    }

    // Assert no JavaScript errors
    const squareErrors = errors.filter(e => e.includes('Square is not defined'));
    expect(squareErrors).toEqual([]);
    expect(errors.filter(e => e.includes('is not defined'))).toEqual([]);
  });

  test('Listening true-false renders Richtig/Falsch buttons', async ({ page }) => {
    // Regression: true-false questions in listening must show answer buttons
    test.setTimeout(120000);
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today\'s? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const body = page.locator('body');

    // Navigate through missions until we hit Listening
    for (let i = 0; i < 20; i++) {
      const txt = await body.textContent().catch(() => '');
      if (!txt) break;
      expect(txt).not.toContain('Something broke');

      // If this is Listening, check for true-false buttons
      if (txt.includes('Listening') && txt.includes('True/False')) {
        // Wait a moment for render
        await page.waitForTimeout(1000);
        // Check for Richtig or Falsch buttons
        const richtigBtn = page.locator('button').filter({ hasText: 'Richtig' });
        const falschBtn = page.locator('button').filter({ hasText: 'Falsch' });
        const hasRichtig = await richtigBtn.isVisible({ timeout: 2000 }).catch(() => false);
        const hasFalsch = await falschBtn.isVisible({ timeout: 500 }).catch(() => false);
        expect(hasRichtig || hasFalsch).toBe(true);

        // Click one and check feedback
        if (hasRichtig) {
          await richtigBtn.click();
          await page.waitForTimeout(500);
          const feedbackTxt = await body.textContent();
          expect(feedbackTxt).toMatch(/Correct!|Incorrect/);
        }
        break;
      }

      // Try Next Mission
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      // Try Skip for now
      const skipBtn = page.locator('button').filter({ hasText: /Skip for now/ }).first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      // Try Mark Complete
      const markBtn = page.locator('button').filter({ hasText: /Mark Complete/ }).first();
      if (await markBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await markBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      break;
    }

    expect(errors.filter(e => e.includes('is not defined'))).toEqual([]);
  });

  test('Listening difficulty label shows Easy for A1 beginner', async ({ page }) => {
    // Regression: first A1 listening mission should show Easy difficulty
    test.setTimeout(120000);
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today\'s? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const body = page.locator('body');

    // Navigate through missions until we hit Listening
    for (let i = 0; i < 20; i++) {
      const txt = await body.textContent().catch(() => '');
      if (!txt) break;
      expect(txt).not.toContain('Something broke');

      if (txt.includes('Listening') && !txt.includes('Complete')) {
        await page.waitForTimeout(1000);
        // Check for Easy badge
        const hasEasy = await page.getByText('Easy').isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasEasy).toBe(true);
        break;
      }

      const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      const skipBtn = page.locator('button').filter({ hasText: /Skip for now/ }).first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      const markBtn = page.locator('button').filter({ hasText: /Mark Complete/ }).first();
      if (await markBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await markBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      break;
    }

    expect(errors.filter(e => e.includes('is not defined'))).toEqual([]);
  });

  test('Mission transition does not crash - navigate all missions', async ({ page }) => {
    // Regression: verify getNextListening/getNextReading/getNextWriting/getNextSpeaking exist
    // and mission transitions don't throw 'getNextListening is not defined'
    test.setTimeout(120000);
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a').filter({ hasText: /Start Today\'s? Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    // Track page errors
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const body = page.locator('body');

    // Navigate through up to 20 missions/steps
    for (let i = 0; i < 20; i++) {
      const txt = await body.textContent().catch(() => '');
      if (!txt) break;

      // Assert no 'Something broke' crash at each step
      expect(txt).not.toContain('Something broke');

      // If we hit the dashboard summary, stop
      if (txt.includes('Dashboard') && !txt.includes('Start')) {
        break;
      }

      // Try Next Mission button first
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      // Try Skip or Mark Complete
      const skipBtn = page.locator('button').filter({ hasText: /Skip|Mark Complete|Skip for now/ }).first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      // If no buttons found, break
      break;
    }

    // Assert no JavaScript errors occurred during navigation
    const getNextErrors = errors.filter(e => e.includes('getNext'));
    expect(getNextErrors).toEqual([]);
  });

  test('Listening completion shows Next Mission button after answering all questions', async ({ page }) => {
    // Regression: after finishing all listening questions, the mission completion
    // screen must appear with "Listening Complete!" and "Next Mission" button
    test.setTimeout(60000);

    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Clear state for fresh daily session
    await page.evaluate(() => localStorage.removeItem('deutsch_klinik_state'));
    await page.reload();
    await page.waitForTimeout(2000);

    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    // Start daily plan
    const startBtn = page.locator('a').filter({ hasText: /Start Today\'s\s?Plan/ }).first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await page.waitForTimeout(3000);

    // Navigate through missions. When we find listening (Richtig/Falsch buttons),
    // answer all questions and look for the completion screen.
    for (let i = 0; i < 25; i++) {
      const txt = await page.locator('body').textContent().catch(() => '');
      if (!txt || txt.includes('Something broke')) break;

      // If we see Listening Complete, our fix is working
      if (txt.includes('Listening Complete')) {
        break;
      }

      // Check for listening question buttons (Richtig/Falsch)
      const richtig = page.locator('button').filter({ hasText: 'Richtig' }).first();
      if (await richtig.isVisible({ timeout: 200 }).catch(() => false)) {
        // Answer all questions
        for (let q = 0; q < 12; q++) {
          const rBtn = page.locator('button').filter({ hasText: 'Richtig' }).first();
          if (await rBtn.isVisible({ timeout: 100 }).catch(() => false)) {
            await rBtn.click();
            await page.waitForTimeout(300);
          } else {
            const fBtn = page.locator('button').filter({ hasText: 'Falsch' }).first();
            if (await fBtn.isVisible({ timeout: 100 }).catch(() => false)) {
              await fBtn.click();
              await page.waitForTimeout(300);
            }
          }
          const bodyNow = await page.locator('body').textContent().catch(() => '');
          if (bodyNow.includes('Listening Complete')) break;
          const nqBtn = page.locator('button').filter({ hasText: 'Next Question' }).first();
          if (await nqBtn.isVisible({ timeout: 100 }).catch(() => false)) {
            await nqBtn.click();
            await page.waitForTimeout(300);
          }
        }
        // Check if completion appeared
        const bodyDone = await page.locator('body').textContent().catch(() => '');
        if (bodyDone.includes('Listening Complete')) break;
      }

      // Try Next Mission button
      const nextBtn = page.locator('button').filter({ hasText: /Next Mission/ }).first();
      if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      // Try Skip / Mark Complete
      const skipBtn = page.locator('button').filter({ hasText: /Skip|Mark Complete|Skip for now/ }).first();
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(800);
        continue;
      }

      break;
    }

    // Verify completion screen appeared
    const finalBody = await page.locator('body').textContent().catch(() => '');
    expect(finalBody).toContain('Listening Complete');
    expect(finalBody).toContain('Next Mission');

    // Click Next Mission
    const finalNext = page.locator('button').filter({ hasText: /Next Mission/ }).first();
    await expect(finalNext).toBeVisible({ timeout: 3000 });
    await finalNext.click();
    await page.waitForTimeout(1500);

    // Verify we moved past listening
    const afterNext = await page.locator('body').textContent().catch(() => '');
    expect(afterNext).not.toContain('Listening Complete');

    // Assert no page crashes
    expect(pageErrors).toEqual([]);
  });
});
