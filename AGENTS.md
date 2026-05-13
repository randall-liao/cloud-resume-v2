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
| Documentation map and update rules | [`docs/AGENTS.md`](docs/AGENTS.md) |
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


## Subdomain Agents

- [Infra Domain](./infra/AGENTS.md)
- [.Agent Skills Shadcn-Ui Domain](./.agent/skills/shadcn-ui/AGENTS.md)
- [.Agent Skills Stitch-Loop Domain](./.agent/skills/stitch-loop/AGENTS.md)
- [.Agent Skills Enhance-Prompt Domain](./.agent/skills/enhance-prompt/AGENTS.md)
- [.Agent Skills React-Components Domain](./.agent/skills/react-components/AGENTS.md)
- [.Agent Skills Remotion Domain](./.agent/skills/remotion/AGENTS.md)
- [.Agent Skills Design-Md Domain](./.agent/skills/design-md/AGENTS.md)
- [Services Domain](./services/AGENTS.md)
- [Packages Domain](./packages/AGENTS.md)
- [Packages Frontend-Core Domain](./packages/frontend-core/AGENTS.md)
- [Packages Contracts Domain](./packages/contracts/AGENTS.md)
- [Apps Domain](./apps/AGENTS.md)

## Planning and External files Reference (to suppress orphaned files warnings)
- [.agent/skills/design-md/SKILL.md](.agent/skills/design-md/SKILL.md)
- [.agent/skills/design-md/examples/DESIGN.md](.agent/skills/design-md/examples/DESIGN.md)
- [.agent/skills/enhance-prompt/SKILL.md](.agent/skills/enhance-prompt/SKILL.md)
- [.agent/skills/enhance-prompt/references/KEYWORDS.md](.agent/skills/enhance-prompt/references/KEYWORDS.md)
- [.agent/skills/react-components/SKILL.md](.agent/skills/react-components/SKILL.md)
- [.agent/skills/react-components/resources/architecture-checklist.md](.agent/skills/react-components/resources/architecture-checklist.md)
- [.agent/skills/react-components/resources/stitch-api-reference.md](.agent/skills/react-components/resources/stitch-api-reference.md)
- [.agent/skills/remotion/resources/composition-checklist.md](.agent/skills/remotion/resources/composition-checklist.md)
- [.agent/skills/shadcn-ui/SKILL.md](.agent/skills/shadcn-ui/SKILL.md)
- [.agent/skills/shadcn-ui/resources/migration-guide.md](.agent/skills/shadcn-ui/resources/migration-guide.md)
- [.agent/skills/shadcn-ui/resources/setup-guide.md](.agent/skills/shadcn-ui/resources/setup-guide.md)
- [.agent/skills/stitch-loop/examples/SITE.md](.agent/skills/stitch-loop/examples/SITE.md)
- [.agent/skills/stitch-loop/examples/next-prompt.md](.agent/skills/stitch-loop/examples/next-prompt.md)
- [.agent/skills/stitch-loop/resources/baton-schema.md](.agent/skills/stitch-loop/resources/baton-schema.md)
- [.agent/skills/stitch-loop/resources/site-template.md](.agent/skills/stitch-loop/resources/site-template.md)
- [.agent/skills/wsl-browser-bridge/SKILL.md](.agent/skills/wsl-browser-bridge/SKILL.md)
- [.planning/PROJECT.md](.planning/PROJECT.md)
- [.planning/codebase/ARCHITECTURE.md](.planning/codebase/ARCHITECTURE.md)
- [.planning/codebase/CONCERNS.md](.planning/codebase/CONCERNS.md)
- [.planning/codebase/CONVENTIONS.md](.planning/codebase/CONVENTIONS.md)
- [.planning/codebase/INTEGRATIONS.md](.planning/codebase/INTEGRATIONS.md)
- [.planning/codebase/STACK.md](.planning/codebase/STACK.md)
- [.planning/codebase/STRUCTURE.md](.planning/codebase/STRUCTURE.md)
- [.planning/codebase/TESTING.md](.planning/codebase/TESTING.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-01-PLAN.md](.planning/phases/01-monorepo-workspace-foundation/01-01-PLAN.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-01-SUMMARY.md](.planning/phases/01-monorepo-workspace-foundation/01-01-SUMMARY.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-02-PLAN.md](.planning/phases/01-monorepo-workspace-foundation/01-02-PLAN.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-02-SUMMARY.md](.planning/phases/01-monorepo-workspace-foundation/01-02-SUMMARY.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-03-PLAN.md](.planning/phases/01-monorepo-workspace-foundation/01-03-PLAN.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-03-SUMMARY.md](.planning/phases/01-monorepo-workspace-foundation/01-03-SUMMARY.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-CONTEXT.md](.planning/phases/01-monorepo-workspace-foundation/01-CONTEXT.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-RESEARCH.md](.planning/phases/01-monorepo-workspace-foundation/01-RESEARCH.md)
- [.planning/phases/01-monorepo-workspace-foundation/01-VALIDATION.md](.planning/phases/01-monorepo-workspace-foundation/01-VALIDATION.md)
- [.planning/phases/02-shared-frontend-contracts/02-01-PLAN.md](.planning/phases/02-shared-frontend-contracts/02-01-PLAN.md)
- [.planning/phases/02-shared-frontend-contracts/02-01-SUMMARY.md](.planning/phases/02-shared-frontend-contracts/02-01-SUMMARY.md)
- [.planning/phases/02-shared-frontend-contracts/02-02-PLAN.md](.planning/phases/02-shared-frontend-contracts/02-02-PLAN.md)
- [.planning/phases/02-shared-frontend-contracts/02-02-SUMMARY.md](.planning/phases/02-shared-frontend-contracts/02-02-SUMMARY.md)
- [.planning/phases/02-shared-frontend-contracts/02-03-PLAN.md](.planning/phases/02-shared-frontend-contracts/02-03-PLAN.md)
- [.planning/phases/02-shared-frontend-contracts/02-03-SUMMARY.md](.planning/phases/02-shared-frontend-contracts/02-03-SUMMARY.md)
- [.planning/phases/02-shared-frontend-contracts/02-CONTEXT.md](.planning/phases/02-shared-frontend-contracts/02-CONTEXT.md)
- [.planning/phases/02-shared-frontend-contracts/02-RESEARCH.md](.planning/phases/02-shared-frontend-contracts/02-RESEARCH.md)
- [.planning/phases/02-shared-frontend-contracts/02-VALIDATION.md](.planning/phases/02-shared-frontend-contracts/02-VALIDATION.md)
- [.planning/phases/03-agent-workflow-hardening/03-01-PLAN.md](.planning/phases/03-agent-workflow-hardening/03-01-PLAN.md)
- [.planning/phases/03-agent-workflow-hardening/03-01-SUMMARY.md](.planning/phases/03-agent-workflow-hardening/03-01-SUMMARY.md)
- [.planning/phases/03-agent-workflow-hardening/03-02-PLAN.md](.planning/phases/03-agent-workflow-hardening/03-02-PLAN.md)
- [.planning/phases/03-agent-workflow-hardening/03-02-SUMMARY.md](.planning/phases/03-agent-workflow-hardening/03-02-SUMMARY.md)
- [.planning/phases/03-agent-workflow-hardening/03-03-PLAN.md](.planning/phases/03-agent-workflow-hardening/03-03-PLAN.md)
- [.planning/phases/03-agent-workflow-hardening/03-03-SUMMARY.md](.planning/phases/03-agent-workflow-hardening/03-03-SUMMARY.md)
- [.planning/phases/03-agent-workflow-hardening/03-CONTEXT.md](.planning/phases/03-agent-workflow-hardening/03-CONTEXT.md)
- [.planning/phases/03-agent-workflow-hardening/03-RESEARCH.md](.planning/phases/03-agent-workflow-hardening/03-RESEARCH.md)
- [.planning/phases/03-agent-workflow-hardening/03-VALIDATION.md](.planning/phases/03-agent-workflow-hardening/03-VALIDATION.md)
- [.planning/v1.0-MILESTONE-AUDIT.md](.planning/v1.0-MILESTONE-AUDIT.md)
- [learn/FRONTEND_ARCHITECTURE_ROADMAP.md](learn/FRONTEND_ARCHITECTURE_ROADMAP.md)
