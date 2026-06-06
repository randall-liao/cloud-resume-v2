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

A browser-level e2e harness lives in `infra/local-dev/agent-harnesses/`. It runs Playwright specs against the same nginx-served build and writes screenshots, screen recordings, traces, and an HTML report to `temp/e2e-evidence/` for review. One command (it starts the web host for you):

```bash
docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml --profile e2e run --rm e2e
```

See [`infra/local-dev/agent-harnesses/AGENTS.md`](infra/local-dev/agent-harnesses/AGENTS.md) for the deterministic and live (MCP-driven) tiers.

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run docs:validate` validates `AGENTS.md`, required docs, and markdown links.
- `npm run lint` runs ESLint for the active web workspace.
- `npm run build` type-checks and builds the active web workspace.
- `npm run preview` previews the production build for the active web workspace.
- `npm run validate` runs the full local validation flow.
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
