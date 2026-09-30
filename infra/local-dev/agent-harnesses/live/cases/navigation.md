# Intent: Routing and page identity

**Goal:** The nginx host serves the real multi-page build, with a working resume
fallback rather than an empty shell or the wrong page.

**Case ID:** `navigation` (source filename without `.md`).
**Capture lifecycle:** Open an empty session; start `tracing-start` and
`video-start` before first navigation, including the health endpoint if visited.
Capture and inspect every screenshot checkpoint below. On success or failure,
attempt a failure screenshot if needed, `video-stop`, `tracing-stop`, then close
the session; preserve actual saved video paths and the entire trace directory/
resources. Missing capture means blocked evidence (retain any failed assertion),
never an invented recording.

## Steps and expected behavior
1. Start a fresh isolated CLI session against the local nginx base URL from the
   [runbook](../RUNBOOK.md). Request `/healthz`: expect HTTP 200 and body `ok`.
2. Open `/this-path-does-not-exist`: expect HTTP 200, a title containing
   `Cloud Architect Dashboard`, the `Side Projects` heading and `Toggle theme`
   button. Activate the button: the theme must change, proving the fallback is
   usable. Capture `fallback-resume.png`.
3. Open `/spyfall-arena.html`: expect the `Spyfall Arena` title, heading
   `The Lie Problem`, `Next step` button and `Back to resume` link. Capture
   `standalone-spyfall.png`; it must not resemble the resume fallback.
4. Follow only the internal `Back to resume` link. Expect `/`, the dashboard
   title, `Side Projects`, and `Toggle theme`, with no `Next step` control.
   Capture `returned-resume.png`. Do not activate any external links.

## Evidence and result
Save evidence under `temp/e2e-evidence/live/<run>/navigation/`. For each step,
report expected versus observed status, URL, visible content and behavior, plus
pass/fail/blocked and screenshot paths. Inspect screenshots for genuine page
identity and missing content; do not infer a pass from titles alone.

The planner runs `npm run qa:package -- temp/e2e-evidence/live/<run-id>` after
the summary, even if this case fails or has no operator result. Open
`temp/e2e-evidence/live/<run-id>/navigation/index.html` directly, or use the
run's `index.html`. Keep the self-contained case folder with `result.json`,
`case.md`, screenshots, video and complete traces; missing artifacts are listed
as incomplete evidence on the review page.

Deterministic coverage: [healthz.spec.ts](../../deterministic/healthz.spec.ts)
(fallback identity and working theme) and
[spyfall.spec.ts](../../deterministic/spyfall.spec.ts) (standalone identity and
internal return navigation).
