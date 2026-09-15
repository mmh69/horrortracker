import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// DATABASE_URL здесь читается из backend/.env, чтобы не дублировать её
// отдельно для e2e — так локальный запуск использует ту же БД, что и backend.
// В CI DATABASE_URL приходит как переменная окружения job'а, файла нет — dotenv молча не найдёт файл.
dotenv.config({ path: '../backend/.env' });

export default defineConfig({
  testDir: './tests',
  // Тесты сидируют/чистят данные в общей Postgres-таблице напрямую (нет своей БД на воркер),
  // поэтому гоняем последовательно — так isolation не зависит от порядка воркеров.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: [
    {
      command: 'npm start',
      cwd: '../backend',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
