# syntax=docker/dockerfile:1

# =============================================================================
# infra/local-dev/Dockerfile
# Multi-stage build that compiles the cloud-resume-v2 static site and serves it
# with nginx for local end-to-end testing.
#
# Build context is the repository root (see docker-compose.yml `build.context`).
# =============================================================================

# ---- Stage 1: build the static artifact from the monorepo source ------------
FROM node:20-alpine AS build
WORKDIR /repo

# Copy only the workspace manifests first so the dependency install layer is
# cached until a package manifest or the lockfile actually changes.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/frontend-core/package.json packages/frontend-core/package.json
RUN npm ci

# Copy the rest of the workspace and produce the static build artifact.
COPY . .
RUN npm run build:packages && npm run build:web

# ---- Stage 2: serve the static artifact with nginx --------------------------
FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="cloud-resume-v2-web" \
      org.opencontainers.image.description="Local nginx host for the cloud-resume-v2 static site"

# Page-aware nginx config (multi-page static build, asset caching, /healthz).
COPY infra/local-dev/nginx/default.conf /etc/nginx/conf.d/default.conf

# Ship the compiled static site produced in the build stage.
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine already runs `nginx -g 'daemon off;'` as its default CMD.
