# Golden Principles

These are the opinionated constraints for `cloud-resume-v2`.

Only principles with an explicit enforcement section are mechanically gated today. Unenforced principles remain important design intent, but they are not CI blockers yet.

## Principle 1: `AGENTS.md` Is The Root Map

**Rule:** `AGENTS.md` must remain the canonical short entrypoint, and `docs/` must remain the deeper source of truth.

**Why:** Agents need a small stable map plus discoverable deeper context, not a monolithic instruction dump.

**Enforcement:** ✅ `npm run docs:validate` verifies `AGENTS.md`, required docs, and markdown links.

## Principle 2: No Routing Libraries

**Rule:** `react-router-dom`, `react-router`, `@tanstack/router`, or similar routing libraries are banned.

**Why:** This repo deploys as a static SPA behind CloudFront. Extra routing libraries add weight without solving a real problem here.

**Enforcement:** ✅ ESLint `no-restricted-imports`.

## Principle 3: No Global State Managers

**Rule:** `redux`, `@reduxjs/toolkit`, `zustand`, `jotai`, `recoil`, and `mobx` are banned.

**Why:** The current UI needs only local component state.

**Enforcement:** ✅ ESLint `no-restricted-imports`.

## Principle 4: No MUI Layout Or `sx`

**Rule:** MUI layout primitives (`Box`, `Container`, `Grid`, `Paper`, `Stack`, and similar) plus the `sx` prop are banned.

**Why:** Tailwind is the layout and styling system in this repo. A parallel styling runtime makes the codebase harder for agents to reason about.

**Enforcement:** ✅ ESLint `no-restricted-imports` and `no-restricted-syntax`.

## Principle 5: No AWS Secrets In The Repo

**Rule:** AWS access keys, secret keys, session tokens, and similar secrets must never be committed.

**Why:** This repo ships public client assets.

**Enforcement:** ✅ `gitleaks` on push and pull request.

## Principle 6: The Static Artifact Must Be Valid

**Rule:** The active app build output must contain a deployable static bundle with a valid `index.html`, assets, and no server-only leftovers. Today that path is `apps/web/dist/`.

**Why:** A broken static artifact is a failed deploy regardless of TypeScript correctness.

**Enforcement:** ✅ `bash scripts/validate-dist.sh apps/web/dist` in CI and root validation.

## Principle 7: Build Must Succeed Before Merge

**Rule:** Pull requests must not merge with a broken workspace-aware build surface. Today that means `npm run build:packages` and `npm run build:web`, aggregated by `npm run build`.

**Why:** A broken build blocks deployment and compounds quickly in a fast-moving agent workflow.

**Enforcement:** ✅ `.github/workflows/ci.yml`.

## Principle 8: Parse At The Boundary

**Rule:** Data from `localStorage`, future API calls, and other external inputs should be parsed at the boundary rather than trusted by assumption.

**Why:** It prevents guessed shapes from spreading through the tree.

**Enforcement:** ⚠️ Partially enforced. `packages/contracts/src/resume.ts` validates resume content and `packages/frontend-core/src/themeManager.ts` constrains stored theme values, but there is no generic lint rule.

## Principle 9: Resume Content Belongs In `resume.json`

**Rule:** Resume-specific narrative content should live in `packages/contracts/src/resume.json` and be consumed through `@cloud-resume-v2/contracts`. Structural UI chrome may still live in components.

**Why:** Agents should not have to hunt through many files to update core resume content.

**Enforcement:** 🔴 Unenforced. This is currently a convention, not a lint rule.

## Principle 10: Non-Critical Side Effects Must Fail Safe

**Rule:** When non-critical client-side side effects are added, they must not white-screen the app if they fail.

**Why:** The planned visitor counter is auxiliary, not mission-critical UI.

**Enforcement:** 🔴 Unenforced. The current app does not yet implement the live visitor-counter call.
