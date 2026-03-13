# Testing And Validation

## Current State

This repo now has a lightweight smoke-test harness for `apps/web` using Vitest, React Testing Library, and jsdom. It still does not have a full integration or end-to-end framework, and there are no dedicated package-level tests under `packages/`.

The broader validation pipeline now combines docs checks, linting, package/app builds, smoke coverage, and static artifact validation.

## Commands That Act As Today’s Test Surface

- `npm run docs:validate`
  - Runs `scripts/validate-docs.mjs`.
  - Validates the docs map and markdown link integrity.
- `npm run lint`
  - Runs ESLint for the active web workspace.
- `npm run build`
  - Builds the shared packages plus the active web workspace from the repo root.
- `npm run build --workspace @cloud-resume-v2/contracts`
  - Type-checks the contracts package in isolation.
- `npm run build --workspace @cloud-resume-v2/frontend-core`
  - Type-checks the shared frontend runtime package in isolation.
- `npm run test`
  - Runs the `apps/web` smoke suite from the repo root in non-watch mode.
- `bash scripts/validate-dist.sh apps/web/dist`
  - Checks that `apps/web/dist/` looks deployable for static S3/CloudFront hosting.
- `npm run validate`
  - Aggregates the current full local validation flow from the repo root.

## CI Coverage

- GitHub Actions runs the same core gates in `.github/workflows/ci.yml`:
  - docs validation
  - lint
  - workspace builds
  - smoke tests
  - `scripts/validate-dist.sh apps/web/dist`
- There is also a separate gitleaks workflow for secret scanning in `.github/workflows/gitleaks.yml`.

## What Is Actually Verified Today

- Static correctness:
  - TypeScript compilation succeeds.
  - ESLint rules pass.
  - the app builds with Vite.
  - the shared packages build in isolation when asked directly.
  - the smoke suite proves baseline app boot, shared content rendering, and theme-toggle persistence.
  - the generated `apps/web/dist/` folder contains expected static artifacts.
- Documentation integrity:
  - required docs exist.
  - markdown links resolve under the docs validator.
- Secret hygiene:
  - gitleaks scans pushes and pull requests.

## What Is Not Verified Today

- Full component rendering behavior
- Real-browser theme toggle behavior
- Scroll-driven footer visibility behavior
- Accessibility behavior
- Visual regressions
- Browser compatibility across devices
- Real deployment behavior against S3/CloudFront
- Dedicated regression behavior inside the new shared packages

## Existing Validation Scripts

### Docs Validation

- `scripts/validate-docs.mjs` is the repo’s main custom validation script.
- Treat it as part of the test surface because CI depends on it before lint/build.

### Dist Validation

- `scripts/validate-dist.sh` verifies deployable output rather than app behavior.
- Current checks include:
  - `apps/web/dist/` exists
  - `apps/web/dist/index.html` exists
  - `apps/web/dist/assets/` exists and is non-empty
  - no `*.server.js` files are emitted
  - no `node_modules/` directory is present in `apps/web/dist/`
  - `index.html` references at least one JS asset
  - root-relative asset references in `index.html` resolve to real built files

## Practical Testing Guidance For New Work

- For documentation or planning changes:
  - `npm run docs:validate`
- For app code changes:
  - `npm run lint`
  - `npm run build`
  - `bash scripts/validate-dist.sh apps/web/dist`
- For shared package changes:
  - `npm run build --workspace @cloud-resume-v2/contracts`
  - `npm run build --workspace @cloud-resume-v2/frontend-core`
  - `npm run validate` before wrapping up
- For UI behavior changes, add manual browser checks because there is still no automated browser suite:
  - theme toggle in `apps/web/src/components/Header.tsx`
  - scroll visibility in `apps/web/src/components/Footer.tsx`
  - content rendering driven by `@cloud-resume-v2/contracts`

## Gaps To Expect Next

- Smoke coverage exists, but it is still narrow.
- The new shared packages are structurally validated but still lack dedicated package-level tests.
- The current validation stack is strongest at catching structural regressions and weakest at catching user-visible regressions.

## Recommended First Additions

- Expand the existing Vitest + React Testing Library smoke suite beyond app boot and theme behavior.
- Add focused tests for `packages/contracts` parsing and `packages/frontend-core` theme behavior.
- Add one browser-level happy-path check for theme toggle and page boot if Playwright is introduced later.
