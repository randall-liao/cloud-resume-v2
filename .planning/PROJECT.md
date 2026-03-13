# cloud-resume-v2

## What This Is

`cloud-resume-v2` is currently a frontend-only resume site: a static React SPA deployed as build artifacts to S3 behind CloudFront. This planning milestone converts the repo into an agent-first monorepo so the current web app can keep shipping while future serverless backend, data, and infrastructure domains are added without collapsing into one shared root.

## Core Value

Agents must be able to evolve the web app and future platform domains in parallel through clear repository boundaries, explicit contracts, and workspace-level tooling that preserves a working deployable frontend.

## Requirements

### Validated

- ✓ Static resume SPA builds and deploys as frontend-only assets from this repository.
- ✓ Theme preference persists locally across sessions.
- ✓ Resume content is maintained as repository-local data.
- ✓ The repo already has an agent-first documentation foundation (`AGENTS.md`, `docs/`, CI validation).
- ✓ The repository now operates as a workspace-aware monorepo root with the active frontend app in `apps/web`.
- ✓ Future app, contract, service, and infrastructure boundaries are documented in-repo before implementation begins.
- ✓ Typed resume content now flows through `packages/contracts` instead of app-local leaf imports.
- ✓ Shared browser-facing theme behavior now flows through `packages/frontend-core`.
- ✓ Root validation and CI now validate the workspace structure, not just the web app in isolation.
- ✓ The web app now has smoke-level automated coverage for boot, shared content rendering, and theme behavior.
- ✓ Git subtree workflow and domain ownership rules are documented for parallel agent work.

### Active

- [ ] Sync validation artifacts and root docs with the executed npm workspace workflow.
- [ ] Add direct regression tests for `packages/contracts` and `packages/frontend-core`.
- [ ] Expand smoke coverage beyond app boot and theme toggle.
- [ ] Replace or remove the placeholder footer visitor count before backend work begins.
- [ ] Confirm and document branch-protection expectations outside the local repo.

### Out of Scope

- Live backend, database, or infrastructure implementation in this milestone — future phases only.
- Product redesign or new resume features unrelated to repository architecture — not the point of this refactor.
- Micro-frontend or multi-app UX changes — the current product remains one web app.

## Context

- The current runtime is a small Vite + React SPA with minimal dependencies and a static deployment model.
- The repo already has brownfield maps under `.planning/codebase/` and canonical runtime docs under `docs/`.
- The user wants the repository architecture to follow the agent-first operating model from the OpenAI article: short root map, repo-local system of record, strong boundaries, and better support for parallel agent work.
- The immediate implementation scope is frontend refactoring only, but the repository must leave first-class space for future serverless backend, data, and IaC work.

## Constraints

- **Compatibility**: Preserve current frontend behavior and static hosting assumptions — the existing app must still build and deploy after the move.
- **Scope**: Only the frontend and repository architecture are being changed now — future backend and infrastructure work is scaffolded, not implemented.
- **Agent ergonomics**: Structure must reduce merge pressure and make ownership obvious for multiple agents working concurrently.
- **Documentation**: `docs/` remains the canonical runtime and architecture knowledge base even as `.planning/` expands.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as a brownfield monorepo refactor, not a greenfield rewrite | The existing frontend is small but already functional and documented | ✓ Good |
| Optimize repository structure for parallel agent work first | The team wants agent-first execution and future multi-domain expansion | ✓ Good |
| Keep backend, database, and IaC implementation out of the current milestone | Structural clarity has to land before platform code fans out | ✓ Good |
| Preserve one deployable web app while introducing workspace boundaries | The user asked for monorepo readiness, not a product-level app split | ✓ Good |
| Use npm workspaces for Phase 1 execution | `pnpm` and Corepack were not available in this environment, and npm workspaces satisfied the same boundary goal | ✓ Good |
| Use `packages/contracts` for typed resume content and `packages/frontend-core` for browser-facing shared utilities | Keeps contracts browser-agnostic while preserving a reusable frontend runtime seam | ✓ Good |
| Keep Phase 3 validation rooted in explicit top-level npm scripts | Agents need one readable command surface for local and CI verification | ✓ Good |
| Start UI protection with Vitest + React Testing Library smoke tests | Lightweight smoke coverage closes the largest validation gap without introducing browser E2E overhead yet | ✓ Good |
| Document subtree operations in `docs/` and enforce discoverability through docs validation | Operational workflow must be repo-local and mechanically protected from drift | ✓ Good |

---
*Last updated: 2026-03-13 after v1.0 audit gap-phase creation*
