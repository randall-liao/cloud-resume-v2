# Intent: Routing and fallback behaviour

**Goal:** nginx serves the multi-page build and falls back correctly, matching
`infra/local-dev/nginx/default.conf`.

## Steps
1. Request `/healthz` and confirm it returns `ok`.
2. Navigate to a non-existent path (e.g. `/nope`) and confirm the resume entry
   point loads (HTTP 200, "Cloud Architect Dashboard" title) rather than a 404.
3. Navigate directly to `/spyfall-arena.html` and confirm it resolves as a real
   file, not the fallback.

## Pass criteria
Health endpoint responds, unknown paths fall back to the resume SPA, and the
Spyfall page resolves directly.

> Durable expectations discovered here belong in
> [`../../deterministic/healthz.spec.ts`](../../deterministic/healthz.spec.ts).
