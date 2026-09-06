# Git Flow

This template is designed for GitLab merge requests and Conventional Commits.

## Branches

`main`
: Production-ready code. Protect this branch in GitLab.

`develop`
: Integration branch for the next release when the team wants a long-running staging branch.

`feature/<short-name>`
: New product work.

`fix/<short-name>`
: Bug fixes.

`chore/<short-name>`
: Tooling, docs, maintenance, or dependency work.

`hotfix/<short-name>`
: Urgent production fixes branched from `main`.

## Commit Messages

Commits are validated with Commitlint and should follow Conventional Commits:

```text
type(scope): subject
```

Examples:

```text
feat(auth): retry requests after token refresh
fix(api): clear token when refresh fails
docs(git): describe merge request workflow
chore(ci): add gitlab pipeline
```

Common types:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `build`
- `ci`
- `chore`
- `revert`

## Local Checks

Husky runs:

- `pre-commit`: `lint-staged`
- `commit-msg`: `commitlint`
- `pre-push`: `npm run validate`

Run the full check manually with:

```bash
npm run validate
```

## Merge Request Rules

Start from `.gitlab/merge_request_templates/Default.md`. It asks for scope, verification, security impact, review notes, and UI evidence without duplicating the pipeline.

Before opening a merge request:

1. Rebase or merge the target branch into your branch.
2. Run `npm run validate`.
3. Keep the merge request focused on one product or maintenance goal.
4. Include screenshots for UI changes.
5. Mention API contract changes clearly.

Recommended GitLab settings:

- Protect `main` and `develop`.
- Require a passing pipeline before merge.
- Require at least one approval.
- Squash commits when the branch history is noisy.
- Delete source branches after merge.
