# Apps

`apps/` contains deployable runtime applications.

## Current Contents

- `web/` — the active React/Vite frontend for `cloud-resume-v2`

## Ownership Rules

- Application-specific UI, routing model, and build configuration belong here.
- Apps may depend on `packages/`.
- Apps must not depend on `services/` or `infra/` as source imports.

## Future Expansion

Add another app here only when it is a real deployable runtime with its own lifecycle.
