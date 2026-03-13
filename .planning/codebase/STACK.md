# Stack

This repo is a frontend-first npm workspace monorepo. The active runtime remains one static React SPA, but shared frontend code now lives in dedicated workspace packages.

## Current Stack Summary

| Layer | Current choice | Evidence | Notes |
| --- | --- | --- | --- |
| Workspace orchestration | npm workspaces | [package.json](../../package.json) | Root workspaces include `apps/*` and `packages/*`. |
| App runtime | React 18, React DOM 18 | [apps/web/package.json](../../apps/web/package.json), [apps/web/src/main.tsx](../../apps/web/src/main.tsx) | `apps/web` mounts one `App` root with `React.StrictMode`. |
| Language | TypeScript 5 | [apps/web/package.json](../../apps/web/package.json), [apps/web/tsconfig.json](../../apps/web/tsconfig.json) | `strict` mode is enabled. Package-local TS configs exist for shared packages. |
| Build and dev server | Vite 4 with `@vitejs/plugin-react` | [apps/web/package.json](../../apps/web/package.json), [apps/web/vite.config.ts](../../apps/web/vite.config.ts) | No SSR config or proxy layer is present. |
| Styling | Tailwind CSS v4, PostCSS, Autoprefixer | [apps/web/package.json](../../apps/web/package.json), [apps/web/src/index.css](../../apps/web/src/index.css), [apps/web/tailwind.config.js](../../apps/web/tailwind.config.js), [apps/web/postcss.config.js](../../apps/web/postcss.config.js) | Tailwind remains app-local. |
| Shared content boundary | `@cloud-resume-v2/contracts` | [packages/contracts/package.json](../../packages/contracts/package.json), [packages/contracts/src/resume.ts](../../packages/contracts/src/resume.ts) | Exports typed `resumeData` and related interfaces. |
| Shared frontend runtime boundary | `@cloud-resume-v2/frontend-core` | [packages/frontend-core/package.json](../../packages/frontend-core/package.json), [packages/frontend-core/src/themeManager.ts](../../packages/frontend-core/src/themeManager.ts) | Owns theme persistence and DOM class application. |
| UI composition | Local React components under `apps/web/src/components/` | [apps/web/src/App.tsx](../../apps/web/src/App.tsx), [apps/web/src/components](../../apps/web/src/components) | `App.tsx` still composes one scroll-first page. |
| Static assets | `apps/web/public/assets` plus `apps/web/index.html` | [apps/web/public/assets/background.svg](../../apps/web/public/assets/background.svg), [apps/web/index.html](../../apps/web/index.html) | The app background image remains a public asset. |
| Validation and repo tooling | Docs validation, ESLint, workspace builds, smoke tests, dist validation | [package.json](../../package.json), [scripts/validate-docs.mjs](../../scripts/validate-docs.mjs), [scripts/validate-dist.sh](../../scripts/validate-dist.sh) | `npm run validate` is the repo gate. |
| Test harness | Vitest, React Testing Library, jsdom | [apps/web/package.json](../../apps/web/package.json), [apps/web/src/test/App.smoke.test.tsx](../../apps/web/src/test/App.smoke.test.tsx) | Smoke coverage is intentionally narrow but now wired into CI. |

## Runtime Shape

- Rendering is fully client-side: `apps/web/src/main.tsx` mounts `apps/web/src/App.tsx`.
- `App.tsx` owns the only shared interactive state that matters today: dark mode.
- Theme persistence and DOM class application are handled through `@cloud-resume-v2/frontend-core`.
- Resume content now flows through `@cloud-resume-v2/contracts` instead of app-local JSON imports.

## Styling Notes

- `apps/web/src/index.css` uses Tailwind v4 import syntax and keeps the global CSS that Tailwind utilities do not cover.
- `apps/web/tailwind.config.js` defines app-specific colors, fonts, and shadows instead of using a design-system package.
- The typography stack still depends on CDN-hosted Inter and Fira Code declared in `apps/web/index.html`.

## What Is Not In The Stack Today

- No routing library
- No global state manager
- No data-fetching client such as React Query, SWR, or Axios
- No browser-level E2E runner
- No backend package, API server, or IaC runtime in this repo yet
- No required environment variables for build or local runtime; `.env.example` remains future scaffold only

## Brownfield Constraints For Next Work

- The repo now has a clean split between app code in `apps/web`, shared frontend packages in `packages/`, and validation scripts in `scripts/`.
- The largest remaining technical boundary is validation depth, not content ownership.
- Runtime external dependencies are intentionally light, which keeps future app/service extraction straightforward.
