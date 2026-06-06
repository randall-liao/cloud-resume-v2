# Agent Harnesses (e2e)

`infra/local-dev/agent-harnesses/` is the **hybrid two-tier end-to-end harness**
for `cloud-resume-v2`. It exercises the project the way a real browser does, by
running against the **`infra/local-dev` nginx host** (the real built static
artifact), not the Vite dev server.

```
docker compose up --build        # repo root: serves http://localhost:8080
```

## Two tiers

### Tier 1 — Deterministic (the CI gate)
Committed Playwright (`@playwright/test`) specs in
[`deterministic/`](./deterministic) run headless against the served artifact,
health-gated on `/healthz`, using semantic role/title locators with traces and
screenshots on failure.

Run via the Docker `e2e` runner (it `include:`s the local-dev `web` module and
waits for its healthcheck):

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml \
  --profile e2e run --rm e2e
```

Run locally instead (needs the host up on :8080):

```bash
cd infra/local-dev/agent-harnesses
npm install && npm run install:browsers
npm test            # or: E2E_BASE_URL=http://localhost:8080 npm test
```

### Tier 2 — Live exploratory (on-demand agent)
An LLM coding agent drives a real browser through `@playwright/mcp` (registered
in [`../../../.agent/mcp.json`](../../../.agent/mcp.json)) to execute
natural-language intent cases, then feeds durable findings back as PRs that
add/tighten Tier-1 specs. See the [live runbook](./live/RUNBOOK.md) and intents:
[resume-core](./live/cases/resume-core.md),
[spyfall-intro](./live/cases/spyfall-intro.md),
[navigation](./live/cases/navigation.md). The standalone MCP reference config is
[`live/mcp.playwright.json`](./live/mcp.playwright.json).

## Evidence for human review
Every run captures **screenshots, screen recordings (video), Playwright traces,
an HTML report, and `results.json`** into the repo-root `temp/e2e-evidence/`
scratch folder (git-ignored), so a human can review what the tests actually did:

```
temp/e2e-evidence/
  report/            # open with: npx playwright show-report temp/e2e-evidence/report
  results.json       # machine-readable run summary
  artifacts/<test>/  # test-finished-*.png, video.webm, trace.zip per test
```

Override the location with `E2E_EVIDENCE_DIR`. The Docker runner sets it to
`/evidence` and bind-mounts repo-root `temp/e2e-evidence` there, so the same
artifacts appear on the host after a containerized run.

## Ownership rules
- This is infrastructure/tooling: it may drive `apps/web` through the browser,
  but it **must not import** application source, and application source must not
  import from here.
- It is **not** an npm workspace (like `infra/local-dev` itself): root
  `npm`/`turbo`/`npm run validate` ignore it. It runs through Docker or its own
  local `npm` scripts.
- The Playwright image tag in [`docker-compose.yml`](./docker-compose.yml) and
  the `@playwright/test` version in [`package.json`](./package.json) **must stay
  in lockstep**.

## Conventions
- Prefer `getByRole` / `getByTestId` / title locators over CSS/XPath.
- The deterministic tier is the only CI-blocking tier; the live tier is
  exploratory and human-reviewed.
- New pages/flows: add an intent case under `live/cases/`, explore with the live
  tier, then lock the result into a `deterministic/*.spec.ts`.
