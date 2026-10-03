import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const cli = fileURLToPath(new URL('../node_modules/@playwright/cli/playwright-cli.js', import.meta.url));
const config = fileURLToPath(new URL('./cli.config.json', import.meta.url));

const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    NO_UPDATE_NOTIFIER: '1',
    PLAYWRIGHT_MCP_CONFIG: config,
    PLAYWRIGHT_MCP_OUTPUT_DIR:
      process.env.PLAYWRIGHT_MCP_OUTPUT_DIR ?? `${repoRoot}temp/e2e-evidence/live`,
  },
});

if (result.error) {
  console.error(result.error.message);
}
process.exitCode = result.status ?? 1;
