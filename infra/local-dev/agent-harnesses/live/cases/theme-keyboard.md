# Intent: Keyboard-operated theme control

**Goal:** A keyboard visitor can reach and activate the native theme button
without losing focus or navigating away.

**Case ID:** `theme-keyboard` (source filename without `.md`).
**Capture lifecycle:** Open an empty session; start `tracing-start` and
`video-start` before first navigation. Capture and inspect every screenshot
checkpoint below. On success or failure, attempt a failure screenshot if needed,
`video-stop`, `tracing-stop`, then close the session; preserve actual saved video
paths and the entire trace directory/resources. Missing capture means blocked
evidence (retain any failed assertion), never an invented recording.

## Steps and expected behavior
1. Start a fresh isolated CLI session using the [runbook](../RUNBOOK.md), set
   the OS color preference to light before opening `/`, and expect light mode.
2. Use Tab to reach the `Toggle theme` button without clicking it. Social links
   may receive focus first; never activate those external links. Expect the
   button to be visibly identifiable as focused. Capture `focused-toggle.png`.
3. Press Enter. Expect dark mode, the same URL and focus still on `Toggle theme`.
   Capture `enter-dark.png` and inspect contrast and focus visibility.
4. Press Space. Expect light mode and focus still on the button; Space must
   activate the control rather than scroll the document. Capture `space-light.png`.
5. Reload. Expect the selected light theme to remain. Capture `reloaded-light.png`.

## Evidence and result
Save evidence under `temp/e2e-evidence/live/<run>/theme-keyboard/`. Record
expected versus observed focus target, visible theme, URL and scroll behavior
for each action, pass/fail/blocked, and screenshot paths. Report invisible focus
or an unreachable control as a failure even if scripted focus can activate it.
Do not navigate to external links.

The planner runs `npm run qa:package -- temp/e2e-evidence/live/<run-id>` after
the summary, even if this case fails or has no operator result. Open
`temp/e2e-evidence/live/<run-id>/theme-keyboard/index.html` directly, or use the
run's `index.html`. Keep the self-contained case folder with `result.json`,
`case.md`, screenshots, video and complete traces; missing artifacts are listed
as incomplete evidence on the review page.

Deterministic coverage: [resume.spec.ts](../../deterministic/resume.spec.ts)
(`activates the theme control with Enter and Space while retaining focus`).
The live case additionally inspects Tab reachability and visible focus styling.
