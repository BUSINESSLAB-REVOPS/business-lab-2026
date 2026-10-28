import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4325',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  reporter: 'list',
  webServer: [
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 4325',
      url: 'http://127.0.0.1:4325',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command:
        'npm run astro -- preview --root tests/fixtures/cta --host 127.0.0.1 --port 4326',
      url: 'http://127.0.0.1:4326',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
