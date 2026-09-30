import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import ReviewReporter from './review-reporter.mjs';

const execute = promisify(execFile);
const apiOnly = [{ type: 'evidence', description: 'api-only' }];

async function temporary(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'qa-review-reporter-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function selected(root, { title = 'visible page', project = 'chromium', annotations = [], expectedStatus = 'passed', repeatEachIndex = 0 } = {}) {
  return {
    id: `${project}:${title}:${repeatEachIndex}`,
    title,
    location: { file: path.join(root, 'page.spec.ts'), line: 12, column: 3 },
    annotations,
    expectedStatus,
    repeatEachIndex,
    parent: { project: () => ({ name: project }) },
    titlePath: () => ['', project, 'page.spec.ts', title],
  };
}

function outcome(overrides = {}) {
  return { status: 'passed', retry: 0, duration: 20, steps: [], errors: [], attachments: [], ...overrides };
}

function begin(directory, selectedTests) {
  const reporter = new ReviewReporter({ evidenceDir: directory });
  reporter.onBegin({ rootDir: path.dirname(directory) }, { allTests: () => selectedTests });
  return reporter;
}

async function manifest(directory) {
  return JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
}

// These are attachment-copy fixtures, not browser recordings or QA evidence.
function attachments(marker) {
  return [
    { name: 'screenshot', contentType: 'image/png', body: Buffer.from(`screenshot fixture ${marker}`) },
    { name: 'video', contentType: 'video/webm', body: Buffer.from(`video fixture ${marker}`) },
    { name: 'trace', contentType: 'application/zip', body: Buffer.from(`trace fixture ${marker}`) },
  ];
}

test('packages keep colliding titles, projects, repeat instances and retries independent', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const selectedTests = [
    selected(root, { title: 'page/a', project: 'desktop/a' }),
    selected(root, { title: 'page?a', project: 'desktop?a' }),
    selected(root, { title: 'page/a', project: 'desktop/a', repeatEachIndex: 1 }),
  ];
  const reporter = begin(directory, selectedTests);
  const failure = { message: 'Expected heading visible; observed hidden <heading>', stack: 'Error: Expected heading visible; observed hidden <heading>' };
  const first = outcome({ status: 'failed', errors: [failure], attachments: attachments('first'), steps: [{ category: 'expect', title: 'heading is visible', duration: 10, error: failure, steps: [] }] });
  reporter.onTestBegin(selectedTests[0], first);
  reporter.onTestEnd(selectedTests[0], first);
  reporter.onTestEnd(selectedTests[0], outcome({ retry: 1, attachments: attachments('retry') }));
  reporter.onTestEnd(selectedTests[1], outcome({ attachments: attachments('other project') }));
  reporter.onTestEnd(selectedTests[2], outcome({ attachments: attachments('repeat') }));
  assert.equal(await reporter.onEnd({ status: 'passed' }), undefined);

  const run = await manifest(directory);
  assert.equal(new Set(run.cases.map((item) => item.path)).size, 4);
  assert.deepEqual(run.cases.map((item) => [item.status, item.retry, item.repeatEachIndex]), [
    ['failed', 0, 0], ['passed', 1, 0], ['passed', 0, 0], ['passed', 0, 1],
  ]);
  for (const [index, item] of run.cases.entries()) {
    const result = JSON.parse(await readFile(path.join(directory, item.path, 'result.json'), 'utf8'));
    assert.equal(result.evidenceStatus, 'complete');
    const trace = result.artifacts.find((artifact) => artifact.kind === 'trace');
    assert.equal(await readFile(path.join(directory, item.path, trace.path), 'utf8'), `trace fixture ${['first', 'retry', 'other project', 'repeat'][index]}`);
  }
  assert.deepEqual(run.cases[0].errors, [failure]);
  const page = await readFile(path.join(directory, run.cases[0].path, 'index.html'), 'utf8');
  assert.match(page, /observed hidden &lt;heading&gt;/);
  assert.match(page, /heading is visible/);
});

test('only explicitly annotated API cases are exempt from missing browser captures', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const api = selected(root, { title: 'health endpoint', annotations: apiOnly });
  const ui = selected(root);
  const reporter = begin(directory, [api, ui]);
  reporter.onTestEnd(api, outcome());
  reporter.onTestEnd(ui, outcome());
  assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' });
  const { cases } = await manifest(directory);
  assert.equal(cases[0].status, 'passed');
  assert.equal(cases[0].evidenceStatus, 'not-applicable');
  assert.deepEqual(cases[0].artifacts, []);
  assert.deepEqual(cases[0].missingEvidence, []);
  assert.equal(cases[1].status, 'passed');
  assert.equal(cases[1].evidenceStatus, 'incomplete');
  assert.deepEqual(cases[1].missingEvidence, ['screenshot', 'video', 'trace']);
});

test('selected skipped, unstarted and interrupted attempts remain indexed without onTestEnd', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const skipped = selected(root, { title: 'explicit skip', expectedStatus: 'skipped' });
  const unstarted = selected(root, { title: 'unstarted' });
  const interrupted = selected(root, { title: 'interrupted' });
  const reporter = begin(directory, [skipped, unstarted, interrupted]);
  reporter.onTestBegin(interrupted, outcome());
  assert.equal(await reporter.onEnd({ status: 'interrupted' }), undefined);
  const { cases } = await manifest(directory);
  assert.deepEqual(cases.map((item) => item.status), ['skipped', 'interrupted', 'interrupted']);
  for (const item of cases) {
    assert.equal(item.evidenceStatus, 'incomplete');
    assert.deepEqual(item.missingEvidence, ['screenshot', 'video', 'trace']);
    const page = await readFile(path.join(directory, item.path, 'index.html'), 'utf8');
    assert.match(page, /No onTestEnd event/);
  }
});

