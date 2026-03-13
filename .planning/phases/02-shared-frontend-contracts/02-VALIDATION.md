---
phase: 02
slug: shared-frontend-contracts
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-13
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | repo script validation plus workspace package build checks |
| **Config file** | root `package.json` plus package-local `package.json` and `tsconfig.json` files |
| **Quick run command** | `npm run build --workspace @cloud-resume-v2/contracts` |
| **Full suite command** | `npm run validate` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run the package-local build command for the package being edited; for app integration work run `npm run validate`
- **After every plan wave:** Run `npm run validate`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | FE-01 | package build | `npm run build --workspace @cloud-resume-v2/contracts` | ✅ | ✅ green |
| 02-01-02 | 01 | 1 | FE-01 | boundary export check | `npm run build --workspace @cloud-resume-v2/contracts` | ✅ | ✅ green |
| 02-02-01 | 02 | 2 | FE-02 | package build | `npm run build --workspace @cloud-resume-v2/frontend-core` | ✅ | ✅ green |
| 02-02-02 | 02 | 2 | FE-02 | package API integrity | `npm run build --workspace @cloud-resume-v2/frontend-core` | ✅ | ✅ green |
| 02-03-01 | 03 | 3 | WS-03 | import migration check | `! rg -n \"data/resume.json|utils/themeManager\" apps/web/src` | ✅ | ✅ green |
| 02-03-02 | 03 | 3 | FE-01, FE-02 | full integration | `npm run validate` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ flaky*

---

## Wave 0 Requirements

- [x] `packages/contracts/package.json` - workspace package manifest for shared contracts
- [x] `packages/contracts/tsconfig.json` - package-local TypeScript config
- [x] `packages/contracts/src/index.ts` - explicit public entrypoint
- [x] `packages/frontend-core/package.json` - workspace package manifest for shared frontend utilities
- [x] `packages/frontend-core/tsconfig.json` - package-local TypeScript config
- [x] `packages/frontend-core/src/index.ts` - explicit public entrypoint

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The app still renders the same resume content after package extraction | FE-01 | Static type checks do not prove that the visible content hierarchy stayed intact | Run `npm run dev`, open the app, and confirm the major sections still render with the same content |
| Theme preference still persists across reloads after moving the helper into `frontend-core` | FE-02 | Requires browser interaction with `localStorage` and the DOM theme class | Toggle theme, reload the page, and confirm the preference is preserved |
| Package boundaries remain legible to future agents | WS-03 | Semantic repo navigation quality is easiest to judge by reading docs and imports | Inspect package entrypoints plus updated docs and confirm the app imports packages, not app-local leaf files |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-13
