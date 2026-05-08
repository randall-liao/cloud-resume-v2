# Infrastructure

`infra/` is reserved for future infrastructure-as-code and deployment definitions.

## Intended Contents

- AWS provisioning code
- deployment stacks and policies
- environment-specific infrastructure modules

## Ownership Rules

- `infra/` may reference deployable applications and services conceptually, but application source code should not import infrastructure code.
- Keep runtime logic in `apps/` or `services/`; keep provisioning logic here.
- Future `infra/<domain>` directories are subtree candidates when the infrastructure domain has stable ownership and a separate operational lifecycle.

## Current State

Phase 1 creates this boundary as documentation only. No IaC implementation is included yet.
