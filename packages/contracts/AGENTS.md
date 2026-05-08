# Contracts Package

`packages/contracts` is now the shared typed contract boundary for frontend content and future cross-domain schemas.

## Current Contents

- `src/resume.json` - canonical resume content source
- `src/resume.ts` - typed parse-at-the-boundary adapter
- `src/index.ts` - public package entrypoint

## Ownership Rules

- Shared document shapes and reusable schemas belong here.
- Browser-only runtime helpers do not belong here.
- `apps/` and future `services/` code may consume this package, but the package must not depend on application code.

## Scope Guardrail

Do not put service logic, DOM helpers, or UI-specific presentation code here. This package is for shared contracts and validated content boundaries.
