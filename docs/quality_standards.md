# Quality Standards

This file describes what good code looks like in `cloud-resume-v2`. For the mechanically enforced subset, see [principles.md](principles.md).

## 1. TypeScript and React

- TypeScript `strict` mode is required.
- Avoid `any`.
- Give component props explicit interfaces when a component accepts props.
- Keep state local with standard React hooks.
- Keep `useEffect` dependency arrays complete.
- Do not introduce `dangerouslySetInnerHTML`.
- When writing or refactoring React/TSX (source and tests), follow the
  **`vercel-react-best-practices`** agent skill for performance patterns (hoisting static
  JSX/data, functional `setState`, splitting unrelated hooks, deriving state during render,
  passive listeners, stable list keys). See [apps/AGENTS.md](../apps/AGENTS.md) for the
  Vite-SPA-specific scope of that skill.

## 2. Component Structure

- UI components live in `apps/web/src/components/` and mandatory component tests reside in `apps/web/tests/components/`.
- The standalone "Spyfall Arena" intro is a separate static entry, not a resume section. Its component and page CSS live in `apps/web/src/spyfall/` with tests in `apps/web/tests/spyfall/`, kept apart from the resume component tree on purpose.
- `apps/web/src/App.tsx` is the layout shell and theme owner, not a data-validation layer.
- Shared resume content comes from `@cloud-resume-v2/contracts`.
- Shared browser-facing theme behavior comes from `@cloud-resume-v2/frontend-core`.
- If a component grows materially beyond its current responsibility, split out subcomponents instead of adding more branching to the file.

## 3. Styling

- Tailwind utilities are the default styling layer.
- `apps/web/src/index.css` is reserved for global styles, tokens, and shared custom layers.
- A secondary static entry may own its own page-scoped global stylesheet imported from that entry's `main.tsx` (for example, `apps/web/src/spyfall/spyfall.css`). Keep such styles isolated to their entry rather than leaking into `index.css`.
- The `style` prop is allowed only for computed values that are awkward to express in Tailwind.
- MUI layout primitives and the `sx` prop are not allowed.
- Keep the visual system aligned with [DESIGN.md](../DESIGN.md).

## 4. Data and Side Effects

- Resume content should live in `packages/contracts/src/resume.json` and be consumed through `@cloud-resume-v2/contracts`.
- Shared browser-facing theme persistence should live in `packages/frontend-core`, not in `apps/web` leaf utilities.
- The current footer visitor count is static placeholder UI. Do not document it as live API behavior.
- When API integration is added, source browser-safe endpoints from `import.meta.env.VITE_*`, parse at the boundary, and wrap non-critical calls in `try/catch`.

## 5. Repository Rules

- **Agent-First Documentation**: There must be exactly one `README.md` file in the entire repository, located at the root. Subdirectories must use `AGENTS.md`.
- **Documentation Completeness**: The root `AGENTS.md` must link to all subdomain `AGENTS.md` files, and no `.md` files should be orphaned (unlinked).
- Start from [AGENTS.md](../AGENTS.md), not ad hoc repo exploration.
- Keep root scripts workspace-aware. The active app currently lives in `apps/web`.
- Keep plans in `docs/plans/` when work is large enough to need explicit tracking.
- Update docs in the same PR when structure, constraints, or quality grades change.

## 6. Current Validation Gates

| Command | Purpose |
| --- | --- |
| `npm run docs:validate` | Validates `AGENTS.md`, core docs, and markdown links |
| `python3 scripts/lint_agents.py` | Enforces the Agent-First boundaries (Root README, AGENTS map completeness, no dead or orphaned links) |
| `npm run lint` | Enforces TypeScript and architectural lint rules for the active web workspace |
| `npm run build:packages` | Type-checks the shared workspace packages explicitly |
| `npm run build:web` | Type-checks and builds the active web workspace |
| `npm run build` | Runs the package builds plus the web-app build from the repo root |
| `npm run test` | Runs the web-app smoke suite from the repo root |
| `bash scripts/validate-dist.sh apps/web/dist` | Validates the built artifact for S3/CloudFront deployment |
| `npm run validate` | Runs the full local validation stack |

## 7. Remaining Enhancements

See [plans/agent_gap_analysis.md](plans/agent_gap_analysis.md) for the backlog. The main remaining quality gaps are:

- narrow test coverage on the Spyfall Arena intro page (GSAP is mocked, so timelines are not exercised)
- no live visitor-counter integration
- partially generic imported skills under `.agent/skills/`

## 8. Review Checklist

- [ ] No new `any` types
- [ ] No routing or global state dependencies
- [ ] No MUI layout imports or `sx` prop
- [ ] Shared content and theme changes route through package boundaries, not app-local leaf files
- [ ] New or updated tests are added/written for any modified code or new components
- [ ] All unit/smoke tests run and pass successfully (`npm run test`)
- [ ] Docs updated if repo structure or constraints changed
- [ ] Agent-First bounds maintained (Subdirectory `README.md`s renamed to `AGENTS.md`, properly linked in root `AGENTS.md`, no orphaned markdown files)
- [ ] `npm run validate` passes locally

For a repo-shaped review prompt, use [`.agent/skills/code_review/SKILL.md`](../.agent/skills/code_review/SKILL.md).
