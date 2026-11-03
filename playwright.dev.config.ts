import { defineConfig } from '@playwright/test';

// Exercise the same consultation in Astro dev, including React Fast Refresh.
export default defineConfig({
  testDir: './tests',
  testMatch: 'diagnostic.spec.ts',
  workers: 1,
  // Vite compiles the lazy React module graph on the first development click.
  timeout: 60000,
  expect: { timeout: 20000 },
  use: {
    baseURL: 'http://localhost:4321',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  reporter: 'list',
});
