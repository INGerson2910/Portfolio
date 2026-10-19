import { defineConfig, devices } from '@playwright/test';
import { env } from 'node:process';

const appBaseURL = env.E2E_BASE_URL ?? 'http://localhost:5173';
const apiBaseURL = env.API_BASE_URL ?? 'http://localhost:4000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: appBaseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: apiBaseURL },
    },
  ],
});
