# Codebase Concerns

**Analysis Date:** 2026-03-13

## Tech Debt

**Smoke coverage is still narrow:**
- Issue: The repo now has a smoke-level automated UI path, but it only protects app boot, shared content rendering, and theme behavior.
- Why: Phase 3 intentionally started with the smallest stable UI coverage surface.
- Impact: Regressions in footer behavior or broader user-visible flows can still slip through.
- Fix approach: Expand the current Vitest + React Testing Library suite incrementally from the monorepo root.

**Shared packages have no dedicated tests yet:**
- Issue: `packages/contracts` and `packages/frontend-core` are real boundaries, but only package builds and app integration validate them.
- Why: Phase 2 extracted the packages without introducing new test tooling.
- Impact: Regressions in content parsing or theme helpers may only surface during broader app validation.
- Fix approach: Add focused package-level tests as the next validation increment after Phase 3.

**Global CSS still mixes foundation and feature styling:**
- Issue: `apps/web/src/index.css` contains both global theming/base rules and feature-specific presentation such as commit-history visuals.
- Why: Keeping styles in one place stayed convenient while the app remained small.
- Impact: Shared styling is harder to extract cleanly, and unrelated visual changes can create merge pressure for parallel agents.
- Fix approach: Split foundation tokens/base styles from section-specific presentation before any shared UI package work.

## Known Bugs

**Footer presents a live counter that is not live:**
- Symptoms: The footer tooltip claims "DynamoDB Live Count" while the displayed visitor number is hardcoded to `843`.
- Trigger: Every render of `apps/web/src/components/Footer.tsx`.
- Workaround: Treat the counter as decorative copy only.
- Root cause: The planned backend integration was never implemented, but the placeholder UI remained.
- Blocked by: A real API contract and environment configuration for the future backend.

## Security Considerations

**CDN-hosted fonts and icon sets:**
- Risk: The visual layer depends on third-party CDNs declared in `apps/web/index.html`, which adds external availability and supply-chain exposure.
- Current mitigation: Assets are public and non-secret, and the app can still boot if some decorative assets fail.
- Recommendations: For stronger determinism, migrate critical assets into versioned local packages or explicit npm-managed dependencies.

**No secret or runtime backend risk in current shared packages:**
- Risk: Low today because `packages/contracts` is static content and `packages/frontend-core` only wraps browser APIs.
- Current mitigation: Packages stay narrow and browser-only behavior is isolated from future backend contracts.
- Recommendations: Keep future backend-facing schemas in `packages/contracts` and keep browser helpers out of that package.

## Performance Bottlenecks

**Package validation depth is lighter than app validation depth:**
- Problem: Root validation now covers workspace builds, smoke tests, and artifact shape, but only the app has runtime-facing automated tests.
- Measurement: No current CI timing issue exists, but package-level regression coverage is still uneven.
- Cause: Phase 3 prioritized root parity and a baseline UI smoke path before deeper package-specific tests.
- Improvement path: Add package tests before considering a more granular CI matrix.

## Fragile Areas

**`apps/web/src/App.tsx`:**
- Why fragile: It still combines page composition, theme initialization, title side effects, and package integration at one root.
- Common failures: Theme refactors can accidentally break document title behavior or page shell rendering.
- Safe modification: Extract app-shell concerns incrementally instead of rewriting the root component all at once.
- Test coverage: Smoke tests cover boot and theme behavior, but not deeper component interactions.

**`packages/contracts/src/resume.ts`:**
- Why fragile: It now owns the typed content boundary and parsing logic for the entire resume document.
- Common failures: Schema changes can break several UI sections at once if parsing or exported types drift.
- Safe modification: Change the content contract deliberately and add dedicated tests before expanding the package surface.
- Test coverage: No package tests exist today.

**`apps/web/src/components/Footer.tsx`:**
- Why fragile: It owns scroll-based visibility behavior and still carries the misleading future-backend placeholder copy.
- Common failures: Small styling or state changes can break hide/show behavior or expose the fake integration more obviously.
- Safe modification: Separate visibility behavior from data display, then add smoke coverage before wiring a real API.
- Test coverage: No automated tests exist for scroll behavior.

## Scaling Limits

**Repository topology for parallel agent work:**
- Current capacity: App code, shared packages, and future domain placeholders are separated clearly enough for parallel agent work.
- Limit: Package-level regression depth still trails the ownership and subtree documentation.
- Symptoms at limit: Multiple agents can edit different domains, but shared-package regressions may still be caught late.
- Scaling path: Add package tests and confirm operational branch protection before scaling agent concurrency further.

## Dependencies at Risk

**Tailwind v4 plus app-local JS config:**
- Risk: The styling stack is still app-local and mixes Tailwind v4 packages with a JS config file, which can be confusing during tooling upgrades.
- Impact: Future contributors may misread how design tokens and plugins are wired once more apps or packages appear.
- Migration plan: Keep the config app-local until a second consumer appears, then document or extract intentionally.

## Missing Critical Features

**Visitor count integration:**
- Problem: The footer still presents placeholder "live count" UI without a backing API.
- Current workaround: Treat the number as decorative copy only.
- Blocks: Truthful cloud-resume backend storytelling and any real contract between frontend and future services.
- Implementation complexity: Medium.

## Test Coverage Gaps

**UI behavior coverage:**
- What's not tested: Footer scroll visibility, deeper section-specific interactions, and any browser-only behavior outside the current smoke path.
- Risk: Refactors can silently break visible behavior while the baseline smoke tests still pass.
- Priority: High.
- Difficulty to test: Low to medium now that Vitest and React Testing Library are in place.

**Shared package coverage:**
- What's not tested: Contract parsing in `packages/contracts` and theme helpers in `packages/frontend-core`.
- Risk: Package regressions may be discovered only after app integration or review.
- Priority: High.
- Difficulty to test: Low.

---
*Concerns audit: 2026-03-13*
*Update as issues are fixed or new ones discovered*