test('an unscheduled case records its global blocker instead of disappearing', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const reporter = begin(directory, [selected(root)]);
  reporter.onError({ message: 'Worker could not start' });
  assert.deepEqual(await reporter.onEnd({ status: 'failed' }), { status: 'failed' });
  const { cases } = await manifest(directory);
  assert.equal(cases[0].status, 'blocked');
  assert.match(cases[0].blocker, /Worker could not start/);
});

test('file and body attachments with duplicate names are copied without collisions; copy failures fail the run', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const original = path.join(root, 'details.json');
  await writeFile(original, '{"from":"file"}');
  const api = selected(root, { annotations: apiOnly });
  const reporter = begin(directory, [api]);
  reporter.onTestEnd(api, outcome({ attachments: [
    { name: 'details', contentType: 'application/json', path: original },
    { name: '../../details.json', contentType: 'application/json', body: Buffer.from('{"from":"body"}') },
    { name: 'missing log', contentType: 'text/plain', path: path.join(root, 'absent.txt') },
  ] }));
  assert.deepEqual(await reporter.onEnd({ status: 'passed' }), { status: 'failed' });
  const { cases } = await manifest(directory);
  const item = cases[0];
  assert.equal(item.status, 'passed');
  assert.match(item.notes.join('\n'), /Unable to copy attachment missing log/);
  const content = await Promise.all(item.artifacts.map((artifact) => readFile(path.join(directory, item.path, artifact.path), 'utf8')));
  assert.deepEqual(content.sort(), ['{"from":"body"}', '{"from":"file"}']);
});

test('reusing an explicit run directory cannot reuse stale captures as new evidence', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const selectedTest = selected(root);
  const oldRun = begin(directory, [selectedTest]);
  oldRun.onTestEnd(selectedTest, outcome({ attachments: attachments('old run') }));
  await oldRun.onEnd({ status: 'passed' });
  const newRun = begin(directory, [selectedTest]);
  newRun.onTestEnd(selectedTest, outcome());
  assert.deepEqual(await newRun.onEnd({ status: 'passed' }), { status: 'failed' });
  const { cases } = await manifest(directory);
  assert.equal(cases[0].evidenceStatus, 'incomplete');
  assert.deepEqual(cases[0].artifacts, []);
});

test('Playwright 1.49 exits unsuccessfully when the reporter cannot write a run', async (t) => {
  const root = await temporary(t);
  const source = path.join(root, 'suite');
  await mkdir(source);
  const playwrightModule = new URL('./node_modules/@playwright/test/index.mjs', import.meta.url).href;
  const reporterFile = fileURLToPath(new URL('./review-reporter.mjs', import.meta.url));
  await writeFile(path.join(source, 'api.spec.mjs'), `import { test, expect } from ${JSON.stringify(playwrightModule)};
test('HTTP-only assertion', { annotation: { type: 'evidence', description: 'api-only' } }, () => expect(200).toBe(200));
`);
  const config = path.join(source, 'playwright.config.mjs');
  await writeFile(config, `export default { testDir: '.', workers: 1, outputDir: ${JSON.stringify(path.join(root, 'raw'))}, reporter: [[${JSON.stringify(reporterFile)}, { evidenceDir: process.env.REVIEW_TEST_DIR }]] };`);
  const cli = fileURLToPath(new URL('./node_modules/@playwright/test/cli.js', import.meta.url));
  const goodDirectory = path.join(root, 'good');
  await execute(process.execPath, [cli, 'test', '--config', config], { cwd: source, env: { ...process.env, REVIEW_TEST_DIR: goodDirectory }, timeout: 30_000 });
  const good = await manifest(goodDirectory);
  assert.deepEqual(good.cases.map((item) => [item.status, item.evidenceStatus]), [['passed', 'not-applicable']]);

  const badDirectory = path.join(root, 'not-a-directory');
  await writeFile(badDirectory, 'Cannot create a report directory here');
  await assert.rejects(
    execute(process.execPath, [cli, 'test', '--config', config], { cwd: source, env: { ...process.env, REVIEW_TEST_DIR: badDirectory }, timeout: 30_000 }),
    (error) => error.code === 1 && /Review package reporter failed/.test(error.stderr),
  );
});

test('completed passing cases do not conceal a global teardown failure', async (t) => {
  const root = await temporary(t);
  const directory = path.join(root, 'run');
  const api = selected(root, { annotations: apiOnly });
  const reporter = begin(directory, [api]);
  reporter.onTestEnd(api, outcome());
  reporter.onError({ message: 'Global teardown failed' });
  assert.deepEqual(await reporter.onEnd({ status: 'failed' }), { status: 'failed' });
  const run = await manifest(directory);
  assert.equal(run.status, 'failed');
  assert.equal(run.cases[0].status, 'passed');
  assert.deepEqual(run.errors, ['Global teardown failed']);
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert.match(html, /Global teardown failed/);
});
