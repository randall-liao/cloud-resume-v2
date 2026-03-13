---
description: Recurring doc-gardening workflow — scan for stale documentation and open fix-up PRs
---

# Doc-Gardening Workflow

> **Purpose:** This workflow implements the "doc-gardening" pattern from the OpenAI agent-first engineering model. Run this on a regular cadence (weekly or after major feature work) to prevent documentation from becoming a "graveyard of stale rules."

---

## When to Run

- **Weekly:** Every Monday as a background task
- **After major refactors:** Any time architectural decisions change
- **After a Phase completes:** To update quality grades and close completed plans
- **When a lint or CI rule changes:** Update `docs/principles.md` enforcement status

---

## Steps

// turbo
1. **Check git status — understand what changed recently:**
   ```bash
   git log --oneline -20
   git diff HEAD~5 --name-only
   ```
   Identify which source files changed recently that might require documentation updates.

2. **Validate the docs map mechanically:**
   ```bash
   npm run docs:validate
   ```
   Fix broken links or missing required docs before doing anything else.

3. **Audit docs/ for stale content:** For each file in `docs/`, check if the content still matches reality.
   - Read `docs/architecture.md` — does the `src/` directory structure still match the domain map?
   - Read `docs/quality.md` — do the domain grades still reflect the actual state of the code?
   - Read `docs/principles.md` — do the listed enforcement mechanisms still match lint and CI?
   - Read `docs/plans/agent_gap_analysis.md` — have any P0/P1 items been resolved?

4. **Update quality grades:** If CI gates were added, tests were written, or debt was paid down, update `docs/quality.md` accordingly. Upgrade or downgrade grades to reflect current reality.

5. **Update principle enforcement status:** If a lint rule or CI gate was added, update `docs/principles.md` in the same pass.

6. **Check for undocumented patterns:** Scan `src/` for new utilities or patterns that don't appear in any doc file.
   ```bash
   # List all .ts/.tsx files not referenced in any doc
   find src -name "*.ts" -o -name "*.tsx" | while read f; do
     base=$(basename "$f")
     grep -rl "$base" docs/ > /dev/null || echo "UNDOCUMENTED: $f"
   done
   ```

7. **Commit and PR:** If any changes were made, commit following conventional commits format and open a PR:
   ```bash
   git add AGENTS.md AGENT.md docs/
   git commit -m "docs: doc-gardening pass — update quality grades and stale links"
   ```
   Then follow the `/lgtm-create-pr` workflow to push and open a PR.

---

## Quality Gates for This Workflow

This workflow is complete when:
- [ ] `npm run docs:validate` passes
- [ ] `docs/quality.md` last-updated date is current
- [ ] `docs/principles.md` enforcement still matches reality
- [ ] No execution plans in `docs/plans/` are marked active but relate to completed work
