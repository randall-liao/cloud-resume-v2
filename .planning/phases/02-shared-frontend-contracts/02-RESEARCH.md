# Phase 2: Shared Frontend Contracts - Research

**Researched:** 2026-03-13
**Domain:** Brownfield package extraction for a frontend-first monorepo
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use `packages/contracts` as the typed resume-content boundary.
- Introduce `packages/frontend-core` for shared frontend utilities such as theme persistence.
- Keep `apps/web` as the only deployable runtime application.
- Preserve the current static SPA deployment model and visible resume behavior.
- Do not implement backend, database, or infrastructure code in this phase.
- Replace direct app-local data and utility imports with package entrypoints that future agents can discover quickly.
- Prefer source-first workspace packages over extra build-system complexity.

### Claude's Discretion
- Exact parsing strategy for resume content.
- Whether the content source stays JSON or becomes a typed TypeScript module inside the contracts package.
- Exact API shape for `packages/frontend-core`.

### Deferred Ideas (OUT OF SCOPE)
- Visitor counter backend or API integration.
- Cross-domain database contracts beyond resume content.
- Smoke tests and subtree workflow hardening.

</user_constraints>

<research_summary>
## Summary

Phase 2 should stay narrow: extract only the package seams that already exist in the codebase. The current frontend has two obvious candidates and little else: the resume content source and the theme persistence helper. That makes the best plan a three-step sequence: create `packages/contracts`, create `packages/frontend-core`, then migrate the web app to those APIs and remove local leaf imports.

The repo already standardized on npm workspaces during Phase 1 because `pnpm` and Corepack were unavailable in this environment. Phase 2 should not churn tooling again. Instead, create source-first TypeScript workspace packages with simple manifests, local `build` or `typecheck` scripts, and explicit package exports. Let the existing web workspace and root validation remain the integration gate for now.

**Primary recommendation:** Implement two real workspace packages:
- `@cloud-resume-v2/contracts` in `packages/contracts`
- `@cloud-resume-v2/frontend-core` in `packages/frontend-core`

Then migrate `apps/web` to those entrypoints and delete direct imports from `apps/web/src/data/resume.json` and `apps/web/src/utils/themeManager.ts`.
</research_summary>

## Recommended Package Shape

```text
packages/
├── contracts/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── resume.ts
│       └── resume.json or resume-data.ts
└── frontend-core/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        └── themeManager.ts
```

Why this shape fits the current repo:
- `packages/contracts` matches the Phase 1 reservation and future backend-sharing intent.
- `packages/frontend-core` keeps browser-only helpers out of the contracts package.
- The web app remains thin and focused on layout plus composition rather than owning shared data or shared runtime helpers.

## Resume Content Boundary Recommendation

### Preferred boundary

Export a typed `resumeData` value and `ResumeDocument` type from `@cloud-resume-v2/contracts`.

Recommended characteristics:
- One public package entrypoint.
- One canonical content source inside the package.
- One parse-at-the-boundary step inside the package before data is exported.
- No component should import a file path like `../data/resume.json` after migration.

### Parser choice

For this repo size, prefer a small in-package parse/assert layer over bringing in a heavy new dependency unless execution proves that hand-written validation is too brittle. The important architectural outcome is the boundary, not whether the assertion is implemented with Zod or a small internal validator.

### What not to do

- Do not leave the raw JSON in `apps/web/src/data/` and simply re-export it through a wrapper file. That preserves the old ownership boundary under a new name.
- Do not scatter separate exports per component section before a stable top-level document exists. Future backend consumers will likely want the whole contract first.

## Frontend Utility Boundary Recommendation

### Preferred boundary

Move `themeManager` into `@cloud-resume-v2/frontend-core` and keep the package narrowly focused on browser-facing frontend helpers that are reusable across apps.

Recommended characteristics:
- Export a stable theme API from the package root.
- Keep browser APIs (`localStorage`, `matchMedia`, DOM theme application helpers) isolated here rather than in `apps/web`.
- Avoid turning this package into a generic dumping ground for unrelated utilities.

### Why separate it from contracts

- Theme persistence is runtime behavior, not a shared domain contract.
- Future serverless or database code should be able to consume `@cloud-resume-v2/contracts` without pulling browser-only code or browser types.

## Migration Sequencing

