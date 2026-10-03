# Architecture: cloud-resume-v2

> Stack: React 18 · TypeScript 5 · Vite 8 · Tailwind CSS v4
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

For local end-to-end testing there is a Docker host under `infra/local-dev/` that builds the same static artifact and serves it through nginx. The repository-root `docker-compose.yml` `include:`s that module, so `docker compose up --build` brings the project up locally in one command. See [`infra/local-dev/AGENTS.md`](../infra/local-dev/AGENTS.md). A browser-level e2e agent harness lives alongside it under `infra/local-dev/agent-harnesses/` (see [§9](#9-end-to-end-agent-harness) and [`infra/local-dev/agent-harnesses/AGENTS.md`](../infra/local-dev/agent-harnesses/AGENTS.md)).

The web workspace is a Vite multi-page build. It emits two static entry points into `apps/web/dist/`:

- `index.html` — the main resume SPA.
- `spyfall-arena.html` — a standalone animated "Spyfall Arena" intro (GSAP scrollytelling). The "Spy Fall Arena" side-project card links here via the `introUrl` field in the resume contract. Both pages are served from the same S3 bucket / CloudFront distribution at the domain root.

The visitor counter API is planned but not implemented in the current UI. A feature flag `enableVisitorCounter` is defined in `apps/web/src/config/features.ts` (disabled by default) to control the display of the counter. `.env.example` exists as scaffold for that future API work.

## 2. Repository Map

```text
cloud-resume-v2/
├── AGENTS.md
├── AGENT.md
├── README.md
├── DESIGN.md
├── .opencodereview/      # Local OCR rule selection; not CI automation
├── apps/
│   └── web/
│       ├── index.html
│       ├── spyfall-arena.html
│       ├── package.json
│       ├── public/
│       │   ├── assets/background.svg
│       │   ├── assets/{openai,gemini,deepseek,claude}.svg
│       │   └── favicon.svg
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── index.css
│       │   ├── components/
│       │   └── spyfall/
│       │       ├── main.tsx
│       │       ├── SpyfallIntro.tsx
│       │       └── spyfall.css
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
│   ├── local-dev/                  # Docker + nginx host for the static site
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── nginx/default.conf
│   │   └── agent-harnesses/        # e2e harness (Playwright specs + CLI live tier)
│   │       ├── deterministic/      # committed *.spec.ts regression specs
│   │       ├── live/               # NL intent cases + CLI runbook
│   │       ├── playwright.config.ts
│   │       └── docker-compose.yml  # `e2e` runner (profile: e2e)
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
- `apps/web/src/components/Footer.tsx` conditionally renders a static visitor count placeholder (`843`) based on the `enableVisitorCounter` feature flag in `apps/web/src/config/features.ts`. No fetch call exists yet.

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

## 5. Spyfall Arena Intro Page

The "Spy Fall Arena" side project ships with a standalone animated introduction that was migrated from a separate Vite + React + GSAP project into this workspace. It is a second static page, not a route inside the resume SPA.

### Build wiring

The web workspace is a Vite multi-page build. `apps/web/vite.config.ts` declares two Rollup inputs:

- `main` → `apps/web/index.html` (resume SPA, emitted as `dist/index.html`).
- `spyfall` → `apps/web/spyfall-arena.html` (intro, emitted as `dist/spyfall-arena.html`).

Each entry is code-split into its own JS/CSS chunks, so the intro's GSAP timeline and cinematic styles never load on the resume page, and vice versa. Both pages are uploaded to the same S3 bucket and served from the same CloudFront distribution at the domain root.

### Runtime structure

```text
spyfall-arena.html
  -> src/spyfall/main.tsx        (imports ./spyfall.css, mounts in StrictMode)
    -> src/spyfall/SpyfallIntro.tsx   (the intro component)
```

`SpyfallIntro.tsx` is a 21-beat scrollytelling state machine. A single `currentStep` React state value (0–20) is the source of truth for which narrative beat is shown. The HUD step dots, the next-step FAB, and the "Previous Step" control all mutate `currentStep`; the rendered narrative card and act tag derive from it.

Animation is layered on top of that state with GSAP via the `useGSAP` hook from `@gsap/react`, scoped to the component's container ref so selectors never escape the page. `lucide-react` supplies the HUD and narrative icons. Per the repository's React + GSAP convention, all GSAP work runs inside `useGSAP` (client-only, auto-cleaned on unmount); there is no SSR for this page.

### Linking in and out

- **Resume → intro:** `SideProject` in `@cloud-resume-v2/contracts` carries an optional `introUrl` field. `packages/contracts/src/resume.json` sets `introUrl: "/spyfall-arena.html"` on the Spy Fall Arena entry, and `apps/web/src/components/SideProjects.tsx` renders a "Launch intro" link (same-tab navigation) only when `introUrl` is present. The card's GitHub link is kept separate and truthful.
- **Intro → resume:** the intro HUD has a top-left "Back to resume" link (`href="/"`) that returns to the resume root. Because the launch link navigates in the same tab, this is a plain root navigation rather than `history.back()`.

### Styling and assets

`src/spyfall/spyfall.css` is a page-scoped global stylesheet owned by the intro entry (imported from `main.tsx`), kept isolated from `apps/web/src/index.css`. Brand logos used by the intro live in `apps/web/public/assets/{openai,gemini,deepseek,claude}.svg` and are served unhashed from `/assets/...`.

### Testing

`apps/web/tests/spyfall/SpyfallIntro.test.tsx` mocks `gsap` and `@gsap/react` so the React state machine, HUD navigation, and the back-to-resume link can be asserted deterministically in jsdom without a real layout engine. `scripts/validate-dist.sh` additionally checks that `spyfall-arena.html` references its JS chunk and resolves its local assets.

## 6. Dependency Inventory

### Runtime

- `react`
- `react-dom`
- `gsap` and `@gsap/react` — power the GSAP animation timeline on the `spyfall-arena.html` intro page only.
- `lucide-react` — icon set used by the Spyfall Arena intro page only.
- External font/icon CDNs declared in `apps/web/index.html`:
  - Inter
  - Fira Code
  - Material Icons / Material Symbols
  - Font Awesome
- External fonts declared in `apps/web/spyfall-arena.html`:
  - Inter
  - Outfit
  - JetBrains Mono

### Development

- `vite`
- `typescript`
- `eslint`
- `tailwindcss`
- `@tailwindcss/forms`
- `@tailwindcss/container-queries`

Unused MUI and Emotion packages were removed during the Phase 1 audit remediation so the installed dependency set matches the actual runtime model.

## 7. Agent-First Foundation

Phase 1 and Phase 2 foundations in this repo mean:

- `AGENTS.md` is the canonical short map for agents.
- **Agent-First Documentation Architecture**: Subdomain directories contain `AGENTS.md` instead of `README.md` to cleanly separate human vs LLM documentation. The single root `README.md` remains strictly for human developers.
- The root `AGENTS.md` serves as a complete index map and must contain a relative link to every subdomain `AGENTS.md` file.
- `docs/` holds the source-of-truth architecture, standards, quality, and plans.
- `apps/web` is the only active application workspace.
- `packages/contracts` owns typed resume content and shared document contracts.
- `packages/frontend-core` owns shared browser-facing frontend runtime helpers.
- `scripts/validate-docs.mjs` validates required docs and markdown links.
- `scripts/lint_agents.py` continuously verifies the architectural boundaries (exactly one `README.md`, map completeness, dead link prevention, and zero orphaned markdown files).
- CI enforces docs validation, workspace lint/build success, smoke tests, and static artifact validation.
- Plans in `docs/plans/` are kept as first-class artifacts instead of out-of-band notes.

## 8. Known Next Gaps

- Smoke coverage exists, but it is still intentionally narrow.
- The visitor counter remains static UI, not a live integration.
- The extracted shared packages do not yet have dedicated regression tests beyond workspace builds.
- Several imported skills under `.agent/skills/` are generic and not yet fully adapted to this repo.
- The e2e agent harness (§9) is not yet wired into CI; it runs on demand via Docker.

## 9. End-to-End Agent Harness

Browser-level e2e lives in `infra/local-dev/agent-harnesses/` and always runs against the **real artifact** — the nginx-served static build from `infra/local-dev`, not the Vite dev server. It is a hybrid two-tier design and is deliberately **not** an npm workspace, mirroring `infra/local-dev` itself. Root `turbo` and `npm run validate` exclude it; root `browser` and `qa:live` scripts explicitly invoke live tooling. The deterministic tier is the intended CI gate, but currently runs on demand and is not wired into CI.

- **Tier 1 — deterministic:** committed `@playwright/test` specs in `deterministic/*.spec.ts` (health/fallback, resume landmarks + sections + theme toggle, spyfall load/mount). They use semantic role/title locators and run headless via a Docker `e2e` runner that `include:`s the `web` module and waits on its `/healthz` healthcheck:

  ```bash
  docker compose -f infra/local-dev/agent-harnesses/docker-compose.yml \
    --profile e2e run --rm e2e
  ```

- **Tier 2 — live exploratory:** Microsoft Playwright CLI (`@playwright/cli` pinned to `0.1.21`) + repository skills execute natural-language intent cases in `live/cases/*.md`. `github-copilot/gpt-6-astra` plans and orchestrates in normal mode, delegating sequential whole cases to the named `browser-operator` on `github-copilot/gpt-6-luna`. Only Luna performs browser actions; Astra consumes structured evidence. Start the host with `docker compose up --build`, install with `npm ci --prefix infra/local-dev/agent-harnesses`, inspect commands with `npm run browser -- --help`, then launch `npm run qa:live` (or `npm run qa:live -- --print` for non-interactive/headless omp usage). Durable findings inform deterministic regressions; PR creation still requires explicit instruction. Stitch remains optional in `.agent/mcp.json`; live browser QA does not use MCP.

- **Evidence:** both tiers create a run `index.html`/`manifest.json` and self-contained per-case `index.html`/`result.json` packages with screenshot previews, playable recordings and complete trace artifacts. Deterministic defaults use unique `temp/e2e-evidence/deterministic/<run>/` directories; `E2E_EVIDENCE_ROOT` changes the root (Docker uses `/evidence`), while `E2E_EVIDENCE_DIR` explicitly selects an exact run directory. Its reporter preserves projects/retries and explicitly exempts the HTTP-only health case from browser capture requirements. Live CLI captures remain in `temp/e2e-evidence/live/<run>/<case>`; Astra invokes `npm run qa:package -- <run-directory>` using the requested-case inventory and operator results, even after failures. Missing captures are reported separately from assertion status; cases with no result receive blocked packages. Artifacts remain git-ignored. See the [live runbook](../infra/local-dev/agent-harnesses/live/RUNBOOK.md).

The harness drives `apps/web` only through the browser — it does not import application source, and application source does not import it.
