import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    headless: true,
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
