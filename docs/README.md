# Documentation Index

`docs/` is the system of record for `cloud-resume-v2`.

Agents should start at [AGENTS.md](../AGENTS.md), then use this directory as the deeper source of truth for structure, standards, quality, and plans.

## Read Order

1. [AGENTS.md](../AGENTS.md)
2. [architecture.md](architecture.md)
3. [monorepo.md](monorepo.md)
4. [git_subtree.md](git_subtree.md)
5. [quality_standards.md](quality_standards.md)
6. [principles.md](principles.md)
7. [quality.md](quality.md)
8. [plans/phase1_foundation.md](plans/phase1_foundation.md)
9. [plans/agent_gap_analysis.md](plans/agent_gap_analysis.md)

## Catalog

| File | Role | Validation / Update Trigger |
| --- | --- | --- |
| [architecture.md](architecture.md) | Real repository map, runtime data flow, and dependency inventory | Update when app structure, hosting assumptions, or dependencies change |
| [monorepo.md](monorepo.md) | Domain boundaries, ownership rules, and subtree guidance | Update when workspace boundaries or domain ownership change |
| [git_subtree.md](git_subtree.md) | Operational subtree workflow and sync rules | Update when subtree candidates, ownership, or command flow changes |
| [quality_standards.md](quality_standards.md) | Coding conventions and review expectations | Update when standards change or new repo norms are adopted |
| [principles.md](principles.md) | Mechanically enforced rules and clearly marked non-enforced principles | Update whenever lint, CI, or validation gates change |
| [quality.md](quality.md) | Domain grades and technical debt register | Update when quality gates, tests, or structural debt change |
| [plans/phase1_foundation.md](plans/phase1_foundation.md) | Completed Phase 1 foundation record | Update when Phase 1 scaffolding is corrected or extended |
| [plans/agent_gap_analysis.md](plans/agent_gap_analysis.md) | Live backlog after the completed foundation phases | Update as gaps are closed or reprioritized |

## Freshness Rules

- When repository structure or constraints change, update the relevant doc in the same PR.
- When enforcement changes, update both [principles.md](principles.md) and [quality.md](quality.md).
- Plans under `docs/plans/` are first-class artifacts. Mark completed work honestly and keep the backlog current.
- Run `npm run docs:validate` after editing markdown. CI runs the same validation.
