# Phase 1: Monorepo Workspace Foundation - Research

**Researched:** 2026-03-13
**Domain:** Brownfield frontend monorepo foundation for agent-first development
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use a conventional monorepo layout centered on `apps/` and `packages/`.
- Reserve explicit workspace locations for future platform domains such as `services/` and `infra/`, but keep them scaffold-only in this phase.
- Keep `docs/` as the canonical architecture and operations knowledge base from the repo root.
- This phase is frontend refactoring and repository architecture only.
- The current web app must remain the only deployable runtime application after the move.
- Backend, database, and IaC implementation are deferred to later phases.
- Optimize boundaries so multiple agents can work on app, package, tooling, and future platform domains with minimal overlap.
- Encode monorepo navigation in root docs rather than relying on chat-only explanations.
- Document how git subtree should map to major repository domains as part of the repo architecture.

### Claude's Discretion
- Exact workspace package manager and task-runner selection.
- Exact names of shared packages introduced by the move.
- Whether future placeholder domains are empty directories, documented stubs, or both.

### Deferred Ideas (OUT OF SCOPE)
- Implementing the visitor-count backend and any frontend API client.
- Creating the database contract or infrastructure code itself.
- Major UI redesign, routing changes, or multi-app product expansion.

</user_constraints>

<research_summary>
## Summary

This phase should be planned as a structural migration, not a feature build. The current repo is small, so the safest strategy is to create a minimal monorepo root, move the existing SPA into a single app workspace, and only introduce package boundaries that are already visible in the brownfield code: content/data, theme/utilities, and shared repo tooling.

For the root workspace choice, `pnpm` workspaces are the strongest default for this repo because they provide deterministic installs, first-class filtering, and a simple mental model for agents. A dedicated build orchestrator such as Turborepo is not necessary in Phase 1; root scripts plus workspace filters are enough while there is still only one live app. Add a runner later only if CI time or cross-package caching becomes a real bottleneck.

**Primary recommendation:** Plan Phase 1 around a light `pnpm` workspace root with `apps/web` as the only live app, documented placeholder domains for `services/` and `infra/`, and root docs/CI updates that teach agents where each domain belongs.
</research_summary>

## Recommended Repository Shape

```text
cloud-resume-v2/
├── apps/
│   └── web/                # current Vite SPA
├── packages/
│   ├── content/            # future typed resume content boundary
│   └── frontend-core/      # future shared theme/utilities seam
├── services/               # future serverless/backend domains (placeholder in Phase 1)
├── infra/                  # future IaC domains (placeholder in Phase 1)
├── docs/                   # canonical system of record
├── .planning/              # planning and execution artifacts
├── AGENTS.md               # root routing layer for agents
└── package.json            # workspace root scripts
```

Why this shape fits the current repo:
- `src/data/resume.json` is already a visible content boundary.
- `src/utils/themeManager.ts` is already a visible shared-utility boundary.
- The app is still a single runtime, so `apps/web` is enough for now.
- Future platform domains get first-class placement without forcing premature implementation.

## Tooling Recommendation

### Workspace manager

**Recommended:** `pnpm` workspaces

Why:
- Strong workspace semantics for `apps/` and `packages/`
- Fast filtered commands for agents (`--filter`)
- Clear lockfile and dependency graph behavior
- Good fit for repo-wide root scripts

**Acceptable fallback:** npm workspaces

Why it is second-best here:
- It reduces tool churn from the current repo
- But workspace ergonomics and filtering are weaker for multi-agent workflows

### Task orchestration

**Recommended in Phase 1:** root package scripts only

Why:
- One app and a few packages do not justify extra orchestration complexity yet
- Agents can still use consistent root commands: install, dev, build, validate
- Introducing Turborepo or Nx before there is real cross-package work mostly adds configuration surface

**Defer until later:** Turborepo/Nx

Trigger to add later:
- multiple real packages with separate build/test steps
- CI runtime becomes a problem
- remote caching provides measurable value

## Brownfield Migration Sequencing

### Sequence to prefer

1. Create workspace root config and move the current app into `apps/web` with minimal code changes.
2. Restore root-level developer ergonomics through scripts and documentation.
3. Update CI and validation paths to the new topology.
4. Add placeholder domain boundaries for `services/` and `infra/`.
5. Defer package extraction (`packages/content`, `packages/frontend-core`) to Phase 2.

### Why this order matters

- Moving the web app first preserves a working runtime early.
- Deferring package extraction avoids mixing structural migration with behavior-changing contract work.
- Docs and CI must move in the same phase as the directory change or agents will follow stale paths.

## Git Subtree Implications

