# cloud-resume-v2

This repository is now a workspace-oriented monorepo for `cloud-resume-v2`. Today it contains one active frontend app at `apps/web`, and the root layout is being prepared for future shared packages plus serverless, contract, and infrastructure domains.

For coding agents, start with [AGENTS.md](AGENTS.md). The documentation system of record lives under [docs/](docs/README.md).

## Architecture & Stack

- React 18
- TypeScript 5
- Vite 4
- Tailwind CSS v4
- Static deployment target: AWS S3 behind CloudFront
- Scroll-first single page UI with local component state only

## Current Status

- The active web app is fully client-rendered and builds to static assets in `apps/web/dist/`.
- Dark mode is persisted through `localStorage` via `@cloud-resume-v2/frontend-core`.
- Resume content is sourced through the typed `@cloud-resume-v2/contracts` package.
- The footer visitor count is still a static placeholder. Live API integration is planned but not implemented yet.

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
├── infra/               # Future IaC domains
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
