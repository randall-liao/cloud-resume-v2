# Services

`services/` is reserved for future backend and serverless application domains.

## Intended Contents

- visitor-counter API
- edge or lambda handlers
- backend orchestration code

## Ownership Rules

- Services may depend on shared packages and contracts.
- Services must not import from `apps/`.
- Infrastructure definitions belong in `infra/`, not here.
- Future `services/<domain>` directories are subtree candidates when they gain stable ownership and independent release cadence.

## Current State

Phase 1 creates this boundary as documentation only. No backend runtime is implemented yet.
