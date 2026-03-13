# Phase 2: Shared Frontend Contracts - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Turn the current placeholder `packages/` space into real shared frontend package seams without changing the product into a multi-app or backend-enabled system. This phase extracts the resume content boundary and the theme utility boundary into workspace packages, then rewires `apps/web` to consume those package APIs instead of direct local file imports.

</domain>

<decisions>
## Implementation Decisions

### Package boundaries
- Use `packages/contracts` as the typed resume-content boundary because Phase 1 already reserved it as the future shared contract home.
- Introduce `packages/frontend-core` as the browser-facing shared frontend utility package for theme persistence and closely related app-shell helpers.
- Keep `apps/web` as the composition root and deployable runtime app. It may depend on packages, but packages must not depend on `apps/web`.

### Scope guardrails
- Preserve the current static SPA deployment model and visible resume behavior.
- Do not implement backend, serverless, database, or infrastructure code in this phase.
- Do not redesign the UI or introduce new product features while extracting package seams.

### Agent-first operating model
- Replace direct leaf imports of app-local data and utility files with stable package entrypoints.
- Keep public package APIs small and explicit so future agents can discover the right boundary quickly.
- Prefer source-first workspace packages that are easy for the current toolchain to reason about over adding a heavyweight package build system.

### Claude's Discretion
- Exact runtime parsing strategy for the resume content boundary.
- Whether the raw resume source remains JSON or becomes a typed TypeScript module inside `packages/contracts`.
- The exact API shape exposed by `packages/frontend-core`, as long as it stays focused on shared frontend concerns.

</decisions>

<specifics>
## Specific Ideas

- `apps/web/src/data/resume.json` is imported directly by `App.tsx` and most section components today. That is the primary FE-01 gap.
- `apps/web/src/utils/themeManager.ts` is the only real shared utility seam in the current app. That is the primary FE-02 gap.
- Root workspaces already include `packages/*`, so Phase 2 should build on the Phase 1 structure rather than changing package managers again.
- `packages/contracts` should remain browser-agnostic so future backend or serverless code can share the same content and schema package later.

</specifics>

<code_context>
## Existing Code Insights

### Direct import hotspots
- `apps/web/src/App.tsx` imports both `./data/resume.json` and `./utils/themeManager`.
- `apps/web/src/components/{Header,Hero,OriginStory,CommitHistory,Education,Certifications,Interests,Footer}.tsx` each import `../data/resume.json` directly.

### Reusable seams already visible
- `apps/web/src/data/resume.json`: repository-local source of truth for resume content.
- `apps/web/src/utils/themeManager.ts`: browser-side theme persistence helper using `localStorage` and `matchMedia`.

### Structural constraints
- Root validation currently runs `npm run docs:validate`, `npm run lint`, `npm run build`, and static artifact validation.
- The app is still a single Vite workspace under `apps/web` with no test runner and no shared package build pipeline yet.

</code_context>

<deferred>
## Deferred Ideas

- Adding the visitor-count backend or any frontend API client.
- Introducing cross-domain database contracts beyond the current resume content boundary.
- Adding smoke tests and git subtree workflow hardening. Those remain Phase 3 work.

</deferred>

---

*Phase: 02-shared-frontend-contracts*
*Context gathered: 2026-03-13*
