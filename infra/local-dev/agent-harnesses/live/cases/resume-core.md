# Intent: Resume core experience

**Goal:** A visitor lands on the resume dashboard and can read the headline
content and switch themes.

## Steps
1. Navigate to `/`.
2. Confirm the page title contains "Cloud Architect Dashboard".
3. Confirm a banner (header) region and a contentinfo (footer) region exist.
4. Confirm the major section headings are present: Side Projects, Commit
   History, Education, Certifications, Interests.
5. Activate the "Toggle theme" control and confirm the colour scheme flips
   (light ⇄ dark) and the change is reflected on reload.

## Pass criteria
All headings are reachable via their accessible role/name and the theme toggle
visibly changes the page and persists.

> Durable expectations discovered here belong in
> [`../../deterministic/resume.spec.ts`](../../deterministic/resume.spec.ts).
