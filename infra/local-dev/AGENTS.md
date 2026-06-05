# Local Dev Module

`infra/local-dev/` is the reusable local-development host for `cloud-resume-v2`.
It builds the static site and serves it with **nginx** inside Docker so the
project can be exercised end-to-end before any cloud deployment.

## Contents

- `Dockerfile` — multi-stage build: a `node:20-alpine` stage compiles the
  monorepo static artifact (`apps/web/dist`), and an `nginx:1.27-alpine` stage
  serves it. The build context is the repository root.
- `Dockerfile.dockerignore` — keeps the repo-root build context small and free
  of `node_modules`, build output, and any `.env`/credentials.
- `nginx/default.conf` — serves the Vite multi-page build (`index.html` and
  `spyfall-arena.html`), long-caches `/assets/`, exposes `/healthz`, and falls
  back to the resume entry for unknown paths.
- `docker-compose.yml` — defines the `web` service. This is the unit other
  modules reuse.
- `agent-harnesses/` — browser-level **end-to-end harness** that runs against
  the nginx-served build (deterministic Playwright specs + an on-demand
  Playwright MCP live tier). It consumes this module; it does not change how the
  site is built or served. See
  [`agent-harnesses/AGENTS.md`](./agent-harnesses/AGENTS.md).

## Usage

One command from the repository root brings up every service (the root
`docker-compose.yml` `include:`s this module):

```bash
docker compose up --build
```

The site is then available at <http://localhost:8080> (and the standalone intro
at <http://localhost:8080/spyfall-arena.html>). Override the published port with
`WEB_PORT`, e.g. `WEB_PORT=3000 docker compose up --build`.

Run this module on its own without the root entry point:

```bash
docker compose -f infra/local-dev/docker-compose.yml up --build
```

## Ownership Rules

- This is infrastructure: it may reference deployable apps and services
  conceptually, but application source must not import from here.
- It builds `apps/web` from source; it does not duplicate application logic.
- New runtime domains (e.g. `services/visitor-counter`) plug in by adding their
  own compose file to the root `docker-compose.yml` `include:` list, so the
  single-command workflow keeps working.

## Maintenance Notes

- The dependency-install layer copies the known workspace manifests
  (`apps/web`, `packages/contracts`, `packages/frontend-core`). When a new
  workspace package is added, add its `package.json` to the `COPY` list in the
  `Dockerfile`.
- This module is not an npm workspace package (it has no `package.json`), so it
  is ignored by `npm`/`turbo` builds.
