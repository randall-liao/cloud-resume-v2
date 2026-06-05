# Apps

`apps/` contains deployable runtime applications.

## Current Contents

- `web/` — the active React/Vite frontend for `cloud-resume-v2`

## Ownership Rules

- Application-specific UI, routing model, and build configuration belong here.
- Apps may depend on `packages/`.
- Apps must not depend on `services/` or `infra/` as source imports.

## React Coding Standards

When writing, reviewing, or refactoring any React/TSX code in `apps/web` (components,
hooks, the App shell, the Spyfall intro, and their tests), follow the
**`vercel-react-best-practices`** agent skill — Vercel Engineering's React/Next.js
performance guidelines. Invoke that skill for the authoritative rule set; the highlights
that apply to this Vite SPA are:

- Hoist static data and static JSX out of component bodies so they are not recreated per
  render (`rendering-hoist-jsx`).
- Use functional `setState` updates when the next value depends on the previous one
  (`rerender-functional-setstate`).
- Split unrelated work across separate `useEffect`/`useMemo` hooks by dependency
  (`rerender-split-combined-hooks`), and derive values during render instead of syncing
  them in effects (`rerender-derived-state-no-effect`).
- Keep scroll/touch/wheel listeners `{ passive: true }` (`client-passive-event-listeners`).
- Prefer stable, data-derived `key`s over array indices for rendered lists.

This is a Vite SPA, not Next.js, so the skill's server-component, server-action, and
`next/dynamic`/`optimizePackageImports` rules do not apply. Do not switch `lucide-react`
to deep subpath imports — it ships no subpath types and breaks `strict` mode.

## Future Expansion

Add another app here only when it is a real deployable runtime with its own lifecycle.
