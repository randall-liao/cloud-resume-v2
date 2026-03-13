# Architecture

## Summary

`cloud-resume-v2` is now a frontend-first npm workspace monorepo. It contains one deployable app in `apps/web` plus two real shared packages:

- `packages/contracts` for typed resume content and shared contract shapes
- `packages/frontend-core` for browser-facing shared frontend runtime helpers

The runtime remains intentionally simple: one client-rendered React SPA, static deployment to S3/CloudFront, and no server-side runtime in this repository yet.

## Runtime Model

- Entry point: `apps/web/src/main.tsx`
- Root component: `apps/web/src/App.tsx`
- Rendering model: browser-only client-side rendering
- Deployment artifact: static files emitted to `apps/web/dist`
- Hosting target: S3 static asset bucket behind CloudFront

Current runtime flow:

1. `apps/web/src/main.tsx` mounts `<App />`.
2. `apps/web/src/App.tsx` initializes dark mode from `@cloud-resume-v2/frontend-core`.
3. `apps/web/src/App.tsx` sets `document.title`, persists theme preference, applies the `dark` class through `applyThemePreference`, and composes the page sections.
4. Section components consume typed content from `@cloud-resume-v2/contracts`.
5. `apps/web/src/components/Footer.tsx` adds a scroll listener to hide/show the fixed footer and still renders a static visitor-count placeholder.

There is still no router, API client layer, server runtime, or test harness in the current repository.

## Application Shape

### `apps/web`

`apps/web` is the only deployable runtime application. It owns:

- the Vite document shell and static asset pipeline
- page composition
- section components
- global CSS

`apps/web/src/App.tsx` remains the composition root. It is responsible for:

- global page chrome
- dark-mode state ownership
- theme side effects
- section ordering

### `packages/contracts`

`packages/contracts` is now the canonical content and shared contract boundary for the frontend. It owns:

- `src/resume.json` as the canonical resume content source
- `src/resume.ts` as the typed parse-at-the-boundary adapter
- `src/index.ts` as the package entrypoint

This package is intentionally browser-agnostic so future backend or serverless code can consume the same content contract.

### `packages/frontend-core`

`packages/frontend-core` owns shared browser-facing frontend runtime helpers. Today that means:

- `themeManager` for persisted theme preference
- `applyThemePreference` for DOM class application

The package is intentionally narrow. It is not a generic utility dump and does not own app-specific presentation code.

## Styling Model

Primary styling is still done with Tailwind CSS v4 classes in TSX files. Global styling lives in `apps/web/src/index.css`, which currently contains:

- Tailwind import/config wiring
- base body styling
- custom scrollbar rules
- blinking cursor animation
- commit-history graph styles
- a few syntax-highlighting utility classes

Important current-state note:

- The app is still not Tailwind-only in the strictest sense because a few components use inline `style` for data-driven colors.
- Global CSS still mixes foundation and feature-specific rules, so CSS extraction remains a future concern.

## External Dependencies

Runtime dependencies remain intentionally small:

- `react`
- `react-dom`

Build and tooling dependencies remain centered on:

- `vite`
- `typescript`
- `eslint`
- `tailwindcss`
- `@tailwindcss/forms`
- `@tailwindcss/container-queries`

The visual layer still depends on CDN-hosted fonts and icon styles declared in `apps/web/index.html`.

## Validation and Operational Boundaries

The active validation pipeline is repo-rooted and currently includes:

- `npm run docs:validate`
- `npm run lint`
- `npm run build`
- `bash scripts/validate-dist.sh apps/web/dist`
- `npm run validate`

Phase 2 also added package-local build checks that can be run directly:

- `npm run build --workspace @cloud-resume-v2/contracts`
- `npm run build --workspace @cloud-resume-v2/frontend-core`

This is enough to validate structural correctness, but not enough yet to prove user-visible UI behavior.

## Architectural Constraints That Matter Next

### What is already clean

- clear app/package boundary
- browser-agnostic content contract package
- shared frontend runtime package for theme behavior
- very small dependency surface
- one obvious composition root

### What is still coupled

- `apps/web/src/index.css` still mixes foundational and section-specific styling
- `App.tsx` still owns both app composition and theme orchestration
- icons/fonts still depend on document-level CDN setup
- validation is still strongest at structure/build correctness, not user-visible behavior

### Likely next hardening seams

1. workspace-aware CI and validation granularity
2. smoke tests for the web app
3. subtree ownership and sync rules for domain-level parallel work
4. dedicated regression tests around the shared packages

## Risks and Brownfield Notes

- `Footer.tsx` still presents a visitor counter as UI but does not implement a live backend integration.
- There is still no automated browser-level verification of theme toggling or footer scroll behavior.
- `.planning/codebase/` documents must be kept in sync manually unless the map is regenerated.

## Practical Guidance

For future work, preserve these truths:

- `apps/web` is still the only deployable frontend app.
- `packages/contracts` owns resume content and shared document shapes.
- `packages/frontend-core` owns browser-facing shared frontend runtime helpers.
- Future backend and IaC work should land in `services/` and `infra/`, not back inside the app or packages.
