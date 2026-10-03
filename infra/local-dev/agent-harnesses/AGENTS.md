# Agent Harnesses (e2e)

`infra/local-dev/agent-harnesses/` is the **hybrid two-tier end-to-end harness**
for `cloud-resume-v2`. It exercises the project the way a real browser does, by
running against the **`infra/local-dev` nginx host** (the real built static
artifact), not the Vite dev server.

```
docker compose up --build        # repo root: serves http://localhost:8080
```

## Two tiers

Both tiers use Playwright with Chromium only. Alternative framework and
cross-browser trial installations are not maintained; per-case review packages
and the Chromium evidence remain the supported workflow.

### Tier 1 — Deterministic (intended CI gate; currently on-demand)
Committed Playwright (`@playwright/test`) specs in
[`deterministic/`](./deterministic) run headless against the served artifact,
health-gated on `/healthz`, using semantic role/title locators. Every browser
case captures screenshots, video, and traces, including successful attempts.

Run via the Docker `e2e` runner (it `include:`s the local-dev `web` module and
waits for its healthcheck):

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml \
  --profile e2e run --rm e2e
```
If the repository-root Compose host is already running (as in the live QA
setup), reuse it instead of asking a second Compose project to create the same
named container:

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml \
  --profile e2e run --rm --no-deps e2e
```

Use `--no-deps` only after the web host is healthy.


Run locally instead with Node 20 (needs the host up on :8080). The pinned
Playwright 1.49.1 runner stalls during initialization on Node 25.9.0 in this
environment; use Node 20 or the pinned Docker runner rather than assuming the
root app's Node version is compatible:

```bash
npm ci --prefix infra/local-dev/agent-harnesses
npm --prefix infra/local-dev/agent-harnesses run install:browsers
npm --prefix infra/local-dev/agent-harnesses test
```

### Tier 2 — Live exploratory (on-demand agent)
`github-copilot/gpt-6-astra` plans and orchestrates in normal mode (not plan
mode), delegating sequential whole cases to the named `browser-operator`
agent on `github-copilot/gpt-6-luna`. Luna operates Microsoft Playwright CLI
(`@playwright/cli` pinned to `0.1.21`) using the repository skill; Astra performs
no browser actions and consumes Luna's structured evidence. Durable findings
can become Tier-1 regressions; do not open a PR without explicit instruction.

With the Docker host above running, install the harness dependencies and launch
the workflow from the repository root (requires `omp` and both model routes):

```bash
npm ci --prefix infra/local-dev/agent-harnesses
npm run browser -- --help
npm run qa:live
# Non-interactive/headless omp invocation:
npm run qa:live -- --print
```

Browser commands run at the repository root as
`npm run browser -- -s=<unique> ...`. See the [live runbook](./live/RUNBOOK.md)
for browser setup, session handling, and evidence capture, and the intent cases:
[resume-core](./live/cases/resume-core.md),
[spyfall-intro](./live/cases/spyfall-intro.md),
[navigation](./live/cases/navigation.md),
[theme-keyboard](./live/cases/theme-keyboard.md), and
[mobile-resume](./live/cases/mobile-resume.md).

## Evidence for human review
Every selected deterministic case gets a **self-contained review package**:
`index.html`, `result.json`, and copied attachments. Browser packages include
inline screenshot and video previews plus downloadable complete trace ZIPs.
The root `index.html` indexes every selected test, project, repeat, and retry;
use the browser's Find command to search source filenames or titles. Earlier
failed attempts remain separate from later passing retries.

```
temp/e2e-evidence/
  deterministic/<timestamp>-<uuid>/
    index.html               # start human review here
    manifest.json            # case index, statuses, evidence completeness
    cases/<test-project-attempt>/
      index.html             # assertions, errors, previews, reproduction
      result.json            # raw outcome and artifact inventory
      attachments/           # copies; keep the entire case folder together
    report/                  # standard Playwright HTML report
    results.json             # standard Playwright JSON report
    artifacts/               # original Playwright captures
  live/<run>/<case>/          # separate live CLI evidence and case packages
```

Default deterministic invocations generate a unique run directory and export
that same path to their workers. The reporter prints the root review page.
`E2E_EVIDENCE_ROOT` changes the parent evidence root (default:
`temp/e2e-evidence`); runs go under its `deterministic/<timestamp>-<uuid>` tree.
The Docker runner sets that root to `/evidence`, bind-mounted to repo-root
`temp/e2e-evidence`, so containerized defaults also preserve earlier runs.
`E2E_EVIDENCE_DIR` instead selects an **exact run directory**: use a fresh value
to retain past runs. Reusing an override replaces its reporter-owned `cases/`
subtree, so stale captures cannot masquerade as evidence for a new attempt.
To give a containerized run a particular name, for example:

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml \
  --profile e2e run --rm --no-deps \
  -e E2E_EVIDENCE_DIR=/evidence/deterministic/my-unique-run e2e
```

Reported test outcomes and evidence completeness are separate. Skipped,
blocked, and interrupted cases remain visible with missing captures explicitly
listed; they are never synthesized as passes. A passing browser case with
missing captures, or any package/attachment write failure, fails the run.
The HTTP-only `/healthz` case declares the Playwright annotation
`{ type: 'evidence', description: 'api-only' }`: browser media is **not
applicable**, not missing, and no substitute captures are fabricated. Missing
attachments alone never imply that a case is API-only.

Run package/reporter behavior checks with Node 20:

```bash
npm exec --yes --package=node@20 -- node --test \
  infra/local-dev/agent-harnesses/review-packages.test.mjs \
  infra/local-dev/agent-harnesses/review-reporter.test.mjs
```

With Node 20 already selected, use
`npm --prefix infra/local-dev/agent-harnesses run test:artifacts`.

Live CLI evidence is captured explicitly per case under
`temp/e2e-evidence/live/<run>/<case>`. The CLI is not governed by
`playwright.config.ts`; follow the [live runbook](./live/RUNBOOK.md) for capture
and package finalization. Both tiers use the same case-page and run-index
renderer. Evidence remains under the git-ignored `temp/` scratch directory.

## Ownership rules
- This is infrastructure/tooling: it may drive `apps/web` through the browser,
  but it **must not import** application source, and application source must not
  import from here.
- It is **not** an npm workspace (like `infra/local-dev` itself): root
  `turbo` and `npm run validate` exclude it. Deterministic tests run through
  Docker or harness-local scripts; root `browser` and `qa:live` scripts are
  explicit entrypoints for the live tier.
- The Playwright image tag in [`docker-compose.yml`](./docker-compose.yml) and
  the `@playwright/test` version in [`package.json`](./package.json) **must stay
  in lockstep**.

## Conventions
- Prefer `getByRole` / `getByTestId` / title locators over CSS/XPath.
- The deterministic tier is the intended CI gate, but currently runs only on
  demand and is not wired into CI or `npm run validate`. The live tier remains
  exploratory and human-reviewed.
- New pages/flows: add an intent case under `live/cases/`, explore with the live
  tier, then lock the result into a `deterministic/*.spec.ts`.
