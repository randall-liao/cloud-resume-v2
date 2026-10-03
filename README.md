# cloud-resume-v2

This repository is now a workspace-oriented monorepo for `cloud-resume-v2`. Today it contains one active frontend app at `apps/web`, and the root layout is being prepared for future shared packages plus serverless, contract, and infrastructure domains.

For coding agents, start with [AGENTS.md](AGENTS.md). The documentation system of record lives under [docs/](docs/AGENTS.md).

## Architecture & Stack

- React 18
- TypeScript 5
- Vite 8
- Tailwind CSS v4
- Static deployment target: AWS S3 behind CloudFront
- Scroll-first single page UI with local component state only

## Current Status

- The active web app is fully client-rendered and builds to static assets in `apps/web/dist/`.
- The web app is a Vite multi-page build: the main resume (`index.html`) plus a standalone animated "Spyfall Arena" intro (`spyfall-arena.html`). The "Spy Fall Arena" side-project card links into the intro, and both pages are served from the same S3/CloudFront origin.
- Dark mode is persisted through `localStorage` via `@cloud-resume-v2/frontend-core`.
- Resume content is sourced through the typed `@cloud-resume-v2/contracts` package.
- The footer visitor count is a static placeholder, controlled by a feature flag `enableVisitorCounter` in `apps/web/src/config/features.ts` (disabled by default). Live API integration is planned but not implemented yet.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

`npm run validate` runs the full local gate set: docs validation, lint, build, and static artifact validation.

### Local Docker Preview

To exercise the production-style static build behind nginx (mirrors the S3/CloudFront hosting model), use the `infra/local-dev` module. One command from the repo root builds the site and serves it:

```bash
docker compose up --build
```

The site is then served at `http://localhost:8080` (intro page at `http://localhost:8080/spyfall-arena.html`). Set `WEB_PORT` to publish on a different port. This root `docker-compose.yml` `include:`s `infra/local-dev/docker-compose.yml`, and future services plug into the same command. See [`infra/local-dev/AGENTS.md`](infra/local-dev/AGENTS.md) for details.

### End-to-End Tests

A browser-level e2e harness lives in `infra/local-dev/agent-harnesses/`. It runs Playwright specs against the same nginx-served build. Each run writes a review index and self-contained per-test packages (results, screenshots, recordings and traces) under `temp/e2e-evidence/deterministic/<run>/`, alongside Playwright's HTML report. One command (it starts the web host for you):

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml --profile e2e run --rm e2e
```

The deterministic tier is an intended CI gate, but currently runs on demand and is not wired into CI or `npm run validate`.

Chromium is the only supported QA browser. Both the deterministic suite and the
live CLI use Playwright; alternate framework and cross-browser trials are not
part of the retained harness.

For live browser QA, start the Docker preview above, then run from the repository root:

```bash
npm ci --prefix infra/local-dev/agent-harnesses
npm run browser -- --help
npm run qa:live
# Non-interactive/headless omp invocation:
npm run qa:live -- --print
```

The live tier uses Microsoft Playwright CLI + skills: `github-copilot/gpt-6-astra` plans and orchestrates in normal mode, while the named `browser-operator` on `github-copilot/gpt-6-luna` performs browser actions and returns structured evidence. It requires `omp` with both model routes available. Every live browser case requires screenshots, video and complete traces. Astra finalizes `temp/e2e-evidence/live/<run>/index.html` and `<case>/index.html` with `npm run qa:package -- temp/e2e-evidence/live/<run>`. For example, open `<run>/mobile-resume/index.html` to review that exact scenario. Each case folder is portable; missing evidence is explicit, never a fully evidenced pass. CLI capture remains separate from `playwright.config.ts`.

See [`infra/local-dev/agent-harnesses/AGENTS.md`](infra/local-dev/agent-harnesses/AGENTS.md) for both tiers and browser setup.

### Local LLM Review (On Demand)

Run OpenCodeReview's [delegation workflow](.agent/workflows/review-local.md) through OMP when you want an LLM review:

```bash
npm run review:local                                     # interactive: staged, unstaged and untracked changes
npm run review:local -- --print                          # same review, print result and exit
npm run review:local -- --print "Review commit HEAD"     # explicitly review the latest commit
npm run review:local -- --print "Review origin/main to HEAD" # explicitly review a branch range
```

The command uses the existing OMP GitHub Copilot login and installs the pinned OCR CLI through `npm exec` if needed. OCR selects files and resolves the [repository rules](.opencodereview/rule.json); OMP performs the review. It reads files but does not post comments or make changes. Reviewing a branch already merged into `main` may select no files; use an explicit commit target instead. No LLM step runs during `npm run validate` or in GitHub Actions. Run this command yourself when you are ready to incur model usage.

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run docs:validate` validates `AGENTS.md`, required docs, and markdown links.
- `npm run lint` runs ESLint for the active web workspace.
- `npm run build` type-checks and builds the active web workspace.
- `npm run preview` previews the production build for the active web workspace.
- `npm run validate` runs the full local validation flow.
- `npm run browser -- --help` shows the pinned Microsoft Playwright CLI commands.
- `npm run qa:live` launches Astra's live QA workflow with the Luna browser operator; add `-- --print` for non-interactive/headless omp usage.
- `npm run qa:package -- <run-directory>` finalizes a live run's saved `summary.json` into per-case review pages and an index, including failed or unreturned cases.
- `npm run review:local` starts the manual OCR-delegated OMP review; add `-- --print` for a non-interactive result.
- `bash scripts/validate-dist.sh apps/web/dist` verifies the built artifact is suitable for S3/CloudFront hosting.

## Project Structure

```text
cloud-resume-v2/
├── AGENTS.md            # Canonical agent entrypoint
├── AGENT.md             # Compatibility shim for legacy tooling
├── apps/
│   └── web/             # Active Vite/React frontend app
├── packages/            # Shared package space
│   ├── contracts/       # Typed resume content and shared contract boundary
│   └── frontend-core/   # Shared browser-facing frontend utilities
├── services/            # Future serverless/backend domains
├── infra/               # IaC domains; infra/local-dev hosts the site in Docker
│                        #   and infra/local-dev/agent-harnesses holds the e2e harness
├── docs/                # System of record for architecture, standards, quality, and plans
├── .agent/              # Repo-local workflows and imported skills
├── scripts/             # Validation and helper scripts
├── package.json         # Workspace root metadata and scripts
└── package-lock.json    # Workspace lockfile for npm
```

## Deployment

```bash
npm run build
bash scripts/validate-dist.sh apps/web/dist
```

Upload the contents of `apps/web/dist/` to the S3 bucket and serve them through CloudFront.
