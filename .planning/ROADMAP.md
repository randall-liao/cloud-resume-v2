# Roadmap: cloud-resume-v2

## Overview

This roadmap turns the current frontend-only resume repo into an agent-first monorepo in three deliberate steps: move the working web app into a workspace-aware root, extract stable shared contracts for frontend reuse, and then harden validation plus multi-agent collaboration so future backend and infrastructure domains can land without re-architecting the repo again. After the v1.0 audit, three cleanup phases were added to retire carried debt before milestone archival.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions if needed later

- [x] **Phase 1: Monorepo Workspace Foundation** - Move the current frontend into a workspace-aware monorepo root and document the new repo map.
- [x] **Phase 2: Shared Frontend Contracts** - Extract typed content and reusable frontend package seams from the migrated app.
- [x] **Phase 3: Agent Workflow Hardening** - Add validation and git subtree guidance so multiple agents can work safely across domains.
- [ ] **Phase 4: Validation Truthfulness And Governance Cleanup** - Sync validation artifacts, root docs, and merge-governance guidance with the executed npm workspace workflow.
- [ ] **Phase 5: Shared Package Regression Coverage** - Add direct automated regression coverage for `packages/contracts` and `packages/frontend-core`.
- [ ] **Phase 6: UI Truthfulness And Smoke Expansion** - Expand smoke coverage beyond the current baseline and remove misleading live-metrics UI copy.

## Phase Details

### Phase 1: Monorepo Workspace Foundation
**Goal:** Establish the monorepo root, move the current web app into `apps/web`, and encode the new repository map so agents can navigate the workspace without losing the current deployable frontend.
**Depends on:** Nothing (first phase)
**Requirements:** [WS-01, WS-02, AGT-03, ARCH-01]
**Requirements**: [WS-01, WS-02, AGT-03, ARCH-01]
**Success Criteria** (what must be TRUE):
  1. The repo has a workspace-aware root with root commands for install, dev, build, and validate.
  2. The existing web app lives in a dedicated app workspace and still builds as a static frontend artifact.
  3. Root agent docs and repository docs reflect the monorepo layout and point to the right source-of-truth files.
  4. Future platform domains have documented workspace locations without forcing backend or IaC implementation now.
**Plans:** 3 plans

Plans:
- [x] 01-01: Establish workspace root and relocate the web app into `apps/web`
- [x] 01-02: Rewire docs, scripts, and CI for the new workspace topology
- [x] 01-03: Document domain ownership and future platform boundaries

### Phase 2: Shared Frontend Contracts
**Goal:** Pull shared frontend data and utility seams into packages so the web app depends on explicit contracts instead of raw internal files.
**Depends on:** Phase 1
**Requirements:** [WS-03, FE-01, FE-02]
**Requirements**: [WS-03, FE-01, FE-02]
**Success Criteria** (what must be TRUE):
  1. Shared frontend code lives under `packages/` with explicit dependency direction into the web app.
  2. Resume content is accessed through a typed package boundary rather than direct leaf JSON imports.
  3. Theme or reusable frontend utility concerns are exposed through stable package-level APIs.
**Plans:** 3 plans

Plans:
- [x] 02-01: Extract typed resume content package
- [x] 02-02: Extract shared theme and frontend utility package
- [x] 02-03: Migrate the web app to package APIs and remove direct leaf imports

### Phase 3: Agent Workflow Hardening
**Goal:** Make the monorepo safe for parallel agent work through workspace-aware validation, smoke coverage, and a documented git subtree strategy.
**Depends on:** Phase 2
**Requirements:** [AGT-01, AGT-02, VAL-01, VAL-02]
**Requirements**: [AGT-01, AGT-02, VAL-01, VAL-02]
**Success Criteria** (what must be TRUE):
  1. Root validation and CI execute against the workspace structure instead of single-package assumptions.
  2. The web app has at least one smoke-level automated test path that runs from the monorepo root.
  3. The repo documents git subtree boundaries and ownership conventions for future domain extraction or sync.
  4. Agents can determine where frontend, shared package, and future platform work belongs from repository-local documentation.
**Plans:** 3 plans

Plans:
- [x] 03-01: Make root validation and CI workspace-aware
- [x] 03-02: Add smoke tests for the migrated web app
- [x] 03-03: Document git subtree workflow and multi-agent ownership rules

### Phase 4: Validation Truthfulness And Governance Cleanup
**Goal:** Align the repo’s remaining validation, documentation, and governance signals with the actual npm workspace workflow so milestone archival is based on truthful repo-local evidence.
**Depends on:** Phase 3
**Requirements:** [CLN-01, CLN-05]
**Requirements**: [CLN-01, CLN-05]
**Gap Closure:** Closes audit debt around stale validation artifacts, README validation drift, and branch-protection governance tracking.
**Success Criteria** (what must be TRUE):
  1. Phase 1 validation artifacts no longer describe the abandoned `pnpm` path and reflect the executed npm workspace workflow.
  2. Root human-facing docs describe the current `npm run validate` command surface truthfully.
  3. Branch protection expectations are documented with an explicit place to record external confirmation.
**Plans:** Not planned yet

### Phase 5: Shared Package Regression Coverage
**Goal:** Add direct regression coverage for the extracted shared packages so package changes fail fast without relying only on app integration.
**Depends on:** Phase 4
**Requirements:** [CLN-02]
**Requirements**: [CLN-02]
**Gap Closure:** Closes audit debt around untested shared package seams.
**Success Criteria** (what must be TRUE):
  1. `packages/contracts` has direct automated regression tests.
  2. `packages/frontend-core` has direct automated regression tests.
  3. The root validation surface or CI explicitly runs the new package tests.
**Plans:** Not planned yet

### Phase 6: UI Truthfulness And Smoke Expansion
**Goal:** Expand UI safety nets and remove misleading live-metrics UI so the frontend stays truthful before backend work begins.
**Depends on:** Phase 5
**Requirements:** [CLN-03, CLN-04]
**Requirements**: [CLN-03, CLN-04]
**Gap Closure:** Closes audit debt around narrow smoke coverage and placeholder visitor-count UI.
**Success Criteria** (what must be TRUE):
  1. Smoke coverage protects at least one currently untested user-visible flow beyond app boot and theme toggle.
  2. Footer visitor-count UI no longer implies a live backend unless a real integration exists.
  3. Root docs and quality tracking reflect the updated UI and testing posture.
**Plans:** Not planned yet

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Workspace Foundation | 3/3 | Complete | 2026-03-13 |
| 2. Shared Frontend Contracts | 3/3 | Complete | 2026-03-13 |
| 3. Agent Workflow Hardening | 3/3 | Complete | 2026-03-13 |
| 4. Validation Truthfulness And Governance Cleanup | 0/0 | Not started | - |
| 5. Shared Package Regression Coverage | 0/0 | Not started | - |
| 6. UI Truthfulness And Smoke Expansion | 0/0 | Not started | - |
