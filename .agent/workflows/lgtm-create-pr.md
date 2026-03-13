---
description: How to successfully wrap up a task, commit changes with best practices, create a PR, and end a conversation.
---

# End of Conversation / Pull Request Workflow

When a task is complete and the user is ready to end the conversation, ensure the following steps are executed to safely persist changes, verify integrity, draft high-quality commit/PR messages based on context, and hand off the work properly.

## Steps

// turbo
1. **Verify No Outstanding Uncommitted Changes:** Check the current git status to see if any work was left unstaged.
   ```bash
   git status --short
   ```

2. **Stage only relevant files and commit work:** If `git status` shows uncommitted files relevant to the conversation, first *draft a high-quality commit message* strictly following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (e.g., `feat:`, `fix:`, `chore:`, `refactor:`). Stage only the files that belong to the current task rather than blindly using `git add .`.
   ```bash
   git add <relevant-files>
   git commit -m "type: descriptive message based on context"
   ```

3. **Run the validation stack:** Ensure the final changes did not break the docs map, lint, build, or static artifact contract.
   ```bash
   npm run validate
   ```

// turbo-all
4. **Push Changes to Remote:**
   ```bash
   git push
   ```

5. **Draft Pull Request Content & Create PR:** Based on the context of what was accomplished in this entire conversation, write a professional Pull Request title and body. The body should follow industry best practices (including a brief summary, description of changes, and any relevant details or testing instructions).
   Create the PR with the CLI:
   ```bash
   gh pr create --title "<Generated Title>" --body "<Generated Body>"
   ```

6. **Stop only the processes you started for this task:** Do not blanket-kill unrelated dev servers in the worktree. Terminate only the specific process IDs or sessions created during the conversation.

7. **Provide Final Summary:**
   - Briefly summarize the goals achieved during the conversation.
   - List the files that were primarily modified.
   - Provide a link to the Pull Request that was just created.
   - Sign off and ask if there is absolutely anything else before closing.
