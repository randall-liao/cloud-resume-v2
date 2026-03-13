# Architecture: cloud-resume-v2

> Stack: React 18 · TypeScript 5 · Vite 4 · Tailwind CSS v4
> Deployment target: AWS S3 static hosting behind CloudFront
> Rendering model: 100% client-side rendering
> Workspace model: npm workspaces with one active app at `apps/web`

## 1. Deployment Topology

```text
Browser
  -> CloudFront
    -> S3 static asset bucket
```

The current frontend ships only static assets. There is no server-side runtime in this repository.

The visitor counter API is planned but not implemented in the current UI. `.env.example` exists as scaffold for that future work only.

## 2. Repository Map

```text
cloud-resume-v2/
├── AGENTS.md
├── AGENT.md
├── README.md
├── DESIGN.md
├── apps/
│   └── web/
│       ├── index.html
│       ├── package.json
│       ├── public/
│       │   └── assets/background.svg
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── index.css
│       │   └── components/
│       └── vite.config.ts
├── packages/
│   ├── contracts/
│   │   └── src/
│   │       ├── index.ts
│   │       ├── resume.ts
│   │       └── resume.json
│   └── frontend-core/
│       └── src/
│           ├── index.ts
│           └── themeManager.ts
├── services/
│   └── ...future serverless domains
├── infra/
│   └── ...future IaC domains
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── monorepo.md
│   ├── principles.md
│   ├── quality.md
│   ├── quality_standards.md
│   └── plans/
│       ├── phase1_foundation.md
│       └── agent_gap_analysis.md
├── .agent/
│   ├── mcp.json
│   ├── skills/
│   └── workflows/
├── scripts/
│   ├── validate-dist.sh
│   └── validate-docs.mjs
├── package.json
└── package-lock.json
```

## 3. Runtime Data Flow

The runtime is simple and mostly static:

- `apps/web/src/main.tsx` mounts `App`.
- `apps/web/src/App.tsx` owns dark-mode state, sets the document title, applies the `dark` class through `@cloud-resume-v2/frontend-core`, and composes the page sections.
- Presentational components read typed content from `@cloud-resume-v2/contracts`.
- `apps/web/src/components/Footer.tsx` currently renders a static visitor count placeholder (`843`). No fetch call exists yet.

```text
@cloud-resume-v2/contracts
  -> Header
  -> Hero
  -> OriginStory
  -> CommitHistory
  -> Education
  -> Certifications
  -> Interests
  -> Footer

@cloud-resume-v2/frontend-core
  -> themeManager
  -> applyThemePreference

App.tsx
  -> owns darkMode state
  -> applies theme side effects
  -> renders layout shell
```

## 4. Theme Architecture

Theme persistence is handled by `packages/frontend-core/src/themeManager.ts`, which exports a small package-level API:

1. Read `localStorage` if a theme preference exists.
2. Parse the stored value at the boundary and ignore invalid values.
3. Fall back to `prefers-color-scheme`.
4. Persist the selected theme back to `localStorage`.
5. Toggle the `dark` class from `App.tsx` through `applyThemePreference`.

This repo does not use Redux, Zustand, or any other global state library.

## 5. Dependency Inventory

### Runtime

- `react`
- `react-dom`
- External font/icon CDNs declared in `apps/web/index.html`:
  - Inter
  - Fira Code
  - Material Icons / Material Symbols
  - Font Awesome

### Development

- `vite`
- `typescript`
- `eslint`
- `tailwindcss`
- `@tailwindcss/forms`
- `@tailwindcss/container-queries`

Unused MUI and Emotion packages were removed during the Phase 1 audit remediation so the installed dependency set matches the actual runtime model.

## 6. Agent-First Foundation

Phase 1 and Phase 2 foundations in this repo mean:

- `AGENTS.md` is the canonical short map for agents.
- `docs/` holds the source-of-truth architecture, standards, quality, and plans.
- `apps/web` is the only active application workspace.
- `packages/contracts` owns typed resume content and shared document contracts.
- `packages/frontend-core` owns shared browser-facing frontend runtime helpers.
- `scripts/validate-docs.mjs` validates required docs and markdown links.
- CI enforces docs validation, workspace lint/build success, smoke tests, and static artifact validation.
- Plans in `docs/plans/` are kept as first-class artifacts instead of out-of-band notes.

## 7. Known Next Gaps

- Smoke coverage exists, but it is still intentionally narrow.
- The visitor counter remains static UI, not a live integration.
- The extracted shared packages do not yet have dedicated regression tests beyond workspace builds.
- Several imported skills under `.agent/skills/` are generic and not yet fully adapted to this repo.
