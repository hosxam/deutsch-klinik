// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  webServer: {
    command: 'npx vite preview --port 4175 --host 127.0.0.1',
    url: 'http://localhost:4175/deutsch-klinik/',
    reuseExistingServer: true,
    timeout: 30000,
  },
  use: {
    baseURL: 'https://hosxam.github.io/deutsch-klinik',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
