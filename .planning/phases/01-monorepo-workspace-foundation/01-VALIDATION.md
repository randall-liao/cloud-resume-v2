---
phase: 01
slug: monorepo-workspace-foundation
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-13
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | repo script validation (`pnpm validate`) |
| **Config file** | root `package.json` plus workspace package manifests |
| **Quick run command** | `pnpm docs:validate` |
| **Full suite command** | `pnpm validate` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm docs:validate` for docs-only work, otherwise `pnpm validate`
- **After every plan wave:** Run `pnpm validate`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | WS-01 | workspace install/build | `pnpm install && pnpm --filter web build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | WS-02 | package build | `pnpm --filter web build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | AGT-03 | docs validation | `pnpm docs:validate` | ✅ | ⬜ pending |
| 01-02-02 | 02 | 2 | WS-01 | full repo validation | `pnpm validate` | ✅ | ⬜ pending |
| 01-03-01 | 03 | 3 | ARCH-01 | structure/docs validation | `pnpm docs:validate` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 3 | AGT-03 | planning and docs validation | `pnpm docs:validate && node "$HOME/.codex/get-shit-done/bin/gsd-tools.cjs" roadmap analyze` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm-workspace.yaml` — root workspace discovery
- [ ] `apps/web/package.json` — dedicated web workspace manifest
- [ ] `apps/README.md` — committed placeholder for app domain ownership
- [ ] `packages/contracts/README.md` — committed placeholder for future shared contracts
- [ ] `services/README.md` and `infra/README.md` — committed placeholder domains for future platform work

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The moved app boots from its workspace | WS-02 | Browser boot path is still user-visible behavior | Start the web app from root or `apps/web`, open the local URL, and confirm the resume SPA still renders correctly |
| Root docs route agents to the new monorepo layout | AGT-03 | Navigation quality is partly semantic and easier to spot by reading | Open `AGENTS.md`, `README.md`, and `docs/README.md` and confirm they point to `apps/web`, `packages/`, and the new monorepo docs |
| Future platform domains are explicit but not over-implemented | ARCH-01 | Requires judgment about scope discipline | Inspect `packages/contracts/`, `services/`, `infra/`, and `docs/monorepo.md` to confirm they document boundaries without adding runtime platform code |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-13
