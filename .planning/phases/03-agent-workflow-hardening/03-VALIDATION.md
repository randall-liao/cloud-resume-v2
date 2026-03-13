---
phase: 03
slug: agent-workflow-hardening
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-13
---

# Phase 03 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | repo script validation plus `vitest` + React Testing Library |
| **Config file** | root `package.json`, `.github/workflows/ci.yml`, and app/package-local test config files |
| **Quick run command** | `npm run test --workspace @cloud-resume-v2/web -- --run` |
| **Full suite command** | `npm run validate` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run the narrowest relevant command. For docs-only work: `npm run docs:validate`. For validation or test harness work: `npm run test --workspace @cloud-resume-v2/web -- --run` plus any changed package builds.
- **After every plan wave:** Run `npm run validate`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 75 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | VAL-01 | workspace build wiring | `npm run build:packages && npm run build:web` | ✅ | ✅ green |
| 03-01-02 | 01 | 1 | VAL-01 | CI/local parity | `npm run docs:validate && npm run lint && npm run build:packages && npm run build:web` | ✅ | ✅ green |
| 03-02-01 | 02 | 2 | VAL-02 | test harness boot | `npm run test --workspace @cloud-resume-v2/web -- --run` | ✅ | ✅ green |
| 03-02-02 | 02 | 2 | VAL-02 | smoke path | `npm run test --workspace @cloud-resume-v2/web -- --run` | ✅ | ✅ green |
| 03-03-01 | 03 | 3 | AGT-01 | docs validation | `npm run docs:validate` | ✅ | ✅ green |
| 03-03-02 | 03 | 3 | AGT-02 | subtree workflow docs | `rg -n "git subtree|subtree add|subtree pull|subtree push|ownership" AGENTS.md docs/monorepo.md docs/git_subtree.md` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ flaky*

---

## Wave 0 Requirements

- [x] `package.json` - root scripts for package-aware builds and tests
- [x] `apps/web/package.json` - test script and test dependencies
- [x] `apps/web/src/test/setup.ts` - test setup for RTL/jest-dom behavior
- [x] `apps/web/src/test/App.smoke.test.tsx` - baseline app smoke coverage
- [x] `docs/git_subtree.md` - canonical operational subtree workflow

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Theme toggle still behaves correctly in a real browser after test harness changes | VAL-02 | jsdom covers most behavior, but browser confirmation remains valuable for DOM class toggling and persistence | Run `npm run dev`, toggle theme, reload, and confirm the preference is preserved |
| Subtree workflow guidance is understandable to another agent without chat context | AGT-01, AGT-02 | This is partly semantic documentation quality, not just file presence | Open `AGENTS.md`, `docs/monorepo.md`, and `docs/git_subtree.md` and confirm they explain where work belongs and how subtree sync should be done |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 75s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-13
