# AGENTS.md - cloud-resume-v2

This file is the routing layer for coding agents working in this repository.
Keep it short. Use it to find the source of truth, not to duplicate it.

## Operating Model

- Humans steer. Agents execute.
- Repository-local artifacts are authoritative. If it is not in the repo, it does not exist to the agent.
- Prefer small, reviewable changes with a narrow blast radius.
- Before wrapping up, run `npm run validate`.

## Boot The Repo

```bash
npm install
npm run dev
npm run validate
```

The active runtime app lives in `apps/web`. Shared frontend boundaries live in `packages/contracts` and `packages/frontend-core`. `.env.example` is reserved for planned visitor-counter API work. The current app builds without any environment variables.

## Read Order

| Need | File |
| --- | --- |
| Documentation map and update rules | [`docs/README.md`](docs/README.md) |
| Runtime architecture and repository layout | [`docs/architecture.md`](docs/architecture.md) |
| Workspace boundary rules | [`docs/monorepo.md`](docs/monorepo.md) |
| Git subtree workflow and ownership handoff rules | [`docs/git_subtree.md`](docs/git_subtree.md) |
| Coding conventions and review expectations | [`docs/quality_standards.md`](docs/quality_standards.md) |
| Mechanically enforced invariants | [`docs/principles.md`](docs/principles.md) |
| Current domain grades and debt register | [`docs/quality.md`](docs/quality.md) |
| Completed Phase 1 foundation record | [`docs/plans/phase1_foundation.md`](docs/plans/phase1_foundation.md) |
| Remaining backlog after Phase 1 | [`docs/plans/agent_gap_analysis.md`](docs/plans/agent_gap_analysis.md) |
| Visual design language | [`DESIGN.md`](DESIGN.md) |
| Human-facing project overview | [`README.md`](README.md) |

## Agent Assets

| Status | Asset | Purpose |
| --- | --- | --- |
| Ready | [`.agent/workflows/doc-gardening.md`](.agent/workflows/doc-gardening.md) | Refresh docs, grades, and plan status |
| Ready | [`.agent/workflows/lgtm-create-pr.md`](.agent/workflows/lgtm-create-pr.md) | Wrap up work, validate, and open a PR |
| Ready | [`.agent/skills/code_review/SKILL.md`](.agent/skills/code_review/SKILL.md) | Repo-specific review guidance |
| Optional | [`.agent/mcp.json`](.agent/mcp.json) | Only Stitch MCP is configured in this repo |
| Optional | Stitch-related imported skills under [`.agent/skills/`](.agent/skills/) | Use only when the task clearly needs them and their prerequisites are present |

Treat Remotion, shadcn, and WSL bridge skills as opt-in tooling. They are not part of the default Phase 1 foundation and may require extra local setup beyond what this repo provisions.

## CI-Gated Rules

- No routing libraries (`react-router-dom`, `react-router`, `@tanstack/router`)
- No global state managers (`redux`, `zustand`, `jotai`, `recoil`, `mobx`)
- No MUI layout imports or `sx` prop
- No committed AWS secrets
- Root scripts must operate through the workspace root, not by assuming app files live at repo root
- Domain-level subtree workflow lives in `docs/git_subtree.md`; use it when a task involves extraction, sync, or external domain ownership
- `AGENTS.md`, core docs, and markdown links must validate
- Production build and static artifact checks must pass

## Compatibility

[`AGENT.md`](AGENT.md) remains as a short shim for tools that still probe the legacy filename. The canonical entrypoint is this file.
