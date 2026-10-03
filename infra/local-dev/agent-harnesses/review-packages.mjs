import { mkdir, readFile, readdir, stat, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const liveCases = fileURLToPath(new URL('./live/cases/', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const statuses = new Set(['passed', 'failed', 'blocked', 'skipped', 'timedOut', 'interrupted']);
const kinds = new Set(['screenshot', 'video', 'trace']);
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const href = (value) => value.split('/').map(encodeURIComponent).join('/');

function page(title, body) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'">
<title>${escape(title)}</title><style>
body{font:16px/1.6 system-ui,sans-serif;margin:2rem auto;padding:0 1rem;max-width:1100px;color:#172033;background:#f8fafc}
a{color:#174db2;overflow-wrap:anywhere}h1,h2,h3{line-height:1.3}table{border-collapse:collapse;width:100%;margin:1rem 0}
th,td{padding:.6rem;text-align:left;vertical-align:top;border:1px solid #b8c4d4;overflow-wrap:anywhere}
pre{white-space:pre-wrap;overflow-wrap:anywhere}img,video{display:block;max-width:100%;max-height:80vh;margin:.5rem 0}
.notice{border-left:5px solid #965500;padding:.8rem;background:#fff4d6}.status{font-weight:700}figure{margin:1.5rem 0}
</style></head><body>${body}</body></html>\n`;
}

function kindOf(file) {
  if (file.split('/').some((part) => part === 'resources' || part === 'screencast')) return 'file';
  if (/\.(png|jpe?g)$/i.test(file)) return 'screenshot';
  if (/\.(webm|mp4)$/i.test(file)) return 'video';
  if (/\.trace$/i.test(file) || /(^|\/)[^/]*trace[^/]*\.zip$/i.test(file)) return 'trace';
  return 'file';
}

async function inventory(directory, prefix = '') {
  const files = [];
  for (const entry of (await readdir(path.join(directory, prefix), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Artifact packages cannot contain symlinks: ${relative}`);
    if (!prefix && ['index.html', 'result.json', 'case.md'].includes(entry.name)) continue;
    if (entry.isDirectory()) files.push(...await inventory(directory, relative));
    else if (entry.isFile()) {
      const { size } = await stat(path.join(directory, relative));
      files.push({ path: relative, kind: kindOf(relative), bytes: size });
    }
  }
  return files;
}

async function rawTraceIssues(directory, artifacts) {
  const issues = new Set();
  const paths = new Set(artifacts.map((file) => file.path));
  for (const trace of artifacts.filter((file) => file.kind === 'trace' && file.path.endsWith('.trace'))) {
    const network = trace.path.replace(/\.trace$/, '.network');
    if (!paths.has(network)) issues.add(`Missing trace companion: ${network}`);
    const traceDirectory = path.posix.dirname(trace.path);
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        let reference;
        if ((key === 'sha1' || key === '_sha1') && typeof child === 'string' && child) reference = `resources/${child}`;
        if (value.type === 'screencast-frame' && key === 'file' && typeof child === 'string') reference = child;
        if (reference) {
          const relative = path.posix.join(traceDirectory, reference);
          if (!paths.has(relative)) issues.add(`Missing trace resource: ${relative}`);
        } else visit(child);
      }
    }
    for (const file of [trace.path, network]) {
      if (!paths.has(file)) continue;
      try {
        for (const line of (await readFile(path.join(directory, file), 'utf8')).split('\n')) {
          if (line.trim()) visit(JSON.parse(line));
        }
      } catch (error) {
        issues.add(`Unreadable trace data: ${file}: ${error.message}`);
      }
    }
  }
  return [...issues];
}

function validateResult(result) {
  if (!result.caseId || !result.title || !statuses.has(result.status)) throw new Error('Case requires caseId, title and a supported status');
  if (!Array.isArray(result.assertions) || !Array.isArray(result.reproduction)) throw new Error(`${result.caseId}: assertions and reproduction must be arrays`);
  if (!Array.isArray(result.requiredEvidence) || result.requiredEvidence.some((kind) => !kinds.has(kind))) throw new Error(`${result.caseId}: invalid requiredEvidence`);
}

export async function writeCasePackage(directory, result) {
  validateResult(result);
  await mkdir(directory, { recursive: true });
  const artifacts = await inventory(directory);
  const missingEvidence = result.requiredEvidence.filter((kind) => !artifacts.some((file) => file.kind === kind && file.bytes > 0));
  const evidenceIssues = await rawTraceIssues(directory, artifacts);
  if (evidenceIssues.length && result.requiredEvidence.includes('trace') && !missingEvidence.includes('trace')) missingEvidence.push('trace');
  const evidenceStatus = missingEvidence.length ? 'incomplete' : result.requiredEvidence.length ? 'complete' : 'not-applicable';
  const manifest = { ...result, artifacts, missingEvidence, evidenceStatus, evidenceIssues };
  let intent = '';
  try {
    intent = await readFile(path.join(directory, 'case.md'), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const assertions = result.assertions.map((item) => `<tr><td>${escape(item.criterion)}</td><td>${escape(item.expected)}</td><td>${escape(item.observed)}</td><td>${escape(item.status)}</td></tr>`).join('');
  const previews = artifacts.filter((item) => ['screenshot', 'video'].includes(item.kind)).map((item) => {
    const url = escape(href(item.path));
    const media = item.kind === 'screenshot'
      ? `<img loading="lazy" src="${url}" alt="${escape(item.path)}">`
      : `<video controls preload="metadata" src="${url}">Open the recording link to play this video.</video>`;
    return `<figure><figcaption><a href="${url}">${escape(item.path)}</a></figcaption>${media}</figure>`;
  }).join('');
  const files = artifacts.map((item) => `<li><a href="${escape(href(item.path))}">${escape(item.path)}</a> — ${escape(item.kind)}, ${item.bytes} bytes</li>`).join('');
  const notice = missingEvidence.length
    ? `<p class="notice">Evidence incomplete: missing or incomplete ${escape(missingEvidence.join(', '))}. This is not a fully evidenced pass, regardless of the reported assertion status.</p>`
    : evidenceStatus === 'not-applicable' ? '<p>Browser captures are not required for this case. See its notes for the reason.</p>' : '';
  const body = `<h1>${escape(result.title)}</h1><p>Case: <strong>${escape(result.caseId)}</strong><br>Source: ${escape(result.source)}</p>
<p class="status">Reported test status: ${escape(result.status)} · Evidence: ${escape(evidenceStatus)}</p>${notice}
${evidenceIssues.length ? `<ul class="notice">${evidenceIssues.map((issue) => `<li>${escape(issue)}</li>`).join('')}</ul>` : ''}
${result.blocker ? `<p class="notice">Blocker: ${escape(result.blocker)}</p>` : ''}
${(result.notes ?? []).map((note) => `<p>${escape(note)}</p>`).join('')}
<p><a href="result.json">Machine-readable result and artifact inventory</a></p>
<h2>Expected versus observed</h2><table><thead><tr><th>Criterion</th><th>Expected</th><th>Observed</th><th>Status</th></tr></thead><tbody>${assertions}</tbody></table>
<h2>Reproduction</h2><ol>${result.reproduction.map((step) => `<li>${escape(step)}</li>`).join('')}</ol>
${intent ? `<h2>Executed intent</h2><p><a href="case.md">Original case</a></p><pre>${escape(intent)}</pre>` : ''}
<h2>Screenshots and recordings</h2>${previews || '<p>No screenshots or recordings were captured.</p>'}
<h2>All artifacts</h2><p>Keep this entire folder together when sharing it. Open traces in Playwright Trace Viewer; raw CLI traces need their adjacent network and resource files.</p><ul>${files}</ul>`;
  await writeFile(path.join(directory, 'result.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(path.join(directory, 'index.html'), page(result.title, body));
  return manifest;
}

export async function writeRunIndex(directory, run) {
  await mkdir(directory, { recursive: true });
  const cases = [];
  for (const item of run.cases) {
    let reviewPageAvailable = false;
    try {
      reviewPageAvailable = (await stat(path.join(directory, item.path, 'index.html'))).isFile();
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    }
    cases.push({ ...item, reviewPageAvailable });
  }
  const rows = cases.map((item) => {
    const label = item.reviewPageAvailable ? `<a href="${escape(href(`${item.path}/index.html`))}">${escape(item.caseId)}</a>` : `${escape(item.caseId)} — review page unavailable`;
    return `<tr><td>${label}<br>${escape(item.title)}<br>${escape(item.source)}</td><td>${escape(item.status)}</td><td>${escape(item.evidenceStatus)}${item.missingEvidence.length ? `<br>Missing: ${escape(item.missingEvidence.join(', '))}` : ''}${item.blocker ? `<p class="notice">${escape(item.blocker)}</p>` : ''}</td></tr>`;
  }).join('');
  const errors = (run.errors ?? []).map((error) => `<li>${escape(error)}</li>`).join('');
  await writeFile(path.join(directory, 'manifest.json'), `${JSON.stringify({ ...run, cases }, null, 2)}\n`);
  await writeFile(path.join(directory, 'index.html'), page(`QA review: ${run.runId}`, `<h1>QA review: ${escape(run.runId)}</h1><p class="status">Run status: ${escape(run.status ?? 'not recorded')}</p>${errors ? `<h2>Run errors</h2><ul class="notice">${errors}</ul>` : ''}<p>Find a case by filename or title with your browser's Find command. Available case pages link to results, screenshots, recordings and trace files.</p><p>Reported test status and evidence completeness are separate: missing evidence never establishes a pass.</p><p><a href="manifest.json">Run artifact inventory</a></p><table><thead><tr><th>Case / source</th><th>Reported status</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table>`));
}

export async function packageLiveRun(directory) {
  const summary = JSON.parse(await readFile(path.join(directory, 'summary.json'), 'utf8'));
  if (!summary.runId || !Array.isArray(summary.requestedCases) || !summary.requestedCases.length || !Array.isArray(summary.cases)) {
    throw new Error('summary.json requires runId, requestedCases [{caseId, caseFile}] and cases [operator results]');
  }
  const requested = new Set();
  for (const item of summary.requestedCases) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.caseId) || requested.has(item.caseId)) throw new Error(`Invalid or duplicate case ID: ${item.caseId}`);
    if (path.resolve(repoRoot, item.caseFile) !== path.join(liveCases, `${item.caseId}.md`)) throw new Error(`Case source must match live/cases/${item.caseId}.md`);
    requested.add(item.caseId);
  }
  const returned = new Map();
  for (const item of summary.cases) {
    if (!requested.has(item.caseId) || returned.has(item.caseId)) throw new Error(`Unexpected or duplicate case result: ${item.caseId}`);
    returned.set(item.caseId, item);
  }
  const cases = [];
  for (const item of summary.requestedCases) {
    const result = returned.get(item.caseId) ?? {
      status: 'blocked', assertions: [{ criterion: 'Case execution', expected: 'Complete case with evidence', observed: 'No operator result was returned', status: 'blocked' }],
      reproduction: [], blocker: 'Operator did not return a result',
    };
    if (!['passed', 'failed', 'blocked'].includes(result.status) || !Array.isArray(result.assertions) || !result.assertions.length || !result.assertions.every((assertion) => ['passed', 'failed', 'blocked'].includes(assertion.status))) throw new Error(`${item.caseId}: invalid live result`);
    const status = result.assertions.some((assertion) => assertion.status === 'failed') ? 'failed'
      : result.status === 'passed' && result.assertions.some((assertion) => assertion.status === 'blocked') ? 'blocked' : result.status;
    const caseDirectory = path.join(directory, item.caseId);
    await mkdir(caseDirectory, { recursive: true });
    await copyFile(path.join(liveCases, `${item.caseId}.md`), path.join(caseDirectory, 'case.md'));
    const manifest = await writeCasePackage(caseDirectory, {
      ...result, caseId: item.caseId, title: `${item.caseId}.md`, source: item.caseFile, status,
      requiredEvidence: ['screenshot', 'video', 'trace'],
    });
    cases.push({ ...manifest, path: item.caseId });
  }
  const status = cases.some((item) => item.status === 'failed') ? 'failed'
    : cases.some((item) => item.status === 'blocked' || item.evidenceStatus === 'incomplete') ? 'blocked' : 'passed';
  await writeRunIndex(directory, { runId: summary.runId, status, cases });
  return cases;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: npm run qa:package -- <run-directory>');
    const directory = path.resolve(process.argv[2]);
    const cases = await packageLiveRun(directory);
    console.log(`Review: ${path.join(directory, 'index.html')}`);
    for (const item of cases) console.log(`${item.caseId}: ${item.status}; evidence ${item.evidenceStatus}`);
    if (cases.some((item) => item.evidenceStatus === 'incomplete')) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
