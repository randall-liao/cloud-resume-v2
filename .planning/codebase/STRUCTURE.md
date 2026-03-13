# Structure

## Summary

The repository is now a small workspace monorepo rather than a single-package frontend app. The structure is intentionally simple: one active web app, two active shared frontend packages, reserved future domains for services and infrastructure, and repo-root docs plus planning artifacts.

## Top-Level Layout

```text
cloud-resume-v2/
├── .agent/
├── .github/
├── .planning/
├── apps/
│   └── web/
├── docs/
├── infra/
├── packages/
│   ├── contracts/
│   └── frontend-core/
├── scripts/
├── services/
├── AGENTS.md
├── AGENT.md
├── DESIGN.md
├── README.md
├── package.json
└── package-lock.json
```

## Directory Roles

### `apps/web/`

Application source for the only runtime app in the repository.

Current contents:

```text
apps/web/
├── index.html
├── package.json
├── public/
│   └── assets/background.svg
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   └── components/
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

Practical notes:

- `components/` is still a flat section-oriented folder.
- Shared content and shared frontend runtime logic no longer live inside the app.
- `apps/web/dist/` is generated output and remains disposable.

### `packages/contracts/`

Shared content and contract boundary.

Current contents:

```text
packages/contracts/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── resume.ts
    └── resume.json
```

### `packages/frontend-core/`

Shared browser-facing frontend runtime helper boundary.

Current contents:

```text
packages/frontend-core/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    └── themeManager.ts
```

### `scripts/`

Repository-local validation scripts:

- `scripts/validate-docs.mjs`
- `scripts/validate-dist.sh`

These remain operationally important because they encode repo-level assumptions and validation flow.

### `docs/`

Canonical source-of-truth project documentation for:

- architecture
- monorepo boundaries
- quality standards
- enforced principles
- quality assessment
- high-level phase/backlog artifacts

### `.planning/`

Planning-oriented artifacts for roadmap execution and codebase mapping. This directory is active and useful, but `docs/` remains the canonical runtime documentation layer.

### `services/` and `infra/`

Reserved future domains for backend/serverless and IaC work. They are intentionally present before implementation so future work has an explicit home.

## Root Files That Matter

- `package.json`: workspace root scripts and workspace registration
- `AGENTS.md`: canonical agent entrypoint
- `AGENT.md`: compatibility shim
- `README.md`: human-facing repo overview
- `DESIGN.md`: visual language reference

## Structural Characteristics

### What is simple today

- one workspace root
- one deployable app
- two real shared packages
- one deploy target
- clear placeholder domains for future services and infra

### What is still mixed together

- product docs and planning artifacts still coexist at repo level
- agent tooling still sits next to app and package code
- global CSS and component-specific styling concerns still share `apps/web/src/index.css`

## Structure-Level Refactor Seams

### App boundary

`apps/web/` is the app boundary. App-specific source, assets, and build config move together.

### Contracts boundary

`packages/contracts/` is now the canonical content and schema boundary for frontend and future backend sharing.

### Frontend runtime boundary

`packages/frontend-core/` is the shared frontend runtime helper boundary.

### Tooling boundary

`scripts/validate-docs.mjs` and `scripts/validate-dist.sh` are still repo-level tooling and may eventually evolve into more package-aware tooling, but they are not packageized yet.

### Docs boundary

`docs/` remains canonical runtime documentation even as `.planning/` expands.

## Practical Recommendations

For the next milestone, keep structure changes incremental:

1. add dedicated tests for `packages/contracts` and `packages/frontend-core`
2. expand the app smoke suite before introducing larger UI or runtime refactors
3. keep subtree candidates aligned to domain boundaries instead of splitting smaller helper folders
4. regenerate `.planning/codebase/` whenever architecture or ownership boundaries change materially
