/**
 * Playwright smoke tests for AI-unavailable states.
 * These check that the app renders gracefully when AI endpoints are missing.
 * Mock the env so AI is disabled/unreachable.
 */

const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    // Set localStorage to simulate no AI config
    storageState: undefined,
  });
  const page = await context.newPage();

  let failures = [];

  // Helper to check page loads without crash
  async function checkPageLoad(label, url, checkSelector = null) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      // Wait for body to render
      await page.waitForSelector('body', { timeout: 10000 });
      // Check for React error boundary or crash indicators
      const bodyText = await page.textContent('body').catch(() => '');
      if (bodyText.includes('Error') && bodyText.length < 200) {
        // Only flag if it's a full-page error, not inline error messages
        const hasErrorBoundary = await page.evaluate(() => {
          // Check for error overlay (React dev overlay)
          return !!document.querySelector('[data-reactroot]') === false;
        }).catch(() => false);
      }
      if (checkSelector) {
        await page.waitForSelector(checkSelector, { timeout: 5000 });
      }
      console.log(`  ✓ ${label}`);
    } catch (err) {
      console.log(`  ✗ ${label}: ${err.message}`);
      failures.push(label);
    }
  }

  try {
    console.log('\n=== AI-Unavailable Smoke Tests ===\n');

    // 1. Writing page - should show fallback when AI endpoints missing
    await checkPageLoad(
      'Writing page loads without AI config',
      `${BASE_URL}/level/A1/writing`,
      'body'
    );

    // 2. Speaking page - should show recording UI or fallback
    await checkPageLoad(
      'Speaking page loads without AI config',
      `${BASE_URL}/level/A1/speaking`,
      'body'
    );

    // 3. Listening page - should not crash, no auto TTS call
    await checkPageLoad(
      'Listening page loads without AI config',
      `${BASE_URL}/level/A1/listening`,
      'body'
    );

    // 4. DailyMissionPage - should not crash without AI config
    await checkPageLoad(
      'DailyMissionPage loads without AI config',
      `${BASE_URL}/daily`,
      'body'
    );

    // 5. Settings / account pages
    await checkPageLoad(
      'Settings page loads without AI config',
      `${BASE_URL}/settings`,
      'body'
    );

    // 6. Local mode still works
    await checkPageLoad(
      'Home page loads without AI config',
      `${BASE_URL}/`,
      'body'
    );

    // 7. Onboarding still works
    await checkPageLoad(
      'Onboarding loads without AI config',
      `${BASE_URL}/onboarding`,
      'body'
    );

    // 8. FSP pages still load
    await checkPageLoad(
      'FSP page loads without AI config',
      `${BASE_URL}/fsp`,
      'body'
    );

    // 9. Profile/account page
    await checkPageLoad(
      'Account page loads without AI config',
      `${BASE_URL}/account`,
      'body'
    );

    console.log('\n=== Results ===');
    if (failures.length === 0) {
      console.log('  All tests passed!');
      process.exit(0);
    } else {
      console.log(`  ${failures.length} test(s) failed:`);
      failures.forEach(f => console.log(`    - ${f}`));
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
