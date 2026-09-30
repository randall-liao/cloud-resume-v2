# Intent: Resume core and saved theme precedence

**Goal:** A visitor can read the resume and keep an explicit theme choice after
reload, even when the operating-system preference is opposite.

**Case ID:** `resume-core` (source filename without `.md`).
**Capture lifecycle:** For each of the two fresh sessions, open an empty browser;
start `tracing-start` and `video-start` before first navigation. Capture and inspect
every screenshot checkpoint below. Before switching sessions and on final cleanup
(including failures), attempt a failure screenshot if needed, `video-stop`,
`tracing-stop`, then close that session. Preserve both actual video paths and both
complete trace directories/resources without overwriting. Missing capture means
blocked evidence (retain any failed assertion), never an invented recording.

## Steps and expected behavior
1. Start a fresh isolated CLI session using the [runbook](../RUNBOOK.md), set
   the browser's OS color preference to light before opening `/`, and confirm
   the dashboard starts light. Expect a title containing `Cloud Architect
   Dashboard`, banner, main and footer regions.
2. Scroll to Side Projects, Commit History, Education, Certifications and
   Interests. Expect readable headings and section content. Capture
   `resume-sections.png` as a full-page screenshot; inspect scroll-revealed
   content rather than treating a full-page capture alone as proof of visibility.
3. Activate `Toggle theme`: expect a visibly dark page. Capture
   `selected-dark.png`. Reload without changing the light OS preference:
   expect dark to remain. Capture `reloaded-dark.png`.
4. Repeat in a separate fresh session with dark OS preference. The initial page
   must be dark; choose light using `Toggle theme`, reload, and expect light
   despite the dark OS preference. Capture `selected-light.png` and
   `reloaded-light.png`.
5. Do not activate social, project, certification or other external links.

## Evidence and result
Save evidence under `temp/e2e-evidence/live/<run>/resume-core/`. Record expected
versus observed theme before activation, after activation and after reload for
both OS preferences, section reachability, pass/fail/blocked, and screenshot
paths. Inspect screenshots for actual color changes, readable contrast and
missing sections. Never report a storage value alone as a visible-theme pass.

The planner runs `npm run qa:package -- temp/e2e-evidence/live/<run-id>` after
the summary, even if this case fails or has no operator result. Open
`temp/e2e-evidence/live/<run-id>/resume-core/index.html` directly, or use the
run's `index.html`. Keep the self-contained case folder with `result.json`,
`case.md`, screenshots, both videos and complete traces; missing artifacts are
listed as incomplete evidence on the review page.

Deterministic coverage: [resume.spec.ts](../../deterministic/resume.spec.ts)
(landmarks, sections and both saved-theme-over-opposite-OS reload cases).
