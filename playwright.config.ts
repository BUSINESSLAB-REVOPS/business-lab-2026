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
});
