// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'off',
    screenshot: 'off',
    launchOptions: { args: ['--no-sandbox'] }
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 15_000,
    cwd: '.'
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['iPhone 12'],
        browserName: 'chromium', // WebKit indisponível neste ambiente — ver docs/LIMITACOES
        launchOptions: { args: ['--no-sandbox'] }
      }
    }
  ]
});
