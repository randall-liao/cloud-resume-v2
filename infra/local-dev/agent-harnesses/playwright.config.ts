import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// The harness exercises the real artifact: the static site served by the
// infra/local-dev nginx host. Inside the Docker e2e runner the web service is
// reachable as http://web; locally it is published on http://localhost:8080.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:8080';

// Human-reviewable evidence (screenshots, screen recordings, traces, HTML
// report) is written to the repo-root `temp/` scratch folder by default. The
// Docker runner overrides this via E2E_EVIDENCE_DIR -> a bind-mounted volume.
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const evidenceDir =
  process.env.E2E_EVIDENCE_DIR ?? path.join(repoRoot, 'temp', 'e2e-evidence');

export default defineConfig({
  testDir: './deterministic',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(evidenceDir, 'report') }],
    ['json', { outputFile: path.join(evidenceDir, 'results.json') }],
  ],
  // Per-test artifacts (screenshots, videos, traces) land here for review.
  outputDir: path.join(evidenceDir, 'artifacts'),
  use: {
    baseURL,
    // Always capture evidence so a human can review every run, not just failures.
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Cross-browser projects are intentionally opt-in; enable as coverage grows:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
