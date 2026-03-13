# Phase 3: Agent Workflow Hardening - Research

**Researched:** 2026-03-13
**Domain:** Workspace-aware validation, smoke coverage, and subtree workflow hardening
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Keep the repo entrypoint rooted at `package.json`.
- Build on npm workspaces instead of changing package managers or adding a heavyweight task orchestrator.
- Treat shared packages as first-class validation targets.
- Add smoke-level automated coverage for the current frontend app before deeper expansion.
- Favor a lightweight browser-simulated test harness over full browser E2E infrastructure in this phase.
- Document subtree boundaries and ownership rules as repository-local operational knowledge.

### Claude's Discretion
- Exact root script names for validation.
- Exact test harness shape.
- Whether subtree workflow gets a dedicated doc.

### Deferred Ideas (OUT OF SCOPE)
- Visitor-count backend or API integration
- Full browser E2E automation
- Turborepo or Nx adoption

</user_constraints>

<research_summary>
## Summary

Phase 3 should harden the repo around the architecture that already exists rather than adding new architecture. The current gap is not boundary clarity anymore; it is feedback-loop depth. The strongest plan is:

1. make the root command surface explicitly package-aware
2. add a lightweight smoke test harness for `apps/web`
3. document the subtree and ownership workflow agents should follow when domains start splitting further

For test tooling, Vitest plus React Testing Library is the right fit for this repo now. It runs quickly inside the existing Vite/TypeScript stack, adds minimal configuration surface, and is enough to protect app boot plus a couple of critical UI behaviors. Playwright would be stronger later, but it is unnecessary to satisfy the current roadmap and would add more operational weight than value at this stage.

For validation, explicit root scripts are better than clever workspace fan-out. Agents benefit from readable command names such as `build:packages`, `build:web`, `test`, and `validate`. CI should use the same root scripts wherever possible so local and CI behavior stay aligned.

For subtree guidance, the repo should have one canonical operational document that covers:
- candidate domain boundaries
- command examples (`git subtree add`, `pull`, `push`)
- ownership expectations
- when subtree is appropriate versus overkill

`docs/monorepo.md` should remain the high-level boundary map, while a dedicated subtree workflow document can hold the command-level operational detail.
</research_summary>

## Validation Recommendation

### Root script surface

Recommended direction:

- `build:packages` — build shared packages explicitly
- `build:web` — build the web app explicitly
- `test` or `test:smoke` — run the web smoke suite
- `validate` — docs validation, lint, package builds, app build, smoke tests, and dist validation

Why:
- explicit commands are easier for agents to discover and debug
- local and CI behavior stay aligned
- the repo stops assuming the web app is the only thing worth validating

### CI direction

Recommended direction:

- keep docs validation separate and explicit
- run root scripts instead of one-off app-specific commands where possible
- add a dedicated test step once the smoke suite exists

Do not:
- keep app-only `tsc -p apps/web/tsconfig.json --noEmit` as the main type-check story once shared packages are real
- let CI validate only the app while ignoring package boundaries

## Smoke Test Recommendation

### Framework

**Recommended:** Vitest + React Testing Library + jsdom

Why:
- minimal friction with Vite
- fast local execution
- enough fidelity for component rendering and light DOM behavior
- good fit for root-run smoke coverage

### Minimal behavior targets

At least one smoke path should prove:

1. the app renders key content from `@cloud-resume-v2/contracts`
2. the theme toggle still updates persisted theme state and the root `dark` class

Optional but useful:
- footer visibility behavior under scroll events

### What not to do

- do not start with Playwright if the only required protection is boot + theme + content rendering
- do not add a broad unit-test sprawl before a small reliable smoke path exists

## Subtree Workflow Recommendation

### Best documentation shape

Keep two layers:

- `docs/monorepo.md` — stable map of boundaries and ownership
- `docs/git_subtree.md` — operational workflow, command examples, and subtree rules

Why:
- boundary guidance and command workflow age differently
- agents need a short map first and deeper procedural detail second

### Good subtree candidates

- `apps/web`
- `packages/contracts`
- `packages/frontend-core`
- `services/<domain>`
- `infra/<domain>`

### Poor subtree candidates

- `docs/` alone
- `.planning/`
- tiny helper folders with no lifecycle of their own

## Planning Implications

The roadmap split remains correct:

1. `03-01`: make root validation and CI workspace-aware
2. `03-02`: add smoke tests for the migrated web app
3. `03-03`: document git subtree workflow and multi-agent ownership rules

This order is important:
- validation scripts and CI should understand the workspace before tests are added to them
- docs about subtree and ownership should describe the hardened command surface, not the pre-hardening state

## Open Questions

1. **Should the root test script be `test` or `test:smoke`?**
   - Recommendation: use `test` for the current primary suite and document that it is smoke-level today.

2. **Should package-specific tests be added in Phase 3 or later?**
   - Recommendation: prioritize the roadmap requirement first with app smoke coverage. If package-specific tests fit naturally into the same Vitest setup without broadening scope too much, include them opportunistically later.

## Metadata

**Research scope:**
- workspace-aware root validation
- CI alignment
- Vite-compatible smoke testing
- git subtree workflow documentation
- multi-agent ownership guidance

**Confidence breakdown:**
- root validation/CI hardening: HIGH
- Vitest + RTL smoke coverage: HIGH
- dedicated subtree workflow doc: HIGH
- package-specific test expansion: MEDIUM

**Research date:** 2026-03-13
**Valid until:** 2026-04-13

---

*Phase: 03-agent-workflow-hardening*
*Research completed: 2026-03-13*
*Ready for planning: yes*
