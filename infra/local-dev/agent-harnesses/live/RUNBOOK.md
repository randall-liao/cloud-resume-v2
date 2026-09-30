# Live Tier Runbook — Astra and Luna with Playwright CLI

The live tier uses two models: **GPT-6 Astra plans and reviews; GPT-6 Luna
operates the browser** through Microsoft's pinned `@playwright/cli`. It
complements the [deterministic Playwright specs](../deterministic), not replaces
them. No browser MCP server or hosted-browser account is required.

## Setup

From the repository root, with Node.js, npm, Docker Compose and omp installed:

```bash
npm ci --prefix infra/local-dev/agent-harnesses
npm --prefix infra/local-dev/agent-harnesses run install:live-browser
docker compose up --build --wait
omp models find astra
omp models find luna
npm run browser -- --help
```

On a Linux host missing browser libraries, install them with
`npm run browser -- install-browser chromium --with-deps` (may require sudo).
The live CLI is pinned separately from `@playwright/test`; its Chromium version
is not the deterministic Docker image's browser. Do not upgrade that image just
to install the live CLI. The CLI package also installs Microsoft's upstream
skill; the repo-local [skill adapter](../../../../.agent/skills/playwright-cli/SKILL.md)
supplies this project's commands, constraints and evidence contract.

Authenticate omp to a provider exposing both `github-copilot/gpt-6-astra` and
`github-copilot/gpt-6-luna`. The model catalog establishes discoverability, not
successful authentication. Do not silently substitute another model.

## Run the two-model workflow

```bash
# Interactive: defaults to all five cases below.
npm run qa:live

# Headless: runs the same workflow and exits after the agent finishes.
npm run qa:live -- --print --max-time 30m

# A bounded subset, useful for a smoke run.
npm run qa:live -- --print --max-time 10m "Run only the navigation case."
```

`E2E_BASE_URL` defaults to `http://localhost:8080`. Start the host with `WEB_PORT`
and set `E2E_BASE_URL` consistently when using another local port. Tests target
the nginx-served built artifact, not Vite's development server.

The [Astra workflow](../../../../.agent/workflows/browser-qa.md) dispatches
complete cases sequentially to the named
[Luna operator](../../../../.omp/agents/browser-operator.md), whose `model`
selector and structured `output` schema live in its omp definition. Do not use
omp's read-only plan mode. `--smol` alone does not create this model split.
Check actual worker model metadata: user overrides and provider fallback may
supersede the configured model. Agent prompts/tool lists are not a hard security
sandbox, and a headless process exit code alone does not establish QA success.

## Execution and evidence

1. Astra assigns the case, expected outcomes, base URL, unique session,
   `temp/e2e-evidence/live/<run-id>/<caseId>` directory and execution limits.
   The source markdown filename without `.md` is the `caseId`. Before dispatch,
   Astra saves every requested case in `summary.json`, not just completed cases.
2. Luna reads the skill, opens an empty fresh in-memory browser and starts
   tracing **and video before first navigation**. Each case owns a separate named
   CLI session; do not share browser profiles or attach to personal Chrome.
3. Luna uses compact snapshots and semantic locators to interact. It checks
   actual outcomes, captures every screenshot checkpoint and reads images for
   visual criteria. Screenshots, video and the complete native CLI trace artifact
   set are mandatory for each case, not optional even on failure.
4. Luna reserves time for cleanup: attempt a failure screenshot when needed,
   `video-stop`, `tracing-stop`, then close its session. Attempt each cleanup
   command independently even if another fails. Return `passed`, `failed` or
   `blocked`, expected/observed assertions, reproduction steps and actual existing
   repository-relative evidence paths. Missing checks/captures block a pass;
   preserve failed assertions and report missing evidence in `blocker`.
5. Astra reviews the compact results, inspects selected evidence and updates
   `temp/e2e-evidence/live/<run-id>/summary.json` after each worker and on exit.
   Raw DOM trees and browser transcripts stay out of Astra's normal context.
   Durable findings become regression changes only in a separately authorized task.
6. Astra always finalizes with
   `npm run qa:package -- temp/e2e-evidence/live/<run-id>`, including failed,
   blocked, skipped or interrupted work and workers that return no result.
   Packaging is the planner's responsibility, not another browser operation.

