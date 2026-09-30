import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, rename } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packageLiveRun, writeCasePackage, writeRunIndex } from './review-packages.mjs';

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'qa-review-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function result(overrides = {}) {
  return {
    caseId: 'mobile-resume', title: 'Mobile resume', source: 'mobile-resume.md', status: 'passed',
    assertions: [{ criterion: 'Theme activation', expected: 'Dark', observed: 'Dark', status: 'passed' }],
    reproduction: ['Open resume', 'Activate theme'], blocker: '', requiredEvidence: ['screenshot', 'video', 'trace'],
    ...overrides,
  };
}

async function captures(directory) {
  await mkdir(path.join(directory, 'trace/resources'), { recursive: true });
  await writeFile(path.join(directory, 'top light.png'), 'screenshot fixture');
  await writeFile(path.join(directory, 'recording.webm'), 'video fixture');
  await writeFile(path.join(directory, 'trace/session.trace'), '{"type":"context-options"}\n');
  await writeFile(path.join(directory, 'trace/session.network'), '{"type":"resource-snapshot","snapshot":{"response":{"content":{"_sha1":"frame.png"}}}}\n');
  await writeFile(path.join(directory, 'trace/resources/frame.png'), 'trace image fixture');
}

async function summary(directory, cases, requestedCases = [{ caseId: 'mobile-resume', caseFile: 'infra/local-dev/agent-harnesses/live/cases/mobile-resume.md' }]) {
  await writeFile(path.join(directory, 'summary.json'), JSON.stringify({ runId: 'test-run', requestedCases, cases }));
}

test('case package remains browsable when moved and retains trace dependencies', async (t) => {
  const root = await fixture(t);
  const original = path.join(root, 'original');
  await captures(original);
  const manifest = await writeCasePackage(original, result());
  assert.equal(manifest.evidenceStatus, 'complete');
  assert.deepEqual(manifest.missingEvidence, []);
  assert.equal(manifest.artifacts.find((item) => item.path === 'trace/resources/frame.png').kind, 'file');
  const moved = path.join(root, 'shared');
  await rename(original, moved);
  const html = await readFile(path.join(moved, 'index.html'), 'utf8');
  for (const [, encoded] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    await readFile(path.join(moved, decodeURIComponent(encoded)));
  }
  assert.match(html, /<video controls/);
  assert.match(html, /src="top%20light.png"/);
  assert.ok(!html.includes(original));
});

test('trace frame images and empty recordings do not satisfy missing captures', async (t) => {
  const directory = await fixture(t);
  await mkdir(path.join(directory, 'resources'));
  await writeFile(path.join(directory, 'resources/frame.png'), 'frame');
  await mkdir(path.join(directory, 'traces/screencast'), { recursive: true });
  await writeFile(path.join(directory, 'traces/screencast/frame.jpeg'), 'screencast frame');
  await writeFile(path.join(directory, 'video.webm'), '');
  await writeFile(path.join(directory, '0003-trace.zip'), 'trace fixture');
  const manifest = await writeCasePackage(directory, result());
  assert.equal(manifest.status, 'passed');
  assert.equal(manifest.evidenceStatus, 'incomplete');
  assert.deepEqual(manifest.missingEvidence, ['screenshot', 'video']);
  assert.ok(manifest.artifacts.every((artifact) => artifact.kind !== 'screenshot'));
  assert.ok(!(await readFile(path.join(directory, 'index.html'), 'utf8')).includes('<img '));
});

test('API-only cases explicitly exempt browser evidence without faking captures', async (t) => {
  const directory = await fixture(t);
  const manifest = await writeCasePackage(directory, result({ requiredEvidence: [], notes: ['HTTP-only request'] }));
  assert.equal(manifest.evidenceStatus, 'not-applicable');
  assert.deepEqual(manifest.artifacts, []);
});

test('untrusted observations and artifact names cannot inject HTML', async (t) => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'screenshot" onerror="alert(1).png'), 'fixture');
  const manifest = await writeCasePackage(directory, result({ title: '<script>alert(1)</script>', blocker: '<img src=x onerror=alert(1)>' }));
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes(' onerror="'));
  await writeRunIndex(directory, { runId: '<script>run</script>', cases: [{ ...manifest, path: 'mobile-resume' }] });
  assert.ok(!(await readFile(path.join(directory, 'index.html'), 'utf8')).includes('<script>'));
});

