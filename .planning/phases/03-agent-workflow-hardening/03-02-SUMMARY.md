---
phase: 03-agent-workflow-hardening
plan: 02
subsystem: testing
tags: [vitest, rtl, smoke-tests, jsdom, ui-validation]
requires:
  - phase: 03
    provides: workspace-aware root validation and CI parity
provides:
  - root-runnable smoke test harness for apps/web
  - baseline UI coverage for boot, shared content, and theme behavior
  - smoke tests wired into CI and the root validate command
affects: [apps-web, ci, testing-docs, phase-03]
tech-stack:
  added: [vitest, @testing-library/react, @testing-library/jest-dom, jsdom]
  patterns: [root-runnable-smoke-tests, app-level-shared-package-verification]
key-files:
  created: [apps/web/src/test/setup.ts, apps/web/src/test/App.smoke.test.tsx, apps/web/public/assets/background.svg]
  modified: [package.json, package-lock.json, apps/web/package.json, apps/web/vite.config.ts, .github/workflows/ci.yml, apps/web/index.html, apps/web/src/App.tsx, docs/quality.md, .planning/codebase/TESTING.md, docs/architecture.md, .planning/codebase/STACK.md, .planning/codebase/STRUCTURE.md]
key-decisions:
  - "Started with a lightweight Vite-compatible smoke harness rather than browser E2E tooling."
  - "Protected the shared packages indirectly through the running app before adding package-specific tests."
patterns-established:
  - "Root test commands fan into the web workspace."
  - "Static asset validation is part of the same quality bar as UI smoke coverage."
requirements-completed: [VAL-02]
duration: 10min
completed: 2026-03-13
---

# Phase 03: Agent Workflow Hardening Summary

**The repo now has a root-runnable smoke suite for the web app, and normal validation includes tests before the static artifact gate.**

## Performance

- **Duration:** 10 min
- **Completed:** 2026-03-13
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- Added Vitest + React Testing Library + jsdom to `apps/web` and exposed the suite through root and workspace scripts.
- Added smoke coverage for app boot, shared content rendering, and theme persistence behavior.
- Wired smoke tests into CI and the root `npm run validate` path.

## Task Commits

No git commits were created during this execution. Work remains in the working tree.

## Files Created/Modified

- `apps/web/package.json` and `apps/web/vite.config.ts` - test harness wiring for the web workspace
- `apps/web/src/test/setup.ts` - jsdom setup for RTL, `matchMedia`, and `localStorage`
- `apps/web/src/test/App.smoke.test.tsx` - baseline boot/content/theme smoke path
- `package.json` and `.github/workflows/ci.yml` - root and CI test execution wiring
- `.planning/codebase/TESTING.md` and `docs/quality.md` - current testing truth after the smoke harness landed
- `apps/web/public/assets/background.svg`, `apps/web/index.html`, and `apps/web/src/App.tsx` - repaired the missing public background asset surfaced by dist validation

## Decisions Made

- Kept the test scope intentionally narrow so the first automated UI path would be stable and cheap.
- Treated the missing public asset as a real deployment bug and fixed it instead of weakening `scripts/validate-dist.sh`.

## Deviations from Plan

### Auto-fixed Issues

**1. Dist validation exposed a broken public asset reference**
- **Found during:** Final `npm run validate`
- **Issue:** The app still referenced `/assets/background.png`, but the file had been removed during the repo move.
- **Fix:** Added a repository-owned SVG replacement under `apps/web/public/assets/` and updated the app/icon references plus the affected architecture/codebase docs.
- **Verification:** `npm run validate`

---

**Total deviations:** 1 auto-fixed
**Impact on plan:** Necessary artifact repair to make the new smoke-enabled validation path fully green.

## Issues Encountered

- `jsdom` did not provide a compatible `localStorage` implementation for the theme tests in this environment, so the test setup now installs an in-memory shim.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The repo now has a stable baseline UI guardrail for future app refactors.
- The next validation depth gain should come from package-specific tests and broader smoke coverage, not a new test stack.

---
*Phase: 03-agent-workflow-hardening*
*Completed: 2026-03-13*
