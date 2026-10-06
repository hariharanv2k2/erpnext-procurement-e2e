import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const AUTH_FILE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:8006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './src/fixtures',
    },
    {
      name: 'chromium',
      testDir: './tests',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
        launchOptions: {
          slowMo: 500,
        },
      },
      dependencies: ['auth-setup'],
    },
  ],
});