test('symlink artifacts are rejected instead of exposing files outside package', async (t) => {
  const directory = await fixture(t);
  await symlink('/etc/passwd', path.join(directory, 'capture.png'));
  await assert.rejects(writeCasePackage(directory, result()), /symlink/);
});

test('live finalization includes every requested case even when worker returns nothing', async (t) => {
  const directory = await fixture(t);
  await summary(directory, []);
  const cases = await packageLiveRun(directory);
  assert.equal(cases[0].status, 'blocked');
  assert.deepEqual(cases[0].missingEvidence, ['screenshot', 'video', 'trace']);
  const run = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
  assert.equal(run.cases[0].path, 'mobile-resume');
  await readFile(path.join(directory, run.cases[0].path, 'case.md'));
  await readFile(path.join(directory, run.cases[0].path, 'index.html'));
});

test('live finalization preserves failed assertions despite a contradictory reported pass', async (t) => {
  const directory = await fixture(t);
  await captures(path.join(directory, 'mobile-resume'));
  await summary(directory, [result({ assertions: [{ criterion: 'Layout', expected: 'No clipping', observed: 'Badge clipped', status: 'failed' }] })]);
  const cases = await packageLiveRun(directory);
  assert.equal(cases[0].status, 'failed');
  assert.equal(cases[0].evidenceStatus, 'complete');
});

test('live finalization rejects escaping and duplicate identities before writing cases', async (t) => {
  const directory = await fixture(t);
  await summary(directory, [], [{ caseId: '../outside', caseFile: '../outside.md' }]);
  await assert.rejects(packageLiveRun(directory), /Invalid or duplicate case ID/);
  await summary(directory, [result(), result()]);
  await assert.rejects(packageLiveRun(directory), /Unexpected or duplicate case result/);
});

test('partial raw traces cannot establish complete evidence', async (t) => {
  const directory = await fixture(t);
  await captures(directory);
  await rm(path.join(directory, 'trace/session.network'));
  const missingNetwork = await writeCasePackage(directory, result());
  assert.equal(missingNetwork.evidenceStatus, 'incomplete');
  assert.deepEqual(missingNetwork.missingEvidence, ['trace']);
  assert.match(missingNetwork.evidenceIssues.join('\n'), /session.network/);
  await writeFile(path.join(directory, 'trace/session.network'), '{"_sha1":"missing-resource.png"}\n');
  const missingResource = await writeCasePackage(directory, result());
  assert.equal(missingResource.evidenceStatus, 'incomplete');
  assert.match(missingResource.evidenceIssues.join('\n'), /missing-resource.png/);
  await writeFile(path.join(directory, 'trace/session.network'), '');
  await writeFile(path.join(directory, 'trace/session.trace'), '{"type":"screencast-frame","file":"screencast/missing.jpeg"}\n');
  const missingFrame = await writeCasePackage(directory, result());
  assert.equal(missingFrame.evidenceStatus, 'incomplete');
  assert.match(missingFrame.evidenceIssues.join('\n'), /missing.jpeg/);
});

test('a run-level failure remains visible after every test passed', async (t) => {
  const directory = await fixture(t);
  const item = await writeCasePackage(path.join(directory, 'mobile-resume'), result());
  await writeRunIndex(directory, { runId: 'late-failure', status: 'failed', errors: ['Teardown <failed>'], cases: [{ ...item, path: 'mobile-resume' }] });
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert.match(html, /Run status: failed/);
  assert.match(html, /Teardown &lt;failed&gt;/);
});

test('unwritten case pages show their packaging error instead of broken links', async (t) => {
  const directory = await fixture(t);
  await writeRunIndex(directory, { runId: 'write-failure', status: 'failed', cases: [{ ...result(), path: 'absent-case', evidenceStatus: 'incomplete', missingEvidence: ['video'], blocker: 'Package write denied' }] });
  const html = await readFile(path.join(directory, 'index.html'), 'utf8');
  assert.match(html, /Package write denied/);
  assert.ok(!html.includes('href="absent-case/index.html"'));
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
  assert.equal(manifest.cases[0].reviewPageAvailable, false);
});
