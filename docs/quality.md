# Domain Quality Index

> Grade Scale
> - 🟢 A: solid and low-risk
> - 🟡 B: good foundation with notable gaps
> - 🟠 C: workable but needs care
> - 🔴 D: do not extend without repair
>
> Last Updated: 2026-03-13

## Product Domains

### `apps/web/src/components/` — UI Presentation Layer
**Grade: 🟢 A-**

| Dimension | Status | Notes |
| --- | --- | --- |
| Modularity | ✅ Good | Each section lives in its own file |
| Styling consistency | ✅ Good | Tailwind-first with limited computed inline styles |
| Type safety | ✅ Better | Components now consume typed content from `@cloud-resume-v2/contracts` |
| Test coverage | ✅ Baseline | Smoke tests cover app boot, shared content rendering, and theme toggling |
| Hardcoded UI chrome | ⚠️ Present | Section labels and footer chrome still include hardcoded copy |
| Async correctness | ⚠️ Pending | Visitor count remains static placeholder UI, not a real integration |

**Known Debt**

- `Footer.tsx` still hardcodes visitor count `843`.
- `Hero.tsx` contains a dense inline IDE snippet that could be extracted if the section grows.

### `packages/contracts/` — Shared Content Contract Layer
**Grade: 🟢 A-**

| Dimension | Status | Notes |
| --- | --- | --- |
| Central content file | ✅ Good | Core resume content now lives in `packages/contracts/src/resume.json` |
| Type safety | ✅ Good | `ResumeDocument` and related interfaces define the public contract |
| Boundary parsing | ✅ Good | `resume.ts` parses the content at the package boundary |
| Test coverage | ❌ Missing | No direct tests around the package yet |

**Known Debt**

- Add regression tests around the contracts package so parsing failures are caught earlier than full-app builds.

### `packages/frontend-core/` — Shared Frontend Runtime Layer
**Grade: 🟡 B**

| Dimension | Status | Notes |
| --- | --- | --- |
| Correctness | ✅ Good | Theme persistence and DOM application now live behind a package API |
| Boundary parsing | ✅ Good | Stored theme values are parsed before use |
| Simplicity | ⚠️ Mixed | The class-based helper remains slightly heavier than a plain-function API |
| Test coverage | ❌ Missing | No tests |

**Known Debt**

- Add focused tests around theme persistence and DOM class application.

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
| MCP provisioning | ⚠️ Partial | Only Stitch MCP is configured |
| Imported skill fit | ⚠️ Mixed | Several imported skills are generic and require extra setup |

## Technical Debt Register

| ID | Domain | Debt Item | Priority | Phase |
| --- | --- | --- | --- | --- |
| TD-001 | components | Replace static footer visitor count with a real fail-safe integration | 🟠 P1 | 3 |
| TD-002 | all | Expand smoke coverage beyond app boot and theme toggle | 🟠 P1 | 3 |
| TD-003 | packages | Add dedicated tests around extracted contracts and frontend-core packages | 🟠 P1 | 3 |
| TD-004 | CI | Confirm GitHub branch protection outside the repo | 🟠 P1 | 3 |
| TD-005 | agent-tooling | Adapt or prune generic imported skills that are not repo-fitted | 🟡 P2 | 3 |