Treat git subtree boundaries as domain-level seams, not per-file or per-tiny-package seams.

Recommended future subtree candidates:
- `apps/web`
- `packages/content`
- `packages/frontend-core`
- `services/<domain>`
- `infra/<domain>`

Do not use subtree boundaries for:
- `docs/` alone
- `.planning/`
- tiny helper-only folders with no standalone lifecycle

Why:
- Subtree works best when the extracted directory has stable ownership and coherent lifecycle.
- Over-splitting creates more sync overhead than collaboration benefit.

## Docs And CI Considerations

Phase 1 must update all root navigation artifacts together:
- `AGENTS.md`
- `README.md`
- `docs/architecture.md`
- `docs/quality_standards.md`
- CI workflow paths
- validation scripts that assume `src/` and `dist/` live at repo root

The doc changes are not cleanup; they are part of the architecture move. If root docs still describe a single-package layout after the move, the agent system becomes misleading immediately.

## Common Pitfalls

### Pitfall 1: Forcing package extraction too early
- What goes wrong: app relocation, shared-package extraction, and behavior cleanup all happen in one pass.
- Why it happens: monorepo work is mistaken for "move everything into packages now."
- How to avoid: keep Phase 1 focused on workspace topology and app relocation only.
- Warning signs: large file churn across app code, theme code, and data access in the same plan.

### Pitfall 2: Leaving root scripts and CI in a half-migrated state
- What goes wrong: the new directory layout exists, but build or validation commands still point to old root paths.
- Why it happens: structure changes are treated separately from operational changes.
- How to avoid: make root command restoration a first-class plan in this phase.
- Warning signs: `npm run validate` or CI references root `src/` and `dist/` directly after the move.

### Pitfall 3: Creating empty future domains with no rules
- What goes wrong: `services/` and `infra/` appear, but agents do not know what belongs there or how those domains may depend on the frontend.
- Why it happens: placeholder folders are created without ownership and dependency guidance.
- How to avoid: document each placeholder domain and its allowed relationship to apps/packages.
- Warning signs: docs mention future backend/IaC without a concrete repository location or dependency policy.

## Planning Implications

The phase should probably split into three plans:

1. Workspace root plus app move
2. Root docs, scripts, and CI rewiring
3. Domain ownership plus future platform boundary documentation

Those plans map cleanly to the roadmap and reduce file overlap:
- Plan 1 owns package-manager/workspace config and app relocation.
- Plan 2 owns root operational files.
- Plan 3 owns agent maps and future-boundary docs.

## Validation Architecture

Phase 1 does not need a full test framework yet, but it does need deterministic structural validation from the monorepo root.

Recommended validation model for this phase:
- Keep a single root `validate` command as the human and agent entrypoint.
- Ensure the root command fans into workspace-aware docs validation, lint, and build commands.
- Add targeted app-level build verification for `apps/web`.
- Keep artifact validation for the deployed frontend, but update it to point at the app workspace output.

Recommended command shape after the migration:
- Quick structural check: `pnpm validate`
- Targeted app build: `pnpm --filter web build`
- Targeted docs check: `pnpm docs:validate`

Manual checks still needed in this phase:
- the web app boots locally from its new workspace
- the production build still emits a deployable static artifact
- root docs point to the new locations

## Open Questions

1. **Should Phase 1 switch from npm to pnpm immediately?**
   - What we know: `pnpm` is the cleaner fit for workspaces and filtered multi-agent commands.
   - What's unclear: whether the user prefers minimum tool churn or best-fit workspace ergonomics.
   - Recommendation: default to `pnpm` unless there is a strong reason to preserve npm.

2. **Should placeholder future domains be committed as empty directories or documented stubs with README files?**
   - What we know: empty directories alone communicate less to agents.
   - What's unclear: how much scaffolding the user wants before those domains become active.
   - Recommendation: prefer README-backed stubs or `.gitkeep` plus doc references so the boundaries are visible in Git and agent context.

## Metadata

**Research scope:**
- brownfield frontend monorepo structure
- workspace tooling selection
- migration sequencing
- git subtree boundary strategy
- validation changes implied by the move

**Confidence breakdown:**
- Workspace topology: HIGH - strongly supported by current repo shape
- Tooling recommendation: MEDIUM - best-practice inference, not user-mandated
- Migration sequencing: HIGH - directly derived from current brownfield risks
- Git subtree guidance: MEDIUM-HIGH - structurally sound, but exact future extraction needs may evolve

**Research date:** 2026-03-13
**Valid until:** 2026-04-13

---

*Phase: 01-monorepo-workspace-foundation*
*Research completed: 2026-03-13*
*Ready for planning: yes*
