# Packages

`packages/` contains shared code consumed by apps and future platform domains.

## Intended Contents

- typed content adapters
- shared frontend utilities
- reusable UI primitives
- shared contracts under `packages/contracts/`

## Ownership Rules

- Packages should be stable dependency boundaries, not dumps for random helpers.
- Packages may be imported by `apps/` and future `services/`.
- Packages must not import from `apps/`.
- `packages/contracts` and `packages/frontend-core` are subtree candidates because they have clear ownership and standalone lifecycle potential.

## Current State

This boundary is active. `packages/contracts` and `packages/frontend-core` are real workspace packages, and future shared packages should follow the same explicit-boundary model.
