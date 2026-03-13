# Phase 3: Agent Workflow Hardening - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Harden the new monorepo so multiple agents can work safely across `apps/`, `packages/`, and future domains without relying on human memory. This phase upgrades the root validation and CI surface to reflect the actual workspace structure, adds at least one smoke-level automated test path for the web app, and documents an operational git subtree workflow plus domain ownership rules.

</domain>

<decisions>
## Implementation Decisions

### Validation model
- Keep the repository entrypoint rooted at `package.json`; agents and humans should still be able to run one top-level validation command.
- Build on npm workspaces rather than changing package managers or adding a heavyweight task orchestrator in this phase.
- Treat shared packages as first-class validation targets instead of assuming the web app build is sufficient coverage.

### Test scope
- Add smoke-level automated coverage for the current frontend app before introducing deeper feature or backend work.
- Favor a lightweight browser-simulated test harness for this phase rather than full browser E2E infrastructure.
- Keep test scope focused on app boot, shared content rendering, and theme behavior.

### Agent workflow model
- Document subtree boundaries at the domain level (`apps/web`, `packages/contracts`, `packages/frontend-core`, future `services/*`, future `infra/*`).
- Make ownership and subtree rules repository-local and discoverable from root docs.
- Keep `.planning/` as planning memory, but put long-lived operational guidance in `docs/`.

### Claude's Discretion
- Exact root script names for workspace-aware validation.
- Exact test harness shape, as long as it runs from the repo root and protects the migrated frontend.
- Whether subtree workflow lives in `docs/monorepo.md` only or also gets a dedicated operational doc.

</decisions>

<specifics>
## Specific Ideas

- Root `npm run validate` still centers on docs, lint, the web app build, and static artifact validation. It does not yet explicitly validate the shared packages or smoke-test the app.
- `.github/workflows/ci.yml` still type-checks only `apps/web/tsconfig.json` and does not run any tests.
- `docs/monorepo.md` has high-level subtree guidance, but it does not yet describe an operational workflow for subtree add/pull/push or multi-agent ownership handoff.
- The repo already has clear package boundaries, so Phase 3 should harden feedback loops and collaboration rules rather than reshaping architecture again.

</specifics>

<code_context>
## Existing Code Insights

### Validation surface today
- Root scripts currently include `docs:validate`, `lint`, `build`, `preview`, and `validate`.
- Shared packages can be built in isolation, but those commands are not yet wired into the root command surface.
- Docs validation already enforces a concise `AGENTS.md` and a required set of docs.

### Best smoke-test targets
- `apps/web/src/App.tsx` is the composition root and simplest app-boot target.
- `apps/web/src/components/Header.tsx` exposes the theme toggle interaction.
- `apps/web/src/components/Footer.tsx` owns the scroll-based footer visibility and still carries the placeholder visitor-count behavior.

### Documentation gaps
- `docs/monorepo.md` explains subtree candidates conceptually, but not the workflow agents should follow.
- `packages/README.md` and `docs/README.md` still need Phase 2/Phase 3 truthfulness refreshes as operational guidance evolves.

</code_context>

<deferred>
## Deferred Ideas

- Implementing the real visitor-count backend or frontend API integration.
- Adding full Playwright-style browser automation.
- Introducing a more complex workspace orchestrator such as Turborepo or Nx.

</deferred>

---

*Phase: 03-agent-workflow-hardening*
*Context gathered: 2026-03-13*
