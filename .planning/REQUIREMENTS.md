# Requirements: cloud-resume-v2

**Defined:** 2026-03-13
**Core Value:** Agents must be able to evolve the web app and future platform domains in parallel through clear repository boundaries, explicit contracts, and workspace-level tooling that preserves a working deployable frontend.

## v1 Requirements

### Workspace

- [x] **WS-01**: Root repository commands run through a workspace-aware package manager and operate from the monorepo root.
- [x] **WS-02**: The existing frontend app moves into a dedicated app workspace without changing its static deploy model.
- [x] **WS-03**: Shared frontend code lives under `packages/` with explicit dependency direction from apps to packages.

### Agent Architecture

- [x] **AGT-01**: The monorepo documents clear ownership boundaries for `apps/`, `packages/`, and future platform domains so agents can work with minimal overlap.
- [x] **AGT-02**: A git subtree strategy is documented for future extraction or sync of major repository domains.
- [x] **AGT-03**: Root agent maps and docs route agents to the correct monorepo source of truth.

### Frontend Contracts

- [x] **FE-01**: Resume content is accessed through a typed boundary instead of direct leaf JSON imports.
- [x] **FE-02**: Shared frontend concerns such as theme or reusable utilities are exposed through package-level APIs.

### Validation

- [x] **VAL-01**: Root validation and CI run workspace-aware docs, lint, and build tasks.
- [x] **VAL-02**: The migrated web app has at least a smoke-level automated test path protecting the refactor.

### Cleanup And Governance

- [ ] **CLN-01**: Validation artifacts and root docs describe the actual npm-based workflow and current `npm run validate` surface truthfully.
- [ ] **CLN-02**: Extracted shared packages have direct regression tests that can run from the repo root or CI.
- [ ] **CLN-03**: Smoke coverage protects at least one currently untested user-visible flow beyond app boot and theme toggle.
- [ ] **CLN-04**: User-facing footer metrics copy does not imply a live backend without a real integration.
- [ ] **CLN-05**: Merge-safety governance for the repo is documented and externally confirmable, including branch protection expectations.

### Future Platform Readiness

- [x] **ARCH-01**: The monorepo reserves and documents workspace boundaries for future serverless backend, database-contract, and infrastructure code without implementing those domains yet.

## v2 Requirements

### Platform Expansion

- **PLAT-01**: A serverless backend workspace serves frontend-adjacent APIs such as visitor counting.
- **PLAT-02**: Shared data contracts are consumed by both frontend and backend workspaces.
- **PLAT-03**: Infrastructure-as-code workspaces provision and evolve AWS resources alongside application changes.
- **PLAT-04**: Local development supports coordinated frontend and backend verification flows.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Shipping the visitor counter backend now | Architecture refactor comes before new platform implementation |
| Introducing additional user-facing apps | Current milestone is repository structure, not product expansion |
| Splitting the frontend into micro-frontends | Unnecessary complexity for a single small SPA |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WS-01 | Phase 1 | Complete |
| WS-02 | Phase 1 | Complete |
| AGT-03 | Phase 1 | Complete |
| ARCH-01 | Phase 1 | Complete |
| WS-03 | Phase 2 | Complete |
| FE-01 | Phase 2 | Complete |
| FE-02 | Phase 2 | Complete |
| AGT-01 | Phase 3 | Complete |
| AGT-02 | Phase 3 | Complete |
| VAL-01 | Phase 3 | Complete |
| VAL-02 | Phase 3 | Complete |
| CLN-01 | Phase 4 | Pending |
| CLN-05 | Phase 4 | Pending |
| CLN-02 | Phase 5 | Pending |
| CLN-03 | Phase 6 | Pending |
| CLN-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 after v1.0 audit gap-phase creation*
