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

The cloud IaC boundary (AWS provisioning, deployment stacks) is still documentation only.

The first concrete implementation here is the local-development host, [`local-dev/`](./local-dev/AGENTS.md): a Docker + nginx module that builds and serves the static site for local end-to-end testing. The repository-root `docker-compose.yml` `include:`s it, so `docker compose up --build` brings the project up locally in one command.
