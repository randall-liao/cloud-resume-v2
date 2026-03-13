# Monorepo Boundaries

This document defines how `cloud-resume-v2` is partitioned for agent-first work.

## Active Workspace Model

- Workspace manager: npm workspaces
- Active app: `apps/web`
- Root scripts: run from the repository root and delegate into the active workspace

This repository is intentionally light right now. Only the frontend app is implemented. The other domain directories are present so agents do not have to infer where future work belongs.

## Domain Map

| Domain | Purpose | Current State |
| --- | --- | --- |
| `apps/` | Deployable runtime applications | `apps/web` is active |
| `packages/` | Shared code reused across domains | Active with frontend package boundaries |
| `packages/contracts/` | Shared schemas and typed resume content | Active |
| `packages/frontend-core/` | Shared browser-facing frontend runtime helpers | Active |
| `services/` | Future backend or serverless runtime code | Reserved |
| `infra/` | Future IaC and deployment definitions | Reserved |
| `docs/` | Canonical architecture and operating knowledge | Active |
| `.planning/` | Planning, execution, and memory artifacts | Active |

## Dependency Direction

Use these rules unless a future doc explicitly narrows them further:

1. `apps/` may depend on `packages/`.
2. `packages/` must not depend on `apps/`.
3. `services/` may depend on `packages/` and `packages/contracts/`.
4. `infra/` must not become a runtime dependency of `apps/` or `services/`.
5. `docs/` and `.planning/` describe domains but are not import targets.

## Agent Ownership Model

Prefer domain ownership over horizontal ownership.

- App-focused work: `apps/web`
- Shared contract work: `packages/contracts`
- Shared frontend runtime helper work: `packages/frontend-core`
- Backend or serverless work: `services/`
- Provisioning work: `infra/`
- Root navigation or policy work: `AGENTS.md`, `docs/`, root scripts, CI

When a task touches more than one domain, keep the coupling explicit in the plan and minimize overlap in unrelated files.

## Git Subtree Guidance

Treat git subtree boundaries as domain-level seams.

For the operational workflow, command examples, and sync rules, use [git_subtree.md](git_subtree.md). This document stays focused on the structural map.

### Good subtree candidates

- `apps/web`
- `packages/contracts`
- `packages/frontend-core`
- `services/<domain>`
- `infra/<domain>`

### Bad subtree candidates

- `docs/` by itself
- `.planning/`
- tiny helper-only folders with no independent lifecycle

The test is simple: if a directory does not have stable ownership and a coherent release cadence, it is a bad subtree boundary.

## Ownership Handoff Rules

- Prefer one primary owning domain per task, even when a change touches multiple files.
- If work spans multiple domains, document the coupling explicitly in the plan and keep the write set as small as possible.
- When a subtree candidate is modified in a way that changes ownership or sync expectations, update both this file and `docs/git_subtree.md` in the same change.

## Phase Notes

- Phase 1 establishes the workspace root and boundary docs.
- Phase 2 extracts real shared packages.
- Phase 3 hardened validation and multi-agent workflow guidance.

The current baseline is now in place. Next work should deepen package-level tests and future service contracts rather than reshaping the workspace again.

If the workspace tool changes later, update this document and the root scripts in the same change.
