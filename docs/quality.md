# Domain Quality Index

> Grade Scale
> - 🟢 A: solid and low-risk
> - 🟡 B: good foundation with notable gaps
> - 🟠 C: workable but needs care
> - 🔴 D: do not extend without repair
>
> Last Updated: 2026-06-05

## Product Domains

### `apps/web/src/components/` — UI Presentation Layer
**Grade: 🟢 A**

| Dimension | Status | Notes |
| --- | --- | --- |
| Modularity | ✅ Good | Each section lives in its own file |
| Styling consistency | ✅ Good | Tailwind-first with limited computed inline styles |
| Type safety | ✅ Better | Components now consume typed content from `@cloud-resume-v2/contracts` |
| Test coverage | ✅ Excellent | Vitest + RTL suite covers app boot, footer behavior, and full UI component rendering |
| Hardcoded UI chrome | ⚠️ Present | Section labels still include hardcoded copy |
| Async correctness | ✅ Resolved | Visitor count is controlled via a fail-safe feature flag `enableVisitorCounter` |

**Known Debt**

- `Hero.tsx` contains a dense inline IDE snippet that could be extracted if the section grows.

### `apps/web/src/spyfall/` — Spyfall Arena Intro Page
**Grade: 🟡 B**

| Dimension | Status | Notes |
| --- | --- | --- |
| Static entry isolation | ✅ Good | Separate Vite entry (`spyfall-arena.html`) emits its own JS/CSS chunks; no spyfall code leaks into the resume bundle |
| Type safety | ✅ Good | Migrated to TypeScript strict with typed refs and GSAP callbacks |
| Test coverage | ⚠️ Narrow | GSAP-mocked tests assert state-driven DOM, but animation timelines are not exercised |
| Styling | ⚠️ Heavy | Large page-scoped `spyfall.css` cinematic layer, isolated to this entry |

**Known Debt**

- The intro is a single large component plus a large page-scoped stylesheet; decompose if it grows.

### `packages/contracts/` — Shared Content Contract Layer
**Grade: 🟢 A**

| Dimension | Status | Notes |
| --- | --- | --- |
| Central content file | ✅ Good | Core resume content lives in `packages/contracts/src/resume.json` |
| Type safety | ✅ Good | `ResumeDocument` and related interfaces define the public contract |
| Boundary parsing | ✅ Good | `resume.ts` parses the content at the package boundary |
| Test coverage | ✅ Good | Focused unit tests cover parsing boundaries and schema validation |

**Known Debt**

- None

### `packages/frontend-core/` — Shared Frontend Runtime Layer
**Grade: 🟢 A**

| Dimension | Status | Notes |
| --- | --- | --- |
| Correctness | ✅ Good | Theme persistence and DOM application live behind a package API |
| Boundary parsing | ✅ Good | Stored theme values are parsed before use |
| Simplicity | ⚠️ Mixed | The class-based helper remains slightly heavier than a plain-function API |
| Test coverage | ✅ Good | Unit tests cover theme toggling, localStorage persistence, and DOM class changes |

**Known Debt**

- None

### `CI/CD Pipeline` — Automation Layer
**Grade: 🟢 A-**

| Dimension | Status | Notes |
| --- | --- | --- |
| Secret scanning | ✅ Enforced | `gitleaks` workflow exists |
| Docs validation | ✅ Enforced | CI now runs `npm run docs:validate` |
| Lint gate | ✅ Enforced | `npm run lint` on PRs |
| Workspace build gate | ✅ Enforced | CI now runs `npm run build:packages` and `npm run build:web` |
| Static artifact validation | ✅ Enforced | `bash scripts/validate-dist.sh apps/web/dist` runs in CI |
| Test gate | ✅ Enforced | CI now runs `npm run test` for the web smoke suite |
| Branch protection | ⚠️ Unknown | Repository-side protection not confirmed from local context |

### `Documentation System` — Source Of Truth
**Grade: 🟢 A-**

| Dimension | Status | Notes |
| --- | --- | --- |
| Canonical entrypoint | ✅ Good | `AGENTS.md` plus `AGENT.md` shim |
| Docs index | ✅ Good | `docs/README.md` catalogs the knowledge base |
| Plans as artifacts | ✅ Good | Phase and backlog docs live in `docs/plans/` |
| Link validation | ✅ Good | `npm run docs:validate` checks markdown links |
| Freshness workflow | ✅ Present | `.agent/workflows/doc-gardening.md` exists |
| Historical accuracy | ⚠️ Needs maintenance | Quality depends on future edits staying honest |

### `.agent/` — Agent Tooling
**Grade: 🟠 C**

| Dimension | Status | Notes |
| --- | --- | --- |
| Repo-local workflows | ✅ Good | Doc gardening and PR wrap-up exist |
| Repo-shaped review skill | ✅ Good | Code review skill is useful |
| MCP provisioning | ✅ Configured | Stitch MCP plus a Playwright MCP server (live e2e tier) in `.agent/mcp.json` |
| Imported skill fit | ⚠️ Mixed | Several imported skills are generic and require extra setup |

### `infra/local-dev/agent-harnesses/` — E2E Harness
**Grade: 🟡 B**

| Dimension | Status | Notes |
| --- | --- | --- |
| Real-artifact coverage | ✅ Good | Playwright specs run against the nginx-served build, health-gated on `/healthz` |
| Locator resilience | ✅ Good | Semantic role/title locators, not brittle CSS/XPath |
| Evidence for review | ✅ Good | Screenshots, video, traces, and HTML report emitted to `temp/e2e-evidence/` |
| Live tier | ✅ Present | `@playwright/mcp` driven on-demand from natural-language intent cases |
| CI integration | ⚠️ Not gated | Runs on demand via Docker; not part of `npm run validate`/CI yet |
| Coverage breadth | ⚠️ Narrow | Covers core resume + spyfall + nginx routing; grows as flows are added |

**Known Debt**

- The deterministic tier is not yet wired into CI (see TD-006).

## Technical Debt Register

| ID | Domain | Debt Item | Priority | Status |
| --- | --- | --- | --- | --- |
| TD-004 | CI | Confirm GitHub branch protection outside the repo | 🟠 P1 | Active |
| TD-005 | agent-tooling | Adapt or prune generic imported skills that are not repo-fitted | 🟡 P2 | Active |
| TD-006 | e2e-harness | Wire the deterministic Playwright tier into CI as a (non-blocking, then blocking) gate | 🟡 P2 | Active |

