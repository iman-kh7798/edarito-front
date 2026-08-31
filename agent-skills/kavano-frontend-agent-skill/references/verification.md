# Verification and Handoff

Use this reference whenever code is changed.

## Verification ladder

Run checks in increasing scope, stopping to diagnose failures rather than piling on unrelated changes:

1. Focused tests for the moved slice or route.
2. Type checking and linting for touched code, when supported.
3. Unit and integration test projects.
4. Production build.
5. Critical browser flows affected by routing, auth, layouts, or API behavior.
6. Repository-wide validation command.

Compare failures against the recorded baseline. A green build does not prove behavior preservation; inspect changed routes, data flow, and public APIs.

## Architectural checks

- No imports point upward in the layer hierarchy.
- No same-layer slice imports remain, except an explicit narrow entity cross-reference when justified.
- Cross-slice consumers use public APIs.
- Same-slice modules do not import themselves through their barrel.
- `shared` contains no project-domain workflows.
- No new circular imports or duplicate canonical implementations were introduced.
- Alias configuration agrees across build, TypeScript, tests, and linting.

## Behavior checks

- Routes and deep links still resolve.
- Protected routes show intentional loading/error states.
- Login, current-user, refresh, retry, and logout behavior remain coherent.
- API base URLs and environment behavior work in supported deployments.
- Persisted keys and data shapes remain compatible or have an approved migration.
- Semantic HTML, labels, keyboard navigation, and focus behavior survived component moves.

## Repository checks

- `git diff --check` passes.
- Tracked text uses LF according to `.gitattributes`; Husky hooks and shell scripts are LF.
- Documentation references only existing scripts/files.
- No generated output, secrets, temporary reports, or unrelated formatting entered the diff.
- Dependencies added by the migration are used and justified.

## Handoff format

Report:

1. Outcome and exact scope completed.
2. Important structural decisions and why.
3. Preserved behavior and any intentional differences.
4. Commands run and their results, distinguishing baseline failures.
5. Remaining risks, temporary adapters, and the next safe batch.

Do not claim the whole migration is complete when only one batch was requested or verified.
