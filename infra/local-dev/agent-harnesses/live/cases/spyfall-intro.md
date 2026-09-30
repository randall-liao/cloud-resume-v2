# Intent: Spyfall interactive storyboard

**Goal:** The standalone Spyfall intro shows its own content and responds to
its step controls. This is button-driven, not a scroll-to-advance flow.

**Case ID:** `spyfall-intro` (source filename without `.md`).
**Capture lifecycle:** Open an empty session; start `tracing-start` and
`video-start` before first navigation. Capture and inspect every screenshot
checkpoint below. On success or failure, attempt a failure screenshot if needed,
`video-stop`, `tracing-stop`, then close the session; preserve actual saved video
paths and the entire trace directory/resources. Missing capture means blocked
evidence (retain any failed assertion), never an invented recording.

## Steps and expected behavior
1. Start a fresh isolated CLI session using the [runbook](../RUNBOOK.md) and
   open `/spyfall-arena.html`. Expect a title containing `Spyfall Arena`, the
   `The Lie Problem` heading, and `Next step` control. Capture `intro.png`.
2. Activate `Next step`. Expect `One Card Is Blind`, with readable rules that
   civilians know the secret location while the spy receives no location.
   Capture `rules.png` after the visual transition settles.
3. Activate `Previous Step`. Expect `The Lie Problem` again and no previous
   control on the first step. Capture `returned-intro.png`.
4. Inspect the console for errors and screenshots for blank, clipped or
   overlapping story content. Do not activate GitHub or other external links.

## Evidence and result
Save evidence under `temp/e2e-evidence/live/<run>/spyfall-intro/`. Record each
action's expected versus observed heading, rules and available controls,
pass/fail/blocked, console errors, and screenshot paths. A mounted React root
or correct title without usable story content does not pass.

The planner runs `npm run qa:package -- temp/e2e-evidence/live/<run-id>` after
the summary, even if this case fails or has no operator result. Open
`temp/e2e-evidence/live/<run-id>/spyfall-intro/index.html` directly, or use the
run's `index.html`. Keep the self-contained case folder with `result.json`,
`case.md`, screenshots, video and complete traces; missing artifacts are listed
as incomplete evidence on the review page.

Deterministic coverage: [spyfall.spec.ts](../../deterministic/spyfall.spec.ts)
(page identity and forward/backward storyboard transitions).
