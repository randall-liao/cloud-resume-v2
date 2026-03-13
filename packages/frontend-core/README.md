# Frontend Core Package

`packages/frontend-core` contains browser-facing shared frontend runtime helpers.

## Current Contents

- `src/themeManager.ts` - theme preference persistence and DOM class application
- `src/index.ts` - public package entrypoint

## Ownership Rules

- Shared frontend runtime helpers may live here when they are reusable across apps.
- App-specific presentation code does not belong here.
- Cross-domain data contracts do not belong here; keep those in `packages/contracts`.

## Scope Guardrail

Do not turn this package into a generic `utils/` dump. Add exports here only when they represent a real shared frontend boundary.
