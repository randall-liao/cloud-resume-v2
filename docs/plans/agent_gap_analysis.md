# Agent-First Gap Analysis

> Updated: 2026-03-13
> Scope: backlog after Phase 3 workflow hardening

## Summary

Phase 1, Phase 2, and Phase 3 are now structurally in place:

- `AGENTS.md` is present
- `docs/` is the system of record
- CI validates docs, lint, build, and static artifact shape
- plans are versioned under `docs/plans/`
- `packages/contracts` owns typed resume content
- `packages/frontend-core` owns shared browser-facing theme behavior
- CI validates workspace builds, smoke tests, and static artifact integrity
- `docs/git_subtree.md` now captures the operational subtree workflow

The remaining gaps are no longer about missing scaffolding. They are about increasing agent autonomy on top of that foundation.

## Current Priority Backlog

| Priority | Gap | Why It Matters | Suggested Next Step |
| --- | --- | --- | --- |
| 🟠 P1 | Static footer visitor count | Docs and UI still diverge from the planned serverless integration story | Implement a fail-safe client fetch backed by `VITE_VISITOR_API_URL` |
| 🟠 P1 | Smoke coverage is narrow | Agents can prove app boot and theme behavior, but not broader user-visible flows | Expand the current Vitest + RTL suite to cover footer and key section rendering paths |
| 🟠 P1 | No dedicated tests around extracted shared packages | The new package seams are real, but only full-build validation protects them today | Add focused tests for `packages/contracts` and `packages/frontend-core` |
| 🟠 P1 | Branch protection not confirmed from local context | CI gates are only as strong as repository protection | Confirm branch protection in GitHub |
| 🟡 P2 | Imported skills remain partly generic | Agents can still be misled by repo-external assumptions | Adapt or prune non-repo-fitted imported skills |
| 🟡 P2 | No bundle-size budget | Static hosting constraints are validated only qualitatively | Add a lightweight size budget check if bundle growth becomes a problem |

## Agent Tooling Notes

- Stitch MCP is the only MCP integration configured in `.agent/mcp.json`.
- Repo-local workflows are useful, but imported skills such as Remotion and shadcn should be treated as optional setup paths, not default capabilities.

## Next Exit Criteria

The next hardening increment should be considered complete when:

- visitor count behavior is implemented or explicitly removed from the UI
- extracted package boundaries have dedicated regression coverage
- agent tooling advertised in `AGENTS.md` matches what the repo actually provisions
- branch protection is confirmed against the active GitHub repository settings
