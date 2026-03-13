# Integrations

This repo still has very few live integrations. Most "cloud" references in the UI are presentational or deployment-oriented rather than active runtime calls.

## Live Integrations

| Integration | Type | Evidence | Current behavior |
| --- | --- | --- | --- |
| Google Fonts | External CDN | [apps/web/index.html](../../apps/web/index.html), [apps/web/tailwind.config.js](../../apps/web/tailwind.config.js), [apps/web/src/index.css](../../apps/web/src/index.css) | Loads Inter and Fira Code from `fonts.googleapis.com` and `fonts.gstatic.com`. |
| Google Material Icons and Material Symbols | External CDN | [apps/web/index.html](../../apps/web/index.html), [apps/web/src/components/Header.tsx](../../apps/web/src/components/Header.tsx), [apps/web/src/components/Footer.tsx](../../apps/web/src/components/Footer.tsx) | Icon fonts are loaded from Google and used through `material-icons` and `material-symbols-outlined` class names. |
| Font Awesome | External CDN | [apps/web/index.html](../../apps/web/index.html), [apps/web/src/components/Header.tsx](../../apps/web/src/components/Header.tsx), [apps/web/src/components/Certifications.tsx](../../apps/web/src/components/Certifications.tsx), [apps/web/src/components/Footer.tsx](../../apps/web/src/components/Footer.tsx) | Social icons, the AWS badge icon, and the React footer icon depend on the CDN stylesheet from `cdnjs.cloudflare.com`. |
| Browser `localStorage` | Browser platform API | [packages/frontend-core/src/themeManager.ts](../../packages/frontend-core/src/themeManager.ts), [apps/web/src/App.tsx](../../apps/web/src/App.tsx) | Persists the theme preference under `theme-preference`. |
| Browser `matchMedia` | Browser platform API | [packages/frontend-core/src/themeManager.ts](../../packages/frontend-core/src/themeManager.ts) | Falls back to `prefers-color-scheme: dark` when no stored preference exists. |
| Browser DOM and scroll events | Browser platform API | [packages/frontend-core/src/themeManager.ts](../../packages/frontend-core/src/themeManager.ts), [apps/web/src/App.tsx](../../apps/web/src/App.tsx), [apps/web/src/components/Footer.tsx](../../apps/web/src/components/Footer.tsx) | The app writes `document.title`, toggles the root `dark` class, and shows or hides the footer based on window scroll position. |
| Outbound profile and credential links | External websites | [packages/contracts/src/resume.json](../../packages/contracts/src/resume.json), [apps/web/src/components/Header.tsx](../../apps/web/src/components/Header.tsx), [apps/web/src/components/Hero.tsx](../../apps/web/src/components/Hero.tsx), [apps/web/src/components/Certifications.tsx](../../apps/web/src/components/Certifications.tsx) | The UI links out to GitHub, LinkedIn, and Credly using URLs stored in the shared contracts package. |

## Deployment And Tooling Integrations

| Integration | Type | Evidence | Current behavior |
| --- | --- | --- | --- |
| AWS S3 + CloudFront | Deployment target | [docs/architecture.md](../../docs/architecture.md), [README.md](../../README.md), [scripts/validate-dist.sh](../../scripts/validate-dist.sh) | The app is built as static assets intended for S3 hosting behind CloudFront. |
| Stitch MCP | Agent-only developer tooling | [.agent/mcp.json](../../.agent/mcp.json) | Repo-local MCP config can launch the Stitch proxy through `npx`. This is not part of the app runtime or build path. |
| Docs validation | Local Node script | [scripts/validate-docs.mjs](../../scripts/validate-docs.mjs), [package.json](../../package.json) | Markdown structure and link integrity are treated as a repo integration gate. |

## Planned But Not Live

| Item | Evidence | Actual state today |
| --- | --- | --- |
| Visitor counter API | [.env.example](../../.env.example), [docs/architecture.md](../../docs/architecture.md), [docs/quality_standards.md](../../docs/quality_standards.md), [docs/plans/agent_gap_analysis.md](../../docs/plans/agent_gap_analysis.md) | Planned only. There is no `fetch`, no `import.meta.env` usage in app code, and no live counter request. |
| DynamoDB-backed visitor count UI copy | [apps/web/src/components/Footer.tsx](../../apps/web/src/components/Footer.tsx) | The tooltip says "DynamoDB Live Count", but the number is hardcoded to `843`. Treat this as placeholder UI, not a real AWS integration. |

## Explicit Non-Integrations

- No analytics SDK
- No authentication provider
- No payment provider
- No error-reporting SDK
- No REST or GraphQL client
- No WebSocket, SSE, or polling
- No environment-driven runtime config in the shipped app today

## Refactor Notes

- The only live network dependencies in the browser are CDN-hosted fonts and icon styles plus outbound links opened by anchor tags.
- Because the app still does not call a backend, there is no current API contract to preserve yet.
- If the planned visitor counter is added later, it should be documented as a new integration boundary rather than inferred from placeholder UI copy.
