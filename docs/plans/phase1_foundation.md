# Execution Plan: Phase 1 — Agent-First Foundation

> Status: ✅ COMPLETE
> Scope: documentation, scaffolding, validation, and dependency alignment
> Started: 2026-03-12
> Audited / Corrected: 2026-03-13

## Objective

Transform this repository into a truthful Phase 1 agent-first foundation modeled on the OpenAI article:

- a canonical short agent map
- a repository-local knowledge base under `docs/`
- plans tracked as first-class artifacts
- mechanical validation for docs and build scaffolding

## Key Decisions

| Decision | Rationale |
| --- | --- |
| Add `AGENTS.md` and keep `AGENT.md` as a shim | Aligns with standard agent discovery without breaking legacy probes |
| Add docs validation to CI | The knowledge map should be mechanically checked, not trusted by prose alone |
| Remove unused MUI and Emotion dependencies | The installed dependency set should match the actual Tailwind-only runtime model |
| Keep `.env.example` as future scaffold only | The visitor-counter API is not implemented yet, so the env file must be described honestly |
| Advertise only repo-fitted agent tooling by default | Imported generic skills should not be presented as turnkey capabilities |

## Deliverables

### Added

- `AGENTS.md`
- `docs/README.md`
- `scripts/validate-docs.mjs`

### Updated

- `AGENT.md`
- `README.md`
- `index.html`
- `.env.example`
- `.eslintrc.cjs`
- `.github/workflows/ci.yml`
- `scripts/validate-dist.sh`
- `docs/architecture.md`
- `docs/quality_standards.md`
- `docs/principles.md`
- `docs/quality.md`
- `docs/plans/agent_gap_analysis.md`
- `.agent/workflows/doc-gardening.md`
- `.agent/workflows/lgtm-create-pr.md`
- selected imported skill docs with broken references

### Aligned

- `package.json`
- `package-lock.json`

## Exit Criteria

- [x] Canonical `AGENTS.md` exists
- [x] `docs/` acts as the system of record
- [x] Plans live under `docs/plans/`
- [x] Docs map is mechanically validated
- [x] CI validates docs, lint, build, and static artifact shape
- [x] Foundation docs match the actual repo state

## Remaining Backlog

See [agent_gap_analysis.md](agent_gap_analysis.md). The highest-value next steps are:

1. Add a smoke test suite.
2. Add dedicated regression coverage for the extracted shared packages.
3. Replace the static footer visitor count with a fail-safe integration.
4. Confirm branch protection outside the local repo.
5. Adapt or prune imported generic skills that remain repo-misaligned.
