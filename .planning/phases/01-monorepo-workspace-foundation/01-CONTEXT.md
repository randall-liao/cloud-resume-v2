# Phase 1: Monorepo Workspace Foundation - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert the current frontend-only repository into a workspace-aware monorepo without breaking the existing web app build or static deploy model. This phase establishes the repository root structure, moves the current app into its workspace, updates the repo map for agents, and reserves clear locations for future backend, data, and infrastructure domains without implementing those domains yet.

</domain>

<decisions>
## Implementation Decisions

### Repository shape
- Use a conventional monorepo layout centered on `apps/` and `packages/`.
- Reserve explicit workspace locations for future platform domains such as `services/` and `infra/`, but keep them scaffold-only in this phase.
- Keep `docs/` as the canonical architecture and operations knowledge base from the repo root.

### Scope guardrails
- This phase is frontend refactoring and repository architecture only.
- The current web app must remain the only deployable runtime application after the move.
- Backend, database, and IaC implementation are deferred to later phases.

### Agent-first operating model
- Optimize boundaries so multiple agents can work on app, package, tooling, and future platform domains with minimal overlap.
- Encode monorepo navigation in root docs rather than relying on chat-only explanations.
- Document how git subtree should map to major repository domains as part of the repo architecture.

### Claude's Discretion
- Exact workspace package manager and task-runner selection.
- Exact names of shared packages introduced by the move.
- Whether future placeholder domains are empty directories, documented stubs, or both.

</decisions>

<specifics>
## Specific Ideas

- Keep the future repository shape compatible with a frontend app now and serverless backend, database-contract, and IaC work later.
- Design the move for agent concurrency first, not for human preference about current folder names.
- Treat git subtree as a future extraction/synchronization boundary at the domain level, not as an excuse to over-split the current app.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/resume.json`: clear candidate for a future typed content package.
- `src/utils/themeManager.ts`: small shared utility that can become a package seam later.
- `scripts/validate-docs.mjs` and `scripts/validate-dist.sh`: existing validation assets that will need workspace-aware path handling.

### Established Patterns
- The current app is a single static Vite SPA with no router and minimal runtime dependencies.
- Agent documentation already exists at the repo root through `AGENTS.md` and `docs/`.
- Validation currently succeeds from the single-package root and must be preserved during the move.

### Integration Points
- Root `package.json`, Vite/Tailwind config, and CI workflows will need to be reconsidered for the new workspace topology.
- Runtime app code currently lives under `src/` and should move with minimal behavioral change.
- Root documentation must be updated together with structure changes so agents do not follow stale paths.

</code_context>

<deferred>
## Deferred Ideas

- Implementing the visitor-count backend and any frontend API client.
- Creating the database contract or infrastructure code itself.
- Major UI redesign, routing changes, or multi-app product expansion.

</deferred>

---

*Phase: 01-monorepo-workspace-foundation*
*Context gathered: 2026-03-13*
