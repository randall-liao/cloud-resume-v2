# Agent-First Gap Analysis

> Updated: 2026-05-26
> Scope: backlog after Phase 3 workflow hardening

## Summary

Phase 1, Phase 2, and Phase 3 are now structurally in place, and key gaps in test coverage and visitor count controls have been resolved:

- `AGENTS.md` is present
- `docs/` is the system of record
- CI validates docs, lint, build, and static artifact shape
- plans are versioned under `docs/plans/`
- `packages/contracts` owns typed resume content (covered by unit tests)
- `packages/frontend-core` owns shared browser-facing theme behavior (covered by unit tests)
- CI validates workspace builds, smoke/component tests, and static artifact integrity
- `docs/git_subtree.md` now captures the operational subtree workflow
- Feature flag control is implemented for visitor counter display

The remaining gaps are no longer about missing scaffolding. They are about increasing agent autonomy on top of that foundation.

## Current Priority Backlog

| Priority | Gap | Why It Matters | Suggested Next Step |
| --- | --- | --- | --- |
| 🟠 P1 | Branch protection not confirmed from local context | CI gates are only as strong as repository protection | Confirm branch protection in GitHub |
| 🟡 P2 | Imported skills remain partly generic | Agents can still be misled by repo-external assumptions | Adapt or prune non-repo-fitted imported skills |
| 🟡 P2 | No bundle-size budget | Static hosting constraints are validated only qualitatively | Add a lightweight size budget check if bundle growth becomes a problem |

## Agent Tooling Notes

- Stitch MCP is the only MCP integration configured in `.agent/mcp.json`.
- Repo-local workflows are useful, but imported skills such as Remotion and shadcn should be treated as optional setup paths, not default capabilities.

## Next Exit Criteria

The next hardening increment should be considered complete when:

- [x] visitor count behavior is implemented (via feature flag)
- [x] extracted package boundaries have dedicated regression coverage
- [x] agent tooling advertised in `AGENTS.md` matches what the repo actually provisions
- [ ] branch protection is confirmed against the active GitHub repository settings

