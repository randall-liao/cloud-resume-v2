import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// The harness exercises the real artifact: the static site served by the
// infra/local-dev nginx host. Inside the Docker e2e runner the web service is
// reachable as http://web; locally it is published on http://localhost:8080.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:8080';

// Each default invocation gets a separate review run. Export the chosen path
// before workers load this config so they cannot generate their own run paths.
// An explicit override is the exact run directory (including in Docker).
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const evidenceRoot = process.env.E2E_EVIDENCE_ROOT ?? path.join(repoRoot, 'temp', 'e2e-evidence');
const evidenceDir = path.resolve(process.env.E2E_EVIDENCE_DIR ?? path.join(
  evidenceRoot, 'deterministic',
  `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}`,
));
process.env.E2E_EVIDENCE_DIR = evidenceDir;

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
    [path.join(here, 'review-reporter.mjs'), { evidenceDir }],
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
  ],
});