### Sequence to prefer

1. Convert `packages/contracts` from placeholder to real package and move the resume boundary there.
2. Create `packages/frontend-core` around the existing theme helper.
3. Update `apps/web` to depend on both packages and remove direct local imports.
4. Update architecture docs in the same migration pass so agents stop seeing stale boundaries.

### Why this order matters

- The contracts package is the larger fan-out because many components currently import the same JSON file.
- The theme package is self-contained and low-risk once the package shape is established.
- The app migration should happen after both package APIs are real, otherwise the app has to churn twice.

## Dependency Direction

Keep the following rules during execution:

1. `apps/web` may depend on `@cloud-resume-v2/contracts` and `@cloud-resume-v2/frontend-core`.
2. `@cloud-resume-v2/frontend-core` may depend on `@cloud-resume-v2/contracts` only if a future feature requires it, but Phase 2 should avoid that coupling.
3. `@cloud-resume-v2/contracts` must not depend on browser-only code or on `apps/web`.

## Validation Architecture

Phase 2 does not need a new test framework yet, but it does need package-aware verification with short feedback loops.

Recommended validation model:
- Each extracted package owns a simple `build` or `typecheck` command.
- Migration work in `apps/web` is verified by root `npm run validate`.
- Grep-based checks are acceptable for ensuring direct leaf imports are gone because the current repo is still small and explicit.

Recommended commands during execution:
- `npm run build --workspace @cloud-resume-v2/contracts`
- `npm run build --workspace @cloud-resume-v2/frontend-core`
- `npm run validate`
- `rg -n "data/resume.json|utils/themeManager" apps/web/src`

## Common Pitfalls

### Pitfall 1: Re-exporting old app-local files without moving ownership
- What goes wrong: package imports exist, but the actual source of truth still lives under `apps/web/src`.
- Why it happens: it feels faster to wrap the old file path.
- How to avoid: move the content and theme ownership into `packages/`, then make the app consume the package.

### Pitfall 2: Putting browser runtime helpers into `packages/contracts`
- What goes wrong: the future cross-domain contract package becomes coupled to the browser.
- Why it happens: the app currently has only one small utility seam and it is tempting to put everything in one package.
- How to avoid: reserve `packages/contracts` for content and shared schemas; keep theme/runtime helpers in `packages/frontend-core`.

### Pitfall 3: Updating package code but leaving stale docs and stale import paths
- What goes wrong: future agents still see docs claiming `resume.json` or `themeManager.ts` live in `apps/web/src`.
- Why it happens: package extraction is treated as code-only work.
- How to avoid: make import cleanup and doc updates part of the final migration plan.

## Planning Implications

The roadmap split is correct and should stay as three plans:

1. `02-01`: Extract typed resume content package
2. `02-02`: Extract shared theme and frontend utility package
3. `02-03`: Migrate the web app to package APIs and remove direct leaf imports

This split keeps write ownership clean:
- Plan 1 focuses on `packages/contracts`.
- Plan 2 focuses on `packages/frontend-core`.
- Plan 3 focuses on `apps/web` integration plus docs updates.

## Open Questions

1. **Should the resume source stay JSON or become TypeScript?**
   - What we know: agents benefit from a single structured source of truth.
   - Tradeoff: JSON stays content-oriented, while TypeScript makes typing easier.
   - Recommendation: keep a content-oriented source if practical, but require a typed package export either way.

2. **Should `frontend-core` expose just `themeManager` or a slightly broader theme API?**
   - What we know: current behavior needs initialization, persistence, and DOM class application.
   - Tradeoff: too small may leave app glue behind; too broad may create generic utility sprawl.
   - Recommendation: expose only the functions needed to fully remove app-local theme logic.

## Metadata

**Research scope:**
- workspace package extraction in a small frontend monorepo
- typed content boundaries
- shared frontend utility packaging
- brownfield migration order
- validation strategy for package migration

**Confidence breakdown:**
- Contracts package boundary: HIGH
- Frontend utility package boundary: HIGH
- Tooling continuity with npm workspaces: HIGH
- Exact parser implementation: MEDIUM

**Research date:** 2026-03-13
**Valid until:** 2026-04-13

---

*Phase: 02-shared-frontend-contracts*
*Research completed: 2026-03-13*
*Ready for planning: yes*
