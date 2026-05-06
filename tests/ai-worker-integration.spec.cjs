// @ts-check
const { test, expect } = require('@playwright/test');

const PREVIEW_URL = 'http://localhost:4175/deutsch-klinik';
const WORKER_RE = /deutsch-klinik-ai-correction\.deutsch-klinik\.workers\.dev/;

async function gotoPreview(page, hash) {
  await page.goto(`${PREVIEW_URL}/#${hash}`, { waitUntil: 'networkidle' });
}

async function completeWriting(page) {
  await gotoPreview(page, '/level/A1/writing');
  await page.getByLabel('Writing response').fill('Ich lerne Deutsch, weil ich in Deutschland arbeiten moechte. Ich uebe jeden Tag.');
  await page.getByRole('button', { name: /^Submit$/ }).click();
}

async function completeSpeaking(page) {
  await gotoPreview(page, '/level/A1/speaking');
  await page.getByRole('button', { name: /Start Preparation/ }).click();
  await page.getByRole('button', { name: /Stop & Complete/ }).click();
  await page.getByLabel('Spoken answer transcript').fill('Ich lerne Deutsch und spreche jeden Tag mit Freunden.');
}

test.describe('Cloudflare Workers AI integration', () => {
  test('writing submission calls the configured Cloudflare Worker and displays feedback', async ({ page }) => {
    let requestBody = null;
    await page.route(WORKER_RE, async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          score: 8,
          rubric: {
            grammar: 'Good control.',
            vocabulary: 'Useful everyday vocabulary.',
            structure: 'Clear structure.',
            taskCompletion: 'Task complete.',
          },
          mistakes: [{ original: 'ich', corrected: 'Ich', explanation: 'Capitalize sentence starts.' }],
          correctedVersion: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten moechte.',
          improvedVersion: 'Ich lerne Deutsch, weil ich spaeter in Deutschland arbeiten moechte.',
          flashcards: [{ german: 'arbeiten', english: 'to work' }],
        }),
      });
    });

    await completeWriting(page);

    await expect(page.getByText('Overall Score')).toBeVisible();
    await expect(page.getByText('8/10')).toBeVisible();
    await expect(page.getByText('Corrected Version')).toBeVisible();
    await expect(page.getByText('arbeiten', { exact: true })).toBeVisible();
    expect(requestBody).toMatchObject({ type: 'writing', level: 'A1' });
    expect(requestBody.userAnswer).toContain('Ich lerne Deutsch');
  });

  test('writing fallback still shows useful feedback when the Worker is unreachable', async ({ page }) => {
    await page.route(WORKER_RE, route => route.abort('failed'));

    await completeWriting(page);

    await expect(page.getByText('Overall Score')).toBeVisible();
    await expect(page.getByText('Rubric Breakdown')).toBeVisible();
    await expect(page.getByText('Corrected Version')).toBeVisible();
    await expect(page.getByText('Copy AI Correction Prompt')).toBeVisible();
  });

  test('speaking transcript submission calls the configured Cloudflare Worker and displays feedback', async ({ page }) => {
    let requestBody = null;
    await page.route(WORKER_RE, async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          score: 7,
          rubric: {
            fluency: 'Mostly fluent.',
            grammar: 'Minor word-order issues.',
            vocabulary: 'Appropriate.',
            pronunciation: 'Practice umlauts.',
          },
          mistakes: [{ original: 'Ich spreche gut', corrected: 'Ich spreche gut Deutsch', explanation: 'Add the object.' }],
          betterPhrases: [{ original: 'Ich denke', better: 'Meiner Ansicht nach', explanation: 'More natural.' }],
          correctedTranscript: 'Ich lerne Deutsch und spreche jeden Tag mit Freunden.',
          strongerAnswer: 'Ich lerne Deutsch regelmaessig und versuche, jeden Tag frei zu sprechen.',
          phrasesToMemorize: [{ german: 'Meiner Ansicht nach', english: 'In my opinion' }],
        }),
      });
    });

    await completeSpeaking(page);
    await page.getByRole('button', { name: /Get Speaking Feedback/ }).click();

    await expect(page.getByText('Speaking Score')).toBeVisible();
    await expect(page.getByText('7/10')).toBeVisible();
    await expect(page.getByText('Corrected Transcript')).toBeVisible();
    await expect(page.getByText('Meiner Ansicht nach', { exact: true })).toBeVisible();
    expect(requestBody).toMatchObject({ type: 'speaking', level: 'A1' });
    expect(requestBody.transcript).toContain('Ich lerne Deutsch');
  });

  test('speaking fallback shows useful feedback and is not a transcription dead end', async ({ page }) => {
    await page.route(WORKER_RE, route => route.abort('failed'));

    await completeSpeaking(page);
    await expect(page.getByText('AI transcription is not configured')).toHaveCount(0);
    await page.getByRole('button', { name: /Get Speaking Feedback/ }).click();

    await expect(page.getByText('Speaking Score')).toBeVisible();
    await expect(page.getByText('Rubric Breakdown')).toBeVisible();
    await expect(page.getByText('Corrected Transcript')).toBeVisible();
    await expect(page.getByText('Copy prompt for AI correction')).toBeVisible();
  });
});