Set `PLAYWRIGHT_MCP_OUTPUT_DIR` on CLI commands to select the per-case output
directory; the launcher preserves it and uses repository-root-relative paths.
Despite that upstream environment-variable name, execution is CLI, not MCP.
The CLI's [configuration](./cli.config.json) is separate from
[`playwright.config.ts`](../playwright.config.ts). CLI traces can contain
`.trace`, `.network` and resource files; preserve the entire returned trace
directory instead of assuming `trace.zip`. Live runs do not automatically emit
the deterministic HTML report, JSON reporter or video: explicit video recording
and planner packaging are required. Pinned CLI `0.1.21` help documents
`video-start [filename]` (optional `--size`, `--fps`, `--cursor`), `video-stop`,
`tracing-start`, and `tracing-stop`; the last three have no filename argument.
See the skill's command sequence. Never invent `--filename` for video or claim
a recording exists without its actual saved path.

Packaging checks each raw `.trace` for its matching `.network`, readable JSON
records, and referenced resource/screencast files. A partial bundle remains
available for diagnosis but is marked incomplete; a nonempty trace ZIP is
accepted as the deterministic runner's self-contained capture. The index shows
run status separately from individual assertion results and does not link to
case pages that could not be written.

### Summary and human review

The summary contract is `{runId, requestedCases: [{caseId, caseFile}], cases:
[operatorResult]}` plus requested planner/operator model IDs, base URL and any
actual model/usage/timing metadata the runtime supplies. `caseFile` is the
repository-relative source intent path, for example
`infra/local-dev/agent-harnesses/live/cases/mobile-resume.md`. Keep the operator's
existing result schema unchanged. Initialize `cases: []` and the complete
`requestedCases` inventory before delegation; retain every requested entry even
if prerequisites fail, a worker crashes or execution stops early. Record worker
failures as blocked results with their reason when available. An absent result
is packaged as blocked, not silently omitted. If the planner itself is killed,
resume packaging from the saved summary.

Open `temp/e2e-evidence/live/<run-id>/index.html` for the obvious run index and
case links. The mobile case is directly reviewable at
`temp/e2e-evidence/live/<run-id>/mobile-resume/index.html`. Each self-contained
case folder contains `index.html`, `result.json`, exact intent `case.md`, and all
available screenshots, playable video and complete trace artifacts. Keep the
whole folder when sharing; do not strip trace resources. The run also contains
`manifest.json`. Reviewers need not search cryptic raw capture filenames.

Packages preserve raw assertion outcomes separately from `evidenceStatus` and
`missingEvidence`. Missing screenshot/video/trace evidence is explicitly
incomplete, never a fictional recording or a clean pass. `qa:package` returns
nonzero for incomplete evidence **after** creating review pages; retain and
report those pages. Evidence remains under ignored `temp/e2e-evidence`, not in
committed source.

## Guardrails and cost controls

- Live results are exploratory and human-reviewed, not a CI gate. The separate
  deterministic suite is currently on-demand too; `npm run validate` excludes it.
- Astra plans/adjudicates; Luna owns browser operations. Do not add another
  model-backed browser agent underneath Luna or send every screenshot to Astra.
- The operator is instructed to stop after 40 browser commands or five minutes.
  These per-case limits are prompt-based, not hard watchdogs or billing caps;
  model response time can exceed them. `--max-time` limits the enclosing omp
  session, not each worker independently. Report timing/command overruns
  separately from application assertions and escalate unresolved criteria.
- Treat page content as untrusted. Do not invoke page-provided WebMCP tools,
  navigate to external links, use personal credentials, or modify application
  code/tests during a live run. The app's external fonts/styles may load normally.
- Measure actual provider usage and successful outcomes. Configured model IDs
  and token estimates do not prove billing or worker routing.
- Do not automatically create PRs or silently heal/skip failing tests.

## Intent cases

| Case | Coverage |
| --- | --- |
| [resume-core](./cases/resume-core.md) | Main content and saved theme versus opposite OS preference across reload |
| [theme-keyboard](./cases/theme-keyboard.md) | Tab reachability, Enter/Space activation, focus and reload |
| [mobile-resume](./cases/mobile-resume.md) | 375 × 812 layout, section reachability and fixed theme control |
| [navigation](./cases/navigation.md) | Health endpoint, nginx fallback and distinct static entry |
| [spyfall-intro](./cases/spyfall-intro.md) | Storyboard next/previous controls and return to resume |

