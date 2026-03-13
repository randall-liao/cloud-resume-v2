# Git Subtree Workflow

This document describes how `cloud-resume-v2` should use `git subtree` for domain-level extraction or sync.

Use this only for domains with clear ownership and an independent lifecycle. If a directory does not have stable ownership and a coherent release cadence, it should not become a subtree.

## Current Subtree Candidates

| Directory | Why It Qualifies | Notes |
| --- | --- | --- |
| `apps/web` | Deployable runtime app with clear ownership | Best candidate for frontend-only extraction or sync |
| `packages/contracts` | Shared contract boundary with cross-domain potential | Keep browser-only code out of this package |
| `packages/frontend-core` | Shared frontend runtime helper boundary | Use only if it needs an independent sync lifecycle |
| `services/<domain>` | Future backend/runtime domain | Create only when a real service exists |
| `infra/<domain>` | Future IaC domain | Create only when a real infra module exists |

## Non-Candidates

Do not use subtree for:

- `docs/`
- `.planning/`
- tiny helper-only directories
- directories that exist only as placeholders with no active lifecycle

## Ownership Rules

- One subtree candidate should have one primary owning domain at a time.
- Cross-domain edits should be planned explicitly; do not let subtree usage become an excuse for broad unplanned writes.
- If a subtree boundary changes, update both [monorepo.md](monorepo.md) and this file in the same change.

## Operational Flow

### Add a subtree

Use this when importing an existing external repo into a domain boundary:

```bash
git subtree add --prefix=apps/web <remote> <branch> --squash
```

Replace:

- `apps/web` with the domain directory being managed
- `<remote>` with the subtree remote name or URL
- `<branch>` with the branch to import

### Pull updates into a subtree

Use this when the external subtree source has moved forward:

```bash
git subtree pull --prefix=apps/web <remote> <branch> --squash
```

### Push subtree changes out

Use this when the domain should publish changes back to its external subtree repo:

```bash
git subtree push --prefix=apps/web <remote> <branch>
```

## Agent Workflow Guidance

When a task involves subtree work:

1. Confirm the directory is a real subtree candidate from this document.
2. Confirm the owning domain and sync intent in the relevant plan or task context.
3. Prefer domain-level subtree operations only. Do not subtree individual files.
4. After subtree operations, run the normal repo validation flow before wrapping up.
5. Update docs if the subtree boundary, owner, or sync expectations changed.

## Choosing Between Normal Repo Work And Subtree Work

Use normal repo work when:

- the code still belongs to this repo as its primary source of truth
- the directory does not yet have an independent lifecycle
- the task is a small internal refactor

Use subtree when:

- the directory has a distinct owner or external sync source
- the domain will evolve semi-independently
- extraction or bidirectional sync is part of the task itself

## Safety Notes

- Always operate on a cleanly understood branch when doing subtree sync work.
- Prefer one subtree operation per PR unless the plan explicitly calls for more.
- Validate the repo after subtree operations so package wiring and docs do not drift.
