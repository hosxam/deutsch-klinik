// @ts-check
const { test, expect } = require('@playwright/test');

const PREVIEW_URL = 'http://localhost:4175/deutsch-klinik';

async function gotoPreview(page, hash = '/') {
  await page.goto(`${PREVIEW_URL}/#${hash}`, { waitUntil: 'networkidle' });
}

async function seed(page, { state = {}, goal = null } = {}) {
  await page.addInitScript(({ state, goal }) => {
    localStorage.clear();
    localStorage.setItem('deutsch_klinik_state', JSON.stringify({
      currentLevel: 'A1',
      theme: 'dark',
      levels: {},
      writings: [],
      speakingRecordings: {},
      incorrectAnswers: {},
      mistakeNotebook: {},
      topicWeakness: {},
      vocabularyMastery: {},
      flashcards: {},
      ...state,
    }));
    if (goal) localStorage.setItem('deutsch_klinik_study_goal', JSON.stringify(goal));
  }, { state, goal });
}

test.describe('Adaptive product flows', () => {
  test('local mode cloud sync fallback does not block the dashboard', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/');
    await expect(page.getByText('Local mode active. Your progress is saved on this device.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Start Today's Plan/i })).toBeVisible();
  });

  test('study goal predicts finish date without requiring goal date', async ({ page }) => {
    await seed(page, {
      goal: { targetLevel: 'C1', targetDate: '', dailyMinutes: 90, planType: 'full' },
    });
    await gotoPreview(page, '/');
    await expect(page.getByText('Estimated finish')).toBeVisible();
    await expect(page.getByText('Full Mastery').first()).toBeVisible();
    await expect(page.getByText('90/90 min')).not.toBeVisible();
    await expect(page.getByText(/Remaining/i).first()).toBeVisible();
  });

  test('90-minute plan shows more work than 30-minute plan and includes flashcards', async ({ browser }) => {
    const standardPage = await browser.newPage();
    await seed(standardPage, {
      goal: { targetLevel: 'C1', targetDate: '', dailyMinutes: 30, planType: 'exam' },
    });
    await gotoPreview(standardPage, '/level/A1/daily?plan=30');
    const standard = await standardPage.locator('body').innerText();
    await standardPage.close();

    const masteryPage = await browser.newPage();
    await seed(masteryPage, {
      goal: { targetLevel: 'C1', targetDate: '', dailyMinutes: 90, planType: 'full' },
    });
    await gotoPreview(masteryPage, '/level/A1/daily?plan=90');
    const mastery = await masteryPage.locator('body').innerText();
    await masteryPage.close();

    expect(standard).toContain('Complete 6 questions');
    expect(mastery).toContain('Complete 14 questions');
    expect(mastery).toContain('Review 20 due/weak flashcards');
  });

  test('daily flashcard mission counts toward vocab progress and advances', async ({ page }) => {
    await seed(page, {
      goal: { targetLevel: 'C1', targetDate: '', dailyMinutes: 90, planType: 'full' },
    });
    await gotoPreview(page, '/level/A1/daily?forceMission=flashcards');
    await expect(page.getByText('Flashcards in Today')).toBeVisible();
    await page.getByRole('button', { name: /Mark Flashcards Done/i }).click();
    await expect(page.getByText('Daily Plan Complete')).toBeVisible();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('deutsch_klinik_state') || '{}'));
    expect(stored.dailyStudyLog?.some((x) => x.type === 'flashcards')).toBeTruthy();
    expect(stored.levels?.A1?.vocab?.length).toBeGreaterThan(0);
  });

  test('Mark as mastered removes a filtered mistake visibly', async ({ page }) => {
    await seed(page, {
      state: {
        incorrectAnswers: {
          A1: [{ exerciseId: 'A1_gr_test', userAnswer: 'der', correctAnswer: 'die', topic: 'Articles', skill: 'grammar', date: '2026-05-06T10:00:00.000Z' }],
        },
        mistakeNotebook: {
          m1: { exerciseId: 'A1_gr_test', userAnswer: 'der', correctAnswer: 'die', topic: 'Articles', skill: 'grammar', level: 'A1', date: '2026-05-06T10:00:00.000Z' },
        },
        topicWeakness: { Articles: { correct: 0, incorrect: 2, status: 'weak' } },
      },
    });
    await gotoPreview(page, '/mistake-notebook');
    await page.getByText('Question').click();
    await page.getByRole('button', { name: /Mark as mastered/i }).click();
    await expect(page.getByText('No mistakes found with current filters')).toBeVisible();
  });

  test('vocab review is filtered and Knew it advances the visible queue', async ({ page }) => {
    await seed(page, {
      state: {
        currentLevel: 'A1',
        vocabularyMastery: {
          A1_1: { correct: 0, incorrect: 2, mastered: false, ease: 2.1, interval: 1, due: '2020-01-01', repetitions: 0 },
          A1_2: { correct: 0, incorrect: 1, mastered: false, ease: 2.1, interval: 1, due: '2020-01-01', repetitions: 0 },
        },
      },
    });
    await gotoPreview(page, '/mistake-notebook');
    await page.getByRole('button', { name: /Vocab Review/i }).click();
    const firstCardText = await page.locator('button', { hasText: 'Knew it' }).first().evaluate((button) => {
      const card = button.closest('div[style*="border-radius"]');
      return card?.innerText || '';
    });
    const before = await page.locator('button', { hasText: 'Knew it' }).count();
    expect(before).toBeGreaterThan(0);
    expect(before).toBeLessThanOrEqual(20);
    await page.locator('button', { hasText: 'Knew it' }).first().click();
    await expect(page.getByText(firstCardText.split('\n')[0]).first()).not.toBeVisible();
  });

  test('dashboard nav uses compact level selector instead of separate level links', async ({ page }) => {
    await seed(page);
    await gotoPreview(page, '/');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Select level' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Level A1' })).toHaveCount(0);
  });
});
