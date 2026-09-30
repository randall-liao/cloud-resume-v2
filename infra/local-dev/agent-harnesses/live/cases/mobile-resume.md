# Intent: Mobile resume reachability

**Goal:** At a 375 × 812 CSS-pixel viewport, visitors can read the resume and
operate the fixed header theme control without horizontal page scrolling.

**Case ID:** `mobile-resume` (source filename without `.md`).
**Capture lifecycle:** Open an empty session; start `tracing-start` and
`video-start` before first navigation. Capture and inspect every screenshot
checkpoint below. On success or failure, attempt a failure screenshot if needed,
`video-stop`, `tracing-stop`, then close the session; preserve actual saved video
paths and the entire trace directory/resources. Missing capture means blocked
evidence (retain any failed assertion), never an invented recording.

## Steps and expected behavior
1. Start a fresh isolated CLI session using the [runbook](../RUNBOOK.md), set
   the viewport to 375 × 812 and the OS color preference to light, then open `/`.
   Expect readable header and introductory content, with `Toggle theme` fully
   inside the viewport. Capture `mobile-top-light.png`.
2. Activate `Toggle theme`. Expect dark mode with no clipped or overlapping
   header controls. Capture `mobile-top-dark.png`.
3. Scroll vertically to Side Projects, Commit History, Education,
   Certifications and Interests. Expect each heading and its content to be
   readable and reachable, with no horizontal page overflow. Capture a viewport
   screenshot for each section. A local code pane may scroll horizontally;
   that must not widen the document or push headings off-screen.
4. Scroll to the actual bottom of the document (for example, Control+End), not
   to the fixed footer element. The footer is intentionally hidden mid-page.
   Expect it to become visible at the bottom, with the fixed `Toggle theme`
   control still reachable. Activate the control again: expect light mode.
   Capture `mobile-footer-light.png`.
5. Do not activate social, project, certification or other external links.

## Evidence and result
Save evidence under `temp/e2e-evidence/live/<run>/mobile-resume/`. Record
expected versus observed viewport dimensions, section/control reachability,
page scroll width versus client width, theme transitions and pass/fail/blocked,
with screenshot paths. Inspect images for text clipping, fixed-header overlap,
unreadable content and horizontal page scrolling; a passing width measurement
alone does not prove usable layout.

The planner runs `npm run qa:package -- temp/e2e-evidence/live/<run-id>` after
the summary, even if this case fails or has no operator result. Open
`temp/e2e-evidence/live/<run-id>/mobile-resume/index.html` directly, or use the
run's `index.html`. Keep the self-contained case folder with `result.json`,
`case.md`, screenshots, video and complete traces; missing artifacts are listed
as incomplete evidence on the review page.

Deterministic coverage: [resume.spec.ts](../../deterministic/resume.spec.ts)
(`keeps resume sections and theme control reachable without mobile page overflow`).
Screenshots use existing evidence capture; no visual golden baselines are added.
