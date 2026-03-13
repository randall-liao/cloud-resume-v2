# Codebase Conventions

## Scope

This repo is now a small frontend-first workspace monorepo. The conventions below describe the code as it exists today after Phase 2 package extraction, not an idealized future state.

## Stack And Layout

- Runtime stack: React 18 + TypeScript + Vite in `apps/web`.
- Styling stack: Tailwind CSS v4 plus handwritten global CSS in [`apps/web/src/index.css`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/index.css).
- Source layout is intentionally shallow:
  - [`apps/web/src/App.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/App.tsx) composes the page.
  - [`apps/web/src/components/`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components) holds section components.
  - [`packages/contracts/`](/home/devuser/projects/react-cloud-resume-v2/packages/contracts) holds shared resume content and typed contract exports.
  - [`packages/frontend-core/`](/home/devuser/projects/react-cloud-resume-v2/packages/frontend-core) holds shared browser-facing theme helpers.

## Component Patterns

- Components are default-exported function components. See [`apps/web/src/components/Header.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Header.tsx) and [`apps/web/src/components/Footer.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Footer.tsx).
- `App.tsx` is still an orchestration layer. It imports the top-level sections and renders them in sequence rather than routing between pages.
- State is local and lightweight:
  - [`apps/web/src/App.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/App.tsx) uses `useState` and `useEffect` for theme persistence and document title updates.
  - [`apps/web/src/components/Footer.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Footer.tsx) uses `useState` and `useEffect` for scroll visibility.
- Prop typing remains light:
  - [`apps/web/src/components/Header.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Header.tsx) defines a local `HeaderProps` interface.
  - Most other components still take no props and import `resumeData` from the shared contracts package.
- There is no shared hooks layer and no context/provider architecture yet.

## Data Conventions

- Resume content lives in [`packages/contracts/src/resume.json`](/home/devuser/projects/react-cloud-resume-v2/packages/contracts/src/resume.json).
- Runtime consumers should use [`@cloud-resume-v2/contracts`](/home/devuser/projects/react-cloud-resume-v2/packages/contracts/src/index.ts), not import JSON files directly.
- Data parsing is centralized in [`packages/contracts/src/resume.ts`](/home/devuser/projects/react-cloud-resume-v2/packages/contracts/src/resume.ts).
- Data ownership is improved, but some user-facing strings remain hardcoded in components, such as the title suffix in [`apps/web/src/App.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/App.tsx) and the visitor count copy in [`apps/web/src/components/Footer.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Footer.tsx).

## Styling Conventions

- Tailwind utility classes are the primary styling mechanism across components.
- [`apps/web/src/index.css`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/index.css) is used for:
  - Tailwind wiring
  - base body styling
  - custom scrollbar styles
  - a few bespoke classes such as `.blinking-cursor`, `.git-line`, and token-color helpers
- The UI uses `dark` class toggling on `document.documentElement`, but the behavior is applied through [`packages/frontend-core/src/themeManager.ts`](/home/devuser/projects/react-cloud-resume-v2/packages/frontend-core/src/themeManager.ts).
- The codebase avoids CSS modules, component-scoped CSS files, and CSS-in-JS.

## TypeScript And Linting

- TypeScript is strict in the app and the shared packages.
- ESLint is the main code-quality gate for the active web app.
- Current enforced rules worth preserving:
  - no explicit `any`
  - no unused vars except `_`-prefixed args
  - banned imports for routing libraries and common global state libraries
  - no MUI layout imports or `sx`

## Shared Package Pattern

- `packages/contracts` is the shared contract boundary for typed content and future cross-domain schemas.
- `packages/frontend-core` is the shared browser-facing runtime helper boundary.
- `apps/web` may depend on packages, but packages must not depend on the app.
- Shared package changes should update docs in the same change because package boundaries are now part of the repo contract.

## Comments And Readability

- The codebase still contains instructional comments aimed at teaching concepts, especially in [`apps/web/src/App.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/App.tsx) and [`apps/web/src/components/Header.tsx`](/home/devuser/projects/react-cloud-resume-v2/apps/web/src/components/Header.tsx).
- Preserve behavior first. Treat broad comment cleanup as separate work unless the task explicitly includes it.

## Practical Guidance For Future Work

- Preserve the current shallow composition model unless a task explicitly introduces routing or multiple apps.
- Route shared content changes through `packages/contracts`.
- Route shared frontend runtime behavior through `packages/frontend-core`.
- Keep `apps/web` as the composition root rather than turning package extraction into a broad UI redesign.
